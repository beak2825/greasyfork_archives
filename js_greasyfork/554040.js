// ==UserScript==
// @name         Sidebar Countdown Alarm with Test Icon
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Alarms when the sidebar chain countdown timer drops below 2 minutes (120s). Sound is a "pep-pep" tone. Test button is a small icon. Notifications focus the tab.
// @author       Gemini
// @match        https://www.torn.com/*
// @grant        GM_notification
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554040/Sidebar%20Countdown%20Alarm%20with%20Test%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/554040/Sidebar%20Countdown%20Alarm%20with%20Test%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Selector for the "Chain: 4324/5k 04:58" element's time component
    const TARGET_SELECTOR = '#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA > p.bar-timeleft___B9RGV';
    // Selector for the parent element where we will place the test button
    const PARENT_SELECTOR = '#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA';
    const ALARM_THRESHOLD_SECONDS = 100; // 2 minutes
    let alarmTriggered = false;

    // --- Core Alarm Function ---

    /**
     * Plays a distinct "pep-pep" sound (two short, high tones).
     */
    function playPepPepSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const context = new AudioContext();

            // Function to create a single tone
            const createTone = (frequency, duration, delay) => {
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
                gainNode.gain.setValueAtTime(1, context.currentTime + delay);

                oscillator.connect(gainNode);
                gainNode.connect(context.destination);

                oscillator.start(context.currentTime + delay);
                // Stop the sound after the duration
                oscillator.stop(context.currentTime + delay + duration);
            };

            // Pep 1: High pitch, short duration
            createTone(1000, 0.3, 0);

            // Pep 2: Slightly lower pitch, short duration, with a small delay
            createTone(800, 0.3, 0.2);

             // Pep 1: High pitch, short duration
            createTone(1000, 0.3, 0.2);

            // Pep 2: Slightly lower pitch, short duration, with a small delay
            createTone(800, 0.3, 0.2);

        } catch (e) {
            console.error("Could not play alarm sound:", e);
        }
    }

    /**
     * Triggers the alarm: plays sound and shows a notification.
     * @param {string} currentTime - The time string (e.g., '01:59').
     * @param {boolean} isTest - Flag to indicate if this is a test run.
     */
    function triggerAlarm(currentTime, isTest = false) {
        const title = isTest ? '🚨 TEST ALARM 🚨' : '🚨 CHAIN WARNING 🚨';
        const text = isTest ? `TEST SUCCESSFUL! Time: ${currentTime}` : `Time is critically low: ${currentTime}`;

        if (!isTest && alarmTriggered) return;
        if (!isTest) {
            alarmTriggered = true; // Prevents repeated alarms during a real chain drop
        }

        console.log(`[Countdown Alarm] ${isTest ? 'Test' : 'Alarm'} triggered. Time: ${currentTime}`);

        // 1. Audible Alarm (Sound)
        playPepPepSound();

        // 2. Visual Alarm (Notification)
        if (typeof GM_notification === 'function') {
            GM_notification({
                title: title,
                text: text,
                image: 'https://www.torn.com/favicon.ico',
                timeout: isTest ? 5000 : 10000,
                onclick: function() { // This will bring the tab to focus when clicked
                    window.focus();
                }
            });
        }
    }


    // --- Timer Monitoring Logic ---

    /**
     * Parses a 'MM:SS' time string into total seconds.
     */
    function parseTimeToSeconds(timeString) {
        const parts = timeString.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                return (minutes * 60) + seconds;
            }
        }
        return NaN;
    }

    /**
     * The main logic to check the timer value.
     */
    function checkTimer(element) {
        const timeString = element.textContent.trim();
        const secondsRemaining = parseTimeToSeconds(timeString);

        if (isNaN(secondsRemaining)) {
            return;
        }

        if (secondsRemaining > 0 && secondsRemaining <= ALARM_THRESHOLD_SECONDS) {
            triggerAlarm(timeString, false); // Trigger for a real countdown
        } else if (secondsRemaining > ALARM_THRESHOLD_SECONDS) {
            alarmTriggered = false; // Reset for new chains
        }
    }


    // --- Test Button UI Logic ---

    function createTestButton(parentContainer) {
        const testButton = document.createElement('button');
        testButton.textContent = '🔊'; // Only the speaker icon
        testButton.title = 'Test Alarm'; // Add a tooltip for clarity
        testButton.style.cssText = `
            background-color: #ff9900;
            color: #111;
            border: none;
            border-radius: 3px;
            padding: 0px 4px; /* Reduced padding for minimal height */
            margin-left: 5px; /* Reduced margin */
            cursor: pointer;
            font-size: 10px; /* Kept small, but readable */
            line-height: 1.2; /* Tighter line height */
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
            transition: background-color 0.1s;
        `;
        testButton.onmouseover = function() { this.style.backgroundColor = '#ffc04d'; };
        testButton.onmouseout = function() { this.style.backgroundColor = '#ff9900'; };
        testButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerAlarm('01:59', true); // Run test alarm
        };

        // Append the button to the Chain stats container
        parentContainer.appendChild(testButton);
    }

    // --- Main Setup Function ---

    const findAndObserve = () => {
        const targetElement = document.querySelector(TARGET_SELECTOR);
        const parentContainer = document.querySelector(PARENT_SELECTOR);

        if (targetElement && parentContainer) {
            console.log("[Countdown Alarm] Target elements found. Initializing...");

            // 1. Create the Test Button
            createTestButton(parentContainer);

            // 2. Initial check
            checkTimer(targetElement);

            // 3. Set up the MutationObserver for the timer
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        checkTimer(targetElement);
                    }
                }
            });

            observer.observe(targetElement, {
                childList: true,
                subtree: true,
                characterData: true
            });

        } else {
            setTimeout(findAndObserve, 2000); // Keep trying to find elements
        }
    };

    // Start the process
    findAndObserve();
})();