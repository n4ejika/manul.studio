(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector("#isevLanguage");
  const themeButton = document.querySelector("#isevTheme");
  const consoleElement = document.querySelector(".search-console");
  const deviceOutput = document.querySelector("#deviceOutput");
  const timelineOutput = document.querySelector("#timelineOutput");
  let language = localStorage.getItem("manul-language") === "en" ? "en" : "ru";

  const engines = {
    yandex: {
      code: "YANDEX / 230 QUERY",
      value: "85,7%",
      top10: "32,6%",
      top30: "77%",
      absent: "33",
      labelRu: "ядра с позицией",
      labelEn: "of queries with a rank",
      noteRu: "Яндекс сформировал широкий локальный охват. Верх выдачи менялся внутри периода.",
      noteEn: "Yandex built broad local reach. Top positions fluctuated during the period."
    },
    google: {
      code: "GOOGLE / 230 QUERY",
      value: "3,5%",
      top10: "0%",
      top30: "3,5%",
      absent: "222",
      labelRu: "ядра с позицией",
      labelEn: "of queries with a rank",
      noteRu: "Google не сформировался как рабочий поисковый канал в измеряемом периоде.",
      noteEn: "Google did not develop into an effective search channel during the measured period."
    }
  };

  const devices = {
    iphone: {
      code: "IPHONE / 82 QUERY",
      titleRu: "Ремонт iPhone",
      titleEn: "iPhone repair",
      top10: "53,7%",
      top30: "92,7%",
      noteRu: "Самое крупное направление ядра и самый устойчивый результат среди категорий.",
      noteEn: "The largest category in the set and the most stable result across device types.",
      device: "iPhone",
      page: "/remont-iphone/"
    },
    samsung: {
      code: "SAMSUNG / 22 QUERY",
      titleRu: "Ремонт Samsung",
      titleEn: "Samsung repair",
      top10: "36,4%",
      top30: "81,8%",
      noteRu: "Направление выросло с нулевой доли ТОП‑10 и сформировало заметную видимость.",
      noteEn: "The category grew from zero Top 10 share and established visible search presence.",
      device: "Samsung",
      page: "/remont-samsung/"
    },
    xiaomi: {
      code: "XIAOMI / 19 QUERY",
      titleRu: "Ремонт Xiaomi",
      titleEn: "Xiaomi repair",
      top10: "15,8%",
      top30: "94,7%",
      noteRu: "Почти всё направление вошло в первые тридцать результатов, но верх выдачи остался точкой роста.",
      noteEn: "Almost the entire category entered the Top 30, while top rankings remained an opportunity.",
      device: "Xiaomi",
      page: "/remont-xiaomi/"
    },
    laptop: {
      code: "LAPTOP / 13 QUERY",
      titleRu: "Ремонт ноутбуков",
      titleEn: "Laptop repair",
      top10: "15,4%",
      top30: "69,2%",
      noteRu: "Направление получило охват, но требует более сильной коммерческой посадочной.",
      noteEn: "The category gained reach but requires a stronger commercial landing page.",
      device: "Laptop",
      page: "/remont-noutbukov/"
    },
    tv: {
      code: "TV / 31 QUERY",
      titleRu: "Ремонт телевизоров",
      titleEn: "TV repair",
      top10: "6,5%",
      top30: "35,5%",
      noteRu: "Спрос присутствует, но текущая структура раскрывает его слабее телефонных направлений.",
      noteEn: "Demand exists, but the current structure covers it less effectively than phone repair.",
      device: "TV",
      page: "/remont-televizorov/"
    },
    computer: {
      code: "COMPUTER / 12 QUERY",
      titleRu: "Ремонт компьютеров",
      titleEn: "Computer repair",
      top10: "0%",
      top30: "0%",
      noteRu: "Неосвоенное направление, которое нельзя прятать внутри общей страницы сервиса.",
      noteEn: "An unserved category that should not be buried inside a generic service page.",
      device: "Computer",
      page: "/remont-kompyuterov/"
    }
  };

  const stages = {
    start: {
      codeRu: "01 / СТАРТ ИЗМЕРЕНИЯ",
      codeEn: "01 / MEASUREMENT START",
      titleRu: "Сайт уже имел сильное телефонное ядро.",
      titleEn: "The website already had a strong phone-repair core.",
      textRu: "31,3% стабильного небрендового ядра находилось в ТОП‑10 Яндекса.",
      textEn: "31.3% of the stable non-brand set ranked in Yandex Top 10.",
      value: "31,3%",
      gauge: "31.3%"
    },
    peak: {
      codeRu: "02 / ПИК ПЕРИОДА",
      codeEn: "02 / PERIOD PEAK",
      titleRu: "Верх выдачи достиг максимума.",
      titleEn: "Top rankings reached their maximum.",
      textRu: "При широком охвате 60,4% стабильного ядра находилось в ТОП‑10 Яндекса.",
      textEn: "With broad reach established, 60.4% of the stable set ranked in Yandex Top 10.",
      value: "60,4%",
      gauge: "60.4%"
    },
    finish: {
      codeRu: "03 / КОНЕЦ ПЕРИОДА",
      codeEn: "03 / PERIOD END",
      titleRu: "Охват сохранился, верхние позиции снизились.",
      titleEn: "Reach remained broad while top rankings declined.",
      textRu: "85,7% ядра имело позиции, но доля ТОП‑10 вернулась к 32,6%. Это и стало сигналом к пересборке структуры.",
      textEn: "85.7% of the set had rankings, but the Top 10 share returned to 32.6%. This became a signal to rebuild the structure.",
      value: "32,6%",
      gauge: "32.6%"
    }
  };

  const localize = (item, key) => item[`${key}${language === "ru" ? "Ru" : "En"}`];

  const animate = element => {
    element.classList.remove("changed");
    requestAnimationFrame(() => element.classList.add("changed"));
  };

  const setEngine = key => {
    const item = engines[key];
    document.querySelectorAll("[data-engine]").forEach(button => {
      const active = button.dataset.engine === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelector("#engineCode").textContent = item.code;
    document.querySelector("#engineValue").textContent = item.value;
    document.querySelector("#engineLabel").textContent = localize(item, "label");
    document.querySelector("#engineTop10").textContent = item.top10;
    document.querySelector("#engineTop30").textContent = item.top30;
    document.querySelector("#engineAbsent").textContent = item.absent;
    document.querySelector("#engineNote").textContent = localize(item, "note");
    consoleElement.dataset.engine = key;
    animate(consoleElement);
  };

  const setDevice = key => {
    const item = devices[key];
    document.querySelectorAll("[data-device]").forEach(button => {
      const active = button.dataset.device === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelector("#deviceCode").textContent = item.code;
    document.querySelector("#deviceTitle").textContent = localize(item, "title");
    document.querySelector("#deviceTop10").textContent = item.top10;
    document.querySelector("#deviceTop30").textContent = item.top30;
    document.querySelector("#deviceNote").textContent = localize(item, "note");
    document.querySelector("#mapDevice").textContent = item.device;
    document.querySelector("#mapPage").textContent = item.page;
    animate(deviceOutput);
  };

  const setStage = key => {
    const item = stages[key];
    document.querySelectorAll("[data-stage]").forEach(button => {
      const active = button.dataset.stage === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelector("#stageCode").textContent = localize(item, "code");
    document.querySelector("#stageTitle").textContent = localize(item, "title");
    document.querySelector("#stageText").textContent = localize(item, "text");
    document.querySelector("#stageValue").textContent = item.value;
    document.querySelector("#stageGauge").style.setProperty("--value", item.gauge);
    animate(timelineOutput);
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
    setEngine(document.querySelector("[data-engine].active")?.dataset.engine || "yandex");
    setDevice(document.querySelector("[data-device].active")?.dataset.device || "iphone");
    setStage(document.querySelector("[data-stage].active")?.dataset.stage || "peak");
  };

  languageButton.addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  document.querySelectorAll("[data-engine]").forEach(button => button.addEventListener("click", () => setEngine(button.dataset.engine)));
  document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => setDevice(button.dataset.device)));
  document.querySelectorAll("[data-stage]").forEach(button => button.addEventListener("click", () => setStage(button.dataset.stage)));

  const updateClock = () => {
    document.querySelector("#isevClock").textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  };
  updateClock();
  setInterval(updateClock, 1000);
  setLanguage(language);
})();
