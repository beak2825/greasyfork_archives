// ==UserScript==
// @name         jav.guru: Add MissAV & SupJav links next to Code
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Find "Code:" in <li> elements and add MissAV and SupJav search links
// @author       YourName
// @match        https://jav.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jav.guru
// @grant        none
// @run-at       document-end
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/561607/javguru%3A%20Add%20MissAV%20%20SupJav%20links%20next%20to%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/561607/javguru%3A%20Add%20MissAV%20%20SupJav%20links%20next%20to%20Code.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS for the buttons
    const style = document.createElement('style');
    style.innerHTML = `
        .search-btn-ext {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            color: #fff !important;
            font-size: 11px;
            font-weight: bold;
            border-radius: 4px;
            text-decoration: none;
            transition: opacity 0.2s;
        }
        .search-btn-ext:hover {
            opacity: 0.8;
            text-decoration: none;
            color: #fff !important;
        }
        .btn-missav { background-color: #ff4081; }
        .btn-supjav { background-color: #00bcd4; }
    `;
    document.head.appendChild(style);

    // Extract code logic
    function extractCode(text) {
        const m = text.match(/Code:\s*([A-Za-z0-9-]+)/i);
        return m ? m[1].trim() : null;
    }

    function createLink(href, text, className) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.target = '_blank';
        link.rel = 'nofollow noopener';
        link.className = `search-btn-ext ${className}`;
        return link;
    }

    function addLinks(li) {
        // Prevent duplicate buttons
        if (li.querySelector('.search-btn-ext')) return;

        const text = li.textContent || '';
        const code = extractCode(text);

        if (code) {
            const encodedCode = encodeURIComponent(code);

            // Create MissAV link
            const missavLink = createLink(`https://missav.ws/en/search/${encodedCode}`, 'MissAV', 'btn-missav');

            // Create SupJav link
            const supjavLink = createLink(`https://supjav.com/?s=${encodedCode}`, 'SupJav', 'btn-supjav');

            // Append buttons
            li.appendChild(missavLink);
            li.appendChild(supjavLink);
        }
    }

    // Process nodes
    function processNode(node) {
        if (!node || !node.querySelectorAll) return;
        if (node.tagName === 'LI') addLinks(node);
        node.querySelectorAll('li').forEach(li => addLinks(li));
    }

    // Initial run
    processNode(document.body);

    // Observer for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) processNode(node);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();