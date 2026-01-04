// ==UserScript==
// @name         Fix ChatGPT not loading in multiple tabs (due to Performance.measure Error)
// @namespace    12centuries
// @version      0.1
// @description  Fixes ChatGPT failing to load when you open several tabs. Some sessions crash because of bad `Performance.measure` calls used for analytics. This script safely overrides `Performance.measure`, skipping invalid calls so the site loads normally while leaving your experience unchanged. Fully commented; questions and feedback welcome.
// @author       12centuries
// @license      MIT
// @match        *://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555446/Fix%20ChatGPT%20not%20loading%20in%20multiple%20tabs%20%28due%20to%20Performancemeasure%20Error%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555446/Fix%20ChatGPT%20not%20loading%20in%20multiple%20tabs%20%28due%20to%20Performancemeasure%20Error%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the Performance.measure function
    if (window.performance && typeof window.performance.measure === 'function') {
        const originalMeasure = window.performance.measure;
        window.performance.measure = function(measureName, startMark, endMark) {
            try {
                // Check if the 'end' attribute (endMark) is negative
                // or any other condition that causes the specific TypeError
                if (typeof endMark === 'number' && endMark < 0) {
                    console.warn(`Userscript intercepted problematic Performance.measure call for: ${measureName}. End mark was negative.`);
                    return; // Skip the problematic call
                }
                // Call the original function if the values are valid
                originalMeasure.call(this, measureName, startMark, endMark);
            } catch (e) {
                if (e instanceof TypeError && e.message.includes('Given attribute end cannot be negative')) {
                    console.warn(`Userscript caught and suppressed TypeError in Performance.measure for: ${measureName}`);
                    // Suppress the error and continue
                } else {
                    throw e; // Re-throw other errors
                }
            }
        };
    }
})();
