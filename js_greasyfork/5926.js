// ==UserScript==
// @name       test 
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match       https://www.mturkcontent.com/dynamic/hit*
// @match       https://backend.ibotta.com/*
// @match       https://www.mturk.com/mturk*
// @match       https://www.mturk.com/mturk/submit
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5926/test.user.js
// @updateURL https://update.greasyfork.org/scripts/5926/test.meta.js
// ==/UserScript==


$(window).keyup(function (e) {
	var key = (e.keyCode ? e.keyCode : e.which);
	switch (key) {
		case 49:
		$('input:radio[value="1"]').eq(0).attr('checked',true);
			break;
			case 49:
			$('input:radio[value="1"]').eq(0).attr('checked',true);
			break;
	}
});

$(window).keyup(function (e) {
	var key = (e.keyCode ? e.keyCode : e.which);
	switch (key) {
		case 50:
		$('input:radio[value="2"]').eq(0).attr('checked',true);
			break;
			case 50:
			$('input:radio[value="2"]').eq(0).attr('checked',true);
			break;
	}
});

$(window).keyup(function (e) {
	var key = (e.keyCode ? e.keyCode : e.which);
	switch (key) {
		case 51:
		$('input:radio[value="3"]').eq(0).attr('checked',true);
			break;
			case 51:
			$('input:radio[value="3"]').eq(0).attr('checked',true);
			break;
	}
});

$(window).keyup(function (e) {
	var key = (e.keyCode ? e.keyCode : e.which);
	switch (key) {
		case 52:
		$('input:radio[value="4"]').eq(0).attr('checked',true);
			break;
			case 52:
			$('input:radio[value="4"]').eq(0).attr('checked',true);
			break;
	}
});

$(window).keyup(function (e) {
	var key = (e.keyCode ? e.keyCode : e.which);
	switch (key) {
		case 54:
		$('input:radio[value="5"]').eq(0).attr('checked',true);
			break;
			case 52:
			$('input:radio[value="5"]').eq(0).attr('checked',true);
			break;
	}
});
