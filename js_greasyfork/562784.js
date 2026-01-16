// ==UserScript==
// @name         Torn Virus Timer
// @namespace    https://www.torn.com/
// @version      1.2
// @description  Display virus coding timer in the sidebar using Torn API v2
// @author       Woeka [3516612]
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562784/Torn%20Virus%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/562784/Torn%20Virus%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    function getApiKey() {
        return localStorage.getItem('virus_api_key') || '';
    }

    const timerContainerID = 'virusTimerSidebar';
    const LS_KEY = 'virus_last_info'; // localStorage key

    function getStoredVirusInfo() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY)) || {};
        } catch {
            return {};
        }
    }

    function setStoredVirusInfo(obj) {
        localStorage.setItem(LS_KEY, JSON.stringify(obj));
    }

    function fetchVirusStatus() {
        const apiKey = getApiKey();
        
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://api.torn.com/v2/user/virus',
            headers: {
                'accept': 'application/json',
                'Authorization': `ApiKey ${apiKey}`
            },
            onload: function (response) {
                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    return;
                }
                
                // Check for API errors
                if (data.error) {
                    if (data.error.code === 1 || data.error.code === 2) {
                        // Invalid key or insufficient permissions
                        updateSidebar("Invalid key", null, true); // true = clickable to edit
                    } else {
                        updateSidebar("API error", null, true); // true = clickable to edit
                    }
                    scheduleNextCheck(3600);
                    return;
                }
                
                const now = Math.floor(Date.now() / 1000);
                
                if (data?.virus && data.virus.until) {
                    const timeLeft = Math.max(0, data.virus.until - now);
                    const virusName = data.virus.item ? data.virus.item.name : 'Virus';
                    setStoredVirusInfo({
                        until: data.virus.until,
                        name: virusName,
                        nextCheck: now + 3600 // check again in 1 hour
                    });
                    updateSidebar(formatTimer(timeLeft), virusName);
                    scheduleNextCheck(3600);
                } else {
                    // No virus being coded
                    setStoredVirusInfo({
                        until: null,
                        name: null,
                        nextCheck: now + 3600
                    });
                    updateSidebar("No virus", null);
                    scheduleNextCheck(3600);
                }
            },
            onerror: function(error) {
                updateSidebar("Network error", null, true); // true = clickable to edit
                // On error, check again in 1 hour
                scheduleNextCheck(3600);
            }
        });
    }

    function formatTimer(secs, showSeconds = false) {
        if (typeof secs !== "number" || isNaN(secs) || secs < 0) return "0d 0h 0m";
        if (showSeconds) {
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            return `${m}:${s.toString().padStart(2, '0')}`;
        }
        const d = Math.floor(secs / 86400);
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        let out = "";
        if (d > 0) out += `${d}d `;
        if (h > 0 || d > 0) out += `${h}h `;
        out += `${m}m`;
        return out.trim();
    }

    function showApiKeyPopup(callback) {
        if (document.getElementById('virus_api_input')) return; // Prevent multiple popups
        let popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '2px solid #888';
        popup.style.zIndex = 9999;
        popup.style.borderRadius = '8px';
        popup.innerHTML = `
            <div style="margin-bottom:10px;">Enter your Torn limited API key:</div>
            <input type="text" id="virus_api_input" style="width:300px;" maxlength="16" value="${getApiKey() || ''}">
            <div style="margin-top:10px;">
                <button id="virus_api_save" style="background:#444;color:#fff;border:1px solid #aaa;padding:6px 18px;margin-right:10px;border-radius:4px;cursor:pointer;">Save</button>
                <button id="virus_api_cancel" style="background:#444;color:#fff;border:1px solid #aaa;padding:6px 18px;border-radius:4px;cursor:pointer;">Cancel</button>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('virus_api_input').focus();

        document.getElementById('virus_api_save').onclick = function() {
            let key = document.getElementById('virus_api_input').value.trim();
            if (key.length === 16) {
                const oldKey = getApiKey();
                localStorage.setItem('virus_api_key', key);
                document.body.removeChild(popup);
                // Clear cached data if key changed
                if (oldKey !== key) {
                    localStorage.removeItem(LS_KEY);
                }
                if (callback) callback(key);
            } else {
                alert('Please enter a valid 16-character Torn limited API key.');
            }
        };
        document.getElementById('virus_api_cancel').onclick = function() {
            document.body.removeChild(popup);
        };
    }

    function findSidebar() {
        // Only look for Torn Tools sidebar
        const element = document.querySelector('.tt-sidebar-information');
        if (element) {
            return element;
        }
        return null;
    }

    function waitForSidebar(callback, maxAttempts = 20, attempt = 1) {
        const sidebar = findSidebar();
        if (sidebar) {
            callback();
            return;
        }
        
        if (attempt >= maxAttempts) {
            return;
        }
        
        // Exponential backoff: 100ms, 200ms, 400ms, 800ms, etc.
        const delay = Math.min(100 * Math.pow(2, attempt - 1), 5000);
        setTimeout(() => waitForSidebar(callback, maxAttempts, attempt + 1), delay);
    }

    function updateSidebar(timerText, virusName, isClickable = false) {
        // Only use Torn Tools sidebar
        let sidebar = findSidebar();
        if (!sidebar) {
            return;
        }

        let section = document.getElementById(timerContainerID);
        if (!section) {
            section = document.createElement('section');
            section.id = timerContainerID;
            section.style.order = 2;
            section.innerHTML = `
                <a class="title" href="https://www.torn.com/pc.php" target="_blank">Virus:</a>
                <span id="virus-timer-value" class="countdown"></span>
            `;
            
            // Only append to Torn Tools sidebar
            sidebar.appendChild(section);
        }
        const timerSpan = section.querySelector('#virus-timer-value');
        if (timerSpan) {
            // Always remove old onclick handler first
            timerSpan.onclick = null;
            timerSpan.style.cursor = "";
            timerSpan.title = "";
            
            if (!getApiKey()) {
                timerSpan.textContent = "Enter limited key";
                timerSpan.style.cursor = "pointer";
                timerSpan.title = "Click to enter API key";
                timerSpan.onclick = function(e) {
                    showApiKeyPopup(() => {
                        // Clear cached data when key changes
                        localStorage.removeItem(LS_KEY);
                        runCheck();
                    });
                };
            } else {
                if (virusName && timerText !== "No virus" && !isClickable) {
                    timerSpan.textContent = timerText;
                } else if (timerText === "No virus" || isClickable) {
                    // Make clickable to edit API key
                    timerSpan.textContent = timerText;
                    timerSpan.style.cursor = "pointer";
                    timerSpan.title = "Click to edit API key";
                    timerSpan.onclick = function(e) {
                        showApiKeyPopup(() => {
                            // Clear cached data when key changes
                            localStorage.removeItem(LS_KEY);
                            runCheck();
                        });
                    };
                } else {
                    timerSpan.textContent = timerText;
                }
            }
        }
    }

    let nextTimeout = null;
    function scheduleNextCheck(seconds) {
        if (nextTimeout) clearTimeout(nextTimeout);
        nextTimeout = setTimeout(runCheck, Math.max(1000, seconds * 1000));
    }

    function runCheck() {
        if (!getApiKey()) {
            updateSidebar("Enter limited key", null);
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        const info = getStoredVirusInfo();
        if (info.nextCheck && now < info.nextCheck) {
            scheduleNextCheck(info.nextCheck - now);
            // Update display with stored info while waiting
            if (info.until) {
                const timeLeft = Math.max(0, info.until - now);
                updateSidebar(formatTimer(timeLeft), info.name);
            } else {
                updateSidebar("No virus", null);
            }
            return;
        }
        fetchVirusStatus();
    }

    let liveCountdownInterval = null;

    function startLiveCountdown(secsLeft, virusName) {
        clearInterval(liveCountdownInterval);
        function tick() {
            if (secsLeft <= 0) {
                clearInterval(liveCountdownInterval);
                updateSidebar("No virus", null);
                runCheck();
                return;
            }
            updateSidebar(formatTimer(secsLeft, true), virusName);
            secsLeft--;
        }
        tick();
        liveCountdownInterval = setInterval(tick, 1000);
    }

    // Show stored timer immediately if available
    (function showStoredTimer() {
        const info = getStoredVirusInfo();
        if (info.until) {
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = Math.max(0, info.until - now);
            updateSidebar(formatTimer(timeLeft), info.name);
        } else {
            updateSidebar("No virus", null);
        }
    })();

    // Add MutationObserver to detect when sidebar is added to DOM
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain sidebar elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is a sidebar
                            if (node.classList && (node.classList.contains('tt-sidebar-information') || node.classList.contains('sidebar-information'))) {
                                setTimeout(() => {
                                    initializeTimer(); // This will now move the timer if needed
                                }, 100);
                            }
                            // Check if the node contains a sidebar
                            const foundSidebar = node.querySelector && (node.querySelector('.tt-sidebar-information') || node.querySelector('.sidebar-information'));
                            if (foundSidebar) {
                                setTimeout(() => {
                                    initializeTimer(); // This will now move the timer if needed
                                }, 100);
                            }
                        }
                    });
                    
                    // Also check if sidebar exists now and timer doesn't exist or is in wrong place
                    const sidebar = findSidebar();
                    const existingTimer = document.getElementById(timerContainerID);
                    
                    if (sidebar && (!existingTimer || existingTimer.parentElement !== sidebar)) {
                        // Give it a moment to settle
                        setTimeout(() => {
                            initializeTimer(); // This will now move the timer if needed
                        }, 100);
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Stop observing after 30 seconds to prevent memory leaks
        setTimeout(() => {
            observer.disconnect();
        }, 30000);
    }

    function initializeTimer() {
        const info = getStoredVirusInfo();
        
        // Check if timer already exists in wrong location
        const existingTimer = document.getElementById(timerContainerID);
        const currentSidebar = findSidebar();
        
        if (existingTimer && currentSidebar) {
            // If timer exists but is in wrong sidebar, move it
            const timerParent = existingTimer.parentElement;
            if (timerParent !== currentSidebar) {
                existingTimer.remove();
                // Force recreation by removing the element
            }
        }
        
        if (info.until) {
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = Math.max(0, info.until - now);
            updateSidebar(formatTimer(timeLeft), info.name);
        } else {
            updateSidebar("No virus", null);
        }
        runCheck();
    }

    // Try to initialize immediately
    waitForSidebar(initializeTimer);
    
    // Also setup mutation observer for dynamic content
    setupMutationObserver();
    
    // Fallback: Try again after a longer delay in case extensions are slow to load
    setTimeout(() => {
        if (!document.getElementById(timerContainerID)) {
            waitForSidebar(initializeTimer);
        }
    }, 5000);
})();
