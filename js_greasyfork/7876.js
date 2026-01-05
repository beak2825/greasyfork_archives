// ==UserScript==
// @name           Finya Logout Unreminder
// @include        http://*.finya.de/*
// @description    Remove logout reminder
// @version        0.0.3
// @namespace https://greasyfork.org/users/8629
// @downloadURL https://update.greasyfork.org/scripts/7876/Finya%20Logout%20Unreminder.user.js
// @updateURL https://update.greasyfork.org/scripts/7876/Finya%20Logout%20Unreminder.meta.js
// ==/UserScript==

if (reminderHeading = document.evaluate( "//h1[contains(@style,'background-image:url(/img/nav_logout.png);')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)) {
    reminderDiv = reminderHeading.snapshotItem(0).parentNode;
    reminderDiv.parentNode.removeChild(reminderDiv);
}
