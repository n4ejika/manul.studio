(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("redesignLanguage");
  const themeButton = document.getElementById("redesignTheme");
  const gameShell = document.querySelector(".migration-console");
  const map = document.getElementById("redesignMap");
  const core = map.querySelector(".migration-core");
  const coreStatus = document.getElementById("redesignCoreStatus");
  const attemptsLabel = document.getElementById("redesignAttempts");
  const resetButton = document.getElementById("redesignReset");
  const preserveButtons = [...document.querySelectorAll("[data-preserve]")];
  const startReadout = document.getElementById("redesignStartReadout");
  const startCount = document.getElementById("redesignStartCount");
  const startStatus = document.getElementById("redesignStartStatus");
  const nodeButtons = [...map.querySelectorAll(".site-state button")];
  const routePaths = [...map.querySelectorAll("svg path[data-route]")];
  const errorPath = map.querySelector("[data-route-error]");
  let language = localStorage.getItem("manul-system-language") || "ru";
  let selection = null;
  let mistakes = 0;
  let matched = new Set();
  let locked = false;
  let resolving = false;
  let preserved = new Set();

  const copy = {
    ready: { ru: "НАЙДИ 4 СВЯЗИ", en: "FIND 4 LINKS" },
    selected: { ru: "ВЫБЕРИ ПАРУ", en: "CHOOSE ITS MATCH" },
    progress: { ru: count => `СВЯЗЕЙ ${count} / 4`, en: count => `LINKS ${count} / 4` },
    wrong: { ru: "НЕ ТА СТРАНИЦА", en: "WRONG PAGE" },
    failed: { ru: "3 ОШИБКИ / ЗАНОВО", en: "3 MISTAKES / RESET" },
    success: { ru: "ВСЕ СВЯЗИ СОХРАНЕНЫ", en: "ALL LINKS SAVED" }
  };
  const startCopy = {
    0: { ru: "Отметьте, что важно сохранить.", en: "Select what must be preserved." },
    1: { ru: "Зафиксируем один критичный контур.", en: "One critical system will be documented." },
    2: { ru: "Диагностика свяжет два контура.", en: "Diagnosis will connect two systems." },
    3: { ru: "Почти полный контур перезапуска.", en: "An almost complete relaunch scope." },
    4: { ru: "Полный контур сохранения собран.", en: "The full preservation scope is ready." }
  };

  function statusText(key, value) {
    const item = copy[key][language];
    return typeof item === "function" ? item(value) : item;
  }

  function updateLabels(statusKey = matched.size ? "progress" : "ready") {
    attemptsLabel.textContent = language === "ru"
      ? `ОШИБКИ ${mistakes} / 3`
      : `MISTAKES ${mistakes} / 3`;
    coreStatus.textContent = statusText(statusKey, matched.size);
  }

  function updateStartSystem() {
    const count = preserved.size;
    document.querySelector(".start-options").setAttribute(
      "aria-label",
      language === "ru"
        ? "Что необходимо сохранить при редизайне"
        : "What must be preserved during redesign"
    );
    preserveButtons.forEach(button => {
      const active = preserved.has(button.dataset.preserve);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    startCount.textContent = `${count} / 4`;
    startStatus.textContent = startCopy[count][language];
    startReadout.style.setProperty("--progress", `${count * 90}deg`);
    startReadout.classList.toggle("complete", count === 4);
  }

  function getSide(button) {
    return button.closest(".state-old") ? "old" : "new";
  }

  function routeGeometry(oldCard, newCard, anchorY) {
    const bounds = map.getBoundingClientRect();
    const coreBounds = core.getBoundingClientRect();
    const oldBounds = oldCard.getBoundingClientRect();
    const newBounds = newCard.getBoundingClientRect();
    const startX = oldBounds.right - bounds.left;
    const startY = oldBounds.top - bounds.top + oldBounds.height / 2;
    const endX = newBounds.left - bounds.left;
    const endY = newBounds.top - bounds.top + newBounds.height / 2;
    const coreLeft = coreBounds.left - bounds.left;
    const coreRight = coreBounds.right - bounds.left;
    const oldControl = Math.max(36, (coreLeft - startX) * .55);
    const newControl = Math.max(36, (endX - coreRight) * .55);
    return (
      `M ${startX} ${startY} ` +
      `C ${startX + oldControl} ${startY}, ${coreLeft - oldControl} ${anchorY}, ${coreLeft} ${anchorY} ` +
      `L ${coreRight} ${anchorY} ` +
      `C ${coreRight + newControl} ${anchorY}, ${endX - newControl} ${endY}, ${endX} ${endY}`
    );
  }

  function drawRoutes() {
    const bounds = map.getBoundingClientRect();
    const coreBounds = core.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !coreBounds.width) return;
    const svg = map.querySelector("svg");
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    const coreY = coreBounds.top - bounds.top + coreBounds.height / 2;
    const anchors = { home: -54, service: -18, article: 18, form: 54 };
    routePaths.forEach(path => {
      const node = path.dataset.route;
      const oldCard = map.querySelector(`.state-old [data-node="${node}"]`);
      const newCard = map.querySelector(`.state-new [data-node="${node}"]`);
      path.setAttribute("d", routeGeometry(oldCard, newCard, coreY + anchors[node]));
    });
  }

  function drawErrorRoute(oldCard, newCard) {
    const bounds = map.getBoundingClientRect();
    const coreBounds = core.getBoundingClientRect();
    const coreY = coreBounds.top - bounds.top + coreBounds.height / 2;
    errorPath.setAttribute("d", routeGeometry(oldCard, newCard, coreY));
    errorPath.classList.add("visible");
  }

  function clearSelection() {
    nodeButtons.forEach(button => button.classList.remove("selected"));
    selection = null;
  }

  function finishSuccess() {
    locked = true;
    core.classList.add("success");
    updateLabels("success");
  }

  function failAttempt(first, second) {
    resolving = true;
    mistakes += 1;
    const oldCard = getSide(first) === "old" ? first : second;
    const newCard = getSide(first) === "new" ? first : second;
    first.classList.remove("selected");
    second.classList.add("wrong");
    first.classList.add("wrong");
    drawErrorRoute(oldCard, newCard);
    updateLabels("wrong");

    if (mistakes >= 3) {
      locked = true;
      core.classList.add("failed");
      nodeButtons.filter(button => !button.classList.contains("matched")).forEach(button => {
        button.disabled = true;
      });
    }

    window.setTimeout(() => {
      first.classList.remove("wrong");
      second.classList.remove("wrong");
      errorPath.classList.remove("visible");
      errorPath.removeAttribute("d");
      selection = null;
      resolving = false;
      updateLabels(locked ? "failed" : (matched.size ? "progress" : "ready"));
    }, 720);
  }

  function matchPair(first, second) {
    const node = first.dataset.node;
    first.classList.remove("selected");
    first.classList.add("matched");
    second.classList.add("matched");
    first.disabled = true;
    second.disabled = true;
    matched.add(node);
    map.querySelector(`path[data-route="${node}"]`).classList.add("correct");
    selection = null;
    if (matched.size === routePaths.length) finishSuccess();
    else updateLabels("progress");
  }

  function choose(button) {
    if (locked || resolving || button.classList.contains("matched")) return;
    gameShell.classList.add("game-started");
    const side = getSide(button);

    if (!selection) {
      selection = { button, side };
      button.classList.add("selected");
      updateLabels("selected");
      return;
    }

    if (selection.side === side) {
      selection.button.classList.remove("selected");
      selection = { button, side };
      button.classList.add("selected");
      return;
    }

    const first = selection.button;
    if (first.dataset.node === button.dataset.node) matchPair(first, button);
    else failAttempt(first, button);
  }

  function resetGame() {
    selection = null;
    mistakes = 0;
    matched = new Set();
    locked = false;
    resolving = false;
    nodeButtons.forEach(button => {
      button.disabled = false;
      button.classList.remove("selected", "matched", "wrong");
    });
    routePaths.forEach(path => path.classList.remove("correct"));
    errorPath.classList.remove("visible");
    errorPath.removeAttribute("d");
    core.classList.remove("success", "failed");
    gameShell.classList.remove("game-started");
    updateLabels("ready");
    requestAnimationFrame(drawRoutes);
  }

  function applyLanguage(next) {
    language = next;
    root.lang = language;
    localStorage.setItem("manul-system-language", language);
    document.querySelectorAll("main [data-ru][data-en]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    document.querySelectorAll("[data-price-key]").forEach(element => {
      element.textContent = ManulCalculator.formatMoney(ManulCalculator.getPrice(element.dataset.priceKey, language), language);
    });
    languageButton.textContent = language === "ru" ? "EN" : "RU";
    updateLabels(core.classList.contains("success") ? "success" : core.classList.contains("failed") ? "failed" : matched.size ? "progress" : selection ? "selected" : "ready");
    updateStartSystem();
  }

  nodeButtons.forEach(button => button.addEventListener("click", () => choose(button)));
  preserveButtons.forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.preserve;
    if (preserved.has(key)) preserved.delete(key);
    else preserved.add(key);
    updateStartSystem();
  }));
  resetButton.addEventListener("click", resetGame);
  languageButton.addEventListener("click", () => applyLanguage(language === "ru" ? "en" : "ru"));
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-system-theme", root.dataset.theme);
  });
  document.querySelectorAll(".redesign-faq details").forEach(details => details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".redesign-faq details").forEach(item => {
      if (item !== details) item.open = false;
    });
  }));
  new ResizeObserver(() => requestAnimationFrame(drawRoutes)).observe(map);
  applyLanguage(language);
  resetGame();
})();
