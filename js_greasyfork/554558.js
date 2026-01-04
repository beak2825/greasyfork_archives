// ==UserScript==
// @name Finviz Elite Refresh Overhaul
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Adds custom refresh buttons to finviz's screener. Handles both populated and empty screener table structures to allow faster refreshing.
// @author Anthony_Creates
// @license MIT
// @match https://elite.finviz.com/screener.ashx*
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/554558/Finviz%20Elite%20Refresh%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/554558/Finviz%20Elite%20Refresh%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key for local storage to track if the user wants to hide the button
    const HIDE_BMAC_KEY = 'finvizBmacHiddenForever';

    function applyStoredInterval() {
        const currentUrl = new URL(window.location.href);
        const activeRefresh = currentUrl.searchParams.get('ar');
        const storedRefresh = localStorage.getItem('finvizRefreshInterval');
        if (!activeRefresh && storedRefresh) {
            currentUrl.searchParams.set('ar', storedRefresh);
            window.location.replace(currentUrl.href);
        }
    }

    function activateFastRefresh(interval) {
        if (typeof window.ScreenerRefreshInit === 'function') {
            window.ScreenerRefreshInit = function() { /* Do nothing */ };
        }
        if (window.myCustomRefreshTimerId) {
            clearInterval(window.myCustomRefreshTimerId);
        }

        if (typeof window.Refresh === 'function') {
             window.myCustomRefreshTimerId = setInterval(() => {
                 window.Refresh();
             }, interval);
        } else {
             window.myCustomRefreshTimerId = setInterval(() => {
                 if (typeof window.Refresh === 'function') {
                    window.Refresh();
                 }
             }, interval);
        }
    }

    function deactivateFastRefresh() {
        if (window.myCustomRefreshTimerId) {
            clearInterval(window.myCustomRefreshTimerId);
            window.myCustomRefreshTimerId = null;
        }
    }

    function rebuildButtons(container) {
        const allButtons = [
            { text: '0.5s', value: '0.5' }, { text: '1s', value: '1' },
            { text: '5s', value: '5' }, { text: '10s', value: '10' },
            { text: '1min', value: '60' }, { text: 'off', value: null }
        ];

        let buttonHolder = container.querySelector('span[style*="white-space: nowrap"]');
        if (!buttonHolder) {
            buttonHolder = document.createElement('span');
            buttonHolder.style.whiteSpace = 'nowrap';
            container.innerHTML = '';
            container.appendChild(buttonHolder);
        }

        buttonHolder.innerHTML = '';

        const currentUrl = new URL(window.location.href);
        const activeRefresh = currentUrl.searchParams.get('ar');
        const refreshTextSpan = document.createElement('span');
        refreshTextSpan.textContent = 'Refresh: ';
        refreshTextSpan.style.color = '#676F85';
        refreshTextSpan.style.fontWeight = 'bold';
        buttonHolder.appendChild(refreshTextSpan);

        allButtons.forEach((button, index) => {
            const link = document.createElement('a');
            link.className = 'tab-link';
            link.textContent = button.text;
            link.addEventListener('click', () => {
                if (button.value) {
                    localStorage.setItem('finvizRefreshInterval', button.value);
                } else {
                    localStorage.removeItem('finvizRefreshInterval');
                }
            });
            const url = new URL(window.location.href);
            if (button.value) {
                url.searchParams.set('ar', button.value);
            } else {
                url.searchParams.delete('ar');
            }
            link.href = url.href;
            const isActive = (button.value === activeRefresh) || (!button.value && !activeRefresh);
            if (isActive) {
                link.classList.add('font-bold');
            }
            buttonHolder.appendChild(link);
            if (index < allButtons.length - 1) {
                buttonHolder.appendChild(document.createTextNode(' | '));
            }
        });

        const refreshValue = currentUrl.searchParams.get('ar');
        if (refreshValue === '0.5') { activateFastRefresh(500); }
        else if (refreshValue === '1') { activateFastRefresh(1000); }
        else if (refreshValue === '5') { activateFastRefresh(5000); }
        else { deactivateFastRefresh(); }
    }

    function checkAndRebuild() {
        const container = document.querySelector('#screener-fullview-links, .fullview-links');

        if (container && !container.querySelector('a[href*="&ar=0.5"]')) {
            rebuildButtons(container);
        }
    }

    // --- NEW LOGIC FOR HIDE/POPUP ---

    // Function to set up the hiding logic and event listeners
    function setupHideLogic(bmacLink) {

        // 1. Create the main popup container (hidden by default)
        const modalId = 'bmac-hide-popup-modal';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.style.cssText = `
                display: none;
                position: fixed;
                z-index: 100000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.7);
            `;
            document.body.appendChild(modal);
        }

        // 2. Create the content box for the message and buttons
        const contentBox = document.createElement('div');
        contentBox.style.cssText = `
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            color: #333;
        `;

        // 3. Add the custom message (NOW PLAIN TEXT)
        const message = document.createElement('p');
        message.textContent = 'This is where you make a difference.Supporting my work here means you are actively sponsoring a new piece of original content. It gives me the freedom to experiment and take risks on new projects that I couldn\'t otherwise justify. You\'re not just buying a coffee; you\'re buying the next idea, the next hour of editing, and the freedom to create what I\'m truly passionate about. Let\'s build something new together.';
        message.style.cssText = 'line-height: 1.4; margin-bottom: 20px; font-size: 14px;';
        contentBox.appendChild(message);

        // 4. Add the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'text-align: right;';

        const bmacButton = document.createElement('a');
        bmacButton.href = 'https://buymeacoffee.com/anthonycreates';
        bmacButton.textContent = 'Buy me a coffee';
        bmacButton.target = '_blank';
        bmacButton.style.cssText = `
            text-decoration: none;
            color: #000;
            background-color: #FFDD00;
            padding: 8px 15px;
            border-radius: 4px;
            margin-left: 10px;
            font-weight: bold;
            display: inline-block;
        `;

        const hideButton = document.createElement('button');
        hideButton.textContent = 'Hide forever';
        hideButton.style.cssText = `
            background: #e0e0e0;
            color: #333;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;

        // Event listener for Hide forever
        hideButton.addEventListener('click', () => {
            localStorage.setItem(HIDE_BMAC_KEY, 'true');
            bmacLink.style.display = 'none'; // Hide the link immediately
            modal.style.display = 'none'; // Close the modal
        });

        // Event listener for the Buy Me a Coffee button
        bmacButton.addEventListener('click', () => {
            modal.style.display = 'none'; // Close the modal when clicked
        });

        buttonContainer.appendChild(hideButton);
        buttonContainer.appendChild(bmacButton);
        contentBox.appendChild(buttonContainer);
        modal.appendChild(contentBox);

        // 5. Add event listener to the Buy Me a Coffee link to show the modal
        bmacLink.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from navigating immediately
            modal.style.display = 'block';
        });

        // 6. Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    }


    function addBuyMeACoffeeLink() {
        // Check if the user has chosen to hide the button forever
        if (localStorage.getItem(HIDE_BMAC_KEY) === 'true') {
            return;
        }

        const myBmacUrl = 'https://buymeacoffee.com/anthonycreates';

        const bmacLink = document.createElement('a');
        bmacLink.href = myBmacUrl;
        bmacLink.textContent = '☕ Support My Work';
        bmacLink.target = '_blank';
        bmacLink.id = 'finviz-bmac-link';

        // Basic styling
        bmacLink.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 8px 12px;
            background: #FFDD00;
            color: #000;
            border-radius: 6px;
            text-decoration: none;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
        `;

        document.body.appendChild(bmacLink);

        // Setup the new hide logic
        setupHideLogic(bmacLink);
    }

    // --- Main Execution Block ---
    applyStoredInterval();
    addBuyMeACoffeeLink();

    const observer = new MutationObserver(checkAndRebuild);

    // Run once on start to catch the initial state.
    setTimeout(checkAndRebuild, 0);

    // Observe for any page changes Finviz makes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();