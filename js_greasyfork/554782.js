// ==UserScript==
// @name         Ocado price-per normaliser (100g)
// @namespace    https://ocado.com/
// @version      0.1
// @description  Convert Ocado unit prices to price per 100g across listings, basket and order/receipt pages
// @match        https://www.ocado.com/*
// @run-at       document-idle
// @grant        none
// @license     CC-0
// @downloadURL https://update.greasyfork.org/scripts/554782/Ocado%20price-per%20normaliser%20%28100g%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554782/Ocado%20price-per%20normaliser%20%28100g%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  "use strict";

  // Elements that contain unit pricing
  const UNIT_SELECTORS = [
    '[data-test="fop-price-per-unit"]',                 // Search/category listings
    '[data-test="pdp-price-per-unit"]',                 // Product detail page
    '[data-test="basket-price-per-unit"]',              // Basket
    '[data-test="receipt-element-product-size-details"]'// Order/receipt page
  ].join(",");

  const clean = (s) =>
    s.replace(/<!--.*?-->/g, "") // strip comment nodes
     .replace(/\u00A0/g, " ")
     .replace(/\s+/g, " ")
     .trim();

  function toPer100g(textRaw) {
    const text = clean(textRaw);

    // Match prices like "£7.73 per kilo", "£2.33 per 100g", "£1.20 per 10 g", "£3.50 per 200g"
    const re =
      /£\s*([\d]+(?:\.\d+)?)\s*per\s*(\d+(?:\.\d+)?)?\s*(kg|kilo|kilos|kilogram|kilograms|g)\b/i;

    const m = text.match(re);
    if (!m) return null;

    const price = parseFloat(m[1]);
    const qty = m[2] ? parseFloat(m[2]) : 1;
    const unit = m[3].toLowerCase();

    let p100;

    if (["kg", "kilo", "kilos", "kilogram", "kilograms"].includes(unit)) {
      p100 = price / (10 * (qty || 1));
    } else if (unit === "g") {
      if (!qty || qty <= 0) return null;
      if (qty === 100) return null;
      p100 = price * (100 / qty);
    } else return null;

    return `£${p100.toFixed(2)} per 100g`;
  }

  function updateNode(el) {
    const orig = el.textContent;
    const cleaned = clean(orig);

    // If this is a receipt line, e.g. "300g (£2.33 per kilo)"
    if (el.dataset.test === "receipt-element-product-size-details") {
      const m = cleaned.match(/^(\d+)\s*g\s*\((.+)\)$/i);
      if (m) {
        const size = m[1] + "g";
        const pricing = m[2];
        const newUnit = toPer100g(pricing);
        if (newUnit) {
          el.textContent = `${size} (${newUnit})`;
          el.dataset.ocado100g = "1";
        }
        return;
      }
    }

    // Regular price-per-unit elements
    const newUnit = toPer100g(cleaned);
    if (newUnit && newUnit !== cleaned) {
      el.textContent = `(${newUnit})`;
      el.dataset.ocado100g = "1";
    }
  }

  function updateAll(root = document) {
    const nodes = root.querySelectorAll(UNIT_SELECTORS);
    nodes.forEach(updateNode);
  }

  updateAll();

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList" && m.addedNodes?.length) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) updateAll(n);
        });
      }
      if (m.type === "characterData" && m.target?.parentElement) {
        const el = m.target.parentElement.closest(UNIT_SELECTORS);
        if (el) updateNode(el);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
