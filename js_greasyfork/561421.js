// ==UserScript==
// @name                Abdullah Abbas WME Tools
// @namespace           https://greasyfork.org/users/abdullah-abbas
// @description         WME Suite: Tools + Route Tester + City Explorer (All-in-One)
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @version             2026.01.13.02
// @grant               GM_xmlhttpRequest
// @grant               unsafeWindow
// @connect             waze.com
// @connect             routing-livemap-row.waze.com
// @connect             routing-livemap-na.waze.com
// @connect             routing-livemap-il.waze.com
// @author              Abdullah Abbas
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.meta.js
// ==/UserScript==

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
    const SCRIPT_VERSION = "2026.01.13.02";
    const DEFAULT_W = "340px";
    const DEFAULT_H = "480px";

    // ===========================================================================
    //  LOCALIZATION
    // ===========================================================================
    const STRINGS = {
        'ar-IQ': {
            name: 'العربية - العراق',
            main_title: 'أدوات عبدالله عباس',
            btn_city: 'مستكشف المدن (بسيط)', btn_places: 'مستكشف الأماكن (بسيط)',
            btn_editors: 'مستكشف المحررين', btn_ra: 'تعديل الدوار', btn_lock: 'مؤشر القفل',
            btn_qa: 'مدقق الخريطة', btn_adv: 'تحديد متقدم', btn_speed: 'مؤشر السرعة', btn_route: 'اختبار المسار 🚗',
            btn_inspector: 'مستكشف المدن والأماكن الشامل 📊',
            win_city: 'مستكشف المدن', win_places: 'مستكشف الأماكن (بسيط)',
            win_editors: 'مستكشف المحررين', win_ra: 'تعديل الدوار', win_lock: 'مؤشر القفل',
            win_speed: 'مؤشر السرعة', win_route: 'اختبار المسار', win_adv: 'تحديد متقدم',
            win_inspector: 'مستكشف المدن والأماكن الشامل',
            common_scan: 'بحث', common_clear: 'مسح', common_close: 'إغلاق', common_ready: 'جاهز للتعديل',
            ph_city: 'اسم المدينة...', ph_place: 'اسم المكان...', ph_user: 'اسم المحرر...',
            lbl_days: 'عدد الأيام (0 = الكل)', lbl_enable: 'تفعيل',
            ra_in: 'تصغير (-)', ra_out: 'تكبير (+)', ra_err: 'حدد دوار لتفعيله', unit_m: 'م',
            city_no_name: 'بدون مدينة', no_results: 'لا توجد نتائج',
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
            rt_btn_a: '📍 تعيين البداية (A)', rt_btn_b: '🏁 تعيين النهاية (B)', rt_btn_calc: 'رسم المسار', rt_btn_clear: 'مسح',
            rt_msg_ready: 'جاهز للاستخدام', rt_msg_wait: '⏳ جاري الحساب...', rt_msg_err: '❌ خطأ', rt_msg_no_route: '❌ لا يوجد مسار', rt_msg_select: '⚠️ حدد عنصراً في الخريطة أولاً!',
            rt_lbl_a: 'A: غير محدد', rt_lbl_b: 'B: غير محدد', rt_btn_km: 'المسافة (KM)', rt_btn_spd: 'السرعة', rt_btn_time: 'الوقت'
        },
        'ckb-IQ': {
            name: 'Kurdî (Soranî)',
            main_title: 'ئامرازەکانی عەبدوڵڵا عەباس',
            btn_city: 'پشکنەری شار (سادە)', btn_places: 'پشکنەری شوێنەکان (سادە)',
            btn_editors: 'پشکنەری دەستکاریکەران', btn_ra: 'دەستکاری فلکە', btn_lock: 'نیشاندەری قوفڵ',
            btn_qa: 'پشکنەری نەخشە', btn_adv: 'دیاریکردنی پێشکەوتوو', btn_speed: 'نیشاندەری خێرایی', btn_route: 'تاقیکردنەوەی ڕێگا 🚗',
            btn_inspector: 'پشکنەری شار و شوێن (بەرفراوان) 📊',
            win_city: 'پشکنەری شار', win_places: 'پشکنەری شوێنەکان',
            win_editors: 'پشکنەری دەستکاریکەران', win_ra: 'دەستکاری فلکە', win_lock: 'نیشاندەری قوفڵ',
            win_speed: 'نیشاندەری خێرایی', win_route: 'تاقیکردنەوەی ڕێگا', win_adv: 'دیاریکردنی پێشکەوتوو',
            win_inspector: 'پشکنەری شار و شوێن (بەرفراوان)',
            common_scan: 'گەڕان', common_clear: 'پاککردنەوە', common_close: 'داخستن', common_ready: 'ئامادەیە',
            ph_city: 'ناوی شار...', ph_place: 'ناوی شوێن...', ph_user: 'ناوی بەکارهێنەر...',
            lbl_days: 'ڕۆژ (0 = هەموو)', lbl_enable: 'چالاک',
            ra_in: 'بچووک (-)', ra_out: 'گەورە (+)', ra_err: 'فلکەیەک دیاری بکە', unit_m: 'م',
            city_no_name: 'بێ شار', no_results: 'هیچ نەدۆزرایەوە',
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
            rt_btn_a: '📍 دەستپێک (A)', rt_btn_b: '🏁 کۆتایی (B)', rt_btn_calc: 'کێشانی ڕێگا', rt_btn_clear: 'پاککردنەوە',
            rt_msg_ready: 'ئامادەیە', rt_msg_wait: '⏳ دەژمێرێت...', rt_msg_err: '❌ هەڵە', rt_msg_no_route: '❌ ڕێگا نییە', rt_msg_select: '⚠️ شوێنێک دیاری بکە!',
            rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'دووری (KM)', rt_btn_spd: 'خێرایی', rt_btn_time: 'کات'
        },
        'kmr': {
            name: 'Kurdî (Kurmancî)',
            main_title: 'Amûrên Abdullah Abbas',
            btn_city: 'Gerokê Bajar (Hêsan)', btn_places: 'Gerokê Cihan (Hêsan)',
            btn_editors: 'Gerokê Edîtoran', btn_ra: 'Edîtorê Qada', btn_lock: 'Nîşanderê Qufilê',
            btn_qa: 'Kontrola Nexşeyê', btn_adv: 'Hilbijartina Pêşkeftî', btn_speed: 'Nîşanderê Lezê', btn_route: 'Testkirina Rê 🚗',
            btn_inspector: 'Gerokê Bajar/Cih (Berfireh) 📊',
            win_city: 'Gerokê Bajar', win_places: 'Gerokê Cihan',
            win_editors: 'Gerokê Edîtoran', win_ra: 'Edîtorê Qada', win_lock: 'Nîşanderê Qufilê',
            win_speed: 'Nîşanderê Lezê', win_route: 'Testkirina Rê', win_adv: 'Hilbijartina Pêşkeftî',
            win_inspector: 'Gerokê Bajar/Cih (Berfireh)',
            common_scan: 'Lêgerîn', common_clear: 'Paqijkirin', common_close: 'Girtin', common_ready: 'Amade ye',
            ph_city: 'Navê Bajar...', ph_place: 'Navê Cih...', ph_user: 'Navê Bikarhêner...',
            lbl_days: 'Roj (0 = Hemû)', lbl_enable: 'Çalak',
            ra_in: 'Biçûk (-)', ra_out: 'Mezin (+)', ra_err: 'Qadekê hilbijêre', unit_m: 'm',
            city_no_name: 'Bê Bajar', no_results: 'Ti encam nehat dîtin',
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
            rt_btn_a: '📍 Destpêk (A)', rt_btn_b: '🏁 Dawî (B)', rt_btn_calc: 'Hesabkirin', rt_btn_clear: 'Paqijkirin',
            rt_msg_ready: 'Amade ye', rt_msg_wait: '⏳ Tê hesabkirin...', rt_msg_err: '❌ Çewtî', rt_msg_no_route: '❌ Rê tune', rt_msg_select: '⚠️ Cihekî hilbijêre!',
            rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'Dûrî (KM)', rt_btn_spd: 'Lez', rt_btn_time: 'Dem'
        },
        'en-US': {
            name: 'English (US)',
            main_title: 'Abdullah Abbas Tools',
            btn_city: 'City Explorer (Simple)', btn_places: 'Places Explorer (Simple)',
            btn_editors: 'Editor Explorer', btn_ra: 'Roundabout Editor', btn_lock: 'Lock Indicator',
            btn_qa: 'Map Validator', btn_adv: 'Advanced Selection', btn_speed: 'Speed Indicator', btn_route: 'Route Tester 🚗',
            btn_inspector: 'Comp. City/Place Explorer 📊',
            win_city: 'City Explorer', win_places: 'Places Explorer', win_editors: 'Editor Explorer', win_ra: 'Roundabout Editor',
            win_lock: 'Lock Indicator', win_speed: 'Speed Indicator', win_route: 'Route Tester', win_adv: 'Advanced Selection',
            win_inspector: 'Comp. City/Place Explorer',
            common_scan: 'Scan', common_clear: 'Clear', common_close: 'Close', common_ready: 'Ready',
            ph_city: 'City Name...', ph_place: 'Place Name...', ph_user: 'Username...',
            lbl_days: 'Days (0 = All)', lbl_enable: 'Enable',
            ra_in: 'Shrink', ra_out: 'Expand', ra_err: 'Select RA', unit_m: 'm',
            city_no_name: 'No City', no_results: 'No results',
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
            rt_btn_a: '📍 Set Start (A)', rt_btn_b: '🏁 Set End (B)', rt_btn_calc: 'Calculate', rt_btn_clear: 'Clear',
            rt_msg_ready: 'Ready', rt_msg_wait: '⏳ Calculating...', rt_msg_err: '❌ Error', rt_msg_no_route: '❌ No Route', rt_msg_select: '⚠️ Select an element first!',
            rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'Dist (KM)', rt_btn_spd: 'Speed', rt_btn_time: 'Time'
        },
        'es-ES': {
            name: 'Español',
            main_title: 'Herramientas Abdullah Abbas',
            btn_city: 'Explorador de Ciudades', btn_places: 'Explorador de Lugares',
            btn_editors: 'Explorador de Editores', btn_ra: 'Editor de Rotondas', btn_lock: 'Indicador de Bloqueo',
            btn_qa: 'Validador de Mapa', btn_adv: 'Selección Avanzada', btn_speed: 'Indicador de Velocidad', btn_route: 'Probador de Rutas 🚗',
            btn_inspector: 'Explorador Completo 📊',
            win_city: 'Explorador de Ciudades', win_places: 'Explorador de Lugares',
            win_editors: 'Explorador de Editores', win_ra: 'Editor de Rotondas', win_lock: 'Indicador de Bloqueo',
            win_speed: 'Indicador de Velocidad', win_route: 'Probador de Rutas', win_adv: 'Selección Avanzada',
            win_inspector: 'Explorador Completo',
            common_scan: 'Escanear', common_clear: 'Limpiar', common_close: 'Cerrar', common_ready: 'Listo',
            ph_city: 'Nombre de Ciudad...', ph_place: 'Nombre de Lugar...', ph_user: 'Nombre de Usuario...',
            lbl_days: 'Días (0 = Todos)', lbl_enable: 'Habilitar',
            ra_in: 'Contraer', ra_out: 'Expandir', ra_err: 'Seleccionar Rotonda', unit_m: 'm',
            city_no_name: 'Sin Ciudad', no_results: 'Sin resultados',
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
            rt_btn_a: '📍 Inicio (A)', rt_btn_b: '🏁 Fin (B)', rt_btn_calc: 'Calcular', rt_btn_clear: 'Limpiar',
            rt_msg_wait: '⏳ Calculando...', rt_msg_err: '❌ Error', rt_msg_no_route: '❌ Sin Ruta', rt_msg_select: '⚠️ Seleccione elemento',
            rt_msg_ready: 'Listo', rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'Dist (KM)', rt_btn_spd: 'Vel.', rt_btn_time: 'Tiempo'
        },
        'fr-FR': {
            name: 'Français',
            main_title: 'Outils Abdullah Abbas',
            btn_city: 'Explorateur de Villes', btn_places: 'Explorateur de Lieux',
            btn_editors: 'Explorateur d\'Éditeurs', btn_ra: 'Éditeur de Ronds-points', btn_lock: 'Indicateur de Verrouillage',
            btn_qa: 'Validateur de Carte', btn_adv: 'Sélection Avancée', btn_speed: 'Indicateur de Vitesse', btn_route: 'Testeur d\'Itinéraire 🚗',
            btn_inspector: 'Explorateur Complet 📊',
            win_city: 'Explorateur de Villes', win_places: 'Explorateur de Lieux',
            win_editors: 'Explorateur d\'Éditeurs', win_ra: 'Éditeur de Ronds-points', win_lock: 'Indicateur de Verrouillage',
            win_speed: 'Indicateur de Vitesse', win_route: 'Testeur d\'Itinéraire', win_adv: 'Sélection Avancée',
            win_inspector: 'Explorateur Complet',
            common_scan: 'Scanner', common_clear: 'Effacer', common_close: 'Fermer', common_ready: 'Prêt',
            ph_city: 'Nom de la ville...', ph_place: 'Nom du lieu...', ph_user: 'Nom d\'utilisateur...',
            lbl_days: 'Jours (0 = Tous)', lbl_enable: 'Activer',
            ra_in: 'Réduire', ra_out: 'Agrandir', ra_err: 'Sélectionner RP', unit_m: 'm',
            city_no_name: 'Sans Ville', no_results: 'Aucun résultat',
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
            rt_btn_a: '📍 Départ (A)', rt_btn_b: '🏁 Arrivée (B)', rt_btn_calc: 'Calculer', rt_btn_clear: 'Effacer',
            rt_msg_wait: '⏳ Calcul...', rt_msg_err: '❌ Erreur', rt_msg_no_route: '❌ Pas de route', rt_msg_select: '⚠️ Sélectionnez!',
            rt_msg_ready: 'Prêt', rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'Dist (KM)', rt_btn_spd: 'Vitesse', rt_btn_time: 'Temps'
        },
        'ru-RU': {
            name: 'Русский',
            main_title: 'Инструменты Abdullah Abbas',
            btn_city: 'Обзор Городов', btn_places: 'Обзор Мест',
            btn_editors: 'Обзор Редакторов', btn_ra: 'Редактор Колец', btn_lock: 'Индикатор Локов',
            btn_qa: 'Валидатор Карты', btn_adv: 'Расширенный Выбор', btn_speed: 'Индикатор Скорости', btn_route: 'Тест Маршрута 🚗',
            btn_inspector: 'Полный Инспектор 📊',
            win_city: 'Обзор Городов', win_places: 'Обзор Мест',
            win_editors: 'Обзор Редакторов', win_ra: 'Редактор Колец', win_lock: 'Индикатор Локов',
            win_speed: 'Индикатор Скорости', win_route: 'Тест Маршрута', win_adv: 'Расширенный Выбор',
            win_inspector: 'Полный Инспектор',
            common_scan: 'Поиск', common_clear: 'Очистить', common_close: 'Закрыть', common_ready: 'Готово',
            ph_city: 'Имя города...', ph_place: 'Имя места...', ph_user: 'Имя редактора...',
            lbl_days: 'Дни (0 = Все)', lbl_enable: 'Включить',
            ra_in: 'Сжать', ra_out: 'Расширить', ra_err: 'Выберите кольцо', unit_m: 'м',
            city_no_name: 'Без Города', no_results: 'Нет результатов',
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
            rt_btn_a: '📍 Старт (A)', rt_btn_b: '🏁 Финиш (B)', rt_btn_calc: 'Рассчитать', rt_btn_clear: 'Сброс',
            rt_msg_wait: '⏳ Расчет...', rt_msg_err: '❌ Ошибка', rt_msg_no_route: '❌ Нет маршрута', rt_msg_select: '⚠️ Выберите!',
            rt_msg_ready: 'Готово', rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'КМ', rt_btn_spd: 'Скор.', rt_btn_time: 'Время'
        },
        'pt-BR': {
            name: 'Português',
            main_title: 'Ferramentas Abdullah Abbas',
            btn_city: 'Explorador de Cidades', btn_places: 'Explorador de Locais',
            btn_editors: 'Explorador de Editores', btn_ra: 'Editor de Rotatórias', btn_lock: 'Indicador de Bloqueio',
            btn_qa: 'Validador de Mapa', btn_adv: 'Seleção Avançada', btn_speed: 'Indicador de Velocidade', btn_route: 'Testador de Rotas 🚗',
            btn_inspector: 'Inspetor Completo 📊',
            win_city: 'Explorador de Cidades', win_places: 'Explorador de Locais',
            win_editors: 'Explorador de Editores', win_ra: 'Editor de Rotatórias', win_lock: 'Indicador de Bloqueio',
            win_speed: 'Indicador de Velocidade', win_route: 'Testador de Rotas', win_adv: 'Seleção Avançada',
            win_inspector: 'Inspetor Completo',
            common_scan: 'Escanear', common_clear: 'Limpar', common_close: 'Fechar', common_ready: 'Pronto',
            ph_city: 'Nome da Cidade...', ph_place: 'Nome do Local...', ph_user: 'Usuário...',
            lbl_days: 'Dias (0 = Todos)', lbl_enable: 'Ativar',
            ra_in: 'Encolher', ra_out: 'Expandir', ra_err: 'Selecionar Rotatória', unit_m: 'm',
            city_no_name: 'Sem Cidade', no_results: 'Sem resultados',
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
            adv_type_plr: 'Estacionamento', adv_type_pw: 'Via Privada', adv_type_pr: 'Privado', adv_type_or: 'Off-Road',
            rt_btn_a: '📍 Início (A)', rt_btn_b: '🏁 Fim (B)', rt_btn_calc: 'Calcular', rt_btn_clear: 'Limpar',
            rt_msg_wait: '⏳ Calculando...', rt_msg_err: '❌ Erro', rt_msg_no_route: '❌ Sem Rota', rt_msg_select: '⚠️ Selecione!',
            rt_msg_ready: 'Pronto', rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'Dist (KM)', rt_btn_spd: 'Vel.', rt_btn_time: 'Tempo'
        },
        'he-IL': {
            name: 'עברית',
            main_title: 'כלי עבדאללה עבאס',
            btn_city: 'סייר ערים', btn_places: 'סייר מקומות',
            btn_editors: 'סייר עורכים', btn_ra: 'עורך כיכרות', btn_lock: 'מחוון נעילה',
            btn_qa: 'בודק מפה', btn_adv: 'בחירה מתקדמת', btn_speed: 'מחוון מהירות', btn_route: 'בדיקת מסלול 🚗',
            btn_inspector: 'סייר מקיף 📊',
            win_city: 'סייר ערים', win_places: 'סייר מקומות',
            win_editors: 'סייר עורכים', win_ra: 'עורך כיכרות', win_lock: 'מחוון נעילה',
            win_speed: 'מחוון מהירות', win_route: 'בדיקת מסלול', win_adv: 'בחירה מתקדמת',
            win_inspector: 'סייר מקיף',
            common_scan: 'סרוק', common_clear: 'נקה', common_close: 'סגור', common_ready: 'מוכן',
            ph_city: 'שם העיר...', ph_place: 'שם המקום...', ph_user: 'שם משתמש...',
            lbl_days: 'ימים (0 = הכל)', lbl_enable: 'הפעל',
            ra_in: 'כווץ', ra_out: 'הרחב', ra_err: 'בחר כיכר', unit_m: 'מ\'',
            city_no_name: 'ללא עיר', no_results: 'אין תוצאות',
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
            rt_btn_a: '📍 התחלה (A)', rt_btn_b: '🏁 סיום (B)', rt_btn_calc: 'חשב', rt_btn_clear: 'נקה',
            rt_msg_wait: '⏳ מחשב...', rt_msg_err: '❌ שגיאה', rt_msg_no_route: '❌ אין מסלול', rt_msg_select: '⚠️ בחר!',
            rt_msg_ready: 'מוכן', rt_lbl_a: 'A: ...', rt_lbl_b: 'B: ...', rt_btn_km: 'מרחק', rt_btn_spd: 'מהירות', rt_btn_time: 'זמן'
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

    function fastClone(obj) { return JSON.parse(JSON.stringify(obj)); }

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

                    // UPDATED ROW HTML: Single Line for Creator/Date
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
                header.innerHTML = `<span>Editor</span> <span>Cr / Up</span>`;
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
            if (type === 'venue') return obj.attributes.name || "No Name";
            let streetID = obj.attributes.primaryStreetID;
            if (streetID) {
                let street = W.model.streets.objects[streetID];
                if (street && street.attributes.name) return street.attributes.name;
            }
            return "No Name";
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
    //  EXISTING MODULES
    // ===========================================================================
    const RouteTester={layer:null,startPoint:null,endPoint:null,lastRouteData:null,LAYER_NAME:'AA_Route_Layer_Final_V15',settings:{showMarkers:true,showSpeed:true,showTime:true},init:()=>{const html=`<div id="aa-rt-body"><button id="rt_btn_a" class="aa-btn rt-btn-a">${_t('rt_btn_a')}</button><div id="rt_lbl_a" class="rt-lbl">${_t('rt_lbl_a')}</div><button id="rt_btn_b" class="aa-btn rt-btn-b">${_t('rt_btn_b')}</button><div id="rt_lbl_b" class="rt-lbl">${_t('rt_lbl_b')}</div><div style="margin: 15px 0; display:flex; gap:5px; justify-content: space-between;"><button id="rt_toggle_km" class="aa-btn aa-setting-btn aa-bg-gold active"><span class="aa-chk-box">✔</span> ${_t('rt_btn_km')}</button><button id="rt_toggle_spd" class="aa-btn aa-setting-btn aa-bg-red active"><span class="aa-chk-box">✔</span> ${_t('rt_btn_spd')}</button><button id="rt_toggle_time" class="aa-btn aa-setting-btn aa-bg-blue active"><span class="aa-chk-box">✔</span> ${_t('rt_btn_time')}</button></div><div id="rt_msg">${_t('rt_msg_ready')}</div><div style="display:flex; gap:10px; margin-top:15px;"><button id="rt_btn_clear" class="aa-btn rt-btn-clr" style="flex:1;">${_t('rt_btn_clear')}</button><button id="rt_btn_calc" class="aa-btn rt-btn-go" style="flex:2;">${_t('rt_btn_calc')}</button></div></div>`;const win=UIBuilder.createFloatingWindow('AA_RouteWin','win_route','aa-bg-darkblue',html,{w:'340px',h:'420px'});document.getElementById('rt_btn_a').onclick=(e)=>RouteTester.handleSetPoint(e,'A');document.getElementById('rt_btn_b').onclick=(e)=>RouteTester.handleSetPoint(e,'B');document.getElementById('rt_btn_calc').onclick=RouteTester.handleCalc;document.getElementById('rt_btn_clear').onclick=RouteTester.handleClear;const setupToggle=(id,settingKey)=>{const btn=document.getElementById(id);const chk=btn.querySelector('.aa-chk-box');btn.onclick=()=>{RouteTester.settings[settingKey]=!RouteTester.settings[settingKey];if(RouteTester.settings[settingKey]){btn.classList.add('active');chk.innerHTML='✔'}else{btn.classList.remove('active');chk.innerHTML=''}if(RouteTester.lastRouteData)RouteTester.drawRoute(RouteTester.lastRouteData)}};setupToggle('rt_toggle_km','showMarkers');setupToggle('rt_toggle_spd','showSpeed');setupToggle('rt_toggle_time','showTime');RouteTester.initLayer()},initLayer:()=>{try{const oldLayers=W.map.getLayersBy('uniqueName',RouteTester.LAYER_NAME);oldLayers.forEach(l=>W.map.removeLayer(l))}catch(e){}RouteTester.layer=new OpenLayers.Layer.Vector(RouteTester.LAYER_NAME,{displayInLayerSwitcher:false,uniqueName:RouteTester.LAYER_NAME,styleMap:new OpenLayers.StyleMap({default:{strokeColor:"#00b0ff",strokeWidth:6,strokeOpacity:0.7,pointRadius:6,fillColor:"#00b0ff",fillOpacity:1,fontFamily:"Arial",fontWeight:"bold",labelOutlineColor:"white",labelOutlineWidth:4}})});W.map.addLayer(RouteTester.layer);const layerDiv=document.getElementById(RouteTester.layer.id);if(layerDiv){layerDiv.style.pointerEvents="none";layerDiv.style.zIndex="900"}},getSelectionCenter:()=>{const selObjects=W.selectionManager.getSelectedDataModelObjects();if(selObjects.length>0&&selObjects[0].geometry){const geom=selObjects[0].geometry;const center=geom.getCentroid();return{x:center.x,y:center.y}}return null},handleSetPoint:(e,type)=>{e.preventDefault();e.stopPropagation();const coords=RouteTester.getSelectionCenter();if(!coords){RouteTester.msg(_t('rt_msg_select'),'error');return}const proj=new OpenLayers.LonLat(coords.x,coords.y).transform(W.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));if(type==='A'){RouteTester.startPoint={api:proj,map:coords};document.getElementById('rt_lbl_a').innerText=`A: ${proj.lat.toFixed(5)}, ${proj.lon.toFixed(5)}`;RouteTester.drawMarker(coords,'#1565c0','A')}else{RouteTester.endPoint={api:proj,map:coords};document.getElementById('rt_lbl_b').innerText=`B: ${proj.lat.toFixed(5)}, ${proj.lon.toFixed(5)}`;RouteTester.drawMarker(coords,'#c2185b','B')}RouteTester.msg(_t('rt_msg_ready'),'neutral')},drawMarker:(coords,color,label)=>{if(RouteTester.layer.features){const existing=RouteTester.layer.features.filter(f=>f.attributes.type===label);RouteTester.layer.removeFeatures(existing)}const pt=new OpenLayers.Geometry.Point(coords.x,coords.y);const feat=new OpenLayers.Feature.Vector(pt,{type:label},{pointRadius:8,fillColor:color,strokeColor:'#fff',strokeWidth:2});RouteTester.layer.addFeatures([feat])},handleCalc:(e)=>{if(e){e.preventDefault();e.stopPropagation()}if(!RouteTester.startPoint||!RouteTester.endPoint){RouteTester.msg(_t('rt_msg_select'),'error');return}RouteTester.msg(_t('rt_msg_wait'),'warn');let region='row';if(W.model.topCountry&&W.model.topCountry.env)region=W.model.topCountry.env.toLowerCase();let url='https://routing-livemap-row.waze.com/RoutingManager/routingRequest';if(region==='usa'||region==='na')url='https://routing-livemap-am.waze.com/RoutingManager/routingRequest';if(region==='il')url='https://routing-livemap-il.waze.com/RoutingManager/routingRequest';const data=[`from=x%3A${RouteTester.startPoint.api.lon}%20y%3A${RouteTester.startPoint.api.lat}`,`to=x%3A${RouteTester.endPoint.api.lon}%20y%3A${RouteTester.endPoint.api.lat}`,`at=0`,`returnJSON=true`,`returnGeometries=true`,`returnInstructions=true`,`timeout=60000`,`nPaths=1`,`clientVersion=4.0.0`,`options=AVOID_TRAILS%3At%2CALLOW_UTURNS%3At`].join('&');GM_xmlhttpRequest({method:"GET",url:url+"?"+data,headers:{"Content-Type":"application/json"},onload:function(response){if(response.status!==200){RouteTester.msg(`HTTP ${response.status}`,'error');return}let json=null;try{json=JSON.parse(response.responseText)}catch(e){}if(!json||(!json.coords&&!json.alternatives)){RouteTester.msg(_t('rt_msg_no_route'),'error');return}const route=json.coords?json:(json.alternatives?json.alternatives[0].response:null);if(route){RouteTester.lastRouteData=route;RouteTester.drawRoute(route)}else{RouteTester.msg(_t('rt_msg_no_route'),'error')}},onerror:function(){RouteTester.msg(_t('rt_msg_err'),'error')}})},drawRoute:(routeData)=>{const markers=RouteTester.layer.features.filter(f=>f.geometry.CLASS_NAME.includes('Point')&&f.attributes.type&&(f.attributes.type==='A'||f.attributes.type==='B'));RouteTester.layer.removeAllFeatures();RouteTester.layer.addFeatures(markers);let points=[];if(routeData.coords){points=routeData.coords.map(c=>new OpenLayers.Geometry.Point(c.x,c.y).transform(new OpenLayers.Projection("EPSG:4326"),W.map.getProjectionObject()))}else if(routeData.results){routeData.results.forEach(res=>{points.push(new OpenLayers.Geometry.Point(res.path.x,res.path.y).transform(new OpenLayers.Projection("EPSG:4326"),W.map.getProjectionObject()))})}if(points.length>0){const line=new OpenLayers.Geometry.LineString(points);const feat=new OpenLayers.Feature.Vector(line,{},{strokeColor:"#9c27b0",strokeWidth:8,strokeOpacity:0.7});RouteTester.layer.addFeatures([feat]);let totalMeters=0;let projection=W.map.getProjectionObject();totalMeters=line.getGeodesicLength(projection);let totalSeconds=0;if(routeData.summary){totalSeconds=routeData.summary.totalTime}else if(routeData.results){routeData.results.forEach(r=>totalSeconds+=(r.crossTime||0))}if(totalSeconds===0&&totalMeters>0)totalSeconds=(totalMeters/11.1);const km=(totalMeters/1000).toFixed(1);const min=Math.round(totalSeconds/60);document.getElementById('rt_msg').innerHTML=`<b style="color:green; font-size:14px;">${km} km | ${min} min</b>`;if(RouteTester.settings.showMarkers||RouteTester.settings.showSpeed||RouteTester.settings.showTime){let runningDist=0;let nextMarkerDist=1000;for(let i=0;i<points.length-1;i++){let segDist=points[i].distanceTo(points[i+1]);runningDist+=segDist;if(runningDist>=nextMarkerDist){let ratio=1-((runningDist-nextMarkerDist)/segDist);let mx=points[i].x+(points[i+1].x-points[i].x)*ratio;let my=points[i].y+(points[i+1].y-points[i].y)*ratio;let pt=new OpenLayers.Geometry.Point(mx,my);let currentKm=Math.round(nextMarkerDist/1000);let currentTimeRatio=nextMarkerDist/totalMeters;let currentTimeMin=Math.round((totalSeconds*currentTimeRatio)/60);let currentSpeed=0;if(routeData.results){let resIdx=Math.floor((i/points.length)*routeData.results.length);if(routeData.results[resIdx]&&routeData.results[resIdx].crossTime>0){currentSpeed=Math.round((routeData.results[resIdx].length/routeData.results[resIdx].crossTime)*3.6)}}if(currentSpeed===0)currentSpeed=Math.round((totalMeters/totalSeconds)*3.6);if(RouteTester.settings.showMarkers){let kmStyle={label:`${currentKm} km`,fontColor:"#FFD700",fontSize:"15px",fontWeight:"bold",pointRadius:5,fillColor:"#FFD700",labelYOffset:7,strokeColor:"#000",labelOutlineColor:"black",labelOutlineWidth:5};RouteTester.layer.addFeatures([new OpenLayers.Feature.Vector(pt.clone(),{},kmStyle)])}if(RouteTester.settings.showSpeed){let spdStyle={label:`${currentSpeed} km/h`,fontColor:"#FF0000",fontSize:"14px",fontWeight:"bold",pointRadius:0,labelYOffset:-12,labelOutlineColor:"white",labelOutlineWidth:4};RouteTester.layer.addFeatures([new OpenLayers.Feature.Vector(pt.clone(),{},spdStyle)])}if(RouteTester.settings.showTime){let timeStyle={label:`${currentTimeMin} min`,fontColor:"#0000FF",fontSize:"14px",fontWeight:"bold",pointRadius:0,labelYOffset:-28,labelOutlineColor:"white",labelOutlineWidth:4};RouteTester.layer.addFeatures([new OpenLayers.Feature.Vector(pt.clone(),{},timeStyle)])}nextMarkerDist+=1000}}}}},handleClear:(e)=>{if(e){e.preventDefault();e.stopPropagation()}if(RouteTester.layer)RouteTester.layer.removeAllFeatures();RouteTester.startPoint=null;RouteTester.endPoint=null;RouteTester.lastRouteData=null;document.getElementById('rt_lbl_a').innerText=_t('rt_lbl_a');document.getElementById('rt_lbl_b').innerText=_t('rt_lbl_b');RouteTester.msg(_t('rt_msg_ready'),'neutral')},msg:(txt,type)=>{const el=document.getElementById('rt_msg');el.innerText=txt;if(type==='error'){el.style.background='#ffebee';el.style.color='#c62828'}else if(type==='warn'){el.style.background='#fff3e0';el.style.color='#ef6c00'}else{el.style.background='#f5f5f5';el.style.color='#333'}}};
    const SpeedIndicator={layer:null,init:()=>{const html=`<div style="padding:5px;"><label style="font-weight:bold; display:block; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="speed_master_enable" checked> ${_t('lbl_enable')}</label><div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;"><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="0" checked> 0-40 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#00FF00;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="1" checked> 41-60 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#00FFFF;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="2" checked> 61-80 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#0000FF;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="3" checked> 81-100 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#4B0082;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="4" checked> 101-120 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#800080;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="5" checked> 121-140 <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#FF8000;border-radius:2px;border:1px solid #ddd;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="6" checked> 141+ <span style="margin-left:auto; display:inline-block;width:20px;height:12px;background:#FF0000;border-radius:2px;border:1px solid #ddd;"></span></label></div><div style="margin-top:20px; display:flex; gap:10px;"><button id="speed_scan" class="aa-btn aa-red" style="flex:2;">${_t('common_scan')}</button><button id="speed_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button></div></div>`;UIBuilder.createFloatingWindow('AA_SpeedWin','win_speed','aa-bg-red',html);document.getElementById('speed_scan').onclick=SpeedIndicator.scan;document.getElementById('speed_clear').onclick=()=>{if(SpeedIndicator.layer)SpeedIndicator.layer.removeAllFeatures()}},scan:()=>{if(!SpeedIndicator.layer){SpeedIndicator.layer=new OpenLayers.Layer.Vector("AA_Speed_Labels",{displayInLayerSwitcher:true});W.map.addLayer(SpeedIndicator.layer);SpeedIndicator.layer.setZIndex(9999)}SpeedIndicator.layer.removeAllFeatures();SpeedIndicator.layer.setVisibility(true);W.map.setLayerIndex(SpeedIndicator.layer,9999);if(!document.getElementById('speed_master_enable').checked)return;let enabledRanges=[];document.querySelectorAll('.aa-speed-cb').forEach(cb=>{if(cb.checked)enabledRanges.push(parseInt(cb.value))});const extent=W.map.getExtent();let features=[];getAllObjects('segments').forEach(seg=>{if(!seg.geometry||!extent.intersectsBounds(seg.geometry.getBounds()))return;let speed=Math.max(seg.attributes.fwdMaxSpeed||0,seg.attributes.revMaxSpeed||0);if(speed===0)return;let rangeIdx=-1,color="";if(speed<=40){rangeIdx=0;color="#00FF00"}else if(speed<=60){rangeIdx=1;color="#00FFFF"}else if(speed<=80){rangeIdx=2;color="#0000FF"}else if(speed<=100){rangeIdx=3;color="#4B0082"}else if(speed<=120){rangeIdx=4;color="#800080"}else if(speed<=140){rangeIdx=5;color="#FF8000"}else{rangeIdx=6;color="#FF0000"}if(enabledRanges.includes(rangeIdx)){let centerPt=seg.geometry.getCentroid();let style={pointRadius:12,fillColor:color,fillOpacity:0.9,strokeColor:"#ffffff",strokeWidth:2,label:speed.toString(),fontColor:(color==='#00FF00'||color==='#00FFFF')?"black":"white",fontSize:"11px",fontWeight:"bold",graphicName:"circle"};features.push(new OpenLayers.Feature.Vector(centerPt,{},style))}});SpeedIndicator.layer.addFeatures(features)}};
    const ValidatorCleanUI={qaLayer:null,visualLayer:null,isInitialized:false,settings:{checkShort:false,checkAngle:false,checkCross:false,checkLock:false,checkGhost:false,checkSpeed:false,checkDiscon:false,checkJagged:false,limitShort:6,limitAngle:30,excludeRAB:true,unitSystem:'metric',disconMode:'2w',winTop:'100px',winLeft:'100px',winWidth:DEFAULT_W,winHeight:DEFAULT_H},SETTINGS_STORE:'AA_WME_VALIDATOR_V18',init:()=>{if(ValidatorCleanUI.isInitialized){ValidatorCleanUI.toggle();return}ValidatorCleanUI.loadSettings();ValidatorCleanUI.createWindow();ValidatorCleanUI.isInitialized=true;ValidatorCleanUI.toggle()},toggle:()=>{const win=document.getElementById('aa-qa-pro-window');if(win){win.style.display=(win.style.display==='none'?'block':'none');if(win.style.display==='block')ValidatorCleanUI.saveSettings()}},loadSettings:()=>{const s=localStorage.getItem(ValidatorCleanUI.SETTINGS_STORE);if(s)ValidatorCleanUI.settings={...ValidatorCleanUI.settings,...JSON.parse(s)};if(!ValidatorCleanUI.settings.limitShort)ValidatorCleanUI.settings.limitShort=6;if(!ValidatorCleanUI.settings.limitAngle)ValidatorCleanUI.settings.limitAngle=30;if(!ValidatorCleanUI.settings.winWidth)ValidatorCleanUI.settings.winWidth=DEFAULT_W;if(!ValidatorCleanUI.settings.winHeight)ValidatorCleanUI.settings.winHeight=DEFAULT_H;if(!ValidatorCleanUI.settings.disconMode||ValidatorCleanUI.settings.disconMode==='all')ValidatorCleanUI.settings.disconMode='2w'},saveSettings:()=>{localStorage.setItem(ValidatorCleanUI.SETTINGS_STORE,JSON.stringify(ValidatorCleanUI.settings))},openGMaps:()=>{if(!W||!W.map)return;const center=W.map.getCenter();const lonlat=new OpenLayers.LonLat(center.lon,center.lat).transform(W.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));const url=`https://www.google.com/maps?q=${lonlat.lat},${lonlat.lon}`;window.open(url,'_blank')},scanMap:()=>{if(typeof W==='undefined'||!W.map||!W.model)return;const statusEl=document.getElementById('aa_qa_status');statusEl.innerText=_t('qa_msg_scanning');statusEl.style.color='#2196F3';if(!ValidatorCleanUI.qaLayer){ValidatorCleanUI.qaLayer=new OpenLayers.Layer.Vector("AA_QA_Results",{displayInLayerSwitcher:true});W.map.addLayer(ValidatorCleanUI.qaLayer)}ValidatorCleanUI.qaLayer.removeAllFeatures();ValidatorCleanUI.qaLayer.setVisibility(true);ValidatorCleanUI.qaLayer.setZIndex(1001);W.selectionManager.unselectAll();const extent=W.map.getExtent();const segments=W.model.segments.getObjectArray().filter(s=>s.geometry&&extent.intersectsBounds(s.geometry.getBounds()));const nodes=W.model.nodes.getObjectArray().filter(n=>n.geometry&&extent.intersectsBounds(n.geometry.getBounds()));if(segments.length===0){statusEl.innerText=_t('qa_msg_no_segments');statusEl.style.color='#F44336';return}const features=[];const modelsToSelect=[];const isMetric=ValidatorCleanUI.settings.unitSystem==='metric';const isRAB=(s)=>s.isInRoundabout();const s=ValidatorCleanUI.settings;if(s.checkShort){let limit=parseFloat(s.limitShort)||6;if(!isMetric)limit=limit*0.3048;segments.forEach(seg=>{if(!seg.geometry)return;if(s.excludeRAB&&isRAB(seg))return;const len=seg.geometry.getGeodesicLength(W.map.getProjectionObject());if(len<limit){const txt=isMetric?Math.round(len)+'m':Math.round(len*3.28)+'ft';features.push(ValidatorCleanUI.createFeature(seg.geometry,'#E91E63',txt));modelsToSelect.push(seg)}})}if(s.checkDiscon){const ignoredTypes=[5,10,16,18];segments.forEach(seg=>{if(!seg.geometry)return;if(s.excludeRAB&&isRAB(seg))return;if(ignoredTypes.includes(seg.attributes.roadType))return;const nodeA=W.model.nodes.objects[seg.attributes.fromNodeID];const nodeB=W.model.nodes.objects[seg.attributes.toNodeID];if(!nodeA||!nodeB||!nodeA.geometry||!nodeB.geometry)return;const conA=nodeA.attributes.segIDs.length;const conB=nodeB.attributes.segIDs.length;const visibleA=extent.intersectsBounds(nodeA.geometry.getBounds());const visibleB=extent.intersectsBounds(nodeB.geometry.getBounds());let isDisc=false;if(s.disconMode==='2w'){if(conA===1&&conB===1&&visibleA&&visibleB)isDisc=true}else if(s.disconMode==='1w'){const deadA=(conA===1&&visibleA);const deadB=(conB===1&&visibleB);if((deadA&&conB>1)||(deadB&&conA>1))isDisc=true}if(isDisc){features.push(ValidatorCleanUI.createFeature(seg.geometry,'#FF5722','Disc'));modelsToSelect.push(seg)}})}if(s.checkJagged){segments.forEach(seg=>{if(!seg.geometry)return;if(s.excludeRAB&&isRAB(seg))return;const verts=seg.geometry.getVertices();const len=seg.geometry.getGeodesicLength(W.map.getProjectionObject());if(verts.length>3&&(len/verts.length)<3){features.push(ValidatorCleanUI.createFeature(seg.geometry,'#795548','Jagged'));modelsToSelect.push(seg)}})}if(s.checkCross){const items=segments.map(seg=>({s:seg,b:seg.geometry.getBounds()}));const ignoredTypes=[5,10,16,18];for(let i=0;i<items.length;i++){let item1=items[i];for(let j=i+1;j<items.length;j++){let item2=items[j];if(!item1.b.intersectsBounds(item2.b))continue;let s1=item1.s;let s2=item2.s;if(ignoredTypes.includes(s1.attributes.roadType)||ignoredTypes.includes(s2.attributes.roadType))continue;if(s1.attributes.level===s2.attributes.level&&s1.attributes.fromNodeID!==s2.attributes.fromNodeID&&s1.attributes.fromNodeID!==s2.attributes.toNodeID&&s1.attributes.toNodeID!==s2.attributes.fromNodeID&&s1.attributes.toNodeID!==s2.attributes.toNodeID){if(s1.geometry.intersects(s2.geometry)){features.push(ValidatorCleanUI.createFeature(s1.geometry,'#D50000','X'));if(!modelsToSelect.includes(s1))modelsToSelect.push(s1);if(!modelsToSelect.includes(s2))modelsToSelect.push(s2)}}}}}if(s.checkLock)segments.forEach(seg=>{if(!seg.geometry)return;const rt=seg.attributes.roadType;const lock=(seg.attributes.lockRank||0)+1;let req=1;if(rt===3)req=4;else if(rt===6)req=3;else if(rt===7)req=2;else if(rt===4&&lock<2)req=2;if(lock<req){features.push(ValidatorCleanUI.createFeature(seg.geometry,'#F44336',`L${lock}`));modelsToSelect.push(seg)}});if(s.checkGhost)segments.forEach(seg=>{if(!seg.geometry)return;const sid=seg.attributes.primaryStreetID;if(sid){const st=W.model.streets.objects[sid];if(st&&st.attributes.name&&st.attributes.name.trim()!==""){let ce=!st.attributes.cityID;if(!ce){const c=W.model.cities.objects[st.attributes.cityID];if(!c||!c.attributes.name||c.attributes.name.trim()==="")ce=true}if(ce){features.push(ValidatorCleanUI.createFeature(seg.geometry,'#FF9800','NoCity'));modelsToSelect.push(seg)}}}});if(s.checkSpeed)segments.forEach(seg=>{if(!seg.geometry)return;if(s.excludeRAB&&isRAB(seg))return;const sp=seg.attributes.fwdMaxSpeed;if(!sp)return;const tn=W.model.nodes.objects[seg.attributes.toNodeID];if(tn&&tn.attributes.segIDs.length===2){const oid=tn.attributes.segIDs.find(id=>id!==seg.attributes.id);const os=W.model.segments.objects[oid];if(os){let osp=(os.attributes.fromNodeID===tn.attributes.id)?os.attributes.fwdMaxSpeed:os.attributes.revMaxSpeed;if(osp>0&&Math.abs(sp-osp)>=30){features.push(ValidatorCleanUI.createFeature(tn.geometry,'#2196F3','Jump',true));modelsToSelect.push(tn)}}}});if(s.checkAngle)nodes.forEach(n=>{if(!n.geometry)return;if(n.attributes.segIDs.length<2)return;const sg=n.attributes.segIDs.map(id=>W.model.segments.objects[id]);if(s.excludeRAB&&sg.some(seg=>seg&&isRAB(seg)))return;for(let i=0;i<sg.length;i++)for(let j=i+1;j<sg.length;j++){if(!sg[i]||!sg[j]||!sg[i].geometry||!sg[j].geometry)continue;const angle=ValidatorCleanUI.calculateAngleAtNode(n,sg[i],sg[j]);if(angle<(parseFloat(s.limitAngle)||30)){features.push(ValidatorCleanUI.createFeature(n.geometry,'#9C27B0',Math.round(angle)+'°',true));if(!modelsToSelect.includes(n))modelsToSelect.push(n)}}});ValidatorCleanUI.qaLayer.addFeatures(features);if(modelsToSelect.length>0){statusEl.innerText=`${_t('qa_msg_found')}: ${modelsToSelect.length}`;statusEl.style.color='#D50000';W.selectionManager.setSelectedModels(modelsToSelect);let b=null;modelsToSelect.forEach(o=>{if(o.geometry){if(!b)b=o.geometry.getBounds().clone();else b.extend(o.geometry.getBounds())}});if(b)W.map.setCenter(b.getCenterLonLat())}else{statusEl.innerText=_t('qa_msg_clean');statusEl.style.color='#4CAF50'}},createFeature:(geometry,color,label,isPoint=false)=>{if(!geometry)return null;return new OpenLayers.Feature.Vector(geometry.clone(),{},{strokeColor:color,strokeWidth:isPoint?0:6,strokeOpacity:0.6,pointRadius:isPoint?7:0,fillColor:color,fillOpacity:0.8,label:label,labelOutlineColor:"white",labelOutlineWidth:2,fontSize:"10px",fontColor:color,labelYOffset:16,fontWeight:"bold"})},calculateAngleAtNode:(node,s1,s2)=>{const pNode=node.geometry;const getP=(s)=>{const v=s.geometry.getVertices();return(s.attributes.fromNodeID===node.attributes.id)?v[1]:v[v.length-2]};const p1=getP(s1);const p2=getP(s2);const a=Math.sqrt(Math.pow(p1.x-pNode.x,2)+Math.pow(p1.y-pNode.y,2));const b=Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));const c=Math.sqrt(Math.pow(p2.x-pNode.x,2)+Math.pow(p2.y-pNode.y,2));const cosC=(a*a+c*c-b*b)/(2*a*c);return Math.acos(Math.max(-1,Math.min(1,cosC)))*180/Math.PI},createWindow:()=>{if(document.getElementById('aa-qa-pro-window'))return;const s=ValidatorCleanUI.settings;const win=document.createElement('div');win.id='aa-qa-pro-window';win.className=`aa-window ${_dir()}`;win.style.cssText=` position: fixed; top: ${s.winTop}; left: ${s.winLeft}; width: ${s.winWidth}; height: ${s.winHeight}; background: #fff; border-radius: 8px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: none; font-family: 'Cairo', sans-serif, Arial; overflow: hidden; resize: none; direction: ${_dir()}; `;const resizeHandle=document.createElement('div');resizeHandle.id='aa-qa-resize-handle';win.appendChild(resizeHandle);const head=document.createElement('div');head.className='aa-header aa-bg-orange';head.innerHTML=`<span>${_t('qa_title')}</span><span id="aa-qa-close" class="aa-close">✖</span>`;win.appendChild(head);const body=document.createElement('div');body.className='aa-content';const createChk=(key,label)=>`<label class="aa-qa-chk-card"><input type="checkbox" id="aa_qa_${key}" ${s[key]?'checked':''} data-key="${key}"><span>${label}</span></label>`;let html=`<div class="aa-qa-grid"> ${createChk('checkShort',_t('qa_lbl_short'))} ${createChk('checkAngle',_t('qa_lbl_angle'))} ${createChk('checkCross',_t('qa_lbl_cross'))} ${createChk('checkLock',_t('qa_lbl_lock'))} ${createChk('checkGhost',_t('qa_lbl_ghost'))} ${createChk('checkSpeed',_t('qa_lbl_speed'))} ${createChk('checkDiscon',_t('qa_lbl_discon'))} ${createChk('checkJagged',_t('qa_lbl_jagged'))} <button id="aa_qa_gmaps_grid" class="aa-qa-grid-btn">${_t('qa_btn_gmaps')}</button> </div>`;html+=`<div class="aa-qa-settings-box"> <div class="aa-qa-setting-row"><span>${_t('qa_opt_exclude_rab')}</span><input type="checkbox" id="aa_qa_excludeRAB" ${s.excludeRAB?'checked':''}></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_discon_mode')}</span><div class="aa-qa-pill"><div id="aa_qa_disc_1w" class="aa-qa-pill-opt ${s.disconMode==='1w'?'active':''}">${_t('qa_opt_discon_1w')}</div><div id="aa_qa_disc_2w" class="aa-qa-pill-opt ${s.disconMode==='2w'?'active':''}">${_t('qa_opt_discon_2w')}</div></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_unit_m')} / ${_t('qa_unit_i')}</span><div class="aa-qa-pill"><div id="aa_qa_unit_m" class="aa-qa-pill-opt ${s.unitSystem==='metric'?'active':''}">${_t('qa_unit_m')}</div><div id="aa_qa_unit_i" class="aa-qa-pill-opt ${s.unitSystem==='imperial'?'active':''}">${_t('qa_unit_i')}</div></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_dist')}</span><div><input type="number" id="aa_qa_limitShort" class="aa-qa-input" value="${s.limitShort}"> <span id="aa_qa_lbl_short_unit" style="color:#888;">${s.unitSystem==='metric'?'m':'ft'}</span></div></div> <div class="aa-qa-setting-row"><span>${_t('qa_lbl_limit_angle')}</span><div><input type="number" id="aa_qa_limitAngle" class="aa-qa-input" value="${s.limitAngle}"> <span>°</span></div></div> </div>`;html+=`<div class="aa-qa-action-row"> <button id="aa_qa_scan" class="aa-qa-btn aa-btn-scan">${_t('qa_btn_scan')}</button> <button id="aa_qa_clear" class="aa-qa-btn aa-btn-clear">${_t('qa_btn_clear')}</button> </div>`;html+=`<div id="aa_qa_status" style="text-align:center; margin-top:8px; font-weight:bold; font-size:11px; color:#777;">${_t('qa_msg_ready')}</div>`;body.innerHTML=html;win.appendChild(body);document.body.appendChild(win);document.getElementById('aa-qa-close').onclick=()=>{win.style.display='none';ValidatorCleanUI.saveSettings()};document.getElementById('aa_qa_scan').onclick=ValidatorCleanUI.scanMap;document.getElementById('aa_qa_gmaps_grid').onclick=ValidatorCleanUI.openGMaps;document.getElementById('aa_qa_clear').onclick=()=>{W.selectionManager.unselectAll();if(ValidatorCleanUI.qaLayer)ValidatorCleanUI.qaLayer.removeAllFeatures();if(ValidatorCleanUI.visualLayer)ValidatorCleanUI.visualLayer.removeAllFeatures();document.getElementById('aa_qa_status').innerText=_t('qa_msg_ready')};win.querySelectorAll('input[type="checkbox"][data-key]').forEach(c=>{c.onchange=function(){ValidatorCleanUI.settings[this.getAttribute('data-key')]=this.checked;ValidatorCleanUI.saveSettings()}});document.getElementById('aa_qa_limitShort').onchange=(e)=>{ValidatorCleanUI.settings.limitShort=e.target.value;ValidatorCleanUI.saveSettings()};document.getElementById('aa_qa_limitAngle').onchange=(e)=>{ValidatorCleanUI.settings.limitAngle=e.target.value;ValidatorCleanUI.saveSettings()};document.getElementById('aa_qa_excludeRAB').onchange=(e)=>{ValidatorCleanUI.settings.excludeRAB=e.target.checked;ValidatorCleanUI.saveSettings()};const setupPill=(ids,settingKey,values)=>{ids.forEach((id,idx)=>{document.getElementById(id).onclick=()=>{ValidatorCleanUI.settings[settingKey]=values[idx];ValidatorCleanUI.saveSettings();ids.forEach((oid,oidx)=>{const el=document.getElementById(oid);if(idx===oidx)el.classList.add('active');else el.classList.remove('active')});if(settingKey==='unitSystem')document.getElementById('aa_qa_lbl_short_unit').innerText=values[idx]==='metric'?'m':'ft'}})};setupPill(['aa_qa_unit_m','aa_qa_unit_i'],'unitSystem',['metric','imperial']);setupPill(['aa_qa_disc_1w','aa_qa_disc_2w'],'disconMode',['1w','2w']);let isDrag=false,startX,startY,initialLeft,initialTop;head.onmousedown=(e)=>{if(e.target.className.includes('aa-close'))return;isDrag=true;startX=e.clientX;startY=e.clientY;initialLeft=win.offsetLeft;initialTop=win.offsetTop;document.onmousemove=(e)=>{if(!isDrag)return;e.preventDefault();win.style.left=(initialLeft+e.clientX-startX)+'px';win.style.top=(initialTop+e.clientY-startY)+'px'};document.onmouseup=()=>{isDrag=false;document.onmousemove=null;document.onmouseup=null;ValidatorCleanUI.settings.winTop=win.style.top;ValidatorCleanUI.settings.winLeft=win.style.left;ValidatorCleanUI.saveSettings()}};const handle=document.getElementById('aa-qa-resize-handle');let isResizing=false,rStartX,rStartY,rStartW,rStartH;handle.onmousedown=(e)=>{isResizing=true;rStartX=e.clientX;rStartY=e.clientY;rStartW=win.offsetWidth;rStartH=win.offsetHeight;e.stopPropagation();e.preventDefault()};document.addEventListener('mousemove',(e)=>{if(!isResizing)return;const newW=rStartW+(rStartX-e.clientX);const newH=rStartH+(e.clientY-rStartY);if(newW>280){win.style.width=newW+'px';win.style.left=(e.clientX)+'px'}if(newH>300)win.style.height=newH+'px'});document.addEventListener('mouseup',()=>{if(isResizing){isResizing=false;ValidatorCleanUI.settings.winWidth=win.style.width;ValidatorCleanUI.settings.winHeight=win.style.height;ValidatorCleanUI.settings.winLeft=win.style.left;ValidatorCleanUI.saveSettings()}})}};
    const AdvancedSelection={init:()=>{const html=`<div style="padding:5px;"><label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">${_t('adv_lbl_crit')}</label><select id="adv_crit_sel" class="aa-input"><option value="no_city">${_t('adv_opt_nocity')}</option><option value="no_speed">${_t('adv_opt_nospeed')}</option><option value="lock">${_t('adv_opt_lock')}</option><option value="type">${_t('adv_opt_type')}</option></select><div id="adv_val_container" style="display:none; margin-top:10px;"><label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">${_t('adv_lbl_val')}</label><select id="adv_val_lock" class="aa-input"><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option><option value="4">Level 4</option><option value="5">Level 5</option><option value="6">Level 6</option></select><select id="adv_val_type" class="aa-input" style="display:none;"></select></div><div style="margin-top:20px; display:flex; gap:10px;"><button id="adv_btn_scan" class="aa-btn aa-indigo" style="flex:2;">${_t('adv_btn_sel')}</button><button id="adv_btn_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button></div><div id="adv_msg" style="text-align:center; margin-top:10px; font-weight:bold; font-size:11px; color:#555;"></div></div>`;const win=UIBuilder.createFloatingWindow('AA_AdvWin','win_adv','aa-bg-indigo',html,null);if(!localStorage.getItem('AA_Win_AA_AdvWin')){win.style.width='320px';win.style.height='440px';UIBuilder.saveState('AA_AdvWin',win)}const critSel=document.getElementById('adv_crit_sel');const valContainer=document.getElementById('adv_val_container');const valLock=document.getElementById('adv_val_lock');const valType=document.getElementById('adv_val_type');const roadTypes=[{val:1,key:'adv_type_st'},{val:2,key:'adv_type_ps'},{val:7,key:'adv_type_mh'},{val:6,key:'adv_type_maj'},{val:3,key:'adv_type_fw'},{val:4,key:'adv_type_rmp'},{val:20,key:'adv_type_plr'},{val:22,key:'adv_type_pw'},{val:17,key:'adv_type_pr'},{val:8,key:'adv_type_or'}];valType.innerHTML='';roadTypes.forEach(rt=>{let opt=document.createElement('option');opt.value=rt.val;opt.text=_t(rt.key);valType.appendChild(opt)});critSel.onchange=()=>{const val=critSel.value;if(val==='lock'){valContainer.style.display='block';valLock.style.display='block';valType.style.display='none'}else if(val==='type'){valContainer.style.display='block';valLock.style.display='none';valType.style.display='block'}else{valContainer.style.display='none'}};document.getElementById('adv_btn_scan').onclick=AdvancedSelection.run;document.getElementById('adv_btn_clear').onclick=()=>{W.selectionManager.unselectAll();document.getElementById('adv_msg').innerText=''}},run:()=>{const criteria=document.getElementById('adv_crit_sel').value;const extent=W.map.getExtent();let objectsToSelect=[];let segments=getAllObjects('segments');segments.forEach(seg=>{if(!seg.geometry||!extent.intersectsBounds(seg.geometry.getBounds()))return;const attr=seg.attributes;let match=false;if(criteria==='no_city'){const streetId=attr.primaryStreetID;if(streetId){const street=W.model.streets.objects[streetId];if(street){if(!street.attributes.cityID)match=true;else{const city=W.model.cities.objects[street.attributes.cityID];if(!city||!city.attributes.name||city.attributes.name.trim()==='')match=true}}}else{match=true}}else if(criteria==='no_speed'){const driveable=[1,2,3,4,6,7,8,17,20,22];if(driveable.includes(attr.roadType)){const fwd=attr.fwdMaxSpeed;const rev=attr.revMaxSpeed;if((fwd===null||fwd===0)&&(rev===null||rev===0))match=true}}else if(criteria==='lock'){const reqRank=parseInt(document.getElementById('adv_val_lock').value)-1;if((attr.lockRank||0)===reqRank)match=true}else if(criteria==='type'){if(attr.roadType===parseInt(document.getElementById('adv_val_type').value))match=true}if(match)objectsToSelect.push(seg)});const msgEl=document.getElementById('adv_msg');if(objectsToSelect.length>0){W.selectionManager.setSelectedModels(objectsToSelect);msgEl.innerText=`${_t('adv_msg_found')}: ${objectsToSelect.length}`;msgEl.style.color='green'}else{msgEl.innerText=_t('adv_msg_none');msgEl.style.color='red'}}};
    const CityExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_city_input" class="aa-input" placeholder="${_t('ph_city')}"><div class="aa-btn-group"><button id="aa_city_scan" class="aa-btn aa-gold">${_t('common_scan')}</button><button id="aa_city_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_city_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_CityWin','win_city','aa-bg-gold',html);document.getElementById('aa_city_scan').onclick=CityExplorer.scan;document.getElementById('aa_city_clear').onclick=()=>{document.getElementById('aa_city_res').innerHTML='';document.getElementById('aa_city_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_city_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_city_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let cityGroups={};const extent=W.map.getExtent();const segments=getAllObjects('segments');let foundAny=false;segments.forEach(seg=>{if(!seg.geometry||!extent.intersectsBounds(seg.geometry.getBounds()))return;let cityName=_t('city_no_name');if(seg.attributes.primaryStreetID){let street=W.model.streets.objects[seg.attributes.primaryStreetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name&&city.attributes.name.trim().length>0)cityName=city.attributes.name}}if(query!==""&&!cityName.toLowerCase().includes(query))return;if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(seg);foundAny=true});resDiv.innerHTML='';const sortedCities=Object.keys(cityGroups).sort();if(!foundAny){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedCities.forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-gold">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#fff3cd';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(seg=>{if(seg.geometry){if(!totalBounds)totalBounds=seg.geometry.getBounds().clone();else totalBounds.extend(seg.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})},100)}};
    const PlacesExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_place_input" class="aa-input" placeholder="${_t('ph_place')}"><div class="aa-btn-group"><button id="aa_place_scan" class="aa-btn aa-blue">${_t('common_scan')}</button><button id="aa_place_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_place_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_PlaceWin','win_places','aa-bg-blue',html);document.getElementById('aa_place_scan').onclick=PlacesExplorer.scan;document.getElementById('aa_place_clear').onclick=()=>{document.getElementById('aa_place_res').innerHTML='';document.getElementById('aa_place_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_place_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_place_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{const extent=W.map.getExtent();const venues=getAllObjects('venues');let foundAny=false;resDiv.innerHTML='';if(query===""){let cityGroups={};venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let cityName=_t('city_no_name');if(v.attributes.streetID){let street=W.model.streets.objects[v.attributes.streetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name)cityName=city.attributes.name}}if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(v);foundAny=true});if(!foundAny){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}Object.keys(cityGroups).sort().forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-blue">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(v=>{if(v.geometry){if(!totalBounds)totalBounds=v.geometry.getBounds().clone();else totalBounds.extend(v.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})}else{let results=[];venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let name=v.attributes.name||"Unnamed";if(name.toLowerCase().includes(query))results.push(v)});if(results.length===0){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}results.sort((a,b)=>(a.attributes.name||"").localeCompare(b.attributes.name||"")).forEach(v=>{let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${v.attributes.name||"Unnamed"}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels([v]);W.map.setCenter(v.geometry.getBounds().getCenterLonLat())};resDiv.appendChild(row)})}},100)}};
    const EditorExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_user_input" class="aa-input" placeholder="${_t('ph_user')}"><label style="font-size:11px; font-weight:bold; display:block; margin-bottom:3px;">${_t('lbl_days')}</label><input type="number" id="aa_days_input" class="aa-input" value="0" min="0"><div class="aa-btn-group"><button id="aa_user_scan" class="aa-btn aa-purple">${_t('common_scan')}</button><button id="aa_user_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_user_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_UserWin','win_editors','aa-bg-purple',html);document.getElementById('aa_user_scan').onclick=EditorExplorer.scan;document.getElementById('aa_user_clear').onclick=()=>{document.getElementById('aa_user_res').innerHTML='';W.selectionManager.unselectAll()}},scan:()=>{const resDiv=document.getElementById('aa_user_res');const query=document.getElementById('aa_user_input').value.toLowerCase().trim();const daysVal=parseInt(document.getElementById('aa_days_input').value);const days=isNaN(daysVal)?0:daysVal;const cutoff=days>0?new Date(Date.now()-(days*86400000)):null;resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let users={};const extent=W.map.getExtent();const processObj=(obj,type)=>{if(!obj.geometry)return;if(!extent.intersectsBounds(obj.geometry.getBounds()))return;let uID=obj.attributes.updatedBy||obj.attributes.createdBy;let uTime=obj.attributes.updatedOn||obj.attributes.createdOn;if(cutoff&&new Date(uTime)<cutoff)return;if(uID){let uName="Unknown";if(W.model.users.objects[uID])uName=W.model.users.objects[uID].attributes.userName;else uName="ID:"+uID;if(query!==""&&!uName.toLowerCase().includes(query))return;if(!users[uName])users[uName]={segCount:0,venCount:0,objs:[]};if(type==='segment')users[uName].segCount++;if(type==='venue')users[uName].venCount++;users[uName].objs.push(obj)}};getAllObjects('segments').forEach(o=>processObj(o,'segment'));getAllObjects('venues').forEach(o=>processObj(o,'venue'));resDiv.innerHTML='';const sortedUsers=Object.keys(users).sort((a,b)=>(users[b].segCount+users[b].venCount)-(users[a].segCount+users[a].venCount));if(sortedUsers.length===0){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedUsers.forEach(u=>{let data=users[u];let r=document.createElement('div');r.className='aa-item-row';r.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:13px; max-width:140px; overflow:hidden; text-overflow:ellipsis;">${u}</span><div style="display:flex; gap:5px;"><span class="aa-badge aa-bg-gold" title="Segments"><i class="fa fa-road"></i> ${data.segCount}</span><span class="aa-badge aa-bg-blue" title="Venues"><i class="fa fa-map-marker"></i> ${data.venCount}</span></div>`;r.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(x=>x.style.background='transparent');r.style.background='#e8daef';W.selectionManager.setSelectedModels(data.objs);let totalBounds=null;data.objs.forEach(o=>{if(o.geometry){if(!totalBounds)totalBounds=o.geometry.getBounds().clone();else totalBounds.extend(o.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(r)})},100)}};
    const LockIndicator={layer:null,init:()=>{const html=`<div style="padding:5px;"><label style="font-weight:bold; display:block; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="lock_master_enable" checked> ${_t('lbl_enable')}</label><div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;"><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="0" checked> L1 <span style="display:inline-block;width:12px;height:12px;background:#B0B0B0;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="1" checked> L2 <span style="display:inline-block;width:12px;height:12px;background:#FFC800;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="2" checked> L3 <span style="display:inline-block;width:12px;height:12px;background:#00FF00;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="3" checked> L4 <span style="display:inline-block;width:12px;height:12px;background:#00BFFF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="4" checked> L5 <span style="display:inline-block;width:12px;height:12px;background:#BF00FF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="5" checked> L6 <span style="display:inline-block;width:12px;height:12px;background:#FF0000;border-radius:50%;"></span></label></div><button id="lock_scan" class="aa-btn aa-cyan" style="margin-top:20px;">${_t('common_scan')}</button><button id="lock_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div>`;UIBuilder.createFloatingWindow('AA_LockWin','win_lock','aa-bg-cyan',html);document.getElementById('lock_scan').onclick=LockIndicator.scan;document.getElementById('lock_clear').onclick=()=>{if(LockIndicator.layer)LockIndicator.layer.removeAllFeatures()}},scan:()=>{if(!LockIndicator.layer){LockIndicator.layer=new OpenLayers.Layer.Vector("AA_Locks",{displayInLayerSwitcher:true});W.map.addLayer(LockIndicator.layer);LockIndicator.layer.setZIndex(9999)}LockIndicator.layer.removeAllFeatures();LockIndicator.layer.setVisibility(true);W.map.setLayerIndex(LockIndicator.layer,9999);if(!document.getElementById('lock_master_enable').checked)return;let enabledLevels=[];document.querySelectorAll('.aa-lock-cb').forEach(cb=>{if(cb.checked)enabledLevels.push(parseInt(cb.value))});const LOCK_COLORS={0:'#B0B0B0',1:'#FFC800',2:'#00FF00',3:'#00BFFF',4:'#BF00FF',5:'#FF0000'};const extent=W.map.getExtent();let features=[];const process=(obj,isVenue)=>{if(!obj.geometry||!extent.intersectsBounds(obj.geometry.getBounds()))return;let rank=(obj.attributes.lockRank!==undefined&&obj.attributes.lockRank!==null)?obj.attributes.lockRank:0;if(enabledLevels.includes(rank)){let centerPt=obj.geometry.getCentroid();let style={pointRadius:10,fontSize:"10px",fontWeight:"bold",label:"L"+(rank+1),fontColor:"black",fillColor:LOCK_COLORS[rank],fillOpacity:0.85,strokeColor:"#333",strokeWidth:1,graphicName:isVenue?"square":"circle"};features.push(new OpenLayers.Feature.Vector(centerPt,{},style))}};getAllObjects('segments').forEach(o=>process(o,false));getAllObjects('venues').forEach(o=>process(o,true));LockIndicator.layer.addFeatures(features)}};
    const RoundaboutEditor={isInitialized:false,timeout:null,init:()=>{const html=`<div style="text-align:center;padding:10px;"><div style="margin-bottom:15px;background:#fff;border:2px solid #333;padding:10px;border-radius:8px;"><span style="font-size:16px;font-weight:bold;color:#000;">${_t('unit_m')}: </span><input type="number" id="ra-val" class="aa-input" value="1" style="width:80px;display:inline-block;font-size:18px;font-weight:bold;text-align:center;border:1px solid #000;"></div><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تحريك (Move)</div><div class="aa-ra-controls"><div></div><button id="ra_up" class="aa-btn aa-green aa-big-icon">▲</button><div></div><button id="ra_left" class="aa-btn aa-green aa-big-icon">◄</button><button id="ra_down" class="aa-btn aa-green aa-big-icon">▼</button><button id="ra_right" class="aa-btn aa-green aa-big-icon">►</button></div><div style="margin-top:20px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تدوير (Rotate)</div><div class="aa-btn-group"><button id="ra_rot_l" class="aa-btn aa-bg-red aa-huge-icon">↺</button><button id="ra_rot_r" class="aa-btn aa-bg-blue aa-huge-icon">↻</button></div></div><div style="margin-top:15px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">حجم (Size)</div><div class="aa-btn-group"><button id="ra_shrink" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_in')}</button><button id="ra_expand" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_out')}</button></div></div></div><div id="ra_status" style="margin-top:15px;text-align:center;font-weight:bold;font-size:16px;color:red;border-top:2px solid #000;padding-top:10px;">${_t('ra_err')}</div>`;UIBuilder.createFloatingWindow('AA_RAWin','win_ra','aa-bg-green',html);if(!RoundaboutEditor.isInitialized){W.selectionManager.events.register("selectionchanged",null,RoundaboutEditor.onSelectionChanged);RoundaboutEditor.isInitialized=true}RoundaboutEditor.checkSelection();document.getElementById('ra_up').onclick=()=>RoundaboutEditor.run('ShiftLat',1);document.getElementById('ra_down').onclick=()=>RoundaboutEditor.run('ShiftLat',-1);document.getElementById('ra_left').onclick=()=>RoundaboutEditor.run('ShiftLong',-1);document.getElementById('ra_right').onclick=()=>RoundaboutEditor.run('ShiftLong',1);document.getElementById('ra_rot_l').onclick=()=>RoundaboutEditor.run('Rotate',-1);document.getElementById('ra_rot_r').onclick=()=>RoundaboutEditor.run('Rotate',1);document.getElementById('ra_shrink').onclick=()=>RoundaboutEditor.run('Diameter',-1);document.getElementById('ra_expand').onclick=()=>RoundaboutEditor.run('Diameter',1)},onSelectionChanged:()=>{if(RoundaboutEditor.timeout)clearTimeout(RoundaboutEditor.timeout);RoundaboutEditor.timeout=setTimeout(()=>{RoundaboutEditor.checkSelection()},50);},checkSelection:()=>{try{const win=document.getElementById('AA_RAWin');if(!win||win.style.display==='none')return;const el=document.getElementById('ra_status');if(!el)return;const sel=W.selectionManager.getSelectedFeatures();let isRA=false;if(sel.length>0&&sel[0].model.type==='segment'){if(WazeWrap.Model.isRoundaboutSegmentID(sel[0].model.attributes.id))isRA=true}el.innerText=isRA?_t('common_ready'):_t('ra_err');el.style.color=isRA?'#00c853':'#d50000'}catch(e){}},run:(action,multiplier)=>{try{var WazeActionUpdateSegmentGeometry=require('Waze/Action/UpdateSegmentGeometry');var WazeActionMoveNode=require('Waze/Action/MoveNode');var WazeActionMultiAction=require('Waze/Action/MultiAction')}catch(e){return}var val=parseFloat(document.getElementById('ra-val').value)*multiplier;var segs=WazeWrap.getSelectedFeatures();if(!segs||segs.length===0)return;var segObj=segs[0];const getRASegs=(s)=>WazeWrap.Model.getAllRoundaboutSegmentsFromObj(s);try{if(action==='ShiftLong'||action==='ShiftLat'){var RASegs=getRASegs(segObj);var multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);let isLat=(action==='ShiftLat');let c_idx=isLat?1:0;let offset=0;let c=WazeWrap.Geometry.ConvertTo4326(s.attributes.geoJSONGeometry.coordinates[0][0],s.attributes.geoJSONGeometry.coordinates[0][1]);if(isLat)offset=WazeWrap.Geometry.CalculateLatOffsetGPS(val,c.lon,c.lat);else offset=WazeWrap.Geometry.CalculateLongOffsetGPS(val,c.lon,c.lat);for(let j=1;j<newGeo.coordinates.length-1;j++)newGeo.coordinates[j][c_idx]+=offset;multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);newNodeGeo.coordinates[c_idx]+=offset;let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Rotate'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let angleDeg=5*multiplier;let angleRad=angleDeg*(Math.PI/180);let cosTheta=Math.cos(angleRad);let sinTheta=Math.sin(angleRad);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let nX900913=cosTheta*(pX-centerX)-sinTheta*(pY-centerY)+centerX;let nY900913=sinTheta*(pX-centerX)+cosTheta*(pY-centerY)+centerY;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(nX900913,nY900913);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let nodeX900913=cosTheta*(npX-centerX)-sinTheta*(npY-centerY)+centerX;let nodeY900913=sinTheta*(npX-centerX)+cosTheta*(npY-centerY)+centerY;let{lon:nnX,lat:nnY}=WazeWrap.Geometry.ConvertTo4326(nodeX900913,nodeY900913);newNodeGeo.coordinates=[nnX,nnY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Diameter'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let h=Math.sqrt(Math.abs(Math.pow(pX-centerX,2)+Math.pow(pY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(pX-centerX)*ratio;let y=centerY+(pY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let h=Math.sqrt(Math.abs(Math.pow(npX-centerX,2)+Math.pow(npY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(npX-centerX)*ratio;let y=centerY+(npY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newNodeGeo.coordinates=[nX,nY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}}catch(e){}}};

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
            .aa-results { min-height:100px; border-top:1px solid #ddd; margin-top:5px; padding-top:5px; font-size:12px; }
            .aa-item-row { padding:12px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s; } .aa-item-row:hover { background:#eee; }
            .aa-ra-controls { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; width:140px; margin:0 auto; }
            .rt-lbl { font-size: 11px; color: #555; margin-bottom: 5px; direction: ltr; text-align: left; padding: 6px; background: #fff; border: 1px solid #ccc; border-radius: 4px; overflow:hidden; white-space:nowrap; }
            .rt-btn-a { background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb; text-shadow: none; box-shadow:none; } .rt-btn-b { background: #fce4ec; color: #c2185b; border: 1px solid #f8bbd0; text-shadow: none; box-shadow:none; } .rt-btn-go { background: #4caf50; } .rt-btn-clr { background: #f44336; }
            #rt_msg { margin-top: 15px; font-size: 13px; color: #333; background: #fff3e0; padding: 10px; border: 1px solid #ffe0b2; border-radius: 4px; min-height: 20px; text-align: center; font-weight: bold; }
            .aa-setting-btn { opacity: 0.5; transition: all 0.2s; justify-content: flex-start; padding-left: 10px; position:relative; } .aa-setting-btn.active { opacity: 1; box-shadow: inset 0 0 5px rgba(0,0,0,0.2); } .aa-chk-box { display: inline-block; width: 16px; height: 16px; background: rgba(255,255,255,0.3); border-radius: 3px; margin-right: 5px; margin-left: 5px; text-align: center; line-height: 16px; font-size: 12px; color: #fff; }
            .aa-lock-opt { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 0; background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; color: #333; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.05); } .aa-lock-opt:hover { background: #e0e0e0; transform: translateY(-1px); } .aa-lock-opt input { margin-left: 8px; }
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
        if(existingTab) existingTab.remove();
        const existingLink = document.querySelector('ul.nav-tabs li a[href="#aa-suite-tab-content"]');
        if(existingLink) existingLink.parentElement.remove();

        const navTabs = userTabs.querySelector('.nav-tabs');
        const tabContent = userTabs.querySelector('.tab-content');
        if(!navTabs || !tabContent) return;

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
                <div style="height:2px; background:#ccc; margin:10px 0;"></div>

                <button id="btn_open_city" class="aa-btn aa-bg-gold"><i class="fa fa-building"></i> ${_t('btn_city')}</button>
                <button id="btn_open_places" class="aa-btn aa-bg-blue"><i class="fa fa-map-marker"></i> ${_t('btn_places')}</button>
                <button id="btn_open_editors" class="aa-btn aa-bg-purple"><i class="fa fa-users"></i> ${_t('btn_editors')}</button>
                <button id="btn_open_lock" class="aa-btn aa-bg-cyan"><i class="fa fa-lock"></i> ${_t('btn_lock')}</button>
                <div style="height:2px; background:#ccc; margin:10px 0;"></div>
                <button id="btn_open_speed" class="aa-btn aa-bg-red"><i class="fa fa-tachometer"></i> ${_t('btn_speed')}</button>
                <button id="btn_open_qa" class="aa-btn aa-bg-orange"><i class="fa fa-bug"></i> ${_t('btn_qa')}</button>
                <button id="btn_open_adv" class="aa-btn aa-bg-indigo"><i class="fa fa-filter"></i> ${_t('btn_adv')}</button>
                <button id="btn_open_ra" class="aa-btn aa-bg-green"><i class="fa fa-refresh"></i> ${_t('btn_ra')}</button>
                <button id="btn_open_route" class="aa-btn aa-bg-darkblue"><i class="fa fa-road"></i> ${_t('btn_route')}</button>
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
            // Close existing windows to avoid mix-up
            document.querySelectorAll('.aa-window').forEach(w => w.style.display = 'none');
        };
        document.getElementById('btn_open_inspector').onclick = CityInspectorModule.init;
        document.getElementById('btn_open_city').onclick = CityExplorer.init;
        document.getElementById('btn_open_places').onclick = PlacesExplorer.init;
        document.getElementById('btn_open_editors').onclick = EditorExplorer.init;
        document.getElementById('btn_open_ra').onclick = RoundaboutEditor.init;
        document.getElementById('btn_open_lock').onclick = LockIndicator.init;
        document.getElementById('btn_open_qa').onclick = ValidatorCleanUI.init;
        document.getElementById('btn_open_adv').onclick = AdvancedSelection.init;
        document.getElementById('btn_open_speed').onclick = SpeedIndicator.init;
        document.getElementById('btn_open_route').onclick = RouteTester.init;
    }

    function bootstrap(tries=1) {
        if (typeof W !== 'undefined' && W.map && W.model && document.getElementById('user-info')) {
            const savedLang = localStorage.getItem('AA_Lang');
            if(savedLang && STRINGS[savedLang]) currentLang = savedLang;
            injectCSS();
            buildSidebar();
            console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} Loaded.`);
        } else if (tries < 50) {
            setTimeout(() => bootstrap(tries+1), 200);
        }
    }
    bootstrap();
})();