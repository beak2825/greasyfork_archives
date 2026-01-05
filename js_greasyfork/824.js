// ==UserScript==
// @name        itunes - get large artwork
// @namespace   KG
// @include     http*://itunes.apple.com/*/movie/*
// @include     http*://itunes.apple.com/*/album/*
// @grant	none
// @version     0.3
// @description click on the poster/album cover for the large version. they're not always available.
// @downloadURL https://update.greasyfork.org/scripts/824/itunes%20-%20get%20large%20artwork.user.js
// @updateURL https://update.greasyfork.org/scripts/824/itunes%20-%20get%20large%20artwork.meta.js
// ==/UserScript==

var poster = document.getElementById('left-stack').getElementsByTagName('img')[0];

// movies
var big = poster.src.replace(".227x227-75", "");

// albums/singles
big = big.replace(".170x170-75", "");

poster.setAttribute("onclick", "javascript: window.location.href=' " + big + " '; return false;");