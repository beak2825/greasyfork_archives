// ==UserScript==
// @name            Abdullah Abbas WME Nots
// @namespace       https://github.com/abdullah-abbas/wme-nots
// @description     Store notes on Waze Map Editor with map error icons and visual colors (AR, KU, EN)
// @version         2026.01.11.15
// @author          Abdullah Abbas
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*
// @grant           none
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/562292/Abdullah%20Abbas%20WME%20Nots.user.js
// @updateURL https://update.greasyfork.org/scripts/562292/Abdullah%20Abbas%20WME%20Nots.meta.js
// ==/UserScript==

/* global W, OpenLayers, WazeWrap, I18n */

(function() {
    'use strict';

    // --- منع التكرار ---
    if (window.ABDULLAH_NOTES_INSTANCE) return;
    window.ABDULLAH_NOTES_INSTANCE = true;

    const SCRIPT_NAME = "Abdullah Abbas WME Nots";
    const SCRIPT_VERSION = "v2026.01.11.15"; // رقم الإصدار
    const STORE_KEY = "WME_ABDULLAH_NOTES_DATA";
    const LOCK_STATE_KEY = "WME_ABDULLAH_NOTES_LOCKED";
    const POPUP_STATE_KEY = "WME_ABDULLAH_NOTES_POPUP_STATE";
    const LANG_KEY = "WME_ABDULLAH_NOTES_LANG";
    const SCRIPT_ID = "abdullah-abbas-wme-notes-errors-icons";

    // --- تعريف الأشكال ---
    const SHAPES = {
        lock_err: { path: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" },
        speed_err: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8-4.41 8-8 8zm-5.5-2.5l7.51-3.22-3.22-7.51-7.51 3.22 3.22 7.51z" },
        turn_err: { path: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" },
        dir_err: { path: "M8 5v14l11-7z" },
        geo_err: { path: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" },
        connect_err: { path: "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" },
        level_err: { path: "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" },
        note: { path: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" },
        pin: { path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
        star: { path: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" },
        alert: { path: "M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" },
        check: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
        cross: { path: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" },
        question: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" },
        flag: { path: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" },
        home: { path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
        work: { path: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" },
        school: { path: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" },
        university: { path: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z" },
        hospital: { path: "M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" },
        gas: { path: "M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" },
        food: { path: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" },
        cafe: { path: "M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z" },
        shopping: { path: "M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 17c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z" },
        park: { path: "M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-9 3c-3.87 0-7 3.13-7 7h14c0-3.87-3.13-7-7-7zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" },
        car: { path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" },
        camera: { path: "M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" }
    };

    // --- تعريف الألوان ---
    const COLORS = {
        blue: { hex: "#2196F3" },
        light_blue: { hex: "#03A9F4" },
        cyan: { hex: "#00BCD4" },
        teal: { hex: "#009688" },
        green: { hex: "#4CAF50" },
        light_green: { hex: "#8BC34A" },
        lime: { hex: "#CDDC39" },
        yellow: { hex: "#FFEB3B" },
        amber: { hex: "#FFC107" },
        orange: { hex: "#FF9800" },
        deep_orange: { hex: "#FF5722" },
        red: { hex: "#F44336" },
        pink: { hex: "#E91E63" },
        purple: { hex: "#9C27B0" },
        deep_purple: { hex: "#673AB7" },
        indigo: { hex: "#3F51B5" },
        brown: { hex: "#795548" },
        blue_grey: { hex: "#607D8B" },
        grey: { hex: "#9E9E9E" },
        black: { hex: "#000000" }
    };

    const STRINGS = {
        en: {
            tab_title: "Abdullah Abbas WME Nots", add_note: "Click here to add the note", delete: "Delete", jump: "Go to note", edit: "Edit",
            export: "Export", import: "Import", clear: "Clear All", placeholder: "Note text...",
            confirm_delete: "Delete?", confirm_clear: "Delete ALL?", category: "Type",
            lock_btn_to_unlock: "🔒 Unlock", lock_btn_to_lock: "🔓 Lock",
            save_edit: "Save Changes", cancel: "Cancel",
            color: "Color", shape: "Shape", preview: "Preview",
            btn_edit_text: "Edit", btn_delete_text: "Delete", popup_title: "Note Details",
            popup_save: "💾 Save",
            lang_ar: "Arabic - Iraq", lang_ku: "Kurdish - Sorani", lang_en: "English - US",

            // Shapes
            s_lock_err: "Lock Error", s_speed_err: "Speed Error", s_turn_err: "Turn Error", s_dir_err: "Direction Error",
            s_geo_err: "Geometry Error", s_connect_err: "Connection", s_level_err: "Level Error",
            s_note: "Note", s_pin: "Pin", s_star: "Star", s_alert: "Alert", s_check: "Check", s_cross: "Cross",
            s_question: "Question", s_flag: "Flag", s_home: "Home", s_work: "Work", s_school: "School",
            s_university: "University", s_hospital: "Hospital", s_gas: "Gas Station", s_food: "Restaurant",
            s_cafe: "Cafe", s_shopping: "Shopping", s_park: "Park", s_car: "Car", s_camera: "Camera",

            // Colors
            c_blue: "Blue", c_light_blue: "Light Blue", c_cyan: "Cyan", c_teal: "Teal", c_green: "Green",
            c_light_green: "Light Green", c_lime: "Lime", c_yellow: "Yellow", c_amber: "Amber", c_orange: "Orange",
            c_deep_orange: "Deep Orange", c_red: "Red", c_pink: "Pink", c_purple: "Purple", c_deep_purple: "Deep Purple",
            c_indigo: "Indigo", c_brown: "Brown", c_blue_grey: "Blue Grey", c_grey: "Grey", c_black: "Black"
        },
        ar: {
            tab_title: "Abdullah Abbas WME Nots", add_note: "اضغط هنا لإضافة الملاحظة", delete: "حذف", jump: "اذهب الى الملاحظة", edit: "تعديل",
            export: "تصدير", import: "استيراد", clear: "مسح الكل", placeholder: "نص الملاحظة...",
            confirm_delete: "حذف؟", confirm_clear: "حذف الجميع؟", category: "نوع",
            lock_btn_to_unlock: "🔒 تحريك", lock_btn_to_lock: "🔓 تثبيت",
            save_edit: "حفظ التعديل", cancel: "إلغاء",
            color: "اللون", shape: "الشكل", preview: "معاينة",
            btn_edit_text: "تعديل", btn_delete_text: "حذف", popup_title: "تفاصيل الملاحظة",
            popup_save: "💾 حفظ",
            lang_ar: "العربية - العراق", lang_ku: "الكوردية - السورانية", lang_en: "الانجليزية - الولايات المتحدة",

            // Shapes
            s_lock_err: "⚠️ قفل خطأ", s_speed_err: "⚠️ سرعة خطأ", s_turn_err: "⚠️ انعطاف خطأ", s_dir_err: "⚠️ اتجاه خطأ",
            s_geo_err: "⚠️ هندسة خطأ", s_connect_err: "⚠️ فصل/ربط", s_level_err: "⚠️ مستوى خطأ",
            s_note: "ملاحظة", s_pin: "دبوس", s_star: "نجمة", s_alert: "تنبيه عام", s_check: "صح", s_cross: "خطأ",
            s_question: "استفهام", s_flag: "علم", s_home: "منزل", s_work: "عمل", s_school: "مدرسة",
            s_university: "جامعة", s_hospital: "مستشفى", s_gas: "وقود", s_food: "مطعم",
            s_cafe: "مقهى", s_shopping: "تسوق", s_park: "حديقة", s_car: "سيارة", s_camera: "كاميرا",

            // Colors
            c_blue: "أزرق", c_light_blue: "أزرق فاتح", c_cyan: "سماوي", c_teal: "فيروزي", c_green: "أخضر",
            c_light_green: "أخضر فاتح", c_lime: "ليموني", c_yellow: "أصفر", c_amber: "كهرماني", c_orange: "برتقالي",
            c_deep_orange: "برتقالي داكن", c_red: "أحمر", c_pink: "وردي", c_purple: "بنفسجي", c_deep_purple: "بنفسجي داكن",
            c_indigo: "نيلي", c_brown: "بني", c_blue_grey: "رمادي أزرق", c_grey: "رمادي", c_black: "أسود"
        },
        ku: {
            tab_title: "Abdullah Abbas WME Nots", add_note: "لێرە دابگرە بۆ زیادکردن", delete: "سڕینەوە", jump: "بڕۆ", edit: "دەستکاری",
            export: "هەناردە", import: "هاوردە", clear: "سڕینەوەی گشت", placeholder: "دەق...",
            confirm_delete: "سڕینەوە؟", confirm_clear: "سڕینەوەی هەموو؟", category: "جۆر",
            lock_btn_to_unlock: "🔒 جوڵاندن", lock_btn_to_lock: "🔓 جێگیر",
            save_edit: "تۆمارکردن", cancel: "پاشگەزبوون",
            color: "ڕەنگ", shape: "شێوە", preview: "بینین",
            btn_edit_text: "دەستکاری", btn_delete_text: "سڕینەوە", popup_title: "وردەکاری",
            popup_save: "💾 تۆمارکردن",
            lang_ar: "عەرەبی - عێراق", lang_ku: "کوردی - سۆرانی", lang_en: "ئینگلیزی - ئەمریکا",

            // Shapes (Kurdish Translations)
            s_lock_err: "⚠️ هەڵەی قفڵ", s_speed_err: "⚠️ هەڵەی خێرایی", s_turn_err: "⚠️ هەڵەی پێچ", s_dir_err: "⚠️ هەڵەی ئاڕاستە",
            s_geo_err: "⚠️ هەڵەی ئەندازیاری", s_connect_err: "⚠️ گرێدان", s_level_err: "⚠️ هەڵەی ئاست",
            s_note: "تێبینی", s_pin: "پین", s_star: "ئەستێرە", s_alert: "ئاگادارکردنەوە", s_check: "ڕاست", s_cross: "هەڵە",
            s_question: "پرسیار", s_flag: "ئاڵا", s_home: "ماڵ", s_work: "کار", s_school: "قوتابخانە",
            s_university: "زانکۆ", s_hospital: "نەخۆشخانە", s_gas: "بەنزینخانە", s_food: "چێشتخانە",
            s_cafe: "قاوەخانە", s_shopping: "بازاڕ", s_park: "باخچە", s_car: "ئۆتۆمبێل", s_camera: "کامێرا",

            // Colors (Kurdish Translations)
            c_blue: "شین", c_light_blue: "شینی کاڵ", c_cyan: "ئاسمانی", c_teal: "فیروزەیی", c_green: "سەوز",
            c_light_green: "سەوزی کاڵ", c_lime: "لیمۆیی", c_yellow: "زەرد", c_amber: "کەهرەبایی", c_orange: "پرتەقاڵی",
            c_deep_orange: "پرتەقاڵی تۆخ", c_red: "سوور", c_pink: "پەمەیی", c_purple: "مۆر", c_deep_purple: "مۆری تۆخ",
            c_indigo: "نیلی", c_brown: "قاوەیی", c_blue_grey: "ڕەساسی شین", c_grey: "ڕەساسی", c_black: "ڕەش"
        }
    };

    let currentLang = 'ar';
    let wmeSDK = null;
    let notesLayer = null;
    let dragControl = null;
    let isMarkersLocked = true;
    let currentlyOpenNoteId = null;

    // متغيرات الحالة
    let selectedColor = 'blue';
    let selectedShape = 'note';
    let editingNoteId = null;

    function bootstrap() {
        if (window.SDK_INITIALIZED) {
            window.SDK_INITIALIZED.then(initScript).catch(e => console.error(SCRIPT_NAME, e));
        } else {
            document.addEventListener("wme-ready", initScript, { once: true });
        }
    }

    async function initScript() {
        cleanDuplicateTabs();

        const savedLang = localStorage.getItem(LANG_KEY);
        if (savedLang && ['ar', 'ku', 'en'].includes(savedLang)) {
            currentLang = savedLang;
        } else if (typeof I18n !== 'undefined' && I18n.locale) {
            if (I18n.locale.startsWith('ar')) currentLang = 'ar';
            else if (I18n.locale.startsWith('ckb') || I18n.locale.startsWith('ku')) currentLang = 'ku';
            else currentLang = 'en';
        }

        const savedLockState = localStorage.getItem(LOCK_STATE_KEY);
        if (savedLockState !== null) isMarkersLocked = (savedLockState === 'true');

        wmeSDK = window.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });

        initMapLayer();
        initPopupSystem();

        wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
            tabLabel.textContent = STRINGS[currentLang].tab_title;
            tabLabel.title = STRINGS[currentLang].tab_title;
            tabLabel.style.fontSize = "11px";
            renderSidebar(tabPane);
        });

        refreshLayer();

        wmeSDK.Events.on({ eventName: "wme-map-move-end", eventHandler: () => {
            refreshLayer();
            forceLayerToTop();
        }});

        setInterval(forceLayerToTop, 2000);
    }

    function initPopupSystem() {
        if (document.getElementById('aan-popup-window')) return;

        const popup = document.createElement('div');
        popup.id = 'aan-popup-window';
        popup.style.cssText = `
            position: fixed; background: #ffffff; border: 2px solid #2196F3;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4); z-index: 99999; display: none;
            flex-direction: column; border-radius: 8px; overflow: hidden; resize: both;
            min-width: 250px; min-height: 200px; font-family: Tahoma, sans-serif;
            direction: ${currentLang === 'en' ? 'ltr' : 'rtl'};
        `;

        const header = document.createElement('div');
        header.id = 'aan-popup-header';
        header.style.cssText = `
            background: #2196F3; color: white; padding: 8px 12px; cursor: move;
            font-weight: bold; display: flex; justify-content: space-between;
            align-items: center; user-select: none; font-size: 14px;
        `;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = STRINGS[currentLang].popup_title;
        titleSpan.id = 'aan-popup-title-text';

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;`;
        closeBtn.onclick = () => { popup.style.display = 'none'; currentlyOpenNoteId = null; };

        header.appendChild(titleSpan);
        header.appendChild(closeBtn);

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `flex: 1; display: flex; flex-direction: column; padding: 0;`;

        const textarea = document.createElement('textarea');
        textarea.id = 'aan-popup-textarea';
        // --- تحديث: إضافة text-align وتحديث direction بناءً على اللغة ---
        textarea.style.cssText = `
            flex: 1; width: 100%; border: none; padding: 10px; font-size: 15px;
            line-height: 1.5; color: #000; font-family: inherit; resize: none;
            box-sizing: border-box; outline: none; background: #fff;
            direction: ${currentLang === 'en' ? 'ltr' : 'rtl'};
            text-align: ${currentLang === 'en' ? 'left' : 'right'};
        `;

        const footer = document.createElement('div');
        footer.style.cssText = `
            background: #f1f1f1; padding: 8px; border-top: 1px solid #ccc;
            text-align: left; display: flex; justify-content: flex-end;
        `;
        if (currentLang !== 'en') footer.style.justifyContent = 'flex-start';

        const savePopupBtn = document.createElement('button');
        savePopupBtn.id = 'aan-popup-save-btn';
        savePopupBtn.textContent = STRINGS[currentLang].popup_save;
        savePopupBtn.style.cssText = `
            background-color: #4CAF50; color: white; border: none;
            padding: 6px 15px; border-radius: 4px; cursor: pointer;
            font-weight: bold; font-size: 13px;
        `;

        savePopupBtn.onclick = () => {
            if (currentlyOpenNoteId) {
                const newText = textarea.value.trim();
                const notes = getNotes();
                const idx = notes.findIndex(n => n.id === currentlyOpenNoteId);
                if (idx !== -1) {
                    notes[idx].text = newText;
                    saveNotes(notes);
                    refreshLayer();
                    const originalText = savePopupBtn.textContent;
                    savePopupBtn.textContent = "✅";
                    setTimeout(() => savePopupBtn.textContent = originalText, 1000);
                }
            }
        };

        contentContainer.appendChild(textarea);
        footer.appendChild(savePopupBtn);
        popup.appendChild(header);
        popup.appendChild(contentContainer);
        popup.appendChild(footer);
        document.body.appendChild(popup);

        const savedState = JSON.parse(localStorage.getItem(POPUP_STATE_KEY));
        if (savedState) {
            popup.style.left = savedState.left; popup.style.top = savedState.top;
            popup.style.width = savedState.width; popup.style.height = savedState.height;
        } else {
            popup.style.top = '100px'; popup.style.left = '100px';
            popup.style.width = '320px'; popup.style.height = '440px';
        }

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initialLeft = popup.offsetLeft; initialTop = popup.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        function onMouseMove(e) {
            if (!isDragging) return;
            popup.style.left = `${initialLeft + (e.clientX - startX)}px`;
            popup.style.top = `${initialTop + (e.clientY - startY)}px`;
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            savePopupState();
        }

        popup.onmouseup = savePopupState;

        function savePopupState() {
            const state = { left: popup.style.left, top: popup.style.top, width: popup.style.width, height: popup.style.height };
            localStorage.setItem(POPUP_STATE_KEY, JSON.stringify(state));
        }
    }

    function showPopupNote(note) {
        currentlyOpenNoteId = note.id;
        const popup = document.getElementById('aan-popup-window');
        const textarea = document.getElementById('aan-popup-textarea');
        if (popup && textarea) {
            textarea.value = note.text;
            popup.style.display = 'flex';
        }
    }

    function cleanDuplicateTabs() {
        try {
            const allTabs = document.querySelectorAll('li a');
            allTabs.forEach(tab => {
                if (tab.textContent.includes('📝') || tab.textContent.includes('Abdullah')) {
                    const li = tab.closest('li');
                    if (li) li.remove();
                }
            });
        } catch (e) {}
    }

    function forceLayerToTop() { if(notesLayer) notesLayer.setZIndex(999999); }

    function getSVGIcon(shapeKey, colorKey) {
        const shapeObj = SHAPES[shapeKey] || SHAPES['note'];
        const colorObj = COLORS[colorKey] || COLORS['blue'];
        const path = shapeObj.path;
        const color = colorObj.hex;
        const stroke = (['yellow','amber','lime','white'].includes(colorKey)) ? '#555' : '#FFF';
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="${stroke}" stroke-width="1"><filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.4"/></filter><path d="${path}" filter="url(#shadow)" /></svg>`;
        return "data:image/svg+xml;base64," + btoa(svgString);
    }

    function getText(key) { return STRINGS[currentLang][key] || STRINGS['en'][key]; }
    function getNotes() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch (e) { return []; } }
    function saveNotes(notes) {
        localStorage.setItem(STORE_KEY, JSON.stringify(notes));
        const listContainer = document.getElementById('aan-list-container');
        if (listContainer) renderList(listContainer);
    }

    function initMapLayer() {
        const oldLayers = W.map.getLayersBy("uniqueName", "abdullah_nots_layer");
        for(let i=0; i<oldLayers.length; i++) W.map.removeLayer(oldLayers[i]);
        if (dragControl) { W.map.removeControl(dragControl); dragControl = null; }

        const styleMap = new OpenLayers.StyleMap({
            'default': {
                externalGraphic: "${iconUrl}",
                graphicWidth: 32, graphicHeight: 32, graphicYOffset: -32,
                cursor: "pointer", label: "${label}", fontColor: "${labelColor}", fontSize: "16px",
                fontFamily: "Tahoma, Arial, sans-serif", fontWeight: "900", labelAlign: "cm", labelYOffset: -35,
                labelOutlineColor: "#ffffff", labelOutlineWidth: 4, graphicZIndex: 999999
            },
            'select': { cursor: "move", graphicOpacity: 0.8 }
        });

        notesLayer = new OpenLayers.Layer.Vector("Abdullah Nots", {
            displayInLayerSwitcher: true, uniqueName: "abdullah_nots_layer",
            styleMap: styleMap, rendererOptions: { zIndexing: true }
        });

        W.map.addLayer(notesLayer);
        notesLayer.setZIndex(999999);

        // --- إصلاح مشكلة عدم القدرة على تحديد الشارع ---
        setTimeout(() => {
            if (notesLayer.div) {
                notesLayer.div.style.pointerEvents = "none";
                const styleId = "aan-notes-css-fix";
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
                        #${notesLayer.div.id} svg,
                        #${notesLayer.div.id} div {
                            pointer-events: none;
                        }
                        #${notesLayer.div.id} path,
                        #${notesLayer.div.id} image,
                        #${notesLayer.div.id} circle,
                        #${notesLayer.div.id} text {
                            pointer-events: auto !important;
                            cursor: pointer;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }, 500);

        dragControl = new OpenLayers.Control.DragFeature(notesLayer, {
            autoActivate: false, onComplete: updateNotePosition
        });
        dragControl.handlers.feature.stopDown = true;
        dragControl.handlers.feature.stopUp = true;
        W.map.addControl(dragControl);
        if (!isMarkersLocked) dragControl.activate();
    }

    function updateNotePosition(feature) {
        const noteId = feature.attributes.noteId;
        const geometry = feature.geometry.clone();
        const mapProjection = W.map.getProjectionObject();
        const epsg4326 = new OpenLayers.Projection("EPSG:4326");
        geometry.transform(mapProjection, epsg4326);
        const notes = getNotes();
        const targetIndex = notes.findIndex(n => n.id === noteId);
        if (targetIndex !== -1) {
            notes[targetIndex].lon = geometry.x;
            notes[targetIndex].lat = geometry.y;
            saveNotes(notes);
        }
    }

    function refreshLayer() {
        if (!notesLayer) return;
        if (dragControl && dragControl.handlers && dragControl.handlers.feature && dragControl.handlers.feature.feature) return;
        notesLayer.removeAllFeatures();
        const notes = getNotes();
        const features = [];
        const mapProjection = W.map.getProjectionObject();
        const epsg4326 = new OpenLayers.Projection("EPSG:4326");

        notes.forEach(note => {
            const pt = new OpenLayers.Geometry.Point(note.lon, note.lat).transform(epsg4326, mapProjection);
            let shortText = note.text.length > 15 ? note.text.substring(0, 15) + ".." : note.text;
            const nColorKey = note.color || 'blue';
            const nShape = note.shape || 'note';
            const iconUrl = getSVGIcon(nShape, nColorKey);
            const colorHex = COLORS[nColorKey] ? COLORS[nColorKey].hex : '#000000';
            const feature = new OpenLayers.Feature.Vector(pt, {
                label: shortText, noteId: note.id, iconUrl: iconUrl, labelColor: colorHex
            });
            features.push(feature);
        });
        notesLayer.addFeatures(features);
        notesLayer.setZIndex(999999);
    }

    function renderSidebar(container) {
        container.innerHTML = '';

        const style = document.createElement('style');
        style.textContent = `
            .aan-container { padding: 5px; font-family: Tahoma, sans-serif; }
            .aan-btn { width: 100%; padding: 8px; margin-bottom: 5px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; font-size: 13px; }
            .aan-btn-primary { background-color: #2196F3; }
            .aan-btn-success { background-color: #4CAF50; }
            .aan-btn-danger { background-color: #F44336; margin-top: 5px; }
            .aan-btn-cancel { background-color: #9E9E9E; color: white; }
            .aan-btn-lock { background-color: #F44336; transition: 0.3s; }
            .aan-btn-lock.unlocked { background-color: #4CAF50; }
            .aan-btn-secondary { background-color: #eee; color: #333; border: 1px solid #ccc; width: 48%; }
            .aan-input { width: 95%; padding: 6px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 3px; }
            .aan-select { width: 48%; padding: 4px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 3px; }
            .aan-note-item { background: #fff; border-right: 5px solid #ddd; padding: 6px; margin-bottom: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border-radius: 4px; display: flex; align-items: center; justify-content: flex-start; flex-direction: row; gap: 5px; direction: rtl; }
            .aan-icon-btn { cursor: pointer; font-size: 14px; background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 3px; }
            .aan-text-btn { cursor: pointer; font-size: 11px; background: #f0f0f0; border: 1px solid #ccc; padding: 2px 8px; border-radius: 3px; color: #333; font-weight: bold; white-space: nowrap; }
            .aan-text-btn:hover { background: #e0e0e0; }
            .aan-text-btn.delete { color: #d32f2f; border-color: #ffcdd2; background: #ffebee; }
            .aan-text-box { flex: 1; border: 1px solid #ccc; background: #f9f9f9; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: #333; cursor: pointer; }
            .aan-text-box:hover { background: #eef; border-color: #aaf; }
            .aan-date-box { border: 1px solid #ccc; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #666; white-space: nowrap; }
            .aan-row { display: flex; justify-content: space-between; align-items: center; gap: 5px; }
            .aan-preview { width: 32px; height: 32px; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; background: #fff; flex-shrink: 0; }
        `;
        container.appendChild(style);

        const mainDiv = document.createElement('div');
        mainDiv.className = 'aan-container';

        // --- صف اللغة والقفل ---
        const topRow = document.createElement('div');
        topRow.style.cssText = "display: flex; gap: 5px; margin-bottom: 5px; height: 32px;";

        const langSelect = document.createElement('select');
        langSelect.className = 'aan-select';
        langSelect.style.flex = "1";
        langSelect.style.height = "100%";
        langSelect.style.marginBottom = "0";

        const langs = [
            { code: 'ar', label: getText('lang_ar') },
            { code: 'ku', label: getText('lang_ku') },
            { code: 'en', label: getText('lang_en') }
        ];

        langs.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.code;
            opt.textContent = l.label;
            if (l.code === currentLang) opt.selected = true;
            langSelect.appendChild(opt);
        });

        langSelect.onchange = () => {
            currentLang = langSelect.value;
            localStorage.setItem(LANG_KEY, currentLang);
            renderSidebar(container);
            const popupTitle = document.getElementById('aan-popup-title-text');
            const popupSave = document.getElementById('aan-popup-save-btn');
            // تحديث النافذة المنبثقة مباشرة عند تغيير اللغة
            const popupTextarea = document.getElementById('aan-popup-textarea');
            if(popupTitle) popupTitle.textContent = STRINGS[currentLang].popup_title;
            if(popupSave) popupSave.textContent = STRINGS[currentLang].popup_save;
            if(popupTextarea) {
                popupTextarea.style.textAlign = currentLang === 'en' ? 'left' : 'right';
                popupTextarea.style.direction = currentLang === 'en' ? 'ltr' : 'rtl';
            }
        };

        const lockBtn = document.createElement('button');
        lockBtn.className = `aan-btn aan-btn-lock ${!isMarkersLocked ? 'unlocked' : ''}`;
        lockBtn.style.flex = "1";
        lockBtn.style.height = "100%";
        lockBtn.style.margin = "0";
        lockBtn.style.padding = "0";
        lockBtn.textContent = isMarkersLocked ? getText('lock_btn_to_unlock') : getText('lock_btn_to_lock');

        lockBtn.onclick = () => {
            isMarkersLocked = !isMarkersLocked;
            localStorage.setItem(LOCK_STATE_KEY, isMarkersLocked);
            lockBtn.textContent = isMarkersLocked ? getText('lock_btn_to_unlock') : getText('lock_btn_to_lock');
            lockBtn.classList.toggle('unlocked');
            if (isMarkersLocked) { if(dragControl) dragControl.deactivate(); }
            else { if(dragControl) dragControl.activate(); }
        };

        topRow.appendChild(langSelect);
        topRow.appendChild(lockBtn);
        mainDiv.appendChild(topRow);

        const controlsDiv = document.createElement('div');
        controlsDiv.style.borderBottom = "1px solid #ddd";
        controlsDiv.style.marginBottom = "10px";

        const row = document.createElement('div');
        row.className = 'aan-row';

        const shapeSelect = document.createElement('select');
        shapeSelect.className = 'aan-select';
        shapeSelect.style.flex = "1";
        Object.keys(SHAPES).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.text = getText('s_' + key);
            if (key === selectedShape) opt.selected = true;
            shapeSelect.appendChild(opt);
        });

        const colorSelect = document.createElement('select');
        colorSelect.className = 'aan-select';
        colorSelect.style.flex = "1";
        Object.keys(COLORS).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.text = getText('c_' + key);
            if (key === selectedColor) opt.selected = true;
            colorSelect.appendChild(opt);
        });

        const previewDiv = document.createElement('div');
        previewDiv.className = 'aan-preview';
        const previewImg = document.createElement('img');
        previewImg.style.width = '24px';
        previewDiv.appendChild(previewImg);

        const updatePreview = () => {
            previewImg.src = getSVGIcon(selectedShape, selectedColor);
        };

        shapeSelect.onchange = () => { selectedShape = shapeSelect.value; updatePreview(); };
        colorSelect.onchange = () => { selectedColor = colorSelect.value; updatePreview(); };

        updatePreview();

        row.appendChild(shapeSelect);
        row.appendChild(colorSelect);
        row.appendChild(previewDiv);
        controlsDiv.appendChild(row);

        const noteInput = document.createElement('textarea');
        noteInput.className = 'aan-input';
        noteInput.placeholder = getText('placeholder');
        noteInput.rows = 2;
        noteInput.style.marginTop = "5px";

        const addBtn = document.createElement('button');
        addBtn.className = 'aan-btn aan-btn-primary';
        addBtn.textContent = `+ ${getText('add_note')}`;

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'aan-btn aan-btn-cancel';
        cancelBtn.textContent = getText('cancel');
        cancelBtn.style.display = 'none';

        cancelBtn.onclick = () => {
            editingNoteId = null;
            noteInput.value = '';
            addBtn.textContent = `+ ${getText('add_note')}`;
            addBtn.className = 'aan-btn aan-btn-primary';
            cancelBtn.style.display = 'none';
            selectedColor = 'blue';
            selectedShape = 'note';
            shapeSelect.value = selectedShape;
            colorSelect.value = selectedColor;
            updatePreview();
        };

        addBtn.onclick = () => {
            const text = noteInput.value.trim();
            if (!text) return;

            if (editingNoteId) {
                const notes = getNotes();
                const noteIndex = notes.findIndex(n => n.id === editingNoteId);
                if (noteIndex !== -1) {
                    notes[noteIndex].text = text;
                    notes[noteIndex].color = selectedColor;
                    notes[noteIndex].shape = selectedShape;
                    saveNotes(notes);
                    refreshLayer();
                }
                editingNoteId = null;
                noteInput.value = '';
                addBtn.textContent = `+ ${getText('add_note')}`;
                addBtn.className = 'aan-btn aan-btn-primary';
                cancelBtn.style.display = 'none';

                selectedColor = 'blue';
                selectedShape = 'note';
                shapeSelect.value = 'note';
                colorSelect.value = 'blue';
                updatePreview();
            } else {
                const centerObj = wmeSDK.Map.getMapCenter();
                const zoom = wmeSDK.Map.getZoomLevel();

                const newNote = {
                    id: Date.now(),
                    text: text,
                    lon: centerObj.lon, lat: centerObj.lat, zoom: zoom,
                    date: new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ar-IQ'),
                    color: selectedColor,
                    shape: selectedShape
                };
                const notes = getNotes(); notes.unshift(newNote);
                saveNotes(notes); refreshLayer(); noteInput.value = '';
            }
        };

        controlsDiv.appendChild(noteInput);
        controlsDiv.appendChild(addBtn);
        controlsDiv.appendChild(cancelBtn);
        mainDiv.appendChild(controlsDiv);

        const listContainer = document.createElement('div');
        listContainer.id = 'aan-list-container';
        listContainer.style.maxHeight = '350px';
        listContainer.style.overflowY = 'auto';
        mainDiv.appendChild(listContainer);

        const bottomDiv = document.createElement('div');
        bottomDiv.style.marginTop = "10px";
        bottomDiv.style.textAlign = "center";

        const createBtn = (txt, cls, act) => {
            const b = document.createElement('button'); b.className = cls; b.textContent = txt; b.onclick = act; return b;
        };

        const exportBtn = createBtn(getText('export'), 'aan-btn aan-btn-secondary', () => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(getNotes(), null, 2)], {type: "application/json"}));
            a.download = `wme_nots_backup_${Date.now()}.json`; a.click();
        });

        const importBtn = createBtn(getText('import'), 'aan-btn aan-btn-secondary', () => {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = e => {
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        const imported = JSON.parse(ev.target.result);
                        if (Array.isArray(imported)) {
                            const merged = [...imported, ...getNotes()].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
                            saveNotes(merged); refreshLayer(); alert("Done!");
                        }
                    } catch (err) { alert("Error"); }
                };
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        });
        importBtn.style.marginLeft = '2%';

        const clearBtn = createBtn(getText('clear'), 'aan-btn aan-btn-danger', () => {
            if(confirm(getText('confirm_clear'))) { saveNotes([]); refreshLayer(); }
        });

        bottomDiv.appendChild(exportBtn);
        bottomDiv.appendChild(importBtn);
        bottomDiv.appendChild(clearBtn);
        mainDiv.appendChild(bottomDiv);

        const versionDiv = document.createElement('div');
        versionDiv.style.textAlign = 'center';
        versionDiv.style.fontSize = '10px';
        versionDiv.style.color = '#888';
        versionDiv.style.marginTop = '5px';
        versionDiv.textContent = SCRIPT_VERSION;
        mainDiv.appendChild(versionDiv);

        container.appendChild(mainDiv);

        window.aanFillEditForm = (note) => {
            editingNoteId = note.id;
            noteInput.value = note.text;
            selectedColor = note.color || 'blue';
            selectedShape = note.shape || 'note';
            shapeSelect.value = selectedShape;
            colorSelect.value = selectedColor;
            updatePreview();
            addBtn.textContent = `💾 ${getText('save_edit')}`;
            addBtn.className = 'aan-btn aan-btn-success';
            cancelBtn.style.display = 'block';
            mainDiv.scrollTop = 0;
        };

        renderList(listContainer);
    }

    function renderList(container) {
        container.innerHTML = '';
        const notes = getNotes();
        if (notes.length === 0) { container.innerHTML = `<div style="text-align:center; color:#999; padding:10px;">-- فارغ --</div>`; return; }

        notes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'aan-note-item';
            const noteColor = COLORS[note.color] ? COLORS[note.color].hex : COLORS['blue'].hex;
            item.style.borderColor = noteColor;

            const textSpan = document.createElement('div');
            textSpan.className = 'aan-text-box';
            textSpan.textContent = note.text;
            textSpan.title = note.text;
            textSpan.onclick = () => { showPopupNote(note); };

            const jumpBtn = document.createElement('button');
            jumpBtn.className = 'aan-icon-btn';
            jumpBtn.innerHTML = `📍`;
            jumpBtn.title = getText('jump');
            jumpBtn.onclick = () => {
                wmeSDK.Map.setMapCenter({ lonLat: { lon: note.lon, lat: note.lat } });
                wmeSDK.Map.setZoomLevel({ zoomLevel: note.zoom });
            };

            const editBtn = document.createElement('button');
            editBtn.className = 'aan-text-btn';
            editBtn.textContent = getText('btn_edit_text');
            editBtn.onclick = () => {
                if(window.aanFillEditForm) window.aanFillEditForm(note);
            };

            const delBtn = document.createElement('button');
            delBtn.className = 'aan-text-btn delete';
            delBtn.textContent = getText('btn_delete_text');
            delBtn.onclick = () => {
                if (confirm(getText('confirm_delete'))) {
                    saveNotes(getNotes().filter(n => n.id !== note.id)); refreshLayer();
                    if (editingNoteId === note.id) document.querySelector('.aan-btn-cancel')?.click();
                }
            };

            const dateSpan = document.createElement('div');
            dateSpan.className = 'aan-date-box';
            dateSpan.textContent = note.date;

            item.appendChild(textSpan);
            item.appendChild(jumpBtn);
            item.appendChild(editBtn);
            item.appendChild(delBtn);
            item.appendChild(dateSpan);
            container.appendChild(item);
        });
    }

    bootstrap();
})();

// Abdullah Abbas