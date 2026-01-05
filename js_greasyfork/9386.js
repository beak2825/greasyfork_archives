// ==UserScript==
// @name        Trustscan Easifier
// @author      PatPositron
// @namespace   https://positron.pw
// @description This allows you to quickly access a user's trustscan.
// @include     *hackforums.net/*
// @version     1.0.0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9386/Trustscan%20Easifier.user.js
// @updateURL https://update.greasyfork.org/scripts/9386/Trustscan%20Easifier.meta.js
// ==/UserScript==

$(function() {
	if (document.URL.indexOf("showthread.php") != -1) {
        addThreadButtons();
    }
	if (document.URL.indexOf("member.php?action=profile") != -1) {
        addProfileButtons();
    }
	if (document.URL.indexOf("private.php?action=read") != -1) {
		addPmButtons();
	}
});

function addThreadButtons() {
	var menu, uid;
	menu = $('div.author_buttons');
	
	for (i = 0; i < menu.length; i++) {
		console.log(menu[i].innerHTML);
		if (menu[i].innerHTML.indexOf('href="private.php?action=send&amp;uid=') != -1) {
			uid = menu[i].innerHTML.split('href="private.php?action=send&amp;uid=')[1].split('" class')[0];
			$(menu[i]).append('<a href="trustscan.php?uid=' + uid + '" class="bitButton" target="_blank" title="Go to this user\'s trustscan">Trustscan</a>');
		}
	}
}

function addProfileButtons() {
	var uid = document.URL.split('action=profile&uid=')[1];
	$($('td.thead')[0]).append(' [<a href="trustscan.php?uid=' + uid + '">Trustscan</a>]');
}

function addPmButtons() {
	var uid = $('.post_author .largetext a').attr('href').split('uid=')[1];
	$('div.author_buttons').append('<a href="trustscan.php?uid=' + uid + '" class="bitButton" target="_blank" title="Go to this user\'s trustscan">Trustscan</a>');
}