// ==UserScript==
// @name         Shuffle-style $to USD Icon Replacement
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Replace $text/icons with USD on a site using /icons/fiat/USD.svg
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553220/Shuffle-style%20%24to%20USD%20Icon%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/553220/Shuffle-style%20%24to%20USD%20Icon%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const usdIconSrc = '/icons/fiat/USD.svg'; // Path to USD icon

    // small debug flag (set false to silence logs)
    const DEBUG = true;

    if (DEBUG) console.info('USD replacement userscript loaded');

    // Detect if an <img> or <svg> is $ / currency icon
    function is$Icon(el) {
        try {
            const tag = (el.tagName || '').toUpperCase();

            // Build a string of probeable metadata
            const probe = ((el.alt || '') + ' ' + (el.title || '') + ' ' + (el.src || '') + ' ' + (el.className || '')).toLowerCase();

            // avoid touching profile images whose src contains avatar/profile/user
            if (/avatar|profile|user|pfp|photo|picture|logo|banner/.test(probe)) {
                return false;
            }

            // If the element is an <img>, look for currency hints:
            // match a literal $ (escaped), or "ars", or common fiat filename patterns
            if (tag === 'IMG') {
                if (/\$/.test(probe)) return true;        // literal $ in alt/title/src (rare)
                if (/\bars\b/.test(probe)) return true;   // "ars" in filename/alt
                if (/\/icons\/fiat\/ars\.svg/.test(probe)) return true;
                if (/\/icons\/fiat\/usd\.svg/.test(probe)) return false; // already USD
                // nothing matched
                return false;
            }

            // If it's an SVG element, inspect its markup for currency hints
            if (tag === 'SVG') {
                const markup = (el.outerHTML || '').toLowerCase();
                if (markup.includes('ars') || /\$/.test(markup) || /\/icons\/fiat\/ars\.svg/.test(markup)) return true;
                return false;
            }
        } catch (e) {
            if (DEBUG) console.error('is$Icon error', e);
            return false;
        }
        return false;
    }

    function replace$() {
        // 1️⃣ Replace all $text nodes (literal $ or "ARS" text)
        document.querySelectorAll('*:not(script):not(style)').forEach(el => {
            el.childNodes.forEach(n => {
                if (n.nodeType === 3 && (n.nodeValue.includes('$') || /\bars\b/i.test(n.nodeValue))) {
                    const parent = n.parentNode;
                    // Make sure we don't accidentally wrap big blocks — only replace the label itself
                    try {
                        // Replace ARS with $ and remove trailing space: "ARS 1" -> "$1"
                        const newText = n.nodeValue.replace(/\bARS\b\s*/gi, '$').replace(/\$\s+/g, '$');
                        if (newText !== n.nodeValue) {
                            const span = document.createElement('span');
                            span.style.cssText = parent.style.cssText;
                            if (parent.className) span.className = parent.className;
                            span.textContent = newText;
                            parent.replaceChild(span, n);
                            if (DEBUG) console.info('Replaced text node:', n.nodeValue, '→', newText);
                        }
                    } catch (e) {
                        if (DEBUG) console.error('text replace error', e);
                    }
                }
            });
        });

        // 2️⃣ Replace $/ARS <img> icons with USD.svg
        document.querySelectorAll('img').forEach(img => {
            try {
                if (!img.dataset.larped && is$Icon(img)) {
                    img.dataset.larped = '1';
                    const newImg = document.createElement('img');
                    newImg.src = usdIconSrc;
                    // preserve classes and inline styles
                    if (img.className) newImg.className = img.className;
                    if (img.style && img.style.cssText) newImg.style.cssText = img.style.cssText;
                    img.replaceWith(newImg);
                    if (DEBUG) console.info('Replaced IMG icon →', usdIconSrc, 'orig:', img.src);
                }
            } catch (e) {
                if (DEBUG) console.error('img replace error', e);
            }
        });

        // 3️⃣ Replace $/ARS <svg> icons with USD.svg
        document.querySelectorAll('svg').forEach(svg => {
            try {
                if (!svg.dataset.larped && is$Icon(svg)) {
                    svg.dataset.larped = '1';
                    const newImg = document.createElement('img');
                    newImg.src = usdIconSrc;
                    if (svg.className) newImg.className = svg.className;
                    if (svg.style && svg.style.cssText) newImg.style.cssText = svg.style.cssText;
                    svg.replaceWith(newImg);
                    if (DEBUG) console.info('Replaced SVG icon →', usdIconSrc);
                }
            } catch (e) {
                if (DEBUG) console.error('svg replace error', e);
            }
        });
    }

    // 4️⃣ Loop to handle dynamically loaded content
    function loop() {
        try { replace$(); } catch(e) { if (DEBUG) console.error(e); }
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
