// ==UserScript==
// @name         Incognito look of disapproval
// @namespace    http://www.google.com/
// @version      0.1
// @description  Google dissaproves of your icognito activities: http://www.reddit.com/r/funny/comments/368xl5/this_should_be_googles_logo_when_you_open_it_in/
// @author       @aproctor
// @match        https://www.google.com/*
// @match        https://www.google.ca/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9930/Incognito%20look%20of%20disapproval.user.js
// @updateURL https://update.greasyfork.org/scripts/9930/Incognito%20look%20of%20disapproval.meta.js
// ==/UserScript==

if (GM_info.isIncognito) {
    document.getElementById('hplogo').style.backgroundImage = "url('http://i.imgur.com/jCxpBrW.jpg')";
}


