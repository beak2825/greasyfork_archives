// ==UserScript==
// @name        Gmail Delete Highlight
// @namespace   pauls
// @include     https://mail.google.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @description Highlights the "Delete this message" link under gmail's "more" menu.
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7863/Gmail%20Delete%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/7863/Gmail%20Delete%20Highlight.meta.js
// ==/UserScript==

$.noConflict
function triggerMostButtons (jNode) {
    triggerMouseEvent (jNode[0], "mouseover");
    triggerMouseEvent (jNode[0], "mousedown");
    triggerMouseEvent (jNode[0], "mouseup");
    triggerMouseEvent (jNode[0], "click");
}
function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
$(document).keydown(function(e) {
    if(e.keyCode == 68){
        if(jQuery("div:contains('Send')div[tabindex=1]").length==0){    
           triggerMostButtons(jQuery(document.querySelectorAll("div[tabindex]:hover")).last().find("img[role=menu]"))
           deleteMenu = jQuery("[role=menuitem]:contains('Delete this message')")
           triggerMostButtons(deleteMenu)
           triggerMostButtons(deleteMenu)
        }
    }
});