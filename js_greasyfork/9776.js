// ==UserScript==
// @name         Reddit Link Name Highlighter
// @namespace    http://robertmeta.com
// @version      0.1
// @description  When you are linked to a comment, sometimes you want to see all the other comments by that person, this does that and nothing else
// @author       Robert Melton
// @include      http*://www.reddit.com/r/*/comments/*/*/*
// @exclude      http*://www.reddit.com/r/*/comments/*/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9776/Reddit%20Link%20Name%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/9776/Reddit%20Link%20Name%20Highlighter.meta.js
// ==/UserScript==
var commentSection = document.getElementsByClassName('sitetable nestedlisting');
var linksInCommentSection = commentSection[0].getElementsByTagName("a");
var originalPersonLink = "";
var color = "lightgreen";
for ( i = 0; i < linksInCommentSection.length; i++ ) { 
    if (linksInCommentSection[i].href.match("user")) { 
        if (originalPersonLink === "") { // first person
            originalPersonLink = linksInCommentSection[i].href;
        }
        if (linksInCommentSection[i].href.match(originalPersonLink)) {
            linksInCommentSection[i].style.background = color;
        }
    }
}
