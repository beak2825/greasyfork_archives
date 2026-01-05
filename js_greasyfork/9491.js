// ==UserScript==
// @name         Anime Lighter
// @namespace    horc.net
// @version      3.7.1
// @description  Filter for anime trackers [planning for many]
// @author       RandomClown @ HoRC
// @copyright    © 2015
// @homepage     http://git.horc.net
// @icon         https://bitbucket.org/horc/anime-lighter/raw/master/img/Logo.png
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @match        http://www.nyaa.se/*
// @match        http://horriblesubs.info
// @downloadURL https://update.greasyfork.org/scripts/9491/Anime%20Lighter.user.js
// @updateURL https://update.greasyfork.org/scripts/9491/Anime%20Lighter.meta.js
// ==/UserScript==

	var greasyfork = true;

// 
// 
//     Source code available: https://bitbucket.org/horc/anime-lighter/
// 
// 

/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="Class AnimeFilter.js" />
/// <reference path="Class LighterUI.js" />
/// <reference path="Class Run.js" />
/// <reference path="Class StoreUpdater.js" />
/// <reference path="Standard.js" />

var HORC_NAME = 'Anime Lighter Beta';



//    Wait for ready
new function () {
	var runonce = 0;

	function complete() {
		if (document.readyState === 'complete') {
			document.removeEventListener('DOMContentLoaded', complete, false);
			window.removeEventListener('load', complete, false);
			if (runonce++) return;
			setTimeout(ready);
		} else {
			document.addEventListener('DOMContentLoaded', complete, false);
			window.addEventListener('load', complete, false);
		}
	}
	complete();
}

//    Now ready
function ready() {
	new StoreUpdater('horc-animes', '1.0'); // <-- refrain from updating this one
	new StoreUpdater('horc-position', '1.1');
	new StoreUpdater('horc-style', '1.0');
	if (document.horc_updated) {
		location.reload(true);
		return;
	}















	run_animelighter();
}

//    Run main module
function run_animelighter() {
	//	Load site mod
	var mod = document.mod;

	delete document.readymods;
	console.log('	Host: ' + window.location.host);

	mod.createpositions();

	new MainUI(mod.style);

	new AnimeFilter(mod.filteroptions);

	mod.run();
}
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />


//    Get Anime - Generic
//    
//        Parse an episode text for the anime name
//        Works for most things
function default_getanime(jqe) {

	var str = jqe.text();

	return smartget(str);
}


////////////////////////////////////////
////    Useful Functions

function smartget(str) {


	//	Make it sane
	var str = trimws(str.replace(/_/g, ' ').replace(/\s\s+/g, ' '));

	if (!str.length) throw 'Expected a string';

	//	Get rid of leading subber
	if (-1 < str.charAt(0).search(/[\[\(\{]/)) str = trimws(consumetag(str));

	//	Get rid of next tag & beyond
	str = trimws(str.substr(0, str.search(/[\[\(\{]/)));

	//	Get rid of episode number[s] of format
	str = trimws(consumenumber(str));

	if (!str.length) throw 'Couldn\'t get the name';

	return str;
}

//    Consume Tag
//    
//        Gets rid of 1 tag: [subber], [1080p], [etc]
function consumetag(str) {


	var mode = false, done = false;
	var count = 0;
	var s = 0, e = 0;

	for (var i = 0; i < str.length; ++i) {
		if (done) break;
		switch (str.charAt(i)) {
			case '[':
			case '(':
			case '{':
				mode = true;
				count++;
				break;
			case ']':
			case ')':
			case '}':
				count--;
				if (mode && !count) done = true;
				break;
			default:
				break;
		}
		if (mode) e++;
		else s++, e++;
	}

	return str.substr(0, s) + str.substr(e);
}

//    Consume Number
//    
//        Gets rid of the episode number
function consumenumber(str) {


	//	Consumes numbers with a tack before
	function cnum_tack(str) {
		for (var s = 0; s < str.length ; ++s) {
			var hitnum = false;

			if (str.charAt(s) === '-' || str.charAt(s) === '‒') {
				var n = s + 1;

				//	Consume ws
				for (; n < str.length; ++n) if (!isws(str.charAt(n))) break;

				//	Consume number
				for (; n < str.length; ++n) {
					if (-1 < str.charAt(n).search(/\d/)) hitnum = true;
					break;
				}

				if (hitnum) {
					return str.substr(0, s);
				}
			}
		}
		return str;
	}

	//	Consumes numbers without a tack before
	function cnum_none(str) {
		var digits = 0;
		var i = 0;
		for (i = str.length - 1; 0 <= i; --i) {
			if (-1 < str.charAt(i).search(/\d/)) digits++;
			if (str.charAt(i).search(/\d/) === -1) break;
		}

		if (i === 0) return str; // reached the end

		if (1 < digits && isws(str.charAt(i))) return str.substr(0, i); // lone number & at least 2 digits

		return str; // some mixed number like: S2
	}

	str = cnum_tack(str);
	str = cnum_none(str);

	return str;
}

//    Trim Whitespace
//    
//        Gets rid of beginning & ending whitespace
function trimws(str) {


	var mode = false, done = false;
	var count = 0;
	var s = 0, e = 0;

	for (s = 0; s < str.length; ++s) {
		if (str.charAt(s) === ' ') continue;
		if (str.charAt(s) === '\t') continue;
		if (str.charAt(s) === '\r') continue;
		if (str.charAt(s) === '\n') continue;
		break;
	}
	for (e = str.length - 1; 0 <= e; --e) {
		if (str.charAt(e) === ' ') continue;
		if (str.charAt(e) === '\t') continue;
		if (str.charAt(e) === '\r') continue;
		if (str.charAt(e) === '\n') continue;
		break;
	}

	return str.substr(s, e - s + 1);
}

function isws(str) {
	for (var i = 0; i < str.length; ++i) if (!(str.charAt(i) === ' ' || str.charAt(i) === '\t' || str.charAt(i) === '\n' || str.charAt(i) === '\r' || str.charAt(i) === '　')) return false;
	return true;
}
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="_ Host All.js" />


if ('horriblesubs.info' === window.location.host) {
	var options = {};

	options.style = "/* Configuration for horriblesubs.info */\n\n.horc-sidebar {\n\tfont-size: 0.75em;\n\twidth: 10em;\n}\n\n\t.horc-sidebar:hover {\n\t\twidth: 44em;\n\t}\n\n\t.horc-sidebar #horc-mainui {\n\t\twidth: 40em;\n\t}\n\n.horc-ep-droppanel {\n\tfont-size: 1.5em;\n}\n\n\n\n/* Original episode list */\n\n.horc-episode-orig.watch {\n\tbackground-color: rgba(0, 255, 0, 0.25);\n}\n\n.horc-episode-orig.drop {\n\tcolor: rgba(0, 0, 0, 0.15);\n}\n\n.horc-episode-orig.hide {\n\tdisplay: none;\n\tvisibility: hidden;\n}\n\n.horc-episode-orig.dragging {\n\tfont-weight: bolder;\n}\n\n\n\n/* Main UI */\n\n#horc-statusbar {\n\tfont-size: 1.2em;\n\ttext-align: center;\n\tbackground-color: rgba(200,255,200, 0.9);\n\twidth: 100%;\n\tposition: fixed;\n\tpadding: 1em 0 1em 0;\n\tmargin: 0;\n\tleft: 0;\n\tbottom: 0;\n\tborder-radius: 1em;\n}\n\n\t#horc-statusbar > div {\n\t\tmargin: 0 1em 0 1em;\n\t}\n\n.horc-slot {\n\ttext-align: center;\n\twidth: 100%;\n}\n\n#horc-mainui {\n\ttext-align: center;\n\tbackground-color: rgba(230, 230, 230, 0.96);\n\tuser-select: none;\n}\n\n\t#horc-mainui > div {\n\t\tmargin: 1em 0;\n\t\tcursor: initial;\n\t\tuser-select: initial;\n\t}\n\n\t#horc-mainui h2 {\n\t\tcolor: #000000;\n\t\tpadding: 0.2em;\n\t\tmargin: 0;\n\t}\n\n.horc-sidebar {\n\tposition: absolute;\n\tright: 0;\n\toverflow: hidden;\n\tz-index: 1;\n\ttransition: all 0.4s;\n\topacity: 0.25;\n\t-webkit-filter: blur(2px);\n\t-moz-filter: blur(2px);\n\tfilter: blur(2px);\n}\n\n\t.horc-sidebar:hover {\n\t\topacity: 1;\n\t\t-webkit-filter: blur(0px);\n\t\t-moz-filter: blur(0px);\n\t\tfilter: blur(0px);\n\t}\n\n\t.horc-sidebar #horc-mainui {\n\t\tpadding: 2em;\n\t\tpadding-bottom: 0.5em;\n\t\tborder-radius: 2em;\n\t}\n\n\n\n/* Anime Filter */\n\n.horc-listhead {\n\tcursor: default;\n\tuser-select: none;\n}\n\n\t.horc-listhead.horc-listhead-hide {\n\t\tcolor: #888888 !important;\n\t}\n\n.horc-listcounter {\n\tfont-family: Arial;\n\tfont-weight: initial;\n\tmargin-right: -100%;\n\tfloat: left;\n}\n\n#horc-watchlist {\n\tbackground-color: rgba(0, 255, 0, 0.05);\n}\n\n\t#horc-watchlist > .horc-content {\n\t\tbackground-color: rgba(0, 255, 0, 0.1);\n\t}\n\n#horc-droplist {\n\tbackground-color: rgba(0, 0, 0, 0.05);\n}\n\n\t#horc-droplist > .horc-content {\n\t\tbackground-color: rgba(0, 0, 0, 0.1);\n\t}\n\n#horc-hidelist {\n\tbackground-color: rgba(255, 0, 0, 0.05);\n}\n\n\t#horc-hidelist > .horc-content {\n\t\tbackground-color: rgba(255, 0, 0, 0.1);\n\t}\n\n#horc-mainui .horc-episode-filter {\n}\n\n\t#horc-mainui .horc-episode-filter:not(:last-child) {\n\t\tborder-bottom: 0.2em solid rgba(255, 255, 255, 0.8);\n\t}\n\n\n\n/* Position Drag UI */\n\n.horc-posdrag-icon {\n\twidth: 4em;\n\theight: 6em;\n\tmargin-left: -1em;\n\tmargin-top: -1em;\n\tbackground-color: rgb(230, 230, 230);\n\tborder: 0.25em solid #ffffff;\n\tposition: fixed;\n\tz-index: 10;\n\tpointer-events: none;\n}\n\n.horc-slot .horc-ui-droppanel {\n}\n\n\t.horc-slot .horc-ui-droppanel .horc-circle {\n\t\tposition: absolute;\n\t\tdisplay: inline-block;\n\t\tz-index: 8;\n\t\twidth: 8em;\n\t\theight: 8em;\n\t\tmargin: -4em;\n\t\tpadding: 0;\n\t\tbackground: radial-gradient( rgba(100,100,255, 1.0), rgba(100,100,255, 0.8), rgba(100,100,255, 0.8), rgba(100,100,255, 0.8) );\n\t\tborder-radius: 50%;\n\t}\n\n\n\n/* Episode Drag UI */\n\n.horc-episode-icon {\n\tfont-family: Arial, Helvetica, sans-serif;\n\tcolor: #000000;\n\tfont-size: 1.2em;\n\tfont-weight: bold;\n\ttext-align: center;\n\tmax-width: 24em;\n\tmargin-left: -1em;\n\tmargin-top: -3em;\n\tpadding: 1em;\n\tbackground-color: rgb(230, 230, 255);\n\tborder: 0.25em solid #ffffff;\n\tborder-radius: 1em;\n\tposition: fixed;\n\tz-index: 10;\n\tpointer-events: none;\n}\n\n.horc-ep-droppanel {\n\tposition: absolute;\n\tmargin: -8em;\n\twidth: calc(16em);\n\theight: calc(16em);\n\tbackground: radial-gradient( rgba(200,200,255, 0.8), rgba(200,200,255, 0.4), rgba(200,200,255, 0.4), rgba(200,200,255, 0.8) );\n\tborder-radius: 50%;\n\tz-index: 3;\n}\n\n\t.horc-ep-droppanel .horc-circle {\n\t\tcolor: #000000;\n\t\ttext-align: center;\n\t\tpointer-events: initial;\n\t\tposition: absolute;\n\t\tdisplay: table;\n\t\tmargin: calc(4.5em * -0.5);\n\t\twidth: calc(4.5em);\n\t\theight: calc(4.5em);\n\t\tborder-radius: 50%;\n\t}\n\n\t\t.horc-ep-droppanel .horc-circle div {\n\t\t\tdisplay: table-cell;\n\t\t\tvertical-align: middle;\n\t\t\tuser-select: none;\n\t\t}\n\n#watchcircle {\n\tleft: 25%;\n\ttop: 25%;\n\tbackground-color: rgba(140,255,120, 0.75);\n}\n\n\t#watchcircle:hover {\n\t\tbackground-color: rgba(140,255,140, 1.0);\n\t}\n\n#dropcircle {\n\tright: 25%;\n\ttop: 25%;\n\tbackground-color: rgba(140,140,120, 0.75);\n}\n\n\t#dropcircle:hover {\n\t\tbackground-color: rgba(140,140,140, 1.0);\n\t}\n\n#hidecircle {\n\tleft: 25%;\n\tbottom: 25%;\n\tbackground-color: rgba(255,140,120, 0.75);\n}\n\n\t#hidecircle:hover {\n\t\tbackground-color: rgba(255,140,140, 1.0);\n\t}\n\n#clearcircle {\n\tright: 25%;\n\tbottom: 25%;\n\tbackground-color: rgba(255,255,255, 0.75);\n}\n\n\t#clearcircle:hover {\n\t\tbackground-color: rgba(255,255,255, 1.0);\n\t}\n\n\n\n/* Both Drag UI */\n\n.openhand {\n\tcursor: url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur) 8 4, move;\n}\n\n.closedhand {\n\tcursor: url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur) 8 4, move;\n}\n\n.draggable a, .draggable button {\n\tcursor: default;\n}\n\n.noselect {\n\t-webkit-touch-callout: none;\n\t-webkit-user-select: none;\n\t-khtml-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n";

	options.createpositions = function () { //	Create possible UI positions
		MainUI.create_sidebar($('<div>').insertBefore($('h2:contains("Releases")')), undefined, ['position', 'absolute', 'right', '4em', ]);
		MainUI.create_embed($('<div>').insertBefore($('h2:contains("Releases")')));
		MainUI.create_embed($('<div>').insertAfter($('.episodecontainer')));
		MainUI.create_embed($('<div>').prependTo($('#sidebar')));
		MainUI.create_embed($('<div class="horc-default">').insertAfter($('#text-16')));
		MainUI.create_embed($('<div>').insertAfter($('#text-8')));
		MainUI.create_embed($('<div>').appendTo($('#sidebar')));
	};

	options.filteroptions = {
		//	What contains the episode listing?
		epcontainer: '.episodecontainer',

		//	How to get an episode element?
		epselector: '.episodecontainer .episode',

		//	How to get anime name from an episode element?
		getanimename: default_getanime,

		//	How to grep episode container for an anime?
		epsearch: function (animename) {
			return $('.episodecontainer .episode').filter(':contains("' + animename + '")');
		},
	};

	options.run = function () {
		//	Find every way to update content
		function refresh(e) {


			var lastcount = 0;
			var timeout = 8000;
			var _check = setInterval(function () {
				var episodes = $('.episodecontainer .episode:not(.draggable)');

				if (lastcount != episodes.length) {
					lastcount = episodes.length;
					document.refreshfilters();
					timeout = 1000;
					return;
				} else if (0 < timeout) {
					timeout -= 50;
					return;
				}

				clearInterval(_check);


			}, 50);
		}

		function refresh_enter(e) { if (e.which == 13) refresh(); }
		function refresh_click(e) { refresh(); }
		$('.searchbar').on('keyup', refresh_enter);
		$('.refreshbutton').on('keyup', refresh_enter);
		$('.refreshbutton').on('mouseup', refresh_click);
		$('.morebox').on('keyup', '.morebutton, .searchmorebutton', refresh_enter);
		$('.morebox').on('mouseup', '.morebutton, .searchmorebutton', refresh_click);
	};

	document.mod = options;
}
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="_ Host All.js" />


if ('www.nyaa.se' === window.location.host) {
	var options = {};

	options.style = "/* Configuration for www.nyaa.se */\n\n.horc-sidebar {\n\twidth: 100px;\n\ttop: 280px;\n}\n\n\t.horc-sidebar:hover {\n\t\twidth: 44em;\n\t}\n\n\t.horc-sidebar #horc-mainui {\n\t\twidth: 40em;\n\t}\n\n#ddpanel {\n\tfont-size: 1.5em;\n}\n\n.horc-episode-orig:not(.watch):not(.drop):not(.hide) * {\n\tfont-weight: normal !important;\n}\n\n.horc-episode-orig.watch .tlistname {\n\tfont-weight: 800 !important;\n}\n\n.horc-episode-orig.drop {\n\topacity: 0.30;\n}\n\n\n\n/* Original episode list */\n\n.horc-episode-orig.watch {\n\tbackground-color: rgba(0, 255, 0, 0.25);\n}\n\n.horc-episode-orig.drop {\n\tcolor: rgba(0, 0, 0, 0.15);\n}\n\n.horc-episode-orig.hide {\n\tdisplay: none;\n\tvisibility: hidden;\n}\n\n.horc-episode-orig.dragging {\n\tfont-weight: bolder;\n}\n\n\n\n/* Main UI */\n\n#horc-statusbar {\n\tfont-size: 1.2em;\n\ttext-align: center;\n\tbackground-color: rgba(200,255,200, 0.9);\n\twidth: 100%;\n\tposition: fixed;\n\tpadding: 1em 0 1em 0;\n\tmargin: 0;\n\tleft: 0;\n\tbottom: 0;\n\tborder-radius: 1em;\n}\n\n\t#horc-statusbar > div {\n\t\tmargin: 0 1em 0 1em;\n\t}\n\n.horc-slot {\n\ttext-align: center;\n\twidth: 100%;\n}\n\n#horc-mainui {\n\ttext-align: center;\n\tbackground-color: rgba(230, 230, 230, 0.96);\n\tuser-select: none;\n}\n\n\t#horc-mainui > div {\n\t\tmargin: 1em 0;\n\t\tcursor: initial;\n\t\tuser-select: initial;\n\t}\n\n\t#horc-mainui h2 {\n\t\tcolor: #000000;\n\t\tpadding: 0.2em;\n\t\tmargin: 0;\n\t}\n\n.horc-sidebar {\n\tposition: absolute;\n\tright: 0;\n\toverflow: hidden;\n\tz-index: 1;\n\ttransition: all 0.4s;\n\topacity: 0.25;\n\t-webkit-filter: blur(2px);\n\t-moz-filter: blur(2px);\n\tfilter: blur(2px);\n}\n\n\t.horc-sidebar:hover {\n\t\topacity: 1;\n\t\t-webkit-filter: blur(0px);\n\t\t-moz-filter: blur(0px);\n\t\tfilter: blur(0px);\n\t}\n\n\t.horc-sidebar #horc-mainui {\n\t\tpadding: 2em;\n\t\tpadding-bottom: 0.5em;\n\t\tborder-radius: 2em;\n\t}\n\n\n\n/* Anime Filter */\n\n.horc-listhead {\n\tcursor: default;\n\tuser-select: none;\n}\n\n\t.horc-listhead.horc-listhead-hide {\n\t\tcolor: #888888 !important;\n\t}\n\n.horc-listcounter {\n\tfont-family: Arial;\n\tfont-weight: initial;\n\tmargin-right: -100%;\n\tfloat: left;\n}\n\n#horc-watchlist {\n\tbackground-color: rgba(0, 255, 0, 0.05);\n}\n\n\t#horc-watchlist > .horc-content {\n\t\tbackground-color: rgba(0, 255, 0, 0.1);\n\t}\n\n#horc-droplist {\n\tbackground-color: rgba(0, 0, 0, 0.05);\n}\n\n\t#horc-droplist > .horc-content {\n\t\tbackground-color: rgba(0, 0, 0, 0.1);\n\t}\n\n#horc-hidelist {\n\tbackground-color: rgba(255, 0, 0, 0.05);\n}\n\n\t#horc-hidelist > .horc-content {\n\t\tbackground-color: rgba(255, 0, 0, 0.1);\n\t}\n\n#horc-mainui .horc-episode-filter {\n}\n\n\t#horc-mainui .horc-episode-filter:not(:last-child) {\n\t\tborder-bottom: 0.2em solid rgba(255, 255, 255, 0.8);\n\t}\n\n\n\n/* Position Drag UI */\n\n.horc-posdrag-icon {\n\twidth: 4em;\n\theight: 6em;\n\tmargin-left: -1em;\n\tmargin-top: -1em;\n\tbackground-color: rgb(230, 230, 230);\n\tborder: 0.25em solid #ffffff;\n\tposition: fixed;\n\tz-index: 10;\n\tpointer-events: none;\n}\n\n.horc-slot .horc-ui-droppanel {\n}\n\n\t.horc-slot .horc-ui-droppanel .horc-circle {\n\t\tposition: absolute;\n\t\tdisplay: inline-block;\n\t\tz-index: 8;\n\t\twidth: 8em;\n\t\theight: 8em;\n\t\tmargin: -4em;\n\t\tpadding: 0;\n\t\tbackground: radial-gradient( rgba(100,100,255, 1.0), rgba(100,100,255, 0.8), rgba(100,100,255, 0.8), rgba(100,100,255, 0.8) );\n\t\tborder-radius: 50%;\n\t}\n\n\n\n/* Episode Drag UI */\n\n.horc-episode-icon {\n\tfont-family: Arial, Helvetica, sans-serif;\n\tcolor: #000000;\n\tfont-size: 1.2em;\n\tfont-weight: bold;\n\ttext-align: center;\n\tmax-width: 24em;\n\tmargin-left: -1em;\n\tmargin-top: -3em;\n\tpadding: 1em;\n\tbackground-color: rgb(230, 230, 255);\n\tborder: 0.25em solid #ffffff;\n\tborder-radius: 1em;\n\tposition: fixed;\n\tz-index: 10;\n\tpointer-events: none;\n}\n\n.horc-ep-droppanel {\n\tposition: absolute;\n\tmargin: -8em;\n\twidth: calc(16em);\n\theight: calc(16em);\n\tbackground: radial-gradient( rgba(200,200,255, 0.8), rgba(200,200,255, 0.4), rgba(200,200,255, 0.4), rgba(200,200,255, 0.8) );\n\tborder-radius: 50%;\n\tz-index: 3;\n}\n\n\t.horc-ep-droppanel .horc-circle {\n\t\tcolor: #000000;\n\t\ttext-align: center;\n\t\tpointer-events: initial;\n\t\tposition: absolute;\n\t\tdisplay: table;\n\t\tmargin: calc(4.5em * -0.5);\n\t\twidth: calc(4.5em);\n\t\theight: calc(4.5em);\n\t\tborder-radius: 50%;\n\t}\n\n\t\t.horc-ep-droppanel .horc-circle div {\n\t\t\tdisplay: table-cell;\n\t\t\tvertical-align: middle;\n\t\t\tuser-select: none;\n\t\t}\n\n#watchcircle {\n\tleft: 25%;\n\ttop: 25%;\n\tbackground-color: rgba(140,255,120, 0.75);\n}\n\n\t#watchcircle:hover {\n\t\tbackground-color: rgba(140,255,140, 1.0);\n\t}\n\n#dropcircle {\n\tright: 25%;\n\ttop: 25%;\n\tbackground-color: rgba(140,140,120, 0.75);\n}\n\n\t#dropcircle:hover {\n\t\tbackground-color: rgba(140,140,140, 1.0);\n\t}\n\n#hidecircle {\n\tleft: 25%;\n\tbottom: 25%;\n\tbackground-color: rgba(255,140,120, 0.75);\n}\n\n\t#hidecircle:hover {\n\t\tbackground-color: rgba(255,140,140, 1.0);\n\t}\n\n#clearcircle {\n\tright: 25%;\n\tbottom: 25%;\n\tbackground-color: rgba(255,255,255, 0.75);\n}\n\n\t#clearcircle:hover {\n\t\tbackground-color: rgba(255,255,255, 1.0);\n\t}\n\n\n\n/* Both Drag UI */\n\n.openhand {\n\tcursor: url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur) 8 4, move;\n}\n\n.closedhand {\n\tcursor: url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur) 8 4, move;\n}\n\n.draggable a, .draggable button {\n\tcursor: default;\n}\n\n.noselect {\n\t-webkit-touch-callout: none;\n\t-webkit-user-select: none;\n\t-khtml-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n";

	options.createpositions = function () { //	Create possible UI positions
		MainUI.create_sidebar($('<div>').insertBefore($('#main')), undefined, ['position', 'absolute', 'right', '4em', 'top', '20em']);
		MainUI.create_embed($('<div>').insertBefore($('#main .tlistsortorder')), ['width', '100%', 'text-align', 'center']);
		MainUI.create_embed($('<div class="horc-default">').insertAfter($('#main .torrentsubcatlist')), ['width', '100%', 'text-align', 'center']);
	};

	options.filteroptions = {
		//	What contains the episode listing?
		epcontainer: '.tlist',

		//	How to get an episode element?
		epselector: '.tlist .tlistrow',

		//	How to get anime name from an episode element?
		getanimename: default_getanime,

		//	How to grep episode container for an anime?
		epsearch: function (animename) {
			return $('.tlist .tlistrow').has('.tlistname:contains("' + animename + '")');
		},
	};

	options.run = function () {
	};

	document.mod = options;
}
//    String Compare Case-Sensitive
function strcmp(lhs, rhs) {
	for (var i = 0; i < lhs.length && i < rhs.length; ++i) {
		if (lhs[i] === rhs[i]) continue;
		return lhs[i] < rhs[i] ? -1 : 1;
	}
	if (lhs.length === rhs.length) return 0;
	return lhs.length < rhs.length ? -1 : 1;
}

//    String Compare Case-Insensitive
function strcmpi(lhs, rhs) {
	for (var i = 0; i < lhs.length && i < rhs.length; ++i) {
		if (lhs[i].toLowerCase() === rhs[i].toLowerCase()) continue;
		return lhs[i].toLowerCase() < rhs[i].toLowerCase() ? -1 : 1;
	}
	if (lhs.length === rhs.length) return 0;
	return lhs.length < rhs.length ? -1 : 1;
}


//    Binary Search Template
//    
//        In the options, method_options below, you can override the methods:
//            
//            int compare(element_to_find, element_in_container)
//                Expected return: -1, 0, 1
//                Determines if the element is less or greater than
//                Behavior should match this: http://www.cplusplus.com/reference/cstring/strcmp/
//            
//            int length(container)
//                Expected return: int
//                Redefines how to check the size of the container [default container.length]
//            
//            ElementType get(i, container)
//                Expected return: a type matching the parameters of compare(e0, e1)
//                Redefines how to access the container by some index
//            
//            * found(i, container)
//                Expected return: anything you require
//                Redefines what to return
//            
//            * notfound(i, container)
//                Expected return: anything you require
//                Redefines what to return when not found [default null]
//                This function is useful to ask "where to insert", since
//                    "i" represent the position to insert the new element, using splice:
//                    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
//    
//    Usage [2]: int, null binsearch(string_to_find, array_of_strings)
//    Usage [3]: custom binsearch(element_to_find, container_object, method_options)
function binsearch(element, container, options) {
	if (options === undefined) options = {
		compare: undefined,
		length: undefined,
		get: undefined,
		found: undefined,
		notfound: undefined,
	};

	var compare = options.compare;
	var length = options.length;
	var get = options.get;
	var found = options.found;
	var notfound = options.notfound;

	if (compare === undefined) compare = strcmpi;


	function default_len(container) { return container.length; }
	if (length === undefined) length = default_len;


	function default_arrget(i, container) { return container[i]; }
	if (get === undefined) get = default_arrget;


	function default_arrret(i, container) { return i; }
	if (found === undefined) found = default_arrret;


	function default_arrnotret(i, container) { return null; }
	if (notfound === undefined) notfound = default_arrnotret;



	if (!length(container)) return notfound(0, container);




	var begin = 0;
	var end = length(container) - 1;
	var mid = begin + (end - begin) / 2 | 0;
	while (true) {



		if (begin === end) {
			switch (compare(element, get(mid, container))) {
				case -1:
					return notfound(mid, container);
				case 0:
					return found(mid, container);
				case 1:
					return notfound(mid + 1, container);
			}
		}

		switch (compare(element, get(mid, container))) {
			case -1:
				end = mid;
				mid = begin + (end - begin) / 2 | 0;
				break;
			case 0:
				return found(mid, container);
			case 1:
				begin = mid + 1;
				mid = begin + (end - begin) / 2 | 0;
				break;
		}
	}
}
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="Algorithms.js" />
/// <reference path="Class Store.js" />


var FLAG_WATCH = 0;
var FLAG_DROP = 1;
var FLAG_HIDE = 2;
var ANIME_NAME = 0;
var ANIME_FLAG = 1;
var ANIME_DATE = 2;
var ANIME_EXPIRE = 3;


//    Anime Structure
//    
//    Holds information on an anime
//    
//    Member Data:
//        - name     | Name of the anime according to the tracker
//        - flag     | View flag
//        - date_y   | Date added
//        - date_m   |  ^
//        - date_d   |  ^
//        - expire_y | Date this will expire on [-1 for never]
//        - expire_m |  ^
//        - expire_d |  ^
//    
//    Member Functions:
//        - isgood         | Test if expired
//        - setexpirecours | Set the expiration date ## "anime network season" from today
//        - setexpireweeks | Set the expiration date ## weeks from today
//        - setexpiredays  | Set the expiration date ## days from today
//        - compress       | Compress the data for storage
//        - decompress     | Copies data from a compressed data array
//    
//    Usage [0]: new Anime()
//    Usage [1]: new Anime(anime_dataset)
var Anime = function (anime_dataset) {
	var thisanime = this;

	this.Anime = function (anime_dataset) {


		if (typeof anime_dataset === 'object') {
			thisanime.decompress(anime_dataset);
		} else {
			var d = new Date();
			thisanime.date_y = d.getFullYear();
			thisanime.date_m = d.getMonth() + 1;
			thisanime.date_d = d.getDate();
			delete d;
		}
	};

	this.isgood = function () {
		if (thisanime.expire_y === -1) return true;

		var diff = (new Date(thisanime.expire_y, thisanime.expire_m - 1, thisanime.expire_d - 1)) - (new Date(thisanime.date_y, thisanime.date_m - 1, thisanime.date_d));
		if (-1 < diff) return true;

		return false;
	};

	this.setexpiredays = function (amount) {
		var d = new Date();
		var e = new Date(d.getFullYear(), d.getMonth(), d.getDate() + amount);
		thisanime.expire_y = e.getFullYear();
		thisanime.expire_m = e.getMonth() + 1;
		thisanime.expire_d = e.getDate();
	};
	this.setexpireweeks = function (amount) {
		thisanime.setexpiredays(amount * 7);
	};
	this.setexpirecours = function (amount) {
		thisanime.setexpiredays(amount * 7 * 13);
	};


	this.compress = function () {
		var anime = [];

		anime[ANIME_NAME] = thisanime.name; // Name of anime
		anime[ANIME_FLAG] = thisanime.flag; // w d h

		anime[ANIME_DATE] = thisanime.date_y;
		anime[ANIME_DATE] = anime[ANIME_DATE] * 100 + thisanime.date_m;
		anime[ANIME_DATE] = anime[ANIME_DATE] * 100 + thisanime.date_d;

		if (thisanime.expire_y === -1) {
			anime[ANIME_EXPIRE] = -1;
		} else {
			anime[ANIME_EXPIRE] = thisanime.expire_y;
			anime[ANIME_EXPIRE] = anime[ANIME_EXPIRE] * 100 + thisanime.expire_m;
			anime[ANIME_EXPIRE] = anime[ANIME_EXPIRE] * 100 + thisanime.expire_d;
		}

		return anime;
	};

	this.decompress = function (anime_dataset) {
		thisanime.name = anime_dataset[ANIME_NAME]; // Name of anime_dataset
		thisanime.flag = anime_dataset[ANIME_FLAG]; // w d h

		var value = anime_dataset[ANIME_DATE];
		thisanime.date_d = Math.floor(value % 100);
		value /= 100;
		thisanime.date_m = Math.floor(value % 100);
		value /= 100;
		thisanime.date_y = Math.floor(value);

		var value = anime_dataset[ANIME_EXPIRE];
		if (value === -1) {
			thisanime.expire_y = thisanime.expire_m = thisanime.expire_d = -1;
		} else {
			thisanime.expire_d = Math.floor(value % 100);
			value /= 100;
			thisanime.expire_m = Math.floor(value % 100);
			value /= 100;
			thisanime.expire_y = Math.floor(value);
		}

		return thisanime;
	};


	this.name = ''; // Name of anime
	this.flag = -1; // w d h
	this.date_y = -1;
	this.date_m = -1;
	this.date_d = -1;
	this.expire_y = -1;
	this.expire_m = -1;
	this.expire_d = -1;


	this.Anime(anime_dataset);
};



//    Anime List Manager
//    
//    Holds information on an anime
//    
//    Public Methods
//        - get         | Get an anime entry; If not found, return the insertion index
//        - add         | Add an anime by Anime struct
//        - rm          | Set the expiration date ## weeks from today
//        - save        | Save data to storage
//        - load        | Reload data from storage
//    
//    Usage [0]: AnimeList()
var AnimeList = function () {
	var thisanimelist = this;

	var store = new function () {
		this.anime = new Store('horc-animes', [], 'object');
	};
	store.anime.list = [];


	this.AnimeList = function () {



		thisanimelist.load();
	};



	//    Add Anime
	//    
	//    Inserts the anime to the list & storage
	//    
	//    Usage [1]: add(Anime_structure)
	this.add = function (anime) {




		var find = thisanimelist.get(anime.name);
		if (typeof find === 'number') { // Not found
			store.anime.list.splice(find, 0, anime); // insert
		} else { // Found
			store.anime.list.splice(find[0], 1, anime); // replace
		}

		thisanimelist.save();
	};

	//    Remove Anime
	//    
	//    Remove the anime from the list & storage
	//    
	//    Usage [1]: rm(string_name)
	this.rm = function (name) {


		var find = thisanimelist.get(name);
		if (typeof find === 'number') { // Not found
		} else { // Found
			store.anime.list.splice(find[0], 1); // replace
		}

		thisanimelist.save();
	};

	//    Get Anime
	//    
	//    Return:
	//         If found, the array [ index, Anime structure ]
	//         If not found, the index at which to insert the anime
	//    
	//    Usage [1]: get(string_name)
	this.get = function (name) {


		return binsearch(name, store.anime.list, {
			get: function (i, container) { return container[i].name; },
			found: function (i, container) { return [i, container[i]]; },
			notfound: function (i, container) { return i; },
		});
	};

	//    Save Anime List
	//    
	//    Save the anime list to storage
	//    
	//    Usage [0]: save()
	this.save = function () {
		var compressed = $(store.anime.list).map(function (i, e) {
			return [e.compress()];
		});

		store.anime.set(compressed);
	};

	//    Load Anime List
	//    
	//    Reload the anime list from storage
	//    
	//    Note:
	//        This will also delete expired entries from storage.
	//    
	//    Usage [0]: load()
	this.load = function () {
		var deletions = false;

		store.anime.list = $(store.anime.get()).map(function (i, e) {
			var anime = new Anime(e);
			if (anime.isgood()) return anime;
			deletions = true;




		});

		if (deletions) thisanimelist.save();
	};



	this.AnimeList();
};
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="Class Anime.js" />
/// <reference path="Class Store.js" />
/// <reference path="Class Touch.js" />


//    AnimeFilter module
//    
//    Constructor takes the string selector for slots the UI may position itself in.
//    Events are listened to & fired in $(document)
//    
//    Events this will listen for:
//        - set-active         | Make the program interactable
//        - clear-active       | Make the program non-interactable
//        - set-ui-droppanel   | Open the MainUI position drop panel
//        - clear-ui-droppanel | Close the MainUI position drop panel
//        - set-ep-droppanel   | Open the episode list drop panel
//        - clear-ep-droppanel | Close the episode list drop panel
//        - update-animelist   | Update the anime list count
//    
//    Events this will trigger:
//        - 
//    
//    Options:
//        - 
//    
//    Note:
//        You are required to allocate at least 1 position as empty elements before constructing this.
var AnimeFilter = function (options) {
	var thisanimefilter = this;

	var animelist = null;


	this.AnimeFilter = function () {

		document.animelist = animelist = new AnimeList();








		//	Bind episodes now & add to document
		thisanimefilter.refreshfilters();
		document.refreshfilters = thisanimefilter.refreshfilters;

		firstbindtouch();
		$(document).on('update-animelist', updatelist);
		$(document).trigger('update-animelist');
	};



	function firstbindtouch() {
		//    Search an element, then it's parents for a selector
		function treehas(element, selector) {



			//	Check this
			var jqe = $(element).filter(selector);
			if (jqe.length) return $(element);

			//	Check parents
			var jqe = $(element).parents(selector);
			if (jqe.length) return jqe;

			return null;
		}
		function typeofelement(jqe) {
			if (jqe.hasClass('horc-episode-filter')) return 'fi'; // Episode Filter
			if (jqe.hasClass('horc-episode-orig')) return 'ep'; // Episode Original
			if (jqe.hasClass('horc-circle')) return 'ep'; // Episode Original
			if (jqe.hasClass('horc-slot')) return 'ui'; // UI
			if (jqe.hasClass('horc-ui')) return 'ui'; // UI
			return '';
		}
		function shouldreject(jqe) {
			return !!treehas(jqe, 'a,button,datalist,input,keygen,output,select,textarea');
		}

		var touch = new Touch();

		var container = $('body');
		container.on('mousedown', touch.mousedown);
		container.on('mousemove', touch.mousemove);
		container.on('mouseup', touch.mouseup);
		container.on('touchstart', touch.touchstart);
		container.on('touchmove', touch.touchmove);
		container.on('touchend', touch.touchend);

		touch.onstart = function (ids, changes, e) {



		};
		touch.onend = function (ids, changes, e) {



		};
		touch.ondragstart = function (ids, changes, e) {



			//	If requires control & pressing control don't match, cancel
			if (e.ctrlKey ^ document.store.requirectrl.get()) return;

			$(changes).map(function (i, changed) {
				if (id < -1) return; // ignore middle & right click
				var changed = e.originalEvent.changedTouches[i];
				var id = changed.identifier;

				if (shouldreject(changed.target)) return;

				//	Check if drag exists
				var jqedrag = treehas(changed.target, '.draggable');
				if (!jqedrag) return;

				//	Check type of drag & drop
				var typeofdrag = typeofelement(jqedrag);

				switch (typeofdrag) {
					case 'ep':
						var panel = $('.horc-ep-droppanel');
						if (!panel.is(':visible')) {
							panel.css('left', changed.pageX);
							panel.css('top', changed.pageY);
						}
						$(document).trigger('set-ep-droppanel')
						try {
							addepicon(id, options.getanimename(jqedrag));
						} catch (err) {
							setstatus('<br>Could\'t get the anime\'s name, please report this:<br>\n<span style="color: #800000;">' + jqedrag.text() + '</span>');
						}
						break;
					case 'fi':
						var panel = $('.horc-ep-droppanel');
						if (!panel.is(':visible')) {
							panel.css('left', changed.pageX);
							panel.css('top', changed.pageY);
						}
						$(document).trigger('set-ep-droppanel')
						addepicon(id, jqedrag.text());
						break;
					case 'ui':
						$(document).trigger('set-ui-droppanel')
						$('#horc-mainui').hide();
						adduiicon(id);
						break;


				}

				e.preventDefault();
			});
		};
		touch.ondragend = function (ids, changes, e) {



			$(changes).map(function (i, changed) {
				if (id < -1) return; // ignore middle & right click
				var changed = e.originalEvent.changedTouches[i];
				var id = changed.identifier;

				if (shouldreject(changed.target)) return;

				rmepicon(id);
				rmuiicon(id);

				//	Check if drag & drop both exists
				var jqedrag = treehas(changed.target, '.draggable');
				if (!jqedrag) return;
				var jqedrop = treehas(changed.targetnow, '.droppable');
				if (!jqedrop) $('#horc-mainui').show();
				if (!jqedrop) return;

				//	Check type of drag & drop
				var typeofdrag = typeofelement(jqedrag);
				var typeofdrop = typeofelement(jqedrop);

				switch (typeofdrag) {
					case 'ep':
						switch (typeofdrop) {
							case 'ep':
								try {
									filteranime(options.getanimename(jqedrag), jqedrop);
								} catch (err) {
									setstatus('<br>Could\'t get the anime\'s name, please report this:<br>\n<span style="color: #800000;">' + jqedrag.text() + '</span>');
								}
								break;
							case 'ui':

								break;


						}
						break;
					case 'fi':
						switch (typeofdrop) {
							case 'ep':
								filteranime(jqedrag.text(), jqedrop);
								break;
							case 'ui':

								break;


						}
						break;
					case 'ui':
						switch (typeofdrop) {
							case 'ep':

								break;
							case 'ui':
								$('.horc-slot').map(function (i, element) {
									if (jqedrop[0] === element) document.store.position.set(i);
								});

								$('#horc-mainui').appendTo(jqedrop.children('.horc-content')).show();


								break;


						}
						break;


				}

				e.preventDefault();
			});
		};
		touch.onmove = function (ids, changes, e) {



			$(changes).map(function (i, changed) {
				if (id < -1) return; // ignore middle & right click
				var id = changed.identifier;

				var icon = $('#horc-ep' + id + ',#horc-pos' + id);
				if (icon.length) {
					icon.css('left', changed.clientX);
					icon.css('top', changed.clientY);
					e.preventDefault();
				}
			});
		};
		touch.onfirst = function (ids, changes, e) {




			if (e.ctrlKey ^ document.store.requirectrl.get()) return;

			$('#horc-mainui,' + options.epcontainer).addClass('noselect');
		};
		touch.onlast = function (ids, changes, e) {



			$(document).trigger('clear-ep-droppanel');
			$(document).trigger('clear-ui-droppanel');

			$('#horc-mainui,' + options.epcontainer).removeClass('noselect');
		};
	}

	function updatelist() {
		$('#horc-mainui .horc-episode-filter').remove();

		var eps = $('.horc-episode-orig');
		eps.map(function (i, element) {
			var ep = $(element);
			var animename = '';
			try {
				animename = options.getanimename(ep);
			} catch (err) {
				return;
			}

			//	Check which filter this episode falls under
			var flag = -1;
			if (ep.hasClass('watch')) flag = FLAG_WATCH;
			else if (ep.hasClass('drop')) flag = FLAG_DROP;
			else if (ep.hasClass('hide')) flag = FLAG_HIDE;
			if (flag == -1) return;

			//	Construct the list selector
			var whichselector = '';
			switch (flag) {
				case FLAG_WATCH:
					whichselector = 'watch';
					break;
				case FLAG_DROP:
					whichselector = 'drop';
					break;
				case FLAG_HIDE:
					whichselector = 'hide';
					break;


			}

			//	Populate the filter lists, since they were cleared before this map

			//	Check if the list has the anime
			var list = $('#horc-' + whichselector + 'list .horc-content');
			var inlist = !!list.find('.horc-episode-filter').map(function (i, element) {
				var filter = $(element);
				var filtername = filter.text();
				if (filtername === animename) return filtername;
			}).length;

			//	Add it maybe
			if (!inlist) {
				var filter = $('<div class="horc-episode-filter draggable">');
				filter.text(animename);
				list.append(filter);
			}
		});
	}


	//    Rebind Episodes
	//    
	//        Rebinds the drag event to new episode elements
	//    
	//    Note:
	//        You will need to call this anytime episode lists are populated dynamically.
	this.refreshfilters = function () {
		$(options.epselector).filter(':not(.horc-episode-orig)').map(function (i, element) {
			var jqe = $(element);
			jqe.addClass('horc-episode-orig draggable');

			var animename = '';
			try {
				animename = options.getanimename(jqe);
			} catch (err) {
				return;
			}


			var search = animelist.get(animename);
			if (typeof search === 'number') { // Not yet marked
				return; // Dont highlight
			}

			var flag = search[1].flag;

			var whichselector = '';
			switch (flag) {
				case FLAG_WATCH:
					whichselector = 'watch';

					break;
				case FLAG_DROP:
					whichselector = 'drop';

					break;
				case FLAG_HIDE:
					whichselector = 'hide';

					break;


			}

			jqe.removeClass('watch drop hide');
			jqe.addClass(whichselector);
		});

		$(document).trigger('update-animelist');
	};


	function filteranime(animename, jqedrop) {
		//	Check which filter this episode falls under
		var flag = 0;
		if (jqedrop.filter('#clearcircle').length) flag = -1;
		else if (jqedrop.filter('#watchcircle').length) flag = FLAG_WATCH;
		else if (jqedrop.filter('#dropcircle').length) flag = FLAG_DROP;
		else if (jqedrop.filter('#hidecircle').length) flag = FLAG_HIDE;

		//	Construct the list selector
		var whichselector = '';
		switch (flag) {
			case FLAG_WATCH:
				whichselector = 'watch';

				break;
			case FLAG_DROP:
				whichselector = 'drop';

				break;
			case FLAG_HIDE:
				whichselector = 'hide';

				break;
			case -1:

				break;


		}


		if (flag === -1) { // Clear
			//	Remove highlight
			var eps = options.epsearch(animename);

			eps.removeClass('watch drop hide');

			//	Remove from list
			animelist.rm(animename);

			$(document).trigger('update-animelist');
			return;
		}

		///////////////////////
		//  Watch/Drop/Hide  //

		//	Re-highlight
		var eps = options.epsearch(animename);
		eps.removeClass('watch drop hide');
		eps.addClass(whichselector);

		var search = animelist.get(animename);
		if (typeof search === 'number') { // Not yet added
			var newanime = new Anime();

			//	Update
			newanime.name = animename;
			newanime.flag = flag;
			newanime.setexpirecours(2);

			//	Save
			animelist.add(newanime);
			animelist.save();
		} else { // Already there; update it
			if (search[1].flag !== flag) { // update the flag
				//	Update
				search[1].flag = flag;

				animelist.save();
			} // Else do nothing
		}


		$(document).trigger('update-animelist');
	}


	function addepicon(id, name) {



		rmepicon(id);

		//	Drag icon
		var icon = $('<div id="horc-ep' + id + '" class="horc-episode-icon">' + name + '</div>');
		$('body').append(icon);
	}
	function adduiicon(id) {


		rmuiicon(id);

		//	Drag icon
		var icon = $('<div id="horc-pos' + id + '" class="horc-posdrag-icon">');
		$('body').append(icon);
	}
	function rmepicon(id) {


		$('#horc-ep' + id).remove();
	}
	function rmuiicon(id) {


		$('#horc-pos' + id).remove();
	}


	var timer_statusbar = null;
	function setstatus(msg) {
		var statusbar = $('#horc-statusbar');
		var msgbox = statusbar.children();

		if (timer_statusbar === null) {
			msgbox.empty().append(msg);

			statusbar.show({ direction: 'down' }, 250);
			timer_statusbar = setTimeout(function () {
				statusbar.hide({ direction: 'down' }, 250);
			}, 10000);
		} else {
			clearTimeout(timer_statusbar);
			timer_statusbar = null;
			setstatus(msg);
		}
	}



	this.AnimeFilter();
};
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />
/// <reference path="Class Store.js" />


//    MainUI module
//    
//    Constructor takes the string selector for slots the UI may position itself in.
//    Events are listened to & fired in $(document)
//    
//    Events this will listen for:
//        - set-active          | Make the program interactable
//        - clear-active        | Make the program non-interactable
//        - set-ui-droppanel    | Open the MainUI position drop panel
//        - clear-ui-droppanel  | Close the MainUI position drop panel
//        - set-ep-droppanel    | Open the episode list drop panel
//        - clear-ep-droppanel  | Close the episode list drop panel
//        - update-animelist    | Update the anime list count
//    
//    Static methods to know of:
//        - MainUI.create_embed    | Creates an embedded position
//        - MainUI.create_sidebar  | Creates a position for a sidebar
//    
//    Note:
//        You are required to allocate at least 1 position as empty elements before constructing this.
//        Pass the string selector to your allocated positions.
var MainUI = function (default_css) {
	var thismainui = this;


	if (document.store == undefined) document.store = {};
	document.store.css = new Store('horc-style', default_css, 'string');
	document.store.handedness = new Store('horc-handedness', 1, 'number');
	document.store.position = new Store('horc-position', -1, 'number');
	document.store.requirectrl = new Store('horc-requirectrl', false, 'boolean');
	document.store.settings = new Store('horc-settings', false, 'boolean');
	document.store.updater = new Store('horc-updater', true, 'boolean');
	document.store.showwatch = new Store('horc-show-watch', true, 'boolean');
	document.store.showdrop = new Store('horc-show-drop', false, 'boolean');
	document.store.showhide = new Store('horc-show-hide', false, 'boolean');


	this.MainUI = function () {


		var slots = $('.horc-slot');
		if (slots.length === 0) throw 'No positions for the UI to take';



		//	Load CSS
		$('<style id="horc-css">').text(document.store.css.get()).appendTo($('head'));

		create_mainui();
		create_statusbar();
		create_epdragui();

		create_events();
	};



	//    Get Position Value [+1 overloads]
	//    
	//    Return [0]:
	//        Returns the position of the current selection
	//        The range is from including  -1 to number_of_slots
	//    
	//    Return [1]:
	//        Returns the position value passed in, but corrected for out of bounds
	//        The range is from including  -1 to number_of_slots
	//    
	//    Note:
	//        Use if you need to calculate a new position that might be out of bounds.
	//    
	//    Usage [0]: getpositionvalue()
	//    Usage [1]: getpositionvalue(position_value_to_test)
	function getpositionvalue(pos) {


		var len = $('.horc-slot').length;

		if (pos === undefined) pos = document.store.position.get();

		if (pos < -1) pos = -1;
		if (len <= pos) pos = len - 1;

		return pos;
	};

	//    Get Currently Selected Position
	//    
	//    Return:
	//        Returns the elements that is chosen to hold the UI
	//    
	//    Usage [0]: getposition()
	function getposition() {
		var slots = $('.horc-slot > .horc-content');
		var pos = getpositionvalue();
		if (pos === -1) { // Find default slot
			var defaultslot = slots.parent('.horc-default').children('.horc-content');
			if (defaultslot.length) {
				return $(defaultslot[0]);
			} else {
				return $(slots[0]);
			}
		}
		return $(slots[pos]);
	};


	//    Create Main UI
	function create_mainui() {
		if (0 < $('#horc-mainui').length) throw 'Stopped UserScript from loading again'; // when UserScript loads twice, cancel load

		//	Create main ui area
		var mainui = $('<div id="horc-mainui" class="horc-ui draggable">');
		getposition().append(mainui);


		//	Add title & logo
		var title = $('<h1>' + HORC_NAME + '</h1>');
		var logo = $('<img>');
		title.prepend(logo);
		logo.css('width', '2em');
		logo.css('height', '2em');
		logo.css('margin-right', '0.5em');
		logo.css('vertical-align', 'middle');
		logo.on('load', function () {
			setTimeout(function () {
				title.slideUp(250, function () {
					title.remove();
				});
			}, 5000);
		});
		logo.prop('src', 'https://bitbucket.org/horc/anime-lighter/raw/master/img/Logo.png');
		mainui.append(title);


		//	Updater
		var updater = $('<div>');
		updater.hide().appendTo(mainui);
		var url = $('<span>[<a href="https://openuserjs.org/scripts/RandomClown/Anime_Lighter">OpenUserJS</a>]</span>');

		function nothing(newversion) { console.log('New version available: v' + newversion); }
		function versionchecker(newversion) {
			updater.slideDown(250);
			setTimeout(function () {
				updater.slideUp(250, function () {
					updater.remove();
				});
			}, 10000);
		}

		if (greasyfork) {
			updater.text('May be out-dated. ');
			updater.append(url);

			document.versionchecker = nothing;

			versionchecker('0.0');
		} else {
			updater.text('New version available! ');
			updater.append(url);

			document.versionchecker = document.store.updater.get() ? versionchecker : nothing;
		}


		//	Create individual filter lists
		var watchlist = $('<div id="horc-watchlist">');
		var droplist = $('<div id="horc-droplist">');
		var hidelist = $('<div id="horc-hidelist">');
		mainui.append(watchlist);
		mainui.append(droplist);
		mainui.append(hidelist);


		//	List headers
		var watchhead = $('<h2 class="horc-listhead">Watch List</h2>');
		var drophead = $('<h2 class="horc-listhead">Drop List</h2>');
		var hidehead = $('<h2 class="horc-listhead">Hide List</h2>');
		watchlist.append(watchhead);
		droplist.append(drophead);
		hidelist.append(hidehead);
		if (!document.store.showwatch.get()) watchhead.addClass('horc-listhead-hide');
		if (!document.store.showdrop.get()) drophead.addClass('horc-listhead-hide');
		if (!document.store.showhide.get()) hidehead.addClass('horc-listhead-hide');

		var watchcontent = $('<div class="horc-content">');
		var dropcontent = $('<div class="horc-content">');
		var hidecontent = $('<div class="horc-content">');
		watchlist.append(watchcontent);
		droplist.append(dropcontent);
		hidelist.append(hidecontent);
		if (!document.store.showwatch.get()) watchcontent.hide();
		if (!document.store.showdrop.get()) dropcontent.hide();
		if (!document.store.showhide.get()) hidecontent.hide();

		watchhead.click(function () {
			if ($(this).prop('disabled')) return;

			watchcontent.slideToggle(250)
			watchhead.toggleClass('horc-listhead-hide');
			document.store.showwatch.set(!document.store.showwatch.get());
		});
		drophead.click(function () {
			if ($(this).prop('disabled')) return;

			dropcontent.slideToggle(250)
			drophead.toggleClass('horc-listhead-hide');
			document.store.showdrop.set(!document.store.showdrop.get());
		});
		hidehead.click(function () {
			if ($(this).prop('disabled')) return;

			hidecontent.slideToggle(250)
			hidehead.toggleClass('horc-listhead-hide');
			document.store.showhide.set(!document.store.showhide.get());
		});


		var watchcount = $('<span class="horc-listcounter">0</span>')
		var dropcount = $('<span class="horc-listcounter">0</span>')
		var hidecount = $('<span class="horc-listcounter">0</span>')
		watchhead.append(watchcount);
		drophead.append(dropcount);
		hidehead.append(hidecount);
		var delay = null;
		$('#horc-mainui').on('anime-update', function () {
			if (!delay) delay = setTimeout(function () {
				delay = null;

				watchcount.text(watchlist.find('.episode').length);
				dropcount.text(droplist.find('.episode').length);
				hidecount.text(hidelist.find('.episode').length);
			}, 100);
		});

		create_settings();
	}

	//    Create Settings
	//    
	//        This will only show if the "settings" flag in localStorage is set
	function create_settings() {
		var mainui = $('#horc-mainui');

		//	Create Settings button
		var settingsbutton = $('<button>Settings</button>');
		settingsbutton.click(function () {
			var settings = document.store.settings.get();
			document.store.settings.set(!settings);

			$('#horc-settings').slideToggle(200);
		});
		mainui.append(settingsbutton);


		//	Create settings area
		var settingui = $('<div id="horc-settings">');
		mainui.append(settingui);
		settingui.css('text-align', 'center');
		if (!document.store.settings.get()) $('#horc-settings').hide();


		//	Create ctrl mode button
		var ctrlmod = $('<input id="horc-ctrlmod" type="checkbox">')
		settingui.append(ctrlmod);
		settingui.append('Require &lt;ctrl&gt; modifier');
		ctrlmod.prop('checked', document.store.requirectrl.get())
		ctrlmod.on('change', function () {
			document.store.requirectrl.set($(ctrlmod).prop('checked'));
		});


		//	Create CSS Update button
		var cssupdate = $('<button>Update CSS</button>');
		cssupdate.css('float', 'left');
		cssupdate.click(function () {


			var css = $('#horc-cssbox').val();
			var stringified = JSON.stringify(css);

			//	update current CSS style
			document.store.css.set(css);
			$('#horc-css').text(css);

			try {
				StyleFix.styleElement($('#horc-css')[0]);
			} catch (err) {
				// Prefix Free doesnt exist
			}

			//	update css dev box
			$('#stringify').val(stringified);
		});


		//	Create Clear Storage button
		var clearstorage = $('<button>Clear Storage</button>');
		clearstorage.css('float', 'right');
		clearstorage.css('background-color', 'rgba(255, 0, 0, 0.4)');
		clearstorage.click(function () {
			localStorage.clear();
			window.location.reload(true);
		});


		//	Create CSS box
		var cssbox = $('<textarea id="horc-cssbox">');
		cssbox.css('width', '100%');
		cssbox.css('height', '10em');
		cssbox.val(document.store.css.get());
		$(document).on('keydown', '#horc-cssbox', function (e) {
			//	Detect save
			if ((e.which == '115' || e.which == '83') && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				cssupdate.trigger('click');
			}
		});


		//	Create Stringified box
		var stringbox = $('<textarea id="stringify">');
		stringbox.attr('disabled', 'true');
		stringbox.css('width', '100%');
		stringbox.css('height', '8em');
		stringbox.val(JSON.stringify(document.store.css.get()));


		//	Append CSS text editors
		settingui.append($('<br>'));
		settingui.append($('<br>'));

		settingui.append(clearstorage);
		settingui.append(cssupdate);
		settingui.append($('<div>Current CSS</div>'));
		settingui.append(cssbox);

		settingui.append($('<br>'));
		settingui.append($('<br>'));

		settingui.append($('<div>Stringified CSS</div>'));
		settingui.append(stringbox);
	}

	//    Create status bar
	function create_statusbar() {
		var statusbar = $('<div id="horc-statusbar"><div></div></div>').hide();
		$('body').append(statusbar);
	}

	//    Create Episode Drag & Drop UI
	function create_epdragui() {
		//	Find panel
		var ep_droppanel = $('<div class="horc-ep-droppanel">').hide();
		$('body').append(ep_droppanel);
		ep_droppanel.css('left', '10em');
		ep_droppanel.css('top', '30em');


		//	Create circles
		var watchcircle = $('<div id="watchcircle" class="horc-circle droppable"><div>Watch</div></div>');
		var dropcircle = $('<div id="dropcircle" class="horc-circle droppable"><div>Drop</div></div>');
		var hidecircle = $('<div id="hidecircle" class="horc-circle droppable"><div>Hide</div></div>');
		var clearcircle = $('<div id="clearcircle" class="horc-circle droppable"><div>Clear</div></div>');
		ep_droppanel.append(watchcircle);
		ep_droppanel.append(dropcircle);
		ep_droppanel.append(hidecircle);
		ep_droppanel.append(clearcircle);
	}


	//    Create Events
	function create_events() {
		//	Make the program interactable
		$(document).on('set-active', function (e) {
			$('#horc-mainui').find('.horc-listhead, .horc-filter-episode, button, input').prop('disabled', false);
		});
		$(document).on('clear-active', function (e) {
			$('#horc-mainui').find('.horc-listhead, .horc-filter-episode, button, input').prop('disabled', true)
		});

		//	Make the main UI disappear into a small dragged window
		//	Show the position drop panels
		$(document).on('set-ui-droppanel', function (e) {
			$('.horc-ui-droppanel').fadeIn(100);
			$('.horc-posdrag-icon').show();
			//$('.horc-ui-droppanel').find('.horc-circle')
		});
		$(document).on('clear-ui-droppanel', function (e) {
			$('.horc-ui-droppanel').fadeOut(100);
			$('.horc-posdrag-icon').hide();
		});

		//	Make a small box displaying an episode entry
		//	Show the anime drop panels
		$(document).on('set-ep-droppanel', function (e) {
			var panel = $('.horc-ep-droppanel');
			panel.fadeIn(100);
			$('.horc-episode-icon').show();

			//panel.css('left', document.prop.mousex + 'px');
			//panel.css('top', document.prop.mousey + 'px');
		});
		$(document).on('clear-ep-droppanel', function (e) {
			$('.horc-ep-droppanel').fadeOut(100);
			$('.horc-episode-icon').hide();
		});

		//	Update the counters on anime lists
		$(document).on('update-animelist', function (e) {
			//	Clear mainui anime list
			$('#horc-watchlist, #horc-droplist, #horc-hidelist').find('.horc-content').empty();

			//	Repopulate with the episode listing
			$('.horc-episode').map(function (i, element) {
				var jqe = $(element);

				console.warn('Repopulate Incomplete');
			});

			//	Count number of animes in list
			var eps = $('.horc-episode-orig');
			var watchcount = eps.filter('.watch').length;
			var dropcount = eps.filter('.drop').length;
			var hidecount = eps.filter('.hide').length;
			$('#horc-watchlist').find('.horc-listcounter').text(watchcount);
			$('#horc-droplist').find('.horc-listcounter').text(dropcount);
			$('#horc-hidelist').find('.horc-listcounter').text(hidecount);
		});
	}



	this.MainUI();
};

MainUI.create_embed = function (jqe, contentstyles, draguistyles) {
	jqe.empty().addClass('horc-slot droppable');


	var dragui = $('<div class="horc-ui-droppanel">').hide();
	dragui.append($('<div class="horc-circle">'));
	jqe.append(dragui);


	var content = $('<div class="horc-content horc-embed">');
	jqe.append(content);


	if (contentstyles) {
		for (var i = 0; i < contentstyles.length; i += 2) {
			content.css(contentstyles[i], contentstyles[i + 1]);;
		}
	}

	if (draguistyles) {
		for (var i = 0; i < draguistyles.length; i += 2) {
			dragui.css(draguistyles[i], draguistyles[i + 1]);
		}
	}
}

MainUI.create_sidebar = function (jqe, contentstyles, draguistyles) {
	jqe.empty().addClass('horc-slot droppable');


	var dragui = $('<div class="horc-ui-droppanel">').hide();
	dragui.append($('<div class="horc-circle">'));
	jqe.append(dragui);


	var content = $('<div class="horc-content horc-sidebar">');
	jqe.append(content);


	if (contentstyles) {
		for (var i = 0; i < contentstyles.length; i += 2) {
			content.css(contentstyles[i], contentstyles[i + 1]);;
		}
	}

	if (draguistyles) {
		for (var i = 0; i < draguistyles.length; i += 2) {
			dragui.css(draguistyles[i], draguistyles[i + 1]);
		}
	}
}
//    Storage Management
//    
//        This will create a new persistant variable
//    
//    Note:
//        Constructor[3] has type checking.
//    
//    Usage [2]: new Store(keyname, value_default)
//    Usage [3]: new Store(keyname, value_default, expected_type)
var Store = function (keyname, value_default, type) {
	var thisstore = this;

	this.Store = function (keyname, value_default, type) {





		var value = localStorage.getItem(thisstore._keyname);
		if (value === null) {
			thisstore._cache = JSON.parse(thisstore._default);
		} else {
			value = JSON.parse(value);

			if (type && typeof value !== type) {
				console.warn('Loaded data for "' + keyname + '" is not of type "' + type + '"; Using default value');

				thisstore._cache = JSON.parse(thisstore._default);
			} else {
				thisstore._cache = value;
			}
		}
	};



	this.get = function () {
		return thisstore._cache;
	};

	this.set = function (value) {
		if (type && typeof value !== type) {


			thisstore._cache = JSON.parse(thisstore._default);
		}

		thisstore._cache = value;
		localStorage.setItem(thisstore._keyname, JSON.stringify(value));
		if (thisstore.onset) thisstore.onset();
	};

	this.rm = function () {
		localStorage.removeItem(thisstore._keyname);
	};



	this._keyname = keyname;
	this._default = JSON.stringify(value_default);
	this._type = type;

	this._cache = null;

	this.onset = null;



	this.Store(keyname, value_default, type);
};
//    Store Updater
//    
//        This will force storage to clear for a specific key.
//    
//    Note:
//        You should force refresh the page, in case your other modules loaded 1st.
//    
//    Usage [2]: new StoreUpdater(keyname, new_version)
var StoreUpdater = function (keyname, newversion) {



	//	Initialize position for the UI
	if (!document.getElementById('horc-updater')) {
		var updater = document.createElement('div');
		document.body.insertBefore(updater, document.body.childNodes[0]);
		updater.id = 'horc-updater';
		updater.style.position = 'fixed';
		updater.style.left = '0';
		updater.style.top = '0';
		updater.style.zIndex = '100';
	}


	if (document.horc_updated === undefined) document.horc_updated = false;


	var moduleversion = localStorage.getItem(keyname + '.version');


	if (moduleversion !== newversion) {
		// Site theme changed since last time; Delete key & prepare to reboot

		document.horc_updated = true;

		localStorage.removeItem(keyname);
		localStorage.setItem(keyname + '.version', newversion);
		localStorage.removeItem(keyname + '.updated');

		return;
	}


	if (null === localStorage.getItem(keyname + '.updated')) {
		// Tell the user it updated

		localStorage.setItem(keyname + '.updated', 'true');

		var container = document.createElement('div');
		container.style.color = '#000000';
		container.style.backgroundColor = '#eeffee';
		container.style.padding = '.5em 2em';
		container.style.margin = '.5em';
		container.style.marginLeft = '1em';
		container.style.width = '16em';
		container.style.borderRadius = '0.5em';
		container.style.boxShadow = '0 0 1em #000000';

		var icon = document.createElement('img');
		icon.src = 'https://bitbucket.org/horc/anime-lighter/raw/master/img/Logo.png';
		icon.style.width = '1.2em'
		icon.style.verticalAlign = 'middle'

		var msg = ' <b>' + keyname + '</b> was reset';

		var counter = document.createElement('span');
		counter.style.cssFloat = 'right';

		var desc = document.createElement('span');
		desc.innerHTML = msg;
		desc.appendChild(counter);

		container.appendChild(icon);
		container.appendChild(desc);

		document.getElementById('horc-updater').appendChild(container);

		var time = 10000;
		var _updater = setInterval(function () {
			if (time <= 0) {
				clearInterval(_updater);
				container.remove();
			} else {
				var t = (time / 100 | 0) / 10;
				if (t % 1 === 0) t = t + '.0';
				counter.innerHTML = t;
				time -= 100;
			}
		}, 100);

		container.onclick = function () {
			clearInterval(_updater);
			container.remove();
		}
	}
}
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />


//    Mouse & Touch module
//    
//        Makes mouse & touch interaction consistent
//        This guarantees that for every "start" event, there is a matching "end" event
//        Assign the event handler to the correct functions of these
//    
//    If you need to test against left/middle/right click, negate the number before testing
//        Real touch events will use positive numbers: 0, 1, 2, +
//        Mouse events will use negative numbers, -1, -2, -3
//    
//    Important functions:
//        .mousedown  | Event proxies that you must pass to an object when binding
//        .mouseup    |  ^
//        .mousemove  |  ^
//        .touchstart |  ^
//        .touchend   |  ^
//        .touchmove  |  ^
//    
//    Important Variables:
//        .onstart     | Callback for mouse or touch start event
//        .onend       | Callback for matching end event
//        .ondragstart | Callback for when a drag is detected
//        .ondragend   | Callback for matching end event
//        .onmove      | Callback for matching move event
//        .onfirst     | Callback for 1st start event
//        .onlast      | Callback for last end event
//    
//    Constructor:
//        Constructor takes 3 functions, listed below
//        Make sure each of those are defined with parameters(identifiers, changedtouches, event)
//    
//    Usage[0]: new Touch()
var Touch = function () {
	var thistouch = this;



	var touchsupport = 'ontouchstart' in window;

	this.Touch = function () {

	};



	this.mousedown = function (e) {


		if (e.which < 1) return;
		if (thistouch.ismdown) return;
		thistouch.ismdown = true;
		var isfirst = !thistouch.dragging;

		thistouch.mousetouch = new VirtualTouchEvent(e, -e.which);
		thistouch.target = e.originalEvent.target;

		recheck_mouse(e);

		$(document).on('mouseup mousemove mouseenter mouseleave', mousemove_correction);

		var changes = e.originalEvent.changedTouches;

		//	Trigger first
		if (thistouch.onfirst && isfirst) thistouch.onfirst([-e.which], changes, e);

		//	Trigger mouse start

		if (thistouch.onstart) thistouch.onstart([-e.which], changes, e);

		e.done = true; // Notify mouse correction handler
	};
	this.mousemove = function (e) {


		if (e.which < 1) return;
		if (!thistouch.ismdown) return;

		recheck_mouse(e);

		var changes = e.originalEvent.changedTouches;

		//	Trigger dragging
		if (!isdragging(-e.which)) {
			setdragging(-e.which);
			if (thistouch.ondragstart) thistouch.ondragstart([-e.which], changes, e);
		}

		//	Trigger moving
		if (thistouch.onmove) thistouch.onmove([-e.which], changes, e);

		e.done = true; // Notify mouse correction handler
	};
	this.mouseup = function (e) {


		if (e.which < 1) return;
		if (!thistouch.ismdown) return;
		thistouch.ismdown = false;

		e.originalEvent.target = thistouch.target;

		recheck_mouse(e);

		var changes = e.originalEvent.changedTouches;

		//	Trigger dragging
		if (isdragging(-e.which)) {
			cleardragging(-e.which);
			if (thistouch.ondragend) thistouch.ondragend([-e.which], e.originalEvent.changedTouches, e);
		}

		//	Trigger mouse end
		if (thistouch.onend) thistouch.onend([-e.which], changes, e);


		//	Trigger last
		if (thistouch.onlast) thistouch.onlast([-e.which], changes, e);

		thistouch.mousetouch = null; // Delete last mouse

		e.done = true; // Notify mouse correction handler
	};


	this.touchstart = function (e) {


		normalize(e);

		var isfirst = !thistouch.istdown;
		thistouch.istdown = true;

		//	For all changes
		var changes = e.originalEvent.changedTouches;
		var ids = $(changes).map(function (i, changed) { return changed.identifier; });



		//	Trigger first
		if (isfirst && thistouch.onfirst) thistouch.onfirst(ids, changes, e);

		//	Trigger touch start
		if (thistouch.onstart) thistouch.onstart(ids, changes, e);

		e.done = true; // Notify mouse correction handler
	};
	this.touchmove = function (e) {


		try { // Unknown error possible where the user taps once extremely fast [takes a lot of tries to replicate]
			normalize(e);
		} catch (err) {
			return; // Just skip this move event
		}

		//	For all changes
		var changes = e.originalEvent.changedTouches;
		var ids = $(changes).map(function (i, changed) { return changed.identifier; });
		var changes_start = [];
		var ids_start = [];
		$(changes).map(function (i, changed) {
			var id = changed.identifier;
			if (!isdragging(id)) {
				setdragging(id);
				changes_start.push(changed);
				ids_start.push(id);
			}
		});

		//	Trigger dragging
		if (ids_start.length && thistouch.ondragstart) thistouch.ondragstart(ids_start, changes_start, e);

		//	Trigger moving
		if (thistouch.onmove) thistouch.onmove(ids, changes, e);

		e.done = true; // Notify mouse correction handler
	};
	this.touchend = function (e) {


		try { // Unknown error possible where the user taps once extremely fast [takes a lot of tries to replicate]
			normalize(e);
		} catch (err) {
			console.error('Error: Unknown issue where user performs 2 finger right click.\nThat breaks: normalize::importchanges::changes.push'); // Allow cleanup to happen, but alert developer
			console.warn('Attempting to recover from error')
		}

		//	For all changes
		var changes = e.originalEvent.changedTouches;
		var ids = $(changes).map(function (i, changed) { return changed.identifier; });
		var changes_end = [];
		var ids_end = [];
		$(changes).map(function (i, changed) {
			var id = changed.identifier;
			if (isdragging(id)) {
				cleardragging(id);
				changes_end.push(changed);
				ids_end.push(id);
			}
		});

		//	Trigger dragging
		if (ids_end.length && thistouch.ondragend) thistouch.ondragend(ids_end, changes_end, e);

		//	Trigger touch end
		if (thistouch.onend) thistouch.onend(ids, changes, e);


		//	Trigger last
		if (!e.originalEvent.touches.length) thistouch.istdown = false;
		var islast = !thistouch.istdown;
		if (thistouch.onlast && islast) thistouch.onlast(ids, changes, e);

		e.done = true; // Notify mouse correction handler
	};


	//    Unified handler for all
	this.onstart = null;
	this.onend = null;
	this.ondragstart = null;
	this.ondragend = null;
	this.onmove = null;
	this.onfirst = null;
	this.onlast = null;


	//    Check Dragging State
	//    
	//        Used to keep track of whats being dragged
	//    
	//    Usage [1]: setdragging(id)
	function isdragging(id) {

		var shift = (0x1 << (id + 3));
		return !!(thistouch.dragging & shift);
	}
	//    Set Dragging State
	//    
	//        Used to keep track of whats being dragged
	//    
	//    Usage [1]: setdragging(id)
	//    Usage [2]: setdragging(ids)
	function setdragging(ids) {

		if (ids.length === undefined) {
			var shift = (0x1 << (ids + 3));
			thistouch.dragging |= shift;
		} else {
			$(ids).map(function (i, id) { setdragging(id); });
		}
	}
	//    Clear Dragging State
	//    
	//        Used to keep track of whats being dragged
	//    
	//    Usage [1]: cleardragging(id)
	//    Usage [2]: cleardragging(ids)
	function cleardragging(ids) {

		if (ids.length === undefined) {
			var shift = (0x1 << (ids + 3));
			thistouch.dragging &= ~shift;
		} else {
			$(ids).map(function (i, id) { cleardragging(id); });
		}
	}


	//    Normalize
	//    
	//        Combines .which, .client, .changedTouches, .touches, & .targetnow
	//    
	//    Usage [1]: normalize(event)
	function normalize(e) {

		if (e.done) return;

		if (e.originalEvent.changedTouches === undefined) e.originalEvent.changedTouches = [];
		if (e.originalEvent.touches === undefined) e.originalEvent.touches = [];

		for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {
			var changed = e.originalEvent.changedTouches[i];
			changed.target = thistouch.target;
			changed.targetnow = gettargetnow(e);
		}

		var changed = e.originalEvent.changedTouches;
		if (e.which && changed.length) {
			delete changed.target; // a bug requires original target to be deleted before reassignment
			changed.target = thistouch.target;
		}

		var changes = e.originalEvent.changedTouches;
		if (thistouch.mousetouch) changes.push(thistouch.mousetouch);

		var touches = e.originalEvent.touches;
		if (thistouch.mousetouch) touches.push(thistouch.mousetouch);
	}
	//    Recheck Mouse
	//    
	//        For mouse events, this ensures consistency between mouse & touch.
	//    
	//    Note:
	//        Only for mouse events; Don't call this from a touch event.
	//    
	//    Usage [1]: recheck_mouse(event)
	function recheck_mouse(e) {


		normalize(e);

		if (thistouch.mousetouch) {
			thistouch.mousetouch.copyfrom(e);
		}

		if (e.which !== thistouch.lastmouse) {
			if (thistouch.lastmouse) {
				var nowwhich = e.which;
				e.which = thistouch.lastmouse;
				thistouch.mouseup(e);
				e.which = nowwhich;
			}

			thistouch.lastmouse = e.which;
		}
	}
	//    Mouse Move Correction
	//    
	//        Bound when a mousedown happens
	//        This ensures that a mouse up will happen
	//    
	//    Note:
	//        Only for mouse events; Don't call this from a touch event.
	//    
	//    Usage [1]: recheck_mouse(event)
	function mousemove_correction(e) {
		if (e.done) return;
		recheck_mouse(e);
		if (!thistouch.mousetouch) {
			$(document).off('mouseup mousemove mouseenter mouseleave', mousemove_correction);
			thistouch.lastmouse = 0;
			thistouch.mouseup(e);
		} else {
			thistouch.mousemove(e);
		}
	}


	//    Get Cursor Position
	//    
	//    Note:
	//        Requires at least 1 touch or mouse point to exist.
	//    
	//    Usage [1]: getcursor(event)
	function getcursor(e) {


		var changed = e.originalEvent.changedTouches;
		if (changed && 0 < changed.length) {
			var touch = e.originalEvent.changedTouches[0];
			return [touch.clientX, touch.clientY];
		} else if (e.clientX !== undefined) {
			return [e.clientX, e.clientY];
		}


		return null;
	}
	//    Get Target Now
	//    
	//    Note:
	//        Requires at least 1 touch or mouse point to exist.
	//    
	//    Usage [1]: gettargetnow(event)
	function gettargetnow(e) {


		var pos = getcursor(e);
		if (pos) return document.elementFromPoint(pos[0], pos[1]);
		return null;
	}


	//    Virtual Touch Event
	//    
	//    Note:
	//        Constructor Takes the mouse event & which mouse.
	//        It has a copyfrom() method to copy new XY values.
	//        copyfrom() will not override the id or element target.
	var VirtualTouchEvent = function (e, id) {




		this.clientX = e.originalEvent.clientX;
		this.clientY = e.originalEvent.clientY;
		this.force = 0; // Pressure
		this.identifier = id; // ID of this touch event
		this.pageX = e.originalEvent.pageX;
		this.pageY = e.originalEvent.pageY;
		this.radiusX = 25; // Default to 25 for mouse
		this.radiusY = 25; //  ^
		this.screenX = e.originalEvent.screenX;
		this.screenY = e.originalEvent.screenY;
		this.target = e.originalEvent.target; // Element that triggered the event
		this.targetnow = gettargetnow(e); // Element the mouse is focused on

		this.copyfrom = function (e) {
			this.clientX = e.originalEvent.clientX;
			this.clientY = e.originalEvent.clientY;
			this.pageX = e.originalEvent.pageX;
			this.pageY = e.originalEvent.pageY;
			this.screenX = e.originalEvent.screenX;
			this.screenY = e.originalEvent.screenY;
			this.targetnow = gettargetnow(e); // Element the mouse is focused on
		};
	}

	this.mousetouch = null;
	this.dragging = 0x0; // dragging flag
	this.target = null;

	this.lastmouse = 0;

	this.ismdown = false;
	this.istdown = false;


	this.Touch();
};
///	Dependencies:
/// <reference path="http://code.jquery.com/jquery-2.1.3.js" />
/// <reference path="https://code.jquery.com/ui/1.11.4/jquery-ui.js" />


//    Get URL Search   +1 overloads
//    
//        This will read a URL for the search query
//    
//    Examples of accepted URLs:
//        http://horc.bitbucket.org/
//        http://horc.bitbucket.org?
//        http://horc.bitbucket.org/?path=projects
//        ?path=projects/test/
//        path=projects/test&
//    
//    Return:
//        Object with the key & string values
//    
//    Usage [0]: geturlsearch()
//    Usage [1]: geturlsearch(string_url)
function geturlsearch(url) {
	if (typeof url !== 'string') {
		if (url === undefined) url = location.search;

	}

	function cleanurlsearch(url) {
		console.warn('\t' + url);
		if (-1 < url.search(/:\/\//)) { // This is a url
			var p = url.search(/\?/);
			if (p === -1) url = '';
			else url = url.substr(p + 1);
		}

		if (url.substr(0, 1) === '?') url = url.substr(1);

		return url;
	}

	url = cleanurlsearch(url);

	var params = {};
	var split = url.split('&');
	for (var i = 0; i < split.length; i++) {
		var u = split[i];
		if (u.length) {
			var p = u.search('=');
			if (-1 < p) {
				var lhs = u.substr(0, p);
				var rhs = u.substr(p + 1);
				if (!lhs.length) continue;
				params[lhs] = rhs;
			} else {
				var lhs = u;
				params[lhs] = '';
			}
		}
	}
	return params;
}


//    Load Script   +3 overloads
//    
//        This will sequentially load 1 script at a time.
//        Run multiple times to load in parallel
//    
//    Usage [1]: loadscript(string_url)
//    Usage [2]: loadscript(string_url, oncomplete_function)
//    Usage [1]: loadscript(array_of_urls)
//    Usage [2]: loadscript(array_of_urls, oncomplete_function)
function loadscript(urls, oncomplete) {
	if (typeof urls === 'object') {

		if (!urls.length) {
			if (oncomplete) return oncomplete();
			return;
		}

		loadscript(urls[0], function () {
			loadscript(urls.slice(1), oncomplete);
		});
	} else if (typeof urls === 'string') {
		var url = urls;

		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; ++i) {
			if (scripts[i].src === url) {
				console.log('	Script already loaded:\n' + url);
				if (oncomplete) oncomplete();
				return;
			}
		}

		var e = document.createElement('script');
		e.src = url;
		e.onload = function () {
			console.log('	Injected script:\n' + url);
			if (oncomplete) oncomplete();
		}
		e.onerror = function () {
			e.remove();
			console.warn('	Failed to injected script:\n' + url);
			if (oncomplete) oncomplete();
		}
		document.head.appendChild(e);

	} else {

	}
}


//    Load Style   +3 overloads
//    
//        This will sequentially load 1 style at a time.
//        Run multiple times to load in parallel
//    
//    Usage [1]: loadstyle(string_url)
//    Usage [2]: loadstyle(string_url, oncomplete_function)
//    Usage [1]: loadstyle(array_of_urls)
//    Usage [2]: loadstyle(array_of_urls, oncomplete_function)
function loadstyle(urls, oncomplete) {
	if (typeof urls === 'object') {

		if (!urls.length) {
			if (oncomplete) return oncomplete();
			return;
		}

		loadstyle(urls[0], function () {
			loadstyle(urls.slice(1), oncomplete);
		});
	} else if (typeof urls === 'string') {
		var url = urls;

		var links = document.getElementsByTagName('link');
		for (var i = 0; i < links.length; ++i) {
			if (links[i].href === url) {
				console.log('	Style already loaded:\n' + url);
				if (oncomplete) oncomplete();
				return;
			}
		}
		var styles = document.getElementsByTagName('style');
		for (var i = 0; i < styles.length; ++i) {
			if (styles[i].attributes && (url === styles[i].attributes.src.value)) {
				console.log('	Style already loaded:\n' + url);
				if (oncomplete) oncomplete();
				return;
			}
		}

		var e = document.createElement('link');
		e.rel = 'stylesheet';
		e.type = 'text/css';
		e.href = url;
		e.onload = function () {
			console.log('	Injected style:\n' + url);
			if (oncomplete) oncomplete();
		}
		e.onerror = function () {
			e.remove();
			console.warn('	Failed to injected style:\n' + url);
			if (oncomplete) oncomplete();
		}
		document.head.appendChild(e);

	} else {

	}
}


function recheck_prefixfree() {
	var sleeptime = 200;
	var maxtime = 10000;
	var addtime = Date.now();

	function helper() {
		var realtimemax = maxtime + addtime;
		if (realtimemax < Date.now()) return;

		var time = Date.now();

		setTimeout(function () {
			try {
				StyleFix.link; // test for Prefix Free

				var links = document.getElementsByTagName('link');
				if (links.length) {
					addtime = Date.now();
					for (var i = 0; i < links.length; ++i) {
						StyleFix.link(links[i]);
					}
				}
			} catch (err) {
			}

			helper();
		}, sleeptime);
	}

	helper();
}



function benchmark(f) {
	s = Date.now();
	for (var i = 0; i < 1000000; ++i) f();
	s = Date.now() - s;
	return s / 1000;
}
