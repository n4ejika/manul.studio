(() => {
  const root = document.documentElement;
  const map = document.getElementById("manulSiteMap");
  const openButton = document.getElementById("manulMapOpen");
  const closeButton = document.getElementById("manulMapClose");
  const languageButton = document.getElementById("manulGlobalLanguage");
  const themeButton = document.getElementById("manulGlobalTheme");
  const shellRoots = document.querySelectorAll(".manul-global-header,.manul-global-map,.manul-global-footer,main.legal");
  let language = "ru";

  const legacyLanguage = () => document.querySelector([
    "body>.sys-header #systemLanguage",
    "body>.product-header #productLanguage",
    "body>.corporate-header #corporateLanguage",
    "body>.landing-header #landingLanguage",
    "body>.redesign-legacy #redesignLanguage",
    "body>.game-legacy #gameLanguage",
    "body>.direct-header #directLanguage",
    "body>.seo-header #seoLanguage",
    "body>.studio-header #studioLanguage",
    "body>.cases-header #casesLanguage",
    "body>.case-header #okeanLanguage",
    "body>.case-header #isevLanguage",
    "body>.case-header #crimeaLanguage",
    "body>.case-header #lucaLanguage",
    "body>.topbar .lang",
  ].join(","));
  const legacyTheme = () => document.querySelector([
    "body>.sys-header #systemTheme",
    "body>.product-header #productTheme",
    "body>.corporate-header #corporateTheme",
    "body>.landing-header #landingTheme",
    "body>.redesign-legacy #redesignTheme",
    "body>.game-legacy #gameTheme",
    "body>.direct-header #directTheme",
    "body>.seo-header #seoTheme",
    "body>.studio-header #studioTheme",
    "body>.cases-header #casesTheme",
    "body>.case-header #okeanTheme",
    "body>.case-header #isevTheme",
    "body>.case-header #crimeaTheme",
    "body>.case-header #lucaTheme",
    "body>.topbar .theme",
  ].join(","));
  const initialLanguageControl = legacyLanguage();
  language = initialLanguageControl instanceof HTMLAnchorElement
    ? (root.lang === "en" ? "en" : "ru")
    : initialLanguageControl
      ? (initialLanguageControl.textContent.trim() === "RU" ? "en" : "ru")
      : (root.lang === "en" || /^\/ru(?:\/|$)/.test(location.pathname) ? "en" : "ru");

  function setMap(open) {
    if (!map) return;
    map.classList.toggle("open", open);
    map.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    (open ? closeButton : openButton).focus();
  }
  openButton?.addEventListener("click", () => setMap(true));
  closeButton?.addEventListener("click", () => setMap(false));
  addEventListener("keydown", event => {
    if (event.key === "Escape" && map?.classList.contains("open")) setMap(false);
  });

  document.querySelectorAll(".manul-global-header .nav-group>button").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.parentElement;
      const open = !group.classList.contains("open");
      document.querySelectorAll(".manul-global-header .nav-group").forEach(item => {
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
    if (event.target.closest(".manul-global-header .nav-group")) return;
    document.querySelectorAll(".manul-global-header .nav-group").forEach(group => {
      group.classList.remove("open");
      group.querySelector("button").setAttribute("aria-expanded", "false");
    });
  });

  function applyShellLanguage(next) {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    shellRoots.forEach(shell => shell.querySelectorAll("[data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    }));
    shellRoots.forEach(shell => shell.querySelectorAll("img[data-ru-src][data-en-src]").forEach(image => {
      image.src = image.dataset[`${language}Src`];
    }));
    // Astro renders canonical internal links for the active language.
    // Do not rewrite them in the browser.
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    themeButton.setAttribute("aria-label", language === "ru" ? "Переключить тему" : "Switch color theme");
  }

  languageButton?.addEventListener("click", event => {
    const control = legacyLanguage();
    if (control instanceof HTMLAnchorElement) {
      event.preventDefault();
      location.href = control.href;
      return;
    }
    control?.click();
    applyShellLanguage(language === "ru" ? "en" : "ru");
  });
  themeButton?.addEventListener("click", () => {
    const control = legacyTheme();
    if (control) control.click();
    else {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("manul-theme", root.dataset.theme);
      localStorage.setItem("manul-system-theme", root.dataset.theme);
    }
  });
  document.getElementById("manulToTop")?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const clocks = [document.getElementById("manulGlobalClock"), document.getElementById("manulFooterClock")];
  function updateClock() {
    const value = new Date().toLocaleTimeString(language === "ru" ? "ru-RU" : "en-GB", { hour12: false });
    clocks.forEach(clock => { if (clock) clock.textContent = value; });
  }

  /*
   * Display-heading rule:
   * - words are never split;
   * - a reasonably short highlighted phrase may pull the whole heading down
   *   in size so the highlight remains a single typographic unit;
   * - long phrases still wrap at spaces instead of becoming unreadably small.
   */
  const headingSelector = "main h1:has(mark),main h2:has(mark),main h3:has(mark)";
  let fitFrame = 0;
  function measureNoWrap(element, headingStyle) {
    const probe = document.createElement("span");
    probe.textContent = element.textContent.trim();
    Object.assign(probe.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      zIndex: "-1",
      visibility: "hidden",
      whiteSpace: "nowrap",
      width: "max-content",
      fontFamily: headingStyle.fontFamily,
      fontSize: headingStyle.fontSize,
      fontWeight: headingStyle.fontWeight,
      fontStyle: headingStyle.fontStyle,
      letterSpacing: headingStyle.letterSpacing,
      lineHeight: headingStyle.lineHeight,
      paddingInline: getComputedStyle(element).paddingInline,
    });
    document.body.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width;
  }
  function fitDisplayHeadings() {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(() => {
      document.querySelectorAll(headingSelector).forEach(heading => {
        heading.style.removeProperty("font-size");
        heading.querySelectorAll(":scope > mark").forEach(mark => mark.classList.remove("manul-highlight-nowrap"));
        const style = getComputedStyle(heading);
        const baseSize = parseFloat(style.fontSize);
        const available = heading.getBoundingClientRect().width;
        const highlights = [...heading.querySelectorAll(":scope > mark")]
          .filter(mark => !mark.classList.contains("manul-highlight-wrap"));
        if (!available || !baseSize || !highlights.length) return;
        const widest = Math.max(...highlights.map(mark => measureNoWrap(mark, style)));
        if (widest <= available * .98) {
          highlights.forEach(mark => mark.classList.add("manul-highlight-nowrap"));
          return;
        }
        const ratio = available / widest;
        if (ratio >= .72) {
          heading.style.setProperty("font-size", `${Math.floor(baseSize * ratio * .98)}px`, "important");
          highlights.forEach(mark => mark.classList.add("manul-highlight-nowrap"));
        }
      });
    });
  }
  /*
   * Do not observe the whole document or the full height of <main>.
   * The clocks change every second and mobile browser chrome changes the
   * visual viewport height during a swipe. Both used to retrigger heading
   * measurement, briefly change content height and make scroll anchoring pull
   * the page upwards. Refit only when the layout width or a fitted heading
   * itself actually changes.
   */
  let fitViewportWidth = document.documentElement.clientWidth;
  addEventListener("resize", () => {
    const nextWidth = document.documentElement.clientWidth;
    if (nextWidth === fitViewportWidth) return;
    fitViewportWidth = nextWidth;
    fitDisplayHeadings();
  }, { passive: true });
  document.fonts?.ready.then(fitDisplayHeadings);

  const main = document.querySelector("main");
  if (main) {
    new MutationObserver(mutations => {
      const affectsDisplayHeading = mutations.some(mutation => {
        const target = mutation.target.nodeType === Node.TEXT_NODE
          ? mutation.target.parentElement
          : mutation.target;
        if (target?.closest?.(headingSelector)) return true;
        return [...mutation.addedNodes].some(node =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node.matches?.(headingSelector) || node.querySelector?.(headingSelector))
        );
      });
      if (affectsDisplayHeading) fitDisplayHeadings();
    }).observe(main, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  applyShellLanguage(language);
  fitDisplayHeadings();
  updateClock();
  setInterval(updateClock, 1000);
})();
