// ==UserScript==
// @name          Ebay Fix Desc Button
// @description   Ebay description button fix
// @namespace https://greasyfork.org/users/9560
// @include http://*.ebay.*/*
// @version 0.0.1.20150306065214
// @downloadURL https://update.greasyfork.org/scripts/8420/Ebay%20Fix%20Desc%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/8420/Ebay%20Fix%20Desc%20Button.meta.js
// ==/UserScript==

//If desc button visible, remove it and show the desc
if($("#vi_snippetdesc_btn")){
    $("#vi_snippetdesc_btn").hide()
    $("#vi-snippet-description-main").append($("#vi-desc-olay-main").html())
}