// ==UserScript==
// @name           Embed Soundcloud New
// @namespace      my
// @description    finds link to song on soundcloud and automatically embeds into the page
// @include        *torrentsmd.*
// @require        http://code.jquery.com/jquery-2.1.3.js
// @version 0.0.1.20150205173048
// @downloadURL https://update.greasyfork.org/scripts/7841/Embed%20Soundcloud%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/7841/Embed%20Soundcloud%20New.meta.js
// ==/UserScript==
var soundcloud = $("a").filter(function() {
    var regex = /(\bhttps?:\/\/soundcloud.com\/+([a-zA-Z0-9\/]*))/g;									
    return regex.test( $(this).attr("href") );
});
soundcloud.each(function(){	
    var song = $(this).attr("href");
    var embed = '';
    embed += '<object height="81" width="100%">';
    embed += '<param name="movie" value="http://player.soundcloud.com/player.swf?url='+song+'&amp;g=bb"></param>';
    embed += '<param name="allowscriptaccess" value="always"></param>';
    embed += '<embed allowscriptaccess="always" height="81" src="http://player.soundcloud.com/player.swf?url='+song+'&amp;g=bb" type="application/x-shockwave-flash" width="100%">';
    embed += '</embed>';
    embed += '</object>';
    $(this).after( embed );
});