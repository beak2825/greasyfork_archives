// ==UserScript==
// @name      Frankie's Custom HF Header
// @namespace  http://use.i.E.your.homepage/
// @version    1.0
// @description  Adds various forums to the HF heading.
// @match      http://*/*
// @copyright  2015+, You
// @downloadURL https://update.greasyfork.org/scripts/8151/Frankie%27s%20Custom%20HF%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/8151/Frankie%27s%20Custom%20HF%20Header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='usercp.php'>UserCP</a> | </a> | <a href='search.php?action=getnew'>New Threads</a> | <a href='search.php'>Search</a> ";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);