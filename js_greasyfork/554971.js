// ==UserScript==
// @license MIT
// @name         Dead Frontier Better Money Inputs
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  Expands shorthand money values (e.g. 1.45m → 1450000) instantly in DF1 Bank, Market, or Trade fields.
// @author       GaslightGod
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554971/Dead%20Frontier%20Better%20Money%20Inputs.user.js
// @updateURL https://update.greasyfork.org/scripts/554971/Dead%20Frontier%20Better%20Money%20Inputs.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== CONFIG =====
  const MULT = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
  const TOKEN_RE = /^(\d+(?:\.\d+)?)([kKmMbBtT])$/;
  let DEBUG = false;

  // ===== UTILITIES =====
  function log(...args) {
    if (DEBUG) console.log('[DF-Money]', ...args);
  }

  // Expand "4m" → "4000000"
  function expandToken(str) {
    const match = str.match(TOKEN_RE);
    if (!match) return null;
    const num = parseFloat(match[1]);
    const mult = MULT[match[2].toLowerCase()];
    if (!isFinite(num) || !mult) return null;
    const result = num * mult;
    return Number.isInteger(result)
      ? result.toString()
      : result.toFixed(2).replace(/\.?0+$/, '');
  }

  // ===== CORE =====
  function sanitizeValue(el) {
    if (el.value.includes(',')) {
      el.value = el.value.replace(/,/g, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function handleTyping(el) {
    let raw = el.value.trim();
    if (!raw) return;
    raw = raw.replace(/,/g, '');

    const expanded = expandToken(raw);
    if (expanded && expanded !== raw) {
      el.value = expanded;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      log('Expanded live:', raw, '→', expanded);
    }
  }

  function convertField(el) {
    const raw = el.value.trim().replace(/,/g, '');
    if (!raw) return;

    if (!/[kKmMbBtT]/.test(raw)) {
      sanitizeValue(el);
      return;
    }

    const expanded = expandToken(raw);
    if (!expanded) return;

    el.value = expanded;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    log('Expanded confirmed:', raw, '→', expanded);
  }

  // ===== BINDINGS =====
  function setupField(el) {
    if (!el || el.dataset.dfMoneyBound) return;

    // Skip the Market Search field
    if (
      el.id === 'searchField' ||
      el.name === 'marketSearch' ||
      el.classList.contains('marketSearch')
    ) {
      log('Skipped field:', el);
      return;
    }

    el.dataset.dfMoneyBound = 'true';

    // convert number fields to text to allow typing letters (k,m,b,t)
    if (el.type === 'number') el.type = 'text';
    el.placeholder ||= '';

    el.addEventListener('input', () => {
      sanitizeValue(el);
      handleTyping(el);
    });

    el.addEventListener('keydown', e => {
      if (['Enter', 'Tab'].includes(e.key)) convertField(el);
    });

    el.addEventListener('blur', () => convertField(el));

    log('Bound field:', el);
  }

  // ===== FIELD INITIALIZATION =====
  function initAllFields() {
    document.querySelectorAll(`
      input#deposit,
      input#withdraw,
      input.moneyField,
      input[data-type="price"],
      input.cashLabels,
      input[data-currency="cash"],
      input[name="price"],
      input.marketPrice
    `).forEach(el => {
      // Skip the Market Search field
      if (el.id === 'searchField' || el.name === 'marketSearch' || el.classList.contains('marketSearch')) return;
      setupField(el);
    });
  }

  // ===== WATCH FOR DYNAMIC ELEMENTS =====
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('input, .marketPrice, [data-type="price"]')) {
              setupField(node);
            }
            node.querySelectorAll &&
              node
                .querySelectorAll('input, .marketPrice, [data-type="price"]')
                .forEach(setupField);
          }
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ===== KEYBOARD TOGGLES =====
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
      DEBUG = !DEBUG;
      alert(`Debug mode ${DEBUG ? 'ENABLED' : 'DISABLED'}`);
    }
  });

  // ===== INIT =====
  if ('requestIdleCallback' in window)
    requestIdleCallback(initAllFields);
  else {
    window.addEventListener('load', initAllFields);
    document.addEventListener('DOMContentLoaded', initAllFields);
  }

  console.log('[DF-Money] Dead Frontier Money Expander active (Marketplace compatible, market search excluded).');
})();
