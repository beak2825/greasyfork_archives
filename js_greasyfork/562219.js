// ==UserScript==
// @name         OGS Game History Widener and Spacer
// @namespace    http://tampermonkey.net/
// @version      11.4
// @description  Precisely calculates the required gap to place Game History 10px below Activity.
// @author       Gemini
// @match        https://online-go.com/player/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562402/OGS%20Game%20History%20Widener%20and%20Spacer.user.js
// @updateURL https://update.greasyfork.org/scripts/562402/OGS%20Game%20History%20Widener%20and%20Spacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adjustLayout() {
        const activityCard = document.querySelector('.activity-card');
        const activityHeader = document.querySelector('h2'); // Anchor for the 'Activity' title
        const gameHistoryCols = document.querySelectorAll('div.col-sm-12');

        gameHistoryCols.forEach(div => {
            const header = div.querySelector('h2, h3, .header');
            if (header && header.textContent.includes('Game History')) {

                // 1. Core Expansion
                div.style.width = '150%';
                div.style.maxWidth = '150%';
                div.style.flex = '0 0 150%';
                div.style.marginTop = '0px';

                // 2. Manage the Spacer
                let spacer = div.querySelector('#ogs-vertical-spacer');
                if (!spacer) {
                    spacer = document.createElement('div');
                    spacer.id = 'ogs-vertical-spacer';
                    div.insertBefore(spacer, div.firstChild);
                }

                // 3. Precision Height Calculation
                // We want to find where the sidebar ends relative to where the History box starts
                const historyTop = div.getBoundingClientRect().top;
                let clearanceNeeded = 0;

                if (activityCard && activityCard.style.display !== 'none') {
                    const cardBottom = activityCard.getBoundingClientRect().bottom;
                    clearanceNeeded = cardBottom - historyTop + 10;
                } else if (activityHeader) {
                    // If card is hidden, align 10px below the "Activity" header text
                    const headerBottom = activityHeader.getBoundingClientRect().bottom;
                    clearanceNeeded = headerBottom - historyTop + 10;
                }

                // Apply height, ensuring we don't use negative values
                spacer.style.height = Math.max(0, clearanceNeeded) + 'px';

                if (div.parentElement) {
                    div.parentElement.style.overflow = 'visible';
                }
            }
        });

        // 4. Activity Toggle Logic
        const headers = document.querySelectorAll('h2');
        headers.forEach(h2 => {
            if (h2.textContent.trim().startsWith('Activity') && !h2.querySelector('.toggle-link')) {

                h2.style.display = 'flex';
                h2.style.justifyContent = 'space-between';
                h2.style.alignItems = 'center';

                const toggle = document.createElement('span');
                toggle.className = 'toggle-link';
                toggle.textContent = '(Hide)';
                toggle.style.fontSize = '14px';
                toggle.style.color = '#337ab7';
                toggle.style.cursor = 'pointer';

                toggle.onclick = (e) => {
                    e.stopPropagation();
                    const sidebar = h2.closest('.col-sm-4');
                    if (!sidebar) return;

                    const isCurrentlyHidden = toggle.textContent.includes('Show');

                    Array.from(sidebar.children).forEach(child => {
                        if (child !== h2) {
                            child.style.display = isCurrentlyHidden ? 'block' : 'none';
                        }
                    });

                    toggle.textContent = isCurrentlyHidden ? '(Hide)' : '(Show)';

                    // Small delay to allow the card to vanish/appear before measuring height
                    setTimeout(adjustLayout, 50);
                };

                h2.appendChild(toggle);
            }
        });
    }

    const observer = new MutationObserver(() => adjustLayout());
    observer.observe(document.body, { childList: true, subtree: true });

    adjustLayout();
})();