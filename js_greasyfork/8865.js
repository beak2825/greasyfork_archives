// ==UserScript==
// @name           Neopets - Turn Off Shop Code
// @description    Removes user code from shops.
// @include        *neopets.com/browseshop*
// @match          *neopets.com/browseshop*
// @version        2.0
// @updated        06.02.2023
// @namespace https://greasyfork.org/users/6099
// @downloadURL https://update.greasyfork.org/scripts/8865/Neopets%20-%20Turn%20Off%20Shop%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/8865/Neopets%20-%20Turn%20Off%20Shop%20Code.meta.js
// ==/UserScript==

var e = document.getElementsByClassName('content')[0];
e.innerHTML = e.innerHTML.replace(/<!-- desc start -->[\s\S]*<!-- desc end -->/ig, "");