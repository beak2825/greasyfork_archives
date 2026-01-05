// ==UserScript==
// @name        BlackStarmapBackground
// @namespace   by guardian
// @description Changes background image to a black one in War-facts Starmap Javascript V2
// @include     *.war-facts.com/extras/view_universe.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9750/BlackStarmapBackground.user.js
// @updateURL https://update.greasyfork.org/scripts/9750/BlackStarmapBackground.meta.js
// ==/UserScript==

(function() {
var mydiv = document.getElementById("starMapContainer");
  mydiv.style.backgroundImage = "none";
  document.body.style.backgroundColor="#000000";
})();