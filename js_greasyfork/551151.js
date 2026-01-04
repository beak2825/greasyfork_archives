// ==UserScript==
// @name         death.fun ETH → USD overlay
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Show USD price next to ETH amounts on death.fun
// @author       Koi
// @match        https://death.fun/
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551151/deathfun%20ETH%20%E2%86%92%20USD%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/551151/deathfun%20ETH%20%E2%86%92%20USD%20overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ETH_REGEX = /([-+]?[\d.,]+)\s*ETH\b/i;
    const NUMERIC_REGEX = /^[-+]?[\d.,]+$/;
    const MAX_TEXT_LENGTH = 90;
    const conversions = new WeakMap();
    const inputDisplays = new WeakMap();
    const trackedInputs = new Set();

    const usdFormatterLarge = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const usdFormatterSmall = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

    let ethPriceUsd = null;

    function formatUsd(value, forcePlus) {
      const abs = Math.abs(value);
      const formatter = abs < 1 ? usdFormatterSmall : usdFormatterLarge;
      let formatted = formatter.format(abs);
      if (value < 0) {
        formatted = '-' + formatted;
      } else if (forcePlus) {
        formatted = '+' + formatted;
      }
      return formatted;
    }

    function updateSpan(span) {
      const ethAmount = parseFloat(span.dataset.ethAmount);
      if (!Number.isFinite(ethAmount)) {
        return;
      }
      const sign = span.dataset.ethSign || '';
      if (ethPriceUsd == null) {
        span.textContent = ' (USD …)';
        span.title = 'USD conversion in progress…';
        return;
      }
      const usdValue = ethAmount * ethPriceUsd;
      const formatted = formatUsd(usdValue, sign === '+' && usdValue >= 0);
      span.textContent = ' (' + formatted + ' USD)';
      span.title = 'Based on 1 ETH = ' + formatUsd(ethPriceUsd, false) + ' USD';
    }

    function deriveSign(matchText, parent, node) {
      const trimmed = matchText.trim();
      if (trimmed.startsWith('+')) {
        return '+';
      }
      if (trimmed.startsWith('-')) {
        return '-';
      }

      const parentText = (parent?.textContent || '').trim();
      const parentMatch = parentText.match(ETH_REGEX);
      if (parentMatch) {
        const parentTrimmed = parentMatch[1].trim();
        if (parentTrimmed.startsWith('+')) {
          return '+';
        }
        if (parentTrimmed.startsWith('-')) {
          return '-';
        }
      }

      const prev = node.previousSibling;
      if (prev && prev.nodeType === Node.TEXT_NODE) {
        const prevTrim = prev.textContent?.trim();
        if (prevTrim === '+') {
          return '+';
        }
        if (prevTrim === '-') {
          return '-';
        }
      }

      return '';
    }

    function elementHasEthIcon(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return false;
      }
      return element.querySelector?.('svg[viewBox="0 0 9 15"]') != null;
    }

    function processTextNode(node) {
      if (node.nodeType !== Node.TEXT_NODE) {
        return;
      }
      const parent = node.parentNode;
      if (!parent) {
        return;
      }
      if (parent instanceof HTMLElement && parent.classList.contains('deathusd-conversion')) {
        return;
      }
      const parentTag = parent.nodeName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'NOSCRIPT') {
        return;
      }

      const text = node.textContent || '';
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) {
        return;
      }

      function isLikelyEthContext() {
        const elementParent = node.parentElement;
        if (elementHasEthIcon(elementParent)) {
          return true;
        }
        const grandParent = elementParent?.parentElement;
        if (elementHasEthIcon(grandParent)) {
          return true;
        }
        const labels = [elementParent, grandParent]
          .map(el => (el?.getAttribute?.('aria-label') || el?.getAttribute?.('title') || '')?.toLowerCase?.())
          .filter(Boolean);
        if (labels.some(label => label.includes('eth'))) {
          return true;
        }
        return false;
      }

      let match = text.match(ETH_REGEX);
      let numberPart;
      let sign;
      let ethAmount;

      if (match) {
        numberPart = match[1].replace(/,/g, '');
        ethAmount = parseFloat(numberPart);
        if (!Number.isFinite(ethAmount)) {
          return;
        }
        sign = deriveSign(match[1], parent, node);
      } else if (NUMERIC_REGEX.test(trimmed) && isLikelyEthContext()) {
        numberPart = trimmed.replace(/,/g, '');
        ethAmount = parseFloat(numberPart);
        if (!Number.isFinite(ethAmount)) {
          return;
        }
        sign = deriveSign(trimmed, parent, node);
      } else {
        return;
      }

      if (sign === '-' && ethAmount > 0) {
        ethAmount = -ethAmount;
      }
      let span = conversions.get(node);
      if (!span || !span.isConnected || span.parentNode !== parent) {
        span = document.createElement('span');
        span.className = 'deathusd-conversion';
        span.style.marginLeft = '0.35em';
        span.style.fontSize = '0.85em';
        span.style.opacity = '0.75';
        parent.insertBefore(span, node.nextSibling);
        conversions.set(node, span);
      }
      span.dataset.ethAmount = String(ethAmount);
      span.dataset.ethSign = sign;
      updateSpan(span);
    }

    function isLikelyEthInput(input) {
      if (!(input instanceof HTMLInputElement)) {
        return false;
      }
      const type = (input.getAttribute('type') || 'text').toLowerCase();
      if (!['', 'text', 'number'].includes(type)) {
        return false;
      }
      const numericMode = input.getAttribute('inputmode');
      if (numericMode && !['decimal', 'numeric'].includes(numericMode)) {
        return false;
      }
      if (input.dataset.deathusdInput === 'yes') {
        return true;
      }
      const attrHints = [input.getAttribute('aria-label'), input.getAttribute('placeholder'), input.name]
        .filter(Boolean)
        .map(value => value.toLowerCase());
      if (attrHints.some(value => value.includes('usd'))) {
        return false;
      }
      if (attrHints.some(value => value.includes('eth'))) {
        input.dataset.deathusdInput = 'yes';
        return true;
      }
      const containers = [input.parentElement, input.parentElement?.parentElement, input.parentElement?.parentElement?.parentElement, input.closest('[role="group"]')];
      for (const container of containers) {
        if (!container) {
          continue;
        }
        if (elementHasEthIcon(container)) {
          input.dataset.deathusdInput = 'yes';
          return true;
        }
        const text = container.textContent || '';
        if (/\b(eth|bet)\b/i.test(text)) {
          input.dataset.deathusdInput = 'yes';
          return true;
        }
      }

      let ancestor = input.parentElement;
      for (let depth = 0; ancestor && depth < 5; depth += 1) {
        if (elementHasEthIcon(ancestor)) {
          input.dataset.deathusdInput = 'yes';
          return true;
        }
        const text = ancestor.textContent || '';
        if (/\beth\b/i.test(text)) {
          input.dataset.deathusdInput = 'yes';
          return true;
        }
        ancestor = ancestor.parentElement;
      }
      return false;
    }

    function updateInputDisplay(input) {
      const span = inputDisplays.get(input);
      if (!span) {
        return;
      }
      const rawValue = (input.value || '').trim();
      if (!rawValue) {
        span.textContent = '';
        span.style.display = 'none';
        return;
      }
      const normalized = rawValue.replace(/\s+/g, '').replace(/,/g, '');
      const amount = parseFloat(normalized);
      if (!Number.isFinite(amount)) {
        span.textContent = '';
        span.style.display = 'none';
        return;
      }
      span.style.display = 'block';
      if (ethPriceUsd == null) {
        span.textContent = '≈ USD …';
        span.title = 'USD conversion in progress…';
        return;
      }
      const usdValue = amount * ethPriceUsd;
      span.textContent = '≈ ' + formatUsd(usdValue, false) + ' USD';
      span.title = 'Based on 1 ETH = ' + formatUsd(ethPriceUsd, false) + ' USD';
    }

    function ensureInputAugmented(input) {
      if (!isLikelyEthInput(input)) {
        return;
      }
      let span = inputDisplays.get(input);
      if (!span || !span.isConnected) {
        span = document.createElement('div');
        span.className = 'deathusd-input';
        span.style.marginTop = '0.35em';
        span.style.fontSize = '0.85em';
        span.style.opacity = '0.75';
        span.style.textAlign = 'right';
        span.style.fontFamily = 'inherit';
        span.style.display = 'none';
        input.insertAdjacentElement('afterend', span);
        inputDisplays.set(input, span);
        trackedInputs.add(input);
        const handler = () => updateInputDisplay(input);
        input.addEventListener('input', handler);
        input.addEventListener('change', handler);
      }
      updateInputDisplay(input);
    }

    function processElement(element) {
      if (element instanceof HTMLInputElement) {
        ensureInputAugmented(element);
      }
    }

    function scanNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        processElement(node);
        node.childNodes.forEach(scanNode);
      }
    }

    function refreshAllSpans() {
      document.querySelectorAll('.deathusd-conversion').forEach(updateSpan);
    }

    function refreshAllInputs() {
      for (const input of trackedInputs) {
        if (!document.contains(input)) {
          trackedInputs.delete(input);
          continue;
        }
        ensureInputAugmented(input);
      }
    }

    async function fetchPrice() {
      try {
        const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', {
          cache: 'no-cache',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        const data = await response.json();
        const price = Number(data?.USD);
        if (Number.isFinite(price) && price > 0) {
          ethPriceUsd = price;
          refreshAllSpans();
          refreshAllInputs();
        }
      } catch (error) {
        console.warn('[deathusd] Unable to fetch ETH price', error);
      }
    }

    function init() {
      if (!document.body) {
        return;
      }

      scanNode(document.body);

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(scanNode);
          } else if (mutation.type === 'characterData') {
            scanNode(mutation.target);
          } else if (mutation.type === 'attributes' && mutation.target instanceof HTMLInputElement) {
            ensureInputAugmented(mutation.target);
            updateInputDisplay(mutation.target);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['value'],
      });

      fetchPrice();
      setInterval(fetchPrice, 60000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  })();
