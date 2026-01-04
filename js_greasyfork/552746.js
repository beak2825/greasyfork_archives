// ==UserScript==
// @name         Google Always English (Instant + Global)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Force Google Search to always use the global (google.com) domain and English language, instantly and efficiently.
// @author       You
// @match        *://www.google.com/*
// @match        *://google.com/*
// @match        *://www.google.co.*/*
// @match        *://google.co.*/*
// @match        *://www.google.com.au/*
// @match        *://www.google.ca/*
// @match        *://www.google.de/*
// @match        *://www.google.fr/*
// @match        *://www.google.es/*
// @match        *://www.google.it/*
// @match        *://www.google.jp/*
// @match        *://www.google.ru/*
// @match        *://www.google.br/*
// @match        *://www.google.in/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552746/Google%20Always%20English%20%28Instant%20%2B%20Global%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552746/Google%20Always%20English%20%28Instant%20%2B%20Global%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const TARGET_HOSTNAME = "www.google.com";
    const TARGET_UI_LANG = "en"; // Interface language
    const TARGET_RESULTS_LANG = "lang_en"; // Search results language

    // --- Main Logic ---
    const currentUrl = new URL(window.location.href);
    const currentHostname = currentUrl.hostname;
    const params = currentUrl.searchParams;

    let needsRedirect = false;

    // 1. Check if the domain needs to be changed to global google.com
    // This also implicitly handles the "ncr" (No Country Redirect) functionality.
    if (currentHostname !== TARGET_HOSTNAME) {
        currentUrl.hostname = TARGET_HOSTNAME;
        needsRedirect = true;
    }

    // 2. Check if the UI language parameter is correct
    if (params.get("hl") !== TARGET_UI_LANG) {
        params.set("hl", TARGET_UI_LANG);
        needsRedirect = true;
    }

    // 3. Check if the search results language parameter is correct
    if (params.get("lr") !== TARGET_RESULTS_LANG) {
        params.set("lr", TARGET_RESULTS_LANG);
        needsRedirect = true;
    }

    // If any change was needed, perform a single, consolidated redirect.
    if (needsRedirect) {
        // Using replace() is faster and doesn't clutter browser history
        window.location.replace(currentUrl.href);
        return; // Stop script execution after redirect
    }

    // --- Efficiently Set Preference Cookies ---
    // This part runs only if no redirect was needed.
    // It ensures Google remembers your preference for future visits.
    const cookieDomain = ".google.com";
    const expiryDate = "Fri, 31 Dec 9999 23:59:59 GMT";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    if (getCookie("HL") !== TARGET_UI_LANG) {
        document.cookie = `HL=${TARGET_UI_LANG}; path=/; domain=${cookieDomain}; expires=${expiryDate}`;
    }

    if (getCookie("LR") !== TARGET_RESULTS_LANG) {
        document.cookie = `LR=${TARGET_RESULTS_LANG}; path=/; domain=${cookieDomain}; expires=${expiryDate}`;
    }
})();