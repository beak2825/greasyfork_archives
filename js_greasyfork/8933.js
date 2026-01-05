// ==UserScript==
// @name         The Grey Pill
// @namespace    http://www.reddit.com/r/thebutton
// @version      0.1
// @description  Prevents the consequences of casual button clicks 
// @author       Ray57
// @match        http://www.reddit.com/r/thebutton*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8933/The%20Grey%20Pill.user.js
// @updateURL https://update.greasyfork.org/scripts/8933/The%20Grey%20Pill.meta.js
// ==/UserScript==


document.getElementById("thebutton").disabled = true; 
