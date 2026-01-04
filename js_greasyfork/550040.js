// ==UserScript==
// @name         Zed City Auto Scavenge
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-click scavenge until rad immunity is depleted
// @author       You
// @match        https://www.zed.city/scavenge/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550040/Zed%20City%20Auto%20Scavenge.user.js
// @updateURL https://update.greasyfork.org/scripts/550040/Zed%20City%20Auto%20Scavenge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let intervalId = null;

    // Configuration
    const CONFIG = {
        clickDelay: 200, // Milliseconds between clicks
        maxClicks: 1000 // Safety limit
    };

    let clickCount = 0;

    function getCurrentRadImmunity() {
        // Look for div.stat.col with XX/YY pattern
        const statCols = document.querySelectorAll('div.stat.col');

        for (let div of statCols) {
            const text = div.textContent.trim();
            const match = text.match(/^(\d+)\/(\d+)$/);
            if (match) {
                const radParent = div.closest('.stat-rad, .main-stat');
                if (radParent) {
                    const hasRadIcon = radParent.querySelector('.fa-radiation, .icon-rad');
                    if (hasRadIcon) {
                        return parseInt(match[1], 10);
                    }
                }
            }
        }

        // Fallback: Look in rad stat sections
        const headerRadStats = document.querySelectorAll('.stat-rad');
        for (let stat of headerRadStats) {
            const statCol = stat.querySelector('div.stat.col');
            if (statCol) {
                const text = statCol.textContent.trim();
                const match = text.match(/^(\d+)\/(\d+)$/);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
        }

        return 0;
    }

    function getRequiredRad() {
        const jobRadStats = document.querySelectorAll('.stat-rad[data-v-430159a9=""]');

        for (let stat of jobRadStats) {
            const valueDivs = stat.querySelectorAll('div[data-v-73ddcb02=""]');
            for (let div of valueDivs) {
                const text = div.textContent.trim();
                const value = parseInt(text, 10);
                if (!isNaN(value) && value > 0 && value < 100) {
                    return value;
                }
            }
        }

        return 1;
    }

    function getScavengeButton() {
        return document.querySelector('button[data-cy="scavenge-btn"]');
    }

    function clickScavenge() {
        const button = getScavengeButton();
        if (button && !button.disabled) {
            button.click();
            clickCount++;
            return true;
        }
        return false;
    }

    function shouldContinueScavenging() {
        const currentRad = getCurrentRadImmunity();
        const requiredRad = getRequiredRad();

        return currentRad >= requiredRad && clickCount < CONFIG.maxClicks;
    }

    function startAutoScavenge() {
        if (isRunning) return;

        isRunning = true;
        clickCount = 0;

        intervalId = setInterval(() => {
            if (!shouldContinueScavenging()) {
                stopAutoScavenge();
                return;
            }

            clickScavenge();

        }, CONFIG.clickDelay);
    }

    function stopAutoScavenge() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isRunning = false;
    }

    function toggleAutoScavenge() {
        if (isRunning) {
            stopAutoScavenge();
        } else {
            startAutoScavenge();
        }
        updateAutoButton();
    }

    function updateAutoButton() {
        const autoBtn = document.getElementById('auto-scavenge-btn');
        if (autoBtn) {
            autoBtn.textContent = isRunning ? 'Stop' : 'Auto';
            autoBtn.style.background = isRunning ? '#f44336' : '#4CAF50';
        }
    }

    // Create auto button next to scavenge button
    function createAutoButton() {
        // Remove existing auto button if present
        const existing = document.getElementById('auto-scavenge-btn');
        if (existing) {
            existing.remove();
        }

        const scavengeButton = getScavengeButton();
        if (!scavengeButton) return;

        const autoButton = document.createElement('button');
        autoButton.id = 'auto-scavenge-btn';
        autoButton.textContent = 'Auto';
        autoButton.type = 'button';
        autoButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        `;

        autoButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAutoScavenge();
        });

        // Insert the auto button after the scavenge button
        scavengeButton.parentNode.insertBefore(autoButton, scavengeButton.nextSibling);
    }

    // Wait for page to load and create button
    function waitForElements() {
        const checkElements = setInterval(() => {
            const scavengeBtn = getScavengeButton();
            if (scavengeBtn) {
                clearInterval(checkElements);
                createAutoButton();
            }
        }, 1000);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }

    // Emergency stop with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isRunning) {
            e.preventDefault();
            stopAutoScavenge();
            updateAutoButton();
        }
    });

})();