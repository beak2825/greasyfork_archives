// ==UserScript==
// @name         MSPARP_BBCodePreview
// @namespace    http://www.msparp.com/
// @version      0.3
// @description  Live BBCODE preview on msparp.
// @author       nepeat, GREEN SUN
// @match        http://*.msparp.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7545/MSPARP_BBCodePreview.user.js
// @updateURL https://update.greasyfork.org/scripts/7545/MSPARP_BBCodePreview.meta.js
// ==/UserScript==
 
function update() {
    var isglobal = $('#online > li.globalmod.self').length > 0;
    if ($('#preview').html() == "&nbsp;") return;
    line = bbEncode(htmlEncode(linkify($('#preview').html())), isglobal);
    $('#preview').html(line);
}

$("#preview").css("min-height", "12px");
$('#textInput').change(update).keyup(update).change();