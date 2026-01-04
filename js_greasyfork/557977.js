// ==UserScript==
// @name         WME Recent edits extractor
// @namespace    https://waze.com
// @version      0.2.0
// @description  Extract locations from Waze recent edits and convert to geographic data formats
// @author       Stemmi
// @match        https://www.waze.com/*user/editor*
// @match        https://beta.waze.com/*user/editor*
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.0/proj4.js
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557977/WME%20Recent%20edits%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/557977/WME%20Recent%20edits%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // DOM Parser & Extractor
    // ============================================================================

    /**
     * Creates a success result
     * @param {*} data - The result data
     * @returns {{success: true, data: *}}
     */
    function createSuccessResult(data) {
        return { success: true, data };
    }

    /**
     * Creates an error result
     * @param {string} code - Error code
     * @param {string} message - Human-readable error message
     * @param {*} details - Additional error context
     * @returns {{success: false, error: {code: string, message: string, details: *}}}
     */
    function createErrorResult(code, message, details = null) {
        return {
            success: false,
            error: { code, message, details }
        };
    }

    /**
     * Locates the recent edits container element in the DOM
     * @returns {Element|null} The recent edits container or null if not found
     */
    function findRecentEditsContainer() {
        return document.querySelector('#recent-edits');
    }

    /**
     * Extracts all edit entry elements from the recent edits container
     * @returns {Element[]} Array of transaction elements
     */
    function extractEditEntries() {
        const container = findRecentEditsContainer();
        if (!container) {
            return [];
        }
        return Array.from(container.querySelectorAll('.transaction'));
    }

    /**
     * Extracts location coordinates from an edit entry element
     * @param {Element} entry - The edit entry element
     * @returns {{latitude: number, longitude: number}|null} Coordinates or null if not found
     */
    function extractLocationFromEntry(entry) {
        // Look for editor links that contain lon/lat parameters
        const editorLink = entry.querySelector('a[href*="/editor"]');
        if (!editorLink) {
            return null;
        }

        const href = editorLink.getAttribute('href');
        if (!href) {
            return null;
        }

        // Parse URL to extract lon and lat parameters
        try {
            const url = new URL(href, window.location.origin);
            const lon = url.searchParams.get('lon');
            const lat = url.searchParams.get('lat');

            if (lon === null || lat === null) {
                return null;
            }

            const longitude = parseFloat(lon);
            const latitude = parseFloat(lat);

            // Validate coordinates
            if (isNaN(longitude) || isNaN(latitude)) {
                return null;
            }

            return { latitude, longitude };
        } catch (e) {
            return null;
        }
    }

    /**
     * Extracts the timestamp text from an edit entry element
     * @param {Element} entry - The edit entry element
     * @returns {string|null} Timestamp text or null if not found
     */
    function extractTimestampFromEntry(entry) {
        // Look for timestamp elements - common patterns in Waze UI
        const timeElement = entry.querySelector('.timestamp, .time, [class*="time"]');
        if (timeElement) {
            return timeElement.textContent.trim();
        }

        // Fallback: look for text containing time indicators
        const text = entry.textContent;
        const timePatterns = [
            /(\d+)\s*(päivää|päivä|tuntia|tunti|minuuttia|minuutti)\s*sitten/i,
            /(\d+)\s*(days?|hours?|minutes?)\s*ago/i
        ];

        for (const pattern of timePatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return null;
    }

    /**
     * Converts Finnish relative time text to days
     * @param {string} timeText - Relative time text (e.g., "2 päivää sitten", "35 päivää sitten")
     * @returns {number|null} Number of days ago or null if parsing fails
     */
    function parseRelativeTime(timeText) {
        if (!timeText) {
            return null;
        }

        const text = timeText.toLowerCase().trim();

        // Finnish patterns
        const finnishPatterns = [
            { regex: /(\d+)\s*päivää?\s*sitten/i, multiplier: 1 },      // days
            { regex: /(\d+)\s*tuntia?\s*sitten/i, multiplier: 1/24 },   // hours
            { regex: /(\d+)\s*minuuttia?\s*sitten/i, multiplier: 1/(24*60) }, // minutes
            { regex: /(\d+)\s*viikkoa?\s*sitten/i, multiplier: 7 },     // weeks
            { regex: /(\d+)\s*kuukautta?\s*sitten/i, multiplier: 30 }   // months (approximate)
        ];

        // English patterns (fallback)
        const englishPatterns = [
            { regex: /(\d+)\s*days?\s*ago/i, multiplier: 1 },
            { regex: /(\d+)\s*hours?\s*ago/i, multiplier: 1/24 },
            { regex: /(\d+)\s*minutes?\s*ago/i, multiplier: 1/(24*60) },
            { regex: /(\d+)\s*weeks?\s*ago/i, multiplier: 7 },
            { regex: /(\d+)\s*months?\s*ago/i, multiplier: 30 }
        ];

        const allPatterns = [...finnishPatterns, ...englishPatterns];

        for (const { regex, multiplier } of allPatterns) {
            const match = text.match(regex);
            if (match) {
                const value = parseInt(match[1], 10);
                if (!isNaN(value)) {
                    return value * multiplier;
                }
            }
        }

        return null;
    }

    /**
     * Validates coordinate values
     * @param {number} latitude - Latitude value
     * @param {number} longitude - Longitude value
     * @returns {boolean} True if coordinates are valid
     */
    function validateCoordinates(latitude, longitude) {
        return !isNaN(latitude) && 
               !isNaN(longitude) && 
               latitude >= -90 && 
               latitude <= 90 && 
               longitude >= -180 && 
               longitude <= 180;
    }

    // ============================================================================
    // Pagination and Load Strategy
    // ============================================================================

    /**
     * Locates the load-more button in the recent edits section
     * @returns {Element|null} The load-more button or null if not found
     */
    function findLoadMoreButton() {
        // Look for button with Finnish text "Lataa lisää"
        const buttons = document.querySelectorAll('button, .button, [role="button"]');
        for (const button of buttons) {
            const text = button.textContent.trim().toLowerCase();
            if (text.includes('lataa lisää') || text.includes('load more')) {
                return button;
            }
        }
        return null;
    }

    /**
     * Programmatically clicks the load-more button
     * @returns {boolean} True if button was found and clicked, false otherwise
     */
    function clickLoadMoreButton() {
        const button = findLoadMoreButton();
        if (!button) {
            return false;
        }
        
        button.click();
        return true;
    }

    /**
     * Waits for new content to load after clicking load-more button
     * Uses MutationObserver to detect DOM changes
     * @param {number} timeout - Maximum time to wait in milliseconds (default: 5000)
     * @returns {Promise<boolean>} Resolves to true if new content loaded, false if timeout
     */
    function waitForNewContent(timeout = 5000) {
        return new Promise((resolve) => {
            const container = findRecentEditsContainer();
            if (!container) {
                resolve(false);
                return;
            }

            let timeoutId;
            const observer = new MutationObserver((mutations) => {
                // Check if any mutations added new transaction elements
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        // New content detected
                        clearTimeout(timeoutId);
                        observer.disconnect();
                        resolve(true);
                        return;
                    }
                }
            });

            // Start observing
            observer.observe(container, {
                childList: true,
                subtree: true
            });

            // Set timeout
            timeoutId = setTimeout(() => {
                observer.disconnect();
                resolve(false);
            }, timeout);
        });
    }

    /**
     * Determines if more data should be loaded based on the load strategy
     * @param {Array} entries - Current array of extracted entries
     * @param {{type: string, value?: number}} config - Load strategy configuration
     *   - type: 'all' | 'count' | 'days'
     *   - value: max count (for 'count') or max days (for 'days')
     * @returns {boolean} True if more data should be loaded, false otherwise
     */
    function shouldContinueLoading(entries, config) {
        if (!config || !config.type) {
            return false;
        }

        // Strategy: load all available data
        if (config.type === 'all') {
            return true;
        }

        // Strategy: load up to a specific count
        if (config.type === 'count') {
            if (typeof config.value !== 'number' || config.value <= 0) {
                return false;
            }
            return entries.length < config.value;
        }

        // Strategy: load up to a specific age in days
        if (config.type === 'days') {
            if (typeof config.value !== 'number' || config.value <= 0) {
                return false;
            }

            // Check the last 10 entries to see if they're all older than the limit
            // This handles cases where entries might not be in perfect chronological order
            const recentEntries = entries.slice(-10);
            let oldEntriesCount = 0;
            let validEntriesCount = 0;

            for (const entry of recentEntries) {
                if (entry.daysAgo != null) {
                    validEntriesCount++;
                    if (entry.daysAgo > config.value) {
                        oldEntriesCount++;
                    }
                }
            }

            // If we have at least 5 valid entries and they're all older than the limit, stop loading
            if (validEntriesCount >= 5 && oldEntriesCount === validEntriesCount) {
                return false;
            }

            // Otherwise, continue loading
            return true;
        }

        // Unknown strategy type
        return false;
    }

    /**
     * Creates a unique ID for an edit entry
     * Uses URL if available, otherwise falls back to coordinates+timestamp
     * @param {Element} entryElement - The DOM element for the entry
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     * @param {string|null} timestamp - Timestamp text
     * @returns {string} Unique identifier for the entry
     */
    function createUniqueId(entryElement, latitude, longitude, timestamp) {
        // Try to extract a unique URL from the entry
        const editorLink = entryElement.querySelector('a[href*="/editor"]');
        if (editorLink) {
            const href = editorLink.getAttribute('href');
            if (href) {
                // Use the full URL as ID if available
                return href;
            }
        }

        // Fallback: create ID from coordinates and timestamp
        const timestampPart = timestamp ? `-${timestamp.replace(/\s+/g, '-')}` : '';
        return `${latitude.toFixed(6)},${longitude.toFixed(6)}${timestampPart}`;
    }

    /**
     * Removes duplicate entries from an array based on unique IDs
     * Preserves the first occurrence of each unique entry
     * @param {Array} entries - Array of edit entries with 'id' property
     * @returns {Array} Deduplicated array of entries
     */
    function deduplicateEntries(entries) {
        const seen = new Set();
        const deduplicated = [];

        for (const entry of entries) {
            if (!seen.has(entry.id)) {
                seen.add(entry.id);
                deduplicated.push(entry);
            }
        }

        return deduplicated;
    }

    /**
     * Merges new entries with existing entries, removing duplicates
     * @param {Array} existingEntries - Current array of entries
     * @param {Array} newEntries - New entries to merge
     * @returns {Array} Merged and deduplicated array
     */
    function mergeEntries(existingEntries, newEntries) {
        const combined = [...existingEntries, ...newEntries];
        return deduplicateEntries(combined);
    }

    /**
     * Extracts all location data from the recent edits page with error handling
     * @returns {{success: true, data: {entries: Array, totalCount: number, errors: Array}}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function extractAllLocations() {
        try {
            // Check if recent edits container exists
            const container = findRecentEditsContainer();
            if (!container) {
                return createErrorResult(
                    'DOM_STRUCTURE_ERROR',
                    'Recent edits container not found. Make sure you are on a Waze user profile page with recent edits visible.',
                    { selector: '#recent-edits' }
                );
            }

            // Extract all edit entries
            const entryElements = extractEditEntries();
            if (entryElements.length === 0) {
                // Empty result set is valid, not an error
                return createSuccessResult({
                    entries: [],
                    totalCount: 0,
                    errors: []
                });
            }

            const entries = [];
            const errors = [];

            // Process each entry
            entryElements.forEach((entryElement, index) => {
                try {
                    const location = extractLocationFromEntry(entryElement);
                    
                    if (!location) {
                        errors.push({
                            index,
                            code: 'MISSING_COORDINATES',
                            message: 'Could not extract coordinates from entry'
                        });
                        return;
                    }

                    // Validate coordinates
                    if (!validateCoordinates(location.latitude, location.longitude)) {
                        errors.push({
                            index,
                            code: 'INVALID_COORDINATES',
                            message: `Invalid coordinates: lat=${location.latitude}, lon=${location.longitude}`
                        });
                        return;
                    }

                    // Extract timestamp
                    const timestampText = extractTimestampFromEntry(entryElement);
                    const daysAgo = timestampText ? parseRelativeTime(timestampText) : null;

                    // Create unique ID for the entry
                    const uniqueId = createUniqueId(
                        entryElement,
                        location.latitude,
                        location.longitude,
                        timestampText
                    );

                    // Create entry object
                    const entry = {
                        id: uniqueId,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timestamp: timestampText || undefined,
                        daysAgo: daysAgo,
                        metadata: {
                            index,
                            rawTimestamp: timestampText
                        }
                    };

                    entries.push(entry);
                } catch (error) {
                    errors.push({
                        index,
                        code: 'ENTRY_PROCESSING_ERROR',
                        message: `Error processing entry: ${error.message}`
                    });
                }
            });

            return createSuccessResult({
                entries,
                totalCount: entries.length,
                errors
            });

        } catch (error) {
            return createErrorResult(
                'EXTRACTION_ERROR',
                `Unexpected error during extraction: ${error.message}`,
                { error: error.toString() }
            );
        }
    }

    // ============================================================================
    // Coordinate Transformer
    // ============================================================================

    /**
     * Set up proj4js coordinate system definitions
     * EPSG:4326 - WGS84 (latitude/longitude)
     * EPSG:4269 - NAD83 (North American Datum 1983)
     * EPSG:3857 - Web Mercator projection
     */
    
    // EPSG:4326 is the default in proj4js, but we define it explicitly for clarity
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    
    // EPSG:4269 - NAD83
    proj4.defs('EPSG:4269', '+proj=longlat +datum=NAD83 +no_defs');
    
    // EPSG:3857 - Web Mercator
    proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs');

    /**
     * Validates coordinate values for a given EPSG projection
     * @param {number} lat - Latitude or Y coordinate
     * @param {number} lon - Longitude or X coordinate
     * @param {string} epsg - EPSG code (e.g., 'EPSG:4326', '4326', or '4326')
     * @returns {boolean} True if coordinates are valid for the projection
     */
    function validateCoordinatesForEPSG(lat, lon, epsg) {
        // Normalize EPSG code
        const normalizedEPSG = epsg.includes(':') ? epsg : `EPSG:${epsg}`;
        
        // Check for NaN
        if (isNaN(lat) || isNaN(lon)) {
            return false;
        }
        
        // Validate based on projection
        switch (normalizedEPSG) {
            case 'EPSG:4326':
            case 'EPSG:4269':
                // Geographic coordinates (latitude/longitude)
                return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
            
            case 'EPSG:3857':
                // Web Mercator has specific bounds
                // X (longitude): approximately -20037508.34 to 20037508.34 meters
                // Y (latitude): approximately -20048966.10 to 20048966.10 meters
                // But practical limits are smaller due to latitude constraints
                return Math.abs(lon) <= 20037508.34 && Math.abs(lat) <= 20048966.10;
            
            default:
                // Unknown projection, do basic sanity check
                return isFinite(lat) && isFinite(lon);
        }
    }

    /**
     * Transforms coordinates from one projection to another using proj4js
     * @param {number} lat - Latitude or Y coordinate in source projection
     * @param {number} lon - Longitude or X coordinate in source projection
     * @param {string} sourceEPSG - Source EPSG code (default: 'EPSG:4326')
     * @param {string} targetEPSG - Target EPSG code
     * @returns {{success: true, data: {x: number, y: number}}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function transformCoordinates(lat, lon, sourceEPSG = 'EPSG:4326', targetEPSG) {
        try {
            // Normalize EPSG codes
            const normalizedSource = sourceEPSG.includes(':') ? sourceEPSG : `EPSG:${sourceEPSG}`;
            const normalizedTarget = targetEPSG.includes(':') ? targetEPSG : `EPSG:${targetEPSG}`;
            
            // Validate input coordinates
            if (!validateCoordinatesForEPSG(lat, lon, normalizedSource)) {
                return createErrorResult(
                    'INVALID_COORDINATES',
                    `Invalid coordinates for ${normalizedSource}: lat=${lat}, lon=${lon}`,
                    { lat, lon, epsg: normalizedSource }
                );
            }
            
            // Check if source and target are the same
            if (normalizedSource === normalizedTarget) {
                return createSuccessResult({ x: lon, y: lat });
            }
            
            // Check if target EPSG is supported
            const supportedEPSG = ['EPSG:4326', 'EPSG:4269', 'EPSG:3857'];
            if (!supportedEPSG.includes(normalizedTarget)) {
                return createErrorResult(
                    'UNSUPPORTED_EPSG',
                    `Unsupported target EPSG code: ${normalizedTarget}. Supported codes: ${supportedEPSG.join(', ')}`,
                    { targetEPSG: normalizedTarget, supportedEPSG }
                );
            }
            
            // Perform transformation
            // proj4 expects [longitude, latitude] order for geographic coordinates
            const result = proj4(normalizedSource, normalizedTarget, [lon, lat]);
            
            // Validate output coordinates
            if (!validateCoordinatesForEPSG(result[1], result[0], normalizedTarget)) {
                return createErrorResult(
                    'TRANSFORMATION_OUT_OF_BOUNDS',
                    `Transformation resulted in out-of-bounds coordinates for ${normalizedTarget}`,
                    { input: { lat, lon }, output: { x: result[0], y: result[1] } }
                );
            }
            
            return createSuccessResult({
                x: result[0],  // longitude or easting
                y: result[1]   // latitude or northing
            });
            
        } catch (error) {
            return createErrorResult(
                'TRANSFORMATION_ERROR',
                `Error during coordinate transformation: ${error.message}`,
                { error: error.toString(), sourceEPSG, targetEPSG, lat, lon }
            );
        }
    }

    /**
     * Convenience function to transform coordinates to EPSG:4326 (WGS84)
     * @param {number} lat - Latitude in source projection
     * @param {number} lon - Longitude in source projection
     * @param {string} sourceEPSG - Source EPSG code (default: 'EPSG:4326')
     * @returns {{success: true, data: {x: number, y: number}}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function transformToEPSG4326(lat, lon, sourceEPSG = 'EPSG:4326') {
        return transformCoordinates(lat, lon, sourceEPSG, 'EPSG:4326');
    }

    /**
     * Convenience function to transform coordinates to EPSG:4269 (NAD83)
     * @param {number} lat - Latitude in source projection
     * @param {number} lon - Longitude in source projection
     * @param {string} sourceEPSG - Source EPSG code (default: 'EPSG:4326')
     * @returns {{success: true, data: {x: number, y: number}}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function transformToEPSG4269(lat, lon, sourceEPSG = 'EPSG:4326') {
        return transformCoordinates(lat, lon, sourceEPSG, 'EPSG:4269');
    }

    /**
     * Convenience function to transform coordinates to EPSG:3857 (Web Mercator)
     * @param {number} lat - Latitude in source projection
     * @param {number} lon - Longitude in source projection
     * @param {string} sourceEPSG - Source EPSG code (default: 'EPSG:4326')
     * @returns {{success: true, data: {x: number, y: number}}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function transformToEPSG3857(lat, lon, sourceEPSG = 'EPSG:4326') {
        return transformCoordinates(lat, lon, sourceEPSG, 'EPSG:3857');
    }

    // ============================================================================
    // Format Converter
    // ============================================================================

    /**
     * Converts an array of edit entries to GeoJSON format
     * @param {Array} entries - Array of edit entries with latitude/longitude
     * @param {string} epsg - Target EPSG coordinate system (default: 'EPSG:4326')
     * @param {boolean} minimalistic - If true, only include minimal properties (default: false)
     * @returns {{success: true, data: string}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function toGeoJSON(entries, epsg = 'EPSG:4326', minimalistic = false) {
        try {
            // Validate input
            if (!Array.isArray(entries)) {
                return createErrorResult(
                    'INVALID_INPUT',
                    'Entries must be an array',
                    { entries }
                );
            }

            // Normalize EPSG code
            const normalizedEPSG = epsg.includes(':') ? epsg : `EPSG:${epsg}`;

            // Create features array
            const features = [];
            const errors = [];

            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];

                // Validate entry has required fields
                if (!entry || typeof entry.latitude !== 'number' || typeof entry.longitude !== 'number') {
                    errors.push({
                        index: i,
                        code: 'INVALID_ENTRY',
                        message: 'Entry missing latitude or longitude'
                    });
                    continue;
                }

                // Transform coordinates if needed
                let coordinates;
                if (normalizedEPSG === 'EPSG:4326') {
                    // No transformation needed, already in WGS84
                    coordinates = [entry.longitude, entry.latitude];
                } else {
                    // Transform to target EPSG
                    const transformResult = transformCoordinates(
                        entry.latitude,
                        entry.longitude,
                        'EPSG:4326',
                        normalizedEPSG
                    );

                    if (!transformResult.success) {
                        errors.push({
                            index: i,
                            code: 'TRANSFORMATION_ERROR',
                            message: transformResult.error.message,
                            entry: entry.id
                        });
                        continue;
                    }

                    coordinates = [transformResult.data.x, transformResult.data.y];
                }

                // Build properties object with useful metadata
                const properties = {};

                // Always include a 'name' field with a dot for minimalistic display
                properties.name = '.';

                // Also include full metadata for detailed display options
                if (entry.timestamp !== undefined) {
                    properties.timestamp = entry.timestamp;
                }
                if (entry.daysAgo != null) {
                    properties.daysAgo = entry.daysAgo;
                }

                // Create GeoJSON feature
                const feature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    properties: properties
                };

                features.push(feature);
            }

            // Create GeoJSON FeatureCollection
            const geoJSON = {
                type: 'FeatureCollection',
                features: features
            };

            // Add CRS information if not EPSG:4326 (which is the default)
            if (normalizedEPSG !== 'EPSG:4326') {
                geoJSON.crs = {
                    type: 'name',
                    properties: {
                        name: `urn:ogc:def:crs:${normalizedEPSG.replace(':', '::')}`
                    }
                };
            }

            // Convert to JSON string
            const jsonString = JSON.stringify(geoJSON, null, 2);

            // Return success with the GeoJSON string
            return createSuccessResult(jsonString);

        } catch (error) {
            return createErrorResult(
                'GEOJSON_CONVERSION_ERROR',
                `Error converting to GeoJSON: ${error.message}`,
                { error: error.toString() }
            );
        }
    }

    /**
     * Converts an array of edit entries to KML format
     * @param {Array} entries - Array of edit entries with latitude/longitude
     * @param {string} epsg - Target EPSG coordinate system (default: 'EPSG:4326')
     * @param {boolean} minimalistic - If true, show only dots (.) for placemarks (default: false)
     * @returns {{success: true, data: string}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function toKML(entries, epsg = 'EPSG:4326', minimalistic = false) {
        try {
            // Validate input
            if (!Array.isArray(entries)) {
                return createErrorResult(
                    'INVALID_INPUT',
                    'Entries must be an array',
                    { entries }
                );
            }

            // Normalize EPSG code
            const normalizedEPSG = epsg.includes(':') ? epsg : `EPSG:${epsg}`;

            // KML only supports EPSG:4326 (WGS84) coordinates
            // If a different EPSG is requested, we need to transform to 4326 for KML output
            if (normalizedEPSG !== 'EPSG:4326') {
                return createErrorResult(
                    'UNSUPPORTED_EPSG_FOR_KML',
                    'KML format only supports EPSG:4326 (WGS84) coordinates. Please use EPSG:4326 or convert your data.',
                    { requestedEPSG: normalizedEPSG }
                );
            }

            // Start building KML XML
            let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
            kml += '  <Document>\n';
            kml += '    <name>Waze Location Extracts</name>\n';
            kml += '    <description>Locations extracted from Waze recent edits</description>\n';

            const errors = [];

            // Process each entry
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];

                // Validate entry has required fields
                if (!entry || typeof entry.latitude !== 'number' || typeof entry.longitude !== 'number') {
                    errors.push({
                        index: i,
                        code: 'INVALID_ENTRY',
                        message: 'Entry missing latitude or longitude'
                    });
                    continue;
                }

                // Validate coordinates
                if (!validateCoordinates(entry.latitude, entry.longitude)) {
                    errors.push({
                        index: i,
                        code: 'INVALID_COORDINATES',
                        message: `Invalid coordinates: lat=${entry.latitude}, lon=${entry.longitude}`
                    });
                    continue;
                }

                // Create Placemark element
                kml += '    <Placemark>\n';
                
                // Add name - just a dot if minimalistic mode is enabled
                if (minimalistic) {
                    kml += '      <name>.</name>\n';
                } else {
                    const name = `Location ${i + 1}`;
                    kml += `      <name>${escapeXML(name)}</name>\n`;
                    
                    // Add description with useful metadata only
                    let description = '';
                    if (entry.timestamp) {
                        description += `Time: ${escapeXML(entry.timestamp)}`;
                    }
                    if (entry.daysAgo != null) {
                        if (description) description += '\n';
                        description += `Days ago: ${entry.daysAgo.toFixed(1)}`;
                    }
                    
                    if (description) {
                        kml += `      <description>${escapeXML(description)}</description>\n`;
                    }
                }
                
                // Add Point geometry
                // KML format: <coordinates>longitude,latitude,altitude</coordinates>
                // Altitude is optional, we'll use 0
                kml += '      <Point>\n';
                kml += `        <coordinates>${entry.longitude},${entry.latitude},0</coordinates>\n`;
                kml += '      </Point>\n';
                
                kml += '    </Placemark>\n';
            }

            // Close Document and KML tags
            kml += '  </Document>\n';
            kml += '</kml>\n';

            // Return success with the KML string
            return createSuccessResult(kml);

        } catch (error) {
            return createErrorResult(
                'KML_CONVERSION_ERROR',
                `Error converting to KML: ${error.message}`,
                { error: error.toString() }
            );
        }
    }

    /**
     * Escapes special XML characters in a string
     * @param {string} str - String to escape
     * @returns {string} XML-safe string
     */
    function escapeXML(str) {
        if (typeof str !== 'string') {
            str = String(str);
        }
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }



    /**
     * Converts an array of edit entries to GPX format
     * @param {Array} entries - Array of edit entries with latitude/longitude
     * @param {string} epsg - Target EPSG coordinate system (default: 'EPSG:4326')
     * @param {boolean} minimalistic - If true, show only dots for waypoint names (default: false)
     * @returns {{success: true, data: string}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function toGPX(entries, epsg = 'EPSG:4326', minimalistic = false) {
        try {
            // Validate input
            if (!Array.isArray(entries)) {
                return createErrorResult(
                    'INVALID_INPUT',
                    'Entries must be an array',
                    { entries }
                );
            }

            // Normalize EPSG code
            const normalizedEPSG = epsg.includes(':') ? epsg : `EPSG:${epsg}`;

            // GPX only supports EPSG:4326 (WGS84) coordinates
            // If a different EPSG is requested, we need to transform to 4326 for GPX output
            if (normalizedEPSG !== 'EPSG:4326') {
                return createErrorResult(
                    'UNSUPPORTED_EPSG_FOR_GPX',
                    'GPX format only supports EPSG:4326 (WGS84) coordinates. Please use EPSG:4326 or convert your data.',
                    { requestedEPSG: normalizedEPSG }
                );
            }

            // Start building GPX XML
            let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
            gpx += '<gpx version="1.1" creator="Waze Location Extractor"\n';
            gpx += '     xmlns="http://www.topografix.com/GPX/1/1"\n';
            gpx += '     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
            gpx += '     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n';
            
            // Add metadata
            gpx += '  <metadata>\n';
            gpx += '    <name>Waze Location Extracts</name>\n';
            gpx += '    <desc>Locations extracted from Waze recent edits</desc>\n';
            gpx += `    <time>${new Date().toISOString()}</time>\n`;
            gpx += '  </metadata>\n';

            const errors = [];

            // Process each entry as a waypoint
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];

                // Validate entry has required fields
                if (!entry || typeof entry.latitude !== 'number' || typeof entry.longitude !== 'number') {
                    errors.push({
                        index: i,
                        code: 'INVALID_ENTRY',
                        message: 'Entry missing latitude or longitude'
                    });
                    continue;
                }

                // Validate coordinates
                if (!validateCoordinates(entry.latitude, entry.longitude)) {
                    errors.push({
                        index: i,
                        code: 'INVALID_COORDINATES',
                        message: `Invalid coordinates: lat=${entry.latitude}, lon=${entry.longitude}`
                    });
                    continue;
                }

                // Create waypoint element
                // GPX format: <wpt lat="latitude" lon="longitude">
                gpx += `  <wpt lat="${entry.latitude}" lon="${entry.longitude}">\n`;
                
                // Add name
                if (minimalistic) {
                    gpx += `    <name>.</name>\n`;
                } else {
                    const name = `Location ${i + 1}`;
                    gpx += `    <name>${escapeXML(name)}</name>\n`;
                    
                    // Add description with useful metadata only
                    let description = '';
                    if (entry.timestamp) {
                        description += `Time: ${entry.timestamp}`;
                    }
                    if (entry.daysAgo != null) {
                        if (description) description += ', ';
                        description += `${entry.daysAgo.toFixed(1)} days ago`;
                    }
                    
                    if (description) {
                        gpx += `    <desc>${escapeXML(description)}</desc>\n`;
                    }
                }
                
                gpx += '  </wpt>\n';
            }

            // Close GPX tag
            gpx += '</gpx>\n';

            // Return success with the GPX string
            return createSuccessResult(gpx);

        } catch (error) {
            return createErrorResult(
                'GPX_CONVERSION_ERROR',
                `Error converting to GPX: ${error.message}`,
                { error: error.toString() }
            );
        }
    }



    // ============================================================================
    // File Download Handler
    // ============================================================================

    /**
     * Gets the appropriate MIME type for a given format
     * @param {string} format - Format name (geojson, kml, gpx)
     * @returns {string} MIME type string
     */
    function getMimeType(format) {
        const mimeTypes = {
            'geojson': 'application/geo+json',
            'kml': 'application/vnd.google-earth.kml+xml',
            'gpx': 'application/gpx+xml'
        };
        
        return mimeTypes[format.toLowerCase()] || 'text/plain';
    }

    /**
     * Gets the appropriate file extension for a given format
     * @param {string} format - Format name (geojson, kml, gpx)
     * @returns {string} File extension (including the dot)
     */
    function getFileExtension(format) {
        const extensions = {
            'geojson': '.geojson',
            'kml': '.kml',
            'gpx': '.gpx'
        };
        
        return extensions[format.toLowerCase()] || '.txt';
    }

    /**
     * Extracts the username from the page
     * Tries multiple methods: URL path and DOM selector
     * @returns {string|null} Username or null if not found
     */
    function extractUsername() {
        // Method 1: Try to extract from URL (after /editor/)
        try {
            const urlPath = window.location.pathname;
            const editorMatch = urlPath.match(/\/editor\/([^\/]+)/);
            if (editorMatch && editorMatch[1]) {
                return editorMatch[1];
            }
        } catch (e) {
            // Continue to next method
        }

        // Method 2: Try to extract from DOM
        try {
            const userHeadline = document.querySelector("#header > div > div.user-info > div > div.user-headline > h1");
            if (userHeadline && userHeadline.textContent) {
                return userHeadline.textContent.trim();
            }
        } catch (e) {
            // Continue
        }

        // Method 3: Try alternative DOM selectors
        try {
            const userInfo = document.querySelector(".user-info h1, .user-headline h1, [class*='user'] h1");
            if (userInfo && userInfo.textContent) {
                return userInfo.textContent.trim();
            }
        } catch (e) {
            // Failed to extract username
        }

        return null;
    }

    /**
     * Formats a date as YYYY-MM-DD
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    function formatDateYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Extracts date range from entries array
     * @param {Array} entries - Array of edit entries with timestamp or daysAgo
     * @returns {{oldest: Date, newest: Date}|null} Date range or null if no dates available
     */
    function extractDateRange(entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
            return null;
        }

        const now = new Date();
        const dates = [];

        for (const entry of entries) {
            if (entry.daysAgo != null && !isNaN(entry.daysAgo)) {
                // Calculate date from daysAgo
                const date = new Date(now);
                date.setDate(date.getDate() - Math.floor(entry.daysAgo));
                dates.push(date);
            }
        }

        if (dates.length === 0) {
            return null;
        }

        // Find oldest and newest dates
        const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
        const newest = new Date(Math.max(...dates.map(d => d.getTime())));

        return { oldest, newest };
    }
    /**
     * Generates a filename with format extension, username, date range, and strategy
     * @param {string} format - Format name (geojson, kml, gpx)
     * @param {Array} entries - Optional array of entries to extract date range
     * @param {Object} loadStrategy - Load strategy configuration object
     * @returns {string} Generated filename
     */
    function generateFilename(format, entries = null, loadStrategy = null) {
        // Get username
        const username = extractUsername();
        const userPart = username ? `${username}_` : '';

        // Get date range if entries provided
        let datePart = '';
        if (entries && Array.isArray(entries) && entries.length > 0) {
            const dateRange = extractDateRange(entries);
            if (dateRange) {
                const oldestStr = formatDateYYYYMMDD(dateRange.oldest);
                const newestStr = formatDateYYYYMMDD(dateRange.newest);

                if (oldestStr === newestStr) {
                    // Same day
                    datePart = `${oldestStr}_`;
                } else {
                    // Date range
                    datePart = `${oldestStr}_to_${newestStr}_`;
                }
            }
        }

        // If no date range, use current timestamp
        if (!datePart) {
            const now = new Date();
            datePart = `${formatDateYYYYMMDD(now)}_`;
        }

        // Add strategy information
        let strategyPart = '';
        if (loadStrategy) {
            switch (loadStrategy.type) {
                case 'all':
                    strategyPart = 'all';
                    break;
                case 'count':
                    strategyPart = `${loadStrategy.value}_items`;
                    break;
                case 'days':
                    strategyPart = `${loadStrategy.value}_days`;
                    break;
                default:
                    strategyPart = 'unknown';
            }
        } else {
            strategyPart = 'extract';
        }

        // Get file extension for the format
        const extension = getFileExtension(format);

        // Generate filename: username_YYYY-MM-DD_to_YYYY-MM-DD_strategy_waze_edits.ext
        // or: username_YYYY-MM-DD_strategy_waze_edits.ext (if single day)
        // or: waze_locations_YYYY-MM-DD_strategy.ext (if no username)
        const baseName = userPart ? `${userPart}waze_edits` : `waze_locations`;
        return `${baseName}_${datePart}${strategyPart}${extension}`;
    }

    /**
     * Copies text content to the clipboard
     * @param {string} content - Content to copy
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async function copyToClipboard(content) {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
                return { success: true };
            }
            
            // Fallback to older execCommand method
            const textArea = document.createElement('textarea');
            textArea.value = content;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    return { success: true };
                } else {
                    return { 
                        success: false, 
                        error: 'Copy command failed' 
                    };
                }
            } catch (err) {
                document.body.removeChild(textArea);
                return { 
                    success: false, 
                    error: err.message 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    /**
     * Downloads content as a file
     * Creates a blob and triggers a download via a temporary anchor element
     * @param {string} content - File content to download
     * @param {string} filename - Name for the downloaded file
     * @param {string} mimeType - MIME type of the content
     * @returns {{success: true}|{success: false, error: {code: string, message: string, details: *}}}
     */
    function downloadFile(content, filename, mimeType) {
        try {
            // Validate inputs
            if (typeof content !== 'string') {
                return createErrorResult(
                    'INVALID_CONTENT',
                    'Content must be a string',
                    { content }
                );
            }
            
            if (!filename || typeof filename !== 'string') {
                return createErrorResult(
                    'INVALID_FILENAME',
                    'Filename must be a non-empty string',
                    { filename }
                );
            }
            
            // Create a Blob from the content
            const blob = new Blob([content], { type: mimeType });
            
            // Create a temporary URL for the blob
            const url = URL.createObjectURL(blob);
            
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            anchor.style.display = 'none';
            
            // Add to document, click, and remove
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            
            // Clean up the URL after a short delay
            // (some browsers need the URL to remain valid for a moment)
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
            
            return createSuccessResult({ filename, size: content.length });
            
        } catch (error) {
            return createErrorResult(
                'DOWNLOAD_ERROR',
                `Error downloading file: ${error.message}`,
                { error: error.toString(), filename }
            );
        }
    }

    /**
     * Downloads content as a file with automatic format detection and error handling
     * Provides clipboard fallback if download fails
     * @param {string} content - File content to download
     * @param {string} format - Format name (geojson, kml, gpx)
     * @param {Array} entries - Optional array of entries to extract date range for filename
     * @param {Object} loadStrategy - Optional load strategy configuration for filename
     * @returns {Promise<{success: true, data: {method: string, filename?: string}}|{success: false, error: {code: string, message: string, details: *}}>}
     */
    async function downloadWithFallback(content, format, entries = null, loadStrategy = null) {
        try {
            // Generate filename and get MIME type
            const filename = generateFilename(format, entries, loadStrategy);
            const mimeType = getMimeType(format);
            
            // Attempt to download the file
            const downloadResult = downloadFile(content, filename, mimeType);
            
            if (downloadResult.success) {
                return createSuccessResult({
                    method: 'download',
                    filename: filename,
                    size: content.length
                });
            }
            
            // Download failed, try clipboard fallback
            console.warn('Download failed, attempting clipboard fallback:', downloadResult.error);
            
            const clipboardResult = await copyToClipboard(content);
            
            if (clipboardResult.success) {
                return createSuccessResult({
                    method: 'clipboard',
                    message: 'Download failed, but content was copied to clipboard'
                });
            }
            
            // Both methods failed
            return createErrorResult(
                'DOWNLOAD_AND_CLIPBOARD_FAILED',
                'Failed to download file and copy to clipboard. Please check browser permissions.',
                {
                    downloadError: downloadResult.error,
                    clipboardError: clipboardResult.error
                }
            );
            
        } catch (error) {
            return createErrorResult(
                'DOWNLOAD_WITH_FALLBACK_ERROR',
                `Unexpected error during download: ${error.message}`,
                { error: error.toString() }
            );
        }
    }

    // ============================================================================
    // UI Controller
    // ============================================================================

    /**
     * Injects the extraction UI into the Waze editor page
     * Adds a button to trigger the extraction process
     */
    function injectUI() {
        // Check if UI is already injected
        if (document.getElementById('waze-location-extractor-ui')) {
            console.log('UI already injected');
            return;
        }

        // Create container for the UI
        const container = document.createElement('div');
        container.id = 'waze-location-extractor-ui';
        container.style.cssText = `
            position: fixed;
            top: 30px;
            left: 200px;
            z-index: 10000;
            background: #ffffff;
            border: 2px solid #00b8d4;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            min-width: 200px;
        `;

        // Create title
        const title = document.createElement('div');
        title.textContent = 'Location Extractor';
        title.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
            text-align: center;
        `;
        container.appendChild(title);

        // Create extract button
        const extractButton = document.createElement('button');
        extractButton.id = 'waze-extract-button';
        extractButton.textContent = 'Extract Locations';
        extractButton.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: #00b8d4;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Add hover effect
        extractButton.addEventListener('mouseenter', () => {
            extractButton.style.background = '#0097a7';
        });
        extractButton.addEventListener('mouseleave', () => {
            extractButton.style.background = '#00b8d4';
        });
        
        // Wire up click handler directly during injection
        extractButton.addEventListener('click', handleExtractClick);

        container.appendChild(extractButton);

        // Add container to the page
        document.body.appendChild(container);

        console.log('UI injected successfully with event handler attached');
    }

    /**
     * Removes the extraction UI from the page
     */
    function removeUI() {
        const container = document.getElementById('waze-location-extractor-ui');
        if (container) {
            container.remove();
        }
    }

    /**
     * Shows a configuration dialog for selecting format, EPSG, and load strategy
     * @returns {Promise<{format: string, epsg: string, loadStrategy: {type: string, value?: number}}|null>}
     *          Resolves with configuration object or null if cancelled
     */
    function showConfigDialog() {
        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'waze-config-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Create dialog
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            `;

            // Dialog title
            const title = document.createElement('h2');
            title.textContent = 'Export Configuration';
            title.style.cssText = `
                margin: 0 0 20px 0;
                font-size: 20px;
                font-weight: 600;
                color: #333;
            `;
            dialog.appendChild(title);

            // Format selection
            const formatLabel = document.createElement('label');
            formatLabel.textContent = 'Output Format:';
            formatLabel.style.cssText = `
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #555;
            `;
            dialog.appendChild(formatLabel);

            const formatSelect = document.createElement('select');
            formatSelect.id = 'format-select';
            formatSelect.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-bottom: 16px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 12px;
                background: white;
                height: 44px;
                line-height: 1.5;
            `;
            ['GeoJSON', 'KML', 'GPX'].forEach(format => {
                const option = document.createElement('option');
                option.value = format.toLowerCase();
                option.textContent = format;
                formatSelect.appendChild(option);
            });
            dialog.appendChild(formatSelect);

            // EPSG selection
            const epsgLabel = document.createElement('label');
            epsgLabel.textContent = 'Coordinate System (EPSG):';
            epsgLabel.style.cssText = `
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #555;
            `;
            dialog.appendChild(epsgLabel);

            const epsgSelect = document.createElement('select');
            epsgSelect.id = 'epsg-select';
            epsgSelect.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-bottom: 16px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 12px;
                background: white;
                height: 44px;
                line-height: 1.5;
            `;
            [
                { value: '4326', label: 'EPSG:4326 (WGS84 - Lat/Lon)' },
                { value: '4269', label: 'EPSG:4269 (NAD83)' },
                { value: '3857', label: 'EPSG:3857 (Web Mercator)' }
            ].forEach(epsg => {
                const option = document.createElement('option');
                option.value = epsg.value;
                option.textContent = epsg.label;
                epsgSelect.appendChild(option);
            });
            dialog.appendChild(epsgSelect);

            // Load strategy selection
            const strategyLabel = document.createElement('label');
            strategyLabel.textContent = 'Load Strategy:';
            strategyLabel.style.cssText = `
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #555;
            `;
            dialog.appendChild(strategyLabel);

            const strategySelect = document.createElement('select');
            strategySelect.id = 'strategy-select';
            strategySelect.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-bottom: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 12px;
                background: white;
                height: 44px;
                line-height: 1.5;
            `;
            [
                { value: 'all', label: 'Load all available edits' },
                { value: 'count', label: 'Load specific number of edits' },
                { value: 'days', label: 'Load edits from last N days' }
            ].forEach(strategy => {
                const option = document.createElement('option');
                option.value = strategy.value;
                option.textContent = strategy.label;
                strategySelect.appendChild(option);
            });
            dialog.appendChild(strategySelect);

            // Value input (for count/days)
            const valueInput = document.createElement('input');
            valueInput.id = 'strategy-value';
            valueInput.type = 'number';
            valueInput.min = '1';
            valueInput.placeholder = 'Enter value...';
            valueInput.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-bottom: 20px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 12px;
                display: none;
                height: 44px;
                line-height: 1.5;
                box-sizing: border-box;
            `;
            dialog.appendChild(valueInput);

            // Show/hide value input based on strategy
            strategySelect.addEventListener('change', () => {
                if (strategySelect.value === 'count') {
                    valueInput.style.display = 'block';
                    valueInput.placeholder = 'Number of edits (e.g., 100)';
                } else if (strategySelect.value === 'days') {
                    valueInput.style.display = 'block';
                    valueInput.placeholder = 'Number of days (e.g., 30)';
                } else {
                    valueInput.style.display = 'none';
                }
            });

            // Buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `
                display: flex;
                gap: 12px;
                margin-top: 20px;
            `;

            // Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                flex: 1;
                padding: 12px 16px;
                background: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.background = '#e0e0e0';
            });
            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.background = '#f5f5f5';
            });
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });
            buttonsContainer.appendChild(cancelButton);

            // Extract button
            const extractButton = document.createElement('button');
            extractButton.textContent = 'Extract';
            extractButton.style.cssText = `
                flex: 1;
                padding: 12px 16px;
                background: #00b8d4;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            extractButton.addEventListener('mouseenter', () => {
                extractButton.style.background = '#0097a7';
            });
            extractButton.addEventListener('mouseleave', () => {
                extractButton.style.background = '#00b8d4';
            });
            extractButton.addEventListener('click', () => {
                // Validate input if needed
                const strategyType = strategySelect.value;
                let strategyValue = null;

                if (strategyType === 'count' || strategyType === 'days') {
                    strategyValue = parseInt(valueInput.value, 10);
                    if (isNaN(strategyValue) || strategyValue <= 0) {
                        alert(`Please enter a valid ${strategyType === 'count' ? 'number of edits' : 'number of days'}`);
                        return;
                    }
                }

                // Build configuration object
                const config = {
                    format: formatSelect.value,
                    epsg: epsgSelect.value,
                    minimalistic: true,
                    loadStrategy: {
                        type: strategyType,
                        value: strategyValue
                    }
                };

                document.body.removeChild(overlay);
                resolve(config);
            });
            buttonsContainer.appendChild(extractButton);

            dialog.appendChild(buttonsContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(null);
                }
            });
        });
    }

    /**
     * Shows a progress indicator with current status
     * @param {number} current - Current count of processed items
     * @param {number} total - Total count of items (0 if unknown)
     * @param {string} message - Status message to display
     */
    function showProgressIndicator(current, total, message) {
        // Check if progress indicator already exists
        let progressOverlay = document.getElementById('waze-progress-overlay');
        
        if (!progressOverlay) {
            // Create overlay
            progressOverlay = document.createElement('div');
            progressOverlay.id = 'waze-progress-overlay';
            progressOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Create progress dialog
            const progressDialog = document.createElement('div');
            progressDialog.id = 'waze-progress-dialog';
            progressDialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 32px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                text-align: center;
            `;

            // Title
            const title = document.createElement('div');
            title.id = 'progress-title';
            title.textContent = 'Processing...';
            title.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 16px;
            `;
            progressDialog.appendChild(title);

            // Progress bar container
            const progressBarContainer = document.createElement('div');
            progressBarContainer.style.cssText = `
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 16px;
            `;

            const progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.style.cssText = `
                height: 100%;
                background: #00b8d4;
                border-radius: 4px;
                width: 0%;
                transition: width 0.3s ease;
            `;
            progressBarContainer.appendChild(progressBar);
            progressDialog.appendChild(progressBarContainer);

            // Status text
            const statusText = document.createElement('div');
            statusText.id = 'progress-status';
            statusText.textContent = 'Initializing...';
            statusText.style.cssText = `
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
            `;
            progressDialog.appendChild(statusText);

            // Count text
            const countText = document.createElement('div');
            countText.id = 'progress-count';
            countText.textContent = '';
            countText.style.cssText = `
                font-size: 12px;
                color: #999;
            `;
            progressDialog.appendChild(countText);

            progressOverlay.appendChild(progressDialog);
            document.body.appendChild(progressOverlay);
        }

        // Update progress
        const progressBar = document.getElementById('progress-bar');
        const statusText = document.getElementById('progress-status');
        const countText = document.getElementById('progress-count');

        if (statusText) {
            statusText.textContent = message;
        }

        if (total > 0 && progressBar) {
            const percentage = Math.min(100, Math.round((current / total) * 100));
            progressBar.style.width = `${percentage}%`;
        } else if (progressBar) {
            // Indeterminate progress
            progressBar.style.width = '100%';
        }

        if (countText) {
            if (total > 0) {
                countText.textContent = `${current} / ${total}`;
            } else {
                countText.textContent = `${current} items processed`;
            }
        }
    }

    /**
     * Hides the progress indicator
     */
    function hideProgressIndicator() {
        const progressOverlay = document.getElementById('waze-progress-overlay');
        if (progressOverlay) {
            document.body.removeChild(progressOverlay);
        }
    }

    /**
     * Shows a message dialog (for success or error messages)
     * @param {string} title - Dialog title
     * @param {string} message - Message to display
     * @param {string} type - Message type: 'success', 'error', or 'info'
     */
    function showMessage(title, message, type = 'info') {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        `;

        // Icon based on type
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 48px;
            text-align: center;
            margin-bottom: 16px;
        `;
        if (type === 'success') {
            icon.textContent = '✓';
            icon.style.color = '#4caf50';
        } else if (type === 'error') {
            icon.textContent = '✗';
            icon.style.color = '#f44336';
        } else {
            icon.textContent = 'ℹ';
            icon.style.color = '#2196f3';
        }
        dialog.appendChild(icon);

        // Title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin: 0 0 12px 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            text-align: center;
        `;
        dialog.appendChild(titleElement);

        // Message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 14px;
            color: #666;
            text-align: center;
            line-height: 1.5;
        `;
        dialog.appendChild(messageElement);

        // OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            background: #00b8d4;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        okButton.addEventListener('mouseenter', () => {
            okButton.style.background = '#0097a7';
        });
        okButton.addEventListener('mouseleave', () => {
            okButton.style.background = '#00b8d4';
        });
        okButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        dialog.appendChild(okButton);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    /**
     * Orchestrates the extraction process
     * Handles the complete flow: config -> load -> extract -> convert -> download
     */
    async function handleExtractClick() {
        try {
            // Show configuration dialog
            const config = await showConfigDialog();
            
            // User cancelled
            if (!config) {
                console.log('User cancelled extraction');
                return;
            }

            console.log('Starting extraction with config:', config);

            // Show initial progress
            showProgressIndicator(0, 0, 'Initializing extraction...');

            // Extract initial batch of locations
            showProgressIndicator(0, 0, 'Extracting locations from page...');
            const extractResult = extractAllLocations();

            if (!extractResult.success) {
                hideProgressIndicator();
                console.error('Extraction failed:', extractResult.error);
                
                // Provide helpful error messages based on error code
                let errorMessage = extractResult.error.message;
                let suggestion = '';
                
                switch (extractResult.error.code) {
                    case 'DOM_STRUCTURE_ERROR':
                        suggestion = '\n\nMake sure you are on a Waze user profile page with the recent edits section visible. Try refreshing the page.';
                        break;
                    case 'EXTRACTION_ERROR':
                        suggestion = '\n\nThere was an unexpected error. Try refreshing the page and attempting again.';
                        break;
                    default:
                        suggestion = '\n\nPlease check the browser console for more details.';
                }
                
                showMessage('Extraction Failed', errorMessage + suggestion, 'error');
                return;
            }

            let allEntries = extractResult.data.entries;
            console.log(`Initial extraction: ${allEntries.length} entries`);
            
            // Log any extraction errors from initial batch
            if (extractResult.data.errors && extractResult.data.errors.length > 0) {
                console.warn(`Initial extraction had ${extractResult.data.errors.length} errors:`, extractResult.data.errors);
            }

            // Handle pagination if needed
            if (config.loadStrategy.type !== 'all' || findLoadMoreButton()) {
                let continueLoading = shouldContinueLoading(allEntries, config.loadStrategy);
                let loadAttempts = 0;
                const maxLoadAttempts = 100; // Safety limit

                while (continueLoading && loadAttempts < maxLoadAttempts) {
                    // Check if load-more button exists
                    const hasMoreButton = findLoadMoreButton();
                    if (!hasMoreButton) {
                        console.log('No more load-more button found, stopping pagination');
                        break;
                    }

                    // Update progress
                    showProgressIndicator(
                        allEntries.length,
                        0,
                        `Loading more edits... (${allEntries.length} loaded)`
                    );

                    // Click load-more button
                    const clicked = clickLoadMoreButton();
                    if (!clicked) {
                        console.warn('Failed to click load-more button, stopping pagination');
                        break;
                    }

                    // Wait for new content to load
                    const loaded = await waitForNewContent(5000);
                    if (!loaded) {
                        console.warn('Timeout waiting for new content after clicking load-more, stopping pagination');
                        break;
                    }

                    // Extract new batch
                    const newExtractResult = extractAllLocations();
                    if (!newExtractResult.success) {
                        console.error('Error extracting new batch:', newExtractResult.error);
                        console.warn('Stopping pagination due to extraction error');
                        break;
                    }

                    // Merge with existing entries (deduplication happens here)
                    const previousCount = allEntries.length;
                    allEntries = mergeEntries(allEntries, newExtractResult.data.entries);
                    const newCount = allEntries.length - previousCount;

                    console.log(`Loaded ${newCount} new unique entries (total: ${allEntries.length}, attempt: ${loadAttempts + 1})`);
                    
                    // Log any extraction errors from this batch
                    if (newExtractResult.data.errors && newExtractResult.data.errors.length > 0) {
                        console.warn(`Batch ${loadAttempts + 1} had ${newExtractResult.data.errors.length} errors`);
                    }

                    // Check if we should continue loading
                    continueLoading = shouldContinueLoading(allEntries, config.loadStrategy);
                    loadAttempts++;
                    
                    // Log if we're stopping due to strategy limits
                    if (!continueLoading) {
                        if (config.loadStrategy.type === 'days') {
                            // Log the age range of recent entries for debugging
                            const recentEntries = allEntries.slice(-10);
                            const ages = recentEntries
                                .filter(e => e.daysAgo != null)
                                .map(e => e.daysAgo.toFixed(1));
                            console.log(`Stopping pagination: last 10 entries ages (days): [${ages.join(', ')}]`);
                            console.log(`Strategy limit: ${config.loadStrategy.value} days`);
                        } else {
                            console.log(`Stopping pagination: load strategy limit reached (${config.loadStrategy.type})`);
                        }
                    }

                    // Small delay to avoid overwhelming the page
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                if (loadAttempts >= maxLoadAttempts) {
                    console.warn(`Reached maximum load attempts (${maxLoadAttempts}), stopping pagination`);
                }

                console.log(`Finished loading. Total entries: ${allEntries.length}`);
            }

            // Filter entries based on load strategy limits
            let finalEntries = allEntries;
            if (config.loadStrategy.type === 'count' && config.loadStrategy.value) {
                const beforeCount = allEntries.length;
                finalEntries = allEntries.slice(0, config.loadStrategy.value);
                console.log(`Filtered by count: ${beforeCount} -> ${finalEntries.length} (limit: ${config.loadStrategy.value})`);
            } else if (config.loadStrategy.type === 'days' && config.loadStrategy.value) {
                const beforeCount = allEntries.length;
                finalEntries = allEntries.filter(entry => {
                    return entry.daysAgo == null || entry.daysAgo <= config.loadStrategy.value;
                });
                console.log(`Filtered by days: ${beforeCount} -> ${finalEntries.length} (limit: ${config.loadStrategy.value} days)`);
            }

            console.log(`Final entries after filtering: ${finalEntries.length}`);

            if (finalEntries.length === 0) {
                hideProgressIndicator();
                console.warn('No location data found after filtering');
                
                let message = 'No location data found to export.';
                let suggestion = '';
                
                if (allEntries.length > 0) {
                    // We had entries but they were all filtered out
                    if (config.loadStrategy.type === 'days') {
                        suggestion = `\n\nYou loaded ${allEntries.length} entries, but none were within the last ${config.loadStrategy.value} days. Try increasing the day limit or using "Load all available edits".`;
                    } else {
                        suggestion = `\n\nAll ${allEntries.length} entries were filtered out. This shouldn't happen - please check the browser console for details.`;
                    }
                } else {
                    // No entries were found at all
                    suggestion = '\n\nMake sure you are on a Waze user profile page with recent edits visible. The recent edits section should contain location data.';
                }
                
                showMessage('No Data', message + suggestion, 'info');
                return;
            }

            // Convert to selected format
            showProgressIndicator(finalEntries.length, finalEntries.length, 'Converting to format...');

            let convertResult;
            const epsg = `EPSG:${config.epsg}`;

            switch (config.format) {
                case 'geojson':
                    convertResult = toGeoJSON(finalEntries, epsg, config.minimalistic);
                    break;
                case 'kml':
                    convertResult = toKML(finalEntries, epsg, config.minimalistic);
                    break;
                case 'gpx':
                    convertResult = toGPX(finalEntries, epsg, config.minimalistic);
                    break;
                default:
                    hideProgressIndicator();
                    console.error('Invalid format selected:', config.format);
                    showMessage('Invalid Format', `Unsupported format: ${config.format}`, 'error');
                    return;
            }

            if (!convertResult.success) {
                hideProgressIndicator();
                console.error('Conversion failed:', convertResult.error);
                
                // Provide helpful error messages based on error code
                let errorMessage = convertResult.error.message;
                let suggestion = '';
                
                switch (convertResult.error.code) {
                    case 'UNSUPPORTED_EPSG_FOR_KML':
                    case 'UNSUPPORTED_EPSG_FOR_GPX':
                        suggestion = '\n\nThese formats only support EPSG:4326 (WGS84). Please select EPSG:4326 in the configuration.';
                        break;
                    case 'TRANSFORMATION_ERROR':
                        suggestion = '\n\nThere was an error transforming coordinates. Try using EPSG:4326 (WGS84) instead.';
                        break;
                    case 'INVALID_INPUT':
                        suggestion = '\n\nThe extracted data is invalid. Try extracting again.';
                        break;
                    default:
                        suggestion = '\n\nPlease check the browser console for more details.';
                }
                
                showMessage('Conversion Failed', errorMessage + suggestion, 'error');
                return;
            }

            // Download the file
            showProgressIndicator(finalEntries.length, finalEntries.length, 'Preparing download...');

            const downloadResult = await downloadWithFallback(
                convertResult.data,
                config.format,
                finalEntries,
                config.loadStrategy
            );

            hideProgressIndicator();

            if (downloadResult.success) {
                if (downloadResult.data.method === 'download') {
                    console.log('Download successful:', downloadResult.data);
                    showMessage(
                        'Success!',
                        `Exported ${finalEntries.length} locations to ${downloadResult.data.filename}`,
                        'success'
                    );
                } else if (downloadResult.data.method === 'clipboard') {
                    console.log('Copied to clipboard as fallback');
                    showMessage(
                        'Copied to Clipboard',
                        `Download failed, but ${finalEntries.length} locations were copied to clipboard. You can paste the data into a text editor and save it manually.`,
                        'info'
                    );
                }
            } else {
                console.error('Download failed:', downloadResult.error);
                
                // Provide helpful error messages
                let errorMessage = downloadResult.error.message;
                let suggestion = '';
                
                switch (downloadResult.error.code) {
                    case 'DOWNLOAD_AND_CLIPBOARD_FAILED':
                        suggestion = '\n\nPlease check your browser permissions for downloads and clipboard access. You may need to allow these in your browser settings.';
                        break;
                    case 'DOWNLOAD_ERROR':
                        suggestion = '\n\nThe browser blocked the download. Try allowing downloads from this site in your browser settings.';
                        break;
                    default:
                        suggestion = '\n\nPlease check the browser console for more details.';
                }
                
                showMessage('Download Failed', errorMessage + suggestion, 'error');
            }

        } catch (error) {
            hideProgressIndicator();
            console.error('Unexpected extraction error:', error);
            console.error('Error stack:', error.stack);
            
            // Provide a helpful error message
            let errorMessage = `Unexpected error: ${error.message}`;
            let suggestion = '\n\nThis is an unexpected error. Please try the following:\n' +
                           '1. Refresh the page and try again\n' +
                           '2. Check the browser console for more details\n' +
                           '3. Make sure you are on a valid Waze user profile page';
            
            showMessage('Error', errorMessage + suggestion, 'error');
        }
    }

    // Main script execution starts here
    console.log('Waze Location Extractor loaded');

    // Wait for page to be fully loaded before injecting UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtractor);
    } else {
        // DOM is already loaded
        initializeExtractor();
    }

    /**
     * Initializes the extractor by injecting UI
     * Event handlers are wired up during UI injection
     */
    function initializeExtractor() {
        // Inject UI (event handlers are attached during injection)
        injectUI();
        console.log('Waze Location Extractor initialized successfully');
    }

})();
