// ==UserScript==
// @name         Facepunch frontpage double column
// @version      0.1.3
// @description  Brings back the double column style
// @author       DrTaxi - Reagy
// @match        http://facepunch.com/
// @match        https://facepunch.com/
// @match        http://facepunch.com/forum.php
// @match        https://facepunch.com/forum.php
// @grant        none
// @namespace https://greasyfork.org/users/8353
// @downloadURL https://update.greasyfork.org/scripts/7473/Facepunch%20frontpage%20double%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/7473/Facepunch%20frontpage%20double%20column.meta.js
// ==/UserScript==

$(function(){
    $(".forums").first().next().nextAll().appendTo($("<td valign='top' class='FrontPageForums'></td>").insertAfter(".FrontPageForums"));
    $(".FrontPageForums").css("padding", "5px");
});