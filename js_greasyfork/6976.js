// ==UserScript==
// @name           inci yeni tema sikertmesi
// @description    turlu ibneliklere karşı
// @version        0.5
// @author         claw
// @include        http://inci.sozlukspot.com/*
// @include        http://ccc.incisozluk.cc/*
// @include        http://www.incisozluk.us/*
// @include        http://www.incisozluk.com.tr/*
// @exclude        http://*/y/login*
// @namespace https://greasyfork.org/users/7584
// @downloadURL https://update.greasyfork.org/scripts/6976/inci%20yeni%20tema%20sikertmesi.user.js
// @updateURL https://update.greasyfork.org/scripts/6976/inci%20yeni%20tema%20sikertmesi.meta.js
// ==/UserScript==
var url_sozluk = window.location.host;
var yeni_tema_bu = $("#ustbar_wrap");
if (yeni_tema_bu.length) {
       	GM_xmlhttpRequest({ method: "HEAD", url: "http://"+url_sozluk+"/index.php?c=yenit&t=1"});
    	window.location.href = "index.php";
}