// ==UserScript==
// @name         Torn User List Stats
// @namespace    https://torn.com/
// @version      2.0
// @description  Display health and last online status for users in any user list
// @author       You
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562813/Torn%20User%20List%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/562813/Torn%20User%20List%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEYS = {
        API_KEY: 'torn_api_key',
        SHOW_USER_LISTS: 'torn_show_user_lists',
        SHOW_TRAVEL_LISTS: 'torn_show_travel_lists'
    };

    const FETCH_DELAY = 150;

    let apiKey = null;
    let showUserLists = true;
    let showTravelLists = true;
    let fetchQueue = [];
    let isFetching = false;
    let processedUsers = new Set();
    let settingsInjected = false;

    function loadSettings() {
        apiKey = GM_getValue(STORAGE_KEYS.API_KEY, null);
        showUserLists = GM_getValue(STORAGE_KEYS.SHOW_USER_LISTS, true);
        showTravelLists = GM_getValue(STORAGE_KEYS.SHOW_TRAVEL_LISTS, true);
    }

    function saveSettings(newApiKey, newShowUserLists, newShowTravelLists) {
        if (newApiKey !== undefined) {
            GM_setValue(STORAGE_KEYS.API_KEY, newApiKey);
            apiKey = newApiKey;
        }
        if (newShowUserLists !== undefined) {
            GM_setValue(STORAGE_KEYS.SHOW_USER_LISTS, newShowUserLists);
            showUserLists = newShowUserLists;
        }
        if (newShowTravelLists !== undefined) {
            GM_setValue(STORAGE_KEYS.SHOW_TRAVEL_LISTS, newShowTravelLists);
            showTravelLists = newShowTravelLists;
        }
    }

    function maskApiKey(key) {
        if (!key || key.length < 8) return key || '';
        return '••••••••' + key.slice(-6);
    }

    function createModal() {
        const existingModal = document.getElementById('tuls-settings-modal');
        if (existingModal) {
            existingModal.style.display = 'flex';
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'tuls-settings-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 20px;
            min-width: 320px;
            max-width: 400px;
            color: #ccc;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h3');
        title.textContent = 'User List Stats Settings';
        title.style.cssText = `
            margin: 0 0 20px 0;
            padding: 0 0 10px 0;
            border-bottom: 1px solid #333;
            color: #fff;
            font-size: 16px;
        `;
        modal.appendChild(title);

        const apiSection = document.createElement('div');
        apiSection.style.cssText = 'margin-bottom: 20px;';

        const apiLabel = document.createElement('label');
        apiLabel.textContent = 'API Key';
        apiLabel.style.cssText = 'display: block; margin-bottom: 8px; font-size: 13px;';
        apiSection.appendChild(apiLabel);

        const apiInputWrapper = document.createElement('div');
        apiInputWrapper.style.cssText = 'display: flex; gap: 8px;';

        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.id = 'tuls-api-key-input';
        apiInput.placeholder = 'Enter API key...';
        apiInput.value = apiKey ? maskApiKey(apiKey) : '';
        apiInput.style.cssText = `
            flex: 1;
            padding: 8px 10px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 3px;
            color: #fff;
            font-size: 13px;
        `;

        let isEditing = false;
        apiInput.addEventListener('focus', function() {
            if (!isEditing && apiKey) {
                this.value = '';
                this.placeholder = 'Enter new API key...';
                isEditing = true;
            }
        });

        apiInput.addEventListener('blur', function() {
            if (isEditing && this.value === '') {
                this.value = apiKey ? maskApiKey(apiKey) : '';
                this.placeholder = 'Enter API key...';
                isEditing = false;
            }
        });

        apiInputWrapper.appendChild(apiInput);
        apiSection.appendChild(apiInputWrapper);
        modal.appendChild(apiSection);

        const togglesSection = document.createElement('div');
        togglesSection.style.cssText = 'margin-bottom: 20px;';

        function createToggle(id, label, checked) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #333;
            `;

            const labelEl = document.createElement('span');
            labelEl.textContent = label;
            labelEl.style.cssText = 'font-size: 13px;';
            container.appendChild(labelEl);

            const toggleWrapper = document.createElement('div');
            toggleWrapper.style.cssText = 'position: relative;';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = checked;
            checkbox.style.cssText = `
                width: 40px;
                height: 20px;
                appearance: none;
                background: #444;
                border-radius: 10px;
                cursor: pointer;
                position: relative;
                transition: background 0.2s;
            `;

            checkbox.addEventListener('change', function() {
                this.style.background = this.checked ? '#7ca900' : '#444';
            });

            if (checked) {
                checkbox.style.background = '#7ca900';
            }

            const style = document.createElement('style');
            style.textContent = `
                #${id}::before {
                    content: '';
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    background: #fff;
                    border-radius: 50%;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.2s;
                }
                #${id}:checked::before {
                    transform: translateX(20px);
                }
            `;
            document.head.appendChild(style);

            toggleWrapper.appendChild(checkbox);
            container.appendChild(toggleWrapper);

            return container;
        }

        togglesSection.appendChild(createToggle('tuls-toggle-user-lists', 'Show on user lists', showUserLists));
        togglesSection.appendChild(createToggle('tuls-toggle-travel-lists', 'Show on travel lists', showTravelLists));
        modal.appendChild(togglesSection);

        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            padding: 8px 16px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            color: #ccc;
            cursor: pointer;
            font-size: 13px;
        `;
        cancelBtn.addEventListener('click', function() {
            overlay.style.display = 'none';
        });
        buttonSection.appendChild(cancelBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `
            padding: 8px 16px;
            background: #7ca900;
            border: none;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
        `;
        saveBtn.addEventListener('click', function() {
            const inputVal = apiInput.value.trim();
            const newUserLists = document.getElementById('tuls-toggle-user-lists').checked;
            const newTravelLists = document.getElementById('tuls-toggle-travel-lists').checked;

            if (isEditing && inputVal && !inputVal.startsWith('••••')) {
                saveSettings(inputVal, newUserLists, newTravelLists);
                apiInput.value = maskApiKey(inputVal);
                isEditing = false;
            } else {
                saveSettings(undefined, newUserLists, newTravelLists);
            }

            overlay.style.display = 'none';
            processedUsers.clear();
            setTimeout(scanForUsers, 100);
        });
        buttonSection.appendChild(saveBtn);

        modal.appendChild(buttonSection);
        overlay.appendChild(modal);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });

        document.body.appendChild(overlay);
    }

    function injectSettingsMenuItem() {
        if (settingsInjected) return;

        const settingsMenu = document.querySelector('ul.settings-menu');
        if (!settingsMenu) return;

        const existingItem = document.getElementById('tuls-settings-menu-item');
        if (existingItem) return;

        const menuItem = document.createElement('li');
        menuItem.id = 'tuls-settings-menu-item';
        menuItem.className = 'link';
        menuItem.innerHTML = `
            <a href="#" style="display: flex; align-items: center;">
                <div class="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-6 -4 28 28">
                        <path d="M8,0C3.58,0,0,3.58,0,8s3.58,8,8,8,8-3.58,8-8S12.42,0,8,0Zm0,14c-3.31,0-6-2.69-6-6s2.69-6,6-6,6,2.69,6,6-2.69,6-6,6Zm0-10c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4Zm0,6c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Z"/>
                    </svg>
                </div>
                <span class="link-text">User List Stats</span>
            </a>
        `;

        menuItem.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            createModal();
        });

        const logoutItem = settingsMenu.querySelector('li.link a[href*="logout"]')?.parentElement;
        if (logoutItem) {
            settingsMenu.insertBefore(menuItem, logoutItem);
        } else {
            settingsMenu.appendChild(menuItem);
        }

        settingsInjected = true;
    }

    function fetchUserData(userId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/${userId}?selections=profile&key=${apiKey}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(data.error);
                        } else {
                            resolve(data);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function formatLastAction(timestamp) {
        if (!timestamp) return '?';

        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    function formatHealth(current, max) {
        if (current === undefined || max === undefined) return '?';
        return `${current.toLocaleString()}/${max.toLocaleString()}`;
    }

    function createStatsCell(health, lastAction) {
        const cell = document.createElement('div');
        cell.className = 'torn-userlist-stats';
        cell.style.cssText = 'font-size: 12px; padding: 8px 10px; display: flex; flex-direction: column; justify-content: center; min-width: 100px;';

        const healthColor = health.current === health.max ? '#7ca900' :
                           health.current > health.max * 0.5 ? '#e6a400' : '#c90000';

        cell.innerHTML = `
            <span style="color: ${healthColor};">${formatHealth(health.current, health.max)}</span>
            <span style="color: #999; font-size: 11px;">${formatLastAction(lastAction)}</span>
        `;

        return cell;
    }

    function addColumnHeader() {
        if (document.querySelector('.torn-userlist-stats-header')) return;

        const tableHead = document.querySelector('[class*="tableHead___"]');
        if (!tableHead) return;

        const levelHeader = tableHead.querySelector('[class*="level___"]');
        if (!levelHeader) return;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'torn-userlist-stats-header';
        headerDiv.style.cssText = 'padding: 8px 10px; font-weight: bold; min-width: 100px; display: flex; align-items: center;';
        headerDiv.textContent = 'HP / Activity';

        levelHeader.insertAdjacentElement('afterend', headerDiv);
    }

    function injectStats(userRow, data, listType) {
        const existing = userRow.querySelector('.torn-userlist-stats');
        if (existing) existing.remove();

        const health = {
            current: data.life?.current,
            max: data.life?.maximum
        };
        const lastAction = data.last_action?.timestamp;

        if (listType === 'new') {
            addColumnHeader();

            const levelDiv = userRow.querySelector('[class*="level___"]');
            if (levelDiv) {
                const statsCell = createStatsCell(health, lastAction);
                levelDiv.insertAdjacentElement('afterend', statsCell);
            }
        } else {
            const levelSpan = userRow.querySelector('.left-side .level');
            if (levelSpan) {
                const span = document.createElement('span');
                span.className = 'torn-userlist-stats';
                span.style.cssText = 'margin-left: 8px; font-size: 11px; color: #999;';

                const healthColor = health.current === health.max ? '#7ca900' :
                                   health.current > health.max * 0.5 ? '#e6a400' : '#c90000';

                span.innerHTML = `<span style="color: ${healthColor};">HP: ${formatHealth(health.current, health.max)}</span> | <span>${formatLastAction(lastAction)}</span>`;
                levelSpan.insertAdjacentElement('afterend', span);
            }
        }
    }

    async function processQueue() {
        if (isFetching || fetchQueue.length === 0 || !apiKey) return;

        isFetching = true;

        while (fetchQueue.length > 0) {
            const { userId, element, listType } = fetchQueue.shift();

            try {
                const data = await fetchUserData(userId);
                injectStats(element, data, listType);
            } catch (error) {
                console.error(`Failed to fetch data for user ${userId}:`, error);

                if (error.code === 2) {
                    console.log('Torn User List Stats: Invalid API key');
                    fetchQueue = [];
                    break;
                }
            }

            if (fetchQueue.length > 0) {
                await new Promise(r => setTimeout(r, FETCH_DELAY));
            }
        }

        isFetching = false;
    }

    function extractUserId(element) {
        const selectors = [
            'a[href*="profiles.php?XID="]',
            'a.user.name[href*="XID="]'
        ];

        for (const selector of selectors) {
            const link = element.querySelector(selector);
            if (link) {
                const match = link.href.match(/XID=(\d+)/);
                if (match) return match[1];
            }
        }
        return null;
    }

    function isTravelPage() {
        return window.location.pathname.includes('/abroad') ||
               window.location.pathname.includes('/travel') ||
               document.querySelector('.travel-agency') !== null ||
               document.querySelector('[class*="travel"]') !== null;
    }

    function scanForUsers() {
        if (!apiKey) return;

        const onTravelPage = isTravelPage();

        if (showUserLists && !onTravelPage) {
            const newFormatRows = document.querySelectorAll('li[class*="tableRow___"]');
            newFormatRows.forEach(row => {
                const userId = extractUserId(row);
                if (!userId || processedUsers.has(userId)) return;
                processedUsers.add(userId);
                fetchQueue.push({ userId, element: row, listType: 'new' });
            });
        }

        if (showTravelLists && onTravelPage) {
            const newFormatRows = document.querySelectorAll('li[class*="tableRow___"]');
            newFormatRows.forEach(row => {
                const userId = extractUserId(row);
                if (!userId || processedUsers.has(userId)) return;
                processedUsers.add(userId);
                fetchQueue.push({ userId, element: row, listType: 'new' });
            });
        }

        if (showTravelLists) {
            const oldFormatLists = document.querySelectorAll('.users-list');
            oldFormatLists.forEach(list => {
                const users = list.querySelectorAll('li');
                users.forEach(userLi => {
                    const userId = extractUserId(userLi);
                    if (!userId || processedUsers.has(userId)) return;
                    processedUsers.add(userId);
                    fetchQueue.push({ userId, element: userLi, listType: 'old' });
                });
            });
        }

        processQueue();
    }

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            let shouldCheckSettings = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches?.('ul.settings-menu') ||
                                node.querySelector?.('ul.settings-menu')) {
                                shouldCheckSettings = true;
                            }

                            if (node.matches?.('li[class*="tableRow___"]') ||
                                node.querySelector?.('li[class*="tableRow___"]')) {
                                shouldScan = true;
                            }

                            if (node.classList?.contains('users-list') ||
                                node.querySelector?.('.users-list') ||
                                (node.tagName === 'LI' && node.closest('.users-list'))) {
                                shouldScan = true;
                            }
                        }
                    }
                }
            }

            if (shouldCheckSettings) {
                setTimeout(injectSettingsMenuItem, 50);
            }

            if (shouldScan) {
                setTimeout(scanForUsers, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        loadSettings();

        setTimeout(injectSettingsMenuItem, 500);
        setTimeout(scanForUsers, 500);
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();