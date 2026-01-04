// ==UserScript==
// @name         Torn Quick Bust Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  quick bust helper for Torn.com jail. Just spam J on your keyboard.
// @author       GFOUR
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558992/Torn%20Quick%20Bust%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558992/Torn%20Quick%20Bust%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // Configuration & Constants
    // =========================
    const SELECTORS = {
        nerveBar: '.nerve___AyYv_ .bar-value___NTdce',
        bustAvailable: '.bustr-stats__availableBusts',
        jailEntry: 'li',
        level: '.level',
        time: '.time',
        confirmBust: '.confirm-bust',
        bustButton: 'a.bust',
        pageNumberActive: '.page-number.active .page-nb',
        pageNumberAll: '.page-number .page-nb'
    };

    let maxHardness = GM_getValue('maxHardness', 50);
    let debugMode = GM_getValue('debugMode', false);


    // =========================
    // Debug Overlay
    // =========================
    const debugOverlay = document.createElement('div');
    debugOverlay.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        max-width: 300px;
        background: rgba(0,0,0,0.8);
        color: #0f0;
        font-size: 12px;
        font-family: monospace;
        padding: 5px 10px;
        border-radius: 4px;
        z-index: 10000;
        overflow-y: auto;
        max-height: 400px;
        display: none;
    `;
    document.body.appendChild(debugOverlay);

    function debugLog(message) {
        if (debugMode) {
            console.log('[Bust Helper]', message);
            const line = document.createElement('div');
            line.textContent = message;
            debugOverlay.appendChild(line);
            debugOverlay.scrollTop = debugOverlay.scrollHeight;
        }
    }

    // =========================
    // Menu Commands
    // =========================
    GM_registerMenuCommand('Set Max Hardness', () => {
        const newValue = prompt('Enter maximum hardness threshold:', maxHardness);
        if (newValue !== null && !isNaN(newValue)) {
            maxHardness = parseInt(newValue);
            GM_setValue('maxHardness', maxHardness);
            showPopup(`Max hardness set to: ${maxHardness}`, 'info');
        }
    });


    GM_registerMenuCommand('Toggle Debug Mode', () => {
        debugMode = !debugMode;
        GM_setValue('debugMode', debugMode);
        debugOverlay.style.display = debugMode ? 'block' : 'none';
        showPopup(`Debug mode: ${debugMode ? 'ON' : 'OFF'}`, 'info');
    });

    // =========================
    // Popups
    // =========================
    function showPopup(message, type = 'error', duration = 2000) {
        const popup = document.createElement('div');
        const bgColors = { info: '#333', error: '#ff4c4c', success: '#4caf50', warn: '#ff9900' };
        popup.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${bgColors[type] || '#333'};
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 0 8px rgba(0,0,0,0.6);
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.25s ease, transform 0.25s ease;
            pointer-events: none;
        `;
        popup.textContent = message;
        document.body.appendChild(popup);

        requestAnimationFrame(() => {
            popup.style.opacity = "1";
            popup.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            popup.style.opacity = "0";
            popup.style.transform = "translateY(15px)";
            setTimeout(() => popup.remove(), 250);
        }, duration);
    }

    // =========================
    // Utility Functions
    // =========================
    function parseTimeToHours(timeString) {
        return (timeString.match(/(\d+)([dhm])/g) || []).reduce((total, part) => {
            const value = parseInt(part);
            const unit = part.slice(-1);
            if (unit === 'd') return total + value * 24;
            if (unit === 'h') return total + value;
            if (unit === 'm') return total + value / 60;
            return total;
        }, 0);
    }


    // =========================
    // Jail Helper Module
    // =========================
    const JailHelper = {
        getEntries: () => Array.from(document.querySelectorAll(SELECTORS.jailEntry))
            .filter(li => li.querySelector(SELECTORS.level)),

        getCurrentNerve: () => {
            const nerveBar = document.querySelector(SELECTORS.nerveBar);
            if (nerveBar) {
                const current = parseInt(nerveBar.textContent.split('/')[0]);
                debugLog(`Current nerve: ${current}`);
                return current;
            }
            debugLog('Nerve bar not found');
            showPopup('Nerve info missing!', 'warn');
            return 0;
        },

        getAvailableBusts: () => {
            const bustBar = document.querySelector(SELECTORS.bustAvailable);
            if (bustBar) {
                const current = parseInt(bustBar.textContent.split('/')[0]);
                debugLog(`Busts available: ${current}`);
                return current;
            }
            debugLog('Bust bar not found');
            showPopup('Bust info missing!', 'warn');
            return 0;
        },

        getIsInJail: () => {
            const body = document.querySelector("body");
            if (body) {
                const layout = body.getAttribute("data-layout");
                if (layout === "jail") {
                    debugLog("Player is in jail.");
                    return true;
                } else {
                    debugLog(`Player not in jail. Current layout: ${layout}`);
                    return false;
                }
            }
            debugLog("Body element not found.");
            showPopup("Page structure missing!", "warn");
            return false;
        },



        calculateHardness: (entry) => {
            const existing = entry.querySelector('.bustr-hardness-score');
            if (existing) return parseInt(existing.textContent);

            const levelElement = entry.querySelector(SELECTORS.level);
            if (!levelElement) return null;
            const levelMatch = levelElement.textContent.match(/LEVEL\s*:\s*(\d+)/);
            if (!levelMatch) return null;
            const level = parseInt(levelMatch[1]);

            const timeElement = entry.querySelector(SELECTORS.time);
            if (!timeElement) return null;
            const timeMatch = timeElement.textContent.match(/TIME\s*:\s*(.+)/);
            if (!timeMatch) return null;

            const durationInHours = parseTimeToHours(timeMatch[1]);
            const hardness = Math.floor(level * (durationInHours + 3));

            debugLog(`Calculated hardness: Level ${level}, Time ${timeMatch[1]} = ${hardness}`);
            return hardness;
        },

        hasAnyPlayers: () => {
            const entries = JailHelper.getEntries();
            debugLog(`Found ${entries.length} jail entries`);
            return entries.length > 0;
        },

        findBustableTarget: () => {
            const candidates = [];
            const entries = JailHelper.getEntries();

            for (const entry of entries) {
                const confirmBust = entry.querySelector(SELECTORS.confirmBust);
                if (confirmBust && confirmBust.style.display !== 'none') {
                    const ajaxAction = confirmBust.querySelector('.ajax-action');
                    if (ajaxAction && ajaxAction.textContent.trim()) continue;
                }

                const hardness = JailHelper.calculateHardness(entry);
                if (hardness === null) continue;

                if (hardness <= maxHardness) {
                    const bustButton = entry.querySelector(SELECTORS.bustButton);
                    if (bustButton) {
                        // Visual indication of target
                        entry.style.outline = '2px solid #ff4c4c';
                        candidates.push({ entry, hardness, bustButton });
                    }
                }
            }

            if (candidates.length === 0) {
                debugLog('No bustable targets found');
                return null;
            }

            candidates.sort((a, b) => a.hardness - b.hardness);
            debugLog(`Found ${candidates.length} candidates, choosing hardness ${candidates[0].hardness}`);
            return candidates[0].bustButton;
        },

        getCurrentPage: () => {
            const activePage = document.querySelector(SELECTORS.pageNumberActive);
            return activePage ? parseInt(activePage.textContent) : 1;
        },

        getTotalPages: () => {
            const pages = document.querySelectorAll(SELECTORS.pageNumberAll);
            let max = 1;
            pages.forEach(p => { const n = parseInt(p.textContent); if (n > max) max = n; });
            return max;
        },

        navigateToPage: (pageNum) => {
            const targetPage = document.querySelector(`a[page="${pageNum}"]`);
            if (targetPage) {
                targetPage.click();
            } else if (pageNum === 1) {
                location.reload();
            }
        },

        goToPageOne: () => {
            window.location.href = 'https://www.torn.com/jailview.php';
        }
    };

    // =========================
    // Main Bust Logic
    // =========================
    function performBust() {
        debugLog('=== BUST ATTEMPT ===');

        const isInJail = JailHelper.getIsInJail();
        if (isInJail) {showPopup('You\'re in Jail', 'warn'); return; }

        const currentNerve = JailHelper.getCurrentNerve();
        if (currentNerve < 5) { showPopup('Not enough nerve!', 'warn'); return; }

        const availableBusts = JailHelper.getAvailableBusts();
        if (availableBusts === 0) { showPopup('No Busts Available!', 'warn'); return; }


        const targetUrl = "https://www.torn.com/jailview.php";
        if (!window.location.href.startsWith(targetUrl)) { window.location.href = targetUrl; return; }

        if (!JailHelper.hasAnyPlayers()) { JailHelper.goToPageOne(); return; }

        const bustTarget = JailHelper.findBustableTarget();
        if (bustTarget && bustTarget.click) {
            debugLog('Clicking bust button');
            bustTarget.click();
        } else {
            const currentPage = JailHelper.getCurrentPage();
            const totalPages = JailHelper.getTotalPages();
            if (currentPage < totalPages) JailHelper.navigateToPage(currentPage + 1);
            else JailHelper.navigateToPage(1);
        }
    }

    // =========================
    // Shortcut Listener
    // =========================
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyJ' && !event.target.matches('input, textarea, [contenteditable]')) {
            event.preventDefault();
            performBust();
        }
    });

    console.log('Torn Quick Bust Helper Pro loaded. Press Alt+J to bust. Use Tampermonkey menu to configure settings and debug overlay.');
})();
