// ==UserScript==
// @name           Embed Zippyshare from link
// @namespace      my
// @description    find link to songs from zippyshare and automatically embeds into the page
// @include        *torrentsmd.*/forum.php*
// @require        http://code.jquery.com/jquery-2.1.3.js
// @version        1.3
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7941/Embed%20Zippyshare%20from%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/7941/Embed%20Zippyshare%20from%20link.meta.js
// ==/UserScript==
/*jshint multistr: true */
$.noConflict();
jQuery( document ).ready(function( $ ) {
var regex = /^.+?\/\/www([0-9]+)\.zippyshare\.com\/v\/([a-zA-Z0-9]+)\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
var soundcloud = $("a").filter(function() {
    var m = regex.exec(this.href);
    if (m) {
       this.setAttribute('serverID', m[1]);
       this.setAttribute('fileID', m[2]);
       return true;
    }
});
soundcloud.each(function(){ 
    $(this).after('<embed flashvars="baseurl=https://api.zippyshare.com/api/&amp;file=' + this.getAttribute('fileID') +
                  '&amp;server=' + this.getAttribute('serverID') + '" allowfullscreen="false" quality="high"\
                   wmode="transparent" src="https://api.zippyshare.com/api/player.swf" type="application/x-shockwave-flash"\
                   height="80" width="700" style="display:block">');
});
    });