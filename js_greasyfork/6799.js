// ==UserScript==
// @name           hwm_text_counter
// @author         Demin
// @namespace      Demin
// @description    Подсчет количества введенных символов в полях ввода: форума, персональной информации, личной почты, блокнота, описания клана, рассылки по клану (by Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.3
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://*lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6799/hwm_text_counter.user.js
// @updateURL https://update.greasyfork.org/scripts/6799/hwm_text_counter.meta.js
// ==/UserScript==

// (c) 2014-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2010, bonArt

(function() {

var version = '1.3';


if (typeof GM_getValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}


var url_cur = location.href;
var url = 'http://'+location.hostname+'/';

//====================Page detection====================

var url_reply = "forum_messages.php";
var url_newmsg = "new_topic.php";
var url_sett = "pers_settings.php";
var url_sms = "sms-create.php";
var url_note = "sms.php?notebook";
var url_clan = "clan_control.php";
var url_clan_sms = "clan_broadcast.php";


if ( (url_cur.indexOf(url_clan)==-1) && (url_cur.indexOf(url_note)==-1) && (url_cur.indexOf(url_reply)==-1) && (url_cur.indexOf(url_newmsg)==-1) && (url_cur.indexOf(url_sms)==-1) && (url_cur.indexOf(url_clan_sms)==-1) && (url_cur.indexOf(url_sett)==-1) ) return;


var script_num = 6799;
var script_name = "hwm_text_counter: Подсчет количества введенных символов в полях ввода: форума, персональной информации, личной почты, блокнота, описания клана, рассылки по клану (by Demin)";
update_n(version,script_num,script_name);


//====================Text blocks====================

if ( url.match('lordswm') ) {
	var msg_head = "Subject: "; //head
	var msg_body_sms = "Message: "; //message body
	var msg_body = "";
	var used_smb = "Used "; //used
	var chars_of = " chars of "; //chars of
} else {
	var msg_head = "\u0422\u0435\u043C\u0430\u003A "; //head
	var msg_body_sms = "\u0422\u0435\u043B\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F\u003A "; //message body
	var msg_body = "";
	var used_smb = "\u0412\u0432\u0435\u0434\u0435\u043D\u043E "; //used
	var chars_of = " \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0438\u0437 "; //chars of
}

//====================Nod generation====================

if ( (url_cur.indexOf(url_sms)!=-1) || (url_cur.indexOf(url_clan_sms)!=-1) || (url_cur.indexOf(url_newmsg)!=-1) ) {
	var tr_th = document.createElement('tr');
	var td_th = document.createElement('td');
	var sp_th = document.createElement('span');

	tr_th.appendChild(td_th);
	td_th.appendChild(sp_th);
}

var tr_ta = document.createElement('tr');
var td_ta = document.createElement('td');
var sp_ta = document.createElement('span');

tr_ta.appendChild(td_ta);
td_ta.appendChild(sp_ta);

//====================Pages parameters====================

var t_col = 0;
var msg_ta = document.querySelector("textarea");
if ( !msg_ta ) return;
var msg_th = document.querySelector("form");
//subj.maxLength = maxLength;

if ( url_cur.indexOf(url_reply)!=-1 ) {
	var max_chars_ta = 3000;

	t_col = 2;
	msg_ta.rows = 15;
}

if ( url_cur.indexOf(url_newmsg)!=-1 ) {
	msg_th = msg_th.querySelector("input[type='text']");

	var max_chars_th = 70;
	var max_chars_ta = 3000;
	msg_body = msg_body_sms;

	t_col = 2;
	msg_ta.rows = 10;
}

if ( url_cur.indexOf(url_sett)!=-1 ) {
	var max_chars_ta = 2000;

	t_col = 2;
	msg_ta.rows = 40;
}

if ( url_cur.indexOf(url_sms)!=-1 ) {
	msg_th = msg_th.querySelectorAll("input[type='text']")[1];

	var max_chars_th = 70;
	var max_chars_ta = 3900;
	msg_body = msg_body_sms;

	t_col = 2;
	msg_ta.rows = 20;
	msg_ta.style.width = 900;
}

if ( url_cur.indexOf(url_note)!=-1 ) {
	var max_chars_ta = 2900;

	td_ta.className = "wblight";
	td_ta.style.borderTopWidth = "0px";
	msg_ta.parentNode.className = "wblight";
	msg_ta.parentNode.style.borderBottomWidth = "0px";
	msg_ta.parentNode.parentNode.parentNode.parentNode.cellSpacing = 0;

	t_col = 1;
	msg_ta.rows = 30;
}

if ( url_cur.indexOf(url_clan)!=-1 ) {
	var max_chars_ta = 9800;

	td_ta.className = "wbwhite";
	td_ta.style.borderTopWidth = "0px";
	msg_ta.parentNode.style.borderBottomWidth = "0px";

	t_col = 1;
	msg_ta.rows = 30;
}

if ( url_cur.indexOf(url_clan_sms)!=-1 ) {
	msg_th = msg_th.querySelector("input[type='text']");
	msg_th.style.width = "100%";

	var max_chars_th = 70;
	var max_chars_ta = 3900;
	msg_body = msg_body_sms;

	t_col = 2;
	msg_ta.rows = 20;
	msg_ta.style.width = 900;
}

//====================Text generation====================

if ( (url_cur.indexOf(url_sms)!=-1) || (url_cur.indexOf(url_clan_sms)!=-1) || (url_cur.indexOf(url_newmsg)!=-1) ) {
	sp_th.innerHTML = msg_head + used_smb + "0" + chars_of + max_chars_th;
	td_th.colSpan = t_col;
	sp_th.style.marginLeft = "25";
	sp_th.style.fontSize = "12px";
}

	sp_ta.innerHTML = msg_body + used_smb + "0" + chars_of + max_chars_ta;
	td_ta.colSpan = t_col;
	sp_ta.style.marginLeft = "25";
	sp_ta.style.fontSize = "12px";

//====================Inserting nod blocks into a document====================

if ( (url_cur.indexOf(url_sms)!=-1) || (url_cur.indexOf(url_clan_sms)!=-1) || (url_cur.indexOf(url_newmsg)!=-1) ) {
	insertAfter(msg_ta, tr_ta, tr_th);
	countCharsChange_th();
} else {
	insertAfter(msg_ta, tr_ta);
}

countCharsChange_ta();

//====================Keypress listener====================

if ( (url_cur.indexOf(url_sms)!=-1) || (url_cur.indexOf(url_clan_sms)!=-1) || (url_cur.indexOf(url_newmsg)!=-1) ) {
	addEvent( msg_th, "keydown", countChars_th );
	addEvent( msg_th, "click", countChars_th );
	addEvent( msg_th, "change", countChars_th );
	addEvent( msg_th, "mouseout", countChars_th );
	addEvent( msg_th, "mouseover", countChars_th );
}

addEvent( msg_ta, "keydown", countChars_ta );
addEvent( msg_ta, "click", countChars_ta );

//====================Functions====================

function insertAfter(parent, node, node2) {
	if ( url_cur.indexOf(url_sett)==-1 ) {
		while ( parent.tagName != 'TR' ) { parent = parent.parentNode; }
	}
	parent.parentNode.insertBefore(node, parent.nextSibling);

	if ( node2 ) { parent.parentNode.insertBefore(node2, parent.nextSibling); }
}

function countChars_th() {
	setTimeout( function() { countCharsChange_th(); }, 100 ); // workaround for pasting from clipboard
}

function countChars_ta() {
	setTimeout( function() { countCharsChange_ta(); }, 100 ); 
}

function countCharsChange_th() {
	sp_th.innerHTML = msg_head + used_smb + msg_th.value.length + chars_of + max_chars_th;
	sp_th.style.backgroundColor = ( msg_th.value.length > max_chars_th ) ? "#fcc" : "";
}

function countCharsChange_ta() {
	sp_ta.innerHTML = msg_body + used_smb + msg_ta.value.length + chars_of + max_chars_ta;
	sp_ta.style.backgroundColor = ( msg_ta.value.length > max_chars_ta ) ? "#fcc" : "";
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
