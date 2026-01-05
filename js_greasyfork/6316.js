// ==UserScript==
// @name        DCI New HIT Monitor - Party Edition
// @author      DCI
// @author      Mralaska
// @namespace   DCI
// @description Scans first 3 pages of new HITs for your search terms.
// @version     1.9
// @include     https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=2&searchSpec=HITGroupSearch%23T%231%2310%23-1%23T%23%21Reward%216%21rO0ABXQABDAuMDA-%21%23%21LastUpdatedTime%211%21%23%21
// @include     https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=3&searchSpec=HITGroupSearch%23T%232%2310%23-1%23T%23!Reward!6!rO0ABXQABDAuMDA-!%23!LastUpdatedTime!1!%23!
// @include     https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=1&searchSpec=HITGroupSearch%23T%233%2310%23-1%23T%23!Reward!6!rO0ABXQABDAuMDA-!%23!LastUpdatedTime!1!%23!
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/6316/DCI%20New%20HIT%20Monitor%20-%20Party%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/6316/DCI%20New%20HIT%20Monitor%20-%20Party%20Edition.meta.js
// ==/UserScript==

// Bookmark the following link and use it to activate the script
// https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=1&searchSpec=HITGroupSearch%23T%233%2310%23-1%23T%23!Reward!6!rO0ABXQABDAuMDA-!%23!LastUpdatedTime!1!%23!


SleepTime  = 15  //seconds HIT Monitor sleeps after an alert

ScanTime = 2   // Seconds between scans


function searchterms(){ var needles = new Array(
  
// Add search terms here.
// You can use any text found on the search page or inside of links  
// This includes requester names, HIT names, text from descriptions, keywords, requester IDs and HIT IDs
// All search terms must be in quotes and separated by a comma


"ACME Data Collection",
"agent agent",
"AJ Ghergich",
"Andy K",
"BICC",
"Bluejay Labs",
"carnegie mellon social computing group",
"Christos Koritos",    
"Dan Shaffer",
"David Mease",
"Funicular Heavy Industries",   
"Heather Walters",
"JASON W GULLIFER",
"Jeff Foster",
"jesse egbert",
"Jonathan Frates",
"Leonid Sigal",
"nabirds", 
"Parisa",
"pickfu",
"Procore", 
"Project Endor",
"Project Gandolph",
"Sergey Schmidt",
"SIRIUSProject",
"Smartsheet",
"Spreecast",
"Two Lakes",
"User Manual",
"vaplab",    
"Wharton",    
"x8 data"
                         
    
//==[Be careful not to put a comma after the last item on your list]==\\    
    
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

BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav"); 
if (found != ""){
BellSound.play();
LinkAlert(foundlink);
setTimeout("location.reload(true);",SleepTime*1000);}                       
                      
else
secondpage();}

function secondpage(){
var textsearch = $( ":contains('1-10')" );
    if (textsearch.length){
        setTimeout(function(){(window.location.replace("https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=2&searchSpec=HITGroupSearch%23T%231%2310%23-1%23T%23%21Reward%216%21rO0ABXQABDAuMDA-%21%23%21LastUpdatedTime%211%21%23%21"))},ScanTime*1000);}
else
thirdpage();}

function thirdpage(){
var textsearch = $( ":contains('11-20')" );
if (textsearch.length){
    setTimeout(function(){(window.location.replace("https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=3&searchSpec=HITGroupSearch%23T%232%2310%23-1%23T%23!Reward!6!rO0ABXQABDAuMDA-!%23!LastUpdatedTime!1!%23!"))},ScanTime*1000); }

else
firstpage();}

function firstpage(){
var textsearch = $( ":contains('21-30')" );
if (textsearch.length){
    setTimeout(function(){(window.location.replace("https://www.mturk.com/mturk/viewsearchbar?searchWords=&selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&pageNumber=1&searchSpec=HITGroupSearch%23T%233%2310%23-1%23T%23!Reward!6!rO0ABXQABDAuMDA-!%23!LastUpdatedTime!1!%23!"))},ScanTime*1000); }  
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
    var LinkWindow = window.open("","MturkHitSearch"); 
    LinkWindow.document.body.innerHTML += (foundlink);    
    LinkWindow.scrollTo(0,document.body.scrollHeight);
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

searchterms();

document.title = "New HIT Monitor";
    



                      
