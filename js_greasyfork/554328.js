// ==UserScript==
// @name         CSGO Trader Extension Addon - Inventory Value with Sticker Price Sum
// @namespace    https://tonyliu.uk
// @version      1.2
// @description  Total inventory value with applyied sticker price, adds an inline stickers sum and combined total next to “Total Inventory Value:”, need to work with CSGO Trader Browser Extension.
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/*/inventory*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554328/CSGO%20Trader%20Extension%20Addon%20-%20Inventory%20Value%20with%20Sticker%20Price%20Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/554328/CSGO%20Trader%20Extension%20Addon%20-%20Inventory%20Value%20with%20Sticker%20Price%20Sum.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'tm-sticker-addon-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .tm-sticker-badge {
        display: inline-block;
        margin-left: 8px;
        font-size: 16px;
        opacity: .9;
        white-space: nowrap;
        vertical-align: baseline;
      }
      .tm-sticker-badge strong { font-weight: 600; }
    `;
    document.head.appendChild(style);
  }

  const CURRENCY_REGEX = /[€£$¥₽₩₺₹฿₫₴₦₱₭₲₪₡₵₸₼₨₽]|R\$|C\$|A\$|NZ\$|HK\$|S\$|₺/;
  const NUM_REGEX = /-?\d{1,3}(?:[,\s]\d{3})*(?:[.,]\d+)?|-?\d+(?:[.,]\d+)?/;

  function parsePrice(str) {
    if (!str) return { value: 0, symbol: '' };
    const symbol = (str.match(CURRENCY_REGEX) || [''])[0];
    const numMatch = str.match(NUM_REGEX);
    if (!numMatch) return { value: 0, symbol };
    let n = numMatch[0].trim();
    const lastComma = n.lastIndexOf(',');
    const lastDot = n.lastIndexOf('.');
    if (lastComma > lastDot) {
      n = n.replace(/[.\s]/g, '').replace(',', '.');
    } else {
      n = n.replace(/[, \u00A0]/g, '');
    }
    const value = parseFloat(n);
    return { value: isNaN(value) ? 0 : value, symbol };
  }

  function formatMoney(value, preferredSymbol) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    const num = abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${sign}${preferredSymbol || ''}${num}`;
  }

  function sumStickerPrices() {
    const nodes = document.querySelectorAll('.stickerPrice');
    let total = 0;
    let symbol = '';
    nodes.forEach(n => {
      const { value, symbol: s } = parsePrice(n.textContent || n.innerText || '');
      if (!symbol && s) symbol = s;
      total += value;
    });
    return { total, symbol, count: nodes.length };
  }

  function findTotalInventoryValueNode() {
    const all = Array.from(document.querySelectorAll('div, span, p, h1, h2, h3, h4, h5'));
    const candidates = all.filter(el => /^\s*Total\s+Inventory\s+Value/i.test(el.textContent || ''));
    if (candidates.length) return candidates[0];
    const contains = all.find(el => /Total\s+Inventory\s+Value/i.test(el.textContent || ''));
    return contains || null;
  }

  function getBaseTotal() {
  const el = document.getElementById('inventoryTotalValue');
  if (!el) return { value: 0, symbol: '' };
  return parsePrice(el.textContent.trim());
  }

  function upsertInlineBadge() {
    const container = findTotalInventoryValueNode();
    if (!container) return;
    let badge = container.querySelector('.tm-sticker-badge');
    const base = getBaseTotal();
    const stickers = sumStickerPrices();
    const combined = base.value + stickers.total;
    const currencySymbol = base.symbol || stickers.symbol || '£';
    const text = `+ Stickers: ${formatMoney(stickers.total, currencySymbol)} (${stickers.count})  =  `;
    const combinedHTML = `<strong>${formatMoney(combined, currencySymbol)}</strong>`;
    const content = `
      <span>${text}</span>${combinedHTML}
    `;

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tm-sticker-badge';
      container.appendChild(badge);
    }

    const key = `${base.value}|${stickers.total}|${stickers.count}|${currencySymbol}`;
    if (badge.getAttribute('data-last') !== key) {
      badge.innerHTML = content;
      badge.setAttribute('data-last', key);
      badge.title = `Base: ${formatMoney(base.value, currencySymbol)}\nStickers: ${formatMoney(stickers.total, currencySymbol)} (${stickers.count})\nCombined: ${formatMoney(combined, currencySymbol)}`;
    }
  }

  const observer = new MutationObserver(() => {
    if (observer._raf) cancelAnimationFrame(observer._raf);
    observer._raf = requestAnimationFrame(upsertInlineBadge);
  });

  function start() {
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(upsertInlineBadge, 1500);
    upsertInlineBadge();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') start();
  else window.addEventListener('DOMContentLoaded', start, { once: true });
})();

