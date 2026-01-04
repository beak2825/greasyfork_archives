// ==UserScript==
// @name         Torn Revive Status Indicator (PDA)
// @namespace    blacksmithop
// @version      1.6-PDA
// @description  Shows revive status icons for faction members in Torn
// @author       Adapted for PDA
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561310/Torn%20Revive%20Status%20Indicator%20%28PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561310/Torn%20Revive%20Status%20Indicator%20%28PDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PDA Detection and API handling
    const isPDA = typeof PDA_httpGet !== 'undefined' && typeof PDA_httpPost !== 'undefined';
    
    // PDA-compatible storage functions with proper boolean handling
    const pda_getValue = (key, defaultValue) => {
        if (isPDA) {
            const value = localStorage.getItem(key);
            if (value === null) return defaultValue;
            
            // Handle boolean strings properly
            if (value === 'true' || value === 'false') {
                return value === 'true';
            }
            
            try {
                // Try to parse as JSON for objects/arrays
                return JSON.parse(value);
            } catch (e) {
                // Return as-is for strings
                return value;
            }
        }
        
        if (GM_getValue) {
            const value = GM_getValue(key, defaultValue);
            // Handle boolean strings for consistency
            if (typeof value === 'string' && (value === 'true' || value === 'false')) {
                return value === 'true';
            }
            return value;
        }
        
        return defaultValue;
    };
    
    const pda_setValue = (key, value) => {
        // Convert booleans to strings for consistent storage
        if (typeof value === 'boolean') {
            value = value.toString();
        } else if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        
        if (isPDA) {
            localStorage.setItem(key, value);
        } else if (GM_setValue) {
            GM_setValue(key, value);
        }
    };
    
    const pda_deleteValue = (key) => {
        if (isPDA) {
            localStorage.removeItem(key);
        } else if (GM_deleteValue) {
            GM_deleteValue(key);
        }
    };

    // PDA-compatible HTTP request
    const pda_xmlhttpRequest = (details) => {
        if (isPDA) {
            if (details.method.toLowerCase() === 'get') {
                return PDA_httpGet(details.url)
                    .then(details.onload)
                    .catch(details.onerror || console.error);
            } else if (details.method.toLowerCase() === 'post') {
                return PDA_httpPost(details.url, details.headers || {}, details.data || '')
                    .then(details.onload)
                    .catch(details.onerror || console.error);
            }
        } else if (GM_xmlhttpRequest) {
            return GM_xmlhttpRequest(details);
        } else {
            console.error('No HTTP request method available');
            if (details.onerror) details.onerror();
        }
    };

    // Configuration
    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache
    const FACTION_ID = null; // Set to specific faction ID, or null to auto-detect
    const MIN_REFRESH_INTERVAL = 1 * 60 * 1000; // Minimum 1 minute between API calls
    const PAGE_CHANGE_DELAY = 3000; // 3 seconds delay after page navigation
    const TOAST_DURATION = 2000; // 2 seconds for toast

    // Get API key - PDA users must edit the script to add their API key
    let API_KEY = null;
    
    if (isPDA) {
        // PDA users: Look for API key in script content
        const PDA_APIKEY = "###PDA-APIKEY###"; // PDA users MUST replace this with their API key
        
        if (PDA_APIKEY && PDA_APIKEY[0] !== '#') {
            API_KEY = PDA_APIKEY;
            console.log("[Revive Status PDA] Using PDA-configured API key");
        } else {
            API_KEY = pda_getValue("torn_revive_api_key", null);
        }
    } else {
        API_KEY = pda_getValue("torn_revive_api_key", null);
    }

    // Cache storage - initialize with proper structure
    let reviveDataCache = pda_getValue("revive_data_cache", {
        data: {},
        timestamp: 0,
        factionIds: [] // Track which factions have data
    });

    // Ensure cache has the correct structure
    if (!reviveDataCache.data || !reviveDataCache.factionIds) {
        reviveDataCache = {
            data: {},
            timestamp: reviveDataCache.timestamp || 0,
            factionIds: []
        };
        pda_setValue("revive_data_cache", reviveDataCache);
    }

    // Track last API call time per faction
    let lastApiCallTime = pda_getValue("last_api_call_time", {});

    // SVG icons for revive status
    const reviveIcons = {
        revivable: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #4CAF50;">
                <circle cx="8" cy="8" r="7" stroke="#2E7D32" stroke-width="1"/>
                <path d="M5 8L7 10L11 6" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
        `,
        notRevivable: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #F44336;">
                <circle cx="8" cy="8" r="7" stroke="#C62828" stroke-width="1"/>
                <path d="M5 5L11 11M5 11L11 5" stroke="#C62828" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        unknown: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #9E9E9E;">
                <circle cx="8" cy="8" r="7" stroke="#757575" stroke-width="1"/>
                <text x="8" y="12" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#757575">?</text>
            </svg>
        `
    };

    // Create PDA settings button (only on faction pages)
    function createPDASettingsButton() {
        // Only show on faction pages
        if (!window.location.href.includes('factions.php')) {
            return;
        }
        
        const existingBtn = document.getElementById('revive-pda-settings-btn');
        if (existingBtn) return;
        
        const btn = document.createElement('button');
        btn.id = 'revive-pda-settings-btn';
        btn.innerHTML = '<i class="fas fa-cog" style="margin-right: 4px;"></i> Revive Settings';
        btn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 9998;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background 0.2s;
        `;
        
        btn.addEventListener('mouseover', () => {
            btn.style.background = '#1976D2';
        });
        
        btn.addEventListener('mouseout', () => {
            btn.style.background = '#2196F3';
        });
        
        btn.addEventListener('click', () => {
            showPDASettingsDialog();
        });
        
        document.body.appendChild(btn);
    }

    // PDA settings dialog
    function showPDASettingsDialog() {
        const existingDialog = document.getElementById('revive-pda-settings-dialog');
        if (existingDialog) return;
        
        const dialog = document.createElement('div');
        dialog.id = 'revive-pda-settings-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            min-width: 300px;
            font-family: Arial, sans-serif;
        `;
        
        const isKeySet = API_KEY && API_KEY[0] !== '#';
        const hideNonRevivable = pda_getValue("hide_non_revivable", false);
        
        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Revive Status Settings</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">
                    <strong>API Key Status:</strong>
                    <span style="color: ${isKeySet ? '#4CAF50' : '#F44336'}; margin-left: 5px;">
                        ${isKeySet ? '✓ Set' : '✗ Not Set'}
                    </span>
                </label>
                <p style="font-size: 12px; color: #666; margin: 5px 0 10px;">
                    ${isKeySet ? 
                        'Your API key is configured.' : 
                        'To set your API key, edit the script and replace ###PDA-APIKEY### with your Torn Public API Key.'}
                </p>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px; cursor: pointer;">
                    <input type="checkbox" id="pda-hide-non-revivable" ${hideNonRevivable ? 'checked' : ''}>
                    Hide non-revivable members
                </label>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="pda-settings-clear-cache" style="flex: 1; padding: 8px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    Clear Cache
                </button>
                <button id="pda-settings-close" style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        `;
        document.body.appendChild(backdrop);
        
        // Event listeners
        document.getElementById('pda-settings-clear-cache').addEventListener('click', () => {
            clearCache();
            showToast("Cache cleared", "success", true);
        });
        
        document.getElementById('pda-hide-non-revivable').addEventListener('change', function() {
            const hideNonRevivable = this.checked;
            pda_setValue("hide_non_revivable", hideNonRevivable);
            filterNonRevivableMembers(hideNonRevivable);
            showToast(hideNonRevivable ? "Hiding non-revivable members" : "Showing all members", "info", true);
        });
        
        const closeDialog = () => {
            dialog.remove();
            backdrop.remove();
        };
        
        document.getElementById('pda-settings-close').addEventListener('click', closeDialog);
        backdrop.addEventListener('click', closeDialog);
    }

    // Clear cache function
    function clearCache() {
        reviveDataCache = {
            data: {},
            timestamp: 0,
            factionIds: []
        };
        pda_setValue("revive_data_cache", reviveDataCache);
        
        // Clear revive icons
        document.querySelectorAll('.revive-status-icon').forEach(el => el.remove());
        document.querySelectorAll('.table-row, .members-list li, .faction-member-row').forEach(row => {
            row.removeAttribute('data-revivable');
            row.style.display = '';
        });
        
        // Reset statistics
        updateStatistics(0, false);
    }

    // Toast notification system
    function showToast(message, type = "info", important = false) {
        if (!important) {
            console.log(`[Revive Status PDA] ${message}`);
            return;
        }

        const colors = {
            success: "#4CAF50",
            error: "#F44336",
            info: "#2196F3",
            warning: "#FF9800"
        };

        // Remove existing toasts
        document.querySelectorAll('.revive-toast').forEach(toast => toast.remove());

        const toast = document.createElement("div");
        toast.className = "revive-toast";
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 10px 16px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            animation: reviveToastSlideIn 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // Auto-remove after short duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = "reviveToastFadeOut 0.3s ease-out";
                setTimeout(() => toast.remove(), 300);
            }
        }, TOAST_DURATION);
    }

    // Check if cache is valid for a specific faction
    function isCacheValid(factionId) {
        // Cache is invalid if no timestamp
        if (!reviveDataCache.timestamp) return false;
        
        // Cache is invalid if expired
        if (Date.now() - reviveDataCache.timestamp > CACHE_DURATION) return false;
        
        // Cache is invalid if no data for this faction
        if (!reviveDataCache.data[factionId]) return false;
        
        return true;
    }

    // Check if we should make API call
    function shouldMakeApiCall(factionId) {
        const now = Date.now();
        const lastCall = lastApiCallTime[factionId] || 0;

        // Don't make API call if we made one very recently
        if (now - lastCall < MIN_REFRESH_INTERVAL) {
            console.log(`[Revive Status PDA] Skipping API call - too soon (${Math.round((now - lastCall)/1000)}s ago)`);
            return false;
        }

        // If we have valid cache for this faction, don't make API call
        if (isCacheValid(factionId)) {
            const cacheAge = Math.round((now - reviveDataCache.timestamp) / 60000);
            console.log(`[Revive Status PDA] Using cache for faction ${factionId} (${cacheAge} min old)`);
            return false;
        }

        return true;
    }

    // Fetch faction data from Torn API
    async function fetchFactionData(factionId) {
        if (!API_KEY) {
            if (isPDA) {
                showToast("Edit script to add API key at ###PDA-APIKEY###", "error", true);
            } else {
                showToast("Set API key in menu command", "error", true);
            }
            return null;
        }

        // Check if we should make API call
        if (!shouldMakeApiCall(factionId)) {
            // Return cached data if available (even if cache is expired)
            return reviveDataCache.data[factionId] || null;
        }

        try {
            const url = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${API_KEY}`;

            console.log(`[Revive Status PDA] Making API call for faction ${factionId}`);

            return new Promise((resolve) => {
                pda_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        // Update last call time and save
                        lastApiCallTime[factionId] = Date.now();
                        pda_setValue("last_api_call_time", lastApiCallTime);

                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);

                            // Check for API errors
                            if (data.error) {
                                console.error(`[Revive Status PDA] API Error: ${data.error.error}`);
                                // Return cached data if available
                                resolve(reviveDataCache.data[factionId] || null);
                                return;
                            }

                            // Create a map of member IDs to revive status
                            const reviveMap = {};
                            if (data.members && Array.isArray(data.members)) {
                                data.members.forEach(member => {
                                    reviveMap[member.id] = {
                                        is_revivable: member.is_revivable,
                                        name: member.name,
                                        position: member.position
                                    };
                                });
                            }

                            // Update cache and save
                            reviveDataCache.data[factionId] = reviveMap;
                            reviveDataCache.timestamp = Date.now();
                            
                            // Track this faction
                            if (!reviveDataCache.factionIds.includes(factionId)) {
                                reviveDataCache.factionIds.push(factionId);
                            }
                            
                            pda_setValue("revive_data_cache", reviveDataCache);

                            console.log(`[Revive Status PDA] Updated cache for ${Object.keys(reviveMap).length} members`);
                            resolve(reviveMap);
                        } else {
                            console.error(`[Revive Status PDA] API request failed: ${response.status}`);
                            // Return cached data if available
                            resolve(reviveDataCache.data[factionId] || null);
                        }
                    },
                    onerror: function(error) {
                        console.error("[Revive Status PDA] Error fetching faction data:", error);
                        // Return cached data if available
                        resolve(reviveDataCache.data[factionId] || null);
                    }
                });
            });

        } catch (error) {
            console.error("[Revive Status PDA] Error fetching faction data:", error);
            // Return cached data if available
            return reviveDataCache.data[factionId] || null;
        }
    }

    // Get faction ID from current page
    function getFactionId() {
        // If FACTION_ID is set in config, use it
        if (FACTION_ID) return FACTION_ID;

        // Try to extract from URL
        const urlParams = new URLSearchParams(window.location.search);
        const step = urlParams.get("step");

        if (step === "profile") {
            return urlParams.get("ID");
        }

        // Try to find faction ID in the page
        const factionLink = document.querySelector('a[href*="factions.php?step=profile&ID="]');
        if (factionLink) {
            const match = factionLink.href.match(/ID=(\d+)/);
            if (match) return match[1];
        }

        return null;
    }

    // Add revive icon to member row
    function addReviveIcon(row, memberId, reviveStatus) {
        // Remove existing revive icon if present
        const existingIcon = row.querySelector('.revive-status-icon');
        if (existingIcon) existingIcon.remove();

        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'revive-status-icon';
        iconContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            cursor: help;
        `;

        // Set icon based on revive status
        let icon, tooltip;
        if (reviveStatus === true) {
            icon = reviveIcons.revivable;
            tooltip = "Revivable";
        } else if (reviveStatus === false) {
            icon = reviveIcons.notRevivable;
            tooltip = "Not Revivable";
        } else {
            icon = reviveIcons.unknown;
            tooltip = "Status unknown";
        }

        iconContainer.innerHTML = icon;
        iconContainer.title = tooltip;

        // Add to the row - try different positions
        const statusCell = row.querySelector('.status');
        const daysCell = row.querySelector('.days');
        const positionCell = row.querySelector('.position');

        if (statusCell) {
            statusCell.appendChild(iconContainer);
        } else if (daysCell) {
            daysCell.appendChild(iconContainer);
        } else if (positionCell) {
            positionCell.appendChild(iconContainer);
        } else {
            // Add to the end of the row
            const lastCell = row.querySelector('.table-cell:last-child');
            if (lastCell) {
                lastCell.appendChild(iconContainer);
            } else {
                row.appendChild(iconContainer);
            }
        }

        // Add data attribute for filtering
        row.setAttribute('data-revivable', reviveStatus);
    }

    // Wait for and integrate into the Member Filter section
    function waitForMemberFilter() {
        return new Promise((resolve) => {
            // Check if already exists
            const existingFilter = document.querySelector('#memberFilter .revive__section-class');
            if (existingFilter) {
                resolve(existingFilter);
                return;
            }

            // Set up observer to wait for member filter
            const observer = new MutationObserver((mutations, obs) => {
                const memberFilter = document.querySelector('#memberFilter');
                if (memberFilter) {
                    obs.disconnect();
                    resolve(memberFilter);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, 10000);
        });
    }

    // Add revive filter section to Member Filter
    async function addReviveFilterToMemberFilter() {
        const memberFilter = await waitForMemberFilter();
        if (!memberFilter) {
            console.log("[Revive Status PDA] Member Filter not found, using fallback");
            addFallbackFilter();
            return;
        }

        // Check if revive section already exists
        if (memberFilter.querySelector('.revive__section-class')) {
            console.log("[Revive Status PDA] Revive filter already exists");
            return;
        }

        // Find the content area
        const content = memberFilter.querySelector('.content');
        if (!content) {
            console.log("[Revive Status PDA] Could not find content area in Member Filter");
            addFallbackFilter();
            return;
        }

        // Create revive filter section
        const reviveSection = document.createElement('div');
        reviveSection.className = 'revive__section-class';
        reviveSection.innerHTML = `
            <strong>Revive Status</strong>
            <div class="tt-checkbox-list-wrapper tt-checkbox-list-column">
                <div class="tt-checkbox-wrapper">
                    <label>
                        <input type="checkbox" id="revivable-only" class="revive-filter-checkbox">
                        Hide non-revivable
                    </label>
                </div>
            </div>
            <div class="revive-refresh-wrapper" style="margin-top: 8px;">
                <button class="revive-refresh-btn torn-btn btn-small">
                    <i class="fas fa-sync-alt" style="margin-right: 4px;"></i> Refresh Revive Status
                </button>
                <div class="revive-cache-info" style="font-size: 11px; color: #666; margin-top: 4px;"></div>
            </div>
        `;

        // Insert before the last section or at the end
        const lastSection = content.querySelector('.levelFilter__section-class') ||
                           content.querySelector('.status__section-class') ||
                           content.lastElementChild;

        if (lastSection) {
            content.insertBefore(reviveSection, lastSection.nextSibling);
        } else {
            content.appendChild(reviveSection);
        }

        // Get checkbox and add event listener
        const checkbox = reviveSection.querySelector('.revive-filter-checkbox');
        if (checkbox) {
            // Load saved preference
            const hideNonRevivable = pda_getValue("hide_non_revivable", false);
            checkbox.checked = hideNonRevivable;

            checkbox.addEventListener('change', function() {
                const hideNonRevivable = this.checked;
                pda_setValue("hide_non_revivable", hideNonRevivable);
                filterNonRevivableMembers(hideNonRevivable);

                // Show brief toast
                showToast(hideNonRevivable ? "Hiding non-revivable members" : "Showing all members", "info", true);
            });
        }

        // Get refresh button and add event listener
        const refreshBtn = reviveSection.querySelector('.revive-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await handleRefreshClick();
            });
        }

        // Update cache info
        updateCacheInfo(reviveSection);

        console.log("[Revive Status PDA] Revive filter integrated into Member Filter");

        // Apply saved filter preference
        const hideNonRevivable = pda_getValue("hide_non_revivable", false);
        if (hideNonRevivable) {
            filterNonRevivableMembers(true);
        }
    }

    // Fallback if Member Filter not found
    function addFallbackFilter() {
        // Remove any existing fallback
        document.querySelectorAll('.revive-filter-fallback').forEach(el => el.remove());

        // Create fallback container
        const fallback = document.createElement('div');
        fallback.className = 'revive-filter-fallback tt-container rounding compact mt10';
        fallback.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border: 1px solid #ddd;
        `;

        fallback.innerHTML = `
            <strong style="display: block; margin-bottom: 8px;">Revive Status Filter</strong>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="checkbox" id="revivable-only-fallback" class="revive-filter-checkbox">
                    Hide non-revivable
                </label>
                <button class="revive-refresh-btn torn-btn btn-small" style="margin-left: auto;">
                    <i class="fas fa-sync-alt" style="margin-right: 4px;"></i> Refresh
                </button>
            </div>
        `;

        // Insert after the member list or at appropriate location
        const membersList = document.querySelector('.members-list, .f-war-list');
        if (membersList) {
            membersList.parentNode.insertBefore(fallback, membersList.nextSibling);
        } else {
            document.body.appendChild(fallback);
        }

        // Get checkbox and add event listener
        const checkbox = fallback.querySelector('.revive-filter-checkbox');
        if (checkbox) {
            // Load saved preference
            const hideNonRevivable = pda_getValue("hide_non_revivable", false);
            checkbox.checked = hideNonRevivable;

            checkbox.addEventListener('change', function() {
                const hideNonRevivable = this.checked;
                pda_setValue("hide_non_revivable", hideNonRevivable);
                filterNonRevivableMembers(hideNonRevivable);

                showToast(hideNonRevivable ? "Hiding non-revivable members" : "Showing all members", "info", true);
            });
        }

        // Get refresh button and add event listener
        const refreshBtn = fallback.querySelector('.revive-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await handleRefreshClick();
            });
        }

        console.log("[Revive Status PDA] Added fallback revive filter");
    }

    // Update cache information display
    function updateCacheInfo(container) {
        const cacheInfo = container.querySelector('.revive-cache-info');
        if (!cacheInfo) return;

        const factionId = getFactionId();
        if (!factionId || !reviveDataCache.data[factionId]) {
            cacheInfo.textContent = "No cache data";
            return;
        }

        const now = Date.now();
        const cacheAge = Math.round((now - reviveDataCache.timestamp) / 1000);
        const memberCount = Object.keys(reviveDataCache.data[factionId]).length;

        if (cacheAge < 60) {
            cacheInfo.textContent = `Cached ${cacheAge}s ago (${memberCount} members)`;
        } else if (cacheAge < 3600) {
            const minutes = Math.floor(cacheAge / 60);
            cacheInfo.textContent = `Cached ${minutes}m ago (${memberCount} members)`;
        } else {
            const hours = Math.floor(cacheAge / 3600);
            cacheInfo.textContent = `Cached ${hours}h ago (${memberCount} members)`;
        }
    }

    // Handle refresh button click
    async function handleRefreshClick() {
        const factionId = getFactionId();
        const now = Date.now();
        const lastCall = lastApiCallTime[factionId] || 0;

        if (now - lastCall < MIN_REFRESH_INTERVAL) {
            const secondsLeft = Math.ceil((MIN_REFRESH_INTERVAL - (now - lastCall)) / 1000);
            showToast(`Please wait ${secondsLeft} seconds before refreshing again`, "warning", true);
            return;
        }

        // Clear this faction's cache to force fresh fetch
        if (reviveDataCache.data[factionId]) {
            delete reviveDataCache.data[factionId];
            // Remove from factionIds list
            const index = reviveDataCache.factionIds.indexOf(factionId);
            if (index > -1) {
                reviveDataCache.factionIds.splice(index, 1);
            }
            pda_setValue("revive_data_cache", reviveDataCache);
        }

        // Reload saved filter preference
        const hideNonRevivable = pda_getValue("hide_non_revivable", false);
        
        await processMemberRows();
        
        // Re-apply filter
        if (hideNonRevivable) {
            filterNonRevivableMembers(true);
        }

        // Update cache info in all containers
        document.querySelectorAll('.revive__section-class, .revive-filter-fallback').forEach(container => {
            updateCacheInfo(container);
        });
    }

    // Filter non-revivable members
    function filterNonRevivableMembers(hide) {
        const memberRows = document.querySelectorAll('.table-row, .members-list li, .faction-member-row');
        let hiddenCount = 0;

        memberRows.forEach(row => {
            const isRevivable = row.getAttribute('data-revivable');

            if (hide && isRevivable === 'false') {
                // Hide non-revivable members
                if (row.style.display !== 'none') {
                    row.style.display = 'none';
                    hiddenCount++;
                }
            } else {
                // Show all members
                row.style.display = '';
            }
        });

        // Update statistics if they exist
        updateStatistics(hiddenCount, hide);

        if (hide && hiddenCount > 0) {
            console.log(`[Revive Status PDA] Hid ${hiddenCount} non-revivable members`);
        }
    }

    // Update statistics display
    function updateStatistics(hiddenCount, isFiltering) {
        const statCount = document.querySelector('.stat-count');
        const statTotal = document.querySelector('.stat-total');

        if (statCount && statTotal) {
            const total = parseInt(statTotal.textContent) || 0;
            if (isFiltering && hiddenCount > 0) {
                const showing = total - hiddenCount;
                statCount.textContent = showing;
            } else {
                statCount.textContent = total;
            }
        }
    }

    // Process all member rows
    async function processMemberRows() {
        const factionId = getFactionId();
        if (!factionId) {
            console.log("[Revive Status PDA] No faction ID found");
            return false;
        }

        // Fetch revive data - will return cached data if available and not expired
        const reviveData = await fetchFactionData(factionId);
        if (!reviveData) {
            console.log("[Revive Status PDA] No revive data available");
            return false;
        }

        // Find all member rows
        const memberRows = document.querySelectorAll('.table-row, .members-list li, .faction-member-row');
        let processedCount = 0;

        memberRows.forEach(row => {
            // Try to find member ID in the row
            let memberId = null;

            // Check for profile links
            const profileLink = row.querySelector('a[href*="/profiles.php?XID="], a[href*="profiles.php?XID="]');
            if (profileLink) {
                const match = profileLink.href.match(/XID=(\d+)/);
                if (match) memberId = match[1];
            }

            // Check for user ID in data attributes
            if (!memberId) {
                const userIdAttr = row.getAttribute('data-user-id') || row.getAttribute('data-player-id');
                if (userIdAttr) memberId = userIdAttr;
            }

            if (memberId && reviveData[memberId] !== undefined) {
                addReviveIcon(row, memberId, reviveData[memberId].is_revivable);
                processedCount++;
            }
        });

        // Add revive filter to Member Filter section
        await addReviveFilterToMemberFilter();

        return processedCount > 0;
    }

    // Main initialization
    function init() {
        // Check if we're on a faction members page
        if (!window.location.href.includes('factions.php')) {
            return;
        }

        console.log(`[Revive Status PDA] Initializing ${isPDA ? 'in PDA mode' : 'in standard mode'}`);

        // Add custom styles
        const styles = `
            .revive-status-icon {
                display: inline-flex;
                align-items: center;
                margin-left: 8px;
                vertical-align: middle;
            }
            .revive-status-icon svg {
                filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
            }
            .table-row:hover .revive-status-icon svg {
                transform: scale(1.1);
                transition: transform 0.2s;
            }
            .revive-filter-checkbox {
                margin: 0;
                cursor: pointer;
            }
            .revive-filter-checkbox:checked {
                accent-color: #4CAF50;
            }
            .revive-refresh-btn {
                background: #2196F3;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                font-size: 12px;
                transition: background 0.2s;
            }
            .revive-refresh-btn:hover {
                background: #1976D2;
            }
            .revive-refresh-btn:disabled {
                background: #BDBDBD;
                cursor: not-allowed;
            }
            @keyframes reviveToastSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes reviveToastFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Create PDA settings button if in PDA mode (only on faction pages)
        if (isPDA) {
            createPDASettingsButton();
        }

        // Initial processing with delay
        setTimeout(async () => {
            const processed = await processMemberRows();
            if (processed) {
                console.log("[Revive Status PDA] Icons added successfully");
            }
        }, PAGE_CHANGE_DELAY);

        // Observer for dynamic content
        let observerTimer;
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new member rows were added
                    const hasNewRows = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.matches('.table-row, .members-list li, .faction-member-row') ||
                                   node.querySelector('.table-row, .members-list li, .faction-member-row');
                        }
                        return false;
                    });

                    if (hasNewRows) {
                        shouldProcess = true;
                        break;
                    }
                }

                // Check if member filter was added/modified
                if (mutation.type === 'childList') {
                    const hasFilterChange = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.matches('#memberFilter') ||
                                   node.querySelector('#memberFilter');
                        }
                        return false;
                    });

                    if (hasFilterChange) {
                        shouldProcess = true;
                        break;
                    }
                }
            }

            if (shouldProcess) {
                clearTimeout(observerTimer);
                observerTimer = setTimeout(async () => {
                    await processMemberRows();
                }, 2000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();