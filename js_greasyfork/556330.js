// ==UserScript==
// @name         Geoguessr Map Switcher
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Switch to OpenStreetMap, OpenTopoMap, etc. in Geoguessr
// @author       vinz3210
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556330/Geoguessr%20Map%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/556330/Geoguessr%20Map%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG_OUTPUT = false;
    const ENABLE_EXTENDED_MODES = false;

    function log(...args) {
        if (DEBUG_OUTPUT) {
            console.log(...args);
        }
    }

    log('[Geoguessr Map Switcher] Script started');

    function getLocalStorage(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('[Geoguessr Map Switcher] Failed to save to localStorage', e);
        }
    }

    function isGamePage() {
        // Handle localization (e.g., /fr/game/...) by stripping the language prefix
        const path = location.pathname.replace(/^\/[a-z]{2}\//i, "/");

        if (ENABLE_EXTENDED_MODES) {
            return path.startsWith("/challenge/") ||
                path.startsWith("/results/") ||
                path.startsWith("/game/") ||
                path.startsWith("/battle-royale/") ||
                path.startsWith("/duels/") ||
                path.startsWith("/team-duels/") ||
                path.startsWith("/bullseye/") ||
                path.startsWith("/live-challenge/");
        }
        return path.startsWith("/game/") || path.startsWith("/results/");
    }

    // Interception logic adapted from unity.user.js
    function overrideOnLoad(googleScript, observer, overrider) {
        log('[Geoguessr Map Switcher] Overriding onload for script:', googleScript.src);
        const oldOnload = googleScript.onload;
        googleScript.onload = (event) => {
            log('[Geoguessr Map Switcher] Google Maps script loaded');
            const google = window.google;
            if (google) {
                log('[Geoguessr Map Switcher] google object found, disconnecting observer');
                observer.disconnect();
                overrider(google);
            } else {
                console.error('[Geoguessr Map Switcher] google object NOT found after load');
            }
            if (oldOnload) {
                oldOnload.call(googleScript, event);
            }
        };
    }

    function grabGoogleScript(mutations) {
        for (const mutation of mutations) {
            for (const newNode of mutation.addedNodes) {
                const asScript = newNode;
                if (asScript && asScript.src && asScript.src.startsWith('https://maps.googleapis.com/')) {
                    log('[Geoguessr Map Switcher] Found Google Maps script:', asScript.src);
                    return asScript;
                }
            }
        }
        return null;
    }

    function injecter(overrider) {
        log('[Geoguessr Map Switcher] Starting MutationObserver');
        new MutationObserver((mutations, observer) => {
            const googleScript = grabGoogleScript(mutations);
            if (googleScript) {
                overrideOnLoad(googleScript, observer, overrider);
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    function initReactionRemover() {
        log('[Geoguessr Map Switcher] Initializing Reaction Remover');

        const remove = () => {
            const reactions = document.querySelector('[class^="game-reactions_root"]');
            if (reactions) {
                reactions.remove();
                log('[Geoguessr Map Switcher] Removed game-reactions_root');
            }
        };

        // Observer to handle dynamic loading
        const observer = new MutationObserver(() => {
            remove();
        });

        // Start observing when body is available
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            remove();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
                remove();
            });
        }
    }

    function initMapSwitcher(google) {
        log('[Geoguessr Map Switcher] Initializing Map Switcher');
        const originalMap = google.maps.Map;

        google.maps.Map = class extends originalMap {
            constructor(mapDiv, opts) {
                log('[Geoguessr Map Switcher] Map constructor called');
                super(mapDiv, opts);

                if (!isGamePage()) {
                    log('[Geoguessr Map Switcher] Not a game page, skipping customization');
                    return;
                }

                this._mapDiv = mapDiv;

                // Define custom map types
                const openTopoMapType = new google.maps.ImageMapType({
                    getTileUrl: function (coord, zoom) {
                        return 'https://c.tile.opentopomap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
                    },
                    tileSize: new google.maps.Size(256, 256),
                    name: 'OTM',
                    maxZoom: 18
                });
                this.mapTypes.set('opentopomap', openTopoMapType);
                log('[Geoguessr Map Switcher] Added OpenTopoMap');

                const osmMapType = new google.maps.ImageMapType({
                    getTileUrl: function (coord, zoom) {
                        return 'https://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
                    },
                    tileSize: new google.maps.Size(256, 256),
                    name: 'OSM',
                    maxZoom: 18
                });
                this.mapTypes.set('osm', osmMapType);
                log('[Geoguessr Map Switcher] Added OpenStreetMap');

                // Restore last used map type
                const savedMapTypeId = getLocalStorage('cg_MapTypeId');
                if (savedMapTypeId) {
                    log('[Geoguessr Map Switcher] Restoring map type:', savedMapTypeId);
                    this.setMapTypeId(savedMapTypeId);
                }

                this.addListener('maptypeid_changed', () => {
                    const currentType = this.getMapTypeId();
                    log('[Geoguessr Map Switcher] Map type changed to:', currentType);
                    setLocalStorage('cg_MapTypeId', currentType);
                });

                // Keyboard shortcuts for map styles
                document.addEventListener('keydown', (e) => {
                    // Don't trigger if user is typing in an input
                    if (document.activeElement &&
                        (document.activeElement.tagName === 'INPUT' ||
                            document.activeElement.tagName === 'TEXTAREA' ||
                            document.activeElement.isContentEditable)) {
                        return;
                    }

                    // 1-6 keys (both top row and numpad)
                    // Top row: 49-54, Numpad: 97-102
                    // Using e.key is cleaner

                    if (e.key === '1') {
                        this.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    } else if (e.key === '2') {
                        this.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                    } else if (e.key === '3') {
                        this.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    } else if (e.key === '4') {
                        this.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    } else if (e.key === '5') {
                        this.setMapTypeId('osm');
                    } else if (e.key === '6') {
                        this.setMapTypeId('opentopomap');
                    }
                });

                // Periodic check to enforce map controls
                setInterval(() => {
                    if (!isGamePage()) return;

                    const currentOptions = this.get('mapTypeControlOptions');
                    const desiredMapTypeIds = [
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.TERRAIN,
                        google.maps.MapTypeId.SATELLITE,
                        google.maps.MapTypeId.HYBRID,
                        'osm',
                        'opentopomap'
                    ];

                    // Check if we need to re-apply options
                    if (!this.get('mapTypeControl') ||
                        !currentOptions ||
                        JSON.stringify(currentOptions.mapTypeIds) !== JSON.stringify(desiredMapTypeIds) ||
                        currentOptions.position !== google.maps.ControlPosition.TOP_RIGHT) {

                        log('[Geoguessr Map Switcher] Re-applying map options (setInterval)');
                        this.setOptions({
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                                mapTypeIds: desiredMapTypeIds,
                                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                position: google.maps.ControlPosition.TOP_RIGHT
                            }
                        });
                    }
                }, 1000);
            }

            setOptions(opts) {
                log('[Geoguessr Map Switcher] setOptions called with:', opts);

                if (isGamePage()) {
                    // Intercept setOptions to ensure our controls are always present
                    if (opts.backgroundColor || opts.disableDefaultUI) { // Geoguessr often sets these
                        log('[Geoguessr Map Switcher] Enforcing mapTypeControl in setOptions');
                        opts.mapTypeControl = true;
                        opts.mapTypeControlOptions = {
                            mapTypeIds: [
                                google.maps.MapTypeId.ROADMAP,
                                google.maps.MapTypeId.TERRAIN,
                                google.maps.MapTypeId.SATELLITE,
                                google.maps.MapTypeId.HYBRID,
                                'osm',
                                'opentopomap'
                            ],
                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                            position: google.maps.ControlPosition.TOP_RIGHT
                        };
                    }
                }
                super.setOptions(opts);
            }
        };
    }

    // Inject CSS to ensure map controls are visible
    const style = document.createElement('style');
    style.textContent = `
        .gm-style-mtc {
            display: block !important;
            z-index: 999999 !important;
        }
    `;
    document.head.appendChild(style);

    injecter(initMapSwitcher);
    initReactionRemover();

})();
