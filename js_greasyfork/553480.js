// ==UserScript==
// @name         Waze Checker Dark Mode
// @version      1.0.2
// @description  Enables dark mode in the Waze Checker panel for better appearance and readability.
// @author       FalconTech
// @match        https://checker.waze.uz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labtool.pl
// @namespace    https://greasyfork.org/users/205544
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553480/Waze%20Checker%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/553480/Waze%20Checker%20Dark%20Mode.meta.js
// ==/UserScript==

/* Changelog:
 *  1.0.2 - Change color of visited row
 *  1.0.1 - Reduce FOUC by run-at-start
 *  1.0.0 - New script
 */

(function() {
    'use strict';
    document.documentElement.setAttribute('data-bs-theme', 'dark');

    let div = document.querySelector('.bg-white');
    if (div) div.classList.remove('bg-white');

    div = document.querySelector('.bg-light');
    if (div) div.classList.remove('bg-light');

    const style = document.createElement('style');
    style.textContent = `
        tr:has(td.was-visited) td {
            background-color: rgba(255, 0, 0, 0.15) !important;
        }
    `;
    document.head.appendChild(style);

    new MutationObserver(() =>
    document.querySelectorAll('.bg-white,.bg-light')
      .forEach(el => el.classList.remove('bg-white','bg-light'))
  ).observe(document, {childList: true, subtree: true});
})();
