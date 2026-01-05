// ==UserScript==
// @name       jawz EricDashChan
// @version    1.0
// @author	   jawz
// @description  ---
// @match      https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9948/jawz%20EricDashChan.user.js
// @updateURL https://update.greasyfork.org/scripts/9948/jawz%20EricDashChan.meta.js
// ==/UserScript==

var businessPhone = $("p:contains('Phone Number to call:')");
var businessPText = businessPhone.text().trim().replace("Phone Number to call: ", "");
businessPText = businessPText.substring(0, 3) + "-" + businessPText.substring(3, businessPText.length);
businessPText = businessPText.substring(0, 7) + "-" + businessPText.substring(7, businessPText.length);
businessPhone.html("<b>Phone Number to call: </b>" + businessPText);