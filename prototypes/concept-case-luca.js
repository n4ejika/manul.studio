(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#lucaLanguage");
  const themeButton = document.querySelector("#lucaTheme");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const products = {
    main: {
      codeRu: "01 / ОСНОВНОЙ",
      codeEn: "01 / CORE",
      value: "109",
      titleRu: "Профильных запросов в ТОП‑10.",
      titleEn: "Relevant queries in the Top 10.",
      textRu: "Свежий срез Севастополя: 109 из 203 небредовых бухгалтерских запросов находятся в ТОП‑10 Яндекса.",
      textEn: "Current Sevastopol snapshot: 109 of 203 non-brand accounting queries rank in Yandex Top 10.",
      storyCodeRu: "01 / ОСНОВНОЙ САЙТ",
      storyCodeEn: "01 / CORE WEBSITE",
      storyTitleRu: "Два региона. Один основной продукт.",
      storyTitleEn: "Two regions. One core product.",
      storyTextRu: "Бухгалтерские, налоговые и кадровые услуги собраны в общей системе, но Севастополь и Симферополь измеряются отдельно.",
      storyTextEn: "Accounting, tax and HR services share one system, while Sevastopol and Simferopol are measured separately.",
      listRu: ["109 из 203 запросов в ТОП‑10", "два поисковых региона", "SEO и контекстная реклама"],
      listEn: ["109 of 203 queries in the Top 10", "two search regions", "SEO and paid search"],
      domain: "бухучет-крым.рф",
      labelRu: "БУХГАЛТЕРИЯ / ДВА РЕГИОНА",
      labelEn: "ACCOUNTING / TWO REGIONS",
      screenRu: "Спрос разделён.<br>Контекст сохранён.",
      screenEn: "Demand is separated.<br>Context stays intact.",
      tagsRu: ["203 запроса", "109 в ТОП‑10", "свежий срез"],
      tagsEn: ["203 queries", "109 in the Top 10", "current snapshot"],
      footer: "SEARCH / ADS / CONTENT"
    },
    region: {
      codeRu: "02 / ПРОДУКТ",
      codeEn: "02 / PRODUCT",
      value: "1",
      titleRu: "Отдельная логика регистрации.",
      titleEn: "A separate registration journey.",
      textRu: "Регистрация и изменение бизнеса получили собственный продукт вместо чужого раздела в бухгалтерском сайте.",
      textEn: "Business registration and corporate changes received a dedicated product instead of a secondary accounting section.",
      storyCodeRu: "02 / РЕГИСТРАЦИЯ БИЗНЕСА",
      storyCodeEn: "02 / BUSINESS REGISTRATION",
      storyTitleRu: "Другой спрос требует другого сценария.",
      storyTitleEn: "Different demand needs a different journey.",
      storyTextRu: "Регистрация, ликвидация и изменения в ЕГРЮЛ отделены от бухгалтерского сопровождения в самостоятельный продукт.",
      storyTextEn: "Registration, liquidation and corporate changes are separated from ongoing accounting into a standalone product.",
      listRu: ["отдельный продукт", "другой поисковый интент", "Севастополь и Симферополь"],
      listEn: ["standalone product", "different search intent", "Sevastopol and Simferopol"],
      domain: "region-92.ru",
      labelRu: "РЕГИСТРАЦИЯ / ИЗМЕНЕНИЯ",
      labelEn: "REGISTRATION / CHANGES",
      screenRu: "Одна задача.<br>Прямой маршрут.",
      screenEn: "One task.<br>A direct journey.",
      tagsRu: ["ИП и ООО", "ЕГРЮЛ", "ликвидация"],
      tagsEn: ["companies", "corporate changes", "liquidation"],
      footer: "PRODUCT / INTENT / ACTION"
    },
    simf: {
      codeRu: "03 / РЕГИОН",
      codeEn: "03 / REGION",
      value: "30",
      titleRu: "Профильных запросов в ТОП‑30.",
      titleEn: "Relevant queries in the Top 30.",
      textRu: "Свежий срез отдельного симферопольского сайта: 30 из 93 профильных запросов находятся в ТОП‑30 Яндекса.",
      textEn: "Current snapshot for the dedicated Simferopol website: 30 of 93 relevant queries rank in Yandex Top 30.",
      storyCodeRu: "03 / НОВЫЙ РЕГИОНАЛЬНЫЙ САЙТ",
      storyCodeEn: "03 / NEW REGIONAL WEBSITE",
      storyTitleRu: "Новый регион получил собственную точку роста.",
      storyTitleEn: "The new region received its own growth point.",
      storyTextRu: "Сайт ориентирован на Симферополь и Крым. Его ранняя динамика считается по отдельному профильному ядру.",
      storyTextEn: "The website targets Simferopol and Crimea. Its early movement is measured through a separate relevant query set.",
      listRu: ["93 профильных запроса", "30 запросов в ТОП‑30", "7 запросов в ТОП‑10"],
      listEn: ["93 relevant queries", "30 queries in the Top 30", "7 queries in the Top 10"],
      domain: "buhgalter82.ru",
      labelRu: "СИМФЕРОПОЛЬ / КРЫМ",
      labelEn: "SIMFEROPOL / CRIMEA",
      screenRu: "Новый регион.<br>Своя нулевая точка.",
      screenEn: "New region.<br>Its own baseline.",
      tagsRu: ["93 запроса", "30 в ТОП‑30", "текущий срез"],
      tagsEn: ["93 queries", "30 in the Top 30", "current snapshot"],
      footer: "REGION / BASELINE / GROWTH"
    },
    voin: {
      codeRu: "04 / ФЕДЕРАЛЬНЫЙ",
      codeEn: "04 / NATIONWIDE",
      value: "24",
      titleRu: "Коммерческих запроса имеют позиции.",
      titleEn: "Commercial queries are ranked.",
      textRu: "Федеральный продукт работает по всей России: 24 из 50 коммерческих запросов имеют позиции в Яндексе, восемь находятся в ТОП‑30.",
      textEn: "The nationwide product serves all of Russia: 24 of 50 commercial queries rank in Yandex and eight are in the Top 30.",
      storyCodeRu: "04 / ФЕДЕРАЛЬНЫЙ ПРОДУКТ",
      storyCodeEn: "04 / NATIONWIDE PRODUCT",
      storyTitleRu: "Регулируемая услуга стала самостоятельным продуктом.",
      storyTitleEn: "A regulated service became a standalone product.",
      storyTextRu: "Коммерческие страницы, экспертные материалы, нормативные источники, тест, бот и CRM собраны в федеральный B2B-контур.",
      storyTextEn: "Commercial pages, expert content, regulatory sources, a test, bot and CRM form one nationwide B2B system.",
      listRu: ["148 запросов в проекте", "24 коммерческих имеют позиции", "8 коммерческих в ТОП‑30"],
      listEn: ["148 tracked queries", "24 commercial queries are ranked", "8 commercial queries in the Top 30"],
      domain: "voinuchet.ru",
      labelRu: "ВОИНСКИЙ УЧЁТ / РОССИЯ",
      labelEn: "MILITARY RECORDS / RUSSIA",
      screenRu: "Федеральный запуск.<br>Первые сигналы.",
      screenEn: "Nationwide launch.<br>Early signals.",
      tagsRu: ["вся Россия", "24 имеют позиции", "текущий срез"],
      tagsEn: ["all of Russia", "24 are ranked", "current snapshot"],
      footer: "LAUNCH / SEO / BOT / CRM"
    }
  };

  const get = (item, key) => item[`${key}${language === "ru" ? "Ru" : "En"}`];

  const setProduct = (key, updateStory = true) => {
    const item = products[key];
    if (!item) return;
    document.querySelectorAll("[data-product]").forEach(button => {
      const active = button.dataset.product === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#productCode").textContent = get(item, "code");
    document.querySelector("#productValue").textContent = item.value;
    document.querySelector("#productTitle").textContent = get(item, "title");
    document.querySelector("#productText").textContent = get(item, "text");
    if (updateStory) setStory(key);
  };

  const setStory = key => {
    const item = products[key];
    if (!item) return;
    document.querySelectorAll("[data-story]").forEach(button => {
      const active = button.dataset.story === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const stage = document.querySelector(".product-stage");
    stage.classList.remove("changed");
    document.querySelector("#storyCode").textContent = get(item, "storyCode");
    document.querySelector("#storyTitle").textContent = get(item, "storyTitle");
    document.querySelector("#storyText").textContent = get(item, "storyText");
    document.querySelector("#storyList").innerHTML = item[language === "ru" ? "listRu" : "listEn"].map(value => `<li>${value}</li>`).join("");
    document.querySelector("#screenDomain").textContent = item.domain;
    document.querySelector("#screenLabel").textContent = get(item, "label");
    document.querySelector("#screenTitle").innerHTML = get(item, "screen");
    document.querySelector("#screenTags").innerHTML = item[language === "ru" ? "tagsRu" : "tagsEn"].map(value => `<span>${value}</span>`).join("");
    document.querySelector("#screenFooter").textContent = item.footer;
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
    const active = document.querySelector("[data-product].active")?.dataset.product || "main";
    setProduct(active);
  };

  document.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => setProduct(button.dataset.product));
  });
  document.querySelectorAll("[data-story]").forEach(button => {
    button.addEventListener("click", () => {
      setProduct(button.dataset.story, false);
      setStory(button.dataset.story);
    });
  });
  languageButton.addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });

  const tick = () => {
    document.querySelector("#lucaClock").textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
  setLanguage(language);
})();
