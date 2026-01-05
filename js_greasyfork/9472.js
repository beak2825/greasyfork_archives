// ==UserScript==
// @name 		HWM Map Move
// @version 	2.2.5
// @description 	HWM Mod - Перемещение по карте в один клик
// @author 	xo4yxa
// @namespace	fix Mefistophel_Gr
// @homepage 	https://greasyfork.org/ru/scripts/9472-hwm-map-move
// @include 	http://*heroeswm.ru/map.php*
// @include 	http://178.248.235.15/map.php*
// @include 	http://*lordswm.com/map.php*
// @grant 		GM_getValue
// @grant 		GM_setValue
// @grant 		GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/9472/HWM%20Map%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/9472/HWM%20Map%20Move.meta.js
// ==/UserScript==

// (c) 2008-2013, xo4yxa (http://www.heroeswm.ru/pl_info.php?id=130) 		- оригинальный скрипт
// 2014-2015, Mefistophel_Gr (http://www.heroeswm.ru/pl_info.php?id=2287844) 	- последняя модификация

(function() {

    var ver = '2.2.5'

    if (typeof GM_deleteValue != 'function') {
        this.GM_getValue=function (key,def) {return localStorage[key] || def;};
        this.GM_setValue=function (key,value) {return localStorage[key]=value;};
        this.GM_deleteValue=function (key) {return delete localStorage[key];};
    }

    var url = 'http://'+location.hostname;
    var url_cur = location.href;
    var url_ref = document.referrer;
    var url_upd = 'https://greasyfork.org/ru/scripts/9472-hwm-map-move';
    var str_send_sms = '/sms-create.php?mailto=Mefistophel_Gr&subject=Скрипт: HWM Map Move. Версия: '+ ver;

    // установка языковых параметров
    if( GM_getValue( "checklng" ) && GM_getValue( "checklng" ) == 1 ) {
        var check_lng_v = 1;    //русский
        var lng_main = 2 + 3;
        var lng_add = 1 + 3;
        var lng_set =   'Настройки';
        var lng_RG =    'Гильдия Рейнджеров';
        var lng_HG =    'Гильдия Охотников';
        var lng_MG =    'Гильдия Наёмников';
        var lng_TG =    'Гильдия Воров';
        var lng_skip =  'Пропустить охоту';
        var lng_dest =  'Пункт назначения';
        var lng_view =  'Осмотреть сектор: ';
        var lng_close =         'Закрыть';
        var lng_main_set =      'Основные Настройки';
        var lng_set_map =       ' Не отображать Flash-карту';
        var lng_set_view =      ' Отображать кнопки осмотра секторов';
        var lng_set_lang =      ' Установить - русский - основным языком в скрипте';
        var lng_set_return =    ' Сдавать задания Гильдии Наёмников с дороги';
        var lng_set_autoIn =    ' Автоматически вступать в бои Гильдии Рейнджеров';
        var lng_set_enterRG =   ' Заходить в Гильдию Рейнджеров';
        var lng_set_carriage =  'Ваш транспорт';
        var lng_set_shop =      'транспорт в магазине';
        var str_update =        'Проверить обновление';
        var str_error =         'Обратная связь';
    } else {
        var check_lng_v = 0 ;   //английский
        var lng_main = 1 + 3;
        var lng_add = 2 + 3;
        var lng_set =   'Settings';
        var lng_RG =    'Rangers\' Guild';
        var lng_HG =    'Hunters\' Guild';
        var lng_MG =    'Mercenaries\' Guild';
        var lng_TG =    'Thieves\' Guild';
        var lng_skip =  'Skip Hunting';
        var lng_dest =  'Destination';
        var lng_view =  'Inspect sector: ';
        var lng_close =         'Close';
        var lng_main_set =      'Main Settings';
        var lng_set_map =       ' Do not Display Flash-map';
        var lng_set_view =      ' Show the buttons for view sectors';
        var lng_set_lang =      ' Set the Main language - Russian';
        var lng_set_return =    ' Hand over the tasks of Mercenaries\' Guild after traveling';
        var lng_set_autoIn =    ' Automatically engage of the Rangers\' Guild';
        var lng_set_enterRG =   ' Заходить в Гильдию Рейнджеров';
        var lng_set_carriage =  'Your carriage';
        var lng_set_shop =      'carriage from the Shop';
        var str_update =        'Check update';
        var str_error =         'Feedback';
    }

    var coop = '<center style="font-size:10px;">&#169; <a href="'+ url +'/pl_info.php?id=130" target=_blank style="font-size:10px;">xo4yxa</a> 2011-13   |   <a href="'+ url +'/pl_info.php?id=2287844" target=_blank style="font-size:10px;">Mefistophel_Gr</a> 2014-15   |    <a href="https://greasyfork.org/ru/scripts/9472-hwm-map-move" target=_blank style="font-size:10px;">HWM Map Move</a> v.' + ver + '   |    <span style="text-decoration:underline;cursor:pointer;font-weight:bold;" id="hwmmm_options">'+ lng_set +'</span> <br><br> </center>';

    var els = document.querySelector("object > param[value*='map.swf']");
    if ( els ) { els = els.parentNode.querySelector("param[name='FlashVars']"); }
    if ( els ) {
        var pl =  els.value.split('=')[1].split(':');
        //if (pl[0].indexOf('*') != -1) { pl[0] = pl[0].split('*')[1]; }
        if (pl[0].indexOf('*') != -1) { var tt = pl[0].split('*'); pl[0] = tt[tt.length-1]; }
        //alert(els.getAttribute('value'));
    } else { return; }

    var road = new Array() ;
    var transp = GM_getValue( "transport", 3 ) ;

    // Время перемещения: Без транспорта, Слон, Буйвол, Конь, Единорог, Дракон, транспорт с Абу-Бекром
    var trtime = new Array ( 120, 84, 60, 36, 24, 12, 12 ) ; 	// по прямой
    var trtimed = new Array ( 169, 118, 84, 50, 33, 16, 16 ) ; 	// по диагонали
    var plgn = [ 2 , 6 , 16 , 21 ] ; 			// сектора с ГН

    var b = document.getElementsByTagName( 'body' ) ;

    // вступать в бой ГРж
    if( pl[14] == 0 && b[0].innerHTML.indexOf( 'ranger_attack.php' ) > 0 && ( GM_getValue( "checkgv" , 0 ) == 1 ) )
        window.location.href = url +'/ranger_attack.php' ;

    //если в столице и ГРж нонстоп
    /*
    if( pl[14] == 0 && pl[0] == 1 && ( GM_getValue( "checkgvn" , 0 ) == 1 ) && url_ref == url +'/map.php' )
        window.location.href = url + '/ranger_guild.php' ;
    */

    // если было задание ГН и пришли в сектор где есть ГН
    if( pl[14] == 0 && pl[13] == -1 && in_array( pl[0] , plgn ) && GM_getValue( "checkgn" , 0 ) == 1 )
        window.location.href = url +'/mercenary_guild.php' ;


    /* карта локаций
     -- x
    |
    y
      47   48   49   50   51   52   53   54
      --   --   --   --   --   --   --   --   --   --
    | 00 | 23 | 09 | 06 | 24 | 16 | 00 | 00 | 48 	//Непокор. степь, Орл. Гнездо, Мирн. Лагерь, Крист. Сад, Маг. Лес
      --   --   --   --   --   --   --   --   --   -- 
    | 00 | 13 | 12 | 03 | 04 | 15 | 18 | 00 | 49 	//Солн. Город, Сияющ. Родн., Тигр. Озеро, Лес Разбойн., Медв. Гора, Мифр. Берег
      --   --   --   --   --   --   --   --   --   --
    | 00 | 27 | 08 | 01 | 02 | 14 | 17 | 00 | 50 	//Великое Древо, Зел. Лес, Стол. Империи, Вост. Река, Магма Шахты, Порт. Город
      --   --   --   --   --   --   --   --   --   --
    | 00 | 00 | 07 | 05 | 11 | 00 | 00 | 00 | 51 	//Равнина Ящеров, Долина Волков, Пещеры Драконов
      --   --   --   --   --   --   --   --   --   --
    | 00 | 00 | 26 | 10 | 19 | 00 | 25 | 00 | 52 	//Дикие земли, Руины Портала, Великая Стена,   море  , Вост. Остров
      --   --   --   --   --   --   --   --   --   --
    | 00 | 00 | 00 | 00 | 20 | 21 | 00 | 00 | 53 	//Равнина Титанов, Рыбачье село
      --   --   --   --   --   --   --   --   --   --
    | 00 | 00 | 00 | 00 | 00 | 22 | 00 | 00 | 54 	//Замок Королевства
      --   --   --   --   --   --   --   --   --   --
    */

    // отрисовка карты
    var dm = document.createElement( 'div' );
    dm.innerHTML = '<br><center> <a href="'+ url +'/ranger_guild.php"> <img src="'+ url +'/i/houses/ranger.gif" border="0" title="'+ lng_RG +'"></a> <a href="'+ url +'/hunter_guild.php"> <img src="'+ url +'/i/houses/hunter.gif" border="0" title="'+ lng_HG +'"></a> <a href="'+ url +'/mercenary_guild.php"> <img src="'+ url +'/i/houses/merc.gif" border="0" title="'+ lng_MG +'"></a> <a href="'+ url +'/thief_guild.php"> <img src="'+ url +'/i/houses/thief.gif" border="0" title="'+ lng_TG +'"></a> &nbsp;&nbsp; <a href="'+ url +'/map.php?action=skip"> <img src="http://i.imgur.com/rDyCmwf.png" border="0" title="'+ lng_skip +'"></a></center> <table>' +
    '<tr>' +
    '<td><div id="loc_23"></div></td>' +
    '<td><div id="loc_9"></div></td>' +
    '<td><div id="loc_6"></div></td>' +
    '<td><div id="loc_24"></div></td>' +
    '<td><div id="loc_16"></div></td>' +
    '<td></td>' +
    '</tr>' +
    '<tr>' +
    '<td><div id="loc_13"></div></td>' +
    '<td><div id="loc_12"></div></td>' +
    '<td><div id="loc_3"></div></td>' +
    '<td><div id="loc_4"></div></td>' +
    '<td><div id="loc_15"></div></td>' +
    '<td><div id="loc_18"></div></td>' +
    '</tr>' +
    '<tr>' +
    '<td><div id="loc_27"></div></td>' +
    '<td><div id="loc_8"></div></td>' +
    '<td><div id="loc_1"></div></td>' +
    '<td><div id="loc_2"></div></td>' +
    '<td><div id="loc_14"></div></td>' +
    '<td><div id="loc_17"></div></td>' +
    '</tr>' +
    '<tr>' +
    '<td></td>' +
    '<td><div id="loc_7"></div></td>' +
    '<td><div id="loc_5"></div></td>' +
    '<td><div id="loc_11"></div></td>' +
    '<td></td>' +
    '<td></td>' +
    '</tr>' +
    '<tr>' +
    '<td><div id="loc_25"></div></td>' +
    '<td><div id="loc_26"></div></td>' +
    '<td><div id="loc_10"></div></td>' +
    '<td><div id="loc_19"></div></td>' +
    '<td></td>' +
    '<td></td>' +
    '</tr>' +
    '<tr>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td><div id="loc_20"></div></td>' +
    '<td><div id="loc_21"></div></td>' +
    '<td></td>' +
    '</tr>' +
    '<tr>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td><div id="loc_22"></div></td>' +
    '<td></td>' +
    '</tr>' +
    '</table><br>' +
    coop + '<br>' ;

    // cX_Y  координаты по карте
    var locX =
    {
        c50_50:	1,	//Empire Capital
        c51_50:	2,	//East River
        c50_49:	3,	//Tiger's Lake
        c51_49:	4,	//Rogue's Wood
        c50_51:	5,	//Wolf's Dale
        c50_48:	6,	//Peaceful Camp
        c49_51:	7,	//Lizard's Lowland
        c49_50:	8,	//Green Wood
        c49_48:	9,	//Eagle's Nest 	//Inferno portal 2
        c50_52:	10,	//Portal Ruins 	//Inferno portal 1
        c51_51:	11,	//Dragon's Caves
        c49_49:	12,	//Shining Spring
        c48_49:	13,	//Sunny City
        c52_50:	14,	//Magma Mines
        c52_49:	15,	//Bear' Mountain
        c52_48:	16,	//Fairy Trees
        c53_50:	17,	//Harbour City
        c53_49:	18,	//Mythril Coast 	//Inferno portal 3
        c51_52:	19,	//Great Wall
        c51_53:	20,	//Titans' Valley
        c52_53:	21,	//Fishing Village
        c52_54:	22,	//Kingdom Castle
        c48_48:	23,	//Ungovernable Steppe
        c51_48:	24,	//Crystal Garden
        c49_52:	25,	//East Island (Old Location)
        c49_52:	26,	//The Wilderness
        c48_50:	27	//Sublime Arbor

    }

    // Массив локаций
    var locArr = new Array(
    //  0i	1x	2y	3r	4ne			5nr
        [] ,
        [ 1 , 	50 ,	50 ,	1 ,	'Empire Capital' ,		'Столица Империи' ] ,
        [ 2 ,	51 ,	50 ,	1 ,	'East River' ,		'Восточная Река' ] ,
        [ 3 ,	50 ,	49 ,	1 ,	'Tiger\'s Lake' ,		'Тигриное Озеро' ] ,
        [ 4 ,	51 ,	49 ,	1 ,	'Rogue\'s Wood' ,		'Лес Разбойников' ] ,
        [ 5 ,	50 ,	51 ,	1 ,	'Wolf\'s Dale' ,		'Долина Волков' ] ,
        [ 6 ,	50 ,	48 ,	1 ,	'Peaceful Camp' ,		'Мирный Лагерь' ] ,
        [ 7 ,	49 ,	51 ,	1 ,	'Lizard\'s Lowland' ,		'Равнина Ящеров' ] ,
        [ 8 ,	49 ,	50 ,	1 ,	'Green Wood' ,		'Зелёный Лес' ] ,
        [ 9 ,	49 ,	48 ,	1 ,	'Eagle\'s Nest' ,		'Орлиное Гнездо' ] ,
        [ 10 ,	50 ,	52 ,	1 ,	'Portal\'s ruins' ,		'Руины Портала' ] ,
        [ 11 ,	51 ,	51 ,	1 ,	'Dragon\'s Caves' ,		'Пещеры Драконов' ] ,
        [ 12 ,	49 ,	49 ,	1 ,	'Shining Spring' ,		'Сияющий Родник' ] ,
        [ 13 ,	48 ,	49 ,	1 ,	'Sunny City' ,		'Солнечный Город' ] ,
        [ 14 ,	52 ,	50 ,	1 ,	'Magma Mines' ,		'Магма Шахты' ] ,
        [ 15 ,	52 ,	49 ,	1 ,	'Bear\' Mountain' ,		'Медвежья Гора' ] ,
        [ 16 ,	52 ,	48 ,	1 ,	'Fairy Trees' ,		'Магический Лес' ] ,
        [ 17 ,	53 ,	50 ,	1 ,	'Harbour City ' ,		'Портовый Город' ] ,
        [ 18 ,	53 ,	49 ,	1 ,	'Mythril Coast' ,		'Мифриловый Берег' ] ,
        [ 19 ,	51 ,	52 ,	1 ,	'Great Wall' ,		'Великая Стена' ] ,
        [ 20 ,	51 ,	53 ,	1 ,	'Titans\' Valley' ,		'Равнина Титанов' ] ,
        [ 21 ,	52 ,	53 ,	1 ,	'Fishing Village' ,		'Рыбачье Село' ] ,
        [ 22 ,	52 ,	54 ,	1 ,	'Kingdom Castle' ,		'Замок Королевства' ] ,
        [ 23 ,	48 ,	48 ,	1 ,	'Ungovernable Steppe' ,	'Непокорная Степь' ] ,
        [ 24 ,	51 ,	48 ,	1 ,	'Crystal Garden' ,		'Кристальный Сад' ] ,
        [ 25 ,	49 ,	52 ,	1 ,	'East Island' ,			'Восточный Остров' ] ,
        [ 26 ,	49 ,	52 ,	1 ,	'The Wilderness' ,		'Дикие Земли' ] ,
        [ 27 ,	48 ,	50 ,	1 ,	'Sublime Arbor' ,		'Великое Древо' ]
    )

    // location error
    // сначала путь берёт диагональ, а потом катет
    var locP =
    {
        l1_14: 11 ,
        l1_17: 11 ,
        l1_26: 5 ,
        l1_27: 8 ,

        l2_14: 15 ,
        l2_17: 15 ,
        l2_18: 15 ,
        l2_21: 11 ,
        l2_22: 11 ,
        l2_27: 1 ,

        l3_14: 4 ,
        l3_16: 4 ,
        l3_17: 4 ,
        l3_26: 1 ,
        l3_27: 12 ,

        l4_14: 15 ,
        l4_16: 15 ,
        l4_17: 15 ,
        l4_21: 2 ,
        l4_22: 2 ,
        l4_26: 2 ,
        l4_27: 3 ,

        l5_14: 11 ,
        l5_17: 11 ,
        l5_19: 10 ,
        l5_20: 10 ,
        l5_21: 10 ,
        l5_22: 10 ,
        l5_27: 8 ,

        l6_2: 4 ,
        l6_16: 4 ,
        l6_26: 3 ,
        l6_27: 12 ,

        l7_13: 8 ,
        l7_14: 5 ,
        l7_17: 5 ,
        l7_23: 8 ,
        l7_26: 5 ,

        l8_14: 5 ,
        l8_17: 5 ,
        l8_26: 5 ,

        l9_16: 3 ,
        l9_26: 3 ,

        l10_27: 5 ,

        l11_3: 2 ,
        l11_6: 2 ,
        l11_9: 2 ,
        l11_21: 19 ,
        l11_22: 19 ,
        l11_26: 10 ,
        l11_27: 5 ,

        l12_14: 3 ,
        l12_16: 3 ,
        l12_17: 3 ,
        l12_26: 1 ,

        l13_14: 12 ,
        l13_16: 12 ,
        l13_17: 12 ,

        l14_1: 11 ,
        l14_2: 15 ,
        l14_3: 15 ,
        l14_4: 15 ,
        l14_6: 15 ,
        l14_8: 11 ,
        l14_9: 15 ,
        l14_12: 15 ,
        l14_13: 15 ,
        l14_18: 15 ,
        l14_21: 11 ,
        l14_22: 11 ,
        l14_23: 15 ,
        l14_24: 15 ,
        l14_27: 11 ,

        //l15_6: 4 ,
        //l15_9: 4 ,
        l15_23: 24 ,
        l15_26: 2 ,
        l15_27: 4 ,

        l16_1: 15 ,
        l16_2: 15 ,
        l16_3: 15 ,
        l16_4: 15 ,
        l16_5: 15 ,
        l16_6: 15 ,
        l16_7: 15 ,
        l16_8: 15 ,
        l16_9: 15 ,
        l16_10: 15 ,
        l16_11: 15 ,
        l16_12: 15 ,
        l16_13: 15 ,
        l16_19: 15 ,
        l16_20: 15 ,
        l16_23: 15 ,
        l16_24: 15 ,
        l16_26: 15 ,
        l16_27: 15 ,

        l17_2: 15 ,
        l17_5: 14 ,
        l17_7: 14 ,
        l17_10: 14 ,
        l17_11: 14 ,
        l17_19: 14 ,
        l17_20: 14 ,
        l17_21: 14 ,
        l17_22: 14 ,
        l17_26: 14 ,
        l17_27: 14 ,

        l18_1: 15 ,
        l18_2: 15 ,
        l18_5: 15 ,
        l18_6: 15 ,
        l18_7: 15 ,
        l18_8: 15 ,
        l18_9: 15 ,
        l18_10: 17 ,
        l18_11: 17 ,
        l18_14: 17 ,
        l18_19: 17 ,
        l18_20: 17 ,
        l18_21: 17 ,
        l18_22: 17 ,
        l18_23: 15 ,
        l18_24: 15 ,
        l18_26: 17 ,
        l18_27: 15 ,

        l19_1: 11 ,
        l19_3: 11 ,
        l19_5: 10 ,
        l19_6: 11 ,
        l19_7: 10 ,
        l19_8: 10 ,
        l19_9: 11 ,
        l19_12: 10 ,
        l19_13: 10 ,
        l19_14: 11 ,
        l19_15: 11 ,
        l19_16: 11 ,
        l19_17: 11 ,
        l19_18: 11 ,
        l19_23: 10 ,
        l19_27: 10 ,

        l20_14: 19 ,
        l20_15: 19 ,
        l20_16: 19 ,
        l20_17: 19 ,
        l20_18: 19 ,
        l20_27: 10 ,

        l21_14: 19 ,
        l21_15: 19 ,
        l21_16: 19 ,
        l21_17: 19 ,
        l21_18: 19 ,
        l21_27: 19 ,

        l22_17: 21 ,
        l22_18: 21 ,
        l22_27: 20 ,

        l23_16: 15 ,
        l23_26: 1 ,
        l23_27: 13 ,

        l24_16: 15 ,
        l24_21: 2 ,
        l24_22: 2 ,
        l24_26: 2 ,
        l24_27: 3 ,

        l26_7: 5 ,
        l26_8: 5 ,
        l26_9: 5 ,
        l26_11: 10 ,
        l26_12: 5 ,
        l26_13: 5 ,
        l26_14: 10 ,
        l26_17: 10 ,
        l26_20: 10 ,
        l26_21: 10 ,
        l26_22: 10 ,
        l26_23: 5 ,
        l26_24: 5 , 
        l26_27: 5 , 

        l27_1: 8 ,
        l27_2: 8 ,
        l27_3: 12 ,
        l27_4: 12 ,
        l27_5: 7 ,
        l27_6: 12 ,
        l27_9: 12 ,
        l27_10: 7 ,
        l27_11: 7 ,
        l27_14: 11 ,
        l27_15: 4 ,
        l27_16: 15 ,
        l27_17: 15 ,
        l27_18: 12 ,
        l27_19: 10 ,
        l27_20: 10 ,
        l27_21: 20 ,
        l27_22: 20 ,
        l27_23: 13 ,
        l27_24: 12 ,
        l27_26: 8
    }

    init();

    function init() {
    try {
       nado = els.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    /*
    0 - cur place
    1 - view place
    2-10 - have move
    11 - gO
    12 - gV
    13 - gN
    14 - loc from move (only move)
    15 - last time move (only move)
    16 - all time move (only move)
    17 - ?
    18 - clan id
    19 - ?
    20 - ?
    */

    //+ отображение карты
        var vm = GM_getValue( "checkvm" ) ;
        if( vm == 1 ) {
             document.getElementsByName('movie')[2].parentNode.parentNode.style.display = 'none';
        } else {
            //ems.width = 500; 	// широкая карта, убрана в 1.16.4
        }
    //-

        // происходит передвижение
        if( pl[14] > 0 ) {
            div = document.createElement( 'div' );
            div.innerHTML = '<br><div style="text-align: center; font-weight:bold; color:#A52A2A;" id="hint_move"><i>'+ lng_dest +':</i> '+ locArr[pl[0]][lng_main] +' ('+ locArr[pl[0]][lng_add] +')</div><br>' + coop;
            nado.appendChild( div );
            $("hwmmm_options").addEventListener( "click", setting , false );

            var mTitle = document.title ;
            var start_time = new Date() ;
            update_time( start_time.getTime() , mTitle ) ;
        }
        // стоим в секторе
        else {
            nado.appendChild( dm ) ;
            $("hwmmm_options").addEventListener( "click", setting , false );
            for( l = 1 ; l < locArr.length; l++ ) {
                if(l!=25) {
                    var d = $( 'loc_' + l ) ;
                    d.parentNode.style.textAlign = 'center' ;
                    d.style.padding = '1px 3px' ;
                    d.style.fontSize = '11px' ;
                    d.parentNode.style.border = pl[1] == l ? '1px solid #00f' : '1px solid #abc' ;
                    // если текущий сектор
                    if( l == pl[0] ) {
                        d.style.fontWeight = 'bold' ;
                        d.parentNode.style.backgroundColor = 'FFF8DC' ;
                        if( pl[13] != 0 && l == pl[13] ) {
                            d.style.color = 'FF0000' ;
                        }
                        d.innerHTML = locArr[l][lng_main] ;
                    }
                    // если какой другой
                    else {
                        a = document.createElement( 'a' );
                        a.style.fontSize = '11px' ;
                        a.href = url +'/move_sector.php?id='+l ;
                        // если задание Наёмников
                        if( pl[13] != 0 && l == pl[13] ) {
                            a.style.color = 'FF0000' ;
                        }
                        a.innerHTML = locArr[l][lng_main] ;
                        a.setAttribute( 'tZ' , l ) ;

                        a.addEventListener( "mouseover", viewPath , false );
                        a.addEventListener( "mouseout", hidePath , false );

                        a.title = locArr[l][lng_main] + ' (' + getTimeL( pl[0] , l , 0 ) + ')' ;
                        d.appendChild( a );
                    }

                    if( pl[13] == -1 && in_array( l , plgn ) ) {
                        b = document.createElement( 'b' );
                        b.style.color = '#00F' ;
                        b.innerHTML = ' X' ;
                        d.appendChild( b ) ;
                    }

                    if( GM_getValue( "checkvs" ) ) {
                        if( pl[1] != l ) {
                            a = document.createElement( 'a' );
                            a.href = url +'/map.php?cx='+ locArr[l][1] +'&cy='+ locArr[l][2];
                            a.style.display = 'block' ;
                            a.style.width = '100%';
                            a.title = lng_view + locArr[l][lng_main] ;
                            vi = document.createElement( 'img' );
                            vi.src = "data:image/gif,GIF89a%10%00%10%00%D5%00%00B%40B%15%15%18((-PPUzz%7FHHJ%5D%5D_--.zz%7BWWX23%3BEHS%80%88%A2rx%8C%DA%DD%E7bj%80sx%87%88%8C%97%7D%85%98HO_%7D%85%97%88%8C%95psz%DC%DD%DF%D4%D5%D7x%7F%8C%2B-0%C2%DF%FF%DF%F4%FFMOPmop%EF%F1%F2%E7%F9%FF%EA%FD%FF%E7%FF%FF%13%15%15%E9%FF%FF%18%1A%1A%FA%FF%FFmoo%FC%FF%FF%FD%FF%FFZ%5B%5B%5D%5D%5B%40%3F%3F%FF%FF%FF%16%16%16%10%10%10%05%05%05%00%00%00%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%002%00%2C%00%00%00%00%10%00%10%00%00%06%5C%40%99pH%2C%12%13%01%8D%80e%24%02ZP%A8%A2)k%C8%A2%D1As%01Ma'%CDF%D4%14%7D4!-%94%A8%95%BAJ%9A%07P%8B%E4mm%2C%D4H(%CA%A9%AC%A82%05%19%0C%14%041*%17%80E0%1D%18%8AD%2F%06%89%8FB%25'%1F%94B.%08-%992%23%1E%9ECA%00%3B" ;
                            vi.style.border = '0px' ;
                            a.appendChild( vi ) ;
                            d.parentNode.appendChild( a ) ;
                        }
                    }
                }
            }
        }
                        } catch(e) {
                           alert(e)
                        }
    }

    function update_time(start, title) {
        new_time = new Date();
        s = pl[15]-Math.round((new_time.getTime()-start)/1000.);
        m = 0; h = 0;
        if (s < 0) {
        } else {
          if (s > 59) {
            m = Math.floor(s/60);
            s = s-m*60;
          }
          if (m > 59) { 
            h = Math.floor(m/60);
            m = m-h*60;
          }
          if (s < 10) { s = "0"+s; }
          if (m < 10) { m = "0"+m; }
    //        document.title=" ["+h+":"+m+":"+s+"] " + title;
            document.title = " ["+m+":"+s+"] " + title;
            setTimeout (function () { update_time(start,title)}, 999);
        }
    }


    function setCheck(ch) {
        if( GM_getValue( ch ) && GM_getValue( ch ) == 1 )
            GM_setValue( ch , 0 );
        else
            GM_setValue( ch , 1 );
    }

    function setTransport(id) {
        $("transp"+transp).style.background="#F6F3EA";
        $("transp"+id).style.background="#0000ff";
        GM_setValue( "transport" , id );
        transp = id ;
    }

    function getTimeL( cz , mz , t ) {
    /*  cz	текущий сектор обсчёта
        mz	конечный сектор обсчёта
        t	сумма времени
    */
        // если прибыли в конечный пункт
        if (mz == cz) {
            var myT = new Date(t*1000)
            myTs = myT.getSeconds()
            return myT.getMinutes() + ':' + ( myTs < 10 ? '0' : '' ) + myTs ;
        }

        var nz = 0; 		// следующий сектор, к которому надо действительно двигаться

        var kC = locArr[cz]; 	//координаты текущие
        if (kC == undefined) return 0;
        var kM = locArr[mz]; 	//координаты назначения

        id1 = eval( 'locP.l' + cz + '_' + mz ) //id исключение

        // если есть исключения, следующий сектор будет равен ид исключения
        if (id1 && id1 > 0) {
            nz = id1 ;
        }

        // если исключения, то переназначаем координаты назначения
        if (nz != 0) var kM = locArr[nz] ;

        tx = kM[1] > kC[1] ? 1 : ( kM[1] == kC[1] ? 0 : -1 ) ;
        ty = kM[2] > kC[2] ? 1 : ( kM[2] == kC[2] ? 0 : -1 ) ;
        nx = parseInt( kC[1] ) + tx ;
        ny = parseInt( kC[2] ) + ty ;

    //    t = ( ty == 0 || tx == 0 ) ? t + 120 : t + 169 ;
        t = (ty == 0 || tx == 0) ? t + trtime[transp] : t + trtimed[transp] ;
        id = eval( 'locX.c' + nx + '_' + ny ) ;
    //    t = t + ' ' + id + '(' + nz + ')' ;

        return getTimeL( id , mz , t );
    }


    function viewPath() {
        mz = this.getAttribute( 'tz' );

        path (pl[0], mz);
        function path( cz , mz ) {
            if (mz == cz)	return ;
            var nz = 0; 			// следующий сектор, к которому надо действительно двигаться
            var kC = locArr[cz]; 		//координаты текущие
            var kM = locArr[mz]; 		//координаты назначения
            id1 = eval( 'locP.l' + cz + '_' + mz ) 	//ID исключение
            // если есть исключения, следующий сектор будет равен id исключения
            if (id1 && id1 > 0) {
                nz = id1;
            }

            // если исключения, то переназначаем координаты назначения
            if (nz != 0) var kM = locArr[nz];
            tx = kM[1] > kC[1] ? 1 : ( kM[1] == kC[1] ? 0 : -1 );
            ty = kM[2] > kC[2] ? 1 : ( kM[2] == kC[2] ? 0 : -1 );
            nx = parseInt( kC[1] ) + tx ;
            ny = parseInt( kC[2] ) + ty ;
            id = eval( 'locX.c' + nx + '_' + ny ) ;

            td = $('loc_'+id)
            td.parentNode.style.backgroundColor = 'F0E68C' ;
            road[road.length] = id ;
            path( id , mz );
        }
        return ;
    }

    function hidePath() {
        for (i = 0; i < road.length ; i ++) {
            $('loc_'+road[i]).parentNode.style.backgroundColor = 'DDD9CD' ;
        }
        road = new Array() ;
    }


    //+ закрытие форм
    function form_close() {
        bg = $('bgOverlay') ;
        bgc = $('bgCenter') ;
        if ( bg ) {
            bg.style.display = bgc.style.display = 'none' ;
        }
    }

    function open_transfer() {
        if ( location.href.match('lordswm') ) {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=Transferred 10000 Gold 5 Diamonds";
        } else {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=%CF%E5%F0%E5%E4%E0%ED%EE%2010000%20%C7%EE%EB%EE%F2%EE%205%20%C1%F0%E8%EB%EB%E8%E0%ED%F2%FB";
        }
    }

    //+ форма настроек
    function setting() {
        var bg = $('bgOverlay');
        var bgc = $('bgCenter');
        var bg_height = ScrollHeight();
        if( !bg ) {
            bg = document.createElement('div');
            document.body.appendChild( bg );
            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0';
            bg.style.width = '100%';
            bg.style.height = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "1100";
            bg.addEventListener( "click", form_close , false );

            bgc = document.createElement('div');
            document.body.appendChild( bgc );
            bgc.id = 'bgCenter' ;
            bgc.style.position = 'absolute';
            bgc.style.width = '400px';
            bgc.style.background = "#F6F3EA";
            bgc.style.left = ( ( document.body.offsetWidth - 400 ) / 2 ) + 'px';
            bgc.style.zIndex = "1105";
        }

        bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"> <div style="float:right; border:1px solid #abc; width:15px; height:15px; text-align:center; cursor:pointer;" id="bt_close" title="'+ lng_close +'">x</div>    <div style="text-align: center; font-size: 14px; font-weight:bold; color:#6A5ACD;">HWM Map Move <font style="color:#008B00;">'+ ver +'</font></div><hr/> <table width="100%" cellspacing=0 cellpadding=0 border=0> <tr><td colspan=3 style="text-align:center; font-size: 13px; font-weight:bold;"><i>'+ lng_main_set +':</i></td></tr> <tr><td colspan=3><div><label style="cursor:pointer;"><input type="checkbox" id="id_check_vm">'+ lng_set_map +'</label></div>' + 
        '<div><label style="cursor:pointer;"><input type="checkbox" id="id_check_vs">'+ lng_set_view +'</label></div>' + 
        '<div><label style="cursor:pointer;"><input type="checkbox" id="id_check_lng" title=""lng ru>'+ lng_set_lang +'</label></div>' + 
        '<div><label style="cursor:pointer;"><input type="checkbox" id="id_check_gn">'+ lng_set_return +'</label></div>' + 
        '<div><label style="cursor:pointer;"><input type="checkbox" id="id_check_gv">'+ lng_set_autoIn +'</label></div>' + 
        /*'<div><label style="cursor:pointer;"><input type="checkbox" id="id_check_gvn">'+ lng_set_enterRG +'</label></div>' + * это было для строк 104-108 */
        '<hr/><div style="text-align: center;">'+ lng_set_carriage +' (<a href = "'+ url +'/shop.php?cat=transport" target=_blank>'+ lng_set_shop +'</a>):<br> <table border="0" width="54%" align="center"><tr><td style="padding:5px;cursor:pointer;" id="transp3"> <img src="'+ url +'/i/transport/3.jpg"></td> <td style="padding:5px;cursor:pointer;" id="transp4"> <img src="'+ url +'/i/transport/4.jpg"></td> <td style="padding:5px;cursor:pointer;" id="transp5"> <img src="'+ url +'/i/transport/5.jpg"></td> <td style="padding:5px;cursor:pointer;" id="transp6"> <img src="http://dcdn.heroeswm.ru/i/transport/104.jpg" alt="Abu-Bekr"></td></tr></table> </div><hr/> </td></tr> <tr><td width="48%" align="center"><a href="'+ url_upd +'" target=_blank>'+ str_update +'</a></td> <td width="48%" align="center"><a href="'+ str_send_sms +'" target=_blank>'+ str_error +'</a></td> <td width="4%" align="right"><a href="javascript:void(0);" id="open_transfer_id">?</a></td></tr> </table> </div>';

        $("transp"+transp).style.background="#0000ff";
        $("transp3").addEventListener( "click", function(){setTransport(3)} , false );
        $("transp4").addEventListener( "click", function(){setTransport(4)} , false );
        $("transp5").addEventListener( "click", function(){setTransport(5)} , false );
        $("transp6").addEventListener( "click", function(){setTransport(6)} , false );

        $("bt_close").addEventListener( "click", form_close , false );
        $("open_transfer_id").addEventListener( "click", open_transfer , false );	  //шутка

        var check_gv = $('id_check_gv')
        check_gv.checked = GM_getValue( "checkgv" , 0 ) == 1 ? 'checked' : '' ;
        check_gv.addEventListener( "click", function(){setCheck('checkgv')} , false );

        /*var check_gvn = $('id_check_gvn')
        check_gvn.checked = GM_getValue( "checkgvn" , 0 ) == 1 ? 'checked' : '' ;
        check_gvn.addEventListener( "click", function(){setCheck('checkgvn')} , false ); */

        var check_gn = $('id_check_gn')
        check_gn.checked = GM_getValue( "checkgn" , 0 ) == 1 ? 'checked' : '' ;
        check_gn.addEventListener( "click", function(){setCheck('checkgn')} , false );

        var check_vm = $('id_check_vm')
        check_vm.checked = GM_getValue( "checkvm" , 0 ) == 1 ? 'checked' : '' ;
        check_vm.addEventListener( "click", function(){setCheck('checkvm')} , false );

        var check_vs = $('id_check_vs')
        check_vs.checked = GM_getValue( "checkvs" , 0 ) == 1 ? 'checked' : '' ;
        check_vs.addEventListener( "click", function(){setCheck('checkvs')} , false );

        var check_lng = $('id_check_lng') ;
        check_lng.checked = check_lng_v == 1 ? 'checked' : '' ;
        check_lng.addEventListener( "click", function(){setCheck('checklng')} , false );

        bg.style.top = (-document.body.scrollTop)+'px';
        bgc.style.top = ( document.body.scrollTop + 100 ) + 'px';
        bg.style.display = bgc.style.display = 'block' ;
    }
    //-

    function ScrollHeight() {
        return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    }

    function getI( xpath ) {
        return document.evaluate( xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    }

    function $( id ) { return document.getElementById( id ); }

    function in_array(needle, haystack, strict) {
        var found = false, key, strict = !!strict;
        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                found = true;
                break;
            }
        }
        return found;
    }

})();