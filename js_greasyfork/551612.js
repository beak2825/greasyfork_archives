// ==UserScript==
// @name         Lunar Finder - Enhanced Duel Finder
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Find duels against banned cheaters with enhanced features
// @author       Neo
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551612/Lunar%20Finder%20-%20Enhanced%20Duel%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/551612/Lunar%20Finder%20-%20Enhanced%20Duel%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isMenuOpen = false;
    let menu = null;
    let myUserId = null;
    let storedMatches = [];
    let currentResults = [];
    let logs = [];
    let bannedPlayers = [];
    let lastScanResults = [];

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');

        #lunar-finder-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            height: 600px;
            background: rgba(15, 15, 15, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 20, 147, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex;
            font-family: 'Geist', sans-serif;
            z-index: 10000;
            overflow: hidden;
        }

        #lunar-finder-sidebar {
            width: 240px;
            background: rgba(20, 20, 20, 0.8);
            border-right: 1px solid rgba(255, 20, 147, 0.1);
            padding: 24px 0;
            display: flex;
            flex-direction: column;
        }

        #lunar-finder-brand {
            padding: 0 24px 32px;
            margin-bottom: 24px;
        }

        #lunar-finder-brand h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }

        #lunar-finder-brand .accent {
            color: #ff1493;
        }

        #lunar-finder-nav {
            flex: 1;
            padding: 0 16px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            margin: 4px 0;
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            cursor: pointer;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
        }

        .nav-item:hover {
            background: rgba(255, 20, 147, 0.1);
            color: #ffffff;
        }

        .nav-item.active {
            background: rgba(255, 20, 147, 0.15);
            color: #ff1493;
            box-shadow: 0 0 0 1px rgba(255, 20, 147, 0.3);
        }

        .nav-item svg {
            width: 18px;
            height: 18px;
            margin-right: 12px;
            fill: currentColor;
        }

        #lunar-finder-sidebar .nav-item[data-tab="logs"] {
            margin-right: 0;
            margin-left: 0;
        }

        #lunar-finder-sidebar .nav-item[data-tab="logs"] svg {
            margin-right: 0;
            margin-left: 0;
        }

        #lunar-finder-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
        }

        .content-tab {
            display: none;
            height: 100%;
        }

        .content-tab.active {
            display: block;
        }

        .tab-title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 24px 0;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .refresh-button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .refresh-button:hover {
            background: rgba(255, 20, 147, 0.2);
            border-color: rgba(255, 20, 147, 0.4);
        }

        .refresh-button svg {
            width: 16px;
            height: 16px;
            fill: rgba(255, 255, 255, 0.7);
        }

        .refresh-button:hover svg {
            fill: #ff1493;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-label {
            display: block;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .input-field {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #ffffff;
            font-family: 'Geist', sans-serif;
            font-size: 14px;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }

        .input-field:focus {
            border-color: #ff1493;
            box-shadow: 0 0 0 3px rgba(255, 20, 147, 0.1);
        }

        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .button {
            background: #ff1493;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Geist', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 12px;
            margin-bottom: 12px;
        }

        .button:hover {
            background: rgba(255, 20, 147, 0.8);
            transform: translateY(-1px);
        }

        .button:disabled {
            background: rgba(255, 255, 255, 0.2);
            cursor: not-allowed;
            transform: none;
        }

        .button.secondary {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .button.secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .stats-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }

        .stat-number {
            color: #ff1493;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
        }

        .stat-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .progress-container {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            display: none;
        }

        .progress-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            margin-bottom: 8px;
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #ff1493;
            width: 0%;
            transition: width 0.3s ease;
        }

        .results-container {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
        }

        .result-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s ease;
        }

        .result-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 20, 147, 0.3);
        }

        .result-date {
            color: #ff1493;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .result-username {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .result-link {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            text-decoration: none;
            word-break: break-all;
        }

        .result-link:hover {
            color: #ff1493;
        }

        .file-upload {
            border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 20px;
        }

        .file-upload:hover {
            border-color: #ff1493;
            background: rgba(255, 20, 147, 0.05);
        }

        .file-upload.dragover {
            border-color: #ff1493;
            background: rgba(255, 20, 147, 0.1);
        }

        .file-upload-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-bottom: 8px;
        }

        .file-upload-hint {
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
        }

        .uuid-display {
            background: rgba(255, 20, 147, 0.1);
            border: 1px solid rgba(255, 20, 147, 0.3);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
        }

        .uuid-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .uuid-value {
            color: #ff1493;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Geist Mono', monospace;
            word-break: break-all;
        }

        #lunar-finder-content::-webkit-scrollbar {
            width: 10px;
        }

        #lunar-finder-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 5px;
        }

        #lunar-finder-content::-webkit-scrollbar-thumb {
            background: rgba(255, 20, 147, 0.4);
            border-radius: 5px;
            border: 1px solid rgba(255, 20, 147, 0.2);
        }

        #lunar-finder-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 20, 147, 0.6);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    function createSVGIcon(type) {
        const icons = {
            home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
            search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
            users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m23 21-2-2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
            settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
            refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
            logs: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>',
            discord: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
        };
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[type] || icons.home}</svg>`;
    }

    function createMenu() {
        if (menu) {
            menu.remove();
        }

        menu = document.createElement('div');
        menu.id = 'lunar-finder-menu';
        menu.style.display = 'none';

        const sidebar = document.createElement('div');
        sidebar.id = 'lunar-finder-sidebar';

        const brand = document.createElement('div');
        brand.id = 'lunar-finder-brand';
        brand.innerHTML = '<h1>Lunar <span class="accent">Finder</span></h1>';

        const nav = document.createElement('div');
        nav.id = 'lunar-finder-nav';

        const navItems = [
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'single', label: 'Single Search', icon: 'search' },
            { id: 'multi', label: 'Multi Search', icon: 'users' }
        ];

        const bottomNavItems = [
            { id: 'logs', label: 'Logs', icon: 'logs' },
            { id: 'discord', label: 'Discord', icon: 'discord', isExternal: true, url: 'https://discord.gg/TmxEA7RTuQ' }
        ];

        navItems.forEach(item => {
            const navItem = document.createElement('button');
            navItem.className = 'nav-item';
            navItem.setAttribute('data-tab', item.id);
            navItem.innerHTML = createSVGIcon(item.icon) + item.label;

            navItem.addEventListener('click', () => switchTab(item.id));
            nav.appendChild(navItem);
        });


        const bottomNav = document.createElement('div');
        bottomNav.style.display = 'flex';
        bottomNav.style.justifyContent = 'space-between';
        bottomNav.style.gap = '12px';
        bottomNav.style.marginTop = 'auto';
        bottomNav.style.paddingTop = '24px';
        bottomNav.style.paddingLeft = '20px';
        bottomNav.style.paddingRight = '20px';
        bottomNav.style.paddingBottom = '8px';


        bottomNavItems.forEach(item => {
            const navItem = document.createElement('button');
            navItem.className = 'nav-item';
            navItem.setAttribute('data-tab', item.id);
            navItem.style.justifyContent = 'center';
            navItem.style.alignItems = 'center';
            navItem.style.display = 'flex';
            navItem.style.padding = '0';
            navItem.style.width = '56px';
            navItem.style.height = '56px';
            navItem.style.borderRadius = '12px';
            navItem.style.margin = '0';
            navItem.style.border = 'none';
            navItem.style.background = 'transparent';
            navItem.innerHTML = createSVGIcon(item.icon);


            const svg = navItem.querySelector('svg');
            if (svg) {
                svg.style.width = '24px';
                svg.style.height = '24px';
                svg.style.display = 'block';
                svg.style.margin = 'auto';
            }

            if (item.isExternal && item.url) {
                navItem.addEventListener('click', () => window.open(item.url, '_blank'));
            } else {
                navItem.addEventListener('click', () => switchTab(item.id));
            }
            bottomNav.appendChild(navItem);
        });

        const content = document.createElement('div');
        content.id = 'lunar-finder-content';

        const homeTab = createHomeTab();
        const singleTab = createSingleTab();
        const multiTab = createMultiTab();
        const logsTab = createLogsTab();

        content.appendChild(homeTab);
        content.appendChild(singleTab);
        content.appendChild(multiTab);
        content.appendChild(logsTab);

        sidebar.appendChild(brand);
        sidebar.appendChild(nav);
        sidebar.appendChild(bottomNav);
        menu.appendChild(sidebar);
        menu.appendChild(content);

        document.body.appendChild(menu);


        setTimeout(() => {

            fetchMyUUID();
        }, 100);
    }

    function createHomeTab() {
        const tab = document.createElement('div');
        tab.id = 'home-tab';
        tab.className = 'content-tab';

        const title = document.createElement('h2');
        title.className = 'tab-title';
        title.innerHTML = `
            <span>Home</span>
            <button class="refresh-button" id="refresh-uuid-btn" title="Refresh UUID">
                ${createSVGIcon('refresh')}
            </button>
        `;

        const uuidDisplay = document.createElement('div');
        uuidDisplay.className = 'uuid-display';
        uuidDisplay.innerHTML = `
            <div class="uuid-label">Your UUID</div>
            <div class="uuid-value" id="my-uuid">Loading...</div>
        `;

        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';

        const storedMatchesCard = document.createElement('div');
        storedMatchesCard.className = 'stat-card';
        storedMatchesCard.id = 'stored-matches-card';

        const totalDuelsCard = document.createElement('div');
        totalDuelsCard.className = 'stat-card';
        totalDuelsCard.id = 'total-duels-card';

        const oldestMatchCard = document.createElement('div');
        oldestMatchCard.className = 'stat-card';
        oldestMatchCard.id = 'oldest-match-card';

        const fetchButton = document.createElement('button');
        fetchButton.className = 'button';
        fetchButton.textContent = 'Fetch My Matches';
        fetchButton.id = 'fetch-matches-btn';

        const clearButton = document.createElement('button');
        clearButton.className = 'button secondary';
        clearButton.textContent = 'Clear Stored Data';
        clearButton.id = 'clear-stored-btn';
        clearButton.style.marginLeft = '12px';

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.id = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-text" id="progress-text">Processing...</div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
        `;

        statsContainer.appendChild(storedMatchesCard);
        statsContainer.appendChild(totalDuelsCard);
        statsContainer.appendChild(oldestMatchCard);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.appendChild(fetchButton);
        buttonContainer.appendChild(clearButton);

        tab.appendChild(title);
        tab.appendChild(uuidDisplay);
        tab.appendChild(statsContainer);
        tab.appendChild(buttonContainer);
        tab.appendChild(progressContainer);

        loadStoredData();



        return tab;
    }

    function createSingleTab() {
        const tab = document.createElement('div');
        tab.id = 'single-tab';
        tab.className = 'content-tab';

        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.alignItems = 'center';
        titleRow.style.justifyContent = 'space-between';
        titleRow.style.marginBottom = '18px';
        const title = document.createElement('h2');
        title.className = 'tab-title';
        title.textContent = 'Single Search';


        const targetUuidGroup = document.createElement('div');
        targetUuidGroup.className = 'input-group';
        targetUuidGroup.innerHTML = `
            <label class="input-label">Target UUID</label>
            <input type="text" class="input-field" id="target-uuid" placeholder="Enter UUID or profile URL">
        `;

        const maxMatchesGroup = document.createElement('div');
        maxMatchesGroup.className = 'input-group';
        maxMatchesGroup.innerHTML = `
            <label class="input-label">Max Matches to Search</label>
            <input type="number" class="input-field" id="max-matches" value="50" min="1" max="500">
        `;

        const searchButton = document.createElement('button');
        searchButton.className = 'button';
        searchButton.textContent = 'Search Duels';
        searchButton.id = 'single-search-btn';
        searchButton.style.height = '44px';
        searchButton.style.minHeight = '44px';

        const actionButtons = document.createElement('div');
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '12px';
        actionButtons.style.alignItems = 'center';
        actionButtons.innerHTML = `
            <button class="button secondary" id="single-copy-results-btn" style="display: none; height: 44px; min-height: 44px;">Copy Results</button>
            <button class="button secondary" id="single-download-csv-btn" style="display: none; height: 44px; min-height: 44px;">Download CSV</button>
        `;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.id = 'single-progress-container';
        progressContainer.innerHTML = `
            <div class="progress-text" id="single-progress-text">Processing...</div>
            <div class="progress-bar">
                <div class="progress-fill" id="single-progress-fill"></div>
            </div>
        `;

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';
        resultsContainer.id = 'single-results-container';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '12px';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.justifyContent = 'flex-start';
        buttonContainer.appendChild(searchButton);
        buttonContainer.appendChild(actionButtons);

        tab.appendChild(title);
        tab.appendChild(targetUuidGroup);
        tab.appendChild(maxMatchesGroup);
        tab.appendChild(buttonContainer);
        tab.appendChild(progressContainer);
        tab.appendChild(resultsContainer);

        return tab;
    }

    function createMultiTab() {
        const tab = document.createElement('div');
        tab.id = 'multi-tab';
        tab.className = 'content-tab';

        const title = document.createElement('h2');
        title.className = 'tab-title';
        title.textContent = 'Multi Search';

        const fileUpload = document.createElement('div');
        fileUpload.className = 'file-upload';
        fileUpload.id = 'file-upload';
        fileUpload.innerHTML = `
            <div class="file-upload-text">Drop JSON/CSV file here or click to browse</div>
            <div class="file-upload-hint">Format: Date,Username,UserID,Profile_URL,CountryCode,ELO,Position,Action_Type,Suspended_Until</div>
            <input type="file" id="json-file" accept=".json,.csv" style="display: none;">
        `;

        const resetBtn = document.createElement('button');
        resetBtn.className = 'button secondary';
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '12px';
        resetBtn.style.display = 'none';
        fileUpload.appendChild(resetBtn);

        const playerListContainer = document.createElement('div');
        playerListContainer.id = 'multi-player-list';
        playerListContainer.style.marginTop = '20px';
        playerListContainer.style.maxHeight = '400px';
        playerListContainer.style.overflowY = 'auto';
        playerListContainer.style.scrollbarWidth = 'none';
        playerListContainer.style.msOverflowStyle = 'none';
        const style = document.createElement('style');
        style.textContent = `#multi-player-list::-webkit-scrollbar { display: none !important; }`;
        document.head.appendChild(style);

        tab.appendChild(title);
        tab.appendChild(fileUpload);
        tab.appendChild(playerListContainer);

        const scanButton = document.createElement('button');
        scanButton.className = 'button';
        scanButton.textContent = 'Scan All';
        scanButton.style.margin = '16px 0 16px 0';
        const exportAllButton = document.createElement('button');
        exportAllButton.className = 'button secondary';
        exportAllButton.textContent = 'Export All';
        exportAllButton.style.margin = '16px 0 16px 12px';
        exportAllButton.style.display = 'none';


        const multiProgressContainer = document.createElement('div');
        multiProgressContainer.className = 'progress-container';
        multiProgressContainer.id = 'multi-progress-container';
        multiProgressContainer.style.display = 'none';
        multiProgressContainer.style.marginBottom = '12px';
        multiProgressContainer.innerHTML = `
            <div class="progress-text" id="multi-progress-text">Processing...</div>
            <div class="progress-bar">
                <div class="progress-fill" id="multi-progress-fill"></div>
            </div>
        `;
        tab.appendChild(multiProgressContainer);

        function renderScanControls() {
            if (scanButton.parentElement) scanButton.parentElement.removeChild(scanButton);
            if (exportAllButton.parentElement) exportAllButton.parentElement.removeChild(exportAllButton);
            playerListContainer.parentElement.insertBefore(scanButton, playerListContainer);
            playerListContainer.parentElement.insertBefore(exportAllButton, playerListContainer);
        }

        function handleMultiFile(file) {
            setFileLoadedUI(file.name);
            if (file.name.endsWith('.csv')) {
                handleMultiCsv(file);
            } else {
                handleMultiJson(file);
            }
        }

        function handleMultiJson(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    bannedPlayers = data.filter(entry =>
                        entry.Action_Type && entry.Action_Type.toLowerCase().includes('banned')
                    );
                    renderScanControls();
                    playerListContainer.innerHTML = '<div style="color: #ff1493; text-align:center; padding:40px;">Ready to scan. Click Scan All.</div>';
                } catch (error) {
                    showNotification('Invalid JSON file', 'error');
                }
            };
            reader.readAsText(file);
        }

        function handleMultiCsv(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
                    if (!lines.length) throw new Error('Empty CSV');
                    const headers = lines[0].split(',').map(h => h.trim());
                    const data = lines.slice(1).map(line => {
                        const cols = [];
                        let current = '';
                        let inQuotes = false;
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') {
                                if (inQuotes && line[i+1] === '"') {
                                    current += '"';
                                    i++;
                                } else {
                                    inQuotes = !inQuotes;
                                }
                            } else if (char === ',' && !inQuotes) {
                                cols.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        cols.push(current.trim());
                        while (cols.length < headers.length) cols.push('');
                        const obj = {};
                        headers.forEach((h, i) => {
                            obj[h] = cols[i] || '';
                        });
                        return obj;
                    }).filter(row => Object.values(row).some(v => v));
                    if (!data.length) throw new Error('No valid data rows');
                    bannedPlayers = data.filter(entry =>
                        entry.UserID && entry.Action_Type && entry.Action_Type.toLowerCase().includes('banned')
                    );
                    renderScanControls();
                    playerListContainer.innerHTML = '<div style="color: #ff1493; text-align:center; padding:40px;">Ready to scan. Click Scan All.</div>';
                } catch (error) {
                    showNotification('Invalid CSV file: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        }

        scanButton.onclick = async () => {
            scanButton.disabled = true;
            scanButton.textContent = 'Scanning...';
            exportAllButton.style.display = 'none';
            multiProgressContainer.style.display = 'block';
            const progressText = multiProgressContainer.querySelector('#multi-progress-text');
            const progressFill = multiProgressContainer.querySelector('#multi-progress-fill');

            const userMap = {};
            bannedPlayers.forEach(player => {
                userMap[player.UserID] = { player, matches: [] };
            });
            let scanned = 0;
            const total = storedMatches.length;
            const batchSize = 3;
            for (let i = 0; i < total; i += batchSize) {
                const batch = storedMatches.slice(i, i + batchSize);
                await Promise.all(batch.map(async (match) => {
                    try {
                        const duelData = await fetchDuelDetailsGM(match.gameId);
                        if (duelData.teams) {
                            for (const team of duelData.teams) {
                                if (team.players) {
                                    for (const p of team.players) {
                                        if (userMap[p.playerId]) {
                                            userMap[p.playerId].matches.push({
                                                gameId: match.gameId,
                                                time: match.time,
                                                gameLink: `https://www.geoguessr.com/duels/${match.gameId}/summary`,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }));
                scanned += batch.length;
                progressText.textContent = `Scanning: ${scanned} of ${total}`;
                progressFill.style.width = `${(scanned / total) * 100}%`;
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            const results = Object.values(userMap).filter(u => u.matches.length > 0);
            lastScanResults = results;
            renderScanResults(results);
            scanButton.textContent = 'Scan All';
            scanButton.disabled = false;
            exportAllButton.style.display = results.length > 0 ? 'inline-block' : 'none';
            multiProgressContainer.style.display = 'none';
        };

        exportAllButton.onclick = () => {
            if (!lastScanResults.length) return;
            const allRows = [];
            lastScanResults.forEach(u => {
                u.matches.forEach(m => {
                    const dateObj = new Date(m.time);
                    const day = dateObj.getDate().toString().padStart(2, '0');
                    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                    const date = `${day}/${month}`;
                    allRows.push([
                        date,
                        u.player.Username,
                        m.gameLink
                    ]);
                });
            });
            const headers = ['Date', 'Username', 'Game Link'];
            const csv = [headers, ...allRows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `duels_all_banned.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        function exportPlayerMatches(player, matches) {
            const allRows = [];
            matches.forEach(m => {
                const dateObj = new Date(m.time);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const date = `${day}/${month}`;
                allRows.push([
                    date,
                    player.Username,
                    m.gameLink
                ]);
            });
            const headers = ['Date', 'Username', 'Game Link'];
            const csv = [headers, ...allRows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `duels_${player.Username.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function renderScanResults(results) {
            playerListContainer.innerHTML = '';
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.innerHTML = `
                <thead><tr style="background:rgba(255,255,255,0.05);">
                    <th style="padding:8px; text-align:left; color:#ff1493;">Username</th>
                    <th style="padding:8px; text-align:left; color:#ff1493; max-width:220px;">UserID</th>
                    <th style="padding:8px; text-align:left; color:#ff1493; max-width:100px;">Matches</th>
                    <th style="padding:8px; text-align:left; color:#ff1493;">Export</th>
                </tr></thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
            results.forEach((u, idx) => {
                const tr = document.createElement('tr');
                tr.style.background = 'rgba(255,255,255,0.02)';
                tr.style.borderRadius = '12px';
                tr.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                tr.style.border = '2px solid #ff1493';
                tr.style.transition = 'box-shadow 0.3s, background 0.3s';
                tr.innerHTML = `
                    <td style="padding:14px 8px; color:#fff; font-weight:500; border:none;">${u.player.Username}</td>
                    <td style="padding:14px 8px; font-size:12px; color:#ff1493; text-decoration:underline; cursor:pointer; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; border:none;" id="userlink-${idx}">${u.player.UserID}</td>
                    <td style="padding:14px 8px; color:#fff; font-weight:600; border:none;">${u.matches.length}</td>
                    <td style="padding:8px; border:none;"><button class='button secondary' id='export-player-${idx}'>Export</button></td>
                `;
                tbody.appendChild(tr);
                setTimeout(() => {
                    const link = document.getElementById(`userlink-${idx}`);
                    if (link) {
                        link.onclick = (e) => {
                            window.open(`https://www.geoguessr.com/user/${u.player.UserID}`, '_blank');
                        };
                        link.onmouseover = () => link.style.textDecoration = 'underline';
                        link.onmouseout = () => link.style.textDecoration = 'underline';
                    }
                    const exportBtn = document.getElementById(`export-player-${idx}`);
                    if (exportBtn) {
                        exportBtn.onclick = () => {
                            exportPlayerMatches(u.player, u.matches);
                        };
                    }
                }, 0);
            });
            playerListContainer.appendChild(table);
        }


        const fileInput = fileUpload.querySelector('#json-file');
        fileInput.setAttribute('accept', '.json,.csv');
        fileUpload.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleMultiFile(files[0]);
            }
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleMultiFile(e.target.files[0]);
            }
        });

        resetBtn.onclick = () => {
            const fileInput = fileUpload.querySelector('#json-file');
            fileInput.value = '';
            resetFileUI();
        };

        return tab;
    }

    function createLogsTab() {
        const tab = document.createElement('div');
        tab.id = 'logs-tab';
        tab.className = 'content-tab';

        const title = document.createElement('h2');
        title.className = 'tab-title';
        title.innerHTML = `
            <span>Logs</span>
            <button class="refresh-button" id="clear-logs-btn" title="Clear Logs" style="margin-left: 12px;">
                ${createSVGIcon('refresh')}
            </button>
        `;

        const logsContainer = document.createElement('div');
        logsContainer.className = 'results-container';
        logsContainer.id = 'logs-container';
        logsContainer.style.display = 'block';
        logsContainer.style.maxHeight = '400px';

        const actionButtons = document.createElement('div');
        actionButtons.style.marginTop = '20px';
        actionButtons.innerHTML = `
            <button class="button secondary" id="export-logs-btn">Export Logs</button>
        `;

        tab.appendChild(title);
        tab.appendChild(logsContainer);
        tab.appendChild(actionButtons);

        return tab;
    }

    function switchTab(tabId) {
        const navItems = document.querySelectorAll('.nav-item');
        const tabs = document.querySelectorAll('.content-tab');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.id === `${tabId}-tab`) {
                tab.classList.add('active');
            }
        });
    }

    function toggleMenu() {
        if (!menu) {
            createMenu();

            addEventListeners();
        }

        isMenuOpen = !isMenuOpen;
        menu.style.display = isMenuOpen ? 'flex' : 'none';

        if (isMenuOpen) {
            loadStoredData();
            updateStats();
            updateLogsDisplay();
            switchTab('home');
        }
    }

    async function fetchMyUUID() {
        const uuidElement = document.getElementById('my-uuid');
        if (uuidElement) {
            uuidElement.textContent = 'Fetching...';
        }

        addLog('Fetching UUID...', 'info');

        try {
            console.log('Fetching UUID...');


            let response = await fetch('https://www.geoguessr.com/api/v3/profiles', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Profile data:', data);


                if (data.user && data.user.id) {
                    myUserId = data.user.id;
                } else if (data.id) {
                    myUserId = data.id;
                } else if (data.userId) {
                    myUserId = data.userId;
                } else {
                    console.log('No user ID found in response structure:', data);
                    throw new Error('No user ID found in response');
                }

                if (uuidElement) {
                    uuidElement.textContent = myUserId;
                    console.log('UUID updated:', myUserId);
                    addLog(`UUID fetched successfully: ${myUserId}`, 'info');
                } else {
                    console.log('UUID element not found');
                    addLog('UUID element not found', 'warning');
                }
                localStorage.setItem('lunar_finder_my_uuid', myUserId);
                return;
            }


            console.log('First endpoint failed, trying alternative...');
            response = await fetch('https://www.geoguessr.com/api/v4/stats/me', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Stats data:', data);

                if (data.userId) {
                    myUserId = data.userId;
                } else if (data.id) {
                    myUserId = data.id;
                } else {
                    throw new Error('No user ID found in response');
                }

                if (uuidElement) {
                    uuidElement.textContent = myUserId;
                    console.log('UUID updated from stats:', myUserId);
                }
                localStorage.setItem('lunar_finder_my_uuid', myUserId);
                return;
            }


            console.log('Both endpoints failed');
            addLog(`Failed to fetch UUID: HTTP ${response.status}`, 'error');
            if (uuidElement) {
                uuidElement.textContent = `Error: ${response.status}`;
            }

        } catch (error) {
            console.error('Error fetching UUID:', error);
            addLog(`Error fetching UUID: ${error.message}`, 'error');
            if (uuidElement) {
                uuidElement.textContent = 'Error fetching UUID';
            }
        }
    }

    function loadStoredData() {
        try {
            const stored = localStorage.getItem('lunar_finder_matches');
            if (stored) {
                storedMatches = JSON.parse(stored);
                console.log(`Loaded ${storedMatches.length} matches from storage`);
            } else {
                storedMatches = [];
                console.log('No stored matches found');
            }
            updateStats();
        } catch (error) {
            console.error('Error loading stored data:', error);
            storedMatches = [];

            try {
                localStorage.removeItem('lunar_finder_matches');
            } catch (clearError) {
                console.error('Failed to clear corrupted data:', clearError);
            }
        }
    }

    function updateStats() {
        const storedMatchesCard = document.getElementById('stored-matches-card');
        const totalDuelsCard = document.getElementById('total-duels-card');
        const oldestMatchCard = document.getElementById('oldest-match-card');

        if (storedMatchesCard && totalDuelsCard && oldestMatchCard) {
            storedMatchesCard.innerHTML = `
                <div class="stat-number">${storedMatches.length.toLocaleString()}</div>
                <div class="stat-label">Unique Games</div>
            `;


            const lastFetchTime = localStorage.getItem('lunar_finder_last_fetch');
            let timeSinceLastFetch = 'Never';

            if (lastFetchTime) {
                const lastFetch = new Date(parseInt(lastFetchTime));
                const now = new Date();
                const diffMs = now - lastFetch;
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                if (diffDays > 0) {
                    timeSinceLastFetch = `${diffDays}d ago`;
                } else if (diffHours > 0) {
                    timeSinceLastFetch = `${diffHours}h ago`;
                } else if (diffMinutes > 0) {
                    timeSinceLastFetch = `${diffMinutes}m ago`;
                } else {
                    timeSinceLastFetch = 'Just now';
                }
            }

            totalDuelsCard.innerHTML = `
                <div class="stat-number">${timeSinceLastFetch}</div>
                <div class="stat-label">Last Fetch</div>
            `;


            let oldestDate = 'No matches';
            if (storedMatches.length > 0) {
                const oldestMatch = storedMatches.reduce((oldest, current) => {
                    return new Date(current.time) < new Date(oldest.time) ? current : oldest;
                });
                const oldestDateObj = new Date(oldestMatch.time);
                const day = oldestDateObj.getDate().toString().padStart(2, '0');
                const month = (oldestDateObj.getMonth() + 1).toString().padStart(2, '0');
                oldestDate = `${day}/${month}`;
            }

            oldestMatchCard.innerHTML = `
                <div class="stat-number">${oldestDate}</div>
                <div class="stat-label">Oldest Match</div>
            `;
        }
    }

    async function fetchMyMatches() {
        if (!myUserId) {
            alert('Please wait for UUID to load');
            return;
        }

        const button = document.getElementById('fetch-matches-btn');
        const progressContainer = document.getElementById('progress-container');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');

        button.disabled = true;
        button.textContent = 'Fetching...';
        progressContainer.style.display = 'block';

        try {
            let allMatches = [];
            let paginationToken = null;
            let page = 0;
            let hasMore = true;
            let consecutiveEmptyPages = 0;
            const maxPages = 100;

            while (hasMore && page < maxPages && consecutiveEmptyPages < 3) {
                progressText.textContent = `Fetching page ${page + 1}...`;
                progressFill.style.width = `${((page + 1) / maxPages) * 100}%`;

                let url = `https://www.geoguessr.com/api/v4/feed/private?count=100`;
                if (paginationToken) url += `&paginationToken=${paginationToken}`;
                const response = await fetch(url, { credentials: 'include' });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const entries = data.entries || data || [];
                paginationToken = data.paginationToken || null;

                if (entries.length === 0) {
                    consecutiveEmptyPages++;
                    if (consecutiveEmptyPages >= 3) {
                        hasMore = false;
                    }
                } else {
                    consecutiveEmptyPages = 0;
                    const duelMatches = extractDuelMatches(entries);
                    allMatches.push(...duelMatches);
                    console.log(`Page ${page + 1}: Found ${duelMatches.length} duel matches (${entries.length} total activities)`);
                }

                if (!paginationToken) hasMore = false;
                page++;
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            console.log(`Total activities processed: ${page * 100}, Total duel matches found: ${allMatches.length}`);


            const uniqueMatches = [];
            const seenGameIds = new Set();

            for (const match of allMatches) {
                if (!seenGameIds.has(match.gameId)) {
                    seenGameIds.add(match.gameId);
                    uniqueMatches.push(match);
                }
            }


            if (allMatches.length > 0 && uniqueMatches.length < 100) {
                console.log('Trying alternative approach to find more matches...');
                try {

                    const gamesResponse = await fetch('https://www.geoguessr.com/api/v3/games?count=100', {
                        credentials: 'include'
                    });

                    if (gamesResponse.ok) {
                        const gamesData = await gamesResponse.json();
                        console.log('Games data:', gamesData);


                        if (gamesData.games) {
                            for (const game of gamesData.games) {
                                if (game.gameMode === 'Duels' || game.gameMode === 'TeamDuels') {
                                    const existingMatch = allMatches.find(m => m.gameId === game.id);
                                    if (!existingMatch) {
                                        allMatches.push({
                                            gameId: game.id,
                                            gameMode: game.gameMode,
                                            time: game.created,
                                            activity: null
                                        });
                                        console.log(`Added game from games endpoint: ${game.id}`);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching games:', error);
                }
            }


            for (const match of allMatches) {
                if (!seenGameIds.has(match.gameId)) {
                    seenGameIds.add(match.gameId);
                    uniqueMatches.push(match);
                }
            }

            console.log(`Found ${allMatches.length} total matches, ${uniqueMatches.length} unique games`);
            console.log('Sample of unique game IDs:', uniqueMatches.slice(0, 10).map(m => m.gameId));
            addLog(`Found ${allMatches.length} total matches, ${uniqueMatches.length} unique games`, 'info');
            if (uniqueMatches.length > 0) {
                addLog(`Sample game IDs: ${uniqueMatches.slice(0, 5).map(m => m.gameId).join(', ')}`, 'info');
            }

            storedMatches = uniqueMatches;


            try {
                const matchesJson = JSON.stringify(storedMatches);
                localStorage.setItem('lunar_finder_matches', matchesJson);
                localStorage.setItem('lunar_finder_last_fetch', Date.now().toString());
                console.log(`Saved ${storedMatches.length} unique matches to localStorage`);
                addLog(`Saved ${storedMatches.length} unique matches to localStorage`, 'info');
            } catch (storageError) {
                console.error('Storage error:', storageError);
                addLog(`Storage error: ${storageError.message}`, 'error');


                if (storageError.name === 'QuotaExceededError') {
                    try {

                        const limitedMatches = storedMatches.slice(0, 500);
                        localStorage.setItem('lunar_finder_matches', JSON.stringify(limitedMatches));
                        localStorage.setItem('lunar_finder_last_fetch', Date.now().toString());
                        console.log(`Saved limited set of ${limitedMatches.length} unique matches due to storage quota`);
                        addLog(`Saved limited set of ${limitedMatches.length} unique matches due to storage quota`, 'warning');
                        progressText.textContent = `Warning: Only saved ${limitedMatches.length} unique matches due to storage limit`;
                    } catch (secondError) {
                        console.error('Failed to save even limited matches:', secondError);
                        addLog(`Failed to save even limited matches: ${secondError.message}`, 'error');
                        progressText.textContent = 'Warning: Could not save matches to storage';
                    }
                }
            }

            updateStats();

            progressText.textContent = `Complete! Found ${allMatches.length} matches`;
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 3000);

        } catch (error) {
            console.error('Error fetching matches:', error);
            addLog(`Error fetching matches: ${error.message}`, 'error');
            progressText.textContent = `Error: ${error.message}`;
        } finally {
            button.disabled = false;
            button.textContent = 'Fetch My Matches';
        }
    }

    function extractDuelMatches(activities) {
        const matches = [];

        for (const activity of activities) {
            if (!activity.payload) continue;

            try {
                const payload = JSON.parse(activity.payload);

                if (Array.isArray(payload)) {
                    for (const event of payload) {
                        if (event.payload && event.payload.gameId) {
                            const gameMode = event.payload.gameMode;
                            if (gameMode === 'Duels' || gameMode === 'TeamDuels') {
                                matches.push({
                                    gameId: event.payload.gameId,
                                    gameMode: gameMode,
                                    time: event.time || activity.time,
                                    activity: activity
                                });
                            }
                        }
                    }
                } else if (payload.gameId) {
                    const gameMode = payload.gameMode;
                    if (gameMode === 'Duels' || gameMode === 'TeamDuels') {
                        matches.push({
                            gameId: payload.gameId,
                            gameMode: gameMode,
                            time: payload.time || activity.time,
                            activity: activity
                        });
                    }
                }


                if (payload.gameId && !payload.gameMode) {


                    matches.push({
                        gameId: payload.gameId,
                        gameMode: 'Unknown',
                        time: payload.time || activity.time,
                        activity: activity
                    });
                }
            } catch (error) {
                console.error('Error parsing payload:', error);
            }
        }

        return matches;
    }

    async function searchSingleDuels() {
        const targetUuid = document.getElementById('target-uuid').value.trim();
        const maxMatches = parseInt(document.getElementById('max-matches').value);

        if (!targetUuid) {
            alert('Please enter a target UUID');
            return;
        }

        if (!storedMatches.length) {
            alert('Please fetch your matches first from the Home tab');
            return;
        }

        const button = document.getElementById('single-search-btn');
        const progressContainer = document.getElementById('single-progress-container');
        const progressText = document.getElementById('single-progress-text');
        const progressFill = document.getElementById('single-progress-fill');
        const resultsContainer = document.getElementById('single-results-container');

        button.disabled = true;
        button.textContent = 'Searching...';
        progressContainer.style.display = 'block';
        resultsContainer.style.display = 'none';


        document.getElementById('single-copy-results-btn').style.display = 'none';
        document.getElementById('single-download-csv-btn').style.display = 'none';

        try {
            const foundDuels = [];
            let processed = 0;

            const onlyMe = document.getElementById('compare-matches-switch')?.checked ?? true;

            for (const match of storedMatches.slice(0, maxMatches)) {
                progressText.textContent = `Checking duel ${processed + 1}/${Math.min(maxMatches, storedMatches.length)}...`;
                progressFill.style.width = `${((processed + 1) / Math.min(maxMatches, storedMatches.length)) * 100}%`;

                try {
                    const duelData = await fetchDuelDetailsGM(match.gameId);
                    let hasTarget = false;
                    let hasMe = false;
                    if (duelData.teams) {
                        for (const team of duelData.teams) {
                            if (team.players) {
                                for (const player of team.players) {
                                    if (player.playerId === targetUuid) hasTarget = true;
                                    if (player.playerId === myUserId) hasMe = true;
                                }
                            }
                        }
                    }
                    if (hasTarget && (onlyMe ? hasMe : true)) {
                        foundDuels.push({
                            gameId: match.gameId,
                            gameMode: match.gameMode,
                            time: match.time,
                            gameLink: `https://www.geoguessr.com/duels/${match.gameId}/summary`,
                            duelData: duelData
                        });
                    }
                } catch (error) {
                    console.error(`Error checking duel ${match.gameId}:`, error);
                }

                processed++;
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            currentResults = foundDuels;
            displayResults(foundDuels, resultsContainer, 'single');
            progressText.textContent = `Complete! Found ${foundDuels.length} duels`;


            document.getElementById('single-copy-results-btn').style.display = 'inline-block';
            document.getElementById('single-download-csv-btn').style.display = 'inline-block';

        } catch (error) {
            console.error('Error searching duels:', error);
            progressText.textContent = `Error: ${error.message}`;
        } finally {
            button.disabled = false;
            button.textContent = 'Search Duels';
        }
    }

    async function searchMultiDuels() {
        if (!window.selectedCheatersData) {
            alert('Please select a JSON file first');
            return;
        }

        if (!storedMatches.length) {
            alert('Please fetch your matches first from the Home tab');
            return;
        }

        const maxMatches = parseInt(document.getElementById('max-matches').value);
        const button = document.getElementById('single-search-btn');
        const progressContainer = document.getElementById('single-progress-container');
        const progressText = document.getElementById('single-progress-text');
        const progressFill = document.getElementById('single-progress-fill');
        const resultsContainer = document.getElementById('single-results-container');

        button.disabled = true;
        button.textContent = 'Searching...';
        progressContainer.style.display = 'block';
        resultsContainer.style.display = 'none';

        try {
            const foundDuels = [];
            const cheaterIds = window.selectedCheatersData.map(cheater => cheater.UserID);
            let processed = 0;
            const totalToProcess = Math.min(maxMatches * cheaterIds.length, storedMatches.length);

            for (const match of storedMatches.slice(0, maxMatches * cheaterIds.length)) {
                progressText.textContent = `Checking duel ${processed + 1}/${totalToProcess}...`;
                progressFill.style.width = `${((processed + 1) / totalToProcess) * 100}%`;

                try {
                    const duelData = await fetch(`https://game-server.geoguessr.com/api/duels/${match.gameId}`, {
                        credentials: 'include'
                    }).then(r => r.json());

                    if (duelData.teams) {
                        for (const team of duelData.teams) {
                            if (team.players) {
                                for (const player of team.players) {
                                    if (cheaterIds.includes(player.playerId)) {
                                        const cheater = window.selectedCheatersData.find(c => c.UserID === player.playerId);
                                        foundDuels.push({
                                            gameId: match.gameId,
                                            gameMode: match.gameMode,
                                            time: match.time,
                                            gameLink: `https://www.geoguessr.com/duels/${match.gameId}/summary`,
                                            username: cheater.Username,
                                            date: cheater.Date,
                                            actionType: cheater.Action_Type
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error checking duel ${match.gameId}:`, error);
                }

                processed++;
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            currentResults = foundDuels;
            displayResults(foundDuels, resultsContainer, 'multi');
            progressText.textContent = `Complete! Found ${foundDuels.length} duels`;


            document.getElementById('single-copy-results-btn').style.display = 'inline-block';
            document.getElementById('single-download-csv-btn').style.display = 'inline-block';

        } catch (error) {
            console.error('Error searching duels:', error);
            progressText.textContent = `Error: ${error.message}`;
        } finally {
            button.disabled = false;
            button.textContent = 'Search All Duels';
        }
    }

    function displayResults(duels, container, type) {
        container.innerHTML = '';

        if (duels.length === 0) {
            container.innerHTML = '<div style="color: rgba(255, 255, 255, 0.7); text-align: center; padding: 40px;">No duels found</div>';
            container.style.display = 'block';
            return;
        }

        duels.forEach(duel => {
            const item = document.createElement('div');
            item.className = 'result-item';

            const dateObj = new Date(duel.time);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const date = `${day}/${month}`;

            if (type === 'multi') {
                item.innerHTML = `
                    <div class="result-date">${date} - ${duel.actionType}</div>
                    <div class="result-username">${duel.username}</div>
                    <a href="${duel.gameLink}" target="_blank" class="result-link">${duel.gameLink}</a>
                `;
            } else {
                item.innerHTML = `
                    <div class="result-date">${date}</div>
                    <div class="result-username">Duel Match</div>
                    <a href="${duel.gameLink}" target="_blank" class="result-link">${duel.gameLink}</a>
                `;
            }

            container.appendChild(item);
        });

        container.style.display = 'block';
    }

    function copyResults() {
        if (!currentResults.length) return;

        const csvContent = generateCSV(currentResults);
        navigator.clipboard.writeText(csvContent).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy results');
        });
    }

    function downloadCSV() {
        if (!currentResults.length) return;

        const csvContent = generateCSV(currentResults);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `duel_results_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearStoredData() {
        if (confirm('Are you sure you want to clear all stored match data? This cannot be undone.')) {
            try {
                localStorage.removeItem('lunar_finder_matches');
                storedMatches = [];
                updateStats();
                alert('Stored data cleared successfully!');
            } catch (error) {
                console.error('Error clearing stored data:', error);
                alert('Error clearing stored data');
            }
        }
    }

    function generateCSV(results) {
        const headers = ['Date', 'Username', 'Game Link', 'Action Type'];
        const rows = results.map(duel => {
            const dateObj = new Date(duel.time);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const date = `${day}/${month}`;

            return [
                date,
                duel.username || 'N/A',
                duel.gameLink,
                duel.actionType || 'N/A'
            ];
        });

        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            type
        };
        logs.unshift(logEntry);


        if (logs.length > 100) {
            logs = logs.slice(0, 100);
        }

        updateLogsDisplay();
    }

    function updateLogsDisplay() {
        const logsContainer = document.getElementById('logs-container');
        if (!logsContainer) return;

        logsContainer.innerHTML = '';

        if (logs.length === 0) {
            logsContainer.innerHTML = '<div style="color: rgba(255, 255, 255, 0.7); text-align: center; padding: 40px;">No logs yet</div>';
            return;
        }

        logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'result-item';

            const typeColor = log.type === 'error' ? '#e74c3c' : log.type === 'warning' ? '#f39c12' : '#27ae60';

            item.innerHTML = `
                <div class="result-date" style="color: ${typeColor};">${log.timestamp}</div>
                <div class="result-username">${log.message}</div>
            `;

            logsContainer.appendChild(item);
        });
    }

    function clearLogs() {
        if (confirm('Are you sure you want to clear all logs?')) {
            logs = [];
            updateLogsDisplay();
        }
    }

    function exportLogs() {
        if (logs.length === 0) {
            alert('No logs to export');
            return;
        }

        const csvContent = logs.map(log => [
            log.timestamp,
            log.type,
            log.message
        ]).map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const headers = ['Timestamp', 'Type', 'Message'];
        const fullCsv = [headers, ...logs.map(log => [log.timestamp, log.type, log.message])]
            .map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([fullCsv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lunar_finder_logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function addEventListeners() {

        const fetchBtn = document.getElementById('fetch-matches-btn');
        const singleSearchBtn = document.getElementById('single-search-btn');
        const multiSearchBtn = document.getElementById('multi-search-btn');
        const copyResultsBtn = document.getElementById('single-copy-results-btn');
        const downloadCsvBtn = document.getElementById('single-download-csv-btn');
        const refreshUuidBtn = document.getElementById('refresh-uuid-btn');
        const clearStoredBtn = document.getElementById('clear-stored-btn');
        const clearLogsBtn = document.getElementById('clear-logs-btn');
        const exportLogsBtn = document.getElementById('export-logs-btn');
        const singleCopyResultsBtn = document.getElementById('single-copy-results-btn');
        const singleDownloadCsvBtn = document.getElementById('single-download-csv-btn');

        if (fetchBtn) fetchBtn.addEventListener('click', fetchMyMatches);
        if (singleSearchBtn) singleSearchBtn.addEventListener('click', searchSingleDuels);
        if (multiSearchBtn) multiSearchBtn.addEventListener('click', searchMultiDuels);
        if (copyResultsBtn) copyResultsBtn.addEventListener('click', copyResults);
        if (downloadCsvBtn) downloadCsvBtn.addEventListener('click', downloadCSV);
        if (refreshUuidBtn) refreshUuidBtn.addEventListener('click', fetchMyUUID);
        if (clearStoredBtn) clearStoredBtn.addEventListener('click', clearStoredData);
        if (clearLogsBtn) clearLogsBtn.addEventListener('click', clearLogs);
        if (exportLogsBtn) exportLogsBtn.addEventListener('click', exportLogs);
        if (singleCopyResultsBtn) singleCopyResultsBtn.addEventListener('click', copyResults);
        if (singleDownloadCsvBtn) singleDownloadCsvBtn.addEventListener('click', downloadCSV);
    }

    function addTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'Lunar Finder';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff1493;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
            font-family: 'Geist', sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        `;

        button.onmouseover = () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 15px rgba(255, 20, 147, 0.3)';
        };

        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        };

        button.onclick = () => {
            toggleMenu();
        };

        document.body.appendChild(button);
    }

    function handleKeyPress(event) {
        if (event.key === 'Insert' || event.code === 'Insert') {
            event.preventDefault();
            toggleMenu();
        }
    }

    function initializeApp() {
        loadStoredData();


    }

    document.addEventListener('keydown', handleKeyPress);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addTriggerButton();
            initializeApp();
        });
    } else {
        addTriggerButton();
        initializeApp();
    }
})();


function showNotification(message, type = 'info') {
    let container = document.getElementById('lunar-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'lunar-toast-container';
        container.style.position = 'fixed';
        container.style.top = '24px';
        container.style.right = '24px';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '12px';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.background = type === 'error' ? 'rgba(255,59,59,0.95)' : 'rgba(30,30,30,0.97)';
    toast.style.color = '#fff';
    toast.style.border = type === 'error' ? '1.5px solid #ff3b3b' : '1.5px solid #ff1493';
    toast.style.borderRadius = '10px';
    toast.style.padding = '16px 28px';
    toast.style.fontSize = '15px';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'opacity 0.2s, transform 0.2s';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            toast.remove();
            if (container.childElementCount === 0) container.remove();
        }, 200);
    }, 3000);
}


function fetchDuelDetailsGM(gameId) {
    return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') {
            reject(new Error('GM_xmlhttpRequest is not available'));
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://game-server.geoguessr.com/api/duels/${gameId}`,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error('Status ' + response.status));
                }
            },
            onerror: function(e) {
                reject(new Error('Request failed'));
            }
        });
    });
}

function setFileLoadedUI(filename) {
    const fileUpload = document.getElementById('file-upload');
    const resetBtn = fileUpload.querySelector('button');
    const textDiv = fileUpload.querySelector('.file-upload-text');
    textDiv.innerHTML = `<span style='color:#ff1493;font-weight:600;'>${filename}</span> <span style='color:#27ae60;font-size:18px;'>&#10003;</span>`;
    fileUpload.style.background = 'rgba(39, 174, 96, 0.08)';
    resetBtn.style.display = 'inline-block';
}

function resetFileUI() {
    const fileUpload = document.getElementById('file-upload');
    const resetBtn = fileUpload.querySelector('button');
    const playerListContainer = document.getElementById('multi-player-list');
    const exportAllButton = document.querySelector('#multi-tab button[style*="margin: 16px 0 16px 12px"]');
    const scanButton = document.querySelector('#multi-tab button[style*="margin: 16px 0 16px 0"]');
    const multiProgressContainer = document.getElementById('multi-progress-container');

    const textDiv = fileUpload.querySelector('.file-upload-text');
    textDiv.textContent = 'Drop JSON/CSV file here or click to browse';
    fileUpload.style.background = '';
    resetBtn.style.display = 'none';
    playerListContainer.innerHTML = '';


    bannedPlayers = [];
    lastScanResults = [];

    if (exportAllButton) exportAllButton.style.display = 'none';
    if (scanButton) {
        scanButton.disabled = false;
        scanButton.textContent = 'Scan All';
    }
    if (multiProgressContainer) multiProgressContainer.style.display = 'none';
}



