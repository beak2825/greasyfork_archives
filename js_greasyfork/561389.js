// ==UserScript==
// @name         Asylum Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Helper script for Asylum members
// @author       You
// @match        https://www.torn.com/properties.php?step=rentalmarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/561389/Asylum%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/561389/Asylum%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS_KEY_API_KEY = 'asylum_api_key';
    const SETTINGS_KEY_SERVER_URL = 'asylum_server_url';
    const SETTINGS_KEY_IS_SCRAPING = 'asylum_is_scraping'; // Re-added scraping state
    const DEFAULT_SERVER_URL = 'https://asylum.badfor.biz/api/external/property';

    // Styles for the button and settings
    const styles = `
        .asylum-btn {
            background-color: #6a00ff;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 5px;
            font-weight: bold;
        }
        .asylum-btn:hover {
            background-color: #5500cc;
        }
        .asylum-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .asylum-control-panel {
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999999;
            background-color: #333;
            color: #fff;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #666;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .asylum-status {
            margin-right: 5px;
            font-weight: bold;
        }
        .asylum-status.active {
            color: #00ff00;
        }
        /* Settings Modal */
        #asylum-settings-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 300px;
            color: black;
        }
        #asylum-settings-modal input {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
            border: 1px solid #ccc;
        }
        #asylum-settings-modal label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        #asylum-settings-modal .actions {
            text-align: right;
        }
        #asylum-settings-modal button {
            padding: 5px 10px;
            cursor: pointer;
        }
        /* Toast Notification */
        #asylum-toast {
            visibility: hidden;
            min-width: 250px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            padding: 16px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            transform: translateX(-50%);
            font-size: 14px;
        }
        #asylum-toast.show {
            visibility: visible;
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }
        @-webkit-keyframes fadein {
            from {bottom: 0; opacity: 0;} 
            to {bottom: 30px; opacity: 1;}
        }
        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }
        @-webkit-keyframes fadeout {
            from {bottom: 30px; opacity: 1;} 
            to {bottom: 0; opacity: 0;}
        }
        @keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
    `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Toast UI ---
    function showToast(message) {
        let toast = document.getElementById("asylum-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "asylum-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = "show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }

    // --- Settings UI ---
    function createSettingsUI() {
        // Remove existing elements
        const existingBtn = document.getElementById('asylum-settings-btn');
        if (existingBtn) existingBtn.remove();
        const existingModal = document.getElementById('asylum-settings-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'asylum-settings-modal';
        modal.innerHTML = `
            <h3>Asylum Watcher Settings</h3>
            <label for="asylum-api-key">API Key</label>
            <input type="text" id="asylum-api-key" placeholder="Enter your API Key">
            <label for="asylum-server-url">Server URL</label>
            <input type="text" id="asylum-server-url" placeholder="https://asylum.badfor.biz/api/external/property">
            <div class="actions">
                <button id="asylum-save-btn">Save</button>
                <button id="asylum-close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Load values
        const apiKeyInput = document.getElementById('asylum-api-key');
        const serverUrlInput = document.getElementById('asylum-server-url');

        // Function to open settings
        window.openAsylumSettings = () => {
            apiKeyInput.value = GM_getValue(SETTINGS_KEY_API_KEY, '');
            serverUrlInput.value = GM_getValue(SETTINGS_KEY_SERVER_URL, DEFAULT_SERVER_URL);
            modal.style.display = 'block';
        };

        document.getElementById('asylum-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('asylum-save-btn').addEventListener('click', () => {
            GM_setValue(SETTINGS_KEY_API_KEY, apiKeyInput.value.trim());
            GM_setValue(SETTINGS_KEY_SERVER_URL, serverUrlInput.value.trim());
            modal.style.display = 'none';
            alert('Settings saved!');
        });
    }

    function startScraping() {
        if (confirm('This will clear the server and start scraping. Continue?')) {
            GM_setValue(SETTINGS_KEY_IS_SCRAPING, true);
            updateUIState(true);
            // First scrape clears the server
            scrapeAndSend(true);
        }
    }

    function stopScraping() {
        GM_setValue(SETTINGS_KEY_IS_SCRAPING, false);
        updateUIState(false);
        showToast('Scraping stopped.');
    }

    function updateUIState(isScraping) {
        const btn = document.getElementById('asylum-scrape-btn');
        if (btn) {
            btn.textContent = isScraping ? 'Stop Scraping' : 'Start Scraping';
            btn.style.backgroundColor = isScraping ? '#ff4444' : '#6a00ff';
        }
    }

    function injectControlPanel() {
        if (document.getElementById('asylum-control-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'asylum-control-panel';
        panel.className = 'asylum-control-panel';

        // Settings Button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'asylum-btn';
        settingsBtn.textContent = 'Settings';
        settingsBtn.addEventListener('click', window.openAsylumSettings);
        
        // Scrape Button
        const scrapeBtn = document.createElement('button');
        scrapeBtn.id = 'asylum-scrape-btn';
        scrapeBtn.className = 'asylum-btn';
        
        const isScraping = GM_getValue(SETTINGS_KEY_IS_SCRAPING, false);
        scrapeBtn.textContent = isScraping ? 'Stop Scraping' : 'Start Scraping';
        if (isScraping) scrapeBtn.style.backgroundColor = '#ff4444';
        
        scrapeBtn.addEventListener('click', () => {
            const currentStatus = GM_getValue(SETTINGS_KEY_IS_SCRAPING, false);
            if (currentStatus) {
                stopScraping();
            } else {
                startScraping();
            }
        });

        panel.appendChild(scrapeBtn);
        panel.appendChild(settingsBtn);

        document.body.appendChild(panel);
    }

    // --- Logic ---

    function getApiKey() {
        return GM_getValue(SETTINGS_KEY_API_KEY, '');
    }

    function getServerUrl() {
        let url = GM_getValue(SETTINGS_KEY_SERVER_URL, DEFAULT_SERVER_URL);
        // Remove trailing slash if present
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        // Force HTTPS
        if (url.startsWith('http://asylum.badfor.biz')) {
            url = url.replace('http://', 'https://');
        }
        return url;
    }


    function extractPropertyData(liElement) {
        try {
            //console.log('[Asylum Debug] Extracting from element:', liElement);

            // Owner ID
            // In XML: <div class="hidden-name left"><span class="title bold black">Owner: </span><a href="/profiles.php?XID=1187574" ...>
            let playerId = null;
            const userLink = liElement.querySelector('.hidden-name a'); 
            
            if (userLink) {
                // Try from href: /profiles.php?XID=1187574
                const href = userLink.getAttribute('href');
                if (href) {
                    const match = href.match(/XID=(\d+)/);
                    if (match) playerId = match[1];
                }
            }
            
            // Fallback to older selector just in case
            if (!playerId) {
                 const oldUserLink = liElement.querySelector('.userinfo a.user.name');
                 if (oldUserLink) {
                    const href = oldUserLink.getAttribute('href');
                    if (href) {
                        const match = href.match(/XID=(\d+)/);
                        if (match) playerId = match[1];
                    }
                 }
            }

            if (!playerId) {
                console.warn('[Asylum Debug] Could not find Player ID');
                return null;
            }

            // Cost
            // In XML: <div class="cost left t-overflow"> ... $25,990,000 </div>
            const costEl = liElement.querySelector('.cost');
            if (!costEl) {
                console.warn('[Asylum Debug] Could not find Cost element');
                return null;
            }
            // The text content has newlines and "Cost:", so clean it up
            let totalRent = costEl.textContent.replace(/[^\d]/g, '');

            // Days
            // In XML: <div class="rental-period left"> ... 30 </div>
            const periodEl = liElement.querySelector('.rental-period');
            if (!periodEl) {
                console.warn('[Asylum Debug] Could not find Period element');
                return null;
            }
            let days = periodEl.textContent.replace(/[^\d]/g, '');

            const result = {
                player_id: parseInt(playerId, 10),
                days: parseInt(days, 10),
                total_rent: parseInt(totalRent, 10)
            };
            // console.log('[Asylum Debug] Extracted:', result);
            return result;
        } catch (e) {
            console.error('[Asylum Debug] Error extracting property data', e);
            return null;
        }
    }

    // Debounce helper
    let lastScrapeTime = 0;
    let lastScrapedDataSignature = ''; // Store signature of last sent data

    function checkAndScrape() {
        if (!GM_getValue(SETTINGS_KEY_IS_SCRAPING, false)) return;
        
        const now = Date.now();
        if (now - lastScrapeTime < 1000) return; // 1 second throttle
        lastScrapeTime = now;

        // Perform extraction first to check if content changed
        const rentLis = document.querySelectorAll('ul.users-list.rental > li');
        const properties = [];
        rentLis.forEach(li => {
             if (li.querySelector('.rent-button')) {
                const data = extractPropertyData(li);
                if (data) properties.push(data);
             }
        });

        if (properties.length === 0) return;

        // Create a simple signature to detect changes
        // Using length + first item ID + last item ID usually suffices for pagination
        const firstId = properties[0].player_id;
        const lastId = properties[properties.length - 1].player_id;
        const signature = `${properties.length}-${firstId}-${lastId}`;

        if (signature === lastScrapedDataSignature) {
            console.log('[Asylum Debug] Content unchanged. Skipping auto-scrape.');
            return;
        }

        console.log(`[Asylum Debug] Content changed (Sig: ${signature}). Triggering auto-scrape.`);
        lastScrapedDataSignature = signature;
        
        // Call send with the pre-extracted properties to avoid re-extraction
        sendBatchData(properties, false);
    }
    
    // Split scrapeAndSend to separate sending logic
    function sendBatchData(properties, shouldClear) {
        const apiKey = getApiKey();
        const url = getServerUrl();
        
        console.log(`Sending POST to: ${url} (Clear: ${shouldClear})`);

        const payload = {
            apiKey: apiKey,
            clear: shouldClear,
            properties: properties
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                 console.log('Response:', response.status, response.responseText);
                 if ((response.status >= 200 && response.status < 300) || response.status === 409) {
                    if (shouldClear) {
                        showToast(`Server cleared & ${properties.length} properties scraped. Please browse pages.`);
                    } else {
                         showToast(`Scraped ${properties.length} properties.`);
                    }
                } else {
                    console.error('Failed to update server: ' + response.statusText + ' (' + response.status + ')');
                    showToast('Error uploading batch.');
                }
            },
            onerror: function(err) {
                console.error('Network error.', err);
                showToast('Network error.');
            }
        });
    }

    function scrapeAndSend(shouldClear) {
         // This function is now mostly for the manual button click or first run
         const rentLis = document.querySelectorAll('ul.users-list.rental > li');
         const properties = [];
         rentLis.forEach(li => {
             if (li.querySelector('.rent-button')) {
                const data = extractPropertyData(li);
                if (data) properties.push(data);
             }
         });
         
         if (properties.length > 0) {
             const firstId = properties[0].player_id;
             const lastId = properties[properties.length - 1].player_id;
             lastScrapedDataSignature = `${properties.length}-${firstId}-${lastId}`;
             
             sendBatchData(properties, shouldClear);
         } else if (shouldClear) {
             // If clearing, we send even if empty
             sendBatchData([], true);
         } else {
             showToast('No properties found to scrape.');
         }
    }


    function init() {
        createSettingsUI();
        
        // Retry injection
        let attempts = 0;
        const interval = setInterval(() => {
            injectControlPanel();
            attempts++;
            if (document.getElementById('asylum-control-panel') || attempts > 10) {
                clearInterval(interval);
            }
        }, 500);

        // Observer to ensure panel persists and check for page updates
        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('asylum-control-panel')) {
                 injectControlPanel();
            }
            
            // Check if we need to auto-scrape new content
            if (GM_getValue(SETTINGS_KEY_IS_SCRAPING, false)) {
                 // Simple check: if mutation involves the rental list
                 let shouldScrape = false;
                 for (const mutation of mutations) {
                     if (mutation.target.classList && mutation.target.classList.contains('rental-market-list')) {
                         shouldScrape = true;
                     }
                     // Or if main container changed (pagination)
                     if (mutation.target.id === 'mainContainer' || mutation.target.classList.contains('content-wrapper')) {
                         shouldScrape = true;
                     }
                 }
                 
                 // Fallback: Just try to scrape periodically if ANY substantial change happened,
                 // but rely on throttle in checkAndScrape to prevent spam.
                 if (mutations.length > 0) {
                      checkAndScrape();
                 }
            }
        });

        const target = document.querySelector('#mainContainer') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    }

    // Wait for load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
