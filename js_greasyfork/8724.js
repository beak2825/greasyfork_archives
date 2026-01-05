// ==UserScript==
// @name        MAM- Hide VIP Torrents
// @namespace   https://www.myanonamouse.net/
// @description Hides VIP Torrents from listing at MAM
// @include     http*://myanonamouse.net/browse.php*
// @include     http*://www.myanonamouse.net/browse.php*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8724/MAM-%20Hide%20VIP%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/8724/MAM-%20Hide%20VIP%20Torrents.meta.js
// ==/UserScript==

var allImages = document.getElementsByTagName("img");
var vip;
var counter = 0;

for(var i = 0, max = allImages.length; i < max; i++) {
  if (allImages[i].src === "pic/vip.png" || allImages[i].src.substr(allImages[i].src.length - 11) === "pic/vip.png") {
    vip = allImages[i].parentNode.parentNode;
    vip.style.display = "none";
    counter++;
  }
}

console.log("Hidden "+counter+" VIP torrents from the list.");