// ==UserScript==
// @name         Character.AI Filtered Message Editor
// @namespace    https://greasyfork.org/users/YOUR_USER_ID
// @version      1.0
// @description  Permanently enables the Edit button on filtered messages by stripping safety flags from all data (JSON.parse intercept).
// @author       You
// @match        https://character.ai/*
// @match        https://neo.character.ai/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557225/CharacterAI%20Filtered%20Message%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/557225/CharacterAI%20Filtered%20Message%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject directly into the page to bypass sandbox limitations
    const inject = function() {
        // Override JSON.parse to catch data from Network, Cache, AND HTML
        const originalParse = JSON.parse;

        JSON.parse = function(text, reviver) {
            const data = originalParse(text, reviver);

            try {
                // Recursive function to find and flip the safety flag
                const clean = (obj) => {
                    if (!obj || typeof obj !== 'object') return;

                    if (obj.safety_truncated === true) {
                        obj.safety_truncated = false;
                    }

                    if (Array.isArray(obj)) {
                        obj.forEach(clean);
                    } else {
                        Object.values(obj).forEach(clean);
                    }
                };

                // Clean the data before the website sees it
                clean(data);

            } catch (e) {
                // Silently fail on errors to keep the site running smoothly
            }

            return data;
        };
    };

    const script = document.createElement('script');
    script.textContent = `(${inject.toString()})();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

})();