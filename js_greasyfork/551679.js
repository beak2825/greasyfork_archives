// ==UserScript==
// @name         Boogle Search
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Instantly replaces Google logo with Boogle
// @author       dmohunterd
// @match        https://www.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551679/Boogle%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/551679/Boogle%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #hplogo, #lga img, #lga svg, #logo, img[alt="Google"], svg {
            display: none !important;
        }
        #boogle-logo {
            font-family: Arial, sans-serif;
            font-weight: bold;
            user-select: none;
            cursor: default;
            line-height: 1.2;
            letter-spacing: -2px;
            position: fixed;
            z-index: 10000;
            color: transparent;
        }
        #boogle-logo.center {
            position: absolute !important;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -200%);
            font-size: 100px !important;
            letter-spacing: -5px !important;
            text-align: center;
            z-index: 10 !important;
        }
        #boogle-logo.top-left {
            top: 15px !important;
            left: 15px !important;
            font-size: 24px !important;
            letter-spacing: -2px !important;
            text-align: left !important;
        }
        #boogle-logo span {
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

    function createBoogleLogo(position) {
        let boogle = document.getElementById('boogle-logo');
        if (boogle) boogle.remove();

        boogle = document.createElement('div');
        boogle.id = 'boogle-logo';

        const colors = ['#4285F4', '#DB4437', '#F4B400', '#4285F4', '#0F9D58', '#DB4437'];
        const letters = [...'Boogle'].map((ch, i) => `<span style="color:${colors[i]};">${ch}</span>`).join('');
        boogle.innerHTML = letters;

        if (position === 'center') boogle.classList.add('center');
        else boogle.classList.add('top-left');

        document.body.appendChild(boogle);
    }

    function isHomePage() {
        return window.location.pathname === '/' && !window.location.search;
    }

    function main() {
        ['#hplogo', '#logo', 'img[alt="Google"]', 'svg', '#lga img', '#lga svg'].forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
        });

        if (isHomePage()) createBoogleLogo('center');
        else createBoogleLogo('top-left');
    }

    main();

    new MutationObserver(() => {
        if (!document.getElementById('boogle-logo')) main();
    }).observe(document.body, { childList: true, subtree: true });
})();
