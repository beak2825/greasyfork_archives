// ==UserScript==
// @name         CoffeeMonsterz-OrderSort-v4 (Shopify New UI Fix - Stable Insert)
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Auto-sort Shopify order line items by SKU (updated for Shopify new Polaris UI). SPA navigation support + layout-safe marker insertion.
// @author       Sam Tang / Alex Yuan
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/*
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554018/CoffeeMonsterz-OrderSort-v4%20%28Shopify%20New%20UI%20Fix%20-%20Stable%20Insert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554018/CoffeeMonsterz-OrderSort-v4%20%28Shopify%20New%20UI%20Fix%20-%20Stable%20Insert%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("🚀 CoffeeMonsterz v3.7 Active (Shopify New UI Fix - Stable Insert)");

  let lastUrl = location.href;
  let processing = false;

  // 🧠 Debounce helper
  const debounce = (fn, delay = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // 🕐 Wait for condition
  function waitFor(condition, interval = 500, retries = 12) {
    return new Promise(resolve => {
      let tries = 0;
      const timer = setInterval(() => {
        const ok = (() => {
          try { return !!condition(); } catch { return false; }
        })();
        if (ok || tries++ > retries) {
          clearInterval(timer);
          resolve(ok);
        }
      }, interval);
    });
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // ✅ NEW: Find line items based on Shopify new UI structure (layout-safe)
  function findLineItemsAndContainer() {
    const all = Array.from(document.querySelectorAll('div[class*="_LineItemContainer_"]'))
      .filter(isVisible);

    if (all.length < 2) return { container: null, items: [] };

    // Group by parent; pick the biggest visible group
    const groups = new Map();
    for (const it of all) {
      const p = it.parentElement;
      if (!p) continue;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(it);
    }

    let container = null;
    let items = [];
    for (const [p, arr] of groups.entries()) {
      if (arr.length > items.length) {
        container = p;
        items = arr;
      }
    }

    return { container, items };
  }

  // 🔢 SKU comparison (supports letter+number+letter patterns)
  function compareSKU(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    const tokenize = s => (s || '').toUpperCase().match(/[A-Z]+|\d+/g) || [];
    const aTokens = tokenize(a);
    const bTokens = tokenize(b);
    const len = Math.max(aTokens.length, bTokens.length);

    for (let i = 0; i < len; i++) {
      const aPart = aTokens[i] || "";
      const bPart = bTokens[i] || "";

      const aNum = /^\d+$/.test(aPart);
      const bNum = /^\d+$/.test(bPart);

      if (aNum && bNum) {
        const diff = parseInt(aPart, 10) - parseInt(bPart, 10);
        if (diff !== 0) return diff;
        continue;
      }

      // number comes first
      if (aNum && !bNum) return -1;
      if (!aNum && bNum) return 1;

      const strDiff = aPart.localeCompare(bPart);
      if (strDiff !== 0) return strDiff;
    }
    return 0;
  }

  // 🧾 Extract title + SKU from new UI line item node
  function extractData(el) {
    const a = el.querySelector('a.Polaris-Link, a[href*="/products/"]');
    const title = a ? a.textContent.trim() : (el.textContent || '').trim().slice(0, 60);

    let sku = '';
    const skuLabel = Array.from(el.querySelectorAll('s-internal-text'))
      .find(n => (n.textContent || '').trim().toUpperCase() === 'SKU');

    if (skuLabel) {
      const wrap = skuLabel.parentElement || el;
      // Your DOM shows SKU value in a subdued span
      const candidate = wrap.querySelector('span.Polaris-Text--subdued');
      if (candidate) sku = (candidate.textContent || '').trim();
    }

    // Fallback: find a SKU-like token
    if (!sku) {
      const t = el.textContent || '';
      const m = t.match(/\b[A-Z]{1,6}-?\d{2,6}[A-Z0-9]{0,6}\b/);
      sku = m ? m[0] : '';
    }

    return { sku, title };
  }

  // 🔢 Sort order items (layout-safe): insert in place using a marker
  function sortItems(container, items) {
    if (!container || !items || items.length < 2) return;

    const data = items.map(el => ({ el, ...extractData(el) }));
    data.sort((a, b) => compareSKU(a.sku, b.sku) || a.title.localeCompare(b.title));

    const first = items[0];
    const marker = document.createComment('cmz-sort-marker');
    container.insertBefore(marker, first);

    // Insert sorted items before marker, so we preserve original block position
    for (const d of data) {
      container.insertBefore(d.el, marker);
    }

    marker.remove();
    console.log("✅ Sorted by SKU (marker-based, layout-safe)");
  }

  // 🧩 Safe DOM helpers
  function safeAppend(parent, node) {
    try { if (parent && node && parent.appendChild) parent.appendChild(node); }
    catch (err) { console.warn("⚠️ safeAppend failed:", err); }
  }
  function safeInsertBefore(parent, node, ref) {
    try {
      if (parent && node && ref && parent.insertBefore) parent.insertBefore(node, ref);
      else safeAppend(parent, node);
    } catch (err) {
      console.warn("⚠️ safeInsertBefore failed:", err);
    }
  }
  function safeRun(fn) {
    try { fn(); } catch (e) { console.warn("⚠️ Safe run failed:", e); }
  }

  // 💰 Add discounted price safely (kept from your original; minimal touch)
  function addDiscountPrice() {
    const subtotalNode = Array.from(document.querySelectorAll('span')).find(n => n.textContent.includes('Subtotal'));
    if (!subtotalNode) return;

    const section = subtotalNode.closest('section, div, li') || document.body;
    const text = section.textContent || '';
    const subtotal = extractDollar(text, 'Subtotal');
    const discount = extractDollar(text, 'Discount');
    const shipping = extractDollar(text, 'Shipping');
    if (!subtotal) return;

    // Avoid duplicating rows on re-runs
    const existingAfter = document.getElementById('discountPriceRow');
    const existingBeforeShip = document.getElementById('beforeShippingRow');
    if (existingAfter) existingAfter.remove();
    if (existingBeforeShip) existingBeforeShip.remove();

    if (discount) {
      const after = subtotal - discount;
      const node = subtotalNode.parentElement.cloneNode(true);
      node.id = 'discountPriceRow';
      updateRow(node, 'After Discount', `$${after.toFixed(2)}`);
      safeAppend(section, node);
    }

    if (shipping) {
      const before = subtotal - (discount || 0);
      const node = subtotalNode.parentElement.cloneNode(true);
      node.id = 'beforeShippingRow';
      updateRow(node, 'Before Shipping', `$${before.toFixed(2)}`);

      const shippingNode = Array.from(section.querySelectorAll('span')).find(s => s.textContent.includes('Shipping'));
      if (shippingNode) {
        safeInsertBefore(section, node, shippingNode.closest('div, li') || shippingNode);
      } else {
        safeAppend(section, node);
      }
    }
  }

  function extractDollar(text, keyword) {
    const regex = new RegExp(`${keyword}[^$]*\\$\\s*([\\d,]+\\.?\\d*)`, 'i');
    const match = text.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  function updateRow(node, label, value) {
    node.querySelectorAll('span').forEach(s => {
      if (s.textContent.includes('Subtotal')) s.textContent = label;
      if (s.textContent.match(/\$\s*[\d,]+/)) s.textContent = value;
    });
  }

  // 📦 Observe React re-renders (watch the whole document, but debounce heavily)
  function observeRerenders() {
    if (window._cmzObserved) return;
    window._cmzObserved = true;

    const debouncedResort = debounce(() => {
      if (!/\/orders\/\d+/.test(location.href)) return;
      const found = findLineItemsAndContainer();
      if (found.container && found.items.length >= 2) {
        sortItems(found.container, found.items);
      }
    }, 600);

    const obs = new MutationObserver(muts => {
      // Only trigger when there are real DOM changes
      if (muts.some(m => m.type === 'attributes' || (m.addedNodes && m.addedNodes.length) || (m.removedNodes && m.removedNodes.length))) {
        debouncedResort();
      }
    });

    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  // 🔘 Add manual button
  function ensureRefreshButton() {
    if (document.getElementById('orderRefreshButton')) return;

    const btn = document.createElement('button');
    btn.textContent = '🔄 Resort Items';
    btn.id = 'orderRefreshButton';

    Object.assign(btn.style, {
      position: 'fixed',
      top: '80px',
      right: '30px',
      zIndex: 9999,
      background: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    });

    btn.addEventListener('click', () => {
      console.log("🔁 Manual re-sort triggered");
      process(true);
    });

    document.body.appendChild(btn);
  }

  // 🧭 Hook Shopify SPA navigation (pushState/replaceState)
  function hookHistory() {
    const push = history.pushState;
    const replace = history.replaceState;

    const trigger = debounce(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("🔄 Detected SPA navigation, reprocessing...");
        process(true);
      }
    }, 600);

    history.pushState = function (...args) { push.apply(this, args); trigger(); };
    history.replaceState = function (...args) { replace.apply(this, args); trigger(); };
    window.addEventListener('popstate', trigger);
  }

  // 🧩 Main process logic
  async function process(force = false) {
    if (processing && !force) return;
    processing = true;

    const url = location.href;
    if (!url.match(/\/orders\/\d+/)) {
      processing = false;
      return;
    }

    // Wait until line items exist
    await waitFor(() => document.querySelector('div[class*="_LineItemContainer_"]'), 400, 25);

    const found = findLineItemsAndContainer();
    if (!found.container || found.items.length < 2) {
      console.warn("⚠️ Line items not ready, retry...");
      setTimeout(() => process(true), 800);
      processing = false;
      return;
    }

    sortItems(found.container, found.items);

    // React sometimes re-renders after first paint; do a quick second pass
    setTimeout(() => {
      const again = findLineItemsAndContainer();
      if (again.container && again.items.length >= 2) sortItems(again.container, again.items);
    }, 350);

    safeRun(addDiscountPrice);
    observeRerenders();
    ensureRefreshButton();

    processing = false;
  }

  // 🧠 Init
  function init() {
    if (window._coffeeOrderInit) return;
    window._coffeeOrderInit = true;

    hookHistory();
    observeRerenders();

    // Also check URL changes caused by DOM updates
    const watchUrl = new MutationObserver(debounce(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("🔍 DOM URL change detected, reprocessing...");
        process(true);
      }
    }, 900));
    watchUrl.observe(document.body, { childList: true, subtree: true });

    process(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
