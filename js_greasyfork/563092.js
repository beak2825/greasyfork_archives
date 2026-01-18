// ==UserScript==
// @name         ChatGPT Hide Highlight "Ask ChatGPT" Button (RU/EN)
// @namespace    local.chatgpt.hide.highlight
// @version      1.0
// @description  Hides the floating highlight action button ("Ask ChatGPT" / "Спросить ChatGPT") on chatgpt.com when selecting text.
// @author       barracuda.elzar
// @match        https://chatgpt.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563092/ChatGPT%20Hide%20Highlight%20%22Ask%20ChatGPT%22%20Button%20%28RUEN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563092/ChatGPT%20Hide%20Highlight%20%22Ask%20ChatGPT%22%20Button%20%28RUEN%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const PHRASES = [
    'Ask ChatGPT',
    'Спросить ChatGPT',
  ];

  // Debounce so MutationObserver doesn't spam heavy work.
  let scheduled = false;

  function includesAny(text) {
    if (!text) return false;
    for (const p of PHRASES) {
      if (text.includes(p)) return true;
    }
    return false;
  }

  function findFixedAncestor(node, maxDepth = 12) {
    let cur = node;
    for (let i = 0; i < maxDepth && cur && cur.nodeType === 1; i++) {
      const cs = window.getComputedStyle(cur);
      if (cs && cs.position === 'fixed') return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  function hideNode(node) {
    if (!node || node.nodeType !== 1) return;

    // Prefer removing the whole floating fixed container (tooltip host).
    const fixed = findFixedAncestor(node) || node;

    // Remove title tooltips if any exist.
    if (fixed.hasAttribute && fixed.hasAttribute('title')) fixed.removeAttribute('title');

    // Hard-hide
    fixed.style.setProperty('display', 'none', 'important');
    fixed.style.setProperty('visibility', 'hidden', 'important');
    fixed.style.setProperty('pointer-events', 'none', 'important');
    fixed.setAttribute('data-tm-hide-ask-chatgpt', '1');
  }

  function sweep() {
    scheduled = false;

    // 1) Buttons / role=button
    const candidates = document.querySelectorAll('button, [role="button"]');
    for (const el of candidates) {
      const text = (el.textContent || '').trim();
      if (includesAny(text)) {
        hideNode(el);
      } else {
        // Some UIs may store tooltip text in attributes.
        const t = (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('title'))) || '';
        if (includesAny(t)) hideNode(el);
      }
    }

    // 2) Any element that literally contains the label (like your inner <span>).
    //    Hide its nearest fixed container.
    for (const phrase of PHRASES) {
      const xpath = `//*[contains(normalize-space(.), "${phrase}")]`;
      const snap = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < snap.snapshotLength; i++) {
        const node = snap.snapshotItem(i);
        if (!node || node.nodeType !== 1) continue;

        // Only act on the small floating widget, not the entire page.
        // Your widget is fixed-positioned.
        const fixed = findFixedAncestor(node);
        if (fixed && fixed.getAttribute('data-tm-hide-ask-chatgpt') !== '1') {
          hideNode(fixed);
        }
      }
    }
  }

  function scheduleSweep() {
    if (scheduled) return;
    scheduled = true;
    // Using rAF keeps it responsive while selecting text.
    requestAnimationFrame(sweep);
  }

  // Observe DOM changes (SPA + dynamic tooltip insertion)
  const startObserver = () => {
    const observer = new MutationObserver(scheduleSweep);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  // Also react to selection-related events so it gets removed ASAP.
  const hookSelectionEvents = () => {
    document.addEventListener('selectionchange', scheduleSweep, true);
    document.addEventListener('mouseup', scheduleSweep, true);
    document.addEventListener('keyup', scheduleSweep, true);
    document.addEventListener('pointerup', scheduleSweep, true);
  };

  // document-start safe init
  startObserver();
  hookSelectionEvents();

  // Initial sweep after DOM becomes available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSweep, { once: true });
  } else {
    scheduleSweep();
  }
})();
