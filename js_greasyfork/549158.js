// ==UserScript==
// @name         Torn.com Attack Numpad Helper
// @namespace    https://torn.com/
// @version      1.7.0
// @description  Numpad shortcuts for Torn attack page with configurable Continue behavior + hospital reload check
// @author       You
// @match        https://www.torn.com/loader.php*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/549158/Torncom%20Attack%20Numpad%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549158/Torncom%20Attack%20Numpad%20Helper.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Only run on the attack loader with a user2ID param
  const params = new URLSearchParams(location.search);
  if (!(params.get('sid') === 'attack' && params.has('user2ID'))) return;

  // GM compatibility
  const GMAPI = {
    getValue: async (k, d) => {
      try {
        if (typeof GM !== 'undefined' && GM.getValue) return await GM.getValue(k, d);
        if (typeof GM_getValue !== 'undefined') return GM_getValue(k, d);
      } catch {}
      const v = localStorage.getItem('tm_' + k);
      return v == null ? d : v;
    },
    setValue: async (k, v) => {
      try {
        if (typeof GM !== 'undefined' && GM.setValue) return await GM.setValue(k, v);
        if (typeof GM_setValue !== 'undefined') return GM_setValue(k, v);
      } catch {}
      localStorage.setItem('tm_' + k, v);
    },
  };

  // '.' target preference (Punch=5th, Kick=6th)
  let decimalTarget = await GMAPI.getValue('decimalTarget', 'punch'); // 'punch' | 'kick'
  function getDecimalIndex() {
    return decimalTarget === 'kick' ? 6 : 5;
  }

  // Continue action preference (default "default")
  let continueAction = await GMAPI.getValue('continueAction', 'default'); // 'default' | 'close' | 'openFixed'

  function tryCloseTab() {
    try { window.close(); } catch {}
    try {
      const w = window.open('', '_self');
      w && w.close && w.close();
    } catch {}
  }

  function handleContinue() {
    if (continueAction === 'close') {
      tryCloseTab();
      return true;
    }
    if (continueAction === 'openFixed') {
      window.location.href = "https://www.torn.com/loader.php?sid=attack&user2ID=1598729";
      return true;
    }
    return false; // default
  }

  // Userscript menu toggles
  let menuIds = [];
  function registerMenu() {
    if (typeof GM_registerMenuCommand !== 'function') return;

    if (menuIds.length && typeof GM_unregisterMenuCommand === 'function') {
      try { menuIds.forEach((id) => GM_unregisterMenuCommand(id)); } catch {}
    }
    menuIds = [];

    // Decimal mapping toggle
    const labelDecimal = `Decimal key: ${decimalTarget === 'kick' ? 'Kick' : 'Punch'} (click to toggle)`;
    const id1 = GM_registerMenuCommand(labelDecimal, async () => {
      decimalTarget = decimalTarget === 'kick' ? 'punch' : 'kick';
      await GMAPI.setValue('decimalTarget', decimalTarget);
      scheduleUpdate();
      registerMenu();
      console.info('[Torn Numpad Helper] Decimal key set to:', decimalTarget);
    });
    menuIds.push(id1);

    // Continue action toggle
    const labelContinue = `Continue action: ${
      continueAction === 'close' ? 'Close tab' :
      continueAction === 'openFixed' ? 'attack bodybagger' :
      'Default click'
    } (click to cycle)`;
    const id2 = GM_registerMenuCommand(labelContinue, async () => {
      continueAction =
        continueAction === 'default' ? 'close' :
        continueAction === 'close' ? 'openFixed' :
        'default';
      await GMAPI.setValue('continueAction', continueAction);
      scheduleUpdate();
      registerMenu();
      console.info('[Torn Numpad Helper] Continue action set to:', continueAction);
    });
    menuIds.push(id2);
  }
  registerMenu();

  // Keys
  const overrideKeys = new Set(['Numpad4', 'Numpad5', 'Numpad6']);
  const defaultKeys = new Set(['Numpad1', 'Numpad2', 'Numpad3', 'Numpad0', 'NumpadDecimal', 'NumpadComma']);
  const isNumpadKey = (code) => typeof code === 'string' && code.startsWith('Numpad');

  // Default mapping (hoverEnabled)
  const baseDefaultMap = {
    Numpad1: 'div.hoverEnabled___skjqK:nth-child(1)',
    Numpad2: 'div.hoverEnabled___skjqK:nth-child(2)',
    Numpad3: 'div.hoverEnabled___skjqK:nth-child(3)',
    Numpad0: 'div.hoverEnabled___skjqK:nth-child(4)',
  };
  function selectorForKey(code) {
    if (code === 'NumpadDecimal' || code === 'NumpadComma') {
      return `div.hoverEnabled___skjqK:nth-child(${getDecimalIndex()})`;
    }
    return baseDefaultMap[code];
  }

  // Utilities
  function isTypingInField(target) {
    return !!(
      target &&
      (target.isContentEditable ||
        target.closest('input, textarea, [contenteditable=""], [contenteditable="true"]'))
    );
  }
  function clickEl(el) {
    if (el) {
      el.click();
      return true;
    }
    return false;
  }

  function hasContinueText(btn) {
    const txt = (btn?.textContent || '').toLowerCase();
    return txt.includes('continue');
  }

  function isHospitalBlocked() {
    return !!document.querySelector('.colored___sN72G.red___SANWO .title___fOh2J');
  }

  // Find the primary button in default mode
  function findPrimaryButton() {
    return (
      document.querySelector('button.torn-btn:nth-child(1)') ||
      document.querySelector('button[class^="btn___"]:nth-child(1)')
    );
  }

  // Override mode: find buttons by walking siblings of the 3rd button
  function getOverrideButtons() {
    const b3 =
      document.querySelector('button.torn-btn:nth-child(3)') ||
      document.querySelector('button[class^="btn___"]:nth-child(3)');
    if (!b3) return null;

    let b2 = b3.previousElementSibling;
    while (b2 && b2.tagName !== 'BUTTON') b2 = b2.previousElementSibling;

    let b1 = b2 ? b2.previousElementSibling : null;
    while (b1 && b1.tagName !== 'BUTTON') b1 = b1.previousElementSibling;

    return { b1, b2, b3 };
  }

  // Minimal key badges
  const style = document.createElement('style');
  style.textContent = `
    .torn-keyhint {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,.55);
      color: #fff;
      border-radius: 4px;
      padding: 1px 4px;
      font-size: 10px;
      line-height: 1.2;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      letter-spacing: .2px;
      pointer-events: none;
      z-index: 2147483647;
      opacity: .9;
    }
    .torn-keyhint--multi { opacity: .85; }
  `;
  document.head.appendChild(style);

  function clearAllHints() {
    document.querySelectorAll('.torn-keyhint').forEach((el) => el.remove());
  }

  function ensureHintOnElement(el, text, isMulti = false) {
    if (!el) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    let hint = el.querySelector(':scope > .torn-keyhint');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'torn-keyhint';
      el.appendChild(hint);
    }
    hint.classList.toggle('torn-keyhint--multi', !!isMulti);
    hint.textContent = text;
  }

  function ensureHintOnSelector(selector, text, isMulti = false) {
    const el = document.querySelector(selector);
    if (el) ensureHintOnElement(el, text, isMulti);
  }

  function updateHints() {
    clearAllHints();

    const ob = getOverrideButtons();
    if (ob && (ob.b1 || ob.b2 || ob.b3)) {
      if (ob.b1) ensureHintOnElement(ob.b1, '4');
      if (ob.b2) ensureHintOnElement(ob.b2, '5');
      if (ob.b3) ensureHintOnElement(ob.b3, '6');
      return;
    }

    const primary = findPrimaryButton();
    if (primary) {
      const label =
        hasContinueText(primary) ?
          (continueAction === 'close' ? 'any → close' :
           continueAction === 'openFixed' ? 'any → fixed' : 'any') :
          'any';
      ensureHintOnElement(primary, label);
    } else {
      ensureHintOnSelector('div.hoverEnabled___skjqK:nth-child(1)', '1');
      ensureHintOnSelector('div.hoverEnabled___skjqK:nth-child(2)', '2');
      ensureHintOnSelector('div.hoverEnabled___skjqK:nth-child(3)', '3');
      ensureHintOnSelector('div.hoverEnabled___skjqK:nth-child(4)', '0');
      ensureHintOnSelector(`div.hoverEnabled___skjqK:nth-child(${getDecimalIndex()})`, '.');
    }
  }

  // Key handling
  document.addEventListener(
    'keydown',
    (e) => {
      if (isTypingInField(e.target)) return;

      // Hospital check: any numpad key reloads
      if (isHospitalBlocked() && isNumpadKey(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        location.reload();
        return;
      }

      const ob = getOverrideButtons();
      if (ob && (ob.b1 || ob.b2 || ob.b3)) {
        if (!overrideKeys.has(e.code)) return;
        const target =
          e.code === 'Numpad4' ? ob.b1 :
          e.code === 'Numpad5' ? ob.b2 :
          e.code === 'Numpad6' ? ob.b3 : null;

        if (clickEl(target)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      const primary = findPrimaryButton();
      if (primary) {
        if (!isNumpadKey(e.code)) return;

        if (hasContinueText(primary) && continueAction !== 'default') {
          e.preventDefault();
          e.stopPropagation();
          if (handleContinue()) return;
        }

        if (clickEl(primary)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (!defaultKeys.has(e.code)) return;

      const selector = selectorForKey(e.code);
      const el = selector ? document.querySelector(selector) : null;
      if (clickEl(el)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  const scheduleUpdate = (() => {
    let t = null;
    return () => {
      if (t) return;
      t = setTimeout(() => {
        t = null;
        updateHints();
      }, 50);
    };
  })();

  updateHints();

  const observer = new MutationObserver(() => scheduleUpdate());
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style'],
  });

  window.addEventListener('focus', scheduleUpdate);
})();
