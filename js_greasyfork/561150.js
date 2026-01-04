// ==UserScript==
// @name Geo Importer & Directions
// @version 1.0.1
// @description Import segments (GPX, GeoJSON, KML) into Waze Map Editor, copy cursor coordinates, and open Google Maps directions. Also fetch GPX from Google Maps links via mapstogpx.com.
// @author Minh Tan (fixed by assistant)
// @include /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant GM.xmlHttpRequest
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @grant GM_info
// @namespace https://greasyfork.org/users/1440408
// @downloadURL https://update.greasyfork.org/scripts/561150/Geo%20Importer%20%20Directions.user.js
// @updateURL https://update.greasyfork.org/scripts/561150/Geo%20Importer%20%20Directions.meta.js
// ==/UserScript==
/* global WazeWrap */
/* global bootstrap */
(function () {
    'use strict';

    // NOTE: This file is a corrected/fixed version of the script provided.
    // Main fixes:
    // - Avoid shadowing the imported `bootstrap` by renaming the local initializer.
    // - Normalize usage of the WME SDK to the DataModel API (wmeSDK.DataModel.*), matching common WME Utils.
    // - Improve robustness of initialization flows and error handling.
    // - Keep modern GM.xmlHttpRequest usage.

    const version = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) ? GM_info.script.version : 'unknown';
    const travelMode = 'walking'; // Options: driving, bicycling, walking, transit
    let messageTimeout;
    let wmeSDK; // Will hold the SDK instance

    // Entrypoint -- do not name this "bootstrap" to avoid clashing with @require's bootstrap
    function startScript() {
        // If WazeWrap is available, prefer it
        if (typeof WazeWrap !== 'undefined' && WazeWrap.Init) {
            try {
                WazeWrap.Init(() => {
                    // Wait for SDK to initialize and get a consistent SDK object
                    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.SDK_INITIALIZED) {
                        unsafeWindow.SDK_INITIALIZED.then(() => {
                            const sdk = (typeof unsafeWindow.getWmeSdk === 'function') ? unsafeWindow.getWmeSdk({ scriptId: 'wme-gid', scriptName: 'Geo Importer & Directions' }) : null;
                            init(sdk);
                        });
                    } else {
                        // fallback to immediate init (rare)
                        const sdk = (typeof unsafeWindow.getWmeSdk === 'function') ? unsafeWindow.getWmeSdk({ scriptId: 'wme-gid', scriptName: 'Geo Importer & Directions' }) : null;
                        init(sdk);
                    }
                });
            } catch (e) {
                console.warn('WazeWrap.Init failed, falling back to SDK_INITIALIZED path', e);
                fallbackInit();
            }
        } else {
            fallbackInit();
        }
    }

    function fallbackInit() {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.SDK_INITIALIZED) {
            unsafeWindow.SDK_INITIALIZED.then(() => {
                const sdk = (typeof unsafeWindow.getWmeSdk === 'function') ? unsafeWindow.getWmeSdk({ scriptId: 'wme-gid', scriptName: 'Geo Importer & Directions' }) : null;
                init(sdk);
            }).catch(err => {
                console.error('SDK_INITIALIZED rejected', err);
                init(null);
            });
        } else if (typeof window.SDK_INITIALIZED !== 'undefined') {
            window.SDK_INITIALIZED.then(() => {
                const sdk = (typeof window.getWmeSdk === 'function') ? window.getWmeSdk({ scriptId: 'wme-gid', scriptName: 'Geo Importer & Directions' }) : null;
                init(sdk);
            }).catch(err => {
                console.error('window.SDK_INITIALIZED rejected', err);
                init(null);
            });
        } else {
            // No SDK available — still initialize UI if possible (graceful warning)
            console.warn('WME SDK not available; script will still add UI but some features will be disabled.');
            init(null);
        }
    }

    async function init(sdk) {
        wmeSDK = sdk;
        console.info(`Geo Importer & Directions v${version} started.`);
        setupKeyboardShortcut();
        await createSidebarTab();
    }

    async function createSidebarTab() {
        // Try to register tab via W.userscripts when available (WazeWrap)
        let tabLabel, tabPane;
        try {
            if (typeof W !== 'undefined' && W.userscripts && typeof W.userscripts.registerSidebarTab === 'function') {
                const result = W.userscripts.registerSidebarTab('wme-gid');
                tabLabel = result.tabLabel;
                tabPane = result.tabPane;
            } else if (wmeSDK && wmeSDK.Sidebar && typeof wmeSDK.Sidebar.registerScriptTab === 'function') {
                // Some SDK flavors expose Sidebar.registerScriptTab()
                const t = await wmeSDK.Sidebar.registerScriptTab();
                tabLabel = t.tabLabel;
                tabPane = t.tabPane;
            } else {
                // fallback: try to find the sidebar and inject a simple container
                const sidebar = document.querySelector('.sidebar-content') || document.getElementById('sidebar');
                if (!sidebar) {
                    console.warn('Could not detect Waze sidebar; skipping tab creation.');
                    return;
                }
                tabLabel = document.createElement('div');
                tabLabel.innerText = 'Import & Directions';
                tabPane = document.createElement('div');
                tabPane.style.padding = '10px';
                sidebar.appendChild(tabLabel);
                sidebar.appendChild(tabPane);
            }
        } catch (e) {
            console.warn('Register tab fallback used due to error:', e);
            // continue with DOM fallback
            const sidebar = document.querySelector('.sidebar-content') || document.getElementById('sidebar');
            if (!sidebar) return;
            tabLabel = document.createElement('div');
            tabLabel.innerText = 'Import & Directions';
            tabPane = document.createElement('div');
            tabPane.style.padding = '10px';
            sidebar.appendChild(tabLabel);
            sidebar.appendChild(tabPane);
        }

        tabLabel.innerText = 'Import & Directions';
        tabLabel.title = 'Import segments and get Google Maps directions';
        tabPane.innerHTML = `
            <div style="padding: 5px; display: flex; flex-direction: column; gap: 2px;">
        <h4>Import Settings</h4>
        <select id="roadTypeSelect" style="width: 100%; pading: 4px;">
            <option value="1">Street</option>
            <option value="2">Primary Street</option>
            <option value="17" selected>Private Road</option>
            <option value="20">Parking Lot Road</option>
            <option value="6">MAJOR_HIGHWAY</option>
            <option value="7">MINOR_HIGHWAY</option>
        </select>
        <select id="lockLevelSelect" style="width: 100%; padding: 4px;">
            <option value="0">Lock: None</option>
            <option value="1">Lock: 1</option>
            <option value="2">Lock: 2</option>
            <option value="3">Lock: 3</option>
            <option value="4">Lock: 4</option>
            <option value="5">Lock: 5</option>
        </select>

        <hr />
        <h4>GeoJSON Paste</h4>
        <textarea id="rawGeoJsonInput" placeholder="Paste GeoJSON here..." style="width: 100%; height: 60px; font-size: 10px;"></textarea>
        <button id="importRawBtn" style="width: 100%; background: #2196F3; color: white; border: none; padding: 5px;">Import Paste</button>

        <hr />
        <h4>File & Links</h4>
        <input type="file" id="fileInput" accept=".gpx,.geojson,.json,.kml" style="width: 100%;" />
        <input type="text" id="gmapsLinkInput" placeholder="Paste Google Maps Link" style="width: 100%;" />
        <button id="fetchGpxButton" style="width: 100%;">Fetch & Import GPX</button>
                <h4>Directions</h4>
                <input type="text" id="startCoordInput" placeholder="Start: lon, lat" style="width: 100%; margin-bottom: 5px;" />
                <input type="text" id="destCoordInput" placeholder="Destination: lon, lat" style="width: 100%; margin-bottom: 5px;" />
                <button id="directionsButton" style="width: 100%;">Directions</button>
                <div id="popupMessage" style="display: none; position: absolute; background-color: white; border: 1px solid #ccc; padding: 5px; border-radius: 4px; margin-top: 5px; font-size: small; z-index: 1000;"></div>
            </div>
        `;

        // Wait for element to be in DOM
        await new Promise(r => setTimeout(r, 50));

        const fileInput = tabPane.querySelector('#fileInput');
        const gmapsLinkInput = tabPane.querySelector('#gmapsLinkInput');
        const fetchGpxButton = tabPane.querySelector('#fetchGpxButton');
        const startInput = tabPane.querySelector('#startCoordInput');
        const destInput = tabPane.querySelector('#destCoordInput');
        const directionsBtn = tabPane.querySelector('#directionsButton');

        if (fileInput) fileInput.addEventListener('change', handleFileImport);
        if (fetchGpxButton) fetchGpxButton.addEventListener('click', handleFetchImport);
        if (directionsBtn) directionsBtn.addEventListener('click', () => {
            const s = startInput.value;
            const d = destInput.value;
            if (!s || !d) {
                showPopup('Please enter both start and destination coordinates for directions.', true);
                return;
            }
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(s)}&destination=${encodeURIComponent(d)}&travelmode=${travelMode}`;
            window.open(url, '_blank');
            showPopup('Opening Google Maps Directions...', false);
        });

        tabPane.querySelector('#importRawBtn').addEventListener('click', async () => {
            const rawData = document.getElementById('rawGeoJsonInput').value;
            try {
                const json = JSON.parse(rawData);
                // Tái sử dụng logic parse GeoJSON đã có của bạn bằng cách giả lập một đối tượng File hoặc gọi trực tiếp logic parse
                // Ở đây mình giả định bạn tách logic xử lý JSON ra một hàm riêng:
                const coords = parseGeoJsonContent(json);
                if (coords.length > 0) await createSegmentsFromCoordinates(coords);
            } catch (e) {
                showPopup("Invalid GeoJSON format", true);
            }
        });
    }

    // --- File Import Logic ---
    function handleFileImport(evt) {
        const file = evt.target.files?.[0];
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        showPopup(`Importing ${file.name}...`, false);
        parseFileByExt(file, ext)
            .then(allCoords => {
            if (!allCoords || allCoords.length === 0) throw new Error('No valid track or line data found in file.');
            return createSegmentsFromCoordinates(allCoords).then(() => allCoords.length);
        })
            .then(count => showPopup(`Imported ${count} segment(s) from file.`, false))
            .catch(err => showPopup(`File import failed: ${err.message}`, true))
            .finally(() => { if (evt.target) evt.target.value = ''; }); // Clear the file input
    }

    function parseFileByExt(file, ext) {
        if (ext === 'gpx') return parseGpx(file); // parseGpx now handles File
        if (ext === 'kml') return parseKml(file);
        if (['geojson','json'].includes(ext)) return parseGeoJson(file);
        return Promise.reject(new Error('Unsupported file type for import.'));
    }

    async function parseGpx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const gpxText = event.target.result;
                    resolve(parseGpxString(gpxText)); // Use the new string parser
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }
    function parseGeoJsonContent(geoJson) {
        let allCoordinates = [];
        const processGeometry = (geometry) => {
            if (!geometry) return;
            if (geometry.type === 'LineString') allCoordinates.push(geometry.coordinates);
            else if (geometry.type === 'MultiLineString') geometry.coordinates.forEach(c => allCoordinates.push(c));
        };
        if (geoJson.type === 'FeatureCollection') geoJson.features.forEach(f => processGeometry(f.geometry));
        else processGeometry(geoJson.geometry || geoJson);
        return allCoordinates;
    }
    async function parseGeoJson(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const geoJson = JSON.parse(event.target.result);
                    let allCoordinates = [];
                    const processGeometry = (geometry) => {
                        if (!geometry) return;
                        if (geometry.type === 'LineString') {
                            if (geometry.coordinates.length > 1) {
                                allCoordinates.push(geometry.coordinates);
                            }
                        } else if (geometry.type === 'MultiLineString') {
                            geometry.coordinates.forEach(lineStringCoords => {
                                if (lineStringCoords.length > 1) {
                                    allCoordinates.push(lineStringCoords);
                                }
                            });
                        } else if (geometry.type === 'GeometryCollection') {
                            geometry.geometries.forEach(processGeometry);
                        }
                    };
                    if (geoJson.type === 'FeatureCollection') {
                        geoJson.features.forEach(feature => processGeometry(feature.geometry));
                    } else if (geoJson.type === 'Feature') {
                        processGeometry(geoJson.geometry);
                    } else {
                        processGeometry(geoJson);
                    }
                    resolve(allCoordinates);
                } catch (e) {
                    reject(new Error("Error parsing GeoJSON: " + e.message));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    async function parseKml(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const kmlText = event.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(kmlText, "text/xml");
                    const lineStrings = xmlDoc.querySelectorAll('LineString');
                    let allCoordinates = [];
                    lineStrings.forEach(lineString => {
                        const coordinatesText = lineString.querySelector('coordinates')?.textContent;
                        if (coordinatesText) {
                            const coordsPairs = coordinatesText.trim().split(/\s+/);
                            let segmentCoordinates = [];
                            coordsPairs.forEach(pair => {
                                const coords = pair.split(',');
                                if (coords.length >= 2) {
                                    const lon = parseFloat(coords[0]);
                                    const lat = parseFloat(coords[1]);
                                    if (!isNaN(lon) && !isNaN(lat)) {
                                        segmentCoordinates.push([lon, lat]);
                                    }
                                }
                            });
                            if (segmentCoordinates.length > 1) {
                                allCoordinates.push(segmentCoordinates);
                            }
                        }
                    });

                    const multiGeometries = xmlDoc.querySelectorAll('MultiGeometry');
                    multiGeometries.forEach(multiGeo => {
                        multiGeo.querySelectorAll('LineString').forEach(lineString => {
                            const coordinatesText = lineString.querySelector('coordinates')?.textContent;
                            if (coordinatesText) {
                                const coordsPairs = coordinatesText.trim().split(/\s+/);
                                let segmentCoordinates = [];
                                coordsPairs.forEach(pair => {
                                    const coords = pair.split(',');
                                    if (coords.length >= 2) {
                                        const lon = parseFloat(coords[0]);
                                        const lat = parseFloat(coords[1]);
                                        if (!isNaN(lon) && !isNaN(lat)) {
                                            segmentCoordinates.push([lon, lat]);
                                        }
                                    }
                                });
                                if (segmentCoordinates.length > 1) {
                                    allCoordinates.push(segmentCoordinates);
                                }
                            }
                        });
                    });
                    resolve(allCoordinates);
                } catch (e) {
                    reject(new Error("Error parsing KML: " + e.message));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    // --- GPX string parser (works for file and fetched GPX) ---
    function parseGpxString(gpxText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, "text/xml");
        const errorNode = xmlDoc.querySelector('parsererror');
        if (errorNode) {
            console.error("GPX Parsing Error:", errorNode.textContent);
            throw new Error("Failed to parse GPX XML. Invalid file format?");
        }
        const trackSegments = xmlDoc.querySelectorAll('trkseg');
        const routes = xmlDoc.querySelectorAll('rte');
        let allCoordinates = [];
        trackSegments.forEach(segment => {
            const trackPoints = segment.querySelectorAll('trkpt');
            let segmentCoordinates = [];
            trackPoints.forEach(point => {
                const lat = parseFloat(point.getAttribute('lat'));
                const lon = parseFloat(point.getAttribute('lon'));
                if (!isNaN(lat) && !isNaN(lon)) {
                    segmentCoordinates.push([lon, lat]);
                }
            });
            if (segmentCoordinates.length > 1) {
                allCoordinates.push(segmentCoordinates);
            }
        });
        routes.forEach(route => {
            const routePoints = route.querySelectorAll('rtept');
            let routeCoordinates = [];
            routePoints.forEach(point => {
                const lat = parseFloat(point.getAttribute('lat'));
                const lon = parseFloat(point.getAttribute('lon'));
                if (!isNaN(lat) && !isNaN(lon)) {
                    routeCoordinates.push([lon, lat]);
                }
            });
            if (routeCoordinates.length > 1) {
                allCoordinates.push(routeCoordinates);
            }
        });
        return allCoordinates;
    }

    // --- Create segments in WME using SDK DataModel API (robust to different SDK versions) ---
    async function createSegmentsFromCoordinates(allCoordinates) {
        const roadType = parseInt(document.getElementById('roadTypeSelect').value) || 17;
        const lockLevel = parseInt(document.getElementById('lockLevelSelect').value) || 0;
        const sleep = (ms) => new Promise(res => setTimeout(res, ms));

        showPopup(`Starting import of ${allCoordinates.length} segments...`, false);

        for (let i = 0; i < allCoordinates.length; i++) {
            const geometry = { type: "LineString", coordinates: allCoordinates[i] };

            try {
                const segmentId = wmeSDK.DataModel.Segments.addSegment({
                    geometry: geometry,
                    roadType: roadType
                });

                // Áp dụng Lock Level và Speed Limit
                if (segmentId) {
                    wmeSDK.DataModel.Segments.updateSegment({
                        segmentId: segmentId,
                        lockLevel: lockLevel,
                        fwdSpeedLimit: 50,
                        revSpeedLimit: 50
                    });
                }

                // Mở rộng sáng tạo: Random delay từ 600ms - 1200ms để giả lập thao tác người dùng
                await sleep(Math.floor(Math.random() * 600) + 600);

            } catch (error) {
                console.error('Error at segment', i, error);
            }
        }
        showPopup("Import process finished!", false);
    }

    // Simple coordinate simplification (distance in degrees ~ approximate)
    function simplifyCoords(coords, tolerance) {
        if (coords.length <= 2) return coords;
        let simplified = [coords[0]];
        let last = coords[0];
        for (let i = 1; i < coords.length - 1; i++) {
            const current = coords[i];
            const dist = pointDistance(last, current);
            if (dist >= tolerance * 1e-5) { // tolerance heuristic converted to degree-like threshold
                simplified.push(current);
                last = current;
            }
        }
        simplified.push(coords[coords.length - 1]);
        return simplified;
    }

    function pointDistance(p1, p2) {
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // --- Fetch GPX from Google Maps via mapstogpx.com ---
    async function handleFetchImport() {
        const gmapsLinkInput = document.getElementById('gmapsLinkInput');
        const fetchGpxButton = document.getElementById('fetchGpxButton');
        if (!gmapsLinkInput || !fetchGpxButton) {
            showPopup('UI elements not found.', true);
            return;
        }
        const googleMapsUrl = gmapsLinkInput.value.trim();
        if (!googleMapsUrl) {
            showPopup('Please paste a Google Maps link.', true);
            return;
        }
        if (!googleMapsUrl.match(/maps\.(app\.goo\.gl|google\.(com|be|fr|de|es|co\.uk))\/[^ ]+/i) && !googleMapsUrl.includes('www.google.com/maps')) {
            showPopup('Invalid Google Maps link format.', true);
            return;
        }
        showPopup('Fetching GPX from link...', false);
        fetchGpxButton.disabled = true;
        try {
            const cleanedUrlPart = googleMapsUrl.replace(/^https?:\/\//, '');
            const encodedGdata = encodeURIComponent(cleanedUrlPart);
            const mapstogpxUrl = `https://mapstogpx.com/load.php?d=default&lang=en&elev=off&tmode=off&pttype=fixed&o=gpx&cmt=off&desc=off&descasname=off&w=on&gdata=${encodedGdata}`;
            GM.xmlHttpRequest({
                method: "GET",
                url: mapstogpxUrl,
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "accept-language": "en-US,en;q=0.9",
                    "Referer": "https://mapstogpx.com/"
                },
                onload: function(response) {
                    fetchGpxButton.disabled = false;
                    if (response.status === 200) {
                        try {
                            const gpxText = response.responseText;
                            const allCoords = parseGpxString(gpxText);
                            if (!allCoords || allCoords.length === 0) {
                                if (gpxText.includes("Sorry, there was a problem fetching the data")) {
                                    throw new Error("mapstogpx.com could not fetch data from the provided link.");
                                }
                                if (gpxText.includes("No suitable data found")) {
                                    throw new Error("mapstogpx.com found no track or route data in the link.");
                                }
                                throw new Error('No valid track or route data found in the fetched GPX.');
                            }
                            createSegmentsFromCoordinates(allCoords);
                            showPopup(`Imported ${allCoords.length} segment(s) from link.`, false);
                            gmapsLinkInput.value = '';
                        } catch (e) {
                            showPopup(`GPX processing failed: ${e.message}`, true);
                        }
                    } else {
                        showPopup(`Fetch failed: Status ${response.status} ${response.statusText || ''}`, true);
                        console.error("GM_xmlHttpRequest failed:", response);
                    }
                },
                onerror: function(error) {
                    fetchGpxButton.disabled = false;
                    showPopup(`Fetch failed: Network error`, true);
                    console.error("GM_xmlHttpRequest error:", error);
                },
                ontimeout: function() {
                    fetchGpxButton.disabled = false;
                    showPopup('Fetch timed out.', true);
                },
                onabort: function() {
                    fetchGpxButton.disabled = false;
                    showPopup('Fetch aborted.', true);
                }
            });
        } catch (error) {
            fetchGpxButton.disabled = false;
            showPopup(`An error occurred: ${error.message}`, true);
            console.error("Error in handleFetchImport:", error);
        }
    }

    // --- Utility Functions ---
    function showPopup(msg, isError) {
        const popup = document.getElementById('popupMessage');
        if (!popup) {
            console.log(`Popup [${isError ? 'Error' : 'Info'}]: ${msg}`);
            return;
        }
        popup.textContent = msg;
        popup.style.backgroundColor = isError ? '#ffe0e0' : '#e0ffe0';
        popup.style.color = '#333';
        popup.style.border = `1px solid ${isError ? '#ff9999' : '#99ff99'}`;
        popup.style.display = 'block';
        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => popup.style.display = 'none', 4000);
    }

    function getCursorCoordinates() {
        const coordinateElement = document.querySelector('.wz-map-ol-control-span-mouse-position') || document.querySelector('.mouse-position') || document.querySelector('.wmcMousePosition');
        if (!coordinateElement) {
            console.warn('Could not find coordinate element.');
            return null;
        }
        const coordinateText = coordinateElement.textContent.trim();
        const parts = coordinateText.replace(/[^\d\.\s,-]/g, '').split(/[\s,]+/);
        if (parts.length >= 2) {
            const lon = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lon)) {
                return { lat: lat, lon: lon };
            }
        }
        console.warn('Could not parse coordinates from element text:', coordinateText);
        return null;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy to clipboard: ', err);
            return false;
        }
    }

    function setupKeyboardShortcut() {
        document.addEventListener('keydown', async evt => {
            if (!evt.target.matches('input, textarea, select')) {
                if (evt.ctrlKey && evt.shiftKey && (evt.key === 'X' || evt.key === 'x')) {
                    evt.preventDefault();
                    const c = getCursorCoordinates();
                    if (c) {
                        const text = `${c.lon},${c.lat}`;
                        if (await copyToClipboard(text)) showPopup('Copied: '+text, false);
                        else showPopup('Copy failed.', true);
                    } else showPopup('Coords unavailable.', true);
                }
            }
        });
    }

    // Start the script
    startScript();

})();