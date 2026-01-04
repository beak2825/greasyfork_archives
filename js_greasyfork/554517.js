// ==UserScript==
// @name         TEST V2 Torn Quick-Travel (Radial Menu)
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  Modular radial navigation with enhanced mobile support
// @author       Sensimillia (2168012)
// @match        https://www.torn.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @require      https://update.greasyfork.org/scripts/554536/1688185/Torn%20Radial%20Utils%20Library.js
// @require      https://update.greasyfork.org/scripts/554528/1688154/Torn%20Radial%20Themes%20Library.js
// @require      https://update.greasyfork.org/scripts/554527/1688152/Torn%20Radial%20Search%20Library.js
// @require      https://update.greasyfork.org/scripts/554519/1688118/Torn%20Radial%20MiniApps%20Library.js
// @require      https://update.greasyfork.org/scripts/554518/1688117/Torn%20Radial%20CSS%20Library.js
// @require      https://update.greasyfork.org/scripts/554529/1688155/Torn%20Radial%20UI%20Components%20Library.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554517/TEST%20V2%20Torn%20Quick-Travel%20%28Radial%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554517/TEST%20V2%20Torn%20Quick-Travel%20%28Radial%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== LIBRARY IMPORTS ====================
    const { ErrorLogger, Storage, API, adjustBrightness, showNotification } = window.TornRadialUtils;
    const { themes, sizeConfig, getTheme, getSizeConfig } = window.TornRadialThemes;
    const { SearchManager } = window.TornRadialSearch;
    const { Calculator, TimerManager, NotesManager, APIMonitor } = window.TornRadialMiniApps;
    const { CSSGenerator } = window.TornRadialCSS;
    const { UIComponents } = window.TornRadialUI;

    // ==================== DEFAULT DATA ====================
    const DEFAULT_LINKS = [
        { name: 'Home', url: '/index.php', icon: '🏠', color: '#4aa3df' },
        { name: 'Items', url: '/item.php', icon: '🎒', color: '#3ea34a' },
        { name: 'City', url: '/city.php', icon: '🏙️', color: '#66baff' },
        { name: 'Job', url: '/job.php', icon: '💼', color: '#3ea34a' },
        { name: 'Gym', url: '/gym.php', icon: '💪', color: '#a33a3a' },
        { name: 'Crimes', url: '/crimes.php', icon: '🔫', color: '#a33a3a' },
        { name: 'Missions', url: '/loader.php?sid=missions', icon: '🎯', color: '#4aa3df' },
        { name: 'Newspaper', url: '/newspaper.php', icon: '📰', color: '#9b9b9b' }
    ];

    const DEFAULT_LOADOUTS = {
        'default': { name: 'Default', links: [...DEFAULT_LINKS] },
        'trading': { 
            name: 'Trading', 
            links: [
                { name: 'Bazaar', url: '/bazaar.php', icon: '🏪', color: '#3ea34a' },
                { name: 'Item Market', url: '/imarket.php', icon: '💰', color: '#3ea34a' },
                { name: 'Points Market', url: '/pmarket.php', icon: '⭐', color: '#FFD700' },
                { name: 'Auctions', url: '/auctions.php', icon: '🔨', color: '#4aa3df' },
                { name: 'Trade', url: '/trade.php', icon: '🤝', color: '#4aa3df' },
                { name: 'Display Case', url: '/displaycase.php', icon: '🏆', color: '#66baff' },
                { name: 'Items', url: '/item.php', icon: '🎒', color: '#3ea34a' },
                { name: 'Properties', url: '/properties.php', icon: '🏘️', color: '#9b9b9b' }
            ]
        },
        'combat': {
            name: 'Combat',
            links: [
                { name: 'Gym', url: '/gym.php', icon: '💪', color: '#a33a3a' },
                { name: 'Crimes', url: '/crimes.php', icon: '🔫', color: '#a33a3a' },
                { name: 'Hospital', url: '/hospital.php', icon: '🏥', color: '#a33a3a' },
                { name: 'Faction', url: '/factions.php', icon: '⚔️', color: '#66baff' },
                { name: 'War', url: '/war.php', icon: '💣', color: '#a33a3a' },
                { name: 'Bounties', url: '/bounties.php', icon: '💀', color: '#9b9b9b' }
            ]
        }
    };

    // ==================== STATE MANAGEMENT ====================
    let settings = Storage.get('tornRadialSettings', {
        layout: 'circular',
        iconSize: 'medium',
        currentLoadout: 'default',
        theme: 'torn',
        notifications: { enabled: true },
        screenCalibration: null,
        apiKey: ''
    });

    if (settings.apiKey) API.setApiKey(settings.apiKey);

    let loadouts = Storage.get('tornRadialLoadouts', DEFAULT_LOADOUTS);
    let usageStats = Storage.get('tornRadialUsageStats', {});
    let timers = Storage.get('tornRadialTimers', []);

    if (!loadouts[settings.currentLoadout]) {
        settings.currentLoadout = 'default';
        if (!loadouts['default']) loadouts['default'] = DEFAULT_LOADOUTS['default'];
    }

    let links = loadouts[settings.currentLoadout]?.links || [...DEFAULT_LINKS];
    let isOpen = false;
    let isDragging = false;
    let isAnimating = false;
    let calibrationMode = false;
    let calibrationStep = 0;
    let selectedSearchIndex = 0;

    const isPDA = window.innerWidth < 768;
    const currentSize = getSizeConfig(settings.iconSize);
    const currentTheme = getTheme(settings.theme);

    // ==================== POSITION MANAGEMENT ====================
    function getSafeInitialPosition() {
        const padding = 100;
        return {
            x: Math.max(padding, Math.min(window.innerWidth / 2, window.innerWidth - padding)),
            y: Math.max(padding, Math.min(window.innerHeight / 2, window.innerHeight - padding))
        };
    }

    const savedPos = Storage.get('tornRadialPosition', getSafeInitialPosition());

    // ==================== CSS INJECTION ====================
    const cssGen = new CSSGenerator();
    cssGen.injectCSS({
        theme: currentTheme,
        size: currentSize,
        position: savedPos,
        isPDA: isPDA
    });

    // ==================== CREATE CONTAINER ====================
    const container = document.createElement('div');
    container.id = 'torn-radial-container';
    document.body.appendChild(container);

    const btn = document.createElement('div');
    btn.id = 'torn-radial-btn';
    btn.innerHTML = '⚡';
    btn.title = 'Quick Travel Menu';
    container.appendChild(btn);

    // ==================== POSITION CALCULATION ====================
    function calculatePosition(index, total, layout) {
        const radius = currentSize.radius;
        const spacing = currentSize.spacing;
        const maxPerRow = currentSize.maxPerRow;
        let x = 0, y = 0;

        switch(layout) {
            case 'horizontal': {
                const isLeftSide = savedPos.x < window.innerWidth / 2;
                const isTopHalf = savedPos.y < window.innerHeight / 2;
                const row = Math.floor(index / maxPerRow);
                const posInRow = index % maxPerRow;
                x = isLeftSide ? (posInRow + 1) * (currentSize.radial + spacing) : -(posInRow + 1) * (currentSize.radial + spacing);
                y = isTopHalf ? row * (currentSize.radial + spacing) * 0.8 : -row * (currentSize.radial + spacing) * 0.8;
                break;
            }
            case 'vertical': {
                const isTopHalf = savedPos.y < window.innerHeight / 2;
                const isLeftSide = savedPos.x < window.innerWidth / 2;
                const col = Math.floor(index / maxPerRow);
                const posInCol = index % maxPerRow;
                y = isTopHalf ? (posInCol + 1) * (currentSize.radial + spacing) : -(posInCol + 1) * (currentSize.radial + spacing);
                x = isLeftSide ? col * (currentSize.radial + spacing) * 0.8 : -col * (currentSize.radial + spacing) * 0.8;
                break;
            }
            default: {
                const maxPerRing = 12;
                const ring = Math.floor(index / maxPerRing);
                const posInRing = index % maxPerRing;
                const totalInRing = Math.min(maxPerRing, total - (ring * maxPerRing));
                const ringRadius = radius + (ring * (currentSize.radial + spacing));
                const angleStep = (2 * Math.PI) / totalInRing;
                const angle = angleStep * posInRing - Math.PI / 2;
                x = Math.cos(angle) * ringRadius;
                y = Math.sin(angle) * ringRadius;
                break;
            }
        }
        return { x, y };
    }

    // ==================== CHECK BOUNDS ====================
    function checkBounds(pos) {
        const menuX = savedPos.x;
        const menuY = savedPos.y;
        const buttonRadius = currentSize.radial / 2;
        const itemX = menuX + pos.x;
        const itemY = menuY + pos.y;
        
        let bounds;
        if (settings.screenCalibration) {
            bounds = {
                left: settings.screenCalibration.topLeft.x + buttonRadius,
                right: settings.screenCalibration.bottomRight.x - buttonRadius,
                top: settings.screenCalibration.topLeft.y + buttonRadius,
                bottom: settings.screenCalibration.bottomRight.y - buttonRadius
            };
        } else {
            bounds = {
                left: 10 + buttonRadius,
                right: window.innerWidth - 90 - buttonRadius,
                top: 25 + buttonRadius,
                bottom: window.innerHeight - 25 - buttonRadius
            };
        }
        
        let needsReposition = false;
        let newX = menuX;
        let newY = menuY;
        
        if (itemX < bounds.left) {
            newX = menuX + (bounds.left - itemX);
            needsReposition = true;
        } else if (itemX > bounds.right) {
            newX = menuX - (itemX - bounds.right);
            needsReposition = true;
        }
        
        if (itemY < bounds.top) {
            newY = menuY + (bounds.top - itemY);
            needsReposition = true;
        } else if (itemY > bounds.bottom) {
            newY = menuY - (itemY - bounds.bottom);
            needsReposition = true;
        }
        
        if (needsReposition) {
            savedPos.x = Math.round(newX);
            savedPos.y = Math.round(newY);
            container.style.left = savedPos.x + 'px';
            container.style.top = savedPos.y + 'px';
            Storage.set('tornRadialPosition', savedPos);
            showNotification('⚠️ Menu repositioned to stay within calibrated bounds');
            setTimeout(() => createRadialItems(), 100);
        }
    }

    // ==================== CREATE RADIAL ITEMS ====================
    function createRadialItems() {
        document.querySelectorAll('.radial-item').forEach(el => el.remove());
        
        const total = links.length + 4; // +4 for search, calc, apps, settings

        links.forEach((link, i) => {
            const pos = calculatePosition(i, total, settings.layout);
            const item = document.createElement('a');
            item.className = 'radial-item';
            item.href = link.url;
            item.innerHTML = link.icon;
            item.title = link.name;
            item.style.background = `linear-gradient(135deg, ${link.color} 0%, ${adjustBrightness(link.color, -20)} 100%)`;
            item.dataset.x = pos.x;
            item.dataset.y = pos.y;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                trackUsage(link.url);
                window.location.href = link.url;
            });
            container.appendChild(item);
            checkBounds(pos);
        });

        // Add special items (search, calculator, mini-apps, settings)
        const specialItems = [
            { icon: '🔍', title: 'Search', className: 'search', handler: openSearch },
            { icon: '🔢', title: 'Calculator', className: 'calculator', handler: openCalculator },
            { icon: '🛠️', title: 'Mini Apps', className: 'mini-apps', handler: openMiniApps },
            { icon: '⚙️', title: 'Settings', className: 'settings', handler: openSettings }
        ];

        specialItems.forEach((special, i) => {
            const pos = calculatePosition(links.length + i, total, settings.layout);
            const item = document.createElement('div');
            item.className = `radial-item ${special.className}`;
            item.innerHTML = special.icon;
            item.title = special.title;
            item.dataset.x = pos.x;
            item.dataset.y = pos.y;
            item.addEventListener('click', special.handler);
            container.appendChild(item);
            checkBounds(pos);
        });
    }

    createRadialItems();

    // ==================== MENU TOGGLE ====================
    function toggleMenu() {
        if (isDragging || isAnimating) return;
        isAnimating = true;
        isOpen = !isOpen;
        const items = document.querySelectorAll('.radial-item');

        if (isOpen) {
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.classList.add('open');
                    const x = parseFloat(item.dataset.x);
                    const y = parseFloat(item.dataset.y);
                    item.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                }, i * 35);
            });
            setTimeout(() => { isAnimating = false; }, items.length * 35 + 300);
        } else {
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.classList.remove('open');
                    item.style.transform = 'translate(0, 0) scale(0)';
                }, i * 20);
            });
            setTimeout(() => { isAnimating = false; }, items.length * 20 + 400);
        }
    }

    // ==================== DRAG FUNCTIONALITY ====================
    let startX, startY, initialX, initialY, xOffset = 0, yOffset = 0, hasMoved = false;

    function dragStart(e) {
        if (e.target !== btn) return;
        hasMoved = false;
        isDragging = false;
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        startX = initialX = clientX;
        startY = initialY = clientY;
        xOffset = parseInt(container.style.left) || savedPos.x;
        yOffset = parseInt(container.style.top) || savedPos.y;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function drag(e) {
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 5 && !isDragging) {
            isDragging = true;
            hasMoved = true;
            btn.classList.add('dragging');
        }

        if (isDragging) {
            container.style.left = (xOffset + clientX - initialX) + 'px';
            container.style.top = (yOffset + clientY - initialY) + 'px';
        }
    }

    function dragEnd() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
        
        if (isDragging && hasMoved) {
            savedPos.x = Math.round(parseInt(container.style.left));
            savedPos.y = Math.round(parseInt(container.style.top));
            Storage.set('tornRadialPosition', savedPos);
            createRadialItems();
            if (isOpen) {
                isOpen = false;
                setTimeout(() => toggleMenu(), 100);
            }
        }
        
        btn.classList.remove('dragging');
        setTimeout(() => {
            isDragging = false;
            hasMoved = false;
        }, 50);
    }

    btn.addEventListener('mousedown', dragStart);
    btn.addEventListener('touchstart', dragStart, { passive: false });
    btn.addEventListener('click', (e) => {
        if (!hasMoved && !isDragging) toggleMenu(e);
    });

    // ==================== USAGE TRACKING ====================
    function trackUsage(url) {
        if (!usageStats[url]) usageStats[url] = 0;
        usageStats[url]++;
        Storage.set('tornRadialUsageStats', usageStats);
    }

    // ==================== UI OVERLAYS ====================
    const searchOverlay = UIComponents.createSearchOverlay();
    const calculatorOverlay = UIComponents.createCalculatorOverlay();
    const miniAppsOverlay = UIComponents.createMiniAppsOverlay();
    const calibrationOverlay = UIComponents.createCalibrationOverlay();
    const settingsModal = UIComponents.createSettingsModal(isPDA);
    const errorLogModal = UIComponents.createErrorLogModal();

    document.body.appendChild(searchOverlay);
    document.body.appendChild(calculatorOverlay);
    document.body.appendChild(miniAppsOverlay);
    document.body.appendChild(calibrationOverlay);
    document.body.appendChild(settingsModal);
    document.body.appendChild(errorLogModal);

    // ==================== SEARCH FUNCTIONS ====================
    function openSearch() {
        if (isOpen) toggleMenu();
        searchOverlay.classList.add('show');
        document.getElementById('torn-search-input').focus();
    }

    document.getElementById('search-close').addEventListener('click', () => {
        searchOverlay.classList.remove('show');
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) searchOverlay.classList.remove('show');
    });

    document.getElementById('torn-search-input').addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        const resultsDiv = document.getElementById('torn-search-results');
        
        if (!query) {
            resultsDiv.innerHTML = '';
            return;
        }

        const results = await SearchManager.search(query);
        let html = '';
        
        Object.keys(results).forEach(category => {
            if (results[category].length > 0) {
                html += `<div style="margin: 12px 0;"><div style="font-size: 12px; font-weight: 600; opacity: 0.7; margin-bottom: 8px; text-transform: uppercase;">${category}</div>`;
                results[category].forEach(r => {
                    html += UIComponents.createSearchResultItem(r);
                });
                html += '</div>';
            }
        });

        resultsDiv.innerHTML = html || '<div style="text-align: center; padding: 40px; opacity: 0.5;">No results found</div>';
        
        resultsDiv.querySelectorAll('[data-url]').forEach(item => {
            item.addEventListener('click', () => {
                SearchManager.addToHistory(query, item.dataset.url, item.dataset.type);
                window.location.href = item.dataset.url;
            });
        });
    });

    // ==================== CALCULATOR FUNCTIONS ====================
    const calc = new Calculator();

    function openCalculator() {
        if (isOpen) toggleMenu();
        calculatorOverlay.classList.add('show');
        calc.reset();
        document.getElementById('calc-display').textContent = '0';
    }

    document.getElementById('calculator-close').addEventListener('click', () => {
        calculatorOverlay.classList.remove('show');
    });

    calculatorOverlay.addEventListener('click', (e) => {
        if (e.target === calculatorOverlay) calculatorOverlay.classList.remove('show');
    });

    calculatorOverlay.querySelectorAll('[data-value]').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = calc.handleInput(btn.dataset.value);
            document.getElementById('calc-display').textContent = result;
        });
    });

    // ==================== MINI APPS FUNCTIONS ====================
    const timerMgr = new TimerManager();
    const notesMgr = new NotesManager();
    const apiMonitor = new APIMonitor(API);

    function openMiniApps() {
        if (isOpen) toggleMenu();
        miniAppsOverlay.classList.add('show');
        renderTimers();
        document.getElementById('quick-notes').value = notesMgr.getNotes();
        if (settings.apiKey) updateAPIMonitor();
    }

    document.getElementById('mini-apps-close').addEventListener('click', () => {
        miniAppsOverlay.classList.remove('show');
    });

    miniAppsOverlay.addEventListener('click', (e) => {
        if (e.target === miniAppsOverlay) miniAppsOverlay.classList.remove('show');
    });

    function renderTimers() {
        const timersList = document.getElementById('timers-list');
        const timers = timerMgr.getTimers();
        
        if (timers.length === 0) {
            timersList.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.5;">No active timers</div>';
            return;
        }

        timersList.innerHTML = timers.map((timer, i) => {
            const remaining = timerMgr.getTimeRemaining(timer);
            return UIComponents.createTimerItem(timer, i, remaining);
        }).join('');
    }

    window.tornRadialRemoveTimer = function(index) {
        timerMgr.removeTimer(index);
        renderTimers();
    };

    document.getElementById('add-timer-btn').addEventListener('click', () => {
        const name = document.getElementById('timer-name').value.trim();
        const minutes = parseInt(document.getElementById('timer-minutes').value);
        
        if (!name || !minutes || minutes <= 0) {
            showNotification('⚠️ Please enter timer name and duration');
            return;
        }

        timerMgr.addTimer(name, minutes);
        document.getElementById('timer-name').value = '';
        document.getElementById('timer-minutes').value = '';
        renderTimers();
        showNotification(`✅ Timer "${name}" added for ${minutes} minutes`);
    });

    document.getElementById('save-notes-btn').addEventListener('click', () => {
        const notes = document.getElementById('quick-notes').value;
        notesMgr.saveNotes(notes);
        showNotification('✅ Notes saved!');
    });

    async function updateAPIMonitor() {
        if (!settings.apiKey) return;
        
        try {
            const data = await apiMonitor.fetchBars();
            document.getElementById('api-bars').style.display = 'grid';
            document.getElementById('refresh-api-btn').style.display = 'block';
            document.getElementById('api-status').style.display = 'none';
            
            ['energy', 'nerve', 'happy', 'life'].forEach(bar => {
                document.getElementById(`${bar}-value`).textContent = `${data[bar].current}/${data[bar].max}`;
                document.getElementById(`${bar}-progress`).style.width = data[bar].percent + '%';
            });
        } catch(e) {
            ErrorLogger.log('error', 'Failed to fetch API data', e);
        }
    }

    document.getElementById('refresh-api-btn').addEventListener('click', () => {
        updateAPIMonitor();
        showNotification('🔄 API data refreshed');
    });

    // ==================== CALIBRATION ====================
    function startCalibration() {
        calibrationMode = true;
        calibrationStep = 0;
        calibrationOverlay.classList.add('show');
        document.querySelector('.calibration-instruction').textContent = 'Click the TOP-LEFT corner of your safe area';
    }

    calibrationOverlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('calibration-cancel') || e.target.id === 'calibration-cancel-btn') {
            calibrationMode = false;
            calibrationOverlay.classList.remove('show');
            document.querySelectorAll('.calibration-point').forEach(p => p.remove());
            return;
        }

        if (calibrationMode) {
            if (calibrationStep === 0) {
                const point = document.createElement('div');
                point.className = 'calibration-point';
                point.style.left = e.clientX + 'px';
                point.style.top = e.clientY + 'px';
                calibrationOverlay.appendChild(point);
                settings.screenCalibration = { topLeft: { x: e.clientX, y: e.clientY } };
                calibrationStep = 1;
                document.querySelector('.calibration-instruction').textContent = 'Click the BOTTOM-RIGHT corner of your safe area';
            } else {
                const point = document.createElement('div');
                point.className = 'calibration-point';
                point.style.left = e.clientX + 'px';
                point.style.top = e.clientY + 'px';
                calibrationOverlay.appendChild(point);
                settings.screenCalibration.bottomRight = { x: e.clientX, y: e.clientY };
                Storage.set('tornRadialSettings', settings);
                calibrationMode = false;
                showNotification('✅ Screen calibration complete!');
                setTimeout(() => {
                    calibrationOverlay.classList.remove('show');
                    document.querySelectorAll('.calibration-point').forEach(p => p.remove());
                    createRadialItems();
                }, 1000);
            }
        }
    });

    // ==================== SETTINGS MODAL ====================
    function openSettings() {
        if (isOpen) toggleMenu();
        document.getElementById('theme-select').value = settings.theme;
        document.getElementById('layout-select').value = settings.layout;
        document.getElementById('size-select').value = settings.iconSize;
        document.getElementById('notif-enabled').checked = settings.notifications.enabled;
        document.getElementById('api-key-input').value = settings.apiKey || '';
        renderLoadoutTabs();
        renderLinksContainer();
        settingsModal.style.display = 'flex';
    }

    function renderLoadoutTabs() {
        const tabsContainer = document.getElementById('loadout-tabs');
        tabsContainer.innerHTML = '';
        Object.keys(loadouts).forEach(key => {
            const tab = document.createElement('button');
            tab.className = 'loadout-tab';
            tab.textContent = loadouts[key].name;
            if (key === settings.currentLoadout) tab.classList.add('active');
            tab.addEventListener('click', () => switchLoadout(key));
            tabsContainer.appendChild(tab);
        });
    }

    function switchLoadout(key) {
        settings.currentLoadout = key;
        links = loadouts[key].links;
        renderLoadoutTabs();
        renderLinksContainer();
    }

    function renderLinksContainer() {
        const container = document.getElementById('links-container');
        container.innerHTML = links.map((link, i) => 
            UIComponents.createLinkItem(link, i, links.length, isPDA)
        ).join('');
        
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (confirm(`Remove "${links[index].name}"?`)) {
                    links.splice(index, 1);
                    saveCurrentLoadout();
                    renderLinksContainer();
                }
            });
        });
        
        container.querySelectorAll('.reorder-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    const index = parseInt(btn.dataset.index);
                    const direction = btn.dataset.direction;
                    const toIndex = direction === 'up' ? index - 1 : index + 1;
                    [links[index], links[toIndex]] = [links[toIndex], links[index]];
                    saveCurrentLoadout();
                    renderLinksContainer();
                }
            });
        });
    }

    function saveCurrentLoadout() {
        document.querySelectorAll('.link-item input').forEach(input => {
            const index = parseInt(input.dataset.index);
            const field = input.dataset.field;
            if (links[index] && field) links[index][field] = input.value;
        });
        loadouts[settings.currentLoadout].links = links;
        Storage.set('tornRadialLoadouts', loadouts);
    }

    function closeSettings() {
        settings.theme = document.getElementById('theme-select').value;
        settings.layout = document.getElementById('layout-select').value;
        settings.iconSize = document.getElementById('size-select').value;
        settings.notifications.enabled = document.getElementById('notif-enabled').checked;
        settings.apiKey = document.getElementById('api-key-input').value.trim();
        if (settings.apiKey) API.setApiKey(settings.apiKey);
        Storage.set('tornRadialSettings', settings);
        saveCurrentLoadout();
        settingsModal.style.display = 'none';
        location.reload(); // Reload to apply theme/size changes
    }

    document.getElementById('modal-close-btn').addEventListener('click', closeSettings);
    document.getElementById('save-btn').addEventListener('click', closeSettings);
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });

    // Settings button handlers
    document.getElementById('add-link-btn').addEventListener('click', () => {
        links.push({ name: 'New Link', url: '/index.php', icon: '🔗', color: '#4aa3df' });
        saveCurrentLoadout();
        renderLinksContainer();
    });

    document.getElementById('add-current-page-btn').addEventListener('click', () => {
        const currentUrl = window.location.pathname + window.location.search;
        const pageName = prompt('Enter a name for this page:', document.title.split(' - ')[0] || 'Current Page');
        if (pageName && pageName.trim()) {
            links.push({
                name: pageName.trim(),
                url: currentUrl,
                icon: '📄',
                color: currentTheme.primaryColor
            });
            saveCurrentLoadout();
            renderLinksContainer();
            showNotification(`✅ Added "${pageName}" to current loadout`);
        }
    });

    document.getElementById('restore-btn').addEventListener('click', () => {
        if (confirm('Restore default links for this loadout?')) {
            links = JSON.parse(JSON.stringify(DEFAULT_LINKS));
            saveCurrentLoadout();
            renderLinksContainer();
            showNotification('✅ Loadout restored to defaults');
        }
    });

    document.getElementById('export-btn').addEventListener('click', () => {
        const data = {
            loadouts: loadouts,
            settings: settings,
            usageStats: usageStats,
            version: '2.2.0',
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `torn-radial-loadouts-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('✅ Loadouts exported');
    });

    document.getElementById('import-btn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (confirm('Import loadouts? This will merge with your existing loadouts.')) {
                            if (data.loadouts) {
                                Object.assign(loadouts, data.loadouts);
                                Storage.set('tornRadialLoadouts', loadouts);
                            }
                            if (data.usageStats) {
                                Object.assign(usageStats, data.usageStats);
                                Storage.set('tornRadialUsageStats', usageStats);
                            }
                            showNotification('✅ Loadouts imported successfully!');
                            renderLoadoutTabs();
                            renderLinksContainer();
                        }
                    } catch(err) {
                        ErrorLogger.log('error', 'Import failed', err);
                        showNotification('❌ Import failed - invalid file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    });

    document.getElementById('calibrate-btn').addEventListener('click', () => {
        settingsModal.style.display = 'none';
        setTimeout(startCalibration, 300);
    });

    document.getElementById('new-loadout-btn').addEventListener('click', () => {
        const name = prompt('Enter loadout name:');
        if (name && name.trim()) {
            const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            if (loadouts[key]) {
                showNotification('⚠️ A loadout with this name already exists!');
                return;
            }
            loadouts[key] = { name: name.trim(), links: [...DEFAULT_LINKS] };
            Storage.set('tornRadialLoadouts', loadouts);
            switchLoadout(key);
            showNotification(`✅ Loadout "${name}" created`);
        }
    });

    document.getElementById('rename-loadout-btn').addEventListener('click', () => {
        if (settings.currentLoadout === 'default') {
            showNotification('⚠️ Cannot rename the default loadout!');
            return;
        }
        const newName = prompt('Enter new name:', loadouts[settings.currentLoadout].name);
        if (newName && newName.trim()) {
            loadouts[settings.currentLoadout].name = newName.trim();
            Storage.set('tornRadialLoadouts', loadouts);
            renderLoadoutTabs();
            showNotification(`✅ Loadout renamed to "${newName}"`);
        }
    });

    document.getElementById('delete-loadout-btn').addEventListener('click', () => {
        if (settings.currentLoadout === 'default') {
            showNotification('⚠️ Cannot delete the default loadout!');
            return;
        }
        if (confirm(`Delete "${loadouts[settings.currentLoadout].name}" loadout?`)) {
            const deletedName = loadouts[settings.currentLoadout].name;
            delete loadouts[settings.currentLoadout];
            Storage.set('tornRadialLoadouts', loadouts);
            switchLoadout('default');
            showNotification(`✅ Loadout "${deletedName}" deleted`);
        }
    });

    // ==================== ERROR LOG MODAL ====================
    document.getElementById('show-error-log').addEventListener('click', () => {
        const logBody = document.getElementById('error-log-body');
        const logs = ErrorLogger.getLogs();
        
        if (logs.length === 0) {
            logBody.innerHTML = '<div style="text-align: center; padding: 40px; opacity: 0.5;">No errors logged</div>';
        } else {
            logBody.innerHTML = logs.reverse().map(log => `
                <div class="torn-radial-section" style="margin-bottom: 12px; border-left: 4px solid ${log.type === 'error' ? '#FF3B30' : log.type === 'warning' ? '#FF9500' : '#007AFF'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold;">
                        <span style="text-transform: uppercase;">${log.type}</span>
                        <span style="opacity: 0.7; font-size: 10px;">${new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div style="margin-bottom: 8px;">${log.message}</div>
                    ${log.error ? `<div style="font-size: 10px; opacity: 0.6; white-space: pre-wrap; word-break: break-all;">${log.error.message}\n${log.error.stack || ''}</div>` : ''}
                </div>
            `).join('');
        }
        
        errorLogModal.style.display = 'flex';
    });

    document.getElementById('error-log-close').addEventListener('click', () => {
        errorLogModal.style.display = 'none';
    });

    document.getElementById('close-log-btn').addEventListener('click', () => {
        errorLogModal.style.display = 'none';
    });

    document.getElementById('export-log-btn').addEventListener('click', () => {
        ErrorLogger.exportLogs();
    });

    document.getElementById('clear-log-btn').addEventListener('click', () => {
        if (confirm('Clear all error logs?')) {
            ErrorLogger.clear();
            document.getElementById('show-error-log').click(); // Refresh display
            showNotification('✅ Error logs cleared');
        }
    });

    errorLogModal.addEventListener('click', (e) => {
        if (e.target === errorLogModal) errorLogModal.style.display = 'none';
    });

    // ==================== TIMER UPDATE LOOP ====================
    setInterval(() => {
        const completed = timerMgr.updateTimers();
        if (miniAppsOverlay.classList.contains('show')) {
            renderTimers();
        }
        completed.forEach(timer => {
            if (settings.notifications.enabled) {
                showNotification(`⏰ Timer Complete: ${timer.name}`);
                if (typeof GM_notification !== 'undefined') {
                    GM_notification({
                        title: 'Torn Radial Timer',
                        text: `Timer "${timer.name}" has finished!`,
                        timeout: 5000
                    });
                }
            }
        });
    }, 1000);

    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', (e) => {
        // Calibration cancel
        if (e.key === 'Escape' && calibrationMode) {
            calibrationMode = false;
            calibrationOverlay.classList.remove('show');
            document.querySelectorAll('.calibration-point').forEach(p => p.remove());
        }
        
        // Settings shortcut
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            openSettings();
        }

        // Calculator keyboard support
        if (calculatorOverlay.classList.contains('show')) {
            const key = e.key;
            if (/[0-9.]/.test(key) || ['+', '-', '*', '/', '%'].includes(key)) {
                e.preventDefault();
                const result = calc.handleInput(key === '*' ? '*' : key);
                document.getElementById('calc-display').textContent = result;
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                const result = calc.handleInput('=');
                document.getElementById('calc-display').textContent = result;
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                e.preventDefault();
                const result = calc.handleInput('C');
                document.getElementById('calc-display').textContent = result;
            } else if (key === 'Backspace') {
                e.preventDefault();
                let current = calc.getCurrentValue();
                current = current.slice(0, -1) || '0';
                calc.currentValue = current;
                document.getElementById('calc-display').textContent = current;
            }
        }
    });

    // ==================== MENU COMMANDS ====================
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ Open Settings', openSettings);
        GM_registerMenuCommand('🔍 Open Search', openSearch);
        GM_registerMenuCommand('🔢 Open Calculator', openCalculator);
        GM_registerMenuCommand('🛠️ Open Mini Apps', openMiniApps);
        GM_registerMenuCommand('📐 Calibrate Screen', startCalibration);
        GM_registerMenuCommand('📄 Add Current Page', () => {
            document.getElementById('add-current-page-btn').click();
        });
        GM_registerMenuCommand('📤 Export All Data', () => {
            Storage.exportAll();
        });
        GM_registerMenuCommand('🎯 Reset Position', () => {
            const safePos = getSafeInitialPosition();
            savedPos.x = safePos.x;
            savedPos.y = safePos.y;
            container.style.left = safePos.x + 'px';
            container.style.top = safePos.y + 'px';
            Storage.set('tornRadialPosition', savedPos);
            createRadialItems();
            showNotification('✅ Menu position reset to center');
        });
        GM_registerMenuCommand('🐞 View Error Log', () => {
            document.getElementById('show-error-log').click();
        });
    }

    // ==================== CONSOLE API ====================
    window.tornRadialSettings = openSettings;
    window.tornRadialSearch = openSearch;
    window.tornRadialCalculator = openCalculator;
    window.tornRadialMiniApps = openMiniApps;
    window.tornRadialCalibrate = startCalibration;
    window.tornRadialExport = () => Storage.exportAll();

    // ==================== STARTUP LOG ====================
    console.log('%c🎯 Torn Quick-Travel v2.2.0 - Modular Edition', 'font-size: 16px; font-weight: bold; color: #4aa3df;');
    console.log('%c✨ NEW in v2.2:', 'font-size: 14px; font-weight: bold; color: #3ea34a;');
    console.log('%c  📦 Modular Architecture - Separate libraries for easy updates', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  📱 PDA Optimized - Perfect scaling for mobile devices', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  🎨 6 Themes - Torn, Light, Dark, Cyberpunk, Ocean, Sunset', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  ⚡ Better Performance - Cached libraries load faster', 'font-size: 12px; color: #4aa3df;');
    console.log('%c⚙️ Keyboard: Ctrl/Cmd + Shift + R', 'font-size: 12px; color: #3ea34a;');
    console.log('%c🎯 Console API:', 'font-size: 12px; color: #FF9500;');
    console.log('%c  tornRadialSettings() - Open settings', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialSearch() - Open search', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialCalculator() - Open calculator', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialMiniApps() - Open mini apps', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialCalibrate() - Start calibration', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialExport() - Export all data', 'font-size: 11px; color: #9b9b9b;');

})();