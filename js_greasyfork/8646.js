// ==UserScript==
// @name 		Alex:hide-nonew-forum-support-blackberry
// @namespace	http://supportforums.blackberry.com/
// @description	hide threads with no new messages
// @include		http://supportforums.blackberry.com/t5/*
// @version 0.0.1.20150819230018
// @downloadURL https://update.greasyfork.org/scripts/8646/Alex%3Ahide-nonew-forum-support-blackberry.user.js
// @updateURL https://update.greasyfork.org/scripts/8646/Alex%3Ahide-nonew-forum-support-blackberry.meta.js
// ==/UserScript==

var AllA = document.getElementsByTagName('a');
var i;
for (i=0;i<AllA.length;i++) {
    if ('NewMessagesCount lia-link-navigation' == AllA[i].getAttribute('class'))
        if (0==AllA[i].childNodes[0].nodeValue) 
            AllA[i].parentNode.parentNode.setAttribute('style','display:none;');
}