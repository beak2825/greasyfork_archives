// ==UserScript==
// @name        Click alle 4min
// @namespace   clicker
// @include     http://e-learn.provinz.bz.it/*
// @version     1
// @description Klickt alle 4min auf weiter
// @author		Daniel MIotto
// @downloadURL https://update.greasyfork.org/scripts/6248/Click%20alle%204min.user.js
// @updateURL https://update.greasyfork.org/scripts/6248/Click%20alle%204min.meta.js
// ==/UserScript==


setInterval(function () {document.getElementsByClassName("ilc_page_rnavlink_RightNavigationLink")[0].click();}, 240000);