// ==UserScript==
// @name        Coinflip
// @namespace   Coinflip
// @include     https://www.paidverts.com/member/games/coin_flip.html
// @version     1
// @description paidverts coinflip
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5937/Coinflip.user.js
// @updateURL https://update.greasyfork.org/scripts/5937/Coinflip.meta.js
// ==/UserScript==
$(".top-menu").hide()
$(".member_top").hide()
$(".menu_right_one").hide()
$(".banners125").hide()
$(".notify_yellow").hide()
document.getElementById('footer').parentNode.removeChild(document.getElementById('footer'));
$(".changeGamePlay").hide()
$(".button_green_sans3").hide()
$(".coinFlip").hide()