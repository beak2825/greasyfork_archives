// ==UserScript==
// @name        SB/SV Thread-Starter Highlighter
// @namespace   http://userscripts.org:8080/users/196962
// @description This is a userscript which highlights subsequent posts by the thread-starter in the SpaceBattles and Sufficient Velocity forums. It also displays a short information at the top of each page if a post by the thread-starter can be found on the current page.
// @author      ElDani
// @version     1.0.5
// @license     Creative Commons BY-NC-SA
// @include     http*://forums.sufficientvelocity.com/threads/*
// @include     http://forums.spacebattles.com/threads/*
// @encoding    utf-8
// @grant       none
// @history     1.0.5 added HTTPS support for SV (thanks NuitTombee)
// @history     1.0.4 fixed small bug, where wrong posts could be highlighted due to error in partial user name matching
// @history     1.0.3 added support for SV FlexileSpace style
// @history     1.0.2 fixed bug, where posts by staff on SB would not be highlighted
// @history     1.0.1 added option to choose highlight color by active forum style
// @history     1.0 initial public version
// @downloadURL https://update.greasyfork.org/scripts/5946/SBSV%20Thread-Starter%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/5946/SBSV%20Thread-Starter%20Highlighter.meta.js
// ==/UserScript==

function LocalMain () {
	if (window.top != window.self) {
		//don't run on iFrames
		return;
	}

	var site = -1;
	if (document.URL.indexOf("spacebattles.com") > -1) site=0;
	if (document.URL.indexOf("sufficientvelocity.com") > -1) site=1;
	if (site == -1) return;
	
	var style;
	var rgxp_style = /<link.*?href="css.php\?css=xenforo,form,public&amp;style=(\d+)&amp;/i
	var match = rgxp_style.exec(document.documentElement.outerHTML);
	if (match != null) {
		style = match[1];
	} else {
		return;
	}
	
	var highlightColor = new Array();
	highlightColor[0] = new Array();
	highlightColor[0][2]  = "#152E18"; // SB: SpaceBattles.com
	highlightColor[0][4]  = "#152E18"; // SB: Flexile Dark Standalone
	highlightColor[0][6]  = "#F5F6CE"; // SB: XenForo Default Style
	highlightColor[1] = new Array();
	highlightColor[1][1]  = "#F5F6CE"; // SV: Default Style
	highlightColor[1][2]  = "#152E18"; // SV: Flexile Dark
	highlightColor[1][3]  = "#152E18"; // SV: Flexile Gold
	highlightColor[1][5]  = "#152E18"; // SV: Dark Wide
	highlightColor[1][6]  = "#152E18"; // SV: Gold Fixed
	highlightColor[1][7]  = "#424242"; // SV: Space
	highlightColor[1][11] = "#152E18"; // SV: FlexileSpace
	
	var starter;
	var rgxp_starter = /started by <a href="(.*?)" class="username".*?>(.*?)<\/a>/i
	var match = rgxp_starter.exec(document.documentElement.outerHTML);
	if (match != null) {
		starter = match[2];
	} else {
		return;
	}

	var messageList = document.getElementsByClassName("messageList");
	var messages = messageList[0].getElementsByTagName("LI");
	var nr_messages = messages.length;
	var username;
	var starter_posts = 0;
	for(var i=0; i<nr_messages; i++) {
		username = messages[i].getElementsByClassName("username");
		if(username[0] && (starter == username[0].innerHTML || username[0].innerHTML.indexOf('>'+starter+'<') > -1)) {
			messages[i].style.backgroundColor=highlightColor[site][style];
			messages[i].getElementsByClassName("primaryContent")[0].style.backgroundColor=highlightColor[site][style];
			if(messages[i].getElementsByClassName("secondaryContent").length>0) {
				messages[i].getElementsByClassName("secondaryContent")[0].style.backgroundColor=highlightColor[site][style];
			}
			starter_posts++;
		}
	}

	var add_html = document.getElementById("pageDescription").innerHTML;
	if(starter_posts>0) {
		add_html = add_html+" <strong>"+starter_posts+"</strong> post(s) by thread starter on this page!";
	} else {
		add_html = add_html+" No posts by thread starter on this page.";
	}
	document.getElementById("pageDescription").innerHTML = add_html;
}

window.addEventListener ("load", LocalMain, false);