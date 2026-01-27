// ==UserScript==
// @name         Domain Access Timer (Breathe In, Breathe Out)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Show 15-second timer before accessing specified domains
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564140/Domain%20Access%20Timer%20%28Breathe%20In%2C%20Breathe%20Out%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564140/Domain%20Access%20Timer%20%28Breathe%20In%2C%20Breathe%20Out%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration - Add your domains here
    const STORAGE_KEY_LAST_COMPLETION = 'domainTimerLastCompletion';
    const STORAGE_KEY_COOLDOWN_PERIOD = 'domainTimerCooldownPeriod';

    const BLOCKED_DOMAINS = [
        'reddit.com',
        'facebook.com',
        'x.com',
        'youtube.com'
        // Add more domains as needed
    ];

    const TIMER_DURATION = 15; // seconds
    const COOLDOWN_OPTIONS = {
        '5min': 5 * 60 * 1000,      // 5 minutes
        '20min': 20 * 60 * 1000,    // 20 minutes
        '2hours': 2 * 60 * 60 * 1000 // 2 hours
    };

    // Check if current domain should be blocked
    function shouldBlockDomain() {
        const currentDomain = window.location.hostname.replace('www.', '');
        return BLOCKED_DOMAINS.some(domain =>
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );
    }

    // Get last successful timer completion time
    function getLastTimerCompletion() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_LAST_COMPLETION);
            return stored ? parseInt(stored, 10) : 0;
        } catch (e) {
            console.error('Error getting last timer completion from localStorage:', e);
            return 0;
        }
    }

    // Set last successful timer completion time
    function setLastTimerCompletion() {
        try {
            localStorage.setItem(STORAGE_KEY_LAST_COMPLETION, Date.now().toString());
        } catch (e) {
            console.error('Error setting last timer completion in localStorage:', e);
        }
    }

    // Get selected cooldown period
    function getSelectedCooldownPeriod() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_COOLDOWN_PERIOD);
            return stored ? COOLDOWN_OPTIONS[stored] : null;
        } catch (e) {
            console.error('Error getting cooldown period from localStorage:', e);
            return null;
        }
    }

    // Set selected cooldown period
    function setSelectedCooldownPeriod(period) {
        try {
            localStorage.setItem(STORAGE_KEY_COOLDOWN_PERIOD, period);
        } catch (e) {
            console.error('Error setting cooldown period in localStorage:', e);
        }
    }

    // Check if we're still in cooldown period
    function isInCooldownPeriod() {
        const selectedPeriod = getSelectedCooldownPeriod();
        if (!selectedPeriod) return false;

        const lastCompletion = getLastTimerCompletion();
        return (Date.now() - lastCompletion) < selectedPeriod;
    }

    // Create timer overlay
    function createTimerOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'domain-timer-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        const title = document.createElement('h1');
        title.textContent = 'Breathe In, Breathe Out';
        title.style.cssText = `
            font-size: clamp(2rem, 8vw, 3rem);
            margin-bottom: clamp(1rem, 4vw, 2rem);
            font-weight: 300;
            margin-top: 0;
        `;

        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.style.cssText = `
            font-size: clamp(4rem, 20vw, 8rem);
            font-weight: bold;
            margin-bottom: clamp(1rem, 4vw, 2rem);
            color: #ff6b6b;
            line-height: 1;
        `;

        const message = document.createElement('p');
        message.textContent = `accessing ${window.location.hostname}`;
        message.style.cssText = `
            font-size: clamp(1rem, 4vw, 1.5rem);
            opacity: 0.8;
            margin-bottom: clamp(1rem, 4vw, 1.5rem);
            word-break: break-word;
        `;

        const focusWarning = document.createElement('p');
        focusWarning.textContent = 'Keep this tab in focus to continue';
        focusWarning.style.cssText = `
            font-size: clamp(0.8rem, 3vw, 1rem);
            opacity: 0.6;
            font-style: italic;
            margin-bottom: clamp(1.5rem, 6vw, 2rem);
        `;

        overlay.appendChild(title);
        overlay.appendChild(timerDisplay);
        overlay.appendChild(message);
        overlay.appendChild(focusWarning);

        return overlay;
    }

    // Create cooldown selection overlay
    function createCooldownOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'cooldown-selection-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        const title = document.createElement('h1');
        title.textContent = 'Timer Complete!';
        title.style.cssText = `
            font-size: clamp(2rem, 8vw, 3rem);
            margin-bottom: clamp(1rem, 4vw, 2rem);
            font-weight: 300;
            margin-top: 0;
            color: #4CAF50;
        `;

        const message = document.createElement('p');
        message.textContent = 'Set your cooldown period to avoid seeing this timer again:';
        message.style.cssText = `
            font-size: clamp(1rem, 4vw, 1.2rem);
            opacity: 0.9;
            margin-bottom: clamp(1.5rem, 6vw, 2rem);
            line-height: 1.4;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: clamp(12px, 3vw, 16px);
            align-items: center;
            width: 100%;
            max-width: 300px;
            margin-bottom: clamp(1.5rem, 6vw, 2rem);
        `;

        // Create cooldown buttons
        const buttons = [
            { text: '5 minutes', value: '5min' },
            { text: '20 minutes', value: '20min' },
            { text: '2 hours', value: '2hours' }
        ];

        buttons.forEach(({ text, value }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => selectCooldownAndProceed(value));

            button.style.cssText = `
                padding: clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px);
                font-size: clamp(1rem, 4vw, 1.2rem);
                border: 2px solid #4CAF50;
                background: transparent;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
                width: 100%;
                min-height: clamp(44px, 12vw, 56px);
            `;

            button.addEventListener('mouseover', () => {
                button.style.background = '#4CAF50';
            });

            button.addEventListener('mouseout', () => {
                button.style.background = 'transparent';
            });

            buttonContainer.appendChild(button);
        });

        overlay.appendChild(title);
        overlay.appendChild(message);
        overlay.appendChild(buttonContainer);

        return overlay;
    }

    // Handle cooldown period selection and proceed to site
    function selectCooldownAndProceed(period) {
        setSelectedCooldownPeriod(period);
        setLastTimerCompletion();
        proceedToSite();
    }

    // Remove overlay and show the site
    function proceedToSite() {
        const timerOverlay = document.getElementById('domain-timer-overlay');
        const cooldownOverlay = document.getElementById('cooldown-selection-overlay');

        if (timerOverlay) timerOverlay.remove();
        if (cooldownOverlay) cooldownOverlay.remove();

        document.body.style.overflow = '';
    }

    // Timer class to handle countdown logic
    class DomainTimer {
        constructor() {
            this.timeLeft = TIMER_DURATION;
            this.interval = null;
            this.overlay = null;
            this.isRunning = false;
            this.setupVisibilityListener();
        }

        setupVisibilityListener() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && this.isRunning) {
                    this.pauseTimer();
                } else if (!document.hidden && this.overlay && !this.isRunning && this.timeLeft > 0) {
                    this.resumeTimer();
                }
            });

            window.addEventListener('focus', () => {
                if (this.overlay && !this.isRunning && this.timeLeft > 0) {
                    this.resumeTimer();
                }
            });

            window.addEventListener('blur', () => {
                if (this.isRunning) {
                    this.pauseTimer();
                }
            });
        }

        start() {
            this.overlay = createTimerOverlay();
            document.body.appendChild(this.overlay);

            // Hide the original page content
            document.body.style.overflow = 'hidden';

            this.updateDisplay();
            this.resumeTimer();
        }

        updateDisplay() {
            const display = document.getElementById('timer-display');
            if (display) {
                display.textContent = this.timeLeft;
            }
        }

        pauseTimer() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                this.isRunning = false;
            }
            // Reset timer when paused
            this.timeLeft = TIMER_DURATION;
            this.updateDisplay();
        }

        resumeTimer() {
            if (this.isRunning) return;

            this.isRunning = true;
            this.interval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft <= 0) {
                    this.complete();
                }
            }, 1000);
        }

        complete() {
            if (this.interval) {
                clearInterval(this.interval);
            }

            if (this.overlay) {
                this.overlay.remove();
            }

            // Show cooldown selection screen
            const cooldownOverlay = createCooldownOverlay();
            document.body.appendChild(cooldownOverlay);

            this.isRunning = false;
        }
    }

    // Initialize the script
    function init() {
        // Only run on domains in our list
        if (!shouldBlockDomain()) {
            return;
        }

        // Check if we're in cooldown period
        if (isInCooldownPeriod()) {
            return;
        }

        // Start the timer
        const timer = new DomainTimer();
        timer.start();
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
