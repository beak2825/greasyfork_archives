// ==UserScript==
// @name       One+ custom header
// @namespace  http://use.i.E.your.homepage/
// @version    1.0.2
// @description  Adds "| Lounge | Zero | L'appel | Titans|"
// @match      http://www.hackforums.net/* 
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/9452/One%2B%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/9452/One%2B%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=230'>Zero</a> | <a href='forumdisplay.php?fid=236'>L'appel</a> | <a href='forumdisplay.php?fid=276'>Titans</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
