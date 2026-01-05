// ==UserScript==
// @namespace     http://fb.me/manlonely4ev
// @author        dinhtai92dn
// @name          iframe killer
// @description   deletes all iframes from a web page
// @include       http://system.alexamaster.com/votetest*
// @version 0.0.1.20150331100455
// @downloadURL https://update.greasyfork.org/scripts/8895/iframe%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/8895/iframe%20killer.meta.js
// ==/UserScript==

while((el=document.getElementsByTagName('iframe')).length){el[0].parentNode.removeChild(el[0]);}
