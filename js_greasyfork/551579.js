// ==UserScript==
// @name         YouTube Live Theme
// @namespace    ModLabs
// @version      1.0.0-GitHUb
// @description  Removes the progress bar from YouTube live streams.
// @license      Apache License 2.0
// @author       ModLabs
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551579/YouTube%20Live%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/551579/YouTube%20Live%20Theme.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CHECK_INTERVAL_MS = 1200;
  const NAVIGATION_EVENTS = ['yt-navigate-finish', 'yt-page-data-updated'];
  const SHADOW_STYLE_ID = 'yt-live-progress-remover-shadow-style';
  const PLAYER_HIDE_CLASS = 'yt-live-progress-hidden';
  const PLAYER_PROGRESS_ACTIVE_CLASS = 'yt-live-progress-active';
  const HOVER_ZONE_PX = 90;
  const HIDE_DELAY_MS = 400;
  const PROGRESS_BAR_Y_OFFSET_PX = 54;
  const DEBUG = false;
  const DEBUG_OVERLAY_ID = 'yt-live-progress-debug';
  let lastLiveElement = null;

  const getLiveIndicatorElement = () => document.querySelector('.ytp-live');
  const getLiveBadgeElement = () => document.querySelector('.ytp-live');

  const removeDebugOverlay = () => {
    const o = document.getElementById(DEBUG_OVERLAY_ID);
    if (o) o.remove();
    if (lastLiveElement) {
      lastLiveElement.style.outline = '';
      lastLiveElement.style.outlineOffset = '';
      lastLiveElement = null;
    }
  };

  const showDebugOverlay = (el, badge) => {
    if (!DEBUG) return;
    let overlay = document.getElementById(DEBUG_OVERLAY_ID);
    const target = badge || el;
    const info = `${badge ? 'badge ' : ''}${target.tagName.toLowerCase()}${target.id ? '#' + target.id : ''}${target.classList.length ? '.' + [...target.classList].join('.') : ''}`;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = DEBUG_OVERLAY_ID;
      overlay.style.cssText = 'position:fixed;z-index:999999;top:8px;left:8px;padding:6px 10px;font:12px/1.3 system-ui,Segoe UI,Roboto,sans-serif;background:rgba(0,0,0,0.65);color:#ffbfd1;border:1px solid rgba(255,255,255,0.18);border-radius:8px;backdrop-filter:blur(8px) saturate(180%);-webkit-backdrop-filter:blur(8px) saturate(180%);pointer-events:none;box-shadow:0 4px 14px -4px rgba(0,0,0,0.6)';
      document.documentElement.appendChild(overlay);
    }
    overlay.textContent = 'Live detected: ' + info;
  };
  const CONTROL_SHADOW_CSS = `
    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-gradient-bottom {
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.68) 0%,
        rgba(0, 0, 0, 0.38) 55%,
        rgba(0, 0, 0, 0) 100%
      ) !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container {
      opacity: 0 !important;
      transform: translateY(${PROGRESS_BAR_Y_OFFSET_PX}px);
      transition: opacity 240ms ease;
      background: transparent !important;
      border: 1px solid transparent !important;
      box-shadow: none !important;
      position: relative;
      overflow: hidden;
      pointer-events: auto !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container,
    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container .ytp-progress-bar,
    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container .ytp-progress-bar * {
      border-radius: 16px !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container .ytp-progress-bar {
      opacity: 0.4 !important;
  height: 8px !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-container {
      opacity: 1 !important;
      transform: translateY(${PROGRESS_BAR_Y_OFFSET_PX}px);
      transition: opacity 160ms ease;
      background:
        linear-gradient(182deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.35) 100%),
        rgba(0,0,0,0.42) !important;
      border: 1px solid rgba(255,255,255,0.18) !important;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.05),
        inset 0 1px 0 rgba(255,255,255,0.28),
        0 4px 14px -4px rgba(0,0,0,0.55),
        0 18px 40px -10px rgba(0,0,0,0.55);
      backdrop-filter: blur(30px) saturate(260%) brightness(0.92);
      -webkit-backdrop-filter: blur(30px) saturate(260%) brightness(0.92);
      overflow: hidden;
      pointer-events: auto !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-container::before {
      content: '';
      position: absolute;
      inset: 2px 3px 3px 3px;
      border-radius: inherit;
      background:
        radial-gradient(120% 140% at 15% 0%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 55%),
        linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.22) 100%);
      mix-blend-mode: screen;
      opacity: 0.22;
      pointer-events: none;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-container::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 42%, rgba(0,0,0,0.55) 100%),
        radial-gradient(85% 120% at 50% -30%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 70%);
      opacity: 0.18;
      pointer-events: none;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar {
      height: 8px !important;
      border-radius: 999px !important;
      position: relative;
      z-index: 1;
      overflow: visible !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-padding {
      border-radius: 999px !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-background {
      background:
        linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%),
        rgba(0,0,0,0.58) !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-load-progress {
      background:
        linear-gradient(125deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 100%) !important;
      opacity: 0.42;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS} .ytp-progress-bar-container .ytp-play-progress,
    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-container .ytp-play-progress {
      position: relative;
      border-radius: 999px !important;
      opacity: 0.66 !important;
      background:
        linear-gradient(118deg, rgba(255,90,120,0.85) 0%, rgba(255,60,110,0.90) 40%, rgba(255,70,130,0.80) 72%, rgba(255,120,160,0.70) 100%),
        rgba(255,72,110,0.55) !important;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.55),
        0 0 26px rgba(255,80,120,0.55),
        0 4px 14px rgba(255,80,120,0.25),
        0 0 2px 1px rgba(255,120,150,0.45);
      backdrop-filter: blur(12px) saturate(240%);
      -webkit-backdrop-filter: blur(12px) saturate(240%);
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-progress-bar-container .ytp-play-progress::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(100deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 28%, rgba(255,255,255,0) 72%),
        linear-gradient(0deg, rgba(255,255,255,0.35), rgba(255,255,255,0));
      opacity: 0.55;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-scrubber-container {
      width: 18px !important;
      height: 18px !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-scrubber-button {
      width: 18px !important;
      height: 18px !important;
      margin-top: -5px !important;
      margin-left: -9px !important;
      border-radius: 50% !important;
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.95) 0%, rgba(224, 228, 235, 0.85) 45%, rgba(176, 182, 196, 0.9) 100%) !important;
      box-shadow:
        0 6px 18px rgba(18, 20, 32, 0.38),
        0 1px 0 rgba(255, 255, 255, 0.65),
        inset 0 0 0 1px rgba(255, 255, 255, 0.95);
      border: none !important;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-scrubber-button::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0) 100%);
      opacity: 0.9;
    }

    .html5-video-player.${PLAYER_HIDE_CLASS}.${PLAYER_PROGRESS_ACTIVE_CLASS} .ytp-chapter-hover-container {
      border-radius: 14px !important;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      background: rgba(16, 20, 32, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }
  `;

  let monitorId = null;
  const hoverBindingMap = new WeakMap();

  const bindProgressHoverHandlers = (player) => {
    const container = player.querySelector('.ytp-progress-bar-container');
    if (!container) {
      unbindProgressHoverHandlers(player);
      return;
    }

    const scrubber = player.querySelector('.ytp-scrubber-container');
    const existingBinding = hoverBindingMap.get(player);
    if (existingBinding?.container === container && existingBinding?.scrubber === scrubber) {
      return;
    }

    if (existingBinding) {
      unbindProgressHoverHandlers(player);
    }

    const state = {
      hideTimer: null,
      hoverZone: false,
      pointerInInteractive: false,
      focused: false,
      dragging: false,
    };

    const clearHideTimer = () => {
      if (state.hideTimer !== null) {
        clearTimeout(state.hideTimer);
        state.hideTimer = null;
      }
    };

    const activate = () => {
      clearHideTimer();
      if (!player.classList.contains(PLAYER_PROGRESS_ACTIVE_CLASS)) {
        player.classList.add(PLAYER_PROGRESS_ACTIVE_CLASS);
      }
    };

    const shouldHide = () => {
      return !state.hoverZone && !state.pointerInInteractive && !state.focused && !state.dragging;
    };

    const scheduleHide = () => {
      if (!shouldHide()) {
        return;
      }
      clearHideTimer();
      state.hideTimer = window.setTimeout(() => {
        state.hideTimer = null;
        if (shouldHide()) {
          player.classList.remove(PLAYER_PROGRESS_ACTIVE_CLASS);
        }
      }, HIDE_DELAY_MS);
    };

    const pointerMoveHandler = (event) => {
      const rect = player.getBoundingClientRect();
      const distanceFromBottom = rect.bottom - event.clientY;
      const insideZone = distanceFromBottom >= 0 && distanceFromBottom <= HOVER_ZONE_PX;
      if (insideZone) {
        if (!state.hoverZone) {
          state.hoverZone = true;
          activate();
        }
      } else if (state.hoverZone) {
        state.hoverZone = false;
        scheduleHide();
      }
    };

    const pointerLeaveHandler = () => {
      state.hoverZone = false;
      scheduleHide();
    };

    const pointerEnterInteractive = () => {
      state.pointerInInteractive = true;
      activate();
    };

    const pointerLeaveInteractive = () => {
      state.pointerInInteractive = false;
      scheduleHide();
    };

    const focusInHandler = () => {
      state.focused = true;
      activate();
    };

    const focusOutHandler = () => {
      state.focused = false;
      scheduleHide();
    };

    const pointerDownHandler = () => {
      state.dragging = true;
      activate();
    };

    const pointerUpHandler = () => {
      state.dragging = false;
      scheduleHide();
    };

  player.addEventListener('pointermove', pointerMoveHandler, { passive: true });
  player.addEventListener('pointerleave', pointerLeaveHandler, { passive: true });

  container.addEventListener('pointerenter', pointerEnterInteractive, { passive: true });
  container.addEventListener('pointerleave', pointerLeaveInteractive, { passive: true });
  container.addEventListener('pointerdown', pointerDownHandler, { passive: true });
    container.addEventListener('focusin', focusInHandler);
    container.addEventListener('focusout', focusOutHandler);

  scrubber?.addEventListener('pointerenter', pointerEnterInteractive, { passive: true });
  scrubber?.addEventListener('pointerleave', pointerLeaveInteractive, { passive: true });
  scrubber?.addEventListener('pointerdown', pointerDownHandler, { passive: true });

    window.addEventListener('pointerup', pointerUpHandler, true);

    hoverBindingMap.set(player, {
      container,
      scrubber,
      pointerMoveHandler,
      pointerLeaveHandler,
      pointerEnterInteractive,
      pointerLeaveInteractive,
      pointerDownHandler,
      pointerUpHandler,
      focusInHandler,
      focusOutHandler,
      state,
    });
  };

  const unbindProgressHoverHandlers = (player) => {
    const binding = hoverBindingMap.get(player);
    if (!binding) {
      player.classList.remove(PLAYER_PROGRESS_ACTIVE_CLASS);
      return;
    }

    const {
      container,
      scrubber,
      pointerMoveHandler,
      pointerLeaveHandler,
      pointerEnterInteractive,
      pointerLeaveInteractive,
      pointerDownHandler,
      pointerUpHandler,
      focusInHandler,
      focusOutHandler,
      state,
    } = binding;

    player.removeEventListener('pointermove', pointerMoveHandler);
    player.removeEventListener('pointerleave', pointerLeaveHandler);

    container?.removeEventListener('pointerenter', pointerEnterInteractive);
    container?.removeEventListener('pointerleave', pointerLeaveInteractive);
    container?.removeEventListener('pointerdown', pointerDownHandler);
    container?.removeEventListener('focusin', focusInHandler);
    container?.removeEventListener('focusout', focusOutHandler);

    scrubber?.removeEventListener('pointerenter', pointerEnterInteractive);
    scrubber?.removeEventListener('pointerleave', pointerLeaveInteractive);
    scrubber?.removeEventListener('pointerdown', pointerDownHandler);

    window.removeEventListener('pointerup', pointerUpHandler, true);

    state.dragging = false;
    if (state.hideTimer !== null) {
      clearTimeout(state.hideTimer);
      state.hideTimer = null;
    }

    player.classList.remove(PLAYER_PROGRESS_ACTIVE_CLASS);
    hoverBindingMap.delete(player);
  };

  const logPrefix = '[YT Live Progress Remover]';
  const log = (...args) => console.debug(logPrefix, ...args);

  const isLive = () => {
    const indicator = getLiveIndicatorElement();
    if (indicator) {
      const badge = getLiveBadgeElement();
      const highlightTarget = badge || indicator;
      if (DEBUG) {
        if (lastLiveElement !== highlightTarget) {
          if (lastLiveElement) {
            lastLiveElement.style.outline = '';
            lastLiveElement.style.outlineOffset = '';
          }
          lastLiveElement = highlightTarget;
        }
        showDebugOverlay(indicator, badge);
        highlightTarget.style.outline = '2px solid #ff2d55';
        highlightTarget.style.outlineOffset = '2px';
        console.debug('[YT Live Theme] Live indicator:', indicator, badge ? ' (badge preferred)' : '');
      }
      return true;
    }
    removeDebugOverlay();
    return false;
  };

  const setProgressBarHidden = (hidden) => {
    const players = document.querySelectorAll('.html5-video-player');
    if (!players.length) {
      return false;
    }

    let changed = false;
    players.forEach((player) => {
      if (hidden) {
        injectControlShadowTweaks();
        bindProgressHoverHandlers(player);
        if (!player.classList.contains(PLAYER_HIDE_CLASS)) {
          player.classList.add(PLAYER_HIDE_CLASS);
          changed = true;
        }
      } else if (player.classList.contains(PLAYER_HIDE_CLASS)) {
        player.classList.remove(PLAYER_HIDE_CLASS);
        changed = true;
      }

      if (!hidden) {
        player.classList.remove(PLAYER_PROGRESS_ACTIVE_CLASS);
        unbindProgressHoverHandlers(player);
      }
    });

    if (changed) {
      log(hidden ? 'Hid progress bar for livestream.' : 'Restored progress bar.');
    }

    if (!hidden) {
      const anyLivePlayers = Array.from(players).some(p => p.classList.contains(PLAYER_HIDE_CLASS));
      if (!anyLivePlayers) {
        const style = document.getElementById(SHADOW_STYLE_ID);
        style?.remove();
      }
    }

    return changed;
  };

  const injectControlShadowTweaks = () => {
    if (document.getElementById(SHADOW_STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = SHADOW_STYLE_ID;
    style.textContent = CONTROL_SHADOW_CSS;

    (document.head || document.documentElement).appendChild(style);
    log('Injected control shadow tweaks.');
  };

  const teardownMonitor = () => {
    if (monitorId !== null) {
      clearInterval(monitorId);
      monitorId = null;
      log('Stopped live monitor.');
    }

    setProgressBarHidden(false);
    removeDebugOverlay();
  };

  const ensureMonitor = () => {
    if (monitorId !== null) {
      return;
    }

    monitorId = window.setInterval(() => {
      if (!isLive()) {
        teardownMonitor();
        return;
      }

      setProgressBarHidden(true);
    }, CHECK_INTERVAL_MS);

    log('Started live monitor.');
  };

  const handleStateChange = () => {
    if (isLive()) {
      setProgressBarHidden(true);
      ensureMonitor();
    } else {
      teardownMonitor();
    }
  };

  const waitForPlayerAndHandle = () => {
    const player = document.querySelector('.html5-video-player');
    if (player) {
      handleStateChange();
      return;
    }

    const observer = new MutationObserver((_, obs) => {
      if (document.querySelector('.html5-video-player')) {
        obs.disconnect();
        handleStateChange();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  const attachNavigationListeners = () => {
    NAVIGATION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, () => {
        setTimeout(waitForPlayerAndHandle, 150);
      });
    });

    window.addEventListener('popstate', () => {
      setTimeout(waitForPlayerAndHandle, 150);
    });
  };

  const init = () => {
    waitForPlayerAndHandle();
    attachNavigationListeners();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();