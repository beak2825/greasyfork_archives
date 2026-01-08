// ==UserScript==
// @name                Abdullah Abbas WME Tools
// @namespace           https://greasyfork.org/users/abdullah-abbas
// @description         Stable WME Suite: Fixed GMaps Link + Grid Integration (V1.39)
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @version             2026.01.08.06
// @grant               none
// @author              Abdullah Abbas
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.meta.js
// ==/UserScript==

/*
 * Abdullah Abbas WME Tools
 * Version: 2026.01.08.06
 * - Fixed: Broken Google Maps URL logic (Now converts coords correctly).
 * - UI Change: Moved GMaps button INTO the grid, immediately after "Jagged/Distorted".
 * - Localization: Renamed button to Arabic per request.
 */

(function() {
    'use strict';

    // ===========================================================================
    //  GLOBAL CONFIGURATION
    // ===========================================================================
    const SCRIPT_NAME = "Abdullah Abbas WME Tools";
    const SCRIPT_VERSION = "2026.01.08.06";
    const DEFAULT_W = "340px";
    const DEFAULT_H = "480px";

    const STRINGS = {
        'ar-IQ': {
            main_title: 'أدوات عبدالله عباس',
            btn_city: 'مستكشف المدن', btn_places: 'مستكشف الأماكن',
            btn_editors: 'مستكشف المحررين', btn_ra: 'تعديل الدوار', btn_lock: 'مؤشر القفل',
            btn_qa: 'مدقق الخريطة',
            btn_speed: 'مؤشر السرعة',
            win_city: 'مستكشف المدن', win_places: 'مستكشف الأماكن',
            win_editors: 'مستكشف المحررين', win_ra: 'تعديل الدوار', win_lock: 'مؤشر القفل',
            win_speed: 'مؤشر السرعة',
            common_scan: 'بحث', common_clear: 'مسح', common_close: 'إغلاق', common_ready: 'جاهز للتعديل',
            ph_city: 'اسم المدينة...', ph_place: 'اسم المكان...', ph_user: 'اسم المحرر...',
            lbl_days: 'عدد الأيام (0 = الكل)', lbl_enable: 'تفعيل',
            ra_in: 'تصغير (-)', ra_out: 'تكبير (+)', ra_err: 'حدد دوار لتفعيله', unit_m: 'م',
            city_no_name: 'بدون مدينة', no_results: 'لا توجد نتائج',

            // Validator Strings
            qa_title: 'مدقق الخريطة',
            qa_btn_scan: '🔍 فحص المنطقة', qa_btn_clear: 'مسح النتائج',
            qa_btn_gmaps: 'فتح في خرائط جوجل 🌏', // Arabic name as requested
            qa_lbl_short: 'قطاع قصير', qa_lbl_angle: 'زوايا حادة', qa_lbl_cross: 'بلا عقدة',
            qa_lbl_lock: 'أقفال', qa_lbl_ghost: 'مدن فارغة', qa_lbl_speed: 'سرعة',
            qa_lbl_discon: 'غير متصل', qa_lbl_jagged: 'تشوهات',
            qa_opt_exclude_rab: 'تجاهل الدوارات',
            qa_lbl_discon_mode: 'نوع عدم الاتصال:',
            qa_opt_discon_1w: 'جهة واحدة', qa_opt_discon_2w: 'جهتين (عائم)',
            qa_lbl_limit_dist: 'حد المسافة', qa_lbl_limit_angle: 'حد الزاوية',
            qa_unit_m: 'متر', qa_unit_i: 'ميل',
            qa_msg_scanning: 'جاري الفحص...', qa_msg_no_segments: '⚠️ المنطقة واسعة! يرجى التقريب.',
            qa_msg_clean: '✅ سليم (لم يتم العثور على أخطاء)', qa_msg_found: 'تم كشف', qa_msg_ready: 'جاهز'
        },
        'ckb-IQ': {
            main_title: 'Abdullah Abbas WME Tools',
            btn_city: 'پشکنەری شار', btn_places: 'پشکنەری شوێنەکان',
            btn_editors: 'پشکنەری دەستکاریکەران', btn_ra: 'دەستکاری فلکە', btn_lock: 'نیشاندەری قوفڵ',
            btn_qa: 'پشکنەری نەخشە',
            btn_speed: 'نیشاندەری خێرایی',
            win_city: 'پشکنەری شار', win_places: 'پشکنەری شوێنەکان',
            win_editors: 'پشکنەری دەستکاریکەران', win_ra: 'دەستکاری فلکە', win_lock: 'نیشاندەری قوفڵ',
            win_speed: 'نیشاندەری خێرایی',
            common_scan: 'گەڕان', common_clear: 'پاککردنەوە', common_close: 'داخستن', common_ready: 'ئامادەیە بۆ دەستکاری',
            ph_city: 'ناوی شار...', ph_place: 'ناوی شوێن...', ph_user: 'ناوی بەکارهێنەر...',
            lbl_days: 'ژمارەی ڕۆژەکان (0 = هەمووی)', lbl_enable: 'چالاککردن',
            ra_in: 'بچووککردن (-)', ra_out: 'گەورەکردن (+)', ra_err: 'فلکەیەک دیاری بکە', unit_m: 'م',
            city_no_name: 'بێ شار (No City)', no_results: 'هیچ ئەنجامێک نەدۆزرایەوە',

            // Validator Strings
            qa_title: 'پشکنەری نەخشە',
            qa_btn_scan: '🔍 پشکنین', qa_btn_clear: 'پاککردنەوە', qa_btn_gmaps: 'Google Maps 🌏',
            qa_lbl_short: 'کورت', qa_lbl_angle: 'goşey tîj', qa_lbl_cross: 'Yektrbřîn',
            qa_lbl_lock: 'Qufł', qa_lbl_ghost: 'No City', qa_lbl_speed: 'Xêrayî',
            qa_lbl_discon: 'Beşî Pçřaw', qa_lbl_jagged: 'Şêwaw',
            qa_opt_exclude_rab: 'Flke hmabjê',
            qa_lbl_discon_mode: 'Pçřaw:',
            qa_opt_discon_1w: 'Yek la', qa_opt_discon_2w: 'Dû la',
            qa_lbl_limit_dist: 'Snûrî Dûrî', qa_lbl_limit_angle: 'Snûrî Goşe',
            qa_unit_m: 'Metr', qa_unit_i: 'Mîl',
            qa_msg_scanning: 'Pşkinîn...', qa_msg_no_segments: '⚠️ Zoom In bike.',
            qa_msg_clean: '✅ Pak e', qa_msg_found: 'Dozrayewe', qa_msg_ready: 'Amade'
        },
        'en-US': {
            main_title: 'Abdullah Abbas WME Tools',
            btn_city: 'City Explorer', btn_places: 'Places Explorer',
            btn_editors: 'Editor Explorer', btn_ra: 'Roundabout Editor', btn_lock: 'Lock Indicator',
            btn_qa: 'Map Validator',
            btn_speed: 'Speed Indicator',
            win_city: 'City Explorer', win_places: 'Places Explorer',
            win_editors: 'Editor Explorer', win_ra: 'Roundabout Editor', win_lock: 'Lock Indicator',
            win_speed: 'Speed Indicator',
            common_scan: 'Scan', common_clear: 'Clear', common_close: 'Close', common_ready: 'Ready',
            ph_city: 'City Name...', ph_place: 'Place Name...', ph_user: 'Username...',
            lbl_days: 'Days (0 = All)', lbl_enable: 'Enable',
            ra_in: 'Shrink', ra_out: 'Expand', ra_err: 'Select RA', unit_m: 'm',
            city_no_name: 'No City', no_results: 'No results',

            // Validator Strings
            qa_title: 'Map Validator',
            qa_btn_scan: '🔍 Scan Area', qa_btn_clear: 'Clear', qa_btn_gmaps: 'Open Google Maps 🌏',
            qa_lbl_short: 'Short Seg', qa_lbl_angle: 'Sharp Angle', qa_lbl_cross: 'No Node',
            qa_lbl_lock: 'Locks', qa_lbl_ghost: 'Ghost City', qa_lbl_speed: 'Speed',
            qa_lbl_discon: 'Disconnected', qa_lbl_jagged: 'Jagged',
            qa_opt_exclude_rab: 'Exclude RA',
            qa_lbl_discon_mode: 'Discon Type:',
            qa_opt_discon_1w: '1-Side', qa_opt_discon_2w: '2-Sides',
            qa_lbl_limit_dist: 'Dist Limit', qa_lbl_limit_angle: 'Angle Limit',
            qa_unit_m: 'Meter', qa_unit_i: 'Mile',
            qa_msg_scanning: 'Scanning...', qa_msg_no_segments: '⚠️ Zoom In please.',
            qa_msg_clean: '✅ Clean', qa_msg_found: 'Found', qa_msg_ready: 'Ready'
        }
    };

    let currentLang = 'ar-IQ';
    const _t = (key) => (STRINGS[currentLang] || STRINGS['en-US'])[key] || key;
    const _dir = () => (currentLang === 'en-US' ? 'ltr' : 'rtl');

    // ===========================================================================
    //  CORE UTILITIES
    // ===========================================================================
    function getAllObjects(modelName) {
        if(!W || !W.model || !W.model[modelName]) return [];
        var repo = W.model[modelName];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    function fastClone(obj) { return JSON.parse(JSON.stringify(obj)); }

    function calculateAngle(p1, p2, p3) {
        const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const b = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
        const c = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
        if (a === 0 || b === 0) return 180;
        const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
        const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        return angleRad * (180 / Math.PI);
    }

    class UIBuilder {
        static getSavedState(id) {
            try { return JSON.parse(localStorage.getItem(`AA_Win_${id}`)) || null; } catch (e) { return null; }
        }

        static saveState(id, element) {
            const state = {
                top: element.style.top,
                left: element.style.left,
                width: element.style.width,
                height: element.style.height,
                display: element.style.display
            };
            localStorage.setItem(`AA_Win_${id}`, JSON.stringify(state));
        }

        static createFloatingWindow(id, titleKey, colorClass, contentHtml) {
            let win = document.getElementById(id);
            if (win) {
                win.style.display = (win.style.display === 'none' ? 'block' : 'none');
                if(win.style.display === 'block') UIBuilder.saveState(id, win);
                return win;
            }

            const state = UIBuilder.getSavedState(id) || {
                top: '100px',
                left: '100px',
                width: DEFAULT_W,
                height: DEFAULT_H
            };

            win = document.createElement('div');
            win.id = id;
            win.className = `aa-window ${_dir()}`;
            win.style.top = state.top;
            win.style.left = state.left;
            win.style.width = state.width;
            win.style.height = state.height;
            win.style.display = 'block';

            const header = document.createElement('div');
            header.className = `aa-header ${colorClass}`;
            header.innerHTML = `<span>${_t(titleKey)}</span><span class="aa-close">✖</span>`;

            const content = document.createElement('div');
            content.className = 'aa-content';
            content.innerHTML = contentHtml;

            win.appendChild(header);
            win.appendChild(content);
            document.body.appendChild(win);

            win.querySelector('.aa-close').onclick = () => { win.style.display = 'none'; UIBuilder.saveState(id, win); };

            let isDragging = false, startX, startY, initialLeft, initialTop;
            header.onmousedown = (e) => {
                if(e.target.className === 'aa-close') return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;
                document.onmousemove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    win.style.left = (initialLeft + e.clientX - startX) + 'px';
                    win.style.top = (initialTop + e.clientY - startY) + 'px';
                };
                document.onmouseup = () => { isDragging = false; document.onmousemove = null; document.onmouseup = null; UIBuilder.saveState(id, win); };
            };

            new ResizeObserver(() => { UIBuilder.saveState(id, win); }).observe(win);
            return win;
        }
    }

    // ===========================================================================
    //  SPEED INDICATOR
    // ===========================================================================
    const SpeedIndicator = {
        layer: null,
        init: () => {
            const html = `
                <div style="padding:5px;">
                    <label style="font-weight:bold; display:block; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="speed_master_enable" checked> ${_t('lbl_enable')}</label>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="0" checked> 0-40 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#00FF00;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="1" checked> 41-60 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#00FFFF;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="2" checked> 61-80 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#0000FF;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="3" checked> 81-100 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#4B0082;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="4" checked> 101-120 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#800080;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="5" checked> 121-140 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#FF8000;border-radius:2px;border:1px solid #ddd;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="6" checked> 141+ <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#FF0000;border-radius:2px;border:1px solid #ddd;"></span></label>
                    </div>
                    <div style="margin-top:20px; display:flex; gap:10px;">
                        <button id="speed_scan" class="aa-btn aa-red" style="flex:2;">${_t('common_scan')}</button>
                        <button id="speed_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button>
                    </div>
                </div>`;
            UIBuilder.createFloatingWindow('AA_SpeedWin', 'win_speed', 'aa-bg-red', html);
            document.getElementById('speed_scan').onclick = SpeedIndicator.scan;
            document.getElementById('speed_clear').onclick = () => {
                if (SpeedIndicator.layer) SpeedIndicator.layer.removeAllFeatures();
            };
        },
        scan: () => {
            if (!SpeedIndicator.layer) {
                SpeedIndicator.layer = new OpenLayers.Layer.Vector("AA_Speed_Labels", { displayInLayerSwitcher: true });
                W.map.addLayer(SpeedIndicator.layer);
                SpeedIndicator.layer.setZIndex(9999);
            }
            SpeedIndicator.layer.removeAllFeatures();
            SpeedIndicator.layer.setVisibility(true);
            W.map.setLayerIndex(SpeedIndicator.layer, 9999);

            if (!document.getElementById('speed_master_enable').checked) return;

            let enabledRanges = [];
            document.querySelectorAll('.aa-speed-cb').forEach(cb => { if (cb.checked) enabledRanges.push(parseInt(cb.value)) });

            const extent = W.map.getExtent();
            let features = [];

            getAllObjects('segments').forEach(seg => {
                if (!seg.geometry || !extent.intersectsBounds(seg.geometry.getBounds())) return;

                let speed = Math.max(seg.attributes.fwdMaxSpeed || 0, seg.attributes.revMaxSpeed || 0);
                if (speed === 0) return;

                let rangeIdx = -1, color = "";
                if (speed <= 40) { rangeIdx = 0; color = "#00FF00"; }
                else if (speed <= 60) { rangeIdx = 1; color = "#00FFFF"; }
                else if (speed <= 80) { rangeIdx = 2; color = "#0000FF"; }
                else if (speed <= 100) { rangeIdx = 3; color = "#4B0082"; }
                else if (speed <= 120) { rangeIdx = 4; color = "#800080"; }
                else if (speed <= 140) { rangeIdx = 5; color = "#FF8000"; }
                else { rangeIdx = 6; color = "#FF0000"; }

                if (enabledRanges.includes(rangeIdx)) {
                    let centerPt = seg.geometry.getCentroid();
                    let style = {
                        pointRadius: 12, fillColor: color, fillOpacity: 0.9, strokeColor: "#ffffff", strokeWidth: 2,
                        label: speed.toString(), fontColor: (color === '#00FF00' || color === '#00FFFF') ? "black" : "white",
                        fontSize: "11px", fontWeight: "bold", graphicName: "circle"
                    };
                    features.push(new OpenLayers.Feature.Vector(centerPt, {}, style));
                }
            });
            SpeedIndicator.layer.addFeatures(features);
        }
    };

    // ===========================================================================
    //  VALIDATOR MODULE (Clean UI)
    // ===========================================================================
    const ValidatorCleanUI = {
        qaLayer: null,
        visualLayer: null,
        isInitialized: false,
        settings: {
            checkShort: false, checkAngle: false, checkCross: false,
            checkLock: false, checkGhost: false, checkSpeed: false,
            checkDiscon: false, checkJagged: false,
            limitShort: 6, limitAngle: 30, excludeRAB: true, unitSystem: 'metric', disconMode: '2w',
            winTop: '100px', winLeft: '100px', winWidth: DEFAULT_W, winHeight: DEFAULT_H
        },
        SETTINGS_STORE: 'AA_WME_VALIDATOR_V18',

        init: () => {
            if (ValidatorCleanUI.isInitialized) {
                ValidatorCleanUI.toggle();
                return;
            }
            ValidatorCleanUI.loadSettings();
            ValidatorCleanUI.createWindow();
            ValidatorCleanUI.isInitialized = true;
            ValidatorCleanUI.toggle();
        },

        toggle: () => {
            const win = document.getElementById('aa-qa-pro-window');
            if (win) {
                win.style.display = (win.style.display === 'none' ? 'block' : 'none');
                if (win.style.display === 'block') ValidatorCleanUI.saveSettings();
            }
        },

        loadSettings: () => {
            const s = localStorage.getItem(ValidatorCleanUI.SETTINGS_STORE);
            if (s) ValidatorCleanUI.settings = {...ValidatorCleanUI.settings, ...JSON.parse(s)};

            // Force defaults
            if (!ValidatorCleanUI.settings.limitShort) ValidatorCleanUI.settings.limitShort = 6;
            if (!ValidatorCleanUI.settings.limitAngle) ValidatorCleanUI.settings.limitAngle = 30;
            if (!ValidatorCleanUI.settings.winWidth) ValidatorCleanUI.settings.winWidth = DEFAULT_W;
            if (!ValidatorCleanUI.settings.winHeight) ValidatorCleanUI.settings.winHeight = DEFAULT_H;
            if (!ValidatorCleanUI.settings.disconMode || ValidatorCleanUI.settings.disconMode === 'all') ValidatorCleanUI.settings.disconMode = '2w';
        },

        saveSettings: () => {
            localStorage.setItem(ValidatorCleanUI.SETTINGS_STORE, JSON.stringify(ValidatorCleanUI.settings));
        },

        openGMaps: () => {
            if (!W || !W.map) return;
            const center = W.map.getCenter();
            // Transform from 900913 to 4326 (Lat/Lon)
            const lonlat = new OpenLayers.LonLat(center.lon, center.lat).transform(
                W.map.getProjectionObject(),
                new OpenLayers.Projection("EPSG:4326")
            );
            const url = `https://www.google.com/maps?q=${lonlat.lat},${lonlat.lon}`;
            window.open(url, '_blank');
        },

        scanMap: () => {
            if (typeof W === 'undefined' || !W.map || !W.model) return;
            const statusEl = document.getElementById('aa_qa_status');
            statusEl.innerText = _t('qa_msg_scanning'); statusEl.style.color = '#2196F3';

            if (!ValidatorCleanUI.qaLayer) {
                ValidatorCleanUI.qaLayer = new OpenLayers.Layer.Vector("AA_QA_Results", {displayInLayerSwitcher:true});
                W.map.addLayer(ValidatorCleanUI.qaLayer);
            }
            ValidatorCleanUI.qaLayer.removeAllFeatures();
            ValidatorCleanUI.qaLayer.setVisibility(true);
            ValidatorCleanUI.qaLayer.setZIndex(1001);
            W.selectionManager.unselectAll();

            const extent = W.map.getExtent();
            const segments = W.model.segments.getObjectArray().filter(s => s.geometry && extent.intersectsBounds(s.geometry.getBounds()));
            const nodes = W.model.nodes.getObjectArray().filter(n => n.geometry && extent.intersectsBounds(n.geometry.getBounds()));

            if (segments.length === 0) { statusEl.innerText = _t('qa_msg_no_segments'); statusEl.style.color = '#F44336'; return; }

            const features = []; const modelsToSelect = [];
            const isMetric = ValidatorCleanUI.settings.unitSystem === 'metric';
            const isRAB = (s) => s.isInRoundabout();
            const s = ValidatorCleanUI.settings;

            if (s.checkShort) {
                let limit = parseFloat(s.limitShort) || 6; if (!isMetric) limit = limit * 0.3048;
                segments.forEach(seg => {
                    if(!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    const len = seg.geometry.getGeodesicLength(W.map.getProjectionObject());
                    if (len < limit) {
                        const txt = isMetric ? Math.round(len)+'m' : Math.round(len*3.28)+'ft';
                        features.push(ValidatorCleanUI.createFeature(seg.geometry, '#E91E63', txt)); modelsToSelect.push(seg);
                    }
                });
            }

            if (s.checkDiscon) {
                segments.forEach(seg => {
                    if(!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    const nodeA = W.model.nodes.objects[seg.attributes.fromNodeID];
                    const nodeB = W.model.nodes.objects[seg.attributes.toNodeID];

                    if(!nodeA || !nodeB || !nodeA.geometry || !nodeB.geometry) return;

                    const conA = nodeA.attributes.segIDs.length;
                    const conB = nodeB.attributes.segIDs.length;

                    const visibleA = extent.intersectsBounds(nodeA.geometry.getBounds());
                    const visibleB = extent.intersectsBounds(nodeB.geometry.getBounds());

                    let isDisc = false;

                    if (s.disconMode === '2w') {
                        if (conA === 1 && conB === 1 && visibleA && visibleB) isDisc = true;
                    }
                    else if (s.disconMode === '1w') {
                        const deadA = (conA === 1 && visibleA);
                        const deadB = (conB === 1 && visibleB);
                        if ((deadA && conB > 1) || (deadB && conA > 1)) isDisc = true;
                    }

                    if (isDisc) {
                        features.push(ValidatorCleanUI.createFeature(seg.geometry, '#FF5722', 'Disc'));
                        modelsToSelect.push(seg);
                    }
                });
            }

            if (s.checkJagged) {
                 segments.forEach(seg => {
                    if(!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    const verts = seg.geometry.getVertices(); const len = seg.geometry.getGeodesicLength(W.map.getProjectionObject());
                    if (verts.length > 3 && (len / verts.length) < 3) { features.push(ValidatorCleanUI.createFeature(seg.geometry, '#795548', 'Jagged')); modelsToSelect.push(seg); }
                });
            }
            if (s.checkCross) {
                 for (let i = 0; i < segments.length; i++) {
                     let s1 = segments[i]; for (let j = i + 1; j < segments.length; j++) {
                         let s2 = segments[j];
                         if(!s1.geometry || !s2.geometry) continue;
                         if (s1.attributes.level === s2.attributes.level &&
                             s1.attributes.fromNodeID !== s2.attributes.fromNodeID && s1.attributes.fromNodeID !== s2.attributes.toNodeID &&
                             s1.attributes.toNodeID !== s2.attributes.fromNodeID && s1.attributes.toNodeID !== s2.attributes.toNodeID) {
                             if (s1.geometry.intersects(s2.geometry)) {
                                 features.push(ValidatorCleanUI.createFeature(s1.geometry, '#D50000', 'X'));
                                 if(!modelsToSelect.includes(s1)) modelsToSelect.push(s1); if(!modelsToSelect.includes(s2)) modelsToSelect.push(s2);
                             }
                         }
                     }
                 }
            }
            if (s.checkLock) segments.forEach(seg => {
                if(!seg.geometry) return;
                const rt = seg.attributes.roadType; const lock = (seg.attributes.lockRank || 0) + 1; let req = 1;
                if (rt === 3) req = 4; else if (rt === 6) req = 3; else if (rt === 7) req = 2; else if (rt === 4 && lock < 2) req = 2;
                if (lock < req) { features.push(ValidatorCleanUI.createFeature(seg.geometry, '#F44336', `L${lock}`)); modelsToSelect.push(seg); }
            });
            if (s.checkGhost) segments.forEach(seg => {
                if(!seg.geometry) return;
                const sid = seg.attributes.primaryStreetID;
                if (sid) {
                    const st = W.model.streets.objects[sid];
                    if (st && st.attributes.name && st.attributes.name.trim() !== "") {
                         let ce = !st.attributes.cityID;
                         if (!ce) { const c = W.model.cities.objects[st.attributes.cityID]; if (!c || !c.attributes.name || c.attributes.name.trim() === "") ce = true; }
                         if (ce) { features.push(ValidatorCleanUI.createFeature(seg.geometry, '#FF9800', 'NoCity')); modelsToSelect.push(seg); }
                    }
                }
            });
            if (s.checkSpeed) segments.forEach(seg => {
                if(!seg.geometry) return;
                if (s.excludeRAB && isRAB(seg)) return;
                const sp = seg.attributes.fwdMaxSpeed; if(!sp) return;
                const tn = W.model.nodes.objects[seg.attributes.toNodeID];
                if(tn && tn.attributes.segIDs.length === 2) {
                    const oid = tn.attributes.segIDs.find(id => id !== seg.attributes.id);
                    const os = W.model.segments.objects[oid];
                    if(os) {
                        let osp = (os.attributes.fromNodeID === tn.attributes.id) ? os.attributes.fwdMaxSpeed : os.attributes.revMaxSpeed;
                        if(osp > 0 && Math.abs(sp - osp) >= 30) { features.push(ValidatorCleanUI.createFeature(tn.geometry, '#2196F3', 'Jump', true)); modelsToSelect.push(tn); }
                    }
                }
            });
            if (s.checkAngle) nodes.forEach(n => {
                if(!n.geometry) return;
                if(n.attributes.segIDs.length < 2) return;
                const sg = n.attributes.segIDs.map(id => W.model.segments.objects[id]);
                if (s.excludeRAB && sg.some(seg => seg && isRAB(seg))) return;
                for(let i=0; i<sg.length; i++) for(let j=i+1; j<sg.length; j++) {
                    if(!sg[i] || !sg[j] || !sg[i].geometry || !sg[j].geometry) continue;
                    const angle = ValidatorCleanUI.calculateAngleAtNode(n, sg[i], sg[j]);
                    if(angle < (parseFloat(s.limitAngle)||30)) {
                        features.push(ValidatorCleanUI.createFeature(n.geometry, '#9C27B0', Math.round(angle)+'°', true)); if(!modelsToSelect.includes(n)) modelsToSelect.push(n);
                    }
                }
            });

            ValidatorCleanUI.qaLayer.addFeatures(features);
            if (modelsToSelect.length > 0) {
                statusEl.innerText = `${_t('qa_msg_found')}: ${modelsToSelect.length}`; statusEl.style.color = '#D50000';
                W.selectionManager.setSelectedModels(modelsToSelect);
                let b = null; modelsToSelect.forEach(o => { if(o.geometry) { if(!b) b = o.geometry.getBounds().clone(); else b.extend(o.geometry.getBounds()); } });
                if(b) W.map.setCenter(b.getCenterLonLat());
            } else {
                statusEl.innerText = _t('qa_msg_clean'); statusEl.style.color = '#4CAF50';
            }
        },

        createFeature: (geometry, color, label, isPoint = false) => {
            if(!geometry) return null;
            return new OpenLayers.Feature.Vector(geometry.clone(), {}, {
                strokeColor: color, strokeWidth: isPoint?0:6, strokeOpacity: 0.6, pointRadius: isPoint?7:0, fillColor: color, fillOpacity: 0.8,
                label: label, labelOutlineColor: "white", labelOutlineWidth: 2, fontSize: "10px", fontColor: color, labelYOffset: 16, fontWeight: "bold"
            });
        },

        calculateAngleAtNode: (node, s1, s2) => {
            const pNode = node.geometry;
            const getP = (s) => { const v = s.geometry.getVertices(); return (s.attributes.fromNodeID === node.attributes.id) ? v[1] : v[v.length - 2]; };
            const p1 = getP(s1); const p2 = getP(s2);
            const a = Math.sqrt(Math.pow(p1.x-pNode.x,2)+Math.pow(p1.y-pNode.y,2));
            const b = Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
            const c = Math.sqrt(Math.pow(p2.x-pNode.x,2)+Math.pow(p2.y-pNode.y,2));
            const cosC = (a*a+c*c-b*b)/(2*a*c);
            return Math.acos(Math.max(-1, Math.min(1, cosC)))*180/Math.PI;
        },

        createWindow: () => {
            if (document.getElementById('aa-qa-pro-window')) return;
            const s = ValidatorCleanUI.settings;

            const win = document.createElement('div');
            win.id = 'aa-qa-pro-window';
            win.className = `aa-window ${_dir()}`;
            // STRICT SIZE ENFORCEMENT: Uses s.winWidth/Height which load default values (340/480)
            win.style.cssText = `
                position: fixed; top: ${s.winTop}; left: ${s.winLeft};
                width: ${s.winWidth}; height: ${s.winHeight};
                background: #fff; border-radius: 8px; z-index: 9999;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: none;
                font-family: 'Cairo', sans-serif, Arial; overflow: hidden;
                resize: none; direction: ${_dir()};
            `;

            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'aa-qa-resize-handle';
            win.appendChild(resizeHandle);

            // Unified Header (Matches other windows)
            const head = document.createElement('div');
            head.className = 'aa-header aa-bg-orange';
            head.innerHTML = `<span>${_t('qa_title')}</span><span id="aa-qa-close" class="aa-close">✖</span>`;
            win.appendChild(head);

            const body = document.createElement('div');
            body.className = 'aa-content';

            const createChk = (key, label) => `<label class="aa-qa-chk-card"><input type="checkbox" id="aa_qa_${key}" ${s[key]?'checked':''} data-key="${key}"><span>${label}</span></label>`;

            let html = `<div class="aa-qa-grid">
                ${createChk('checkShort', _t('qa_lbl_short'))}
                ${createChk('checkAngle', _t('qa_lbl_angle'))}
                ${createChk('checkCross', _t('qa_lbl_cross'))}
                ${createChk('checkLock', _t('qa_lbl_lock'))}
                ${createChk('checkGhost', _t('qa_lbl_ghost'))}
                ${createChk('checkSpeed', _t('qa_lbl_speed'))}
                ${createChk('checkDiscon', _t('qa_lbl_discon'))}
                ${createChk('checkJagged', _t('qa_lbl_jagged'))}
                <button id="aa_qa_gmaps_grid" class="aa-qa-grid-btn">${_t('qa_btn_gmaps')}</button>
            </div>`;

            html += `<div class="aa-qa-settings-box">
                <div class="aa-qa-setting-row"><span>${_t('qa_opt_exclude_rab')}</span><input type="checkbox" id="aa_qa_excludeRAB" ${s.excludeRAB?'checked':''}></div>
                <div class="aa-qa-setting-row"><span>${_t('qa_lbl_discon_mode')}</span><div class="aa-qa-pill"><div id="aa_qa_disc_1w" class="aa-qa-pill-opt ${s.disconMode==='1w'?'active':''}">${_t('qa_opt_discon_1w')}</div><div id="aa_qa_disc_2w" class="aa-qa-pill-opt ${s.disconMode==='2w'?'active':''}">${_t('qa_opt_discon_2w')}</div></div></div>
                <div class="aa-qa-setting-row"><span>${_t('qa_unit_m')} / ${_t('qa_unit_i')}</span><div class="aa-qa-pill"><div id="aa_qa_unit_m" class="aa-qa-pill-opt ${s.unitSystem==='metric'?'active':''}">${_t('qa_unit_m')}</div><div id="aa_qa_unit_i" class="aa-qa-pill-opt ${s.unitSystem==='imperial'?'active':''}">${_t('qa_unit_i')}</div></div></div>
                <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_dist')}</span><div><input type="number" id="aa_qa_limitShort" class="aa-qa-input" value="${s.limitShort}"> <span id="aa_qa_lbl_short_unit" style="color:#888;">${s.unitSystem==='metric'?'m':'ft'}</span></div></div>
                <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_angle')}</span><div><input type="number" id="aa_qa_limitAngle" class="aa-qa-input" value="${s.limitAngle}"> <span>°</span></div></div>
            </div>`;

            // Action Row: SCAN | CLEAR
            html += `<div class="aa-qa-action-row">
                        <button id="aa_qa_scan" class="aa-qa-btn aa-btn-scan">${_t('qa_btn_scan')}</button>
                        <button id="aa_qa_clear" class="aa-qa-btn aa-btn-clear">${_t('qa_btn_clear')}</button>
                     </div>`;
            html += `<div id="aa_qa_status" style="text-align:center; margin-top:8px; font-weight:bold; font-size:11px; color:#777;">${_t('qa_msg_ready')}</div>`;

            body.innerHTML = html;
            win.appendChild(body);
            document.body.appendChild(win);

            // Events
            document.getElementById('aa-qa-close').onclick = () => { win.style.display = 'none'; ValidatorCleanUI.saveSettings(); };
            document.getElementById('aa_qa_scan').onclick = ValidatorCleanUI.scanMap;
            document.getElementById('aa_qa_gmaps_grid').onclick = ValidatorCleanUI.openGMaps;
            document.getElementById('aa_qa_clear').onclick = () => {
                W.selectionManager.unselectAll();
                if(ValidatorCleanUI.qaLayer) ValidatorCleanUI.qaLayer.removeAllFeatures();
                if(ValidatorCleanUI.visualLayer) ValidatorCleanUI.visualLayer.removeAllFeatures();
                document.getElementById('aa_qa_status').innerText = _t('qa_msg_ready');
            };

            win.querySelectorAll('input[type="checkbox"][data-key]').forEach(c => {
                c.onchange = function() {
                    ValidatorCleanUI.settings[this.getAttribute('data-key')] = this.checked;
                    ValidatorCleanUI.saveSettings();
                };
            });

            document.getElementById('aa_qa_limitShort').onchange = (e) => { ValidatorCleanUI.settings.limitShort = e.target.value; ValidatorCleanUI.saveSettings(); };
            document.getElementById('aa_qa_limitAngle').onchange = (e) => { ValidatorCleanUI.settings.limitAngle = e.target.value; ValidatorCleanUI.saveSettings(); };
            document.getElementById('aa_qa_excludeRAB').onchange = (e) => { ValidatorCleanUI.settings.excludeRAB = e.target.checked; ValidatorCleanUI.saveSettings(); };

            const setupPill = (ids, settingKey, values) => {
                ids.forEach((id, idx) => {
                    document.getElementById(id).onclick = () => {
                        ValidatorCleanUI.settings[settingKey] = values[idx]; ValidatorCleanUI.saveSettings();
                        ids.forEach((oid, oidx) => { const el = document.getElementById(oid); if(idx === oidx) el.classList.add('active'); else el.classList.remove('active'); });
                        if(settingKey === 'unitSystem') document.getElementById('aa_qa_lbl_short_unit').innerText = values[idx] === 'metric' ? 'm' : 'ft';
                    };
                });
            };
            setupPill(['aa_qa_unit_m', 'aa_qa_unit_i'], 'unitSystem', ['metric', 'imperial']);
            setupPill(['aa_qa_disc_1w', 'aa_qa_disc_2w'], 'disconMode', ['1w', '2w']);

            // Drag
            let isDrag = false, startX, startY, initialLeft, initialTop;
            head.onmousedown = (e) => {
                if(e.target.className.includes('aa-close')) return;
                isDrag = true; startX = e.clientX; startY = e.clientY;
                initialLeft = win.offsetLeft; initialTop = win.offsetTop;
                document.onmousemove = (e) => {
                    if(!isDrag) return; e.preventDefault();
                    win.style.left = (initialLeft + e.clientX - startX) + 'px';
                    win.style.top = (initialTop + e.clientY - startY) + 'px';
                };
                document.onmouseup = () => { isDrag = false; document.onmousemove = null; document.onmouseup = null; ValidatorCleanUI.settings.winTop = win.style.top; ValidatorCleanUI.settings.winLeft = win.style.left; ValidatorCleanUI.saveSettings(); };
            };

            // Resize (Bottom Left)
            const handle = document.getElementById('aa-qa-resize-handle');
            let isResizing = false, rStartX, rStartY, rStartW, rStartH;
            handle.onmousedown = (e) => {
                isResizing = true;
                rStartX = e.clientX; rStartY = e.clientY;
                rStartW = win.offsetWidth; rStartH = win.offsetHeight;
                e.stopPropagation(); e.preventDefault();
            };
            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const newW = rStartW + (rStartX - e.clientX);
                const newH = rStartH + (e.clientY - rStartY);
                if (newW > 280) { win.style.width = newW + 'px'; win.style.left = (e.clientX) + 'px'; }
                if (newH > 300) win.style.height = newH + 'px';
            });
            document.addEventListener('mouseup', () => {
                if(isResizing) {
                    isResizing = false;
                    ValidatorCleanUI.settings.winWidth = win.style.width; ValidatorCleanUI.settings.winHeight = win.style.height;
                    ValidatorCleanUI.settings.winLeft = win.style.left;
                    ValidatorCleanUI.saveSettings();
                }
            });
        }
    };

    // ===========================================================================
    //  MODULES (Roundabout, City, etc. - STABLE V23)
    // ===========================================================================
    const RoundaboutEditor={
        isInitialized: false,
        timeout: null,
        init:()=>{
            const html=`<div style="text-align:center;padding:10px;"><div style="margin-bottom:15px;background:#fff;border:2px solid #333;padding:10px;border-radius:8px;"><span style="font-size:16px;font-weight:bold;color:#000;">${_t('unit_m')}: </span><input type="number" id="ra-val" class="aa-input" value="1" style="width:80px;display:inline-block;font-size:18px;font-weight:bold;text-align:center;border:1px solid #000;"></div><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تحريك (Move)</div><div class="aa-ra-controls"><div></div><button id="ra_up" class="aa-btn aa-green aa-big-icon">▲</button><div></div><button id="ra_left" class="aa-btn aa-green aa-big-icon">◄</button><button id="ra_down" class="aa-btn aa-green aa-big-icon">▼</button><button id="ra_right" class="aa-btn aa-green aa-big-icon">►</button></div><div style="margin-top:20px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تدوير (Rotate)</div><div class="aa-btn-group"><button id="ra_rot_l" class="aa-btn aa-bg-red aa-huge-icon">↺</button><button id="ra_rot_r" class="aa-btn aa-bg-blue aa-huge-icon">↻</button></div></div><div style="margin-top:15px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">حجم (Size)</div><div class="aa-btn-group"><button id="ra_shrink" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_in')}</button><button id="ra_expand" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_out')}</button></div></div></div><div id="ra_status" style="margin-top:15px;text-align:center;font-weight:bold;font-size:16px;color:red;border-top:2px solid #000;padding-top:10px;">${_t('ra_err')}</div>`;
            UIBuilder.createFloatingWindow('AA_RAWin','win_ra','aa-bg-green',html);

            if(!RoundaboutEditor.isInitialized) {
                W.selectionManager.events.register("selectionchanged", null, RoundaboutEditor.onSelectionChanged);
                RoundaboutEditor.isInitialized = true;
            }

            RoundaboutEditor.checkSelection();
            document.getElementById('ra_up').onclick=()=>RoundaboutEditor.run('ShiftLat',1);
            document.getElementById('ra_down').onclick=()=>RoundaboutEditor.run('ShiftLat',-1);
            document.getElementById('ra_left').onclick=()=>RoundaboutEditor.run('ShiftLong',-1);
            document.getElementById('ra_right').onclick=()=>RoundaboutEditor.run('ShiftLong',1);
            document.getElementById('ra_rot_l').onclick=()=>RoundaboutEditor.run('Rotate',-1);
            document.getElementById('ra_rot_r').onclick=()=>RoundaboutEditor.run('Rotate',1);
            document.getElementById('ra_shrink').onclick=()=>RoundaboutEditor.run('Diameter',-1);
            document.getElementById('ra_expand').onclick=()=>RoundaboutEditor.run('Diameter',1)
        },
        onSelectionChanged: () => {
            if (RoundaboutEditor.timeout) clearTimeout(RoundaboutEditor.timeout);
            RoundaboutEditor.timeout = setTimeout(() => { RoundaboutEditor.checkSelection(); }, 100);
        },
        checkSelection:()=>{
            try {
                const win = document.getElementById('AA_RAWin');
                if (!win || win.style.display === 'none') return;
                const el = document.getElementById('ra_status');
                if(!el) return;
                const sel = W.selectionManager.getSelectedFeatures();
                let isRA = false;
                if(sel.length > 0 && sel[0].model.type === 'segment') {
                    if(WazeWrap.Model.isRoundaboutSegmentID(sel[0].model.attributes.id)) isRA = true;
                }
                el.innerText = isRA ? _t('common_ready') : _t('ra_err');
                el.style.color = isRA ? '#00c853' : '#d50000';
            } catch(e) {}
        },
        run:(action,multiplier)=>{var WazeActionUpdateSegmentGeometry,WazeActionMoveNode,WazeActionMultiAction;try{WazeActionUpdateSegmentGeometry=require('Waze/Action/UpdateSegmentGeometry');WazeActionMoveNode=require('Waze/Action/MoveNode');WazeActionMultiAction=require('Waze/Action/MultiAction')}catch(e){console.error("WME Modules not found",e);return}var val=parseFloat(document.getElementById('ra-val').value)*multiplier;var segs=WazeWrap.getSelectedFeatures();if(!segs||segs.length===0)return;var segObj=segs[0];const getRASegs=(s)=>WazeWrap.Model.getAllRoundaboutSegmentsFromObj(s);try{if(action==='ShiftLong'||action==='ShiftLat'){var RASegs=getRASegs(segObj);var multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);let isLat=(action==='ShiftLat');let c_idx=isLat?1:0;let offset=0;let c=WazeWrap.Geometry.ConvertTo4326(s.attributes.geoJSONGeometry.coordinates[0][0],s.attributes.geoJSONGeometry.coordinates[0][1]);if(isLat)offset=WazeWrap.Geometry.CalculateLatOffsetGPS(val,c.lon,c.lat);else offset=WazeWrap.Geometry.CalculateLongOffsetGPS(val,c.lon,c.lat);for(let j=1;j<newGeo.coordinates.length-1;j++)newGeo.coordinates[j][c_idx]+=offset;multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);newNodeGeo.coordinates[c_idx]+=offset;let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Rotate'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let angleDeg=5*multiplier;let angleRad=angleDeg*(Math.PI/180);let cosTheta=Math.cos(angleRad);let sinTheta=Math.sin(angleRad);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let nX900913=cosTheta*(pX-centerX)-sinTheta*(pY-centerY)+centerX;let nY900913=sinTheta*(pX-centerX)+cosTheta*(pY-centerY)+centerY;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(nX900913,nY900913);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let nodeX900913=cosTheta*(npX-centerX)-sinTheta*(npY-centerY)+centerX;let nodeY900913=sinTheta*(npX-centerX)+cosTheta*(npY-centerY)+centerY;let{lon:nnX,lat:nnY}=WazeWrap.Geometry.ConvertTo4326(nodeX900913,nodeY900913);newNodeGeo.coordinates=[nnX,nnY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Diameter'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let h=Math.sqrt(Math.abs(Math.pow(pX-centerX,2)+Math.pow(pY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(pX-centerX)*ratio;let y=centerY+(pY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let h=Math.sqrt(Math.abs(Math.pow(npX-centerX,2)+Math.pow(npY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(npX-centerX)*ratio;let y=centerY+(npY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newNodeGeo.coordinates=[nX,nY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}}catch(e){console.error("RA Operation Failed",e)}}};
    const CityExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_city_input" class="aa-input" placeholder="${_t('ph_city')}"><div class="aa-btn-group"><button id="aa_city_scan" class="aa-btn aa-gold">${_t('common_scan')}</button><button id="aa_city_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_city_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_CityWin','win_city','aa-bg-gold',html);document.getElementById('aa_city_scan').onclick=CityExplorer.scan;document.getElementById('aa_city_clear').onclick=()=>{document.getElementById('aa_city_res').innerHTML='';document.getElementById('aa_city_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_city_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_city_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let cityGroups={};const extent=W.map.getExtent();const segments=getAllObjects('segments');let foundAny=false;segments.forEach(seg=>{if(!seg.geometry||!extent.intersectsBounds(seg.geometry.getBounds()))return;let cityName=_t('city_no_name');if(seg.attributes.primaryStreetID){let street=W.model.streets.objects[seg.attributes.primaryStreetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name&&city.attributes.name.trim().length>0)cityName=city.attributes.name}}if(query!==""&&!cityName.toLowerCase().includes(query))return;if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(seg);foundAny=true});resDiv.innerHTML='';const sortedCities=Object.keys(cityGroups).sort();if(!foundAny){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedCities.forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-gold">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#fff3cd';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(seg=>{if(seg.geometry){if(!totalBounds)totalBounds=seg.geometry.getBounds().clone();else totalBounds.extend(seg.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})},100)}};
    const PlacesExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_place_input" class="aa-input" placeholder="${_t('ph_place')}"><div class="aa-btn-group"><button id="aa_place_scan" class="aa-btn aa-blue">${_t('common_scan')}</button><button id="aa_place_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_place_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_PlaceWin','win_places','aa-bg-blue',html);document.getElementById('aa_place_scan').onclick=PlacesExplorer.scan;document.getElementById('aa_place_clear').onclick=()=>{document.getElementById('aa_place_res').innerHTML='';document.getElementById('aa_place_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_place_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_place_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{const extent=W.map.getExtent();const venues=getAllObjects('venues');let foundAny=false;resDiv.innerHTML='';if(query===""){let cityGroups={};venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let cityName=_t('city_no_name');if(v.attributes.streetID){let street=W.model.streets.objects[v.attributes.streetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name)cityName=city.attributes.name}}if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(v);foundAny=true});if(!foundAny){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}Object.keys(cityGroups).sort().forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-blue">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(v=>{if(v.geometry){if(!totalBounds)totalBounds=v.geometry.getBounds().clone();else totalBounds.extend(v.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})}else{let results=[];venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let name=v.attributes.name||"Unnamed";if(name.toLowerCase().includes(query))results.push(v)});if(results.length===0){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}results.sort((a,b)=>(a.attributes.name||"").localeCompare(b.attributes.name||"")).forEach(v=>{let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${v.attributes.name||"Unnamed"}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels([v]);W.map.setCenter(v.geometry.getBounds().getCenterLonLat())};resDiv.appendChild(row)})}},100)}};
    const EditorExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_user_input" class="aa-input" placeholder="${_t('ph_user')}"><label style="font-size:11px; font-weight:bold; display:block; margin-bottom:3px;">${_t('lbl_days')}</label><input type="number" id="aa_days_input" class="aa-input" value="0" min="0"><div class="aa-btn-group"><button id="aa_user_scan" class="aa-btn aa-purple">${_t('common_scan')}</button><button id="aa_user_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_user_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_UserWin','win_editors','aa-bg-purple',html);document.getElementById('aa_user_scan').onclick=EditorExplorer.scan;document.getElementById('aa_user_clear').onclick=()=>{document.getElementById('aa_user_res').innerHTML='';W.selectionManager.unselectAll()}},scan:()=>{const resDiv=document.getElementById('aa_user_res');const query=document.getElementById('aa_user_input').value.toLowerCase().trim();const daysVal=parseInt(document.getElementById('aa_days_input').value);const days=isNaN(daysVal)?0:daysVal;const cutoff=days>0?new Date(Date.now()-(days*86400000)):null;resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let users={};const extent=W.map.getExtent();const processObj=(obj,type)=>{if(!obj.geometry)return;if(!extent.intersectsBounds(obj.geometry.getBounds()))return;let uID=obj.attributes.updatedBy||obj.attributes.createdBy;let uTime=obj.attributes.updatedOn||obj.attributes.createdOn;if(cutoff&&new Date(uTime)<cutoff)return;if(uID){let uName="Unknown";if(W.model.users.objects[uID])uName=W.model.users.objects[uID].attributes.userName;else uName="ID:"+uID;if(query!==""&&!uName.toLowerCase().includes(query))return;if(!users[uName])users[uName]={segCount:0,venCount:0,objs:[]};if(type==='segment')users[uName].segCount++;if(type==='venue')users[uName].venCount++;users[uName].objs.push(obj)}};getAllObjects('segments').forEach(o=>processObj(o,'segment'));getAllObjects('venues').forEach(o=>processObj(o,'venue'));resDiv.innerHTML='';const sortedUsers=Object.keys(users).sort((a,b)=>(users[b].segCount+users[b].venCount)-(users[a].segCount+users[a].venCount));if(sortedUsers.length===0){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedUsers.forEach(u=>{let data=users[u];let r=document.createElement('div');r.className='aa-item-row';r.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:13px; max-width:140px; overflow:hidden; text-overflow:ellipsis;">${u}</span><div style="display:flex; gap:5px;"><span class="aa-badge aa-bg-gold" title="Segments"><i class="fa fa-road"></i> ${data.segCount}</span><span class="aa-badge aa-bg-blue" title="Venues"><i class="fa fa-map-marker"></i> ${data.venCount}</span></div>`;r.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(x=>x.style.background='transparent');r.style.background='#e8daef';W.selectionManager.setSelectedModels(data.objs);let totalBounds=null;data.objs.forEach(o=>{if(o.geometry){if(!totalBounds)totalBounds=o.geometry.getBounds().clone();else totalBounds.extend(o.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(r)})},100)}};
    const LockIndicator={layer:null,init:()=>{const html=`<div style="padding:5px;"><label style="font-weight:bold; display:block; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="lock_master_enable" checked> ${_t('lbl_enable')}</label><div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;"><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="0" checked> L1 <span style="display:inline-block;width:12px;height:12px;background:#B0B0B0;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="1" checked> L2 <span style="display:inline-block;width:12px;height:12px;background:#FFC800;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="2" checked> L3 <span style="display:inline-block;width:12px;height:12px;background:#00FF00;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="3" checked> L4 <span style="display:inline-block;width:12px;height:12px;background:#00BFFF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="4" checked> L5 <span style="display:inline-block;width:12px;height:12px;background:#BF00FF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="5" checked> L6 <span style="display:inline-block;width:12px;height:12px;background:#FF0000;border-radius:50%;"></span></label></div><button id="lock_scan" class="aa-btn aa-cyan" style="margin-top:20px;">${_t('common_scan')}</button><button id="lock_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div>`;UIBuilder.createFloatingWindow('AA_LockWin','win_lock','aa-bg-cyan',html);document.getElementById('lock_scan').onclick=LockIndicator.scan;document.getElementById('lock_clear').onclick=()=>{if(LockIndicator.layer)LockIndicator.layer.removeAllFeatures()}},scan:()=>{if(!LockIndicator.layer){LockIndicator.layer=new OpenLayers.Layer.Vector("AA_Locks",{displayInLayerSwitcher:true});W.map.addLayer(LockIndicator.layer);LockIndicator.layer.setZIndex(9999)}LockIndicator.layer.removeAllFeatures();LockIndicator.layer.setVisibility(true);W.map.setLayerIndex(LockIndicator.layer,9999);if(!document.getElementById('lock_master_enable').checked)return;let enabledLevels=[];document.querySelectorAll('.aa-lock-cb').forEach(cb=>{if(cb.checked)enabledLevels.push(parseInt(cb.value))});const LOCK_COLORS={0:'#B0B0B0',1:'#FFC800',2:'#00FF00',3:'#00BFFF',4:'#BF00FF',5:'#FF0000'};const extent=W.map.getExtent();let features=[];const process=(obj,isVenue)=>{if(!obj.geometry||!extent.intersectsBounds(obj.geometry.getBounds()))return;let rank=(obj.attributes.lockRank!==undefined&&obj.attributes.lockRank!==null)?obj.attributes.lockRank:0;if(enabledLevels.includes(rank)){let centerPt=obj.geometry.getCentroid();let style={pointRadius:10,fontSize:"10px",fontWeight:"bold",label:"L"+(rank+1),fontColor:"black",fillColor:LOCK_COLORS[rank],fillOpacity:0.85,strokeColor:"#333",strokeWidth:1,graphicName:isVenue?"square":"circle"};features.push(new OpenLayers.Feature.Vector(centerPt,{},style))}};getAllObjects('segments').forEach(o=>process(o,false));getAllObjects('venues').forEach(o=>process(o,true));LockIndicator.layer.addFeatures(features)}};

    // ===========================================================================
    //  MAIN INIT & STYLES
    // ===========================================================================
    function injectCSS() {
        const css = `
            .aa-window {
                position:fixed; background:#fff; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.3); z-index:9999;
                font-family:'Cairo', sans-serif;
                overflow: hidden;
                resize: both;
                min-width: 200px; min-height: 200px;
            }
            .aa-header { padding:10px; color:#fff; cursor:move; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:14px; height: 35px; }
            .aa-content { padding:10px; background:#f9f9f9; height: calc(100% - 35px); overflow-y:auto; box-sizing:border-box; }
            .aa-close { cursor:pointer; font-weight:bold; font-size:18px; margin-left:10px; }
            .aa-btn { width:100%; padding:8px; margin-top:5px; border:none; border-radius:4px; color:#fff; cursor:pointer; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
            .aa-btn:hover { filter: brightness(1.1); }
            .aa-btn:active { transform: translateY(1px); box-shadow: none; }
            .aa-btn-group { display:flex; gap:5px; margin-bottom:5px; }
            .aa-input { width:100%; padding:6px; margin-bottom:5px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-family:'Cairo'; font-weight:bold; }
            .aa-results { min-height:100px; border-top:1px solid #ddd; margin-top:5px; padding-top:5px; font-size:12px; }
            .aa-item-row { padding:12px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s; }
            .aa-item-row:hover { background:#eee; }
            .aa-ra-controls { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; width:140px; margin:0 auto; }

            /* --- Custom Checkbox Buttons (Lock & Speed) --- */
            .aa-lock-opt {
                display: flex; align-items: center; justify-content: space-between;
                padding: 8px 12px;
                margin-bottom: 0;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px; font-weight: bold; color: #333;
                transition: all 0.2s ease;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .aa-lock-opt:hover { background: #e0e0e0; transform: translateY(-1px); }
            .aa-lock-opt input { margin-left: 8px; }

            /* --- CLEAN UI VALIDATOR STYLES (V18 Integration) --- */
            /* Resize handle (bottom-left) */
            #aa-qa-resize-handle {
                position: absolute; bottom: 0; left: 0; width: 15px; height: 15px;
                cursor: sw-resize; background: linear-gradient(45deg, transparent 50%, #2196F3 50%);
                z-index: 10; opacity: 0.7;
            }
            #aa-qa-resize-handle:hover { opacity: 1; }
            /* Grid 3x3 */
            .aa-qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px; }
            /* Checkbox Card */
            .aa-qa-chk-card {
                background: #fdfdfd; border: 1px solid #ddd; padding: 6px; border-radius: 4px; cursor: pointer;
                font-size: 11px; font-weight: bold; color: #555; display: flex; align-items: center; gap: 8px; height: 36px;
                transition: border 0.2s;
            }
            .aa-qa-chk-card:hover { border-color: #999; }
            .aa-qa-chk-card input[type="checkbox"] { cursor: pointer; margin: 0; width: 14px; height: 14px; accent-color: #2196F3; }
            .aa-qa-chk-card:has(input:checked) { border-color: #2196F3; color: #333; background: #fff; box-shadow: 0 1px 3px rgba(33, 150, 243, 0.15); }
            /* Grid Button (GMaps) */
            .aa-qa-grid-btn {
                grid-column: span 1;
                background: #4285F4; color: white; border: none;
                border-radius: 4px; cursor: pointer; font-weight: bold;
                font-size: 11px; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1); height: 36px;
            }
            .aa-qa-grid-btn:hover { background: #3367D6; }
            /* Settings Box */
            .aa-qa-settings-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 4px; padding: 8px; margin-top: 10px; font-size: 11px; color: #333; }
            .aa-qa-setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
            .aa-qa-input { width: 40px; text-align: center; border: 1px solid #ccc; border-radius: 3px; padding: 2px; font-size: 11px; font-weight: bold; }
            /* Pills */
            .aa-qa-pill { display: flex; background: #e0e0e0; border-radius: 3px; overflow: hidden; cursor: pointer; }
            .aa-qa-pill-opt { padding: 3px 8px; font-size: 10px; font-weight: bold; color: #666; transition: 0.2s; }
            .aa-qa-pill-opt.active { background: #2196F3; color: white; }
            /* Validator Buttons */
            .aa-qa-action-row { display: flex; gap: 8px; margin-top: 12px; width: 100%; }
            .aa-qa-btn { flex: 1; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
            .aa-btn-scan { background: #4CAF50; } .aa-btn-scan:hover { background: #43A047; }
            .aa-btn-clear { background: #757575; } .aa-btn-clear:hover { background: #616161; }

            /* --- COLORS --- */
            .aa-bg-gold { background: #FFD700; color: #000; } .aa-gold { background: #FFC107; color:#000; }
            .aa-bg-blue { background: #00B0FF; } .aa-blue { background: #0091EA; }
            .aa-bg-teal { background: #00E5FF; color:#000; } .aa-teal { background: #00B8D4; }
            .aa-bg-purple { background: #D500F9; } .aa-purple { background: #AA00FF; }
            .aa-bg-green { background: #00E676; color:#000; } .aa-green { background: #00C853; }
            .aa-bg-cyan { background: #18FFFF; color:#000; } .aa-cyan { background: #00B8D4; }
            .aa-bg-red { background: #FF1744; } .aa-red { background: #D50000; }
            .aa-bg-orange { background: #FF9800; color:#000; }
            .aa-bg-darkblue { background: #1565C0; }
            .aa-bg-white { background: #ffffff; color: #333; text-shadow: none; }
            .aa-txt-dark { color: #333; }
            .aa-gray { background: #78909C; }

            .rtl { direction: rtl; } .ltr { direction: ltr; }
            .aa-big-icon { font-size: 24px; padding: 5px 0; font-weight: 900; }
            .aa-huge-icon { font-size: 32px; padding: 5px 0; font-weight: 900; }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function buildSidebar() {
        const userTabs = document.getElementById('user-info');
        if (!userTabs) return;
        const existingTab = document.getElementById('aa-suite-tab-content');
        if(existingTab) existingTab.remove();
        const existingLink = document.querySelector('ul.nav-tabs li a[href="#aa-suite-tab-content"]');
        if(existingLink) existingLink.parentElement.remove();

        const navTabs = userTabs.querySelector('.nav-tabs');
        const tabContent = userTabs.querySelector('.tab-content');
        if(!navTabs || !tabContent) return;

        const addon = document.createElement('div');
        addon.id = "aa-suite-tab-content";
        addon.className = "tab-pane";
        addon.style.padding = "10px";

        const langOptions = [
            {code: 'ar-IQ', name: 'العربية (العراق)'},
            {code: 'ckb-IQ', name: 'Kurdî (Soranî)'},
            {code: 'en-US', name: 'English (US)'}
        ].map(l => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>`).join('');

        addon.innerHTML = `
            <div style="text-align:center; font-family:'Cairo', sans-serif;">
                <div style="font-weight:bold; color:#000; margin-bottom:10px; padding-bottom:5px; border-bottom:3px solid #FFD700; font-size:16px;">${_t('main_title')}</div>
                <select id="aa_lang_sel" class="aa-input" style="margin-bottom:15px; text-align:center;">${langOptions}</select>
                <button id="btn_open_city" class="aa-btn aa-bg-gold"><i class="fa fa-building"></i> ${_t('btn_city')}</button>
                <button id="btn_open_places" class="aa-btn aa-bg-blue"><i class="fa fa-map-marker"></i> ${_t('btn_places')}</button>
                <button id="btn_open_editors" class="aa-btn aa-bg-purple"><i class="fa fa-users"></i> ${_t('btn_editors')}</button>
                <button id="btn_open_lock" class="aa-btn aa-bg-cyan"><i class="fa fa-lock"></i> ${_t('btn_lock')}</button>
                <div style="height:2px; background:#ccc; margin:10px 0;"></div>
                <button id="btn_open_speed" class="aa-btn aa-bg-red"><i class="fa fa-tachometer"></i> ${_t('btn_speed')}</button>
                <button id="btn_open_qa" class="aa-btn aa-bg-orange"><i class="fa fa-bug"></i> ${_t('btn_qa')}</button>
                <button id="btn_open_ra" class="aa-btn aa-bg-green"><i class="fa fa-refresh"></i> ${_t('btn_ra')}</button>
                <div style="margin-top:15px; font-size:10px; color:#555; font-weight:bold;">v${SCRIPT_VERSION}</div>
            </div>
        `;

        const newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#aa-suite-tab-content" data-toggle="tab" title="Abdullah Abbas WME Tools">Abdullah Abbas WME Tools</a>';
        navTabs.appendChild(newtab);
        tabContent.appendChild(addon);

        document.getElementById('aa_lang_sel').onchange = (e) => {
            currentLang = e.target.value;
            localStorage.setItem('AA_Lang', currentLang);
            buildSidebar();
            document.querySelectorAll('.aa-window').forEach(w => w.remove());
            const vWin = document.getElementById('aa-qa-pro-window');
            if(vWin) vWin.remove();
        };
        document.getElementById('btn_open_city').onclick = CityExplorer.init;
        document.getElementById('btn_open_places').onclick = PlacesExplorer.init;
        document.getElementById('btn_open_editors').onclick = EditorExplorer.init;
        document.getElementById('btn_open_ra').onclick = RoundaboutEditor.init;
        document.getElementById('btn_open_lock').onclick = LockIndicator.init;
        document.getElementById('btn_open_qa').onclick = ValidatorCleanUI.init;
        document.getElementById('btn_open_speed').onclick = SpeedIndicator.init;
    }

    function bootstrap(tries=1) {
        if (typeof W !== 'undefined' && W.map && W.model && document.getElementById('user-info')) {
            const savedLang = localStorage.getItem('AA_Lang');
            if(savedLang && STRINGS[savedLang]) currentLang = savedLang;
            injectCSS();
            buildSidebar();
            console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} Loaded.`);
        } else if (tries < 50) {
            setTimeout(() => bootstrap(tries+1), 200);
        }
    }
    bootstrap();
})();