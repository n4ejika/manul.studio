(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("studioLanguage");
  const themeButton = document.getElementById("studioTheme");
  const field = document.getElementById("studioField");
  const number = document.getElementById("studioStageNumber");
  const word = document.getElementById("studioStageWord");
  const note = document.getElementById("studioStageNote");
  const buttons = [...document.querySelectorAll(".stage-switch button")];
  let language = localStorage.getItem("manul-system-language") || "ru";
  let active = 0;

  const stages = {
    ru: [
      ["ЗАДАЧА", "Что должно измениться в бизнесе"],
      ["СПРОС", "Что и как ищет рынок"],
      ["СТРУКТУРА", "Какие страницы ведут к решению"],
      ["СМЫСЛ", "Как понятно объяснить продукт"],
      ["ХАРАКТЕР", "Как бизнес должен звучать и выглядеть"],
      ["ЗАПУСК", "Как связать сайт, поиск и аналитику"],
      ["РАЗВИТИЕ", "Как данные превращаются в изменения"],
    ],
    en: [
      ["TASK", "What should change in the business"],
      ["DEMAND", "What the market searches for"],
      ["STRUCTURE", "Which pages lead to a decision"],
      ["MEANING", "How to explain the product clearly"],
      ["CHARACTER", "How the business should look and sound"],
      ["LAUNCH", "How website, search and analytics connect"],
      ["GROWTH", "How data turns into change"],
    ],
  };

  function renderStage(index) {
    active = index;
    const stage = stages[language][index];
    number.textContent = `${String(index + 1).padStart(2, "0")} / 07`;
    word.textContent = stage[0];
    note.textContent = stage[1];
    field.classList.toggle("changed", index % 2 === 1);
    field.querySelector(".system-node").style.transform =
      `translate(${110 + index * 18}px,${-145 + (index % 3) * 92}px)`;
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function applyLanguage(next) {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("main [data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    field.parentElement.setAttribute(
      "aria-label",
      language === "ru" ? "Интерактивная схема работы студии" : "Interactive studio workflow"
    );
    document.querySelector(".stage-switch").setAttribute(
      "aria-label",
      language === "ru" ? "Этапы работы" : "Work stages"
    );
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    renderStage(active);
  }

  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  buttons.forEach(button => button.addEventListener("click", () => renderStage(Number(button.dataset.index))));
  field.addEventListener("pointermove", event => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = field.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 55;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 55;
    field.querySelector(".system-rings").style.transform = `translate(${x}px,${y}px)`;
  });
  field.addEventListener("pointerleave", () => {
    field.querySelector(".system-rings").style.transform = "";
  });
  applyLanguage(language);
})();
