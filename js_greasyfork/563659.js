// ==UserScript==
// @name         Abdullah Abbas WME Explorer
// @namespace    https://greasyfork.org/users/AbdullahAbbas
// @version      2026.01.27.01
// @description  WME Script: Cities, Places, Editors, Locks, Speed, and Update History (Bootstrap Integration)
// @author       Abdullah Abbas
// @copyright    2026, Abdullah Abbas
// @license      All Rights Reserved.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563659/Abdullah%20Abbas%20WME%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/563659/Abdullah%20Abbas%20WME%20Explorer.meta.js
// ==/UserScript==

/* global W, OpenLayers, $, bootstrap */

(function() {
    'use strict';

    let sdk = null;
    const STORAGE_KEY = 'aa_explorer_settings_2026_v27_01';
    let lockLayer = null;
    let speedLayer = null;
    let dateLayer = null;

    // --- Translations ---
    const TRANSLATIONS = {
        'ar': {
            title: 'مستكشف عبد الله عباس',
            btn_main: 'فتح المستكشف',
            sidebar_title: 'المستكشف',
            tab_cities: 'المدن',
            tab_places: 'الأماكن',
            tab_editors: 'المحررين',
            tab_locks: 'الأقفال',
            tab_speed: 'السرعة',
            tab_dates: 'تاريخ التحديث',
            btn_scan: 'فحص',
            btn_reset: 'مسح',
            filter_lock: 'تصفية حسب القفل',
            filter_speed: 'تصفية حسب السرعة',
            filter_date: 'تصفية حسب التاريخ',
            search_cities: 'بحث عن مدينة...',
            search_places: 'بحث عن مكان...',
            search_editors: 'بحث عن محرر...',
            col_name: 'الاسم',
            col_count: 'العدد',
            col_seg: 'شوارع',
            col_place: 'أماكن',
            msg_ready: 'جاهز',
            msg_scanning: 'جاري الفحص...',
            msg_no_data: 'لا توجد بيانات',
            msg_click_scan: 'اضغط "فحص" للبدء',
            msg_results: 'النتائج:',
            res_level: 'مستوى',
            res_speed: 'سرعة',
            res_no_speed: 'بدون سرعة',
            no_name: 'بدون اسم',
            lbl_d1: 'يوم',
            lbl_d2: '10 أيام',
            lbl_d3: '30 يوم',
            lbl_d4: '3 أشهر',
            lbl_d5: '6 أشهر',
            lbl_d6: '+6 أشهر',
            lbl_lang: 'اللغة'
        },
        'ckb': {
            title: 'پشکنەری عەبدوڵڵا عەباس',
            btn_main: 'کردنەوەی پشکنەر',
            sidebar_title: 'پشکنەر',
            tab_cities: 'شارەکان',
            tab_places: 'شوێنەکان',
            tab_editors: 'ئیدیتۆرەکان',
            tab_locks: 'قفڵەکان',
            tab_speed: 'خێرایی',
            tab_dates: 'بەرواری نوێکردنەوە',
            btn_scan: 'پشکنین',
            btn_reset: 'سڕینەوە',
            filter_lock: 'پاڵاوتن بەپێی قفڵ',
            filter_speed: 'پاڵاوتن بەپێی خێرایی',
            filter_date: 'پاڵاوتن بەپێی بەروار',
            search_cities: 'گەڕان بەدوای شار...',
            search_places: 'گەڕان بەدوای شوێن...',
            search_editors: 'گەڕان بەدوای ئیدیتۆر...',
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
            res_no_speed: 'بێ خێرایی',
            no_name: 'بێ ناو',
            lbl_d1: '1 ڕۆژ',
            lbl_d2: '10 ڕۆژ',
            lbl_d3: '30 ڕۆژ',
            lbl_d4: '3 مانگ',
            lbl_d5: '6 مانگ',
            lbl_d6: '+6 مانگ',
            lbl_lang: 'زمان'
        },
        'kmr': {
            title: 'Lêgerîna Abdullah Abbas',
            btn_main: 'Lêgerînê Veke',
            sidebar_title: 'Lêgerîn',
            tab_cities: 'Bajar',
            tab_places: 'Cih',
            tab_editors: 'Edîtor',
            tab_locks: 'Qefle',
            tab_speed: 'Lez',
            tab_dates: 'Dîroka Nûvekirinê',
            btn_scan: 'Kontrol',
            btn_reset: 'Paqij bike',
            filter_lock: 'Li gorî qeflê fîlter bike',
            filter_speed: 'Li gorî lezê fîlter bike',
            filter_date: 'Li gorî dîrokê fîlter bike',
            search_cities: 'Li bajêr bigere...',
            search_places: 'Li cih bigere...',
            search_editors: 'Li edîtor bigere...',
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
            res_no_speed: 'Bê lez',
            no_name: 'Bê nav',
            lbl_d1: '1 Roj',
            lbl_d2: '10 Roj',
            lbl_d3: '30 Roj',
            lbl_d4: '3 Meh',
            lbl_d5: '6 Meh',
            lbl_d6: '+6 Meh',
            lbl_lang: 'Ziman'
        },
        'en': {
            title: 'Abdullah Abbas Explorer',
            btn_main: 'Launch Explorer',
            sidebar_title: 'AA Explorer',
            tab_cities: 'Cities',
            tab_places: 'Places',
            tab_editors: 'Editors',
            tab_locks: 'Locks',
            tab_speed: 'Speed',
            tab_dates: 'Update Date',
            btn_scan: 'Check',
            btn_reset: 'Clear',
            filter_lock: 'Filter by Lock Level',
            filter_speed: 'Filter by Speed Limit',
            filter_date: 'Filter by Date',
            search_cities: 'Search City...',
            search_places: 'Search Place...',
            search_editors: 'Search Editor...',
            col_name: 'Name',
            col_count: 'Count',
            col_seg: 'Segs',
            col_place: 'Places',
            msg_ready: 'Ready',
            msg_scanning: 'Scanning...',
            msg_no_data: 'No data found',
            msg_click_scan: 'Click "Check" to start',
            msg_results: 'Results:',
            res_level: 'Level',
            res_speed: 'Speed',
            res_no_speed: 'No Speed',
            no_name: 'No Name',
            lbl_d1: '1 Day',
            lbl_d2: '10 Days',
            lbl_d3: '30 Days',
            lbl_d4: '3 Months',
            lbl_d5: '6 Months',
            lbl_d6: '+6 Months',
            lbl_lang: 'Language'
        }
    };

    // Colors
    const LOCK_COLORS = { 1: '#808080', 2: '#FFD700', 3: '#00FF00', 4: '#0000FF', 5: '#C71585', 6: '#FF0000' };
    const SPEED_COLORS = { '0-40': '#00C853', '41-60': '#C6FF00', '61-80': '#FFEA00', '81-100': '#FF9800', '101-120': '#FF5722', '121-140': '#F44336', '140+': '#B71C1C' };
    const DATE_COLORS = {
        'd1': '#00FF00', 'd2': '#00CED1', 'd3': '#0000FF',
        'd4': '#800080', 'd5': '#C71585', 'd6': '#FF0000'
    };

    let appState = {
        mode: 'cities',
        objectsMap: {},
        orientation: 'landscape',
        language: 'en',
        lastTotalCount: 0,
        filters: {
            locks: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true},
            speed: {'0-40':true, '41-60':true, '61-80':true, '81-100':true, '101-120':true, '121-140':true, '140+':true},
            dates: {'d1':true, 'd2':true, 'd3':true, 'd4':true, 'd5':true, 'd6':true}
        }
    };

    // --- Bootstrap Start ---
    async function startScript() {
        if (typeof bootstrap !== 'undefined') {
            sdk = await bootstrap();
            init();
        } else {
            console.error("WME Bootstrap not found.");
        }
    }

    startScript();

    function init() {
        console.log("Abdullah Abbas WME Explorer v2026.01.27.01 Initialized.");
        const settings = loadSettings();
        appState.language = settings.language || 'en';
        appState.orientation = settings.orientation || 'landscape';

        initSidebar();
        setTimeout(initLayers, 2000);

        // Bind global events for the panel
        $(document).on('input', '#aa-search-input', function() { renderResults(appState.lastTotalCount); });
        $(document).on('click', '#aa-search-clear', function() { $('#aa-search-input').val(''); renderResults(appState.lastTotalCount); });
        $(document).on('mousedown', '#aa-search-input', function(e) { e.stopPropagation(); });
        $(document).keydown(function(e) { if (e.shiftKey && e.key.toLowerCase() === 'f') { togglePanel(); } });
    }

    async function initSidebar() {
        const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
        tabLabel.innerText = 'Abdullah Abbas WME Explorer';
        tabLabel.title = t('title');
        renderSidebarContent(tabPane);
    }

    function renderSidebarContent(container) {
        container.innerHTML = '';
        const lang = appState.language;
        const isRtl = (lang === 'ar' || lang === 'ckb');
        container.style.cssText = `padding: 10px; font-family: 'Segoe UI', Tahoma, sans-serif; direction: ${isRtl ? 'rtl' : 'ltr'}; text-align: ${isRtl ? 'right' : 'left'};`;

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;';
        header.innerHTML = `<div style="font-weight: bold; color: #5989de; font-size: 14px;">${t('title')}</div>
                            <div style="font-size: 10px; color: #888;">v2026.01.27.01</div>`;
        container.appendChild(header);

        // Launch Button
        const btnContainer = document.createElement('div');
        btnContainer.style.marginBottom = '20px';
        const launchBtn = document.createElement('button');
        launchBtn.className = 'btn btn-primary';
        launchBtn.style.cssText = 'width: 100%; padding: 8px; font-weight: bold; cursor: pointer;';
        launchBtn.innerText = t('btn_main');
        launchBtn.onclick = (e) => {
            e.preventDefault();
            togglePanel();
        };
        btnContainer.appendChild(launchBtn);
        container.appendChild(btnContainer);

        // Settings Section
        const settingsDiv = document.createElement('div');
        settingsDiv.style.cssText = 'background: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;';

        // Language Select
        const langLabel = document.createElement('div');
        langLabel.innerText = t('lbl_lang');
        langLabel.style.cssText = 'font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #555;';
        settingsDiv.appendChild(langLabel);

        const langSelect = document.createElement('select');
        langSelect.style.cssText = 'width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; margin-bottom: 10px;';
        langSelect.innerHTML = `
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="ckb">کوردی</option>
            <option value="kmr">Kurdî</option>
        `;
        langSelect.value = appState.language;
        langSelect.onchange = (e) => {
            appState.language = e.target.value;
            saveSettings();
            renderSidebarContent(container);
            updatePanelText();
        };
        settingsDiv.appendChild(langSelect);
        container.appendChild(settingsDiv);

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top: 20px; font-size: 10px; color: #aaa; text-align: center;';
        footer.innerText = '© 2026 Abdullah Abbas';
        container.appendChild(footer);
    }

    function isVisible(geometry) {
        if (!geometry) return false;
        return W.map.getExtent().intersectsBounds(geometry.getBounds());
    }

    function t(key) {
        const lang = appState.language || 'en';
        return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
    }

    function updatePanelText() {
        if ($("#aa-panel").length === 0) return;
        $('#aa-header-title').text(t('title'));
        $('#aa-tab-cities').text(t('tab_cities'));
        $('#aa-tab-places').text(t('tab_places'));
        $('#aa-tab-editors').text(t('tab_editors'));
        $('#aa-tab-locks').text(t('tab_locks'));
        $('#aa-tab-speed').text(t('tab_speed'));
        $('#aa-tab-dates').text(t('tab_dates'));

        $('#aa-btn-scan').text(t('btn_scan'));
        $('#aa-btn-reset').text(t('btn_reset'));
        $('#aa-filter-lock-title').text(t('filter_lock'));
        $('#aa-filter-speed-title').text(t('filter_speed'));
        $('#aa-filter-date-title').text(t('filter_date'));

        if ($('#aa-tbody').children().length === 0) { $('#aa-empty-msg').text(t('msg_click_scan')); }

        const activeTab = $('.aa-tab[style*="bold"]').data('tab');
        if (activeTab === 'cities') $('#aa-search-input').attr('placeholder', t('search_cities'));
        if (activeTab === 'places') $('#aa-search-input').attr('placeholder', t('search_places'));
        if (activeTab === 'editors') $('#aa-search-input').attr('placeholder', t('search_editors'));

        renderTableHeader();
    }

    function initLayers() {
        if (!W.map) return;
        if (lockLayer) { try { W.map.removeLayer(lockLayer); } catch(e){} }
        if (speedLayer) { try { W.map.removeLayer(speedLayer); } catch(e){} }
        if (dateLayer) { try { W.map.removeLayer(dateLayer); } catch(e){} }

        lockLayer = new OpenLayers.Layer.Vector("AA_Locks_Layer", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({ "default": new OpenLayers.Style({ label: "${rank}", fontColor: "${textColor}", fontSize: "12px", fontFamily: "Arial", fontWeight: "bold", pointRadius: 10, fillColor: "${fillColor}", fillOpacity: 1, strokeColor: "white", strokeWidth: 2 }) })
        });

        speedLayer = new OpenLayers.Layer.Vector("AA_Speed_Layer", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({ "default": new OpenLayers.Style({ label: "${speed}", fontColor: "black", fontSize: "10px", fontWeight: "bold", fontFamily: "Tahoma", pointRadius: 13, fillColor: "${fillColor}", strokeColor: "white", strokeWidth: 2 }) })
        });

        dateLayer = new OpenLayers.Layer.Vector("AA_Date_Layer", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    strokeColor: "${strokeColor}",
                    strokeWidth: 6,
                    strokeOpacity: 0.7,
                    strokeLinecap: "round"
                })
            })
        });

        W.map.addLayer(lockLayer);
        W.map.addLayer(speedLayer);
        W.map.addLayer(dateLayer);

        $(lockLayer.div).css("pointer-events", "none");
        $(speedLayer.div).css("pointer-events", "none");
        $(dateLayer.div).css("pointer-events", "none");

        lockLayer.setZIndex(9998);
        speedLayer.setZIndex(9999);
        dateLayer.setZIndex(9999);
    }

    // --- Floating Panel UI ---
    function createPanel() {
        if ($("#aa-panel").length > 0) return;

        const settings = loadSettings();

        const html = `
            <div id="aa-panel" style="
                display: none; position: fixed; top: ${settings.top}; left: ${settings.left};
                width: ${settings.width}; height: ${settings.height}; z-index: 10001;
                background: #fdfdfd; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; resize: both; overflow: hidden;
                min-width: 350px; min-height: 400px;
                flex-direction: column;
                border: 1px solid #ccc;
            ">
                <div id="aa-header" style="cursor: move; background: #333; color: white; padding: 8px 12px; display: flex; align-items: center; flex-shrink: 0;">
                    <div style="display: flex; gap: 8px; align-items: center; margin-right: 10px;">
                        <button id="aa-btn-close" style="background:none; border:none; color:#ffdddd; cursor:pointer; font-weight:bold; font-size: 14px;">X</button>
                        <button id="aa-btn-rotate" title="Rotate" style="background:none; border:none; color:#fff; cursor:pointer; font-size:16px;">⟳</button>
                    </div>
                    <div id="aa-header-title" style="flex-grow: 1; text-align: center; font-weight: bold; font-size: 13px;">${t('title')}</div>
                </div>

                <div style="display: flex; background: #eee; border-bottom: 1px solid #ccc; overflow-x: auto; flex-shrink: 0;">
                    <button id="aa-tab-cities" class="aa-tab active" data-tab="cities" style="${tabStyle(true)}">${t('tab_cities')}</button>
                    <button id="aa-tab-places" class="aa-tab" data-tab="places" style="${tabStyle(false)}">${t('tab_places')}</button>
                    <button id="aa-tab-editors" class="aa-tab" data-tab="editors" style="${tabStyle(false)}">${t('tab_editors')}</button>
                    <button id="aa-tab-locks" class="aa-tab" data-tab="locks" style="${tabStyle(false)}">${t('tab_locks')}</button>
                    <button id="aa-tab-speed" class="aa-tab" data-tab="speed" style="${tabStyle(false)}">${t('tab_speed')}</button>
                    <button id="aa-tab-dates" class="aa-tab" data-tab="dates" style="${tabStyle(false)}">${t('tab_dates')}</button>
                </div>

                <div id="aa-search-area" style="padding: 8px; border-bottom: 1px solid #eee; display:flex; gap:5px; background: #fafafa; flex-shrink: 0;">
                    <input type="text" id="aa-search-input" placeholder="" style="flex:1; padding:4px 8px; border:1px solid #ccc; border-radius:4px; font-size:12px; direction: inherit;">
                    <button id="aa-search-clear" style="border:1px solid #ccc; background:#fff; color:#777; border-radius:4px; cursor:pointer; font-weight:bold; width: 25px;">X</button>
                </div>

                <div id="aa-settings-area" style="padding: 10px; background: #fff; border-bottom: 1px solid #eee; display:none; flex-shrink: 0;">
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
                    <div id="aa-settings-dates" style="display:none; width:100%; flex-direction:column;">
                        <div id="aa-filter-date-title" style="font-weight:bold; margin-bottom:8px; font-size:12px; color:#555; text-align:center;">${t('filter_date')}</div>
                        <div style="display:flex; gap:5px; justify-content:space-between; width:100%;">
                            ${createDateCheckboxes()}
                        </div>
                    </div>
                </div>

                <div style="padding: 10px; display: flex; gap: 10px; background: #f9f9f9; flex-shrink: 0;">
                    <button id="aa-btn-reset" style="flex: 1; background-color: #e74c3c; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight:bold;">${t('btn_reset')}</button>
                    <button id="aa-btn-scan" style="flex: 1; background-color: #26b85d; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight:bold;">${t('btn_scan')}</button>
                </div>

                <div style="flex: 1 1 0px; overflow-y: auto; position: relative; background: #fff; width: 100%;">
                    <table style="width: 100%; border-collapse: collapse; direction: rtl;">
                        <thead id="aa-thead" style="position: sticky; top: 0; background: #f4f4f4; z-index: 2; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            </thead>
                        <tbody id="aa-tbody"></tbody>
                    </table>
                    <div id="aa-empty-msg" style="text-align: center; padding: 20px; color: #999;">${t('msg_click_scan')}</div>
                </div>
                <div id="aa-status" style="padding: 5px; text-align: center; font-size: 11px; color: #777; background: #eee; border-top: 1px solid #ddd; flex-shrink: 0;">${t('msg_ready')} - v2026.01.27.01</div>
            </div>`;

        $('body').append(html);

        renderTableHeader();

        $('#aa-btn-close').click(() => $('#aa-panel').hide());
        $('#aa-btn-rotate').click(rotateWindow);
        $('#aa-btn-scan').click(runAnalysis);
        $('#aa-btn-reset').click(clearData);

        $('.aa-tab').click(function() {
            activateTab($(this).data('tab'));
            clearData();
        });

        // Event delegation
        $(document).on('change', '.aa-lock-cb', function() { appState.filters.locks[$(this).val()] = $(this).is(':checked'); });
        $(document).on('change', '.aa-speed-cb', function() { appState.filters.speed[$(this).val()] = $(this).is(':checked'); });
        $(document).on('change', '.aa-date-cb', function() { appState.filters.dates[$(this).val()] = $(this).is(':checked'); });

        makeDraggable(document.getElementById("aa-panel"));
        $('#aa-panel').on('mouseup', saveSettings);

        activateTab('cities');
    }

    function renderTableHeader() {
        const thead = $('#aa-thead');
        thead.empty();
        if (appState.mode === 'dates') return;

        let html = '';
        if (appState.mode === 'editors') {
            html = `<tr style="font-size: 12px; color: #555;"><th style="padding: 8px; text-align: right;">${t('col_name')}</th><th style="padding: 8px; text-align: center; width: 50px;">${t('col_seg')}</th><th style="padding: 8px; text-align: center; width: 50px;">${t('col_place')}</th></tr>`;
        } else {
            html = `<tr style="font-size: 12px; color: #555;"><th style="padding: 8px; text-align: right;">${getHeaderName()}</th><th style="padding: 8px; text-align: left; width: 60px;">${t('col_count')}</th></tr>`;
        }
        thead.html(html);
    }

    function createLockCheckboxes() {
        let html = '';
        for (let i = 1; i <= 6; i++) {
            let color = LOCK_COLORS[i];
            let textColor = (i === 2 || i === 3) ? 'black' : 'white';
            html += `<label style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f0f0f0; padding:4px 2px; border-radius:4px; border:1px solid #ddd; min-width:30px;">
                    <span style="background:${color}; color:${textColor}; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:11px; margin-bottom:3px; width:80%; text-align:center;">${i}</span>
                    <input type="checkbox" class="aa-lock-cb" value="${i}" checked style="margin:0;">
                </label>`;
        }
        return html;
    }

    function createSpeedCheckboxes() {
        let html = '';
        const ranges = ['0-40', '41-60', '61-80', '81-100', '101-120', '121-140', '140+'];
        ranges.forEach(rng => {
            let color = SPEED_COLORS[rng];
            let textColor = (rng === '61-80' || rng === '81-100') ? 'black' : 'white';
            html += `<label style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f0f0f0; padding:4px 2px; border-radius:4px; border:1px solid #ddd; min-width:35px;">
                    <span style="background:${color}; color:${textColor}; padding:1px 0; border-radius:3px; font-weight:bold; font-size:10px; margin-bottom:3px; width:90%; text-align:center; white-space:nowrap; overflow:hidden;">${rng}</span>
                    <input type="checkbox" class="aa-speed-cb" value="${rng}" checked style="margin:0;">
                </label>`;
        });
        return html;
    }

    function createDateCheckboxes() {
        const items = [
            { id: 'd1', label: 'lbl_d1', color: DATE_COLORS['d1'], text: 'black' },
            { id: 'd2', label: 'lbl_d2', color: DATE_COLORS['d2'], text: 'black' },
            { id: 'd3', label: 'lbl_d3', color: DATE_COLORS['d3'], text: 'white' },
            { id: 'd4', label: 'lbl_d4', color: DATE_COLORS['d4'], text: 'white' },
            { id: 'd5', label: 'lbl_d5', color: DATE_COLORS['d5'], text: 'white' },
            { id: 'd6', label: 'lbl_d6', color: DATE_COLORS['d6'], text: 'white' }
        ];
        let html = '';
        items.forEach(item => {
             html += `<label style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f0f0f0; padding:4px 2px; border-radius:4px; border:1px solid #ddd; min-width:35px;">
                <span style="background:${item.color}; color:${item.text}; padding:1px 0; border-radius:3px; font-weight:bold; font-size:10px; margin-bottom:3px; width:90%; text-align:center; white-space:nowrap; overflow:hidden;">${t(item.label)}</span>
                <input type="checkbox" class="aa-date-cb" value="${item.id}" checked style="margin:0;">
            </label>`;
        });
        return html;
    }

    function togglePanel() {
        if ($("#aa-panel").length === 0) createPanel();
        const panel = $('#aa-panel');
        if (panel.css('display') !== 'none') panel.hide();
        else {
            panel.css('display', 'flex');
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
        $('#aa-settings-dates').css('display', 'none');
        $('#aa-settings-area').css('display', 'none');
        $('#aa-search-area').css('display', 'none');

        $('#aa-search-input').val('');

        if (tabName === 'cities') {
             $('#aa-search-area').css('display', 'flex'); $('#aa-search-input').attr('placeholder', t('search_cities'));
        }
        else if (tabName === 'places') {
             $('#aa-search-area').css('display', 'flex'); $('#aa-search-input').attr('placeholder', t('search_places'));
        }
        else if (tabName === 'editors') {
             $('#aa-search-area').css('display', 'flex'); $('#aa-search-input').attr('placeholder', t('search_editors'));
        }
        else if (tabName === 'locks') {
            $('#aa-settings-area').css('display', 'block'); $('#aa-settings-locks').css('display', 'flex');
        }
        else if (tabName === 'speed') {
            $('#aa-settings-area').css('display', 'block'); $('#aa-settings-speed').css('display', 'flex');
        }
        else if (tabName === 'dates') {
            $('#aa-settings-area').css('display', 'block');
            $('#aa-settings-dates').html(`<div id="aa-filter-date-title" style="font-weight:bold; margin-bottom:8px; font-size:12px; color:#555; text-align:center;">${t('filter_date')}</div><div style="display:flex; gap:5px; justify-content:space-between; width:100%;">${createDateCheckboxes()}</div>`);
            $('#aa-settings-dates').css('display', 'flex');
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

    function drawLocks() {
        if (!lockLayer) initLayers();
        if (!lockLayer) return;
        lockLayer.removeAllFeatures();
        const features = [];
        const styles = { 1: {fill:LOCK_COLORS[1],text:'white'}, 2: {fill:LOCK_COLORS[2],text:'black'}, 3: {fill:LOCK_COLORS[3],text:'black'}, 4: {fill:LOCK_COLORS[4],text:'white'}, 5: {fill:LOCK_COLORS[5],text:'white'}, 6: {fill:LOCK_COLORS[6],text:'white'} };
        const segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
        segments.forEach(seg => {
            if (!seg || seg.state === 'Delete' || !isVisible(seg.geometry)) return;
            let rank = (seg.attributes.lockRank || 0) + 1;
            if (!appState.filters.locks[rank]) return;
            let style = styles[rank];
            features.push(new OpenLayers.Feature.Vector(seg.geometry.getCentroid(), { rank: rank, fillColor: style.fill, textColor: style.text }));
        });
        lockLayer.addFeatures(features);
    }

    function getSpeedRangeKey(speed) {
        if (speed <= 40) return '0-40'; if (speed <= 60) return '41-60'; if (speed <= 80) return '61-80'; if (speed <= 100) return '81-100'; if (speed <= 120) return '101-120'; if (speed <= 140) return '121-140'; return '140+';
    }

    function drawSpeeds() {
        if (!speedLayer) initLayers();
        if (!speedLayer) return;
        speedLayer.removeAllFeatures();
        const features = [];
        const segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
        segments.forEach(seg => {
            if (!seg || seg.state === 'Delete' || !isVisible(seg.geometry)) return;
            let fwd = seg.attributes.fwdMaxSpeed; let rev = seg.attributes.revMaxSpeed;
            if (!fwd && !rev) return;
            let labelText = (fwd===rev) ? fwd+"" : (fwd&&!rev ? fwd+"" : (!fwd&&rev ? rev+"" : `${fwd}\n${rev}`));
            let maxSpeed = Math.max(fwd||0, rev||0);
            let rangeKey = getSpeedRangeKey(maxSpeed);
            if (!appState.filters.speed[rangeKey]) return;
            features.push(new OpenLayers.Feature.Vector(seg.geometry.getCentroid(), { speed: labelText, fillColor: SPEED_COLORS[rangeKey] }));
        });
        speedLayer.addFeatures(features);
    }

    function drawDates() {
        if (!dateLayer) initLayers();
        if (!dateLayer) return;
        dateLayer.removeAllFeatures();
        const features = [];
        const segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
        const today = new Date().getTime();
        segments.forEach(seg => {
            if (!seg || seg.state === 'Delete' || !seg.geometry) return;
            let updatedOn = seg.attributes.updatedOn;
            let diffDays = Math.ceil(Math.abs(today - updatedOn) / (86400000));
            let colorKey = null;
            if (diffDays <= 1) colorKey = 'd1'; else if (diffDays <= 10) colorKey = 'd2'; else if (diffDays <= 30) colorKey = 'd3'; else if (diffDays <= 90) colorKey = 'd4'; else if (diffDays <= 180) colorKey = 'd5'; else colorKey = 'd6';
            if (!appState.filters.dates[colorKey]) return;
            features.push(new OpenLayers.Feature.Vector(seg.geometry.clone(), { strokeColor: DATE_COLORS[colorKey] }));
        });
        dateLayer.addFeatures(features);
    }

    function getUsername(obj, userId) {
        if (obj && obj.getAttribute) { let name = obj.getAttribute('userName'); if (name) return name; }
        if (obj && obj.userName) return obj.userName;
        if (userId) {
            if (W.model.users.objects && W.model.users.objects[userId]) { let u = W.model.users.objects[userId]; if (u.userName) return u.userName; if (u.getAttribute) return u.getAttribute('userName'); }
            if (W.model.users.getObjectById) { let u = W.model.users.getObjectById(userId); if (u && u.userName) return u.userName; }
        }
        return null;
    }

    function runAnalysis() {
        $('#aa-tbody').empty();
        $('#aa-empty-msg').show().text(t('msg_scanning'));
        if (lockLayer) lockLayer.removeAllFeatures(); if (speedLayer) speedLayer.removeAllFeatures(); if (dateLayer) dateLayer.removeAllFeatures();

        setTimeout(() => {
            appState.objectsMap = {};
            let totalCount = 0;
            let segments = W.model.segments.objects ? Object.values(W.model.segments.objects) : [];
            let venues = W.model.venues.objects ? Object.values(W.model.venues.objects) : [];

            if (appState.mode === 'cities') {
                segments.forEach(obj => { if (!obj || obj.state === 'Delete') return; let addr = obj.getAddress(); let name = (addr && !addr.isEmpty() && addr.getCity()) ? addr.getCity().attributes.name : "No City"; addToMap(name, obj); totalCount++; });
            } else if (appState.mode === 'places') {
                venues.forEach(obj => { if (!obj || obj.state === 'Delete') return; let name = obj.attributes.name || t('no_name'); addToMap(name, obj); totalCount++; });
            } else if (appState.mode === 'locks') {
                drawLocks(); segments.forEach(obj => { if (!obj || obj.state === 'Delete') return; let rank = (obj.attributes.lockRank || 0) + 1; if (!appState.filters.locks[rank]) return; addToMap(`${t('res_level')} ${rank}`, obj); totalCount++; });
            } else if (appState.mode === 'speed') {
                drawSpeeds(); segments.forEach(obj => { if (!obj || obj.state === 'Delete') return; let fwd = obj.attributes.fwdMaxSpeed; let rev = obj.attributes.revMaxSpeed; if (!fwd && !rev) return; let maxSpeed = Math.max(fwd || 0, rev || 0); let rangeKey = getSpeedRangeKey(maxSpeed); if (!appState.filters.speed[rangeKey]) return; addToMap(`${t('res_speed')} ${maxSpeed}`, obj); totalCount++; });
            } else if (appState.mode === 'dates') {
                drawDates(); $('#aa-status').text(`${t('msg_results')} (Colored)`); $('#aa-empty-msg').text(t('msg_ready')); return;
            } else if (appState.mode === 'editors') {
                segments.forEach(obj => { if (!obj || obj.state === 'Delete') return; let uid = (obj.attributes.updatedBy || obj.attributes.createdBy); let userObj = obj.getUpdatedBy ? obj.getUpdatedBy() : (obj.getCreatedBy ? obj.getCreatedBy() : null); if (uid) { let name = getUsername(userObj, uid); if (name) { addToMap(name, obj); totalCount++; } } });
                venues.forEach(obj => { if (!obj || obj.state === 'Delete') return; let uid = (obj.attributes.updatedBy || obj.attributes.createdBy); let userObj = obj.getUpdatedBy ? obj.getUpdatedBy() : (obj.getCreatedBy ? obj.getCreatedBy() : null); if (uid) { let name = getUsername(userObj, uid); if (name) { addToMap(name, obj); totalCount++; } } });
            }
            appState.lastTotalCount = totalCount; renderResults(totalCount);
        }, 50);
    }

    function addToMap(key, obj) { if (!appState.objectsMap[key]) appState.objectsMap[key] = []; appState.objectsMap[key].push(obj); }
    function renderResults(total) {
        const tbody = $('#aa-tbody'); tbody.empty(); $('#aa-empty-msg').hide();
        let keys = Object.keys(appState.objectsMap); const searchVal = $('#aa-search-input').val().toLowerCase().trim();
        if (searchVal !== "" && (appState.mode === 'cities' || appState.mode === 'places' || appState.mode === 'editors')) { keys = keys.filter(key => key.toLowerCase().includes(searchVal)); }
        keys.sort((a, b) => { if (appState.mode === 'locks') return a.localeCompare(b); if (appState.mode === 'speed') { let numA = parseInt(a.replace(/\D/g,'')) || 0; let numB = parseInt(b.replace(/\D/g,'')) || 0; return numB - numA; } return appState.objectsMap[b].length - appState.objectsMap[a].length; });
        if (keys.length === 0) { $('#aa-empty-msg').show().text(t('msg_no_data')); return; }
        keys.forEach(key => {
            let allObjects = appState.objectsMap[key]; let row;
            if (appState.mode === 'editors') {
                let segments = allObjects.filter(o => o.type === 'segment'); let venues = allObjects.filter(o => o.type === 'venue');
                row = $(`<tr class="aa-row" style="border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s;"><td style="padding: 8px; font-size: 13px;">${key}</td><td class="aa-seg-click" style="padding: 8px; text-align:center;">${segments.length > 0 ? `<span style="background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">${segments.length}</span>` : '-'}</td><td class="aa-ven-click" style="padding: 8px; text-align:center;">${venues.length > 0 ? `<span style="background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">${venues.length}</span>` : '-'}</td></tr>`);
                row.find('.aa-seg-click').data('objects', segments); row.find('.aa-ven-click').data('objects', venues);
                row.find('.aa-seg-click').click(function(e) { e.stopPropagation(); selectSpecificObjects($(this).data('objects')); });
                row.find('.aa-ven-click').click(function(e) { e.stopPropagation(); selectSpecificObjects($(this).data('objects')); });
            } else {
                let count = allObjects.length; row = $(`<tr class="aa-row" style="border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s;"><td style="padding: 8px; font-size: 13px;">${key}</td><td style="padding: 8px; color: #5989de; font-weight: bold; direction: ltr;">${count}</td></tr>`);
            }
            row.data('key', key); tbody.append(row);
        });
        tbody.on('click', '.aa-row', function() { $('.aa-row').css('background', 'transparent'); $(this).css('background', '#e6f7ff'); selectObjects($(this).data('key')); });
        $('#aa-status').text(`${t('msg_results')} ${total}`);
    }

    function selectSpecificObjects(objects) { if (!objects || objects.length === 0) return; try { W.selectionManager.unselectAll(); W.selectionManager.setSelectedModels(objects); centerOnObjects(objects); } catch(e) { console.error(e); } }
    function selectObjects(key) { const objects = appState.objectsMap[key]; if (!objects || objects.length === 0) return; try { W.selectionManager.unselectAll(); W.selectionManager.setSelectedModels(objects); centerOnObjects(objects); } catch (e) { console.error("AA Explorer Error:", e); } }
    function centerOnObjects(objects) { let bounds = new OpenLayers.Bounds(); let hasGeometry = false; objects.forEach(obj => { if (obj.geometry) { bounds.extend(obj.geometry.getBounds()); hasGeometry = true; } }); if (hasGeometry && W.map) { let centerLonLat = bounds.getCenterLonLat(); W.map.setCenter(centerLonLat); } }
    function clearData() { $('#aa-tbody').empty(); $('#aa-empty-msg').text(t('msg_ready')); $('#aa-status').text(t('msg_ready')); $('#aa-search-input').val(''); appState.objectsMap = {}; try { W.selectionManager.unselectAll(); } catch(e) {} if (lockLayer) lockLayer.removeAllFeatures(); if (speedLayer) speedLayer.removeAllFeatures(); if (dateLayer) dateLayer.removeAllFeatures(); }
    function loadSettings() { const defaultSettings = { top: '80px', left: '80px', width: '550px', height: '350px', orientation: 'landscape', language: 'en' }; try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : defaultSettings; } catch (e) { return defaultSettings; } }
    function saveSettings() { const panel = $('#aa-panel'); if (panel.length === 0) return; const settings = { top: panel.css('top'), left: panel.css('left'), width: panel.css('width'), height: panel.css('height'), orientation: appState.orientation, language: appState.language }; localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("aa-header");
        if (header) header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.id === 'aa-search-input') return;
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

            // Calculate new position
            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;

            // Boundary checks

            // Top: Strict (Cannot go above the browser window)
            if (newTop < 0) newTop = 0;

            // Left: Strict (Cannot go left of the browser window)
            if (newLeft < 0) newLeft = 0;

            // Right: Strict (Cannot go right of the browser window)
            if (newLeft + elmnt.offsetWidth > window.innerWidth) {
                newLeft = window.innerWidth - elmnt.offsetWidth;
            }

            // Bottom: Allow dragging down until only the header is visible
            // Assuming header height is around 40px
            const headerHeight = 40;
            const maxTop = window.innerHeight - headerHeight;

            if (newTop > maxTop) {
                newTop = maxTop;
            }

            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            saveSettings();
        }
    }

})();