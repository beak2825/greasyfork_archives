// ==UserScript==
// @name         Torn Radial Utils Library
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Core utilities for Torn Radial Menu
// @author       Sensimillia (2168012)
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

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

    // ==================== STORAGE MANAGER CLASS ====================
    class StorageManager {
        get(key, defaultValue) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error(`Error reading ${key} from localStorage`, e);
                return defaultValue;
            }
        }

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error(`Error saving ${key} to localStorage`, e);
                return false;
            }
        }

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error(`Error removing ${key} from localStorage`, e);
                return false;
            }
        }

        exportAll() {
            const data = {
                settings: this.get('tornRadialSettings', {}),
                loadouts: this.get('tornRadialLoadouts', {}),
                position: this.get('tornRadialPosition', {}),
                usageStats: this.get('tornRadialUsageStats', {}),
                timers: this.get('tornRadialTimers', []),
                notes: this.get('tornRadialNotes', ''),
                searchHistory: this.get('tornRadialSearchHistory', [])
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
                if (data.usageStats) this.set('tornRadialUsageStats', data.usageStats);
                if (data.timers) this.set('tornRadialTimers', data.timers);
                if (data.notes) this.set('tornRadialNotes', data.notes);
                if (data.searchHistory) this.set('tornRadialSearchHistory', data.searchHistory);
                return true;
            } catch (e) {
                console.error('Failed to import data', e);
                return false;
            }
        }
    }

    // ==================== TORN API HANDLER CLASS ====================
    class TornAPI {
        constructor() {
            this.baseUrl = 'https://api.torn.com';
            this.apiKey = '';
            this.storage = new StorageManager();
            const savedKey = this.storage.get('tornRadialApiKey', '');
            if (savedKey) this.apiKey = savedKey;
        }

        setApiKey(key) {
            this.apiKey = key;
            this.storage.set('tornRadialApiKey', key);
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

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${this.baseUrl}${endpoint}&key=${this.apiKey}`,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject(new Error(data.error.error));
                            } else {
                                resolve(data);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: (error) => reject(error)
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
            console.error('Color adjustment failed', e);
            return '#4aa3df';
        }
    }

    function showNotification(message, duration = 3000) {
        try {
            const notification = document.createElement('div');
            notification.className = 'torn-radial-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(27, 27, 27, 0.98);
                border: 2px solid #4aa3df;
                color: #d0d0d0;
                padding: 16px 24px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                z-index: 9999999;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transition = 'all 0.3s ease-out';
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        } catch(e) {
            console.error('Failed to show notification', e);
        }
    }

    // ==================== EXPORT ====================
    window.TornRadialUtils = {
        ErrorLogger: new ErrorLoggerClass(),
        Storage: new StorageManager(),
        API: new TornAPI(),
        adjustBrightness: adjustBrightness,
        showNotification: showNotification
    };

})();