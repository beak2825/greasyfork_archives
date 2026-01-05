// ==UserScript==
// @name        Posteo smaller theme
// @namespace   posteo
// @description Change the new posteo design to fit on smaller screens
// @include     https://posteo.de/webmail/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9148/Posteo%20smaller%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/9148/Posteo%20smaller%20theme.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    console.log("gm-script --> addGlobalStyle (" + css + " )");
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('#topline{padding:0px!important;}');
addGlobalStyle('#topline span.username{font-size:10px!important;}');
addGlobalStyle('#taskbar a{font-size:10px!important;padding:2px 8px!important;}');
addGlobalStyle('#mainscreen{bottom:2px !important;left:2px !important;right:2px!important;top:54px!important;}');
addGlobalStyle('#quicksearchbar #searchmenulink{top:5px !important;}');
addGlobalStyle('#quicksearchbar #searchreset{top:5px !important ;}.toolbar a.button::before{font-size:16px;}');
addGlobalStyle('#topnav {min-height: 20px !important;}');
addGlobalStyle('#mailboxcontainer, #messagelistcontainer {top: 35px !important;}');
addGlobalStyle('#mailview-right {top: -14px !important}');
addGlobalStyle('#mailview-top {top: 14px !important;}');
addGlobalStyle('#mailpreviewframe {border-bottom: 18px!important;}');
addGlobalStyle('#rcmflag{width: 20px;!important;}');
addGlobalStyle('#rcmattachment{width: 20px!important;}');