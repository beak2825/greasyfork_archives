// ==UserScript==
// @name           Feedly Background Tab
// @namespace      http://github.com/dex1t
// @description    Open link by background tab for Feedly
// @include        http*://cloud.feedly.com/*
// @include        http*://feedly.com/*
// @grant          GM_openInTab
// @version 0.0.1.20150104093748
// @downloadURL https://update.greasyfork.org/scripts/7308/Feedly%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/7308/Feedly%20Background%20Tab.meta.js
// ==/UserScript==

// code '84' is 't'
var key = 84;

(function() {
  var onKeyDown = function(event) {
    if(event.keyCode == key && !event.shiftKey) {
     var target = document.getElementsByClassName('selectedEntry');
     if (target == null) {
       return;
     }
     link = target[0].getElementsByClassName('entryTitle')[0].href;
     GM_openInTab(link);
   }
 }
 document.addEventListener('keydown', onKeyDown, false);
})();
