// ==UserScript==
// @name         Scrape VitalSource (inner)
// @namespace    http://tampermonkey.net/
// @version      2024-02-16
// @description  jkhu
// @author       You
// @match        https://jigsaw.vitalsource.com/books/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vitalsource.com
// @sandbox      JavaScript
// @grant        unsafeWindow
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558654/Scrape%20VitalSource%20%28inner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558654/Scrape%20VitalSource%20%28inner%29.meta.js
// ==/UserScript==

function download(url) {
    console.log("inner frame: downloading:", url);
    GM_download({
        url: url,
        name: "page.jpg",
        saveAs: false,
        conflictAction: "uniquify",
        onerror: function (error) {
            console.error("inner frame: download failed:", url, error);
        },
        onload: function (response) {
            console.log("inner frame: downloaded:", url);

            window.top.postMessage(
                {
                    type: "pageImage",
                    frameUrl: window.location.href,
                    url: url,
                },
                "https://bookshelf.vitalsource.com/reader/books/*"
            );

            console.log("inner frame: message sent");
        },
    });
}

(function () {
    let lowResCount = 0;

    const run = function () {
        const b = document.querySelector('img#pbk-page');
        if (b == null) {
            console.log("inner frame: image not found");
            setTimeout(run, 100);
        } else {
            const url = b.src;

            if (url.endsWith("/800")) {
                lowResCount++;
                if (lowResCount < 25) {
                    console.log("inner frame: low res image, retrying:", url);
                    setTimeout(run, 500);
                    return;
                } else {
                    console.log("inner frame: low res image, download anyway:", url);
                }
            }

            console.log("inner frame: found image:", url);
            download(url);
        }
    };

    run();
})();