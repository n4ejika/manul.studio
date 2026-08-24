(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("seoLanguage");
  const themeButton = document.getElementById("seoTheme");
  const field = document.querySelector(".field-canvas");
  const queryInput = document.getElementById("seoQueries");
  const pageInput = document.getElementById("seoPages");
  const marketSelect = document.getElementById("seoMarketSelect");
  let language = localStorage.getItem("manul-system-language") === "en" ? "en" : "ru";
  let market = "local";

  const marketCopy = {
    local: {
      code: "01 / LOCAL", factor: "×1.0",
      ru: ["Локальный рынок", "Город с населением до 1 млн человек"],
      en: ["Local market", "A city with under one million residents"]
    },
    major: {
      code: "02 / MAJOR", factor: "×1.4",
      ru: ["Крупный рынок", "Один регион или город-миллионник"],
      en: ["Major market", "A major city or one regional market"]
    },
    country: {
      code: "03 / COUNTRY", factor: "×1.8",
      ru: ["Вся Россия", "Единый федеральный рынок"],
      en: ["Countrywide", "One entire national market"]
    },
    international: {
      code: "04 / INTERNATIONAL", factor: "×2.4",
      ru: ["Международный рынок", "Одна зарубежная страна и один язык"],
      en: ["International market", "One foreign market and one language"]
    }
  };

  const signalCopy = {
    visibility: {
      code: "01 / VISIBILITY",
      ru: ["Спрос встречается со страницами.", "Проверяем, по каким группам запросов сайт виден и где структура не отвечает поисковому намерению."],
      en: ["Demand meets the pages.", "We identify which demand groups can find the website and where its structure misses search intent."]
    },
    indexing: {
      code: "02 / INDEXING",
      ru: ["Поиск должен увидеть изменения.", "Контролируем обход, индексацию, технические ошибки и то, какие страницы поисковая система считает основными."],
      en: ["Search must see the change.", "We control crawling, indexing, technical errors and which pages the search engine treats as canonical."]
    },
    traffic: {
      code: "03 / TRAFFIC",
      ru: ["Не любой переход имеет ценность.", "Разделяем информационный интерес и коммерческий спрос, оцениваем качество входящих маршрутов."],
      en: ["Not every visit has value.", "We separate informational interest from commercial demand and assess the quality of incoming journeys."]
    },
    leads: {
      code: "04 / ENQUIRIES",
      ru: ["Страница должна продолжать путь.", "Сверяем поисковый трафик с обращениями и понимаем, какие группы спроса действительно работают на бизнес."],
      en: ["The page must continue the journey.", "We connect organic traffic with enquiries to see which demand groups create business value."]
    }
  };

  const faqCopy = {
    term: {
      code: "01 / TIME",
      ru: ["Поиску и данным нужно время.", "Поисковые системы должны увидеть изменения, а накопленные данные — отделить устойчивый результат от случайного колебания."],
      en: ["Search and evidence need time.", "Search engines must process the changes, while accumulated evidence separates a stable result from random fluctuation."]
    },
    price: {
      code: "02 / SCOPE",
      ru: ["Стоимость определяет масштаб задачи.", "Учитываются группы спроса, продвигаемые страницы, конкуренция и география. Поэтому рынок выбирается прямо в расчёте."],
      en: ["The task scale determines the price.", "Demand groups, promoted pages, competition and geography all matter. That is why the market is selected inside the estimate."]
    },
    pages: {
      code: "03 / PRODUCTION",
      ru: ["Новые страницы — отдельная разработка.", "Анализ и постановка задачи входят в SEO-цикл. Проектирование, содержание и разработка новых страниц оцениваются отдельно."],
      en: ["New pages are separate production.", "Analysis and task definition belong to the SEO cycle. Design, content and development of new pages are estimated separately."]
    }
  };

  const growthCopy = {
    visibility: {
      index: "01 / 04", code: "01 / VISIBILITY",
      ru: ["Найти потерянный спрос.", "Смотрим, по каким группам запросов сайт перестал расти или ещё не представлен."],
      en: ["Find missed demand.", "We identify demand groups where the website has stopped growing or is not yet visible."]
    },
    indexing: {
      index: "02 / 04", code: "02 / INDEXING",
      ru: ["Убрать барьер для поиска.", "Проверяем обход, индексацию, дубли и технические ограничения, мешающие страницам участвовать в поиске."],
      en: ["Remove the search barrier.", "We check crawling, indexing, duplicates and technical constraints that keep pages out of search."]
    },
    traffic: {
      index: "03 / 04", code: "03 / TRAFFIC",
      ru: ["Привести нужного посетителя.", "Отделяем рост целевого трафика от общего увеличения посещаемости и выбираем работающие входные страницы."],
      en: ["Attract the right visitor.", "We separate qualified traffic growth from a general increase in visits and identify effective entry pages."]
    },
    leads: {
      index: "04 / 04", code: "04 / ENQUIRIES",
      ru: ["Связать спрос с обращениями.", "Сверяем страницы входа и обращения, чтобы следующий цикл работал на бизнес-задачу, а не на абстрактный трафик."],
      en: ["Connect demand with enquiries.", "We compare entry pages with enquiries so the next cycle serves a business task rather than abstract traffic."]
    }
  };

  const formatMoney = value => ManulCalculator.formatMoney(value, language);

  function updateEstimate() {
    const result = ManulCalculator.calculateSeo({
      queries: queryInput.value,
      pages: pageInput.value,
      market
    });
    document.getElementById("queriesOutput").textContent = result.queries;
    document.getElementById("pagesOutput").textContent = result.pages;
    document.getElementById("seoTotal").textContent = formatMoney(result.total);
    document.getElementById("heroPrice").textContent = formatMoney(ManulCalculator.seoMarkets[market].minimum);
    document.getElementById("resultScope").textContent = language === "ru"
      ? `${result.queries} запросов · ${result.pages} страниц · ×${result.multiplier.toFixed(1)}`
      : `${result.queries} queries · ${result.pages} pages · ×${result.multiplier.toFixed(1)}`;
  }

  function selectMarket(nextMarket) {
    market = nextMarket;
    const item = marketCopy[market];
    document.querySelectorAll("[data-market]").forEach(button => {
      const active = button.dataset.market === market;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (marketSelect.value !== market) marketSelect.value = market;
    marketSelect.manulSelect?.refresh();
    document.getElementById("marketCode").textContent = item.code;
    document.getElementById("marketFactor").textContent = item.factor;
    document.getElementById("marketName").textContent = item[language][0];
    document.getElementById("marketNote").textContent = item[language][1];
    field.style.setProperty("--scale", ({ local: .63, major: .82, country: 1.05, international: 1.3 })[market]);
    updateEstimate();
  }

  function selectFaq(key) {
    const item = faqCopy[key];
    document.querySelectorAll("[data-seo-faq]").forEach(button => {
      const active = button.dataset.seoFaq === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("seoFaqCode").textContent = item.code;
    document.getElementById("seoFaqTitle").textContent = item[language][0];
    document.getElementById("seoFaqText").textContent = item[language][1];
    const activeIndex = ["term", "price", "pages"].indexOf(key);
    document.querySelectorAll(".faq-meter i").forEach((segment, index) => segment.classList.toggle("active", index <= activeIndex));
  }

  function selectGrowth(key) {
    const item = growthCopy[key];
    document.querySelectorAll("[data-growth]").forEach(button => {
      const active = button.dataset.growth === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("growthIndex").textContent = item.index;
    document.getElementById("growthCode").textContent = item.code;
    document.getElementById("growthTitle").textContent = item[language][0];
    document.getElementById("growthText").textContent = item[language][1];
    const activeIndex = ["visibility", "indexing", "traffic", "leads"].indexOf(key);
    document.querySelectorAll(".growth-route i").forEach((segment, index) => segment.classList.toggle("active", index <= activeIndex));
  }

  function selectSignal(key) {
    const item = signalCopy[key];
    document.querySelectorAll("[data-signal]").forEach(button => {
      const active = button.dataset.signal === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("signalCode").textContent = item.code;
    document.getElementById("signalTitle").textContent = item[language][0];
    document.getElementById("signalText").textContent = item[language][1];
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Switch color theme");
    document.querySelector(".calculator").setAttribute("aria-label", language === "ru" ? "Калькулятор SEO" : "SEO calculator");
    document.querySelector(".faq-rail").setAttribute("aria-label", language === "ru" ? "Вопросы перед стартом" : "Questions before the start");
    document.querySelector(".growth-switch").setAttribute("aria-label", language === "ru" ? "Приоритет следующего цикла" : "Next-cycle priority");
    document.title = language === "ru"
      ? "SEO-продвижение — от 50 000 ₽ в месяц | Manul"
      : "SEO services — from $800 per month | Manul";
    selectMarket(market);
    selectSignal(document.querySelector("[data-signal].active")?.dataset.signal || "visibility");
    selectFaq(document.querySelector("[data-seo-faq].active")?.dataset.seoFaq || "term");
    selectGrowth(document.querySelector("[data-growth].active")?.dataset.growth || "visibility");
  }

  document.querySelectorAll("[data-market]").forEach(button => button.addEventListener("click", () => selectMarket(button.dataset.market)));
  marketSelect.addEventListener("change", () => selectMarket(marketSelect.value));
  document.querySelectorAll("[data-signal]").forEach(button => button.addEventListener("click", () => selectSignal(button.dataset.signal)));
  document.querySelectorAll("[data-seo-faq]").forEach(button => button.addEventListener("click", () => selectFaq(button.dataset.seoFaq)));
  document.querySelectorAll("[data-growth]").forEach(button => button.addEventListener("click", () => selectGrowth(button.dataset.growth)));
  [queryInput, pageInput].forEach(input => input.addEventListener("input", updateEstimate));
  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });

  function updateProgress() {
    const available = root.scrollHeight - innerHeight;
    root.style.setProperty("--progress", available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)).toFixed(2) : "0");
  }
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  const clock = document.getElementById("seoClock");
  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString(language === "ru" ? "ru-RU" : "en-GB", { hour12: false });
  }, 1000);
  clock.textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  updateProgress();
  applyLanguage(language);
})();
