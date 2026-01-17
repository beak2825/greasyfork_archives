// ==UserScript==
// @name         abdullah abbas WME Instructions
// @namespace    http://tampermonkey.net/
// @version      2026.01.17.14
// @description  WME Voice Instructions with Halo Text & Offset Lines
// @author       Abdullah Abbas (AI Assistant)
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/563045/abdullah%20abbas%20WME%20Instructions.user.js
// @updateURL https://update.greasyfork.org/scripts/563045/abdullah%20abbas%20WME%20Instructions.meta.js
// ==/UserScript==

function run_abdullah_instructions() {
    "use strict";

    const SCRIPT_NAME = "abdullah abbas WME Instructions";
    const LAYER_NAME = "abdullah_instructions_layer";
    const STORAGE_KEY = "abdullah_instructions_settings_v14";

    let instructionsLayer = null;
    let arrowLayer = null;

    let settings = {
        isEnabled: true,
        language: 'en-US',
        top: '100px',
        left: '100px',
        isMinimized: false
    };

    // --- الترجمات ---
    const TRANSLATIONS = {
        'en-US': {
            lang_name: 'English (US)',
            ui_title: 'Voice Instructions',
            ui_enable: 'Enable',
            ui_lang: 'Language',
            'NONE': 'Default',
            'TURN_RIGHT': 'Turn Right',
            'TURN_LEFT': 'Turn Left',
            'KEEP_RIGHT': 'Keep Right',
            'KEEP_LEFT': 'Keep Left',
            'CONTINUE': 'Continue',
            'U_TURN': 'U-Turn',
            'UTURN': 'U-Turn',
            'EXIT_RIGHT': 'Exit Right',
            'EXIT_LEFT': 'Exit Left',
            'ROUNDABOUT_RIGHT': 'R-B Right',
            'ROUNDABOUT_LEFT': 'R-B Left',
            'ROUNDABOUT_STRAIGHT': 'R-B Straight',
            'ROUNDABOUT_EXIT': 'R-B Exit'
        },
        'ar-IQ': {
            lang_name: 'العربية (العراق)',
            ui_title: 'التوجيهات الصوتية',
            ui_enable: 'تفعيل',
            ui_lang: 'اللغة',
            'NONE': 'تلقائي',
            'TURN_RIGHT': 'انعطف يميناً',
            'TURN_LEFT': 'انعطف يساراً',
            'KEEP_RIGHT': 'الزم اليمين',
            'KEEP_LEFT': 'الزم اليسار',
            'CONTINUE': 'متابعة',
            'U_TURN': 'دوران للخلف',
            'UTURN': 'دوران للخلف',
            'EXIT_RIGHT': 'اخرج يميناً',
            'EXIT_LEFT': 'اخرج يساراً',
            'ROUNDABOUT_RIGHT': 'دوار يمين',
            'ROUNDABOUT_LEFT': 'دوار يسار',
            'ROUNDABOUT_STRAIGHT': 'دوار مستقيم',
            'ROUNDABOUT_EXIT': 'مخرج دوار'
        },
        'ckb-IQ': {
            lang_name: 'کوردی (سۆرانی)',
            ui_title: 'ڕێنماییە دەنگییەکان',
            ui_enable: 'چالاککردن',
            ui_lang: 'زمان',
            'NONE': 'دیاریکراو',
            'TURN_RIGHT': 'لادان بۆ ڕاست',
            'TURN_LEFT': 'لادان بۆ چەپ',
            'KEEP_RIGHT': 'لای ڕاست بگرە',
            'KEEP_LEFT': 'لای چەپ بگرە',
            'CONTINUE': 'بەردەوام بە',
            'U_TURN': 'پێچکردنەوە',
            'UTURN': 'پێچکردنەوە',
            'EXIT_RIGHT': 'دەرچوون بۆ ڕاست',
            'EXIT_LEFT': 'دەرچوون بۆ چەپ',
            'ROUNDABOUT_RIGHT': 'بازنە بۆ ڕاست',
            'ROUNDABOUT_LEFT': 'بازنە بۆ چەپ',
            'ROUNDABOUT_STRAIGHT': 'بازنە ڕاست',
            'ROUNDABOUT_EXIT': 'دەرچوونی بازنە'
        }
    };

    function t(key) {
        const lang = settings.language || 'en-US';
        return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ? TRANSLATIONS[lang][key] : key;
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) settings = { ...settings, ...JSON.parse(saved) };
        } catch (e) {}
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function init() {
        console.log(SCRIPT_NAME + ": Start v14");
        loadSettings();
        initLayers();
        createFloatingUI();

        window.W.selectionManager.events.register("selectionchanged", null, processSelection);
        window.W.map.events.register("zoomend", null, processSelection);
        window.W.map.events.register("moveend", null, processSelection);

        setTimeout(processSelection, 500);
    }

    function initLayers() {
        const oldLayers = window.W.map.getLayersBy("uniqueName", LAYER_NAME);
        oldLayers.forEach(l => l.destroy());

        const textStyle = new window.OpenLayers.StyleMap({
            "default": new window.OpenLayers.Style({
                label: "${text}",
                fontColor: "#000000",
                fontSize: "12px",
                fontFamily: "Tahoma, Arial",
                fontWeight: "bold",
                labelOutlineColor: "${bgColor}",
                labelOutlineWidth: 5,
                pointRadius: 0,
                fillOpacity: 0,
                graphicZIndex: 9999
            })
        });

        instructionsLayer = new window.OpenLayers.Layer.Vector(SCRIPT_NAME + " Text", {
            displayInLayerSwitcher: false,
            uniqueName: LAYER_NAME,
            styleMap: textStyle,
            rendererOptions: { zIndexing: true }
        });

        const lineStyle = new window.OpenLayers.StyleMap({
            "default": new window.OpenLayers.Style({
                strokeColor: "${lineColor}",
                strokeWidth: 3,
                strokeDashstyle: "solid",
                strokeOpacity: 0.9
            })
        });

        arrowLayer = new window.OpenLayers.Layer.Vector(SCRIPT_NAME + " Lines", {
            displayInLayerSwitcher: false,
            uniqueName: LAYER_NAME + "_lines",
            styleMap: lineStyle
        });

        window.W.map.addLayer(arrowLayer);
        window.W.map.addLayer(instructionsLayer);

        arrowLayer.setZIndex(2000);
        instructionsLayer.setZIndex(2001);

        instructionsLayer.setVisibility(settings.isEnabled);
        arrowLayer.setVisibility(settings.isEnabled);
    }

    function processSelection() {
        if (!instructionsLayer || !arrowLayer) return;
        instructionsLayer.destroyFeatures();
        arrowLayer.destroyFeatures();

        if (!settings.isEnabled) return;

        const selection = window.W.selectionManager.getSelectedFeatures();
        if (!selection || selection.length !== 1) return;

        const feature = selection[0];
        const selectedSegment = feature.model || feature._wmeObject;
        if (!selectedSegment || selectedSegment.type !== 'segment') return;

        const nodeIds = [selectedSegment.attributes.fromNodeID, selectedSegment.attributes.toNodeID];

        nodeIds.forEach(nodeId => {
            const node = window.W.model.nodes.getObjectById(nodeId);
            if (!node) return;

            node.attributes.segIDs.forEach(segId => {
                if (segId === selectedSegment.attributes.id) return;

                const connectedSeg = window.W.model.segments.getObjectById(segId);
                if (!connectedSeg) return;

                try {
                    const turn = window.W.model.getTurnGraph().getTurnThroughNode(node, selectedSegment, connectedSeg);
                    if (turn) {
                        const turnData = turn.getTurnData();
                        if (turnData && turnData.isAllowed()) {
                            let opcode = turnData.getInstructionOpcode();
                            if (!opcode || opcode === '') opcode = 'NONE';

                            const translatedText = t(opcode);
                            const color = getInstructionColor(opcode);

                            drawOffsetLabel(connectedSeg, node, translatedText, color);
                        }
                    }
                } catch (e) { console.error(e); }
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
        const lastPt = components[components.length - 1];
        const distToFirst = Math.sqrt(Math.pow(firstPt.x - nodeGeo.x, 2) + Math.pow(firstPt.y - nodeGeo.y, 2));

        let anchorPt, p1, p2;

        if (distToFirst < 10) {
            p1 = components[0];
            p2 = components[1];
            anchorPt = components[1] || p1;
        } else {
            p1 = components[components.length - 1];
            p2 = components[components.length - 2];
            anchorPt = components[components.length - 2] || p1;
        }

        if (!p1 || !p2) return;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);

        const perX = -dy / len;
        const perY = dx / len;

        const offsetDist = 55;

        const labelX = anchorPt.x + (perX * offsetDist);
        const labelY = anchorPt.y + (perY * offsetDist);

        const lineFeature = new window.OpenLayers.Feature.Vector(
            new window.OpenLayers.Geometry.LineString([
                new window.OpenLayers.Geometry.Point(anchorPt.x, anchorPt.y),
                new window.OpenLayers.Geometry.Point(labelX, labelY)
            ]),
            { lineColor: bgColor }
        );
        arrowLayer.addFeatures([lineFeature]);

        const pointFeature = new window.OpenLayers.Feature.Vector(
            new window.OpenLayers.Geometry.Point(labelX, labelY),
            {
                text: text,
                bgColor: bgColor
            }
        );
        instructionsLayer.addFeatures([pointFeature]);
    }

    function getOLFeatureGeometryFromSegment(segment) {
        if(window.W.map.segmentLayer && window.W.map.segmentLayer.features) {
             const feature = window.W.map.segmentLayer.features.find((feat) =>
                 feat.attributes.wazeFeature && feat.attributes.wazeFeature.id === segment.attributes.id
             );
             if (feature) return feature.geometry;
        }
        if (segment.getGeometry) return segment.getGeometry();
        if (segment.getOLGeometry) return segment.getOLGeometry();
        return null;
    }

    function createFloatingUI() {
        const uiId = 'abdullah-instructions-ui';
        if (document.getElementById(uiId)) document.getElementById(uiId).remove();

        const panel = document.createElement('div');
        panel.id = uiId;

        const dir = (settings.language === 'en-US') ? 'ltr' : 'rtl';
        // تعديل العرض ليستوعب العنوان الكامل
        const panelWidth = '160px';

        panel.style.cssText = `
            position: fixed; top: ${settings.top}; left: ${settings.left};
            width: ${panelWidth}; background: #fff; border: 1px solid #666;
            border-radius: 5px; z-index: 99999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-family: 'Tahoma', sans-serif; direction: ${dir}; text-align: center;
        `;

        // الحاوية العلوية (الهيدر)
        const header = document.createElement('div');
        header.style.cssText = `
            background: #444; color: #fff; height: 26px;
            border-radius: 4px 4px 0 0;
            display: flex; align-items: center; overflow: hidden;
        `;

        // مقبض التحريك (نقاط جانبية)
        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '&#8942;';
        dragHandle.title = "Move / تحريك";
        dragHandle.style.cssText = `
            width: 20px; height: 100%; cursor: move;
            display: flex; align-items: center; justify-content: center;
            background: #555; font-size: 16px; font-weight: bold; color: #ccc;
            flex-shrink: 0;
        `;

        // عنوان النافذة
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            flex-grow: 1; cursor: pointer; font-size: 11px; font-weight: bold;
            display: flex; align-items: center; justify-content: center; user-select: none;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 2px;
        `;
        titleBar.innerText = t('ui_title');

        if (settings.language === 'en-US') {
            header.appendChild(dragHandle);
            header.appendChild(titleBar);
        } else {
            header.appendChild(titleBar);
            header.appendChild(dragHandle);
        }

        panel.appendChild(header);

        const content = document.createElement('div');
        content.style.display = settings.isMinimized ? 'none' : 'block';
        content.style.padding = '8px 5px';

        const chkContainer = document.createElement('div');
        chkContainer.style.marginBottom = '8px';
        chkContainer.style.display = 'flex';
        chkContainer.style.alignItems = 'center';
        chkContainer.style.justifyContent = 'center';

        chkContainer.innerHTML = `
            <input type="checkbox" id="chkAbdInstructions" ${settings.isEnabled ? 'checked' : ''} style="cursor:pointer;">
            <label for="chkAbdInstructions" style="margin: 0 5px; font-size: 11px; font-weight: bold; cursor: pointer;">${t('ui_enable')}</label>
        `;
        content.appendChild(chkContainer);

        const langContainer = document.createElement('div');
        langContainer.innerHTML = `
            <select id="selAbdLang" style="width:100%; font-size:11px; padding:2px; border:1px solid #999; border-radius:3px;">
                <option value="ar-IQ" ${settings.language === 'ar-IQ' ? 'selected' : ''}>${TRANSLATIONS['ar-IQ'].lang_name}</option>
                <option value="ckb-IQ" ${settings.language === 'ckb-IQ' ? 'selected' : ''}>${TRANSLATIONS['ckb-IQ'].lang_name}</option>
                <option value="en-US" ${settings.language === 'en-US' ? 'selected' : ''}>${TRANSLATIONS['en-US'].lang_name}</option>
            </select>
        `;
        content.appendChild(langContainer);

        panel.appendChild(content);
        document.body.appendChild(panel);

        document.getElementById('chkAbdInstructions').addEventListener('change', (e) => {
            settings.isEnabled = e.target.checked;
            if(instructionsLayer) instructionsLayer.setVisibility(settings.isEnabled);
            if(arrowLayer) arrowLayer.setVisibility(settings.isEnabled);
            saveSettings();
            processSelection();
        });

        document.getElementById('selAbdLang').addEventListener('change', (e) => {
            settings.language = e.target.value;
            saveSettings();
            createFloatingUI();
            processSelection();
        });

        titleBar.addEventListener('click', () => {
            settings.isMinimized = !settings.isMinimized;
            content.style.display = settings.isMinimized ? 'none' : 'block';
            saveSettings();
        });

        let isDragging = false, startX, startY;
        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - panel.offsetLeft;
            startY = e.clientY - panel.offsetTop;
            dragHandle.style.color = '#fff';
        });

        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            e.preventDefault();
            const newLeft = (e.clientX - startX) + 'px';
            const newTop = (e.clientY - startY) + 'px';
            panel.style.left = newLeft;
            panel.style.top = newTop;
            settings.left = newLeft;
            settings.top = newTop;
        });

        document.addEventListener('mouseup', () => {
            if(isDragging) {
                isDragging = false;
                dragHandle.style.color = '#ccc';
                saveSettings();
            }
        });
    }

    function bootstrap() {
        if (typeof window.W !== 'undefined' && window.W.map && window.W.model && window.W.loginManager.user) {
            init();
        } else {
            setTimeout(bootstrap, 500);
        }
    }

    bootstrap();
}

let scriptElement = GM_addElement('script', {
    textContent: "" + run_abdullah_instructions.toString() + " \n" + "run_abdullah_instructions();"
});