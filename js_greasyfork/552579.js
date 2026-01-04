// ==UserScript==
// @name         WAMS Panorama
// @author       @NOWARATN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wait for page load, dismiss alerts, sort by Return Rate, auto-navigate pages and hide specific elements
// @match        https://wams.amazon.dev/sites/KTW1/compliance*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552579/WAMS%20Panorama.user.js
// @updateURL https://update.greasyfork.org/scripts/552579/WAMS%20Panorama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let PAGE_CHANGE_INTERVAL = GM_getValue('interval', 30); // Domyślnie 30 sekund

    function createConfigMenu() {
        const targetElement = document.querySelector('div[mdn-text] > div[mdn-tile-children]').parentElement.parentElement.parentElement;
        if (!targetElement) return;

        const menuDiv = document.createElement('div');
        menuDiv.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 12px;
        `;

        const content = `
            <div style="margin-bottom: 5px;">
                <label style="display: block; margin-bottom: 3px;">Interwał (s):</label>
                <input type="number" id="intervalInput" value="${PAGE_CHANGE_INTERVAL}"
                    style="width: 100%; padding: 3px; margin-bottom: 3px; border: 1px solid #ddd; border-radius: 3px;">
            </div>
            <button id="saveConfig" style="
                background-color: #0073bb;
                color: white;
                border: none;
                padding: 3px 6px;
                border-radius: 3px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 5px;
                font-size: 11px;">
                Zapisz i odśwież
            </button>
            <div style="
                font-size: 10px;
                color: #666;
                text-align: right;
                font-style: italic;">
                @NOWARATN
            </div>
        `;

        menuDiv.innerHTML = content;
        targetElement.style.position = 'relative';
        targetElement.appendChild(menuDiv);

        document.getElementById('saveConfig').addEventListener('click', () => {
            const newInterval = parseInt(document.getElementById('intervalInput').value);
            if (newInterval && newInterval > 0) {
                GM_setValue('interval', newInterval);
                loadNewTimeRange();
            }
        });
    }

    function getNewTimeRange() {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 7);

        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    }

    function loadNewTimeRange() {
        const baseUrl = 'https://wams.amazon.dev/sites/KTW1/compliance';
        const { start, end } = getNewTimeRange();
        const newUrl = `${baseUrl}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
        window.location.href = newUrl;
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function hideElements() {
        const ulElement = document.querySelector('ul');
        if (ulElement) {
            ulElement.style.display = 'none';
        }

        const actionBar = document.querySelector('div[mdn-action-bar]');
        if (actionBar) {
            actionBar.style.display = 'none';
        }
    }

    async function dismissAlerts() {
        const dismissButtons = document.querySelectorAll('button[aria-label="Dismiss"]');
        for (const button of dismissButtons) {
            button.click();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async function sortByReturnRate() {
        const buttons = document.querySelectorAll('button');
        let returnRateButton;

        for (const button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent.trim() === 'Return Rate') {
                returnRateButton = button;
                break;
            }
        }

        if (returnRateButton) {
            returnRateButton.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            const currentSort = returnRateButton.parentElement.getAttribute('aria-sort');
            if (currentSort !== 'descending') {
                returnRateButton.click();
            }
        }
    }

    function goToNextPage() {
        const currentPageButtons = document.querySelectorAll('button[aria-current="page"]');
        const currentPageButton = currentPageButtons[currentPageButtons.length - 1];

        if (currentPageButton) {
            const currentPage = parseInt(currentPageButton.textContent);
            const nextPageButton = document.querySelector(`button[aria-label="Go to page ${currentPage + 1}"]`);
            if (nextPageButton) {
                nextPageButton.click();
                return true;
            } else {
                // Jeśli nie ma następnej strony, załaduj nowy zakres dat
                loadNewTimeRange();
                return false;
            }
        }
        return false;
    }

    async function main() {
        await waitForElement('div[mdn-text] > div[mdn-tile-children]');
        createConfigMenu();
        hideElements();
        await dismissAlerts();
        await sortByReturnRate();

        setInterval(() => {
            goToNextPage();
        }, PAGE_CHANGE_INTERVAL * 1000); // Konwersja sekund na milisekundy
    }

    main();
})();
