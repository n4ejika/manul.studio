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
      code: "YANDEX / 355 QUERIES",
      value: "82,5%",
      top10: "56,3%",
      top30: "77,5%",
      absent: "62",
      labelRu: "запросов с позицией",
      labelEn: "of queries with a rank",
      noteRu: "293 запроса имеют позиции в Яндексе; 200 из них находятся в ТОП‑10.",
      noteEn: "293 queries rank in Yandex; 200 of them are in the Top 10."
    },
    google: {
      code: "GOOGLE / 355 QUERIES",
      value: "14,4%",
      top10: "1,1%",
      top30: "14,4%",
      absent: "304",
      labelRu: "запросов с позицией",
      labelEn: "of queries with a rank",
      noteRu: "51 запрос имеет позицию в Google; четыре находятся в ТОП‑10.",
      noteEn: "51 queries rank in Google; four are in the Top 10."
    }
  };

  const devices = {
    iphone: {
      code: "IPHONE / 82 QUERIES",
      titleRu: "Ремонт iPhone",
      titleEn: "iPhone repair",
      top10: "79,3%",
      top30: "96,3%",
      noteRu: "65 из 82 запросов находятся в ТОП‑10; 79 — в ТОП‑30.",
      noteEn: "65 of 82 queries rank in the Top 10; 79 rank in the Top 30.",
      device: "iPhone",
      page: "/remont-iphone/"
    },
    samsung: {
      code: "SAMSUNG / 18 QUERIES",
      titleRu: "Ремонт Samsung",
      titleEn: "Samsung repair",
      top10: "38,9%",
      top30: "88,9%",
      noteRu: "7 из 18 запросов находятся в ТОП‑10; 16 — в ТОП‑30.",
      noteEn: "7 of 18 queries rank in the Top 10; 16 rank in the Top 30.",
      device: "Samsung",
      page: "/remont-telefonov/samsung/"
    },
    xiaomi: {
      code: "XIAOMI / 19 QUERIES",
      titleRu: "Ремонт Xiaomi",
      titleEn: "Xiaomi repair",
      top10: "100%",
      top30: "100%",
      noteRu: "Все 19 запросов направления находятся в ТОП‑10 Яндекса.",
      noteEn: "All 19 queries in this category rank in Yandex Top 10.",
      device: "Xiaomi",
      page: "/service/servisnyj-centr-xiaomi-v-sevastopole/remont-telefonov-xiaomi-v-sevastopole/"
    },
    laptop: {
      code: "LAPTOP / 46 QUERIES",
      titleRu: "Ремонт ноутбуков",
      titleEn: "Laptop repair",
      top10: "28,3%",
      top30: "58,7%",
      noteRu: "13 из 46 запросов находятся в ТОП‑10; 27 — в ТОП‑30.",
      noteEn: "13 of 46 queries rank in the Top 10; 27 rank in the Top 30.",
      device: "Laptop",
      page: "/remont-noutbukov/"
    },
    tv: {
      code: "TV / 49 QUERIES",
      titleRu: "Ремонт телевизоров",
      titleEn: "TV repair",
      top10: "28,6%",
      top30: "55,1%",
      noteRu: "14 из 49 запросов находятся в ТОП‑10; 27 — в ТОП‑30.",
      noteEn: "14 of 49 queries rank in the Top 10; 27 rank in the Top 30.",
      device: "TV",
      page: "/remont-televizorov/"
    },
    computer: {
      code: "COMPUTER / 17 QUERIES",
      titleRu: "Ремонт компьютеров",
      titleEn: "Computer repair",
      top10: "11,8%",
      top30: "23,5%",
      noteRu: "2 из 17 запросов находятся в ТОП‑10; 4 — в ТОП‑30.",
      noteEn: "2 of 17 queries rank in the Top 10; 4 rank in the Top 30.",
      device: "Computer",
      page: "/remont-kompyuterov/"
    }
  };

  const stages = {
    start: {
      codeRu: "01 / ТОП‑3 ЯНДЕКСА",
      codeEn: "01 / YANDEX TOP 3",
      titleRu: "Самая заметная зона выдачи.",
      titleEn: "The most visible area of the results page.",
      textRu: "44 из 355 локальных запросов находятся в первых трёх результатах.",
      textEn: "44 of 355 local queries rank in the first three results.",
      value: "44",
      gauge: "12.4%"
    },
    peak: {
      codeRu: "02 / ТОП‑10 ЯНДЕКСА",
      codeEn: "02 / YANDEX TOP 10",
      titleRu: "Основная зона коммерческой видимости.",
      titleEn: "The main area of commercial visibility.",
      textRu: "200 из 355 локальных запросов находятся на первой странице результатов.",
      textEn: "200 of 355 local queries rank on the first results page.",
      value: "200",
      gauge: "56.3%"
    },
    finish: {
      codeRu: "03 / ТОП‑30 ЯНДЕКСА",
      codeEn: "03 / YANDEX TOP 30",
      titleRu: "Широкий контур поискового присутствия.",
      titleEn: "The broader search-presence layer.",
      textRu: "275 из 355 локальных запросов находятся в пределах первых тридцати результатов.",
      textEn: "275 of 355 local queries rank within the first thirty results.",
      value: "275",
      gauge: "77.5%"
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
