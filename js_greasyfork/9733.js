// ==UserScript==
// @name        WF Explorer Next Planet Button
// @namespace   https://greasyfork.org/en/users/10321-nikitas
// @description Adds a next planet button for probes which launches fleet to next planet. For www.war-facts.com .
// @match       http://*.war-facts.com/fleet.php*
// @version     7
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9733/WF%20Explorer%20Next%20Planet%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/9733/WF%20Explorer%20Next%20Planet%20Button.meta.js
// ==/UserScript==


//Configuration. Change to false if you don't want to autolaunch
var AutoLaunch = true;


//Script





$(document).ready(function() {

    window.setTimeout(runWholeScript,100);  //Added some extra delay cause sometimes script didn't have time to load correctly


    function runWholeScript(){
    

        var classificationNode = document.getElementById('fleetClass');
        var isExplorer = document.evaluate("//text()[contains(.,'Explorer') or contains(.,'Sentry') or contains(.,'Probe Rush')]", classificationNode, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;

   
        
        if (isExplorer){

            var info = document.getElementById('navData').getElementsByTagName('div')[4];
            var infoSpan = info.getElementsByTagName('span')[0];

            // not  containing world in the span.
            var isAtSystemEntrance  =  ! (document.evaluate("//text()[contains(.,'World:')]", infoSpan, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);


            //alert("Is explorer = " + isExplorer);
            //alert("Is at system Entrance = " + isAtSystemEntrance);
            var currentPlanet = info.getElementsByTagName('a')[0].innerHTML;

            


            //alert(currentPlanet);
            var optionGroup = document.getElementById('target1');
            optionGroup = optionGroup.getElementsByTagName('optgroup')[0];
            optionGroup = optionGroup.getElementsByTagName('option');

            var i = 0 , found = false,  optionsLength = optionGroup.length;
            var nextPlanetOption, finishedSystem = false;




            //if PlanetLess system
            if (optionsLength === 0 ) {
//            alert("Planetless System");
                found = true;
                finishedSystem = true;
            } else if (isAtSystemEntrance){ //if I am at system entrance
//            alert("At System Entrance");
                found = true;
                nextPlanetOption = optionGroup[0].value;
            }

 
            
            
            // If I am at a planet, Find next planet through the local target option list

            while ( (i < optionsLength) && (found == false) ) {

                if (optionGroup[i].innerHTML == currentPlanet ){
                    found = true;

                    if ( i == optionsLength -1 ){
                        finishedSystem = true;

                    } else {
                        nextPlanetOption = optionGroup[i+1].value;
                    }
                }

                i++;

            }

//   alert("finished system = " + finishedSystem);
//   alert("next planet = " + nextPlanetOption);



            
            
        function selectNextPlanet(){
            jQuery('#target1').val(nextPlanetOption).trigger ('change');

            if (AutoLaunch){
              //  alert("Auto Launch is on");
                window.setTimeout(launchFleet,100);
            } else {
            
            //    alert("Auto Launch is off");
            }
            

            
        }

            
            
//       alert("Reached finished System");

            if (finishedSystem) {
//            alert("Inside finished System");
                document.getElementById('missionData').innerHTML += '<input  class = "greenbutton darkbutton" type="button" id="nextPlanetButton" value = "Done" onclick="openStarMap()" />';
                document.getElementById('nextPlanetButton').addEventListener('click', openStarMap, false);
            } else {
                //           alert("Inside NOT finished System");
                document.getElementById('missionData').innerHTML += '<input  class = "greenbutton darkbutton" type="button" id="nextPlanetButton" value = "Next Planet"  />';
                document.getElementById('nextPlanetButton').addEventListener('click', selectNextPlanet, false);

            }

        }



        function openStarMap(){
            var starMapLink;
            if (isAtSystemEntrance){
                starMapLink  = document.getElementById('navData').getElementsByTagName('div')[10].getElementsByTagName('a')[0].href;
            } else {
                starMapLink  = document.getElementById('navData').getElementsByTagName('div')[11].getElementsByTagName('a')[0].href;
            }

            starMapLink = starMapLink.substring(19, starMapLink.length - 3 );   //Keep only the link, throw away the functions

            // mapWin is war-facts.com function to open javascript map
            mapWin(starMapLink);

        }



        function launchFleet(){
            var launchButton = document.getElementById('mButton').getElementsByTagName('input')[0];

            if (launchButton) { //So Button has been created
           //     alert("launcghing fleet");
                getMission('launch');   //Launch Fleet
                autoSelectNextExplorer();

            } else {
                window.setTimeout(launchFleet,100);
            }




        }

        
/*
        function checkIfLaunched(){
            var abortButton = document.getElementById('mButton').children[0];

            if (    (abortButton)  && (abortButton.value == "Abort Mission") ) {
                autoSelectNextExplorer();
            }else {
                alert("Trying Again");
                window.setTimeout(checkIfLaunched,250);
            }

        }

*/
 
   } 
});