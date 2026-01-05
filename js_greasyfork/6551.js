// ==UserScript==
// @name Bees & Bombs Roulette fullscreen
// @author Ian G
// @description fullscreens Bees & Bombs' beautiful gif roulette
// @version 1.0
// @grant none
// @include http://beesandbombs.com/roulette
// @namespace https://greasyfork.org/users/7016
// @downloadURL https://update.greasyfork.org/scripts/6551/Bees%20%20Bombs%20Roulette%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/6551/Bees%20%20Bombs%20Roulette%20fullscreen.meta.js
// ==/UserScript==

mainImg = document.getElementsByClassName("main")[0];

mainImg.style["top"] = "0%";
mainImg.style["left"] = "0%";
mainImg.style["margin-top"] = "0";
mainImg.style["margin-left"] = "0";
mainImg.style["width"] = "100%";
mainImg.style["z-index"] = "-1";
