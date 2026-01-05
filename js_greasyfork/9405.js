// ==UserScript==
// @name         Spacecowboy Hide
// @version      0.1
// @description  Hide all the spacecowboys o/
// @author       Ghost
// @include      http://myanimelist.net/manga*
// @include      http://myanimelist.net/anime*
// @grant        none
// @namespace https://greasyfork.org/users/10763
// @downloadURL https://update.greasyfork.org/scripts/9405/Spacecowboy%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/9405/Spacecowboy%20Hide.meta.js
// ==/UserScript==

  $("td.borderClass:contains('spacecowboy')").css("display", "none");