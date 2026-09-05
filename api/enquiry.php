<?php
declare(strict_types=1);

const MANUL_RECIPIENT = 'hello@manul.studio';
const MANUL_ALLOWED_HOSTS = ['manul.studio', 'www.manul.studio'];

function wants_json(): bool
{
    return str_contains(strtolower($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');
}

function respond(int $status, bool $ok, string $message): never
{
    http_response_code($status);
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store, max-age=0');

    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    $state = $ok ? 'sent' : 'error';
    header('Location: /contact/?status=' . $state . '#enquiry', true, 303);
    exit;
}

function field(string $name, int $maxLength): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = trim(str_replace("\0", '', $value));
    if (!preg_match('//u', $value)) {
        return '';
    }
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function origin_is_allowed(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return true;
    }
    $host = strtolower((string) parse_url($origin, PHP_URL_HOST));
    return in_array($host, MANUL_ALLOWED_HOSTS, true);
}

function rate_limit_passes(): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = hash('sha256', $ip . '|manul-enquiry-v1');
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'manul-enquiry-' . $key;
    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        return true;
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return true;
    }
    $previous = (int) stream_get_contents($handle);
    $now = time();
    $allowed = $previous === 0 || ($now - $previous) >= 45;
    if ($allowed) {
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, (string) $now);
        fflush($handle);
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

if (!origin_is_allowed()) {
    respond(403, false, 'Request origin is not allowed.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 32768) {
    respond(413, false, 'The enquiry is too large.');
}

// Honeypot fields are treated as successful so simple bots receive no signal.
if (field('website_url', 200) !== '') {
    respond(200, true, 'Thank you.');
}

if (!rate_limit_passes()) {
    respond(429, false, 'Please wait before sending another enquiry.');
}

$name = field('name', 100);
$email = field('email', 254);
$company = field('company', 180);
$country = field('country', 100);
$service = field('service', 40);
$budget = field('budget', 40);
$message = field('message', 4000);
$messenger = field('messenger', 180);
$source = str_replace(["\r", "\n"], ' ', field('source', 1000));
$consent = field('consent', 10);
$startedAt = (int) field('form_started_at', 20);

$services = [
    'new_site' => 'New website',
    'redesign' => 'Website redesign',
    'seo' => 'SEO / organic growth',
    'dental_seo' => 'Dental SEO',
    'web_design_seo' => 'Web design + SEO',
    'ads' => 'Paid acquisition',
    'support' => 'Ongoing support',
    'other' => 'Other',
];
$budgets = [
    'not_sure' => 'Not sure yet',
    '7500_15000' => '$7,500–15,000',
    '15000_30000' => '$15,000–30,000',
    '30000_60000' => '$30,000–60,000',
    '60000_plus' => '$60,000+',
];
// Generated from the existing form options; validation remains an exact allowlist.
$budgets = array_merge($budgets, require __DIR__ . '/enquiry-budgets.php');

$startedSeconds = $startedAt > 100000000000 ? (int) floor($startedAt / 1000) : $startedAt;
$age = $startedSeconds > 0 ? time() - $startedSeconds : null;
$validTiming = $age === null || ($age >= 2 && $age <= 43200);

if (
    text_length($name) < 2 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    text_length($country) < 2 ||
    !array_key_exists($service, $services) ||
    !array_key_exists($budget, $budgets) ||
    text_length($message) < 40 ||
    $consent !== 'yes' ||
    !$validTiming
) {
    respond(422, false, 'Please check the required fields and try again.');
}

$cleanEmail = str_replace(["\r", "\n"], '', $email);
$subjectCountry = str_replace(["\r", "\n"], ' ', $country);
$subjectText = 'New Manul enquiry — ' . $services[$service] . ' — ' . $subjectCountry;
$subject = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($subjectText, 'UTF-8', 'B', "\r\n")
    : '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$body = implode("\n", [
    'New enquiry from manul.studio',
    'Source: ' . $source,
    '',
    'Name: ' . $name,
    'Email: ' . $cleanEmail,
    'Company / website: ' . ($company !== '' ? $company : '—'),
    'Country / target market: ' . $country,
    'Service: ' . $services[$service],
    'Approximate budget: ' . $budgets[$budget],
    'WhatsApp / Telegram: ' . ($messenger !== '' ? $messenger : '—'),
    '',
    'Project details:',
    $message,
    '',
    'Consent: confirmed in the website form',
    'Submitted (UTC): ' . gmdate('Y-m-d H:i:s'),
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
]);

$headers = [
    'From: Manul website <hello@manul.studio>',
    'Reply-To: ' . $cleanEmail,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Manul enquiry form',
];

$sent = @mail(MANUL_RECIPIENT, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    error_log('Manul enquiry form: mail() returned false.');
    respond(503, false, 'The enquiry could not be sent. Please email hello@manul.studio.');
}

respond(200, true, 'Thank you. Your enquiry has been sent.');
