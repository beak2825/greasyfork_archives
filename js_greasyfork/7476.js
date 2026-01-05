// ==UserScript==
// @name        steamcard updater
// @namespace   jiggmin
// @include     http://jiggmin.com/members/*
// @version     1
// @grant       none
// @description uses a non-deprecated steamcard service
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/7476/steamcard%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/7476/steamcard%20updater.meta.js
// ==/UserScript==


var name = document.getElementsByClassName("gamercard")[0].firstChild.innerHTML.split("/")[5].split(".")[0]
 
document.getElementsByClassName("gamercard")[0].innerHTML = '<a href="http://steamcommunity.com/id/' + name +'" target="_blank"><img src="http://steamsignature.com/status/english/' + name + '.png" alt="" width="240" style="margin-left: -3px;"></a>'