// ==UserScript==
// @name        Pantip theme changer
// @namespace   jjay
// @include     http://pantip.com/topic*
// @version     1.2.1
// @grant       none
// @description Pantip.com theme changer (BG and Text color)
// @downloadURL https://update.greasyfork.org/scripts/7588/Pantip%20theme%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/7588/Pantip%20theme%20changer.meta.js
// ==/UserScript==

var textcolor = 'black'
var bgcolor = '#FFFFFF'

$(document).ajaxComplete(function(event, request, settings ) {
    
    if (settings.url.indexOf('render_comments') >= 0
          || settings.url.indexOf('render_replys') >= 0) {
        
       var classToApplyColor = 'body,.display-post-wrapper-inner,\
                         .display-post-story,\
                         .emotion-vote-list,\
                         .display-post-number,\
                         a,.display-post-wrapper';
       var classToApplyBG = 'body,.display-post-wrapper-inner,\
                         .display-post-story,\
                         .emotion-vote-list,\
                         .display-post-wrapper';
        
        $(classToApplyColor).css('color',textcolor);        
        $(classToApplyBG).css('background','none repeat scroll 0 0 '+bgcolor);
        
        $('a').css('text-decoration','none');
        $('.emotion-vote-user').removeClass('emotion-vote-user');
        
    }
});
