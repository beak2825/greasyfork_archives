// ==UserScript==
// @name         AVDBS ESC Scroll-up Disable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable AVDBS ESC Scroll-up function
// @author       You
// @match        https://www.avdbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=avdbs.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562294/AVDBS%20ESC%20Scroll-up%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/562294/AVDBS%20ESC%20Scroll-up%20Disable.meta.js
// ==/UserScript==

['keydown', 'keyup'].forEach((eventName) => {
  window.addEventListener(
    eventName,
    (e) => {
      e.stopPropagation();
    },
    true // capturing phase - very important
  );
});