// ==UserScript==
// @name         Torn City Virus Coding Alert
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows virus coding status once daily when active, or every hour when no virus is being programmed or when virus coding is complete
// @author       Woeka
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/559128/Torn%20City%20Virus%20Coding%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/559128/Torn%20City%20Virus%20Coding%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    // API key is stored via Tampermonkey menu (right-click Tampermonkey icon → Script name → Set Api Key)
    // Or you can set it manually below and it will be saved automatically
    const API_KEY_STORAGE_KEY = 'torn_virus_alert_apikey';
    let API_KEY = GM_getValue(API_KEY_STORAGE_KEY, 'YOUR_API_KEY_HERE');
    
    // Check interval in milliseconds (default: 1 hour = 3600000ms)
    const CHECK_INTERVAL = 60 * 60 * 1000;

    // Storage key for last alert time (to prevent spam)
    const LAST_ALERT_KEY = 'torn_virus_last_alert';
    const LAST_NO_VIRUS_ALERT_KEY = 'torn_virus_last_no_virus_alert';

    const PC_LINK = 'https://www.torn.com/pc.php';
    
    // Register Tampermonkey menu command to set API key
    GM_registerMenuCommand('Set Api Key', function() {
        setApiKey();
    });
    
    function setApiKey() {
        const currentKey = GM_getValue(API_KEY_STORAGE_KEY, '');
        const userInput = prompt(
            'Please enter your Torn City API Key (16 characters):\n\nGet your API key from: https://www.torn.com/preferences.php#tab=api',
            currentKey || ''
        );
        
        if (userInput !== null && userInput.trim() !== '') {
            if (userInput.length === 16) {
                GM_setValue(API_KEY_STORAGE_KEY, userInput.trim());
                API_KEY = userInput.trim();
                alert('API key saved successfully!');
                // Refresh the check
                checkVirusStatus();
            } else {
                alert('Invalid API key length. API keys must be exactly 16 characters.');
            }
        }
    }
    
    // Track active notifications to prevent duplicates
    let activeNotificationId = null;
    let notificationTimeout = null;

    function removeExistingNotifications() {
        // Remove any existing notifications
        const existing = document.querySelectorAll('[id^="torn-virus-notification-"]');
        existing.forEach(notif => {
            notif.remove();
        });
        activeNotificationId = null;
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
            notificationTimeout = null;
        }
    }

    function showNotification(virusName, timeLeft, daysRemaining, hoursRemaining, isTestMode = false, noApiKey = false, virusDone = false) {
        // Don't show notification on pc.php page
        if (window.location.pathname === '/pc.php' || window.location.href.includes('/pc.php')) {
            console.log('Torn City Virus: Skipping notification on pc.php page');
            return;
        }
        
        console.log('Torn City Virus: showNotification called with:', { virusName, timeLeft, daysRemaining, hoursRemaining, isTestMode });
        
        // Remove any existing notifications first
        removeExistingNotifications();
        
        // Wait for body to be available
        const addNotification = () => {
            console.log('Torn City Virus: addNotification called, document.body exists:', !!document.body);
            if (!document.body) {
                console.log('Torn City Virus: Waiting for document.body...');
                setTimeout(addNotification, 100);
                return;
            }
            
            console.log('Torn City Virus: Creating notification element...');

            // Create a custom notification with clickable link
            const notificationId = 'torn-virus-notification-' + Date.now();
            activeNotificationId = notificationId;
            const notification = document.createElement('div');
            notification.id = notificationId;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1a1a1a;
                color: #e0e0e0;
                padding: 20px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                max-width: 400px;
                border: 1px solid #d32f2f;
            `;
            
            let title, message;
            if (noApiKey) {
                title = '⚠️ Torn City Virus Alert - No API Key';
                message = 'No API key found. Please set your API key using the Tampermonkey menu:<br><br>Right-click the Tampermonkey icon → Torn City Virus Coding Alert → Set Api Key<br><br>Or get your API key from: <a href="https://www.torn.com/preferences.php#tab=api" style="color: #5a9eff; text-decoration: underline;">Torn City Preferences → API</a>';
            } else if (virusDone) {
                title = '✅ Torn City Virus Alert';
                message = `Virus coding is complete!<br><br>Your ${virusName} has finished coding.`;
            } else if (virusName === '' && timeLeft === 0) {
                title = '⚠️ Torn City Virus Alert';
                message = 'No active virus coding in progress.';
            } else {
                title = '⚠️ Torn City Virus Alert!';
                message = `Virus: ${virusName}<br>Time remaining: ${formatTime(timeLeft)}<br>(${daysRemaining}d ${hoursRemaining}h)`;
            }
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.type = 'button'; // Prevent form submission if inside a form
            closeBtn.style.cssText = `
                float: right;
                background: #333333;
                color: #e0e0e0;
                border: 1px solid #555555;
                padding: 8px 16px;
                border-radius: 3px;
                cursor: pointer;
                font-weight: normal;
                margin-left: 10px;
                transition: background 0.2s;
            `;
            closeBtn.onmouseover = function() { this.style.background = '#444444'; };
            closeBtn.onmouseout = function() { this.style.background = '#333333'; };
            // Use a more robust event handler
            const closeHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('Torn City Virus: Close button clicked');
                removeExistingNotifications();
            };
            closeBtn.addEventListener('click', closeHandler, true);
            // Also handle mousedown as fallback
            closeBtn.addEventListener('mousedown', closeHandler, true);
            
            const pcLink = document.createElement('a');
            pcLink.href = PC_LINK;
            pcLink.textContent = 'Open PC Page';
            pcLink.style.cssText = `
                display: inline-block;
                background: #2d5aa0;
                color: #ffffff;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 3px;
                font-weight: normal;
                border: 1px solid #3d6ab0;
                transition: background 0.2s;
            `;
            pcLink.onmouseover = function() { this.style.background = '#3d6ab0'; };
            pcLink.onmouseout = function() { this.style.background = '#2d5aa0'; };
            
            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = 'font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #ffffff;';
            titleDiv.textContent = title;
            
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = 'margin-bottom: 15px; line-height: 1.6; color: #d0d0d0; font-size: 14px;';
            messageDiv.innerHTML = message;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'margin-top: 10px;';
            buttonContainer.appendChild(pcLink);
            buttonContainer.appendChild(closeBtn);
            
            notification.appendChild(titleDiv);
            notification.appendChild(messageDiv);
            notification.appendChild(buttonContainer);
            
            console.log('Torn City Virus: Appending notification to body...');
            document.body.appendChild(notification);
            console.log('Torn City Virus: Notification displayed! Element:', notification);
            console.log('Torn City Virus: Notification parent:', notification.parentElement);
            console.log('Torn City Virus: Notification computed style:', window.getComputedStyle(notification).display);
            
            // Auto-remove after 10 seconds (or keep it until manually closed)
            notificationTimeout = setTimeout(() => {
                if (notification.parentElement && notification.id === activeNotificationId) {
                    notification.remove();
                    activeNotificationId = null;
                }
            }, 10000);
        };
        
        addNotification();
    }

    function checkVirusStatus() {
        // Don't check on pc.php page
        if (window.location.pathname === '/pc.php' || window.location.href.includes('/pc.php')) {
            console.log('Torn City Virus: Skipping check on pc.php page');
            return;
        }
        
        console.log('Torn City Virus: checkVirusStatus called');
        
        // Get the latest API key from storage
        API_KEY = GM_getValue(API_KEY_STORAGE_KEY, 'YOUR_API_KEY_HERE');
        
        if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY || API_KEY.length !== 16) {
            console.warn('Torn City Virus Alert: Please set your API_KEY using the Tampermonkey menu!');
            // Show notification that no API key was found
            showNotification('', 0, 0, 0, false, true);
            return;
        }
        
        console.log('Torn City Virus: Making API request...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.torn.com/v2/user/virus',
            headers: {
                'accept': 'application/json',
                'Authorization': `ApiKey ${API_KEY}`
            },
            onload: function(response) {
                console.log('Torn City Virus: API response received, status:', response.status);
                try {
                    if (response.status !== 200) {
                        console.error('Torn City API Error: HTTP', response.status, response.responseText);
                        return;
                    }

                    const data = JSON.parse(response.responseText);
                    console.log('Torn City Virus: API data:', data);
                    
                    // Check for API errors
                    if (data.error) {
                        console.error('Torn City API Error:', data.error);
                        return;
                    }

                    // Check if virus data exists
                    if (!data.virus || !data.virus.until) {
                        console.log('Torn City Virus: No active virus coding in progress');
                        console.log('Available data:', Object.keys(data));
                        // Show notification every hour when no virus is being programmed
                        const lastNoVirusAlertTime = GM_getValue(LAST_NO_VIRUS_ALERT_KEY, 0);
                        const now = Date.now();
                        const oneHourAgo = now - (60 * 60 * 1000);

                        if (lastNoVirusAlertTime < oneHourAgo) {
                            console.log('Torn City Virus: Showing no virus notification (once per hour)');
                            showNotification('', 0, 0, 0, false, false, false);
                            GM_setValue(LAST_NO_VIRUS_ALERT_KEY, now);
                        } else {
                            console.log('Torn City Virus: No virus notification already shown this hour, skipping');
                        }
                        return;
                    }
                    
                    console.log('Torn City Virus: Virus data found:', data.virus);

                    const virusCompletionTime = data.virus.until;
                    const virusName = data.virus.item ? data.virus.item.name : 'virus';

                    const currentTime = Math.floor(Date.now() / 1000);
                    const timeLeft = virusCompletionTime - currentTime;
                    const daysLeft = timeLeft / (24 * 60 * 60);

                    const daysRemaining = Math.floor(daysLeft);
                    const hoursRemaining = Math.floor((timeLeft % (24 * 60 * 60)) / 3600);
                    const minutesRemaining = Math.floor((timeLeft % 3600) / 60);
                    
                    console.log(`Torn City Virus (${virusName}): ${daysLeft.toFixed(2)} days remaining`);

                    // Show notification once per day when virus is active, or when virus is done
                    if (timeLeft > 0) {
                        // Prevent alert spam - only alert once per day
                        const lastAlertTime = GM_getValue(LAST_ALERT_KEY, 0);
                        const now = Date.now();
                        const oneDayAgo = now - (24 * 60 * 60 * 1000);

                        if (lastAlertTime < oneDayAgo) {
                            console.log('Torn City Virus: Showing alert notification (once per day)');
                            showNotification(virusName, timeLeft, daysRemaining, hoursRemaining, false, false, false);
                            GM_setValue(LAST_ALERT_KEY, now);
                        } else {
                            console.log('Torn City Virus: Alert already shown today, skipping');
                        }
                    } else {
                        console.log(`Torn City Virus (${virusName}): Coding is complete!`);
                        // Show notification when virus is done (once per hour)
                        const lastNoVirusAlertTime = GM_getValue(LAST_NO_VIRUS_ALERT_KEY, 0);
                        const now = Date.now();
                        const oneHourAgo = now - (60 * 60 * 1000);

                        if (lastNoVirusAlertTime < oneHourAgo) {
                            console.log('Torn City Virus: Showing virus done notification (once per hour)');
                            showNotification(virusName, 0, 0, 0, false, false, true);
                            GM_setValue(LAST_NO_VIRUS_ALERT_KEY, now);
                        }
                    }
                } catch (error) {
                    console.error('Torn City Virus Alert: Error parsing response', error);
                }
            },
            onerror: function(error) {
                console.error('Torn City Virus Alert: Network error', error);
            }
        });
    }

    function formatTime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let result = '';
        if (days > 0) result += `${days}d `;
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m`;
        
        return result.trim() || 'Less than a minute';
    }

    // Test notification immediately to verify it works (but not on pc.php)
    // Commented out to prevent duplicate notifications - uncomment for testing
    // console.log('Torn City Virus: Script loaded, testing notification...');
    // setTimeout(() => {
    //     if (window.location.pathname !== '/pc.php' && !window.location.href.includes('/pc.php')) {
    //         console.log('Torn City Virus: Testing notification function...');
    //         showNotification('Test Virus', 604800, 7, 0, true);
    //     }
    // }, 1000);
    
    // Initial check after a short delay (to let page load)
    setTimeout(checkVirusStatus, 2000);
    
    // Set up periodic checks
    setInterval(checkVirusStatus, CHECK_INTERVAL);
    
    console.log('Torn City Virus Alert script loaded. Checking every', CHECK_INTERVAL / 1000 / 60, 'minutes.');
})();

