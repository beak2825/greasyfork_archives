// ==UserScript==
// @name        [Imagus] Mark hovered Grok link as visited
// @description Marks Grok Imagine links as visited after you hover over them with Imagus browser extension. 
// @version     2.5
// @author      NiteCyper
// @namespace   http://tampermonkey.net/
// @license     GPL-3.0-or-later
// @grant       none
// @match       *://grok.com/*
// @match       *://*.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/561451/%5BImagus%5D%20Mark%20hovered%20Grok%20link%20as%20visited.user.js
// @updateURL https://update.greasyfork.org/scripts/561451/%5BImagus%5D%20Mark%20hovered%20Grok%20link%20as%20visited.meta.js
// ==/UserScript==

/* Grok sieve for Imagus (Copy/Paste into Imagus Options > Sieve > Import):
 {"GrokImagine":{"link":"^grok\\.com/imagine/post/([a-f0-9-]+)","img":"^imagine-public\\.x\\.ai/imagine-public/share-videos/$1_hd\\.mp4","to":"https://imagine-public.x.ai/imagine-public/share-videos/$1_hd.mp4"}}
*/


/* IMAGUS REBORN SIEVE:
{"GrokImagine":{"link":"^grok\\.com/imagine/post/([a-f0-9-]+)","url":"https://imagine-public.x.ai/imagine-public/share-videos/$1_hd\\.mp4","res":":\\nif($._ && $._.indexOf('mp4') !== -1) return $._;\\nreturn 'https://imagine-public.x.ai/imagine-public/images/' + $[1] + '.png';"}}
*/

(function() {
    'use strict';
    const VISITED_STYLE = 'color: #8855bb !important; opacity: 0.7 !important;';

    function markAsSeen(link) {
        const idMatch = link.href.match(/grok\.com\/imagine\/post\/([a-f0-9-]+)/);
        if (idMatch) {
            localStorage.setItem('grok_seen_' + idMatch[1], 'true');
            link.style.cssText += VISITED_STYLE;
            link.setAttribute('data-grok-styled', 'true');
        }
    }

    // Use the event you liked - it's much more reliable than a timer
    window.addEventListener('imagus:popped', function() {
        const link = document.querySelector('a:hover');
        if (link && link.href.includes('grok.com/imagine/post/')) {
            markAsSeen(link);
        }
    }, true);

    // Efficiently style links on page load and infinite scroll
    const applyStyles = () => {
        document.querySelectorAll('a[href*="grok.com/imagine/post/"]:not([data-grok-styled])').forEach(link => {
            const idMatch = link.href.match(/grok\.com\/imagine\/post\/([a-f0-9-]+)/);
            if (idMatch && localStorage.getItem('grok_seen_' + idMatch[1])) {
                link.style.cssText += VISITED_STYLE;
                link.setAttribute('data-grok-styled', 'true');
            }
        });
    };

    // Replace setInterval with a passive observer
    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    applyStyles();
})();