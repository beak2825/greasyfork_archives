// ==UserScript==
// @name         WME Amtliche Hausnummern Import
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      5.2.0
// @description  Massenimport von Hausnummern aus amtlichen Quellen (ALKIS, OpenData, WFS) - ALLE 16 Bundesländer + AT + CH + Speicher-Fehler Analyse + Geschwindigkeits-Einstellungen + Verbesserte Insel-Zuordnung
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558854/WME%20Amtliche%20Hausnummern%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/558854/WME%20Amtliche%20Hausnummern%20Import.meta.js
// ==/UserScript==

(function() {
'use strict';

const SCRIPT_NAME = 'WME Amtliche Hausnummern Import';
const SCRIPT_ID = 'wme-official-hn-import';
const SCRIPT_VERSION = GM_info.script.version;

// ============================================================================
// KONFIGURATION - Amtliche Datenquellen für DACH-Region
// ============================================================================
const OFFICIAL_DATA_SOURCES = {
    // Deutschland - Bundesländer WFS-Dienste
    germany: {
        // NRW - ALKIS Vereinfacht (Gebäude mit Adressen) - funktioniert!
        nrw: {
            name: 'NRW ALKIS Gebäude',
            type: 'WFS',
            url: 'https://www.wfs.nrw.de/geobasis/wfs_nw_alkis_vereinfacht',
            typeName: 'ave:GebaeudeBauwerk',
            srsName: 'EPSG:4326',
            outputFormat: 'text/xml; subtype=gml/3.2.1',
            enabled: true,
            // Spezielle Konfiguration für NRW ALKIS
            isALKISGebaeude: true,
            addressField: 'lagebeztxt',
            defaultCRS: 'EPSG:25832'
        },
        bayern: {
            name: 'Bayern OpenData',
            type: 'WFS',
            url: 'https://geoservices.bayern.de/od/wfs/ogc_adress_wfs',
            typeName: 'ogc_adress_wfs:adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        berlin: {
            name: 'Berlin FIS-Broker',
            type: 'WFS',
            url: 'https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_wfs_adressen',
            typeName: 's_wfs_adressen:Adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        hamburg: {
            name: 'Hamburg Geodaten',
            type: 'WFS',
            url: 'https://geodienste.hamburg.de/HH_WFS_Adressen',
            typeName: 'de.hh.up:Adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Hessen - INSPIRE Adressen
        hessen: {
            name: 'Hessen INSPIRE Adressen',
            type: 'WFS',
            url: 'https://www.gds.hessen.de/cgi-bin/lika-services/ogc-free-ad.ows',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Brandenburg - Geobasis
        brandenburg: {
            name: 'Brandenburg Adressen',
            type: 'WFS',
            url: 'https://inspire.brandenburg.de/services/ad_wfs',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Sachsen - GeoSN
        sachsen: {
            name: 'Sachsen GeoSN',
            type: 'WFS',
            url: 'https://geodienste.sachsen.de/wfs_geosn_adressen/guest',
            typeName: 'geosn:Adresse',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Rheinland-Pfalz
        rlp: {
            name: 'Rheinland-Pfalz Adressen',
            type: 'WFS',
            url: 'https://www.geoportal.rlp.de/spatial-objects/314/wfs',
            typeName: 'ms:adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Thüringen
        thueringen: {
            name: 'Thüringen Adressen',
            type: 'WFS',
            url: 'https://www.geoproxy.geoportal-th.de/geoproxy/services/inspire_ad',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Niedersachsen
        niedersachsen: {
            name: 'Niedersachsen LGLN',
            type: 'WFS',
            url: 'https://www.geobasisdaten.niedersachsen.de/doorman/noauth/wfs_ni_inspire-ad',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Schleswig-Holstein
        sh: {
            name: 'Schleswig-Holstein',
            type: 'WFS',
            url: 'https://service.gdi-sh.de/WFS_SH_INSPIRE_AD',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Sachsen-Anhalt
        sachsen_anhalt: {
            name: 'Sachsen-Anhalt',
            type: 'WFS',
            url: 'https://www.geodatenportal.sachsen-anhalt.de/wss/service/ST_LVermGeo_INSPIRE_AD_WFS_OpenData/guest',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Mecklenburg-Vorpommern
        mv: {
            name: 'Mecklenburg-Vorpommern',
            type: 'WFS',
            url: 'https://www.geodaten-mv.de/dienste/inspire_ad_wfs',
            typeName: 'ad:Address',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Bremen
        bremen: {
            name: 'Bremen Adressen',
            type: 'WFS',
            url: 'https://geodienste.bremen.de/wfs_adressen',
            typeName: 'adressen:Adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Saarland
        saarland: {
            name: 'Saarland Adressen',
            type: 'WFS',
            url: 'https://geoportal.saarland.de/arcgis/services/Internet/WFS_Adressen/MapServer/WFSServer',
            typeName: 'Adressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        },
        // Baden-Württemberg
        bw: {
            name: 'Baden-Württemberg LGL',
            type: 'WFS',
            url: 'https://owsproxy.lgl-bw.de/owsproxy/ows/WFS_LGL-BW_ALKIS_Adressen',
            typeName: 'ave:Adresse',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        }
    },
    austria: {
        bev: {
            name: 'BEV Adressregister',
            type: 'WFS',
            url: 'https://kataster.bev.gv.at/geoserver/adressen/wfs',
            typeName: 'adressen:adr',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        }
    },
    switzerland: {
        // Schweiz - swisstopo
        swisstopo: {
            name: 'Schweiz swisstopo',
            type: 'WFS',
            url: 'https://wfs.geodienste.ch/av/deu',
            typeName: 'ms:gebaeudeadressen',
            srsName: 'EPSG:4326',
            outputFormat: 'application/json',
            enabled: true
        }
    },
    osm: {
        overpass: {
            name: 'OpenStreetMap Overpass',
            type: 'OVERPASS',
            url: 'https://overpass-api.de/api/interpreter',
            enabled: true
        }
    }
};

// Import-Konfiguration
const CONFIG = {
    rateLimiting: {
        maxRequestsPerSecond: 3,
        maxConcurrentRequests: 2,
        retryDelay: 2000,
        maxRetries: 3,
        requestTimeout: 60000
    },
    import: {
        batchSize: 100,  // 100 HN pro Scroll-Batch
        parallelImports: 5,  // 5 HN gleichzeitig importieren (AKTIV)
        maxHouseNumbers: 500,
        duplicateCheck: true,
        maxSegmentDistance: 50,
        duplicateRadius: 20,  // Meter - HN mit gleicher Nummer innerhalb dieses Radius = Duplikat
        segmentAwareRadius: 50, // Meter - Erweiterte Prüfung für verschiedene Segmente
        autoPauseAfter: 25,   // Auto-Pause nach X importierten HN (0 = deaktiviert) - reduziert für bessere Duplikaterkennung
        autoPauseEnabled: true, // Auto-Pause aktiviert
        // Intelligente Duplikatserkennung
        smartDuplicateDetection: true, // Segment-aware Duplikatserkennung
        allowSameNumberDifferentSegments: true, // Erlaube gleiche HN auf verschiedenen Segmenten
        allowSameNumberSameSegment: true, // Erlaube gleiche HN auf gleichem Segment (Bauernhöfe)
        sameSegmentMinDistance: 10, // Mindestabstand für gleiche HN auf gleichem Segment (Meter)
        preferRealCoordinates: true, // Bevorzuge echte Koordinaten gegenüber Dummy-Positionen
        // Erweiterte Suche für große Gebäude
        largeBuildingSearchRadius: 5000, // Meter - Suchradius für große Gebäude (Einkaufszentren, Bauernhöfe)
        enableLargeBuildingSearch: true, // Aktiviere erweiterte Suche für große Gebäude
        // UI-Funktionen
        manualPauseEnabled: true, // Aktiviere manuelle Pause-Funktion während Import
        // Visuelle Duplikatserkennung
        visualDuplicateRadius: 200, // Pixel-Radius für räumliche Duplikatserkennung
        visualDuplicateColor: 'rgba(255, 0, 0, 0.4)', // Rot - klassische Fehlerfarbe
        layerOverlapThreshold: 10 // Pixel - Layer-Duplikate sind meist < 10px entfernt
    },
    search: {
        defaultRadius: 500,
        maxRadius: 2000
    },
    // Geschwindigkeits-Einstellungen (anpassbar über UI)
    speed: {
        initialLoadDelay: 1200,    // Wartezeit beim Start (vorher 4000ms)
        centeringDelay: 1200,      // Wartezeit nach Karten-Zentrierung
        reloadDelay: 300,          // Wartezeit nach HN-Reload
        batchDelay: 150,           // Pause nach jedem Batch
        parallelBatchSize: 10,     // Max HN pro parallelem Batch
        useParallelImport: true    // Parallele Verarbeitung aktiviert
    }
};

// ============================================================================
// GESCHWINDIGKEITSPROFIL - LocalStorage Persistenz
// ============================================================================
const SpeedProfile = {
    storageKey: 'wme-hn-import-speed-profile',

    // Lade Geschwindigkeitsprofil aus LocalStorage
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const profile = JSON.parse(stored);
                // Überschreibe CONFIG.speed mit gespeicherten Werten
                Object.assign(CONFIG.speed, profile);
                console.log(`${SCRIPT_NAME}: Geschwindigkeitsprofil geladen:`, CONFIG.speed);
                return true;
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Laden des Geschwindigkeitsprofils:`, e);
        }
        return false;
    },

    // Speichere aktuelles Geschwindigkeitsprofil in LocalStorage
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(CONFIG.speed));
            console.log(`${SCRIPT_NAME}: Geschwindigkeitsprofil gespeichert:`, CONFIG.speed);
            return true;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Speichern des Geschwindigkeitsprofils:`, e);
        }
        return false;
    },

    // Setze einen einzelnen Wert
    set(key, value) {
        if (CONFIG.speed.hasOwnProperty(key)) {
            CONFIG.speed[key] = value;
            this.save();
            return true;
        }
        return false;
    },

    // Hole einen einzelnen Wert
    get(key) {
        return CONFIG.speed[key];
    },

    // Setze auf Standardwerte zurück
    reset() {
        CONFIG.speed = {
            initialLoadDelay: 1200,
            centeringDelay: 1200,
            reloadDelay: 300,
            batchDelay: 150,
            parallelBatchSize: 10,
            useParallelImport: true
        };
        this.save();
        console.log(`${SCRIPT_NAME}: Geschwindigkeitsprofil zurückgesetzt`);
    },

    // Vordefinierte Profile
    profiles: {
        fast: {
            name: 'Schnell',
            initialLoadDelay: 800,
            centeringDelay: 800,
            reloadDelay: 200,
            batchDelay: 100,
            parallelBatchSize: 15,
            useParallelImport: true
        },
        normal: {
            name: 'Normal',
            initialLoadDelay: 1200,
            centeringDelay: 1200,
            reloadDelay: 300,
            batchDelay: 150,
            parallelBatchSize: 10,
            useParallelImport: true
        },
        safe: {
            name: 'Sicher',
            initialLoadDelay: 2000,
            centeringDelay: 2000,
            reloadDelay: 500,
            batchDelay: 300,
            parallelBatchSize: 5,
            useParallelImport: false
        }
    },

    // Wende ein vordefiniertes Profil an
    applyProfile(profileName) {
        const profile = this.profiles[profileName];
        if (profile) {
            Object.assign(CONFIG.speed, profile);
            delete CONFIG.speed.name; // Name nicht in CONFIG speichern
            this.save();
            console.log(`${SCRIPT_NAME}: Profil "${profile.name}" angewendet`);
            return true;
        }
        return false;
    }
};

// Lade Geschwindigkeitsprofil beim Start
SpeedProfile.load();

// ============================================================================
// VISUAL DUPLICATE DETECTION - Transparenz für bessere Erkennung
// ============================================================================
const VisualDuplicateDetector = {
    isActive: false,
    originalStyles: new Map(),
    duplicateOverlay: null,

    // Aktiviere visuelle Duplikatserkennung
    activate() {
        if (this.isActive) return;

        console.log(`${SCRIPT_NAME}: Aktiviere visuelle Duplikatserkennung...`);
        this.isActive = true;

        // Finde alle HN-Elemente im DOM
        this.applyTransparencyToHouseNumbers();

        // Observer für neue HN-Elemente
        this.startDOMObserver();

        log('Visuelle Duplikatserkennung aktiviert - Doppelte HN werden hervorgehoben', 'success');
    },

    // Deaktiviere visuelle Duplikatserkennung
    deactivate() {
        if (!this.isActive) return;

        console.log(`${SCRIPT_NAME}: Deaktiviere visuelle Duplikatserkennung...`);
        this.isActive = false;

        // Stelle ursprüngliche Styles wieder her
        this.restoreOriginalStyles();

        // Stoppe Observer
        if (this.domObserver) {
            this.domObserver.disconnect();
            this.domObserver = null;
        }

        log('Visuelle Duplikatserkennung deaktiviert', 'info');
    },

    // Wende Transparenz auf alle HN an
    applyTransparencyToHouseNumbers() {
        try {
            // Verschiedene Selektoren für HN-Elemente in WME
            const selectors = [
                '.house-number',
                '.house-number-label',
                '[class*="house"]',
                '[class*="number"]',
                '.olControlHouseNumber',
                '.waze-house-number',
                // SVG Text-Elemente (häufig für HN verwendet)
                'text[class*="house"]',
                'text[class*="number"]',
                // Generische Text-Elemente die wie HN aussehen
                'text[font-size]'
            ];

            const hnElements = new Set();

            // Sammle alle potentiellen HN-Elemente
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => hnElements.add(el));
            }

            // Zusätzlich: Suche nach Text-Elementen mit Zahlen
            const allTextElements = document.querySelectorAll('text, span, div');
            allTextElements.forEach(el => {
                const text = el.textContent?.trim();
                if (text && /^\d+[a-zA-Z]?$/.test(text) && text.length <= 4) {
                    // Sieht aus wie eine Hausnummer
                    hnElements.add(el);
                }
            });

            console.log(`${SCRIPT_NAME}: Gefunden ${hnElements.size} potentielle HN-Elemente`);

            // Sammle HN mit Positionen für Transparenz-Anwendung
            const hnWithPositions = [];

            hnElements.forEach(el => {
                const text = el.textContent?.trim();
                if (!text || !/^\d+[a-zA-Z]?$/.test(text)) return;

                // Versuche Position des Elements zu ermitteln
                let x = 0, y = 0;
                try {
                    const rect = el.getBoundingClientRect();
                    x = rect.left + rect.width / 2;
                    y = rect.top + rect.height / 2;

                    // Für SVG-Elemente: Versuche transform oder direkte Koordinaten
                    if (el.tagName === 'text' || el.tagName === 'tspan') {
                        const transform = el.getAttribute('transform');
                        if (transform) {
                            const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
                            if (match) {
                                x = parseFloat(match[1]) || x;
                                y = parseFloat(match[2]) || y;
                            }
                        }

                        // Direkte x/y Attribute
                        const svgX = el.getAttribute('x');
                        const svgY = el.getAttribute('y');
                        if (svgX && svgY) {
                            x = parseFloat(svgX) || x;
                            y = parseFloat(svgY) || y;
                        }
                    }
                } catch (e) {
                    // Fallback: Verwende Element-Position
                    try {
                        const rect = el.getBoundingClientRect();
                        x = rect.left;
                        y = rect.top;
                    } catch (e2) {
                        x = Math.random() * 1000; // Zufällige Position als letzter Ausweg
                        y = Math.random() * 1000;
                    }
                }

                hnWithPositions.push({
                    element: el,
                    number: text.toLowerCase(),
                    x: x,
                    y: y
                });
            });

            // Wende einheitliche Transparenz auf alle HN an (kein rotes Highlighting)
            let processedCount = 0;

            hnWithPositions.forEach((hn, index) => {
                const el = hn.element;

                // Speichere ursprünglichen Style
                if (!this.originalStyles.has(el)) {
                    this.originalStyles.set(el, {
                        opacity: el.style.opacity || '',
                        backgroundColor: el.style.backgroundColor || '',
                        zIndex: el.style.zIndex || ''
                    });
                }

                // Alle HN bekommen 80% Deckkraft + roten Hintergrund für beste Erkennung
                el.style.opacity = '0.8';
                el.style.backgroundColor = CONFIG.import.visualDuplicateColor || 'rgba(255, 0, 0, 0.4)';
                el.style.zIndex = '9999';
                el.title = `Hausnummer ${hn.number} (transparent für bessere Sicht)`;
                processedCount++;
            });

            console.log(`${SCRIPT_NAME}: ${processedCount} Hausnummern transparent gemacht (50% Deckkraft)`);
            console.log(`${SCRIPT_NAME}: Kein rotes Highlighting - nur weiße Transparenz für bessere Sicht`);

        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler bei visueller Duplikatserkennung:`, e);
        }
    },

    // Stelle ursprüngliche Styles wieder her
    restoreOriginalStyles() {
        this.originalStyles.forEach((originalStyle, element) => {
            try {
                element.style.opacity = originalStyle.opacity;
                element.style.backgroundColor = originalStyle.backgroundColor;
                element.style.zIndex = originalStyle.zIndex;
                element.removeAttribute('title');
            } catch (e) {
                // Element möglicherweise nicht mehr im DOM
            }
        });
        this.originalStyles.clear();
    },

    // DOM Observer für neue HN-Elemente
    startDOMObserver() {
        if (this.domObserver) return;

        this.domObserver = new MutationObserver((mutations) => {
            let hasNewHN = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Prüfe ob neue HN-Elemente hinzugefügt wurden
                        const text = node.textContent?.trim();
                        if (text && /^\d+[a-zA-Z]?$/.test(text) && text.length <= 4) {
                            hasNewHN = true;
                        }

                        // Prüfe auch Kinder-Elemente
                        const hnChildren = node.querySelectorAll?.('text, span, div');
                        if (hnChildren) {
                            hnChildren.forEach(child => {
                                const childText = child.textContent?.trim();
                                if (childText && /^\d+[a-zA-Z]?$/.test(childText) && childText.length <= 4) {
                                    hasNewHN = true;
                                }
                            });
                        }
                    }
                });
            });

            if (hasNewHN) {
                // Verzögerte Aktualisierung um DOM-Updates abzuwarten
                setTimeout(() => {
                    if (this.isActive) {
                        this.applyTransparencyToHouseNumbers();
                    }
                }, 500);
            }
        });

        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// ============================================================================
// MANUAL PAUSE SYSTEM - Pausieren während Import für Korrekturen
// ============================================================================
const ManualPauseSystem = {
    isPaused: false,
    pauseResolve: null,
    pauseButton: null,
    continueButton: null,
    pauseOverlay: null,

    // Erstelle Pause-UI
    createPauseUI() {
        if (this.pauseButton) return; // Bereits erstellt

        // Pause Button (immer sichtbar während Import)
        this.pauseButton = document.createElement('button');
        this.pauseButton.id = 'manual-pause-btn';
        this.pauseButton.innerHTML = '⏸️ Import Pausieren';
        this.pauseButton.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: none;
        `;

        this.pauseButton.onclick = () => this.requestPause();
        document.body.appendChild(this.pauseButton);

        // Continue Button (nur sichtbar wenn pausiert)
        this.continueButton = document.createElement('button');
        this.continueButton.id = 'manual-continue-btn';
        this.continueButton.innerHTML = '▶️ Import Fortsetzen';
        this.continueButton.style.cssText = `
            position: fixed;
            top: 180px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: none;
        `;

        this.continueButton.onclick = () => this.resumeImport();
        document.body.appendChild(this.continueButton);
    },

    // Zeige Pause-Button während Import
    showPauseButton() {
        this.createPauseUI();
        if (this.pauseButton) {
            this.pauseButton.style.display = 'block';
        }
    },

    // Verstecke Pause-Button nach Import
    hidePauseButton() {
        if (this.pauseButton) {
            this.pauseButton.style.display = 'none';
        }
        if (this.continueButton) {
            this.continueButton.style.display = 'none';
        }
        this.removePauseOverlay();
    },

    // Benutzer möchte pausieren
    requestPause() {
        if (this.isPaused) return;

        this.isPaused = true;
        log('Import manuell pausiert - Korrekturen können vorgenommen werden', 'warning');

        // Zeige Continue-Button
        if (this.continueButton) {
            this.continueButton.style.display = 'block';
        }

        // Verstecke Pause-Button
        if (this.pauseButton) {
            this.pauseButton.style.display = 'none';
        }

        // Zeige Pause-Overlay
        this.showPauseOverlay();

        // Aktiviere visuelle Duplikatserkennung während Pause
        VisualDuplicateDetector.activate();
    },

    // Import fortsetzen
    resumeImport() {
        if (!this.isPaused) return;

        this.isPaused = false;
        log('Import wird fortgesetzt...', 'success');

        // Zeige Pause-Button wieder
        if (this.pauseButton) {
            this.pauseButton.style.display = 'block';
        }

        // Verstecke Continue-Button
        if (this.continueButton) {
            this.continueButton.style.display = 'none';
        }

        // Entferne Pause-Overlay
        this.removePauseOverlay();

        // Deaktiviere visuelle Duplikatserkennung
        VisualDuplicateDetector.deactivate();

        // Löse Promise auf wenn vorhanden
        if (this.pauseResolve) {
            this.pauseResolve();
            this.pauseResolve = null;
        }
    },

    // Warte auf Resume (für async/await)
    async waitForResume() {
        if (!this.isPaused) return;

        return new Promise(resolve => {
            this.pauseResolve = resolve;
        });
    },

    // Zeige Pause-Overlay
    showPauseOverlay() {
        this.removePauseOverlay(); // Entferne altes Overlay

        this.pauseOverlay = document.createElement('div');
        this.pauseOverlay.id = 'manual-pause-overlay';
        this.pauseOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9998;
            pointer-events: auto;
        `;

        // Klick auf Overlay schließt es
        this.pauseOverlay.onclick = (e) => {
            if (e.target === this.pauseOverlay) {
                this.removePauseOverlay();
            }
        };

        const pauseInfo = document.createElement('div');
        pauseInfo.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            text-align: center;
            pointer-events: auto;
            max-width: 400px;
            position: relative;
        `;

        // Verhindere dass Klicks auf das Info-Panel das Overlay schließen
        pauseInfo.onclick = (e) => {
            e.stopPropagation();
        };

        pauseInfo.innerHTML = `
            <button onclick="ManualPauseSystem.removePauseOverlay()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
            " title="Schließen">&times;</button>
            <h3 style="margin: 0 0 15px 0; color: #ff9800;">⏸️ Import Pausiert</h3>
            <p style="margin: 0 0 15px 0;">
                Der Import wurde pausiert. Sie können jetzt:<br>
                • Fehler im aktuellen Bildschirmausschnitt korrigieren<br>
                • Doppelte Hausnummern (rot hervorgehoben) löschen<br>
                • Segmente bearbeiten<br>
                • Straßennamen korrigieren
            </p>
            <p style="margin: 0 0 15px 0; font-size: 12px; color: #666;">
                Klicken Sie "Import Fortsetzen" wenn Sie fertig sind.<br>
                Am Ende kehrt der Import zum ursprünglichen Bildschirmausschnitt zurück.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="ManualPauseSystem.resumeImport()" style="
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">▶️ Import Fortsetzen</button>
                <button onclick="ManualPauseSystem.removePauseOverlay()" style="
                    background: #757575;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Overlay schließen</button>
            </div>
        `;

        this.pauseOverlay.appendChild(pauseInfo);
        document.body.appendChild(this.pauseOverlay);
    },

    // Entferne Pause-Overlay
    removePauseOverlay() {
        if (this.pauseOverlay) {
            this.pauseOverlay.remove();
            this.pauseOverlay = null;
        }
    },

    // Cleanup
    cleanup() {
        this.hidePauseButton();
        if (this.pauseButton) {
            this.pauseButton.remove();
            this.pauseButton = null;
        }
        if (this.continueButton) {
            this.continueButton.remove();
            this.continueButton = null;
        }
        this.isPaused = false;
        this.pauseResolve = null;
    }
};

// Mache ManualPauseSystem global verfügbar für onclick-Handler
unsafeWindow.ManualPauseSystem = ManualPauseSystem;
const BlockedHouseNumbers = {
    storageKey: 'wme-hn-import-blocked',

    // Lade blockierte HN aus LocalStorage
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Laden blockierter HN:`, e);
            return {};
        }
    },

    // Speichere blockierte HN in LocalStorage
    save(blockedMap) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(blockedMap));
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Speichern blockierter HN:`, e);
        }
    },

    // Füge HN zur Blocklist hinzu
    add(number, segmentId, reason = 'Manuell blockiert') {
        const blocked = this.load();
        const key = `${number}_${segmentId}`;
        blocked[key] = {
            number: number,
            segmentId: segmentId,
            reason: reason,
            timestamp: Date.now()
        };
        this.save(blocked);
        this.updateUI();
        return key;
    },

    // Entferne HN aus Blocklist
    remove(key) {
        const blocked = this.load();
        delete blocked[key];
        this.save(blocked);
        this.updateUI();
    },

    // Prüfe ob HN blockiert ist
    isBlocked(number, segmentId) {
        const blocked = this.load();
        const key = `${number}_${segmentId}`;
        return blocked.hasOwnProperty(key);
    },

    // Alle blockierten HN abrufen
    getAll() {
        return this.load();
    },

    // Alle blockierten HN löschen
    clear() {
        localStorage.removeItem(this.storageKey);
        this.updateUI();
    },

    // UI aktualisieren
    updateUI() {
        const container = document.getElementById('blocked-hn-list');
        if (!container) return;

        const blocked = this.load();
        const keys = Object.keys(blocked);

        if (keys.length === 0) {
            container.innerHTML = '<div style="color:#666;font-style:italic;padding:10px;">Keine blockierten Hausnummern</div>';
            return;
        }

        let html = '<div style="max-height:150px;overflow-y:auto;">';
        for (const key of keys) {
            const hn = blocked[key];
            const date = new Date(hn.timestamp).toLocaleString();
            html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:5px;border-bottom:1px solid #eee;">
                    <div>
                        <strong>HN ${hn.number}</strong>
                        <small style="color:#666;">(Segment: ${hn.segmentId})</small><br>
                        <small style="color:#999;">${hn.reason} - ${date}</small>
                    </div>
                    <button onclick="BlockedHouseNumbers.remove('${key}')" class="btn btn-danger" style="padding:2px 6px;font-size:10px;">🗑️</button>
                </div>
            `;
        }
        html += '</div>';

        container.innerHTML = html;

        // Counter aktualisieren
        const counter = document.getElementById('blocked-hn-count');
        if (counter) {
            counter.textContent = keys.length;
        }
    }
};

// ============================================================================
// GLOBALE VARIABLEN
// ============================================================================
let wmeSDK = null;
let W = null;
let loadedData = [];
let importStats = { total: 0, processed: 0, successful: 0, failed: 0, skipped: 0, errors: [] };

// WICHTIG: Globales Tracking aller importierten HN in dieser Session
// Key: "nummer_lat_lon" (gerundet auf 4 Dezimalstellen)
const globalImportedHN = new Map();

// Tracking für PENDING HN (noch nicht gespeichert) - für Fehler-Analyse
// Wird bei jedem Import gefüllt, bei erfolgreichem Speichern geleert
const pendingHouseNumbers = new Map(); // Key: "nummer_segmentId" -> {number, street, lat, lon, segmentId, timestamp}

// Detaillierter Import-Report
let importReport = {
    missingStreets: new Map(),      // Straßen ohne Segment: street -> [{number, coords}]
    duplicates: [],                  // Übersprungene Duplikate
    successful: [],                  // Erfolgreich importiert
    failed: [],                      // Fehlgeschlagen mit Grund
    streetMismatch: [],             // Straßenname stimmt nicht überein
    tooFarAway: [],                 // Segment zu weit entfernt
    startTime: null,
    endTime: null
};

// ============================================================================
// SPEICHER-FEHLER HANDLER - Fängt WME Save-Fehler ab und analysiert sie
// ============================================================================
const SaveErrorHandler = {
    // Bekannte Fehlertypen und ihre Beschreibungen
    ERROR_TYPES: {
        DUPLICATE_HN: {
            patterns: [
                /house\s*number.*already\s*exists/i,
                /hausnummer.*existiert.*bereits/i,
                /duplicate.*house\s*number/i,
                /hn.*already.*exists/i,
                /number.*already.*assigned/i
            ],
            description: 'Hausnummer existiert bereits',
            icon: '🔄',
            autoFixable: true,
            autoFixAction: 'remove_duplicate'
        },
        HN_TOO_FAR: {
            patterns: [
                /house\s*number.*too\s*far/i,
                /hausnummer.*zu\s*weit/i,
                /distance.*exceeds/i,
                /too\s*far\s*from\s*segment/i,
                /point.*outside.*range/i
            ],
            description: 'Hausnummer zu weit vom Segment entfernt',
            icon: '📏',
            autoFixable: true,
            autoFixAction: 'snap_to_segment'
        },
        HN_IN_PLACE: {
            patterns: [
                /house\s*number.*in\s*place/i,
                /hausnummer.*im\s*place/i,
                /address.*point.*venue/i,
                /hn.*exists.*venue/i
            ],
            description: 'Hausnummer existiert bereits in einem Place',
            icon: '🏪',
            autoFixable: false
        },
        SEGMENT_LOCKED: {
            patterns: [
                /segment.*locked/i,
                /segment.*gesperrt/i,
                /insufficient.*rank/i,
                /permission.*denied/i,
                /not.*authorized/i
            ],
            description: 'Segment ist gesperrt (höherer Rang erforderlich)',
            icon: '🔒',
            autoFixable: false
        },
        INVALID_NUMBER: {
            patterns: [
                /invalid.*house\s*number/i,
                /ungültige.*hausnummer/i,
                /number.*format/i,
                /invalid.*format/i
            ],
            description: 'Ungültiges Hausnummern-Format',
            icon: '❌',
            autoFixable: false
        },
        NETWORK_ERROR: {
            patterns: [
                /network.*error/i,
                /timeout/i,
                /connection.*failed/i,
                /server.*error/i,
                /500|502|503|504/
            ],
            description: 'Netzwerk-/Server-Fehler',
            icon: '🌐',
            autoFixable: false
        },
        UNKNOWN: {
            patterns: [],
            description: 'Unbekannter Fehler',
            icon: '❓',
            autoFixable: false
        }
    },

    // Gesammelte Fehler aus dem letzten Speichervorgang
    lastSaveErrors: [],

    // Cooldown um Loops zu verhindern
    lastErrorScan: 0,
    errorScanCooldown: 2000, // 2 Sekunden Cooldown

    // Fehler-Statistiken
    errorStats: {
        totalSaves: 0,
        successfulSaves: 0,
        failedSaves: 0,
        errorsByType: {}
    },

    // Initialisierung - Event-Listener registrieren
    init() {
        // IMMER den DOM-Observer starten (für WME-Dialoge)
        this.initFallback();

        if (!wmeSDK?.Events) {
            console.log(`${SCRIPT_NAME}: SaveErrorHandler - SDK Events nicht verfügbar, nur DOM-Fallback aktiv`);
            return;
        }

        // wme-save-finished Event zusätzlich registrieren
        try {
            wmeSDK.Events.on({
                eventName: 'wme-save-finished',
                eventHandler: (event) => this.handleSaveFinished(event)
            });
            console.log(`${SCRIPT_NAME}: SaveErrorHandler initialisiert (SDK Events + DOM Fallback)`);
        } catch (e) {
            console.log(`${SCRIPT_NAME}: SaveErrorHandler SDK-Fehler:`, e);
        }
    },

    // Fallback: Überwache DOM für Fehlermeldungen
    initFallback() {
        // MutationObserver für WME Fehlermeldungen - VERBESSERT
        const observer = new MutationObserver((mutations) => {
            // Cooldown prüfen um Loops zu verhindern
            const now = Date.now();
            if (now - this.lastErrorScan < this.errorScanCooldown) {
                return;
            }

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Ignoriere HTML, BODY, SCRIPT, STYLE Elemente
                        if (['HTML', 'BODY', 'SCRIPT', 'STYLE', 'LINK', 'META'].includes(node.tagName)) {
                            continue;
                        }

                        // Ignoriere sehr große Elemente (wahrscheinlich Container)
                        const nodeText = node.textContent || '';
                        if (nodeText.length > 5000) {
                            continue;
                        }

                        // Ignoriere Script-Inhalte
                        if (nodeText.includes('dataLayer') || nodeText.includes('gtm.js')) {
                            continue;
                        }

                        // Erweiterte Dialog-Erkennung - NUR echte Dialoge
                        const isDialog = node.matches?.('[role="dialog"], [role="alertdialog"], .wz-dialog, .wz-modal, .wz-toast, .wz-snackbar');
                        const hasDialogChild = node.querySelector?.('[role="dialog"], [role="alertdialog"], .wz-dialog, .wz-modal');

                        // Auch Text-basierte Erkennung - aber nur für kleine Elemente
                        const hasErrorText = nodeText.length < 2000 && (
                            nodeText.includes('Hausnummer existiert bereits') ||
                            /\d{1,3}\s*Fehler/i.test(nodeText)
                        );

                        if (isDialog || hasDialogChild || hasErrorText) {
                            this.lastErrorScan = now;
                            console.log(`${SCRIPT_NAME}: Potentieller Fehler-Dialog erkannt:`, node.tagName, node.className);
                            this.scanElementForErrors(node);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log(`${SCRIPT_NAME}: SaveErrorHandler initialisiert (DOM Fallback)`);
    },

    // Scannt ein Element und seine Kinder nach Fehlermeldungen
    scanElementForErrors(element) {
        if (!element) return;

        const elementText = element.textContent || element.innerText || '';

        // Nur verarbeiten wenn es wirklich nach einem Fehler-Dialog aussieht
        if (!this.looksLikeError(elementText)) {
            return;
        }

        // Fehler extrahieren
        this.extractAndParseWMEError(element);
    },

    // Prüft ob ein Text wie eine Fehlermeldung aussieht
    looksLikeError(text) {
        if (!text || text.length < 5) return false;
        // Ignoriere sehr lange Texte (wahrscheinlich ganze Seite)
        if (text.length > 5000) return false;
        // Ignoriere Texte mit Script-Tags oder dataLayer (Google Tag Manager)
        if (text.includes('dataLayer') || text.includes('gtm.js') || text.includes('googletagmanager')) return false;

        const lowerText = text.toLowerCase();
        return lowerText.includes('fehler') ||
               lowerText.includes('error') ||
               lowerText.includes('existiert bereits') ||
               lowerText.includes('already exists') ||
               lowerText.includes('zu weit') ||
               lowerText.includes('too far') ||
               lowerText.includes('gesperrt') ||
               lowerText.includes('locked') ||
               lowerText.includes('speichern');
    },

    // Extrahiert Fehlerdetails aus WME-Dialog - ROBUSTE VERSION
    extractAndParseWMEError(element) {
        // Ignoriere das gesamte HTML-Dokument
        if (element.tagName === 'HTML' || element.tagName === 'BODY') {
            console.log(`${SCRIPT_NAME}: Ignoriere HTML/BODY Element`);
            return;
        }

        const fullText = element.textContent || element.innerText || '';

        // Ignoriere sehr lange Texte (wahrscheinlich ganze Seite)
        if (fullText.length > 5000) {
            console.log(`${SCRIPT_NAME}: Ignoriere zu langen Text (${fullText.length} Zeichen)`);
            return;
        }

        // Ignoriere Texte mit Script-Inhalten
        if (fullText.includes('dataLayer') || fullText.includes('gtm.js') || fullText.includes('googletagmanager')) {
            console.log(`${SCRIPT_NAME}: Ignoriere Script-Inhalt`);
            return;
        }

        console.log(`${SCRIPT_NAME}: === WME DIALOG ANALYSE ===`);
        console.log(`${SCRIPT_NAME}: Element:`, element.className, element.tagName);
        console.log(`${SCRIPT_NAME}: Textlänge:`, fullText.length);
        console.log(`${SCRIPT_NAME}: Volltext (erste 500 Zeichen):`, fullText.substring(0, 500));

        // SPEZIELLE ERKENNUNG für WME-Fehler-Dialog wie im Screenshot
        let totalErrors = 0;
        let errorMessage = 'Unbekannter Fehler';
        let errorType = 'DUPLICATE_HN';

        // Suche nach "Hausnummer existiert bereits" (wie im Screenshot)
        if (fullText.includes('Hausnummer existiert bereits') ||
            fullText.includes('house number already exists')) {

            errorType = 'DUPLICATE_HN';
            errorMessage = 'Hausnummer existiert bereits';

            // Versuche Anzahl zu extrahieren - NUR kleine Zahlen (1-999)
            const numberMatches = fullText.match(/\b(\d{1,3})\b/g);
            if (numberMatches && numberMatches.length > 0) {
                // Filtere nur sinnvolle Zahlen (1-999)
                const validNumbers = numberMatches
                    .map(n => parseInt(n))
                    .filter(n => n >= 1 && n <= 999);

                if (validNumbers.length > 0) {
                    // Nimm die größte sinnvolle Zahl als Fehleranzahl
                    totalErrors = Math.max(...validNumbers);
                }
            }
        }

        // Fallback: Suche nach anderen Fehler-Indikatoren
        if (totalErrors === 0) {
            const errorPatterns = [
                /(\d{1,3})\s*Fehler/i,
                /(\d{1,3})\s*error/i,
                /(\d{1,3})\s*duplicate/i,
                /Fehler\s*(\d{1,3})/i,
                /Error\s*(\d{1,3})/i
            ];

            for (const pattern of errorPatterns) {
                const match = fullText.match(pattern);
                if (match) {
                    const num = parseInt(match[1]);
                    if (num >= 1 && num <= 999) {
                        totalErrors = Math.max(totalErrors, num);
                    }
                }
            }
        }

        // Mindestens 1 Fehler wenn Dialog vorhanden und Fehlertext erkannt
        if (totalErrors === 0 && (fullText.includes('existiert bereits') || fullText.includes('already exists'))) {
            totalErrors = 1;
        }

        // Wenn keine Fehler erkannt, abbrechen
        if (totalErrors === 0) {
            console.log(`${SCRIPT_NAME}: Keine Fehler im Dialog erkannt`);
            return;
        }

        console.log(`${SCRIPT_NAME}: Erkannte Fehleranzahl: ${totalErrors}`);
        console.log(`${SCRIPT_NAME}: Fehlertyp: ${errorType}`);
        console.log(`${SCRIPT_NAME}: Nachricht: ${errorMessage}`);

        // Lösche alte Fehler und erstelle neue
        this.lastSaveErrors = [];

        // Erstelle die korrekte Anzahl von Fehlern
        for (let i = 0; i < totalErrors; i++) {
            const errorObj = {
                type: errorType,
                config: this.ERROR_TYPES[errorType],
                originalMessage: `${errorMessage} (${i + 1}/${totalErrors})`,
                details: {
                    count: 1,
                    index: i + 1,
                    total: totalErrors
                },
                timestamp: new Date(),
                source: 'WME-Dialog'
            };

            this.lastSaveErrors.push(errorObj);
        }

        this.errorStats.errorsByType[errorType] = totalErrors;

        console.log(`${SCRIPT_NAME}: ${totalErrors} Fehler vom Typ ${errorType} erfasst`);

        // Fehler-Button aktualisieren
        const errorBtn = document.getElementById('btn-show-save-errors');
        if (errorBtn) {
            errorBtn.style.display = 'inline-block';
            errorBtn.textContent = `❌ ${totalErrors} Fehler`;
        }

        // Log-Ausgabe für Benutzer
        log(`❌ ${totalErrors} Fehler erkannt: ${errorMessage}`, 'error');
    },

    // Save-Finished Event Handler
    handleSaveFinished(event) {
        this.errorStats.totalSaves++;
        const detail = event?.detail || event;
        const success = detail?.success ?? true;

        if (success) {
            this.errorStats.successfulSaves++;
            this.lastSaveErrors = [];

            // Pending HN leeren bei erfolgreichem Speichern
            const savedCount = pendingHouseNumbers.size;
            pendingHouseNumbers.clear();

            // Fehler-Button verstecken bei Erfolg
            const errorBtn = document.getElementById('btn-show-save-errors');
            if (errorBtn) {
                errorBtn.style.display = 'none';
            }

            log(`✅ Speichern erfolgreich (${savedCount} HN)`, 'success');
            return;
        }

        this.errorStats.failedSaves++;

        // Fehler aus verschiedenen Quellen sammeln
        this.collectErrors(detail);

        // Fehler anzeigen
        if (this.lastSaveErrors.length > 0) {
            this.showErrorSummary();
        }
    },

    // Fehler aus verschiedenen Quellen sammeln
    collectErrors(detail) {
        this.lastSaveErrors = [];

        // 1. Fehler aus Event-Detail
        if (detail?.errors) {
            const errors = Array.isArray(detail.errors) ? detail.errors : [detail.errors];
            errors.forEach(err => this.parseAndCategorizeError(err));
        }

        // 2. Fehler aus W.model.actionManager
        try {
            if (W?.model?.actionManager) {
                const actions = W.model.actionManager.getActions?.() || [];
                for (const action of actions) {
                    if (action?.error || action?.lastError) {
                        this.parseAndCategorizeError(action.error || action.lastError);
                    }
                }
            }
        } catch (e) {}

        // 3. Fehler aus DOM (WME Fehlermeldungen) - erweiterte Suche
        try {
            // Alle möglichen Fehler-Container
            const selectors = [
                '.save-error',
                '.error-message',
                '[class*="save"][class*="error"]',
                // WME Modal/Dialog
                '.wz-dialog',
                '.wz-modal',
                '[class*="modal-content"]',
                '[class*="dialog-content"]',
                '[role="dialog"]',
                '[role="alertdialog"]',
                // Toast/Notification
                '[class*="toast"]',
                '[class*="notification"]',
                '[class*="alert"]'
            ];

            const errorElements = document.querySelectorAll(selectors.join(', '));
            errorElements.forEach(el => {
                const text = el.textContent || el.innerText;
                if (text && this.looksLikeError(text)) {
                    this.extractAndParseWMEError(el);
                }
            });
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler beim DOM-Scan:`, e);
        }

        // 4. Suche nach dem spezifischen WME Fehler-Dialog (erweiterte Suche)
        try {
            // Erweiterte Selektoren für WME-Dialoge
            const dialogSelectors = [
                // Standard WME Dialoge
                '.wz-dialog',
                '.wz-modal',
                '[class*="modal"]',
                '[class*="dialog"]',
                '[role="dialog"]',
                '[role="alertdialog"]',
                // Spezifische WME Fehler-Container
                '[class*="save"][class*="error"]',
                '[class*="error"][class*="message"]',
                // Text-basierte Suche
                '*'
            ];

            for (const selector of dialogSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    const text = el.textContent || '';

                    // Erweiterte Fehler-Erkennung
                    if (text.includes('Fehler beim Speichern') ||
                        text.includes('Hausnummer existiert bereits') ||
                        text.includes('house number already exists') ||
                        text.includes('duplicate house number') ||
                        /\d+\s*Fehler/i.test(text) ||
                        /\d+\s*error/i.test(text)) {

                        console.log(`${SCRIPT_NAME}: Gefundener Fehler-Dialog:`, selector, text.substring(0, 200));
                        this.extractAndParseWMEError(el);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Erweiterte Dialog-Suche Fehler:`, e);
        }
    },

    // Fehler parsen und kategorisieren
    parseAndCategorizeError(errorInput) {
        const errorText = typeof errorInput === 'string'
            ? errorInput
            : errorInput?.message || errorInput?.toString() || '';

        if (!errorText.trim()) return;

        // Prüfe gegen bekannte Fehlermuster
        let errorType = 'UNKNOWN';
        let matchedPattern = null;

        for (const [type, config] of Object.entries(this.ERROR_TYPES)) {
            if (type === 'UNKNOWN') continue;

            for (const pattern of config.patterns) {
                if (pattern.test(errorText)) {
                    errorType = type;
                    matchedPattern = pattern;
                    break;
                }
            }
            if (errorType !== 'UNKNOWN') break;
        }

        // Extrahiere Details (Hausnummer, Straße, etc.)
        const details = this.extractErrorDetails(errorText);

        const errorObj = {
            type: errorType,
            config: this.ERROR_TYPES[errorType],
            originalMessage: errorText,
            details: details,
            timestamp: new Date(),
            matchedPattern: matchedPattern?.toString()
        };

        // Duplikate vermeiden
        const isDuplicate = this.lastSaveErrors.some(e =>
            e.type === errorObj.type &&
            e.originalMessage === errorObj.originalMessage
        );

        if (!isDuplicate) {
            this.lastSaveErrors.push(errorObj);

            // Statistik aktualisieren
            this.errorStats.errorsByType[errorType] = (this.errorStats.errorsByType[errorType] || 0) + 1;
        }
    },

    // Details aus Fehlermeldung extrahieren
    extractErrorDetails(errorText) {
        const details = {};

        // Hausnummer extrahieren
        const hnMatch = errorText.match(/(?:house\s*number|hausnummer|hn)[:\s]*["']?(\d+[a-zA-Z]?)["']?/i) ||
                        errorText.match(/["'](\d+[a-zA-Z]?)["']/);
        if (hnMatch) details.houseNumber = hnMatch[1];

        // Straßenname extrahieren
        const streetMatch = errorText.match(/(?:street|straße|strasse)[:\s]*["']?([^"'\n,]+)["']?/i);
        if (streetMatch) details.street = streetMatch[1].trim();

        // Segment-ID extrahieren
        const segmentMatch = errorText.match(/segment[:\s#]*(\d+)/i);
        if (segmentMatch) details.segmentId = segmentMatch[1];

        // Distanz extrahieren
        const distanceMatch = errorText.match(/(\d+(?:\.\d+)?)\s*(?:m|meter|metres)/i);
        if (distanceMatch) details.distance = parseFloat(distanceMatch[1]);

        return details;
    },

    // Fehler-Zusammenfassung anzeigen
    showErrorSummary() {
        if (this.lastSaveErrors.length === 0) {
            log('Keine Fehler zum Anzeigen', 'info');
            return;
        }

        // Fehler-Button sichtbar machen
        const errorBtn = document.getElementById('btn-show-save-errors');
        if (errorBtn) {
            const totalErrors = this.lastSaveErrors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
            errorBtn.style.display = 'inline-block';
            errorBtn.textContent = `❌ ${totalErrors} Fehler`;
        }

        // Gruppiere Fehler nach Typ
        const grouped = {};
        for (const error of this.lastSaveErrors) {
            if (!grouped[error.type]) {
                grouped[error.type] = [];
            }
            grouped[error.type].push(error);
        }

        // Log-Ausgabe
        const totalErrors = this.lastSaveErrors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
        log(`❌ Speichern fehlgeschlagen: ${totalErrors} Fehler`, 'error');

        // Detaillierte Ausgabe pro Typ
        for (const [type, errors] of Object.entries(grouped)) {
            const config = this.ERROR_TYPES[type];
            const typeCount = errors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
            log(`${config.icon} ${config.description}: ${typeCount}x`, 'warning');
        }

        // Modal anzeigen
        this.showErrorModal(grouped);
    },

    // Fehler-Modal anzeigen
    showErrorModal(groupedErrors) {
        // Hole alle pending HN für die Fehler-Zuordnung
        const pendingList = Array.from(pendingHouseNumbers.values());

        // Versuche Fehler den pending HN zuzuordnen
        const hnWithErrors = this.matchErrorsToHN(pendingList, groupedErrors);

        // Prüfe ob Modal bereits existiert
        let modal = document.getElementById('hn-save-error-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'hn-save-error-modal';
            modal.innerHTML = `
                <div class="hn-modal-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;">
                    <div class="hn-modal-content" style="background:#fff;border-radius:8px;max-width:800px;width:95%;max-height:85vh;overflow:auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
                        <div class="hn-modal-header" style="padding:15px 20px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;background:#f44336;color:white;border-radius:8px 8px 0 0;">
                            <h3 style="margin:0;font-size:16px;">❌ Speicher-Fehler Analyse</h3>
                            <button id="btn-close-save-error" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">&times;</button>
                        </div>
                        <div id="save-error-content" style="padding:20px;max-height:60vh;overflow-y:auto;"></div>
                        <div class="hn-modal-footer" style="padding:15px 20px;border-top:1px solid #ddd;display:flex;gap:10px;justify-content:space-between;flex-wrap:wrap;">
                            <div style="display:flex;gap:10px;">
                                <button id="btn-auto-fix-duplicates" class="btn btn-warning" title="Entfernt alle Duplikat-HN automatisch">🔧 Duplikate entfernen</button>
                                <button id="btn-remove-all-pending" class="btn btn-danger" title="Alle pending HN aus Änderungen entfernen">🗑️ Alle entfernen</button>
                            </div>
                            <div style="display:flex;gap:10px;">
                                <button id="btn-copy-errors" class="btn btn-secondary">📋 Kopieren</button>
                                <button id="btn-dismiss-errors" class="btn btn-primary">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event-Listener
            modal.querySelector('#btn-close-save-error').addEventListener('click', () => modal.style.display = 'none');
            modal.querySelector('#btn-dismiss-errors').addEventListener('click', () => modal.style.display = 'none');
            modal.querySelector('.hn-modal-overlay').addEventListener('click', (e) => {
                if (e.target.classList.contains('hn-modal-overlay')) modal.style.display = 'none';
            });
            modal.querySelector('#btn-copy-errors').addEventListener('click', () => this.copyErrorsToClipboard());
            modal.querySelector('#btn-remove-all-pending').addEventListener('click', () => this.removeAllPendingHN());
            modal.querySelector('#btn-auto-fix-duplicates').addEventListener('click', () => this.autoFixDuplicates());
        }

        // Inhalt generieren
        const content = modal.querySelector('#save-error-content');
        const totalErrors = this.lastSaveErrors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
        const pendingCount = pendingList.length;
        const actionCount = W?.model?.actionManager?.getActions()?.length || 0;

        // Zähle Fehlertypen aus den Fehlern selbst
        let duplicateErrorCount = 0;
        let lockedErrorCount = 0;
        let otherErrorCount = 0;

        for (const [type, errors] of Object.entries(groupedErrors)) {
            const count = errors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
            if (type === 'DUPLICATE_HN') duplicateErrorCount = count;
            else if (type === 'SEGMENT_LOCKED') lockedErrorCount = count;
            else if (type !== 'UNKNOWN') otherErrorCount += count;
        }

        let html = `
            <div style="margin-bottom:15px;">
                <p style="margin:0 0 10px;color:#666;">
                    <strong>${totalErrors}</strong> Fehler beim Speichern.
                    ${actionCount > 0 ? `<br><small>${actionCount} ausstehende Änderungen im Editor.</small>` : ''}
                </p>
                <div style="display:flex;gap:15px;flex-wrap:wrap;">
                    ${duplicateErrorCount > 0 ? `<span style="padding:4px 10px;background:#ffcdd2;border-radius:4px;font-size:12px;">🔄 ${duplicateErrorCount} Duplikate</span>` : ''}
                    ${lockedErrorCount > 0 ? `<span style="padding:4px 10px;background:#ffe0b2;border-radius:4px;font-size:12px;">🔒 ${lockedErrorCount} Gesperrt</span>` : ''}
                    ${otherErrorCount > 0 ? `<span style="padding:4px 10px;background:#e0e0e0;border-radius:4px;font-size:12px;">❓ ${otherErrorCount} Andere</span>` : ''}
                </div>
            </div>
        `;

        // Fehler-Details anzeigen
        html += `<div style="margin-bottom:15px;">`;
        for (const [type, errors] of Object.entries(groupedErrors)) {
            const config = this.ERROR_TYPES[type];
            const errorCount = errors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
            const bgColor = type === 'DUPLICATE_HN' ? '#ffebee' : type === 'SEGMENT_LOCKED' ? '#fff3e0' : '#f5f5f5';
            const borderColor = type === 'DUPLICATE_HN' ? '#f44336' : type === 'SEGMENT_LOCKED' ? '#ff9800' : '#9e9e9e';

            html += `
                <div style="padding:10px;background:${bgColor};border-radius:4px;margin-bottom:8px;border-left:4px solid ${borderColor};">
                    <strong>${config.icon} ${config.description}</strong>
                    <span style="background:#e0e0e0;padding:2px 8px;border-radius:10px;font-size:11px;margin-left:5px;">${errorCount}x</span>
                    ${type === 'DUPLICATE_HN' ? '<span style="color:#4CAF50;font-size:11px;margin-left:10px;">✓ Auto-Fix: Alle Änderungen rückgängig machen</span>' : ''}
                    <div style="font-size:11px;color:#666;margin-top:5px;">
                        ${errors[0]?.originalMessage || ''}
                    </div>
                </div>
            `;
        }
        html += `</div>`;

        // Tabelle nur anzeigen wenn pending HN vorhanden
        if (pendingCount > 0) {
            // Versuche Fehler den pending HN zuzuordnen
            const hnWithErrors = this.matchErrorsToHN(pendingList, groupedErrors);

            // Sortiere: Fehler zuerst, dann OK
            const sortedHN = [...hnWithErrors].sort((a, b) => {
                if (a.errorType && !b.errorType) return -1;
                if (!a.errorType && b.errorType) return 1;
                return 0;
            });

            html += `
                <div style="margin-bottom:15px;">
                    <div style="font-weight:bold;margin-bottom:8px;">📋 Pending Hausnummern (${sortedHN.length})</div>
                    <div style="max-height:300px;overflow-y:auto;border:1px solid #ddd;border-radius:4px;">
                        <table style="width:100%;font-size:11px;border-collapse:collapse;">
                            <thead style="position:sticky;top:0;background:#f5f5f5;">
                                <tr>
                                    <th style="padding:6px;text-align:left;border-bottom:2px solid #ddd;">Status</th>
                                    <th style="padding:6px;text-align:left;border-bottom:2px solid #ddd;">HN</th>
                                    <th style="padding:6px;text-align:left;border-bottom:2px solid #ddd;">Straße</th>
                                    <th style="padding:6px;text-align:left;border-bottom:2px solid #ddd;">Koordinaten</th>
                                    <th style="padding:6px;text-align:center;border-bottom:2px solid #ddd;">Aktion</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            sortedHN.forEach((hn, idx) => {
                const lat = hn.lat?.toFixed(6) || '?';
                const lon = hn.lon?.toFixed(6) || '?';

                let statusIcon = '✓';
                let statusColor = '#c8e6c9';

                if (hn.errorType === 'DUPLICATE_HN') {
                    statusIcon = '🔄';
                    statusColor = '#ffcdd2';
                } else if (hn.errorType === 'SEGMENT_LOCKED') {
                    statusIcon = '🔒';
                    statusColor = '#ffe0b2';
                } else if (hn.errorType) {
                    statusIcon = '❓';
                    statusColor = '#e0e0e0';
                }

                html += `
                    <tr style="border-bottom:1px solid #eee;background:${idx % 2 ? '#fafafa' : 'white'};">
                        <td style="padding:5px;text-align:center;background:${statusColor};">${statusIcon}</td>
                        <td style="padding:5px;"><strong>${hn.number}</strong></td>
                        <td style="padding:5px;">${hn.street || '-'}</td>
                        <td style="padding:5px;font-family:monospace;font-size:10px;">${lat}, ${lon}</td>
                        <td style="padding:5px;text-align:center;white-space:nowrap;">
                            <button class="btn-goto-hn" data-lat="${hn.lat}" data-lon="${hn.lon}"
                                    style="background:#2196F3;color:white;border:none;border-radius:3px;padding:3px 8px;cursor:pointer;font-size:11px;"
                                    title="Zur Position springen">📍</button>
                            <button class="btn-remove-hn" data-number="${hn.number}" data-segment="${hn.segmentId}"
                                    style="background:#f44336;color:white;border:none;border-radius:3px;padding:3px 8px;cursor:pointer;font-size:11px;margin-left:3px;"
                                    title="Diese HN entfernen">🗑️</button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div></div>`;
        }

        // Tipps
        html += `
            <div style="padding:10px;background:#e3f2fd;border-radius:4px;font-size:12px;">
                <strong>💡 Tipps:</strong>
                <ul style="margin:5px 0 0 20px;padding:0;">
                    <li><strong>🔧 Duplikate entfernen:</strong> Macht alle Änderungen rückgängig - beim erneuten Import werden Duplikate übersprungen</li>
                    <li><strong>📍 Zur Position:</strong> Springt zur HN um sie manuell zu prüfen/korrigieren</li>
                    <li><strong>🔒 Gesperrt:</strong> Diese Segmente haben einen höheren Lock-Level - HN können nicht importiert werden</li>
                </ul>
            </div>
        `;

        content.innerHTML = html;

        // Event-Listener für die Buttons in der Tabelle
        content.querySelectorAll('.btn-goto-hn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lat = parseFloat(e.target.dataset.lat);
                const lon = parseFloat(e.target.dataset.lon);
                this.jumpToLocation(lat, lon);
            });
        });

        content.querySelectorAll('.btn-remove-hn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                const segmentId = e.target.dataset.segment;
                this.removePendingHN(number, segmentId);
                e.target.closest('tr')?.remove();
            });
        });

        // Auto-Fix Button nur anzeigen wenn Duplikate vorhanden
        const autoFixBtn = modal.querySelector('#btn-auto-fix-duplicates');
        autoFixBtn.style.display = duplicateErrorCount > 0 ? 'inline-block' : 'none';

        // Remove-All Button nur anzeigen wenn Actions vorhanden
        const removeAllBtn = modal.querySelector('#btn-remove-all-pending');
        removeAllBtn.style.display = actionCount > 0 ? 'inline-block' : 'none';

        modal.style.display = 'block';
    },

    // Versuche Fehler den pending HN zuzuordnen
    matchErrorsToHN(pendingList, groupedErrors) {
        // Kopiere pending Liste mit Fehler-Info
        const result = pendingList.map(hn => ({ ...hn, errorType: null }));

        // Wenn wir Duplikat-Fehler haben, markiere HN die wahrscheinlich Duplikate sind
        const duplicateErrors = groupedErrors['DUPLICATE_HN'] || [];
        const duplicateCount = duplicateErrors.reduce((sum, e) => sum + (e.details?.count || 1), 0);

        // Wenn Anzahl Fehler = Anzahl pending, sind wahrscheinlich alle betroffen
        // Ansonsten versuchen wir die ersten X zu markieren (nicht ideal, aber besser als nichts)
        if (duplicateCount > 0) {
            // Markiere die ersten X als potentielle Duplikate
            for (let i = 0; i < Math.min(duplicateCount, result.length); i++) {
                result[i].errorType = 'DUPLICATE_HN';
            }
        }

        // Gesperrte Segmente
        const lockedErrors = groupedErrors['SEGMENT_LOCKED'] || [];
        const lockedCount = lockedErrors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
        if (lockedCount > 0) {
            let marked = 0;
            for (let i = 0; i < result.length && marked < lockedCount; i++) {
                if (!result[i].errorType) {
                    result[i].errorType = 'SEGMENT_LOCKED';
                    marked++;
                }
            }
        }

        // Andere Fehler
        for (const [type, errors] of Object.entries(groupedErrors)) {
            if (type === 'DUPLICATE_HN' || type === 'SEGMENT_LOCKED' || type === 'UNKNOWN') continue;
            const count = errors.reduce((sum, e) => sum + (e.details?.count || 1), 0);
            let marked = 0;
            for (let i = 0; i < result.length && marked < count; i++) {
                if (!result[i].errorType) {
                    result[i].errorType = type;
                    marked++;
                }
            }
        }

        return result;
    },

    // Auto-Fix: Entferne nur die Duplikat-HN - SICHERE METHODE mit LocalStorage
    async autoFixDuplicates() {
        const pendingList = Array.from(pendingHouseNumbers.values());
        const grouped = {};
        for (const error of this.lastSaveErrors) {
            if (!grouped[error.type]) grouped[error.type] = [];
            grouped[error.type].push(error);
        }

        const hnWithErrors = this.matchErrorsToHN(pendingList, grouped);
        const duplicates = hnWithErrors.filter(h => h.errorType === 'DUPLICATE_HN');

        if (duplicates.length === 0) {
            log('Keine Duplikate zum Entfernen gefunden', 'info');
            return;
        }

        log(`🔧 Entferne ${duplicates.length} Duplikate aus Import-Liste...`, 'info');

        let removed = 0;
        for (const dup of duplicates) {
            const key = `${dup.number}_${dup.segmentId}`;

            // Aus pending Map entfernen
            if (pendingHouseNumbers.has(key)) {
                pendingHouseNumbers.delete(key);
                BlockedHouseNumbers.add(dup.number, dup.segmentId, 'Duplikat (Auto-Fix)');
                removed++;
            }
        }

        log(`✓ ${removed} Duplikate aus Import-Liste entfernt und blockiert`, 'success');
        log(`💡 Die HN bleiben in WME sichtbar bis zum nächsten Speichern`, 'info');
        log(`💡 Beim Speichern werden nur die Duplikate übersprungen`, 'info');

        // Modal schließen
        const modal = document.getElementById('hn-save-error-modal');
        if (modal) modal.style.display = 'none';

        // Fehler-Button verstecken
        const errorBtn = document.getElementById('btn-show-save-errors');
        if (errorBtn) errorBtn.style.display = 'none';

        // Fehler zurücksetzen
        this.lastSaveErrors = [];
    },

    // Zur Position springen
    jumpToLocation(lat, lon) {
        try {
            // Konvertiere zu Web Mercator
            const mercX = lon * 20037508.34 / 180;
            const mercY = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

            if (W?.map?.setCenter) {
                W.map.setCenter({ lon: mercX, lat: mercY });
            }

            // Zoom auf Level 20 für beste Sicht
            if (W?.map?.olMap?.zoomTo) {
                W.map.olMap.zoomTo(20);
            } else if (W?.map?.zoomTo) {
                W.map.zoomTo(20);
            }

            log(`📍 Springe zu ${lat.toFixed(6)}, ${lon.toFixed(6)}`, 'info');

            // Modal schließen
            const modal = document.getElementById('hn-save-error-modal');
            if (modal) modal.style.display = 'none';

        } catch (e) {
            log(`Fehler beim Springen: ${e.message}`, 'error');
        }
    },

    // Einzelne pending HN entfernen - SICHERE METHODE mit LocalStorage
    removePendingHN(number, segmentId) {
        try {
            // Aus pending Map entfernen
            const key = `${number}_${segmentId}`;
            const hnData = pendingHouseNumbers.get(key);

            if (!hnData) {
                log(`⚠️ HN ${number} nicht im Tracking gefunden`, 'warning');
                return false;
            }

            pendingHouseNumbers.delete(key);

            // Zur Blocklist hinzufügen (persistent)
            BlockedHouseNumbers.add(number, segmentId, 'Manuell entfernt');

            log(`🗑️ HN ${number} aus Import-Liste entfernt und blockiert`, 'success');
            log(`💡 Die HN bleibt in WME sichtbar bis zum Speichern`, 'info');
            log(`💡 Beim Speichern wird diese HN übersprungen`, 'info');

            return true;
        } catch (e) {
            log(`Fehler beim Entfernen: ${e.message}`, 'error');
            console.error(`${SCRIPT_NAME}: removePendingHN Fehler:`, e);
            return false;
        }
    },

    // Alle pending HN entfernen (komplettes Undo)
    removeAllPendingHN() {
        try {
            const count = pendingHouseNumbers.size;

            if (!W?.model?.actionManager) {
                log('ActionManager nicht verfügbar', 'error');
                return;
            }

            // Zähle wie viele Actions wir haben
            const actionCount = W.model.actionManager.getActions().length;
            log(`🔧 Entferne ${actionCount} Actions...`, 'info');

            // Alle Undo-Aktionen ausführen
            let undone = 0;
            for (let i = 0; i < actionCount; i++) {
                try {
                    W.model.actionManager.undo();
                    undone++;
                } catch (e) {
                    console.log(`${SCRIPT_NAME}: Undo ${i} fehlgeschlagen:`, e);
                    break;
                }
            }

            // Pending Map leeren
            pendingHouseNumbers.clear();

            // Auch globalImportedHN für diese Session leeren (optional)
            // globalImportedHN.clear();

            log(`🗑️ ${undone} Actions rückgängig gemacht`, 'success');

            // Modal schließen
            const modal = document.getElementById('hn-save-error-modal');
            if (modal) modal.style.display = 'none';

            // Fehler-Button verstecken
            const errorBtn = document.getElementById('btn-show-save-errors');
            if (errorBtn) errorBtn.style.display = 'none';

            // Fehler zurücksetzen
            this.lastSaveErrors = [];

        } catch (e) {
            log(`Fehler beim Entfernen: ${e.message}`, 'error');
            console.error(`${SCRIPT_NAME}: removeAllPendingHN Fehler:`, e);
        }
    },

    // Fehler in Zwischenablage kopieren
    copyErrorsToClipboard() {
        let text = `WME Speicher-Fehler Report (${new Date().toLocaleString()})\n`;
        text += `${'='.repeat(50)}\n\n`;

        const grouped = {};
        for (const error of this.lastSaveErrors) {
            if (!grouped[error.type]) grouped[error.type] = [];
            grouped[error.type].push(error);
        }

        for (const [type, errors] of Object.entries(grouped)) {
            const config = this.ERROR_TYPES[type];
            text += `${config.icon} ${config.description} (${errors.length}x)\n`;
            text += `${'-'.repeat(40)}\n`;

            errors.forEach(err => {
                let line = '  • ';
                if (err.details.houseNumber) line += `HN: ${err.details.houseNumber} `;
                if (err.details.street) line += `Straße: ${err.details.street} `;
                if (err.details.distance) line += `Distanz: ${err.details.distance}m `;
                if (err.details.segmentId) line += `Segment: ${err.details.segmentId} `;
                text += line.trim() + '\n';
                text += `    Original: ${err.originalMessage}\n`;
            });
            text += '\n';
        }

        navigator.clipboard.writeText(text).then(() => {
            log('Fehler in Zwischenablage kopiert', 'success');
        }).catch(() => {
            log('Kopieren fehlgeschlagen', 'error');
        });
    },

    // Auto-Fix für behebbare Fehler
    async autoFixErrors() {
        const fixableErrors = this.lastSaveErrors.filter(e => e.config.autoFixable);
        if (fixableErrors.length === 0) {
            log('Keine automatisch behebbaren Fehler', 'info');
            return;
        }

        log(`🔧 Starte Auto-Korrektur für ${fixableErrors.length} Fehler...`, 'info');

        let fixed = 0;
        let failed = 0;

        for (const error of fixableErrors) {
            try {
                const result = await this.applyAutoFix(error);
                if (result) {
                    fixed++;
                } else {
                    failed++;
                }
            } catch (e) {
                console.error(`${SCRIPT_NAME}: Auto-Fix Fehler:`, e);
                failed++;
            }
        }

        log(`🔧 Auto-Korrektur: ${fixed} behoben, ${failed} fehlgeschlagen`, fixed > 0 ? 'success' : 'warning');

        // Modal schließen
        const modal = document.getElementById('hn-save-error-modal');
        if (modal) modal.style.display = 'none';

        // Hinweis zum erneuten Speichern
        if (fixed > 0) {
            log('💾 Bitte erneut speichern um Korrekturen zu übernehmen', 'info');
        }
    },

    // Einzelnen Auto-Fix anwenden
    async applyAutoFix(error) {
        switch (error.config.autoFixAction) {
            case 'remove_duplicate':
                return this.fixRemoveDuplicate(error);
            case 'snap_to_segment':
                return this.fixSnapToSegment(error);
            default:
                return false;
        }
    },

    // Fix: Duplikat entfernen (Undo der Action)
    fixRemoveDuplicate(error) {
        try {
            if (!W?.model?.actionManager) return false;

            const actions = W.model.actionManager.getActions() || [];

            // Finde die Action für diese Hausnummer
            for (let i = actions.length - 1; i >= 0; i--) {
                const action = actions[i];
                const actionHN = action?.houseNumber?.number || action?.object?.attributes?.number;

                if (actionHN && error.details.houseNumber &&
                    String(actionHN).toLowerCase() === String(error.details.houseNumber).toLowerCase()) {
                    // Undo dieser Action
                    W.model.actionManager.undo();
                    log(`🔧 Duplikat-Action für HN ${error.details.houseNumber} rückgängig gemacht`, 'success');
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: fixRemoveDuplicate Fehler:`, e);
            return false;
        }
    },

    // Fix: Hausnummer näher ans Segment verschieben
    fixSnapToSegment(error) {
        // Diese Funktion ist komplexer und erfordert Zugriff auf die HN-Geometrie
        // Für jetzt nur ein Hinweis
        log(`⚠️ HN ${error.details.houseNumber || '?'} muss manuell näher ans Segment verschoben werden`, 'warning');
        return false;
    },

    // Statistiken zurücksetzen
    resetStats() {
        this.errorStats = {
            totalSaves: 0,
            successfulSaves: 0,
            failedSaves: 0,
            errorsByType: {}
        };
        this.lastSaveErrors = [];
    }
};

// ============================================================================
// RATE LIMITER
// ============================================================================
class RateLimiter {
    constructor(maxPerSecond = 3, maxConcurrent = 2) {
        this.maxPerSecond = maxPerSecond;
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.active = 0;
        this.history = [];
    }

    async execute(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.queue.length === 0 || this.active >= this.maxConcurrent) return;

        const now = Date.now();
        this.history = this.history.filter(t => now - t < 1000);

        if (this.history.length >= this.maxPerSecond) {
            setTimeout(() => this.process(), 200);
            return;
        }

        const { fn, resolve, reject } = this.queue.shift();
        this.active++;
        this.history.push(now);

        try {
            resolve(await fn());
        } catch (e) {
            reject(e);
        } finally {
            this.active--;
            setTimeout(() => this.process(), 100);
        }
    }
}


// ============================================================================
// KOORDINATEN-UTILITIES (SDK-kompatibel)
// ============================================================================
const CoordUtils = {
    // Distanz zwischen zwei Punkten (Haversine) in Metern
    distance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    },

    // BBox aus Zentrum und Radius berechnen
    getBBoxFromCenter(centerLon, centerLat, radiusMeters) {
        const latDelta = radiusMeters / 111320;
        const lonDelta = radiusMeters / (111320 * Math.cos(centerLat * Math.PI / 180));
        return {
            minLon: centerLon - lonDelta,
            minLat: centerLat - latDelta,
            maxLon: centerLon + lonDelta,
            maxLat: centerLat + latDelta
        };
    },

    // Aktuelle Kartenansicht BBox über SDK holen
    getCurrentBBox() {
        try {
            if (wmeSDK && wmeSDK.Map) {
                const center = wmeSDK.Map.getMapCenter();
                const zoom = wmeSDK.Map.getZoomLevel();

                if (center && center.lon !== undefined && center.lat !== undefined) {
                    // Radius basierend auf Zoom-Level berechnen
                    const radiusMeters = Math.max(100, 50000 / Math.pow(2, zoom - 10));
                    return this.getBBoxFromCenter(center.lon, center.lat, Math.min(radiusMeters, CONFIG.search.maxRadius));
                }
            }

            // Fallback: W.map verwenden
            if (W && W.map) {
                const extent = W.map.getExtent();
                if (extent) {
                    // Web Mercator zu WGS84 konvertieren
                    const toWGS84 = (x, y) => {
                        const lon = x * 180 / 20037508.34;
                        let lat = y * 180 / 20037508.34;
                        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                        return { lon, lat };
                    };

                    const bl = toWGS84(extent.left, extent.bottom);
                    const tr = toWGS84(extent.right, extent.top);

                    return {
                        minLon: bl.lon,
                        minLat: bl.lat,
                        maxLon: tr.lon,
                        maxLat: tr.lat
                    };
                }
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: BBox-Fehler:`, e);
        }
        return null;
    },

    // Kartenzentrum holen
    getMapCenter() {
        try {
            if (wmeSDK && wmeSDK.Map) {
                return wmeSDK.Map.getMapCenter();
            }
            if (W && W.map) {
                const center = W.map.getCenter();
                if (center) {
                    const lon = center.lon * 180 / 20037508.34;
                    let lat = center.lat * 180 / 20037508.34;
                    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                    return { lon, lat };
                }
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Center-Fehler:`, e);
        }
        return null;
    }
};


// ============================================================================
// DATEN-FETCHER - Amtliche Daten abrufen
// ============================================================================
class OfficialDataFetcher {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    // WFS GetFeature Request - unterstützt verschiedene WFS-Versionen
    async fetchWFS(source, bbox) {
        const cacheKey = `${source.url}_${JSON.stringify(bbox)}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.time < this.cacheTimeout) {
            return cached.data;
        }

        // Spezielle Behandlung für NRW ALKIS Gebäude
        if (source.isALKISGebaeude) {
            const result = await this.fetchNRWALKIS(source, bbox);
            if (result && result.length > 0) {
                this.cache.set(cacheKey, { data: result, time: Date.now() });
                return result;
            }
            return [];
        }

        // Versuche verschiedene WFS-Versionen und Formate
        const attempts = [
            // WFS 2.0 mit JSON
            {
                version: '2.0.0',
                outputFormat: 'application/json',
                bboxParam: `${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon},EPSG:4326`
            },
            // WFS 1.1.0 mit GeoJSON
            {
                version: '1.1.0',
                outputFormat: 'application/json',
                bboxParam: `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat},EPSG:4326`
            },
            // WFS 2.0 mit GML
            {
                version: '2.0.0',
                outputFormat: 'text/xml; subtype=gml/3.2.1',
                bboxParam: `${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon},EPSG:4326`
            },
            // WFS 1.1.0 mit GML
            {
                version: '1.1.0',
                outputFormat: 'text/xml; subtype=gml/3.1.1',
                bboxParam: `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat},EPSG:4326`
            }
        ];

        log(`WFS Request: ${source.name}`, 'info');

        for (const attempt of attempts) {
            const params = new URLSearchParams({
                service: 'WFS',
                version: attempt.version,
                request: 'GetFeature',
                typeName: source.typeName,
                srsName: source.srsName || 'EPSG:4326',
                outputFormat: attempt.outputFormat,
                bbox: attempt.bboxParam,
                maxFeatures: '500',
                count: '500'
            });

            const url = `${source.url}?${params.toString()}`;

            try {
                const result = await this.makeWFSRequest(url, source);
                if (result && result.length > 0) {
                    this.cache.set(cacheKey, { data: result, time: Date.now() });
                    log(`${result.length} Adressen von ${source.url.split('/').pop()} erhalten`, 'success');
                    return result;
                }
            } catch (e) {
                // Nächsten Versuch probieren
                continue;
            }
        }

        log('Keine Daten von WFS erhalten', 'warning');
        return [];
    }

    // NRW ALKIS Gebäude - spezielle Behandlung für Polygon-Geometrien mit lagebeztxt
    async fetchNRWALKIS(source, bbox) {
        log(`NRW ALKIS Request: ${source.name}`, 'info');

        // BBOX für EPSG:25832 (UTM Zone 32N) - NRW natives CRS
        // Konvertiere WGS84 zu ungefähren UTM-Koordinaten
        const utmBbox = this.wgs84ToUTM32(bbox);

        const params = new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: source.typeName,
            srsName: 'urn:ogc:def:crs:EPSG::4326',
            outputFormat: 'text/xml; subtype=gml/3.2.1',
            bbox: `${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon},urn:ogc:def:crs:EPSG::4326`,
            count: '500'
        });

        const url = `${source.url}?${params.toString()}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: CONFIG.rateLimiting.requestTimeout,
                headers: {
                    'Accept': 'text/xml, application/xml'
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = this.parseNRWALKISResponse(response.responseText, source);
                            if (result.length > 0) {
                                log(`${result.length} Gebäude mit Adressen gefunden`, 'success');
                            }
                            resolve(result);
                        } catch (e) {
                            log(`Parse-Fehler NRW ALKIS: ${e.message}`, 'error');
                            resolve([]);
                        }
                    } else {
                        log(`HTTP ${response.status} für NRW ALKIS`, 'error');
                        resolve([]);
                    }
                },
                onerror: () => { log('Netzwerkfehler NRW ALKIS', 'error'); resolve([]); },
                ontimeout: () => { log('Timeout NRW ALKIS', 'error'); resolve([]); }
            });
        });
    }

    // WGS84 zu UTM32 (ungefähre Konvertierung für BBOX)
    wgs84ToUTM32(bbox) {
        // Vereinfachte Konvertierung - für BBOX ausreichend genau
        const toUTM = (lon, lat) => {
            const k0 = 0.9996;
            const a = 6378137;
            const e = 0.081819191;
            const e2 = e * e;
            const lonRad = lon * Math.PI / 180;
            const latRad = lat * Math.PI / 180;
            const lon0 = 9 * Math.PI / 180; // Zone 32 Mittelmeridian

            const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
            const T = Math.tan(latRad) * Math.tan(latRad);
            const C = e2 / (1 - e2) * Math.cos(latRad) * Math.cos(latRad);
            const A = Math.cos(latRad) * (lonRad - lon0);
            const M = a * ((1 - e2/4 - 3*e2*e2/64) * latRad - (3*e2/8 + 3*e2*e2/32) * Math.sin(2*latRad));

            const x = k0 * N * (A + (1-T+C)*A*A*A/6) + 500000;
            const y = k0 * (M + N * Math.tan(latRad) * (A*A/2 + (5-T+9*C+4*C*C)*A*A*A*A/24));

            return { x, y };
        };

        const min = toUTM(bbox.minLon, bbox.minLat);
        const max = toUTM(bbox.maxLon, bbox.maxLat);

        return {
            minX: min.x,
            minY: min.y,
            maxX: max.x,
            maxY: max.y
        };
    }

    // NRW ALKIS GML Response parsen
    parseNRWALKISResponse(xmlText, source) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        const houseNumbers = [];

        // Finde alle GebaeudeBauwerk Features
        const features = doc.getElementsByTagNameNS('*', 'GebaeudeBauwerk');

        for (const feature of features) {
            // lagebeztxt enthält die Adresse(n) - kann mehrere durch Trennzeichen getrennt enthalten
            const lagebeztxt = this.getElementText(feature, 'lagebeztxt');
            if (!lagebeztxt) continue;

            // Centroid der Gebäudegeometrie berechnen
            const centroid = this.calculateGMLCentroid(feature);
            if (!centroid) continue;

            // Adressen aus lagebeztxt parsen (Format: "Straße Hausnummer" oder "Straße Hausnummer, Straße2 Hausnummer2")
            const addresses = this.parseLagebeztxt(lagebeztxt);

            for (const addr of addresses) {
                if (addr.number) {
                    // Hausnummern aufteilen falls mehrere
                    const numbers = this.splitAndValidateHouseNumbers(addr.number);

                    // Positionen versetzen wenn mehrere HN aus einem Bereich
                    const positions = this.spreadPositions(centroid.lon, centroid.lat, numbers.length);

                    for (let idx = 0; idx < numbers.length; idx++) {
                        houseNumbers.push({
                            number: numbers[idx],
                            street: addr.street || 'Unbekannt',
                            lon: positions[idx].lon,
                            lat: positions[idx].lat,
                            source: source.name
                        });
                    }
                }
            }
        }

        return houseNumbers;
    }

    // Positionen für mehrere HN versetzen (z.B. bei "7-9" -> 7, 8, 9 nebeneinander)
    spreadPositions(baseLon, baseLat, count) {
        if (count <= 1) {
            return [{ lon: baseLon, lat: baseLat }];
        }

        const positions = [];
        // Versatz: ca. 3 Meter pro HN (0.00003° ≈ 3m)
        const offset = 0.00003;
        // Verteile entlang einer Linie (leicht diagonal)
        const startOffset = -((count - 1) / 2) * offset;

        for (let i = 0; i < count; i++) {
            positions.push({
                lon: baseLon + startOffset + (i * offset),
                lat: baseLat + (startOffset + (i * offset)) * 0.3 // Leicht diagonal
            });
        }

        return positions;
    }

    // Text aus XML Element extrahieren
    getElementText(parent, tagName) {
        let el = parent.getElementsByTagNameNS('*', tagName)[0];
        if (!el) el = parent.getElementsByTagName(tagName)[0];
        return el ? el.textContent.trim() : null;
    }

    // Centroid aus GML Polygon berechnen
    calculateGMLCentroid(feature) {
        // Suche nach Koordinaten in verschiedenen GML-Formaten
        const posListEl = feature.getElementsByTagNameNS('*', 'posList')[0];
        const posEl = feature.getElementsByTagNameNS('*', 'pos')[0];
        const coordsEl = feature.getElementsByTagNameNS('*', 'coordinates')[0];

        let coords = [];

        if (posListEl) {
            // GML 3.x posList Format: "lat1 lon1 lat2 lon2 ..."
            const values = posListEl.textContent.trim().split(/\s+/).map(parseFloat);
            for (let i = 0; i < values.length - 1; i += 2) {
                // Bei EPSG:4326 ist die Reihenfolge lat, lon
                coords.push({ lat: values[i], lon: values[i + 1] });
            }
        } else if (posEl) {
            const values = posEl.textContent.trim().split(/\s+/).map(parseFloat);
            if (values.length >= 2) {
                coords.push({ lat: values[0], lon: values[1] });
            }
        } else if (coordsEl) {
            // Älteres Format: "lon1,lat1 lon2,lat2 ..."
            const pairs = coordsEl.textContent.trim().split(/\s+/);
            for (const pair of pairs) {
                const [lon, lat] = pair.split(',').map(parseFloat);
                if (!isNaN(lon) && !isNaN(lat)) {
                    coords.push({ lat, lon });
                }
            }
        }

        if (coords.length === 0) return null;

        // Centroid berechnen
        const sumLat = coords.reduce((s, c) => s + c.lat, 0);
        const sumLon = coords.reduce((s, c) => s + c.lon, 0);

        const lat = sumLat / coords.length;
        const lon = sumLon / coords.length;

        // Validierung: Koordinaten müssen in NRW liegen (ca. 5.8-9.5 lon, 50.3-52.5 lat)
        if (lon < 5.5 || lon > 10 || lat < 50 || lat > 53) {
            // Koordinaten könnten vertauscht sein
            if (lat >= 5.5 && lat <= 10 && lon >= 50 && lon <= 53) {
                return { lon: lat, lat: lon };
            }
            return null;
        }

        return { lon, lat };
    }

    // lagebeztxt parsen - extrahiert Straße und Hausnummer
    parseLagebeztxt(text) {
        const addresses = [];
        if (!text) return addresses;

        // Trennzeichen für mehrere Adressen: Semikolon, Pipe, oder Zeilenumbruch
        const parts = text.split(/[;|]\s*|\n/).map(s => s.trim()).filter(s => s);

        for (const part of parts) {
            // Versuche Straße und Hausnummer zu trennen
            // Typische Formate:
            // "Musterstraße 123"
            // "Musterstraße 123a"
            // "Am Markt 5-7"
            // "Straße des 17. Juni 100"

            // Regex: Alles bis zur letzten Zahl(engruppe) ist Straße
            const match = part.match(/^(.+?)\s+(\d+[\d\s\-\/a-zA-Z]*)$/);

            if (match) {
                addresses.push({
                    street: match[1].trim(),
                    number: match[2].trim()
                });
            } else {
                // Fallback: Versuche nur Hausnummer am Ende zu finden
                const numMatch = part.match(/(\d+[a-zA-Z]?)$/);
                if (numMatch) {
                    const street = part.substring(0, part.length - numMatch[0].length).trim();
                    addresses.push({
                        street: street || 'Unbekannt',
                        number: numMatch[1]
                    });
                }
            }
        }

        return addresses;
    }

    // Einzelner WFS Request
    makeWFSRequest(url, source) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: CONFIG.rateLimiting.requestTimeout,
                headers: {
                    'Accept': 'application/json, application/geo+json, text/xml, application/xml'
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            // Versuche JSON zu parsen
                            const data = JSON.parse(response.responseText);
                            resolve(this.parseGeoJSON(data, source));
                        } catch (jsonError) {
                            // Versuche XML zu parsen
                            try {
                                const xmlResult = this.parseWFSXML(response.responseText, source);
                                resolve(xmlResult);
                            } catch (xmlError) {
                                // Prüfe ob es eine WFS Exception ist
                                if (response.responseText.includes('ExceptionReport') ||
                                    response.responseText.includes('ServiceException')) {
                                    console.log(`${SCRIPT_NAME}: WFS Exception für ${source.name}`);
                                }
                                resolve([]);
                            }
                        }
                    } else {
                        // Nur bei 404 loggen (andere Fehler sind normal bei Fallback-Versuchen)
                        if (response.status === 404) {
                            log(`HTTP 404: ${url.split('?')[0].split('/').pop()}`, 'error');
                        }
                        resolve([]);
                    }
                },
                onerror: (err) => {
                    console.log(`${SCRIPT_NAME}: Netzwerkfehler für ${source.name}`);
                    resolve([]);
                },
                ontimeout: () => {
                    log(`Timeout für ${source.name}`, 'warning');
                    resolve([]);
                }
            });
        });
    }

    // GeoJSON parsen
    parseGeoJSON(data, source) {
        const houseNumbers = [];
        const features = data.features || data.featureMembers || [];

        for (const feature of features) {
            const hn = this.extractHouseNumber(feature, source);
            if (hn) {
                // Hausnummer validieren und ggf. aufteilen
                const numbers = this.splitAndValidateHouseNumbers(hn.number);

                // Positionen versetzen wenn mehrere HN aus einem Bereich
                const positions = this.spreadPositions(hn.lon, hn.lat, numbers.length);

                for (let idx = 0; idx < numbers.length; idx++) {
                    houseNumbers.push({
                        ...hn,
                        number: numbers[idx],
                        lon: positions[idx].lon,
                        lat: positions[idx].lat
                    });
                }
            }
        }

        return houseNumbers;
    }

    // XML Response parsen
    parseWFSXML(xmlText, source) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        const houseNumbers = [];

        // Verschiedene Feature-Member-Tags versuchen
        const memberTags = ['featureMember', 'member', 'featureMembers'];
        let features = [];

        for (const tag of memberTags) {
            features = doc.getElementsByTagNameNS('*', tag);
            if (features.length > 0) break;
            features = doc.getElementsByTagName(tag);
            if (features.length > 0) break;
        }

        for (const feature of features) {
            const hn = this.extractHouseNumberFromXML(feature, source);
            if (hn) houseNumbers.push(hn);
        }

        return houseNumbers;
    }

    // Hausnummer aus GeoJSON Feature extrahieren
    extractHouseNumber(feature, source) {
        const props = feature.properties || feature;
        let number = null;
        let street = null;
        let lon = null;
        let lat = null;

        // Hausnummer finden
        const numberFields = ['hausnummer', 'hausnr', 'hnr', 'number', 'housenumber',
                             'house_number', 'HNR', 'HAUSNUMMER', 'locatorDesignator',
                             'ad:locatorDesignator', 'nummer'];
        for (const field of numberFields) {
            if (props[field] !== undefined && props[field] !== null && props[field] !== '') {
                number = String(props[field]).trim();
                break;
            }
        }

        // Hausnummernzusatz
        const suffixFields = ['hausnummerzusatz', 'zusatz', 'suffix', 'hnr_zusatz', 'buchstabe'];
        for (const field of suffixFields) {
            if (props[field]) {
                number = (number || '') + String(props[field]).trim();
                break;
            }
        }

        // Straßenname finden
        const streetFields = ['strassenname', 'strasse', 'street', 'streetname',
                             'str_name', 'STRASSENNAME', 'thoroughfare', 'strnam'];
        for (const field of streetFields) {
            if (props[field]) {
                street = String(props[field]).trim();
                break;
            }
        }

        // Koordinaten aus Geometry
        if (feature.geometry) {
            const geom = feature.geometry;
            if (geom.type === 'Point' && geom.coordinates) {
                lon = geom.coordinates[0];
                lat = geom.coordinates[1];
            } else if (geom.coordinates) {
                // Centroid für andere Geometrien
                const coords = this.flattenCoords(geom.coordinates);
                if (coords.length > 0) {
                    lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
                    lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
                }
            }
        }

        // Koordinaten aus Properties (Fallback)
        if (lon === null || lat === null) {
            const lonFields = ['lon', 'longitude', 'x', 'rechtswert', 'east', 'lng'];
            const latFields = ['lat', 'latitude', 'y', 'hochwert', 'north'];

            for (const field of lonFields) {
                if (props[field] !== undefined) { lon = parseFloat(props[field]); break; }
            }
            for (const field of latFields) {
                if (props[field] !== undefined) { lat = parseFloat(props[field]); break; }
            }
        }

        if (!number || lon === null || lat === null || isNaN(lon) || isNaN(lat)) {
            return null;
        }

        return {
            number: number,
            street: street || 'Unbekannt',
            lon: lon,
            lat: lat,
            source: source.name
        };
    }

    // Hausnummer aus XML extrahieren
    extractHouseNumberFromXML(element, source) {
        const getText = (tagNames) => {
            const tags = Array.isArray(tagNames) ? tagNames : [tagNames];
            for (const tag of tags) {
                // Mit Namespace
                let el = element.getElementsByTagNameNS('*', tag)[0];
                if (el && el.textContent) return el.textContent.trim();
                // Ohne Namespace
                el = element.getElementsByTagName(tag)[0];
                if (el && el.textContent) return el.textContent.trim();
            }
            return null;
        };

        const number = getText(['hausnummer', 'hausnr', 'hnr', 'HNR', 'locatorDesignator', 'nummer']);
        const street = getText(['strassenname', 'strasse', 'STR_NAME', 'thoroughfare', 'strnam']);

        // Koordinaten aus GML
        let lon = null, lat = null;
        const posEl = element.getElementsByTagNameNS('*', 'pos')[0] ||
                     element.getElementsByTagNameNS('*', 'coordinates')[0] ||
                     element.getElementsByTagNameNS('*', 'posList')[0];

        if (posEl) {
            const coords = posEl.textContent.trim().split(/[\s,]+/).map(parseFloat);
            if (coords.length >= 2) {
                // Prüfe ob lat/lon oder lon/lat
                if (Math.abs(coords[0]) <= 180 && Math.abs(coords[1]) <= 90) {
                    lon = coords[0];
                    lat = coords[1];
                } else if (Math.abs(coords[1]) <= 180 && Math.abs(coords[0]) <= 90) {
                    lat = coords[0];
                    lon = coords[1];
                }
            }
        }

        if (!number || lon === null || lat === null) return null;

        return { number, street: street || 'Unbekannt', lon, lat, source: source.name };
    }

    flattenCoords(coords) {
        const flat = [];
        const flatten = (arr) => {
            if (typeof arr[0] === 'number') flat.push(arr);
            else if (Array.isArray(arr)) arr.forEach(flatten);
        };
        flatten(coords);
        return flat;
    }

    // Overpass API für OSM Daten
    async fetchOverpass(bbox) {
        const query = `
            [out:json][timeout:60];
            (
                node["addr:housenumber"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
                way["addr:housenumber"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
            );
            out center;
        `;

        log('Overpass API Request...', 'info');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: OFFICIAL_DATA_SOURCES.osm.overpass.url,
                data: `data=${encodeURIComponent(query)}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: CONFIG.rateLimiting.requestTimeout,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(this.parseOverpassResponse(data));
                        } catch (e) {
                            log(`Parse-Fehler: ${e.message}`, 'error');
                            resolve([]);
                        }
                    } else {
                        log(`HTTP ${response.status}`, 'error');
                        resolve([]);
                    }
                },
                onerror: () => { log('Netzwerkfehler', 'error'); resolve([]); },
                ontimeout: () => { log('Timeout', 'error'); resolve([]); }
            });
        });
    }

    parseOverpassResponse(data) {
        const houseNumbers = [];

        for (const element of data.elements || []) {
            const tags = element.tags || {};
            const rawNumber = tags['addr:housenumber'];
            if (!rawNumber) continue;

            let lon, lat;
            if (element.type === 'node') {
                lon = element.lon;
                lat = element.lat;
            } else if (element.center) {
                lon = element.center.lon;
                lat = element.center.lat;
            }

            if (lon && lat) {
                // Hausnummern aufteilen und validieren
                const numbers = this.splitAndValidateHouseNumbers(rawNumber);
                const street = tags['addr:street'] || 'Unbekannt';

                // Positionen versetzen wenn mehrere HN aus einem Bereich
                const positions = this.spreadPositions(lon, lat, numbers.length);

                for (let idx = 0; idx < numbers.length; idx++) {
                    houseNumbers.push({
                        number: numbers[idx],
                        street: street,
                        lon: positions[idx].lon,
                        lat: positions[idx].lat,
                        source: 'OpenStreetMap'
                    });
                }
            }
        }

        return houseNumbers;
    }

    // Hausnummern aufteilen und validieren
    splitAndValidateHouseNumbers(rawNumber) {
        if (!rawNumber) return [];

        const results = [];
        const raw = String(rawNumber).trim();

        // Verschiedene Trennzeichen: Komma, Semikolon, Schrägstrich, "und", "&"
        // Beispiele: "201, 203", "1;3;5", "10/12", "5 und 7", "3&5"
        const parts = raw.split(/[,;\/&]|\s+und\s+|\s+and\s+/i);

        for (let part of parts) {
            part = part.trim();
            if (!part) continue;

            // Prüfe auf Bereich (z.B. "1-5", "10 - 12")
            const rangeMatch = part.match(/^(\d+)\s*[-–—]\s*(\d+)([a-zA-Z]?)$/);
            if (rangeMatch) {
                const start = parseInt(rangeMatch[1]);
                const end = parseInt(rangeMatch[2]);
                const suffix = rangeMatch[3] || '';

                // Nur kleine Bereiche expandieren (max 10 Nummern)
                if (end > start && (end - start) <= 10) {
                    // Prüfe ob gerade oder ungerade Sequenz
                    const step = (end - start) <= 2 ? 1 : 2;
                    for (let i = start; i <= end; i += step) {
                        const num = `${i}${suffix}`;
                        if (this.isValidHouseNumber(num)) {
                            results.push(num);
                        }
                    }
                    continue;
                }
            }

            // Einzelne Hausnummer validieren
            if (this.isValidHouseNumber(part)) {
                results.push(part);
            }
        }

        return results;
    }

    // Hausnummer validieren (Waze-kompatibel)
    isValidHouseNumber(number) {
        if (!number) return false;

        const num = String(number).trim();

        // Leere oder zu lange Nummern ablehnen
        if (num.length === 0 || num.length > 10) return false;

        // Muss mit einer Ziffer beginnen
        if (!/^\d/.test(num)) return false;

        // Erlaubte Formate:
        // - Nur Ziffern: "123"
        // - Ziffern + Buchstabe: "123a", "123A"
        // - Ziffern + Buchstabe + Zahl: "123a1" (selten)
        // - Ziffern + Schrägstrich + Ziffern: "123/1" (Nebeneingänge)
        const validPattern = /^\d+[a-zA-Z]?\d*$/;
        const validWithSlash = /^\d+\/\d+[a-zA-Z]?$/;

        if (validPattern.test(num) || validWithSlash.test(num)) {
            return true;
        }

        // Ungültige Zeichen oder Formate
        // Ablehnen: Kommas, Semikolons, Leerzeichen, Bindestriche (außer in Bereichen)
        if (/[,;\s]/.test(num)) return false;

        return false;
    }

    // Region automatisch erkennen - alle deutschen Bundesländer
    detectRegion(lon, lat) {
        // Deutschland gesamt
        if (lat >= 47.2 && lat <= 55.1 && lon >= 5.8 && lon <= 15.1) {
            // NRW
            if (lon >= 5.8 && lon <= 9.5 && lat >= 50.3 && lat <= 52.6) return 'germany.nrw';
            // Bayern
            if (lon >= 8.9 && lon <= 13.9 && lat >= 47.2 && lat <= 50.6) return 'germany.bayern';
            // Baden-Württemberg
            if (lon >= 7.5 && lon <= 10.5 && lat >= 47.5 && lat <= 49.8) return 'germany.bw';
            // Berlin
            if (lon >= 13.0 && lon <= 13.8 && lat >= 52.3 && lat <= 52.7) return 'germany.berlin';
            // Brandenburg (um Berlin herum)
            if (lon >= 11.2 && lon <= 14.8 && lat >= 51.3 && lat <= 53.6) return 'germany.brandenburg';
            // Hamburg
            if (lon >= 9.7 && lon <= 10.3 && lat >= 53.4 && lat <= 53.7) return 'germany.hamburg';
            // Bremen
            if (lon >= 8.5 && lon <= 9.0 && lat >= 53.0 && lat <= 53.2) return 'germany.bremen';
            // Hessen
            if (lon >= 7.7 && lon <= 10.3 && lat >= 49.4 && lat <= 51.7) return 'germany.hessen';
            // Niedersachsen
            if (lon >= 6.5 && lon <= 11.6 && lat >= 51.3 && lat <= 54.0) return 'germany.niedersachsen';
            // Schleswig-Holstein
            if (lon >= 8.3 && lon <= 11.4 && lat >= 53.4 && lat <= 55.1) return 'germany.sh';
            // Mecklenburg-Vorpommern
            if (lon >= 10.5 && lon <= 14.5 && lat >= 53.1 && lat <= 54.7) return 'germany.mv';
            // Sachsen
            if (lon >= 11.8 && lon <= 15.1 && lat >= 50.2 && lat <= 51.7) return 'germany.sachsen';
            // Sachsen-Anhalt
            if (lon >= 10.5 && lon <= 13.2 && lat >= 50.9 && lat <= 53.0) return 'germany.sachsen_anhalt';
            // Thüringen
            if (lon >= 9.8 && lon <= 12.7 && lat >= 50.2 && lat <= 51.7) return 'germany.thueringen';
            // Rheinland-Pfalz
            if (lon >= 6.1 && lon <= 8.5 && lat >= 48.9 && lat <= 50.9) return 'germany.rlp';
            // Saarland
            if (lon >= 6.3 && lon <= 7.4 && lat >= 49.1 && lat <= 49.7) return 'germany.saarland';

            // Fallback: OSM verwenden
            return null;
        }
        // Österreich
        if (lat >= 46.3 && lat <= 49.0 && lon >= 9.5 && lon <= 17.2) {
            return 'austria.bev';
        }
        // Schweiz
        if (lat >= 45.8 && lat <= 47.9 && lon >= 5.9 && lon <= 10.5) {
            return 'switzerland.swisstopo';
        }
        return null;
    }

    getSource(regionKey) {
        if (!regionKey) return null;
        const parts = regionKey.split('.');
        let source = OFFICIAL_DATA_SOURCES;
        for (const part of parts) {
            source = source?.[part];
        }
        return source;
    }
}

const dataFetcher = new OfficialDataFetcher();


// ============================================================================
// WME INTEGRATION - Hausnummern importieren
// ============================================================================
class WMEHouseNumberManager {
    constructor() {
        this.existingHouseNumbers = new Map();  // Key: number_segmentId
        this.existingByCoords = new Map();      // Key: number_lat_lon (gerundet)
        this.importedThisSession = new Map();   // Koordinaten-basiert für Session-Tracking
        this.debugMode = true;
        this.isLoadingHN = false;
    }

    // Konvertiert Bildschirmposition eines DOM-Elements in Kartenkoordinaten (WGS84)
    getElementMapCoordinates(element) {
        try {
            if (!element || !W?.map) return null;

            // Methode 1: Aus SVG transform-Attribut
            const transform = element.getAttribute('transform') ||
                             element.parentElement?.getAttribute('transform');
            if (transform) {
                const translateMatch = transform.match(/translate\s*\(\s*([-\d.]+)\s*[,\s]\s*([-\d.]+)\s*\)/);
                if (translateMatch) {
                    const x = parseFloat(translateMatch[1]);
                    const y = parseFloat(translateMatch[2]);

                    // Prüfe ob Web Mercator (große Zahlen)
                    if (Math.abs(x) > 180 || Math.abs(y) > 90) {
                        const lon = x * 180 / 20037508.34;
                        const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 20037508.34)) - Math.PI / 2);
                        return { lon, lat };
                    }
                    return { lon: x, lat: y };
                }
            }

            // Methode 2: Aus data-Attributen
            const dataLon = element.getAttribute('data-lon') || element.getAttribute('data-x');
            const dataLat = element.getAttribute('data-lat') || element.getAttribute('data-y');
            if (dataLon && dataLat) {
                return { lon: parseFloat(dataLon), lat: parseFloat(dataLat) };
            }

            // Methode 3: Aus Bildschirmposition via OpenLayers
            const rect = element.getBoundingClientRect();
            if (rect && W.map.olMap) {
                const mapEl = W.map.olMap.div || document.getElementById('map');
                if (mapEl) {
                    const mapRect = mapEl.getBoundingClientRect();
                    const pixelX = rect.left + rect.width/2 - mapRect.left;
                    const pixelY = rect.top + rect.height/2 - mapRect.top;

                    // Pixel zu Kartenkoordinaten
                    if (W.map.olMap.getLonLatFromPixel) {
                        const lonLat = W.map.olMap.getLonLatFromPixel({ x: pixelX, y: pixelY });
                        if (lonLat) {
                            // Web Mercator zu WGS84
                            const lon = lonLat.lon * 180 / 20037508.34;
                            const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lonLat.lat * Math.PI / 20037508.34)) - Math.PI / 2);
                            return { lon, lat };
                        }
                    }
                }
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Session-Tracking zurücksetzen (vor neuem Import)
    resetSessionTracking() {
        this.importedThisSession.clear();
    }

    // Existierende Hausnummern laden - MIT KOORDINATEN für Distanz-Prüfung
    loadExistingHouseNumbers() {
        // Alle Maps zurücksetzen
        this.existingHouseNumbers.clear();
        this.existingByCoords.clear();

        console.log(`${SCRIPT_NAME}: === LADE EXISTIERENDE HN ===`);

        // Verwende die gleiche Logik wie scanVisibleHouseNumbers
        const scannedHN = importController.scanVisibleHouseNumbers();

        let loadedCount = 0;
        let coordsCount = 0;

        // Konvertiere gescannte HN zu existingHouseNumbers Format
        for (const [number, positions] of scannedHN.entries()) {
            for (const pos of positions) {
                // Verwende eine generische Segment-ID da wir sie nicht haben
                const segId = pos.isDummy ? 'unknown' : 'scanned';
                const key = `${number}_${segId}`;

                if (!this.existingHouseNumbers.has(key)) {
                    this.existingHouseNumbers.set(key, true);
                    loadedCount++;

                    // Koordinaten speichern für Distanz-Prüfung (nur echte Koordinaten)
                    if (!pos.isDummy && pos.lon !== null && pos.lat !== null) {
                        const coordKey = `${number}_${pos.lat.toFixed(4)}_${pos.lon.toFixed(4)}`;
                        this.existingByCoords.set(coordKey, {
                            number: number,
                            lon: pos.lon,
                            lat: pos.lat,
                            segmentId: segId
                        });
                        coordsCount++;
                    }
                }
            }
        }

        log(`${this.existingHouseNumbers.size} existierende HN geladen (${this.existingByCoords.size} mit Koordinaten)`, 'info');

        // Debug: Zeige Statistik
        console.log(`${SCRIPT_NAME}: Koordinaten-Quote: ${this.existingByCoords.size}/${this.existingHouseNumbers.size} (${Math.round(100*this.existingByCoords.size/Math.max(1,this.existingHouseNumbers.size))}%)`);

        if (this.existingByCoords.size > 0) {
            const sample = [...this.existingByCoords.entries()].slice(0, 3);
            console.log(`${SCRIPT_NAME}: Sample HN:`, sample);
        }

        return this.existingHouseNumbers.size;
    }

    // Straßennamen normalisieren für Vergleich
    normalizeStreetName(name) {
        if (!name) return '';
        return name
            .toLowerCase()
            .replace(/str\./g, 'straße')
            .replace(/str$/g, 'straße')
            .replace(/weg$/g, 'weg')
            .replace(/platz$/g, 'platz')
            .replace(/allee$/g, 'allee')
            .replace(/[.-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Straßennamen-Ähnlichkeit berechnen (0-1, 1 = identisch)
    streetNameSimilarity(name1, name2) {
        const n1 = this.normalizeStreetName(name1);
        const n2 = this.normalizeStreetName(name2);

        if (!n1 || !n2) return 0;
        if (n1 === n2) return 1;

        // Prüfe ob einer im anderen enthalten ist
        if (n1.includes(n2) || n2.includes(n1)) return 0.9;

        // Levenshtein-ähnliche Berechnung (vereinfacht)
        const longer = n1.length > n2.length ? n1 : n2;
        const shorter = n1.length > n2.length ? n2 : n1;

        if (longer.length === 0) return 1;

        // Gemeinsame Zeichen am Anfang
        let commonPrefix = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (shorter[i] === longer[i]) commonPrefix++;
            else break;
        }

        // Wenn mindestens 60% der kürzeren Zeichenkette übereinstimmt
        const prefixRatio = commonPrefix / shorter.length;
        if (prefixRatio >= 0.6) return 0.7 + (prefixRatio * 0.3);

        // Wort-basierter Vergleich
        const words1 = n1.split(' ');
        const words2 = n2.split(' ');
        let matchingWords = 0;
        for (const w1 of words1) {
            if (words2.some(w2 => w1 === w2 || w1.includes(w2) || w2.includes(w1))) {
                matchingWords++;
            }
        }

        return matchingWords / Math.max(words1.length, words2.length);
    }

    // Straßenname aus Segment holen
    getSegmentStreetName(segment) {
        if (!segment?.attributes) return null;

        // Primärer Straßenname
        const primaryStreet = segment.attributes.primaryStreetID;
        if (primaryStreet && W?.model?.streets) {
            const street = W.model.streets.getObjectById(primaryStreet);
            if (street?.attributes?.name) {
                return street.attributes.name;
            }
        }

        // Alternativer Name direkt im Segment
        if (segment.attributes.streetName) {
            return segment.attributes.streetName;
        }

        // Über Address
        if (segment.attributes.address?.street?.name) {
            return segment.attributes.address.street.name;
        }

        return null;
    }

    // Nächstes Segment für Hausnummer finden - VERBESSERTE VERSION FÜR KREUZUNGEN
    // Priorisiert Straßennamen-Match bei ähnlichen Distanzen
    // VERBESSERT: Bessere Zuordnung bei "Inseln" zwischen mehreren Straßen
    findNearestSegment(lon, lat, streetName = null, returnDetails = false) {
        if (!W?.model?.segments) {
            console.log(`${SCRIPT_NAME}: Keine Segmente verfügbar`);
            return returnDetails ? { segment: null, reason: 'no_segments' } : null;
        }

        const segments = W.model.segments.getObjectArray();
        if (segments.length === 0) {
            console.log(`${SCRIPT_NAME}: Segment-Array ist leer`);
            return returnDetails ? { segment: null, reason: 'empty_segments' } : null;
        }

        // Sammle ALLE Kandidaten innerhalb des Suchradius
        const candidates = [];
        const maxDistance = 100; // Meter - maximale Distanz für Zuordnung
        const junctionRadius = 50; // Meter - Radius für "Insel"-Erkennung (erhöht von 25m)
        const streetNamePriorityRadius = 80; // Meter - Innerhalb dieses Radius hat Straßenname IMMER Vorrang
        let checkedCount = 0;

        // GeoJSON Point für die Hausnummer-Position erstellen
        const hnPoint = { type: 'Point', coordinates: [lon, lat] };

        // Versuche OpenLayers Geometrie zu erstellen für präzisere Distanzberechnung
        let olPoint = null;
        try {
            if (W?.userscripts?.toOLGeometry) {
                olPoint = W.userscripts.toOLGeometry(hnPoint);
            }
        } catch (e) {
            // Fallback auf manuelle Berechnung
        }

        for (const segment of segments) {
            if (!segment?.attributes) continue;
            if (segment.isDeleted?.()) continue;

            // Nur Straßen (roadType 1-7, 17, 20) - keine Fußwege, Treppen, Bahngleise
            const roadType = segment.attributes.roadType;
            const validTypes = [1, 2, 3, 4, 5, 6, 7, 17, 20];
            if (!validTypes.includes(roadType)) continue;

            checkedCount++;

            // Distanz berechnen
            let distance = Infinity;

            try {
                if (olPoint && typeof segment.getOLGeometry === 'function') {
                    const segOLGeom = segment.getOLGeometry();
                    if (segOLGeom) {
                        const distResult = olPoint.distanceTo(segOLGeom, { details: true });
                        if (distResult && distResult.x1 !== undefined && distResult.y1 !== undefined) {
                            const closestLon = distResult.x1 * 180 / 20037508.34;
                            let closestLat = distResult.y1 * 180 / 20037508.34;
                            closestLat = 180 / Math.PI * (2 * Math.atan(Math.exp(closestLat * Math.PI / 180)) - Math.PI / 2);
                            distance = CoordUtils.distance(lat, lon, closestLat, closestLon);
                        }
                    }
                }
            } catch (e) {}

            // Fallback: Manuelle WGS84 Distanzberechnung
            if (distance === Infinity) {
                let geom = null;
                try {
                    if (typeof segment.getGeometry === 'function') {
                        geom = segment.getGeometry();
                    } else if (segment.geometry) {
                        geom = segment.geometry;
                    } else if (segment.attributes.geometry) {
                        geom = segment.attributes.geometry;
                    }
                } catch (e) {
                    continue;
                }
                if (geom) {
                    distance = this.pointToGeometryDistanceWGS84(lon, lat, geom);
                }
            }

            if (distance === Infinity || distance > maxDistance) continue;

            // Straßenname und Ähnlichkeit berechnen
            const segmentStreetName = this.getSegmentStreetName(segment);
            const similarity = streetName && segmentStreetName ?
                this.streetNameSimilarity(streetName, segmentStreetName) : 0;

            candidates.push({
                segment,
                distance,
                streetName: segmentStreetName,
                similarity,
                nameMatch: similarity >= 0.5
            });
        }

        // Debug-Ausgabe beim ersten Aufruf
        if (this.debugMode && checkedCount > 0) {
            console.log(`${SCRIPT_NAME}: ${checkedCount} Segmente geprüft, ${candidates.length} Kandidaten`);
            this.debugMode = false;
        }

        if (candidates.length === 0) {
            return returnDetails ? { segment: null, reason: 'no_candidates', requestedStreet: streetName } : null;
        }

        // Sortiere nach Distanz
        candidates.sort((a, b) => a.distance - b.distance);

        const nearest = candidates[0];

        // ===== INSEL-/KREUZUNGS-LOGIK =====
        // Wenn ein Straßenname aus den amtlichen Daten vorhanden ist,
        // hat dieser IMMER Vorrang innerhalb des streetNamePriorityRadius
        if (streetName && candidates.length > 1) {
            // Finde alle Segmente mit passendem Straßennamen
            const matchingNameCandidates = candidates.filter(c =>
                c.nameMatch && c.distance <= streetNamePriorityRadius
            );

            // Wenn es Segmente mit passendem Namen gibt, wähle das nächste davon
            if (matchingNameCandidates.length > 0) {
                // Sortiere nach Distanz
                matchingNameCandidates.sort((a, b) => a.distance - b.distance);
                const best = matchingNameCandidates[0];

                // Logging wenn ein anderes Segment als das nächste gewählt wird
                if (best.segment !== nearest.segment) {
                    console.log(`${SCRIPT_NAME}: INSEL-KORREKTUR! ` +
                        `Nächstes Segment: "${nearest.streetName || 'unbekannt'}" (${nearest.distance.toFixed(1)}m), ` +
                        `Gewählt wegen Straßenname: "${best.streetName}" (${best.distance.toFixed(1)}m, ${Math.round(best.similarity*100)}% Match) ` +
                        `für amtliche Adresse: "${streetName}"`);
                }

                if (returnDetails) {
                    return {
                        segment: best.segment,
                        distance: best.distance,
                        nameMatch: true,
                        nameSimilarity: best.similarity,
                        segmentStreetName: best.streetName,
                        requestedStreet: streetName,
                        reason: 'street_name_priority',
                        isIsland: true,
                        candidateCount: candidates.length,
                        matchingNameCount: matchingNameCandidates.length
                    };
                }
                return best.segment;
            }

            // Fallback: Finde alle Segmente innerhalb des Kreuzungs-Radius vom nächsten
            const nearbySegments = candidates.filter(c =>
                c.distance <= nearest.distance + junctionRadius
            );

            if (nearbySegments.length > 1) {
                // Mehrere Segmente in der Nähe = wahrscheinlich Kreuzung/Insel
                // Sortiere nach: 1. Namens-Match, 2. Ähnlichkeit, 3. Distanz
                nearbySegments.sort((a, b) => {
                    // Namens-Match hat höchste Priorität
                    if (a.nameMatch !== b.nameMatch) {
                        return b.nameMatch ? 1 : -1;
                    }
                    // Bei gleichem Match-Status: höhere Ähnlichkeit bevorzugen
                    if (Math.abs(a.similarity - b.similarity) > 0.1) {
                        return b.similarity - a.similarity;
                    }
                    // Bei ähnlicher Ähnlichkeit: kürzere Distanz
                    return a.distance - b.distance;
                });

                const best = nearbySegments[0];

                // Logging für Kreuzungs-Entscheidung
                if (best.segment !== nearest.segment) {
                    console.log(`${SCRIPT_NAME}: Kreuzung erkannt! ` +
                        `Nächstes: ${nearest.streetName || 'unbekannt'} (${nearest.distance.toFixed(1)}m), ` +
                        `Gewählt: ${best.streetName || 'unbekannt'} (${best.distance.toFixed(1)}m, ${Math.round(best.similarity*100)}% Match)`);
                }

                if (returnDetails) {
                    return {
                        segment: best.segment,
                        distance: best.distance,
                        nameMatch: best.nameMatch,
                        nameSimilarity: best.similarity,
                        segmentStreetName: best.streetName,
                        requestedStreet: streetName,
                        reason: best.nameMatch ? 'matched' : 'name_mismatch',
                        isJunction: true,
                        candidateCount: nearbySegments.length
                    };
                }
                return best.segment;
            }
        }

        // ===== STANDARD-LOGIK (kein Kreuzungs-Fall) =====
        // Wenn ein Segment mit passendem Namen existiert und nicht zu weit weg ist
        if (streetName) {
            const matchingCandidate = candidates.find(c => c.nameMatch);
            if (matchingCandidate) {
                // Toleranz: Segment mit passendem Namen darf bis zu 50m weiter weg sein (erhöht von 30m)
                const nameTolerance = 50;
                if (matchingCandidate.distance <= nearest.distance + nameTolerance) {
                    if (returnDetails) {
                        return {
                            segment: matchingCandidate.segment,
                            distance: matchingCandidate.distance,
                            nameMatch: true,
                            nameSimilarity: matchingCandidate.similarity,
                            segmentStreetName: matchingCandidate.streetName,
                            requestedStreet: streetName,
                            reason: 'matched'
                        };
                    }
                    return matchingCandidate.segment;
                }
            }
        }

        // Fallback: Nächstes Segment verwenden
        if (returnDetails) {
            return {
                segment: nearest.segment,
                distance: nearest.distance,
                nameMatch: nearest.nameMatch,
                nameSimilarity: nearest.similarity,
                segmentStreetName: nearest.streetName,
                requestedStreet: streetName,
                reason: nearest.nameMatch ? 'matched' : (streetName ? 'name_mismatch' : 'matched')
            };
        }

        return nearest.segment;
    }

    // Punkt-zu-Geometrie Distanz in Metern (alle Koordinaten in WGS84)
    pointToGeometryDistanceWGS84(pointLon, pointLat, geometry) {
        // Koordinaten aus GeoJSON extrahieren
        let coordinates = [];

        if (geometry.coordinates && geometry.coordinates.length > 0) {
            // GeoJSON Format: [[lon, lat], [lon, lat], ...]
            coordinates = geometry.coordinates;
        } else if (geometry.getVertices) {
            // OpenLayers - zu WGS84 konvertieren
            const verts = geometry.getVertices();
            coordinates = verts.map(v => {
                const lon = v.x * 180 / 20037508.34;
                let lat = v.y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            });
        } else if (geometry.components) {
            // OpenLayers components - zu WGS84 konvertieren
            coordinates = geometry.components.map(c => {
                const lon = c.x * 180 / 20037508.34;
                let lat = c.y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            });
        }

        if (coordinates.length < 2) {
            return Infinity;
        }

        let minDist = Infinity;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const a = coordinates[i];
            const b = coordinates[i + 1];

            if (!a || !b || a.length < 2 || b.length < 2) continue;

            // Punkt-zu-Segment Distanz berechnen
            const dist = this.pointToSegmentDistanceWGS84(pointLon, pointLat, a[0], a[1], b[0], b[1]);
            if (dist < minDist) minDist = dist;
        }

        return minDist;
    }

    // Punkt-zu-Segment Distanz in WGS84 Koordinaten (Ergebnis in Metern)
    pointToSegmentDistanceWGS84(px, py, ax, ay, bx, by) {
        // Projektion des Punktes auf die Linie
        const dx = bx - ax;
        const dy = by - ay;
        const lengthSq = dx * dx + dy * dy;

        let t = 0;
        if (lengthSq > 0) {
            t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
        }

        const projX = ax + t * dx;
        const projY = ay + t * dy;

        // Haversine Distanz in Metern
        return CoordUtils.distance(py, px, projY, projX);
    }

    // NEUE FUNKTION: Projiziert einen Punkt auf das nächste Segment und gibt die projizierten Koordinaten zurück
    // Dies ist KRITISCH für die korrekte Hausnummern-Positionierung!
    projectPointOnGeometry(pointLon, pointLat, geometry) {
        // Koordinaten aus Geometrie extrahieren (wie in pointToGeometryDistanceWGS84)
        let coordinates = [];

        if (geometry.coordinates && geometry.coordinates.length > 0) {
            coordinates = geometry.coordinates;
        } else if (geometry.getVertices) {
            const verts = geometry.getVertices();
            coordinates = verts.map(v => {
                const lon = v.x * 180 / 20037508.34;
                let lat = v.y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            });
        } else if (geometry.components) {
            coordinates = geometry.components.map(c => {
                const lon = c.x * 180 / 20037508.34;
                let lat = c.y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            });
        }

        if (coordinates.length < 2) {
            // Fallback: Original-Koordinaten zurückgeben
            return { lon: pointLon, lat: pointLat, projected: false };
        }

        let minDist = Infinity;
        let bestProjection = { lon: pointLon, lat: pointLat };

        for (let i = 0; i < coordinates.length - 1; i++) {
            const a = coordinates[i];
            const b = coordinates[i + 1];

            if (!a || !b || a.length < 2 || b.length < 2) continue;

            // Projektion berechnen
            const ax = a[0], ay = a[1];
            const bx = b[0], by = b[1];
            const dx = bx - ax;
            const dy = by - ay;
            const lengthSq = dx * dx + dy * dy;

            let t = 0;
            if (lengthSq > 0) {
                t = Math.max(0, Math.min(1, ((pointLon - ax) * dx + (pointLat - ay) * dy) / lengthSq));
            }

            const projX = ax + t * dx;
            const projY = ay + t * dy;

            // Distanz zur Projektion berechnen
            const dist = CoordUtils.distance(pointLat, pointLon, projY, projX);

            if (dist < minDist) {
                minDist = dist;
                bestProjection = { lon: projX, lat: projY };
            }
        }

        return {
            lon: bestProjection.lon,
            lat: bestProjection.lat,
            projected: true,
            originalLon: pointLon,
            originalLat: pointLat,
            distanceFromOriginal: minDist
        };
    }

    // Hausnummer zur Duplikat-Liste hinzufügen (nach erfolgreichem Import)
    markAsImported(number, segmentId, lon = null, lat = null) {
        const numberStr = String(number).trim().toLowerCase();
        const segIdStr = String(segmentId);
        const key = `${numberStr}_${segIdStr}`;
        this.existingHouseNumbers.set(key, true);

        // Session-Tracking mit Koordinaten
        if (lon !== null && lat !== null) {
            const coordKey = `${numberStr}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
            const coordData = { lon, lat, segmentId: segIdStr, number: numberStr };
            this.importedThisSession.set(coordKey, coordData);

            // WICHTIG: Auch in GLOBALE Map eintragen (überlebt resetSessionTracking)
            globalImportedHN.set(coordKey, coordData);
        }
    }

    // Projizierte Position auf Segment berechnen
    getProjectedPositionOnSegment(lon, lat, segment) {
        if (!segment) return null;

        try {
            let geom = null;
            if (typeof segment.getGeometry === 'function') {
                geom = segment.getGeometry();
            } else if (segment.geometry) {
                geom = segment.geometry;
            } else if (segment.attributes?.geometry) {
                geom = segment.attributes.geometry;
            }

            if (!geom) return null;

            return this.projectPointOnGeometry(lon, lat, geom);
        } catch (e) {
            return null;
        }
    }

    // Hausnummer hinzufügen - MIT POSITIONS-OPTIMIERUNG
    async addHouseNumber(houseNumber, segment, segmentDistance = null) {
        if (!segment || !houseNumber) {
            return { success: false, reason: 'missing_data' };
        }

        const segmentId = segment.attributes.id;
        const numberStr = String(houseNumber.number).trim();
        const numberLower = numberStr.toLowerCase();

        // ===== DISTANZ-CHECK: Ablehnen wenn zu weit vom Segment =====
        const MAX_SEGMENT_DISTANCE = CONFIG.import.maxSegmentDistance || 50;
        if (segmentDistance !== null && segmentDistance > MAX_SEGMENT_DISTANCE) {
            return { success: false, reason: `too_far_from_segment (${segmentDistance.toFixed(0)}m > ${MAX_SEGMENT_DISTANCE}m)` };
        }

        // ===== KRITISCHE SEGMENT-PRÜFUNG: Prüfe segment.attributes.houseNumbers =====
        // Dies ist die ZUVERLÄSSIGSTE Methode um zu prüfen ob eine HN auf dem Segment existiert!
        try {
            const segmentHNArray = segment?.attributes?.houseNumbers || [];

            for (const hn of segmentHNArray) {
                const existingNum = String(hn?.number || hn?.houseNumber || '').trim().toLowerCase();
                if (existingNum === numberLower) {
                    console.log(`${SCRIPT_NAME}: SEGMENT-ARRAY DUPLIKAT: HN ${numberStr} existiert bereits auf Segment ${segmentId}`);
                    this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                    return { success: false, reason: 'duplicate_segment_array' };
                }
            }
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei segment.attributes.houseNumbers Prüfung:`, e);
        }

        // ===== ALTERNATIVE SEGMENT-PRÜFUNG: Direkt über W.model.segmentHouseNumbers =====
        try {
            if (W?.model?.segmentHouseNumbers?.objects) {
                for (const hnId in W.model.segmentHouseNumbers.objects) {
                    const hn = W.model.segmentHouseNumbers.objects[hnId];
                    const hnSegId = hn?.attributes?.segID || hn?.segID;

                    if (String(hnSegId) === String(segmentId)) {
                        const existingNum = String(hn?.attributes?.number || hn?.number || '').trim().toLowerCase();

                        if (existingNum === numberLower) {
                            console.log(`${SCRIPT_NAME}: SEGMENT-HN DUPLIKAT: HN ${numberStr} existiert bereits auf Segment ${segmentId}`);
                            this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                            return { success: false, reason: 'duplicate_segment_hn_model' };
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei W.model.segmentHouseNumbers Prüfung:`, e);
        }

        // ===== ACTION-MANAGER PRÜFUNG: Prüfe pending Actions auf Duplikate =====
        // Neue HN sind noch nicht in segment.attributes.houseNumbers, aber im ActionManager!
        try {
            if (W?.model?.actionManager) {
                const actions = W.model.actionManager.getActions?.() ||
                               W.model.actionManager._actions ||
                               W.model.actionManager.actions || [];

                for (const action of actions) {
                    // Prüfe verschiedene Action-Strukturen
                    const actionSegId = action?.segmentId || action?.segment?.attributes?.id ||
                                       action?._segmentId || action?.attributes?.segmentId ||
                                       action?.houseNumber?.segmentId;
                    const actionNumber = action?.number || action?.houseNumber?.number ||
                                        action?._number || action?.attributes?.number;

                    if (actionSegId && actionNumber) {
                        const actionNumLower = String(actionNumber).trim().toLowerCase();
                        const actionSegIdStr = String(actionSegId);

                        // Prüfe ob gleiche HN auf gleichem Segment
                        if (actionSegIdStr === String(segmentId) && actionNumLower === numberLower) {
                            console.log(`${SCRIPT_NAME}: ACTION-MANAGER DUPLIKAT: HN ${numberStr} bereits als Action auf Segment ${segmentId}`);
                            this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                            return { success: false, reason: 'duplicate_action_manager' };
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei ActionManager-Prüfung:`, e);
        }

        // ===== STRASSEN-PRÜFUNG: Prüfe ALLE Segmente mit gleichem Straßennamen =====
        // Segmente mit gleichem Namen werden als EINE Straße behandelt!
        try {
            // Hole den Straßennamen des Ziel-Segments
            let targetStreetName = null;
            const primaryStreetID = segment.attributes?.primaryStreetID;
            if (primaryStreetID && W?.model?.streets) {
                const street = W.model.streets.getObjectById(primaryStreetID);
                targetStreetName = street?.attributes?.name;
            }
            if (!targetStreetName) {
                targetStreetName = segment.attributes?.primaryStreetName || segment.attributes?.name;
            }

            if (targetStreetName) {
                console.log(`${SCRIPT_NAME}: Prüfe HN ${numberStr} gegen alle Segmente der Straße "${targetStreetName}"...`);

                // Durchsuche ALLE Segmente nach gleichem Straßennamen
                const allSegments = W?.model?.segments?.objects || {};
                let segmentsWithSameName = 0;
                const segmentIdsOnSameStreet = new Set(); // Sammle alle Segment-IDs dieser Straße

                for (const otherSegId in allSegments) {
                    const otherSeg = allSegments[otherSegId];
                    if (!otherSeg?.attributes) continue;

                    // Hole Straßennamen des anderen Segments
                    let otherStreetName = null;
                    const otherStreetID = otherSeg.attributes?.primaryStreetID;
                    if (otherStreetID && W?.model?.streets) {
                        const otherStreet = W.model.streets.getObjectById(otherStreetID);
                        otherStreetName = otherStreet?.attributes?.name;
                    }
                    if (!otherStreetName) {
                        otherStreetName = otherSeg.attributes?.primaryStreetName || otherSeg.attributes?.name;
                    }

                    // Prüfe ob gleicher Straßenname
                    if (otherStreetName && otherStreetName.toLowerCase() === targetStreetName.toLowerCase()) {
                        segmentsWithSameName++;
                        segmentIdsOnSameStreet.add(String(otherSegId));

                        // Prüfe HN auf diesem Segment (aus attributes.houseNumbers)
                        const otherHNArray = otherSeg.attributes?.houseNumbers || [];
                        for (const hn of otherHNArray) {
                            const existingNum = String(hn?.number || hn?.houseNumber || '').trim().toLowerCase();
                            if (existingNum === numberLower) {
                                console.log(`${SCRIPT_NAME}: STRASSEN-DUPLIKAT: HN ${numberStr} existiert bereits auf Segment ${otherSegId} (gleiche Straße "${targetStreetName}")`);
                                this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                                return { success: false, reason: 'duplicate_same_street' };
                            }
                        }
                    }
                }

                // ===== ZUSÄTZLICHE PRÜFUNG: W.model.segmentHouseNumbers für alle Segmente der Straße =====
                if (W?.model?.segmentHouseNumbers?.objects) {
                    for (const hnId in W.model.segmentHouseNumbers.objects) {
                        const hn = W.model.segmentHouseNumbers.objects[hnId];
                        const hnSegId = String(hn?.attributes?.segID || hn?.segID || '');

                        // Prüfe ob dieses Segment zur gleichen Straße gehört
                        if (segmentIdsOnSameStreet.has(hnSegId)) {
                            const existingNum = String(hn?.attributes?.number || hn?.number || '').trim().toLowerCase();
                            if (existingNum === numberLower) {
                                console.log(`${SCRIPT_NAME}: STRASSEN-DUPLIKAT (segmentHouseNumbers): HN ${numberStr} existiert bereits auf Segment ${hnSegId} (gleiche Straße "${targetStreetName}")`);
                                this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                                return { success: false, reason: 'duplicate_same_street_model' };
                            }
                        }
                    }
                }

                // ===== ZUSÄTZLICHE PRÜFUNG: W.model.houseNumbers für alle Segmente der Straße =====
                if (W?.model?.houseNumbers?.objects) {
                    for (const hnId in W.model.houseNumbers.objects) {
                        const hn = W.model.houseNumbers.objects[hnId];
                        const hnSegId = String(hn?.attributes?.segID || hn?.segID || '');

                        // Prüfe ob dieses Segment zur gleichen Straße gehört
                        if (segmentIdsOnSameStreet.has(hnSegId)) {
                            const existingNum = String(hn?.attributes?.number || hn?.number || '').trim().toLowerCase();
                            if (existingNum === numberLower) {
                                console.log(`${SCRIPT_NAME}: STRASSEN-DUPLIKAT (houseNumbers): HN ${numberStr} existiert bereits auf Segment ${hnSegId} (gleiche Straße "${targetStreetName}")`);
                                this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                                return { success: false, reason: 'duplicate_same_street_hn_model' };
                            }
                        }
                    }
                }

                // Prüfe auch pendingHouseNumbers auf Segmenten der gleichen Straße
                for (const [key, data] of pendingHouseNumbers.entries()) {
                    if (String(data.number).trim().toLowerCase() !== numberLower) continue;
                    if (segmentIdsOnSameStreet.has(String(data.segmentId))) {
                        console.log(`${SCRIPT_NAME}: PENDING STRASSEN-DUPLIKAT: HN ${numberStr} bereits pending auf Segment ${data.segmentId} (gleiche Straße "${targetStreetName}")`);
                        return { success: false, reason: 'duplicate_pending_same_street' };
                    }
                }

                // Prüfe auch ActionManager auf Segmenten der gleichen Straße
                try {
                    if (W?.model?.actionManager) {
                        const actions = W.model.actionManager.getActions?.() ||
                                       W.model.actionManager._actions ||
                                       W.model.actionManager.actions || [];

                        for (const action of actions) {
                            const actionSegId = action?.segmentId || action?.segment?.attributes?.id ||
                                               action?._segmentId || action?.attributes?.segmentId;
                            const actionNumber = action?.number || action?.houseNumber?.number ||
                                                action?._number || action?.attributes?.number;

                            if (actionSegId && actionNumber) {
                                const actionNumLower = String(actionNumber).trim().toLowerCase();
                                if (actionNumLower === numberLower && segmentIdsOnSameStreet.has(String(actionSegId))) {
                                    console.log(`${SCRIPT_NAME}: ACTION STRASSEN-DUPLIKAT: HN ${numberStr} bereits als Action auf Segment ${actionSegId} (gleiche Straße "${targetStreetName}")`);
                                    return { success: false, reason: 'duplicate_action_same_street' };
                                }
                            }
                        }
                    }
                } catch (e) {}

                console.log(`${SCRIPT_NAME}: ${segmentsWithSameName} Segmente mit Straße "${targetStreetName}" geprüft, HN ${numberStr} nicht gefunden`);
            }
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei Straßen-Prüfung:`, e);
        }

        // Duplikat-Check wurde bereits in filterAgainstExisting durchgeführt
        // Hier nur noch finale Prüfung gegen aktuelle Actions

        // FINALE PRÜFUNG: Direkt über SDK prüfen ob HN auf Segment existiert
        try {
            if (wmeSDK?.DataModel?.HouseNumbers?.getBySegmentId) {
                const existingHN = wmeSDK.DataModel.HouseNumbers.getBySegmentId(segmentId);
                if (existingHN && Array.isArray(existingHN)) {
                    for (const hn of existingHN) {
                        const existingNum = String(hn?.number || '').trim().toLowerCase();
                        if (existingNum === numberLower) {
                            this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                            return { success: false, reason: 'duplicate' };
                        }
                    }
                }
            }
        } catch (e) {}

        // FINALE PRÜFUNG 2: Über W.model.houseNumbers
        try {
            if (W?.model?.houseNumbers?.objects) {
                for (const hn of Object.values(W.model.houseNumbers.objects)) {
                    const attrs = hn?.attributes || hn;
                    const hnSegId = attrs?.segID || attrs?.segmentId;
                    if (String(hnSegId) !== String(segmentId)) continue;

                    const existingNum = String(attrs?.number || '').trim().toLowerCase();
                    if (existingNum === numberLower) {
                        this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                        return { success: false, reason: 'duplicate' };
                    }
                }
            }
        } catch (e) {}

        // FINALE PRÜFUNG 3: W.model.segmentHouseNumbers - moderne Methode
        try {
            if (W?.model?.segmentHouseNumbers?.objects) {
                // Durchsuche alle segmentHouseNumbers nach passenden Einträgen
                for (const hn of Object.values(W.model.segmentHouseNumbers.objects)) {
                    const attrs = hn?.attributes || hn;
                    const hnSegId = attrs?.segID || attrs?.segmentId;
                    const hnNumber = String(attrs?.number || '').trim();

                    if (String(hnSegId) === String(segmentId) && hnNumber === numberStr) {
                        this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                        return { success: false, reason: 'duplicate' };
                    }
                }
            }
        } catch (e) {}

        // ===== LETZTE PRÜFUNG: Nochmal gegen globale Map =====
        const FINAL_CHECK_DISTANCE = CONFIG.import.duplicateRadius || 20;
        for (const [key, data] of globalImportedHN.entries()) {
            if (!data || data.lon === undefined || data.lat === undefined) continue;
            const existingNumber = String(data.number || '').toLowerCase();
            if (existingNumber !== numberLower) continue;

            const dist = CoordUtils.distance(houseNumber.lat, houseNumber.lon, data.lat, data.lon);
            if (dist < FINAL_CHECK_DISTANCE) {
                return { success: false, reason: 'duplicate' };
            }
        }

        // ===== ULTRA-FINALE PRÜFUNG: Direkte WME-Validierung =====
        // Diese Prüfung simuliert WMEs interne Duplikatserkennung
        try {
            // Sammle ALLE HN mit dieser Nummer im aktuellen Bereich
            const allHNWithNumber = [];

            // Aus W.model.houseNumbers
            if (W?.model?.houseNumbers?.objects) {
                for (const hn of Object.values(W.model.houseNumbers.objects)) {
                    const attrs = hn?.attributes || hn;
                    const existingNum = String(attrs?.number || '').trim().toLowerCase();
                    if (existingNum === numberLower) {
                        const geometry = hn?.geometry || attrs?.geometry;
                        if (geometry && geometry.coordinates) {
                            const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                            if (coords) {
                                allHNWithNumber.push({
                                    lat: coords.lat,
                                    lon: coords.lon,
                                    segmentId: attrs?.segID || attrs?.segmentId,
                                    source: 'houseNumbers'
                                });
                            }
                        }
                    }
                }
            }

            // Aus W.model.segmentHouseNumbers
            if (W?.model?.segmentHouseNumbers?.objects) {
                for (const hn of Object.values(W.model.segmentHouseNumbers.objects)) {
                    const attrs = hn?.attributes || hn;
                    const existingNum = String(attrs?.number || '').trim().toLowerCase();
                    if (existingNum === numberLower) {
                        const geometry = hn?.geometry || attrs?.geometry;
                        if (geometry && geometry.coordinates) {
                            const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                            if (coords) {
                                allHNWithNumber.push({
                                    lat: coords.lat,
                                    lon: coords.lon,
                                    segmentId: attrs?.segID || attrs?.segmentId,
                                    source: 'segmentHouseNumbers'
                                });
                            }
                        } else {
                            // Auch HN ohne Koordinaten berücksichtigen
                            allHNWithNumber.push({
                                lat: null,
                                lon: null,
                                segmentId: attrs?.segID || attrs?.segmentId,
                                source: 'segmentHouseNumbers_noCoords'
                            });
                        }
                    }
                }
            }

            // Prüfe gegen alle gefundenen HN
            for (const existingHN of allHNWithNumber) {
                // KRITISCH: Gleiche HN-Nummer auf gleichem Segment = IMMER DUPLIKAT!
                // WME erlaubt KEINE doppelte HN auf dem gleichen Segment, egal wie weit sie auseinander sind!
                if (String(existingHN.segmentId) === String(segmentId)) {
                    console.log(`${SCRIPT_NAME}: SEGMENT-DUPLIKAT: HN ${numberStr} existiert bereits auf Segment ${segmentId} (${existingHN.source})`);
                    this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                    return { success: false, reason: 'duplicate_same_segment' };
                }

                // Koordinaten-basierte Prüfung für verschiedene Segmente
                if (existingHN.lat !== null && existingHN.lon !== null && String(existingHN.segmentId) !== String(segmentId)) {
                    const dist = this.calculateDistance(houseNumber.lat, houseNumber.lon, existingHN.lat, existingHN.lon);
                    if (dist < FINAL_CHECK_DISTANCE) {
                        console.log(`${SCRIPT_NAME}: ULTRA-FINALE PRÜFUNG: HN ${numberStr} zu nah zu existierender HN auf anderem Segment (${dist.toFixed(1)}m, ${existingHN.source})`);
                        this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                        return { success: false, reason: 'duplicate_different_segment_close' };
                    }
                }
            }

            console.log(`${SCRIPT_NAME}: ULTRA-FINALE PRÜFUNG: HN ${numberStr} OK (${allHNWithNumber.length} existierende HN geprüft)`);
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei ultra-finaler Prüfung:`, e);
        }

        // ===== PENDING DUPLIKAT-PRÜFUNG: Prüfe gegen bereits importierte HN in dieser Session =====
        // Diese Prüfung verhindert, dass die gleiche HN mehrmals auf dem gleichen Segment importiert wird
        const pendingKey = `${numberStr}_${segmentId}`;
        if (pendingHouseNumbers.has(pendingKey)) {
            console.log(`${SCRIPT_NAME}: PENDING DUPLIKAT: HN ${numberStr} wurde bereits auf Segment ${segmentId} importiert!`);
            return { success: false, reason: 'duplicate_pending_same_segment' };
        }

        // Prüfe auch ob gleiche HN-Nummer auf gleichem Segment in pending existiert (mit anderem Key-Format)
        for (const [key, data] of pendingHouseNumbers.entries()) {
            if (String(data.segmentId) === String(segmentId) &&
                String(data.number).trim().toLowerCase() === numberLower) {
                console.log(`${SCRIPT_NAME}: PENDING DUPLIKAT (erweitert): HN ${numberStr} existiert bereits auf Segment ${segmentId} (Key: ${key})`);
                return { success: false, reason: 'duplicate_pending_same_segment_extended' };
            }
        }

        // ===== PENDING STRASSEN-PRÜFUNG: Prüfe gegen pending HN auf gleicher Straße =====
        // Hole den Straßennamen des Ziel-Segments
        let targetStreetName = null;
        try {
            const primaryStreetID = segment.attributes?.primaryStreetID;
            if (primaryStreetID && W?.model?.streets) {
                const street = W.model.streets.getObjectById(primaryStreetID);
                targetStreetName = street?.attributes?.name;
            }
            if (!targetStreetName) {
                targetStreetName = segment.attributes?.primaryStreetName || segment.attributes?.name;
            }
        } catch (e) {}

        if (targetStreetName) {
            for (const [key, data] of pendingHouseNumbers.entries()) {
                if (String(data.number).trim().toLowerCase() !== numberLower) continue;

                // Schnelle Prüfung: Nutze gespeicherten Straßennamen wenn vorhanden
                if (data.streetName && data.streetName.toLowerCase() === targetStreetName.toLowerCase()) {
                    console.log(`${SCRIPT_NAME}: PENDING STRASSEN-DUPLIKAT: HN ${numberStr} wurde bereits auf Straße "${targetStreetName}" importiert (Segment ${data.segmentId})`);
                    return { success: false, reason: 'duplicate_pending_same_street' };
                }

                // Fallback: Prüfe ob pending HN auf Segment mit gleichem Straßennamen liegt
                if (!data.streetName) {
                    try {
                        const pendingSegment = W?.model?.segments?.getObjectById?.(data.segmentId) ||
                                              W?.model?.segments?.objects?.[data.segmentId];
                        if (!pendingSegment) continue;

                        let pendingStreetName = null;
                        const pendingStreetID = pendingSegment.attributes?.primaryStreetID;
                        if (pendingStreetID && W?.model?.streets) {
                            const pendingStreet = W.model.streets.getObjectById(pendingStreetID);
                            pendingStreetName = pendingStreet?.attributes?.name;
                        }
                        if (!pendingStreetName) {
                            pendingStreetName = pendingSegment.attributes?.primaryStreetName || pendingSegment.attributes?.name;
                        }

                        if (pendingStreetName && pendingStreetName.toLowerCase() === targetStreetName.toLowerCase()) {
                            console.log(`${SCRIPT_NAME}: PENDING STRASSEN-DUPLIKAT: HN ${numberStr} wurde bereits auf Straße "${targetStreetName}" importiert (Segment ${data.segmentId})`);
                            return { success: false, reason: 'duplicate_pending_same_street' };
                        }
                    } catch (e) {}
                }
            }
        }

        try {
            // METHODE 1: WME SDK verwenden (bevorzugt)
            if (wmeSDK?.DataModel?.HouseNumbers?.addHouseNumber) {
                // WICHTIG: Verwende die ORIGINAL-Koordinaten der Hausnummer!
                // Die HN soll an ihrer echten Position bleiben, nicht auf dem Segment.
                // Das SDK ordnet die HN automatisch dem angegebenen Segment zu.
                const geometry = {
                    type: 'Point',
                    coordinates: [houseNumber.lon, houseNumber.lat]
                };

                // DEBUG: Erste 5 Hausnummern loggen
                if (importStats.successful < 5) {
                    console.log(`${SCRIPT_NAME}: HN ${numberStr} @ ${houseNumber.lat.toFixed(5)}, ${houseNumber.lon.toFixed(5)} (Dist: ${segmentDistance?.toFixed(0) || '?'}m)`);
                }

                // Als importiert markieren (mit Original-Koordinaten)
                this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);

                // Als PENDING markieren für Fehler-Tracking (wird bei erfolgreichem Save gelöscht)
                // Speichere auch den Straßennamen für Straßen-Duplikat-Prüfung
                pendingHouseNumbers.set(pendingKey, {
                    number: numberStr,
                    street: houseNumber.street || 'Unbekannt',
                    streetName: targetStreetName || houseNumber.street || 'Unbekannt',
                    lat: houseNumber.lat,
                    lon: houseNumber.lon,
                    segmentId: segmentId,
                    timestamp: Date.now()
                });

                try {
                    await wmeSDK.DataModel.HouseNumbers.addHouseNumber({
                        segmentId: segmentId,
                        number: numberStr,
                        point: geometry
                    });
                    return { success: true, segmentId: segmentId, distance: segmentDistance };
                } catch (e1) {
                    // Fallback: Try with different parameter names
                    try {
                        await wmeSDK.DataModel.HouseNumbers.addHouseNumber({
                            segmentId: segmentId,
                            number: numberStr,
                            geometry: geometry
                        });
                        return { success: true, segmentId: segmentId, distance: segmentDistance };
                    } catch (e2) {
                        // Try with coordinates array directly
                        try {
                            await wmeSDK.DataModel.HouseNumbers.addHouseNumber({
                                segmentId: segmentId,
                                number: numberStr,
                                point: [houseNumber.lon, houseNumber.lat]
                            });
                            return { success: true, segmentId: segmentId, distance: segmentDistance };
                        } catch (e3) {
                            console.log(`${SCRIPT_NAME}: SDK Fehler - alle Varianten fehlgeschlagen:`, e1.message, e2.message, e3.message);
                            throw e1; // Throw original error
                        }
                    }
                }
            }

            // METHODE 2: Native Waze Action verwenden (Fallback)
            const pageRequire = unsafeWindow?.require || W?.require;
            if (pageRequire) {
                try {
                    const AddHouseNumber = pageRequire('Waze/Action/AddHouseNumber');
                    if (AddHouseNumber) {
                        // Konvertiere WGS84 zu Web Mercator für OpenLayers
                        const mercatorX = houseNumber.lon * 20037508.34 / 180;
                        const mercatorY = Math.log(Math.tan((90 + houseNumber.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                        // OpenLayers Point erstellen
                        const OL = unsafeWindow?.OpenLayers || window.OpenLayers;
                        if (OL) {
                            const olPoint = new OL.Geometry.Point(mercatorX, mercatorY);

                            // Action erstellen und ausführen
                            const action = new AddHouseNumber(segment, numberStr, olPoint);
                            W.model.actionManager.add(action);

                            this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);

                            // Auch bei native Action zur pendingHouseNumbers hinzufügen!
                            pendingHouseNumbers.set(pendingKey, {
                                number: numberStr,
                                street: houseNumber.street || 'Unbekannt',
                                lat: houseNumber.lat,
                                lon: houseNumber.lon,
                                segmentId: segmentId,
                                timestamp: Date.now()
                            });

                            return { success: true, segmentId: segmentId, method: 'native_action' };
                        }
                    }
                } catch (e) {
                    console.log(`${SCRIPT_NAME}: Native Action Fallback fehlgeschlagen:`, e.message);
                }
            }

            // Kein SDK verfügbar
            return { success: false, reason: 'SDK nicht verfügbar' };

        } catch (error) {
            const errorMsg = error.message || String(error);

            // Prüfe ob es ein "already exists" Fehler ist - das ist ein Duplikat!
            // Verschiedene Sprachen und Varianten abfangen
            if (errorMsg.includes('already exists') ||
                errorMsg.includes('bereits existiert') ||
                errorMsg.includes('existiert bereits') ||
                errorMsg.includes('Hausnummer existiert') ||
                errorMsg.includes('duplicate') ||
                errorMsg.includes('Duplikat') ||
                errorMsg.toLowerCase().includes('exists')) {
                // Als Duplikat markieren für zukünftige Prüfungen
                this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                return { success: false, reason: 'duplicate' };
            }

            // Andere Fehler loggen (nur einmal pro Fehlertyp)
            if (!this._loggedErrors) this._loggedErrors = new Set();
            if (!this._loggedErrors.has(errorMsg)) {
                console.error(`${SCRIPT_NAME}: SDK Fehler:`, errorMsg);
                this._loggedErrors.add(errorMsg);
            }
            return { success: false, reason: errorMsg };
        }
    }
}

const wmeManager = new WMEHouseNumberManager();

// ============================================================================
// IMPORT CONTROLLER
// ============================================================================
class ImportController {
    constructor() {
        this.isRunning = false;
        this.shouldStop = false;
    }

    async startImport(houseNumbers, options = {}) {
        if (this.isRunning) {
            throw new Error('Import läuft bereits');
        }

        // ===== ZOOM-CHECK: Warnung wenn nicht auf Zoom 19+ =====
        const currentZoom = this.getCurrentZoom();
        if (currentZoom < 19) {
            const proceed = confirm(
                `⚠️ WICHTIG: Aktueller Zoom ist ${currentZoom}.\n\n` +
                `Für zuverlässige Duplikat-Erkennung:\n` +
                `1. Zoome auf Stufe 19 oder höher\n` +
                `2. Scrolle durch den gesamten Import-Bereich\n` +
                `3. Warte bis alle Hausnummern sichtbar sind\n` +
                `4. Starte dann den Import erneut\n\n` +
                `Trotzdem jetzt importieren?\n` +
                `(Kann zu Duplikaten führen!)`
            );

            if (!proceed) {
                return { total: 0, successful: 0, failed: 0, skipped: 0, aborted: true };
            }
        }

        this.isRunning = true;
        this.shouldStop = false;

        // Initialisiere Manual Pause System (nur wenn aktiviert)
        if (CONFIG.import.manualPauseEnabled) {
            ManualPauseSystem.showPauseButton();
        }

        // ===== SCHRITT 1: Scanne ALLE sichtbaren Hausnummern =====
        log('Scanne existierende Hausnummern...', 'info');
        updateProgress('Scanne HN...');
        const initialScannedHN = this.scanVisibleHouseNumbers();

        // Zähle Positionen
        let totalPositions = 0;
        for (const positions of initialScannedHN.values()) {
            totalPositions += positions.length;
        }
        log(`${initialScannedHN.size} HN-Nummern gefunden (${totalPositions} Positionen)`, 'info');

        // DEBUG: Zeige erste paar gescannte HN
        if (totalPositions > 0) {
            let debugCount = 0;
            for (const [number, positions] of initialScannedHN.entries()) {
                if (debugCount < 3) {
                    console.log(`${SCRIPT_NAME}: Gescannte HN "${number}": ${positions.length} Positionen`, positions);
                    debugCount++;
                }
            }
        } else {
            console.log(`${SCRIPT_NAME}: WARNUNG: Keine existierenden HN gefunden! Duplikatserkennung funktioniert nicht.`);
            console.log(`${SCRIPT_NAME}: Mögliche Ursachen: Zoom zu niedrig, HN nicht geladen, oder keine HN im Bereich`);
        }

        // Warnung wenn keine HN gefunden wurden aber Segmente mit hasHNs existieren
        if (totalPositions === 0) {
            const segments = W?.model?.segments?.getObjectArray?.() || [];
            const segmentsWithHN = segments.filter(seg => seg?.attributes?.hasHNs);
            if (segmentsWithHN.length > 0) {
                log(`⚠️ ${segmentsWithHN.length} Segmente haben hasHNs=true, aber keine HN-Daten geladen!`, 'warning');
                log('Tipp: Zoome auf Level 19+ und warte bis HN sichtbar sind', 'warning');
            }
        }

        // ===== SCHRITT 2: Quelldaten gegen gescannte HN filtern =====
        // Verwende die bereits gescannten HN vom ersten Schritt
        let scannedHN = initialScannedHN;

        // Wenn keine HN gefunden wurden, erweiterte Suche durchführen
        if (scannedHN.size === 0 && houseNumbers.length > 0 && CONFIG.import.enableLargeBuildingSearch) {
            log('Keine HN im sichtbaren Bereich - starte erweiterte Suche für große Gebäude...', 'warning');

            // Berechne Zentrum der zu importierenden HN
            let centerLat = 0, centerLon = 0;
            for (const hn of houseNumbers) {
                centerLat += hn.lat;
                centerLon += hn.lon;
            }
            centerLat /= houseNumbers.length;
            centerLon /= houseNumbers.length;

            const searchRadius = CONFIG.import.largeBuildingSearchRadius || 5000;
            console.log(`${SCRIPT_NAME}: Erweiterte Suche um Zentrum: ${centerLat.toFixed(6)}, ${centerLon.toFixed(6)}, Radius: ${searchRadius}m`);
            scannedHN = await this.scanAllHouseNumbersInArea(centerLat, centerLon, searchRadius);

            if (scannedHN.size > 0) {
                log(`Erweiterte Suche: ${scannedHN.size} HN-Nummern gefunden (Radius: ${searchRadius}m)`, 'success');
            } else {
                log('Auch erweiterte Suche fand keine HN - Import ohne Duplikatsprüfung', 'warning');
            }
        } else if (scannedHN.size === 0 && !CONFIG.import.enableLargeBuildingSearch) {
            log('Erweiterte Suche für große Gebäude ist deaktiviert', 'info');
        }

        const deduplicatedHN = this.filterAgainstExisting(houseNumbers, scannedHN);
        const removedDuplicates = houseNumbers.length - deduplicatedHN.length;

        if (removedDuplicates > 0) {
            log(`${removedDuplicates} Duplikate entfernt (bereits in WME)`, 'success');
        }

        if (deduplicatedHN.length === 0) {
            log('Alle Hausnummern existieren bereits!', 'success');
            this.isRunning = false;
            return { total: 0, successful: 0, failed: 0, skipped: houseNumbers.length, allExist: true };
        }

        // Stats zurücksetzen
        importStats = {
            total: deduplicatedHN.length,
            processed: 0,
            successful: 0,
            failed: 0,
            skipped: 0,
            errors: []
        };

        // Report zurücksetzen
        importReport = {
            missingStreets: new Map(),
            duplicates: [],
            successful: [],
            failed: [],
            streetMismatch: [],
            tooFarAway: [],
            sourceDuplicatesRemoved: removedDuplicates,
            scannedExisting: totalPositions,
            startTime: new Date(),
            endTime: null
        };

        updateProgress();

        // Session-Tracking zurücksetzen für neuen Import
        wmeManager.resetSessionTracking();

        // Gescannte HN zum Session-Tracking hinzufügen
        for (const [key, positions] of scannedHN.entries()) {
            for (const pos of positions) {
                if (!pos.isDummy && pos.lat && pos.lon) {
                    const coordKey = `${key}_${pos.lat.toFixed(4)}_${pos.lon.toFixed(4)}`;
                    wmeManager.importedThisSession.set(coordKey, {
                        number: key,
                        lat: pos.lat,
                        lon: pos.lon
                    });
                }
            }
        }

        // Batch-Verarbeitung MIT SCROLLING
        const batchSize = options.batchSize || CONFIG.import.batchSize;
        const scrollDuringImport = options.scrollDuringImport ?? true;

        // Tracking für Auto-Pause (verhindert Überspringen bei parallelen Imports)
        let lastPauseAt = 0;

        // Sortiere HN nach Position für effizientes Scrolling (Cluster zusammen)
        const sortedHN = [...deduplicatedHN].sort((a, b) => {
            // Sortiere nach lat, dann lon (von oben-links nach unten-rechts)
            if (Math.abs(a.lat - b.lat) > 0.0003) return b.lat - a.lat;
            return a.lon - b.lon;
        });

        // Viewport-Tracking für intelligentes Scrolling
        let lastCenterLat = null;
        let lastCenterLon = null;

        // BATCH-Verarbeitung: Sammle HN im sicheren Bereich, dann parallel verarbeiten
        let i = 0;
        while (i < sortedHN.length && !this.shouldStop) {
            const hn = sortedHN[i];

            // Prüfe ob Zentrierung nötig ist
            const needsCenter = scrollDuringImport && this.needsCenteringForHN(hn, lastCenterLat, lastCenterLon);

            if (needsCenter) {
                try {
                    // Zentriere Karte auf die aktuelle HN
                    const mercX = hn.lon * 20037508.34 / 180;
                    const mercY = Math.log(Math.tan((90 + hn.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                    if (W?.map?.setCenter) {
                        W.map.setCenter({ lon: mercX, lat: mercY });
                    }

                    lastCenterLat = hn.lat;
                    lastCenterLon = hn.lon;

                    // Warte bis WME die HN für diesen Bereich geladen hat (konfigurierbar)
                    await this.sleep(CONFIG.speed.centeringDelay);

                    // HN neu laden für diesen Bereich
                    wmeManager.loadExistingHouseNumbers();

                    await this.sleep(CONFIG.speed.reloadDelay);
                } catch (e) {
                    // Ignorieren
                }
            }

            // Sammle alle HN die im sicheren Bereich liegen (konfigurierbare Batch-Größe)
            const maxBatchSize = CONFIG.speed.useParallelImport ? CONFIG.speed.parallelBatchSize : 1;
            const safeBatch = [];
            while (i < sortedHN.length && safeBatch.length < maxBatchSize && !this.shouldStop) {
                const currentHN = sortedHN[i];

                // MANUAL PAUSE CHECK: Prüfe ob Benutzer pausiert hat (nur wenn aktiviert)
                if (CONFIG.import.manualPauseEnabled && ManualPauseSystem.isPaused) {
                    log('Import pausiert - warte auf Fortsetzung...', 'warning');
                    await ManualPauseSystem.waitForResume();

                    if (this.shouldStop) {
                        log('Import während Pause abgebrochen', 'warning');
                        break;
                    }

                    log('Import nach Pause fortgesetzt', 'success');
                }

                // Prüfe ob diese HN noch im sicheren Bereich liegt
                if (safeBatch.length > 0 && this.needsCenteringForHN(currentHN, lastCenterLat, lastCenterLon)) {
                    break; // Nächste HN braucht neue Zentrierung
                }

                // Prüfe ob HN bereits importiert wurde
                const numLower = String(currentHN.number).trim().toLowerCase();
                let skipThis = false;

                for (const [key, data] of globalImportedHN.entries()) {
                    if (!data || data.lon === undefined || data.lat === undefined) continue;
                    if (String(data.number || '').toLowerCase() !== numLower) continue;

                    const dist = CoordUtils.distance(currentHN.lat, currentHN.lon, data.lat, data.lon);
                    if (dist < 20) {
                        importStats.skipped++;
                        skipThis = true;
                        break;
                    }
                }

                if (!skipThis) {
                    safeBatch.push(currentHN);
                }
                i++;
            }

            // ================================================================
            // BATCH-INTERNE DUPLIKAT-PRÜFUNG: Entferne Duplikate aus dem Batch
            // ================================================================
            if (safeBatch.length > 1) {
                const uniqueBatch = [];
                const seenInBatch = new Map(); // "number_segmentId" -> true

                for (const hn of safeBatch) {
                    const numLower = String(hn.number).trim().toLowerCase();
                    // Finde das Segment für diese HN
                    const findResult = wmeManager.findNearestSegment(hn.lon, hn.lat, hn.street, true);
                    const segId = findResult?.segment?.attributes?.id || 'unknown';
                    const batchKey = `${numLower}_${segId}`;

                    if (seenInBatch.has(batchKey)) {
                        // Duplikat im Batch gefunden!
                        console.log(`${SCRIPT_NAME}: BATCH-DUPLIKAT: HN ${hn.number} auf Segment ${segId} übersprungen`);
                        importStats.skipped++;
                        importReport.duplicates.push({
                            number: hn.number,
                            street: hn.street,
                            lat: hn.lat,
                            lon: hn.lon,
                            reason: 'batch_duplicate'
                        });
                    } else {
                        // Prüfe auch gegen pendingHouseNumbers
                        let isPending = false;
                        for (const [key, data] of pendingHouseNumbers.entries()) {
                            if (String(data.segmentId) === String(segId) &&
                                String(data.number).trim().toLowerCase() === numLower) {
                                isPending = true;
                                break;
                            }
                        }

                        if (isPending) {
                            console.log(`${SCRIPT_NAME}: PENDING-DUPLIKAT: HN ${hn.number} auf Segment ${segId} übersprungen`);
                            importStats.skipped++;
                            importReport.duplicates.push({
                                number: hn.number,
                                street: hn.street,
                                lat: hn.lat,
                                lon: hn.lon,
                                reason: 'pending_duplicate'
                            });
                        } else {
                            seenInBatch.set(batchKey, true);
                            uniqueBatch.push(hn);
                        }
                    }
                }

                // Ersetze safeBatch mit uniqueBatch
                safeBatch.length = 0;
                safeBatch.push(...uniqueBatch);
            }

            // Parallele Verarbeitung des Safe-Batches
            if (safeBatch.length > 0) {
                if (CONFIG.speed.useParallelImport) {
                    // Parallele Verarbeitung
                    await Promise.all(safeBatch.map(h => this.processHouseNumber(h)));
                } else {
                    // Sequentielle Verarbeitung
                    for (const h of safeBatch) {
                        await this.processHouseNumber(h);
                    }
                }

                // Kurze Pause nach Batch (konfigurierbar)
                await this.sleep(CONFIG.speed.batchDelay);
            }

            // Auto-Pause: Prüfe ob nächster Schwellenwert erreicht
            if (CONFIG.import.autoPauseEnabled && CONFIG.import.autoPauseAfter > 0) {
                const pauseInterval = CONFIG.import.autoPauseAfter;
                const nextPauseAt = lastPauseAt + pauseInterval;

                if (importStats.successful >= nextPauseAt) {
                    lastPauseAt = Math.floor(importStats.successful / pauseInterval) * pauseInterval;

                    log(`⏸️ Auto-Pause nach ${importStats.successful} Imports - Starte Verifizierung...`, 'warning');
                    updateProgress(`⏸️ PAUSE - Verifiziere Duplikate...`);

                    // VERIFIZIERUNG während Auto-Pause mit sichtbarem Status
                    performAutoPauseDuplicateCheck().then(() => {
                        log(`✅ Verifizierung abgeschlossen`, 'success');
                        updateProgress(`⏸️ PAUSE - Verifizierung fertig! Jetzt SPEICHERN!`);
                    }).catch((e) => {
                        log(`❌ Verifizierung fehlgeschlagen: ${e.message}`, 'error');
                        updateProgress(`⏸️ PAUSE - Bitte SPEICHERN!`);
                    });

                    log(`⏸️ Bitte jetzt SPEICHERN! Dann "Fortfahren" klicken`, 'warning');
                    updateProgress(`⏸️ PAUSE - Speichern! Dann "Fortfahren" klicken`);

                    // Nicht-blockierende Pause - warte auf Button-Klick
                    await this.waitForUserContinue(importStats.successful);

                    if (this.shouldStop) {
                        log('Import vom Benutzer abgebrochen', 'warning');
                    }
                }
            }

            // Progress Update
            updateProgress();
        }

        this.isRunning = false;
        importReport.endTime = new Date();

        // Cleanup Manual Pause System
        ManualPauseSystem.hidePauseButton();
        VisualDuplicateDetector.deactivate();

        // Cleanup bei Abbruch
        if (this.shouldStop) {
            ManualPauseSystem.cleanup();
        }

        onImportComplete();

        return importStats;
    }

    // Aktuellen Zoom-Level holen
    getCurrentZoom() {
        try {
            if (W?.map?.olMap?.getZoom) {
                return W.map.olMap.getZoom();
            }
            if (wmeSDK?.Map?.getZoomLevel) {
                return wmeSDK.Map.getZoomLevel();
            }
            if (W?.map?.getZoom) {
                return W.map.getZoom();
            }
        } catch (e) {}
        return 0;
    }

    // Aktuellen Viewport (Kartenausschnitt) holen
    getCurrentViewport() {
        try {
            let bounds = null;
            let center = null;

            // Versuche Bounds zu bekommen
            if (W?.map?.olMap?.getExtent) {
                const extent = W.map.olMap.getExtent();
                if (extent) {
                    // Mercator zu WGS84
                    bounds = {
                        minLon: extent.left * 180 / 20037508.34,
                        maxLon: extent.right * 180 / 20037508.34,
                        minLat: Math.atan(Math.exp(extent.bottom * Math.PI / 20037508.34)) * 360 / Math.PI - 90,
                        maxLat: Math.atan(Math.exp(extent.top * Math.PI / 20037508.34)) * 360 / Math.PI - 90
                    };
                }
            }

            // Versuche Center zu bekommen
            if (W?.map?.olMap?.getCenter) {
                const c = W.map.olMap.getCenter();
                if (c) {
                    center = {
                        lon: c.lon * 180 / 20037508.34,
                        lat: Math.atan(Math.exp(c.lat * Math.PI / 20037508.34)) * 360 / Math.PI - 90
                    };
                }
            }

            if (bounds && center) {
                return {
                    ...bounds,
                    centerLon: center.lon,
                    centerLat: center.lat,
                    width: bounds.maxLon - bounds.minLon,
                    height: bounds.maxLat - bounds.minLat
                };
            }
        } catch (e) {}
        return null;
    }

    // Prüft ob eine HN Zentrierung benötigt (außerhalb des sicheren Bereichs)
    needsCenteringForHN(hn, lastCenterLat, lastCenterLon) {
        // Wenn noch nie zentriert wurde, immer zentrieren
        if (lastCenterLat === null || lastCenterLon === null) {
            return true;
        }

        // Berechne Distanz zum letzten Zentrum
        const distLat = Math.abs(hn.lat - lastCenterLat);
        const distLon = Math.abs(hn.lon - lastCenterLon);

        // Sicherer Bereich: ca. 30% des typischen Viewports in jede Richtung
        // Bei Zoom 19 ist der Viewport ca. 0.002° breit/hoch
        // Sicherer Bereich = 0.0006° (30% von 0.002°)
        const safeRadius = 0.0006;

        // Wenn HN außerhalb des sicheren Bereichs liegt, zentrieren
        if (distLat > safeRadius || distLon > safeRadius) {
            return true;
        }

        return false;
    }

    // Scanne ALLE sichtbaren Hausnummern und sammle ihre Koordinaten - KORRIGIERTE VERSION
    scanVisibleHouseNumbers() {
        const result = new Map(); // number (lowercase) -> Array von {lat, lon, isDummy}

        const addPosition = (number, lat, lon, isDummy = false) => {
            if (!number) return;

            // Dummy-Position hinzufügen (ohne Koordinaten-Validierung)
            if (isDummy) {
                const numStr = String(number).trim().toLowerCase();
                if (!result.has(numStr)) {
                    result.set(numStr, []);
                }
                result.get(numStr).push({ lat: null, lon: null, isDummy: true });
                console.log(`${SCRIPT_NAME}: HN ${number} hinzugefügt (Dummy-Position)`);
                return;
            }

            // Validiere echte Koordinaten
            if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) return;
            if (lat < 45 || lat > 55 || lon < 5 || lon > 17) {
                console.log(`${SCRIPT_NAME}: Ungültige Koordinaten für HN ${number}: ${lat}, ${lon}`);
                return;
            }

            const numStr = String(number).trim().toLowerCase();
            if (!result.has(numStr)) {
                result.set(numStr, []);
            }
            result.get(numStr).push({ lat, lon, isDummy: false });
            console.log(`${SCRIPT_NAME}: HN ${number} hinzugefügt: ${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        };

        try {
            console.log(`${SCRIPT_NAME}: === SCAN STARTEN ===`);

            // DEBUG: Prüfe WME-Objekte
            console.log(`${SCRIPT_NAME}: W verfügbar:`, !!W);
            console.log(`${SCRIPT_NAME}: W.model verfügbar:`, !!W?.model);
            console.log(`${SCRIPT_NAME}: W.model.segmentHouseNumbers verfügbar:`, !!W?.model?.segmentHouseNumbers);
            console.log(`${SCRIPT_NAME}: W.model.segmentHouseNumbers.objects verfügbar:`, !!W?.model?.segmentHouseNumbers?.objects);

            if (W?.model?.segmentHouseNumbers?.objects) {
                const objCount = Object.keys(W.model.segmentHouseNumbers.objects).length;
                console.log(`${SCRIPT_NAME}: W.model.segmentHouseNumbers.objects hat ${objCount} Einträge`);
            }

            if (W?.model?.houseNumbers?.objects) {
                const objCount = Object.keys(W.model.houseNumbers.objects).length;
                console.log(`${SCRIPT_NAME}: W.model.houseNumbers.objects hat ${objCount} Einträge`);
            }

            // ===== METHODE 1: W.model.segmentHouseNumbers (HAUPTQUELLE) =====
            let count_segHN = 0;
            if (W?.model?.segmentHouseNumbers?.objects) {
                console.log(`${SCRIPT_NAME}: Scanne W.model.segmentHouseNumbers...`);
                const segHNObjects = W.model.segmentHouseNumbers.objects;

                for (const id in segHNObjects) {
                    const hn = segHNObjects[id];
                    const attrs = hn?.attributes || hn;
                    const number = attrs?.number;

                    if (!number) continue;

                    let lat = null, lon = null;
                    let hasCoords = false;

                    // Koordinaten extrahieren - MODERNISIERT für neue WME API
                    try {
                        if (hn?.getOLGeometry && typeof hn.getOLGeometry === 'function') {
                            const geom = hn.getOLGeometry();
                            if (geom && geom.getCoordinates) {
                                const coords = geom.getCoordinates();
                                if (coords && coords.length >= 2) {
                                    const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                    if (convertedCoords) {
                                        lat = convertedCoords.lat;
                                        lon = convertedCoords.lon;
                                        hasCoords = true;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.log(`${SCRIPT_NAME}: getOLGeometry Fehler für HN ${number}:`, e);
                    }

                    // Fallback: Versuche über attributes.geometry (ohne direkte geometry-Property)
                    if (!hasCoords && attrs?.geometry?.coordinates) {
                        const coords = attrs.geometry.coordinates;
                        if (coords && coords.length >= 2) {
                            const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                            if (convertedCoords) {
                                lat = convertedCoords.lat;
                                lon = convertedCoords.lon;
                                hasCoords = true;
                            }
                        }
                    }

                    if (hasCoords) {
                        addPosition(number, lat, lon, false);
                        count_segHN++;
                    } else {
                        // Dummy-Position hinzufügen
                        addPosition(number, null, null, true);
                        count_segHN++;
                    }
                }
            }
            console.log(`${SCRIPT_NAME}: W.model.segmentHouseNumbers: ${count_segHN} HN gefunden`);

            // ===== METHODE 2: W.model.houseNumbers (BACKUP) =====
            let count_hn = 0;
            if (W?.model?.houseNumbers?.objects) {
                console.log(`${SCRIPT_NAME}: Scanne W.model.houseNumbers...`);
                const hnObjects = W.model.houseNumbers.objects;

                for (const id in hnObjects) {
                    const hn = hnObjects[id];
                    const attrs = hn?.attributes || hn;
                    const number = attrs?.number || attrs?.houseNumber;

                    if (!number) continue;

                    // Prüfe ob wir diese HN schon haben
                    const numStr = String(number).trim().toLowerCase();
                    if (result.has(numStr)) {
                        // Bereits vorhanden, überspringe
                        continue;
                    }

                    let lat = null, lon = null;
                    let hasCoords = false;

                    // Koordinaten extrahieren - MODERNISIERT
                    try {
                        if (hn?.getOLGeometry && typeof hn.getOLGeometry === 'function') {
                            const geom = hn.getOLGeometry();
                            if (geom && geom.getCoordinates) {
                                const coords = geom.getCoordinates();
                                if (coords && coords.length >= 2) {
                                    const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                    if (convertedCoords) {
                                        lat = convertedCoords.lat;
                                        lon = convertedCoords.lon;
                                        hasCoords = true;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.log(`${SCRIPT_NAME}: getOLGeometry Fehler für HN ${number}:`, e);
                    }

                    // Fallback: attributes.geometry (ohne deprecated geometry property)
                    if (!hasCoords && attrs?.geometry?.coordinates) {
                        const coords = attrs.geometry.coordinates;
                        if (coords && coords.length >= 2) {
                            const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                            if (convertedCoords) {
                                lat = convertedCoords.lat;
                                lon = convertedCoords.lon;
                                hasCoords = true;
                            }
                        }
                    }

                    if (hasCoords) {
                        addPosition(number, lat, lon, false);
                        count_hn++;
                    } else {
                        addPosition(number, null, null, true);
                        count_hn++;
                    }
                }
            }
            console.log(`${SCRIPT_NAME}: W.model.houseNumbers: ${count_hn} zusätzliche HN gefunden`);

            // ===== METHODE 3: Direkte WME API Abfrage =====
            let count_api = 0;
            try {
                if (wmeSDK?.DataModel?.HouseNumbers?.getAll) {
                    console.log(`${SCRIPT_NAME}: Scanne über WME SDK...`);
                    const allHN = wmeSDK.DataModel.HouseNumbers.getAll();
                    if (allHN && Array.isArray(allHN)) {
                        for (const hn of allHN) {
                            const number = hn?.number || hn?.attributes?.number;
                            if (!number) continue;

                            const numStr = String(number).trim().toLowerCase();
                            if (result.has(numStr)) continue; // Bereits vorhanden

                            const geometry = hn?.geometry || hn?.point;
                            if (geometry && geometry.coordinates) {
                                const convertedCoords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                                if (convertedCoords) {
                                    addPosition(number, convertedCoords.lat, convertedCoords.lon, false);
                                    count_api++;
                                }
                            } else {
                                addPosition(number, null, null, true);
                                count_api++;
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: WME SDK Scan Fehler:`, e);
            }
            console.log(`${SCRIPT_NAME}: WME SDK: ${count_api} zusätzliche HN gefunden`);

            // ===== METHODE 4: Direkte Segment-Suche (FALLBACK) =====
            let count_segments = 0;
            try {
                if (W?.model?.segments?.objects && (count_segHN + count_hn + count_api) === 0) {
                    console.log(`${SCRIPT_NAME}: Fallback: Scanne Segmente nach HN...`);
                    const segments = W.model.segments.objects;

                    for (const segId in segments) {
                        const segment = segments[segId];
                        const houseNumbers = segment?.attributes?.houseNumbers || segment?.houseNumbers;

                        if (houseNumbers && Array.isArray(houseNumbers)) {
                            for (const hn of houseNumbers) {
                                const number = hn?.number || hn?.attributes?.number;
                                if (!number) continue;

                                const numStr = String(number).trim().toLowerCase();
                                if (result.has(numStr)) continue; // Bereits vorhanden

                                // Versuche Koordinaten zu extrahieren
                                let lat = null, lon = null;
                                let hasCoords = false;

                                try {
                                    if (hn?.getOLGeometry && typeof hn.getOLGeometry === 'function') {
                                        const geom = hn.getOLGeometry();
                                        if (geom && geom.getCoordinates) {
                                            const coords = geom.getCoordinates();
                                            if (coords && coords.length >= 2) {
                                                const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                                if (convertedCoords) {
                                                    lat = convertedCoords.lat;
                                                    lon = convertedCoords.lon;
                                                    hasCoords = true;
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {
                                    // Ignoriere Fehler
                                }

                                if (hasCoords) {
                                    addPosition(number, lat, lon, false);
                                    count_segments++;
                                } else {
                                    addPosition(number, null, null, true);
                                    count_segments++;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Segment-Scan Fehler:`, e);
            }
            console.log(`${SCRIPT_NAME}: Segment-Scan: ${count_segments} zusätzliche HN gefunden`);

            // ===== METHODE 5: Sichtbare Features auf der Karte (LETZTER FALLBACK) =====
            let count_visible = 0;
            try {
                if ((count_segHN + count_hn + count_api + count_segments) === 0 && W?.map?.getOLMap) {
                    console.log(`${SCRIPT_NAME}: Letzter Fallback: Scanne sichtbare Features...`);
                    const olMap = W.map.getOLMap();

                    if (olMap && olMap.getLayers) {
                        const layers = olMap.getLayers().getArray();

                        for (const layer of layers) {
                            if (layer.getSource && typeof layer.getSource === 'function') {
                                const source = layer.getSource();

                                if (source && source.getFeatures && typeof source.getFeatures === 'function') {
                                    const features = source.getFeatures();

                                    for (const feature of features) {
                                        const props = feature.getProperties ? feature.getProperties() : {};
                                        const number = props.number || props.houseNumber || props.house_number;

                                        if (number) {
                                            const numStr = String(number).trim().toLowerCase();
                                            if (result.has(numStr)) continue;

                                            const geom = feature.getGeometry ? feature.getGeometry() : null;
                                            if (geom && geom.getCoordinates) {
                                                const coords = geom.getCoordinates();
                                                if (coords && coords.length >= 2) {
                                                    const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                                    if (convertedCoords) {
                                                        addPosition(number, convertedCoords.lat, convertedCoords.lon, false);
                                                        count_visible++;
                                                    }
                                                }
                                            } else {
                                                addPosition(number, null, null, true);
                                                count_visible++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Visible Features Scan Fehler:`, e);
            }
            console.log(`${SCRIPT_NAME}: Visible Features: ${count_visible} zusätzliche HN gefunden`);

            const totalHN = count_segHN + count_hn + count_api + count_segments + count_visible;
            console.log(`${SCRIPT_NAME}: === SCAN ABGESCHLOSSEN ===`);
            console.log(`${SCRIPT_NAME}: Gesamt: ${totalHN} HN gefunden, ${result.size} verschiedene Nummern`);

            // Debug: Zeige erste paar erkannte HN
            if (result.size > 0) {
                let debugCount = 0;
                for (const [number, positions] of result.entries()) {
                    if (debugCount < 5) {
                        const realPos = positions.filter(p => !p.isDummy).length;
                        const dummyPos = positions.filter(p => p.isDummy).length;
                        console.log(`${SCRIPT_NAME}: HN "${number}": ${realPos} echte + ${dummyPos} Dummy Positionen`);
                        debugCount++;
                    }
                }
            } else {
                console.log(`${SCRIPT_NAME}: ⚠️ KEINE HAUSNUMMERN GEFUNDEN`);
                console.log(`${SCRIPT_NAME}: Mögliche Ursachen:`);
                console.log(`${SCRIPT_NAME}: - Zoom-Level zu niedrig (empfohlen: 19+)`);
                console.log(`${SCRIPT_NAME}: - Keine HN im sichtbaren Bereich`);
                console.log(`${SCRIPT_NAME}: - WME-Daten noch nicht geladen`);
                console.log(`${SCRIPT_NAME}: - Script zu früh ausgeführt`);
                console.log(`${SCRIPT_NAME}: Versuche:`);
                console.log(`${SCRIPT_NAME}: 1. Zoom auf Level 19+ setzen`);
                console.log(`${SCRIPT_NAME}: 2. In einen Bereich mit bekannten HN navigieren`);
                console.log(`${SCRIPT_NAME}: 3. Kurz warten und erneut versuchen`);
            }

        } catch (e) {
            console.error(`${SCRIPT_NAME}: scanVisibleHouseNumbers Fehler:`, e);
        }

        return result;
    }

    // Erweiterte HN-Suche auch außerhalb des sichtbaren Bereichs - VERBESSERT für große Gebäude
    async scanAllHouseNumbersInArea(centerLat, centerLon, radiusMeters = 1000) {
        console.log(`${SCRIPT_NAME}: === ERWEITERTE HN-SUCHE FÜR GROSSE GEBÄUDE ===`);
        console.log(`${SCRIPT_NAME}: Zentrum: ${centerLat.toFixed(6)}, ${centerLon.toFixed(6)}, Radius: ${radiusMeters}m`);

        const result = new Map(); // number (lowercase) -> Array von {lat, lon, isDummy, source}

        // Erweiterte addPosition Funktion mit Quellen-Tracking
        const addPosition = (number, lat, lon, isDummy = false, source = 'unknown') => {
            if (!number) return;

            const numStr = String(number).trim().toLowerCase();
            if (!result.has(numStr)) {
                result.set(numStr, []);
            }

            if (isDummy) {
                result.get(numStr).push({ lat: null, lon: null, isDummy: true, source });
                console.log(`${SCRIPT_NAME}: [${source}] HN ${number} hinzugefügt (Dummy-Position)`);
                return;
            }

            if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) return;
            if (lat < 45 || lat > 55 || lon < 5 || lon > 17) {
                console.log(`${SCRIPT_NAME}: [${source}] Ungültige Koordinaten für HN ${number}: ${lat}, ${lon}`);
                return;
            }

            result.get(numStr).push({ lat, lon, isDummy: false, source });
            console.log(`${SCRIPT_NAME}: [${source}] HN ${number} hinzugefügt: ${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        };

        try {
            // METHODE 1: Alle WME Model-Objekte durchsuchen (auch außerhalb Viewport)
            const sources = [
                { name: 'segmentHouseNumbers', objects: W?.model?.segmentHouseNumbers?.objects },
                { name: 'houseNumbers', objects: W?.model?.houseNumbers?.objects }
            ];

            for (const source of sources) {
                if (!source.objects) continue;

                console.log(`${SCRIPT_NAME}: Durchsuche ALLE ${source.name} (auch außerhalb Viewport)...`);
                let totalCount = 0;
                let inRadiusCount = 0;

                for (const id in source.objects) {
                    const hn = source.objects[id];
                    const attrs = hn?.attributes || hn;
                    const number = attrs?.number;

                    if (!number) continue;
                    totalCount++;

                    let lat = null, lon = null;
                    let hasCoords = false;

                    // Koordinaten extrahieren (alle Methoden versuchen) - MODERNISIERT
                    try {
                        if (hn?.getOLGeometry && typeof hn.getOLGeometry === 'function') {
                            const geom = hn.getOLGeometry();
                            if (geom && geom.getCoordinates) {
                                const coords = geom.getCoordinates();
                                if (coords && coords.length >= 2) {
                                    const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                    if (convertedCoords) {
                                        lat = convertedCoords.lat;
                                        lon = convertedCoords.lon;
                                        hasCoords = true;
                                    }
                                }
                            }
                        }
                    } catch (e) {}

                    // Fallback: attributes.geometry (ohne deprecated geometry property)
                    if (!hasCoords && attrs?.geometry?.coordinates) {
                        const coords = attrs.geometry.coordinates;
                        if (coords && coords.length >= 2) {
                            const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                            if (convertedCoords) {
                                lat = convertedCoords.lat;
                                lon = convertedCoords.lon;
                                hasCoords = true;
                            }
                        }
                    }

                    if (hasCoords) {
                        // Prüfe ob HN im erweiterten Suchradius liegt (für große Gebäude)
                        const distance = this.calculateDistance(centerLat, centerLon, lat, lon);
                        if (distance <= radiusMeters) {
                            addPosition(number, lat, lon, false, source.name);
                            inRadiusCount++;
                        } else if (distance <= radiusMeters * 2) {
                            // Auch HN in doppeltem Radius erfassen (für sehr große Gebäude)
                            addPosition(number, lat, lon, false, `${source.name}_extended`);
                            console.log(`${SCRIPT_NAME}: [${source.name}_extended] HN ${number} in erweitertem Radius: ${distance.toFixed(0)}m`);
                            inRadiusCount++;
                        }
                    } else {
                        // Dummy-Position hinzufügen (könnte trotzdem relevant sein)
                        addPosition(number, null, null, true, source.name);
                        inRadiusCount++;
                    }
                }

                console.log(`${SCRIPT_NAME}: ${source.name}: ${inRadiusCount}/${totalCount} HN im Suchbereich gefunden`);
            }

            // METHODE 2: Direkte Segment-basierte Suche für große Gebäude
            console.log(`${SCRIPT_NAME}: === SEGMENT-BASIERTE SUCHE FÜR GROSSE GEBÄUDE ===`);
            try {
                if (W?.model?.segments?.objects) {
                    let segmentCount = 0;
                    let hnFromSegments = 0;

                    // Durchsuche alle Segmente im erweiterten Bereich
                    for (const segId in W.model.segments.objects) {
                        const segment = W.model.segments.objects[segId];
                        const attrs = segment?.attributes || segment;

                        // Prüfe ob Segment HN hat
                        if (!attrs?.hasHNs) continue;

                        // Prüfe ob Segment im Suchbereich liegt
                        let segmentInRange = false;
                        try {
                            const geom = segment?.getGeometry?.() || attrs?.geometry;
                            if (geom && geom.coordinates) {
                                // Prüfe ersten und letzten Punkt des Segments
                                const coords = geom.coordinates;
                                for (let i = 0; i < coords.length; i += Math.max(1, Math.floor(coords.length / 3))) {
                                    const convertedCoords = this.convertWebMercatorToWGS84(coords[i][0], coords[i][1]);
                                    if (convertedCoords) {
                                        const distance = this.calculateDistance(centerLat, centerLon, convertedCoords.lat, convertedCoords.lon);
                                        if (distance <= radiusMeters * 1.5) { // Erweiterte Suche für Segmente
                                            segmentInRange = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        } catch (e) {}

                        if (!segmentInRange) continue;
                        segmentCount++;

                        // Suche HN auf diesem Segment
                        if (W?.model?.segmentHouseNumbers?.objects) {
                            for (const hnId in W.model.segmentHouseNumbers.objects) {
                                const hn = W.model.segmentHouseNumbers.objects[hnId];
                                const hnAttrs = hn?.attributes || hn;
                                const hnSegId = hnAttrs?.segID || hnAttrs?.segmentId;

                                if (String(hnSegId) !== String(segId)) continue;

                                const number = hnAttrs?.number;
                                if (!number) continue;

                                // Koordinaten extrahieren - MODERNISIERT
                                try {
                                    if (hn?.getOLGeometry && typeof hn.getOLGeometry === 'function') {
                                        const geom = hn.getOLGeometry();
                                        if (geom && geom.getCoordinates) {
                                            const coords = geom.getCoordinates();
                                            if (coords && coords.length >= 2) {
                                                const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                                if (convertedCoords) {
                                                    lat = convertedCoords.lat;
                                                    lon = convertedCoords.lon;
                                                    hasCoords = true;
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {}

                                // Fallback: attributes.geometry
                                if (!hasCoords && hnAttrs?.geometry?.coordinates) {
                                    const coords = hnAttrs.geometry.coordinates;
                                    if (coords && coords.length >= 2) {
                                        const convertedCoords = this.convertWebMercatorToWGS84(coords[0], coords[1]);
                                        if (convertedCoords) {
                                            lat = convertedCoords.lat;
                                            lon = convertedCoords.lon;
                                            hasCoords = true;
                                        }
                                    }
                                }

                                // HN hinzufügen (auch wenn schon vorhanden - für Vollständigkeit)
                                const numStr = String(number).trim().toLowerCase();
                                if (!result.has(numStr)) {
                                    if (hasCoords) {
                                        addPosition(number, lat, lon, false, 'segment_search');
                                        hnFromSegments++;
                                    } else {
                                        addPosition(number, null, null, true, 'segment_search');
                                        hnFromSegments++;
                                    }
                                } else {
                                    // Bereits vorhanden, aber logge es trotzdem
                                    console.log(`${SCRIPT_NAME}: [segment_search] HN ${number} bereits erfasst (Segment ${segId})`);
                                }
                            }
                        }
                    }

                    console.log(`${SCRIPT_NAME}: Segment-Suche: ${hnFromSegments} HN auf ${segmentCount} Segmenten mit hasHNs=true gefunden`);
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Fehler bei Segment-basierter Suche:`, e);
            }

            // METHODE 3: WME SDK Fallback für sehr große Gebäude
            console.log(`${SCRIPT_NAME}: === WME SDK FALLBACK FÜR GROSSE GEBÄUDE ===`);
            try {
                if (wmeSDK?.DataModel?.HouseNumbers?.getAll) {
                    const allSDKHN = wmeSDK.DataModel.HouseNumbers.getAll();
                    if (allSDKHN && Array.isArray(allSDKHN)) {
                        let sdkCount = 0;
                        for (const hn of allSDKHN) {
                            const number = hn?.number || hn?.attributes?.number;
                            if (!number) continue;

                            const geometry = hn?.geometry || hn?.point;
                            if (geometry && geometry.coordinates) {
                                const convertedCoords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                                if (convertedCoords) {
                                    const distance = this.calculateDistance(centerLat, centerLon, convertedCoords.lat, convertedCoords.lon);
                                    if (distance <= radiusMeters * 2) { // Sehr erweiterte Suche
                                        const numStr = String(number).trim().toLowerCase();
                                        if (!result.has(numStr)) {
                                            addPosition(number, convertedCoords.lat, convertedCoords.lon, false, 'sdk_fallback');
                                            sdkCount++;
                                        }
                                    }
                                }
                            }
                        }
                        console.log(`${SCRIPT_NAME}: SDK Fallback: ${sdkCount} zusätzliche HN gefunden`);
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: SDK Fallback Fehler:`, e);
            }

        } catch (e) {
            console.error(`${SCRIPT_NAME}: Erweiterte HN-Suche Fehler:`, e);
        }

        // Zusammenfassung
        let totalPositions = 0;
        let realPositions = 0;
        let dummyPositions = 0;

        for (const positions of result.values()) {
            totalPositions += positions.length;
            realPositions += positions.filter(p => !p.isDummy).length;
            dummyPositions += positions.filter(p => p.isDummy).length;
        }

        console.log(`${SCRIPT_NAME}: === ERWEITERTE SUCHE ABGESCHLOSSEN ===`);
        console.log(`${SCRIPT_NAME}: ${result.size} verschiedene HN-Nummern gefunden`);
        console.log(`${SCRIPT_NAME}: ${realPositions} echte Positionen, ${dummyPositions} Dummy-Positionen`);
        console.log(`${SCRIPT_NAME}: Suchradius: ${radiusMeters}m (erweitert auf ${radiusMeters * 2}m für große Gebäude)`);

        return result;
    }

    // Quelldaten gegen existierende HN filtern - VERBESSERTE VERSION mit intelligenter Segment-Prüfung
    filterAgainstExisting(houseNumbers, existingHN) {
        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20; // Meter
        const SEGMENT_AWARE_DISTANCE = CONFIG.import.segmentAwareRadius || 50; // Erweiterte Prüfung für verschiedene Segmente
        const SMART_DETECTION = CONFIG.import.smartDuplicateDetection !== false;
        const ALLOW_DIFFERENT_SEGMENTS = CONFIG.import.allowSameNumberDifferentSegments !== false;
        const ALLOW_SAME_SEGMENT = CONFIG.import.allowSameNumberSameSegment !== false;
        const SAME_SEGMENT_MIN_DISTANCE = CONFIG.import.sameSegmentMinDistance || 10;
        const PREFER_REAL_COORDS = CONFIG.import.preferRealCoordinates !== false;

        const result = [];
        const seen = new Map(); // Für Quelldaten-Deduplizierung
        let removedByWME = 0;
        let removedBySource = 0;
        let removedByGlobal = 0;
        let removedByFallback = 0;

        console.log(`${SCRIPT_NAME}: Filtere ${houseNumbers.length} HN gegen ${existingHN.size} existierende Nummern`);
        console.log(`${SCRIPT_NAME}: Duplikat-Radius: ${DUPLICATE_DISTANCE}m, Segment-Aware: ${SEGMENT_AWARE_DISTANCE}m`);
        console.log(`${SCRIPT_NAME}: Smart Detection: ${SMART_DETECTION}, Verschiedene Segmente: ${ALLOW_DIFFERENT_SEGMENTS}, Gleiche Segmente: ${ALLOW_SAME_SEGMENT} (min ${SAME_SEGMENT_MIN_DISTANCE}m), Echte Koordinaten bevorzugen: ${PREFER_REAL_COORDS}`);

        // Debug: Zeige erste paar existierende HN
        let debugCount = 0;
        for (const [number, positions] of existingHN.entries()) {
            if (debugCount < 5) {
                console.log(`${SCRIPT_NAME}: Existierende HN "${number}": ${positions.length} Positionen`, positions);
                debugCount++;
            }
        }

        // FALLBACK: Wenn keine existierenden HN gefunden wurden, direkte WME-Prüfung
        let fallbackHN = new Map(); // number -> Set von segmentIds mit Koordinaten
        if (existingHN.size === 0) {
            console.log(`${SCRIPT_NAME}: FALLBACK: Keine existierenden HN gefunden, verwende direkte WME-Prüfung`);

            // Sammle alle HN-Nummern mit Segment-Info und Koordinaten direkt aus WME
            try {
                const segHNObjects = W?.model?.segmentHouseNumbers?.objects || {};
                for (const id in segHNObjects) {
                    const hn = segHNObjects[id];
                    const number = hn?.attributes?.number || hn?.number;
                    const segmentId = hn?.attributes?.segID || hn?.segID;
                    const geometry = hn?.geometry || hn?.attributes?.geometry;

                    if (number && segmentId) {
                        const numStr = String(number).trim().toLowerCase();
                        if (!fallbackHN.has(numStr)) {
                            fallbackHN.set(numStr, new Set());
                        }

                        // Speichere Segment-ID mit Koordinaten-Info
                        let coordInfo = { segmentId: String(segmentId), hasCoords: false };
                        if (geometry && geometry.coordinates) {
                            const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                            if (coords && coords.lat && coords.lon) {
                                coordInfo.hasCoords = true;
                                coordInfo.lat = coords.lat;
                                coordInfo.lon = coords.lon;
                            }
                        }

                        fallbackHN.get(numStr).add(JSON.stringify(coordInfo));
                        console.log(`${SCRIPT_NAME}: Fallback HN gefunden: ${number} auf Segment ${segmentId} ${coordInfo.hasCoords ? `(${coordInfo.lat.toFixed(6)}, ${coordInfo.lon.toFixed(6)})` : '(ohne Koordinaten)'}`);
                    }
                }

                const hnObjects = W?.model?.houseNumbers?.objects || {};
                for (const id in hnObjects) {
                    const hn = hnObjects[id];
                    const number = hn?.attributes?.number || hn?.number;
                    const segmentId = hn?.attributes?.segID || hn?.segID;
                    const geometry = hn?.geometry || hn?.attributes?.geometry;

                    if (number && segmentId) {
                        const numStr = String(number).trim().toLowerCase();
                        if (!fallbackHN.has(numStr)) {
                            fallbackHN.set(numStr, new Set());
                        }

                        // Speichere Segment-ID mit Koordinaten-Info
                        let coordInfo = { segmentId: String(segmentId), hasCoords: false };
                        if (geometry && geometry.coordinates) {
                            const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                            if (coords && coords.lat && coords.lon) {
                                coordInfo.hasCoords = true;
                                coordInfo.lat = coords.lat;
                                coordInfo.lon = coords.lon;
                            }
                        }

                        fallbackHN.get(numStr).add(JSON.stringify(coordInfo));
                    }
                }

                console.log(`${SCRIPT_NAME}: Fallback: ${fallbackHN.size} HN-Nummern gefunden`);
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Fallback-Fehler:`, e);
            }
        }

        // Debug: Zeige erste paar zu importierende HN
        console.log(`${SCRIPT_NAME}: Zu importierende HN (erste 5):`);
        for (let i = 0; i < Math.min(5, houseNumbers.length); i++) {
            const hn = houseNumbers[i];
            console.log(`${SCRIPT_NAME}: Import HN ${hn.number} bei ${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)}`);
        }

        for (const hn of houseNumbers) {
            const numberStr = String(hn.number).trim().toLowerCase();
            let isDuplicate = false;
            let duplicateReason = '';
            let duplicateDistance = 0;

            console.log(`${SCRIPT_NAME}: === PRÜFE HN ${hn.number} bei ${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)} ===`);

            // PRÜFUNG 1: Gegen existierende HN in WME (HAUPTPRÜFUNG)
            if (!isDuplicate && existingHN.has(numberStr)) {
                const existingPositions = existingHN.get(numberStr);
                console.log(`${SCRIPT_NAME}: Prüfe HN ${hn.number} gegen ${existingPositions.length} existierende Positionen`);

                // Intelligente Behandlung von Dummy-Positionen
                const realPositions = existingPositions.filter(p => !p.isDummy && p.lat && p.lon);
                const dummyPositions = existingPositions.filter(p => p.isDummy);

                console.log(`${SCRIPT_NAME}: ${realPositions.length} echte Positionen, ${dummyPositions.length} Dummy-Positionen`);

                // Prüfe zuerst echte Positionen - NUR DIESE SIND ZUVERLÄSSIG
                for (let i = 0; i < realPositions.length; i++) {
                    const pos = realPositions[i];
                    const dist = this.calculateDistance(hn.lat, hn.lon, pos.lat, pos.lon);
                    console.log(`${SCRIPT_NAME}: Position ${i+1}: Import(${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)}) vs Existing(${pos.lat.toFixed(6)}, ${pos.lon.toFixed(6)}) = ${dist.toFixed(1)}m`);

                    if (dist < DUPLICATE_DISTANCE) {
                        isDuplicate = true;
                        duplicateReason = `WME (${dist.toFixed(1)}m zu Position ${i+1})`;
                        duplicateDistance = dist;
                        removedByWME++;
                        console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                        break;
                    } else {
                        console.log(`${SCRIPT_NAME}: Position ${i+1} OK: ${dist.toFixed(1)}m > ${DUPLICATE_DISTANCE}m`);
                    }
                }

                // WICHTIG: Dummy-Positionen NICHT als Duplikate behandeln wenn echte Koordinaten vorhanden sind
                if (!isDuplicate && dummyPositions.length > 0 && realPositions.length === 0) {
                    console.log(`${SCRIPT_NAME}: Nur Dummy-Positionen vorhanden - führe Segment-Prüfung durch`);

                    // Nur bei Dummy-Positionen: Prüfe ob auf gleichem Segment
                    try {
                        const findResult = wmeManager.findNearestSegment(hn.lon, hn.lat, hn.street, true);
                        const targetSegmentId = findResult?.segment?.attributes?.id;

                        if (targetSegmentId) {
                            console.log(`${SCRIPT_NAME}: Ziel-Segment für HN ${hn.number}: ${targetSegmentId}`);

                            // Prüfe direkt in WME ob HN auf diesem Segment existiert
                            const segHNObjects = W?.model?.segmentHouseNumbers?.objects || {};
                            let foundOnSameSegment = false;

                            for (const id in segHNObjects) {
                                const existingHN = segHNObjects[id];
                                const existingNumber = existingHN?.attributes?.number || existingHN?.number;
                                const existingSegmentId = existingHN?.attributes?.segID || existingHN?.segID;

                                if (String(existingNumber).trim().toLowerCase() === numberStr &&
                                    String(existingSegmentId) === String(targetSegmentId)) {
                                    foundOnSameSegment = true;
                                    console.log(`${SCRIPT_NAME}: HN ${hn.number} existiert bereits auf Segment ${targetSegmentId}`);
                                    break;
                                }
                            }

                            if (foundOnSameSegment) {
                                isDuplicate = true;
                                duplicateReason = `WME (auf gleichem Segment ${targetSegmentId})`;
                                removedByWME++;
                                console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                            } else {
                                console.log(`${SCRIPT_NAME}: HN ${hn.number} nicht auf Ziel-Segment ${targetSegmentId} gefunden - ERLAUBT`);
                            }
                        } else {
                            console.log(`${SCRIPT_NAME}: Kein Ziel-Segment gefunden - Dummy-Position ignoriert`);
                        }
                    } catch (e) {
                        console.log(`${SCRIPT_NAME}: Fehler bei Segment-Prüfung:`, e);
                        // Bei Fehlern: NICHT als Duplikat behandeln
                    }
                } else if (!isDuplicate && dummyPositions.length > 0 && realPositions.length > 0) {
                    console.log(`${SCRIPT_NAME}: Dummy-Positionen ignoriert - echte Koordinaten haben Vorrang`);
                }

                if (!isDuplicate) {
                    console.log(`${SCRIPT_NAME}: ✓ PRÜFUNG 1 BESTANDEN: HN ${hn.number} - alle Distanzen > ${DUPLICATE_DISTANCE}m`);
                }
            } else {
                console.log(`${SCRIPT_NAME}: HN ${hn.number} nicht in existierenden HN gefunden - PRÜFUNG 1 ÜBERSPRUNGEN`);
            }

            // PRÜFUNG 1.5: FALLBACK - Intelligente Segment-Aware Prüfung (NUR wenn Hauptprüfung keine Ergebnisse hatte)
            if (!isDuplicate && fallbackHN.has(numberStr) && SMART_DETECTION && existingHN.size === 0) {
                console.log(`${SCRIPT_NAME}: === PRÜFUNG 1.5: FALLBACK für HN ${hn.number} (nur weil Hauptprüfung leer war) ===`);
                const existingSegmentInfos = Array.from(fallbackHN.get(numberStr)).map(s => JSON.parse(s));

                // Versuche das Ziel-Segment für diese HN zu finden
                let targetSegmentId = null;
                let targetSegmentDistance = null;
                try {
                    const findResult = wmeManager.findNearestSegment(hn.lon, hn.lat, hn.street, true);
                    targetSegmentId = findResult?.segment?.attributes?.id;
                    targetSegmentDistance = findResult?.distance;
                } catch (e) {
                    console.log(`${SCRIPT_NAME}: Fehler beim Finden des Ziel-Segments für HN ${hn.number}:`, e);
                }

                console.log(`${SCRIPT_NAME}: HN ${hn.number} - Ziel-Segment: ${targetSegmentId}, existierende Segmente: ${existingSegmentInfos.length}`);

                // Prüfe jedes existierende Segment - NUR echte Koordinaten berücksichtigen
                let foundOnSameSegment = false;
                let foundNearby = false;
                let nearestDistance = Infinity;

                for (let i = 0; i < existingSegmentInfos.length; i++) {
                    const segInfo = existingSegmentInfos[i];
                    console.log(`${SCRIPT_NAME}: Existierendes Segment ${i+1}: ${segInfo.segmentId}, hasCoords: ${segInfo.hasCoords}`);

                    // NUR Segmente mit echten Koordinaten berücksichtigen
                    if (!segInfo.hasCoords) {
                        console.log(`${SCRIPT_NAME}: Segment ${segInfo.segmentId} hat keine Koordinaten - IGNORIERT`);
                        continue;
                    }

                    if (targetSegmentId && segInfo.segmentId === String(targetSegmentId)) {
                        // HN existiert bereits auf dem GLEICHEN Segment mit echten Koordinaten
                        foundOnSameSegment = true;
                        const dist = this.calculateDistance(hn.lat, hn.lon, segInfo.lat, segInfo.lon);
                        console.log(`${SCRIPT_NAME}: HN ${hn.number} existiert bereits auf Ziel-Segment ${targetSegmentId}, Distanz: ${dist.toFixed(1)}m`);

                        if (dist < SAME_SEGMENT_MIN_DISTANCE) {
                            isDuplicate = true;
                            duplicateReason = `Fallback (gleicher Segment ${targetSegmentId}, ${dist.toFixed(1)}m)`;
                            removedByFallback++;
                            console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                        } else if (ALLOW_SAME_SEGMENT) {
                            console.log(`${SCRIPT_NAME}: HN ${hn.number} auf gleichem Segment, aber ausreichend entfernt (${dist.toFixed(1)}m) - ERLAUBT`);
                        } else {
                            isDuplicate = true;
                            duplicateReason = `Fallback (gleicher Segment ${targetSegmentId}, nicht erlaubt)`;
                            removedByFallback++;
                            console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                        }
                        break;
                    }

                    // Wenn wir Koordinaten haben, prüfe Distanz auch bei verschiedenen Segmenten
                    const dist = this.calculateDistance(hn.lat, hn.lon, segInfo.lat, segInfo.lon);
                    nearestDistance = Math.min(nearestDistance, dist);
                    console.log(`${SCRIPT_NAME}: Distanz zu Segment ${segInfo.segmentId}: ${dist.toFixed(1)}m`);

                    if (dist < DUPLICATE_DISTANCE) {
                        foundNearby = true;
                        console.log(`${SCRIPT_NAME}: HN ${hn.number} sehr nah (${dist.toFixed(1)}m) zu existierender HN auf Segment ${segInfo.segmentId}`);

                        if (!ALLOW_DIFFERENT_SEGMENTS) {
                            isDuplicate = true;
                            duplicateReason = `Fallback (zu nah: ${dist.toFixed(1)}m, Segment ${segInfo.segmentId})`;
                            removedByFallback++;
                            console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                            break;
                        } else {
                            console.log(`${SCRIPT_NAME}: HN ${hn.number} nah zu existierender HN (${dist.toFixed(1)}m), aber verschiedene Segmente erlaubt - ERLAUBT`);
                        }
                    }
                }

                if (!isDuplicate && !foundOnSameSegment && !foundNearby) {
                    console.log(`${SCRIPT_NAME}: HN ${hn.number} - keine problematischen Überschneidungen gefunden - ERLAUBT`);
                }

                if (!isDuplicate) {
                    console.log(`${SCRIPT_NAME}: ✓ PRÜFUNG 1.5 BESTANDEN: HN ${hn.number}`);
                }
            } else if (fallbackHN.has(numberStr) && existingHN.size > 0) {
                console.log(`${SCRIPT_NAME}: Fallback-Prüfung übersprungen - Hauptprüfung war bereits erfolgreich`);
            }

            // PRÜFUNG 2: Gegen GLOBALE Import-Map (bereits importierte HN)
            if (!isDuplicate) {
                console.log(`${SCRIPT_NAME}: === PRÜFUNG 2: GLOBAL für HN ${hn.number} ===`);
                let globalChecked = 0;
                for (const [key, data] of globalImportedHN.entries()) {
                    if (!data || data.lon === undefined || data.lat === undefined) continue;
                    const existingNumber = String(data.number || '').toLowerCase();
                    if (existingNumber !== numberStr) continue;

                    globalChecked++;
                    const dist = this.calculateDistance(hn.lat, hn.lon, data.lat, data.lon);
                    console.log(`${SCRIPT_NAME}: Global HN ${globalChecked}: ${dist.toFixed(1)}m`);

                    if (dist < DUPLICATE_DISTANCE) {
                        isDuplicate = true;
                        duplicateReason = `Global (${dist.toFixed(1)}m zu Global-HN ${globalChecked})`;
                        duplicateDistance = dist;
                        removedByGlobal++;
                        console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                        break;
                    }
                }

                if (!isDuplicate) {
                    console.log(`${SCRIPT_NAME}: ✓ PRÜFUNG 2 BESTANDEN: HN ${hn.number} (${globalChecked} Global-HN geprüft)`);
                }
            }

            // PRÜFUNG 3: Gegen bereits verarbeitete Quelldaten (innerhalb dieses Imports)
            // WICHTIG: Prüfe auch auf gleiches Ziel-Segment!
            if (!isDuplicate) {
                console.log(`${SCRIPT_NAME}: === PRÜFUNG 3: QUELLDATEN für HN ${hn.number} ===`);

                // Finde das Ziel-Segment für diese HN
                let targetSegmentId = null;
                try {
                    const findResult = wmeManager.findNearestSegment(hn.lon, hn.lat, hn.street, true);
                    targetSegmentId = findResult?.segment?.attributes?.id;
                } catch (e) {
                    console.log(`${SCRIPT_NAME}: Fehler beim Finden des Ziel-Segments:`, e);
                }

                if (seen.has(numberStr)) {
                    const seenPositions = seen.get(numberStr);
                    console.log(`${SCRIPT_NAME}: Prüfe gegen ${seenPositions.length} bereits verarbeitete HN ${hn.number}`);

                    for (let i = 0; i < seenPositions.length; i++) {
                        const pos = seenPositions[i];
                        const dist = this.calculateDistance(hn.lat, hn.lon, pos.lat, pos.lon);
                        console.log(`${SCRIPT_NAME}: Quelldaten ${i+1}: ${dist.toFixed(1)}m, Segment: ${pos.segmentId}`);

                        // KRITISCH: Prüfe ob gleiche HN auf gleichem Segment!
                        if (targetSegmentId && pos.segmentId && String(targetSegmentId) === String(pos.segmentId)) {
                            isDuplicate = true;
                            duplicateReason = `Quelldaten GLEICHES SEGMENT (${dist.toFixed(1)}m, Segment ${targetSegmentId})`;
                            duplicateDistance = dist;
                            removedBySource++;
                            console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                            break;
                        }

                        // Auch Distanz-basierte Prüfung
                        if (dist < DUPLICATE_DISTANCE) {
                            isDuplicate = true;
                            duplicateReason = `Quelldaten (${dist.toFixed(1)}m zu Quelldaten-HN ${i+1})`;
                            duplicateDistance = dist;
                            removedBySource++;
                            console.log(`${SCRIPT_NAME}: ✗ DUPLIKAT GEFUNDEN: HN ${hn.number} - ${duplicateReason}`);
                            break;
                        }
                    }

                    if (!isDuplicate) {
                        console.log(`${SCRIPT_NAME}: ✓ PRÜFUNG 3 BESTANDEN: HN ${hn.number}`);
                    }
                }

                // Speichere diese HN mit Segment-Info für zukünftige Prüfungen
                if (!isDuplicate) {
                    if (!seen.has(numberStr)) {
                        seen.set(numberStr, []);
                    }
                    seen.get(numberStr).push({
                        lat: hn.lat,
                        lon: hn.lon,
                        segmentId: targetSegmentId
                    });
                }
            }

            if (!isDuplicate) {
                result.push(hn);
                console.log(`${SCRIPT_NAME}: ✅ AKZEPTIERT: HN ${hn.number} bei ${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)} - ALLE PRÜFUNGEN BESTANDEN`);
            } else {
                // Debug-Info für alle Duplikate
                console.log(`${SCRIPT_NAME}: ❌ ABGELEHNT: HN ${hn.number} bei ${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)} - ${duplicateReason}`);
            }

            console.log(`${SCRIPT_NAME}: === ENDE PRÜFUNG HN ${hn.number} ===\n`);
        }

        console.log(`${SCRIPT_NAME}: Deduplizierung: ${removedByWME} via WME, ${removedByGlobal} via Global, ${removedBySource} via Quelldaten, ${removedByFallback} via Fallback`);
        console.log(`${SCRIPT_NAME}: ${result.length}/${houseNumbers.length} HN verbleiben nach Filterung`);

        return result;
    }

    // Robuste Distanzberechnung zwischen zwei Koordinaten
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine-Formel für präzise Distanzberechnung
        const R = 6371000; // Erdradius in Metern
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distanz in Metern
    }

    // Konvertiert Web Mercator (EPSG:3857) zu WGS84 (EPSG:4326)
    convertWebMercatorToWGS84(x, y) {
        try {
            if (typeof x !== 'number' || typeof y !== 'number') {
                return null;
            }

            // Web Mercator zu WGS84 Konvertierung
            const lon = (x / 20037508.34) * 180;
            let lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);

            // Validierung der Koordinaten
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                console.log(`${SCRIPT_NAME}: Ungültige Koordinaten nach Konvertierung: ${lat}, ${lon}`);
                return null;
            }

            return { lat: lat, lon: lon };
        } catch (e) {
            console.log(`${SCRIPT_NAME}: Fehler bei Koordinaten-Konvertierung:`, e);
            return null;
        }
    }

    // DEBUG: Manuelle Duplikatsprüfung für spezifische HN - VERBESSERTE VERSION
    debugCheckDuplicate(number, lat, lon) {
        console.log(`${SCRIPT_NAME}: === DEBUG DUPLIKAT-PRÜFUNG ===`);
        console.log(`${SCRIPT_NAME}: Prüfe HN ${number} bei ${lat.toFixed(6)}, ${lon.toFixed(6)}`);

        const numberStr = String(number).trim().toLowerCase();
        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20;
        const SEGMENT_AWARE_DISTANCE = 50;

        console.log(`${SCRIPT_NAME}: Duplikat-Radius: ${DUPLICATE_DISTANCE}m, Segment-Aware: ${SEGMENT_AWARE_DISTANCE}m`);

        // SCHRITT 1: Scanne existierende HN
        console.log(`${SCRIPT_NAME}: === SCHRITT 1: EXISTIERENDE HN SCANNEN ===`);
        const existingHN = this.scanVisibleHouseNumbers();

        if (existingHN.has(numberStr)) {
            const positions = existingHN.get(numberStr);
            console.log(`${SCRIPT_NAME}: Gefunden ${positions.length} existierende HN ${number}:`);

            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];
                if (pos.isDummy) {
                    console.log(`${SCRIPT_NAME}: Position ${i+1}: Dummy-Position (ohne Koordinaten)`);
                } else {
                    const dist = this.calculateDistance(lat, lon, pos.lat, pos.lon);
                    const isDuplicate = dist < DUPLICATE_DISTANCE;
                    console.log(`${SCRIPT_NAME}: Position ${i+1}: ${pos.lat.toFixed(6)}, ${pos.lon.toFixed(6)} - Distanz: ${dist.toFixed(1)}m ${isDuplicate ? '(DUPLIKAT!)' : '(OK)'}`);
                }
            }
        } else {
            console.log(`${SCRIPT_NAME}: Keine existierende HN ${number} in scanVisibleHouseNumbers gefunden`);
        }

        // SCHRITT 2: Fallback-Prüfung mit Segment-Awareness
        console.log(`${SCRIPT_NAME}: === SCHRITT 2: FALLBACK-PRÜFUNG ===`);
        const segHNObjects = W?.model?.segmentHouseNumbers?.objects || {};
        const hnObjects = W?.model?.houseNumbers?.objects || {};
        const foundSegments = [];

        // Sammle alle Segmente mit dieser HN
        for (const id in segHNObjects) {
            const hn = segHNObjects[id];
            const hnNumber = hn?.attributes?.number || hn?.number;
            const segmentId = hn?.attributes?.segID || hn?.segID;
            const geometry = hn?.geometry || hn?.attributes?.geometry;

            if (String(hnNumber).trim().toLowerCase() === numberStr) {
                let coordInfo = { segmentId: segmentId, hasCoords: false, source: 'segmentHouseNumbers' };

                if (geometry && geometry.coordinates) {
                    const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                    if (coords && coords.lat && coords.lon) {
                        coordInfo.hasCoords = true;
                        coordInfo.lat = coords.lat;
                        coordInfo.lon = coords.lon;

                        const dist = this.calculateDistance(lat, lon, coords.lat, coords.lon);
                        coordInfo.distance = dist;
                        coordInfo.isDuplicate = dist < DUPLICATE_DISTANCE;
                        coordInfo.isNearby = dist < SEGMENT_AWARE_DISTANCE;
                    }
                }

                foundSegments.push(coordInfo);
                console.log(`${SCRIPT_NAME}: Fallback: HN ${number} auf Segment ${segmentId} ${coordInfo.hasCoords ? `(${coordInfo.lat.toFixed(6)}, ${coordInfo.lon.toFixed(6)}, ${coordInfo.distance.toFixed(1)}m) ${coordInfo.isDuplicate ? 'DUPLIKAT!' : coordInfo.isNearby ? 'NAH' : 'OK'}` : '(ohne Koordinaten)'}`);
            }
        }

        for (const id in hnObjects) {
            const hn = hnObjects[id];
            const hnNumber = hn?.attributes?.number || hn?.number;
            const segmentId = hn?.attributes?.segID || hn?.segID;
            const geometry = hn?.geometry || hn?.attributes?.geometry;

            if (String(hnNumber).trim().toLowerCase() === numberStr) {
                // Prüfe ob wir diese schon haben
                const existing = foundSegments.find(s => s.segmentId === segmentId);
                if (existing) continue;

                let coordInfo = { segmentId: segmentId, hasCoords: false, source: 'houseNumbers' };

                if (geometry && geometry.coordinates) {
                    const coords = this.convertWebMercatorToWGS84(geometry.coordinates[0], geometry.coordinates[1]);
                    if (coords && coords.lat && coords.lon) {
                        coordInfo.hasCoords = true;
                        coordInfo.lat = coords.lat;
                        coordInfo.lon = coords.lon;

                        const dist = this.calculateDistance(lat, lon, coords.lat, coords.lon);
                        coordInfo.distance = dist;
                        coordInfo.isDuplicate = dist < DUPLICATE_DISTANCE;
                        coordInfo.isNearby = dist < SEGMENT_AWARE_DISTANCE;
                    }
                }

                foundSegments.push(coordInfo);
                console.log(`${SCRIPT_NAME}: Fallback: HN ${number} auf Segment ${segmentId} ${coordInfo.hasCoords ? `(${coordInfo.lat.toFixed(6)}, ${coordInfo.lon.toFixed(6)}, ${coordInfo.distance.toFixed(1)}m) ${coordInfo.isDuplicate ? 'DUPLIKAT!' : coordInfo.isNearby ? 'NAH' : 'OK'}` : '(ohne Koordinaten)'}`);
            }
        }

        if (foundSegments.length === 0) {
            console.log(`${SCRIPT_NAME}: Fallback: Keine HN ${number} gefunden - KEIN DUPLIKAT`);
        } else {
            console.log(`${SCRIPT_NAME}: Fallback: HN ${number} existiert auf ${foundSegments.length} Segmenten`);

            // Analysiere Ziel-Segment
            console.log(`${SCRIPT_NAME}: === ZIEL-SEGMENT ANALYSE ===`);
            try {
                const findResult = wmeManager.findNearestSegment(lon, lat, null, true);
                const targetSegmentId = findResult?.segment?.attributes?.id;
                const targetDistance = findResult?.distance;

                if (targetSegmentId) {
                    console.log(`${SCRIPT_NAME}: Ziel-Segment: ${targetSegmentId} (${targetDistance?.toFixed(1)}m entfernt)`);

                    const onSameSegment = foundSegments.filter(s => s.segmentId === targetSegmentId);
                    if (onSameSegment.length > 0) {
                        console.log(`${SCRIPT_NAME}: ⚠️ HN ${number} existiert bereits auf Ziel-Segment ${targetSegmentId}!`);
                        for (const seg of onSameSegment) {
                            console.log(`${SCRIPT_NAME}: - ${seg.source}: ${seg.hasCoords ? `${seg.distance.toFixed(1)}m entfernt` : 'ohne Koordinaten'}`);
                        }
                    } else {
                        console.log(`${SCRIPT_NAME}: ✓ HN ${number} existiert NICHT auf Ziel-Segment ${targetSegmentId}`);

                        // Prüfe nahegelegene HN auf anderen Segmenten
                        const nearby = foundSegments.filter(s => s.hasCoords && s.isNearby);
                        if (nearby.length > 0) {
                            console.log(`${SCRIPT_NAME}: ⚠️ Aber ${nearby.length} nahegelegene HN auf anderen Segmenten:`);
                            for (const seg of nearby) {
                                console.log(`${SCRIPT_NAME}: - Segment ${seg.segmentId}: ${seg.distance.toFixed(1)}m ${seg.isDuplicate ? '(ZU NAH!)' : '(OK)'}`);
                            }
                        }
                    }
                } else {
                    console.log(`${SCRIPT_NAME}: ⚠️ Kein Ziel-Segment gefunden`);
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Fehler bei Ziel-Segment Analyse:`, e);
            }
        }

        // SCHRITT 3: Global Import Map prüfen
        console.log(`${SCRIPT_NAME}: === SCHRITT 3: GLOBAL IMPORT MAP ===`);
        let globalCount = 0;
        for (const [key, data] of globalImportedHN.entries()) {
            if (!data || data.lon === undefined || data.lat === undefined) continue;
            const existingNumber = String(data.number || '').toLowerCase();
            if (existingNumber === numberStr) {
                const dist = this.calculateDistance(lat, lon, data.lat, data.lon);
                const isDuplicate = dist < DUPLICATE_DISTANCE;
                console.log(`${SCRIPT_NAME}: Global HN ${number}: ${data.lat.toFixed(6)}, ${data.lon.toFixed(6)} - Distanz: ${dist.toFixed(1)}m ${isDuplicate ? '(DUPLIKAT!)' : '(OK)'}`);
                globalCount++;
            }
        }

        if (globalCount === 0) {
            console.log(`${SCRIPT_NAME}: Keine globale HN ${number} gefunden`);
        }

        // SCHRITT 4: Zusammenfassung
        console.log(`${SCRIPT_NAME}: === ZUSAMMENFASSUNG ===`);
        const duplicateReasons = [];

        // Prüfe alle Kriterien
        if (existingHN.has(numberStr)) {
            const positions = existingHN.get(numberStr);
            const realPositions = positions.filter(p => !p.isDummy);
            const duplicatePositions = realPositions.filter(p => this.calculateDistance(lat, lon, p.lat, p.lon) < DUPLICATE_DISTANCE);

            if (duplicatePositions.length > 0) {
                duplicateReasons.push(`Existierende HN: ${duplicatePositions.length} zu nah`);
            } else if (positions.some(p => p.isDummy) && realPositions.length === 0) {
                duplicateReasons.push(`Existierende HN: nur Dummy-Positionen`);
            }
        }

        const duplicateSegments = foundSegments.filter(s => s.hasCoords && s.isDuplicate);
        if (duplicateSegments.length > 0) {
            duplicateReasons.push(`Fallback: ${duplicateSegments.length} zu nah`);
        }

        const globalDuplicates = Array.from(globalImportedHN.values()).filter(data => {
            if (!data || data.lon === undefined || data.lat === undefined) return false;
            const existingNumber = String(data.number || '').toLowerCase();
            if (existingNumber !== numberStr) return false;
            return this.calculateDistance(lat, lon, data.lat, data.lon) < DUPLICATE_DISTANCE;
        });

        if (globalDuplicates.length > 0) {
            duplicateReasons.push(`Global: ${globalDuplicates.length} zu nah`);
        }

        if (duplicateReasons.length > 0) {
            console.log(`${SCRIPT_NAME}: ❌ DUPLIKAT ERKANNT: ${duplicateReasons.join(', ')}`);
        } else {
            console.log(`${SCRIPT_NAME}: ✅ KEIN DUPLIKAT - Import möglich`);
        }

        console.log(`${SCRIPT_NAME}: === DEBUG ENDE ===`);
    }

    // DEBUG: Analysiere die letzte Speicher-Fehler
    debugLastSaveError() {
        console.log(`${SCRIPT_NAME}: === LETZTE SPEICHER-FEHLER ANALYSE ===`);

        if (SaveErrorHandler.lastSaveErrors.length === 0) {
            console.log(`${SCRIPT_NAME}: Keine Speicher-Fehler vorhanden`);
            return;
        }

        for (const error of SaveErrorHandler.lastSaveErrors) {
            console.log(`${SCRIPT_NAME}: Fehler-Typ: ${error.type}`);
            console.log(`${SCRIPT_NAME}: Original-Nachricht: ${error.originalMessage}`);
            console.log(`${SCRIPT_NAME}: Details:`, error.details);

            if (error.details?.houseNumber) {
                console.log(`${SCRIPT_NAME}: Problematische HN: ${error.details.houseNumber}`);
                // Automatische Debug-Prüfung für diese HN
                // (Koordinaten müssten manuell eingegeben werden)
            }
        }

        console.log(`${SCRIPT_NAME}: Für detaillierte Analyse verwende:`);
        console.log(`${SCRIPT_NAME}: importController.debugCheckDuplicate('NUMMER', lat, lon)`);
    }

    // DEBUG: Analysiere alle pending HN auf potentielle Duplikate
    debugAnalyzePendingHN() {
        console.log(`${SCRIPT_NAME}: === PENDING HN DUPLIKAT-ANALYSE ===`);

        if (pendingHouseNumbers.size === 0) {
            console.log(`${SCRIPT_NAME}: Keine pending HN vorhanden`);
            return;
        }

        console.log(`${SCRIPT_NAME}: Analysiere ${pendingHouseNumbers.size} pending HN...`);

        const pendingList = Array.from(pendingHouseNumbers.values());
        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20;
        let suspiciousCount = 0;

        // Scanne existierende HN einmal
        const existingHN = this.scanVisibleHouseNumbers();
        console.log(`${SCRIPT_NAME}: ${existingHN.size} verschiedene HN-Nummern in WME gefunden`);

        for (const hn of pendingList) {
            const numberStr = String(hn.number).trim().toLowerCase();
            let isSuspicious = false;
            let suspiciousReasons = [];

            // Prüfe gegen existierende HN
            if (existingHN.has(numberStr)) {
                const positions = existingHN.get(numberStr);
                const realPositions = positions.filter(p => !p.isDummy);

                for (const pos of realPositions) {
                    const dist = this.calculateDistance(hn.lat, hn.lon, pos.lat, pos.lon);
                    if (dist < DUPLICATE_DISTANCE) {
                        isSuspicious = true;
                        suspiciousReasons.push(`Existierende HN: ${dist.toFixed(1)}m`);
                        break;
                    }
                }

                if (!isSuspicious && positions.some(p => p.isDummy) && realPositions.length === 0) {
                    isSuspicious = true;
                    suspiciousReasons.push(`Existierende HN: nur Dummy-Positionen`);
                }
            }

            // Prüfe gegen andere pending HN
            for (const otherHN of pendingList) {
                if (otherHN === hn) continue;
                if (String(otherHN.number).trim().toLowerCase() !== numberStr) continue;

                const dist = this.calculateDistance(hn.lat, hn.lon, otherHN.lat, otherHN.lon);
                if (dist < DUPLICATE_DISTANCE) {
                    isSuspicious = true;
                    suspiciousReasons.push(`Andere pending HN: ${dist.toFixed(1)}m`);
                    break;
                }
            }

            if (isSuspicious) {
                suspiciousCount++;
                console.log(`${SCRIPT_NAME}: ⚠️ VERDÄCHTIG: HN ${hn.number} bei ${hn.lat.toFixed(6)}, ${hn.lon.toFixed(6)} - ${suspiciousReasons.join(', ')}`);
            }
        }

        console.log(`${SCRIPT_NAME}: ${suspiciousCount}/${pendingList.length} pending HN sind verdächtig`);

        if (suspiciousCount > 0) {
            console.log(`${SCRIPT_NAME}: Für detaillierte Analyse einer spezifischen HN verwende:`);
            console.log(`${SCRIPT_NAME}: importController.debugCheckDuplicate('NUMMER', lat, lon)`);
        }

        console.log(`${SCRIPT_NAME}: === ANALYSE ENDE ===`);
    }

    // DEBUG: Analysiere spezifische Koordinaten auf Duplikate
    debugCheckCoordinates(lat, lon) {
        console.log(`${SCRIPT_NAME}: === KOORDINATEN-ANALYSE ===`);
        console.log(`${SCRIPT_NAME}: Analysiere Position ${lat.toFixed(6)}, ${lon.toFixed(6)}`);

        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20;

        // Finde alle HN in der Nähe
        const nearbyHN = [];

        // Aus existierenden HN
        const existingHN = this.scanVisibleHouseNumbers();
        for (const [number, positions] of existingHN.entries()) {
            for (const pos of positions) {
                if (pos.isDummy) continue;
                const dist = this.calculateDistance(lat, lon, pos.lat, pos.lon);
                if (dist < 100) { // 100m Radius für Analyse
                    nearbyHN.push({
                        number: number,
                        lat: pos.lat,
                        lon: pos.lon,
                        distance: dist,
                        isDuplicate: dist < DUPLICATE_DISTANCE,
                        source: 'existing'
                    });
                }
            }
        }

        // Aus pending HN
        for (const hn of pendingHouseNumbers.values()) {
            const dist = this.calculateDistance(lat, lon, hn.lat, hn.lon);
            if (dist < 100 && dist > 0) { // Nicht die gleiche Position
                nearbyHN.push({
                    number: hn.number,
                    lat: hn.lat,
                    lon: hn.lon,
                    distance: dist,
                    isDuplicate: dist < DUPLICATE_DISTANCE,
                    source: 'pending'
                });
            }
        }

        // Aus global importierten HN
        for (const data of globalImportedHN.values()) {
            if (!data || data.lon === undefined || data.lat === undefined) continue;
            const dist = this.calculateDistance(lat, lon, data.lat, data.lon);
            if (dist < 100 && dist > 0) {
                nearbyHN.push({
                    number: data.number,
                    lat: data.lat,
                    lon: data.lon,
                    distance: dist,
                    isDuplicate: dist < DUPLICATE_DISTANCE,
                    source: 'global'
                });
            }
        }

        // Sortiere nach Distanz
        nearbyHN.sort((a, b) => a.distance - b.distance);

        console.log(`${SCRIPT_NAME}: ${nearbyHN.length} HN in 100m Umkreis gefunden:`);

        for (const hn of nearbyHN) {
            const status = hn.isDuplicate ? 'DUPLIKAT!' : 'OK';
            console.log(`${SCRIPT_NAME}: HN ${hn.number} (${hn.source}): ${hn.distance.toFixed(1)}m - ${status}`);
        }

        const duplicates = nearbyHN.filter(hn => hn.isDuplicate);
        if (duplicates.length > 0) {
            console.log(`${SCRIPT_NAME}: ❌ ${duplicates.length} Duplikate gefunden - Import würde fehlschlagen`);
        } else {
            console.log(`${SCRIPT_NAME}: ✅ Keine Duplikate - Import sollte möglich sein`);
        }

        console.log(`${SCRIPT_NAME}: === KOORDINATEN-ANALYSE ENDE ===`);
        return nearbyHN;
    }

    async processHouseNumber(houseNumber) {
        try {
            // SCHRITT 1: Prüfe ob HN blockiert ist
            const segmentId = houseNumber.segmentId || 'unknown';
            if (BlockedHouseNumbers.isBlocked(houseNumber.number, segmentId)) {
                importStats.skipped++;
                console.log(`${SCRIPT_NAME}: HN ${houseNumber.number} übersprungen (blockiert)`);
                return;
            }

            // Nächstes Segment finden MIT Details
            const findResult = wmeManager.findNearestSegment(
                houseNumber.lon,
                houseNumber.lat,
                houseNumber.street,
                true // returnDetails = true
            );

            const segment = findResult?.segment;
            const reason = findResult?.reason;

            if (!segment) {
                importStats.skipped++;

                const streetName = houseNumber.street || 'Unbekannt';

                // Unterscheide zwischen "zu weit" und "nicht gefunden"
                if (reason === 'too_far') {
                    // Segment existiert, aber zu weit entfernt
                    importReport.tooFarAway.push({
                        number: houseNumber.number,
                        street: streetName,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon,
                        distance: findResult.distance,
                        nearestStreet: findResult.nearestName
                    });

                    if (importStats.errors.length < 5) {
                        console.log(`${SCRIPT_NAME}: Zu weit (${findResult.distance?.toFixed(0)}m) für ${houseNumber.number} (${streetName}), nächste Straße: ${findResult.nearestName || 'unbekannt'}`);
                    }
                    importStats.errors.push({
                        number: houseNumber.number,
                        street: streetName,
                        reason: `Zu weit: ${findResult.distance?.toFixed(0)}m (max 100m)`,
                        coords: `${houseNumber.lat.toFixed(5)}, ${houseNumber.lon.toFixed(5)}`
                    });
                } else {
                    // Kein Segment in der Nähe
                    if (!importReport.missingStreets.has(streetName)) {
                        importReport.missingStreets.set(streetName, []);
                    }
                    importReport.missingStreets.get(streetName).push({
                        number: houseNumber.number,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon
                    });

                    if (importStats.errors.length < 5) {
                        console.log(`${SCRIPT_NAME}: Kein Segment für ${houseNumber.number} (${streetName}) bei ${houseNumber.lat.toFixed(5)}, ${houseNumber.lon.toFixed(5)}`);
                    }
                    importStats.errors.push({
                        number: houseNumber.number,
                        street: streetName,
                        reason: 'Kein Segment gefunden',
                        coords: `${houseNumber.lat.toFixed(5)}, ${houseNumber.lon.toFixed(5)}`
                    });
                }
            } else {
                // Prüfe auf Straßennamen-Mismatch
                if (reason === 'name_mismatch' && findResult.requestedStreet && findResult.segmentStreetName) {
                    importReport.streetMismatch.push({
                        number: houseNumber.number,
                        requestedStreet: findResult.requestedStreet,
                        foundStreet: findResult.segmentStreetName,
                        similarity: findResult.nameSimilarity,
                        distance: findResult.distance,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon
                    });
                }

                // Hausnummer hinzufügen - MIT Distanz für Validierung
                const result = await wmeManager.addHouseNumber(houseNumber, segment, findResult.distance);

                if (result.success) {
                    importStats.successful++;
                    // Zum Report hinzufügen
                    importReport.successful.push({
                        number: houseNumber.number,
                        street: houseNumber.street,
                        segmentId: result.segmentId,
                        segmentStreet: findResult.segmentStreetName,
                        distance: findResult.distance,
                        nameMatch: findResult.nameMatch,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon
                    });
                    // Erfolg loggen (nur erste 3)
                    if (importStats.successful <= 3) {
                        const matchInfo = findResult.nameMatch ? '✓' : `⚠️ ${findResult.segmentStreetName}`;
                        console.log(`${SCRIPT_NAME}: ✓ ${houseNumber.number} zu Segment ${result.segmentId} (${findResult.distance?.toFixed(0)}m) ${matchInfo}`);
                    }
                } else if (result.reason === 'duplicate') {
                    importStats.skipped++;
                    // Duplikat zum Report hinzufügen
                    importReport.duplicates.push({
                        number: houseNumber.number,
                        street: houseNumber.street,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon
                    });
                } else if (result.reason && result.reason.startsWith('too_far_from_segment')) {
                    // Zu weit vom Segment - in tooFarAway Report
                    importStats.skipped++;
                    importReport.tooFarAway.push({
                        number: houseNumber.number,
                        street: houseNumber.street || 'Unbekannt',
                        lat: houseNumber.lat,
                        lon: houseNumber.lon,
                        distance: findResult.distance,
                        nearestStreet: findResult.segmentStreetName
                    });
                } else {
                    importStats.failed++;
                    // Fehler zum Report hinzufügen
                    importReport.failed.push({
                        number: houseNumber.number,
                        street: houseNumber.street,
                        reason: result.reason,
                        lat: houseNumber.lat,
                        lon: houseNumber.lon
                    });
                    console.log(`${SCRIPT_NAME}: ✗ ${houseNumber.number}: ${result.reason}`);
                    importStats.errors.push({
                        number: houseNumber.number,
                        street: houseNumber.street,
                        reason: result.reason
                    });
                }
            }
        } catch (error) {
            importStats.failed++;
            importReport.failed.push({
                number: houseNumber.number,
                street: houseNumber.street,
                reason: error.message,
                lat: houseNumber.lat,
                lon: houseNumber.lon
            });
            console.error(`${SCRIPT_NAME}: Exception bei ${houseNumber.number}:`, error);
            importStats.errors.push({
                number: houseNumber.number,
                street: houseNumber.street,
                reason: error.message
            });
        }

        importStats.processed++;
        updateProgress();
    }

    stopImport() {
        this.shouldStop = true;
        log('Import wird gestoppt...', 'warning');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Nicht-blockierende Pause - zeigt Buttons im UI
    waitForUserContinue(importedCount) {
        return new Promise((resolve) => {
            // Erstelle Pause-Overlay im Sidebar
            const pauseDiv = document.createElement('div');
            pauseDiv.id = 'hn-import-pause-overlay';
            pauseDiv.style.cssText = `
                background: #fff3cd;
                border: 2px solid #ffc107;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                text-align: center;
            `;
            pauseDiv.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 10px;">⏸️</div>
                <div style="font-weight: bold; margin-bottom: 10px;">AUTO-PAUSE + VERIFIZIERUNG</div>
                <div style="margin-bottom: 15px;">${importedCount} HN importiert.<br>🔍 <b>Duplikat-Prüfung läuft...</b><br>Dann bitte <b>SPEICHERN!</b> (Strg+S)</div>
                <button id="hn-pause-continue" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-weight: bold;">▶️ Fortfahren</button>
                <button id="hn-pause-stop" style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">⏹️ Stopp</button>
            `;

            // Füge zum Log-Bereich hinzu (korrekter ID: hn-log)
            const logContainer = document.getElementById('hn-log');
            if (logContainer && logContainer.parentElement) {
                logContainer.parentElement.insertBefore(pauseDiv, logContainer);
            } else {
                // Fallback: Füge zum Container hinzu
                const container = document.getElementById('hn-import-container');
                if (container) {
                    container.appendChild(pauseDiv);
                }
            }

            // Event-Handler
            const continueBtn = document.getElementById('hn-pause-continue');
            const stopBtn = document.getElementById('hn-pause-stop');

            const cleanup = () => {
                const overlay = document.getElementById('hn-import-pause-overlay');
                if (overlay) overlay.remove();
            };

            if (continueBtn) {
                continueBtn.onclick = () => {
                    cleanup();
                    log('Import wird fortgesetzt...', 'success');
                    resolve();
                };
            }

            if (stopBtn) {
                stopBtn.onclick = () => {
                    cleanup();
                    this.shouldStop = true;
                    resolve();
                };
            }
        });
    }
}

const importController = new ImportController();


// ============================================================================
// LOGGING & UI HELPERS
// ============================================================================
let logElement = null;

function log(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    console.log(`[${SCRIPT_NAME}] [${type.toUpperCase()}] ${message}`);

    if (logElement) {
        const entry = document.createElement('div');
        entry.className = `log-${type}`;
        entry.innerHTML = `<span style="color:#999;">[${time}]</span> ${message}`;
        logElement.appendChild(entry);
        logElement.scrollTop = logElement.scrollHeight;
    }
}

function updateProgress() {
    const percentage = importStats.total > 0 ? Math.round((importStats.processed / importStats.total) * 100) : 0;

    const progressBar = document.getElementById('hn-progress-bar');
    const progressText = document.getElementById('hn-progress-text');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;

    const statTotal = document.getElementById('stat-total');
    const statSuccess = document.getElementById('stat-success');
    const statSkipped = document.getElementById('stat-skipped');
    const statFailed = document.getElementById('stat-failed');

    if (statTotal) statTotal.textContent = importStats.total;
    if (statSuccess) statSuccess.textContent = importStats.successful;
    if (statSkipped) statSkipped.textContent = importStats.skipped;
    if (statFailed) statFailed.textContent = importStats.failed;
}

function onImportComplete() {
    const btnStart = document.getElementById('btn-start-import');
    const btnStop = document.getElementById('btn-stop-import');
    const btnSave = document.getElementById('btn-save-changes');
    const btnReport = document.getElementById('btn-show-report');

    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.disabled = true;
    if (btnSave) btnSave.disabled = importStats.successful === 0;
    if (btnReport) btnReport.disabled = false;

    log(`Import abgeschlossen: ${importStats.successful} erfolgreich, ${importStats.skipped} übersprungen, ${importStats.failed} Fehler`,
        importStats.failed > 0 ? 'warning' : 'success');

    // AUTOMATISCHE SEGMENT-PRÜFUNG nach Import
    if (importStats.successful > 0) {
        log('🔍 Starte automatische Duplikat-Prüfung aller betroffenen Segmente...', 'info');
        setTimeout(() => {
            performPostImportDuplicateCheck();
        }, 2000); // 2 Sekunden warten damit WME die neuen HN verarbeitet hat
    }

    // Missing Streets Zusammenfassung
    if (importReport.missingStreets.size > 0) {
        log(`📍 ${importReport.missingStreets.size} Straßen ohne Segment gefunden`, 'warning');
        // Zeige die ersten 3 Straßen
        let count = 0;
        for (const [street, addresses] of importReport.missingStreets) {
            if (count >= 3) {
                log(`   ... und ${importReport.missingStreets.size - 3} weitere Straßen`, 'warning');
                break;
            }
            log(`   • ${street}: ${addresses.length} Hausnummer(n)`, 'warning');
            count++;
        }
    }

    // Zu weit entfernt Zusammenfassung
    if (importReport.tooFarAway.length > 0) {
        log(`� $${importReport.tooFarAway.length} Hausnummern zu weit vom Segment entfernt (>100m)`, 'warning');
    }

    // Straßennamen-Mismatch Zusammenfassung
    if (importReport.streetMismatch.length > 0) {
        log(`⚠️ ${importReport.streetMismatch.length} mit abweichendem Straßennamen importiert`, 'warning');
    }

    // Duplikate Zusammenfassung
    if (importReport.duplicates.length > 0) {
        log(`🔄 ${importReport.duplicates.length} Duplikate übersprungen`, 'info');
    }

    // Erste Fehler anzeigen
    if (importStats.errors.length > 0 && importStats.errors.length <= 5) {
        for (const err of importStats.errors) {
            log(`  ⚠️ ${err.number} (${err.street}): ${err.reason}`, 'error');
        }
    } else if (importStats.errors.length > 5) {
        log(`  ⚠️ ${importStats.errors.length} Fehler (Details in Konsole)`, 'error');
    }

    // Hinweis auf Report-Button
    if (importReport.missingStreets.size > 0 || importReport.duplicates.length > 0 ||
        importReport.failed.length > 0 || importReport.tooFarAway.length > 0 ||
        importReport.streetMismatch.length > 0) {
        log(`📊 Klicke "Report" für detaillierte Übersicht`, 'info');
    }
}

// ============================================================================
// AUTO-PAUSE DUPLIKAT-PRÜFUNG - Schnelle Verifizierung während Auto-Pause
// ============================================================================
async function performAutoPauseDuplicateCheck() {
    return new Promise(async (resolve, reject) => {
        try {
            log('🔍 Starte Duplikat-Verifizierung...', 'info');

            // Warte kurz damit WME die HN verarbeitet hat
            await new Promise(resolve => setTimeout(resolve, 500));

            const duplicatesFound = [];
            let segmentsChecked = 0;
            let totalHNChecked = 0;

            // ================================================================
            // SCHRITT 1: Sammle alle Segment-IDs aus pendingHouseNumbers
            // ================================================================
            const affectedSegmentIds = new Set();
            const pendingBySegment = new Map(); // segmentId -> [{number, key, data}]

            log(`🔍 Analysiere ${pendingHouseNumbers.size} pending HN...`, 'info');

            for (const [key, data] of pendingHouseNumbers.entries()) {
                if (!data.segmentId) continue;

                const segId = String(data.segmentId);
                affectedSegmentIds.add(segId);

                if (!pendingBySegment.has(segId)) {
                    pendingBySegment.set(segId, []);
                }
                pendingBySegment.get(segId).push({
                    number: String(data.number).trim().toLowerCase(),
                    key: key,
                    data: data
                });
                totalHNChecked++;
            }

            log(`🔍 ${affectedSegmentIds.size} Segmente mit pending HN gefunden`, 'info');

            // ================================================================
            // SCHRITT 2: Prüfe PENDING HN auf Duplikate (gleiche Nummer, gleiches Segment)
            // ================================================================
            for (const [segId, pendingList] of pendingBySegment.entries()) {
                if (pendingList.length < 2) continue; // Keine Duplikate möglich

                segmentsChecked++;

                // Gruppiere pending HN nach Nummer
                const numberGroups = new Map();
                for (const item of pendingList) {
                    if (!numberGroups.has(item.number)) {
                        numberGroups.set(item.number, []);
                    }
                    numberGroups.get(item.number).push(item);
                }

                // Finde Duplikate in pending HN
                for (const [number, items] of numberGroups.entries()) {
                    if (items.length > 1) {
                        // DUPLIKAT GEFUNDEN in pending HN!
                        const streetName = items[0].data.street || `Segment ${segId}`;
                        duplicatesFound.push({
                            number: number,
                            street: streetName,
                            segmentId: segId,
                            count: items.length,
                            source: 'pending',
                            keys: items.map(i => i.key)
                        });
                        log(`⚠️ PENDING DUPLIKAT: HN ${number} auf ${streetName} (${items.length}x im Import)`, 'warning');
                    }
                }
            }

            // ================================================================
            // SCHRITT 3: Prüfe gegen EXISTIERENDE HN auf den Segmenten
            // ================================================================
            for (const segId of affectedSegmentIds) {
                try {
                    const segment = W?.model?.segments?.getObjectById?.(segId) ||
                                   W?.model?.segments?.objects?.[segId];

                    if (!segment?.attributes) continue;

                    const existingHN = segment.attributes.houseNumbers || [];
                    if (existingHN.length === 0) continue;

                    // Sammle existierende HN-Nummern
                    const existingNumbers = new Map(); // number -> count
                    for (const hn of existingHN) {
                        const num = String(hn?.number || hn?.attributes?.number || '').trim().toLowerCase();
                        if (!num) continue;
                        existingNumbers.set(num, (existingNumbers.get(num) || 0) + 1);
                    }

                    // Prüfe pending HN gegen existierende
                    const pendingList = pendingBySegment.get(segId) || [];
                    for (const item of pendingList) {
                        if (existingNumbers.has(item.number)) {
                            // DUPLIKAT: Pending HN existiert bereits auf diesem Segment!
                            const streetName = segment.attributes?.primaryStreetName ||
                                             segment.attributes?.name ||
                                             item.data.street ||
                                             `Segment ${segId}`;

                            duplicatesFound.push({
                                number: item.number,
                                street: streetName,
                                segmentId: segId,
                                count: existingNumbers.get(item.number) + 1,
                                source: 'existing',
                                keys: [item.key]
                            });
                            log(`⚠️ EXISTIERENDES DUPLIKAT: HN ${item.number} auf ${streetName} existiert bereits!`, 'warning');
                        }
                    }

                    // Prüfe auch existierende HN untereinander auf Duplikate
                    for (const [num, count] of existingNumbers.entries()) {
                        if (count > 1) {
                            const streetName = segment.attributes?.primaryStreetName ||
                                             segment.attributes?.name ||
                                             `Segment ${segId}`;

                            duplicatesFound.push({
                                number: num,
                                street: streetName,
                                segmentId: segId,
                                count: count,
                                source: 'segment'
                            });
                        }
                    }

                } catch (e) {
                    console.error(`${SCRIPT_NAME}: Fehler bei Segment ${segId}:`, e);
                }
            }

            log(`🔍 Verifizierung: ${segmentsChecked} Segmente, ${totalHNChecked} pending HN geprüft`, 'info');

            // ================================================================
            // SCHRITT 4: Prüfe ActionManager auf AddHouseNumber Actions
            // ================================================================
            try {
                if (W?.model?.actionManager) {
                    const actions = W.model.actionManager.getActions?.() ||
                                   W.model.actionManager._actions ||
                                   W.model.actionManager.actions || [];

                    const hnActionsBySegment = new Map(); // segmentId -> [{number, action}]

                    for (const action of actions) {
                        // Prüfe ob es eine AddHouseNumber Action ist
                        const actionType = action?.constructor?.name || action?.type || '';
                        if (actionType.includes('HouseNumber') || actionType.includes('AddHN')) {
                            const segId = String(action?.segmentId || action?.segment?.attributes?.id || action?._segmentId || '');
                            const number = String(action?.number || action?.houseNumber || action?._number || '').trim().toLowerCase();

                            if (segId && number) {
                                if (!hnActionsBySegment.has(segId)) {
                                    hnActionsBySegment.set(segId, []);
                                }
                                hnActionsBySegment.get(segId).push({ number, action });
                            }
                        }
                    }

                    // Prüfe auf Duplikate in Actions
                    for (const [segId, actionList] of hnActionsBySegment.entries()) {
                        if (actionList.length < 2) continue;

                        const numberGroups = new Map();
                        for (const item of actionList) {
                            if (!numberGroups.has(item.number)) {
                                numberGroups.set(item.number, []);
                            }
                            numberGroups.get(item.number).push(item);
                        }

                        for (const [number, items] of numberGroups.entries()) {
                            if (items.length > 1) {
                                // Prüfe ob dieses Duplikat bereits gefunden wurde
                                const alreadyFound = duplicatesFound.some(d =>
                                    d.segmentId === segId && d.number === number
                                );

                                if (!alreadyFound) {
                                    duplicatesFound.push({
                                        number: number,
                                        street: `Segment ${segId}`,
                                        segmentId: segId,
                                        count: items.length,
                                        source: 'actionManager'
                                    });
                                    log(`⚠️ ACTION DUPLIKAT: HN ${number} auf Segment ${segId} (${items.length}x in Actions)`, 'warning');
                                }
                            }
                        }
                    }

                    if (hnActionsBySegment.size > 0) {
                        log(`🔍 ActionManager: ${actions.length} Actions, ${hnActionsBySegment.size} Segmente mit HN-Actions`, 'info');
                    }
                }
            } catch (e) {
                console.error(`${SCRIPT_NAME}: Fehler bei ActionManager-Prüfung:`, e);
            }

            if (duplicatesFound.length > 0) {
                log(`⚠️ ${duplicatesFound.length} Duplikate gefunden!`, 'warning');

                // Zeige alle gefundenen Duplikate
                for (const dup of duplicatesFound) {
                    log(`  🔄 HN ${dup.number} auf ${dup.street} (${dup.count}x, ${dup.source})`, 'warning');
                }

                log('💡 WICHTIG: Korrigiere diese VOR dem Speichern!', 'warning');
                log('💡 Nutze "Duplikate entfernen" oder lösche manuell', 'warning');

                // Aktiviere visuelle Transparenz automatisch
                const visualCheckbox = document.getElementById('hn-visual-duplicates');
                if (visualCheckbox && !visualCheckbox.checked) {
                    visualCheckbox.checked = true;
                    VisualDuplicateDetector.activate();
                    log('👁️ Visuelle Transparenz aktiviert', 'info');
                }

            } else {
                log(`✅ Keine Duplikate gefunden - Speichern sollte sicher sein`, 'success');
            }

            resolve(duplicatesFound);

        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler bei Auto-Pause-Prüfung:`, e);
            log('❌ Fehler bei Duplikat-Prüfung', 'error');
            reject(e);
        }
    });
}

// ============================================================================
// POST-IMPORT DUPLIKAT-PRÜFUNG - Vollständige Analyse nach Import-Abschluss
// ============================================================================
async function performPostImportDuplicateCheck() {
    try {
        log('🔍 Analysiere alle Segmente auf Duplikate...', 'info');

        const duplicatesFound = [];
        const segmentsChecked = new Set();
        let totalHNChecked = 0;

        // METHODE 1: Sammle alle betroffenen Segmente aus verschiedenen Quellen
        const affectedSegments = new Set();

        // Aus globalImportedHN die Segment-IDs sammeln
        for (const [key, data] of globalImportedHN.entries()) {
            if (data.segmentId) {
                affectedSegments.add(data.segmentId);
            }
        }

        // Aus pendingHouseNumbers die Segment-IDs sammeln
        for (const [key, data] of pendingHouseNumbers.entries()) {
            if (data.segmentId) {
                affectedSegments.add(data.segmentId);
            }
        }

        console.log(`${SCRIPT_NAME}: Gesammelte Segment-IDs:`, [...affectedSegments]);

        // METHODE 2: Wenn keine Segmente gefunden, scanne alle sichtbaren Segmente
        if (affectedSegments.size === 0) {
            log('🔍 Keine betroffenen Segmente gefunden, scanne alle sichtbaren Segmente...', 'info');

            try {
                if (W?.model?.segments?.objects) {
                    const allSegments = W.model.segments.objects;
                    for (const segId in allSegments) {
                        const segment = allSegments[segId];
                        const houseNumbers = segment?.attributes?.houseNumbers || [];

                        // Nur Segmente mit HN prüfen
                        if (houseNumbers.length > 0) {
                            affectedSegments.add(segId);
                        }
                    }
                }
            } catch (e) {
                console.error(`${SCRIPT_NAME}: Fehler beim Sammeln aller Segmente:`, e);
            }
        }

        log(`🔍 Prüfe ${affectedSegments.size} Segmente auf Duplikate...`, 'info');

        if (affectedSegments.size === 0) {
            log('⚠️ Keine Segmente zum Prüfen gefunden', 'warning');
            return;
        }

        // METHODE 3: Prüfe jedes Segment auf Duplikate
        for (const segmentId of affectedSegments) {
            try {
                const segment = W?.model?.segments?.getObjectById?.(segmentId) ||
                               W?.model?.segments?.objects?.[segmentId];

                if (!segment) {
                    console.log(`${SCRIPT_NAME}: Segment ${segmentId} nicht gefunden`);
                    continue;
                }

                segmentsChecked.add(segmentId);
                const houseNumbers = segment.attributes?.houseNumbers || [];

                console.log(`${SCRIPT_NAME}: Segment ${segmentId}: ${houseNumbers.length} Hausnummern`);

                if (houseNumbers.length < 2) continue; // Keine Duplikate möglich

                // Gruppiere HN nach Nummer
                const hnGroups = new Map();

                for (const hn of houseNumbers) {
                    const number = hn?.number || hn?.attributes?.number;
                    if (!number) continue;

                    const numStr = String(number).trim().toLowerCase();
                    if (!hnGroups.has(numStr)) {
                        hnGroups.set(numStr, []);
                    }
                    hnGroups.get(numStr).push(hn);
                    totalHNChecked++;
                }

                // Prüfe auf Duplikate
                for (const [number, hnList] of hnGroups.entries()) {
                    if (hnList.length > 1) {
                        // Duplikat gefunden!
                        const streetName = segment.attributes?.primaryStreetName ||
                                         segment.attributes?.name ||
                                         'Unbekannte Straße';

                        duplicatesFound.push({
                            number: number,
                            street: streetName,
                            segmentId: segmentId,
                            count: hnList.length,
                            houseNumbers: hnList
                        });

                        console.log(`${SCRIPT_NAME}: DUPLIKAT gefunden: HN ${number} auf ${streetName} (${hnList.length}x)`);
                    }
                }

            } catch (e) {
                console.error(`${SCRIPT_NAME}: Fehler bei Segment ${segmentId}:`, e);
            }
        }

        // Ergebnis-Zusammenfassung
        log(`🔍 Segment-Prüfung abgeschlossen: ${segmentsChecked.size} Segmente, ${totalHNChecked} Hausnummern geprüft`, 'info');

        if (duplicatesFound.length > 0) {
            log(`⚠️ ${duplicatesFound.length} Duplikate gefunden - WME wird diese beim Speichern melden`, 'warning');

            // Zeige alle gefundenen Duplikate
            for (const dup of duplicatesFound) {
                log(`  🔄 HN ${dup.number} auf ${dup.street} (${dup.count}x)`, 'warning');
            }

            // Aktiviere visuelle Transparenz um Duplikate zu zeigen
            const visualCheckbox = document.getElementById('hn-visual-duplicates');
            if (visualCheckbox && !visualCheckbox.checked) {
                visualCheckbox.checked = true;
                VisualDuplicateDetector.activate();
                log('👁️ Visuelle Transparenz automatisch aktiviert', 'info');
            }

        } else {
            log('✅ Keine Duplikate gefunden - Import sauber!', 'success');
        }

    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler bei Post-Import-Prüfung:`, e);
        log('❌ Fehler bei automatischer Duplikat-Prüfung', 'error');
    }
}

// ============================================================================
// BENUTZEROBERFLÄCHE - Gemäß WME API
// ============================================================================
function createUI(tabPane) {
    tabPane.innerHTML = `
        <div id="hn-import-container" style="padding: 8px; font-family: Arial, sans-serif; font-size: 12px;">
            <style>
                #hn-import-container h4 { margin: 12px 0 6px; color: #333; border-bottom: 1px solid #2196F3; padding-bottom: 4px; font-size: 13px; }
                #hn-import-container .form-group { margin-bottom: 10px; }
                #hn-import-container label { display: block; margin-bottom: 3px; font-weight: bold; }
                #hn-import-container .checkbox-label { display: flex; align-items: center; gap: 5px; font-weight: normal; }
                #hn-import-container .checkbox-label input[type="checkbox"] { width: auto; margin: 0; }
                #hn-import-container input, #hn-import-container select, #hn-import-container textarea {
                    width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 11px; box-sizing: border-box;
                }
                #hn-import-container .btn {
                    padding: 6px 10px; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold; margin: 2px 2px 2px 0;
                }
                #hn-import-container .btn-primary { background: #2196F3; color: white; }
                #hn-import-container .btn-success { background: #4CAF50; color: white; }
                #hn-import-container .btn-danger { background: #f44336; color: white; }
                #hn-import-container .btn-secondary { background: #757575; color: white; }
                #hn-import-container .btn:hover { opacity: 0.85; }
                #hn-import-container .btn:disabled { opacity: 0.5; cursor: not-allowed; }
                #hn-import-container .progress-container { background: #e0e0e0; border-radius: 8px; height: 18px; margin: 8px 0; position: relative; overflow: hidden; }
                #hn-import-container .progress-bar { height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); width: 0%; transition: width 0.3s; }
                #hn-import-container .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10px; font-weight: bold; }
                #hn-import-container .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin: 8px 0; }
                #hn-import-container .stat-item { background: #f5f5f5; padding: 5px; border-radius: 3px; text-align: center; }
                #hn-import-container .stat-value { font-size: 14px; font-weight: bold; }
                #hn-import-container .stat-label { font-size: 9px; color: #666; }
                #hn-import-container .log-container { background: #fafafa; border: 1px solid #ddd; border-radius: 3px; height: 120px; overflow-y: auto; padding: 5px; font-family: monospace; font-size: 10px; }
                #hn-import-container .log-info { color: #2196F3; }
                #hn-import-container .log-success { color: #4CAF50; }
                #hn-import-container .log-warning { color: #FF9800; }
                #hn-import-container .log-error { color: #f44336; }
                #hn-import-container .preview-info { padding: 6px; background: #e3f2fd; border-radius: 3px; margin-bottom: 8px; }
                #hn-import-container .preview-table { width: 100%; border-collapse: collapse; font-size: 10px; }
                #hn-import-container .preview-table th, #hn-import-container .preview-table td { border: 1px solid #ddd; padding: 3px; text-align: left; }
                #hn-import-container .preview-table th { background: #f0f0f0; }
            </style>

            <h4>📡 Datenquelle</h4>
            <div class="form-group">
                <select id="hn-source">
                    <option value="osm">🌍 OpenStreetMap (Overpass) - empfohlen</option>
                    <option value="manual">📝 Manuelle Eingabe</option>
                    <optgroup label="🇩🇪 Deutschland">
                        <option value="germany.nrw">NRW ALKIS Gebäude</option>
                        <option value="germany.bayern">Bayern OpenData</option>
                        <option value="germany.bw">Baden-Württemberg</option>
                        <option value="germany.berlin">Berlin FIS-Broker</option>
                        <option value="germany.brandenburg">Brandenburg</option>
                        <option value="germany.bremen">Bremen</option>
                        <option value="germany.hamburg">Hamburg</option>
                        <option value="germany.hessen">Hessen</option>
                        <option value="germany.mv">Mecklenburg-Vorpommern</option>
                        <option value="germany.niedersachsen">Niedersachsen</option>
                        <option value="germany.rlp">Rheinland-Pfalz</option>
                        <option value="germany.saarland">Saarland</option>
                        <option value="germany.sachsen">Sachsen</option>
                        <option value="germany.sachsen_anhalt">Sachsen-Anhalt</option>
                        <option value="germany.sh">Schleswig-Holstein</option>
                        <option value="germany.thueringen">Thüringen</option>
                    </optgroup>
                    <optgroup label="🇦🇹 Österreich">
                        <option value="austria.bev">BEV Adressregister</option>
                    </optgroup>
                    <optgroup label="🇨🇭 Schweiz">
                        <option value="switzerland.swisstopo">swisstopo</option>
                    </optgroup>
                </select>
            </div>

            <div class="form-group">
                <button id="btn-fetch-data" class="btn btn-primary">🔄 Daten abrufen</button>
                <button id="btn-show-bbox" class="btn btn-secondary">📍 Bereich</button>
                <button id="btn-debug-segments" class="btn btn-secondary">🔧 Debug</button>
            </div>

            <div id="zoom-warning" style="display:none; background:#fff3cd; border:1px solid #ffc107; padding:8px; border-radius:4px; margin-bottom:10px;">
                <strong>⚠️ Zoom zu niedrig!</strong><br>
                <small>Für Duplikat-Erkennung: Zoom 19+, dann durch den Bereich scrollen.</small>
            </div>

            <div id="manual-input-section" style="display: none;">
                <h4>📝 Manuelle Eingabe</h4>
                <div class="form-group">
                    <textarea id="hn-manual-data" rows="5" placeholder='[{"number":"1","street":"Hauptstr.","lon":8.123,"lat":50.456}]'></textarea>
                </div>
                <div class="form-group">
                    <input type="file" id="hn-file-input" accept=".json,.csv,.txt" style="display:none;">
                    <button id="btn-load-file" class="btn btn-secondary">📁 Datei</button>
                    <button id="btn-parse-manual" class="btn btn-primary">✓ Parsen</button>
                </div>
            </div>

            <h4>👁️ Vorschau</h4>
            <div id="hn-preview-info" class="preview-info">Noch keine Daten geladen</div>
            <div id="hn-preview-table" style="max-height: 100px; overflow-y: auto;"></div>

            <h4>⚙️ Optionen</h4>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-check-duplicates" checked>
                    <span>Duplikate prüfen</span>
                </div>
            </div>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-visual-duplicates">
                    <span>�️ Visuelle Duplikatserkennung</span>
                </div>
                <div style="font-size:9px;color:#666;margin-left:23px;">Alle HN werden transparent (80%) mit rotem Hintergrund für beste Erkennung</div>
            </div>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-auto-scan" checked>
                    <span>🔄 Auto-Scan (Zoom 19 vor Import)</span>
                </div>
                <div style="font-size:9px;color:#666;margin-left:23px;">Scrollt automatisch durch den Bereich um existierende HN zu laden</div>
            </div>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-manual-pause" checked>
                    <span>⏸️ Manuelle Pause-Funktion</span>
                </div>
                <div style="font-size:9px;color:#666;margin-left:23px;">Ermöglicht Pausieren während Import für Korrekturen</div>
            </div>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-auto-pause" checked>
                    <span>⏸️ Auto-Pause + Verifizierung</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:4px;margin-left:23px;">
                    <span style="font-size:10px;">Nach</span>
                    <input type="range" id="hn-auto-pause-count" min="50" max="500" step="10" value="50" style="flex:1;">
                    <span id="auto-pause-count-val" style="font-size:10px;min-width:35px;">50</span>
                    <span style="font-size:10px;">HN</span>
                </div>
            </div>

            <h4>⚡ Geschwindigkeit</h4>
            <div class="form-group">
                <div class="checkbox-label">
                    <input type="checkbox" id="hn-parallel-import" checked>
                    <span>🚀 Parallele Verarbeitung</span>
                </div>
                <div style="font-size:9px;color:#666;margin-left:23px;">Mehrere HN gleichzeitig importieren (schneller)</div>
            </div>
            <div class="form-group">
                <label>Geschwindigkeits-Profil:</label>
                <select id="hn-speed-profile">
                    <option value="safe">🐢 Sicher (langsam, stabil)</option>
                    <option value="normal" selected>⚖️ Normal (ausgewogen)</option>
                    <option value="fast">🐇 Schnell (riskanter)</option>
                    <option value="turbo">🚀 Turbo (max. Speed)</option>
                    <option value="custom">⚙️ Benutzerdefiniert</option>
                </select>
            </div>
            <div id="hn-speed-custom" style="display:none; background:#f5f5f5; padding:8px; border-radius:4px; margin-top:5px;">
                <div class="form-group" style="margin-bottom:5px;">
                    <label style="font-size:10px;">Start-Wartezeit: <span id="speed-initial-val">1200</span>ms</label>
                    <input type="range" id="hn-speed-initial" min="500" max="4000" step="100" value="1200" style="width:100%;">
                </div>
                <div class="form-group" style="margin-bottom:5px;">
                    <label style="font-size:10px;">Zentrierung-Delay: <span id="speed-center-val">1200</span>ms</label>
                    <input type="range" id="hn-speed-center" min="300" max="2000" step="100" value="1200" style="width:100%;">
                </div>
                <div class="form-group" style="margin-bottom:5px;">
                    <label style="font-size:10px;">Reload-Delay: <span id="speed-reload-val">300</span>ms</label>
                    <input type="range" id="hn-speed-reload" min="50" max="500" step="50" value="300" style="width:100%;">
                </div>
                <div class="form-group" style="margin-bottom:5px;">
                    <label style="font-size:10px;">Batch-Pause: <span id="speed-batch-val">150</span>ms</label>
                    <input type="range" id="hn-speed-batch" min="0" max="500" step="25" value="150" style="width:100%;">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:10px;">Batch-Größe: <span id="speed-batchsize-val">10</span> HN</label>
                    <input type="range" id="hn-speed-batchsize" min="1" max="50" step="1" value="10" style="width:100%;">
                </div>
            </div>

            <h4>� Blockie/rte Hausnummern (<span id="blocked-hn-count">0</span>)</h4>
            <div class="form-group">
                <div id="blocked-hn-list" style="background:#f9f9f9;border:1px solid #ddd;border-radius:3px;min-height:60px;">
                    <div style="color:#666;font-style:italic;padding:10px;">Keine blockierten Hausnummern</div>
                </div>
                <div style="margin-top:5px;display:flex;gap:5px;">
                    <button id="btn-clear-blocked" class="btn btn-danger" style="font-size:10px;">🗑️ Alle löschen</button>
                    <button id="btn-restore-blocked" class="btn btn-success" style="font-size:10px;">↩️ Wiederherstellen</button>
                </div>
                <div style="font-size:9px;color:#666;margin-top:3px;">
                    💡 Blockierte HN werden beim Import übersprungen. "Wiederherstellen" macht alle Blockierungen rückgängig.
                </div>
            </div>

            <h4>🚀 Import</h4>
            <div class="form-group">
                <button id="btn-start-import" class="btn btn-success" disabled>▶️ Start</button>
                <button id="btn-stop-import" class="btn btn-danger" disabled>⏹️ Stop</button>
                <button id="btn-save-changes" class="btn btn-primary" disabled>💾 Speichern</button>
                <button id="btn-show-report" class="btn btn-secondary" disabled>📊 Report</button>
            </div>

            <div class="form-group">
                <button id="btn-verify-hn" class="btn btn-warning" title="Prüft sichtbare HN auf Duplikate">🔍 Verifizieren</button>
                <button id="btn-show-save-errors" class="btn btn-danger" title="Zeigt letzte Speicher-Fehler" style="display:none;">❌ Fehler</button>
                <button id="btn-debug-duplicates" class="btn btn-secondary" title="Debug Duplikatserkennung">🐛 Debug</button>
            </div>

            <div class="progress-container">
                <div id="hn-progress-bar" class="progress-bar"></div>
                <span id="hn-progress-text" class="progress-text">0%</span>
            </div>

            <div class="stats-grid">
                <div class="stat-item"><div id="stat-total" class="stat-value">0</div><div class="stat-label">Gesamt</div></div>
                <div class="stat-item"><div id="stat-success" class="stat-value" style="color:#4CAF50;">0</div><div class="stat-label">OK</div></div>
                <div class="stat-item"><div id="stat-skipped" class="stat-value" style="color:#FF9800;">0</div><div class="stat-label">Skip</div></div>
                <div class="stat-item"><div id="stat-failed" class="stat-value" style="color:#f44336;">0</div><div class="stat-label">Fehler</div></div>
            </div>

            <h4>📝 Log</h4>
            <div id="hn-log" class="log-container"></div>

            <!-- Report Modal -->
            <div id="hn-report-modal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:10000;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:white; border-radius:8px; width:90%; max-width:600px; max-height:80vh; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.3);">
                    <div style="padding:12px 16px; background:#2196F3; color:white; display:flex; justify-content:space-between; align-items:center;">
                        <strong>📊 Import Report</strong>
                        <button id="btn-close-report" style="background:none; border:none; color:white; font-size:20px; cursor:pointer;">&times;</button>
                    </div>
                    <div id="hn-report-content" style="padding:16px; overflow-y:auto; max-height:calc(80vh - 100px);"></div>
                    <div style="padding:12px 16px; border-top:1px solid #ddd; text-align:right;">
                        <button id="btn-export-report" class="btn btn-secondary">📥 Export CSV</button>
                        <button id="btn-copy-report" class="btn btn-primary">📋 Kopieren</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Log-Element setzen
    logElement = document.getElementById('hn-log');

    // Event Listeners
    attachEventListeners();

    log('UI initialisiert', 'success');
}

function attachEventListeners() {
    // Quelle ändern
    document.getElementById('hn-source')?.addEventListener('change', (e) => {
        const manualSection = document.getElementById('manual-input-section');
        if (manualSection) {
            manualSection.style.display = e.target.value === 'manual' ? 'block' : 'none';
        }
    });

    // ========== GESCHWINDIGKEITS-EINSTELLUNGEN ==========

    // Geschwindigkeits-Profile
    const speedProfiles = {
        safe:   { initial: 3000, center: 2000, reload: 500, batch: 300, batchSize: 5, parallel: true },
        normal: { initial: 1200, center: 1200, reload: 300, batch: 150, batchSize: 10, parallel: true },
        fast:   { initial: 800,  center: 800,  reload: 150, batch: 75,  batchSize: 15, parallel: true },
        turbo:  { initial: 500,  center: 500,  reload: 100, batch: 50,  batchSize: 20, parallel: true }
    };

    // Profil-Auswahl
    document.getElementById('hn-speed-profile')?.addEventListener('change', (e) => {
        const profile = e.target.value;
        const customPanel = document.getElementById('hn-speed-custom');

        if (profile === 'custom') {
            customPanel.style.display = 'block';
        } else {
            customPanel.style.display = 'none';
            const p = speedProfiles[profile];
            if (p) {
                CONFIG.speed.initialLoadDelay = p.initial;
                CONFIG.speed.centeringDelay = p.center;
                CONFIG.speed.reloadDelay = p.reload;
                CONFIG.speed.batchDelay = p.batch;
                CONFIG.speed.parallelBatchSize = p.batchSize;
                CONFIG.speed.useParallelImport = p.parallel;

                // UI aktualisieren
                document.getElementById('hn-speed-initial').value = p.initial;
                document.getElementById('speed-initial-val').textContent = p.initial;
                document.getElementById('hn-speed-center').value = p.center;
                document.getElementById('speed-center-val').textContent = p.center;
                document.getElementById('hn-speed-reload').value = p.reload;
                document.getElementById('speed-reload-val').textContent = p.reload;
                document.getElementById('hn-speed-batch').value = p.batch;
                document.getElementById('speed-batch-val').textContent = p.batch;
                document.getElementById('hn-speed-batchsize').value = p.batchSize;
                document.getElementById('speed-batchsize-val').textContent = p.batchSize;
                document.getElementById('hn-parallel-import').checked = p.parallel;

                log(`⚡ Geschwindigkeits-Profil: ${profile}`, 'info');
            }
        }
    });

    // Parallele Verarbeitung Toggle
    document.getElementById('hn-parallel-import')?.addEventListener('change', (e) => {
        CONFIG.speed.useParallelImport = e.target.checked;
        log(`🚀 Parallele Verarbeitung: ${e.target.checked ? 'AN' : 'AUS'}`, 'info');
    });

    // Auto-Pause Einstellungen
    document.getElementById('hn-auto-pause')?.addEventListener('change', (e) => {
        CONFIG.import.autoPauseEnabled = e.target.checked;
        log(`⏸️ Auto-Pause: ${e.target.checked ? 'AN' : 'AUS'}`, 'info');
    });

    // Visuelle Duplikatserkennung Toggle
    document.getElementById('hn-visual-duplicates')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            VisualDuplicateDetector.activate();
            log('👁️ Visuelle Transparenz aktiviert - alle HN werden transparent', 'success');
        } else {
            VisualDuplicateDetector.deactivate();
            log('👁️ Visuelle Transparenz deaktiviert', 'info');
        }
    });

    // Manuelle Pause-Funktion Toggle
    document.getElementById('hn-manual-pause')?.addEventListener('change', (e) => {
        CONFIG.import.manualPauseEnabled = e.target.checked;
        log(`⏸️ Manuelle Pause-Funktion: ${e.target.checked ? 'AN' : 'AUS'}`, 'info');
    });

    document.getElementById('hn-auto-pause-count')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('auto-pause-count-val').textContent = val;
        CONFIG.import.autoPauseAfter = val;
    });

    // Custom Slider Event-Listener
    const sliderConfig = [
        { id: 'hn-speed-initial', valId: 'speed-initial-val', configKey: 'initialLoadDelay' },
        { id: 'hn-speed-center', valId: 'speed-center-val', configKey: 'centeringDelay' },
        { id: 'hn-speed-reload', valId: 'speed-reload-val', configKey: 'reloadDelay' },
        { id: 'hn-speed-batch', valId: 'speed-batch-val', configKey: 'batchDelay' },
        { id: 'hn-speed-batchsize', valId: 'speed-batchsize-val', configKey: 'parallelBatchSize' }
    ];

    sliderConfig.forEach(({ id, valId, configKey }) => {
        const slider = document.getElementById(id);
        const valSpan = document.getElementById(valId);
        if (slider && valSpan) {
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                valSpan.textContent = val;
                CONFIG.speed[configKey] = val;
            });
        }
    });

    // Bereich anzeigen
    document.getElementById('btn-show-bbox')?.addEventListener('click', () => {
        const bbox = CoordUtils.getCurrentBBox();
        const center = CoordUtils.getMapCenter();
        if (bbox && center) {
            log(`Zentrum: ${center.lat.toFixed(5)}, ${center.lon.toFixed(5)}`, 'info');
            log(`BBox: ${bbox.minLat.toFixed(5)},${bbox.minLon.toFixed(5)} - ${bbox.maxLat.toFixed(5)},${bbox.maxLon.toFixed(5)}`, 'info');
        } else {
            log('Kartenposition nicht verfügbar', 'error');
        }
    });

    // Debug-Button
    document.getElementById('btn-debug-segments')?.addEventListener('click', () => {
        debugSegments();
    });

    // Daten abrufen
    document.getElementById('btn-fetch-data')?.addEventListener('click', fetchData);

    // Zoom-Warnung aktualisieren
    const updateZoomWarning = () => {
        const warning = document.getElementById('zoom-warning');
        if (!warning) return;

        let zoom = 0;
        try {
            zoom = wmeSDK?.Map?.getZoomLevel?.() || W?.map?.getZoom?.() || 0;
        } catch (e) {}

        warning.style.display = zoom < 19 ? 'block' : 'none';
    };

    // Zoom-Warnung bei Kartenänderung aktualisieren
    setInterval(updateZoomWarning, 2000);
    updateZoomWarning();

    // Datei laden
    document.getElementById('btn-load-file')?.addEventListener('click', () => {
        document.getElementById('hn-file-input')?.click();
    });

    document.getElementById('hn-file-input')?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const text = await file.text();
                document.getElementById('hn-manual-data').value = text;
                log(`Datei "${file.name}" geladen`, 'success');
            } catch (err) {
                log(`Fehler: ${err.message}`, 'error');
            }
        }
    });

    // Manuelle Daten parsen
    document.getElementById('btn-parse-manual')?.addEventListener('click', parseManualData);

    // Import starten
    document.getElementById('btn-start-import')?.addEventListener('click', startImport);

    // Import stoppen
    document.getElementById('btn-stop-import')?.addEventListener('click', () => {
        importController.stopImport();
    });

    // Speichern - mit verbesserter Fehlerbehandlung
    document.getElementById('btn-save-changes')?.addEventListener('click', async () => {
        if (W?.model?.actionManager) {
            const count = W.model.actionManager.getActions().length;
            if (count > 0) {
                log(`💾 Speichere ${count} Änderungen...`, 'info');

                // Methode 1: SDK verwenden (bevorzugt - hat bessere Fehlerbehandlung)
                if (wmeSDK?.Editing?.save) {
                    try {
                        await wmeSDK.Editing.save();
                        // Erfolg wird über wme-save-finished Event gemeldet
                    } catch (saveError) {
                        // Fehler wird auch über Event gemeldet, aber hier zusätzlich loggen
                        console.log(`${SCRIPT_NAME}: SDK Save Fehler:`, saveError);
                        SaveErrorHandler.parseAndCategorizeError(saveError);
                        SaveErrorHandler.showErrorSummary();
                    }
                } else {
                    // Methode 2: Fallback - WME Save Button klicken
                    const saveBtn = document.querySelector('.save-button:not(.disabled), button.save-button:not([disabled])');
                    if (saveBtn) {
                        saveBtn.click();
                        log(`${count} Änderungen werden gespeichert...`, 'info');
                    } else {
                        log('Speichern-Button nicht gefunden', 'warning');
                    }
                }
            } else {
                log('Keine Änderungen zum Speichern', 'info');
            }
        }
    });

    // Report anzeigen
    document.getElementById('btn-show-report')?.addEventListener('click', showReport);

    // Verifizieren Button
    document.getElementById('btn-verify-hn')?.addEventListener('click', verifyHouseNumbers);

    // Debug Duplikate Button
    document.getElementById('btn-debug-duplicates')?.addEventListener('click', () => {
        console.log(`${SCRIPT_NAME}: === DEBUG DUPLIKATSERKENNUNG ===`);

        // Analysiere letzte Speicher-Fehler
        importController.debugLastSaveError();

        // Analysiere pending HN
        importController.debugAnalyzePendingHN();

        console.log(`${SCRIPT_NAME}: Verfügbare Debug-Funktionen:`);
        console.log(`${SCRIPT_NAME}: importController.debugCheckDuplicate('NUMMER', lat, lon) - Detaillierte Analyse einer spezifischen HN`);
        console.log(`${SCRIPT_NAME}: importController.debugCheckCoordinates(lat, lon) - Analysiere spezifische Koordinaten`);
        console.log(`${SCRIPT_NAME}: importController.debugLastSaveError() - Letzte Speicher-Fehler`);
        console.log(`${SCRIPT_NAME}: importController.debugAnalyzePendingHN() - Alle pending HN analysieren`);

        // Zeige aktuelle Konfiguration
        console.log(`${SCRIPT_NAME}: === AKTUELLE KONFIGURATION ===`);
        console.log(`${SCRIPT_NAME}: Duplikat-Radius: ${CONFIG.import.duplicateRadius}m`);
        console.log(`${SCRIPT_NAME}: Segment-Aware Distanz: ${CONFIG.import.segmentAwareRadius}m`);
        console.log(`${SCRIPT_NAME}: Smart Detection: ${CONFIG.import.smartDuplicateDetection}`);
        console.log(`${SCRIPT_NAME}: Verschiedene Segmente erlaubt: ${CONFIG.import.allowSameNumberDifferentSegments}`);
        console.log(`${SCRIPT_NAME}: Gleiche Segmente erlaubt: ${CONFIG.import.allowSameNumberSameSegment} (min ${CONFIG.import.sameSegmentMinDistance}m)`);
        console.log(`${SCRIPT_NAME}: Echte Koordinaten bevorzugen: ${CONFIG.import.preferRealCoordinates}`);
        console.log(`${SCRIPT_NAME}: Pending HN: ${pendingHouseNumbers.size}`);
        console.log(`${SCRIPT_NAME}: Global importierte HN: ${globalImportedHN.size}`);

        const existingHN = importController.scanVisibleHouseNumbers();
        console.log(`${SCRIPT_NAME}: Sichtbare HN-Nummern: ${existingHN.size}`);

        // Wenn der Benutzer gerade einen Fehler hatte, zeige Hilfe
        if (SaveErrorHandler.lastSaveErrors.length > 0) {
            console.log(`${SCRIPT_NAME}: === HILFE FÜR AKTUELLE FEHLER ===`);
            console.log(`${SCRIPT_NAME}: Du hattest gerade Speicher-Fehler. Für die Koordinaten aus der Fehlermeldung:`);
            console.log(`${SCRIPT_NAME}: importController.debugCheckCoordinates(51.393113, 7.177710)`);
        }

        console.log(`${SCRIPT_NAME}: === DEBUG ENDE ===`);
    });

    // Speicher-Fehler Button
    document.getElementById('btn-show-save-errors')?.addEventListener('click', () => {
        if (SaveErrorHandler.lastSaveErrors.length > 0) {
            const grouped = {};
            for (const error of SaveErrorHandler.lastSaveErrors) {
                if (!grouped[error.type]) grouped[error.type] = [];
                grouped[error.type].push(error);
            }
            SaveErrorHandler.showErrorModal(grouped);
        } else {
            log('Keine Speicher-Fehler vorhanden', 'info');
        }
    });

    // Report schließen
    document.getElementById('btn-close-report')?.addEventListener('click', () => {
        document.getElementById('hn-report-modal').style.display = 'none';
    });

    // Report Modal schließen bei Klick außerhalb
    document.getElementById('hn-report-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'hn-report-modal') {
            e.target.style.display = 'none';
        }
    });

    // Report exportieren
    document.getElementById('btn-export-report')?.addEventListener('click', exportReportCSV);

    // Report kopieren
    document.getElementById('btn-copy-report')?.addEventListener('click', copyReportToClipboard);

    // ========== BLOCKIERTE HAUSNUMMERN ==========

    // Alle blockierten HN löschen
    document.getElementById('btn-clear-blocked')?.addEventListener('click', () => {
        if (confirm('Alle blockierten Hausnummern löschen?')) {
            BlockedHouseNumbers.clear();
            log('Alle blockierten HN gelöscht', 'success');
        }
    });

    // Blockierte HN wiederherstellen
    document.getElementById('btn-restore-blocked')?.addEventListener('click', () => {
        const blocked = BlockedHouseNumbers.getAll();
        const count = Object.keys(blocked).length;

        if (count === 0) {
            log('Keine blockierten HN zum Wiederherstellen', 'info');
            return;
        }

        if (confirm(`${count} blockierte Hausnummern wiederherstellen?\n\nDiese können dann wieder importiert werden.`)) {
            // Alle blockierten HN wieder zu pendingHouseNumbers hinzufügen
            let restored = 0;
            for (const [key, hnData] of Object.entries(blocked)) {
                // Erstelle HN-Daten für pendingHouseNumbers
                const mockHNData = {
                    number: hnData.number,
                    segmentId: hnData.segmentId,
                    timestamp: Date.now()
                };
                pendingHouseNumbers.set(key, mockHNData);
                restored++;
            }

            // Blocklist leeren
            BlockedHouseNumbers.clear();

            log(`✓ ${restored} HN wiederhergestellt und können wieder importiert werden`, 'success');
        }
    });

    // UI für blockierte HN beim Start aktualisieren
    setTimeout(() => {
        BlockedHouseNumbers.updateUI();

        // Repariere korrupten Titel
        const headers = document.querySelectorAll('#hn-import-container h4');
        for (const header of headers) {
            if (header.textContent.includes('Blockie') || header.textContent.includes('?')) {
                const countSpan = header.querySelector('#blocked-hn-count');
                if (countSpan) {
                    header.innerHTML = `Blockierte Hausnummern (<span id="blocked-hn-count">${countSpan.textContent}</span>)`;
                }
            }
        }
    }, 100);
}

// ============================================================================
// VERIFIZIERUNG - Prüft sichtbare HN auf Duplikate
// ============================================================================
function verifyHouseNumbers() {
    log('Starte Verifizierung...', 'info');

    // Zoom-Level prüfen
    let currentZoom = 0;
    try {
        if (wmeSDK?.Map?.getZoomLevel) {
            currentZoom = wmeSDK.Map.getZoomLevel();
        } else if (W?.map?.getZoom) {
            currentZoom = W.map.getZoom();
        }
    } catch (e) {}

    console.log(`${SCRIPT_NAME}: Aktueller Zoom: ${currentZoom}`);

    if (currentZoom < 19) {
        log(`⚠️ Zoom ${currentZoom} - bitte auf 19+ zoomen!`, 'warning');
        alert(`⚠️ Zoom-Level zu niedrig!\n\nAktuell: Zoom ${currentZoom}\nBenötigt: Zoom 19 oder höher\n\nHausnummern werden erst ab Zoom 19 geladen.`);
        return;
    }

    const DUPLICATE_DISTANCE = 30; // Meter
    const duplicates = [];
    const allHN = new Map(); // number -> Array von {lat, lon, segmentId, streetName}

    try {
        let totalHN = 0;
        let withCoords = 0;

        // METHODE 1: HouseNumbers Layer aus WME Map
        // Die HN werden in einem separaten Layer gerendert, nicht in segment.attributes
        if (W?.map?.getLayerByUniqueName) {
            try {
                const hnLayer = W.map.getLayerByUniqueName('houseNumbers');
                if (hnLayer?.features) {
                    console.log(`${SCRIPT_NAME}: HN Layer gefunden mit ${hnLayer.features.length} Features`);

                    for (const feature of hnLayer.features) {
                        const attrs = feature?.attributes || {};
                        const number = attrs.number || attrs.houseNumber;
                        if (!number) continue;

                        totalHN++;
                        let lat = null, lon = null;

                        // Koordinaten aus Feature-Geometrie
                        if (feature.geometry) {
                            if (feature.geometry.x !== undefined && feature.geometry.y !== undefined) {
                                // Web Mercator zu WGS84
                                lon = feature.geometry.x * 180 / 20037508.34;
                                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(feature.geometry.y * Math.PI / 20037508.34)) - Math.PI / 2);
                            } else if (feature.geometry.coordinates) {
                                lon = feature.geometry.coordinates[0];
                                lat = feature.geometry.coordinates[1];
                            }
                        }

                        if (lat !== null && lon !== null) {
                            withCoords++;
                            const numStr = String(number).trim().toLowerCase();
                            if (!allHN.has(numStr)) allHN.set(numStr, []);
                            allHN.get(numStr).push({ lat, lon, segmentId: attrs.segID, number, streetName: null });
                        }
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: HN Layer Fehler:`, e);
            }
        }

        // METHODE 2: DOM-basiert - HN Labels auf der Karte finden
        if (withCoords === 0) {
            console.log(`${SCRIPT_NAME}: Versuche DOM-basierte HN-Erkennung...`);

            // HN werden als SVG Text oder div Elements gerendert
            const hnElements = document.querySelectorAll('.house-number, .house-number-marker, [class*="houseNumber"], text.house-number');
            console.log(`${SCRIPT_NAME}: ${hnElements.length} HN DOM-Elemente gefunden`);

            // Auch in SVG suchen
            const svgTexts = document.querySelectorAll('svg text');
            for (const text of svgTexts) {
                const content = text.textContent?.trim();
                // Prüfe ob es eine Hausnummer ist (Zahl, evtl. mit Buchstabe)
                if (content && /^\d+[a-zA-Z]?$/.test(content)) {
                    totalHN++;
                    // Position aus transform oder x/y Attributen
                    const transform = text.getAttribute('transform');
                    const bbox = text.getBBox?.();
                    // Ohne genaue Koordinaten können wir nur zählen
                }
            }
        }

        // METHODE 3: Aus den geladenen Segmenten die HN mit Positionen berechnen
        if (withCoords === 0) {
            console.log(`${SCRIPT_NAME}: Versuche Segment-basierte HN-Erkennung...`);
            const segments = W?.model?.segments?.getObjectArray() || [];

            for (const segment of segments) {
                if (!segment?.attributes) continue;

                const segId = segment.attributes.id;
                const houseNumbers = segment.attributes.houseNumbers || [];

                // Straßenname
                let streetName = null;
                const primaryStreetID = segment.attributes.primaryStreetID;
                if (primaryStreetID && W?.model?.streets) {
                    const street = W.model.streets.getObjectById(primaryStreetID);
                    streetName = street?.attributes?.name || null;
                }

                // Segment-Geometrie
                let geom = null;
                try {
                    if (typeof segment.getGeometry === 'function') geom = segment.getGeometry();
                    else if (segment.geometry) geom = segment.geometry;
                    else if (segment.attributes.geometry) geom = segment.attributes.geometry;
                } catch (e) {}

                for (const hn of houseNumbers) {
                    const number = hn?.number || hn?.houseNumber;
                    if (!number) continue;

                    totalHN++;
                    let lat = null, lon = null;

                    if (geom && hn.fraction !== undefined) {
                        const coords = calculatePointOnGeometry(geom, hn.fraction);
                        if (coords) { lon = coords.lon; lat = coords.lat; }
                    }

                    if (lat !== null && lon !== null) {
                        withCoords++;
                        const numStr = String(number).trim().toLowerCase();
                        if (!allHN.has(numStr)) allHN.set(numStr, []);
                        allHN.get(numStr).push({ lat, lon, segmentId: segId, number, streetName });
                    }
                }
            }
        }

        // METHODE 4: Aus dem Manager die Session-Imports prüfen
        if (withCoords === 0 && wmeManager.importedThisSession.size > 0) {
            console.log(`${SCRIPT_NAME}: Verwende Session-Tracking (${wmeManager.importedThisSession.size} Einträge)`);

            for (const [key, data] of wmeManager.importedThisSession.entries()) {
                totalHN++;
                if (data.lat && data.lon) {
                    withCoords++;
                    const numStr = String(data.number).trim().toLowerCase();
                    if (!allHN.has(numStr)) allHN.set(numStr, []);
                    allHN.get(numStr).push({
                        lat: data.lat,
                        lon: data.lon,
                        segmentId: data.segmentId,
                        number: data.number,
                        streetName: data.street
                    });
                }
            }
        }

        // METHODE 5: Globale Import-Map (alle Imports dieser Browser-Session)
        if (withCoords === 0 && globalImportedHN.size > 0) {
            console.log(`${SCRIPT_NAME}: Verwende globale Import-Map (${globalImportedHN.size} Einträge)`);

            for (const [key, data] of globalImportedHN.entries()) {
                totalHN++;
                if (data.lat && data.lon) {
                    withCoords++;
                    const numStr = String(data.number).trim().toLowerCase();
                    if (!allHN.has(numStr)) allHN.set(numStr, []);
                    allHN.get(numStr).push({
                        lat: data.lat,
                        lon: data.lon,
                        segmentId: data.segmentId,
                        number: data.number,
                        streetName: null
                    });
                }
            }
        }

        console.log(`${SCRIPT_NAME}: ${totalHN} HN gefunden, ${withCoords} mit Koordinaten`);
        log(`${withCoords} Hausnummern gescannt`, 'info');

        if (withCoords === 0) {
            log('⚠️ Keine HN mit Koordinaten gefunden!', 'warning');
            alert('⚠️ Keine Hausnummern zum Verifizieren gefunden!\n\nMögliche Ursachen:\n• Keine HN im sichtbaren Bereich\n• HN-Daten noch nicht geladen\n\nTipp: Führe erst einen Import durch, dann verifiziere.');
            return;
        }

        // Prüfe auf Duplikate (gleiche Nummer in der Nähe)
        for (const [numStr, positions] of allHN.entries()) {
            if (positions.length < 2) continue;

            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const dist = CoordUtils.distance(
                        positions[i].lat, positions[i].lon,
                        positions[j].lat, positions[j].lon
                    );

                    if (dist < DUPLICATE_DISTANCE) {
                        duplicates.push({
                            number: positions[i].number,
                            distance: dist,
                            streetName: positions[i].streetName || positions[j].streetName,
                            pos1: { lat: positions[i].lat, lon: positions[i].lon, segId: positions[i].segmentId },
                            pos2: { lat: positions[j].lat, lon: positions[j].lon, segId: positions[j].segmentId }
                        });
                    }
                }
            }
        }

        // Ergebnis anzeigen
        if (duplicates.length === 0) {
            log(`✅ Keine Duplikate gefunden! (${withCoords} HN geprüft)`, 'success');
            alert(`✅ Verifizierung abgeschlossen!\n\nKeine Duplikate gefunden.\n${withCoords} Hausnummern geprüft.`);
        } else {
            log(`⚠️ ${duplicates.length} Duplikate gefunden!`, 'warning');
            showVerificationReport(duplicates, withCoords);
        }

    } catch (e) {
        log(`Fehler bei Verifizierung: ${e.message}`, 'error');
        console.error(`${SCRIPT_NAME}: Verifizierung Fehler:`, e);
    }
}

// Punkt auf Geometrie bei gegebener Fraktion berechnen (für Verifizierung)
function calculatePointOnGeometry(geom, fraction) {
    if (!geom || fraction === undefined) return null;

    try {
        // Koordinaten extrahieren
        let coords = [];
        if (geom.coordinates && Array.isArray(geom.coordinates)) {
            coords = geom.coordinates;
        } else if (geom.getVertices) {
            coords = geom.getVertices().map(v => [v.x, v.y]);
        } else if (geom.components) {
            coords = geom.components.map(c => [c.x, c.y]);
        }

        if (coords.length < 2) return null;

        // Gesamtlänge berechnen
        let totalLength = 0;
        const segLengths = [];
        for (let i = 0; i < coords.length - 1; i++) {
            const len = Math.sqrt(
                Math.pow(coords[i+1][0] - coords[i][0], 2) +
                Math.pow(coords[i+1][1] - coords[i][1], 2)
            );
            segLengths.push(len);
            totalLength += len;
        }

        if (totalLength === 0) return null;

        // Position bei Fraktion finden
        const targetDist = fraction * totalLength;
        let accDist = 0;

        for (let i = 0; i < segLengths.length; i++) {
            if (accDist + segLengths[i] >= targetDist || i === segLengths.length - 1) {
                const t = segLengths[i] > 0 ? (targetDist - accDist) / segLengths[i] : 0;
                const clampedT = Math.max(0, Math.min(1, t));
                let x = coords[i][0] + clampedT * (coords[i+1][0] - coords[i][0]);
                let y = coords[i][1] + clampedT * (coords[i+1][1] - coords[i][1]);

                // Prüfe ob Web Mercator (große Zahlen) -> konvertieren zu WGS84
                if (Math.abs(x) > 180 || Math.abs(y) > 90) {
                    const lon = x * 180 / 20037508.34;
                    const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 20037508.34)) - Math.PI / 2);
                    return { lon, lat };
                }

                return { lon: x, lat: y };
            }
            accDist += segLengths[i];
        }

        return null;
    } catch (e) {
        console.error(`${SCRIPT_NAME}: calculatePointOnGeometry Fehler:`, e);
        return null;
    }
}

// Verifizierungs-Report anzeigen
function showVerificationReport(duplicates, totalHN) {
    const modal = document.getElementById('hn-report-modal');
    const content = document.getElementById('hn-report-content');
    if (!modal || !content) {
        alert(`⚠️ ${duplicates.length} Duplikate gefunden!\n\nDetails in der Konsole (F12).`);
        console.log(`${SCRIPT_NAME}: Duplikate:`, duplicates);
        return;
    }

    let html = `
        <div style="background:#fff3cd; padding:10px; border-radius:5px; margin-bottom:15px;">
            <strong>🔍 Verifizierungs-Ergebnis</strong><br>
            <span style="color:#856404;">⚠️ ${duplicates.length} mögliche Duplikate gefunden</span><br>
            <small>${totalHN} Hausnummern geprüft | Duplikat-Radius: 30m</small>
        </div>

        <div style="background:#ffebee; padding:10px; border-radius:5px; max-height:400px; overflow-y:auto;">
            <strong>Gefundene Duplikate:</strong><br><br>
    `;

    // Gruppiere nach Hausnummer
    const byNumber = new Map();
    for (const dup of duplicates) {
        const num = dup.number;
        if (!byNumber.has(num)) {
            byNumber.set(num, []);
        }
        byNumber.get(num).push(dup);
    }

    // Sortiere nach Hausnummer
    const sortedNumbers = [...byNumber.keys()].sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
    });

    for (const num of sortedNumbers) {
        const dups = byNumber.get(num);
        const streetName = dups[0]?.streetName || '';
        html += `<div style="margin-bottom:10px; padding:8px; background:white; border-radius:4px; border-left:3px solid #f44336;">`;
        html += `<strong style="color:#d32f2f;">HN ${num}</strong>`;
        if (streetName) html += ` <small style="color:#666;">(${streetName})</small>`;
        html += ` - ${dups.length}x doppelt<br>`;

        for (const dup of dups) {
            html += `<small style="color:#666;">`;
            html += `📍 ${dup.pos1.lat.toFixed(5)}, ${dup.pos1.lon.toFixed(5)} ↔ `;
            html += `${dup.pos2.lat.toFixed(5)}, ${dup.pos2.lon.toFixed(5)} `;
            html += `(${dup.distance.toFixed(1)}m)</small><br>`;
        }

        html += `</div>`;
    }

    html += `
        </div>
        <div style="margin-top:15px; padding:10px; background:#e3f2fd; border-radius:5px;">
            <strong>💡 Tipp:</strong> Zoome zu den Koordinaten und lösche die doppelten Hausnummern manuell.
        </div>
    `;

    content.innerHTML = html;
    modal.style.display = 'flex';
}

// Report anzeigen
function showReport() {
    const modal = document.getElementById('hn-report-modal');
    const content = document.getElementById('hn-report-content');
    if (!modal || !content) return;

    let html = '';

    // Zusammenfassung
    const duration = importReport.endTime && importReport.startTime ?
        Math.round((importReport.endTime - importReport.startTime) / 1000) : 0;

    const sourceDups = importReport.sourceDuplicatesRemoved || 0;

    html += `
        <div style="background:#e3f2fd; padding:10px; border-radius:5px; margin-bottom:15px;">
            <strong>📈 Zusammenfassung</strong><br>
            <span style="color:#4CAF50;">✓ ${importStats.successful} erfolgreich</span> |
            <span style="color:#FF9800;">⏭️ ${importStats.skipped} übersprungen</span> |
            <span style="color:#f44336;">✗ ${importStats.failed} Fehler</span><br>
            <small>Dauer: ${duration}s | Gesamt: ${importStats.total}${sourceDups > 0 ? ` | ${sourceDups} Quelldaten-Duplikate entfernt` : ''}</small>
        </div>
    `;

    // Nicht gefundene Straßen
    if (importReport.missingStreets.size > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#f44336;">📍 Straßen ohne Segment (${importReport.missingStreets.size})</strong>
                <div style="background:#ffebee; padding:8px; border-radius:4px; margin-top:5px; max-height:150px; overflow-y:auto;">
        `;

        // Sortiere nach Anzahl der Hausnummern (absteigend)
        const sortedStreets = [...importReport.missingStreets.entries()]
            .sort((a, b) => b[1].length - a[1].length);

        for (const [street, addresses] of sortedStreets) {
            const numbers = addresses.map(a => a.number).sort((a, b) => {
                const numA = parseInt(a) || 0;
                const numB = parseInt(b) || 0;
                return numA - numB;
            }).join(', ');

            html += `
                <div style="margin-bottom:5px; padding:4px; background:white; border-radius:3px;">
                    <strong>${street}</strong> <span style="color:#666;">(${addresses.length})</span><br>
                    <small style="color:#888;">Nr: ${numbers}</small>
                </div>
            `;
        }

        html += '</div></div>';
    }

    // Duplikate
    if (importReport.duplicates.length > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#FF9800;">🔄 Übersprungene Duplikate (${importReport.duplicates.length})</strong>
                <div style="background:#fff3e0; padding:8px; border-radius:4px; margin-top:5px; max-height:100px; overflow-y:auto;">
        `;

        // Gruppiere nach Straße
        const dupByStreet = new Map();
        for (const dup of importReport.duplicates) {
            const street = dup.street || 'Unbekannt';
            if (!dupByStreet.has(street)) dupByStreet.set(street, []);
            dupByStreet.get(street).push(dup.number);
        }

        for (const [street, numbers] of dupByStreet) {
            html += `<div><strong>${street}:</strong> ${numbers.join(', ')}</div>`;
        }

        html += '</div></div>';
    }

    // Erfolgreich importiert
    if (importReport.successful.length > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#4CAF50;">✓ Erfolgreich importiert (${importReport.successful.length})</strong>
                <div style="background:#e8f5e9; padding:8px; border-radius:4px; margin-top:5px; max-height:100px; overflow-y:auto;">
        `;

        // Gruppiere nach Straße
        const successByStreet = new Map();
        for (const item of importReport.successful) {
            const street = item.street || 'Unbekannt';
            if (!successByStreet.has(street)) successByStreet.set(street, []);
            successByStreet.get(street).push(item.number);
        }

        for (const [street, numbers] of successByStreet) {
            const sortedNumbers = numbers.sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
            html += `<div><strong>${street}:</strong> ${sortedNumbers.join(', ')}</div>`;
        }

        html += '</div></div>';
    }

    // Fehlgeschlagen
    if (importReport.failed.length > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#f44336;">✗ Fehlgeschlagen (${importReport.failed.length})</strong>
                <div style="background:#ffebee; padding:8px; border-radius:4px; margin-top:5px; max-height:100px; overflow-y:auto;">
        `;

        for (const item of importReport.failed.slice(0, 20)) {
            html += `<div><strong>${item.number}</strong> (${item.street}): ${item.reason}</div>`;
        }

        if (importReport.failed.length > 20) {
            html += `<div style="color:#666;">... und ${importReport.failed.length - 20} weitere</div>`;
        }

        html += '</div></div>';
    }

    // Zu weit entfernt
    if (importReport.tooFarAway.length > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#9C27B0;">📏 Zu weit entfernt (${importReport.tooFarAway.length})</strong>
                <div style="background:#f3e5f5; padding:8px; border-radius:4px; margin-top:5px; max-height:120px; overflow-y:auto;">
        `;

        // Sortiere nach Distanz (absteigend)
        const sorted = [...importReport.tooFarAway].sort((a, b) => (b.distance || 0) - (a.distance || 0));

        for (const item of sorted.slice(0, 15)) {
            html += `
                <div style="margin-bottom:3px; padding:3px; background:white; border-radius:2px; font-size:11px;">
                    <strong>${item.number}</strong> (${item.street}) - ${item.distance?.toFixed(0) || '?'}m entfernt
                    ${item.nearestStreet ? `<br><small style="color:#666;">Nächste Straße: ${item.nearestStreet}</small>` : ''}
                </div>
            `;
        }

        if (importReport.tooFarAway.length > 15) {
            html += `<div style="color:#666; font-size:10px;">... und ${importReport.tooFarAway.length - 15} weitere</div>`;
        }

        html += '</div></div>';
    }

    // Straßennamen-Mismatch (Warnung)
    if (importReport.streetMismatch.length > 0) {
        html += `
            <div style="margin-bottom:15px;">
                <strong style="color:#FF5722;">⚠️ Straßenname abweichend (${importReport.streetMismatch.length})</strong>
                <div style="background:#fbe9e7; padding:8px; border-radius:4px; margin-top:5px; max-height:120px; overflow-y:auto;">
                    <small style="color:#666; display:block; margin-bottom:5px;">Diese wurden trotzdem importiert, aber der Straßenname im WME weicht ab:</small>
        `;

        for (const item of importReport.streetMismatch.slice(0, 15)) {
            const similarity = item.similarity ? `${Math.round(item.similarity * 100)}%` : '?';
            html += `
                <div style="margin-bottom:3px; padding:3px; background:white; border-radius:2px; font-size:11px;">
                    <strong>${item.number}</strong>: "${item.requestedStreet}" → "${item.foundStreet}"
                    <span style="color:#999;">(${similarity} ähnlich, ${item.distance?.toFixed(0) || '?'}m)</span>
                </div>
            `;
        }

        if (importReport.streetMismatch.length > 15) {
            html += `<div style="color:#666; font-size:10px;">... und ${importReport.streetMismatch.length - 15} weitere</div>`;
        }

        html += '</div></div>';
    }

    // Falls alles leer
    if (importReport.missingStreets.size === 0 && importReport.duplicates.length === 0 &&
        importReport.successful.length === 0 && importReport.failed.length === 0 &&
        importReport.tooFarAway.length === 0 && importReport.streetMismatch.length === 0) {
        html = '<div style="text-align:center; padding:20px; color:#666;">Noch kein Import durchgeführt</div>';
    }

    content.innerHTML = html;
    modal.style.display = 'block';
}

// Report als CSV exportieren
function exportReportCSV() {
    let csv = 'Typ;Straße;Hausnummer;Lat;Lon;Distanz;WME-Straße;Grund\n';

    // Missing Streets
    for (const [street, addresses] of importReport.missingStreets) {
        for (const addr of addresses) {
            csv += `Kein Segment;${street};${addr.number};${addr.lat};${addr.lon};;; Straße nicht gefunden\n`;
        }
    }

    // Zu weit entfernt
    for (const item of importReport.tooFarAway) {
        csv += `Zu weit;${item.street};${item.number};${item.lat};${item.lon};${item.distance?.toFixed(0) || ''};${item.nearestStreet || ''};Über 100m entfernt\n`;
    }

    // Straßenname abweichend
    for (const item of importReport.streetMismatch) {
        csv += `Name abweichend;${item.requestedStreet};${item.number};${item.lat};${item.lon};${item.distance?.toFixed(0) || ''};${item.foundStreet};Importiert aber Name anders\n`;
    }

    // Duplikate
    for (const item of importReport.duplicates) {
        csv += `Duplikat;${item.street};${item.number};${item.lat};${item.lon};;;Bereits vorhanden\n`;
    }

    // Erfolgreich
    for (const item of importReport.successful) {
        const matchStatus = item.nameMatch ? 'OK' : 'Name abweichend';
        csv += `Erfolgreich;${item.street};${item.number};${item.lat};${item.lon};${item.distance?.toFixed(0) || ''};${item.segmentStreet || ''};Segment ${item.segmentId} (${matchStatus})\n`;
    }

    // Fehlgeschlagen
    for (const item of importReport.failed) {
        csv += `Fehler;${item.street};${item.number};${item.lat};${item.lon};;;${item.reason}\n`;
    }

    // Download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hausnummern-import-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    log('Report als CSV exportiert', 'success');
}

// Report in Zwischenablage kopieren
function copyReportToClipboard() {
    let text = '=== HAUSNUMMERN IMPORT REPORT ===\n\n';
    text += `Erfolgreich: ${importStats.successful}\n`;
    text += `Übersprungen: ${importStats.skipped}\n`;
    text += `Fehler: ${importStats.failed}\n\n`;

    if (importReport.missingStreets.size > 0) {
        text += '--- STRASSEN OHNE SEGMENT ---\n';
        for (const [street, addresses] of importReport.missingStreets) {
            const numbers = addresses.map(a => a.number).join(', ');
            text += `${street}: ${numbers}\n`;
        }
        text += '\n';
    }

    if (importReport.duplicates.length > 0) {
        text += '--- DUPLIKATE ---\n';
        const dupByStreet = new Map();
        for (const dup of importReport.duplicates) {
            const street = dup.street || 'Unbekannt';
            if (!dupByStreet.has(street)) dupByStreet.set(street, []);
            dupByStreet.get(street).push(dup.number);
        }
        for (const [street, numbers] of dupByStreet) {
            text += `${street}: ${numbers.join(', ')}\n`;
        }
        text += '\n';
    }

    navigator.clipboard.writeText(text).then(() => {
        log('Report in Zwischenablage kopiert', 'success');
    }).catch(() => {
        log('Kopieren fehlgeschlagen', 'error');
    });
}

// Daten abrufen
async function fetchData() {
    const sourceKey = document.getElementById('hn-source')?.value;
    if (!sourceKey || sourceKey === 'manual') {
        log('Bitte Datenquelle wählen', 'warning');
        return;
    }

    const bbox = CoordUtils.getCurrentBBox();
    if (!bbox) {
        log('Kartenposition nicht verfügbar - bitte Karte laden', 'error');
        return;
    }

    log(`Rufe Daten ab: ${sourceKey}...`, 'info');
    log(`Bereich: ${bbox.minLat.toFixed(4)},${bbox.minLon.toFixed(4)} - ${bbox.maxLat.toFixed(4)},${bbox.maxLon.toFixed(4)}`, 'info');

    try {
        let houseNumbers = [];

        if (sourceKey === 'osm') {
            houseNumbers = await dataFetcher.fetchOverpass(bbox);
        } else {
            const source = dataFetcher.getSource(sourceKey);
            if (source && source.enabled) {
                houseNumbers = await dataFetcher.fetchWFS(source, bbox);
            } else {
                log('Datenquelle nicht verfügbar', 'error');
                return;
            }
        }

        if (houseNumbers.length > 0) {
            loadedData = houseNumbers;
            showPreview(houseNumbers);
            log(`${houseNumbers.length} Hausnummern gefunden`, 'success');
            document.getElementById('btn-start-import').disabled = false;
        } else {
            log('Keine Hausnummern im Bereich gefunden', 'warning');
            // Fallback zu OSM anbieten
            if (sourceKey !== 'osm') {
                log('Versuche OpenStreetMap als Fallback...', 'info');
                houseNumbers = await dataFetcher.fetchOverpass(bbox);
                if (houseNumbers.length > 0) {
                    loadedData = houseNumbers;
                    showPreview(houseNumbers);
                    log(`${houseNumbers.length} Hausnummern via OSM gefunden`, 'success');
                    document.getElementById('btn-start-import').disabled = false;
                }
            }
        }
    } catch (error) {
        log(`Fehler: ${error.message}`, 'error');
    }
}

// Manuelle Daten parsen
function parseManualData() {
    const text = document.getElementById('hn-manual-data')?.value?.trim();
    if (!text) {
        log('Keine Daten eingegeben', 'warning');
        return;
    }

    try {
        let data;

        // JSON versuchen
        try {
            data = JSON.parse(text);
        } catch {
            // CSV parsen
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length < 2) throw new Error('Mindestens Header + 1 Zeile erforderlich');

            const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase());
            data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/[,;\t]/).map(v => v.trim());
                const obj = {};
                headers.forEach((h, idx) => obj[h] = values[idx]);
                data.push(obj);
            }
        }

        if (!Array.isArray(data)) data = [data];

        // Normalisieren und Hausnummern validieren/aufteilen
        const normalized = [];
        let skippedInvalid = 0;

        for (const item of data) {
            const rawNumber = String(item.number || item.hausnummer || item.hnr || '').trim();
            const street = String(item.street || item.strasse || 'Unbekannt').trim();
            const lon = parseFloat(item.lon || item.longitude || item.x);
            const lat = parseFloat(item.lat || item.latitude || item.y);

            if (isNaN(lon) || isNaN(lat)) continue;

            // Hausnummern aufteilen und validieren
            const validNumbers = dataFetcher.splitAndValidateHouseNumbers(rawNumber);

            if (validNumbers.length === 0) {
                skippedInvalid++;
                continue;
            }

            for (const num of validNumbers) {
                normalized.push({
                    number: num,
                    street: street,
                    lon: lon,
                    lat: lat,
                    source: 'Manuell'
                });
            }
        }

        if (normalized.length > 0) {
            loadedData = normalized;
            showPreview(normalized);
            log(`${normalized.length} Hausnummern geparst`, 'success');
            if (skippedInvalid > 0) {
                log(`${skippedInvalid} ungültige Hausnummern übersprungen`, 'warning');
            }
            document.getElementById('btn-start-import').disabled = false;
        } else {
            log('Keine gültigen Daten gefunden', 'error');
        }
    } catch (error) {
        log(`Parse-Fehler: ${error.message}`, 'error');
    }
}

// Vorschau anzeigen
function showPreview(data) {
    const info = document.getElementById('hn-preview-info');
    const table = document.getElementById('hn-preview-table');

    if (info) info.innerHTML = `<strong>${data.length}</strong> Hausnummern geladen`;

    if (table) {
        const preview = data.slice(0, 10);
        let html = '<table class="preview-table"><thead><tr><th>Nr</th><th>Straße</th><th>Koordinaten</th></tr></thead><tbody>';

        for (const item of preview) {
            html += `<tr><td>${item.number}</td><td>${item.street}</td><td>${item.lat.toFixed(4)}, ${item.lon.toFixed(4)}</td></tr>`;
        }

        html += '</tbody></table>';
        if (data.length > 10) html += `<div style="font-size:9px;color:#666;margin-top:3px;">... und ${data.length - 10} weitere</div>`;

        table.innerHTML = html;
    }
}

// ============================================================================
// AUTO-SCAN - Automatisch durch Bereich scrollen um HN zu laden
// ============================================================================
async function autoScanArea(bbox) {
    log('🔄 Auto-Scan: Lade Hausnummern im Bereich...', 'info');

    // Ursprüngliche Position und Zoom speichern
    let originalCenter = null;
    let originalZoom = 0;

    try {
        // Zoom über olMap holen (wie im Quick Zoom Script)
        if (W?.map?.olMap?.getZoom) {
            originalZoom = W.map.olMap.getZoom();
        } else if (wmeSDK?.Map?.getZoomLevel) {
            originalZoom = wmeSDK.Map.getZoomLevel();
        } else if (W?.map?.getZoom) {
            originalZoom = W.map.getZoom();
        }

        // Center holen
        if (W?.map?.getCenter) {
            const center = W.map.getCenter();
            if (center) {
                // Web Mercator zu WGS84
                originalCenter = {
                    lon: center.lon * 180 / 20037508.34,
                    lat: 180 / Math.PI * (2 * Math.atan(Math.exp(center.lat * Math.PI / 20037508.34)) - Math.PI / 2)
                };
            }
        } else if (wmeSDK?.Map?.getMapCenter) {
            originalCenter = wmeSDK.Map.getMapCenter();
        }
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Speichern der Position:`, e);
    }

    console.log(`${SCRIPT_NAME}: Original Position: ${originalCenter?.lat?.toFixed(5)}, ${originalCenter?.lon?.toFixed(5)} @ Zoom ${originalZoom}`);

    // Auf Zoom 19 wechseln (HN werden ab Zoom 19 geladen)
    const targetZoom = 19;
    const needsZoomChange = originalZoom !== targetZoom;

    try {
        // Erst zum Zentrum des BBox
        const centerLon = (bbox.minLon + bbox.maxLon) / 2;
        const centerLat = (bbox.minLat + bbox.maxLat) / 2;

        // WGS84 zu Web Mercator
        const mercX = centerLon * 20037508.34 / 180;
        const mercY = Math.log(Math.tan((90 + centerLat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

        // Center setzen
        if (W?.map?.setCenter) {
            W.map.setCenter({ lon: mercX, lat: mercY });
        }

        // Zoom über olMap setzen (wie im Quick Zoom Script)
        if (W?.map?.olMap?.zoomTo) {
            W.map.olMap.zoomTo(targetZoom);
            if (needsZoomChange) {
                log(`Zoom ${originalZoom} → ${targetZoom} für Scan`, 'info');
            }
        } else if (W?.map?.zoomTo) {
            W.map.zoomTo(targetZoom);
            if (needsZoomChange) {
                log(`Zoom ${originalZoom} → ${targetZoom} für Scan`, 'info');
            }
        }
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Zoom:`, e);
    }

    // Warte kurz bis Karte geladen
    await sleep(500);

    // Grid-Scan: Bereich in Kacheln aufteilen und durchscrollen
    // Bei Zoom 19 ist der sichtbare Bereich ca. 200m x 150m
    const tileSize = 0.0015; // ca. 150m in Grad
    const tilesX = Math.ceil((bbox.maxLon - bbox.minLon) / tileSize);
    const tilesY = Math.ceil((bbox.maxLat - bbox.minLat) / tileSize);
    const totalTiles = tilesX * tilesY;

    // Maximal 25 Tiles scannen (sonst zu lange)
    const maxTiles = 25;
    const skipFactor = totalTiles > maxTiles ? Math.ceil(totalTiles / maxTiles) : 1;

    log(`Scanne ${Math.min(totalTiles, maxTiles)} Positionen...`, 'info');
    console.log(`${SCRIPT_NAME}: Grid ${tilesX}x${tilesY} = ${totalTiles} Tiles, Skip: ${skipFactor}`);

    let scannedTiles = 0;
    let hnBefore = wmeManager.existingHouseNumbers.size;

    for (let y = 0; y < tilesY && scannedTiles < maxTiles; y++) {
        for (let x = 0; x < tilesX && scannedTiles < maxTiles; x++) {
            // Skip-Logik für große Bereiche
            if ((y * tilesX + x) % skipFactor !== 0) continue;

            const tileCenterLon = bbox.minLon + (x + 0.5) * tileSize;
            const tileCenterLat = bbox.minLat + (y + 0.5) * tileSize;

            try {
                // WGS84 zu Web Mercator
                const mercX = tileCenterLon * 20037508.34 / 180;
                const mercY = Math.log(Math.tan((90 + tileCenterLat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                if (W?.map?.setCenter) {
                    W.map.setCenter({ lon: mercX, lat: mercY });
                }

                // Kurz warten damit Daten laden
                await sleep(300);

                scannedTiles++;
            } catch (e) {
                // Ignorieren und weitermachen
            }
        }
    }

    // Existierende HN neu laden
    wmeManager.loadExistingHouseNumbers();
    const hnAfter = wmeManager.existingHouseNumbers.size;

    log(`✅ Scan fertig: ${hnAfter} HN geladen (+${hnAfter - hnBefore} neu)`, 'success');

    // Zurück zur ursprünglichen Position und Zoom
    if (originalCenter) {
        try {
            await sleep(200);

            const mercX = originalCenter.lon * 20037508.34 / 180;
            const mercY = Math.log(Math.tan((90 + originalCenter.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

            if (W?.map?.setCenter) {
                W.map.setCenter({ lon: mercX, lat: mercY });
            }

            // Zoom wiederherstellen über olMap (wie im Quick Zoom Script)
            if (originalZoom && originalZoom !== targetZoom) {
                if (W?.map?.olMap?.zoomTo) {
                    W.map.olMap.zoomTo(originalZoom);
                } else if (W?.map?.zoomTo) {
                    W.map.zoomTo(originalZoom);
                }
                log(`Zurück zu Zoom ${originalZoom}`, 'info');
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Zurücksetzen:`, e);
        }
    }

    return hnAfter;
}

// Hilfsfunktion: Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Import starten
async function startImport() {
    if (!loadedData || loadedData.length === 0) {
        log('Keine Daten zum Importieren', 'error');
        return;
    }

    // Original-Position und Zoom speichern (für Wiederherstellung NACH Import)
    let originalCenter = null;
    let originalZoom = 0;

    try {
        if (W?.map?.olMap?.getZoom) {
            originalZoom = W.map.olMap.getZoom();
        } else if (W?.map?.getZoom) {
            originalZoom = W.map.getZoom();
        }

        if (W?.map?.getCenter) {
            const center = W.map.getCenter();
            if (center) {
                originalCenter = {
                    lon: center.lon * 180 / 20037508.34,
                    lat: 180 / Math.PI * (2 * Math.atan(Math.exp(center.lat * Math.PI / 20037508.34)) - Math.PI / 2)
                };
            }
        }
    } catch (e) {}

    console.log(`${SCRIPT_NAME}: Original Zoom: ${originalZoom}`);

    // Auto-Scan Checkbox prüfen
    const autoScanEnabled = document.getElementById('hn-auto-scan')?.checked ?? true;

    // BBox aus den zu importierenden Daten berechnen
    let dataBBox = null;
    if (loadedData.length > 0) {
        dataBBox = {
            minLon: Math.min(...loadedData.map(d => d.lon)),
            maxLon: Math.max(...loadedData.map(d => d.lon)),
            minLat: Math.min(...loadedData.map(d => d.lat)),
            maxLat: Math.max(...loadedData.map(d => d.lat))
        };
    }

    // Bei Auto-Scan: Auf Zoom 19 wechseln und DORT BLEIBEN für den Import
    if (autoScanEnabled && dataBBox) {
        log('🔄 Wechsle auf Zoom 19 für Import...', 'info');
        document.getElementById('btn-start-import').disabled = true;

        try {
            // Auf Zoom 19 wechseln (HN werden nur bei Zoom 19+ geladen)
            const targetZoom = 19;

            // Zum Zentrum des Import-Bereichs
            const centerLon = (dataBBox.minLon + dataBBox.maxLon) / 2;
            const centerLat = (dataBBox.minLat + dataBBox.maxLat) / 2;
            const mercX = centerLon * 20037508.34 / 180;
            const mercY = Math.log(Math.tan((90 + centerLat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

            if (W?.map?.setCenter) {
                W.map.setCenter({ lon: mercX, lat: mercY });
            }

            if (W?.map?.olMap?.zoomTo) {
                W.map.olMap.zoomTo(targetZoom);
            } else if (W?.map?.zoomTo) {
                W.map.zoomTo(targetZoom);
            }

            log(`Zoom ${originalZoom} → ${targetZoom}`, 'info');

            // Wartezeit auf HN-Laden (konfigurierbar)
            const loadDelay = CONFIG.speed.initialLoadDelay;
            log(`⏳ Warte ${(loadDelay/1000).toFixed(1)}s auf HN-Laden...`, 'info');
            await sleep(loadDelay);

            // Existierende HN laden
            wmeManager.loadExistingHouseNumbers();
            log(`${wmeManager.existingHouseNumbers.size} existierende HN geladen`, 'info');

        } catch (e) {
            log(`Zoom-Fehler: ${e.message}`, 'warning');
            console.error(`${SCRIPT_NAME}: Zoom-Fehler:`, e);
        }
    } else if (originalZoom < 17) {
        log(`⚠️ Zoom-Level ${originalZoom} ist zu niedrig!`, 'warning');

        if (!confirm(`Zoom-Level ${originalZoom} ist niedrig und Auto-Scan ist deaktiviert.\n\nExistierende Hausnummern werden möglicherweise nicht erkannt.\n\nTrotzdem fortfahren?`)) {
            return;
        }
    }

    CONFIG.import.duplicateCheck = document.getElementById('hn-check-duplicates')?.checked ?? true;

    document.getElementById('btn-start-import').disabled = true;
    document.getElementById('btn-stop-import').disabled = false;

    log(`Import gestartet: ${loadedData.length} Hausnummern`, 'info');

    try {
        // Import durchführen (bei Zoom 19!)
        await importController.startImport(loadedData, {
            bbox: dataBBox,
            scrollDuringImport: autoScanEnabled
        });
    } catch (error) {
        log(`Import-Fehler: ${error.message}`, 'error');
    }

    // NACH dem Import: Zurück zum Original-Zoom
    if (autoScanEnabled && originalCenter && originalZoom && originalZoom !== 19) {
        try {
            await sleep(500);

            const mercX = originalCenter.lon * 20037508.34 / 180;
            const mercY = Math.log(Math.tan((90 + originalCenter.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

            if (W?.map?.setCenter) {
                W.map.setCenter({ lon: mercX, lat: mercY });
            }

            if (W?.map?.olMap?.zoomTo) {
                W.map.olMap.zoomTo(originalZoom);
            } else if (W?.map?.zoomTo) {
                W.map.zoomTo(originalZoom);
            }

            log(`Zurück zu Zoom ${originalZoom}`, 'info');
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Zurücksetzen:`, e);
        }
    }
}


// ============================================================================
// INITIALISIERUNG - Gemäß WME API Dokumentation
// ============================================================================
async function initializeScript() {
    console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION}: Initialisiere...`);

    // W global verfügbar machen
    W = unsafeWindow.W;

    // SDK initialisieren (falls verfügbar)
    try {
        if (unsafeWindow.SDK_INITIALIZED) {
            await unsafeWindow.SDK_INITIALIZED;

            if (unsafeWindow.getWmeSdk) {
                wmeSDK = unsafeWindow.getWmeSdk({
                    scriptId: SCRIPT_ID,
                    scriptName: SCRIPT_NAME
                });
                console.log(`${SCRIPT_NAME}: WME SDK initialisiert`);

                // Event-Listener für Hausnummern-Tracking registrieren
                try {
                    wmeSDK.Events.on({
                        eventName: 'wme-house-number-added',
                        eventHandler: (event) => {
                            // Tracke hinzugefügte HN in globalImportedHN
                            const hn = event?.detail || event;
                            if (hn?.number && hn?.point?.coordinates) {
                                const lon = hn.point.coordinates[0];
                                const lat = hn.point.coordinates[1];
                                const coordKey = `${String(hn.number).toLowerCase()}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
                                globalImportedHN.set(coordKey, {
                                    number: String(hn.number).toLowerCase(),
                                    lon, lat,
                                    segmentId: hn.segmentId
                                });
                                console.log(`${SCRIPT_NAME}: HN Event tracked: ${hn.number}`);
                            }
                        }
                    });
                    console.log(`${SCRIPT_NAME}: HN Event-Listener registriert`);
                } catch (evtErr) {
                    console.log(`${SCRIPT_NAME}: Event-Listener Fehler:`, evtErr);
                }

                // SaveErrorHandler initialisieren für Speicher-Fehler Tracking
                try {
                    SaveErrorHandler.init();
                } catch (saveErr) {
                    console.log(`${SCRIPT_NAME}: SaveErrorHandler Fehler:`, saveErr);
                }
            }
        }
    } catch (e) {
        console.log(`${SCRIPT_NAME}: SDK nicht verfügbar, verwende W.userscripts API`);
        // Auch ohne SDK den SaveErrorHandler mit Fallback initialisieren
        try {
            SaveErrorHandler.init();
        } catch (saveErr) {
            console.log(`${SCRIPT_NAME}: SaveErrorHandler Fallback Fehler:`, saveErr);
        }
    }

    // Sidebar Tab registrieren gemäß API Dokumentation
    try {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

        tabLabel.innerText = '🏠 HN';
        tabLabel.title = 'Amtliche Hausnummern Import';

        // Warte bis Element im DOM ist
        await W.userscripts.waitForElementConnected(tabPane);

        // UI erstellen
        createUI(tabPane);

        console.log(`${SCRIPT_NAME}: Sidebar Tab registriert`);
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Sidebar-Fehler:`, e);

        // Fallback: Versuche erneut nach kurzer Wartezeit
        setTimeout(() => {
            try {
                const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID + '-retry');
                tabLabel.innerText = '🏠 HN';
                tabLabel.title = 'Amtliche Hausnummern Import';

                tabPane.addEventListener('element-connected', () => {
                    createUI(tabPane);
                }, { once: true });
            } catch (retryError) {
                console.error(`${SCRIPT_NAME}: Sidebar Fallback fehlgeschlagen:`, retryError);
            }
        }, 2000);
    }

    // Registriere bei WME userscripts
    if (W.userscripts) {
        W.userscripts[SCRIPT_ID] = {
            name: SCRIPT_NAME,
            version: SCRIPT_VERSION,
            author: 'Hiwi234'
        };
    }

    console.log(`${SCRIPT_NAME}: Erfolgreich initialisiert`);
}

// Haupteinstiegspunkt gemäß WME API
function bootstrap() {
    // Prüfe ob WME bereit ist
    if (W?.userscripts?.state?.isReady) {
        initializeScript();
    } else if (W?.userscripts?.state?.isInitialized) {
        // WME initialisiert, aber noch nicht komplett bereit
        document.addEventListener('wme-ready', initializeScript, { once: true });
    } else {
        // Warte auf WME Initialisierung
        document.addEventListener('wme-initialized', () => {
            if (W?.userscripts?.state?.isReady) {
                initializeScript();
            } else {
                document.addEventListener('wme-ready', initializeScript, { once: true });
            }
        }, { once: true });
    }
}

// Debug-Funktion für Segmente
function debugSegments() {
    log('=== DEBUG HAUSNUMMERN ===', 'info');

    // Hausnummern aus verschiedenen Quellen zählen
    let sdkCount = 0;
    let modelCount = 0;
    let segmentHNCount = 0;
    let segmentHNModelCount = 0;
    let withCoords = 0;

    // WICHTIG: W.model.segmentHouseNumbers (Hauptquelle!)
    if (W?.model?.segmentHouseNumbers) {
        try {
            const segHNArray = W.model.segmentHouseNumbers.getObjectArray ?
                W.model.segmentHouseNumbers.getObjectArray() :
                Object.values(W.model.segmentHouseNumbers.objects || {});
            segmentHNModelCount = segHNArray.length;

            if (segHNArray.length > 0) {
                const sample = segHNArray[0];
                const attrs = sample?.attributes || sample;
                log(`segmentHouseNumbers Sample: number=${attrs?.number}, segID=${attrs?.segID}`, 'info');
                log(`segmentHouseNumbers Keys: ${Object.keys(attrs || {}).join(', ')}`, 'info');

                // Teste moderne Suche
                if (W.model.segmentHouseNumbers.objects && attrs?.segID && attrs?.number) {
                    let found = 0;
                    for (const hn of Object.values(W.model.segmentHouseNumbers.objects)) {
                        const hnAttrs = hn?.attributes || hn;
                        if (String(hnAttrs?.segID) === String(attrs.segID) &&
                            String(hnAttrs?.number) === String(attrs.number)) {
                            found++;
                        }
                    }
                    log(`Moderne Suche Test: ${found} gefunden`, 'info');
                }
            }
        } catch (e) {
            log(`segmentHouseNumbers Fehler: ${e.message}`, 'error');
        }
    }
    log(`W.model.segmentHouseNumbers: ${segmentHNModelCount}`, 'info');

    // SDK HouseNumbers
    if (wmeSDK?.DataModel?.HouseNumbers?.getAll) {
        try {
            const allHN = wmeSDK.DataModel.HouseNumbers.getAll();
            sdkCount = allHN?.length || 0;
            if (allHN && allHN.length > 0) {
                const sample = allHN[0];
                log(`SDK Sample Keys: ${Object.keys(sample || {}).join(', ')}`, 'info');
                log(`SDK Sample: number=${sample?.number}, segmentId=${sample?.segmentId}`, 'info');
                if (sample?.geometry) {
                    log(`SDK Geometry: ${JSON.stringify(sample.geometry).slice(0, 100)}`, 'info');
                }
                if (sample?.point) {
                    log(`SDK Point: ${JSON.stringify(sample.point).slice(0, 100)}`, 'info');
                }
            }
        } catch (e) {
            log(`SDK getAll Fehler: ${e.message}`, 'error');
        }
    }
    log(`SDK HouseNumbers.getAll(): ${sdkCount}`, 'info');

    // W.model.houseNumbers - DETAILLIERT
    if (W?.model?.houseNumbers) {
        try {
            const hnArray = W.model.houseNumbers.getObjectArray ?
                W.model.houseNumbers.getObjectArray() :
                Object.values(W.model.houseNumbers.objects || {});
            modelCount = hnArray.length;

            if (hnArray.length > 0) {
                const sample = hnArray[0];
                const attrs = sample?.attributes || sample;

                log(`Model Sample Obj Keys: ${Object.keys(sample || {}).slice(0, 15).join(', ')}`, 'info');
                log(`Model Sample Attr Keys: ${Object.keys(attrs || {}).join(', ')}`, 'info');
                log(`Model Sample: number=${attrs?.number}, segID=${attrs?.segID}`, 'info');

                // Geometrie suchen
                if (attrs?.geometry) {
                    log(`Attr.geometry: ${JSON.stringify(attrs.geometry).slice(0, 150)}`, 'info');
                    withCoords++;
                }
                if (attrs?.geoJSONGeometry) {
                    log(`Attr.geoJSONGeometry: ${JSON.stringify(attrs.geoJSONGeometry).slice(0, 150)}`, 'info');
                    withCoords++;
                }
                if (sample?.geometry) {
                    log(`Obj.geometry: ${JSON.stringify(sample.geometry).slice(0, 150)}`, 'info');
                    withCoords++;
                }
                if (typeof sample?.getGeometry === 'function') {
                    try {
                        const geom = sample.getGeometry();
                        log(`getGeometry(): ${JSON.stringify(geom).slice(0, 150)}`, 'info');
                        withCoords++;
                    } catch (e) {
                        log(`getGeometry() Fehler: ${e.message}`, 'error');
                    }
                }

                // Alle Attribute ausgeben
                log(`Alle Attrs: ${JSON.stringify(attrs).slice(0, 300)}`, 'info');
            }
        } catch (e) {
            log(`Model Fehler: ${e.message}`, 'error');
        }
    }
    log(`W.model.houseNumbers: ${modelCount} (${withCoords} mit Geometrie-Info)`, 'info');

    // Geladene HN im Manager
    log(`Manager existingHouseNumbers: ${wmeManager.existingHouseNumbers.size}`, 'info');
    log(`Manager existingByCoords: ${wmeManager.existingByCoords.size}`, 'info');

    // Segmente mit HN
    if (W?.model?.segments) {
        const segments = W.model.segments.getObjectArray();
        for (const seg of segments) {
            if (seg?.attributes?.houseNumbers?.length > 0) {
                segmentHNCount += seg.attributes.houseNumbers.length;
                // Sample HN aus Segment
                if (segmentHNCount <= 3) {
                    const hn = seg.attributes.houseNumbers[0];
                    log(`Segment HN Sample: ${JSON.stringify(hn).slice(0, 200)}`, 'info');
                }
            }
        }
    }
    log(`Segment.attributes.houseNumbers: ${segmentHNCount}`, 'info');

    log('=== DEBUG SEGMENTE ===', 'info');

    if (!W?.model?.segments) {
        log('W.model.segments nicht verfügbar!', 'error');
        return;
    }

    const segments = W.model.segments.getObjectArray();
    log(`Gesamte Segmente: ${segments.length}`, 'info');

    // Zähle nach Typ
    const typeCounts = {};
    let withGeometry = 0;
    let sampleSegment = null;

    for (const seg of segments) {
        if (!seg?.attributes) continue;

        const rt = seg.attributes.roadType;
        typeCounts[rt] = (typeCounts[rt] || 0) + 1;

        // Prüfe Geometrie
        try {
            let geom = null;
            if (typeof seg.getGeometry === 'function') {
                geom = seg.getGeometry();
            } else if (seg.geometry) {
                geom = seg.geometry;
            }
            if (geom) {
                withGeometry++;
                if (!sampleSegment && [1,2,3,4,5,6,7].includes(rt)) {
                    sampleSegment = seg;
                }
            }
        } catch (e) {}
    }

    log(`Mit Geometrie: ${withGeometry}`, 'info');
    log(`Typen: ${JSON.stringify(typeCounts)}`, 'info');

    // Sample Segment analysieren
    if (sampleSegment) {
        log(`Sample Segment ID: ${sampleSegment.attributes.id}`, 'info');
        try {
            const geom = sampleSegment.getGeometry ? sampleSegment.getGeometry() : sampleSegment.geometry;
            if (geom) {
                // Verschiedene Methoden für Vertices versuchen
                let verts = [];
                if (geom.getVertices) verts = geom.getVertices();
                if (verts.length === 0 && geom.components) verts = geom.components;
                if (verts.length === 0 && geom.coordinates) verts = geom.coordinates;

                log(`Vertices (getVertices): ${geom.getVertices ? geom.getVertices().length : 'N/A'}`, 'info');
                log(`Components: ${geom.components ? geom.components.length : 'N/A'}`, 'info');
                log(`Coordinates: ${geom.coordinates ? geom.coordinates.length : 'N/A'}`, 'info');

                // Geometrie-Typ und Struktur
                log(`Geom Type: ${geom.type || geom.CLASS_NAME || 'unbekannt'}`, 'info');
                log(`Geom Keys: ${Object.keys(geom).slice(0, 10).join(', ')}`, 'info');

                // GeoJSON Geometrie aus attributes?
                if (sampleSegment.attributes.geometry) {
                    const attrGeom = sampleSegment.attributes.geometry;
                    log(`Attr.geometry Type: ${attrGeom.type}`, 'info');
                    if (attrGeom.coordinates) {
                        log(`Attr.geometry Coords: ${attrGeom.coordinates.length} Punkte`, 'info');
                        if (attrGeom.coordinates.length > 0) {
                            const c = attrGeom.coordinates[0];
                            log(`Erster Punkt: [${c[0]?.toFixed(5)}, ${c[1]?.toFixed(5)}]`, 'info');
                        }
                    }
                }
            }
        } catch (e) {
            log(`Geometrie-Fehler: ${e.message}`, 'error');
        }
    }

    // Prüfe SDK
    log('=== SDK & ACTIONS ===', 'info');
    log(`wmeSDK: ${wmeSDK ? 'vorhanden' : 'nicht vorhanden'}`, wmeSDK ? 'success' : 'error');
    if (wmeSDK) {
        log(`wmeSDK.DataModel: ${wmeSDK.DataModel ? 'vorhanden' : 'fehlt'}`, 'info');
        log(`wmeSDK.DataModel.HouseNumbers: ${wmeSDK.DataModel?.HouseNumbers ? 'vorhanden' : 'fehlt'}`, 'info');
        if (wmeSDK.DataModel?.HouseNumbers) {
            log(`addHouseNumber: ${typeof wmeSDK.DataModel.HouseNumbers.addHouseNumber}`, 'info');
            log(`getAll: ${typeof wmeSDK.DataModel.HouseNumbers.getAll}`, 'info');

            // Teste getAll
            if (wmeSDK.DataModel.HouseNumbers.getAll) {
                try {
                    const allHN = wmeSDK.DataModel.HouseNumbers.getAll();
                    log(`Existierende HN (SDK): ${allHN?.length || 0}`, 'info');
                } catch (e) {
                    log(`getAll Fehler: ${e.message}`, 'error');
                }
            }
        }
    }

    // Prüfe W.model.houseNumbers
    if (W?.model?.houseNumbers) {
        const hnCount = W.model.houseNumbers.getObjectArray ?
            W.model.houseNumbers.getObjectArray().length :
            Object.keys(W.model.houseNumbers.objects || {}).length;
        log(`W.model.houseNumbers: ${hnCount} Einträge`, 'info');
    } else {
        log('W.model.houseNumbers: nicht verfügbar', 'warning');
    }

    // Prüfe Action-Klassen
    if (W?.Action) {
        const actions = Object.keys(W.Action).filter(k => k.toLowerCase().includes('house'));
        log(`W.Action HouseNumber: ${actions.join(', ') || 'keine gefunden'}`, actions.length ? 'success' : 'warning');
    } else {
        log('W.Action nicht verfügbar', 'error');
    }

    // Versuche require aus Page-Kontext
    const pageRequire = unsafeWindow?.require || W?.require;
    log(`Page require: ${pageRequire ? 'verfügbar' : 'nicht verfügbar'}`, pageRequire ? 'success' : 'warning');

    if (pageRequire) {
        try {
            const AddHN = pageRequire('Waze/Action/AddHouseNumber');
            log(`require('Waze/Action/AddHouseNumber'): ${AddHN ? 'OK' : 'null'}`, AddHN ? 'success' : 'error');
        } catch (e) {
            log(`require Fehler: ${e.message}`, 'error');
        }
    }

    // Prüfe OpenLayers
    const OL = unsafeWindow?.OpenLayers || OpenLayers;
    log(`OpenLayers: ${OL ? 'verfügbar' : 'nicht verfügbar'}`, OL ? 'success' : 'error');

    // ===== NEUE DEBUG: Alle Layer auflisten =====
    log('=== LAYER ANALYSE ===', 'info');
    if (W?.map?.olMap?.layers) {
        const layers = W.map.olMap.layers;
        log(`Anzahl Layer: ${layers.length}`, 'info');
        for (const layer of layers) {
            const name = layer?.name || layer?.id || 'unbekannt';
            const featureCount = layer?.features?.length || 0;
            const visibility = layer?.visibility ? 'sichtbar' : 'versteckt';
            if (featureCount > 0 || name.toLowerCase().includes('house') || name.toLowerCase().includes('label')) {
                log(`Layer: ${name} (${featureCount} Features, ${visibility})`, 'info');

                // Sample Feature
                if (layer.features && layer.features.length > 0) {
                    const sample = layer.features[0];
                    const attrs = sample?.attributes || sample?.data || {};
                    log(`  Sample Attrs: ${JSON.stringify(attrs).slice(0, 150)}`, 'info');
                }
            }
        }
    }

    // ===== NEUE DEBUG: DOM-Elemente scannen =====
    log('=== DOM SCAN ===', 'info');
    const mapContainer = document.getElementById('map') || document.querySelector('.olMap');
    if (mapContainer) {
        // SVG Text-Elemente
        const svgTexts = mapContainer.querySelectorAll('svg text, svg tspan');
        let hnTexts = 0;
        for (const el of svgTexts) {
            const text = el.textContent?.trim();
            if (text && /^\d+[a-zA-Z]?$/.test(text)) {
                hnTexts++;
                if (hnTexts <= 3) {
                    log(`  SVG HN: "${text}"`, 'info');
                }
            }
        }
        log(`SVG Text-Elemente (HN-Format): ${hnTexts}`, 'info');

        // HN-spezifische Klassen
        const hnClasses = mapContainer.querySelectorAll('[class*="house"], [class*="hn-"], [class*="number"]');
        log(`Elemente mit house/hn/number Klasse: ${hnClasses.length}`, 'info');
        if (hnClasses.length > 0 && hnClasses.length <= 5) {
            for (const el of hnClasses) {
                log(`  Klasse: ${el.className}, Text: ${el.textContent?.slice(0, 30)}`, 'info');
            }
        }
    }

    log('=== DEBUG ENDE ===', 'info');
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}

// Globale API für Debugging
unsafeWindow.WMEOfficialHNImport = {
    version: SCRIPT_VERSION,
    getStats: () => importStats,
    getData: () => loadedData,
    isRunning: () => importController.isRunning,
    getBBox: () => CoordUtils.getCurrentBBox(),
    getCenter: () => CoordUtils.getMapCenter()
};

})();
