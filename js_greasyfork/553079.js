// ==UserScript==
// @name         Torn Jewelry Store Cluster Ring Alert
// @namespace    https://swervelord.dev
// @version      4.2.0
// @description  Monitors the Torn jewelry store and alerts when both cameras and guard are disabled.
// @author       swervelord
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553079/Torn%20Jewelry%20Store%20Cluster%20Ring%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/553079/Torn%20Jewelry%20Store%20Cluster%20Ring%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the banner
    GM_addStyle(`
        #cluster-ring-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #dc3545;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 999999;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }
        
        #api-key-prompt {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 2px solid #333;
            padding: 30px;
            border-radius: 10px;
            z-index: 9999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        
        #api-key-prompt input {
            width: 300px;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }
        
        #api-key-prompt button {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        
        #api-key-prompt .submit-btn {
            background-color: #28a745;
            color: white;
        }
        
        #api-key-prompt .submit-btn:hover {
            background-color: #218838;
        }
        
        #api-key-prompt h3 {
            color: #333;
            margin-top: 0;
        }
        
        #api-key-prompt p {
            color: #666;
            font-size: 13px;
        }
    `);

    let banner = null;
    let apiKey = GM_getValue('jewelry_store_api_key', '');

    // Function to show API key prompt
    function showApiKeyPrompt() {
        const promptDiv = document.createElement('div');
        promptDiv.id = 'api-key-prompt';
        promptDiv.innerHTML = `
            <h3>🔑 Cluster Ring Alert Setup</h3>
            <p>Enter your Torn Public API key to monitor the Jewelry Store</p>
            <p style="font-size: 11px; color: #999;">Get your API key from: <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">Preferences → API</a></p>
            <input type="text" id="api-key-input" placeholder="Enter your API key here..." />
            <br>
            <button class="submit-btn" id="submit-key">Save & Start Monitoring</button>
        `;
        document.body.appendChild(promptDiv);

        document.getElementById('submit-key').addEventListener('click', () => {
            const key = document.getElementById('api-key-input').value.trim();
            if (key) {
                GM_setValue('jewelry_store_api_key', key);
                apiKey = key;
                promptDiv.remove();
                console.log('Cluster Ring Alert: API key saved, starting monitoring...');
                checkJewelryStore(); // Start monitoring immediately
            } else {
                alert('Please enter a valid API key');
            }
        });
    }

    // Function to create and show the banner
    function showBanner() {
        if (banner) return; // Banner already exists

        banner = document.createElement('div');
        banner.id = 'cluster-ring-banner';
        banner.textContent = '🎉 CLUSTER RING AVAILABLE! Click to Shoplift! 🎉';
        
        banner.addEventListener('click', () => {
            window.location.href = 'https://www.torn.com/loader.php?sid=crimes#/shoplifting';
        });

        document.body.appendChild(banner);
        console.log('Cluster Ring Alert: Both security measures disabled! Banner displayed.');
    }

    // Function to hide the banner
    function hideBanner() {
        if (banner) {
            banner.remove();
            banner = null;
            console.log('Cluster Ring Alert: Security restored, banner removed.');
        }
    }

    // Function to check jewelry store status
    function checkJewelryStore() {
        if (!apiKey) {
            console.log('Cluster Ring Alert: No API key set, skipping check.');
            return;
        }

        fetch(`https://api.torn.com/torn/?selections=shoplifting&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // Check for API errors
                if (data.error) {
                    console.error('Cluster Ring Alert: API Error -', data.error.error);
                    if (data.error.code === 2) { // Incorrect key
                        alert('Invalid API key! Please update your API key.');
                        GM_setValue('jewelry_store_api_key', '');
                        apiKey = '';
                        showApiKeyPrompt();
                    }
                    return;
                }

                // Check jewelry store security status
                const jewelryStore = data.shoplifting.jewelry_store;
                const camerasDisabled = jewelryStore[0].disabled; // Three cameras
                const guardDisabled = jewelryStore[1].disabled;   // One guard

                console.log(`Cluster Ring Alert: Cameras=${camerasDisabled}, Guard=${guardDisabled}`);

                // Show banner if both are disabled
                if (camerasDisabled && guardDisabled) {
                    showBanner();
                } else {
                    hideBanner();
                }
            })
            .catch(error => {
                console.error('Cluster Ring Alert: Fetch error -', error);
            });
    }

    // Initialize the script
    function init() {
        console.log('Cluster Ring Alert: Script initialized');

        // Check if API key exists, if not, prompt for it
        if (!apiKey) {
            console.log('Cluster Ring Alert: No API key found, showing prompt...');
            setTimeout(showApiKeyPrompt, 1000); // Delay to ensure page is loaded
        } else {
            console.log('Cluster Ring Alert: API key found, starting monitoring...');
            // Start checking immediately
            checkJewelryStore();
        }

        // Check every 30 seconds (2 times per minute)
        setInterval(checkJewelryStore, 30000);
    }

    // Wait for page to load before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();