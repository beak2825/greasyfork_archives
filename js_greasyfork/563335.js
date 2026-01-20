// ==UserScript==
// @name         Torn Quick Race Creator Enhanced
// @namespace    torn.custom.race
// @version      3.8
// @description  Create and join custom races with your actual cars via API
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563335/Torn%20Quick%20Race%20Creator%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/563335/Torn%20Quick%20Race%20Creator%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tracks = [
        { id: 6, title: "Uptown" },
        { id: 7, title: "Withdrawal" },
        { id: 8, title: "Underdog" },
        { id: 9, title: "Parkland" },
        { id: 10, title: "Docks" },
        { id: 11, title: "Commerce" },
        { id: 12, title: "Two Islands" },
        { id: 15, title: "Industrial" },
        { id: 16, title: "Vector" },
        { id: 17, title: "Mudpit" },
        { id: 18, title: "Hammerhead" },
        { id: 19, title: "Sewage" },
        { id: 20, title: "Meltdown" },
        { id: 21, title: "Speedway" },
        { id: 23, title: "Stone Park" },
        { id: 24, title: "Convict" }
    ];

    let userCars = [];
    let userName = '';
    let shadowRoot = null;

    const loadSettings = () => ({
        apiKey: GM_getValue('qrc_apiKey', ''),
        carID: GM_getValue('qrc_carID', 0),
        trackID: GM_getValue('qrc_trackID', 6),
        minDrivers: GM_getValue('qrc_minDrivers', 2),
        maxDrivers: GM_getValue('qrc_maxDrivers', 2),
        laps: GM_getValue('qrc_laps', 1),
        minClass: GM_getValue('qrc_minClass', 5),
        carsTypeAllowed: GM_getValue('qrc_carsTypeAllowed', 1),
        carsAllowed: GM_getValue('qrc_carsAllowed', 5),
        password: GM_getValue('qrc_password', ''),
        userName: GM_getValue('qrc_userName', '')
    });

    const settings = loadSettings();
    userName = settings.userName;

    function getRFC() {
        const rfcMatch = document.cookie.match(/rfc_v=([a-z0-9]+)/);
        return rfcMatch ? rfcMatch[1] : '';
    }

    function getElement(id) {
        return shadowRoot ? shadowRoot.querySelector(`#${id}`) : null;
    }

    function saveSettings() {
        if (!shadowRoot) return;

        GM_setValue('qrc_apiKey', getElement('qrc-apiKey')?.value || settings.apiKey);
        GM_setValue('qrc_carID', parseInt(getElement('qrc-carID')?.value) || settings.carID);
        GM_setValue('qrc_trackID', parseInt(getElement('qrc-trackID')?.value) || settings.trackID);
        GM_setValue('qrc_laps', parseInt(getElement('qrc-laps')?.value) || settings.laps);
        GM_setValue('qrc_maxDrivers', parseInt(getElement('qrc-maxDrivers')?.value) || settings.maxDrivers);
        GM_setValue('qrc_password', getElement('qrc-password')?.value || settings.password);
        GM_setValue('qrc_userName', userName);
    }

    async function fetchUserData() {
        if (!shadowRoot) {
            console.error('Shadow root not found');
            return;
        }

        const apiKeyEl = getElement('qrc-apiKey');
        const apiKey = apiKeyEl?.value?.trim();

        console.log('API Key element:', apiKeyEl);
        console.log('API Key value:', apiKey ? '***' : 'empty');

        if (!apiKey) {
            alert('Please enter your API key first!');
            return;
        }

        const statusEl = getElement('qrc-status');
        statusEl.textContent = 'Loading...';
        statusEl.style.color = '#ffcc00';

        try {
            const basicResponse = await fetch(`https://api.torn.com/v2/user/basic?striptags=true&key=${apiKey}`);
            const basicData = await basicResponse.json();

            if (basicData.error) {
                statusEl.textContent = `Error: ${basicData.error.error}`;
                statusEl.style.color = '#ff4444';
                return;
            }

            userName = basicData.profile?.name || '';
            updateUserNameDisplay();

            const carsResponse = await fetch(`https://api.torn.com/v2/user/enlistedcars?key=${apiKey}`);
            const carsData = await carsResponse.json();

            if (carsData.error) {
                statusEl.textContent = `Error: ${carsData.error.error}`;
                statusEl.style.color = '#ff4444';
                return;
            }

            userCars = carsData.enlistedcars || [];
            populateCarDropdown();
            saveSettings();
            statusEl.textContent = `✓ ${userName} - ${userCars.length} cars`;
            statusEl.style.color = '#44ff44';
        } catch (error) {
            statusEl.textContent = `Error: ${error.message}`;
            statusEl.style.color = '#ff4444';
        }
    }

    function updateUserNameDisplay() {
        const nameDisplay = getElement('qrc-userName');
        if (nameDisplay) {
            nameDisplay.textContent = userName ? `Welcome, ${userName}!` : '';
        }
    }

    function populateCarDropdown() {
        const carSelect = getElement('qrc-carID');
        if (!carSelect) return;

        carSelect.innerHTML = '<option value="0">-- Select a car --</option>';

        userCars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            const customName = car.car_name ? ` "${car.car_name}"` : '';
            option.textContent = `${car.car_item_name}${customName} (${car.class}) - ID: ${car.id}`;
            option.selected = car.id === settings.carID;
            carSelect.appendChild(option);
        });
    }

    function startRace() {
        saveSettings();

        const carID = getElement('qrc-carID')?.value;

        if (!carID || carID === '0') {
            alert('Please select a car first!');
            return;
        }

        if (!userName) {
            alert('Please load your data first!');
            return;
        }

        const trackID = getElement('qrc-trackID')?.value;
        const track = tracks.find(t => t.id === parseInt(trackID));
        if (!track) {
            alert('Please select a track!');
            return;
        }

        const laps = getElement('qrc-laps')?.value;
        const maxDrivers = getElement('qrc-maxDrivers')?.value;
        const password = getElement('qrc-password')?.value || '';
        const waitTime = Math.floor(Date.now() / 1000);
        const rfcv = getRFC();
        const raceTitle = `${userName}'s race`;

        const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${encodeURIComponent(raceTitle)}&minDrivers=${settings.minDrivers}&maxDrivers=${maxDrivers}&trackID=${track.id}&laps=${laps}&minClass=${settings.minClass}&carsTypeAllowed=${settings.carsTypeAllowed}&carsAllowed=${settings.carsAllowed}&betAmount=0&waitTime=${waitTime}&password=${encodeURIComponent(password)}&rfcv=${rfcv}`;

        window.location.href = url;
    }

    function createUI() {
        if (document.getElementById('qrc-container')) return;

        const container = document.createElement('div');
        container.id = 'qrc-container';

        shadowRoot = container.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            :host {
                all: initial;
                display: block;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 1.4;
            }
            .qrc-wrapper {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 8px;
                margin: 8px;
                color: #fff;
            }
            .qrc-header {
                font-size: 13px;
                padding: 4px 6px;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .qrc-header:hover {
                background: #252525;
                border-radius: 3px;
            }
            .qrc-userName {
                color: #44ff44;
                font-size: 11px;
            }
            .qrc-content {
                display: block;
            }
            .qrc-content.hidden {
                display: none;
            }
            .qrc-section {
                margin: 8px 0;
                padding: 6px;
                background: #222;
                border-radius: 3px;
            }
            .qrc-row {
                display: flex;
                gap: 6px;
                align-items: center;
                margin: 4px 0;
                flex-wrap: wrap;
            }
            .qrc-label {
                color: #888;
                font-size: 10px;
                min-width: 50px;
            }
            .qrc-input,
            .qrc-select,
            .qrc-btn {
                padding: 4px 8px;
                background: #2a2a2a;
                color: #fff;
                border: 1px solid #444;
                border-radius: 3px;
                font-size: 11px;
                font-family: inherit;
            }
            .qrc-select {
                min-width: 140px;
            }
            .qrc-input[type="number"] {
                width: 50px;
            }
            .qrc-input[type="text"],
            .qrc-input[type="password"] {
                width: 120px;
            }
            .qrc-input-small {
                width: 80px !important;
            }
            .qrc-btn {
                cursor: pointer;
                padding: 4px 10px;
            }
            .qrc-btn:hover {
                background: #3a3a3a;
            }
            .qrc-status {
                color: #888;
                font-size: 10px;
            }
            .qrc-start-btn {
                background: #2a6a2a;
                border-color: #3a8a3a;
                padding: 8px 20px;
                font-size: 13px;
                font-weight: bold;
                margin-top: 8px;
            }
            .qrc-start-btn:hover {
                background: #3a8a3a;
            }
            .qrc-center {
                text-align: center;
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'qrc-wrapper';
        wrapper.innerHTML = `
            <div class="qrc-header">
                <span>⚡ Quick Race</span>
                <span class="qrc-userName" id="qrc-userName">${userName ? `Welcome, ${userName}!` : ''}</span>
            </div>
            <div class="qrc-content" id="qrc-content">
                <div class="qrc-section">
                    <div class="qrc-row">
                        <span class="qrc-label">API Key</span>
                        <input type="password" class="qrc-input" id="qrc-apiKey" value="${settings.apiKey}" placeholder="API key">
                        <button class="qrc-btn" id="qrc-loadData">Load</button>
                        <span class="qrc-status" id="qrc-status"></span>
                    </div>
                </div>

                <div class="qrc-section">
                    <div class="qrc-row">
                        <span class="qrc-label">Car</span>
                        <select class="qrc-select" id="qrc-carID">
                            <option value="0">Load data first</option>
                        </select>
                    </div>
                    <div class="qrc-row">
                        <span class="qrc-label">Track</span>
                        <select class="qrc-select" id="qrc-trackID">
                            ${tracks.map(t => `<option value="${t.id}" ${t.id === settings.trackID ? 'selected' : ''}>${t.title}</option>`).join('')}
                        </select>
                    </div>
                    <div class="qrc-row">
                        <span class="qrc-label">Laps</span>
                        <input type="number" class="qrc-input" id="qrc-laps" value="${settings.laps}" min="1" max="100">
                        <span class="qrc-label">Max</span>
                        <select class="qrc-select" id="qrc-maxDrivers" style="min-width: 50px;">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <span class="qrc-label">Pass</span>
                        <input type="text" class="qrc-input qrc-input-small" id="qrc-password" value="${settings.password}" placeholder="optional">
                    </div>
                </div>

                <div class="qrc-section qrc-center">
                    <button class="qrc-btn qrc-start-btn" id="qrc-startRace">🏁 Start Race</button>
                </div>
            </div>
        `;

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);

        // Set max drivers after DOM is ready
        const maxDriversEl = shadowRoot.querySelector('#qrc-maxDrivers');
        if (maxDriversEl) {
            maxDriversEl.value = settings.maxDrivers;
        }

        // Event listeners - use shadowRoot to find elements
        shadowRoot.querySelector('.qrc-header').addEventListener('click', (e) => {
            if (!e.target.classList.contains('qrc-userName')) {
                shadowRoot.querySelector('#qrc-content').classList.toggle('hidden');
            }
        });

        shadowRoot.querySelector('#qrc-loadData').addEventListener('click', fetchUserData);
        shadowRoot.querySelector('#qrc-startRace').addEventListener('click', startRace);

        shadowRoot.querySelectorAll('.qrc-input, .qrc-select').forEach(input => {
            input.addEventListener('change', saveSettings);
        });

        // Insert into page
        const insertUI = () => {
            const target = document.querySelector('.content-wrapper') ||
                          document.querySelector('.content') ||
                          document.querySelector('#mainContainer');

            if (target && target.firstChild) {
                target.insertBefore(container, target.firstChild);
                console.log('Quick Race Creator loaded!');

                if (settings.apiKey) {
                    setTimeout(fetchUserData, 500);
                }
                return true;
            }
            return false;
        };

        if (!insertUI()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (insertUI()) {
                    obs.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                if (!document.getElementById('qrc-container')) {
                    document.body.insertBefore(container, document.body.firstChild);
                    console.log('Quick Race Creator force-loaded!');
                }
            }, 5000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();