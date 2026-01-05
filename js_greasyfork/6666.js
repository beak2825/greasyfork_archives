// ==UserScript==
// @name         Google Dark
// @version      0.3
// @description  Google dark theme.
// @author       ekin@gmx.us
// @namespace    https://greasyfork.org/en/users/6473-ekin
// @include      /^https?://www\.google\.[a-z\.]+/.*/
// @grant        none
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6666/Google%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/6666/Google%20Dark.meta.js
// ==/UserScript==

function initStyle() {
    jQuery("html, body").css("color", "#666");
    jQuery("html, body").css("background-color", "#2C2C2C");
    jQuery(".fbar").css("background-color", "#2C2C2C");
    jQuery("#fbar").css("background-color", "#2C2C2C");
    jQuery("#fbar").css("border-top", "1px solid #494949");
    jQuery("#topabar").css("background-color", "#2C2C2C");
    jQuery("#hdtbSum").css("border-bottom", "1px solid #494949");
    jQuery("#center_col ._Ak").css("border-bottom", "1px solid #494949");
    jQuery("a:visited").css("color", "#fff");
    jQuery("a").css("color", "#8B8B8B");
    jQuery("h3.r a").css("color", "#8C8C8C");
    jQuery("#res a").css("background-color", "rgba(0, 0, 0, 0)");
    jQuery("#nav").css("opacity", "0.8");
    jQuery("#hplogo").css("opacity", "0.8");
    jQuery("#hdtbSum").css("background-color", "#2C2C2C");
    jQuery(".gb_Sb").css("background-color", "#3D3D3D");
    jQuery(".sect").css("color", "#666");
    jQuery(".sect").css("border-bottom", "1px solid #494949");
    jQuery(".mitem").css("background-color", "#424242");
    jQuery(".mitem:unhover").css("background-color", "#424242");
    jQuery(".appbar").css("border-bottom", "1px solid #494949");
    jQuery(".ab_button").css("background-image", "-webkit-linear-gradient(top,#515151,#474747)");
    jQuery(".ab_button").css("background-image", "linear-gradient(top,#515151,#474747)");
    jQuery(".ab_button").css("background-color", "#515151");
    jQuery(".ab_button.selected").css("border", "1px solid #494949");
    jQuery("#hdtb_tls:hover").css("background-image", "-webkit-linear-gradient(top,#515151,#474747)");
    jQuery("#hdtb_tls:hover").css("background-image", "linear-gradient(top,#515151,#474747)");
    jQuery("#hdtb_tls:hover").css("background-color", "#515151");
    jQuery("#hdtbMenus").css("background-color", "#424242");
    jQuery(".gb_na .gb_V").css("background-color", "#454545");
    jQuery(".gb_na .gb_V").css("border-color", "#545454;");
    jQuery(".flyr-o").css("opacity", "0.1");
}

initStyle();

setInterval(function() {
    initStyle();
}, 250);