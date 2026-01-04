// ==UserScript==
// @name         Preload Images
// @namespace    http://tampermonkey.net/
// @version      2025-12-09
// @description  Preload all the images on the page to override lazy loading images
// @author       Pans
// @license      N/A
// @match        https://www.webtoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558444/Preload%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/558444/Preload%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('#_imageList img').forEach(img => {
        const image = img.dataset.url;
        if (!image) return;

        img.src = image + "&force=" + Date.now();
    });
})();