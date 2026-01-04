// ==UserScript==
// @name         Neon Game Hub
// @namespace    https://violentmonkey.github.io/
// @version      3.7
// @description  Game search tool directly from the Steam game page to your favourite websites search engine!
// @author       Okagame
// @license      MIT
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      self
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548281/Neon%20Game%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/548281/Neon%20Game%20Hub.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("⚡ Neon Game Hub is on! ⚡");
    // ======================
    // CONFIGURATION
    // ======================
    const CONFIG = {
        colors: {
            primary: 'rgba(10, 5, 15, 0.95)',
            accent: '#00ff9d',
            accentLight: '#00ffaa',
            text: '#ff99cc',
            border: 'rgba(0, 255, 157, 0.3)',
            folderBg: 'rgba(15, 10, 25, 0.7)',
            favourite: '#ff4444',
            nonFavourite: '#333333'
        },
        storage: {
            FAVOURITES_KEY: 'ngsh_favourites'
        },
        SITE_DEFINITIONS: {
            'Direct Downloads': [
        { name: 'CS.RIN.RU', icon: '📥', urlPattern: 'https://cs.rin.ru/forum/search.php?keywords={query}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search' },
        { name: 'ElAmigos', icon: '📥', urlPattern: 'https://elamigos.site/?s={query}' },
        { name: 'FitGirl Repacks', icon: '📥', urlPattern: 'https://fitgirl-repacks.site/?s={query}' },
        { name: 'AtopGames', icon: '📥', urlPattern: 'https://atopgames.com/?s={query}' },
        { name: 'GOG-Games', icon: '📥', urlPattern: 'https://gog-games.to/?search={query}' },
        { name: 'G4U', icon: '📥', urlPattern: 'https://g4u.to/en/search/?str={query}' },
        { name: 'AbandonwareGames', icon: '📥', urlPattern: 'https://abandonwaregames.net/search.php?q={query}' },
        { name: 'AnkerGames', icon: '📥', urlPattern: 'https://ankergames.net/search/{query}' },
        { name: 'CG-GamesPC', icon: '📥', urlPattern: 'https://www.cg-gamespc.com/games?game={query}' },
        { name: 'GameBounty', icon: '📥', urlPattern: 'https://gamebounty.world/?s={query}' },
        { name: 'GamDie', icon: '📥', urlPattern: 'https://gamdie.com/?s={query}' },
        { name: 'GameDrive', icon: '📥', urlPattern: 'https://gamedrive.org/?s={query}' },
        { name: 'GamePCFull', icon: '📥', urlPattern: 'https://gamepcfull.com/?s={query}' },
        { name: 'Games4U', icon: '📥', urlPattern: 'https://games4u.org/?s={query}' },
        { name: 'GamesDrive', icon: '📥', urlPattern: 'https://gamesdrive.net/?s={query}' },
        { name: 'GamesPack', icon: '📥', urlPattern: 'https://games-pack.net/?s={query}' },
        { name: 'GameZDL', icon: '📥', urlPattern: 'https://gamezdl.cc/?s={query}' },
        { name: 'GetFreeGames', icon: '📥', urlPattern: 'https://getfreegames.net/?s={query}' },
        { name: 'Gnarly Repacks', icon: '📥', urlPattern: 'https://rentry.org/gnarly_repacks' },
        { name: 'M4ckD0ge Repacks', icon: '📥', urlPattern: 'https://m4ckd0ge-repacks.site/?s={query}' },
        { name: 'MyAbandonware', icon: '📥', urlPattern: 'https://www.myabandonware.com/search?q={query}' },
        { name: 'OldGamesDownload', icon: '📥', urlPattern: 'https://oldgamesdownload.com/?s={query}' },
        { name: 'OvaGames', icon: '📥', urlPattern: 'https://www.ovagames.com/?s={query}' },
        { name: 'ReloadedSteam', icon: '📥', urlPattern: 'https://reloadedsteam.com/?s={query}' },
        { name: 'Repack-Games', icon: '📥', urlPattern: 'https://repack-games.com/?s={query}' },
        { name: 'RepackLab', icon: '📥', urlPattern: 'https://repacklab.com/?s={query}' },
        { name: 'Steam-Cracked', icon: '📥', urlPattern: 'https://steam-cracked.com/?s={query}' },
        { name: 'SteamGG', icon: '📥', urlPattern: 'https://steamgg.net/?s={query}' },
        { name: 'SteamRip', icon: '📥', urlPattern: 'https://steamrip.com/?s={query}' },
        { name: 'SteamUnderground', icon: '📥', urlPattern: 'https://steamunderground.net/?s={query}' },
        { name: 'Collection Chamber', icon: '📥', urlPattern: 'https://collectionchamber.blogspot.com/search?q={query}' },
        { name: 'UndergroundGames', icon: '📥', urlPattern: 'https://undergroundgames.net/?s={query}' },
        { name: 'Union-Crax', icon: '📥', urlPattern: 'https://union-crax.xyz/?s={query}' },
        { name: 'Win7Games', icon: '📥', urlPattern: 'https://win7games.com/' },
        { name: 'WorldofPCGames', icon: '📥', urlPattern: 'https://worldofpcgames.com/?s={query}' }
            ],
            'Search Engines': [
        { name: 'Google Custom Search', icon: '🔍', urlPattern: 'https://cse.google.com/cse?cx=20c2a3e5f702049aa&q={query}' },
        { name: 'RaveGameSearch', icon: '🔍', urlPattern: 'https://ravegamesearch.pages.dev/search?q={query}' },
        { name: 'Rezi', icon: '🔍', urlPattern: 'https://rezi.one/?q={query}' },
        { name: 'Mr Pc Gamer', icon: '🔍', urlPattern: 'https://mrpcgamer.net/?s={query}' },
        { name: 'Game3rb', icon: '🔍', urlPattern: 'https://game3rb.com/?s={query}' }
            ],
            'Torrents': [
        { name: 'ByXatab', icon: '🌐', urlPattern: 'https://byxatab.com/?s={query}' },
        { name: 'Dodi-Repacks', icon: '🌐', urlPattern: 'https://dodi-repacks.site/?s={query}' },
        { name: 'FreeGOGPCGames', icon: '🌐', urlPattern: 'https://freegogpcgames.com/?s={query}' },
        { name: 'KaosKrew', icon: '🌐', urlPattern: 'https://kaoskrew.org/?s={query}' },
        { name: 'Torrent-Games.games', icon: '🌐', urlPattern: 'https://torrent-games.games/?s={query}' },
        { name: 'Torrent-Games.net', icon: '🌐', urlPattern: 'https://torrent-games.net/?s={query}' },
        { name: 'Appnetica', icon: '🌐', urlPattern: 'https://appnetica.com/search?term={query}' }
            ],
            'Utilities & Trainers': [
        { name: 'FLiNG Trainer', icon: '🔧', urlPattern: 'https://flingtrainer.com/?s={query}' },
        { name: 'GameCopyWorld', icon: '🔧', urlPattern: 'https://gamecopyworld.eu/games/search_results.shtml?q={query}&sa=%C2%A0+Google+Search%C2%A0+' },
        { name: 'MegaGames', icon: '🔧', urlPattern: 'https://megagames.com/results?query={query}' },
        { name: 'MrAntiFun', icon: '🔧', urlPattern: 'https://mrantifun.net/search/16823170/?q={query}&o=date' },
        { name: 'WeMod', icon: '🔧', urlPattern: 'https://www.wemod.com/cheats?q={query}' },
            ]
        }
    };
    // ======================
    // STORAGE MANAGER
    // ======================
    class StorageManager {
        static get(key, defaultValue = null) {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : defaultValue;
            } catch (e) {
                console.warn(`Couldn't load ${key}:`, e);
                return defaultValue;
            }
        }
        static set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn(`Couldn't save ${key}:`, e);
                return false;
            }
        }
    }
    // ======================
    // FAVOURITES MANAGER
    // ======================
    class FavouritesManager {
        constructor() {
            this.favourites = StorageManager.get(CONFIG.storage.FAVOURITES_KEY, []);
        }
        isFavourite(site) {
            return this.favourites.some(fav =>
                fav.name === site.name && fav.urlPattern === site.urlPattern
            );
        }
        toggle(site) {
            const index = this.favourites.findIndex(fav =>
                fav.name === site.name && fav.urlPattern === site.urlPattern
            );
            if (index >= 0) {
                this.favourites.splice(index, 1);
            } else {
                this.favourites.push(site);
            }
            StorageManager.set(CONFIG.storage.FAVOURITES_KEY, this.favourites);
            return this.favourites;
        }
        getAll() {
            const allSites = Object.values(CONFIG.SITE_DEFINITIONS).flat();
            return allSites.filter(site => this.isFavourite(site));
        }
        openAll() {
            const { gameName, appId } = GameInfoExtractor.getGameData();
            const favSites = this.getAll();
            if (favSites.length === 0) {
                NotificationManager.show("No favourite sites selected");
                return;
            }
            if (!confirm(`Open all ${favSites.length} favourite sites?`)) return;
            favSites.forEach(site => {
                SearchManager.performSearch(site, gameName, appId);
            });
        }
    }
    // ======================
    // GAME INFO EXTRACTOR
    // ======================
    class GameInfoExtractor {
        static getAppId() {
            const match = window.location.href.match(/app\/(\d+)/);
            return match ? match[1] : null;
        }
        static getGameName() {
            const url = window.location.href;
            if (url.includes('store.steampowered.com')) {
                const element = document.getElementById('appHubAppName');
                return element ? element.textContent.trim() : '';
            }
            return '';
        }
        static getDeveloper() {
            const url = window.location.href;
            if (url.includes('store.steampowered.com')) {
                const element = document.querySelector('.dev_row a');
                return element ? element.textContent.trim() : '';
            }
            return '';
        }
        static cleanGameName(gameName) {
            return gameName ? gameName.replace(/[™®©]/g, '').replace(/\s+/g, ' ').trim() : gameName;
        }
        static getGameData() {
            const appId = this.getAppId();
            const gameName = this.cleanGameName(this.getGameName());
            const developer = this.getDeveloper();
            return { appId, gameName, developer };
        }
    }
    // ======================
    // SEARCH MANAGER
    // ======================
    class SearchManager {
        static performSearch(site, query, appId) {
            const url = site.urlPattern
                .replace('{query}', encodeURIComponent(query))
                .replace('{appId}', appId || '');
            if (site.special) {
                const handler = SearchHandlers.getHandler(site.special);
                if (handler) {
                    const developer = GameInfoExtractor.getDeveloper();
                    handler(appId, query, developer, (foundUrl) => {
                        window.open(foundUrl, '_blank');
                    });
                    return;
                }
            }
            window.open(url, '_blank');
        }
    }
    // ======================
    // NOTIFICATION MANAGER
    // ======================
    class NotificationManager {
        static show(message, isError = false) {
            const existing = document.getElementById('ngsh-notification');
            if (existing) existing.remove();
            const notification = document.createElement('div');
            notification.id = 'ngsh-notification';
            notification.className = 'ngsh-notification';
            notification.textContent = message;
            notification.style.backgroundColor = isError ? '#ff4444' : 'rgba(0, 0, 0, 0.8)';
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }
    }
    // ======================
    // UI MANAGER
    // ======================
    class UIManager {
        constructor() {
            this.elements = {};
            this.menuVisible = false;
            this.favouritesManager = new FavouritesManager();
        }
        createStyles() {
            GM_addStyle(`
                .ngsh-container {
                    position: fixed;
                    z-index: 99999;
                    font-family: 'Segoe UI', sans-serif;
                    pointer-events: none;
                }
                #ngsh-main-button, #ngsh-quick-access {
                    position: fixed;
                    border-radius: 50%;
                    padding: 0;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: auto;
                    z-index: 100000;
                }
                #ngsh-main-button {
                    right: 20px;
                    bottom: 40px;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.7) 0%, rgba(0, 255, 180, 0.7) 100%);
                    color: #0a0005;
                    border: 1px solid rgba(0, 255, 157, 0.5);
                    font-size: 18px;
                    box-shadow: 0 4px 8px rgba(0, 255, 157, 0.2);
                    width: 48px;
                    height: 48px;
                }
                #ngsh-quick-access {
                    right: 70px;
                    bottom: 10px;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.5) 0%, rgba(0, 255, 180, 0.5) 100%);
                    color: #0a0005;
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0, 255, 157, 0.15);
                    width: 32px;
                    height: 32px;
                }
                #ngsh-main-button:hover, #ngsh-quick-access:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 12px rgba(0, 255, 157, 0.3);
                }
                .ngsh-menu {
                    position: fixed;
                    right: 20px;
                    bottom: 100px;
                    width: 330px;
                    background: ${CONFIG.colors.primary};
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
                    border: 1px solid ${CONFIG.colors.border};
                    backdrop-filter: blur(10px);
                    max-height: 80vh;
                    overflow: hidden;
                    pointer-events: auto;
                    z-index: 99999;
                    display: none;
                    overscroll-behavior: contain;
                }
                .ngsh-menu-header {
                    padding: 12px 20px;
                    color: ${CONFIG.colors.text};
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-bottom: 1px solid ${CONFIG.colors.border};
                    background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 157, 0.1) 100%);
                    flex-shrink: 0;
                }
                .ngsh-site-list {
                    max-height: calc(80vh - 200px);
                    overflow-y: auto;
                    padding: 8px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    overscroll-behavior: contain;
                }
                .ngsh-site-list::-webkit-scrollbar {
                    display: none;
                }
                .ngsh-search-box {
                    padding: 8px 15px;
                    margin: 8px;
                    background: rgba(15, 10, 25, 0.7);
                    border: 1px solid ${CONFIG.colors.border};
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                }
                .ngsh-search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: ${CONFIG.colors.text};
                    font-family: inherit;
                    font-size: 14px;
                    outline: none;
                    padding: 8px 0;
                }
                .ngsh-search-input::placeholder {
                    color: #ff99cc80;
                }
                .ngsh-search-clear, .ngsh-search-icon {
                    color: ${CONFIG.colors.accent};
                    cursor: pointer;
                    font-size: 16px;
                }
                .ngsh-search-clear {
                    margin-left: 8px;
                }
                .ngsh-search-icon {
                    margin-right: 8px;
                }
                .ngsh-folder {
                    margin-bottom: 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: ${CONFIG.colors.folderBg};
                    border: 1px solid ${CONFIG.colors.border};
                    position: relative;
                    z-index: 5;
                }
                .ngsh-folder-header {
                    padding: 12px 15px;
                    display: flex;
                    align-items: center;
                    color: ${CONFIG.colors.text};
                    cursor: pointer;
                    border-bottom: 1px solid rgba(0, 255, 157, 0.1);
                    height: 15px;
                    z-index: 4;
                }
                .ngsh-folder-header:hover {
                    background: rgba(25, 15, 35, 0.7);
                    z-index: 4;
                }
                .ngsh-folder-icon {
                    margin-right: 10px;
                    transition: transform 0.3s ease;
                    font-size: 14px;
                    width: 16px;
                    text-align: center;
                    color: ${CONFIG.colors.accent};
                }
                .ngsh-folder.open .ngsh-folder-icon {
                    transform: rotate(90deg);
                }
                .ngsh-folder-title {
                    font-weight: 600;
                    font-size: 14px;
                    flex: 1;
                }
                .ngsh-folder-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    position: relative;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                }
                .ngsh-folder.open .ngsh-folder-content {
                    max-height: 300px;
                    overflow-y: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .ngsh-folder-content::-webkit-scrollbar {
                    display: none;
                }
                .ngsh-menu-item {
                    padding: 12px 15px 12px 40px;
                    display: flex;
                    align-items: center;
                    color: ${CONFIG.colors.text};
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin: 2px 5px;
                    border-radius: 4px;
                    position: relative;
                }
                .ngsh-menu-item:hover {
                    background: rgba(0, 255, 157, 0.15);
                }
                .ngsh-site-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 10px;
                    color: ${CONFIG.colors.accent};
                    font-size: 16px;
                }
                .ngsh-favourite-icon {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    z-index: 2;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .ngsh-favourite-icon:hover {
                    background: rgba(0, 255, 157, 0.2);
                    border-color: rgba(0, 255, 157, 0.4);
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 2px 8px rgba(0, 255, 157, 0.3);
                }
                .ngsh-game-info {
                    padding: 10px 20px;
                    font-size: 13px;
                    color: #cc88aa;
                    border-top: 1px solid ${CONFIG.colors.border};
                    margin-top: 10px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 0 0 8px 8px;
                }
                .ngsh-open-all {
                    display: flex;
                    align-items: center;
                    padding: 10px 15px;
                    color: ${CONFIG.colors.text};
                    cursor: pointer;
                    background: rgba(0, 0, 0, 0.2);
                    margin: 5px;
                    border-radius: 4px;
                    border: 1px solid ${CONFIG.colors.border};
                }
                .ngsh-open-all:hover {
                    background: rgba(0, 255, 157, 0.15);
                }
                .ngsh-open-all-icon {
                    margin-right: 8px;
                    font-size: 16px;
                }
                .ngsh-notification {
                    position: fixed;
                    bottom: 52px;
                    right: 75px;
                    padding: 10px 15px;
                    border-radius: 4px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: ${CONFIG.colors.text};
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 100000;
                    animation: fadeIn 0.3s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `);
        }
        createElement(tag, className = '', content = '') {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (content) element.textContent = content;
            return element;
        }
        createButtons() {
            // Main button
            this.elements.mainButton = this.createElement('button', '', '⚡');
            this.elements.mainButton.id = 'ngsh-main-button';
            // Quick access button
            this.elements.quickButton = this.createElement('button', '', '💖');
            this.elements.quickButton.id = 'ngsh-quick-access';
            this.elements.quickButton.title = 'Open all favourite sites';
            document.body.appendChild(this.elements.mainButton);
            document.body.appendChild(this.elements.quickButton);
            this.setupButtonEvents();
        }
        createMenu() {
            this.elements.menu = this.createElement('div', 'ngsh-menu');
            // Header
            const header = this.createElement('div', 'ngsh-menu-header', 'Search Hub');
            this.elements.menu.appendChild(header);
            // Site list
            this.elements.siteList = this.createElement('div', 'ngsh-site-list');
            this.elements.menu.appendChild(this.elements.siteList);
            // Search box
            this.createSearchBox();
            document.body.appendChild(this.elements.menu);
        }
        createSearchBox() {
            const searchBox = this.createElement('div', 'ngsh-search-box');
            const searchIcon = this.createElement('span', 'ngsh-search-icon', '🔍');
            const searchInput = this.createElement('input', 'ngsh-search-input');
            const searchClear = this.createElement('span', 'ngsh-search-clear', '✕');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search sites...';
            searchClear.style.display = 'none';
            searchBox.appendChild(searchIcon);
            searchBox.appendChild(searchInput);
            searchBox.appendChild(searchClear);
            this.elements.menu.appendChild(searchBox);
            this.elements.searchInput = searchInput;
            this.elements.searchClear = searchClear;
            this.setupSearchEvents();
        }
        setupButtonEvents() {
            // Main button toggle
            this.elements.mainButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
            // Quick access button
            this.elements.quickButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.favouritesManager.openAll();
            });
            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (this.menuVisible && !this.isMenuRelatedTarget(event.target)) {
                    this.closeMenu();
                }
            });
        }
        setupSearchEvents() {
            this.elements.searchInput.addEventListener('input', () => {
                const query = this.elements.searchInput.value.toLowerCase();
                this.elements.searchClear.style.display = query ? 'block' : 'none';
                this.filterSites(query);
            });
            this.elements.searchClear.addEventListener('click', () => {
                this.elements.searchInput.value = '';
                this.elements.searchClear.style.display = 'none';
                this.filterSites('');
                this.elements.searchInput.focus();
            });
            this.elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.elements.searchInput.blur();
                }
            });
        }
        isMenuRelatedTarget(target) {
            return this.elements.menu.contains(target) ||
                   this.elements.mainButton.contains(target) ||
                   this.elements.quickButton.contains(target);
        }
        toggleMenu() {
            if (this.menuVisible) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
        openMenu() {
            this.menuVisible = true;
            this.elements.menu.style.display = 'block';
            this.elements.searchInput.focus();
            if (!this.elements.menu.hasBuiltContent) {
                this.buildMenuContent();
                this.elements.menu.hasBuiltContent = true;
            }
        }
        closeMenu() {
            this.menuVisible = false;
            this.elements.menu.style.display = 'none';
            this.elements.searchInput.value = '';
            this.elements.searchClear.style.display = 'none';
            this.closeAllFolders();
            // Restore page scrolling when menu closes
            document.body.style.overflowY = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        closeAllFolders() {
            const folders = this.elements.menu.querySelectorAll('.ngsh-folder');
            folders.forEach(folder => {
                folder.classList.remove('open');
                const content = folder.querySelector('.ngsh-folder-content');
                if (content) content.style.maxHeight = '';
            });
        }
        filterSites(query) {
            if (!this.elements.menu.hasBuiltContent) return;
            // Close all folders first if search is cleared
            if (query === '') {
                this.closeAllFolders();
            }
            const folders = this.elements.menu.querySelectorAll('.ngsh-folder');
            let hasVisibleItems = false;
            folders.forEach(folder => {
                const content = folder.querySelector('.ngsh-folder-content');
                const items = content.querySelectorAll('.ngsh-menu-item:not(.ngsh-open-all)');
                let folderHasVisibleItems = false;
                items.forEach(item => {
                    const siteName = item.querySelector('.ngsh-site-name').textContent.toLowerCase();
                    const isVisible = query === '' || siteName.includes(query);
                    item.style.display = isVisible ? 'flex' : 'none';
                    if (isVisible) {
                        folderHasVisibleItems = true;
                        hasVisibleItems = true;
                    }
                });
                // Show/hide folder
                folder.style.display = (query === '' || folderHasVisibleItems) ? 'block' : 'none';
                // Keep Favourites folder visible
                const isFavouritesFolder = folder.querySelector('.ngsh-folder-title').textContent.includes('FAVOURITES');
                if (isFavouritesFolder) {
                    folder.style.display = 'block';
                }
                // Auto-open folders with search results
                if (query !== '' && folderHasVisibleItems) {
                    folder.classList.add('open');
                }
            });
            if (query !== '' && !hasVisibleItems) {
                NotificationManager.show('No sites match your search');
            }
        }
        buildMenuContent() {
            // Clear existing content
            this.elements.siteList.innerHTML = '';
            // Remove existing game info to prevent duplication
            const existingGameInfo = this.elements.menu.querySelector('.ngsh-game-info');
            if (existingGameInfo) existingGameInfo.remove();
            const { appId, gameName, developer } = GameInfoExtractor.getGameData();
            // Add Favourites folder
            const favouriteSites = this.favouritesManager.getAll();
            if (favouriteSites.length > 0) {
                const favouritesFolder = this.createFolder(
                    `FAVOURITES (${favouriteSites.length})`,
                    favouriteSites
                );
                this.elements.siteList.appendChild(favouritesFolder);
            }
            // Add category folders
            Object.entries(CONFIG.SITE_DEFINITIONS).forEach(([category, sites]) => {
                const folder = this.createFolder(category, sites);
                this.elements.siteList.appendChild(folder);
            });
            // Add game info
            if (gameName || appId || developer) {
                const gameInfo = this.createGameInfoSection(gameName, appId, developer);
                this.elements.menu.insertBefore(gameInfo, this.elements.menu.querySelector('.ngsh-search-box'));
            }
        }
        createFolder(title, sites) {
            const folder = this.createElement('div', 'ngsh-folder');
            // Header
            const header = this.createElement('div', 'ngsh-folder-header');
            const icon = this.createElement('div', 'ngsh-folder-icon', '▶');
            const titleElement = this.createElement('div', 'ngsh-folder-title', title);
            header.appendChild(icon);
            header.appendChild(titleElement);

            const content = this.createElement('div', 'ngsh-folder-content');

            // Sort sites: favourites first
            const sortedSites = [...sites].sort((a, b) => {
                const aFav = this.favouritesManager.isFavourite(a);
                const bFav = this.favouritesManager.isFavourite(b);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return 0;
            });

            // Add "Open All" button for favourites folder
            if (title.includes('FAVOURITES')) {
                const openAllItem = this.createElement('div', 'ngsh-open-all');
                openAllItem.innerHTML = `<span class="ngsh-open-all-icon">💖</span><span>Open All Favourites</span>`;
                openAllItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.favouritesManager.openAll();
                });
                content.appendChild(openAllItem);
            }

            // Add site items
            sortedSites.forEach(site => {
                const item = this.createSiteItem(site);
                content.appendChild(item);
            });

            folder.appendChild(header);
            folder.appendChild(content);

            // Toggle functionality
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                folder.classList.toggle('open');
                if (folder.classList.contains('open')) {
                    // Prevent page scrolling when folder is open - keep scrollbar visible
                    document.body.style.overflowY = 'scroll';
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                } else {
                    // Allow page scrolling when folder closes
                    document.body.style.overflowY = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            });

            return folder;
        }
        createSiteItem(site) {
            const item = this.createElement('div', 'ngsh-menu-item');
            const icon = this.createElement('div', 'ngsh-site-icon', site.icon || '🔍');
            const label = this.createElement('div', 'ngsh-site-name', site.name);
            const favourite = this.createElement('div', 'ngsh-favourite-icon');
            label.style.flex = '1';
            const isFav = this.favouritesManager.isFavourite(site);
            favourite.className = `ngsh-favourite-icon ${isFav ? 'favourited' : ''}`;
            favourite.textContent = isFav ? '❤' : '🖤';
            favourite.style.color = isFav ? CONFIG.colors.favourite : CONFIG.colors.nonFavourite;
            // Site click handler
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const { gameName, appId } = GameInfoExtractor.getGameData();
                SearchManager.performSearch(site, gameName, appId);
            });
            // Favourite toggle handler
            favourite.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleFavouriteToggle(site, favourite);
            });
            item.appendChild(icon);
            item.appendChild(label);
            item.appendChild(favourite);
            return item;
        }
        handleFavouriteToggle(site, favouriteIcon) {
            this.favouritesManager.toggle(site);
            const isFav = this.favouritesManager.isFavourite(site);
            favouriteIcon.className = `ngsh-favourite-icon ${isFav ? 'favourited' : ''}`;
            favouriteIcon.textContent = isFav ? '❤' : '🖤';
            favouriteIcon.style.color = isFav ? CONFIG.colors.favourite : CONFIG.colors.nonFavourite;
            // Update favourites folder count and content without rebuilding everything
            this.updateFavouritesFolder();
            // Re-sort the current folder to move favourites to top
            this.resortCurrentFolder(site);
            NotificationManager.show(isFav
                ? `Added to favourites: ${site.name}`
                : `Removed from favourites: ${site.name}`);
        }
        updateFavouritesFolder() {
            const favouriteSites = this.favouritesManager.getAll();
            const existingFavFolder = [...this.elements.siteList.children]
                .find(folder => folder.querySelector('.ngsh-folder-title').textContent.includes('FAVOURITES'));
            if (favouriteSites.length > 0) {
                if (existingFavFolder) {
                    // Completely rebuild the folder to avoid any leftover elements
                    existingFavFolder.remove();
                    const newFavouritesFolder = this.createFolder(
                        `FAVOURITES (${favouriteSites.length})`,
                        favouriteSites
                    );
                    this.elements.siteList.insertBefore(newFavouritesFolder, this.elements.siteList.firstChild);
                } else {
                    // Create new favourites folder and add it at the top
                    const favouritesFolder = this.createFolder(
                        `FAVOURITES (${favouriteSites.length})`,
                        favouriteSites
                    );
                    this.elements.siteList.insertBefore(favouritesFolder, this.elements.siteList.firstChild);
                }
            } else if (existingFavFolder) {
                // Remove favourites folder if no favourites
                existingFavFolder.remove();
            }

            // Update heart icons in all other folders
            this.updateAllHeartIcons();
        }

        updateAllHeartIcons() {
            // Update heart icons in all folders to reflect current favorite status
            const folders = this.elements.siteList.querySelectorAll('.ngsh-folder');
            folders.forEach(folder => {
                const folderTitle = folder.querySelector('.ngsh-folder-title').textContent;
                if (folderTitle.includes('FAVOURITES')) return; // Skip favourites folder

                const items = folder.querySelectorAll('.ngsh-menu-item:not(.ngsh-open-all)');
                items.forEach(item => {
                    const siteName = item.querySelector('.ngsh-site-name').textContent;
                    const site = this.findSiteByName(siteName);
                    const heartIcon = item.querySelector('.ngsh-favourite-icon');

                    if (site && heartIcon) {
                        const isFav = this.favouritesManager.isFavourite(site);
                        heartIcon.textContent = isFav ? '❤' : '🖤';
                        heartIcon.style.color = isFav ? CONFIG.colors.favourite : CONFIG.colors.nonFavourite;
                    }
                });
            });
        }

        resortCurrentFolder(site) {
            // Find the folder containing this site (not the favourites folder)
            const folders = this.elements.siteList.querySelectorAll('.ngsh-folder');
            folders.forEach(folder => {
                const folderTitle = folder.querySelector('.ngsh-folder-title').textContent;
                if (folderTitle.includes('FAVOURITES')) return; // Skip favourites folder
                // Check if this folder contains the site
                const items = folder.querySelectorAll('.ngsh-menu-item:not(.ngsh-open-all)');
                const siteItem = [...items].find(item =>
                    item.querySelector('.ngsh-site-name').textContent === site.name
                );
                if (siteItem) {
                    // Re-sort this folder's items
                    const content = folder.querySelector('.ngsh-folder-content');
                    const allItems = [...content.querySelectorAll('.ngsh-menu-item:not(.ngsh-open-all)')];
                    // Sort: favourites first
                    allItems.sort((a, b) => {
                        const aName = a.querySelector('.ngsh-site-name').textContent;
                        const bName = b.querySelector('.ngsh-site-name').textContent;
                        const aSite = this.findSiteByName(aName);
                        const bSite = this.findSiteByName(bName);
                        const aFav = aSite && this.favouritesManager.isFavourite(aSite);
                        const bFav = bSite && this.favouritesManager.isFavourite(bSite);
                        if (aFav && !bFav) return -1;
                        if (!aFav && bFav) return 1;
                        return 0;
                    });
                    // Remove all items and re-add in sorted order
                    allItems.forEach(item => item.remove());
                    allItems.forEach(item => content.appendChild(item));
                }
            });
        }
        findSiteByName(name) {
            const allSites = Object.values(CONFIG.SITE_DEFINITIONS).flat();
            return allSites.find(site => site.name === name);
        }
        createGameInfoSection(gameName, appId, developer) {
            const section = this.createElement('div', 'ngsh-game-info');
            if (gameName) {
                const nameEl = this.createElement('div', '', `${gameName}`);
                nameEl.style.marginBottom = '4px';
                section.appendChild(nameEl);
            }
            if (appId) {
                section.appendChild(this.createElement('div', '', `App ID: ${appId}`));
            }
            if (developer) {
                section.appendChild(this.createElement('div', '', `Developer: ${developer}`));
            }
            return section;
        }
        init() {
            if (document.querySelector('.ngsh-container')) return;
            this.createStyles();
            this.createButtons();
            this.createMenu();

            // Set up page scroll lock when hovering over menu - keep scrollbar visible
            this.elements.menu.addEventListener('mouseenter', () => {
                document.body.style.overflowY = 'scroll';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            });

            this.elements.menu.addEventListener('mouseleave', () => {
                document.body.style.overflowY = '';
                document.body.style.position = '';
                document.body.style.width = '';
            });
        }
    }
    // ======================
    // INITIALIZATION
    // ======================
    function init() {
        const ui = new UIManager();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ui.init());
        } else {
            ui.init();
        }
    }
    init();
})();