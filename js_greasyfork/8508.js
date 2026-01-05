// ==UserScript==
// @name           hwm_clickable_links
// @author         Demin
// @namespace      Demin
// @description    Распознавание в тексте ссылок (by Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.7
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/pl_info.php*
// @include        http://qrator.heroeswm.ru/pl_info.php*
// @include        http://178.248.235.15/pl_info.php*
// @include        http://www.lordswm.com/pl_info.php*
// @include        http://www.heroeswm.ru/forum_messages.php*
// @include        http://qrator.heroeswm.ru/forum_messages.php*
// @include        http://178.248.235.15/forum_messages.php*
// @include        http://www.lordswm.com/forum_messages.php*
// @include        http://www.heroeswm.ru/clan_info.php*
// @include        http://qrator.heroeswm.ru/clan_info.php*
// @include        http://178.248.235.15/clan_info.php*
// @include        http://www.lordswm.com/clan_info.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/8508/hwm_clickable_links.user.js
// @updateURL https://update.greasyfork.org/scripts/8508/hwm_clickable_links.meta.js
// ==/UserScript==

// (c) 2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2009, ArtPetroff

(function() {

var version = '1.7';


if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}


var script_num = 8508;
var script_name = "hwm_clickable_links: Распознавание в тексте ссылок (by Demin)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


if (url_cur.indexOf("pl_info.php") != -1) {

	var flash_army = document.querySelectorAll("a[href^='pl_transfers.php?id']");
	if ( flash_army.length==0 ) return;
	flash_army = flash_army[flash_army.length-1];
	while ( flash_army.tagName != 'TABLE' ) { flash_army = flash_army.parentNode; }
	flash_army = flash_army.parentNode.childNodes[flash_army.parentNode.childNodes.length - 2];
	while ( flash_army.tagName != 'TD' ) { flash_army = flash_army.lastChild; }
	flash_army.innerHTML = replaceAll( flash_army.innerHTML );

} else if (url_cur.indexOf("forum_messages.php") != -1) {

	var td_arr = document.getElementsByTagName('td');
	for (var i=0, td_arr_len=td_arr.length, td, attr; i<td_arr_len; i++) {
		td = td_arr[i];
		attr = td.getAttribute('style');
		if (attr == "color: #000000; padding: 5px; font-size: 13px;") {
			td.innerHTML = replaceAll( td.innerHTML );
		}
	}

} else if (url_cur.indexOf("clan_info.php") != -1) {

	var add_table_parent = document.querySelector("a[href^='clan_log.php?id']");
	while ( add_table_parent.tagName != 'TABLE' ) { add_table_parent = add_table_parent.parentNode; }
	while ( add_table_parent.tagName != 'TD' ) { add_table_parent = add_table_parent.lastChild; }
	add_table_parent.innerHTML = replaceAll( add_table_parent.innerHTML );
}

function replaceAll(lines) {
	if ( lines.match("http") ) {
		lines = lines.split('<br>')
		for (var i = 0, i_len=lines.length; i < i_len; i++) {
			var words = lines[i].split(' ');
			for (var j = 0, j_len=words.length; j < j_len; j++) {
				words[j] = replace(words[j]);
			}
			lines[i] = words.join(' ');
		}
		return lines.join('<br>');
	}
	return lines;
}

function replace(a) {
	var b = (a.indexOf("color=") == 0);
	var i = a.indexOf("http");
	if (i > 1 && !b) {return a;}
	if (i != -1) {
//		return a.replace(/((?:\w+:\/\/|www\.)[\w\.\/%\d&\?#+=-]+)/i, '<a href="$1">$1</a>');
		var temp_a = /((?:\w+:\/\/|www\.)[^<>]+)/i.exec( a );
		if ( temp_a ) {
			temp_a = temp_a[1];
			while ( /[^\w\/#&$=\+]/.exec( temp_a.slice(-1) ) ) { temp_a = temp_a.slice(0, -1); }
			return a.replace(temp_a, '<a href="'+temp_a+'">'+temp_a+'</a>');
		}
	}
	return a;
}

function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

})();
