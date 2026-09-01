import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function collectHtml(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", ".github", "scripts"].includes(entry.name)) continue;
    const full = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await collectHtml(full));
    else if (entry.name.endsWith(".html")) result.push(full);
  }
  return result;
}

function localTarget(fromFile, href) {
  if (!href || /^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) return null;
  const clean = href.split(/[?#]/, 1)[0];
  if (!clean) return null;
  const candidate = clean.startsWith("/")
    ? resolve(root, clean.replace(/^\/+/, ""))
    : resolve(dirname(fromFile), clean);
  const safe = normalize(candidate);
  if (safe !== root && !safe.startsWith(root + sep)) return null;
  return clean.endsWith("/") ? join(safe, "index.html") : safe;
}

for (const required of ["index.html", "404.html", "robots.txt", "sitemap.xml"]) {
  try { await access(join(root, required)); }
  catch { failures.push(`missing ${required}`); }
}

const pages = await collectHtml(root);
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes("<loc>https://manul.studio/</loc>")) failures.push("sitemap: English root missing");
if (!sitemap.includes("<loc>https://manul.studio/ru/</loc>")) failures.push("sitemap: Russian root missing");
if (sitemap.includes("<loc>https://manul.studio/en/")) failures.push("sitemap: legacy /en/ URLs must not be indexed");

for (const file of pages) {
  const relative = file.slice(root.length).replaceAll("\\", "/") || "/index.html";
  const html = await readFile(file, "utf8");
  if (file.endsWith("404.html")) {
    if (!/name=["']robots["'][^>]*noindex/i.test(html)) failures.push(`${relative}: 404 must be noindex`);
    continue;
  }
  // Astro emits small HTML redirect documents for legacy URLs. They are not
  // indexable content pages, so H1, description and analytics checks do not
  // apply to them.
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(html)) continue;
  if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${relative}: expected one H1`);
  if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/manul\.studio\//i.test(html)) failures.push(`${relative}: canonical missing`);
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) failures.push(`${relative}: description missing`);
  if (!html.includes('name="yandex-verification" content="ad407e95db9db722"')) failures.push(`${relative}: Yandex verification missing`);
  if ((html.match(/name=["']yandex-verification["']/gi) || []).length !== 1) failures.push(`${relative}: expected exactly one Yandex verification tag`);
  if (html.includes("0daa2fd0f427bbf5")) failures.push(`${relative}: obsolete Yandex verification remains`);
  if (!html.includes("111853232")) failures.push(`${relative}: Metrika missing`);
  if (!html.includes("mc.yandex.ru/metrika/tag.js")) failures.push(`${relative}: Metrika tag loader missing`);
  if (!html.includes("G-2REMPWTXLN")) failures.push(`${relative}: Google Analytics missing`);
  if ((html.match(/id="manulCookieConsent"/g) || []).length !== 1) failures.push(`${relative}: consent banner missing or duplicated`);
  if ((html.match(/id="manulCookieSettings"/g) || []).length !== 1) failures.push(`${relative}: cookie settings control missing or duplicated`);
  if (/<script\b[^>]*\bsrc=["'][^"']*mc\.yandex\.ru\/metrika/gi.test(html)) failures.push(`${relative}: Metrika loads before consent`);
  if (html.includes("mc.yandex.ru/watch/111853232") || html.includes("<!-- Yandex.Metrika counter -->")) failures.push(`${relative}: legacy Metrika bypass remains`);
  for (const consentType of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
    if (!html.includes(`${consentType}: "denied"`)) failures.push(`${relative}: ${consentType} default missing`);
  }
  const consentDefaultAt = html.indexOf('window.gtag("consent", "default"');
  const googleLoaderAt = html.indexOf("googletagmanager.com/gtag/js?id=G-2REMPWTXLN");
  if (consentDefaultAt < 0 || consentDefaultAt > googleLoaderAt) failures.push(`${relative}: consent default does not precede Google tag`);

  const expectedLanguage = relative.startsWith("/ru/")
    ? "ru"
    : relative.startsWith("/de/")
      ? "de"
      : relative.startsWith("/fr/")
        ? "fr"
        : relative.startsWith("/ar/")
          ? "ar"
          : "en";
  if (!new RegExp(`<html[^>]+lang=["']${expectedLanguage}(?:-[a-z]+)?["']`, "i").test(html)) {
    failures.push(`${relative}: expected html lang=${expectedLanguage}`);
  }

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = localTarget(file, match[1]);
    if (!target) continue;
    try { await access(target); }
    catch { failures.push(`${relative}: broken local reference ${match[1]}`); }
  }
}

console.log(`Checked ${pages.length} HTML files.`);
if (failures.length) {
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Failures: 0");
}
