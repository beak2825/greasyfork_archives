// ==UserScript==
// @name         WaniKani: Auto Open Item Info
// @namespace    wkautoopeniteminfo
// @version      1.1
// @description  Open the item info panel after you submit an answer.
// @author       hejay
// @license      MIT; http://opensource.org/licenses/MIT
// @match        https://www.wanikani.com/review*
// @match        https://www.wanikani.com/subjects/review*
// @match        https://www.wanikani.com/extra_study*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550790/WaniKani%3A%20Auto%20Open%20Item%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/550790/WaniKani%3A%20Auto%20Open%20Item%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- tiny helpers ---------------------------------------------------------
  const DEBUG = false;
  const log = (...a) => { if (DEBUG) console.log('[WK F-Open]', ...a); };

  const BTN_SELECTORS = [
    '#option-item-info',
    '[data-quiz-action="item-info"]',
    '[data-action="toggle-item-info"]',
    'button[aria-controls="item-info"]',
    'button[aria-label*="Item Info" i]',
  ];

  function looksLikeItemInfo(el) {
    if (!el) return false;
    const s = ((el.textContent || '') + ' ' + (el.title || '') + ' ' + (el.getAttribute?.('aria-label') || '')).toLowerCase();
    return /item\s*info/.test(s);
  }

  function findItemInfoButton() {
    for (const sel of BTN_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    const fallback = Array.from(document.querySelectorAll('button, a')).find(looksLikeItemInfo);
    return fallback || null;
  }

  function getControlledPanel(btn) {
    const id = btn?.getAttribute?.('aria-controls');
    if (id) {
      const p = document.getElementById(id);
      if (p) return p;
    }
    return document.querySelector('#item-info, .item-info') || null;
  }

  function isVisible(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function isItemInfoOpen() {
    // details path
    const d = document.querySelector('details');
    if (d && d.open && looksLikeItemInfo(d.querySelector('summary'))) return true;
    // button/panel path
    const btn = findItemInfoButton();
    const expanded = btn?.getAttribute?.('aria-expanded');
    if (expanded === 'true') return true;
    const panel = getControlledPanel(btn);
    return isVisible(panel);
  }

  // --- synthesize "F" hotkey (keydown+keyup) --------------------------------
  function pressF() {
    const targets = [document.activeElement, document.body, document];
    for (const t of targets) {
      if (!t) continue;
      const kd = new KeyboardEvent('keydown', {
        key: 'f', code: 'KeyF', which: 70, keyCode: 70, bubbles: true, cancelable: true
      });
      const ku = new KeyboardEvent('keyup', {
        key: 'f', code: 'KeyF', which: 70, keyCode: 70, bubbles: true, cancelable: true
      });
      t.dispatchEvent(kd);
      t.dispatchEvent(ku);
    }
    log('pressed F (synthetic)');
  }

  // --- fallback: click the same control the hotkey toggles ------------------
  function clickFallback() {
    const btn = findItemInfoButton();
    if (btn) {
      // Only click if it looks closed
      const expanded = btn.getAttribute?.('aria-expanded');
      const panel = getControlledPanel(btn);
      if (expanded !== 'true' && !isVisible(panel)) {
        btn.click();
        log('fallback clicked item-info button');
      }
    } else {
      log('fallback: button not found');
    }
  }

  // --- main: on submit -> send F, then verify, then fallback if needed ------
  let guardTs = 0;
  const GUARD_MS = 450; // ignore repeated triggers within this window

  function triggerOpen(reason) {
    const now = Date.now();
    if (now - guardTs < GUARD_MS) {
      log('guard skip', reason);
      return;
    }
    guardTs = now;

    // Step 1: give WK a tick to judge the answer and render result state
    setTimeout(() => {
      pressF();

      // Step 2: check soon after; if still closed, try once more then fallback
      setTimeout(() => {
        if (!isItemInfoOpen()) {
          log('not open after first F -> second F');
          pressF();
          setTimeout(() => {
            if (!isItemInfoOpen()) {
              log('still not open -> click fallback');
              clickFallback();
            }
          }, 90);
        }
      }, 90);
    }, 60);
  }

  // --- wire it up -----------------------------------------------------------
  function isReviewInput(el) {
    return !!(el && el.tagName === 'INPUT' && el.type === 'text');
  }

  // 1) When user hits Enter in the answer input, trigger
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    // Prefer only when focus is in a text input (the answer box)
    if (isReviewInput(document.activeElement)) {
      triggerOpen('enter-in-input');
    }
  }, true); // capture so we catch it before WK stops propagation

  // 2) If user clicks a "submit"/"answer" button instead of Enter, try to detect it
  const possibleSubmitSelectors = [
    'button[type="submit"]',
    'button[data-quiz-action="submit"]',
    'button[aria-label*="Submit" i]',
    'button[aria-label*="Check" i]'
  ];
  document.addEventListener('click', (e) => {
    const el = e.target.closest?.(possibleSubmitSelectors.join(','));
    if (el) triggerOpen('click-submit');
  }, true);

  // 3) As a safety net, when the UI shows a correct/incorrect state, try once
  const observer = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'attributes' && (m.attributeName === 'class')) {
        const t = m.target;
        if (t && t.classList) {
          // Heuristic: many elements flip to classes containing 'correct' or 'incorrect'
          if (/\b(correct|incorrect)\b/.test(t.className)) {
            triggerOpen('state-change');
            break;
          }
        }
      }
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        // If a new "item info" control or panel appears, ensure it's opened
        if (document.querySelector('#item-info, .item-info, [aria-controls="item-info"]')) {
          triggerOpen('childlist');
          break;
        }
      }
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

  log('userscript ready');
})();
