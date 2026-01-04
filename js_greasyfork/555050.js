// ==UserScript==
// @name         Metric Converter
// @namespace    https://violentmonkey.github.io/
// @version      1.2
// @description  Converts US/Imperial units to SI/Metric on visible text only, rounding metric values to 2 decimals.
// @author       Alyssa B. Morton
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555050/Metric%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/555050/Metric%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: round to 2 decimal places
    function round(n) {
        return Math.round(n * 100) / 100;
    }

    // Conversion functions
    const conversions = [
        { regex: /(\d+(?:\.\d+)?)\s?(inch|inches|in)\b/gi, convert: n => `${n} in【${round(n*0.0254)} m】` },
        { regex: /(\d+(?:\.\d+)?)\s?(foot|feet|ft)\b/gi, convert: n => `${n} ft【${round(n*0.3048)} m】` },
        { regex: /(\d+(?:\.\d+)?)\s?(yard|yd)\b/gi, convert: n => `${n} yd【${round(n*0.9144)} m】` },
        { regex: /(\d+(?:\.\d+)?)\s?(mile|mi)\b/gi, convert: n => `${n} mi【${round(n*1.60934)} km】` },

        { regex: /(\d+(?:\.\d+)?)\s?(pound|lbs|lb)\b/gi, convert: n => `${n} lb【${round(n*0.453592)} kg】` },
        { regex: /(\d+(?:\.\d+)?)\s?(ounce|oz)\b/gi, convert: n => `${n} oz【${round(n*0.0283495)} kg】` },
        { regex: /(\d+(?:\.\d+)?)\s?(stone|st)\b/gi, convert: n => `${n} st【${round(n*6.35029)} kg】` },

        { regex: /(\d+(?:\.\d+)?)\s?(gallon|gal)\b/gi, convert: n => `${n} gal【${round(n*3.78541)} L】` },
        { regex: /(\d+(?:\.\d+)?)\s?(quart|qt)\b/gi, convert: n => `${n} qt【${round(n*0.946353)} L】` },
        { regex: /(\d+(?:\.\d+)?)\s?(pint|pt)\b/gi, convert: n => `${n} pt【${round(n*0.473176)} L】` },
        { regex: /(\d+(?:\.\d+)?)\s?(fluid ounce|fl oz)\b/gi, convert: n => `${n} fl oz【${round(n*0.0295735)} L】` },
        { regex: /(\d+(?:\.\d+)?)\s?cup\b/gi, convert: n => `${n} cup【${round(n*0.24)} L】` },

        { regex: /(\d+(?:\.\d+)?)\s?mpg\b/gi, convert: n => `${n} mpg【${round(235.214 / n)} L/100 km】` },
        { regex: /(\d+(?:\.\d+)?)\s?mph\b/gi, convert: n => `${n} mph【${round(n*1.60934)} km/h】` },

        { regex: /(\d+(?:\.\d+)?)\s?°F\b/gi, convert: n => `${n}°F【${round((n-32)*5/9)}°C】` },

        // Area
        { regex: /(\d+(?:\.\d+)?)\s?(sq\. ft|ft²)/gi, convert: n => `${n} ${RegExp.$2}【${round(n*0.092903)} m²】` },
        { regex: /(\d+(?:\.\d+)?)\s?(sq\. yd|yd²)/gi, convert: n => `${n} ${RegExp.$2}【${round(n*0.836127)} m²】` },

        // Volume
        { regex: /(\d+(?:\.\d+)?)\s?(cu\. ft|ft³)/gi, convert: n => `${n} ${RegExp.$2}【${round(n*0.0283168)} m³】` },
        { regex: /(\d+(?:\.\d+)?)\s?(cu\. in|in³)/gi, convert: n => `${n} ${RegExp.$2}【${round(n*0.0000163871)} m³】` },
    ];

    // Walk through visible text nodes only
    function walkVisible(node) {
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(n) {
                    // Ignore empty text, scripts, styles, inputs, textareas, links
                    if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = n.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const ignoredTags = ['SCRIPT','STYLE','TEXTAREA','INPUT','CODE','A'];
                    if (ignoredTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let n;
        while(n = walker.nextNode()) {
            handleText(n);
        }
    }

    // Replace text with converted units
    function handleText(textNode) {
        let text = textNode.nodeValue;
        conversions.forEach(item => {
            text = text.replace(item.regex, (match, value) => {
                const num = parseFloat(value);
                if (isNaN(num)) return match;
                return item.convert(num);
            });
        });
        textNode.nodeValue = text;
    }

    // Run on page
    walkVisible(document.body);

})();
