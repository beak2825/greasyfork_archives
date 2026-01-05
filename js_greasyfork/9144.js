// ==UserScript==
// @name        loop ylilauta videos
// @namespace   ylilauta
// @description loop ylilauta videos by adding a "loop" attribute to video tags
// @include     http://ylilauta.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9144/loop%20ylilauta%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/9144/loop%20ylilauta%20videos.meta.js
// ==/UserScript==

videos = document.evaluate('//video', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
for (var i = 0; i < videos.snapshotLength; i++) {
  var vid = videos.snapshotItem(i);
  vid.loop = "true";
}