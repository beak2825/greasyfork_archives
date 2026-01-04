// ==UserScript==
// @name         Smarter Automatic Page Translator
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically redirects non-English pages to Google Translate. Falls back to text-only translation for local files or inaccessible pages.
// @author       YourName
// @match        *://*/*
// @match        file:///*
// @exclude      https://translate.google.com/*
// @grant        window.open
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/548135/Smarter%20Automatic%20Page%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/548135/Smarter%20Automatic%20Page%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // We wait for the body to exist to ensure we can grab text if needed
    if (!document.body) {
        return;
    }

    const pageLang = document.documentElement.lang;

    // Check if the lang attribute exists and does NOT start with 'en'
    if (pageLang && !pageLang.toLowerCase().startsWith('en')) {
        const currentUrl = window.location.href;

        // Check if the URL is likely a public website
        if (currentUrl.startsWith('http')) {
            console.log(`Detected language: '${pageLang}'. Attempting URL translation for: ${currentUrl}`);
            const translateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(currentUrl)}`;
            // Redirect the current page
            window.location.href = translateUrl;
        } else {
            // This is likely a local file (file:///) or other non-standard protocol.
            // Fallback to translating the text content.
            console.log(`Detected language: '${pageLang}'. URL is not public. Falling back to text-only translation.`);

            // Grab all visible text from the page.
            const pageText = document.body.innerText;

            // Limit text size to avoid creating a URL that is too long for the browser
            const maxTextLength = 1500;
            const truncatedText = pageText.substring(0, maxTextLength);

            if (truncatedText.trim() === '') {
                console.log("No text found on page to translate.");
                return;
            }

            // Construct a URL that translates TEXT, not a URL
            const translateTextUrl = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(truncatedText)}`;

            // Open the translation in a NEW TAB so you don't lose the original page.
            window.open(translateTextUrl, '_blank');
        }
    }
})();
