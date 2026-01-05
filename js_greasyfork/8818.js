// ==UserScript==
// @name         WK no idle
// @namespace    http://your.homepage/
// @version      0.1
// @description  Deletes the timeout element (If it causes problems I don't know about them)
// @author       Ethan
// @match        http*://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8818/WK%20no%20idle.user.js
// @updateURL https://update.greasyfork.org/scripts/8818/WK%20no%20idle.meta.js
// ==/UserScript==

var timeoutDiv = document.getElementById("timeout");

timeoutDiv.parentNode.removeChild(timeoutDiv);
