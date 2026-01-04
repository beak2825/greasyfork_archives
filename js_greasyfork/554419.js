// ==UserScript==
// @name         Prayer Timer
// @namespace    Randy's Tools
// @version      2.3
// @description  Prayer timer for Torn that tracks time since last prayer
// @author       Randy
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554419/Prayer%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/554419/Prayer%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_prayer_timer';
    const HOURS_48 = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const HOURS_36 = 36 * 60 * 60 * 1000; // 36 hours in milliseconds
    const HOURS_24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let timerElement;
    let intervalId;
    let initAttempts = 0;
    const maxInitAttempts = 10;

    // Create the timer button
    function createTimerButton() {
        // Remove existing timer if it exists
        const existing = document.getElementById('prayer-timer-btn');
        if (existing) {
            existing.remove();
        }

        const button = document.createElement('div');
        button.id = 'prayer-timer-btn';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            min-width: 140px;
            text-align: center;
            user-select: none;
            cursor: pointer;
        `;

        // Add click handler to navigate to church
        button.addEventListener('click', function() {
            window.location.href = 'https://www.torn.com/church.php';
        });

        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        document.body.appendChild(button);
        timerElement = button;
        console.log('Prayer timer button created successfully');
        return button;
    }

    // Get stored timer data
    function getTimerData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing timer data:', e);
            }
        }
        return null;
    }

    // Save timer data
    function saveTimerData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Reset the timer (start from 0)
    function resetTimer() {
        const now = Date.now();
        
        saveTimerData({
            startTime: now,
            isActive: true
        });

        console.log('Prayer timer reset - starting from 0');
    }

    // Format time elapsed
    function formatTimeElapsed(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Update timer display
    function updateTimerDisplay() {
        if (!timerElement) {
            console.warn('Timer element not found, attempting to recreate...');
            if (document.body) {
                createTimerButton();
            }
            return;
        }

        const timerData = getTimerData();
        
        if (!timerData || !timerData.isActive) {
            // No timer data, start from 0
            resetTimer();
            timerElement.innerHTML = '⛪ 0s';
            timerElement.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            return;
        }

        const now = Date.now();
        const timeElapsed = now - timerData.startTime;
        
        if (timeElapsed >= HOURS_48) {
            // Past 48 hours - shame message
            timerElement.innerHTML = '💀 You suck, try again';
            timerElement.style.background = 'linear-gradient(135deg, #424242 0%, #212121 100%)';
        } else if (timeElapsed >= HOURS_36) {
            // 36-48 hours - red
            const formatted = formatTimeElapsed(timeElapsed);
            timerElement.innerHTML = `🔴 ${formatted}`;
            timerElement.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
        } else if (timeElapsed >= HOURS_24) {
            // 24-36 hours - yellow
            const formatted = formatTimeElapsed(timeElapsed);
            timerElement.innerHTML = `🟡 ${formatted}`;
            timerElement.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
        } else {
            // 0-24 hours - green
            const formatted = formatTimeElapsed(timeElapsed);
            timerElement.innerHTML = `🟢 ${formatted}`;
            timerElement.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        }
    }

    // Monitor for pray button clicks ONLY
    function monitorPrayButton() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            
            // Only check if we're on the church page
            if (!window.location.href.includes('/church.php')) {
                return;
            }
            
            // Check for exact "Pray" text or value
            const text = target.textContent?.trim() || '';
            const value = target.value?.trim() || '';
            
            // Look for exact "Pray" match (case insensitive)
            if (text.toLowerCase() === 'pray' || value.toLowerCase() === 'pray') {
                console.log('Pray button clicked - resetting timer');
                setTimeout(() => {
                    resetTimer();
                    updateTimerDisplay();
                }, 100);
            }
            
            // Also check parent elements in case the text is in a span inside a button
            let parent = target.parentElement;
            while (parent && parent !== document.body) {
                const parentText = parent.textContent?.trim() || '';
                const parentValue = parent.value?.trim() || '';
                
                if (parentText.toLowerCase() === 'pray' || parentValue.toLowerCase() === 'pray') {
                    console.log('Pray button (parent) clicked - resetting timer');
                    setTimeout(() => {
                        resetTimer();
                        updateTimerDisplay();
                    }, 100);
                    break;
                }
                parent = parent.parentElement;
            }
        });
    }

    // Check if timer is visible and recreate if needed
    function ensureTimerVisible() {
        const existing = document.getElementById('prayer-timer-btn');
        if (!existing && document.body) {
            console.log('Timer not found, recreating...');
            createTimerButton();
            updateTimerDisplay();
        }
    }

    // Initialize the extension with retry mechanism
    function init() {
        initAttempts++;
        
        // Wait for document body to be available
        if (!document.body) {
            if (initAttempts < maxInitAttempts) {
                console.log(`Init attempt ${initAttempts}: waiting for document.body...`);
                setTimeout(init, 100);
            } else {
                console.error('Failed to initialize: document.body not available');
            }
            return;
        }

        // Create timer button
        createTimerButton();
        
        // Start timer updates
        updateTimerDisplay();
        
        // Clear any existing interval
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(updateTimerDisplay, 1000);

        // Monitor for pray button clicks
        monitorPrayButton();

        // Set up visibility check interval
        setInterval(ensureTimerVisible, 5000); // Check every 5 seconds

        console.log('Torn Prayer Timer initialized successfully');
    }

    // Multiple initialization strategies
    function startInitialization() {
        // Strategy 1: Immediate if DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(init, 50);
        }
        
        // Strategy 2: DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 100);
            });
        }
        
        // Strategy 3: Window load (fallback)
        window.addEventListener('load', () => {
            setTimeout(init, 200);
        });
        
        // Strategy 4: Immediate retry (for dynamic pages)
        setTimeout(() => {
            if (!document.getElementById('prayer-timer-btn')) {
                init();
            }
        }, 500);
    }

    // Handle page navigation and dynamic content
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            // Ensure timer is still visible after navigation
            setTimeout(ensureTimerVisible, 1000);
        }
    });

    // Start observing when body is available
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(startObserver, 100);
        }
    }

    // Start everything
    startInitialization();
    startObserver();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        observer.disconnect();
    });

})();