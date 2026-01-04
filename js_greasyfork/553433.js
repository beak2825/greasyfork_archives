// ==UserScript==
// @name         Civitai Ad Remover
// @namespace    https://civitai.com/user/superskirv
// @version      0.6
// @description  Removes add cell from the front page, and possibly others.
// @author       Super.Skirv and Qwen2.5-QwQ
// @match        https://civitai.com/*
// @icon         https://civitai.com/images/android-chrome-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553433/Civitai%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/553433/Civitai%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAdDiv() {
        const adBannerClasses = [
            "relative flex overflow-hidden rounded-md border-gray-3 bg-gray-0 shadow-gray-4 dark:border-dark-4 dark:bg-dark-6 dark:shadow-dark-8 flex-col w-full items-center justify-center shadow",
            "relative flex overflow-hidden rounded-md border-gray-3 bg-gray-0 shadow-gray-4 dark:border-dark-4 dark:bg-dark-6 dark:shadow-dark-8 flex-col mx-auto min-w-80 justify-between gap-2 border p-2 shadow"
        ];

        document.querySelectorAll('div').forEach(div => {
            if (adBannerClasses.includes(div.className)) {
                div.remove();
            }
        });
    }

    function removeAdBannerDiv() {
        const adBannerClasses = [
            "relative box-content flex flex-col items-center justify-center gap-2 bg-gray-1 py-3 dark:bg-dark-6",
            "relative flex justify-center border-t border-gray-3 bg-gray-2 dark:border-dark-4 dark:bg-dark-9",
            "relative box-content flex flex-col items-center justify-center gap-2"
        ];

        document.querySelectorAll('div').forEach(div => {
            if (adBannerClasses.includes(div.className)) {
                div.remove();
            }
        });
    }

    // Run once on load and periodically in case new content loads dynamically
    window.addEventListener('load', function() {
        removeAdDiv();
        removeAdBannerDiv();
    });
    setInterval(function() {
        removeAdDiv();
        removeAdBannerDiv();
    }, 2000);
})();