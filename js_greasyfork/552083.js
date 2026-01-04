// ==UserScript==
// @name         Torn.com Bootlegging Collect Button Beep
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Plays a beep and shows a speaker icon when the Collect button on Torn.com Crimes 2.0 Bootlegging page is ready, and makes the Collect button larger
// @author       You (with Grok's help)
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552083/Torncom%20Bootlegging%20Collect%20Button%20Beep.user.js
// @updateURL https://update.greasyfork.org/scripts/552083/Torncom%20Bootlegging%20Collect%20Button%20Beep.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Target the specific Collect button
    const primarySelector = 'button.torn-btn.grey.commit-button.commitButton___NYsg8.btn-dark-bg[aria-label^="Collect"]';

    // Sound settings
    const beepFrequency = 800; // Hz (pitch)
    const beepDuration = 200; // ms
    const beepInterval = 65000; // ms between repeated beeps if still enabled (set to 0 for no repeats)

    let audioContext = null;
    let lastBeepTime = 0; // Prevent spam beeps
    let soundEnabled = true; // Toggle for sound
    let currentButton = null; // Track current button reference
    let wasEnabled = false; // Track state for transition detection
    let intervalId = null; // For polling interval
    let observer = null; // For MutationObserver

    // Check if on bootlegging page
    function isBootleggingPage() {
        return window.location.hash === '#/bootlegging';
    }

    // Expose toggle in console
    window.toggleBeep = function() {
        soundEnabled = !soundEnabled;
        console.log(`Beep sound ${soundEnabled ? 'enabled' : 'disabled'}`);
        if (currentButton && currentButton.nextSibling && currentButton.nextSibling.classList.contains('beep-icon')) {
            currentButton.nextSibling.textContent = soundEnabled ? '🔊' : '🔇';
        }
    };

    // Initialize audio context
    function initAudio() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('AudioContext initialized');
            } catch (e) {
                console.error('Failed to initialize AudioContext:', e);
            }
        }
    }

    // Play beep sound
    function playBeep() {
        if (!soundEnabled) return;

        const now = Date.now();
        if (now - lastBeepTime < 1000) return; // Base throttle
        lastBeepTime = now;

        initAudio();
        if (!audioContext) return;

        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = beepFrequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + beepDuration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + beepDuration / 1000);
            console.log('Beep played');
        } catch (e) {
            console.error('Error playing beep:', e);
        }
    }

    // Add speaker icon (check if already present for this button)
    function addSpeakerIcon(button) {
        // Remove old icon if button changed
        if (currentButton && currentButton !== button) {
            const oldIcon = currentButton.nextSibling && currentButton.nextSibling.classList.contains('beep-icon') ? currentButton.nextSibling : null;
            if (oldIcon) {
                oldIcon.remove();
                console.log('Old speaker icon removed (button changed)');
            }
            wasEnabled = false; // Reset state on button change
        }

        // Check if icon already exists next to this button
        const existingIcon = button.nextSibling && button.nextSibling.classList.contains('beep-icon');
        if (existingIcon) return;

        const speakerIcon = document.createElement('span');
        speakerIcon.innerHTML = '🔊';
        speakerIcon.classList.add('beep-icon'); // For easy identification
        speakerIcon.style.marginLeft = '5px';
        speakerIcon.style.fontSize = '16px';
        speakerIcon.style.verticalAlign = 'middle';
        speakerIcon.style.cursor = 'pointer';
        speakerIcon.title = 'Button Beep Script Active (click to toggle mute)';
        speakerIcon.onclick = () => window.toggleBeep();
        button.parentNode.insertBefore(speakerIcon, button.nextSibling);
        console.log('Speaker icon added to new button');
    }

    // Make the button huge by applying styles
    function makeButtonHuge(button) {
        if (button.classList.contains('huge-button')) return; // Already styled

        button.style.fontSize = '2em';
        button.style.padding = '20px 40px';
        button.style.transform = 'scale(1.5)'; // Scale up for emphasis, adjust as needed
        button.style.margin = '10px'; // Add some space to avoid overlap
        button.classList.add('huge-button'); // Mark as styled to prevent re-application
        console.log('Collect button made huge');
    }

    // Find button with fallback
    function findButton() {
        let button = document.querySelector(primarySelector);
        if (!button) {
            // Fallback: find button with aria-label starting with "Collect" or textContent including "Collect"
            const buttons = Array.from(document.querySelectorAll('button.commitButton___NYsg8'));
            button = buttons.find(btn => {
                const ariaLabel = btn.getAttribute('aria-label') || '';
                const text = btn.textContent.trim();
                return ariaLabel.startsWith('Collect') || text.startsWith('Collect');
            });
        }
        return button;
    }

    // Check button state
    function checkButton() {
        if (!isBootleggingPage()) {
            console.log('Not on bootlegging page - skipping check');
            return;
        }

        const button = findButton();
        if (!button) {
            console.log('Collect button not found');
            if (currentButton) {
                // Lost the button, clean up
                const oldIcon = currentButton.nextSibling && currentButton.nextSibling.classList.contains('beep-icon') ? currentButton.nextSibling : null;
                if (oldIcon) oldIcon.remove();
                currentButton = null;
                wasEnabled = false;
            }
            return;
        }

        // Button found, make it huge
        makeButtonHuge(button);

        // Update reference if changed
        const buttonChanged = currentButton !== button;
        if (buttonChanged) {
            console.log('New Collect button instance detected');
            currentButton = button;
            addSpeakerIcon(button);
            wasEnabled = false; // Reset on new button
        } else {
            addSpeakerIcon(button); // Still check/add icon
        }

        const ariaDisabled = button.getAttribute('aria-disabled');
        const isVisible = button.offsetParent !== null;
        const isEnabled = ariaDisabled === 'false' && isVisible;

        console.log(`Collect button check: aria-disabled="${ariaDisabled}", visible=${isVisible}, enabled=${isEnabled}, wasEnabled=${wasEnabled}, changed=${buttonChanged}`);

        if (isEnabled) {
            const now = Date.now();
            const timeSinceLastBeep = now - lastBeepTime;
            if (!wasEnabled || (beepInterval > 0 && timeSinceLastBeep >= beepInterval)) {
                console.log('Button ready - beeping! (newly enabled or repeat interval)');
                playBeep();
            } else {
                console.log('Button enabled (already notified, waiting for interval if set)');
            }
            wasEnabled = true;
        } else {
            console.log('Button disabled or not visible - resetting state');
            wasEnabled = false;
            lastBeepTime = 0; // Allow immediate beep on re-enable
        }
    }

    // Start the script logic
    function startScript() {
        if (intervalId) return; // Already running

        // Initial check after a short delay
        setTimeout(checkButton, 500);

        // Poll every 1 second
        intervalId = setInterval(checkButton, 1000);

        // Watch for DOM changes
        observer = new MutationObserver(() => {
            checkButton();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-disabled', 'class', 'style', 'aria-label']
        });

        console.log('Script started on bootlegging page');
    }

    // Stop the script logic
    function stopScript() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        // Clean up icon if present
        if (currentButton) {
            const oldIcon = currentButton.nextSibling && currentButton.nextSibling.classList.contains('beep-icon') ? currentButton.nextSibling : null;
            if (oldIcon) oldIcon.remove();
            currentButton = null;
        }
        wasEnabled = false;
        lastBeepTime = 0;
        console.log('Script stopped (not on bootlegging page)');
    }

    // Initial check
    if (isBootleggingPage()) {
        startScript();
    }

    // Listen for hash changes (for SPA navigation)
    window.addEventListener('hashchange', () => {
        if (isBootleggingPage()) {
            startScript();
        } else {
            stopScript();
        }
    });

    console.log('Torn Bootlegging Collect Button Beep script loaded! Active only on #/bootlegging. Use toggleBeep() in console or click icon to mute/unmute. Check console for detailed logs.');
})();