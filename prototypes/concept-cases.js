(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#casesLanguage");
  const themeButton = document.querySelector("#casesTheme");
  const consoleElement = document.querySelector("#evidenceConsole");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const evidence = {
    okean: {
      kindRu: "МЕДИЦИНА / КОМПЛЕКСНО",
      kindEn: "HEALTHCARE / INTEGRATED",
      value: "67,2%",
      metricRu: "зрелого ядра на пике в ТОП‑10 Яндекса",
      metricEn: "of the mature set at peak in Yandex Top 10",
      top3: 25.8,
      top10: 67.2,
      top30: 80.1,
      noteRu: "Комплексное сопровождение: сайт, SEO, Яндекс Директ и аналитика. На пике — 67,2% из 186 запросов в ТОП‑10; в рекламном срезе CPA целевого визита из поиска на 54% ниже среднего по конкурентам; обращения — с 50–60 до 300 в месяц по данным владельца.",
      noteEn: "Integrated work: website, SEO, Yandex Ads and analytics. At peak, 67.2% of 186 queries ranked in the Top 10; in an advertising report, search target-visit CPA was 54% below the competitor average; owner-reported enquiries grew from 50–60 to 300 per month.",
      href: "concept-case-okean.html"
    },
    isev: {
      kindRu: "ЛОКАЛЬНЫЙ СЕРВИС / SEO",
      kindEn: "LOCAL SERVICE / SEO",
      value: "77%",
      metricRu: "небрендового ядра в ТОП‑30 Яндекса",
      metricEn: "of the non-brand set in Yandex Top 30",
      top3: 1.3,
      top10: 32.6,
      top30: 77,
      noteRu: "Охват вырос, но верхние позиции снижались после пика. Google не стал работающим поисковым каналом.",
      noteEn: "Reach expanded, but top positions declined after the peak. Google did not become an effective search channel.",
      href: "concept-case-isev.html"
    },
    crimea: {
      kindRu: "ДВА РЕГИОНА / SEO",
      kindEn: "TWO REGIONS / SEO",
      value: "86,8%",
      metricRu: "стабильного ядра в ТОП‑10 Яндекса",
      metricEn: "of the stable set in Yandex Top 10",
      top3: 0,
      top10: 86.8,
      top30: 92.1,
      noteRu: "38 сопоставимых запросов отдельного симферопольского сайта. Рост произошёл главным образом в диапазонах 4–10 и 11–30.",
      noteEn: "38 comparable queries for the dedicated Simferopol website. Most growth occurred in positions 4–10 and 11–30.",
      href: "concept-case-crimea-print.html"
    },
    luca: {
      kindRu: "СЛОЖНЫЕ УСЛУГИ / СИСТЕМА",
      kindEn: "COMPLEX SERVICES / SYSTEM",
      value: "37%",
      metricRu: "профильного ядра в ТОП‑10 Яндекса",
      metricEn: "of the core set in Yandex Top 10",
      top3: null,
      top10: 36.5,
      top30: 56.2,
      noteRu: "203 стабильных бухгалтерских запроса основного региона. Маркетинговые и юридические формулировки исключены из расчёта.",
      noteEn: "203 stable accounting queries in the main region. Marketing and legal queries are excluded from the calculation.",
      href: "concept-case-luca.html"
    }
  };

  const formatPercent = value => `${String(value).replace(".", ",")}%`;

  const setLanguage = next => {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-language", language);
    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    languageButton.setAttribute("aria-label", language === "ru" ? "Переключить на английский" : "Switch to Russian");
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Toggle theme");
    const activeCase = document.querySelector(".console-tabs button.active")?.dataset.case || "okean";
    updateEvidence(activeCase, false);
  };

  const updateEvidence = (key, move = true) => {
    const item = evidence[key];
    if (!item) return;
    document.querySelectorAll(".console-tabs button").forEach(button => {
      const active = button.dataset.case === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelector("#consoleKind").textContent = item[language === "ru" ? "kindRu" : "kindEn"];
    document.querySelector("#consoleValue").textContent = item.value;
    document.querySelector("#consoleMetric").textContent = item[language === "ru" ? "metricRu" : "metricEn"];
    document.querySelector("#consoleNote").textContent = item[language === "ru" ? "noteRu" : "noteEn"];
    document.querySelector("#consoleLink").href = item.href;
    [["Top3", item.top3], ["Top10", item.top10], ["Top30", item.top30]].forEach(([name, value]) => {
      document.querySelector(`#bar${name}`).style.width = `${value ?? 0}%`;
      document.querySelector(`#value${name}`).textContent = value === null ? "—" : formatPercent(value);
    });
    if (move) consoleElement.classList.remove("changed");
    requestAnimationFrame(() => consoleElement.classList.add("changed"));
  };

  languageButton.addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });

  document.querySelectorAll(".console-tabs button").forEach(button => {
    button.addEventListener("click", () => updateEvidence(button.dataset.case));
  });

  document.querySelectorAll("[data-open-case]").forEach(button => {
    button.addEventListener("click", () => {
      updateEvidence(button.dataset.openCase);
      consoleElement.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    });
  });

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-case-card]").forEach(card => {
        const visible = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.hidden = !visible;
        card.classList.toggle("filtered", visible);
      });
    });
  });

  consoleElement.addEventListener("pointermove", event => {
    const rect = consoleElement.getBoundingClientRect();
    const ratio = Math.max(0.08, Math.min(0.92, (event.clientX - rect.left) / rect.width));
    consoleElement.style.setProperty("--scan-x", `${ratio * 100}%`);
  });

  setLanguage(language);
})();
