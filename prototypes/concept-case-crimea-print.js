(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#crimeaLanguage");
  const themeButton = document.querySelector("#crimeaTheme");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const cities = {
    sev: {
      codeRu: "01 / ЯНДЕКС · ТОП‑10", codeEn: "01 / YANDEX · TOP 10", value: "34",
      titleRu: "Печати, полиграфия и дизайн.", titleEn: "Stamps, print and design.",
      textRu: "34 из 67 запросов находятся в ТОП‑10; сайт охватывает печати, визитки, листовки и дизайн.",
      textEn: "34 of 67 queries rank in the Top 10; the website covers stamps, business cards, leaflets and design."
    },
    simf: {
      codeRu: "02 / ЯНДЕКС · ТОП‑10", codeEn: "02 / YANDEX · TOP 10", value: "81",
      titleRu: "Изготовление печатей и быстрый заказ.", titleEn: "Stamp production and fast ordering.",
      textRu: "81 из 110 запросов находятся в ТОП‑10; сайт отвечает на спрос Симферополя своими ценами, сроками и страницами.",
      textEn: "81 of 110 queries rank in the Top 10; the website answers Simferopol demand with its own prices, lead times and pages."
    }
  };

  const sites = {
    sev: {
      codeRu: "СЕВАСТОПОЛЬ / ШИРОКИЙ ПРОДУКТ", codeEn: "SEVASTOPOL / BROAD PRODUCT",
      titleRu: "Каталог выходит за пределы изготовления печатей.",
      titleEn: "The catalogue goes beyond stamp production.",
      textRu: "Печати и штампы соседствуют с визитками, листовками, рекламной полиграфией и дизайном.",
      textEn: "Stamps sit alongside business cards, leaflets, promotional printing and design.",
      listRu: ["печати и штампы", "полиграфия", "дизайн"], listEn: ["stamps", "commercial print", "design"],
      domain: "crimea-p.ru", labelRu: "СЕВАСТОПОЛЬ / КАТАЛОГ", labelEn: "SEVASTOPOL / CATALOGUE",
      screenRu: "Несколько направлений.<br>Одна витрина.", screenEn: "Several categories.<br>One storefront.",
      tagsRu: ["Печати", "Визитки", "Листовки", "Дизайн"], tagsEn: ["Stamps", "Cards", "Leaflets", "Design"],
      footer: "CATALOG / SERVICE / ORDER"
    },
    simf: {
      codeRu: "СИМФЕРОПОЛЬ / ФОКУС НА ЗАКАЗЕ", codeEn: "SIMFEROPOL / ORDER FOCUS",
      titleRu: "Сайт сокращает путь до готовой печати.",
      titleEn: "The website shortens the path to a finished stamp.",
      textRu: "Модели, цены, срочность, печати по оттиску и заказ через мессенджер собраны вокруг одной коммерческой задачи.",
      textEn: "Models, prices, urgency, stamps from an imprint and messenger ordering support one commercial task.",
      listRu: ["изготовление от 30 минут", "модели и цены", "заказ через мессенджер"], listEn: ["production from 30 minutes", "models and prices", "messenger ordering"],
      domain: "крым-печать.рф", labelRu: "СИМФЕРОПОЛЬ / БЫСТРЫЙ ЗАКАЗ", labelEn: "SIMFEROPOL / FAST ORDER",
      screenRu: "Выбрать.<br>Согласовать.<br>Забрать.", screenEn: "Choose.<br>Approve.<br>Collect.",
      tagsRu: ["Срочно", "По оттиску", "Для врачей", "Штампы"], tagsEn: ["Urgent", "From imprint", "Doctors", "Stamps"],
      footer: "PRICE / SPEED / MESSENGER"
    }
  };

  const localized = (item, name) => item[`${name}${language === "ru" ? "Ru" : "En"}`];

  const setCity = key => {
    const item = cities[key];
    if (!item) return;
    document.querySelectorAll("[data-city]").forEach(button => {
      const active = button.dataset.city === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#cityCode").textContent = localized(item, "code");
    document.querySelector("#cityValue").textContent = item.value;
    document.querySelector("#cityTitle").textContent = localized(item, "title");
    document.querySelector("#cityText").textContent = localized(item, "text");
  };

  const setSite = key => {
    const item = sites[key];
    if (!item) return;
    document.querySelectorAll("[data-site]").forEach(button => {
      const active = button.dataset.site === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const stage = document.querySelector(".site-compare");
    stage.classList.remove("changed");
    document.querySelector("#siteCode").textContent = localized(item, "code");
    document.querySelector("#siteTitle").textContent = localized(item, "title");
    document.querySelector("#siteText").textContent = localized(item, "text");
    document.querySelector("#siteList").innerHTML = item[language === "ru" ? "listRu" : "listEn"].map(value => `<li>${value}</li>`).join("");
    document.querySelector("#screenDomain").textContent = item.domain;
    document.querySelector("#screenLabel").textContent = localized(item, "label");
    document.querySelector("#screenTitle").innerHTML = localized(item, "screen");
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
    setCity(document.querySelector("[data-city].active")?.dataset.city || "sev");
    setSite(document.querySelector("[data-site].active")?.dataset.site || "sev");
  };

  document.querySelectorAll("[data-city]").forEach(button => button.addEventListener("click", () => setCity(button.dataset.city)));
  document.querySelectorAll("[data-site]").forEach(button => {
    button.addEventListener("click", () => {
      setCity(button.dataset.site);
      setSite(button.dataset.site);
    });
  });
  languageButton.addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });

  const tick = () => {
    document.querySelector("#crimeaClock").textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
  setLanguage(language);
})();
