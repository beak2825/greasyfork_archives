// ==UserScript==
// @name       Autothanker
// @version    0.1
// @description  Thanks everything. Why? Why not!
// @match      http://mturkforum.com/showthread.php*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/6338/Autothanker.user.js
// @updateURL https://update.greasyfork.org/scripts/6338/Autothanker.meta.js
// ==/UserScript==

$("a[class=post_thanks_button]:visible").each(function() { $(this).click(); });