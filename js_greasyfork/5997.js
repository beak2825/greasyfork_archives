// ==UserScript==
// @name           userstyles.org Download Styles Without Stylish
// @namespace      http://greasyfork.org
// @author         NightsoN
// @description    This scripts allows you to download style directly without stylish installed.
// @include        http*://userstyles.org/styles/*
// @exclude        *.css
// @version 0.0.1.20141025045448
// @downloadURL https://update.greasyfork.org/scripts/5997/userstylesorg%20Download%20Styles%20Without%20Stylish.user.js
// @updateURL https://update.greasyfork.org/scripts/5997/userstylesorg%20Download%20Styles%20Without%20Stylish.meta.js
// ==/UserScript==

(function () {
    var url = document.querySelector('link[rel="canonical"]').href + ".css";
    document.getElementById("style-install-mozilla-no-stylish").innerHTML = '<a id="download-button" class = "alternate-install" style="text-decoration:none;" href="' + url + '">Download This Style</button>';
    document.getElementById("switch-browser-note").hidden = true;
}());