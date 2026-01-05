// ==UserScript==
// @name         MSPARP_TTS
// @namespace    http://msparp.com/
// @version      0.6
// @description  "eat my entire ass"
// @author       CR
// @match        http://*.msparp.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9606/MSPARP_TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/9606/MSPARP_TTS.meta.js
// ==/UserScript==

$('#conversation').bind('DOMNodeInserted DOMNodeRemoved DOMSubTreeModified', function( event ) {
    if (event.target.nodeName == "P") {
        var text = $('#conversation > p:last-child').text();
        text = text.substring(text.indexOf(":") + 1);
        text = text.replace("'", "");
        text = text.replace(/[0-9a-f]{32}/g, "private chat");
        text = text.replace("Karry", 'car e');
        text = text.replace("yeah", 'yah');
        $("#topic").append("<iframe width='1' height='1' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://skaia.io/tts.php?line="+encodeURIComponent(text)+"'></iframe>");
    } else {
        console.log($('#conversation > p:last-child').text());
    }
});