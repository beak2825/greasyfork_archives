// ==UserScript==
// @name         AO3 BTS Tag Abbreviator
// @namespace    https://aglioeollieo.neocities.org/misc#script
// @version      1.9
// @description  Abbreviates BTS full names in all AO3 tags
// @author       aglioeollieo
// @icon         https://www.google.com/s2/favicons?domain=archiveofourown.org
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
        "Park Jimin": "Jimin",
        "Bangtan Boys": "BTS"
    };

    const processed = new WeakSet();

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const patterns = Object.entries(nameMap).map(([full, short]) => {
        const regex = new RegExp(
            `${escapeRegex(full)}(?:\\s*\\(BTS\\)|\\s*\\|\\s*[A-Za-z.-]+)?`,
            'g'
        );
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
        root.querySelectorAll('a.tag').forEach(abbreviate);
    }

    scan();

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
