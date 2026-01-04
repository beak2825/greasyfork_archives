// ==UserScript==
// @name         MangaPark Image Fix
// @namespace    https://mangapark.net/
// @version      1.1
// @description  Forces MangaPark images to use s04.mp instead of s02–s10.mp
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
// @downloadURL https://update.greasyfork.org/scripts/558834/MangaPark%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558834/MangaPark%20Image%20Fix.meta.js
// ==/UserScript==
 
(function () {
    const r = () =>
document.querySelectorAll("img").forEach(img => {
  if (/https:\/\/s\d+/.test(img.src)) { 
    img.src = img.src.replace(/s\d+/, "s01");
  }
});
 
    r();
    new MutationObserver(r).observe(document.body, { childList: true, subtree: true });
})();