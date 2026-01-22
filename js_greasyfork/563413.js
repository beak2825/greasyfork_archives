// ==UserScript==
// @name         WME Segment Age Filter
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.23.4
// @description  Level highlighter with age filter - Radius scan, Regierungsbezirke, Auto-scroll
// @icon         https://i.ibb.co/ckSvk59/waze-icon.png
// @author       Hiwi234
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563413/WME%20Segment%20Age%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/563413/WME%20Segment%20Age%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("=== WME Segment Age Filter LOADING ===");

    var SCRIPT_VERSION = "2026.01.22.3";
    var SCRIPT_NAME = "WME Segment Age Filter";

    // State variables
    var highlightedSegmentIds = [];
    var foundSegmentsList = [];
    var autoRefreshInterval = null;
    var autoRefreshEnabled = false;
    var lastFilterOptions = null; // Speichert die letzten Filter-Optionen für Re-Highlight

    // Scan State
    var scanState = {
        isScanning: false,
        isPaused: false,
        currentTile: 0,
        totalTiles: 0,
        segmentsFound: 0,
        oldSegmentsFound: 0,
        results: [],
        cityStats: new Map(),
        scanner: null,
        currentBundesland: null
    };

    // Deutsche Bundesländer mit Bounding Boxes (WGS84)
    var BUNDESLAENDER = {
        'baden-wuerttemberg': {
            name: 'Baden-Württemberg',
            bounds: { minLon: 7.5113, minLat: 47.5322, maxLon: 10.4918, maxLat: 49.7913 }
        },
        'bayern': {
            name: 'Bayern',
            bounds: { minLon: 8.9771, minLat: 47.2703, maxLon: 13.8350, maxLat: 50.5644 }
        },
        'berlin': {
            name: 'Berlin',
            bounds: { minLon: 13.0883, minLat: 52.3382, maxLon: 13.7611, maxLat: 52.6755 }
        },
        'brandenburg': {
            name: 'Brandenburg',
            bounds: { minLon: 11.2662, minLat: 51.3606, maxLon: 14.7657, maxLat: 53.5579 }
        },
        'bremen': {
            name: 'Bremen',
            bounds: { minLon: 8.4816, minLat: 53.0110, maxLon: 8.9901, maxLat: 53.6061 }
        },
        'hamburg': {
            name: 'Hamburg',
            bounds: { minLon: 9.7277, minLat: 53.3950, maxLon: 10.3253, maxLat: 53.7393 }
        },
        'hessen': {
            name: 'Hessen',
            bounds: { minLon: 7.7731, minLat: 49.3948, maxLon: 10.2340, maxLat: 51.6540 }
        },
        'mecklenburg-vorpommern': {
            name: 'Mecklenburg-Vorpommern',
            bounds: { minLon: 10.5932, minLat: 53.1158, maxLon: 14.4122, maxLat: 54.6847 }
        },
        'niedersachsen': {
            name: 'Niedersachsen',
            bounds: { minLon: 6.6545, minLat: 51.2954, maxLon: 11.5980, maxLat: 53.8941 }
        },
        'nordrhein-westfalen': {
            name: 'Nordrhein-Westfalen',
            bounds: { minLon: 5.8663, minLat: 50.3226, maxLon: 9.4617, maxLat: 52.5314 }
        },
        'rheinland-pfalz': {
            name: 'Rheinland-Pfalz',
            bounds: { minLon: 6.1173, minLat: 48.9664, maxLon: 8.5084, maxLat: 50.9404 }
        },
        'saarland': {
            name: 'Saarland',
            bounds: { minLon: 6.3584, minLat: 49.1130, maxLon: 7.4034, maxLat: 49.6393 }
        },
        'sachsen': {
            name: 'Sachsen',
            bounds: { minLon: 11.8723, minLat: 50.1715, maxLon: 15.0377, maxLat: 51.6831 }
        },
        'sachsen-anhalt': {
            name: 'Sachsen-Anhalt',
            bounds: { minLon: 10.5612, minLat: 50.9379, maxLon: 13.1865, maxLat: 53.0421 }
        },
        'schleswig-holstein': {
            name: 'Schleswig-Holstein',
            bounds: { minLon: 7.8685, minLat: 53.3590, maxLon: 11.3132, maxLat: 55.0573 }
        },
        'thueringen': {
            name: 'Thüringen',
            bounds: { minLon: 9.8778, minLat: 50.2043, maxLon: 12.6531, maxLat: 51.6490 }
        }
    };

    // Regierungsbezirke / Regionen (kleinere Einheiten für schnellere Scans)
    var REGIERUNGSBEZIRKE = {
        // Baden-Württemberg (4 Regierungsbezirke)
        'bw-stuttgart': { name: 'Stuttgart (BW)', bundesland: 'Baden-Württemberg', bounds: { minLon: 8.5, minLat: 48.3, maxLon: 10.5, maxLat: 49.4 }},
        'bw-karlsruhe': { name: 'Karlsruhe (BW)', bundesland: 'Baden-Württemberg', bounds: { minLon: 7.5, minLat: 48.5, maxLon: 9.2, maxLat: 49.8 }},
        'bw-freiburg': { name: 'Freiburg (BW)', bundesland: 'Baden-Württemberg', bounds: { minLon: 7.5, minLat: 47.5, maxLon: 9.0, maxLat: 48.5 }},
        'bw-tuebingen': { name: 'Tübingen (BW)', bundesland: 'Baden-Württemberg', bounds: { minLon: 8.5, minLat: 47.6, maxLon: 10.5, maxLat: 48.6 }},

        // Bayern (7 Regierungsbezirke)
        'by-oberbayern': { name: 'Oberbayern', bundesland: 'Bayern', bounds: { minLon: 10.8, minLat: 47.3, maxLon: 13.2, maxLat: 48.9 }},
        'by-niederbayern': { name: 'Niederbayern', bundesland: 'Bayern', bounds: { minLon: 11.8, minLat: 48.3, maxLon: 13.8, maxLat: 49.3 }},
        'by-oberpfalz': { name: 'Oberpfalz', bundesland: 'Bayern', bounds: { minLon: 11.2, minLat: 49.0, maxLon: 12.8, maxLat: 50.0 }},
        'by-oberfranken': { name: 'Oberfranken', bundesland: 'Bayern', bounds: { minLon: 10.5, minLat: 49.6, maxLon: 12.4, maxLat: 50.6 }},
        'by-mittelfranken': { name: 'Mittelfranken', bundesland: 'Bayern', bounds: { minLon: 10.0, minLat: 49.0, maxLon: 11.6, maxLat: 49.9 }},
        'by-unterfranken': { name: 'Unterfranken', bundesland: 'Bayern', bounds: { minLon: 9.0, minLat: 49.5, maxLon: 10.6, maxLat: 50.5 }},
        'by-schwaben': { name: 'Schwaben (BY)', bundesland: 'Bayern', bounds: { minLon: 9.7, minLat: 47.3, maxLon: 11.2, maxLat: 49.0 }},

        // Brandenburg (keine Regierungsbezirke, aber Regionen)
        'bb-nord': { name: 'Brandenburg Nord', bundesland: 'Brandenburg', bounds: { minLon: 11.3, minLat: 52.8, maxLon: 14.8, maxLat: 53.6 }},
        'bb-sued': { name: 'Brandenburg Süd', bundesland: 'Brandenburg', bounds: { minLon: 11.3, minLat: 51.4, maxLon: 14.8, maxLat: 52.8 }},

        // Hessen (3 Regierungsbezirke)
        'he-darmstadt': { name: 'Darmstadt (HE)', bundesland: 'Hessen', bounds: { minLon: 7.8, minLat: 49.4, maxLon: 9.5, maxLat: 50.4 }},
        'he-giessen': { name: 'Gießen (HE)', bundesland: 'Hessen', bounds: { minLon: 8.0, minLat: 50.2, maxLon: 9.6, maxLat: 51.0 }},
        'he-kassel': { name: 'Kassel (HE)', bundesland: 'Hessen', bounds: { minLon: 8.5, minLat: 50.8, maxLon: 10.2, maxLat: 51.7 }},

        // Niedersachsen (4 ehemalige Bezirke)
        'ni-braunschweig': { name: 'Braunschweig (NI)', bundesland: 'Niedersachsen', bounds: { minLon: 9.5, minLat: 51.6, maxLon: 11.6, maxLat: 52.6 }},
        'ni-hannover': { name: 'Hannover (NI)', bundesland: 'Niedersachsen', bounds: { minLon: 8.8, minLat: 52.0, maxLon: 10.5, maxLat: 53.0 }},
        'ni-lueneburg': { name: 'Lüneburg (NI)', bundesland: 'Niedersachsen', bounds: { minLon: 9.0, minLat: 52.8, maxLon: 11.6, maxLat: 53.9 }},
        'ni-weser-ems': { name: 'Weser-Ems (NI)', bundesland: 'Niedersachsen', bounds: { minLon: 6.7, minLat: 52.2, maxLon: 9.0, maxLat: 53.7 }},

        // NRW (5 Regierungsbezirke)
        'nw-duesseldorf': { name: 'Düsseldorf (NRW)', bundesland: 'NRW', bounds: { minLon: 6.0, minLat: 51.0, maxLon: 7.3, maxLat: 51.9 }},
        'nw-koeln': { name: 'Köln (NRW)', bundesland: 'NRW', bounds: { minLon: 6.1, minLat: 50.3, maxLon: 7.8, maxLat: 51.2 }},
        'nw-muenster': { name: 'Münster (NRW)', bundesland: 'NRW', bounds: { minLon: 6.6, minLat: 51.6, maxLon: 8.5, maxLat: 52.5 }},
        'nw-detmold': { name: 'Detmold (NRW)', bundesland: 'NRW', bounds: { minLon: 8.0, minLat: 51.5, maxLon: 9.5, maxLat: 52.5 }},
        'nw-arnsberg': { name: 'Arnsberg (NRW)', bundesland: 'NRW', bounds: { minLon: 7.0, minLat: 50.9, maxLon: 9.0, maxLat: 51.8 }},

        // Rheinland-Pfalz (3 ehemalige Bezirke)
        'rp-koblenz': { name: 'Koblenz (RP)', bundesland: 'Rheinland-Pfalz', bounds: { minLon: 6.5, minLat: 49.9, maxLon: 8.1, maxLat: 50.9 }},
        'rp-trier': { name: 'Trier (RP)', bundesland: 'Rheinland-Pfalz', bounds: { minLon: 6.1, minLat: 49.4, maxLon: 7.4, maxLat: 50.4 }},
        'rp-rheinhessen-pfalz': { name: 'Rheinhessen-Pfalz', bundesland: 'Rheinland-Pfalz', bounds: { minLon: 6.8, minLat: 49.0, maxLon: 8.5, maxLat: 50.1 }},

        // Sachsen (3 Direktionsbezirke)
        'sn-chemnitz': { name: 'Chemnitz (SN)', bundesland: 'Sachsen', bounds: { minLon: 11.9, minLat: 50.2, maxLon: 13.5, maxLat: 51.0 }},
        'sn-dresden': { name: 'Dresden (SN)', bundesland: 'Sachsen', bounds: { minLon: 13.0, minLat: 50.5, maxLon: 15.0, maxLat: 51.4 }},
        'sn-leipzig': { name: 'Leipzig (SN)', bundesland: 'Sachsen', bounds: { minLon: 11.9, minLat: 50.9, maxLon: 13.2, maxLat: 51.7 }},

        // Sachsen-Anhalt (3 ehemalige Bezirke)
        'st-dessau': { name: 'Dessau (ST)', bundesland: 'Sachsen-Anhalt', bounds: { minLon: 11.3, minLat: 51.4, maxLon: 12.8, maxLat: 52.2 }},
        'st-halle': { name: 'Halle (ST)', bundesland: 'Sachsen-Anhalt', bounds: { minLon: 10.6, minLat: 50.9, maxLon: 12.5, maxLat: 51.8 }},
        'st-magdeburg': { name: 'Magdeburg (ST)', bundesland: 'Sachsen-Anhalt', bounds: { minLon: 10.6, minLat: 51.8, maxLon: 12.5, maxLat: 53.0 }},

        // Schleswig-Holstein (Regionen)
        'sh-sued': { name: 'Schleswig-Holstein Süd', bundesland: 'Schleswig-Holstein', bounds: { minLon: 8.5, minLat: 53.4, maxLon: 11.0, maxLat: 54.2 }},
        'sh-nord': { name: 'Schleswig-Holstein Nord', bundesland: 'Schleswig-Holstein', bounds: { minLon: 8.3, minLat: 54.0, maxLon: 11.3, maxLat: 55.1 }},

        // Thüringen (Regionen)
        'th-nord': { name: 'Thüringen Nord', bundesland: 'Thüringen', bounds: { minLon: 9.9, minLat: 50.8, maxLon: 12.7, maxLat: 51.6 }},
        'th-sued': { name: 'Thüringen Süd', bundesland: 'Thüringen', bounds: { minLon: 9.9, minLat: 50.2, maxLon: 12.7, maxLat: 50.9 }},

        // Mecklenburg-Vorpommern (Regionen)
        'mv-west': { name: 'MV West (Schwerin)', bundesland: 'Mecklenburg-Vorpommern', bounds: { minLon: 10.6, minLat: 53.1, maxLon: 12.5, maxLat: 54.2 }},
        'mv-ost': { name: 'MV Ost (Greifswald)', bundesland: 'Mecklenburg-Vorpommern', bounds: { minLon: 12.3, minLat: 53.4, maxLon: 14.4, maxLat: 54.7 }},

        // Kleine Bundesländer (als Ganzes, da schon klein genug)
        'berlin': { name: 'Berlin', bundesland: 'Berlin', bounds: { minLon: 13.09, minLat: 52.34, maxLon: 13.76, maxLat: 52.68 }},
        'bremen': { name: 'Bremen', bundesland: 'Bremen', bounds: { minLon: 8.48, minLat: 53.01, maxLon: 8.99, maxLat: 53.61 }},
        'hamburg': { name: 'Hamburg', bundesland: 'Hamburg', bounds: { minLon: 9.73, minLat: 53.40, maxLon: 10.33, maxLat: 53.74 }},
        'saarland': { name: 'Saarland', bundesland: 'Saarland', bounds: { minLon: 6.36, minLat: 49.11, maxLon: 7.40, maxLat: 49.64 }}
    };

    // Colors
    var HIGHLIGHT_GREEN = "#00ff00";
    var HIGHLIGHT_BLUE = "#0066ff";
    var HIGHLIGHT_RED = "#ff0000";
    var HIGHLIGHT_OPACITY = 0.7;
    var levelIcon = '⏰';

    // Local storage keys
    var STORAGE_KEYS = {
        selectedLevel: 'wme_age_filter_level',
        daysOld: 'wme_age_filter_days',
        colorMode: 'wme_age_filter_color_mode',
        customColor: 'wme_age_filter_custom_color',
        autoRefresh: 'wme_age_filter_auto_refresh',
        ageFilterDays: 'wme_age_filter_age_days',
        levelFilterEnabled: 'wme_age_filter_level_enabled',
        roadTypeFilterEnabled: 'wme_age_filter_roadtype_enabled',
        selectedRoadTypes: 'wme_age_filter_selected_roadtypes',
        tileSize: 'wme_age_filter_tile_size',
        scanMode: 'wme_age_filter_scan_mode'
    };

    // Road type mapping
    var ROAD_TYPES = {
        1: 'Street',
        2: 'Primary Street',
        3: 'Freeway',
        4: 'Ramp',
        5: 'Walking Trail',
        6: 'Major Highway',
        7: 'Minor Highway',
        8: 'Dirt Road',
        10: 'Pedestrian Boardwalk',
        14: 'Ferry',
        15: 'Stairway',
        16: 'Private Road',
        17: 'Railroad',
        18: 'Runway/Taxiway',
        19: 'Parking Lot Road',
        20: 'Service Road'
    };

    // ============ MANAGED AREAS (Legacy) ============
    var managedAreas = {
        areas: [],
        selectedAreaIndex: -1,

        // Lädt Gebiete aus der Sidebar (DOM-Elemente)
        loadFromSidebar: function() {
            this.areas = [];
            var self = this;

            try {
                // Suche nach "Your areas" Panel im DOM
                var areaItems = document.querySelectorAll('.area-item');

                console.log(SCRIPT_NAME + ": Gefundene .area-item Elemente:", areaItems.length);

                areaItems.forEach(function(item, index) {
                    var titleElement = item.querySelector('.list-item-card-title');
                    var captionElement = item.querySelector('wz-caption');

                    if (titleElement) {
                        var name = titleElement.textContent.trim();
                        var sizeKm2 = 0;

                        if (captionElement) {
                            var sizeText = captionElement.textContent.trim();
                            var sizeMatch = sizeText.match(/(\d+(?:\.\d+)?)\s*km²/);
                            sizeKm2 = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
                        }

                        // Schätze Bounds basierend auf Größe
                        var bounds = self.estimateBoundsFromSize(sizeKm2);

                        self.areas.push({
                            index: index,
                            name: name,
                            sizeKm2: sizeKm2,
                            bounds: bounds,
                            element: item // Referenz auf DOM Element für Klick
                        });

                        console.log(SCRIPT_NAME + ": Area gefunden:", name, sizeKm2 + " km²");
                    }
                });

                console.log(SCRIPT_NAME + ": " + this.areas.length + " Gebiete aus Sidebar geladen");
                return this.areas;

            } catch (e) {
                console.error(SCRIPT_NAME + ": Fehler beim Lesen der Sidebar-Gebiete:", e);
                return [];
            }
        },

        // Schätzt Bounds basierend auf der Gebietsgröße in km²
        estimateBoundsFromSize: function(sizeKm2) {
            // Hole aktuellen Viewport als Referenzpunkt
            var currentBounds = CoordUtils.getCurrentBounds();
            if (!currentBounds) {
                // Fallback: Deutschland-Zentrum
                return {
                    minLon: 10.0,
                    minLat: 51.0,
                    maxLon: 11.0,
                    maxLat: 52.0
                };
            }

            // Berechne Seitenlänge eines quadratischen Gebiets
            var sideLengthKm = Math.sqrt(sizeKm2);
            var sideLengthDeg = sideLengthKm / 111.32; // Grobe Umrechnung km zu Grad

            var centerLon = (currentBounds.minLon + currentBounds.maxLon) / 2;
            var centerLat = (currentBounds.minLat + currentBounds.maxLat) / 2;

            return {
                minLon: centerLon - sideLengthDeg / 2,
                minLat: centerLat - sideLengthDeg / 2,
                maxLon: centerLon + sideLengthDeg / 2,
                maxLat: centerLat + sideLengthDeg / 2
            };
        },

        // Klickt auf ein Gebiet in der Sidebar - WME navigiert dann automatisch dorthin
        // Danach werden die Bounds aus dem neuen Viewport geholt
        selectArea: function(index) {
            if (index >= 0 && index < this.areas.length) {
                var area = this.areas[index];
                if (area.element) {
                    console.log(SCRIPT_NAME + ": Klicke auf Area Element:", area.name);
                    area.element.click();
                    this.selectedAreaIndex = index;
                    return true;
                }
            }
            return false;
        },

        // Holt die kombinierten Bounds aller Gebiete
        getAllAreasBounds: function() {
            if (this.areas.length === 0) return null;

            var minLon = Infinity, minLat = Infinity;
            var maxLon = -Infinity, maxLat = -Infinity;

            this.areas.forEach(function(area) {
                if (area.bounds) {
                    minLon = Math.min(minLon, area.bounds.minLon);
                    minLat = Math.min(minLat, area.bounds.minLat);
                    maxLon = Math.max(maxLon, area.bounds.maxLon);
                    maxLat = Math.max(maxLat, area.bounds.maxLat);
                }
            });

            if (minLon === Infinity) return null;

            return {
                minLon: minLon,
                minLat: minLat,
                maxLon: maxLon,
                maxLat: maxLat
            };
        }
    };

    // ============ EDITABLE AREAS ANALYZER (Neue Implementierung) ============
    var editableAreasAnalyzer = {
        editableAreas: [],
        selectedAreas: new Set(),

        analyzeEditableAreas: function() {
            var self = this;
            return new Promise(function(resolve) {
                try {
                    log('Analysiere editierbare Gebiete...', 'info');
                    self.editableAreas = [];

                    // Methode 1: Versuche WME "Your areas" Panel zu finden
                    var areas = self.getAreasFromSidebar();
                    if (areas.length > 0) {
                        self.editableAreas = areas;
                        log(self.editableAreas.length + ' Gebiete aus "Your areas" Panel gefunden', 'success');
                        resolve(self.editableAreas);
                        return;
                    }

                    // Methode 2: Versuche über WME API/Model
                    var apiAreas = self.getAreasFromAPI();
                    if (apiAreas.length > 0) {
                        self.editableAreas = apiAreas;
                        log(self.editableAreas.length + ' Gebiete über API gefunden', 'success');
                        resolve(self.editableAreas);
                        return;
                    }

                    log('Keine editierbaren Gebiete gefunden', 'warning');
                    resolve([]);

                } catch (e) {
                    console.error(SCRIPT_NAME + ": Fehler bei der Gebietsanalyse:", e);
                    log('Fehler bei der Gebietsanalyse', 'error');
                    resolve([]);
                }
            });
        },

        getAreasFromSidebar: function() {
            try {
                var areas = [];
                var self = this;

                // Suche nach "Your areas" Panel im DOM
                var areaItems = document.querySelectorAll('.area-item');

                areaItems.forEach(function(item, index) {
                    var titleElement = item.querySelector('.list-item-card-title');
                    var captionElement = item.querySelector('wz-caption');

                    if (titleElement) {
                        var name = titleElement.textContent.trim();
                        var sizeText = captionElement ? captionElement.textContent.trim() : '';

                        // Extrahiere Größe (z.B. "4900 km²" -> 4900)
                        var sizeMatch = sizeText.match(/(\d+(?:\.\d+)?)\s*km²/);
                        var sizeKm2 = sizeMatch ? parseFloat(sizeMatch[1]) : 0;

                        // Versuche Bounds zu ermitteln (falls verfügbar)
                        var bounds = self.estimateBoundsFromSize(sizeKm2);

                        areas.push({
                            id: 'wme_area_' + index,
                            name: name,
                            type: 'managed_area',
                            country: 'Managed Area',
                            bounds: bounds,
                            sizeKm2: sizeKm2,
                            segmentCount: Math.round(sizeKm2 * 50),
                            element: item
                        });
                    }
                });

                console.log(SCRIPT_NAME + ": " + areas.length + " Gebiete aus Sidebar gefunden:", areas);
                return areas;

            } catch (e) {
                console.error(SCRIPT_NAME + ": Fehler beim Lesen der Sidebar-Gebiete:", e);
                return [];
            }
        },

        getAreasFromAPI: function() {
            try {
                var self = this;
                if (W && W.loginManager && W.loginManager.user) {
                    var user = W.loginManager.user;

                    var possibleAreaProps = ['managedAreas', 'areas', 'editableAreas', 'assignedAreas', 'userAreas'];

                    for (var i = 0; i < possibleAreaProps.length; i++) {
                        var prop = possibleAreaProps[i];
                        if (user.attributes && user.attributes[prop]) {
                            console.log(SCRIPT_NAME + ": Gefunden: user.attributes." + prop, user.attributes[prop]);
                            return self.parseAPIAreas(user.attributes[prop], prop);
                        }
                    }

                    for (var j = 0; j < possibleAreaProps.length; j++) {
                        var prop2 = possibleAreaProps[j];
                        if (user[prop2]) {
                            console.log(SCRIPT_NAME + ": Gefunden: user." + prop2, user[prop2]);
                            return self.parseAPIAreas(user[prop2], prop2);
                        }
                    }
                }

                return [];
            } catch (e) {
                console.error(SCRIPT_NAME + ": Fehler beim API-Zugriff:", e);
                return [];
            }
        },

        parseAPIAreas: function(areasData, source) {
            var self = this;
            try {
                var areas = [];

                if (Array.isArray(areasData)) {
                    areasData.forEach(function(area, index) {
                        if (area && (area.name || area.id)) {
                            areas.push({
                                id: 'api_area_' + source + '_' + (area.id || index),
                                name: area.name || 'Area ' + (index + 1),
                                type: 'api_area',
                                country: area.country || 'API Area',
                                bounds: area.bounds || self.estimateBoundsFromSize(1000),
                                sizeKm2: area.size || 1000,
                                segmentCount: area.segmentCount || 50000,
                                source: source
                            });
                        }
                    });
                }

                return areas;
            } catch (e) {
                console.error(SCRIPT_NAME + ": Fehler beim Parsen der API-Gebiete:", e);
                return [];
            }
        },

        estimateBoundsFromSize: function(sizeKm2) {
            var currentBounds = CoordUtils.getCurrentBounds();
            if (!currentBounds) {
                return { minLon: 10.0, minLat: 51.0, maxLon: 11.0, maxLat: 52.0 };
            }

            var sideLengthKm = Math.sqrt(sizeKm2);
            var sideLengthDeg = sideLengthKm / 111.32;

            var centerLon = (currentBounds.minLon + currentBounds.maxLon) / 2;
            var centerLat = (currentBounds.minLat + currentBounds.maxLat) / 2;

            return {
                minLon: centerLon - sideLengthDeg / 2,
                minLat: centerLat - sideLengthDeg / 2,
                maxLon: centerLon + sideLengthDeg / 2,
                maxLat: centerLat + sideLengthDeg / 2
            };
        },

        getSelectedAreasBounds: function() {
            var self = this;
            if (this.selectedAreas.size === 0) return null;

            var selectedAreaObjects = this.editableAreas.filter(function(area) {
                return self.selectedAreas.has(area.id);
            });

            if (selectedAreaObjects.length === 0) return null;

            var minLon = Infinity, minLat = Infinity;
            var maxLon = -Infinity, maxLat = -Infinity;

            selectedAreaObjects.forEach(function(area) {
                minLon = Math.min(minLon, area.bounds.minLon);
                minLat = Math.min(minLat, area.bounds.minLat);
                maxLon = Math.max(maxLon, area.bounds.maxLon);
                maxLat = Math.max(maxLat, area.bounds.maxLat);
            });

            return { minLon: minLon, minLat: minLat, maxLon: maxLon, maxLat: maxLat };
        },

        selectArea: function(areaId) {
            this.selectedAreas.add(areaId);
        },

        deselectArea: function(areaId) {
            this.selectedAreas.delete(areaId);
        },

        selectAllAreas: function() {
            var self = this;
            this.editableAreas.forEach(function(area) { self.selectedAreas.add(area.id); });
        },

        deselectAllAreas: function() {
            this.selectedAreas.clear();
        },

        isAreaSelected: function(areaId) {
            return this.selectedAreas.has(areaId);
        }
    };

    // ============ GRID SCANNER CLASS ============
    function GridScanner(bounds, tileSize) {
        this.bounds = bounds;
        this.tileSize = tileSize || 500;
        this.tiles = [];
        this.currentIndex = 0;
        this.generateTiles();
    }

    GridScanner.prototype.generateTiles = function() {
        var minLon = this.bounds.minLon, minLat = this.bounds.minLat;
        var maxLon = this.bounds.maxLon, maxLat = this.bounds.maxLat;
        var latDelta = this.tileSize / 111320;
        var lonDelta = this.tileSize / (111320 * Math.cos((minLat + maxLat) / 2 * Math.PI / 180));
        var lat = minLat;
        while (lat < maxLat) {
            var lon = minLon;
            while (lon < maxLon) {
                this.tiles.push({
                    centerLon: lon + lonDelta / 2, centerLat: lat + latDelta / 2,
                    minLon: lon, minLat: lat,
                    maxLon: Math.min(lon + lonDelta, maxLon), maxLat: Math.min(lat + latDelta, maxLat)
                });
                lon += lonDelta;
            }
            lat += latDelta;
        }
    };

    GridScanner.prototype.hasNext = function() { return this.currentIndex < this.tiles.length; };
    GridScanner.prototype.next = function() { return this.hasNext() ? this.tiles[this.currentIndex++] : null; };
    GridScanner.prototype.getProgress = function() {
        return { current: this.currentIndex, total: this.tiles.length,
            percentage: this.tiles.length > 0 ? Math.round((this.currentIndex / this.tiles.length) * 100) : 0 };
    };

    // ============ COORDINATE UTILITIES ============
    var CoordUtils = {
        toWGS84: function(x, y) {
            var lon = x * 180 / 20037508.34;
            var lat = y * 180 / 20037508.34;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return { lon: lon, lat: lat };
        },
        toWebMercator: function(lon, lat) {
            var x = lon * 20037508.34 / 180;
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            y = y * 20037508.34 / 180;
            return { x: x, y: y };
        },
        getCurrentBounds: function() {
            try {
                if (W && W.map) {
                    var extent = W.map.getExtent();
                    if (extent) {
                        var bl = this.toWGS84(extent.left, extent.bottom);
                        var tr = this.toWGS84(extent.right, extent.top);
                        return { minLon: bl.lon, minLat: bl.lat, maxLon: tr.lon, maxLat: tr.lat };
                    }
                }
            } catch (e) {}
            return null;
        }
    };

    // ============ AREA SCANNER ============
    var AreaScanner = {
        delay: function(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); },
        waitForResume: function() {
            return new Promise(function(resolve) {
                var check = function() {
                    if (!scanState.isPaused || !scanState.isScanning) resolve();
                    else setTimeout(check, 500);
                };
                check();
            });
        },
        centerMapToTile: function(tile) {
            return new Promise(function(resolve) {
                try {
                    if (W && W.map) {
                        var center = CoordUtils.toWebMercator(tile.centerLon, tile.centerLat);
                        W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));
                    }
                } catch (e) {}
                setTimeout(resolve, 800);
            });
        },
        waitForDataLoad: function() {
            return new Promise(function(resolve) {
                var attempts = 0;
                var check = function() {
                    attempts++;
                    if (attempts >= 20) { resolve(); return; }
                    if (W && W.model && W.model.segments) {
                        var segs = W.model.segments.getObjectArray();
                        if (segs && segs.length > 0) { resolve(); return; }
                    }
                    setTimeout(check, 200);
                };
                check();
            });
        },
        getCityFromSegment: function(segment) {
            try {
                var streetID = segment.attributes.primaryStreetID;
                if (streetID && W.model.streets) {
                    var street = W.model.streets.getObjectById(streetID);
                    if (street && street.attributes) {
                        var cityID = street.attributes.cityID;
                        if (cityID && W.model.cities) {
                            var city = W.model.cities.getObjectById(cityID);
                            if (city && city.attributes && city.attributes.name) return city.attributes.name;
                        }
                    }
                }
            } catch (e) {}
            return 'Unbekannt';
        },
        checkSegmentsInView: function(options) {
            var self = this;
            try {
                if (!W || !W.model || !W.model.segments) return;
                var segments = W.model.segments.getObjectArray();
                var today = new Date();
                var ageFilterDays = options.ageFilterDays || 180;
                var userRank = W.loginManager && W.loginManager.user ? W.loginManager.user.attributes.rank : 0;

                segments.forEach(function(segment) {
                    if (!segment || !segment.attributes) return;
                    var attrs = segment.attributes;
                    if (options.onlyEditable) {
                        // Prüfe ob Segment editierbar ist
                        if (segment.isAllowed && typeof segment.isAllowed === 'function') {
                            if (!segment.isAllowed(segment.PERMISSIONS.EDIT_GEOMETRY)) return;
                        } else if (segment.canEdit && typeof segment.canEdit === 'function') {
                            if (!segment.canEdit()) return;
                        } else {
                            // Fallback: Manuelle Prüfung
                            var lockRank = attrs.lockRank !== undefined ? attrs.lockRank : (attrs.lock || 0);
                            if (userRank < lockRank) return;

                            if (W.model.isEditableByUser && typeof W.model.isEditableByUser === 'function') {
                                if (!W.model.isEditableByUser(segment)) return;
                            }
                        }
                    }
                    if (options.roadTypeFilterEnabled && options.selectedRoadTypes.length > 0) {
                        if (options.selectedRoadTypes.indexOf(attrs.roadType) === -1) return;
                    }
                    var updatedBy = attrs.updatedBy || attrs.createdBy;
                    if (!updatedBy) return;
                    if (options.levelFilterEnabled) {
                        try {
                            var user = W.model.users.getObjectById(parseInt(updatedBy));
                            if (!user || !user.attributes) return;
                            if (user.attributes.rank !== options.selectedInternalLevel) return;
                        } catch (e) { return; }
                    }
                    var editDate = attrs.updatedOn || attrs.createdOn;
                    var editDays = editDate ? (today.getTime() - editDate) / 86400000 : 9999;
                    scanState.segmentsFound++;
                    var isOld = editDays >= ageFilterDays;
                    if (isOld) {
                        scanState.oldSegmentsFound++;
                        var cityName = self.getCityFromSegment(segment);
                        if (!scanState.cityStats.has(cityName)) {
                            scanState.cityStats.set(cityName, { name: cityName, oldSegments: 0, segments: [] });
                        }
                        var cityData = scanState.cityStats.get(cityName);
                        cityData.oldSegments++;
                        cityData.segments.push({ segmentId: attrs.id, editDays: Math.floor(editDays), roadType: attrs.roadType });
                        try {
                            var line = W.userscripts.getFeatureElementByDataModel(segment);
                            if (line) {
                                line.setAttribute("stroke", HIGHLIGHT_RED);
                                line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                                line.setAttribute("stroke-width", 10);
                                line.setAttribute("stroke-dasharray", "10,5");
                                highlightedSegmentIds.push(attrs.id);
                            }
                        } catch (e) {}
                    }
                });
            } catch (e) {}
        },
        startScan: async function(bounds, options) {
            scanState.isScanning = true;
            scanState.isPaused = false;
            scanState.currentTile = 0;
            scanState.segmentsFound = 0;
            scanState.oldSegmentsFound = 0;
            scanState.results = [];
            scanState.cityStats = new Map();
            resetAllHighlights();
            scanState.scanner = new GridScanner(bounds, options.tileSize || 500);
            scanState.totalTiles = scanState.scanner.tiles.length;
            log('Starte Scan über ' + scanState.totalTiles + ' Bereiche...', 'info');
            updateScanUI();
            while (scanState.scanner.hasNext() && scanState.isScanning) {
                if (scanState.isPaused) await this.waitForResume();
                var tile = scanState.scanner.next();
                scanState.currentTile = scanState.scanner.currentIndex;
                await this.centerMapToTile(tile);
                await this.waitForDataLoad();
                this.checkSegmentsInView(options);
                updateScanUI();
                await this.delay(300);
            }
            if (scanState.isScanning) {
                scanState.isScanning = false;
                this.generateCityStatistics();
                log('Scan abgeschlossen! ' + scanState.segmentsFound + ' Segmente geprüft.', 'success');
                log('Überaltert: ' + scanState.oldSegmentsFound + ' in ' + scanState.cityStats.size + ' Städten', 'info');
                updateScanUI();
                renderCityStatistics();
            }
        },
        generateCityStatistics: function() {
            scanState.results = Array.from(scanState.cityStats.values()).sort(function(a, b) { return b.oldSegments - a.oldSegments; });
        },
        stopScan: function() { scanState.isScanning = false; scanState.isPaused = false; log('Scan gestoppt', 'warning'); updateScanUI(); },
        pauseScan: function() { scanState.isPaused = true; log('Scan pausiert', 'warning'); updateScanUI(); },
        resumeScan: function() { scanState.isPaused = false; log('Scan fortgesetzt', 'info'); updateScanUI(); }
    };

    // ============ LOGGING ============
    function log(message, type) {
        var logEl = getId('_ageFilterLog');
        if (!logEl) return;
        var time = new Date().toLocaleTimeString();
        var color = type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : type === 'success' ? '#4caf50' : '#2196f3';
        var entry = document.createElement('div');
        entry.style.color = color;
        entry.style.marginBottom = '2px';
        entry.textContent = '[' + time + '] ' + message;
        logEl.insertBefore(entry, logEl.firstChild);
        while (logEl.children.length > 50) logEl.removeChild(logEl.lastChild);
    }

    // ============ SCAN UI UPDATE ============
    function updateScanUI() {
        var progressEl = getId('_scanProgress');
        var statusEl = getId('_scanStatus');
        var controlsEl = getId('_scanControls');

        if (progressEl) {
            if (scanState.isScanning) {
                var percent = scanState.totalTiles > 0 ? Math.round((scanState.currentTile / scanState.totalTiles) * 100) : 0;
                progressEl.innerHTML = '<div style="background:#e0e0e0;border-radius:3px;height:16px;overflow:hidden;">' +
                    '<div style="background:#4CAF50;height:100%;width:' + percent + '%;transition:width 0.3s;"></div></div>' +
                    '<div style="font-size:9px;margin-top:2px;">' + scanState.currentTile + ' / ' + scanState.totalTiles + ' (' + percent + '%)</div>';
            } else {
                progressEl.innerHTML = '';
            }
        }

        if (statusEl) {
            if (scanState.isScanning) {
                var statusText = scanState.isPaused ? '⏸️ Pausiert' : '🔄 Scanne...';
                if (scanState.currentBundesland) {
                    statusText += ' - ' + scanState.currentBundesland;
                }
                statusEl.innerHTML = '<span style="color:#2196F3;">' + statusText + '</span>' +
                    '<br><span style="font-size:9px;">Gefunden: ' + scanState.segmentsFound + ' | Alt: ' + scanState.oldSegmentsFound + '</span>';
            } else {
                statusEl.innerHTML = '<span style="color:#666;">Bereit</span>';
            }
        }

        if (controlsEl) {
            if (scanState.isScanning) {
                controlsEl.innerHTML =
                    '<button id="_btnPauseScan" style="background:#ff9800;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;font-size:9px;margin-right:4px;">' +
                    (scanState.isPaused ? '▶️ Weiter' : '⏸️ Pause') + '</button>' +
                    '<button id="_btnStopScan" style="background:#f44336;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;font-size:9px;">⏹️ Stop</button>';

                var pauseBtn = getId('_btnPauseScan');
                var stopBtn = getId('_btnStopScan');
                if (pauseBtn) pauseBtn.onclick = function() {
                    if (scanState.isPaused) AreaScanner.resumeScan();
                    else AreaScanner.pauseScan();
                };
                if (stopBtn) stopBtn.onclick = function() { AreaScanner.stopScan(); };
            } else {
                controlsEl.innerHTML = '';
            }
        }
    }

    function renderCityStatistics() {
        var el = getId('_cityStatistics');
        if (!el) return;

        if (scanState.results.length === 0) {
            el.innerHTML = '<div style="color:#666;font-style:italic;font-size:9px;">Keine Ergebnisse</div>';
            return;
        }

        var html = '<div style="background:#fff3e0;padding:6px;border-radius:3px;border-left:3px solid #ff9800;font-size:10px;">';
        html += '<div style="font-weight:bold;margin-bottom:6px;color:#e65100;">🏙️ Scan-Ergebnisse</div>';
        html += '<div style="max-height:200px;overflow-y:auto;">';
        html += '<table style="width:100%;border-collapse:collapse;font-size:9px;">';
        html += '<tr style="background:#ffe0b2;"><th style="padding:3px;text-align:left;">#</th><th style="padding:3px;text-align:left;">Stadt</th><th style="padding:3px;text-align:right;">Alt</th></tr>';

        for (var i = 0; i < Math.min(30, scanState.results.length); i++) {
            var city = scanState.results[i];
            var urgencyColor = city.oldSegments > 20 ? '#f44336' : city.oldSegments > 10 ? '#ff9800' : '#4caf50';
            var bg = i % 2 === 0 ? '#fff' : '#fff8e1';
            html += '<tr style="background:' + bg + ';">';
            html += '<td style="padding:2px 3px;">' + (i + 1) + '</td>';
            html += '<td style="padding:2px 3px;">' + city.name + '</td>';
            html += '<td style="padding:2px 3px;text-align:right;color:' + urgencyColor + ';font-weight:bold;">' + city.oldSegments + '</td>';
            html += '</tr>';
        }

        html += '</table></div>';

        if (scanState.results.length > 30) {
            html += '<div style="font-size:8px;color:#666;margin-top:4px;">... und ' + (scanState.results.length - 30) + ' weitere</div>';
        }

        var totalOld = scanState.results.reduce(function(sum, c) { return sum + c.oldSegments; }, 0);
        html += '<div style="margin-top:6px;padding-top:4px;border-top:1px solid #ffcc80;font-size:9px;">';
        html += '<strong>Gesamt:</strong> ' + totalOld + ' überalterte Segmente in ' + scanState.results.length + ' Städten';
        html += '</div></div>';

        el.innerHTML = html;
    }

    // ============ AUTO-SCROLL SCANNER ============
    var AutoScrollScanner = {
        isRunning: false,
        direction: 0, // 0=rechts, 1=unten, 2=links, 3=oben
        stepCount: 0,
        maxSteps: 100,
        scrollDistance: 0.8, // 80% des Viewports

        start: async function(options) {
            this.isRunning = true;
            this.stepCount = 0;
            this.direction = 0;
            scanState.isScanning = true;
            scanState.isPaused = false;
            scanState.segmentsFound = 0;
            scanState.oldSegmentsFound = 0;
            scanState.results = [];
            scanState.cityStats = new Map();
            resetAllHighlights();

            var maxStepsInput = getId('_autoScrollSteps');
            this.maxSteps = maxStepsInput ? parseInt(maxStepsInput.value) || 50 : 50;

            log('Auto-Scroll gestartet (' + this.maxSteps + ' Schritte)', 'info');
            updateScanUI();

            while (this.isRunning && this.stepCount < this.maxSteps && scanState.isScanning) {
                if (scanState.isPaused) {
                    await AreaScanner.waitForResume();
                }

                // Aktuelle Position scannen
                await AreaScanner.waitForDataLoad();
                AreaScanner.checkSegmentsInView(options);

                scanState.currentTile = this.stepCount;
                scanState.totalTiles = this.maxSteps;
                updateScanUI();

                // Zur nächsten Position scrollen
                this.scrollToNext();
                this.stepCount++;

                await AreaScanner.delay(1000);
            }

            this.isRunning = false;
            scanState.isScanning = false;
            AreaScanner.generateCityStatistics();
            log('Auto-Scroll beendet! ' + scanState.segmentsFound + ' Segmente geprüft.', 'success');
            log('Überaltert: ' + scanState.oldSegmentsFound + ' in ' + scanState.cityStats.size + ' Städten', 'info');
            updateScanUI();
            renderCityStatistics();
        },

        scrollToNext: function() {
            try {
                if (!W || !W.map) return;

                var extent = W.map.getExtent();
                var width = extent.right - extent.left;
                var height = extent.top - extent.bottom;
                var center = W.map.getCenter();

                var newX = center.lon;
                var newY = center.lat;

                // Spiralmuster: rechts, unten, links, oben
                switch (this.direction) {
                    case 0: newX += width * this.scrollDistance; break; // rechts
                    case 1: newY -= height * this.scrollDistance; break; // unten
                    case 2: newX -= width * this.scrollDistance; break; // links
                    case 3: newY += height * this.scrollDistance; break; // oben
                }

                // Richtung wechseln alle paar Schritte (Spirale)
                if (this.stepCount % 3 === 2) {
                    this.direction = (this.direction + 1) % 4;
                }

                W.map.setCenter(new OpenLayers.LonLat(newX, newY));
            } catch (e) {
                console.error(SCRIPT_NAME + ": Scroll-Fehler:", e);
            }
        },

        stop: function() {
            this.isRunning = false;
            scanState.isScanning = false;
            log('Auto-Scroll gestoppt', 'warning');
            updateScanUI();
        }
    };

    // ============ BUNDESLAND SCANNER ============
    var BundeslandScanner = {
        currentBundesland: null,

        start: async function(bundeslandKey, options) {
            var bundesland = BUNDESLAENDER[bundeslandKey];
            if (!bundesland) {
                log('Bundesland nicht gefunden: ' + bundeslandKey, 'error');
                return;
            }

            this.currentBundesland = bundesland.name;
            scanState.currentBundesland = bundesland.name;

            log('Starte Scan für ' + bundesland.name + '...', 'info');

            // Berechne geschätzte Tile-Anzahl
            var bounds = bundesland.bounds;
            var latDelta = (options.tileSize || 500) / 111320;
            var lonDelta = (options.tileSize || 500) / (111320 * Math.cos((bounds.minLat + bounds.maxLat) / 2 * Math.PI / 180));
            var tilesX = Math.ceil((bounds.maxLon - bounds.minLon) / lonDelta);
            var tilesY = Math.ceil((bounds.maxLat - bounds.minLat) / latDelta);
            var totalTiles = tilesX * tilesY;

            log(bundesland.name + ': ~' + totalTiles + ' Bereiche zu scannen', 'info');

            // Navigiere zuerst zum Bundesland
            var centerLon = (bounds.minLon + bounds.maxLon) / 2;
            var centerLat = (bounds.minLat + bounds.maxLat) / 2;
            var center = CoordUtils.toWebMercator(centerLon, centerLat);
            W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));

            await AreaScanner.delay(1500);

            // Starte den Grid-Scan
            await AreaScanner.startScan(bounds, options);

            scanState.currentBundesland = null;
            this.currentBundesland = null;
        },

        startAll: async function(options) {
            var keys = Object.keys(BUNDESLAENDER);
            log('Starte Scan aller ' + keys.length + ' Bundesländer...', 'info');

            for (var i = 0; i < keys.length; i++) {
                if (!scanState.isScanning && i > 0) {
                    log('Scan abgebrochen', 'warning');
                    break;
                }

                var key = keys[i];
                log('(' + (i + 1) + '/' + keys.length + ') ' + BUNDESLAENDER[key].name, 'info');
                await this.start(key, options);

                if (i < keys.length - 1) {
                    await AreaScanner.delay(2000);
                }
            }

            log('Alle Bundesländer gescannt!', 'success');
        },

        // Regierungsbezirk scannen
        startRegion: async function(regionKey, options) {
            var region = REGIERUNGSBEZIRKE[regionKey];
            if (!region) {
                log('Region nicht gefunden: ' + regionKey, 'error');
                return;
            }

            scanState.currentBundesland = region.name;

            log('Starte Scan für ' + region.name + '...', 'info');

            var bounds = region.bounds;
            var latDelta = (options.tileSize || 500) / 111320;
            var lonDelta = (options.tileSize || 500) / (111320 * Math.cos((bounds.minLat + bounds.maxLat) / 2 * Math.PI / 180));
            var tilesX = Math.ceil((bounds.maxLon - bounds.minLon) / lonDelta);
            var tilesY = Math.ceil((bounds.maxLat - bounds.minLat) / latDelta);
            var totalTiles = tilesX * tilesY;
            var estimatedMinutes = Math.round(totalTiles * 1.3 / 60); // ~1.3 Sek pro Tile

            log(region.name + ': ~' + totalTiles + ' Bereiche (~' + estimatedMinutes + ' Min)', 'info');

            // Navigiere zur Region
            var centerLon = (bounds.minLon + bounds.maxLon) / 2;
            var centerLat = (bounds.minLat + bounds.maxLat) / 2;
            var center = CoordUtils.toWebMercator(centerLon, centerLat);
            W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));

            await AreaScanner.delay(1500);
            await AreaScanner.startScan(bounds, options);

            scanState.currentBundesland = null;
        }
    };

    // ============ RADIUS SCANNER ============
    var RadiusScanner = {
        start: async function(radiusKm, options) {
            // Hole aktuelle Kartenposition
            var currentBounds = CoordUtils.getCurrentBounds();
            if (!currentBounds) {
                log('Konnte aktuelle Position nicht ermitteln', 'error');
                return;
            }

            var centerLon = (currentBounds.minLon + currentBounds.maxLon) / 2;
            var centerLat = (currentBounds.minLat + currentBounds.maxLat) / 2;

            // Berechne Bounds für den Radius
            // 1 Grad Lat ≈ 111.32 km
            // 1 Grad Lon ≈ 111.32 * cos(lat) km
            var latDelta = radiusKm / 111.32;
            var lonDelta = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));

            var bounds = {
                minLon: centerLon - lonDelta,
                maxLon: centerLon + lonDelta,
                minLat: centerLat - latDelta,
                maxLat: centerLat + latDelta
            };

            // Berechne geschätzte Scan-Zeit
            var tileSize = options.tileSize || 500;
            var tileDeltaLat = tileSize / 111320;
            var tileDeltaLon = tileSize / (111320 * Math.cos(centerLat * Math.PI / 180));
            var tilesX = Math.ceil((bounds.maxLon - bounds.minLon) / tileDeltaLon);
            var tilesY = Math.ceil((bounds.maxLat - bounds.minLat) / tileDeltaLat);
            var totalTiles = tilesX * tilesY;
            var estimatedMinutes = Math.round(totalTiles * 1.3 / 60);

            scanState.currentBundesland = radiusKm + 'km Radius';

            log('Radius-Scan: ' + radiusKm + 'km um aktuelle Position', 'info');
            log('~' + totalTiles + ' Bereiche (~' + estimatedMinutes + ' Min)', 'info');

            await AreaScanner.startScan(bounds, options);

            scanState.currentBundesland = null;
        }
    };


    // ============ HELPER FUNCTIONS ============
    function getId(id) { return document.getElementById(id); }
    function saveToLocalStorage(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
    function loadFromLocalStorage(key, def) { try { var v = localStorage.getItem(key); return v !== null ? v : def; } catch (e) { return def; } }

    function getColorMode() {
        var g = getId('_rbHilightGreen'), b = getId('_rbHilightBlue'), c = getId('_rbHilightCustom');
        if (g && g.checked) return 'green';
        if (b && b.checked) return 'blue';
        if (c && c.checked) return 'custom';
        return 'green';
    }

    function getHighlightColor(mode, custom) {
        if (mode === 'green') return HIGHLIGHT_GREEN;
        if (mode === 'blue') return HIGHLIGHT_BLUE;
        if (mode === 'custom') return custom;
        return HIGHLIGHT_GREEN;
    }

    function getSelectedRoadTypes() {
        var types = [];
        for (var rt in ROAD_TYPES) {
            var cb = getId('_cbRoadType' + rt);
            if (cb && cb.checked) types.push(parseInt(rt));
        }
        return types;
    }

    // Zentrale Funktion um alle Filter-Optionen zu sammeln
    function getFilterOptions() {
        var selectedLevel = getId('_selectEditorLevel');
        var daysInput = getId('_txtDaysOld');
        var customColorPicker = getId('_customColorPicker');
        var ageFilterInput = getId('_txtAgeFilter');
        var levelFilterCb = getId('_cbLevelFilter');
        var roadTypeFilterCb = getId('_cbRoadTypeFilter');
        var onlyEditableCb = getId('_cbOnlyEditable');
        var tileSizeInput = getId('_tileSizeInput');

        return {
            selectedDisplayLevel: selectedLevel ? parseInt(selectedLevel.value) || 1 : 1,
            selectedInternalLevel: selectedLevel ? parseInt(selectedLevel.value) - 1 : 0,
            daysOld: daysInput ? parseInt(daysInput.value) || 30 : 30,
            colorMode: getColorMode(),
            customColor: customColorPicker ? customColorPicker.value : HIGHLIGHT_GREEN,
            ageFilterDays: ageFilterInput ? parseInt(ageFilterInput.value) || 180 : 180,
            levelFilterEnabled: levelFilterCb ? levelFilterCb.checked : false,
            roadTypeFilterEnabled: roadTypeFilterCb ? roadTypeFilterCb.checked : false,
            selectedRoadTypes: getSelectedRoadTypes(),
            onlyEditable: onlyEditableCb ? onlyEditableCb.checked : false,
            tileSize: tileSizeInput ? parseInt(tileSizeInput.value) || 500 : 500
        };
    }

    function saveFilterOptions() {
        var opts = getFilterOptions();
        saveToLocalStorage(STORAGE_KEYS.selectedLevel, opts.selectedDisplayLevel.toString());
        saveToLocalStorage(STORAGE_KEYS.daysOld, opts.daysOld.toString());
        saveToLocalStorage(STORAGE_KEYS.colorMode, opts.colorMode);
        saveToLocalStorage(STORAGE_KEYS.customColor, opts.customColor);
        saveToLocalStorage(STORAGE_KEYS.ageFilterDays, opts.ageFilterDays.toString());
        saveToLocalStorage(STORAGE_KEYS.levelFilterEnabled, opts.levelFilterEnabled.toString());
        saveToLocalStorage(STORAGE_KEYS.roadTypeFilterEnabled, opts.roadTypeFilterEnabled.toString());
        saveToLocalStorage(STORAGE_KEYS.selectedRoadTypes, JSON.stringify(opts.selectedRoadTypes));
        saveToLocalStorage(STORAGE_KEYS.tileSize, opts.tileSize.toString());
    }

    function toggleAutoRefresh() {
        var cb = getId('_cbAutoRefresh');
        if (!cb) return;
        autoRefreshEnabled = cb.checked;
        saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshEnabled.toString());
        if (autoRefreshEnabled) {
            autoRefreshInterval = setInterval(runHighlighter, 5000);
            var btn = getId('_btnRunHighlighter');
            if (btn) { btn.style.background = "#FF9800"; btn.textContent = "AUTO"; }
        } else {
            if (autoRefreshInterval) { clearInterval(autoRefreshInterval); autoRefreshInterval = null; }
            var btn = getId('_btnRunHighlighter');
            if (btn) { btn.style.background = "#4CAF50"; btn.textContent = "RUN"; }
        }
    }

    // ============ UI UPDATE FUNCTIONS ============
    function updateCustomColorVisibility() {
        var custom = getId('_rbHilightCustom'), picker = getId('_customColorPicker');
        if (custom && picker) picker.style.display = custom.checked ? 'inline-block' : 'none';
    }

    function updateRoadTypeVisibility() {
        var cb = getId('_cbRoadTypeFilter'), cont = getId('_roadTypeContainer');
        if (cb && cont) cont.style.display = cb.checked ? 'block' : 'none';
    }

    function updateLevelVisibility() {
        var cb = getId('_cbLevelFilter'), cont = getId('_levelContainer');
        if (cb && cont) cont.style.display = cb.checked ? 'block' : 'none';
    }

    // ============ HIGHLIGHT FUNCTIONS ============
    function resetAllHighlights() {
        if (!W || !W.model || !W.model.segments) return;
        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            try {
                var line = W.userscripts.getFeatureElementByDataModel(segment);
                if (line) {
                    line.removeAttribute("stroke");
                    line.removeAttribute("stroke-opacity");
                    line.removeAttribute("stroke-width");
                    line.removeAttribute("stroke-dasharray");
                }
            } catch (e) {}
        }
        highlightedSegmentIds = [];
        foundSegmentsList = [];
        cityStats.clear();
        updateEditorsDisplay();
    }

    function selectSegmentById(segmentId) {
        if (!W || !W.model || !W.model.segments || !W.selectionManager) return;
        try {
            var segment = W.model.segments.getObjectById(segmentId);
            if (segment) {
                W.selectionManager.unselectAll();
                W.selectionManager.setSelectedModels([segment]);
                setTimeout(function() {
                    try {
                        if (segment.getOLGeometry) {
                            var geom = segment.getOLGeometry();
                            if (geom && geom.getExtent) {
                                var ext = geom.getExtent();
                                var olMap = W.map.getOLMap();
                                if (olMap && olMap.getView) olMap.getView().fit(ext, { padding: [100,100,100,100], maxZoom: 6, duration: 500 });
                            }
                        }
                    } catch (e) {}
                }, 100);
            }
        } catch (e) {}
    }

    function selectSegmentsByEditor(editorName) {
        if (!W || !W.model || !W.model.segments || !W.selectionManager) return;
        try {
            var editorSegs = foundSegmentsList.filter(function(s) { return s.editorName === editorName; });
            if (editorSegs.length === 0) return;
            W.selectionManager.unselectAll();
            var segs = [];
            editorSegs.forEach(function(s) {
                var seg = W.model.segments.getObjectById(s.segmentId);
                if (seg) segs.push(seg);
            });
            if (segs.length > 0) W.selectionManager.setSelectedModels(segs);
        } catch (e) {}
    }

    function selectHighlightedSegments() {
        if (!W || !W.model || !W.model.segments || !W.selectionManager) return;
        if (highlightedSegmentIds.length === 0) return;
        try {
            W.selectionManager.unselectAll();
            var segs = [];
            highlightedSegmentIds.forEach(function(id) {
                var seg = W.model.segments.getObjectById(id);
                if (seg) segs.push(seg);
            });
            if (segs.length > 0) W.selectionManager.setSelectedModels(segs);
        } catch (e) {}
    }

    // ============ CITY HELPER ============
    function getCityFromSegment(segment) {
        try {
            var streetID = segment.attributes.primaryStreetID;
            if (streetID && W.model.streets) {
                var street = W.model.streets.getObjectById(streetID);
                if (street && street.attributes) {
                    var cityID = street.attributes.cityID;
                    if (cityID && W.model.cities) {
                        var city = W.model.cities.getObjectById(cityID);
                        if (city && city.attributes && city.attributes.name) {
                            return city.attributes.name;
                        }
                    }
                }
            }
        } catch (e) {}
        return 'Unbekannt';
    }

    // ============ STATISTICS ============
    var cityStats = new Map(); // Globale Städte-Statistik

    function calculateAgeStatistics(segments) {
        var stats = { totalSegments: segments.length, ageGroups: { '0-30': 0, '31-90': 0, '91-180': 0, '181-365': 0, '366-730': 0, '730+': 0 }, oldSegments: 0, averageAge: 0 };
        var totalAge = 0, today = new Date();
        segments.forEach(function(seg) {
            var editDate = new Date(seg.editDate);
            var daysAgo = Math.floor((today.getTime() - editDate.getTime()) / 86400000);
            totalAge += daysAgo;
            if (seg.isOld) stats.oldSegments++;
            if (daysAgo <= 30) stats.ageGroups['0-30']++;
            else if (daysAgo <= 90) stats.ageGroups['31-90']++;
            else if (daysAgo <= 180) stats.ageGroups['91-180']++;
            else if (daysAgo <= 365) stats.ageGroups['181-365']++;
            else if (daysAgo <= 730) stats.ageGroups['366-730']++;
            else stats.ageGroups['730+']++;
        });
        stats.averageAge = segments.length > 0 ? Math.round(totalAge / segments.length) : 0;
        return stats;
    }

    function updateAgeStatisticsDisplay() {
        var el = getId('_ageStatisticsDisplay');
        if (!el || foundSegmentsList.length === 0) return;
        var stats = calculateAgeStatistics(foundSegmentsList);
        var html = '<div style="background:#f0f8ff;padding:6px;border-radius:3px;margin-top:8px;border-left:3px solid #2196F3;font-size:10px;">';
        html += '<div style="font-weight:bold;margin-bottom:4px;color:#1976D2;">📊 Alters-Statistik</div>';
        html += '<div style="margin-bottom:4px;"><strong>Durchschnitt:</strong> ' + stats.averageAge + ' Tage</div>';
        if (stats.oldSegments > 0) html += '<div style="margin-bottom:4px;color:#d32f2f;"><strong>⚠️ Überaltert:</strong> ' + stats.oldSegments + ' Segmente</div>';
        html += '<div style="font-size:9px;color:#666;">';
        html += '0-30d: ' + stats.ageGroups['0-30'] + ' | 31-90d: ' + stats.ageGroups['31-90'] + ' | 91-180d: ' + stats.ageGroups['91-180'] + '<br>';
        html += '181-365d: ' + stats.ageGroups['181-365'] + ' | 1-2J: ' + stats.ageGroups['366-730'] + ' | 2J+: ' + stats.ageGroups['730+'];
        html += '</div></div>';
        el.innerHTML = html;
    }

    function updateCityStatisticsDisplay() {
        var el = getId('_cityStatisticsDisplay');
        if (!el) return;

        if (cityStats.size === 0) {
            el.innerHTML = '<div style="color:#666;font-style:italic;font-size:9px;">Keine Städte-Daten</div>';
            return;
        }

        // Sortiere nach Anzahl überalterter Segmente
        var sortedCities = Array.from(cityStats.values())
            .filter(function(c) { return c.oldSegments > 0; })
            .sort(function(a, b) { return b.oldSegments - a.oldSegments; });

        if (sortedCities.length === 0) {
            el.innerHTML = '<div style="color:#4caf50;font-size:9px;">✅ Keine überalterten Segmente gefunden!</div>';
            return;
        }

        var html = '<div style="background:#fff3e0;padding:6px;border-radius:3px;margin-top:8px;border-left:3px solid #ff9800;font-size:10px;">';
        html += '<div style="font-weight:bold;margin-bottom:6px;color:#e65100;">🏙️ Städte-Ranking (Überaltert)</div>';
        html += '<div style="max-height:150px;overflow-y:auto;">';
        html += '<table style="width:100%;border-collapse:collapse;font-size:9px;">';
        html += '<tr style="background:#ffe0b2;"><th style="padding:3px;text-align:left;">#</th><th style="padding:3px;text-align:left;">Stadt</th><th style="padding:3px;text-align:right;">Alt</th><th style="padding:3px;text-align:right;">Gesamt</th></tr>';

        for (var i = 0; i < Math.min(20, sortedCities.length); i++) {
            var city = sortedCities[i];
            var urgencyColor = city.oldSegments > 20 ? '#f44336' : city.oldSegments > 10 ? '#ff9800' : '#4caf50';
            var bg = i % 2 === 0 ? '#fff' : '#fff8e1';
            html += '<tr style="background:' + bg + ';">';
            html += '<td style="padding:2px 3px;">' + (i + 1) + '</td>';
            html += '<td style="padding:2px 3px;cursor:pointer;color:#1976d2;text-decoration:underline;" onclick="window._selectCitySegments(\'' + city.name.replace(/'/g, "\\'") + '\')">' + city.name + '</td>';
            html += '<td style="padding:2px 3px;text-align:right;color:' + urgencyColor + ';font-weight:bold;">' + city.oldSegments + '</td>';
            html += '<td style="padding:2px 3px;text-align:right;color:#666;">' + city.totalSegments + '</td>';
            html += '</tr>';
        }

        html += '</table></div>';

        if (sortedCities.length > 20) {
            html += '<div style="font-size:8px;color:#666;margin-top:4px;">... und ' + (sortedCities.length - 20) + ' weitere Städte</div>';
        }

        var totalOld = sortedCities.reduce(function(sum, c) { return sum + c.oldSegments; }, 0);
        html += '<div style="margin-top:6px;padding-top:4px;border-top:1px solid #ffcc80;font-size:9px;">';
        html += '<strong>Gesamt:</strong> ' + totalOld + ' überalterte Segmente in ' + sortedCities.length + ' Städten';
        html += '</div></div>';

        el.innerHTML = html;
    }

    // ============ TOP EDITOREN STATISTIK ============
    function updateTopEditorsDisplay() {
        var el = getId('_topEditorsDisplay');
        if (!el) return;

        if (foundSegmentsList.length === 0) {
            el.innerHTML = '';
            return;
        }

        // Gruppiere nach Editor und zaehle
        var editorStats = {};
        foundSegmentsList.forEach(function(seg) {
            var name = seg.editorName;
            if (!editorStats[name]) {
                editorStats[name] = { 
                    name: name, 
                    level: seg.editorLevel,
                    total: 0, 
                    old: 0,
                    segments: []
                };
            }
            editorStats[name].total++;
            if (seg.isOld) editorStats[name].old++;
            editorStats[name].segments.push(seg);
        });

        // Sortiere nach Anzahl ueberalterter Segmente
        var sortedEditors = Object.values(editorStats)
            .sort(function(a, b) { return b.old - a.old || b.total - a.total; });

        if (sortedEditors.length === 0) {
            el.innerHTML = '';
            return;
        }

        var html = '<div style="background:#e8eaf6;padding:6px;border-radius:3px;margin-top:8px;border-left:3px solid #3f51b5;font-size:10px;">';
        html += '<div style="font-weight:bold;margin-bottom:6px;color:#283593;">Top Editoren</div>';
        html += '<div style="max-height:120px;overflow-y:auto;">';
        html += '<table style="width:100%;border-collapse:collapse;font-size:9px;">';
        html += '<tr style="background:#c5cae9;"><th style="padding:3px;text-align:left;">#</th><th style="padding:3px;text-align:left;">Editor</th><th style="padding:3px;text-align:center;">Lvl</th><th style="padding:3px;text-align:right;">Alt</th><th style="padding:3px;text-align:right;">Ges</th></tr>';

        for (var i = 0; i < Math.min(15, sortedEditors.length); i++) {
            var editor = sortedEditors[i];
            var oldColor = editor.old > 10 ? '#f44336' : editor.old > 5 ? '#ff9800' : '#4caf50';
            var bg = i % 2 === 0 ? '#fff' : '#e8eaf6';
            html += '<tr style="background:' + bg + ';">';
            html += '<td style="padding:2px 3px;">' + (i + 1) + '</td>';
            html += '<td style="padding:2px 3px;cursor:pointer;color:#1976d2;text-decoration:underline;" onclick="window._selectEditorSegments(\'' + editor.name.replace(/'/g, "\\'") + '\')">' + editor.name + '</td>';
            html += '<td style="padding:2px 3px;text-align:center;color:#666;">L' + editor.level + '</td>';
            html += '<td style="padding:2px 3px;text-align:right;color:' + oldColor + ';font-weight:bold;">' + editor.old + '</td>';
            html += '<td style="padding:2px 3px;text-align:right;color:#666;">' + editor.total + '</td>';
            html += '</tr>';
        }

        html += '</table></div>';

        if (sortedEditors.length > 15) {
            html += '<div style="font-size:8px;color:#666;margin-top:4px;">... und ' + (sortedEditors.length - 15) + ' weitere Editoren</div>';
        }

        html += '</div>';
        el.innerHTML = html;
    }

    // Globale Funktion fuer Klick auf Editor
    window._selectEditorSegments = function(editorName) {
        if (!W || !W.model || !W.model.segments || !W.selectionManager) return;
        var editorSegs = foundSegmentsList.filter(function(s) { return s.editorName === editorName; });
        if (editorSegs.length === 0) return;
        
        try {
            W.selectionManager.unselectAll();
            var segs = [];
            editorSegs.forEach(function(s) {
                var seg = W.model.segments.getObjectById(s.segmentId);
                if (seg) segs.push(seg);
            });
            if (segs.length > 0) {
                W.selectionManager.setSelectedModels(segs);
                if (segs[0] && segs[0].geometry) {
                    var center = segs[0].geometry.getCentroid();
                    W.map.setCenter(center);
                }
            }
        } catch (e) {}
    };

    // Globale Funktion fuer Klick auf Stadt
    window._selectCitySegments = function(cityName) {
        if (!W || !W.model || !W.model.segments || !W.selectionManager) return;
        var cityData = cityStats.get(cityName);
        if (!cityData || !cityData.segmentIds) return;

        try {
            W.selectionManager.unselectAll();
            var segs = [];
            cityData.segmentIds.forEach(function(id) {
                var seg = W.model.segments.getObjectById(id);
                if (seg) segs.push(seg);
            });
            if (segs.length > 0) {
                W.selectionManager.setSelectedModels(segs);
                // Zoom zum ersten Segment
                if (segs[0] && segs[0].geometry) {
                    var center = segs[0].geometry.getCentroid();
                    W.map.setCenter(center);
                }
            }
        } catch (e) {}
    };

    function updateEditorsDisplay() {
        var el = getId('_editorsDisplay');
        if (!el) return;
        while (el.firstChild) el.removeChild(el.firstChild);
        if (foundSegmentsList.length === 0) return;
        var groups = {};
        foundSegmentsList.forEach(function(s) {
            if (!groups[s.editorName]) groups[s.editorName] = [];
            groups[s.editorName].push(s);
        });
        var cont = document.createElement('div');
        cont.style.cssText = 'max-height:150px;overflow-y:auto;border:1px solid #ddd;padding:6px;background:#f9f9f9;border-radius:3px;margin-bottom:8px;font-size:10px;';
        Object.keys(groups).forEach(function(name) {
            var segs = groups[name];
            var div = document.createElement('div');
            div.style.marginBottom = '6px';
            var nameSpan = document.createElement('span');
            nameSpan.style.cssText = 'color:#2196F3;cursor:pointer;text-decoration:underline;font-weight:bold;';
            nameSpan.textContent = name;
            nameSpan.onclick = function() { selectSegmentsByEditor(name); };
            var countSpan = document.createElement('span');
            countSpan.style.cssText = 'color:#666;margin-left:6px;font-size:9px;';
            countSpan.textContent = '(' + segs.length + ')';
            div.appendChild(nameSpan);
            div.appendChild(countSpan);
            div.appendChild(document.createElement('br'));
            for (var i = 0; i < Math.min(3, segs.length); i++) {
                var seg = segs[i];
                var daysAgo = Math.floor((new Date() - new Date(seg.editDate)) / 86400000);
                var segDiv = document.createElement('div');
                segDiv.style.cssText = 'color:#888;margin-left:10px;margin-top:2px;font-size:9px;';
                if (seg.isOld) segDiv.style.cssText += 'background:#ffebee;border:1px solid #ffcdd2;border-radius:2px;padding:1px 3px;';
                var idSpan = document.createElement('span');
                idSpan.style.cssText = 'color:#2196F3;cursor:pointer;text-decoration:underline;font-weight:bold;';
                idSpan.textContent = seg.segmentId;
                idSpan.onclick = (function(id) { return function() { selectSegmentById(id); }; })(seg.segmentId);
                segDiv.appendChild(idSpan);
                var txt = seg.isOld ? ' - ' + daysAgo + 'd (OLD)' : ' - ' + daysAgo + 'd';
                var txtSpan = document.createElement('span');
                if (seg.isOld) txtSpan.style.cssText = 'color:#d32f2f;font-weight:bold;';
                txtSpan.textContent = txt;
                segDiv.appendChild(txtSpan);
                div.appendChild(segDiv);
            }
            if (segs.length > 3) {
                var more = document.createElement('div');
                more.style.cssText = 'color:#888;margin-left:10px;font-style:italic;font-size:8px;margin-top:2px;';
                more.textContent = '... +' + (segs.length - 3) + ' more';
                div.appendChild(more);
            }
            cont.appendChild(div);
        });
        el.appendChild(cont);
    }

    // ============ RE-HIGHLIGHT NACH KARTENBEWEGUNG ============
    function reapplyHighlights() {
        if (foundSegmentsList.length === 0) return;

        var opts = lastFilterOptions || getFilterOptions();

        foundSegmentsList.forEach(function(item) {
            try {
                var segment = W.model.segments.getObjectById(item.segmentId);
                if (!segment) return;

                var line = W.userscripts.getFeatureElementByDataModel(segment);
                if (line) {
                    if (item.isOld) {
                        line.setAttribute("stroke", HIGHLIGHT_RED);
                        line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                        line.setAttribute("stroke-width", 10);
                        line.setAttribute("stroke-dasharray", "10,5");
                    } else {
                        line.setAttribute("stroke", getHighlightColor(opts.colorMode, opts.customColor));
                        line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                        line.setAttribute("stroke-width", 8);
                        line.setAttribute("stroke-dasharray", "none");
                    }
                }
            } catch (e) {}
        });
    }

    // Debounce für Performance
    var reapplyTimeout = null;
    function debouncedReapply() {
        if (reapplyTimeout) clearTimeout(reapplyTimeout);
        reapplyTimeout = setTimeout(reapplyHighlights, 200);
    }

    // ============ MAIN HIGHLIGHTER ============
    function runHighlighter() {
        if (!W || !W.model || !W.model.segments) { setTimeout(runHighlighter, 2000); return; }
        resetAllHighlights();
        saveFilterOptions();
        cityStats.clear(); // Reset Städte-Statistiken

        var opts = getFilterOptions();
        lastFilterOptions = opts; // Speichere für Re-Highlight
        var totalSegments = 0, matchingSegments = 0, highlightedSegments = 0, oldSegments = 0;
        var today = new Date();
        var userRank = W.loginManager && W.loginManager.user ? W.loginManager.user.attributes.rank : 0;

        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            totalSegments++;
            var attrs = segment.attributes;

            if (opts.onlyEditable) {
                // Prüfe ob Segment editierbar ist
                // Methode 1: Nutze WME's eingebaute Methode falls verfügbar
                if (segment.isAllowed && typeof segment.isAllowed === 'function') {
                    if (!segment.isAllowed(segment.PERMISSIONS.EDIT_GEOMETRY)) continue;
                } else if (segment.canEdit && typeof segment.canEdit === 'function') {
                    if (!segment.canEdit()) continue;
                } else {
                    // Fallback: Manuelle Prüfung
                    var lockRank = attrs.lockRank !== undefined ? attrs.lockRank : (attrs.lock || 0);
                    // In WME: rank 0 = L1, rank 1 = L2, etc.
                    // lockRank funktioniert genauso
                    // User kann editieren wenn userRank >= lockRank
                    if (userRank < lockRank) continue;

                    // Zusätzlich: Prüfe ob Segment in editierbarem Gebiet liegt
                    if (W.model.isEditableByUser && typeof W.model.isEditableByUser === 'function') {
                        if (!W.model.isEditableByUser(segment)) continue;
                    }
                }
            }

            var updatedBy = attrs.updatedBy || attrs.createdBy;
            if (!updatedBy) continue;

            var editDate = attrs.updatedOn || attrs.createdOn;
            var editDays = editDate ? (today.getTime() - editDate) / 86400000 : 9999;
            if (editDays > opts.daysOld) continue;

            if (opts.roadTypeFilterEnabled && opts.selectedRoadTypes.length > 0) {
                if (opts.selectedRoadTypes.indexOf(attrs.roadType) === -1) continue;
            }

            try {
                var user = W.model.users.getObjectById(parseInt(updatedBy));
                if (!user || !user.attributes || !user.attributes.userName || user.attributes.userName === 'Inactive User') continue;
                if (opts.levelFilterEnabled && user.attributes.rank !== opts.selectedInternalLevel) continue;

                matchingSegments++;
                var isOld = editDays >= opts.ageFilterDays;
                if (isOld) oldSegments++;

                // Städte-Statistik sammeln
                var cityName = getCityFromSegment(segment);
                if (!cityStats.has(cityName)) {
                    cityStats.set(cityName, { name: cityName, oldSegments: 0, totalSegments: 0, segmentIds: [] });
                }
                var cityData = cityStats.get(cityName);
                cityData.totalSegments++;
                cityData.segmentIds.push(seg);
                if (isOld) cityData.oldSegments++;

                foundSegmentsList.push({
                    segmentId: seg, editorName: user.attributes.userName, editorLevel: (user.attributes.rank || 0) + 1,
                    editDate: editDate, isOld: isOld, roadType: attrs.roadType, roadTypeName: ROAD_TYPES[attrs.roadType] || 'Unknown',
                    cityName: cityName
                });

                try {
                    var line = W.userscripts.getFeatureElementByDataModel(segment);
                    if (line) {
                        if (isOld) {
                            line.setAttribute("stroke", HIGHLIGHT_RED);
                            line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                            line.setAttribute("stroke-width", 10);
                            line.setAttribute("stroke-dasharray", "10,5");
                        } else {
                            line.setAttribute("stroke", getHighlightColor(opts.colorMode, opts.customColor));
                            line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                            line.setAttribute("stroke-width", 8);
                            line.setAttribute("stroke-dasharray", "none");
                        }
                        highlightedSegments++;
                        highlightedSegmentIds.push(seg);
                    }
                } catch (e) {}
            } catch (e) {}
        }

        var counterEl = getId('_highlightCounter');
        if (counterEl) {
            var txt = '<strong>Gefunden ' + matchingSegments + ' segments</strong>';
            if (opts.levelFilterEnabled) txt += ' by L' + opts.selectedDisplayLevel;
            if (opts.roadTypeFilterEnabled && opts.selectedRoadTypes.length > 0) txt += ' (' + opts.selectedRoadTypes.map(function(rt) { return ROAD_TYPES[rt] || rt; }).join(', ') + ')';
            if (opts.onlyEditable) txt += ' [editierbar]';
            txt += '<br><strong>Hervorgehoben ' + highlightedSegments + '</strong>';
            if (oldSegments > 0) txt += '<br><strong style="color:#d32f2f;">' + oldSegments + ' überaltert (>' + opts.ageFilterDays + 'd)</strong>';
            txt += '<br><span style="color:#888;">(' + totalSegments + ' gesamt im Viewport)</span>';
            counterEl.innerHTML = txt;
        }

        updateEditorsDisplay();
        updateAgeStatisticsDisplay();
        updateTopEditorsDisplay();
        updateCityStatisticsDisplay();
    }

    // ============ UNIFIED SCAN STARTER ============
    async function startUnifiedScan() {
        console.log(SCRIPT_NAME + ": startUnifiedScan() aufgerufen");

        // Prüfe ob WME bereit ist (wie bei runHighlighter)
        if (!W || !W.model || !W.model.segments) {
            log('WME noch nicht bereit, warte...', 'warning');
            console.log(SCRIPT_NAME + ": WME nicht bereit");
            setTimeout(startUnifiedScan, 2000);
            return;
        }

        var scanMode = getId('_scanModeSelect');
        var areaSelect = getId('_areaSelect');
        var opts = getFilterOptions();
        saveFilterOptions();

        var bounds = null;
        var mode = scanMode ? scanMode.value : 'viewport';

        console.log(SCRIPT_NAME + ": Scan-Modus = " + mode);
        log('Starte Scan im Modus: ' + mode, 'info');

        if (mode === 'viewport') {
            // Nur aktueller Viewport - verwende runHighlighter direkt
            console.log(SCRIPT_NAME + ": Rufe runHighlighter() auf");
            runHighlighter();
            return;
        } else if (mode === 'viewportScan') {
            // Viewport scannen (Tile-basiert)
            console.log(SCRIPT_NAME + ": viewportScan - hole Bounds");
            bounds = CoordUtils.getCurrentBounds();
            console.log(SCRIPT_NAME + ": Bounds = ", bounds);
            if (!bounds) {
                log('Konnte Viewport-Bounds nicht ermitteln', 'error');
                return;
            }
            log('Scanne aktuellen Viewport...', 'info');
        } else if (mode === 'selectedAreas') {
            // Ausgewählte Gebiete scannen (neue Methode mit Checkboxen)
            bounds = editableAreasAnalyzer.getSelectedAreasBounds();
            if (!bounds) {
                log('Keine Gebiete ausgewählt. Bitte erst Gebiete analysieren und auswählen.', 'error');
                return;
            }
            var selectedCount = editableAreasAnalyzer.selectedAreas.size;
            log('Scanne ' + selectedCount + ' ausgewählte Gebiete...', 'info');
        } else if (mode === 'area') {
            // Gebiet aus Liste (alte Methode)
            var areaIndex = parseInt(areaSelect ? areaSelect.value : '-1');
            if (!isNaN(areaIndex) && areaIndex >= 0 && areaIndex < managedAreas.areas.length) {
                var area = managedAreas.areas[areaIndex];
                log('Starte Scan für Gebiet "' + area.name + '" (' + area.sizeKm2 + ' km²)', 'info');

                // Klicke auf das Gebiet - WME navigiert dorthin
                if (area.element) {
                    area.element.click();
                    log('Warte auf Navigation...', 'info');
                    await AreaScanner.delay(2500);

                    // Nach Navigation: Hole die neuen Viewport-Bounds
                    bounds = CoordUtils.getCurrentBounds();
                    log('Verwende Viewport nach Navigation', 'success');
                }
            } else {
                log('Kein Gebiet ausgewählt', 'error');
                return;
            }
        }

        console.log(SCRIPT_NAME + ": Nach Mode-Check, bounds = ", bounds);

        if (!bounds) {
            log('Keine gültigen Bounds!', 'error');
            return;
        }

        // Tile-Größe aus dem richtigen Input holen
        var tileSizeInput = (mode === 'selectedAreas') ? getId('_tileSizeInputSelected') : getId('_tileSizeInput');
        console.log(SCRIPT_NAME + ": tileSizeInput = ", tileSizeInput);
        if (tileSizeInput) {
            opts.tileSize = parseInt(tileSizeInput.value) || 500;
        }
        console.log(SCRIPT_NAME + ": opts.tileSize = ", opts.tileSize);

        console.log(SCRIPT_NAME + ": Rufe AreaScanner.startScan() auf");
        await AreaScanner.startScan(bounds, opts);
    }

    // ============ EXPORT ============
    function exportCSV() {
        if (scanState.results.length === 0) { log('Keine Ergebnisse', 'warning'); return; }
        var csv = 'Rang,Stadt,Überaltert\n';
        scanState.results.forEach(function(c, i) { csv += (i+1) + ',"' + c.name + '",' + c.oldSegments + '\n'; });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wme_age_filter_' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
        log('CSV exportiert', 'success');
    }

    function exportJSON() {
        if (scanState.results.length === 0) { log('Keine Ergebnisse', 'warning'); return; }
        var data = { exportDate: new Date().toISOString(), totalCities: scanState.results.length, totalOld: scanState.oldSegmentsFound, cities: scanState.results };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wme_age_filter_' + new Date().toISOString().slice(0,10) + '.json';
        link.click();
        log('JSON exportiert', 'success');
    }

    function renderAreasDropdown() {
        var select = getId('_areaSelect');
        if (!select) return;

        // Lade Gebiete aus der Sidebar (DOM-Elemente)
        managedAreas.loadFromSidebar();

        var html = '';
        if (managedAreas.areas.length === 0) {
            html = '<option value="">Keine Gebiete gefunden - öffne "Your Areas"</option>';
            log('Keine Gebiete in Sidebar gefunden', 'warning');
        } else {
            managedAreas.areas.forEach(function(area, i) {
                var sizeText = area.sizeKm2 > 0 ? ' (' + area.sizeKm2 + ' km²)' : '';
                html += '<option value="' + i + '">🗺️ ' + area.name + sizeText + '</option>';
            });
            log(managedAreas.areas.length + ' Gebiete geladen', 'success');
        }

        select.innerHTML = html;
    }

    // ============ AREAS CHECKBOX LIST FUNCTIONS ============
    function renderAreasCheckboxList(areas) {
        var listDiv = getId('_areasCheckboxList');
        if (!listDiv) return;

        if (areas.length === 0) {
            listDiv.innerHTML = '<div style="color:#f44336;font-style:italic;">Keine editierbaren Gebiete gefunden</div>';
            return;
        }

        var html = '';
        var currentCountry = '';

        areas.forEach(function(area) {
            var groupName = area.type === 'managed_area' ? 'Your Areas' : area.country;
            if (groupName !== currentCountry) {
                if (currentCountry !== '') {
                    html += '</div>';
                }
                currentCountry = groupName;
                html += '<div style="margin-bottom:6px;">';

                var groupIcon = area.type === 'managed_area' ? '👤' : '🌍';
                html += '<div style="font-weight:bold;color:#333;margin-bottom:3px;border-bottom:1px solid #ddd;padding-bottom:2px;">' + groupIcon + ' ' + escapeHtml(currentCountry) + '</div>';
            }

            var isSelected = editableAreasAnalyzer.isAreaSelected(area.id);

            var typeIcon = '🏛️';
            if (area.type === 'managed_area') typeIcon = '📍';
            else if (area.type === 'api_area') typeIcon = '🔗';

            var sizeDisplay = '';
            if (area.sizeKm2) {
                sizeDisplay = area.sizeKm2.toLocaleString() + ' km²';
            } else if (area.segmentCount) {
                sizeDisplay = '~' + area.segmentCount.toLocaleString() + ' Segmente';
            }

            html += '<label style="display:block;margin-bottom:2px;cursor:pointer;padding:2px 4px;border-radius:3px;background:' + (isSelected ? '#e3f2fd' : 'transparent') + ';">';
            html += '<input type="checkbox" class="area-checkbox" data-area-id="' + area.id + '" ' + (isSelected ? 'checked' : '') + '> ';
            html += typeIcon + ' ' + escapeHtml(area.name);
            if (sizeDisplay) {
                html += ' <span style="color:#666;font-size:8px;">(' + sizeDisplay + ')</span>';
            }
            html += '</label>';
        });

        if (currentCountry !== '') {
            html += '</div>';
        }

        listDiv.innerHTML = html;

        // Event Listeners für Checkboxen
        document.querySelectorAll('.area-checkbox').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                var areaId = this.getAttribute('data-area-id');
                if (this.checked) {
                    editableAreasAnalyzer.selectArea(areaId);
                } else {
                    editableAreasAnalyzer.deselectArea(areaId);
                }

                var label = this.parentElement;
                label.style.background = this.checked ? '#e3f2fd' : 'transparent';
            });
        });
    }

    function updateAreasCheckboxes() {
        document.querySelectorAll('.area-checkbox').forEach(function(checkbox) {
            var areaId = checkbox.getAttribute('data-area-id');
            var isSelected = editableAreasAnalyzer.isAreaSelected(areaId);
            checkbox.checked = isSelected;

            var label = checkbox.parentElement;
            label.style.background = isSelected ? '#e3f2fd' : 'transparent';
        });
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============ UI CREATION ============
    function createUI() {
        if (!W || !W.userscripts || !W.userscripts.registerSidebarTab) { setTimeout(createUI, 2000); return; }
        try {
            var tabResult = W.userscripts.registerSidebarTab('wme-segment-age-filter');
            tabResult.tabLabel.textContent = 'SAF';
            tabResult.tabLabel.title = 'Segment Age Filter';
            W.userscripts.waitForElementConnected(tabResult.tabPane).then(function() { setupTabContent(tabResult.tabPane); });
        } catch (e) { console.error("Error:", e); createUIFallback(); }
    }

    function setupTabContent(tabPane) {
        tabPane.style.padding = '8px';
        tabPane.style.fontSize = '11px';

        var html = '<div>';
        html += '<h4 style="margin:0 0 6px 0;color:#2196F3;font-size:13px;">' + levelIcon + 'Segment Age Filter <span style="font-size:9px;color:#888;">v' + SCRIPT_VERSION + '</span></h4>';

        // ===== FILTER EINSTELLUNGEN =====
        html += '<div style="margin-bottom:10px;padding:8px;background:#f5f5f5;border-radius:5px;border:1px solid #e0e0e0;">';
        html += '<div style="font-weight:bold;margin-bottom:6px;font-size:11px;color:#424242;">⚙️ Filter Einstellungen</div>';

        // Nur Editierbare
        html += '<div style="margin-bottom:6px;padding:4px;background:#e8f5e9;border-radius:3px;">';
        html += '<label style="font-size:10px;cursor:pointer;"><input type="checkbox" id="_cbOnlyEditable"> 🔓 Nur editierbare Segmente</label>';
        html += '</div>';

        // Level Filter
        html += '<div style="margin-bottom:6px;">';
        html += '<label style="display:block;margin-bottom:2px;font-size:10px;cursor:pointer;"><input type="checkbox" id="_cbLevelFilter"> 👤 Level Filter</label>';
        html += '<div id="_levelContainer" style="display:none;margin-left:16px;padding:4px;background:#fff;border-radius:3px;">';
        html += '<select id="_selectEditorLevel" style="width:50px;padding:2px;font-size:9px;">';
        for (var l = 1; l <= 7; l++) html += '<option value="' + l + '">L' + l + '</option>';
        html += '</select>';
        html += ' <label style="font-size:9px;">Max Tage:</label> <input type="number" id="_txtDaysOld" value="30" min="1" max="3650" style="width:45px;padding:2px;font-size:9px;">';
        html += '</div></div>';

        //Segment Age Filter
        html += '<div style="margin-bottom:6px;">';
        html += '<div style="font-weight:bold;margin-bottom:3px;font-size:10px;">⏰ Alter Filter (überaltert wenn älter als)</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;">';
        html += '<label style="font-size:9px;"><input type="radio" name="ageQuick" value="180"> 6M</label>';
        html += '<label style="font-size:9px;"><input type="radio" name="ageQuick" value="365"> 1J</label>';
        html += '<label style="font-size:9px;"><input type="radio" name="ageQuick" value="730"> 2J</label>';
        html += '<label style="font-size:9px;"><input type="radio" name="ageQuick" value="1825"> 5J</label>';
        html += '</div>';
        html += '<input type="number" id="_txtAgeFilter" value="180" min="1" max="3650" style="width:55px;padding:2px;font-size:9px;"> <span style="font-size:9px;">Tage</span>';
        html += '</div>';

        // Road Type Filter
        html += '<div style="margin-bottom:6px;">';
        html += '<label style="display:block;margin-bottom:2px;font-size:10px;cursor:pointer;"><input type="checkbox" id="_cbRoadTypeFilter"> 🛣️ Filter by Road Type</label>';
        html += '<div id="_roadTypeContainer" style="display:none;margin-left:16px;max-height:60px;overflow-y:auto;border:1px solid #ddd;padding:3px;background:#fff;border-radius:2px;">';
        for (var rt in ROAD_TYPES) {
            var short = ROAD_TYPES[rt].replace('Street','St').replace('Highway','Hwy').replace('Road','Rd');
            html += '<label style="display:block;font-size:8px;"><input type="checkbox" id="_cbRoadType' + rt + '"> ' + short + '</label>';
        }
        html += '</div></div>';

        // Farbe
        html += '<div style="margin-bottom:4px;">';
        html += '<div style="font-weight:bold;font-size:10px;margin-bottom:3px;">🎨 Highlight-Farbe</div>';
        html += '<div style="font-size:8px;color:#666;margin-bottom:2px;">Überaltert = <span style="color:#f44336;font-weight:bold;">Rot</span></div>';
        html += '<label style="font-size:9px;margin-right:4px;"><input type="radio" name="highlightColor" id="_rbHilightGreen" checked> Grün</label>';
        html += '<label style="font-size:9px;margin-right:4px;"><input type="radio" name="highlightColor" id="_rbHilightBlue"> Blau</label>';
        html += '<label style="font-size:9px;"><input type="radio" name="highlightColor" id="_rbHilightCustom"> Eigene</label> ';
        html += '<input type="color" id="_customColorPicker" value="' + HIGHLIGHT_GREEN + '" style="display:none;width:20px;height:14px;vertical-align:middle;">';
        html += '</div>';

        html += '</div>'; // Ende Filter Einstellungen

        // ===== HAUPT-BUTTONS =====
        html += '<div style="margin-bottom:8px;padding:4px;background:#e8f5e9;border-radius:3px;">';
        html += '<label style="font-size:10px;cursor:pointer;"><input type="checkbox" id="_cbAutoRefresh"> 🔄 Auto Refresh (5s)</label>';
        html += '</div>';
        html += '<div style="margin-bottom:8px;display:flex;gap:4px;">';
        html += '<button id="_btnRunHighlighter" style="flex:1;background:#4CAF50;color:white;border:none;padding:8px;border-radius:3px;cursor:pointer;font-weight:bold;font-size:11px;">▶️ RUN</button>';
        html += '<button id="_btnResetHighlights" style="background:#f44336;color:white;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;font-size:10px;">🗑️</button>';
        html += '<button id="_btnSelectAll" style="background:#2196F3;color:white;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;font-size:10px;">✓</button>';
        html += '</div>';

        // ===== ERWEITERTE SCAN-OPTIONEN =====
        html += '<div style="margin-bottom:10px;padding:8px;background:#e3f2fd;border-radius:5px;border:1px solid #90caf9;">';
        html += '<div style="font-weight:bold;margin-bottom:6px;font-size:11px;color:#1565c0;">🔍 Erweiterte Scan-Optionen</div>';

        // Option 1: Radius-Scan (NEU)
        html += '<div style="margin-bottom:8px;padding:6px;background:#fff;border-radius:3px;border:1px solid #e0e0e0;">';
        html += '<div style="font-weight:bold;font-size:10px;color:#424242;margin-bottom:4px;">Radius-Scan</div>';
        html += '<div style="font-size:9px;color:#666;margin-bottom:4px;">Scannt im Umkreis der aktuellen Position</div>';
        html += '<div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">';
        html += '<label style="font-size:9px;">Radius:</label>';
        html += '<select id="_radiusSelect" style="padding:2px;font-size:9px;">';
        html += '<option value="5">5 km (~2 Min)</option>';
        html += '<option value="10">10 km (~5 Min)</option>';
        html += '<option value="25" selected>25 km (~15 Min)</option>';
        html += '<option value="50">50 km (~30 Min)</option>';
        html += '<option value="100">100 km (~2 Std)</option>';
        html += '</select>';
        html += '<label style="font-size:9px;margin-left:4px;">Tile:</label>';
        html += '<input type="number" id="_radiusTileSize" value="500" min="200" max="2000" step="100" style="width:50px;padding:2px;font-size:9px;">';
        html += '<span style="font-size:8px;">m</span>';
        html += '</div>';
        html += '<button id="_btnRadiusScan" style="width:100%;background:#4CAF50;color:white;border:none;padding:6px;border-radius:3px;cursor:pointer;font-size:10px;">📍 Radius-Scan starten</button>';
        html += '</div>';

        // Option 2: Regierungsbezirk Scan (NEU)
        html += '<div style="margin-bottom:8px;padding:6px;background:#fff;border-radius:3px;border:1px solid #e0e0e0;">';
        html += '<div style="font-weight:bold;font-size:10px;color:#424242;margin-bottom:4px;">🏛️ Deutsche Regierungsbezirke Scannen</div>';
        html += '<div style="font-size:9px;color:#666;margin-bottom:4px;">Kleinere Regionen (~5-15 Min pro Bezirk)</div>';
        html += '<select id="_regionSelect" style="width:100%;padding:4px;font-size:9px;margin-bottom:4px;">';
        html += '<option value="">-- Region wählen --</option>';
        html += '<optgroup label="Baden-Württemberg">';
        html += '<option value="bw-stuttgart">Stuttgart</option>';
        html += '<option value="bw-karlsruhe">Karlsruhe</option>';
        html += '<option value="bw-freiburg">Freiburg</option>';
        html += '<option value="bw-tuebingen">Tübingen</option>';
        html += '</optgroup>';
        html += '<optgroup label="Bayern">';
        html += '<option value="by-oberbayern">Oberbayern</option>';
        html += '<option value="by-niederbayern">Niederbayern</option>';
        html += '<option value="by-oberpfalz">Oberpfalz</option>';
        html += '<option value="by-oberfranken">Oberfranken</option>';
        html += '<option value="by-mittelfranken">Mittelfranken</option>';
        html += '<option value="by-unterfranken">Unterfranken</option>';
        html += '<option value="by-schwaben">Schwaben</option>';
        html += '</optgroup>';
        html += '<optgroup label="Brandenburg">';
        html += '<option value="bb-nord">Brandenburg Nord</option>';
        html += '<option value="bb-sued">Brandenburg Süd</option>';
        html += '</optgroup>';
        html += '<optgroup label="Hessen">';
        html += '<option value="he-darmstadt">Darmstadt</option>';
        html += '<option value="he-giessen">Gießen</option>';
        html += '<option value="he-kassel">Kassel</option>';
        html += '</optgroup>';
        html += '<optgroup label="Niedersachsen">';
        html += '<option value="ni-braunschweig">Braunschweig</option>';
        html += '<option value="ni-hannover">Hannover</option>';
        html += '<option value="ni-lueneburg">Lüneburg</option>';
        html += '<option value="ni-weser-ems">Weser-Ems</option>';
        html += '</optgroup>';
        html += '<optgroup label="NRW">';
        html += '<option value="nw-duesseldorf">Düsseldorf</option>';
        html += '<option value="nw-koeln">Köln</option>';
        html += '<option value="nw-muenster">Münster</option>';
        html += '<option value="nw-detmold">Detmold</option>';
        html += '<option value="nw-arnsberg">Arnsberg</option>';
        html += '</optgroup>';
        html += '<optgroup label="Rheinland-Pfalz">';
        html += '<option value="rp-koblenz">Koblenz</option>';
        html += '<option value="rp-trier">Trier</option>';
        html += '<option value="rp-rheinhessen-pfalz">Rheinhessen-Pfalz</option>';
        html += '</optgroup>';
        html += '<optgroup label="Sachsen">';
        html += '<option value="sn-chemnitz">Chemnitz</option>';
        html += '<option value="sn-dresden">Dresden</option>';
        html += '<option value="sn-leipzig">Leipzig</option>';
        html += '</optgroup>';
        html += '<optgroup label="Sachsen-Anhalt">';
        html += '<option value="st-dessau">Dessau</option>';
        html += '<option value="st-halle">Halle</option>';
        html += '<option value="st-magdeburg">Magdeburg</option>';
        html += '</optgroup>';
        html += '<optgroup label="Schleswig-Holstein">';
        html += '<option value="sh-sued">SH Süd</option>';
        html += '<option value="sh-nord">SH Nord</option>';
        html += '</optgroup>';
        html += '<optgroup label="Thüringen">';
        html += '<option value="th-nord">Thüringen Nord</option>';
        html += '<option value="th-sued">Thüringen Süd</option>';
        html += '</optgroup>';
        html += '<optgroup label="Mecklenburg-Vorpommern">';
        html += '<option value="mv-west">MV West (Schwerin)</option>';
        html += '<option value="mv-ost">MV Ost (Greifswald)</option>';
        html += '</optgroup>';
        html += '<optgroup label="Stadtstaaten & Saarland">';
        html += '<option value="berlin">Berlin</option>';
        html += '<option value="bremen">Bremen</option>';
        html += '<option value="hamburg">Hamburg</option>';
        html += '<option value="saarland">Saarland</option>';
        html += '</optgroup>';
        html += '</select>';
        html += '<div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">';
        html += '<label style="font-size:9px;">Tile-Größe:</label>';
        html += '<input type="number" id="_regionTileSize" value="500" min="200" max="2000" step="100" style="width:50px;padding:2px;font-size:9px;">';
        html += '<span style="font-size:8px;">m</span>';
        html += '</div>';
        html += '<button id="_btnRegionScan" style="width:100%;background:#9c27b0;color:white;border:none;padding:6px;border-radius:3px;cursor:pointer;font-size:10px;">🏛️ Region scannen</button>';
        html += '</div>';

        // Option 3: Auto-Scroll Scan
        html += '<div style="margin-bottom:8px;padding:6px;background:#fff;border-radius:3px;border:1px solid #e0e0e0;">';
        html += '<div style="font-weight:bold;font-size:10px;color:#424242;margin-bottom:4px;">🔄 Auto-Scroll Scan</div>';
        html += '<div style="font-size:9px;color:#666;margin-bottom:4px;">Scrollt automatisch durch die Umgebung</div>';
        html += '<div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">';
        html += '<label style="font-size:9px;">Schritte:</label>';
        html += '<input type="number" id="_autoScrollSteps" value="50" min="10" max="500" style="width:50px;padding:2px;font-size:9px;">';
        html += '</div>';
        html += '<button id="_btnAutoScrollScan" style="width:100%;background:#2196F3;color:white;border:none;padding:6px;border-radius:3px;cursor:pointer;font-size:10px;">🔄 Auto-Scroll starten</button>';
        html += '</div>';

        // Scan Status & Controls
        html += '<div id="_scanStatus" style="font-size:10px;margin-bottom:4px;"></div>';
        html += '<div id="_scanProgress" style="margin-bottom:4px;"></div>';
        html += '<div id="_scanControls" style="margin-bottom:4px;"></div>';

        html += '</div>'; // Ende Erweiterte Scan-Optionen

        // ===== ERGEBNISSE =====
        html += '<div id="_highlightCounter" style="margin-bottom:6px;padding:5px;background:#e8f5e8;border-left:3px solid #4CAF50;border-radius:2px;font-size:9px;"></div>';
        html += '<div id="_ageStatisticsDisplay"></div>';
        html += '<div id="_topEditorsDisplay"></div>';
        html += '<div id="_cityStatisticsDisplay"></div>';
        html += '<div id="_cityStatistics"></div>';
        html += '<div id="_editorsDisplay"></div>';

        // Export Buttons
        html += '<div style="margin-top:8px;display:flex;gap:4px;">';
        html += '<button id="_btnExportCSV" style="flex:1;background:#607d8b;color:white;border:none;padding:4px;border-radius:3px;cursor:pointer;font-size:9px;">📄 CSV</button>';
        html += '<button id="_btnExportJSON" style="flex:1;background:#607d8b;color:white;border:none;padding:4px;border-radius:3px;cursor:pointer;font-size:9px;">📋 JSON</button>';
        html += '<button id="_btnClearResults" style="flex:1;background:#9e9e9e;color:white;border:none;padding:4px;border-radius:3px;cursor:pointer;font-size:9px;">🗑️ Clear</button>';
        html += '</div>';

        // Log
        html += '<div id="_ageFilterLog" style="margin-top:8px;padding:6px;background:#fafafa;border-radius:3px;max-height:80px;overflow-y:auto;font-size:9px;font-family:monospace;border:1px solid #e0e0e0;"></div>';
        html += '</div>';

        tabPane.innerHTML = html;
        setupEventListeners();
        loadSavedSettings();
    }

    function setupEventListeners() {
        // Quick age selection
        document.querySelectorAll('input[name="ageQuick"]').forEach(function(r) {
            r.onchange = function() {
                var ageInput = getId('_txtAgeFilter');
                if (this.checked && ageInput) {
                    ageInput.value = this.value;
                    saveToLocalStorage(STORAGE_KEYS.ageFilterDays, this.value);
                }
            };
        });

        // Filter toggles
        var levelFilterCb = getId('_cbLevelFilter');
        if (levelFilterCb) levelFilterCb.onchange = updateLevelVisibility;

        var roadTypeFilterCb = getId('_cbRoadTypeFilter');
        if (roadTypeFilterCb) roadTypeFilterCb.onchange = updateRoadTypeVisibility;

        // Color selection
        document.querySelectorAll('input[name="highlightColor"]').forEach(function(r) { r.onchange = updateCustomColorVisibility; });

        // Auto refresh
        var autoRefreshCb = getId('_cbAutoRefresh');
        if (autoRefreshCb) autoRefreshCb.onchange = toggleAutoRefresh;

        // Haupt-Buttons
        var runBtn = getId('_btnRunHighlighter');
        if (runBtn) runBtn.onclick = runHighlighter;

        var resetBtn = getId('_btnResetHighlights');
        if (resetBtn) resetBtn.onclick = resetAllHighlights;

        var selectAllBtn = getId('_btnSelectAll');
        if (selectAllBtn) selectAllBtn.onclick = selectHighlightedSegments;

        // Auto-Scroll Scan Button
        var autoScrollBtn = getId('_btnAutoScrollScan');
        if (autoScrollBtn) autoScrollBtn.onclick = function() {
            if (scanState.isScanning) {
                log('Ein Scan läuft bereits!', 'warning');
                return;
            }
            var opts = getFilterOptions();
            AutoScrollScanner.start(opts);
        };

        // Radius-Scan Button (NEU)
        var radiusBtn = getId('_btnRadiusScan');
        if (radiusBtn) radiusBtn.onclick = function() {
            if (scanState.isScanning) {
                log('Ein Scan läuft bereits!', 'warning');
                return;
            }
            var radiusSelect = getId('_radiusSelect');
            var tileSizeInput = getId('_radiusTileSize');
            var radius = radiusSelect ? parseInt(radiusSelect.value) || 25 : 25;
            var opts = getFilterOptions();
            opts.tileSize = tileSizeInput ? parseInt(tileSizeInput.value) || 500 : 500;
            RadiusScanner.start(radius, opts);
        };

        // Region-Scan Button (NEU)
        var regionBtn = getId('_btnRegionScan');
        if (regionBtn) regionBtn.onclick = function() {
            if (scanState.isScanning) {
                log('Ein Scan läuft bereits!', 'warning');
                return;
            }
            var select = getId('_regionSelect');
            var tileSizeInput = getId('_regionTileSize');
            if (!select || !select.value) {
                log('Bitte eine Region auswählen!', 'error');
                return;
            }
            var opts = getFilterOptions();
            opts.tileSize = tileSizeInput ? parseInt(tileSizeInput.value) || 500 : 500;
            BundeslandScanner.startRegion(select.value, opts);
        };

        // Export buttons
        var exportCSVBtn = getId('_btnExportCSV');
        if (exportCSVBtn) exportCSVBtn.onclick = exportCSV;

        var exportJSONBtn = getId('_btnExportJSON');
        if (exportJSONBtn) exportJSONBtn.onclick = exportJSON;

        var clearResultsBtn = getId('_btnClearResults');
        if (clearResultsBtn) clearResultsBtn.onclick = function() {
            scanState.results = [];
            scanState.cityStats = new Map();
            var cityStats = getId('_cityStatistics');
            if (cityStats) cityStats.innerHTML = '<div style="color:#666;font-style:italic;font-size:9px;">Ergebnisse gelöscht</div>';
            resetAllHighlights();
            log('Ergebnisse gelöscht', 'info');
        };
    }

    function loadSavedSettings() {
        var levelFilterCb = getId('_cbLevelFilter');
        if (levelFilterCb) {
            levelFilterCb.checked = loadFromLocalStorage(STORAGE_KEYS.levelFilterEnabled, 'false') === 'true';
            updateLevelVisibility();
        }

        var selectedLevel = getId('_selectEditorLevel');
        if (selectedLevel) selectedLevel.value = loadFromLocalStorage(STORAGE_KEYS.selectedLevel, '1');

        var daysInput = getId('_txtDaysOld');
        if (daysInput) daysInput.value = loadFromLocalStorage(STORAGE_KEYS.daysOld, '30');

        var ageFilterInput = getId('_txtAgeFilter');
        var savedAge = loadFromLocalStorage(STORAGE_KEYS.ageFilterDays, '180');
        if (ageFilterInput) ageFilterInput.value = savedAge;

        document.querySelectorAll('input[name="ageQuick"]').forEach(function(r) {
            if (r.value === savedAge) r.checked = true;
        });

        var roadTypeFilterCb = getId('_cbRoadTypeFilter');
        if (roadTypeFilterCb) {
            roadTypeFilterCb.checked = loadFromLocalStorage(STORAGE_KEYS.roadTypeFilterEnabled, 'false') === 'true';
            updateRoadTypeVisibility();
        }

        var savedRoadTypes = JSON.parse(loadFromLocalStorage(STORAGE_KEYS.selectedRoadTypes, '[]'));
        savedRoadTypes.forEach(function(rt) {
            var cb = getId('_cbRoadType' + rt);
            if (cb) cb.checked = true;
        });

        var colorMode = loadFromLocalStorage(STORAGE_KEYS.colorMode, 'green');
        var greenRadio = getId('_rbHilightGreen');
        var blueRadio = getId('_rbHilightBlue');
        var customRadio = getId('_rbHilightCustom');
        if (colorMode === 'green' && greenRadio) greenRadio.checked = true;
        else if (colorMode === 'blue' && blueRadio) blueRadio.checked = true;
        else if (colorMode === 'custom' && customRadio) customRadio.checked = true;

        var customColorPicker = getId('_customColorPicker');
        if (customColorPicker) customColorPicker.value = loadFromLocalStorage(STORAGE_KEYS.customColor, HIGHLIGHT_GREEN);
        updateCustomColorVisibility();

        var autoRefreshCb = getId('_cbAutoRefresh');
        if (autoRefreshCb) {
            autoRefreshCb.checked = loadFromLocalStorage(STORAGE_KEYS.autoRefresh, 'false') === 'true';
            if (autoRefreshCb.checked) toggleAutoRefresh();
        }
    }

    function createUIFallback() {
        var userTabs = getId('user-info');
        if (!userTabs) { setTimeout(createUIFallback, 2000); return; }
        if (getId('_ageFilterTab')) return;

        var tabLabel = document.createElement('a');
        tabLabel.href = '#sidepanel-agefilter';
        tabLabel.id = '_ageFilterTab';
        tabLabel.textContent = 'SAF';
        tabLabel.style.cssText = 'padding:8px 12px;display:inline-block;background:#f0f0f0;border:1px solid #ccc;border-bottom:none;margin-right:2px;text-decoration:none;color:#333;border-radius:4px 4px 0 0;';

        var tabContent = document.createElement('div');
        tabContent.id = 'sidepanel-agefilter';
        tabContent.style.cssText = 'display:none;padding:15px;background:#fff;border:1px solid #ccc;border-radius:0 4px 4px 4px;max-height:600px;overflow-y:auto;';

        var tabsContainer = userTabs.querySelector('.nav-tabs') || userTabs;
        tabsContainer.appendChild(tabLabel);
        var contentContainer = userTabs.querySelector('.tab-content') || userTabs.parentNode;
        contentContainer.appendChild(tabContent);

        setupEventListeners();
        loadSavedSettings();

        tabLabel.onclick = function(e) {
            e.preventDefault();
            contentContainer.querySelectorAll('[id^="sidepanel-"]').forEach(function(tc) { tc.style.display = 'none'; });
            tabsContainer.querySelectorAll('a').forEach(function(t) { t.style.backgroundColor = '#f0f0f0'; t.style.color = '#333'; });
            tabContent.style.display = 'block';
            tabLabel.style.backgroundColor = '#fff';
            tabLabel.style.color = '#2196F3';
        };
    }

    // ============ MAP EVENT LISTENERS ============
    function setupMapListeners() {
        try {
            if (W && W.map) {
                // Event wenn Karte bewegt/gezoomt wird
                W.map.events.register('moveend', null, debouncedReapply);
                W.map.events.register('zoomend', null, debouncedReapply);
                console.log(SCRIPT_NAME + ": Map-Listener registriert");
            }

            // Event wenn Segmente neu geladen werden
            if (W && W.model && W.model.segments) {
                W.model.segments.on('objectsadded', debouncedReapply);
                W.model.segments.on('objectschanged', debouncedReapply);
            }
        } catch (e) {
            console.log(SCRIPT_NAME + ": Konnte Map-Listener nicht registrieren:", e);
        }
    }

    // ============ INITIALIZATION ============
    function init() {
        if (typeof W === 'undefined' || !W.loginManager || !W.loginManager.user) { setTimeout(init, 2000); return; }
        createUI();
        setupMapListeners();
    }

    function initializeScript() {
        if (W && W.userscripts && W.userscripts.state && W.userscripts.state.isReady) init();
        else document.addEventListener("wme-ready", function() { init(); }, { once: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeScript);
    else initializeScript();

    console.log("=== WME Segment Age Filter LOADED ===");
})();