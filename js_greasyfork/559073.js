// ==UserScript==
// @name         UnknownCheats Say Bye Bye to Ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unknowncheats.me
// @description  Removes banner and sidebar ads on UnknownCheats
// @author       6969RandomGuy6969
// @license      MIT
// @match        https://www.unknowncheats.me/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559073/UnknownCheats%20Say%20Bye%20Bye%20to%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/559073/UnknownCheats%20Say%20Bye%20Bye%20to%20Ads.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeBannerAds() {
        const comments = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT
        );

        while (walker.nextNode()) {
            if (walker.currentNode.nodeValue.trim() === 'banner ads') {
                comments.push(walker.currentNode);
            }
        }

        for (let i = 0; i < comments.length; i += 2) {
            const start = comments[i];
            const end = comments[i + 1];
            if (!start || !end) continue;

            let node = start.nextSibling;
            while (node && node !== end) {
                const next = node.nextSibling;
                node.remove();
                node = next;
            }

            start.remove();
            end.remove();
        }
    }

    function removeTable2HR() {
        const table = document.getElementById('Table2');
        if (!table) return;

        const hr = table.nextElementSibling;
        if (hr && hr.tagName === 'HR') {
            hr.remove();
        }
    }

    function removeStickyAdBox() {
        document.querySelectorAll('table.tborder').forEach(table => {
            const header = table.querySelector('td.tcat strong');
            if (header && header.textContent.trim() === '» Ad') {
                const wrapper = table.closest('div');
                if (wrapper) {
                    wrapper.remove();
                }
            }
        });
    }

    function cleanPage() {
        removeBannerAds();
        removeTable2HR();
        removeStickyAdBox();
    }

    // Initial run
    cleanPage();

    // Catch dynamic changes
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.body, { childList: true, subtree: true });
})();
