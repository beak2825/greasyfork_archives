// ==UserScript==
// @name       Hide Alerts
// @version    1.0
// @description  Hides the green and red alert boxes
// @author     jawz
// @require http://code.jquery.com/jquery-latest.min.js
// @match https://www.mturk.com/*
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/7336/Hide%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/7336/Hide%20Alerts.meta.js
// ==/UserScript==

$('h6:contains("The HIT")').parent().hide();
$('h6:contains("Your results have been submitted")').parent().hide();
$('h6:contains("You have already returned this HIT")').parent().hide();