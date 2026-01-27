// ==UserScript==
// @name         Daily Mail M+ buster
// @namespace    http://tampermonkey.net/
// @version      2026-01-26
// @description  Get rid of paywall nonsense
// @author       Mr Natural
// @match        https://www.dailymail.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dailymail.co.uk
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at       document-idle
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564119/Daily%20Mail%20M%2B%20buster.user.js
// @updateURL https://update.greasyfork.org/scripts/564119/Daily%20Mail%20M%2B%20buster.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.$(document).ready(function () {
        console.log('Removing M+ nonsense');

        let noskimFound = false;

        const intervalId = setInterval(function() {
            const noskimElements = document.querySelectorAll('div.noskim');

            if (noskimElements.length > 0) {
                console.log('Removing noskim');
                noskimElements.forEach(el => el.remove());
                noskimFound = true;
                clearInterval(intervalId);
                console.log('Noskim removed, interval cleared');
                //expand the content
                window.$('div[itemprop="articleBody"]').css('max-height', '').css('overflow', '');
                //remove the hidden content
                window.$('body').removeClass('is-paywalled-article');
            }
        }, 500);

        // Optional: safety timeout to stop checking after 10 seconds
        setTimeout(function() {
            if (!noskimFound) {
                clearInterval(intervalId);
                console.log('Timeout reached, stopping noskim check');
            }
        }, 10000);

    });
})();