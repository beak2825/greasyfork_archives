// ==UserScript==
// @name         AWA Smart Collapsible Sections
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Smart collapsible sections with per-section auto toggles
// @author       MarvashMagalli
// @match        https://*alienwarearena.com/quests
// @match        https://*alienwarearena.com/control-center
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562377/AWA%20Smart%20Collapsible%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/562377/AWA%20Smart%20Collapsible%20Sections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        AUTO_MODES: {
            'daily-quests': true,
            'steam-quests': true,
            'watch-twitch': true
        },
        DEFAULT_COLLAPSED: {
            "today's-reward": true,
            "7-day-streak-rewards": true,
            "28-day-daily-login-rewards": true,
            "steam-community-events": true
        }
    };

    setTimeout(initSmartCollapsibleSections, 1500);

    function initSmartCollapsibleSections() {
        loadSettings();

        const style = document.createElement('style');
        style.textContent = `
            .awa-toggle-btn {
                cursor: pointer;
                font-size: 18px;
                color: #00d4ff;
                background: transparent;
                border: none;
                padding: 2px 8px;
                margin-left: 10px;
                float: right;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 20;
            }
            .awa-toggle-btn:hover {
                background: rgba(0, 212, 255, 0.1);
                border-radius: 3px;
            }
            .awa-collapsed .user-profile__card-body,
            .awa-collapsed .user-profile__card-footer {
                display: none !important;
            }
            .awa-toggle-btn.collapsed {
                transform: translateY(-50%) rotate(180deg);
            }
            .user-profile__card-header {
                position: relative !important;
                padding-right: 120px !important;
                min-height: 40px;
            }
            .user-profile__card-header h3 {
                margin: 0;
                padding: 10px 0;
                display: inline-block;
                max-width: calc(100% - 120px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: relative;
                z-index: 1;
            }
            .awa-auto-toggle {
                cursor: pointer;
                font-size: 12px;
                color: #888;
                margin-left: 5px;
                padding: 2px 6px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s;
                position: absolute;
                right: 45px;
                top: 50%;
                transform: translateY(-50%);
                white-space: nowrap;
                min-width: 40px;
                text-align: center;
                z-index: 20;
            }
            .awa-auto-toggle:hover {
                background: rgba(0, 212, 255, 0.1);
                border-color: rgba(0, 212, 255, 0.3);
            }
            .awa-auto-toggle.active {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00d4ff;
                color: #00d4ff;
            }
            .awa-auto-toggle.active:before {
                content: "✓ ";
                font-weight: bold;
            }
            .user-profile__card-header .col-3 {
                position: relative;
                z-index: 1;
            }
            .user-profile__card-header .col-3.text-end {
                position: relative;
                z-index: 1;
            }
            #control-center__twitch-max-reached {
                position: relative;
                z-index: 1;
            }
            .awa-event-wrapper {
                margin-bottom: 15px;
            }
            .awa-event-wrapper.awa-collapsed .community-event-banner {
                display: none !important;
            }
            .awa-event-header {
                position: relative;
                background: #1a1a2e;
                border: 1px solid #2a2a3e;
                border-radius: 4px;
                padding: 10px 15px;
                margin-bottom: 10px;
                min-height: 40px;
            }
            .awa-event-header h3 {
                margin: 0;
                padding: 5px 0;
                display: inline-block;
                max-width: calc(100% - 50px);
                color: #fff;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);

        processAllSections();
        processCommunityEvents();
    }

    function loadSettings() {
        Object.keys(CONFIG.AUTO_MODES).forEach(key => {
            const saved = loadState(`auto-mode-${key}`);
            if (saved !== null) {
                CONFIG.AUTO_MODES[key] = saved;
            }
        });
        Object.keys(CONFIG.DEFAULT_COLLAPSED).forEach(key => {
            const saved = loadState(`default-collapsed-${key}`);
            if (saved !== null) {
                CONFIG.DEFAULT_COLLAPSED[key] = saved;
            }
        });
    }

    function processAllSections() {
        const sections = [
            { id: 'daily-quests', title: "Daily Quests", autoKey: 'daily-quests' },
            { id: 'steam-quests', title: "Steam Quests", autoKey: 'steam-quests' },
            { id: 'watch-twitch', title: "Watch Twitch", autoKey: 'watch-twitch' },
            { id: 'todays-reward', title: "Today's Reward" },
            { id: 'streak-rewards', title: "7-Day Streak Rewards" },
            { id: 'monthly-rewards', title: "28-Day Daily Login Rewards" }
        ];

        sections.forEach(section => {
            const sectionData = findSectionByTitle(section.title);
            if (sectionData) {
                const forceCollapse = CONFIG.DEFAULT_COLLAPSED[section.id] || false;
                addToggleToSection(sectionData, section.title, forceCollapse);
                if (section.autoKey) {
                    addAutoToggle(sectionData, section.autoKey);
                    if (CONFIG.AUTO_MODES[section.autoKey]) {
                        setTimeout(() => {
                            applyAutoLogic(sectionData, section.autoKey, true);
                        }, 200);
                    }
                }
            }
        });
    }

    function processCommunityEvents() {
        const communityEventBanners = document.querySelectorAll('.community-event-banner');

        communityEventBanners.forEach(banner => {
            if (banner.closest('.awa-event-wrapper')) {
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'awa-event-wrapper';

            const header = document.createElement('div');
            header.className = 'awa-event-header';

            const title = document.createElement('h3');
            title.textContent = 'Steam Community Event';
            header.appendChild(title);

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'awa-toggle-btn';
            toggleBtn.textContent = '▼';
            toggleBtn.title = 'Click to collapse/expand';

            const sectionId = 'awa-section-steam-community-event-' + Date.now();

            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const isCollapsed = wrapper.classList.contains('awa-collapsed');
                if (isCollapsed) {
                    wrapper.classList.remove('awa-collapsed');
                    this.classList.remove('collapsed');
                    this.textContent = '▼';
                    saveState(sectionId, false);
                } else {
                    wrapper.classList.add('awa-collapsed');
                    this.classList.add('collapsed');
                    this.textContent = '▲';
                    saveState(sectionId, true);
                }
            });

            header.appendChild(toggleBtn);
            wrapper.appendChild(header);
            wrapper.appendChild(banner.cloneNode(true));

            banner.parentNode.insertBefore(wrapper, banner);
            banner.remove();

            const savedState = loadState('steam-community-events-default');
            let shouldCollapse = CONFIG.DEFAULT_COLLAPSED['steam-community-events'];
            if (savedState !== null) {
                shouldCollapse = savedState;
            }

            if (shouldCollapse) {
                wrapper.classList.add('awa-collapsed');
                toggleBtn.classList.add('collapsed');
                toggleBtn.textContent = '▲';
            }
        });
    }

    function findSectionByTitle(titleText) {
        const allHeaders = document.querySelectorAll('.user-profile__card-header h3');
        for (const header of allHeaders) {
            if (header.textContent.trim().includes(titleText)) {
                const card = header.closest('.user-profile__profile-card');
                if (card) return { card, header };
            }
        }
        return null;
    }

    function addToggleToSection(sectionData, title, forceCollapse = false) {
        const { card, header } = sectionData;
        const cardHeader = header.closest('.user-profile__card-header');
        if (!cardHeader) return null;
        if (cardHeader.querySelector('.awa-toggle-btn')) {
            return cardHeader.querySelector('.awa-toggle-btn');
        }
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'awa-toggle-btn';
        toggleBtn.textContent = '▼';
        toggleBtn.title = 'Click to collapse/expand';
        const sectionId = 'awa-section-' + title.replace(/\s+/g, '-').toLowerCase();
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isCollapsed = card.classList.contains('awa-collapsed');
            if (isCollapsed) {
                card.classList.remove('awa-collapsed');
                this.classList.remove('collapsed');
                this.textContent = '▼';
                saveState(sectionId, false);
            } else {
                card.classList.add('awa-collapsed');
                this.classList.add('collapsed');
                this.textContent = '▲';
                saveState(sectionId, true);
            }
        });
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(toggleBtn);
        const savedState = loadState(sectionId);
        let shouldCollapse = forceCollapse;
        if (savedState !== null) {
            shouldCollapse = savedState;
        }
        if (shouldCollapse) {
            card.classList.add('awa-collapsed');
            toggleBtn.classList.add('collapsed');
            toggleBtn.textContent = '▲';
        }
        return toggleBtn;
    }

    function addAutoToggle(sectionData, autoKey) {
        const { header } = sectionData;
        const cardHeader = header.closest('.user-profile__card-header');
        if (!cardHeader) return;
        const existing = cardHeader.querySelector('.awa-auto-toggle');
        if (existing) existing.remove();
        const autoToggle = document.createElement('button');
        autoToggle.className = `awa-auto-toggle ${CONFIG.AUTO_MODES[autoKey] ? 'active' : ''}`;
        autoToggle.textContent = 'Auto';
        autoToggle.title = CONFIG.AUTO_MODES[autoKey] ?
            'Auto mode: ON (click to disable)' :
            'Auto mode: OFF (click to enable)';
        autoToggle.dataset.autoKey = autoKey;
        autoToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const key = this.dataset.autoKey;
            CONFIG.AUTO_MODES[key] = !CONFIG.AUTO_MODES[key];
            this.classList.toggle('active');
            this.title = CONFIG.AUTO_MODES[key] ?
                'Auto mode: ON (click to disable)' :
                'Auto mode: OFF (click to enable)';
            saveState(`auto-mode-${key}`, CONFIG.AUTO_MODES[key]);
            if (CONFIG.AUTO_MODES[key]) {
                const { card } = sectionData;
                const sectionId = `awa-section-${key.replace('-', '-')}`;
                const savedState = loadState(sectionId);
                if (savedState === null) {
                    applyAutoLogic(sectionData, key, false);
                }
            }
        });
        cardHeader.appendChild(autoToggle);
    }

    function applyAutoLogic(sectionData, autoKey, isInitialLoad = false) {
        const { card } = sectionData;
        const sectionId = `awa-section-${autoKey.replace('-', '-')}`;
        const toggleBtn = card.querySelector('.awa-toggle-btn');
        if (!CONFIG.AUTO_MODES[autoKey]) {
            return;
        }
        if (!isInitialLoad) {
            const savedState = loadState(sectionId);
            if (savedState !== null) {
                return;
            }
        }
        switch(autoKey) {
            case 'daily-quests':
                applyDailyQuestsLogic(card, toggleBtn, sectionId, isInitialLoad);
                break;
            case 'steam-quests':
                applySteamQuestsLogic(card, toggleBtn, sectionId, isInitialLoad);
                break;
            case 'watch-twitch':
                applyWatchTwitchLogic(card, toggleBtn, sectionId, isInitialLoad);
                break;
        }
    }

    function applyDailyQuestsLogic(card, toggleBtn, sectionId, isInitialLoad) {
        const questItems = card.querySelectorAll('.quest-item-progress');
        let allComplete = true;
        questItems.forEach(item => {
            if (item.textContent.trim() === 'Incomplete') {
                allComplete = false;
            }
        });
        if (questItems.length === 0) {
            const sectionText = card.textContent;
            if (sectionText.includes('Incomplete')) {
                allComplete = false;
            } else if (sectionText.includes('Complete')) {
                allComplete = true;
            }
        }
        if (isInitialLoad) {
            if (allComplete) {
                card.classList.add('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▲';
                }
                saveState(sectionId, true);
            } else {
                card.classList.remove('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.remove('collapsed');
                    toggleBtn.textContent = '▼';
                }
                saveState(sectionId, false);
            }
        }
    }

    function applySteamQuestsLogic(card, toggleBtn, sectionId, isInitialLoad) {
        const statusElements = card.querySelectorAll('.col-2.text-end');
        let incompleteCount = 0;
        let foundStatuses = 0;
        statusElements.forEach(element => {
            const statusText = element.textContent.trim();
            if (statusText === 'Incomplete' || statusText === 'Complete') {
                foundStatuses++;
                if (statusText === 'Incomplete') {
                    incompleteCount++;
                }
            }
        });
        if (foundStatuses === 0) {
            const sectionText = card.textContent;
            incompleteCount = (sectionText.match(/Incomplete/g) || []).length;
        }
        if (isInitialLoad) {
            if (incompleteCount === 0 && foundStatuses > 0) {
                card.classList.add('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▲';
                }
                saveState(sectionId, true);
            } else if (incompleteCount > 0) {
                card.classList.remove('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.remove('collapsed');
                    toggleBtn.textContent = '▼';
                }
                saveState(sectionId, false);
            }
        }
    }

    function applyWatchTwitchLogic(card, toggleBtn, sectionId, isInitialLoad) {
        const statusElement = card.querySelector('#control-center__twitch-arp-status');
        if (statusElement) {
            const statusText = statusElement.textContent.trim();
            const isComplete = statusText === 'Complete';
            const isIncomplete = statusText === 'Incomplete';
            if (isInitialLoad) {
                if (isComplete) {
                    card.classList.add('awa-collapsed');
                    if (toggleBtn) {
                        toggleBtn.classList.add('collapsed');
                        toggleBtn.textContent = '▲';
                    }
                    saveState(sectionId, true);
                } else if (isIncomplete) {
                    card.classList.remove('awa-collapsed');
                    if (toggleBtn) {
                        toggleBtn.classList.remove('collapsed');
                        toggleBtn.textContent = '▼';
                    }
                    saveState(sectionId, false);
                }
            }
        } else {
            if (isInitialLoad) {
                const sectionText = card.textContent;
                if (sectionText.includes('Complete')) {
                    card.classList.add('awa-collapsed');
                    if (toggleBtn) {
                        toggleBtn.classList.add('collapsed');
                        toggleBtn.textContent = '▲';
                    }
                    saveState(sectionId, true);
                } else if (sectionText.includes('Incomplete')) {
                    card.classList.remove('awa-collapsed');
                    if (toggleBtn) {
                        toggleBtn.classList.remove('collapsed');
                        toggleBtn.textContent = '▼';
                    }
                    saveState(sectionId, false);
                }
            }
        }
    }

    function saveState(key, value) {
        try {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(key, value);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            localStorage.setItem(key, value);
        }
    }

    function loadState(key) {
        try {
            if (typeof GM_getValue !== 'undefined') {
                const value = GM_getValue(key, null);
                return value;
            } else {
                const saved = localStorage.getItem(key);
                return saved === null ? null : (saved === 'true');
            }
        } catch (e) {
            const saved = localStorage.getItem(key);
            return saved === null ? null : (saved === 'true');
        }
    }

    setTimeout(() => {
        processAllSections();
        processCommunityEvents();
    }, 3000);
})();