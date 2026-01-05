// ==UserScript==
// @name        Infractions Tab Remover
// @author      bls1999~
// @namespace   jiggmin
// @description Removes your infractions tab on Jiggmin.com.
// @include     http://jiggmin.com/members/USERID*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6974/Infractions%20Tab%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/6974/Infractions%20Tab%20Remover.meta.js
// ==/UserScript==

var a = document.getElementsByClassName("tabslight");
var b = a[0];
b.childNodes[11].remove();