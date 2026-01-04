// ==UserScript==
// @name         Torn Market - Hot items
// @namespace    http://torn.com/
// @version      1.1
// @description  Works with Weav3rs Bazaar+TE info PC version
// @author       srsbsns
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560752/Torn%20Market%20-%20Hot%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/560752/Torn%20Market%20-%20Hot%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .ignite-deal {
            transition: all 0.2s ease-in !important;
            position: relative !important;
            z-index: 1 !important;
        }
        @keyframes heatPulse {
            from { filter: brightness(1); transform: scale(1); }
            to { filter: brightness(1.4); transform: scale(1.02); }
        }
    `);

    function getHeatColor(percent) {
        if (percent < 10) return "#ffff00"; // Yellow
        if (percent < 20) return "#ff8c00"; // Orange
        return "#ff0000";                   // Red
    }

    function applyHeat() {
        // Targets the specific format we saw in your Item Market screenshots
        const elements = document.querySelectorAll('span, div, p');

        elements.forEach(el => {
            const text = el.innerText.trim();
            // Target the pattern: -XX.X% (e.g., -94.1%)
            if (/^-\d+(\.\d+)?%$/.test(text)) {
                const percentage = Math.abs(parseFloat(text));

                if (percentage >= 3) {
                    const box = el.parentElement;
                    if (box) {
                        box.classList.add('ignite-deal');

                        const color = getHeatColor(percentage);
                        const glowSize = Math.min(percentage / 1.2, 35);
                        const intensity = percentage > 20 ? 0.8 : 0.5;

                        // Clear text style: thin border + external glow
                        box.style.border = `1px solid ${color}`;
                        box.style.boxShadow = `0 0 ${glowSize}px ${color}, inset 0 0 5px rgba(0,0,0,${intensity})`;

                        if (percentage > 25) {
                            box.style.animation = "heatPulse 0.6s infinite alternate";
                        } else {
                            box.style.animation = "none";
                        }
                    }
                }
            }
        });
    }

    setInterval(applyHeat, 400);
})();