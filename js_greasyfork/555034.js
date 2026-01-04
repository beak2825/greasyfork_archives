// ==UserScript==
// @name        WaniKani forecast 24h time format
// @description Changes WaniKani forecast widget time format from 12-hour to 24-hour
// @namespace   yakujin
// @include     https://www.wanikani.com/*
// @version     1.2
// @author      yakujin
// @license     public domain
// @run-at      document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/555034/WaniKani%20forecast%2024h%20time%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/555034/WaniKani%20forecast%2024h%20time%20format.meta.js
// ==/UserScript==
"use strict";
(()=>{
    // Please adjust to your liking:
    const format = (hour) => `${hour}h`;

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(target) {
        const origPromise = origFetch.apply(this, arguments);
        return !String(target).includes('/widgets/review-forecast?') ?
            origPromise : new Promise((resolve, reject) => {
            const newResolve = (origResponse) => {
                origResponse.text().then((origBody) => {
                    resolve(new Response(origBody.replaceAll(
                        /--max-title-characters: [4-5]/g,
                        `--max-title-characters: ${format('23').length}`
                    ).replaceAll(
                        /([1-9][0-2]?) (AM|PM)/g,
                        (_, hour, ampm) => format(String((+hour % 12) + (ampm === 'PM') * 12))
                    ), {
                        status: origResponse.status,
                        statusText: origResponse.statusText,
                        headers: Object.fromEntries(origResponse.headers.entries())
                    }));
                }, reject);
            };
            origPromise.then(newResolve, reject);
        });
    };
})();
