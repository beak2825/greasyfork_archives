// ==UserScript==
// @name        Neopets - Add Shop Till To Topbar
// @namespace   userscripts.org
// @description Adds amount of np in shop till to top of page
// @include     http://www.neopets.com/*
// @include     www.neopets.com/*
// @include     *neopets.com/*
// @require	http://code.jquery.com/jquery-latest.min.js
// @version 0.0.1.20160426232757
// @downloadURL https://update.greasyfork.org/scripts/5810/Neopets%20-%20Add%20Shop%20Till%20To%20Topbar.user.js
// @updateURL https://update.greasyfork.org/scripts/5810/Neopets%20-%20Add%20Shop%20Till%20To%20Topbar.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.neopets.com/market.phtml?type=till",
  onload: function(response) {
    GM_setValue("tillSource",response.responseText);
  }
});

$source = GM_getValue("tillSource");

$start = $source.indexOf("You currently have ");
$start = $start + 19;
$end = $source.indexOf(" in your till.");

$till = $source.substring($start,$end);
$till = $till.replace('<b>','');
$till = $till.replace(' NP</b>','');

$("span:contains('|'):eq(1)").prepend(" | ST: <a href='/market.phtml?type=till'>" + $till+ "</a> ");
