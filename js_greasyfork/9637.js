// ==UserScript==
// @name         GooglePlus Annihilation
// @version      0.1
// @description  Removes G+ buttons on Google
// @author       rangicus
// @include      https://www.google.com/*
// @require      https://code.jquery.com/jquery-1.11.2.min.js
// @grant        none
// @namespace https://greasyfork.org/users/11015
// @downloadURL https://update.greasyfork.org/scripts/9637/GooglePlus%20Annihilation.user.js
// @updateURL https://update.greasyfork.org/scripts/9637/GooglePlus%20Annihilation.meta.js
// ==/UserScript==

$().ready(function(){
    $("#gbw > div > div > div.gb_Lc.gb_n.gb_0c.gb_Sc > div.gb_m.gb_n.gb_o.gb_0c, #gbw > div > div > div.gb_Kc.gb_0c.gb_n > div.gb_4a.gb_qb.gb_n.gb_cb > div.gb_5a > a, #gbw > div > div > div.gb_Kc.gb_0c.gb_n > div.gb_Zb.gb_qb.gb_n.gb_Sc > div.gb_5a > a").hide();
});