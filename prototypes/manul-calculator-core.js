(() => {
  const config = Object.freeze({
    pageMinimum: 5,
    pageMinimumByLanguage: Object.freeze({ ru: 5, en: 5 }),
    pageMaximum: 100,
    serviceMinimum: 10,
    serviceMaximum: 60,
    contourMinimum: 1,
    contourMaximum: 6,
    roundingSteps: Object.freeze({ ru: 5000, en: 100 })
  });

  const priceBooks = Object.freeze({
    ru: Object.freeze({
      websiteDevelopment: 300000,
      commercialLaunch: 500000,
      landingDevelopment: 300000,
      landing: 350000,
      corporateDevelopment: 300000,
      corporateLaunch: 500000,
      redesignDiagnosis: 50000,
      adsSetup: 50000,
      adsManagementStable: 10000,
      adsManagementRegional: 20000,
      adsManagementScale: 40000,
      supportMonthly: 20000,
      managementMonthly: 85000
    }),
    en: Object.freeze({
      websiteDevelopment: 4000,
      commercialLaunch: 6000,
      landingDevelopment: 3000,
      landing: 5000,
      corporateDevelopment: 10000,
      corporateLaunch: 14000,
      redesignDiagnosis: 1500,
      adsSetup: 1500,
      adsManagementStable: 750,
      adsManagementRegional: 1500,
      adsManagementScale: 3000,
      supportMonthly: 1000,
      managementMonthly: 3500
    })
  });

  const normalizeLanguage = language => language === "en" ? "en" : "ru";
  const roundUp = (value, step) => Math.ceil(value / step) * step;
  const getPrice = (key, language = "ru") => priceBooks[normalizeLanguage(language)][key];

  const formatMoney = (value, language = "ru") => normalizeLanguage(language) === "en"
    ? `$${Math.round(value).toLocaleString("en-US")}`
    : `${Math.round(value).toLocaleString("ru-RU")} ₽`;

  const developmentPrice = (pages, language = "ru") => {
    const activeLanguage = normalizeLanguage(language);
    let raw;
    if (activeLanguage === "en") {
      if (pages <= 7) raw = 4000;
      else if (pages <= 15) raw = 7000;
      else if (pages <= 50) raw = 7000 + (pages - 15) * 300;
      else raw = 17500 + (pages - 50) * 250;
    } else if (pages <= 15) raw = 300000;
    else if (pages <= 50) raw = 300000 + (pages - 15) * 12000;
    else raw = 720000 + (pages - 50) * 9600;
    return roundUp(raw, config.roundingSteps[activeLanguage]);
  };

  const introductoryPrice = (value, language = "ru") => normalizeLanguage(language) === "en"
    ? roundUp(value * .7, config.roundingSteps.en)
    : value;

  const redesignBands = Object.freeze([
    Object.freeze({ key: "visual", minimum: 0, maximum: .1 }),
    Object.freeze({ key: "preservation", minimum: .1, maximum: .2 }),
    Object.freeze({ key: "migration", minimum: .2, maximum: .35 }),
    Object.freeze({ key: "legacy", minimum: null, maximum: .5 })
  ]);

  const calculate = ({ pages, services, contours, complexity = 1, mode = "launch" }, language = "ru") => {
    const activeLanguage = normalizeLanguage(language);
    const minimumPages = config.pageMinimumByLanguage[activeLanguage];
    const pageCount = Math.max(minimumPages, Number(pages));
    const serviceCount = Number(services);
    const contourCount = Number(contours);
    const complexityMultiplier = Number(complexity);
    const keywordCount = serviceCount * 10;
    const pageSteps = Math.ceil(Math.max(0, pageCount - 15) / 15);
    const serviceSteps = Math.ceil(Math.max(0, serviceCount - 10) / 10);
    const keywordSteps = Math.ceil(Math.max(0, keywordCount - 100) / 100);
    const research = activeLanguage === "en"
      ? (pageCount <= 15
        ? (pageCount <= 7 ? 500 : 700)
        : 700 + pageSteps * 500 + serviceSteps * 300 + keywordSteps * 300)
      : 40000 + pageSteps * 10000 + serviceSteps * 10000 + keywordSteps * 10000;
    const development = roundUp(
      developmentPrice(pageCount, activeLanguage) * complexityMultiplier,
      config.roundingSteps[activeLanguage]
    );
    const seo = activeLanguage === "en"
      ? (pageCount <= 15
        ? (pageCount <= 7 ? 700 : 1000)
        : 1000 + pageSteps * 500 + keywordSteps * 500)
      : 80000 + pageSteps * 10000 + keywordSteps * 15000;
    const advertising = activeLanguage === "en"
      ? (pageCount <= 7 ? 600 : 1000) + (contourCount - 1) * 500
      : 50000 + (contourCount - 1) * 15000;
    const business = activeLanguage === "en"
      ? (pageCount <= 7 ? 200 : 300) + Math.ceil(Math.max(0, serviceCount - 20) / 20) * 200
      : 30000 + Math.ceil(Math.max(0, serviceCount - 20) / 20) * 5000;

    const launchTotal = research + development + seo + advertising + business;
    const activeMode = mode === "development" ? "development" : "launch";
    const total = activeMode === "development" ? development : launchTotal;

    return Object.freeze({
      pages: pageCount,
      services: serviceCount,
      contours: contourCount,
      complexity: complexityMultiplier,
      mode: activeMode,
      currency: activeLanguage === "en" ? "USD" : "RUB",
      research,
      development,
      seo,
      advertising,
      business,
      developmentTotal: development,
      launchTotal,
      total,
      introductoryTotal: introductoryPrice(total, activeLanguage)
    });
  };

  const seoMarkets = Object.freeze({
    ru: Object.freeze({
      local: Object.freeze({ multiplier: 1, minimum: 50000 }),
      major: Object.freeze({ multiplier: 1.4, minimum: 70000 }),
      country: Object.freeze({ multiplier: 1.8, minimum: 90000 }),
      international: Object.freeze({ multiplier: 2.4, minimum: 120000 })
    }),
    en: Object.freeze({
      local: Object.freeze({ multiplier: 1, minimum: 2000 }),
      major: Object.freeze({ multiplier: 1.25, minimum: 2500 }),
      country: Object.freeze({ multiplier: 1.5, minimum: 3000 }),
      international: Object.freeze({ multiplier: 2, minimum: 4000 })
    })
  });

  const calculateSeo = ({ queries = 100, pages = 15, market = "local" }, language = "ru") => {
    const activeLanguage = normalizeLanguage(language);
    const queryCount = Math.max(100, Number(queries));
    const pageCount = Math.max(15, Number(pages));
    const marketConfig = seoMarkets[activeLanguage][market] || seoMarkets[activeLanguage].local;
    const querySteps = Math.ceil(Math.max(0, queryCount - 100) / 100);
    const pageSteps = Math.ceil(Math.max(0, pageCount - 15) / 15);
    const base = activeLanguage === "en"
      ? 2000 + querySteps * 500 + pageSteps * 300
      : 50000 + querySteps * 15000 + pageSteps * 10000;
    const total = Math.max(
      marketConfig.minimum,
      roundUp(base * marketConfig.multiplier, config.roundingSteps[activeLanguage])
    );
    return Object.freeze({
      queries: queryCount,
      pages: pageCount,
      market,
      multiplier: marketConfig.multiplier,
      currency: activeLanguage === "en" ? "USD" : "RUB",
      base,
      total
    });
  };

  const element = target => typeof target === "string" ? document.querySelector(target) : target;

  const enhanceSelect = target => {
    const select = element(target);
    if (!select) return null;
    if (select.dataset.manulSelect === "ready" && select.manulSelect) return select.manulSelect;
    if (select.dataset.manulSelect === "ready") {
      select.nextElementSibling?.matches(".manul-select") && select.nextElementSibling.remove();
      delete select.dataset.manulSelect;
      select.classList.remove("manul-select__native");
    }

    select.dataset.manulSelect = "ready";
    select.classList.add("manul-select__native");

    const control = document.createElement("div");
    control.className = "manul-select";
    const trigger = document.createElement("button");
    trigger.className = "manul-select__trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const value = document.createElement("span");
    const arrow = document.createElement("i");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↓";
    trigger.append(value, arrow);

    const menu = document.createElement("div");
    menu.className = "manul-select__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    control.append(trigger, menu);
    select.insertAdjacentElement("afterend", control);

    const close = () => {
      menu.hidden = true;
      control.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      document.querySelectorAll(".manul-select.is-open").forEach(item => {
        if (item !== control) item.querySelector(".manul-select__trigger")?.click();
      });
      menu.hidden = false;
      control.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      menu.querySelector('[aria-selected="true"]')?.focus();
    };

    const refresh = () => {
      value.textContent = select.selectedOptions[0]?.textContent || "";
      menu.replaceChildren(...[...select.options].map(option => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "manul-select__option";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(option.selected));
        item.dataset.value = option.value;
        item.textContent = option.textContent;
        item.addEventListener("click", () => {
          select.value = option.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          close();
          trigger.focus();
        });
        return item;
      }));
    };

    trigger.addEventListener("click", () => menu.hidden ? open() : close());
    control.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        close();
        trigger.focus();
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (menu.hidden) open();
      const options = [...menu.querySelectorAll(".manul-select__option")];
      const current = options.indexOf(document.activeElement);
      let next = current;
      if (event.key === "ArrowDown") next = Math.min(options.length - 1, current + 1);
      if (event.key === "ArrowUp") next = Math.max(0, current < 0 ? options.length - 1 : current - 1);
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = options.length - 1;
      options[next]?.focus();
    });
    document.addEventListener("pointerdown", event => {
      if (!control.contains(event.target)) close();
    });
    select.addEventListener("change", refresh);
    new MutationObserver(refresh).observe(select, { childList: true, subtree: true, characterData: true });
    refresh();

    const api = Object.freeze({ close, open, refresh });
    select.manulSelect = api;
    return api;
  };

  const mount = ({ inputs, outputs, formatMoney, language = "ru", mode = "launch", introductory = false }) => {
    const fields = Object.fromEntries(Object.entries(inputs).map(([key, target]) => [key, element(target)]));
    const destinations = Object.fromEntries(Object.entries(outputs).map(([key, target]) => [key, element(target)]));
    const missing = [...Object.entries(fields), ...Object.entries(destinations)]
      .filter(([, target]) => !target)
      .map(([key]) => key);
    if (missing.length) throw new Error(`ManulCalculator: missing elements: ${missing.join(", ")}`);
    enhanceSelect(fields.complexity);

    const update = () => {
      const activeLanguage = normalizeLanguage(typeof language === "function" ? language() : language);
      const result = calculate({
        pages: fields.pages.value,
        services: fields.services.value,
        contours: fields.contours.value,
        complexity: fields.complexity.value,
        mode: typeof mode === "function" ? mode() : mode
      }, activeLanguage);
      destinations.pages.textContent = result.pages;
      destinations.services.textContent = result.services;
      destinations.contours.textContent = result.contours;
      destinations.research.textContent = formatMoney(result.research);
      destinations.development.textContent = formatMoney(result.development);
      destinations.seo.textContent = formatMoney(result.seo);
      destinations.advertising.textContent = formatMoney(result.advertising);
      destinations.business.textContent = formatMoney(result.business);
      const showIntroductory = typeof introductory === "function" ? introductory() : introductory;
      destinations.total.textContent = formatMoney(showIntroductory ? result.introductoryTotal : result.total);
      if (destinations.standardTotal) destinations.standardTotal.textContent = formatMoney(result.total);
      return result;
    };

    [fields.pages, fields.services, fields.contours].forEach(input => input.addEventListener("input", update));
    fields.complexity.addEventListener("change", update);
    update();
    return Object.freeze({ update });
  };

  const bindMobileTotal = ({ source, target }) => {
    const sourceElement = element(source);
    const targetElement = element(target);
    if (!sourceElement || !targetElement) {
      throw new Error("ManulCalculator: missing mobile total source or target");
    }
    const sync = () => {
      targetElement.textContent = sourceElement.textContent;
    };
    const observer = new MutationObserver(sync);
    observer.observe(sourceElement, { childList: true, characterData: true, subtree: true });
    sync();
    return Object.freeze({ sync, disconnect: () => observer.disconnect() });
  };

  globalThis.ManulCalculator = Object.freeze({
    config,
    priceBooks,
    getPrice,
    calculate,
    calculateSeo,
    seoMarkets,
    redesignBands,
    developmentPrice,
    introductoryPrice,
    formatMoney,
    enhanceSelect,
    mount,
    bindMobileTotal
  });

  document.querySelectorAll("select").forEach(enhanceSelect);
})();
