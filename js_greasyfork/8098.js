// ==UserScript==
// @name        Game Highlighter
// @author      Timo Gebauer
// @namespace   t.gebauer@hg-software.de
// @version     0.2.4
// @grant       none
// @include     http://makemehost.com/games.php*
// @description Searches the games table for settable game names and highlights them.
// @downloadURL https://update.greasyfork.org/scripts/8098/Game%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/8098/Game%20Highlighter.meta.js
// ==/UserScript==

/******************************************************************************/
// use MakeMeHosts jQuery version
$ = unsafeWindow.jQuery;

// option, to restrict search on games column (only mmh table)
var searchGamesOnly = false;

var highlights = [];

var sounds = {
	solemn: 'http://www.oringz.com/oringz-uploads/sounds-882-solemn.mp3',
	comm: 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3'
};

/******************************************************************************/
/* 
 * Ajax Request "hijacken" nach jeder erfolgreichen Übertragung die Funktion highlightArray() ausführen
 * Das Ergebnis des Requests kann hier nicht abgefangen werden, da der Eventlistener erst aufgerufen wird,
 * nachdem der eigentliche Aufrufer das Ergebnis bereits verarbeitet hat
 */
// backup original "send" function reference
XMLHttpRequest.prototype.oldSend = XMLHttpRequest.prototype.send;
var newSend = function(a) {
	var xhr = this;
	var onload = function() { 
		highlightArray();
	};
	
	xhr.addEventListener("load", onload, false);

	this.oldSend(a);
};
XMLHttpRequest.prototype.send = newSend;

/*******************************************************************************/
/*
 * TODO: 
 *		- color-picker ?
 *		- mute sound checkbox
 *		- "mute" elements
 * 		- Rückgangig button
 * 		- erst beim schließen vollständig anwenden
 * 		- sound-fenster (neu, entfernen, etc..)
 *		- lag verringern
 * 		- input dialog verschönern
 */
function initGui() {
	$('.refreshMe').next().after('<div align="center"><a class="changelink-unactive" id="btn_options" title="Open highlight settings dialog."> Highlight Settings</a></div>');
	document.getElementById('btn_options').addEventListener('click', showGui, true);
	$("body").append('<div id="popup_overlay" class="overlay"></div>');
	$("body").append('<div id="popup" class="popup"></div>');
	document.getElementById('popup_overlay').addEventListener('click', hideGui, true);
	
	// popup window
	var html = '<div align="center"><a class="changelink-active"><span>Highlighting Rules</span></a></div><br><p>'
		+ 'Enter one or more keywords, insert a color value (blue, red, #fff, #ff00ff, ...) '
		+ 'and select a sound if you want one.'
		+ '<br>All table fields are searched. Searching is case-insensitive.'
		+ '<br>Lower indexed rules are applied first.'
		+ '<br>Highlights that trigger a sound will be intensively highlighted for a short duration.</p>'
		+ '<div id="buttons_top">'
		+ '<a id="btn_add"class="changelink-unactive" title="Inserts a new highlighting rule.">New Highlight</a>'
		+ '<a id="btn_load" class="changelink-unactive" title="Load rules from a previously saved JSON formated string.">Load (JSON)</a>'
		+ '</div><div id="buttons_bottom">'
		+ '<a id="btn_save" class="changelink-unactive" title="Save your current rules as JSON formated string.">Save (JSON)</a>'
		+ '<a id="btn_remove_all" class="changelink-unactive" title="Delete all rules. Backup before?">Remove all</a>'
		+ '</div><div id="highlight_container">Something is not working correctly.</div>';
	$("#popup").append(html);
	
	// load / save
	$("#btn_load").click(function() {
		showInputDialog("", function() {
			highlights = JSON.parse($("#inputDialogInput").attr("value"));
			updateGui();
		});
	});
	$("#btn_save").click(function() {
		alert("Save this stringified options somewhere \n\n"
			+ JSON.stringify(highlights));
	});
	
	// add a new highlight
	$("#btn_add").click(function() {
		highlights.splice(0,0,{search:[]});
		updateGui();
	});
	// remove all
	$("#btn_remove_all").click(function() {
		highlights = [];
		updateGui();
	});
	
	updateGui();
	
	// append custom stylesheet
	$("head").append('<style type="text/css"><!--\n'
		+ "#btn_options {"
			+ "cursor: pointer;"
			+ "font-size: 20px;"
			+ "}"
		+ ".overlay {"
			+ "left: 0;"
			+ "top: 0;"
			+ "bottom: 0;"
			+ "right: 0;"
			+ "z-index: 100;"
			+ "position: fixed;"
			+ "background-color: #000;"
			+ "filter: alpha(opacity=20);"
			+ "opacity: 0.2;"
			+ "cursor: pointer;"
			+ "display: none;"
			+ "}"
		+ ".popup {"
			+ "display: none;"
			+ "background: #fff;"
			+ "padding: 1%;"
			+ "width: 50%;"
			+ "position: fixed;"
			+ "top: 10%;"
			+ "left: 50%;"
			+ "margin: 0 0 0 -20%;" /* add negative left margin for half the width to center the div */
			+ "cursor: default;"
			+ "z-index: 200;"
			+ "box-shadow: 0 0 5px rgba(0,0,0,0.9);"
			+ "max-height: 80%;"
			+ "overflow: auto;"
			+ "}"
		+ ".highlight_wrapper {"
			+ "width: 550px;"
			+ "margin: 20px;"
			+ "margin-left: auto;"
			+ "margin-right: auto;"
			+ "clear: both;"
			// + "border: 1px solid grey;"
			+ "overflow: hidden;"
			+ "}"
		+ ".index {"
			+ "width: 20px;"
			+ "margin-right: 30px;"
			+ "float:left;"
			+ "font-family: helvetica neue, helvetica, arial, sans-serif;"
			+ "font-size: 14px;"
			+ "text-shadow: 1px 1px 1px #000;"
			+ "}"
		+ ".btn_hl {"
			+ "font-family: helvetica neue, helvetica, arial, sans-serif;"
			+ "width: 22px;"
			+ "height: 22px;"
			+ "margin-right: 5px;"
			+ "margin-left: 5px;"
			+ "border: 1px solid grey;"
			+ "text-decoration: none;"
			+ "font-weight: bold;"
			+ "cursor:pointer;"
			+ "float:left;"
			+ "}"
		+ ".btn_color {"
			+ "margin-right: 20px;"
			+ "margin-left: 20px;"
			+"}"
		+ ".btn_remove {"
			+ "background-color: #f5f5f5;"
			+ "}"
		+ ".highlight_search {"
			+ "width: 200px;"
			+ "resize: none;"
			+ "float: left;"
			+ "font-family: helvetica neue, helvetica, arial, sans-serif;"
			+ "white-space: nowrap;"
			+ "word-wrap: normal;"
			+ "border: none;"
			+ "border-left: 2px solid grey;"
			+ "padding-left: 10px;"
			+ "overflow: hidden;"
			+ "}"
		+ ".sound_select {"
			+ "width: 100px;"
			+ "border: 1px solid grey;"
			+ "float: left;"
			+ "}"
		+ ".end_wrapper {"
			+ "clear:both;"
			+ "}"
		+ "#inputDialog {"
			+ "display: none;"
			+ "position: fixed;"
			+ "top: 20%;"
			+ "left: 50%;"
			+ "margin-left: -10%;"
			+ "z-index: 300;"
			+ "}"
		+ "#inputDialogOverlay {"
			+ "z-index: 250;"
			+ "}"
		+ "#btn_save {"
			+ "float:right;"
			+ "font-size: 18px;"
			+ "cursor: pointer;"
			+ "}"
		+ "#btn_load {"
			+ "float:right;"
			+ "font-size: 18px;"
			+ "cursor: pointer;"
			+ "}"
		+ "#btn_add {"
			+ "font-size: 18px;"
			+ "cursor: pointer;"
			+ "}"
		+ "#btn_remove_all {"
			+ "font-size: 18px;"
			+ "cursor: pointer;"
			+ "}"
	+ '\n--></style>');
	
	// input dialog 
	var html = '<div id="inputDialogOverlay" class="overlay"></div>'
		+ '<div id="inputDialog">'
		+ '<input id="inputDialogInput" type="text"></input>'
		+ '<button id="inputDialogButton">Ok</button>'
		+ '</div>';
	$("body").append(html);
	$("#inputDialog").hide();
	$("#inputDialogOverlay").click(function() {
		$("#inputDialog").hide();
		$("#inputDialogOverlay").hide();
	});
	$("#inputDialogInput").focus(function(){
		var that = this;
		setTimeout(function(){$(that).select();}, 10);
	});
	$("#inputDialogInput").keypress(function(event){
    if(event.keyCode == 13){
        $("#inputDialogButton").click();
    }
});
}

function updateGui() {
	// save changes
	saveLocalData();
	// reset all previous highlights
	resetHighlights();
	// apply new highlights
	highlightArray();
	
	$("#highlight_container").empty();
	$.each(highlights, function(index, elem) {
		var html = '<div class="highlight_wrapper" align="center">'
			+ '<span class="index">' + index + '</span>'
			+ '';
		// make sure, elem.search is an array
		elem.search = elem.search instanceof Array ? elem.search : [elem.search];
		var text = "";
		$.each(elem.search, function(index, search_value) {
			if(index != 0)
				text += "\n";
			text += search_value;
		});
		html += '<textarea class="highlight_search" title="Search keywords. One per line." index="'+index+'" rows="'
			+ elem.search.length + '">' + text + '</textarea>';
		html += '<button class="btn_hl btn_color" value="' + index
			+ '" style="background-color:' + elem.color + ';">&nbsp;</button>';
		html += '<select class="sound_select" title="Notification sound.\nNew games will not only trigger the sound, but also be especially highlighted for a short duration." index="'+index+'">';
		var afterOption = "";
		var foundSound = false;
		$.each(sounds, function(sound, url) {
			afterOption += '<option';
			if(elem.sound === sound) {
				afterOption += ' selected=selected';
				foundSound = true;
			}
			afterOption += '>' + sound + '</option>';
		});
		html += '<option'
		if(!foundSound)
			html += ' selected=selected';
		html += '></option>';
		html += afterOption;
		html += '</select>';
		html += '<button class="btn_hl btn_up" title="Move up" index="' + index + '">&#9650;</button>';
		html += '<button class="btn_hl btn_down" title="Move down" index="' + index + '">&#9660;</button>';
		html += '<button class="btn_hl btn_remove" title="Delete" index="' + index + '">X</button>';
		html += '</div>';
		$("#highlight_container").append(html);
	});
	
	// register events
	$(".highlight_search").change(function() {
		highlights[$(this).attr("index")].search = cleanArray($(this).val().split("\n")) ;
		saveLocalData();
		resetHighlights();
		highlightArray();
	});
	$(".highlight_search").keyup(function(event) {
		$(this).attr("rows", $(this).val().split("\n").length);
	});
	$(".btn_color").click(function() {
		var index = $(this).attr("value");
		showInputDialog(highlights[index].color, function() {
			var color = $("#inputDialogInput").attr("value");
			highlights[index].color = color;
			updateGui();
			$('.btn_color[value="'+index+'"]').focus();
		});
	});
	$(".sound_select").change(function(){
		highlights[$(this).attr("index")].sound = $(this).val();
		// no need to update the gui here, only save the changes
		saveLocalData();
	});
	$(".btn_remove").click(function() {
		highlights.splice($(this).attr("index"),1);
		updateGui();
	});
	$(".btn_up").click(function() {
		var index = parseInt($(this).attr("index"));
		if(index == 0)
			return;
		var temp = highlights.splice(index, 1);
		highlights.splice(index-1, 0, temp[0]);
		updateGui();
	});
	$(".btn_down").click(function() {
		var index = parseInt($(this).attr("index"));
		if(index == highlights.length-1)
			return;
		var temp = highlights.splice(index, 1);
		highlights.splice(index+1, 0, temp[0]);
		updateGui();
	});
}

function showInputDialog(text, okFunction) {
	$("#inputDialogInput").attr("value", text);
	$("#inputDialogInput").focus();
	$("#inputDialog").show();
	$("#inputDialogOverlay").show();
	$("#inputDialogButton").unbind("click")
	$("#inputDialogButton").click(function() {
		$("#inputDialog").hide();
		$("#inputDialogOverlay").hide();
	});
	$("#inputDialogButton").click(okFunction);
}

function showGui() {
	$("#popup_overlay").show();
	$("#popup").show();
	$("body").css("overflow", "hidden");
}

function hideGui() {
	$("#popup_overlay").css("display", "none");
	$("#popup").css("display", "none");
	$("body").css("overflow", "auto");
	// reset all previous highlights
	resetHighlights();
	// apply new highlights
	highlightArray();
}

/******************************************************************************/

function saveLocalData() {
	localStorage.setItem("highlights", JSON.stringify(highlights));
}

function loadLocalData() {
	highlights = JSON.parse(localStorage.getItem("highlights"));
	if(highlights === null) {
		highlights = [];
	}
}

/******************************************************************************/
$(document).ready(function () {

	// Riesigen Header entfernen
	$('#rt-header-overlay').remove();
	
	// Sounds vorladen
	$.each(sounds, function(name, url) {
		$("body").append("<audio id='sound_"+name+"' src='"+url+"' hidden=true preload=auto></audio>");
	});
	
	// Einstellungen laden
	loadLocalData();
	
	//  eigenes GUI einfügen
	initGui();
});

/******************************************************************************/
// enthalten die Namen der gefundenen Spiele
var knownGames = {};
var foundGames = {};

function resetHighlights() {
	$("#mmh td").css({
		backgroundColor: "transparent",
		color: "black"
	});
}

function highlightArray() {
	foundGames = {};
	$.each(highlights, function(index, elem) {
		if (elem === null)
			return;
		var arr = elem.search instanceof Array ? elem.search : [elem.search];
		if(!(arr.length == 1 && arr[0] === ""))
			$.each(arr, function(index, text) {
				highlight(text, elem.color, elem.sound);
			});
	});
	knownGames = foundGames;
}

function highlight(search, color, sound) {
	getNodes(search).each(function(){
		// Schrift färben?
		if(color && !$(this).attr("hl")) {
			$(this).css("color", color);
		} 

		// Spiel unbekannt?
		if(!($(this).text() in knownGames)) {
			// Sound abspielen?
			if(sound in sounds) {
				// neu gefundene Spiele kurzzeitig hervorheben
				$(this).css("background-color", color);
				$(this).css("color", "white");
				// mark this element as highlighted
				$(this).attr("hl", "true");
				document.getElementById("sound_" + sound).play();
			}
		}
		
		foundGames[$(this).text()] = $(this).text();
	});
}

function getNodes(text) {
	// Nur in Games Spalten suchen?
	if (searchGamesOnly) {
		var tds = $('#mmh table:first-child td:nth-child(4)')
			.add('#mmh table:last-child td:nth-child(2)');
	} else {
		var tds = $('td');
	}
	return tds.filter(':Contains(' + text + ')');
}

/******************************************************************************/
/*
 * removes every "falsy" value: undefined, null, 0, false, NaN and '':
 */
function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}

/******************************************************************************/
// jQuery :contains Case-Insensitive
// http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
jQuery.expr[':'].Contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};