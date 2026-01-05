// ==UserScript==
// @name        ETS2MP Forum Improvements
// @namespace   01255896330214578554752036582540147522025120323038985687458
// @description Make everything about the ETS2MP Forums better
// @include     *forum.ets2mp.com/*
// @include     *forum.ets2mp.com
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     //cdn.jsdelivr.net/jquery.spectrum/1.3.3/spectrum.js
// @resource    spectrumCSS //cdn.jsdelivr.net/jquery.spectrum/1.3.3/spectrum.css
// @version     0.2.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8926/ETS2MP%20Forum%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/8926/ETS2MP%20Forum%20Improvements.meta.js
// ==/UserScript==



$(document).ready(function() {
    var spectrumCSS = GM_getResourceText ("spectrumCSS");
    GM_addStyle (spectrumCSS);
  
    function o(o) {
        var e = GM_getValue(o);
        return e
    }

    function e(o, e) {
        GM_setValue(o, e)
    }
    $("#user_navigation ul").prepend('<li style="color: white !important; border: none !important; -moz-user-select: none; -ms-user-select: none; user-select: none;">Background <input type="text" id="flat" title="Click here to change the background color of the forum!" /> </li>');
    var r = o("ets2_forum_bg");
    r && $("#ipboard_body").css({
        background: r,
        backgroundAttachment: "fixed"
    }),
      $("#footer_utilities ul li a").css({
        color: "black",
        background: "#F1F1F1",
        boxShadow: "0 0 3px 3px darkgrey"
    }).mouseenter(function() {
        $(this).css("color", "blue")
    }).mouseleave(function() {
        $(this).css("color", "black")
    }), $("#copyright").remove();
    var current_bg = $("#ipboard_body").css("background-color");
    $("#flat").spectrum({
        color: current_bg,
        showInput: true,
        preferredFormat: "hex",
        change: function(color) {
            var colorx = color.toHexString();
            $("#ipboard_body").css({background: colorx});
            e("ets2_forum_bg", colorx);            
        }
    });
});