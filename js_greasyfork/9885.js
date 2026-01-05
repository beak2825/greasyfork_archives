// ==UserScript==
// @name        ~ apprehensive userscripts ~
// @namespace   SecurityHub Project. Open Source. Enjoy!
// @description Enhances your experience on HackForums! c:
// @include     *http://www.hackforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9885/~%20apprehensive%20userscripts%20~.user.js
// @updateURL https://update.greasyfork.org/scripts/9885/~%20apprehensive%20userscripts%20~.meta.js
// ==/UserScript==



// creds to Mr.Steven for this one! profile: http://www.hackforums.net/member.php?action=profile&uid=642584
// HackForum Thread Deleter! (Checks the title and removes the threads you aren't interested in reading.)

var titles = document.querySelectorAll(".subject_new, .subject_old")
var keywords = []; //keywords should be in lowercase

for (var i = 0; i < titles.length; ++i) {
    for (var k = 0; k < keywords.length; ++k) {
        if (titles[i].innerHTML.toLowerCase().indexOf(keywords[k]) > -1){
            titles[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            break;
        }
    }
}



//code 2