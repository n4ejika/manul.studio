(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("corporateLanguage");
  const themeButton = document.getElementById("corporateTheme");
  const canvas = document.getElementById("architectureCanvas");
  const code = document.getElementById("architectureCode");
  const readout = document.getElementById("architectureReadout");
  const modeButtons = [...document.querySelectorAll(".architecture-switch button")];
  const mapCenter = canvas.querySelector(".map-center");
  const mapNodes = [...canvas.querySelectorAll(".map-node")];
  const mapSvg = canvas.querySelector("svg");
  const mapLines = [...mapSvg.querySelectorAll("line")];
  const nodeLabels = mapNodes.map(node => node.querySelector("span"));
  let language = localStorage.getItem("manul-system-language") || "ru";
  let mode = "products";
  let connectionFrame = 0;
  let corporateCalculator;

  const modes = {
    products: {
      code: "01 / PRODUCTS",
      ru: ["Продукты", "Услуги", "Решения", "Отрасли", "Экспертиза", "Контакты"],
      en: ["Products", "Services", "Solutions", "Industries", "Expertise", "Contact"],
      note: {
        ru: "Каждое направление получает собственный маршрут и точку обращения.",
        en: "Each business line receives its own journey and enquiry point.",
      },
    },
    audiences: {
      code: "02 / AUDIENCES",
      ru: ["Клиенты", "Партнёры", "Инвесторы", "Соискатели", "СМИ", "Контакты"],
      en: ["Clients", "Partners", "Investors", "Candidates", "Media", "Contact"],
      note: {
        ru: "Один бизнес объясняется по-разному людям с разными задачами.",
        en: "One business is explained differently to people with different needs.",
      },
    },
    regions: {
      code: "03 / REGIONS",
      ru: ["Главный регион", "Город", "Филиалы", "Федеральный спрос", "Международный", "Контакты"],
      en: ["Primary region", "City", "Branches", "National demand", "International", "Contact"],
      note: {
        ru: "География меняет структуру спроса, страниц и точек присутствия.",
        en: "Geography changes demand architecture, pages and presence points.",
      },
    },
  };

  const money = value => ManulCalculator.formatMoney(value, language);

  function updateConnections() {
    const canvasRect = canvas.getBoundingClientRect();
    const centerRect = mapCenter.getBoundingClientRect();
    const width = Math.max(1, canvasRect.width);
    const height = Math.max(1, canvasRect.height);
    const x1 = centerRect.left + centerRect.width / 2 - canvasRect.left;
    const y1 = centerRect.top + centerRect.height / 2 - canvasRect.top;

    mapSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    mapLines.forEach((line, index) => {
      const nodeRect = mapNodes[index].getBoundingClientRect();
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", nodeRect.left + nodeRect.width / 2 - canvasRect.left);
      line.setAttribute("y2", nodeRect.top + nodeRect.height / 2 - canvasRect.top);
    });
  }

  function animateConnections(duration = 420) {
    cancelAnimationFrame(connectionFrame);
    const started = performance.now();
    const draw = now => {
      updateConnections();
      if (now - started < duration) connectionFrame = requestAnimationFrame(draw);
    };
    connectionFrame = requestAnimationFrame(draw);
  }

  function renderMode(next) {
    mode = next;
    const data = modes[mode];
    canvas.classList.remove("mode-audiences", "mode-regions");
    if (mode !== "products") canvas.classList.add(`mode-${mode}`);
    code.textContent = data.code;
    readout.textContent = data.note[language];
    nodeLabels.forEach((label, index) => { label.textContent = data[language][index]; });
    modeButtons.forEach(button => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    animateConnections();
  }

  function updatePrices() {
    return corporateCalculator?.update();
  }

  function applyLanguage(next) {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("main [data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    document.querySelector(".architecture").setAttribute("aria-label", language === "ru" ? "Интерактивная карта корпоративного сайта" : "Interactive corporate website map");
    document.querySelector(".architecture-switch").setAttribute("aria-label", language === "ru" ? "Способ организации сайта" : "Website organisation mode");
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    document.getElementById("corporateHeroPrice").textContent = language === "ru" ? "500 000 ₽" : "$8,300";
    document.getElementById("corporateScopePrice").textContent = language === "ru" ? "от 500 000 ₽" : "from $8,300";
    renderMode(mode);
    updatePrices();
  }

  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  modeButtons.forEach(button => button.addEventListener("click", () => renderMode(button.dataset.mode)));
  mapNodes.forEach(button => button.addEventListener("click", () => {
    mapNodes.forEach(item => item.classList.toggle("active", item === button));
  }));
  window.addEventListener("resize", () => animateConnections(180));
  new ResizeObserver(() => animateConnections(180)).observe(canvas);
  corporateCalculator = ManulCalculator.mount({
    inputs: {
      pages: "#corpPages",
      services: "#corpServices",
      contours: "#corpContours",
      complexity: "#corpComplexity"
    },
    outputs: {
      pages: "#corpPagesValue",
      services: "#corpServicesValue",
      contours: "#corpContoursValue",
      research: "#corpResearch",
      development: "#corpDevelopment",
      seo: "#corpSeo",
      advertising: "#corpAdvertising",
      business: "#corpBusiness",
      total: "#corpTotal"
    },
    formatMoney: money
  });
  ManulCalculator.bindMobileTotal({ source: "#corpTotal", target: "#corpMobileTotal" });
  document.querySelectorAll("details").forEach(details => details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll("details").forEach(item => { if (item !== details) item.open = false; });
  }));
  applyLanguage(language);
})();
