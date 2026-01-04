// ==UserScript==
// @name         Rutracker Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Block ads on rutracker.org, including iframes and banners
// @author       83
// @license      MIT
// @match        *://rutracker.org/*
// @match        *://*.rutracker.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552425/Rutracker%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/552425/Rutracker%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to hide known ad elements
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .bn-idx, #bn-top-right, #bn-top-block,
        div[style*="padding"][style*="0 0 3px"], div[style*="padding: 6px;"],
        a[href*="b.link"] img[width="728"][height="90"],
        a[href*="robinbob"], img[src*="robinbob"],
        iframe[src*="betsonsport"], iframe[src*="banners"] { display: none !important; }
    `;
    document.head.appendChild(style);

    // Function to hide ad elements
    function blockAds() {
        // Hide elements with known ad classes and IDs
        document.querySelectorAll('.bn-idx, #bn-top-right, #bn-top-block').forEach(el => {
            el.style.display = 'none';
        });

        // Hide divs with specific padding and robinbob links
        document.querySelectorAll('div[style*="padding"]').forEach(div => {
            const styleAttr = div.getAttribute('style') || '';
            if (styleAttr.includes('0 0 3px') && div.querySelector('a[href*="robinbob"]')) {
                div.style.display = 'none';
            } else if (styleAttr.includes('padding: 6px;') && div.querySelector('iframe')) {
                div.style.display = 'none';
            }
        });

        // Hide images with robinbob src and their parent divs
        document.querySelectorAll('img[src*="robinbob"]').forEach(img => {
            const parentDiv = img.closest('div');
            if (parentDiv) parentDiv.style.display = 'none';
        });

        // Hide specific banner ads with external links
        document.querySelectorAll('a[href*="b.link"] img[width="728"][height="90"]').forEach(img => {
            const parentA = img.closest('a');
            if (parentA) parentA.style.display = 'none';
        });

        // Hide iframes with ad sources and their parent divs
        document.querySelectorAll('iframe[src*="betsonsport"], iframe[src*="banners"], iframe[id="bn-top-block"]').forEach(iframe => {
            iframe.style.display = 'none';
            const parentDiv = iframe.closest('div[style*="padding"]');
            if (parentDiv) parentDiv.style.display = 'none';
        });
    }

    // Initial run
    blockAds();

    // Observe DOM changes for dynamically loaded ads
    const observer = new MutationObserver(() => blockAds());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();