// ==UserScript==
// @name        Linkomanija
// @namespace   Namespeisas
// @description Linkomanija poster preview
// @include     https://www.linkomanija.net/browse.php*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6180/Linkomanija.user.js
// @updateURL https://update.greasyfork.org/scripts/6180/Linkomanija.meta.js
// ==/UserScript==
jQuery(document).ready(function ($) {
    var number = 0;
    $("table:last tr").each(function (index) {
        var sitas = $(this);
        setTimeout(function () {
            var nuoroda = sitas.find('td').next().find('a').attr('href');
            number += 1;
            $.ajax({
                url: nuoroda,
                context: document.body
            }).done(function (data) {
                var rege = new RegExp('class="descr_text.+src="(.+?[^"])".+', "gim");
                var poster = rege.exec(data);
                sitas.find('td').eq(3).html('<a href="' + nuoroda + '" target="_blank"><img style="max-width:100px" src="' + poster[1] + '" alt="" /></a>');
            });
        }, index * 500);

    });
    $('font[color="red"]').parents('tr').find('td').css('background-color', '#dedede');
});