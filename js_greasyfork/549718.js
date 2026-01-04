// ==UserScript==
// @name         Torn Execute Indicator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows EXECUTE indicator when opponent can be executed
// @author       PedroXimenez
// @match        *://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549718/Torn%20Execute%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/549718/Torn%20Execute%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're on an attack page (loader.php?sid=attack)
    if (!window.location.pathname.includes('loader.php')) {
        return; // Exit if not on loader.php
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sid') !== 'attack') {
        return; // Exit if not on attack page
    }

    // Store last logged values to avoid duplicate console output (on window to persist)
    if (!window.executeLastLoggedValues) {
        window.executeLastLoggedValues = {
            executeThreshold: null,
            opponentHealth: null,
            lifePercentage: null,
            canExecute: null
        };
    }

    function canExecuteTarget(html) {
        // Extract execute percentage (e.g., "15%" from "below 15% life")
        const executeMatch = html.match(/below\s+(\d+)%\s+life/i);
        if (!executeMatch) {
            return false; // No execute threshold found
        }
        const executeThreshold = parseInt(executeMatch[1]);

        // Find all player divs
        const playerDivs = document.querySelectorAll('[class*="player___"]');

        if (playerDivs.length < 2) {
            return false; // Need at least 2 players
        }

        // Find the opponent's player div (the one without attack buttons)
        let opponentDiv = null;
        for (const playerDiv of playerDivs) {
            const hasAttackButtons = playerDiv.querySelector('[aria-label*="Attack with"]');
            if (!hasAttackButtons) {
                opponentDiv = playerDiv;
                break;
            }
        }

        if (!opponentDiv) {
            return false; // Couldn't find opponent div
        }

        // Extract health from the opponent's div
        const healthElement = opponentDiv.querySelector('[id*="player-health-value"]');
        if (!healthElement) {
            return false; // No health element found
        }

        const healthText = healthElement.textContent;
        const healthMatch = healthText.match(/(\d{1,3}(?:,\d{3})*)\s*\/\s*(\d{1,3}(?:,\d{3})*)/);

        if (!healthMatch) {
            return false; // Couldn't parse health values
        }

        const opponentHealth = {
            current: parseInt(healthMatch[1].replace(/,/g, '')),
            max: parseInt(healthMatch[2].replace(/,/g, ''))
        };

        // Calculate life percentage
        const lifePercentage = (opponentHealth.current / opponentHealth.max) * 100;

        // Check if life percentage is at or below the execute threshold
        const canExecute = lifePercentage <= executeThreshold;

        // Only log if values have changed
        const currentHealthStr = `${opponentHealth.current}/${opponentHealth.max}`;
        const currentLifePercentage = lifePercentage.toFixed(2);

        if (window.executeLastLoggedValues.executeThreshold !== executeThreshold ||
            window.executeLastLoggedValues.opponentHealth !== currentHealthStr ||
            window.executeLastLoggedValues.lifePercentage !== currentLifePercentage ||
            window.executeLastLoggedValues.canExecute !== canExecute) {

            console.log(`Execute threshold: ${executeThreshold}%`);
            console.log(`Opponent health: ${currentHealthStr}`);
            console.log(`Opponent life percentage: ${currentLifePercentage}%`);
            console.log(`Can execute: ${canExecute}`);

            // Update last logged values
            window.executeLastLoggedValues.executeThreshold = executeThreshold;
            window.executeLastLoggedValues.opponentHealth = currentHealthStr;
            window.executeLastLoggedValues.lifePercentage = currentLifePercentage;
            window.executeLastLoggedValues.canExecute = canExecute;
        }

        // Add EXECUTE indicator to the figure if can execute
        if (canExecute) {
            // Find the figure element that contains the execute weapon
            const executeElement = document.querySelector('[data-bonus-attachment-description*="below"][data-bonus-attachment-description*="life"]');
            if (executeElement) {
                // Find the nearest figure element (should be a sibling or nearby)
                const weaponWrapper = executeElement.closest('.weaponWrapper___h3buK');
                if (weaponWrapper) {
                    const figure = weaponWrapper.querySelector('figure');
                    if (figure && !figure.querySelector('.execute-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'execute-indicator';
                        indicator.textContent = 'EXECUTE';
                        indicator.style.cssText = `
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            color: red;
                            font-weight: bold;
                            font-size: 20px;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                            pointer-events: none;
                            z-index: 1000;
                        `;
                        figure.style.position = 'relative';
                        figure.appendChild(indicator);
                    }
                }
            }
        }

        return canExecute;
    }

    // Function to remove existing EXECUTE indicators
    function removeExecuteIndicators() {
        const indicators = document.querySelectorAll('.execute-indicator');
        indicators.forEach(indicator => indicator.remove());
    }

    // Function to run the check and update display
    function checkAndUpdate() {
        removeExecuteIndicators(); // Clear any existing indicators
        const result = canExecuteTarget(document.documentElement.innerHTML);
        return result;
    }

    // Set up continuous monitoring
    function startMonitoring(intervalMs = 250) {
        // First check if there's an execute attachment on the page
        const hasExecuteAttachment = document.querySelector('[data-bonus-attachment-description*="below"][data-bonus-attachment-description*="life"]');

        if (!hasExecuteAttachment) {
            console.log('No execute attachment found on this page - monitoring not started');
            return null;
        }

        // Initial check
        checkAndUpdate();

        // Set up interval for continuous checking
        const intervalId = setInterval(checkAndUpdate, intervalMs);

        console.log(`Execute monitor started (checking every ${intervalMs}ms)`);
        console.log('To stop monitoring, run: stopMonitoring()');

        // Store the interval ID globally so it can be stopped
        window.executeMonitorInterval = intervalId;

        return intervalId;
    }

    // Function to stop monitoring
    function stopMonitoring() {
        if (window.executeMonitorInterval) {
            clearInterval(window.executeMonitorInterval);
            removeExecuteIndicators();
            console.log('Execute monitor stopped');
            delete window.executeMonitorInterval;
        }
    }

    // Wait for page to load before starting monitoring
    // Torn dynamically loads content, so we need to wait a bit
    setTimeout(() => {
        startMonitoring();
    }, 5000); // Wait 2 seconds for page content to load

    // Also try to start monitoring when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(startMonitoring, 1000);
        });
    }

})();