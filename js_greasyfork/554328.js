// ==UserScript==
// @name         CSGO Trader Extension Addon - Inventory Value with Sticker Price Sum
// @namespace    https://tony-liu.com
// @version      1.4
// @description  Total inventory value with applied sticker price, adds an inline stickers sum and combined total next to “Total Inventory Value:”, needs CSGO Trader Browser Extension.
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/*/inventory*
// @run-at       document-idle
// @grant        none
// @license      MIT
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

  // Matches common currency symbols OR 3-letter ISO codes (USD/EUR/GBP etc.)
  const CURRENCY_TOKEN_REGEX =
    /(?:R\$|C\$|A\$|NZ\$|HK\$|S\$)|[€£$¥₽₩₺₹฿₫₴₦₱₪₡₵₸₼₨]|(?:\b[A-Z]{3}\b)/;

  // Tolerant number matcher (handles thin spaces and NBSP)
  const NUM_REGEX =
    /-?\d{1,3}(?:[,\s\u00A0\u2009]\d{3})*(?:[.,]\d+)?|-?\d+(?:[.,]\d+)?/;

  function guessTokenPos(raw, token) {
    if (!token) return 'prefix';
    const idx = raw.indexOf(token);
    if (idx === -1) return 'prefix';
    const num = raw.match(NUM_REGEX);
    if (!num) return 'prefix';
    const nidx = raw.indexOf(num[0]);
    return idx < nidx ? 'prefix' : 'suffix';
  }

  function parsePrice(str) {
    if (!str) return { value: 0, token: '', tokenPos: 'prefix' };

    const raw = String(str).replace(/\s+/g, ' ').trim();

    const tokenMatch = raw.match(CURRENCY_TOKEN_REGEX);
    const token = tokenMatch ? tokenMatch[0] : '';

    const numMatch = raw.match(NUM_REGEX);
    if (!numMatch) return { value: 0, token, tokenPos: guessTokenPos(raw, token) };

    let n = numMatch[0].trim();

    // Strip grouping spaces (normal, NBSP, thin space)
    n = n.replace(/[\s\u00A0\u2009]/g, '');

    const hasComma = n.includes(',');
    const hasDot = n.includes('.');

    if (hasComma && hasDot) {
      // Both present: decide by last separator (common robust approach)
      const lastComma = n.lastIndexOf(',');
      const lastDot = n.lastIndexOf('.');
      if (lastComma > lastDot) {
        // "1.234,56" => thousands '.' and decimal ','
        n = n.replace(/\./g, '').replace(',', '.');
      } else {
        // "1,234.56" => thousands ',' and decimal '.'
        n = n.replace(/,/g, '');
      }
    } else if (hasComma) {
      // Only comma present: decide if comma is thousands or decimal
      const parts = n.split(',');
      const lastPart = parts[parts.length - 1] || '';
      if (lastPart.length === 3 && parts.length >= 2) {
        // e.g. "1,047" or "12,345,678" => thousands grouping
        n = n.replace(/,/g, '');
      } else {
        // e.g. "12,34" => decimal comma
        n = n.replace(/,/g, '.');
      }
    } else if (hasDot) {
      // Only dot present: decide if dot is thousands or decimal
      const parts = n.split('.');
      const lastPart = parts[parts.length - 1] || '';
      if (lastPart.length === 3 && parts.length >= 2) {
        // e.g. "1.047" or "12.345.678" => thousands grouping
        n = n.replace(/\./g, '');
      } else {
        // decimal dot => keep as-is
      }
    }

    const value = parseFloat(n);
    return { value: isNaN(value) ? 0 : value, token, tokenPos: guessTokenPos(raw, token) };
  }

  function formatMoney(value, token, tokenPos) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    const num = abs.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (!token) return `${sign}${num}`;

    const isCode = /^[A-Z]{3}$/.test(token);
    const spacer = isCode ? ' ' : '';

    return tokenPos === 'suffix'
      ? `${sign}${num}${spacer}${token}`
      : `${sign}${token}${spacer}${num}`;
  }

  function sumStickerPrices() {
    const nodes = document.querySelectorAll('.stickerPrice');
    let total = 0;
    let token = '';
    let tokenPos = 'prefix';

    nodes.forEach(n => {
      const parsed = parsePrice(n.textContent || n.innerText || '');
      if (!token && parsed.token) {
        token = parsed.token;
        tokenPos = parsed.tokenPos;
      }
      total += parsed.value;
    });

    return { total, token, tokenPos, count: nodes.length };
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
    if (!el) return { value: 0, token: '', tokenPos: 'prefix' };
    return parsePrice(el.textContent.trim());
  }

  function upsertInlineBadge() {
    const container = findTotalInventoryValueNode();
    if (!container) return;

    let badge = container.querySelector('.tm-sticker-badge');

    const base = getBaseTotal();
    const stickers = sumStickerPrices();
    const combined = base.value + stickers.total;

    // Prefer base total currency, then sticker currency; no hardcoded fallback
    const token = base.token || stickers.token || '';
    const tokenPos = base.token ? base.tokenPos : stickers.tokenPos;

    const text = `+ Stickers: ${formatMoney(stickers.total, token, tokenPos)} (${stickers.count})  =  `;
    const combinedHTML = `<strong>${formatMoney(combined, token, tokenPos)}</strong>`;
    const content = `<span>${text}</span>${combinedHTML}`;

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tm-sticker-badge';
      container.appendChild(badge);
    }

    const key = `${base.value}|${stickers.total}|${stickers.count}|${token}|${tokenPos}`;
    if (badge.getAttribute('data-last') !== key) {
      badge.innerHTML = content;
      badge.setAttribute('data-last', key);
      badge.title =
        `Base: ${formatMoney(base.value, token, tokenPos)}\n` +
        `Stickers: ${formatMoney(stickers.total, token, tokenPos)} (${stickers.count})\n` +
        `Combined: ${formatMoney(combined, token, tokenPos)}`;
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
