// ==UserScript==
// @name        Gmstatus adder
// @namespace   ag
// @description mobility
// @include     https://mail.google.com/mail/u/0/h/*&v=c&checked=1
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8700/Gmstatus%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/8700/Gmstatus%20adder.meta.js
// ==/UserScript==

   var zNode       = document.createElement ('p');
    zNode.innerHTML = '<color=green>Mail is Not Spoofed</color>';
    document.getElementById ("myContainer").appendChild (zNode);