// ==UserScript==
// @name                Abdullah Abbas WME Tools
// @namespace           https://greasyfork.org/users/abdullah-abbas
// @description         [English] WME Suite: Inspector + Validator + Adv Selection + City Boundary Validator. [Copyright © 2026 Abdullah Abbas - All Rights Reserved].
// @description:ar      [العربية] مجموعة أدوات ويز: المستكشف + المدقق + التحديد المتقدم + مدقق حدود المدن. [حقوق النشر © 2026 عبدالله عباس - جميع الحقوق محفوظة].
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @version             2026.01.25.02
// @grant               GM_xmlhttpRequest
// @grant               unsafeWindow
// @connect             waze.com
// @connect             nominatim.openstreetmap.org
// @author              Abdullah Abbas
// @copyright           2026, Abdullah Abbas. All Rights Reserved.
// @license             Proprietary - No redistribution or modification allowed.
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/563905/Abdullah%20Abbas%20WME%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/563905/Abdullah%20Abbas%20WME%20Tools.meta.js
// ==/UserScript==

/*
 * ===========================================================================
 * Abdullah Abbas WME Tools (Combined Suite)
 *
 * [English]
 * A comprehensive suite for Waze Map Editor including:
 * 1. City/Place Inspector
 * 2. Map Validator
 * 3. Advanced Selection
 * 4. City Boundary Validator (Waze + OSM)
 *
 * © 2026 Abdullah Abbas. All Rights Reserved.
 * ===========================================================================
 */

(function() {
    'use strict';

    // ===========================================================================
    //  GLOBAL SETUP
    // ===========================================================================
    var W, OpenLayers, WazeWrap;
    if (typeof unsafeWindow !== 'undefined') {
        W = unsafeWindow.W;
        OpenLayers = unsafeWindow.OpenLayers;
        WazeWrap = unsafeWindow.WazeWrap;
    } else {
        W = window.W;
        OpenLayers = window.OpenLayers;
        WazeWrap = window.WazeWrap;
    }

    const SCRIPT_NAME = "Abdullah Abbas WME Tools";
    const SCRIPT_VERSION = "2026.01.25.02";
    const DEFAULT_W = "340px";
    const DEFAULT_H = "480px";

    // ===========================================================================
    //  LOCALIZATION
    // ===========================================================================
    const STRINGS = {
        'en-US': {
            name: 'English',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Map Validator', btn_adv: 'Advanced Selection',
            btn_inspector: 'Comp. City/Place Explorer 📊',
            btn_cities_check: 'City Boundary Validator ☑',
            win_adv: 'Advanced Selection',
            win_inspector: 'Comp. City/Place Explorer',
            win_cities: 'City Boundary Validator',
            common_scan: 'Scan', common_clear: 'Clear', common_close: 'Close', common_ready: 'Ready', common_no_name: 'No Name', insp_hdr_editor: 'Editor', insp_hdr_crup: 'Cr / Up', adv_lock_level: 'Level',
            no_results: 'No results',
            insp_tab_seg: '🛣️ Roads', insp_tab_ven: '📍 Places', insp_tab_stats: '👥 Stats',
            insp_col_name: 'Name', insp_col_creator: 'Creator', insp_col_updater: 'Updater',
            insp_lbl_roads: 'Rds', insp_lbl_places: 'Plc', insp_btn_rotate: 'Rotate Window',
            qa_title: 'Map Validator', qa_btn_scan: '🔍 Scan Area', qa_btn_clear: 'Clear', qa_btn_gmaps: 'Open Google Maps 🌏',
            qa_msg_scanning: 'Scanning...', qa_msg_clean: '✅ Clean', qa_msg_found: 'Found', qa_msg_ready: 'Ready',
            qa_lbl_short: 'Short Seg', qa_lbl_angle: 'Sharp Angle', qa_lbl_cross: 'No Node',
            qa_lbl_lock: 'Locks', qa_lbl_ghost: 'Ghost City', qa_lbl_speed: 'Speed',
            qa_lbl_discon: 'Disconnected', qa_lbl_jagged: 'Jagged', qa_opt_exclude_rab: 'Exclude RA',
            qa_lbl_discon_mode: 'Discon Type:', qa_opt_discon_1w: '1-Side', qa_opt_discon_2w: '2-Sides',
            qa_lbl_limit_dist: 'Dist Limit', qa_lbl_limit_angle: 'Angle Limit',
            qa_unit_m: 'Meter', qa_unit_i: 'Mile', qa_msg_no_segments: '⚠️ Zoom In please.',
            adv_lbl_crit: 'Criteria:', adv_lbl_val: 'Value:',
            adv_opt_nocity: 'No City', adv_opt_nospeed: 'No Speed',
            adv_opt_lock: 'Lock Level', adv_opt_type: 'Road Type',
            adv_btn_sel: 'Select', adv_btn_desel: 'Deselect',
            adv_msg_found: 'Selected', adv_msg_none: 'No matches found',
            adv_type_st: 'Street (St)', adv_type_ps: 'Primary Street (PS)', adv_type_mh: 'Minor Highway (mH)',
            adv_type_maj: 'Major Highway (MH)', adv_type_fw: 'Freeway (Fw)', adv_type_rmp: 'Ramp (Rmp)',
            adv_type_plr: 'Parking Lot (PLR)', adv_type_pw: 'Private Way (Pw)', adv_type_pr: 'Private (PR)',
            adv_type_or: 'Off-Road (OR)',
            city_no_name: 'No City',
            // Cities Checkbox
            cc_refresh: 'Refresh List', cc_draw: 'Draw Selected', cc_clear: 'Clear All',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Search city name...',
            cc_search_btn: 'Search', cc_status_ready: 'Ready', cc_status_scan: 'Scanning...',
            cc_msg_empty: 'Click Refresh or Search...', cc_check_all: 'Select All'
        },
        'ar-IQ': {
            name: 'العربية',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'مدقق الخريطة', btn_adv: 'تحديد متقدم',
            btn_inspector: 'مستكشف المدن والأماكن الشامل 📊',
            btn_cities_check: 'مدقق حدود المدن ☑',
            win_adv: 'تحديد متقدم',
            win_inspector: 'مستكشف المدن والأماكن الشامل',
            win_cities: 'مدقق حدود المدن',
            common_scan: 'بحث', common_clear: 'مسح', common_close: 'إغلاق', common_ready: 'جاهز للتعديل', common_no_name: 'بدون اسم', insp_hdr_editor: 'المحرر', insp_hdr_crup: 'إنشاء / تحديث', adv_lock_level: 'المستوى',
            no_results: 'لا توجد نتائج',
            insp_tab_seg: '🛣️ الطرق', insp_tab_ven: '📍 الأماكن', insp_tab_stats: '👥 إحصائيات',
            insp_col_name: 'الاسم', insp_col_creator: 'المنشئ', insp_col_updater: 'المحدث',
            insp_lbl_roads: 'طرق', insp_lbl_places: 'أماكن', insp_btn_rotate: 'تدوير النافذة (طولي/عرضي)',
            qa_title: 'مدقق الخريطة', qa_btn_scan: '🔍 فحص المنطقة', qa_btn_clear: 'مسح النتائج',
            qa_btn_gmaps: 'فتح في خرائط جوجل 🌏', qa_msg_scanning: 'جاري الفحص...', qa_msg_clean: '✅ سليم (لم يتم العثور على أخطاء)', qa_msg_found: 'تم كشف', qa_msg_ready: 'جاهز',
            qa_lbl_short: 'قطاع قصير', qa_lbl_angle: 'زوايا حادة', qa_lbl_cross: 'بلا عقدة',
            qa_lbl_lock: 'أقفال', qa_lbl_ghost: 'مدن فارغة', qa_lbl_speed: 'سرعة',
            qa_lbl_discon: 'غير متصل', qa_lbl_jagged: 'تشوهات', qa_opt_exclude_rab: 'تجاهل الدوارات',
            qa_lbl_discon_mode: 'نوع عدم الاتصال:', qa_opt_discon_1w: 'جهة واحدة', qa_opt_discon_2w: 'جهتين',
            qa_lbl_limit_dist: 'حد المسافة', qa_lbl_limit_angle: 'حد الزاوية',
            qa_unit_m: 'متر', qa_unit_i: 'ميل', qa_msg_no_segments: '⚠️ المنطقة واسعة! يرجى التقريب.',
            adv_lbl_crit: 'معيار التحديد:', adv_lbl_val: 'القيمة:',
            adv_opt_nocity: 'بدون مدينة (Ghost)', adv_opt_nospeed: 'بدون سرعة (Driveable)',
            adv_opt_lock: 'مستوى القفل', adv_opt_type: 'نوع الطريق',
            adv_btn_sel: 'تحديد العناصر', adv_btn_desel: 'إلغاء التحديد',
            adv_msg_found: 'تم تحديد', adv_msg_none: 'لم يتم العثور على عناصر مطابقة',
            adv_type_st: 'شارع (St)', adv_type_ps: 'شارع رئيسي (PS)', adv_type_mh: 'سريع ثانوي (mH)',
            adv_type_maj: 'سريع رئيسي (MH)', adv_type_fw: 'طريق حرة (Fw)', adv_type_rmp: 'منحدر (Rmp)',
            adv_type_plr: 'موقف (PLR)', adv_type_pw: 'طريق ضيق (Pw)', adv_type_pr: 'طريق خاص (PR)',
            adv_type_or: 'طريق ترابي (OR)',
            city_no_name: 'بدون مدينة',
            // Cities Checkbox
            cc_refresh: 'تحديث القائمة', cc_draw: 'تلوين المحدد', cc_clear: 'مسح شامل',
            cc_waze_src: 'ويز', cc_osm_src: 'OSM', cc_search_ph: 'اكتب اسم المدينة للبحث...',
            cc_search_btn: 'بحث', cc_status_ready: 'جاهز', cc_status_scan: 'جاري البحث...',
            cc_msg_empty: 'اضغط تحديث أو ابحث...', cc_check_all: 'تحديد الكل'
        },
        'ckb-IQ': {
            name: 'کوردی (Soranî)',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'پشکنەری نەخشە', btn_adv: 'دیاریکردنی پێشکەوتوو',
            btn_inspector: 'پشکنەری شار و شوێن (بەرفراوان) 📊',
            btn_cities_check: 'پشکنەری سنووری شار ☑',
            win_adv: 'دیاریکردنی پێشکەوتوو',
            win_inspector: 'پشکنەری شار و شوێن (بەرفراوان)',
            win_cities: 'پشکنەری سنووری شار',
            common_scan: 'گەڕان', common_clear: 'پاککردنەوە', common_close: 'داخستن', common_ready: 'ئامادەیە',
            no_results: 'هیچ نەدۆزرایەوە',
            insp_tab_seg: '🛣️ ڕێگا', insp_tab_ven: '📍 شوێن', insp_tab_stats: '👥 ئامار',
            insp_col_name: 'ناو', insp_col_creator: 'دروستکەر', insp_col_updater: 'نوێکەرەوە',
            insp_lbl_roads: 'ڕێگا', insp_lbl_places: 'شوێن', insp_btn_rotate: 'سوڕاندن',
            qa_title: 'پشکنەری نەخشە', qa_btn_scan: '🔍 پشکنین', qa_btn_clear: 'پاککردنەوە',
            qa_btn_gmaps: 'Google Maps 🌏', qa_msg_scanning: 'پشکنین...', qa_msg_clean: '✅ پاکە', qa_msg_found: 'دۆزرایەوە', qa_msg_ready: 'ئامادەیە',
            qa_lbl_short: 'کورت', qa_lbl_angle: 'گۆشە', qa_lbl_cross: 'یەکتربڕین',
            qa_lbl_lock: 'قوفڵ', qa_lbl_ghost: 'بێ شار', qa_lbl_speed: 'خێرایی',
            qa_lbl_discon: 'پچڕاو', qa_lbl_jagged: 'شێواو', qa_opt_exclude_rab: 'بێ فلکە',
            qa_lbl_discon_mode: 'پچڕاو:', qa_opt_discon_1w: 'یەک لا', qa_opt_discon_2w: 'دوو لا',
            qa_lbl_limit_dist: 'سنووری دووری', qa_lbl_limit_angle: 'سنووری گۆشە',
            qa_unit_m: 'مەتر', qa_unit_i: 'میل', qa_msg_no_segments: '⚠️ زووم بکە.',
            adv_lbl_crit: 'پێوەر:', adv_lbl_val: 'نرخ:',
            adv_opt_nocity: 'بێ شار', adv_opt_nospeed: 'بێ خێرایی',
            adv_opt_lock: 'ئاستی قوفڵ', adv_opt_type: 'جۆری ڕێگا',
            adv_btn_sel: 'دیاریکردن', adv_btn_desel: 'لادانی دیاریکردن',
            adv_msg_found: 'دیاریکرا', adv_msg_none: 'هیچ نەدۆزرایەوە',
            adv_type_st: 'شەقام (St)', adv_type_ps: 'شەقامی سەرەکی (PS)', adv_type_mh: 'خێرایی لاوەکی (mH)',
            adv_type_maj: 'خێرایی سەرەکی (MH)', adv_type_fw: 'ڕێگای خێرا (Fw)', adv_type_rmp: 'ڕامپ (Rmp)',
            adv_type_plr: 'پارکینگ (PLR)', adv_type_pw: 'کۆڵان (Pw)', adv_type_pr: 'تایبەت (PR)',
            adv_type_or: 'ڕێگای خۆڵ (OR)',
            city_no_name: 'بێ شار',
            // Cities Checkbox
            cc_refresh: 'نوێکردنەوە', cc_draw: 'کێشان', cc_clear: 'پاککردنەوە',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'گەڕان بۆ ناوی شار...',
            cc_search_btn: 'گەڕان', cc_status_ready: 'ئامادەیە', cc_status_scan: 'گەڕان...',
            cc_msg_empty: 'نوێکردنەوە بکە یان بگەڕێ...', cc_check_all: 'هەمووی'
        },
        'kmr': {
            name: 'Kurdî (Kurmancî)',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Kontrola Nexşeyê', btn_adv: 'Hilbijartina Pêşkeftî',
            btn_inspector: 'Gerokê Bajar/Cih (Berfireh) 📊',
            btn_cities_check: 'Kontrola Sînorê Bajaran ☑',
            win_adv: 'Hilbijartina Pêşkeftî',
            win_inspector: 'Gerokê Bajar/Cih (Berfireh)',
            win_cities: 'Kontrola Sînorê Bajaran',
            common_scan: 'Lêgerîn', common_clear: 'Paqijkirin', common_close: 'Girtin', common_ready: 'Amade ye',
            no_results: 'Ti encam nehat dîtin',
            insp_tab_seg: '🛣️ Rê', insp_tab_ven: '📍 Cih', insp_tab_stats: '👥 Statîstîk',
            insp_col_name: 'Nav', insp_col_creator: 'Afirîner', insp_col_updater: 'Nûker',
            insp_lbl_roads: 'Rê', insp_lbl_places: 'Cih', insp_btn_rotate: 'Zivirandin',
            qa_title: 'Kontrola Nexşeyê', qa_btn_scan: '🔍 Lêgerîn', qa_btn_clear: 'Paqijkirin',
            qa_btn_gmaps: 'Google Maps 🌏', qa_msg_scanning: 'Lêgerîn...', qa_msg_clean: '✅ Paqij e', qa_msg_found: 'Hat dîtin', qa_msg_ready: 'Amade ye',
            qa_lbl_short: 'Kurt', qa_lbl_angle: 'Goşe', qa_lbl_cross: 'Yekbûn',
            qa_lbl_lock: 'Qufil', qa_lbl_ghost: 'Bê Bajar', qa_lbl_speed: 'Lez',
            qa_lbl_discon: 'Qutbûyî', qa_lbl_jagged: 'Xwar', qa_opt_exclude_rab: 'Bê Qada',
            qa_lbl_discon_mode: 'Qutbûyî:', qa_opt_discon_1w: 'Yek alî', qa_opt_discon_2w: 'Du alî',
            qa_lbl_limit_dist: 'Sînorê Dûrbûnê', qa_lbl_limit_angle: 'Sînorê Goşeyê',
            qa_unit_m: 'Metre', qa_unit_i: 'Mîl', qa_msg_no_segments: '⚠️ Nêzîk bike.',
            adv_lbl_crit: 'Pîvan:', adv_lbl_val: 'Nirx:',
            adv_opt_nocity: 'Bê Bajar', adv_opt_nospeed: 'Bê Lez',
            adv_opt_lock: 'Asta Qufilê', adv_opt_type: 'Cureyê Rê',
            adv_btn_sel: 'Hilbijartin', adv_btn_desel: 'Rakirin',
            adv_msg_found: 'Hat hilbijartin', adv_msg_none: 'Ti encam nehat dîtin',
            adv_type_st: 'Kolan (St)', adv_type_ps: 'Kolana Sereke (PS)', adv_type_mh: 'Lezgeha Biçûk (mH)',
            adv_type_maj: 'Lezgeha Mezin (MH)', adv_type_fw: 'Rêya Bilez (Fw)', adv_type_rmp: 'Ramp (Rmp)',
            adv_type_plr: 'Parking (PLR)', adv_type_pw: 'Rêya Taybet (Pw)', adv_type_pr: 'Taybet (PR)',
            adv_type_or: 'Rêya Axê (OR)',
            city_no_name: 'Bê Bajar',
            // Cities Checkbox
            cc_refresh: 'Nûkirin', cc_draw: 'Xêzkirin', cc_clear: 'Paqijkirin',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Navê bajêr binivîse...',
            cc_search_btn: 'Lêgerîn', cc_status_ready: 'Amade ye', cc_status_scan: 'Lêgerîn...',
            cc_msg_empty: 'Nûkirin bike an bigere...', cc_check_all: 'Hemî'
        },
        'es-ES': {
            name: 'Español',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Validador de Mapa', btn_adv: 'Selección Avanzada',
            btn_inspector: 'Explorador Completo 📊',
            btn_cities_check: 'Valid. Límites Ciudad ☑',
            win_adv: 'Selección Avanzada',
            win_inspector: 'Explorador Completo',
            win_cities: 'Validador Límites Ciudad',
            common_scan: 'Escanear', common_clear: 'Limpiar', common_close: 'Cerrar', common_ready: 'Listo',
            no_results: 'Sin resultados',
            insp_tab_seg: '🛣️ Vías', insp_tab_ven: '📍 Lugares', insp_tab_stats: '👥 Estadísticas',
            insp_col_name: 'Nombre', insp_col_creator: 'Creador', insp_col_updater: 'Actualizador',
            insp_lbl_roads: 'Vías', insp_lbl_places: 'Lugares', insp_btn_rotate: 'Rotar Ventana',
            qa_title: 'Validador', qa_btn_scan: '🔍 Escanear', qa_btn_clear: 'Limpiar', qa_btn_gmaps: 'Abrir Google Maps',
            qa_msg_scanning: 'Escaneando...', qa_msg_clean: '✅ Limpio', qa_msg_found: 'Encontrado', qa_msg_ready: 'Listo',
            qa_lbl_short: 'Corto', qa_lbl_angle: 'Ángulo', qa_lbl_cross: 'Cruce',
            qa_lbl_lock: 'Bloqueo', qa_lbl_ghost: 'Fantasma', qa_lbl_speed: 'Velocidad',
            qa_lbl_discon: 'Descon.', qa_lbl_jagged: 'Dentado', qa_opt_exclude_rab: 'Exc. Rotondas',
            qa_lbl_discon_mode: 'Tipo:', qa_opt_discon_1w: '1 Lado', qa_opt_discon_2w: '2 Lados',
            qa_lbl_limit_dist: 'Dist.', qa_lbl_limit_angle: 'Ángulo', qa_unit_m: 'm', qa_unit_i: 'mi', qa_msg_no_segments: 'Zoom In.',
            adv_lbl_crit: 'Criterio:', adv_lbl_val: 'Valor:',
            adv_opt_nocity: 'Sin Ciudad', adv_opt_nospeed: 'Sin Velocidad', adv_opt_lock: 'Bloqueo', adv_opt_type: 'Tipo',
            adv_btn_sel: 'Seleccionar', adv_btn_desel: 'Deseleccionar', adv_msg_found: 'Seleccionado', adv_msg_none: 'No encontrado',
            adv_type_st: 'Calle', adv_type_ps: 'Calle Principal', adv_type_mh: 'Carretera Menor',
            adv_type_maj: 'Carretera Mayor', adv_type_fw: 'Autopista', adv_type_rmp: 'Rampa',
            adv_type_plr: 'Estacionamiento', adv_type_pw: 'Camino Privado', adv_type_pr: 'Privado', adv_type_or: 'Off-Road',
            city_no_name: 'Sin Ciudad',
            // Cities Checkbox
            cc_refresh: 'Actualizar', cc_draw: 'Dibujar', cc_clear: 'Limpiar',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Buscar ciudad...',
            cc_search_btn: 'Buscar', cc_status_ready: 'Listo', cc_status_scan: 'Escaneando...',
            cc_msg_empty: 'Actualizar o Buscar...', cc_check_all: 'Todos'
        },
        'fr-FR': {
            name: 'Français',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Validateur de Carte', btn_adv: 'Sélection Avancée',
            btn_inspector: 'Explorateur Complet 📊',
            btn_cities_check: 'Valid. Limites Ville ☑',
            win_adv: 'Sélection Avancée',
            win_inspector: 'Explorateur Complet',
            win_cities: 'Validateur Limites Ville',
            common_scan: 'Scanner', common_clear: 'Effacer', common_close: 'Fermer', common_ready: 'Prêt',
            no_results: 'Aucun résultat',
            insp_tab_seg: '🛣️ Routes', insp_tab_ven: '📍 Lieux', insp_tab_stats: '👥 Stats',
            insp_col_name: 'Nom', insp_col_creator: 'Créateur', insp_col_updater: 'Mise à jour',
            insp_lbl_roads: 'Routes', insp_lbl_places: 'Lieux', insp_btn_rotate: 'Pivoter',
            qa_title: 'Validateur', qa_btn_scan: '🔍 Scanner', qa_btn_clear: 'Effacer', qa_btn_gmaps: 'Google Maps',
            qa_msg_scanning: 'Scan en cours...', qa_msg_clean: '✅ Propre', qa_msg_found: 'Trouvé', qa_msg_ready: 'Prêt',
            qa_lbl_short: 'Court', qa_lbl_angle: 'Angle', qa_lbl_cross: 'Croisement',
            qa_lbl_lock: 'Verrou', qa_lbl_ghost: 'Ville Fantôme', qa_lbl_speed: 'Vitesse',
            qa_lbl_discon: 'Déconnecté', qa_lbl_jagged: 'Irrégulier', qa_opt_exclude_rab: 'Exclure RP',
            qa_lbl_discon_mode: 'Type:', qa_opt_discon_1w: '1 Côté', qa_opt_discon_2w: '2 Côtés',
            qa_lbl_limit_dist: 'Dist.', qa_lbl_limit_angle: 'Angle', qa_unit_m: 'm', qa_unit_i: 'mi', qa_msg_no_segments: 'Zoomez.',
            adv_lbl_crit: 'Critère:', adv_lbl_val: 'Valeur:',
            adv_opt_nocity: 'Sans Ville', adv_opt_nospeed: 'Sans Vitesse', adv_opt_lock: 'Verrou', adv_opt_type: 'Type',
            adv_btn_sel: 'Sélectionner', adv_btn_desel: 'Désélectionner', adv_msg_found: 'Sélectionné', adv_msg_none: 'Aucun résultat',
            adv_type_st: 'Rue', adv_type_ps: 'Rue Principale', adv_type_mh: 'Autoroute Mineure',
            adv_type_maj: 'Autoroute Majeure', adv_type_fw: 'Autoroute', adv_type_rmp: 'Bretelle',
            adv_type_plr: 'Parking', adv_type_pw: 'Chemin Privé', adv_type_pr: 'Privé', adv_type_or: 'Tout-Terrain',
            city_no_name: 'Sans Ville',
            // Cities Checkbox
            cc_refresh: 'Actualiser', cc_draw: 'Dessiner', cc_clear: 'Effacer',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Chercher ville...',
            cc_search_btn: 'Chercher', cc_status_ready: 'Prêt', cc_status_scan: 'Recherche...',
            cc_msg_empty: 'Actualiser ou Chercher...', cc_check_all: 'Tous'
        },
        'ru-RU': {
            name: 'Русский',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Валидатор Карты', btn_adv: 'Расширенный Выбор',
            btn_inspector: 'Полный Инспектор 📊',
            btn_cities_check: 'Проверка Границ ☑',
            win_adv: 'Расширенный Выбор',
            win_inspector: 'Полный Инспектор',
            win_cities: 'Проверка Границ Города',
            common_scan: 'Поиск', common_clear: 'Очистить', common_close: 'Закрыть', common_ready: 'Готово',
            no_results: 'Нет результатов',
            insp_tab_seg: '🛣️ Дороги', insp_tab_ven: '📍 Места', insp_tab_stats: '👥 Стат.',
            insp_col_name: 'Имя', insp_col_creator: 'Создал', insp_col_updater: 'Обновил',
            insp_lbl_roads: 'Дороги', insp_lbl_places: 'Места', insp_btn_rotate: 'Повернуть',
            qa_title: 'Валидатор', qa_btn_scan: '🔍 Поиск', qa_btn_clear: 'Сброс', qa_btn_gmaps: 'Google Maps',
            qa_msg_scanning: 'Сканирование...', qa_msg_clean: '✅ Чисто', qa_msg_found: 'Найдено', qa_msg_ready: 'Готово',
            qa_lbl_short: 'Короткие', qa_lbl_angle: 'Угол', qa_lbl_cross: 'Пересечение',
            qa_lbl_lock: 'Лок', qa_lbl_ghost: 'Фантом', qa_lbl_speed: 'Скорость',
            qa_lbl_discon: 'Разрыв', qa_lbl_jagged: 'Зигзаг', qa_opt_exclude_rab: 'Без колец',
            qa_lbl_discon_mode: 'Тип:', qa_opt_discon_1w: '1 стор.', qa_opt_discon_2w: '2 стор.',
            qa_lbl_limit_dist: 'Дист.', qa_lbl_limit_angle: 'Угол', qa_unit_m: 'м', qa_unit_i: 'ми', qa_msg_no_segments: 'Зум!',
            adv_lbl_crit: 'Критерий:', adv_lbl_val: 'Значение:',
            adv_opt_nocity: 'Без города', adv_opt_nospeed: 'Без скорости', adv_opt_lock: 'Лок', adv_opt_type: 'Тип',
            adv_btn_sel: 'Выбрать', adv_btn_desel: 'Снять', adv_msg_found: 'Выбрано', adv_msg_none: 'Не найдено',
            adv_type_st: 'Улица', adv_type_ps: 'Главная улица', adv_type_mh: 'Шоссе',
            adv_type_maj: 'Магистраль', adv_type_fw: 'Автострада', adv_type_rmp: 'Рампа',
            adv_type_plr: 'Парковка', adv_type_pw: 'Проезд', adv_type_pr: 'Частная', adv_type_or: 'Грунт',
            city_no_name: 'Без Города',
            // Cities Checkbox
            cc_refresh: 'Обновить', cc_draw: 'Рисовать', cc_clear: 'Очистить',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Поиск города...',
            cc_search_btn: 'Поиск', cc_status_ready: 'Готово', cc_status_scan: 'Поиск...',
            cc_msg_empty: 'Обновите или Ищите...', cc_check_all: 'Все'
        },
        'pt-BR': {
            name: 'Português',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'Validador de Mapa', btn_adv: 'Seleção Avançada',
            btn_inspector: 'Inspetor Completo 📊',
            btn_cities_check: 'Valid. Limites Cid. ☑',
            win_adv: 'Seleção Avançada',
            win_inspector: 'Inspetor Completo',
            win_cities: 'Validador Limites Cidade',
            common_scan: 'Escanear', common_clear: 'Limpar', common_close: 'Fechar', common_ready: 'Pronto',
            no_results: 'Sem resultados',
            insp_tab_seg: '🛣️ Ruas', insp_tab_ven: '📍 Locais', insp_tab_stats: '👥 Estatísticas',
            insp_col_name: 'Nome', insp_col_creator: 'Criador', insp_col_updater: 'Atualizador',
            insp_lbl_roads: 'Ruas', insp_lbl_places: 'Locais', insp_btn_rotate: 'Girar',
            qa_title: 'Validador', qa_btn_scan: '🔍 Escanear', qa_btn_clear: 'Limpar', qa_btn_gmaps: 'Google Maps',
            qa_msg_scanning: 'Escaneando...', qa_msg_clean: '✅ Limpo', qa_msg_found: 'Encontrado', qa_msg_ready: 'Pronto',
            qa_lbl_short: 'Curto', qa_lbl_angle: 'Ângulo', qa_lbl_cross: 'Cruzamento',
            qa_lbl_lock: 'Trava', qa_lbl_ghost: 'Fantasma', qa_lbl_speed: 'Velocidade',
            qa_lbl_discon: 'Descon.', qa_lbl_jagged: 'Serrilhado', qa_opt_exclude_rab: 'Exc. Rot.',
            qa_lbl_discon_mode: 'Tipo:', qa_opt_discon_1w: '1 Lado', qa_opt_discon_2w: '2 Lados',
            qa_lbl_limit_dist: 'Dist.', qa_lbl_limit_angle: 'Ângulo', qa_unit_m: 'm', qa_unit_i: 'mi', qa_msg_no_segments: 'Zoom!',
            adv_lbl_crit: 'Critério:', adv_lbl_val: 'Valor:',
            adv_opt_nocity: 'Sem Cidade', adv_opt_nospeed: 'Sem Velocidade', adv_opt_lock: 'Trava', adv_opt_type: 'Tipo',
            adv_btn_sel: 'Selecionar', adv_btn_desel: 'Desmarcar', adv_msg_found: 'Selecionado', adv_msg_none: 'Nada encontrado',
            adv_type_st: 'Rua', adv_type_ps: 'Rua Principal', adv_type_mh: 'Rodovia Menor',
            adv_type_maj: 'Rodovia Maior', adv_type_fw: 'Autoestrada', adv_type_rmp: 'Rampa',
            adv_type_plr: 'Estacionamiento', adv_type_pw: 'Via Privada', adv_type_pr: 'Privado', adv_type_or: 'Off-Road',
            city_no_name: 'Sem Cidade',
            // Cities Checkbox
            cc_refresh: 'Atualizar', cc_draw: 'Desenhar', cc_clear: 'Limpar',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'Buscar cidade...',
            cc_search_btn: 'Buscar', cc_status_ready: 'Pronto', cc_status_scan: 'Buscando...',
            cc_msg_empty: 'Atualizar ou Buscar...', cc_check_all: 'Todos'
        },
        'he-IL': {
            name: 'עברית',
            main_title: 'Abdullah Abbas WME Tools',
            btn_qa: 'בודק מפה', btn_adv: 'בחירה מתקדמת',
            btn_inspector: 'סייר מקיף 📊',
            btn_cities_check: 'בודק גבולות ערים ☑',
            win_adv: 'בחירה מתקדמת',
            win_inspector: 'סייר מקיף',
            win_cities: 'בודק גבולות ערים',
            common_scan: 'סרוק', common_clear: 'נקה', common_close: 'סגור', common_ready: 'מוכן',
            no_results: 'אין תוצאות',
            insp_tab_seg: '🛣️ כבישים', insp_tab_ven: '📍 מקומות', insp_tab_stats: '👥 סטט\'',
            insp_col_name: 'שם', insp_col_creator: 'יוצר', insp_col_updater: 'מעדכן',
            insp_lbl_roads: 'כבישים', insp_lbl_places: 'מקומות', insp_btn_rotate: 'סובב',
            qa_title: 'בודק מפה', qa_btn_scan: '🔍 סרוק', qa_btn_clear: 'נקה', qa_btn_gmaps: 'Google Maps',
            qa_msg_scanning: 'סורק...', qa_msg_clean: '✅ נקי', qa_msg_found: 'נמצא', qa_msg_ready: 'מוכן',
            qa_lbl_short: 'קצר', qa_lbl_angle: 'זווית', qa_lbl_cross: 'צומת',
            qa_lbl_lock: 'נעילה', qa_lbl_ghost: 'רוח', qa_lbl_speed: 'מהירות',
            qa_lbl_discon: 'מנותק', qa_lbl_jagged: 'משונן', qa_opt_exclude_rab: 'ללא כיכר',
            qa_lbl_discon_mode: 'סוג:', qa_opt_discon_1w: 'צד 1', qa_opt_discon_2w: '2 צדדים',
            qa_lbl_limit_dist: 'מרחק', qa_lbl_limit_angle: 'זווית', qa_unit_m: 'מ\'', qa_unit_i: 'מייל', qa_msg_no_segments: 'התקרב!',
            adv_lbl_crit: 'קריטריון:', adv_lbl_val: 'ערך:',
            adv_opt_nocity: 'ללא עיר', adv_opt_nospeed: 'ללא מהירות', adv_opt_lock: 'נעילה', adv_opt_type: 'סוג',
            adv_btn_sel: 'בחר', adv_btn_desel: 'בטל בחירה', adv_msg_found: 'נבחר', adv_msg_none: 'לא נמצא',
            adv_type_st: 'רחוב', adv_type_ps: 'רחוב ראשי', adv_type_mh: 'כביש מהיר משני',
            adv_type_maj: 'כביש מהיר ראשי', adv_type_fw: 'כביש מהיר', adv_type_rmp: 'רמפה',
            adv_type_plr: 'חניון', adv_type_pw: 'דרך פרטית', adv_type_pr: 'פרטי', adv_type_or: 'שטח',
            city_no_name: 'ללא עיר',
            // Cities Checkbox
            cc_refresh: 'רענן', cc_draw: 'צייר', cc_clear: 'נקה הכל',
            cc_waze_src: 'Waze', cc_osm_src: 'OSM', cc_search_ph: 'חפש עיר...',
            cc_search_btn: 'חפש', cc_status_ready: 'מוכן', cc_status_scan: 'מחפש...',
            cc_msg_empty: 'רענן או חפש...', cc_check_all: 'בחר הכל'
        }
    };

    // Default to English if not set, otherwise load from storage
    // If first time (null), use 'en-US' as requested
    let currentLang = localStorage.getItem('AA_Lang') || 'en-US';

    const _t = (key) => {
        let langObj = STRINGS[currentLang] || STRINGS['en-US'];
        return langObj[key] || STRINGS['en-US'][key] || key;
    };

    // Check for RTL languages
    const RTL_LANGS = ['ar', 'he', 'ckb', 'fa', 'ur'];
    const _dir = () => RTL_LANGS.some(l => currentLang.startsWith(l)) ? 'rtl' : 'ltr';

    // ===========================================================================
    //  CORE UTILITIES
    // ===========================================================================
    function getAllObjects(modelName) {
        if(!W || !W.model || !W.model[modelName]) return [];
        var repo = W.model[modelName];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    class UIBuilder {
        static getSavedState(id) {
            try { return JSON.parse(localStorage.getItem(`AA_Win_${id}`)) || null; } catch (e) { return null; }
        }

        static saveState(id, element) {
            const state = {
                top: element.style.top, left: element.style.left,
                width: element.style.width, height: element.style.height,
                display: element.style.display
            };
            localStorage.setItem(`AA_Win_${id}`, JSON.stringify(state));
        }

        static createFloatingWindow(id, titleKey, colorClass, contentHtml, fixedSize = null) {
            let win = document.getElementById(id);
            if (win) {
                win.style.display = (win.style.display === 'none' ? 'block' : 'none');
                if(win.style.display === 'block') UIBuilder.saveState(id, win);
                return win;
            }

            const state = UIBuilder.getSavedState(id) || {
                top: '100px', left: '100px',
                width: fixedSize ? fixedSize.w : DEFAULT_W,
                height: fixedSize ? fixedSize.h : DEFAULT_H
            };

            win = document.createElement('div');
            win.id = id;
            win.className = `aa-window ${_dir()}`;
            win.style.top = state.top;
            win.style.left = state.left;
            win.style.width = fixedSize ? fixedSize.w : state.width;
            win.style.height = fixedSize ? fixedSize.h : state.height;
            win.style.display = 'block';

            const header = document.createElement('div');
            header.className = `aa-header ${colorClass}`;
            header.innerHTML = `<span>${_t(titleKey)}</span><span class="aa-close">✖</span>`;

            const content = document.createElement('div');
            content.className = 'aa-content';
            content.innerHTML = contentHtml;

            win.appendChild(header);
            win.appendChild(content);
            document.body.appendChild(win);

            win.querySelector('.aa-close').onclick = () => { win.style.display = 'none'; UIBuilder.saveState(id, win); };

            let isDragging = false, startX, startY, initialLeft, initialTop;
            header.onmousedown = (e) => {
                if(e.target.className === 'aa-close') return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;
                document.onmousemove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    win.style.left = (initialLeft + e.clientX - startX) + 'px';
                    win.style.top = (initialTop + e.clientY - startY) + 'px';
                };
                document.onmouseup = () => { isDragging = false; document.onmousemove = null; document.onmouseup = null; UIBuilder.saveState(id, win); };
            };

            if(!fixedSize) {
                let resizeTimeout;
                new ResizeObserver(() => {
                    if(win.style.display === 'none') return;
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => { UIBuilder.saveState(id, win); }, 500);
                }).observe(win);
            } else { win.style.resize = 'none'; }
            return win;
        }
    }

    // ===========================================================================
    //  MODULE: COMPREHENSIVE CITY INSPECTOR (Landscape Default)
    // ===========================================================================
    const CityInspectorModule = {
        isPortrait: false, // Default to Landscape (Wide)
        init: () => {
            const html = `
                <div id="nli-container">
                    <div class="nli-controls" style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="nli-btn-group" style="flex-grow:1;">
                            <button id="nli-btn-scan" class="nli-btn nli-btn-scan">🔍 ${_t('common_scan')}</button>
                            <button id="nli-btn-clear" class="nli-btn nli-btn-clear">🗑️ ${_t('common_clear')}</button>
                        </div>
                        <button id="nli-orientation-btn" class="nli-btn aa-bg-indigo" style="width:auto; margin-right:5px; padding:6px 12px; font-size:16px;" title="${_t('insp_btn_rotate')}">⟲</button>
                    </div>
                    <div id="nli-results-list">
                        <div style="text-align:center; color:#aaa; margin-top:50px;">${_t('common_ready')}</div>
                    </div>
                </div>
            `;
            // Default Landscape Size: 750px wide
            UIBuilder.createFloatingWindow('AA_InspWin', 'win_inspector', 'aa-bg-darkblue', html, {w: '750px', h: '500px'});

            document.getElementById('nli-btn-scan').onclick = CityInspectorModule.runScan;
            document.getElementById('nli-btn-clear').onclick = () => {
                document.getElementById('nli-results-list').innerHTML = '';
                W.selectionManager.unselectAll();
            };

            document.getElementById('nli-orientation-btn').onclick = CityInspectorModule.toggleOrientation;
        },

        toggleOrientation: () => {
            const win = document.getElementById('AA_InspWin');
            if(!win) return;
            CityInspectorModule.isPortrait = !CityInspectorModule.isPortrait;
            if(CityInspectorModule.isPortrait) {
                win.style.width = '350px'; win.style.height = '550px';
            } else {
                win.style.width = '750px'; win.style.height = '500px';
            }
        },

        runScan: () => {
            const resDiv = document.getElementById('nli-results-list');
            if(!resDiv) return;
            resDiv.innerHTML = '<div style="text-align:center; padding:20px; color:#27ae60;">...</div>';

            setTimeout(() => {
                const extent = W.map.getExtent();
                let cityData = {};
                const processObj = (obj, type) => {
                    let cName = CityInspectorModule.getCityName(obj, type);
                    if (!cityData[cName]) cityData[cName] = { segments: [], venues: [], editors: {} };
                    cityData[cName][type === 'segment' ? 'segments' : 'venues'].push(obj);
                    let creator = CityInspectorModule.getUserName(obj.attributes.createdBy);
                    let updater = CityInspectorModule.getUserName(obj.attributes.updatedBy);
                    if(!cityData[cName].editors[creator]) cityData[cName].editors[creator] = { created: 0, updated: 0 };
                    cityData[cName].editors[creator].created++;
                    if(!cityData[cName].editors[updater]) cityData[cName].editors[updater] = { created: 0, updated: 0 };
                    cityData[cName].editors[updater].updated++;
                };
                for (let id in W.model.segments.objects) {
                    let seg = W.model.segments.objects[id];
                    if (seg.geometry && extent.intersectsBounds(seg.geometry.getBounds())) processObj(seg, 'segment');
                }
                for (let id in W.model.venues.objects) {
                    let ven = W.model.venues.objects[id];
                    if (ven.geometry && extent.intersectsBounds(ven.geometry.getBounds())) processObj(ven, 'venue');
                }
                resDiv.innerHTML = '';
                let sortedCities = Object.keys(cityData).sort();
                if (sortedCities.length === 0) {
                    resDiv.innerHTML = `<div style="text-align:center; padding:20px; color:#999;">${_t('no_results')}</div>`;
                    return;
                }
                sortedCities.forEach(city => {
                    let data = cityData[city];
                    let segCount = data.segments.length;
                    let venCount = data.venues.length;
                    let card = document.createElement('div'); card.className = 'nli-city-card';
                    let header = document.createElement('div'); header.className = 'nli-city-header';
                    header.innerHTML = `<div style="display:flex; align-items:center; flex-grow:1;"><span class="nli-arrow-btn">◀</span><span class="nli-city-title">${city}</span></div><span class="nli-counts-badge">${_t('insp_lbl_roads')}: ${segCount} | ${_t('insp_lbl_places')}: ${venCount}</span>`;
                    let details = document.createElement('div'); details.className = 'nli-city-details';
                    let safeID = city.replace(/[^a-zA-Z0-9]/g, '');
                    details.innerHTML = `<div class="nli-tabs"><div class="nli-tab active" data-tab="seg">${_t('insp_tab_seg')}</div><div class="nli-tab" data-tab="ven">${_t('insp_tab_ven')}</div><div class="nli-tab" data-tab="edit">${_t('insp_tab_stats')}</div></div><div class="nli-tab-content" id="content-${safeID}"></div>`;
                    const arrowBtn = header.querySelector('.nli-arrow-btn');
                    arrowBtn.onclick = (e) => {
                        e.stopPropagation();
                        let isOpen = details.style.display === 'block'; details.style.display = isOpen ? 'none' : 'block';
                        if (isOpen) arrowBtn.classList.remove('open'); else arrowBtn.classList.add('open');
                        if (!isOpen) CityInspectorModule.renderTabContent(details.querySelector('.nli-tab-content'), 'seg', data);
                    };
                    const titleBtn = header.querySelector('.nli-city-title');
                    titleBtn.onclick = (e) => { e.stopPropagation(); CityInspectorModule.selectAndCenter([...data.segments, ...data.venues]); };
                    details.querySelectorAll('.nli-tab').forEach(tab => {
                        tab.onclick = (e) => {
                            e.stopPropagation(); details.querySelectorAll('.nli-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
                            CityInspectorModule.renderTabContent(details.querySelector('.nli-tab-content'), tab.dataset.tab, data);
                        };
                    });
                    card.appendChild(header); card.appendChild(details); resDiv.appendChild(card);
                });
            }, 50);
        },

        renderTabContent: (container, tabType, data) => {
            container.innerHTML = '';
            if (tabType === 'seg' || tabType === 'ven') {
                let list = tabType === 'seg' ? data.segments : data.venues;
                if (list.length === 0) { container.innerHTML = `<div style="padding:15px; text-align:center; color:#999;">-</div>`; return; }
                let header = document.createElement('div'); header.className = 'nli-col-header';
                header.innerHTML = `<div class="col-name">${_t('insp_col_name')}</div><div class="col-user">${_t('insp_col_creator')}</div><div class="col-user">${_t('insp_col_updater')}</div>`;
                container.appendChild(header);

                list.forEach(obj => {
                    let row = document.createElement('div'); row.className = 'nli-row-item';
                    let name = CityInspectorModule.getItemName(obj, tabType === 'seg' ? 'segment' : 'venue');
                    let creator = CityInspectorModule.getUserName(obj.attributes.createdBy);
                    let createdDate = CityInspectorModule.formatDate(obj.attributes.createdOn);
                    let updater = CityInspectorModule.getUserName(obj.attributes.updatedBy);
                    let updatedDate = CityInspectorModule.formatDate(obj.attributes.updatedOn);

                    row.innerHTML = `
                        <div class="col-name" title="${name}">${name}</div>
                        <div class="col-user">
                            <span class="badge-create" title="${creator}">${creator}</span>
                            <span class="date-label">(${createdDate})</span>
                        </div>
                        <div class="col-user">
                            <span class="badge-update" title="${updater}">${updater}</span>
                            <span class="date-label">(${updatedDate})</span>
                        </div>
                    `;
                    row.onclick = () => CityInspectorModule.selectAndCenter(obj);
                    container.appendChild(row);
                });
            } else if (tabType === 'edit') {
                let sortedEditors = Object.keys(data.editors).sort((a,b) => {
                    return (data.editors[b].created + data.editors[b].updated) - (data.editors[a].created + data.editors[a].updated);
                });
                if (sortedEditors.length === 0) { container.innerHTML = '<div style="padding:15px; text-align:center; color:#999;">-</div>'; return; }
                let header = document.createElement('div'); header.className = 'nli-editor-row'; header.style.background = '#f9f9f9'; header.style.fontWeight = 'bold';
                header.innerHTML = `<span>${_t('insp_hdr_editor')}</span> <span>${_t('insp_hdr_crup')}</span>`;
                container.appendChild(header);
                sortedEditors.forEach(edName => {
                    let stat = data.editors[edName];
                    let row = document.createElement('div'); row.className = 'nli-editor-row';
                    row.innerHTML = `<span class="nli-editor-name">${edName}</span><span><span style="color:green; font-weight:bold;">${stat.created}</span> / <span style="color:blue; font-weight:bold;">${stat.updated}</span></span>`;
                    container.appendChild(row);
                });
            }
        },

        getCityName: (modelObject, type) => {
            let cityName = _t('city_no_name'); let streetID = null;
            if (type === 'segment') streetID = modelObject.attributes.primaryStreetID;
            else if (type === 'venue') streetID = modelObject.attributes.streetID;
            if (streetID) {
                let street = W.model.streets.objects[streetID];
                if (street && street.attributes.cityID) {
                    let city = W.model.cities.objects[street.attributes.cityID];
                    if (city && city.attributes.name && city.attributes.name.trim().length > 0) cityName = city.attributes.name;
                }
            }
            return cityName;
        },
        getUserName: (userID) => {
            if (!userID) return "-";
            if (W.model.users.objects[userID]) {
                let u = W.model.users.objects[userID];
                if (u.attributes && u.attributes.userName) return u.attributes.userName;
                if (u.userName) return u.userName;
            }
            return "ID:" + userID;
        },
        getItemName: (obj, type) => {
            if (type === 'venue') return obj.attributes.name || _t('common_no_name');
            let streetID = obj.attributes.primaryStreetID;
            if (streetID) {
                let street = W.model.streets.objects[streetID];
                if (street && street.attributes.name) return street.attributes.name;
            }
            return _t('common_no_name');
        },
        formatDate: (timestamp) => {
            if (!timestamp) return "";
            return new Date(timestamp).toLocaleDateString('en-GB');
        },
        selectAndCenter: (models) => {
            if (!models || (Array.isArray(models) && models.length === 0)) return;
            let arr = Array.isArray(models) ? models : [models];
            W.selectionManager.setSelectedModels(arr);
            let bounds = null;
            arr.forEach(m => {
                if (m.geometry) {
                    if (!bounds) bounds = m.geometry.getBounds().clone(); else bounds.extend(m.geometry.getBounds());
                }
            });
            if (bounds) W.map.setCenter(bounds.getCenterLonLat());
        }
    };

    // ===========================================================================
    //  MODULE: CITIES CHECKBOX (Merged)
    // ===========================================================================
    const CitiesCheckboxModule = {
        overlayLayer: null,
        currentCities: [],
        abortOperation: false,

        init: () => {
            const html = `
                <div id="aa-cc-container">
                    <div id="aa-controls" style="display:flex; gap:5px; margin-bottom:10px;">
                        <button id="aa-refresh-btn" class="aa-btn aa-bg-cyan" style="flex:1;">${_t('cc_refresh')}</button>
                        <button id="aa-draw-btn" class="aa-btn aa-bg-green" style="flex:1;">${_t('cc_draw')}</button>
                        <button id="aa-clear-btn" class="aa-btn aa-bg-red" style="flex:1;">${_t('cc_clear')}</button>
                    </div>

                    <div id="aa-sources" style="padding:5px; background:#e3f2fd; border:1px solid #bbdefb; border-radius:4px; margin-bottom:10px; font-size:12px; font-weight:bold; color:#0d47a1; text-align:center;">
                        <label style="margin-right:10px; cursor:pointer;"><input type="checkbox" id="aa-src-waze" checked> ${_t('cc_waze_src')}</label>
                        <label style="cursor:pointer;"><input type="checkbox" id="aa-src-osm" checked> ${_t('cc_osm_src')}</label>
                    </div>

                    <div id="aa-search-area" style="display:flex; gap:5px; margin-bottom:10px;">
                        <input type="text" id="aa-ext-input" class="aa-input" placeholder="${_t('cc_search_ph')}">
                        <button id="aa-ext-search-btn" class="aa-btn aa-bg-indigo" style="flex:0 0 60px;">${_t('cc_search_btn')}</button>
                    </div>

                    <div id="aa-list-container" style="background:#fff; border:1px solid #ddd; height:250px; overflow-y:auto; padding:5px; border-radius:4px;">
                        <div class="aa-empty-msg" style="text-align:center; color:#888; margin-top:20px;">${_t('cc_msg_empty')}</div>
                    </div>

                    <div id="aa-status" style="margin-top:5px; font-size:11px; font-weight:bold; color:#0056b3; text-align:center;">${_t('cc_status_ready')}</div>
                </div>
            `;
            UIBuilder.createFloatingWindow('AA_CitiesWin', 'win_cities', 'aa-bg-teal', html, {w: '380px', h: '460px'});

            CitiesCheckboxModule.getLayer(); // Ensure layer exists

            // Bind Events
            document.getElementById('aa-refresh-btn').onclick = CitiesCheckboxModule.updateLiveList;
            document.getElementById('aa-draw-btn').onclick = CitiesCheckboxModule.drawSelected;
            document.getElementById('aa-clear-btn').onclick = CitiesCheckboxModule.clearAll;
            document.getElementById('aa-ext-search-btn').onclick = CitiesCheckboxModule.performSearch;
        },

        getLayer: () => {
            const layerName = "AA_Checkbox_Layer";
            let layer = W.map.getLayersBy("uniqueName", layerName)[0];
            if (!layer) {
                layer = new OpenLayers.Layer.Vector("City Checkbox (AA)", {
                    uniqueName: layerName,
                    displayInLayerSwitcher: true,
                    styleMap: new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            strokeColor: "${strokeColor}",
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            fillColor: "${fillColor}",
                            fillOpacity: 0.5,
                            label: "${label}",
                            fontColor: "white",
                            fontSize: "13px",
                            fontWeight: "bold",
                            labelOutlineColor: "black",
                            labelOutlineWidth: 3,
                            graphicZIndex: 999
                        })
                    })
                });
                W.map.addLayer(layer);
            }
            CitiesCheckboxModule.overlayLayer = layer;
            return layer;
        },

        updateLiveList: () => {
            CitiesCheckboxModule.abortOperation = false;
            const segments = W.model.segments.objects;
            const cityMap = new Map();

            for (let id in segments) {
                const seg = segments[id];
                if (!seg || seg.state === 'Delete') continue;
                const addr = seg.getAddress();
                if (addr && !addr.isEmpty()) {
                    const city = addr.getCity();
                    if (city && city.attributes.name && city.attributes.name.trim() !== "") {
                        if (!cityMap.has(city.attributes.name)) {
                            cityMap.set(city.attributes.name, {
                                id: city.attributes.name,
                                name: city.attributes.name,
                                source: 'waze'
                            });
                        }
                    }
                }
            }

            CitiesCheckboxModule.currentCities = Array.from(cityMap.values());
            CitiesCheckboxModule.currentCities.sort((a, b) => a.name.localeCompare(b.name));
            CitiesCheckboxModule.renderList();
        },

        performSearch: async () => {
            const query = document.getElementById('aa-ext-input').value.trim();
            if(!query) return;

            CitiesCheckboxModule.abortOperation = false;
            const status = document.getElementById('aa-status');
            const listContainer = document.getElementById('aa-list-container');

            status.innerText = _t('cc_status_scan');
            listContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">...</div>';

            const useWaze = document.getElementById('aa-src-waze').checked;
            const useOSM = document.getElementById('aa-src-osm').checked;

            let searchResults = [];

            if (useWaze) {
                const segments = W.model.segments.objects;
                const foundNames = new Set();
                for (let id in segments) {
                    const seg = segments[id];
                    if (!seg || seg.state === 'Delete') continue;
                    const addr = seg.getAddress();
                    if (addr && !addr.isEmpty()) {
                        const city = addr.getCity();
                        if (city && city.attributes.name && city.attributes.name.includes(query)) {
                            if (!foundNames.has(city.attributes.name)) {
                                foundNames.add(city.attributes.name);
                                searchResults.push({ id: city.attributes.name, name: city.attributes.name, source: 'waze' });
                            }
                        }
                    }
                }
            }

            if (useOSM) {
                try {
                    const osmData = await CitiesCheckboxModule.fetchOSMResults(query);
                    osmData.forEach(item => {
                        searchResults.push({
                            id: 'osm_' + item.place_id,
                            name: item.display_name.split(',')[0],
                            fullName: item.display_name,
                            source: 'osm',
                            geojson: item.geojson
                        });
                    });
                } catch(e) { console.error(e); }
            }

            CitiesCheckboxModule.currentCities = searchResults;
            CitiesCheckboxModule.renderList();
            status.innerText = `${_t('qa_msg_found')}: ${searchResults.length}`;
        },

        fetchOSMResults: (query) => {
            return new Promise((resolve) => {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&polygon_geojson=1&limit=10&countrycodes=iq`;
                GM_xmlhttpRequest({
                    method: "GET", url: url,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const polygons = data.filter(d => d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon'));
                            resolve(polygons);
                        } catch (e) { resolve([]); }
                    },
                    onerror: function() { resolve([]); }
                });
            });
        },

        renderList: () => {
            const container = document.getElementById('aa-list-container');
            container.innerHTML = '';
            if (CitiesCheckboxModule.currentCities.length === 0) {
                container.innerHTML = `<div class="aa-empty-msg" style="text-align:center; padding:20px;">${_t('no_results')}</div>`;
                return;
            }

            const allDiv = document.createElement('div');
            allDiv.className = 'aa-list-item aa-all-item';
            const allCheck = document.createElement('input');
            allCheck.type = 'checkbox'; allCheck.className = 'aa-checkbox'; allCheck.id = 'aa-check-all';
            allCheck.onchange = function() { document.querySelectorAll('.aa-city-check').forEach(cb => cb.checked = this.checked); };
            const allLabel = document.createElement('span');
            allLabel.className = 'aa-label-text';
            allLabel.innerText = `${_t('cc_check_all')} (${CitiesCheckboxModule.currentCities.length})`;
            allLabel.onclick = function() { allCheck.checked = !allCheck.checked; allCheck.onchange(); };
            allDiv.appendChild(allCheck); allDiv.appendChild(allLabel); container.appendChild(allDiv);

            CitiesCheckboxModule.currentCities.forEach((city, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'aa-list-item';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox'; checkbox.className = 'aa-checkbox aa-city-check'; checkbox.value = index;
                const label = document.createElement('span'); label.className = 'aa-label-text';
                const badge = document.createElement('span');
                badge.className = `aa-source-badge badge-${city.source}`;

                // Translated Badge Text
                badge.innerText = city.source === 'waze' ? _t('cc_waze_src') : _t('cc_osm_src');

                const nameSpan = document.createElement('span'); nameSpan.innerText = city.name;
                if(city.fullName) nameSpan.title = city.fullName;

                label.appendChild(nameSpan); label.appendChild(badge);
                label.onclick = function() { checkbox.checked = !checkbox.checked; };
                itemDiv.appendChild(checkbox); itemDiv.appendChild(label); container.appendChild(itemDiv);
            });
        },

        drawSelected: () => {
            CitiesCheckboxModule.abortOperation = false;
            const status = document.getElementById('aa-status');
            CitiesCheckboxModule.getLayer().removeAllFeatures();
            const checkboxes = document.querySelectorAll('.aa-city-check:checked');
            if (checkboxes.length === 0) { status.innerText = _t('no_results'); return; }

            checkboxes.forEach(cb => {
                if (CitiesCheckboxModule.abortOperation) return;
                const index = parseInt(cb.value);
                const city = CitiesCheckboxModule.currentCities[index];
                const color = CitiesCheckboxModule.getRandomColor();

                if (city.source === 'waze') {
                    const hullGeom = CitiesCheckboxModule.getHullByName(city.name);
                    if (hullGeom) CitiesCheckboxModule.drawFeature(hullGeom, color, city.name);
                } else if (city.source === 'osm' && city.geojson) {
                    const features = CitiesCheckboxModule.transformGeoJSON(city.geojson);
                    if (features && features.length) {
                        features.forEach(feat => { feat.attributes = { strokeColor: color, fillColor: color, label: city.name }; });
                        CitiesCheckboxModule.overlayLayer.addFeatures(features);
                    }
                }
            });
            status.innerText = _t('cc_status_ready');
        },

        getHullByName: (cityName) => {
            const segments = W.model.segments.objects;
            const points = [];
            for (let id in segments) {
                const seg = segments[id];
                if (!seg || seg.state === 'Delete') continue;
                const addr = seg.getAddress();
                if (addr && !addr.isEmpty()) {
                    const city = addr.getCity();
                    if (city && city.attributes.name === cityName) {
                        seg.geometry.components.forEach(pt => { points.push({x: pt.x, y: pt.y}); });
                    }
                }
            }
            if (points.length < 3) return null;
            const hullPoints = CitiesCheckboxModule.convexHull(points);
            const ringPoints = hullPoints.map(p => new OpenLayers.Geometry.Point(p.x, p.y));
            ringPoints.push(ringPoints[0]);
            return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(ringPoints)]);
        },

        convexHull: (points) => {
            points.sort((a, b) => a.x != b.x ? a.x - b.x : a.y - b.y);
            const n = points.length;
            const hull = [];
            if (n <= 2) return points;
            const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
            for (let i = 0; i < n; i++) {
                while (hull.length >= 2 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) hull.pop();
                hull.push(points[i]);
            }
            for (let i = n - 2, t = hull.length + 1; i >= 0; i--) {
                while (hull.length >= t && crossProduct(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) hull.pop();
                hull.push(points[i]);
            }
            hull.pop();
            return hull;
        },

        transformGeoJSON: (geojson) => {
            const format = new OpenLayers.Format.GeoJSON({
                'internalProjection': W.map.getProjectionObject(),
                'externalProjection': new OpenLayers.Projection("EPSG:4326")
            });
            return format.read(geojson);
        },

        drawFeature: (geometry, color, label) => {
            const feature = new OpenLayers.Feature.Vector(geometry, {
                strokeColor: color, fillColor: color, label: label
            });
            CitiesCheckboxModule.overlayLayer.addFeatures([feature]);
        },

        clearAll: () => {
            CitiesCheckboxModule.abortOperation = true;
            if (CitiesCheckboxModule.overlayLayer) CitiesCheckboxModule.overlayLayer.removeAllFeatures();
            document.getElementById('aa-list-container').innerHTML = `<div class="aa-empty-msg" style="text-align:center; margin-top:20px; color:#888;">${_t('cc_msg_empty')}</div>`;
            CitiesCheckboxModule.currentCities = [];
            document.getElementById('aa-ext-input').value = "";
            document.getElementById('aa-status').innerText = _t('cc_status_ready');
        },

        getRandomColor: () => {
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#F5FF33', '#8C33FF', '#00FFFF', '#FF8C00', '#E91E63', '#9C27B0'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    };

    // ===========================================================================
    //  EXISTING MODULES
    // ===========================================================================
    const ValidatorCleanUI = {
        qaLayer: null,
        visualLayer: null,
        isInitialized: false,
        settings: {
            checkShort: false,
            checkAngle: false,
            checkCross: false,
            checkLock: false,
            checkGhost: false,
            checkSpeed: false,
            checkDiscon: false,
            checkJagged: false,
            limitShort: 6,
            limitAngle: 30,
            excludeRAB: true,
            unitSystem: 'metric',
            disconMode: '2w',
            winTop: '100px',
            winLeft: '100px',
            winWidth: DEFAULT_W,
            winHeight: DEFAULT_H
        },
        SETTINGS_STORE: 'AA_WME_VALIDATOR_V18',
        init: () => {
            if (ValidatorCleanUI.isInitialized) {
                ValidatorCleanUI.toggle();
                return;
            }
            ValidatorCleanUI.loadSettings();
            ValidatorCleanUI.createWindow();
            ValidatorCleanUI.isInitialized = true;
            ValidatorCleanUI.toggle();
        },
        toggle: () => {
            const win = document.getElementById('aa-qa-pro-window');
            if (win) {
                win.style.display = (win.style.display === 'none' ? 'block' : 'none');
                if (win.style.display === 'block') ValidatorCleanUI.saveSettings();
            }
        },
        loadSettings: () => {
            const s = localStorage.getItem(ValidatorCleanUI.SETTINGS_STORE);
            if (s) ValidatorCleanUI.settings = { ...ValidatorCleanUI.settings,
                ...JSON.parse(s)
            };
            if (!ValidatorCleanUI.settings.limitShort) ValidatorCleanUI.settings.limitShort = 6;
            if (!ValidatorCleanUI.settings.limitAngle) ValidatorCleanUI.settings.limitAngle = 30;
            if (!ValidatorCleanUI.settings.winWidth) ValidatorCleanUI.settings.winWidth = DEFAULT_W;
            if (!ValidatorCleanUI.settings.winHeight) ValidatorCleanUI.settings.winHeight = DEFAULT_H;
            if (!ValidatorCleanUI.settings.disconMode || ValidatorCleanUI.settings.disconMode === 'all') ValidatorCleanUI.settings.disconMode = '2w';
        },
        saveSettings: () => {
            localStorage.setItem(ValidatorCleanUI.SETTINGS_STORE, JSON.stringify(ValidatorCleanUI.settings));
        },
        openGMaps: () => {
            if (!W || !W.map) return;
            const center = W.map.getCenter();
            const lonlat = new OpenLayers.LonLat(center.lon, center.lat).transform(W.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            const url = `https://www.google.com/maps?q=${lonlat.lat},${lonlat.lon}`;
            window.open(url, '_blank');
        },
        scanMap: () => {
            if (typeof W === 'undefined' || !W.map || !W.model) return;
            const statusEl = document.getElementById('aa_qa_status');
            statusEl.innerText = _t('qa_msg_scanning');
            statusEl.style.color = '#2196F3';
            if (!ValidatorCleanUI.qaLayer) {
                ValidatorCleanUI.qaLayer = new OpenLayers.Layer.Vector("AA_QA_Results", {
                    displayInLayerSwitcher: true
                });
                W.map.addLayer(ValidatorCleanUI.qaLayer);
            }
            ValidatorCleanUI.qaLayer.removeAllFeatures();
            ValidatorCleanUI.qaLayer.setVisibility(true);
            ValidatorCleanUI.qaLayer.setZIndex(1001);
            W.selectionManager.unselectAll();
            const extent = W.map.getExtent();
            const segments = W.model.segments.getObjectArray().filter(s => s.geometry && extent.intersectsBounds(s.geometry.getBounds()));
            const nodes = W.model.nodes.getObjectArray().filter(n => n.geometry && extent.intersectsBounds(n.geometry.getBounds()));
            if (segments.length === 0) {
                statusEl.innerText = _t('qa_msg_no_segments');
                statusEl.style.color = '#F44336';
                return;
            }
            const features = [];
            const modelsToSelect = [];
            const isMetric = ValidatorCleanUI.settings.unitSystem === 'metric';
            const isRAB = (s) => s.isInRoundabout();
            const s = ValidatorCleanUI.settings;
            if (s.checkShort) {
                let limit = parseFloat(s.limitShort) || 6;
                if (!isMetric) limit = limit * 0.3048;
                segments.forEach(seg => {
                    if (!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    const len = seg.geometry.getGeodesicLength(W.map.getProjectionObject());
                    if (len < limit) {
                        const txt = isMetric ? Math.round(len) + 'm' : Math.round(len * 3.28) + 'ft';
                        features.push(ValidatorCleanUI.createFeature(seg.geometry, '#E91E63', txt));
                        modelsToSelect.push(seg);
                    }
                });
            }
            if (s.checkDiscon) {
                const ignoredTypes = [5, 10, 16, 18];
                segments.forEach(seg => {
                    if (!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    if (ignoredTypes.includes(seg.attributes.roadType)) return;
                    const nodeA = W.model.nodes.objects[seg.attributes.fromNodeID];
                    const nodeB = W.model.nodes.objects[seg.attributes.toNodeID];
                    if (!nodeA || !nodeB || !nodeA.geometry || !nodeB.geometry) return;
                    const conA = nodeA.attributes.segIDs.length;
                    const conB = nodeB.attributes.segIDs.length;
                    const visibleA = extent.intersectsBounds(nodeA.geometry.getBounds());
                    const visibleB = extent.intersectsBounds(nodeB.geometry.getBounds());
                    let isDisc = false;
                    if (s.disconMode === '2w') {
                        if (conA === 1 && conB === 1 && visibleA && visibleB) isDisc = true;
                    } else if (s.disconMode === '1w') {
                        const deadA = (conA === 1 && visibleA);
                        const deadB = (conB === 1 && visibleB);
                        if ((deadA && conB > 1) || (deadB && conA > 1)) isDisc = true;
                    }
                    if (isDisc) {
                        features.push(ValidatorCleanUI.createFeature(seg.geometry, '#FF5722', 'Disc'));
                        modelsToSelect.push(seg);
                    }
                });
            }
            if (s.checkJagged) {
                segments.forEach(seg => {
                    if (!seg.geometry) return;
                    if (s.excludeRAB && isRAB(seg)) return;
                    const verts = seg.geometry.getVertices();
                    const len = seg.geometry.getGeodesicLength(W.map.getProjectionObject());
                    if (verts.length > 3 && (len / verts.length) < 3) {
                        features.push(ValidatorCleanUI.createFeature(seg.geometry, '#795548', 'Jagged'));
                        modelsToSelect.push(seg);
                    }
                });
            }
            if (s.checkCross) {
                const items = segments.map(seg => ({
                    s: seg,
                    b: seg.geometry.getBounds()
                }));
                const ignoredTypes = [5, 10, 16, 18];
                for (let i = 0; i < items.length; i++) {
                    let item1 = items[i];
                    for (let j = i + 1; j < items.length; j++) {
                        let item2 = items[j];
                        if (!item1.b.intersectsBounds(item2.b)) continue;
                        let s1 = item1.s;
                        let s2 = item2.s;
                        if (ignoredTypes.includes(s1.attributes.roadType) || ignoredTypes.includes(s2.attributes.roadType)) continue;
                        if (s1.attributes.level === s2.attributes.level && s1.attributes.fromNodeID !== s2.attributes.fromNodeID && s1.attributes.fromNodeID !== s2.attributes.toNodeID && s1.attributes.toNodeID !== s2.attributes.fromNodeID && s1.attributes.toNodeID !== s2.attributes.toNodeID) {
                            if (s1.geometry.intersects(s2.geometry)) {
                                features.push(ValidatorCleanUI.createFeature(s1.geometry, '#D50000', 'X'));
                                if (!modelsToSelect.includes(s1)) modelsToSelect.push(s1);
                                if (!modelsToSelect.includes(s2)) modelsToSelect.push(s2);
                            }
                        }
                    }
                }
            }
            if (s.checkLock) segments.forEach(seg => {
                if (!seg.geometry) return;
                const rt = seg.attributes.roadType;
                const lock = (seg.attributes.lockRank || 0) + 1;
                let req = 1;
                if (rt === 3) req = 4;
                else if (rt === 6) req = 3;
                else if (rt === 7) req = 2;
                else if (rt === 4 && lock < 2) req = 2;
                if (lock < req) {
                    features.push(ValidatorCleanUI.createFeature(seg.geometry, '#F44336', `L${lock}`));
                    modelsToSelect.push(seg);
                }
            });
            if (s.checkGhost) segments.forEach(seg => {
                if (!seg.geometry) return;
                const sid = seg.attributes.primaryStreetID;
                if (sid) {
                    const st = W.model.streets.objects[sid];
                    if (st && st.attributes.name && st.attributes.name.trim() !== "") {
                        let ce = !st.attributes.cityID;
                        if (!ce) {
                            const c = W.model.cities.objects[st.attributes.cityID];
                            if (!c || !c.attributes.name || c.attributes.name.trim() === "") ce = true;
                        }
                        if (ce) {
                            features.push(ValidatorCleanUI.createFeature(seg.geometry, '#FF9800', 'NoCity'));
                            modelsToSelect.push(seg);
                        }
                    }
                }
            });
            if (s.checkSpeed) segments.forEach(seg => {
                if (!seg.geometry) return;
                if (s.excludeRAB && isRAB(seg)) return;
                const sp = seg.attributes.fwdMaxSpeed;
                if (!sp) return;
                const tn = W.model.nodes.objects[seg.attributes.toNodeID];
                if (tn && tn.attributes.segIDs.length === 2) {
                    const oid = tn.attributes.segIDs.find(id => id !== seg.attributes.id);
                    const os = W.model.segments.objects[oid];
                    if (os) {
                        let osp = (os.attributes.fromNodeID === tn.attributes.id) ? os.attributes.fwdMaxSpeed : os.attributes.revMaxSpeed;
                        if (osp > 0 && Math.abs(sp - osp) >= 30) {
                            features.push(ValidatorCleanUI.createFeature(tn.geometry, '#2196F3', 'Jump', true));
                            modelsToSelect.push(tn);
                        }
                    }
                }
            });
            if (s.checkAngle) nodes.forEach(n => {
                if (!n.geometry) return;
                if (n.attributes.segIDs.length < 2) return;
                const sg = n.attributes.segIDs.map(id => W.model.segments.objects[id]);
                if (s.excludeRAB && sg.some(seg => seg && isRAB(seg))) return;
                for (let i = 0; i < sg.length; i++)
                    for (let j = i + 1; j < sg.length; j++) {
                        if (!sg[i] || !sg[j] || !sg[i].geometry || !sg[j].geometry) continue;
                        const angle = ValidatorCleanUI.calculateAngleAtNode(n, sg[i], sg[j]);
                        if (angle < (parseFloat(s.limitAngle) || 30)) {
                            features.push(ValidatorCleanUI.createFeature(n.geometry, '#9C27B0', Math.round(angle) + '°', true));
                            if (!modelsToSelect.includes(n)) modelsToSelect.push(n);
                        }
                    }
            });
            ValidatorCleanUI.qaLayer.addFeatures(features);
            if (modelsToSelect.length > 0) {
                statusEl.innerText = `${_t('qa_msg_found')}: ${modelsToSelect.length}`;
                statusEl.style.color = '#D50000';
                W.selectionManager.setSelectedModels(modelsToSelect);
                let b = null;
                modelsToSelect.forEach(o => {
                    if (o.geometry) {
                        if (!b) b = o.geometry.getBounds().clone();
                        else b.extend(o.geometry.getBounds());
                    }
                });
                if (b) W.map.setCenter(b.getCenterLonLat());
            } else {
                statusEl.innerText = _t('qa_msg_clean');
                statusEl.style.color = '#4CAF50';
            }
        },
        createFeature: (geometry, color, label, isPoint = false) => {
            if (!geometry) return null;
            return new OpenLayers.Feature.Vector(geometry.clone(), {}, {
                strokeColor: color,
                strokeWidth: isPoint ? 0 : 6,
                strokeOpacity: 0.6,
                pointRadius: isPoint ? 7 : 0,
                fillColor: color,
                fillOpacity: 0.8,
                label: label,
                labelOutlineColor: "white",
                labelOutlineWidth: 2,
                fontSize: "10px",
                fontColor: color,
                labelYOffset: 16,
                fontWeight: "bold"
            });
        },
        calculateAngleAtNode: (node, s1, s2) => {
            const pNode = node.geometry;
            const getP = (s) => {
                const v = s.geometry.getVertices();
                return (s.attributes.fromNodeID === node.attributes.id) ? v[1] : v[v.length - 2];
            };
            const p1 = getP(s1);
            const p2 = getP(s2);
            const a = Math.sqrt(Math.pow(p1.x - pNode.x, 2) + Math.pow(p1.y - pNode.y, 2));
            const b = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            const c = Math.sqrt(Math.pow(p2.x - pNode.x, 2) + Math.pow(p2.y - pNode.y, 2));
            const cosC = (a * a + c * c - b * b) / (2 * a * c);
            return Math.acos(Math.max(-1, Math.min(1, cosC))) * 180 / Math.PI;
        },
        createWindow: () => {
            if (document.getElementById('aa-qa-pro-window')) return;
            const s = ValidatorCleanUI.settings;
            const win = document.createElement('div');
            win.id = 'aa-qa-pro-window';
            win.className = `aa-window ${_dir()}`;
            win.style.cssText = ` position: fixed; top: ${s.winTop}; left: ${s.winLeft}; width: ${s.winWidth}; height: ${s.winHeight}; background: #fff; border-radius: 8px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: none; font-family: 'Cairo', sans-serif, Arial; overflow: hidden; resize: none; direction: ${_dir()}; `;
            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'aa-qa-resize-handle';
            win.appendChild(resizeHandle);
            const head = document.createElement('div');
            head.className = 'aa-header aa-bg-orange';
            head.innerHTML = `<span>${_t('qa_title')}</span><span id="aa-qa-close" class="aa-close">✖</span>`;
            win.appendChild(head);
            const body = document.createElement('div');
            body.className = 'aa-content';
            const createChk = (key, label) => `<label class="aa-qa-chk-card"><input type="checkbox" id="aa_qa_${key}" ${s[key]?'checked':''} data-key="${key}"><span>${label}</span></label>`;
            let html = `<div class="aa-qa-grid"> ${createChk('checkShort',_t('qa_lbl_short'))} ${createChk('checkAngle',_t('qa_lbl_angle'))} ${createChk('checkCross',_t('qa_lbl_cross'))} ${createChk('checkLock',_t('qa_lbl_lock'))} ${createChk('checkGhost',_t('qa_lbl_ghost'))} ${createChk('checkSpeed',_t('qa_lbl_speed'))} ${createChk('checkDiscon',_t('qa_lbl_discon'))} ${createChk('checkJagged',_t('qa_lbl_jagged'))} <button id="aa_qa_gmaps_grid" class="aa-qa-grid-btn">${_t('qa_btn_gmaps')}</button> </div>`;
            html += `<div class="aa-qa-settings-box"> <div class="aa-qa-setting-row"><span>${_t('qa_opt_exclude_rab')}</span><input type="checkbox" id="aa_qa_excludeRAB" ${s.excludeRAB?'checked':''}></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_discon_mode')}</span><div class="aa-qa-pill"><div id="aa_qa_disc_1w" class="aa-qa-pill-opt ${s.disconMode==='1w'?'active':''}">${_t('qa_opt_discon_1w')}</div><div id="aa_qa_disc_2w" class="aa-qa-pill-opt ${s.disconMode==='2w'?'active':''}">${_t('qa_opt_discon_2w')}</div></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_unit_m')} / ${_t('qa_unit_i')}</span><div class="aa-qa-pill"><div id="aa_qa_unit_m" class="aa-qa-pill-opt ${s.unitSystem==='metric'?'active':''}">${_t('qa_unit_m')}</div><div id="aa_qa_unit_i" class="aa-qa-pill-opt ${s.unitSystem==='imperial'?'active':''}">${_t('qa_unit_i')}</div></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_dist')}</span><div><input type="number" id="aa_qa_limitShort" class="aa-qa-input" value="${s.limitShort}"> <span id="aa_qa_lbl_short_unit" style="color:#888;">${s.unitSystem==='metric'?'m':'ft'}</span></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_angle')}</span><div><input type="number" id="aa_qa_limitAngle" class="aa-qa-input" value="${s.limitAngle}"> <span>°</span></div></div> </div>`;
            html += `<div class="aa-qa-action-row"> <button id="aa_qa_scan" class="aa-qa-btn aa-btn-scan">${_t('qa_btn_scan')}</button> <button id="aa_qa_clear" class="aa-qa-btn aa-btn-clear">${_t('qa_btn_clear')}</button> </div>`;
            html += `<div id="aa_qa_status" style="text-align:center; margin-top:8px; font-weight:bold; font-size:11px; color:#777;">${_t('qa_msg_ready')}</div>`;
            body.innerHTML = html;
            win.appendChild(body);
            document.body.appendChild(win);
            document.getElementById('aa-qa-close').onclick = () => {
                win.style.display = 'none';
                ValidatorCleanUI.saveSettings();
            };
            document.getElementById('aa_qa_scan').onclick = ValidatorCleanUI.scanMap;
            document.getElementById('aa_qa_gmaps_grid').onclick = ValidatorCleanUI.openGMaps;
            document.getElementById('aa_qa_clear').onclick = () => {
                W.selectionManager.unselectAll();
                if (ValidatorCleanUI.qaLayer) ValidatorCleanUI.qaLayer.removeAllFeatures();
                if (ValidatorCleanUI.visualLayer) ValidatorCleanUI.visualLayer.removeAllFeatures();
                document.getElementById('aa_qa_status').innerText = _t('qa_msg_ready');
            };
            win.querySelectorAll('input[type="checkbox"][data-key]').forEach(c => {
                c.onchange = function() {
                    ValidatorCleanUI.settings[this.getAttribute('data-key')] = this.checked;
                    ValidatorCleanUI.saveSettings();
                };
            });
            document.getElementById('aa_qa_limitShort').onchange = (e) => {
                ValidatorCleanUI.settings.limitShort = e.target.value;
                ValidatorCleanUI.saveSettings();
            };
            document.getElementById('aa_qa_limitAngle').onchange = (e) => {
                ValidatorCleanUI.settings.limitAngle = e.target.value;
                ValidatorCleanUI.saveSettings();
            };
            document.getElementById('aa_qa_excludeRAB').onchange = (e) => {
                ValidatorCleanUI.settings.excludeRAB = e.target.checked;
                ValidatorCleanUI.saveSettings();
            };
            const setupPill = (ids, settingKey, values) => {
                ids.forEach((id, idx) => {
                    document.getElementById(id).onclick = () => {
                        ValidatorCleanUI.settings[settingKey] = values[idx];
                        ValidatorCleanUI.saveSettings();
                        ids.forEach((oid, oidx) => {
                            const el = document.getElementById(oid);
                            if (idx === oidx) el.classList.add('active');
                            else el.classList.remove('active');
                        });
                        if (settingKey === 'unitSystem') document.getElementById('aa_qa_lbl_short_unit').innerText = values[idx] === 'metric' ? 'm' : 'ft';
                    };
                });
            };
            setupPill(['aa_qa_unit_m', 'aa_qa_unit_i'], 'unitSystem', ['metric', 'imperial']);
            setupPill(['aa_qa_disc_1w', 'aa_qa_disc_2w'], 'disconMode', ['1w', '2w']);
            let isDrag = false,
                startX, startY, initialLeft, initialTop;
            head.onmousedown = (e) => {
                if (e.target.className.includes('aa-close')) return;
                isDrag = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;
                document.onmousemove = (e) => {
                    if (!isDrag) return;
                    e.preventDefault();
                    win.style.left = (initialLeft + e.clientX - startX) + 'px';
                    win.style.top = (initialTop + e.clientY - startY) + 'px';
                };
                document.onmouseup = () => {
                    isDrag = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                    ValidatorCleanUI.settings.winTop = win.style.top;
                    ValidatorCleanUI.settings.winLeft = win.style.left;
                    ValidatorCleanUI.saveSettings();
                };
            };
            const handle = document.getElementById('aa-qa-resize-handle');
            let isResizing = false,
                rStartX, rStartY, rStartW, rStartH;
            handle.onmousedown = (e) => {
                isResizing = true;
                rStartX = e.clientX;
                rStartY = e.clientY;
                rStartW = win.offsetWidth;
                rStartH = win.offsetHeight;
                e.stopPropagation();
                e.preventDefault();
            };
            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const newW = rStartW + (rStartX - e.clientX);
                const newH = rStartH + (e.clientY - rStartY);
                if (newW > 280) {
                    win.style.width = newW + 'px';
                    win.style.left = (e.clientX) + 'px';
                }
                if (newH > 300) win.style.height = newH + 'px';
            });
            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    ValidatorCleanUI.settings.winWidth = win.style.width;
                    ValidatorCleanUI.settings.winHeight = win.style.height;
                    ValidatorCleanUI.settings.winLeft = win.style.left;
                    ValidatorCleanUI.saveSettings();
                }
            });
        }
    };
    const AdvancedSelection = {
        init: () => {
            const html = `<div style="padding:5px;"><label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">${_t('adv_lbl_crit')}</label><select id="adv_crit_sel" class="aa-input"><option value="no_city">${_t('adv_opt_nocity')}</option><option value="no_speed">${_t('adv_opt_nospeed')}</option><option value="lock">${_t('adv_opt_lock')}</option><option value="type">${_t('adv_opt_type')}</option></select><div id="adv_val_container" style="display:none; margin-top:10px;"><label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">${_t('adv_lbl_val')}</label><select id="adv_val_lock" class="aa-input"><option value="1">${_t('adv_lock_level')} 1</option><option value="2">${_t('adv_lock_level')} 2</option><option value="3">${_t('adv_lock_level')} 3</option><option value="4">${_t('adv_lock_level')} 4</option><option value="5">${_t('adv_lock_level')} 5</option><option value="6">${_t('adv_lock_level')} 6</option></select><select id="adv_val_type" class="aa-input" style="display:none;"></select></div><div style="margin-top:20px; display:flex; gap:10px;"><button id="adv_btn_scan" class="aa-btn aa-indigo" style="flex:2;">${_t('adv_btn_sel')}</button><button id="adv_btn_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button></div><div id="adv_msg" style="text-align:center; margin-top:10px; font-weight:bold; font-size:11px; color:#555;"></div></div>`;
            const win = UIBuilder.createFloatingWindow('AA_AdvWin', 'win_adv', 'aa-bg-indigo', html, null);
            if (!localStorage.getItem('AA_Win_AA_AdvWin')) {
                win.style.width = '320px';
                win.style.height = '440px';
                UIBuilder.saveState('AA_AdvWin', win);
            }
            const critSel = document.getElementById('adv_crit_sel');
            const valContainer = document.getElementById('adv_val_container');
            const valLock = document.getElementById('adv_val_lock');
            const valType = document.getElementById('adv_val_type');
            const roadTypes = [{
                val: 1,
                key: 'adv_type_st'
            }, {
                val: 2,
                key: 'adv_type_ps'
            }, {
                val: 7,
                key: 'adv_type_mh'
            }, {
                val: 6,
                key: 'adv_type_maj'
            }, {
                val: 3,
                key: 'adv_type_fw'
            }, {
                val: 4,
                key: 'adv_type_rmp'
            }, {
                val: 20,
                key: 'adv_type_plr'
            }, {
                val: 22,
                key: 'adv_type_pw'
            }, {
                val: 17,
                key: 'adv_type_pr'
            }, {
                val: 8,
                key: 'adv_type_or'
            }];
            valType.innerHTML = '';
            roadTypes.forEach(rt => {
                let opt = document.createElement('option');
                opt.value = rt.val;
                opt.text = _t(rt.key);
                valType.appendChild(opt);
            });
            critSel.onchange = () => {
                const val = critSel.value;
                if (val === 'lock') {
                    valContainer.style.display = 'block';
                    valLock.style.display = 'block';
                    valType.style.display = 'none';
                } else if (val === 'type') {
                    valContainer.style.display = 'block';
                    valLock.style.display = 'none';
                    valType.style.display = 'block';
                } else {
                    valContainer.style.display = 'none';
                }
            };
            document.getElementById('adv_btn_scan').onclick = AdvancedSelection.run;
            document.getElementById('adv_btn_clear').onclick = () => {
                W.selectionManager.unselectAll();
                document.getElementById('adv_msg').innerText = '';
            };
        },
        run: () => {
            const criteria = document.getElementById('adv_crit_sel').value;
            const extent = W.map.getExtent();
            let objectsToSelect = [];
            let segments = getAllObjects('segments');
            segments.forEach(seg => {
                if (!seg.geometry || !extent.intersectsBounds(seg.geometry.getBounds())) return;
                const attr = seg.attributes;
                let match = false;
                if (criteria === 'no_city') {
                    const streetId = attr.primaryStreetID;
                    if (streetId) {
                        const street = W.model.streets.objects[streetId];
                        if (street) {
                            if (!street.attributes.cityID) match = true;
                            else {
                                const city = W.model.cities.objects[street.attributes.cityID];
                                if (!city || !city.attributes.name || city.attributes.name.trim() === '') match = true;
                            }
                        }
                    } else {
                        match = true;
                    }
                } else if (criteria === 'no_speed') {
                    const driveable = [1, 2, 3, 4, 6, 7, 8, 17, 20, 22];
                    if (driveable.includes(attr.roadType)) {
                        const fwd = attr.fwdMaxSpeed;
                        const rev = attr.revMaxSpeed;
                        if ((fwd === null || fwd === 0) && (rev === null || rev === 0)) match = true;
                    }
                } else if (criteria === 'lock') {
                    const reqRank = parseInt(document.getElementById('adv_val_lock').value) - 1;
                    if ((attr.lockRank || 0) === reqRank) match = true;
                } else if (criteria === 'type') {
                    if (attr.roadType === parseInt(document.getElementById('adv_val_type').value)) match = true;
                }
                if (match) objectsToSelect.push(seg);
            });
            const msgEl = document.getElementById('adv_msg');
            if (objectsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(objectsToSelect);
                msgEl.innerText = `${_t('adv_msg_found')}: ${objectsToSelect.length}`;
                msgEl.style.color = 'green';
            } else {
                msgEl.innerText = _t('adv_msg_none');
                msgEl.style.color = 'red';
            }
        }
    };

    // ===========================================================================
    //  MAIN INIT & STYLES
    // ===========================================================================
    function injectCSS() {
        const css = `
            .aa-window { position:fixed; background:#fff; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.3); z-index:9999; font-family:'Cairo', sans-serif; overflow: hidden; resize: both; min-width: 200px; min-height: 200px; }
            .aa-header { padding:10px; color:#fff; cursor:move; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:14px; height: 35px; }
            .aa-content { padding:10px; background:#f9f9f9; height: calc(100% - 35px); overflow-y:auto; box-sizing:border-box; }
            .aa-close { cursor:pointer; font-weight:bold; font-size:18px; margin-left:10px; }
            .aa-btn { width:100%; padding:8px; margin-top:5px; border:none; border-radius:4px; color:#fff; cursor:pointer; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
            .aa-btn:hover { filter: brightness(1.1); } .aa-btn:active { transform: translateY(1px); box-shadow: none; }
            .aa-input { width:100%; padding:6px; margin-bottom:5px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-family:'Cairo'; font-weight:bold; }
            .aa-setting-btn { opacity: 0.5; transition: all 0.2s; justify-content: flex-start; padding-left: 10px; position:relative; } .aa-setting-btn.active { opacity: 1; box-shadow: inset 0 0 5px rgba(0,0,0,0.2); } .aa-chk-box { display: inline-block; width: 16px; height: 16px; background: rgba(255,255,255,0.3); border-radius: 3px; margin-right: 5px; margin-left: 5px; text-align: center; line-height: 16px; font-size: 12px; color: #fff; }
            #aa-qa-resize-handle { position: absolute; bottom: 0; left: 0; width: 15px; height: 15px; cursor: sw-resize; background: linear-gradient(45deg, transparent 50%, #2196F3 50%); z-index: 10; opacity: 0.7; }
            .aa-qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px; } .aa-qa-chk-card { background: #fdfdfd; border: 1px solid #ddd; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; color: #555; display: flex; align-items: center; gap: 8px; height: 36px; transition: border 0.2s; } .aa-qa-chk-card:hover { border-color: #999; } .aa-qa-chk-card input[type="checkbox"] { cursor: pointer; margin: 0; width: 14px; height: 14px; accent-color: #2196F3; } .aa-qa-chk-card:has(input:checked) { border-color: #2196F3; color: #333; background: #fff; box-shadow: 0 1px 3px rgba(33, 150, 243, 0.15); }
            .aa-qa-grid-btn { grid-column: span 1; background: #4285F4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.1); height: 36px; }
            .aa-qa-settings-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 4px; padding: 8px; margin-top: 10px; font-size: 11px; color: #333; }
            .aa-qa-setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; } .aa-qa-input { width: 40px; text-align: center; border: 1px solid #ccc; border-radius: 3px; padding: 2px; font-size: 11px; font-weight: bold; }
            .aa-qa-pill { display: flex; background: #e0e0e0; border-radius: 3px; overflow: hidden; cursor: pointer; } .aa-qa-pill-opt { padding: 3px 8px; font-size: 10px; font-weight: bold; color: #666; transition: 0.2s; } .aa-qa-pill-opt.active { background: #2196F3; color: white; }
            .aa-qa-action-row { display: flex; gap: 8px; margin-top: 12px; width: 100%; } .aa-qa-btn { flex: 1; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); } .aa-btn-scan { background: #4CAF50; } .aa-btn-clear { background: #757575; }

            /* INSPECTOR CSS */
            #nli-container { direction: inherit; text-align: inherit; }
            .rtl #nli-container { direction: rtl; text-align: right; }
            .ltr #nli-container { direction: ltr; text-align: left; }

            .nli-controls { padding: 5px 0; border-bottom: 1px solid #eee; margin-bottom: 10px; }
            .nli-btn-group { display: flex; gap: 5px; }
            .nli-btn { width: 100%; padding: 6px; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-weight: bold; font-size: 12px; }
            .nli-btn-scan { background: linear-gradient(to bottom, #2ecc71, #27ae60); } .nli-btn-clear { background: linear-gradient(to bottom, #95a5a6, #7f8c8d); }
            #nli-results-list { overflow-y: auto; max-height: calc(100vh - 250px); }
            .nli-city-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 6px; overflow: hidden; }
            .nli-city-header { padding: 6px 8px; background: #f4f6f7; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom:1px solid transparent; }
            .nli-city-header:hover { background: #e9ecef; }
            .nli-arrow-btn { margin-left: 5px; font-size: 10px; color: #777; transition: transform 0.2s; } .nli-arrow-btn.open { transform: rotate(-90deg); color: #2196F3; }
            .nli-city-title { font-weight: bold; font-size: 13px; color: #333; }
            .nli-counts-badge { font-size: 10px; background: #fff; padding: 2px 5px; border-radius: 4px; border: 1px solid #ccc; color:#555; }
            .nli-city-details { display: none; }
            .nli-tabs { display: flex; background: #eee; border-bottom: 1px solid #ddd; }
            .nli-tab { flex: 1; text-align: center; padding: 5px; cursor: pointer; font-size: 11px; } .nli-tab.active { background: #fff; border-bottom: 2px solid #2196f3; color: #2196f3; font-weight: bold; }
            .nli-col-header { display: flex; background: #fafafa; padding: 4px 8px; font-size: 10px; font-weight: bold; color: #555; border-bottom: 2px solid #eee; }
            .nli-row-item { display: flex; align-items: center; padding: 6px 8px; border-bottom: 1px solid #f5f5f5; font-size: 11px; cursor: pointer; transition: 0.1s; } .nli-row-item:hover { background: #f0f8ff; }

            /* Updated Column Styles for Same-Line Display */
            .col-name { flex: 2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 5px; color: #333; font-weight: bold; }
            .col-user { flex: 1.5; overflow: hidden; font-size: 10px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; }
            .badge-create { color: #2e7d32; background: #e8f5e9; padding: 1px 4px; border-radius: 3px; font-size: 9px; border: 1px solid #c8e6c9; }
            .badge-update { color: #1565c0; background: #e3f2fd; padding: 1px 4px; border-radius: 3px; font-size: 9px; border: 1px solid #bbdefb; }
            .date-label { font-size: 9px; color: #888; direction: ltr; }

            .nli-editor-row { display: flex; justify-content: space-between; padding: 5px 10px; border-bottom: 1px solid #f0f0f0; font-size: 11px; }

            /* CITIES CHECKBOX CSS (Merged) */
            .aa-list-item { padding: 8px 10px; margin-bottom: 4px; background: #f1f3f5; border: 1px solid #e9ecef; border-radius: 4px; font-size: 13px; color: #333; display: flex; align-items: center; transition: background 0.2s; }
            .aa-list-item:hover { background: #e2e6ea; }
            .aa-checkbox { margin-left: 10px; width: 16px; height: 16px; cursor: pointer; }
            .aa-label-text { cursor: pointer; flex-grow: 1; display:flex; justify-content: space-between; }
            .aa-source-badge { font-size: 10px; padding: 2px 5px; border-radius: 3px; margin-right: 5px; color:white; min-width: 35px; text-align: center; }
            .badge-waze { background: #00c6ff; } .badge-osm { background: #ff758c; }
            .aa-all-item { background: #e3f2fd; border-color: #90caf9; font-weight: bold; }
            .aa-empty-msg { text-align: center; color: #888; }

            /* Colors */
            .aa-bg-gold { background: #FFD700; color: #000; } .aa-gold { background: #FFC107; color:#000; } .aa-bg-blue { background: #00B0FF; } .aa-blue { background: #0091EA; } .aa-bg-teal { background: #00E5FF; color:#000; } .aa-teal { background: #00B8D4; } .aa-bg-purple { background: #D500F9; } .aa-purple { background: #AA00FF; } .aa-bg-green { background: #00E676; color:#000; } .aa-green { background: #00C853; } .aa-bg-cyan { background: #18FFFF; color:#000; } .aa-cyan { background: #00B8D4; } .aa-bg-red { background: #FF1744; } .aa-red { background: #D50000; } .aa-bg-orange { background: #FF9800; color:#000; } .aa-bg-darkblue { background: #1565C0; } .aa-bg-white { background: #ffffff; color: #333; text-shadow: none; } .aa-txt-dark { color: #333; } .aa-gray { background: #78909C; } .aa-bg-indigo { background: #3F51B5; } .aa-indigo { background: #303F9F; } .rtl { direction: rtl; } .ltr { direction: ltr; } .aa-big-icon { font-size: 24px; padding: 5px 0; font-weight: 900; } .aa-huge-icon { font-size: 32px; padding: 5px 0; font-weight: 900; }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function buildSidebar() {
        const userTabs = document.getElementById('user-info');
        if (!userTabs) return;
        const existingTab = document.getElementById('aa-suite-tab-content');
        if (existingTab) existingTab.remove();
        const existingLink = document.querySelector('ul.nav-tabs li a[href="#aa-suite-tab-content"]');
        if (existingLink) existingLink.parentElement.remove();

        const navTabs = userTabs.querySelector('.nav-tabs');
        const tabContent = userTabs.querySelector('.tab-content');
        if (!navTabs || !tabContent) return;

        const addon = document.createElement('div');
        addon.id = "aa-suite-tab-content";
        addon.className = "tab-pane";
        addon.style.padding = "10px";

        // Dynamic Language Dropdown
        const langKeys = Object.keys(STRINGS);
        const langOptions = langKeys.map(code =>
            `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${STRINGS[code].name}</option>`
        ).join('');

        addon.innerHTML = `
            <div style="text-align:center; font-family:'Cairo', sans-serif;">
                <div style="font-weight:bold; color:#000; margin-bottom:10px; padding-bottom:5px; border-bottom:3px solid #FFD700; font-size:16px;">${_t('main_title')}</div>
                <select id="aa_lang_sel" class="aa-input" style="margin-bottom:15px; text-align:center;">${langOptions}</select>

                <button id="btn_open_inspector" class="aa-btn aa-bg-darkblue" style="border:1px solid white;"><i class="fa fa-search-plus"></i> ${_t('btn_inspector')}</button>
                <button id="btn_open_cities" class="aa-btn aa-bg-teal" style="margin-top:5px;"><i class="fa fa-map-o"></i> ${_t('btn_cities_check')}</button>

                <div style="height:2px; background:#ccc; margin:10px 0;"></div>

                <button id="btn_open_qa" class="aa-btn aa-bg-orange"><i class="fa fa-bug"></i> ${_t('btn_qa')}</button>
                <button id="btn_open_adv" class="aa-btn aa-bg-indigo"><i class="fa fa-filter"></i> ${_t('btn_adv')}</button>
                <div style="margin-top:15px; font-size:10px; color:#555; font-weight:bold;">v${SCRIPT_VERSION}</div>
            </div>
        `;

        const newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#aa-suite-tab-content" data-toggle="tab" title="Abdullah Abbas WME Tools">Abdullah Abbas Tools</a>';
        navTabs.appendChild(newtab);
        tabContent.appendChild(addon);

        document.getElementById('aa_lang_sel').onchange = (e) => {
            currentLang = e.target.value;
            localStorage.setItem('AA_Lang', currentLang);
            // Reload sidebar to apply new language
            buildSidebar();
            // Remove existing windows to avoid mixed languages (they cache old text)
            document.querySelectorAll('.aa-window').forEach(w => w.remove());
            // Force modules to rebuild UI in the new language
            ValidatorCleanUI.isInitialized = false;
            ValidatorCleanUI.visualLayer = null;
        };

        document.getElementById('btn_open_inspector').onclick = CityInspectorModule.init;
        document.getElementById('btn_open_cities').onclick = CitiesCheckboxModule.init;
        document.getElementById('btn_open_qa').onclick = ValidatorCleanUI.init;
        document.getElementById('btn_open_adv').onclick = AdvancedSelection.init;
    }

    function bootstrap(tries = 1) {
        if (typeof W !== 'undefined' && W.map && W.model && document.getElementById('user-info')) {
            const savedLang = localStorage.getItem('AA_Lang');
            if (savedLang && STRINGS[savedLang]) currentLang = savedLang;
            injectCSS();
            buildSidebar();
            console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} Loaded.`);
        } else if (tries < 50) {
            setTimeout(() => bootstrap(tries + 1), 200);
        }
    }
    bootstrap();
})();