// ==UserScript==
// @name         YouTube Theater Mode Fixer (new UI)
// @namespace    yt-theater-scroll-horizontal-fix
// @version      1.1.0
// @description  This fixes the new horrible YouTube Theater mode (2025 UI) to be like before, just a full-width video with scrolling and above the sidebar.
// @match        https://www.youtube.com/*
// @license      MIT
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558869/YouTube%20Theater%20Mode%20Fixer%20%28new%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558869/YouTube%20Theater%20Mode%20Fixer%20%28new%20UI%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STORE_KEY = 'ytTheaterFix:config';

  const DEFAULT_CONFIG = {
    enableScrollFix: true,

    // old theater behavior (expand width, height follows width; no forced "fill viewport height")
    theaterHorizontalOnly: true,

    // Cap so the player never becomes taller than the viewport (prevents giant player on very wide screens)
    theaterMaxHeightVh: 82, // 0-100

    hideBottomGridOverlay: true,

    // NEW: delete the bottom gradient overlay element inside the player
    removeYtpGradientBottom: true,

    // Off by default. Enable ONLY if scrolling still fails when cursor is over the player.
    wheelForwardingFallback: false,
  };

  function loadConfig() {
    try {
      const saved = (typeof GM_getValue === 'function') ? GM_getValue(STORE_KEY, {}) : {};
      return { ...DEFAULT_CONFIG, ...(saved || {}) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(cfg) {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(STORE_KEY, cfg);
    } catch {}
  }

  let config = loadConfig();
  let styleEl = null;

  // Gradient remover state
  let playerObserver = null;
  let playerObserverAttachedTo = null;

  function isWatchPage() {
    return location.pathname === '/watch' || location.pathname.startsWith('/watch');
  }

  function buildCss() {
    const maxVh = Math.max(0, Math.min(100, Number(config.theaterMaxHeightVh) || 82));

    return `
      :root { --yt-theater-h: min(56.25vw, ${maxVh}vh); }

      /* ============================
         1) Scroll restore
         ============================ */
      ${config.enableScrollFix ? `
      ytd-app { overflow: auto !important; }

      ytd-app[scrolling] {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: calc((var(--ytd-app-fullerscreen-scrollbar-width) + 1px) * -1) !important;
        bottom: 0 !important;
        overflow-x: auto !important;
      }

      ytd-watch-flexy[full-bleed-player] #single-column-container.ytd-watch-flexy,
      ytd-watch-flexy[full-bleed-player] #columns.ytd-watch-flexy {
        display: flex !important;
      }
      ` : ''}

      /* ============================================
         2) Theater "horizontal-only" sizing (KEY FIX)
         ============================================ */
      ${config.theaterHorizontalOnly ? `
      ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy,
      ytd-watch-flexy[theater]:not([fullscreen]) #player-container-outer.ytd-watch-flexy,
      ytd-watch-flexy[theater]:not([fullscreen]) #player-container-inner.ytd-watch-flexy,
      ytd-watch-flexy[theater]:not([fullscreen]) #player.ytd-watch-flexy,
      ytd-watch-flexy[theater]:not([fullscreen]) ytd-player {
        height: var(--yt-theater-h) !important;
        min-height: 0 !important;
        max-height: none !important;
      }

      ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy,
      ytd-watch-flexy[theater]:not([fullscreen]) #player-container-outer.ytd-watch-flexy {
        align-items: stretch !important;
        justify-content: flex-start !important;
      }

      ytd-watch-flexy[theater]:not([fullscreen]) #movie_player {
        height: 100% !important;
        max-height: none !important;
      }
      ` : ''}

      /* ============================================
         3) Optional: hide the annoying bottom grid overlay in player
         ============================================ */
      ${config.hideBottomGridOverlay ? `
      .ytp-fullscreen-grid-peeking.ytp-full-bleed-player.ytp-delhi-modern:not(.ytp-autohide) .ytp-chrome-bottom {
        bottom: 0 !important;
        opacity: 1 !important;
      }

      #movie_player:not(.ytp-grid-ended-state) .ytp-fullscreen-grid {
        display: none !important;
        top: 100% !important;
        opacity: 0 !important;
      }
      ` : ''}

      /* ============================================
         4) NEW: CSS fallback to hide ytp-gradient-bottom
         (JS below will actually delete it, but this helps if it flashes in briefly)
         ============================================ */
      ${config.removeYtpGradientBottom ? `
      #movie_player .ytp-gradient-bottom { display: none !important; }
      ` : ''}
    `;
  }

  function injectCssIfNeeded() {
    if (styleEl) return;
    styleEl = document.createElement('style');
    styleEl.id = 'yt-theater-fix-style';
    styleEl.textContent = buildCss();
    (document.head || document.documentElement).appendChild(styleEl);
  }

  function refreshCss() {
    if (!styleEl) return;
    styleEl.textContent = buildCss();
  }

  function removeCssIfPresent() {
    if (!styleEl) return;
    styleEl.remove();
    styleEl = null;
  }

  /* ============================
     Gradient deletion logic
     ============================ */
  function removeGradientBottomNow() {
    if (!config.removeYtpGradientBottom) return;

    // Try within movie_player first (less expensive)
    const mp = document.querySelector('#movie_player');
    if (mp) {
      mp.querySelectorAll('.ytp-gradient-bottom').forEach(el => el.remove());
      return;
    }

    // Fallback if player isn't mounted yet
    document.querySelectorAll('.ytp-gradient-bottom').forEach(el => el.remove());
  }

  function detachPlayerObserver() {
    if (playerObserver) {
      playerObserver.disconnect();
      playerObserver = null;
      playerObserverAttachedTo = null;
    }
  }

  function attachPlayerObserverIfPossible() {
    if (!config.removeYtpGradientBottom) {
      detachPlayerObserver();
      return;
    }

    const mp = document.querySelector('#movie_player');
    if (!mp) return;

    // Already attached to this exact node
    if (playerObserverAttachedTo === mp && playerObserver) return;

    detachPlayerObserver();
    playerObserverAttachedTo = mp;

    // Remove any existing gradient immediately
    removeGradientBottomNow();

    // Watch for YouTube recreating it
    playerObserver = new MutationObserver(() => {
      removeGradientBottomNow();
    });

    playerObserver.observe(mp, { childList: true, subtree: true });
  }

  // A lightweight “keep trying until the player exists” loop
  function ensureGradientRemovalWired() {
    if (!config.removeYtpGradientBottom) return;
    if (!isWatchPage()) return;

    // Try now
    attachPlayerObserverIfPossible();
    removeGradientBottomNow();

    // If player isn't there yet, retry a few times
    let tries = 0;
    const maxTries = 120; // ~120 * 250ms = 30s worst case, stops early once attached
    const t = setInterval(() => {
      tries++;
      attachPlayerObserverIfPossible();
      removeGradientBottomNow();

      if (playerObserverAttachedTo || tries >= maxTries || !isWatchPage()) {
        clearInterval(t);
      }
    }, 250);
  }

  function applyForCurrentUrl() {
    detachPlayerObserver();
    removeCssIfPresent();

    if (isWatchPage()) {
      injectCssIfNeeded();
      ensureGradientRemovalWired();
    }
  }

  // --- SPA navigation detector (YouTube is a single-page app) ---
  let lastHref = location.href;
  const navObserver = new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      applyForCurrentUrl();
    }
  });
  navObserver.observe(document, { subtree: true, childList: true });

  // YouTube also fires navigation events; use them too
  document.addEventListener('yt-navigate-finish', () => {
    applyForCurrentUrl();
  }, true);

  // Initial apply
  applyForCurrentUrl();

  /* ============================
     Optional: wheel forwarding fallback
     ============================ */
  function theaterActive() {
    const flexy = document.querySelector('ytd-watch-flexy');
    return !!(flexy && flexy.hasAttribute('theater') && !flexy.hasAttribute('fullscreen'));
  }

  function isInPlayer(target) {
    return !!(target && (target.closest('#movie_player') || target.closest('ytd-player') || target.closest('#player')));
  }

  function getScrollTarget() {
    const candidates = [
      document.querySelector('ytd-app'),
      document.scrollingElement,
      document.documentElement,
      document.body,
    ].filter(Boolean);

    for (const el of candidates) {
      try {
        if (el.scrollHeight > el.clientHeight + 5) return el;
      } catch {}
    }
    return document.scrollingElement || document.documentElement;
  }

  function onWheelCapture(e) {
    if (!config.wheelForwardingFallback) return;
    if (!isWatchPage()) return;
    if (!theaterActive()) return;
    if (!isInPlayer(e.target)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const delta = e.deltaY;
    if (!delta) return;

    const scroller = getScrollTarget();
    if (!scroller) return;

    const prev = scroller.scrollTop;
    scroller.scrollTop += delta;

    if (scroller.scrollTop !== prev) {
      if (e.cancelable) e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  document.addEventListener('wheel', onWheelCapture, { capture: true, passive: false });

  /* ============================
     Menu toggles
     ============================ */
  function toggle(key) {
    config = { ...config, [key]: !config[key] };
    saveConfig(config);

    // If we toggled gradient removal, update observer state immediately
    if (key === 'removeYtpGradientBottom') {
      applyForCurrentUrl();
      return;
    }

    if (styleEl) refreshCss();
    else applyForCurrentUrl();
  }

  function setMaxVh(delta) {
    const cur = Number(config.theaterMaxHeightVh) || 82;
    const next = Math.max(0, Math.min(100, cur + delta));
    config = { ...config, theaterMaxHeightVh: next };
    saveConfig(config);
    refreshCss();
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(`YT: Scroll fix (${config.enableScrollFix ? 'ON' : 'OFF'})`, () => toggle('enableScrollFix'));
    GM_registerMenuCommand(`YT: Theater horizontal-only (${config.theaterHorizontalOnly ? 'ON' : 'OFF'})`, () => toggle('theaterHorizontalOnly'));
    GM_registerMenuCommand(`YT: Hide bottom grid overlay (${config.hideBottomGridOverlay ? 'ON' : 'OFF'})`, () => toggle('hideBottomGridOverlay'));
    GM_registerMenuCommand(`YT: Remove ytp-gradient-bottom (${config.removeYtpGradientBottom ? 'ON' : 'OFF'})`, () => toggle('removeYtpGradientBottom'));
    GM_registerMenuCommand(`YT: Wheel-forwarding fallback (${config.wheelForwardingFallback ? 'ON' : 'OFF'})`, () => toggle('wheelForwardingFallback'));
    GM_registerMenuCommand(`YT: Theater max height +2vh (now ${config.theaterMaxHeightVh}vh)`, () => setMaxVh(+2));
    GM_registerMenuCommand(`YT: Theater max height -2vh (now ${config.theaterMaxHeightVh}vh)`, () => setMaxVh(-2));
  }
})();