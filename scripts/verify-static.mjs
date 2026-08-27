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
  if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${relative}: expected one H1`);
  if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/manul\.studio\//i.test(html)) failures.push(`${relative}: canonical missing`);
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) failures.push(`${relative}: description missing`);
  if (!html.includes('name="yandex-verification" content="0daa2fd0f427bbf5"')) failures.push(`${relative}: Yandex verification missing`);
  if (!html.includes("111853232")) failures.push(`${relative}: Metrika missing`);

  const expectedLanguage = relative.startsWith("/ru/") ? "ru" : "en";
  if (!new RegExp(`<html[^>]+lang=["']${expectedLanguage}["']`, "i").test(html)) {
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
