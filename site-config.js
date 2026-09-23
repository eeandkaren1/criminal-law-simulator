/* Shared site identity. Update these values when the brand or contact changes. */
window.SITE_CONFIG = Object.freeze({
  brand: "LawVibe 法律風",
  product: "刑法鎮 LawTown",
  contactEmail: "lawvibe2026@gmail.com",
  copyright: "© 2026 LawVibe 法律風｜刑法鎮 LawTown｜All Rights Reserved."
});

(function applySiteConfig() {
  const config = window.SITE_CONFIG;
  const pageTitle = document.documentElement.dataset.pageTitle || "用闖關學刑法與刑事訴訟法";
  const pageDescription = document.documentElement.dataset.pageDescription || "以像素風格故事闖關認識刑法與刑事訴訟法，建立法律基礎知識。";

  function apply() {
    document.title = `${config.product}｜${config.brand}｜${pageTitle}`;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = `${config.product}｜${config.brand}｜${pageDescription}`;

    document.querySelectorAll("[data-site-brand]").forEach(el => { el.textContent = config.brand; });
    document.querySelectorAll("[data-site-product]").forEach(el => { el.textContent = config.product; });
    document.querySelectorAll("[data-site-operator]").forEach(el => { el.textContent = config.brand; });
    document.querySelectorAll("[data-site-email]").forEach(el => {
      if (el.tagName === "A") el.href = `mailto:${config.contactEmail}`;
      el.textContent = config.contactEmail;
    });
    document.querySelectorAll("[data-site-copyright]").forEach(el => { el.textContent = config.copyright; });
    document.querySelectorAll("[data-site-year]").forEach(el => { el.textContent = "2026"; });
  }

  // Apply title and meta immediately when this file is loaded in <head>.
  // Run once more after DOM parsing so body placeholders are populated too.
  apply();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  }
})();

window.addEventListener("error", function (event) {
  if (event.target && event.target.tagName === "IMG") {
    event.target.classList.add("asset-load-error");
  }
}, true);
