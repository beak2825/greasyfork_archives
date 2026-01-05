// ==UserScript==
// @name         GMail Change Title
// @namespace    http://tagansvar.eu/
// @version      1.0
// @description  Change the GMail title and remove the unread message count!
// @author       Mikkel Kongsfelt
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5670/GMail%20Change%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/5670/GMail%20Change%20Title.meta.js
// ==/UserScript==

function hideUnread()
{
    document.title = 'Gmail';
}
var t=setInterval(hideUnread,10);
