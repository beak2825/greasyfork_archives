// ==UserScript==
// @name         Grok Unblur - Zoe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  يشيل الـ blur من صور Grok NSFW
// @author       Zoe
// @match        https://grok.x.ai/*
// @match        https://x.com/grok/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555036/Grok%20Unblur%20-%20Zoe.user.js
// @updateURL https://update.greasyfork.org/scripts/555036/Grok%20Unblur%20-%20Zoe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function unblur() {
        document.querySelectorAll('img').forEach(img => {
            const style = window.getComputedStyle(img);
            if (style.filter && style.filter.includes('blur')) {
                img.style.filter = 'none !important';
                img.style.transform = 'scale(1.001)';
                console.log('[Zoe] Unblurred:', img.src);
            }
        });
    }
    new MutationObserver(unblur).observe(document.documentElement, { childList: true, subtree: true });
    unblur();
    setInterval(unblur, 500);
})();