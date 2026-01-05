// ==UserScript==
// @name        Mail.ru: WE NO NEED AUTOPLAY
// @namespace   lainscripts_mailru_stop_autoplay
// @include     *.mail.ru/video/*
// @version     1.3
// @grant       none
// @description Tries to disable autoplay feature for video on mail.ru.
// @downloadURL https://update.greasyfork.org/scripts/6570/Mailru%3A%20WE%20NO%20NEED%20AUTOPLAY.user.js
// @updateURL https://update.greasyfork.org/scripts/6570/Mailru%3A%20WE%20NO%20NEED%20AUTOPLAY.meta.js
// ==/UserScript==
var frames = document.querySelectorAll('iframe[src*="autoplay="]'), i = frames.length, a1, a2;
while (i--) {
    a1 = frames[i].src.split('autoplay=');
    if (a1.length != 2 || ['?','&'].indexOf(a1[0][a1[0].length-1]) < 0) continue;
    a2 = a1[1].split('&');
    a2.shift();
    if (a2.length == 0) frames[i].src = a1[0].slice(0,-1);
    else frames[i].src = a1[0] + a2.join('&');
}
