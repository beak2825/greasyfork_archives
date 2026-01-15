// ==UserScript==
// @name         Phantom Portal v2.2.0
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Torn to Discord sync system for my faction and friends.
// @author       Daturax
// @license      GPLv3
// @match        https://www.torn.com/*
// @icon         https://images2.imgbox.com/86/79/2ag63Ut3_o.png
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
// @downloadURL https://update.greasyfork.org/scripts/562514/Phantom%20Portal%20v220.user.js
// @updateURL https://update.greasyfork.org/scripts/562514/Phantom%20Portal%20v220.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TORN_API_KEY = '###PDA-APIKEY###';

    if (window._phantomPortalV2_2_0) return;
    window._phantomPortalV2_2_0 = true;

    class PhantomPortal {
        constructor() {
            this.supabaseUrl = 'https://gsxihumaebabhkvowqzs.supabase.co';
            this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGlodW1hZWJhYmhrdm93cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDkzMzQsImV4cCI6MjA4MzI4NTMzNH0.OyOMGVdMEXlg6IiLKt1wElQ8AeVvVROr9YQI1-hwKlk';

            this.allowedFactionId = 49511;
            
            this.rooms = {
                '1451524832767250543': { name: 'Portal Chat', type: 'general' },
                '1080875329888997429': { name: 'Banking', type: 'bank' },
                '1080875283160252516': { name: 'War Room', type: 'war' }
            };

            // Milestone numbers for celebrations
            this.milestoneNumbers = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
            this.bonusNumbers = [9, 24, 49, 99, 249, 499, 999, 2499, 4999, 9999, 24999, 49999, 99999];

            this.state = {
                profile: GM_getValue('pp_profile', null),
                faction: GM_getValue('pp_faction', null),
                lastProfileFetch: GM_getValue('pp_profile_time', 0),
                selectedRoom: GM_getValue('pp_selected_room', '1451524832767250543'),
                buttonCooldowns: GM_getValue('pp_button_cooldowns', {}),
                messageCache: new Map(),
                lastSync: 0,
                roomMessages: GM_getValue('pp_room_messages', {}),
                settings: GM_getValue('pp_settings', {
                    showNotifications: true,
                    autoScroll: true,
                    soundEnabled: false
                }),
                isInAllowedFaction: GM_getValue('pp_is_in_allowed_faction', false),
                messageStats: GM_getValue('pp_message_stats', {
                    sent: 0,
                    received: 0,
                    lastLatency: 0,
                    lastMessageTime: 0
                }),
                chainData: GM_getValue('pp_chain_data', null),
                lastChainFetch: GM_getValue('pp_last_chain_fetch', 0),
                lastAPICall: GM_getValue('pp_last_api_call', 0),
                apiCallCount: GM_getValue('pp_api_call_count', 0),
                chainEndTime: GM_getValue('pp_chain_end_time', 0),
                chainCurrentSnapshot: GM_getValue('pp_chain_current_snapshot', 0),
                chainFetchLatency: 0,
                fabPosition: GM_getValue('pp_fab_position', { x: 20, y: 20 }),
                chainWarningShown: false,
                previousChainValue: GM_getValue('pp_previous_chain_value', 0),
                isCelebrating: false,
                celebrationActive: false
            };

            Object.keys(this.rooms).forEach(roomId => {
                if (!this.state.roomMessages[roomId]) {
                    this.state.roomMessages[roomId] = [];
                }
            });

            this.isOpen = false;
            this.isPolling = false;
            this.pendingMessages = new Set();
            this.pendingNotifications = new Set();
            this.fabPulsing = false;
            this.unreadMessages = 0;
            this.chainTimer = null;
            this.lastChainUpdate = 0;
            this.chainUpdateInterval = null;
            this.lastServerTime = 0;
            this.isDragging = false;
            this.isLongPressing = false;
            this.longPressTimer = null;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.fabStartX = 0;
            this.fabStartY = 0;
            this.fabPulseInterval = null;
            this.celebrationInterval = null;
            this.celebrationElements = [];

            this.alertSoundUrl = 'https://cdn.pixabay.com/download/audio/2025/07/20/376885_b3d2f14d7d.mp3?filename=notification-bell-sound-1-376885.mp3';
            this.audioCache = null;

            setTimeout(() => this.init(), 100);
        }

        async init() {
            console.log('[Phantom Portal] v2.2.0 initialized');

            await this.checkUserOverrides();
            this.injectStyles();
            this.createUI();
            this.updateProfileDisplay();
            this.updateChainDisplay();

            try {
                await this.fetchProfile();
                await this.fetchFaction();
                this.startSyncLoop();
                this.startCooldownTicker();
                this.startStatsUpdater();
                this.startChainUpdater();
            } catch (error) {
                this.showToast('Portal loaded with limited features', 'warning');
            }
        }

        async checkUserOverrides() {
            try {
                const userUrl = GM_getValue('supabase_url');
                const userKey = GM_getValue('supabase_key');
                if (userUrl && userKey) {
                    this.supabaseUrl = userUrl;
                    this.supabaseKey = userKey;
                }
            } catch (error) {
                // Override check failed silently
            }
        }

        async fetchProfile() {
            const now = Date.now();
            if (this.state.profile && (now - this.state.lastProfileFetch < 3600000)) {
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
                    GM_setValue('pp_profile', this.state.profile);
                    GM_setValue('pp_profile_time', now);
                    this.updateProfileDisplay();
                } else {
                    throw new Error('Invalid profile response');
                }
            } catch (error) {
                throw error;
            }
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
                    
                    GM_setValue('pp_faction', this.state.faction);
                    GM_setValue('pp_is_in_allowed_faction', this.state.isInAllowedFaction);
                    
                    this.updateProfileDisplay();
                    this.updateUIBasedOnFaction();
                } else {
                    this.handleNoFactionData();
                }
            } catch (error) {
                this.handleNoFactionData();
            }
        }

        async fetchChainData() {
            // Only fetch chain data for faction members
            if (!this.state.isInAllowedFaction || !this.state.faction?.id) {
                this.state.chainData = null;
                GM_setValue('pp_chain_data', null);
                this.updateChainDisplay();
                return;
            }

            const now = Date.now();
            
            // Check if we should fetch new data (every 30 seconds max when chain is active)
            if (this.state.chainData && (now - this.state.lastChainFetch < 30000)) {
                return;
            }

            try {
                const apiKey = this.getApiKey();
                if (!apiKey || !this.canMakeAPICall()) {
                    return;
                }

                const startTime = Date.now();
                const chainResponse = await this.makeTornRequest('/faction/chain?');
                const endTime = Date.now();
                this.state.chainFetchLatency = endTime - startTime;
                
                if (chainResponse?.chain) {
                    const serverTimestamp = Math.floor(Date.now() / 1000);
                    
                    this.state.chainData = {
                        id: parseInt(chainResponse.chain.id) || 0,
                        current: parseInt(chainResponse.chain.current) || 0,
                        max: parseInt(chainResponse.chain.max) || 0,
                        timeout: parseInt(chainResponse.chain.timeout) || 0,
                        modifier: parseFloat(chainResponse.chain.modifier) || 1.0,
                        cooldown: parseInt(chainResponse.chain.cooldown) || 0,
                        start: parseInt(chainResponse.chain.start) || 0,
                        end: parseInt(chainResponse.chain.end) || 0
                    };
                    
                    // Check for milestone celebrations
                    this.checkForMilestoneCelebrations(this.state.chainData.current);
                    
                    // Calculate adjusted end time accounting for API latency
                    if (this.state.chainData.end > 0) {
                        // Use Torn's end timestamp as authoritative source
                        this.state.chainEndTime = this.state.chainData.end;
                        this.state.chainCurrentSnapshot = this.state.chainData.current;
                        this.lastServerTime = serverTimestamp;
                        
                        GM_setValue('pp_chain_end_time', this.state.chainEndTime);
                        GM_setValue('pp_chain_current_snapshot', this.state.chainCurrentSnapshot);
                    } else if (this.state.chainData.timeout > 0) {
                        // Fallback to timeout calculation if no end timestamp
                        this.state.chainEndTime = serverTimestamp + this.state.chainData.timeout;
                        this.state.chainCurrentSnapshot = this.state.chainData.current;
                        this.lastServerTime = serverTimestamp;
                        
                        GM_setValue('pp_chain_end_time', this.state.chainEndTime);
                        GM_setValue('pp_chain_current_snapshot', this.state.chainCurrentSnapshot);
                    }
                    
                    this.state.lastChainFetch = now;
                    GM_setValue('pp_chain_data', this.state.chainData);
                    GM_setValue('pp_last_chain_fetch', now);
                    
                    this.updateChainDisplay();
                    
                    // Start real-time countdown timer
                    this.startRealtimeCountdown();
                } else {
                    this.state.chainData = null;
                    this.state.chainEndTime = 0;
                    GM_setValue('pp_chain_data', null);
                    GM_setValue('pp_chain_end_time', 0);
                    this.updateChainDisplay();
                    this.stopRealtimeCountdown();
                }
            } catch (error) {
                this.state.chainData = null;
                this.state.chainEndTime = 0;
                GM_setValue('pp_chain_data', null);
                GM_setValue('pp_chain_end_time', 0);
                this.updateChainDisplay();
                this.stopRealtimeCountdown();
            }
        }

        checkForMilestoneCelebrations(currentChain) {
            // Check if we reached a milestone (current chain exactly matches milestone number)
            if (currentChain > 0 && currentChain !== this.state.previousChainValue) {
                // Check for milestone celebrations
                if (this.milestoneNumbers.includes(currentChain)) {
                    this.triggerMilestoneCelebration(currentChain);
                }
                
                // Update previous value
                this.state.previousChainValue = currentChain;
                GM_setValue('pp_previous_chain_value', currentChain);
            }
        }

        triggerMilestoneCelebration(chainValue) {
            if (this.state.celebrationActive) return;
            
            this.state.celebrationActive = true;
            this.showToast(`🎉 CHAIN MILESTONE! ${chainValue.toLocaleString()} HITS! 🎉`, 'success');
            
            // Determine celebration intensity based on chain value
            let intensity = 1;
            if (chainValue >= 1000) intensity = 2;
            if (chainValue >= 10000) intensity = 3;
            if (chainValue >= 50000) intensity = 4;
            
            this.createCelebration(intensity);
            
            // Auto-clear celebration after 5 seconds
            setTimeout(() => {
                this.clearCelebration();
                this.state.celebrationActive = false;
            }, 5000);
        }

        createCelebration(intensity) {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#88ff00'];
            
            // Create multiple celebration elements based on intensity
            const elementCount = 20 + (intensity * 30);
            
            for (let i = 0; i < elementCount; i++) {
                setTimeout(() => {
                    const element = document.createElement('div');
                    element.className = 'pp-celebration-element';
                    
                    // Random position
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    
                    // Random size
                    const size = 10 + Math.random() * 30;
                    
                    // Random rotation
                    const rotation = Math.random() * 360;
                    
                    // Random shape (confetti, streamer, popper)
                    const shapeType = Math.floor(Math.random() * 3);
                    let shape = '●';
                    if (shapeType === 1) shape = '■';
                    if (shapeType === 2) shape = '▲';
                    
                    element.textContent = shape;
                    element.style.cssText = `
                        position: fixed;
                        left: ${left}%;
                        top: ${top}%;
                        font-size: ${size}px;
                        color: ${colors[Math.floor(Math.random() * colors.length)]};
                        z-index: 99999;
                        pointer-events: none;
                        transform: rotate(${rotation}deg);
                        opacity: 0.8;
                        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
                        animation: pp-celebration-fall 3s ease-in forwards;
                    `;
                    
                    document.body.appendChild(element);
                    this.celebrationElements.push(element);
                }, i * 50); // Stagger creation for wave effect
            }
        }

        clearCelebration() {
            this.celebrationElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            this.celebrationElements = [];
        }

        startRealtimeCountdown() {
            this.stopRealtimeCountdown();
            
            if (!this.state.chainEndTime || this.state.chainEndTime <= 0) {
                return;
            }

            this.chainUpdateInterval = setInterval(() => {
                this.updateRealtimeChainDisplay();
            }, 1000);
            
            this.updateRealtimeChainDisplay();
        }

        stopRealtimeCountdown() {
            if (this.chainUpdateInterval) {
                clearInterval(this.chainUpdateInterval);
                this.chainUpdateInterval = null;
            }
        }

        updateRealtimeChainDisplay() {
            const now = Math.floor(Date.now() / 1000);
            let remainingSeconds = this.state.chainEndTime - now;
            
            // Add latency compensation (half of last measured API latency)
            const latencyCompensation = Math.floor(this.state.chainFetchLatency / 2000);
            remainingSeconds -= latencyCompensation;
            
            // Ensure we don't go negative
            if (remainingSeconds < 0) {
                remainingSeconds = 0;
            }
            
            const chainCurrentEl = document.querySelector('.pp-chain-current');
            const chainTimeoutEl = document.querySelector('.pp-chain-timeout');
            const chainDisplay = document.querySelector('.pp-chain-display');
            
            if (!chainCurrentEl || !chainTimeoutEl || !chainDisplay) {
                return;
            }

            // Get current chain value
            const currentChain = this.state.chainCurrentSnapshot || this.state.chainData?.current || 0;
            
            // Update current chain value
            chainCurrentEl.textContent = currentChain.toLocaleString();
            
            // Format timeout as MM:SS
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            chainTimeoutEl.textContent = timeStr;
            
            // Update display state based on chain activity
            const hasActiveChain = currentChain > 0;
            
            if (hasActiveChain) {
                chainDisplay.classList.add('active');
                chainCurrentEl.classList.add('active');
                chainTimeoutEl.classList.add('active');
                
                // Remove all color classes first
                chainDisplay.classList.remove('neon-blue', 'neon-green', 'neon-yellow', 'neon-red', 'flash-red', 'flash-gold');
                chainCurrentEl.classList.remove('flash-gold');
                
                // Apply color based on remaining time
                if (remainingSeconds <= 10) {
                    // Flash Red for last 10 seconds
                    chainDisplay.classList.add('flash-red');
                } else if (remainingSeconds <= 30) {
                    // Neon Red for last 30 seconds
                    chainDisplay.classList.add('neon-red');
                } else if (remainingSeconds <= 90) {
                    // Neon Yellow for last 90 seconds
                    chainDisplay.classList.add('neon-yellow');
                } else if (remainingSeconds <= 180) {
                    // Neon Green for 3 minutes
                    chainDisplay.classList.add('neon-green');
                } else {
                    // Neon Blue for >5 minutes
                    chainDisplay.classList.add('neon-blue');
                }
                
                // Check for bonus numbers (flash gold)
                if (this.bonusNumbers.includes(currentChain)) {
                    chainDisplay.classList.add('flash-gold');
                    chainCurrentEl.classList.add('flash-gold');
                }
                
                // Check for chain warning condition
                if (currentChain > 10 && remainingSeconds <= 90 && remainingSeconds > 0) {
                    if (!this.state.chainWarningShown) {
                        this.showToast(`⚠️ Chain is ${currentChain} with ${timeStr} remaining! Keep the chain alive!`, 'warning');
                        this.state.chainWarningShown = true;
                    }
                } else if (remainingSeconds > 90) {
                    // Reset warning when time goes above threshold
                    this.state.chainWarningShown = false;
                }
            } else {
                // No active chain - disable display
                chainDisplay.classList.remove('active', 'neon-blue', 'neon-green', 'neon-yellow', 'neon-red', 'flash-red', 'flash-gold');
                chainCurrentEl.classList.remove('active', 'flash-gold');
                chainTimeoutEl.classList.remove('active');
                this.state.chainWarningShown = false;
            }
            
            // Auto-refresh when chain is about to expire (less than 10 seconds)
            if (remainingSeconds <= 10 && remainingSeconds > 0) {
                const nowMs = Date.now();
                if (nowMs - this.lastChainUpdate > 5000) {
                    this.lastChainUpdate = nowMs;
                    this.fetchChainData();
                }
            }
            
            // Auto-refresh when chain expires
            if (remainingSeconds <= 0) {
                this.state.chainWarningShown = false;
                this.lastChainUpdate = Date.now();
                this.fetchChainData();
            }
        }

        updateChainDisplay() {
            this.updateRealtimeChainDisplay();
        }

        canMakeAPICall() {
            const now = Date.now();
            const lastCall = this.state.lastAPICall || 0;
            
            // Reset count if more than 60 seconds have passed
            if (now - lastCall > 60000) {
                this.state.apiCallCount = 0;
                this.state.lastAPICall = now;
                GM_setValue('pp_api_call_count', 0);
                GM_setValue('pp_last_api_call', now);
            }
            
            // Check if we can make another call (max 20 per minute)
            if (this.state.apiCallCount >= 20) {
                const waitTime = Math.ceil((60000 - (now - lastCall)) / 1000);
                return false;
            }
            
            // Ensure at least 3 seconds between calls
            if (now - lastCall < 3000) {
                return false;
            }
            
            this.state.apiCallCount++;
            this.state.lastAPICall = now;
            GM_setValue('pp_api_call_count', this.state.apiCallCount);
            GM_setValue('pp_last_api_call', now);
            
            return true;
        }

        handleNoFactionData() {
            this.state.isInAllowedFaction = false;
            this.state.faction = null;
            this.state.chainData = null;
            this.state.chainEndTime = 0;
            GM_setValue('pp_faction', null);
            GM_setValue('pp_is_in_allowed_faction', false);
            GM_setValue('pp_chain_data', null);
            GM_setValue('pp_chain_end_time', 0);
            this.updateUIBasedOnFaction();
            this.updateChainDisplay();
            this.stopRealtimeCountdown();
        }

        async refreshProfileWithRealtimeCheck() {
            try {
                this.state.lastProfileFetch = 0;
                await this.fetchProfile();
                await this.fetchFaction();
                await this.fetchChainData();
                return {
                    success: true,
                    profile: this.state.profile,
                    faction: this.state.faction,
                    isInAllowedFaction: this.state.isInAllowedFaction,
                    chainData: this.state.chainData
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        updateUIBasedOnFaction() {
            const roomSelector = document.querySelector('.pp-room-selector');
            const quickActions = document.querySelector('.pp-quick-actions');
            
            if (!roomSelector || !quickActions) return;

            roomSelector.innerHTML = '';
            
            Object.entries(this.rooms).forEach(([id, room]) => {
                if (room.type === 'general' || this.state.isInAllowedFaction) {
                    const btn = document.createElement('button');
                    btn.className = 'pp-room-btn';
                    if (id === this.state.selectedRoom) btn.classList.add('active');
                    btn.textContent = room.name;
                    btn.dataset.roomId = id;
                    btn.addEventListener('click', () => this.switchRoom(id));
                    roomSelector.appendChild(btn);
                }
            });

            const bankerBtn = quickActions.querySelector('.pp-action-btn.banker');
            if (bankerBtn) {
                bankerBtn.style.display = this.state.isInAllowedFaction ? '' : 'none';
            }

            if (!this.isRoomAccessible(this.state.selectedRoom)) {
                const portalChatId = '1451524832767250543';
                this.state.selectedRoom = portalChatId;
                GM_setValue('pp_selected_room', portalChatId);
                
                document.querySelectorAll('.pp-room-btn').forEach(b => b.classList.remove('active'));
                const activeBtn = document.querySelector(`.pp-room-btn[data-room-id="${portalChatId}"]`);
                if (activeBtn) activeBtn.classList.add('active');
                
                this.state.messageCache.clear();
                const messagesEl = document.querySelector('.pp-messages');
                if (messagesEl) messagesEl.innerHTML = '';
                this.loadRoomHistory();
            }
        }

        switchRoom(roomId) {
            this.state.selectedRoom = roomId;
            GM_setValue('pp_selected_room', roomId);
            
            document.querySelectorAll('.pp-room-btn').forEach(b => b.classList.remove('active'));
            const activeBtn = document.querySelector(`.pp-room-btn[data-room-id="${roomId}"]`);
            if (activeBtn) activeBtn.classList.add('active');
            
            this.state.messageCache.clear();
            const messagesEl = document.querySelector('.pp-messages');
            if (messagesEl) messagesEl.innerHTML = '';
            
            this.loadRoomHistory();
            
            if (this.unreadMessages > 0) {
                this.unreadMessages = 0;
                this.updateFABPulse();
            }
        }

        async makeTornRequest(endpoint) {
            const apiKey = this.getApiKey();
            if (!apiKey) throw new Error('No API key available');

            return new Promise((resolve, reject) => {
                const hasQuery = endpoint.includes('?');
                const url = `https://api.torn.com/v2${endpoint}${hasQuery ? '&' : '?'}key=${apiKey}`;
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'Accept': 'application/json' },
                    timeout: 8000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
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
                    if (match) return this.sanitizeAPIKey(match[1]);
                }
            }
            return null;
        }

        sanitizeHTML(str) {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML.replace(/[<>]/g, '');
        }

        sanitizeAPIKey(key) {
            if (typeof key !== 'string') return '';
            return key.replace(/[^a-zA-Z0-9]/g, '');
        }

        updateProfileDisplay() {
            const display = document.querySelector('.pp-profile-display');
            if (!display) return;

            if (this.state.profile?.name) {
                let displayText = this.state.profile.name;
                let displayTitle = `Level ${this.state.profile.level}`;
                
                if (this.state.faction) {
                    displayText += ` [${this.state.faction.tag}]`;
                    displayTitle += ` | ${this.state.faction.name} | ${this.state.faction.position}`;
                }
                
                display.textContent = displayText;
                display.title = displayTitle;
                display.className = 'pp-profile-display connected';
            } else {
                display.textContent = 'API Key Required';
                display.className = 'pp-profile-display guest';
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
            // Banker button requires faction membership
            if (action.id === 'banker' && !this.state.isInAllowedFaction) {
                this.showToast('Banker access requires faction membership', 'error');
                return;
            }

            // Check cooldown
            const now = Date.now();
            const cooldown = this.state.buttonCooldowns[action.id];
            if (cooldown && now - cooldown < 10000) {
                const remaining = Math.ceil((10000 - (now - cooldown)) / 1000);
                this.showToast(`${action.label} cooldown: ${remaining}s`, 'warning');
                return;
            }

            // Apply cooldown
            this.state.buttonCooldowns[action.id] = now;
            GM_setValue('pp_button_cooldowns', this.state.buttonCooldowns);

            const btn = document.querySelector(`.pp-action-btn.${action.id}`);
            if (btn) {
                btn.classList.add('cooldown');
                setTimeout(() => btn.classList.remove('cooldown'), 10000);
            }

            // Show action toast
            this.showToast(`${action.label} Needed!`, 'warning');

            // Determine message and room based on action
            let message = '';
            let roomId = '1451524832767250543'; // Default to portal chat
            
            switch(action.id) {
                case 'revive':
                    if (this.state.profile?.id) {
                        const profileUrl = `https://www.torn.com/profiles.php?XID=${this.state.profile.id}`;
                        message = `${action.role} - Revive needed! ${profileUrl}`;
                    } else {
                        message = `${action.role} - Revive needed!`;
                    }
                    break;
                    
                case 'assist':
                    const currentUrl = window.location.href;
                    // Check if user is on attack page with target ID
                    if (currentUrl.includes('loader.php?sid=attack') && currentUrl.includes('user2ID=')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        const targetId = urlParams.get('user2ID');
                        if (targetId) {
                            // FIXED BUG: Changed &amp; to & in the attack URL
                            const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`;
                            message = `${action.role} - Assist needed! Attack link: ${attackUrl}`;
                        } else {
                            message = `${action.role} - Assist needed! (No target ID found)`;
                        }
                    } else {
                        this.showToast('Assist only works on attack pages with a target selected', 'warning');
                        return; // Don't send message if not on attack page
                    }
                    break;
                    
                case 'trader':
                    if (this.state.profile?.id) {
                        const tradeUrl = `https://www.torn.com/trade.php#step=start&userID=${this.state.profile.id}`;
                        message = `${action.role} - Trader needed! Trade link: ${tradeUrl}`;
                    } else {
                        message = `${action.role} - Trader needed!`;
                    }
                    break;
                    
                case 'bounty':
                    const bountyUrl = 'https://www.torn.com/bounties.php#/p=add';
                    message = `${action.role} - Bounty needed! Bounty link: ${bountyUrl}`;
                    break;
                    
                case 'banker':
                    // Banker messages go only to banking room for faction members
                    roomId = '1080875329888997429';
                    message = `${action.role} - Banker needed!`;
                    break;
                    
                case 'mercenary':
                    message = `${action.role} - Mercenary needed!`;
                    break;
                    
                default:
                    message = `${action.role} - ${action.label} needed!`;
            }

            // Send message
            const messageHash = this.generateMessageHash(message, now);
            this.pendingMessages.add(messageHash);

            const success = await this.sendToSupabase(message, roomId, true);

            if (success) {
                this.addMessage(message, 'out', action.label, null, now, `temp_${messageHash}`);
                this.showAlertToast(message);
                setTimeout(() => this.pendingMessages.delete(messageHash), 30000);
            } else {
                this.showToast(`${action.label} failed to send`, 'error');
                this.pendingMessages.delete(messageHash);
            }
        }

        async sendToSupabase(message, roomId, alert = false) {
            if (!this.state.profile?.name) return false;

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
                return false;
            }
        }

        async sendMessage() {
            const input = document.querySelector('.pp-input');
            const message = input?.value.trim();
            if (!message) return;

            const sanitizedMessage = this.sanitizeHTML(message);
            if (!sanitizedMessage) {
                this.showToast('Invalid message', 'error');
                return;
            }

            const now = Date.now();
            const messageHash = this.generateMessageHash(sanitizedMessage, now);
            if (this.pendingMessages.has(messageHash)) return;

            this.pendingMessages.add(messageHash);
            this.addMessage(sanitizedMessage, 'out', 'normal', null, now, `temp_${messageHash}`);

            const success = await this.sendToSupabase(sanitizedMessage, this.state.selectedRoom, false);

            if (success) {
                input.value = '';
                input.focus();
                setTimeout(() => this.pendingMessages.delete(messageHash), 30000);
            } else {
                this.showToast('Send failed', 'error');
                this.pendingMessages.delete(messageHash);
                this.removeTemporaryMessage(`temp_${messageHash}`);
            }
        }

        async fetchMessages() {
            if (this.isPolling || !this.isRoomAccessible(this.state.selectedRoom)) {
                this.isPolling = false;
                return;
            }

            this.isPolling = true;
            try {
                const now = Date.now();
                if (now - this.state.lastSync < 2000) return;

                const fiveMinutesAgo = new Date(now - 5 * 60000).toISOString();
                const response = await this.supabaseRequest('GET',
                    `/rest/v1/portal_messages?room_id=eq.${this.state.selectedRoom}` +
                    `&created_at=gt.${fiveMinutesAgo}` +
                    `&order=created_at.desc&limit=50`
                );

                if (response && Array.isArray(response) && response.length > 0) {
                    response.reverse().forEach(msg => {
                        if (!this.isRoomAccessible(msg.room_id)) return;

                        const sanitizedMessage = this.sanitizeHTML(msg.message || '');
                        const sanitizedSender = this.sanitizeHTML(msg.torn_profile_name || msg.discord_name || 'Unknown');
                        const msgHash = this.generateMessageHash(
                            sanitizedMessage, 
                            new Date(msg.created_at || Date.now()).getTime(),
                            sanitizedSender
                        );
                        
                        if (this.pendingMessages.has(msgHash) || this.state.messageCache.has(msg.sync_id)) {
                            return;
                        }

                        if (this.findExistingMessage(sanitizedMessage, new Date(msg.created_at).getTime(), sanitizedSender)) {
                            this.state.messageCache.set(msg.sync_id, true);
                            return;
                        }

                        this.addMessage(
                            sanitizedMessage,
                            msg.discord_id ? 'in' : 'out',
                            msg.alert ? 'alert' : 'normal',
                            sanitizedSender,
                            msg.created_at || new Date().toISOString(),
                            msg.sync_id
                        );

                        this.state.messageCache.set(msg.sync_id, true);
                        this.addToRoomHistory({
                            ...msg,
                            message: sanitizedMessage,
                            torn_profile_name: sanitizedSender
                        });

                        // Increment unread count if chat is closed
                        if (!this.isOpen) {
                            this.unreadMessages++;
                            this.updateFABPulse();
                        }

                        // Update message stats for received messages
                        if (msg.discord_id) {
                            this.state.messageStats.received++;
                            this.state.messageStats.lastMessageTime = Date.now();
                            GM_setValue('pp_message_stats', this.state.messageStats);
                        }

                        // Show alerts if enabled
                        if (msg.alert && !msg.discord_id && this.state.settings.showNotifications) {
                            const messageTime = new Date(msg.created_at || Date.now()).getTime();
                            if (now - messageTime < 300000 && !this.pendingNotifications.has(msg.sync_id)) {
                                this.showImmediateAlert(sanitizedMessage, sanitizedSender);
                                this.pendingNotifications.add(msg.sync_id);
                                setTimeout(() => this.pendingNotifications.delete(msg.sync_id), 300000);
                            }
                        }

                        if (!this.isOpen) this.triggerFABPulse();
                    });
                    this.cleanupMessageCache();
                }
                this.state.lastSync = now;
            } catch (error) {
                // Network errors are handled silently
            } finally {
                this.isPolling = false;
            }
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
                this.audioCache.currentTime = 0;
                await this.audioCache.play().catch(() => {
                    // Audio playback errors are handled silently
                });
            } catch (error) {
                // Sound errors are silent
            }
        }

        showImmediateAlert(message, sender) {
            this.playAlertSound();
            this.showAlertToast(`Alert from ${sender}: ${message.substring(0, 100)}...`);
            
            if (this.state.settings.showNotifications && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                try {
                    new Notification('Phantom Portal Alert', {
                        body: `${sender}: ${message.substring(0, 200)}`,
                        icon: 'https://images2.imgbox.com/86/79/2ag63Ut3_o.png'
                    });
                } catch (error) {
                    // Notification permission errors are silent
                }
            }
        }

        generateMessageHash(content, timestamp, sender = null) {
            const data = `${content}|${timestamp}|${sender}`;
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString();
        }

        findExistingMessage(content, timestamp, sender) {
            const messagesEl = document.querySelector('.pp-messages');
            if (!messagesEl) return null;

            const messages = messagesEl.querySelectorAll('.pp-message');
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
            if (!this.state.roomMessages[this.state.selectedRoom]) {
                this.state.roomMessages[this.state.selectedRoom] = [];
            }

            const roomMessages = this.state.roomMessages[this.state.selectedRoom];
            const exists = roomMessages.some(existing => existing.sync_id === msg.sync_id);

            if (!exists) {
                roomMessages.push({
                    sync_id: msg.sync_id,
                    message: msg.message,
                    created_at: msg.created_at,
                    torn_profile_name: msg.torn_profile_name,
                    discord_name: msg.discord_name,
                    alert: msg.alert
                });

                if (roomMessages.length > 50) roomMessages.shift();
                GM_setValue('pp_room_messages', this.state.roomMessages);
            }
        }

        loadRoomHistory() {
            const messagesEl = document.querySelector('.pp-messages');
            if (!messagesEl) return;

            messagesEl.innerHTML = '';
            const roomHistory = this.state.roomMessages[this.state.selectedRoom] || [];
            
            roomHistory.forEach(msg => {
                this.addMessage(
                    msg.message || '',
                    msg.discord_name ? 'in' : 'out',
                    msg.alert ? 'alert' : 'normal',
                    msg.torn_profile_name || msg.discord_name || 'Unknown',
                    msg.created_at || new Date().toISOString(),
                    msg.sync_id
                );
                if (msg.sync_id) this.state.messageCache.set(msg.sync_id, true);
            });
        }

        cleanupMessageCache() {
            if (this.state.messageCache.size > 200) {
                const keysToDelete = Array.from(this.state.messageCache.keys()).slice(0, 100);
                keysToDelete.forEach(key => this.state.messageCache.delete(key));
            }
        }

        removeTemporaryMessage(tempId) {
            const msgEl = document.querySelector(`.pp-message[data-temp-id="${tempId}"]`);
            if (msgEl && msgEl.parentNode) {
                msgEl.parentNode.removeChild(msgEl);
            }
        }

        addMessage(content, direction, type = 'normal', sender = null, timestamp = null, sync_id = null) {
            const messagesEl = document.querySelector('.pp-messages');
            if (!messagesEl) return;

            const msgEl = document.createElement('div');
            msgEl.className = `pp-message message-${direction}`;
            if (sync_id) msgEl.setAttribute('data-sync-id', sync_id);

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
            textEl.innerHTML = this.linkify(content);
            msgEl.appendChild(textEl);

            const timeEl = document.createElement('div');
            timeEl.className = 'message-time';
            timeEl.textContent = new Date(timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            msgEl.appendChild(timeEl);

            messagesEl.appendChild(msgEl);

            // Update message stats for sent messages
            if (direction === 'out' && !sync_id?.startsWith('temp_')) {
                this.state.messageStats.sent++;
                this.state.messageStats.lastMessageTime = Date.now();
                GM_setValue('pp_message_stats', this.state.messageStats);
            }

            if (this.state.settings.autoScroll) {
                setTimeout(() => messagesEl.scrollTop = messagesEl.scrollHeight, 10);
            }
        }

        linkify(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color: #00ff88; text-decoration: underline;">' + url + '</a>';
            });
        }

        showAlertToast(message) {
            const toast = document.createElement('div');
            toast.className = 'pp-alert-toast';
            toast.textContent = `Alert: ${message.substring(0, 100)}...`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        }

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `pp-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        triggerFABPulse() {
            if (this.fabPulsing) return;
            this.fabPulsing = true;
            this.toggleBtn.classList.add('pulsing');
            
            // Start continuous pulsing until chat is opened
            this.startContinuousPulse();
        }

        updateFABPulse() {
            if (this.unreadMessages > 0 && !this.isOpen) {
                if (!this.fabPulsing) {
                    this.fabPulsing = true;
                    this.toggleBtn.classList.add('pulsing');
                    this.startContinuousPulse();
                }
            } else {
                this.stopContinuousPulse();
                this.fabPulsing = false;
                this.toggleBtn.classList.remove('pulsing');
            }
        }

        startContinuousPulse() {
            if (this.fabPulseInterval) return;
            
            this.fabPulseInterval = setInterval(() => {
                if (this.toggleBtn) {
                    this.toggleBtn.classList.add('pulsing');
                }
            }, 2000);
        }

        stopContinuousPulse() {
            if (this.fabPulseInterval) {
                clearInterval(this.fabPulseInterval);
                this.fabPulseInterval = null;
            }
        }

        openSettings() {
            const modal = document.createElement('div');
            modal.className = 'pp-settings-modal';
            
            const profileName = this.state.profile?.name || 'Not loaded';
            const profileId = this.state.profile?.id || 'N/A';
            const factionName = this.state.faction?.name || 'No faction';
            const factionAccess = this.state.isInAllowedFaction ? '✓ Full Access' : '✗ Limited Access';
            
            // Calculate latency
            const now = Date.now();
            const lastMsgTime = this.state.messageStats.lastMessageTime;
            const latency = lastMsgTime > 0 ? Math.max(0, Math.floor((now - lastMsgTime) / 1000)) : 0;
            
            // Chain info
            const chainCurrent = this.state.chainCurrentSnapshot || this.state.chainData?.current || 0;
            const chainMax = this.state.chainData?.max || 0;
            const chainTimeout = this.state.chainEndTime > 0 ? Math.max(0, this.state.chainEndTime - Math.floor(Date.now() / 1000)) : 0;
            const chainCooldown = this.state.chainData?.cooldown || 0;
            
            modal.innerHTML = `
                <div class="pp-settings-content">
                    <div class="pp-settings-header">
                        <h3>Phantom Portal Settings v2.2.0</h3>
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
                        
                        ${this.state.isInAllowedFaction ? `
                        <div class="pp-settings-section">
                            <h4>Faction Chain Information</h4>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Current Chain:</span>
                                <span class="pp-info-value ${chainCurrent > 0 ? 'access-granted' : ''}" id="pp-chain-current">${chainCurrent.toLocaleString()}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Max Chain:</span>
                                <span class="pp-info-value" id="pp-chain-max">${chainMax.toLocaleString()}</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Timeout:</span>
                                <span class="pp-info-value" id="pp-chain-timeout">${chainTimeout}s</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">Cooldown:</span>
                                <span class="pp-info-value" id="pp-chain-cooldown">${chainCooldown}s</span>
                            </div>
                            <div class="pp-info-item">
                                <span class="pp-info-label">API Latency:</span>
                                <span class="pp-info-value" id="pp-chain-latency">${this.state.chainFetchLatency}ms</span>
                            </div>
                        </div>
                        ` : ''}
                        
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
                                    Show Notifications
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
                        </div>
                        
                        <div class="pp-settings-buttons">
                            <button class="pp-settings-btn" id="pp-refresh-profile">
                                🔄 Refresh Profile & Chain
                            </button>
                            <button class="pp-settings-btn" id="pp-clear-messages">
                                🗑️ Clear Messages
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
                    GM_setValue('pp_settings', this.state.settings);
                    this.showToast('Settings saved', 'success');
                });
            });

            const refreshBtn = modal.querySelector('#pp-refresh-profile');
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.textContent = 'Checking...';
                refreshBtn.disabled = true;
                
                try {
                    const result = await this.refreshProfileWithRealtimeCheck();
                    
                    if (result.success) {
                        const profileNameEl = modal.querySelector('#pp-current-profile-name');
                        const profileIdEl = modal.querySelector('#pp-current-profile-id');
                        const factionNameEl = modal.querySelector('#pp-current-faction-name');
                        const accessEl = modal.querySelector('#pp-current-access');
                        const chainCurrentEl = modal.querySelector('#pp-chain-current');
                        const chainMaxEl = modal.querySelector('#pp-chain-max');
                        const chainTimeoutEl = modal.querySelector('#pp-chain-timeout');
                        const chainCooldownEl = modal.querySelector('#pp-chain-cooldown');
                        const chainLatencyEl = modal.querySelector('#pp-chain-latency');
                        
                        if (profileNameEl) profileNameEl.textContent = result.profile?.name || 'Not loaded';
                        if (profileIdEl) profileIdEl.textContent = result.profile?.id || 'N/A';
                        if (factionNameEl) factionNameEl.textContent = result.faction?.name || 'No faction';
                        
                        const newAccess = result.isInAllowedFaction ? '✓ Full Access' : '✗ Limited Access';
                        if (accessEl) {
                            accessEl.textContent = newAccess;
                            accessEl.className = `pp-info-value ${result.isInAllowedFaction ? 'access-granted' : 'access-denied'}`;
                        }
                        
                        if (chainCurrentEl && result.chainData) {
                            chainCurrentEl.textContent = result.chainData.current.toLocaleString();
                            chainCurrentEl.className = `pp-info-value ${result.chainData.current > 0 ? 'access-granted' : ''}`;
                        }
                        if (chainMaxEl && result.chainData) chainMaxEl.textContent = result.chainData.max.toLocaleString();
                        if (chainTimeoutEl && result.chainData) {
                            const timeout = this.state.chainEndTime > 0 ? Math.max(0, this.state.chainEndTime - Math.floor(Date.now() / 1000)) : 0;
                            chainTimeoutEl.textContent = timeout + 's';
                        }
                        if (chainCooldownEl && result.chainData) chainCooldownEl.textContent = result.chainData.cooldown + 's';
                        if (chainLatencyEl) chainLatencyEl.textContent = this.state.chainFetchLatency + 'ms';
                        
                        this.showToast('Profile, faction and chain refreshed successfully!', 'success');
                    } else {
                        this.showToast(`Refresh failed: ${result.error}`, 'error');
                    }
                } catch (error) {
                    this.showToast('Refresh failed', 'error');
                } finally {
                    refreshBtn.textContent = '🔄 Refresh Profile & Chain';
                    refreshBtn.disabled = false;
                }
            });

            const clearBtn = modal.querySelector('#pp-clear-messages');
            clearBtn.addEventListener('click', () => {
                if (confirm('Clear all message history? This cannot be undone.')) {
                    this.state.roomMessages = {};
                    Object.keys(this.rooms).forEach(roomId => this.state.roomMessages[roomId] = []);
                    this.state.messageCache.clear();
                    GM_setValue('pp_room_messages', this.state.roomMessages);
                    
                    const messagesEl = document.querySelector('.pp-messages');
                    if (messagesEl) messagesEl.innerHTML = '';
                    
                    this.showToast('Messages cleared', 'success');
                    modal.remove();
                }
            });
        }

        async supabaseRequest(method, endpoint, data = null) {
            return new Promise((resolve, reject) => {
                const url = `${this.supabaseUrl}${endpoint}`;
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    data: data ? JSON.stringify(data) : null,
                    timeout: 8000,
                    onload: (response) => {
                        const now = Date.now();
                        this.state.messageStats.lastLatency = now - this.state.messageStats.lastMessageTime;
                        GM_setValue('pp_message_stats', this.state.messageStats);
                        
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                resolve(response.responseText ? JSON.parse(response.responseText) : {});
                            } catch {
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
            const sync = () => {
                if (this.isOpen) this.fetchMessages();
                setTimeout(sync, 3000);
            };
            setTimeout(sync, 1000);
        }

        startCooldownTicker() {
            setInterval(() => {
                const now = Date.now();
                let changed = false;
                Object.keys(this.state.buttonCooldowns).forEach(id => {
                    if (now - this.state.buttonCooldowns[id] >= 10000) {
                        delete this.state.buttonCooldowns[id];
                        changed = true;
                    }
                });
                if (changed) GM_setValue('pp_button_cooldowns', this.state.buttonCooldowns);
            }, 1000);
        }

        startStatsUpdater() {
            setInterval(() => {
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

        startChainUpdater() {
            const updateChain = () => {
                if (this.state.isInAllowedFaction) {
                    this.fetchChainData();
                }
                setTimeout(updateChain, 30000); // Update every 30 seconds when active
            };
            setTimeout(updateChain, 3000); // Initial delay
        }

        createUI() {
            this.toggleBtn = document.createElement('div');
            this.toggleBtn.className = 'pp-toggle';
            this.toggleBtn.innerHTML = '<img src="https://images2.imgbox.com/86/79/2ag63Ut3_o.png" class="pp-toggle-icon" alt="PP">';
            this.toggleBtn.title = 'Phantom Portal v2.2.0 - Long press to move, tap to open';
            
            // Apply saved position
            this.toggleBtn.style.position = 'fixed';
            this.toggleBtn.style.left = `${this.state.fabPosition.x}px`;
            this.toggleBtn.style.top = `${this.state.fabPosition.y}px`;
            this.toggleBtn.style.zIndex = '9999';

            this.container = document.createElement('div');
            this.container.className = 'pp-container';
            this.container.innerHTML = `
                <div class="pp-header">
                    <div class="pp-title">
                        <img src="https://images2.imgbox.com/86/79/2ag63Ut3_o.png" class="pp-header-icon" alt="">
                        Phantom Portal v2.2.0
                        <button class="pp-close-btn" title="Close window">✕</button>
                    </div>
                    <div class="pp-header-right">
                        <div class="pp-chain-display">
                            <div class="pp-chain-label">CHAIN</div>
                            <div class="pp-chain-values">
                                <div class="pp-chain-current">0</div>
                                <div class="pp-chain-timeout">00:00</div>
                            </div>
                        </div>
                        <div class="pp-profile-display">Loading...</div>
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
            quickActionsEl.appendChild(this.createQuickActions());

            this.createRoomSelector();
            this.setupEvents();
        }

        createRoomSelector() {
            const selectorEl = this.container.querySelector('.pp-room-selector');
            Object.entries(this.rooms).forEach(([id, room]) => {
                if (room.type === 'general' || this.state.isInAllowedFaction) {
                    const btn = document.createElement('button');
                    btn.className = 'pp-room-btn';
                    if (id === this.state.selectedRoom) btn.classList.add('active');
                    btn.textContent = room.name;
                    btn.dataset.roomId = id;
                    btn.addEventListener('click', () => this.switchRoom(id));
                    selectorEl.appendChild(btn);
                }
            });
        }

        setupEvents() {
            // Mobile touch events for FAB
            this.toggleBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const touch = e.touches[0];
                this.fabStartX = this.toggleBtn.offsetLeft;
                this.fabStartY = this.toggleBtn.offsetTop;
                this.dragStartX = touch.clientX;
                this.dragStartY = touch.clientY;
                
                // Start long press detection
                this.isLongPressing = false;
                this.longPressTimer = setTimeout(() => {
                    this.isLongPressing = true;
                    this.isDragging = false;
                    this.toggleBtn.classList.add('dragging');
                }, 500);
                
                // Prevent context menu
                e.target.addEventListener('contextmenu', (ev) => ev.preventDefault());
            });

            this.toggleBtn.addEventListener('touchmove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.dragStartX;
                const deltaY = touch.clientY - this.dragStartY;
                
                // Check if we've moved enough to start dragging (deadzone of 5px)
                if (!this.isDragging && !this.isLongPressing) {
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    if (distance > 5) {
                        clearTimeout(this.longPressTimer);
                    }
                }
                
                // If long press detected, start dragging
                if (this.isLongPressing) {
                    const newX = this.fabStartX + deltaX;
                    const newY = this.fabStartY + deltaY;
                    
                    // Constrain to viewport
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const fabWidth = this.toggleBtn.offsetWidth;
                    const fabHeight = this.toggleBtn.offsetHeight;
                    
                    const constrainedX = Math.max(0, Math.min(newX, viewportWidth - fabWidth));
                    const constrainedY = Math.max(0, Math.min(newY, viewportHeight - fabHeight));
                    
                    this.toggleBtn.style.left = `${constrainedX}px`;
                    this.toggleBtn.style.top = `${constrainedY}px`;
                    
                    this.state.fabPosition = { x: constrainedX, y: constrainedY };
                    this.isDragging = true;
                }
            });

            this.toggleBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                clearTimeout(this.longPressTimer);
                
                // Save position if we were dragging
                if (this.isDragging) {
                    GM_setValue('pp_fab_position', this.state.fabPosition);
                } else {
                    // If not dragging and not long pressing, it's a tap - toggle chat
                    if (!this.isLongPressing) {
                        this.toggleChat();
                    }
                }
                
                // Reset states
                this.isDragging = false;
                this.isLongPressing = false;
                this.toggleBtn.classList.remove('dragging');
                
                // Remove context menu prevention
                e.target.removeEventListener('contextmenu', (ev) => ev.preventDefault());
            });

            // Close button in header
            const closeBtn = this.container.querySelector('.pp-close-btn');
            closeBtn.addEventListener('click', () => {
                this.isOpen = false;
                this.container.style.display = 'none';
            });

            const sendBtn = this.container.querySelector('.pp-send');
            const input = this.container.querySelector('.pp-input');
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Close chat when tapping outside (mobile-friendly)
            const closeChatHandler = (e) => {
                if (this.isOpen && !this.container.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                    this.isOpen = false;
                    this.container.style.display = 'none';
                }
            };
            
            document.addEventListener('click', closeChatHandler);
            document.addEventListener('touchstart', closeChatHandler);
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.container.style.display = this.isOpen ? 'flex' : 'none';
            if (this.isOpen) {
                document.querySelector('.pp-input')?.focus();
                this.loadRoomHistory();
                this.fetchMessages();
                this.stopContinuousPulse();
                this.toggleBtn.classList.remove('pulsing');
                this.fabPulsing = false;
                this.unreadMessages = 0;
            }
        }

        injectStyles() {
            if (document.querySelector('style[data-phantom-portal]')) return;
            
            const css = `
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
                    background: rgba(10, 15, 10, 0.98);
                    border: 2px solid #00ff41;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 255, 65, 0.3);
                    z-index: 10000;
                    display: none;
                    flex-direction: column;
                    backdrop-filter: blur(10px);
                    font-family: 'Segoe UI', sans-serif;
                    overflow: hidden;
                    color: #c8ffd0;
                }

                .pp-header {
                    background: linear-gradient(135deg, #001500 0%, #003000 100%);
                    color: #00ff41;
                    padding: 12px 15px;
                    border-bottom: 1px solid #004400;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .pp-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: bold;
                    font-size: 14px;
                    flex: 1;
                }

                .pp-close-btn {
                    background: none;
                    border: none;
                    color: #80ff80;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 2px 8px;
                    border-radius: 4px;
                    margin-left: 10px;
                    transition: all 0.2s;
                }

                .pp-close-btn:hover {
                    background: rgba(255, 0, 0, 0.2);
                    color: #ff6666;
                }

                .pp-header-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                }

                .pp-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pp-chain-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 6px 10px;
                    background: rgba(0, 5, 0, 0.9);
                    border: 2px solid #002200;
                    border-radius: 10px;
                    min-width: 90px;
                    font-family: 'Courier New', monospace;
                    transition: all 0.3s ease;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
                }

                .pp-chain-display.active {
                    background: rgba(0, 10, 0, 0.95);
                    border-color: #00aa00;
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1);
                }

                .pp-chain-display.neon-blue {
                    border-color: #0066ff;
                    box-shadow: 0 0 20px rgba(0, 102, 255, 0.7), inset 0 0 25px rgba(0, 102, 255, 0.3);
                    background: rgba(0, 10, 20, 0.95);
                }

                .pp-chain-display.neon-green {
                    border-color: #00ff00;
                    box-shadow: 0 0 25px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(0, 255, 0, 0.4);
                    background: rgba(0, 20, 0, 0.95);
                }

                .pp-chain-display.neon-yellow {
                    border-color: #ffff00;
                    box-shadow: 0 0 30px rgba(255, 255, 0, 0.9), inset 0 0 35px rgba(255, 255, 0, 0.5);
                    background: rgba(20, 20, 0, 0.95);
                }

                .pp-chain-display.neon-red {
                    border-color: #ff0000;
                    box-shadow: 0 0 35px rgba(255, 0, 0, 1), inset 0 0 40px rgba(255, 0, 0, 0.6);
                    background: rgba(20, 0, 0, 0.95);
                }

                .pp-chain-display.flash-red {
                    border-color: #ff0000;
                    background: rgba(20, 0, 0, 0.95);
                    animation: flashRed 0.5s infinite alternate;
                }

                .pp-chain-display.flash-gold {
                    border-color: #ffd700;
                    background: rgba(30, 20, 0, 0.95);
                    animation: flashGold 0.8s infinite alternate;
                }

                .pp-chain-label {
                    font-size: 9px;
                    color: #80ff80;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                    text-shadow: 0 0 5px currentColor;
                }

                .pp-chain-values {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    align-items: center;
                }

                .pp-chain-current {
                    font-size: 18px;
                    font-weight: bold;
                    color: #80ff80;
                    text-shadow: 0 0 8px rgba(128, 255, 128, 0.7);
                    transition: all 0.3s ease;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 1px;
                }

                .pp-chain-current.active {
                    color: #00ff00;
                    text-shadow: 0 0 15px #00ff00, 0 0 30px #00ff00;
                }

                .pp-chain-current.flash-gold {
                    color: #ffd700;
                    text-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700;
                    animation: flashGoldText 0.8s infinite alternate;
                }

                .pp-chain-timeout {
                    font-size: 14px;
                    color: #80ff80;
                    align-self: flex-end;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    text-shadow: 0 0 5px currentColor;
                }

                .pp-chain-timeout.active {
                    color: #00ff00;
                    text-shadow: 0 0 10px #00ff00;
                }

                @keyframes flashRed {
                    0% { 
                        box-shadow: 0 0 10px #ff0000, inset 0 0 10px #ff0000;
                        border-color: #ff0000;
                    }
                    100% { 
                        box-shadow: 0 0 40px #ff0000, 0 0 60px #ff0000, inset 0 0 20px #ff0000;
                        border-color: #ffffff;
                    }
                }

                @keyframes flashGold {
                    0% { 
                        box-shadow: 0 0 15px #ffd700, inset 0 0 15px #ffd700;
                        border-color: #ffd700;
                    }
                    100% { 
                        box-shadow: 0 0 50px #ffd700, 0 0 80px #ffd700, inset 0 0 25px #ffd700;
                        border-color: #ffff00;
                    }
                }

                @keyframes flashGoldText {
                    0% { 
                        text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
                        color: #ffd700;
                    }
                    100% { 
                        text-shadow: 0 0 25px #ffd700, 0 0 50px #ffd700, 0 0 75px #ffd700;
                        color: #ffff00;
                    }
                }

                @keyframes pp-celebration-fall {
                    0% {
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                .pp-profile-display {
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 12px;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .pp-profile-display.connected {
                    background: rgba(0, 255, 65, 0.1);
                    border: 1px solid rgba(0, 255, 65, 0.3);
                    color: #80ff80;
                }

                .pp-profile-display.guest {
                    background: rgba(255, 165, 0, 0.1);
                    border: 1px solid rgba(255, 165, 0, 0.3);
                    color: #ffb366;
                }

                .pp-quick-actions {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 10px;
                    background: rgba(0, 10, 0, 0.8);
                    border-bottom: 1px solid #004400;
                    flex-wrap: wrap;
                    gap: 5px;
                }

                .pp-action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    background: rgba(0, 20, 0, 0.8);
                    color: white;
                    transition: transform 0.2s, background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pp-action-btn:hover {
                    transform: scale(1.1);
                }

                .pp-action-btn.cooldown {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pp-action-btn.settings {
                    background: rgba(50, 50, 50, 0.8);
                }

                .pp-action-btn.settings:hover {
                    background: rgba(70, 70, 70, 0.9);
                }

                .pp-room-selector {
                    display: flex;
                    padding: 5px;
                    background: rgba(0, 15, 0, 0.6);
                    border-bottom: 1px solid #003300;
                    gap: 5px;
                }

                .pp-room-btn {
                    flex: 1;
                    padding: 6px;
                    background: rgba(0, 25, 0, 0.6);
                    border: 1px solid #005500;
                    color: #aaffaa;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                }

                .pp-room-btn.active {
                    background: rgba(0, 255, 65, 0.2);
                    border-color: #00ff41;
                    color: #00ff41;
                }

                .pp-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    background: rgba(0, 5, 0, 0.5);
                }

                .pp-message {
                    margin: 8px 0;
                    padding: 8px 12px;
                    border-radius: 8px;
                    max-width: 85%;
                    word-wrap: break-word;
                    transition: opacity 0.3s;
                }

                .pp-message.temporary {
                    opacity: 0.7;
                }

                .message-in {
                    background: rgba(0, 40, 0, 0.4);
                    border: 1px solid #005500;
                    align-self: flex-start;
                }

                .message-out {
                    background: rgba(0, 30, 40, 0.4);
                    border: 1px solid #0088aa;
                    align-self: flex-end;
                    margin-left: auto;
                }

                .message-sender {
                    font-size: 11px;
                    opacity: 0.8;
                    margin-bottom: 2px;
                }

                .message-badge {
                    background: #ffaa00;
                    color: #000;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    margin-right: 6px;
                }

                .message-text {
                    font-size: 13px;
                    line-height: 1.4;
                }

                .message-text a {
                    color: #00ff88;
                    text-decoration: underline;
                    word-break: break-all;
                }

                .message-text a:hover {
                    color: #88ffcc;
                }

                .message-time {
                    font-size: 10px;
                    opacity: 0.7;
                    margin-top: 4px;
                    text-align: right;
                }

                .pp-input-area {
                    padding: 10px;
                    border-top: 1px solid #004400;
                    background: rgba(0, 10, 0, 0.8);
                    display: flex;
                    gap: 8px;
                }

                .pp-input {
                    flex: 1;
                    padding: 8px 12px;
                    background: rgba(0, 20, 0, 0.6);
                    border: 1px solid #006600;
                    border-radius: 20px;
                    color: #e0ffe0;
                    font-size: 14px;
                    outline: none;
                }

                .pp-send {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #003300 0%, #006600 100%);
                    border: 1px solid #00aa00;
                    color: #00ff41;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pp-toggle {
                    position: fixed;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #002200 0%, #006600 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ff41;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 255, 65, 0.3);
                    border: 1px solid #00aa00;
                    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
                    user-select: none;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }

                .pp-toggle:hover {
                    box-shadow: 0 4px 25px rgba(0, 255, 65, 0.4);
                    transform: scale(1.05);
                }

                .pp-toggle.pulsing {
                    border-color: #00ff00;
                    animation: pulseGlow 2s infinite alternate;
                }

                .pp-toggle.dragging {
                    cursor: grabbing;
                    opacity: 0.9;
                    transform: scale(1.1);
                    box-shadow: 0 6px 30px rgba(0, 255, 65, 0.6);
                }

                @keyframes pulseGlow {
                    0% {
                        box-shadow: 0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.3);
                        border-color: #00aa00;
                    }
                    100% {
                        box-shadow: 0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.5), 0 0 60px rgba(0, 255, 65, 0.3);
                        border-color: #00ff00;
                    }
                }

                .pp-toggle-icon {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    pointer-events: none;
                }

                .pp-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    background: rgba(0, 20, 0, 0.9);
                    border: 1px solid #00ff41;
                    border-radius: 8px;
                    color: #c8ffd0;
                    z-index: 10001;
                    animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
                    max-width: 300px;
                    pointer-events: none;
                }

                .pp-toast.success { border-color: #44ff44; }
                .pp-toast.warning { border-color: #ffaa00; }
                .pp-toast.error { border-color: #ff4444; }

                .pp-alert-toast {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    padding: 12px 20px;
                    background: rgba(20, 0, 0, 0.9);
                    border: 2px solid #ff4444;
                    border-radius: 8px;
                    color: #ffcccc;
                    z-index: 10001;
                    animation: slideIn 0.3s, pulse 2s infinite;
                    max-width: 300px;
                    pointer-events: none;
                    font-weight: bold;
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
                    background: rgba(10, 20, 10, 0.95);
                    border: 2px solid #00ff41;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 450px;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .pp-settings-header {
                    background: linear-gradient(135deg, #001500 0%, #003000 100%);
                    color: #00ff41;
                    padding: 15px;
                    border-bottom: 1px solid #004400;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .pp-settings-header h3 {
                    margin: 0;
                    font-size: 16px;
                }

                .pp-settings-close {
                    background: none;
                    border: none;
                    color: #00ff41;
                    font-size: 24px;
                    cursor: pointer;
                    line-height: 1;
                }

                .pp-settings-body {
                    padding: 20px;
                }

                .pp-profile-info {
                    background: rgba(0, 30, 0, 0.3);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    border: 1px solid #005500;
                }

                .pp-profile-info h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #80ff80;
                    font-size: 14px;
                    border-bottom: 1px solid #004400;
                    padding-bottom: 8px;
                }

                .pp-info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 13px;
                }

                .pp-info-label {
                    color: #aaffaa;
                    font-weight: bold;
                }

                .pp-info-value {
                    color: #c8ffd0;
                    max-width: 60%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .pp-info-value.access-granted {
                    color: #44ff44;
                    font-weight: bold;
                }

                .pp-info-value.access-denied {
                    color: #ff6666;
                    font-weight: bold;
                }

                .pp-settings-section {
                    margin-bottom: 20px;
                }

                .pp-settings-section h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #80ff80;
                    font-size: 14px;
                    border-bottom: 1px solid #004400;
                    padding-bottom: 8px;
                }

                .pp-setting-item {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }

                .pp-setting-item label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #c8ffd0;
                    cursor: pointer;
                    font-size: 14px;
                }

                .pp-setting-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #00ff41;
                }

                .pp-settings-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pp-settings-btn {
                    padding: 12px;
                    background: rgba(0, 30, 0, 0.8);
                    border: 1px solid #006600;
                    color: #aaffaa;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .pp-settings-btn:hover {
                    background: rgba(0, 50, 0, 0.9);
                    border-color: #00aa00;
                    transform: translateY(-1px);
                }

                .pp-settings-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .pp-settings-btn#pp-clear-messages {
                    background: rgba(50, 0, 0, 0.8);
                    border-color: #660000;
                }

                .pp-settings-btn#pp-clear-messages:hover {
                    background: rgba(80, 0, 0, 0.9);
                    border-color: #ff0000;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                @keyframes pulse {
                    0% { border-color: #ff4444; }
                    50% { border-color: #ff8888; }
                    100% { border-color: #ff4444; }
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(0, 20, 0, 0.3);
                }

                ::webkit-scrollbar-thumb {
                    background: rgba(0, 255, 65, 0.3);
                    border-radius: 3px;
                }

                /* Mobile-specific improvements */
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
                    
                    .pp-chain-display {
                        min-width: 80px;
                        padding: 4px 8px;
                    }
                    
                    .pp-chain-current {
                        font-size: 16px;
                    }
                    
                    .pp-chain-timeout {
                        font-size: 12px;
                    }
                }
            `;

            const style = document.createElement('style');
            style.setAttribute('data-phantom-portal', 'true');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    function initialize() {
        try {
            if (!window.location.href.includes('torn.com')) return;
            if (typeof GM_xmlhttpRequest === 'undefined') return;

            setTimeout(() => {
                try {
                    new PhantomPortal();
                } catch (error) {
                    // Initialization errors are silent for user experience
                }
            }, 500);
        } catch (error) {
            // Top-level errors are silent
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
})();