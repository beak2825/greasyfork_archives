// ==UserScript==
// @name           hwm_clan_filter
// @author         Demin
// @namespace      Demin
// @description    Сортировка состава клана (by LazyGreg & Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.2
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/clan_info.php*
// @include        http://178.248.235.15/clan_info.php*
// @include        http://*lordswm.com/clan_info.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/8811/hwm_clan_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/8811/hwm_clan_filter.meta.js
// ==/UserScript==

// (c) 2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2009, LazyGreg

(function() {

var version = '1.2';


if (typeof GM_getValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}


var script_num = 8811;
var script_name = "hwm_clan_filter: Сортировка состава клана (by LazyGreg & Demin)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


var clan_online = document.querySelectorAll("img[src$='clans/online.gif']");
var clan_offline = document.querySelectorAll("img[src$='clans/offline.gif']");

if ( clan_offline[1] ) {
	var clan_table = clan_offline[1].parentNode;
} else if ( clan_online[1] ) {
	var clan_table = clan_online[1].parentNode;
}

if ( !clan_table ) return;
while ( clan_table.tagName != 'TABLE' ) { clan_table = clan_table.parentNode; }

var clanRowsNodes_arr = clan_table.childNodes[0].childNodes;
//alert("clan members = "+clanRowsNodes_arr.length);

//alert("my_node = "+clanRowsNodes_arr[0].childNodes[2].childNodes[3]);
//alert("my_node = "+clanRowsNodes_arr[0].childNodes[2].childNodes[5].innerHTML);

// tech: 1-bk,  3-name, 5 fract
// batl: 1-name, 3 fract

var sortTable_div = clan_table.cloneNode(false);
sortTable_div.innerHTML = "temp text, should not be seen";
clan_table.parentNode.insertBefore(sortTable_div, clan_table);

// sorting flags
var doSort1 = false;
var doSort2 = false; // status
var doSort_bk = false; //bk
var doSort_fr = false; //fraction
var doSort3 = false; // name
var doSort4 = false; // level
var doSort5 = false; // descr

var isBattleClan = ( clan_table.innerHTML.indexOf("clan_info.php")==-1 );

addSortTable();

// bk name fract descr Lv
// \u0411\u041A \u0418\u043C\u044F \u0424\u0440\u0430\u043A\u0446\u0438\u044F \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u041B\u0432

function addSortTable(){
	//var link_sort1 = '<a href="javascript:void(0);" id="clanTblSort1" style="background:'+(doSort1?"#6c6":"none")+';">[#]</a>';
	var link_sort1 = '#';
	var link_sort2 = '<a href="javascript:void(0);" id="clanTblSort2" style="background:'+(doSort2?"#6c6":"none")+';">C</a>';
	var link_sort_bk = '<a href="javascript:void(0);" id="clanTblSort_bk" style="background:'+(doSort_bk?"#6c6":"none")+';">[\u0411\u041A]</a>&nbsp;&nbsp;';
	link_sort_bk = isBattleClan? "" : link_sort_bk;
	var link_sort3 = '<a href="javascript:void(0);" id="clanTblSort3" style="background:'+(doSort3?"#6c6":"none")+';">[\u0418\u043C\u044F]</a>';
	var link_sort_fr = '&nbsp;&nbsp;<a href="javascript:void(0);" id="clanTblSort_fr" style="background:'+(doSort_fr?"#6c6":"none")+';">[\u0424\u0440\u0430\u043A\u0446]</a>';
	var link_sort4 = '<a href="javascript:void(0);" id="clanTblSort4" style="background:'+(doSort4?"#6c6":"none")+';">\u041B\u0432</a>';
	var link_sort5 = '<a href="javascript:void(0);" id="clanTblSort5" style="background:'+(doSort5?"#6c6":"none")+';">[\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435]</a>';

	var sortHeaders = '<tr>'+
	'<td class=wblight width=30><b>'+ link_sort1 +'</b></td>'+
	'<td class=wblight width=15><b>'+ link_sort2 +'</b></td>'+
	'<td class=wblight width=150><b>'+ link_sort_bk+ link_sort3 +link_sort_fr +'</b></td>'+
	'<td class=wblight width=10><b>'+ link_sort4 +'</b></td>'+
	'<td class=wblight><b>'+ link_sort5 +'</b></td>'+
	'</tr>';

	var sortedRows = getSortedRows();

	sortTable_div.innerHTML = '<table class=wb width="80%" cellpadding=3 align=center>'+ sortHeaders +sortedRows+ '</table>';

	//sortTable_div.innerHTML += "<hr width='50%'>";

	// add listeners
	//document.getElementById('clanTblSort1').addEventListener( "click", clanTblSort1 , false );
	document.getElementById('clanTblSort2').addEventListener( "click", clanTblSort2 , false );
	if(!isBattleClan){
	document.getElementById('clanTblSort_bk').addEventListener( "click", clanTblSort_bk , false );
	}
	document.getElementById('clanTblSort_fr').addEventListener( "click", clanTblSort_fr , false );
	document.getElementById('clanTblSort3').addEventListener( "click", clanTblSort3 , false );
	document.getElementById('clanTblSort4').addEventListener( "click", clanTblSort4 , false );
	document.getElementById('clanTblSort5').addEventListener( "click", clanTblSort5 , false );


	if(!doSort1 && !doSort2 && !doSort3 && !doSort_bk && !doSort_fr && !doSort4 & !doSort5){  // NO filters
		clan_table.style.display = "";
	}else{
		// hide default table
		clan_table.style.display = "none";
	}
}

function  getSortedRows(){ 
	//var rows_str = clanRows_arr[0].innerHTML ;
	var rows_str = "" ;
	if(!doSort1 && !doSort2 && !doSort3 && !doSort_bk && !doSort_fr && !doSort4 & !doSort5){ return rows_str; } // NO filters
	//
	var clanRowsStr_arr = [];
	for(var i=0; i<clanRowsNodes_arr.length; i++){
		clanRowsStr_arr.push( [i, clanRowsNodes_arr[i].innerHTML] );
	}
	//	
	//clanRowsStr_arr.reverse();	
	clanRowsStr_arr.sort(mySort4Clan);	
	//
	for(i=0; i<clanRowsStr_arr.length; i++){
		rows_str += "<tr>" +clanRowsStr_arr[i][1] +"</tr>";
	}
	
	return rows_str;
}

function  mySort4Clan(a,b){ 
	var ax, bx;
	var tn;
	var res = 0;
	// sort according to priority... from less to max
	// 1st - sort by num...
	ax = Number(clanRowsNodes_arr[a[0]].childNodes[0].innerHTML);
	bx = Number(clanRowsNodes_arr[b[0]].childNodes[0].innerHTML);
	res = (ax<bx)? -1 :(ax>bx)? 1 : 0;
	//
	if(doSort5){ //descr
		ax = clanRowsNodes_arr[a[0]].childNodes[4].innerHTML;
		bx = clanRowsNodes_arr[b[0]].childNodes[4].innerHTML;
		if(ax=="&nbsp;&nbsp;" && bx!="&nbsp;&nbsp;"){
			res = 1;
		}else if(ax!="&nbsp;&nbsp;" && bx=="&nbsp;&nbsp;"){
			res = -1;
		}else{
		res = (ax<bx)? -1 :(ax>bx)? 1 : res; 	
		}
	}
	//
	if(doSort_bk && !isBattleClan){ //BK
		ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[1].innerHTML;
		bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[1].innerHTML;
		res = (ax<bx)? -1 :(ax>bx)? 1 : res; 	
	}
	//
	if(doSort_fr ){ // fract
		tn = isBattleClan? 3: 5;
		if(isBattleClan || clanRowsNodes_arr[a[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
		ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[tn].title;
		}else{
		ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[3].title;
		}
		if(isBattleClan || clanRowsNodes_arr[b[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
		bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[tn].title;
		}else{
		bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[3].title;
		}
		res = (ax<bx)? -1 :(ax>bx)? 1 : res; 	
	}
	//
	if(doSort3 ){ //name
		tn = isBattleClan? 1: 3;
		if(isBattleClan || clanRowsNodes_arr[a[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
		ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[tn].innerHTML.toLowerCase();
		}else{
		ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[1].innerHTML.toLowerCase();
		}
		if(isBattleClan || clanRowsNodes_arr[b[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
		bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[tn].innerHTML.toLowerCase();
		}else{
		bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[1].innerHTML.toLowerCase();
		}
		res = (ax<bx)? -1 :(ax>bx)? 1 : res; 	
	}
	//
	if(doSort4){ //level descending
		ax = Number(clanRowsNodes_arr[a[0]].childNodes[3].innerHTML);
		bx = Number(clanRowsNodes_arr[b[0]].childNodes[3].innerHTML);
		res = (ax<bx)? 1 :(ax>bx)? -1 : res; 	
	}
	//
	if(doSort2){ //status
		ax = clanRowsNodes_arr[a[0]].childNodes[1].innerHTML;
		bx = clanRowsNodes_arr[b[0]].childNodes[1].innerHTML;
		if(ax.indexOf("i/clans/offline.gif")==-1 && bx.indexOf("i/clans/offline.gif")!=-1 ){
			res = -1;
		}else if(ax.indexOf("i/clans/offline.gif")!=-1 && bx.indexOf("i/clans/offline.gif")==-1 ){
			res = 1;
		}else { res = (ax<bx)? -1 :(ax>bx)? 1 : res; }	
	}
	//
	//
	return res;
}

// listeners
function  clanTblSort1(){ doSort1 = !doSort1;	addSortTable();	}
function  clanTblSort2(){ doSort2 = !doSort2;	addSortTable();	}
function  clanTblSort_bk(){ doSort_bk = !doSort_bk;	addSortTable();	}
function  clanTblSort_fr(){ doSort_fr = !doSort_fr;	addSortTable();	}
function  clanTblSort3(){ doSort3 = !doSort3;	addSortTable();	}
function  clanTblSort4(){ doSort4 = !doSort4;	addSortTable();	}
function  clanTblSort5(){ doSort5 = !doSort5;	addSortTable();	}

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
