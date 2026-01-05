// ==UserScript==
// @name        OCremix player
// @namespace   mod
// @description audio player implementation
// @include     http://ocremix.org/remix/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6812/OCremix%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/6812/OCremix%20player.meta.js
// ==/UserScript==

// get src of mp3
var elm = document.querySelector("#panel-download > ul:nth-child(4) > li:nth-child(1) > a:nth-child(1)");

// dom node to implement the the player
var parent = document.querySelector("#main-content > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1)");

// create audio player node
var html = "<audio controls><source src='" + elm.href + "' type='audio/mp3'></audio>";
var div = document.createElement("div");
div.innerHTML = html;

// append to DOM
parent.insertBefore(div,parent.firstChild);