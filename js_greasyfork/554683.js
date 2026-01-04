// ==UserScript==
// @name         WhiskZey mug + UI Controls test
// @namespace    zero.whiskzey.torn
// @version      0.9
// @description  Reposition attack buttons + inline UI for weapon/outcome/temp toggle (next to Attacking) 🛡️ whiskey_jack edition + single-click lock + centered overlay (debounced/optimized)
// @author       -zero, seintz, whiskey_jack (+ perf tune)
// @license      GNU GPLv3
// @run-at       document-start
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554683/WhiskZey%20mug%20%2B%20UI%20Controls%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/554683/WhiskZey%20mug%20%2B%20UI%20Controls%20test.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const buttonSelector = 'div[class^="dialogButtons"]';
  const playerArea = 'div[class^="playerArea"]';
  const titleContainerSelector = '.titleContainer___QrlWP';

  const slotKey = 'torn-attack-slot';
  const typeKey = 'torn-attack-type';
  const tempKey = 'torn-attack-useTemp';

  let slot = Number(localStorage.getItem(slotKey) || 3);        // 1=primary, 2=secondary, 3=melee
  let attackType = Number(localStorage.getItem(typeKey) || 2);  // 1=leave, 2=mug, 3=hosp
  let useTemp = localStorage.getItem(tempKey) === 'true';

  const storage = {
    selectedOutcome: ['leave', 'mug', 'hosp'][attackType - 1],
    selectedIndex: attackType - 1
  };

  // --- rAF debouncers --------------------------------------------------------
  let rafPending = false;
  function rafBatch(fn) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      try { fn(); } catch (e) { /* no-op */ }
    });
  }

  let rafScrollPending = false;
  function rafOnScroll(fn) {
    if (rafScrollPending) return;
    rafScrollPending = true;
    requestAnimationFrame(() => {
      rafScrollPending = false;
      try { fn(); } catch (e) { /* no-op */ }
    });
  }
  // --------------------------------------------------------------------------

  // Waiters (light polling only until first sighting)
  const waiters = Object.create(null);
  function waitForKeyElement(selector, cb, pollMs = 300) {
    if (waiters[selector]) return;
    waiters[selector] = setInterval(() => {
      const node = document.querySelector(selector);
      if (node) {
        clearInterval(waiters[selector]);
        delete waiters[selector];
        cb(node);
      }
    }, pollMs);
  }

  // Guard single GM_addStyle
  let cssApplied = false;
  function applyCSSOnce() {
    if (cssApplied) return;
    cssApplied = true;
    GM_addStyle(`
      div[class^="dialogButtons"] > button[class$="btn-move"] {
        position: fixed; /* we'll place with inline left/top */
        height: 60px;
        width: 120px;
        z-index: 9999;
      }
      .playerWindow___aDeDI { overflow: visible !important; }
      .modelWrap___j3kfA { visibility: hidden; }

      /* Single-click lock visuals */
      .wj-click-locked {
        pointer-events: none !important;
        opacity: 0.6 !important;
        filter: grayscale(0.4);
      }
      /* Marker for centered state (debug) */
      .wj-centered { outline-offset: -2px; }
    `);
  }

  function slotName() {
    return ['primary', 'secondary', 'melee'][slot - 1];
  }

  function getTargetWeaponEl() {
    if (useTemp) return document.querySelector('#weapon_temp');
    const idMap = { primary: '#weapon_main', secondary: '#weapon_second', melee: '#weapon_melee' };
    return document.querySelector(idMap[slotName()]);
  }

  // Center one moved button
  function repositionButtonOverWeapon(btn) {
    if (!btn) return;
    const weaponEl = getTargetWeaponEl();
    if (!weaponEl) return;

    const rect = weaponEl.getBoundingClientRect();
    const BTN_W = 120;
    const BTN_H = 60;

    const left = Math.round(rect.left + (rect.width / 2) - (BTN_W / 2));
    const top  = Math.round(rect.top + (rect.height / 2) - (BTN_H / 2));

    const locked = btn.classList.contains('wj-click-locked');
    btn.style.position = 'fixed';
    btn.style.left = left + 'px';
    btn.style.top = top + 'px';
    btn.style.width = BTN_W + 'px';
    btn.style.height = BTN_H + 'px';
    btn.style.zIndex = '9999';
    btn.style.pointerEvents = locked ? 'none' : 'auto';
    btn.classList.add('wj-centered');
  }

  function repositionAllMovedButtons() {
    const root = document.querySelector(buttonSelector);
    if (!root) return;
    root.querySelectorAll('button.btn-move').forEach(repositionButtonOverWeapon);
  }

  function markAndSizeButton(btn) {
    // Add class once; styles come from GM_addStyle (once) + inline placement
    if (!btn.classList.contains('btn-move')) {
      btn.classList.add('btn-move');
    }
  }

  function moveButton() {
    const optionsDialogBox = document.querySelector(buttonSelector);
    if (!optionsDialogBox) return;
    const options = Array.from(optionsDialogBox.children);

    for (const option of options) {
      const text = (option.innerText || '').toLowerCase();
      const index = options.indexOf(option);

      // Move "Fight" if present; otherwise move the selected outcome index
      if (text.includes('fight') || storage.selectedIndex === index) {
        markAndSizeButton(option);
      }
    }
  }

  // --- Single-click lock (prevents repeat mashing) ---------------------------
  const CLICK_LOCK_MS = 4000;
  function guardButton(btn) {
    if (!btn || btn.dataset.wjGuard === '1') return;
    btn.dataset.wjGuard = '1';

    btn.addEventListener('click', (ev) => {
      if (btn.dataset.wjClicked === '1') {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        return false;
      }
      btn.dataset.wjClicked = '1';

      queueMicrotask(() => {
        try {
          btn.classList.add('wj-click-locked');
          btn.setAttribute('aria-disabled', 'true');
          btn.setAttribute('disabled', 'disabled');
          repositionButtonOverWeapon(btn);
        } catch (_) {}
      });

      setTimeout(() => {
        if (!document.contains(btn)) return;
        btn.classList.remove('wj-click-locked');
        btn.removeAttribute('aria-disabled');
        btn.removeAttribute('disabled');
        btn.dataset.wjClicked = '0';
        repositionButtonOverWeapon(btn);
      }, CLICK_LOCK_MS);
    }, true);

    btn.addEventListener('keydown', (ev) => {
      if ((ev.key === 'Enter' || ev.key === ' ') && btn.dataset.wjClicked === '1') {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    }, true);
  }

  function armSingleClickGuards() {
    const root = document.querySelector(buttonSelector);
    if (!root) return;
    root.querySelectorAll('button').forEach(guardButton);
  }
  // --------------------------------------------------------------------------

  function injectControlPanel() {
    const title = document.querySelector('h4.title___rhtB4');
    if (!title) return;
    const style = `
      font-size: 12px; padding: 3px 6px; border: 1px solid #444; border-radius: 6px;
      background: #222; color: #ccc; white-space: nowrap; display: inline-block;
      box-shadow: 0 0 6px rgba(0,0,0,0.6);
    `;
    title.innerHTML = `
      <span style="${style}">
        <span style="color:#bbb;font-weight:bold;">Attacking:</span>
        <span style="margin-left: 6px; color:#bbb;">Slot:</span>
        <label style="margin:0 6px;"><input type="radio" name="slot" value="1" ${slot === 1 ? 'checked' : ''} title="Primary"> P</label>
        <label style="margin-right:6px;"><input type="radio" name="slot" value="2" ${slot === 2 ? 'checked' : ''} title="Secondary"> S</label>
        <label style="margin-right:12px;"><input type="radio" name="slot" value="3" ${slot === 3 ? 'checked' : ''} title="Melee"> M</label>

        <span style="color:#bbb;">Outcome:</span>
        <label style="margin:0 6px;"><input type="radio" name="type" value="1" ${attackType === 1 ? 'checked' : ''} title="Leave"> L</label>
        <label style="margin-right:6px;"><input type="radio" name="type" value="2" ${attackType === 2 ? 'checked' : ''} title="Mug"> M</label>
        <label style="margin-right:12px;"><input type="radio" name="type" value="3" ${attackType === 3 ? 'checked' : ''} title="Hospitalize"> H</label>

        <label><input type="checkbox" id="usetemp" ${useTemp ? 'checked' : ''} title="Use Temporary Weapon"> Temp</label>
      </span>
    `;

    title.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'slot') {
        slot = Number(t.value);
        localStorage.setItem(slotKey, String(slot));
        // re-center immediately (no reload)
        rafBatch(() => { moveButton(); armSingleClickGuards(); repositionAllMovedButtons(); });
      }
      if (t.name === 'type') {
        attackType = Number(t.value);
        storage.selectedIndex = attackType - 1;
        localStorage.setItem(typeKey, String(attackType));
        rafBatch(() => { moveButton(); armSingleClickGuards(); repositionAllMovedButtons(); });
      }
      if (t.id === 'usetemp') {
        useTemp = !!t.checked;
        localStorage.setItem(tempKey, useTemp ? 'true' : 'false');
        rafBatch(() => { moveButton(); armSingleClickGuards(); repositionAllMovedButtons(); });
      }
    }, { passive: true });
  }

  // Observe only the playerArea wrapper to reduce noise
  const config = { childList: true, subtree: true };
  let areaObserver = null;

  function attachObserverOnArea(wrapper) {
    if (areaObserver) return;
    areaObserver = new MutationObserver(() => {
      // Coalesce bursts into one rAF tick
      rafBatch(() => {
        moveButton();
        armSingleClickGuards();
        repositionAllMovedButtons();
      });
    });
    areaObserver.observe(wrapper, config);
  }

  // Initial hooks (light polling to find first nodes, then observers take over)
  waitForKeyElement(playerArea, (wrapper) => {
    applyCSSOnce();
    attachObserverOnArea(wrapper);
    // First paint
    rafBatch(() => {
      moveButton();
      armSingleClickGuards();
      repositionAllMovedButtons();
    });
  }, 250);

  waitForKeyElement(titleContainerSelector, () => {
    rafBatch(injectControlPanel);
  }, 350);

  // Keep centered on resize/scroll (debounced)
  window.addEventListener('resize', () => rafOnScroll(repositionAllMovedButtons), { passive: true });
  window.addEventListener('scroll', () => rafOnScroll(repositionAllMovedButtons), { passive: true });

})();
