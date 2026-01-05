// ==UserScript==
// @name        ZeroTurnAround.com-RemoveStickyFooter
// @namespace   https://github.com/VenkataRaju/GreaseMonkeyScripts/raw/master/ZeroTurnAround.com/ZeroTurnAround.com-RemoveStickyFooter
// @description Removes sticky footer from ZeroTurnAround.com
// @match       http://zeroturnaround.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6243/ZeroTurnAroundcom-RemoveStickyFooter.user.js
// @updateURL https://update.greasyfork.org/scripts/6243/ZeroTurnAroundcom-RemoveStickyFooter.meta.js
// ==/UserScript==

document.getElementById("ninja-footer").remove();