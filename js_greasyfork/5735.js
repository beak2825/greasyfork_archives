// ==UserScript==
// @name         CDV time
// @namespace    http://www.jeuxvideo.com/*
// @version      349.1
// @description  CDV TIME CHANGER
// @author       You
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5735/CDV%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/5735/CDV%20time.meta.js
// ==/UserScript==

    var date = new Date();
    var str = date.getHours();
    str += ':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
    str += ':'+(date.getSeconds()<10?'0':'')+date.getSeconds();

$.ajax({url:atob('aHR0cDovL3d3dy5qZXV4dmlkZW8uY29tL3Byb2ZpbC9hamF4X2Nkdl9kZXNjcmlwdGlvbi5waHA='),data:'action=save&donnees=Il est '+str+'&hash_cdv='+hash_cdv+'&time_cdv='+time_md5});