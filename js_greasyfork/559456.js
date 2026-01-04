// ==UserScript==
// @name         Claude Mermaid Background Fix
// @namespace    https://github.com/nicholasgriffintn/tampermonkey
// @version      1.0.0
// @description  Makes mermaid diagram backgrounds white in Claude.ai artifacts
// @author       Nicholas Griffin
// @match        *://www.claudeusercontent.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559456/Claude%20Mermaid%20Background%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559456/Claude%20Mermaid%20Background%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS immediately
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: white !important;
        }
        .mermaid {
            background-color: white !important;
        }
    `;
    document.head.appendChild(style);

    // Also set directly when DOM is ready
    function fixBackground() {
        document.body.style.backgroundColor = 'white';
        const mermaid = document.querySelector('.mermaid');
        if (mermaid) {
            mermaid.style.setProperty('background-color', 'white', 'important');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBackground);
    } else {
        fixBackground();
    }

    // Watch for dynamically added mermaid elements
    const observer = new MutationObserver(() => {
        const mermaid = document.querySelector('.mermaid');
        if (mermaid) {
            mermaid.style.setProperty('background-color', 'white', 'important');
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
