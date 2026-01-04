// ==UserScript==
// @name         ⚡ XenoxModder's J2E Bypass
// @namespace    https://t.me/XenoxFF7
// @version      1.0.0
// @description  🔥 Bypass ALL countdown timers & skip buttons instantly! Works On Just2Earn Sites.
// @author       XenoxModder
// @match        *://biharkhabar.net/*
// @match        *://updateclasses.in/*
// @match        *://echoloom.xyz/*
// @match        *://punjabworker.com/*
// @match        *://newkhabar24.com/*
// @match        *://insurance.odiadance.com/*
// @match        *://goodmorningimg.com/*
// @match        *://go.just2earn.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/en/users/1527358-xenox-modder
// @supportURL   https://t.me/XenoxFF2
// @downloadURL https://update.greasyfork.org/scripts/552789/%E2%9A%A1%20XenoxModder%27s%20J2E%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/552789/%E2%9A%A1%20XenoxModder%27s%20J2E%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

  
  if (window.skipTimerProLoaded) return;
  window.skipTimerProLoaded = true;

  const host = location.hostname;


  if (
    [
      'biharkhabar.net',
      'updateclasses.in',
      'echoloom.xyz',
      'punjabworker.com',
      'newkhabar24.com',
      'insurance.odiadance.com',
      'goodmorningimg.com'
    ].includes(host)
  ) {
    const interval = setInterval(() => {
      const button = document.querySelector('center a button#tp-snp2') ||
        [...document.querySelectorAll('center a button')].find(
          b => /continue|countinue|skip|get link/i.test(b.innerText)
        );
      const href = button?.closest('a')?.href;
      if (href) {
        clearInterval(interval);
        location.href = href;
      }
    }, 100);
  }


  if (host === 'go.just2earn.com') {
    const interval = setInterval(() => {
      const timer = document.querySelector('#timer');
      const button = document.querySelector('.get-link');
      if (timer && button && !button.classList.contains('disabled')) {
        const time = parseInt(timer.innerText) || -1;
        if (time <= 0) {
          clearInterval(interval);
          button.click();
        }
      }
    }, 250);
  }

  
})();