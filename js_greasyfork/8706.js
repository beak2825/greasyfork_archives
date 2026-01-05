// ==UserScript==
// @name         Stop Youtube video on spoiler close
// @namespace    http://your.homepage/
// @version      0.1
// @description  Opreste video la inchiderea spoilerului , click pe partea de jos "Închide" . "Закрыть"
// @author       You
// @grant        none
// @include     *torrentsmd.*/*
// @include     *torrentsmoldova.*/*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/8706/Stop%20Youtube%20video%20on%20spoiler%20close.user.js
// @updateURL https://update.greasyfork.org/scripts/8706/Stop%20Youtube%20video%20on%20spoiler%20close.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$('.sp-foot').click(function() {
    $("iframe").each(function() {
        var src = $(this).attr('src');
        $(this).attr('src', src);
    });
});