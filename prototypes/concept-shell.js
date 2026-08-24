(() => {
  const root = document.documentElement;
  const map = document.getElementById("siteMap");
  const openButton = document.getElementById("mapOpen");
  const closeButton = document.getElementById("mapClose");
  const languageButton = document.getElementById("shellLanguage");
  const themeButton = document.getElementById("shellTheme");
  let language = localStorage.getItem("manul-system-language") === "en" ? "en" : "ru";

  function setMap(open) {
    map.classList.toggle("open", open);
    map.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeButton.focus();
    else openButton.focus();
  }

  openButton.addEventListener("click", () => setMap(true));
  closeButton.addEventListener("click", () => setMap(false));
  addEventListener("keydown", event => {
    if (event.key === "Escape" && map.classList.contains("open")) setMap(false);
  });

  document.querySelectorAll(".nav-group>button").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.parentElement;
      const open = !group.classList.contains("open");
      document.querySelectorAll(".nav-group").forEach(item => {
        item.classList.remove("open");
        item.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (open) {
        group.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  addEventListener("click", event => {
    if (!event.target.closest(".nav-group")) {
      document.querySelectorAll(".nav-group").forEach(group => {
        group.classList.remove("open");
        group.querySelector("button").setAttribute("aria-expanded", "false");
      });
    }
  });

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Switch color theme");
    document.title = language === "ru" ? "Header и footer Manul — прототип" : "Manul header and footer — prototype";
  }

  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  document.getElementById("toTop").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const clocks = [document.getElementById("shellClock"), document.getElementById("footerClock")];
  function updateClock() {
    const value = new Date().toLocaleTimeString(language === "ru" ? "ru-RU" : "en-GB", { hour12: false });
    clocks.forEach(clock => { clock.textContent = value; });
  }
  updateClock();
  setInterval(updateClock, 1000);
  applyLanguage(language);
})();
