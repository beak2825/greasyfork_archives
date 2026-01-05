// ==UserScript==
// @name         WME Amtliche Hausnummern Import
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      4.3.3
// @description  Massenimport von Hausnummern aus amtlichen Quellen (ALKIS, OpenData, WFS) - ALLE 16 Bundesländer + AT + CH
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
        parallelImports: 5,  // 5 HN gleichzeitig importieren
        maxHouseNumbers: 500,
        duplicateCheck: true,
        maxSegmentDistance: 50,
        duplicateRadius: 20,  // Meter - HN mit gleicher Nummer innerhalb dieses Radius = Duplikat
        autoPauseAfter: 50,   // Auto-Pause nach X importierten HN (0 = deaktiviert)
        autoPauseEnabled: true // Auto-Pause aktiviert
    },
    search: {
        defaultRadius: 500,
        maxRadius: 2000
    }
};

// ============================================================================
// GLOBALE VARIABLEN
// ============================================================================
let wmeSDK = null;
let W = null;
let isImporting = false;
let loadedData = [];
let importStats = { total: 0, processed: 0, successful: 0, failed: 0, skipped: 0, errors: [] };

// WICHTIG: Globales Tracking aller importierten HN in dieser Session
// Key: "nummer_lat_lon" (gerundet auf 4 Dezimalstellen)
const globalImportedHN = new Map();

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

const rateLimiter = new RateLimiter(CONFIG.rateLimiting.maxRequestsPerSecond, CONFIG.rateLimiting.maxConcurrentRequests);

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
        
        let loadedCount = 0;
        let coordsCount = 0;
        
        // Helper zum Hinzufügen MIT Koordinaten
        const addHN = (number, segId, lon = null, lat = null) => {
            if (!number || segId === null || segId === undefined) return;
            const numStr = String(number).trim().toLowerCase();
            const segIdStr = String(segId);
            const key = `${numStr}_${segIdStr}`;
            if (!this.existingHouseNumbers.has(key)) {
                this.existingHouseNumbers.set(key, true);
                loadedCount++;
                
                // Koordinaten speichern für Distanz-Prüfung
                if (lon !== null && lat !== null && !isNaN(lon) && !isNaN(lat)) {
                    const coordKey = `${numStr}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
                    this.existingByCoords.set(coordKey, { number: numStr, lon, lat, segmentId: segIdStr });
                    coordsCount++;
                }
            }
        };
        
        // Helper: Koordinaten aus HN-Objekt extrahieren (VERBESSERT)
        const getHNCoords = (hn, segment = null) => {
            if (!hn) return { lon: null, lat: null };
            
            let lon = null, lat = null;
            const attrs = hn.attributes || hn;
            
            // METHODE A: geometry.coordinates (GeoJSON) - SDK Format
            if (hn.geometry?.coordinates?.length >= 2) {
                lon = hn.geometry.coordinates[0];
                lat = hn.geometry.coordinates[1];
            }
            // METHODE B: point.coordinates
            else if (hn.point?.coordinates?.length >= 2) {
                lon = hn.point.coordinates[0];
                lat = hn.point.coordinates[1];
            }
            // METHODE C: Direkte Koordinaten
            else if (typeof hn.lon === 'number' && typeof hn.lat === 'number') {
                lon = hn.lon;
                lat = hn.lat;
            }
            // METHODE D: attributes.geometry
            else if (attrs?.geometry?.coordinates?.length >= 2) {
                lon = attrs.geometry.coordinates[0];
                lat = attrs.geometry.coordinates[1];
            }
            // METHODE E: fractionPoint (Web Mercator) - WME internes Format
            else if (attrs?.fractionPoint) {
                const fp = attrs.fractionPoint;
                if (typeof fp.x === 'number' && typeof fp.y === 'number') {
                    // Web Mercator zu WGS84 konvertieren
                    lon = fp.x * 180 / 20037508.34;
                    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(fp.y * Math.PI / 20037508.34)) - Math.PI / 2);
                }
            }
            // METHODE F: Berechne Position aus Segment + fraction
            else if (segment && attrs?.fraction !== undefined) {
                const coords = this.getPointOnSegment(segment, attrs.fraction);
                if (coords) {
                    lon = coords.lon;
                    lat = coords.lat;
                }
            }
            
            return { lon, lat };
        };
        
        try {
            // METHODE 1: W.model.houseNumbers - Hauptquelle
            if (W?.model?.houseNumbers) {
                const hnObjects = W.model.houseNumbers.objects || {};
                const segments = W.model.segments?.objects || {};
                
                for (const id in hnObjects) {
                    const hn = hnObjects[id];
                    const attrs = hn?.attributes || hn;
                    const number = attrs?.number || attrs?.houseNumber;
                    const segId = attrs?.segID || attrs?.segmentId;
                    
                    // Segment für Koordinaten-Berechnung holen
                    const segment = segId ? segments[segId] : null;
                    const coords = getHNCoords(hn, segment);
                    
                    addHN(number, segId, coords.lon, coords.lat);
                }
                console.log(`${SCRIPT_NAME}: W.model.houseNumbers: ${Object.keys(hnObjects).length} HN`);
            }

            // METHODE 2: SDK getAll
            if (wmeSDK?.DataModel?.HouseNumbers?.getAll) {
                try {
                    const allHN = wmeSDK.DataModel.HouseNumbers.getAll();
                    if (allHN && Array.isArray(allHN)) {
                        for (const hn of allHN) {
                            const coords = getHNCoords(hn);
                            addHN(hn?.number, hn?.segmentId, coords.lon, coords.lat);
                        }
                        console.log(`${SCRIPT_NAME}: SDK getAll: ${allHN.length} HN`);
                    }
                } catch (e) {
                    // Ignorieren
                }
            }

            // METHODE 3: Segment.attributes.houseNumbers mit Koordinaten-Berechnung
            if (W?.model?.segments) {
                const segments = W.model.segments.getObjectArray();
                let segHNCount = 0;
                
                for (const seg of segments) {
                    if (!seg?.attributes) continue;
                    const segId = seg.attributes.id;
                    const houseNumbers = seg.attributes.houseNumbers || [];
                    
                    for (const hn of houseNumbers) {
                        const number = hn?.number || hn?.houseNumber;
                        const coords = getHNCoords(hn, seg);
                        addHN(number, segId, coords.lon, coords.lat);
                        segHNCount++;
                    }
                }
                console.log(`${SCRIPT_NAME}: Segment.houseNumbers: ${segHNCount} HN`);
            }

        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Laden existierender HN:`, e);
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
    
    // Punkt auf Segment bei gegebener Fraktion berechnen
    getPointOnSegment(segment, fraction) {
        if (!segment || fraction === undefined) return null;
        
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
            
            // Koordinaten extrahieren
            let coords = [];
            if (geom.coordinates) {
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
            
            // Position bei Fraktion finden
            const targetDist = fraction * totalLength;
            let accDist = 0;
            
            for (let i = 0; i < segLengths.length; i++) {
                if (accDist + segLengths[i] >= targetDist) {
                    const t = (targetDist - accDist) / segLengths[i];
                    let x = coords[i][0] + t * (coords[i+1][0] - coords[i][0]);
                    let y = coords[i][1] + t * (coords[i+1][1] - coords[i][1]);
                    
                    // Prüfe ob Web Mercator (große Zahlen) -> konvertieren
                    if (Math.abs(x) > 180 || Math.abs(y) > 90) {
                        const lon = x * 180 / 20037508.34;
                        const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 20037508.34)) - Math.PI / 2);
                        return { lon, lat };
                    }
                    
                    return { lon: x, lat: y };
                }
                accDist += segLengths[i];
            }
            
            // Fallback: Letzter Punkt
            const last = coords[coords.length - 1];
            if (Math.abs(last[0]) > 180) {
                return {
                    lon: last[0] * 180 / 20037508.34,
                    lat: 180 / Math.PI * (2 * Math.atan(Math.exp(last[1] * Math.PI / 20037508.34)) - Math.PI / 2)
                };
            }
            return { lon: last[0], lat: last[1] };
            
        } catch (e) {
            return null;
        }
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
        const junctionRadius = 25; // Meter - Radius in dem Kreuzungs-Logik greift
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
        
        // ===== KREUZUNGS-LOGIK =====
        // Wenn mehrere Segmente sehr nah beieinander sind (Kreuzung), 
        // bevorzuge das mit passendem Straßennamen
        if (streetName && candidates.length > 1) {
            // Finde alle Segmente innerhalb des Kreuzungs-Radius vom nächsten
            const nearbySegments = candidates.filter(c => 
                c.distance <= nearest.distance + junctionRadius
            );
            
            if (nearbySegments.length > 1) {
                // Mehrere Segmente in der Nähe = wahrscheinlich Kreuzung
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
                // Toleranz: Segment mit passendem Namen darf bis zu 30m weiter weg sein
                const nameTolerance = 30;
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

    // Prüfen ob Hausnummer bereits existiert (VEREINFACHT UND ROBUSTER)
    isDuplicate(number, segmentId, lon = null, lat = null) {
        if (!CONFIG.import.duplicateCheck) return false;
        
        const numberStr = String(number).trim().toLowerCase();
        const segIdStr = String(segmentId);
        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20; // Meter
        
        // ===== METHODE 0: GLOBALE SESSION-MAP (WICHTIGSTE!) =====
        // Prüft gegen ALLE in dieser Browser-Session importierten HN
        if (lon !== null && lat !== null) {
            for (const [key, data] of globalImportedHN.entries()) {
                if (!data || data.lon === undefined || data.lat === undefined) continue;
                
                const existingNumber = String(data.number || '').toLowerCase();
                if (existingNumber !== numberStr) continue;
                
                const dist = CoordUtils.distance(lat, lon, data.lat, data.lon);
                if (dist < DUPLICATE_DISTANCE) {
                    console.log(`${SCRIPT_NAME}: Duplikat via globalImportedHN: ${numberStr} (${dist.toFixed(1)}m)`);
                    return true;
                }
            }
        }
        
        // ===== METHODE 1: Session-Tracking (Manager-Level) =====
        if (lon !== null && lat !== null) {
            for (const [existingKey, coords] of this.importedThisSession.entries()) {
                if (!coords || coords.lon === undefined || coords.lat === undefined) continue;
                
                const existingNumber = coords.number || existingKey.split('_')[0];
                if (existingNumber !== numberStr) continue;
                
                const dist = CoordUtils.distance(lat, lon, coords.lat, coords.lon);
                if (dist < DUPLICATE_DISTANCE) {
                    return true;
                }
            }
        }
        
        // ===== METHODE 2: Key-basierte Prüfung (Nummer + Segment) =====
        const key = `${numberStr}_${segIdStr}`;
        if (this.existingHouseNumbers.has(key)) {
            return true;
        }
        
        // ===== METHODE 2.5: W.model.segmentHouseNumbers.getByAttributes (WICHTIG!) =====
        // Dies ist die Hauptmethode, die WME selbst verwendet
        try {
            if (W?.model?.segmentHouseNumbers?.getByAttributes) {
                const existingHN = W.model.segmentHouseNumbers.getByAttributes({
                    segID: parseInt(segIdStr),
                    number: number  // Original-Nummer (nicht lowercase)
                });
                if (existingHN && existingHN.length > 0) {
                    console.log(`${SCRIPT_NAME}: Duplikat via segmentHouseNumbers.getByAttributes: ${number} auf Segment ${segIdStr}`);
                    return true;
                }
            }
        } catch (e) {
            // Ignorieren
        }
        
        // ===== METHODE 3: Prüfe gegen existierende HN mit Koordinaten =====
        if (lon !== null && lat !== null && this.existingByCoords.size > 0) {
            for (const [existingKey, coords] of this.existingByCoords.entries()) {
                if (!coords || coords.lon === undefined || coords.lat === undefined) continue;
                
                const existingNumber = coords.number || existingKey.split('_')[0];
                if (existingNumber !== numberStr) continue;
                
                const dist = CoordUtils.distance(lat, lon, coords.lat, coords.lon);
                if (dist < DUPLICATE_DISTANCE) {
                    return true;
                }
            }
        }
        
        // ===== METHODE 4: Live-Prüfung ALLER HN im Model =====
        if (lon !== null && lat !== null) {
            try {
                const hnObjects = W?.model?.houseNumbers?.objects || {};
                const segments = W?.model?.segments?.objects || {};
                
                for (const id in hnObjects) {
                    const hn = hnObjects[id];
                    const attrs = hn?.attributes || hn;
                    const existingNum = String(attrs?.number || attrs?.houseNumber || '').trim().toLowerCase();
                    
                    if (existingNum !== numberStr) continue;
                    
                    let existingLon = null, existingLat = null;
                    
                    if (attrs?.fractionPoint?.x !== undefined) {
                        existingLon = attrs.fractionPoint.x * 180 / 20037508.34;
                        existingLat = 180 / Math.PI * (2 * Math.atan(Math.exp(attrs.fractionPoint.y * Math.PI / 20037508.34)) - Math.PI / 2);
                    } else if (attrs?.fraction !== undefined && attrs?.segID && segments[attrs.segID]) {
                        const coords = this.getPointOnSegment(segments[attrs.segID], attrs.fraction);
                        if (coords) {
                            existingLon = coords.lon;
                            existingLat = coords.lat;
                        }
                    }
                    
                    if (existingLon !== null && existingLat !== null) {
                        const dist = CoordUtils.distance(lat, lon, existingLat, existingLon);
                        if (dist < DUPLICATE_DISTANCE) {
                            return true;
                        }
                    }
                }
            } catch (e) {
                // Ignorieren
            }
        }
        
        // ===== METHODE 5: Live-Prüfung über SDK =====
        try {
            if (wmeSDK?.DataModel?.HouseNumbers?.getBySegmentId) {
                const segmentHN = wmeSDK.DataModel.HouseNumbers.getBySegmentId(segmentId);
                if (segmentHN && Array.isArray(segmentHN)) {
                    for (const hn of segmentHN) {
                        if (String(hn?.number || '').trim().toLowerCase() === numberStr) {
                            this.existingHouseNumbers.set(key, true);
                            return true;
                        }
                    }
                }
            }
        } catch (e) {
            // Ignorieren
        }
        
        // ===== METHODE 6: Prüfe pending Actions =====
        try {
            if (W?.model?.actionManager) {
                const actions = W.model.actionManager.getActions();
                for (const action of actions) {
                    if (action?.houseNumber || action?.object?.type === 'houseNumber') {
                        const actionHN = action.houseNumber || action.object;
                        const actionNum = String(actionHN?.number || actionHN?.attributes?.number || '').trim().toLowerCase();
                        
                        // Prüfe nach Nummer (nicht nur Segment, da HN auf verschiedenen Segmenten sein können)
                        if (actionNum === numberStr) {
                            // Prüfe Koordinaten wenn verfügbar
                            const actionCoords = actionHN?.geometry?.coordinates || actionHN?.point?.coordinates;
                            if (actionCoords && lon !== null && lat !== null) {
                                const dist = CoordUtils.distance(lat, lon, actionCoords[1], actionCoords[0]);
                                if (dist < DUPLICATE_DISTANCE) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // Ignorieren
        }
        
        return false;
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

        // Duplikat-Check (mit Koordinaten für bessere Erkennung)
        if (this.isDuplicate(numberStr, segmentId, houseNumber.lon, houseNumber.lat)) {
            return { success: false, reason: 'duplicate' };
        }

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

        // FINALE PRÜFUNG 3: W.model.segmentHouseNumbers.getByAttributes
        try {
            if (W?.model?.segmentHouseNumbers?.getByAttributes) {
                const existingHN = W.model.segmentHouseNumbers.getByAttributes({
                    segID: segmentId,
                    number: numberStr
                });
                if (existingHN && existingHN.length > 0) {
                    this.markAsImported(numberStr, segmentId, houseNumber.lon, houseNumber.lat);
                    return { success: false, reason: 'duplicate' };
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

                try {
                    await wmeSDK.DataModel.HouseNumbers.addHouseNumber({
                        segmentId: segmentId,
                        number: numberStr,
                        geometry: geometry
                    });
                    return { success: true, segmentId: segmentId, distance: segmentDistance };
                } catch (e1) {
                    try {
                        await wmeSDK.DataModel.HouseNumbers.addHouseNumber({
                            segmentId: segmentId,
                            number: numberStr,
                            point: geometry
                        });
                        return { success: true, segmentId: segmentId, distance: segmentDistance };
                    } catch (e2) {
                        throw e1;
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

        // ===== SCHRITT 1: Scanne ALLE sichtbaren Hausnummern =====
        log('Scanne existierende Hausnummern...', 'info');
        updateProgress('Scanne HN...');
        const scannedHN = this.scanVisibleHouseNumbers();
        
        // Zähle Positionen
        let totalPositions = 0;
        for (const positions of scannedHN.values()) {
            totalPositions += positions.length;
        }
        log(`${scannedHN.size} HN-Nummern gefunden (${totalPositions} Positionen)`, 'info');
        
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
                const coordKey = `${key}_${pos.lat.toFixed(4)}_${pos.lon.toFixed(4)}`;
                wmeManager.importedThisSession.set(coordKey, { 
                    number: key, 
                    lat: pos.lat, 
                    lon: pos.lon 
                });
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
                    
                    // Warte bis WME die HN für diesen Bereich geladen hat
                    await this.sleep(1200);
                    
                    // HN neu laden für diesen Bereich
                    wmeManager.loadExistingHouseNumbers();
                    
                    await this.sleep(300);
                } catch (e) {
                    // Ignorieren
                }
            }
            
            // Sammle alle HN die im sicheren Bereich liegen (max 10 für parallele Verarbeitung)
            const safeBatch = [];
            while (i < sortedHN.length && safeBatch.length < 10 && !this.shouldStop) {
                const currentHN = sortedHN[i];
                
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
            
            // Parallele Verarbeitung des Safe-Batches
            if (safeBatch.length > 0) {
                await Promise.all(safeBatch.map(h => this.processHouseNumber(h)));
                
                // Kurze Pause nach Batch
                await this.sleep(150);
            }
            
            // Auto-Pause: Prüfe ob nächster Schwellenwert erreicht
            if (CONFIG.import.autoPauseEnabled && CONFIG.import.autoPauseAfter > 0) {
                const pauseInterval = CONFIG.import.autoPauseAfter;
                const nextPauseAt = lastPauseAt + pauseInterval;
                
                if (importStats.successful >= nextPauseAt) {
                    lastPauseAt = Math.floor(importStats.successful / pauseInterval) * pauseInterval;
                    
                    log(`⏸️ Auto-Pause nach ${importStats.successful} Imports - Bitte jetzt SPEICHERN!`, 'warning');
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
    
    // Scanne ALLE sichtbaren Hausnummern und sammle ihre Koordinaten
    scanVisibleHouseNumbers() {
        const result = new Map(); // number (lowercase) -> Array von {lat, lon}
        
        const addPosition = (number, lat, lon) => {
            if (!number || lat === null || lon === null || isNaN(lat) || isNaN(lon)) return;
            const numStr = String(number).trim().toLowerCase();
            if (!result.has(numStr)) {
                result.set(numStr, []);
            }
            result.get(numStr).push({ lat, lon });
        };
        
        try {
            // ===== QUELLE 0: DOM-BASIERTE ERKENNUNG (WICHTIGSTE!) =====
            // WME rendert HN als SVG-Text oder HTML-Elemente auf der Karte
            let count0 = 0;
            
            // Methode A: SVG Text-Elemente im Map-Container
            const mapContainer = document.getElementById('map') || document.querySelector('.olMap') || document.querySelector('[class*="map"]');
            if (mapContainer) {
                // Suche nach SVG Text-Elementen (HN werden oft als SVG gerendert)
                const svgTexts = mapContainer.querySelectorAll('svg text, svg tspan');
                for (const textEl of svgTexts) {
                    const text = textEl.textContent?.trim();
                    // Prüfe ob es eine Hausnummer ist (beginnt mit Ziffer)
                    if (text && /^\d+[a-zA-Z]?$/.test(text)) {
                        // Versuche Position aus transform oder parent zu bekommen
                        const coords = this.getElementMapCoordinates(textEl);
                        if (coords) {
                            addPosition(text, coords.lat, coords.lon);
                            count0++;
                        }
                    }
                }
                
                // Methode B: Suche nach HN-spezifischen Elementen
                const hnElements = mapContainer.querySelectorAll(
                    '[class*="house-number"], [class*="houseNumber"], [class*="hn-"], ' +
                    '[data-house-number], [data-hn], .house-number-marker, .hn-marker'
                );
                for (const el of hnElements) {
                    const text = el.textContent?.trim() || el.getAttribute('data-house-number') || el.getAttribute('data-hn');
                    if (text && /^\d+[a-zA-Z]?$/.test(text)) {
                        const coords = this.getElementMapCoordinates(el);
                        if (coords) {
                            addPosition(text, coords.lat, coords.lon);
                            count0++;
                        }
                    }
                }
            }
            
            // Methode C: OpenLayers Vector Layer Features
            if (W?.map?.olMap?.layers) {
                for (const layer of W.map.olMap.layers) {
                    // Suche nach HouseNumbers Layer oder anderen relevanten Layern
                    const layerName = layer?.name || layer?.CLASS_NAME || '';
                    const layerId = layer?.id || '';
                    
                    // Erweiterte Layer-Suche
                    const isHNLayer = layerName.toLowerCase().includes('house') || 
                        layerName.toLowerCase().includes('hn') ||
                        layerId.toLowerCase().includes('house') ||
                        layerName.toLowerCase().includes('address') ||
                        layerName.toLowerCase().includes('label');
                    
                    if (layer?.features && layer.features.length > 0) {
                        for (const feature of layer.features) {
                            const attrs = feature?.attributes || feature?.data || {};
                            const number = attrs.number || attrs.houseNumber || attrs.hn || 
                                          attrs.label || attrs.text || attrs.name;
                            
                            // Prüfe ob es eine gültige Hausnummer ist
                            if (!number || !/^\d+[a-zA-Z]?$/.test(String(number).trim())) continue;
                            
                            let lat = null, lon = null;
                            
                            // Geometrie aus Feature
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
                                addPosition(number, lat, lon);
                                count0++;
                            }
                        }
                    }
                }
            }
            console.log(`${SCRIPT_NAME}: Scan DOM/OpenLayers: ${count0} HN`);
            
            // ===== QUELLE 0.5: W.model.segmentHouseNumbers (WICHTIG!) =====
            // Dies ist die Hauptquelle für geladene HN in WME
            let count05 = 0;
            if (W?.model?.segmentHouseNumbers) {
                try {
                    const segHNObjects = W.model.segmentHouseNumbers.objects || {};
                    const segments = W?.model?.segments?.objects || {};
                    
                    for (const id in segHNObjects) {
                        const hn = segHNObjects[id];
                        const attrs = hn?.attributes || hn;
                        const number = attrs?.number;
                        const segId = attrs?.segID;
                        
                        if (!number) continue;
                        
                        let lat = null, lon = null;
                        
                        // Methode A: fractionPoint (Web Mercator)
                        if (attrs?.fractionPoint?.x !== undefined) {
                            lon = attrs.fractionPoint.x * 180 / 20037508.34;
                            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(attrs.fractionPoint.y * Math.PI / 20037508.34)) - Math.PI / 2);
                        }
                        // Methode B: Berechne aus Segment + fraction
                        else if (attrs?.fraction !== undefined && segId && segments[segId]) {
                            const coords = wmeManager.getPointOnSegment(segments[segId], attrs.fraction);
                            if (coords) {
                                lat = coords.lat;
                                lon = coords.lon;
                            }
                        }
                        
                        if (lat !== null && lon !== null) {
                            addPosition(number, lat, lon);
                            count05++;
                        }
                    }
                } catch (e) {
                    console.log(`${SCRIPT_NAME}: segmentHouseNumbers Fehler:`, e);
                }
            }
            console.log(`${SCRIPT_NAME}: Scan W.model.segmentHouseNumbers: ${count05} HN`);
            
            // ===== QUELLE 1: W.model.houseNumbers.objects =====
            const hnObjects = W?.model?.houseNumbers?.objects || {};
            const segments = W?.model?.segments?.objects || {};
            let count1 = 0;
            
            for (const id in hnObjects) {
                const hn = hnObjects[id];
                const attrs = hn?.attributes || hn;
                const number = attrs?.number || attrs?.houseNumber;
                const segId = attrs?.segID || attrs?.segmentId;
                
                let lat = null, lon = null;
                
                // Methode A: fractionPoint (Web Mercator -> WGS84)
                if (attrs?.fractionPoint?.x !== undefined && attrs?.fractionPoint?.y !== undefined) {
                    lon = attrs.fractionPoint.x * 180 / 20037508.34;
                    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(attrs.fractionPoint.y * Math.PI / 20037508.34)) - Math.PI / 2);
                }
                // Methode B: Berechne aus Segment + fraction
                else if (attrs?.fraction !== undefined && segId && segments[segId]) {
                    const coords = wmeManager.getPointOnSegment(segments[segId], attrs.fraction);
                    if (coords) {
                        lat = coords.lat;
                        lon = coords.lon;
                    }
                }
                
                if (lat !== null && lon !== null) {
                    addPosition(number, lat, lon);
                    count1++;
                }
            }
            console.log(`${SCRIPT_NAME}: Scan W.model.houseNumbers: ${count1} HN mit Koordinaten`);
            
            // ===== QUELLE 2: SDK getAll =====
            if (wmeSDK?.DataModel?.HouseNumbers?.getAll) {
                try {
                    const allHN = wmeSDK.DataModel.HouseNumbers.getAll();
                    let count2 = 0;
                    if (allHN && Array.isArray(allHN)) {
                        for (const hn of allHN) {
                            let lat = null, lon = null;
                            if (hn?.geometry?.coordinates?.length >= 2) {
                                lon = hn.geometry.coordinates[0];
                                lat = hn.geometry.coordinates[1];
                            } else if (hn?.point?.coordinates?.length >= 2) {
                                lon = hn.point.coordinates[0];
                                lat = hn.point.coordinates[1];
                            }
                            if (lat !== null && lon !== null) {
                                addPosition(hn?.number, lat, lon);
                                count2++;
                            }
                        }
                    }
                    console.log(`${SCRIPT_NAME}: Scan SDK getAll: ${count2} HN mit Koordinaten`);
                } catch (e) {}
            }
            
            // ===== QUELLE 3: Segment.attributes.houseNumbers =====
            let count3 = 0;
            const allSegments = W?.model?.segments?.getObjectArray?.() || Object.values(W?.model?.segments?.objects || {});
            for (const seg of allSegments) {
                if (!seg?.attributes) continue;
                const segHN = seg.attributes.houseNumbers || [];
                const segId = seg.attributes.id;
                
                // Segment-Geometrie für Koordinaten-Berechnung
                let geom = null;
                try {
                    if (typeof seg.getGeometry === 'function') geom = seg.getGeometry();
                    else if (seg.geometry) geom = seg.geometry;
                    else if (seg.attributes.geometry) geom = seg.attributes.geometry;
                } catch (e) {}
                
                for (const hn of segHN) {
                    const number = hn?.number || hn?.houseNumber;
                    if (!number) continue;
                    
                    let lat = null, lon = null;
                    
                    // Berechne Position aus fraction
                    if (geom && hn.fraction !== undefined) {
                        const coords = wmeManager.getPointOnSegment(seg, hn.fraction);
                        if (coords) {
                            lat = coords.lat;
                            lon = coords.lon;
                        }
                    }
                    
                    if (lat !== null && lon !== null) {
                        addPosition(number, lat, lon);
                        count3++;
                    }
                }
            }
            console.log(`${SCRIPT_NAME}: Scan Segment.houseNumbers: ${count3} HN`);
            
            // ===== QUELLE 4: Globale Import-Map =====
            let count4 = 0;
            for (const [key, data] of globalImportedHN.entries()) {
                if (data?.lat && data?.lon && data?.number) {
                    addPosition(data.number, data.lat, data.lon);
                    count4++;
                }
            }
            console.log(`${SCRIPT_NAME}: Scan globalImportedHN: ${count4} HN`);
            
            // ===== QUELLE 5: Pending Actions (noch nicht gespeicherte HN) =====
            let count5 = 0;
            try {
                if (W?.model?.actionManager) {
                    const actions = W.model.actionManager.getActions?.() || [];
                    for (const action of actions) {
                        // Suche nach AddHouseNumber Actions
                        const actionType = action?.type || action?.actionType || action?.constructor?.name || '';
                        if (actionType.toLowerCase().includes('housenumber') || 
                            actionType.toLowerCase().includes('hn')) {
                            
                            const hn = action?.houseNumber || action?.object || action?.attributes;
                            if (!hn) continue;
                            
                            const number = hn?.number || hn?.attributes?.number;
                            if (!number) continue;
                            
                            let lat = null, lon = null;
                            
                            // Koordinaten aus verschiedenen Quellen
                            if (hn?.point?.coordinates) {
                                lon = hn.point.coordinates[0];
                                lat = hn.point.coordinates[1];
                            } else if (hn?.geometry?.coordinates) {
                                lon = hn.geometry.coordinates[0];
                                lat = hn.geometry.coordinates[1];
                            }
                            
                            if (lat !== null && lon !== null) {
                                addPosition(number, lat, lon);
                                count5++;
                            }
                        }
                    }
                }
            } catch (e) {}
            console.log(`${SCRIPT_NAME}: Scan Pending Actions: ${count5} HN`);
            
            // ===== QUELLE 6: Venues/Places mit Hausnummern =====
            let count6 = 0;
            try {
                const venues = W?.model?.venues?.getObjectArray?.() || Object.values(W?.model?.venues?.objects || {});
                for (const venue of venues) {
                    const attrs = venue?.attributes || venue;
                    
                    // Hausnummer aus Adresse
                    const houseNumber = attrs?.houseNumber || attrs?.streetNumber || 
                                       attrs?.address?.houseNumber || attrs?.address?.streetNumber;
                    
                    if (!houseNumber) continue;
                    
                    // Nur gültige Hausnummern (beginnt mit Ziffer)
                    const numStr = String(houseNumber).trim();
                    if (!/^\d/.test(numStr)) continue;
                    
                    let lat = null, lon = null;
                    
                    // Koordinaten aus Venue-Geometrie
                    if (attrs?.geometry?.coordinates) {
                        // Point oder Polygon Centroid
                        const coords = attrs.geometry.coordinates;
                        if (attrs.geometry.type === 'Point') {
                            lon = coords[0];
                            lat = coords[1];
                        } else if (coords[0] && Array.isArray(coords[0])) {
                            // Polygon - berechne Centroid
                            const ring = coords[0];
                            let sumLon = 0, sumLat = 0;
                            for (const pt of ring) {
                                sumLon += pt[0];
                                sumLat += pt[1];
                            }
                            lon = sumLon / ring.length;
                            lat = sumLat / ring.length;
                        }
                    } else if (typeof venue.getGeometry === 'function') {
                        try {
                            const geom = venue.getGeometry();
                            if (geom?.getCentroid) {
                                const centroid = geom.getCentroid();
                                // Web Mercator zu WGS84
                                lon = centroid.x * 180 / 20037508.34;
                                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(centroid.y * Math.PI / 20037508.34)) - Math.PI / 2);
                            }
                        } catch (e) {}
                    }
                    
                    if (lat !== null && lon !== null) {
                        addPosition(numStr, lat, lon);
                        count6++;
                    }
                }
            } catch (e) {
                console.log(`${SCRIPT_NAME}: Venue-Scan Fehler:`, e);
            }
            console.log(`${SCRIPT_NAME}: Scan Venues mit HN: ${count6}`);
            
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Scannen:`, e);
        }
        
        // Statistik ausgeben
        let totalPositions = 0;
        for (const positions of result.values()) {
            totalPositions += positions.length;
        }
        console.log(`${SCRIPT_NAME}: Gesamt: ${result.size} verschiedene HN-Nummern, ${totalPositions} Positionen`);
        
        return result;
    }
    
    // Quelldaten gegen existierende HN filtern
    filterAgainstExisting(houseNumbers, existingHN) {
        const DUPLICATE_DISTANCE = CONFIG.import.duplicateRadius || 20; // Meter
        const result = [];
        const seen = new Map(); // Für Quelldaten-Deduplizierung
        let removedByWME = 0;
        let removedBySource = 0;
        let removedByGlobal = 0;
        
        for (const hn of houseNumbers) {
            const numberStr = String(hn.number).trim().toLowerCase();
            let isDuplicate = false;
            
            // PRÜFUNG 0: Gegen GLOBALE Import-Map (alle bisherigen Imports)
            if (!isDuplicate) {
                for (const [key, data] of globalImportedHN.entries()) {
                    if (!data || data.lon === undefined || data.lat === undefined) continue;
                    const existingNumber = String(data.number || '').toLowerCase();
                    if (existingNumber !== numberStr) continue;
                    
                    const dist = CoordUtils.distance(hn.lat, hn.lon, data.lat, data.lon);
                    if (dist < DUPLICATE_DISTANCE) {
                        isDuplicate = true;
                        removedByGlobal++;
                        break;
                    }
                }
            }
            
            // PRÜFUNG 1: Gegen existierende HN in WME
            if (!isDuplicate) {
                const existingPositions = existingHN.get(numberStr) || [];
                for (const pos of existingPositions) {
                    const dist = CoordUtils.distance(hn.lat, hn.lon, pos.lat, pos.lon);
                    if (dist < DUPLICATE_DISTANCE) {
                        isDuplicate = true;
                        removedByWME++;
                        break;
                    }
                }
            }
            
            // PRÜFUNG 2: Gegen bereits verarbeitete Quelldaten (innerhalb dieses Imports)
            if (!isDuplicate) {
                const seenPositions = seen.get(numberStr) || [];
                for (const pos of seenPositions) {
                    const dist = CoordUtils.distance(hn.lat, hn.lon, pos.lat, pos.lon);
                    if (dist < DUPLICATE_DISTANCE) {
                        isDuplicate = true;
                        removedBySource++;
                        break;
                    }
                }
            }
            
            if (!isDuplicate) {
                // Zur seen-Liste hinzufügen
                if (!seen.has(numberStr)) {
                    seen.set(numberStr, []);
                }
                seen.get(numberStr).push({ lat: hn.lat, lon: hn.lon });
                result.push(hn);
            }
        }
        
        console.log(`${SCRIPT_NAME}: Deduplizierung: ${removedByGlobal} via Global, ${removedByWME} via WME, ${removedBySource} via Quelldaten`);
        
        return result;
    }

    async processHouseNumber(houseNumber) {
        try {
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
                <div style="font-weight: bold; margin-bottom: 10px;">AUTO-PAUSE</div>
                <div style="margin-bottom: 15px;">${importedCount} HN importiert.<br><b>Bitte jetzt SPEICHERN!</b><br>(Strg+S)</div>
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
// BENUTZEROBERFLÄCHE - Gemäß WME API
// ============================================================================
function createUI(tabPane) {
    tabPane.innerHTML = `
        <div id="hn-import-container" style="padding: 8px; font-family: Arial, sans-serif; font-size: 12px;">
            <style>
                #hn-import-container h4 { margin: 12px 0 6px; color: #333; border-bottom: 1px solid #2196F3; padding-bottom: 4px; font-size: 13px; }
                #hn-import-container .form-group { margin-bottom: 10px; }
                #hn-import-container label { display: block; margin-bottom: 3px; font-weight: bold; }
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
                <label><input type="checkbox" id="hn-check-duplicates" checked> Duplikate prüfen</label>
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="hn-auto-scan" checked> 🔄 Auto-Scan (Zoom 19 vor Import)</label>
                <div style="font-size:9px;color:#666;margin-left:18px;">Scrollt automatisch durch den Bereich um existierende HN zu laden</div>
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

    // Speichern
    document.getElementById('btn-save-changes')?.addEventListener('click', () => {
        if (W?.model?.actionManager) {
            const count = W.model.actionManager.getActions().length;
            if (count > 0) {
                const saveBtn = document.querySelector('.save-button:not(.disabled), button.save-button:not([disabled])');
                if (saveBtn) {
                    saveBtn.click();
                    log(`${count} Änderungen werden gespeichert...`, 'info');
                } else {
                    log('Speichern-Button nicht gefunden', 'warning');
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
            
            // 4 Sekunden warten bis WME die Hausnummern geladen hat!
            log('⏳ Warte 4s auf HN-Laden...', 'info');
            await sleep(4000);
            
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
            }
        }
    } catch (e) {
        console.log(`${SCRIPT_NAME}: SDK nicht verfügbar, verwende W.userscripts API`);
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
                
                // Teste getByAttributes
                if (W.model.segmentHouseNumbers.getByAttributes && attrs?.segID && attrs?.number) {
                    const found = W.model.segmentHouseNumbers.getByAttributes({
                        segID: attrs.segID,
                        number: attrs.number
                    });
                    log(`getByAttributes Test: ${found?.length || 0} gefunden`, 'info');
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
