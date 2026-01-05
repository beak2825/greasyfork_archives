// ==UserScript==
//
// @name            EKINO.TV fixer
// @description     Various fixes for ekino.tv 
// @author          Daniel Skowroński <daniel@dsinf.net>
// @version         0.1
// @match           http://www.ekino.tv/*
//
// @namespace https://greasyfork.org/users/10018
// @downloadURL https://update.greasyfork.org/scripts/8827/EKINOTV%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/8827/EKINOTV%20fixer.meta.js
// ==/UserScript==

function addjQuery(callback) {  //ładowanie jQueryego dla wszystkich platform
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
  //001 - better player height
  var player_height=400;
  $(".playersContainer").css("height", player_height+40+"px");
  $("#free_player").css("height", player_height+40+"px");
  $("#free_player iframe").css("height", player_height+"px");
}

addjQuery(main);//ładuj jQ 