// ==UserScript==
// @name         Amazon → Z-Lib & Anna Archive Menu Search
// @namespace    vncsmnl.books
// @version      1.0
// @description  Adds a menu to search the Amazon book title on Z-Lib and Anna’s Archive
// @author       vncsmnl
// @license MIT
// @match        https://www.amazon.com/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557014/Amazon%20%E2%86%92%20Z-Lib%20%20Anna%20Archive%20Menu%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/557014/Amazon%20%E2%86%92%20Z-Lib%20%20Anna%20Archive%20Menu%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getBookTitle() {
        const selectors = [
            "#productTitle",
            "#ebooksProductTitle",
            "span#title",
            "h1.a-size-large.a-spacing-none"
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el.innerText.trim();
        }

        alert("Could not find the book title on this page.");
        return null;
    }

    function searchZLib() {
        const title = getBookTitle();
        if (!title) return;

        const url = `https://z-lib.fm/s/${encodeURIComponent(title)}`;
        window.open(url, "_blank");
    }

    function searchAnnas() {
        const title = getBookTitle();
        if (!title) return;

        const url = `https://annas-archive.org/search?q=${encodeURIComponent(title)}`;
        window.open(url, "_blank");
    }

    // Violentmonkey menu
    GM_registerMenuCommand("Search on Z-Lib", searchZLib);
    GM_registerMenuCommand("Search on Anna’s Archive", searchAnnas);

})();
