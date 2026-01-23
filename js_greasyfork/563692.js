// ==UserScript==
// @name         Finviz Elite Refresh Overhaul
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds custom refresh buttons to finviz's screener. Handles both populated and empty screener table structures to allow faster refreshing.
// @author       Game Abuse Studios
// @match        https://elite.finviz.com/screener.ashx*
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563692/Finviz%20Elite%20Refresh%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/563692/Finviz%20Elite%20Refresh%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CRITICAL PRE-FLIGHT CHECK ---
    // As requested: If the URL is the bare "screener.ashx" (or missing the refresh param),
    // force a redirect with parameters BEFORE running any other logic.
    const currentUrl = new URL(window.location.href);

    // Check if we are on the screener but missing the 'ar' (auto-refresh) parameter
    if (currentUrl.pathname === '/screener.ashx' && !currentUrl.searchParams.has('ar')) {

        // 1. Ensure 'v' (View) parameter exists. Default to '111' (Overview) if missing.
        if (!currentUrl.searchParams.has('v')) {
            currentUrl.searchParams.set('v', '111');
        }

        // 2. Determine the Refresh Interval ('ar').
        // Check local storage first to respect user's last choice.
        const storedRefresh = localStorage.getItem('finvizRefreshInterval');
        // Default to '60' (1 minute) if nothing is stored, to prevent the freeze safely.
        const defaultRefresh = '60';

        currentUrl.searchParams.set('ar', storedRefresh || defaultRefresh);

        // 3. Redirect and STOP execution immediately.
        window.location.replace(currentUrl.href);
        return; // <--- This prevents the rest of the script from running on the "bad" URL
    }

    // =========================================================
    // If we passed the check above, the URL is safe.
    // Proceed with the rest of the script functions.
    // =========================================================

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

    // --- Main Execution Block ---

    const observer = new MutationObserver(checkAndRebuild);

    // Run once on start to catch the initial state.
    setTimeout(checkAndRebuild, 0);

    // Observe for any page changes Finviz makes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();