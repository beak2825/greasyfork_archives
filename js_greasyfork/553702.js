// ==UserScript==
// @name         YouTube Fullscreen Fix — Disable “More Videos” Grid + Preserve Controls
// @namespace    orangekite
// @version      1.3.6
// @description  Hide fullscreen “More Videos” grid & vignette; keep scroll-wheel volume. Prevent tick-4/7 jiggle without forcing visibility. V-key manual hide. Hide interactive overlay in fullscreen. Allow normal autohide in FS and windowed modes.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553702/YouTube%20Fullscreen%20Fix%20%E2%80%94%20Disable%20%E2%80%9CMore%20Videos%E2%80%9D%20Grid%20%2B%20Preserve%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/553702/YouTube%20Fullscreen%20Fix%20%E2%80%94%20Disable%20%E2%80%9CMore%20Videos%E2%80%9D%20Grid%20%2B%20Preserve%20Controls.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
/* Fullscreen-scoped: match when either the player OR an ancestor is fullscreen */
.html5-video-player:fullscreen,
:fullscreen .html5-video-player {
  --ytp-grid-scroll-percentage: 0 !important;
  --ytp-grid-peek-height: 0px !important;
  --ytp-grid-peek-gradient: 0 !important;
  --ytp-controls-peek-height: 0px !important;
  --ytp-controls-peek-percent: 0 !important;
}

/* Hide the fullscreen recommendations grid and its moving parts */
.html5-video-player:fullscreen [class*="fullscreen-grid"],
.html5-video-player:fullscreen [class*="fullerscreen-grid"],
.html5-video-player:fullscreen [class*="grid-stills"],
.html5-video-player:fullscreen [class*="videowall-still"],
:fullscreen .html5-video-player [class*="fullscreen-grid"],
:fullscreen .html5-video-player [class*="fullerscreen-grid"],
:fullscreen .html5-video-player [class*="grid-stills"],
:fullscreen .html5-video-player [class*="videowall-still"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
}

/* Hide the vignette/scrim/gradient behind the grid */
.html5-video-player:fullscreen [class*="grid-vignette"],
.html5-video-player:fullscreen [class*="grid-scrim"],
.html5-video-player:fullscreen [class*="gradient-bottom"],
:fullscreen .html5-video-player [class*="grid-vignette"],
:fullscreen .html5-video-player [class*="grid-scrim"],
:fullscreen .html5-video-player [class*="gradient-bottom"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Hide “fullerscreen” education/teaser overlays */
.html5-video-player:fullscreen [class*="fullerscreen"],
.html5-video-player:fullscreen .ytp-fullerscreen-edu-panel,
.html5-video-player:fullscreen .ytp-cards-teaser,
.html5-video-player:fullscreen .ytp-cards-teaser-box,
:fullscreen .html5-video-player [class*="fullerscreen"],
:fullscreen .html5-video-player .ytp-fullerscreen-edu-panel,
:fullscreen .html5-video-player .ytp-cards-teaser,
:fullscreen .html5-video-player .ytp-cards-teaser-box {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Safety net for lingering vignette/scrim overlays */
.html5-video-player:fullscreen [class*="vignette"],
.html5-video-player:fullscreen [class*="scrim"],
:fullscreen .html5-video-player [class*="vignette"],
:fullscreen .html5-video-player [class*="scrim"] {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* --- IMPORTANT: Don't force visibility; just remove jiggle when bar is VISIBLE --- */

/* Neutralize any “peek” transforms but ONLY when not autohidden */
:is(.html5-video-player:fullscreen, :fullscreen .html5-video-player):not(.ytp-autohide):not(.ytp-hide-controls)
  [class*="peek"] {
  transform: none !important;
  translate: 0 !important;
}

/* Stop tick-4 jiggle: anchor the chrome only when not autohidden */
:is(.html5-video-player:fullscreen, :fullscreen .html5-video-player):not(.ytp-autohide):not(.ytp-hide-controls)
  .ytp-chrome-bottom {
  bottom: 0 !important;
  transform: translateY(0) !important;
  translate: 0 !important;
  margin-bottom: 0 !important;
  transition: none !important;
}

/* If YouTube injects inline translateY on the chrome, zero it (when not autohidden) */
:is(.html5-video-player:fullscreen, :fullscreen .html5-video-player):not(.ytp-autohide):not(.ytp-hide-controls)
  .ytp-chrome-bottom[style*="translate"] {
  transform: translateY(0) !important;
}

/* Permanently remove interactive overlay in fullscreen */
.html5-video-player:fullscreen :is(.ytp-overlay-bottom-right, .branding-img-container.ytp-button),
:fullscreen .html5-video-player :is(.ytp-overlay-bottom-right, .branding-img-container.ytp-button) {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
  `);

  // ---------------- Core JS helper: keep things smooth; V-key manual hide
  let manualHideActive = false;

  // NOTE: Do NOT force opacity/visibility in FS. Let YT autohide work.
  const restoreChrome = () => {
    const player = document.querySelector('.html5-video-player.ytp-fullscreen');
    if (!player) return;
    const chrome = player.querySelector('.ytp-chrome-bottom');
    if (!chrome) return;

    if (manualHideActive) return;

    // If YT temporarily sets display:none during transitions, restore native display.
    if (!chrome.dataset.nativeDisplay) {
      chrome.dataset.nativeDisplay = getComputedStyle(chrome).display || 'flex';
    }
    const disp = getComputedStyle(chrome).display;
    if (disp === 'none' || chrome.style.display === 'none') {
      chrome.style.display = chrome.dataset.nativeDisplay;
    }

    // IMPORTANT: Do not set opacity/visibility/transform here.
    // We only rely on CSS anchoring when not autohidden.
    chrome.style.removeProperty('opacity');
    chrome.style.removeProperty('visibility');
    chrome.style.removeProperty('transform');
  };

  // Keep controls stable during wheel "peek" while in FS
  window.addEventListener('wheel', restoreChrome, { passive: true });

  // Scrub inline styles on FS boundaries so normal autohide works in both modes
  document.addEventListener('fullscreenchange', () => {
    const fsPlayer  = document.querySelector('.html5-video-player.ytp-fullscreen');
    const fsChrome  = fsPlayer?.querySelector('.ytp-chrome-bottom');
    manualHideActive = false;

    if (document.fullscreenElement) {
      // Entering FS: remove stale inline overrides and ensure native display
      if (fsChrome) {
        if (!fsChrome.dataset.nativeDisplay) {
          fsChrome.dataset.nativeDisplay = getComputedStyle(fsChrome).display || 'flex';
        }
        fsChrome.style.removeProperty('opacity');
        fsChrome.style.removeProperty('visibility');
        fsChrome.style.removeProperty('transform');
        fsChrome.style.removeProperty('bottom');
        fsChrome.style.removeProperty('margin-bottom');
        if (getComputedStyle(fsChrome).display === 'none') {
          fsChrome.style.display = fsChrome.dataset.nativeDisplay;
        }
      }
    } else {
      // Exiting FS: clean all players so windowed autohide resumes
      document.querySelectorAll('.html5-video-player .ytp-chrome-bottom').forEach(chrome => {
        chrome.style.removeProperty('opacity');
        chrome.style.removeProperty('visibility');
        chrome.style.removeProperty('transform');
        chrome.style.removeProperty('display');
        chrome.style.removeProperty('bottom');
        chrome.style.removeProperty('margin-bottom');
      });
    }
  }, { passive: true });

  // V-key: manual hide/show for the control bar (fullscreen only)
  (() => {
    const playerSelector = '.html5-video-player.ytp-fullscreen';
    const chromeSelector = '.ytp-chrome-bottom';

    function applyManualHideStyles(chrome, hide) {
      if (hide) {
        chrome.style.setProperty('opacity', '0', 'important');
        chrome.style.setProperty('visibility', 'hidden', 'important');
        chrome.style.removeProperty('transform');
      } else {
        chrome.style.removeProperty('opacity');
        chrome.style.removeProperty('visibility');
        restoreChrome();
      }
    }

    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() !== 'v') return;
      const player = document.querySelector(playerSelector);
      if (!player) return;
      const chrome = player.querySelector(chromeSelector);
      if (!chrome) return;

      manualHideActive = !manualHideActive;
      applyManualHideStyles(chrome, manualHideActive);
    }, true);

    // Keep behavior consistent if other events fire while hidden
    const syncIfNeeded = () => {
      if (!manualHideActive) return;
      const player = document.querySelector(playerSelector);
      const chrome = player?.querySelector(chromeSelector);
      if (chrome) applyManualHideStyles(chrome, true);
    };
    window.addEventListener('wheel', syncIfNeeded, { passive: true });
    window.addEventListener('keyup', syncIfNeeded, { passive: true });
  })();

})();
