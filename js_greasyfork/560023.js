// ==UserScript==
// @name         BilingualManga.org - Toggle JP/EN with 't' Key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press 't' to toggle between Japanese (lang=jp) and English (lang=en) on bilingualmanga.org chapters
// @author       Grok
// @match        https://bilingualmanga.org/manga/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/560023/BilingualMangaorg%20-%20Toggle%20JPEN%20with%20%27t%27%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/560023/BilingualMangaorg%20-%20Toggle%20JPEN%20with%20%27t%27%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Press 't' (case-insensitive, no modifiers like Ctrl/Alt/Shift)
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
            e.preventDefault(); // Prevent any default action

            const url = new URL(window.location.href);
            const currentLang = url.searchParams.get('lang') || 'en'; // default to en if missing

            if (currentLang === 'en') {
                url.searchParams.set('lang', 'jp');
            } else {
                url.searchParams.set('lang', 'en');
            }

            // Keep the hash (#img_store)
            window.location.href = url.toString();
        }
    });

    console.log("BilingualManga Toggle Script loaded — press 't' to switch JP/EN");
})();