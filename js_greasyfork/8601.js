// ==UserScript==
// @name        Google: Skip Country Sites
// @namespace   yama-masa.com
// @description Re-redirect back to Google.com when you are taken to your local Google domain despite having sent request to Google.com
// @include     https://*.google.tld/*
// @exclude     https://*.google.com/*
// @noframes
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8601/Google%3A%20Skip%20Country%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/8601/Google%3A%20Skip%20Country%20Sites.meta.js
// ==/UserScript==
// Note: When your browser have sent request to your local Google domain such as google.de, google.com.au, etc., the link to google.com ("Use Google.com", for example) doesn't appear in the footer area. This script will do nothing in such a case.
(function() {
    "use strict";
    var xPath = "descendant::a[@class='_Gs' and contains(text(),'Google.com')]";
    var link2Com = document.evaluate(xPath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (link2Com !== null) {
        var modURL = link2Com.href.replace(/&ei=[-\w]+/, ""); // Remove malicious parameter, probably used for tracking
        var win = window.location.replace(modURL);
    }
})();