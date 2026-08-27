(() => {
  const routes = {"/en/":"/","/en/sozdanie-saytov/":"/website-development/","/sozdanie-saytov/":"/ru/sozdanie-saytov/","/en/korporativnyj-sajt/":"/corporate-website-development/","/korporativnyj-sajt/":"/ru/korporativnyj-sajt/","/en/landing/":"/landing-page-development/","/landing/":"/ru/landing/","/en/redizajn-sajta/":"/website-redesign/","/redizajn-sajta/":"/ru/redizajn-sajta/","/en/seo-prodvizhenie/":"/seo-services/","/seo-prodvizhenie/":"/ru/seo-prodvizhenie/","/en/nastrojka-yandex-direkt/":"/google-ads-management/","/nastrojka-yandex-direkt/":"/ru/nastrojka-yandex-direkt/","/en/podderzhka-sajta/":"/website-support/","/podderzhka-sajta/":"/ru/podderzhka-sajta/","/en/soprovozhdenie-sajta/":"/website-management/","/soprovozhdenie-sajta/":"/ru/soprovozhdenie-sajta/","/en/medicinskie-sajty/":"/medical-website-development/","/medicinskie-sajty/":"/ru/medicinskie-sajty/","/en/sajty-dlya-stomatologij/":"/dental-website-development/","/sajty-dlya-stomatologij/":"/ru/sajty-dlya-stomatologij/","/en/cases/":"/case-studies/","/cases/":"/ru/cases/","/en/cases/okean/":"/case-studies/ocean-dental-clinic/","/cases/okean/":"/ru/cases/okean/","/en/cases/i-sev/":"/case-studies/i-sev/","/cases/i-sev/":"/ru/cases/i-sev/","/en/cases/crimea-print/":"/case-studies/crimea-print/","/cases/crimea-print/":"/ru/cases/crimea-print/","/en/cases/luca-pacioli/":"/case-studies/luca-pacioli/","/cases/luca-pacioli/":"/ru/cases/luca-pacioli/","/en/studio/":"/about/","/studio/":"/ru/studio/","/en/contacts/":"/contact/","/contacts/":"/ru/contacts/","/en/privacy/":"/privacy-policy/","/privacy/":"/ru/privacy/","/en/consent/":"/data-processing-consent/","/consent/":"/ru/consent/"};
  const normalize = pathname => pathname === "/" ? "/" : pathname.replace(/\/+$/, "") + "/";
  const targetFor = href => {
    try {
      const url = new URL(href, location.origin);
      if (url.origin !== location.origin) return null;
      const target = routes[normalize(url.pathname)];
      if (!target) return null;
      return target + url.search + url.hash;
    } catch { return null; }
  };
  const rewrite = anchor => {
    const raw = anchor.getAttribute("href");
    const target = raw && targetFor(raw);
    if (target) anchor.setAttribute("href", target);
  };
  const rewriteAll = root => root.querySelectorAll?.("a[href]").forEach(rewrite);
  rewriteAll(document);
  new MutationObserver(records => records.forEach(record => {
    if (record.type === "attributes" && record.target instanceof HTMLAnchorElement) rewrite(record.target);
    record.addedNodes.forEach(node => { if (node.nodeType === 1) { if (node.matches?.("a[href]")) rewrite(node); rewriteAll(node); } });
  })).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });
  document.addEventListener("click", event => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const target = targetFor(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    location.href = target;
  }, true);
})();
