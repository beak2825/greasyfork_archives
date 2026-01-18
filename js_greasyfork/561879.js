// ==UserScript==
// @name         Kick.com - Force 1080p, No Throttle & Auto-Confirm Mature (self-healing)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Forces 1080p (IVS hook + hidden UI fallback), prevents background throttling, and auto-clicks the "I am 18+" warning.
// @author       Tuur (gemini) + tweaks
// @match        https://kick.com/*
// @match        https://player.kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561879/Kickcom%20-%20Force%201080p%2C%20No%20Throttle%20%20Auto-Confirm%20Mature%20%28self-healing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561879/Kickcom%20-%20Force%201080p%2C%20No%20Throttle%20%20Auto-Confirm%20Mature%20%28self-healing%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**********************************************************************
   * CONFIG
   **********************************************************************/
  const TARGET_LABEL = '1080p60'; // UI label in the cog menu: "1080p60", "720p60", "Auto", ...
  const TARGET_IVS_CONTAINS = '1080'; // match IVS quality name containing this
  const DEBUG = false;

  const log = (...a) => DEBUG && console.log('[Kick Script]', ...a);

  /**********************************************************************
   * 1) VISIBILITY SPOOFING (Prevents background drops)
   **********************************************************************/
  function applyVisibilitySpoof() {
    try {
      Object.defineProperty(document, 'hidden', { value: false, writable: false });
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
      Object.defineProperty(document, 'webkitVisibilityState', { value: 'visible', writable: false });
    } catch (e) {
      // Some browsers/extensions may block redefining after initial define.
    }
  }

  applyVisibilitySpoof();

  const blockEvent = (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
  };
  window.addEventListener('visibilitychange', blockEvent, true);
  window.addEventListener('webkitvisibilitychange', blockEvent, true);
  window.addEventListener('mozvisibilitychange', blockEvent, true);
  window.addEventListener('blur', blockEvent, true);

  /**********************************************************************
   * 2) SESSION STORAGE HACK
   **********************************************************************/
  try {
    window.sessionStorage.setItem('kick_quality', '1080');
    window.sessionStorage.setItem('stream_quality', '1080');
  } catch (e) {
    log('Session storage access failed', e);
  }

  /**********************************************************************
   * 3) IVS PLAYER HOOK (Quality Locking)
   **********************************************************************/
  function lockQuality(player) {
    if (!player) return;

    const enforceMax = () => {
      try {
        const qualities = player.getQualities?.();
        if (!qualities || qualities.length === 0) return;

        // Find 1080p, else highest available (some lists are already sorted best->worst)
        const maxQuality =
          qualities.find(q => (q?.name || '').includes(TARGET_IVS_CONTAINS)) ||
          qualities[0];

        const currentQ = player.getQuality?.();
        const isAuto = player.isAutoQualityMode?.();

        if (maxQuality && (isAuto || (currentQ && currentQ.name !== maxQuality.name))) {
          console.log(`Kick Quality (IVS): Locking to ${maxQuality.name}`);
          player.setAutoQualityMode?.(false);
          player.setQuality?.(maxQuality);
        }
      } catch (e) {
        log('IVS enforceMax error', e);
      }
    };

    enforceMax();
    setInterval(enforceMax, 5000);

    try {
      player.addEventListener?.('PlayerState.PLAYING', enforceMax);
      player.addEventListener?.('PlayerState.READY', enforceMax);
      player.addEventListener?.('QualityChanged', enforceMax);
    } catch (e) {
      // ignore
    }
  }

  let ivsHooked = false;
  const hookIVS = () => {
    if (window.IVSPlayer && !ivsHooked) {
      ivsHooked = true;
      const originalCreate = window.IVSPlayer.create;

      window.IVSPlayer.create = function() {
        console.log('Kick Quality: Intercepted IVS Player creation');
        const player = originalCreate.apply(this, arguments);

        try {
          player.addEventListener?.('PlayerState.READY', () => lockQuality(player));
        } catch (e) {}
        setTimeout(() => lockQuality(player), 2000);

        return player;
      };
    }
  };

  if (window.IVSPlayer) {
    hookIVS();
  } else {
    Object.defineProperty(window, 'IVSPlayer', {
      configurable: true,
      enumerable: true,
      get: function() { return this._IVSPlayer; },
      set: function(val) {
        this._IVSPlayer = val;
        hookIVS();
      }
    });
  }

  /**********************************************************************
   * 4) HIDDEN UI FALLBACK (Radix "cog" menu) — self-healing on resize/remount
   **********************************************************************/
  const HIDE_STYLE_ID = 'tm-kick-hide-radix-menu';
  let applyingUI = false;
  let scheduled = null;
  let lastApply = 0;
  let lastVideoSrc = '';

  function addHideStyle() {
    if (document.getElementById(HIDE_STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = HIDE_STYLE_ID;
    // Hide only radix dropdown while it's opened by us
    st.textContent = `
      [data-radix-popper-content-wrapper] [role="menu"][data-radix-menu-content]{
        opacity:0 !important;
        pointer-events:none !important;
      }
    `;
    document.documentElement.appendChild(st);
  }

  function removeHideStyle() {
    document.getElementById(HIDE_STYLE_ID)?.remove();
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function getVideo() {
    return document.querySelector('#video-player');
  }

  function findCogButton() {
    // based on your snippet: inside .z-controls and has aria-haspopup="menu"
    return document.querySelector('.z-controls button[aria-haspopup="menu"]');
  }

  function findMenuItemByLabel(label) {
    const items = [...document.querySelectorAll('[role="menuitemradio"]')];
    return items.find(el => el.textContent.trim() === label.trim()) || null;
  }

  function isTargetSelected() {
    const items = [...document.querySelectorAll('[role="menuitemradio"]')];
    for (const el of items) {
      if (el.textContent.trim() === TARGET_LABEL && el.getAttribute('data-state') === 'checked') {
        return true;
      }
    }
    return false;
  }

  async function openMenuHidden(cog, video) {
    addHideStyle();

    // keep controls alive (hover gated)
    if (video) {
      video.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      video.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }

    cog.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    cog.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    cog.click();

    await sleep(60);
  }

  async function closeMenuHidden() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await sleep(25);
    removeHideStyle();
  }

  async function applyQualityOnceUI() {
    if (applyingUI) return false;
    applyingUI = true;

    try {
      const cog = findCogButton();
      const video = getVideo();
      if (!cog || !video) return false;

      await openMenuHidden(cog, video);

      // If already selected, close and done
      if (isTargetSelected()) {
        await closeMenuHidden();
        return true;
      }

      let item = findMenuItemByLabel(TARGET_LABEL);
      if (!item) {
        await sleep(150);
        item = findMenuItemByLabel(TARGET_LABEL);
      }

      if (!item) {
        await closeMenuHidden();
        return false;
      }

      item.click();
      await sleep(80);

      const ok = isTargetSelected();
      await closeMenuHidden();
      return ok;
    } catch (e) {
      log('applyQualityOnceUI error', e);
      try { await closeMenuHidden(); } catch (_) {}
      return false;
    } finally {
      applyingUI = false;
    }
  }

  async function applyWithRetriesUI({ tries = 12, delay = 300 } = {}) {
    const now = Date.now();
    if (now - lastApply < 500) return false; // rate-limit
    lastApply = now;

    for (let i = 0; i < tries; i++) {
      const ok = await applyQualityOnceUI();
      if (ok) return true;
      await sleep(delay);
    }
    return false;
  }

  function scheduleApplyUI(reason) {
    log('scheduleApplyUI:', reason);
    if (scheduled) clearTimeout(scheduled);

    scheduled = setTimeout(() => {
      scheduled = null;
      applyWithRetriesUI({ tries: 12, delay: 300 });
    }, 200);
  }

  function watchForRemountsUI() {
    const obs = new MutationObserver(() => {
      const video = getVideo();
      const cog = findCogButton();
      if (video && cog) scheduleApplyUI('mutation:player-ready');
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  function watchVideoSrcChangesUI() {
    setInterval(() => {
      const v = getVideo();
      if (!v) return;
      const src = (v.currentSrc || v.src || '').trim();
      if (src && src !== lastVideoSrc) {
        lastVideoSrc = src;
        scheduleApplyUI('video-src-changed');
      }
    }, 500);
  }

  function hookResizeAndFullscreenUI() {
    window.addEventListener('resize', () => scheduleApplyUI('window-resize'), { passive: true });
    document.addEventListener('fullscreenchange', () => scheduleApplyUI('fullscreenchange'), { passive: true });
  }

  /**********************************************************************
   * 5) AUTO CLICKER & SAFETY RE-APPLIES
   **********************************************************************/
  function startIntervalScanner() {
    setInterval(() => {
      // A) Auto-click mature content button
      const matureBtn = document.querySelector('button[data-testid="mature"]');
      if (matureBtn) {
        console.log("Kick Script: Clicking 'I am 18+' button");
        matureBtn.click();
      } else {
        // Fallback text match
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const t = (btn.innerText || '').trim();
          if (t.includes('Start watching') || t.includes('I am 18+')) {
            console.log('Kick Script: Clicking content warning button (Text Match)');
            btn.click();
            break;
          }
        }
      }

      // B) Re-apply visibility spoof just in case
      applyVisibilitySpoof();
    }, 1000);
  }

  /**********************************************************************
   * BOOTSTRAP
   **********************************************************************/
  function boot() {
    // UI self-healing bits should run after DOM exists
    watchForRemountsUI();
    watchVideoSrcChangesUI();
    hookResizeAndFullscreenUI();

    // initial apply (player mounts late)
    scheduleApplyUI('initial');

    startIntervalScanner();

    console.log('Kick Quality: Script Loaded (v1.4)');
  }

  // We’re at document-start; DOM may not exist yet. Defer boot.
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
