// ==UserScript==
// @name         Universal Bato Mirror Image Fixer
// @namespace    http://tampermonkey.net/
// @version      4.10
// @description  Fixes the 'k' to 'n' server error across all known mirror domains using the confirmed working match structure.
// @author       morbid-apolo
// @match        *://ato.to/*
// @match        *://dto.to/*
// @match        *://fto.to/*
// @match        *://hto.to/*
// @match        *://jto.to/*
// @match        *://lto.to/*
// @match        *://mto.to/*
// @match        *://nto.to/*
// @match        *://vto.to/*
// @match        *://wto.to/*
// @match        *://xto.to/*
// @match        *://yto.to/*
// @match        *://vba.to/*
// @match        *://wba.to/*
// @match        *://xba.to/*
// @match        *://yba.to/*
// @match        *://zba.to/*
// @match        *://bato.ac/*
// @match        *://bato.bz/*
// @match        *://bato.cc/*
// @match        *://bato.cx/*
// @match        *://bato.id/*
// @match        *://bato.pw/*
// @match        *://bato.sh/*
// @match        *://bato.to/*
// @match        *://bato.vc/*
// @match        *://bato.day/*
// @match        *://bato.red/*
// @match        *://bato.run/*
// @match        *://batoto.in/*
// @match        *://batoto.tv/*
// @match        *://batotoo.com/*
// @match        *://batotwo.com/*
// @match        *://batpub.com/*
// @match        *://batread.com/*
// @match        *://battwo.com/*
// @match        *://xbato.com/*
// @match        *://xbato.net/*
// @match        *://xbato.org/*
// @match        *://zbato.com/*
// @match        *://zbato.net/*
// @match        *://zbato.org/*
// @match        *://comiko.net/*
// @match        *://comiko.org/*
// @match        *://mangatoto.com/*
// @match        *://mangatoto.net/*
// @match        *://mangatoto.org/*
// @match        *://batocomic.com/*
// @match        *://batocomic.net/*
// @match        *://batocomic.org/*
// @match        *://readtoto.com/*
// @match        *://readtoto.net/*
// @match        *://readtoto.org/*
// @match        *://kuku.to/*
// @match        *://okok.to/*
// @match        *://ruru.to/*
// @match        *://xdxd.to/*
// @match        *://bato.si/*
// @match        *://bato.ing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bato.to
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558879/Universal%20Bato%20Mirror%20Image%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/558879/Universal%20Bato%20Mirror%20Image%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of attributes to check for the broken URL
    const URL_ATTRIBUTES = ['src', 'data-src', 'data-original', 'srcset'];

    // The core function to find and fix images
    function fixImages() {
        for (const img of document.querySelectorAll('img')) {
            let fixed = false;

            // 1. Iterate through all potential URL attributes
            for (const attr of URL_ATTRIBUTES) {
                // Read the attribute value; use img.src for the primary source URL property
                const originalUrl = (attr === 'src') ? img.src : img.getAttribute(attr);

                // Check for the problematic k05 server segment
                if (originalUrl && originalUrl.indexOf('//k') !== -1) {

                    // --- IOS FIX ADDED HERE ---
                    // Sets the required referrer policy for cross-domain loading on Safari.
                    img.referrerPolicy = "no-referrer";

                    // --------------------------

                    // Replace the broken segment ('//k' with '//n')
                    const fixedUrl = originalUrl.replace('//k', '//n');

                    // Set the attribute/property back
                    if (attr === 'src') {
                        img.src = fixedUrl;
                    } else {
                        img.setAttribute(attr, fixedUrl);
                    }
                    fixed = true;
                }
            }

            // 2. If the image URL was fixed, try to force a reload
            if (fixed) {
                // Remove data-src if present to force the browser to use the fixed 'src'
                if (img.hasAttribute('data-src')) {
                    img.removeAttribute('data-src');
                }
            }
        }
    }

    // Run the fix immediately after the page is loaded (document-idle)
    fixImages();

    // Use a MutationObserver to catch any images that are loaded later (scrolling, dynamic content)
    const observer = new MutationObserver(fixImages);
    observer.observe(document.body, { childList: true, subtree: true });

})();