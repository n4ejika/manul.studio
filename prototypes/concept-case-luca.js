(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#lucaLanguage");
  const themeButton = document.querySelector("#lucaTheme");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const products = {
    main: {
      codeRu: "01 / ОСНОВНОЙ",
      codeEn: "01 / CORE",
      value: "2",
      titleRu: "Два региона в одной архитектуре.",
      titleEn: "Two regions in one architecture.",
      textRu: "Севастополь — зрелый контур. Симферополь открыт позднее и развивается отдельно.",
      textEn: "Sevastopol is the mature system. Simferopol launched later and is measured separately.",
      storyCodeRu: "01 / ОСНОВНОЙ САЙТ",
      storyCodeEn: "01 / CORE WEBSITE",
      storyTitleRu: "Два региона. Один основной продукт.",
      storyTitleEn: "Two regions. One core product.",
      storyTextRu: "Бухгалтерские, налоговые и кадровые услуги собраны в общей системе, но Севастополь и Симферополь измеряются отдельно.",
      storyTextEn: "Accounting, tax and HR services share one system, while Sevastopol and Simferopol are measured separately.",
      listRu: ["основной долгосрочный проект", "два поисковых региона", "SEO и контекстная реклама"],
      listEn: ["long-term core project", "two search regions", "SEO and paid search"],
      domain: "бухучет-крым.рф",
      labelRu: "БУХГАЛТЕРИЯ / ДВА РЕГИОНА",
      labelEn: "ACCOUNTING / TWO REGIONS",
      screenRu: "Спрос разделён.<br>Контекст сохранён.",
      screenEn: "Demand is separated.<br>Context stays intact.",
      tagsRu: ["Севастополь", "Симферополь", "203 запроса"],
      tagsEn: ["Sevastopol", "Simferopol", "203 queries"],
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
      value: "93",
      titleRu: "Запроса в молодом ядре.",
      titleEn: "Queries in the young set.",
      textRu: "Отдельный симферопольский сайт набирает видимость без присвоения зрелого результата Севастополя.",
      textEn: "The dedicated Simferopol website builds visibility without inheriting Sevastopol’s mature result.",
      storyCodeRu: "03 / НОВЫЙ РЕГИОНАЛЬНЫЙ САЙТ",
      storyCodeEn: "03 / NEW REGIONAL WEBSITE",
      storyTitleRu: "Новый регион получил собственную точку роста.",
      storyTitleEn: "The new region received its own growth point.",
      storyTextRu: "Сайт ориентирован на Симферополь и Крым. Его ранняя динамика считается по отдельному профильному ядру.",
      storyTextEn: "The website targets Simferopol and Crimea. Its early movement is measured through a separate relevant query set.",
      listRu: ["93 профильных запроса", "ТОП‑30: 6,5% → 28%", "ранний рост без громких выводов"],
      listEn: ["93 relevant queries", "Top 30: 6.5% → 28%", "early growth without overclaiming"],
      domain: "buhgalter82.ru",
      labelRu: "СИМФЕРОПОЛЬ / КРЫМ",
      labelEn: "SIMFEROPOL / CRIMEA",
      screenRu: "Новый регион.<br>Своя нулевая точка.",
      screenEn: "New region.<br>Its own baseline.",
      tagsRu: ["93 запроса", "ТОП‑30", "ранний рост"],
      tagsEn: ["93 queries", "Top 30", "early growth"],
      footer: "REGION / BASELINE / GROWTH"
    },
    voin: {
      codeRu: "04 / ФЕДЕРАЛЬНЫЙ",
      codeEn: "04 / NATIONWIDE",
      value: "148",
      titleRu: "Запросов в стартовой точке.",
      titleEn: "Queries in the launch baseline.",
      textRu: "Запущенный продукт по воинскому учёту работает по всей России. Истории SEO‑роста пока нет.",
      textEn: "The military-records product is live across Russia. There is no SEO growth history yet.",
      storyCodeRu: "04 / ФЕДЕРАЛЬНЫЙ ПРОДУКТ",
      storyCodeEn: "04 / NATIONWIDE PRODUCT",
      storyTitleRu: "Регулируемая услуга стала самостоятельным продуктом.",
      storyTitleEn: "A regulated service became a standalone product.",
      storyTextRu: "Коммерческие страницы, экспертные материалы, нормативные источники, тест, бот и CRM собраны в федеральный B2B-контур.",
      storyTextEn: "Commercial pages, expert content, regulatory sources, a test, bot and CRM form one nationwide B2B system.",
      listRu: ["50 коммерческих запросов", "86 информационных запросов", "три съёма — только старт"],
      listEn: ["50 commercial queries", "86 informational queries", "three snapshots: baseline only"],
      domain: "voinuchet.ru",
      labelRu: "ВОИНСКИЙ УЧЁТ / РОССИЯ",
      labelEn: "MILITARY RECORDS / RUSSIA",
      screenRu: "Федеральный запуск.<br>Первые сигналы.",
      screenEn: "Nationwide launch.<br>Early signals.",
      tagsRu: ["Россия", "148 запросов", "запущен"],
      tagsEn: ["Russia", "148 queries", "live"],
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
