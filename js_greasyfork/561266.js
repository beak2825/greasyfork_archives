// ==UserScript==
// @name         Torn Revive Status Indicator
// @namespace    http://tampermonkey.net/
// @version      1.4
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

    const CACHE_DURATION = 2 * 60 * 1000;
    const FACTION_ID = null;
    const MIN_REFRESH_INTERVAL = 2 * 60 * 1000;
    const PAGE_CHANGE_DELAY = 3000;
    const TOAST_DURATION = 2000;

    let API_KEY = GM_getValue("torn_revive_api_key", null);
    let lastApiCallTime = GM_getValue("last_api_call_time", {}) || {};
    let reviveDataCache = GM_getValue("revive_data_cache", { data: {}, timestamp: 0 });

    const reviveIcons = {
        revivable: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #4CAF50;"><circle cx="8" cy="8" r="7" stroke="#2E7D32" stroke-width="1"/><path d="M5 8L7 10L11 6" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
        notRevivable: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #F44336;"><circle cx="8" cy="8" r="7" stroke="#C62828" stroke-width="1"/><path d="M5 5L11 11M5 11L11 5" stroke="#C62828" stroke-width="2" stroke-linecap="round"/></svg>`,
        unknown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="fill: #9E9E9E;"><circle cx="8" cy="8" r="7" stroke="#757575" stroke-width="1"/><text x="8" y="12" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#757575">?</text></svg>`
    };

    GM_registerMenuCommand("Set Torn API Key", () => {
        let userInput = prompt("Enter Public API Key:", API_KEY || "");
        if (userInput !== null) {
            API_KEY = userInput;
            GM_setValue("torn_revive_api_key", API_KEY);
            showToast("API key saved", "success", true);
        }
    });

    function showToast(message, type = "info", important = false) {
        if (!important) {
            console.log(`[Revive Status] ${message}`);
            return;
        }

        const colors = { success: "#4CAF50", error: "#F44336", info: "#2196F3", warning: "#FF9800" };
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

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = "reviveToastFadeOut 0.3s ease-out";
                setTimeout(() => toast.remove(), 300);
            }
        }, TOAST_DURATION);
    }

    function isCacheValid() {
        return Date.now() - reviveDataCache.timestamp < CACHE_DURATION;
    }

    function shouldMakeApiCall(factionId) {
        const now = Date.now();
        const lastCall = lastApiCallTime[factionId] || 0;

        if (now - lastCall < MIN_REFRESH_INTERVAL) {
            console.log(`[Revive Status] Skipping API call - too soon (${Math.round((now - lastCall)/1000)}s ago)`);
            return false;
        }

        if (isCacheValid() && reviveDataCache.data[factionId]) {
            const cacheAge = Math.round((now - reviveDataCache.timestamp) / 60000);
            console.log(`[Revive Status] Using cache (${cacheAge} min old)`);
            return false;
        }

        return true;
    }

    async function fetchFactionData(factionId) {
        if (!API_KEY) {
            showToast("Set API key in Tampermonkey menu", "error", true);
            return null;
        }

        if (!shouldMakeApiCall(factionId)) {
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
                    timeout: 10000
                });
            });

            lastApiCallTime[factionId] = Date.now();
            GM_setValue("last_api_call_time", lastApiCallTime);

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    console.error(`[Revive Status] API Error: ${data.error.error}`);
                    return null;
                }

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

    function getFactionId() {
        if (FACTION_ID) return FACTION_ID;

        const url = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        const step = urlParams.get("step");
        const idParam = urlParams.get("ID");

        if (step === "profile" && idParam) {
            return idParam;
        }

        if (url.includes("factions.php")) {
            const patterns = [
                /factions\.php.*[?&]ID=(\d+)/i,
                /factions\.php.*[?&]id=(\d+)/i,
                /factions\.php.*[?&]XID=(\d+)/i
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) return match[1];
            }

            const factionElements = [
                'a[href*="factions.php?step=profile&ID="]',
                '.faction-info [href*="ID="]',
                '.members-list a[href*="ID="]',
                'meta[content*="faction"]'
            ];

            for (const selector of factionElements) {
                const element = document.querySelector(selector);
                if (element) {
                    const href = element.href || element.getAttribute('content') || '';
                    const match = href.match(/ID=(\d+)/);
                    if (match) return match[1];
                }
            }
        }

        if (url.includes("profiles.php")) {
            const factionLink = document.querySelector('a[href*="factions.php?step=profile&ID="]');
            if (factionLink) {
                const match = factionLink.href.match(/ID=(\d+)/);
                if (match) return match[1];
            }
        }

        console.warn("[Revive Status] Could not determine faction ID");
        return null;
    }

    function addReviveIcon(row, memberId, reviveStatus) {
        const existingIcon = row.querySelector('.revive-status-icon');
        if (existingIcon) existingIcon.remove();

        const iconContainer = document.createElement('div');
        iconContainer.className = 'revive-status-icon';
        iconContainer.style.cssText = `display: inline-flex; align-items: center; margin-left: 8px; cursor: help;`;

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
            row.appendChild(iconContainer);
        }

        row.setAttribute('data-revivable', reviveStatus);
    }

    function waitForMemberFilter() {
        return new Promise((resolve) => {
            const existingFilter = document.querySelector('#memberFilter .revive__section-class');
            if (existingFilter) {
                resolve(existingFilter);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const memberFilter = document.querySelector('#memberFilter');
                if (memberFilter) {
                    obs.disconnect();
                    resolve(memberFilter);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, 10000);
        });
    }

    async function addReviveFilterToMemberFilter() {
        const memberFilter = await waitForMemberFilter();
        if (!memberFilter) {
            return;
        }

        if (memberFilter.querySelector('.revive__section-class')) {
            return;
        }

        const content = memberFilter.querySelector('.content');
        if (!content) {
            return;
        }

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

        const lastSection = content.querySelector('.levelFilter__section-class') ||
                           content.querySelector('.status__section-class') ||
                           content.lastElementChild;

        if (lastSection) {
            content.insertBefore(reviveSection, lastSection.nextSibling);
        } else {
            content.appendChild(reviveSection);
        }

        const checkbox = reviveSection.querySelector('.revive-filter-checkbox');
        if (checkbox) {
            checkbox.checked = GM_getValue("hide_non_revivable", false);
            checkbox.addEventListener('change', function() {
                const hideNonRevivable = this.checked;
                GM_setValue("hide_non_revivable", hideNonRevivable);
                filterNonRevivableMembers(hideNonRevivable);
                showToast(hideNonRevivable ? "Hiding non-revivable members" : "Showing all members", "info", true);
            });
        }

        const refreshBtn = reviveSection.querySelector('.revive-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await handleRefreshClick();
            });
        }

        updateCacheInfo(reviveSection);

        const hideNonRevivable = GM_getValue("hide_non_revivable", false);
        if (hideNonRevivable) {
            filterNonRevivableMembers(true);
        }
    }

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

    async function handleRefreshClick() {
        const factionId = getFactionId();
        const now = Date.now();
        const lastCall = lastApiCallTime[factionId] || 0;

        if (now - lastCall < MIN_REFRESH_INTERVAL) {
            const secondsLeft = Math.ceil((MIN_REFRESH_INTERVAL - (now - lastCall)) / 1000);
            showToast(`Please wait ${secondsLeft} seconds before refreshing again`, "warning", true);
            return;
        }

        if (reviveDataCache.data[factionId]) {
            delete reviveDataCache.data[factionId];
            GM_setValue("revive_data_cache", reviveDataCache);
        }

        await processMemberRows();

        document.querySelectorAll('.revive__section-class').forEach(container => {
            updateCacheInfo(container);
        });
    }

    function filterNonRevivableMembers(hide) {
        const memberRows = document.querySelectorAll('.table-row, .members-list li, .faction-member-row');
        let hiddenCount = 0;

        memberRows.forEach(row => {
            const isRevivable = row.getAttribute('data-revivable');
            if (hide && isRevivable === 'false') {
                if (row.style.display !== 'none') {
                    row.style.display = 'none';
                    hiddenCount++;
                }
            } else {
                row.style.display = '';
            }
        });

        updateStatistics(hiddenCount, hide);

        if (hide && hiddenCount > 0) {
            console.log(`[Revive Status] Hid ${hiddenCount} non-revivable members`);
        }
    }

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

    async function processMemberRows() {
        const factionId = getFactionId();
        if (!factionId) {
            console.log("[Revive Status] No faction ID found");
            return false;
        }

        const reviveData = await fetchFactionData(factionId);
        if (!reviveData) return false;

        const memberRows = document.querySelectorAll('.table-row, .members-list li, .faction-member-row');
        let processedCount = 0;

        memberRows.forEach(row => {
            let memberId = null;
            const profileLink = row.querySelector('a[href*="/profiles.php?XID="], a[href*="profiles.php?XID="]');
            if (profileLink) {
                const match = profileLink.href.match(/XID=(\d+)/);
                if (match) memberId = match[1];
            }

            if (!memberId) {
                const userIdAttr = row.getAttribute('data-user-id') || row.getAttribute('data-player-id');
                if (userIdAttr) memberId = userIdAttr;
            }

            if (memberId && reviveData[memberId] !== undefined) {
                addReviveIcon(row, memberId, reviveData[memberId].is_revivable);
                processedCount++;
            }
        });

        await addReviveFilterToMemberFilter();
        return processedCount > 0;
    }

    function init() {
        const url = window.location.href;
        const isFactionPage =
            url.includes('factions.php?step=profile') ||
            url.includes('factions.php?step=your') ||
            url.includes('factions.php#/') ||
            (url.includes('factions.php') &&
             (url.includes('ID=') ||
              url.includes('XID=') ||
              document.querySelector('.members-list, .faction-members, #faction-members')));

        if (!isFactionPage) {
            return;
        }

        const factionId = getFactionId();
        if (!factionId) {
            console.log("[Revive Status] Not a faction members page or couldn't detect faction ID");
            return;
        }

        console.log(`[Revive Status] Initializing for faction ID: ${factionId}`);

        const styles = `
            .revive-status-icon { display: inline-flex; align-items: center; margin-left: 8px; vertical-align: middle; }
            .revive-status-icon svg { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2)); }
            .table-row:hover .revive-status-icon svg { transform: scale(1.1); transition: transform 0.2s; }
            .revive-filter-checkbox { margin: 0; cursor: pointer; }
            .revive-filter-checkbox:checked { accent-color: #4CAF50; }
            .revive-refresh-btn { background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-family: Arial, sans-serif; font-size: 12px; transition: background 0.2s; }
            .revive-refresh-btn:hover { background: #1976D2; }
            .revive-refresh-btn:disabled { background: #BDBDBD; cursor: not-allowed; }
            @keyframes reviveToastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes reviveToastFadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        setTimeout(async () => {
            const processed = await processMemberRows();
            if (processed) {
                console.log("[Revive Status] Icons added successfully");
            }
        }, PAGE_CHANGE_DELAY);

        let observerTimer;
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
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

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();