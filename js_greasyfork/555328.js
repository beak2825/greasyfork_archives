// ==UserScript==
// @name         Bus booker
// @namespace    MR
// @version      11.7.2025
// @description  Automatically book bus tickets at midnight using fetch API
// @author       AmmarHaddadi
// @match        https://bus.1337.ma/*
// @match        https://bus-med.1337.ma/*
// @downloadURL https://update.greasyfork.org/scripts/555328/Bus%20booker.user.js
// @updateURL https://update.greasyfork.org/scripts/555328/Bus%20booker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const domaine = "https://bus-med.1337.ma";
    let BUS_NUMBER = 1;

    async function getCurrent() {
        try {
            const response = await fetch(`${domaine}/api/departure/current`, {
                method: 'GET',
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('[Bus Booker] Error fetching current:', error);
            throw error;
        }
    }

    function findBusId(data, busNumber) {
        for (let bus of data) {
            if (bus.route.bus.name === `BUS 0${busNumber}`) {
                return {
                    busId: bus.id,
                };
            }
        }
        return null;
    }

    async function bookBus(busId) {
        try {
            const payload = {
                departure_id: busId,
                to_campus: false,
            };

            const response = await fetch(`${domaine}/api/tickets/book`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            return await response.json();
        } catch (error) {
            console.error('[Bus Booker] Error booking bus:', error);
            throw error;
        }
    }

    // Main booking logic
    async function tryBookBus() {
        console.log('[Bus Booker] Attempting to book bus...');

        try {
            const data = await getCurrent();
            const result = findBusId(data, BUS_NUMBER);

            if (result) {
                const { busId } = result;
                console.log(`[Bus Booker] Found bus! ID: ${busId}`);

                const response = await bookBus(busId);

                if (response.status === "booked") {
                    console.log('[Bus Booker] ✅ Bus booked successfully!');
                    alert('🎉 Bus booked successfully!');
                    return true;
                } else {
                    console.log('[Bus Booker] ❌ Booking failed:', response);
                    alert('❌ Booking failed: ' + JSON.stringify(response));
                }
            } else {
                console.log('[Bus Booker] ⚠️ Bus not found');
                alert('⚠️ Bus not found');
            }
        } catch (error) {
            console.error('[Bus Booker] Error:', error);
            alert('❌ Error: ' + error.message);
        }

        return false;
    }

    // Timer logic
    function startAutoBooker() {
        console.log('[Bus Booker] Auto-booker started, waiting for midnight...');

        const checkTime = () => {
            const now = new Date();
            const currentMinute = now.getMinutes();

            if (currentMinute === 0) {
                console.log('[Bus Booker] It\'s midnight! Attempting to book...');
                let booked = tryBookBus();
                while(!booked) {
                    booked = tryBookBus();
                }
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(checkTime, 1000);

        // Initial check
        checkTime();

        return intervalId;
    }

    // UI Setup
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'busBookerPanel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 250px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">لا تنسونا من دعائكم</h3>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px;">إختر رقم الحافلة</label>
                <input type="number" id="busNumberInput" min="0" value="${BUS_NUMBER}"
                    style="width: 100%; padding: 5px; border-radius: 5px; border: none; box-sizing: border-box;">
            </div>
            </button>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('busNumberInput').addEventListener('change', (e) => {
            BUS_NUMBER = e.target.value;
            console.log('[Bus Booker] Bus number updated to:', e.target.value);
        });
    }

    // Initialize
    window.addEventListener('load', () => {
        createControlPanel();
        startAutoBooker();
    });

})();