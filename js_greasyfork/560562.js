// ==UserScript==
// @name         Torn Crimes - Pickpocketing Pro
// @version      2.9
// @author       car [3581510] & Korbrm [2931507]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1553591
// @description Automatically categorizes pickpocketing targets by difficulty, color-coding the text and borders to match risk levels, and applies a pulsing purple highlight to targets with available Unique Outcomes.
// @downloadURL https://update.greasyfork.org/scripts/560562/Torn%20Crimes%20-%20Pickpocketing%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560562/Torn%20Crimes%20-%20Pickpocketing%20Pro.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const UNIQUE_COLOR = "#9c36b5";
    const colors = {
        "Safe": "#37b24d", "Moderately Unsafe": "#74b816", "Unsafe": "#f59f00",
        "Risky": "#f76707", "Dangerous": "#f03e3e", "Very Dangerous": "#7048e8",
    };
 
    const groups = {
        "Safe": ["Drunk man", "Drunk woman", "Homeless person", "Junkie", "Elderly man", "Elderly woman"],
        "Moderately Unsafe": ["Classy lady", "Laborer", "Postal worker", "Young man", "Young woman", "Student"],
        "Unsafe": ["Rich kid", "Sex worker", "Thug"],
        "Risky": ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
        "Dangerous": ["Cyclist"],
        "Very Dangerous": ["Police officer"],
    };
 
    const style = document.createElement('style');
    style.textContent = `
        @keyframes purplePulse {
            0% { box-shadow: inset 0 0 10px #9c36b5; border-left: 6px solid #9c36b5; }
            100% { box-shadow: inset 0 0 10px #9c36b5; border-left: 6px solid #9c36b5; }
        }
        .is-unique-row { animation: purplePulse 2s infinite !important; padding-left: 5px !important; }
    `;
    document.head.appendChild(style);
 
    setInterval(() => {
        if (!window.location.hash.includes("/pickpocketing")) return;
 
        document.querySelectorAll('div[class^="titleAndProps"]').forEach(container => {
            const nameEl = container.querySelector('div');
            if (!nameEl) return;
 
            const originalText = nameEl.textContent.split(' (')[0].trim();
            const row = container.closest('li') || container.parentElement.parentElement.parentElement;
            const hasStar = row && row.querySelector('[style*="unique-outcome-star"]');
 
            for (const cat in groups) {
                if (groups[cat].some(g => originalText.includes(g))) {
                    nameEl.style.color = hasStar ? UNIQUE_COLOR : colors[cat];
 
                    if (!nameEl.textContent.includes(`(${cat})`)) {
                        nameEl.textContent = `${originalText} (${cat})`;
                    }
 
                    if (row) {
                        if (hasStar) {
                            row.classList.add('is-unique-row');
                        } else {
                            row.classList.remove('is-unique-row');
                            row.style.borderLeft = `4px solid ${colors[cat]}`;
                        }
                    }
                    break;
                }
            }
        });
    }, 500);
})();