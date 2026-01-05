// ==UserScript==
// @name          Planets.nu - Player Select Plugin
// @description   Adds player selecter for finished games.
// @include       http://*.planets.nu/*
// @include       http://planets.nu/*
// @version 0.1
// @namespace https://greasyfork.org/users/7189
// @downloadURL https://update.greasyfork.org/scripts/8569/Planetsnu%20-%20Player%20Select%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/8569/Planetsnu%20-%20Player%20Select%20Plugin.meta.js
// ==/UserScript==

/*------------------------------------------------------------------------------
Adds dropdown in finished games to switch between players' perspectives.

Note: will hang the client if you try to go to the last turn using the time
machine or shortcut key 'o'. If this happens, you will need to refresh to fix.
You can however, view other players' last turns using the dropdown.
------------------------------------------------------------------------------*/

function wrapper () { // wrapper for injection

    
var pluginName = "PlayerSelect";
var mintoolkit = 5;

if (!vgap) return;
if (vgap.version < 3) return;

if (!vgap.toolkit || !vgap.toolkit.version || vgap.toolkit.version < mintoolkit) {
    var html = "<div class=ToolkitWarning style='width: 600px; height: 200px; position: absolute; top: 50%; left: 50%; margin-left: -310px; margin-top: -110px; padding: 20px; background-color: #888888'>";
    html    += "<div style='width: 100%; text-align: right;'><a onclick='$(\"div.ToolkitWarning\").remove(); return false;'><span style='padding: 5px; background-color: #aaaaaa; cursor: pointer;'>X</span></a></div>";
    html    += "WARNING: Toolkit Not Installed or Needs Update<br><br>";
    html    += "The plugin <span style='font-style: italic;'>" + pluginName + "</span> requires the Planets.nu Plugin Toolkit to be installed.<br><br>";
    html    += "To install the latest toolkit, click <a href='http://planets.nu/_library/toolkit/install.html' target='_blank'>HERE</a><br>";
    html    += "(You will need to exit any open game and refresh your browser after installing)<br><br>";    
    html    += "Note: If you have installed the toolkit and are still getting this error, you may need to adjust the script execution order so that the toolkit is run first.</div>";
    $("body").append(html);
    return;
}
    
var plugin = {
    name: pluginName,
    
    processload: function () {
        if (vgap.game.status == 3 && $("#PlayerSelect").length == 0) {
            var html = "<select id='PlayerSelect' onchange='vgap.player.id=this.value; vgap.loadHistory(vgap.game.turn);'></select>";
            vgap.logoBar.append(html);
        }
        if ($("#PlayerSelect").length > 0) {
            this.updatePlayers(); 
        }
    },
    
    updatePlayers: function () {
        var html = "";
        for (var i = 0; i < vgap.players.length; i++) {
            var id = vgap.players[i].id;
            html += "<option value=" + id + " " + (id == vgap.player.id ? "selected" : "") + ">" + vgap.players[i].fullname + "</option>";
        }
        $("#PlayerSelect").html(html);
    }
}
vgap.toolkit.registerPlugin(plugin);


} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script); 
document.body.removeChild(script);  