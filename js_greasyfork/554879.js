// ==UserScript==
// @name         IronwoodRPG - Rainbow Snow
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a toggle on the profile page to make the snow rainbow-colored
// @match        https://ironwoodrpg.com/*
// @author       Rivea
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554879/IronwoodRPG%20-%20Rainbow%20Snow.user.js
// @updateURL https://update.greasyfork.org/scripts/554879/IronwoodRPG%20-%20Rainbow%20Snow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myCss = `
        @keyframes rainbow-shadow {
          0%   { filter: drop-shadow(0 0 4px #ff0000) drop-shadow(0 0 2px #ff0000); }
          17%  { filter: drop-shadow(0 0 4px #ffff00) drop-shadow(0 0 2px #ffff00); }
          33%  { filter: drop-shadow(0 0 4px #00ff00) drop-shadow(0 0 2px #00ff00); }
          50%  { filter: drop-shadow(0 0 4px #00ffff) drop-shadow(0 0 2px #00ffff); }
          67%  { filter: drop-shadow(0 0 4px #0000ff) drop-shadow(0 0 2px #0000ff); }
          83%  { filter: drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 2px #ff00ff); }
          100% { filter: drop-shadow(0 0 4px #ff0000) drop-shadow(0 0 2px #ff0000); }
        }

        snow-component canvas {
          animation: rainbow-shadow 5s linear infinite;
        }
    `;

    let styleElement = null;

    const STORAGE_KEY = 'rainbowSnowEnabled';

    function enableRainbow() {
        if (!styleElement) {
            styleElement = GM_addStyle(myCss);
        }
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch (e) {
            console.error('UserScript Error: Could not save to localStorage.', e);
        }
    }

    function disableRainbow() {
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
        }
        try {
            localStorage.setItem(STORAGE_KEY, 'false');
        } catch (e) {
            console.error('UserScript Error: Could not save to localStorage.', e);
        }
    }

    function injectUIToggle() {
        const observer = new MutationObserver((mutations, obs) => {
            const allRows = document.querySelectorAll('div.row');
            let snowyWeatherRow = null;
            allRows.forEach(row => {
                const nameDiv = row.querySelector('div.name');
                if (nameDiv && nameDiv.textContent.includes('Snowy Weather')) { // Changed from "Snow Effect"
                    snowyWeatherRow = row;
                }
            });

            if (snowyWeatherRow && !document.getElementById('rainbow-snow-row')) {
                obs.disconnect();

                const ngAttr = snowyWeatherRow.getAttributeNames().find(name => name.startsWith('_ngcontent-'));
                if (!ngAttr) {
                    console.error('UserScript Error: Could not find Angular attribute.');
                    return;
                }

                const originalIconHTML = snowyWeatherRow.querySelector('div.icon').innerHTML;
                const iconDiv = document.createElement('div');
                iconDiv.className = 'icon';
                iconDiv.innerHTML = originalIconHTML;
                iconDiv.setAttribute(ngAttr, '');

                const nameDiv = document.createElement('div');
                nameDiv.className = 'name';
                nameDiv.textContent = 'Make it Rainbow';
                nameDiv.setAttribute(ngAttr, '');

                const svgUnchecked = `
                    <svg ${ngAttr} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="primary ng-star-inserted">
                        <path ${ngAttr} stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <rect ${ngAttr} x="4" y="4" width="16" height="16" rx="2"></rect>
                    </svg>`;

                const svgChecked = `
                    <svg ${ngAttr} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="primary ng-star-inserted">
                        <path ${ngAttr} stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <rect ${ngAttr} x="4" y="4" width="16" height="16" rx="2"></rect>
                        <path ${ngAttr} d="M9 12l2 2l4 -4"></path>
                    </svg>`;

                const checkboxButton = document.createElement('button');
                checkboxButton.setAttribute(ngAttr, '');
                checkboxButton.type = 'button';
                checkboxButton.className = 'ng-star-inserted';

                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox';
                checkboxDiv.setAttribute(ngAttr, ''); // Add attribute
                checkboxDiv.appendChild(checkboxButton);

                const newRow = document.createElement('div');
                newRow.className = 'row';
                newRow.id = 'rainbow-snow-row'; // ID to prevent duplicate injection
                newRow.setAttribute(ngAttr, '');
                newRow.appendChild(iconDiv);
                newRow.appendChild(nameDiv);
                newRow.appendChild(checkboxDiv);

                let isEnabled = localStorage.getItem(STORAGE_KEY) === 'true';

                function updateVisuals() {
                    if (isEnabled) {
                        checkboxButton.innerHTML = svgChecked;
                        enableRainbow();
                    } else {
                        checkboxButton.innerHTML = svgUnchecked;
                        disableRainbow();
                    }
                }

                checkboxButton.addEventListener('click', () => {
                    isEnabled = !isEnabled;
                    updateVisuals();
                });

                updateVisuals();

                snowyWeatherRow.insertAdjacentElement('afterend', newRow);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        enableRainbow();
    }

    if (window.location.pathname.includes('/profile')) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            injectUIToggle();
        } else {
            window.addEventListener('DOMContentLoaded', injectUIToggle);
        }
    }
})();
