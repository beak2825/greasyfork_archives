// ==UserScript==
// @name         Shuffle-style ARS to USD Icon Replacement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace ARS text/icons with USD on a site using /icons/fiat/USD.svg
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553219/Shuffle-style%20ARS%20to%20USD%20Icon%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/553219/Shuffle-style%20ARS%20to%20USD%20Icon%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const usdIconSrc = '/icons/fiat/USD.svg'; // Path to USD icon

    // Detect if an <img> or <svg> is ARS
    function isARSIcon(el) {
        if (el.tagName === 'IMG') {
            return /ARS/i.test(el.alt + el.title + el.src);
        } else if (el.tagName === 'SVG') {
            return el.outerHTML.includes('ARS');
        }
        return false;
    }

    function replaceARS() {
        // 1️⃣ Replace all ARS text nodes
        document.querySelectorAll('*:not(script):not(style)').forEach(el => {
            el.childNodes.forEach(n => {
                if (n.nodeType === 3 && n.nodeValue.includes('ARS')) {
                    const parent = n.parentNode;
                    const span = document.createElement('span');

                    // Copy styles & class
                    span.style.cssText = parent.style.cssText;
                    if (parent.className) span.className = parent.className;

                    // Replace text with $ (no extra space)
                    span.textContent = n.nodeValue.replace(/ARS\s*/, '$');

                    parent.replaceChild(span, n);
                }
            });
        });

        // 2️⃣ Replace ARS <img> icons with USD.svg
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.larped && isARSIcon(img)) {
                img.dataset.larped = '1';

                const newImg = document.createElement('img');
                newImg.src = usdIconSrc;

                // Copy original styles and classes
                newImg.style.cssText = img.style.cssText;
                if (img.className) newImg.className = img.className;

                img.replaceWith(newImg);
            }
        });

        // 3️⃣ Replace ARS <svg> icons with USD.svg
        document.querySelectorAll('svg').forEach(svg => {
            if (!svg.dataset.larped && isARSIcon(svg)) {
                svg.dataset.larped = '1';

                const newImg = document.createElement('img');
                newImg.src = usdIconSrc;

                // Copy styles & class from original svg
                newImg.style.cssText = svg.style.cssText;
                if (svg.className) newImg.className = svg.className;

                svg.replaceWith(newImg);
            }
        });
    }

    // 4️⃣ Loop to handle dynamically loaded content
    function loop() {
        try { replaceARS(); } catch(e) { console.error(e); }
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
