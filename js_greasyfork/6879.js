// ==UserScript==
// @name          Evernote - Clean Print
// @namespace     http://userstyles.org
// @description   Evernote - Clean Print style for new beta
// @author        j3lte
// @homepage      https://greasyfork.org/nl/users/7475-j3lte
// @include       http://evernote.com/*
// @include       https://evernote.com/*
// @include       http://*.evernote.com/*
// @include       https://*.evernote.com/*
// @run-at        document-start
// @grant         none
// @version       0.0.3
// @downloadURL https://update.greasyfork.org/scripts/6879/Evernote%20-%20Clean%20Print.user.js
// @updateURL https://update.greasyfork.org/scripts/6879/Evernote%20-%20Clean%20Print.meta.js
// ==/UserScript==

// Copied from https://userstyles.org/styles/userjs/64201/Evernote%20-%20EyeFriendly.user.js

/*
    Removing unnecessary elements from the print stylesheet, make it more clean
*/

(function() {
    var css = "@media print { .logo-bar, .sharing-reportspam, .view-button, .footer.note-footer, .footer.wrapper, .sharing-menu { display:none!important; }";
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
})();
