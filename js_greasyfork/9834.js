// ==UserScript==
// @description remove ads virgin media search
// @name     remove ads virginmedia search
// @include  *advancedsearch2.virginmedia.com*
// @require  https://code.jquery.com/jquery-2.1.3.min.js
// @version     1.0
// @namespace remove ads virgin media search
// @downloadURL https://update.greasyfork.org/scripts/9834/remove%20ads%20virginmedia%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/9834/remove%20ads%20virginmedia%20search.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://code.jquery.com/jquery-2.1.3.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
$('div.results-block:contains("Sponsored results")').hide()
}

// load jQuery and execute the main function
addJQuery(main);     