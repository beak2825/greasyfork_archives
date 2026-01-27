// ==UserScript==
// @name         Auto-close navigation panel
// @namespace    http://tampermonkey.net/
// @version      2026-01-27
// @description  closes fandom wiki's naviagation panel after it automatically opens
// @author       You
// @match        https://*.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/564232/Auto-close%20navigation%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/564232/Auto-close%20navigation%20panel.meta.js
// ==/UserScript==


(function () {
  const close = () => {
    const btn = document.querySelector(
      "button.navigation-panel__close-button[aria-label='Hide']"
    );
    if (btn) btn.click();
  };

  // Close once after load
  close();

  // Close again if the site reopens it
  const obs = new MutationObserver(close);
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
