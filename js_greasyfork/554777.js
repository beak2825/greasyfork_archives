// ==UserScript==
// @name         Torn Quick-Travel (Radial Menu)
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  Advanced radial navigation with modular search, API integration, mini-apps, and enhanced calibration
// @author       Sensimillia (2168012)
// @match        https://www.torn.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554777/Torn%20Quick-Travel%20%28Radial%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554777/Torn%20Quick-Travel%20%28Radial%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== DEBUG MODE ====================
    const DEBUG = false;
    const log = DEBUG ? console.log.bind(console, '[TornRadial]') : () => {};

    // ==================== NOTIFICATION THROTTLER ====================
    class NotificationThrottler {
        constructor() {
            this.lastNotifications = new Map();
            this.throttleTime = 2000; // 2 seconds minimum between same notifications
            this.maxPerMinute = 10;
            this.notificationCount = 0;
            this.resetInterval = null;
            
            this.resetInterval = setInterval(() => {
                this.notificationCount = 0;
            }, 60000);
        }

        canShow(message) {
            if (this.notificationCount >= this.maxPerMinute) {
                log('Notification throttled: rate limit reached');
                return false;
            }

            const now = Date.now();
            const lastTime = this.lastNotifications.get(message);
            
            if (lastTime && (now - lastTime) < this.throttleTime) {
                log('Notification throttled: too soon', message);
                return false;
            }

            this.lastNotifications.set(message, now);
            this.notificationCount++;
            return true;
        }

        destroy() {
            if (this.resetInterval) {
                clearInterval(this.resetInterval);
            }
        }
    }

    const NotificationManager = new NotificationThrottler();

    // ==================== ERROR LOGGER CLASS ====================
    class ErrorLoggerClass {
        constructor() {
            this.logs = [];
            this.maxLogs = 100;
            this.loadLogs();
        }

        log(type, message, error = null) {
            const entry = {
                timestamp: new Date().toISOString(),
                type: type,
                message: message,
                error: error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : null,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`
            };
            
            this.logs.push(entry);
            if (this.logs.length > this.maxLogs) this.logs.shift();
            
            try {
                localStorage.setItem('tornRadialErrorLogs', JSON.stringify(this.logs));
            } catch(e) {
                console.error('Failed to save error logs:', e);
            }
            
            console.error(`[Torn Radial] ${type.toUpperCase()}: ${message}`, error);
        }

        loadLogs() {
            try {
                const stored = localStorage.getItem('tornRadialErrorLogs');
                if (stored) this.logs = JSON.parse(stored);
            } catch(e) {
                console.error('Failed to load error logs:', e);
            }
        }

        getLogs() {
            return this.logs;
        }

        clear() {
            this.logs = [];
            try {
                localStorage.removeItem('tornRadialErrorLogs');
            } catch(e) {
                console.error('Failed to clear error logs:', e);
            }
        }

        exportLogs() {
            const logsText = JSON.stringify(this.logs, null, 2);
            const blob = new Blob([logsText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `torn-radial-errors-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    const ErrorLogger = new ErrorLoggerClass();

    // ==================== STORAGE MANAGER CLASS ====================
    class StorageManager {
        get(key, defaultValue) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                ErrorLogger.log('error', `Error reading ${key} from localStorage`, e);
                return defaultValue;
            }
        }

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                ErrorLogger.log('error', `Error saving ${key} to localStorage`, e);
                return false;
            }
        }

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                ErrorLogger.log('error', `Error removing ${key} from localStorage`, e);
                return false;
            }
        }

        exportAll() {
            const data = {
                settings: this.get('tornRadialSettings', {}),
                loadouts: this.get('tornRadialLoadouts', {}),
                position: this.get('tornRadialPosition', {}),
                positionMobile: this.get('tornRadialPositionMobile', {}),
                usageStats: this.get('tornRadialUsageStats', {}),
                timers: this.get('tornRadialTimers', []),
                notes: this.get('tornRadialNotes', ''),
                searchHistory: this.get('tornRadialSearchHistory', []),
                calibration: this.get('tornRadialCalibration', {}),
                calibrationMobile: this.get('tornRadialCalibrationMobile', {})
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `torn-radial-backup-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        importAll(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                if (data.settings) this.set('tornRadialSettings', data.settings);
                if (data.loadouts) this.set('tornRadialLoadouts', data.loadouts);
                if (data.position) this.set('tornRadialPosition', data.position);
                if (data.positionMobile) this.set('tornRadialPositionMobile', data.positionMobile);
                if (data.usageStats) this.set('tornRadialUsageStats', data.usageStats);
                if (data.timers) this.set('tornRadialTimers', data.timers);
                if (data.notes) this.set('tornRadialNotes', data.notes);
                if (data.searchHistory) this.set('tornRadialSearchHistory', data.searchHistory);
                if (data.calibration) this.set('tornRadialCalibration', data.calibration);
                if (data.calibrationMobile) this.set('tornRadialCalibrationMobile', data.calibrationMobile);
                return true;
            } catch (e) {
                ErrorLogger.log('error', 'Failed to import data', e);
                return false;
            }
        }
    }

    const Storage = new StorageManager();

    // ==================== DEVICE DETECTION ====================
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isPDA = window.innerWidth < 768;

    // ==================== TORN API HANDLER CLASS ====================
    class TornAPI {
    constructor() {
        this.baseUrl = 'https://api.torn.com';
        this.apiKey = Storage.get('tornRadialApiKey', '');
    }

    setApiKey(key) {
        this.apiKey = key;
        Storage.set('tornRadialApiKey', key);
    }

    async request(endpoint) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'undefined') {
                reject(new Error('GM_xmlhttpRequest not available'));
                return;
            }

            // Ensure endpoint starts with /
            if (!endpoint.startsWith('/')) {
                endpoint = '/' + endpoint;
            }

            // Add key parameter correctly
            const separator = endpoint.includes('?') ? '&' : '?';
            const fullUrl = `${this.baseUrl}${endpoint}${separator}key=${this.apiKey}`;

            log('API Request:', fullUrl.replace(this.apiKey, 'KEY_HIDDEN'));

            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(new Error(data.error.error || 'API Error'));
                        } else {
                            resolve(data);
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse API response: ' + e.message));
                    }
                },
                onerror: (error) => reject(new Error('Network error: ' + error.message)),
                ontimeout: () => reject(new Error('API request timed out'))
            });
        });
    }

    async getUserInfo(userId) {
        return this.request(`/user/${userId}?selections=profile,timestamp`);
    }

    async getBars() {
        return this.request(`/user/?selections=bars`);
    }

    async getCooldowns() {
        return this.request(`/user/?selections=cooldowns`);
    }
}

const API = new TornAPI();

    // ==================== SEARCH HANDLER CLASS ====================
    class SearchHandler {
    constructor() {
        this.history = Storage.get('tornRadialSearchHistory', []);
        this.maxHistory = 20;
    }

    addToHistory(query, url, type) {
        const entry = {
            query: query,
            url: url,
            type: type,
            timestamp: Date.now()
        };

        this.history = this.history.filter(h => h.query !== query);
        this.history.unshift(entry);
        this.history = this.history.slice(0, this.maxHistory);
        Storage.set('tornRadialSearchHistory', this.history);
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        Storage.set('tornRadialSearchHistory', []);
    }

    // ----- REPLACE the old search(query) method with this one -----
    async search(query) {
    const results = {
        players: [],
        items: [],
        pages: [],
        factions: [],
        companies: []
    };

    if (!query || typeof query !== 'string') return results;
    const raw = query.trim();
    if (!raw) return results;
    const queryLower = raw.toLowerCase();

    // ------ PLAYER SEARCH ------
    if (/^\d+$/.test(raw)) {
        // Direct player ID
        results.players.push({
            name: `View Profile: ${raw}`,
            url: `/profiles.php?XID=${raw}`,
            icon: '👤',
            type: 'player'
        });
    } else if (raw.length >= 3) {
        // Player name search - use Torn's search page
        results.players.push({
            name: `Search Players: "${raw}"`,
            url: `/profiles.php?XID=${encodeURIComponent(raw)}`,
            icon: '👤',
            type: 'player'
        });
    }

    // ------ FACTION SEARCH ------
    if (/^\d+$/.test(raw)) {
        results.factions.push({
            name: `Faction Profile: ${raw}`,
            url: `/factions.php?step=profile&ID=${raw}`,
            icon: '⚔️',
            type: 'faction'
        });
    } else if (raw.length >= 3) {
        results.factions.push({
            name: `Search Factions: "${raw}"`,
            url: `/factions.php?step=profile&ID=${encodeURIComponent(raw)}`,
            icon: '⚔️',
            type: 'faction'
        });
    }

    // ------ COMPANY SEARCH ------
    if (/^\d+$/.test(raw)) {
        results.companies.push({
            name: `Company Profile: ${raw}`,
            url: `/companies.php?step=profile&ID=${raw}`,
            icon: '🏢',
            type: 'company'
        });
    } else if (raw.length >= 3) {
        results.companies.push({
            name: `Search Companies: "${raw}"`,
            url: `/joblist.php#/p=corplist&cat=all&name=${encodeURIComponent(raw)}`,
            icon: '🏢',
            type: 'company'
        });
    }

    // ------ ITEM MARKET SEARCH ------
    if (raw.length >= 2) {
        // Modern item market
        results.items.push({
            name: `Search Item Market: "${raw}"`,
            url: `/imarket.php#/p=shop&step=shop&type=&searchname=${encodeURIComponent(raw)}`,
            icon: '🛒',
            type: 'item'
        });
        
        // Also add Points Market search if it looks like an item
        results.items.push({
            name: `Search Points Market: "${raw}"`,
            url: `/pmarket.php`,
            icon: '⭐',
            type: 'item'
        });
    }

    // ------ FORUM SEARCH ------
    if (raw.length >= 3) {
        results.pages.push({
            name: `Search Forums: "${raw}"`,
            url: `/forums.php#/p=forums&f=&t=&b=&a=&start=0&sub=0&q=${encodeURIComponent(raw)}`,
            icon: '💭',
            type: 'page'
        });
    }

    // ------ COMMON PAGES (keyword matching) ------
    const pageMatches = [
        { keywords: ['gym', 'train', 'stat'], name: 'Gym', url: '/gym.php', icon: '💪' },
        { keywords: ['travel', 'fly', 'airport', 'abroad'], name: 'Travel Agency', url: '/travelagency.php', icon: '✈️' },
        { keywords: ['item', 'inventory', 'inv'], name: 'Items', url: '/item.php', icon: '🎒' },
        { keywords: ['bazaar', 'baz', 'shop'], name: 'Bazaar', url: '/bazaar.php', icon: '🏪' },
        { keywords: ['display', 'cabinet', 'trophy', 'case'], name: 'Display Cabinet', url: '/displaycase.php', icon: '🏆' },
        { keywords: ['faction', 'fac'], name: 'Your Faction', url: '/factions.php?step=your', icon: '⚔️' },
        { keywords: ['crime', 'oc', 'organized'], name: 'Crimes', url: '/crimes.php', icon: '🔫' },
        { keywords: ['hospital', 'hosp', 'revive'], name: 'Hospital', url: '/hospital.php', icon: '🏥' },
        { keywords: ['mission', 'duke'], name: 'Missions', url: '/loader.php?sid=missions', icon: '🎯' },
        { keywords: ['auction'], name: 'Auctions', url: '/auctions.php', icon: '🔨' },
        { keywords: ['message', 'mail', 'inbox'], name: 'Messages', url: '/messages.php', icon: '💬' },
        { keywords: ['event', 'log'], name: 'Events', url: '/events.php', icon: '📅' },
        { keywords: ['forum', 'forums'], name: 'Forums', url: '/forums.php', icon: '💭' },
        { keywords: ['city', 'map'], name: 'City', url: '/city.php', icon: '🏙️' },
        { keywords: ['company', 'job', 'work'], name: 'Job Listings', url: '/joblist.php', icon: '🏢' },
        { keywords: ['property', 'properties', 'home', 'house'], name: 'Property', url: '/properties.php', icon: '🏘️' },
        { keywords: ['attack', 'fight'], name: 'Attack', url: '/loader.php?sid=attack', icon: '⚡' },
        { keywords: ['bounty', 'bounties'], name: 'Bounties', url: '/bounties.php', icon: '💀' },
        { keywords: ['war', 'rankedwar', 'rw'], name: 'War', url: '/war.php', icon: '💣' },
        { keywords: ['jail', 'prison', 'bust'], name: 'Jail', url: '/jailview.php', icon: '🔒' },
        { keywords: ['newspaper', 'news'], name: 'Newspaper', url: '/newspaper.php', icon: '📰' },
        { keywords: ['home', 'index'], name: 'Home', url: '/index.php', icon: '🏠' },
        { keywords: ['points', 'refill'], name: 'Points Market', url: '/pmarket.php', icon: '⭐' },
        { keywords: ['race', 'racing', 'track'], name: 'Racing', url: '/loader.php?sid=racing', icon: '🏎️' },
        { keywords: ['casino', 'gamble'], name: 'Casino', url: '/loader.php?sid=casino', icon: '🎰' },
        { keywords: ['education', 'school', 'course'], name: 'Education', url: '/education.php', icon: '📚' },
        { keywords: ['trade'], name: 'Trade', url: '/trade.php', icon: '🤝' },
        { keywords: ['bank', 'vault', 'money'], name: 'Bank', url: '/bank.php', icon: '🏦' },
        { keywords: ['stock', 'stocks', 'exchange'], name: 'Stock Exchange', url: '/stockexchange.php', icon: '📈' },
        { keywords: ['church', 'marry'], name: 'Church', url: '/church.php', icon: '⛪' },
        { keywords: ['museum'], name: 'Museum', url: '/museum.php', icon: '🏛️' },
        { keywords: ['hall', 'fame'], name: 'Hall of Fame', url: '/halloffame.php', icon: '🏆' },
        { keywords: ['competition', 'comp'], name: 'Competitions', url: '/competition.php', icon: '🎯' },
        { keywords: ['recruit', 'recruitment'], name: 'Recruitment', url: '/forums.php#/p=forums&f=11', icon: '📣' },
        { keywords: ['trade', 'trading'], name: 'Trading Forums', url: '/forums.php#/p=forums&f=8', icon: '💱' },
        { keywords: ['bazaar', 'market'], name: 'My Bazaar', url: '/bazaar.php#/p=shop', icon: '🏪' }
    ];

    // Only add page matches if query matches keywords
    pageMatches.forEach(match => {
        if (match.keywords.some(k => queryLower.includes(k) || k.includes(queryLower))) {
            // Avoid duplicates
            if (!results.pages.find(p => p.url === match.url)) {
                results.pages.push({
                    name: match.name,
                    url: match.url,
                    icon: match.icon,
                    type: 'page'
                });
            }
        }
    });

    return results;
}
}

// Initialise the global search manager AFTER the class definition
const SearchManager = new SearchHandler();

    // ==================== DYNAMIC THEME SYSTEM ====================
    const THEMES = {
        torn: {
            name: 'Torn',
            modalBg: 'rgba(27, 27, 27, 0.98)',
            modalHeaderBg: 'rgba(36, 36, 36, 0.95)',
            modalFooterBg: 'rgba(34, 34, 34, 0.95)',
            sectionBg: 'rgba(36, 36, 36, 0.8)',
            inputBg: 'rgba(51, 51, 51, 0.9)',
            textColor: '#d0d0d0',
            textSecondary: '#9b9b9b',
            borderColor: 'rgba(51, 51, 51, 0.5)',
            mainBtnBg: 'rgba(36, 36, 36, 0.95)',
            mainBtnBorder: 'rgba(74, 163, 223, 0.3)',
            primaryColor: '#4aa3df',
            accentGradient: 'linear-gradient(135deg, #4aa3df 0%, #66baff 100%)',
            dangerColor: '#a33a3a',
            successColor: '#3ea34a'
        },
        light: {
            name: 'Light',
            modalBg: 'rgba(255, 255, 255, 0.95)',
            modalHeaderBg: 'rgba(255, 255, 255, 0.5)',
            modalFooterBg: 'rgba(249, 249, 249, 0.8)',
            sectionBg: 'rgba(255, 255, 255, 0.7)',
            inputBg: 'rgba(120, 120, 128, 0.12)',
            textColor: '#000',
            textSecondary: '#666',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            mainBtnBg: 'rgba(255, 255, 255, 0.95)',
            mainBtnBorder: 'rgba(0, 0, 0, 0.04)',
            primaryColor: '#007AFF',
            accentGradient: 'linear-gradient(135deg, #FF2D55 0%, #FF375F 100%)',
            dangerColor: '#FF3B30',
            successColor: '#34C759'
        },
        dark: {
            name: 'Dark',
            modalBg: 'rgba(28, 28, 30, 0.95)',
            modalHeaderBg: 'rgba(44, 44, 46, 0.5)',
            modalFooterBg: 'rgba(20, 20, 22, 0.8)',
            sectionBg: 'rgba(44, 44, 46, 0.7)',
            inputBg: 'rgba(255, 255, 255, 0.1)',
            textColor: '#FFFFFF',
            textSecondary: '#9b9b9b',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            mainBtnBg: 'rgba(44, 44, 46, 0.95)',
            mainBtnBorder: 'rgba(255, 255, 255, 0.08)',
            primaryColor: '#0A84FF',
            accentGradient: 'linear-gradient(135deg, #FF453A 0%, #FF375F 100%)',
            dangerColor: '#FF453A',
            successColor: '#32D74B'
        },
        cyberpunk: {
            name: 'Cyberpunk',
            modalBg: 'rgba(10, 10, 15, 0.98)',
            modalHeaderBg: 'rgba(20, 20, 30, 0.95)',
            modalFooterBg: 'rgba(15, 15, 20, 0.95)',
            sectionBg: 'rgba(25, 25, 35, 0.8)',
            inputBg: 'rgba(35, 35, 50, 0.9)',
            textColor: '#00ff9f',
            textSecondary: '#7b68ee',
            borderColor: 'rgba(0, 255, 159, 0.3)',
            mainBtnBg: 'rgba(20, 20, 30, 0.95)',
            mainBtnBorder: 'rgba(255, 0, 255, 0.5)',
            primaryColor: '#ff00ff',
            accentGradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            dangerColor: '#ff0080',
            successColor: '#00ff9f'
        },
        ocean: {
            name: 'Ocean',
            modalBg: 'rgba(15, 25, 40, 0.98)',
            modalHeaderBg: 'rgba(20, 35, 55, 0.95)',
            modalFooterBg: 'rgba(10, 20, 35, 0.95)',
            sectionBg: 'rgba(25, 40, 60, 0.8)',
            inputBg: 'rgba(30, 50, 75, 0.9)',
            textColor: '#e0f4ff',
            textSecondary: '#6fa8dc',
            borderColor: 'rgba(79, 195, 247, 0.3)',
            mainBtnBg: 'rgba(20, 35, 55, 0.95)',
            mainBtnBorder: 'rgba(79, 195, 247, 0.5)',
            primaryColor: '#4fc3f7',
            accentGradient: 'linear-gradient(135deg, #0288d1 0%, #26c6da 100%)',
            dangerColor: '#ff6e40',
            successColor: '#69f0ae'
        },
        sunset: {
            name: 'Sunset',
            modalBg: 'rgba(40, 20, 30, 0.98)',
            modalHeaderBg: 'rgba(60, 30, 45, 0.95)',
            modalFooterBg: 'rgba(35, 15, 25, 0.95)',
            sectionBg: 'rgba(55, 25, 40, 0.8)',
            inputBg: 'rgba(70, 35, 50, 0.9)',
            textColor: '#ffe0b2',
            textSecondary: '#ffab91',
            borderColor: 'rgba(255, 138, 101, 0.3)',
            mainBtnBg: 'rgba(60, 30, 45, 0.95)',
            mainBtnBorder: 'rgba(255, 138, 101, 0.5)',
            primaryColor: '#ff8a65',
            accentGradient: 'linear-gradient(135deg, #ff6f00 0%, #ff9100 100%)',
            dangerColor: '#d50000',
            successColor: '#76ff03'
        },
        neonNoir: {
            name: 'Neon Noir',
            modalBg: 'rgba(10, 10, 15, 0.98)',
            modalHeaderBg: 'rgba(20, 20, 25, 0.95)',
            modalFooterBg: 'rgba(15, 15, 20, 0.9)',
            sectionBg: 'rgba(25, 25, 30, 0.8)',
            inputBg: 'rgba(40, 40, 50, 0.9)',
            textColor: '#c0c0ff',
            textSecondary: '#8080ff',
            borderColor: 'rgba(120, 120, 255, 0.3)',
            mainBtnBg: 'rgba(20, 20, 25, 0.95)',
            mainBtnBorder: 'rgba(120, 120, 255, 0.4)',
            primaryColor: '#9b59b6',
            accentGradient: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
            dangerColor: '#e74c3c',
            successColor: '#2ecc71'
        },
        bloodline: {
            name: 'Bloodline',
            modalBg: 'rgba(15, 10, 10, 0.98)',
            modalHeaderBg: 'rgba(25, 15, 15, 0.95)',
            modalFooterBg: 'rgba(20, 10, 10, 0.9)',
            sectionBg: 'rgba(35, 20, 20, 0.8)',
            inputBg: 'rgba(45, 25, 25, 0.9)',
            textColor: '#f0b0b0',
            textSecondary: '#c07070',
            borderColor: 'rgba(255, 80, 80, 0.3)',
            mainBtnBg: 'rgba(30, 15, 15, 0.95)',
            mainBtnBorder: 'rgba(255, 0, 0, 0.4)',
            primaryColor: '#e63946',
            accentGradient: 'linear-gradient(135deg, #b71c1c 0%, #f44336 100%)',
            dangerColor: '#ff5252',
            successColor: '#81c784'
        },
        stealth: {
            name: 'Stealth',
            modalBg: 'rgba(8, 8, 8, 0.98)',
            modalHeaderBg: 'rgba(12, 12, 12, 0.95)',
            modalFooterBg: 'rgba(10, 10, 10, 0.9)',
            sectionBg: 'rgba(15, 15, 15, 0.8)',
            inputBg: 'rgba(25, 25, 25, 0.9)',
            textColor: '#c0c0c0',
            textSecondary: '#888',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            mainBtnBg: 'rgba(18, 18, 18, 0.95)',
            mainBtnBorder: 'rgba(255, 255, 255, 0.1)',
            primaryColor: '#4a90e2',
            accentGradient: 'linear-gradient(135deg, #4a90e2 0%, #00bcd4 100%)',
            dangerColor: '#f44336',
            successColor: '#4caf50'
        },
        terminal: {
            name: 'Terminal',
            modalBg: 'rgba(5, 10, 5, 0.98)',
            modalHeaderBg: 'rgba(10, 15, 10, 0.95)',
            modalFooterBg: 'rgba(8, 12, 8, 0.9)',
            sectionBg: 'rgba(12, 20, 12, 0.8)',
            inputBg: 'rgba(20, 30, 20, 0.9)',
            textColor: '#00ff00',
            textSecondary: '#66ff66',
            borderColor: 'rgba(0, 255, 0, 0.3)',
            mainBtnBg: 'rgba(10, 20, 10, 0.95)',
            mainBtnBorder: 'rgba(0, 255, 0, 0.4)',
            primaryColor: '#00ff66',
            accentGradient: 'linear-gradient(135deg, #00cc00 0%, #00ff99 100%)',
            dangerColor: '#ff0033',
            successColor: '#33ff00'
        }
    };

    function getThemeNames() {
        return Object.keys(THEMES);
    }

    function getTheme(themeName) {
        return THEMES[themeName] || THEMES.torn;
    }
    
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
                { name: 'Bounties', url: '/bounties.php', icon: '💀', color: '#9b9b9b' },
                { name: 'Attacks', url: '/attacks.php', icon: '⚡', color: '#a33a3a' },
                { name: 'Attack Log', url: '/attacklog.php', icon: '📜', color: '#9b9b9b' }
            ]
        },
        'travel': {
            name: 'Travel',
            links: [
                { name: 'Travel', url: '/travel.php', icon: '✈️', color: '#4aa3df' },
                { name: 'Home', url: '/index.php', icon: '🏠', color: '#4aa3df' },
                { name: 'Items', url: '/item.php', icon: '🎒', color: '#3ea34a' },
                { name: 'Bazaar', url: '/bazaar.php', icon: '🏪', color: '#3ea34a' },
                { name: 'City', url: '/city.php', icon: '🏙️', color: '#66baff' },
                { name: 'Laptop', url: '/pc.php', icon: '💻', color: '#9b9b9b' }
            ]
        },
        'social': {
            name: 'Social',
            links: [
                { name: 'Messages', url: '/messages.php', icon: '💬', color: '#4aa3df' },
                { name: 'Events', url: '/events.php', icon: '📅', color: '#66baff' },
                { name: 'Forums', url: '/forums.php', icon: '💭', color: '#9b9b9b' },
                { name: 'Friends', url: '/friends.php', icon: '👥', color: '#3ea34a' },
                { name: 'Faction', url: '/factions.php', icon: '⚔️', color: '#66baff' },
                { name: 'Company', url: '/companies.php', icon: '🏢', color: '#9b9b9b' }
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
        screenCalibrationMobile: null,
        apiKey: ''
    });

    settings = {
        layout: settings.layout || 'circular',
        iconSize: settings.iconSize || 'medium',
        currentLoadout: settings.currentLoadout || 'default',
        theme: settings.theme || 'torn',
        notifications: settings.notifications || { enabled: true },
        screenCalibration: settings.screenCalibration || null,
        screenCalibrationMobile: settings.screenCalibrationMobile || null,
        apiKey: settings.apiKey || ''
    };

    if (settings.apiKey) {
        API.setApiKey(settings.apiKey);
    }

    let loadouts = Storage.get('tornRadialLoadouts', DEFAULT_LOADOUTS);
    let usageStats = Storage.get('tornRadialUsageStats', {});
    let timers = Storage.get('tornRadialTimers', []);

    if (!loadouts || typeof loadouts !== 'object') {
        ErrorLogger.log('error', 'Invalid loadouts structure, restoring defaults');
        loadouts = { ...DEFAULT_LOADOUTS };
    }

    if (!loadouts[settings.currentLoadout]) {
        ErrorLogger.log('error', `Loadout ${settings.currentLoadout} not found, switching to default`);
        settings.currentLoadout = 'default';
        if (!loadouts['default']) {
            loadouts['default'] = DEFAULT_LOADOUTS['default'];
        }
    }

    // Generate favorites
    function generateFavoritesLoadout() {
        const sorted = Object.entries(usageStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([url]) => {
                for (const loadout of Object.values(loadouts)) {
                    const link = loadout.links?.find(l => l.url === url);
                    if (link) return link;
                }
                return null;
            })
            .filter(Boolean);

        if (sorted.length > 0) {
            loadouts['favorites'] = {
                name: '⭐ Favorites',
                links: sorted
            };
        }
    }

    generateFavoritesLoadout();

    let links = [];
    try {
        links = loadouts[settings.currentLoadout]?.links || [...DEFAULT_LINKS];
        links = links.map((link, i) => ({
            name: link?.name || 'Unnamed',
            url: link?.url || '/index.php',
            icon: link?.icon || '🔗',
            color: link?.color || DEFAULT_LINKS[i]?.color || '#4aa3df'
        }));
    } catch (e) {
        ErrorLogger.log('error', 'Error loading links from loadout', e);
        links = [...DEFAULT_LINKS];
    }

    let isOpen = false;
    let isDragging = false;
    let isAnimating = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    let startX, startY, hasMoved = false;
    let calibrationMode = false;
    let calibrationStep = 0;
    let selectedSearchIndex = 0;

    // ==================== POSITION MANAGEMENT ====================
    function getSafeInitialPosition() {
        const padding = 100;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        return {
            x: Math.max(padding, Math.min(centerX, window.innerWidth - padding)),
            y: Math.max(padding, Math.min(centerY, window.innerHeight - padding))
        };
    }

    // Load position based on device type
    const positionKey = isPDA ? 'tornRadialPositionMobile' : 'tornRadialPosition';
    const savedPos = Storage.get(positionKey, getSafeInitialPosition());

    // ==================== SIZE CONFIGURATIONS ====================
    const sizeConfig = {
        pda: { main: 32, radial: 28, fontSize: 14, radialFont: 12, radius: 65, spacing: 14, maxPerRow: 7 },
        small: { main: 52, radial: 42, fontSize: 20, radialFont: 18, radius: 90, spacing: 16, maxPerRow: 9 },
        medium: { main: 64, radial: 52, fontSize: 28, radialFont: 24, radius: 110, spacing: 16, maxPerRow: 10 },
        large: { main: 76, radial: 62, fontSize: 34, radialFont: 28, radius: 130, spacing: 16, maxPerRow: 12 }
    };

    let currentSize = sizeConfig[settings.iconSize] || sizeConfig.medium;
    const currentTheme = getTheme(settings.theme);

    // ==================== HELPER FUNCTIONS ====================
    function adjustBrightness(color, percent) {
        if (!color || typeof color !== 'string' || !color.startsWith('#')) return '#4aa3df';
        try {
            const num = parseInt(color.replace('#', ''), 16);
            if (isNaN(num)) return '#4aa3df';
            
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, Math.max(0, (num >> 16) + amt));
            const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
            const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
            return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
        } catch(e) {
            ErrorLogger.log('error', 'Color adjustment failed', e);
            return '#4aa3df';
        }
    }

    function showNotification(message, duration = 3000) {
        if (!NotificationManager.canShow(message)) {
            return;
        }

        try {
            const notification = document.createElement('div');
            notification.className = 'torn-radial-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transition = 'all 0.3s ease-out';
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        } catch(e) {
            ErrorLogger.log('error', 'Failed to show notification', e);
        }
    }

    function trackUsage(url) {
        try {
            if (!usageStats[url]) usageStats[url] = 0;
            usageStats[url]++;
            Storage.set('tornRadialUsageStats', usageStats);
            
            if (Object.keys(usageStats).length >= 8) {
                generateFavoritesLoadout();
                Storage.set('tornRadialLoadouts', loadouts);
            }
        } catch(e) {
            ErrorLogger.log('error', 'Failed to track usage', e);
        }
    }

    function calculatePosition(index, total, layout) {
        try {
            const radius = currentSize?.radius || 110;
            const spacing = currentSize?.spacing || 16;
            const maxPerRow = currentSize?.maxPerRow || 8;
            let x = 0, y = 0;

            switch(layout) {
                case 'horizontal': {
                    const isLeftSide = (savedPos?.x || 50) < window.innerWidth / 2;
                    const isTopHalf = (savedPos?.y || 50) < window.innerHeight / 2;
                    
                    const row = Math.floor(index / maxPerRow);
                    const posInRow = index % maxPerRow;
                    
                    x = isLeftSide ? 
                        (posInRow + 1) * (currentSize.radial + spacing) : 
                        -(posInRow + 1) * (currentSize.radial + spacing);
                    
                    const rowOffset = (currentSize.radial + spacing) * 0.8;
                    y = isTopHalf ? 
                        row * rowOffset : 
                        -row * rowOffset;
                    break;
                }
                case 'vertical': {
                    const isTopHalf = (savedPos?.y || 50) < window.innerHeight / 2;
                    const isLeftSide = (savedPos?.x || 50) < window.innerWidth / 2;
                    
                    const col = Math.floor(index / maxPerRow);
                    const posInCol = index % maxPerRow;
                    
                    y = isTopHalf ? 
                        (posInCol + 1) * (currentSize.radial + spacing) : 
                        -(posInCol + 1) * (currentSize.radial + spacing);
                    
                    const colOffset = (currentSize.radial + spacing) * 0.8;
                    x = isLeftSide ? 
                        col * colOffset : 
                        -col * colOffset;
                    break;
                }
                case 'circular':
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
        } catch(e) {
            ErrorLogger.log('error', 'Position calculation failed', e);
            return { x: 0, y: 0 };
        }
    }

    // Enhanced bounds checking with device-specific calibration
    function checkBounds(pos) {
    try {
        // Don't run bounds checking constantly - only when menu opens
        if (!isOpen) return;
        
        const menuX = savedPos.x;
        const menuY = savedPos.y;
        const buttonRadius = currentSize.radial / 2;
        
        const itemX = menuX + pos.x;
        const itemY = menuY + pos.y;
        
        // Get calibration based on device type
        const calibration = isPDA ? settings.screenCalibrationMobile : settings.screenCalibration;
        
        let bounds;
        if (calibration) {
            bounds = {
                left: calibration.topLeft.x + buttonRadius,
                right: calibration.bottomRight.x - buttonRadius,
                top: calibration.topLeft.y + buttonRadius,
                bottom: calibration.bottomRight.y - buttonRadius
            };
        } else {
            // Default safe bounds
            bounds = {
                left: 50 + buttonRadius,
                right: window.innerWidth - 100 - buttonRadius,
                top: 50 + buttonRadius,
                bottom: window.innerHeight - 50 - buttonRadius
            };
        }
        
        // Check if item is outside bounds
        const isOutside = itemX < bounds.left || itemX > bounds.right || 
                         itemY < bounds.top || itemY > bounds.bottom;
        
        if (isOutside) {
            log('Item outside bounds detected');
            // Just log it, don't auto-reposition to avoid loops
        }
    } catch(e) {
        ErrorLogger.log('error', 'Failed to check bounds', e);
    }
}

    // PDA responsive scaling
    function getResponsiveSize(baseSize) {
        if (isPDA) {
            return Math.round(baseSize * 0.8);
        }
        return baseSize;
    }

    function getResponsiveFontSize(baseFontSize) {
        if (isPDA) {
            return Math.round(baseFontSize * 0.85);
        }
        return baseFontSize;
    }
    
    // ==================== CSS INJECTION ====================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');

        * {
            font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', sans-serif;
        }

        #torn-radial-container {
            position: fixed;
            left: ${savedPos.x}px;
            top: ${savedPos.y}px;
            z-index: 999999;
            pointer-events: none;
            transform-origin: center center;
        }

        #torn-radial-btn {
            width: ${currentSize.main}px;
            height: ${currentSize.main}px;
            border-radius: 50%;
            background: ${currentTheme.mainBtnBg};
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border: 2px solid ${currentTheme.mainBtnBorder};
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 
                0 12px 48px rgba(0, 0, 0, 0.15),
                0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${currentSize.fontSize}px;
            user-select: none;
            position: relative;
            color: ${currentTheme.primaryColor};
        }

        #torn-radial-btn:active {
            transform: scale(0.92);
        }

        #torn-radial-btn:hover {
            transform: scale(1.05);
            box-shadow: 
                0 16px 56px rgba(0, 0, 0, 0.2),
                0 4px 12px rgba(0, 0, 0, 0.1),
                0 0 0 4px ${currentTheme.primaryColor}33;
            animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 4px ${currentTheme.primaryColor}33; }
            50% { box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 8px ${currentTheme.primaryColor}55; }
        }

        #torn-radial-btn.dragging {
            cursor: grabbing;
            transform: scale(1.1);
            box-shadow: 
                0 20px 64px rgba(0, 0, 0, 0.25),
                0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .radial-item {
            position: absolute;
            width: ${currentSize.radial}px;
            height: ${currentSize.radial}px;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${currentSize.radialFont}px;
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.2),
                0 2px 6px rgba(0, 0, 0, 0.12);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 0;
            transform: scale(0);
            text-decoration: none;
            left: ${(currentSize.main - currentSize.radial) / 2}px;
            top: ${(currentSize.main - currentSize.radial) / 2}px;
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            will-change: transform, opacity;
        }

        .radial-item::before {
            content: attr(title);
            position: absolute;
            bottom: -36px;
            left: 50%;
            transform: translateX(-50%) scale(0);
            background: rgba(0, 0, 0, 0.92);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            color: white;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: ${isPDA ? '10px' : '12px'};
            font-weight: 600;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            letter-spacing: 0.3px;
            z-index: 100;
        }

        .radial-item:hover::before {
            opacity: 1;
            transform: translateX(-50%) scale(1);
            bottom: -40px;
        }

        .radial-item:active {
            transform: scale(0.85) !important;
        }

        .radial-item:hover {
            transform: scale(1.15) !important;
            box-shadow: 
                0 12px 32px rgba(0, 0, 0, 0.25),
                0 4px 8px rgba(0, 0, 0, 0.15);
            z-index: 10;
        }

        .radial-item.open {
            opacity: 1;
        }

        .radial-item.settings {
            background: linear-gradient(135deg, #8E8E93 0%, #636366 100%);
        }

        .radial-item.search-icon {
            background: ${currentTheme.accentGradient};
        }

        .radial-item.calculator {
            background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
        }

        .radial-item.mini-apps {
            background: linear-gradient(135deg, ${currentTheme.successColor} 0%, #2FB350 100%);
        }

        /* Search Overlay (fixed version) */
#torn-radial-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    z-index: 1000001;
    animation: fadeIn 0.3s ease;
}
#torn-radial-search-overlay.show {
    display: flex;
}
.search-container {
    background: ${currentTheme.modalBg};
    border-radius: ${isPDA ? '16px' : '20px'};
    padding: ${isPDA ? '20px' : '30px'};
    max-width: ${isPDA ? '95%' : '700px'};
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
}
#torn-radial-search-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid ${currentTheme.borderColor};
    border-radius: 8px;
    background: ${currentTheme.inputBg};
    color: ${currentTheme.textColor};
    outline: none;
    margin-bottom: 12px;
}
#torn-radial-search-results {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.search-result-item {
    background: ${currentTheme.sectionBg};
    color: ${currentTheme.textColor};
    border: 1px solid ${currentTheme.borderColor};
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background 0.2s ease;
}
.search-result-item:hover {
    background: ${currentTheme.mainBtnBg};
}

        .search-container {
            background: ${currentTheme.modalBg};
            border-radius: ${isPDA ? '16px' : '20px'};
            padding: ${isPDA ? '20px' : '30px'};
            max-width: ${isPDA ? '95%' : '700px'};
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
        }

        .radial-search-container h2 {
            margin: 0 0 ${isPDA ? '16px' : '20px'} 0;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '18px' : '24px'};
        }

        .search-input-wrapper {
            position: relative;
            margin-bottom: ${isPDA ? '16px' : '20px'};
        }

        .search-input {
            width: 100%;
            padding: ${isPDA ? '12px 16px' : '16px 20px'};
            border: 2px solid ${currentTheme.borderColor};
            border-radius: ${isPDA ? '10px' : '12px'};
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '14px' : '16px'};
            transition: all 0.2s ease;
        }

        .radial-search-input:focus {
            outline: none;
            border-color: ${currentTheme.primaryColor};
            box-shadow: 0 0 0 4px ${currentTheme.primaryColor}26;
        }

        .search-results {
            max-height: 400px;
            overflow-y: auto;
        }

        .search-category {
            margin: ${isPDA ? '16px 0' : '20px 0'};
        }

        .search-category-title {
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 600;
            color: ${currentTheme.textSecondary};
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .search-result-item {
            padding: ${isPDA ? '10px 12px' : '12px 16px'};
            background: ${currentTheme.sectionBg};
            margin: 8px 0;
            border-radius: ${isPDA ? '8px' : '10px'};
            cursor: pointer;
            transition: all 0.2s ease;
            color: ${currentTheme.textColor};
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: ${isPDA ? '13px' : '14px'};
        }

        .radial-search-result-item.selected {
            background: ${currentTheme.primaryColor};
            color: white;
        }

        .radial-search-result-item:hover {
            background: ${currentTheme.primaryColor};
            color: white;
            transform: translateX(4px);
        }

        .radial-search-history {
            margin-top: ${isPDA ? '16px' : '20px'};
            padding-top: ${isPDA ? '16px' : '20px'};
            border-top: 1px solid ${currentTheme.borderColor};
        }

        .search-history-title {
            font-size: ${isPDA ? '11px' : '12px'};
            color: ${currentTheme.textSecondary};
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .search-clear-history {
            background: none;
            border: none;
            color: ${currentTheme.dangerColor};
            cursor: pointer;
            font-size: ${isPDA ? '10px' : '11px'};
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .radial-search-clear-history:hover {
            background: rgba(163, 58, 58, 0.2);
        }

        .search-no-results {
            text-align: center;
            padding: ${isPDA ? '30px 16px' : '40px 20px'};
            color: ${currentTheme.textSecondary};
            font-size: ${isPDA ? '13px' : '14px'};
        }

        /* Calculator */
        #torn-radial-calculator {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            z-index: 1000001;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
            padding: 20px;
        }

        #torn-radial-calculator.show {
            display: flex;
        }

        .calculator-container {
            background: ${currentTheme.modalBg};
            border-radius: ${isPDA ? '16px' : '20px'};
            padding: 0;
            max-width: ${isPDA ? '95%' : '400px'};
            width: 100%;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }

        .calculator-header {
            padding: ${isPDA ? '16px 20px' : '20px 24px'};
            border-bottom: 1px solid ${currentTheme.borderColor};
            background: ${currentTheme.modalHeaderBg};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .calculator-header h2 {
            margin: 0;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '16px' : '20px'};
        }

        .calculator-display {
            padding: ${isPDA ? '20px 16px' : '30px 20px'};
            background: ${currentTheme.sectionBg};
            text-align: right;
            font-size: ${isPDA ? '28px' : '36px'};
            font-weight: 300;
            color: ${currentTheme.textColor};
            min-height: ${isPDA ? '60px' : '80px'};
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }

        .calculator-buttons {
            padding: ${isPDA ? '16px' : '20px'};
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: ${isPDA ? '8px' : '12px'};
        }

        .calc-btn {
            padding: ${isPDA ? '16px' : '20px'};
            border: none;
            border-radius: ${isPDA ? '10px' : '12px'};
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '16px' : '18px'};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .calc-btn:hover {
            background: ${currentTheme.borderColor};
            transform: scale(1.05);
        }

        .calc-btn:active {
            transform: scale(0.95);
        }

        .calc-btn.operator {
            background: ${currentTheme.primaryColor};
            color: white;
        }

        .calc-btn.equals {
            background: ${currentTheme.successColor};
            color: white;
            grid-column: span 2;
        }

        .calc-btn.clear {
            background: ${currentTheme.dangerColor};
            color: white;
        }

        /* Mini Apps Overlay */
        #torn-radial-mini-apps {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            z-index: 1000001;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
            padding: 20px;
            overflow-y: auto;
        }

        #torn-radial-mini-apps.show {
            display: flex;
        }

        .mini-apps-container {
            background: ${currentTheme.modalBg};
            border-radius: ${isPDA ? '16px' : '20px'};
            padding: 0;
            max-width: ${isPDA ? '95%' : '800px'};
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
        }

        .mini-apps-header {
            padding: ${isPDA ? '16px 20px' : '20px 24px'};
            border-bottom: 1px solid ${currentTheme.borderColor};
            background: ${currentTheme.modalHeaderBg};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mini-apps-header h2 {
            margin: 0;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '18px' : '22px'};
        }

        .mini-apps-body {
            padding: ${isPDA ? '16px' : '24px'};
            overflow-y: auto;
            flex: 1;
        }

        .mini-app-section {
            background: ${currentTheme.sectionBg};
            padding: ${isPDA ? '16px' : '20px'};
            margin-bottom: ${isPDA ? '16px' : '20px'};
            border-radius: ${isPDA ? '12px' : '14px'};
            border: 1px solid ${currentTheme.borderColor};
        }

        .mini-app-section h3 {
            margin: 0 0 ${isPDA ? '12px' : '16px'} 0;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '16px' : '18px'};
        }

        .timer-item {
            background: ${currentTheme.inputBg};
            padding: ${isPDA ? '10px 12px' : '12px 16px'};
            margin: 8px 0;
            border-radius: ${isPDA ? '8px' : '10px'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '13px' : '14px'};
        }

        .timer-controls {
            display: flex;
            gap: 8px;
        }

        .timer-btn {
            padding: ${isPDA ? '5px 10px' : '6px 12px'};
            border: none;
            border-radius: ${isPDA ? '6px' : '8px'};
            background: ${currentTheme.primaryColor};
            color: white;
            font-size: ${isPDA ? '11px' : '12px'};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .timer-btn:hover {
            opacity: 0.8;
        }

        .timer-btn.danger {
            background: ${currentTheme.dangerColor};
        }

        /* API Monitor Section */
        .api-bars {
            display: grid;
            grid-template-columns: repeat(${isPDA ? '1' : '2'}, 1fr);
            gap: ${isPDA ? '10px' : '12px'};
        }

        .api-bar {
            background: ${currentTheme.inputBg};
            padding: ${isPDA ? '10px' : '12px'};
            border-radius: ${isPDA ? '8px' : '10px'};
        }

        .api-bar-label {
            font-size: ${isPDA ? '11px' : '12px'};
            color: ${currentTheme.textSecondary};
            margin-bottom: 4px;
        }

        .api-bar-value {
            font-size: ${isPDA ? '16px' : '18px'};
            font-weight: 600;
            color: ${currentTheme.textColor};
        }

        .api-bar-progress {
            height: 4px;
            background: ${currentTheme.borderColor};
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }

        .api-bar-progress-fill {
            height: 100%;
            background: ${currentTheme.primaryColor};
            transition: width 0.3s ease;
        }

        /* Calibration Overlay */
        #torn-radial-calibration {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000002;
            cursor: crosshair;
        }

        #torn-radial-calibration.show {
            display: block;
        }

        .calibration-instruction {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${currentTheme.modalBg};
            padding: ${isPDA ? '20px 30px' : '30px 40px'};
            border-radius: ${isPDA ? '16px' : '20px'};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '18px' : '24px'};
            font-weight: 600;
            text-align: center;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
            pointer-events: none;
            max-width: ${isPDA ? '80%' : 'none'};
        }

        .calibration-point {
            position: absolute;
            width: ${isPDA ? '16px' : '20px'};
            height: ${isPDA ? '16px' : '20px'};
            background: ${currentTheme.primaryColor};
            border: 3px solid white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
        }

        .calibration-cancel {
            position: fixed;
            bottom: ${isPDA ? '20px' : '40px'};
            left: 50%;
            transform: translateX(-50%);
            padding: ${isPDA ? '10px 20px' : '12px 24px'};
            background: ${currentTheme.dangerColor};
            color: white;
            border: none;
            border-radius: ${isPDA ? '10px' : '12px'};
            font-size: ${isPDA ? '14px' : '16px'};
            font-weight: 600;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
    /* Settings Modal - Tabbed Interface */
        #torn-radial-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            z-index: 1000000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: ${isPDA ? '10px' : '20px'};
            overflow-y: auto;
        }

        #torn-radial-modal.show {
            display: flex;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-content {
            background: ${currentTheme.modalBg};
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-radius: ${isPDA ? '16px' : '20px'};
            padding: 0;
            max-width: ${isPDA ? '100%' : '800px'};
            width: 100%;
            max-height: ${isPDA ? '95vh' : '90vh'};
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 
                0 32px 64px rgba(0, 0, 0, 0.25),
                0 0 0 0.5px ${currentTheme.borderColor};
            color: ${currentTheme.textColor};
            animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            margin: auto;
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: ${isPDA ? '12px 16px' : '16px 24px'};
            border-bottom: 0.5px solid ${currentTheme.borderColor};
            background: ${currentTheme.modalHeaderBg};
            flex-shrink: 0;
        }

        .modal-header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
        }

        .modal-content h2 {
            margin: 0;
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '16px' : '20px'};
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .error-log-btn {
            width: ${isPDA ? '26px' : '32px'};
            height: ${isPDA ? '26px' : '32px'};
            border-radius: 50%;
            background: ${currentTheme.inputBg};
            border: none;
            font-size: ${isPDA ? '13px' : '16px'};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            margin-right: 8px;
        }

        .error-log-btn:hover {
            background: rgba(255, 152, 0, 0.2);
            transform: scale(1.05);
        }

        .modal-close {
            width: ${isPDA ? '26px' : '32px'};
            height: ${isPDA ? '26px' : '32px'};
            border-radius: 50%;
            background: ${currentTheme.inputBg};
            border: none;
            color: ${currentTheme.textSecondary};
            font-size: ${isPDA ? '16px' : '20px'};
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .modal-close:hover {
            background: ${currentTheme.dangerColor};
            color: white;
        }

        .modal-close:active {
            transform: scale(0.9);
        }

        /* Tab Navigation */
        .modal-tabs {
            display: flex;
            padding: ${isPDA ? '8px 12px' : '12px 16px'};
            background: ${currentTheme.modalHeaderBg};
            border-bottom: 1px solid ${currentTheme.borderColor};
            gap: ${isPDA ? '4px' : '8px'};
            overflow-x: auto;
            flex-shrink: 0;
        }

        .modal-tab {
            padding: ${isPDA ? '6px 12px' : '8px 16px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            background: transparent;
            color: ${currentTheme.textSecondary};
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .modal-tab:hover {
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
        }

        .modal-tab.active {
            background: ${currentTheme.primaryColor};
            color: white;
            box-shadow: 0 2px 8px ${currentTheme.primaryColor}33;
        }

        .modal-body {
            padding: ${isPDA ? '12px 16px' : '20px 24px'};
            overflow-y: auto;
            flex: 1;
            min-height: 0;
        }

        .modal-body::-webkit-scrollbar {
            width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: transparent;
        }

        .modal-body::-webkit-scrollbar-thumb {
            background: rgba(74, 163, 223, 0.3);
            border-radius: 10px;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        .loadout-selector {
            background: ${currentTheme.sectionBg};
            padding: ${isPDA ? '12px' : '16px'};
            margin-bottom: ${isPDA ? '12px' : '16px'};
            border-radius: ${isPDA ? '12px' : '14px'};
            border: 0.5px solid ${currentTheme.borderColor};
        }

        .loadout-selector h3 {
            margin: 0 0 ${isPDA ? '10px' : '12px'} 0;
            font-size: ${isPDA ? '14px' : '16px'};
            font-weight: 600;
            color: ${currentTheme.textColor};
        }

        .loadout-tabs {
            display: flex;
            gap: ${isPDA ? '6px' : '8px'};
            flex-wrap: wrap;
            margin-bottom: ${isPDA ? '10px' : '12px'};
        }

        .loadout-tab {
            padding: ${isPDA ? '6px 10px' : '8px 14px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '11px' : '13px'};
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .loadout-tab.active {
            background: ${currentTheme.primaryColor};
            color: white;
            box-shadow: 0 2px 8px ${currentTheme.primaryColor}33;
        }

        .loadout-tab:hover:not(.active) {
            background: ${currentTheme.borderColor};
        }

        .loadout-actions {
            display: grid;
            grid-template-columns: repeat(${isPDA ? '1' : '3'}, 1fr);
            gap: ${isPDA ? '6px' : '8px'};
            margin-top: ${isPDA ? '10px' : '12px'};
        }

        .loadout-actions button {
            padding: ${isPDA ? '8px 12px' : '10px 16px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            background: rgba(62, 163, 74, 0.2);
            color: ${currentTheme.successColor};
            font-size: ${isPDA ? '11px' : '13px'};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .loadout-actions button:hover {
            background: rgba(62, 163, 74, 0.3);
        }

        .loadout-actions button.delete {
            background: rgba(163, 58, 58, 0.2);
            color: ${currentTheme.dangerColor};
        }

        .loadout-actions button.delete:hover {
            background: rgba(163, 58, 58, 0.3);
        }

        .settings-section {
            background: ${currentTheme.sectionBg};
            padding: ${isPDA ? '12px' : '16px'};
            margin-bottom: ${isPDA ? '12px' : '16px'};
            border-radius: ${isPDA ? '12px' : '14px'};
            border: 0.5px solid ${currentTheme.borderColor};
        }

        .settings-section h3 {
            margin: 0 0 ${isPDA ? '10px' : '14px'} 0;
            font-size: ${isPDA ? '14px' : '16px'};
            font-weight: 600;
            color: ${currentTheme.textColor};
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: ${isPDA ? '8px 0' : '12px 0'};
            gap: ${isPDA ? '8px' : '12px'};
            flex-wrap: ${isPDA ? 'wrap' : 'nowrap'};
        }

        .setting-item label {
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 500;
            color: ${currentTheme.textColor};
            flex: ${isPDA ? '1 1 100%' : '1'};
        }

        .setting-item select,
        .setting-item input[type="text"],
        .setting-item input[type="password"] {
            padding: ${isPDA ? '8px 10px' : '10px 12px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: ${isPDA ? '100%' : '140px'};
        }

        .setting-item input[type="checkbox"] {
            width: ${isPDA ? '18px' : '20px'};
            height: ${isPDA ? '18px' : '20px'};
            min-width: ${isPDA ? '18px' : '20px'};
            cursor: pointer;
        }

        .setting-item select:focus,
        .setting-item input[type="text"]:focus,
        .setting-item input[type="password"]:focus {
            outline: none;
            border: 2px solid ${currentTheme.primaryColor};
            box-shadow: 0 0 0 4px ${currentTheme.primaryColor}26;
        }

        .link-item {
            background: ${currentTheme.sectionBg};
            padding: ${isPDA ? '10px' : '14px'};
            margin: ${isPDA ? '8px 0' : '12px 0'};
            border-radius: ${isPDA ? '12px' : '14px'};
            display: grid;
            grid-template-columns: ${isPDA ? '36px 1fr' : '50px 1fr 1fr 50px 40px 80px'};
            gap: ${isPDA ? '8px' : '10px'};
            align-items: center;
            border: 0.5px solid ${currentTheme.borderColor};
            transition: all 0.2s ease;
        }

        .link-item:hover {
            background: ${currentTheme.inputBg};
            transform: translateX(2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .link-item input {
            padding: ${isPDA ? '8px' : '10px 12px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .link-item input:focus {
            outline: none;
            border: 2px solid ${currentTheme.primaryColor};
            box-shadow: 0 0 0 4px ${currentTheme.primaryColor}26;
        }

        .link-item input:first-child {
            text-align: center;
            font-size: ${isPDA ? '16px' : '20px'};
            padding: ${isPDA ? '8px' : '10px'};
        }

        ${isPDA ? `
        .link-item input:nth-child(2),
        .link-item input:nth-child(3) {
            grid-column: span 2;
        }
        
        .link-item .color-picker-wrapper,
        .link-item .delete-btn,
        .link-item .reorder-controls {
            grid-column: span 1;
        }
        ` : ''}

        .color-picker-wrapper {
            position: relative;
        }

        .color-picker {
            width: ${isPDA ? '36px' : '50px'};
            height: ${isPDA ? '34px' : '42px'};
            border-radius: ${isPDA ? '8px' : '10px'};
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .color-picker::-webkit-color-swatch-wrapper {
            padding: 4px;
        }

        .color-picker::-webkit-color-swatch {
            border: none;
            border-radius: ${isPDA ? '6px' : '8px'};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .delete-btn {
            width: ${isPDA ? '34px' : '40px'};
            height: ${isPDA ? '34px' : '40px'};
            border: none;
            border-radius: ${isPDA ? '8px' : '10px'};
            cursor: pointer;
            background: rgba(163, 58, 58, 0.2);
            color: ${currentTheme.dangerColor};
            font-size: ${isPDA ? '14px' : '18px'};
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-btn:hover {
            background: rgba(163, 58, 58, 0.3);
            transform: scale(1.05);
        }

        .delete-btn:active {
            transform: scale(0.95);
        }

        .reorder-controls {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .reorder-btn {
            width: ${isPDA ? '34px' : '36px'};
            height: ${isPDA ? '15px' : '18px'};
            border: none;
            border-radius: ${isPDA ? '5px' : '6px'};
            cursor: pointer;
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
            font-size: ${isPDA ? '10px' : '12px'};
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .reorder-btn:hover:not(:disabled) {
            background: ${currentTheme.primaryColor};
            color: white;
            transform: scale(1.05);
        }

        .reorder-btn:active:not(:disabled) {
            transform: scale(0.95);
        }

        .reorder-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .modal-footer {
            padding: ${isPDA ? '10px 12px' : '14px 20px'};
            border-top: 0.5px solid ${currentTheme.borderColor};
            background: ${currentTheme.modalFooterBg};
            display: grid;
            grid-template-columns: ${isPDA ? '1fr' : 'repeat(2, 1fr)'};
            gap: ${isPDA ? '8px' : '10px'};
            flex-shrink: 0;
        }

        .modal-footer button {
            padding: ${isPDA ? '10px 14px' : '12px 18px'};
            border: none;
            border-radius: ${isPDA ? '10px' : '12px'};
            cursor: pointer;
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 600;
            transition: all 0.2s ease;
            letter-spacing: -0.2px;
        }

        .modal-footer button:active {
            transform: scale(0.96);
        }

        .btn-primary {
            background: ${currentTheme.primaryColor};
            color: white;
            box-shadow: 0 4px 12px ${currentTheme.primaryColor}4D;
        }

        .btn-primary:hover {
            opacity: 0.9;
            box-shadow: 0 6px 16px ${currentTheme.primaryColor}66;
        }

        .btn-secondary {
            background: ${currentTheme.inputBg};
            color: ${currentTheme.textColor};
        }

        .btn-secondary:hover {
            opacity: 0.8;
        }

        .btn-success {
            background: ${currentTheme.successColor};
            color: white;
            box-shadow: 0 4px 12px rgba(62, 163, 74, 0.3);
        }

        .btn-success:hover {
            opacity: 0.9;
            box-shadow: 0 6px 16px rgba(62, 163, 74, 0.4);
        }

        .btn-coffee {
            background: ${currentTheme.accentGradient};
            color: white;
            box-shadow: 0 4px 12px ${currentTheme.primaryColor}33;
            grid-column: ${isPDA ? 'span 1' : 'span 2'};
        }

        .btn-coffee:hover {
            opacity: 0.9;
            box-shadow: 0 6px 16px ${currentTheme.primaryColor}66;
        }

        .btn-calibrate {
            background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
            color: white;
        }

        .btn-calibrate:hover {
            opacity: 0.9;
        }

        .add-current-page-btn {
            background: ${currentTheme.successColor};
            color: white;
            padding: ${isPDA ? '10px 16px' : '12px 20px'};
            border: none;
            border-radius: ${isPDA ? '10px' : '12px'};
            cursor: pointer;
            font-weight: 600;
            font-size: ${isPDA ? '12px' : '14px'};
            width: 100%;
            margin-bottom: ${isPDA ? '10px' : '12px'};
            transition: all 0.2s ease;
        }

        .add-current-page-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        /* About Section Styles */
        .about-section {
            background: ${currentTheme.sectionBg};
            padding: ${isPDA ? '16px' : '20px'};
            margin-bottom: ${isPDA ? '12px' : '16px'};
            border-radius: ${isPDA ? '12px' : '14px'};
            border: 0.5px solid ${currentTheme.borderColor};
        }

        .about-section h3 {
            margin: 0 0 ${isPDA ? '12px' : '16px'} 0;
            font-size: ${isPDA ? '16px' : '18px'};
            font-weight: 600;
            color: ${currentTheme.textColor};
        }

        .about-section p {
            margin: ${isPDA ? '8px 0' : '10px 0'};
            font-size: ${isPDA ? '12px' : '14px'};
            color: ${currentTheme.textSecondary};
            line-height: 1.6;
        }

        .about-section ul {
            margin: ${isPDA ? '8px 0' : '12px 0'};
            padding-left: ${isPDA ? '20px' : '24px'};
        }

        .about-section li {
            margin: ${isPDA ? '6px 0' : '8px 0'};
            font-size: ${isPDA ? '12px' : '14px'};
            color: ${currentTheme.textSecondary};
            line-height: 1.5;
        }

        .version-badge {
            display: inline-block;
            background: ${currentTheme.primaryColor};
            color: white;
            padding: ${isPDA ? '4px 8px' : '4px 12px'};
            border-radius: ${isPDA ? '6px' : '8px'};
            font-size: ${isPDA ? '11px' : '12px'};
            font-weight: 600;
            margin-bottom: ${isPDA ? '8px' : '12px'};
        }

        /* Donators Section */
        .donators-list {
            display: grid;
            grid-template-columns: repeat(${isPDA ? '1' : '2'}, 1fr);
            gap: ${isPDA ? '8px' : '12px'};
            margin-top: ${isPDA ? '12px' : '16px'};
        }

        .donator-item {
            background: ${currentTheme.inputBg};
            padding: ${isPDA ? '10px 12px' : '12px 16px'};
            border-radius: ${isPDA ? '8px' : '10px'};
            display: flex;
            align-items: center;
            gap: ${isPDA ? '8px' : '12px'};
            transition: all 0.2s ease;
        }

        .donator-item:hover {
            background: ${currentTheme.borderColor};
            transform: translateX(2px);
        }

        .donator-icon {
            font-size: ${isPDA ? '20px' : '24px'};
        }

        .donator-info {
            flex: 1;
        }

        .donator-name {
            font-size: ${isPDA ? '13px' : '14px'};
            font-weight: 600;
            color: ${currentTheme.textColor};
        }

        .donator-amount {
            font-size: ${isPDA ? '11px' : '12px'};
            color: ${currentTheme.textSecondary};
        }

        /* Notification Toast */
        .torn-radial-notification {
            position: fixed;
            top: ${isPDA ? '10px' : '20px'};
            right: ${isPDA ? '10px' : '20px'};
            background: ${currentTheme.modalBg};
            border: 2px solid ${currentTheme.primaryColor};
            color: ${currentTheme.textColor};
            padding: ${isPDA ? '12px 16px' : '16px 24px'};
            border-radius: ${isPDA ? '10px' : '12px'};
            font-size: ${isPDA ? '12px' : '14px'};
            font-weight: 600;
            z-index: 9999999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            animation: slideInRight 0.3s ease-out;
            max-width: ${isPDA ? '80%' : '400px'};
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ==================== CREATE RADIAL ITEMS ====================
    const container = document.createElement('div');
    container.id = 'torn-radial-container';
    document.body.appendChild(container);

    const btn = document.createElement('div');
    btn.id = 'torn-radial-btn';
    btn.innerHTML = '⚡';
    btn.title = 'Quick Travel Menu';
    container.appendChild(btn);

    function createRadialItems() {
        try {
            const existingItems = document.querySelectorAll('.radial-item');
            existingItems.forEach(el => {
                try {
                    el.remove();
                } catch(e) {
                    ErrorLogger.log('warning', 'Failed to remove existing item', e);
                }
            });

            if (!Array.isArray(links) || links.length === 0) {
                ErrorLogger.log('error', 'No links available to create');
                return;
            }

            // 3 extra items: search, calculator, mini-apps, settings (search now has icon)
            const total = links.length + 4;

            // Create link items
            links.forEach((link, i) => {
                try {
                    const pos = calculatePosition(i, total, settings.layout);

                    const item = document.createElement('a');
                    item.className = 'radial-item';
                    item.href = link.url || '/index.php';
                    item.innerHTML = link.icon || '🔗';
                    item.title = link.name || 'Unnamed';
                    item.style.background = `linear-gradient(135deg, ${link.color || '#4aa3df'} 0%, ${adjustBrightness(link.color || '#4aa3df', -20)} 100%)`;
                    item.dataset.x = pos.x;
                    item.dataset.y = pos.y;
                    
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        trackUsage(link.url);
                        window.location.href = link.url;
                    });
                    
                    container.appendChild(item);
                    checkBounds(pos);
                } catch(e) {
                    ErrorLogger.log('error', `Failed to create link ${i}: ${link.name}`, e);
                }
            });

            // Search button (NOW HAS ITS OWN ICON!)
            try {
                const pos = calculatePosition(links.length, total, settings.layout);
                const searchItem = document.createElement('div');
                searchItem.className = 'radial-item search-icon';
                searchItem.innerHTML = '👀';
                searchItem.title = 'Search';
                searchItem.dataset.x = pos.x;
                searchItem.dataset.y = pos.y;
                searchItem.addEventListener('click', openSearch);
                container.appendChild(searchItem);
                checkBounds(pos);
            } catch(e) {
                ErrorLogger.log('error', 'Failed to create search button', e);
            }

            // Calculator button
            try {
                const pos = calculatePosition(links.length + 1, total, settings.layout);
                const calcItem = document.createElement('div');
                calcItem.className = 'radial-item calculator';
                calcItem.innerHTML = '🔢';
                calcItem.title = 'Calculator';
                calcItem.dataset.x = pos.x;
                calcItem.dataset.y = pos.y;
                calcItem.addEventListener('click', openCalculator);
                container.appendChild(calcItem);
                checkBounds(pos);
            } catch(e) {
                ErrorLogger.log('error', 'Failed to create calculator button', e);
            }

            // Mini-apps button
            try {
                const pos = calculatePosition(links.length + 2, total, settings.layout);
                const miniAppsItem = document.createElement('div');
                miniAppsItem.className = 'radial-item mini-apps';
                miniAppsItem.innerHTML = '🛠️';
                miniAppsItem.title = 'Mini Apps';
                miniAppsItem.dataset.x = pos.x;
                miniAppsItem.dataset.y = pos.y;
                miniAppsItem.addEventListener('click', openMiniApps);
                container.appendChild(miniAppsItem);
                checkBounds(pos);
            } catch(e) {
                ErrorLogger.log('error', 'Failed to create mini-apps button', e);
            }

            // Settings button
            try {
                const pos = calculatePosition(links.length + 3, total, settings.layout);
                const settingsItem = document.createElement('div');
                settingsItem.className = 'radial-item settings';
                settingsItem.innerHTML = '⚙️';
                settingsItem.title = 'Settings';
                settingsItem.dataset.x = pos.x;
                settingsItem.dataset.y = pos.y;
                settingsItem.addEventListener('click', openSettings);
                container.appendChild(settingsItem);
                checkBounds(pos);
            } catch(e) {
                ErrorLogger.log('error', 'Failed to create settings button', e);
            }
        } catch(e) {
            ErrorLogger.log('error', 'Fatal error in createRadialItems', e);
        }
    }

    createRadialItems();

    // ==================== MENU TOGGLE ====================
    function toggleMenu(e) {
        if (isDragging || isAnimating) return;
        
        try {
            isAnimating = true;
            isOpen = !isOpen;
            const items = document.querySelectorAll('.radial-item');

            if (!items || items.length === 0) {
                isAnimating = false;
                ErrorLogger.log('error', 'No radial items found to toggle');
                return;
            }

            if (isOpen) {
                items.forEach((item, i) => {
                    setTimeout(() => {
                        try {
                            item.classList.add('open');
                            const x = parseFloat(item.dataset.x) || 0;
                            const y = parseFloat(item.dataset.y) || 0;
                            item.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                        } catch(e) {
                            ErrorLogger.log('error', `Failed to open item ${i}`, e);
                        }
                    }, i * 35);
                });
                
                setTimeout(() => { isAnimating = false; }, items.length * 35 + 300);
            } else {
                items.forEach((item, i) => {
                    setTimeout(() => {
                        try {
                            item.classList.remove('open');
                            const x = parseFloat(item.dataset.x) || 0;
                            const y = parseFloat(item.dataset.y) || 0;
                            item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.3)`;
                            
                            setTimeout(() => {
                                if (!isOpen) {
                                    item.style.transform = 'translate(0, 0) scale(0)';
                                }
                            }, 200);
                        } catch(e) {
                            ErrorLogger.log('error', `Failed to close item ${i}`, e);
                        }
                    }, i * 20);
                });
                
                setTimeout(() => { isAnimating = false; }, items.length * 20 + 400);
            }
        } catch(e) {
            ErrorLogger.log('error', 'Failed to toggle menu', e);
            isAnimating = false;
        }
    }

    // ==================== DRAG FUNCTIONALITY ====================
    function dragStart(e) {
        if (e.target !== btn) return;
        
        try {
            hasMoved = false;
            isDragging = false;
            
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
                initialX = e.clientX;
                initialY = e.clientY;
            }

            xOffset = parseInt(container.style.left) || savedPos.x;
            yOffset = parseInt(container.style.top) || savedPos.y;

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
        } catch(e) {
            ErrorLogger.log('error', 'Drag start failed', e);
        }
    }

    function drag(e) {
        try {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            } else {
                currentX = e.clientX;
                currentY = e.clientY;
            }

            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 5 && !isDragging) {
                isDragging = true;
                hasMoved = true;
                btn.classList.add('dragging');
            }

            if (isDragging) {
                const moveX = currentX - initialX;
                const moveY = currentY - initialY;
                container.style.left = (xOffset + moveX) + 'px';
                container.style.top = (yOffset + moveY) + 'px';
            }
        } catch(e) {
            ErrorLogger.log('error', 'Drag movement failed', e);
        }
    }

    function dragEnd(e) {
        try {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            
            if (isDragging && hasMoved) {
                let newX = parseInt(container.style.left);
                let newY = parseInt(container.style.top);
                
                const padding = 5;
                const buttonRadius = currentSize.main / 2;
                
                const minX = padding + buttonRadius;
                const maxX = window.innerWidth - padding - buttonRadius;
                const minY = padding + buttonRadius;
                const maxY = window.innerHeight - padding - buttonRadius;
                
                newX = Math.max(minX, Math.min(newX, maxX));
                newY = Math.max(minY, Math.min(newY, maxY));
                
                savedPos.x = Math.round(newX);
                savedPos.y = Math.round(newY);
                container.style.left = savedPos.x + 'px';
                container.style.top = savedPos.y + 'px';
                Storage.set(positionKey, savedPos);
                
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
        } catch(e) {
            ErrorLogger.log('error', 'Drag end failed', e);
        }
    }

    btn.addEventListener('mousedown', dragStart);
    btn.addEventListener('touchstart', dragStart, { passive: false });
    
    btn.addEventListener('click', (e) => {
        if (!hasMoved && !isDragging) {
            toggleMenu(e);
        }
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'torn-radial-search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <h2>🔍 Quick Search</h2>
            <div class="search-input-wrapper">
                <input type="text" class="search-input" id="torn-search-input" placeholder="Search players, items, pages..." autocomplete="off">
            </div>
            <div class="search-results" id="torn-search-results"></div>
            <div class="search-history" id="torn-search-history" style="display: none;">
                <div class="search-history-title">
                    <span>Recent Searches</span>
                    <button class="search-clear-history" id="clear-search-history">Clear</button>
                </div>
                <div id="search-history-items"></div>
            </div>
        </div>
    `;
    document.body.appendChild(searchOverlay);

    function openSearch() {
        if (isOpen) toggleMenu();
        searchOverlay.classList.add('show');
        setTimeout(() => {
            document.getElementById('torn-search-input').focus();
        }, 100);
        renderSearchHistory();
    }

    function renderSearchHistory() {
        const history = SearchManager.getHistory();
        const historySection = document.getElementById('torn-search-history');
        const historyItems = document.getElementById('search-history-items');
        
        if (history.length > 0) {
            historySection.style.display = 'block';
            historyItems.innerHTML = history.slice(0, 5).map(h => `
                <div class="search-result-item" onclick="window.location.href='${h.url}'">
                    ${getSearchIcon(h.type)} ${h.query}
                </div>
            `).join('');
        } else {
            historySection.style.display = 'none';
        }
    }

    function getSearchIcon(type) {
        const icons = {
            player: '👤',
            item: '🛒',
            page: '📄',
            faction: '⚔️',
            company: '🏢'
        };
        return icons[type] || '🔗';
    }

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('show');
        }
    });

    document.getElementById('torn-search-input').addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        const resultsDiv = document.getElementById('torn-search-results');
        
        if (!query) {
            resultsDiv.innerHTML = '';
            renderSearchHistory();
            selectedSearchIndex = 0;
            return;
        }

        document.getElementById('torn-search-history').style.display = 'none';

        try {
            const results = await SearchManager.search(query);
            
            let html = '';
            let allResults = [];

            if (results.players.length > 0) {
                html += '<div class="search-category"><div class="search-category-title">Players</div>';
                results.players.forEach((r, i) => {
                    allResults.push(r);
                    html += `<div class="search-result-item ${i === selectedSearchIndex ? 'selected' : ''}" data-url="${r.url}" data-type="${r.type}">${r.icon} ${r.name}</div>`;
                });
                html += '</div>';
            }

            if (results.items.length > 0) {
                html += '<div class="search-category"><div class="search-category-title">Items</div>';
                results.items.forEach(r => {
                    allResults.push(r);
                    html += `<div class="search-result-item" data-url="${r.url}" data-type="${r.type}">${r.icon} ${r.name}</div>`;
                });
                html += '</div>';
            }

            if (results.pages.length > 0) {
                html += '<div class="search-category"><div class="search-category-title">Pages</div>';
                results.pages.forEach(r => {
                    allResults.push(r);
                    html += `<div class="search-result-item" data-url="${r.url}" data-type="${r.type}">${r.icon} ${r.name}</div>`;
                });
                html += '</div>';
            }

            if (html === '') {
                html = '<div class="search-no-results">No results found. Try a different search term.</div>';
            }

            resultsDiv.innerHTML = html;

            // Add click handlers
            resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    const type = item.dataset.type;
                    SearchManager.addToHistory(query, url, type);
                    window.location.href = url;
                });
            });

        } catch(e) {
            ErrorLogger.log('error', 'Search failed', e);
            resultsDiv.innerHTML = '<div class="search-no-results">Search error. Please try again.</div>';
        }
    });

    // Keyboard navigation for search
    document.getElementById('torn-search-input').addEventListener('keydown', (e) => {
        const items = document.querySelectorAll('.search-result-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSearchIndex = Math.min(selectedSearchIndex + 1, items.length - 1);
            updateSearchSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSearchIndex = Math.max(selectedSearchIndex - 1, 0);
            updateSearchSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (items[selectedSearchIndex]) {
                items[selectedSearchIndex].click();
            }
        } else if (e.key === 'Escape') {
            searchOverlay.classList.remove('show');
        }
    });

    function updateSearchSelection(items) {
        items.forEach((item, i) => {
            if (i === selectedSearchIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    document.getElementById('clear-search-history').addEventListener('click', () => {
        SearchManager.clearHistory();
        renderSearchHistory();
        showNotification('✅ Search history cleared');
    });

    // ==================== CALCULATOR FUNCTIONALITY ====================
    const calculatorOverlay = document.createElement('div');
    calculatorOverlay.id = 'torn-radial-calculator';
    calculatorOverlay.innerHTML = `
        <div class="calculator-container">
            <div class="calculator-header">
                <h2>🔢 Calculator</h2>
                <button class="modal-close" id="calculator-close">✕</button>
            </div>
            <div class="calculator-display" id="calc-display">0</div>
            <div class="calculator-buttons">
                <button class="calc-btn clear" data-value="C">C</button>
                <button class="calc-btn operator" data-value="/">/</button>
                <button class="calc-btn operator" data-value="*">×</button>
                <button class="calc-btn operator" data-value="-">-</button>
                
                <button class="calc-btn" data-value="7">7</button>
                <button class="calc-btn" data-value="8">8</button>
                <button class="calc-btn" data-value="9">9</button>
                <button class="calc-btn operator" data-value="+">+</button>
                
                <button class="calc-btn" data-value="4">4</button>
                <button class="calc-btn" data-value="5">5</button>
                <button class="calc-btn" data-value="6">6</button>
                <button class="calc-btn operator" data-value="%">%</button>
                
                <button class="calc-btn" data-value="1">1</button>
                <button class="calc-btn" data-value="2">2</button>
                <button class="calc-btn" data-value="3">3</button>
                <button class="calc-btn equals" data-value="=">=</button>
                
                <button class="calc-btn" data-value="0" style="grid-column: span 2;">0</button>
                <button class="calc-btn" data-value=".">.</button>
            </div>
        </div>
    `;
    document.body.appendChild(calculatorOverlay);

    let calcCurrentValue = '0';
    let calcPreviousValue = null;
    let calcOperation = null;

    function openCalculator() {
        if (isOpen) toggleMenu();
        calculatorOverlay.classList.add('show');
        calcCurrentValue = '0';
        calcPreviousValue = null;
        calcOperation = null;
        updateCalcDisplay();
    }

    function updateCalcDisplay() {
        document.getElementById('calc-display').textContent = calcCurrentValue;
    }

    function handleCalcInput(value) {
        if (value === 'C') {
            calcCurrentValue = '0';
            calcPreviousValue = null;
            calcOperation = null;
        } else if (['+', '-', '*', '/', '%'].includes(value)) {
            if (calcPreviousValue !== null && calcOperation !== null) {
                calculateResult();
            }
            calcPreviousValue = parseFloat(calcCurrentValue);
            calcOperation = value;
            calcCurrentValue = '0';
        } else if (value === '=') {
            calculateResult();
        } else if (value === '.') {
            if (!calcCurrentValue.includes('.')) {
                calcCurrentValue += '.';
            }
        } else {
            if (calcCurrentValue === '0') {
                calcCurrentValue = value;
            } else {
                calcCurrentValue += value;
            }
        }
        updateCalcDisplay();
    }

    function calculateResult() {
        if (calcPreviousValue === null || calcOperation === null) return;
        
        const current = parseFloat(calcCurrentValue);
        const previous = calcPreviousValue;
        let result;

        switch(calcOperation) {
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            case '*':
                result = previous * current;
                break;
            case '/':
                result = previous / current;
                break;
            case '%':
                result = (previous * current) / 100;
                break;
        }

        calcCurrentValue = result.toString();
        calcPreviousValue = null;
        calcOperation = null;
    }

    calculatorOverlay.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleCalcInput(btn.dataset.value);
        });
    });

    document.getElementById('calculator-close').addEventListener('click', () => {
        calculatorOverlay.classList.remove('show');
    });

    calculatorOverlay.addEventListener('click', (e) => {
        if (e.target === calculatorOverlay) {
            calculatorOverlay.classList.remove('show');
        }
    });

    // Keyboard support for calculator
    document.addEventListener('keydown', (e) => {
        if (calculatorOverlay.classList.contains('show')) {
            const key = e.key;
            if (/[0-9.]/.test(key) || ['+', '-', '*', '/', '%'].includes(key)) {
                e.preventDefault();
                handleCalcInput(key === '*' ? '*' : key);
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                handleCalcInput('=');
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                e.preventDefault();
                handleCalcInput('C');
            } else if (key === 'Backspace') {
                e.preventDefault();
                calcCurrentValue = calcCurrentValue.slice(0, -1) || '0';
                updateCalcDisplay();
            }
        }
    });
    
    // ==================== MINI APPS ====================
    const miniAppsOverlay = document.createElement('div');
    miniAppsOverlay.id = 'torn-radial-mini-apps';
    miniAppsOverlay.innerHTML = `
        <div class="mini-apps-container">
            <div class="mini-apps-header">
                <h2>🛠️ Mini Apps</h2>
                <button class="modal-close" id="mini-apps-close">✕</button>
            </div>
            <div class="mini-apps-body">
                <div class="mini-app-section">
                    <h3>⏱️ Timer Manager</h3>
                    <div id="timers-list"></div>
                    <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: ${isPDA ? 'wrap' : 'nowrap'};">
                        <input type="text" id="timer-name" placeholder="Timer name" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${currentTheme.inputBg}; color: ${currentTheme.textColor}; min-width: ${isPDA ? '100%' : 'auto'};">
                        <input type="number" id="timer-minutes" placeholder="Minutes" style="width: ${isPDA ? '100%' : '100px'}; padding: 10px; border-radius: 8px; border: none; background: ${currentTheme.inputBg}; color: ${currentTheme.textColor};">
                        <button class="timer-btn" id="add-timer-btn" style="padding: 10px 16px;">Add</button>
                    </div>
                </div>
                <div class="mini-app-section" id="api-monitor-section">
    <h3>📊 API Monitor</h3>
    <div id="api-status">
        <p style="color: ${currentTheme.textSecondary}; font-size: 12px; margin: 0 0 12px 0;">Configure your API key in settings to enable real-time monitoring</p>
    </div>
    <div id="api-data-container" style="display: none;">
        <!-- Stats Bars -->
        <div class="api-bars" id="api-bars">
            <div class="api-bar">
                <div class="api-bar-label">Energy</div>
                <div class="api-bar-value" id="energy-value">-/-</div>
                <div class="api-bar-progress">
                    <div class="api-bar-progress-fill" id="energy-progress" style="width: 0%;"></div>
                </div>
                <div class="api-bar-label" style="font-size: 10px; margin-top: 4px;" id="energy-time">-</div>
            </div>
            <div class="api-bar">
                <div class="api-bar-label">Nerve</div>
                <div class="api-bar-value" id="nerve-value">-/-</div>
                <div class="api-bar-progress">
                    <div class="api-bar-progress-fill" id="nerve-progress" style="width: 0%;"></div>
                </div>
                <div class="api-bar-label" style="font-size: 10px; margin-top: 4px;" id="nerve-time">-</div>
            </div>
            <div class="api-bar">
                <div class="api-bar-label">Happy</div>
                <div class="api-bar-value" id="happy-value">-/-</div>
                <div class="api-bar-progress">
                    <div class="api-bar-progress-fill" id="happy-progress" style="width: 0%;"></div>
                </div>
                <div class="api-bar-label" style="font-size: 10px; margin-top: 4px;" id="happy-time">-</div>
            </div>
            <div class="api-bar">
                <div class="api-bar-label">Life</div>
                <div class="api-bar-value" id="life-value">-/-</div>
                <div class="api-bar-progress">
                    <div class="api-bar-progress-fill" id="life-progress" style="width: 0%;"></div>
                </div>
            </div>
        </div>
        
        <!-- Money Info -->
        <div style="display: grid; grid-template-columns: repeat(${isPDA ? '1' : '2'}, 1fr); gap: 12px; margin-top: 12px;">
            <div class="api-bar">
                <div class="api-bar-label">Cash on Hand</div>
                <div class="api-bar-value" id="money-hand">$0</div>
            </div>
            <div class="api-bar" id="vault-container" style="display: none;">
                <div class="api-bar-label">Vault</div>
                <div class="api-bar-value" id="money-vault">$0</div>
            </div>
        </div>
        
        <!-- Company Info -->
        <div id="company-info" style="display: none; margin-top: 12px;">
            <div class="api-bar">
                <div class="api-bar-label">Company: <span id="company-name">-</span></div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 8px; font-size: ${isPDA ? '11px' : '12px'};">
                    <div>Position: <span id="company-position" style="font-weight: 600;">-</span></div>
                    <div>Employees: <span id="company-employees" style="font-weight: 600;">-</span></div>
                </div>
                </div>
            </div>
        </div>
            <button class="timer-btn" id="refresh-api-btn" style="width: 100%; margin-top: 12px; display: none; padding: 10px;">Refresh Data</button>
        </div>
                
                
                <div class="mini-app-section">
                    <h3>📝 Quick Notes</h3>
                    <textarea id="quick-notes" placeholder="Jot down quick notes..." style="width: 100%; min-height: 120px; padding: 12px; border-radius: 8px; border: none; background: ${currentTheme.inputBg}; color: ${currentTheme.textColor}; font-family: monospace; resize: vertical;"></textarea>
                    <button class="timer-btn" id="save-notes-btn" style="margin-top: 8px; width: 100%; padding: 10px;">Save Notes</button>
                </div>
                
                <div class="mini-app-section">
                    <h3>⚔️ Faction Shortcuts</h3>
                    <div style="display: grid; grid-template-columns: repeat(${isPDA ? '1' : '2'}, 1fr); gap: 8px;">
                        <a href="/factions.php?step=your" class="timer-btn" style="text-decoration: none; text-align: center; display: block; padding: 10px;">Faction Home</a>
                        <a href="/factions.php?step=your#/tab=crimes" class="timer-btn" style="text-decoration: none; text-align: center; display: block; padding: 10px;">OC</a>
                        <a href="/factions.php?step=your#/tab=armoury" class="timer-btn" style="text-decoration: none; text-align: center; display: block; padding: 10px;">Armory</a>
                        <a href="/factions.php?step=your#/tab=controls" class="timer-btn" style="text-decoration: none; text-align: center; display: block; padding: 10px;">Controls</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(miniAppsOverlay);

    function openMiniApps() {
        if (isOpen) toggleMenu();
        miniAppsOverlay.classList.add('show');
        renderTimers();
        loadNotes();
        updateAPIMonitor();
    }

    function renderTimers() {
        const timersList = document.getElementById('timers-list');
        if (!timers || timers.length === 0) {
            timersList.innerHTML = '<div style="text-align: center; padding: 20px; color: ' + currentTheme.textSecondary + ';">No active timers</div>';
            return;
        }

        timersList.innerHTML = timers.map((timer, i) => {
            const remaining = Math.max(0, timer.endTime - Date.now());
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            return `
                <div class="timer-item">
                    <div>
                        <div style="font-weight: 600;">${timer.name}</div>
                        <div style="font-size: 12px; color: ${currentTheme.textSecondary};">${minutes}m ${seconds}s remaining</div>
                    </div>
                    <button class="timer-btn danger" onclick="window.tornRadialRemoveTimer(${i})">Remove</button>
                </div>
            `;
        }).join('');
    }

    window.tornRadialRemoveTimer = function(index) {
        timers.splice(index, 1);
        Storage.set('tornRadialTimers', timers);
        renderTimers();
    };

    document.getElementById('add-timer-btn').addEventListener('click', () => {
        const name = document.getElementById('timer-name').value.trim();
        const minutes = parseInt(document.getElementById('timer-minutes').value);
        
        if (!name || !minutes || minutes <= 0) {
            showNotification('⚠️ Please enter timer name and duration');
            return;
        }

        const timer = {
            name: name,
            endTime: Date.now() + (minutes * 60000)
        };

        timers.push(timer);
        Storage.set('tornRadialTimers', timers);
        
        document.getElementById('timer-name').value = '';
        document.getElementById('timer-minutes').value = '';
        
        renderTimers();
        showNotification(`✅ Timer "${name}" added for ${minutes} minutes`);
        
        setTimeout(() => {
            if (settings.notifications.enabled) {
                showNotification(`⏰ Timer Complete: ${name}`);
                if (typeof GM_notification !== 'undefined') {
                    GM_notification({
                        title: 'Torn Radial Timer',
                        text: `Timer "${name}" has finished!`,
                        timeout: 5000
                    });
                }
            }
        }, minutes * 60000);
    });

    // API Monitor
    async function updateAPIMonitor() {
    if (!settings.apiKey) {
        document.getElementById('api-data-container').style.display = 'none';
        document.getElementById('refresh-api-btn').style.display = 'none';
        return;
    }

    try {
        // Test API key first with a simple call
        const barsData = await API.request('/user/?selections=bars');
        
        document.getElementById('api-data-container').style.display = 'block';
        document.getElementById('refresh-api-btn').style.display = 'block';
        document.getElementById('api-status').style.display = 'none';

        // Helper function to format time
        const formatTime = (seconds) => {
            if (seconds <= 0) return 'Full';
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            if (hours > 0) return `${hours}h ${mins}m`;
            return `${mins}m`;
        };

        // Update Energy
        const energyCurrent = barsData.energy.current;
        const energyMax = barsData.energy.maximum;
        const energyPercent = (energyCurrent / energyMax) * 100;
        const energyFulltime = barsData.energy.fulltime || 0;
        document.getElementById('energy-value').textContent = `${energyCurrent}/${energyMax}`;
        document.getElementById('energy-progress').style.width = energyPercent + '%';
        document.getElementById('energy-time').textContent = energyFulltime > 0 ? `Full in ${formatTime(energyFulltime)}` : 'Full';

        // Update Nerve
        const nerveCurrent = barsData.nerve.current;
        const nerveMax = barsData.nerve.maximum;
        const nervePercent = (nerveCurrent / nerveMax) * 100;
        const nerveFulltime = barsData.nerve.fulltime || 0;
        document.getElementById('nerve-value').textContent = `${nerveCurrent}/${nerveMax}`;
        document.getElementById('nerve-progress').style.width = nervePercent + '%';
        document.getElementById('nerve-time').textContent = nerveFulltime > 0 ? `Full in ${formatTime(nerveFulltime)}` : 'Full';

        // Update Happy
        const happyCurrent = barsData.happy.current;
        const happyMax = barsData.happy.maximum;
        const happyPercent = (happyCurrent / happyMax) * 100;
        const happyFulltime = barsData.happy.fulltime || 0;
        document.getElementById('happy-value').textContent = `${happyCurrent}/${happyMax}`;
        document.getElementById('happy-progress').style.width = happyPercent + '%';
        document.getElementById('happy-time').textContent = happyFulltime > 0 ? `Full in ${formatTime(happyFulltime)}` : 'Full';

        // Update Life
        const lifeCurrent = barsData.life.current;
        const lifeMax = barsData.life.maximum;
        const lifePercent = (lifeCurrent / lifeMax) * 100;
        document.getElementById('life-value').textContent = `${Math.floor(lifeCurrent)}/${lifeMax}`;
        document.getElementById('life-progress').style.width = lifePercent + '%';

        // Fetch money separately
        try {
            const moneyData = await API.request('/user/?selections=money');
            const formatMoney = (amount) => '$' + amount.toLocaleString();
            document.getElementById('money-hand').textContent = formatMoney(moneyData.money_onhand || 0);
            
            if (moneyData.vault_amount !== undefined) {
                document.getElementById('vault-container').style.display = 'block';
                document.getElementById('money-vault').textContent = formatMoney(moneyData.vault_amount || 0);
            }
        } catch(e) {
            log('Money fetch failed:', e);
        }

        // Company info
        try {
            const profileData = await API.request('/user/?selections=profile');
            if (profileData.job && profileData.job.company_id) {
                const companyData = await API.request('/company/?selections=profile');
                document.getElementById('company-info').style.display = 'block';
                document.getElementById('company-name').textContent = companyData.company.name || 'Unknown';
                document.getElementById('company-position').textContent = profileData.job.position || 'Employee';
            }
        } catch(e) {
            document.getElementById('company-info').style.display = 'none';
        }

    } catch(e) {
        ErrorLogger.log('error', 'Failed to fetch API data', e);
        document.getElementById('api-status').innerHTML = `<p style="color: ${currentTheme.dangerColor}; font-size: 12px;">Failed to fetch API data: ${e.message}</p>`;
        document.getElementById('api-status').style.display = 'block';
        document.getElementById('api-data-container').style.display = 'none';
    }
}

    document.getElementById('refresh-api-btn').addEventListener('click', () => {
        updateAPIMonitor();
        showNotification('🔄 API data refreshed');
    });

    // Notes
    function loadNotes() {
        const notes = Storage.get('tornRadialNotes', '');
        document.getElementById('quick-notes').value = notes;
    }

    document.getElementById('save-notes-btn').addEventListener('click', () => {
        const notes = document.getElementById('quick-notes').value;
        Storage.set('tornRadialNotes', notes);
        showNotification('✅ Notes saved!');
    });

    document.getElementById('mini-apps-close').addEventListener('click', () => {
        miniAppsOverlay.classList.remove('show');
    });

    miniAppsOverlay.addEventListener('click', (e) => {
        if (e.target === miniAppsOverlay) {
            miniAppsOverlay.classList.remove('show');
        }
    });

    // Timer update loop
    setInterval(() => {
        if (miniAppsOverlay.classList.contains('show')) {
            renderTimers();
        }
        
        timers = timers.filter(timer => {
            if (Date.now() >= timer.endTime) {
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
                return false;
            }
            return true;
        });
        Storage.set('tornRadialTimers', timers);
    }, 1000);

    // ==================== SCREEN CALIBRATION ====================
    const calibrationOverlay = document.createElement('div');
    calibrationOverlay.id = 'torn-radial-calibration';
    calibrationOverlay.innerHTML = `
        <div class="calibration-instruction">Click the TOP-LEFT corner of your safe area</div>
        <button class="calibration-cancel" id="calibration-cancel-btn">Cancel (ESC)</button>
    `;
    document.body.appendChild(calibrationOverlay);

    function startCalibration() {
        calibrationMode = true;
        calibrationStep = 0;
        calibrationOverlay.classList.add('show');
        const deviceType = isPDA ? 'mobile' : 'desktop';
        document.querySelector('.calibration-instruction').textContent = `Click the TOP-LEFT corner of your safe area (${deviceType} mode)`;
    }

    calibrationOverlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('calibration-cancel') || e.target.id === 'calibration-cancel-btn') {
            calibrationMode = false;
            calibrationOverlay.classList.remove('show');
            const points = document.querySelectorAll('.calibration-point');
            points.forEach(p => p.remove());
            return;
        }

        if (calibrationMode) {
            if (calibrationStep === 0) {
                const point = document.createElement('div');
                point.className = 'calibration-point';
                point.style.left = e.clientX + 'px';
                point.style.top = e.clientY + 'px';
                calibrationOverlay.appendChild(point);
                
                const tempCalibration = {
                    topLeft: { x: e.clientX, y: e.clientY }
                };
                
                if (isPDA) {
                    settings.screenCalibrationMobile = tempCalibration;
                } else {
                    settings.screenCalibration = tempCalibration;
                }
                
                calibrationStep = 1;
                const deviceType = isPDA ? 'mobile' : 'desktop';
                document.querySelector('.calibration-instruction').textContent = `Click the BOTTOM-RIGHT corner of your safe area (${deviceType} mode)`;
            } else if (calibrationStep === 1) {
                const point = document.createElement('div');
                point.className = 'calibration-point';
                point.style.left = e.clientX + 'px';
                point.style.top = e.clientY + 'px';
                calibrationOverlay.appendChild(point);
                
                if (isPDA) {
                    settings.screenCalibrationMobile.bottomRight = { x: e.clientX, y: e.clientY };
                } else {
                    settings.screenCalibration.bottomRight = { x: e.clientX, y: e.clientY };
                }
                
                Storage.set('tornRadialSettings', settings);
                
                calibrationMode = false;
                const deviceType = isPDA ? 'Mobile' : 'Desktop';
                showNotification(`✅ ${deviceType} screen calibration complete!`);
                
                setTimeout(() => {
                    calibrationOverlay.classList.remove('show');
                    const points = document.querySelectorAll('.calibration-point');
                    points.forEach(p => p.remove());
                    
                    createRadialItems();
                }, 1000);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && calibrationMode) {
            calibrationMode = false;
            calibrationOverlay.classList.remove('show');
            const points = document.querySelectorAll('.calibration-point');
            points.forEach(p => p.remove());
        }
        
        // Global keyboard shortcut
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            openSettings();
            showNotification('⚙️ Settings opened via keyboard shortcut');
        }
    });

    // ==================== SETTINGS MODAL WITH TABS ====================
    function moveLink(fromIndex, direction) {
        try {
            const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
            
            if (toIndex < 0 || toIndex >= links.length) return;
            
            const temp = links[fromIndex];
            links[fromIndex] = links[toIndex];
            links[toIndex] = temp;
            
            if (!loadouts[settings.currentLoadout]) {
                loadouts[settings.currentLoadout] = { name: settings.currentLoadout, links: [] };
            }
            loadouts[settings.currentLoadout].links = JSON.parse(JSON.stringify(links));
            Storage.set('tornRadialLoadouts', loadouts);
            
            renderLinksContainer();
        } catch(e) {
            ErrorLogger.log('error', 'Failed to move link', e);
        }
    }

    const modal = document.createElement('div');
    modal.id = 'torn-radial-modal';
    
    // Generate theme options dynamically
    const themeOptions = getThemeNames().map(themeName => 
        `<option value="${themeName}">${THEMES[themeName].name}</option>`
    ).join('');

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-title">
                    <h2>⚙️ Quick Travel Settings</h2>
                </div>
                <button class="error-log-btn" id="show-error-log" title="View Error Log">🐞</button>
                <button class="modal-close" id="modal-close-btn">✕</button>
            </div>
            <div class="modal-tabs">
                <button class="modal-tab active" data-tab="general">General</button>
                <button class="modal-tab" data-tab="appearance">Appearance</button>
                <button class="modal-tab" data-tab="advanced">Advanced</button>
                <button class="modal-tab" data-tab="about">About</button>
                <button class="modal-tab" data-tab="donators">Donators</button>
            </div>
            <div class="modal-body">
                <!-- GENERAL TAB -->
                <div class="tab-content active" data-tab="general">
                    <div class="loadout-selector">
                        <h3>📋 Loadouts</h3>
                        <div class="loadout-tabs" id="loadout-tabs"></div>
                        <div class="loadout-actions">
                            <button id="new-loadout-btn">➕ New</button>
                            <button id="rename-loadout-btn">✏️ Rename</button>
                            <button class="delete" id="delete-loadout-btn">🗑️ Delete</button>
                        </div>
                    </div>
                    
                    <button class="add-current-page-btn" id="add-current-page-btn">📄 Add Current Page to Loadout</button>
                    
                    <div id="links-container"></div>
                </div>

                <!-- APPEARANCE TAB -->
                <div class="tab-content" data-tab="appearance">
                    <div class="settings-section">
                        <h3>🎨 Visual Settings</h3>
                        <div class="setting-item">
                            <label>Theme</label>
                            <select id="theme-select">
                                ${themeOptions}
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Layout</label>
                            <select id="layout-select">
                                <option value="circular">Circular</option>
                                <option value="vertical">Vertical</option>
                                <option value="horizontal">Horizontal</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Size</label>
                            <select id="size-select">
                                <option value="pda">PDA</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- ADVANCED TAB -->
                <div class="tab-content" data-tab="advanced">
                    <div class="settings-section">
                        <h3>🔔 Notifications</h3>
                        <div class="setting-item">
                            <label>Enable Notifications</label>
                            <input type="checkbox" id="notif-enabled">
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3>🔑 API Configuration</h3>
                        <div class="setting-item" style="flex-direction: column; align-items: stretch;">
                            <label>Torn API Key</label>
                            <input type="password" id="api-key-input" placeholder="Enter your Torn API key" style="width: 100%; margin-top: 8px;">
                            <p style="font-size: ${isPDA ? '10px' : '11px'}; color: ${currentTheme.textSecondary}; margin: 8px 0 0 0;">Used for API Monitor in Mini Apps. Get your key at torn.com/preferences.php#tab=api</p>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>📐 Calibration</h3>
                        <p style="font-size: ${isPDA ? '11px' : '12px'}; color: ${currentTheme.textSecondary}; margin: 0 0 12px 0;">
                            Current device: <strong>${isPDA ? 'Mobile/PDA' : 'Desktop'}</strong>
                        </p>
                        <p style="font-size: ${isPDA ? '11px' : '12px'}; color: ${currentTheme.textSecondary}; margin: 0 0 12px 0;">
                            Calibration ensures all menu items stay within your screen boundaries. Each device type (desktop/mobile) has separate calibration settings.
                        </p>
                        <button class="btn-calibrate" id="calibrate-btn-advanced" style="width: 100%; padding: ${isPDA ? '10px' : '12px'};">
                            📐 Calibrate ${isPDA ? 'Mobile' : 'Desktop'} Screen
                        </button>
                    </div>
                </div>

                <!-- ABOUT TAB -->
                <div class="tab-content" data-tab="about">
                    <div class="about-section">
                        <h3>ℹ️ About Torn Quick-Travel</h3>
                        <div class="version-badge">v1.6.1</div>
                        <p><strong>Author:</strong> Sensimillia (2168012)</p>
                        <p>Radial navigation menu for Torn City with enhanced features, API integration, customization options.</p>
                    </div>

                    <div class="about-section">
                        <h3>✨ What's New in v1.6.1</h3>
                        <ul>
                            <li><strong>🔍 Search Icon:</strong> Search has its own radial menu icon for easy access (WIP)</li>
                            <li><strong>📱 PDA Mode:</strong> Fully responsive settings UI that scales perfectly on mobile devices</li>
                            <li><strong>🎨 Tabbed Settings:</strong> Cleaner, organized interface with categorized tabs</li>
                            <li><strong>📐 Dual Calibration:</strong> Separate screen calibration for desktop and mobile/PDA modes (WIP)</li>
                            <li><strong>🔔 Smart Notifications:</strong> Throttled notification system prevents spam and browser crashes</li>
                            <li><strong>⚡ Optimized Code:</strong> Dynamic theme system and better structured architecture</li>
                            <li><strong>🧹 Cleaner Menu:</strong> Removed redundant script manager items</li>
                        </ul>
                    </div>

                    <div class="about-section">
                        <h3>🎯 Features</h3>
                        <ul>
                            <li>Customizable radial menu with multiple layouts</li>
                            <li>Multiple loadout presets for different activities</li>
                            <li>Smart search with history and categorized results</li>
                            <li>Built-in calculator with keyboard support</li>
                            <li>Timer manager and quick notes</li>
                            <li>API integration for real-time stats monitoring</li>
                            <li>10 beautiful themes to choose from</li>
                            <li>Import/Export settings for backup and sharing</li>
                            <li>Usage statistics and automatic favorites</li>
                            <li>Comprehensive error logging system</li>
                        </ul>
                    </div>

                    <div class="about-section">
                        <h3>⌨️ Keyboard Shortcuts</h3>
                        <ul>
                            <li><strong>Ctrl/Cmd + Shift + R:</strong> Open settings</li>
                            <li><strong>↑↓ + Enter:</strong> Navigate search results</li>
                            <li><strong>Escape:</strong> Close overlays/cancel calibration</li>
                            <li><strong>Calculator:</strong> Full keyboard support for all operations</li>
                        </ul>
                    </div>

                    <div class="about-section">
                        <h3>💡 Tips</h3>
                        <ul>
                            <li>Drag the main button to reposition the menu anywhere on screen</li>
                            <li>Use calibration to set safe boundaries for your specific screen layout</li>
                            <li>Add frequently visited pages directly from any Torn page</li>
                            <li>The Favorites loadout auto-generates from your most-used links</li>
                            <li>Export your settings regularly to prevent data loss</li>
                        </ul>
                    </div>
                </div>

                <!-- DONATORS TAB -->
                <div class="tab-content" data-tab="donators">
                    <div class="about-section">
                        <h3>💖 Thank You to Our Supporters</h3>
                        <p style="font-size: ${isPDA ? '12px' : '14px'}; color: ${currentTheme.textSecondary};">
                            These amazing people have supported the development of Torn Quick-Travel. Your contributions help keep this project alive and evolving!
                        </p>
                    </div>

                    <div class="about-section">
                        <div class="donators-list" id="donators-list">
                            <!-- Placeholder for future donators -->
                            <div class="donator-item">
                                <div class="donator-icon">🌟</div>
                                <div class="donator-info">
                                    <div class="donator-name">Caio [2488372]</div>
                                    <div class="donator-amount">30x Can of Crocozade</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="about-section">
                        <h3>☕ Support Development</h3>
                        <p style="font-size: ${isPDA ? '12px' : '14px'}; color: ${currentTheme.textSecondary}; margin-bottom: 12px;">
                            If you enjoy using Torn Quick-Travel and would like to support its continued development, consider sending a small donation in-game or leaving a positive review!
                        </p>
                        <button class="btn-coffee" id="coffee-btn-about" style="width: 100%; padding: ${isPDA ? '12px' : '14px'};">
                            ☕ Visit My Profile
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-success" id="add-link-btn">➕ Add Link</button>
                <button class="btn-secondary" id="restore-btn">🔄 Restore</button>
                <button class="btn-secondary" id="export-btn">📤 Export</button>
                <button class="btn-secondary" id="import-btn">📥 Import</button>
                <button class="btn-primary" id="save-btn">💾 Save Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Tab switching functionality
    const tabButtons = modal.querySelectorAll('.modal-tab');
    const tabContents = modal.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content visibility
            tabContents.forEach(content => {
                if (content.dataset.tab === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSettings();
    });

    document.getElementById('show-error-log').addEventListener('click', (e) => {
        e.preventDefault();
        showErrorLog();
    });

    function renderLoadoutTabs() {
        try {
            const tabsContainer = document.getElementById('loadout-tabs');
            if (!tabsContainer) return;
            
            tabsContainer.innerHTML = '';
            
            Object.keys(loadouts).forEach(key => {
                const tab = document.createElement('button');
                tab.className = 'loadout-tab';
                tab.textContent = loadouts[key]?.name || key;
                tab.dataset.loadout = key;
                
                if (key === settings.currentLoadout) {
                    tab.classList.add('active');
                }
                
                tab.addEventListener('click', () => switchLoadout(key));
                tabsContainer.appendChild(tab);
            });
        } catch(e) {
            ErrorLogger.log('error', 'Failed to render loadout tabs', e);
        }
    }

    function switchLoadout(loadoutKey) {
        try {
            if (!loadouts[loadoutKey]) {
                ErrorLogger.log('error', `Loadout not found: ${loadoutKey}`);
                return;
            }
            
            settings.currentLoadout = loadoutKey;
            links = loadouts[loadoutKey].links.map(link => ({
                name: link?.name || 'Unnamed',
                url: link?.url || '/index.php',
                icon: link?.icon || '🔗',
                color: link?.color || '#4aa3df'
            }));
            
            renderLoadoutTabs();
            renderLinksContainer();
        } catch(e) {
            ErrorLogger.log('error', 'Failed to switch loadout', e);
        }
    }

    function renderLinksContainer() {
        try {
            const linksContainer = document.getElementById('links-container');
            if (!linksContainer) return;
            
            linksContainer.innerHTML = '';

            links.forEach((link, i) => {
                const linkItem = document.createElement('div');
                linkItem.className = 'link-item';
                linkItem.innerHTML = `
                    <input type="text" value="${link.icon}" placeholder="Icon" maxlength="2" data-index="${i}" data-field="icon">
                    <input type="text" value="${link.name}" placeholder="Name" data-index="${i}" data-field="name">
                    <input type="text" value="${link.url}" placeholder="URL" data-index="${i}" data-field="url">
                    <div class="color-picker-wrapper">
                        <input type="color" class="color-picker" value="${link.color}" data-index="${i}" data-field="color">
                    </div>
                    <button class="delete-btn" data-index="${i}" title="Delete">🗑️</button>
                    <div class="reorder-controls">
                        <button class="reorder-btn" data-index="${i}" data-direction="up" ${i === 0 ? 'disabled' : ''} title="Move Up">▲</button>
                        <button class="reorder-btn" data-index="${i}" data-direction="down" ${i === links.length - 1 ? 'disabled' : ''} title="Move Down">▼</button>
                    </div>
                `;
                linksContainer.appendChild(linkItem);
            });

            linksContainer.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const index = parseInt(this.dataset.index);
                    if (confirm(`Remove "${links[index].name}"?`)) {
                        try {
                            links.splice(index, 1);
                            saveCurrentLoadout();
                            renderLinksContainer();
                        } catch(err) {
                            ErrorLogger.log('error', 'Failed to delete link', err);
                            showNotification('❌ Failed to delete link');
                        }
                    }
                });
            });

            linksContainer.querySelectorAll('.reorder-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!this.disabled) {
                        const index = parseInt(this.dataset.index);
                        const direction = this.dataset.direction;
                        moveLink(index, direction);
                    }
                });
            });
        } catch(e) {
            ErrorLogger.log('error', 'Failed to render links container', e);
        }
    }

    function openSettings() {
        try {
            if (isOpen) toggleMenu();
            
            document.getElementById('theme-select').value = settings.theme;
            document.getElementById('layout-select').value = settings.layout;
            document.getElementById('size-select').value = settings.iconSize;
            document.getElementById('notif-enabled').checked = settings.notifications.enabled;
            document.getElementById('api-key-input').value = settings.apiKey || '';
            
            renderLoadoutTabs();
            renderLinksContainer();
            
            modal.classList.add('show');
        } catch(e) {
            ErrorLogger.log('error', 'Failed to open settings', e);
        }
    }

    function saveCurrentLoadout() {
        try {
            document.querySelectorAll('.link-item input').forEach(input => {
                const index = parseInt(input.dataset.index);
                const field = input.dataset.field;
                if (links[index] && field) {
                    links[index][field] = input.value;
                }
            });

            if (!loadouts[settings.currentLoadout]) {
                loadouts[settings.currentLoadout] = { name: settings.currentLoadout, links: [] };
            }
            
            loadouts[settings.currentLoadout].links = JSON.parse(JSON.stringify(links));
            Storage.set('tornRadialLoadouts', loadouts);
        } catch(e) {
            ErrorLogger.log('error', 'Failed to save loadout', e);
        }
    }

    function closeSettings() {
        try {
            const oldLayout = settings.layout;
            const oldSize = settings.iconSize;
            const oldTheme = settings.theme;
            
            settings.theme = document.getElementById('theme-select').value;
            settings.layout = document.getElementById('layout-select').value;
            settings.iconSize = document.getElementById('size-select').value;
            settings.notifications.enabled = document.getElementById('notif-enabled').checked;
            
            const newApiKey = document.getElementById('api-key-input').value.trim();
            if (newApiKey !== settings.apiKey) {
                settings.apiKey = newApiKey;
                API.setApiKey(newApiKey);
            }
            
            Storage.set('tornRadialSettings', settings);

            saveCurrentLoadout();
            
            modal.classList.remove('show');
            
            if (oldLayout !== settings.layout || oldSize !== settings.iconSize || oldTheme !== settings.theme) {
                location.reload();
            } else {
                createRadialItems();
            }
        } catch(e) {
            ErrorLogger.log('error', 'Failed to close settings', e);
        }
    }

    // Event listeners
    document.getElementById('modal-close-btn').addEventListener('click', (e) => {
        e.preventDefault();
        closeSettings();
    });

    document.getElementById('save-btn').addEventListener('click', (e) => {
        e.preventDefault();
        closeSettings();
    });

    document.getElementById('add-link-btn').addEventListener('click', (e) => {
        e.preventDefault();
        try {
            saveCurrentLoadout();
            links.push({ name: 'New Link', url: '/index.php', icon: '🔗', color: '#4aa3df' });
            saveCurrentLoadout();
            renderLinksContainer();
            
            // Switch to General tab when adding link
            document.querySelector('.modal-tab[data-tab="general"]').click();
        } catch(e) {
            ErrorLogger.log('error', 'Failed to add link', e);
        }
    });

    document.getElementById('add-current-page-btn').addEventListener('click', (e) => {
        e.preventDefault();
        addCurrentPage();
    });

    document.getElementById('restore-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Restore default links for this loadout?')) {
            try {
                links = JSON.parse(JSON.stringify(DEFAULT_LINKS));
                saveCurrentLoadout();
                renderLinksContainer();
                showNotification('✅ Loadout restored to defaults');
            } catch(e) {
                ErrorLogger.log('error', 'Failed to restore defaults', e);
            }
        }
    });

    document.getElementById('export-btn').addEventListener('click', (e) => {
        e.preventDefault();
        Storage.exportAll();
        showNotification('✅ Data exported successfully');
    });

    document.getElementById('import-btn').addEventListener('click', (e) => {
        e.preventDefault();
        importLoadouts();
    });

    document.getElementById('calibrate-btn-advanced').addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('show');
        setTimeout(() => {
            startCalibration();
        }, 300);
    });

    document.getElementById('new-loadout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        try {
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
        } catch(e) {
            ErrorLogger.log('error', 'Failed to create loadout', e);
        }
    });

    document.getElementById('rename-loadout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        try {
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
        } catch(e) {
            ErrorLogger.log('error', 'Failed to rename loadout', e);
        }
    });

    document.getElementById('delete-loadout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        try {
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
        } catch(e) {
            ErrorLogger.log('error', 'Failed to delete loadout', e);
        }
    });

    document.getElementById('coffee-btn-about').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://www.torn.com/profiles.php?XID=2168012#/', '_blank');
    });

    // ==================== HELPER FUNCTIONS FOR SETTINGS ====================
    function addCurrentPage() {
        const currentUrl = window.location.pathname + window.location.search;
        const pageName = prompt('Enter a name for this page:', document.title.split(' - ')[0] || 'Current Page');
        
        if (pageName && pageName.trim()) {
            const newLink = {
                name: pageName.trim(),
                url: currentUrl,
                icon: '📄',
                color: currentTheme.primaryColor
            };
            
            links.push(newLink);
            saveCurrentLoadout();
            renderLinksContainer();
            showNotification(`✅ Added "${pageName}" to current loadout`);
        }
    }

    function importLoadouts() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        if (Storage.importAll(e.target.result)) {
                            showNotification('✅ Data imported successfully!');
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            showNotification('❌ Import failed - invalid file');
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
    }

    // ==================== ERROR LOG MODAL ====================
    const errorLogModal = document.createElement('div');
    errorLogModal.id = 'error-log-modal';
    errorLogModal.innerHTML = `
        <div class="error-log-content" style="background: ${currentTheme.modalBg}; border-radius: ${isPDA ? '16px' : '20px'}; padding: 0; max-width: ${isPDA ? '95%' : '800px'}; width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);">
            <div class="error-log-header" style="padding: ${isPDA ? '16px 20px' : '20px 24px'}; border-bottom: 1px solid ${currentTheme.borderColor}; background: ${currentTheme.modalHeaderBg}; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: ${isPDA ? '16px' : '20px'}; color: ${currentTheme.textColor};">🐞 Error Log</h2>
                <button class="modal-close" id="error-log-close">✕</button>
            </div>
            <div class="error-log-body" id="error-log-body" style="padding: ${isPDA ? '16px' : '20px'}; overflow-y: auto; flex: 1; font-family: 'Courier New', monospace; font-size: ${isPDA ? '11px' : '12px'}; color: ${currentTheme.textColor};"></div>
            <div class="error-log-footer" style="padding: ${isPDA ? '12px 16px' : '16px 24px'}; border-top: 1px solid ${currentTheme.borderColor}; background: ${currentTheme.modalFooterBg}; display: flex; gap: ${isPDA ? '8px' : '12px'};">
                <button class="btn-secondary" id="export-log-btn" style="flex: 1; padding: ${isPDA ? '10px' : '12px'}; border: none; border-radius: ${isPDA ? '8px' : '10px'}; font-weight: 600; cursor: pointer;">💾 Export</button>
                <button class="btn-secondary" id="clear-log-btn" style="flex: 1; padding: ${isPDA ? '10px' : '12px'}; border: none; border-radius: ${isPDA ? '8px' : '10px'}; font-weight: 600; cursor: pointer;">🗑️ Clear</button>
                <button class="btn-primary" id="close-log-btn" style="flex: 1; padding: ${isPDA ? '10px' : '12px'}; border: none; border-radius: ${isPDA ? '8px' : '10px'}; font-weight: 600; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    errorLogModal.style.cssText = `display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000001; justify-content: center; align-items: center; padding: ${isPDA ? '10px' : '20px'};`;
    document.body.appendChild(errorLogModal);

    function showErrorLog() {
        try {
            const logBody = document.getElementById('error-log-body');
            const logs = ErrorLogger.getLogs();
            
            if (logs.length === 0) {
                logBody.innerHTML = '<div style="text-align: center; padding: 40px; opacity: 0.5;">No errors logged</div>';
            } else {
                logBody.innerHTML = logs.reverse().map(log => `
                    <div style="background: ${currentTheme.sectionBg}; padding: ${isPDA ? '10px' : '12px'}; margin-bottom: ${isPDA ? '10px' : '12px'}; border-radius: ${isPDA ? '8px' : '10px'}; border-left: 4px solid ${log.type === 'error' ? '#FF3B30' : log.type === 'warning' ? '#FF9500' : '#007AFF'};">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; font-size: ${isPDA ? '10px' : '11px'};">
                            <span style="text-transform: uppercase;">${log.type}</span>
                            <span style="opacity: 0.7; font-size: ${isPDA ? '9px' : '10px'};">${new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div style="margin-bottom: 8px;">${log.message}</div>
                        ${log.error ? `<div style="font-size: ${isPDA ? '9px' : '10px'}; opacity: 0.6; white-space: pre-wrap; word-break: break-all;">${log.error.message}\n${log.error.stack || ''}</div>` : ''}
                    </div>
                `).join('');
            }
            
            errorLogModal.style.display = 'flex';
        } catch(e) {
            ErrorLogger.log('error', 'Failed to show error log', e);
            alert('Error displaying log. Check console.');
        }
    }

    document.getElementById('error-log-close').addEventListener('click', () => {
        errorLogModal.style.display = 'none';
    });

    document.getElementById('close-log-btn').addEventListener('click', () => {
        errorLogModal.style.display = 'none';
    });

    document.getElementById('export-log-btn').addEventListener('click', () => {
        try {
            ErrorLogger.exportLogs();
            showNotification('✅ Error logs exported');
        } catch(e) {
            ErrorLogger.log('error', 'Failed to export logs', e);
            showNotification('❌ Failed to export logs');
        }
    });

    document.getElementById('clear-log-btn').addEventListener('click', () => {
        if (confirm('Clear all error logs?')) {
            ErrorLogger.clear();
            showErrorLog();
            showNotification('✅ Error logs cleared');
        }
    });

    errorLogModal.addEventListener('click', (e) => {
        if (e.target === errorLogModal) {
            errorLogModal.style.display = 'none';
        }
    });

    // ==================== RESET FUNCTIONS ====================
    function resetPosition() {
        try {
            const safePos = getSafeInitialPosition();
            savedPos.x = safePos.x;
            savedPos.y = safePos.y;
            container.style.left = safePos.x + 'px';
            container.style.top = safePos.y + 'px';
            Storage.set(positionKey, savedPos);
            
            createRadialItems();
            if (isOpen) {
                isOpen = false;
                setTimeout(() => toggleMenu(), 100);
            }
            
            showNotification('✅ Menu position reset to center');
            return true;
        } catch(e) {
            ErrorLogger.log('error', 'Failed to reset position', e);
            return false;
        }
    }

    function fullReset() {
        try {
            if (confirm('⚠️ FULL RESET will:\n- Delete ALL custom loadouts\n- Reset ALL settings to defaults\n- Clear error logs\n- Clear usage statistics\n\nThis CANNOT be undone!\n\nAre you absolutely sure?')) {
                if (confirm('Last chance! This will delete everything. Continue?')) {
                    localStorage.removeItem('tornRadialSettings');
                    localStorage.removeItem('tornRadialLoadouts');
                    localStorage.removeItem('tornRadialPosition');
                    localStorage.removeItem('tornRadialPositionMobile');
                    localStorage.removeItem('tornRadialErrorLogs');
                    localStorage.removeItem('tornRadialUsageStats');
                    localStorage.removeItem('tornRadialTimers');
                    localStorage.removeItem('tornRadialSearchHistory');
                    localStorage.removeItem('tornRadialNotes');
                    localStorage.removeItem('tornRadialApiKey');
                    localStorage.removeItem('tornRadialCalibration');
                    localStorage.removeItem('tornRadialCalibrationMobile');
                    alert('✅ Full reset complete! Refreshing page...');
                    location.reload();
                    return true;
                }
            }
            return false;
        } catch(e) {
            alert('Reset failed. Try clearing localStorage manually.');
            console.error('Reset error:', e);
            return false;
        }
    }

    // ==================== MENU COMMANDS (CLEANED UP) ====================
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ Open Settings', () => {
            openSettings();
        });
        
        GM_registerMenuCommand('📐 Calibrate Screen', () => {
            startCalibration();
        });
        
        GM_registerMenuCommand('📤 Export All Data', () => {
            Storage.exportAll();
            showNotification('✅ Data exported successfully');
        });
        
        GM_registerMenuCommand('📥 Import Data', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (Storage.importAll(e.target.result)) {
                            alert('Import successful! Page will reload.');
                            location.reload();
                        } else {
                            alert('Import failed. Check file format.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });
        
        GM_registerMenuCommand('🎯 Reset Position', () => {
            if (resetPosition()) {
                alert('Menu position has been reset to center!');
            }
        });
        
        GM_registerMenuCommand('⚠️ Full Reset', () => {
            fullReset();
        });
        
        GM_registerMenuCommand('🐞 View Error Log', () => {
            showErrorLog();
        });
    }

    // ==================== CONSOLE API ====================
    window.tornRadialReset = fullReset;
    window.tornRadialResetPosition = resetPosition;
    window.tornRadialSettings = openSettings;
    window.tornRadialSearch = openSearch;
    window.tornRadialCalculator = openCalculator;
    window.tornRadialMiniApps = openMiniApps;
    window.tornRadialCalibrate = startCalibration;
    window.tornRadialExport = () => Storage.exportAll();
    window.tornRadialAddCurrentPage = addCurrentPage;

    // ==================== STARTUP LOG ====================
    console.log('%c🎯 Torn Quick-Travel v1.6.1', 'font-size: 16px; font-weight: bold; color: #4aa3df;');
    console.log('%c✨ NEW in v1.6.1:', 'font-size: 14px; font-weight: bold; color: #3ea34a;');
    console.log('%c  🔍 Search Icon - Now visible in radial menu!', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  📱 PDA Mode - Fully responsive settings UI', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  🎨 Tabbed Settings - Organized interface', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  📐 Dual Calibration - Separate desktop/mobile settings', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  🔔 Smart Notifications - Throttled to prevent spam', 'font-size: 12px; color: #4aa3df;');
    console.log('%c  ⚡ Optimized Code - Dynamic themes & better structure', 'font-size: 12px; color: #4aa3df;');
    console.log('%c⚙️ Keyboard: Ctrl/Cmd + Shift + R', 'font-size: 12px; color: #3ea34a;');
    console.log('%c🎯 Console API:', 'font-size: 12px; color: #FF9500;');
    console.log('%c  tornRadialSettings() - Open settings', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialSearch() - Open search', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialCalculator() - Open calculator', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialMiniApps() - Open mini apps', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialCalibrate() - Start calibration', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialAddCurrentPage() - Add current page', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialExport() - Export all data', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialResetPosition() - Reset position', 'font-size: 11px; color: #9b9b9b;');
    console.log('%c  tornRadialReset() - Full reset (delete all)', 'font-size: 11px; color: #a33a3a;');
    if (typeof GM_registerMenuCommand !== 'undefined') {
        console.log('%c📱 Menu: Click your userscript extension icon', 'font-size: 12px; color: #AF52DE;');
    }
    console.log('%c📱 Device Mode: ' + (isPDA ? 'Mobile/PDA' : 'Desktop'), 'font-size: 12px; font-weight: bold; color: #FF9500;');

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        NotificationManager.destroy();
    });

})();