// ==UserScript==
// @name        1000ps.de/1000ps.at Price List
// @description Log average price of all bikes to console
// @namespace   shiftgeist
// @match       https://www.1000ps.de/gebrauchte-motorraeder/marke/*/modell/*
// @match       https://www.1000ps.at/gebrauchte-motorraeder/marke/*/modell/*
// @grant       none
// @version     202509026
// @author      shiftgeist
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=1000ps.de
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/548155/1000psde1000psat%20Price%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/548155/1000psde1000psat%20Price%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = window.location.hostname;

    // Add button styles
    GM_addStyle(`
        #collector-toggle {
            position: fixed;
            bottom: 1rem;
            left: 1rem;
            z-index: 9999;
            padding: 8px 12px;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #collector-toggle:active {
            background: #2563eb;
        }
    `);

    // Create toggle button
    const btn = document.createElement('button');
    btn.id = 'collector-toggle';
    btn.textContent = 'PRICE LIST';
    document.body.appendChild(btn);

    // Collect data function
    function collectData() {
        const data = Array.from(document.querySelectorAll('.pricesize')).map(v => {
          const match = v.innerText.trim().match(/[\d.]+/)

          if (!match) return 0;

          return Number.parseFloat(match[0]) * 1000
        });

        const out = `${data.join(',')}`;

        console.log('=== Average Content ===');
        console.log(out);
        GM_setClipboard(out);
        console.log('✅ Copied to clipboard!');
    }

    btn.addEventListener('click', () => {
        collectData();
    });
}());
