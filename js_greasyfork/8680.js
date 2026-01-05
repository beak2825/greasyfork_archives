// ==UserScript==
// @name         fara gifuri
// @namespace    http://your.homepage/
// @version      0.3
// @description  arata link in loc de gif
// @author       drakulaboy
// @include     *torrentsmd.*/forum.php?action=viewtopic&topicid=12231*
// @run-at      document-start
// @icon         http://i.imgur.com/uShqmkR.png
// @require    https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=2765
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8680/fara%20gifuri.user.js
// @updateURL https://update.greasyfork.org/scripts/8680/fara%20gifuri.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
waitForKeyElements("img", function () {
$('td.comment img[src*=".gif"]').each(function() {
        if (this.src.indexOf('/pic/smilies/') < 0)
    $(this).replaceWith('<a href="' + this.src + '">' + this.src + '</a>');
});
    });