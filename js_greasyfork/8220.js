// ==UserScript==
// @name         tmd shortcuts
// @namespace    http://your.homepage/
// @version      0.6
// @description  press U - for Urmarire link, T - for Torrents link
// @author       drakulaboy
// @icon         http://i.imgur.com/uShqmkR.png
// @include     *.torrentsmd.*/*
// @include     *.torrentsmd.me/*
// @include     *.torrentsmoldova.*/*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/8220/tmd%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/8220/tmd%20shortcuts.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
///////////////Cale scurta la Urmărire
$(window).keydown(function (evt) {
    if (evt.target.tagName.toLowerCase() !== 'input' &&
        evt.target.tagName.toLowerCase() !== 'textarea' && evt.which == 85) {
        window.location.href="/watcher.php";
    }
});
///////////////Cale scurta la Torrente
$(window).keydown(function (evt) {
    if (evt.target.tagName.toLowerCase() !== 'input' &&
        evt.target.tagName.toLowerCase() !== 'textarea' && evt.which == 84) {
        window.location.href = "/browse.php";
    }
});