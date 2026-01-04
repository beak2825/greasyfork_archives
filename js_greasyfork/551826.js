// ==UserScript==
// @name         Torn Faction Last Action Display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Display faction members' last action times on the faction page
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/factions.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551826/Torn%20Faction%20Last%20Action%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/551826/Torn%20Faction%20Last%20Action%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = 'torn_faction_api_key';
    const FACTION_ID_STORAGE = 'torn_faction_id';

    function getApiKey() {
        let apiKey = GM_getValue(API_KEY_STORAGE, '');
        if (!apiKey) {
            apiKey = prompt('Please enter your Torn API key:');
            if (apiKey) {
                GM_setValue(API_KEY_STORAGE, apiKey);
            }
        }
        return apiKey;
    }

    async function fetchUserFaction(apiKey) {
        try {
            const response = await fetch(`https://api.torn.com/v2/user/faction?key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                if (data.error.code === 2) {
                    GM_setValue(API_KEY_STORAGE, '');
                    alert('Invalid API key. Please refresh and enter a valid key.');
                }
                return null;
            }

            if (data.faction && data.faction.id) {
                GM_setValue(FACTION_ID_STORAGE, data.faction.id.toString());
                console.log('Faction ID stored:', data.faction.id);
                return data.faction.id;
            }

            return null;
        } catch (error) {
            console.error('Error fetching user faction:', error);
            return null;
        }
    }

    async function getFactionId(apiKey) {
        let factionId = GM_getValue(FACTION_ID_STORAGE, '');
        if (!factionId) {
            factionId = await fetchUserFaction(apiKey);
        }
        return factionId;
    }

    function getFactionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const factionId = urlParams.get('ID');
        return factionId;
    }

    async function fetchFactionMembers(factionId, apiKey) {
        try {
            const response = await fetch(`https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                if (data.error.code === 2) {
                    GM_setValue(API_KEY_STORAGE, '');
                    GM_setValue(FACTION_ID_STORAGE, '');
                    alert('Invalid API key. Please refresh and enter a valid key.');
                }
                return null;
            }

            return data.members;
        } catch (error) {
            console.error('Error fetching faction data:', error);
            return null;
        }
    }

    function addLastActionColumn(members) {
        const observer = new MutationObserver((mutations, obs) => {
            const tableRows = document.querySelectorAll('ul.table-body li.table-row');

            if (tableRows.length > 0) {
                obs.disconnect();

                const memberMap = {};
                members.forEach(member => {
                    memberMap[member.id] = member;
                });

                addTableHeader();

                const inactiveMembers = [];

                tableRows.forEach(row => {
                    const profileLink = row.querySelector('a[href*="/profiles.php?XID="]');
                    if (profileLink) {
                        const href = profileLink.getAttribute('href');
                        const memberId = href.match(/XID=(\d+)/)?.[1];

                        if (memberId && memberMap[memberId]) {
                            const member = memberMap[memberId];
                            addLastActionCell(row, member.last_action.relative);

                            if (isInactiveForThreeDays(member.last_action.relative)) {
                                inactiveMembers.push({
                                    name: member.name,
                                    lastAction: member.last_action.relative
                                });
                            }
                        }
                    }
                });

                if (inactiveMembers.length > 0) {
                    const memberList = inactiveMembers.map(m => `${m.name} (${m.lastAction})`).join('\n');
                    alert(`Inactive members (3+ days):\n\n${memberList}\n\nTotal: ${inactiveMembers.length} member(s)`);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addTableHeader() {
        const headerRow = document.querySelector('ul.table-header');
        if (headerRow && !document.querySelector('.last-action-header')) {
            const statusHeader = headerRow.querySelector('.table-cell.status');
            if (statusHeader) {
                const lastActionHeader = document.createElement('div');
                lastActionHeader.className = 'table-cell last-action-header';
                lastActionHeader.textContent = 'LA';
                lastActionHeader.title = 'Last Action';
                lastActionHeader.style.cssText = 'font-weight: bold; padding: 5px; text-align: center;';
                statusHeader.parentNode.insertBefore(lastActionHeader, statusHeader);
            }
        }
    }

    function formatTimeShort(relativeTime) {
        const match = relativeTime.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
        if (match) {
            const value = match[1];
            const unit = match[2].toLowerCase()[0];
            return `${value}${unit}`;
        }

        if (relativeTime.includes('0 minutes') || relativeTime.toLowerCase() === 'now') {
            return 'now';
        }

        return relativeTime;
    }

    function isInactiveForThreeDays(relativeTime) {
        const match = relativeTime.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2].toLowerCase();

            if (unit === 'day' && value >= 3) {
                return true;
            }
            if (unit === 'week' || unit === 'month' || unit === 'year') {
                return true;
            }
        }
        return false;
    }

    function isInactiveForOneDay(relativeTime) {
        const match = relativeTime.match(/(\d+)\s+(day)s?\s+ago/i);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2].toLowerCase();

            if (unit === 'day' && value >= 1 && value < 3) {
                return true;
            }
        }
        return false;
    }

    function addLastActionCell(row, lastAction) {
        if (row.querySelector('.last-action-cell')) {
            return;
        }

        const statusCell = row.querySelector('.table-cell.status');
        if (statusCell) {
            const lastActionCell = document.createElement('div');
            lastActionCell.className = 'table-cell last-action-cell';
            lastActionCell.textContent = formatTimeShort(lastAction);
            lastActionCell.title = lastAction;

            let cellStyle = 'padding: 5px; text-align: center; white-space: nowrap;';

            if (isInactiveForThreeDays(lastAction)) {
                cellStyle += ' background-color: rgba(255, 0, 0, 0.3);';
            }
            else if (isInactiveForOneDay(lastAction)) {
                cellStyle += ' background-color: rgba(255, 255, 0, 0.3);';
            }

            lastActionCell.style.cssText = cellStyle;
            statusCell.parentNode.insertBefore(lastActionCell, statusCell);
        }
    }

    async function init() {
        const isYourFactionPage = window.location.href.includes('factions.php?step=your');
        const isProfilePage = window.location.href.includes('factions.php?step=profile');

        if (!isYourFactionPage && !isProfilePage) {
            return;
        }

        const apiKey = getApiKey();
        if (!apiKey) {
            console.error('No API key provided');
            return;
        }

        let factionId;

        if (isProfilePage) {
            factionId = getFactionIdFromUrl();
            console.log('Faction ID from URL:', factionId);

            if (!factionId) {
                factionId = await getFactionId(apiKey);
                console.log('Faction ID from storage:', factionId);
            }
        } else {
            console.log('Getting faction ID...');
            factionId = await getFactionId(apiKey);
        }

        if (!factionId) {
            console.error('Could not retrieve faction ID');
            return;
        }

        console.log('Fetching faction members data for faction:', factionId);
        const members = await fetchFactionMembers(factionId, apiKey);

        if (members) {
            console.log('Members data received:', members.length, 'members');
            addLastActionColumn(members);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();