(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("manul-theme");
  const preferredDark = matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = savedTheme || (preferredDark ? "dark" : "light");

  document.querySelector(".theme")?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("manul-theme", root.dataset.theme);
  });

  document.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll("details[open]").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
