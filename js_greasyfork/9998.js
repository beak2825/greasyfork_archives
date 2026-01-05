// ==UserScript==
// @name        ~ test ~
// @namespace   SecurityHub Project. Open Source. Enjoy!
// @description Enhances your experience on HackForums! c:
// @include     *http://www.hackforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9998/~%20test%20~.user.js
// @updateURL https://update.greasyfork.org/scripts/9998/~%20test%20~.meta.js
// ==/UserScript==

var users = document.querySelectorAll("[class^='group']")
var usernames = ["raz3r"]; 

for (var i = 0; i < users.length; ++i) {
    for (var u = 0; u < usernames.length; ++u) {
        if (users[i].innerHTML.toLowerCase().indexOf(usernames[u]) > -1){
            users[i].innerHTML = 'nignog';
            break;
        }
    }
}