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
      metricRu: "коммерческих запросов в ТОП‑10 Яндекса",
      metricEn: "of commercial-intent queries in Yandex Top 10",
      top3: 25.8,
      top10: 67.2,
      top30: 80.1,
      noteRu: "Комплексное сопровождение: сайт, SEO, Яндекс Директ и аналитика. В едином срезе периода работы 67,2% из 186 коммерческих запросов находились в ТОП‑10; CPA целевого визита из поиска был на 54% ниже среднего по группе конкурентов; обращения выросли с 50–60 до 300 в месяц по данным владельца.",
      noteEn: "Integrated work: website, SEO, Yandex Ads and analytics. In one consistent snapshot during the engagement, 67.2% of 186 commercial-intent queries ranked in the Top 10; search target-visit CPA was 54% below the competitor-group average; owner-reported enquiries grew from 50–60 to 300 per month.",
      hrefRu: "/cases/okean/",
      hrefEn: "/en/cases/okean/"
    },
    isev: {
      kindRu: "ЛОКАЛЬНЫЙ СЕРВИС / SEO",
      kindEn: "LOCAL SERVICE / SEO",
      value: "200",
      metricRu: "локальных запросов в ТОП‑10 Яндекса",
      metricEn: "local queries in Yandex Top 10",
      top3: 12.4,
      top10: 56.3,
      top30: 77.5,
      noteRu: "Текущий контрольный срез: 293 из 355 запросов имеют позиции в Яндексе; 200 находятся в ТОП‑10.",
      noteEn: "Current control snapshot: 293 of 355 queries rank in Yandex; 200 are in the Top 10.",
      hrefRu: "/cases/i-sev/",
      hrefEn: "/en/cases/i-sev/"
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
      noteRu: "Высокая точка рассчитана по 38 сопоставимым запросам. В свежем срезе 81 из 110 запросов Симферополя находится в ТОП‑10 Яндекса.",
      noteEn: "The high point is calculated across 38 comparable queries. In the current snapshot, 81 of 110 Simferopol queries rank in Yandex Top 10.",
      hrefRu: "/cases/crimea-print/",
      hrefEn: "/en/cases/crimea-print/"
    },
    luca: {
      kindRu: "СЛОЖНЫЕ УСЛУГИ / СИСТЕМА",
      kindEn: "COMPLEX SERVICES / SYSTEM",
      value: "53,7%",
      metricRu: "профильного ядра сейчас в ТОП‑10 Яндекса",
      metricEn: "of the relevant set currently in Yandex Top 10",
      top3: 34,
      top10: 53.7,
      top30: 60.1,
      noteRu: "109 из 203 небредовых бухгалтерских запросов основного региона находятся в ТОП‑10. Маркетинг, юридические услуги и регистрация бизнеса исключены.",
      noteEn: "109 of 203 non-brand accounting queries in the main region rank in the Top 10. Marketing, legal services and business registration are excluded.",
      hrefRu: "/cases/luca-pacioli/",
      hrefEn: "/en/cases/luca-pacioli/"
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
    document.querySelectorAll("[data-case-link]").forEach(link => {
      const item = evidence[link.dataset.caseLink];
      if (item) link.href = item[language === "ru" ? "hrefRu" : "hrefEn"];
    });
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
    document.querySelector("#consoleLink").href = item[language === "ru" ? "hrefRu" : "hrefEn"];
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
