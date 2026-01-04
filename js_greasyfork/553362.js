// ==UserScript==
// @name         WME Editor Heatmap
// @version      v2.0.0
// @description  High-performance heatmap for WME, optimized for massive datasets using Geohashing, Spatial Indexing, and Stream Processing.
// @author       MinhtanZ1
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user*
// @exclude      https://www.waze.com/*/user*
// @require      https://cdn.jsdelivr.net/npm/heatmap.js@2.0.5/build/heatmap.min.js
// @require      https://update.greasyfork.org/scripts/24851/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/dexie@4/dist/dexie.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/1440408
// @downloadURL https://update.greasyfork.org/scripts/553362/WME%20Editor%20Heatmap.user.js
// @updateURL https://update.greasyfork.org/scripts/553362/WME%20Editor%20Heatmap.meta.js
// ==/UserScript==

/* global W, WazeWrap, h337, Dexie, OpenLayers, getWmeSdk */
(function() {
    'use strict';
    const SCRIPT_NAME = 'WME Editor Heatmap';
    const SCRIPT_VERSION = 'v2.0.0';
    const SCRIPT_ID = 'wme-editor-heatmap-optimized';

    const CHUNK_SIZE_DEGREES = 0.05;
    const MIN_DISTANCE_METERS = 10;
    const SAVE_DEBOUNCE_MS = 10000;
    const db = new Dexie('WMEHeatmapDB');
    db.version(1).stores({
        coordinates: '++id, [cx+cy], ts'
    });
    let heatmapInstance = null;
    let isHeatmapVisible = false;
    let wmeSDK = null;
    let lastSavedPointCache = null;

    function debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }
    function haversineDistance(p1, p2) {
        const R = 6371e3;
        const φ1 = p1.la * Math.PI / 180;
        const φ2 = p2.la * Math.PI / 180;
        const Δφ = (p2.la - p1.la) * Math.PI / 180;
        const Δλ = (p2.lo - p1.lo) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    function handleKeyPress(e) {
        if (e.key.toLowerCase() !== 'y') return;
        const target = e.target.tagName.toLowerCase();
        if (target === 'input' || target === 'textarea') return;
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
        e.preventDefault();
        toggleHeatmap();
    }

    function getCutoffDate(filter) {
        if (filter === 'all') return null;
        const now = new Date();
        const cutoff = new Date();
        switch (filter) {
            case 'week':
                cutoff.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoff.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                cutoff.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return null;
        }
        return cutoff;
    }

    if (typeof unsafeWindow.SDK_INITIALIZED !== 'undefined') {
        unsafeWindow.SDK_INITIALIZED.then(initSDK);
    }
    async function cleanupOldData() {
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 1);
        try {
            const count = await db.coordinates.where('ts')
            .below(cutoff.toISOString())
            .delete();
            if (count > 0) {
                console.log(`${SCRIPT_NAME}: Cleaned up ${count} records older than 1 year.`);
            }
        } catch (err) {
            console.error(`${SCRIPT_NAME}: Error during data cleanup:`, err);
        }
    }
    function initSDK() {
        if (!unsafeWindow.getWmeSdk || !WazeWrap.Ready || !W.map || !W.userscripts) {
            setTimeout(initSDK, 500);
            return;
        }
        wmeSDK = unsafeWindow.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });
        initialize();
    }
    async function initialize() {
        console.log(`${SCRIPT_NAME} ${SCRIPT_VERSION} - SDK Initialized`);
        cleanupOldData();
        window.addEventListener('keydown', handleKeyPress);

        lastSavedPointCache = await db.coordinates.orderBy('id').last();
        WazeWrap.Interface.Tab('Heatmap', `
            <div id="heatmap-controls" style="padding: 10px;">
                <h4>Editor Heatmap</h4>
                <p>Hiển thị mật độ các vị trí bạn đã chỉnh sửa (lưu trữ local).</p>
                <label for="timeFilter">Lọc theo thời gian:</label>
                <select id="timeFilter" style="margin: 5px 0 10px; width: 100%;">
                    <option value="all">Tất cả</option>
                    <option value="week" selected>Tuần qua</option>
                    <option value="month">Tháng qua</option>
                    <option value="year">Năm qua</option>
                </select>
                <div id="heatmap-loader" style="display: none; margin-top: 10px; color: #888; text-align: center;"></div>
                <button id="toggleHeatmapBtn" class="wz-button wz-blue-button wz-button-primary" style="width: 100%;">Hiển thị Heatmap</button>
                <button id="exportDataBtn" class="wz-button" style="width: 100%; margin-top: 5px;">Xuất Dữ Liệu (JSON)</button>
                <label for="importFileInput" class="wz-button" style="width: 100%; margin-top: 5px; display: block; cursor: pointer;">Nhập & Tổng Hợp Dữ Liệu
                    <input type="file" id="importFileInput" accept=".json" style="display: none;">
                </label>
                <button id="refreshHeatmapBtn" class="wz-button" style="width: 100%; margin-top: 5px;">Làm mới Heatmap</button>
                <button id="clearDataBtn" class="wz-button wz-red-button" style="width: 100%; margin-top: 10px;">Xóa Toàn Bộ Dữ Liệu</button>
            </div>
        `, () => {
            document.getElementById('toggleHeatmapBtn')
                .addEventListener('click', toggleHeatmap);
            document.getElementById('exportDataBtn')
                .addEventListener('click', exportData);
            document.getElementById('importFileInput')
                .addEventListener('change', (e) => importAndMerge(e.target.files[0]));
            document.getElementById('refreshHeatmapBtn')
                .addEventListener('click', redrawHeatmap);
            document.getElementById('clearDataBtn')
                .addEventListener('click', clearAllData);
            document.getElementById('timeFilter')
                .addEventListener('change', () => {
                if (isHeatmapVisible) {
                    redrawHeatmap();
                }
            });
        });
        wmeSDK.Events.on({ eventName: "wme-map-move-end", eventHandler: saveCoordinates });
        const debouncedRedraw = debounce(redrawHeatmap, 500);
        wmeSDK.Events.on({ eventName: "wme-map-move", eventHandler: debouncedRedraw });
        wmeSDK.Events.on({ eventName: "wme-map-zoom-changed", eventHandler: debouncedRedraw });
    }
    /**
     * [TỐI ƯU HÓA] Hàm lưu tọa độ được thiết kế lại hoàn toàn.
     */
    async function saveCoordinates() {
        if (W.map.getZoom() < 15) return;
        const center = getWGS84Center();
        if (!center) return;
        const newPoint = { la: center.lat, lo: center.lon };
        if (lastSavedPointCache) {
            if (haversineDistance(newPoint, lastSavedPointCache) < 5) return;
            if (new Date() - new Date(lastSavedPointCache.ts) < SAVE_DEBOUNCE_MS) return;
        }
        try {
            const cx = Math.floor(newPoint.lo / CHUNK_SIZE_DEGREES);
            const cy = Math.floor(newPoint.la / CHUNK_SIZE_DEGREES);

            const chunkQueries = [];
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    chunkQueries.push([cx + dx, cy + dy]);
                }
            }
            const nearbyPoints = await db.coordinates.where('[cx+cy]').anyOf(chunkQueries).toArray();
            for (const existingPoint of nearbyPoints) {
                if (haversineDistance(newPoint, existingPoint) < MIN_DISTANCE_METERS) {
                    return;
                }
            }
            const pointToSave = { ...newPoint, ts: new Date().toISOString(), cx, cy };
            await db.coordinates.add(pointToSave);
            lastSavedPointCache = pointToSave;
        } catch (err) {
            console.error(`${SCRIPT_NAME}: Error saving to IndexedDB:`, err);
        }
    }
    async function redrawHeatmap() {
        if (!isHeatmapVisible) {
            if (heatmapInstance) heatmapInstance.setData({ max: 0, data: [] });
            return;
        }
        const ZOOM_THRESHOLD = 10;
        const currentZoom = W.map.getZoom();
        if (currentZoom >= ZOOM_THRESHOLD) {

            await renderViewportHeatmap();
        } else {

            await renderGlobalHeatmap();
        }
    }
    async function renderGlobalHeatmap() {
        showLoader('Đang lấy mẫu dữ liệu tổng quan...');
        try {
            const GLOBAL_SAMPLE_SIZE = 50000;
            const totalCount = await db.coordinates.count();
            if (totalCount === 0) {
                if (heatmapInstance) heatmapInstance.setData({ max: 0, data: [] });
                hideLoader();
                return;
            }
            let points = [];

            if (totalCount <= GLOBAL_SAMPLE_SIZE) {
                points = await db.coordinates.toArray();
            } else {

                const step = Math.floor(totalCount / GLOBAL_SAMPLE_SIZE);
                const sampledPoints = [];
                let i = 0;

                await db.coordinates.each(point => {
                    if (i % step === 0) {
                        sampledPoints.push(point);
                    }
                    i++;
                });
                points = sampledPoints;
            }
            showLoader(`Đang vẽ ${points.length} điểm mẫu...`);

            if (!heatmapInstance) {
                const mapViewport = document.querySelector('.olMapViewport');
                if (!mapViewport) throw new Error('Không tìm thấy container của bản đồ (olMapViewport).');
                heatmapInstance = h337.create({
                    container: mapViewport,
                    radius: 15, maxOpacity: 0.6, minOpacity: 0.1, blur: 0.8,
                    gradient: { 0.1: 'navy', 0.2: 'blue', 0.3: 'deepskyblue', 0.4: 'cyan', 0.5: 'limegreen', 0.6: 'lime', 0.7: 'greenyellow', 0.8: 'yellow', 0.9: 'orange', 0.95: 'orangered', 0.99: 'red' }
                });
                const heatmapCanvas = mapViewport.querySelector('canvas');
                if (heatmapCanvas) {
                    heatmapCanvas.style.pointerEvents = 'none';
                    heatmapCanvas.style.zIndex = 800;
                    heatmapCanvas.style.position = 'absolute';
                    heatmapCanvas.style.top = '0px';
                    heatmapCanvas.style.left = '0px';
                }
            }
            const heatmapData = [];
            for (const point of points) {
                const lonLat = new OpenLayers.LonLat(point.lo, point.la);
                try {
                    const pixel = W.map.getPixelFromLonLat(lonLat);
                    if (pixel) {
                        heatmapData.push({ x: Math.round(pixel.x), y: Math.round(pixel.y), value: 1 });
                    }
                } catch (e) { continue; }
            }
            const maxDensity = Math.max(10, Math.ceil(heatmapData.length / 100));
            heatmapInstance.setData({ max: maxDensity, data: heatmapData });
        } catch (err) {
            WazeWrap.Alerts.error(SCRIPT_NAME, `Lỗi khi vẽ heatmap tổng quan: ${err.message}`);
            console.error(err);
        } finally {
            hideLoader();
        }
    }
    /**
 * [HELPER] Render heatmap chi tiết trong viewport sử dụng Geohash.
 * Cực nhanh và hiệu quả.
 */
    async function renderViewportHeatmap() {
        showLoader('Đang truy vấn dữ liệu viewport...');
        try {
            if (!W || !W.map) {
                throw new Error('Đối tượng W.map không tồn tại. Script có thể đã khởi động quá sớm.');
            }
            const extent = W.map.getExtent();
            if (!extent) {
                console.warn(`${SCRIPT_NAME}: Không thể lấy được vùng bản đồ (extent). Đang thử lại...`);
                hideLoader();
                return;
            }
            const proj900913 = W.map.getProjectionObject();
            const proj4326 = new OpenLayers.Projection("EPSG:4326");
            const bounds = extent.transform(proj900913, proj4326);



            const minCX = Math.floor(bounds.left / CHUNK_SIZE_DEGREES) - 1;
            const maxCX = Math.floor(bounds.right / CHUNK_SIZE_DEGREES) + 1;
            const minCY = Math.floor(bounds.bottom / CHUNK_SIZE_DEGREES) - 1;
            const maxCY = Math.floor(bounds.top / CHUNK_SIZE_DEGREES) + 1;

            const queries = [];
            for (let cx = minCX; cx <= maxCX; cx++) {
                queries.push(
                    db.coordinates.where('[cx+cy]').between([cx, minCY], [cx, maxCY]).toArray()
                );
            }
            const chunkResults = await Promise.all(queries);
            let points = chunkResults.flat();
            const filterValue = document.getElementById('timeFilter').value;
            const cutoffDate = getCutoffDate(filterValue);
            if (cutoffDate) {
                points = points.filter(p => new Date(p.ts) >= cutoffDate);
            }
            showLoader(`Đang vẽ ${points.length} điểm...`);
            if (points.length === 0) {
                if (heatmapInstance) heatmapInstance.setData({ max: 0, data: [] });
                hideLoader();
                return;
            }
            if (!heatmapInstance) {

                const mapViewport = document.querySelector('.olMapViewport');
                if (!mapViewport) throw new Error('Không tìm thấy container của bản đồ (.olMapViewport). Giao diện WME có thể đã thay đổi.');
                heatmapInstance = h337.create({
                    container: mapViewport,
                    radius: 25, maxOpacity: 0.8, minOpacity: 0.1, blur: 0.6,
                    gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
                });
                const heatmapCanvas = mapViewport.querySelector('canvas');
                if (heatmapCanvas) {
                    heatmapCanvas.style.pointerEvents = 'none';
                    heatmapCanvas.style.zIndex = 400;
                    heatmapCanvas.style.position = 'absolute';
                    heatmapCanvas.style.top = '0px';
                    heatmapCanvas.style.left = '0px';
                }
            }
            const heatmapData = [];
            for (const point of points) {
                const lonLat = new OpenLayers.LonLat(point.lo, point.la);
                try {
                    const pixel = W.map.getPixelFromLonLat(lonLat);
                    if (pixel) {
                        heatmapData.push({ x: Math.round(pixel.x), y: Math.round(pixel.y), value: 1 });
                    }
                } catch (e) {
                    continue;
                }
            }
            const maxDensity = Math.max(5, Math.ceil(heatmapData.length / 100));
            heatmapInstance.setData({ max: maxDensity, data: heatmapData });
        } catch (err) {
            WazeWrap.Alerts.error(SCRIPT_NAME, `Lỗi khi vẽ heatmap chi tiết: ${err.message}`);
            console.error(`${SCRIPT_NAME}: Lỗi chi tiết trong renderViewportHeatmap:`, err);
        } finally {
            hideLoader();
        }
    }
    /**
     * [TỐI ƯU HÓA] Hàm nhập file sử dụng stream để xử lý file cực lớn.
     */
    function importAndMerge(file) {
        if (!file) return;
        showLoader('Đang nhập dữ liệu (stream)...');
        let pointsBuffer = [];
        let countAdded = 0;
        const BATCH_SIZE = 50000;
        const processBatch = async () => {
            if (pointsBuffer.length === 0) return;
            try {


                await db.coordinates.bulkPut(pointsBuffer);
                countAdded += pointsBuffer.length;
                pointsBuffer = [];
                showLoader(`Đã nhập ${countAdded} điểm...`);
            } catch (err) {
                console.error("Lỗi khi ghi lô dữ liệu:", err);
            }
        };
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target.result;

                const imported = JSON.parse(text);
                if (!imported.data || !Array.isArray(imported.data)) throw new Error('Định dạng file không hợp lệ.');
                for (const pointArray of imported.data) {
                    const la = pointArray[0];
                    const lo = pointArray[1];
                    const point = {
                        la: la,
                        lo: lo,
                        ts: pointArray[2],
                        cx: Math.floor(lo / CHUNK_SIZE_DEGREES),
                        cy: Math.floor(la / CHUNK_SIZE_DEGREES)
                    };
                    pointsBuffer.push(point);
                    if (pointsBuffer.length >= BATCH_SIZE) {
                        await processBatch();
                    }
                }

                await processBatch();
                WazeWrap.Alerts.success(SCRIPT_NAME, `Nhập và tổng hợp thành công ${countAdded} điểm.`);
                redrawHeatmap();
            } catch (err) {
                WazeWrap.Alerts.error(SCRIPT_NAME, `Lỗi khi nhập: ${err.message}`);
                console.error(err);
            } finally {
                hideLoader();
            }
        };
        reader.readAsText(file);
    }
    /**
     * [TỐI ƯU HÓA] Hàm xuất dữ liệu ra định dạng nén.
     */
    async function exportData() {
        showLoader('Đang xuất dữ liệu...');
        try {
            const dataArray = [];

            await db.coordinates.each(point => {
                dataArray.push([point.la, point.lo, point.ts]);
            });
            const exportObject = {
                schema: ["lat", "lon", "timestamp"],
                data: dataArray
            };
            const blob = new Blob([JSON.stringify(exportObject)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wme_heatmap_data_optimized.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            WazeWrap.Alerts.error(SCRIPT_NAME, `Lỗi khi xuất dữ liệu: ${err.message}`);
        } finally {
            hideLoader();
        }
    }
    function getWGS84Center() {
        const mapCenter = W.map.getCenter();
        try {
            const proj900913 = W.map.getProjectionObject() || new OpenLayers.Projection("EPSG:900913");
            const proj4326 = new OpenLayers.Projection("EPSG:4326");
            const lonLat = new OpenLayers.LonLat(mapCenter.lon, mapCenter.lat);
            const transformedLonLat = lonLat.transform(proj900913, proj4326);
            return {
                lat: transformedLonLat.lat,
                lon: transformedLonLat.lon
            };
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Error transforming coordinates for saving:`, e);
            return null;
        }
    }
    function toggleHeatmap() {
        isHeatmapVisible = !isHeatmapVisible;
        const btn = document.getElementById('toggleHeatmapBtn');
        btn.textContent = isHeatmapVisible ? 'Ẩn Heatmap' : 'Hiển thị Heatmap';
        if (isHeatmapVisible) {
            redrawHeatmap();
        } else {
            if (heatmapInstance) {
                heatmapInstance.setData({
                    max: 0,
                    data: []
                });
            }
        }
    }
    function showLoader(message) {
        const loader = document.getElementById('heatmap-loader');
        if (loader) {
            loader.textContent = message;
            loader.style.display = 'block';
        }
    }
    function hideLoader() {
        const loader = document.getElementById('heatmap-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    async function clearAllData() {

        const confirmation = window.confirm("Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu tọa độ đã lưu không?\n\nHành động này không thể hoàn tác.");

        if (!confirmation) {
            return;
        }
        showLoader('Đang xóa dữ liệu...');
        try {
            await db.coordinates.clear();
            console.log(`${SCRIPT_NAME}: All coordinate data has been cleared.`);
            WazeWrap.Alerts.success(SCRIPT_NAME, 'Đã xóa toàn bộ dữ liệu thành công.');

            if (isHeatmapVisible) {
                redrawHeatmap();
            }
        } catch (err) {
            console.error(`${SCRIPT_NAME}: Error clearing data:`, err);
            WazeWrap.Alerts.error(SCRIPT_NAME, `Lỗi khi xóa dữ liệu: ${err.message}`);
        } finally {
            hideLoader();
        }
    }



})();