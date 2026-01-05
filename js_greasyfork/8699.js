// ==UserScript==
// @name        GmailRedirecter
// @namespace   ag
// @description Gmail Redirector
// @include     https://mail.google.com/mail/u/0/h/*&v=om&checked=1
// @include     https://mail.google.com/mail/u/0/h/*&v=om&checked=2
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8699/GmailRedirecter.user.js
// @updateURL https://update.greasyfork.org/scripts/8699/GmailRedirecter.meta.js
// ==/UserScript==

var c=document.URL;
var b=c.replace("v=om","v=c");
//var d=b.replace("&checked=1","");
document.location.href=b;

