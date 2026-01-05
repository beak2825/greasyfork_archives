// ==UserScript==
// @name             Dreamwidth Site Skin Detector
// @namespace        dreamwidth
// @description      Add classes to BODY when site-skin selectors are detected. Works for Tropospherical, Celerity and Gradation.
// @include          http://*.dreamwidth.org/*, https://*.dreamwidth.org/*
// @grant            none
// @version          1.1
// @downloadURL https://update.greasyfork.org/scripts/6096/Dreamwidth%20Site%20Skin%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/6096/Dreamwidth%20Site%20Skin%20Detector.meta.js
// ==/UserScript==

(function() {
    var bodytag = document.getElementsByTagName("body")[0];
    var alpha = document.getElementById("shim-alpha");
    var deco = document.getElementById("page-decoration");
    var horizontal = document.getElementsByClassName("horizontal-nav");
    var vertical = document.getElementsByClassName("vertical-nav");
        if (alpha) { bodytag.className += " " + "tropo"; }
        else if (deco) { bodytag.className += " " + "celerity"; }
        else if (horizontal) { bodytag.className += " " + "gradation-horizontal"; }
        else if (vertical) { bodytag.className += " " + "gradation-vertical"; }

    var loggedout = document.getElementById("login-table");
        if (loggedout) { bodytag.className += " " + "loggedout"; }

    var editprofile = document.getElementById("page_manageprofile");
        if (editprofile) { bodytag.className += " " + "editprofile"; }

    var inbox = document.getElementById("page_inbox");
        if (inbox) { bodytag.className += " " + "inbox"; }

})();