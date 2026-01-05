// ==UserScript==
// @name       Cyrus custom header
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Adds various shortcuts
// @match      http://*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/6578/Cyrus%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/6578/Cyrus%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=32'>Movies & TV</a> | <a href='forumdisplay.php?fid=128'>SRPP</a> |  <a href='forumdisplay.php?fid=236'>Marketplace Discussions</a> | <a href='forumdisplay.php?fid=206'>Member Auctions</a> | <a href='forumdisplay.php?fid=44'>Buyers Bay</a> | <a href='forumdisplay.php?fid=187'>Giveaways</a> | <a href='forumdisplay.php?fid=89'>News & Happenings</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
