// ==UserScript==
// @name         Torn Bazaar Auto Add: Space Start/Stop Expand & $1
// @namespace    https://torn.com/
// @version      0.3.2
// @description  Press Space once to start auto-expanding groups (below threshold) and listing cheap items (<$1000) at $1. Press again to stop.
// @match        https://www.torn.com/bazaar.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555767/Torn%20Bazaar%20Auto%20Add%3A%20Space%20StartStop%20Expand%20%20%241.user.js
// @updateURL https://update.greasyfork.org/scripts/555767/Torn%20Bazaar%20Auto%20Add%3A%20Space%20StartStop%20Expand%20%20%241.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Config ===
  const VALUE_THRESHOLD = 1000;
  const PRICE_TO_SET = 1;
  const LOOP_DELAY_MS = 1; // delay between steps
  const EXPAND_GROUPS_BELOW_THRESHOLD_ONLY = true;

  let enabled = false;
  let running = false;
  let loopTimer = null;

  // --- UI Indicator ---
  const indicator = document.createElement('div');
  Object.assign(indicator.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 999999,
  });
  indicator.textContent = '⏹️ Idle';
  document.body.appendChild(indicator);

  function setIndicator(state) {
    indicator.textContent = state ? '▶️ Running' : '⏹️ Idle';
    indicator.style.background = state ? 'rgba(0,128,0,0.6)' : 'rgba(0,0,0,0.6)';
  }

  // --- Detect Add Page ---
  function onRouteChange() {
    const onAddPage = location.pathname === '/bazaar.php' && location.hash.startsWith('#/add');
    if (onAddPage && !enabled) {
      enabled = true;
      window.addEventListener('keydown', keyHandler, true);
    } else if (!onAddPage && enabled) {
      enabled = false;
      stopLoop();
      window.removeEventListener('keydown', keyHandler, true);
    }
  }

  // --- Toggle Start/Stop ---
  function keyHandler(e) {
    if (e.code !== 'Space' || e.repeat) return;

    const t = e.target;
    const tag = (t && t.tagName) ? t.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;

    e.preventDefault();
    e.stopPropagation();

    if (running) {
      stopLoop();
      console.log('[Bazaar Auto] ⏹️ Stopped');
    } else {
      startLoop();
      console.log('[Bazaar Auto] ▶️ Started');
    }
  }

  // --- Continuous Loop ---
  function startLoop() {
    running = true;
    setIndicator(true);
    if (loopTimer) clearTimeout(loopTimer);

    const tick = () => {
      if (!running) return;

      // Try to expand collapsed group
      if (expandFirstVisibleCollapsedGroup()) {
        scheduleNext();
        return;
      }

      // Try to price cheap visible item
      if (processNextVisibleUnderThreshold()) {
        scheduleNext();
        return;
      }

      // Otherwise scroll down
      scrollDown();
      scheduleNext();
    };

    const scheduleNext = () => {
      if (running) loopTimer = setTimeout(tick, LOOP_DELAY_MS);
    };

    tick(); // start immediately
  }

  function stopLoop() {
    running = false;
    setIndicator(false);
    if (loopTimer) clearTimeout(loopTimer);
    loopTimer = null;
  }

  // --- Expand groups ---
  function expandFirstVisibleCollapsedGroup() {
    const groups = document.querySelectorAll('li.parent-group[data-group="parent"]');
    for (const li of groups) {
      if (!isDisplayed(li) || !isInViewport(li)) continue;

      if (EXPAND_GROUPS_BELOW_THRESHOLD_ONLY) {
        const mv = getMarketValue(li);
        if (!(Number.isFinite(mv) && mv < VALUE_THRESHOLD)) continue;
      }

      const clickable = li.querySelector('.title-wrap, .group-arrow') || li;
      clickElement(clickable);
      console.log('[Bazaar Auto] Expanded group');
      return true;
    }
    return false;
  }

  // --- Process cheap items ---
  function processNextVisibleUnderThreshold() {
  const items = document.querySelectorAll('li[data-group="child"]');
  for (const li of items) {
    if (!isDisplayed(li) || !isInViewport(li)) continue;

    // ❌ Skip glowing items
    if (li.querySelector('.glow-yellow, .glow-red')) {
      continue;
    }

    const mv = getMarketValue(li);
    if (!Number.isFinite(mv) || mv >= VALUE_THRESHOLD) continue;

    const checkbox = getAmountCheckbox(li);
    if (!checkbox || checkbox.disabled || checkbox.checked) continue;

    checkbox.click();
    const setIt = () => setPrice(li, PRICE_TO_SET);
    setIt();
    requestAnimationFrame(setIt);
    setTimeout(setIt, 100);

    console.log(`[Bazaar Auto] Set price $${PRICE_TO_SET} (MV $${mv})`);
    return true;
  }
  return false;
}


  // --- Helpers ---
  function getMarketValue(li) {
    let text = '';
    const mvNode = li.querySelector('[title="Market value"]');
    if (mvNode) text = mvNode.textContent || '';
    else {
      const priceNode = li.querySelector('.tt-item-price') || li;
      text = priceNode.textContent || '';
    }
    const m = text.match(/\$[\s]*([\d,]+)/);
    return m ? parseInt(m[1].replace(/,/g, ''), 10) : NaN;
  }

  function getAmountCheckbox(li) {
    return li.querySelector(
      '.actions-main-wrap input.checkbox-css[type="checkbox"][name="amount"], ' +
      '.amount.choice-container input[type="checkbox"][name="amount"]'
    );
  }

  function setPrice(li, price) {
    const txt = li.querySelector('.actions-main-wrap .price .input-money-group input.input-money[type="text"]');
    if (txt) {
      txt.value = String(price);
      txt.dispatchEvent(new Event('input', { bubbles: true }));
      txt.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const hidden = li.querySelector('.actions-main-wrap .price .input-money-group input.input-money[type="hidden"][name="price"]');
    if (hidden) {
      hidden.value = String(price);
      hidden.dispatchEvent(new Event('input', { bubbles: true }));
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function clickElement(el) {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  function isDisplayed(el) {
    if (!el || el.nodeType !== 1) return false;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) return false;
    let p = el.parentElement;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      p = p.parentElement;
    }
    return true;
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
  }

  function scrollDown() {
    const anyItem = document.querySelector('li[data-group]');
    const scroller = findScrollableParent(anyItem || document.body);
    const delta = Math.round(((scroller === window) ? window.innerHeight : scroller.clientHeight) * 0.9);
    if (scroller === window)
      window.scrollBy({ top: delta, left: 0, behavior: 'smooth' });
    else
      scroller.scrollBy({ top: delta, left: 0, behavior: 'smooth' });
    console.log('[Bazaar Auto] Scrolled down');
  }

  function findScrollableParent(el) {
    let p = el && el.parentElement;
    while (p) {
      const style = getComputedStyle(p);
      const oy = style.overflowY;
      if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
      p = p.parentElement;
    }
    return window;
  }

  // --- Init ---
  onRouteChange();
  window.addEventListener('hashchange', onRouteChange);
})();
