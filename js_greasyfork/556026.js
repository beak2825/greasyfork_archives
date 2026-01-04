// ==UserScript==
// @name         Stop Embed Youtube
// @namespace    softforum
// @version      1.0
// @description  Stop autoplay of embed youtube frame
// @match        *://*.51.ca/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556026/Stop%20Embed%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/556026/Stop%20Embed%20Youtube.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    const host = location.hostname;
 
    // Helper to remove elements by selector
    function removeElems(selectors, root = document) {
        selectors.forEach(sel => {
            try {
                root.querySelectorAll(sel).forEach(el => el.remove());
            } catch (e) {
                // Ignore selectors not supported (e.g. :has in some browsers)
            }
        });
    }
 
    // Helper to disable YouTube autoplay
    function fixIframeSrc(iframe) {
        if (!iframe.src.includes("youtube.com/embed/")) return false;
 
        const url = new URL(iframe.src, window.location.href);
 
        // Remove autoplay
        if (url.searchParams.has("autoplay")) {
            url.searchParams.delete("autoplay");
        }
 
        // Force mute
        url.searchParams.set("mute", "1");
 
        // Only update src if changed
        if (iframe.src !== url.toString()) {
            iframe.src = url.toString();
        }
 
        return true;
    }
 
    function scanAndFix(root = document) {
        root.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(fixIframeSrc);
    }
    
    scanAndFix();
 
    // Wait for body to exist
    function waitForBody(callback) {
        if (document.body) return callback();
        new MutationObserver((mutations, obs) => {
            if (document.body) {
                obs.disconnect();
                callback();
            }
        }).observe(document.documentElement, { childList: true });
    }
    
    waitForBody(() => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        removeElems(selectors, node);
                        scanAndFix(node);
                        if (selectors.some(sel => node.matches(sel))) node.remove();
                    }
                });
            });
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();