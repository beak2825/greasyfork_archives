// ==UserScript==
// @name         YT+B Top
// @namespace    http://your.namespace.here
// @version      3.0
// @description  Apply fullscreen styles to video/iframe/embed only when in fullscreen (YouTube + Bilibili)
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://www.bilibili.com/*
// @match        *://bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561247/YT%2BB%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/561247/YT%2BB%20Top.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let styleEl = null;

  function applyFullscreenStyle() {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.textContent = `
        iframe, video, embed {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: auto !important;
          max-height: 100vh !important;
          z-index: 10 !important;
          background: black !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }

  function removeFullscreenStyle() {
    if (styleEl) {
      styleEl.remove();
      styleEl = null;
    }
  }

  function isFullscreenMediaPlayer(elem) {
    if (!elem) return false;

    return (
      // YouTube player container
      elem.classList.contains('html5-video-player') ||
      // Bilibili players
      elem.classList.contains('bpx-player-container') ||
      elem.classList.contains('bilibili-player-video-wrap')
    );
  }

  document.addEventListener('fullscreenchange', () => {
    const fullscreenEl = document.fullscreenElement;
    if (isFullscreenMediaPlayer(fullscreenEl) || fullscreenEl?.querySelector?.('video')) {
      applyFullscreenStyle();
    } else {
      removeFullscreenStyle();
    }
  });
})();
