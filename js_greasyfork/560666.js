// ==UserScript==
// @name         Tokopedia results filter
// @namespace    http://tampermonkey.net/
// @version      2025-12-29
// @description  Instant refiltering for Tokopedia results by exact string (case-insensitive)
// @author       You
// @match        https://www.tokopedia.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokopedia.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/560666/Tokopedia%20results%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/560666/Tokopedia%20results%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filter = (str) => {
        const results = [...document.querySelectorAll('div[data-ssr="contentProductsSRPSSR"] a')];
        results.forEach(el => {el.parentNode.style.display = ""});
        if (str) {
            results
                .filter(el => !el.innerText.match(new RegExp(str, "i")))
                .forEach(el => {el.parentNode.style.display = 'none'});
        }
    }

    const div = document.createElement('div');
    div.id = 'topedfilter';
    div.style.position = 'fixed';
    div.style.bottom = 0;
    div.style.right = 0;
    div.style.padding = '20px';
    div.style.backgroundColor = 'deepskyblue';
    div.style.zIndex = 1000;

    const filterInput = document.createElement('input');
    filterInput.placeholder = 'Filter...';
    filterInput.addEventListener('keyup', (e) => {
        filter(filterInput.value);
    });

    div.appendChild(filterInput);
    document.body.appendChild(div);

    let lastScrollPos = window.scrollY;

    document.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastScrollPos) < 20) return;
        lastScrollPos = window.scrollY;
        if (filterInput.value) {
            filter(filterInput.value);
        }
    });
})();