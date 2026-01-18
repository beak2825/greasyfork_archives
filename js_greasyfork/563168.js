// ==UserScript==
// @name         Torn Market Listing Binder
// @namespace    torn-mugging-bot
// @version      1.4
// @description  Sends market listing data to mugging bot server when viewing items
// @author       Rany_Rain
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563168/Torn%20Market%20Listing%20Binder.user.js
// @updateURL https://update.greasyfork.org/scripts/563168/Torn%20Market%20Listing%20Binder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const SERVER_BASE_URL = 'http://localhost:3000';
    const SERVER_URL = `${SERVER_BASE_URL}/api/listing-binding`;
    const REGISTER_KEY_URL = `${SERVER_BASE_URL}/api/register-key`;
    const KEY_STATUS_URL = `${SERVER_BASE_URL}/api/key-status`;

    // Custom key URL - links to API key creation page
    // Users should create a "Limited Access" key which has all required permissions
    // (market:itemmarket for listings, user:profile,personalstats for target info)
    const CREATE_KEY_URL = 'https://www.torn.com/preferences.php#tab=api';

    // Items we're monitoring - must match server's MONITORED_ITEMS
    const MONITORED_ITEMS = [
        // Caches
        1118, 1119, 1120, 1121, 1122,

        // Weapons - Primary
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 63,
        174, 219, 231, 232, 241, 398, 399, 612, 837,

        // Weapons - Secondary
        12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        109, 175, 218, 240, 255, 1152, 1153,

        // Weapons - Melee
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        146, 217, 236, 237, 247,

        // Collectibles / Artifacts
        453, 455, 456, 457, 458, 459,

        // Special Items
        103, 283, 367, 428,

        // Boosters / Equipment
        106, 329, 330, 331, 421,

        // Armor - Riot (655-659)
        655, 656, 657, 658, 659,
        // Armor - Dune (660-664)
        660, 661, 662, 663, 664,
        // Armor - Assault (665-669)
        665, 666, 667, 668, 669,
        // Armor - Delta (670-674)
        670, 671, 672, 673, 674,
        // Armor - Marauder (675-679)
        675, 676, 677, 678, 679,
        // Armor - EOD (680-684)
        680, 681, 682, 683, 684,
        // Armor - Sentinel (1307-1311)
        1307, 1308, 1309, 1310, 1311,
        // Armor - Vanguard (1355-1359)
        1355, 1356, 1357, 1358, 1359
    ];

    // ===== STATE =====
    let isEnabled = GM_getValue('binderEnabled', true);
    let isSilentMode = GM_getValue('silentMode', false);
    let isSettingsOpen = false;

    // ===== CREATE MAIN GUI =====
    function createToggleGUI() {
        const container = document.createElement('div');
        container.id = 'mugging-bot-container';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        // Main toggle row
        const toggleRow = document.createElement('div');
        toggleRow.id = 'mugging-bot-toggle-row';
        toggleRow.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        // Binder toggle button
        const binderToggle = document.createElement('div');
        binderToggle.id = 'mugging-bot-toggle';
        binderToggle.style.cssText = `
            background: ${getBinderColor()};
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
            transition: background 0.2s;
        `;

        const statusDot = document.createElement('span');
        statusDot.id = 'mugging-bot-dot';
        statusDot.style.cssText = `
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${getBinderDotColor()};
        `;

        const label = document.createElement('span');
        label.id = 'mugging-bot-label';
        label.textContent = getBinderLabel();

        binderToggle.appendChild(statusDot);
        binderToggle.appendChild(label);
        binderToggle.addEventListener('click', toggleEnabled);

        // Silent mode toggle button
        const silentToggle = document.createElement('div');
        silentToggle.id = 'mugging-bot-silent';
        silentToggle.title = 'Silent Mode - No popup notifications';
        silentToggle.style.cssText = `
            background: ${isSilentMode ? '#6f42c1' : '#495057'};
            color: white;
            padding: 8px 10px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            user-select: none;
            transition: background 0.2s;
            font-size: 14px;
        `;
        silentToggle.textContent = isSilentMode ? '🔇' : '🔔';
        silentToggle.addEventListener('click', toggleSilentMode);

        // Settings button
        const settingsBtn = document.createElement('div');
        settingsBtn.id = 'mugging-bot-settings-btn';
        settingsBtn.title = 'Settings & API Key';
        settingsBtn.style.cssText = `
            background: #495057;
            color: white;
            padding: 8px 10px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            user-select: none;
            transition: background 0.2s;
            font-size: 14px;
        `;
        settingsBtn.textContent = '⚙️';
        settingsBtn.addEventListener('click', toggleSettings);

        toggleRow.appendChild(binderToggle);
        toggleRow.appendChild(silentToggle);
        toggleRow.appendChild(settingsBtn);
        container.appendChild(toggleRow);

        // Settings panel (hidden by default)
        const settingsPanel = createSettingsPanel();
        container.appendChild(settingsPanel);

        document.body.appendChild(container);
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'mugging-bot-settings';
        panel.style.cssText = `
            display: none;
            background: #2d2d2d;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            min-width: 280px;
            color: #fff;
        `;

        // Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        `;
        title.textContent = '🔑 API Key Registration';
        panel.appendChild(title);

        // Description
        const desc = document.createElement('div');
        desc.style.cssText = `
            font-size: 11px;
            color: #aaa;
            margin-bottom: 10px;
            line-height: 1.4;
        `;
        desc.textContent = 'Register your API key to help the bot fetch market listings and user profiles for mugging notifications.';
        panel.appendChild(desc);

        // Create Key link
        const createKeyRow = document.createElement('div');
        createKeyRow.style.cssText = `
            margin-bottom: 15px;
        `;

        const createKeyLink = document.createElement('a');
        createKeyLink.href = CREATE_KEY_URL;
        createKeyLink.target = '_blank';
        createKeyLink.style.cssText = `
            display: inline-block;
            background: #17a2b8;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
            transition: background 0.2s;
        `;
        createKeyLink.textContent = '🔗 Go to API Key Page';
        createKeyLink.addEventListener('mouseenter', () => createKeyLink.style.background = '#138496');
        createKeyLink.addEventListener('mouseleave', () => createKeyLink.style.background = '#17a2b8');

        const keyNote = document.createElement('div');
        keyNote.style.cssText = `
            font-size: 10px;
            color: #888;
            margin-top: 5px;
        `;
        keyNote.innerHTML = 'Create a <b>Limited Access</b> key (or Full Access)';

        createKeyRow.appendChild(createKeyLink);
        createKeyRow.appendChild(keyNote);
        panel.appendChild(createKeyRow);

        // API Key input
        const inputRow = document.createElement('div');
        inputRow.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        `;

        const apiKeyInput = document.createElement('input');
        apiKeyInput.id = 'mugging-bot-api-key';
        apiKeyInput.type = 'text';
        apiKeyInput.placeholder = 'Paste your API key here';
        apiKeyInput.maxLength = 16;
        apiKeyInput.style.cssText = `
            flex: 1;
            padding: 8px 10px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #1a1a1a;
            color: #fff;
            font-size: 12px;
            font-family: monospace;
        `;

        const registerBtn = document.createElement('button');
        registerBtn.id = 'mugging-bot-register-btn';
        registerBtn.textContent = 'Register';
        registerBtn.style.cssText = `
            padding: 8px 15px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        `;
        registerBtn.addEventListener('click', registerApiKey);
        registerBtn.addEventListener('mouseenter', () => registerBtn.style.background = '#218838');
        registerBtn.addEventListener('mouseleave', () => registerBtn.style.background = '#28a745');

        inputRow.appendChild(apiKeyInput);
        inputRow.appendChild(registerBtn);
        panel.appendChild(inputRow);

        // Status display
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'mugging-bot-key-status';
        statusDisplay.style.cssText = `
            font-size: 11px;
            padding: 8px;
            background: #1a1a1a;
            border-radius: 4px;
            color: #888;
        `;
        statusDisplay.textContent = 'Loading key status...';
        panel.appendChild(statusDisplay);

        // Fetch initial status
        setTimeout(fetchKeyStatus, 500);

        return panel;
    }

    // ===== HELPER FUNCTIONS =====
    function getBinderColor() {
        if (!isEnabled) return '#6c757d';
        if (isSilentMode) return '#5a6268';
        return '#28a745';
    }

    function getBinderDotColor() {
        if (!isEnabled) return '#aaa';
        if (isSilentMode) return '#90EE90';
        return '#90EE90';
    }

    function getBinderLabel() {
        if (!isEnabled) return 'Binder: OFF';
        if (isSilentMode) return 'Binder: ON (Silent)';
        return 'Binder: ON';
    }

    function updateBinderUI() {
        const container = document.getElementById('mugging-bot-toggle');
        const dot = document.getElementById('mugging-bot-dot');
        const label = document.getElementById('mugging-bot-label');
        const silentBtn = document.getElementById('mugging-bot-silent');

        if (container && dot && label) {
            container.style.background = getBinderColor();
            dot.style.background = getBinderDotColor();
            label.textContent = getBinderLabel();
        }

        if (silentBtn) {
            silentBtn.style.background = isSilentMode ? '#6f42c1' : '#495057';
            silentBtn.textContent = isSilentMode ? '🔇' : '🔔';
        }
    }

    // ===== TOGGLE FUNCTIONS =====
    function toggleEnabled() {
        isEnabled = !isEnabled;
        GM_setValue('binderEnabled', isEnabled);
        updateBinderUI();

        if (!isSilentMode) {
            flashMessage(isEnabled ? '✅ Binder Enabled' : '⏸️ Binder Disabled', isEnabled ? '#28a745' : '#6c757d');
        }
    }

    function toggleSilentMode() {
        isSilentMode = !isSilentMode;
        GM_setValue('silentMode', isSilentMode);
        updateBinderUI();

        // Always show this message so user knows the mode changed
        flashMessage(isSilentMode ? '🔇 Silent Mode ON' : '🔔 Notifications ON', isSilentMode ? '#6f42c1' : '#28a745');
    }

    function toggleSettings() {
        isSettingsOpen = !isSettingsOpen;
        const panel = document.getElementById('mugging-bot-settings');
        const btn = document.getElementById('mugging-bot-settings-btn');

        if (panel) {
            panel.style.display = isSettingsOpen ? 'block' : 'none';
        }
        if (btn) {
            btn.style.background = isSettingsOpen ? '#6f42c1' : '#495057';
        }

        if (isSettingsOpen) {
            fetchKeyStatus();
        }
    }

    // ===== API KEY FUNCTIONS =====
    function registerApiKey() {
        const input = document.getElementById('mugging-bot-api-key');
        const statusDiv = document.getElementById('mugging-bot-key-status');
        const apiKey = input?.value?.trim();

        if (!apiKey || apiKey.length !== 16) {
            statusDiv.style.color = '#dc3545';
            statusDiv.textContent = '❌ API key must be 16 characters';
            return;
        }

        statusDiv.style.color = '#ffc107';
        statusDiv.textContent = '⏳ Registering key...';

        GM_xmlhttpRequest({
            method: 'POST',
            url: REGISTER_KEY_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ apiKey: apiKey }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        statusDiv.style.color = '#28a745';
                        statusDiv.innerHTML = `
                            ✅ Key registered: ${result.maskedKey}<br>
                            📊 Market: ${result.capabilities?.market ? '✓' : '✗'} | Profiles: ${result.capabilities?.profiles ? '✓' : '✗'}<br>
                            🔑 Pool: ${result.poolSizes?.market || '?'} market, ${result.poolSizes?.profile || '?'} profile keys
                        `;
                        input.value = '';
                        if (!isSilentMode) {
                            successMessage('✅ API Key Registered!');
                        }
                    } else {
                        statusDiv.style.color = '#dc3545';
                        statusDiv.textContent = `❌ ${result.error}`;
                    }
                } catch (e) {
                    statusDiv.style.color = '#dc3545';
                    statusDiv.textContent = '❌ Error parsing response';
                }
            },
            onerror: function() {
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = '❌ Could not connect to server';
            },
            timeout: 10000
        });
    }

    function fetchKeyStatus() {
        const statusDiv = document.getElementById('mugging-bot-key-status');
        if (!statusDiv) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: KEY_STATUS_URL,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    statusDiv.style.color = '#aaa';
                    statusDiv.innerHTML = `
                        🔑 <strong>Server Key Pool:</strong><br>
                        📊 Market keys: ${result.marketKeys}<br>
                        👤 Profile keys: ${result.profileKeys}<br>
                        ${result.profileKeys === 0 ? '<span style="color:#ffc107">⚠️ No profile keys - notifications limited</span>' : '<span style="color:#28a745">✓ Profile notifications active</span>'}
                    `;
                } catch (e) {
                    statusDiv.style.color = '#dc3545';
                    statusDiv.textContent = '❌ Error fetching status';
                }
            },
            onerror: function() {
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = '❌ Server not reachable';
            },
            timeout: 5000
        });
    }

    // ===== INTERCEPT FETCH REQUESTS =====
    const {fetch: origFetch} = unsafeWindow;

    unsafeWindow.fetch = async (...args) => {
        const response = await origFetch(...args);

        // Check if this is a getListing request AND binder is enabled
        if (args[0].includes(`page.php?sid=iMarket&step=getListing`)) {
            if (!isEnabled) {
                console.log('⏸️ Binder disabled, skipping getListing intercept');
                return response;
            }

            console.log('🔍 Detected getListing request');

            // Parse request body
            let requestObject = {};
            if (args[1] && args[1].body) {
                args[1].body.forEach((v, k) => (requestObject[k] = v));
            }

            console.log('📋 Request data:', requestObject);

            // Check if this item is in our monitored list
            const itemId = parseInt(requestObject.itemID);
            if (!MONITORED_ITEMS.includes(itemId)) {
                console.log(`⏭️ Item ${itemId} not monitored, skipping`);
                return response;
            }

            // Clone and parse response
            response
                .clone()
                .json()
                .then(data => {
                    if (!data.list || !Array.isArray(data.list)) {
                        console.warn('⚠️ No listing data in response');
                        return;
                    }

                    console.log(`📊 Found ${data.list.length} listings`);

                    // Build binding data
                    const bindingData = [];

                    data.list.forEach(listing => {
                        const userId = listing.user?.ID || 0;
                        const listingID = listing.listingID; // The unique identifier for this listing
                        const armouryId = requestObject.armouryID; // For items with armory
                        const itemId = requestObject.itemID;
                        const price = listing.price || 0;
                        const quantity = listing.available || listing.quantity || listing.amount || 1;

                        // Skip truly anonymous listings (no user object at all)
                        if (listing.anonymous === true && !listing.user) {
                            return;
                        }

                        // Format: "itemID|listingID|userID|armouryID|price|quantity"
                        // Note: We don't send rarity because getListing doesn't provide it
                        // Server already has rarity from Market API
                        bindingData.push(`${itemId}|${listingID}|${userId}|${armouryId || ''}|${price}|${quantity}`);
                    });

                    if (bindingData.length === 0) {
                        console.log('ℹ️ No non-anonymous listings to send');
                        return;
                    }

                    console.log(`📤 Sending ${bindingData.length} bindings to server...`);
                    sendToServer(bindingData);
                })
                .catch(err => {
                    console.error('❌ Error parsing getListing response:', err);
                });
        }

        return response;
    };

    // ===== SEND DATA TO SERVER =====
    function sendToServer(data) {
        // Batch large requests to prevent timeout
        const BATCH_SIZE = 10;

        if (data.length > BATCH_SIZE) {
            // Split into smaller batches
            const batches = [];
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                batches.push(data.slice(i, i + BATCH_SIZE));
            }

            console.log(`📦 Splitting ${data.length} bindings into ${batches.length} batches...`);

            // Send batches sequentially
            let batchIndex = 0;
            const sendNextBatch = () => {
                if (batchIndex >= batches.length) return;

                const batch = batches[batchIndex];
                batchIndex++;

                sendBatchToServer(batch, () => {
                    // Small delay between batches
                    setTimeout(sendNextBatch, 200);
                });
            };

            sendNextBatch();
            return;
        }

        sendBatchToServer(data, () => {});
    }

    function sendBatchToServer(data, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: SERVER_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    console.log('✅ Server response:', result);

                    // If silent mode, skip UI notifications
                    if (isSilentMode) {
                        console.log('🔇 Silent mode - skipping notification popup');
                        callback();
                        return;
                    }

                    // Build detailed summary message
                    const lines = [];

                    if (result.updated > 0) {
                        lines.push(`✅ Bound: ${result.updated}`);
                    }
                    // Handle both old 'notFound' and new 'pending' field names
                    const pendingCount = result.pending || result.notFound || 0;
                    if (pendingCount > 0) {
                        lines.push(`⏳ Queued: ${pendingCount}`);
                    }
                    if (result.rejected > 0) {
                        lines.push(`🚫 Filtered: ${result.rejected}`);
                    }
                    if (result.notMonitored > 0) {
                        lines.push(`⛔ Not monitored: ${result.notMonitored}`);
                    }
                    if (result.errors > 0) {
                        lines.push(`❌ Errors: ${result.errors}`);
                    }

                    const message = lines.length > 0 ? lines.join('\n') : '✅ Request processed';

                    // Show appropriate message type
                    const allSkipped = (result.rejected + (result.notMonitored || 0)) === result.processed && result.updated === 0;
                    if (allSkipped) {
                        // All rejected or not monitored
                        warningMessage(message);
                    } else if (result.updated > 0 || pendingCount > 0) {
                        // Some success or queued
                        successMessage(message);
                    } else {
                        // Errors
                        errorMessage(message);
                    }

                } catch (e) {
                    console.error('❌ Error parsing server response:', e);
                    if (!isSilentMode) {
                        errorMessage('❌ Server error: Could not parse response');
                    }
                }
                callback();
            },
            onerror: function(error) {
                console.error('❌ Request error:', error);
                if (!isSilentMode) {
                    errorMessage('❌ Could not connect to server. Is it running?');
                }
                callback();
            },
            ontimeout: function() {
                console.error('❌ Request timed out');
                if (!isSilentMode) {
                    errorMessage('❌ Server request timed out');
                }
                callback();
            },
            timeout: 15000  // 15 seconds timeout
        });
    }

    // ===== UI FLASH MESSAGES =====
    function flashMessage(message, bgColor = '#28a745') {
        const flashDiv = document.createElement('div');

        flashDiv.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${bgColor};
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.2);
            z-index: 999999;
            font-size: 14px;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
            white-space: pre-line;
        `;

        flashDiv.textContent = message;
        document.body.appendChild(flashDiv);

        setTimeout(() => {
            flashDiv.remove();
        }, 3000);
    }

    function successMessage(message) {
        flashMessage(message, '#28a745');
    }

    function errorMessage(message) {
        flashMessage(message, '#dc3545');
    }

    function warningMessage(message) {
        flashMessage(message, '#ffc107');
        // Adjust text color for yellow background
        setTimeout(() => {
            const divs = document.querySelectorAll('div[style*="background-color: #ffc107"]');
            divs.forEach(div => div.style.color = '#000');
        }, 0);
    }

    // ===== INIT =====
    createToggleGUI();
    console.log(`✅ Torn Market Listing Binder v1.4 loaded (${isEnabled ? 'ENABLED' : 'DISABLED'}${isSilentMode ? ' - SILENT' : ''})`);
})();

