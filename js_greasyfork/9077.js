// ==UserScript==
// @name         The Grey Guard
// @namespace    http://www.reddit.com/r/thebutton
// @version      0.3
// @description  Prevents casual button clicks 
// @author       Ray57
// @match        http://www.reddit.com/r/thebutton*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9077/The%20Grey%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/9077/The%20Grey%20Guard.meta.js
// ==/UserScript==

// Ver 0.2: Added Button Colour Changer from:
//      http://www.reddit.com/r/thebutton/comments/320p3v/color_changing_header/cq6xnqz

// Ver 0.3: Removed Button Colour Changer (better in an independant script)

var b = document.getElementById("thebutton")
var bc = b.parentNode;

b.disabled = true; 

var div = document.createElement("div");
div.className = "thebutton-container locked active";

bc.parentNode.insertBefore(div, bc);

while (bc.childNodes.length > 0) {
    div.appendChild(bc.childNodes[0]);
}

bc.style.display = 'none';