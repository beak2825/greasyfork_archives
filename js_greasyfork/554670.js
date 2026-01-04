// ==UserScript==
// @name         Indentation Fix
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes unwanted indentation from AI chatbot output elements.
// @author       You
// @match        https://www.aiuncensored.info/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554670/Indentation%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554670/Indentation%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The CSS to remove indentation
    const customCSS = `
        /* Replace '.ai-output-class' with the actual CSS selector for the AI's output container */
        .ai-output-class {
            margin-left: 0 !important;
            padding-left: 0 !important;
            text-indent: 0 !important;
            /* Add any other relevant properties that might cause indentation */
            /* For example, if it's a <blockquote>: */
            /* border-left: none !important; */
        }
    `;

    // Inject the CSS into the page
    GM_addStyle(customCSS);

})();