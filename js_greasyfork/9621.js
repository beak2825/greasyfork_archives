// ==UserScript==
// @name           hwm_MercGuild_additional_links
// @author         Demin
// @namespace      Demin_9621
// @description    Детали, состав и примеры боев Гильдии наемников (by Demin & HAPblB)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.1
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/mercenary_guild.php*
// @include        http://qrator.heroeswm.ru/mercenary_guild.php*
// @include        http://178.248.235.15/mercenary_guild.php*
// @include        http://www.heroeswm.ru/map.php*
// @include        http://qrator.heroeswm.ru/map.php*
// @include        http://178.248.235.15/map.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/9621/hwm_MercGuild_additional_links.user.js
// @updateURL https://update.greasyfork.org/scripts/9621/hwm_MercGuild_additional_links.meta.js
// ==/UserScript==

// (c) 2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2012, HAPblB

(function() {

var version = '1.1';


if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};

	this.GM_addStyle=function (key) {
		var style = document.createElement('style');
		style.textContent = key;
		document.querySelector("head").appendChild(style);
	}
}


var script_num = 9621;
var script_name = "hwm_MercGuild_additional_links: Детали, состав и примеры боев Гильдии наемников (by Demin & HAPblB)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


if(location.href.indexOf('map.php')>-1){
var parent = document.querySelectorAll("a[href*='map.php?cx='][href*='&cy='][href*='&st=mn']");
if ( parent.length==0 ) return;
var cx_cy = /(cx=\d+&cy=\d+)/.exec( parent[parent.length-1] );
if ( !cx_cy ) return;
if(cx_cy[1]=='cx=51&cy=50'){GM_setValue('9621_sector', 1);/*alert('East Reaver');*/}
else if(cx_cy[1]=='cx=50&cy=48'){GM_setValue('9621_sector', 2);/*alert('Peasefull Camp');*/}
else if(cx_cy[1]=='cx=52&cy=48'){GM_setValue('9621_sector', 3);/*alert('Fairy Trees');*/}
else if(cx_cy[1]=='cx=52&cy=53'){GM_setValue('9621_sector', 4);/*alert('Fishing Village');*/}
else {GM_setValue('9621_sector', 0);}
}

if(location.href.indexOf('mercenary_guild.php')>-1){
var sector=GM_getValue('9621_sector',0);

var mg_space = document.querySelector("object > param[value*='mercenary.swf']");
if ( mg_space ) mg_space = mg_space.parentNode.querySelector("param[name='FlashVars']");
if ( !mg_space ) return;
while ( mg_space.tagName != 'TD' ) { mg_space = mg_space.parentNode; }
mg_space = mg_space.nextSibling;

var mg_text=mg_space.innerHTML.replace(/<a[^>]+>/g, "").replace(/<\/a>/g, "");
var link_prefix='http://www.witchhammer.ru/viewpage.php?page_id=';
var description_link=link_prefix+'9#tabs-';
var collection_link=link_prefix+'42#tabs-';
var task_type_d=task_type_c=0;

if(mg_text.search(/-\u0437\u0430\u0445\u0432\u0430\u0442\u0447\u0438\u043A\u0438 \{\d+\}/)!=-1){task_type_d=3;task_type_c=2}
if(mg_text.search(/-\u043C\u043E\u043D\u0441\u0442\u0440 \{\d+\}/)!=-1){task_type_d=6;task_type_c=3}
if(mg_text.search(/\'\u0410\u0440\u043C\u0438\u044F /)!=-1){task_type_d=1;}
if(mg_text.search(/\'\u041E\u0442\u0440\u044F\u0434 /)!=-1){task_type_d=2;task_type_c=5}
if(mg_text.search(/- \u0437\u0430\u0433\u043E\u0432\u043E\u0440\u0449\u0438\u043A\u0438 \{\d+\}/)!=-1){task_type_c=6}
if(mg_text.search(/\u0441\u043E\u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C \u043E\u0434\u0438\u043D \u0438\u0437 \u043A\u0430\u0440\u0430\u0432\u0430\u043D\u043E\u0432/)!=-1||mg_text.search(/\u0442\u0430\u0439\u043D\u0435 \u044D\u0442\u043E \u043F\u043E\u0440\u0443\u0447\u0435\u043D\u0438\u0435/)!=-1){task_type_d=4}
if(mg_text.search(/\u0411\u043E\u043B\u044C\u0448\u0430\u044F \u0430\u0440\u043C\u0438\u044F \'/)!=-1||mg_text.search(/\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u043E\u0442\u0440\u044F\u0434 \'/)!=-1){task_type_d=5;task_type_c=4}

var cssStyle="th {font-size : 12}";
GM_addStyle(cssStyle);
lspan=document.createElement( 'span' );
lspan.style.cssFloat = "right";
mg_space.appendChild(lspan);
fspan=document.createElement( 'span' );
fspan.style.cssFloat = "left";
var facilities='<br><table border=1 cellpadding=2 cellspacing=0><tbody><tr align="center"><td></td><th width="90">\u0410\u0440\u043C\u0438\u0438</td><th width="90">\u0417\u0430\u0433\u043E\u0432\u043E\u0440\u0449\u0438\u043A\u0438</th><th width="90">\u0417\u0430\u0445\u0432\u0430\u0442\u0447\u0438\u043A\u0438</th><th width="90">\u041C\u043E\u043D\u0441\u0442\u0440\u044B</th><th width="90">\u041D\u0430\u0431\u0435\u0433\u0438</th><th width="90">\u041E\u0442\u0440\u044F\u0434\u044B</th><th width="90">\u0420\u0430\u0437\u0431\u043E\u0439\u043D\u0438\u043A\u0438</th></tr><tr align="center" '+(sector==1 ? ' bgcolor="#ddddee" ' : '' )+'><td align="left">East River</td><td><b>24%</b></td><td>7%</td><td>7%</td><td><b>24%</b></td><td>7%</td><td><b>24</b>%</td><td>7%</td></tr><tr align="center"'+(sector==2 ? ' bgcolor="#ddddee" ' : '' )+'><td align="left">Peaceful Camp</td><td><b>24%</b></td><td>7%</td><td><b>24%</b></td><td>7%</td><td><b>24%</b></td><td>7%</td><td>7%</td></tr><tr align="center"'+(sector==3 ? ' bgcolor="#ddddee" ' : '' )+'><td align="left">Fairy Trees</td><td>7%</td><td><b>24%</b></td><td>7%</td><td>7%</td><td>7%</td><td><b>24%</b></td><td><b>24%</b></td></tr><tr align="center" '+(sector==4 ? ' bgcolor="#ddddee" ' : '' )+'><td align="left">Fishing Village</td><td><b>24%</b></td><td>7%</td><td>7%</td><td><b>24%</b></td><td>7%</td><td><b>24%</b></td><td>7%</td></tr></tbody></table><br>';
fspan.innerHTML=facilities;

if(task_type_d){
	a1 =  document.createElement( 'a' );
	a1.href=description_link+task_type_d;
	a1.target='_blank';
	a1.innerHTML="<b>\u0434\u0435\u0442\u0430\u043B\u0438 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432</b>";
	lspan.appendChild(a1);
}

if(task_type_d&&task_type_c){lspan.appendChild(document.createTextNode( ' | ' ));}

if(task_type_c){
a2 =  document.createElement( 'a' );
a2.href=collection_link+task_type_c;
a2.target='_blank';
a2.innerHTML="<b>\u043F\u0440\u0438\u043C\u0435\u0440\u044B \u0431\u043E\u0451\u0432</b>";
lspan.appendChild(a2);
}

mg_space.insertBefore(fspan,mg_space.childNodes[1]);
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
