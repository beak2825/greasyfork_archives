// ==UserScript==
// @name        Gmstatus adder 2
// @namespace   ag
// @description script redirector
// @include     https://mail.google.com/mail/u/0/h/*&v=c&checked=2
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8701/Gmstatus%20adder%202.user.js
// @updateURL https://update.greasyfork.org/scripts/8701/Gmstatus%20adder%202.meta.js
// ==/UserScript==

   var zNode       = document.createElement ('p');
    zNode.innerHTML = '<html><body><color=green>Mail is Spoofed</color></body></html>';
    document.getElementById ("myContainer").appendChild (zNode);