// ==UserScript==
// @name       		Download with Mod Organizer
// @description  	Nexus sites will better suit Mod Organizer users by replacing references to NMM with references to MO.
// @version    		1.0
// @author			Alex Bull

// @match			http://*.nexusmods.com/*/mods/*

// @exclude			http://*.nexusmods.com/*/mods/searchresults/*
// @exclude			http://*.nexusmods.com/*/mods/categories/*
// @exclude			http://*.nexusmods.com/*/mods/newtoday/*
// @exclude			http://*.nexusmods.com/*/mods/newrecently/*
// @exclude			http://*.nexusmods.com/*/mods/latestmods/*
// @exclude			http://*.nexusmods.com/*/mods/top/*
// @exclude			http://*.nexusmods.com/*/mods/tags/*
// @exclude			http://*.nexusmods.com/*/mods/modsofthemonth/*
// @exclude			http://*.nexusmods.com/*/mods/uploadwizard/*
// @exclude			http://*.nexusmods.com/*/mods/manage/*
// @exclude			http://*.nexusmods.com/*/mods/track/*
// @exclude			http://*.nexusmods.com/*/mods/history/*

// @namespace https://greasyfork.org/users/9217
// @downloadURL https://update.greasyfork.org/scripts/8127/Download%20with%20Mod%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/8127/Download%20with%20Mod%20Organizer.meta.js
// ==/UserScript==

var validGames = ["Fallout3","NewVegas","Oblivion","Skyrim"];

var quickDownload_default = "Download (NMM)";
var downloadButton_default = "Download with Manager";

var quickDownload = "Download (MO)";
var downloadButton = "Download with Mod Organizer";

var tabLoaded;
var allowedGame = false;

for (var i=0;i<validGames.length;i++) {
    if (window.location.href.indexOf("nexusmods.com/"+validGames[i].toLowerCase()+"/") > -1) {
        allowedGame = true;
    }
}

if (allowedGame) {
	var quickDownloadButtons = document.getElementsByClassName("action-button green");
	if (quickDownloadButtons[0].children[0].innerHTML.toUpperCase() == quickDownload_default.toUpperCase()) {
		quickDownloadButtons[0].children[0].innerHTML = quickDownload;
	}

	if(window.location.href.indexOf("modfiles") > -1) {
		tabLoaded = setInterval(function() {checkLoaded()}, 20);
	}

	document.getElementById("tab2").onclick = function() {
		tabLoaded = setInterval(function() {checkLoaded()}, 20);
	}

	function checkLoaded() {
		if (document.getElementsByClassName("download buttons").length >= 1) {
			modifyDownloadButtons();
		}
	}
		
	function modifyDownloadButtons() {
		clearInterval(tabLoaded);           
		var downloadButtons = document.getElementsByClassName("download buttons");
		for (var i=0;i<downloadButtons.length;i++) {
			if (downloadButtons[i].children[0].innerHTML.toUpperCase() == "<SPAN>"+downloadButton_default.toUpperCase()+"</SPAN>") {
				downloadButtons[i].children[0].innerHTML = "<span>"+downloadButton+"</span>";
			}
		}
	}
}