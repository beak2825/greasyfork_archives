// ==UserScript==
// @name         Torn Revive Status Indicator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shows revive status icons for faction members in Torn
// @author       You
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561266/Torn%20Revive%20Status%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/561266/Torn%20Revive%20Status%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - MINIMAL API CALLS
    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache
    const FACTION_ID = null; // Set to specific faction ID, or null to auto-detect
    const MIN_REFRESH_INTERVAL = 1 * 60 * 1000; // Minimum 2 minutes between API calls
    const PAGE_CHANGE_DELAY = 3000; // 3 seconds delay after page navigation
    const TOAST_DURATION = 2000; // 1.5 seconds for toast (shorter)

    // Get API key from storage or prompt
    let API_KEY = GM_getValue("torn_revive_api_key", null);

    // Track last API call time per faction
    let lastApiCallTime = GM_getValue("last_api_call_time", {}) || {};

    // Register menu command to set API key
    GM_registerMenuCommand("Set Torn API Key", () => {
        let userInput = prompt(
            "Enter Public API Key:",
            API_KEY || ""
        );
        if (userInput !== null) {
            API_KEY = userInput;
            GM_setValue("torn_revive_api_key", API_KEY);
            showToast("API key saved", "success", true);
        }
    });

    // Cache storage
    let reviveDataCache = GM_getValue("revive_data_cache", {
        data: {},
        timestamp: 0
    });

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

    // Toast notification system - only for important messages
    function showToast(message, type = "info", important = false) {
        // Don't show toast for non-important messages
        if (!important) {
            console.log(`[Revive Status] ${message}`);
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

    // Check if cache is valid
    function isCacheValid() {
        return Date.now() - reviveDataCache.timestamp < CACHE_DURATION;
    }

    // Check if we should make API call (strict rate limiting)
    function shouldMakeApiCall(factionId) {
        const now = Date.now();
        const lastCall = lastApiCallTime[factionId] || 0;

        // Don't make API call if we made one very recently
        if (now - lastCall < MIN_REFRESH_INTERVAL) {
            console.log(`[Revive Status] Skipping API call - too soon (${Math.round((now - lastCall)/1000)}s ago)`);
            return false;
        }

        // If we have valid cache, don't make API call
        if (isCacheValid() && reviveDataCache.data[factionId]) {
            const cacheAge = Math.round((now - reviveDataCache.timestamp) / 60000);
            console.log(`[Revive Status] Using cache (${cacheAge} min old)`);
            return false;
        }

        return true;
    }

    // Fetch faction data from Torn API with strict rate limiting
    async function fetchFactionData(factionId) {
        if (!API_KEY) {
            showToast("Set API key in Tampermonkey menu", "error", true);
            return null;
        }

        // Check if we should make API call
        if (!shouldMakeApiCall(factionId)) {
            // Return cached data if available
            return reviveDataCache.data[factionId] || null;
        }

        try {
            const url = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${API_KEY}`;

            console.log(`[Revive Status] Making API call for faction ${factionId}`);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000 // 10 second timeout
                });
            });

            // Update last call time and save
            lastApiCallTime[factionId] = Date.now();
            GM_setValue("last_api_call_time", lastApiCallTime);

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);

                // Check for API errors
                if (data.error) {
                    console.error(`[Revive Status] API Error: ${data.error.error}`);
                    // Don't show toast for API errors unless it's important
                    return null;
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
                GM_setValue("revive_data_cache", reviveDataCache);

                console.log(`[Revive Status] Updated cache for ${Object.keys(reviveMap).length} members`);
                return reviveMap;
            } else {
                console.error(`[Revive Status] API request failed: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error("[Revive Status] Error fetching faction data:", error);
            return null;
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

    // Add revive icon to member row (silently)
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
            row.appendChild(iconContainer);
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
            console.log("[Revive Status] Member Filter not found, using fallback");
            addFallbackFilter();
            return;
        }

        // Check if revive section already exists
        if (memberFilter.querySelector('.revive__section-class')) {
            console.log("[Revive Status] Revive filter already exists");
            return;
        }

        // Find the content area
        const content = memberFilter.querySelector('.content');
        if (!content) {
            console.log("[Revive Status] Could not find content area in Member Filter");
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
            checkbox.checked = GM_getValue("hide_non_revivable", false);

            checkbox.addEventListener('change', function() {
                const hideNonRevivable = this.checked;
                GM_setValue("hide_non_revivable", hideNonRevivable);
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

        console.log("[Revive Status] Revive filter integrated into Member Filter");

        // Apply saved filter preference
        const hideNonRevivable = GM_getValue("hide_non_revivable", false);
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
            checkbox.checked = GM_getValue("hide_non_revivable", false);

            checkbox.addEventListener('change', function() {
                const hideNonRevivable = this.checked;
                GM_setValue("hide_non_revivable", hideNonRevivable);
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

        console.log("[Revive Status] Added fallback revive filter");
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

        // Clear only this faction's cache
        if (reviveDataCache.data[factionId]) {
            delete reviveDataCache.data[factionId];
            GM_setValue("revive_data_cache", reviveDataCache);
        }

        await processMemberRows();

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
            console.log(`[Revive Status] Hid ${hiddenCount} non-revivable members`);
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

    // Process all member rows (silent operation)
    async function processMemberRows() {
        const factionId = getFactionId();
        if (!factionId) {
            console.log("[Revive Status] No faction ID found");
            return false;
        }

        // Fetch revive data
        const reviveData = await fetchFactionData(factionId);
        if (!reviveData) return false;

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

        // Initial processing with delay
        setTimeout(async () => {
            const processed = await processMemberRows();
            if (processed) {
                console.log("[Revive Status] Icons added successfully");
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