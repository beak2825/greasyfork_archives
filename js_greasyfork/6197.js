// ==UserScript==
// @name        DCI New HIT Monitor for mturk (with links) (mralaska version)
// @namespace   mralaska
// @description Monitors for new HITs from requesters on your list
// @include     *mturk.com/*HITMONITOR*
// @include     https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&qualifiedFor=on&sortType=LastUpdatedTime%3A1
// @version     9000.1 
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6197/DCI%20New%20HIT%20Monitor%20for%20mturk%20%28with%20links%29%20%28mralaska%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6197/DCI%20New%20HIT%20Monitor%20for%20mturk%20%28with%20links%29%20%28mralaska%20version%29.meta.js
// ==/UserScript==

/*********************************
* This script is based on the DCI script version 9000 from <a href="http://userscripts.org/scripts/show/399555">http://userscripts.org/scripts/show/399555</a>
* The major difference is that this version selects an option by default to create a link page instead of freezing the tab using an alert
* Query lists can be copied and pasted to and from the DCI script
* LINK mode (default) opens a new page and adds links and makes a noise every new match
  * best when multitasking or if you have a lot of search queries and wish to ignore some alerts
  * the script will continue adding links to the capture page but will not force immediate action
  * you can increase SLEEP_DELAY to give you time to investigate from the search page but default is to slow it down only briefly
  * Chrome users especially will find more use for the LINK mode (FireFox alert is less intrusive)
* ALERT mode will make a noise and then freeze the tab until you clear the alert.
  * best when working this script solely, or have it running in another browser.
  * when an alert pops you stop what you are doing and visit the link from the frozen page
  * it is best to freeze the page using SLEEP_DELAY for a long enough time to investigate the link
* 
* To activate this script visit or bookmark one of the links below. 
https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&qualifiedFor=on&sortType=LastUpdatedTime%3A1
https://www.mturk.com/mturk/findhits?match=true&qualifiedFor=on&sortType=LastUpdatedTime%3A1&queryflag=HITMONITOR
* You can change the search parameters on Mturk as long as HITMONITOR is added as a query -> &queryflag=HITMONITOR (see link above)
*** How to eliminate YOU HAVE EXCEEDED THE MAXIMUM ALLOWED PAGE REQUEST RATE FOR THIS WEBSITE.
    * PRO TIP: By using this script with the second link or any page using the method: &queryflag=HITMONITOR
    * AND ALSO modifying all other mturk scripts to EXCLUDE the HITMONITOR search page 
        example: insert this line into each script header after the includes: // @exclude  *mturk.com/*HITMONITOR*
    * AND ALSO (if applicable) disabling or using Page Monitor type programs on a VERY limited basis 
    * will allow you to operate very fast without activating this error 
    * (tested <0.01 second refresh with 500 queries nearly continuous for a week with no errors)
    * DISCLAIMER: If you continue to search even by hand on pages with scripts enabled it may still trigger the error 
        (some scripts are more likely than others depending on how often they hit Amazon for data)
*********************************/

//===[Settings]===\\ //==[To change alert sound just change the url to use whatever sound you want]==\\
var SOUND_BYTE  = "http://static1.grsites.com/archive/sounds/musical/musical002.wav"; //==[This is the path to the mp3 used for the alert]==\\
var RELOAD_TIME = '5';     //==[default 5 seconds - This is the number of seconds between page reloads - 0 will disable reloading (use 0.xx if 1 second is too long)]
var SLEEP_TIME  = '15';   //==[default 15 seconds - (300 suggested (5 minutes) for alert mode) Number of seconds HIT monitor sleeps after the alert is clicked]  
var SOUND_DELAY = '2';     //==[Required for Alert mode - Number of seconds between your sound alert and popup alert - ignored for link mode.] 
//You may need to increase the delay if the popup is frequently cutting off your sound before it can play
var ALERT_MODE  = "FALSE";  //==[Method of notification TRUE or FALSE - if FALSE you can set SOUND_DELAY to '0']
var LINK_MODE   = "TRUE"; //==[Generates a page with search link (does not affect SOUND_DELAY)]
var POPUP_WIDTH = '650'; // link page width in pixels
var POPUP_HEIGHT= '600'; // link page height in pixels
//===[END Settings]===\\ 
// Customize your search strings (below)

var needles = new Array(
//==[Below is your requester list. Add or remove whatever you like]==\\
//==[If you make a typo and break it, you'll know, because it won't reload]==\\
// Proper format is QUOTE-STRING-QUOTE-COMMA (adding white space before or after queries does not matter)

"TaskRabbit", // you can use double hash marks to insert comments AFTER the code (anything after will be ignored)
"Set Master", // good for building numbers - post almost every day
"Acme Data Collection",
"A3A1AJ4RPLTOLY", // requester ID for acme
"agent agent",
//"AJ Ghergich",
"Andy K",
"BICC",
"Bluejay Labs",
"carnegie mellon social computing group",
"Christos Koritos",    
"Dan Shaffer",
"David Mease",
"Funicular Heavy Industries",
"Gaddy",    
	//You can search by user ID but the alert will not identify the requester:
"A17KLBWRZ7M97G", //will show alerts for D. M. [A17KLBWRZ7M97G] 
    //You can also search by query string but it must have an exact match in the HIT headline
"Urgent Priority", //will show alerts for all hit titles that contain the phrase, Urgent Priority
    //You can arrange query strings by row if you wish as long as you continue to follow the correct format.
"JASON W GULLIFER","Jeff Foster","jesse egbert",
"Jonathan Frates","Leonid","nabirds","nlp","OCMP","OhGodScience","Parisa","Personagraph",
"PickFu","Procore","Project Endor","Project Gandolph",
"Sergey Schmidt","SIRIUSProject","Spreecast","Stiglitz","Tag Requester",
"Two Lakes","User Manual","vaplab","Vesterman","UW Social","Wharton","World Vision","Heather Walters",
"John Roberts", // some decent batches, some are a grind
"Get Number of Search Results", // from john roberts - ok for numbers - requires 1000 min & 95% approved
"NoblisCV", // great penny batches for numbers - only requires approval rate over 50%

"x8 data"
//==[DO NOT to put a comma after the LAST ITEM on your list]==\\    
);

var haystack = document.body.innerHTML;
var my_pattern, my_matches, found = "", foundlink="";
for (var i=0; i<needles.length; i++){
  my_pattern = eval("/" + needles[i] + "/gi");
  my_matches = haystack.match(my_pattern);
  if (my_matches){
           // for Alert
    found += "\n" + my_matches.length + " found for " + needles[i]; 
          // for link page option
    searchString = needles[i].replace(/ /g,"+");
    foundlink += "\n \(Total queries="+ needles.length +"\) " + my_matches.length;
    foundlink += " matches for <a target=_blank href=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=";
    foundlink += searchString +">"+ needles[i] +"</a>";
    foundlink += " \(alt srch if <a target=_blank href=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=";
    foundlink += searchString +">ID</a> provided\) ";
    foundlink += time()+"<br>";
  }
}

if (found != "") {
    var mCoinSound = new Audio(SOUND_BYTE);
    mCoinSound.play(); 
    if (ALERT_MODE == "TRUE") {
       setTimeout(function(){alert("Alert" + found)}, (SOUND_DELAY*1000));
    }
    if (LINK_MODE == "TRUE") {
        LinkAlert(foundlink);
    }
    if (SLEEP_TIME > 0) setTimeout("location.reload(true);",SLEEP_TIME*1000);
} else {
    if (RELOAD_TIME > 0) setTimeout("location.reload(true);",RELOAD_TIME*1000);    
}

function time(){
    var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours(), //.toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    hours = hours > 12 ? hours - 12 : hours,
    hours = hours < 1  ? hours + 12 : hours,
    seconds = d.getSeconds().toString().length == 1 ? '0'+d.getSeconds() : d.getSeconds(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    //months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    //return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+":"+seconds+" "+ampm;
    return days[d.getDay()]+' '+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear()+' '+hours+':'+minutes+':'+seconds+' '+ampm;
}
function LinkAlert(foundlink){
    var LinkWindow = window.open("","MturkHitSearch","width="+POPUP_WIDTH+",height="+POPUP_HEIGHT); 
    LinkWindow.document.body.innerHTML += (foundlink);
    checkTitle(LinkWindow,"Mturk Search Results");
    LinkWindow.document.close();
}
function checkTitle(win,tit) {
    if(win.document) { // if loaded
        win.document.title = tit; // set title
    } else { // if not loaded yet
        setTimeout(check, 10); // check in another 10ms
    }
}

                      