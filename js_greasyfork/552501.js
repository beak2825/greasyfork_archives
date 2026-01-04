// ==UserScript==
// @name         jav.guru: Add MissAV link next to Code
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Find "Code:" in <li> elements and add a MissAV search link next to the code
// @match        https://jav.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jav.guru
// @grant        none
// @run-at       document-end
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/552501/javguru%3A%20Add%20MissAV%20link%20next%20to%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/552501/javguru%3A%20Add%20MissAV%20link%20next%20to%20Code.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Extract the code from text like "Code: ***-***"
    function extractCode(text) {
        const m = text.match(/Code:\s*([A-Za-z0-9-]+)/);
        return m ? m[1] : null;
    }

    // Add the MissAV link if not already added
    function addLink(li) {
        const text = li.textContent || '';
        const code = extractCode(text);
        if (!code) return false;

        // Avoid duplicates
        if (li.querySelector('.missav-link')) return true;

        const link = document.createElement('a');
        link.href = `https://missav.ws/en/search/${encodeURIComponent(code)}`;
        link.textContent = 'MissAV';
        link.target = '_blank';
        link.rel = 'nofollow noopener';
        link.className = 'missav-link';
        link.style.marginLeft = '8px';
        link.style.color = '#1e90ff';
        link.style.textDecoration = 'none';

        // Insert link after the code text
        li.appendChild(link);
        console.log(`[MissAV Link] Added for code: ${code}`);
        return true;
    }

    // Try to find and add links to any matching elements
    function processAll() {
        let added = false;
        document.querySelectorAll('li').forEach(li => {
            if (addLink(li)) added = true;
        });
        return added;
    }

    // Observe for dynamically added content
    function initObserver() {
        if (processAll()) return; // maybe already added

        const observer = new MutationObserver((mutations, obs) => {
            if (processAll()) {
                // stop if you only want to add once
                // obs.disconnect();
            }
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Run
    initObserver();
})();
