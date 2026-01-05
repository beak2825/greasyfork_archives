// ==UserScript==
// @name			Outlook.com cleaner
// @description		Cleans Outlook.com interface (better ad-removal)
// @author			Daniel Skowroński <daniel@dsinf.net>
// @version			0.1
// @match			https://*.mail.live.com/*
//

// @namespace https://greasyfork.org/users/10018
// @downloadURL https://update.greasyfork.org/scripts/8826/Outlookcom%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/8826/Outlookcom%20cleaner.meta.js
// ==/UserScript==

function addjQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
    jQuery( document ).ready(function() {
        jQuery(".ContentRight").css("right","0");
        jQuery("#RightRailContainer").css("display","none");
    });
}

addjQuery(main);