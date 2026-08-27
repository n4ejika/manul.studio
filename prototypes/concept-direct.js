(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("directLanguage");
  const themeButton = document.getElementById("directTheme");
  let language = localStorage.getItem("manul-system-language") === "en" ? "en" : "ru";

  const content = {
    nodes: {
      goal: {
        code: "01 / BUSINESS GOAL",
        ru: ["Определяем, какое обращение важно бизнесу.", "Фиксируем целевое действие и критерии качества, по которым можно проверять результат рекламы."],
        en: ["Define which enquiry matters to the business.", "We establish the target action and quality criteria used to evaluate advertising results."]
      },
      signal: {
        code: "02 / DEMAND SIGNAL",
        ru: ["Отделяем намерение купить от фонового интереса.", "Спрос, география, конкуренты и ограничения продукта формируют рекламную архитектуру."],
        en: ["We separate buying intent from background interest.", "Demand, market, competition and product constraints shape the campaign architecture."]
      },
      campaign: {
        code: "03 / CAMPAIGN LOGIC",
        ru: ["Подбираем рекламные инструменты под задачу.", "Форматы и способы размещения зависят от продукта, спроса, географии, данных и цели рекламы."],
        en: ["Choose advertising tools around the task.", "Formats and placements depend on the product, demand, market, data and advertising goal."]
      },
      conversion: {
        code: "04 / MEASURED ACTION",
        ru: ["Передаём алгоритму действие, которое можно проверить.", "Форма, звонок, сообщение или заказ становятся данными, а не красивой цифрой в отчёте."],
        en: ["We give the algorithm an action that can be verified.", "A form, call, message or purchase becomes usable data, not a decorative report metric."]
      },
      quality: {
        code: "05 / BUSINESS OUTCOME",
        ru: ["Сверяем рекламную конверсию с качеством обращения.", "CRM и обратная связь показывают, какие кампании приводят клиентов, а какие только заполняют формы."],
        en: ["We match ad conversions against lead quality.", "CRM feedback shows which campaigns create customers and which merely fill forms."]
      }
    },
    scope: {
      research: {
        code: "01 / RESEARCH",
        ru: ["Находим спрос, который может стать обращением.", "Разбираем продукт, конкурентов, географию и посадочные страницы. Определяем направления, ограничения и предварительный рекламный бюджет.", ["карта спроса", "структура направлений", "медиаплан"]],
        en: ["Find demand that can become a lead.", "We study the product, competitors, market and landing pages, then define campaign directions, constraints and an initial media budget.", ["demand map", "offer structure", "media plan"]]
      },
      measurement: {
        code: "02 / MEASUREMENT",
        ru: ["Настраиваем данные до включения рекламы.", "Проверяем Метрику, цели, формы, звонки и сообщения. При необходимости проектируем передачу квалифицированных обращений из CRM.", ["Метрика и цели", "события форм", "контроль источника"]],
        en: ["Set up data before switching ads on.", "We check GA4, tags, forms, calls and messages. When needed, we design qualified-lead feedback from the CRM.", ["analytics and tags", "form events", "source control"]]
      },
      build: {
        code: "03 / CAMPAIGN BUILD",
        ru: ["Собираем рекламу под выбранные направления.", "Готовим кампании, аудитории, тематические слова, объявления, изображения, ссылки, ограничения и всё необходимое для запуска.", ["кампании и объявления", "креативы", "маркировка"]],
        en: ["Build advertising around the selected directions.", "We prepare campaigns, audiences, themes, copy, images, links, constraints and everything required for launch.", ["campaigns and ads", "creative assets", "compliance"]]
      },
      control: {
        code: "04 / FIRST 30 DAYS",
        ru: ["Контролируем первые 30 дней после запуска.", "Проверяем расход, конверсии, запросы, модерацию и качество обращений. Накопленные данные становятся основой для следующих решений.", ["контроль бюджета", "качество лидов", "решения по данным"]],
        en: ["Control the first 30 days after launch.", "We review spend, conversions, queries, moderation and lead quality. Accumulated data becomes the basis for further decisions.", ["budget control", "lead quality", "data-led decisions"]]
      }
    }
  };

  const formatMoney = value => ManulCalculator.formatMoney(value, language);

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    document.querySelectorAll("[data-price-key]").forEach(element => {
      element.textContent = formatMoney(ManulCalculator.getPrice(element.dataset.priceKey, language));
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Switch color theme");
    document.title = language === "ru"
      ? "Настройка Яндекс Директа — от 50 000 ₽ | Manul"
      : "Google Ads setup — from $1,500 | Manul";
    selectNode(document.querySelector(".system-node.active")?.dataset.node || "goal");
    selectScope(document.querySelector(".scope-tabs button.active")?.dataset.scope || "research");
  }

  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));

  const nodeCode = document.getElementById("nodeCode");
  const nodeTitle = document.getElementById("nodeTitle");
  const nodeText = document.getElementById("nodeText");
  function selectNode(key) {
    const item = content.nodes[key];
    if (!item) return;
    document.querySelectorAll(".system-node").forEach(button => {
      const active = button.dataset.node === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    nodeCode.textContent = item.code;
    nodeTitle.textContent = item[language][0];
    nodeText.textContent = item[language][1];
  }
  document.querySelectorAll(".system-node").forEach(button => {
    button.addEventListener("click", () => selectNode(button.dataset.node));
  });

  const scopeCode = document.getElementById("scopeCode");
  const scopeTitle = document.getElementById("scopeTitle");
  const scopeText = document.getElementById("scopeText");
  const scopeArtifacts = document.getElementById("scopeArtifacts");
  function selectScope(key) {
    const item = content.scope[key];
    if (!item) return;
    document.querySelectorAll(".scope-tabs button").forEach(button => {
      const active = button.dataset.scope === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    scopeCode.textContent = item.code;
    scopeTitle.textContent = item[language][0];
    scopeText.textContent = item[language][1];
    scopeArtifacts.innerHTML = item[language][2].map(label => `<li>${label}</li>`).join("");
  }
  document.querySelectorAll(".scope-tabs button").forEach(button => {
    button.addEventListener("click", () => selectScope(button.dataset.scope));
  });

  function updateProgress() {
    const available = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty("--progress", available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)).toFixed(2) : "0");
  }
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);

  const clock = document.getElementById("systemClock");
  function updateClock() {
    clock.textContent = new Date().toLocaleTimeString(language === "ru" ? "ru-RU" : "en-GB", { hour12: false });
  }
  updateClock();
  setInterval(updateClock, 1000);
  updateProgress();
  applyLanguage(language);
})();
