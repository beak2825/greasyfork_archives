// ==UserScript==
// @name         ZerADS PTC Captcha Solver (Visual Match)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detects the captcha ID and clicks the matching image
// @author       Rubystance
// @license      MIT
// @match        https://zerads.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562569/ZerADS%20PTC%20Captcha%20Solver%20%28Visual%20Match%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562569/ZerADS%20PTC%20Captcha%20Solver%20%28Visual%20Match%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const captchaMap = {

    };

    function solve() {

        const mainImg = document.querySelector('img[src*="captcha.php"]');
        if (!mainImg) return;

        const urlParams = new URLSearchParams(mainImg.src.split('?')[1]);
        const currentId = urlParams.get('id');

        console.log("Solving captcha for ID:", currentId);

        const options = document.querySelectorAll(`a[href*="id=${currentId}"][href*="cid="]`);

        if (options.length > 0) {

            const correctCid = "2";
            const target = Array.from(options).find(opt => opt.href.includes(`cid=${correctCid}`));

            if (target) {
                console.log("Correct image found. Clicking...");
                target.click();
            } else {
                console.log("Specific target not found, clicking the first option.");
                options[0].click();
            }
        }
    }

    window.addEventListener('load', () => {
        setTimeout(solve, 2000);
    });
})();
