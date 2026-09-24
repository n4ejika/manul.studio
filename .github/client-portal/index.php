<?php
// All report data and password hashes live outside the document root.
ini_set('display_errors', '0');
header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');
header('Cache-Control: no-store, private, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
function deny_access() { header('WWW-Authenticate: Basic realm="MANUL client portal", charset="UTF-8"'); http_response_code(401); echo 'Authentication required'; exit; }
$user = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : '';
$pass = isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : '';
if ($user === '') {
 $auth = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '');
 if (preg_match('/^Basic ([A-Za-z0-9+\/=]+)$/', $auth, $m)) { $decoded = base64_decode($m[1], true); if ($decoded !== false) { $parts = explode(':', $decoded, 2); $user = $parts[0]; $pass = isset($parts[1]) ? $parts[1] : ''; } }
}
if ($user !== 'prokatmaxim' || $pass === '' || strlen($pass) > 512) deny_access();
$entry = @file_get_contents('/home/i54914/.client-access/prokatmaxim.htpasswd');
if ($entry === false) { http_response_code(503); echo 'Client access temporarily unavailable'; exit; }
$parts = explode(':', trim($entry), 2);
if (count($parts) !== 2 || !hash_equals('prokatmaxim', $parts[0]) || !password_verify($pass, $parts[1])) deny_access();
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method !== 'GET' && $method !== 'HEAD') { header('Allow: GET, HEAD'); http_response_code(405); exit; }
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$prefix = '/clients/prokatmaxim/';
if (strpos($path, $prefix) !== 0) { http_response_code(404); exit; }
$name = substr($path, strlen($prefix));
if ($name === '' || $name === 'index.php') $name = 'index.html';
if (!preg_match('~^(index\.html|report\.html|report\.json|captures/[a-z0-9-]+\.json)$~D', $name)) { http_response_code(404); exit; }
$root = '/home/i54914/.client-reports/prokatmaxim/';
$file = realpath($root . $name);
if ($file === false || strpos($file, $root) !== 0 || !is_file($file)) { http_response_code(404); exit; }
header('Content-Type: ' . (substr($name, -5) === '.json' ? 'application/json' : 'text/html') . '; charset=utf-8');
header('Content-Length: ' . filesize($file));
if ($method === 'GET') readfile($file);
