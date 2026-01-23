// ==UserScript==
// @name         Abdullah Abbas WME Explorer
// @namespace    https://greasyfork.org/users/AbdullahAbbas
// @version      2026.01.23.04
// @description  WME Script: Cities, Places, Locks, Speed, and Editors Analysis
// @author       Abdullah Abbas
// @copyright    2026, Abdullah Abbas (https://greasyfork.org/users/AbdullahAbbas)
// @license      All Rights Reserved. No copying or modification allowed without permission.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563659/Abdullah%20Abbas%20WME%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/563659/Abdullah%20Abbas%20WME%20Explorer.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2026 Abdullah Abbas
 *
 * This script is the intellectual property of Abdullah Abbas.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without explicit permission from the author.
 *
 * All Rights Reserved.
 */

/* global W, WazeWrap, OpenLayers, $ */

(function() {
    'use strict';

    const STORAGE_KEY = 'aa_explorer_settings_2026_v04';
    let lockLayer = null;
    let speedLayer = null;

    // --- Translations ---
    const TRANSLATIONS = {
        'ar': {
            title: 'مستكشف عبد الله عباس',
            btn_main: 'Abdullah Abbas WME Explorer',
            tab_cities: 'المدن',
            tab_places: 'الأماكن',
            tab_locks: 'الأقفال',
            tab_speed: 'السرعة',
            tab_editors: 'المحررين',
            btn_scan: 'فحص',
            btn_reset: 'مسح',
            filter_lock: 'تصفية حسب القفل',
            filter_speed: 'تصفية حسب السرعة',
            col_name: 'الاسم',
            col_count: 'العدد',
            col_seg: 'شوارع',
            col_place: 'أماكن',
            msg_ready: 'جاهز',
            msg_scanning: 'جاري الفحص...',
            msg_no_data: 'لا توجد بيانات في المنطقة المحملة',
            msg_click_scan: 'اضغط "فحص" للبدء',
            msg_results: 'النتائج:',
            res_level: 'مستوى',
            res_speed: 'سرعة',
            res_no_speed: 'بدون سرعة'
        },
        'ckb': {
            title: 'پشکنەری عەبدوڵڵا عەباس',
            btn_main: 'Abdullah Abbas WME Explorer',
            tab_cities: 'شارەکان',
            tab_places: 'شوێنەکان',
            tab_locks: 'قفڵەکان',
            tab_speed: 'خێرایی',
            tab_editors: 'ئیدیتۆرەکان',
            btn_scan: 'پشکنین',
            btn_reset: 'سڕینەوە',
            filter_lock: 'پاڵاوتن بەپێی قفڵ',
            filter_speed: 'پاڵاوتن بەپێی خێرایی',
            col_name: 'ناو',
            col_count: 'ژمارە',
            col_seg: 'شەقام',
            col_place: 'شوێن',
            msg_ready: 'ئامادەیە',
            msg_scanning: 'جارێ پشکنین...',
            msg_no_data: 'هیچ داتایەک نییە',
            msg_click_scan: 'داگرە "پشکنین" بۆ دەستپێکردن',
            msg_results: 'ئەنجامەکان:',
            res_level: 'ئاستی',
            res_speed: 'خێرایی',
            res_no_speed: 'بێ خێرایی'
        },
        'kmr': {
            title: 'Lêgerîna Abdullah Abbas',
            btn_main: 'Abdullah Abbas WME Explorer',
            tab_cities: 'Bajar',
            tab_places: 'Cih',
            tab_locks: 'Qefle',
            tab_speed: 'Lez',
            tab_editors: 'Edîtor',
            btn_scan: 'Kontrol',
            btn_reset: 'Paqij bike',
            filter_lock: 'Li gorî qeflê fîlter bike',
            filter_speed: 'Li gorî lezê fîlter bike',
            col_name: 'Nav',
            col_count: 'Hejmar',
            col_seg: 'Kûçe',
            col_place: 'Cih',
            msg_ready: 'Amade ye',
            msg_scanning: 'Tê kontrolkirin...',
            msg_no_data: 'Dattaye tune',
            msg_click_scan: 'Ji bo destpêkirinê "Kontrol" bikirtînin',
            msg_results: 'Encam:',
            res_level: 'Asta',
            res_speed: 'Leza',
            res_no_speed: 'Bê lez'
        },
        'en': {
            title: 'Abdullah Abbas Explorer',
            btn_main: 'Abdullah Abbas WME Explorer',
            tab_cities: 'Cities',
            tab_places: 'Places',
            tab_locks: 'Locks',
            tab_speed: 'Speed',
            tab_editors: 'Editors',
            btn_scan: 'Check',
            btn_reset: 'Clear',
            filter_lock: 'Filter by Lock Level',
            filter_speed: 'Filter by Speed Limit',
            col_name: 'Name',
            col_count: 'Count',
            col_seg: 'Segs',
            col_place: 'Places',
            msg_ready: 'Ready',
            msg_scanning: 'Scanning...',
            msg_no_data: 'No data found in loaded area',
            msg_click_scan: 'Click "Check" to start',
            msg_results: 'Results:',
            res_level: 'Level',
            res_speed: 'Speed',
            res_no_speed: 'No Speed'
        }
    };

    // Colors
    const LOCK_COLORS = {
        1: '#808080', 2: '#FFD700', 3: '#00FF00',
        4: '#0000FF', 5: '#C71585', 6: '#FF0000'
    };

    const SPEED_COLORS = {
        '0-40': '#00C853',
        '41-60': '#C6FF00',
        '61-80': '#FFEA00',
        '81-100': '#FF9800',
        '101-120': '#FF5722',
        '121-140': '#F44336',
        '140+': '#B71C1C'
    };

    let appState = {
        mode: 'cities',
        objectsMap: {}, // format: { Key: [Objects] }
        orientation: 'landscape',
        language: 'en',
        filters: {
            locks: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true},
            speed: {'0-40':true, '41-60':true, '61-80':true, '81-100':true, '101-120':true, '121-140':true, '140+':true}
        }
    };

    function bootstrap(tries = 1) {
        if (W && W.map && W.model && $ && WazeWrap) {
            init();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries + 1), 200);
        }
    }

    bootstrap();

    function init() {
        console.log("Abdullah Abbas WME Explorer v2026.01.23.04 Initialized.");

        createPanel();
        startSidebarObserver();
        setTimeout(initLayers, 2000);

        // Sidebar Button Event
        $(document).on('click', '#aa-launch-btn-ww', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePanel();
        });

        // Language Selector Event
        $(document).on('change', '#aa-language-select', function(e) {
            appState.language = $(this).val();
            saveSettings();
            updateUIText();
            renderTableHeader();
        });

        // Prevent Drag on Select
        $(document).on('mousedown', '#aa-language-select', function(e) {
            e.stopPropagation();
        });

        $(document).keydown(function(e) {
            if (e.shiftKey && e.key.toLowerCase() === 'f') {
                togglePanel();
            }
        });
    }

    // --- Strict Visibility Check (Only used for Drawing Layers now, NOT Analysis) ---
    function isVisible(geometry) {
        if (!geometry) return false;
        return W.map.getExtent().intersectsBounds(geometry.getBounds());
    }

    // --- Helper: Get Text ---
    function t(key) {
        const lang = appState.language || 'en';
        return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
    }

    function updateUIText() {
        $('#aa-header-title').text(t('title'));
        $('#aa-tab-cities').text(t('tab_cities'));
        $('#aa-tab-places').text(t('tab_places'));
        $('#aa-tab-locks').text(t('tab_locks'));
        $('#aa-tab-speed').text(t('tab_speed'));
        $('#aa-tab-editors').text(t('tab_editors'));

        $('#aa-btn-scan').text(t('btn_scan'));
        $('#aa-btn-reset').text(t('btn_reset'));
        $('#aa-filter-lock-title').text(t('filter_lock'));
        $('#aa-filter-speed-title').text(t('filter_speed'));
        $('#aa-status').text(`${t('msg_ready')} - v2026.01.23.04`);

        if ($('#aa-tbody').children().length === 0) {
            $('#aa-empty-msg').text(t('msg_click_scan'));
        }

        // تحديث نص الزر
        $('#aa-launch-btn-ww').text(t('btn_main'));
    }

    // --- Layers ---
    function initLayers() {
        if (!W.map) return;
        if (lockLayer) { try { W.map.removeLayer(lockLayer); } catch(e){} }
        if (speedLayer) { try { W.map.removeLayer(speedLayer); } catch(e){} }

        lockLayer = new OpenLayers.Layer.Vector("AA_Locks_Layer", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    label: "${rank}",
                    fontColor: "${textColor}",
                    fontSize: "12px",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    pointRadius: 10,
                    fillColor: "${fillColor}",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWidth: 2,
                    labelYOffset: 0
                })
            })
        });

        speedLayer = new OpenLayers.Layer.Vector("AA_Speed_Layer", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    label: "${speed}",
                    fontColor: "black",
                    fontSize: "10px",
                    fontWeight: "bold",
                    fontFamily: "Tahoma",
                    pointRadius: 13,
                    fillColor: "${fillColor}",
                    strokeColor: "white",
                    strokeWidth: 2,
                    labelYOffset: 0
                })
            })
        });

        W.map.addLayer(lockLayer);
        W.map.addLayer(speedLayer);

        // Layers transparent to clicks
        $(lockLayer.div).css("pointer-events", "none");
        $(speedLayer.div).css("pointer-events", "none");

        lockLayer.setZIndex(9998);
        speedLayer.setZIndex(9999);
    }

    // --- Sidebar Button: Stable Placement Logic ---
    function startSidebarObserver() {
        tryAddButton();
        const observer = new MutationObserver(() => {
            if (document.getElementById('aa-wazewrap-btn-container') === null) {
                tryAddButton();
            }
        });
        const sidebar = document.getElementById('sidebar');
        const userInfo = document.getElementById('user-info');
        if (sidebar) observer.observe(sidebar, { childList: true, subtree: true });
        if (userInfo) observer.observe(userInfo, { childList: true, subtree: true });
    }

    function tryAddButton() {
        if (document.getElementById('aa-wazewrap-btn-container')) return;
        // الاستراتيجية المستقرة: الأولوية للوحة WazeWrap، والبديل هو معلومات المستخدم
        let target = $('#sidepanel-wazewrap');
        if (target.length === 0) {
            target = $('#user-info .tab-content');
        }
        if (target.length > 0) {
            addButtonToContainer(target);
        }
    }

    function addButtonToContainer(container) {
        if (document.getElementById('aa-wazewrap-btn-container')) return;

        // تصميم الزر الجديد: زر واحد فقط بدون نصوص إضافية
        const btnHtml = `
            <div id="aa-wazewrap-btn-container" style="margin: 10px 0; padding: 5px; text-align: center; width: 100%; box-sizing: border-box; clear: both;">
                <button id="aa-launch-btn-ww" class="btn btn-primary" style="width: 100%; cursor: pointer; font-weight: bold; font-family: 'Segoe UI', Tahoma, sans-serif;">${t('btn_main')}</button>
            </div>`;
        container.prepend(btnHtml);
    }

    // --- Panel UI ---
    function createPanel() {
        if ($("#aa-panel").length > 0) return;

        const settings = loadSettings();
        appState.orientation = settings.orientation || 'landscape';
        appState.language = settings.language || 'en';

        const html = `
            <div id="aa-panel" style="
                display: none; position: fixed; top: ${settings.top}; left: ${settings.left};
                width: ${settings.width}; height: ${settings.height}; z-index: 10001;
                background: #fdfdfd; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; resize: both; overflow: hidden;
                min-width: 350px; min-height: 400px; flex-direction: column; border: 1px solid #ccc;
                transition: width 0.3s, height 0.3s;
            ">
                <div style="background:#222; color:#888; font-size:9px; text-align:center; padding:3px; font-family:sans-serif; letter-spacing:0.5px; border-radius: 8px 8px 0 0;">
                    © 2026 Abdullah Abbas - All Rights Reserved
                </div>

                <div id="aa-header" style="cursor: move; background: #333; color: white; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div id="aa-header-title" style="font-weight: bold; font-size: 13px;">${t('title')}</div>

                    <div style="display: flex; gap: 8px; align-items: center;">
                        <select id="aa-language-select" style="cursor:pointer; font-size: 10px; padding: 1px; background: #444; color: white; border: 1px solid #666; border-radius: 3px;">
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="ckb">کوردی</option>
                            <option value="kmr">Kurdî</option>
                        </select>

                        <button id="aa-btn-rotate" title="Rotate" style="background:none; border:none; color:#fff; cursor:pointer; font-size:16px;">⟳</button>
                        <button id="aa-btn-close" style="background:none; border:none; color:#ffdddd; cursor:pointer; font-weight:bold;">X</button>
                    </div>
                </div>

                <div style="display: flex; background: #eee; border-bottom: 1px solid #ccc; overflow-x: auto;">
                    <button id="aa-tab-cities" class="aa-tab active" data-tab="cities" style="${tabStyle(true)}">${t('tab_cities')}</button>
                    <button id="aa-tab-places" class="aa-tab" data-tab="places" style="${tabStyle(false)}">${t('tab_places')}</button>
                    <button id="aa-tab-locks" class="aa-tab" data-tab="locks" style="${tabStyle(false)}">${t('tab_locks')}</button>
                    <button id="aa-tab-speed" class="aa-tab" data-tab="speed" style="${tabStyle(false)}">${t('tab_speed')}</button>
                    <button id="aa-tab-editors" class="aa-tab" data-tab="editors" style="${tabStyle(false)}">${t('tab_editors')}</button>
                </div>

                <div id="aa-settings-area" style="padding: 10px; background: #fff; border-bottom: 1px solid #eee; display:none;">
                    <div id="aa-settings-locks" style="display:none; width:100%; flex-direction:column;">
                        <div id="aa-filter-lock-title" style="font-weight:bold; margin-bottom:8px; font-size:12px; color:#555; text-align:center;">${t('filter_lock')}</div>
                        <div style="display:flex; gap:5px; justify-content:space-between; width:100%;">
                            ${createLockCheckboxes()}
                        </div>
                    </div>
                    <div id="aa-settings-speed" style="display:none; width:100%; flex-direction:column;">
                        <div id="aa-filter-speed-title" style="font-weight:bold; margin-bottom:8px; font-size:12px; color:#555; text-align:center;">${t('filter_speed')}</div>
                        <div style="display:flex; gap:5px; justify-content:space-between; width:100%;">
                            ${createSpeedCheckboxes()}
                        </div>
                    </div>
                </div>

                <div style="padding: 10px; display: flex; gap: 10px; background: #f9f9f9;">
                    <button id="aa-btn-reset" style="flex: 1; background-color: #e74c3c; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight:bold;">${t('btn_reset')}</button>
                    <button id="aa-btn-scan" style="flex: 1; background-color: #26b85d; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight:bold;">${t('btn_scan')}</button>
                </div>

                <div style="flex-grow: 1; overflow-y: auto; position: relative; background: #fff;">
                    <table style="width: 100%; border-collapse: collapse; direction: rtl;">
                        <thead id="aa-thead" style="position: sticky; top: 0; background: #f4f4f4; z-index: 2; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            </thead>
                        <tbody id="aa-tbody"></tbody>
                    </table>
                    <div id="aa-empty-msg" style="text-align: center; padding: 20px; color: #999;">${t('msg_click_scan')}</div>
                </div>
                <div id="aa-status" style="padding: 5px; text-align: center; font-size: 11px; color: #777; background: #eee; border-top: 1px solid #ddd;">${t('msg_ready')} - v2026.01.23.04</div>
            </div>`;

        $('body').append(html);

        $('#aa-language-select').val(appState.language);
        renderTableHeader();

        $('#aa-btn-close').click(() => $('#aa-panel').hide());
        $('#aa-btn-rotate').click(rotateWindow);
        $('#aa-btn-scan').click(runAnalysis);
        $('#aa-btn-reset').click(clearData);

        $('.aa-tab').click(function() {
            activateTab($(this).data('tab'));
            clearData();
        });

        $('.aa-lock-cb').change(function() {
            appState.filters.locks[$(this).val()] = $(this).is(':checked');
        });
        $('.aa-speed-cb').change(function() {
            appState.filters.speed[$(this).val()] = $(this).is(':checked');
        });

        makeDraggable(document.getElementById("aa-panel"));
        $('#aa-panel').on('mouseup', saveSettings);

        activateTab('cities');
    }

    function renderTableHeader() {
        const thead = $('#aa-thead');
        thead.empty();

        let html = '';
        if (appState.mode === 'editors') {
            html = `
                <tr style="font-size: 12px; color: #555;">
                    <th style="padding: 8px; text-align: right;">${t('col_name')}</th>
                    <th style="padding: 8px; text-align: center; width: 50px;">${t('col_seg')}</th>
                    <th style="padding: 8px; text-align: center; width: 50px;">${t('col_place')}</th>
                </tr>
            `;
        } else {
            html = `
                <tr style="font-size: 12px; color: #555;">
                    <th style="padding: 8px; text-align: right;">${getHeaderName()}</th>
                    <th style="padding: 8px; text-align: left; width: 60px;">${t('col_count')}</th>
                </tr>
            `;
        }
        thead.html(html);
    }

    function createLockCheckboxes() {
        let html = '';
        for (let i = 1; i <= 6; i++) {
            let color = LOCK_COLORS[i];
            let textColor = (i === 2 || i === 3) ? 'black' : 'white';
            html += `
                <label style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f0f0f0; padding:4px 2px; border-radius:4px; border:1px solid #ddd; min-width:30px;">
                    <span style="background:${color}; color:${textColor}; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:11px; margin-bottom:3px; width:80%; text-align:center;">${i}</span>
                    <input type="checkbox" class="aa-lock-cb" value="${i}" checked style="margin:0;">
                </label>
            `;
        }
        return html;
    }

    function createSpeedCheckboxes() {
        let html = '';
        const ranges = ['0-40', '41-60', '61-80', '81-100', '101-120', '121-140', '140+'];
        ranges.forEach(rng => {
            let color = SPEED_COLORS[rng];
            let textColor = (rng === '61-80' || rng === '81-100') ? 'black' : 'white';
            html += `
                <label style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f0f0f0; padding:4px 2px; border-radius:4px; border:1px solid #ddd; min-width:35px;">
                    <span style="background:${color}; color:${textColor}; padding:1px 0; border-radius:3px; font-weight:bold; font-size:10px; margin-bottom:3px; width:90%; text-align:center; white-space:nowrap; overflow:hidden;">${rng}</span>
                    <input type="checkbox" class="aa-speed-cb" value="${rng}" checked style="margin:0;">
                </label>
            `;
        });
        return html;
    }

    function togglePanel() {
        if ($("#aa-panel").length === 0) createPanel();
        const panel = $('#aa-panel');
        if (panel.is(":visible")) {
            panel.hide();
        } else {
            panel.show();
            const settings = loadSettings();
            panel.css({ top: settings.top, left: settings.left, width: settings.width, height: settings.height });
            appState.orientation = settings.orientation || 'landscape';
        }
    }

    function getHeaderName() {
        if (appState.mode === 'cities' || appState.mode === 'places') return t('col_name');
        if (appState.mode === 'locks') return t('res_level');
        if (appState.mode === 'speed') return t('res_speed');
        if (appState.mode === 'editors') return t('col_name');
        return t('col_name');
    }

    function activateTab(tabName) {
        appState.mode = tabName;
        $('.aa-tab').css('background', '#eee').css('border-bottom', '1px solid #ccc').css('font-weight', 'normal');
        $(`.aa-tab[data-tab="${tabName}"]`).css('background', 'white').css('border-bottom', '2px solid #5989de').css('font-weight', 'bold');

        $('#aa-settings-locks').css('display', 'none');
        $('#aa-settings-speed').css('display', 'none');
        $('#aa-settings-area').css('display', 'none');

        if (tabName === 'locks') {
            $('#aa-settings-area').css('display', 'block');
            $('#aa-settings-locks').css('display', 'flex');
        }
        if (tabName === 'speed') {
            $('#aa-settings-area').css('display', 'block');
            $('#aa-settings-speed').css('display', 'flex');
        }

        renderTableHeader();
    }

    function rotateWindow() {
        const panel = $('#aa-panel');
        if (appState.orientation === 'landscape') {
            appState.orientation = 'portrait';
            panel.css({ width: '320px', height: '440px' });
        } else {
            appState.orientation = 'landscape';
            panel.css({ width: '550px', height: '350px' });
        }
        saveSettings();
    }

    function tabStyle(isActive) {
        return `flex: 1; padding: 8px; border: none; background: ${isActive ? 'white' : '#eee'}; cursor: pointer; border-bottom: ${isActive ? '2px solid #5989de' : '1px solid #ccc'}; font-weight: ${isActive ? 'bold' : 'normal'}; font-family: inherit; outline: none; transition: background 0.2s; font-size: 13px;`;
    }

    // --- Drawing (Keep isVisible check for visuals only) ---
    function drawLocks() {
        if (!lockLayer) initLayers();
        if (!lockLayer) return;
        lockLayer.removeAllFeatures();

        const features = [];
        const styles = {
            1: { fill: LOCK_COLORS[1], text: 'white' },
            2: { fill: LOCK_COLORS[2], text: 'black' },
            3: { fill: LOCK_COLORS[3], text: 'black' },
            4: { fill: LOCK_COLORS[4], text: 'white' },
            5: { fill: LOCK_COLORS[5], text: 'white' },
            6: { fill: LOCK_COLORS[6], text: 'white' }
        };

        const createFeat = (geo, rank) => {
            if (!appState.filters.locks[rank]) return null;
            let style = styles[rank] || { fill: '#000', text: 'white' };
            let center = geo.getCentroid();
            return new OpenLayers.Feature.Vector(center, {
                rank: rank,
                fillColor: style.fill,
                textColor: style.text
            });
        };

        const segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
        segments.forEach(seg => {
            if (!seg || seg.state === 'Delete') return;
            // Draw ONLY visible items
            if (!isVisible(seg.geometry)) return;
            let rank = (seg.attributes.lockRank || 0) + 1;
            let feat = createFeat(seg.geometry, rank);
            if(feat) features.push(feat);
        });

        const venues = W.model.venues.objects ? Object.values(W.model.venues.objects) : [];
        venues.forEach(venue => {
             if (!venue || venue.state === 'Delete') return;
             if (!isVisible(venue.geometry)) return;
            let rank = (venue.attributes.lockRank || 0) + 1;
            let feat = createFeat(venue.geometry, rank);
            if(feat) features.push(feat);
        });

        lockLayer.addFeatures(features);
    }

    function getSpeedRangeKey(speed) {
        if (speed <= 40) return '0-40';
        if (speed <= 60) return '41-60';
        if (speed <= 80) return '61-80';
        if (speed <= 100) return '81-100';
        if (speed <= 120) return '101-120';
        if (speed <= 140) return '121-140';
        return '140+';
    }

    function drawSpeeds() {
        if (!speedLayer) initLayers();
        if (!speedLayer) return;
        speedLayer.removeAllFeatures();

        const features = [];
        const segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];

        segments.forEach(seg => {
            if (!seg || seg.state === 'Delete') return;
            if (!isVisible(seg.geometry)) return;

            let fwd = seg.attributes.fwdMaxSpeed;
            let rev = seg.attributes.revMaxSpeed;
            if (!fwd && !rev) return;

            let labelText = "";
            let maxSpeed = 0;
            if (fwd && rev && fwd === rev) { labelText = fwd + ""; maxSpeed = fwd; }
            else if (fwd && !rev) { labelText = fwd + ""; maxSpeed = fwd; }
            else if (!fwd && rev) { labelText = rev + ""; maxSpeed = rev; }
            else { labelText = `${fwd}\n${rev}`; maxSpeed = Math.max(fwd, rev); }

            if (labelText.trim() === "") return;
            let rangeKey = getSpeedRangeKey(maxSpeed);
            if (!appState.filters.speed[rangeKey]) return;

            let color = SPEED_COLORS[rangeKey];
            let center = seg.geometry.getCentroid();
            features.push(new OpenLayers.Feature.Vector(center, { speed: labelText, fillColor: color }));
        });
        speedLayer.addFeatures(features);
    }

    // --- Helpers for Editors Mode (Adopted from v7.0) ---
    function getUsername(obj, userId) {
        if (obj && obj.getAttribute) {
            let name = obj.getAttribute('userName');
            if (name) return name;
        }
        if (obj && obj.userName) return obj.userName;

        if (userId) {
            // Try W.model.users
            if (W.model.users.objects && W.model.users.objects[userId]) {
                let u = W.model.users.objects[userId];
                if (u.userName) return u.userName;
                if (u.getAttribute) return u.getAttribute('userName');
            }
             // Try getObjectById
            if (W.model.users.getObjectById) {
                 let u = W.model.users.getObjectById(userId);
                 if (u && u.userName) return u.userName;
            }
        }
        return null;
    }

    // --- Analysis (The Engine) ---

    function runAnalysis() {
        $('#aa-tbody').empty();
        $('#aa-empty-msg').show().text(t('msg_scanning'));

        if (lockLayer) lockLayer.removeAllFeatures();
        if (speedLayer) speedLayer.removeAllFeatures();

        setTimeout(() => {
            appState.objectsMap = {};
            let totalCount = 0;

            // --- Method from v7.0: Get ALL loaded objects, ignore isVisible() check ---
            let segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
            let venues = W.model.venues.objects ? Object.values(W.model.venues.objects) : [];

            if (appState.mode === 'cities') {
                segments.forEach(obj => {
                     if (!obj || obj.state === 'Delete') return;
                     let addr = obj.getAddress();
                     let name = (addr && !addr.isEmpty() && addr.getCity()) ? addr.getCity().attributes.name : "No City";
                     addToMap(name, obj);
                     totalCount++;
                });
            } else if (appState.mode === 'places') {
                venues.forEach(obj => {
                     if (!obj || obj.state === 'Delete') return;
                     let addr = obj.getAddress();
                     let name = (addr && !addr.isEmpty() && addr.getCity()) ? addr.getCity().attributes.name : "No City";
                     addToMap(name, obj);
                     totalCount++;
                });
            } else if (appState.mode === 'locks') {
                drawLocks(); // Only draws visible ones on map
                segments.forEach(obj => {
                    if (!obj || obj.state === 'Delete') return;
                    let rank = (obj.attributes.lockRank || 0) + 1;
                    if (!appState.filters.locks[rank]) return;
                    addToMap(`${t('res_level')} ${rank}`, obj);
                    totalCount++;
                });
            } else if (appState.mode === 'speed') {
                drawSpeeds(); // Only draws visible ones on map
                segments.forEach(obj => {
                    if (!obj || obj.state === 'Delete') return;
                    let fwd = obj.attributes.fwdMaxSpeed;
                    let rev = obj.attributes.revMaxSpeed;
                    if (!fwd && !rev) return;

                    let maxSpeed = 0;
                    if (fwd) maxSpeed = Math.max(maxSpeed, fwd);
                    if (rev) maxSpeed = Math.max(maxSpeed, rev);

                    let rangeKey = getSpeedRangeKey(maxSpeed);
                    if (!appState.filters.speed[rangeKey]) return;

                    addToMap(`${t('res_speed')} ${maxSpeed}`, obj);
                    totalCount++;
                });
            } else if (appState.mode === 'editors') {
                // v7.0 Logic
                segments.forEach(obj => {
                    if (!obj || obj.state === 'Delete') return;
                    let uid = (obj.attributes.updatedBy || obj.attributes.createdBy);
                    let userObj = obj.getUpdatedBy ? obj.getUpdatedBy() : (obj.getCreatedBy ? obj.getCreatedBy() : null);
                    if (uid) {
                        let name = getUsername(userObj, uid);
                        if (name) {
                            addToMap(name, obj);
                            totalCount++;
                        }
                    }
                });
                venues.forEach(obj => {
                    if (!obj || obj.state === 'Delete') return;
                    let uid = (obj.attributes.updatedBy || obj.attributes.createdBy);
                    let userObj = obj.getUpdatedBy ? obj.getUpdatedBy() : (obj.getCreatedBy ? obj.getCreatedBy() : null);
                    if (uid) {
                        let name = getUsername(userObj, uid);
                        if (name) {
                            addToMap(name, obj);
                            totalCount++;
                        }
                    }
                });
            }

            renderResults(totalCount);
        }, 50);
    }

    function addToMap(key, obj) {
        if (!appState.objectsMap[key]) appState.objectsMap[key] = [];
        appState.objectsMap[key].push(obj);
    }

    function renderResults(total) {
        const tbody = $('#aa-tbody');
        tbody.empty();
        $('#aa-empty-msg').hide();

        const keys = Object.keys(appState.objectsMap).sort((a, b) => {
            if (appState.mode === 'locks') return a.localeCompare(b);
            if (appState.mode === 'speed') {
                 let numA = parseInt(a.replace(/\D/g,'')) || 0;
                 let numB = parseInt(b.replace(/\D/g,'')) || 0;
                 return numB - numA;
            }
            return appState.objectsMap[b].length - appState.objectsMap[a].length;
        });

        if (keys.length === 0) {
            $('#aa-empty-msg').show().text(t('msg_no_data'));
            $('#aa-status').text('0');
            return;
        }

        keys.forEach(key => {
            let allObjects = appState.objectsMap[key];
            let row;

            if (appState.mode === 'editors') {
                let segments = allObjects.filter(o => o.type === 'segment');
                let venues = allObjects.filter(o => o.type === 'venue');

                row = $(`
                    <tr class="aa-row" style="border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s;">
                        <td style="padding: 8px; font-size: 13px;">${key}</td>
                        <td class="aa-seg-click" style="padding: 8px; text-align:center;">
                            ${segments.length > 0 ? `<span style="background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">${segments.length}</span>` : '-'}
                        </td>
                        <td class="aa-ven-click" style="padding: 8px; text-align:center;">
                            ${venues.length > 0 ? `<span style="background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">${venues.length}</span>` : '-'}
                        </td>
                    </tr>
                `);

                row.find('.aa-seg-click').data('objects', segments);
                row.find('.aa-ven-click').data('objects', venues);

                row.find('.aa-seg-click').click(function(e) {
                    e.stopPropagation();
                    selectSpecificObjects($(this).data('objects'));
                });
                row.find('.aa-ven-click').click(function(e) {
                    e.stopPropagation();
                    selectSpecificObjects($(this).data('objects'));
                });

            } else {
                let count = allObjects.length;
                row = $(`
                    <tr class="aa-row" style="border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s;">
                        <td style="padding: 8px; font-size: 13px;">${key}</td>
                        <td style="padding: 8px; color: #5989de; font-weight: bold; direction: ltr;">${count}</td>
                    </tr>
                `);
            }

            row.data('key', key);
            tbody.append(row);
        });

        tbody.on('click', '.aa-row', function() {
            $('.aa-row').css('background', 'transparent');
            $(this).css('background', '#e6f7ff');
            selectObjects($(this).data('key'));
        });

        $('#aa-status').text(`${t('msg_results')} ${total}`);
    }

    function selectSpecificObjects(objects) {
        if (!objects || objects.length === 0) return;
        try {
            W.selectionManager.unselectAll();
            W.selectionManager.setSelectedModels(objects);
            centerOnObjects(objects);
        } catch(e) { console.error(e); }
    }

    function selectObjects(key) {
        const objects = appState.objectsMap[key];
        if (!objects || objects.length === 0) return;
        try {
            W.selectionManager.unselectAll();
            W.selectionManager.setSelectedModels(objects);
            centerOnObjects(objects);
        } catch (e) { console.error("AA Explorer Error:", e); }
    }

    // --- UPDATED: Center without changing zoom ---
    function centerOnObjects(objects) {
        let bounds = new OpenLayers.Bounds();
        let hasGeometry = false;
        objects.forEach(obj => {
            if (obj.geometry) {
                bounds.extend(obj.geometry.getBounds());
                hasGeometry = true;
            }
        });

        // Changed logic: Use setCenter instead of zoomToExtent
        if (hasGeometry && W.map) {
            let centerLonLat = bounds.getCenterLonLat();
            W.map.setCenter(centerLonLat);
        }
    }

    function clearData() {
        $('#aa-tbody').empty();
        $('#aa-empty-msg').text(t('msg_ready'));
        $('#aa-status').text(t('msg_ready'));
        appState.objectsMap = {};
        try { W.selectionManager.unselectAll(); } catch(e) {}
        if (lockLayer) lockLayer.removeAllFeatures();
        if (speedLayer) speedLayer.removeAllFeatures();
    }

    function loadSettings() {
        const defaultSettings = { top: '80px', left: '80px', width: '550px', height: '350px', orientation: 'landscape', language: 'en' };
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultSettings;
        } catch (e) { return defaultSettings; }
    }

    function saveSettings() {
        const panel = $('#aa-panel');
        if (panel.length === 0) return;
        const settings = {
            top: panel.css('top'), left: panel.css('left'),
            width: panel.css('width'), height: panel.css('height'),
            orientation: appState.orientation,
            language: appState.language
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("aa-header");
        if (header) header.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return; // Exclude Select
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            saveSettings();
        }
    }

})();