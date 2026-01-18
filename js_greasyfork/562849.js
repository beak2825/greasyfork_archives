// ==UserScript==
// @name          abdullah abbas Junction Angle
// @description   Show the angle between two selected segments with multi-language support (Ar-IQ, Kur-Sorani, En-US) and Side-by-Side Settings
// @match         https://beta.waze.com/*editor*
// @match         https://www.waze.com/*editor*
// @exclude       https://www.waze.com/*user/*editor/*
// @version       2026.01.18.09
// @author        Abdullah Abbas
// @grant         GM_addElement
// @namespace     https://greasyfork.org/scripts/35547-wme-junction-angle-info/
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license       CC-BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/562849/abdullah%20abbas%20Junction%20Angle.user.js
// @updateURL https://update.greasyfork.org/scripts/562849/abdullah%20abbas%20Junction%20Angle.meta.js
// ==/UserScript==

function run_ja() {
    "use strict";

    var junctionangle_version = "2026.01.18.09";
    var ja_options = {};
    var ja_mapLayer;

    // --- Constants ---
    var TURN_ANGLE = 45.50;
    var U_TURN_ANGLE = 168.24;
    var GRAY_ZONE = 1.5;
    var OVERLAPPING_ANGLE = 0.666;

    var ja_routing_type = {
        BC: "junction_none",
        KEEP: "junction_keep",
        KEEP_LEFT: "junction_keep_left",
        KEEP_RIGHT: "junction_keep_right",
        TURN: "junction_turn",
        TURN_LEFT: "junction_turn_left",
        TURN_RIGHT: "junction_turn_right",
        EXIT: "junction_exit",
        EXIT_LEFT: "junction_exit_left",
        EXIT_RIGHT: "junction_exit_right",
        U_TURN: "junction_u_turn",
        PROBLEM: "junction_problem",
        NO_TURN: "junction_no_turn",
        NO_U_TURN: "junction_no_u_turn",
        ROUNDABOUT: "junction_roundabout",
        ROUNDABOUT_EXIT: "junction_roundabout_exit",
        OverrideBC: "Override_none",
        OverrideCONTINUE: "Override_continue",
        OverrideKEEP_LEFT: "Override_keep_left",
        OverrideKEEP_RIGHT: "Override_keep_right",
        OverrideTURN_LEFT: "Override_turn_left",
        OverrideTURN_RIGHT: "Override_turn_right",
        OverrideEXIT: "Override_exit",
        OverrideEXIT_LEFT: "Override_exit_left",
        OverrideEXIT_RIGHT: "Override_exit_right",
        OverrideU_TURN: "Override_u_turn"
    };

    // --- Translations ---
    var ja_translations_db = {
        "en-US": {
            name: "abdullah abbas Junction Angle",
            settingsTitle: "Junction Angle Settings",
            uiLanguage: "Interface Language",
            generalSettings: "General Settings",
            enableScript: "Enable Script",
            resetToDefault: "Reset to default",
            override: "Check \"override instruction\"",
            guess: "Estimate routing instructions",
            decimals: "Decimals",
            textSize: "Text Size",
            circleSize: "Circle Size",
            lineLength: "Line Length",
            lineWidth: "Line Width",
            visualSettings: "Visual Settings",
            colors: "Color Settings",
            turnInstructionColor: "Turn Color",
            uTurnInstructionColor: "U-Turn Color",
            exitInstructionColor: "Exit Color",
            keepInstructionColor: "Keep Color",
            noTurnColor: "Disallowed Color",
            problemColor: "Problem Color",
            noInstructionColor: "No Instruction",
            continueInstructionColor: "Continue Color",
            roundaboutColor: "Roundabout Color",
            roundaboutOverlayDisplay: "Show Roundabout Overlay",
            roundaboutOverlayColor: "Overlay Color",
            rOverNever: "Never",
            rOverSelected: "Selected",
            rOverAlways: "Always"
        },
        "ar-IQ": {
            name: "abdullah abbas Junction Angle",
            settingsTitle: "إعدادات زوايا التقاطع",
            uiLanguage: "لغة الواجهة",
            generalSettings: "الإعدادات العامة",
            enableScript: "تفعيل السكريبت",
            resetToDefault: "استعادة الافتراضي",
            override: "تحقق من تجاوز التعليمات",
            guess: "تقدير التوجيه",
            decimals: "المراتب العشرية",
            textSize: "حجم النص",
            circleSize: "حجم الدائرة",
            lineLength: "طول الخط",
            lineWidth: "سمك الخط",
            visualSettings: "إعدادات المظهر",
            colors: "إعدادات الألوان",
            turnInstructionColor: "لون الانعطاف",
            uTurnInstructionColor: "لون الاستدارة",
            exitInstructionColor: "لون الخروج",
            keepInstructionColor: "لون الالتزام",
            noTurnColor: "لون المنع",
            problemColor: "لون المشكلة",
            noInstructionColor: "لون بلا توجيه",
            continueInstructionColor: "لون المتابعة",
            roundaboutColor: "لون الدوار",
            roundaboutOverlayDisplay: "تظليل الدوار",
            roundaboutOverlayColor: "لون التظليل",
            rOverNever: "أبداً",
            rOverSelected: "عند التحديد",
            rOverAlways: "دائماً"
        },
        "ckb-IQ": {
            name: "abdullah abbas Junction Angle",
            settingsTitle: "ڕێکخستنەکانی گۆشەی یەکتربڕ",
            uiLanguage: "زمانی ڕووکار",
            generalSettings: "ڕێکخستنە گشتییەکان",
            enableScript: "چالاککردن",
            resetToDefault: "گەڕاندنەوە بۆ بنەڕەت",
            override: "پشکنینی تێپەڕاندن (Override)",
            guess: "خەمڵاندنی ڕێنماییەکان",
            decimals: "دەیی (Decimals)",
            textSize: "قەبارەی نووسین",
            circleSize: "قەبارەی بازنە",
            lineLength: "درێژی هێڵ",
            lineWidth: "ئەستووری هێڵ",
            visualSettings: "ڕێکخستنی شێوە",
            colors: "ڕەنگەکان",
            turnInstructionColor: "ڕەنگی پێچ",
            uTurnInstructionColor: "ڕەنگی پێچکردنەوە",
            exitInstructionColor: "ڕەنگی دەرچوون",
            keepInstructionColor: "ڕەنگی مانەوە",
            noTurnColor: "ڕەنگی قەدەغە",
            problemColor: "ڕەنگی کێشە",
            noInstructionColor: "بێ ڕێنمایی",
            continueInstructionColor: "ڕەنگی بەردەوام",
            roundaboutColor: "ڕەنگی بازنە",
            roundaboutOverlayDisplay: "نیشاندانی سێبەر",
            roundaboutOverlayColor: "ڕەنگی سێبەر",
            rOverNever: "هەرگیز",
            rOverSelected: "دیاریکراو",
            rOverAlways: "هەمیشە"
        }
    };

    function ja_t(key) {
        var lang = ja_getOption("uiLanguage");
        if (!ja_translations_db[lang]) lang = "en-US";
        return ja_translations_db[lang][key] || key;
    }

    // --- Settings Structure ---
    var ja_settings = {
        uiLanguage: { elementType: "select", elementId: "_jaSelUiLanguage", defaultValue: "en-US", options: ["en-US", "ar-IQ", "ckb-IQ"], group: "language"},
        enableScript: { elementType: "checkbox", elementId: "_jaCbEnableScript", defaultValue: true, group: "general" },
        guess: { elementType: "checkbox", elementId: "_jaCbGuessRouting", defaultValue: true, group: "general" },
        override: { elementType: "checkbox", elementId: "_jaCbOverride", defaultValue: true, group: "general" },
        textSize: { elementType: "range", elementId: "_jaTbTextSize", defaultValue: 12, min: 8, max: 30, group: "visual" },
        circleSize: { elementType: "range", elementId: "_jaTbCircleSize", defaultValue: 16, min: 10, max: 50, group: "visual" },
        lineLength: { elementType: "range", elementId: "_jaTbLineLength", defaultValue: 30, min: 15, max: 100, group: "visual" },
        lineWidth: { elementType: "range", elementId: "_jaTbLineWidth", defaultValue: 2, min: 1, max: 10, group: "visual" },
        decimals: { elementType: "number", elementId: "_jaTbDecimals", defaultValue: 2, min: 0, max: 2, group: "visual"},
        turnInstructionColor: { elementType: "color", elementId: "_jaTbTurnInstructionColor", defaultValue: "#00ff00", group: "colors"},
        uTurnInstructionColor: { elementType: "color", elementId: "_jaTbUTurnInstructionColor", defaultValue: "#0055ff", group: "colors"},
        exitInstructionColor: { elementType: "color", elementId: "_jaTbExitInstructionColor", defaultValue: "#00ffff", group: "colors"},
        keepInstructionColor: { elementType: "color", elementId: "_jaTbKeepInstructionColor", defaultValue: "#ffff00", group: "colors"},
        noTurnColor: { elementType: "color", elementId: "_jaTbNoTurnColor", defaultValue: "#ff0000", group: "colors"},
        problemColor: { elementType: "color", elementId: "_jaTbProblemColor", defaultValue: "#ff0099", group: "colors"},
        noInstructionColor: { elementType: "color", elementId: "_jaTbNoInstructionColor", defaultValue: "#aaaaaa", group: "colors"},
        continueInstructionColor: { elementType: "color", elementId: "_jaTbContinueInstructionColor", defaultValue: "#ffffff", group: "colors"},
        roundaboutColor: { elementType: "color", elementId: "_jaTbRoundaboutColor", defaultValue: "#4B0082", group: "colors"},
        roundaboutOverlayDisplay: { elementType: "select", elementId: "_jaSelRoundaboutOverlayDisplay", defaultValue: "rOverAlways", options: ["rOverNever","rOverSelected","rOverAlways"], group: "colors"},
        roundaboutOverlayColor: { elementType: "color", elementId: "_jaTbRoundaboutOverlayColor", defaultValue: "#2F4F4F", group: "colors"},
    };

    var ja_arrow = {
        get: function(at) {
            var arrows = ja_getOption("angleDisplayArrows");
            return arrows[at % arrows.length];
        },
        left: function() { return this.get(0); },
        right: function() { return this.get(1); },
        left_up: function() { return this.get(2); },
        right_up: function() { return this.get(3); },
        up: function() { return this.get(4); }
    };

    function getselfeat () {
        if (window.W.selectionManager.getSelectedWMEFeatures) {
            return window.W.selectionManager.getSelectedWMEFeatures();
        }
        return window.W.selectionManager.getSelectedFeatures();
    }

    function junctionangle_init() {
        window.W.selectionManager.events.register("selectionchanged", null, ja_calculate);
        window.W.model.segments.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.model.nodes.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.map.olMap.events.register("zoomend", null, ja_calculate);

        ja_load();
        setupHtml();

        if (window.W.map.getLayersBy("uniqueName","junction_angles").length === 0) {
            ja_mapLayer = new window.OpenLayers.Layer.Vector(ja_t("name"), {
                displayInLayerSwitcher: true,
                uniqueName: "junction_angles",
                shortcutKey: "S+j",
                accelerator: "toggle" + "JunctionAngleInfo",
                className: "junction-angles",
                styleMap: new window.OpenLayers.StyleMap(ja_style())
            });
            window.W.map.addLayer(ja_mapLayer);
        } else {
            ja_mapLayer = window.W.map.getLayersBy("uniqueName","junction_angles")[0];
        }

        try {
            if(typeof WazeWrap !== 'undefined' && WazeWrap.Interface) {
                WazeWrap.Interface.AddLayerCheckbox("display", ja_t("name"), ja_getOption("enableScript"), layerToggled);
            }
        } catch(e) { }

        layerToggled(ja_getOption("enableScript"));
        ja_apply();

        W.prefs.on('change:isImperial', function(){
            setupHtml();
            ja_apply();
        });
    }

    function setupHtml(){
        var existingTab = document.getElementById("sidepanel-ja");
        if(existingTab) existingTab.remove();

        var navTabs = document.getElementById('user-info') ? document.getElementById('user-info').getElementsByClassName('nav-tabs')[0] : null;
        if (navTabs) {
             var existingLinks = navTabs.querySelectorAll('li');
             existingLinks.forEach(function(li) {
                 if(li.innerHTML.includes('sidepanel-ja')) li.remove();
             });
        }

        var ja_settings_dom = document.createElement("div");
        var ja_settings_dom_panel = document.createElement("div");
        var ja_settings_dom_content = document.createElement("div");
        var ja_settings_header = document.createElement('h4');
        var style = document.createElement('style');
        var form = document.createElement('form');

        var mainWrapper = document.createElement('div');
        mainWrapper.className = "ja-main-wrapper";

        var langContainer = document.createElement('div');
        langContainer.className = "ja-section ja-lang-section";
        var midSection = document.createElement('div');
        midSection.className = "ja-mid-container";
        var generalCol = document.createElement('div');
        generalCol.className = "ja-mid-col";
        var visualCol = document.createElement('div');
        visualCol.className = "ja-mid-col";
        var colorContainer = document.createElement('div');
        colorContainer.className = "ja-section ja-colors-section";
        var colorGrid = document.createElement('div');
        colorGrid.className = "ja-colors-grid";
        var ja_reset_button = document.createElement('button');

        var userTabs = document.getElementById('user-info');
        var ja_info = document.createElement('ul');
        var ja_version_elem = document.createElement('li');
        var jatab = document.createElement('li');

        var currentLang = ja_getOption("uiLanguage");
        var isRTL = (currentLang === "ar-IQ" || currentLang === "ckb-IQ");
        form.dir = isRTL ? "rtl" : "ltr";

        ja_settings_dom_panel.className = "side-panel-section";
        ja_settings_dom_content.className = "tab-content";
        ja_settings_header.appendChild(document.createTextNode(ja_t("settingsTitle")));
        ja_settings_dom_content.appendChild(ja_settings_header);

        style.textContent = `
            #jaOptions { font-family: "Open Sans", sans-serif; font-size: 12px; }
            #jaOptions * { box-sizing: border-box; }

            .ja-main-wrapper {
                border: 2px solid #59899e;
                border-radius: 8px;
                padding: 10px;
                background-color: #ffffff;
                margin-bottom: 10px;
            }

            .ja-header {
                font-weight: bold; font-size: 13px; color: #59899e;
                border-bottom: 2px solid #59899e; margin-bottom: 8px;
                padding-bottom: 2px; width: 100%; display: block;
            }

            .ja-section { margin-bottom: 10px; }
            .ja-mid-container { display: flex; gap: 8px; margin-bottom: 10px; }
            .ja-mid-col { flex: 1; min-width: 0; background: #f9f9f9; padding: 6px; border-radius: 6px; border: 1px solid #eee; }

            .ja-colors-section { background: #fdfdfd; padding: 6px; border-radius: 6px; border: 1px solid #eee; }
            .ja-colors-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 8px; }

            .ja-control { display: flex; align-items: center; margin-bottom: 5px; min-height: 24px; }

            /* Unified Label Styling */
            .ja-control label {
                margin: 0; padding: 0 5px; font-weight: normal; flex-grow: 1;
                white-space: normal; line-height: 1.1; overflow: visible;
            }

            .ja-control input[type="checkbox"] { margin: 0; flex-shrink: 0; }
            .ja-control input[type="color"] { border: 1px solid #ccc; width: 22px; height: 22px; padding: 1px; border-radius: 3px; cursor: pointer; flex-shrink: 0; }
            .ja-control input[type="range"] { width: 100%; height: 5px; margin: 4px 0; }

            .ja-slider-row { display: flex; flex-direction: column; margin-bottom: 6px; border-bottom: 1px dashed #eee; padding-bottom: 3px; }
            .ja-slider-header { display: flex; justify-content: space-between; font-size: 11px; color: #555; }
            .ja-slider-val { font-weight: bold; color: #000; }

            .ja-lang-select { width: 100%; padding: 3px; border: 1px solid #ccc; border-radius: 4px; margin-top: 3px; }

            .junction-angles { pointer-events: none !important; }
        `;

        form.className = "attributes-form side-panel-section";
        form.id = "jaOptions";

        var genHeader = document.createElement('div');
        genHeader.className = "ja-header";
        genHeader.innerText = ja_t("generalSettings");
        generalCol.appendChild(genHeader);

        var visHeader = document.createElement('div');
        visHeader.className = "ja-header";
        visHeader.innerText = ja_t("visualSettings");
        visualCol.appendChild(visHeader);

        var colHeader = document.createElement('div');
        colHeader.className = "ja-header";
        colHeader.innerText = ja_t("colors");
        colorContainer.appendChild(colHeader);

        Object.getOwnPropertyNames(ja_settings).forEach(function (key) {
            var setting = ja_settings[key];
            var container;

            if (setting.group === "language") container = langContainer;
            else if (setting.group === "general") container = generalCol;
            else if (setting.group === "visual") container = visualCol;
            else if (setting.group === "colors") container = colorGrid;
            else container = generalCol;

            var wrapper = document.createElement('div');
            var label = document.createElement('label');
            label.setAttribute("for", setting.elementId);
            label.innerText = ja_t(key);

            var input;
            if (setting.elementType === 'select') {
                input = document.createElement('select');
                input.id = setting.elementId;
                input.className = "ja-lang-select";
                for(var i=0; i<setting.options.length; i++){
                    var opt = document.createElement('option');
                    opt.value = setting.options[i];
                    var txt = setting.options[i];
                    if (key === "uiLanguage") {
                         if(txt === "en-US") txt = "English (US)";
                         if(txt === "ar-IQ") txt = "العربية (العراق)";
                         if(txt === "ckb-IQ") txt = "کوردی (سۆرانی)";
                    } else {
                        txt = ja_t(txt);
                    }
                    opt.text = txt;
                    input.appendChild(opt);
                }
                input.onchange = function() { ja_onchange(this); };

                // Unified styling for all select inputs including language
                wrapper.className = "ja-control";
                wrapper.style.display = "flex";
                wrapper.style.flexDirection = "column";
                wrapper.style.alignItems = "stretch";
                label.style.textAlign = "start";
                label.style.marginBottom = "2px";
                if(setting.group === "language") {
                     label.style.fontWeight = "bold";
                     label.style.color = "#59899e"; // Optional: to make it look like a mini-header
                }
                wrapper.appendChild(label);
                wrapper.appendChild(input);

            } else if (setting.elementType === 'range') {
                wrapper.className = "ja-slider-row";
                var header = document.createElement('div');
                header.className = "ja-slider-header";
                var valSpan = document.createElement('span');
                valSpan.className = "ja-slider-val";
                valSpan.id = setting.elementId + "_val";
                valSpan.innerText = ja_getOption(key);

                header.appendChild(document.createTextNode(ja_t(key)));
                header.appendChild(valSpan);

                input = document.createElement('input');
                input.type = "range";
                input.id = setting.elementId;
                input.min = setting.min;
                input.max = setting.max;
                input.step = 1;
                input.oninput = function() {
                    document.getElementById(this.id + "_val").innerText = this.value;
                    ja_onchange(this);
                };

                wrapper.appendChild(header);
                wrapper.appendChild(input);

            } else if (setting.elementType === 'checkbox') {
                wrapper.className = "ja-control";
                input = document.createElement('input');
                input.type = "checkbox";
                input.id = setting.elementId;
                input.onchange = function() { ja_onchange(this); };
                wrapper.appendChild(input);
                wrapper.appendChild(label);

            } else if (setting.elementType === 'color') {
                wrapper.className = "ja-control";
                input = document.createElement('input');
                input.type = "color";
                input.id = setting.elementId;
                input.onchange = function() { ja_onchange(this); };
                wrapper.appendChild(label);
                wrapper.appendChild(input);

            } else {
                wrapper.className = "ja-control";
                input = document.createElement('input');
                input.type = setting.elementType;
                input.id = setting.elementId;
                if(setting.min) input.min = setting.min;
                if(setting.max) input.max = setting.max;
                input.onchange = function() { ja_onchange(this); };
                wrapper.appendChild(label);
                wrapper.appendChild(input);
            }

            container.appendChild(wrapper);
        });

        colorContainer.appendChild(colorGrid);
        mainWrapper.appendChild(langContainer);
        midSection.appendChild(generalCol);
        midSection.appendChild(visualCol);
        mainWrapper.appendChild(midSection);
        mainWrapper.appendChild(colorContainer);

        ja_reset_button.type = "button";
        ja_reset_button.className = "btn btn-default btn-block";
        ja_reset_button.style.marginTop = "8px";
        ja_reset_button.addEventListener("click", ja_reset, true);
        ja_reset_button.appendChild(document.createTextNode(ja_t("resetToDefault")));

        mainWrapper.appendChild(ja_reset_button);

        form.appendChild(mainWrapper);
        ja_settings_dom_content.appendChild(form);

        if (userTabs) {
            var tabContent = userTabs.getElementsByClassName('tab-content')[0];
            ja_settings_dom.id = "sidepanel-ja";
            ja_settings_dom.className = "tab-pane";
            ja_settings_dom_content.style.paddingTop = "0";
            ja_settings_dom.appendChild(style);
            ja_settings_dom_panel.appendChild(ja_settings_dom_content);
            ja_settings_dom.appendChild(ja_settings_dom_panel);

            ja_info.className = "list-unstyled -side-panel-section";
            ja_info.style.fontSize = "11px";
            ja_info.style.textAlign = "center";
            ja_version_elem.appendChild(document.createTextNode(ja_t("name") + ": v" + junctionangle_version));
            ja_info.appendChild(ja_version_elem);
            ja_settings_dom.appendChild(ja_info);

            if (tabContent) tabContent.appendChild(ja_settings_dom);

            jatab.innerHTML = '<a href="#sidepanel-ja" data-toggle="tab">abdullah abbas Junction Angle</a>';
            if(navTabs != null) { navTabs.appendChild(jatab); }
        }
    }

    function layerToggled(visible) {
        if(ja_mapLayer) ja_mapLayer.setVisibility(visible);
    }

    // --- Main Logic ---
    function ja_calculate_real() {
        if (typeof ja_mapLayer === 'undefined' || !ja_mapLayer.visibility) return;

        ja_mapLayer.destroyFeatures();
        try {
            var selection = getselfeat();
            if (!selection || selection.length === 0) return;

            var effective_selection = selection;
            var ja_nodes = [];
            effective_selection.forEach(function(element) {
                var obj = element._wmeObject ? element._wmeObject : (element.model ? element.model : element);
                if (obj && obj.type === "node") ja_nodes.push(obj.attributes.id);
                else if (obj && obj.type === "segment") {
                    if (obj.attributes.fromNodeID) ja_nodes.push(obj.attributes.fromNodeID);
                    if (obj.attributes.toNodeID) ja_nodes.push(obj.attributes.toNodeID);
                }
            });
            ja_nodes = [...new Set(ja_nodes)];

            ja_nodes.forEach(function(nodeId) {
                var node = getByID(window.W.model.nodes, nodeId);
                if(!node || !node.attributes) return;

                var angles = [];
                var ja_selected_segments_count = 0;
                var ja_selected_angles = [];

                if (node.attributes.segIDs.length <= 1) return;

                node.attributes.segIDs.forEach(function (nodeSegment, j) {
                    var s = window.W.model.segments.objects[nodeSegment];
                    if(!s) return;

                    var a = ja_getAngle(nodeId, s);
                    if(a === null) a = 0;

                    var isSelected = false;
                    effective_selection.forEach(function(f){
                        var f_obj = f._wmeObject ? f._wmeObject : (f.model ? f.model : f);
                        if(f_obj && f_obj.attributes && f_obj.attributes.id === nodeSegment) isSelected = true;
                    });

                    angles[j] = [a, nodeSegment, isSelected];
                    if (isSelected) ja_selected_segments_count++;
                });

                effective_selection.forEach(function (selectedSegment) {
                    var s_obj = selectedSegment._wmeObject ? selectedSegment._wmeObject : (selectedSegment.model ? selectedSegment.model : selectedSegment);
                    if (!s_obj || !s_obj.attributes) return;

                    var selectedSegmentId = s_obj.attributes.id;
                    if(node.attributes.segIDs.indexOf(selectedSegmentId) >= 0) {
                        for(var j=0; j < angles.length; j++) {
                            if(angles[j][1] === selectedSegmentId) {
                                ja_selected_angles.push(angles[j]);
                                break;
                            }
                        }
                    }
                });
                ja_selected_angles = [...new Set(ja_selected_angles.map(JSON.stringify))].map(JSON.parse);

                var point;
                var ja_label_distance = parseInt(ja_getOption("lineLength"));

                if(!node.getOLGeometry()) return;

                if (ja_selected_segments_count === 2 && ja_selected_angles.length === 2) {
                    var a = ja_angle_diff(ja_selected_angles[0][0], ja_selected_angles[1][0], false);
                    var ha = (parseFloat(ja_selected_angles[0][0]) + parseFloat(ja_selected_angles[1][0]))/2;
                    if((Math.abs(ja_selected_angles[0][0]) + Math.abs(ja_selected_angles[1][0])) > 180 &&
                    ((ja_selected_angles[0][0] < 0 && ja_selected_angles[1][0] > 0) ||
                        (ja_selected_angles[0][0] > 0 && ja_selected_angles[1][0] < 0))) {
                        ha += 180;
                    }

                    var ja_junction_type = ja_routing_type.TURN;
                    if(ja_getOption("guess")) {
                        ja_junction_type = ja_guess_routing_instruction(node, ja_selected_angles[0][1], ja_selected_angles[1][1], angles);
                    }
                    point = new window.OpenLayers.Geometry.Point(
                        node.getOLGeometry().x + (ja_label_distance * Math.cos((ha * Math.PI) / 180)),
                        node.getOLGeometry().y + (ja_label_distance * Math.sin((ha * Math.PI) / 180))
                    );
                    ja_draw_marker(point, node, ja_label_distance, a, ha, true, ja_junction_type);
                }
                else {
                    angles.sort(function (a, b) { return a[0] - b[0]; });
                    angles.forEach(function(angle, j) {
                        var a = (360 + (angles[(j + 1) % angles.length][0] - angle[0])) % 360;
                        var ha = (360 + ((a / 2) + angle[0])) % 360;
                        var a_in = angles.filter(function(a) { return !!a[2]; })[0];

                        if(ja_getOption("angleMode") === "aDeparture" && ja_selected_segments_count > 0 && a_in) {
                            if(a_in[1] === angle[1]) return;
                            ha = angle[0];
                            a = ja_angle_diff(a_in[0], angles[j][0], false);
                            point = new window.OpenLayers.Geometry.Point(
                                node.getOLGeometry().x + (ja_label_distance * 2 * Math.cos((ha * Math.PI) / 180)),
                                node.getOLGeometry().y + (ja_label_distance * 2 * Math.sin((ha * Math.PI) / 180))
                            );
                            ja_draw_marker(point, node, ja_label_distance, a, ha, true,
                                        ja_getOption("guess") ?
                                        ja_guess_routing_instruction(node, a_in[1], angle[1], angles) : ja_routing_type.TURN);

                        } else {
                            point = new window.OpenLayers.Geometry.Point(
                                node.getOLGeometry().x + (ja_label_distance * 1.25 * Math.cos((ha * Math.PI) / 180)),
                                node.getOLGeometry().y + (ja_label_distance * 1.25 * Math.sin((ha * Math.PI) / 180))
                            );
                            ja_draw_marker(point, node, ja_label_distance, a, ha);
                        }
                    });
                }
            });
        } catch(e) {
            console.error("JA Error:", e);
        }
    }

    function ja_guess_routing_instruction(node, s_in_a, s_out_a, angles) {
        var s_in_id = s_in_a, s_out_id = s_out_a, s_in = null, s_out = {}, angle;

        var s_in_obj_arr = window.$.grep(angles, function(element){ return element[1] === s_in_a; });
        var s_out_obj_arr = window.$.grep(angles, function(element){ return element[1] === s_out_a; });
        if(s_in_obj_arr.length === 0 || s_out_obj_arr.length === 0) return ja_routing_type.PROBLEM;

        node.attributes.segIDs.forEach(function(element) {
            if (element === s_in_id) s_in = getByID(node.model.segments,element);
            else {
                if(element === s_out_id) s_out[element] = getByID(node.model.segments,element);
            }
        });

        if (s_in === null) return ja_routing_type.PROBLEM;
        angle = ja_angle_diff(s_in_obj_arr[0][0], (s_out_obj_arr[0][0]), false);

        if(!ja_is_turn_allowed(s_in, node, s_out[s_out_id])) return ja_routing_type.NO_TURN;

        if (ja_getOption("override")){
            try {
                var turn = window.W.model.getTurnGraph().getTurnThroughNode(node, getByID(window.W.model.segments,s_in_id), getByID(window.W.model.segments,s_out_id));
                var opcode = turn.getTurnData().getInstructionOpcode();
                if(opcode === "NONE") return ja_routing_type.OverrideBC;
                if(opcode === "CONTINUE") return ja_routing_type.OverrideCONTINUE;
                if(opcode === "TURN_LEFT") return ja_routing_type.OverrideTURN_LEFT;
                if(opcode === "TURN_RIGHT") return ja_routing_type.OverrideTURN_RIGHT;
                if(opcode === "KEEP_LEFT") return ja_routing_type.OverrideKEEP_LEFT;
                if(opcode === "KEEP_RIGHT") return ja_routing_type.OverrideKEEP_RIGHT;
                if(opcode === "EXIT_LEFT") return ja_routing_type.OverrideEXIT_LEFT;
                if(opcode === "EXIT_RIGHT") return ja_routing_type.OverrideEXIT_RIGHT;
                if(opcode === "UTURN") return ja_routing_type.OverrideU_TURN;
            } catch(e) {}
        }

        if (Math.abs(angle) > U_TURN_ANGLE + GRAY_ZONE) return ja_routing_type.U_TURN;
        if (Math.abs(angle) > U_TURN_ANGLE - GRAY_ZONE) return ja_routing_type.PROBLEM;
        if(node.attributes.segIDs.length <= 2) return ja_routing_type.BC;

        if(Math.abs(angle) < TURN_ANGLE - GRAY_ZONE) {
             if (!s_in.model.isLeftHand) {
                if (angles[0][1] === s_out_id) {
                    if (!ja_overlapping_angles(angles[0][0], angles[1][0])) return ja_routing_type.KEEP_LEFT;
                }
            } else {
                if (angles[angles.length - 1][1] === s_out_id) {
                    if (!ja_overlapping_angles(angles[angles.length - 1][0], angles[angles.length - 2][0])) return ja_routing_type.KEEP_RIGHT;
                }
            }
            return s_in.model.isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
        } else if (Math.abs(angle) < TURN_ANGLE + GRAY_ZONE) {
            return ja_routing_type.PROBLEM;
        } else {
            return ja_routing_type.TURN;
        }
    }

    function ja_draw_marker(point, node, ja_label_distance, a, ha, withRouting, ja_junction_type) {
        var angleString = ja_round(Math.abs(a)) + "°";
        if (ja_getOption("angleDisplay") === "displaySimple") {
            if(ja_junction_type === ja_routing_type.TURN) angleString = a > 0 ? ja_arrow.left() + angleString : angleString + ja_arrow.right();
        } else {
            if(ja_junction_type === ja_routing_type.TURN) angleString = (a > 0 ? ja_arrow.left() : ja_arrow.right()) + "\n" + angleString;
        }

        var anglePoint = withRouting ?
            new window.OpenLayers.Feature.Vector(point, { angle: angleString, ja_type: ja_junction_type }) :
            new window.OpenLayers.Feature.Vector(point, { angle: ja_round(a) + "°", ja_type: "generic" });

        var lineWidthVal = parseInt(ja_getOption("lineWidth")) || 2;

        ja_mapLayer.addFeatures([
            new window.OpenLayers.Feature.Vector(
                new window.OpenLayers.Geometry.LineString([node.getOLGeometry(), point]),
                {},
                {strokeOpacity: 0.6, strokeWidth: lineWidthVal, strokeDashstyle: "solid", strokeColor: "#ff9966"}
            )
        ]);
        ja_mapLayer.addFeatures([anglePoint]);
    }

    var pendingCalculation = false;
    function ja_calculate() {
        if(!pendingCalculation) {
            pendingCalculation = true;
            window.setTimeout(function(){
                window.requestAnimationFrame(function() {
                    ja_calculate_real();
                    pendingCalculation = false;
                });
            }, 50);
        }
    }

    function ja_angle_diff(aIn, aOut, absolute) {
        var a = parseFloat(aOut) - parseFloat(aIn);
        if(a > 180) a -= 360;
        if(a < -180) a+= 360;
        return absolute ? a : (a > 0 ? a - 180 : a + 180);
    }

    function getOLFeatureGeometryFromSegment(segment) {
        if(W.map.segmentLayer && W.map.segmentLayer.features) {
             const feature = W.map.segmentLayer.features.find((feat) => feat.attributes.wazeFeature && feat.attributes.wazeFeature.id === segment.attributes.id);
             if (feature) return feature.geometry;
        }
        if (segment.getGeometry) return segment.getGeometry();
        if (segment.geometry) return segment.geometry;
        if (segment.getOLGeometry) return segment.getOLGeometry();
        return null;
    }

    function ja_get_first_point(segment) {
        var g = getOLFeatureGeometryFromSegment(segment);
        return g ? g.components[0] : null;
    }

    function ja_get_second_point(segment) {
        var g = getOLFeatureGeometryFromSegment(segment);
        return g ? g.components[1] : null;
    }

    function ja_get_last_point(segment) {
        var g = getOLFeatureGeometryFromSegment(segment);
        return g ? g.components[g.components.length - 1] : null;
    }

    function ja_get_next_to_last_point(segment) {
        var g = getOLFeatureGeometryFromSegment(segment);
        return g ? g.components[g.components.length - 2] : null;
    }

    function ja_getAngle(ja_node, ja_segment) {
        if (ja_node == null || ja_segment == null) return null;
        var ja_dx, ja_dy;

        var pt1, pt2;

        if (ja_segment.attributes.fromNodeID === ja_node) {
            pt1 = ja_get_first_point(ja_segment);
            pt2 = ja_get_second_point(ja_segment);
        } else {
            pt1 = ja_get_last_point(ja_segment);
            pt2 = ja_get_next_to_last_point(ja_segment);
        }

        if (!pt1 || !pt2) return null;

        ja_dx = pt2.x - pt1.x;
        ja_dy = pt2.y - pt1.y;

        var ja_angle = Math.atan2(ja_dy, ja_dx);
        return ((ja_angle * 180 / Math.PI)) % 360;
    }

    function ja_overlapping_angles(a1, a2) {
        return Math.abs(ja_angle_diff(a1, a2, true)) < OVERLAPPING_ANGLE;
    }

    function ja_round(value) {
        var ja_rounding = -parseInt(ja_getOption("decimals"));
        if (typeof ja_rounding === 'undefined' || +ja_rounding === 0) return Math.round(value);
        value = +value;
        if (isNaN(value) || !(typeof ja_rounding === 'number' && ja_rounding % 1 === 0)) return NaN;
        var valueArray = value.toString().split('e');
        value = Math.round(+(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] - ja_rounding) : -ja_rounding)));
        valueArray = value.toString().split('e');
        return +(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] + ja_rounding) : ja_rounding));
    }

    function ja_getOption(name) {
        if (name === "angleMode") return "aDeparture";
        if (name === "angleDisplay") return "displayFancy";
        if (name === "angleDisplayArrows") return "⇐⇒⇖⇗⇑";

        if(!ja_options.hasOwnProperty(name) || typeof ja_options[name] === 'undefined') {
            ja_options[name] = ja_settings[name].defaultValue;
        }
        return ja_options[name];
    }

    function ja_setOption(name, val) {
        ja_options[name] = val;
        if(localStorage) {
            localStorage.setItem("wme_ja_abdullah_options_v14", JSON.stringify(ja_options));
        }
    }

    var ja_onchange = function(e) {
        var settingName = Object.getOwnPropertyNames(ja_settings).find(function(a) { return ja_settings[a].elementId === e.id; });
        var newVal = (ja_settings[settingName].elementType === "checkbox") ? e.checked : e.value;

        ja_setOption(settingName, newVal);

        if(settingName === "uiLanguage") {
            setupHtml();
            if(ja_mapLayer) ja_mapLayer.name = ja_t("name");
        }

        if(settingName === "enableScript") {
            layerToggled(newVal);
        }

        ja_apply();
    };

    var ja_load = function() {
        if(localStorage != null) {
            try {
                var stored = JSON.parse(localStorage.getItem("wme_ja_abdullah_options_v14"));
                if(stored) {
                    ja_options = stored;
                } else {
                    var old_stored = JSON.parse(localStorage.getItem("wme_ja_abdullah_options_v13")) || JSON.parse(localStorage.getItem("wme_ja_abdullah_options_v12"));
                    if(old_stored) {
                        ja_options = old_stored;
                        ja_options.roundaboutColor = "#4B0082";
                        ja_options.roundaboutOverlayColor = "#2F4F4F";
                    } else {
                        // Defaults
                        ja_options.turnInstructionColor = "#00ff00";
                        ja_options.uTurnInstructionColor = "#0055ff";
                        ja_options.exitInstructionColor = "#00ffff";
                        ja_options.keepInstructionColor = "#ffff00";
                        ja_options.noTurnColor = "#ff0000";
                        ja_options.problemColor = "#ff0099";
                        ja_options.continueInstructionColor = "#ffffff";
                        ja_options.noInstructionColor = "#aaaaaa";
                        ja_options.roundaboutOverlayColor = "#2F4F4F";
                        ja_options.roundaboutColor = "#4B0082";
                        ja_options.textSize = 12;
                        ja_options.circleSize = 16;
                        ja_options.lineLength = 30;
                        ja_options.lineWidth = 2;
                    }
                }
            } catch (e){}
        }
        if(!ja_options.uiLanguage) ja_options.uiLanguage = "en-US";
        if(!ja_options.textSize) ja_options.textSize = 12;
        if(!ja_options.circleSize) ja_options.circleSize = 16;
        if(!ja_options.lineLength) ja_options.lineLength = 30;
        if(!ja_options.lineWidth) ja_options.lineWidth = 2;
    };

    var ja_apply = function() {
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            var elem = document.getElementById(setting.elementId);
            if(elem) {
                if(setting.elementType === "checkbox") elem.checked = ja_getOption(a);
                else elem.value = ja_getOption(a);

                // Update slider value display if it exists
                var valDisp = document.getElementById(setting.elementId + "_val");
                if(valDisp) valDisp.innerText = ja_getOption(a);
            }
        });
        if(window.W.map.getLayersBy("uniqueName","junction_angles")[0]) {
            window.W.map.getLayersBy("uniqueName","junction_angles")[0].styleMap = ja_style();
        }
        ja_calculate_real();
    };

    var ja_reset = function() {
        localStorage.removeItem("wme_ja_abdullah_options_v14");
        ja_options = {};
        ja_load();
        setupHtml();
        ja_apply();
    };

    function ja_get_contrast_color(hex_color) {
        var r = parseInt(hex_color.substr(1, 2), 16);
        var g = parseInt(hex_color.substr(3, 2), 16);
        var b = parseInt(hex_color.substr(5, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    function ja_get_style_rule(routingType, fillColorOption) {
        var pSize = parseInt(ja_getOption("circleSize")) || 16;
        var tSize = parseInt(ja_getOption("textSize")) || 12;
        var decimals = parseInt(ja_getOption("decimals")) || 2;

        // Dynamic radius
        var dynamicRadius = pSize + (decimals > 0 ? 2 * decimals : 0);

        return new window.OpenLayers.Rule({
            filter: new window.OpenLayers.Filter.Comparison({
                type: window.OpenLayers.Filter.Comparison.EQUAL_TO, property: "ja_type", value: routingType
            }),
            symbolizer: {
                pointRadius: dynamicRadius,
                fontSize: tSize + "px",
                fillColor: ja_getOption(fillColorOption),
                strokeColor: "#183800",
                fontColor: ja_get_contrast_color(ja_getOption(fillColorOption))
            }
        });
    }

    function ja_style() {
        var pSize = parseInt(ja_getOption("circleSize")) || 16;
        var tSize = parseInt(ja_getOption("textSize")) || 12;

        return new window.OpenLayers.Style({
            fillColor: "#ffcc88", strokeColor: "#ff9966", strokeWidth: 2,
            label: "${angle}", fontWeight: "bold",
            pointRadius: pSize, fontSize: tSize + "px"
        }, {
            rules: [
                new window.OpenLayers.Rule({ symbolizer: {} }),
                ja_get_style_rule(ja_routing_type.TURN, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.TURN_LEFT, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.TURN_RIGHT, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.BC, "noInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP_LEFT, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP_RIGHT, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT_LEFT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT_RIGHT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.NO_TURN, "noTurnColor"),
                ja_get_style_rule(ja_routing_type.PROBLEM, "problemColor"),
                ja_get_style_rule(ja_routing_type.ROUNDABOUT, "roundaboutColor"),
                ja_get_style_rule(ja_routing_type.ROUNDABOUT_EXIT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.U_TURN, "uTurnInstructionColor"),
                ja_get_style_rule(ja_routing_type.NO_U_TURN, "problemColor")
            ]
        });
    }

    function ja_is_turn_allowed(s_from, via_node, s_to) {
        return via_node.isTurnAllowedBySegDirections(s_from, s_to) && s_from.isTurnAllowed(s_to, via_node);
    }

    function ja_is_model_ready() {
        return (typeof window.W !== 'undefined' && typeof window.W.map !== 'undefined' &&
                typeof window.W.map.olMap.events.register !== 'undefined' &&
                typeof window.W.selectionManager.events.register !== 'undefined');
    }

    function getByID(obj, id){
        if (typeof(obj.getObjectById) == "function") return obj.getObjectById(id);
        else if (typeof(obj.getObjectById) == "undefined") return obj.get(id);
    }

    function ja_bootstrap(retries) {
        retries = retries || 0;
        if (retries >= 20) return;
        try {
            if (ja_is_model_ready() && window.W.loginManager.isLoggedIn()) {
                setTimeout(junctionangle_init, 100);
            } else {
                setTimeout(function () { ja_bootstrap(++retries); }, 250);
            }
        } catch (err) {
            setTimeout(function () { ja_bootstrap(++retries); }, 250);
        }
    }

    ja_bootstrap();
}

let run_ja_script = GM_addElement('script', {
    textContent: "" + run_ja.toString() + " \n" + "run_ja();"
});