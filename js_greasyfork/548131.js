// ==UserScript==
// @name         Automatic Page Translator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically redirects non-English pages to Google Translate for translation.
// @author       YourName
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548131/Automatic%20Page%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/548131/Automatic%20Page%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the language attribute from the <html> tag
    const pageLang = document.documentElement.lang;

    // Check if the lang attribute exists and does NOT start with 'en'
    // .startsWith('en') catches variants like 'en-US', 'en-GB', etc.
    if (pageLang && !pageLang.toLowerCase().startsWith('en')) {
        console.log(`Detected language: '${pageLang}'. Redirecting to Google Translate.`);

        // Get the current URL
        const currentUrl = window.location.href;

        // Construct the new Google Translate URL
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(currentUrl)}`;

        // Redirect the user
        window.location.href = translateUrl;
    }
})();
