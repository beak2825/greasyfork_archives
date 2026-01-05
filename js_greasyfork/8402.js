// ==UserScript==
// @name           HWM warlog results
// @namespace      alex@kocharin.ru
// @description    Adds links to a warlog.php page and battle results
// @include        https://www.heroeswm.ru/pl_warlog.php?*
// @include        https://www.heroeswm.com/pl_warlog.php?*
// @include        https://rus.heroeswm.com/pl_warlog.php?*
// @include        https://*lordswm.com/pl_warlog.php*
// @grant GM_getValue
// @grant GM_setValue
// @version 0.0.1.20230906122812
// @downloadURL https://update.greasyfork.org/scripts/8402/HWM%20warlog%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/8402/HWM%20warlog%20results.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2008-2011 by Alex Kocharin <alex@kocharin.pp.ru>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *
 * Script itself:
 * http://hwm.kocharin.ru/gm/hwm_warlog_results/
 */

function addGlobalStyle(css) {
	var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);

}

function create_div(e, warid, links)
{	
	var newdiv = document.getElementById('bce_results');
	if (!newdiv) {
		newdiv = document.createElement('div');
		newdiv.setAttribute('id', 'bce_results');
		with (newdiv.style) {
			position = 'absolute';
			borderStyle = 'solid';
			borderColor = '#000000';
			borderWidth = '2px';
			padding = '0px';
			zIndex = '3';
		}
	}
	newdiv.style.left = e.pageX + 5;
	newdiv.style.top = e.pageY + 5;
	newdiv.style.display = 'block';
	newdiv.innerHTML = '<table cellspacing=4 cellpadding=0 bgcolor="#ddd9cd">'+
	'<tr>'+
	'<td align="left">Warid <b>'+warid+'</b>:</td>'+
	'<td align="center"><a class="wars" href="'+links[0]+'">&lt;&lt; begin</a></td>'+
	'<td align="center"><a class="wars" href="'+links[1]+'">#chat</a></td>'+
	'<td align="center"><a class="wars" href="'+links[2]+'">end &gt;&gt;</a></td>'+
	'<td align="right"><a href="#" id="close_div" onclick="var x=document.getElementById(\'bce_results\');x.parentNode.removeChild(x);return false;">[X]</a></td>'+
	'</tr>'+
	'<tr><td align="left" id="bce_results_hr" colspan="5"></td></tr>'+
	'<tr><td align="left" id="bce_results_cont" colspan="5"></td></tr>'+
	'</table>';
	document.body.appendChild(newdiv);
//	document.getElementById('close_div').onclick = function() {
//		newdiv.style.display = 'none';
//		return false;
//	}
	return newdiv;
}

function load_battle(url)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.overrideMimeType("text/plain; charset=UTF-8");
	xmlhttp.onreadystatechange = function() {
		parsebattle(xmlhttp);
	}
	xmlhttp.send(null);
}

function parsebattle(xmlhttp)
{
	var div = document.getElementById('bce_results_cont');
	if (xmlhttp.readyState != 4) return;
	if (xmlhttp.status != 200) {
		div.innerHTML = 'http error '+String(xmlhttp.status);
		return;
	}
	document.getElementById('bce_results_hr').innerHTML = '<hr>';
	var arr = xmlhttp.responseText.split(";/", 2);
	var pos = arr[0].indexOf('f<font size="18"><b>');
	if (pos == -1) {
		div.innerHTML = 'parse error';
		return;
	}
	var tmp = arr[0].substr(pos+1);
	var pos2 = tmp.indexOf('|#');
	div.innerHTML = tmp.substr(0, pos2).replace(/size="18"/g, '');
}

addGlobalStyle('a.wars { text-decoration: none; color:grey } a.wars:hover { color: black } ');

var _alla = document.getElementsByTagName('a');
var alla = [];
for(var i=0;i<_alla.length;i++) {
    if (_alla[i].innerHTML.match(/^\d{2}-\d{2}-\d{2} \d{2}:\d{2}/) || _alla[i].innerHTML.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
		alla.push(_alla[i]);
	}
}

for(var i=0;i<alla.length;i++) {
	var m;
	if (m = alla[i].href.match(/warlog\.php\?warid=(\d+)/)) {
		var myspan = document.createElement('span');


var newa = document.createElement('a');
var h1 = newa.href = alla[i].href.replace(/\?/, '?lt=-1&');
newa.innerHTML = '<';
newa.setAttribute('class', 'wars');
myspan.appendChild(newa);

var newa = document.createElement('a');
var h2 = newa.href = alla[i].href.replace(/warlog\.php/, 'battlechat.php');
newa.innerHTML = '#';
newa.setAttribute('class', 'wars');
myspan.appendChild(newa);

var newa = document.createElement('a');
var h3 = newa.href = alla[i].href;
newa.innerHTML = '>';
newa.setAttribute('class', 'wars');
myspan.appendChild(newa);
		
		alla[i].parentNode.insertBefore(myspan, alla[i]);
		alla[i].parentNode.insertBefore(document.createTextNode(' '), alla[i]);

		with({warid: m[1], links: [h1, h2, h3]}) {
			alla[i].addEventListener('click', function(e)
			{
				e.preventDefault();
				create_div(e, warid, links);
				load_battle(e.target.href.replace('warlog.php', 'battle.php').replace('?', '?lastturn=-2&'));
			}, false);
		}
	}
}
