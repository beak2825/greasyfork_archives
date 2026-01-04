// ==UserScript==
// @name         SharmZ Bazaar Display
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Shows accurate bazaar worth and lifetime customer count from personal stats
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554626/SharmZ%20Bazaar%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/554626/SharmZ%20Bazaar%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION - YOU MUST SET YOUR API KEY BELOW
    const API_KEY = ''; // <<-- REPLACE WITH YOUR TORN API KEY
    const API_BASE = 'https://api.torn.com/user/?selections=bazaar,personalstats&key=';
    const UPDATE_INTERVAL = 300000; // 5 minutes

    // Create status box
    function createStatusBox() {
        const box = document.createElement('div');
        box.id = 'torn-bazaar-status';
        Object.assign(box.style, {
            position: 'fixed',
            top: '15px',
            left: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#4dff88',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #4dff88',
            fontSize: '14px',
            fontFamily: 'monospace',
            zIndex: '99999',
            boxShadow: '0 0 10px rgba(77, 255, 136, 0.3)',
            maxWidth: '280px',
            lineHeight: '1.4'
        });
        return box;
    }

    // Update data from Torn API
    function updateBazaarData() {
        if (!API_KEY) {
            console.error('Torn Bazaar Monitor: API key not configured!');
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: API_BASE + API_KEY,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error('Torn API error:', data.error);
                        return;
                    }

                    // Calculate bazaar status
                    const bazaarStatus = data.bazaar && data.bazaar.length > 0 ? 'OPEN' : 'CLOSED';

                    // Calculate BAZAAR TOTAL WORTH (only active listings)
                    let bazaarTotalWorth = 0;
                    if (data.bazaar) {
                        for (const item of data.bazaar) {
                            bazaarTotalWorth += item.price;
                        }
                    }

                    // Get LIFETIME customer count from personal stats (this is what you wanted)
                    const lifetimeCustomerCount = data.personalstats
                        ? data.personalstats.bazaarcustomers || 0
                        : 0;

                    // Store data
                    GM_setValue('bazaarStatus', bazaarStatus);
                    GM_setValue('bazaarWorth', bazaarTotalWorth);
                    GM_setValue('lifetimeCustomers', lifetimeCustomerCount);
                    GM_setValue('lastUpdate', new Date().toISOString());

                    // Update display immediately if box exists
                    const statusBox = document.getElementById('torn-bazaar-status');
                    if (statusBox) {
                        updateDisplay(statusBox);
                    }
                } catch (e) {
                    console.error('Error processing Torn API response:', e);
                }
            },
            onerror: function(error) {
                console.error('API request failed:', error);
            }
        });
    }

    // Update display with stored data
    function updateDisplay(box) {
        const status = GM_getValue('bazaarStatus', 'UNKNOWN');
        const worth = GM_getValue('bazaarWorth', 0);
        const customers = GM_getValue('lifetimeCustomers', 0);
        const lastUpdate = GM_getValue('lastUpdate', null);

        const formattedWorth = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(worth);

        const timeAgo = lastUpdate ?
            `(${Math.floor((new Date() - new Date(lastUpdate)) / 60000)}m ago)` :
            '(never updated)';

        box.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold; color: #4dff88;">BAZAAR STATUS</div>
            <div>Status: <span style="color: ${status === 'OPEN' ? '#4dff88' : '#ff4d4d'}">${status}</span></div>
            <div>Bazaar Worth: ${formattedWorth}</div>
            <div>Lifetime Customers: <span style="color: #ffd700">${customers.toLocaleString()}</span></div>
            <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">${timeAgo}</div>
        `;
    }

    // Initialize
    if (!API_KEY) {
        console.warn('Torn Bazaar Monitor: Please configure your API key in the script!');
    }

    // Create and display box
    const statusBox = createStatusBox();
    updateDisplay(statusBox);
    document.body.appendChild(statusBox);

    // Update data on interval
    setInterval(updateBazaarData, UPDATE_INTERVAL);

    // Initial update
    updateBazaarData();

    // Update when tab becomes active
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateBazaarData();
        }
    });
})();