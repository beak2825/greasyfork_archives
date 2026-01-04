// ==UserScript==
// @name         YouTube Native Settings Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds Fullscreen, Captions, and Theater Mode toggles to YouTube's native settings menu
// @author       Ricky + Copilot
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553884/YouTube%20Native%20Settings%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553884/YouTube%20Native%20Settings%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const injectSettingsItems = () => {
    const menuHost = document.querySelector('ytd-player > div.ytp-chrome-bottom');
    if (!menuHost) return;

    const settingsButton = menuHost.querySelector('.ytp-settings-button');
    if (!settingsButton) return;

    settingsButton.addEventListener('click', () => {
      setTimeout(() => {
        const menu = document.querySelector('.ytp-panel-menu');
        if (!menu || menu.querySelector('.ytp-custom-toggle')) return;

        const createToggle = (label, onClick) => {
          const item = document.createElement('div');
          item.className = 'ytp-menuitem ytp-custom-toggle';
          item.innerHTML = `
            <div class="ytp-menuitem-label">${label}</div>
            <div class="ytp-menuitem-content">Toggle</div>
          `;
          item.style.cursor = 'pointer';
          item.onclick = onClick;
          return item;
        };

        const fullscreenToggle = createToggle('Fullscreen', () => {
          const video = document.querySelector('video');
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            video?.requestFullscreen();
          }
        });

        const captionsToggle = createToggle('Captions', () => {
          document.querySelector('.ytp-subtitles-button')?.click();
        });

        const theaterToggle = createToggle('Theater Mode', () => {
          document.querySelector('.ytp-size-button')?.click();
        });

        menu.appendChild(fullscreenToggle);
        menu.appendChild(captionsToggle);
        menu.appendChild(theaterToggle);
      }, 300); // Wait for menu to render
    });
  };

  const observer = new MutationObserver(() => {
    injectSettingsItems();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
