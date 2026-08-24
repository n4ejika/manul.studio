(() => {
  const language = document.documentElement.lang === "en" ? "en" : "ru";
  const routes = {"concept-system.html":"/","concept-product.html":"/sozdanie-saytov/","concept-corporate.html":"/korporativnyj-sajt/","concept-landing.html":"/landing/","concept-redesign.html":"/redizajn-sajta/","concept-seo.html":"/seo-prodvizhenie/","concept-direct.html":"/nastrojka-yandex-direkt/","concept-studio.html":"/studio/","concept-cases.html":"/cases/","concept-case-okean.html":"/cases/okean/","concept-case-isev.html":"/cases/i-sev/","concept-case-crimea-print.html":"/cases/crimea-print/","concept-case-luca.html":"/cases/luca-pacioli/"};
  const localize = route => language === "en" ? "/en" + route : route;
  const rewrite = root => root.querySelectorAll?.("a[href]").forEach(anchor => {
    const raw = anchor.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("http") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;
    const match = Object.entries(routes).find(([file]) => raw.includes(file));
    if (match) {
      const hash = raw.includes("#") ? "#" + raw.split("#")[1] : "";
      anchor.setAttribute("href", localize(match[1]) + hash);
      return;
    }
    if (language === "en" && raw.startsWith("/") && !raw.startsWith("/en/") && !raw.startsWith("/prototypes/") && !raw.startsWith("/assets/")) {
      anchor.setAttribute("href", raw === "/" ? "/en/" : "/en" + raw);
    }
  });
  rewrite(document);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => node.nodeType === 1 && rewrite(node)))).observe(document.documentElement, {subtree:true, childList:true});
})();