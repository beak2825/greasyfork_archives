// ==UserScript==
// @name          Abdullah Abbas WME Toolkit
// @description   Combined Toolkit: Angle Info + Advanced WME Scanner (Robust Fix)
// @match         https://beta.waze.com/*editor*
// @match         https://www.waze.com/*editor*
// @exclude       https://www.waze.com/*user/*editor/*
// @version       2026.01.19.08
// @author        Abdullah Abbas
// @grant         GM_addElement
// @namespace     https://greasyfork.org/scripts/35547-wme-junction-angle-info/
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license       CC-BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/563158/Abdullah%20Abbas%20WME%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/563158/Abdullah%20Abbas%20WME%20Toolkit.meta.js
// ==/UserScript==

function run_combined_toolkit() {
    "use strict";

    var toolkit_version = "2026.01.19.08";
    var ja_options = {};
    var ja_mapLayer;

    // ==========================================
    // PART 1: CONSTANTS & TRANSLATIONS
    // ==========================================
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

    var ja_translations_db = {
        "en-US": {
            dir: "ltr",
            name: "Abdullah Abbas WME Toolkit",
            settingsTitle: "Toolkit Settings",
            uiLanguage: "Interface Language",
            displayMode: "Display Mode",
            modeAngles: "Angles",
            modeInstructions: "Modified Instructions",
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
            rOverAlways: "Always",
            inst_junction_turn_left: "Turn Left",
            inst_junction_turn_right: "Turn Right",
            inst_junction_keep_left: "Keep Left",
            inst_junction_keep_right: "Keep Right",
            inst_junction_exit_left: "Exit Left",
            inst_junction_exit_right: "Exit Right",
            inst_junction_u_turn: "U-Turn",
            inst_junction_continue: "Continue",
            inst_junction_roundabout: "Roundabout",
            inst_junction_none: "None",
            inst_junction_problem: "Problem",
            inst_junction_no_turn: "No Turn",
            inst_automatic: "Automatic",
            scannerTitle: "Map Scanner",
            scanBtn: "Start Scan 🔍",
            resetPosBtn: "Reset Window Position 📍",
            noResults: "Area is clean! No updates found.",
            clearedMsg: "Results cleared.",
            col_name: "Name / Place",
            col_date: "Date",
            col_user: "User",
            tabAll: "All",
            opt_places: "Places & Updates",
            opt_images: "New Images",
            opt_urs: "Update Requests (UR)",
            opt_mps: "Map Problems (MP) & Comments",
            btn_rescan: "Rescan 🔄",
            btn_clear: "Clear 🧹",
            cat_place_new: "New Places",
            cat_place_edit: "Edited Places",
            cat_place_img: "New Images",
            cat_ur: "Update Requests",
            cat_mp: "Map Problems",
            cat_mc: "Comments",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            ur_types: {6:"Incorrect Address", 7:"Speed Limit", 10:"General", 12:"Camera", 13:"Roundabout", 21:"Map Issue"}
        },
        "ar-IQ": {
            dir: "rtl",
            name: "Abdullah Abbas WME Toolkit",
            settingsTitle: "إعدادات الأدوات والماسح",
            uiLanguage: "لغة الواجهة",
            displayMode: "نمط العرض",
            modeAngles: "الزوايا الهندسية",
            modeInstructions: "توجيهات معدلة",
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
            rOverAlways: "دائماً",
            inst_junction_turn_left: "انعطف يساراً",
            inst_junction_turn_right: "انعطف يميناً",
            inst_junction_keep_left: "الزم اليسار",
            inst_junction_keep_right: "الزم اليمين",
            inst_junction_exit_left: "اخرج يساراً",
            inst_junction_exit_right: "اخرج يميناً",
            inst_junction_u_turn: "دوران إلى الخلف",
            inst_junction_continue: "متابعة",
            inst_junction_roundabout: "دوار",
            inst_junction_none: "لا شيء",
            inst_junction_problem: "مشكلة",
            inst_junction_no_turn: "ممنوع",
            inst_automatic: "تلقائي",
            scannerTitle: "الماسح الشامل",
            scanBtn: "ابدأ الفحص 🔍",
            resetPosBtn: "إعادة ضبط موقع النافذة 📍",
            noResults: "المنطقة نظيفة! لا توجد تحديثات.",
            clearedMsg: "تم مسح النتائج.",
            col_name: "الاسم / المكان",
            col_date: "التاريخ",
            col_user: "المستخدم",
            tabAll: "الكل",
            opt_places: "الأماكن والتحديثات",
            opt_images: "الصور الجديدة",
            opt_urs: "طلبات التحديث",
            opt_mps: "مشاكل الخريطة والتعليقات",
            btn_rescan: "إعادة فحص 🔄",
            btn_clear: "مسح 🧹",
            cat_place_new: "أماكن جديدة",
            cat_place_edit: "تعديل أماكن",
            cat_place_img: "صور جديدة",
            cat_ur: "طلبات تحديث",
            cat_mp: "مشاكل خريطة",
            cat_mc: "تعليقات",
            months: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
            ur_types: {6:"عنوان خاطئ", 7:"سرعة", 10:"عام", 12:"كاميرا", 13:"دوار", 21:"خريطة"}
        },
        "ckb-IQ": {
            dir: "rtl",
            name: "Abdullah Abbas WME Toolkit",
            settingsTitle: "ڕێکخستنەکانی Toolkit",
            uiLanguage: "زمانی ڕووکار",
            displayMode: "شێوازی پیشاندان",
            modeAngles: "گۆشەکان",
            modeInstructions: "ڕێنمایی دەستکاریکراو",
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
            rOverAlways: "هەمیشە",
            inst_junction_turn_left: "لای چەپ",
            inst_junction_turn_right: "لای ڕاست",
            inst_junction_keep_left: "بچۆرە چەپ",
            inst_junction_keep_right: "بچۆرە ڕاست",
            inst_junction_exit_left: "دەرچونی چەپ",
            inst_junction_exit_right: "دەرچونی ڕاست",
            inst_junction_u_turn: "پێچکردنەوە",
            inst_junction_continue: "بەردەوام بە",
            inst_junction_roundabout: "بازنە",
            inst_junction_none: "نییە",
            inst_junction_problem: "کێشە",
            inst_junction_no_turn: "قەدەغە",
            inst_automatic: "خۆکار",
            scannerTitle: "پشکنەری نەخشە",
            scanBtn: "دەستپێکردنی پشکنین 🔍",
            resetPosBtn: "ڕێکخستنەوەی پەنجەرە 📍",
            noResults: "ناوچەکە پاکە! هیچ ئەنجامێک نەدۆزرایەوە.",
            clearedMsg: "ئەنجامەکان سڕانەوە.",
            col_name: "ناو / شوێن",
            col_date: "بەروار",
            col_user: "بەکارهێنەر",
            tabAll: "هەموو",
            opt_places: "شوێنەکان و نوێکارییەکان",
            opt_images: "وێنە نوێیەکان",
            opt_urs: "داواکاری نوێکردنەوە",
            opt_mps: "کێشەکانی نەخشە و بۆچوونەکان",
            btn_rescan: "پشکنینەوە 🔄",
            btn_clear: "سڕینەوە 🧹",
            cat_place_new: "شوێنی نوێ",
            cat_place_edit: "دەستکاری شوێن",
            cat_place_img: "وێنەی نوێ",
            cat_ur: "داواکاری نوێکردنەوە",
            cat_mp: "کێشەی نەخشە",
            cat_mc: "بۆچوونەکان",
            months: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەممووز", "ئاب", "ئەیلول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"],
            ur_types: {6:"ناونیشانی هەڵە", 7:"خێرایی", 10:"گشتی", 12:"کامێرا", 13:"بازنە", 21:"نەخشە"}
        }
    };

    function ja_t(key) {
        var lang = ja_getOption("uiLanguage");
        if (!ja_translations_db[lang]) lang = "en-US";
        return ja_translations_db[lang][key] || key;
    }

    var ja_settings = {
        uiLanguage: { elementType: "select", elementId: "_jaSelUiLanguage", defaultValue: "en-US", options: ["en-US", "ar-IQ", "ckb-IQ"], group: "language"},
        displayMode: { elementType: "select", elementId: "_jaSelDisplayMode", defaultValue: "modeAngles", options: ["modeAngles", "modeInstructions"], group: "general"},
        enableScript: { elementType: "checkbox", elementId: "_jaCbEnableScript", defaultValue: true, group: "general" },
        guess: { elementType: "checkbox", elementId: "_jaCbGuessRouting", defaultValue: true, group: "general" },
        override: { elementType: "checkbox", elementId: "_jaCbOverride", defaultValue: true, group: "general" },
        textSize: { elementType: "range", elementId: "_jaTbTextSize", defaultValue: 12, min: 8, max: 30, group: "visual" },
        circleSize: { elementType: "range", elementId: "_jaTbCircleSize", defaultValue: 16, min: 10, max: 60, group: "visual" },
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

    // ==========================================
    // PART 2: SCANNER SHARED VARS
    // ==========================================
    const ICONS = { new: "✨", edit: "✏️", img: "🖼️", ur: "📩", mp: "🤖", mc: "💬", home: "🏠" };
    const TAB_ORDER = ["cat_place_new", "cat_place_edit", "cat_place_img", "cat_ur", "cat_mp", "cat_mc"];
    let scanOptions = JSON.parse(localStorage.getItem("aa_scan_options")) || { places: true, images: true, urs: true, mps: true };

    function getselfeat () {
        if (window.W.selectionManager.getSelectedWMEFeatures) return window.W.selectionManager.getSelectedWMEFeatures();
        return window.W.selectionManager.getSelectedFeatures();
    }

    function junctionangle_init() {
        // Double check layer existence
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

        window.W.selectionManager.events.register("selectionchanged", null, ja_calculate);
        window.W.model.segments.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.model.nodes.on({ "objectschanged": ja_calculate, "objectsremoved": ja_calculate });
        window.W.map.olMap.events.register("zoomend", null, ja_calculate);

        ja_load();
        setupHtml();

        try {
            if(typeof WazeWrap !== 'undefined' && WazeWrap.Interface) {
                WazeWrap.Interface.AddLayerCheckbox("display", ja_t("name"), ja_getOption("enableScript"), layerToggled);
            }
        } catch(e) { }

        layerToggled(ja_getOption("enableScript"));
        ja_apply();

        W.prefs.on('change:isImperial', function(){ setupHtml(); ja_apply(); });
    }

    // --- ACCORDION HELPER ---
    function createAccordion(title, content, isOpen = false) {
        var wrapper = document.createElement('div');
        wrapper.className = "ja-accordion-wrapper";

        var btn = document.createElement('button');
        btn.type = "button";
        btn.className = "ja-accordion-btn";
        // Title centered by CSS later
        btn.innerHTML = `<span>${title}</span><span class="ja-caret">${isOpen ? '▼' : '►'}</span>`;

        var panel = document.createElement('div');
        panel.className = "ja-accordion-panel";
        panel.style.display = isOpen ? "block" : "none";
        panel.appendChild(content);

        btn.onclick = function() {
            var p = this.nextElementSibling;
            if (p.style.display === "block") {
                p.style.display = "none";
                this.querySelector('.ja-caret').innerText = '►';
            } else {
                p.style.display = "block";
                this.querySelector('.ja-caret').innerText = '▼';
            }
        };

        wrapper.appendChild(btn);
        wrapper.appendChild(panel);
        return wrapper;
    }

    function setupHtml(){
        var navTabs = document.getElementById('user-info') ? document.getElementById('user-info').getElementsByClassName('nav-tabs')[0] : null;
        var tabContent = document.getElementById('user-info') ? document.getElementById('user-info').getElementsByClassName('tab-content')[0] : null;

        // Safety check if DOM is not ready
        if (!navTabs || !tabContent) return;

        // Cleanup old elements
        var existingTab = document.getElementById("sidepanel-ja");
        if(existingTab) existingTab.remove();

        var existingLinks = navTabs.querySelectorAll('li');
        existingLinks.forEach(function(li) {
            if(li.innerHTML.includes('sidepanel-ja') || li.innerHTML.includes('Abdullah Abbas WME Toolkit')) li.remove();
        });

        var ja_settings_dom = document.createElement("div");
        var ja_settings_dom_panel = document.createElement("div");
        var ja_settings_dom_content = document.createElement("div");
        var ja_settings_header = document.createElement('h4');
        var style = document.createElement('style');
        var form = document.createElement('form');

        var currentLangKey = ja_getOption("uiLanguage");
        var isRTL = (currentLangKey === "ar-IQ" || currentLangKey === "ckb-IQ");
        form.dir = isRTL ? "rtl" : "ltr";

        ja_settings_dom_panel.className = "side-panel-section";
        ja_settings_dom_content.className = "tab-content";

        // Main Title (Centered)
        ja_settings_header.innerText = ja_t("settingsTitle");
        ja_settings_header.style.textAlign = "center";
        ja_settings_header.style.color = "#59899e";
        ja_settings_header.style.fontWeight = "bold";
        ja_settings_header.style.borderBottom = "1px solid #ddd";
        ja_settings_header.style.paddingBottom = "5px";
        ja_settings_header.style.marginBottom = "10px";

        ja_settings_dom_content.appendChild(ja_settings_header);

        style.textContent = `
            #jaOptions { font-family: "Open Sans", sans-serif; font-size: 12px; }
            #jaOptions * { box-sizing: border-box; }
            .ja-accordion-wrapper { border: 1px solid #ddd; margin-bottom: 5px; border-radius: 4px; overflow: hidden; }
            .ja-accordion-btn {
                background-color: #f1f1f1; color: #444; cursor: pointer; padding: 10px; width: 100%;
                border: none; text-align: center; outline: none; font-size: 12px; font-weight: bold;
                transition: 0.4s; display: flex; justify-content: center; align-items: center; position: relative;
            }
            .ja-accordion-btn:hover { background-color: #ddd; }
            .ja-accordion-btn .ja-caret { position: absolute; ${isRTL ? 'left: 10px;' : 'right: 10px;'} font-size: 10px; }
            .ja-accordion-panel { padding: 10px; background-color: white; display: none; overflow: hidden; }

            .ja-control { display: flex; align-items: center; margin-bottom: 5px; min-height: 24px; }
            .ja-control label { margin: 0; padding: 0 5px; font-weight: normal; flex-grow: 1; line-height: 1.1; }
            .ja-control input[type="checkbox"] { margin: 0; flex-shrink: 0; }
            .ja-control input[type="color"] { border: 1px solid #ccc; width: 22px; height: 22px; padding: 1px; border-radius: 3px; cursor: pointer; }
            .ja-control input[type="range"] { width: 100%; height: 5px; margin: 4px 0; }
            .ja-slider-row { display: flex; flex-direction: column; margin-bottom: 6px; border-bottom: 1px dashed #eee; padding-bottom: 3px; }
            .ja-slider-header { display: flex; justify-content: space-between; font-size: 11px; color: #555; }
            .ja-slider-val { font-weight: bold; color: #000; }
            .ja-lang-select { width: 100%; padding: 3px; border: 1px solid #ccc; border-radius: 4px; margin-top: 3px; }
            .junction-angles { pointer-events: none !important; }
            .ja-colors-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 8px; }
        `;

        form.className = "attributes-form side-panel-section";
        form.id = "jaOptions";

        // Containers for sections
        var langContent = document.createElement('div');
        var generalContent = document.createElement('div');
        var visualContent = document.createElement('div');
        var colorContent = document.createElement('div');
        var scannerContent = document.createElement('div');

        colorContent.className = "ja-colors-grid";

        // Fill settings
        Object.getOwnPropertyNames(ja_settings).forEach(function (key) {
            var setting = ja_settings[key];
            var container;

            if (setting.group === "language") container = langContent;
            else if (setting.group === "general") container = generalContent;
            else if (setting.group === "visual") container = visualContent;
            else if (setting.group === "colors") container = colorContent;
            else container = generalContent;

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
                    } else if (key === "displayMode") txt = ja_t(txt);
                    else txt = ja_t(txt);
                    opt.text = txt;
                    input.appendChild(opt);
                }
                input.onchange = function() { ja_onchange(this); };
                wrapper.className = "ja-control";
                wrapper.style.display = "flex";
                wrapper.style.flexDirection = "column";
                wrapper.style.alignItems = "stretch";
                label.style.textAlign = "start";
                label.style.marginBottom = "2px";
                if(setting.group === "language") {
                     label.style.fontWeight = "bold";
                     label.style.color = "#59899e";
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
                input.onchange = function() { ja_onchange(this); };
                wrapper.appendChild(label);
                wrapper.appendChild(input);
            }
            container.appendChild(wrapper);
        });

        // Add Reset Button to General Content (at bottom)
        var ja_reset_button = document.createElement('button');
        ja_reset_button.type = "button";
        ja_reset_button.className = "btn btn-default btn-block";
        ja_reset_button.style.marginTop = "8px";
        ja_reset_button.style.fontSize = "11px";
        ja_reset_button.addEventListener("click", ja_reset, true);
        ja_reset_button.appendChild(document.createTextNode(ja_t("resetToDefault")));
        generalContent.appendChild(ja_reset_button);

        // --- SCANNER CONTENT ---
        scannerContent.appendChild(createScannerCheckbox(ja_t("opt_places"), "places"));
        scannerContent.appendChild(createScannerCheckbox(ja_t("opt_images"), "images"));
        scannerContent.appendChild(createScannerCheckbox(ja_t("opt_urs"), "urs"));
        scannerContent.appendChild(createScannerCheckbox(ja_t("opt_mps"), "mps"));

        var btnScan = document.createElement('button');
        btnScan.type = "button";
        btnScan.className = "btn btn-primary btn-block";
        btnScan.style.cssText = "background-color:#27ae60; font-size:14px; font-weight:bold; margin-top:10px;";
        btnScan.innerHTML = ja_t("scanBtn");
        btnScan.onclick = performScan;
        scannerContent.appendChild(btnScan);

        var btnResetScan = document.createElement('a');
        btnResetScan.href = "#";
        btnResetScan.innerText = ja_t("resetPosBtn");
        btnResetScan.style.cssText = "display:block; margin-top:10px; font-size:11px; color:#c0392b; text-decoration:underline; text-align: center;";
        btnResetScan.onclick = (e) => {
            e.preventDefault();
            resetWindowPosition();
        };
        scannerContent.appendChild(btnResetScan);

        // --- BUILD ACCORDIONS (Closed by default) ---
        form.appendChild(createAccordion(ja_t("uiLanguage"), langContent, false));
        form.appendChild(createAccordion(ja_t("generalSettings"), generalContent, false));
        form.appendChild(createAccordion(ja_t("visualSettings"), visualContent, false));
        form.appendChild(createAccordion(ja_t("colors"), colorContent, false));
        form.appendChild(createAccordion(ja_t("scannerTitle"), scannerContent, false));

        ja_settings_dom_content.appendChild(form);

        ja_settings_dom.id = "sidepanel-ja";
        ja_settings_dom.className = "tab-pane";
        ja_settings_dom_content.style.paddingTop = "0";
        ja_settings_dom.appendChild(style);
        ja_settings_dom_panel.appendChild(ja_settings_dom_content);
        ja_settings_dom.appendChild(ja_settings_dom_panel);

        var ja_info = document.createElement('ul');
        var ja_version_elem = document.createElement('li');
        ja_info.className = "list-unstyled -side-panel-section";
        ja_info.style.fontSize = "11px";
        ja_info.style.textAlign = "center";
        ja_version_elem.appendChild(document.createTextNode(ja_t("name") + ": v" + toolkit_version));
        ja_info.appendChild(ja_version_elem);
        ja_settings_dom.appendChild(ja_info);

        tabContent.appendChild(ja_settings_dom);

        var jatab = document.createElement('li');
        jatab.innerHTML = '<a href="#sidepanel-ja" data-toggle="tab">Abdullah Abbas WME Toolkit</a>';
        navTabs.appendChild(jatab);
    }

    // --- Scanner UI Helper ---
    function createScannerCheckbox(text, key) {
        let isRTL = ja_translations_db[ja_getOption("uiLanguage")] && ja_translations_db[ja_getOption("uiLanguage")].dir === "rtl";
        let container = document.createElement("div");
        container.style.cssText = `
            display: flex; align-items: center; justify-content: flex-start;
            margin-bottom: 8px; cursor: pointer; padding: 5px;
            background: #f9f9f9; border-radius: 4px; border: 1px solid #eee;
            transition: background 0.2s; direction: ${isRTL ? 'rtl' : 'ltr'};
        `;

        let checkbox = document.createElement("div");
        checkbox.style.cssText = `
            width: 16px; height: 16px; border: 2px solid #ccc; border-radius: 3px;
            display: flex; align-items: center; justify-content: center;
            ${isRTL ? "margin-left: 10px;" : "margin-right: 10px;"} flex-shrink: 0; background: #fff;
        `;

        let label = document.createElement("span");
        label.innerText = text;
        label.style.cssText = `font-size: 12px; color: #333; user-select: none; text-align: ${isRTL ? 'right' : 'left'}; flex: 1;`;

        const updateState = () => {
            if (scanOptions[key]) {
                checkbox.style.borderColor = "#27ae60";
                checkbox.style.backgroundColor = "#27ae60";
                checkbox.innerHTML = '<span style="color:white; font-size:12px; font-weight:bold;">✓</span>';
                container.style.backgroundColor = "#e8f8f5";
            } else {
                checkbox.style.borderColor = "#ccc";
                checkbox.style.backgroundColor = "#fff";
                checkbox.innerHTML = '';
                container.style.backgroundColor = "#f9f9f9";
            }
        };

        container.onclick = () => {
            scanOptions[key] = !scanOptions[key];
            localStorage.setItem("aa_scan_options", JSON.stringify(scanOptions));
            updateState();
        };

        updateState();
        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    function layerToggled(visible) {
        if(ja_mapLayer) ja_mapLayer.setVisibility(visible);
    }

    // --- Main Toolkit Logic ---
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
                            ja_draw_marker(point, node, ja_label_distance, a, ha, false, ja_routing_type.BC);
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
            return (angle < 0) ? ja_routing_type.TURN_RIGHT : ja_routing_type.TURN_LEFT;
        }
    }

    function ja_get_instruction_text(type) {
        if(!type) return "";
        var keyMap = {};

        keyMap[ja_routing_type.BC] = "inst_junction_none";
        keyMap[ja_routing_type.KEEP] = "inst_automatic";
        keyMap[ja_routing_type.KEEP_LEFT] = "inst_automatic";
        keyMap[ja_routing_type.KEEP_RIGHT] = "inst_automatic";
        keyMap[ja_routing_type.TURN] = "inst_automatic";
        keyMap[ja_routing_type.TURN_LEFT] = "inst_automatic";
        keyMap[ja_routing_type.TURN_RIGHT] = "inst_automatic";
        keyMap[ja_routing_type.EXIT] = "inst_automatic";
        keyMap[ja_routing_type.EXIT_LEFT] = "inst_automatic";
        keyMap[ja_routing_type.EXIT_RIGHT] = "inst_automatic";
        keyMap[ja_routing_type.U_TURN] = "inst_automatic";

        keyMap[ja_routing_type.PROBLEM] = "inst_junction_problem";
        keyMap[ja_routing_type.NO_TURN] = "inst_junction_no_turn";
        keyMap[ja_routing_type.ROUNDABOUT] = "inst_junction_roundabout";

        keyMap[ja_routing_type.OverrideBC] = "inst_junction_none";
        keyMap[ja_routing_type.OverrideCONTINUE] = "inst_junction_continue";
        keyMap[ja_routing_type.OverrideKEEP_LEFT] = "inst_junction_keep_left";
        keyMap[ja_routing_type.OverrideKEEP_RIGHT] = "inst_junction_keep_right";
        keyMap[ja_routing_type.OverrideTURN_LEFT] = "inst_junction_turn_left";
        keyMap[ja_routing_type.OverrideTURN_RIGHT] = "inst_junction_turn_right";
        keyMap[ja_routing_type.OverrideEXIT] = "inst_junction_exit_right";
        keyMap[ja_routing_type.OverrideEXIT_LEFT] = "inst_junction_exit_left";
        keyMap[ja_routing_type.OverrideEXIT_RIGHT] = "inst_junction_exit_right";
        keyMap[ja_routing_type.OverrideU_TURN] = "inst_junction_u_turn";

        var translationKey = keyMap[type];
        return translationKey ? ja_t(translationKey) : "";
    }

    function ja_split_text(text) {
        if (!text || !text.includes(' ')) return text;
        const center = text.length / 2;
        let bestSpaceIndex = -1;
        let minDistance = text.length;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                const distance = Math.abs(i - center);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestSpaceIndex = i;
                }
            }
        }
        if (bestSpaceIndex !== -1) {
            return text.substring(0, bestSpaceIndex) + "\n" + text.substring(bestSpaceIndex + 1);
        }
        return text;
    }

    function ja_draw_marker(point, node, ja_label_distance, a, ha, withRouting, ja_junction_type) {
        var mode = ja_getOption("displayMode");
        var labelText = "";

        if (mode === "modeInstructions" && withRouting) {
            labelText = ja_get_instruction_text(ja_junction_type);
            labelText = ja_split_text(labelText);
            if (!labelText) labelText = ja_round(Math.abs(a)) + "°";
        } else {
            var angleString = ja_round(Math.abs(a)) + "°";
            if (ja_getOption("angleDisplay") === "displaySimple") {
                if(ja_junction_type === ja_routing_type.TURN || ja_junction_type === ja_routing_type.TURN_LEFT || ja_junction_type === ja_routing_type.TURN_RIGHT)
                    angleString = a > 0 ? ja_arrow.left() + angleString : angleString + ja_arrow.right();
            } else {
                if(ja_junction_type === ja_routing_type.TURN || ja_junction_type === ja_routing_type.TURN_LEFT || ja_junction_type === ja_routing_type.TURN_RIGHT)
                    angleString = (a > 0 ? ja_arrow.left() : ja_arrow.right()) + "\n" + angleString;
            }
            labelText = angleString;
        }

        var pSize = parseInt(ja_getOption("circleSize")) || 16;
        var tSize = parseInt(ja_getOption("textSize")) || 12;
        var decimals = parseInt(ja_getOption("decimals")) || 2;
        var dynamicRadius;

        if (mode === "modeInstructions") {
            dynamicRadius = pSize + (tSize * 1.0);
        } else {
            dynamicRadius = pSize + (decimals > 0 ? 2 * decimals : 0);
        }

        var anglePoint = withRouting ?
            new window.OpenLayers.Feature.Vector(point, { angle: labelText, ja_type: ja_junction_type, ja_mode: mode, pointRadius: dynamicRadius }) :
            new window.OpenLayers.Feature.Vector(point, { angle: ja_round(a) + "°", ja_type: "generic", ja_mode: mode, pointRadius: dynamicRadius });

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

    function ja_get_angle(ja_node, ja_segment) {
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

    var ja_getAngle = ja_get_angle;

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
                    ja_options = {
                        uiLanguage: "en-US",
                        turnInstructionColor: "#00ff00",
                        uTurnInstructionColor: "#0055ff",
                        exitInstructionColor: "#00ffff",
                        keepInstructionColor: "#ffff00",
                        noTurnColor: "#ff0000",
                        problemColor: "#ff0099",
                        continueInstructionColor: "#ffffff",
                        noInstructionColor: "#aaaaaa",
                        roundaboutOverlayColor: "#2F4F4F",
                        roundaboutColor: "#4B0082",
                        textSize: 12,
                        circleSize: 16,
                        lineLength: 30,
                        lineWidth: 2,
                        displayMode: "modeAngles"
                    };
                    var old_stored = JSON.parse(localStorage.getItem("wme_ja_abdullah_options_v13")) || JSON.parse(localStorage.getItem("wme_ja_abdullah_options_v12"));
                    if(old_stored) {
                        ja_options = old_stored;
                        if(!ja_options.roundaboutColor) ja_options.roundaboutColor = "#4B0082";
                    }
                }
            } catch (e){}
        }
        if(!ja_options.uiLanguage) ja_options.uiLanguage = "en-US";
        if(!ja_options.textSize) ja_options.textSize = 12;
        if(!ja_options.circleSize) ja_options.circleSize = 16;
        if(!ja_options.lineLength) ja_options.lineLength = 30;
        if(!ja_options.lineWidth) ja_options.lineWidth = 2;
        if(!ja_options.displayMode) ja_options.displayMode = "modeAngles";
    };

    var ja_apply = function() {
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            var elem = document.getElementById(setting.elementId);
            if(elem) {
                if(setting.elementType === "checkbox") elem.checked = ja_getOption(a);
                else elem.value = ja_getOption(a);
                var valDisp = document.getElementById(setting.elementId + "_val");
                if(valDisp) valDisp.innerText = ja_getOption(a);
            }
        });
        if(window.W.map.getLayersBy("uniqueName","junction_angles")[0]) {
            window.W.map.getLayersBy("uniqueName","junction_angles")[0].styleMap = ja_style();
             window.W.map.getLayersBy("uniqueName","junction_angles")[0].redraw();
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
        var tSize = parseInt(ja_getOption("textSize")) || 12;

        return new window.OpenLayers.Rule({
            filter: new window.OpenLayers.Filter.Comparison({
                type: window.OpenLayers.Filter.Comparison.EQUAL_TO, property: "ja_type", value: routingType
            }),
            symbolizer: {
                fontSize: tSize + "px",
                fillColor: ja_getOption(fillColorOption),
                strokeColor: "#183800",
                fontColor: ja_get_contrast_color(ja_getOption(fillColorOption))
            }
        });
    }

    function ja_style() {
        var tSize = parseInt(ja_getOption("textSize")) || 12;

        return new window.OpenLayers.Style({
            fillColor: "#ffcc88", strokeColor: "#ff9966", strokeWidth: 2,
            label: "${angle}", fontWeight: "bold",
            pointRadius: "${pointRadius}", fontSize: tSize + "px"
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

    // ==========================================
    // PART 4: SCANNER LOGIC FUNCTIONS
    // ==========================================

    function resetWindowPosition() {
        let saved = JSON.parse(localStorage.getItem("aa_scanner_state_v12")) || {};
        saved.top = "100px";
        saved.left = "100px";
        saved.orientation = "landscape";
        localStorage.setItem("aa_scanner_state_v12", JSON.stringify(saved));

        let popup = document.getElementById("aa-scanner-popup");
        if(popup) {
            popup.style.top = "100px";
            popup.style.left = "100px";
            applyOrientationStyles(popup, "landscape");
            popup.style.width = "750px";
            popup.style.height = "500px";
        }
    }

    function getUserName(id) {
        if (!id) return "-";
        if (id === -1) return "Wazer";
        let u = W.model.users.objects[id];
        return u ? u.userName : `ID: ${id}`;
    }

    function performScan() {
        let results = [];

        // 1. Venues & Images
        if (W.model.venues && (scanOptions.places || scanOptions.images)) {
            for (let id in W.model.venues.objects) {
                let v = W.model.venues.objects[id];
                let attr = v.attributes;

                let isNew = !attr.approved;
                let hasEdits = (attr.unapprovedEdits === true);
                let requests = attr.requests || [];
                let hasReq = (requests.length > 0) || attr.hasOpenUpdateRequests;

                let rawImages = attr.images || [];
                let hasNewImg = false;
                if (rawImages.length > 0) {
                    hasNewImg = rawImages.some(i => i.approved === false);
                }

                let shouldAdd = false;
                let categoryKey = "cat_place_edit";
                let icon = ICONS.edit;

                if (scanOptions.images && hasNewImg) {
                    shouldAdd = true;
                    categoryKey = "cat_place_img";
                    icon = ICONS.img;
                }
                else if (scanOptions.places) {
                    if (isNew) {
                        shouldAdd = true;
                        categoryKey = "cat_place_new";
                        icon = ICONS.new;
                    }
                    else if (hasEdits || hasReq) {
                        shouldAdd = true;
                        categoryKey = "cat_place_edit";
                        icon = ICONS.edit;
                    }
                }

                if (shouldAdd) {
                    if (attr.residential) icon = ICONS.home;
                    results.push({
                        id: id, obj: v, type: "venue",
                        categoryKey: categoryKey,
                        category: ja_t(categoryKey),
                        name: attr.name || (attr.residential ? (ja_getOption("uiLanguage")==='en-US'?"House":"منزل") : (ja_getOption("uiLanguage")==='en-US'?"No Name":"بدون اسم")),
                        icon: icon, date: attr.updatedOn || attr.createdOn,
                        user: getUserName(attr.updatedBy || attr.createdBy)
                    });
                }
            }
        }

        // 2. URs
        if (scanOptions.urs && W.model.mapUpdateRequests) {
            for (let id in W.model.mapUpdateRequests.objects) {
                let ur = W.model.mapUpdateRequests.objects[id];
                if (ur.attributes.state === 0 || ur.attributes.state === 1) {
                    results.push({
                        id: id, obj: ur, type: "ur", categoryKey: "cat_ur", category: ja_t("cat_ur"),
                        name: getURType(ur.attributes.type), icon: ICONS.ur,
                        date: ur.attributes.driveDate, user: "Wazer"
                    });
                }
            }
        }

        // 3. MPs & MCs
        if (scanOptions.mps) {
            if (W.model.mapProblems) {
                for (let id in W.model.mapProblems.objects) {
                    let mp = W.model.mapProblems.objects[id];
                    if (mp.attributes.status === 0) {
                        results.push({
                            id: id, obj: mp, type: "mp", categoryKey: "cat_mp", category: ja_t("cat_mp"),
                            name: ja_getOption("uiLanguage") === 'en-US' ? "Map Problem" : "مشكلة خريطة", icon: ICONS.mp,
                            date: mp.attributes.createdOn, user: "System"
                        });
                    }
                }
            }
            if (W.model.mapComments) {
                for (let id in W.model.mapComments.objects) {
                    let mc = W.model.mapComments.objects[id];
                    results.push({
                        id: id, obj: mc, type: "mc", categoryKey: "cat_mc", category: ja_t("cat_mc"),
                        name: mc.attributes.subject, icon: ICONS.mc,
                        date: mc.attributes.createdOn, user: getUserName(mc.attributes.createdBy)
                    });
                }
            }
        }

        results.sort((a, b) => (b.date || 0) - (a.date || 0));

        let existingPopup = document.getElementById("aa-scanner-popup");
        if (existingPopup) {
            updatePopupContent(existingPopup, results);
        } else {
            createFloatingWindow(results);
        }
    }

    function updatePopupContent(popup, data) {
        let countEl = document.getElementById("aa-count");
        if(countEl) countEl.innerText = data.length;

        let { tabsHtml, contentHtml } = generateTabsAndContent(data);
        let body = popup.querySelector('.aa-body');
        if (body) body.innerHTML = tabsHtml + contentHtml;

        bindClicks(popup);

        window.aaSwitch = function(id, btn) {
            popup.querySelectorAll('.aa-content > div').forEach(d=>d.style.display='none');
            popup.querySelectorAll('.aa-btn-tab').forEach(b=>b.classList.remove('active'));
            let target = document.getElementById('list-'+id);
            if(target) target.style.display='block';
            btn.classList.add('active');
        };

        let saved = JSON.parse(localStorage.getItem("aa_scanner_state_v12"));
        if(saved) applyOrientationStyles(popup, saved.orientation);
    }

    function generateTabsAndContent(data) {
        let cats = {};
        data.forEach(d => { if(!cats[d.categoryKey]) cats[d.categoryKey]=[]; cats[d.categoryKey].push(d); });

        let tabsHtml = `<div class="aa-tabs" id="aa-tabs-c">
            <button class="aa-btn-tab active" onclick="aaSwitch('all',this)"><span>${ja_t('tabAll')}</span><span class="aa-badge">${data.length}</span></button>`;
        let contentHtml = `<div class="aa-content" id="aa-content-c"><div id="list-all">${buildList(data)}</div>`;

        TAB_ORDER.forEach(key => {
            if(cats[key] && cats[key].length > 0) {
                let displayName = ja_t(key);
                let safe = key;
                tabsHtml += `<button class="aa-btn-tab" onclick="aaSwitch('${safe}',this)"><span>${displayName}</span><span class="aa-badge">${cats[key].length}</span></button>`;
                contentHtml += `<div id="list-${safe}" style="display:none">${buildList(cats[key])}</div>`;
            }
        });

        tabsHtml += `</div>`; contentHtml += `</div>`;
        return { tabsHtml, contentHtml };
    }

    function createFloatingWindow(data) {
        let old = document.getElementById("aa-scanner-popup");
        if (old) old.remove();

        let saved = JSON.parse(localStorage.getItem("aa_scanner_state_v12")) || {
            top: "100px", left: "100px", orientation: "landscape", min: false
        };

        if (parseInt(saved.top) < 0 || parseInt(saved.top) > window.innerHeight - 50) saved.top = "100px";
        if (parseInt(saved.left) < 0 || parseInt(saved.left) > window.innerWidth - 50) saved.left = "100px";

        let dims = saved.orientation === "landscape" ? {w:"750px", h:"500px"} : {w:"380px", h:"650px"};
        if(saved.min) dims.h = "40px";

        let popup = document.createElement("div");
        popup.id = "aa-scanner-popup";
        popup.style.cssText = `
            position: fixed; top: ${saved.top}; left: ${saved.left};
            width: ${dims.w}; height: ${dims.h};
            background: #fff; border: 1px solid #7f8c8d; border-radius: 8px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3); z-index: 99999;
            display: flex; flex-direction: column; overflow: hidden;
            font-family: "Open Sans", "Cairo", sans-serif;
            transition: width 0.2s, height 0.2s;
        `;

        // Dynamically set direction based on Toolkit Language
        let isRTL = ja_translations_db[ja_getOption("uiLanguage")].dir === "rtl";
        popup.style.direction = isRTL ? "rtl" : "ltr";

        let style = document.createElement("style");
        style.innerHTML = `
            .aa-head { background:#2c3e50; color:#fff; padding:0 15px; cursor:move; display:flex; justify-content:space-between; align-items:center; height:40px; flex-shrink:0; border-bottom:1px solid #1a252f; }
            .aa-body { flex:1; display:flex; background:#f4f6f7; overflow:hidden; flex-direction: ${saved.orientation === 'landscape' ? 'row' : 'column'}; }

            .aa-tabs {
                width: ${saved.orientation === 'landscape' ? '180px' : '100%'};
                background:#fff; ${isRTL ? 'border-left' : 'border-right'}:1px solid #e0e0e0; overflow-y:auto;
                display:flex; flex-direction: ${saved.orientation === 'landscape' ? 'column' : 'row'};
            }
            .aa-content { flex:1; overflow-y:auto; background:#fff; padding:0; }

            .aa-btn-tab {
                width: 100%; padding:10px; border:none; background:transparent; text-align:${isRTL?'right':'left'}; cursor:pointer;
                font-size:12px; display:flex; justify-content:space-between; align-items:center;
            }
            .aa-btn-tab:hover { background:#f0f8ff; color:#2c3e50; }
            .aa-btn-tab.active { background:#e8f8f5; color:#16a085; ${isRTL?'border-left':'border-right'}:4px solid #16a085; font-weight:bold; }

            .aa-badge {
                background:#95a5a6; color:#fff;
                padding:2px 8px; font-size:11px; font-weight:bold;
                border-radius:12px;
                min-width: 20px; text-align: center;
                flex-shrink: 0; margin-${isRTL?'right':'left'}: 5px;
            }
            .aa-btn-tab.active .aa-badge { background:#16a085; color:#fff; }

            .aa-table-header { display:flex; background:#ecf0f1; padding:8px 10px; font-weight:bold; font-size:12px; color:#555; border-bottom:2px solid #ddd; }
            .th-icon { width:30px; } .th-name { flex:2; } .th-date { flex:1; } .th-user { flex:1; }

            .aa-row { padding:8px 10px; border-bottom:1px solid #f0f0f0; display:flex; align-items:center; cursor:pointer; font-size:12px; }
            .aa-row:hover { background:#fdf2e9; }
            .td-icon { width:30px; font-size:16px; text-align:center; }
            .td-name { flex:2; font-weight:bold; color:#2c3e50; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; padding-${isRTL?'left':'right'}:10px; }
            .td-date { flex:1; color:#7f8c8d; font-size:11px; }
            .td-user { flex:1; color:#2980b9; font-size:11px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }

            .aa-btn-ctrl { background:none; border:none; color:#ccc; cursor:pointer; margin-${isRTL?'left':'right'}:8px; font-size:16px; }
            .aa-btn-ctrl:hover { color:#fff; }
            .aa-footer { height:45px; background:#fff; border-top:1px solid #ccc; display:flex; justify-content:space-between; align-items:center; padding:0 15px; }
            .aa-btn-action { padding:5px 15px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:12px; color:white; border:none; }
            .btn-refresh { background:#3498db; } .btn-clean { background:#e74c3c; }
        `;
        popup.appendChild(style);

        let header = document.createElement("div");
        header.className = "aa-head";
        header.innerHTML = `<span>${ja_t('scannerTitle')} (<span id="aa-count">${data.length}</span>)</span><div><button id="aa-min" class="aa-btn-ctrl">_</button><button id="aa-rotate" class="aa-btn-ctrl">🔄</button><button id="aa-close" class="aa-btn-ctrl">✕</button></div>`;
        popup.appendChild(header);

        let body = document.createElement("div");
        body.className = "aa-body";
        body.style.display = saved.min ? 'none' : 'flex';

        let { tabsHtml, contentHtml } = generateTabsAndContent(data);
        body.innerHTML = tabsHtml + contentHtml;
        popup.appendChild(body);

        let footer = document.createElement("div");
        footer.className = "aa-footer";
        footer.style.display = saved.min ? 'none' : 'flex';
        footer.innerHTML = `
            <button class="aa-btn-action btn-clean" id="aa-clean">${ja_t('btn_clear')}</button>
            <button class="aa-btn-action btn-refresh" id="aa-rescan">${ja_t('btn_rescan')}</button>
        `;
        popup.appendChild(footer);

        document.body.appendChild(popup);

        makeDraggable(popup, header);
        header.querySelector("#aa-close").onclick = () => popup.remove();
        header.querySelector("#aa-min").onclick = () => { saved.min = !saved.min; toggleMin(); };
        header.querySelector("#aa-rotate").onclick = () => { saved.orientation = (saved.orientation==="landscape"?"portrait":"landscape"); updateDims(); };
        footer.querySelector("#aa-rescan").onclick = performScan;

        footer.querySelector("#aa-clean").onclick = () => {
             if(W.selectionManager.unselectAll) W.selectionManager.unselectAll();
             document.getElementById("aa-content-c").innerHTML = `<div style="text-align:center;padding:40px;color:#999;">${ja_t('clearedMsg')}</div>`;
             let countEl = document.getElementById("aa-count");
             if(countEl) countEl.innerText = "0";
             let badges = popup.querySelectorAll('.aa-badge');
             badges.forEach(b => b.innerText = "0");
        };

        function toggleMin() {
            let m = saved.min;
            body.style.display = m ? 'none' : 'flex';
            footer.style.display = m ? 'none' : 'flex';
            updateDims();
        }

        function updateDims() {
            let d = saved.orientation === "landscape" ? {w:"750px", h:"500px"} : {w:"380px", h:"650px"};
            if(saved.min) d.h = "40px";
            popup.style.width = d.w;
            popup.style.height = d.h;
            applyOrientationStyles(popup, saved.orientation);
            saveState();
        }

        window.applyOrientationStyles = function(p, orientation) {
            let bodyEl = p.querySelector('.aa-body');
            let tabs = p.querySelector('.aa-tabs');
            let tBtns = p.querySelectorAll('.aa-btn-tab');

            if(orientation === "landscape") {
                bodyEl.style.flexDirection = "row";
                tabs.style.width = "180px"; tabs.style.height = "100%"; tabs.style.flexDirection = "column"; tabs.style.flexWrap = "nowrap";
                tBtns.forEach(b => { b.style.width = "100%"; b.style.margin = "0"; });
            } else {
                bodyEl.style.flexDirection = "column";
                tabs.style.width = "100%"; tabs.style.height = "auto"; tabs.style.flexDirection = "row"; tabs.style.flexWrap = "wrap";
                tBtns.forEach(b => { b.style.width = "calc(50% - 4px)"; b.style.margin = "2px"; });
            }
        };

        function saveState() {
            let s = { top:popup.style.top, left:popup.style.left, orientation:saved.orientation, min:saved.min };
            localStorage.setItem("aa_scanner_state_v12", JSON.stringify(s));
        }

        applyOrientationStyles(popup, saved.orientation);

        window.aaSwitch = function(id, btn) {
            popup.querySelectorAll('.aa-content > div').forEach(d=>d.style.display='none');
            popup.querySelectorAll('.aa-btn-tab').forEach(b=>b.classList.remove('active'));
            let target = document.getElementById('list-'+id);
            if(target) target.style.display='block';
            btn.classList.add('active');
        };

        bindClicks(popup);
        toggleMin();
    }

    function buildList(items) {
        if (items.length === 0) {
            return `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:40px; color:#95a5a6; text-align:center;">
                <div style="font-size:40px; margin-bottom:10px;">🎉</div>
                <div style="font-size:16px; font-weight:bold;">${ja_t('noResults')}</div>
            </div>`;
        }

        let html = `
        <div class="aa-table-header">
            <div class="th-icon"></div>
            <div class="th-name">${ja_t('col_name')}</div>
            <div class="th-date">${ja_t('col_date')}</div>
            <div class="th-user">${ja_t('col_user')}</div>
        </div>`;

        items.forEach(i => {
            html += `
            <div class="aa-row" data-id="${i.id}" data-type="${i.type}">
                <div class="td-icon">${i.icon}</div>
                <div class="td-name" title="${i.name}">${i.name}</div>
                <div class="td-date">${getSyriacDate(i.date)}</div>
                <div class="td-user" title="${i.user}">${i.user}</div>
            </div>`;
        });
        return html;
    }

    function bindClicks(p) {
        p.querySelectorAll('.aa-row').forEach(r => {
            r.onclick = function() {
                handleObjectClick(this.dataset.id, this.dataset.type);
            };
        });
    }

    function handleObjectClick(id, type) {
        let obj;
        if(type==='venue') obj=W.model.venues.objects[id];
        else if(type==='ur') obj=W.model.mapUpdateRequests.objects[id];
        else if(type==='mp') obj=W.model.mapProblems.objects[id];
        else if(type==='mc') obj=W.model.mapComments.objects[id];

        if(obj) {
            let c = obj.geometry.getCentroid();
            W.map.setCenter(new OpenLayers.LonLat(c.x, c.y));
            if (W.selectionManager.setSelectedModels) {
                W.selectionManager.setSelectedModels([obj]);
            } else {
                W.selectionManager.select([obj]);
            }
        }
    }

    function makeDraggable(elm, handle) {
        let pos3=0, pos4=0;
        handle.onmousedown = function(e) {
            e.preventDefault(); pos3=e.clientX; pos4=e.clientY;
            document.onmouseup = closeDrag; document.onmousemove = elementDrag;
        };
        function elementDrag(e) {
            e.preventDefault();
            let newTop = elm.offsetTop - (pos4-e.clientY);
            let newLeft = elm.offsetLeft - (pos3-e.clientX);
            if(newTop < 0) newTop = 0;
            elm.style.top = newTop + "px";
            elm.style.left = newLeft + "px";
            pos3=e.clientX; pos4=e.clientY;
            let s = JSON.parse(localStorage.getItem("aa_scanner_state_v12")) || {};
            s.top=elm.style.top; s.left=elm.style.left;
            localStorage.setItem("aa_scanner_state_v12", JSON.stringify(s));
        }
        function closeDrag() { document.onmouseup=null; document.onmousemove=null; }
    }

    function getURType(id) {
        let types = ja_translations_db[ja_getOption("uiLanguage")].ur_types;
        return types[id] || (ja_getOption("uiLanguage") === 'en-US' ? "Type "+id : "نوع "+id);
    }
    function getSyriacDate(ts) {
        if(!ts) return "";
        let d = new Date(ts);
        return d.getDate() + " " + ja_translations_db[ja_getOption("uiLanguage")].months[d.getMonth()];
    }

    // ==========================================
    // INITIALIZATION (WATCHDOG MODE)
    // ==========================================
    function bootstrap() {
        // Watchdog: Keep checking until Waze is ready AND our tab is injected
        setInterval(() => {
            if (typeof W !== 'undefined' && W.map && W.model && W.loginManager.isLoggedIn()) {
                let tab = document.getElementById("sidepanel-ja");
                if (!tab) {
                    junctionangle_init();
                }
            }
        }, 2000); // Check every 2 seconds
    }

    function getByID(obj, id){
        if (typeof(obj.getObjectById) == "function") return obj.getObjectById(id);
        else if (typeof(obj.getObjectById) == "undefined") return obj.get(id);
    }

    bootstrap();
}

let run_combined_script = GM_addElement('script', {
    textContent: "" + run_combined_toolkit.toString() + " \n" + "run_combined_toolkit();"
});