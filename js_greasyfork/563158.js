// ==UserScript==
// @name         Abdullah Abbas WME Toolkit
// @namespace    https://github.com/abdullah-abbas/wme-scripts
// @version      2026.01.18.01
// @description  أداة شاملة: مفتش الخريطة (علوي) + توجيهات صوتية (سفلي)
// @author       Abdullah Abbas
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563158/Abdullah%20Abbas%20WME%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/563158/Abdullah%20Abbas%20WME%20Toolkit.meta.js
// ==/UserScript==

/* global W, OpenLayers */

(function() {
    'use strict';

    const SCRIPT_NAME = "Abdullah Abbas Toolkit";
    const SCRIPT_VERSION = "2026.01.18.01";
    const STORE_KEY_SETTINGS = "aa_toolkit_settings_v18_01";
    const STORE_KEY_WIN_STATE = "aa_toolkit_win_state";
    const STORE_KEY_TOOLBAR = "aa_toolkit_toolbar_pos";

    // --- إعدادات افتراضية ---
    let settings = {
        instrEnabled: true,
        instrLang: 'en-US',
        inspectorLang: 'en-US',
        inspOptions: {
            places: true, residential: true, images: true,
            streets: true, mps: true, mcs: true,
            urs: true, urs_chat: true, urs_no_chat: true
        }
    };

    // --- متغيرات النظام ---
    let instructionsLayer = null;
    let arrowLayer = null;
    let currentResults = [];
    let isLandscape = localStorage.getItem('aa-inspector-orientation') !== 'false';

    // --- الترجمات ---
    const TRANSLATIONS = {
        'en-US': {
            ui_title: 'Abdullah Abbas Toolkit',
            settings: "Settings", results: "Results",
            lang_ui: "UI Lang", lang_voice: "Voice Lang",
            // Inspector
            sec_insp: "Map Inspector", start_scan: "Start Scan",
            clean_msg: "✅ Area Clean", count: "Issues:",
            rescan: "Re-scan 🔄", clear_btn: "Clear 🧹",
            opt_places: "🏢 Venues", opt_res: "🏠 Residential", opt_img: "🖼️ Images",
            opt_streets: "🛣️ Segments", opt_mps: "🤖 Map Problems", opt_mcs: "💬 Comments",
            opt_urs_group: "📩 Update Requests", opt_urs_chat: "With Chat", opt_urs_no_chat: "No Chat",
            details_new: "New", details_edit: "Edits", details_img: "Image",
            details_unverified: "Unverified", details_ur_chat: "Chat", details_ur_silent: "Silent",
            // Voice
            sec_instr: "Voice Instructions", ui_enable_instr: "Enable Overlay",
            'NONE': 'Default', 'TURN_RIGHT': 'Turn Right', 'TURN_LEFT': 'Turn Left',
            'KEEP_RIGHT': 'Keep Right', 'KEEP_LEFT': 'Keep Left', 'CONTINUE': 'Continue',
            'U_TURN': 'U-Turn', 'UTURN': 'U-Turn', 'EXIT_RIGHT': 'Exit Right',
            'EXIT_LEFT': 'Exit Left', 'ROUNDABOUT_RIGHT': 'R-B Right',
            'ROUNDABOUT_LEFT': 'R-B Left', 'ROUNDABOUT_STRAIGHT': 'R-B Straight',
            'ROUNDABOUT_EXIT': 'R-B Exit'
        },
        'ar-IQ': {
            ui_title: 'أدوات عبدالله عباس',
            settings: "الإعدادات", results: "النتائج",
            lang_ui: "لغة الواجهة", lang_voice: "لغة الصوت",
            // Inspector
            sec_insp: "مفتش الخريطة", start_scan: "بدء الفحص",
            clean_msg: "✅ المنطقة نظيفة", count: "العدد:",
            rescan: "إعادة الفحص 🔄", clear_btn: "مسح 🧹",
            opt_places: "🏢 الأماكن", opt_res: "🏠 المنازل", opt_img: "🖼️ الصور",
            opt_streets: "🛣️ الشوارع", opt_mps: "🤖 مشاكل النظام", opt_mcs: "💬 التعليقات",
            opt_urs_group: "📩 طلبات التحديث", opt_urs_chat: "مع محادثة", opt_urs_no_chat: "بدون محادثة",
            details_new: "جديد", details_edit: "تعديل", details_img: "صورة",
            details_unverified: "غير مؤكد", details_ur_chat: "نقاش", details_ur_silent: "صامت",
            // Voice
            sec_instr: "التوجيهات الصوتية", ui_enable_instr: "تفعيل الطبقة",
            'NONE': 'تلقائي', 'TURN_RIGHT': 'انعطف يميناً', 'TURN_LEFT': 'انعطف يساراً',
            'KEEP_RIGHT': 'الزم اليمين', 'KEEP_LEFT': 'الزم اليسار', 'CONTINUE': 'متابعة',
            'U_TURN': 'دوران للخلف', 'UTURN': 'دوران للخلف', 'EXIT_RIGHT': 'اخرج يميناً',
            'EXIT_LEFT': 'اخرج يساراً', 'ROUNDABOUT_RIGHT': 'دوار يمين',
            'ROUNDABOUT_LEFT': 'دوار يسار', 'ROUNDABOUT_STRAIGHT': 'دوار مستقيم',
            'ROUNDABOUT_EXIT': 'مخرج دوار'
        },
        'ckb-IQ': {
            ui_title: 'ئامرازەکانی عبدالله عباس',
            settings: "ڕێکخستن", results: "ئەنجام",
            lang_ui: "زمانی ڕووکار", lang_voice: "زمانی دەنگ",
            // Inspector
            sec_insp: "پشکنەری نەخشە", start_scan: "دەستپێکردن",
            clean_msg: "✅ ناوچەکە پاکە", count: "ژمارە:",
            rescan: "دووبارە 🔄", clear_btn: "پاککردنەوە 🧹",
            opt_places: "🏢 شوێنەکان", opt_res: "🏠 ماڵەکان", opt_img: "🖼️ وێنەکان",
            opt_streets: "🛣️ شەقامەکان", opt_mps: "🤖 کێشەی سیستەم", opt_mcs: "💬 لێدوانەکان",
            opt_urs_group: "📩 سکاڵاکان", opt_urs_chat: "لەگەڵ چات", opt_urs_no_chat: "بێ چات",
            details_new: "نوێ", details_edit: "دەستکاری", details_img: "وێنە",
            details_unverified: "پەسەند نەکراو", details_ur_chat: "چات", details_ur_silent: "بێدەنگ",
            // Voice
            sec_instr: "ڕێنماییە دەنگییەکان", ui_enable_instr: "چالاککردن",
            'NONE': 'دیاریکراو', 'TURN_RIGHT': 'لادان بۆ ڕاست', 'TURN_LEFT': 'لادان بۆ چەپ',
            'KEEP_RIGHT': 'لای ڕاست بگرە', 'KEEP_LEFT': 'لای چەپ بگرە', 'CONTINUE': 'بەردەوام بە',
            'U_TURN': 'پێچکردنەوە', 'UTURN': 'پێچکردنەوە', 'EXIT_RIGHT': 'دەرچوون بۆ ڕاست',
            'EXIT_LEFT': 'دەرچوون بۆ چەپ', 'ROUNDABOUT_RIGHT': 'بازنە بۆ ڕاست',
            'ROUNDABOUT_LEFT': 'بازنە بۆ چەپ', 'ROUNDABOUT_STRAIGHT': 'بازنە ڕاست',
            'ROUNDABOUT_EXIT': 'دەرچوونی بازنە'
        }
    };

    function t(key) {
        const lang = settings.inspectorLang || 'en-US';
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) return TRANSLATIONS[lang][key];
        const vLang = settings.instrLang || 'en-US';
        if (TRANSLATIONS[vLang] && TRANSLATIONS[vLang][key]) return TRANSLATIONS[vLang][key];
        return key;
    }

    // --- التحميل والتهيئة ---
    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORE_KEY_SETTINGS);
            if (saved) {
                const parsed = JSON.parse(saved);
                settings = { ...settings, ...parsed };
                if(parsed.inspOptions) settings.inspOptions = { ...settings.inspOptions, ...parsed.inspOptions };
            }
        } catch (e) {}
    }

    function saveSettings() {
        localStorage.setItem(STORE_KEY_SETTINGS, JSON.stringify(settings));
    }

    function bootstrap() {
        if (typeof W !== 'undefined' && W.map && W.model && W.loginManager.user) {
            init();
        } else {
            setTimeout(bootstrap, 500);
        }
    }

    function init() {
        console.log(SCRIPT_NAME + ": Start " + SCRIPT_VERSION);
        loadSettings();
        initInstructionsLayer();
        createCompactToolbar();
        W.selectionManager.events.register("selectionchanged", null, processInstructionsSelection);
        W.map.events.register("zoomend", null, processInstructionsSelection);
        W.map.events.register("moveend", null, processInstructionsSelection);
        setTimeout(processInstructionsSelection, 500);
    }

    // ==========================================
    // 1. منطق التوجيهات الصوتية
    // ==========================================
    function initInstructionsLayer() {
        const LAYER_NAME = "abdullah_instructions_layer";
        const oldLayers = W.map.getLayersBy("uniqueName", LAYER_NAME);
        oldLayers.forEach(l => l.destroy());

        const textStyle = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                label: "${text}", fontColor: "#000000", fontSize: "12px",
                fontFamily: "Tahoma, Arial", fontWeight: "bold",
                labelOutlineColor: "${bgColor}", labelOutlineWidth: 5,
                pointRadius: 0, fillOpacity: 0, graphicZIndex: 9999
            })
        });

        instructionsLayer = new OpenLayers.Layer.Vector(SCRIPT_NAME + " Text", {
            displayInLayerSwitcher: false, uniqueName: LAYER_NAME,
            styleMap: textStyle, rendererOptions: { zIndexing: true }
        });

        const lineStyle = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "${lineColor}", strokeWidth: 3,
                strokeDashstyle: "solid", strokeOpacity: 0.9
            })
        });

        arrowLayer = new OpenLayers.Layer.Vector(SCRIPT_NAME + " Lines", {
            displayInLayerSwitcher: false, uniqueName: LAYER_NAME + "_lines", styleMap: lineStyle
        });

        W.map.addLayer(arrowLayer);
        W.map.addLayer(instructionsLayer);
        arrowLayer.setZIndex(2000); instructionsLayer.setZIndex(2001);
        instructionsLayer.setVisibility(settings.instrEnabled);
        arrowLayer.setVisibility(settings.instrEnabled);
    }

    function processInstructionsSelection() {
        if (!instructionsLayer || !arrowLayer) return;
        instructionsLayer.destroyFeatures(); arrowLayer.destroyFeatures();
        if (!settings.instrEnabled) return;

        const selection = W.selectionManager.getSelectedFeatures();
        if (!selection || selection.length !== 1) return;
        const feature = selection[0];
        const selectedSegment = feature.model || feature._wmeObject;
        if (!selectedSegment || selectedSegment.type !== 'segment') return;

        const nodeIds = [selectedSegment.attributes.fromNodeID, selectedSegment.attributes.toNodeID];
        nodeIds.forEach(nodeId => {
            const node = W.model.nodes.getObjectById(nodeId);
            if (!node) return;
            node.attributes.segIDs.forEach(segId => {
                if (segId === selectedSegment.attributes.id) return;
                const connectedSeg = W.model.segments.getObjectById(segId);
                if (!connectedSeg) return;
                try {
                    const turn = W.model.getTurnGraph().getTurnThroughNode(node, selectedSegment, connectedSeg);
                    if (turn) {
                        const turnData = turn.getTurnData();
                        if (turnData && turnData.isAllowed()) {
                            let opcode = turnData.getInstructionOpcode();
                            if (!opcode || opcode === '') opcode = 'NONE';
                            const langCode = settings.instrLang || 'en-US';
                            let translatedText = (TRANSLATIONS[langCode] && TRANSLATIONS[langCode][opcode]) ? TRANSLATIONS[langCode][opcode] : opcode;
                            drawOffsetLabel(connectedSeg, node, translatedText, getInstructionColor(opcode));
                        }
                    }
                } catch (e) {}
            });
        });
    }

    function getInstructionColor(opcode) {
        if (opcode === 'NONE') return "#DDDDDD";
        if (opcode.includes("RIGHT")) return "#44FF44";
        if (opcode.includes("LEFT")) return "#44FFFF";
        if (opcode.includes("KEEP")) return "#FFFF44";
        if (opcode.includes("EXIT")) return "#FFB044";
        if (opcode.includes("U_TURN") || opcode.includes("UTURN")) return "#FF88CC";
        if (opcode.includes("CONTINUE")) return "#FFFFFF";
        return "#CCCCCC";
    }

    function drawOffsetLabel(segment, node, text, bgColor) {
        const geometry = getOLFeatureGeometryFromSegment(segment);
        if (!geometry) return;
        const components = geometry.components;
        const nodeGeo = node.getGeometry();
        if (!components || components.length < 2) return;

        const firstPt = components[0];
        const distToFirst = Math.sqrt(Math.pow(firstPt.x - nodeGeo.x, 2) + Math.pow(firstPt.y - nodeGeo.y, 2));
        let anchorPt, p1, p2;

        if (distToFirst < 10) { p1 = components[0]; p2 = components[1]; anchorPt = components[1] || p1; }
        else { p1 = components[components.length - 1]; p2 = components[components.length - 2]; anchorPt = components[components.length - 2] || p1; }
        if (!p1 || !p2) return;

        const dx = p2.x - p1.x; const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const perX = -dy / len; const perY = dx / len;
        const offsetDist = 55;
        const labelX = anchorPt.x + (perX * offsetDist);
        const labelY = anchorPt.y + (perY * offsetDist);

        const lineFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(anchorPt.x, anchorPt.y), new OpenLayers.Geometry.Point(labelX, labelY)]),
            { lineColor: bgColor }
        );
        arrowLayer.addFeatures([lineFeature]);
        const pointFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(labelX, labelY), { text: text, bgColor: bgColor }
        );
        instructionsLayer.addFeatures([pointFeature]);
    }

    function getOLFeatureGeometryFromSegment(segment) {
        if(W.map.segmentLayer && W.map.segmentLayer.features) {
             const feature = W.map.segmentLayer.features.find((feat) => feat.attributes.wazeFeature && feat.attributes.wazeFeature.id === segment.attributes.id);
             if (feature) return feature.geometry;
        }
        if (segment.getGeometry) return segment.getGeometry();
        if (segment.getOLGeometry) return segment.getOLGeometry();
        return null;
    }

    // ==========================================
    // 2. واجهة المستخدم (Layout)
    // ==========================================
    function createCompactToolbar() {
        const toolbarId = 'aa-main-toolbar';
        const existing = document.getElementById(toolbarId);
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = toolbarId;
        const savedPos = JSON.parse(localStorage.getItem(STORE_KEY_TOOLBAR)) || { top: "10px", left: "50%" };
        let posStyle = (savedPos.left === "50%") ? `top: ${savedPos.top}; left: 50%; transform: translateX(-50%);` : `top: ${savedPos.top}; left: ${savedPos.left};`;

        container.style.cssText = `position: fixed; ${posStyle} background: #2c3e50; border-radius: 50px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; align-items: center; padding: 2px 8px 2px 4px; z-index: 10000; font-family: 'Rubik', sans-serif; border: 1px solid rgba(255,255,255,0.2); height: 26px;`;

        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '⋮';
        dragHandle.style.cssText = `cursor: move; color: #bdc3c7; font-size: 16px; margin-right: 4px; user-select: none; line-height: 26px; padding: 0 4px; font-weight: bold;`;

        const btn = document.createElement('button');
        btn.innerHTML = `<span style="margin-right:4px; font-size:12px;">🛠️</span>${t('ui_title')}`;
        btn.style.cssText = `background: none; border: none; color: white; font-weight: bold; font-family: inherit; font-size: 11px; cursor: pointer; padding: 0; line-height: 1; margin-top: 1px;`;
        btn.onclick = () => openUnifiedDashboard();

        container.appendChild(dragHandle); container.appendChild(btn);
        document.body.appendChild(container);
        makeDraggable(container, dragHandle);
    }

    function createOptionItem(id, title, desc, checked) {
        return `
            <div class="aa-opt-item" style="background:white; border-radius:5px; padding:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05); border:1px solid #eee; display:flex; align-items:center;">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="margin-inline-end: 8px; cursor:pointer;">
                <div style="flex:1;">
                    <label for="${id}" style="font-weight:bold; font-size:11px; color:#2c3e50; cursor:pointer; display:block;">${title}</label>
                    ${desc ? `<div style="font-size:9px; color:#95a5a6; margin-top:1px;">${desc}</div>` : ''}
                </div>
            </div>
        `;
    }

    // عنصر واجهة "بطاقة النتيجة" الذي يشبه عنصر الإعدادات
    function createResultCard(item, index) {
        return `
            <div style="background:white; border-radius:5px; padding:6px; margin-bottom:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05); border:1px solid #eee; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                    <span style="font-size:14px;">${item.type}</span>
                    <div style="display:flex; flex-direction:column; overflow:hidden;">
                        <span style="font-weight:bold; font-size:11px; color:#2c3e50; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</span>
                        <span style="font-size:10px; color:#e67e22;">${item.details}</span>
                    </div>
                </div>
                <button class="aa-go-btn" data-idx="${index}" style="background:#27ae60; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:10px; font-weight:bold; flex-shrink:0; margin-inline-start:5px;">Go</button>
            </div>
        `;
    }

    function openUnifiedDashboard() {
        if (document.getElementById('aa-dashboard-panel-v3')) return;

        const dir = (settings.inspectorLang === 'en-US') ? 'ltr' : 'rtl';
        const align = (settings.inspectorLang === 'en-US') ? 'left' : 'right';
        const gridStyle = isLandscape ? "display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;" : "display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;";

        // الهيكل العام: فليكس عمودي
        // القسم العلوي (فليكس 1): مفتش الخريطة (تبويبات + محتوى)
        // القسم السفلي (ثابت): التوجيهات الصوتية

        const htmlContent = `
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background:#f4f6f7;">
                <div style="background:#fff; padding:6px 10px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:#2c3e50; font-size:12px;">${t('sec_insp')}</span>
                    <select id="aa-lang-ui" style="font-size:10px; border:1px solid #ccc; border-radius:3px;">
                        <option value="ar-IQ" ${settings.inspectorLang === 'ar-IQ' ? 'selected' : ''}>العربية</option>
                        <option value="en-US" ${settings.inspectorLang === 'en-US' ? 'selected' : ''}>English</option>
                        <option value="ckb-IQ" ${settings.inspectorLang === 'ckb-IQ' ? 'selected' : ''}>کوردی</option>
                    </select>
                </div>

                <div style="display:flex; border-bottom: 2px solid #ecf0f1; background:#fff;">
                    <button id="tab-btn-settings" class="aa-tab-btn" style="flex:1; padding:6px; background:none; border:none; border-bottom:3px solid #3498db; font-weight:bold; cursor:pointer; color:#2c3e50; font-size:11px;">⚙️ ${t('settings')}</button>
                    <button id="tab-btn-results" class="aa-tab-btn" style="flex:1; padding:6px; background:none; border:none; border-bottom:3px solid transparent; font-weight:bold; cursor:pointer; color:#7f8c8d; font-size:11px;">📊 ${t('results')}</button>
                </div>

                <div id="tab-content-settings" style="flex:1; overflow-y:auto; padding:10px; display:block;">
                    <button id="aa-start-scan" style="width:100%; padding:8px; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px; margin-bottom:10px; box-shadow:0 2px 3px rgba(0,0,0,0.1);">${t('start_scan')} 🚀</button>

                    <div style="${gridStyle} margin-bottom:10px;">
                        ${createOptionItem('opt-places', t('opt_places'), '', settings.inspOptions.places)}
                        ${createOptionItem('opt-res', t('opt_res'), '', settings.inspOptions.residential)}
                        ${createOptionItem('opt-img', t('opt_img'), '', settings.inspOptions.images)}
                        ${createOptionItem('opt-streets', t('opt_streets'), '', settings.inspOptions.streets)}
                        ${createOptionItem('opt-mps', t('opt_mps'), '', settings.inspOptions.mps)}
                        ${createOptionItem('opt-mcs', t('opt_mcs'), '', settings.inspOptions.mcs)}
                    </div>

                    <div style="background:white; border-radius:5px; padding:6px; border:1px solid #eee;">
                         <div style="display:flex; align-items:center; margin-bottom:4px;">
                             <input type="checkbox" id="opt-urs" ${settings.inspOptions.urs ? 'checked' : ''} style="margin-inline-end: 6px;">
                             <label for="opt-urs" style="font-weight:bold; font-size:11px;">${t('opt_urs_group')}</label>
                         </div>
                         <div style="display:flex; gap:10px; padding-inline-start: 18px;">
                            <label style="font-size:10px; cursor:pointer;"><input type="checkbox" id="opt-urs-chat" ${settings.inspOptions.urs_chat ? 'checked' : ''}> ${t('opt_urs_chat')}</label>
                            <label style="font-size:10px; cursor:pointer;"><input type="checkbox" id="opt-urs-no-chat" ${settings.inspOptions.urs_no_chat ? 'checked' : ''}> ${t('opt_urs_no_chat')}</label>
                         </div>
                    </div>
                </div>

                <div id="tab-content-results" style="flex:1; overflow-y:auto; padding:10px; display:none;">
                    <div id="results-container">
                        <div style="text-align:center; padding:20px; color:#bdc3c7; font-size:11px;">${t('start_scan')}</div>
                    </div>
                </div>
            </div>

            <div style="flex-shrink:0; border-top:1px solid #ddd; background:#fff; padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <span style="font-weight:bold; color:#2980b9; font-size:11px;">${t('sec_instr')}</span>
                    <select id="sel-instr-lang" style="font-size:10px; border:1px solid #ccc; border-radius:3px;">
                        <option value="ar-IQ" ${settings.instrLang === 'ar-IQ' ? 'selected' : ''}>العربية</option>
                        <option value="en-US" ${settings.instrLang === 'en-US' ? 'selected' : ''}>English</option>
                        <option value="ckb-IQ" ${settings.instrLang === 'ckb-IQ' ? 'selected' : ''}>کوردی</option>
                    </select>
                </div>
                <label style="font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; background:#f9f9f9; padding:5px; border-radius:4px; border:1px solid #eee;">
                    <input type="checkbox" id="chk-instr-enable" ${settings.instrEnabled ? 'checked' : ''} style="margin-inline-end:6px;">
                    ${t('ui_enable_instr')}
                </label>
            </div>

            <div style="text-align:center; background:#f4f6f7; color:#bdc3c7; font-size:8px; padding:2px;">
                v${SCRIPT_VERSION}
            </div>
        `;

        const body = createFloatingWindow('aa-dashboard-panel-v3', t('ui_title'), htmlContent);

        // Events: UI Language
        body.querySelector('#aa-lang-ui').addEventListener('change', (e) => {
            settings.inspectorLang = e.target.value; saveSettings();
            body.closest('#aa-dashboard-panel-v3').remove(); openUnifiedDashboard();
        });

        // Events: Instructions
        body.querySelector('#chk-instr-enable').addEventListener('change', (e) => {
            settings.instrEnabled = e.target.checked;
            if(instructionsLayer) instructionsLayer.setVisibility(settings.instrEnabled);
            if(arrowLayer) arrowLayer.setVisibility(settings.instrEnabled);
            saveSettings(); processInstructionsSelection();
        });
        body.querySelector('#sel-instr-lang').addEventListener('change', (e) => {
            settings.instrLang = e.target.value; saveSettings(); processInstructionsSelection();
        });

        // Events: Inspector Options
        const mapIdsToKeys = {
            'opt-places': 'places', 'opt-res': 'residential', 'opt-img': 'images',
            'opt-streets': 'streets', 'opt-mps': 'mps', 'opt-mcs': 'mcs',
            'opt-urs': 'urs', 'opt-urs-chat': 'urs_chat', 'opt-urs-no-chat': 'urs_no_chat'
        };
        for (const [id, key] of Object.entries(mapIdsToKeys)) {
            const el = body.querySelector('#' + id);
            if(el) el.addEventListener('change', () => { settings.inspOptions[key] = el.checked; saveSettings(); });
        }

        // Tabs Logic
        const btnSettings = body.querySelector('#tab-btn-settings');
        const btnResults = body.querySelector('#tab-btn-results');
        const contentSettings = body.querySelector('#tab-content-settings');
        const contentResults = body.querySelector('#tab-content-results');

        const switchTab = (tab) => {
            if (tab === 'settings') {
                contentSettings.style.display = 'block'; contentResults.style.display = 'none';
                btnSettings.style.borderBottomColor = '#3498db'; btnSettings.style.color = '#2c3e50';
                btnResults.style.borderBottomColor = 'transparent'; btnResults.style.color = '#7f8c8d';
            } else {
                contentSettings.style.display = 'none'; contentResults.style.display = 'block';
                btnSettings.style.borderBottomColor = 'transparent'; btnSettings.style.color = '#7f8c8d';
                btnResults.style.borderBottomColor = '#3498db'; btnResults.style.color = '#2c3e50';
            }
        };
        btnSettings.onclick = () => switchTab('settings');
        btnResults.onclick = () => switchTab('results');

        // Start Scan
        body.querySelector('#aa-start-scan').onclick = () => {
            switchTab('results');
            runScanLogic(body.querySelector('#results-container'));
        };

        if(currentResults.length > 0) renderResultsTable(body.querySelector('#results-container'));
    }

    // ==========================================
    // 3. منطق الفحص (Inspector Logic)
    // ==========================================
    function runScanLogic(container) {
        if (W.map.getZoom() < 15) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#c0392b; font-weight:bold;">⚠️ Zoom 15+</div>`;
            return;
        }

        const results = [];
        const opts = settings.inspOptions;

        // Helper
        const hasImgReq = (reqs) => reqs && reqs.some(r => r.imageURL || r.thumbnailURL || (r.attributes && (r.attributes.imageURL || r.attributes.type === 'IMAGE')));

        // 1. Places
        if (W.model.venues) {
            for (let id in W.model.venues.objects) {
                let v = W.model.venues.objects[id];
                let attr = v.attributes;
                let isRes = attr.residential;
                let isNew = !attr.approved;
                let hasUnapprovedEdits = (attr.unapprovedEdits === true) || (v.getFlagAttributes && v.getFlagAttributes().unapprovedEdits);
                let requests = attr.requests || [];
                let hasUpdateReq = (requests.length > 0) || (attr.hasOpenUpdateRequests === true);
                let rawImages = attr.images || [];
                let hasNewImgInList = rawImages.some(i => i.approved === false);
                let hasImgInReq = hasImgReq(requests);
                let isNewWithImg = isNew && (rawImages.length > 0);
                let hasAnyImage = hasNewImgInList || hasImgInReq || isNewWithImg;

                let reasons = [];
                let showThis = false;

                if (opts.images && hasAnyImage) {
                    showThis = true;
                    if (isNewWithImg) reasons.push(t('details_img'));
                    else reasons.push(t('details_img'));
                }

                if ((isRes && opts.residential) || (!isRes && opts.places)) {
                    if (isNew) { reasons.push(t('details_new')); showThis = true; }
                    else if (hasUnapprovedEdits) { reasons.push(t('details_edit')); showThis = true; }
                    if (hasUpdateReq) { reasons.push("Req"); showThis = true; }
                }

                if (showThis && reasons.length > 0) {
                    results.push({
                        obj: v, type: isRes ? "🏠" : "🏢",
                        name: attr.name || (isRes ? "Home" : "-"),
                        details: [...new Set(reasons)].join("+")
                    });
                }
            }
        }

        // 2. Streets
        if (opts.streets && W.model.segments) {
            for (let id in W.model.segments.objects) {
                let s = W.model.segments.objects[id];
                if (s.attributes.unverified) {
                    let stName = "-";
                    try { let st = W.model.streets.get(s.attributes.primaryStreetID); if(st) stName = st.name || "-"; } catch(e) {}
                    results.push({ obj: s, type: "🛣️", name: stName, details: t('details_unverified') });
                }
            }
        }

        // 3. URs
        if (opts.urs && W.model.mapUpdateRequests) {
            for (let id in W.model.mapUpdateRequests.objects) {
                let ur = W.model.mapUpdateRequests.objects[id];
                if (ur.attributes.status === 0) {
                    let conv = ur.attributes.conversation;
                    let hasComments = conv && conv.length > 0;
                    if ((hasComments && opts.urs_chat) || (!hasComments && opts.urs_no_chat)) {
                        results.push({ obj: ur, type: "📩", name: "UR #" + id, details: hasComments ? t('details_ur_chat') : t('details_ur_silent') });
                    }
                }
            }
        }

        // 4. MPs
        if (opts.mps && W.model.mapProblems) {
            for (let id in W.model.mapProblems.objects) {
                let mp = W.model.mapProblems.objects[id];
                if (mp.attributes.status === 0) results.push({ obj: mp, type: "🤖", name: "MP #" + id, details: "MP" });
            }
        }

        // 5. MCs
        if (opts.mcs && W.model.mapComments) {
            for (let id in W.model.mapComments.objects) {
                 results.push({ obj: W.model.mapComments.objects[id], type: "💬", name: "Comment", details: "MC" });
            }
        }

        currentResults = results;
        renderResultsTable(container);
    }

    function renderResultsTable(container) {
        if (currentResults.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#27ae60; font-weight:bold;">${t('clean_msg')}</div>
            <div style="text-align:center;"><button id="aa-rescan" style="cursor:pointer; background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px;">${t('rescan')}</button></div>`;
            container.querySelector('#aa-rescan').onclick = () => runScanLogic(container);
            return;
        }

        let html = `
            <div style="padding:5px; text-align:center; background:#eee; position:sticky; top:0; z-index:5; border-radius:4px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:10px; font-weight:bold; color:#7f8c8d;">${t('count')} ${currentResults.length}</span>
                <div>
                    <button id="aa-rescan-btn" style="cursor:pointer; background:none; border:none; color:#2980b9; font-weight:bold; font-size:10px;">${t('rescan')}</button>
                    <span style="color:#ccc;">|</span>
                    <button id="aa-clear-btn" style="cursor:pointer; background:none; border:none; color:#c0392b; font-weight:bold; font-size:10px;">${t('clear_btn')}</button>
                </div>
            </div>
            <div style="padding-bottom:10px;">
        `;

        // استخدام نظام البطاقات بدلاً من الجدول
        currentResults.forEach((item, i) => {
            html += createResultCard(item, i);
        });
        html += `</div>`;
        container.innerHTML = html;

        container.querySelectorAll('.aa-go-btn').forEach(b => {
            b.onclick = (e) => {
                const item = currentResults[e.target.getAttribute('data-idx')];
                W.selectionManager.setSelectedModels(item.obj);
                let centerPt = item.obj.geometry.getCentroid();
                if (centerPt) W.map.setCenter(new OpenLayers.LonLat(centerPt.x, centerPt.y));
            };
        });

        container.querySelector('#aa-rescan-btn').onclick = () => runScanLogic(container);
        container.querySelector('#aa-clear-btn').onclick = () => {
             currentResults = []; renderResultsTable(container); W.selectionManager.unselectAll();
        };
    }

    // ==========================================
    // 4. نظام النافذة العائمة (Window System)
    // ==========================================
    function createFloatingWindow(id, title, contentHTML) {
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const dir = (settings.inspectorLang === 'en-US') ? 'ltr' : 'rtl';
        const savedState = JSON.parse(localStorage.getItem(STORE_KEY_WIN_STATE)) || {};
        const width = savedState.width || (isLandscape ? "700px" : "400px");
        const height = savedState.height || "550px";
        const top = savedState.top || "80px";
        const left = savedState.left || "100px";
        const isMin = savedState.minimized || false;

        const win = document.createElement('div');
        win.id = id;
        win.style.cssText = `
            position: fixed; top: ${top}; left: ${left};
            width: ${isMin ? '160px' : width}; height: ${isMin ? '28px' : height};
            background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex; flex-direction: column; z-index: 10000;
            font-family: 'Rubik', sans-serif; direction: ${dir};
            resize: ${isMin ? 'none' : 'both'}; overflow: hidden; min-width: 280px; min-height: 20px;
            border: 1px solid #bdc3c7;
        `;

        const header = document.createElement('div');
        header.style.cssText = `background: #2c3e50; color: #ecf0f1; padding: 6px 10px; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none; flex-shrink: 0; font-size: 13px;`;

        const controls = `
            <div style="display:flex; gap:0;">
                <button class="aa-rotate-btn" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px;">⟲</button>
                <button class="aa-min-btn" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px;">${isMin ? '□' : '_'}</button>
                <button class="aa-close-btn" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px;">✕</button>
            </div>`;
        header.innerHTML = `<span style="font-weight:bold;">${title}</span>` + controls;

        const body = document.createElement('div');
        body.style.cssText = `padding: 0; overflow-y: hidden; flex: 1; display: ${isMin ? 'none' : 'flex'}; flex-direction:column;`;
        body.innerHTML = contentHTML;

        win.appendChild(header); win.appendChild(body);
        document.body.appendChild(win);
        makeDraggable(win, header);

        const saveState = () => {
             localStorage.setItem(STORE_KEY_WIN_STATE, JSON.stringify({
                top: win.style.top, left: win.style.left,
                width: isMin ? savedState.width : win.style.width,
                height: isMin ? savedState.height : win.style.height,
                minimized: isMin
            }));
        };
        win.addEventListener('mouseup', () => { if(!isMin) saveState(); });
        header.querySelector('.aa-close-btn').onclick = () => win.remove();
        header.querySelector('.aa-rotate-btn').onclick = () => {
            isLandscape = !isLandscape; localStorage.setItem('aa-inspector-orientation', isLandscape);
            win.style.width = isLandscape ? "700px" : "400px"; saveState(); openUnifiedDashboard();
        };
        header.querySelector('.aa-min-btn').onclick = () => {
            if (!isMin) { body.style.display='none'; win.style.height='28px'; win.style.width='160px'; win.style.resize='none'; }
            else { body.style.display='flex'; win.style.height=savedState.height || "550px"; win.style.width=savedState.width || "700px"; win.style.resize='both'; }
            localStorage.setItem(STORE_KEY_WIN_STATE, JSON.stringify({ ...savedState, minimized: !isMin }));
            win.remove(); openUnifiedDashboard();
        };
        return body;
    }

    function makeDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event; if(e.button === 2) return; e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event; e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            if (elmnt.id === 'aa-main-toolbar') localStorage.setItem(STORE_KEY_TOOLBAR, JSON.stringify({ top: elmnt.style.top, left: elmnt.style.left }));
        }
    }

    bootstrap();
})();