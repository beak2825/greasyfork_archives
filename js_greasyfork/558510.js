// ==UserScript==
// @name         RYM Spotify Link Rewriter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace Spotify web links with app links
// @match        https://rateyourmusic.com/*
// @grant        none
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author       blackscalare

// @downloadURL https://update.greasyfork.org/scripts/558510/RYM%20Spotify%20Link%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/558510/RYM%20Spotify%20Link%20Rewriter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rewriteLinks(root = document) {
        const elements = root.getElementsByClassName('ui_media_link_btn_spotify');
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];

            const href = el.href;
            if (!href || href.startsWith('spotify:')) continue;

            const parts = href.split('/');
            if (parts.length > 2) {
                const newHref = 'spotify:' + parts[parts.length - 2] + ':' + parts[parts.length - 1];
                el.href = newHref;
            }
        }
    }

    // Do an initial run in case some links have already loaded
    rewriteLinks();

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                rewriteLinks(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();