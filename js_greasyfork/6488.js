// ==UserScript==
// @name         MTurkGrind Gender Reassignment
// @author       Kerek
// @namespace    Kerek
// @version      0.2x
// @description  Display your choice of custom note/title under specified members' usernames. Can be used for reminders of people's genders, or anything else.
// @include             http://www.mturkgrind.com/*
// @include             http://mturkgrind.com/*
// @require		http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/6488/MTurkGrind%20Gender%20Reassignment.user.js
// @updateURL https://update.greasyfork.org/scripts/6488/MTurkGrind%20Gender%20Reassignment.meta.js
// ==/UserScript==

// v0.2x, 2015-01-17: updates by clickhappier for MTG migration from vbulletin to xenforo

var users = {

ZinGy:"guy", 
Blue:"guy", 
TissueHime:"guy", 
Jaded:"girl",
electrolyte:"girl",
Skye:"girl",
jekjek:"guy", 
aveline:"girl",
kryssyy:"girl",
jml:"guy", 
Kerek:"guy", 
'J D':"guy",
AngryRobotsInc:"girl"

// etc. Be sure to capitalize the names appropriately. Names with spaces require single-quotes. No comma after the final user.

};

$('div.messageUserInfo').each(function(){
	var n = $(this).find('a.username').eq(0);
	if (users[n.text()])
		$(this).find('a.username').last().after('<p><i>' + users[n.text()] + '</i></p>');
});