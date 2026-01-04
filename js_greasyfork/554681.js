// ==UserScript==
// @name         FASTEST 2025 Google Translate
// @namespace    http://instagram.com/waterdustlab
// @version      1.2
// @description  Super-fast Google Translate with instant SPA/AJAX support, no hiding
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554681/FASTEST%202025%20Google%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/554681/FASTEST%202025%20Google%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let translateInstance; // Store instance for refresh

    function initTranslate() {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        document.body.appendChild(div);

        window.googleTranslateElementInit = function() {
            translateInstance = new google.translate.TranslateElement({
                pageLanguage: document.documentElement.lang || 'auto',
                includedLanguages: 'en', // Adjust as needed
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: true // Let toolbar show naturally
            }, 'google_translate_element');
        };

        // Load Google Translate script async for speed
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        // MutationObserver for dynamic/SPA/AJAX content
        const observer = new MutationObserver((mutations) => {
            if (translateInstance && mutations.length > 0) {
                // Trigger refresh on Google's translate instance if available
                if (typeof translateInstance.restore === 'function') {
                    translateInstance.restore(); // Reset and re-translate
                } else if (typeof google.translate.TranslateElement === 'function') {
                    // Fallback: Re-init minimally
                    translateInstance = new google.translate.TranslateElement({
                        pageLanguage: document.documentElement.lang || 'auto',
                        includedLanguages: 'en',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: true
                    }, 'google_translate_element');
                }
            }
        });

        // Observe body for changes (subtree for deep SPA updates)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false // Minimal for speed
        });
    }

    // Wait for body if not ready (rare, but safe)
    if (document.body) {
        initTranslate();
    } else {
        const bodyObserver = new MutationObserver(() => {
            if (document.body) {
                bodyObserver.disconnect();
                initTranslate();
            }
        });
        bodyObserver.observe(document.documentElement, { childList: true });
    }
})();