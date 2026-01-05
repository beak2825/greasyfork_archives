// ==UserScript==
// @name       jawz DCF
// @author		jawz
// @version    1.0
// @description DCF
// @match      https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9893/jawz%20DCF.user.js
// @updateURL https://update.greasyfork.org/scripts/9893/jawz%20DCF.meta.js
// ==/UserScript==

tbl = document.getElementsByClassName("task_parameters")[0];
console.log(tbl.rows[0].cells[1].innerHTML);
var elink = document.links
elink[1].href = "http://www.sec.gov/cgi-bin/series?company=" + tbl.rows[0].cells[1].innerHTML;