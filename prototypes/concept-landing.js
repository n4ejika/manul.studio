(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("landingLanguage");
  const themeButton = document.getElementById("landingTheme");
  const modeButtons = [...document.querySelectorAll(".decision-gates button")];
  const signalMode = document.getElementById("signalMode");
  const signalCenter = document.getElementById("signalCenter");
  const signalReadout = document.getElementById("signalReadout");
  const decisionQuestion = document.getElementById("decisionQuestion");
  const decisionConsole = document.querySelector(".decision-console");
  let language = localStorage.getItem("manul-system-language") || "ru";

  const modes = {
    match: {
      code: "01 / MATCH",
      question: { ru: "«Это для меня?»", en: "“Is this for me?”" },
      center: { ru: "Человек узнаёт свою задачу в предложении и продолжает изучать страницу.", en: "The person recognises their task in the offer and continues exploring the page." },
      note: { ru: "Первый экран показывает, кому и в какой ситуации подходит предложение.", en: "The first screen shows who the offer is for and in what situation it is relevant." }
    },
    situation: {
      code: "02 / SITUATION",
      question: { ru: "«Они понимают, что происходит?»", en: "“Do they understand what is happening?”" },
      center: { ru: "Человек видит, что его ситуация понята и описана без искажений.", en: "The person sees that their situation is understood and described accurately." },
      note: { ru: "Страница объясняет проблему и последствия бездействия без давления и нагнетания.", en: "The page explains the problem and the cost of inaction without pressure or alarmism." }
    },
    mechanism: {
      code: "03 / MECHANISM",
      question: { ru: "«Как именно это исправят?»", en: "“How will this be solved?”" },
      center: { ru: "Пользователь понимает механизм, этапы и принцип решения.", en: "The user understands the method, stages and principle of the solution." },
      note: { ru: "Не обещание результата, а объяснение, за счёт чего он должен появиться.", en: "Not a result promise, but an explanation of how it can be achieved." }
    },
    value: {
      code: "04 / VALUE",
      question: { ru: "«Что я получу в результате?»", en: "“What will I gain from the result?”" },
      center: { ru: "Человек понимает пользу предложения для своей задачи.", en: "The person understands how the offer benefits their specific task." },
      note: { ru: "Перечень услуг превращается в понятный результат для конкретной задачи.", en: "The service list is translated into a clear outcome for a specific task." }
    },
    trust: {
      code: "05 / TRUST",
      question: { ru: "«Почему им можно верить?»", en: "“Why should I trust them?”" },
      center: { ru: "Утверждения получают конкретные и релевантные доказательства.", en: "Claims receive specific and relevant supporting evidence." },
      note: { ru: "Кейсы, результаты, процесс и люди отвечают на разные сомнения.", en: "Cases, results, process and people answer different doubts." }
    },
    safety: {
      code: "06 / SAFETY",
      question: { ru: "«Что может пойти не так?»", en: "“What could go wrong?”" },
      center: { ru: "Границы, этапы и дополнительные расходы становятся видимыми.", en: "Boundaries, stages and additional costs become visible." },
      note: { ru: "Риск не исчезает, но становится понятным и приемлемым.", en: "Risk does not disappear, but becomes clear and acceptable." }
    },
    action: {
      code: "07 / ACTION",
      question: { ru: "«Что произойдёт после клика?»", en: "“What happens after the click?”" },
      center: { ru: "Готовность превращается в конкретный безопасный следующий шаг.", en: "Readiness becomes one specific and safe next step." },
      note: { ru: "Для сложной услуги задача страницы — привести к предметному разговору, а не обещать мгновенную покупку.", en: "For a complex service, the page should lead to a useful conversation rather than promise an instant purchase." }
    }
  };
  let mode = "match";

  function renderMode(next) {
    mode = next;
    const data = modes[mode];
    const index = Object.keys(modes).indexOf(mode);
    signalMode.textContent = data.code;
    decisionQuestion.textContent = data.question[language];
    signalCenter.textContent = data.center[language];
    signalReadout.textContent = data.note[language];
    modeButtons.forEach(button => button.classList.toggle("active", button.dataset.mode === mode));
    decisionConsole.style.setProperty("--decision-progress", `${((index + 1) / 7) * 100}%`);
    decisionConsole.style.setProperty("--decision-position", `${((index + 0.5) / 7) * 100}%`);
  }

  function applyLanguage(next) {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("main [data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    const price = ManulCalculator.formatMoney(ManulCalculator.getPrice("landing", language), language);
    document.getElementById("landingHeroPrice").textContent = language === "ru" ? `от ${price}` : `from ${price}`;
    document.getElementById("landingScopePrice").textContent = language === "ru" ? `от ${price}` : `from ${price}`;
    renderMode(mode);
  }

  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  modeButtons.forEach(button => button.addEventListener("click", () => renderMode(button.dataset.mode)));
  document.querySelectorAll(".landing-faq details").forEach(details => details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".landing-faq details").forEach(item => { if (item !== details) item.open = false; });
  }));
  applyLanguage(language);
})();
