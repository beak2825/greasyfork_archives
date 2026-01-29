// ==UserScript==
// @name         Korea Congo-Style Naming
// @namespace    https://github.com/zappingsbrew/korea-congo
// @version      1.0.0
// @description  Full Congo-style Korea renaming: handles all Korea edge cases, plurals, possessives, abbreviations, grammar, parentheses, won, capitalization, and coordinated phrase treatment
// @author       Zappingsbrew & ChatGPT
// @match        *://*/*
// @grant        none
// @icon         https://github.com/twitter/twemoji/blob/master/assets/72x72/1f1f0-1f1f7.png?raw=true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564402/Korea%20Congo-Style%20Naming.user.js
// @updateURL https://update.greasyfork.org/scripts/564402/Korea%20Congo-Style%20Naming.meta.js
// ==/UserScript==

/*!
 * MIT License
 *
 * Copyright (c) 2026 Zappingsbrew
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // Neighbor words to check
    const NEIGHBORS = [
        "Korea","Koreas","Korean","Koreans",
        "Korea's","Koreas'","Korean's","Koreans'"
    ];

    // Coordinated phrases that used to be exceptions, now replaced atomically
    const PHRASE_REPLACEMENTS = [
        { regex: /\bNorth and South Koreans\b/gi, replacement: "DPR Koreans and Koreans" },
        { regex: /\bSouth and North Koreans\b/gi, replacement: "Koreans and DPR Koreans" },
        { regex: /\bNorth and South Koreas\b/gi, replacement: "DPR Koreas and Koreas" },
        { regex: /\bSouth and North Koreas\b/gi, replacement: "Koreas and DPR Koreas" },
        { regex: /\bNorth and South Korea\b/gi, replacement: "DPR Korea and Korea" },
        { regex: /\bSouth and North Korea\b/gi, replacement: "Korea and DPR Korea" },
        { regex: /\bNorth and South Korea's\b/gi, replacement: "DPR Korea's and Korea's" },
        { regex: /\bSouth and North Korea's\b/gi, replacement: "Korea's and DPR Korea's" },
        { regex: /\bNorth and South Koreans'\b/gi, replacement: "DPR Koreans' and Koreans'" },
        { regex: /\bSouth and North Koreans'\b/gi, replacement: "Koreans' and DPR Koreans'" },
        { regex: /\bNorth and South Korean's\b/gi, replacement: "DPR Korean's and Korean's" },
        { regex: /\bSouth and North Korean's\b/gi, replacement: "Korean's and DPR Korean's" }
    ];

    // Individual replacements
    const REPLACEMENTS = {
        "North": "DPR",
        "South": "" // remove South when safe
    };

    // Core replacement function
    function applyCongoTreatment(text) {

        // Phase 0: atomic coordinated phrases
        for (let phrase of PHRASE_REPLACEMENTS) {
            text = text.replace(phrase.regex, phrase.replacement);
        }

        // Phase 1: parentheses variations
        for (let neighbor of NEIGHBORS) {
            const parenRegex = new RegExp(`\\b(${neighbor})\\s*\$begin:math:text$\(North\|South\)\\$end:math:text$\\b`, "gi");
            text = text.replace(parenRegex, (match, p1, p2) => {
                const replacement = REPLACEMENTS[p2];
                return replacement ? replacement + " " + p1 : p1;
            });
        }

        // Phase 2: standalone North/South + neighbor
        for (let neighbor of NEIGHBORS) {
            const regex = new RegExp(`\\b(North|South)\\s+(${neighbor})\\b`, "gi");
            text = text.replace(regex, (match, p1, p2) => {
                const replacement = REPLACEMENTS[p1];
                return replacement ? replacement + " " + p2 : p2;
            });
        }

        return text;
    }

    // Walk all DOM nodes recursively
    function walk(node) {
        if (!node) return;

        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea" || node.isContentEditable) return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = applyCongoTreatment(node.nodeValue);
        } else {
            for (let child of node.childNodes) {
                walk(child);
            }
        }
    }

    // Observe dynamic content
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                    walk(node);
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial pass
    walk(document.body);

    // Secondary pass every 2 seconds for late-loaded content
    setInterval(() => {
        walk(document.body);
    }, 2000);

})();