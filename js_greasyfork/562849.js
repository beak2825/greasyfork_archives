// ==UserScript==
// @name          abdullah abbas Junction Angle
// @description   Show the angle between two selected segments with multi-language support (Ar-IQ, Kur-Sorani, En-US)
// @match         https://beta.waze.com/*editor*
// @match         https://www.waze.com/*editor*
// @exclude       https://www.waze.com/*user/*editor/*
// @version       2026.01.17.07
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

    var junctionangle_version = "2026.01.17.07";
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
            enableScript: "Enable",
            resetToDefault: "Reset to default",
            defaultOn: "Show layer by default",
            override: "Check \"override instruction\"",
            overrideAngles: "Show angles of \"override\"",
            guess: "Estimate routing instructions",
            roundaboutnav: "WIKI: Roundabouts",
            ghissues: "Report an Issue",
            noInstructionColor: "Best Continuation",
            continueInstructionColor: "Continue",
            keepInstructionColor: "Keep",
            exitInstructionColor: "Exit",
            turnInstructionColor: "Turn",
            uTurnInstructionColor: "U-Turn",
            noTurnColor: "Disallowed",
            problemColor: "Avoid",
            roundaboutColor: "Roundabout",
            roundaboutOverlayColor: "Overlay",
            roundaboutOverlayDisplay: "Show Roundabout Overlay",
            rOverNever: "Never",
            rOverSelected: "Selected",
            rOverAlways: "Always",
            decimals: "Decimals",
            pointSize: "Point Size"
        },
        "ar-IQ": {
            name: "abdullah abbas Junction Angle",
            settingsTitle: "إعدادات زوايا التقاطع",
            uiLanguage: "لغة الواجهة",
            enableScript: "تفعيل",
            resetToDefault: "استعادة الافتراضي",
            defaultOn: "إظهار الطبقة افتراضياً",
            override: "تحقق من تجاوز التعليمات",
            overrideAngles: "إظهار زوايا التجاوز",
            guess: "تقدير التوجيه",
            roundaboutnav: "ويكي: الدوارات",
            ghissues: "الإبلاغ عن مشكلة",
            noInstructionColor: "أفضل استمرار",
            continueInstructionColor: "تابع",
            keepInstructionColor: "التزم",
            exitInstructionColor: "مخرج",
            turnInstructionColor: "انعطاف",
            uTurnInstructionColor: "استدارة",
            noTurnColor: "ممنوع",
            problemColor: "تجنب",
            roundaboutColor: "الدوار",
            roundaboutOverlayColor: "تظليل",
            roundaboutOverlayDisplay: "إظهار تظليل الدوار",
            rOverNever: "أبداً",
            rOverSelected: "عند التحديد",
            rOverAlways: "دائماً",
            decimals: "المراتب العشرية",
            pointSize: "حجم الخط"
        },
        "ckb-IQ": {
            name: "abdullah abbas Junction Angle",
            settingsTitle: "ڕێکخستنەکانی گۆشەی یەکتربڕ",
            uiLanguage: "زمانی ڕووکار",
            enableScript: "چالاککردن",
            resetToDefault: "گەڕاندنەوە بۆ بنەڕەت",
            defaultOn: "نیشاندانی لایەر لە سەرەتا",
            override: "پشکنینی تێپەڕاندن (Override)",
            overrideAngles: "نیشاندانی گۆشەکانی تێپەڕاندن",
            guess: "خەمڵاندنی ڕێنماییەکانی ڕێگا",
            roundaboutnav: "ویکی: بازنە (Fellke)",
            ghissues: "تۆمارکردنی کێشە",
            noInstructionColor: "باشترین بەردەوامی",
            continueInstructionColor: "بەردەوام",
            keepInstructionColor: "مانەوە",
            exitInstructionColor: "دەرچوون",
            turnInstructionColor: "پێچ",
            uTurnInstructionColor: "پێچکردنەوە",
            noTurnColor: "قەدەغە",
            problemColor: "خراپ/تێكچوو",
            roundaboutColor: "بازنە (Fellke)",
            roundaboutOverlayColor: "سێبەر",
            roundaboutOverlayDisplay: "نیشاندانی سێبەر",
            rOverNever: "هەرگیز",
            rOverSelected: "دیاریکراو",
            rOverAlways: "هەمیشە",
            decimals: "دەیی (Decimals)",
            pointSize: "قەبارەی هێڵ"
        }
    };

    function ja_t(key) {
        var lang = ja_getOption("uiLanguage");
        if (!ja_translations_db[lang]) lang = "en-US";
        return ja_translations_db[lang][key] || key;
    }

    // --- Settings Structure ---
    var ja_settings = {
        uiLanguage: { elementType: "select", elementId: "_jaSelUiLanguage", defaultValue: "en-US", options: ["en-US", "ar-IQ", "ckb-IQ"]},
        enableScript: { elementType: "checkbox", elementId: "_jaCbEnableScript", defaultValue: true },
        defaultOn: { elementType: "checkbox", elementId: "_jaCbShowLayer", defaultValue: true },
        override: { elementType: "checkbox", elementId: "_jaCbOverride", defaultValue: true, group: "guess" },
        overrideAngles: { elementType: "checkbox", elementId: "_jaCboverrideAngles", defaultValue: false, group: "override" },
        guess: { elementType: "checkbox", elementId: "_jaCbGuessRouting", defaultValue: true },
        // Colors
        noInstructionColor: { elementType: "color", elementId: "_jaTbNoInstructionColor", defaultValue: "#aaaaaa", group: "guess"},
        continueInstructionColor: { elementType: "color", elementId: "_jaTbContinueInstructionColor", defaultValue: "#ffffff", group: "guess"},
        keepInstructionColor: { elementType: "color", elementId: "_jaTbKeepInstructionColor", defaultValue: "#ffff00", group: "guess"},
        exitInstructionColor: { elementType: "color", elementId: "_jaTbExitInstructionColor", defaultValue: "#00ffff", group: "guess"},
        turnInstructionColor: { elementType: "color", elementId: "_jaTbTurnInstructionColor", defaultValue: "#00ff00", group: "guess"},
        uTurnInstructionColor: { elementType: "color", elementId: "_jaTbUTurnInstructionColor", defaultValue: "#0055ff", group: "guess"},
        noTurnColor: { elementType: "color", elementId: "_jaTbNoTurnColor", defaultValue: "#ff0000", group: "guess"},
        problemColor: { elementType: "color", elementId: "_jaTbProblemColor", defaultValue: "#ff0099", group: "guess"},
        roundaboutOverlayDisplay: { elementType: "select", elementId: "_jaSelRoundaboutOverlayDisplay", defaultValue: "rOverAlways", options: ["rOverNever","rOverSelected","rOverAlways"]},
        roundaboutOverlayColor: { elementType: "color", elementId: "_jaTbRoundaboutOverlayColor", defaultValue: "#2F4F4F", group: "roundaboutOverlayDisplay"},
        roundaboutColor: { elementType: "color", elementId: "_jaTbRoundaboutColor", defaultValue: "#4B0082", group: "roundaboutOverlayDisplay"},
        decimals: { elementType: "number", elementId: "_jaTbDecimals", defaultValue: 2, min: 0, max: 2},
        pointSize: { elementType: "number", elementId: "_jaTbPointSize", defaultValue: 12, min: 6, max: 20}
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
        // Events
        window.W.selectionManager.events.register("selectionchanged", null, ja_calculate);
        window.W.model.segments.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.model.nodes.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.map.olMap.events.register("zoomend", null, ja_calculate);

        ja_load();
        setupHtml();

        // Create Layer with pointer-events protection through CSS
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
        var section = document.createElement('div');
        var ja_reset_button = document.createElement('button');
        var userTabs = document.getElementById('user-info');
        var ja_info = document.createElement('ul');
        var ja_version_elem = document.createElement('li');
        var jatab = document.createElement('li');

        ja_settings_dom_panel.className = "side-panel-section";
        ja_settings_dom_content.className = "tab-content";
        ja_settings_header.appendChild(document.createTextNode(ja_t("settingsTitle")));
        ja_settings_dom_content.appendChild(ja_settings_header);

        // CSS FIX: pointer-events: none ensures clicks pass through the layer to the map
        style.textContent = `
            #jaOptions > *:first-child { margin-top: 1em; }
            #jaOptions * { vertical-align: middle; }
            #jaOptions label { display: inline; margin-left: 5px; margin-right: 5px; }
            #jaOptions .controls-container { margin-bottom: 8px; }
            #jaOptions input, select { display: inline; margin-right: 7px; box-sizing: border-box; border: 1px solid #cccccc; border-radius: 5px; padding: 3px; }
            #jaOptions input[type="number"] { width: 4em; padding: 6px; }
            #jaOptions input[type="color"] { width: 30px; height: 30px; padding: 2px; border: none; cursor: pointer; }
            /* Critical fix for selection issues */
            .junction-angles, .junction-angles svg, .junction-angles div { pointer-events: none !important; }
        `;

        section.className = "form-group";
        form.className = "attributes-form side-panel-section";
        section.id = "jaOptions";

        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            var ja_controls_container = document.createElement('div');
            var ja_input = document.createElement('input');
            var ja_label = document.createElement('label');

            if (a === "defaultOn") return;

            ja_controls_container.className = "controls-container";
            ja_input.type = setting.elementType;

            if (setting.elementType === 'select') {
                ja_input = document.createElement('select');
                ja_input.id = setting.elementId;
                for(var i = 0; i < setting.options.length; i++) {
                    var ja_select_option = document.createElement('option');
                    ja_select_option.value = setting.options[i];
                    var labelText = setting.options[i];
                    if (a === "uiLanguage") {
                        if(labelText === "en-US") labelText = "English (US)";
                        if(labelText === "ar-IQ") labelText = "العربية (العراق)";
                        if(labelText === "ckb-IQ") labelText = "کوردی (سۆرانی)";
                    } else {
                        labelText = ja_t(setting.options[i]);
                    }
                    ja_select_option.appendChild(document.createTextNode(labelText));
                    ja_input.appendChild(ja_select_option);
                }
            } else {
                ja_input.id = setting.elementId;
                if(setting.elementType === 'number') {
                    ja_input.setAttribute("min", setting.min);
                    ja_input.setAttribute("max", setting.max);
                }
            }

            ja_controls_container.appendChild(ja_input);
            ja_input.onchange = function() { ja_onchange(this); };
            ja_label.setAttribute("for", setting.elementId);
            ja_label.appendChild(document.createTextNode(ja_t(a)));
            ja_controls_container.appendChild(ja_label);
            section.appendChild(ja_controls_container);
        });

        ja_reset_button.type = "button";
        ja_reset_button.className = "btn btn-default";
        ja_reset_button.addEventListener("click", ja_reset, true);
        ja_reset_button.appendChild(document.createTextNode(ja_t("resetToDefault")));
        section.appendChild(document.createElement('div'));
        section.appendChild(ja_reset_button);
        form.appendChild(section);
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

        // SAFEGUARD: Always clean first
        ja_mapLayer.destroyFeatures();
        // Removed setZIndex(9999) to prevent blocking WME layers

        // SAFEGUARD: Try-catch block to prevent breaking WME selection
        try {
            var selection = getselfeat();

            // If nothing selected, exit cleanly
            if (!selection || selection.length === 0) {
                return;
            }

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
                var ja_label_distance = 25 * (1 + (0.2 * parseInt(ja_getOption("decimals"))));

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

        ja_mapLayer.addFeatures([
            new window.OpenLayers.Feature.Vector(
                new window.OpenLayers.Geometry.LineString([node.getOLGeometry(), point]),
                {},
                {strokeOpacity: 0.6, strokeWidth: 1.2, strokeDashstyle: "solid", strokeColor: "#ff9966"}
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
                    }
                }
            } catch (e){}
        }
        if(!ja_options.uiLanguage) ja_options.uiLanguage = "en-US";
    };

    var ja_apply = function() {
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            var elem = document.getElementById(setting.elementId);
            if(elem) {
                if(setting.elementType === "checkbox") elem.checked = ja_getOption(a);
                else elem.value = ja_getOption(a);
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
        return new window.OpenLayers.Rule({
            filter: new window.OpenLayers.Filter.Comparison({
                type: window.OpenLayers.Filter.Comparison.EQUAL_TO, property: "ja_type", value: routingType
            }),
            symbolizer: {
                pointRadius: 3 + parseInt(ja_getOption("pointSize"), 10) + (parseInt(ja_getOption("decimals")) > 0 ? 4 * parseInt(ja_getOption("decimals")) : 0),
                fontSize: (parseInt(ja_getOption("pointSize")) - 1) + "px",
                fillColor: ja_getOption(fillColorOption),
                strokeColor: "#183800",
                fontColor: ja_get_contrast_color(ja_getOption(fillColorOption))
            }
        });
    }

    function ja_style() {
        return new window.OpenLayers.Style({
            fillColor: "#ffcc88", strokeColor: "#ff9966", strokeWidth: 2,
            label: "${angle}", fontWeight: "bold",
            pointRadius: parseInt(ja_getOption("pointSize"), 10), fontSize: "10px"
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