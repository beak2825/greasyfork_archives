// ==UserScript==
// @name        Instacart SI Units
// @namespace   nikhilweee
// @match       https://www.instacart.com/*
// @grant       none
// @version     1.0
// @author      nikhilweee
// @description Standardize Instacart units to SI.
// @icon        https://www.instacart.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/557197/Instacart%20SI%20Units.user.js
// @updateURL https://update.greasyfork.org/scripts/557197/Instacart%20SI%20Units.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = {
        units: [
            {
                // Mass
                regex: /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)/gi,
                factor: 0.453592,
                unit: "kg"
            },
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:oz|ounces?)/gi,
                factor: 28.3495,
                unit: "g"
            },
            // Length
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:in|inches?|")/gi,
                factor: 2.54,
                unit: "cm"
            },
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:ft|feet|')/gi,
                factor: 0.3048,
                unit: "m"
            },
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:mi|miles?)/gi,
                factor: 1.60934,
                unit: "km"
            },
            // Volume (common in grocery)
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:gal|gallons?)/gi,
                factor: 3.78541,
                unit: "L"
            },
            {
                regex: /(\d+(?:\.\d+)?)\s*(?:fl\s*oz|fluid\s*ounces?)/gi,
                factor: 29.5735,
                unit: "mL"
            }
        ]
    };

    const SIUnits = {
        init() {
            this.observe();
            // Initial process with a slight delay to allow framework to render
            setTimeout(() => this.process(document.body), 1000);
        },

        process(root) {
            if (!root) return;

            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        // Skip script, style, etc.
                        const tag = node.parentNode.tagName;
                        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(tag)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (node.textContent.trim().length === 0) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // Avoid double processing
                        if (node.parentNode.dataset.siProcessed) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodes = [];
            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            nodes.forEach(node => this.convertNode(node));
        },

        convertNode(node) {
            let text = node.textContent;
            let changed = false;

            CONFIG.units.forEach(u => {
                text = text.replace(u.regex, (match, val, offset, string) => {
                    // Check if already followed by the conversion
                    const nextPart = string.slice(offset + match.length);
                    if (nextPart.trim().startsWith(`(${u.unit}`)) return match;

                    changed = true;
                    const num = parseFloat(val);
                    // Smart formatting: if > 1000g, use kg, etc? For now, stick to direct conversion
                    // Maybe round to reasonable decimals
                    let converted = num * u.factor;

                    // Formatting logic
                    if (u.unit === 'g' && converted >= 1000) {
                        converted = converted / 1000;
                        return `${match} (${converted.toFixed(2).replace(/\.00$/, '')} kg)`;
                    }
                    if (u.unit === 'mL' && converted >= 1000) {
                        converted = converted / 1000;
                        return `${match} (${converted.toFixed(2).replace(/\.00$/, '')} L)`;
                    }

                    return `${match} (${converted.toFixed(2).replace(/\.00$/, '')} ${u.unit})`;
                });
            });

            if (changed) {
                node.textContent = text;
            }
        },

        observe() {
            const mo = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType === Node.ELEMENT_NODE) {
                            this.process(n);
                        } else if (n.nodeType === Node.TEXT_NODE) {
                            this.convertNode(n);
                        }
                    });
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    };

    SIUnits.init();
})();
