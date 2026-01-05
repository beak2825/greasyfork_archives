// ==UserScript==
// @name        onnotfocus unload tab and save CPU!
// @namespace   onnotfocus unload tab and save CPU!
// @description This script detect if you are using a tab or not, if not it unload unused tab using display:none and save your CPU Usage, this script reduce CPU Usage drastically because it unload flash, gif, everything that cause animation and eat up your CPU Usage.
// @include     *
// @version     1
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/6359/onnotfocus%20unload%20tab%20and%20save%20CPU%21.user.js
// @updateURL https://update.greasyfork.org/scripts/6359/onnotfocus%20unload%20tab%20and%20save%20CPU%21.meta.js
// ==/UserScript==

document.addEventListener("visibilitychange", function() {
if (document.visibilityState == "hidden") {
document.documentElement.style.display = "none";
}
else
{
document.documentElement.style.display = "block";
}
});