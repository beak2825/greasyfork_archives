// ==UserScript==
// @name         Hidey Way Idle
// @namespace    http://tampermonkey.net/
// @version      2.55
// @description  Toggle visibility of various page elements in Milky Way Idle and draggable nav bar
// @author       Frotty
// @match        *://milkywayidle.com/*
// @match        *://*.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553755/Hidey%20Way%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/553755/Hidey%20Way%20Idle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Player name storage system
    let currentPlayerName = null;

    function getPlayerName() {
        const characterNameElement = document.querySelector('.CharacterName_name__1amXp[data-name]');
        if (characterNameElement) {
            const dataName = characterNameElement.getAttribute('data-name');
            if (dataName && dataName.trim()) {
                return dataName.trim();
            }
        }
        return null;
    }

    function getStorageKey(key) {
        if (!currentPlayerName) {
            return key;
        }
        return `${key}-${currentPlayerName}`;
    }

    function migrateOldSettings() {
        if (!currentPlayerName) return;
        const oldKeys = ['mwi-element-toggle', 'mwi-panel-position', 'mwi-panel-minimized', 'mwi-navpanel-position'];
        oldKeys.forEach(oldKey => {
            const oldValue = localStorage.getItem(oldKey);
            if (oldValue !== null) {
                const newKey = getStorageKey(oldKey);
                if (localStorage.getItem(newKey) === null) {
                    localStorage.setItem(newKey, oldValue);
                }
            }
        });
    }

    function pollForPlayerName(callback, maxAttempts = 50, interval = 200) {
        let attempts = 0;
        const poll = () => {
            attempts++;
            const newPlayerName = getPlayerName();
            if (newPlayerName && newPlayerName !== currentPlayerName) {
                currentPlayerName = newPlayerName;
                migrateOldSettings();
                callback();
                return;
            }
            if (attempts >= maxAttempts) {
                callback();
                return;
            }
            setTimeout(poll, interval);
        };
        poll();
    }

    // Configuration for elements to toggle
    const elementConfigs = [
        {
            name: 'Navigation Panel',
            selector: 'div[class*="GamePage_navPanel_"]',
            enabled: true
        },
        {
            name: 'Minor Links',
            selector: 'div[class*="NavigationBar_minorNavigationLinks_"]',
            enabled: true
        },
        {
            name: 'Logo/Playercount',
            selector: 'div[class*="Header_navLogoAndPlayerCount_"]',
            enabled: true
        },
        {
            name: 'Task Info',
            selector: 'div[class*="Header_questInfo__"]',
            enabled: true
        },
        {
            name: 'Inventory Button',
            selector: '#mwi-char-panel-toggle',
            enabled: true
        },
        {
            name: 'Toggle Button',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'My Stuff',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Marketplace',
            selector: null, // Will be found by index
            enabled: true,
            inDOM: false
        },
        {
            name: 'Tasks',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Milking',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Foraging',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Woodcutting',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Cheesesmithing',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Crafting',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Tailoring',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Cooking',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Brewing',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Alchemy',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Enhancing',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Combat Panel',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Combat',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Stamina',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Intelligence',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Attack',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Defense',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Melee',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Ranged',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Magic',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Shop',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Cowbell Store',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Loot Tracker',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Social',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Guild',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Leaderboard',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Settings',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'News',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Patch Notes',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Game Guide',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Game Rules',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Game Wiki',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Discord',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Test Server',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Privacy Policy',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Switch Character',
            selector: null,
            enabled: true,
            inDOM: false
        },
        {
            name: 'Logout',
            selector: null,
            enabled: true,
            inDOM: false
        },
        // Optional minor navigation links (may not exist)
        {
            name: 'Send Bug Report',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Combat Sim Shykai',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Profit Calc Cowculator',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Enhancement Sim',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Script Settings',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Edible Tools',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Chest Statistics',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Profit Calc Milkonomy',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Combat Tracker Socko',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Profit Calc Mooneycalc',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        },
        {
            name: 'Milkyway.Market',
            selector: null,
            enabled: true,
            inDOM: false,
            isOptional: true
        }
    ];

    // Load saved settings from localStorage
    function loadSettings() {
        const saved = localStorage.getItem(getStorageKey('mwi-element-toggle'));
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                elementConfigs.forEach(config => {
                    if (settings.hasOwnProperty(config.name)) {
                        config.enabled = settings[config.name];
                    }
                });
            } catch (e) {
                // Failed to load settings
            }
        }
    }

    // Load saved position from localStorage
    function loadPosition(key, defaultCenter = false) {
        const saved = localStorage.getItem(getStorageKey(key));
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                // Failed to load position
            }
        }
        // If no saved position and defaultCenter is true, calculate center position
        if (defaultCenter) {
            return {
                x: (window.innerWidth / 2) - 100, // Subtract half of approximate panel width
                y: (window.innerHeight / 2) - 100, // Subtract half of approximate panel height
                isInitial: true
            };
        }
        return { x: 0, y: 0 };
    }

    // Save position to localStorage
    function savePosition(key, x, y) {
        localStorage.setItem(getStorageKey(key), JSON.stringify({ x, y }));
    }

    // Save minimize state to localStorage
    function saveMinimizeState(isMinimized) {
        localStorage.setItem(getStorageKey('mwi-panel-minimized'), JSON.stringify(isMinimized));
    }

    // Load minimize state from localStorage
    function loadMinimizeState() {
        const saved = localStorage.getItem(getStorageKey('mwi-panel-minimized'));
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                // Failed to load minimize state
            }
        }
        return false; // Default to expanded
    }

    // Find and map navigation links to configs
    function updateNavigationLinks() {
        // Reset inDOM status and level
        elementConfigs.forEach(config => {
            if (!config.selector) {
                config.inDOM = false;
                config.element = null;
                config.level = null; // Reset level on each scan
            }
        });

        // Check for Toggle Button (appears at certain screen widths)
        const toggleButton = document.querySelector('div[class*="NavigationBar_navToggleButton_"]');
        if (toggleButton) {
            const config = elementConfigs.find(c => c.name === 'Toggle Button');
            if (config) {
                config.inDOM = true;
                config.element = toggleButton;
                config.originalDisplay = '';
            }
        }

        // Main navigation link names (direct children of navigationLinks)
        const mainLinkNames = [
            'My Stuff',
            'Marketplace',
            'Tasks',
            'Milking',
            'Foraging',
            'Woodcutting',
            'Cheesesmithing',
            'Crafting',
            'Tailoring',
            'Cooking',
            'Brewing',
            'Alchemy',
            'Enhancing',
            'Combat Panel',
            'Shop',
            'Cowbell Store',
            'Loot Tracker',
            'Social',
            'Guild',
            'Leaderboard',
            'Settings'
        ];

        // Minor navigation link names (with class NavigationBar_minorNavigationLink_)
        const minorLinkNames = [
            'News',
            'Patch Notes',
            'Game Guide',
            'Game Rules',
            'Game Wiki',
            'Discord',
            'Test Server',
            'Privacy Policy',
            'Switch Character',
            'Logout'
        ];

        // Optional minor navigation link names (may not exist)
        const optionalMinorLinkNames = [
            'Send Bug Report',
            'Combat Sim Shykai',
            'Combat sim shykai', // lowercase variant
            'Profit Calc Cowculator',
            'Profit calc Cowculator', // lowercase variant
            'Enhancement Sim',
            'Enhancement sim', // lowercase variant
            'Script Settings',
            'Script settings', // lowercase variant
            'Edible Tools',
            'Chest Statistics',
            'Profit Calc Milkonomy',
            'Profit calc Milkonomy', // lowercase variant
            'Combat Tracker Socko',
            'Combat tracker Socko', // lowercase variant
            'Profit Calc Mooneycalc',
            'Profit calc Mooneycalc' // lowercase variant
        ];

        // Combat-specific names (within the Combat Panel's NavigationBar_nav)
        const combatNames = [
            'Combat'
        ];

        // Combat sub-skill names (within NavigationBar_subSkills_)
        const subSkillNames = [
            'Stamina',
            'Intelligence',
            'Attack',
            'Defense',
            'Melee',
            'Ranged',
            'Magic'
        ];

        // Find the navigation links container
        const navLinksContainer = document.querySelector('div[class*="NavigationBar_navigationLinks_"]');

        if (!navLinksContainer) {
            return;
        }

        // Get all direct children that are navigation links
        const navigationLinkDivs = navLinksContainer.querySelectorAll('div[class*="NavigationBar_navigationLink_"]');

        navigationLinkDivs.forEach((navLinkDiv, index) => {
            // Get the full text content to check for Combat Panel
            const fullText = navLinkDiv.textContent.trim();
            // Special handling for Combat Panel - check if full text starts with "Combat" and has numbers
            if (fullText.startsWith('Combat') && /\d/.test(fullText)) {
                const config = elementConfigs.find(c => c.name === 'Combat Panel');
                if (config) {
                    config.inDOM = true;
                    config.element = navLinkDiv;
                    config.originalDisplay = "";
                }
            }

            // Check for main navigation links (direct text in first span)
            const firstSpan = navLinkDiv.querySelector('div[class*="NavigationBar_nav_"] > div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span');
            if (firstSpan) {
                const text = firstSpan.textContent.trim();

                // Check other main link names (excluding Combat Panel since we handled it above)
                mainLinkNames.forEach(linkName => {
                    if (linkName !== 'Combat Panel' && (text === linkName || text.startsWith(linkName))) {
                        const config = elementConfigs.find(c => c.name === linkName);
                        if (config) {
                            config.inDOM = true;
                            config.element = navLinkDiv;
                            config.originalDisplay = "";
                            // Extract level if available - it's a span inside textContainer
                            const navEl = navLinkDiv.querySelector('div[class*="NavigationBar_nav_"]');
                            let levelSpan = null;
                            if (navEl) {
                                // Level is a span inside textContainer
                                levelSpan = navEl.querySelector('div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span[class*="NavigationBar_level__"]');
                            }
                            if (levelSpan) {
                                config.level = levelSpan.textContent.trim();
                            }
                        }
                    }
                });
            }

            // Check for Combat nav element (the NavigationBar_nav_ that contains Combat text)
            const combatNav = navLinkDiv.querySelector('div[class*="NavigationBar_nav_"]');
            if (combatNav) {
                const combatSpan = combatNav.querySelector('div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span');
                if (combatSpan) {
                    const combatText = combatSpan.textContent.trim();

                    combatNames.forEach(combatName => {
                        if (combatText === combatName || combatText.startsWith(combatName)) {
                            const config = elementConfigs.find(c => c.name === combatName);
                            if (config) {
                                config.inDOM = true;
                                config.element = combatNav; // Store the NavigationBar_nav_ element
                                config.originalDisplay = "";
                                // Extract level if available - combatNav is already the NavigationBar_nav_ element
                                const levelSpan = combatNav.querySelector('div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span[class*="NavigationBar_level__"]');
                                if (levelSpan) {
                                    config.level = levelSpan.textContent.trim();
                                }
                            }
                        }
                    });
                }
            }

            // Check for sub-skills (within NavigationBar_subSkills_)
            const subSkillsContainer = navLinkDiv.querySelector('div[class*="NavigationBar_subSkills_"]');
            if (subSkillsContainer) {
                // Find all nav elements within the subSkills container
                const subSkillNavs = subSkillsContainer.querySelectorAll('div[class*="NavigationBar_nav_"]');

                subSkillNavs.forEach((subSkillNav, subIndex) => {
                    const subSpan = subSkillNav.querySelector('div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span');
                    if (subSpan) {
                        const subText = subSpan.textContent.trim();

                        // Check if this matches any sub-skill names
                        subSkillNames.forEach(skillName => {
                            if (subText === skillName || subText.startsWith(skillName)) {
                                const config = elementConfigs.find(c => c.name === skillName);
                                if (config) {
                                    config.inDOM = true;
                                    config.element = subSkillNav; // Store the nav element, not the parent
                                    config.originalDisplay = "";
                                    // Extract level if available - subSkillNav is already the NavigationBar_nav_ element
                                    const levelSpan = subSkillNav.querySelector('div[class*="NavigationBar_contentContainer_"] > div[class*="NavigationBar_textContainer_"] > span[class*="NavigationBar_level__"]');
                                    if (levelSpan) {
                                        config.level = levelSpan.textContent.trim();
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });

        // Special check for Milkyway.Market - standalone button with id="cst-view"
        const milkywayButton = document.querySelector('button#cst-view');
        if (milkywayButton) {
            const config = elementConfigs.find(c => c.name === 'Milkyway.Market');
            if (config) {
                config.inDOM = true;
                config.element = milkywayButton;
                config.originalDisplay = "";
            }
        }

        // Search for minor navigation links (NavigationBar_minorNavigationLink_)
        const minorNavLinks = document.querySelectorAll('div[class*="NavigationBar_minorNavigationLink_"]');

        minorNavLinks.forEach((minorLink, index) => {
            const text = minorLink.textContent.trim();
            // Check regular minor link names first
            minorLinkNames.forEach(linkName => {
                if (text === linkName || text.startsWith(linkName)) {
                    const config = elementConfigs.find(c => c.name === linkName);
                    if (config) {
                        config.inDOM = true;
                        config.element = minorLink;
                        config.originalDisplay = "";
                    }
                }
            });

            // Check optional minor link names
            optionalMinorLinkNames.forEach(linkName => {
                if (text.toLowerCase().includes(linkName.toLowerCase())) {
                    // Find the config with matching name (normalize the case)
                    const config = elementConfigs.find(c =>
                        c.isOptional &&
                        (c.name === linkName ||
                         c.name.toLowerCase() === linkName.toLowerCase() ||
                         text.toLowerCase().includes(c.name.toLowerCase()))
                    );
                    if (config) {
                        config.inDOM = true;
                        config.element = minorLink;
                        config.originalDisplay = "";
                    }
                }
            });
        });
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {};
        elementConfigs.forEach(config => {
            settings[config.name] = config.enabled;
        });
        localStorage.setItem(getStorageKey('mwi-element-toggle'), JSON.stringify(settings));
    }

    // Add toggle button for character management panel
    function addCharacterPanelToggle() {
        const charPanel = document.querySelector('div[class*="GamePage_characterManagementPanel_"]');

        // Check if button already exists
        let existingButton = document.getElementById('mwi-char-panel-toggle');

        // If panel doesn't exist, remove orphaned button
        if (!charPanel) {
            if (existingButton) {
                existingButton.remove();
            }
            return;
        }

        // If button exists and panel exists, verify button is properly positioned
        if (existingButton) {
            // Check if button is stuck or orphaned
            const isStuck = existingButton.style.right === '0px' && existingButton.innerHTML === '&gt;';
            if (isStuck || !document.body.contains(existingButton)) {
                existingButton.remove();
                existingButton = null;
            } else {
                return; // Button exists and is properly positioned
            }
        }

        charPanel.dataset.toggleAdded = 'true';

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'mwi-char-panel-toggle';
        toggleBtn.innerHTML = '&gt;';
        toggleBtn.style.cssText = `
            position: fixed;
            right: ${charPanel.offsetWidth}px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 60px;
            background: rgba(52, 73, 94, 0.9);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-right: none;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: 1;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;

        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.background = 'rgba(52, 73, 94, 1)';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.background = 'rgba(52, 73, 94, 0.9)';
        });

        // Add transition to character panel
        charPanel.style.transition = 'transform 0.3s ease';

        // Load saved state
        const savedState = localStorage.getItem(getStorageKey('mwi-char-panel-hidden'));
        let isHidden = savedState === 'true';

        // Apply initial state
        if (isHidden) {
            charPanel.style.transform = `translateX(${charPanel.offsetWidth}px)`;
            toggleBtn.innerHTML = '&lt;';
            toggleBtn.style.right = '0px';
        }

        // Toggle functionality
        toggleBtn.addEventListener('click', () => {
            isHidden = !isHidden;

            if (isHidden) {
                // Hide panel - move it to the right
                charPanel.style.transform = `translateX(${charPanel.offsetWidth}px)`;
                toggleBtn.innerHTML = '&lt;';
                toggleBtn.style.right = '0px';
            } else {
                // Show panel - restore position
                charPanel.style.transform = 'translateX(0)';
                toggleBtn.innerHTML = '&gt;';
                toggleBtn.style.right = `${charPanel.offsetWidth}px`;
            }

            // Save state
            localStorage.setItem(getStorageKey('mwi-char-panel-hidden'), isHidden.toString());
        });

        document.body.appendChild(toggleBtn);

        // Update button position when window resizes
        const updateButtonPosition = () => {
            if (!isHidden) {
                toggleBtn.style.right = `${charPanel.offsetWidth}px`;
            }
        };
        window.addEventListener('resize', updateButtonPosition);
    }

    // Make the game's navigation panel draggable
    function makeNavPanelDraggable() {
        const navPanels = document.querySelectorAll('div[class*="GamePage_navPanel_"]');

        navPanels.forEach(navPanel => {
            // Check if already made draggable AND still in DOM
            if (navPanel.dataset.draggableAdded && document.body.contains(navPanel)) {
                // Verify drag header still exists
                const dragHeader = navPanel.querySelector('[title="Drag to move panel"]');
                if (dragHeader) return; // Already properly set up
            }
            navPanel.dataset.draggableAdded = 'true';

            // Remove any fixed height to allow dynamic sizing
            navPanel.style.height = 'auto';
            navPanel.style.minHeight = 'auto';
            navPanel.style.maxHeight = 'none';

            // Also remove fixed height from NavigationBar_navigationBarContainer_
            const navBarContainer = navPanel.querySelector('div[class*="NavigationBar_navigationBarContainer_"]');
            if (navBarContainer) {
                navBarContainer.style.height = 'auto';
                navBarContainer.style.minHeight = 'auto';
                navBarContainer.style.maxHeight = 'none';
            }

            // Create drag header
            const dragHeader = document.createElement('div');
            dragHeader.style.cssText = `
                height: 10px;
                background: rgba(52, 73, 94, 0.8);
                cursor: grab;
                user-select: none;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
            `;
            dragHeader.title = 'Drag to move panel';

            // Make the nav panel positioned so the drag header can be absolute
            const currentPosition = window.getComputedStyle(navPanel).position;
            if (currentPosition === 'static') {
                navPanel.style.position = 'relative';
            }

            // Insert drag header at the beginning
            navPanel.insertBefore(dragHeader, navPanel.firstChild);

            // Add padding to top of nav panel to account for drag header
            const currentPaddingTop = window.getComputedStyle(navPanel).paddingTop;
            const paddingValue = parseInt(currentPaddingTop) || 0;
            navPanel.style.paddingTop = (paddingValue + 10) + 'px';

            // Load saved position (center on first load)
            const savedPos = loadPosition('mwi-navpanel-position', true);
            let xOffset = savedPos.x;
            let yOffset = savedPos.y;

            // Apply initial position
            if (xOffset !== 0 || yOffset !== 0) {
                navPanel.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }

            // If this was the initial centered position, save it
            if (savedPos.isInitial) {
                savePosition('mwi-navpanel-position', xOffset, yOffset);
            }

            // Dragging functionality
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            dragHeader.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === dragHeader) {
                    isDragging = true;
                    dragHeader.style.cursor = 'grabbing';
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    // Calculate new position
                    let newX = e.clientX - initialX;
                    let newY = e.clientY - initialY;

                    // Get current panel position
                    const rect = navPanel.getBoundingClientRect();

                    // Calculate where the header would be with the new offset
                    const headerLeft = rect.left - xOffset + newX;
                    const headerTop = rect.top - yOffset + newY;
                    const headerRight = headerLeft + rect.width;
                    const headerBottom = headerTop + 10; // Header height

                    // Constrain header to screen bounds
                    if (headerLeft < 0) newX -= headerLeft;
                    if (headerRight > window.innerWidth) newX -= (headerRight - window.innerWidth);
                    if (headerTop < 0) newY -= headerTop;
                    if (headerBottom > window.innerHeight) newY -= (headerBottom - window.innerHeight);

                    xOffset = newX;
                    yOffset = newY;

                    setTranslate(newX, newY, navPanel);
                }
            }

            function dragEnd(e) {
                if (isDragging) {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                    dragHeader.style.cursor = 'grab';

                    // Save position
                    savePosition('mwi-navpanel-position', xOffset, yOffset);
                }
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
        });
    }

    // Apply visibility based on current settings
    function applyVisibility() {
        elementConfigs.forEach(config => {
            if (config.selector) {
                // Handle elements with selectors (Navigation Panel, Minor Links)
                const elements = document.querySelectorAll(config.selector);
                elements.forEach(el => {
                    el.style.display = config.enabled ? '' : 'none';
                });
            } else if (config.element) {
                // Verify element is still in DOM before applying styles
                if (!document.body.contains(config.element)) {
                    // Element was removed from DOM, mark as not found
                    config.inDOM = false;
                    config.element = null;
                    return;
                }

                // Handle navigation links that have been found
                // When enabling, restore original display value; when disabling, set to none
                if (config.enabled) {
                    config.element.style.display = config.originalDisplay || '';
                } else {
                    config.element.style.display = 'none';
                }
            }
        });
    }

    // Create the control panel UI
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'mwi-toggle-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            min-width: 200px;
        `;

        // Add drag header with title and minimize button
        const dragHeader = document.createElement('div');
        dragHeader.style.cssText = `
            height: 20px;
            background: #7f8c8d;
            border-radius: 8px 8px 0 0;
            cursor: grab;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            color: white;
            font-weight: bold;
            font-size: 12px;
        `;
        dragHeader.title = 'Drag to move';

        const title = document.createElement('span');
        title.textContent = 'Hidey Way Idle 2.55';
        title.style.cssText = `
            flex: 1;
            pointer-events: none;
        `;

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = `
            width: 16px;
            height: 16px;
            padding: 0;
            margin-left: 4px;
            background: #5a6c7d;
            color: white;
            border: 1px solid #4a5c6d;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            line-height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;

        dragHeader.appendChild(title);
        dragHeader.appendChild(minimizeBtn);
        panel.appendChild(dragHeader);

        // Load saved position (stays in top-right by default)
        const savedPos = loadPosition('mwi-panel-position', false);
        let xOffset = savedPos.x;
        let yOffset = savedPos.y;

        // Apply saved position if it exists
        if (xOffset !== 0 || yOffset !== 0) {
            panel.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }

        // Add dragging functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // Don't start dragging if clicking the minimize button
            if (e.target === minimizeBtn) return;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === dragHeader || e.target === title) {
                isDragging = true;
                dragHeader.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                // Calculate new position
                let newX = e.clientX - initialX;
                let newY = e.clientY - initialY;

                // Get current panel position
                const rect = panel.getBoundingClientRect();

                // Calculate where the header would be with the new offset
                const headerLeft = rect.left - xOffset + newX;
                const headerTop = rect.top - yOffset + newY;
                const headerRight = headerLeft + rect.width;
                const headerBottom = headerTop + 20; // Header height

                // Constrain header to screen bounds
                if (headerLeft < 0) newX -= headerLeft;
                if (headerRight > window.innerWidth) newX -= (headerRight - window.innerWidth);
                if (headerTop < 0) newY -= headerTop;
                if (headerBottom > window.innerHeight) newY -= (headerBottom - window.innerHeight);

                xOffset = newX;
                yOffset = newY;

                setTranslate(newX, newY, panel);
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                dragHeader.style.cursor = 'grab';

                // Save position
                savePosition('mwi-panel-position', xOffset, yOffset);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }

        // Add content container with padding
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            padding: 15px;
        `;

        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
        `;

        // Add scanning status notice at the top
        const scanningNotice = document.createElement('div');
        scanningNotice.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            background: #f39c12;
            color: white;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            display: none;
        `;
        optionsContainer.appendChild(scanningNotice);

        // Add refresh button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 Refresh DOM Scan';
        refreshButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        refreshButton.title = 'Manually rescan the page for navigation elements';

        refreshButton.addEventListener('click', () => {
            // Visual feedback
            refreshButton.textContent = '🔄 Scanning...';
            refreshButton.disabled = true;
            refreshButton.style.background = '#95a5a6';

            // Perform the scan
            updateNavigationLinks();
            applyVisibility();
            refreshUI();
            makeNavPanelDraggable();
            addCharacterPanelToggle();

            // Reset button after a short delay
            setTimeout(() => {
                refreshButton.textContent = '🔄 Refresh DOM Scan';
                refreshButton.disabled = false;
                refreshButton.style.background = '#3498db';
            }, 500);
        });

        optionsContainer.appendChild(refreshButton);

        // Auto-scanning logic
        let scanInterval = null;
        let countdownInterval = null;
        let secondsUntilScan = 3;
        let extendedScanStartTime = null;
        const EXTENDED_SCAN_DURATION = 20000; // 20 seconds in milliseconds

        function checkIfAllRequiredFound() {
            // Only count required (non-optional) elements
            const requiredConfigs = elementConfigs.filter(c => !c.isOptional);
            const foundCount = requiredConfigs.filter(c => c.selector || c.inDOM).length;
            const totalCount = requiredConfigs.length;

            // Return true when 100% of required elements are found
            return foundCount === totalCount;
        }

        function checkIfAllFound() {
            // Check if ALL elements (including optional) are found
            const foundCount = elementConfigs.filter(c => c.selector || c.inDOM).length;
            const totalCount = elementConfigs.length;

            // Return true when 100% of all elements are found
            return foundCount === totalCount;
        }

        function performScan() {
            updateNavigationLinks();
            applyVisibility();
            refreshUI();
            makeNavPanelDraggable();
            // Note: addCharacterPanelToggle() removed from auto-scan - only called on manual refresh and DOM mutations

            // Check if we found all required elements
            if (checkIfAllRequiredFound()) {
                // Start extended scanning for optional elements if not already started
                if (extendedScanStartTime === null) {
                    extendedScanStartTime = Date.now();
                }

                // If ALL elements (including optional) are found, stop immediately
                if (checkIfAllFound()) {

                    stopAutoScanning();
                    return;
                }

                // Check if extended scan time has elapsed
                const elapsedTime = Date.now() - extendedScanStartTime;
                if (elapsedTime >= EXTENDED_SCAN_DURATION) {
                    stopAutoScanning();
                }
            }
        }

        function updateCountdown() {
            if (secondsUntilScan > 0) {
                // If in extended scan mode, show different message
                if (extendedScanStartTime !== null) {
                    const remainingTime = Math.ceil((EXTENDED_SCAN_DURATION - (Date.now() - extendedScanStartTime)) / 1000);
                    scanningNotice.textContent = `Scanning for optional elements... ${remainingTime}s`;
                } else {
                    scanningNotice.textContent = `Scanning in ${secondsUntilScan}...`;
                }
                secondsUntilScan--;
            } else {
                if (extendedScanStartTime !== null) {
                    const remainingTime = Math.ceil((EXTENDED_SCAN_DURATION - (Date.now() - extendedScanStartTime)) / 1000);
                    scanningNotice.textContent = `Scanning for optional elements... ${remainingTime}s`;
                } else {
                    scanningNotice.textContent = 'Scanning now...';
                }
                performScan();
                secondsUntilScan = 3; // Reset for next cycle
            }
        }

        function startAutoScanning() {
            scanningNotice.style.display = 'block';
            secondsUntilScan = 0; // Start with immediate scan
            updateCountdown();

            // Update countdown every second
            countdownInterval = setInterval(updateCountdown, 1000);
        }

        function stopAutoScanning() {
            if (scanInterval) clearInterval(scanInterval);
            if (countdownInterval) clearInterval(countdownInterval);
            scanningNotice.style.display = 'none';
        }

        // Start auto-scanning when panel is created
        startAutoScanning();

        elementConfigs.forEach((config, index) => {
            const option = document.createElement('div');
            const isAvailable = config.selector || config.inDOM; // Available if has selector OR is in DOM
            option.style.cssText = `
                margin: 8px 0;
                display: flex;
                align-items: center;
                opacity: ${isAvailable ? '1' : '0.5'};
            `;
            option.id = `mwi-option-${index}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `mwi-toggle-${index}`;
            checkbox.checked = config.enabled;
            checkbox.disabled = !isAvailable;
            checkbox.style.cssText = `
                margin-right: 8px;
                cursor: ${checkbox.disabled ? 'not-allowed' : 'pointer'};
            `;

            checkbox.addEventListener('change', () => {
                config.enabled = checkbox.checked;
                saveSettings();
                applyVisibility();
            });

            const label = document.createElement('label');
            label.htmlFor = `mwi-toggle-${index}`;
            // Add level info if available
            let displayName = config.name;
            if (config.level !== undefined && config.level !== null) {
                displayName = `${config.name} (${config.level})`;
            }
            label.textContent = displayName;
            label.style.cssText = `
                cursor: ${checkbox.disabled ? 'not-allowed' : 'pointer'};
                user-select: none;
                ${config.isOptional ? 'font-style: italic; color: #aaa;' : ''}
            `;

            // Add DOM status indicator for navigation links (not for selector-based elements)
            if (!config.selector) {
                const statusIndicator = document.createElement('span');
                statusIndicator.style.cssText = `
                    margin-left: 5px;
                    font-size: 10px;
                    color: ${config.inDOM ? '#2ecc71' : '#e74c3c'};
                `;
                statusIndicator.textContent = config.inDOM ? '●' : '○';
                statusIndicator.title = config.inDOM ? 'In DOM' : 'Not in DOM';
                label.appendChild(statusIndicator);
            }

            option.appendChild(checkbox);
            option.appendChild(label);
            optionsContainer.appendChild(option);
        });

        // Add reset button at the bottom
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset, Set Visible, Reload Page';
        resetButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-top: 15px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        resetButton.title = 'Clear all storage, set all options to visible, and reload page';

        resetButton.addEventListener('click', () => {
            // Clear all localStorage items related to this script
            localStorage.removeItem(getStorageKey('mwi-element-toggle'));
            localStorage.removeItem(getStorageKey('mwi-panel-position'));
            localStorage.removeItem(getStorageKey('mwi-panel-minimized'));
            localStorage.removeItem(getStorageKey('mwi-navpanel-position'));

            // Set all configs to enabled
            elementConfigs.forEach(config => {
                config.enabled = true;
            });

            // Save the reset state
            saveSettings();

            // Reload the page to apply changes
            location.reload();
        });

        optionsContainer.appendChild(resetButton);

        contentContainer.appendChild(optionsContainer);

        // Load saved minimize state
        const isMinimized = loadMinimizeState();
        if (isMinimized) {
            contentContainer.style.display = 'none';
            minimizeBtn.textContent = '+';
            panel.style.minWidth = 'auto';
            dragHeader.style.borderRadius = '8px'; // Fully rounded when minimized
        }

        // Minimize button functionality
        minimizeBtn.addEventListener('click', () => {
            const isMinimized = contentContainer.style.display === 'none';
            contentContainer.style.display = isMinimized ? 'block' : 'none';
            minimizeBtn.textContent = isMinimized ? '−' : '+';
            panel.style.minWidth = isMinimized ? '200px' : 'auto';
            // Update header border radius - fully rounded when minimized
            dragHeader.style.borderRadius = isMinimized ? '8px 8px 0 0' : '8px';
            // Save minimize state
            saveMinimizeState(!isMinimized);
        });

        panel.appendChild(contentContainer);
        document.body.appendChild(panel);
    }

    // Debounce helper
    let updateTimeout = null;
    function debounce(func, delay) {
        return function() {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(func, delay);
        };
    }

    // MutationObserver to handle dynamically loaded content
    function observeDOM() {
        const debouncedUpdate = debounce(() => {
            updateNavigationLinks(); // Re-scan for navigation links
            applyVisibility(); // Apply visibility settings
            refreshUI(); // Update UI indicators
            makeNavPanelDraggable(); // Make any new nav panels draggable
            addCharacterPanelToggle(); // Add toggle button for character panel
        }, 500); // Wait 500ms after last change before updating

        const observer = new MutationObserver((mutations) => {
            // Only react if navigation-related classes are involved
            const hasNavigationChange = mutations.some(mutation => {
                // Check for added/removed nodes
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
                    return nodes.some(node => {
                        if (node.nodeType === 1) { // Element node
                            const className = node.className || '';
                            // Check if className is a string or DOMTokenList
                            if (typeof className === 'string') {
                                return className.includes('NavigationBar_navigationLink_') ||
                                       className.includes('GamePage_navPanel_') ||
                                       className.includes('GamePage_characterManagementPanel_') ||
                                       className.includes('NavigationBar_navigationLinks_') ||
                                       className.includes('NavigationBar_navToggleButton_') ||
                                       className.includes('NavigationBar_minorNavigationLink_') ||
                                       className.includes('NavigationBar_level__');
                            } else if (className.constructor && className.constructor.name === 'DOMTokenList') {
                                // For DOMTokenList, convert to string
                                return className.toString().includes('NavigationBar_navigationLink_') ||
                                       className.toString().includes('GamePage_navPanel_') ||
                                       className.toString().includes('GamePage_characterManagementPanel_') ||
                                       className.toString().includes('NavigationBar_navigationLinks_') ||
                                       className.toString().includes('NavigationBar_navToggleButton_') ||
                                       className.toString().includes('NavigationBar_minorNavigationLink_') ||
                                       className.toString().includes('NavigationBar_level__');
                            }
                        }
                        return false;
                    });
                }

                // Check for character data changes (text content changes in level divs)
                if (mutation.type === 'characterData') {
                    // Check if the parent is a level div
                    const parent = mutation.target.parentElement;
                    if (parent && parent.className &&
                        (typeof parent.className === 'string' ?
                         parent.className.includes('NavigationBar_level__') :
                         parent.className.toString().includes('NavigationBar_level__'))) {
                        return true;
                    }
                }

                return false;
            });

            if (hasNavigationChange) {
                debouncedUpdate();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false, // Don't watch attribute changes
            characterData: true, // Watch text changes (for level updates)
            characterDataOldValue: false // Don't need old values
        });
    }

    // Refresh the UI to update DOM status indicators
    function refreshUI() {
        elementConfigs.forEach((config, index) => {
            const checkbox = document.getElementById(`mwi-toggle-${index}`);
            const option = document.getElementById(`mwi-option-${index}`);

            if (checkbox && option) {
                const isAvailable = config.selector || config.inDOM; // Available if has selector OR is in DOM
                checkbox.disabled = !isAvailable;
                checkbox.style.cursor = checkbox.disabled ? 'not-allowed' : 'pointer';
                option.style.opacity = isAvailable ? '1' : '0.5';

                // Update the label text with level info
                const label = option.querySelector('label');
                if (label) {
                    // Update the text content (skill name + level)
                    let displayName = config.name;
                    if (config.level !== undefined && config.level !== null) {
                        displayName = `${config.name} (${config.level})`;
                    }

                    // Update only the text node, not the entire label (to preserve the status indicator)
                    const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
                    if (textNode) {
                        textNode.textContent = displayName;
                    } else {
                        // If no text node exists, set the whole label text
                        label.childNodes[0].textContent = displayName;
                    }

                    // Update status indicator (only for non-selector elements)
                    if (!config.selector) {
                        const statusIndicator = label.querySelector('span');
                        if (statusIndicator) {
                            statusIndicator.style.color = config.inDOM ? '#2ecc71' : '#e74c3c';
                            statusIndicator.textContent = config.inDOM ? '●' : '○';
                            statusIndicator.title = config.inDOM ? 'In DOM' : 'Not in DOM';
                        }
                    }
                }
            }
        });
    }

    // Initialize the script
    function init() {
        const continueInit = () => {
            loadSettings();

            // Wait for the page to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    createControlPanel();
                    updateNavigationLinks(); // Find all navigation links first
                    applyVisibility(); // Then apply visibility settings
                    refreshUI(); // Refresh UI after initial visibility check
                    makeNavPanelDraggable(); // Make nav panel draggable
                    addCharacterPanelToggle(); // Add toggle button for character panel
                    observeDOM();
                });
            } else {
                // Document already loaded, start immediately
                createControlPanel();
                updateNavigationLinks(); // Find all navigation links first
                applyVisibility(); // Then apply visibility settings
                refreshUI(); // Refresh UI after initial visibility check
                makeNavPanelDraggable(); // Make nav panel draggable
                addCharacterPanelToggle(); // Add toggle button for character panel
                observeDOM();
            }
        };

        // Poll for player name before continuing
        pollForPlayerName(continueInit);
    }

    init();
})();