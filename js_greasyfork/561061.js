// ==UserScript==
// @name                Abdullah Abbas Tools (Stable v41 + Color Gradient Fixed)
// @namespace           https://greasyfork.org/users/abdullah-abbas
// @description         WME Suite: Stable Base + Speed Filter (Green to Red Gradient)
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @version             2026.01.02.52
// @grant               none
// @author              Abdullah Abbas
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/561061/Abdullah%20Abbas%20Tools%20%28Stable%20v41%20%2B%20Color%20Gradient%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561061/Abdullah%20Abbas%20Tools%20%28Stable%20v41%20%2B%20Color%20Gradient%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wmech_version = "2026.01.02.52";
    var currentLang = 'ar-IQ';

    // متغيرات ويز
    var WazeActionUpdateSegmentGeometry, WazeActionMoveNode, WazeActionMultiAction;

    // متغيرات طبقة القفل (الأصلية المستقرة)
    var _lockLayer = null;
    var _lockSettings = {
        enabled: true,
        showRoundabout: true,
        opacity: 1.0,
        locks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }
    };

    // متغيرات طبقة فلتر السرعة (التدرج اللوني الجديد)
    var _speedLayer = null;
    var _speedSettings = {
        enabled: true,
        opacity: 0.7,
        ranges: [
            { min: 0, max: 40, color: '#00FF00', active: true },   // أخضر (أمان)
            { min: 41, max: 60, color: '#00FFFF', active: true },  // سماوي
            { min: 61, max: 80, color: '#0000FF', active: true },  // أزرق
            { min: 81, max: 100, color: '#4B0082', active: true }, // نيلي
            { min: 101, max: 120, color: '#800080', active: true },// بنفسجي
            { min: 121, max: 140, color: '#FF8000', active: true },// برتقالي
            { min: 141, max: 999, color: '#FF0000', active: true } // أحمر (خطر)
        ]
    };

    const WIN_W = "320px";
    const WIN_H = "440px";

    // ===========================================================================
    //  Translation Database
    // ===========================================================================
    const supportedLangs = [
        { code: 'ar-IQ', name: 'العربية (العراق)', dir: 'rtl' },
        { code: 'ckb-IQ', name: 'Kurdî (Soranî)', dir: 'rtl' },
        { code: 'en-US', name: 'English (US)', dir: 'ltr' }
    ];

    const strings = {
        'ar-IQ': {
            tools_title: 'أدوات عبدالله عباس',
            btn_city: 'مستكشف المدن', btn_places: 'مستكشف الأماكن', btn_city_places: 'عداد الأماكن', btn_editors: 'مستكشف المحررين', btn_ra: 'تعديل الدوار', btn_speed: 'مؤشر القفل', btn_speed_filter: 'فلتر السرعة',
            win_city: 'مستكشف المدن', win_places: 'مستكشف الأماكن', win_city_places: 'عداد الأماكن', win_editors: 'مستكشف المحررين', win_ra: 'تعديل الدوار', win_speed: 'مؤشر القفل', win_speed_filter: 'فلتر السرعات',
            ph_city: 'اسم المدينة...', ph_places: 'اسم المكان...', ph_editor: 'اسم المحرر...',
            btn_scan: 'بحث', btn_analyze: 'تحليل', btn_clear: 'مسح', btn_deselect: 'إلغاء',
            msg_search: 'جاري البحث...', msg_analyze: 'جاري التحليل...', msg_empty: '...', msg_no_res: 'لا يوجد', msg_cleared: 'تم المسح',
            ra_geo: 'التحكم الهندسي', ra_ready: 'جاهز', ra_err: 'حدد دوار', unit_m: 'م', close: 'X',
            spd_enable: 'تفعيل المؤشر', spd_roundabout: 'إظهار في الدوارات', spd_filter_title: 'عرض القفل:', spd_opacity: 'الشفافية',
            ra_in: 'للداخل', ra_out: 'للخارج',
            sf_enable: 'تفعيل فلتر السرعة', sf_apply: 'تحديث الخريطة', sf_clear: 'مسح التلوين'
        },
        'ckb-IQ': {
            tools_title: 'امرازەکانی Abdullah Abbas',
            btn_city: 'شار', btn_places: 'شوێن', btn_city_places: 'ژمارە', btn_editors: 'دەستکاریکەر', btn_ra: 'فلکە', btn_speed: 'قوفڵ', btn_speed_filter: 'خێرایی',
            win_city: 'شار', win_places: 'شوێن', win_city_places: 'ژمارە', win_editors: 'دەستکاریکەر', win_ra: 'فلکە', win_speed: 'قوفڵ', win_speed_filter: 'خێرایی',
            ph_city: 'شار...', ph_places: 'شوێن...', ph_editor: 'بەکارهێنەر...',
            btn_scan: 'پشکنین', btn_analyze: 'شیکردنەوە', btn_clear: 'سڕینەوە', btn_deselect: 'هەڵوەشاندنەوە',
            msg_search: 'گەڕان...', msg_no_res: 'نییە', msg_cleared: 'پاککرایەوە',
            ra_geo: 'کۆنترۆڵ', ra_ready: 'ئامادەیە', ra_err: 'دیاری بکە', unit_m: 'م', close: 'X',
            spd_enable: 'چالاککردن', spd_roundabout: 'لە فلکە', spd_filter_title: 'قوفڵ:', spd_opacity: 'ڕوونی',
            ra_in: 'بۆ ناوەوە', ra_out: 'بۆ دەرەوە',
            sf_enable: 'چالاککردن', sf_apply: 'نوێکردنەوە', sf_clear: 'سڕینەوە'
        },
        'en-US': {
            tools_title: 'Abdullah Abbas Tools',
            btn_city: 'City Explorer', btn_places: 'Places Explorer', btn_city_places: 'Places Counter', btn_editors: 'Editor Explorer', btn_ra: 'Roundabout', btn_speed: 'Lock Indicator', btn_speed_filter: 'Speed Filter',
            win_city: 'City Explorer', win_places: 'Places Explorer', win_city_places: 'Places Counter', win_editors: 'Editor Explorer', win_ra: 'Roundabout Editor', win_speed: 'Lock Indicator', win_speed_filter: 'Speed Filter',
            ph_city: 'City...', ph_places: 'Place...', ph_editor: 'User...',
            btn_scan: 'Scan', btn_analyze: 'Analyze', btn_clear: 'Clear', btn_deselect: 'Deselect',
            msg_search: 'Searching...', msg_no_res: 'None', msg_cleared: 'Cleared',
            ra_geo: 'Geometry', ra_ready: 'Ready', ra_err: 'Select RA', unit_m: 'm', close: 'X',
            spd_enable: 'Enable', spd_roundabout: 'Show RA', spd_filter_title: 'Locks:', spd_opacity: 'Opacity',
            ra_in: 'In', ra_out: 'Out',
            sf_enable: 'Enable Filter', sf_apply: 'Refresh Map', sf_clear: 'Clear Map'
        }
    };

    supportedLangs.forEach(lang => { if (!strings[lang.code]) strings[lang.code] = JSON.parse(JSON.stringify(strings['en-US'])); });

    function detectLanguage() {
        var saved = localStorage.getItem('AbdullahAbbas_Lang');
        if(saved && strings[saved]) return saved;
        return 'ar-IQ';
    }

    function _t(key) {
        var langObj = strings[currentLang] || strings['en-US'];
        return langObj[key] || strings['en-US'][key] || key;
    }

    function _dir() { return (supportedLangs.find(l => l.code === currentLang) || {}).dir || 'ltr'; }

    function bootstrap(tries = 1) {
        if (typeof W !== 'undefined' && W.map && W.model && W.selectionManager && typeof WazeWrap !== 'undefined' && WazeWrap.Ready) {
            currentLang = detectLanguage();
            initSuite();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries + 1), 200);
        }
    }
    bootstrap();

    function initSuite() {
        console.log('Abdullah-Abbas Suite: Ready (' + currentLang + ').');
        injectCss();

        // Force new default colors by using a new key or overwriting if missing
        // Using "AASpeedFilterSettings_v52" to ensure fresh colors load
        var savedSpeed = localStorage.getItem('AASpeedFilterSettings_v52');
        if(savedSpeed) try { _speedSettings = JSON.parse(savedSpeed); } catch(e){}

        try {
            if(window.require) {
                WazeActionUpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
                WazeActionMoveNode = require('Waze/Action/MoveNode');
                WazeActionMultiAction = require('Waze/Action/MultiAction');
            }
        } catch(e) { console.error("Abdullah-Abbas: Module Error", e); }

        initSidebar();
        hideWazeWrapAggressive();

        // Init Original Windows (EXACTLY from v41)
        initCityWindow();
        initVenueWindow();
        initCityPlacesWindow();
        initEditorWindow();
        initRoundaboutWindow();
        initLockLayer();
        initLockWindow();

        // Init New Independent Layer
        initSpeedFilterLayer();
    }

    function getId(node) { return document.getElementById(node); }

    function updateLanguage(newLang) {
        currentLang = newLang;
        localStorage.setItem('AbdullahAbbas_Lang', currentLang);
        initSidebar();
        document.querySelectorAll('.aa-panel').forEach(e => e.remove());
        initCityWindow(); initVenueWindow(); initCityPlacesWindow(); initEditorWindow(); initRoundaboutWindow(); initLockWindow();
    }

    // ===========================================================================
    //  Helper: Safe Repo Access (Core of v41 Stability)
    // ===========================================================================
    function getAllObjects(modelName) {
        var repo = W.model[modelName];
        if (!repo) return [];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    // ===========================================================================
    //  1. Sidebar
    // ===========================================================================
    function initSidebar() {
        var userTabs = getId('user-info');
        if (!userTabs) { setTimeout(initSidebar, 200); return; }

        if(getId('aa-suite-addon')) getId('aa-suite-addon').remove();
        var existingTab = document.querySelector('ul.nav-tabs li a[href="#aa-suite-addon"]');
        if(existingTab) existingTab.parentElement.remove();

        var navTabs = userTabs.getElementsByClassName('nav-tabs')[0];
        var tabContent = userTabs.getElementsByClassName('tab-content')[0];
        if(!navTabs || !tabContent) { setTimeout(initSidebar, 200); return; }

        var addon = document.createElement('section');
        addon.id = "aa-suite-addon";
        addon.className = "tab-pane";

        var optionsHtml = supportedLangs.map(l => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>`).join('');

        addon.innerHTML = `
            <div style="padding:15px; text-align:center; font-family:'Cairo', sans-serif; direction: ${_dir()};">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:10px; font-size:14px; border-bottom: 2px solid #DAA520; padding-bottom: 8px;">
                    ${_t('tools_title')}
                </div>
                <div style="margin-bottom: 15px;">
                    <select id="aa-lang-select" class="aa-input aa-lang-dropdown">${optionsHtml}</select>
                </div>
                <button id="btnOpenCity" class="aa-main-btn aa-btn-gold"><i class="fa fa-building"></i> ${_t('btn_city')}</button>
                <button id="btnOpenVenue" class="aa-main-btn aa-btn-blue"><i class="fa fa-map-marker"></i> ${_t('btn_places')}</button>
                <button id="btnOpenCityPlaces" class="aa-main-btn aa-btn-teal"><i class="fa fa-list-ol"></i> ${_t('btn_city_places')}</button>
                <button id="btnOpenEditor" class="aa-main-btn aa-btn-purple"><i class="fa fa-users"></i> ${_t('btn_editors')}</button>
                <button id="btnOpenRA" class="aa-main-btn aa-btn-green"><i class="fa fa-refresh"></i> ${_t('btn_ra')}</button>
                <button id="btnOpenSpeed" class="aa-main-btn aa-btn-cyan"><i class="fa fa-lock"></i> ${_t('btn_speed')}</button>

                <hr style="margin:5px 0; border:0; border-top:1px solid #ccc;">
                <button id="btnOpenSpeedFilter" class="aa-main-btn aa-btn-red"><i class="fa fa-tachometer"></i> ${_t('btn_speed_filter')}</button>

                <div style="margin-top:20px; font-size:10px; color:#aaa;">v${wmech_version}</div>
            </div>
        `;

        var newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#aa-suite-addon" data-toggle="tab">Abdullah Abbas Tools</a>';
        navTabs.appendChild(newtab);
        tabContent.appendChild(addon);

        getId('aa-lang-select').onchange = (e) => updateLanguage(e.target.value);
        getId('btnOpenCity').onclick = () => { toggleWindow('AACityWindow', createCityUI); };
        getId('btnOpenVenue').onclick = () => { toggleWindow('AAVenueWindow', createVenueUI); };
        getId('btnOpenCityPlaces').onclick = () => { toggleWindow('AACityPlacesWindow', createCityPlacesUI); };
        getId('btnOpenEditor').onclick = () => { toggleWindow('AAEditorWindow', createEditorUI); };
        getId('btnOpenRA').onclick = () => { toggleWindow('RAUtilWindow', createRAUI); };
        getId('btnOpenSpeed').onclick = () => { toggleWindow('AASpeedWindow', createLockUI); };

        // New Button
        getId('btnOpenSpeedFilter').onclick = () => { toggleWindow('AASpeedFilterWindow', createSpeedFilterUI); };
    }

    function toggleWindow(id, createFunc) {
        var el = getId(id);
        if (!el) {
            createFunc();
            el = getId(id);
            el.style.display = 'block';
            loadSettings(id, el);
            if(id === 'RAUtilWindow') checkRASelection();
            if(id === 'AASpeedWindow') scanLocks();
            if(id === 'AASpeedFilterWindow') scanSpeedFilter();
            return;
        }

        el.style.display = (el.style.display === 'none' ? 'block' : 'none');
        if (el.style.display === 'block') {
            loadSettings(id, el);
            if(id === 'RAUtilWindow') checkRASelection();
            if(id === 'AASpeedWindow') scanLocks();
            if(id === 'AASpeedFilterWindow') scanSpeedFilter();
        }
    }

    function hideWazeWrapAggressive() {
        var style = document.createElement('style');
        style.innerHTML = `ul.nav-tabs li a[href*="WazeWrap"], ul.nav-tabs li a:contains("WazeWrap") { display: none !important; }`;
        document.head.appendChild(style);
    }

    // ===========================================================================
    //  2. PART 2: THE ORIGINAL V41 CODE (EXACT COPY - NO MODS)
    // ===========================================================================

    // --- Lock Layer (v41) ---
    function initLockLayer() {
        var saved = localStorage.getItem('AALockSettings');
        if(saved) try {
            _lockSettings = JSON.parse(saved);
            if(!_lockSettings.locks) _lockSettings.locks = { 1:true, 2:true, 3:true, 4:true, 5:true, 6:true };
        } catch(e){}

        if (typeof OpenLayers === 'undefined') return;

        if (!_lockLayer) {
            var style = new OpenLayers.Style({
                externalGraphic: "${iconUrl}",
                graphicWidth: 34,
                graphicHeight: 34,
                graphicOpacity: "${opacity}",
                cursor: "pointer",
                graphicZIndex: 9999
            });

            _lockLayer = new OpenLayers.Layer.Vector("AbdullahAbbas_Lock_Layer", {
                displayInLayerSwitcher: true,
                uniqueName: "AbdullahAbbas_Lock_Layer",
                styleMap: new OpenLayers.StyleMap(style),
                rendererOptions: { zIndexing: true }
            });

            W.map.addLayer(_lockLayer);
        }
    }

    function getSegments() {
        if(W.model.segments.getObjectArray) return W.model.segments.getObjectArray();
        if(W.model.segments.objects) return Object.values(W.model.segments.objects);
        return [];
    }

    function scanLocks() {
        if (!_lockLayer) initLockLayer();
        _lockLayer.removeAllFeatures();

        var features = [];
        var extent = W.map.getExtent();
        var segments = getSegments();

        segments.forEach(function(seg) {
            var attr = seg.attributes || seg;
            var geo = seg.geometry ? seg.geometry : (seg.getOLGeometry ? seg.getOLGeometry() : null);

            if (!geo) return;
            if (!extent.intersectsBounds(geo.getBounds())) return;

            if (!_lockSettings.showRoundabout && attr.junctionID) return;

            var lockRank = (attr.lockRank || 0);
            var displayLevel = lockRank + 1;

            if (_lockSettings.locks && _lockSettings.locks[displayLevel] === false) return;

            var fwd = attr.fwdMaxSpeed;
            var rev = attr.revMaxSpeed;
            var speedVal = (fwd !== null ? fwd : (rev !== null ? rev : "-"));

            var iconUrl = getLockIconSVG(speedVal, displayLevel);
            var center = geo.getCentroid();

            var feat = new OpenLayers.Feature.Vector(center, {
                iconUrl: iconUrl,
                opacity: _lockSettings.opacity
            });
            features.push(feat);
        });
        _lockLayer.addFeatures(features);
    }

    function clearLocks() {
        if (_lockLayer) _lockLayer.removeAllFeatures();
    }

    function getLockIconSVG(speed, level) {
        var color = "#808080";
        var isMulti = false;
        var sizeScale = 1.0;
        if (level === 1) color = "#808080";
        else if (level === 2) color = "#FFD700";
        else if (level === 3) color = "#008000";
        else if (level === 4) color = "#0000FF";
        else if (level === 5) color = "#800080";
        else if (level >= 6) { isMulti = true; sizeScale = 1.3; }
        var p = "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z";
        var defs = "";
        var fill = `fill="${color}"`;
        if (isMulti) {
            defs = `<defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:red"/><stop offset="20%" style="stop-color:orange"/><stop offset="40%" style="stop-color:yellow"/><stop offset="60%" style="stop-color:green"/><stop offset="80%" style="stop-color:blue"/><stop offset="100%" style="stop-color:purple"/></linearGradient></defs>`;
            fill = `fill="url(#g1)"`;
        }
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="white" stroke="black" stroke-width="1.5" />${defs}<g transform="translate(0,0) scale(${1.0 * sizeScale})"><path d="${p}" ${fill} stroke="black" stroke-width="0.5" /></g><text x="12" y="22" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle" fill="black">L${level}</text></svg>`;
        return "data:image/svg+xml;base64," + btoa(svg);
    }

    // --- Lock Window ---
    function initLockWindow(forceUpdate = false) { var Win = getId("AASpeedWindow"); if (forceUpdate && Win) Win.remove(); window.toggleAASpeed = function() { var el = getId("AASpeedWindow"); if(!el) { createLockUI(); el = getId("AASpeedWindow"); } toggleWindow('AASpeedWindow', createLockUI); }; }
    function createLockUI() {
        var Win = createPanel('AASpeedWindow', WIN_W, WIN_H, _t('win_speed'));
        const bgColors = { 1: '#e0e0e0', 2: '#fff9c4', 3: '#c8e6c9', 4: '#bbdefb', 5: '#e1bee7', 6: '#ffcc80' };
        var locksHtml = '';
        for(let i=1; i<=6; i++) {
            let checked = _lockSettings.locks[i] !== false ? 'checked' : '';
            locksHtml += `<label style="background:${bgColors[i]}; padding:5px; border-radius:4px; display:flex; align-items:center; gap:5px; font-size:12px; cursor:pointer; border:1px solid #aaa;"><input type="checkbox" id="spd-l-${i}" ${checked}> <b>L${i}</b></label>`;
        }
        Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box"><div style="margin-bottom:10px;"><label style="cursor:pointer; font-size:13px; font-weight:bold;"><input type="checkbox" id="spd-enable" ${_lockSettings.enabled?'checked':''}> ${_t('spd_enable')}</label></div><div style="margin-bottom:10px;"><label style="cursor:pointer; font-size:12px;"><input type="checkbox" id="spd-ra" ${_lockSettings.showRoundabout?'checked':''}> ${_t('spd_roundabout')}</label></div><hr style="margin:8px 0; border:0; border-top:1px solid #ccc;"><div style="font-size:12px; font-weight:bold; margin-bottom:5px;">${_t('spd_filter_title')}</div><div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-bottom:10px;">${locksHtml}</div><div style="margin-bottom:10px;"><div style="font-size:12px; font-weight:bold;">${_t('spd_opacity')}</div><input type="range" id="spd-op" min="0.1" max="1" step="0.1" value="${_lockSettings.opacity}" style="width:100%;"></div><div style="display:flex; gap:5px;"><button id="spd-scan" class="aa-btn aa-btn-cyan" style="flex:1;">${_t('btn_scan')}</button><button id="spd-clear" class="aa-btn aa-btn-gray" style="width:auto;">${_t('btn_clear')}</button></div></div>`;
        document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AASpeedWindow');
        function saveSpd() { _lockSettings.enabled = getId('spd-enable').checked; _lockSettings.showRoundabout = getId('spd-ra').checked; _lockSettings.opacity = parseFloat(getId('spd-op').value); for(let i=1; i<=6; i++) { _lockSettings.locks[i] = getId('spd-l-'+i).checked; } localStorage.setItem('AALockSettings', JSON.stringify(_lockSettings)); }
        getId('spd-scan').onclick = function() { saveSpd(); scanLocks(); }; getId('spd-clear').onclick = clearLocks; Win.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.onchange = saveSpd); getId('spd-op').onchange = saveSpd;
    }

    // --- City Window (v41 Code) ---
    function initCityWindow(forceUpdate = false) { var Win = getId("AACityWindow"); if (forceUpdate && Win) Win.remove(); window.toggleAACity = function() { var el = getId("AACityWindow"); if(!el) { createCityUI(); el = getId("AACityWindow"); } toggleWindow('AACityWindow', createCityUI); }; }
    function createCityUI() { var Win = createPanel('AACityWindow', WIN_W, WIN_H, _t('win_city')); Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box"><div class="aa-input-wrapper"><input type="text" id="aa-city-input" class="aa-input" placeholder="${_t('ph_city')}"><span class="aa-search-icon-btn" id="aa-city-icon"><i class="fa fa-search"></i></span></div><div style="display:flex; gap:5px; margin-top:5px;"><button id="aa-btn-scan-city" class="aa-btn aa-btn-gold" style="flex:1;">${_t('btn_scan')}</button><button id="aa-btn-clear-city" class="aa-btn aa-btn-gray" style="width:auto; min-width:60px;">${_t('btn_clear')}</button></div></div><div id="aa-city-results" class="aa-results-box"><div class="aa-empty-msg">${_t('msg_empty')}</div></div><div class="aa-footer-row"><button id="aa-city-deselect" class="aa-btn-tiny" style="width:100%">${_t('btn_deselect')}</button></div>`; document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AACityWindow'); loadSettings('AACityWindow', Win); getId('aa-btn-scan-city').onclick = runCityScan; getId('aa-city-icon').onclick = runCityScan; getId('aa-city-input').onkeyup = (e) => { if(e.key==="Enter") runCityScan(); }; getId('aa-city-deselect').onclick = function() { try{W.selectionManager.unselectAll();}catch(e){} }; getId('aa-btn-clear-city').onclick = function() { getId('aa-city-input').value = ''; getId('aa-city-results').innerHTML = `<div class="aa-empty-msg">${_t('msg_cleared')}</div>`; try { W.selectionManager.unselectAll(); } catch(e) {} }; }
    function runCityScan() { var res = getId('aa-city-results'); res.innerHTML = `<div style="padding:10px;text-align:center;">${_t('msg_search')}</div>`; var query = normalize(getId('aa-city-input').value); var extent = W.map.getExtent(); setTimeout(() => { res.innerHTML = ''; var displayData = {}; var count = 0; for (var s in W.model.segments.objects) { var obj = W.model.segments.objects[s]; var geo = obj.getOLGeometry ? obj.getOLGeometry() : null; if (!geo || !extent.intersectsBounds(geo.getBounds())) continue; var cName = "No City"; var sName = "Unnamed"; var stID = obj.attributes.primaryStreetID; if(stID) { var st = W.model.streets.objects[stID]; if(st) { if(st.name) sName = st.name; if(st.attributes.cityID) { var c = W.model.cities.objects[st.attributes.cityID]; if(c && c.attributes.name) cName = c.attributes.name; } } } if(cName === "No City") cName = (currentLang === 'ar-IQ') ? "بدون مدينة" : "No City"; if(sName === "Unnamed") sName = (currentLang === 'ar-IQ') ? "بلا اسم" : "Unnamed"; if (query === "" || normalize(cName).includes(query) || normalize(sName).includes(query)) { if (!displayData[cName]) displayData[cName] = { count: 0, objs: [] }; displayData[cName].count++; displayData[cName].objs.push(obj); count++; } } if (count === 0) { res.innerHTML = `<div class="aa-empty-msg">${_t('msg_no_res')}</div>`; return; } Object.keys(displayData).sort().forEach(k => { var r = document.createElement('div'); r.className = 'aa-item-row'; r.innerHTML = `<div style="flex:1;">${k}</div><span class="aa-tag">${displayData[k].count}</span>`; r.onclick = () => { res.querySelectorAll('.aa-item-row').forEach(x => x.style.background = 'transparent'); r.style.background = '#fff3cd'; selectModels(displayData[k].objs); }; res.appendChild(r); }); }, 50); }

    // --- Venue Window (v41 Code) ---
    function initVenueWindow(forceUpdate = false) { var Win = getId("AAVenueWindow"); if (forceUpdate && Win) Win.remove(); window.toggleAAVenue = function() { var el = getId("AAVenueWindow"); if(!el) { createVenueUI(); el = getId("AAVenueWindow"); } toggleWindow('AAVenueWindow', createVenueUI); }; }
    function createVenueUI() { var Win = createPanel('AAVenueWindow', WIN_W, WIN_H, _t('win_places')); Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box"><div class="aa-input-wrapper"><input type="text" id="aa-venue-input" class="aa-input" placeholder="${_t('ph_places')}"><span class="aa-search-icon-btn" id="aa-venue-icon"><i class="fa fa-search"></i></span></div><div style="display:flex; gap:5px; margin-top:5px;"><button id="aa-btn-scan-venue" class="aa-btn aa-btn-blue" style="flex:1;">${_t('btn_scan')}</button><button id="aa-btn-clear-venue" class="aa-btn aa-btn-gray" style="width:auto; min-width:60px;">${_t('btn_clear')}</button></div></div><div id="aa-venue-results" class="aa-results-box"><div class="aa-empty-msg">${_t('msg_empty')}</div></div><div class="aa-footer-row"><button id="aa-venue-deselect" class="aa-btn-tiny" style="width:100%">${_t('btn_deselect')}</button></div>`; document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AAVenueWindow'); getId('aa-btn-scan-venue').onclick = runVenueScan; getId('aa-venue-icon').onclick = runVenueScan; getId('aa-venue-input').onkeyup = (e) => { if(e.key==="Enter") runVenueScan(); }; getId('aa-venue-deselect').onclick = function() { try{W.selectionManager.unselectAll();}catch(e){} }; getId('aa-btn-clear-venue').onclick = function() { getId('aa-venue-input').value = ''; getId('aa-venue-results').innerHTML = `<div class="aa-empty-msg">${_t('msg_cleared')}</div>`; try { W.selectionManager.unselectAll(); } catch(e) {} }; }
    function runVenueScan() { var res = getId('aa-venue-results'); res.innerHTML = `<div style="padding:10px;text-align:center;">${_t('msg_search')}</div>`; var query = normalize(getId('aa-venue-input').value); var extent = W.map.getExtent(); setTimeout(() => { res.innerHTML = ''; var displayData = {}; var count = 0; for (var v in W.model.venues.objects) { var obj = W.model.venues.objects[v]; var geo = obj.getOLGeometry ? obj.getOLGeometry() : obj.geometry; if (!geo) continue; var bounds = geo.getBounds(); if(!bounds || !extent.intersectsBounds(bounds)) continue; var vName = obj.attributes.name; if(!vName || vName.trim() === "") vName = (currentLang === 'ar-IQ') ? "بلا اسم" : "Unnamed"; if (query === "" || normalize(vName).includes(query)) { if (!displayData[vName]) displayData[vName] = { count: 0, objs: [] }; displayData[vName].count++; displayData[vName].objs.push(obj); count++; } } if (count === 0) { res.innerHTML = `<div class="aa-empty-msg">${_t('msg_no_res')}</div>`; return; } Object.keys(displayData).sort().forEach(k => { var r = document.createElement('div'); r.className = 'aa-item-row'; r.innerHTML = `<div style="flex:1;">${k}</div><span class="aa-tag">${displayData[k].count}</span>`; r.onclick = () => { res.querySelectorAll('.aa-item-row').forEach(x => x.style.background = 'transparent'); r.style.background = '#dbeeff'; selectModels(displayData[k].objs); }; res.appendChild(r); }); }, 50); }

    // --- City Places (v41 Code) ---
    function initCityPlacesWindow() { var Win=getId("AACityPlacesWindow"); if(Win)Win.remove(); window.toggleAACityPlaces=()=>{ toggleWindow('AACityPlacesWindow', createCityPlacesUI); }; }
    function createCityPlacesUI() { var Win = createPanel('AACityPlacesWindow', WIN_W, WIN_H, _t('win_city_places')); Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box"><div style="display:flex; gap:5px; margin-top:5px;"><button id="aa-btn-scan-cp" class="aa-btn aa-btn-teal" style="flex:1;">${_t('btn_scan')}</button><button id="aa-btn-clear-cp" class="aa-btn aa-btn-gray" style="width:auto; min-width:60px;">${_t('btn_clear')}</button></div></div><div id="aa-cp-results" class="aa-results-box"><div class="aa-empty-msg">${_t('msg_empty')}</div></div><div class="aa-footer-row"><button id="aa-cp-deselect" class="aa-btn-tiny" style="width:100%">${_t('btn_deselect')}</button></div>`; document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AACityPlacesWindow'); getId('aa-btn-scan-cp').onclick = runCityPlacesScan; getId('aa-cp-deselect').onclick = function() { try{W.selectionManager.unselectAll();}catch(e){} }; getId('aa-btn-clear-cp').onclick = function() { getId('aa-cp-results').innerHTML = `<div class="aa-empty-msg">${_t('msg_cleared')}</div>`; try { W.selectionManager.unselectAll(); } catch(e) {} }; }
    function runCityPlacesScan() { var res = getId('aa-cp-results'); res.innerHTML = `<div style="padding:10px;text-align:center;">${_t('msg_search')}</div>`; var extent = W.map.getExtent(); setTimeout(() => { res.innerHTML = ''; var displayData = {}; var count = 0; for (var v in W.model.venues.objects) { var obj = W.model.venues.objects[v]; var geo = obj.getOLGeometry ? obj.getOLGeometry() : obj.geometry; if (!geo) continue; var bounds = geo.getBounds(); if(!bounds || !extent.intersectsBounds(bounds)) continue; var cName = null; var stID = obj.attributes.streetID; if(stID) { var st = W.model.streets.objects[stID]; if(st && st.attributes.cityID) { var c = W.model.cities.objects[st.attributes.cityID]; if(c && c.attributes.name) cName = c.attributes.name; } } if(!cName || cName.trim() === "") cName = (currentLang === 'ar-IQ') ? "بدون مدينة" : "No City"; if (!displayData[cName]) displayData[cName] = { count: 0, objs: [] }; displayData[cName].count++; displayData[cName].objs.push(obj); count++; } if (count === 0) { res.innerHTML = `<div class="aa-empty-msg">${_t('msg_no_res')}</div>`; return; } Object.keys(displayData).sort().forEach(k => { var r = document.createElement('div'); r.className = 'aa-item-row'; r.innerHTML = `<div style="flex:1;">${k}</div><span class="aa-tag">${displayData[k].count}</span>`; r.onclick = () => { res.querySelectorAll('.aa-item-row').forEach(x => x.style.background = 'transparent'); r.style.background = '#ffe8cc'; selectModels(displayData[k].objs); }; res.appendChild(r); }); }, 50); }

    // --- Editor Window (v41 Code) ---
    function initEditorWindow() { var Win=getId("AAEditorWindow"); if(Win)Win.remove(); window.toggleAAEditor=()=>{ toggleWindow('AAEditorWindow', createEditorUI); }; }
    function createEditorUI() { var Win = createPanel('AAEditorWindow', WIN_W, WIN_H, _t('win_editors')); Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box"><div class="aa-input-wrapper"><input type="text" id="aa-editor-input" class="aa-input" placeholder="${_t('ph_editor')}"><span class="aa-search-icon-btn" id="aa-edit-icon"><i class="fa fa-search"></i></span></div><div style="margin-top:5px; font-size:11px; display:flex; align-items:center; gap:5px;"><span>${_t('lbl_days')}</span><input type="number" id="aa-days-input" class="aa-small-input" placeholder="D" style="width:30px;"></div><div style="display:flex; gap:5px; margin-top:5px;"><button id="aa-btn-scan-editor" class="aa-btn aa-btn-purple" style="flex:1;">${_t('btn_analyze')}</button><button id="aa-btn-clear-editor" class="aa-btn aa-btn-gray" style="width:auto; min-width:60px;">${_t('btn_clear')}</button></div></div><div id="aa-editor-results" class="aa-results-box"><div class="aa-empty-msg">${_t('msg_analyze')}</div></div><div class="aa-footer-row"><button id="aa-editor-deselect" class="aa-btn-tiny" style="width:100%">${_t('btn_deselect')}</button></div>`; document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AAEditorWindow'); getId('aa-btn-scan-editor').onclick = runEditorScan; getId('aa-edit-icon').onclick = runEditorScan; getId('aa-editor-input').onkeyup = (e) => { if(e.key==="Enter") runEditorScan(); }; getId('aa-editor-deselect').onclick = function() { try{W.selectionManager.unselectAll();}catch(e){} }; getId('aa-btn-clear-editor').onclick = function() { getId('aa-editor-input').value = ''; getId('aa-days-input').value = ''; getId('aa-editor-results').innerHTML = `<div class="aa-empty-msg">${_t('msg_cleared')}</div>`; try { W.selectionManager.unselectAll(); } catch(e) {} }; }
    function runEditorScan() { var res = getId('aa-editor-results'); res.innerHTML = `<div style="padding:10px;text-align:center;">${_t('msg_analyze')}</div>`; var query = normalize(getId('aa-editor-input').value); var days = parseInt(getId('aa-days-input').value); var extent = W.map.getExtent(); var cutoff = null; if(!isNaN(days) && days > 0) { cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days); } setTimeout(() => { res.innerHTML = ''; var displayData = {}; var count = 0; function process(obj) { var geo = obj.getOLGeometry ? obj.getOLGeometry() : null; if (!geo) { var center = obj.getCenter(); if (!center || !extent.containsLonLat(center)) return; } else { if (!extent.intersectsBounds(geo.getBounds())) return; } var attr = obj.attributes || obj; var uid = attr.updatedBy || attr.createdBy; var uon = attr.updatedOn || attr.createdOn; if (cutoff && uon && new Date(uon) < cutoff) return; if (uid) { var u = W.model.users.objects[uid]; var uname = u ? u.attributes.userName : "ID:" + uid; if (query === "" || normalize(uname).includes(query)) { if (!displayData[uname]) displayData[uname] = { count: 0, objs: [] }; displayData[uname].count++; displayData[uname].objs.push(obj); count++; } } } for (var s in W.model.segments.objects) process(W.model.segments.objects[s]); for (var v in W.model.venues.objects) process(W.model.venues.objects[v]); if (count === 0) { res.innerHTML = `<div class="aa-empty-msg">${_t('msg_no_res')}</div>`; return; } Object.keys(displayData).sort((a,b) => displayData[b].count - displayData[a].count).forEach(k => { var r = document.createElement('div'); r.className = 'aa-item-row'; r.innerHTML = `<div style="flex:1;">${k}</div><span class="aa-tag">${displayData[k].count}</span>`; r.onclick = () => { res.querySelectorAll('.aa-item-row').forEach(x => x.style.background = 'transparent'); r.style.background = '#e2e6ea'; selectModels(displayData[k].objs); }; res.appendChild(r); }); }, 50); }

    // --- Roundabout Window (v41 Code) ---
    function initRoundaboutWindow() { var Win=getId("RAUtilWindow"); if(Win)Win.remove(); window.toggleAARoundabout=()=>{ toggleWindow('RAUtilWindow', createRAUI); }; }
    function createRAUI() { var Win = createPanel('RAUtilWindow', WIN_W, WIN_H, _t('win_ra')); Win.querySelector('.aa-content').innerHTML = `<div class="aa-section-box" style="text-align:center;"><div class="aa-input-wrapper" style="margin-bottom:8px;"><span style="font-size:12px; font-weight:bold;">${_t('unit_m')}: </span><input type="number" id="ra-val" class="aa-small-input" value="1" style="width:60px; font-weight:bold;"></div><div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-bottom:10px;"><div></div><button id="ra-up" class="aa-btn aa-btn-arrow aa-btn-large-icon">▲</button><div></div><button id="ra-left" class="aa-btn aa-btn-arrow aa-btn-large-icon">◄</button><button id="ra-down" class="aa-btn aa-btn-arrow aa-btn-large-icon">▼</button><button id="ra-right" class="aa-btn aa-btn-arrow aa-btn-large-icon">►</button></div><div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;"><button id="ra-rot-l" class="aa-btn aa-btn-rot" title="Left">↺</button><button id="ra-rot-r" class="aa-btn aa-btn-rot" title="Right">↻</button><button id="ra-shrink" class="aa-btn aa-btn-size" title="In"><b>${_t('ra_in')}</b></button><button id="ra-expand" class="aa-btn aa-btn-size" title="Out"><b>${_t('ra_out')}</b></button></div><div id="ra-msg" style="margin-top:8px; font-size:11px; font-weight:bold; color:#777; border-top:1px solid #eee; padding-top:5px;">${_t('ra_err')}</div></div>`; document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'RAUtilWindow'); getId('ra-up').onclick=()=>runRA('ShiftLat',1); getId('ra-down').onclick=()=>runRA('ShiftLat',-1); getId('ra-left').onclick=()=>runRA('ShiftLong',-1); getId('ra-right').onclick=()=>runRA('ShiftLong',1); getId('ra-rot-l').onclick=()=>runRA('Rotate',-1); getId('ra-rot-r').onclick=()=>runRA('Rotate',1); getId('ra-shrink').onclick=()=>runRA('Diameter',-1); getId('ra-expand').onclick=()=>runRA('Diameter',1); checkRASelection(); }
    function checkRASelection() { var RAWindow = getId('RAUtilWindow'); if(!RAWindow || RAWindow.style.display === 'none') return; var isRA = false; var sel = W.selectionManager.getSelectedFeatures(); if(sel.length > 0 && sel[0].model.type === 'segment') { if(WazeWrap.Model.isRoundaboutSegmentID(sel[0].model.attributes.id)) isRA = true; } var msg = getId('ra-msg'); if(msg) { msg.innerText = isRA ? _t('ra_ready') : _t('ra_err'); msg.style.color = isRA ? "green" : "red"; } }
    function runRA(action, multiplier) { if (!WazeActionUpdateSegmentGeometry) { try { WazeActionUpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry'); WazeActionMoveNode = require('Waze/Action/MoveNode'); WazeActionMultiAction = require('Waze/Action/MultiAction'); } catch(e) { return; } } var val = parseFloat(getId('ra-val').value) * multiplier; var segs = WazeWrap.getSelectedFeatures(); if(!segs || segs.length === 0) return; var segObj = segs[0]; try { if(action === 'ShiftLong') { var c = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]); var off = WazeWrap.Geometry.CalculateLongOffsetGPS(val, c.lon, c.lat); ShiftSegmentsNodesLong(segObj, off); } else if(action === 'ShiftLat') { var c = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]); var off = WazeWrap.Geometry.CalculateLatOffsetGPS(val, c.lon, c.lat); ShiftSegmentNodesLat(segObj, off); } else if(action === 'Rotate') RotateRA(segObj, val); else if(action === 'Diameter') ChangeDiameter(segObj, multiplier); } catch (e) { console.error("RA Error", e); } }
    function ShiftSegmentNodesLat(segObj, latOffset){ var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj); var multiaction = new WazeActionMultiAction(); for(let i=0; i<RASegs.length; i++){ segObj = W.model.segments.getObjectById(RASegs[i]); var newGeometry = fastClone(segObj.attributes.geoJSONGeometry); for(let j=1; j < newGeometry.coordinates.length-1; j++) newGeometry.coordinates[j][1] += latOffset; multiaction.doSubAction(W.model, new WazeActionUpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry)); var node = W.model.nodes.objects[segObj.attributes.toNodeID]; if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID]; var newNodeGeometry = fastClone(node.attributes.geoJSONGeometry); newNodeGeometry.coordinates[1] += latOffset; var connectedSegObjs = {}; for(var k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry); multiaction.doSubAction(W.model, new WazeActionMoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {})); } W.model.actionManager.add(multiaction); }
    function ShiftSegmentsNodesLong(segObj, longOffset){ var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj); var multiaction = new WazeActionMultiAction(); for(let i=0; i<RASegs.length; i++){ segObj = W.model.segments.getObjectById(RASegs[i]); var newGeometry = fastClone(segObj.attributes.geoJSONGeometry); for(let j=1; j < newGeometry.coordinates.length-1; j++) newGeometry.coordinates[j][0] += longOffset; multiaction.doSubAction(W.model, new WazeActionUpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry)); var node = W.model.nodes.objects[segObj.attributes.toNodeID]; if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID]; var newNodeGeometry = fastClone(node.attributes.geoJSONGeometry); newNodeGeometry.coordinates[0] += longOffset; var connectedSegObjs = {}; for(let k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry); multiaction.doSubAction(W.model, new WazeActionMoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {})); } W.model.actionManager.add(multiaction); }
    function RotateRA(segObj, angle){ var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj); var raCenter = W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates; var multiaction = new WazeActionMultiAction(); for(let i=0; i<RASegs.length; i++){ segObj = W.model.segments.getObjectById(RASegs[i]); var newGeometry = fastClone(segObj.attributes.geoJSONGeometry); var center = raCenter; var segPoints = []; for(let j=0; j<segObj.attributes.geoJSONGeometry.coordinates.length;j++) segPoints.push(new OpenLayers.Geometry.Point(segObj.attributes.geoJSONGeometry.coordinates[j][0], segObj.attributes.geoJSONGeometry.coordinates[j][1])); var newPoints = rotatePoints(center, segPoints, angle); for(let j=1; j<newGeometry.coordinates.length-1;j++) newGeometry.coordinates[j] = [newPoints[j].x, newPoints[j].y]; multiaction.doSubAction(W.model, new WazeActionUpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry)); var node = W.model.nodes.objects[segObj.attributes.toNodeID]; if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID]; var newNodeGeometry = fastClone(node.attributes.geoJSONGeometry); var nodePoints = [new OpenLayers.Geometry.Point(node.attributes.geoJSONGeometry.coordinates[0], node.attributes.geoJSONGeometry.coordinates[1]), new OpenLayers.Geometry.Point(node.attributes.geoJSONGeometry.coordinates[0], node.attributes.geoJSONGeometry.coordinates[1])]; var gps = rotatePoints(center, nodePoints, angle); newNodeGeometry.coordinates = [gps[0].x, gps[0].y]; var connectedSegObjs = {}; for(let k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry); multiaction.doSubAction(W.model, new WazeActionMoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {})); } W.model.actionManager.add(multiaction); }
    function ChangeDiameter(segObj, amount){ var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj); var raCenter = W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates; let { lon: centerX, lat: centerY } = WazeWrap.Geometry.ConvertTo900913(raCenter[0], raCenter[1]); var multiaction = new WazeActionMultiAction(); for(let i=0; i<RASegs.length; i++){ segObj = W.model.segments.getObjectById(RASegs[i]); var newGeometry = fastClone(segObj.attributes.geoJSONGeometry); for(let j=1; j < newGeometry.coordinates.length-1; j++){ let pt = segObj.attributes.geoJSONGeometry.coordinates[j]; let { lon: pointX, lat: pointY } = WazeWrap.Geometry.ConvertTo900913(pt[0], pt[1]); let h = Math.sqrt(Math.abs(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2))); let ratio = (h + amount)/h; let x = centerX + (pointX - centerX) * ratio; let y = centerY + (pointY - centerY) * ratio; let { lon: newX, lat: newY } = WazeWrap.Geometry.ConvertTo4326(x, y); newGeometry.coordinates[j] = [newX, newY]; } multiaction.doSubAction(W.model, new WazeActionUpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry)); var node = W.model.nodes.objects[segObj.attributes.toNodeID]; if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID]; var newNodeGeometry = fastClone(node.attributes.geoJSONGeometry); let { lon: pointX, lat: pointY } = WazeWrap.Geometry.ConvertTo900913(newNodeGeometry.coordinates[0], newNodeGeometry.coordinates[1]); let h = Math.sqrt(Math.abs(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2))); let ratio = (h + amount)/h; let x = centerX + (pointX - centerX) * ratio; let y = centerY + (pointY - centerY) * ratio; let { lon: newX, lat: newY } = WazeWrap.Geometry.ConvertTo4326(x, y); newNodeGeometry.coordinates = [newX, newY]; var connectedSegObjs = {}; for(let j=0;j<node.attributes.segIDs.length;j++) connectedSegObjs[node.attributes.segIDs[j]] = fastClone(W.model.segments.getObjectById(node.attributes.segIDs[j]).attributes.geoJSONGeometry); multiaction.doSubAction(W.model, new WazeActionMoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {})); } W.model.actionManager.add(multiaction); }
    function rotatePoints(origin, points, angle){ var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points),null,null); lineFeature.geometry.rotate(angle, new OpenLayers.Geometry.Point(origin[0], origin[1])); return [].concat(lineFeature.geometry.components); }
    function fastClone(obj) { return JSON.parse(JSON.stringify(obj)); }
    function normalize(text) { if(!text) return ""; return text.toString().toLowerCase().replace(/[أإآ]/g,'ا').replace(/[ى]/g,'ي').replace(/[ة]/g,'ه').trim(); }
    function selectModels(models) { try { W.selectionManager.setSelectedModels(models); } catch(e){} }
    function createPanel(id, width, top, title) { var div = document.createElement('div'); div.id = id; div.className = 'aa-panel ' + (_dir() === 'rtl' ? 'aa-rtl' : 'aa-ltr'); div.style.width = width; div.style.height = top; div.style.top = "100px"; div.style.display = 'none'; div.innerHTML = `<div class="aa-header"><span>${title}</span><span class="aa-close-btn" title="${_t('close')}">✖</span></div><div class="aa-content"></div>`; div.querySelector('.aa-close-btn').onclick = function(e) { e.stopPropagation(); div.style.display = 'none'; saveSettings(id, div); }; return div; }
    function saveSettings(id, el) { if(!el) return; var s = { top: el.style.top, left: el.style.left, width: el.style.width, height: el.style.height }; localStorage.setItem(id + '_settings', JSON.stringify(s)); }
    function loadSettings(id, el) { var s = JSON.parse(localStorage.getItem(id + '_settings')); if(s && el) { if(s.top) el.style.top = s.top; if(s.left) el.style.left = s.left; if(s.width) el.style.width = s.width; if(s.height) el.style.height = s.height; } }
    function makeDraggable(elmnt, handle, id) { var pos1=0, pos2=0, pos3=0, pos4=0; handle.onmousedown = function(e) { if(e.target.classList.contains('aa-close-btn')) return; e.preventDefault(); pos3=e.clientX; pos4=e.clientY; document.onmouseup = function() { document.onmouseup=null; document.onmousemove=null; saveSettings(elmnt.id, elmnt); }; document.onmousemove = function(e) { e.preventDefault(); pos1=pos3-e.clientX; pos2=pos4-e.clientY; pos3=e.clientX; pos4=e.clientY; elmnt.style.top = (elmnt.offsetTop-pos2)+"px"; elmnt.style.left = (elmnt.offsetLeft-pos1)+"px"; }; }; }

    // ===========================================================================
    //  2. PART 2: THE NEW INDEPENDENT SPEED FILTER
    // ===========================================================================

    // المتغيرات المستقلة لفلتر السرعة (Independent)
    // Using "_v52" key to force reload defaults for the user
    var _speedFilterSettings = {
        enabled: true,
        opacity: 0.7,
        ranges: [
            { min: 0, max: 40, color: '#00FF00', active: true },   // Green
            { min: 41, max: 60, color: '#008080', active: true },  // Teal
            { min: 61, max: 80, color: '#0000FF', active: true },  // Blue
            { min: 81, max: 100, color: '#4B0082', active: true }, // Indigo
            { min: 101, max: 120, color: '#800080', active: true },// Purple
            { min: 121, max: 140, color: '#FF00FF', active: true },// Magenta/Pink
            { min: 141, max: 999, color: '#FF0000', active: true } // Red
        ]
    };
    var _speedFilterLayer = null;

    function initSpeedFilterLayer() {
        var saved = localStorage.getItem('AASpeedFilterSettings_v52');
        if(saved) try { _speedFilterSettings = JSON.parse(saved); } catch(e){}

        if (typeof OpenLayers === 'undefined' || _speedFilterLayer) return;

        var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "${strokeColor}",
                strokeWidth: 6,
                strokeOpacity: "${strokeOpacity}",
                label: "${label}",
                fontColor: "black",
                fontSize: "11px",
                fontWeight: "bold",
                labelOutlineColor: "white",
                labelOutlineWidth: 3
            })
        });

        _speedFilterLayer = new OpenLayers.Layer.Vector("AbdullahAbbas_Speed_Gradient", {
            displayInLayerSwitcher: true,
            styleMap: styleMap,
            rendererOptions: { zIndexing: true }
        });

        W.map.addLayer(_speedFilterLayer);

        // Independent Event Listener
        W.map.events.register("moveend", null, () => {
            var win = getId('AASpeedFilterWindow');
            if(win && win.style.display === 'block') scanSpeedFilter();
        });
    }

    // Helper: Safe Repo Access (Repeated here to ensure independence if needed, though getAllObjects is global in closure)
    function getSegmentsForSpeed() {
        var repo = W.model['segments'];
        if (!repo) return [];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    function scanSpeedFilter() {
        if (!_speedFilterLayer) initSpeedFilterLayer();
        _speedFilterLayer.removeAllFeatures();
        if (!_speedFilterSettings.enabled) return;

        var features = [];
        var segments = getSegmentsForSpeed(); // Use Safe Access
        var extent = W.map.getExtent();

        segments.forEach(function(seg) {
            var geo = seg.geometry || (seg.getOLGeometry ? seg.getOLGeometry() : null);
            if (!geo || !extent.intersectsBounds(geo.getBounds())) return;
            var attr = seg.attributes || seg;

            // Get Max Speed
            var fwd = attr.fwdMaxSpeed || 0;
            var rev = attr.revMaxSpeed || 0;
            var speed = Math.max(fwd, rev);

            if (speed <= 0) return;

            // Find matching range
            var match = null;
            for(var i=0; i<_speedFilterSettings.ranges.length; i++) {
                var r = _speedFilterSettings.ranges[i];
                if(speed >= r.min && speed <= r.max) { match = r; break; }
            }

            if (match && match.active) {
                var center = geo.getCentroid();
                var feat = new OpenLayers.Feature.Vector(geo.clone(), {
                    strokeColor: match.color,
                    strokeOpacity: _speedFilterSettings.opacity,
                    label: speed + ""
                });
                features.push(feat);
            }
        });
        _speedFilterLayer.addFeatures(features);
    }

    function createSpeedFilterUI() {
        var Win = createPanel('AASpeedFilterWindow', WIN_W, WIN_H, _t('win_speed_filter'));

        var rows = '';
        _speedFilterSettings.ranges.forEach((r, idx) => {
            var label = r.max > 200 ? `${r.min}+` : `${r.min} - ${r.max}`;
            rows += `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; padding:6px; background:#fff; border-radius:4px; border:1px solid #ddd;">
                <label style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:12px; cursor:pointer;">
                    <input type="checkbox" id="sf_cb_${idx}" ${r.active ? 'checked' : ''}>
                    ${label}
                </label>
                <input type="color" id="sf_clr_${idx}" value="${r.color}" style="width:40px; height:25px; border:none; cursor:pointer; background:none;">
            </div>`;
        });

        Win.querySelector('.aa-content').innerHTML = `
            <div class="aa-section-box">
                <div style="margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #eee;">
                    <label style="font-weight:bold; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:5px;">
                        <input type="checkbox" id="sf_enable" ${_speedFilterSettings.enabled?'checked':''}> ${_t('sf_enable')}
                    </label>
                </div>

                <div style="margin-bottom:12px; max-height:280px; overflow-y:auto; padding-right:2px;">
                    ${rows}
                </div>

                <div style="margin-bottom:10px;">
                    <div style="font-size:12px; font-weight:bold; margin-bottom:5px;">${_t('spd_opacity')}</div>
                    <input type="range" id="sf_op" min="0.1" max="1" step="0.1" value="${_speedFilterSettings.opacity}" style="width:100%;">
                </div>

                <div style="display:flex; gap:5px;">
                    <button id="sf_apply" class="aa-btn aa-btn-red" style="flex:1;">${_t('sf_apply')}</button>
                    <button id="sf_clear" class="aa-btn aa-btn-gray" style="width:auto;">${_t('sf_clear')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(Win); makeDraggable(Win, Win.querySelector('.aa-header'), 'AASpeedFilterWindow');

        function saveSF() {
            _speedFilterSettings.enabled = getId('sf_enable').checked;
            _speedFilterSettings.opacity = parseFloat(getId('sf_op').value);
            _speedFilterSettings.ranges.forEach((r, idx) => {
                r.active = getId('sf_cb_' + idx).checked;
                r.color = getId('sf_clr_' + idx).value;
            });
            localStorage.setItem('AASpeedFilterSettings_v52', JSON.stringify(_speedFilterSettings));
            scanSpeedFilter();
        }

        getId('sf_apply').onclick = saveSF;
        getId('sf_clear').onclick = () => { _speedFilterLayer.removeAllFeatures(); }; // زر المسح
        getId('sf_enable').onchange = saveSF;
        getId('sf_op').onchange = saveSF;
        // Auto-save on color change
        _speedFilterSettings.ranges.forEach((r, idx) => {
            getId('sf_clr_' + idx).onchange = saveSF;
            getId('sf_cb_' + idx).onchange = saveSF;
        });
    }

    function injectCss() {
        var css = `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
            .aa-panel { position: fixed; background: #fff; border: 1px solid #ccc; border-radius: 8px; z-index: 999999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: 'Cairo', sans-serif; display:none; resize: both; overflow: auto; width: ${WIN_W}; height: ${WIN_H}; min-width: 250px; min-height: 250px; }
            .aa-rtl { direction: rtl; text-align: right; right: 300px; } .aa-ltr { direction: ltr; text-align: left; left: 60px; }
            .aa-header { background: #333; color: #fff; padding: 10px; font-weight: bold; border-radius: 7px 7px 0 0; cursor: move; display: flex; justify-content: space-between; align-items:center; font-size:14px; }
            .aa-close-btn { cursor: pointer; color: #ff6b6b; font-size: 16px; margin-right: 10px; } .aa-close-btn:hover { color: #ff0000; }
            .aa-content { padding: 10px; height: calc(100% - 40px); overflow-y: auto; background-color: #f9f9f9; box-sizing: border-box; }
            .aa-btn { width: 100%; padding: 8px; margin-top: 5px; cursor: pointer; border: none; border-radius: 4px; color: white; font-weight: bold; font-family: 'Cairo'; font-size: 13px; }
            .aa-btn-purple { background: linear-gradient(135deg, #9b59b6, #8e44ad); } .aa-btn-green { background: linear-gradient(135deg, #2ecc71, #27ae60); } .aa-btn-gold { background: linear-gradient(135deg, #f39c12, #d35400); } .aa-btn-blue { background: linear-gradient(135deg, #3498db, #2980b9); } .aa-btn-teal { background: linear-gradient(135deg, #1abc9c, #16a085); } .aa-btn-cyan { background: linear-gradient(135deg, #00BCD4, #0097A7); } .aa-btn-gray { background: linear-gradient(135deg, #95a5a6, #7f8c8d); } .aa-btn-red { background: linear-gradient(135deg, #e74c3c, #c0392b); } .aa-btn-orange { background: linear-gradient(135deg, #e67e22, #d35400); }
            .aa-btn-arrow { background: #34495e; color: white; } .aa-btn-rot { background: #e67e22; color: white; } .aa-btn-size { background: #16a085; color: white; }
            .aa-btn-mini { width: 30px; height: 30px; background: #eee; border: 1px solid #ccc; cursor: pointer; font-weight: bold; border-radius: 3px; font-size:12px; }
            .aa-btn-large-icon { width: 100%; height: 40px; font-size: 20px; display:flex; justify-content:center; align-items:center; border:1px solid #ccc; border-radius:4px; cursor:pointer; }
            .aa-input { width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-family: 'Cairo', sans-serif; font-size: 12px; }
            .aa-small-input { width: 50px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 4px; font-size: 12px; }
            select.aa-lang-dropdown { width: 100%; height: 32px !important; padding: 2px !important; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; text-align: center; cursor: pointer; font-size: 12px; font-family: 'Cairo', sans-serif; white-space: nowrap; text-overflow: ellipsis; appearance: auto; }
            .aa-item-row { padding: 6px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 12px; } .aa-item-row:hover { background: #d1ecf1; }
            .aa-tag { background: #eee; padding: 2px 6px; border-radius: 10px; font-size: 10px; }
            .aa-grid-arrows { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; width: 100px; margin: 0 auto; }
            .aa-search-icon-btn { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:#DAA520; cursor:pointer; font-size:14px; }
            .aa-rtl .aa-search-icon-btn { left: 8px; right: auto; } .aa-ltr .aa-search-icon-btn { right: 8px; left: auto; }
            .aa-input-wrapper { position:relative; } .aa-empty-msg { padding: 15px; text-align: center; color: #aaa; font-size: 12px; }
            .aa-results-box { max-height: 250px; overflow-y: auto; margin-top: 10px; border-top: 1px solid #eee; } .aa-results-box::-webkit-scrollbar { width: 5px; } .aa-results-box::-webkit-scrollbar-thumb { background: #DAA520; }
            .aa-sec-title { font-size:13px; font-weight:bold; margin-bottom:5px; border-bottom:1px solid #e0e0e0; padding-bottom:3px; }
            .aa-main-btn { width: 100%; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; color: white; display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom: 8px; transition: transform 0.1s; font-size:13px; } .aa-main-btn:active { transform: scale(0.98); }
            .aa-btn-tiny { padding: 4px 8px; font-size: 10px; background: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; color: #333; } .aa-btn-tiny:hover { background: #d0d0d0; } .aa-footer-row { margin-top: 10px; padding-top: 5px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; }
        `;
        var s = document.createElement('style'); s.innerHTML = css; document.head.appendChild(s);
    }
})();