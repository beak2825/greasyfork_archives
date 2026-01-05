// ==UserScript==
// @name         Winkal delete share frame on images
// @namespace    http://winkal.com/
// @version      0.1
// @description  remove share frame over image on Winkal site.
// @author       Agostino Zanutto
// @match        http://winkal.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/8809/Winkal%20delete%20share%20frame%20on%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/8809/Winkal%20delete%20share%20frame%20on%20images.meta.js
// ==/UserScript==


var $ = unsafeWindow.jQuery;
var jQuery = unsafeWindow.jQuery;

jQuery(document).ready(function(){
    console.log('Winkal delete share frame on images EVENT LOAD');
    jQuery('.contentImageContainer-BT > .hidden-xs.contentBoxVote-BT').remove();
    jQuery('.boxMediaWrap.boxMediaL > .boxVote.over.rolloverNew').remove();
});

jQuery(document).scroll(function(){
    console.log('Winkal delete share frame on images EVENT SCROLL');
    jQuery('.contentImageContainer-BT > .hidden-xs.contentBoxVote-BT').remove();
    jQuery('.boxMediaWrap.boxMediaL > .boxVote.over.rolloverNew').remove();
});