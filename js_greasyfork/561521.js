// ==UserScript==
// @name            Abdullah Abbas WME Suite
// @namespace       https://greasyfork.org/users/AbdullahAbbas
// @version         2026.01.15.17
// @description     حزمة أدوات عبد الله عباس الشاملة (أزرار الطرق + النسخ الذكي + تلوين التعديلات + الملاحظات + مدينة بديلة)
// @author          Abdullah Abbas
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license         GNU GPLv3
// @connect         sheets.googleapis.com
// @connect         greasyfork.org
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant           GM_xmlhttpRequest
// @grant           GM_addElement
// @grant           none
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @downloadURL https://update.greasyfork.org/scripts/561521/Abdullah%20Abbas%20WME%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/561521/Abdullah%20Abbas%20WME%20Suite.meta.js
// ==/UserScript==

/* global I18n, WazeWrap, bootstrap, W, OpenLayers */
/* eslint-disable max-classes-per-file */

(function() {
    'use strict';

    const SCRIPT_NAME = 'Abdullah Abbas WME Suite';
    const SCRIPT_VERSION = GM_info.script.version;
    const SETTINGS_STORE_NAME = 'AbdullahAbbas_WME_Suite_Settings_V25';

    // --- NOTES CONSTANTS ---
    const NOTES_STORE_KEY = "WME_ABDULLAH_NOTES_DATA";
    const NOTES_LOCK_STATE_KEY = "WME_ABDULLAH_NOTES_LOCKED";
    const NOTES_POPUP_STATE_KEY = "WME_ABDULLAH_NOTES_POPUP_STATE";

    let sdk;
    let highlightLayer = null; // For Coloring
    let notesLayer = null;     // For Notes
    let dragControl = null;    // For Notes
    let isMarkersLocked = true;
    let currentlyOpenNoteId = null;
    let editingNoteId = null;
    let selectedColor = 'red'; // Default start color
    let selectedShape = 'note';

    // Clipboard for Copy/Paste feature
    let savedAttributes = null;

    // --- UI STRINGS ---
    const UI_STRINGS = {
        'en': {
            dir: 'ltr', langName: 'English (US)',
            headerRoads: 'Button Settings',
            headerSmartCopy: 'Smart Copy Settings', headerColoring: 'Map Date Coloring Settings',
            headerNotes: 'Map Notes',
            roadTypeButtons: 'Road Type Buttons', lockLevelButtons: 'Quick Lock Buttons',
            utilButtons: 'Utility Buttons (Copy/Paste/AltCity)',
            smartCopyTitle: 'Smart Info Copy', enableSmartCopy: 'Enable Auto-Copy (New Segs)',
            copyCountry: 'Country/State', copyCity: 'City', copyStreet: 'Street Name',
            copyRoadType: 'Road Type', copySpeed: 'Speed Limit', copyLock: 'Lock Level',
            copyAltNames: 'Alternate Names', copyOther: 'Others (Level, Toll...)',
            coloringTitle: 'Map Date Coloring (All)', coloringApply: 'Apply Colors', coloringClear: 'Clear',
            daysLabel: 'Days', older: 'Older',
            roadTypes: { Fw: 'Fw', MH: 'MH', mH: 'mH', PS: 'PS', St: 'St', Rmp: 'Rmp', PR: 'PR', Pw: 'Pw', PLR: 'PLR', OR: 'OR', RR: 'RR', RT: 'RT' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "Add Note", delete: "Delete", jump: "Go", edit: "Edit", export: "Export", import: "Import", clear: "Clear All", placeholder: "Note text...",
            confirm_delete: "Delete?", confirm_clear: "Delete ALL?", lock_btn_to_unlock: "🔒 Unlock", lock_btn_to_lock: "🔓 Lock", save_edit: "Save", cancel: "Cancel",
            popup_title: "Note Details", popup_save: "💾 Save",
            s_note: "Note", s_pin: "Pin", s_star: "Star", s_alert: "Alert", s_check: "Check", s_cross: "Cross", s_question: "Question",
            c_red: "Red", c_orange: "Orange", c_yellow: "Yellow", c_green: "Green", c_blue: "Blue", c_indigo: "Indigo", c_violet: "Violet",
            btn_copy: "Copy", btn_paste: "Paste", btn_alt_city: "Alt City",
            feedback_done: "✔ Done"
        },
        'ar': {
            dir: 'rtl', langName: 'العربية (العراق)',
            headerRoads: 'إعدادات الأزرار',
            headerSmartCopy: 'إعدادات النسخ الذكي', headerColoring: 'إعدادات تلوين التعديلات',
            headerNotes: 'ملاحظات الخريطة',
            roadTypeButtons: 'أزرار أنواع الطرق', lockLevelButtons: 'أزرار القفل السريع',
            utilButtons: 'أزرار الأدوات (نسخ/لصق/مدينة بديلة)',
            smartCopyTitle: 'النسخ التلقائي للمعلومات', enableSmartCopy: 'تفعيل النسخ التلقائي (للجديد)',
            copyCountry: 'البلد / المحافظة', copyCity: 'المدينة', copyStreet: 'اسم الشارع',
            copyRoadType: 'نوع الطريق', copySpeed: 'السرعة', copyLock: 'القفل (Lock)',
            copyAltNames: 'الأسماء البديلة', copyOther: 'أخرى (المستوى، رسوم...)',
            coloringTitle: 'تلوين تاريخ التعديل (شامل)', coloringApply: 'تطبيق التلوين', coloringClear: 'مسح الألوان',
            daysLabel: 'يوم', older: 'أقدم',
            roadTypes: { Fw: 'طريق حرة', MH: 'سريع رئيسي', mH: 'سريع ثانوي', PS: 'شارع رئيسي', St: 'شارع', Rmp: 'منحدر', PR: 'طريق خاص', Pw: 'شارع ضيق', PLR: 'موقف', OR: 'غير معبد', RR: 'سكة حديد', RT: 'مدرج مطار' },
            locks: { L1: 'L 1', L2: 'L 2', L3: 'L 3', L4: 'L 4', L5: 'L 5', L6: 'L 6' },
            add_note: "إضافة الملاحظة", delete: "حذف", jump: "اذهب", edit: "تعديل", export: "تصدير", import: "استيراد", clear: "مسح الكل", placeholder: "نص الملاحظة...",
            confirm_delete: "حذف؟", confirm_clear: "حذف الجميع؟", lock_btn_to_unlock: "🔒 تحريك", lock_btn_to_lock: "🔓 تثبيت", save_edit: "حفظ التعديل", cancel: "إلغاء",
            popup_title: "تفاصيل الملاحظة", popup_save: "💾 حفظ",
            s_note: "ملاحظة", s_pin: "دبوس", s_star: "نجمة", s_alert: "تنبيه", s_check: "صح", s_cross: "خطأ", s_question: "سؤال",
            c_red: "أحمر", c_orange: "برتقالي", c_yellow: "أصفر", c_green: "أخضر", c_blue: "أزرق", c_indigo: "نيلي", c_violet: "بنفسجي",
            btn_copy: "نسخ خصائص", btn_paste: "لصق خصائص", btn_alt_city: "مدينة بديلة",
            feedback_done: "✔ تم"
        },
        'ckb': {
            dir: 'rtl', langName: 'کوردی (سۆرانی)',
            headerRoads: 'ڕێکخستنی دوگمەکان',
            headerSmartCopy: 'ڕێکخستنی کۆپی زیرەک', headerColoring: 'ڕێکخستنی ڕەنگکردن',
            headerNotes: 'تێبینیەکانی نەخشە',
            roadTypeButtons: 'دوگمەکانی ڕێگا', lockLevelButtons: 'دوگمەکانی قوفڵ',
            utilButtons: 'دوگمەکانی ئامراز (کۆپی/لکاندن/شاری جێگرەوە)',
            smartCopyTitle: 'کۆپیکردنی زانیاری زیرەک', enableSmartCopy: 'چالاککردنی کۆپی (بۆ نوێ)',
            copyCountry: 'وڵات / پارێزگا', copyCity: 'شار', copyStreet: 'ناوی شەقام',
            copyRoadType: 'جۆری ڕێگا', copySpeed: 'خێرایی', copyLock: 'قوفڵ (Lock)',
            copyAltNames: 'ناوی جێگرەوە', copyOther: 'زانیارییەکانی تر',
            coloringTitle: 'ڕەنگکردنی مێژووی دەستکاری', coloringApply: 'جێبەجێکردن', coloringClear: 'پاککردنەوە',
            daysLabel: 'ڕۆژ', older: 'کۆنتر',
            roadTypes: { Fw: 'ڕێگای خێرا', MH: 'خێرای سەرەکی', mH: 'خێرای لاوەکی', PS: 'شەقامی سەرەکی', St: 'شەقام', Rmp: 'رامپ', PR: 'تایبەت', Pw: 'کۆڵان', PLR: 'پارکینگ', OR: 'ڕێگای خۆڵ', RR: 'هێڵی ئاسن', RT: 'فڕگە' },
            locks: { L1: 'L ١', L2: 'L ٢', L3: 'L ٣', L4: 'L ٤', L5: 'L ٥', L6: 'L ٦' },
            add_note: "زیادکردن", delete: "سڕینەوە", jump: "بڕۆ", edit: "دەستکاری", export: "هەناردە", import: "هاوردە", clear: "سڕینەوەی گشت", placeholder: "دەق...",
            confirm_delete: "سڕینەوە؟", confirm_clear: "سڕینەوەی هەموو؟", lock_btn_to_unlock: "🔒 جوڵاندن", lock_btn_to_lock: "🔓 جێگیر", save_edit: "تۆمارکردن", cancel: "پاشگەزبوون",
            popup_title: "وردەکاری", popup_save: "💾 تۆمارکردن",
            s_note: "تێبینی", s_pin: "پین", s_star: "ئەستێرە", s_alert: "ئاگادارکردنەوە", s_check: "ڕاست", s_cross: "هەڵە", s_question: "پرسیار",
            c_red: "سوور", c_orange: "پرتەقاڵی", c_yellow: "زەرد", c_green: "سەوز", c_blue: "شین", c_indigo: "نیلی", c_violet: "مۆر",
            btn_copy: "کۆپی تایبەتمەندی", btn_paste: "لکاندنی تایبەتمەندی", btn_alt_city: "شاری جێگرەوە",
            feedback_done: "✔"
        },
        'kmr': {
            dir: 'ltr', langName: 'Kurdî (Kurmancî)',
            headerRoads: 'Mîhengên Bişkokan',
            headerSmartCopy: 'Mîhengên Kopîkirina Baqil', headerColoring: 'Mîhengên Rengkirinê',
            headerNotes: 'Têbiniyên Nexşeyê',
            roadTypeButtons: 'Bişkokên Rêyan', lockLevelButtons: 'Bişkokên Kilîtan',
            utilButtons: 'Bişkokên Amûran',
            smartCopyTitle: 'Kopîkirina Agahiyên Baqil', enableSmartCopy: 'Kopîkirina Otomatîk (Nû)',
            copyCountry: 'Welat / Herêm', copyCity: 'Bajar', copyStreet: 'Navê Kolanê',
            copyRoadType: 'Cûreyê Rê', copySpeed: 'Lez', copyLock: 'Astê Kilîtê',
            copyAltNames: 'Navên Alternatîf', copyOther: 'Yên Din (Ast, Baca Rê...)',
            coloringTitle: 'Rengkirina Dîroka Guherandinê', coloringApply: 'Bicîanîn', coloringClear: 'Paqij Bike',
            daysLabel: 'Roj', older: 'Kevintir',
            roadTypes: { Fw: 'Rêya Hêrs', MH: 'Rêya Sereke', mH: 'Rêya Navîn', PS: 'Kolana Sereke', St: 'Kolan', Rmp: 'Ramp', PR: 'Taybet', Pw: 'Kolan', PLR: 'Park', OR: 'Rêya Axê', RR: 'Rêhesin', RT: 'Balafirgeh' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "Zêde Bike", delete: "Jêbirin", jump: "Biçe", edit: "Biguherîne", export: "Derxistin", import: "Anîn", clear: "Hemûyan Paqij Bike", placeholder: "Nivîs...",
            confirm_delete: "Jêbirin?", confirm_clear: "Hemûyan Jêbibe?", lock_btn_to_unlock: "🔒 Veke", lock_btn_to_lock: "🔓 Kilît Bike", save_edit: "Tomar Bike", cancel: "Betal Bike",
            popup_title: "Agahî", popup_save: "💾 Tomar Bike",
            s_note: "Têbinî", s_pin: "Pîn", s_star: "Stêrk", s_alert: "Hişyarî", s_check: "Rast", s_cross: "Xet", s_question: "Pirs",
            c_red: "Sor", c_orange: "Porteqalî", c_yellow: "Zer", c_green: "Kesk", c_blue: "Şîn", c_indigo: "Şîna Tarî", c_violet: "Binevşî",
            btn_copy: "Kopîkirin", btn_paste: "Pêvekirin", btn_alt_city: "Bajarê Alternatîf",
            feedback_done: "✔"
        },
        'es': {
            dir: 'ltr', langName: 'Español',
            headerRoads: 'Configuración de Botones',
            headerSmartCopy: 'Copia Inteligente', headerColoring: 'Coloreado por Fecha',
            headerNotes: 'Notas del Mapa',
            roadTypeButtons: 'Botones de Carretera', lockLevelButtons: 'Botones de Bloqueo',
            utilButtons: 'Botones de Utilidad',
            smartCopyTitle: 'Copia de Información Inteligente', enableSmartCopy: 'Auto-Copia (Nuevos Segmentos)',
            copyCountry: 'País/Estado', copyCity: 'Ciudad', copyStreet: 'Calle',
            copyRoadType: 'Tipo de Vía', copySpeed: 'Límite de Velocidad', copyLock: 'Nivel de Bloqueo',
            copyAltNames: 'Nombres Alternativos', copyOther: 'Otros (Nivel, Peaje...)',
            coloringTitle: 'Coloreado del Mapa (Todo)', coloringApply: 'Aplicar', coloringClear: 'Limpiar',
            daysLabel: 'Días', older: 'Antiguo',
            roadTypes: { Fw: 'Autopista', MH: 'C. Principal', mH: 'C. Secundaria', PS: 'Calle P.', St: 'Calle', Rmp: 'Rampa', PR: 'Privada', Pw: 'Estrecha', PLR: 'Parking', OR: 'Sin Pav.', RR: 'Vía Férrea', RT: 'Pista' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "Añadir Nota", delete: "Borrar", jump: "Ir", edit: "Editar", export: "Exportar", import: "Importar", clear: "Borrar Todo", placeholder: "Texto...",
            confirm_delete: "¿Borrar?", confirm_clear: "¿Borrar TODO?", lock_btn_to_unlock: "🔒 Mover", lock_btn_to_lock: "🔓 Fijar", save_edit: "Guardar", cancel: "Cancelar",
            popup_title: "Detalles", popup_save: "💾 Guardar",
            s_note: "Nota", s_pin: "Pin", s_star: "Estrella", s_alert: "Alerta", s_check: "Check", s_cross: "Cruz", s_question: "Pregunta",
            c_red: "Rojo", c_orange: "Naranja", c_yellow: "Amarillo", c_green: "Verde", c_blue: "Azul", c_indigo: "Índigo", c_violet: "Violeta",
            btn_copy: "Copiar Atr", btn_paste: "Pegar Atr", btn_alt_city: "Ciudad Alt",
            feedback_done: "✔"
        },
        'fr': {
            dir: 'ltr', langName: 'Français',
            headerRoads: 'Paramètres des Boutons',
            headerSmartCopy: 'Copie Intelligente', headerColoring: 'Coloration par Date',
            headerNotes: 'Notes de Carte',
            roadTypeButtons: 'Boutons Route', lockLevelButtons: 'Boutons Verrouillage',
            utilButtons: 'Boutons Utilitaires',
            smartCopyTitle: 'Copie Info', enableSmartCopy: 'Auto-Copie (Nouveaux)',
            copyCountry: 'Pays/État', copyCity: 'Ville', copyStreet: 'Rue',
            copyRoadType: 'Type de Route', copySpeed: 'Vitesse', copyLock: 'Verrouillage',
            copyAltNames: 'Noms Alternatifs', copyOther: 'Autres (Niveau, Péage...)',
            coloringTitle: 'Coloration Carte', coloringApply: 'Appliquer', coloringClear: 'Effacer',
            daysLabel: 'Jours', older: 'Vieux',
            roadTypes: { Fw: 'Autoroute', MH: 'Route Maj.', mH: 'Route Min.', PS: 'Rue Princ.', St: 'Rue', Rmp: 'Bretelle', PR: 'Privée', Pw: 'Allée', PLR: 'Parking', OR: 'Non-revêtue', RR: 'Ferrée', RT: 'Piste' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "Ajouter", delete: "Supprimer", jump: "Aller", edit: "Éditer", export: "Exporter", import: "Importer", clear: "Tout Effacer", placeholder: "Texte...",
            confirm_delete: "Supprimer?", confirm_clear: "Tout supprimer?", lock_btn_to_unlock: "🔒 Déverrouiller", lock_btn_to_lock: "🔓 Verrouiller", save_edit: "Sauver", cancel: "Annuler",
            popup_title: "Détails", popup_save: "💾 Sauver",
            s_note: "Note", s_pin: "Épingle", s_star: "Étoile", s_alert: "Alerte", s_check: "Vrai", s_cross: "Faux", s_question: "Question",
            c_red: "Rouge", c_orange: "Orange", c_yellow: "Jaune", c_green: "Vert", c_blue: "Bleu", c_indigo: "Indigo", c_violet: "Violet",
            btn_copy: "Copier Attr", btn_paste: "Coller Attr", btn_alt_city: "Ville Alt",
            feedback_done: "✔"
        },
        'ru': {
            dir: 'ltr', langName: 'Русский',
            headerRoads: 'Настройки Кнопок',
            headerSmartCopy: 'Умное Копирование', headerColoring: 'Раскраска по Дате',
            headerNotes: 'Заметки Карты',
            roadTypeButtons: 'Кнопки Дорог', lockLevelButtons: 'Кнопки Блокировки',
            utilButtons: 'Утилиты',
            smartCopyTitle: 'Копирование Инфо', enableSmartCopy: 'Авто-Копия (Новые)',
            copyCountry: 'Страна', copyCity: 'Город', copyStreet: 'Улица',
            copyRoadType: 'Тип Дороги', copySpeed: 'Скорость', copyLock: 'Блокировка',
            copyAltNames: 'Альт. Имена', copyOther: 'Другое (Уровень...)',
            coloringTitle: 'Раскраска Карты', coloringApply: 'Применить', coloringClear: 'Очистить',
            daysLabel: 'Дней', older: 'Старые',
            roadTypes: { Fw: 'Магистраль', MH: 'Осн. шоссе', mH: 'Втор. шоссе', PS: 'Осн. улица', St: 'Улица', Rmp: 'Съезд', PR: 'Частная', Pw: 'Проезд', PLR: 'Парковка', OR: 'Грунтовка', RR: 'Ж/Д', RT: 'Взлетная' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "Добавить", delete: "Удалить", jump: "Перейти", edit: "Изменить", export: "Экспорт", import: "Импорт", clear: "Очистить", placeholder: "Текст...",
            confirm_delete: "Удалить?", confirm_clear: "Удалить ВСЕ?", lock_btn_to_unlock: "🔒 Разблок.", lock_btn_to_lock: "🔓 Блок.", save_edit: "Сохранить", cancel: "Отмена",
            popup_title: "Детали", popup_save: "💾 Сохр.",
            s_note: "Заметка", s_pin: "Пин", s_star: "Звезда", s_alert: "Тревога", s_check: "Галочка", s_cross: "Крест", s_question: "Вопрос",
            c_red: "Красный", c_orange: "Оранжевый", c_yellow: "Желтый", c_green: "Зеленый", c_blue: "Синий", c_indigo: "Индиго", c_violet: "Фиолетовый",
            btn_copy: "Копировать", btn_paste: "Вставить", btn_alt_city: "Альт. Город",
            feedback_done: "✔"
        },
        'he': {
            dir: 'rtl', langName: 'עברית',
            headerRoads: 'הגדרות כפתורים',
            headerSmartCopy: 'העתקה חכמה', headerColoring: 'צביעה לפי תאריך',
            headerNotes: 'הערות מפה',
            roadTypeButtons: 'כפתורי סוג כביש', lockLevelButtons: 'כפתורי נעילה',
            utilButtons: 'כפתורי שירות',
            smartCopyTitle: 'העתקת מידע חכמה', enableSmartCopy: 'העתקה אוטומטית (חדשים)',
            copyCountry: 'מדינה/מחוז', copyCity: 'עיר', copyStreet: 'שם רחוב',
            copyRoadType: 'סוג כביש', copySpeed: 'מהירות', copyLock: 'רמת נעילה',
            copyAltNames: 'שמות חלופיים', copyOther: 'אחר (מפלס, אגרה...)',
            coloringTitle: 'צביעת היסטוריה (הכל)', coloringApply: 'החל צבעים', coloringClear: 'נקה',
            daysLabel: 'ימים', older: 'ישן',
            roadTypes: { Fw: 'מהיר', MH: 'בין-עירוני', mH: 'אזורי', PS: 'ראשי', St: 'רחוב', Rmp: 'יציאה', PR: 'פרטי', Pw: 'צר', PLR: 'חניון', OR: 'עפר', RR: 'רכבת', RT: 'מסלול' },
            locks: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6' },
            add_note: "הוסף הערה", delete: "מחק", jump: "עבור", edit: "ערוך", export: "ייצוא", import: "ייבוא", clear: "נקה הכל", placeholder: "טקסט ההערה...",
            confirm_delete: "למחוק?", confirm_clear: "למחוק הכל?", lock_btn_to_unlock: "🔒 הזז", lock_btn_to_lock: "🔓 נעל", save_edit: "שמור", cancel: "ביטול",
            popup_title: "פרטים", popup_save: "💾 שמור",
            s_note: "הערה", s_pin: "נעץ", s_star: "כוכב", s_alert: "התראה", s_check: "וי", s_cross: "איקס", s_question: "שאלה",
            c_red: "אדום", c_orange: "כתום", c_yellow: "צהוב", c_green: "ירוק", c_blue: "כחול", c_indigo: "אינדיגו", c_violet: "סגול",
            btn_copy: "העתק", btn_paste: "הדבק", btn_alt_city: "עיר חלופית",
            feedback_done: "✔"
        }
    };

    // --- SHAPES & COLORS ---
    const SHAPES = {
        note: { path: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" },
        pin: { path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
        star: { path: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" },
        alert: { path: "M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" },
        check: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
        cross: { path: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" },
        question: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" }
    };

    const COLORS = {
        red:    { hex: "#FF0000" }, orange: { hex: "#FFA500" }, yellow: { hex: "#FFFF00" },
        green:  { hex: "#008000" }, blue:   { hex: "#0000FF" }, indigo: { hex: "#4B0082" }, violet: { hex: "#EE82EE" }
    };

    // --- MAIN SUITE LOGIC ---
    async function runSuiteModules() {
        const roadTypeDropdownSelector = 'div[class="road-type-select"]';
        const RENDER_ORDER = ['St', 'PS', 'mH', 'MH', 'Fw', 'Rmp', 'PLR', 'Pw', 'PR', 'OR', 'RT', 'RR'];
        const wmeRoadType = { ALLEY: 22, FERRY: 15, FREEWAY: 3, MAJOR_HIGHWAY: 6, MINOR_HIGHWAY: 7, OFF_ROAD: 8, PARKING_LOT_ROAD: 20, PEDESTRIAN_BOARDWALK: 10, PRIMARY_STREET: 2, PRIVATE_ROAD: 17, RAILROAD: 18, RAMP: 4, RUNWAY_TAXIWAY: 19, STAIRWAY: 16, STREET: 1, WALKING_TRAIL: 5, WALKWAY: 9 };
        const roadTypeSettings = {
            Fw: { id: wmeRoadType.FREEWAY, wmeColor: '#bd5ab6' }, MH: { id: wmeRoadType.MAJOR_HIGHWAY, wmeColor: '#45b8d1' }, mH: { id: wmeRoadType.MINOR_HIGHWAY, wmeColor: '#69bf88' },
            PS: { id: wmeRoadType.PRIMARY_STREET, wmeColor: '#f0ea58' }, St: { id: wmeRoadType.STREET, wmeColor: '#ffffff' }, Rmp: { id: wmeRoadType.RAMP, wmeColor: '#b0b0b0' },
            PR: { id: wmeRoadType.PRIVATE_ROAD, wmeColor: '#beba6c' }, Pw: { id: wmeRoadType.ALLEY, wmeColor: '#64799a' }, PLR: { id: wmeRoadType.PARKING_LOT_ROAD, wmeColor: '#ababab' },
            OR: { id: wmeRoadType.OFF_ROAD, wmeColor: '#867342' }, RR: { id: wmeRoadType.RAILROAD, wmeColor: '#c62925' }, RT: { id: wmeRoadType.RUNWAY_TAXIWAY, wmeColor: '#00ff00' }
        };
        const lockSettings = [
            { rank: 0, label: 'L1', color: '#ffffff', textColor: '#000', borderColor: '#ccc' }, { rank: 1, label: 'L2', color: '#f0ea58', textColor: '#000', borderColor: '#d4ce46' },
            { rank: 2, label: 'L3', color: '#69bf88', textColor: '#000', borderColor: '#57a372' }, { rank: 3, label: 'L4', color: '#45b8d1', textColor: '#000', borderColor: '#3aa0b8' },
            { rank: 4, label: 'L5', color: '#bd5ab6', textColor: '#fff', borderColor: '#a34d9d' }, { rank: 5, label: 'L6', color: '#d50000', textColor: '#fff', borderColor: '#b71c1c' }
        ];
        const colorRangesDef = [
            { id: '1d', defaultDays: 1, defaultColor: '#00ff00' }, { id: '7d', defaultDays: 7, defaultColor: '#7fff00' },
            { id: '15d', defaultDays: 15, defaultColor: '#ccff00' }, { id: '30d', defaultDays: 30, defaultColor: '#ffff00' },
            { id: '3m', defaultDays: 90, defaultColor: '#ffcc00' }, { id: '6m', defaultDays: 180, defaultColor: '#ffa500' },
            { id: '1y', defaultDays: 365, defaultColor: '#ff4500' }, { id: 'old', defaultDays: 99999, defaultColor: '#ff0000' }
        ];

        let _settings = {};
        let trans = UI_STRINGS['en'];
        const processedSegments = new Set();

        function loadSettingsFromStorage() {
            let loadedSettings = {};
            try { loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME)) || {}; } catch(e) { console.error('Error loading settings', e); }
            const defaultSettings = {
                lastVersion: SCRIPT_VERSION, preferredLocale: 'en',
                ui_road_collapsed: true, ui_smartcopy_collapsed: true, ui_coloring_collapsed: true, ui_notes_collapsed: true,
                roadButtons: true, roadTypeButtons: [...RENDER_ORDER], lockButtons: true,
                utilButtons: true,
                enableSmartCopy: true, inheritCountry: true, inheritCity: true, inheritStreet: true, inheritRoadType: true, inheritSpeed: true, inheritLock: true, inheritAltNames: true, inheritOther: true,
                coloringEnabled: {}, coloringColors: {}, coloringDays: {}, shortcuts: {}
            };
            colorRangesDef.forEach(r => {
                if(defaultSettings.coloringEnabled[r.id] === undefined) defaultSettings.coloringEnabled[r.id] = false;
                if(defaultSettings.coloringColors[r.id] === undefined) defaultSettings.coloringColors[r.id] = r.defaultColor;
                if(defaultSettings.coloringDays[r.id] === undefined) defaultSettings.coloringDays[r.id] = r.defaultDays;
            });
            _settings = { ...defaultSettings, ...loadedSettings };
            _settings.coloringEnabled = { ...defaultSettings.coloringEnabled, ...(_settings.coloringEnabled || {}) };
            _settings.coloringColors = { ...defaultSettings.coloringColors, ...(_settings.coloringColors || {}) };
            _settings.coloringDays = { ...defaultSettings.coloringDays, ...(_settings.coloringDays || {}) };

            const savedLockState = localStorage.getItem(NOTES_LOCK_STATE_KEY);
            if (savedLockState !== null) isMarkersLocked = (savedLockState === 'true');

            const langCode = _settings.preferredLocale || 'en';
            trans = { ...UI_STRINGS['en'], ...UI_STRINGS[langCode] };
            if (!trans.dir) trans.dir = (langCode === 'en' ? 'ltr' : 'rtl');
        }

        function saveSettingsToStorage() {
            const settings = {
                lastVersion: SCRIPT_VERSION, preferredLocale: _settings.preferredLocale,
                ui_road_collapsed: _settings.ui_road_collapsed, ui_smartcopy_collapsed: _settings.ui_smartcopy_collapsed, ui_coloring_collapsed: _settings.ui_coloring_collapsed, ui_notes_collapsed: _settings.ui_notes_collapsed,
                roadButtons: _settings.roadButtons, roadTypeButtons: _settings.roadTypeButtons, lockButtons: _settings.lockButtons,
                utilButtons: _settings.utilButtons,
                enableSmartCopy: _settings.enableSmartCopy, inheritCountry: _settings.inheritCountry, inheritCity: _settings.inheritCity, inheritStreet: _settings.inheritStreet,
                inheritRoadType: _settings.inheritRoadType, inheritSpeed: _settings.inheritSpeed, inheritLock: _settings.inheritLock, inheritAltNames: _settings.inheritAltNames, inheritOther: _settings.inheritOther,
                coloringEnabled: _settings.coloringEnabled, coloringColors: _settings.coloringColors, coloringDays: _settings.coloringDays, shortcuts: {}
            };
            if(sdk && sdk.Shortcuts) sdk.Shortcuts.getAllShortcuts().forEach(shortcut => { settings.shortcuts[shortcut.shortcutId] = shortcut.shortcutKeys; });
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        }

        // --- HELPER FUNCTIONS FOR SHADOW DOM (Copied from WME ClickSaver) ---
        function waitForElem(selector) {
            return new Promise((resolve, reject) => {
                function checkIt(tries = 0) {
                    if (tries < 150) {
                        const elem = document.querySelector(selector);
                        setTimeout(() => {
                            if (!elem) {
                                checkIt(++tries);
                            } else {
                                resolve(elem);
                            }
                        }, 20);
                    } else {
                        reject(new Error(`Element was not found: ${selector}`));
                    }
                }
                checkIt();
            });
        }

        async function waitForShadowElem(parentElemSelector, shadowElemSelectors) {
            const parentElem = await waitForElem(parentElemSelector);
            return new Promise((resolve, reject) => {
                shadowElemSelectors.forEach((shadowElemSelector, idx) => {
                    function checkIt(parent, tries = 0) {
                        if (tries < 150) {
                            const shadowElem = parent.shadowRoot.querySelector(shadowElemSelector);
                            setTimeout(() => {
                                if (!shadowElem) {
                                    checkIt(parent, ++tries);
                                } else if (idx === shadowElemSelectors.length - 1) {
                                    resolve({ shadowElem, parentElem });
                                } else {
                                    checkIt(shadowElem, 0);
                                }
                            }, 20);
                        } else {
                            reject(new Error(`Shadow element was not found: ${shadowElemSelector}`));
                        }
                    }
                    checkIt(parentElem);
                });
            });
        }

        // --- GLOBAL EVENT DELEGATION FOR STABLE CLICKS ---
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id) {
                if (e.target.id === 'aan-btn-copy') {
                    copySegmentAttributes(e);
                } else if (e.target.id === 'aan-btn-paste') {
                    pasteSegmentAttributes(e);
                } else if (e.target.id === 'aan-btn-alt-city') {
                    onAddAltCityButtonClick(e);
                }
            }
        });

        function getOrCreateStreet(streetName, cityId) {
            return sdk.DataModel.Streets.getStreet({ streetName, cityId }) || sdk.DataModel.Streets.addStreet({ streetName, cityId });
        }

        function flashButton(btnElement, originalText) {
            if(!btnElement) return;
            const $btn = $(btnElement);
            $btn.text(trans.feedback_done || "✔");
            $btn.css('background-color', '#4CAF50');
            $btn.css('color', '#fff');
            setTimeout(() => {
                $btn.text(originalText);
                $btn.css('background-color', '');
                $btn.css('color', '');
            }, 1000);
        }

        // 1. Copy Handler
        function copySegmentAttributes(e) {
            try {
                const sel = sdk.Editing.getSelection();
                if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;

                const seg = sdk.DataModel.Segments.getById({ segmentId: sel.ids[0] });
                const addr = sdk.DataModel.Segments.getAddress({ segmentId: sel.ids[0] });

                if (!seg) return;

                savedAttributes = {
                    roadType: seg.roadType,
                    lockRank: seg.lockRank || 0,
                    fwdSpeedLimit: seg.fwdSpeedLimit,
                    revSpeedLimit: seg.revSpeedLimit,
                    level: seg.level,
                    isToll: seg.isToll,
                    isUnpaved: seg.isUnpaved,
                    tunnel: seg.tunnel,
                    address: {
                        countryID: addr?.country?.id,
                        stateID: addr?.state?.id,
                        cityName: addr?.city?.name,
                        streetName: addr?.street?.name
                    }
                };

                if(e && e.target) flashButton(e.target, trans.btn_copy);
            } catch(err) { console.error("AA Suite: Copy Failed", err); }
        }

        // 2. Paste Handler
        function pasteSegmentAttributes(e) {
            try {
                if (!savedAttributes) return;
                const sel = sdk.Editing.getSelection();
                if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;

                sel.ids.forEach(id => {
                    const update = {
                        segmentId: id,
                        roadType: savedAttributes.roadType,
                        lockRank: savedAttributes.lockRank,
                        level: savedAttributes.level,
                        isToll: savedAttributes.isToll,
                        isUnpaved: savedAttributes.isUnpaved,
                        tunnel: savedAttributes.tunnel
                    };

                    if (savedAttributes.fwdSpeedLimit !== undefined) update.fwdSpeedLimit = savedAttributes.fwdSpeedLimit;
                    if (savedAttributes.revSpeedLimit !== undefined) update.revSpeedLimit = savedAttributes.revSpeedLimit;

                    sdk.DataModel.Segments.updateSegment(update);

                    if (savedAttributes.address) {
                        const cp = savedAttributes.address;
                        if (cp.countryID) {
                             const cityProps = { cityName: cp.cityName || '', stateId: cp.stateID, countryId: cp.countryID };
                             const existingCity = sdk.DataModel.Cities.getCity(cityProps);
                             let cityId = existingCity ? existingCity.id : sdk.DataModel.Cities.addCity(cityProps).id;

                             const primaryStreetId = getOrCreateStreet(cp.streetName || '', cityId).id;
                             sdk.DataModel.Segments.updateAddress({ segmentId: id, primaryStreetId });
                        }
                    }
                });
                if(e && e.target) flashButton(e.target, trans.btn_paste);
            } catch(err) { console.error("AA Suite: Paste Failed", err); }
        }

        // 3. ALT CITY HANDLER (SMART CLICK)
        async function onAddAltCityButtonClick(e) {
            try {
                const sel = sdk.Editing.getSelection();
                if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;

                const segmentId = sel.ids[0];
                const addr = sdk.DataModel.Segments.getAddress({ segmentId });

                // 1. Try to find the button directly
                let nativeBtn = document.querySelector('wz-button.add-alt-street-btn');

                // 2. If not found, try to open the address editor first
                if (!nativeBtn) {
                    const addressBox = document.querySelector('#segment-edit-general .address-edit');
                    if (addressBox) {
                        addressBox.click();
                        // Wait for the button to render
                        try {
                            nativeBtn = await waitForElem('wz-button.add-alt-street-btn');
                        } catch (timeout) {
                            console.warn("AA Suite: Timed out waiting for add-alt-street-btn");
                        }
                    }
                }

                if (nativeBtn) {
                    nativeBtn.click();

                    // Wait for inputs
                    await waitForElem('wz-autocomplete.alt-street-name');

                    // Set street (Trigger input events for framework detection)
                    let result = await waitForShadowElem('wz-autocomplete.alt-street-name', ['wz-text-input']);
                    result.shadowElem.focus();
                    result.shadowElem.value = addr?.street?.name ?? '';
                    result.shadowElem.dispatchEvent(new Event('input', { bubbles: true }));

                    // Clear city
                    result = await waitForShadowElem('wz-autocomplete.alt-city-name', ['wz-text-input']);
                    result.shadowElem.focus();
                    result.shadowElem.value = '';
                    result.shadowElem.dispatchEvent(new Event('input', { bubbles: true }));

                    if(e && e.target) flashButton(e.target, trans.btn_alt_city);
                } else {
                    console.log("AA Suite: Could not access 'Add Alt Street' button.");
                }

            } catch (err) {
                console.error("AA Suite: Alt City Failed", err);
            }
        }

        // --- SMART COPY FUNCTIONS ---
        function getNeighbors(id) {
            const a = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: false }) || [];
            const b = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: true }) || [];
            return [...a, ...b].map(s => s.id);
        }
        function isLikelyNew(id, seg) {
            if (typeof id === 'number' && id < 0) return true;
            if (typeof id === 'string' && /^tmp|^neg/i.test(id)) return true;
            if (seg?.isNew || seg?.isCreated) return true;
            const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
            return (!addr || addr.isEmpty === true);
        }
        function firstNeighborWithData(id) {
            const seen = new Set([id]); const q = [id]; let safetyCounter = 0; const MAX_SEARCH = 50;
            const hasData = (sid) => {
                try {
                    const a = sdk.DataModel.Segments.getAddress({ segmentId: sid });
                    if (a && !a.isEmpty) return true;
                    const s = sdk.DataModel.Segments.getById({ segmentId: sid });
                    return (s && s.roadType);
                } catch { return false; }
            };
            while (q.length) {
                if (safetyCounter++ > MAX_SEARCH) break;
                const cur = q.shift(); const ns = getNeighbors(cur);
                const donorId = ns.find(hasData);
                if (donorId) return donorId;
                ns.forEach(n => { if (!seen.has(n)) { seen.add(n); q.push(n); } });
            }
            return null;
        }
        function executeSmartCopy(id) {
            const donorId = firstNeighborWithData(id);
            if (!donorId) return false;
            const targetSeg = sdk.DataModel.Segments.getById({ segmentId: id });
            const donorSeg = sdk.DataModel.Segments.getById({ segmentId: donorId });
            const targetAddr = sdk.DataModel.Segments.getAddress({ segmentId: id });
            const donorAddr = sdk.DataModel.Segments.getAddress({ segmentId: donorId });
            let somethingChanged = false;

            if (_settings.inheritCountry || _settings.inheritCity || _settings.inheritStreet) {
                const wantCountry = _settings.inheritCountry; const wantCity = _settings.inheritCity; const wantStreet = _settings.inheritStreet;
                const curCityId = targetAddr?.city?.id ?? null; const curStreetName = targetAddr?.street?.name;

                if (curCityId == null || (wantStreet && !curStreetName)) {
                    const cityProps = {
                        cityName: (wantCity && donorAddr.city && !donorAddr.city.isEmpty) ? donorAddr.city.name : (targetAddr.city?.name ?? ''),
                        stateId:  (wantCountry && donorAddr.state)   ? donorAddr.state.id   : (targetAddr.state?.id   ?? undefined),
                        countryId:(wantCountry && donorAddr.country) ? donorAddr.country.id : (targetAddr.country?.id ?? undefined)
                    };
                    if (!wantCity && wantCountry) cityProps.cityName = '';
                    let cityId = sdk.DataModel.Cities.getCity(cityProps)?.id;
                    if (cityId == null) cityId = sdk.DataModel.Cities.addCity(cityProps).id;
                    const streetName = (wantStreet && donorAddr?.street?.name) ? donorAddr.street.name : (targetAddr.street?.name ?? '');
                    const primaryStreetId = getOrCreateStreet(streetName, cityId).id;
                    try { sdk.DataModel.Segments.updateAddress({ segmentId: id, primaryStreetId }); somethingChanged = true; } catch (e) { console.error('Addr copy fail', e); }
                }
            }
            if (_settings.inheritRoadType && targetSeg.roadType !== donorSeg.roadType) { sdk.DataModel.Segments.updateSegment({ segmentId: id, roadType: donorSeg.roadType }); somethingChanged = true; }
            if (_settings.inheritSpeed) {
                const upd = { segmentId: id }; let sc = false;
                if (donorSeg.fwdSpeedLimit && !targetSeg.fwdSpeedLimit) { upd.fwdSpeedLimit = donorSeg.fwdSpeedLimit; sc = true; }
                if (donorSeg.revSpeedLimit && !targetSeg.revSpeedLimit) { upd.revSpeedLimit = donorSeg.revSpeedLimit; sc = true; }
                if (sc) { sdk.DataModel.Segments.updateSegment(upd); somethingChanged = true; }
            }
            if (_settings.inheritLock) {
                const dLock = (donorSeg.lockRank || 0); const tLock = (targetSeg.lockRank || 0);
                if (tLock < dLock) { sdk.DataModel.Segments.updateSegment({ segmentId: id, lockRank: dLock }); somethingChanged = true; }
            }
            if (_settings.inheritAltNames) {
                try {
                    const donorAlts = donorSeg.alternateStreetIds || [];
                    if (donorAlts.length > 0) { sdk.DataModel.Segments.updateSegment({ segmentId: id, alternateStreetIds: donorAlts }); somethingChanged = true; }
                } catch (e) {}
            }
            if (_settings.inheritOther) {
                const upd = { segmentId: id }; let sc = false;
                if (donorSeg.level !== targetSeg.level) { upd.level = donorSeg.level; sc = true; }
                if (donorSeg.isToll !== targetSeg.isToll) { upd.isToll = donorSeg.isToll; sc = true; }
                if (sc) { sdk.DataModel.Segments.updateSegment(upd); somethingChanged = true; }
            }
            return somethingChanged;
        }

        function runSmartCopyLogic() {
            if (!_settings.enableSmartCopy) return;
            const sel = sdk.Editing.getSelection();
            if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;
            sel.ids.forEach(id => {
                if (processedSegments.has(id)) return;
                const seg = sdk.DataModel.Segments.getById({ segmentId: id });
                if (!seg) return;
                if (isLikelyNew(id, seg)) { if (executeSmartCopy(id)) processedSegments.add(id); }
            });
        }

        // --- COLORING FUNCTIONS ---
        function applyMapColoring() {
            if (!highlightLayer) { highlightLayer = new OpenLayers.Layer.Vector("Abdullah_Gradient_Layer", { displayInLayerSwitcher: true, uniqueName: "Abdullah_Gradient_Layer" }); W.map.addLayer(highlightLayer); }
            highlightLayer.removeAllFeatures();
            let activeRanges = [];
            colorRangesDef.forEach(r => { if (_settings.coloringEnabled[r.id]) { activeRanges.push({ days: parseInt(_settings.coloringDays[r.id] || r.defaultDays), color: _settings.coloringColors[r.id] || r.defaultColor }); } });
            activeRanges.sort((a, b) => a.days - b.days);
            if (activeRanges.length === 0) { alert(trans.coloringTitle + ': يرجى تفعيل فترة زمنية واحدة على الأقل.'); return; }
            let allObjects = [];
            if(W.model.segments) allObjects.push(...W.model.segments.getObjectArray());
            if(W.model.venues) allObjects.push(...W.model.venues.getObjectArray());
            const featuresToAdd = []; const now = Date.now();
            allObjects.forEach(obj => {
                if (!obj.geometry || !obj.attributes || typeof obj.attributes.updatedOn === 'undefined') return;
                const updatedOn = obj.attributes.updatedOn; const diffDays = (now - updatedOn) / (1000 * 60 * 60 * 24);
                let selectedColor = null;
                for (let i = 0; i < activeRanges.length; i++) { if (diffDays <= activeRanges[i].days) { selectedColor = activeRanges[i].color; break; } }
                if (selectedColor) {
                    let style = {};
                    if(obj.geometry.CLASS_NAME.indexOf('LineString') !== -1) { style = { strokeColor: selectedColor, strokeOpacity: 0.7, strokeWidth: 6, strokeLinecap: "round" }; }
                    else { style = { fillColor: selectedColor, fillOpacity: 0.4, strokeColor: selectedColor, strokeWidth: 2, pointRadius: 10 }; }
                    featuresToAdd.push(new OpenLayers.Feature.Vector(obj.geometry.clone(), {}, style));
                }
            });
            if (featuresToAdd.length > 0) highlightLayer.addFeatures(featuresToAdd);
        }

        function clearMapColoring() { if (highlightLayer) highlightLayer.removeAllFeatures(); }

        // --- NOTES LOGIC & HELPERS ---
        function getSVGIcon(shapeKey, colorKey) {
            const shapeObj = SHAPES[shapeKey] || SHAPES['note']; const colorObj = COLORS[colorKey] || COLORS['red'];
            const path = shapeObj.path; const color = colorObj.hex; const stroke = (['yellow'].includes(colorKey)) ? '#555' : '#FFF';
            const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="${stroke}" stroke-width="1"><filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.4"/></filter><path d="${path}" filter="url(#shadow)" /></svg>`;
            return "data:image/svg+xml;base64," + btoa(svgString);
        }
        function getNotes() { try { return JSON.parse(localStorage.getItem(NOTES_STORE_KEY) || "[]"); } catch (e) { return []; } }
        function saveNotes(notes) { localStorage.setItem(NOTES_STORE_KEY, JSON.stringify(notes)); const listContainer = document.getElementById('aan-list-container'); if (listContainer) renderNotesList(listContainer); }
        function initNotesMapLayer() {
            if(notesLayer) return;
            const styleMap = new OpenLayers.StyleMap({
                'default': { externalGraphic: "${iconUrl}", graphicWidth: 32, graphicHeight: 32, graphicYOffset: -32, cursor: "pointer", label: "${label}", fontColor: "${labelColor}", fontSize: "16px", fontFamily: "Tahoma, Arial, sans-serif", fontWeight: "900", labelAlign: "cm", labelYOffset: -35, labelOutlineColor: "#ffffff", labelOutlineWidth: 4, graphicZIndex: 999999 },
                'select': { cursor: "move", graphicOpacity: 0.8 }
            });
            notesLayer = new OpenLayers.Layer.Vector("Abdullah Nots", { displayInLayerSwitcher: true, uniqueName: "abdullah_nots_layer", styleMap: styleMap, rendererOptions: { zIndexing: true } });
            W.map.addLayer(notesLayer); notesLayer.setZIndex(999999);
            setTimeout(() => { if (notesLayer.div) { notesLayer.div.style.pointerEvents = "none"; const styleId = "aan-notes-css-fix"; if (!document.getElementById(styleId)) { const style = document.createElement("style"); style.id = styleId; style.textContent = `#${notesLayer.div.id} svg, #${notesLayer.div.id} div { pointer-events: none; } #${notesLayer.div.id} path, #${notesLayer.div.id} image, #${notesLayer.div.id} circle, #${notesLayer.div.id} text { pointer-events: auto !important; cursor: pointer; }`; document.head.appendChild(style); } } }, 500);
            dragControl = new OpenLayers.Control.DragFeature(notesLayer, { autoActivate: false, onComplete: updateNotePosition });
            dragControl.handlers.feature.stopDown = true; dragControl.handlers.feature.stopUp = true;
            W.map.addControl(dragControl); if (!isMarkersLocked) dragControl.activate();
            refreshNotesLayer();
        }
        function updateNotePosition(feature) {
            const noteId = feature.attributes.noteId; const geometry = feature.geometry.clone(); const mapProjection = W.map.getProjectionObject(); const epsg4326 = new OpenLayers.Projection("EPSG:4326");
            geometry.transform(mapProjection, epsg4326); const notes = getNotes(); const targetIndex = notes.findIndex(n => n.id === noteId);
            if (targetIndex !== -1) { notes[targetIndex].lon = geometry.x; notes[targetIndex].lat = geometry.y; saveNotes(notes); }
        }
        function refreshNotesLayer() {
            if (!notesLayer) return; if (dragControl && dragControl.handlers && dragControl.handlers.feature && dragControl.handlers.feature.feature) return;
            notesLayer.removeAllFeatures(); const notes = getNotes(); const features = []; const mapProjection = W.map.getProjectionObject(); const epsg4326 = new OpenLayers.Projection("EPSG:4326");
            notes.forEach(note => {
                const pt = new OpenLayers.Geometry.Point(note.lon, note.lat).transform(epsg4326, mapProjection);
                let shortText = note.text.length > 15 ? note.text.substring(0, 15) + ".." : note.text;
                const nColorKey = note.color || 'red'; const nShape = note.shape || 'note'; const iconUrl = getSVGIcon(nShape, nColorKey); const colorHex = COLORS[nColorKey] ? COLORS[nColorKey].hex : '#000000';
                const feature = new OpenLayers.Feature.Vector(pt, { label: shortText, noteId: note.id, iconUrl: iconUrl, labelColor: colorHex }); features.push(feature);
            });
            notesLayer.addFeatures(features); notesLayer.setZIndex(999999);
        }
        function initPopupSystem() {
            if (document.getElementById('aan-popup-window')) return;
            const popup = document.createElement('div'); popup.id = 'aan-popup-window';
            popup.style.cssText = `position: fixed; background: #ffffff; border: 2px solid #2196F3; box-shadow: 0 10px 25px rgba(0,0,0,0.4); z-index: 99999; display: none; flex-direction: column; border-radius: 8px; overflow: hidden; resize: both; min-width: 250px; min-height: 200px; font-family: Tahoma, sans-serif; direction: ${trans.dir};`;
            const header = document.createElement('div'); header.id = 'aan-popup-header';
            header.style.cssText = `background: #2196F3; color: white; padding: 8px 12px; cursor: move; font-weight: bold; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;`;
            const titleSpan = document.createElement('span'); titleSpan.textContent = trans.popup_title; titleSpan.id = 'aan-popup-title-text';
            const closeBtn = document.createElement('span'); closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;`;
            closeBtn.onclick = () => { popup.style.display = 'none'; currentlyOpenNoteId = null; };
            header.appendChild(titleSpan); header.appendChild(closeBtn);
            const contentContainer = document.createElement('div'); contentContainer.style.cssText = `flex: 1; display: flex; flex-direction: column; padding: 0;`;
            const textarea = document.createElement('textarea'); textarea.id = 'aan-popup-textarea';
            textarea.style.cssText = `flex: 1; width: 100%; border: none; padding: 10px; font-size: 15px; line-height: 1.5; color: #000; font-family: inherit; resize: none; box-sizing: border-box; outline: none; background: #fff; direction: ${trans.dir}; text-align: ${trans.dir === 'ltr' ? 'left' : 'right'};`;
            const footer = document.createElement('div'); footer.style.cssText = `background: #f1f1f1; padding: 8px; border-top: 1px solid #ccc; text-align: left; display: flex; justify-content: flex-end;`;
            if (trans.dir === 'rtl') footer.style.justifyContent = 'flex-start';
            const savePopupBtn = document.createElement('button'); savePopupBtn.id = 'aan-popup-save-btn'; savePopupBtn.textContent = trans.popup_save;
            savePopupBtn.style.cssText = `background-color: #4CAF50; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;`;
            savePopupBtn.onclick = () => {
                if (currentlyOpenNoteId) {
                    const newText = textarea.value.trim(); const notes = getNotes(); const idx = notes.findIndex(n => n.id === currentlyOpenNoteId);
                    if (idx !== -1) { notes[idx].text = newText; saveNotes(notes); refreshNotesLayer(); const originalText = savePopupBtn.textContent; savePopupBtn.textContent = "✅"; setTimeout(() => savePopupBtn.textContent = originalText, 1000); }
                }
            };
            contentContainer.appendChild(textarea); footer.appendChild(savePopupBtn); popup.appendChild(header); popup.appendChild(contentContainer); popup.appendChild(footer); document.body.appendChild(popup);
            const savedState = JSON.parse(localStorage.getItem(NOTES_POPUP_STATE_KEY));
            if (savedState) { popup.style.left = savedState.left; popup.style.top = savedState.top; popup.style.width = savedState.width; popup.style.height = savedState.height; }
            else { popup.style.top = '100px'; popup.style.left = '100px'; popup.style.width = '320px'; popup.style.height = '440px'; }
            let isDragging = false; let startX, startY, initialLeft, initialTop;
            header.onmousedown = (e) => { isDragging = true; startX = e.clientX; startY = e.clientY; initialLeft = popup.offsetLeft; initialTop = popup.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); };
            function onMouseMove(e) { if (!isDragging) return; popup.style.left = `${initialLeft + (e.clientX - startX)}px`; popup.style.top = `${initialTop + (e.clientY - startY)}px`; }
            function onMouseUp() { isDragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); const state = { left: popup.style.left, top: popup.style.top, width: popup.style.width, height: popup.style.height }; localStorage.setItem(NOTES_POPUP_STATE_KEY, JSON.stringify(state)); }
            popup.onmouseup = onMouseUp;
        }
        function showPopupNote(note) { currentlyOpenNoteId = note.id; const popup = document.getElementById('aan-popup-window'); const textarea = document.getElementById('aan-popup-textarea'); if (popup && textarea) { textarea.value = note.text; popup.style.display = 'flex'; } }

        function createNotesUI() {
            const container = document.createElement('div');
            container.className = 'aan-container';

            // Top Control Row (Lock)
            const topRow = document.createElement('div'); topRow.style.cssText = "display: flex; gap: 5px; margin-bottom: 5px; height: 28px;";
            const lockBtn = document.createElement('button'); lockBtn.className = `aan-btn aan-btn-lock ${!isMarkersLocked ? 'unlocked' : ''}`; lockBtn.style.cssText = "flex: 1; height: 100%; margin: 0; padding: 0;";
            lockBtn.textContent = isMarkersLocked ? trans.lock_btn_to_unlock : trans.lock_btn_to_lock;
            lockBtn.onclick = () => { isMarkersLocked = !isMarkersLocked; localStorage.setItem(NOTES_LOCK_STATE_KEY, isMarkersLocked); lockBtn.textContent = isMarkersLocked ? trans.lock_btn_to_unlock : trans.lock_btn_to_lock; lockBtn.classList.toggle('unlocked'); if (isMarkersLocked) { if(dragControl) dragControl.deactivate(); } else { if(dragControl) dragControl.activate(); } };
            topRow.appendChild(lockBtn); container.appendChild(topRow);

            // Inputs
            const controlsDiv = document.createElement('div'); controlsDiv.style.borderBottom = "1px solid #ddd"; controlsDiv.style.marginBottom = "10px";
            const row = document.createElement('div'); row.className = 'aan-row';
            const shapeSelect = document.createElement('select'); shapeSelect.className = 'aan-select'; shapeSelect.style.flex = "1";
            Object.keys(SHAPES).forEach(key => { const opt = document.createElement('option'); opt.value = key; opt.text = (trans['s_' + key] || key); if (key === selectedShape) opt.selected = true; shapeSelect.appendChild(opt); });
            const colorSelect = document.createElement('select'); colorSelect.className = 'aan-select'; colorSelect.style.flex = "1";
            Object.keys(COLORS).forEach(key => { const opt = document.createElement('option'); opt.value = key; opt.text = (trans['c_' + key] || key); if (key === selectedColor) opt.selected = true; colorSelect.appendChild(opt); });
            const previewDiv = document.createElement('div'); previewDiv.className = 'aan-preview'; const previewImg = document.createElement('img'); previewImg.style.width = '24px'; previewDiv.appendChild(previewImg);
            const updatePreview = () => { previewImg.src = getSVGIcon(selectedShape, selectedColor); };
            shapeSelect.onchange = () => { selectedShape = shapeSelect.value; updatePreview(); }; colorSelect.onchange = () => { selectedColor = colorSelect.value; updatePreview(); };
            updatePreview(); row.appendChild(shapeSelect); row.appendChild(colorSelect); row.appendChild(previewDiv); controlsDiv.appendChild(row);

            const noteInput = document.createElement('textarea'); noteInput.className = 'aan-input'; noteInput.placeholder = trans.placeholder; noteInput.rows = 2; noteInput.style.marginTop = "5px";
            const addBtn = document.createElement('button'); addBtn.className = 'aan-btn aan-btn-primary'; addBtn.textContent = `+ ${trans.add_note}`;
            const cancelBtn = document.createElement('button'); cancelBtn.className = 'aan-btn aan-btn-cancel'; cancelBtn.textContent = trans.cancel; cancelBtn.style.display = 'none';

            // Actions
            cancelBtn.onclick = () => { editingNoteId = null; noteInput.value = ''; addBtn.textContent = `+ ${trans.add_note}`; addBtn.className = 'aan-btn aan-btn-primary'; cancelBtn.style.display = 'none'; selectedColor = 'red'; selectedShape = 'note'; shapeSelect.value = selectedShape; colorSelect.value = selectedColor; updatePreview(); };
            addBtn.onclick = () => {
                const text = noteInput.value.trim(); if (!text) return;
                if (editingNoteId) {
                    const notes = getNotes(); const noteIndex = notes.findIndex(n => n.id === editingNoteId);
                    if (noteIndex !== -1) { notes[noteIndex].text = text; notes[noteIndex].color = selectedColor; notes[noteIndex].shape = selectedShape; saveNotes(notes); refreshNotesLayer(); }
                    editingNoteId = null; noteInput.value = ''; addBtn.textContent = `+ ${trans.add_note}`; addBtn.className = 'aan-btn aan-btn-primary'; cancelBtn.style.display = 'none'; selectedColor = 'red'; selectedShape = 'note'; shapeSelect.value = 'note'; colorSelect.value = 'red'; updatePreview();
                } else {
                    const centerObj = sdk.Map.getMapCenter(); const zoom = sdk.Map.getZoomLevel();
                    const newNote = { id: Date.now(), text: text, lon: centerObj.lon, lat: centerObj.lat, zoom: zoom, date: new Date().toLocaleDateString(trans.langName.includes('US') ? 'en-US' : 'ar-IQ'), color: selectedColor, shape: selectedShape };
                    const notes = getNotes(); notes.unshift(newNote); saveNotes(notes); refreshNotesLayer(); noteInput.value = '';
                }
            };
            controlsDiv.appendChild(noteInput); controlsDiv.appendChild(addBtn); controlsDiv.appendChild(cancelBtn); container.appendChild(controlsDiv);

            // List
            const listContainer = document.createElement('div'); listContainer.id = 'aan-list-container'; listContainer.style.maxHeight = '250px'; listContainer.style.overflowY = 'auto';
            container.appendChild(listContainer);
            renderNotesList(listContainer);

            // Bottom Actions
            const bottomDiv = document.createElement('div'); bottomDiv.style.marginTop = "10px"; bottomDiv.style.textAlign = "center";
            const createBtn = (txt, cls, act) => { const b = document.createElement('button'); b.className = cls; b.textContent = txt; b.onclick = act; return b; };
            const exportBtn = createBtn(trans.export, 'aan-btn aan-btn-secondary', () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(getNotes(), null, 2)], {type: "application/json"})); a.download = `wme_nots_backup_${Date.now()}.json`; a.click(); });
            const importBtn = createBtn(trans.import, 'aan-btn aan-btn-secondary', () => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'; input.onchange = e => { const reader = new FileReader(); reader.onload = ev => { try { const imported = JSON.parse(ev.target.result); if (Array.isArray(imported)) { const merged = [...imported, ...getNotes()].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i); saveNotes(merged); refreshNotesLayer(); alert("Done!"); } } catch (err) { alert("Error"); } }; reader.readAsText(e.target.files[0]); }; input.click(); });
            importBtn.style.marginLeft = '2%';
            const clearBtn = createBtn(trans.clear, 'aan-btn aan-btn-danger', () => { if(confirm(trans.confirm_clear)) { saveNotes([]); refreshNotesLayer(); } });
            bottomDiv.appendChild(exportBtn); bottomDiv.appendChild(importBtn); bottomDiv.appendChild(clearBtn); container.appendChild(bottomDiv);

            // Expose Edit Helper
            window.aanFillEditForm = (note) => { editingNoteId = note.id; noteInput.value = note.text; selectedColor = note.color || 'red'; selectedShape = note.shape || 'note'; shapeSelect.value = selectedShape; colorSelect.value = selectedColor; updatePreview(); addBtn.textContent = `💾 ${trans.save_edit}`; addBtn.className = 'aan-btn aan-btn-success'; cancelBtn.style.display = 'block'; };

            return container;
        }

        function renderNotesList(container) {
            container.innerHTML = ''; const notes = getNotes(); if (notes.length === 0) { container.innerHTML = `<div style="text-align:center; color:#999; padding:10px;">-- فارغ --</div>`; return; }
            notes.forEach(note => {
                const item = document.createElement('div'); item.className = 'aan-note-item';
                const noteColor = COLORS[note.color] ? COLORS[note.color].hex : COLORS['red'].hex; item.style.borderColor = noteColor;
                const textSpan = document.createElement('div'); textSpan.className = 'aan-text-box'; textSpan.textContent = note.text; textSpan.title = note.text; textSpan.onclick = () => { showPopupNote(note); };
                const jumpBtn = document.createElement('button'); jumpBtn.className = 'aan-icon-btn'; jumpBtn.innerHTML = `📍`; jumpBtn.title = trans.jump;
                jumpBtn.onclick = () => { sdk.Map.setMapCenter({ lonLat: { lon: note.lon, lat: note.lat } }); sdk.Map.setZoomLevel({ zoomLevel: note.zoom }); };
                const editBtn = document.createElement('button'); editBtn.className = 'aan-text-btn'; editBtn.textContent = trans.btn_edit_text || trans.edit; editBtn.onclick = () => { if(window.aanFillEditForm) window.aanFillEditForm(note); };
                const delBtn = document.createElement('button'); delBtn.className = 'aan-text-btn delete'; delBtn.textContent = trans.btn_delete_text || trans.delete;
                delBtn.onclick = () => { if (confirm(trans.confirm_delete)) { saveNotes(getNotes().filter(n => n.id !== note.id)); refreshNotesLayer(); if (editingNoteId === note.id) document.querySelector('.aan-btn-cancel')?.click(); } };
                const dateSpan = document.createElement('div'); dateSpan.className = 'aan-date-box'; dateSpan.textContent = note.date;
                item.appendChild(textSpan); item.appendChild(jumpBtn); item.appendChild(editBtn); item.appendChild(delBtn); item.appendChild(dateSpan); container.appendChild(item);
            });
        }

        // --- COMMON UI HELPERS ---
        function onRoadTypeButtonClick(roadType) {
            const selection = sdk.Editing.getSelection();
            selection?.ids.forEach(segmentId => { if (sdk.DataModel.Segments.getById({ segmentId }).roadType !== roadType) { sdk.DataModel.Segments.updateSegment({ segmentId, roadType }); } });
        }
        function onLockButtonClick(rank) {
            const selection = sdk.Editing.getSelection();
            selection?.ids.forEach(segmentId => { const seg = sdk.DataModel.Segments.getById({ segmentId }); if (seg.lockRank !== rank) { sdk.DataModel.Segments.updateSegment({ segmentId, lockRank: rank }); } });
        }

        function addButtonsToPanel() {
            $('#csRoadTypeButtonsContainer').remove(); $('#csLockButtonsContainer').remove(); $('#csUtilButtonsContainer').remove();
            const selection = sdk.Editing.getSelection();
            if (selection?.objectType !== 'segment') return;
            const $dropDown = $(roadTypeDropdownSelector);
            if (!$dropDown.length) return;
            const $parentContainer = $dropDown.parent();

            // 1. Road Types
            if (_settings.roadButtons) {
                const $container = $('<div>', { id: 'csRoadTypeButtonsContainer', class: 'cs-rt-buttons-container' });
                const $group = $('<div>', { class: 'cs-rt-buttons-group' });
                RENDER_ORDER.forEach(roadTypeKey => {
                    if (_settings.roadTypeButtons.includes(roadTypeKey)) {
                        const roadTypeSetting = roadTypeSettings[roadTypeKey];
                        $group.append($('<div>', { class: `btn cs-rt-button cs-rt-button-${roadTypeKey} btn-positive`, title: I18n.t('segment.road_types')[roadTypeSetting.id] }).text(trans.roadTypes[roadTypeKey] || roadTypeKey).data('rtId', roadTypeSetting.id).click(function() { onRoadTypeButtonClick($(this).data('rtId')); }));
                    }
                });
                $container.append($group); $parentContainer.prepend($container);
            }

            const $lockContainer = $('<div>', { id: 'csLockButtonsContainer', class: 'cs-lock-buttons-container' });

            // 2. Lock Buttons
            if (_settings.lockButtons) {
                const $lockGroup = $('<div>', { class: 'cs-lock-buttons-group' });
                lockSettings.forEach(lock => {
                    $lockGroup.append($('<div>', { class: 'btn cs-lock-button btn-positive', style: `background-color:${lock.color} !important; color:${lock.textColor} !important; border-color:${lock.borderColor} !important;`, title: `Lock Level ${lock.rank + 1}` }).text(trans.locks[`L${lock.rank + 1}`] || (lock.rank + 1)).data('rank', lock.rank).click(function() { onLockButtonClick($(this).data('rank')); }));
                });
                $lockContainer.append($lockGroup);
            }

            // 3. Utility Buttons (Controlled by setting)
            if (_settings.utilButtons) {
                const $utilGroup = $('<div>', { id: 'csUtilButtonsContainer', class: 'cs-util-buttons-group', style: 'margin-top: 5px; display:flex; gap:5px;' });

                // Alt City Button (NEW - Left in RTL)
                const $altCityBtn = $('<button>', { id: 'aan-btn-alt-city', class: 'btn btn-default', style: 'flex:1; font-size:11px; font-weight:bold; padding:2px;' }).text(trans.btn_alt_city).click(onAddAltCityButtonClick);

                // Copy Button (Right in RTL)
                const $copyBtn = $('<button>', { id: 'aan-btn-copy', class: 'btn btn-default', style: 'flex:1; font-size:11px; font-weight:bold; padding:2px;' }).text(trans.btn_copy).click(copySegmentAttributes);

                // Paste Button (Center)
                const $pasteBtn = $('<button>', { id: 'aan-btn-paste', class: 'btn btn-primary', style: 'flex:1; font-size:11px; font-weight:bold; padding:2px;' }).text(trans.btn_paste).click(pasteSegmentAttributes);

                // RTL ORDER: Copy (Right) -> Paste (Center) -> Alt City (Left)
                // In DOM, first appended is Right in RTL.
                $utilGroup.append($copyBtn, $pasteBtn, $altCityBtn);

                $lockContainer.append($utilGroup);
            }

            // Append container if it has content
            if (_settings.lockButtons || _settings.utilButtons) {
                if ($('#csRoadTypeButtonsContainer').length) { $('#csRoadTypeButtonsContainer').after($lockContainer); } else { $parentContainer.prepend($lockContainer); }
            }
        }

        function shadeColor2(color, percent) {
            const f = parseInt(color.slice(1), 16); const t = percent < 0 ? 0 : 255; const p = percent < 0 ? percent * -1 : percent;
            const R = f >> 16; const G = f >> 8 & 0x00FF; const B = f & 0x0000FF;
            return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
        }

        function injectCss() {
            let css = [
                // ... Suite CSS
                '.csRoadTypeButtonsCheckBoxContainer {margin-left:15px;}', '.cs-rt-buttons-container {margin-bottom:5px;}', '.cs-rt-buttons-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; }',
                '.cs-lock-buttons-container {margin-bottom:5px;}', '.cs-lock-buttons-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; }',
                '.cs-rt-buttons-container .cs-rt-button {font-size:10px; font-weight: bold; line-height:22px; color:black; padding:0 2px; height:24px; text-align: center; margin: 0; border:1px solid; border-radius: 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}',
                '.cs-lock-button { font-size:10px; font-weight: bold; line-height:16px; padding:0; height:18px; text-align: center; margin: 0; border:1px solid transparent; border-radius: 4px;}',
                '.cs-lock-button:hover { filter: brightness(0.9); }', '.btn.cs-rt-button:active, .btn.cs-lock-button:active {box-shadow:none;transform:translateY(2px)}',
                '#sidepanel-clicksaver .controls-container {padding:0px;}', '#sidepanel-clicksaver .controls-container label {white-space: normal;}', '#sidepanel-clicksaver {font-size:13px;}',
                '.scf-details {margin-left: 15px; margin-top: 5px;}', '.coloring-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; width: 100%; background: #f8f9fa; padding: 4px; border-radius: 5px; border: 1px solid #eee; }',
                '.coloring-row input[type="color"] { width: 35px; height: 25px; padding: 0; border: none; cursor: pointer; border-radius: 3px; }',
                '.coloring-row input[type="number"] { width: 50px; font-size: 11px; padding: 3px; border: 1px solid #ccc; border-radius: 3px; text-align: center; margin: 0 5px; }',
                '.coloring-row label { flex-grow: 1; margin: 0 5px; font-size: 11px; color: #333; }',
                '.coloring-actions { display: flex; gap: 5px; margin-top: 10px; }',
                '.coloring-btn { flex: 1; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: bold; font-size: 12px; box-shadow: 0 2px 2px rgba(0,0,0,0.1); }',
                '.coloring-btn:hover { opacity: 0.9; }',
                '.cs-accordion { margin-bottom: 10px; border: 1px solid #e0e0e0; border-radius: 5px; overflow: hidden; }',
                '.cs-accordion-header { background: #f0f0f0; padding: 10px; cursor: pointer; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center; user-select: none; }',
                '.cs-accordion-header:hover { background: #e0e0e0; }',
                '.cs-accordion-content { padding: 10px; display: block; border-top: 1px solid #e0e0e0; background: #fff; }',
                '.cs-accordion-content.collapsed { display: none; }', '.cs-accordion-arrow { transition: transform 0.2s; }', '.cs-accordion-arrow.collapsed { transform: rotate(-90deg); }',
                // ... Notes CSS (Merged here)
                '.aan-container { padding: 5px; font-family: Tahoma, sans-serif; }',
                '.aan-btn { width: 100%; padding: 8px; margin-bottom: 5px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; font-size: 13px; }',
                '.aan-btn-primary { background-color: #2196F3; } .aan-btn-success { background-color: #4CAF50; } .aan-btn-danger { background-color: #F44336; margin-top: 5px; } .aan-btn-cancel { background-color: #9E9E9E; color: white; }',
                '.aan-btn-lock { background-color: #F44336; transition: 0.3s; } .aan-btn-lock.unlocked { background-color: #4CAF50; } .aan-btn-secondary { background-color: #eee; color: #333; border: 1px solid #ccc; width: 48%; }',
                '.aan-input { width: 95%; padding: 6px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 3px; } .aan-select { width: 48%; padding: 4px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 3px; }',
                '.aan-note-item { background: #fff; border-right: 5px solid #ddd; padding: 6px; margin-bottom: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border-radius: 4px; display: flex; align-items: center; justify-content: flex-start; flex-direction: row; gap: 5px; direction: rtl; }',
                '.aan-icon-btn { cursor: pointer; font-size: 14px; background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 3px; }',
                '.aan-text-btn { cursor: pointer; font-size: 11px; background: #f0f0f0; border: 1px solid #ccc; padding: 2px 8px; border-radius: 3px; color: #333; font-weight: bold; white-space: nowrap; } .aan-text-btn:hover { background: #e0e0e0; }',
                '.aan-text-btn.delete { color: #d32f2f; border-color: #ffcdd2; background: #ffebee; }',
                '.aan-text-box { flex: 1; border: 1px solid #ccc; background: #f9f9f9; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: #333; cursor: pointer; } .aan-text-box:hover { background: #eef; border-color: #aaf; }',
                '.aan-date-box { border: 1px solid #ccc; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #666; white-space: nowrap; }',
                '.aan-row { display: flex; justify-content: space-between; align-items: center; gap: 5px; } .aan-preview { width: 32px; height: 32px; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; background: #fff; flex-shrink: 0; }'
            ];
            Object.keys(roadTypeSettings).forEach(roadTypeAbbr => {
                const roadType = roadTypeSettings[roadTypeAbbr]; const bgColor = roadType.wmeColor;
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr} {background-color:${bgColor} !important; color: black !important; border-color:${shadeColor2(bgColor, -0.15)};}`);
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr}:hover {background-color:${shadeColor2(bgColor, 0.2)} !important;}`);
            });
            $(`<style type="text/css">${css.join(' ')}</style>`).appendTo('head');
        }

        function createSettingsCheckbox(id, settingName, labelText, titleText, divCss, labelCss, optionalAttributes) {
            const $container = $('<div>', { class: 'controls-container' });
            let isChecked = false;
            if (settingName === 'roadType') { const rt = optionalAttributes && optionalAttributes['data-road-type']; if (rt && _settings.roadTypeButtons.includes(rt)) isChecked = true; }
            else { if (_settings[settingName] === true) isChecked = true; }
            const $input = $('<input>', { type: 'checkbox', class: 'csSettingsControl', name: id, id, 'data-setting-name': settingName, checked: isChecked }).appendTo($container);
            const $label = $('<label>', { for: id }).text(labelText).appendTo($container);
            if (divCss) $container.css(divCss); if (optionalAttributes) $input.attr(optionalAttributes);
            return $container;
        }

        function createAccordion(title, contentElem, isCollapsed, toggleCallback) {
            const $acc = $('<div>', { class: 'cs-accordion' });
            const $header = $('<div>', { class: 'cs-accordion-header' });
            const $arrow = $('<span>', { class: 'cs-accordion-arrow ' + (isCollapsed ? 'collapsed' : '') }).text('▼');
            $header.text(title).append($arrow);
            const $content = $('<div>', { class: 'cs-accordion-content ' + (isCollapsed ? 'collapsed' : '') }).append(contentElem);
            $header.click(function() {
                const wasCollapsed = $content.hasClass('collapsed');
                if (wasCollapsed) { $content.removeClass('collapsed'); $arrow.removeClass('collapsed'); } else { $content.addClass('collapsed'); $arrow.addClass('collapsed'); }
                if (toggleCallback) toggleCallback(!wasCollapsed);
            });
            $acc.append($header, $content); return $acc;
        }

        async function initUserPanel() {
            const $panel = $('<div>', { id: 'sidepanel-clicksaver' });
            const $langDiv = $('<div>', { class: 'side-panel-section', style: 'margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;' });
            const $langSelect = $('<select>', { id: 'aaSuiteLanguageSelector', style: 'width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #ccc;' });
            $langSelect.append(
                $('<option>', { value: 'ar', text: 'العربية - العراق' }),
                $('<option>', { value: 'ckb', text: 'کوردی - سۆرانی' }),
                $('<option>', { value: 'kmr', text: 'Kurdî - Kurmancî' }),
                $('<option>', { value: 'en', text: 'English - USA' }),
                $('<option>', { value: 'es', text: 'Español' }),
                $('<option>', { value: 'fr', text: 'Français' }),
                $('<option>', { value: 'ru', text: 'Русский' }),
                $('<option>', { value: 'he', text: 'עברית' })
            );
            $langSelect.val(_settings.preferredLocale || 'en');
            $langSelect.change(function() {
                _settings.preferredLocale = $(this).val();
                saveSettingsToStorage();
                if(confirm('Language Change Requires Refresh. Reload now?')) location.reload();
            });
            $langDiv.append($langSelect); $panel.append($langDiv);

            // 1. Roads
            const $roadContent = $('<div>');
            const $roadTypesDiv = $('<div>', { class: 'csRoadTypeButtonsCheckBoxContainer' });
            if(!_settings.roadButtons) $roadTypesDiv.hide();
            RENDER_ORDER.forEach(rt => { $roadTypesDiv.append(createSettingsCheckbox(`cs${rt}CheckBox`, 'roadType', trans.roadTypes[rt] || rt, null, null, null, { 'data-road-type': rt })); });

            $roadContent.append($('<div>').append(createSettingsCheckbox('csRoadTypeButtonsCheckBox', 'roadButtons', trans.roadTypeButtons)).append($roadTypesDiv));
            $roadContent.append(createSettingsCheckbox('csLockButtonsCheckBox', 'lockButtons', trans.lockLevelButtons, null, {marginTop:'10px'}));
            $roadContent.append(createSettingsCheckbox('csUtilButtonsCheckBox', 'utilButtons', trans.utilButtons, null, {marginTop:'10px'}));

            const $roadAccordion = createAccordion(trans.headerRoads, $roadContent, _settings.ui_road_collapsed, (newState) => { _settings.ui_road_collapsed = newState; saveSettingsToStorage(); });
            $panel.append($roadAccordion);

            // 2. Smart Copy
            const $smartContent = $('<div>');
            $smartContent.append(createSettingsCheckbox('scfEnableCheckBox', 'enableSmartCopy', trans.enableSmartCopy));
            const $scfDetails = $('<div>', { class: 'scf-details' });
            if(!_settings.enableSmartCopy) $scfDetails.hide();
            $scfDetails.append(createSettingsCheckbox('scfInheritCountryCheckBox', 'inheritCountry', trans.copyCountry), createSettingsCheckbox('scfInheritCityCheckBox', 'inheritCity', trans.copyCity), createSettingsCheckbox('scfInheritStreetCheckBox', 'inheritStreet', trans.copyStreet), createSettingsCheckbox('scfInheritRoadTypeCheckBox', 'inheritRoadType', trans.copyRoadType), createSettingsCheckbox('scfInheritSpeedCheckBox', 'inheritSpeed', trans.copySpeed), createSettingsCheckbox('scfInheritLockCheckBox', 'inheritLock', trans.copyLock), createSettingsCheckbox('scfInheritAltNamesCheckBox', 'inheritAltNames', trans.copyAltNames), createSettingsCheckbox('scfInheritOtherCheckBox', 'inheritOther', trans.copyOther));
            $smartContent.append($scfDetails);
            const $smartAccordion = createAccordion(trans.headerSmartCopy, $smartContent, _settings.ui_smartcopy_collapsed, (newState) => { _settings.ui_smartcopy_collapsed = newState; saveSettingsToStorage(); });
            $panel.append($smartAccordion);

            // 3. Coloring
            const $coloringContent = $('<div>');
            colorRangesDef.forEach(range => {
                const rowId = `cr-${range.id}`; const $row = $('<div>', { class: 'coloring-row' });
                const $chk = $('<input>', { type: 'checkbox', id: `${rowId}-chk`, checked: _settings.coloringEnabled[range.id] }).change(function() { _settings.coloringEnabled[range.id] = this.checked; saveSettingsToStorage(); });
                const $daysInput = $('<input>', { type: 'number', min: '1', max: '99999', value: _settings.coloringDays[range.id] }).change(function() { _settings.coloringDays[range.id] = parseInt(this.value); saveSettingsToStorage(); });
                const $lbl = $('<span >', { style: 'font-size:10px; margin:0 5px; flex-grow:1;' }).text(trans.daysLabel);
                const $clr = $('<input>', { type: 'color', value: _settings.coloringColors[range.id] }).change(function() { _settings.coloringColors[range.id] = this.value; saveSettingsToStorage(); });
                $row.append($chk, $daysInput, $lbl, $clr); $coloringContent.append($row);
            });
            const $actions = $('<div>', { class: 'coloring-actions' });
            $actions.append($('<button>', { class: 'coloring-btn', style: 'background-color:#2ecc71;' }).text(trans.coloringApply).click(applyMapColoring), $('<button>', { class: 'coloring-btn', style: 'background-color:#e74c3c;' }).text(trans.coloringClear).click(clearMapColoring));
            $coloringContent.append($actions);
            const $coloringAccordion = createAccordion(trans.headerColoring, $coloringContent, _settings.ui_coloring_collapsed, (newState) => { _settings.ui_coloring_collapsed = newState; saveSettingsToStorage(); });
            $panel.append($coloringAccordion);

            // 4. NOTES
            initNotesMapLayer();
            initPopupSystem();
            const $notesUI = createNotesUI();
            const $notesAccordion = createAccordion(trans.headerNotes, $notesUI, _settings.ui_notes_collapsed, (newState) => { _settings.ui_notes_collapsed = newState; saveSettingsToStorage(); });
            $panel.append($notesAccordion);

            $panel.append($('<div>', { style: 'margin-top:20px;font-size:10px;color:#999999;' }).append($('<div>').text(`v. ${SCRIPT_VERSION}`)));
            const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
            $(tabLabel).text('Abdullah Abbas WME Suite');
            $(tabPane).append($panel);
            $(tabPane).parent().css({ 'padding-top': '0px', 'padding-left': '8px' });

            $('#csRoadTypeButtonsCheckBox').change(function() { $('.csRoadTypeButtonsCheckBoxContainer').toggle(this.checked); _settings.roadButtons = this.checked; addButtonsToPanel(); saveSettingsToStorage(); });
            $('#csLockButtonsCheckBox').change(function() { _settings.lockButtons = this.checked; addButtonsToPanel(); saveSettingsToStorage(); });
            $('#csUtilButtonsCheckBox').change(function() { _settings.utilButtons = this.checked; addButtonsToPanel(); saveSettingsToStorage(); });
            $('#scfEnableCheckBox').change(function() { $('.scf-details').toggle(this.checked); _settings.enableSmartCopy = this.checked; saveSettingsToStorage(); });
            $('.csSettingsControl').change(function() {
                const { checked } = this; const $this = $(this); const settingName = $this.data('setting-name');
                if (settingName === 'roadType') { const roadType = $this.data('road-type'); const array = _settings.roadTypeButtons; const index = array.indexOf(roadType); if (checked && index === -1) array.push(roadType); else if (!checked && index !== -1) array.splice(index, 1); }
                else if (settingName && !['roadButtons', 'enableSmartCopy', 'lockButtons', 'utilButtons'].includes(settingName)) { _settings[settingName] = checked; }
                saveSettingsToStorage(); if(settingName === 'roadType') addButtonsToPanel();
            });

            // Notes Events
            sdk.Events.on({ eventName: "wme-map-move-end", eventHandler: () => { refreshNotesLayer(); if(notesLayer) notesLayer.setZIndex(999999); }});
        }

        async function init() {
            loadSettingsFromStorage();
            injectCss();
            sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });
            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: addButtonsToPanel });
            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: runSmartCopyLogic });
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const addedNode = mutation.addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.querySelector(roadTypeDropdownSelector)) { addButtonsToPanel(); }
                    }
                });
            });
            const editPanel = document.getElementById('edit-panel');
            if (editPanel) observer.observe(editPanel, { childList: true, subtree: true });
            await initUserPanel();
            window.addEventListener('beforeunload', saveSettingsToStorage, false);
            if (_settings.roadButtons) addButtonsToPanel();
        }

        try { init(); } catch(e) { console.error(SCRIPT_NAME + ' init failed:', e); }
    }

    function skipLoginDialog(tries = 0) {
        if (sdk || tries === 1000) return;
        if ($('wz-button.do-login').length) { $('wz-button.do-login').click(); return; }
        setTimeout(skipLoginDialog, 100, ++tries);
    }

    async function mainStart() {
        skipLoginDialog();
        try {
            sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl: '#' } });
            if (document.readyState === 'complete' || document.readyState === 'interactive') { runSuiteModules(); } else { $(document).ready(() => { runSuiteModules(); }); }
        } catch(err) { console.error('Abdullah Abbas WME Mega Suite: Bootstrap failed', err); }
    }

    mainStart();
})();