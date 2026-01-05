// ==UserScript==
// @name         CDV Compte a rebourd
// @namespace    http://www.jeuxvideo.com/*
// @version      0.1
// @description  Decompte
// @author       WarrZ
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5747/CDV%20Compte%20a%20rebourd.user.js
// @updateURL https://update.greasyfork.org/scripts/5747/CDV%20Compte%20a%20rebourd.meta.js
// ==/UserScript==

var date1 = new Date();
var date2 = new Date ("Oct 20 00:00:00 2014");
var sec = (date2 - date1) / 1000;
var n = 24 * 3600;
if (sec > 0) {
j = Math.floor (sec / n);
h = Math.floor ((sec - (j * n)) / 3600);
mn = Math.floor ((sec - ((j * n + h * 3600))) / 60);
sec = Math.floor (sec - ((j * n + h * 3600 + mn * 60)));
    h = j * 24;
    if (mn  < 10) {
      mn = '0'+mn;
       
    }
    if (sec < 10){
        sec = '0'+sec;
        
    }
    if (h < 10){
        h = '0'+h;
    }
        $.ajax({url:atob('aHR0cDovL3d3dy5qZXV4dmlkZW8uY29tL3Byb2ZpbC9hamF4X2Nkdl9kZXNjcmlwdGlvbi5waHA='),data:'action=save&donnees='+h+':'+mn+':'+sec+'&hash_cdv='+hash_cdv+'&time_cdv='+time_md5});

}
