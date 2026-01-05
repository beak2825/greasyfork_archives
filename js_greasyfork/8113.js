// ==UserScript==
// @name        DMM.FlashVersionHacker
// @namespace   Gizeta.Debris.Dmm.FlashVersionHacker
// @author      Gizeta <0w0@gizeta.tk>
// @description Hack DMM's Flash version checker
// @include     http://osapi.dmm.com/gadgets/ifr?*
// @version     1.0.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8113/DMMFlashVersionHacker.user.js
// @updateURL https://update.greasyfork.org/scripts/8113/DMMFlashVersionHacker.meta.js
// ==/UserScript==

injectScript = function(src) {
    var scriptEl;
    scriptEl = document.createElement('script');
    scriptEl.innerHTML = "(" + (src.toString()) + ")();";
    return document.head.appendChild(scriptEl);
};

injectScript(function() {
  gadgets.flash.getMajorVersion = function() {
    return "11";
  };
});