// ==UserScript==
// @name           [1180] links on home page (control)
// @description    links on home page (control)
// @include        http://www.heroeswm.ru/home.php
// @include        http://*heroeswm.ru/home.php
// @include        http://178.248.235.15/home.php
// @include        http://209.200.152.144/home.php
// @include        http://*.lordswm.com/home.php
// @version 0.0.1.20150628135001
// @namespace https://greasyfork.org/users/8949
// @downloadURL https://update.greasyfork.org/scripts/7947/%5B1180%5D%20links%20on%20home%20page%20%28control%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7947/%5B1180%5D%20links%20on%20home%20page%20%28control%29.meta.js
// ==/UserScript==

// === v 1.5 ========

//alert("HWM_Skills_At_Home");	

// =========== SETTINGS ============
// set variable below to "yes" to enable scrollbars
var my_skills_scroll = "no";

var iframe_width = 250;
var iframe_height = 130;// need height=330 for 5 skill groups

var scroll_top = 630;
var scroll_left = 630;

// ==================================





var all_li_subnav = document.evaluate("//li[@class='subnav']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var my_li;
var prev_elm;
// get player ID
my_li = all_li_subnav.snapshotItem(5);
prev_elm = my_li.childNodes[1].childNodes[1];
	//
var ptrn = /<a href="pl_hunter_stat\.php\?id=(.*)">(.*)<\/a>/;
var player_id = prev_elm.innerHTML.replace(ptrn, "$1")
		//alert("player_id = "+player_id);
//
var my_profile_url = "http://web-spider.clan.su/heroeswm.ru_geroi_vojny_i_deneg-onlajn_igra.htm";


addPanel();



function addPanel(){
		//alert("addPanel");
	//	create DIV with iframe
	var d = document.createElement( 'div' );
	d.style.marginLeft = 5;
	//
	
	d.innerHTML = 
'<br>» <a style="text-decoration: none;" target="_blank" href="clan_info.php?id=1180"><b>Паутина </b></a> (<a href="clan_control.php?id=1180">Управление</a>) <BR> <br><font color="blue">»  <b>Статистика:</b></font><br><br>  <li><a style="text-decoration: none;" target="_blank" href="http://hwmguide.ru/services/clan_stats/1180">Статистика на гайде</a></li> <li><a style="text-decoration: none;" target="_blank" href="http://web-spider.clan.su/index/statistika_klana/0-15">Статистика клана</a></li> <br><font color="blue">» <b>Сервис-помощь:</b></font><br><br> <li><a style="text-decoration: none;" target="_blank" href="http://hwmlinks.ru/gsale.html">Сервис сдачи в гос</a></li><li><a style="text-decoration: none;" target="_blank" href="http://hwm.kekus.de/trade">Рыночная статистика</a></li><li><a style="text-decoration: none;" target="_blank" href="http://stat.artecbpo.com/salary">Доходность предприятий</a></li><li><a style="text-decoration: none;" target="_blank" href="http://www.witchhammer.ru/news.php">Молот ведьм</a></li><li><a style="text-decoration: none;" target="_blank" href="http://lgnd.ru/">lgnd.ru ( леджент.ру)</a></li><li><a style="text-decoration: none;" target="_blank" href="http://web-spider.clan.su/">Клановый сайт</a></li><li><a style="text-decoration: none;" target="_blank" href="http://daily.heroeswm.ru/">HWM DAILY</a></li>';

	
	var combat_lvl_str = "\u0411\u043E\u0435\u0432\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C";
	var all_td = document.getElementsByTagName('td');
	var td_len = all_td.length;
	var my_td;
	for (var i = 0; i < td_len; i++) {
		my_td = all_td[i];
		if(my_td.innerHTML.indexOf("td") != -1 ){ continue; }  // has child TDs
		if(my_td.innerHTML.indexOf(combat_lvl_str) != -1 ){
			//alert("my_td.innerHTML = "+my_td.innerHTML);
			break;
		}
		
	}
	
	my_td.appendChild( d ) ;
	
	//document.body.appendChild( d ) ;
	
	//
	document.getElementById('skills_iframe').addEventListener( "load", smsIframeLoaded , false );
	
}


function smsIframeLoaded(){
		//alert("smsIframeLoaded");
	var my_iframe = document.getElementById('skills_iframe');
	//
	//my_iframe.contentWindow.scrollTo(630, 630);
	my_iframe.contentWindow.scrollTo(scroll_left, scroll_top);
		
}





//
