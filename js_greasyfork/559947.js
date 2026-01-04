// ==UserScript==
// @name         Strava - Toggle Virtual Ride
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides Virtual Ride with the option to switch in the menu
// @author       Kamil Gadawski / Gemini
// @match        https://www.strava.com/dashboard*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559947/Strava%20-%20Toggle%20Virtual%20Ride.user.js
// @updateURL https://update.greasyfork.org/scripts/559947/Strava%20-%20Toggle%20Virtual%20Ride.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default state: hiding is enabled
    let isHidingEnabled = true;

    const hideVirtualRides = () => {
        const labels = document.querySelectorAll('div.B7rQ6');
        labels.forEach(label => {
            if (label.textContent.trim().includes('Virtual Ride')) {
                let container = label;
                for (let i = 0; i < 6; i++) {
                    if (container.parentElement) container = container.parentElement;
                }

                if (container) {
                    container.style.display = isHidingEnabled ? 'none' : '';
                }
            }
        });
    };

    // Function adding a switch to navigation
    const injectToggle = () => {
        const navGroup = document.querySelector('ul.user-nav.nav-group');
        if (!navGroup || document.getElementById('strava-virtual-toggle-li')) return;

        const li = document.createElement('li');
        li.id = 'strava-virtual-toggle-li';
        li.className = 'nav-item upgrade mr-sm';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.color = '#333';
        li.style.fontSize = '12px';
        li.style.cursor = 'pointer';
        li.innerHTML = `
            <div style="display: flex; align-items: center; background: #eee; padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc;">
                <input type="checkbox" id="strava-v-toggle" checked style="margin-right: 8px; cursor: pointer;">
                <label for="strava-v-toggle" style="margin: 0; cursor: pointer; font-weight: bold; color: #E34402;">Hide Virtual</label>
            </div>
        `;

        navGroup.prepend(li);

        document.getElementById('strava-v-toggle').addEventListener('change', (e) => {
            isHidingEnabled = e.target.checked;
            if (!isHidingEnabled) {
                const allPosts = document.querySelectorAll('div');
                hideVirtualRides();
            } else {
                hideVirtualRides();
            }
        });
    };
    const observer = new MutationObserver(() => {
        injectToggle();
        hideVirtualRides();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    injectToggle();
    hideVirtualRides();
})();