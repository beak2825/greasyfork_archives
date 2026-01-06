// ==UserScript==
// @name         Amazon Variations Bought in Past Month Aggregator (v0.4 - Final)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Accurately sums "bought in past month" across all variations using current 2026 Amazon layout.
// @author       Grok
// @license MIT
// @match        *://*.amazon.com/*
// @match        *://*.amazon.ca/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.de/*
// @match        *://*.amazon.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561514/Amazon%20Variations%20Bought%20in%20Past%20Month%20Aggregator%20%28v04%20-%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561514/Amazon%20Variations%20Bought%20in%20Past%20Month%20Aggregator%20%28v04%20-%20Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Parse "10K+ bought in past month", "2,000+ bought in past month", etc.
    function parseBoughtText(text) {
        if (!text) return 0;
        const match = text.trim().match(/([\d,]+)([KMB]?)(\+?)\s*bought\s+in\s+past\s+month/i);
        if (!match) return 0;
        let num = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2].toUpperCase();
        if (unit === 'K') num *= 1000;
        else if (unit === 'M') num *= 1000000;
        else if (unit === 'B') num *= 1000000000;
        return num;
    }

    // Find the exact badge element based on your output
    function getBoughtBadge() {
        return document.querySelector('span.a-size-small.social-proofing-faceout-title-text.social-proofing-faceout-cx-enhancement-T2');
    }

    // Get all available variation options (swatches or dropdown items)
    function getVariationOptions() {
        // Common selectors for color/size/style swatches in 2026 layout
        const selectors = [
            '#twister ul li.a-declarative:not(.a-button-disabled)',
            '#twister .swatch-list li:not(.unavailable)',
            '.dimension-swatch li',
            '#variation_color_name li',
            '#variation_size_name li',
            '#variation_style_name li'
        ];
        const all = new Set();
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => all.add(el));
        });
        return Array.from(all).filter(el => {
            // Filter out unavailable/disabled
            return !el.classList.contains('a-button-disabled') &&
                   !el.classList.contains('unavailable') &&
                   !el.ariaDisabled;
        });
    }

    let totalBought = 0;
    let processedCount = 0;
    let options = [];
    let originalSelection = null;

    function restoreOriginal() {
        if (originalSelection) {
            const clickEl = originalSelection.querySelector('a, span, img, div') || originalSelection;
            clickEl.click();
        }
    }

    function displayTotal() {
        const badge = getBoughtBadge();
        if (!badge) return;

        // Remove previous total if exists
        const old = document.getElementById('aggregated-bought-total');
        if (old) old.remove();

        const totalEl = document.createElement('div');
        totalEl.id = 'aggregated-bought-total';
        totalEl.style.fontWeight = 'bold';
        totalEl.style.color = '#B12704';
        totalEl.style.fontSize = '16px';
        totalEl.style.marginTop = '12px';
        totalEl.style.padding = '8px';
        totalEl.style.backgroundColor = '#fff8e1';
        totalEl.style.borderRadius = '4px';
        totalEl.style.textAlign = 'center';
        totalEl.innerText = `Total across all variations: ${totalBought.toLocaleString()}+ bought in past month`;

        // Insert right below the social proof section
        const container = badge.closest('div.a-section.social-proofing-faceout-title');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(totalEl, container.nextSibling);
        }
    }

    function waitForBadgeUpdate(callback, maxWait = 6000) {
        const start = Date.now();
        const check = () => {
            const badge = getBoughtBadge();
            if (badge && badge.innerText.trim()) {
                callback(badge.innerText.trim());
            } else if (Date.now() - start < maxWait) {
                requestAnimationFrame(check);
            } else {
                callback(null);
            }
        };
        check();
    }

    function processNext() {
        if (processedCount >= options.length) {
            displayTotal();
            restoreOriginal();
            console.log(`Aggregation complete! Total: ${totalBought}+`);
            return;
        }

        const option = options[processedCount];
        const clickTarget = option.querySelector('a, span, img, div[role="button"]') || option;
        clickTarget.click();

        waitForBadgeUpdate((text) => {
            if (text && /bought in past month/i.test(text)) {
                const value = parseBoughtText(text);
                totalBought += value;
                console.log(`Variation ${processedCount + 1}/${options.length}: ${text} → +${value.toLocaleString()}`);
            } else {
                console.log(`Variation ${processedCount + 1}/${options.length}: No sales data`);
            }
            processedCount++;
            setTimeout(processNext, 700); // Safe delay between switches
        });
    }

    // Start after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            const badge = getBoughtBadge();
            if (!badge) {
                console.log('No "bought in past month" badge found on this page.');
                return;
            }

            options = getVariationOptions();
            if (options.length < 2) {
                console.log('Only one or no variations found — nothing to aggregate.');
                return;
            }

            // Save current selection
            originalSelection = document.querySelector('#twister ul li.selected, .swatch-selected, .a-button-selected');

            // Process current variation first
            const initialText = badge.innerText.trim();
            if (/bought in past month/i.test(initialText)) {
                totalBought += parseBoughtText(initialText);
                console.log(`Current variation: ${initialText}`);
            }
            processedCount = 1;

            console.log(`Found ${options.length} variations. Starting aggregation...`);
            processNext();

        }, 2500); // Extra time for dynamic content to load
    });
})();