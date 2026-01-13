// ==UserScript==
// @name         OGS Game History Width Expander & Activity Toggle v2
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Expands Game History width and adds a collapsible toggle for the Activity section on online-go.com
// @author       Gemini
// @match        https://online-go.com/player/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562402/OGS%20Game%20History%20Width%20Expander%20%20Activity%20Toggle%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/562402/OGS%20Game%20History%20Width%20Expander%20%20Activity%20Toggle%20v2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function expandGameHistory() {
        // Find columns and expand width for Game History
        const cols = document.querySelectorAll('div.col-sm-12');
        cols.forEach(div => {
            const header = div.querySelector('h2, h3, .header');
            if (header && header.textContent.includes('Game History')) {
                // Expansion logic
                div.style.width = '150%';
                div.style.maxWidth = '150%';
                div.style.flex = '0 0 150%';
 
                // Add the 100px gap here
                div.style.marginTop = '100px';
 
                if (div.parentElement) {
                    div.parentElement.style.overflow = 'visible';
                }
            }
        });
    }
 
    function addActivityToggle() {
        // Broad search for any element that looks like a header for "Activity"
        const potentialHeaders = document.querySelectorAll('h2, h3, div[class*="header"]');
 
        potentialHeaders.forEach(header => {
            if (header.textContent.trim().startsWith('Activity') && !header.querySelector('.activity-toggle')) {
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.cursor = 'pointer';
 
                const toggle = document.createElement('span');
                toggle.className = 'activity-toggle';
                toggle.textContent = ' (Show/Hide)';
                toggle.style.color = '#337ab7'; // OGS blue
                toggle.style.fontWeight = 'bold';
                header.appendChild(toggle);
 
                header.onclick = (e) => {
                    e.stopPropagation();
                    // Toggle visibility of the container immediately following this header
                    let container = header.nextElementSibling;
                    if (container) {
                        container.style.display = (container.style.display === 'none') ? 'block' : 'none';
                    }
                };
            }
        });
    }
 
    function run() {
        expandGameHistory();
        addActivityToggle();
    }
 
    // Run immediately and then on every DOM change to catch late-loading elements
    run();
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
 
})();