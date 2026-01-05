// ==UserScript==
// @name        RuTracker
// @namespace   RuTracker
// @include     http://rutracker.org/forum/* 
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     0.2
// @grant       none
// @description Rutracker.net poster preview
// @downloadURL https://update.greasyfork.org/scripts/6317/RuTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/6317/RuTracker.meta.js
// ==/UserScript==
jQuery(document).ready(function ($) {
    var number = 0;
    $(".hl-tr").each(function (index) {
        var sitas = $(this);
        setTimeout(function () {
            var nuoroda = sitas.find('.tt-text, .tLink').attr('href');
            number += 1;
            //sitas.find('.tt').append('<div style="float:left;">' + number + nuoroda + '</div>');
            $.ajax({
                url: nuoroda,
                context: document.body
            }).done(function (data) {
                var rege = new RegExp('<var class="postImg.+title="(.+?[^"])".+', "gim");
                var poster = rege.exec(data);
                sitas.find('.topic_id, .row1.tCenter:first, .u-name').eq(0).html('<a href="' + nuoroda + '" target="_blank"><img style="max-width:100px" src="' + poster[1] + '" alt="" /></a>');
            });
        }, index * 500);
    });
});