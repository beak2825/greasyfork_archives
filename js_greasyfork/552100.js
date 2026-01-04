// ==UserScript==
// @name         Amazon Currency Converter Disabler
// @namespace    https://github.com/yourname
// @version      1.0.0
// @description  Always select "Pay in marketplace currency" on Amazon checkout, almost always saving 1-3%.
// @author       NewsGuyTor
// @license MIT
// @match        https://*.amazon.*/*checkout*
// @match        https://*.amazon.*/gp/buy/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552100/Amazon%20Currency%20Converter%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/552100/Amazon%20Currency%20Converter%20Disabler.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG = '[ACC Auto-Disable]';

  // Click the "MARKETPLACE" option inside a given container
  function clickMarketplace(container) {
    try {
      const radios = container.querySelectorAll('input[name="currencyOptions"][value="MARKETPLACE"]');
      let changed = false;

      radios.forEach((radio) => {
        if (!radio.disabled && !radio.checked) {
          // Some Amazon handlers bind late; click + change improves reliability
          radio.click();
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          changed = true;
        }
      });

      // If a T&C checkbox exists that effectively *enables* ACC when checked, keep it unchecked.
      const accTCAgree = container.querySelector('input[name="currencyConverterTCAgreement"]');
      if (accTCAgree && accTCAgree.checked) {
        accTCAgree.click();
        accTCAgree.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (changed) {
        console.log(LOG, 'Selected MARKETPLACE (disabled ACC).');
      }
      return changed;
    } catch (err) {
      console.debug(LOG, 'Error while clicking MARKETPLACE:', err);
      return false;
    }
  }

  // Scan the page (or a subtree) for any ACC blocks and force-disable them
  function scan(root = document) {
    const blocks = root.querySelectorAll(
      [
        '#currencyConverterFooter',
        '.checkout-experience-currency-converter-footer-block',
        '[data-cel-widget="currency-converter-footer-block"]',
        '[id^="checkout-currency-converter-footer"]',
      ].join(', ')
    );

    let found = false;
    blocks.forEach((block) => {
      found = true;
      clickMarketplace(block);
    });
    return found;
  }

  // Observe DOM changes to catch Amazon’s dynamic re-renders
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (
          node.id === 'currencyConverterFooter' ||
          node.matches?.(
            '.checkout-experience-currency-converter-footer-block, ' +
            '[data-cel-widget="currency-converter-footer-block"], ' +
            '[id^="checkout-currency-converter-footer"]'
          ) ||
          node.querySelector?.(
            '#currencyConverterFooter, ' +
            '.checkout-experience-currency-converter-footer-block, ' +
            '[data-cel-widget="currency-converter-footer-block"], ' +
            '[id^="checkout-currency-converter-footer"]'
          )
        ) {
          scan(node);
        }
      }
    }
  });

  function start() {
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Initial pass when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => scan());
    } else {
      scan();
    }

    // Fallback: periodic rescans in case Amazon silently swaps fragments
    let attempts = 0;
    const maxAttempts = 60; // ~3 minutes
    const interval = setInterval(() => {
      attempts++;
      scan();
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 3000);
  }

  start();
})();
