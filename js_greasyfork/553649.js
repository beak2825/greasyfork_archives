// ==UserScript==
// @name         DSS: Torn Chain Timeout Monitor
// @namespace    Dsuttz Scripts
// @version      4.0
// @description  Monitor faction chain timeout with visual alerts reading directly from page. Only active on chains >=10
// @author       Dsuttz
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553649/DSS%3A%20Torn%20Chain%20Timeout%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/553649/DSS%3A%20Torn%20Chain%20Timeout%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - thresholds in MM:SS format
    const GREEN_THRESHOLD = 105; // 1:45 in seconds
    const ORANGE_THRESHOLD = 85; // 1:25 in seconds
    const RED_THRESHOLD = 60;    // 1:00 in seconds
    const CHECK_INTERVAL = 1000; // Check every second
    const MIN_CHAIN_COUNT = 10;  // Minimum chain count to trigger warnings
    const minID = 3800000;
    const maxID = 3900000;

    // State variables
    let checkTimer = null;
    let currentAlertLevel = null;
    let targetDialogOpen = false;

    // Initialize
    addStyles();
    startMonitoring();

    function startMonitoring() {
        // Check immediately and then every second
        updateVisuals();
        checkTimer = setInterval(updateVisuals, CHECK_INTERVAL);
    }

    function parseTimeString(timeString) {
        // Parse time format "MM:SS" or "M:SS" into seconds
        // Returns null if chain is not active or time cannot be parsed
        if (!timeString || timeString.trim() === '') {
            return null;
        }

        const parts = timeString.split(':');
        if (parts.length !== 2) {
            return null;
        }

        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);

        if (isNaN(minutes) || isNaN(seconds)) {
            return null;
        }

        return (minutes * 60) + seconds;
    }

    function getCurrentChainCount() {
        // Find the chain count element on the page
        const chainValueElement = document.querySelector('.bar-value___uxnah');

        if (!chainValueElement) {
            return null; // Element not found
        }

        const chainText = chainValueElement.textContent.trim();
        
        // Extract the current chain count (the number before the slash)
        const match = chainText.match(/^(\d+)\//);
        
        if (!match) {
            return null;
        }

        const chainCount = parseInt(match[1], 10);
        
        if (isNaN(chainCount)) {
            return null;
        }

        return chainCount;
    }

    function getChainTimeRemaining() {
        // Find the time element on the page
        const timeElement = document.querySelector('.bar-timeleft___B9RGV');

        if (!timeElement) {
            return null; // Element not found, probably not on the right page
        }

        const timeString = timeElement.textContent.trim();
        return parseTimeString(timeString);
    }

    function updateVisuals() {
        const chainBar = document.querySelector('.chain-bar___vjdPL');

        if (!chainBar) {
            return; // Not on a page with the chain bar
        }

        const chainCount = getCurrentChainCount();
        const timeRemaining = getChainTimeRemaining();

        // If chain count is less than minimum threshold, clear all alerts and return
        if (chainCount !== null && chainCount < MIN_CHAIN_COUNT) {
            if (currentAlertLevel !== null) {
                clearAlerts(chainBar);
            }
            return;
        }

        // If we can't read the time or it's 0, clear all alerts
        if (timeRemaining === null || timeRemaining <= 0) {
            if (currentAlertLevel !== null) {
                clearAlerts(chainBar);
            }
            return;
        }

        // Determine what the alert level should be
        let targetAlertLevel = null;
        if (timeRemaining <= RED_THRESHOLD) {
            targetAlertLevel = 'red';
        } else if (timeRemaining <= ORANGE_THRESHOLD) {
            targetAlertLevel = 'orange';
        } else if (timeRemaining <= GREEN_THRESHOLD) {
            targetAlertLevel = 'green';
        } else {
            targetAlertLevel = 'none';
        }

        // Only allow valid state transitions (never go backwards)
        if (!isValidTransition(currentAlertLevel, targetAlertLevel)) {
            return;
        }

        // Update to new alert level
        if (currentAlertLevel !== targetAlertLevel) {
            currentAlertLevel = targetAlertLevel;
            applyAlertLevel(chainBar, targetAlertLevel);
        }
    }

    function isValidTransition(current, target) {
        // Valid transitions:
        // - null/none -> any
        // - green -> orange, red, or none
        // - orange -> red or none
        // - red -> none only
        // - any -> none (chain reset)

        if (current === target) {
            return true; // No change
        }

        if (target === 'none') {
            return true; // Always allow clearing
        }

        if (current === null || current === 'none') {
            return true; // Can go to any alert from none
        }

        if (current === 'green' && (target === 'orange' || target === 'red')) {
            return true;
        }

        if (current === 'orange' && target === 'red') {
            return true;
        }

        return false; // All other transitions are invalid
    }

    function clearAlerts(chainBar) {
        chainBar.classList.remove('chain-alert-green', 'chain-alert-orange', 'chain-alert-red');
        closeTargetDialog();
        currentAlertLevel = null;
    }

    function applyAlertLevel(chainBar, level) {
        // Remove all existing alert classes
        chainBar.classList.remove('chain-alert-green', 'chain-alert-orange', 'chain-alert-red');

        // Apply the appropriate alert
        if (level === 'red') {
            chainBar.classList.add('chain-alert-red');
            showTargetDialog();
        } else if (level === 'orange') {
            chainBar.classList.add('chain-alert-orange');
            closeTargetDialog();
        } else if (level === 'green') {
            chainBar.classList.add('chain-alert-green');
            closeTargetDialog();
        } else {
            closeTargetDialog();
        }
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function showTargetDialog() {
        if (targetDialogOpen && document.getElementById('chain-target-dialog')) {
            return;
        }

        targetDialogOpen = true;
        const randID = getRandomNumber(minID, maxID);
        const attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${randID}`;
        const profileLink = `https://www.torn.com/profiles.php?XID=${randID}`;

        // Create dialog element
        const dialog = document.createElement('div');
        dialog.id = 'chain-target-dialog';
        dialog.innerHTML = `
        <div class="dialog-content">
            <button class="dialog-close">×</button>
            <h3>⏰ Chain Timeout!</h3>
            <p>Quick attack random target?</p>
            <a href="${profileLink}" target="_blank" rel="noopener noreferrer" class="profile-link user name" data-user="${randID}">
                ${randID}
            </a>
            <div class="dialog-buttons">
                <a href="${attackLink}" target="_blank" class="btn-attack">Attack</a>
                <button class="btn-new-target">New Target</button>
            </div>
        </div>
    `;
        document.body.appendChild(dialog);

        // Profile link: let Torn handle mini-profile hover
        const profileLinkElement = dialog.querySelector('.profile-link');
        profileLinkElement.addEventListener('mousedown', () => {
            console.log('[Chain Monitor] Mousedown on profile link - native mini-profile will handle itself');
        });

        // Optional: simulate soft hover for mini-profile
        profileLinkElement.addEventListener('mousedown', () => {
            const hoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
            setTimeout(() => {
                console.log('[Chain Monitor] Simulating mini-profile hover');
                profileLinkElement.dispatchEvent(hoverEvent);
            }, 500);
        });

        // Buttons
        dialog.querySelector('.btn-new-target').addEventListener('click', updateTargetDialog);
        dialog.querySelector('.dialog-close').addEventListener('click', closeTargetDialog);
        dialog.querySelector('.btn-attack').addEventListener('click', () => setTimeout(closeTargetDialog, 500));

        repositionInjectedStats();
    }

    function repositionInjectedStats() {
        // Keep the stats box on the left, but ensure text has enough padding
        const checkAndReposition = () => {
            const profileLink = document.querySelector('#chain-target-dialog .profile-link');
            if (!profileLink) return;

            // Find ALL child divs (the other script injects a div)
            const allDivs = profileLink.querySelectorAll('div');

            allDivs.forEach(div => {
                // Keep it on the left side but positioned consistently
                // Only set if not already set to avoid constantly re-triggering
                if (div.style.left !== '10px') {
                    div.style.setProperty('left', '10px', 'important');
                    div.style.setProperty('right', 'auto', 'important');
                }
            });
        };

        // Run multiple times to catch the injection, but don't observe continuously
        setTimeout(checkAndReposition, 50);
        setTimeout(checkAndReposition, 100);
        setTimeout(checkAndReposition, 200);
        setTimeout(checkAndReposition, 500);
    }

    function updateTargetDialog() {
        // Close the existing dialog and open a new one with a new random ID
        closeTargetDialog();

        // Small delay to ensure clean removal before recreating
        setTimeout(() => {
            showTargetDialog();
        }, 50);
    }

    function closeTargetDialog() {
        const dialog = document.getElementById('chain-target-dialog');
        if (dialog) {
            dialog.remove();
        }
        targetDialogOpen = false;
    }

    function addStyles() {
        GM_addStyle(`
            /* Green Alert - Smooth pulse */
            @keyframes chain-pulse-green {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7),
                                0 0 15px rgba(34, 197, 94, 0.4),
                                inset 0 0 10px rgba(34, 197, 94, 0.2);
                }
                50% {
                    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0),
                                0 0 25px rgba(34, 197, 94, 0.6),
                                inset 0 0 15px rgba(34, 197, 94, 0.3);
                }
            }

            .chain-alert-green {
                animation: chain-pulse-green 2s ease-in-out infinite !important;
                border: 2px solid rgb(34, 197, 94) !important;
                border-radius: 8px !important;
            }

            /* Orange Alert - Moderate pulse */
            @keyframes chain-pulse-orange {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7),
                                0 0 20px rgba(249, 115, 22, 0.5),
                                inset 0 0 12px rgba(249, 115, 22, 0.25);
                }
                50% {
                    box-shadow: 0 0 0 10px rgba(249, 115, 22, 0),
                                0 0 35px rgba(249, 115, 22, 0.7),
                                inset 0 0 18px rgba(249, 115, 22, 0.35);
                }
            }

            .chain-alert-orange {
                animation: chain-pulse-orange 1.5s ease-in-out infinite !important;
                border: 2px solid rgb(249, 115, 22) !important;
                border-radius: 8px !important;
            }

            /* Red Alert - Urgent flash */
            @keyframes chain-flash-red {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8),
                                0 0 25px rgba(239, 68, 68, 0.6),
                                inset 0 0 15px rgba(239, 68, 68, 0.3);
                    background-color: rgba(239, 68, 68, 0.05);
                }
                50% {
                    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0),
                                0 0 45px rgba(239, 68, 68, 0.9),
                                inset 0 0 25px rgba(239, 68, 68, 0.4);
                    background-color: rgba(239, 68, 68, 0.15);
                }
            }

            .chain-alert-red {
                animation: chain-flash-red 0.8s ease-in-out infinite !important;
                border: 3px solid rgb(239, 68, 68) !important;
                border-radius: 8px !important;
            }

            /* Target Dialog - Non-blocking corner notification */
            #chain-target-dialog {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 999999;
            }

            #chain-target-dialog .dialog-content {
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                border: 2px solid rgb(239, 68, 68);
                border-radius: 12px;
                padding: 25px;
                width: 320px;
                box-shadow: 0 20px 60px rgba(239, 68, 68, 0.4),
                            0 0 100px rgba(239, 68, 68, 0.2),
                            0 10px 40px rgba(0, 0, 0, 0.5);
                position: relative;
                animation: dialog-slide-in 0.3s ease-out;
            }

            @keyframes dialog-slide-in {
                from {
                    transform: translateX(-400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            #chain-target-dialog .dialog-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.4);
                color: rgb(239, 68, 68);
                width: 28px;
                height: 28px;
                border-radius: 50%;
                font-size: 20px;
                line-height: 1;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #chain-target-dialog .dialog-close:hover {
                background: rgba(239, 68, 68, 0.4);
                transform: rotate(90deg);
            }

            #chain-target-dialog h3 {
                margin: 0 0 12px 0;
                color: rgb(239, 68, 68);
                font-size: 20px;
                font-weight: 600;
                text-align: center;
                padding-right: 20px;
            }

            #chain-target-dialog p {
                margin: 8px 0;
                color: #e5e7eb;
                font-size: 15px;
                text-align: center;
            }

            #chain-target-dialog .profile-link {
                display: inline-block;
                font-family: 'Courier New', monospace;
                font-size: 17px;
                font-weight: bold;
                color: #fbbf24;
                text-decoration: none;
                margin: 8px 0 16px 0;
                padding: 7px 18px 7px 65px;
                border-radius: 6px;
                background: transparent;
                position: relative;
                min-width: 155px;
                text-align: left;
            }

            /* Force reposition any injected divs from other scripts */
            #chain-target-dialog .profile-link > div,
            #chain-target-dialog .profile-link div[class*="Div"],
            #chain-target-dialog .profile-link div[class*="Stats"],
            #chain-target-dialog .profile-link div[style*="position: absolute"] {
                left: 10px !important;
                right: auto !important;
                margin-left: 0 !important;
            }

            #chain-target-dialog .dialog-content > a.profile-link {
                display: block;
                width: fit-content;
                margin-left: auto;
                margin-right: auto;
            }

            #chain-target-dialog .profile-link:hover {
                color: #fcd34d;
                text-decoration: underline;
            }

            #chain-target-dialog .profile-link:active {
                color: #fcd34d;
            }

            #chain-target-dialog .dialog-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            #chain-target-dialog .btn-attack,
            #chain-target-dialog .btn-new-target {
                flex: 1;
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                text-align: center;
                display: inline-block;
            }

            #chain-target-dialog .btn-attack {
                background: linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(220, 38, 38) 100%);
                color: white;
            }

            #chain-target-dialog .btn-attack:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
            }

            #chain-target-dialog .btn-new-target {
                background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
                color: white;
            }

            #chain-target-dialog .btn-new-target:hover {
                background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                transform: translateY(-2px);
            }
        `);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (checkTimer) {
            clearInterval(checkTimer);
        }
    });

})();