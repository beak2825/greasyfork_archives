// (c) 2008-2010, xo4yxa
﻿// (c) 2014-2016, Ded Moroz
//
// ==UserScript==
// @name          hwmmapmove
// @namespace     ded_moroz
// @description   перемещение по карте в один клик без коня
// @version       3.0.4
// @homepage      https://greasyfork.org/users/7571-ded-moroz
// @include       http://www.heroeswm.ru/map.php*
// @include       http://www.lordswm.com/map.php*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6972/hwmmapmove.user.js
// @updateURL https://update.greasyfork.org/scripts/6972/hwmmapmove.meta.js
// ==/UserScript==

if (typeof GM_getValue != 'function')
{
	this.GM_getValue = function (key, def) {return localStorage[key] || def;};
	this.GM_setValue = function (key, value) {return localStorage[key] = value;};
	this.GM_deleteValue = function (key) {return delete localStorage[key];};
}

// get language based on domain
var eng = location.hostname.contains('lordswm');

// copyright banner
var coop = '<center style="font-size:10px;">&#169; <a href="mailto:ded_moroz@mail.com" style="font-size:10px;" target="_top">Ded Moroz</a> <a href="https://greasyfork.org/users/7571-ded-moroz" style="font-size:10px;">hwm map move</a> v. ' + GM_info.script.version + '. <span style="text-decoration:underline;cursor:pointer;font-weight:bold;" id="hwmmm_options">' + (eng ? 'Settings' : 'Настройки') + '</span></center>';

// current url
var url = 'http://' + location.hostname + '/';
// places with mercenary guild
var loc_merc = [2, 6, 16, 21];
var road = [];

// get player's nickname
var nick = document.querySelector("object > param[value*='heart.swf']").parentNode.querySelector("param[name='FlashVars']").value.split('|')[3];

// generate GM variables based on player's nickname
var GM_IS_MOVING = "hwm_map_move_is_moving_" + nick;
var GM_LOC_TO = "hwm_map_move_loc_to_" + nick;
var GM_LOC_RETURN = "hwm_map_move_loc_return_" + nick;
var GM_TRANSPORT = 'hwm_map_move_transport_' + nick;
var GM_CHECK_PATROL = 'hwm_map_move_check_patrol_' + nick;
var GM_CHECK_HUNT = 'hwm_map_move_check_hunt_' + nick;
var GM_CHECK_MERC = 'hwm_map_move_check_merc_' + nick;
var GM_CHECK_HIDE_MAP = 'hwm_map_move_check_hide_map_' + nick;
var GM_CHECK_VIEW_LOC = 'hwm_map_move_check_view_loc_' + nick;
	
/*
0 - cur place
1 - view place
2-10 - have move
11 - hunter's guild
12 - thief's guild
13 - mercenary guild
14 - loc from move (only move)
15 - last time move (only move)
16 - all time move (only move)
17 - have transport with complex path
18 - magic number for moving
19 - ?
20 - clan id
*/
var MapParams = {
	LOC_CURRENT : 0,
	LOC_VIEW : 1,
	LOC_MOVE_FIRST : 2,
	LOC_MOVE_LAST : 10,
	HUNT : 11,
	THIEF : 12,
	MERC : 13,
	LOC_FROM : 14,
	LAST_TIME : 15,
	COMPLEX_PATH : 17,
	MAGIC_NUMBER : 18
};

// find flash map params
var map_swf = document.querySelector("object[data*='map.swf']");
var map_url = map_swf.data;
var par = map_swf.querySelector("param[name='FlashVars']").value.split('=')[1].split(':');

// fix param 0
if (par[0].contains('*english*')) par[0] = par[MapPar0].split('*english*')[1];
if (par[0].contains('*')) par[0] = par[0].split('*')[1];

// hide map
if (GM_getValue(GM_CHECK_HIDE_MAP) == 1) map_swf.style.display = 'none';

// move up the tree to the parent table
var map_elem = map_swf.parentNode;
while (map_elem.cellSpacing != '1' || map_elem.tagName.toLowerCase() != 'table') map_elem = map_elem.parentNode;
// remove cell padding
map_elem.cellSpacing = '0';
// move to parent element to add sibling on it later
map_elem = map_elem.parentNode;

// locations and its explicit paths
var loc =
[
//     name,               row, col, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
	[], // 00
	[[ "Empire Capital",      2, 2], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 00, 00, 11, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00], // 01
	[[ "East River",          2, 3], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 00, 15, 15, 00, 00, 19, 19, 00, 00, 00, 00, 00], // 02
	[[ "Tiger's Lake",        1, 2], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 15, 15, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00], // 03
	[[ "Rogue's Wood",        1, 3], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 15, 15, 00, 00, 00, 19, 19, 00, 00, 00, 00, 00], // 04
	[[ "Wolf's Dale",         3, 2], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 00, 00, 11, 00, 10, 10, 10, 10, 00, 00, 00, 00, 00], // 05
	[[ "Peaceful Camp",       0, 2], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00], // 06
	[[ "Lizard's Lowland",    3, 1], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 00, 00, 11, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00], // 07
	[[ "Green Wood",          2, 1], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 00, 00, 11, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00], // 08
	[[ "Eagle's Nest",        0, 1], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 09
	[[ "Portal's ruins",      4, 2]                                                                                                            ], // 10
	[[ "Dragon's Caves",      3, 3], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 19, 19, 00, 00, 00, 00, 00], // 11
	[[ "Shining Spring",      1, 1], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 15, 15, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 12
	[[ "Sunny City",          1, 0], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 15, 15, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 13
	[[ "Magma Mines",         2, 4], 11, 15, 15, 15, 00, 15, 00, 11, 15, 00, 00, 15, 15, 00, 00, 00, 00, 15, 00, 00, 11, 11, 15, 15, 00, 00, 11], // 14
	[[ "Bear' Mountain",      1, 4]                                                                                                            ], // 15
	[[ "Fairy Trees",         0, 4], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 00, 00, 00, 00, 00, 15, 15, 00, 00, 15, 15, 00, 15, 15], // 16
	[[ "Harbor City",         2, 5], 00, 15, 00, 00, 14, 00, 14, 00, 00, 14, 14, 00, 00, 00, 00, 00, 00, 00, 14, 14, 14, 14, 00, 00, 00, 14, 00], // 17
	[[ "Mythril Coast",       1, 5], 15, 15, 00, 00, 15, 15, 15, 15, 15, 15, 15, 00, 00, 15, 00, 00, 00, 00, 15, 15, 15, 15, 15, 15, 00, 15, 15], // 18
	[[ "Great Wall",          4, 3], 11, 00, 11, 00, 11, 11, 10, 11, 11, 00, 00, 11, 11, 11, 11, 11, 11, 11, 00, 00, 00, 00, 11, 00, 00, 00, 10], // 19
	[[ "Titans' Valley",      5, 3], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 11, 11, 11, 11, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 20
	[[ "Fishing village",     5, 4], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 11, 11, 11, 11, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 21
	[[ "Kingdom Castle",      6, 4], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 11, 11, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 22
	[[ "Ungovernable Steppe", 0, 0], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00], // 23
	[[ "Crystal Garden",      0, 3], 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 15, 00, 00, 00, 00, 19, 19, 00, 00, 00, 00, 00], // 24
	[], // 25
	[[ "The Wilderness",      4, 1], 00, 00, 00, 00, 00, 00, 05, 05, 05, 00, 00, 05, 05, 00, 00, 00, 00, 00, 00, 10, 10, 10, 05, 00, 00, 00, 05], // 26
	[[ "Sublime Arbor",       2, 0]                                                                                                            ], // 27
];

// choose the right transport
var transp = GM_getValue(GM_TRANSPORT, 0);
if (par[MapParams.COMPLEX_PATH] == '')
{
	// when moving COMPLEX_PATH is empty, so retrieve last saved
	par[MapParams.COMPLEX_PATH] = transp >= 3 ? 1 : 0;
}
else if (par[MapParams.COMPLEX_PATH] == 0)
{
	if (transp >= 3)
	{
		// set default simple transport
		GM_setValue(GM_TRANSPORT, 0);
		transp = 0;
	}
}
else
{
	if (transp < 3)
	{
		// set default advanced transport
		GM_setValue(GM_TRANSPORT, 3);
		transp = 3;
	}
}

// map as 2D grid
var map_square = 
[
//    0   1   2   3   4   5
	[23, 09, 06, 24, 16, 00], // 0
	[13, 12, 03, 04, 15, 18], // 1
	[27, 08, 01, 02, 14, 17], // 2
	[00, 07, 05, 11, 00, 00], // 3
	[00, 26, 10, 19, 00, 00], // 4
	[00, 00, 00, 20, 21, 00], // 5
	[00, 00, 00, 00, 22, 00]  // 6
];

// generate html code for the map
var map_html = "";
for (i = 0; i < map_square.length; i++)
{
	map_html += '<tr>';
	for (j = 0; j < map_square[i].length; j++)
	{
		map_html += '<td>';
		if (map_square[i][j] != 0) map_html += '<div id="loc_' + map_square[i][j] + '"></div>';
	}
}

if (par[MapParams.COMPLEX_PATH] == 0 && GM_getValue(GM_IS_MOVING) == 1)
{
	// continue moving along the complex path
	move(parseInt(par[MapParams.LOC_CURRENT]), GM_getValue(GM_LOC_TO), false);
}
else
{
	init();
}

function init()
{
	// find out where to return
	loc_return = GM_getValue(GM_LOC_RETURN);
	loc_return = GM_getValue(GM_CHECK_PATROL) == 1 ? loc_return : 0;

	if (par[MapParams.LOC_FROM] != 0)
	{
		// currently moving, just update the destination info
		
		dst = GM_getValue(GM_LOC_TO);
		
		// create div and set its info text
		div	= document.createElement('div');
		div_text = '<br><table><tr><td>' + (eng ? 'Moving to:' : 'Перемещение в:') + '<td><b>' + loc[par[MapParams.LOC_CURRENT]][0][0] + 
			'</b><tr><td>' + (eng ? 'Destination:' : 'Пункт назначения:') + '<td><div id="hint_move"><b>' +
			loc[dst][0][0] + (loc_return > 0 ? ' —> ' + loc[loc_return][0][0] : '') + '</b>';
		
		// cancellation possible only if not arriving to destination
		if (loc_return > 0 || (par[MapParams.LOC_CURRENT] != dst && par[MapParams.COMPLEX_PATH] == 0))
		{
			div_text += ' [<a href="javascript: void(0)" id="a_stop_move">' + (eng ? 'cancel' : 'отмена') + '</a>]';
		}
		
		// assign text to div
		div_text += '</div></table><br>' + coop;
		div.innerHTML = div_text;
		
		// append div to the DOM tree
		map_elem.appendChild(div);

		// cancellation possible only if not arriving to destination
		if (loc_return > 0 || (par[MapParams.LOC_CURRENT] != dst && par[MapParams.COMPLEX_PATH] == 0))
		{
			$('a_stop_move').addEventListener("click", function(){
				stop();
				$('hint_move').innerHTML = '<b>' + loc[par[MapParams.LOC_CURRENT]][0][0] + '</b>';
			}, false);
		}
		
		// setup callback for settings
		$("hwmmm_options").addEventListener("click", settings_open, false);
		
		// update countdown time in window title
		update_time(new Date().getTime(), document.title);
	}
	else
	{
		// currently not moving

		// insert map into DOM
		div = document.createElement('div');
		div.innerHTML = '<br><table>' + map_html + '</table><br>' + coop + '<br>';
		map_elem.appendChild(div);
	
		// setup callback for settings
		$("hwmmm_options").addEventListener("click", settings_open, false);

		// create a grid of map locations with the moving links
		for (l = 1; l < loc.length; l++)
		{
			var d = $('loc_' + l);
			
			// skip non-existing locations
			if (d == null) continue;
			
			d.parentNode.style.textAlign = 'center';
			d.style.padding = '1px 3px';
			d.style.fontSize = '11px';
			d.parentNode.style.border = par[MapParams.LOC_VIEW] == l ? '1px solid #00f' : '1px solid #abc';

			if (l == par[MapParams.LOC_CURRENT])
			{
				// current location
				d.style.fontWeight = 'bold';
				d.parentNode.style.backgroundColor = 'FFF8DC';
				if (l == par[MapParams.MERC]) d.style.color = 'FF0000';
				d.innerHTML = loc[l][0][0];
			}
			else
			{
				// not current location
				
				// create a link and set attributes
				a = document.createElement('a');
				a.style.fontSize = '11px';
				a.innerHTML = loc[l][0][0];
				a.setAttribute('tz', l);
				a.id = "a" + l;
				
				// highlight locations with mercenaries' guild
				if (l == par[MapParams.MERC]) a.style.color = 'FF0000';
				
				a.href = 'javascript: void(0)';
				a.addEventListener("click", setMXY, false);
				a.addEventListener("mouseover", viewPath, false);
				a.addEventListener("mouseout", hidePath, false);

				d.appendChild(a);
			}

			// highlight locations with mercenaries' guild
			if (par[MapParams.MERC] == -1 && loc_merc.indexOf(l) != -1)
			{		
				b = document.createElement('b');
				b.style.color = '#00F';
				b.innerHTML = ' X';
				d.appendChild(b);
			}

			// view sector
			if (GM_getValue(GM_CHECK_VIEW_LOC) == 1 && par[MapParams.LOC_VIEW] != l)
			{
				a = document.createElement('a');
				a.href = url + 'map.php?cx=' + (48 + loc[l][0][2]) + '&cy=' + (48 + loc[l][0][1]);
				a.style.display = 'block';
				a.style.width = '100%';
				a.title = (eng ? 'View sector ' : 'Осмотреть сектор ') + loc[l][0][0];
				vi = document.createElement('img');
				vi.src = "data:image/gif,GIF89a%10%00%10%00%D5%00%00B%40B%15%15%18((-PPUzz%7FHHJ%5D%5D_--.zz%7BWWX23%3BEHS%80%88%A2rx%8C%DA%DD%E7bj%80sx%87%88%8C%97%7D%85%98HO_%7D%85%97%88%8C%95psz%DC%DD%DF%D4%D5%D7x%7F%8C%2B-0%C2%DF%FF%DF%F4%FFMOPmop%EF%F1%F2%E7%F9%FF%EA%FD%FF%E7%FF%FF%13%15%15%E9%FF%FF%18%1A%1A%FA%FF%FFmoo%FC%FF%FF%FD%FF%FFZ%5B%5B%5D%5D%5B%40%3F%3F%FF%FF%FF%16%16%16%10%10%10%05%05%05%00%00%00%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%002%00%2C%00%00%00%00%10%00%10%00%00%06%5C%40%99pH%2C%12%13%01%8D%80e%24%02ZP%A8%A2)k%C8%A2%D1As%01Ma'%CDF%D4%14%7D4!-%94%A8%95%BAJ%9A%07P%8B%E4mm%2C%D4H(%CA%A9%AC%A82%05%19%0C%14%041*%17%80E0%1D%18%8AD%2F%06%89%8FB%25'%1F%94B.%08-%992%23%1E%9ECA%00%3B";
				vi.style.border = '0px';
				a.appendChild(vi);
				d.parentNode.appendChild(a);
			}
		}

		// report completed mercenaries' task if needed
		if (par[MapParams.MERC] == -1 && loc_merc.indexOf(parseInt(par[MapParams.LOC_CURRENT])) != -1 && GM_getValue(GM_CHECK_MERC) == 1)
		{
			window.location.href = url + 'mercenary_guild.php';
			return;
		}
		
		// dont move futher if there is a hunt
		if (par[MapParams.HUNT] != '' && GM_getValue(GM_CHECK_HUNT) == 1) return;
		
		// return if patrolling
		if (loc_return > 0)	$("a" + loc_return).click();
	}
}

function update_time(start, title)
{
	s = par[MapParams.LAST_TIME] - ~~((new Date().getTime() - start) / 1000);
	if (s < 0) return;
	m = ~~(s / 60);
	s = s % 60;

	if (s < 10)	s = "0" + s;
	if (m < 10)	m = "0" + m;

	document.title = " [" + m + ":" + s + "] " + title;
	setTimeout(function(){update_time(start, title);}, 1000);
}

function move(from, to, force_move)
{
	// exit early if currently moving
	if (par[MapParams.LOC_FROM] != 0) return init();
	
	// stop if arrived or hunt is available
	if (to == from || (par[MapParams.HUNT] != '' && GM_getValue(GM_CHECK_HUNT) == 1 && !force_move))
	{
		// arrived
		GM_setValue(GM_IS_MOVING, 0);
		return init();
	}
	
	// check if can move directly with advanced transport
	if (par[MapParams.COMPLEX_PATH] != 0)
	{
		location.href = url + 'move_sector.php?id=' + to;
		return;
	}

	// intercept wrong moves
	new_id = loc[from][to];
	if (new_id && new_id > 0) return move(from, new_id, force_move);

	A = loc[from][0];
	B = loc[to][0];

	row = B[1] > A[1] ? A[1] + 1 : (B[1] == A[1] ? A[1] : A[1] - 1);
	col = B[2] > A[2] ? A[2] + 1 : (B[2] == A[2] ? A[2] : A[2] - 1);
	
	go(map_square[row][col]);
}

var warned = false;
function go(to)
{
	// check if move is legal
	if (par.slice(MapParams.LOC_MOVE_FIRST, MapParams.LOC_MOVE_LAST + 1).indexOf(to.toString()) != -1)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: map_url,
			onload: function (response)
			{
				/* ! Map checks enabled by default. Do NOT change it unless you know what you are doing. */
				map_swf_passed = false;
				
				/* Flash-maps which generate links as below */
				maps = [
					[225734, '4d0a16069039ebfa54983d5a67b63559'],
					[225624, 'a7fea5be847c93117af571b1878de374'],
					[224528, '016d1a1e22b572ea81527e13ee2f351d'],
					[223231, '2aa1b10e23ef9cd5ae43d3b3621b99ce'],
					[226207, 'cd22402c2e3d288cb29f4cdbd91ef3be'],
					[223243, '649adb9305afcb90862e32f550fd1828'],
					[220039, 'b441f0ac541408a809ec907b54cc0060'],
				];
				
				new_size = response.responseText.length;
				new_hash = CryptoJS.MD5(response.responseText);
				for (i = 0; i < maps.length; i++)
				{
					if (new_size == maps[i][0] && new_hash == maps[i][1])
					{						
						map_swf_passed = true;
						break;
					}
				}
				
				if (map_swf_passed)
				{
					rand = ((par[MapParams.LOC_CURRENT] * 153 + to * 234) % 333 * 234 + par[MapParams.MAGIC_NUMBER] % 346234 - 142) % 10000 / 10000;
					location.href = url + 'move_sector.php?id=' + to + '&rand=' + rand;
					return;
				}
				else
				{
					console.log("New map size: " + response.responseText.length);
					console.log("New map hash: " + new_hash);
					
					if (!warned)
					{
						warn = document.createElement('div');
						warn.innerHTML += "<center style='font-size:10px;color:red;'>" +
							(eng ? "Flash-map has been changed, generation of links for moving currently disabled" :
							"Flash-карта была изменена, генерация ссылок для перемещения отключена") + "</center>";
						map_elem.appendChild(warn);
						
						warned = true;
					}
				}
				
				// reset path
				stop();
			}
		});
	}
	else
	{
		if (eng) alert('No direct way from "' + loc[par[MapParams.LOC_CURRENT]][0][0] + '" to "' + loc[to][0][0] + '"');
		else alert('Нет прямого пути из "' + loc[par[MapParams.LOC_CURRENT]][0][0] + '" в "' + loc[to][0][0] + '"');
		
		// reset path
		stop();
	}
}

function setMXY()
{
	// save where to return if patrolling
	if (GM_getValue(GM_CHECK_PATROL) == 1) GM_setValue(GM_LOC_RETURN, par[MapParams.LOC_CURRENT]);
	
	// save destination and start moving
	GM_setValue(GM_LOC_TO, this.getAttribute('tz'))
	GM_setValue(GM_IS_MOVING, 1);
	move(parseInt(par[MapParams.LOC_CURRENT]), GM_getValue(GM_LOC_TO), true);
}

function stop()
{
	// prevent following the path
	GM_setValue(GM_IS_MOVING, 0);
	// prevent returning
	GM_setValue(GM_LOC_RETURN, 0);
}

function setCheck()
{
	// switch checkbox state
	name = this.getAttribute('id');
	if (GM_getValue(name) && GM_getValue(name) == 1)
		GM_setValue(name, 0);
	else
		GM_setValue(name, 1);
}

function viewPath()
{
	to = this.getAttribute('tz');
	
	return path(par[MapParams.LOC_CURRENT], to);
	
	function path(from, to)
	{
		if (to == from) return;

		A = loc[from][0];
		B = loc[to][0];
		
		new_id = loc[from][to];
		if (new_id && new_id > 0) B = loc[new_id][0];
		
		drow = B[1] > A[1] ? 1 : (B[1] == A[1] ? 0 : -1);
		dcol = B[2] > A[2] ? 1 : (B[2] == A[2] ? 0 : -1);
		
		id = map_square[A[1] + drow][A[2] + dcol];

		td = $('loc_' + id)
		td.parentNode.style.backgroundColor = 'F0E68C';
		road[road.length] = id;
		
		return path(id, to);
	}
}

function hidePath()
{
	for (i = 0; i < road.length; i ++)
	{
		$('loc_' + road[i]).parentNode.style.backgroundColor = 'DDD9CD';
	}
	road = [];
}


function settings_close()
{
	bg = $('bgOverlay');
	bgc = $('bgCenter');
	if (bg) bg.style.display = bgc.style.display = 'none';
	
	// remove returning location
	if (GM_getValue(GM_CHECK_PATROL) != 1) GM_deleteValue(GM_LOC_RETURN);
	
	// show/hide map	
	if (GM_getValue(GM_CHECK_HIDE_MAP) == 1) map_swf.style.display = 'none';
	else map_swf.style.display = '';
}

function settings_open()
{
	bg = $('bgOverlay');
	bgc = $('bgCenter');
	if (!bg)
	{
		bg = document.createElement('div');
		bg.id = 'bgOverlay';
		document.body.appendChild(bg);
		bg.style.position = 'absolute';
		bg.style.left = '0';
		bg.style.width = '100%';
		bg.style.height = '100%';
		bg.style.background = "#000000";
		bg.style.opacity = "0.5";
		bg.style.zIndex = '99999';
		bg.addEventListener("click", settings_close, false);

		bgc = document.createElement('div');
		bgc.id = 'bgCenter';
		document.body.appendChild(bgc);
		bgc.style.position = 'absolute';
		bgc.style.width = '400px';
		bgc.style.background = "#F6F3EA";
		bgc.style.zIndex = bg.style.zIndex;
		bgc.style.left = ((document.body.offsetWidth - 400) / 2) + 'px';
	}
	
	if (eng)
	{
		var title = 'Settings';
		var check_patrol = 'patrolling mode';
		var check_hunt = 'stop on hunt';
		var check_merc = 'report Mercenaries\' guild tasks';
		var check_hide_map = 'hide flash-map';
		var check_view_loc = 'show buttons for viewing sectors';
	}
	else
	{
		var title = 'Настройки';
		var check_patrol = 'патрулирование';
		var check_hunt = 'останавливаться при охоте';
		var check_merc = 'сдавать задания Гильдии Наемников';
		var check_hide_map = 'не отображать flash-карту';
		var check_view_loc = 'отображать кнопки осмотра секторов';
	}

	bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close" title="Close">x</div><center><table><tr><td><b>' + title + '</b></td></tr><tr><td>' +
	'<div><label style="cursor:pointer;"><input type="checkbox" id="' + GM_CHECK_PATROL + '"> ' + check_patrol + '</label></div>' +
	'<div><label style="cursor:pointer;"><input type="checkbox" id="' + GM_CHECK_HUNT + '"> ' + check_hunt + '</label></div>' +
	'<div><label style="cursor:pointer;"><input type="checkbox" id="' + GM_CHECK_MERC + '"> ' + check_merc + '</label></div>' +
	'<div><label style="cursor:pointer;"><input type="checkbox" id="' + GM_CHECK_HIDE_MAP + '"> ' + check_hide_map + '</label></div>' +
	'<div><label style="cursor:pointer;"><input type="checkbox" id="' + GM_CHECK_VIEW_LOC + '"> ' + check_view_loc + '</label></div>' +
	'</table>';
	
	$("bt_close").addEventListener("click", settings_close, false);
	
	check_id = [GM_CHECK_PATROL, GM_CHECK_HUNT, GM_CHECK_MERC, GM_CHECK_HIDE_MAP, GM_CHECK_VIEW_LOC];
	for (i = 0; i < check_id.length; i++)
	{
		checkbox = $(check_id[i]);
		checkbox.checked = GM_getValue(check_id[i], 0) == 1 ? 'checked' : '';
		checkbox.addEventListener("click", setCheck, false);
	}

	bg.style.top = (-document.body.scrollTop) + 'px';
	bgc.style.top = (document.body.scrollTop + 150) + 'px';
	bg.style.display = 	bgc.style.display = 'block';
}

function $(id) { return document.getElementById(id); }

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for (var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if (j%4)for (var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if (65535<a.length)for (g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for (var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for (var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for (var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for (var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for (var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if (b){for (var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,
g)).finalize(a)}}});var k=m.algo={};return m}(Math);
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for (var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(g,k){for (var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for (b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);