// ==UserScript==
// @name         MapGenie Unlimited
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bypass 50 location limit and save presets locally on MapGenie
// @author       TropicalFrog3
// @license MIT
// @match        https://mapgenie.io/*
// @icon         https://cdn.mapgenie.io/favicons/mapgenie/favicon-32x32.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560496/MapGenie%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/560496/MapGenie%20Unlimited.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PRESETS_KEY = 'mapgenie_local_presets';
    const LOCATIONS_KEY = 'mapgenie_local_locations';
    let presetIdCounter = Date.now();

    // ==================== STORAGE FUNCTIONS ====================

    function getPresets() {
        try {
            let presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]');
            return presets.filter(p => p && p.title);
        } catch {
            return [];
        }
    }

    function savePresets(presets) {
        presets = presets.filter(p => p && p.title);
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    }

    function getLocations() {
        try {
            return JSON.parse(localStorage.getItem(LOCATIONS_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function saveLocations(locations) {
        localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    }

    function getMapKey() {
        const match = window.location.pathname.match(/\/([^\/]+)\/maps\/([^\/]+)/);
        return match ? `${match[1]}_${match[2]}` : null;
    }

    function getMapLocations() {
        const key = getMapKey();
        if (!key) return [];
        const all = getLocations();
        return all[key] || [];
    }

    function addLocation(id) {
        const key = getMapKey();
        if (!key) return;
        const all = getLocations();
        if (!all[key]) all[key] = [];
        if (!all[key].includes(id)) {
            all[key].push(id);
            saveLocations(all);
        }
    }

    function removeLocation(id) {
        const key = getMapKey();
        if (!key) return;
        const all = getLocations();
        if (all[key]) {
            all[key] = all[key].filter(x => x !== id);
            saveLocations(all);
        }
    }

    savePresets(getPresets());

    // ==================== PATCH USER & MAPDATA ====================

    let _user = undefined;
    Object.defineProperty(window, 'user', {
        get: () => _user,
        set: (val) => {
            _user = val;
            if (_user) {
                _user.hasPro = true;
                
                // Inject local locations into user.locations (object with IDs as keys)
                const localLocations = getMapLocations();
                if (localLocations.length > 0) {
                    if (!_user.locations) _user.locations = {};
                    localLocations.forEach(id => {
                        _user.locations[id] = true;
                    });
                    console.log('[MapGenie] Injected', localLocations.length, 'locations into user');
                }
            }
        },
        configurable: true
    });

    let _mapData = undefined;
    Object.defineProperty(window, 'mapData', {
        get: () => _mapData,
        set: (val) => {
            _mapData = val;
            if (_mapData) {
                // Inject local presets
                const localPresets = getPresets();
                if (localPresets.length > 0) {
                    _mapData.presets = localPresets;
                    console.log('[MapGenie] Injected', localPresets.length, 'presets');
                }
            }
        },
        configurable: true
    });

    // ==================== INTERCEPT XHR ====================

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const url = this._url || '';
        const method = (this._method || 'GET').toUpperCase();

        // ===== LOCATIONS API =====
        if (url.includes('/api/v1/user/locations/')) {
            const locationId = parseInt(url.split('/').pop());

            if (method === 'PUT') {
                addLocation(locationId);
                console.log('[MapGenie] Marked location:', locationId);
                fakeResponse(xhr, 201, '{}');
                return;
            }

            if (method === 'DELETE') {
                removeLocation(locationId);
                console.log('[MapGenie] Unmarked location:', locationId);
                fakeResponse(xhr, 204, '');
                return;
            }
        }

        // ===== PRESETS API =====
        if (url.includes('/api/v1/user/presets')) {
            if (method === 'POST' && !url.match(/\/presets\/\d+/)) {
                const data = JSON.parse(body);
                const presets = getPresets();
                const newPreset = {
                    id: presetIdCounter++,
                    game_id: data.game_id,
                    title: data.title,
                    categories: data.categories || [],
                    tags: data.tags || {},
                    ordering: data.ordering || [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                presets.push(newPreset);
                savePresets(presets);
                console.log('[MapGenie] Saved preset:', newPreset.title);
                fakeResponse(xhr, 201, JSON.stringify(newPreset));
                return;
            }

            if (method === 'DELETE') {
                const match = url.match(/\/presets\/(\d+)/);
                if (match) {
                    const presetId = parseInt(match[1]);
                    let presets = getPresets();
                    presets = presets.filter(p => p.id !== presetId);
                    savePresets(presets);
                    console.log('[MapGenie] Deleted preset:', presetId);
                    fakeResponse(xhr, 204, '');
                    return;
                }
            }

            if (method === 'PUT') {
                const match = url.match(/\/presets\/(\d+)/);
                if (match) {
                    const presetId = parseInt(match[1]);
                    const data = JSON.parse(body);
                    const presets = getPresets();
                    const index = presets.findIndex(p => p.id === presetId);
                    if (index !== -1) {
                        presets[index] = { ...presets[index], ...data, updated_at: new Date().toISOString() };
                        savePresets(presets);
                        console.log('[MapGenie] Updated preset:', presets[index].title);
                        fakeResponse(xhr, 200, JSON.stringify(presets[index]));
                        return;
                    }
                }
            }
        }

        return originalXHRSend.apply(this, arguments);
    };

    function fakeResponse(xhr, status, responseText) {
        setTimeout(() => {
            Object.defineProperty(xhr, 'status', { value: status, writable: false });
            Object.defineProperty(xhr, 'readyState', { value: 4, writable: false });
            Object.defineProperty(xhr, 'responseText', { value: responseText, writable: false });
            Object.defineProperty(xhr, 'response', { value: responseText, writable: false });
            xhr.dispatchEvent(new Event('readystatechange'));
            xhr.dispatchEvent(new Event('load'));
            xhr.dispatchEvent(new Event('loadend'));
        }, 10);
    }

    // ==================== DELETE PRESET HANDLER ====================

    function setupDeleteHandlers() {
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('ion-md-trash')) {
                const presetItem = e.target.closest('.presets-item');
                if (presetItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const presetsList = presetItem.parentElement;
                    const allPresets = presetsList.querySelectorAll('.presets-item');
                    let index = Array.from(allPresets).indexOf(presetItem);

                    if (index >= 0) {
                        let presets = getPresets();
                        if (index < presets.length) {
                            const deleted = presets.splice(index, 1);
                            savePresets(presets);
                            presetItem.remove();
                            console.log('[MapGenie] Deleted preset:', deleted[0]?.title);
                        }
                    }
                    return false;
                }
            }
        }, true);

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ion-md-trash')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDeleteHandlers);
    } else {
        setupDeleteHandlers();
    }

})();
