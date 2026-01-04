// ==UserScript==
// @name telepolis archiv entneubert js companion
// @description kleine ergänzung zum userstyle gleichen namens
// @namespace Violentmonkey Scripts
// @match https://archiv.telepolis.de/*
// @exclude https://archiv.telepolis.de/
// @grant none
// @author mihau
// @version 2.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549977/telepolis%20archiv%20entneubert%20js%20companion.user.js
// @updateURL https://update.greasyfork.org/scripts/549977/telepolis%20archiv%20entneubert%20js%20companion.meta.js
// ==/UserScript==

document.title='telepolis ("archiv"): ' + document.title.replace(" | Telepolis Archiv","");
document.querySelectorAll("div")[1].innerHTML='<a href="https://www.telepolis.de/">'+document.querySelectorAll("div")[1].innerHTML+'</a>';
