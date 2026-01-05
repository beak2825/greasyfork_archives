// ==UserScript==
// @name        Crowdsource Workstation Monitor
// @namespace   mralaska
// @description Monitors your CrowdSource work center for favorite tasks
// @include     https://work.crowdsource.com/*
// @exclude     https://work.crowdsource.com/login*
// @exclude     https://work.crowdsource.com/amt/*
// @exclude     https://work.crowdsource.com/history*
// @exclude     https://work.crowdsource.com/feedback*
// @exclude     https://work.crowdsource.com/profile/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6196/Crowdsource%20Workstation%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/6196/Crowdsource%20Workstation%20Monitor.meta.js
// ==/UserScript==

/*********************************
 * This script is still experimental. It was adapted by modifying the DCI Hit Monitor script.
* ALERT mode (default) is activated by setting SOUND_DELAY with any positive number greater than zero (2 should be plenty unless speed is limited)
  * best when working this script solely, or have it running in another browser.
  * when an alert pops you stop what you are doing and visit the link from the frozen page
  * it is best to freeze the page using SLEEP_DELAY for a long enough time to investigate the linke
* LINK mode can be activated by setting SOUND_DELAY to 0 (sound delay is not needed in link mode)
  * best when multitasking or if you have a lot of search queries and wish to ignore some alerts
  * the script will continue adding links to the capture page but will not force immediate action
  * you can still set SLEEP_DELAY to give you time to investigate from the search page or set it similar to RELOAD_TIME to keep searching
* 
* To activate this script simply log into your account at https://work.crowdsource.com
  * This script will refresh the page at your specified interval using seach queries reflecting your favorite tasks
*********************************/
//===[Settings]===\\
var RELOAD_TIME = '15';  //==[This is the number of seconds between page reloads. Set to '0' to disable script reloading]
//    * 5 by default - any number above 0 but I have had crowdsource crash on me going too fast. 0 will disable reloading.
var SLEEP_DELAY = '600'; //==[This is the number of seconds HIT monitor waits after a notification]
//    * 15 by default - setting SLEEP_DELAY to 300 will give you five minutes - you can refresh the page manually to start it again sooner
var SOUND_DELAY = '2';  //==[This is the number of seconds the alert waits to give the sound time to load]
//    * prevents the alert from snipping the sound
//    * SOUND_DELAY ALSO SETS ALERT/LINK MODE:
//    * Set to 0 for LINK WINDOW MODE (delay not required for link window)
//    * set to any number above 0 for ALERT MODE (try 2 for normal speed)
var POPUP_WIDTH = '600'; // link page width in pixels
var POPUP_HEIGHT= '650'; // link page height in pixels
var SOUND_BYTE  = "http://static1.grsites.com/archive/sounds/musical/musical002.wav";
//==[Change the SOUND_BYTE URL to use whatever sound you want]==\\ 
//
// Customize your search strings (below)

var needles = new Array(
//==[Below is your requester list. Add or remove whatever you like]==\\
//==[If you make a typo and break it, you'll know, because it won't reload]==\\
// Proper format is QUOTE-STRING-QUOTE-COMMA (adding white space before or after queries does not matter)

// regular searches can use either single quote or double quote if not encapsulating a another quote mark.
// Note that the first entry uses single quotes to include a double quote as part of the search
// Using the double quote as part of the search is copied from the source (inspect element) of the CrowdSource page
'Search: Keywords on Google.com"', // will not alert on similar searches such as "Search: Keywords on Google.com and ..."
"Keywords on Google.ng",
"Keywords on Google.it",
"Keywords on Google.co.uk",
"Keywords on Google.com.sg",
'Ranking of a Url"', //This query also uses the text and double quote as copied from the CrowdSource page via "Inspect Element"
"Ranking of a Url on Google.co.uk",
"Ranking of a Url on Google.it",
"Ranking of a Url on Google.ng"


//==[Be careful NOT to put a comma after the LAST item on your list]==\\    
);

var haystack = document.body.innerHTML;
var my_pattern, my_matches, found = "", foundalert = "";
for (var i=0; i<needles.length; i++){
  my_pattern = eval("/" + needles[i] + "/gi");
  my_matches = haystack.match(my_pattern);
  if (my_matches){
      // for alert option
    foundalert += "\n" + my_matches.length + " found for " + needles[i]; 
      // for link page option
    searchString = needles[i].replace(/ /g,"+");
    found += "\n \(Total queries="+ needles.length +"\) " + my_matches.length;
    found += " matches for <a target=_blank href=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=";
    found += searchString +">"+ needles[i] +"</a>";
    found += " \(All hits by <a target=_blank href=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=";
    found += "A2SUM2D7EOAK1T>CrowdSource</a>\)<br>";
  }
}

// If matches were found, send to an alert window with links to open searches
if (found != "") {
   mCoinSound = new Audio(SOUND_BYTE); 
   mCoinSound.play(); 
   if (SOUND_DELAY > 0) {
       // create alert and freeze tab
      setTimeout(function(){alert("Alert" + foundalert)}, SOUND_DELAY*1000);
   } else {
       // call function to create link page
      CreateAlert(found);   
   }
   var StRefTime = SLEEP_DELAY;
   if (StRefTime > 0) setTimeout("location.reload(true);",StRefTime*1000);
}  else {
   var StRefTime = RELOAD_TIME; 
   if (StRefTime > 0) setTimeout("location.reload(true);",StRefTime*1000);   
} 

function CreateAlert(found){
    var LinkWindow = window.open("","CrowdSourceTasks","width="+POPUP_WIDTH+",height="+POPUP_HEIGHT); 
    LinkWindow.document.body.innerHTML += (found);
    checkTitle(LinkWindow,"CrowdSource Search Results");
    LinkWindow.document.close();
}
function checkTitle(win,tit) {
    if(win.document) { // if loaded
        win.document.title = tit; // set title
    } else { // if not loaded yet
        setTimeout(check, 10); // check in another 10ms
    }
}
