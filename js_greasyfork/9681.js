// ==UserScript==
// @name       Joclings. custom header
// @namespace  http://use.i.E.your.homepage/
// @version    1.0
// @description  Adds various hyperlinks to HF header
// @match      http://www.hackforums.net/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/9681/Joclings%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/9681/Joclings%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=2'>RANF</a> | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=4'>Beginner Hacking</a> |  <a href='forumdisplay.php?fid=307'>Adv Hacking</a> | <a href='forumdisplay.php?fid=10'>Hacking Tools/Programs</a> | <a href='forumdisplay.php?fid=110'>WHH</a> | <a href='forumdisplay.php?fid=297'>JTAG</a> | <a href='forumdisplay.php?fid=73'>Counter Strike</a> | <a href='forumdisplay.php?fid=112'>Anime Adventures</a> | <a href='forumdisplay.php?fid=239'>AnimeFAN!</a> | <a href='forumdisplay.php?fid=52'>Groups</a> | <a href='forumdisplay.php?fid=318'>Vices</a> | <a href='forumdisplay.php?fid=128'>SRPP</a> | <a href='forumdisplay.php?fid=173'>Gay Requests</a> | <a href='forumdisplay.php?fid=174'>Giveaways</a> | <a href='forumdisplay.php?fid=93'>Adv Methods</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
