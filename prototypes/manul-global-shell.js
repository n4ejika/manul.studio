(() => {
  const root = document.documentElement;
  const map = document.getElementById("manulSiteMap");
  const openButton = document.getElementById("manulMapOpen");
  const closeButton = document.getElementById("manulMapClose");
  const languageButton = document.getElementById("manulGlobalLanguage");
  const languageSwitcher = languageButton?.closest("[data-language-switcher]");
  const themeButton = document.getElementById("manulGlobalTheme");
  const shellRoots = document.querySelectorAll(".manul-global-header,.manul-global-map,.manul-global-footer,main.legal");
  const shellLanguage = document.body.dataset.shellLanguage;
  const shellLocale = document.body.dataset.shellLocale;
  const languageTarget = document.body.dataset.languageTarget;
  const languageLabel = document.body.dataset.languageLabel;
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
  language = shellLanguage
    ? shellLanguage
    : initialLanguageControl instanceof HTMLAnchorElement
      ? (root.lang.toLowerCase().startsWith("en") ? "en" : "ru")
      : initialLanguageControl
        ? (initialLanguageControl.textContent.trim() === "RU" ? "en" : "ru")
        : (root.lang.toLowerCase().startsWith("en") || /^\/ru(?:\/|$)/.test(location.pathname) ? "en" : "ru");

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
    if (event.key === "Escape" && languageSwitcher?.classList.contains("is-open")) {
      languageSwitcher.classList.remove("is-open");
      languageButton.setAttribute("aria-expanded", "false");
      languageButton.focus();
    }
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
    if (!event.target.closest("[data-language-switcher]") && languageSwitcher?.classList.contains("is-open")) {
      languageSwitcher.classList.remove("is-open");
      languageButton.setAttribute("aria-expanded", "false");
    }
    if (event.target.closest(".manul-global-header .nav-group")) return;
    document.querySelectorAll(".manul-global-header .nav-group").forEach(group => {
      group.classList.remove("open");
      group.querySelector("button").setAttribute("aria-expanded", "false");
    });
  });

  function applyShellLanguage(next) {
    language = next;
    const shellCopyLanguage = language === "ru" || language === "en" ? language : null;
    root.lang = shellLocale || language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("manul-system-language", language);
    if (shellCopyLanguage) {
      shellRoots.forEach(shell => shell.querySelectorAll("[data-ru][data-en]").forEach(element => {
        const value = element.dataset[shellCopyLanguage];
        if (value != null) element.innerHTML = value;
      }));
    }
    shellRoots.forEach(shell => shell.querySelectorAll("img[data-ru-src][data-en-src]").forEach(image => {
      image.src = image.dataset[`${shellCopyLanguage === "ru" ? "ru" : "en"}Src`];
    }));
    // Astro renders canonical internal links for the active language.
    // Do not rewrite them in the browser.
    if (languageButton && !languageSwitcher) languageButton.textContent = languageLabel || (language === "ru" ? "EN" : "RU");
    languageButton?.setAttribute(
      "aria-label",
      ({ en: "Choose language", ru: "Выбрать язык", de: "Sprache wählen", fr: "Choisir la langue", ar: "اختر اللغة" })[language] || "Choose language",
    );
    themeButton.setAttribute("aria-label", language === "ar" ? "تبديل السمة" : language === "ru" ? "Переключить тему" : "Switch color theme");
  }

  languageButton?.addEventListener("click", event => {
    if (languageSwitcher) {
      event.preventDefault();
      const open = !languageSwitcher.classList.contains("is-open");
      languageSwitcher.classList.toggle("is-open", open);
      languageButton.setAttribute("aria-expanded", String(open));
      return;
    }
    if (languageTarget) {
      event.preventDefault();
      location.href = languageTarget;
      return;
    }
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
    const locale = language === "ar" ? "ar-AE-u-nu-latn" : language === "ru" ? "ru-RU" : "en-GB";
    const value = new Date().toLocaleTimeString(locale, { hour12: false });
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
  const hierarchySelector = "main h2,main h3,main h4,main h5,main h6";
  const hierarchyCaps = {
    H2: { ratio: .88, className: "manul-heading-cap-h2" },
    H3: { ratio: .78, className: "manul-heading-cap-h3" },
    H4: { ratio: .68, className: "manul-heading-cap-h4" },
    H5: { ratio: .58, className: "manul-heading-cap-h5" },
    H6: { ratio: .5, className: "manul-heading-cap-h6" },
  };
  const hierarchyClasses = Object.values(hierarchyCaps).map(cap => cap.className);
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
  function clearHeadingHierarchy() {
    document.querySelectorAll(hierarchySelector).forEach(heading => {
      if (heading.dataset.manulHierarchyCapped === "true") {
        const baseValue = heading.dataset.manulHierarchyBaseValue || "";
        const basePriority = heading.dataset.manulHierarchyBasePriority || "";
        if (baseValue) heading.style.setProperty("font-size", baseValue, basePriority);
        else heading.style.removeProperty("font-size");
        delete heading.dataset.manulHierarchyCapped;
        delete heading.dataset.manulHierarchyBaseValue;
        delete heading.dataset.manulHierarchyBasePriority;
      }
      heading.classList.remove(...hierarchyClasses);
      heading.style.removeProperty("--manul-heading-cap-size");
    });
  }
  function applyHeadingHierarchy() {
    clearHeadingHierarchy();
    const pageH1 = document.querySelector("main h1");
    const h1Size = pageH1 ? parseFloat(getComputedStyle(pageH1).fontSize) : 0;
    if (!h1Size) return;
    document.documentElement.style.setProperty("--manul-page-h1-size", `${h1Size}px`);
    document.querySelectorAll(hierarchySelector).forEach(heading => {
      if (heading.classList.contains("manul-allow-over-h1")) return;
      const cap = hierarchyCaps[heading.tagName];
      if (!cap) return;
      const currentSize = parseFloat(getComputedStyle(heading).fontSize);
      if (currentSize > h1Size * cap.ratio) {
        heading.dataset.manulHierarchyCapped = "true";
        heading.dataset.manulHierarchyBaseValue = heading.style.getPropertyValue("font-size");
        heading.dataset.manulHierarchyBasePriority = heading.style.getPropertyPriority("font-size");
        heading.style.setProperty("font-size", `${h1Size * cap.ratio}px`, "important");
        heading.classList.add(cap.className);
      }
    });
  }
  function fitDisplayHeadings() {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(() => {
      clearHeadingHierarchy();
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
      applyHeadingHierarchy();
      requestAnimationFrame(applyHeadingHierarchy);
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
  addEventListener("load", () => setTimeout(applyHeadingHierarchy, 250), { once: true });

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
  setTimeout(applyHeadingHierarchy, 300);
  updateClock();
  setInterval(updateClock, 1000);
})();
