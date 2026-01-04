// ==UserScript==
// @name         Kick.com Language Filter Memory
// @version      1.0
// @description  Automatically remembers and restores your selected language filter on Kick.com browse page
// @description:pl Automatycznie zapamiętuje i przywraca wybrany filtr języka na stronie przeglądania Kick.com
// @author       Premiumsmart
// @match        https://kick.com/browse*
// @icon         https://kick.com/favicon.ico
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1353836
// @downloadURL https://update.greasyfork.org/scripts/555371/Kickcom%20Language%20Filter%20Memory.user.js
// @updateURL https://update.greasyfork.org/scripts/555371/Kickcom%20Language%20Filter%20Memory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'kick_language_filter';

    // Get current language from URL
    function getCurrentLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('languages');
    }

    // Get saved language from localStorage
    function getSavedLanguage() {
        return localStorage.getItem(STORAGE_KEY);
    }

    // Save language to localStorage
    function saveLanguage(lang) {
        if (lang) {
            localStorage.setItem(STORAGE_KEY, lang);
            console.log(`[Kick Filter] Saved language: ${lang}`);
        } else {
            // If user removed the filter (clicked "Clear all")
            localStorage.removeItem(STORAGE_KEY);
            console.log(`[Kick Filter] Removed saved language`);
        }
    }

    // Main logic
    function applyLanguageFilter() {
        const currentLang = getCurrentLanguageFromURL();
        const savedLang = getSavedLanguage();

        // Case 1: User just selected/changed language
        if (currentLang) {
            saveLanguage(currentLang);
            console.log(`[Kick Filter] Detected language filter: ${currentLang}`);
        }
        // Case 2: No language in URL, but we have saved one
        else if (savedLang && window.location.pathname === '/browse') {
            console.log(`[Kick Filter] Restoring saved language: ${savedLang}`);
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('languages', savedLang);

            // Keep other parameters (e.g. sort)
            if (!urlParams.has('sort')) {
                urlParams.set('sort', 'viewers_high_to_low');
            }

            // Redirect with preserved parameters
            window.location.search = urlParams.toString();
        }
        // Case 3: No language in URL and no saved language - user cleared the filter
        else if (!currentLang && !savedLang) {
            console.log(`[Kick Filter] No language filter active`);
        }
    }

    // Listen for URL changes (when user changes filter without page reload)
    let lastURL = window.location.href;
    new MutationObserver(() => {
        const currentURL = window.location.href;
        if (currentURL !== lastURL) {
            lastURL = currentURL;
            applyLanguageFilter();
        }
    }).observe(document, { subtree: true, childList: true });

    // Run on page load
    applyLanguageFilter();

})();