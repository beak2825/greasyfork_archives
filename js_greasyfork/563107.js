// ==UserScript==
// @name         AO3 BTS Tag Abbreviator
// @namespace    https://aglioeollieo.neocities.org/misc#script
// @version      1.7
// @description  Abbreviates BTS full names in all AO3 tags, including work pages and optional extra info
// @match        https://archiveofourown.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563107/AO3%20BTS%20Tag%20Abbreviator.user.js
// @updateURL https://update.greasyfork.org/scripts/563107/AO3%20BTS%20Tag%20Abbreviator.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const nameMap = {
        "Jeon Jungkook": "Jungkook",
        "Jung Hoseok": "Hoseok",
        "Kim Namjoon": "Namjoon",
        "Kim Seokjin": "Seokjin",
        "Kim Taehyung": "Taehyung",
        "Min Yoongi": "Yoongi",
        "Park Jimin": "Jimin"
    };

    const processed = new WeakSet();

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const patterns = Object.entries(nameMap).map(([full, short]) => {
        // Match optional parentheses or pipe info after name
        const regex = new RegExp(`${escapeRegex(full)}(?:\\s*\\([^)]+\\)|\\s*\\|\\s*[^)]+)?`, 'g');
        return [regex, short];
    });

    function abbreviate(tag) {
        if (processed.has(tag)) return;
        processed.add(tag);

        let text = tag.textContent;
        let changed = false;

        for (const [regex, short] of patterns) {
            const newText = text.replace(regex, short);
            if (newText !== text) {
                text = newText;
                changed = true;
            }
        }

        if (changed) {
            tag.textContent = text;
        }
    }

    function scan(root = document) {
        // Grab all <a class="tag"> elements anywhere
        root.querySelectorAll('a.tag').forEach(abbreviate);
    }

    // Initial scan
    scan();

    // Observe dynamically added nodes
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    scan(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
