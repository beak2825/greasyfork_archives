// ==UserScript==
// @name         IMDb SeriesGraph Rating Colors
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Applies SeriesGraph rating color codes to IMDb episode heatmaps with a Toggleable Gradient Mode. Supports all IMDb languages.
// @author       Windy
// @match        https://www.imdb.com/title/*/ratings*
// @match        https://www.imdb.com/*/title/*/ratings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seriesgraph.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563779/IMDb%20SeriesGraph%20Rating%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/563779/IMDb%20SeriesGraph%20Rating%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const BLEND_CAP = 0.8;

    const COLOR_STOPS = [
        { val: 9.6, rgb: [29, 161, 242],  label: 'Absolute Cinema', text: '#ffffff', showInLegend: true },
        { val: 9.0, rgb: [24, 106, 59],   label: 'Awesome',         text: '#ffffff', showInLegend: true },
        { val: 8.0, rgb: [40, 180, 99],   label: 'Great',           text: '#2a2a2a', showInLegend: true },
        { val: 7.0, rgb: [244, 208, 63],  label: 'Good',            text: '#2a2a2a', showInLegend: true },
        { val: 6.0, rgb: [243, 156, 18],  label: 'Regular',         text: '#2a2a2a', showInLegend: true },
        { val: 5.0, rgb: [231, 76, 60],   label: 'Bad',             text: '#ffffff', showInLegend: true },
        { val: 4.0, rgb: [99, 57, 116],   label: 'Garbage',         text: '#ffffff', showInLegend: false }, // Math Anchor
        { val: 0.0, rgb: [99, 57, 116],   label: 'Garbage',         text: '#ffffff', showInLegend: true }
    ];

    const STORAGE_KEY = 'sg_gradient_mode_enabled';
    let isGradientMode = localStorage.getItem(STORAGE_KEY) === 'true';

    // --- CSS STYLES ---
    const STYLES = `
        #sg-legend-container {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 16px 0 24px 0;
            padding: 16px;
            align-items: center;
            justify-content: space-between;
            background: var(--ipt-on-base-alt-bg-color, rgba(0,0,0,0.03));
            border-radius: 12px;
            border: 1px solid var(--ipt-on-base-border-color, rgba(0,0,0,0.1));
            font-family: Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .sg-legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }
        .sg-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.3px;
            cursor: help;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            text-shadow: 0 1px 1px rgba(0,0,0,0.1);
            user-select: none;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .sg-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.25);
            z-index: 1;
        }
        /* Aesthetic Rating Cell */
        .sg-rating-cell {
            border-radius: 4px !important;
            /* Subtle glass shine effect */
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.1);
            transition: background-color 0.2s ease;
        }
        .sg-rating-text {
            font-weight: 600;
            /* Text shadow improves readability on gradients */
            text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        /* Switch Styles */
        .sg-toggle-wrapper { display: flex; align-items: center; gap: 10px; }
        .sg-toggle-label { font-size: 13px; font-weight: 600; cursor: pointer; user-select: none; color: var(--ipt-on-base-textPrimary-color, inherit); }
        .sg-switch { position: relative; display: inline-block; width: 42px; height: 24px; }
        .sg-switch input { opacity: 0; width: 0; height: 0; }
        .sg-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 24px; }
        .sg-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        input:checked + .sg-slider { background-color: #f5c518; }
        input:checked + .sg-slider:before { transform: translateX(18px); }
    `;

    // --- HELPER FUNCTIONS ---

    function rgbToString(rgb) {
        return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
    }

    function blendColors(color1, color2, percentage) {
        const p = percentage;
        const w = 1 - p;

        const r = Math.sqrt((w * (color1[0] ** 2)) + (p * (color2[0] ** 2)));
        const g = Math.sqrt((w * (color1[1] ** 2)) + (p * (color2[1] ** 2)));
        const b = Math.sqrt((w * (color1[2] ** 2)) + (p * (color2[2] ** 2)));

        return [r, g, b];
    }

    function getBinStyle(rating) {
        for (const stop of COLOR_STOPS) {
            if (!stop.showInLegend && stop.val === 4.0) continue;
            if (rating >= stop.val) {
                return { bg: rgbToString(stop.rgb), text: stop.text };
            }
        }
        return { bg: rgbToString(COLOR_STOPS[COLOR_STOPS.length-1].rgb), text: '#ffffff' };
    }

    function getGradientStyle(rating) {
        if (rating >= COLOR_STOPS[0].val) return { bg: rgbToString(COLOR_STOPS[0].rgb), text: COLOR_STOPS[0].text };
        if (rating <= COLOR_STOPS[COLOR_STOPS.length - 1].val) return { bg: rgbToString(COLOR_STOPS[COLOR_STOPS.length - 1].rgb), text: COLOR_STOPS[COLOR_STOPS.length - 1].text };

        for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
            const upper = COLOR_STOPS[i];
            const lower = COLOR_STOPS[i+1];

            if (rating < upper.val && rating >= lower.val) {
                const range = upper.val - lower.val;
                const rawProgress = (range === 0) ? 0 : (rating - lower.val) / range;

                // Scale the progress based on BLEND_CAP
                const weightedProgress = rawProgress * BLEND_CAP;

                // Use Gamma Corrected Blending for vibrant output
                const finalRgb = blendColors(lower.rgb, upper.rgb, weightedProgress);

                return {
                    bg: rgbToString(finalRgb),
                    // Strict text color inheritance based on the tier the rating falls into (lower.text)
                    text: lower.text
                };
            }
        }
    }

    function getStyleForRating(rating) {
        return isGradientMode ? getGradientStyle(rating) : getBinStyle(rating);
    }

    // --- UI INJECTION ---

    function injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = STYLES;
        document.head.appendChild(styleEl);
    }

    function injectUI() {
        if (document.getElementById('sg-legend-container')) return;

        const targetContainer = document.querySelector('[data-testid="heatmap__root-element"]')
                             || document.querySelector('.ipc-chip-list');

        if (!targetContainer) return;

        const container = document.createElement('div');
        container.id = 'sg-legend-container';

        const legendWrapper = document.createElement('div');
        legendWrapper.className = 'sg-legend-items';

        COLOR_STOPS.forEach(cat => {
            if (!cat.showInLegend) return;

            const item = document.createElement('div');
            item.className = 'sg-badge';
            item.style.backgroundColor = rgbToString(cat.rgb);
            item.style.color = cat.text;
            item.innerText = cat.label;

            let max = (cat.val === 9.6) ? 10.0 : (cat.val + 0.9).toFixed(1);
            if (cat.val === 9.0) max = 9.5;
            if (cat.val === 5.0) max = 5.9;
            if (cat.val === 0.0) max = 4.9;
            item.title = `${cat.val} - ${max}`;

            legendWrapper.appendChild(item);
        });

        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'sg-toggle-wrapper';

        const label = document.createElement('label');
        label.className = 'sg-toggle-label';
        label.innerText = "Gradient Mode";
        label.setAttribute('for', 'sg-gradient-toggle');

        const switchLabel = document.createElement('label');
        switchLabel.className = 'sg-switch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'sg-gradient-toggle';
        checkbox.checked = isGradientMode;

        const slider = document.createElement('span');
        slider.className = 'sg-slider';

        checkbox.addEventListener('change', (e) => {
            isGradientMode = e.target.checked;
            localStorage.setItem(STORAGE_KEY, isGradientMode);
            applyColors();
        });

        switchLabel.appendChild(checkbox);
        switchLabel.appendChild(slider);
        toggleWrapper.appendChild(label);
        toggleWrapper.appendChild(switchLabel);

        container.appendChild(legendWrapper);
        container.appendChild(toggleWrapper);

        if(targetContainer.parentNode) {
            targetContainer.parentNode.insertBefore(container, targetContainer);
        }
    }

    function applyColors() {
        const ratingCells = document.querySelectorAll('td.ratings-heatmap__table-data > div');
        ratingCells.forEach(cell => {
            const anchor = cell.querySelector('a');
            if (anchor) {
                // Support both dot (8.5) and comma (8,5) decimal formats for international support
                const normalizedRating = anchor.innerText.replace(',', '.');
                const ratingValue = parseFloat(normalizedRating);

                if (!isNaN(ratingValue)) {
                    const style = getStyleForRating(ratingValue);

                    // Add the aesthetic class
                    cell.classList.add('sg-rating-cell');
                    cell.style.backgroundColor = style.bg;

                    // Style the anchor text
                    anchor.classList.add('sg-rating-text');
                    anchor.style.color = style.text;
                }
            }
        });
    }

    function run() {
        injectStyles();
        injectUI();
        applyColors();
    }

    // Run initially
    run();

    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            injectUI();
            applyColors();
        }
    });

    const targetNode = document.querySelector('body');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

})();