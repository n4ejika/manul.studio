(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#okeanLanguage");
  const themeButton = document.querySelector("#okeanTheme");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const layers = {
    system: {
      code: "SYSTEM / 00",
      value: "300",
      titleRu: "Обращения — результат комплексной работы.",
      titleEn: "Enquiries are the outcome of integrated work.",
      textRu: "Обращения формировались совместной работой сайта, поискового продвижения, рекламы и самой клиники.",
      textEn: "Enquiries were shaped by the website, SEO, advertising and the clinic's own work."
    },
    site: {
      code: "WEBSITE / 01",
      value: "САЙТ",
      titleRu: "Направление получает точку входа.",
      titleEn: "Each service gets an entry point.",
      textRu: "Услуги, врачи, оборудование, цены и отделения собраны в понятную структуру выбора.",
      textEn: "Services, doctors, technology, prices and locations form a clear decision structure."
    },
    seo: {
      code: "SEARCH / 02",
      value: "67,2%",
      titleRu: "Зрелое ядро занимает выдачу.",
      titleEn: "The mature query set gains visibility.",
      textRu: "Единый срез периода работы: 186 коммерческих запросов, 67,2% — в ТОП‑10 Яндекса.",
      textEn: "One consistent snapshot during the engagement: 186 commercial-intent queries, with 67.2% in Yandex Top 10."
    },
    ads: {
      code: "ADS / 03",
      value: "−54%",
      titleRu: "Реклама приводит целевые визиты.",
      titleEn: "Advertising drives target visits.",
      textRu: "CPA целевого визита из поиска ниже среднего показателя группы конкурентов.",
      textEn: "Search target-visit CPA is below the competitor-group average."
    },
    data: {
      code: "DATA / 04",
      value: "114",
      titleRu: "Результат можно проверить.",
      titleEn: "The outcome can be verified.",
      textRu: "Pixel Tools, отчёты Яндекса и данные владельца отвечают на разные вопросы.",
      textEn: "Pixel Tools, Yandex reports and owner-reported data answer different questions."
    }
  };

  const buildData = {
    site: {
      code: "01 / WEBSITE",
      titleRu: "Структура повторяет выбор пациента.",
      titleEn: "The structure follows the patient journey.",
      textRu: "Страницы услуг, врачей, оборудования, цен и отделений дают отдельный ответ для каждого сценария выбора.",
      textEn: "Service, doctor, technology, pricing and location pages answer distinct decision scenarios.",
      listRu: ["коммерческие страницы услуг", "врачи и доверие", "цены и точки записи"],
      listEn: ["commercial service pages", "doctors and trust", "prices and enquiry points"]
    },
    seo: {
      code: "02 / SEARCH",
      titleRu: "Структуру сайта собрали по спросу.",
      titleEn: "The website structure was built around demand.",
      textRu: "Запросы группируются по задаче и интенту. Каждая значимая группа получает релевантную страницу и возможность расти отдельно.",
      textEn: "Queries are grouped by need and intent. Each meaningful group gets a relevant page and room to grow.",
      listRu: ["зрелое ядро 186 запросов", "страницы под направления", "контроль ТОП‑3 / 10 / 30"],
      listEn: ["mature set of 186 queries", "service-specific pages", "Top 3 / 10 / 30 monitoring"]
    },
    ads: {
      code: "03 / ADS",
      titleRu: "Реклама подключается к готовым ответам.",
      titleEn: "Ads connect to prepared answers.",
      textRu: "Рекламные кампании связывали спрос с подходящими страницами услуг. Цели и аналитика позволяли оценивать качество визитов.",
      textEn: "Advertising campaigns connected demand with relevant service pages. Goals and analytics helped assess visit quality.",
      listRu: ["структура кампаний по услугам", "релевантные посадочные страницы", "контроль целевых визитов и CPA"],
      listEn: ["service-based campaign structure", "relevant landing pages", "target-visit and CPA monitoring"]
    },
    analytics: {
      code: "04 / ANALYTICS",
      titleRu: "Каждая цифра получает правильную роль.",
      titleEn: "Every number gets the right role.",
      textRu: "Позиции показывают видимость, рекламные цели — эффективность кампаний, обращения — бизнес-динамику всего комплекса.",
      textEn: "Rankings show visibility, advertising goals show campaign efficiency, and enquiries show the outcome of the whole system.",
      listRu: ["Pixel Tools", "Яндекс Директ и Метрика", "данные владельца"],
      listEn: ["Pixel Tools", "Yandex Ads and Metrica", "owner-reported data"]
    }
  };

  const setLayer = key => {
    const item = layers[key] || layers.system;
    document.querySelectorAll("[data-layer]").forEach(button => {
      const active = button.dataset.layer === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#layerCode").textContent = item.code;
    document.querySelector("#layerValue").textContent = item.value;
    document.querySelector("#layerTitle").textContent = item[language === "ru" ? "titleRu" : "titleEn"];
    document.querySelector("#layerText").textContent = item[language === "ru" ? "textRu" : "textEn"];
  };

  const setBuild = key => {
    const item = buildData[key];
    if (!item) return;
    document.querySelectorAll("[data-build]").forEach(button => {
      const active = button.dataset.build === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const stage = document.querySelector(".build-stage");
    stage.classList.remove("changed");
    document.querySelector("#buildCode").textContent = item.code;
    document.querySelector("#buildTitle").textContent = item[language === "ru" ? "titleRu" : "titleEn"];
    document.querySelector("#buildText").textContent = item[language === "ru" ? "textRu" : "textEn"];
    document.querySelector("#buildList").innerHTML = item[language === "ru" ? "listRu" : "listEn"].map(value => `<li>${value}</li>`).join("");
    requestAnimationFrame(() => stage.classList.add("changed"));
  };

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
    const activeLayer = document.querySelector("[data-layer].active")?.dataset.layer || "system";
    const activeBuild = document.querySelector("[data-build].active")?.dataset.build || "site";
    setLayer(activeLayer);
    setBuild(activeBuild);
  };

  document.querySelectorAll("[data-layer]").forEach(button => button.addEventListener("click", () => setLayer(button.dataset.layer)));
  document.querySelectorAll("[data-build]").forEach(button => button.addEventListener("click", () => setBuild(button.dataset.build)));
  languageButton.addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });

  const tick = () => {
    document.querySelector("#okeanClock").textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
  setLanguage(language);
  setLayer("system");
})();
