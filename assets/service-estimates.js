(() => {
  const root = document.querySelector('[data-service-estimate]');
  const core = window.ManulCalculator;
  if (!root || !core) return;
  const pricingLanguage = root.dataset.estimateLanguage === 'ru' ? 'ru' : 'en';
  const currency = core.calculateSeo({}, pricingLanguage).currency;
  const money = value => new Intl.NumberFormat(root.dataset.estimateLanguage, {style:'currency',currency,maximumFractionDigits:0}).format(value);
  const value = name => root.querySelector(`[name="${name}"]`)?.value;
  const set = (key, amount) => { const output = root.querySelector(`[data-price="${key}"]`); if (output) output.textContent = money(amount); };
  const update = () => {
    root.querySelectorAll('[data-count]').forEach(output => { output.textContent = value(output.dataset.count); });
    set('monthly', core.calculateSeo({queries:value('queries'),pages:value('seoPages'),market:value('market')}, pricingLanguage).total);
    if (root.querySelector('[data-project-estimate]')) {
      const result = core.calculate({pages:value('pages'),services:value('services'),contours:value('contours')}, pricingLanguage);
      set('development', result.developmentTotal);
      set('launch', result.launchTotal);
      set('developmentIntro', core.introductoryPrice(result.developmentTotal, pricingLanguage));
      set('launchIntro', result.introductoryTotal);
    }
  };
  root.addEventListener('input', update);
  root.addEventListener('change', update);
  update();
})();
