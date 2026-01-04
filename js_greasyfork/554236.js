// ==UserScript==
// @name         YouTube 播放到結尾自動停止
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  防止 YouTube 播放列表自動切換下一個
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554236/YouTube%20%E6%92%AD%E6%94%BE%E5%88%B0%E7%B5%90%E5%B0%BE%E8%87%AA%E5%8B%95%E5%81%9C%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/554236/YouTube%20%E6%92%AD%E6%94%BE%E5%88%B0%E7%B5%90%E5%B0%BE%E8%87%AA%E5%8B%95%E5%81%9C%E6%AD%A2.meta.js
// ==/UserScript==

(async () => {
  const waitForDom = () => document.readyState === 'loading' 
    ? new Promise(r => document.addEventListener('DOMContentLoaded', r)) 
    : Promise.resolve();

  await waitForDom();
  await customElements.whenDefined('yt-playlist-manager');

  const stopAutoAdvance = () => {
    const manager = document.querySelector('yt-playlist-manager');
    if (manager) {
      const instance = manager.polymerController || manager.inst || manager;
      if (instance.canAutoAdvance_ !== undefined) {
        instance.canAutoAdvance_ = false;
      }
    }
  };

  const init = () => {
    stopAutoAdvance();
    const interval = setInterval(() => {
      if (document.querySelector('yt-playlist-manager')) {
        stopAutoAdvance();
        clearInterval(interval);
      }
    }, 100);
  };

  document.addEventListener('yt-navigate-finish', () => setTimeout(init, 100));
  init();
})();