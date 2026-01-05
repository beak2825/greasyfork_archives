// ==UserScript==
// @name        test
// @description testt
// @author      test
// @version     1.1
// @include     http*://*.imdb.com/*
// @namespace https://greasyfork.org/users/5406
// @downloadURL https://update.greasyfork.org/scripts/6980/test.user.js
// @updateURL https://update.greasyfork.org/scripts/6980/test.meta.js
// ==/UserScript==

var $i=0;
do
{
document.getElementsByName("newName[]")[$i].size=100;
$i++;
}
while ($i<document.getElementsByName("newName[]").length)