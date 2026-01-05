// ==UserScript==
// @name          Dotabuff Match Link
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       2
// @description   Match ID on match pages will launch Dota2 to watch that match.
// @include       *://*dotabuff.com/matches/*
// @include       *://*dotabuff.com/players/*
// @grant         none
// @updateVersion 2
// @downloadURL https://update.greasyfork.org/scripts/5974/Dotabuff%20Match%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5974/Dotabuff%20Match%20Link.meta.js
// ==/UserScript==
if (document.URL.split('/matches/').length == 2) {
	var titleElement = document.getElementsByClassName('header-content-title')[0].getElementsByTagName('h1')[0];
	var matchID = document.URL.split('/matches/')[1].split('/')[0].split('?')[0];
	titleElement.innerHTML = 'Match <a title="Watch Match in Dota 2 Client" style="color:#92bb35;text-shadow: 1px 1px 1px #000000;" href="dota2://matchid=' + matchID + '">' + matchID + '</a><small>Overview</small>';
} else if (document.URL.split('/players/').length == 2) {
	var titleElement = document.getElementsByClassName('header-content-title')[0].getElementsByTagName('h1')[0];
	var playerId = document.URL.split('/players/')[1].split('/')[0].split('?')[0];
	playerId = '7656119' + (parseInt(playerId) +  7960265728).toString();
	var titleText = titleElement.innerHTML.split('<small>')[0];
	titleElement.innerHTML = '<a title="Steam Profile" style="color:#92bb35;text-shadow: 1px 1px 1px #000000;" href="http://steamcommunity.com/profiles/' + playerId + '">' + titleText + '</a><small>Overview</small>';
}