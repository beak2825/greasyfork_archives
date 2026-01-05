// ==UserScript==
// @name          Planets.nu - Message Links Plugin
// @description   Adds links to ships/planets/bases in reports and messages.
// @include       http://*.planets.nu/*
// @include       http://planets.nu/*
// @version 1.0
// @namespace https://greasyfork.org/users/7189
// @downloadURL https://update.greasyfork.org/scripts/6686/Planetsnu%20-%20Message%20Links%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/6686/Planetsnu%20-%20Message%20Links%20Plugin.meta.js
// ==/UserScript==

/*------------------------------------------------------------------------------
This add-on improves inter-player communications by adding links into the 
message to replace strings of the following formats:

s#XXX
p#XXX
b#XXX

where s, p, b are for ship, planet, base respectively, and XXX is the id 
number of the object. The # may be omitted. If the object is found, 
the text is replace by a link including the name, that when clicked
selects the object on the map. 

Example, the string:

s#42

will be replaced by a link similar to "S#42: GOBRIE CLASS BATTLE CARRIER", 
which will also select that ship when clicked.

Version History:
0.3 Adds notes to bottom of ship and planet screens. Applies same link format.
0.4 Adds links to system messages too, searching for "ID#XXX". Simple mided
    implementation, will likely give strange results in some corner cases,
    such as a planet and a ship having both the same ID *and* name, or a ship
    having a name set to the name and ID of a different ship/planet.
0.5 Fixes system message links to handle ship names with special chars.
0.7 Changes link color for new version
1.0 Major update for new version
    - now uses plugin toolkit
    - fixed some links to stuff owned by others
    - added map highlighting of object when selected
    - added parsing of formats without the # sign in between, ie. s42 or p123
      (this seems to be a more common usage)
    - links are now also added to activity feed
    - activity feed is detachable, can be viewed as movable window and is visible
      on map and other screens
------------------------------------------------------------------------------*/

function wrapper () { // wrapper for injection

    
var pluginName = "MessageLinks";
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
    
    detachActivityPane: function () {
        $("#DetachActivity").remove();
        nu.modal($("<div id='ActivityFloat'></div>"), "Activity", 380, true, function () { if ($("#GameActivity").length == 0) vgap.dash.summary(); } );
        nu.overlay.hide();
        var ga = $("#GameActivity");
        var offset = ga.offset();
        offset.left -= 2;
        offset.top -= 22;
        nu.modalwin.offset( offset );
        $(".esimplewincontent").css( {padding: 0, position: "relative"} ).height(ga.height);
        ga.css({"background-color": "#555", "border-radius": 0}).appendTo("#ActivityFloat");
        $("#GameActivity .ecancelbutton").tclick( function () {vgap.plugins.MessageLinks.activityupdated = true; vgap.dash.summary();} );
        
    },

    // Actual functions moved to toolkit, just re-reference here to avoid changing a lot of code.
    addLinksToText: vgap.addLinksToText,
    addLinksToMessage: vgap.addLinksToMessage,    

    drawNoteOnActiveScreen: function (note) {
        if (note != null) {
            $("#Notes").html(note.body.replace(/\n/g, "<br/>"));
            $("#Notes").html(this.addLinksToText);
        }
    },

    loadship: function () {

        $("#ShipOrders").after("<div class='SepContainer' id='Notes'/>");
        this.drawNoteOnActiveScreen(vgap.getNote(vgap.shipScreen.ship.id, 2));

    },

    loadplanet: function () {

        $("#Colony").after("<div class='SepContainer' id='Notes'/>");
        this.drawNoteOnActiveScreen(vgap.getNote(vgap.planetScreen.planet.id, 1));

    },
    
    showsummary: function () {
        if ($("#ActivityFloat").length > 0) {
            if (this.activityupdated) {
                $("#ActivityFloat").empty();
                $("#GameActivity").css({"background-color": "#555", "border-radius": 0}).appendTo("#ActivityFloat");
                $("#GameActivity .ecancelbutton").tclick( function () {vgap.plugins.MessageLinks.activityupdated = true; vgap.dash.summary();} );
            }
            else {
                $("#PlanetsContainer #GameActivity").remove();
            }
        }
        else {
            $("#PlanetsContainer #GameActivity").prepend("<div id='DetachActivity' style='color: cyan; text-align: center; height: 20px; width: 100%;'><a onclick='vgap.plugins.MessageLinks.detachActivityPane();'>DETACH</a></div>");        
        }
        vgap.plugins.MessageLinks.activityupdated = false;
    }

}
vgap.toolkit.registerPlugin(plugin);


    //Legacy Overrides
    var old_saveNote = vgaPlanets.prototype.saveNote;
    vgaPlanets.prototype.saveNote = function (id, noteType) {

        old_saveNote.apply(this, arguments);

        if ( (noteType == 2 && this.shipScreenOpen && this.shipScreen.ship.id == id) || (noteType == 1 && this.planetScreenOpen && this.planetScreen.planet.id == id))
            drawNoteOnActiveScreen(vgap.getNote(id, noteType));

    };

    var oldShowPlayerMessages = vgapDashboard.prototype.showPlayerMessages;
    vgapDashboard.prototype.showPlayerMessages = function () {

        oldShowPlayerMessages.apply(this, arguments);

        $("#MessageInbox td").html(vgap.plugins.MessageLinks.addLinksToText);
        //return "Beefer";

    };

    var oldShowMessages = vgapDashboard.prototype.showMessages;
    vgapDashboard.prototype.showMessages = function (messagetype) {

        oldShowMessages.apply(this, arguments);

        $("#MessageInbox td").html(vgap.plugins.MessageLinks.addLinksToMessage);
        //return "Beefer";

    };
    
    var old_massageActivity = vgaPlanets.prototype.massageActivity;
    vgaPlanets.prototype.massageActivity = function (item, isreply) {

        old_massageActivity.apply(this, arguments);    
        
        item.message = vgap.plugins.MessageLinks.addLinksToText(item.message);
        item.excerpt = vgap.plugins.MessageLinks.addLinksToText(item.excerpt);
        
    };
    
    var old_processActivity = vgaPlanets.prototype.processActivity;
    vgaPlanets.prototype.processActivity = function (item, isreply) {

        old_processActivity.apply(this, arguments);    
        
        vgap.plugins.MessageLinks.activityupdated = true;
        
    };
    
    var old_showActivity = vgapDashboard.prototype.showActivity;
    vgapDashboard.prototype.showActivity = function () {

        old_showActivity.apply(this, arguments);

        $("#ecancelbutton").tclick( function () {vgap.plugins.MessageLinks.activityupdated = true; vgap.dash.summary();} );

    };    
    
    
    
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script); 
document.body.removeChild(script);  