// ==UserScript==
// @name         CircleFTP IDM Download Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fix IDM Showing The Connection Was Actively Refused By Machine Error 
// @author       BlazeFTL
// @match        *://circleftp.net/*
// @match        *://*.circleftp.net/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550568/CircleFTP%20IDM%20Download%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550568/CircleFTP%20IDM%20Download%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixLinks(root = document) {
        root.querySelectorAll('a[href][download]').forEach(link => {
            // Remove target
            if (link.hasAttribute('target')) {
                link.removeAttribute('target');
            }

            // If download is empty, set it to the filename from href
            if (link.getAttribute('download') === '') {
                try {
                    const url = new URL(link.href);
                    const filename = url.pathname.split('/').pop();
                    if (filename) link.setAttribute('download', filename);
                } catch(e) {
                    console.warn('Download link parse failed:', e);
                }
            }
        });
    }

    // Run initially
    fixLinks();

    // Watch for dynamically loaded content
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) fixLinks(node);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
