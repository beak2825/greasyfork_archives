// ==UserScript==
// @name         No Google AI
// @description  Hides AI Mode and AI Overview in Google search results
// @version      2025-11-04

// @author       Zeerocss
// @namespace    https://greasyfork.org/en/users/735136-zeerocss
// @license      MIT

// @include      *://*.google.tld/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552695/No%20Google%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/552695/No%20Google%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hide_ai_mode = true;
    const hide_ai_overview = true;

    window.addEventListener('DOMContentLoaded', () => {
        const ai_mode = document.querySelector('a[href*="udm=50"]');
        const ai_overview = document.querySelector('div[data-mcp]');

        ([hide_ai_mode && ai_mode && ai_mode.closest('[role=listitem]'), hide_ai_overview && ai_overview && ai_overview.parentElement]).forEach(el => el && (el.style.display = 'none'));
    });
})();