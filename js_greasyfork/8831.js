// ==UserScript==
// @name       Warren B's custom header
// @namespace  http://use.i.E.your.homepage/
// @version    1.0.1
// @description  Adds "Buyers Bay | Website Construction | C/C++/Obj-C | PHP | Lounge | Groups"
// @include    *hackforums.net*
// @match      http://*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/8831/Warren%20B%27s%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/8831/Warren%20B%27s%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=44'>Buyers Bay</a> | <a href='forumdisplay.php?fid=50'>Website Construction</a> | <a href='forumdisplay.php?fid=117'>C/C++/Obj-C</a> |  <a href='forumdisplay.php?fid=154'>PHP</a> | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=53'>Groups</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
