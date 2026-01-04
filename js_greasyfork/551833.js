// ==UserScript==
// @name Auto Refresh on Network Errors
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Automatically refreshes page when network errors occur - Retries indefinitely
// @author Assistant Pro
// @match *://*/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/551833/Auto%20Refresh%20on%20Network%20Errors.user.js
// @updateURL https://update.greasyfork.org/scripts/551833/Auto%20Refresh%20on%20Network%20Errors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        enableConsoleLogs: true,
        refreshDelay: 5000, // 5 seconds delay before refresh
        checkInterval: 3000, // Check every 3 seconds
        retryDelay: 10000, // Wait 10 seconds between retries
        enableSoundAlert: false // Play sound when network recovers
    };

    let state = {
        refreshCount: 0,
        lastRefreshTime: 0,
        isNetworkError: false,
        lastCheckTime: Date.now()
    };

    // Network error patterns to detect
    const networkErrorPatterns = [
        "We're having trouble finding that site",
        "We can't connect to the server",
        "Try again later",
        "Check your network connection",
        "behind a firewall",
        "This site can't be reached",
        "Unable to connect",
        "Server not found",
        "Network Error",
        "ERR_CONNECTION_",
        "ERR_NAME_NOT_RESOLVED",
        "ERR_INTERNET_DISCONNECTED",
        "Problem loading page",
        "The connection has timed out",
        "The site is temporarily unavailable"
    ];

    // Check if current page shows network error
    function isNetworkErrorPage() {
        // Check page title
        const title = document.title.toLowerCase();
        if (title.includes("problem loading") || 
            title.includes("not found") || 
            title.includes("unable to connect") ||
            title.includes("server not found") ||
            title.includes("this site can't be reached")) {
            return true;
        }

        // Check body text content
        const bodyText = document.body.innerText.toLowerCase();
        for (const pattern of networkErrorPatterns) {
            if (bodyText.includes(pattern.toLowerCase())) {
                return true;
            }
        }

        // Check common error elements
        const errorSelectors = [
            '[class*="error"]',
            '[id*="error"]',
            '[class*="offline"]',
            '[id*="offline"]',
            '.network-error',
            '.dns-error',
            '.connection-error',
            '.error-page',
            '.http-error'
        ];

        for (const selector of errorSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.innerText.toLowerCase();
                for (const pattern of networkErrorPatterns) {
                    if (text.includes(pattern.toLowerCase())) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Check network connectivity
    function checkNetworkConnectivity() {
        return new Promise((resolve) => {
            // Method 1: Navigator online status
            if (!navigator.onLine) {
                resolve(false);
                return;
            }

            // Method 2: Try to fetch a small resource
            const testUrls = [
                'https://www.google.com/favicon.ico?t=' + Date.now(),
                'https://www.cloudflare.com/favicon.ico?t=' + Date.now(),
                'https://www.microsoft.com/favicon.ico?t=' + Date.now()
            ];

            let successCount = 0;
            let completed = 0;

            testUrls.forEach(url => {
                fetch(url, { 
                    method: 'HEAD',
                    cache: 'no-store',
                    mode: 'no-cors'
                })
                .then(() => {
                    successCount++;
                })
                .catch(() => {})
                .finally(() => {
                    completed++;
                    if (completed === testUrls.length) {
                        resolve(successCount > 0);
                    }
                });
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                resolve(successCount > 0);
            }, 5000);
        });
    }

    // Perform smart refresh - NO MAX RETRY LIMIT
    function performSmartRefresh() {
        const now = Date.now();
        const timeSinceLastRefresh = now - state.lastRefreshTime;

        // Don't refresh too frequently
        if (timeSinceLastRefresh < config.retryDelay) {
            if (config.enableConsoleLogs) console.log(`⏳ Too soon to refresh, waiting... (${Math.round((config.retryDelay - timeSinceLastRefresh)/1000)}s)`);
            return;
        }

        state.refreshCount++;
        state.lastRefreshTime = now;
        state.isNetworkError = true;

        if (config.enableConsoleLogs) {
            console.log(`🔄 Auto-refresh attempt ${state.refreshCount} (Retrying until death)`);
            console.log("🌐 Network error detected, refreshing page...");
        }

        // Play sound alert if enabled
        if (config.enableSoundAlert) {
            playNotificationSound();
        }

        // Refresh with a small delay
        setTimeout(() => {
            if (config.enableConsoleLogs) console.log("🔥 FORCING REFRESH NOW!");
            window.location.reload();
        }, config.refreshDelay);
    }

    // Play notification sound
    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Sound not supported, continue silently
        }
    }

    // Main monitoring function - RETRY UNTIL DEATH
    function monitorNetworkStatus() {
        const now = Date.now();

        // Check if we're on a network error page
        if (isNetworkErrorPage()) {
            if (config.enableConsoleLogs && !state.isNetworkError) {
                console.log("🚨 NETWORK ERROR PAGE DETECTED! Starting infinite retry...");
            }
            
            // Check if we actually have network connectivity
            checkNetworkConnectivity().then(isOnline => {
                if (isOnline) {
                    if (config.enableConsoleLogs) console.log("✅ Network is online, but page failed to load - REFRESHING!");
                    performSmartRefresh();
                } else {
                    if (config.enableConsoleLogs) console.log("🌐 Network is offline, waiting for connection...");
                    // Wait for network to come back online and retry
                    setTimeout(() => {
                        if (config.enableConsoleLogs) console.log("🔄 Checking again after offline period...");
                        monitorNetworkStatus();
                    }, config.retryDelay);
                    return;
                }
            });
        } else {
            // Reset counter if page loaded successfully
            if (state.isNetworkError) {
                state.isNetworkError = false;
                if (config.enableConsoleLogs) console.log(`✅ Page loaded successfully after ${state.refreshCount} attempts! Continuing to monitor...`);
                state.refreshCount = 0;
            }
        }

        // Continue monitoring FOREVER
        setTimeout(monitorNetworkStatus, config.checkInterval);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            if (config.enableConsoleLogs) console.log("🌐 NETWORK CONNECTION RESTORED!");
            if (state.isNetworkError) {
                if (config.enableConsoleLogs) console.log("🔄 Network restored, refreshing page in 3 seconds...");
                setTimeout(() => {
                    if (config.enableConsoleLogs) console.log("🔥 REFRESHING AFTER NETWORK RECOVERY!");
                    window.location.reload();
                }, 3000);
            }
        });

        window.addEventListener('offline', () => {
            if (config.enableConsoleLogs) console.log("🌐 NETWORK CONNECTION LOST!");
            state.isNetworkError = true;
        });

        // Listen for page load errors
        window.addEventListener('error', (event) => {
            const error = event.error || event;
            const errorMsg = error.toString();
            if (errorMsg.includes('Loading') || errorMsg.includes('Network') || errorMsg.includes('Fetch')) {
                if (config.enableConsoleLogs) console.log("🚨 Page load error detected:", errorMsg);
                state.isNetworkError = true;
            }
        });

        // Listen for fetch errors
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args)
                .catch(error => {
                    if (config.enableConsoleLogs) console.log("🌐 Fetch error detected");
                    state.isNetworkError = true;
                    throw error;
                });
        };

        // Listen for XMLHttpRequest errors
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args) {
            this.addEventListener('error', () => {
                if (config.enableConsoleLogs) console.log("🌐 XHR error detected");
                state.isNetworkError = true;
            });
            return originalXHROpen.apply(this, args);
        };
    }

    // Initialize
    function init() {
        if (config.enableConsoleLogs) {
            console.log("🔄 AUTO REFRESH ON NETWORK ERRORS - STARTED");
            console.log("🔥 WILL RETRY UNTIL DEATH - NO LIMITS");
            console.log("🌐 Current network status:", navigator.onLine ? "ONLINE" : "OFFLINE");
            console.log("🔧 Monitoring all pages for network errors...");
        }

        setupEventListeners();
        
        // Start monitoring - WILL NEVER STOP
        setTimeout(monitorNetworkStatus, 2000);

        // Add status display
        if (config.enableConsoleLogs) {
            const statusDiv = document.createElement('div');
            statusDiv.innerHTML = `
                <div style="
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: #ff4444;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: Arial;
                    font-size: 12px;
                    z-index: 9999;
                    border: 2px solid #cc0000;
                ">
                    🔄 AUTO-REFRESH ACTIVE<br>
                    Retries: <span id="retryCount">0</span><br>
                    Status: <span id="networkStatus">MONITORING</span>
                </div>
            `;
            document.body.appendChild(statusDiv);
            
            // Update status display
            setInterval(() => {
                const retryElement = document.getElementById('retryCount');
                const statusElement = document.getElementById('networkStatus');
                if (retryElement) retryElement.textContent = state.refreshCount;
                if (statusElement) {
                    statusElement.textContent = state.isNetworkError ? 'RETRYING' : 'MONITORING';
                    statusElement.style.color = state.isNetworkError ? '#ffcc00' : '#00ff00';
                }
            }, 1000);
        }
    }

    // Start the script IMMEDIATELY
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Emergency fallback - if somehow monitoring stops, restart it
    setInterval(() => {
        if (!state.lastCheckTime || (Date.now() - state.lastCheckTime > 30000)) {
            if (config.enableConsoleLogs) console.log("🔄 EMERGENCY RESTART OF MONITORING");
            state.lastCheckTime = Date.now();
            monitorNetworkStatus();
        }
    }, 15000);

})();