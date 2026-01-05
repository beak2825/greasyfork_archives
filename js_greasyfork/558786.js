// ==UserScript==
// @name         MangaPark Image Fix
// @namespace    https://mangapark.net/
// @version      1.0
// @description  Forces MangaPark images to use priority hosts (s01 > s03 > s05 > s06 > s00 > s04)
// @match        *://*.mangapark.org/*
// @match        *://*.mangapark.net/*
// @match        *://*.mangapark.to/*
// @match        *://*.mangapark.io/*
// @match        *://*.comicpark.org/*
// @match        *://*.comicpark.to/*
// @match        *://*.readpark.org/*
// @match        *://*.readpark.net/*
// @match        *://*.mpark.to/*
// @match        *://*.fto.to/*
// @match        *://*.jto.to/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558866/MangaPark%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558866/MangaPark%20Image%20Fix.meta.js
// ==/UserScript==
(function () {
    const hosts = ['01', '03', '05', '06', '00', '04'];
    let index = 0;

    const fix = () =>
        document.querySelectorAll('img[src*=".mp"]').forEach(img => {
            const orig = img.src;
            const next = orig.replace(/s0\d\.mp|s10\.mp/g, `s${hosts[index]}.mp`);
            if (orig !== next) {
                img.src = next;
                img.onerror = () => {
                    index = (index + 1) % hosts.length;
                    if (index !== 0) {
                        img.src = orig.replace(/s0\d\.mp|s10\.mp/g, `s${hosts[index]}.mp`);
                    }
                };
            }
        });
    fix();
    new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
})();