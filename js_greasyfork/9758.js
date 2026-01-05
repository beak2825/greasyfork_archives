// ==UserScript==
// @name         Auto Select Next Explorer
// @namespace    https://greasyfork.org/en/users/10321-nikitas
// @version      1
// @description  Automatically Selects next Explorer When explorer is launched. For Warring Factions www.war-facts.com New Interface
// @author       guardian
// @match        http://*.war-facts.com/fleet.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9758/Auto%20Select%20Next%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/9758/Auto%20Select%20Next%20Explorer.meta.js
// ==/UserScript==

//Replaces game's getMission function, so that if it is an explorer it autolaunches
function newgetMission(){

    
    
//Configuration Options:
// Change this if you wish to exclude Fleets whose names contain the excludeString from being auto Selected as next explorer.
var useExcludeString = false;
// Change this to what you would like to put into a fleet's name in order to exclude it from being auto selected.
var excludeString = "#NotAuto#";


// Change this if you wish to auto Select Fleets as next explorer ONLY if their names contain the includeString.
var useIncludeString = false;
// Change this to what you would like to put into a fleet's name in order to include it into being auto selected.
var includeString = "#Auto#";

    
    
    
//Script




    function autoSelectNextExplorer(){

        var explorerList = document.getElementById('fc_Explorer').children;
        var index = 0;
        var explorerListLength = explorerList.length;
           
        while (index < explorerListLength) {
            
 //           alert("Index = " +index);

            if (explorerList[index].children[0].style.color == "rgb(242, 242, 242)") {
                
                var link = explorerList[index].children[0].href;
                var fleet_with_id = link.substr(link.indexOf("fleet="));
                var name = explorerList[index].children[0].innerHTML;
                var current_window = window.location.href;
 //               alert("Fleet with  name " + name +" and with id " + fleet_with_id);
                              
                if (
                       ( ( !useIncludeString) || ( name.indexOf(includeString) > -1  )  ) //If not using include string or String is in name
                    && ( ( !useExcludeString) || ( name.indexOf(excludeString) == -1 )  ) //If not using exclude string or String is NOT in name
                    && ( current_window.indexOf(fleet_with_id) == -1  )//Make sure we are not chosing ourselve as this fleet is still "white"
                   ) 
                {
                    
                    index = explorerListLength; //To make sure if load doesn't happen immediately it stops running through fleet list
                    window.open(link, "_self");
                }
            }
            index++;
        }
    }  

    
    
    
// Replace the site's getMission function, so that when launch is pressed, it autoSelectsNextExplorer
	var oldgetMission = getMission; 

	window.getMission = function getMission(action, dType) {
		var executed = new oldgetMission(action, dType);
        if (action == 'launch'){            
        var classificationNode = document.getElementById('fleetClass');
        var isExplorer = document.evaluate("//text()[contains(.,'Explorer') or contains(.,'Sentry') or contains(.,'Probe Rush')]", classificationNode, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
        window.setTimeout(autoSelectNextExplorer,250);
        }
        
    }
    
}  

// this is the only script injection technique I've found which works on Chrome with the above function
var inject = document.createElement("script");
inject.setAttribute("type", "text/javascript");
inject.appendChild(document.createTextNode("(" + newgetMission + ")()"));
document.body.appendChild(inject);



    

