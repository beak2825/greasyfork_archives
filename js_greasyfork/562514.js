// ==UserScript==
// @name         Phantom Portal v2.5.7
// @namespace    http://tampermonkey.net/
// @version      2.5.7
// @description  Torn to Discord sync system with Glass Theme for My Faction and Allies
// @author       Daturax
// @license      GPLv3
// @match        https://www.torn.com/*
// @icon         https://images2.imgbox.com/cc/75/V2yuzaa8_o.png
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_notification
// @connect      api.torn.com
// @connect      *.supabase.co
// @connect      cdn.pixabay.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562514/Phantom%20Portal%20v257.user.js
// @updateURL https://update.greasyfork.org/scripts/562514/Phantom%20Portal%20v257.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TORN_API_KEY = '###PDA-APIKEY###';

    if (window._phantomPortalV2_5_7) {
        console.warn('[Phantom Portal] Already initialized');
        return;
    }
    window._phantomPortalV2_5_7 = true;

    // Safe GM Functions Wrapper
    const SafeGM = {
        getValue: (key, defaultValue) => {
            try {
                return GM_getValue(key, defaultValue);
            } catch (e) {
                console.warn('[Phantom Portal] GM_getValue failed, using fallback');
                try {
                    const value = localStorage.getItem(`pp_${key}`);
                    return value ? JSON.parse(value) : defaultValue;
                } catch {
                    return defaultValue;
                }
            }
        },
        setValue: (key, value) => {
            try {
                GM_setValue(key, value);
            } catch (e) {
                console.warn('[Phantom Portal] GM_setValue failed, using fallback');
                try {
                    localStorage.setItem(`pp_${key}`, JSON.stringify(value));
                } catch {}
            }
        },
        deleteValue: (key) => {
            try {
                GM_deleteValue(key);
            } catch (e) {
                console.warn('[Phantom Portal] GM_deleteValue failed, using fallback');
                try {
                    localStorage.removeItem(`pp_${key}`);
                } catch {}
            }
        },
        addStyle: (css) => {
            try {
                GM_addStyle(css);
            } catch (e) {
                console.warn('[Phantom Portal] GM_addStyle failed, using fallback');
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        },
        notification: (details) => {
            try {
                GM_notification(details);
            } catch (e) {
                console.warn('[Phantom Portal] GM_notification failed');
            }
        },
        xmlhttpRequest: (details) => {
            try {
                return GM_xmlhttpRequest(details);
            } catch (e) {
                console.warn('[Phantom Portal] GM_xmlhttpRequest failed');
                if (details.onerror) details.onerror(e);
            }
        }
    };

    // Nano Theme Manager with Glass Morphism
    class NanoThemeManager {
        constructor() {
            this.currentTheme = this.loadTheme();
            this.applyTheme();
        }

        loadTheme() {
            try {
                const saved = SafeGM.getValue('pp_nano_theme', null);
                if (saved) return saved;
                
                return {
                    primaryColor: '#00ff41',
                    borderColor: '#00ff41',
                    frostBlur: 15,
                    buttonGlow: true,
                    transparency: 0.3,
                    contentOpacity: 0.95,
                    version: '1.3.0'
                };
            } catch (error) {
                console.warn('[Nano Theme] Failed to load theme');
                return this.getDefaultTheme();
            }
        }

        getDefaultTheme() {
            return {
                primaryColor: '#00ff41',
                borderColor: '#00ff41',
                frostBlur: 15,
                buttonGlow: true,
                transparency: 0.3,
                contentOpacity: 0.95,
                version: '1.3.0'
            };
        }

        saveTheme() {
            try {
                SafeGM.setValue('pp_nano_theme', this.currentTheme);
                return true;
            } catch (error) {
                console.error('[Nano Theme] Failed to save theme');
                return false;
            }
        }

        applyTheme() {
            const theme = this.currentTheme;
            
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 255, b: 65 };
            };
            
            const primaryRgb = hexToRgb(theme.primaryColor);
            const borderRgb = hexToRgb(theme.borderColor || theme.primaryColor);
            
            document.documentElement.style.setProperty('--nano-primary-color', theme.primaryColor);
            document.documentElement.style.setProperty('--nano-border-color', theme.borderColor || theme.primaryColor);
            document.documentElement.style.setProperty('--nano-frost-blur', `${theme.frostBlur || 15}px`);
            document.documentElement.style.setProperty('--nano-transparency', theme.transparency || '0.3');
            document.documentElement.style.setProperty('--nano-content-opacity', theme.contentOpacity || '0.95');
            document.documentElement.style.setProperty('--nano-primary-r', primaryRgb.r);
            document.documentElement.style.setProperty('--nano-primary-g', primaryRgb.g);
            document.documentElement.style.setProperty('--nano-primary-b', primaryRgb.b);
            document.documentElement.style.setProperty('--nano-border-r', borderRgb.r);
            document.documentElement.style.setProperty('--nano-border-g', borderRgb.g);
            document.documentElement.style.setProperty('--nano-border-b', borderRgb.b);
            
            document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        }

        updateTheme(updates) {
            this.currentTheme = { ...this.currentTheme, ...updates };
            this.applyTheme();
            this.saveTheme();
            return this.currentTheme;
        }

        resetToDefaults() {
            this.currentTheme = this.getDefaultTheme();
            this.applyTheme();
            this.saveTheme();
            return this.currentTheme;
        }

        getTheme() {
            return { ...this.currentTheme };
        }
    }

    // Main Phantom Portal Class
    class PhantomPortal {
        constructor() {
            console.log('[Phantom Portal v2.5.7] Initializing');
            
            this.supabaseUrl = 'https://gsxihumaebabhkvowqzs.supabase.co';
            this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGlodW1hZWJhYmhrdm93cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDkzMzQsImV4cCI6MjA4MzI4NTMzNH0.OyOMGVdMEXlg6IiLKt1wElQ8AeVvVROr9YQI1-hwKlk';

            this.allowedFactionId = 49511;
            
            this.rooms = {
                '1451524832767250543': { name: 'Portal Chat', type: 'general' },
                '1080875329888997429': { name: 'Banking', type: 'bank' },
                '1080875283160252516': { name: 'War Room', type: 'war' }
            };

            this.state = {
                profile: SafeGM.getValue('pp_profile', null),
                faction: SafeGM.getValue('pp_faction', null),
                lastProfileFetch: SafeGM.getValue('pp_profile_time', 0),
                selectedRoom: SafeGM.getValue('pp_selected_room', '1451524832767250543'),
                buttonCooldowns: SafeGM.getValue('pp_button_cooldowns', {}),
                messageCache: new Map(),
                lastSync: 0,
                roomMessages: SafeGM.getValue('pp_room_messages', {}),
                settings: SafeGM.getValue('pp_settings', {
                    showNotifications: false,
                    autoScroll: true,
                    soundEnabled: false,
                    confirmQuickActions: true,
                    messageInputOffset: 10,
                    showToasts: false
                }),
                isInAllowedFaction: SafeGM.getValue('pp_is_in_allowed_faction', false),
                messageStats: SafeGM.getValue('pp_message_stats', {
                    sent: 0,
                    received: 0,
                    lastLatency: 0,
                    lastMessageTime: 0
                }),
                fabPosition: SafeGM.getValue('pp_fab_position', { x: 20, y: 20 }),
                apiCallCount: SafeGM.getValue('pp_api_call_count', 0),
                lastAPICall: SafeGM.getValue('pp_last_api_call', 0),
                lastFactionCheck: SafeGM.getValue('pp_last_faction_check', 0),
                pollingInterval: 3000,
                refreshCooldown: 0,
                lastOfflineTime: SafeGM.getValue('pp_last_offline_time', 0)
            };

            Object.keys(this.rooms).forEach(roomId => {
                if (!this.state.roomMessages[roomId]) {
                    this.state.roomMessages[roomId] = [];
                }
            });

            this.themeManager = new NanoThemeManager();
            
            this.isOpen = false;
            this.isPolling = false;
            this.pendingMessages = new Set();
            this.pendingNotifications = new Set();
            this.fabPulsing = false;
            this.unreadMessages = 0;
            this.isDragging = false;
            this.isLongPressing = false;
            this.longPressTimer = null;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.fabStartX = 0;
            this.fabStartY = 0;
            this.bountyTargetId = null;
            this.snapThreshold = 5;
            this.lastToastTime = 0;
            this.toastCooldown = 1000;
            this.initialHistoryLoaded = false;
            
            this.intervals = {
                sync: null,
                cooldown: null,
                stats: null,
                backgroundPoll: null,
                factionDaily: null
            };
            
            this.domCache = {
                messages: null,
                input: null,
                sendButton: null,
                profileDisplay: null,
                roomSelector: null,
                quickActions: null,
                messagesContainer: null
            };

            this.alertSoundUrl = 'https://cdn.pixabay.com/download/audio/2025/07/20/376885_b3d2f14d7d.mp3?filename=notification-bell-sound-1-376885.mp3';
            this.audioCache = null;
            this.buttonObserver = null;

            this.initWithRetry();
        }

        async initWithRetry() {
            let attempts = 0;
            const maxAttempts = 3;
            
            const tryInit = async () => {
                attempts++;
                try {
                    await this.init();
                } catch (error) {
                    if (attempts < maxAttempts) {
                        setTimeout(tryInit, 1000);
                    } else {
                        console.error('[Phantom Portal] All initialization attempts failed');
                    }
                }
            };
            
            setTimeout(tryInit, 100);
        }

        async init() {
            this.injectStyles();
            this.createUI();

            try {
                await this.checkUserOverrides();
                await this.fetchProfile();
                await this.checkFaction();
                
                this.startSyncLoop();
                this.startCooldownTicker();
                this.startStatsUpdater();
                this.startBackgroundPolling();
                this.startFactionCheck();
                
                window.addEventListener('beforeunload', () => this.cleanup());
                this.setupViewportHandling();
                this.exposeNanoSnapAPI();
            } catch (error) {
                console.error('[Phantom Portal] Partial initialization error');
            }
        }

        cleanup() {
            Object.values(this.intervals).forEach(interval => {
                if (interval) clearInterval(interval);
            });
            
            if (this.audioCache) {
                this.audioCache.pause();
                this.audioCache.src = '';
                this.audioCache = null;
            }
            
            if (this.longPressTimer) clearTimeout(this.longPressTimer);
            if (this.buttonObserver) this.buttonObserver.disconnect();
            
            delete window.PhantomPortalFAB;
        }

        exposeNanoSnapAPI() {
            window.PhantomPortalFAB = {
                id: 'phantom-portal-fab',
                version: '2.5.7',
                
                getPosition: () => {
                    if (!this.toggleBtn) return null;
                    const rect = this.toggleBtn.getBoundingClientRect();
                    return {
                        x: rect.left,
                        y: rect.top,
                        width: rect.width,
                        height: rect.height,
                        centerX: rect.left + rect.width / 2,
                        centerY: rect.top + rect.height / 2
                    };
                },
                
                getSnapPoints: () => {
                    if (!this.toggleBtn) return [];
                    const rect = this.toggleBtn.getBoundingClientRect();
                    return [
                        { side: 'left', x: rect.left - 5, y: rect.top },
                        { side: 'right', x: rect.right + 5, y: rect.top },
                        { side: 'top', x: rect.left, y: rect.top - 5 },
                        { side: 'bottom', x: rect.left, y: rect.bottom + 5 }
                    ];
                },
                
                isVisible: () => this.toggleBtn && this.toggleBtn.offsetParent !== null
            };
        }

        setupViewportHandling() {
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', this.debounce(() => {
                    this.adjustForKeyboard();
                }, 100));
            }
            
            window.addEventListener('resize', this.debounce(() => {
                this.adjustForKeyboard();
            }, 100));
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        adjustForKeyboard() {
            if (!this.isOpen || !this.container) return;
            
            const offset = this.state.settings.messageInputOffset || 10;
            
            if (this.domCache.messagesContainer) {
                this.domCache.messagesContainer.style.paddingBottom = `${offset}px`;
            }
            
            if (window.visualViewport && window.innerHeight > window.visualViewport.height) {
                const keyboardHeight = window.innerHeight - window.visualViewport.height;
                this.container.style.bottom = `${keyboardHeight + offset}px`;
                this.container.style.transform = 'translate(-50%, 0)';
                this.container.style.top = 'auto';
            } else {
                this.container.style.bottom = 'auto';
                this.container.style.transform = 'translate(-50%, -50%)';
                this.container.style.top = '50%';
            }
        }

        async checkUserOverrides() {
            try {
                const userUrl = SafeGM.getValue('supabase_url');
                const userKey = SafeGM.getValue('supabase_key');
                if (userUrl && userKey) {
                    this.supabaseUrl = userUrl;
                    this.supabaseKey = userKey;
                }
            } catch (error) {
                console.warn('[Phantom Portal] Override check failed');
            }
        }

        async fetchProfile() {
            const now = Date.now();
            if (this.state.profile && (now - this.state.lastProfileFetch < 3600000)) {
                this.updateProfileDisplay();
                return;
            }

            try {
                const apiKey = this.getApiKey();
                if (!apiKey || apiKey.includes('###')) {
                    throw new Error('No API key configured');
                }

                if (!this.canMakeAPICall()) {
                    return;
                }

                const profile = await this.makeTornRequest('/user/basic?selections=profile&striptags=true');
                
                if (profile?.profile) {
                    this.state.profile = {
                        name: this.sanitizeHTML(profile.profile.name),
                        id: parseInt(profile.profile.id) || 0,
                        level: parseInt(profile.profile.level) || 0
                    };
                    this.state.lastProfileFetch = now;
                    SafeGM.setValue('pp_profile', this.state.profile);
                    SafeGM.setValue('pp_profile_time', now);
                    this.updateProfileDisplay();
                } else {
                    throw new Error('Invalid profile response');
                }
            } catch (error) {
                console.error('[Phantom Portal] Profile fetch error');
                this.updateProfileDisplay();
            }
        }

        async checkFaction() {
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            
            if (this.state.faction && (now - this.state.lastFactionCheck < oneHour)) {
                this.state.isInAllowedFaction = (this.state.faction.id === this.allowedFactionId);
                this.updateUIBasedOnFaction();
                return;
            }
            
            await this.fetchFaction();
            this.state.lastFactionCheck = now;
            SafeGM.setValue('pp_last_faction_check', now);
        }

        async fetchFaction() {
            try {
                const apiKey = this.getApiKey();
                if (!apiKey || !this.canMakeAPICall()) {
                    return;
                }

                const factionData = await this.makeTornRequest('/user/faction?');
                
                if (factionData && factionData.error) {
                    this.handleNoFactionData();
                    return;
                }
                
                if (factionData?.faction?.id !== undefined) {
                    this.state.faction = {
                        id: parseInt(factionData.faction.id),
                        name: this.sanitizeHTML(factionData.faction.name || ''),
                        tag: this.sanitizeHTML(factionData.faction.tag || ''),
                        position: this.sanitizeHTML(factionData.faction.position || ''),
                        days_in_faction: parseInt(factionData.faction.days_in_faction) || 0
                    };
                    
                    this.state.isInAllowedFaction = (this.state.faction.id === this.allowedFactionId);
                    
                    SafeGM.setValue('pp_faction', this.state.faction);
                    SafeGM.setValue('pp_is_in_allowed_faction', this.state.isInAllowedFaction);
                    
                    this.updateProfileDisplay();
                    this.updateUIBasedOnFaction();
                } else {
                    this.handleNoFactionData();
                }
            } catch (error) {
                console.error('[Phantom Portal] Faction fetch error');
                this.handleNoFactionData();
            }
        }

        startFactionCheck() {
            if (this.intervals.factionDaily) clearInterval(this.intervals.factionDaily);
            
            this.intervals.factionDaily = setInterval(() => {
                this.checkFaction();
            }, 60 * 60 * 1000);
        }

        canMakeAPICall() {
            const now = Date.now();
            const lastCall = this.state.lastAPICall || 0;
            
            if (now - lastCall > 60000) {
                this.state.apiCallCount = 0;
                this.state.lastAPICall = now;
                SafeGM.setValue('pp_api_call_count', 0);
                SafeGM.setValue('pp_last_api_call', now);
            }
            
            if (this.state.apiCallCount >= 20) return false;
            if (now - lastCall < 3000) return false;
            
            this.state.apiCallCount++;
            this.state.lastAPICall = now;
            SafeGM.setValue('pp_api_call_count', this.state.apiCallCount);
            SafeGM.setValue('pp_last_api_call', now);
            
            return true;
        }

        handleNoFactionData() {
            this.state.isInAllowedFaction = false;
            this.state.faction = null;
            SafeGM.setValue('pp_faction', null);
            SafeGM.setValue('pp_is_in_allowed_faction', false);
            this.updateUIBasedOnFaction();
        }

        updateUIBasedOnFaction() {
            this.updateDOMCache();
            if (!this.domCache.roomSelector || !this.domCache.quickActions) return;

            this.domCache.roomSelector.innerHTML = '';
            
            Object.entries(this.rooms).forEach(([id, room]) => {
                if (room.type === 'general' || this.state.isInAllowedFaction) {
                    const btn = document.createElement('button');
                    btn.className = 'pp-room-btn';
                    if (id === this.state.selectedRoom) btn.classList.add('active');
                    btn.textContent = room.name;
                    btn.dataset.roomId = id;
                    btn.addEventListener('click', () => this.switchRoom(id));
                    this.domCache.roomSelector.appendChild(btn);
                }
            });

            const bankerBtn = this.domCache.quickActions.querySelector('.pp-action-btn.banker');
            if (bankerBtn) {
                bankerBtn.style.display = this.state.isInAllowedFaction ? '' : 'none';
            }

            if (!this.isRoomAccessible(this.state.selectedRoom)) {
                const portalChatId = '1451524832767250543';
                this.state.selectedRoom = portalChatId;
                SafeGM.setValue('pp_selected_room', portalChatId);
                
                this.domCache.roomSelector.querySelectorAll('.pp-room-btn').forEach(b => b.classList.remove('active'));
                const activeBtn = this.domCache.roomSelector.querySelector(`.pp-room-btn[data-room-id="${portalChatId}"]`);
                if (activeBtn) activeBtn.classList.add('active');
                
                this.state.messageCache.clear();
                if (this.domCache.messagesContainer) {
                    this.domCache.messagesContainer.innerHTML = '';
                }
                this.loadRoomHistory();
            }
        }

        switchRoom(roomId) {
            const inputWasFocused = this.domCache.input && document.activeElement === this.domCache.input;
            
            this.state.selectedRoom = roomId;
            SafeGM.setValue('pp_selected_room', roomId);
            
            this.updateDOMCache();
            if (!this.domCache.roomSelector) return;
            
            this.domCache.roomSelector.querySelectorAll('.pp-room-btn').forEach(b => b.classList.remove('active'));
            const activeBtn = this.domCache.roomSelector.querySelector(`.pp-room-btn[data-room-id="${roomId}"]`);
            if (activeBtn) activeBtn.classList.add('active');
            
            this.state.messageCache.clear();
            if (this.domCache.messagesContainer) {
                this.domCache.messagesContainer.innerHTML = '';
            }
            
            this.loadRoomHistory();
            
            if (this.unreadMessages > 0) {
                this.unreadMessages = 0;
                this.updateFABPulse();
            }
            
            if (inputWasFocused && this.domCache.input) {
                setTimeout(() => {
                    this.domCache.input.focus();
                }, 10);
            }
        }

        async makeTornRequest(endpoint) {
            const apiKey = this.getApiKey();
            if (!apiKey) throw new Error('No API key available');

            return new Promise((resolve, reject) => {
                const hasQuery = endpoint.includes('?');
                const url = `https://api.torn.com/v2${endpoint}${hasQuery ? '&' : '?'}key=${apiKey}`;
                
                SafeGM.xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'Accept': 'application/json' },
                    timeout: 8000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        }

        getApiKey() {
            if (TORN_API_KEY && !TORN_API_KEY.includes('###')) {
                return this.sanitizeAPIKey(TORN_API_KEY);
            }

            const scriptTags = document.querySelectorAll('script');
            for (const script of scriptTags) {
                if (script.textContent.includes('apiKey') || script.textContent.includes('PDA-APIKEY')) {
                    const match = script.textContent.match(/"apiKey"\s*:\s*"([^"]+)"/) ||
                                 script.textContent.match(/"###PDA-APIKEY###":\s*"([^"]+)"/);
                    if (match) {
                        return this.sanitizeAPIKey(match[1]);
                    }
                }
            }
            
            return null;
        }

        sanitizeHTML(str) {
            if (typeof str !== 'string') return '';
            
            const div = document.createElement('div');
            div.textContent = str;
            
            let sanitized = div.innerHTML
                .replace(/<[^>]*>/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
                .replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
            
            if (sanitized.includes('<') || sanitized.includes('>')) {
                sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            
            return sanitized;
        }

        sanitizeAPIKey(key) {
            if (typeof key !== 'string') return '';
            return key.replace(/[^a-zA-Z0-9]/g, '');
        }

        updateProfileDisplay() {
            this.updateDOMCache();
            if (!this.domCache.profileDisplay) return;

            if (this.state.profile?.name) {
                let displayText = this.state.profile.name;
                let displayTitle = `Level ${this.state.profile.level}`;
                
                if (this.state.faction) {
                    displayText += ` [${this.state.faction.tag}]`;
                    displayTitle += ` | ${this.state.faction.name} | ${this.state.faction.position}`;
                }
                
                this.domCache.profileDisplay.textContent = displayText;
                this.domCache.profileDisplay.title = displayTitle;
                this.domCache.profileDisplay.className = 'pp-profile-display connected';
            } else {
                this.domCache.profileDisplay.textContent = 'API Key Required';
                this.domCache.profileDisplay.className = 'pp-profile-display guest';
            }
        }

        createQuickActions() {
            const actions = [
                { id: 'revive', icon: '🏥', label: 'Revive', role: '@Reviver' },
                { id: 'assist', icon: '🔫', label: 'Assist', role: '@Synthesis Members' },
                { id: 'mercenary', icon: '⚔️', label: 'Merc', role: '@Mercenary' },
                { id: 'banker', icon: '💰', label: 'Banker', role: '@Banker' },
                { id: 'trader', icon: '🔄', label: 'Trader', role: '@Trader' },
                { id: 'bounty', icon: '🎯', label: 'Bounty', role: '@bounty' },
                { id: 'settings', icon: '⚙️', label: 'Settings', role: null }
            ];

            const container = document.createElement('div');
            container.className = 'pp-quick-actions';

            actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `pp-action-btn ${action.id}`;
                btn.innerHTML = action.icon;
                btn.title = action.label + (action.role ? ` - ${action.role}` : '');
                
                const cooldown = this.state.buttonCooldowns[action.id];
                if (cooldown && Date.now() - cooldown < 10000) {
                    btn.classList.add('cooldown');
                }

                if (action.id === 'settings') {
                    btn.addEventListener('click', () => this.openSettings());
                } else {
                    btn.addEventListener('click', () => this.handleQuickAction(action));
                }
                
                container.appendChild(btn);
            });

            return container;
        }

        async handleQuickAction(action) {
            if (action.id === 'banker' && !this.state.isInAllowedFaction) {
                this.showToast('Banker access requires faction membership', 'error');
                return;
            }

            const now = Date.now();
            const cooldown = this.state.buttonCooldowns[action.id];
            if (cooldown && now - cooldown < 10000) {
                const remaining = Math.ceil((10000 - (now - cooldown)) / 1000);
                this.showToast(`${action.label} cooldown: ${remaining}s`, 'warning');
                return;
            }

            if (action.id === 'bounty') {
                const targetId = prompt('Enter Torn Profile ID for the bounty target:');
                if (!targetId) {
                    this.showToast('Bounty cancelled', 'warning');
                    return;
                }
                
                if (!/^\d+$/.test(targetId.trim())) {
                    this.showToast('Invalid Profile ID. Please enter numbers only.', 'error');
                    return;
                }
                
                this.bountyTargetId = targetId.trim();
            }

            if (this.state.settings.confirmQuickActions && action.id !== 'settings') {
                const confirmed = await this.showConfirmation(
                    `Send ${action.label} request?`,
                    `This will send a request to ${action.role || 'the channel'}.`,
                    action.label
                );
                
                if (!confirmed) {
                    this.bountyTargetId = null;
                    return;
                }
            }

            this.state.buttonCooldowns[action.id] = now;
            SafeGM.setValue('pp_button_cooldowns', this.state.buttonCooldowns);

            const btn = document.querySelector(`.pp-action-btn.${action.id}`);
            if (btn) {
                btn.classList.add('cooldown');
                setTimeout(() => btn.classList.remove('cooldown'), 10000);
            }

            if (this.state.settings.showToasts) {
                let toastMessage = '';
                const userName = this.state.profile?.name || 'Someone';
                
                switch(action.id) {
                    case 'revive': toastMessage = `${userName} needs a Revive`; break;
                    case 'assist': toastMessage = `${userName} needs Assistance`; break;
                    case 'mercenary': toastMessage = `${userName} needs a Mercenary`; break;
                    case 'banker': toastMessage = `${userName} needs a Banker`; break;
                    case 'trader': toastMessage = `${userName} wants to Trade`; break;
                    case 'bounty': toastMessage = `${userName} request a Bounty`; break;
                    default: toastMessage = `${userName} needs ${action.label}`;
                }
                
                this.showToast(toastMessage, 'warning');
            }

            let message = '';
            let roomId = '1451524832767250543';
            
            switch(action.id) {
                case 'revive':
                    if (this.state.profile?.id) {
                        const profileUrl = this.cleanLink(`https://www.torn.com/profiles.php?XID=${this.state.profile.id}`);
                        message = `${action.role} ${this.state.profile.name} needs a Revive: ${profileUrl}`;
                    } else {
                        message = `${action.role} Someone needs a Revive`;
                    }
                    break;
                    
                case 'assist':
                    const currentUrl = window.location.href;
                    if (currentUrl.includes('loader.php?sid=attack') && currentUrl.includes('user2ID=')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        const targetId = urlParams.get('user2ID');
                        if (targetId) {
                            const attackUrl = this.cleanLink(`https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`);
                            message = `${action.role} ${this.state.profile?.name || 'Someone'} needs Assistance: ${attackUrl}`;
                        } else {
                            message = `${action.role} ${this.state.profile?.name || 'Someone'} needs Assistance`;
                        }
                    } else {
                        message = `${action.role} ${this.state.profile?.name || 'Someone'} needs Assistance`;
                    }
                    break;
                    
                case 'trader':
                    if (this.state.profile?.id) {
                        const tradeUrl = this.cleanLink(`https://www.torn.com/trade.php#step=start&userID=${this.state.profile.id}`);
                        message = `${action.role} ${this.state.profile.name} wants to Trade: ${tradeUrl}`;
                    } else {
                        message = `${action.role} Someone wants to Trade`;
                    }
                    break;
                    
                case 'bounty':
                    if (this.bountyTargetId) {
                        const bountyUrl = this.cleanLink(`https://www.torn.com/bounties.php?p=add&XID=${this.bountyTargetId}`);
                        message = `${action.role} ${this.state.profile?.name || 'Someone'} request a Bounty: ${bountyUrl}`;
                        this.bountyTargetId = null;
                    } else {
                        message = `${action.role} ${this.state.profile?.name || 'Someone'} request a Bounty`;
                    }
                    break;
                    
                case 'banker':
                    roomId = '1080875329888997429';
                    const bankerUrl = this.cleanLink('https://www.torn.com/factions.php?step=your&type=1#/tab=controls');
                    message = `${action.role} ${this.state.profile?.name || 'Someone'} needs a Banker: ${bankerUrl}`;
                    break;
                    
                case 'mercenary':
                    if (this.state.profile?.id) {
                        const mercenaryUrl = this.cleanLink(`https://www.torn.com/profiles.php?XID=${this.state.profile.id}`);
                        message = `${action.role} ${this.state.profile.name} needs a Mercenary: ${mercenaryUrl}`;
                    } else {
                        message = `${action.role} Someone needs a Mercenary`;
                    }
                    break;
                    
                default:
                    message = `${action.role} ${this.state.profile?.name || 'Someone'} needs ${action.label}`;
            }

            const messageHash = this.generateMessageHash(message, now, roomId);
            this.pendingMessages.add(messageHash);

            const success = await this.sendToSupabase(message, roomId, true);

            if (success) {
                if (roomId === this.state.selectedRoom) {
                    this.addMessage(message, 'out', action.label, null, now, `temp_${messageHash}`);
                }
                setTimeout(() => this.pendingMessages.delete(messageHash), 30000);
            } else {
                this.showToast(`${action.label} failed to send`, 'error');
                this.pendingMessages.delete(messageHash);
            }
        }

        cleanLink(url) {
            return url.replace(/amp;/g, '');
        }

        async showConfirmation(title, message, actionLabel) {
            return new Promise((resolve) => {
                const modal = document.createElement('div');
                modal.className = 'pp-confirm-modal';
                
                modal.innerHTML = `
                    <div class="pp-confirm-content">
                        <div class="pp-confirm-header">
                            <h4>${title}</h4>
                            <button class="pp-confirm-close">&times;</button>
                        </div>
                        <div class="pp-confirm-body">
                            <p>${message}</p>
                        </div>
                        <div class="pp-confirm-buttons">
                            <button class="pp-confirm-btn confirm" data-action="confirm">Send ${actionLabel}</button>
                            <button class="pp-confirm-btn cancel" data-action="cancel">Cancel</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                const closeModal = (result) => {
                    modal.remove();
                    resolve(result);
                };

                modal.querySelector('.pp-confirm-close').addEventListener('click', () => closeModal(false));
                modal.querySelector('.pp-confirm-btn.confirm').addEventListener('click', () => closeModal(true));
                modal.querySelector('.pp-confirm-btn.cancel').addEventListener('click', () => closeModal(false));
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal(false);
                });
            });
        }

        async sendToSupabase(message, roomId, alert = false) {
            if (!this.state.profile?.name) {
                return false;
            }

            try {
                const sanitizedMessage = this.sanitizeHTML(message);
                const sanitizedName = this.sanitizeHTML(this.state.profile.name);
                
                const response = await this.supabaseRequest('POST', '/rest/v1/rpc/insert_message_from_torn', {
                    p_torn_profile_name: sanitizedName,
                    p_torn_profile_id: this.state.profile.id.toString(),
                    p_room_id: roomId,
                    p_message: sanitizedMessage,
                    p_alert: alert
                });
                
                return !!response;
            } catch (error) {
                console.error('[Phantom Portal] Supabase send error');
                return false;
            }
        }

        async sendMessage() {
            this.updateDOMCache();
            if (!this.domCache.input) return;
            
            const message = this.domCache.input.value.trim();
            if (!message) return;

            const sanitizedMessage = this.sanitizeHTML(message);
            if (!sanitizedMessage) {
                this.showToast('Invalid message', 'error');
                return;
            }

            const now = Date.now();
            const messageHash = this.generateMessageHash(sanitizedMessage, now, this.state.selectedRoom);
            if (this.pendingMessages.has(messageHash)) return;

            this.pendingMessages.add(messageHash);
            this.domCache.input.value = '';
            this.addMessage(sanitizedMessage, 'out', 'normal', null, now, `temp_${messageHash}`);

            const success = await this.sendToSupabase(sanitizedMessage, this.state.selectedRoom, false);

            if (success) {
                setTimeout(() => this.pendingMessages.delete(messageHash), 30000);
            } else {
                this.showToast('Send failed', 'error');
                this.pendingMessages.delete(messageHash);
                this.removeTemporaryMessage(`temp_${messageHash}`);
                this.domCache.input.value = sanitizedMessage;
            }
        }

        async fetchMessages(showToasts = false, forceRefresh = false) {
            if (this.isPolling || !this.isRoomAccessible(this.state.selectedRoom)) {
                this.isPolling = false;
                return;
            }

            this.isPolling = true;
            try {
                const now = Date.now();
                if (now - this.state.lastSync < 1000 && !forceRefresh) {
                    this.isPolling = false;
                    return;
                }

                // Calculate time window - include messages since last offline or last 5 minutes
                let timeWindow = new Date(now - 5 * 60000); // Default: last 5 minutes
                
                // Check if we have offline time stored and need to get older messages
                if (this.state.lastOfflineTime > 0 && !this.initialHistoryLoaded) {
                    const offlineTime = new Date(this.state.lastOfflineTime);
                    // Get messages from the later of: last offline time or 1 hour ago (to prevent loading too much)
                    const oneHourAgo = new Date(now - 60 * 60000);
                    timeWindow = new Date(Math.min(offlineTime.getTime(), oneHourAgo.getTime()));
                    console.log('[Phantom Portal] Loading messages since last offline time:', timeWindow);
                }
                
                const timeWindowISO = timeWindow.toISOString();
                
                const response = await this.supabaseRequest('GET',
                    `/rest/v1/portal_messages?room_id=eq.${this.state.selectedRoom}` +
                    `&created_at=gt.${timeWindowISO}` +
                    `&order=created_at.asc&limit=100` // Changed to asc to get messages in chronological order
                );

                if (response && Array.isArray(response) && response.length > 0) {
                    const messagesToAdd = [];
                    
                    for (const msg of response) {
                        if (!this.isRoomAccessible(msg.room_id)) continue;

                        let sanitizedMessage = this.sanitizeHTML(msg.message || '');
                        sanitizedMessage = this.cleanLink(sanitizedMessage);
                        
                        const sanitizedSender = this.sanitizeHTML(msg.torn_profile_name || msg.discord_name || 'Unknown');
                        const msgHash = this.generateMessageHash(
                            sanitizedMessage, 
                            new Date(msg.created_at || Date.now()).getTime(),
                            sanitizedSender,
                            msg.room_id
                        );
                        
                        if (this.pendingMessages.has(msgHash) || this.state.messageCache.has(msg.sync_id)) {
                            continue;
                        }

                        if (this.findExistingMessage(sanitizedMessage, new Date(msg.created_at).getTime(), sanitizedSender, msg.room_id)) {
                            this.state.messageCache.set(msg.sync_id, true);
                            continue;
                        }

                        if (msg.room_id === this.state.selectedRoom) {
                            messagesToAdd.push({
                                msg,
                                sanitizedMessage,
                                sanitizedSender,
                                msgHash,
                                sync_id: msg.sync_id
                            });
                        }

                        this.state.messageCache.set(msg.sync_id, true);
                        this.addToRoomHistory({
                            ...msg,
                            message: sanitizedMessage,
                            torn_profile_name: sanitizedSender
                        });

                        if (msg.discord_id) {
                            this.state.messageStats.received++;
                            this.state.messageStats.lastMessageTime = Date.now();
                            SafeGM.setValue('pp_message_stats', this.state.messageStats);
                        }

                        if (msg.alert && !msg.discord_id) {
                            const messageTime = new Date(msg.created_at || Date.now()).getTime();
                            if (now - messageTime < 300000 && !this.pendingNotifications.has(msg.sync_id)) {
                                this.showAlertToast(sanitizedMessage, sanitizedSender);
                                this.pendingNotifications.add(msg.sync_id);
                                setTimeout(() => this.pendingNotifications.delete(msg.sync_id), 300000);
                            }
                        }

                        if (showToasts && !msg.alert && msg.discord_id && now - new Date(msg.created_at).getTime() < 30000) {
                            const shortMessage = sanitizedMessage.length > 50 
                                ? sanitizedMessage.substring(0, 47) + '...' 
                                : sanitizedMessage;
                            this.showToast(`${sanitizedSender}: ${shortMessage}`, 'info');
                        }
                    }
                    
                    if (this.isOpen || forceRefresh) {
                        messagesToAdd.forEach(({ msg, sanitizedMessage, sanitizedSender }) => {
                            this.addMessage(
                                sanitizedMessage,
                                msg.discord_id ? 'in' : 'out',
                                msg.alert ? 'alert' : 'normal',
                                sanitizedSender,
                                msg.created_at || new Date().toISOString(),
                                msg.sync_id
                            );
                        });
                    }
                    
                    if (!this.isOpen && messagesToAdd.length > 0 && !forceRefresh) {
                        this.unreadMessages += messagesToAdd.length;
                        this.updateFABPulse();
                        if (!this.isOpen) this.triggerFABPulse();
                    }
                    
                    // Mark initial history as loaded
                    if (this.state.lastOfflineTime > 0 && !this.initialHistoryLoaded) {
                        this.initialHistoryLoaded = true;
                        this.state.lastOfflineTime = 0;
                        SafeGM.setValue('pp_last_offline_time', 0);
                    }
                    
                    this.cleanupMessageCache();
                }
                this.state.lastSync = now;
            } catch (error) {
                console.error('[Phantom Portal] Fetch messages error');
            } finally {
                this.isPolling = false;
            }
        }

        async startBackgroundPolling() {
            if (this.intervals.backgroundPoll) clearInterval(this.intervals.backgroundPoll);
            
            this.intervals.backgroundPoll = setInterval(async () => {
                try {
                    for (const [roomId, room] of Object.entries(this.rooms)) {
                        if (!this.isRoomAccessible(roomId)) continue;
                        
                        const now = Date.now();
                        const oneMinuteAgo = new Date(now - 60000).toISOString();
                        
                        const response = await this.supabaseRequest('GET',
                            `/rest/v1/portal_messages?room_id=eq.${roomId}` +
                            `&created_at=gt.${oneMinuteAgo}` +
                            `&order=created_at.desc&limit=5`
                        );

                        if (response && Array.isArray(response) && response.length > 0) {
                            for (const msg of response.reverse()) {
                                let sanitizedMessage = this.sanitizeHTML(msg.message || '');
                                sanitizedMessage = this.cleanLink(sanitizedMessage);
                                
                                const sanitizedSender = this.sanitizeHTML(msg.torn_profile_name || msg.discord_name || 'Unknown');
                                const msgHash = this.generateMessageHash(
                                    sanitizedMessage, 
                                    new Date(msg.created_at || Date.now()).getTime(),
                                    sanitizedSender,
                                    msg.room_id
                                );
                                
                                if (this.pendingMessages.has(msgHash) || this.state.messageCache.has(msg.sync_id)) {
                                    continue;
                                }

                                this.state.messageCache.set(msg.sync_id, true);
                                
                                if (msg.alert && !msg.discord_id) {
                                    const messageTime = new Date(msg.created_at || Date.now()).getTime();
                                    if (now - messageTime < 300000 && !this.pendingNotifications.has(msg.sync_id)) {
                                        this.showAlertToast(sanitizedMessage, sanitizedSender);
                                        this.pendingNotifications.add(msg.sync_id);
                                        setTimeout(() => this.pendingNotifications.delete(msg.sync_id), 300000);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    // Silent error - background polling failures shouldn't break the app
                }
            }, 5000);
        }

        isRoomAccessible(roomId) {
            const room = this.rooms[roomId];
            if (!room) return false;
            if (room.type === 'general') return true;
            return this.state.isInAllowedFaction;
        }

        async playAlertSound() {
            if (!this.state.settings.soundEnabled) return;

            try {
                if (!this.audioCache) {
                    this.audioCache = new Audio(this.alertSoundUrl);
                    this.audioCache.preload = 'auto';
                }
                
                const now = Date.now();
                const lastPlay = this.audioPlaybackAttempts || 0;
                if (now - lastPlay < 1000) return;
                
                this.audioCache.currentTime = 0;
                await this.audioCache.play();
                this.audioPlaybackAttempts = now;
            } catch (error) {
                console.warn('[Phantom Portal] Audio play error');
            }
        }

        showAlertToast(message, sender) {
            if (!this.state.settings.showToasts) return;
            
            let toastMessage = message;
            
            toastMessage = toastMessage.replace(/https?:\/\/[^\s]+/g, '');
            toastMessage = toastMessage.replace(/@\w+\s*/g, '');
            toastMessage = toastMessage.replace(/\s+/g, ' ').trim();
            toastMessage = toastMessage.replace(/:\s*$/, '');
            
            if (sender && toastMessage.includes(sender)) {
                toastMessage = toastMessage.replace(new RegExp(`^${sender}\\s*`, 'i'), '');
            }
            
            toastMessage = toastMessage.charAt(0).toUpperCase() + toastMessage.slice(1);
            
            this.showToast(toastMessage, 'warning');
        }

        generateMessageHash(content, timestamp, sender = null, roomId = null) {
            const data = `${content}|${timestamp}|${sender}|${roomId}|${Math.random().toString(36).substr(2, 9)}`;
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return `${hash.toString(36)}_${Date.now().toString(36)}`;
        }

        findExistingMessage(content, timestamp, sender, roomId) {
            if (roomId !== this.state.selectedRoom) return null;
            
            this.updateDOMCache();
            if (!this.domCache.messagesContainer) return null;

            const messages = this.domCache.messagesContainer.querySelectorAll('.pp-message');
            for (const msgEl of messages) {
                const textEl = msgEl.querySelector('.message-text');
                const timeEl = msgEl.querySelector('.message-time');
                const senderEl = msgEl.querySelector('.message-sender');
                
                if (textEl && textEl.textContent === content) {
                    const msgTime = this.extractTimeFromElement(timeEl);
                    if (Math.abs(msgTime - timestamp) < 2000) {
                        if (!sender || (senderEl && senderEl.textContent === sender)) {
                            return msgEl;
                        }
                    }
                }
            }
            return null;
        }

        extractTimeFromElement(timeEl) {
            if (!timeEl) return Date.now();
            const timeText = timeEl.textContent;
            const [hours, minutes] = timeText.split(':').map(Number);
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
        }

        addToRoomHistory(msg) {
            const roomId = msg.room_id || this.state.selectedRoom;
            if (!this.state.roomMessages[roomId]) {
                this.state.roomMessages[roomId] = [];
            }

            const roomMessages = this.state.roomMessages[roomId];
            const exists = roomMessages.some(existing => existing.sync_id === msg.sync_id);

            if (!exists) {
                if (roomMessages.length >= 200) {
                    roomMessages.shift();
                }
                roomMessages.push({
                    sync_id: msg.sync_id,
                    message: msg.message,
                    created_at: msg.created_at,
                    torn_profile_name: msg.torn_profile_name,
                    discord_name: msg.discord_name,
                    alert: msg.alert,
                    room_id: roomId
                });

                SafeGM.setValue('pp_room_messages', this.state.roomMessages);
            }
        }

        loadRoomHistory() {
            this.updateDOMCache();
            if (!this.domCache.messagesContainer) return;

            this.domCache.messagesContainer.innerHTML = '';
            const roomHistory = this.state.roomMessages[this.state.selectedRoom] || [];
            
            roomHistory.forEach(msg => {
                if (msg.room_id === this.state.selectedRoom || !msg.room_id) {
                    this.addMessage(
                        msg.message || '',
                        msg.discord_name ? 'in' : 'out',
                        msg.alert ? 'alert' : 'normal',
                        msg.torn_profile_name || msg.discord_name || 'Unknown',
                        msg.created_at || new Date().toISOString(),
                        msg.sync_id
                    );
                    if (msg.sync_id) this.state.messageCache.set(msg.sync_id, true);
                }
            });
            
            // After loading local history, fetch any newer messages from server
            this.fetchMessages(false, true);
        }

        cleanupMessageCache() {
            if (this.state.messageCache.size > 500) {
                const iterator = this.state.messageCache.keys();
                let count = 0;
                while (count < 200 && this.state.messageCache.size > 200) {
                    const key = iterator.next().value;
                    if (key) {
                        this.state.messageCache.delete(key);
                        count++;
                    }
                }
            }
        }

        removeTemporaryMessage(tempId) {
            const msgEl = document.querySelector(`.pp-message[data-temp-id="${tempId}"]`);
            if (msgEl && msgEl.parentNode) {
                msgEl.parentNode.removeChild(msgEl);
            }
        }

        addMessage(content, direction, type = 'normal', sender = null, timestamp = null, sync_id = null) {
            this.updateDOMCache();
            if (!this.domCache.messagesContainer) return;

            const msgEl = document.createElement('div');
            msgEl.className = `pp-message message-${direction}`;
            if (sync_id) {
                if (sync_id.startsWith('temp_')) {
                    msgEl.setAttribute('data-temp-id', sync_id);
                } else {
                    msgEl.setAttribute('data-sync-id', sync_id);
                }
            }

            if (sender) {
                const senderEl = document.createElement('div');
                senderEl.className = 'message-sender';
                senderEl.textContent = sender;
                msgEl.appendChild(senderEl);
            }

            if (type === 'alert') {
                const badge = document.createElement('span');
                badge.className = 'message-badge alert';
                badge.textContent = 'ALERT';
                msgEl.appendChild(badge);
            }

            const textEl = document.createElement('div');
            textEl.className = 'message-text';
            const cleanedContent = this.cleanLink(content);
            textEl.innerHTML = this.linkify(cleanedContent);
            msgEl.appendChild(textEl);

            const timeEl = document.createElement('div');
            timeEl.className = 'message-time';
            timeEl.textContent = new Date(timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            msgEl.appendChild(timeEl);

            this.domCache.messagesContainer.appendChild(msgEl);

            if (direction === 'out' && !sync_id?.startsWith('temp_')) {
                this.state.messageStats.sent++;
                this.state.messageStats.lastMessageTime = Date.now();
                SafeGM.setValue('pp_message_stats', this.state.messageStats);
            }

            if (this.state.settings.autoScroll) {
                setTimeout(() => {
                    if (this.domCache.messagesContainer) {
                        this.domCache.messagesContainer.scrollTop = this.domCache.messagesContainer.scrollHeight;
                    }
                }, 10);
            }
        }

        linkify(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, (url) => {
                const cleanUrl = url.replace(/[<>"'`]/g, '').replace(/amp;/g, '');
                return '<a href="' + cleanUrl + '" target="_blank" rel="noopener noreferrer" style="color: var(--nano-primary-color); text-decoration: underline;">' + cleanUrl + '</a>';
            });
        }

        showToast(message, type = 'info') {
            if (!this.state.settings.showToasts && type !== 'error') return;
            
            const now = Date.now();
            if (now - this.lastToastTime < this.toastCooldown) return;
            this.lastToastTime = now;
            
            document.querySelectorAll('.pp-toast').forEach(toast => toast.remove());
            
            const toast = document.createElement('div');
            toast.className = `pp-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 3000);
        }

        triggerFABPulse() {
            if (this.fabPulsing) return;
            this.fabPulsing = true;
            this.toggleBtn.classList.add('pulsing');
            setTimeout(() => {
                this.toggleBtn.classList.remove('pulsing');
                this.fabPulsing = false;
            }, 10000);
        }

        updateFABPulse() {
            if (this.unreadMessages > 0 && !this.isOpen) {
                if (!this.fabPulsing) {
                    this.fabPulsing = true;
                    this.toggleBtn.classList.add('pulsing');
                }
            } else {
                this.fabPulsing = false;
                this.toggleBtn.classList.remove('pulsing');
            }
        }

        findNearbyFABs(x, y) {
            const allElements = document.querySelectorAll('*');
            const nearbyFABs = [];
            
            for (const element of allElements) {
                if (element === this.toggleBtn) continue;
                
                const style = window.getComputedStyle(element);
                if (style.position !== 'fixed') continue;
                
                const rect = element.getBoundingClientRect();
                if (rect.width < 40 || rect.width > 100) continue;
                if (rect.height < 40 || rect.height > 100) continue;
                
                const elementCenterX = rect.left + rect.width / 2;
                const elementCenterY = rect.top + rect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(x - elementCenterX, 2) + 
                    Math.pow(y - elementCenterY, 2)
                );
                
                if (distance < this.snapThreshold) {
                    nearbyFABs.push({
                        element: element,
                        rect: rect,
                        distance: distance
                    });
                }
            }
            
            nearbyFABs.sort((a, b) => a.distance - b.distance);
            return nearbyFABs;
        }

        snapToNearbyFAB(x, y) {
            const nearbyFABs = this.findNearbyFABs(x, y);
            if (nearbyFABs.length === 0) return { x, y };
            
            const closest = nearbyFABs[0];
            const fabRect = this.toggleBtn.getBoundingClientRect();
            const targetRect = closest.rect;
            
            const leftDistance = Math.abs(x - targetRect.left);
            const rightDistance = Math.abs(x - targetRect.right);
            const topDistance = Math.abs(y - targetRect.top);
            const bottomDistance = Math.abs(y - targetRect.bottom);
            
            let snappedX = x;
            let snappedY = y;
            
            if (leftDistance < rightDistance) {
                snappedX = targetRect.left - fabRect.width - 5;
            } else {
                snappedX = targetRect.right + 5;
            }
            
            if (topDistance < bottomDistance) {
                snappedY = targetRect.top;
            } else {
                snappedY = targetRect.bottom - fabRect.height;
            }
            
            return { x: snappedX, y: snappedY };
        }

        openSettings() {
            const modal = document.createElement('div');
            modal.className = 'pp-settings-modal';
            
            const profileName = this.state.profile?.name || 'Not loaded';
            const profileId = this.state.profile?.id || 'N/A';
            const factionName = this.state.faction?.name || 'No faction';
            const factionAccess = this.state.isInAllowedFaction ? '✓ Full Access' : '✗ Limited Access';
            
            const now = Date.now();
            const lastMsgTime = this.state.messageStats.lastMessageTime;
            const latency = lastMsgTime > 0 ? Math.max(0, Math.floor((now - lastMsgTime) / 1000)) : 0;
            
            modal.innerHTML = `
                <div class="pp-settings-content">
                    <div class="pp-settings-header">
                        <h3>Phantom Portal Settings v2.5.7</h3>
                        <button class="pp-settings-close">&times;</button>
                    </div>
                    <div class="pp-settings-body">
                        <div class="pp-profile-info">
                            <h4>Profile Information</h4>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Torn Profile:</span>
                                <span class="pp-info-value" id="pp-current-profile-name">${profileName}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Profile ID:</span>
                                <span class="pp-info-value" id="pp-current-profile-id">${profileId}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Faction:</span>
                                <span class="pp-info-value" id="pp-current-faction-name">${factionName}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Access Level:</span>
                                <span class="pp-info-value ${this.state.isInAllowedFaction ? 'access-granted' : 'access-denied'}" id="pp-current-access">${factionAccess}</span>
                            </div>
                        </div>
                        
                        <div class="pp-settings-section">
                            <h4>Message Statistics</h4>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Messages Sent:</span>
                                <span class="pp-info-value" id="pp-messages-sent">${this.state.messageStats.sent}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Messages Received:</span>
                                <span class="pp-info-value" id="pp-messages-received">${this.state.messageStats.received}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Last Message Latency:</span>
                                <span class="pp-info-value ${latency < 10 ? 'access-granted' : latency < 30 ? '' : 'access-denied'}" id="pp-message-latency">${latency} seconds ago</span>
                            </div>
                        </div>
                        
                        <div class="pp-settings-section">
                            <h4>Preferences</h4>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" class="pp-setting-checkbox" data-setting="showNotifications" ${this.state.settings.showNotifications ? 'checked' : ''}>
                                    Show Browser Notifications
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" class="pp-setting-checkbox" data-setting="autoScroll" ${this.state.settings.autoScroll ? 'checked' : ''}>
                                    Auto-scroll Messages
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" class="pp-setting-checkbox" data-setting="soundEnabled" ${this.state.settings.soundEnabled ? 'checked' : ''}>
                                    Enable Alert Sounds
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" class="pp-setting-checkbox" data-setting="confirmQuickActions" ${this.state.settings.confirmQuickActions ? 'checked' : ''}>
                                    Confirm Quick Actions
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" class="pp-setting-checkbox" data-setting="showToasts" ${this.state.settings.showToasts ? 'checked' : ''}>
                                    Show Toasts
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    Message Input Offset (px):
                                    <input type="number" class="pp-setting-input" data-setting="messageInputOffset" value="${this.state.settings.messageInputOffset || 10}" min="0" max="100" step="1">
                                </label>
                            </div>
                        </div>
                        
                        <div class="pp-settings-buttons">
                            <button class="pp-settings-btn" id="pp-refresh-profile" ${this.state.refreshCooldown > Date.now() ? 'disabled' : ''}>
                                ${this.state.refreshCooldown > Date.now() ? '⏳ Cooldown...' : '🔄 Refresh Profile'}
                            </button>
                            <button class="pp-settings-btn" id="pp-theme-settings">
                                🎨 Glass Theme Settings
                            </button>
                            <button class="pp-settings-btn" id="pp-clear-messages">
                                🗑️ Clear Messages
                            </button>
                            <button class="pp-settings-btn" id="pp-reload-messages">
                                📥 Reload Recent Messages
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.pp-settings-close');
            closeBtn.addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => { 
                if (e.target === modal) modal.remove(); 
            });

            const checkboxes = modal.querySelectorAll('.pp-setting-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const setting = e.target.dataset.setting;
                    this.state.settings[setting] = e.target.checked;
                    SafeGM.setValue('pp_settings', this.state.settings);
                    this.showToast('Settings saved', 'success');
                });
            });

            const offsetInput = modal.querySelector('.pp-setting-input[data-setting="messageInputOffset"]');
            if (offsetInput) {
                offsetInput.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value) || 10;
                    this.state.settings.messageInputOffset = Math.max(0, Math.min(100, value));
                    SafeGM.setValue('pp_settings', this.state.settings);
                    this.adjustForKeyboard();
                    this.showToast('Offset saved', 'success');
                });
            }

            const refreshBtn = modal.querySelector('#pp-refresh-profile');
            refreshBtn.addEventListener('click', async () => {
                if (this.state.refreshCooldown > Date.now()) {
                    const remaining = Math.ceil((this.state.refreshCooldown - Date.now()) / 1000);
                    this.showToast(`Please wait ${remaining}s before refreshing again`, 'warning');
                    return;
                }
                
                refreshBtn.textContent = 'Checking...';
                refreshBtn.disabled = true;
                
                try {
                    this.state.lastProfileFetch = 0;
                    await this.fetchProfile();
                    await this.fetchFaction();
                    
                    this.state.refreshCooldown = Date.now() + 60000;
                    
                    const profileNameEl = modal.querySelector('#pp-current-profile-name');
                    const profileIdEl = modal.querySelector('#pp-current-profile-id');
                    const factionNameEl = modal.querySelector('#pp-current-faction-name');
                    const accessEl = modal.querySelector('#pp-current-access');
                    
                    if (profileNameEl) profileNameEl.textContent = this.state.profile?.name || 'Not loaded';
                    if (profileIdEl) profileIdEl.textContent = this.state.profile?.id || 'N/A';
                    if (factionNameEl) factionNameEl.textContent = this.state.faction?.name || 'No faction';
                    
                    const newAccess = this.state.isInAllowedFaction ? '✓ Full Access' : '✗ Limited Access';
                    if (accessEl) {
                        accessEl.textContent = newAccess;
                        accessEl.className = `pp-info-value ${this.state.isInAllowedFaction ? 'access-granted' : 'access-denied'}`;
                    }
                    
                    this.showToast('Profile and faction refreshed!', 'success');
                } catch (error) {
                    console.error('[Phantom Portal] Settings refresh error');
                    this.showToast('Refresh failed', 'error');
                } finally {
                    refreshBtn.textContent = '🔄 Refresh Profile';
                    refreshBtn.disabled = false;
                }
            });

            const themeBtn = modal.querySelector('#pp-theme-settings');
            themeBtn.addEventListener('click', () => {
                modal.remove();
                this.openGlassThemeSettings();
            });

            const clearBtn = modal.querySelector('#pp-clear-messages');
            clearBtn.addEventListener('click', () => {
                if (confirm('Clear all message history? This cannot be undone.')) {
                    this.state.roomMessages = {};
                    Object.keys(this.rooms).forEach(roomId => this.state.roomMessages[roomId] = []);
                    this.state.messageCache.clear();
                    SafeGM.setValue('pp_room_messages', this.state.roomMessages);
                    
                    if (this.domCache.messagesContainer) {
                        this.domCache.messagesContainer.innerHTML = '';
                    }
                    
                    this.showToast('Messages cleared', 'success');
                    modal.remove();
                }
            });

            const reloadBtn = modal.querySelector('#pp-reload-messages');
            reloadBtn.addEventListener('click', async () => {
                reloadBtn.textContent = 'Loading...';
                reloadBtn.disabled = true;
                
                try {
                    // Force reload of recent messages
                    this.state.lastOfflineTime = Date.now() - 60 * 60000; // Last hour
                    this.initialHistoryLoaded = false;
                    SafeGM.setValue('pp_last_offline_time', this.state.lastOfflineTime);
                    
                    await this.fetchMessages(false, true);
                    this.showToast('Recent messages reloaded', 'success');
                } catch (error) {
                    console.error('[Phantom Portal] Message reload error');
                    this.showToast('Reload failed', 'error');
                } finally {
                    reloadBtn.textContent = '📥 Reload Recent Messages';
                    reloadBtn.disabled = false;
                }
            });
        }

        openGlassThemeSettings() {
            const modal = document.createElement('div');
            modal.className = 'pp-settings-modal';
            
            const theme = this.themeManager.getTheme();
            
            modal.innerHTML = `
                <div class="pp-settings-content">
                    <div class="pp-settings-header">
                        <h3>Glass Theme Settings</h3>
                        <button class="pp-settings-close">&times;</button>
                    </div>
                    <div class="pp-settings-body">
                        <div class="pp-settings-section">
                            <h4>Theme Configuration</h4>
                            <div class="pp-setting-item">
                                <label>
                                    Primary Color:
                                    <input type="color" id="nano-primary-color" value="${theme.primaryColor}">
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    Border Color:
                                    <input type="color" id="nano-border-color" value="${theme.borderColor || theme.primaryColor}">
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    Transparency (Window & FAB):
                                    <input type="range" class="pp-setting-slider" id="nano-transparency-slider" 
                                           min="0" max="100" step="5" value="${Math.round((theme.transparency || 0.3) * 100)}">
                                    <span id="nano-transparency-value">${Math.round((theme.transparency || 0.3) * 100)}%</span>
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    Content Opacity (Text & Icons):
                                    <input type="range" class="pp-setting-slider" id="nano-content-opacity-slider" 
                                           min="50" max="100" step="5" value="${Math.round((theme.contentOpacity || 0.95) * 100)}">
                                    <span id="nano-content-opacity-value">${Math.round((theme.contentOpacity || 0.95) * 100)}%</span>
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    Frost Effect (Blur):
                                    <input type="range" class="pp-setting-slider" id="nano-frost-slider" 
                                           min="0" max="30" step="1" value="${theme.frostBlur || 15}">
                                    <span id="nano-frost-value">${theme.frostBlur || 15}px</span>
                                </label>
                            </div>
                            <div class="pp-setting-item">
                                <label>
                                    <input type="checkbox" id="nano-button-glow" ${theme.buttonGlow ? 'checked' : ''}>
                                    Enable Button Glow Effects
                                </label>
                            </div>
                        </div>
                        
                        <div class="pp-settings-buttons">
                            <button class="pp-settings-btn" id="nano-apply-theme">
                                ✅ Apply Theme
                            </button>
                            <button class="pp-settings-btn" id="nano-reset-theme">
                                🔄 Reset to Defaults
                            </button>
                            <button class="pp-settings-btn" id="nano-close-theme">
                                ✕ Close
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.pp-settings-close');
            closeBtn.addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => { 
                if (e.target === modal) modal.remove(); 
            });

            const colorPicker = modal.querySelector('#nano-primary-color');
            if (colorPicker) {
                colorPicker.addEventListener('input', (e) => {
                    this.themeManager.updateTheme({ primaryColor: e.target.value });
                });
            }

            const borderColorPicker = modal.querySelector('#nano-border-color');
            if (borderColorPicker) {
                borderColorPicker.addEventListener('input', (e) => {
                    this.themeManager.updateTheme({ borderColor: e.target.value });
                });
            }

            const transparencySlider = modal.querySelector('#nano-transparency-slider');
            const transparencyValue = modal.querySelector('#nano-transparency-value');
            if (transparencySlider && transparencyValue) {
                transparencySlider.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    transparencyValue.textContent = `${value}%`;
                    this.themeManager.updateTheme({ transparency: value / 100 });
                });
            }

            const contentOpacitySlider = modal.querySelector('#nano-content-opacity-slider');
            const contentOpacityValue = modal.querySelector('#nano-content-opacity-value');
            if (contentOpacitySlider && contentOpacityValue) {
                contentOpacitySlider.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    contentOpacityValue.textContent = `${value}%`;
                    this.themeManager.updateTheme({ contentOpacity: value / 100 });
                });
            }

            const frostSlider = modal.querySelector('#nano-frost-slider');
            const frostValue = modal.querySelector('#nano-frost-value');
            if (frostSlider && frostValue) {
                frostSlider.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    frostValue.textContent = `${value}px`;
                    this.themeManager.updateTheme({ frostBlur: value });
                });
            }

            const glowToggle = modal.querySelector('#nano-button-glow');
            if (glowToggle) {
                glowToggle.addEventListener('change', (e) => {
                    this.themeManager.updateTheme({ buttonGlow: e.target.checked });
                });
            }

            const applyBtn = modal.querySelector('#nano-apply-theme');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.themeManager.saveTheme();
                    this.showToast('Theme applied successfully', 'success');
                    modal.remove();
                });
            }

            const resetBtn = modal.querySelector('#nano-reset-theme');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.themeManager.resetToDefaults();
                    this.showToast('Theme reset to defaults', 'success');
                    modal.remove();
                });
            }

            const closeThemeBtn = modal.querySelector('#nano-close-theme');
            if (closeThemeBtn) {
                closeThemeBtn.addEventListener('click', () => {
                    modal.remove();
                });
            }
        }

        async supabaseRequest(method, endpoint, data = null) {
            return new Promise((resolve, reject) => {
                const url = `${this.supabaseUrl}${endpoint}`;
                SafeGM.xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    data: data ? JSON.stringify(data) : null,
                    timeout: 5000,
                    onload: (response) => {
                        const now = Date.now();
                        this.state.messageStats.lastLatency = now - this.state.messageStats.lastMessageTime;
                        SafeGM.setValue('pp_message_stats', this.state.messageStats);
                        
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                resolve(response.responseText ? JSON.parse(response.responseText) : {});
                            } catch (error) {
                                resolve({});
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        }

        startSyncLoop() {
            if (this.intervals.sync) clearInterval(this.intervals.sync);
            this.intervals.sync = setInterval(() => {
                if (this.isOpen) this.fetchMessages(true);
            }, this.state.pollingInterval);
        }

        startCooldownTicker() {
            if (this.intervals.cooldown) clearInterval(this.intervals.cooldown);
            this.intervals.cooldown = setInterval(() => {
                const now = Date.now();
                let changed = false;
                Object.keys(this.state.buttonCooldowns).forEach(id => {
                    if (now - this.state.buttonCooldowns[id] >= 10000) {
                        delete this.state.buttonCooldowns[id];
                        changed = true;
                    }
                });
                if (changed) SafeGM.setValue('pp_button_cooldowns', this.state.buttonCooldowns);
                
                if (this.state.refreshCooldown > 0 && this.state.refreshCooldown <= now) {
                    this.state.refreshCooldown = 0;
                }
            }, 1000);
        }

        startStatsUpdater() {
            if (this.intervals.stats) clearInterval(this.intervals.stats);
            this.intervals.stats = setInterval(() => {
                const now = Date.now();
                const lastMsgTime = this.state.messageStats.lastMessageTime;
                const latency = lastMsgTime > 0 ? Math.max(0, Math.floor((now - lastMsgTime) / 1000)) : 0;
                
                const latencyEl = document.querySelector('#pp-message-latency');
                if (latencyEl) {
                    latencyEl.textContent = `${latency} seconds ago`;
                    latencyEl.className = `pp-info-value ${latency < 10 ? 'access-granted' : latency < 30 ? '' : 'access-denied'}`;
                }
            }, 1000);
        }

        updateDOMCache() {
            if (!this.domCache.messagesContainer) {
                this.domCache.messagesContainer = document.querySelector('.pp-messages');
            }
            if (!this.domCache.input) {
                this.domCache.input = document.querySelector('.pp-input');
            }
            if (!this.domCache.sendButton) {
                this.domCache.sendButton = document.querySelector('.pp-send');
            }
            if (!this.domCache.profileDisplay) {
                this.domCache.profileDisplay = document.querySelector('.pp-profile-display');
            }
            if (!this.domCache.roomSelector) {
                this.domCache.roomSelector = document.querySelector('.pp-room-selector');
            }
            if (!this.domCache.quickActions) {
                this.domCache.quickActions = document.querySelector('.pp-quick-actions');
            }
        }

        createUI() {
            this.toggleBtn = document.createElement('div');
            this.toggleBtn.className = 'pp-toggle';
            this.toggleBtn.innerHTML = '<img src="https://images2.imgbox.com/cc/75/V2yuzaa8_o.png" class="pp-toggle-icon" alt="PP">';
            this.toggleBtn.title = 'Phantom Portal v2.5.7 - Long press to move, tap to open';
            
            this.toggleBtn.style.position = 'fixed';
            this.toggleBtn.style.left = `${this.state.fabPosition.x}px`;
            this.toggleBtn.style.top = `${this.state.fabPosition.y}px`;
            this.toggleBtn.style.zIndex = '9999';
            this.toggleBtn.style.display = 'flex';

            this.container = document.createElement('div');
            this.container.className = 'pp-container';
            this.container.innerHTML = `
                <div class="pp-header">
                    <div class="pp-title">
                        <img src="https://images2.imgbox.com/cc/75/V2yuzaa8_o.png" class="pp-header-icon" alt="">
                        Phantom Portal v2.5.7
                    </div>
                    <div class="pp-header-right">
                        <div class="pp-profile-display">Loading...</div>
                        <button class="pp-close-btn" title="Close window">✕</button>
                    </div>
                </div>
                <div class="pp-quick-actions"></div>
                <div class="pp-room-selector"></div>
                <div class="pp-messages"></div>
                <div class="pp-input-area">
                    <input type="text" class="pp-input" placeholder="Type message..." maxlength="500">
                    <button class="pp-send">➤</button>
                </div>
            `;

            document.body.appendChild(this.toggleBtn);
            document.body.appendChild(this.container);

            const quickActionsEl = this.container.querySelector('.pp-quick-actions');
            if (quickActionsEl) {
                quickActionsEl.appendChild(this.createQuickActions());
            }

            this.createRoomSelector();
            this.setupEvents();
            this.updateDOMCache();
            this.updateProfileDisplay();
        }

        createRoomSelector() {
            this.updateDOMCache();
            if (!this.domCache.roomSelector) return;
            
            Object.entries(this.rooms).forEach(([id, room]) => {
                if (room.type === 'general' || this.state.isInAllowedFaction) {
                    const btn = document.createElement('button');
                    btn.className = 'pp-room-btn';
                    if (id === this.state.selectedRoom) btn.classList.add('active');
                    btn.textContent = room.name;
                    btn.dataset.roomId = id;
                    btn.addEventListener('click', () => this.switchRoom(id));
                    this.domCache.roomSelector.appendChild(btn);
                }
            });
        }

        setupEvents() {
            // Mobile touch events for FAB
            this.toggleBtn.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) return;
                
                const touch = e.touches[0];
                this.fabStartX = this.toggleBtn.offsetLeft;
                this.fabStartY = this.toggleBtn.offsetTop;
                this.dragStartX = touch.clientX;
                this.dragStartY = touch.clientY;
                
                this.isLongPressing = false;
                this.longPressTimer = setTimeout(() => {
                    this.isLongPressing = true;
                    this.isDragging = false;
                    this.toggleBtn.classList.add('dragging');
                }, 500);
            });

            this.toggleBtn.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) return;
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.dragStartX;
                const deltaY = touch.clientY - this.dragStartY;
                
                if (!this.isDragging && !this.isLongPressing) {
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    if (distance > 5) {
                        clearTimeout(this.longPressTimer);
                    }
                }
                
                if (this.isLongPressing) {
                    const newX = this.fabStartX + deltaX;
                    const newY = this.fabStartY + deltaY;
                    
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const fabRect = this.toggleBtn.getBoundingClientRect();
                    
                    let constrainedX = Math.max(0, Math.min(newX, viewportWidth - fabRect.width));
                    let constrainedY = Math.max(0, Math.min(newY, viewportHeight - fabRect.height));
                    
                    const snapped = this.snapToNearbyFAB(constrainedX, constrainedY);
                    constrainedX = snapped.x;
                    constrainedY = snapped.y;
                    
                    constrainedX = Math.max(0, Math.min(constrainedX, viewportWidth - fabRect.width));
                    constrainedY = Math.max(0, Math.min(constrainedY, viewportHeight - fabRect.height));
                    
                    this.toggleBtn.style.left = `${constrainedX}px`;
                    this.toggleBtn.style.top = `${constrainedY}px`;
                    
                    this.state.fabPosition = { x: constrainedX, y: constrainedY };
                    this.isDragging = true;
                }
            });

            this.toggleBtn.addEventListener('touchend', (e) => {
                if (e.touches.length > 0) return;
                
                clearTimeout(this.longPressTimer);
                
                if (this.isDragging) {
                    SafeGM.setValue('pp_fab_position', this.state.fabPosition);
                } else {
                    if (!this.isLongPressing) {
                        this.toggleChat();
                    }
                }
                
                this.isDragging = false;
                this.isLongPressing = false;
                this.toggleBtn.classList.remove('dragging');
            });

            // Desktop click event
            this.toggleBtn.addEventListener('click', (e) => {
                if (!this.isDragging && !this.isLongPressing) {
                    this.toggleChat();
                }
            });

            // Close button
            const closeBtn = this.container.querySelector('.pp-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.isOpen = false;
                    this.container.style.display = 'none';
                });
            }

            // Message input events
            this.updateDOMCache();
            if (this.domCache.sendButton && this.domCache.input) {
                this.domCache.sendButton.addEventListener('click', () => this.sendMessage());
                this.domCache.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
                
                this.domCache.input.addEventListener('focus', () => this.adjustForKeyboard());
                this.domCache.input.addEventListener('blur', () => this.adjustForKeyboard());
            }
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.container.style.display = this.isOpen ? 'flex' : 'none';
            if (this.isOpen) {
                this.loadRoomHistory();
                this.fetchMessages();
                this.toggleBtn.classList.remove('pulsing');
                this.fabPulsing = false;
                this.unreadMessages = 0;
                this.adjustForKeyboard();
            }
        }

        injectStyles() {
            if (document.querySelector('style[data-phantom-portal]')) return;
            
            const css = `
                :root {
                    --nano-primary-color: #00ff41;
                    --nano-border-color: #00ff41;
                    --nano-frost-blur: 15px;
                    --nano-transparency: 0.3;
                    --nano-content-opacity: 0.95;
                    --nano-primary-r: 0;
                    --nano-primary-g: 255;
                    --nano-primary-b: 65;
                    --nano-border-r: 0;
                    --nano-border-g: 255;
                    --nano-border-b: 65;
                    --primary-color: var(--nano-primary-color);
                }

                .pp-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 95vw;
                    max-width: 800px;
                    min-width: 300px;
                    height: 70vh;
                    min-height: 500px;
                    max-height: 800px;
                    background: rgba(0, 0, 0, var(--nano-transparency));
                    border: 2px solid var(--nano-border-color);
                    border-radius: 12px;
                    box-shadow: 
                        0 8px 32px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4),
                        0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.2) inset,
                        0 0 30px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    z-index: 10000;
                    display: none;
                    flex-direction: column;
                    backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    -webkit-backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    font-family: 'Segoe UI', sans-serif;
                    overflow: hidden;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    transition: bottom 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
                }

                .pp-header {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.15);
                    color: var(--nano-primary-color);
                    padding: 12px 15px;
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pp-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: bold;
                    font-size: 14px;
                    flex: 1;
                    text-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                }

                .pp-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pp-close-btn {
                    background: rgba(255, 0, 0, 0.2);
                    border: 1px solid rgba(255, 0, 0, 0.5);
                    color: rgba(255, 102, 102, var(--nano-content-opacity));
                    font-size: 16px;
                    cursor: pointer;
                    padding: 2px 8px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                    min-width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pp-close-btn:hover {
                    background: rgba(255, 0, 0, 0.3);
                    border-color: #ff0000;
                }

                .pp-header-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    opacity: var(--nano-content-opacity);
                    filter: drop-shadow(0 0 3px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.7));
                }

                .pp-profile-display {
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 12px;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                }

                .pp-profile-display.connected {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.15);
                    color: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), var(--nano-content-opacity));
                }

                .pp-profile-display.guest {
                    background: rgba(255, 165, 0, 0.15);
                    color: rgba(255, 165, 0, var(--nano-content-opacity));
                }

                .pp-quick-actions {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 10px;
                    background: rgba(0, 0, 0, 0.2);
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    flex-wrap: wrap;
                    gap: 5px;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pp-action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.15);
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    opacity: var(--nano-content-opacity);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-action-btn:hover {
                    transform: scale(1.1);
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-border-b), 0.25);
                    box-shadow: 0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-action-btn.cooldown {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pp-action-btn.settings {
                    background: rgba(128, 128, 128, 0.2);
                    border-color: rgba(128, 128, 128, 0.3);
                }

                .pp-action-btn.settings:hover {
                    background: rgba(128, 128, 128, 0.3);
                }

                .pp-room-selector {
                    display: flex;
                    padding: 5px;
                    background: rgba(0, 0, 0, 0.15);
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    gap: 5px;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pp-room-btn {
                    flex: 1;
                    padding: 6px;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.1);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    color: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), var(--nano-content-opacity));
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-room-btn:hover {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.2);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-room-btn.active {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.3);
                    border-color: var(--nano-border-color);
                    color: var(--nano-border-color);
                    box-shadow: 0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.1);
                    transition: padding-bottom 0.3s ease;
                }

                .pp-message {
                    margin: 8px 0;
                    padding: 8px 12px;
                    border-radius: 8px;
                    max-width: 85%;
                    word-wrap: break-word;
                    transition: opacity 0.3s;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.2);
                }

                .pp-message.temporary {
                    opacity: 0.7;
                }

                .message-in {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.1);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    align-self: flex-start;
                }

                .message-out {
                    background: rgba(100, 100, 255, 0.1);
                    border: 1px solid rgba(100, 100, 255, 0.3);
                    align-self: flex-end;
                    margin-left: auto;
                }

                .message-sender {
                    font-size: 11px;
                    opacity: 0.8;
                    margin-bottom: 2px;
                    color: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), var(--nano-content-opacity));
                    text-shadow: 0 0 3px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .message-badge {
                    background: #ffaa00;
                    color: #000;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    margin-right: 6px;
                    font-weight: bold;
                }

                .message-text {
                    font-size: 13px;
                    line-height: 1.4;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                }

                .message-text a {
                    color: var(--nano-primary-color);
                    text-decoration: underline;
                    word-break: break-all;
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .message-text a:hover {
                    color: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.8);
                }

                .message-time {
                    font-size: 10px;
                    opacity: 0.7;
                    margin-top: 4px;
                    text-align: right;
                    color: rgba(255, 255, 255, 0.6);
                }

                .pp-input-area {
                    padding: 10px;
                    border-top: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    gap: 8px;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pp-input {
                    flex: 1;
                    padding: 8px 12px;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.1);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    border-radius: 20px;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.2) inset;
                }

                .pp-input:focus {
                    border-color: var(--nano-border-color);
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.15);
                    box-shadow: 
                        0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3) inset,
                        0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.2);
                }

                .pp-send {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.2);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    color: var(--nano-primary-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    opacity: var(--nano-content-opacity);
                }

                .pp-send:hover {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.3);
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-toggle {
                    position: fixed;
                    width: 60px;
                    height: 60px;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), var(--nano-transparency));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--nano-primary-color);
                    cursor: pointer;
                    box-shadow: 
                        0 4px 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4),
                        0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3),
                        0 0 30px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.2) inset;
                    border: 2px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.6);
                    transition: transform 0.3s, box-shadow 0.3s, left 0.2s ease, top 0.2s ease;
                    user-select: none;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                    backdrop-filter: blur(var(--nano-frost-blur));
                    -webkit-backdrop-filter: blur(var(--nano-frost-blur));
                    z-index: 9999;
                }

                .pp-toggle:hover {
                    box-shadow: 
                        0 4px 25px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.6),
                        0 0 25px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4),
                        0 0 35px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3) inset;
                    transform: scale(1.05);
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), calc(var(--nano-transparency) + 0.05));
                }

                .pp-toggle.pulsing {
                    animation: pulseGlow 1s infinite alternate;
                }

                .pp-toggle.dragging {
                    cursor: grabbing;
                    opacity: 0.9;
                    transform: scale(1.1);
                    box-shadow: 
                        0 6px 30px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.8),
                        0 0 30px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.6),
                        0 0 40px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4) inset;
                }

                @keyframes pulseGlow {
                    from { 
                        box-shadow: 
                            0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.7), 
                            0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5),
                            0 0 30px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3) inset;
                    }
                    to { 
                        box-shadow: 
                            0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 1), 
                            0 0 40px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.7),
                            0 0 50px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5) inset;
                    }
                }

                .pp-toggle-icon {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: var(--nano-content-opacity);
                    filter: drop-shadow(0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.8));
                }

                .pp-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid var(--nano-border-color);
                    border-radius: 8px;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    z-index: 10001;
                    animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
                    max-width: 300px;
                    pointer-events: none;
                    font-weight: bold;
                    backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    -webkit-backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    box-shadow: 
                        0 8px 32px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4),
                        0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-toast.success { 
                    border-color: rgba(68, 255, 68, 0.8); 
                    background: rgba(0, 40, 0, 0.4); 
                }
                .pp-toast.warning { 
                    border-color: rgba(255, 170, 0, 0.8); 
                    background: rgba(255, 165, 0, 0.4); 
                    color: #fff; 
                }
                .pp-toast.error { 
                    border-color: rgba(255, 68, 68, 0.8); 
                    background: rgba(255, 0, 0, 0.2); 
                }
                .pp-toast.info { 
                    border-color: rgba(0, 170, 255, 0.8); 
                    background: rgba(0, 100, 200, 0.4); 
                    color: #fff; 
                }

                .pp-confirm-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10003;
                }

                .pp-confirm-content {
                    background: rgba(0, 0, 0, var(--nano-transparency));
                    border: 2px solid var(--nano-border-color);
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    padding: 20px;
                    backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    -webkit-backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    box-shadow: 
                        0 8px 32px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5),
                        0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-confirm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .pp-confirm-header h4 {
                    margin: 0;
                    color: var(--nano-primary-color);
                    text-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-confirm-close {
                    background: none;
                    border: none;
                    color: var(--nano-primary-color);
                    font-size: 24px;
                    cursor: pointer;
                    line-height: 1;
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-confirm-body {
                    margin-bottom: 20px;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                }

                .pp-confirm-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }

                .pp-confirm-btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                }

                .pp-confirm-btn.confirm {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.2);
                    color: var(--nano-primary-color);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-confirm-btn.confirm:hover {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.3);
                    box-shadow: 0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-confirm-btn.cancel {
                    background: rgba(255, 0, 0, 0.2);
                    color: #ff6666;
                    border: 1px solid rgba(255, 0, 0, 0.4);
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                }

                .pp-confirm-btn.cancel:hover {
                    background: rgba(255, 0, 0, 0.3);
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
                }

                .pp-settings-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10002;
                }

                .pp-settings-content {
                    background: rgba(0, 0, 0, var(--nano-transparency));
                    border: 2px solid var(--nano-border-color);
                    border-radius: 12px;
                    width: 90%;
                    max-width: 450px;
                    max-height: 80vh;
                    overflow-y: auto;
                    backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    -webkit-backdrop-filter: blur(var(--nano-frost-blur)) !important;
                    box-shadow: 
                        0 8px 32px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5),
                        0 0 20px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-settings-header {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.2);
                    color: var(--nano-primary-color);
                    padding: 15px;
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pp-settings-header h3 {
                    margin: 0;
                    font-size: 16px;
                    text-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-settings-close {
                    background: none;
                    border: none;
                    color: var(--nano-primary-color);
                    font-size: 24px;
                    cursor: pointer;
                    line-height: 1;
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-settings-body {
                    padding: 20px;
                }

                .pp-profile-info {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.15);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                    backdrop-filter: blur(5px);
                }

                .pp-profile-info h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: var(--nano-primary-color);
                    font-size: 14px;
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    padding-bottom: 8px;
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 13px;
                }

                .pp-info-label {
                    color: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.9);
                    font-weight: bold;
                }

                .pp-info-value {
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    max-width: 60%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .pp-info-value.access-granted {
                    color: #44ff44;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(68, 255, 68, 0.5);
                }

                .pp-info-value.access-denied {
                    color: #ff6666;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(255, 102, 102, 0.5);
                }

                .pp-settings-section {
                    margin-bottom: 20px;
                }

                .pp-settings-section h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: var(--nano-primary-color);
                    font-size: 14px;
                    border-bottom: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    padding-bottom: 8px;
                    text-shadow: 0 0 5px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-setting-item {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .pp-setting-item label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    cursor: pointer;
                    font-size: 14px;
                    flex: 1;
                }

                .pp-setting-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: var(--nano-primary-color);
                }

                .pp-setting-input {
                    width: 60px;
                    padding: 4px 8px;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.1);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    border-radius: 4px;
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    text-align: center;
                    backdrop-filter: blur(5px);
                }

                .pp-setting-slider {
                    width: 100px;
                    margin: 0 10px;
                    accent-color: var(--nano-primary-color);
                }

                .pp-settings-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pp-settings-btn {
                    padding: 12px;
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.2);
                    border: 1px solid rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.4);
                    color: rgba(255, 255, 255, var(--nano-content-opacity));
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    backdrop-filter: blur(5px);
                    box-shadow: 0 0 10px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.3);
                }

                .pp-settings-btn:hover {
                    background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.3);
                    border-color: var(--nano-border-color);
                    transform: translateY(-1px);
                    box-shadow: 0 0 15px rgba(var(--nano-border-r), var(--nano-border-g), var(--nano-border-b), 0.5);
                }

                .pp-settings-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .pp-settings-btn#pp-clear-messages {
                    background: rgba(255, 0, 0, 0.2);
                    border-color: rgba(255, 0, 0, 0.4);
                }

                .pp-settings-btn#pp-clear-messages:hover {
                    background: rgba(255, 0, 0, 0.3);
                    border-color: #ff0000;
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.1); }
                ::-webkit-scrollbar-thumb { background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.3); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(var(--nano-primary-r), var(--nano-primary-g), var(--nano-primary-b), 0.5); }

                @media (max-width: 768px) {
                    .pp-container {
                        width: 98vw;
                        height: 85vh;
                        min-height: 400px;
                        max-height: 90vh;
                    }
                    
                    .pp-toggle {
                        width: 60px;
                        height: 60px;
                    }
                    
                    .pp-toggle-icon {
                        width: 35px;
                        height: 35px;
                    }
                    
                    .pp-action-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 18px;
                    }
                    
                    .pp-room-btn {
                        padding: 8px;
                        font-size: 13px;
                    }
                    
                    .pp-input {
                        font-size: 16px;
                        padding: 10px 14px;
                    }
                    
                    .pp-message {
                        max-width: 90%;
                    }
                    
                    .pp-confirm-content {
                        width: 95%;
                    }
                    
                    .pp-toast {
                        max-width: 90%;
                        right: 5%;
                    }
                }
            `;

            SafeGM.addStyle(css);
        }
    }

    function initialize() {
        try {
            if (!window.location.href.includes('torn.com')) {
                return;
            }
            
            if (typeof GM_xmlhttpRequest === 'undefined') {
                console.error('[Phantom Portal] GM_xmlhttpRequest is not available');
                return;
            }
            
            try {
                new PhantomPortal();
            } catch (error) {
                console.error('[Phantom Portal] Failed to create instance');
            }
            
        } catch (error) {
            console.error('[Phantom Portal] Initialization error');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();