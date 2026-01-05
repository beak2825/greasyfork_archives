// ==UserScript==
// @name      Spirit's Custom HF Header
// @namespace  http://use.i.E.your.homepage/
// @version    1.0
// @description  Adds various forums to the HF heading.
// @match      http://*/*
// @copyright  2015+, You
// @downloadURL https://update.greasyfork.org/scripts/8154/Spirit%27s%20Custom%20HF%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/8154/Spirit%27s%20Custom%20HF%20Header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=25'>Cool Memes</a> | </a> | <a href='forumdisplay.php?fid=195'>Gay shit</a> |";