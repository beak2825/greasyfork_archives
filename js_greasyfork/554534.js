// ==UserScript==
// @name         Torn PDA Prayer Timer
// @namespace    Randys Tools
// @version      2.3-mobile
// @description  Prayer timer for Torn PDA that tracks time since last prayer
// @author       Randy
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @match        *://www.torn.com/*
// @match        *://torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554534/Torn%20PDA%20Prayer%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/554534/Torn%20PDA%20Prayer%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_prayer_timer_mobile';
    const HOURS_48 = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const HOURS_36 = 36 * 60 * 60 * 1000; // 36 hours in milliseconds
    const HOURS_24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let timerElement;
    let intervalId;
    let initAttempts = 0;
    const maxInitAttempts = 15; // More attempts for mobile
    let isTouch = false;

    // Detect if device supports touch
    function detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Create the mobile-optimized timer button
    function createTimerButton() {
        // Remove existing timer if it exists
        const existing = document.getElementById('prayer-timer-btn-mobile');
        if (existing) {
            existing.remove();
        }

        isTouch = detectTouch();
        
        const button = document.createElement('div');
        button.id = 'prayer-timer-btn-mobile';
        
        // Mobile-optimized styling
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            transition: all 0.2s ease;
            min-width: 160px;
            max-width: 200px;
            text-align: center;
            user-select: none;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            word-wrap: break-word;
            line-height: 1.3;
        `;

        // Enhanced mobile event handlers
        const events = isTouch ? ['touchstart', 'touchend'] : ['mousedown', 'mouseup', 'click'];
        
        let touchStartTime = 0;
        let touchMoved = false;

        // Touch/click handlers
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchStartTime = Date.now();
            touchMoved = false;
            this.style.transform = 'scale(0.95)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.4)';
        }, { passive: false });

        button.addEventListener('touchmove', function(e) {
            touchMoved = true;
        }, { passive: true });

        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            
            // Only navigate if it was a quick tap and didn't move
            if (!touchMoved && touchDuration < 500) {
                setTimeout(() => {
                    window.location.href = 'https://www.torn.com/church.php';
                }, 100);
            }
        }, { passive: false });

        // Fallback for non-touch devices
        if (!isTouch) {
            button.addEventListener('click', function() {
                window.location.href = 'https://www.torn.com/church.php';
            });

            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            });
        }

        // Prevent context menu on long press
        button.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        document.body.appendChild(button);
        timerElement = button;
        console.log('Mobile prayer timer button created successfully');
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

        console.log('Mobile prayer timer reset - starting from 0');
    }

    // Format time elapsed (mobile-friendly)
    function formatTimeElapsed(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
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
            timerElement.innerHTML = '💀 You suck,<br>try again';
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

    // Enhanced mobile-compatible button monitoring
    function monitorPrayButton() {
        // Handle both touch and click events
        const eventTypes = isTouch ? ['touchend', 'click'] : ['click'];
        
        eventTypes.forEach(eventType => {
            document.addEventListener(eventType, function(e) {
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
                    console.log('Pray button clicked (mobile) - resetting timer');
                    setTimeout(() => {
                        resetTimer();
                        updateTimerDisplay();
                    }, 200); // Longer delay for mobile
                    return;
                }
                
                // Also check parent elements
                let parent = target.parentElement;
                let depth = 0;
                while (parent && parent !== document.body && depth < 5) {
                    const parentText = parent.textContent?.trim() || '';
                    const parentValue = parent.value?.trim() || '';
                    
                    if (parentText.toLowerCase() === 'pray' || parentValue.toLowerCase() === 'pray') {
                        console.log('Pray button (parent, mobile) clicked - resetting timer');
                        setTimeout(() => {
                            resetTimer();
                            updateTimerDisplay();
                        }, 200);
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
            }, { passive: false });
        });
    }

    // Check if timer is visible and recreate if needed
    function ensureTimerVisible() {
        const existing = document.getElementById('prayer-timer-btn-mobile');
        if (!existing && document.body) {
            console.log('Mobile timer not found, recreating...');
            createTimerButton();
            updateTimerDisplay();
        }
    }

    // Enhanced mobile initialization
    function init() {
        initAttempts++;
        
        // Wait for document body to be available
        if (!document.body) {
            if (initAttempts < maxInitAttempts) {
                console.log(`Mobile init attempt ${initAttempts}: waiting for document.body...`);
                setTimeout(init, 150); // Slightly longer for mobile
            } else {
                console.error('Failed to initialize mobile timer: document.body not available');
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

        // Set up visibility check interval (more frequent for mobile)
        setInterval(ensureTimerVisible, 3000); // Check every 3 seconds

        console.log('Torn Prayer Timer (Mobile) initialized successfully');
    }

    // Enhanced mobile initialization strategies
    function startInitialization() {
        // Strategy 1: Immediate if DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(init, 100);
        }
        
        // Strategy 2: DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 200);
            });
        }
        
        // Strategy 3: Window load (fallback)
        window.addEventListener('load', () => {
            setTimeout(init, 300);
        });
        
        // Strategy 4: Multiple retry attempts for mobile
        setTimeout(() => {
            if (!document.getElementById('prayer-timer-btn-mobile')) {
                init();
            }
        }, 500);

        setTimeout(() => {
            if (!document.getElementById('prayer-timer-btn-mobile')) {
                init();
            }
        }, 1000);

        setTimeout(() => {
            if (!document.getElementById('prayer-timer-btn-mobile')) {
                init();
            }
        }, 2000);
    }

    // Handle mobile page navigation and dynamic content
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            // Ensure timer is still visible after navigation (longer delay for mobile)
            setTimeout(ensureTimerVisible, 1500);
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
            setTimeout(startObserver, 200);
        }
    }

    // Mobile-specific viewport handling
    function handleViewportChanges() {
        // Ensure timer stays visible during orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                ensureTimerVisible();
            }, 500);
        });

        // Handle mobile viewport changes
        window.addEventListener('resize', () => {
            setTimeout(() => {
                if (timerElement) {
                    // Reposition if needed
                    timerElement.style.top = '10px';
                    timerElement.style.right = '10px';
                }
            }, 300);
        });
    }

    // Start everything
    startInitialization();
    startObserver();
    handleViewportChanges();

    // Enhanced cleanup for mobile
    window.addEventListener('beforeunload', () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        observer.disconnect();
    });

    // Mobile-specific page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, ensure timer is still there
            setTimeout(ensureTimerVisible, 500);
        }
    });

})();
