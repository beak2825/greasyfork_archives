// ==UserScript==
// @name         Phantom Fly v1.3.1 Beta 
// @namespace    http://tampermonkey.net/
// @version      1.3.1 Beta
// @description  Phantom Core plugin: Display faction members traveling, abroad, or abroad in hospital on interactive world map with full Phantom Core theme integration
// @author       Daturax [2627396]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/558040/Phantom%20Core%20v131.user.js
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559918/Phantom%20Fly%20v131%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/559918/Phantom%20Fly%20v131%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PLUGIN_INFO = {
        id: 'phantom_fly',
        name: 'Phantom Fly',
        version: '1.3.1 Beta',
        author: 'Daturax [2627396]',
        description: 'Display faction members traveling, abroad, or abroad in hospital on interactive world map',
        icon: 'https://img.icons8.com/ios/50/ffffff/airplane-take-off.png'
    };

    const DEFAULT_CONFIG = {
        refreshInterval: 300000,
        lastUpdateTime: 0
    };

    const WORLD_MAP_IMAGE = 'https://images2.imgbox.com/37/ce/vtq5jF8K_o.png';
    const WORLD_MAP_WIDTH = 500;
    const WORLD_MAP_HEIGHT = 249;

    const LOCATION_COORDINATES = {
        'Torn City': {x: 137, y: 112, region: 'USA'},
        'Ciudad Juárez': {x: 120, y: 125, region: 'Mexico'},
        'George Town': {x: 141, y: 141, region: 'Cayman Islands'},
        'Toronto': {x: 151, y: 88, region: 'Canada'},
        'Honolulu': {x: 55, y: 131, region: 'Hawaii'},
        'London': {x: 237, y: 76, region: 'United Kingdom'},
        'Buenos Aires': {x: 167, y: 202, region: 'Argentina'},
        'Zurich': {x: 243, y: 84, region: 'Switzerland'},
        'Tokyo': {x: 402, y: 105, region: 'Japan'},
        'Beijing': {x: 375, y: 98, region: 'China'},
        'Dubai': {x: 303, y: 119, region: 'United Arab Emirates'},
        'Johannesburg': {x: 271, y: 191, region: 'South Africa'}
    };

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (window._phantomFlyInitializationLock) return;
    window._phantomFlyInitializationLock = true;

    class PhantomFly {
        constructor() {
            if (window.phantomFlyInstance) return window.phantomFlyInstance;
            
            this.config = { ...DEFAULT_CONFIG };
            this.container = null;
            this.contentDiv = null;
            this.memberListElement = null;
            this.mapContainer = null;
            this.airplaneMarkers = [];
            this.isMinimized = false;
            this.lastUpdate = 0;
            this.refreshTimer = null;
            this.eventListeners = new Map();
            this.windowSize = 500;
            this.loaded = false;
            this.pluginRegistered = false;
            this.mapPan = {x: 0, y: 0};
            this.mapImage = null;
            this.coreCheckInterval = null;
            this.initializationPromise = null;
            this.currentMembers = [];
            this.hasPhantomCore = false;
            this.themeUpdateHandler = null;
            this.themeUpdateInterval = null;
            this.markerCyclingInterval = null;
            this.activeMarkerIndex = -1;
            this.cyclingEnabled = false;
            this.flashingMarkers = new Map();
            
            window.phantomFlyInstance = this;
        }

        async initialize() {
            if (this.loaded) return;
            if (this.initializationPromise) return this.initializationPromise;
            this.initializationPromise = this._initializeInternal();
            return this.initializationPromise;
        }

        async _initializeInternal() {
            try {
                await this.loadConfiguration();
                const coreReady = await this.waitForPhantomCore();
                
                if (coreReady) {
                    this.registerPlugin();
                    this.setupThemeUpdates();
                    this.setupWindowSizeSync();
                }
                
                this.injectCSS();
                this.loaded = true;
                return true;
            } catch (error) {
                console.error(`${PLUGIN_INFO.name}: Initialization failed`, error);
                this.injectCSS();
                this.loaded = true;
                return false;
            } finally {
                this.initializationPromise = null;
            }
        }

        setupThemeUpdates() {
            if (!this.hasPhantomCore) return;
            this.themeUpdateHandler = () => {
                if (this.container) {
                    this.updateWindowTheme();
                    this.updateMapMarkersTheme();
                }
            };
            this.themeUpdateInterval = setInterval(() => {
                if (this.container) this.updateWindowTheme();
            }, 5000);
        }

        updateWindowTheme() {
            if (!this.container || !this.hasPhantomCore) return;
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            const bgColor = rootStyles.getPropertyValue('--phantom-bg-color') || 'rgba(0,0,0,0.7)';
            const frostBlur = rootStyles.getPropertyValue('--phantom-frost-blur') || '10px';
            
            this.container.style.backgroundColor = bgColor;
            this.container.style.borderColor = primaryColor;
            this.container.style.backdropFilter = `blur(${frostBlur})`;
            this.container.style.webkitBackdropFilter = `blur(${frostBlur})`;
            
            const header = this.container.querySelector('.phantom-fly-header');
            if (header) {
                header.style.backgroundColor = this.applyTransparency(primaryColor, 0.3);
                header.style.borderBottomColor = this.applyTransparency(primaryColor, 0.2);
            }
            
            const buttons = this.container.querySelectorAll('.phantom-fly-refresh-btn, .phantom-fly-minimize-btn, .phantom-fly-close-btn');
            buttons.forEach(btn => {
                if (btn.classList.contains('phantom-fly-refresh-btn')) {
                    btn.style.backgroundColor = this.applyTransparency(primaryColor, 0.1);
                    btn.style.borderColor = this.applyTransparency(primaryColor, 0.3);
                    btn.style.color = primaryColor;
                } else if (btn.classList.contains('phantom-fly-close-btn')) {
                    btn.style.backgroundColor = this.applyTransparency('#ff6464', 0.1);
                    btn.style.borderColor = this.applyTransparency('#ff6464', 0.3);
                    btn.style.color = '#ff6464';
                }
            });
            
            const title = this.container.querySelector('.phantom-fly-title');
            if (title) {
                title.style.color = primaryColor;
                const icon = title.querySelector('.phantom-fly-title-icon');
                if (icon) icon.style.filter = `drop-shadow(0 0 3px ${primaryColor})`;
            }
        }

        applyTransparency(color, alpha) {
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            if (color.startsWith('rgba')) {
                return color.replace(/[\d.]+\)$/g, `${alpha})`);
            }
            return color;
        }

        async waitForPhantomCore() {
            return new Promise((resolve) => {
                const maxWaitTime = 30000;
                const startTime = Date.now();
                
                const checkCore = () => {
                    const elapsed = Date.now() - startTime;
                    if (this.isPhantomCoreReady()) {
                        clearInterval(this.coreCheckInterval);
                        resolve(true);
                        return;
                    }
                    if (elapsed >= maxWaitTime) {
                        clearInterval(this.coreCheckInterval);
                        resolve(false);
                        return;
                    }
                };
                
                checkCore();
                this.coreCheckInterval = setInterval(checkCore, 500);
            });
        }

        async loadConfiguration() {
            try {
                if (window.PhantomCoreAPI?.getStorageAPI) {
                    const storage = window.PhantomCoreAPI.getStorageAPI();
                    const stored = await storage.get(`${PLUGIN_INFO.id}_config`);
                    if (stored) {
                        this.config = { ...DEFAULT_CONFIG, ...stored };
                        return;
                    }
                }
                if (typeof GM_getValue !== 'undefined') {
                    const stored = GM_getValue(`${PLUGIN_INFO.id}_config`);
                    if (stored) this.config = { ...DEFAULT_CONFIG, ...stored };
                    return;
                }
                const localConfig = localStorage.getItem(`${PLUGIN_INFO.id}_config`);
                if (localConfig) this.config = { ...DEFAULT_CONFIG, ...JSON.parse(localConfig) };
            } catch (error) {
                console.error(`${PLUGIN_INFO.name}: Failed to load configuration`, error);
            }
        }

        async saveConfiguration() {
            try {
                if (window.PhantomCoreAPI?.getStorageAPI) {
                    const storage = window.PhantomCoreAPI.getStorageAPI();
                    await storage.set(`${PLUGIN_INFO.id}_config`, this.config);
                    return true;
                }
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(`${PLUGIN_INFO.id}_config`, this.config);
                    return true;
                }
                localStorage.setItem(`${PLUGIN_INFO.id}_config`, JSON.stringify(this.config));
                return true;
            } catch (error) {
                console.error(`${PLUGIN_INFO.name}: Failed to save configuration`, error);
                return false;
            }
        }

        isPhantomCoreReady() {
            if (window.phantomCore?.isInitialized) {
                this.hasPhantomCore = true;
                return true;
            }
            if (window.PhantomCoreAPI?.registerPlugin) {
                this.hasPhantomCore = true;
                return true;
            }
            if (window.phantom_core_1_3_1_Beta?.initialized) {
                this.hasPhantomCore = true;
                return true;
            }
            return false;
        }

        registerPlugin() {
            if (this.pluginRegistered) return;
            const plugin = {
                ...PLUGIN_INFO,
                enabled: true,
                loaded: false,
                init: () => { plugin.loaded = true; },
                cleanup: () => {
                    this.cleanup();
                    plugin.loaded = false;
                },
                execute: () => {
                    if (window.PhantomCoreAPI?.isInLockdown && window.PhantomCoreAPI.isInLockdown()) {
                        if (window.PhantomCoreAPI.showToast) {
                            window.PhantomCoreAPI.showToast('🔒 Phantom Core is in lockdown mode', 'error');
                        }
                        return;
                    }
                    this.openWindow();
                }
            };

            const tryRegistration = () => {
                if (window.phantomCore?.registerPlugin) {
                    window.phantomCore.registerPlugin(plugin);
                    this.pluginRegistered = true;
                    return true;
                }
                if (window.PhantomCoreAPI?.registerPlugin) {
                    window.PhantomCoreAPI.registerPlugin(plugin);
                    this.pluginRegistered = true;
                    return true;
                }
                if (window.registerPhantomPlugin) {
                    window.registerPhantomPlugin(plugin);
                    this.pluginRegistered = true;
                    return true;
                }
                return false;
            };
            
            if (tryRegistration()) return;
            
            let retries = 0;
            const maxRetries = 5;
            const retryInterval = setInterval(() => {
                retries++;
                if (tryRegistration()) {
                    clearInterval(retryInterval);
                    return;
                }
                if (retries >= maxRetries) clearInterval(retryInterval);
            }, 1000);
        }

        setupWindowSizeSync() {
            if (!this.hasPhantomCore) return;
            this.syncWindowSize();
            setInterval(() => this.syncWindowSize(), 1000);
        }

        syncWindowSize() {
            const newSize = this.getCurrentWindowSize();
            if (newSize && newSize > 0 && newSize !== this.windowSize) {
                this.windowSize = newSize;
                this.updateWindowSize();
                return true;
            }
            return false;
        }

        getCurrentWindowSize() {
            if (isMobile) return Math.min(500, window.innerWidth * 0.95);
            if (window.PhantomCoreAPI?.getWindowSize) {
                const size = window.PhantomCoreAPI.getWindowSize();
                if (size && size > 0) return size;
            }
            if (window.phantomCore?.settings?.windowSize) return window.phantomCore.settings.windowSize;
            return 500;
        }

        updateWindowSize() {
            if (this.container) {
                this.container.style.width = `${this.windowSize}px`;
                this.updateMapConstraints();
            }
        }

        getAPIKey() {
            if (window.PhantomCoreAPI?.getGateKeeperStatus) {
                const status = window.PhantomCoreAPI.getGateKeeperStatus();
                if (status && status.verified) return '###PDA-APIKEY###';
            }
            if (window.phantomCore?.settings?.apiKey) {
                const coreKey = window.phantomCore.settings.apiKey;
                if (coreKey && coreKey.trim() && coreKey !== '###PDA-APIKEY###') return coreKey.trim();
            }
            return '###PDA-APIKEY###';
        }

        async getFactionMembersV2() {
            if (window.PhantomCoreAPI?.isInLockdown && window.PhantomCoreAPI.isInLockdown()) {
                throw new Error('Phantom Core is in lockdown mode');
            }
            const apiKey = this.getAPIKey();
            const url = `https://api.torn.com/v2/faction/members?striptags=true&key=${apiKey}&comment=PhantomFly`;
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error) {
                                    console.error(`${PLUGIN_INFO.name} API Error:`, data.error);
                                    reject(new Error(`API Error: ${data.error.code} - ${data.error.error}`));
                                    return;
                                }
                                if (!data.members) {
                                    reject(new Error('No member data received from API v2'));
                                    return;
                                }
                                resolve(data.members);
                            } catch (e) {
                                console.error(`${PLUGIN_INFO.name}: JSON parse error:`, e);
                                reject(new Error(`Invalid JSON response: ${e.message}`));
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: () => reject(new Error('Network error - check connection')),
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        }

        processMemberStatus(member) {
            const status = member.status || {};
            const statusState = status.state || '';
            const statusDescription = status.description || '';
            const statusColor = status.color || '';
            
            let travelStatus = '';
            let destination = '';
            
            const descLower = statusDescription.toLowerCase().trim();
            const stateLower = statusState.toLowerCase();
            
            // Enhanced hospital detection - specifically abroad hospital
            if ((stateLower === 'hospital' || descLower.includes('hospital')) && 
                !descLower.includes('hospital in torn') && 
                !descLower.includes('in torn hospital')) {
                
                if (descLower.includes('hospital in ') || descLower.includes('in hospital in ')) {
                    travelStatus = 'hospital';
                    if (descLower.includes('hospital in ')) {
                        destination = statusDescription.replace(/Hospital in /i, '').replace(/\.$/, '').trim();
                    } else if (descLower.includes('in hospital in ')) {
                        destination = statusDescription.replace(/in Hospital in /i, '').replace(/\.$/, '').trim();
                    }
                    return { status: travelStatus, destination, color: statusColor, description: statusDescription, isAbroadHospital: true };
                }
            }
            
            if (descLower.includes('returning to torn from ') || descLower.includes('returning to torn')) {
                travelStatus = 'returning';
                if (descLower.includes('returning to torn from ')) {
                    destination = statusDescription.replace(/Returning to Torn from /i, '').replace(/\.$/, '').trim();
                } else {
                    destination = 'Torn City';
                }
                return { status: travelStatus, destination, color: statusColor, description: statusDescription, isAbroadHospital: false };
            }
            
            if (stateLower === 'abroad' || descLower.includes('abroad') || 
                (descLower.includes('in ') && !descLower.includes('traveling') && !descLower.includes('flying'))) {
                if (!descLower.includes('hospital') && !descLower.includes('torn')) {
                    travelStatus = 'abroad';
                    if (descLower.includes('abroad in ')) {
                        destination = statusDescription.replace(/Abroad in /i, '').replace(/\.$/, '').trim();
                    } else if (descLower.includes('in ')) {
                        const match = statusDescription.match(/in ([^,.]+)/i);
                        destination = match && match[1] ? match[1].trim() : 'Unknown location';
                    } else {
                        destination = 'Unknown location';
                    }
                    return { status: travelStatus, destination, color: statusColor, description: statusDescription, isAbroadHospital: false };
                }
            }
            
            if (stateLower === 'traveling' || descLower.includes('traveling') || descLower.includes('flying')) {
                travelStatus = 'traveling';
                if (descLower.includes('traveling to ')) {
                    destination = statusDescription.replace(/Traveling to /i, '').replace(/\.$/, '').trim();
                } else if (descLower.includes('flying to ')) {
                    destination = statusDescription.replace(/Flying to /i, '').replace(/\.$/, '').trim();
                } else if (descLower.includes('to ')) {
                    const match = statusDescription.match(/to ([^,.]+)/i);
                    destination = match && match[1] ? match[1].trim() : 'Unknown destination';
                } else {
                    destination = 'Unknown destination';
                }
                return { status: travelStatus, destination, color: statusColor, description: statusDescription, isAbroadHospital: false };
            }
            
            return null;
        }

        getLocationCoordinates(locationName) {
            if (!locationName || locationName === 'Unknown destination' || locationName === 'Unknown location') return null;
            const cleanName = locationName.replace(/\.$/, '').trim().toLowerCase();
            
            const locationKeywords = {
                'torn': 'Torn City',
                'torn city': 'Torn City',
                'ciudad juárez': 'Ciudad Juárez',
                'ciudad juarez': 'Ciudad Juárez',
                'juarez': 'Ciudad Juárez',
                'george town': 'George Town',
                'georgetown': 'George Town',
                'cayman': 'George Town',
                'cayman islands': 'George Town',
                'toronto': 'Toronto',
                'canada': 'Toronto',
                'honolulu': 'Honolulu',
                'hawaii': 'Honolulu',
                'london': 'London',
                'united kingdom': 'London',
                'uk': 'London',
                'england': 'London',
                'buenos aires': 'Buenos Aires',
                'argentina': 'Buenos Aires',
                'zurich': 'Zurich',
                'switzerland': 'Zurich',
                'tokyo': 'Tokyo',
                'japan': 'Tokyo',
                'beijing': 'Beijing',
                'china': 'Beijing',
                'dubai': 'Dubai',
                'uae': 'Dubai',
                'united arab emirates': 'Dubai',
                'johannesburg': 'Johannesburg',
                'south africa': 'Johannesburg'
            };
            
            for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
                const keyLower = key.toLowerCase();
                if (cleanName === keyLower || cleanName.includes(keyLower) || keyLower.includes(cleanName)) {
                    return {
                        x: coords.x,
                        y: coords.y,
                        region: coords.region,
                        name: key
                    };
                }
            }
            
            for (const [keyword, actualName] of Object.entries(locationKeywords)) {
                if (cleanName.includes(keyword) || keyword.includes(cleanName)) {
                    const coords = LOCATION_COORDINATES[actualName];
                    if (coords) {
                        return {
                            x: coords.x,
                            y: coords.y,
                            region: coords.region,
                            name: actualName
                        };
                    }
                }
            }
            return null;
        }

        convertToMapPosition(x, y, containerWidth, containerHeight) {
            const scaleX = containerWidth / WORLD_MAP_WIDTH;
            const scaleY = containerHeight / WORLD_MAP_HEIGHT;
            const scale = Math.min(scaleX, scaleY);
            const offsetX = (containerWidth - WORLD_MAP_WIDTH * scale) / 2;
            const offsetY = (containerHeight - WORLD_MAP_HEIGHT * scale) / 2;
            return {
                x: offsetX + x * scale,
                y: offsetY + y * scale
            };
        }

        processFactionDataV2(members) {
            const results = [];
            const memberIds = Object.keys(members);
            
            memberIds.forEach(memberId => {
                const member = members[memberId];
                const statusInfo = this.processMemberStatus(member);
                
                if (statusInfo) {
                    const locationCoords = this.getLocationCoordinates(statusInfo.destination);
                    results.push({
                        id: memberId,
                        name: member.name || `Member ${memberId}`,
                        status: statusInfo.status,
                        destination: statusInfo.destination,
                        color: statusInfo.color,
                        description: statusInfo.description,
                        rank: member.position || member.rank || 'Member',
                        level: member.level || '?',
                        lastAction: member.last_action ? this.formatLastAction(member.last_action) : 'Unknown',
                        coordinates: locationCoords,
                        isAbroadHospital: statusInfo.isAbroadHospital || false
                    });
                }
            });
            this.currentMembers = results;
            return results;
        }

        formatLastAction(lastAction) {
            if (lastAction && lastAction.relative) return lastAction.relative;
            else if (lastAction && lastAction.timestamp) return this.formatTimeAgo(lastAction.timestamp);
            return 'Unknown';
        }

        formatTimeAgo(timestamp) {
            const now = Math.floor(Date.now() / 1000);
            const secondsAgo = now - timestamp;
            if (secondsAgo < 60) return 'Just now';
            if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
            if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
            return `${Math.floor(secondsAgo / 86400)}d ago`;
        }

        async refreshData() {
            if (window.PhantomCoreAPI?.isInLockdown && window.PhantomCoreAPI.isInLockdown()) {
                this.showError('Phantom Core is in lockdown mode');
                return;
            }
            if (!this.memberListElement) return;
            this.showLoading('Fetching faction data from Torn API v2...');
            
            try {
                const members = await this.getFactionMembersV2();
                const results = this.processFactionDataV2(members);
                this.lastUpdate = Date.now();
                this.config.lastUpdateTime = this.lastUpdate;
                await this.saveConfiguration();
                this.displayResults(results, Object.keys(members).length);
                this.updateWorldMap(results);
            } catch (error) {
                console.error(`${PLUGIN_INFO.name} Error:`, error);
                this.showError(error.message);
            }
        }

        updateMapConstraints() {
            if (!this.mapContainer || !this.mapImage) return;
            const containerRect = this.mapContainer.getBoundingClientRect();
            const mapRect = this.mapImage.getBoundingClientRect();
            const maxPanX = Math.max(0, (mapRect.width - containerRect.width) / 2);
            const maxPanY = Math.max(0, (mapRect.height - containerRect.height) / 2);
            let currentLeft = parseInt(this.mapImage.style.left) || 0;
            let currentTop = parseInt(this.mapImage.style.top) || 0;
            currentLeft = Math.max(-maxPanX, Math.min(maxPanX, currentLeft));
            currentTop = Math.max(-maxPanY, Math.min(maxPanY, currentTop));
            this.mapImage.style.left = `${currentLeft}px`;
            this.mapImage.style.top = `${currentTop}px`;
            this.mapPan = {x: currentLeft, y: currentTop};
            this.updateLocationMarkers();
            this.updateAirplaneMarkers();
        }

        createWorldMap() {
            const mapContainer = document.createElement('div');
            mapContainer.className = 'phantom-fly-map-container';
            mapContainer.style.cssText = `
                position: relative;
                width: 100%;
                height: 250px;
                background-color: rgba(10, 20, 40, 0.8);
                border-radius: 6px;
                margin-bottom: 12px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                touch-action: none;
                -webkit-tap-highlight-color: transparent;
                cursor: default;
            `;

            const mapImage = document.createElement('img');
            mapImage.src = WORLD_MAP_IMAGE;
            mapImage.className = 'phantom-fly-map-image';
            mapImage.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                opacity: 0.9;
                user-select: none;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                pointer-events: none;
            `;
            mapImage.onerror = () => {
                mapImage.style.background = 'linear-gradient(135deg, rgba(0, 20, 40, 0.5), rgba(0, 40, 80, 0.5))';
                mapImage.src = '';
            };

            this.mapImage = mapImage;

            const locationMarkers = document.createElement('div');
            locationMarkers.className = 'phantom-fly-location-markers';
            locationMarkers.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            `;

            const airplaneMarkers = document.createElement('div');
            airplaneMarkers.className = 'phantom-fly-airplane-markers';
            airplaneMarkers.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
            `;
            
            mapContainer.appendChild(mapImage);
            mapContainer.appendChild(locationMarkers);
            mapContainer.appendChild(airplaneMarkers);

            this.mapContainer = mapContainer;
            this.airplaneMarkersContainer = airplaneMarkers;
            this.locationMarkersContainer = locationMarkers;
            
            setTimeout(() => this.updateLocationMarkers(), 100);
            return mapContainer;
        }

        updateLocationMarkers() {
            if (!this.locationMarkersContainer || !this.mapContainer || !this.mapImage) return;
            this.locationMarkersContainer.innerHTML = '';
            const containerRect = this.mapContainer.getBoundingClientRect();
            const offsetX = parseInt(this.mapImage.style.left) || 0;
            const offsetY = parseInt(this.mapImage.style.top) || 0;
            
            Object.entries(LOCATION_COORDINATES).forEach(([location, coords]) => {
                const marker = document.createElement('div');
                marker.className = 'phantom-fly-location-marker';
                marker.title = `${location} (${coords.region})`;
                const pos = this.convertToMapPosition(coords.x, coords.y, containerRect.width, containerRect.height);
                marker.style.cssText = `
                    position: absolute;
                    left: ${pos.x + offsetX}px;
                    top: ${pos.y + offsetY}px;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, rgba(255, 255, 100, 0.9) 0%, rgba(255, 200, 50, 0.7) 70%, transparent 100%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 0 6px rgba(255, 255, 100, 0.8);
                    pointer-events: none;
                    z-index: 1;
                `;
                this.locationMarkersContainer.appendChild(marker);
            });
        }

        updateAirplaneMarkers() {
            if (!this.airplaneMarkersContainer || !this.mapContainer || !this.airplaneMarkers.length) return;
            const containerRect = this.mapContainer.getBoundingClientRect();
            const offsetX = parseInt(this.mapImage.style.left) || 0;
            const offsetY = parseInt(this.mapImage.style.top) || 0;
            
            this.airplaneMarkers.forEach((airplane) => {
                const member = airplane.dataset.member;
                if (!member) return;
                try {
                    const memberData = JSON.parse(member);
                    if (memberData.coordinates) {
                        const pos = this.convertToMapPosition(
                            memberData.coordinates.x,
                            memberData.coordinates.y,
                            containerRect.width,
                            containerRect.height
                        );
                        airplane.style.left = `${pos.x + offsetX}px`;
                        airplane.style.top = `${pos.y + offsetY}px`;
                    }
                } catch (e) {
                    console.error('Failed to update airplane marker:', e);
                }
            });
        }

        updateMapMarkersTheme() {
            if (!this.airplaneMarkersContainer || !this.hasPhantomCore) return;
            const rootStyles = getComputedStyle(document.documentElement);
            const themeColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            const hospitalColor = '#ff4444';
            const abroadColor = '#00cc66';
            const returningColor = '#ffa500';
            
            this.airplaneMarkers.forEach((airplane) => {
                const member = airplane.dataset.member;
                if (!member) return;
                try {
                    const memberData = JSON.parse(member);
                    let markerColor = themeColor;
                    let textColor = 'black';
                    
                    switch(memberData.status) {
                        case 'hospital':
                            markerColor = hospitalColor;
                            textColor = 'white';
                            break;
                        case 'abroad':
                            markerColor = abroadColor;
                            textColor = 'white';
                            break;
                        case 'returning':
                            markerColor = returningColor;
                            textColor = 'white';
                            break;
                        case 'traveling':
                            markerColor = themeColor;
                            textColor = 'black';
                            break;
                    }
                    airplane.style.background = markerColor;
                    airplane.style.boxShadow = `0 0 8px ${markerColor}`;
                    airplane.style.borderColor = textColor === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
                } catch (e) {
                    console.error('Failed to update airplane marker theme:', e);
                }
            });
        }

        startMarkerCycling() {
            this.stopMarkerCycling();
            if (!this.airplaneMarkers.length) return;
            
            this.cyclingEnabled = true;
            let currentMarkerIndex = 0;
            
            this.markerCyclingInterval = setInterval(() => {
                if (!this.cyclingEnabled || !this.airplaneMarkers.length) {
                    this.stopMarkerCycling();
                    return;
                }
                
                // Remove highlight from all markers
                this.airplaneMarkers.forEach(marker => {
                    marker.style.transform = 'translate(-50%, -50%) scale(1)';
                    marker.style.zIndex = '2';
                });
                
                // Highlight current marker
                if (this.airplaneMarkers[currentMarkerIndex]) {
                    this.airplaneMarkers[currentMarkerIndex].style.transform = 'translate(-50%, -50%) scale(1.2)';
                    this.airplaneMarkers[currentMarkerIndex].style.zIndex = '3';
                    this.activeMarkerIndex = currentMarkerIndex;
                }
                
                // Move to next marker
                currentMarkerIndex = (currentMarkerIndex + 1) % this.airplaneMarkers.length;
            }, 3000);
        }

        stopMarkerCycling() {
            this.cyclingEnabled = false;
            if (this.markerCyclingInterval) {
                clearInterval(this.markerCyclingInterval);
                this.markerCyclingInterval = null;
            }
            // Reset all markers
            this.airplaneMarkers.forEach(marker => {
                marker.style.transform = 'translate(-50%, -50%) scale(1)';
                marker.style.zIndex = '2';
            });
            this.activeMarkerIndex = -1;
        }

        startFlashingMarkers() {
            this.flashingMarkers.forEach((intervalId, marker) => {
                if (intervalId) clearInterval(intervalId);
            });
            this.flashingMarkers.clear();
            
            // Find all abroad hospital members
            const abroadHospitalMembers = this.currentMembers.filter(member => 
                member.status === 'hospital' && member.isAbroadHospital
            );
            
            abroadHospitalMembers.forEach(member => {
                const marker = this.airplaneMarkers.find(m => {
                    try {
                        const markerData = JSON.parse(m.dataset.member);
                        return markerData.id === member.id;
                    } catch (e) {
                        return false;
                    }
                });
                
                if (marker) {
                    let isFlashing = true;
                    const flashInterval = setInterval(() => {
                        if (isFlashing) {
                            marker.style.boxShadow = '0 0 12px #ff0000';
                            marker.style.background = '#ff0000';
                        } else {
                            marker.style.boxShadow = '0 0 6px #ff4444';
                            marker.style.background = '#ff4444';
                        }
                        isFlashing = !isFlashing;
                    }, 500);
                    
                    this.flashingMarkers.set(marker, flashInterval);
                }
            });
        }

        stopFlashingMarkers() {
            this.flashingMarkers.forEach((intervalId, marker) => {
                if (intervalId) clearInterval(intervalId);
                // Reset to normal hospital color
                marker.style.boxShadow = '0 0 6px #ff4444';
                marker.style.background = '#ff4444';
            });
            this.flashingMarkers.clear();
        }

        updateWorldMap(results) {
            if (!this.airplaneMarkersContainer || !this.mapContainer || !this.mapImage) return;
            
            this.airplaneMarkersContainer.innerHTML = '';
            this.airplaneMarkers = [];
            this.stopMarkerCycling();
            this.stopFlashingMarkers();
            
            if (!results || results.length === 0) return;
            
            const containerRect = this.mapContainer.getBoundingClientRect();
            const offsetX = parseInt(this.mapImage.style.left) || 0;
            const offsetY = parseInt(this.mapImage.style.top) || 0;
            
            const rootStyles = getComputedStyle(document.documentElement);
            const themeColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            const hospitalColor = '#ff4444';
            const abroadColor = '#00cc66';
            const returningColor = '#ffa500';
            
            // Group members by coordinates to handle stacking
            const groupedMembers = new Map();
            results.forEach((member, index) => {
                if (!member.coordinates) return;
                const key = `${member.coordinates.x},${member.coordinates.y}`;
                if (!groupedMembers.has(key)) groupedMembers.set(key, []);
                groupedMembers.get(key).push({...member, originalIndex: index});
            });
            
            let markerIndex = 0;
            groupedMembers.forEach((members, key) => {
                const firstMember = members[0];
                const pos = this.convertToMapPosition(
                    firstMember.coordinates.x,
                    firstMember.coordinates.y,
                    containerRect.width,
                    containerRect.height
                );
                
                const airplane = document.createElement('div');
                airplane.className = 'phantom-fly-airplane-marker';
                airplane.dataset.markerIndex = markerIndex;
                airplane.dataset.memberGroup = JSON.stringify(members);
                airplane.dataset.currentMemberIndex = 0;
                airplane.title = `${members.length} member${members.length > 1 ? 's' : ''} at this location`;
                
                let markerColor = themeColor;
                let textColor = 'black';
                let isHospitalAbroad = false;
                
                // Check if any member in this group is abroad hospital
                members.forEach(member => {
                    if (member.status === 'hospital' && member.isAbroadHospital) {
                        isHospitalAbroad = true;
                    }
                });
                
                if (isHospitalAbroad) {
                    markerColor = hospitalColor;
                    textColor = 'white';
                } else {
                    switch(firstMember.status) {
                        case 'hospital':
                            markerColor = hospitalColor;
                            textColor = 'white';
                            break;
                        case 'abroad':
                            markerColor = abroadColor;
                            textColor = 'white';
                            break;
                        case 'returning':
                            markerColor = returningColor;
                            textColor = 'white';
                            break;
                        case 'traveling':
                            markerColor = themeColor;
                            textColor = 'black';
                            break;
                    }
                }
                
                airplane.style.cssText = `
                    position: absolute;
                    left: ${pos.x + offsetX}px;
                    top: ${pos.y + offsetY}px;
                    width: ${members.length > 1 ? '22px' : '20px'};
                    height: ${members.length > 1 ? '22px' : '20px'};
                    background: ${markerColor};
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${members.length > 1 ? '10px' : '9px'};
                    font-weight: bold;
                    color: ${textColor};
                    box-shadow: 0 0 8px ${markerColor};
                    pointer-events: auto;
                    cursor: pointer;
                    z-index: 2;
                    border: 2px solid ${textColor === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
                    transition: transform 0.2s ease;
                `;
                
                const number = document.createElement('div');
                if (members.length > 1) {
                    number.textContent = members.length.toString();
                    number.title = `Click to cycle through ${members.length} members`;
                } else {
                    number.textContent = (firstMember.originalIndex + 1).toString();
                }
                number.style.cssText = `
                    font-size: ${members.length > 1 ? '9px' : '8px'};
                    text-shadow: 0 0 2px rgba(255, 255, 255, 0.9);
                    font-weight: bold;
                `;
                
                airplane.appendChild(number);
                
                // Add click handler for cycling through stacked members
                if (members.length > 1) {
                    const clickHandler = (e) => {
                        e.stopPropagation();
                        const currentIndex = parseInt(airplane.dataset.currentMemberIndex || 0);
                        const nextIndex = (currentIndex + 1) % members.length;
                        airplane.dataset.currentMemberIndex = nextIndex;
                        const member = members[nextIndex];
                        airplane.title = `${member.name}: ${member.description}`;
                        number.textContent = (member.originalIndex + 1).toString();
                        
                        // Update colors based on new member status
                        let newMarkerColor = themeColor;
                        let newTextColor = 'black';
                        if (member.status === 'hospital' && member.isAbroadHospital) {
                            newMarkerColor = hospitalColor;
                            newTextColor = 'white';
                        } else {
                            switch(member.status) {
                                case 'hospital':
                                    newMarkerColor = hospitalColor;
                                    newTextColor = 'white';
                                    break;
                                case 'abroad':
                                    newMarkerColor = abroadColor;
                                    newTextColor = 'white';
                                    break;
                                case 'returning':
                                    newMarkerColor = returningColor;
                                    newTextColor = 'white';
                                    break;
                                case 'traveling':
                                    newMarkerColor = themeColor;
                                    newTextColor = 'black';
                                    break;
                            }
                        }
                        airplane.style.background = newMarkerColor;
                        airplane.style.boxShadow = `0 0 8px ${newMarkerColor}`;
                        airplane.style.borderColor = newTextColor === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
                        airplane.style.color = newTextColor;
                        
                        // Scroll to member in list
                        const memberElement = document.querySelector(`[data-member-id="${member.id}"]`);
                        if (memberElement) {
                            memberElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            memberElement.style.background = this.applyTransparency(newMarkerColor, 0.2);
                            setTimeout(() => {
                                memberElement.style.background = '';
                            }, 2000);
                        }
                    };
                    
                    airplane.addEventListener('click', clickHandler);
                    airplane.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        clickHandler(e);
                    });
                }
                
                this.airplaneMarkersContainer.appendChild(airplane);
                this.airplaneMarkers.push(airplane);
                markerIndex++;
            });
            
            // Start marker cycling
            if (this.airplaneMarkers.length > 1) {
                this.startMarkerCycling();
            }
            
            // Start flashing for abroad hospital members
            this.startFlashingMarkers();
        }

        showLoading(message) {
            if (!this.memberListElement) return;
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            this.memberListElement.innerHTML = `
                <div style="text-align: center; padding: 16px;">
                    <div style="font-size: 15px; color: ${primaryColor}; margin-bottom: 8px;">${PLUGIN_INFO.name} v${PLUGIN_INFO.version}</div>
                    <div style="color: #aaa; margin-bottom: 12px; font-size: 13px;">${message}</div>
                    <div style="width: 28px; height: 28px; margin: 0 auto; border: 2px solid ${this.applyTransparency(primaryColor, 0.3)}; border-top: 2px solid ${primaryColor}; border-radius: 50%; animation: phantom-fly-spin 1s linear infinite;"></div>
                </div>
            `;
        }

        showError(message) {
            if (!this.memberListElement) return;
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            
            let errorDetails = '';
            let retryButton = '';
            
            if (message.includes('API Key') || message.includes('Invalid Key') || message.includes('Access Denied')) {
                errorDetails = `
                    <div style="margin-top: 8px; padding: 8px; background: rgba(255,100,100,0.1); border-radius: 4px; font-size: 12px;">
                        <strong>API Key Setup Required:</strong>
                        <ol style="margin: 4px 0; padding-left: 16px;">
                            <li>Open Phantom Core launcher</li>
                            <li>Click "Config" (settings icon)</li>
                            <li>Enter your Torn API key in the API Key field</li>
                            <li>Click "Save Settings"</li>
                        </ol>
                        <small>API key must have faction access permissions</small>
                    </div>
                `;
                retryButton = `<button style="margin-top: 8px; padding: 12px 16px; background: ${this.applyTransparency(primaryColor, 0.2)}; border: 1px solid ${this.applyTransparency(primaryColor, 0.3)}; border-radius: 6px; color: ${primaryColor}; cursor: pointer; font-size: 13px; width: 100%; -webkit-tap-highlight-color: transparent;" id="retry-btn">Retry</button>`;
            } else if (message.includes('faction') || message.includes('permission')) {
                errorDetails = `<div style="margin-top: 8px; padding: 8px; background: rgba(255,165,0,0.1); border-radius: 4px; font-size: 12px;"><small>Ensure your API key has faction access permissions</small></div>`;
                retryButton = `<button style="margin-top: 8px; padding: 12px 16px; background: ${this.applyTransparency(primaryColor, 0.2)}; border: 1px solid ${this.applyTransparency(primaryColor, 0.3)}; border-radius: 6px; color: ${primaryColor}; cursor: pointer; font-size: 13px; width: 100%; -webkit-tap-highlight-color: transparent;" id="retry-btn">Retry</button>`;
            } else if (message.includes('JSON')) {
                errorDetails = `<div style="margin-top: 8px; padding: 8px; background: rgba(255,165,0,0.1); border-radius: 4px; font-size: 12px;"><small>Invalid API response. Please try again or check API key.</small></div>`;
                retryButton = `<button style="margin-top: 8px; padding: 12px 16px; background: ${this.applyTransparency(primaryColor, 0.2)}; border: 1px solid ${this.applyTransparency(primaryColor, 0.3)}; border-radius: 6px; color: ${primaryColor}; cursor: pointer; font-size: 13px; width: 100%; -webkit-tap-highlight-color: transparent;" id="retry-btn">Retry</button>`;
            } else if (message.includes('lockdown')) {
                errorDetails = `<div style="margin-top: 8px; padding: 8px; background: rgba(255,0,0,0.1); border-radius: 4px; font-size: 12px;"><small>Phantom Core is in lockdown mode. Please verify your user.</small></div>`;
                retryButton = '';
            } else {
                retryButton = `<button style="margin-top: 8px; padding: 12px 16px; background: ${this.applyTransparency(primaryColor, 0.2)}; border: 1px solid ${this.applyTransparency(primaryColor, 0.3)}; border-radius: 6px; color: ${primaryColor}; cursor: pointer; font-size: 13px; width: 100%; -webkit-tap-highlight-color: transparent;" id="retry-btn">Retry</button>`;
            }
            
            this.memberListElement.innerHTML = `
                <div style="color: #ff6b6b; padding: 12px; font-size: 13px;">
                    <strong>Error:</strong> ${message}<br>
                    ${errorDetails}
                    ${retryButton}
                </div>
            `;
            
            const retryBtn = document.getElementById('retry-btn');
            if (retryBtn) {
                const handler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refreshData();
                };
                retryBtn.addEventListener('click', handler);
                retryBtn.addEventListener('touchstart', handler);
                this.eventListeners.set(retryBtn, { type: 'click', handler });
            }
        }

        displayResults(results, totalMembers) {
            if (!this.memberListElement) return;
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            
            if (results.length === 0) {
                this.memberListElement.innerHTML = `
                    <div style="text-align: center; padding: 16px; color: #aaa; font-size: 13px;">
                        <div style="color: ${primaryColor}; margin-bottom: 8px;">✅ All Clear!</div>
                        No faction members are traveling or abroad
                        <br><small>${totalMembers} members checked</small>
                        <br><small>Last updated: ${new Date().toLocaleTimeString()}</small>
                        <br><small>Using Torn API v2</small>
                        <br><small>World Map: v${PLUGIN_INFO.version} Phantom Core Integrated</small>
                    </div>
                `;
                return;
            }
            
            let html = `
                <div style="margin-bottom: 12px; font-size: 11px; color: #aaa;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; flex-wrap: wrap;">
                        <span><strong>${results.length}</strong> traveling/abroad of <strong>${totalMembers}</strong> members</span>
                        <span>${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div style="text-align: center; color: #888; font-size: 10px; margin-top: 4px;">
                        <span style="color: #ffff64;">●</span> Cities
                        <span style="margin-left: 8px; color: ${primaryColor};">●</span> Traveling
                        <span style="margin-left: 8px; color: #00cc66;">●</span> Abroad
                        <span style="margin-left: 8px; color: #ff4444;">●</span> Hospital
                        <span style="margin-left: 8px; color: #ffa500;">●</span> Returning
                        <span style="margin-left: 8px; color: #ff0000; animation: phantom-fly-flash 1s infinite;">●</span> Abroad Hospital
                    </div>
                    <div style="text-align: center; color: #888; font-size: 9px; margin-top: 2px;">
                        ${this.airplaneMarkers.length > 1 ? 'Markers auto-cycle • ' : ''}Tap stacked markers to cycle • Numbers match list
                    </div>
                </div>
            `;
            
            results.sort((a, b) => {
                const statusOrder = { 'traveling': 1, 'abroad': 2, 'hospital': 3, 'returning': 4 };
                const orderA = statusOrder[a.status] || 5;
                const orderB = statusOrder[b.status] || 5;
                if (orderA !== orderB) return orderA - orderB;
                return a.name.localeCompare(b.name);
            });
            
            results.forEach((member, index) => {
                let icon = '';
                let statusColor = primaryColor;
                let statusText = member.description || `${member.status} to ${member.destination}`;
                
                switch(member.status) {
                    case 'traveling':
                        icon = '✈️';
                        statusColor = primaryColor;
                        break;
                    case 'abroad':
                        icon = '🌍';
                        statusColor = '#00cc66';
                        break;
                    case 'hospital':
                        icon = '🏥';
                        if (member.isAbroadHospital) {
                            statusColor = '#ff0000';
                            statusText += ' (ABROAD)';
                        } else {
                            statusColor = '#ff4444';
                        }
                        break;
                    case 'returning':
                        icon = '↩️';
                        statusColor = '#ffa500';
                        break;
                    default:
                        icon = '❓';
                }
                
                const locationName = member.coordinates?.name || member.destination;
                const region = member.coordinates?.region || (member.destination || 'Unknown');
                
                html += `
                    <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px; border-left: 3px solid ${statusColor};" data-member-id="${member.id}">
                        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 18px; line-height: 1; flex-shrink: 0;">${icon}</span>
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <span style="display: inline-block; width: 22px; height: 22px; background: ${statusColor}; border-radius: 50%; color: white; font-size: 10px; font-weight: bold; text-align: center; line-height: 22px;">${index + 1}</span>
                                        <strong style="color: ${statusColor}; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${member.name}</strong>
                                    </div>
                                    <div style="font-size: 10px; color: #aaa; background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 3px; white-space: nowrap;">
                                        ${member.rank}
                                    </div>
                                </div>
                                <div style="font-size: 11px; color: #ccc; margin-top: 3px;">${statusText}</div>
                                <div style="display: flex; gap: 8px; margin-top: 5px; font-size: 9px; color: #888; flex-wrap: wrap;">
                                    <span>Level ${member.level}</span>
                                    <span>•</span>
                                    <span>${member.lastAction}</span>
                                    <span>•</span>
                                    <span title="${locationName}">${region}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                <div style="margin-top: 12px; text-align: center;">
                    <button style="padding: 14px 20px; background: ${this.applyTransparency(primaryColor, 0.2)}; border: 1px solid ${this.applyTransparency(primaryColor, 0.3)}; border-radius: 6px; color: ${primaryColor}; cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; width: 100%; justify-content: center; -webkit-tap-highlight-color: transparent;" id="manual-refresh-btn">
                        <span>🔄</span> Refresh Now
                    </button>
                </div>
            `;
            
            this.memberListElement.innerHTML = html;
            
            const refreshBtn = document.getElementById('manual-refresh-btn');
            if (refreshBtn) {
                const handler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refreshData();
                };
                refreshBtn.addEventListener('click', handler);
                refreshBtn.addEventListener('touchstart', handler);
                this.eventListeners.set(refreshBtn, { type: 'click', handler });
            }
        }

        openWindow() {
            if (window.PhantomCoreAPI?.isInLockdown && window.PhantomCoreAPI.isInLockdown()) {
                if (window.PhantomCoreAPI.showToast) {
                    window.PhantomCoreAPI.showToast('🔒 Phantom Core is in lockdown mode', 'error');
                }
                return;
            }
            
            this.closeWindow();
            this.syncWindowSize();
            
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--phantom-primary-color') || '#00ff00';
            const bgColor = rootStyles.getPropertyValue('--phantom-bg-color') || 'rgba(0,0,0,0.7)';
            const frostBlur = rootStyles.getPropertyValue('--phantom-frost-blur') || '10px';
            
            this.container = document.createElement('div');
            this.container.id = 'phantom-fly-container';
            this.container.className = 'phantom-fly-window';
            
            this.container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: ${bgColor};
                color: #f0f0f0;
                border: 1px solid ${primaryColor};
                border-radius: 10px;
                z-index: 10050;
                max-width: 95vw;
                width: ${this.windowSize}px;
                max-height: 85vh;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                overflow: hidden;
                transition: all 0.3s ease;
                display: block;
                -webkit-tap-highlight-color: transparent;
                backdrop-filter: blur(${frostBlur});
                -webkit-backdrop-filter: blur(${frostBlur});
            `;
            
            const header = document.createElement('div');
            header.className = 'phantom-fly-header';
            
            header.style.cssText = `
                padding: 12px 14px;
                background: ${this.applyTransparency(primaryColor, 0.3)};
                border-bottom: 1px solid ${this.applyTransparency(primaryColor, 0.2)};
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
                touch-action: none;
                -webkit-tap-highlight-color: transparent;
            `;
            
            const title = document.createElement('div');
            title.className = 'phantom-fly-title';
            title.style.cssText = `
                font-size: 15px;
                color: ${primaryColor};
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 6px;
            `;
            title.innerHTML = `
                <img src="${PLUGIN_INFO.icon}" class="phantom-fly-title-icon" style="width: 18px; height: 18px; object-fit: contain;">
                <span>${PLUGIN_INFO.name} <small style="color: #888; font-weight: normal;">v${PLUGIN_INFO.version}</small></span>
            `;
            
            const controls = document.createElement('div');
            controls.style.cssText = `
                display: flex;
                gap: 4px;
            `;
            
            const refreshBtn = document.createElement('button');
            refreshBtn.innerHTML = '🔄';
            refreshBtn.title = 'Refresh data';
            refreshBtn.className = 'phantom-fly-refresh-btn';
            refreshBtn.style.cssText = `
                background: ${this.applyTransparency(primaryColor, 0.1)};
                border: 1px solid ${this.applyTransparency(primaryColor, 0.3)};
                color: ${primaryColor};
                font-size: 16px;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                min-width: 44px;
                min-height: 44px;
                -webkit-tap-highlight-color: transparent;
            `;
            
            const minimizeBtn = document.createElement('button');
            minimizeBtn.innerHTML = '−';
            minimizeBtn.title = 'Minimize';
            minimizeBtn.className = 'phantom-fly-minimize-btn';
            minimizeBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #f0f0f0;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                border-radius: 6px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                min-width: 44px;
                min-height: 44px;
                -webkit-tap-highlight-color: transparent;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.title = 'Close';
            closeBtn.className = 'phantom-fly-close-btn';
            closeBtn.style.cssText = `
                background: ${this.applyTransparency('#ff6464', 0.1)};
                border: 1px solid ${this.applyTransparency('#ff6464', 0.3)};
                color: #ff6464;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                border-radius: 6px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                min-width: 44px;
                min-height: 44px;
                -webkit-tap-highlight-color: transparent;
            `;
            
            controls.appendChild(refreshBtn);
            controls.appendChild(minimizeBtn);
            controls.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(controls);
            
            this.contentDiv = document.createElement('div');
            this.contentDiv.className = 'phantom-fly-content';
            this.contentDiv.style.cssText = `
                padding: 14px;
                max-height: 70vh;
                overflow-y: auto;
                font-size: 13px;
                line-height: 1.4;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
            `;
            
            const worldMap = this.createWorldMap();
            this.contentDiv.appendChild(worldMap);
            
            this.memberListElement = document.createElement('div');
            this.memberListElement.id = 'phantom-fly-member-list';
            this.contentDiv.appendChild(this.memberListElement);
            
            this.container.appendChild(header);
            this.container.appendChild(this.contentDiv);
            
            document.body.appendChild(this.container);
            
            this.setupDrag(header);
            
            const refreshHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.refreshData();
            };

            const minimizeHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMinimize();
            };

            const closeHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeWindow();
            };

            refreshBtn.addEventListener('click', refreshHandler);
            refreshBtn.addEventListener('touchstart', refreshHandler);
            minimizeBtn.addEventListener('click', minimizeHandler);
            minimizeBtn.addEventListener('touchstart', minimizeHandler);
            closeBtn.addEventListener('click', closeHandler);
            closeBtn.addEventListener('touchstart', closeHandler);

            this.eventListeners.set('header-buttons', [
                { element: refreshBtn, type: 'click', handler: refreshHandler },
                { element: refreshBtn, type: 'touchstart', handler: refreshHandler },
                { element: minimizeBtn, type: 'click', handler: minimizeHandler },
                { element: minimizeBtn, type: 'touchstart', handler: minimizeHandler },
                { element: closeBtn, type: 'click', handler: closeHandler },
                { element: closeBtn, type: 'touchstart', handler: closeHandler }
            ]);
            
            this.refreshData();
            this.setupAutoRefresh();
        }

        setupDrag(header) {
            let isDragging = false;
            let dragStartX = 0;
            let dragStartY = 0;
            let initialLeft = 0;
            let initialTop = 0;
            
            const startDrag = (e) => {
                const inLockdown = window.PhantomCoreAPI?.isInLockdown && window.PhantomCoreAPI.isInLockdown();
                if (inLockdown) {
                    e.preventDefault();
                    return;
                }
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                dragStartX = e.clientX || e.touches[0].clientX;
                dragStartY = e.clientY || e.touches[0].clientY;
                initialLeft = rect.left;
                initialTop = rect.top;
                e.preventDefault();
            };
            
            const doDrag = (e) => {
                if (!isDragging) return;
                const currentX = e.clientX || e.touches[0].clientX;
                const currentY = e.clientY || e.touches[0].clientY;
                const deltaX = currentX - dragStartX;
                const deltaY = currentY - dragStartY;
                const newLeft = Math.max(10, Math.min(initialLeft + deltaX, window.innerWidth - this.container.offsetWidth - 10));
                const newTop = Math.max(10, Math.min(initialTop + deltaY, window.innerHeight - this.container.offsetHeight - 10));
                this.container.style.left = `${newLeft}px`;
                this.container.style.top = `${newTop}px`;
                this.container.style.right = 'auto';
                this.container.style.bottom = 'auto';
                this.container.style.transform = 'none';
                e.preventDefault();
            };
            
            const stopDrag = () => {
                isDragging = false;
            };
            
            const startListener = (e) => startDrag(e);
            const moveListener = (e) => doDrag(e);
            const endListener = () => stopDrag();
            
            header.addEventListener('mousedown', startListener);
            document.addEventListener('mousemove', moveListener);
            document.addEventListener('mouseup', endListener);
            
            header.addEventListener('touchstart', startListener, { passive: false });
            document.addEventListener('touchmove', moveListener, { passive: false });
            document.addEventListener('touchend', endListener);
            
            this.eventListeners.set('drag', [
                { element: header, type: 'mousedown', handler: startListener },
                { element: document, type: 'mousemove', handler: moveListener },
                { element: document, type: 'mouseup', handler: endListener },
                { element: header, type: 'touchstart', handler: startListener },
                { element: document, type: 'touchmove', handler: moveListener },
                { element: document, type: 'touchend', handler: endListener }
            ]);
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.contentDiv.style.display = this.isMinimized ? 'none' : 'block';
            this.container.style.height = this.isMinimized ? 'auto' : '';
        }

        closeWindow() {
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
            
            this.stopMarkerCycling();
            this.stopFlashingMarkers();
            
            this.eventListeners.forEach((listeners, key) => {
                if (Array.isArray(listeners)) {
                    listeners.forEach(({ element, type, handler }) => {
                        if (element && element.removeEventListener) {
                            element.removeEventListener(type, handler);
                        }
                    });
                }
            });
            
            this.eventListeners.clear();
            
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            
            this.container = null;
            this.contentDiv = null;
            this.memberListElement = null;
            this.mapContainer = null;
            this.mapImage = null;
            this.airplaneMarkersContainer = null;
            this.locationMarkersContainer = null;
            this.airplaneMarkers = [];
        }

        setupAutoRefresh() {
            if (this.refreshTimer) clearInterval(this.refreshTimer);
            this.refreshTimer = setInterval(() => {
                if (!this.isMinimized && document.visibilityState === 'visible') {
                    this.refreshData();
                }
            }, this.config.refreshInterval);
        }

        injectCSS() {
            if (document.getElementById('phantom-fly-styles')) return;
            
            const css = `
                @keyframes phantom-fly-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes phantom-fly-flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                
                .phantom-fly-window {
                    z-index: 10050;
                    transition: width 0.3s ease, height 0.3s ease, transform 0.2s ease;
                }
                
                .phantom-fly-refresh-btn,
                .phantom-fly-minimize-btn,
                .phantom-fly-close-btn {
                    -webkit-tap-highlight-color: transparent !important;
                    user-select: none !important;
                }
                
                .phantom-fly-refresh-btn:active,
                .phantom-fly-minimize-btn:active,
                .phantom-fly-close-btn:active {
                    transform: scale(0.95) !important;
                    transition: transform 0.1s ease !important;
                }
                
                .phantom-fly-refresh-btn:hover,
                .phantom-fly-refresh-btn:active {
                    background: rgba(79, 195, 247, 0.2) !important;
                    box-shadow: 0 2px 6px rgba(79, 195, 247, 0.2) !important;
                }
                
                .phantom-fly-minimize-btn:hover,
                .phantom-fly-minimize-btn:active {
                    background: rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1) !important;
                }
                
                .phantom-fly-close-btn:hover,
                .phantom-fly-close-btn:active {
                    background: rgba(255, 100, 100, 0.2) !important;
                    box-shadow: 0 2px 6px rgba(255, 100, 100, 0.2) !important;
                }
                
                .phantom-fly-content::-webkit-scrollbar {
                    width: 4px;
                }
                
                .phantom-fly-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }
                
                .phantom-fly-content::-webkit-scrollbar-thumb {
                    background: var(--phantom-primary-color, rgba(0, 255, 0, 0.3));
                    border-radius: 2px;
                }
                
                .phantom-fly-content::-webkit-scrollbar-thumb:hover {
                    background: var(--phantom-primary-color, rgba(0, 255, 0, 0.5));
                }
                
                .phantom-fly-map-container {
                    cursor: default;
                    touch-action: none;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .phantom-fly-title-icon {
                    filter: drop-shadow(0 0 2px var(--phantom-primary-color, #00ff00));
                }
                
                /* Mobile-only styles */
                .phantom-fly-window {
                    width: 95vw !important;
                    max-width: 95vw !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    bottom: auto !important;
                    right: auto !important;
                    max-height: 85vh !important;
                }
                
                .phantom-fly-header {
                    padding: 10px !important;
                }
                
                .phantom-fly-content {
                    padding: 10px !important;
                    max-height: 70vh !important;
                }
                
                .phantom-fly-map-container {
                    height: 200px !important;
                }
                
                .phantom-fly-refresh-btn,
                .phantom-fly-minimize-btn,
                .phantom-fly-close-btn {
                    width: 40px !important;
                    height: 40px !important;
                    min-width: 40px !important;
                    min-height: 40px !important;
                }
                
                .phantom-fly-airplane-marker {
                    width: 20px !important;
                    height: 20px !important;
                }
                
                .phantom-fly-location-marker {
                    width: 8px !important;
                    height: 8px !important;
                }
                
                @media (max-width: 480px) {
                    .phantom-fly-window {
                        width: 98vw !important;
                        max-width: 98vw !important;
                        max-height: 90vh !important;
                    }
                    
                    .phantom-fly-map-container {
                        height: 180px !important;
                    }
                    
                    .phantom-fly-header {
                        padding: 8px !important;
                    }
                    
                    .phantom-fly-content {
                        padding: 8px !important;
                        max-height: 75vh !important;
                    }
                    
                    .phantom-fly-refresh-btn,
                    .phantom-fly-minimize-btn,
                    .phantom-fly-close-btn {
                        width: 38px !important;
                        height: 38px !important;
                        min-width: 38px !important;
                        min-height: 38px !important;
                    }
                    
                    .phantom-fly-airplane-marker {
                        width: 18px !important;
                        height: 18px !important;
                    }
                }
                
                @media (max-width: 360px) {
                    .phantom-fly-map-container {
                        height: 160px !important;
                    }
                    
                    .phantom-fly-content {
                        max-height: 70vh !important;
                    }
                    
                    .phantom-fly-header {
                        font-size: 13px !important;
                    }
                    
                    .phantom-fly-refresh-btn,
                    .phantom-fly-minimize-btn,
                    .phantom-fly-close-btn {
                        width: 36px !important;
                        height: 36px !important;
                        min-width: 36px !important;
                        min-height: 36px !important;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'phantom-fly-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }

        cleanup() {
            this.closeWindow();
            
            if (this.coreCheckInterval) {
                clearInterval(this.coreCheckInterval);
                this.coreCheckInterval = null;
            }
            
            if (this.themeUpdateInterval) {
                clearInterval(this.themeUpdateInterval);
                this.themeUpdateInterval = null;
            }
            
            this.stopMarkerCycling();
            this.stopFlashingMarkers();
            this.eventListeners.clear();
            this.loaded = false;
            
            if (window.phantomFlyInstance === this) {
                window.phantomFlyInstance = null;
            }
            
            window._phantomFlyInitializationLock = false;
        }
    }

    const main = () => {
        const phantomFly = new PhantomFly();
        setTimeout(() => {
            phantomFly.initialize().then(success => {
                if (!success) console.log(`${PLUGIN_INFO.name}: Running in limited mode`);
            }).catch(error => {
                console.error(`${PLUGIN_INFO.name}: Initialization failed`, error);
            });
        }, 3000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        setTimeout(main, 100);
    }

})();