// ==UserScript==
// @name         Radar's furry.cz
// @namespace    http://radar.honor.es
// @include      http://www.furry.cz
// @author       Radar
// @description  This userscript is for giving site 'http://www.furry.cz' more modern look. Uses userscript made by Erik Vergobbi Vold & Tyler G. Hicks-Wright.
// @version      0.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7757/Radar%27s%20furrycz.user.js
// @updateURL https://update.greasyfork.org/scripts/7757/Radar%27s%20furrycz.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://code.jquery.com/jquery-2.1.3.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.$=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  $("table.vypistemat tr:nth-child(2n)").css("background-color", "rgba(255,255,255,0.05)");
  var book=$("table.oblibene").find("tr");
  for(var i=2; i<book.length; i=i+2){
    $(book[i]).css("background-color", "rgba(255,255,255,0.05)");
  };
}

// load jQuery and execute the main function
addJQuery(main);