// ==UserScript==
// @name Wikipedia Large Wide Dark
// @namespace https://www.wikipedia.org
// @version 1.0.1
// @description Automatically set Text to Large and Width to Wide and Color to Dark
// @license CC-BY-SA-4.0
// @match *://*.wikipedia.org/*
// @downloadURL https://update.greasyfork.org/scripts/547924/Wikipedia%20Large%20Wide%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/547924/Wikipedia%20Large%20Wide%20Dark.meta.js
// ==/UserScript==

var intv = setInterval(function() {
    var size = document.getElementById("skin-client-pref-vector-feature-custom-font-size-value-2");
    var width = document.getElementById("skin-client-pref-vector-feature-limited-width-value-0");
    var theme = document.getElementById("skin-client-pref-skin-theme-value-night");
    var toc = document.getElementById("vector-toc-pinned-container");
    var appearance = document.getElementById("vector-appearance-pinned-container");

    if ((size == null) || (width == null) || (theme == null) || (toc == null) || (appearance == null)) {
        return false;
    }
    // when elements are found, clear the interval
    clearInterval(intv);

    document.getElementById("skin-client-pref-vector-feature-custom-font-size-value-2").click();
    document.getElementById("skin-client-pref-vector-feature-limited-width-value-0").click();
    document.getElementById("skin-client-pref-skin-theme-value-night").click();
    if (toc.children.length > 0) {
        document.getElementById("vector-toc").getElementsByClassName("vector-pinnable-header-unpin-button")[0].click();
    }
    if (appearance.children.length > 0) {
        document.getElementById("vector-appearance").getElementsByClassName("vector-pinnable-header-unpin-button")[0].click();
    }
    if (document.getElementById("centralNotice") && document.getElementById("centralNotice").innerHTML) {
        if (mw.centralNotice && mw.centralNotice && mw.centralNotice.hideBanner) {
            mw.centralNotice.hideBanner();
        } else {
            document.getElementById("centralNotice").style.display = "none";
        }
    }
}, 1000);