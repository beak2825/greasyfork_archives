// ==UserScript==
// @name        Ninja text
// @namespace   awkward_potato
// @description auto ninja text
// @include     https://forums.oneplus.net/threads/144608/*
// @version     1.0
// @author      awkward_potato
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7013/Ninja%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/7013/Ninja%20text.meta.js
// ==/UserScript==
$('input.primary:first').click(function() {
    var frame = document.getElementsByClassName('redactor_textCtrl')[0].contentWindow.document.getElementsByTagName("body")[0];
    var a = document.getElementsByClassName('redactor_textCtrl')[0].contentWindow.document.getElementsByTagName("p");
    
    a[0].innerHTML = '[COLOR=#ffffff]'+a[0].innerHTML;
    a[a.length - 1].innerHTML = a[a.length - 1].innerHTML +'[/COLOR]';
    
    var message = frame.innerHTML;
    var p2 = message.match(/(\[\/QUOTE\])/igm);
    
    var numMisc = (p2 === null) ? 0 : p2.length;
    message = message.replace(/(\[QUOTE[\s\S]*?\])/igm, '[QUOTE][COLOR=#ecebea]');
    message = message.replace(/(style\=\"color\: \#ffffff\")/igm,'');
    
    for (var i = 0; i < numMisc; i++) {message = message.replace(/(\[\/QUOTE\])/im, '[/COLOR]'+p2[i]);}
    frame.innerHTML = message;
});