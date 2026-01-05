// ==UserScript==
// @name         Pistonheads Ad Hider
// @namespace    http://mbignell.com/
// @version      0.2
// @description  Hide advertisements on pistonheads.com
// @author       You
// @match        http://www.pistonheads.com/gassing/topic.asp?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8867/Pistonheads%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/8867/Pistonheads%20Ad%20Hider.meta.js
// ==/UserScript==

document.getElementsByClassName("mpu")[0].setAttribute("hidden","true");
