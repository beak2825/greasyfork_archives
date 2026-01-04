// ==UserScript==
// @name         GeoGuessr Chinese Maps + Satellite/Terrain/Roads (v9.3 Ultimate)
// @name:zh-CN   GeoGuessr 中文地图 + 卫星/地形/边界增强
// @namespace    http://tampermonkey.net/
// @version      9.3
// @description  Force Chinese Maps. Default to Terrain. Press 'B' to cycle. Handles multiple map instances correctly.
// @description:zh-CN  强制中文地图。默认地形图。按 'B' 键循环切换。
// @author       Your Name
// @match        *://*.geoguessr.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560759/GeoGuessr%20Chinese%20Maps%20%2B%20SatelliteTerrainRoads%20%28v93%20Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560759/GeoGuessr%20Chinese%20Maps%20%2B%20SatelliteTerrainRoads%20%28v93%20Ultimate%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ 1. 配置与样式 ============
    const CONFIG = {
        language: 'zh-CN',
        toggleKey: 'b'
    };

    const STYLE_CLEAN = [];
    const STYLE_ENHANCED = [
        { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ff0000" }, { "weight": 2 }] },
        { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ff0000" }, { "weight": 2.5 }] },
        { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#b00000" }, { "weight": 3 }] },
        // Disable Road Styles
        // { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#666666" }, { "weight": 1 }] },
        // { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffaa00" }, { "weight": 2 }] },
        // { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "weight": 1.5 }] },
        { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }
    ];

    const MODES = [
        { name: 'Original',  type: 'roadmap', styles: STYLE_CLEAN },
        { name: 'Enhanced',  type: 'roadmap', styles: STYLE_ENHANCED },
        { name: 'Terrain',   type: 'terrain', styles: STYLE_CLEAN },
        { name: 'Satellite', type: 'hybrid',  styles: STYLE_CLEAN },
    ];

    let currentModeIndex = 0;
    const mapInstances = new Set();

    // ============ 2. URL 拦截 (强制中文) ============
    try {
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
        if (originalSrcDescriptor) {
            Object.defineProperty(HTMLScriptElement.prototype, 'src', {
                get() { return originalSrcDescriptor.get.call(this); },
                set(value) {
                    if (typeof value === 'string' && value.includes('maps.googleapis.com/maps/api/js')) {
                        try {
                            const url = new URL(value);
                            if (url.searchParams.get('language') !== CONFIG.language) {
                                url.searchParams.set('language', CONFIG.language);
                            }
                            if (url.searchParams.has('region')) url.searchParams.delete('region');
                            value = url.toString();
                        } catch (e) {}
                    }
                    originalSrcDescriptor.set.call(this, value);
                },
                configurable: true
            });
        }
    } catch (e) { console.warn('[GeoMod] URL Hook Error', e); }

    // ============ 3. 注入逻辑 (轮询等待) ============

    function applyModeToMap(map, mode) {
        try {
            // 移除 mapId 让 styles 生效
            // 设为 RASTER (光栅) 模式
            map.setOptions({
                mapId: null,
                mapTypeId: mode.type,
                styles: mode.styles,
                renderingType: 'RASTER'
            });
        } catch (e) { }
    }

    function injectMapHooks() {
        if (!window.google || !window.google.maps || !window.google.maps.Map) return;
        if (window.google.maps.Map._isHooked) return; // 防止重复注入

        console.log('[GeoMod] Google Maps API found. Injecting hooks...');

        const OriginalMap = window.google.maps.Map;

        // 覆盖构造函数
        window.google.maps.Map = function(node, opts) {
            if (opts) {
                delete opts.mapId;
                opts.renderingType = 'RASTER';
                const mode = MODES[currentModeIndex];
                opts.mapTypeId = mode.type;
                opts.styles = mode.styles;
            }

            const mapInstance = new OriginalMap(node, opts);
            mapInstances.add(mapInstance);
            console.log('[GeoMod] Captured a new map instance. Total:', mapInstances.size);

            // 劫持 setOptions，防止游戏反向修改
            const originalSetOptions = mapInstance.setOptions;
            mapInstance.setOptions = function(options) {
                if (options) {
                    // 只要游戏尝试设置选项，我们就再次强制移除 mapId 并应用当前样式
                    if (options.mapId) delete options.mapId;
                    const mode = MODES[currentModeIndex];
                    options.styles = mode.styles;
                }
                return originalSetOptions.call(this, options);
            };

            return mapInstance;
        };

        window.google.maps.Map.prototype = OriginalMap.prototype;
        Object.assign(window.google.maps.Map, OriginalMap);
        window.google.maps.Map._isHooked = true;
        if (initTimer) clearInterval(initTimer);
    }
    const initTimer = setInterval(injectMapHooks, 50);


    // ============ 4. 切换逻辑 ============
    function cycleMapMode() {
        for (let map of mapInstances) {
            try {
                const div = map.getDiv();
                if (!document.body.contains(div)) {
                    mapInstances.delete(map);
                }
            } catch (e) {
                mapInstances.delete(map);
            }
        }

        if (mapInstances.size === 0) {
            showToast('未检测到活动地图 (请进入游戏)');
            return;
        }

        currentModeIndex = (currentModeIndex + 1) % MODES.length;
        const mode = MODES[currentModeIndex];
        // 对所有活着的地图应用新模式
        let successCount = 0;
        for (let map of mapInstances) {
            applyModeToMap(map, mode);
            successCount++;
        }

        showToast(`${mode.name} (已应用到 ${successCount} 个地图)`);
    }

    // ============ 5. UI 提示 ============
    function showToast(text) {
        let toast = document.getElementById('geo-mod-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'geo-mod-toast';
            toast.style.cssText = 'position:fixed; bottom:80px; left:20px; background:rgba(0,0,0,0.8); color:#fff; padding:8px 12px; border-radius:4px; z-index:99999; font-size:14px; pointer-events:none; transition: opacity 0.3s; font-family: sans-serif; font-weight: bold;';
            document.body.appendChild(toast);
        }

        const mapNames = {
            'Terrain': '地形图 (Terrain)',
            'Satellite': '卫星图 (Satellite)',
            'Original': '原版地图 (Original)',
            'Enhanced': '增强地图 (红线)'
        };

        toast.textContent = mapNames[text] || text;
        toast.style.opacity = '1';

        if (toast.timer) clearTimeout(toast.timer);
        toast.timer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
    }

    // ============ 6. 事件监听 ============
    window.addEventListener('keydown', (e) => {
        // 排除打字情况
        if (['INPUT', 'TEXTAREA', 'DIV'].includes(e.target.tagName) && e.target.isContentEditable) return;

        if (e.key.toLowerCase() === CONFIG.toggleKey.toLowerCase()) {
            cycleMapMode();
        }
    });
})();