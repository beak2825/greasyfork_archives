// ==UserScript==
// @name         MangaPark Image Fix
// @namespace    park-sites-image-fix
// @version      1.0
// @description  Fix broken images on Park/Manga sites without breaking lazy loading
// @match        *://mangapark.com/*
// @match        *://mangapark.net/*
// @match        *://mangapark.org/*
// @match        *://mangapark.me/*
// @match        *://mangapark.io/*
// @match        *://mangapark.to/*
// @match        *://comicpark.org/*
// @match        *://comicpark.to/*
// @match        *://readpark.org/*
// @match        *://readpark.net/*
// @match        *://parkmanga.com/*
// @match        *://parkmanga.net/*
// @match        *://parkmanga.org/*
// @match        *://mpark.to/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562105/MangaPark%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562105/MangaPark%20Image%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processed = new WeakSet();

    function fixImages() {
        const base = location.protocol + "//" + location.host;
        const imgs = document.getElementsByTagName("img");

        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            if (processed.has(img)) continue;

            const src = img.getAttribute("src");
            if (!src) continue;

            if (src.indexOf("//s") !== -1 && src.indexOf(".") !== -1) {
                try {
                    const p = src.split("//")[1];
                    const fixed = base + p.substring(p.indexOf("/"));
                    img.src = fixed;
                    processed.add(img);
                } catch (e) {}
            }
        }
    }

    // Initial run
    fixImages();

    // Observe dynamic image loading
    const observer = new MutationObserver(() => {
        fixImages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();