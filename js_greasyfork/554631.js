// ==UserScript==
// @name         Distraction Free YouTube
// @namespace    https://github.com/SayfullahSayeb/Distraction-Free-YouTube
// @version      1.5.1
// @description  Hide sidebar, comments, and reels. Enable miniplayer and 5-video grid layout.
// @author       Sayeb
// @homepage     https://github.com/SayfullahSayeb/Distraction-Free-YouTube
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.youtube.com&sz=32
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554631/Distraction%20Free%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/554631/Distraction%20Free%20YouTube.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    #secondary { display: none !important; }
    grid-shelf-view-model, ytd-reel-shelf-renderer, ytd-rich-section-renderer, ytd-item-section-renderer#sections, ytd-mini-guide-entry-renderer:nth-of-type(2) { display: none !important; }
    ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: 5 !important; }
    #my-custom-ytp-btn.ytp-button { width:40px;height:40px;padding:0;}
    #my-custom-ytp-btn svg { width:24px;height:24px;display:block;}
    .ytp-fullscreen-grid-main-content, .ytp-ce-element, .ytp-ce-video, .ytp-ce-channel, .ytp-cards-button, .ytp-ce-expanding-overlay, .ytp-ce-covering-overlay { display: none !important;}
`);

  function buildSVG() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("height", "24");
    svg.setAttribute("width", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M21.20 3.01C21.66 3.05 22.08 3.26 22.41 3.58C22.73 3.91 22.94 4.33 22.98 4.79L23 5V19C23.00 19.49 22.81 19.97 22.48 20.34C22.15 20.70 21.69 20.93 21.20 20.99L21 21H3L2.79 20.99C2.30 20.93 1.84 20.70 1.51 20.34C1.18 19.97 .99 19.49 1 19V13H3V19H21V5H11V3H21L21.20 3.01ZM1.29 3.29C1.10 3.48 1.00 3.73 1.00 4C1.00 4.26 1.10 4.51 1.29 4.70L5.58 9H3C2.73 9 2.48 9.10 2.29 9.29C2.10 9.48 2 9.73 2 10C2 10.26 2.10 10.51 2.29 10.70C2.48 10.89 2.73 11 3 11H9V5C9 4.73 8.89 4.48 8.70 4.29C8.51 4.10 8.26 4 8 4C7.73 4 7.48 4.10 7.29 4.29C7.10 4.48 7 4.73 7 5V7.58L2.70 3.29C2.51 3.10 2.26 3.00 2 3.00C1.73 3.00 1.48 3.10 1.29 3.29ZM19.10 11.00L19 11H12L11.89 11.00C11.66 11.02 11.45 11.13 11.29 11.29C11.13 11.45 11.02 11.66 11.00 11.89L11 12V17C10.99 17.24 11.09 17.48 11.25 17.67C11.42 17.85 11.65 17.96 11.89 17.99L12 18H19L19.10 17.99C19.34 17.96 19.57 17.85 19.74 17.67C19.90 17.48 20.00 17.24 20 17V12L19.99 11.89C19.97 11.66 19.87 11.45 19.70 11.29C19.54 11.13 19.33 11.02 19.10 11.00ZM13 16V13H18V16H13Z");
    path.setAttribute("fill", "white");
    svg.appendChild(path);
    return svg;
  }

  function insertButton() {
    const BUTTON_ID = 'my-custom-ytp-btn';
    const controlsRight = document.querySelector('.ytp-right-controls-right');
    if (!controlsRight || document.getElementById(BUTTON_ID)) return;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.className = 'ytp-button';
    button.style.width = '40px';
    button.style.height = '40px';
    button.title = "Miniplayer (press 'i')";
    button.appendChild(buildSVG());

    button.onclick = () => {
      const player = document.querySelector('.html5-video-player');
      if (player) {
        player.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'i',
          code: 'KeyI',
          keyCode: 73,
          bubbles: true,
        }));
      }
    };

    const defaultViewBtn = controlsRight.querySelector('.ytp-size-button');
    if (defaultViewBtn && defaultViewBtn.nextSibling) {
      controlsRight.insertBefore(button, defaultViewBtn.nextSibling);
    } else {
      controlsRight.appendChild(button);
    }
  }

  setInterval(insertButton, 1000);
  window.addEventListener('yt-navigate-finish', () => setTimeout(insertButton, 300));
})();