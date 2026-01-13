// ==UserScript==
// @name         AWA Smart Collapsible Sections
// @namespace    http://tampermonkey.net/
// @version      1.0
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

    // Configuration
    const CONFIG = {
        // Default auto mode settings (can be toggled by user)
        AUTO_MODES: {
            'daily-quests': true,
            'steam-quests': true,
            'watch-twitch': true
        },
        // Default collapsed states (not affected by auto mode)
        DEFAULT_COLLAPSED: {
            "today's-reward": true,
            "7-day-streak-rewards": true,
            "28-day-daily-login-rewards": true
        }
    };

    // Wait for page to load
    setTimeout(initSmartCollapsibleSections, 1500);

    function initSmartCollapsibleSections() {
        console.log('Initializing smart collapsible sections...');
        
        // Load saved settings first
        loadSettings();
        
        // Add CSS
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
                padding-right: 120px !important; /* More space for both buttons */
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
            
            /* Auto toggle button - positioned left of collapse button */
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
                right: 45px; /* Positioned left of collapse button */
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
            
            /* Special handling for Twitch section header with multiple h3 elements */
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
        `;
        document.head.appendChild(style);

        // Process all sections
        processAllSections();
        
        console.log('Smart collapsible sections initialized');
    }

    function loadSettings() {
        // Load auto modes
        Object.keys(CONFIG.AUTO_MODES).forEach(key => {
            const saved = loadState(`auto-mode-${key}`);
            if (saved !== null) {
                CONFIG.AUTO_MODES[key] = saved;
            }
        });
        
        // Load default collapsed states
        Object.keys(CONFIG.DEFAULT_COLLAPSED).forEach(key => {
            const saved = loadState(`default-collapsed-${key}`);
            if (saved !== null) {
                CONFIG.DEFAULT_COLLAPSED[key] = saved;
            }
        });
    }

    function processAllSections() {
        // Process each section
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
                    // Apply auto logic ONCE on page load if auto mode is enabled
                    if (CONFIG.AUTO_MODES[section.autoKey]) {
                        setTimeout(() => {
                            applyAutoLogic(sectionData, section.autoKey, true);
                        }, 200);
                    }
                }
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
        
        // Check if toggle already exists
        if (cardHeader.querySelector('.awa-toggle-btn')) {
            return cardHeader.querySelector('.awa-toggle-btn');
        }
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'awa-toggle-btn';
        toggleBtn.textContent = '▼';
        toggleBtn.title = 'Click to collapse/expand';
        
        // Generate a unique ID for this section
        const sectionId = 'awa-section-' + title.replace(/\s+/g, '-').toLowerCase();
        
        // Add click handler
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isCollapsed = card.classList.contains('awa-collapsed');
            
            if (isCollapsed) {
                // Expand
                card.classList.remove('awa-collapsed');
                this.classList.remove('collapsed');
                this.textContent = '▼';
                saveState(sectionId, false);
            } else {
                // Collapse
                card.classList.add('awa-collapsed');
                this.classList.add('collapsed');
                this.textContent = '▲';
                saveState(sectionId, true);
            }
        });
        
        // Add button to header
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(toggleBtn);
        
        // Load saved state or apply default
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
        
        // Remove existing auto toggle if any
        const existing = cardHeader.querySelector('.awa-auto-toggle');
        if (existing) existing.remove();
        
        // Create auto toggle button
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
            
            // Update title/tooltip
            this.title = CONFIG.AUTO_MODES[key] ? 
                'Auto mode: ON (click to disable)' : 
                'Auto mode: OFF (click to enable)';
            
            saveState(`auto-mode-${key}`, CONFIG.AUTO_MODES[key]);
            
            // If turning auto mode ON, apply logic once (if no manual state exists)
            if (CONFIG.AUTO_MODES[key]) {
                const { card } = sectionData;
                const sectionId = `awa-section-${key.replace('-', '-')}`;
                const savedState = loadState(sectionId);
                
                // Only apply if no manual state exists
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
            console.log(`Auto mode disabled for ${autoKey}`);
            return;
        }
        
        // Don't override manual state if this is not initial load
        if (!isInitialLoad) {
            const savedState = loadState(sectionId);
            if (savedState !== null) {
                console.log(`Respecting saved state for ${autoKey}: ${savedState ? 'collapsed' : 'expanded'}`);
                return;
            }
        }
        
        console.log(`Applying auto logic for ${autoKey} (initial: ${isInitialLoad})`);
        
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
        // Look for "Complete" status
        const questItems = card.querySelectorAll('.quest-item-progress');
        let allComplete = true;
        
        questItems.forEach(item => {
            if (item.textContent.trim() === 'Incomplete') {
                allComplete = false;
            }
        });
        
        // If no quest items found, check section text
        if (questItems.length === 0) {
            const sectionText = card.textContent;
            if (sectionText.includes('Incomplete')) {
                allComplete = false;
            } else if (sectionText.includes('Complete')) {
                allComplete = true;
            }
        }
        
        // Only apply auto logic on initial load, not after
        if (isInitialLoad) {
            if (allComplete) {
                // Auto collapse
                card.classList.add('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▲';
                }
                saveState(sectionId, true);
                console.log('Daily Quests: Auto collapsed on load (all complete)');
            } else {
                // Auto expand
                card.classList.remove('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.remove('collapsed');
                    toggleBtn.textContent = '▼';
                }
                saveState(sectionId, false);
                console.log('Daily Quests: Auto expanded on load (incomplete found)');
            }
        }
    }

    function applySteamQuestsLogic(card, toggleBtn, sectionId, isInitialLoad) {
        // Count complete/incomplete Steam quests
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
        
        // If no specific status elements found, check text
        if (foundStatuses === 0) {
            const sectionText = card.textContent;
            incompleteCount = (sectionText.match(/Incomplete/g) || []).length;
        }
        
        // Only apply auto logic on initial load
        if (isInitialLoad) {
            if (incompleteCount === 0 && foundStatuses > 0) {
                // Auto collapse if all 3 are complete
                card.classList.add('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▲';
                }
                saveState(sectionId, true);
                console.log('Steam Quests: Auto collapsed on load (all 3 complete)');
            } else if (incompleteCount > 0) {
                // Auto expand if any incomplete
                card.classList.remove('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.remove('collapsed');
                    toggleBtn.textContent = '▼';
                }
                saveState(sectionId, false);
                console.log(`Steam Quests: Auto expanded on load (${incompleteCount} incomplete)`);
            }
        }
    }

    function applyWatchTwitchLogic(card, toggleBtn, sectionId, isInitialLoad) {
        // Check if "Max Cap Reached" is visible (means complete)
        const maxCapElement = card.querySelector('#control-center__twitch-max-reached');
        const isComplete = maxCapElement && 
                          maxCapElement.style.display !== 'none' && 
                          window.getComputedStyle(maxCapElement).display !== 'none';
        
        // Also check text content in case element is hidden differently
        const sectionText = card.textContent;
        const hasMaxCapReached = sectionText.includes('Max Cap Reached');
        const hasIncomplete = sectionText.includes('Incomplete');
        
        console.log('Twitch Status:', {
            maxCapElement: !!maxCapElement,
            isComplete: isComplete,
            hasMaxCapReached: hasMaxCapReached,
            hasIncomplete: hasIncomplete,
            displayStyle: maxCapElement ? maxCapElement.style.display : 'none'
        });
        
        // Only apply auto logic on initial load
        if (isInitialLoad) {
            if (isComplete || hasMaxCapReached) {
                // Auto collapse if max cap reached (complete)
                card.classList.add('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▲';
                }
                saveState(sectionId, true);
                console.log('Watch Twitch: Auto collapsed on load (Max Cap Reached)');
            } else if (hasIncomplete) {
                // Auto expand if incomplete
                card.classList.remove('awa-collapsed');
                if (toggleBtn) {
                    toggleBtn.classList.remove('collapsed');
                    toggleBtn.textContent = '▼';
                }
                saveState(sectionId, false);
                console.log('Watch Twitch: Auto expanded on load (Incomplete)');
            } else {
                console.log('Watch Twitch: Status unknown, no auto action');
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

    // Retry initialization if needed
    setTimeout(() => {
        if (!document.querySelector('.awa-toggle-btn')) {
            console.log('Retrying initialization...');
            initSmartCollapsibleSections();
        }
    }, 3000);
})();