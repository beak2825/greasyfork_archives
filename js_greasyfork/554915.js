// ==UserScript==
// @name         jakubryzyk
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  stake larp
// @author       ryzu
// @match        *://*.stake.jp/*
// @grant        GM_xmlhttpRequest
// @connect      api.exchangerate-api.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554915/jakubryzyk.user.js
// @updateURL https://update.greasyfork.org/scripts/554915/jakubryzyk.meta.js
// ==/UserScript==

(function () {
    'use strict';

  let plnToArs = 1354.22;
  let detectedCurrency = 'LTC';

  function fetchPlnToArs() {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://api.exchangerate-api.com/v4/latest/PLN",
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          if (data && data.rates && data.rates.ARS) {
            plnToArs = data.rates.ARS;
            console.log(`[LARP] PLN→ARS rate updated: ${plnToArs}`);
          }
        } catch (e) {
          console.error("[LARP] Failed to parse PLN->ARS rate:", e);
        }
      },
      onerror: function (e) {
        console.error("[LARP] PLN->ARS fetch error:", e);
      }
    });
  }

  setInterval(fetchPlnToArs, 300000);
  fetchPlnToArs();

  const fakePLNsvg = `<svg fill="none" viewBox="0 0 96 96" class="svg-icon"><title></title><path fill="#6CDE07" d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48"></path><path fill="#1B3802" d="M51.517 73.319v6.56h-5.8v-6.48c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48v-14.04c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84zm-5.8-30.96v-11.32c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36m12.88 16.92c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4"></path></svg>`;

  function isPLNsvg(s) {
    const h = s.outerHTML;
    if (/PLN/i.test(h)) return true;
    if (h.includes('m27.8 62.4-1.24-5.08') || h.includes('M53.36 62.4')) return true;
    if (h.includes('#FFC800') && h.includes('#276304')) return true;

    const paths = s.querySelectorAll('path');
    for (const x of paths) {
      const d = x.getAttribute('d') || '';
      if (d.includes('27.8 62.4') || d.includes('53.36 62.4')) return true;
    }
    return false;
  }

  function replacePLNtext() {
    document.querySelectorAll('*:not(script):not(style)').forEach(el => {
      el.childNodes.forEach(n => {
        if (n.nodeType === 3 && n.nodeValue.includes('ARS')) {
          n.nodeValue = n.nodeValue.replace(/ARS/g, 'PLN');
        }
      });
    });
  }

  function replacePLNimages() {
    document.querySelectorAll('img').forEach(i => {
      if (!i.dataset.larped && /ARS/i.test(i.alt + i.title + i.src)) {
        i.dataset.larped = '1';
        const w = document.createElement('div');
        w.innerHTML = fakePLNsvg;
        i.replaceWith(w.firstChild);
      }
    });
  }

  function replacePLNsvgs() {
    document.querySelectorAll('svg').forEach(s => {
      if (!s.dataset.larped && isPLNsvg(s)) {
        s.dataset.larped = '1';
        const w = document.createElement('div');
        w.innerHTML = fakePLNsvg;
        const ns = w.firstChild;
        ns.dataset.larped = '1';
        try {
          if (s.getAttribute('class')) ns.setAttribute('class', s.getAttribute('class'));
          if (s.style.cssText) ns.style.cssText = s.style.cssText;
        } catch (e) {}
        s.replaceWith(ns);
      }
    });
  }

  function detectCurrency() {
    const possibleTexts = [];
    document.querySelectorAll('button, span, div').forEach(el => {
      const txt = el.textContent.trim();
      if (/^\d+(\.\d+)?\s+(LTC|USDT)$/i.test(txt)) {
        possibleTexts.push(txt);
      }
    });

    for (const t of possibleTexts) {
      if (t.includes('USDT')) return 'USDT';
      if (t.includes('LTC')) return 'LTC';
    }
    return 'LTC';
  }

  function modifyCurrencyDisplay() {
    detectedCurrency = detectCurrency();

    const currencyRegex = detectedCurrency === 'LTC'
      ? /\b(\d*\.?\d+)\s*LTC\b/i
      : /\b(\d*\.?\d+)\s*USDT\b/i;

    document.querySelectorAll('*:not(script):not(style)').forEach(el => {
      if (el.dataset.currencyModified === detectedCurrency) return;

      let modified = false;

      el.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          const match = currencyRegex.exec(n.nodeValue);
          if (match) {
            const oldVal = parseFloat(match[1]);
            if (!isNaN(oldVal)) {
              let newText;
              if (detectedCurrency === 'LTC') {
                const newVal = (oldVal * plnToArs).toFixed(6);
                newText = `${newVal} LTC`;
                } else {
                newText = `${oldVal.toFixed(2)} USDT`;
              }
              n.nodeValue = n.nodeValue.replace(currencyRegex, newText);
              modified = true;
            }
                        }
                    }
                });

      if (modified) {
        el.dataset.currencyModified = detectedCurrency;
            }
        });
    }

    function overrideUSDTPreview() {
        if (detectedCurrency !== 'USDT') return;

        const betInput = document.querySelector('input[type="number"]');
        const previewSpan = document.querySelector('div[data-testid="conversion-amount"]');

        if (betInput && previewSpan) {
            const val = parseFloat(betInput.value);
            if (!isNaN(val)) {
                previewSpan.textContent = `${val.toFixed(2)} USDT`;
            }
        }
    }


  function mainLoop() {
    try {
      replacePLNtext();
      replacePLNimages();
      replacePLNsvgs();
      modifyCurrencyDisplay();
      overrideUSDTPreview();
    } catch (e) {
      console.error('[LARP] error:', e);
    }
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
})();