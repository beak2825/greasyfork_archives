// ==UserScript==
// @name        KoL Character Page Skill Sorter
// @namespace   http://greasyfork.org
// @description Sort permed skills list on player character pages
// @include     http://127.0.0.1:*/showplayer.php*
// @include     http://localhost:*/showplayer.php*
// @include     http://www.kingdomofloathing.com/showplayer.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7489/KoL%20Character%20Page%20Skill%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/7489/KoL%20Character%20Page%20Skill%20Sorter.meta.js
// ==/UserScript==

var len = $("tr.pskill").length;

if ( len )
{
	var table = $("div#pskills table tbody");
	var endmarker = $("div#pskills table tr:last-child");
	var nodes = [];
	var keys = [];
	for ( var i = 0; i < len; i++)
	{
		keys.push([$("tr.pskill").eq(i).text(),i]);
		nodes.push($("tr.pskill").eq(i));
	}
	for ( var i = 0; i < len; i++)
	{
		table.append(nodes[keys.sort()[i][1]]);
	}
	table.append(endmarker);
}