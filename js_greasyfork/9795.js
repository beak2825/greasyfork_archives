// ==UserScript==
// @name        pootscript
// @namespace   asdf
// @description Pootscript - image / webm parser for webirc
// @include     http*://*.mibbit.com/*
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @version     1.07
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9795/pootscript.user.js
// @updateURL https://update.greasyfork.org/scripts/9795/pootscript.meta.js
// ==/UserScript==

window.get_type = function(thing){
    if(thing===null)return "[object Null]"; // special case
       return Object.prototype.toString.call(thing);
}

jQuery.noConflict();
(function( $ ) {
  $(function() {
    //wait for the chat to load
    var asd = window.setInterval(window.findChat = function(){
        if ($("#chats").find('div > table:first').length) {
            clearInterval(asd);
            $("#chats").find('div > table:first > tbody').on('DOMNodeInserted', function(ev){
                if ($(ev.target).is("#chats div > table:first > tbody > tr td:last-child")) {
                    $("#chats div > table:first").parent().scrollTop($("#chats div > table:first").height()); 
                }
                if (get_type(ev.target) == '[object HTMLAnchorElement]') {
                    var link = $(ev.target).prop('href');
                    var imgRegex = /.+(\.jpg|\.gif|\.png|\.jpeg|\.bmp)/gi;
                    var videoRegex = /.+(\.webm|\.mp4)/gi;
                    var imgMatches = imgRegex.exec(link);
                    var videoMatches = videoRegex.exec(link);
                    if (imgMatches !== null) {
                        $(ev.target).replaceWith("<a href='"+link+"' target='_blank'><img style='max-height:80px;max-width:99%;' src='"+link+"' /></a>");
                        $("#chats div > table:first > tbody img:last").unbind('load');
                        $("#chats div > table:first > tbody img:last").on('load', function(){
                            $("#chats div > table:first").parent().scrollTop($("#chats div > table:first").height()); 
                        })
                    } else if (videoMatches !== null) {
                        $(ev.target).replaceWith("<video controls style='max-height:185px;max-width:99%;'><source src='"+link+"' /></video>");
                    }
                }
            });
        } else {
           window.findChat;   
        }
    }, 1000);
  });
})(jQuery);