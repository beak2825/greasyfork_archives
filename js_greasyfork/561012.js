// ==UserScript==
// @name         Unlock Billboard Pro charts (private)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove Billboard Pro payment requests and unhide the charts.
// @author       Hướng Dương
// @match        *://www.billboard.com/charts/*
// @grant        none
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/561012/Unlock%20Billboard%20Pro%20charts%20%28private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561012/Unlock%20Billboard%20Pro%20charts%20%28private%29.meta.js
// ==/UserScript==

(
    function () {
        'use strict';

        const removePaywall = () => {
            let proCharts = document.querySelectorAll('div.pmc-paywall.a-article-cropped');

            proCharts.forEach(div => {
                div.classList.remove('pmc-paywall', 'a-article-cropped');
            });

            let offer = document.getElementById('piano-paywall');
            if (offer) {
                offer.remove();
            }
        };

        removePaywall();

        const observer = new MutationObserver(() => {
            removePaywall();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
)();