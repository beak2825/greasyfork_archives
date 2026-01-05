// ==UserScript==
// @name        Classic Blip Player
// @name:de        Classic Blip Player
// @namespace   binoc.software.projects.userscript.classicblip
// @description Replaces the embed code with the Classic Blip Player
// @description:de Ersetzt den Einbettungscode mit dem Classic Blip Player
// @include     http://blip.tv/play/*
// @include     https://blip.tv/play/*
// @include		http://blip.tv/players/standard?*
// @include		https://blip.tv/players/standard?*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6339/Classic%20Blip%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/6339/Classic%20Blip%20Player.meta.js
// ==/UserScript==

window.onload = function() {
// Fill the EmbedTarget div with the old player code
  document.getElementById('EmbedTarget').innerHTML = '<embed width="100%" height="100%" name="blipClassicPlayer" src="http://a.blip.tv/scripts/flash/stratos.swf?file=http://blip.tv/rss/flash/' + config.id + '&enablejs=true" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>';
  
}