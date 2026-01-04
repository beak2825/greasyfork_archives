// ==UserScript==
// @name         Swan Connect Bridge - Scouts Membership System
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Extract auth token from Scouts Membership System and launch Swan Connect
// @author       Swan Connect Team
// @match        https://membership.scouts.org.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scouts.org.uk
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552901/Swan%20Connect%20Bridge%20-%20Scouts%20Membership%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/552901/Swan%20Connect%20Bridge%20-%20Scouts%20Membership%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const PRODUCTION_URL = 'https://swan-connect.azurewebsites.net';
    const LOCAL_DEV_URL = 'https://localhost:7242';

    // Dev mode (hidden by default - enable with Ctrl+Shift+S three times)
    let devModeEnabled = GM_getValue('devMode', false);
    let devModeClickCount = 0;
    let devModeTimeout = null;

    // Add styles for the bridge UI
    GM_addStyle(`
        #swan-connect-bridge {
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #7413dc 0%, #4801FF 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-width: 280px;
        }

        #swan-connect-bridge h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 8px;
        }

        .swan-button {
            display: block;
            width: 100%;
            margin: 8px 0;
            padding: 10px 15px;
            background: white;
            color: #7413dc;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            font-size: 14px;
        }

        .swan-button:hover {
            background: #f0f0f0;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .swan-button.production {
            background: white;
            color: #7413dc;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .swan-button.production:hover {
            background: #f8f8f8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .swan-button.dev {
            background: #4CAF50;
            color: white;
        }

        .swan-button.dev:hover {
            background: #45a049;
        }

        .swan-button.dev-tool {
            background: #ff9800;
            color: white;
        }

        .swan-button.dev-tool:hover {
            background: #e68900;
        }

        .swan-dev-badge {
            display: inline-block;
            background: #ff9800;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 8px;
        }

        .swan-info {
            font-size: 11px;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            opacity: 0.9;
        }

        .swan-info-item {
            margin: 4px 0;
            word-break: break-all;
        }

        .swan-status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }

        .swan-status.valid {
            background: #4CAF50;
        }

        .swan-status.expired {
            background: #f44336;
        }

        .swan-status.warning {
            background: #ff9800;
        }

        #swan-toggle {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #7413dc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }

        #swan-toggle:hover {
            background: #5c0fb3;
            transform: translateX(-50%) scale(1.05);
        }

        .swan-dev-info {
            background: rgba(255, 152, 0, 0.1);
            border: 1px solid rgba(255, 152, 0, 0.3);
            padding: 8px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 11px;
        }
    `);

    // Function to get auth info from localStorage
    function getAuthInfo() {
        try {
            const authInfoStr = localStorage.getItem('authInfo');
            if (!authInfoStr) {
                return null;
            }
            return JSON.parse(authInfoStr);
        } catch (error) {
            console.error('Error parsing authInfo:', error);
            return null;
        }
    }

    // Function to check token expiry
    function getTokenStatus(authInfo) {
        if (!authInfo || !authInfo.account || !authInfo.account.idTokenClaims) {
            return { status: 'error', message: 'No token found', class: 'expired' };
        }

        const exp = authInfo.account.idTokenClaims.exp;
        const expDate = new Date(exp * 1000);
        const now = new Date();
        const diffMs = expDate - now;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMs < 0) {
            return {
                status: 'expired',
                message: 'Token expired',
                class: 'expired',
                expiry: expDate
            };
        } else if (diffMins < 5) {
            return {
                status: 'warning',
                message: `Expires in ${diffMins} mins`,
                class: 'warning',
                expiry: expDate
            };
        } else {
            return {
                status: 'valid',
                message: `Valid (${diffMins} mins left)`,
                class: 'valid',
                expiry: expDate
            };
        }
    }

    // Function to build the launch URL with token
    function buildLaunchUrl(baseUrl) {
        const authInfo = getAuthInfo();
        if (!authInfo || !authInfo.idToken) {
            alert('No authentication token found. Please make sure you are logged into the Scouts Membership System.');
            return null;
        }

        // Pass token as query parameter
        // Your Blazor app will extract this and store it for API calls
        const token = encodeURIComponent(authInfo.idToken);
        const contactId = authInfo.account?.idTokenClaims?.extension_ContactId || '';

        return `${baseUrl}/?token=${token}&contactId=${encodeURIComponent(contactId)}`;
    }

    // Function to launch Swan Connect
    function launchSwanConnect(environment) {
        let baseUrl;
        if (environment === 'local') {
            baseUrl = LOCAL_DEV_URL;
        } else {
            baseUrl = PRODUCTION_URL;
        }

        const url = buildLaunchUrl(baseUrl);

        if (url) {
            window.open(url, '_blank');
        }
    }

    // Function to toggle dev mode
    function toggleDevMode() {
        devModeEnabled = !devModeEnabled;
        GM_setValue('devMode', devModeEnabled);

        // Recreate UI
        const existingBridge = document.getElementById('swan-connect-bridge');
        if (existingBridge) {
            existingBridge.remove();
        }
        const existingToggle = document.getElementById('swan-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }
        createUI();

        // Show notification
        const bridge = document.getElementById('swan-connect-bridge');
        if (bridge) {
            bridge.style.display = 'block';
        }

        alert(devModeEnabled ? '🛠️ Dev Mode ENABLED\n\nDev tools are now visible.' : '✅ Dev Mode DISABLED\n\nDev tools hidden.');
    }

    // Keyboard shortcut handler for dev mode (Ctrl+Shift+S pressed 3 times)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            devModeClickCount++;

            clearTimeout(devModeTimeout);
            devModeTimeout = setTimeout(() => {
                devModeClickCount = 0;
            }, 2000);

            if (devModeClickCount === 3) {
                toggleDevMode();
                devModeClickCount = 0;
            }
        }
    });

    // Function to copy token to clipboard
    function copyTokenToClipboard() {
        const authInfo = getAuthInfo();
        if (!authInfo || !authInfo.idToken) {
            alert('No authentication token found.');
            return;
        }

        navigator.clipboard.writeText(authInfo.idToken).then(() => {
            alert('Token copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy token:', err);
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = authInfo.idToken;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Token copied to clipboard!');
        });
    }

    // Create the UI
    function createUI() {
        // Check if UI already exists
        if (document.getElementById('swan-connect-bridge')) {
            return;
        }

        const authInfo = getAuthInfo();
        const tokenStatus = getTokenStatus(authInfo);

        // Create toggle button at top center
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'swan-toggle';
        toggleBtn.innerHTML = '🦢 Swan Connect';
        toggleBtn.onclick = () => {
            const bridge = document.getElementById('swan-connect-bridge');
            if (bridge) {
                bridge.style.display = bridge.style.display === 'none' ? 'block' : 'none';
            }
        };
        document.body.appendChild(toggleBtn);

        // Create main bridge UI
        const bridgeDiv = document.createElement('div');
        bridgeDiv.id = 'swan-connect-bridge';

        bridgeDiv.innerHTML = `
            <h3>🦢 Swan Connect${devModeEnabled ? '<span class="swan-dev-badge">DEV</span>' : ''}</h3>

            <button class="swan-button production" id="swan-launch-production">
                🚀 Launch Swan Connect
            </button>

            ${devModeEnabled ? `
            <button class="swan-button dev" id="swan-launch-local">
                🏠 Launch Local Dev
            </button>

            <button class="swan-button dev-tool" id="swan-copy-token">
                📋 Copy Token
            </button>

            <button class="swan-button dev-tool" id="swan-toggle-dev-mode">
                ❌ Disable Dev Mode
            </button>
            ` : ''}

            <div class="swan-info">
                <div class="swan-info-item">
                    <span class="swan-status ${tokenStatus.class}"></span>
                    <strong>Status:</strong> ${tokenStatus.message}
                </div>
                ${authInfo && authInfo.account && authInfo.account.idTokenClaims ? `
                <div class="swan-info-item">
                    <strong>Contact ID:</strong> ${authInfo.account.idTokenClaims.extension_ContactId || 'N/A'}
                </div>
                ${devModeEnabled ? `
                <div class="swan-info-item">
                    <strong>Expires:</strong> ${tokenStatus.expiry ? tokenStatus.expiry.toLocaleString() : 'N/A'}
                </div>
                ` : ''}
                ` : ''}
            </div>

            ${devModeEnabled ? `
            <div class="swan-dev-info">
                💡 <strong>Dev Mode Active</strong><br>
                Press <kbd>Ctrl+Shift+S</kbd> 3x to toggle
            </div>
            ` : ''}
        `;

        document.body.appendChild(bridgeDiv);

        // Attach event listeners
        document.getElementById('swan-launch-production').onclick = () => launchSwanConnect('production');

        if (devModeEnabled) {
            document.getElementById('swan-launch-local').onclick = () => launchSwanConnect('local');
            document.getElementById('swan-copy-token').onclick = copyTokenToClipboard;
            document.getElementById('swan-toggle-dev-mode').onclick = toggleDevMode;
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            bridgeDiv.style.display = 'none';
        }, 5000);
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    // Also monitor for token changes (in case user logs in/out)
    let lastToken = null;
    setInterval(() => {
        const authInfo = getAuthInfo();
        const currentToken = authInfo?.idToken || null;

        if (currentToken !== lastToken) {
            lastToken = currentToken;
            // Recreate UI to reflect new token status
            const existingBridge = document.getElementById('swan-connect-bridge');
            if (existingBridge) {
                existingBridge.remove();
            }
            const existingToggle = document.getElementById('swan-toggle');
            if (existingToggle) {
                existingToggle.remove();
            }
            createUI();
        }
    }, 5000); // Check every 5 seconds

})();
