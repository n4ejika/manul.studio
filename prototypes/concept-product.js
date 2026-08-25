(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("productLanguage");
  const themeButton = document.getElementById("productTheme");
  let language = localStorage.getItem("manul-system-language") === "en" ? "en" : "ru";

  const money = value => ManulCalculator.formatMoney(value, language);

  const modules = {
    research: {
      index: 0,
      code: "01 / RESEARCH",
      titleRu: "Карта спроса и структура сайта",
      titleEn: "Demand map and website structure",
      textRu: "Понимаем, какие услуги, страницы и формулировки действительно нужны до начала дизайна и разработки.",
      textEn: "We define which services, pages and messages are genuinely needed before design and development begin.",
      artifactsRu: ["группы спроса", "карта конкурентов", "структура URL"],
      artifactsEn: ["demand groups", "competitor map", "URL structure"]
    },
    site: {
      index: 1,
      code: "02 / WEBSITE",
      titleRu: "Готовый сайт",
      titleEn: "A complete website",
      textRu: "Создаём три различающихся решения ключевой страницы, утверждаем одно направление и на его основе собираем дизайн-систему, содержание и адаптивную разработку.",
      textEn: "We create three distinct concepts for the key page, approve one direction and use it to build the design system, content and responsive website.",
      artifactsRu: ["3 решения ключевой страницы", "дизайн-система", "опубликованный сайт"],
      artifactsEn: ["3 key-page concepts", "design system", "published website"]
    },
    seo: {
      index: 2,
      code: "03 / SEO",
      titleRu: "Базовая подготовка к поиску",
      titleEn: "Baseline search preparation",
      textRu: "До публикации распределяем запросы по страницам, готовим метаданные, внутренние связи и технические требования. Это основа запуска, а не ежемесячное продвижение.",
      textEn: "Before publication, we map queries to pages and prepare metadata, internal links and technical requirements. This is launch preparation, not ongoing monthly SEO.",
      artifactsRu: ["карта запросов", "метаданные", "техническая проверка"],
      artifactsEn: ["query map", "metadata", "technical review"]
    },
    ads: {
      index: 3,
      code: "04 / ACQUISITION",
      titleRu: "Первая рекламная кампания и аналитика",
      titleEn: "Initial ad campaign and analytics",
      textRu: "Настраиваем Метрику, цели и первую рекламную кампанию, чтобы после публикации видеть источники трафика и обращений.",
      textEn: "We set up analytics, goals and the initial ad campaign so the launch immediately begins producing data and leads.",
      artifactsRu: ["Метрика и цели", "рекламная кампания", "источники обращений"],
      artifactsEn: ["analytics and goals", "ad campaign", "lead sources"]
    },
    business: {
      index: 4,
      code: "05 / LOCAL",
      titleRu: "Присутствие в Яндекс Бизнесе",
      titleEn: "Business profile and local presence",
      textRu: "Настраиваем или перестраиваем карточку и связываем её с общей аналитикой и привлечением.",
      textEn: "We create or rebuild the listing and connect it to shared analytics and acquisition.",
      artifactsRu: ["карточка компании", "услуги и данные", "рекламная готовность"],
      artifactsEn: ["business listing", "services and data", "ad-ready profile"]
    }
  };

  const productContent = {
    site: {
      labelRu: "Только сайт",
      labelEn: "Website only",
      descriptionRu: "Готовый сайт без настройки SEO, аналитики и рекламы",
      descriptionEn: "A complete website without SEO, analytics and advertising setup",
      price: 300000,
      included: 1
    },
    launch: {
      labelRu: "Коммерческий запуск",
      labelEn: "Commercial launch",
      descriptionRu: "Сайт, исследование, базовое SEO, аналитика и первый рекламный запуск",
      descriptionEn: "Website, research, baseline SEO, analytics and the initial advertising launch",
      price: 500000,
      included: 5
    }
  };
  const moduleTones = ["#bfff35", "#bfff35", "#bfff35", "#bfff35", "#bfff35"];
  const assembly = document.getElementById("launchAssembly");
  const assemblyNodes = [...document.querySelectorAll("[data-assembly]")];
  const assemblyInspector = document.querySelector(".assembly-inspector");
  const assemblyStageCode = document.getElementById("assemblyStageCode");
  const assemblyStageTitle = document.getElementById("assemblyStageTitle");
  const assemblyStageText = document.getElementById("assemblyStageText");
  const selectAssemblyModule = key => {
    const module = modules[key];
    if (!module) return;
    assemblyNodes.forEach(node => {
      const selected = node.dataset.assembly === key;
      node.classList.toggle("selected", selected);
      node.setAttribute("aria-pressed", String(selected));
    });
    assemblyStageCode.textContent = module.code;
    assemblyStageTitle.textContent = module[`title${language === "ru" ? "Ru" : "En"}`];
    assemblyStageText.textContent = module[`text${language === "ru" ? "Ru" : "En"}`];
    assemblyInspector.style.setProperty("--active-tone", moduleTones[module.index]);
  };

  const applyLanguage = nextLanguage => {
    language = nextLanguage;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    document.querySelectorAll("[data-price]").forEach(element => {
      element.textContent = money(Number(element.dataset.price));
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Switch color theme");
    document.querySelector(".price-switch button.active")?.click();
    document.querySelector(".module-line button.active")?.click();
    const selectedAssembly = document.querySelector(".assembly-node.selected");
    selectAssemblyModule(selectedAssembly?.dataset.assembly || "research");
    updateEstimate();
  };

  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));

  const updatePageProgress = () => {
    const available = document.documentElement.scrollHeight - innerHeight;
    const progress = available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)) : 0;
    root.style.setProperty("--page-progress", progress.toFixed(2));
  };
  addEventListener("scroll", updatePageProgress, { passive: true });
  addEventListener("resize", updatePageProgress);
  updatePageProgress();

  const assemblyField = document.querySelector(".assembly-field");
  if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    assemblyField.addEventListener("pointermove", event => {
      const rect = assemblyField.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 18;
      root.style.setProperty("--assembly-x", `${x}px`);
      root.style.setProperty("--assembly-y", `${y}px`);
    });
    assemblyField.addEventListener("pointerleave", () => {
      root.style.setProperty("--assembly-x", "0px");
      root.style.setProperty("--assembly-y", "0px");
    });
  }

  const finalSection = document.querySelector(".product-final");
  if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finalSection.addEventListener("pointermove", event => {
      const rect = finalSection.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 24;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 24;
      root.style.setProperty("--final-x", `${x}px`);
      root.style.setProperty("--final-y", `${y}px`);
    });
    finalSection.addEventListener("pointerleave", () => {
      root.style.setProperty("--final-x", "0px");
      root.style.setProperty("--final-y", "0px");
    });
  }

  const heroProductLabel = document.getElementById("heroProductLabel");
  const heroPrice = document.getElementById("heroPrice");
  const heroCurrency = document.getElementById("heroCurrency");
  const heroDescription = document.getElementById("heroProductDescription");
  const heroIncludes = [...document.querySelectorAll("#heroIncludes li")];
  document.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => {
      const product = productContent[button.dataset.product];
      document.querySelectorAll("[data-product]").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      heroProductLabel.textContent = product[`label${language === "ru" ? "Ru" : "En"}`];
      const formatted = money(product.price);
      if (language === "ru") {
        heroPrice.textContent = formatted.replace(/\s?₽$/, "");
        heroCurrency.textContent = "₽";
      } else {
        heroPrice.textContent = formatted;
        heroCurrency.textContent = "";
      }
      heroDescription.textContent = product[`description${language === "ru" ? "Ru" : "En"}`];
      heroIncludes.forEach((item, index) => {
        const included = button.dataset.product === "launch" || index === 1;
        item.classList.toggle("muted", !included);
      });
      assembly.dataset.mode = button.dataset.product;
      assemblyNodes.forEach(node => {
        const included = button.dataset.product === "launch" || node.dataset.assembly === "site";
        node.classList.toggle("included", included);
      });
      selectAssemblyModule(button.dataset.product === "launch" ? "research" : "site");
    });
  });

  assemblyNodes.forEach(node => {
    node.addEventListener("click", () => {
      if (!node.classList.contains("included")) {
        document.querySelector('[data-product="launch"]').click();
      }
      selectAssemblyModule(node.dataset.assembly);
    });
  });

  const moduleCode = document.getElementById("moduleCode");
  const moduleTitle = document.getElementById("moduleTitle");
  const moduleText = document.getElementById("moduleText");
  const moduleArtifacts = document.getElementById("moduleArtifacts");
  const moduleRunner = document.querySelector(".module-runner");
  document.querySelectorAll("[data-module]").forEach(button => {
    button.addEventListener("click", () => {
      const module = modules[button.dataset.module];
      document.querySelectorAll("[data-module]").forEach(item => item.classList.toggle("active", item === button));
      moduleCode.textContent = module.code;
      moduleTitle.textContent = module[`title${language === "ru" ? "Ru" : "En"}`];
      moduleText.textContent = module[`text${language === "ru" ? "Ru" : "En"}`];
      moduleArtifacts.innerHTML = module[`artifacts${language === "ru" ? "Ru" : "En"}`].map(item => `<li>${item}</li>`).join("");
      moduleRunner.style.left = `${10 + module.index * 20}%`;
      moduleRunner.style.setProperty("--runner-tone", moduleTones[module.index]);
    });
  });

  const productCalculator = ManulCalculator.mount({
    inputs: {
      pages: "#productPages",
      services: "#productServices",
      contours: "#productContours",
      complexity: "#productComplexity"
    },
    outputs: {
      pages: "#productPagesValue",
      services: "#productServicesValue",
      contours: "#productContoursValue",
      research: "#productResearch",
      development: "#productDevelopment",
      seo: "#productSeo",
      advertising: "#productAds",
      business: "#productBusiness",
      total: "#productTotal"
    },
    formatMoney: money
  });
  ManulCalculator.bindMobileTotal({ source: "#productTotal", target: "#productMobileTotal" });
  function updateEstimate() {
    productCalculator.update();
  }

  applyLanguage(language);
})();
