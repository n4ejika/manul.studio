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
      ru: ["Проверяем охват целевого спроса.", "Смотрим, по каким группам запросов сайт виден и где существующие страницы ещё не отвечают поисковому намерению."],
      en: ["We check target demand coverage.", "We identify which query groups can find the website and where existing pages still miss search intent."]
    },
    indexing: {
      code: "02 / INDEXING",
      ru: ["Проверяем доступность страниц для поиска.", "Контролируем обход, индексацию, технические ошибки и то, какие страницы поисковая система считает основными."],
      en: ["We check page accessibility for search.", "We monitor crawling, indexing, technical errors and which pages the search engine treats as canonical."]
    },
    traffic: {
      code: "03 / TRAFFIC",
      ru: ["Оцениваем качество поискового трафика.", "Разделяем информационный интерес и коммерческий спрос, проверяем страницы входа и поведение посетителей."],
      en: ["We assess organic traffic quality.", "We separate informational interest from commercial demand and review landing pages and visitor behaviour."]
    },
    leads: {
      code: "04 / ENQUIRIES",
      ru: ["Связываем поисковый трафик с обращениями.", "Проверяем, какие страницы и группы запросов приводят целевых посетителей к обращению."],
      en: ["We connect organic traffic with enquiries.", "We identify which pages and query groups bring qualified visitors to an enquiry."]
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
      ru: ["Масштаб задачи определяет стоимость.", "Учитываются количество запросов, продвигаемые страницы, конкуренция и география. Поэтому рынок выбирается прямо в расчёте."],
      en: ["Task scale determines the price.", "The number of queries, promoted pages, competition and geography all matter. That is why the market is selected inside the estimate."]
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
      ru: ["Расширить видимость по целевым запросам.", "Определяем группы спроса, где сайт перестал расти или ещё не представлен."],
      en: ["Expand visibility for target queries.", "We identify demand groups where the website has stopped growing or is not yet visible."]
    },
    indexing: {
      index: "02 / 04", code: "02 / INDEXING",
      ru: ["Устранить проблемы индексации.", "Проверяем обход, индексацию, дубли и технические ограничения, мешающие страницам участвовать в поиске."],
      en: ["Resolve indexing issues.", "We check crawling, indexing, duplicates and technical constraints that keep pages out of search."]
    },
    traffic: {
      index: "03 / 04", code: "03 / TRAFFIC",
      ru: ["Увеличить целевой поисковый трафик.", "Отделяем рост целевого трафика от общего увеличения посещаемости и определяем работающие страницы входа."],
      en: ["Increase qualified organic traffic.", "We separate qualified traffic growth from a general increase in visits and identify effective landing pages."]
    },
    leads: {
      index: "04 / 04", code: "04 / ENQUIRIES",
      ru: ["Повысить вклад поиска в обращения.", "Сверяем страницы входа с обращениями и определяем, какие изменения нужны в следующем цикле."],
      en: ["Increase organic search contribution to enquiries.", "We compare landing pages with enquiries and define the changes required in the next cycle."]
    }
  };

  const formatMoney = value => ManulCalculator.formatMoney(value, language);

  function updateEstimate() {
    const result = ManulCalculator.calculateSeo({
      queries: queryInput.value,
      pages: pageInput.value,
      market
    }, language);
    document.getElementById("queriesOutput").textContent = result.queries;
    document.getElementById("pagesOutput").textContent = result.pages;
    document.getElementById("seoTotal").textContent = formatMoney(result.total);
    document.getElementById("heroPrice").textContent = formatMoney(ManulCalculator.seoMarkets[language][market].minimum);
    document.getElementById("resultScope").textContent = language === "ru"
      ? `${result.queries} запросов · ${result.pages} страниц · ×${result.multiplier.toFixed(1)}`
      : `${result.queries} queries · ${result.pages} pages · ×${result.multiplier}`;
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
    document.getElementById("marketFactor").textContent = `×${ManulCalculator.seoMarkets[language][market].multiplier}`;
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
      ? "SEO-продвижение сайта — от 50 000 ₽ в месяц | Manul"
      : "SEO services — from $2,000 per month | Manul";
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
