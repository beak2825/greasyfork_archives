// ==UserScript==
// @name         Sportlogiq Event Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifies the default event view to show user-selected opponent events from the start.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554877/Sportlogiq%20Event%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554877/Sportlogiq%20Event%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FILTERABLE_EVENTS = [
        "check", "dumpin", "dumpinagainst", "puckprotection", "shot", "controlledentryagainst",
        "faceoffcontested", "contested", "carry", "block"
    ].sort();

    const defaultConfig = {
        eventVisibility: {
            "check": true, "dumpin": true, "dumpinagainst": true, "puckprotection": true, "shot": true,
            "controlledentryagainst": true, "faceoffcontested": true, "contested": true,
            "carry": true, "block": true
        }
    };

    let config = {};
    let globalData = {};
    let isInitialized = false;

    async function loadSettings() {
        const savedConfig = await GM_getValue('sportlogiqFilterConfig_v1.0');
        const newConfig = JSON.parse(JSON.stringify(defaultConfig));
        if (savedConfig && savedConfig.eventVisibility) {
            Object.assign(newConfig.eventVisibility, savedConfig.eventVisibility);
        }
        config = newConfig;
    }

    async function saveSettings() {
        await GM_setValue('sportlogiqFilterConfig_v1.0', JSON.stringify(config));
        if (document.getElementById('opposing-teambutton') && !document.getElementById('opposing-teambutton').classList.contains('active')) {
             applyCustomFilter();
        }
    }

    function applyCustomFilter() {
        if (!globalData.events) return;

        const urlParams = new URLSearchParams(window.location.search);
        const ownTeamId = urlParams.get('teamId');
        const opposingTeamId = Object.keys(globalData.rosters || {}).find(id => id !== ownTeamId);

        document.querySelectorAll('#game-events tbody tr[event-id]').forEach(row => {
            const eventId = row.getAttribute('event-id');
            const event = globalData.events.find(e => e.id === eventId);
            
            let shouldShow = false;

            if (row.id.startsWith('event-game-')) {
                shouldShow = true;
            }
            else if (event && event.teamId.toString() === ownTeamId) {
                shouldShow = true;
            }
            else if (event && event.teamId.toString() === opposingTeamId) {
                const nameMatch = config.eventVisibility[event.name];
                const typeMatch = config.eventVisibility[event.type];
                let isAllowed = nameMatch || typeMatch;
                
                if (event.name === 'carry') {
                    isAllowed = config.eventVisibility['carry'] && event.zone === 'oz';
                }
                
                let outcomeMatch = !(event.name === 'block' && config.eventVisibility['block'] && event.outcome !== 'successful');

                if (isAllowed && outcomeMatch) {
                    shouldShow = true;
                }
            }
            else if (!event) {
                shouldShow = true; 
            }
            row.style.display = shouldShow ? 'table-row' : 'none';
        });
    }

    function showAllEvents() {
        document.querySelectorAll('#game-events tbody tr').forEach(row => {
            row.style.display = 'table-row';
        });
    }

    function setupButtons() {
        const originalButton = document.getElementById('opposing-teambutton');
        if (originalButton && !originalButton.dataset.filterListenerAttached) {
            const newButton = originalButton.cloneNode(true);
            originalButton.parentNode.replaceChild(newButton, originalButton);
            newButton.dataset.filterListenerAttached = 'true';

            let isShowAllActive = false;
            newButton.addEventListener('click', () => {
                isShowAllActive = !isShowAllActive;
                newButton.classList.toggle('active', isShowAllActive);
                if (isShowAllActive) {
                    showAllEvents();
                } else {
                    applyCustomFilter();
                }
            });
        }
    }

    function processEventData(data) {
        if (isInitialized || typeof data !== 'object' || data === null || !data.events) return;
        isInitialized = true;
        
        globalData = data;
        
        setTimeout(() => {
            applyCustomFilter();
            setupButtons();
        }, 1500);
    }
    
    function createSettingsPanel() {
        if (document.getElementById('settings-modal-v1.0')) return;
        const modal = document.createElement('div');
        modal.id = 'settings-modal-v1.0';
        modal.style.cssText = 'display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.5);';
        const content = document.createElement('div');
        content.style.cssText = 'background-color:#fefefe; margin:5% auto; padding:20px; border:1px solid #888; width:auto; max-width: 500px; border-radius: 8px;';
        content.innerHTML = `
            <span id="close-settings-v1.0" style="color:#aaa; float:right; font-size:28px; font-weight:bold; cursor:pointer;">&times;</span>
            <h2>Налаштування фільтра подій</h2>
            <p>Позначте події суперника, які ви хочете бачити у стандартному вигляді.</p><hr>
            <div id="event-visibility-container-v1.0" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;"></div>
            <hr style="margin-top: 20px;">
            <button id="save-settings-btn-v1.0" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Зберегти</button>
            <button id="reset-settings-btn-v1.0" style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left:10px;">Скинути</button>
        `;
        modal.appendChild(content);
        document.body.appendChild(modal);
        document.getElementById('close-settings-v1.0').addEventListener('click', toggleSettingsModal);
        document.getElementById('save-settings-btn-v1.0').addEventListener('click', handleSave);
        document.getElementById('reset-settings-btn-v1.0').addEventListener('click', handleReset);
        modal.addEventListener('click', (event) => { if (event.target === modal) toggleSettingsModal(); });
    }

    function populateSettingsModal() {
        const container = document.getElementById('event-visibility-container-v1.0');
        container.innerHTML = '';
        FILTERABLE_EVENTS.forEach(eventName => {
            const isChecked = config.eventVisibility[eventName] === true;
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; align-items: center; white-space: nowrap;';
            const checkboxId = `event-cb-${eventName}`;
            wrapper.innerHTML = `
                <input type="checkbox" id="${checkboxId}" value="${eventName}" ${isChecked ? 'checked' : ''} style="margin-right: 8px; height: 16px; width: 16px;">
                <label for="${checkboxId}" title="${eventName}" style="cursor: pointer; font-size: 16px;">${eventName}</label>`;
            container.appendChild(wrapper);
        });
    }

    function toggleSettingsModal() {
        const modal = document.getElementById('settings-modal-v1.0');
        if (!modal) return;
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        if (modal.style.display === 'block') {
            populateSettingsModal();
        }
    }

    function handleSave() {
        FILTERABLE_EVENTS.forEach(eventName => {
            const checkbox = document.getElementById(`event-cb-${eventName}`);
            if (checkbox) {
                config.eventVisibility[eventName] = checkbox.checked;
            }
        });
        saveSettings();
        toggleSettingsModal();
        alert('Налаштування збережено!');
    }

    function handleReset() {
        if (confirm('Ви впевнені, що хочете скинути налаштування до стандартних?')) {
            config = JSON.parse(JSON.stringify(defaultConfig));
            populateSettingsModal();
            alert('Налаштування скинуто. Натисніть "Зберегти", щоб застосувати.');
        }
    }

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('/eventorplayerevents')) {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    try { processEventData(JSON.parse(this.responseText)); } catch (e) {}
                }
            });
        }
        return originalXhrOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('/eventorplayerevents')) {
            return originalFetch(url, options).then(response => {
                const responseClone = response.clone();
                responseClone.json().then(data => processEventData(data)).catch(err => {});
                return response;
            });
        }
        return originalFetch(url, options);
    };

    function initialize() {
        createSettingsPanel();
        GM_registerMenuCommand("Налаштування фільтра подій", toggleSettingsModal);
    }

    loadSettings();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();