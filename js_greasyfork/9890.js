// ==UserScript==
// @name         Agar.io Connector w/New Defaults
// @namespace    http://your.homepage/
// @version      2.0
// @description  Essentially a combo of the new Defaults and connector.
// @author       RyukTheShinigami
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9890/Agario%20Connector%20wNew%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/9890/Agario%20Connector%20wNew%20Defaults.meta.js
// ==/UserScript==
setDarkTheme(true); //Turns on Dark theme
setShowMass(true); //displays your mass
setGameMode(':experimental'); //for experimental - ':experimental', for FFA - '', for Teams - ':teams', for Party - ':party'
setNick("Sir"); //sets your nick

$(document).ready(function() {
    var new_entry = $("#region");
    if (new_entry.length) {
        //This creates the dialogue box for the ip address
        $("<div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"255.255.255.255:443\" maxlength=\"20\"></input></div>").insertAfter("#mainPanel > form > div:nth-child(3)");
        //this creates the connect button that actually puts you on the server.
        $("<div class=\"form-group\"><button disabled type=\"button\" id=\"connectBtn\" class=\"btn btn-warning btn-needs-server\" onclick=\"connect('ws://' + $('#serverInput').val());\" style=\"width: 100%\">Connect</button></div>").insertAfter($("#serverInput").parent());
    }
});