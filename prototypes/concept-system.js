(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("systemTheme");
  const themeLabel = themeToggle.querySelector("span");
  const languageToggle = document.getElementById("systemLanguage");
  const clock = document.getElementById("systemClock");
  const canvas = document.getElementById("systemCanvas");
  const coreCode = document.getElementById("coreCode");
  const coreTitle = document.getElementById("coreTitle");
  const coreText = document.getElementById("coreText");
  const coreOutput = document.getElementById("coreOutput");
  const liveStage = document.getElementById("liveStage");
  const consoleRows = document.getElementById("consoleRows");
  const nodeSitePrice = document.getElementById("nodeSitePrice");
  const nodeLaunchPrice = document.getElementById("nodeLaunchPrice");
  const liveBasePrice = document.getElementById("liveBasePrice");
  const liveBaseUnit = document.getElementById("liveBaseUnit");
  const ongoingWorkLink = document.getElementById("ongoingWorkLink");
  let currentLanguage = localStorage.getItem("manul-system-language") === "en" ? "en" : "ru";
  let activeStageKey = "task";
  let colorStageKey = "task";
  const stageColors = {
    task: "#ff3131",
    demand: "#ff6500",
    structure: "#f4ff00",
    site: "#bfff35",
    launch: "#00f0ff",
    leads: "#4263ff",
    growth: "#d946ff"
  };

  const stages = {
    task: {
      number: "01",
      code: "MANUL / ЗАДАЧА",
      title: "Сначала —<br>изменение в бизнесе.",
      text: "Фиксируем, что должно измениться после запуска и по каким данным это можно увидеть.",
      outputs: ["цель проекта", "критерий результата", "ограничения"],
      console: ["Цель проекта зафиксирована", "Критерий результата определён", "Ограничения собраны"]
    },
    demand: {
      number: "02",
      code: "MANUL / СПРОС",
      title: "Спрос показывает,<br>что нужно создать.",
      text: "Изучаем формулировки, конкурентов, регионы и реальные группы потребностей до проектирования страниц.",
      outputs: ["семантика", "группы спроса", "карта конкурентов"],
      console: ["Запросы собраны и очищены", "Интенты разделены", "Рыночные ответы проверены"]
    },
    structure: {
      number: "03",
      code: "MANUL / СТРУКТУРА",
      title: "Каждая страница<br>получает задачу.",
      text: "Распределяем спрос по URL, связываем страницы и считаем условный объём по сложности.",
      outputs: ["карта URL", "роли страниц", "условный объём"],
      console: ["Кластеры распределены", "Каннибализация исключена", "Объём рассчитан"]
    },
    site: {
      number: "04",
      code: "MANUL / САЙТ",
      title: "Решение становится<br>рабочим сайтом.",
      text: "Три варианта ключевой страницы, дизайн-система, контент, адаптивная разработка и публикация.",
      outputs: ["3 прототипа", "дизайн-система", "готовый сайт"],
      console: ["Направление утверждено", "Компоненты собраны", "QA завершён"]
    },
    launch: {
      number: "05",
      code: "MANUL / ЗАПУСК",
      title: "После публикации<br>появляются данные.",
      text: "Подготавливаем поиск, Метрику, цели, первый рекламный контур и Яндекс Бизнес.",
      outputs: ["базовое SEO", "аналитика", "первый трафик"],
      console: ["Индексация проверена", "События фиксируются", "Кампания запущена"]
    },
    leads: {
      number: "06",
      code: "MANUL / ОБРАЩЕНИЯ",
      title: "У обращения<br>есть источник.",
      text: "Заявки передаются в CRM вместе с контекстом, а реклама получает нижние бизнес-события.",
      outputs: ["источник", "квалификация", "CRM-событие"],
      console: ["Источник сохранён", "Заявка квалифицирована", "Событие передано"]
    },
    growth: {
      number: "07",
      code: "MANUL / РАЗВИТИЕ",
      title: "Данные запускают<br>следующий цикл.",
      text: "Новые страницы и изменения появляются из наблюдаемой задачи, а не из календаря услуг.",
      outputs: ["данные", "вывод", "изменение"],
      console: ["Данные накоплены", "Гипотеза сформирована", "Следующий шаг назначен"]
    }
  };

  const stagesEn = {
    task: {
      number: "01",
      code: "MANUL / TASK",
      title: "First —<br>a business change.",
      text: "We define what must change after launch and which data will make that change visible.",
      outputs: ["project goal", "success criterion", "constraints"],
      console: ["Project goal recorded", "Success criterion defined", "Constraints collected"]
    },
    demand: {
      number: "02",
      code: "MANUL / DEMAND",
      title: "Demand shows<br>what to build.",
      text: "We study search language, competitors, regions and real groups of needs before designing pages.",
      outputs: ["semantics", "demand groups", "competitor map"],
      console: ["Queries collected and cleaned", "Intents separated", "Market responses reviewed"]
    },
    structure: {
      number: "03",
      code: "MANUL / STRUCTURE",
      title: "Every page<br>gets a job.",
      text: "We map demand to URLs, connect the pages and calculate weighted scope by complexity.",
      outputs: ["URL map", "page roles", "weighted scope"],
      console: ["Clusters distributed", "Cannibalization removed", "Scope calculated"]
    },
    site: {
      number: "04",
      code: "MANUL / WEBSITE",
      title: "The solution becomes<br>a working website.",
      text: "Three key-page concepts, a design system, content, responsive development and publication.",
      outputs: ["3 concepts", "design system", "working website"],
      console: ["Direction approved", "Components assembled", "QA completed"]
    },
    launch: {
      number: "05",
      code: "MANUL / LAUNCH",
      title: "Publication starts<br>the data flow.",
      text: "We prepare search, analytics, goals, the initial ad campaign and a business profile.",
      outputs: ["baseline SEO", "analytics", "first traffic"],
      console: ["Indexing checked", "Events tracked", "Campaign launched"]
    },
    leads: {
      number: "06",
      code: "MANUL / LEADS",
      title: "Every lead<br>has a source.",
      text: "Leads reach the CRM with context, while advertising receives lower-funnel business events.",
      outputs: ["source", "qualification", "CRM event"],
      console: ["Source preserved", "Lead qualified", "Event delivered"]
    },
    growth: {
      number: "07",
      code: "MANUL / GROWTH",
      title: "Data starts<br>the next cycle.",
      text: "New pages and changes come from an observed need, not from a service calendar.",
      outputs: ["data", "insight", "change"],
      console: ["Data accumulated", "Hypothesis formed", "Next step assigned"]
    }
  };

  const englishText = {
    "Система готова":"System ready",
    "Система":"System",
    "Основатель":"Founder",
    "Расчёт":"Estimate",
    "Кейсы":"Cases",
    "Тема":"Theme",
    "День":"Day",
    "Ночь":"Night",
    "Запустить проект":"Start a project",
    "Контур запуска":"Launch loop",
    "Задача":"Task",
    "Спрос":"Demand",
    "Структура":"Structure",
    "Сайт":"Website",
    "Запуск":"Launch",
    "Обращения":"Leads",
    "Развитие":"Growth",
    "Нажмите на этап":"Select a stage",
    "Бизнес-задача":"Business task",
    "точка старта":"starting point",
    "2 212 фраз":"2,212 phrases",
    "карта URL":"URL map",
    "от 300 тыс. ₽":"from $5,000",
    "от 500 тыс. ₽":"from $8,300",
    "источник известен":"source known",
    "следующий цикл":"next cycle",
    "единый контекст":"shared context",
    "результат в цифрах":"results in numbers",
    "план развития":"growth plan",
    "активный этап":"active stage",
    "тыс. ₽ · базовый запуск":"baseline launch",
    "Выход системы":"System output",
    "контекст не потерян":"context preserved",
    "Единый контур":"One loop",
    "Принцип работы / единый контур":"Working principle / one loop",
    "Одна логика —":"One logic —",
    "от задачи до запуска.":"from task to launch.",
    "Сайт не существует отдельно от спроса, структуры, аналитики и привлечения обращений. Все части проекта работают на одну бизнес-задачу.":"A website does not exist separately from demand, structure, analytics and lead generation. Every part of the project serves one business objective.",
    "Каждый следующий этап опирается на результаты предыдущего. Контекст не теряется между исследованием, проектированием, разработкой и запуском.":"Each stage builds on the results of the previous one. Context stays intact across research, design, development and launch.",
    "Автоматизация ускоряет повторяемые операции, помогает проверять объём и сохранять детали — но не подменяет смысл и логику проекта.":"Automation accelerates repeatable operations, helps verify scope and preserves details — but does not replace the meaning or logic of the project.",
    "Илья Клычков":"Ilya Klychkov",
    "основатель Manul":"founder of Manul",
    "MANUL.STUDIO · САЙТЫ С ХАРАКТЕРОМ":"MANUL.STUDIO · WEBSITES WITH CHARACTER",
    "Карта спроса / 02":"Demand map / 02",
    "Что ищут —":"What businesses search for —",
    "и куда должны попасть.":"and where they should land.",
    "Реальные запросы объединяются по задаче. Каждая группа получает собственную страницу и понятный ответ Manul.":"Demo Google queries are grouped by intent. Every group receives its own page and a clear Manul response.",
    "Что ищут в России":"What businesses search for on Google",
    "точных запросов / месяц":"Google Search · demo data",
    "разработка сайта":"website development",
    "SEO-продвижение сайта":"website SEO",
    "настройка Яндекс Директ":"Google Ads setup",
    "редизайн сайта":"website redesign",
    "поддержка сайта":"website support",
    "создание лендинга":"landing page development",
    "разработка сайта для стоматологии":"dental website development",
    "сопровождение сайта":"website management",
    "разработка корпоративного сайта":"corporate website development",
    "создание сайта клиники":"clinic website development",
    "запрос":"query",
    "становится ответом":"becomes an answer",
    "Страница Manul":"Manul page",
    "Коммерческий запуск сайта":"Commercial website launch",
    "Выберите запрос":"Select a query",
    "Живой расчёт / 03":"Live estimate / 03",
    "Измените масштаб.":"Change the scope.",
    "Система пересчитает запуск.":"The system recalculates the launch.",
    "Это предварительный ориентир без интеграций, нестандартной логики и рекламного бюджета.":"This is a preliminary estimate excluding integrations, custom logic and media spend.",
    "Условных страниц":"Weighted pages",
    "Услуг и направлений":"Services and directions",
    "Рекламных контуров":"Ad campaigns",
    "Сложность продукта":"Product complexity",
    "Стандартная ×1,0":"Standard ×1.0",
    "Экспертная ×1,15":"Expert ×1.15",
    "Регулируемая ×1,25":"Regulated ×1.25",
    "Условная страница":"Weighted page",
    "Главная ×3 · направление ×2 · услуга ×1 · статья ×0,5 · сотрудник ×0,4":"Homepage ×3 · direction ×2 · service ×1 · article ×0.5 · team member ×0.4",
    "Число продвигаемых страниц и запросов предварительно оценивается системой. Точный объём определяется после исследования спроса.":"The system estimates promoted pages and queries. Exact scope is defined after demand research.",
    "Предварительный контур":"Preliminary loop",
    "Исследование":"Research",
    "Создание сайта":"Website creation",
    "Базовое SEO":"Baseline SEO",
    "Реклама + аналитика":"Ads + analytics",
    "Яндекс Бизнес":"Business profile",
    "Ориентир запуска":"Launch estimate",
    "Точная цена определяется структурой, запросами, географией и функциями.":"Final price depends on structure, queries, geography and functionality.",
    "Состояние системы / 04":"System state / 04",
    "Публикация меняет статус.":"Publication changes the status.",
    "Проект не заканчивается.":"The project does not end.",
    "Сайт опубликован":"Website published",
    "Поиск подготовлен":"Search prepared",
    "Источники связаны":"Sources connected",
    "Первый трафик запущен":"First traffic launched",
    "Данные → вывод → изменение":"Data → insight → change",
    "Как развивать сайт после запуска":"How to grow your website after launch",
    "Доказательства / 05":"Evidence / 05",
    "Рабочие системы":"Working systems",
    "вместо красивых обещаний.":"instead of polished promises.",
    "стоматология":"dentistry",
    "SEO · структура":"SEO · structure",
    "B2C-сервис":"B2C service",
    "небрендовый спрос":"non-branded demand",
    "производство":"manufacturing",
    "два сайта":"two websites",
    "профессиональные услуги":"professional services",
    "система продуктов":"product ecosystem",
    "Выбор решения / 06":"Solution choice / 06",
    "Не каждой задаче":"Not every task",
    "нужен сайт.":"needs a website.",
    "Сначала определяем ограничение. Иногда нужен лендинг или пересборка, а иногда исследование показывает, что разработка — не первый шаг.":"First we identify the constraint. Sometimes the answer is a landing page or a rebuild; sometimes research shows that development is not the first step.",
    "Один продукт и нужен быстрый трафик":"One product needs traffic quickly",
    "Несколько направлений и поисковый спрос":"Several directions and search demand",
    "Существующий сайт ограничивает развитие":"The existing website limits growth",
    "Неясно, какой сайт действительно нужен":"It is unclear which website is actually needed",
    "Сайт уже создан":"The website is already live",
    "Открыть решение":"View the solution",
    "система собирается в целое":"the system assembles into a whole",
    "Новый контур / 07":"New loop / 07",
    "Подключить":"Connect",
    "вашу задачу.":"your task.",
    "Начать в Telegram":"Start in Telegram",
    "телефона нет":"no phone",
    "@hellomanul_bot · телефона нет":"@hellomanul_bot · no phone"
  };
  const originalTextNodes = new WeakMap();

  const formatMoney = value => ManulCalculator.formatMoney(value, currentLanguage);

  const setThemeLabel = () => {
    const dark = root.dataset.theme === "dark";
    themeLabel.textContent = currentLanguage === "en"
      ? (dark ? "Day" : "Night")
      : (dark ? "День" : "Ночь");
    themeToggle.setAttribute("aria-pressed", String(dark));
  };

  const translateStaticText = language => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const original = originalTextNodes.get(node);
      if (language === "ru") {
        node.nodeValue = original;
        return;
      }
      const key = original.trim();
      if (!key || !englishText[key]) return;
      node.nodeValue = original.replace(key, englishText[key]);
    });
  };

  themeToggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
    setThemeLabel();
  });
  setThemeLabel();

  const updateClock = () => {
    clock.textContent = new Intl.DateTimeFormat(currentLanguage === "en" ? "en-GB" : "ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
  };
  updateClock();
  setInterval(updateClock, 1000);

  const setStageColor = key => {
    if (!stageColors[key] || colorStageKey === key) return;
    colorStageKey = key;
    root.style.setProperty("--stage-color", stageColors[key]);
    root.style.setProperty("--stage-ink", key === "leads" ? "#ffffff" : "#090a09");
  };

  const activateStage = key => {
    const stage = currentLanguage === "en" ? stagesEn[key] : stages[key];
    if (!stage) return;
    activeStageKey = key;
    setStageColor(key);
    document.querySelectorAll("[data-stage]").forEach(element => {
      element.classList.toggle("active", element.dataset.stage === key);
      const railItem = element.closest(".sys-rail li");
      if (railItem) railItem.classList.toggle("active", element.dataset.stage === key);
    });
    coreCode.textContent = stage.code;
    coreTitle.innerHTML = stage.title;
    coreText.textContent = stage.text;
    coreOutput.innerHTML = stage.outputs.map(item => `<li>${item}</li>`).join("");
    liveStage.textContent = stage.number;
    consoleRows.innerHTML = stage.console.map((item, index) =>
      `<p><b>0${index + 1}</b><span>${item}</span><i>ready</i></p>`
    ).join("");
  };

  document.querySelectorAll("[data-stage]").forEach(button => {
    button.addEventListener("click", () => activateStage(button.dataset.stage));
  });
  activateStage("task");

  const flowLinks = document.querySelector(".sys-links");
  const flowCore = document.querySelector(".sys-core");
  const flowTargets = [
    ["flow-task", ".node-task", -.045],
    ["flow-demand", ".node-demand", .035],
    ["flow-structure", ".node-structure", -.035],
    ["flow-site", ".node-site", .018],
    ["flow-launch", ".node-launch", -.035],
    ["flow-leads", ".node-leads", .035],
    ["flow-growth", ".node-growth", -.045]
  ];
  let flowFrame = 0;

  const updateFlowGeometry = () => {
    flowFrame = 0;
    const matrix = flowLinks?.getScreenCTM();
    if (!matrix || !flowCore) return;
    const inverse = matrix.inverse();
    const toSvgPoint = (x, y) => {
      const point = flowLinks.createSVGPoint();
      point.x = x;
      point.y = y;
      return point.matrixTransform(inverse);
    };
    const coreRect = flowCore.getBoundingClientRect();
    const start = toSvgPoint(
      coreRect.left + coreRect.width / 2,
      coreRect.top + coreRect.height / 2
    );

    flowTargets.forEach(([pathId, selector, bend]) => {
      const path = document.getElementById(pathId);
      const target = document.querySelector(selector);
      if (!path || !target) return;
      const targetRect = target.getBoundingClientRect();
      const end = toSvgPoint(
        targetRect.left + targetRect.width / 2,
        targetRect.top + targetRect.height / 2
      );
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      const normalX = length ? -dy / length : 0;
      const normalY = length ? dx / length : 0;
      const offset = length * bend;
      const control1 = {
        x: start.x + dx * .34 + normalX * offset,
        y: start.y + dy * .34 + normalY * offset
      };
      const control2 = {
        x: start.x + dx * .7 + normalX * offset,
        y: start.y + dy * .7 + normalY * offset
      };
      path.setAttribute(
        "d",
        `M${start.x.toFixed(2)} ${start.y.toFixed(2)} C${control1.x.toFixed(2)} ${control1.y.toFixed(2)} ${control2.x.toFixed(2)} ${control2.y.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
      );
    });
  };

  const scheduleFlowGeometry = () => {
    if (flowFrame) return;
    flowFrame = requestAnimationFrame(updateFlowGeometry);
  };

  scheduleFlowGeometry();
  window.addEventListener("load", scheduleFlowGeometry, { once: true });
  window.addEventListener("resize", scheduleFlowGeometry);
  document.fonts?.ready.then(scheduleFlowGeometry);

  if (matchMedia("(pointer:fine)").matches) {
    canvas.addEventListener("pointermove", event => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 26;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 26;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      scheduleFlowGeometry();
    });
    canvas.addEventListener("pointerleave", () => {
      root.style.setProperty("--mx", "0px");
      root.style.setProperty("--my", "0px");
      scheduleFlowGeometry();
    });
  }

  const pageRoles = {
    "/sozdanie-saytov/": "Коммерческий запуск сайта",
    "/seo-prodvizhenie/": "SEO-продвижение",
    "/nastrojka-yandex-direkt/": "Первичная настройка рекламы",
    "/redizajn-sajta/": "Редизайн и безопасный перезапуск",
    "/landing/": "Лендинг под рекламу",
    "/sajty-dlya-stomatologij/": "Сайты для стоматологий",
    "/korporativnyj-sajt/": "Корпоративный сайт"
  };
  const pageRolesEn = {
    "/sozdanie-saytov/": ["\/en\/website-development\/", "Commercial website launch"],
    "/seo-prodvizhenie/": ["\/en\/website-seo\/", "Website SEO"],
    "/nastrojka-yandex-direkt/": ["\/en\/google-ads-setup\/", "Google Ads setup"],
    "/redizajn-sajta/": ["\/en\/website-redesign\/", "Redesign and safe relaunch"],
    "/landing/": ["/en/landing/", "Advertising landing page"],
    "/sajty-dlya-stomatologij/": ["\/en\/dental-websites\/", "Dental websites"],
    "/korporativnyj-sajt/": ["\/en\/corporate-website\/", "Corporate website"]
  };
  const mappedPage = document.getElementById("mappedPage");
  const mappedRole = document.getElementById("mappedRole");
  const demandEnglish = {
    "/sozdanie-saytov/": { query: "website development", volume: "1,900" },
    "/seo-prodvizhenie/": { query: "SEO services", volume: "1,300" },
    "/nastrojka-yandex-direkt/": { query: "Google Ads setup", volume: "720" },
    "/redizajn-sajta/": { query: "website redesign", volume: "590" },
    "/landing/": { query: "landing page design", volume: "480" },
    "/sajty-dlya-stomatologij/": { query: "dental website design", volume: "210" },
    "/korporativnyj-sajt/": { query: "corporate website development", volume: "170" }
  };
  const demandButtons = [...document.querySelectorAll("#demandStream button")];
  demandButtons.forEach(button => {
    button.dataset.ruQuery = button.querySelector("span").textContent;
    button.dataset.ruVolume = button.querySelector("b").textContent;
  });
  const updateDemandLanguage = language => {
    demandButtons.forEach(button => {
      button.querySelector("span").textContent = language === "en"
        ? demandEnglish[button.dataset.page].query
        : button.dataset.ruQuery;
      button.querySelector("b").textContent = language === "en"
        ? demandEnglish[button.dataset.page].volume
        : button.dataset.ruVolume;
    });
  };
  const prototypeHref = targetPath => {
    if (targetPath === "/sozdanie-saytov/" || targetPath === "/en/website-development/") {
      return "concept-product.html";
    }
    return targetPath;
  };
  const updateDemandPage = button => {
    const isEnglish = currentLanguage === "en";
    const targetPath = isEnglish ? pageRolesEn[button.dataset.page][0] : button.dataset.page;
    mappedPage.href = prototypeHref(targetPath);
    mappedPage.textContent = targetPath;
    mappedPage.setAttribute(
      "aria-label",
      isEnglish ? `Open page ${targetPath}` : `Открыть страницу ${targetPath}`
    );
    mappedRole.textContent = isEnglish
      ? pageRolesEn[button.dataset.page][1]
      : pageRoles[button.dataset.page];
  };
  demandButtons.forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("#demandStream button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      updateDemandPage(button);
    });
  });
  document.querySelector("#demandStream button").classList.add("active");

  const solutions = {
    landing: {
      ru: {
        code: "01 / ЛЕНДИНГ",
        title: "Лендинг с рекламой",
        text: "Один оффер получает собственную страницу, аналитику и первый рекламный контур.",
        href: "/landing/",
        rule: "Разработка начинается после проверки предложения и спроса."
      },
      en: {
        code: "01 / LANDING PAGE",
        title: "Landing page with ads",
        text: "One offer gets a focused page, analytics and its first advertising campaign.",
        href: "/en/landing/",
        rule: "Development starts after the offer and demand are checked."
      }
    },
    launch: {
      ru: {
        code: "02 / КОММЕРЧЕСКИЙ ЗАПУСК",
        title: "Многостраничный сайт",
        text: "Направления и поисковый спрос превращаются в структуру страниц, готовую к привлечению обращений.",
        href: "concept-product.html",
        rule: "Количество страниц определяется спросом, а не заранее выбранным объёмом."
      },
      en: {
        code: "02 / COMMERCIAL LAUNCH",
        title: "Multi-page website",
        text: "Business directions and search demand become a page structure ready to generate enquiries.",
        href: "concept-product.html",
        rule: "The number of pages follows demand rather than a predefined scope."
      }
    },
    redesign: {
      ru: {
        code: "03 / РЕДИЗАЙН",
        title: "Пересборка существующего сайта",
        text: "Сохраняем полезные активы, меняем структуру и безопасно перезапускаем сайт.",
        href: "/redizajn-sajta/",
        rule: "После пересборки проект можно подключить к дальнейшему развитию Manul."
      },
      en: {
        code: "03 / REDESIGN",
        title: "Existing website rebuild",
        text: "We preserve useful assets, change the structure and relaunch the website safely.",
        href: "/en/website-redesign/",
        rule: "After the rebuild, the project can move into ongoing Manul development."
      }
    },
    research: {
      ru: {
        code: "04 / ИССЛЕДОВАНИЕ",
        title: "Сначала определить задачу",
        text: "Проверяем спрос, продукт и ограничения до решения о формате и масштабе разработки.",
        href: "concept-product.html#composition",
        rule: "Если сайт не является первым необходимым шагом, исследование должно это показать."
      },
      en: {
        code: "04 / RESEARCH",
        title: "Define the task first",
        text: "We examine demand, the product and constraints before choosing the format and scope of development.",
        href: "concept-product.html#composition",
        rule: "If a website is not the necessary first step, research should make that clear."
      }
    },
    growth: {
      ru: {
        code: "05 / РАЗВИТИЕ",
        title: "Развитие после запуска",
        text: "SEO, реклама и аналитика превращают накопленные данные в следующий цикл изменений.",
        href: "/soprovozhdenie-sajta/",
        rule: "Развиваем сайты, которые создали сами или системно пересобрали перед началом работ.",
        cta: "Перейти к развитию сайта"
      },
      en: {
        code: "05 / GROWTH",
        title: "Growth after launch",
        text: "SEO, advertising and analytics turn accumulated data into the next cycle of change.",
        href: "/en/soprovozhdenie-sajta/",
        rule: "We develop websites we created ourselves or systematically rebuilt before starting the work.",
        cta: "Explore website growth"
      }
    }
  };
  const solutionButtons = [...document.querySelectorAll("#solutionOptions button")];
  const solutionOptions = document.getElementById("solutionOptions");
  const solutionCode = document.getElementById("solutionCode");
  const solutionTitle = document.getElementById("solutionTitle");
  const solutionText = document.getElementById("solutionText");
  const solutionLink = document.getElementById("solutionLink");
  const solutionRule = document.getElementById("solutionRule");
  const mobileSolutionLayout = matchMedia("(max-width: 720px)");
  const reducedSolutionMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const updateSolution = button => {
    const solution = solutions[button.dataset.solution][currentLanguage];
    const choiceOutput = solutionTitle.closest(".choice-output");
    solutionButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    choiceOutput.classList.toggle("is-long-title", ["launch", "redesign"].includes(button.dataset.solution));
    solutionCode.textContent = solution.code;
    solutionTitle.textContent = solution.title;
    solutionText.textContent = solution.text;
    solutionLink.href = solution.href;
    solutionLink.querySelector("span").textContent =
      solution.cta || (currentLanguage === "en" ? "View the solution" : "Открыть решение");
    solutionLink.setAttribute(
      "aria-label",
      `${solution.cta || (currentLanguage === "en" ? "View the solution" : "Открыть решение")}: ${solution.title}`
    );
    solutionRule.textContent = solution.rule;
  };
  const placeSolutionOutput = (button, shouldScroll = false) => {
    const choiceOutput = solutionTitle.closest(".choice-output");
    if (mobileSolutionLayout.matches) {
      button.insertAdjacentElement("afterend", choiceOutput);
    } else {
      solutionOptions.insertAdjacentElement("afterend", choiceOutput);
    }
    if (shouldScroll && mobileSolutionLayout.matches) {
      requestAnimationFrame(() => button.scrollIntoView({
        behavior: reducedSolutionMotion.matches ? "auto" : "smooth",
        block: "start"
      }));
    }
  };
  solutionButtons.forEach(button => {
    button.addEventListener("click", () => {
      updateSolution(button);
      placeSolutionOutput(button, true);
    });
  });
  const syncSolutionLayout = () => {
    const activeSolution = solutionButtons.find(button => button.classList.contains("active"));
    if (activeSolution) placeSolutionOutput(activeSolution);
  };
  mobileSolutionLayout.addEventListener("change", syncSolutionLayout);
  syncSolutionLayout();

  const systemCalculator = ManulCalculator.mount({
    inputs: {
      pages: "#pagesRange",
      services: "#servicesRange",
      contours: "#contoursRange",
      complexity: "#complexitySelect"
    },
    outputs: {
      pages: "#pagesValue",
      services: "#servicesValue",
      contours: "#contoursValue",
      research: "#researchPrice",
      development: "#sitePrice",
      seo: "#seoPrice",
      advertising: "#adsPrice",
      business: "#businessPrice",
      total: "#launchPrice"
    },
    formatMoney
  });
  ManulCalculator.bindMobileTotal({ source: "#launchPrice", target: "#mobileLaunchPrice" });
  const updateCalculation = () => systemCalculator.update();

  const applyLanguage = language => {
    const preservedColorStageKey = colorStageKey;
    currentLanguage = language;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    translateStaticText(language);
    updateDemandLanguage(language);
    languageToggle.querySelector("span").textContent = language === "en" ? "RU" : "EN";
    languageToggle.setAttribute("aria-label", language === "en" ? "Переключить на русский" : "Switch to English");
    ongoingWorkLink.href = language === "en"
      ? "/en/soprovozhdenie-sajta/"
      : "/soprovozhdenie-sajta/";
    document.title = language === "en"
      ? "Manul — commercial website launch"
      : "Manul OS — коммерческий запуск сайта";
    nodeSitePrice.textContent = language === "en" ? "from $5,000" : "от 300 тыс. ₽";
    nodeLaunchPrice.textContent = language === "en" ? "from $8,300" : "от 500 тыс. ₽";
    liveBasePrice.textContent = language === "en" ? "$8,300" : "500";
    liveBaseUnit.textContent = language === "en" ? "baseline launch" : "тыс. ₽ · базовый запуск";
    themeToggle.setAttribute(
      "aria-label",
      language === "en" ? "Switch color theme" : "Переключить тему"
    );
    setThemeLabel();
    updateClock();
    activateStage(activeStageKey);
    setStageColor(preservedColorStageKey);
    updateCalculation();
    const activeDemand = document.querySelector("#demandStream button.active") ||
      document.querySelector("#demandStream button");
    if (activeDemand) activeDemand.click();
    const activeSolution = document.querySelector("#solutionOptions button.active") ||
      document.querySelector("#solutionOptions button");
    if (activeSolution) updateSolution(activeSolution);
  };
  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "ru" : "en");
  });
  applyLanguage(currentLanguage);

  const heroSection = document.getElementById("system");
  const colorSections = [...document.querySelectorAll("[data-observe-stage]")];
  let colorFrame = 0;

  const updateScrollColor = () => {
    colorFrame = 0;
    const anchor = Math.min(window.innerHeight * .42, 420);
    const heroRect = heroSection.getBoundingClientRect();
    if (heroRect.top <= anchor && heroRect.bottom > anchor) {
      setStageColor(activeStageKey);
      return;
    }
    const currentSection = colorSections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= anchor && rect.bottom > anchor;
    });
    if (currentSection) setStageColor(currentSection.dataset.observeStage);
  };

  const scheduleScrollColor = () => {
    if (colorFrame) return;
    colorFrame = requestAnimationFrame(updateScrollColor);
  };

  window.addEventListener("scroll", scheduleScrollColor, { passive: true });
  window.addEventListener("resize", scheduleScrollColor);
  updateScrollColor();

  const finalOrbit = document.getElementById("finalOrbit");
  const finalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        finalOrbit.classList.remove("is-active");
        requestAnimationFrame(() => requestAnimationFrame(() => finalOrbit.classList.add("is-active")));
      }
    });
  }, { threshold: .45 });
  finalObserver.observe(finalOrbit);

  if (matchMedia("(pointer:fine)").matches) {
    finalOrbit.addEventListener("pointermove", event => {
      const rect = finalOrbit.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 24;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 24;
      finalOrbit.style.setProperty("--orbit-x", `${x}px`);
      finalOrbit.style.setProperty("--orbit-y", `${y}px`);
    });
    finalOrbit.addEventListener("pointerleave", () => {
      finalOrbit.style.setProperty("--orbit-x", "0px");
      finalOrbit.style.setProperty("--orbit-y", "0px");
    });
  }
})();
