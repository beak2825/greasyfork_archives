// ==UserScript==
// @name       Income. custom header
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Adds custom headers.
// @match      http://*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/6577/Income%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/6577/Income%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=276'>Titans</a> | <a href='forumdisplay.php?fid=2'>RANF</a> | <a href='forumdisplay.php?fid=81'>Sony</a> |  <a href='forumdisplay.php?fid=182'>Currency Exchange</a> | <a href='forumdisplay.php?fid=107'>Premium SS</a> | <a href='forumdisplay.php?fid=290'>GTA</a> | <a href='forumdisplay.php?fid=44'>Buyer's Bay</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
