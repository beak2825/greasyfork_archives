// ==UserScript==
// @name         Abdullah Abbas WME Suite
// @namespace    http://tampermonkey.net/
// @version      2026.01.28.12
// @description  مجموعة أدوات مستقلة - إصلاح منطق الظهور (Fix Display Logic)
// @author       Abdullah Abbas
// @copyright    2026, Abdullah Abbas. All Rights Reserved.
// @license      Proprietary - No redistribution or modification allowed without permission.
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @connect      waze.com
// @connect      www.waze.com
// @connect      google.com
// @connect      www.google.com
// @connect      goo.gl
// @connect      nominatim.openstreetmap.org
// @downloadURL https://update.greasyfork.org/scripts/564368/Abdullah%20Abbas%20WME%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/564368/Abdullah%20Abbas%20WME%20Suite.meta.js
// ==/UserScript==

/* global W, OpenLayers */

(function() {
    'use strict';

    const SCRIPT_NAME = 'AA WME Suite';
    const VERSION = '2026.01.28.12';
    const STORAGE_KEY_LANG = 'AA_Suite_Lang_v1';

    // ===========================================================================
    //  1. نظام اللغات
    // ===========================================================================
    const STRINGS = {
        'en-US': {
            dir: 'ltr',
            name: 'English (US)',
            tab_title: 'Abdullah Abbas WME Suite',
            main_title: 'AA Suite',
            btn_smart_search: '🔍 Smart Search',
            win_title: 'Smart Search',
            btn_search: 'Search',
            btn_paste: 'Paste',
            btn_clear: 'Clear',
            status_ready: 'Ready...',
            status_pasted: 'Pasted.',
            status_cleared: 'Cleared.',
            status_no_data: 'Please enter data!',
            status_waze: 'Fetching Waze...',
            status_google: 'Google Search...',
            status_found: 'Location Found.',
            status_error: 'Error.',
            ph_input: 'Link, Coords, Plus Code...',
            supported: 'Waze • Google • Coords'
        },
        'ar-IQ': {
            dir: 'rtl',
            name: 'العربية (العراق)',
            tab_title: 'Abdullah Abbas WME Suite',
            main_title: 'AA Suite',
            btn_smart_search: '🔍 البحث الذكي',
            win_title: 'البحث الذكي',
            btn_search: 'بحث',
            btn_paste: 'لصق',
            btn_clear: 'مسح',
            status_ready: 'جاهز...',
            status_pasted: 'تم اللصق.',
            status_cleared: 'تم المسح.',
            status_no_data: 'الرجاء إدخال بيانات!',
            status_waze: 'جاري جلب Waze...',
            status_google: 'جاري بحث Google...',
            status_found: 'تم العثور عليه.',
            status_error: 'خطأ.',
            ph_input: 'رابط، إحداثيات، Plus Code...',
            supported: 'Waze • Google • Coords'
        },
        'ckb-IQ': {
            dir: 'rtl',
            name: 'کوردی (Soranî)',
            tab_title: 'Abdullah Abbas WME Suite',
            main_title: 'AA Suite',
            btn_smart_search: '🔍 گەڕانی زیرەک',
            win_title: 'گەڕانی زیرەک',
            btn_search: 'گەڕان',
            btn_paste: 'لکاندن',
            btn_clear: 'پاککردنەوە',
            status_ready: 'ئامادەیە...',
            status_pasted: 'لکێندرا.',
            status_cleared: 'پاککرایەوە.',
            status_no_data: 'تكایە داتا داخل بكە!',
            status_waze: 'هێنانی Waze...',
            status_google: 'گەڕانی Google...',
            status_found: 'شوێن دۆزرایەوە.',
            status_error: 'هەڵە.',
            ph_input: 'لینک، پۆتانەکان، Plus Code...',
            supported: 'Waze • Google • Coords'
        }
    };

    let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'en-US';

    function _t(key) { return STRINGS[currentLang][key] || STRINGS['en-US'][key] || key; }
    function _dir() { return STRINGS[currentLang].dir; }

    // ===========================================================================
    //  2. التهيئة
    // ===========================================================================
    function bootstrap(tries = 1) {
        if (typeof W !== 'undefined' && W.map && W.model && document.getElementById('user-info')) {
            initSuite();
        } else if (tries < 100) {
            setTimeout(() => bootstrap(tries + 1), 200);
        }
    }

    bootstrap();

    function initSuite() {
        console.log(`${SCRIPT_NAME}: تم التشغيل (${VERSION}) - اللغة: ${currentLang}`);
        injectCSS();
        buildSidebar();
    }

    // ===========================================================================
    //  3. التنسيقات
    // ===========================================================================
    function injectCSS() {
        const alignStart = _dir() === 'rtl' ? 'right' : 'left';

        const css = `
            .aa-suite-window {
                position: fixed; background: #fdfdfd; border-radius: 8px;
                box-shadow: 0 6px 25px rgba(0,0,0,0.4); z-index: 9999;
                font-family: "Rubik", "Tahoma", sans-serif;
                direction: ${ _dir() }; text-align: ${alignStart};
                border: 1px solid #2980b9; display: none;
            }
            .aa-suite-header {
                padding: 0 15px; background: linear-gradient(90deg, #2980b9, #2c3e50);
                color: white; font-weight: bold; cursor: move;
                display: flex; align-items: center; justify-content: space-between;
                border-radius: 8px 8px 0 0; height: 40px; box-sizing: border-box;
                position: relative;
            }
            #aa-suite-close-btn {
                cursor: pointer; font-size: 16px; color: #fff;
                opacity: 0.8; transition: 0.2s;
            }
            #aa-suite-close-btn:hover { opacity: 1; transform: scale(1.1); color: #ffeb3b; }

            .aa-suite-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }

            #aa-suite-new-tab-content { padding: 10px; font-family: 'Rubik', sans-serif; text-align: center; }

            .aa-suite-sidebar-btn {
                width: 100%; padding: 8px; margin-top: 5px; border: none;
                border-radius: 4px; color: #fff; cursor: pointer;
                font-weight: bold; font-size: 13px; display: flex;
                align-items: center; justify-content: center; gap: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.2s;
                pointer-events: auto;
            }
            .aa-suite-sidebar-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
            .aa-suite-bg-main { background: linear-gradient(to right, #2980b9, #2c3e50); }

            .aa-suite-lang-select {
                width: 100%; padding: 5px; margin-bottom: 10px;
                border: 1px solid #ccc; border-radius: 4px;
                font-size: 12px; font-family: inherit;
                background: #fff; cursor: pointer;
            }

            .aa-suite-input-row { display: flex; gap: 5px; align-items: center; }
            #aa-suite-smart-input {
                flex-grow: 1; padding: 7px 10px; border: 1px solid #bdc3c7;
                border-radius: 4px; font-size: 13px; direction: ltr; outline: none; transition: 0.2s;
            }
            #aa-suite-smart-input:focus { border-color: #3498db; box-shadow: 0 0 3px rgba(52,152,219,0.5); }
            .aa-suite-btn-tool {
                border: none; padding: 7px 12px; border-radius: 4px; cursor: pointer;
                font-weight: bold; font-size: 13px; color: white; transition: 0.2s; white-space: nowrap;
            }
            #aa-suite-btn-search { background: #27ae60; }
            #aa-suite-btn-paste { background: #f39c12; }
            #aa-suite-btn-clear { background: #c0392b; }
            .aa-suite-footer {
                font-size: 10px; color: #7f8c8d; margin-top: 5px; display: flex;
                justify-content: space-between; align-items: center;
                border-top: 1px solid #ecf0f1; padding-top: 5px;
                direction: ltr;
            }
        `;

        const oldStyle = document.getElementById('aa-suite-style');
        if (oldStyle) oldStyle.remove();

        const style = document.createElement('style');
        style.id = 'aa-suite-style';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // ===========================================================================
    //  4. بناء القائمة الجانبية
    // ===========================================================================
    function buildSidebar() {
        const userTabs = document.getElementById('user-info');
        if (!userTabs) return;

        const existingTab = document.getElementById('aa-suite-new-tab-content');
        if (existingTab) existingTab.remove();
        const existingLink = document.querySelector('ul.nav-tabs li a[href="#aa-suite-new-tab-content"]');
        if (existingLink) existingLink.parentElement.remove();

        const navTabs = userTabs.querySelector('.nav-tabs');
        const tabContent = userTabs.querySelector('.tab-content');
        if (!navTabs || !tabContent) return;

        const addon = document.createElement('div');
        addon.id = "aa-suite-new-tab-content";
        addon.className = "tab-pane";
        addon.style.padding = "10px";
        addon.style.textAlign = "center";

        // قائمة اللغة
        const langSelect = document.createElement('select');
        langSelect.id = 'aa_suite_lang_select';
        langSelect.className = 'aa-suite-lang-select';
        for (const [key, value] of Object.entries(STRINGS)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = value.name;
            if (key === currentLang) opt.selected = true;
            langSelect.appendChild(opt);
        }
        langSelect.onchange = (e) => {
            currentLang = e.target.value;
            localStorage.setItem(STORAGE_KEY_LANG, currentLang);
            if(SmartSearchModule.panel) {
                SmartSearchModule.panel.remove();
                SmartSearchModule.panel = null;
            }
            injectCSS();
            buildSidebar();
        };
        addon.appendChild(langSelect);

        // زر البحث الذكي
        const btnSearch = document.createElement('button');
        btnSearch.id = 'btn_open_suite_search';
        btnSearch.className = 'aa-suite-sidebar-btn aa-suite-bg-main';
        btnSearch.type = 'button';
        btnSearch.innerText = _t('btn_smart_search');

        btnSearch.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            SmartSearchModule.toggle();
        });

        addon.appendChild(btnSearch);

        // حقوق النشر
        const footer = document.createElement('div');
        footer.style.marginTop = '15px';
        footer.style.fontSize = '10px';
        footer.style.color = '#95a5a6';
        footer.style.borderTop = '1px solid #eee';
        footer.style.paddingTop = '5px';
        footer.innerText = '© 2026 Abdullah Abbas';
        addon.appendChild(footer);

        const newtab = document.createElement('li');
        const tabLink = document.createElement('a');
        tabLink.href = '#aa-suite-new-tab-content';
        tabLink.setAttribute('data-toggle', 'tab');
        tabLink.title = _t('tab_title');
        tabLink.innerText = _t('tab_title');
        newtab.appendChild(tabLink);

        navTabs.appendChild(newtab);
        tabContent.appendChild(addon);
    }

    // ===========================================================================
    //  5. وحدة البحث الذكي
    // ===========================================================================
    const SmartSearchModule = {
        panel: null,

        init: () => {
            if (document.getElementById('aa-suite-smart-panel')) return;

            const html = `
                <div id="aa-suite-header" class="aa-suite-header">
                    <span>${_t('win_title')}</span>
                    <span id="aa-suite-close-btn" title="${_t('btn_clear')}">✖</span>
                </div>
                <div class="aa-suite-content">
                    <div class="aa-suite-input-row">
                        <button id="aa-suite-btn-search" class="aa-suite-btn-tool" title="${_t('btn_search')}">${_t('btn_search')}</button>
                        <button id="aa-suite-btn-paste" class="aa-suite-btn-tool" title="${_t('btn_paste')}">${_t('btn_paste')}</button>
                        <button id="aa-suite-btn-clear" class="aa-suite-btn-tool" title="${_t('btn_clear')}">${_t('btn_clear')}</button>
                        <input type="text" id="aa-suite-smart-input" placeholder="${_t('ph_input')}">
                    </div>
                    <div class="aa-suite-footer">
                        <span id="aa-suite-status">${_t('status_ready')}</span>
                        <span id="aa-suite-supported">${_t('supported')}</span>
                    </div>
                </div>
            `;

            SmartSearchModule.panel = document.createElement('div');
            SmartSearchModule.panel.id = 'aa-suite-smart-panel';
            SmartSearchModule.panel.className = 'aa-suite-window';
            SmartSearchModule.panel.innerHTML = html;

            SmartSearchModule.panel.style.top = '100px';
            SmartSearchModule.panel.style.left = '100px';
            SmartSearchModule.panel.style.width = '550px';

            document.body.appendChild(SmartSearchModule.panel);
            dragElement(SmartSearchModule.panel);

            document.getElementById('aa-suite-close-btn').onclick = () => SmartSearchModule.panel.style.display = 'none';

            document.getElementById('aa-suite-btn-clear').onclick = () => {
                document.getElementById('aa-suite-smart-input').value = '';
                document.getElementById('aa-suite-status').innerText = _t('status_cleared');
                document.getElementById('aa-suite-smart-input').focus();
            };

            document.getElementById('aa-suite-btn-paste').onclick = async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    const input = document.getElementById('aa-suite-smart-input');
                    input.value = text;
                    input.focus();
                    document.getElementById('aa-suite-status').innerText = _t('status_pasted');
                } catch (err) {
                    alert('Ctrl+V');
                }
            };

            const btnSearch = document.getElementById('aa-suite-btn-search');
            btnSearch.onclick = SmartSearchModule.performSearch;
            document.getElementById('aa-suite-smart-input').onkeypress = (e) => {
                if (e.key === 'Enter') SmartSearchModule.performSearch();
            };
        },

        toggle: () => {
            if (!SmartSearchModule.panel) SmartSearchModule.init();
            const panel = document.getElementById('aa-suite-smart-panel');

            // --- الإصلاح: التحقق من الحالة المحسوبة (Computed Style) ---
            const isHidden = (panel.style.display === 'none' || window.getComputedStyle(panel).display === 'none');
            panel.style.display = isHidden ? 'block' : 'none';

            if (panel.style.display === 'block') document.getElementById('aa-suite-smart-input').focus();
        },

        performSearch: () => {
            const inputEl = document.getElementById('aa-suite-smart-input');
            const statusEl = document.getElementById('aa-suite-status');
            const btnSearch = document.getElementById('aa-suite-btn-search');
            const rawVal = inputEl.value.trim();

            if (!rawVal) { statusEl.innerText = _t('status_no_data'); return; }

            const urlMatch = rawVal.match(/(https?:\/\/[^\s]+)/);
            const cleanUrl = urlMatch ? urlMatch[0] : rawVal;

            if (cleanUrl.includes('waze.com')) {
                SmartSearchModule.handleWazeUrl(cleanUrl, statusEl, btnSearch);
                return;
            }

            if (cleanUrl.includes('google.com') || cleanUrl.includes('goo.gl')) {
                SmartSearchModule.handleTextSearch(cleanUrl, statusEl, btnSearch, true);
                return;
            }

            const coordMatch = rawVal.match(/(-?\d+(?:\.\d+)?)[\s,]+(-?\d+(?:\.\d+)?)/);
            const isPureCoords = /^[0-9\.\,\-\s]+$/.test(rawVal);

            if (coordMatch && isPureCoords) {
                const v1 = parseFloat(coordMatch[1]);
                const v2 = parseFloat(coordMatch[2]);
                SmartSearchModule.processCoordinates(v1, v2, statusEl);
                return;
            }

            SmartSearchModule.handleTextSearch(rawVal, statusEl, btnSearch);
        },

        processCoordinates: (v1, v2, statusEl) => {
            let lat, lon;
            if (Math.abs(v1) <= 90 && Math.abs(v2) <= 180) { lat = v1; lon = v2; }
            else if (Math.abs(v2) <= 90 && Math.abs(v1) <= 180) { lat = v2; lon = v1; }
            else { lat = v1; lon = v2; }

            if (Math.abs(lat) > 90) { statusEl.innerText = _t('status_error'); return; }
            SmartSearchModule.jumpTo(lat, lon);
            statusEl.innerText = `To: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        },

        handleWazeUrl: (url, status, btn) => {
            btn.disabled = true;
            status.innerText = _t('status_waze');
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: function(res) {
                    btn.disabled = false;
                    const finalUrl = res.finalUrl || url;
                    const content = finalUrl + " " + res.responseText;
                    let lat, lon;
                    let m = content.match(/ll[=.](-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/);
                    if (m) {
                        if (finalUrl.includes('lon=') && finalUrl.indexOf('lon=') < finalUrl.indexOf('lat=')) {
                            lat = parseFloat(m[2]); lon = parseFloat(m[1]);
                        } else {
                            lat = parseFloat(m[1]); lon = parseFloat(m[2]);
                        }
                    } else {
                        const la = content.match(/lat["=:]\s*(-?\d+\.\d+)/);
                        const lo = content.match(/lon["=:]\s*(-?\d+\.\d+)/);
                        if (la && lo) { lat = parseFloat(la[1]); lon = parseFloat(lo[1]); }
                    }

                    if (lat && lon) { SmartSearchModule.jumpTo(lat, lon); status.innerText = _t('status_found'); }
                    else { status.innerText = _t('status_error'); }
                },
                onerror: () => { btn.disabled = false; status.innerText = _t('status_error'); }
            });
        },

        handleTextSearch: (query, status, btn, isUrl = false) => {
            btn.disabled = true;
            status.innerText = _t('status_google');
            const searchUrl = isUrl ? query : "https://www.google.com/maps?q=" + encodeURIComponent(query);

            GM_xmlhttpRequest({
                method: "GET", url: searchUrl,
                onload: function(res) {
                    let lat, lon;
                    if (res.finalUrl) {
                        const m = res.finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        if (m) { lat = parseFloat(m[1]); lon = parseFloat(m[2]); }
                    }
                    if (!lat) {
                        const metaMatch = res.responseText.match(/content=".*?center=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/);
                        if (metaMatch) { lat = parseFloat(metaMatch[1]); lon = parseFloat(metaMatch[2]); }
                    }
                    if (!lat) {
                        const rawMatch = res.responseText.match(/\[\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\]/);
                        if (rawMatch) {
                            const p1 = parseFloat(rawMatch[1]); const p2 = parseFloat(rawMatch[2]);
                            if (Math.abs(p1) <= 90 && Math.abs(p2) <= 180) { lat = p1; lon = p2; }
                        }
                    }

                    if (lat && lon) {
                        btn.disabled = false;
                        SmartSearchModule.jumpTo(lat, lon);
                        status.innerText = _t('status_found');
                    } else {
                        if (!isUrl) SmartSearchModule.handleNominatimFallback(query, status, btn);
                        else { btn.disabled = false; status.innerText = _t('status_error'); }
                    }
                },
                onerror: () => {
                    if (!isUrl) SmartSearchModule.handleNominatimFallback(query, status, btn);
                    else { btn.disabled = false; status.innerText = _t('status_error'); }
                }
            });
        },

        handleNominatimFallback: (query, status, btn) => {
            status.innerText = "OSM...";
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: function(res) {
                    btn.disabled = false;
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data.length > 0) {
                            SmartSearchModule.jumpTo(parseFloat(data[0].lat), parseFloat(data[0].lon));
                            status.innerText = "OSM Found.";
                        } else { status.innerText = _t('status_error'); }
                    } catch(e) { status.innerText = _t('status_error'); }
                },
                onerror: () => { btn.disabled = false; status.innerText = _t('status_error'); }
            });
        },

        jumpTo: (lat, lon) => {
            const center = new OpenLayers.LonLat(lon, lat).transform(
                new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject()
            );
            W.map.setCenter(center);
            W.map.zoomTo(5);
        }
    };

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector("#aa-suite-header");
        if (header) header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.id === 'aa-suite-close-btn') return;
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

            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;

            if (newTop < 0) newTop = 0;
            const winHeight = window.innerHeight;
            if (newTop > winHeight - 40) newTop = winHeight - 40;

            if (newLeft < 0) newLeft = 0;
            const winWidth = window.innerWidth;
            const elWidth = elmnt.offsetWidth;
            if (newLeft + elWidth > winWidth) newLeft = winWidth - elWidth;

            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

})();