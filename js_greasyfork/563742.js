// ==UserScript==
// @name         Abdullah Abbas WME Toolkit
// @namespace    https://waze.com/user/abdullah-abbas
// @version      2026.01.24.29
// @description  WME Suite: Custom Route Colors & Default Paths.
// @author       Abdullah Abbas
// @copyright    2026, Abdullah Abbas. All Rights Reserved.
// @license      All Rights Reserved
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @connect      waze.com
// @connect      routing-livemap-row.waze.com
// @connect      routing-livemap-na.waze.com
// @connect      routing-livemap-il.waze.com
// @connect      routing-livemap-am.waze.com
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563742/Abdullah%20Abbas%20WME%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/563742/Abdullah%20Abbas%20WME%20Toolkit.meta.js
// ==/UserScript==

/* global W, bootstrap, turf, OpenLayers */

(function() {
    'use strict';

    if (typeof turf === 'undefined') {
        console.error('Abdullah Abbas WME Toolkit: Turf.js failed to load.');
        return;
    }

    let sdk = null;
    let routeLayer = null;
    let routePoints = { start: null, end: null };

    // Updated Route Colors (Red-Purple, Blue, Green, Yellow)
    const ROUTE_COLORS = ["#e91e63", "#2196f3", "#4caf50", "#ffeb3b"];

    const SCRIPT_NAME = 'Abdullah Abbas WME Toolkit';
    const STORE_KEY = 'abdullah_abbas_settings_v35';
    const ROUTE_LAYER_NAME = 'Abdullah_Abbas_Route_Layer';

    const DEFAULT_SETTINGS = Object.freeze({
        lang: 'ar',
        moduleEnabled: true,
        raEnabled: true,
        raStep: 1,
        rtSpeed: 40,
        rtPaths: 1, // Default 1 path as requested
        roads: { St: true, PS: true, mH: true, MH: true, Fw: true, Rmp: true, PR: true, PLR: true },
        locks: { L1: true, L2: true, L3: true, L4: true, L5: true, L6: true }
    });

    let settings = loadSettings();

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORE_KEY);
            if (!saved) return { ...DEFAULT_SETTINGS };
            const parsed = JSON.parse(saved);
            return {
                ...DEFAULT_SETTINGS,
                ...parsed,
                roads: { ...DEFAULT_SETTINGS.roads, ...(parsed.roads || {}) },
                locks: { ...DEFAULT_SETTINGS.locks, ...(parsed.locks || {}) }
            };
        } catch (e) {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch (e) {}
    }

    function resetSettings() {
        if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط الإعدادات؟')) {
            localStorage.removeItem(STORE_KEY);
            location.reload();
        }
    }

    const PALETTE = {
        L1: { bg: '#ffffff', txt: '#000000' }, L2: { bg: '#f0ea58', txt: '#000000' },
        L3: { bg: '#69bf88', txt: '#000000' }, L4: { bg: '#45b8d1', txt: '#000000' },
        L5: { bg: '#bd5ab6', txt: '#ffffff' }, L6: { bg: '#ff0000', txt: '#ffffff' },
        Rmp: { bg: '#999999', txt: '#000000' }, PR:  { bg: '#beba6c', txt: '#000000' },
        PLR: { bg: '#ababab', txt: '#000000' }
    };

    const TRANSLATIONS = {
        'en': {
            dir: 'ltr', name: 'English (US)',
            moduleTitle: 'Segment Tools',
            raTitle: 'Roundabout Editor',
            rtTitle: 'Route Tester',
            lblSelectLang: 'Interface Language',
            lblEnableModule: 'Enable Segment Tools',
            lblEnableRA: 'Enable Roundabout Tool',
            lblRoadsConfig: 'Road Types',
            lblLocksConfig: 'Lock Levels',
            lblReset: 'Reset Settings',
            raTools: { move: 'Move', rotate: 'Rotate', scale: 'Scale', step: 'Value', open: 'Open RA Tools' },
            rtTools: { open: 'Test Route', setStart: 'Set Start (A)', setEnd: 'Set End (B)', calc: 'Calc / Update', clear: 'Clear', speed: 'Speed (km/h)', paths: 'Routes', dist: 'Dist', time: 'Time', noSel: 'Select a segment first!', error: 'Connection Error', noRoute: 'No Route Found' },
            roads: {
                St: { btn: 'St', tip: 'Street' }, PS: { btn: 'PS', tip: 'Primary Street' },
                mH: { btn: 'mH', tip: 'Minor Highway' }, MH: { btn: 'MH', tip: 'Major Highway' },
                Fw: { btn: 'Fw', tip: 'Freeway' }, Rmp: { btn: 'Ramp', tip: 'Ramp' },
                PR: { btn: 'PR', tip: 'Private Road' }, PLR: { btn: 'PLR', tip: 'Parking Lot' }
            }
        },
        'ar': {
            dir: 'rtl', name: 'العربية (العراق)',
            moduleTitle: 'أدوات القطاعات',
            raTitle: 'محرر الدوار',
            rtTitle: 'اختبار المسار',
            lblSelectLang: 'لغة الواجهة',
            lblEnableModule: 'تفعيل أدوات القطاعات',
            lblEnableRA: 'تفعيل أداة الدوار',
            lblRoadsConfig: 'أنواع الطرق',
            lblLocksConfig: 'مستويات القفل',
            lblReset: 'إعادة ضبط الإعدادات',
            raTools: { move: 'تحريك', rotate: 'تدوير', scale: 'حجم', step: 'القيمة', open: 'أدوات الدوار' },
            rtTools: { open: 'اختبار المسار', setStart: 'تحديد البداية (A)', setEnd: 'تحديد النهاية (B)', calc: 'حساب / تحديث', clear: 'مسح', speed: 'السرعة', paths: 'المسارات', dist: 'مسافة', time: 'وقت', noSel: 'يرجى تحديد مقطع طريق أولاً!', error: 'خطأ في الاتصال', noRoute: 'لم يتم العثور على مسار' },
            roads: {
                St: { btn: 'شارع', tip: 'شارع (Street)' }, PS: { btn: 'رئيسي', tip: 'شارع رئيسي (Primary)' },
                mH: { btn: 'س.ثانوي', tip: 'سريع ثانوي (Minor Hwy)' }, MH: { btn: 'س.رئيسي', tip: 'سريع رئيسي (Major Hwy)' },
                Fw: { btn: 'طريق حر', tip: 'طريق حر (Freeway)' }, Rmp: { btn: 'منحدر', tip: 'منحدر (Ramp)' },
                PR: { btn: 'خاص', tip: 'طريق خاص (Private)' }, PLR: { btn: 'موقف', tip: 'موقف سيارات (Parking)' }
            }
        },
        'ckb': {
            dir: 'rtl', name: 'کوردی (سۆرانی)',
            moduleTitle: 'امرازەکانی کەرتی ڕێگا',
            raTitle: 'دەسکاری بازنە',
            rtTitle: 'تاقیکردنەوەی ڕێگا',
            lblSelectLang: 'زمانی ڕووکار',
            lblEnableModule: 'چالاککردنی ئەم ئامرازە',
            lblEnableRA: 'چالاککردنی ئامرازی بازنە',
            lblRoadsConfig: 'جۆرەکانی ڕێگا',
            lblLocksConfig: 'ئاستەکانی قوفڵ',
            lblReset: 'ڕێکخستنەوە',
            raTools: { move: 'جوڵاندن', rotate: 'خولاندنەوە', scale: 'قەبارە', step: 'بڕ', open: 'ئامرازی بازنە' },
            rtTools: { open: 'تاقیکردنەوەی ڕێگا', setStart: 'دەستپێک (A)', setEnd: 'کۆتایی (B)', calc: 'کێشان / نوێکردنەوە', clear: 'پاککردنەوە', speed: 'خێرایی', paths: 'ژمارەی ڕێگا', dist: 'دووری', time: 'کات', noSel: 'سەرەتا ڕێگایەک دیاری بکە!', error: 'هەڵە', noRoute: 'ڕێگا نەدۆزرایەوە' },
            roads: {
                St: { btn: 'کۆڵان', tip: 'کۆڵان (Street)' }, PS: { btn: 'سەرەکی', tip: 'شەقامی سەرەکی (Primary)' },
                mH: { btn: 'خ.لاوەکی', tip: 'خێرای لاوەکی (Minor Hwy)' }, MH: { btn: 'خ.سەرەکی', tip: 'خێرای سەرەکی (Major Hwy)' },
                Fw: { btn: 'خێرا', tip: 'ڕێگای خێرا (Freeway)' }, Rmp: { btn: 'رامپ', tip: 'رامپ (Ramp)' },
                PR: { btn: 'تایبەت', tip: 'ڕێگای تایبەت (Private)' }, PLR: { btn: 'پارک', tip: 'پارکینگ (Parking)' }
            }
        }
    };

    async function startScript() {
        if (typeof bootstrap !== 'undefined') {
            sdk = await bootstrap();
            injectCustomCSS();
            initMutationObserver();
            initSettingsTab();
            initKeyboardShortcuts();
            initRouteLayer();
            console.log(`${SCRIPT_NAME} v${GM_info.script.version}: Active.`);
        }
    }

    function initRouteLayer() {
        try {
            const existing = W.map.getLayersBy('uniqueName', ROUTE_LAYER_NAME);
            if(existing.length > 0) existing.forEach(l => W.map.removeLayer(l));

            routeLayer = new OpenLayers.Layer.Vector(ROUTE_LAYER_NAME, {
                displayInLayerSwitcher: false,
                uniqueName: ROUTE_LAYER_NAME,
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        strokeColor: "#9c27b0",
                        strokeWidth: 6,
                        strokeOpacity: 0.7,
                        pointRadius: 6,
                        fillColor: "#00b0ff",
                        fillOpacity: 1,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        labelOutlineColor: "white",
                        labelOutlineWidth: 3,
                        labelAlign: "cm",
                        labelYOffset: 15,
                        label: "${labelText}"
                    })
                })
            });
            W.map.addLayer(routeLayer);
            routeLayer.setZIndex(9999);
            const layerDiv = document.getElementById(routeLayer.id);
            if (layerDiv) layerDiv.style.pointerEvents = "none";
        } catch (e) {
            console.error("Layer init failed", e);
        }
    }

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
                const tag = e.target.tagName.toLowerCase();
                if (tag !== 'input' && tag !== 'textarea') {
                    e.preventDefault();
                    attemptOpenRoundabout();
                }
            }
        });
    }

    function attemptOpenRoundabout() {
        if (!settings.raEnabled) return;
        const sel = sdk.Editing.getSelection();
        if (sel && sel.objectType === 'segment' && sel.ids.length > 0) {
            showRoundaboutUI();
        }
    }

    function injectCustomCSS() {
        const css = `
            .aa-grid-container { display: grid; gap: 4px; width: 100%; box-sizing: border-box; padding: 0; margin: 0; }
            .aa-grid-item { display: flex; align-items: center; justify-content: center; width: 100%; height: 28px; box-sizing: border-box; background: #fdfdfd; border: 1px solid #dcdcdc; border-radius: 4px; padding: 0 2px; cursor: pointer; transition: background 0.1s; font-size: 10px; font-weight: 600; color: #444; overflow: hidden; white-space: nowrap; }
            .aa-grid-item:hover { background: #f0f0f0; border-color: #bbb; }
            .aa-grid-item input { margin: 0 4px; cursor: pointer; }
            .aa-ra-popup { position: fixed; top: 150px; left: 150px; width: 320px; background: #fdfdfd; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); z-index: 9999; font-family: 'Segoe UI', Tahoma, sans-serif; overflow: hidden; border: 1px solid #c0c0c0; }
            .aa-ra-header { background: #2c3e50; color: #fff; padding: 10px 15px; font-size: 14px; font-weight: bold; display: flex; justify-content: space-between; cursor: move; align-items: center; border-bottom: 2px solid #1a252f; }
            .aa-ra-body { padding: 15px; display: flex; flex-direction: column; gap: 12px; }
            .aa-step-row { display: flex; align-items: center; justify-content: center; background: #eee; padding: 5px; border-radius: 6px; flex: 1; }
            .aa-step-label { font-size: 11px; font-weight: bold; margin-left: 4px; margin-right: 4px; color: #555; white-space: nowrap; }
            .aa-step-input { width: 45px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 3px; font-weight: bold; }
            .aa-section-title { font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; text-align: center; }
            .aa-ra-controls-grid { display: flex; gap: 10px; justify-content: center; }
            .aa-ra-btn { border: none; border-radius: 8px; color: #fff; cursor: pointer; font-weight: bold; font-size: 16px; transition: transform 0.1s, filter 0.1s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .aa-ra-btn:active { transform: scale(0.95); } .aa-ra-btn:hover { filter: brightness(1.1); }
            .btn-move { background: #2196f3; width: 40px; height: 40px; }
            .move-pad { display: grid; grid-template-columns: repeat(3, 40px); grid-template-rows: repeat(2, 40px); gap: 4px; justify-content: center; }
            .move-pad .btn-move:nth-child(1) { grid-column: 2; grid-row: 1; } .move-pad .btn-move:nth-child(2) { grid-column: 1; grid-row: 2; }
            .move-pad .btn-move:nth-child(3) { grid-column: 2; grid-row: 2; } .move-pad .btn-move:nth-child(4) { grid-column: 3; grid-row: 2; }
            .btn-rotate { background: #9c27b0; flex: 1; padding: 10px; } .btn-scale { background: #ff9800; flex: 1; padding: 10px; }
            .aa-close-btn { cursor: pointer; font-size: 18px; line-height: 1; color: #ccc; } .aa-close-btn:hover { color: #fff; }
            .aa-reset-btn { width: 100%; padding: 8px; background: #e0e0e0; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; margin-top: 10px; transition: background 0.2s; }
            .aa-reset-btn:hover { background: #d0d0d0; }
            .aa-rt-btn-row { display: flex; gap: 8px; margin-bottom: 5px; }
            .aa-rt-action-btn { flex: 1; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; cursor: pointer; font-size: 12px; transition:0.2s; }
            .aa-rt-blue { background: #2196f3; color: white; border: none; }
            .aa-rt-gray { background: #f0f0f0; color: #333; }
            .aa-rt-red { background: #ff5252; color: white; border: none; }
            .aa-main-rt-btn { width: 100%; padding: 8px; background: #ff9800; color: white; border: none; border-radius: 4px; margin-top: 15px; cursor: pointer; font-weight: bold; font-size: 11px; }
            .aa-main-rt-btn:hover { background: #f57c00; }
            .aa-rt-lbl { font-size: 11px; color:#555; text-align:center; padding:3px; background:#fff; border:1px solid #eee; margin-bottom:2px; border-radius:4px; }
        `;
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);
    }

    async function initSettingsTab() {
        const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
        tabLabel.innerText = SCRIPT_NAME;
        tabLabel.title = SCRIPT_NAME;
        renderSettingsContent(tabPane);
    }

    function renderSettingsContent(container) {
        container.innerHTML = '';
        const t = TRANSLATIONS[settings.lang] || TRANSLATIONS['en'];
        container.style.cssText = `padding: 12px; font-family: 'Segoe UI', Arial, sans-serif; direction: ${t.dir}; background: #fafafa; height: 100%; box-sizing: border-box;`;

        // Language Dropdown
        let langDiv = document.createElement('div');
        langDiv.style.cssText = 'margin-bottom: 20px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; width: 100%;';
        langDiv.innerHTML = `<div style="font-size:11px; font-weight:bold; margin-bottom:5px;">${t.lblSelectLang}</div>`;
        let langSelect = document.createElement('select');
        langSelect.style.cssText = 'width: 100%; padding: 5px; font-family: "Segoe UI", Tahoma, sans-serif; box-sizing: border-box;';
        Object.keys(TRANSLATIONS).forEach(key => {
            let opt = document.createElement('option');
            opt.value = key; opt.innerText = TRANSLATIONS[key].name;
            if (key === settings.lang) opt.selected = true;
            langSelect.appendChild(opt);
        });
        langSelect.onchange = (e) => {
            settings.lang = e.target.value; saveSettings(); renderSettingsContent(container); refreshInlinePanel(true);
        };
        langDiv.appendChild(langSelect);
        container.appendChild(langDiv);

        // Accordion
        createAccordion(container, t.moduleTitle, true, (body) => {
            body.appendChild(createCheckbox(t.lblEnableModule, settings.moduleEnabled, (chk) => {
                settings.moduleEnabled = chk; saveSettings(); refreshInlinePanel(true);
            }, true));

            let rTitle = document.createElement('div'); rTitle.innerText = t.lblRoadsConfig; rTitle.style.cssText = 'font-size: 11px; font-weight: bold; margin: 12px 0 6px; color: #2196f3;'; body.appendChild(rTitle);
            let rGrid = document.createElement('div'); rGrid.className = 'aa-grid-container'; rGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            Object.keys(t.roads).forEach(key => {
                rGrid.appendChild(createCheckbox(t.roads[key].btn, settings.roads[key], (v) => { settings.roads[key] = v; saveSettings(); refreshInlinePanel(true); }, false, true));
            });
            body.appendChild(rGrid);

            let lTitle = document.createElement('div'); lTitle.innerText = t.lblLocksConfig; lTitle.style.cssText = 'font-size: 11px; font-weight: bold; margin: 12px 0 6px; color: #2196f3;'; body.appendChild(lTitle);
            let lGrid = document.createElement('div'); lGrid.className = 'aa-grid-container'; lGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].forEach(key => {
                lGrid.appendChild(createCheckbox(key, settings.locks[key], (v) => { settings.locks[key] = v; saveSettings(); refreshInlinePanel(true); }, false, true));
            });
            body.appendChild(lGrid);
        });

        // Test Route Button (IN SIDEBAR)
        let rtBtnMain = document.createElement('button');
        rtBtnMain.className = 'aa-main-rt-btn';
        rtBtnMain.innerText = t.rtTools.open;
        rtBtnMain.onclick = (e) => { e.preventDefault(); showRouteTesterUI(); };
        container.appendChild(rtBtnMain);

        createAccordion(container, t.raTitle, false, (body) => {
            body.appendChild(createCheckbox(t.lblEnableRA, settings.raEnabled, (chk) => { settings.raEnabled = chk; saveSettings(); refreshInlinePanel(true); }, true));
        });

        let resetBtn = document.createElement('button');
        resetBtn.className = 'aa-reset-btn';
        resetBtn.innerText = t.lblReset;
        resetBtn.onclick = (e) => { e.preventDefault(); resetSettings(); };
        container.appendChild(resetBtn);

        let footer = document.createElement('div');
        footer.innerText = `v${GM_info.script.version}`;
        footer.style.cssText = 'font-size: 10px; color: #aaa; text-align: center; margin-top: 15px;';
        container.appendChild(footer);
    }

    function createAccordion(container, title, isOpenDefault, contentBuilder) {
        let card = document.createElement('div');
        card.style.cssText = 'border: 1px solid #ddd; border-radius: 6px; background: #fff; margin-bottom: 10px; width: 100%; box-sizing: border-box;';
        let header = document.createElement('div');
        header.style.cssText = 'background: #f8f8f8; padding: 10px; font-weight: bold; font-size: 12px; cursor: pointer; border-bottom: 1px solid #eee;';
        header.innerText = title;
        let body = document.createElement('div');
        body.style.cssText = 'padding: 10px; display: none; width: 100%; box-sizing: border-box;';
        if (isOpenDefault) body.style.display = 'block';
        header.onclick = () => body.style.display = (body.style.display === 'none') ? 'block' : 'none';
        card.appendChild(header); card.appendChild(body);
        contentBuilder(body);
        container.appendChild(card);
    }

    function createCheckbox(label, checked, onChange, isBold, isGridItem = false) {
        let l = document.createElement('label');
        if (isGridItem) l.className = 'aa-grid-item';
        else { l.style.cssText = 'display: flex; align-items: center; cursor: pointer; font-size: 11px; margin-bottom: 4px; width: 100%; box-sizing: border-box;'; if (isBold) l.style.fontWeight = 'bold'; }
        let i = document.createElement('input');
        i.type = 'checkbox'; i.checked = checked;
        if (!isGridItem) i.style.margin = '0 8px';
        i.onchange = (e) => onChange(e.target.checked);
        l.appendChild(i); l.appendChild(document.createTextNode(label));
        return l;
    }

    function initMutationObserver() {
        const editPanelNode = document.getElementById('edit-panel');
        if (!editPanelNode) { setTimeout(initMutationObserver, 500); return; }
        let timeout;
        const observer = new MutationObserver((mutations) => {
            let shouldRefresh = false;
            for (let m of mutations) {
                if (m.addedNodes.length > 0) {
                    if (m.target.id !== 'aan-toolkit-panel' && !m.target.closest('#aan-toolkit-panel')) { shouldRefresh = true; break; }
                }
            }
            if (shouldRefresh) { clearTimeout(timeout); timeout = setTimeout(() => refreshInlinePanel(false), 50); }
        });
        observer.observe(editPanelNode, { childList: true, subtree: true });
    }

    function refreshInlinePanel(force = false) {
        const existing = document.getElementById('aan-toolkit-panel');
        if (existing && !force) return;
        if (existing) existing.remove();
        if (!settings.moduleEnabled && !settings.raEnabled) return;
        const anchor = document.querySelector('.road-type-select') || document.querySelector('wz-select[name="roadType"]') || document.querySelector('.address-edit');
        if (anchor) { const panel = buildInlinePanel(); anchor.parentNode.insertBefore(panel, anchor); }
    }

    function buildInlinePanel() {
        const t = TRANSLATIONS[settings.lang] || TRANSLATIONS['en'];
        const panel = document.createElement('div');
        panel.id = 'aan-toolkit-panel';
        panel.style.cssText = `margin-bottom: 8px; padding: 6px; background: #fff; border: 1px solid #ccc; border-radius: 5px; text-align: center; direction: ${t.dir};`;

        let header = document.createElement('div');
        header.innerHTML = `<span style="font-weight:bold; color:#2196f3; font-size:11px;">${t.moduleTitle}</span>`;
        header.style.cssText = 'border-bottom:1px solid #f0f0f0; margin-bottom:5px; padding-bottom:3px;';
        panel.appendChild(header);

        if (settings.moduleEnabled) {
            const roadsData = [
                { k: 'St', v: 1, c: PALETTE.L1 }, { k: 'PS', v: 2, c: PALETTE.L2 }, { k: 'mH', v: 7, c: PALETTE.L3 }, { k: 'MH', v: 6, c: PALETTE.L4 },
                { k: 'Fw', v: 3, c: PALETTE.L5 }, { k: 'Rmp', v: 4, c: PALETTE.Rmp }, { k: 'PR', v: 17, c: PALETTE.PR }, { k: 'PLR', v: 20, c: PALETTE.PLR }
            ].filter(r => settings.roads[r.k]);
            if (roadsData.length) {
                let rGrid = document.createElement('div'); rGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-bottom: 5px;';
                roadsData.forEach(r => { let b = createCompactBtn(t.roads[r.k].btn, r.c.bg, r.c.txt, t.roads[r.k].tip); b.onclick = (e) => { e.preventDefault(); applyUpdate({ roadType: r.v }); }; rGrid.appendChild(b); });
                panel.appendChild(rGrid);
            }
            const locksData = [
                { k: 'L1', v: 0, c: PALETTE.L1 }, { k: 'L2', v: 1, c: PALETTE.L2 }, { k: 'L3', v: 2, c: PALETTE.L3 }, { k: 'L4', v: 3, c: PALETTE.L4 },
                { k: 'L5', v: 4, c: PALETTE.L5 }, { k: 'L6', v: 5, c: PALETTE.L6 }
            ].filter(l => settings.locks[l.k]);
            if (locksData.length) {
                let lGrid = document.createElement('div'); lGrid.style.cssText = 'display: flex; gap: 2px; margin-bottom: 5px;';
                locksData.forEach(l => { let b = createCompactBtn(l.k, l.c.bg, l.c.txt, `Lock ${l.v+1}`); b.style.flex = 1; b.onclick = (e) => { e.preventDefault(); applyUpdate({ lockRank: l.v }); }; lGrid.appendChild(b); });
                panel.appendChild(lGrid);
            }
        }

        if (settings.raEnabled) {
            const sel = sdk.Editing.getSelection();
            if (sel && sel.objectType === 'segment' && sel.ids.length > 0) {
                 let raBtn = createCompactBtn(t.raTools.open, '#2c3e50', '#fff', 'Open Roundabout Editor');
                 raBtn.style.marginTop = '5px';
                 raBtn.style.border = 'none';
                 raBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                 raBtn.title = 'Shortcut: Shift + R';
                 raBtn.onclick = (e) => { e.preventDefault(); showRoundaboutUI(); };
                 panel.appendChild(raBtn);
            }
        }
        return panel;
    }

    function createCompactBtn(text, bg, color, tip) {
        let b = document.createElement('button');
        b.innerText = text; b.title = tip;
        b.style.cssText = `background:${bg}; color:${color}; border:1px solid rgba(0,0,0,0.1); border-radius:3px; cursor:pointer; font-weight:bold; font-size:10px; height:24px; width:100%; white-space:nowrap; overflow:hidden;`;
        return b;
    }

    function applyUpdate(changes) {
        if (!sdk) return;
        const sel = sdk.Editing.getSelection();
        if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;
        sel.ids.forEach(id => { try { sdk.DataModel.Segments.updateSegment({ segmentId: id, ...changes }); } catch(e) { console.error(e); } });
    }

    // ================== ROUTE TESTER UI ==================
    function showRouteTesterUI() {
        if (document.getElementById('aa-rt-popup')) return;
        const t = TRANSLATIONS[settings.lang] || TRANSLATIONS['en'];

        let popup = document.createElement('div');
        popup.id = 'aa-rt-popup';
        popup.className = 'aa-ra-popup';
        popup.style.direction = t.dir;

        let header = document.createElement('div');
        header.className = 'aa-ra-header';
        header.innerHTML = `<span>${t.rtTitle}</span> <span class="aa-close-btn">×</span>`;
        header.querySelector('.aa-close-btn').onclick = () => { closeRouteTester(); popup.remove(); };
        popup.appendChild(header);

        let body = document.createElement('div');
        body.className = 'aa-ra-body';

        // Start Button
        let btnStart = document.createElement('button');
        btnStart.id = 'aa-rt-start-btn';
        btnStart.className = 'aa-rt-action-btn aa-rt-gray';
        btnStart.style.width = '100%'; btnStart.style.marginBottom = '5px';
        btnStart.innerText = routePoints.start ? `✅ ${t.rtTools.setStart}` : t.rtTools.setStart;
        btnStart.onclick = () => setPointFromSelection('start', t, btnStart);
        body.appendChild(btnStart);

        let lblStart = document.createElement('div');
        lblStart.id = 'aa-rt-lbl-a'; lblStart.className = 'aa-rt-lbl';
        lblStart.innerText = '...';
        body.appendChild(lblStart);

        // End Button
        let btnEnd = document.createElement('button');
        btnEnd.id = 'aa-rt-end-btn';
        btnEnd.className = 'aa-rt-action-btn aa-rt-gray';
        btnEnd.style.width = '100%'; btnEnd.style.marginBottom = '5px'; btnEnd.style.marginTop = '10px';
        btnEnd.innerText = routePoints.end ? `✅ ${t.rtTools.setEnd}` : t.rtTools.setEnd;
        btnEnd.onclick = () => setPointFromSelection('end', t, btnEnd);
        body.appendChild(btnEnd);

        let lblEnd = document.createElement('div');
        lblEnd.id = 'aa-rt-lbl-b'; lblEnd.className = 'aa-rt-lbl';
        lblEnd.innerText = '...';
        body.appendChild(lblEnd);

        // Combined Settings Row (Speed + Paths)
        let setRow = document.createElement('div');
        setRow.className = 'aa-rt-btn-row';
        setRow.style.marginTop = '10px';

        // Speed
        let speedWrapper = document.createElement('div');
        speedWrapper.className = 'aa-step-row';
        speedWrapper.innerHTML = `<span class="aa-step-label">${t.rtTools.speed}:</span>`;
        let speedInput = document.createElement('input');
        speedInput.type = 'number'; speedInput.className = 'aa-step-input';
        speedInput.min = '1'; speedInput.max = '200';
        speedInput.value = settings.rtSpeed;
        speedInput.onchange = (e) => { let v = parseFloat(e.target.value); if(v>0) { settings.rtSpeed=v; saveSettings(); } };
        speedWrapper.appendChild(speedInput);

        // Paths
        let pathsWrapper = document.createElement('div');
        pathsWrapper.className = 'aa-step-row';
        pathsWrapper.innerHTML = `<span class="aa-step-label">${t.rtTools.paths}:</span>`;
        let pathsInput = document.createElement('input');
        pathsInput.type = 'number'; pathsInput.className = 'aa-step-input';
        pathsInput.min = '1'; pathsInput.max = '4';
        pathsInput.value = settings.rtPaths || 1;
        pathsInput.onchange = (e) => { let v = parseInt(e.target.value); if(v>=1 && v<=4) { settings.rtPaths=v; saveSettings(); } };
        pathsWrapper.appendChild(pathsInput);

        setRow.append(speedWrapper, pathsWrapper);
        body.appendChild(setRow);

        // Actions
        let row2 = document.createElement('div');
        row2.className = 'aa-rt-btn-row';
        row2.style.marginTop = '10px';

        let btnCalc = document.createElement('button');
        btnCalc.className = 'aa-rt-action-btn aa-rt-blue';
        btnCalc.innerText = t.rtTools.calc;
        btnCalc.onclick = () => fetchAndDrawRealRoute(t);

        let btnClear = document.createElement('button');
        btnClear.className = 'aa-rt-action-btn aa-rt-red';
        btnClear.innerText = t.rtTools.clear;
        btnClear.onclick = () => {
            routePoints = { start: null, end: null };
            if(routeLayer) routeLayer.removeAllFeatures();
            btnStart.innerText = t.rtTools.setStart; btnStart.style.background = '#f0f0f0';
            btnEnd.innerText = t.rtTools.setEnd; btnEnd.style.background = '#f0f0f0';
            lblStart.innerText = '...'; lblEnd.innerText = '...';
        };
        row2.append(btnCalc, btnClear);
        body.appendChild(row2);

        popup.appendChild(body);
        document.body.appendChild(popup);
        makeElementDraggable(popup, header);
    }

    function setPointFromSelection(type, t, btn) {
        const sel = sdk.Editing.getSelection();
        if (!sel || sel.objectType !== 'segment' || !sel.ids.length) {
            alert(t.rtTools.noSel);
            return;
        }

        const segId = sel.ids[0];
        const segment = W.model.segments.getObjectById ? W.model.segments.getObjectById(segId) : W.model.segments.objects[segId];
        if (!segment) return;

        const center = segment.geometry.getCentroid();
        const lonlat = center.clone().transform(W.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));

        const coordsObj = {
            api: { lon: lonlat.x, lat: lonlat.y },
            map: { x: center.x, y: center.y }
        };

        if (type === 'start') {
            routePoints.start = coordsObj;
            btn.innerText = `✅ ${t.rtTools.setStart}`;
            btn.style.background = '#e0ffe0';
            document.getElementById('aa-rt-lbl-a').innerText = `${lonlat.y.toFixed(5)}, ${lonlat.x.toFixed(5)}`;
            drawMarker(coordsObj.map, '#1565c0', 'A');
        } else {
            routePoints.end = coordsObj;
            btn.innerText = `✅ ${t.rtTools.setEnd}`;
            btn.style.background = '#e0ffe0';
            document.getElementById('aa-rt-lbl-b').innerText = `${lonlat.y.toFixed(5)}, ${lonlat.x.toFixed(5)}`;
            drawMarker(coordsObj.map, '#c2185b', 'B');
        }
    }

    function drawMarker(coords, color, label) {
        if (!routeLayer) return;
        if (routeLayer.features) {
            const existing = routeLayer.features.filter(f => f.attributes.type === label);
            routeLayer.removeFeatures(existing);
        }
        const pt = new OpenLayers.Geometry.Point(coords.x, coords.y);
        const feat = new OpenLayers.Feature.Vector(pt, { type: label }, {
            pointRadius: 8,
            fillColor: color,
            strokeColor: '#fff',
            strokeWidth: 2,
            label: label,
            fontColor: '#fff',
            fontSize: '10px',
            fontWeight: 'bold'
        });
        routeLayer.addFeatures([feat]);
    }

    function closeRouteTester() {
        if(routeLayer) routeLayer.removeAllFeatures();
    }

    function fetchAndDrawRealRoute(t) {
        if (!routePoints.start || !routePoints.end) return;

        const markers = routeLayer.features.filter(f => f.attributes.type === 'A' || f.attributes.type === 'B');
        routeLayer.removeAllFeatures();
        routeLayer.addFeatures(markers);

        let region = 'row';
        if (W.model.topCountry && W.model.topCountry.env) region = W.model.topCountry.env.toLowerCase();

        let url = 'https://routing-livemap-row.waze.com/RoutingManager/routingRequest';
        if (region === 'usa' || region === 'na') url = 'https://routing-livemap-am.waze.com/RoutingManager/routingRequest';
        if (region === 'il') url = 'https://routing-livemap-il.waze.com/RoutingManager/routingRequest';

        const start = routePoints.start.api;
        const end = routePoints.end.api;
        const nPaths = settings.rtPaths || 1;

        const data = [
            `from=x%3A${start.lon}%20y%3A${start.lat}`,
            `to=x%3A${end.lon}%20y%3A${end.lat}`,
            `at=0`,
            `returnJSON=true`,
            `returnGeometries=true`,
            `returnInstructions=true`,
            `timeout=60000`,
            `nPaths=${nPaths}`,
            `clientVersion=4.0.0`,
            `options=AVOID_TRAILS%3At%2CALLOW_UTURNS%3At`
        ].join('&');

        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + data,
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                if (response.status !== 200) {
                    alert(`${t.rtTools.error} HTTP ${response.status}`);
                    return;
                }
                let json = null;
                try { json = JSON.parse(response.responseText); } catch (e) {}

                if (!json || (!json.coords && !json.alternatives)) {
                    alert(t.rtTools.noRoute);
                    return;
                }

                // FIXED PARSING LOGIC FOR MULTIPLE ROUTES
                let routesToDraw = [];

                // 1. Primary Route (Always exists if successful)
                if (json.coords) {
                    routesToDraw.push(json);
                }

                // 2. Alternative Routes (If requested)
                if (json.alternatives && settings.rtPaths > 1) {
                    json.alternatives.forEach(alt => {
                        if (alt.response) {
                            routesToDraw.push(alt.response);
                        }
                    });
                }

                // Slice to limit
                routesToDraw = routesToDraw.slice(0, settings.rtPaths);

                if (routesToDraw.length > 0) {
                    routesToDraw.forEach((route, index) => {
                        drawRoute(route, index);
                    });
                } else {
                    alert(t.rtTools.noRoute);
                }
            },
            onerror: function() {
                alert(t.rtTools.error);
            }
        });
    }

    function drawRoute(routeData, index) {
        let points = [];

        if (routeData.coords) {
            points = routeData.coords.map(c => new OpenLayers.Geometry.Point(c.x, c.y).transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject()));
        } else if (routeData.results) {
            routeData.results.forEach(res => {
                points.push(new OpenLayers.Geometry.Point(res.path.x, res.path.y).transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject()));
            });
        }

        if (points.length > 0) {
            // Color Cycle
            const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
            const width = index === 0 ? 7 : 5;
            const opacity = index === 0 ? 0.8 : 0.6;

            const line = new OpenLayers.Geometry.LineString(points);
            const feat = new OpenLayers.Feature.Vector(line, {}, {
                strokeColor: color,
                strokeWidth: width,
                strokeOpacity: opacity
            });
            routeLayer.addFeatures([feat]);

            // Add Markers (Every 250m)
            const speedKmh = settings.rtSpeed || 40;
            let runningDist = 0;
            let nextMarkerDist = 250; // 250m interval

            for(let i=0; i<points.length-1; i++){
                let segDist = points[i].distanceTo(points[i+1]);
                runningDist += segDist;

                if(runningDist >= nextMarkerDist){
                    let ratio = 1 - ((runningDist - nextMarkerDist) / segDist);
                    let mx = points[i].x + (points[i+1].x - points[i].x) * ratio;
                    let my = points[i].y + (points[i+1].y - points[i].y) * ratio;
                    let pt = new OpenLayers.Geometry.Point(mx, my);

                    let distKm = (nextMarkerDist / 1000).toFixed(2);
                    let timeHours = (nextMarkerDist / 1000) / speedKmh;
                    let timeSeconds = Math.round(timeHours * 3600);

                    let timeLabel = "";
                    if (timeSeconds < 60) timeLabel = `${timeSeconds}s`;
                    else timeLabel = `${Math.round(timeSeconds/60)}m`;

                    let style = {
                        label: `${distKm}km\n${timeLabel}`,
                        fontColor: "#000",
                        fontSize: "9px",
                        fontWeight: "bold",
                        pointRadius: 4,
                        fillColor: color,
                        labelYOffset: 12,
                        strokeColor: "#fff",
                        labelOutlineColor: "white",
                        labelOutlineWidth: 2
                    };
                    routeLayer.addFeatures([new OpenLayers.Feature.Vector(pt, {}, style)]);

                    nextMarkerDist += 250;
                }
            }
        }
    }

    // ================== ROUNDABOUT UI ==================
    function showRoundaboutUI() {
        if (document.getElementById('aa-ra-popup')) return;
        const t = TRANSLATIONS[settings.lang] || TRANSLATIONS['en'];

        let popup = document.createElement('div');
        popup.id = 'aa-ra-popup';
        popup.className = 'aa-ra-popup';
        popup.style.direction = t.dir;

        let header = document.createElement('div');
        header.className = 'aa-ra-header';
        header.innerHTML = `<span>${t.raTitle}</span> <span class="aa-close-btn">×</span>`;
        header.querySelector('.aa-close-btn').onclick = () => popup.remove();
        popup.appendChild(header);

        let body = document.createElement('div');
        body.className = 'aa-ra-body';

        let stepDiv = document.createElement('div'); stepDiv.className = 'aa-step-row';
        stepDiv.innerHTML = `<span class="aa-step-label">${t.raTools.step}:</span>`;
        let stepInput = document.createElement('input'); stepInput.type = 'number'; stepInput.className = 'aa-step-input';
        stepInput.min = '0.1'; stepInput.max = '50'; stepInput.value = settings.raStep;
        stepInput.onchange = (e) => { let v = parseFloat(e.target.value); if(v>50){alert('Value too high'); v=50; e.target.value=50;} if(v>0){settings.raStep=v; saveSettings();} };
        stepDiv.appendChild(stepInput); body.appendChild(stepDiv);

        let sectMove = document.createElement('div'); sectMove.innerHTML = `<div class="aa-section-title">${t.raTools.move}</div>`;
        let movePad = document.createElement('div'); movePad.className = 'move-pad';
        let btnN = document.createElement('button'); btnN.className = 'aa-ra-btn btn-move'; btnN.innerText = '▲'; btnN.onclick = () => modifyWholeRoundabout('move', 'N'); movePad.appendChild(btnN);
        let btnW = document.createElement('button'); btnW.className = 'aa-ra-btn btn-move'; btnW.innerText = '◀'; btnW.onclick = () => modifyWholeRoundabout('move', 'W'); movePad.appendChild(btnW);
        let btnS = document.createElement('button'); btnS.className = 'aa-ra-btn btn-move'; btnS.innerText = '▼'; btnS.onclick = () => modifyWholeRoundabout('move', 'S'); movePad.appendChild(btnS);
        let btnE = document.createElement('button'); btnE.className = 'aa-ra-btn btn-move'; btnE.innerText = '▶'; btnE.onclick = () => modifyWholeRoundabout('move', 'E'); movePad.appendChild(btnE);
        sectMove.appendChild(movePad); body.appendChild(sectMove);

        let sectRot = document.createElement('div'); sectRot.innerHTML = `<div class="aa-section-title">${t.raTools.rotate}</div>`;
        let rotGrid = document.createElement('div'); rotGrid.className = 'aa-ra-controls-grid';
        let btnRL = document.createElement('button'); btnRL.className = 'aa-ra-btn btn-rotate'; btnRL.innerText = '↺'; btnRL.onclick = () => modifyWholeRoundabout('rotate', -1);
        let btnRR = document.createElement('button'); btnRR.className = 'aa-ra-btn btn-rotate'; btnRR.innerText = '↻'; btnRR.onclick = () => modifyWholeRoundabout('rotate', 1);
        rotGrid.append(btnRL, btnRR); sectRot.appendChild(rotGrid); body.appendChild(sectRot);

        let sectSc = document.createElement('div'); sectSc.innerHTML = `<div class="aa-section-title">${t.raTools.scale}</div>`;
        let scGrid = document.createElement('div'); scGrid.className = 'aa-ra-controls-grid';
        let btnSM = document.createElement('button'); btnSM.className = 'aa-ra-btn btn-scale'; btnSM.innerText = '－'; btnSM.onclick = () => modifyWholeRoundabout('scale', 'shrink');
        let btnSP = document.createElement('button'); btnSP.className = 'aa-ra-btn btn-scale'; btnSP.innerText = '＋'; btnSP.onclick = () => modifyWholeRoundabout('scale', 'grow');
        scGrid.append(btnSM, btnSP); sectSc.appendChild(scGrid); body.appendChild(sectSc);

        popup.appendChild(body); document.body.appendChild(popup); makeElementDraggable(popup, header);
    }

    function getFullRoundaboutIds(seedId) {
        if (typeof W === 'undefined' || !W.model || !W.model.segments) return [seedId];
        const seedSeg = W.model.segments.getObjectById ? W.model.segments.getObjectById(seedId) : W.model.segments.objects[seedId];
        if (!seedSeg) return [seedId];
        const jId = seedSeg.attributes.junctionID || seedSeg.attributes.junctionId;
        if (!jId) return [seedId];
        let raIds = [];
        const allSegs = W.model.segments.getObjectArray ? W.model.segments.getObjectArray() : Object.values(W.model.segments.objects);
        allSegs.forEach(seg => { const sjId = seg.attributes.junctionID || seg.attributes.junctionId; if (sjId === jId) raIds.push(seg.attributes.id); });
        return raIds.length > 0 ? raIds : [seedId];
    }

    function modifyWholeRoundabout(action, direction) {
        const sel = sdk.Editing.getSelection();
        if (!sel || !sel.ids.length) return;
        const seedId = sel.ids[0];
        const raSegmentIds = getFullRoundaboutIds(seedId);
        let stepVal = settings.raStep; if (isNaN(stepVal) || stepVal <= 0) stepVal = 1;
        let factor = 1.0; let angle = 0; let distKm = 0;
        if (action === 'scale') { if (direction === 'grow') factor = 1 + (stepVal / 100); else factor = Math.max(0.1, 1 - (stepVal / 100)); }
        else if (action === 'rotate') { angle = (direction === 1) ? stepVal : -stepVal; }
        else if (action === 'move') { distKm = stepVal / 1000; }

        let points = [];
        raSegmentIds.forEach(id => { const s = sdk.DataModel.Segments.getById({ segmentId: id }); if(s) s.geometry.coordinates.forEach(c => points.push(c)); });
        if (points.length === 0) return;
        const center = turf.center(turf.multiPoint(points)).geometry.coordinates;
        const raNodes = new Set();
        raSegmentIds.forEach(id => { const s = sdk.DataModel.Segments.getById({ segmentId: id }); if(s) { raNodes.add(s.fromNodeId); raNodes.add(s.toNodeId); } });
        raNodes.forEach(nodeId => { const node = sdk.DataModel.Nodes.getById({ nodeId: nodeId }); if (node) { const newCoords = applyCustomTransform(node.geometry.coordinates, center, action, direction, factor, angle, distKm); sdk.DataModel.Nodes.moveNode({ id: nodeId, geometry: { type: 'Point', coordinates: newCoords }}); } });
        raSegmentIds.forEach(segId => { const s = sdk.DataModel.Segments.getById({ segmentId: segId }); if (!s) return; const newSegCoords = s.geometry.coordinates.map(pt => applyCustomTransform(pt, center, action, direction, factor, angle, distKm)); sdk.DataModel.Segments.updateSegment({ segmentId: segId, geometry: { type: 'LineString', coordinates: newSegCoords }}); });
    }

    function applyCustomTransform(point, center, action, direction, factor, angle, distKm) {
        if (action === 'scale') { const newLon = center[0] + (point[0] - center[0]) * factor; const newLat = center[1] + (point[1] - center[1]) * factor; return [newLon, newLat]; }
        const pt = turf.point(point); const origin = turf.point(center);
        if (action === 'move') { let b = 0; if (direction === 'E') b = 90; else if (direction === 'S') b = 180; else if (direction === 'W') b = 270; const res = turf.destination(pt, distKm, b, { units: 'kilometers' }); return res.geometry.coordinates; }
        else if (action === 'rotate') { const res = turf.transformRotate(pt, angle, { pivot: origin }); return res.geometry.coordinates; }
        return point;
    }

    function makeElementDraggable(el, handle) {
        let x1=0, y1=0, x2=0, y2=0;
        handle.onmousedown = (e) => { e.preventDefault(); x2 = e.clientX; y2 = e.clientY; document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; }; document.onmousemove = (ev) => { ev.preventDefault(); x1 = x2 - ev.clientX; y1 = y2 - ev.clientY; x2 = ev.clientX; y2 = ev.clientY; el.style.top = (el.offsetTop - y1) + "px"; el.style.left = (el.offsetLeft - x1) + "px"; }; };
    }

    startScript();
})();