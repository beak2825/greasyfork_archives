// ==UserScript==
// @name 		HWM Clan Menu
// @version 	2.2.6
// @description 	HWM Mod - Заменяет ссылку рулетки на Клановое Меню
// @author 	Mefistophel_Gr
// @namespace 	- SAURON -   &   Mefistophel_Gr
// @include 	http://*heroeswm.ru/*
// @include 	http://178.248.235.15/*
// @include 	http://*.lordswm.com/*
// @exclude 	*/rightcol.php*
// @exclude 	*/ch_box.php*
// @exclude 	*/chat*
// @exclude 	*/ticker.html*
// @exclude 	*/frames*
// @exclude 	*/brd.php*
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/8784/HWM%20Clan%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/8784/HWM%20Clan%20Menu.meta.js
// ==/UserScript==

// (c) 2014-2015, - SAURON -  (http://www.heroeswm.ru/pl_info.php?id=3658084)
// (c) 2014-2016, Mefistophel_Gr  (http://www.heroeswm.ru/pl_info.php?id=2287844)

/* С его любезного разрешения использованы части кода из скриптов Дёмина,
*   demin (http://www.heroeswm.ru/pl_info.php?id=15091)
*/

(function() {

var version = '2.2.6';

if (typeof GM_deleteValue != 'function') {
    this.GM_getValue=function (key,def) {return localStorage[key] || def;};
    this.GM_setValue=function (key,value) {return localStorage[key]=value;};
    this.GM_deleteValue=function (key) {return delete localStorage[key];};
}

//========= Библиотека юникода ===============
/* Реализует функции работы с юникодом.
* @file lib_unicode.js
* @version 1.1.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/
function uchar(s) {
    switch (s[0]) {
        case "А": return "\u0410";
        case "Б": return "\u0411";
        case "В": return "\u0412";
        case "Г": return "\u0413";
        case "Д": return "\u0414";
        case "Е": return "\u0415";
        case "Ж": return "\u0416";
        case "З": return "\u0417";
        case "И": return "\u0418";
        case "Й": return "\u0419";
        case "К": return "\u041a";
        case "Л": return "\u041b";
        case "М": return "\u041c";
        case "Н": return "\u041d";
        case "О": return "\u041e";
        case "П": return "\u041f";
        case "Р": return "\u0420";
        case "С": return "\u0421";
        case "Т": return "\u0422";
        case "У": return "\u0423";
        case "Ф": return "\u0424";
        case "Х": return "\u0425";
        case "Ц": return "\u0426";
        case "Ч": return "\u0427";
        case "Ш": return "\u0428";
        case "Щ": return "\u0429";
        case "Ъ": return "\u042a";
        case "Ы": return "\u042b";
        case "Ь": return "\u042c";
        case "Э": return "\u042d";
        case "Ю": return "\u042e";
        case "Я": return "\u042f";
        case "а": return "\u0430";
        case "б": return "\u0431";
        case "в": return "\u0432";
        case "г": return "\u0433";
        case "д": return "\u0434";
        case "е": return "\u0435";
        case "ж": return "\u0436";
        case "з": return "\u0437";
        case "и": return "\u0438";
        case "й": return "\u0439";
        case "к": return "\u043a";
        case "л": return "\u043b";
        case "м": return "\u043c";
        case "н": return "\u043d";
        case "о": return "\u043e";
        case "п": return "\u043f";
        case "р": return "\u0440";
        case "с": return "\u0441";
        case "т": return "\u0442";
        case "у": return "\u0443";
        case "ф": return "\u0444";
        case "х": return "\u0445";
        case "ц": return "\u0446";
        case "ч": return "\u0447";
        case "ш": return "\u0448";
        case "щ": return "\u0449";
        case "ъ": return "\u044a";
        case "ы": return "\u044b";
        case "ь": return "\u044c";
        case "э": return "\u044d";
        case "ю": return "\u044e";
        case "я": return "\u044f";
        case "Ё": return "\u0401";
        case "ё": return "\u0451";
        default: return s[0];
    }
}

function ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++) result += uchar(s[i]);
    return result;
}

function $uchar(s) {
    switch (s[0]) {
        case "\u0410": return "А";
        case "\u0411": return "Б";
        case "\u0412": return "В";
        case "\u0413": return "Г";
        case "\u0414": return "Д";
        case "\u0415": return "Е";
        case "\u0416": return "Ж";
        case "\u0417": return "З";
        case "\u0418": return "И";
        case "\u0419": return "Й";
        case "\u041a": return "К";
        case "\u041b": return "Л";
        case "\u041c": return "М";
        case "\u041d": return "Н";
        case "\u041e": return "О";
        case "\u041f": return "П";
        case "\u0420": return "Р";
        case "\u0421": return "С";
        case "\u0422": return "Т";
        case "\u0423": return "У";
        case "\u0424": return "Ф";
        case "\u0425": return "Х";
        case "\u0426": return "Ц";
        case "\u0427": return "Ч";
        case "\u0428": return "Ш";
        case "\u0429": return "Щ";
        case "\u042a": return "Ъ";
        case "\u042b": return "Ы";
        case "\u042c": return "Ь";
        case "\u042d": return "Э";
        case "\u042e": return "Ю";
        case "\u042f": return "Я";
        case "\u0430": return "а";
        case "\u0431": return "б";
        case "\u0432": return "в";
        case "\u0433": return "г";
        case "\u0434": return "д";
        case "\u0435": return "е";
        case "\u0436": return "ж";
        case "\u0437": return "з";
        case "\u0438": return "и";
        case "\u0439": return "й";
        case "\u043a": return "к";
        case "\u043b": return "л";
        case "\u043c": return "м";
        case "\u043d": return "н";
        case "\u043e": return "о";
        case "\u043f": return "п";
        case "\u0440": return "р";
        case "\u0441": return "с";
        case "\u0442": return "т";
        case "\u0443": return "у";
        case "\u0444": return "ф";
        case "\u0445": return "х";
        case "\u0446": return "ц";
        case "\u0447": return "ч";
        case "\u0448": return "ш";
        case "\u0449": return "щ";
        case "\u044a": return "ъ";
        case "\u044b": return "ы";
        case "\u044c": return "ь";
        case "\u044d": return "э";
        case "\u044e": return "ю";
        case "\u044f": return "я";
        case "\u0401": return "Ё";
        case "\u0451": return "ё";
        default: return s[0];
    }
}

function $ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++) result += $uchar(s[i]);
    return result;
}

//============ Постоянные переменные ===============
var icon_num = 		"6"; 			// номер иконки клана
var hard_site_link = 		"http://wizardsvalley.ru"; 	// адрес клан-сайта по умолчанию
var hard_clan_chat = 		"/index/0-66";		// клан-чат на сайте 	         //-//
var hard_main_server = 	"http://94.142.140.116";	// адрес сервера ДМ          //-//
var hard_alt_server = 		"http://62.109.9.222";		// альтернативный сервер  //-//
var hard_def_servise = 	"/defer/members.php";	// Cервис координации       //-//
var hard_name_plink_1 = 	"Личная ссылка #1";
var hard_name_plink_2 = 	"Личная ссылка #2";

var web_gate = 	"http://62.109.9.222/lightIRC_OSV/"; 	// Лёгкая web-мирка (только для кланов ДМ)

var mark_stat = 	"/market/getmarketstat.php"; 		// Статистика рынка по выставленным ресурсам
var pers_stat =  	"/enterprise/getprotocol.php?pl_id="; 	// Статистика покупки ресурсов по персонажу

clan_forStat();

    if (stat == 0){
        var kks_stat = 		"http://kekus.org/"; // Статистика от Кекуса:
        var kks_st_sklad = 	"pay/sklad"; 	// по клан-складу
        var kks_st_finance = 	"free/finance"; 	// по клан-финансам
        var kks_st_defers = 	"pay/sectordef"; 	// по защитам
        var kks_st_element = 	"trade/elementy"; 	// по рынку Элементов
        var kks_st_bat_char = 	"free/staty"; 	// по боев.показ.персонажа
    } else {
        var kks_stat = 		"http://hwmguide.ru/"; // Статистика от Гайда
        //var kks_st_sklad = 	"pay/sklad"; 	// по клан-складу
        //var kks_st_finance = 	"free/finance"; 	// по клан-финансам
        var kks_st_defers = 	"services/warstats/"; 	// по защитам
        var kks_st_element = 	"trade/elementy"; 	// по рынку Элементов
        var kks_st_bat_char = 	"free/staty"; 	// по боев.показ.персонажа
    }

var lgnd_stat = 	"http://lgnd.ru/event/show/pl_id/"; // Статистика ключевых событий персонажа

var str_url = 	"https://greasyfork.org/ru/scripts/8784-hwm-clan-menu";

//====== Переменные, заменяемые в настройках =======	// по умолчанию всё стоит для клана ДМ: ОСВ
var clan_name = 	GM_getValue("new_clan_name", "ДМ: ОСВ"); 	// название клана
var clan_id = 	GM_getValue("new_clan_id", 5349); 		// ID клана
var sklad_id = 	GM_getValue("new_sklad_id", 69); 		// ID склада клана
var clan_icon = 	GM_getValue("new_clan_icon", true); 		// true - отображать значок клана, false - не отображать

var akdm1_name = 	GM_getValue("new_akdm1_name", "академии 1"); 	// название академии 1
var akdm1_id = 	GM_getValue("new_akdm1_id", ""); 		// ID  академии 1
var akdm2_name = 	GM_getValue("new_akdm2_name", "академии 2"); 	// название академии 2
var akdm2_id = 	GM_getValue("new_akdm2_id", ""); 		// ID  академии 2

var site_link = 	GM_getValue("new_site_link", hard_site_link);
var clan_chat = 	GM_getValue("new_clan_chat", hard_clan_chat);
var main_server = 	GM_getValue("new_main_server", hard_main_server);
var alt_server = 	GM_getValue("new_alt_server", hard_alt_server);
var def_servise = 	GM_getValue("new_def_servise", hard_def_servise);

var name_plink_1 = 	GM_getValue("new_name_plink_1", hard_name_plink_1);
var name_plink_2 = 	GM_getValue("new_name_plink_2", hard_name_plink_2);
var link_plink_1 = 	GM_getValue("new_link_plink_1", "");
var link_plink_2 = 	GM_getValue("new_link_plink_2", "");

//============= Строки пунктов Меню ================
var str_button = 	ustring("&nbspКлан-меню&nbsp;");
var str_button_title = 	ustring("Позволит вам настроить необходимые пункты,\r\n           выводимые в Клановом Меню");
var str_script_name = ustring("Клановое Меню. Версия: ");
var str_gen_info = 	ustring("Общая информация: ");
var str_check_item = 	ustring("Выберите нужные вам пункты, и обновите страницу.");
var str_show_url = 	ustring("Отображать в клановом меню следующие ссылки: ");

var str_txt_clan_name = 	ustring("Название вашего клана:");
var str_no_clan_name = 	ustring("Без названия клана вам не обойтись!");
var str_clan_name_title_1 = 	ustring("Не более 10 символов!");
var str_clan_name_title_2 = 	ustring("В самом меню название изменится \r\n     после обновления страницы");
var str_txt_clan_icon = 	ustring("Отображать в меню значок клана");
var str_icon_title = 		ustring("Отключите иконку, если в названии вашего клана более 7 символов!");
var str_txt_id = 		ustring("ID=");
var str_txt_id_title = 		ustring("Все изменения будут применены \r\n   после обновления страницы");
var str_txt_clan_id = 		ustring("Номер вашего клана: ");
var str_no_clan_id = 		ustring("Вы не знаете ID своего клана?!");
var str_null_clan_id = 		ustring("Такого клана не существует!");
var str_txt_sklad_id = 		ustring("Номер клан-склада: ");
var str_null_sklad_id = 	ustring("Такого склада не существует!");
var str_absent_title = 		ustring("Если у вас его нет, просто оставьте поле пустым!");
var str_absent_title_2 = 	ustring("Если у вас её нет, \r\nпросто оставьте поле пустым!");
var str_restore_title = 		ustring("\r\nЧтобы восстановить оригинальный, введите в поле 'restore'");

var str_txt_akdm1_name = 	ustring("Название академии #1: ");
var str_txt_akadem_id_1 = 	ustring("Номер академии #1: ");
var str_txt_akdm2_name = 	ustring("Название академии #2: ");
var str_txt_akadem_id_2 = 	ustring("Номер академии #2: ");
var str_akdm_name_title = 	ustring("Не более 11 символов!");
var str_txt_clan_site = 	ustring("Адрес кланового сайта: ");
var str_clan_site_title = 	ustring("Адрес сайта должен быть реальным! \r\nОставьте поле пустым, если у вас нет клан-сайта.");
var str_txt_clan_chat = 	ustring("Клан-чат на сайте: ");
var str_txt_main_server = 	ustring("Адрес сервера ДМ: ");
var str_main_server_title = 	ustring(" Используется для большинства сервисов \r\nДолины Магов (включая Статистику рынка)");
var str_txt_alt_server = 	ustring("Альтернативный сервер: ");
var str_alt_server_title = 	ustring("Используйте это поле, чтобы прописать \r\n     свой сервис координации в клане");
var str_txt_web_gate = 	ustring("Лёгкая web-мирка: ");
var str_txt_def_servise = 	ustring("Cервис координации: ");
var str_def_servise_title = 	ustring("Впишите свой сервис координации в клане (без IP сервера в начале)");
var str_txt_add_IP_adr = 	ustring("Добавлять в начале IP ");
var str_txt_add_serv_DM = 	ustring(" сервера ДМ");
var str_txt_add_serv_alt = 	ustring(" альтернативн. сервера");

var str_user_url = 		ustring("для Бойцов клана: ");
var str_clan_site = 		ustring("&nbsp;Сайт клана");
var str_clan_info = 		ustring("&nbsp;Клан Инфо");
var str_clan_store = 		ustring("&nbsp;Клановый склад");
var str_clan_def = 		ustring("&nbsp;Сервис записи на Защиту");
var str_clan_def_title = 	ustring("Таблица для самостоятельной координации и записи на защиту предприятий клана ");
var str_web_irc = 		ustring("&nbsp;Лёгкая мирка (WebGate)");
var str_web_irc_title = 	ustring("Браузерная версия mIRC-чата. Часто падает или не доступна");
var str_clan_irc = 		ustring("&nbsp;Клан-чат на сайте ");
var str_clan_irc_title = 	ustring("Для входа нужно обязательно быть зарегистрированным на сайте клана");
var str_stat_auction = 		ustring("&nbsp;Статистика рынка (квоты)");
var str_stat_auction_title = 	ustring("Обязательно смотрите статистику свободных слотов и цены при выставлении ресурса на рынке. Иначе клану грозят штрафы за нарушения квот или демпинг");
var str_stat_buy = 		ustring("&nbsp;Статистика покупок");
var str_stat_buy_title = 	ustring("Статистика (по торговому скрипту), по вашим покупкам на предприятиях Долины Магов за текущий месяц");
var str_stat_def = 		ustring("&nbsp;Статистика по Защитам");
var str_stat_def_title = 	ustring("Статистика от kekus`а по проведённым защитам за клан");
var str_stat_elem = 		ustring("&nbsp;Статистика по Элементам");
var str_stat_elem_title = 	ustring("Статистика от kekus`а по рыночной стоимости Элементов");
var str_stat_battle = 		ustring("&nbsp;Статистика по Боев.показ.");
var str_stat_battle_title = 	ustring("Статистика от kekus`а по боевым показателям персонажа за последние 2 дня");
var str_stat_lgnd = 		ustring("&nbsp;Статистика на <b>legend.ru</b>");
var str_stat_lgnd_title = 	ustring("Статистика на сайте Элементаля: ключевые события вашего персонажа - Получение умения от 7;  ГО от 6;  ГР, ГВ от 8;  ГН от 7;  ГТ от 2");
var str_name_plink_1 = name_plink_1;
var str_name_plink_2 = name_plink_2;

var str_admin_url = 		ustring("для Администрации клана: ");
var str_clan_log = 		ustring("&nbsp;Протокол клана");
var str_store_log = 		ustring("&nbsp;Протокол склада");
var str_clan_contr = 		ustring("&nbsp;Управление Кланом");
var str_clan_contr_title = 	ustring("Полный доступ только у администрации клана: Глава и Зам. главы. \r\nЛетописцу доступна правка описания клана");
var str_clan_memb = 		ustring("&nbsp;Управление Составом клана");
var str_clan_memb_title = 	ustring("Полный доступ только у администрации клана: Глава и Зам. главы. \r\nВербовщику доступно изменение Описания игрока в списке клана");
var str_clan_inv = 		ustring("&nbsp;Приглашение в Клан");
var str_clan_inv_title = 	ustring("Доступно Вербовщикам клана");
var str_clan_acc = 		ustring("&nbsp;Управление Казной");
var str_clan_acc_title = 	ustring("Доступно Казначею клана");
var str_glory_points = 		ustring("&nbsp;Управление Очками БС");
var str_glory_points_title = 	ustring("Доступно только администрации клана: Глава и Зам. главы");
var str_mil_policy = 		ustring("&nbsp;Военная политика клана");
var str_mil_policy_title = 	ustring("Доступно Воеводе клана");
var str_cast_all = 		ustring("&nbsp;Рассылка по ");
var str_cast_all_title = 	ustring("Доступно Глашатаям клана");
var str_stat_store = 		ustring("&nbsp;Статистика по Складу");
var str_stat_store_title = 	ustring("Статистика от kekus`а по клановому складу");
var str_stat_treas = 		ustring("&nbsp;Статистика по Финансам");
var str_stat_treas_title = 	ustring("Статистика от kekus`а по клановым финансам");

var str_name_plink_title = 	ustring("Не более 23 символов!");
var str_plink_title = 		ustring("Адрес должен быть реальным! Оставьте поле пустым, \r\n     если вам не нужна дополнительная ссылка.");

var str_update = 	ustring("Проверить обновление скрипта");
var str_error = 	ustring("Нашли ошибку? Сообщите!");
var str_send_sms = 	ustring("/sms-create.php?mailto=Mefistophel_Gr&subject=Скрипт: Клановое Меню. ver: ")+version+ustring(" - Найдена ошибка!");
var str_author = 	ustring("Авторы скрипта: ");

//==== Указание включённых пунктов по умолчанию ====
var clan_icon = 	GM_getValue("hwm_clan_icon", true); 	// true - отображать, false - не отображать
var add_server_IP = 	GM_getValue("hwm_server_IP", true);
var clan_site = 	GM_getValue("hwm_clan_site", true);
var clan_info = 	GM_getValue("hwm_clan_info", true);
var clan_store = 	GM_getValue("hwm_clan_store", true);
var clan_def = 	GM_getValue("hwm_clan_def", true);
var web_irc = 	GM_getValue("hwm_web_irc", false);
var clan_irc = 	GM_getValue("hwm_clan_irc", true);
var stat_auction = 	GM_getValue("hwm_stat_auction", true);
var stat_buy = 	GM_getValue("hwm_stat_buy", true);
var stat_def = 	GM_getValue("hwm_stat_def", true);
var stat_elem = 	GM_getValue("hwm_stat_elem", true);
var stat_battle = 	GM_getValue("hwm_stat_battle", true);
var stat_lgnd = 	GM_getValue("hwm_stat_lgnd", true);
var pers_link_1 = 	GM_getValue("hwm_pers_link_1", false);
var pers_link_2 = 	GM_getValue("hwm_pers_link_2", false);
var clan_log = 	GM_getValue("hwm_clan_log", true);
var store_log = 	GM_getValue("hwm_store_log", false);
var clan_contr = 	GM_getValue("hwm_clan_contr", false);
var clan_memb = 	GM_getValue("hwm_clan_memb", false);
var clan_inv = 	GM_getValue("hwm_clan_inv", false);
var clan_acc = 	GM_getValue("hwm_clan_acc", false);
var glory_points = 	GM_getValue("hwm_glory_points", false);
var mil_policy = 	GM_getValue("hwm_mil_policy", false);
var cast_main = 	GM_getValue("hwm_cast_main", false);
var cast_add_1 = 	GM_getValue("hwm_cast_add_1", false);
var cast_add_2 = 	GM_getValue("hwm_cast_add_2", false);
var stat_store = 	GM_getValue("hwm_stat_store", false);
var stat_treas = 	GM_getValue("hwm_stat_treas", false);

//============= Настройки Клан-меню ================
function Open_Settings() {
    if (location.href.indexOf('tj_') == 0) return;
    if (document.querySelector("img[src*='i/top_ny']") ) {
        var point = document.querySelector("td > [src*='rdec_.jpg']");
        //новогодний скин
        button_style = "<style> .hwm_cmenu * {font-size: 12px; color: #F5C137;} .cell_cmenu {border: 1px; border-color: #F5C137; border-style: solid; white-space: nowrap; height: 18px; background: url(http://dcdn3.heroeswm.ru/i/top_ny_rus/line/t_com_bkg_.jpg); font-weight: bold;} </style>";
    } else {
        var point = document.querySelector("td > [src*='rdec.jpg']");
        //обычный скин
        button_style = "<style> .hwm_cmenu * {font-size: 12px; color: #F5C137;} .cell_cmenu {border: 1px; border-color: #F5C137; border-style: solid; white-space: nowrap; height: 18px; background: url(http://dcdn1.heroeswm.ru/i/top/line/t_com_bkg.jpg); font-weight: bold;} </style>";
    }
    if (point == null)	return;

    var d = document.createElement('div');
    d.setAttribute('style', 'position: absolute; margin: -25px 0px 0px 790px; text-align: center;'); 	//Положение кнопки вызова настроек
    d.innerHTML = button_style +
    '<table class="hwm_cmenu" width=88px> <tr height=20>'+ 	// Размер и фон, для кнопки вызова настроек
    '<td class="cell_cmenu" style="cursor:pointer" id="set_Clan_Menu" title="'+str_button_title+'">'+ str_button +'</td>' +
    '</tr> </table>';
    point.parentNode.parentNode.parentNode.appendChild(d); 	//Вставка куска

    addEvent( $("set_Clan_Menu"), "click", settings_Clan_Menu ); 	//Привязка к куску на клик вызов функции

//========= Закрытие настроек ============
function settings_Close() {
    var bg = $('bgOverlay');
    var bgc = $('bgCenter');
    bg.parentNode.removeChild(bg);
    bgc.parentNode.removeChild(bgc);
}

//=========== Окно настроек ==============
function settings_Clan_Menu () {
    var bg = $('bgOverlay');
    var bgc = $('bgCenter');
    var bg_height = ScrollHeight();
    if ( !bg ) {
        bg = document.createElement('div');
        document.body.appendChild( bg );
        bgc = document.createElement('div');
        document.body.appendChild( bgc );
    }
    bg.id = 'bgOverlay';
    bg.style.position = 'absolute';
    bg.style.left = '0px';
    bg.style.width = '100%';
    bg.style.background = "#000000";
    bg.style.opacity = "0.5";
    bg.style.zIndex = "1100";
    bgc.id = 'bgCenter';
    bgc.style.position = 'absolute';
    bgc.style.left = ( (ClientWidth() - 830) / 2 )+'px';
    bgc.style.width = '830px';
    bgc.style.background = "#F6F3EA";
    bgc.style.zIndex = "1105";
    addEvent(bg, "click", settings_Close); 
	//форма и внешний вид окна настроек
	bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Закрыть">x</div><b><center>'+str_script_name+'<font style="color:#008B00;">'+ version +'</font></center></b><hr/> <table width="100%" cellspacing=0 cellpadding=0 border=0>'+
	// 1 общ. инфа + выб. нужные пункты
	'<tr> <td colspan=2 valign="top" style="border-right: solid 2px gray; text-align:center;"> <font style="color:#6A5ACD; font-family: Georgia; font-size:16px; line-height: 2"><b><i>'+str_gen_info+'</i></b></font></td> 	<td colspan=2 align="center"><font style="color:#0070FF; font-family: Georgia; font-size:13px; line-height: 2"><b><i>'+str_check_item+'</i></b></font></td> </tr>'+
	// 2 Название клана + ввод; Отображать в клановом меню;
	'<tr> <td width="22%" align="right"><b>'+str_txt_clan_name+'</b></td> 	<td align="left" width="24%" style="border-right: solid 2px gray;">&nbsp;<input id="set_clan_name" title="'+str_clan_name_title_1+'" value="'+clan_name+'" size="13" maxlength="10"> <input type="submit" id="set_clan_name_ok" value="OK" title="'+str_clan_name_title_2+'"></td> 	<td colspan=2 align="center"><font style="color:#6A5ACD; font-family: Tahoma; font-size:15px; line-height: 1.5">'+str_show_url+'</font></td> </tr>'+
	// 3 Отображать значок клана; для Бойцов; для Администрации
	'<tr> <td colspan=2 align="center" valign="top" style="border-right: solid 2px gray;"> <label style="cursor:pointer;" title="'+str_icon_title+'"><input type=checkbox '+(clan_icon =="1"?"checked":"")+'  id=set_clan_icon> <b>'+str_txt_clan_icon+'</b></label></td> 	<td align="center" style="border-bottom: solid 2px gray;"><font style="line-height: 2"><i><b>'+str_user_url+'</b></i></font></td> 	<td align="center" style="border-bottom: solid 2px gray;"><font style="line-height: 2"><i><b>'+str_admin_url+'</b></i></font></td> </tr>'+
	// 4 Номер клана + ввод; Сайт клана; Протокол клана
	'<tr> <td align="right"><b>'+str_txt_clan_id+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<i><b>'+str_txt_id+'</b></i><input id="set_clan_id" value="'+clan_id+'" size="4" maxlength="4"> <input type="submit" id="set_clan_id_ok" value="OK" title="'+str_txt_id_title+'"> </td> 	<td><label style="cursor:pointer;"><input type=checkbox '+(clan_site =="1"?"checked":"")+'  id=set_clan_site>'+str_clan_site+'</label></td> 	<td><label style="cursor:pointer;"><input type=checkbox '+(clan_log =="1"?"checked":"")+'  id=set_clan_log>'+str_clan_log+'</label></td> </tr>'+
	// 5 Номер склада+ ввод; Клановый склад; Протокол склада
	'<tr> <td align="right"><b>'+str_txt_sklad_id+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<i><b>'+str_txt_id+'</b></i><input id="set_sklad_id" title="'+str_absent_title+'";" value="'+sklad_id+'" size="4" maxlength="3"> <input type="submit" id="set_sklad_id_ok" value="OK" title="'+str_txt_id_title+'"> </td> 	<td><label style="cursor:pointer;"><input type=checkbox '+(clan_store =="1"?"checked":"")+'  id=set_clan_store>'+str_clan_store+'</label></td> 	<td><label style="cursor:pointer;"><input type=checkbox '+(store_log =="1"?"checked":"")+'  id=set_store_log>'+str_store_log+'</label></td> </tr>'+
	// 6 сдвоенная пустая; Сервис записи; Управление Кланом
	'<tr> <td colspan=2 style="border-right: solid 2px gray;"> <hr width="99%" align="left" color="gray"/> </td>  	<td><label style="cursor:pointer;" title="'+str_clan_def_title+'"><input type=checkbox '+(clan_def =="1"?"checked":"")+'  id=set_clan_def>'+str_clan_def+'</label></td>	<td><label style="cursor:pointer;" title="'+str_clan_contr_title+'"><input type=checkbox '+(clan_contr =="1"?"checked":"")+'  id=set_clan_contr>'+str_clan_contr+'</label></td></tr>'+
	// 7 Имя академии 1 + ввод; Лёгкая мирка; Управление Составом
	'<tr> <td align="right"><b>'+str_txt_akdm1_name+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_akdm1_name" title="'+str_akdm_name_title+'";" value="'+akdm1_name+'" size="13" maxlength="11"> <input type="submit" id="set_akdm1_name_ok" value="OK" title="'+str_clan_name_title_2+'"></td> 	<td><label style="cursor:pointer;" title="Доступно только для кланов Долины Магов"><input type=checkbox '+(web_irc =="1"?"checked":"")+'  id=set_web_irc>'+str_web_irc+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_clan_memb_title+'"><input type=checkbox '+(clan_memb =="1"?"checked":"")+'  id=set_clan_memb>'+str_clan_memb+'</label></td></tr>'+
	// 8 Академия #1 + ввод ID; Клан-чат; Приглашение в Клан
	'<tr> <td align="right">'+str_txt_akadem_id_1+'</td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<i>'+str_txt_id+'</i><input id="set_akdm1_id" title="'+str_absent_title_2+'" value="'+akdm1_id+'" size="4" maxlength="4"> <input type="submit" id="set_akdm1_id_ok" value="OK" title="'+str_txt_id_title+'"></td> 	<td><label style="cursor:pointer;" title="'+str_clan_irc_title+'"><input type=checkbox '+(clan_irc =="1"?"checked":"")+'  id=set_clan_irc>'+str_clan_irc+clan_name+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_clan_inv_title+'"><input type=checkbox '+(clan_inv =="1"?"checked":"")+'  id=set_clan_inv>'+str_clan_inv+'</label></td></tr>'+
	// 9 Имя академии 2 + ввод; Статистика рынка; Управление Счётом
	'<tr> <td align="right"><b>'+str_txt_akdm2_name+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_akdm2_name" title="'+str_akdm_name_title+'";" value="'+akdm2_name+'" size="13" maxlength="11"> <input type="submit" id="set_akdm2_name_ok" value="OK" title="'+str_clan_name_title_2+'"></td> 	<td><label style="cursor:pointer;" title="'+str_stat_auction_title+'"><input type=checkbox '+(stat_auction =="1"?"checked":"")+'  id=set_stat_auction>'+str_stat_auction+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_clan_acc_title+'"><input type=checkbox '+(clan_acc =="1"?"checked":"")+'  id=set_clan_acc>'+str_clan_acc+'</label></td></tr>'+
	// 10 Академия #2 + ввод ID; Статистика покупок; Управление БС
	'<tr> <td align="right">'+str_txt_akadem_id_2+'</td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<i>'+str_txt_id+'</i><input id="set_akdm2_id" title="'+str_absent_title_2+'" value="'+akdm2_id+'" size="4" maxlength="4"> <input type="submit" id="set_akdm2_id_ok" value="OK" title="'+str_txt_id_title+'"></td> 	<td><label style="cursor:pointer;" title="'+str_stat_buy_title+'"><input type=checkbox '+(stat_buy =="1"?"checked":"")+'  id=set_stat_buy>'+str_stat_buy+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_glory_points_title+'"><input type=checkbox '+(glory_points =="1"?"checked":"")+'  id=set_glory_points>'+str_glory_points+'</label></td></tr>'+
	// 11 сдвоенная пустая; Статистика по Защитам; Военная политика
	'<tr> <td colspan=2 style="border-right: solid 2px gray;"> <hr width="99%" align="left" color="gray"/> </td> 	<td><label style="cursor:pointer;" title="'+str_stat_def_title+'"><input type=checkbox '+(stat_def =="1"?"checked":"")+'  id=set_stat_def>'+str_stat_def+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_mil_policy_title+'"><input type=checkbox '+(mil_policy =="1"?"checked":"")+'  id=set_mil_policy>'+str_mil_policy+'</label></td></tr>'+
	// 12 Адрес кланового сайта + ввод; Статистика по Элементам; Рассылка по основному клану
	'<tr> <td align="right"><b>'+str_txt_clan_site+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_site_link" title="'+str_clan_site_title+'";" value="'+site_link+'" size="20" maxlength="50"> <input type="submit" id="set_site_link_ok" value="OK" title="'+str_txt_id_title+'"></td> 	<td><label style="cursor:pointer;" title="'+str_stat_elem_title+'"><input type=checkbox '+(stat_elem =="1"?"checked":"")+'  id=set_stat_elem>'+str_stat_elem+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_cast_all_title+'"><input type=checkbox '+(cast_main =="1"?"checked":"")+'  id=set_cast_main>'+str_cast_all+clan_name+'</label></td></tr>'+
	// 13 Клан-чат + ввод; Статистика по Боям; Рассылка по академии 1
	'<tr> <td align="right">'+str_txt_clan_chat+'</td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_clan_chat" title="'+str_absent_title+str_restore_title+'";" value="'+clan_chat+'" size="20" maxlength="30"> <input type="submit" id="set_clan_chat_ok" value="OK" title="'+str_txt_id_title+'"></td> 	<td><label style="cursor:pointer;" title="'+str_stat_battle_title+'"><input type=checkbox '+(stat_battle =="1"?"checked":"")+'  id=set_stat_battle>'+str_stat_battle+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_cast_all_title+'"><input type=checkbox '+(cast_add_1 =="1"?"checked":"")+'  id=set_cast_add_1>'+str_cast_all+akdm1_name+'</label></td></tr>'+
	// 14 Адрес сервера ДМ + IP; Статистика на legend; Рассылка по академии 2
	'<tr> <td align="right"><b>'+str_txt_main_server+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_main_server" title="'+str_main_server_title+'";" value="'+main_server+'" size="20" maxlength="40"> <input type="submit" id="set_main_server_ok" value="OK" title="'+str_txt_id_title+'"> </td> 	<td><label style="cursor:pointer;" title="'+str_stat_lgnd_title+'"> <input type=checkbox '+(stat_lgnd =="1"?"checked":"")+'  id=set_stat_lgnd>'+str_stat_lgnd+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_cast_all_title+'"><input type=checkbox '+(cast_add_2 =="1"?"checked":"")+'  id=set_cast_add_2>'+str_cast_all+akdm2_name+'</label></td></tr>'+
	// 15 Альтернативный сервер + IP; Личная ссылка #1; Статистика по Складу
	'<tr> <td align="right">'+str_txt_alt_server+'</td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_alt_server" title="'+str_alt_server_title+'";" value="'+alt_server+'" size="20" maxlength="40"> <input type="submit" id="set_alt_server_ok" value="OK" title="'+str_txt_id_title+'"> </td> 	<td><label style="cursor:pointer;" title="Введите адрес и название ссылки #1 в полях ниже"><input type=checkbox '+(pers_link_1 =="1"?"checked":"")+'  id=set_pers_link_1>&nbsp;'+str_name_plink_1+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_stat_store_title+'"><input type=checkbox '+(stat_store =="1"?"checked":"")+'  id=set_stat_store>'+str_stat_store+'</label></td></tr>'+
	// 16 сдвоенная пустая; Личная ссылка #2; Статистика по Финансам
	'<tr> <td colspan=2 style="border-right: solid 2px gray;">&nbsp;</td> 	<td><label style="cursor:pointer;" title="Введите адрес и название ссылки #2 в полях ниже"><input type=checkbox '+(pers_link_2 =="1"?"checked":"")+'  id=set_pers_link_2>&nbsp;'+str_name_plink_2+'</label></td> 	<td><label style="cursor:pointer;" title="'+str_stat_treas_title+'"><input type=checkbox '+(stat_treas =="1"?"checked":"")+'  id=set_stat_treas>'+str_stat_treas+'</label></td></tr>'+
	// 17 Cервис координации + ввод адреса; сдвоенная пустая с линией
	'<tr> <td align="right"><b>'+str_txt_def_servise+'</b></td> 	<td align="left" style="border-right: solid 2px gray;">&nbsp;<input id="set_def_servise" title="'+str_def_servise_title+str_restore_title+'";" value="'+def_servise+'" size="20" maxlength="100"> <input type="submit" id="set_def_servise_ok" value="OK" title="'+str_txt_id_title+'"></td> 	<td colspan=2> <hr width="99%" align="right" color="gray"/> </td></tr>'+
	// 18 Добавлять IP; сервера ДМ; Личная ссылка #1 + ввод имя1
	'<tr> <td rowspan=2 align="right" valign="center">'+str_txt_add_IP_adr+'<font size="4">&#10000;</font></td> 	<td align="left" style="border-right: solid 2px gray;"> <label style="cursor:pointer;"><input type=checkbox '+(add_server_IP =="1"?"checked":"")+'  id=set_add_server_IP>'+str_txt_add_serv_DM+'</label></td>		<td colspan=2 align="left">&nbsp;<b>#1: </b><input id="set_name_plink_1" title="'+str_name_plink_title+'";" value="'+str_name_plink_1+'" size="24" maxlength="23"> <font size="4">&#8658;</font> <input id="set_link_plink_1" title="'+str_plink_title+'";" value="'+link_plink_1+'" size="25" maxlength="60"> <input type="submit" id="set_link_plink_1_ok" value="OK" title="'+str_txt_id_title+'"></td> </tr>'+
	// 19 резервный сервер; Личная ссылка #2 + ввод имя2
	'<tr> <td style="border-right: solid 2px gray;"> <label style="cursor:pointer;"><input type=checkbox '+(add_server_IP =="0"?"checked":"")+'  id=set_add_server_alt>'+str_txt_add_serv_alt+'</label></td> 	<td colspan=2 align="left">&nbsp;<b>#2: </b><input id="set_name_plink_2" title="'+str_name_plink_title+'";" value="'+str_name_plink_2+'" size="24" maxlength="23"> <font size="4">&#8658;</font> <input id="set_link_plink_2" title="'+str_plink_title+'";" value="'+link_plink_2+'" size="25" maxlength="60"> <input type="submit" id="set_link_plink_2_ok" value="OK" title="'+str_txt_id_title+'"></td></tr>'+
	'<tr> <td colspan=4> <hr/> </td></tr></table>'+
	// 20 авторы
	'<table width="100%" cellspacing=0 cellpadding=0 border=0> <tr> <td width="30%" align="center"> <a href="'+str_url+'" target=_blank>'+str_update+'</a></td> 	<td width="30%" align="center"><a href="'+str_send_sms+'" target=_blank>'+str_error+'</a></td> 	<td width="37%" align="center">'+str_author+'<a href="pl_info.php?id=3658084" target=_blank>- SAURON -</a> & <a href="pl_info.php?id=2287844" target=_blank>Mefistophel_Gr</a></td> 	<td width="3%" align="right"><a href="javascript:void(0);" title="Спасибо персонажу demin за предоставленный код настроек"  id="open_transfer_id">?</a></td> </tr> </table>';

//====== Обработка кликов по пунктам =======
    addEvent($("bt_close_tr"), "click", settings_Close);		//закрытие настроек
    addEvent($("set_clan_name_ok"), "click", change_clan_name);	//строка ввода - имя клана
    addEvent($("set_clan_icon"), "click", change_clan_icon); 	//чек-бокс
    addEvent($("set_clan_id_ok"), "click", change_clan_id);	//строка ввода - номер клана
    addEvent($("set_sklad_id_ok"), "click", change_sklad_id);	//строка ввода - номер Склада
    addEvent($("set_akdm1_name_ok"), "click", change_akdm1_name); 	//строка ввода - имя академии 1
    addEvent($("set_akdm1_id_ok"), "click", change_akdm1_id);		//строка ввода - ID академии #1
    addEvent($("set_akdm2_name_ok"), "click", change_akdm2_name); 	//строка ввода - имя академии 2
    addEvent($("set_akdm2_id_ok"), "click", change_akdm2_id);		//строка ввода - ID академии #2
    addEvent($("set_site_link_ok"), "click", change_site_link);		//строка ввода - адрес сайта
    addEvent($("set_clan_chat_ok"), "click", change_clan_chat);		//строка ввода - клан-чат
    addEvent($("set_main_server_ok"), "click", change_main_server); 	//строка ввода - адрес сервера ДМ
    addEvent($("set_alt_server_ok"), "click", change_alt_server);		//строка ввода - альтернативный сервер
    addEvent($("set_def_servise_ok"), "click", change_def_servise); 	//строка ввода - сервис координации
    addEvent($("set_add_server_IP"), "click", change_server_mode); 	//радиокнопка
    addEvent($("set_add_server_alt"), "click", change_server_mode); 	//радиокнопка
    addEvent($("set_clan_site"), "click", change_clan_site); 	//чек-бокс
    addEvent($("set_clan_store"), "click", change_clan_store); 	//чек-бокс
    addEvent($("set_clan_def"), "click", change_clan_def); 	//чек-бокс
    addEvent($("set_web_irc"), "click", change_web_irc); 	//чек-бокс
    addEvent($("set_clan_irc"), "click", change_clan_irc); 	//чек-бокс
    addEvent($("set_stat_auction"), "click", change_stat_auction); 	//чек-бокс
    addEvent($("set_stat_buy"), "click", change_stat_buy); 	//чек-бокс
    addEvent($("set_stat_def"), "click", change_stat_def); 	//чек-бокс
    addEvent($("set_stat_elem"), "click", change_stat_elem); 	//чек-бокс
    addEvent($("set_stat_battle"), "click", change_stat_battle); 	//чек-бокс
    addEvent($("set_stat_lgnd"), "click", change_stat_lgnd); 	//чек-бокс
    addEvent($("set_pers_link_1"), "click", change_pers_link_1); 	//чек-бокс
    addEvent($("set_pers_link_2"), "click", change_pers_link_2); 	//чек-бокс
    addEvent($("set_clan_log"), "click", change_clan_log); 	//чек-бокс
    addEvent($("set_store_log"), "click", change_store_log); 	//чек-бокс
    addEvent($("set_clan_contr"), "click", change_clan_contr); 	//чек-бокс
    addEvent($("set_clan_memb"), "click", change_clan_memb); 	//чек-бокс
    addEvent($("set_clan_inv"), "click", change_clan_inv); 	//чек-бокс
    addEvent($("set_clan_acc"), "click", change_clan_acc); 	//чек-бокс
    addEvent($("set_glory_points"), "click", change_glory_points); 	//чек-бокс
    addEvent($("set_mil_policy"), "click", change_mil_policy); 	//чек-бокс
    addEvent($("set_cast_main"), "click", change_cast_main); 	//чек-бокс
    addEvent($("set_cast_add_1"), "click", change_cast_add_1); 	//чек-бокс
    addEvent($("set_cast_add_2"), "click", change_cast_add_2); 	//чек-бокс
    addEvent($("set_stat_store"), "click", change_stat_store); 	//чек-бокс
    addEvent($("set_stat_treas"), "click", change_stat_treas); 	//чек-бокс
    addEvent($("set_link_plink_1_ok"), "click", change_link_plink_1); //изменение лич. ссылки 1
    addEvent($("set_link_plink_2_ok"), "click", change_link_plink_2); //изменение лич. ссылки 2
    addEvent($("open_transfer_id"), "click", open_transfer);	  //шутка

    bg.style.top = '0px';
    bg.style.height = bg_height + 'px';
    bgc.style.top = ( window.pageYOffset + 10 ) + 'px'; 		//сдвиг окна по высоте
    bg.style.display = '';
    bgc.style.display = '';
    }
}

//======== Обработка чек-боксов ===========
function change_clan_icon()	{GM_setValue("hwm_clan_icon", clan_icon = !clan_icon);}
function change_server_mode() 	{
    add_server_IP = !add_server_IP;
    document.getElementById('set_add_server_IP').checked = add_server_IP;
    document.getElementById('set_add_server_alt').checked = !add_server_IP;
    GM_setValue("hwm_server_IP", add_server_IP);
}
function change_clan_site()	{GM_setValue("hwm_clan_site", clan_site = !clan_site);}
function change_clan_store()	{GM_setValue("hwm_clan_store", clan_store = !clan_store);}
function change_clan_def()	{GM_setValue("hwm_clan_def", clan_def = !clan_def);}
function change_web_irc()	{GM_setValue("hwm_web_irc", web_irc = !web_irc);}
function change_clan_irc()	{GM_setValue("hwm_clan_irc", clan_irc = !clan_irc);}
function change_stat_auction()	{GM_setValue("hwm_stat_auction", stat_auction = !stat_auction);}
function change_stat_buy()	{GM_setValue("hwm_stat_buy", stat_buy = !stat_buy);}
function change_stat_def()	{GM_setValue("hwm_stat_def", stat_def = !stat_def);}
function change_stat_elem()	{GM_setValue("hwm_stat_elem", stat_elem = !stat_elem);}
function change_stat_battle()	{GM_setValue("hwm_stat_battle", stat_battle = !stat_battle);}
function change_stat_lgnd()	{GM_setValue("hwm_stat_lgnd", stat_lgnd = !stat_lgnd);}
function change_pers_link_1()	{GM_setValue("hwm_pers_link_1", pers_link_1 = !pers_link_1);}
function change_pers_link_2()	{GM_setValue("hwm_pers_link_2", pers_link_2 = !pers_link_2);}
function change_clan_log()	{GM_setValue("hwm_clan_log", clan_log = !clan_log);}
function change_store_log()	{GM_setValue("hwm_store_log", store_log = !store_log);}
function change_clan_contr()	{GM_setValue("hwm_clan_contr", clan_contr = !clan_contr);}
function change_clan_memb()	{GM_setValue("hwm_clan_memb", clan_memb = !clan_memb);}
function change_clan_inv()	{GM_setValue("hwm_clan_inv", clan_inv = !clan_inv);}
function change_clan_acc()	{GM_setValue("hwm_clan_acc", clan_acc = !clan_acc);}
function change_glory_points()	{GM_setValue("hwm_glory_points", glory_points = !glory_points);}
function change_mil_policy()	{GM_setValue("hwm_mil_policy", mil_policy = !mil_policy);}
function change_cast_main()	{GM_setValue("hwm_cast_main", cast_main = !cast_main);}
function change_cast_add_1()	{GM_setValue("hwm_cast_add_1", cast_add_1 = !cast_add_1);}
function change_cast_add_2()	{GM_setValue("hwm_cast_add_2", cast_add_2 = !cast_add_2);}
function change_stat_store()	{GM_setValue("hwm_stat_store", stat_store = !stat_store);}
function change_stat_treas()	{GM_setValue("hwm_stat_treas", stat_treas = !stat_treas);}

//====== Обработка полей ввода ============
function change_clan_name() {		// Название клана
    clan_name = ustring($ustring($("set_clan_name").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#:*-_=+)]/g, "")); //удаление лишних символов
    clan_name = clan_name.replace(/ {1,}/g," "); //удаление двойных пробелов
    document.getElementById('set_clan_name').value = clan_name;
    if (clan_name.length == 0) {
        alert(str_no_clan_name);
        return; 
    }
    GM_setValue("new_clan_name", clan_name);
}

function change_clan_id() {		// ID клана
    clan_id = ustring($ustring($("set_clan_id").value).replace(/[^ 0-9]/g, "")); //удаление лишних символов
    clan_id = clan_id.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_clan_id').value = clan_id;
    if (clan_id.length == 0) {
        alert(str_no_clan_id);
        return; 
    } else if ( Number( $("set_clan_id").value ) < 10 || !ScanClanID(Number( $("set_clan_id").value ))) {
        alert(str_null_clan_id); // автоопределение реальности ID клана
        clan_id = "";
        document.getElementById('set_clan_id').value = clan_id;
        return;
    } else if ( Number( $("set_clan_id").value ) >= 10 && ScanClanID(Number( $("set_clan_id").value ))) {
        clan_id = Number($("set_clan_id").value).toFixed(0);
    } else clan_id = 5349;
    GM_setValue("new_clan_id", clan_id);
}

function change_sklad_id() {		// ID клан-склада
    sklad_id = ustring($ustring($("set_sklad_id").value).replace(/[^ 0-9]/g, "")); //удаление лишних символов
    sklad_id = sklad_id.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_sklad_id').value = sklad_id;
    if (sklad_id.length == 0) {
        sklad_id == "";
        GM_setValue("new_sklad_id", sklad_id);
        GM_setValue("hwm_clan_store", false);
        GM_setValue("hwm_store_log", false);
        return;
    } else if ( Number( $("set_sklad_id").value ) < 1 || !ScanSkladID(Number( $("set_sklad_id").value ))) {
        alert(str_null_sklad_id); // автоопределение реальности ID склада
        sklad_id = "";
        document.getElementById('set_sklad_id').value = sklad_id;
        return;
    } else if ( Number( $("set_sklad_id").value ) >= 1 && ScanSkladID(Number( $("set_sklad_id").value ))) {
        sklad_id = Number($("set_sklad_id").value).toFixed(0);
    } else sklad_id = 69;
    GM_setValue("new_sklad_id", sklad_id);
    GM_setValue("hwm_clan_store", true);
}

function change_akdm1_name() {	// Название академии 1
    akdm1_name = ustring($ustring($("set_akdm1_name").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#:*-_=+)]/g, "")); //удаление лишних символов
    akdm1_name = akdm1_name.replace(/ {1,}/g," "); //удаление двойных пробелов
    document.getElementById('set_akdm1_name').value = akdm1_name;
    if (akdm1_name.length == 0) {
        GM_setValue("new_akdm1_name", "академии 1");
        GM_setValue("hwm_cast_add_1", false);
        akdm1_id = "";
        return; 
    }
    GM_setValue("new_akdm1_name", akdm1_name);
}

function change_akdm2_name() {	// Название академии 2
    akdm2_name = ustring($ustring($("set_akdm2_name").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#:*-_=+)]/g, "")); //удаление лишних символов
    akdm2_name = akdm2_name.replace(/ {1,}/g," "); //удаление двойных пробелов
    document.getElementById('set_akdm2_name').value = akdm2_name;
    if (akdm2_name.length == 0) {
        GM_setValue("new_akdm2_name", "академии 2");
        GM_setValue("hwm_cast_add_2", false);
        akdm2_id = "";
        return; 
    }
    GM_setValue("new_akdm2_name", akdm2_name);
}

function change_akdm1_id() {		// ID академии 1
    akdm1_id = ustring($ustring($("set_akdm1_id").value).replace(/[^ 0-9]/g, "")); //удаление лишних символов
    akdm1_id = akdm1_id.replace(/ {1,}/g,"");   //удаление множественных пробелов
    document.getElementById('set_akdm1_id').value = akdm1_id;
    if ( akdm1_id.length == 0 ) {
        GM_setValue("new_akdm1_name", "академии 1");
        document.getElementById('set_akdm1_name').value = "академии 1";
        GM_setValue("new_akdm1_id", "");
        document.getElementById('set_akdm1_id').value = akdm1_id;
        return;
    } else if ( Number( $("set_akdm1_id").value ) < 10 || !ScanClanID(Number( $("set_akdm1_id").value ))) {
        alert(str_null_clan_id);
        akdm1_id = "";
        document.getElementById('set_akdm1_id').value = akdm1_id;
        return;
    } else if ( Number( $("set_akdm1_id").value ) >= 10 && ScanClanID(Number( $("set_akdm1_id").value ))) {
        akdm1_id = Number($("set_akdm1_id").value).toFixed(0);
    }
    GM_setValue("new_akdm1_id", akdm1_id);
    GM_setValue("hwm_cast_add_1", true);
}

function change_akdm2_id() {		// ID академии 2
    akdm2_id = ustring($ustring($("set_akdm2_id").value).replace(/[^ 0-9]/g, "")); //удаление лишних символов
    akdm2_id = akdm2_id.replace(/ {1,}/g,"");   //удаление множественных пробелов
    document.getElementById('set_akdm2_id').value = akdm2_id;
    if ( akdm2_id.length == 0 ) {
        GM_setValue("new_akdm2_name", "академии 2");
        document.getElementById('set_akdm2_name').value = "академии 2";
        GM_setValue("new_akdm2_id", "");
        document.getElementById('set_akdm2_id').value = akdm2_id;
        return;
    } else if ( Number( $("set_akdm2_id").value ) < 10 || !ScanClanID(Number( $("set_akdm2_id").value ))) {
        alert(str_null_clan_id);
        akdm2_id = "";
        document.getElementById('set_akdm2_id').value = akdm2_id;
        return;
    } else if ( Number( $("set_akdm2_id").value ) >= 10 && ScanClanID(Number( $("set_akdm2_id").value ))) {
        akdm2_id = Number($("set_akdm2_id").value).toFixed(0);
    }
    GM_setValue("new_akdm2_id", akdm2_id);
    GM_setValue("hwm_cast_add_2", true);
}

function change_site_link() {		// Адрес клан-сайта
    site_link = ustring($ustring($("set_site_link").value).replace(/[^ 0-9A-Za-z:\-/.]/g, "")); //удаление лишних символов
    site_link = site_link.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_site_link').value = site_link;
    if (site_link.indexOf('restore', 0) == 0) {
        document.getElementById('set_site_link').value = hard_site_link;
        return;
    } else if (site_link.length == 0) {
        site_link == "";
        GM_setValue("new_site_link", site_link);
        GM_setValue("hwm_clan_site", false);
        return;
    } else if (site_link.indexOf('http://', 0) != 0) {
        alert("Нужен реальный адрес сайта! \r\n\r\n ' http:// ' вписать не забыли?");
        return;
    } else if (site_link.length <= 7) {
        alert("Нужен реальный адрес сайта!");
        site_link == "";
        GM_setValue("new_site_link", site_link);
        GM_setValue("hwm_clan_site", false);
        document.getElementById('set_site_link').value = site_link;
        return;
    }
    GM_setValue("new_site_link", site_link);
    GM_setValue("hwm_clan_site", true);
}

function change_clan_chat() {		// Клан-чат на сайте
    clan_chat = ustring($ustring($("set_clan_chat").value).replace(/[^ 0-9A-Za-z:\-/.]/g, "")); //удаление лишних символов
    clan_chat = clan_chat.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_clan_chat').value = clan_chat;
    if (clan_chat.indexOf('restore', 0) == 0) {
        document.getElementById('set_clan_chat').value = hard_clan_chat;
        return;
    } else if (clan_chat.length == 0) {
        clan_chat == "";
        GM_setValue("new_clan_chat", clan_chat);
        GM_setValue("hwm_clan_irc", false);
        return;
    }
    GM_setValue("new_clan_chat", clan_chat);
    GM_setValue("hwm_clan_irc", true);
}

function change_main_server() {		// Адрес сервера ДМ
    main_server = ustring($ustring($("set_main_server").value).replace(/[^ 0-9A-Za-z:/.]/g, "")); //удаление лишних символов
    main_server = main_server.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_main_server').value = main_server;
    if (main_server.indexOf('http://', 0) != 0) {
        alert("Нужен реальный адрес сервера! \r\n\r\n ' http:// ' вписать не забыли?");
        document.getElementById('set_main_server').value = hard_main_server;
        return;
    } else if (main_server.length == 0) {
        GM_setValue("new_main_server", hard_main_server);
        document.getElementById('set_main_server').value = hard_main_server;
        return;
    }  else if (main_server.length < 14) {
        alert("Нужен реальный адрес сервера!");
        document.getElementById('set_main_server').value = hard_main_server;
        return;
    }
    GM_setValue("new_main_server", main_server);
}

function change_alt_server() {		// Адрес альт. сервера
    alt_server = ustring($ustring($("set_alt_server").value).replace(/[^ 0-9A-Za-z:\-/.]/g, "")); //удаление лишних символов
    alt_server = alt_server.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_alt_server').value = alt_server;
    if (alt_server.length == 0) {
        GM_setValue("new_alt_server", hard_alt_server);
        document.getElementById('set_alt_server').value = hard_alt_server;
        return;
    } else if (alt_server.indexOf('http://', 0) != 0) {
        if (alt_server.indexOf('https://', 0) != 0) {
            alert("Нужен реальный адрес сервера! \r\n\r\n ' http:// ' вписать не забыли?");
            document.getElementById('set_alt_server').value = hard_alt_server;
            return;
        }
    } else if (alt_server.length < 14) {
        alert("Нужен реальный адрес сервера!");
        document.getElementById('set_alt_server').value = hard_alt_server;
        return;
    }
    GM_setValue("new_alt_server", alt_server);
}

function change_def_servise() {		// Cервис координации
    def_servise = ustring($ustring($("set_def_servise").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#%:&*\-/_+=?.)]/g, "")); //удаление лишних символов
    def_servise = def_servise.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_def_servise').value = def_servise;
    if (def_servise.indexOf('restore', 0) == 0) {
        document.getElementById('set_def_servise').value = hard_def_servise;
        return;
    } else if (def_servise.length == 0) {
        def_servise = "";
        GM_setValue("hwm_clan_def", false);
        return;
    }
    GM_setValue("new_def_servise", def_servise);
}

function change_link_plink_1() {		// Изменение Личной ссылки #1
    name_plink_1 = ustring($ustring($("set_name_plink_1").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#:*\-_=+)]/g, ""));
    name_plink_1 = name_plink_1.replace(/ {1,}/g," "); //удаление множественных пробелов
    document.getElementById('set_name_plink_1').value = name_plink_1;
    if (name_plink_1.length == 0) {
        GM_setValue("set_name_plink_1", hard_name_plink_1);
        document.getElementById('set_name_plink_1').value = hard_name_plink_1
        GM_setValue("new_name_plink_1", hard_name_plink_1);
        link_plink_1 = "";
        GM_setValue("set_link_plink_1", link_plink_1);
        document.getElementById('set_link_plink_1').value = link_plink_1;
        GM_setValue("hwm_pers_link_1", false);
        return;
    }

    link_plink_1 = ustring($ustring($("set_link_plink_1").value).replace(/[^ 0-9A-Za-z:\-_/.]/g, "")); //удаление лишних символов
    link_plink_1 = link_plink_1.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_link_plink_1').value = link_plink_1;
    if (link_plink_1.length == 0) {
        link_plink_1 = "";
        GM_setValue("new_link_plink_1", link_plink_1);
        document.getElementById('set_link_plink_1').value = link_plink_1;
        document.getElementById('set_name_plink_1').value = hard_name_plink_1;
        GM_setValue("hwm_pers_link_1", false);
        return;
    } else if (link_plink_1.indexOf('http://', 0) != 0) {
        alert("Нужен реальный адрес сайта! \r\n\r\n ' http:// ' вписать не забыли?");
        return;
    } else if (link_plink_1.length <= 7) {
        alert("Нужен реальный адрес сайта!");
        link_plink_1 = "";
        GM_setValue("new_link_plink_1", link_plink_1);
        document.getElementById('set_link_plink_1').value = link_plink_1;
        GM_setValue("hwm_pers_link_1", false);
        return;
    }
    GM_setValue("new_name_plink_1", name_plink_1);
    GM_setValue("new_link_plink_1", link_plink_1);
    GM_setValue("hwm_pers_link_1", true);
}

function change_link_plink_2() {		// Изменение Личной ссылки #2
    name_plink_2 = ustring($ustring($("set_name_plink_2").value).replace(/[^ 0-9A-Za-zА-Яа-яЁё(@#:*\-_=+)]/g, ""));
    name_plink_2 = name_plink_2.replace(/ {1,}/g," "); //удаление множественных пробелов
    document.getElementById('set_name_plink_2').value = name_plink_2;
    if (name_plink_2.length == 0) {
        GM_setValue("set_name_plink_2", hard_name_plink_2);
        document.getElementById('set_name_plink_2').value = hard_name_plink_2
        GM_setValue("new_name_plink_2", hard_name_plink_2);
        link_plink_2 = "";
        GM_setValue("set_link_plink_2", link_plink_2);
        document.getElementById('set_link_plink_2').value = link_plink_2;
        GM_setValue("hwm_pers_link_2", false);
        return;
    }

    link_plink_2 = ustring($ustring($("set_link_plink_2").value).replace(/[^ 0-9A-Za-z:\-_/.]/g, "")); //удаление лишних символов
    link_plink_2 = link_plink_2.replace(/ {1,}/g,""); //удаление множественных пробелов
    document.getElementById('set_link_plink_2').value = link_plink_2;
    if (link_plink_2.length == 0) {
        link_plink_2 = "";
        GM_setValue("new_link_plink_2", link_plink_2);
        document.getElementById('set_link_plink_2').value = link_plink_2;
        document.getElementById('set_name_plink_2').value = hard_name_plink_2;
        GM_setValue("hwm_pers_link_2", false);
        return;
    } else if (link_plink_2.indexOf('http://', 0) != 0) {
        alert("Нужен реальный адрес сайта! \r\n\r\n ' http:// ' вписать не забыли?");
        return;
    } else if (link_plink_2.length <= 7) {
        alert("Нужен реальный адрес сайта!");
        link_plink_2 = "";
        GM_setValue("new_link_plink_2", link_plink_2);
        document.getElementById('set_link_plink_2').value = link_plink_2;
        GM_setValue("hwm_pers_link_2", false);
        return;
    }
    GM_setValue("new_name_plink_2", name_plink_2);
    GM_setValue("new_link_plink_2", link_plink_2);
    GM_setValue("hwm_pers_link_2", true);
}

    //========= Другие функции ==============
    function addEvent(elem, evType, fn) {
        if (elem.addEventListener) elem.addEventListener(evType, fn, false);
        else if (elem.attachEvent) elem.attachEvent("on" + evType, fn);
        else elem["on" + evType] = fn;
    }

    function $(id) { return document.querySelector("#"+id); }

    function open_transfer() {
        if (location.href.match('lordswm')) {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=Transferred 10000 Gold 5 Diamonds";
        } else {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=%CF%E5%F0%E5%E4%E0%ED%EE%2010000%20%C7%EE%EB%EE%F2%EE%205%20%C1%F0%E8%EB%EB%E8%E0%ED%F2%FB";
        }
    }

    function ClientWidth()	{
        return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
    }

    function ScrollHeight() {
        return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    }

    //====== Автоопределение реальности ID клана =======
    function ScanClanID(clan_id) {
        /* var cid = new getXmlHttp();
        cid.open('GET', 'http://'+location.hostname+'/clan_info.php?id='+ clan_id, false);
        cid.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        cid.send();
        if (cid.responseText.indexOf('clan_info.php?id='+ clan_id) > -1) return true;
        else return false; */
        return true;
    }

    //====== Автоопределение реальности ID склада ======
    function ScanSkladID(sklad_id) {
        var sid = new getXmlHttp();
        sid.open('GET', 'http://'+location.hostname+'/sklad_info.php?id='+ sklad_id, false);
        sid.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        sid.send();
        if (sid.responseText.indexOf('sklad_log.php?id='+ sklad_id) > -1) return true;
        else return false;
    }

    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }

    //========== Получение ID персонажа ================
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    //=========== Сканирование кланов ==================
    function clan_forStat() {
        if (clan_id == 15 || clan_id == 276 || clan_id == 302 || clan_id == 433 || clan_id == 782 || clan_id == 783 || clan_id == 933 || clan_id == 1271 || clan_id == 1597 || clan_id == 2336 || clan_id == 2517 || clan_id == 2870 || clan_id == 3975 || clan_id == 4370 || clan_id == 6259 || clan_id == 6815) {
            stat = 1;
        } else stat = 0;
    }

//========= Замена рулетки и вывод меню ============
function RouletteReplace() {
var h = document.getElementsByTagName('a');
    for(var i = 0; i < h.length; i++) {
        if(h[i].href.indexOf("roulette.php") > -1) {
            var menu = "<nobr><style='text-decoration: none; color: #FFD875;'>"; 
            if(clan_icon) { menu += "<img width='17' height='14' border='0' align='right' alt='#"+clan_id+"' src='i_clans/l_"+clan_id+".gif?v="+icon_num+"'></img>"; }
                menu += "<font style='bold; color: #FFD875;'><b>"+clan_name+"</b></font> </nobr> <ul>";
            if(clan_site) { menu += "<li><a href="+site_link+" target=_blank>Офф.сайт клана</a></li>"; }
                menu += "<li><a href='clan_info.php?id="+clan_id+"' target=_blank>Клан Инфо</a></li>";
            if(clan_log) { menu += "<li><a href='clan_log.php?id="+clan_id+"' target=_blank>&nbsp;&#187; Протокол клана</a></li>"; }
            if(clan_store) { menu += "<li><a href='sklad_info.php?id="+sklad_id+"&cat=0' target=_blank>Клановый склад</a></li>"; }
            if(store_log) { menu += "<li><a href='sklad_log.php?id="+sklad_id+"' target=_blank>&nbsp;&#187; Протокол склада</a></li>"; }
            if(clan_def && add_server_IP) { menu += "<hr/> <li><a href="+main_server+def_servise+" title='"+str_clan_def_title+clan_name+"' target=_blank>Сервис записи на Защиту</a></li>"; } else if(clan_def && !add_server_IP) { menu += "<hr/> <li><a href="+alt_server+def_servise+" title='"+str_clan_def_title+clan_name+"' target=_blank>Сервис записи на Защиту</a></li>"; }
            if(web_irc && (clan_id == 5349 || clan_id == 41)) { menu += "<li><a href="+web_gate+" title='"+str_web_irc_title+"' target=_blank>&#8217;Лёгкая&#8217; мирка (WebGate)</a></li>"; }
            if(clan_irc) { menu += "<li><a href="+site_link+clan_chat+" title='"+str_clan_irc_title+"' target=_blank>Клан-чат на сайте клана</a></li>"; }
            if(clan_contr) { menu += "<hr/> <li><a href='clan_control.php?id="+clan_id+"' title='"+str_clan_contr_title+"' target=_blank>Управление Кланом</a></li>"; }
            if(clan_memb) { menu += "<li><a href='clan_members.php?id="+clan_id+"' title='"+str_clan_memb_title+"' target=_blank>Управление Составом</a></li>"; }
            if(clan_inv) { menu += "<li><a href='clan_invites.php?id="+clan_id+"' title='"+str_clan_inv_title+"' target=_blank>Приглашение в Клан</a></li>"; }
            if(clan_acc) { menu += "<li><a href='clan_balance.php?id="+clan_id+"' title='"+str_clan_acc_title+"' target=_blank>Управление Казной клана</a></li>"; }
            if(glory_points) { menu += "<li><a href='clan_glory.php?id="+clan_id+"' title='"+str_glory_points_title+"' target=_blank>Управление Очками БС</a></li>"; }
            if(mil_policy) { menu += "<li><a href='clan_bplan.php?id="+clan_id+"' title='"+str_mil_policy_title+"' target=_blank>Военная политика клана</a></li>"; }
            if(cast_main) { menu += "<li><a href='clan_broadcast.php?id="+clan_id+"' title='"+str_cast_all_title+"' target=_blank>Рассылка по "+clan_name+"</a></li>"; }
            if(cast_add_1 && akdm1_id != "") { menu += "<li><a href='clan_broadcast.php?id="+akdm1_id+"' title='"+str_cast_all_title+"' target=_blank>&nbsp;&#187; Рассылка по "+akdm1_name+"</a></li>"; } else { GM_setValue("hwm_cast_add_1", false); }
            if(cast_add_2 && akdm2_id != "") { menu += "<li><a href='clan_broadcast.php?id="+akdm2_id+"' title='"+str_cast_all_title+"' target=_blank>&nbsp;&#187; Рассылка по "+akdm2_name+"</a></li>"; } else { GM_setValue("hwm_cast_add_2", false); }
            if(stat_auction) { menu += "<hr/> <li><a href="+main_server+mark_stat+" title='"+str_stat_auction_title+"' target=_blank>Статистика рынка (квоты)</a></li>"; }
            if(stat_buy) { menu += "<li><a href="+main_server+pers_stat + getCookie('pl_id')+" title='"+str_stat_buy_title+"' target=_blank>Статистика моих покупок</a></li>"; }
            if(stat_store) { menu += "<hr/> <li><a href="+kks_stat+kks_st_sklad+" title='"+str_stat_store_title+"' target=_blank>Статистика по Складу</a></li>"; }
            if(stat_treas) { menu += "<li><a href="+kks_stat+kks_st_finance+" title='"+str_stat_treas_title+"' target=_blank>Статистика по Финансам</a></li>"; }
            if(stat_def) { menu += "<hr/> <li><a href="+kks_stat+kks_st_defers+" title='"+str_stat_def_title+"' target=_blank>Статистика по Защитам</a></li>"; }
            if(stat_elem) { menu += "<li><a href="+kks_stat+kks_st_element+" title='"+str_stat_elem_title+"' target=_blank>Статистика по Элементам</a></li>"; }
            if(stat_battle) { menu += "<li><a href="+kks_stat+kks_st_bat_char+" title='"+str_stat_battle_title+"' target=_blank>Статистика по Боев.показ.</a></li>"; }
            if(stat_lgnd) { menu += "<hr/> <li><a href="+lgnd_stat + getCookie('pl_id')+" title='"+str_stat_lgnd_title+"' target=_blank>Статистика на <b>legend.ru</b></a></li>"; }
            if(pers_link_1 && link_plink_1 != "") { menu += "<hr/> <li><a href="+link_plink_1+" target=_blank>"+name_plink_1+"</a></li>"; } else { GM_setValue("hwm_pers_link_1", false); } 
            if(pers_link_2 && link_plink_2 != "") { menu += "<li><a href="+link_plink_2+" target=_blank>"+name_plink_2+"</a></li>"; } else { GM_setValue("hwm_pers_link_2", false); } 
            menu += "</ul>";

            h[i].parentNode.parentNode.innerHTML = menu;
            i=h.length;
        }
    }
}

//==================================================
Open_Settings();

RouletteReplace();

})();