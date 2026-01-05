// ==UserScript==
// @name         Uneddit Reddit
// @namespace    http://kmcdeals.com
// @version      1
// @description  Uneddits Reddit comments
// @author       Kmc
// @match        https://*.reddit.com/r/*/comments/*
// @match        http://*.reddit.com/r/*/comments/*
// @grant   	 GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7025/Uneddit%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/7025/Uneddit%20Reddit.meta.js
// ==/UserScript==

GM_addStyle ("\
#uneddit{\
    position: fixed;\
    bottom: 0px;\
    right: 0px;\
    z-index: 9999999;\
    background-color: #fafbfc;\
    border-color: black;\
    outline: 0px;\
    border-width: 0px;\
    border-top-width: 1px;\
    border-left-width: 1px;\
    border-top-left-radius: 5px;\
}\
");

var button = document.createElement('input');
button.setAttribute("type", "button");
button.setAttribute("name", "uneddit");
button.setAttribute("id", "uneddit");
button.setAttribute("value", "uneddit");
button.setAttribute("onclick", "javascript:void((function(){var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src', 'http://uneddit.com/loadCommentsFull.php');document.body.appendChild(e)})());");
document.body.appendChild(button);
