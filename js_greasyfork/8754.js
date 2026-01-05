// ==UserScript==
// @name           WME URComments (MapRaid)
// @description    This script is for replying to user requests the goal is to speed up and simplify the process. Thanks to Chat Jumper and URO+!
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.2.0
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/8754/WME%20URComments%20%28MapRaid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8754/WME%20URComments%20%28MapRaid%29.meta.js
// ==/UserScript==
//URO+ in order for the URO pop up not to be over the ur pin change the URO+ script find all 4 uroPopupX = markerXY.x + popupXOffset; and change it to uroPopupX = markerXY.x + popupXOffset + 40;
//to make this script find open URs faster change the number 1000 to something smaller this is in milliseconds 1000 = 1 second
//line 892 it looks like this setTimeout(URComments.LookForOpenedUR, 1000);  // 1 second search
//line 892 it looks like this setTimeout(URComments.LookForOpenedUR, 500);   // .5 second search
var URCommentVersion = "0.2.0"; //branched from 0.9.3
var URCommentUpdateMessage = "yes"; // yes alert the user, no has a silent update.

/* Changelog
The change log has been moved to https://docs.google.com/spreadsheets/d/1PM4bOYGJxL82E4th2yy87ZzQKpMDF4N1dcKZ2evXc5o/edit?usp=sharing
This sheet will now be used to also track editor requests, to add a request please pm me on waze at rickzabel  
*/

var URCommentVersionUpdateNotes = "UR Comments has been updated to " + URCommentVersion;
URCommentVersionUpdateNotes = URCommentVersionUpdateNotes + "\n" + "The changes to this script will override the filtering set by URO, between URs URO will override this scripts filtering and bubbles. both which get reapplied after the UR is done. I was asked Twiser-uk what we can do to get these to work better together and have yet to hear back. But I feel the option to only show UR that need work it worth the negative interactions between these scripts. -RickZabel";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////
////// Define items that need to be at the root level so they can be used inside functions
//////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//use this for counting how many times we waited for waze to finish a task.. 
//currently used to write to the console so the code is easier to debug
//in the future we might do actions if we waited to long
var PauseCount = "1";

//these are the names of the comments lists built into the script and will show up in the comment list drop down
var BoilerPlateCreatorsArray = ["CommentTeam",
	"Custom",
	"BrazilianPortuguese", //maintained Murilo-Carvalho mcarvalho79&gmail.com https://greasyfork.org/en/scripts/7292-wme-ur-comments-brazilianportuguese-list
	"Czech", //maintained by Zirland zirland&gmail.com
	"Dutch", //maintained by moweez moweeznh&gmail.com https://greasyfork.org/nl/scripts/7276-wme-ur-comments-dutch-list
	"Spanish", //maintained by carloslaso carloslaso&gmail.com https://greasyfork.org/en/scripts/7279-wme-ur-comments-spanish-list
	"IsraeliHebrew", //maintained by crayzee, ktamir&gmail.com
		
	"---User's Lists---",
	"PesachZ" //maintained by PesachZ https://greasyfork.org/en/scripts/7272-wme-ur-comments-pesachz-list
	//"orbit" //https://greasyfork.org/en/users/8079-orbit
];

//get the SelectedBoilerPlateCreator
var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');
//console.log("URC - " + SelectedBoilerPlateCreator);

//if the comment list hasn't been chosen default to the CommentTeam's list
if (SelectedBoilerPlateCreator === "" || SelectedBoilerPlateCreator === null || SelectedBoilerPlateCreator === "rickzabel") {
    SelectedBoilerPlateCreator = "CommentTeam";
    localStorage.setItem('BoilerPlateCreators', SelectedBoilerPlateCreator);
}

//array that holds the comments
var URCommentsArray = [];
//the var that holds the reply instruction
var ReplyInstructions = "";


//these are the holders for the position in the comments list that the reminder and close messages are at
var ReminderPosistion = "";
var CloseNotIdentifiedPosistion = "";

//default waze message array
var def_names = [];

//used to keep track of how many times a beta tester clicked a comment
var BetaaTestersCheckCount = 0;
//waze swaps out the close button on the UR window after you click send. we use this to grab the close and compare to the new one
var CloseButtonHolder = "";
//since we are scanning for open ur i need to keep taack of the current urID so the comments can be overridden
var UrCommentLasturID = "";

//this is used to hold the info about the previous tab, before we auto switched tabs
var PreviousTab = null;

//used to track if we are switching languages
var ChangeLanguage = false;

//return to zoom instead of zoom 0
var ReturnToCurrentZoom = "";

var UrCommentsIcon  ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////
////// bootstrap 
//////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//now we use this to load the arrays, but we wait till the me tab loads, this gives the custom comments file a chance to also load
function URComments_bootstrap() {

	
	
	
	//console.log("URC - Test");
		//get the SelectedBoilerPlateCreator
		var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // these is the array used to store the ur comments
        // comment arrays should follow the format
        // "Title",     * is what will show up in the ur comment tab
        // "comment",   * is the comment that will be sent to the user currently 
        // "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on.
        //					after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (SelectedBoilerPlateCreator === "CommentTeam") {

            //CommentTeam's list
            URCommentsArray = [
					"No further communication",
					"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
					"Solved", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14

					"Fixed",
					//"Thanks to your report we've found and fixed a problem with the map. The fix should reach handheld devices within a few days, but on rare occasions it can take closer to a week.",//karlcr9911 12/7/14  //removed an extra space at the end - rickzabel 12/7/14 t0cableguy 12/8/14
					"Thanks to your report we've found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"Solved", 

					"Address Adjustments",
					//"Thanks! The address has been adjusted. This should reach handheld devices within a few days, but on rare occasions it can take closer to a week.",
					"Thanks! The address has been adjusted. This should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"Solved",

					"Address fishing",
					//"Waze does not tell us your starting or ending destinations. Would you tell us the address you are having problems with as you entered it into Waze? Thanks!"
					//"Waze does not tell us your starting or ending destinations. Would you please tell us the destination name and address you are having problems with? Thanks!", //t0cableguy 12/7/14, karlcr9911 12/7/14 
					//"Waze does not tell us your starting or ending destinations. Would you please tell us the destination name and address you are having problems with? Thanks!",
					//this is going to be the message we voted on above! rickzabel 12/8/14
					"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel i use this one after i sent a message with Volunteer responding 1
					"Open",

					"Errors with no text",
					//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",  //karlcr9911 12/7/14 //rickzabel 12/7/14 //t0cableguy 12/7/14
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/8/14
					"Open",

					"Reminder message", //do not change (rickzabel)
					//"Just a reminder: We have not received a response on your report. If we don't hear back from you soon we will infer everything is okay and close the report. Thanks!", //karlcr9911 12/7/14  //this has been getting me the most responses, but it probably is the special link i am including with the UR layer enabled rickzabel 12/7/14 t0cableguy 12/8/14
					"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"Open", 

					"No reply close message",
					//"The problem was unclear and volunteers didn't receive a response so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//karlcr9911 12/7/14 //rickzabel 12/7/14 t0cableguy 12/8/14
					"The problem was unclear and volunteers didn't receive a response, so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified", 

					"App Bug", 
					"Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to https://support.google.com/waze/answer/6090951?hl=en",
					"NotIdentified", //t0cableguy, rickzabel 3/15/2015

					"Bad GPS",
					"Volunteer responding - It appears that your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky.",//rickzabel 12/18/2014
					"NotIdentified",

					"Valid Route",
					//"We reviewed the issue and did not find any map errors. It looks like Waze provided a valid route. If you feel yours is correct, keep driving that way. If it is indeed faster, Waze will learn from your drives and route you and others the faster route. Thanks!", //karlcr9911 12/7/14  
					//"We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. If you feel yours is correct, keep driving that way. If it is indeed faster, Waze will learn from your drives and route you and others the faster route. Thanks!", //added "you with" rickzabel 12/7/14
					//"We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, it may turn out to actually be faster, if not you'll be teaching Waze that that route is slower, and your route will become preferred " //Pesach 12/8/14
					//"Volunteer responding - We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, it may turn out to actually be faster, if not you'll be teaching Waze that that route is slower, and the faster route will become preferred.", //rickzabel 12/8/14, karlcr9911 12/8/14
					"Volunteer responding - We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, as it may turn out to actually be faster. If not you'll be teaching Waze that that route is slower, and the faster route will become preferred.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified",

					'Valid Left turns',
					'Volunteer responding - If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.', //rz 2/26/15
					"NotIdentified",

					'Valid Left turns 2',
					'Volunteer responding – We do not disable legal turns only because they are difficult. If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.', //rz 2/26/15
					"NotIdentified",

					'Valid but Difficult Route',
					'Volunteer responding – We do not disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate.', //rz 2/26/15
					"NotIdentified",

					"Missing place", 
					"Volunteer responding - Thank you for reporting a missing place.  Anytime you find a a place that is missing from the waze app you can add it from the app by tapping the Pin icon > Place. After taking a picture of the place please add as many details as you can. Thanks!",
					"NotIdentified",


					'California double yellow',
					'Volunteer responding, In California it is perfectly legal to make a left turn across one double yellow line. Turning across two double yellow lines, spaced apart 2 feet or more, is considered a barrier, and is illegal to cross. Thanks!', //rz 2/26/15
					"NotIdentified",

					"Detours / Odd-Routing",
					//"We can't find anything in the map to explain route Waze gave you. Waze wants to save you time every way it can and sometimes it suggests complex detours just to shave a few seconds off your trip. Waze may recommend a detour even after the traffic has cleared up because: it doesn't know yet, other Wazers may have reported a temporary street closure, or daily traffic patterns. In any event, we are very sorry to say that the volunteer map editors can't be much help here. Thanks!",
					//"We can't find anything on the map to explain route Waze gave you. Waze tries to save you time and sometimes suggests complex detours just to shave a few seconds off your trip. We are very sorry to say that the volunteer map editors can not be much help here. Thanks!", //rickzabel 12/7/14
					//"We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors can not be helpful in this situation. Thanks!", //t0cableguy 12/7/14 //rickzabel 12/7/14 //karlcr9911 12/8/14
					"Volunteer responding - We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors can not be helpful in this situation. Thanks!", //rickzabel 12/11/14
					"NotIdentified",

					"Overall Waze complaint",
					"Volunteer responding - You can help make Waze better by reporting problems as you find them. Please include as many details as possible? Thanks!",
					"NotIdentified", //rickzabel Pesach 12/22/14

					"Report to local municipality",
					//"Volunteer responding - We are only able to help with map issues, this should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thanks!",//rickzabel Pesach 12/22/14
					"Volunteer responding - We are only able to help with map issues. This should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified", 

					"No user transponder (avoid tolls)",
					//"Volunteer responding - Waze is about getting you to your destination the fastest; however, it does not know if you have a toll transponder. Therefore, if you prefer to not have toll routes suggested, there is a feature under Settings > Navigation to avoid toll roads. Thanks!", //rickzabel Pesach 12/22/14
					"Volunteer responding - Waze is about getting you to your destination via the fastest route; however, it does not know if you have a toll transponder. Therefore, if you prefer to not have toll routes suggested, there is a feature under Settings > Navigation to avoid toll roads. Thanks!", //rz 2/26/15
					"NotIdentified",

					"No user transponder",
					//"Volunteer responding - Waze is about getting to your destination the fastest; however, it does not know if you have a toll transponder. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//rickzabel Pesach 12/22/14
					"Volunteer responding - Waze is about getting to your destination via the fastest route; however, it does not know if you have a toll transponder. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //rz 2/26/15
					"NotIdentified", 

					"Not Using HOV",
					//"The map is setup correctly to support the HOV lane here. However the Waze Client App doesn't yet have the ability to know if you are in an HOV vehicle, it therefore assumes you do not meet the HOV criteria, and will only route you on roads open to all private vehicles.\nIf you are a qualified HOV vehicle and want to use the HOV lane, driving into the HOV should force Waze to recalculate your route. Once Waze realizes you are in the HOV lane, it should calculate the best route to your destination allowing you to stay in the HOV lane. If you have other questions or issues, please reply here, or send a new report at the location of the issue.\nThank you, and Happy Wazing", //peash 12/14/14
					"Waze does not have the ability to know you meet the HOV criteria. Driving into the HOV lane should force Waze to recalculate your route. Afterwards you should be allowed to stay in the HOV lane. Thanks!", //rickzabel 12/14/14
					"NotIdentified",

					"U-turns",
					//"Volunteer responding - Currently Waze will not tell you to make a \"U-turn\". It will route you in several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors, but we understand that Waze is working on a fix. Thanks!",//rickzabel Pesach 12/22/14
					"Volunteer responding - Currently Waze will not tell you to make a \"U-turn\". It will route you in several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors. We understand that Waze is working on a fix. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified", 

					"Traffic - Stale Information",
					//"Volunteer map editors can't do anything about Waze's traffic reporting. Waze relies on data from people using Waze to assess traffic. In the case of a fresh accident or slowdown, Waze may not yet have any data on the situation. Once Waze has detected a traffic situation, it can remember it for awhile, sometimes long after the situation changes.",
					"Waze relies on data from people using Waze to assess traffic. The volunteer map editors cannot edit conditions reported through the Waze app. In the case of a recent accident or slowdown, Waze may not have any data for this situation. Once Waze has detected a traffic situation it might remember it for a period of time after the situation cleared up.", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
					"NotIdentified",

					"Traffic - Jams",
					//"To report traffic jam conditions, please use the Report -> Traffic Jam options in the Waze app. This will tell Waze about the problem in real-time. Traffic Jam reports can help route you and other Wazers around traffic problems.",
					"To report a traffic jams please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
					"NotIdentified",

					"Signal Avoidance Bug",
					//"I do not see any issues with the current turn restrictions in the area. This appears to be part of the known signal avoidance bug. Waze's developers are working on a fix for the issue but currently we do not have an ETA. Please feel free to take the turn until the issue is resolved. Thanks!",  // remove - rickzabel 12/7/2014  // added - rickzabel 12/7/2014
					//"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue but we do not have an ETA. Please feel free use the signaled turn until the issue is resolved. Thanks!", // t0cableguy 12/7/14 
					//"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue but we do not have an ETA. Please feel free to use the turn until the issue is resolved. Thanks!", // rickzabel 12/9/14
					"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue. We do not have an ETA. Please feel free to use the turn until the issue is resolved. Thanks!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified",

					"Already included restrictions",
					"This restriction is already included in the map, Waze should not route through this illegal turn. If Waze ever gives you a route through a restricted turn, please send another Map Issue report at that time. Thanks!",
					"NotIdentified",  //rickzabel Pesach 12/27/14

					"500 mile limit",
					"The search and navigation capabilities of Waze are limited to 500 miles. When driving further than that distance you will need to select a target under that distance as your temporary destination.",//rz 2/26/15
					"NotIdentified", 

					"Temporary road blockage",
					//"Volunteer responding - if the road is completely blocked use the Report > Closure feature for you and others to be rerouted around it, otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.", //rickzabel Pesach 12/22/14
					"Volunteer responding - If the road is completely blocked, use the Report > Closure feature for you and others to be rerouted around it. Otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"NotIdentified",

					"Temporary Road Closure",
					"Volunteer responding - For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",
					"NotIdentified",

					"Temporary Road Closure",
					//"How long is the road going to be closed? For closures of only a few days, we volunteer map editors can't be much help. It takes at least that long for our edits to make it to devices! When you encounter short-term road closures in the future, please use the Report->Closure feature in the Waze app. If this is a long-term closure please respond and let us know as much as you can. Thanks!",
					"Do you know how long the road is going to be closed? For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. If this is a long-term closure please respond and let us know as much as you can. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
					"Open",	

					"Closure clean-up",
					"Due to daily changing closures we are closing out the old requests to concentrate on the newest ones. For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",//rickzabel 12/28/14
					"NotIdentified",

					"Thanks for the reply",
					"Thank you for the reply! This request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
					"NotIdentified", //rickzabel 12/27/14			

					"No further communication",
					//"No further communication was received. This request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",  //rickzabel 12/7/14, karlcr9911 12/7/14 t0cableguy 12/8/14 // one sentence? rickzabel 12/7/14
					//"No further communication was received. This request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
					"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14
					"NotIdentified", // same comment different action based off UR status rickzabel 12/7/14, karlcr9911 12/7/14 // one sentence? rickzabel 12/7/14 t0cableguy 12/8/14

					"water non-editable",
					"This particular water feature is not editable by the volunteer editors, feel free to report this to support at https://support.google.com/waze/",
					"NotIdentified",

					"<br>",
					"",
					"",

					"Problem appears corrected",
					"Just a reminder: The problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks!",
					"Open", //karlcr9911 12/7/14 t0cableguy 12/8/14 //rickzabel 12/8/14

					"Clears comment & sets UR status to Open",
					"",
					"Open",

					"Include Users Description",
					"Volunteer responding - You reported \"$URD\" and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
					"Open",

					"Wrong Street Name",
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know which street name you think is wrong and what it should be? Thanks",
					"Open", //rickzabel Pesach 12/22/14



					"<br>",
					"",
					"",

					//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
					"Incorrect turn", //6
					//"Would you please let us know what turn you are having a problem with? Thanks!",
					//"Volunteer responding to your report: Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!",//rickzabel 12/7/14, karlcr9911 12/8/14
					"Volunteer responding - Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",

					"Incorrect address", //7
					//"Waze did not send us enough information to fix your request. In order for us to help you we need to know a couple of things; What is the address as you entered it into Waze and what was the problem you were having with this address?",
					//"Volunteer responding to your report: Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!", //rickzabel 12/8/14, karlcr9911 12/8/14
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!", //rickzabel 12/8/14
					"Open",

					"Incorrect route", //8
					//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
					//"Volunteer responding to your report: Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", // karlcr9911  12/8/14
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",

					"Missing roundabout", //9
					"Volunteer responding - Would you tell us as much as possible about the roundabout you believe is missing? Thanks!",
					"Open",

					"General error", //10
					//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!",
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",

					"Turn not allowed", //11
					//"Would you please let us know what turn was not, or should not be, allowed and the street names at the intersection? Thanks!",
					//"Volunteer responding - Would you please let us know what turn was not, or should not be, allowed and the street names at the intersection? Thanks!", //rickzabel 12/9/14
					"Volunteer responding - Would you please let us know which turn was or should not be allowed and why? Please specify the street names at the intersection. Thanks!",//rickzabel 2/26/15
					"Open",

					"Incorrect junction", //12
					//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",

					"Missing bridge overpass", //13
					//"Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!",
					"Volunteer responding - Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!", //rickzabel 12/9/14
					"Open",

					"Wrong driving direction", //14
					//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",


					"Missing Exit", //15
					//"Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!",
					"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!", //rickzabel 12/9/14
					"Open",

					"Missing Road", //16
					//"Would you tell us as much as possible about the road you believe is missing? Thanks!",
					"Volunteer responding - Would you tell us as much as possible about the road you believe is missing? Thanks!", //rickzabel 12/9/14
					"Open",


					"Missing Landmark", //18
					"Volunteer responding - Would you tell us as much as possible about the landmark you believe is missing? Thanks!",
					"Open",

					/*
					"Blocked Road", //19
					"Volunteer responding -",
					"Open",

					"Missing Street Name", //21
					"Volunteer responding -",
					"Open",

					"Incorrect Street Prefix or Suffix", ///22
					"Volunteer responding -",
					"Open",


					*/

					"<br>",
					"",
					"",
					//End of Default URs  

					"User Followed Waze's route",
					//"It appears that you ended up going the route Waze suggested, what was the problem you were having? Would you tell us your destination as you entered it into Waze? Thanks!",
					//"It appears that you followed the Waze-suggested route. What problem did you encounter here? Would you tell us your destination as you entered it into Waze? Thanks!",  //karlcr9911 12/7/2014
					"Volunteer responding - It appears that you followed the route Waze suggested. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //reworded rickzabel 12/7/2014
					"Open",

					"Alley Interference",
					//"Waze doesn't tell volunteer editors where you were going, although it was probably adjacent to the alley. If you would, please supply your destination as you entered it into Waze it may be helpful in correcting the route. Thanks!",
					//"Waze does not let the volunteer editors know where you were going, although it was probably adjacent to the alley. If you would, please supply your destination as you entered it into Waze, it may be helpful in correcting the route. Thanks!", //rickzabel 12/7/14
					"Volunteer responding - Waze does not let the us know where you were going, although it was probably adjacent to the alley. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
					"Open",

					"Road Closed",
					//"Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!", //karlcr9911
					"Volunteer responding - Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!", //rickzabel 12/9/14
					"Open",

					"Area Entrances",
					"We have had problems with Google pins being placed in the center of large landmarks. Delete your previous search and do a new search for the location. Go to the bottom of the auto fill list to see more results and make sure you pick the Waze search engine.",
					"Open",

					"48 Hour Reply",
					//"Please allow 48 hours for changes to be reflected in the live map.",
					"We made some changes to the map, please allow up to 48 hours for the changes to be reflected on the live map.", //rickzabel 12/7/14 //t0cableguy 12/8/14, karlcr9911 12/8/14
					"Open",

					"Clear Saved Locations",
					//"You should remove the location from your favorites and recent searches and then re-search for the location to update the result.",
					//"To get an updated result you should remove the location from your favorites and recent searches and then re-search for the location.", //rickzabel 12/7/14
					"To get an updated result, remove the location from your navigation history and then search for the location again.", //t0cableguy 12/8/14, karlcr9911 12/8/14
					"Open",

					"Clear TTS Cache",
					//"If you continue to have this problem you will need to clear your Text-to-Speech cache. Go to the navigation screen and type cc@tts in search field and hit search. You should get a pop up message that the TTS file has been cleared. It will take a few days for the file to build back up with all the spoken street names.",
					//"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. A message that the TTS file has been cleared should appear. It will take a few days for the file to download the spoken street names. Thanks!", //t0cableguy 12/8/2014, karlcr9911 12/8/14
					"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. It will take a few days for the the spoken street names to be downloaded. Thanks!", //rickzabel 12/9/14
					"Open",

					"Address - Incorrect Position",
					//"Thank you for your report. Would you please let us know what address you’re reporting the problem with? You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location your are marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks!", //i also prefer not to send messages with contractions "you’re" rickzabel 12/7/14
					//"What was the Address you had issues with? Please show us where the address you had issues is with the Report > Places feature in Waze. After taking a picture move as close to the entrance of the place you are adding before saving. Please do not submit images with personal details. Thanks!", //t0cableguy 12/7/14, karlcr9911 12/8/14
					"What was the Address you had issues with? Please show us where the address you had issues is with the Report > Places feature in Waze. After taking a picture move as close to the entrance of the place you are adding before saving. Please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 2/26/15
					"Open",

					"Address - Missing from Map",
					//"Thank you for your report. Would you please let us know where the address you're reporting is? The live map doesn't have all the street numbers for that street and Waze is interpolating in error. You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location you’re marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks!", //rickzabel 12/7/14 
					//"Volunteer responding -  Would you let us know the address that is missing? The live map does not have all the street numbers. You can also use the Report Places feature in Waze to mark the location. It is helpful that after taking a picture that you move near the location you’re marking to save the place. Also, please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 12/9/14 
					"Volunteer responding -  Would you let us know the address that is missing? The live map does not have all the street numbers. You can also use the Report Places feature in Waze to mark the location. It is helpful that after taking a picture that you move near the location you’re marking to save the place. Please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 2/26/15 
					"Open",

					"Address - Bad Results",
					//"Thank you for your report. The search feature retrieves results from a number of locations, including Google. Scrolling to the bottom the Navigate screen, you'll see more results for 'name.' Select that and Waze will list locations Around You. From there, you can also select results from other search engines.",
					//"Search results in Waze are retrieved from numerous sources. After tapping search, Scroll to the bottom and you will see options for other search engines . Please try a different option as each one may provide better navigation", //t0cableguy 12/7/14, karlcr9911 12/8/14
					"Search results in Waze are retrieved from numerous sources. After tapping search, Scroll to the bottom and you will see options for other search engines. Please try a different option as another search engine might have the address you are looking for", //rickzabel 12/9/14
					"Open",

					"House Number Adjustment",
					//"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow 48 hours for changes to be reflected in the live map. If the location is in your saved searches or favorites, please remove them and search for them again to pick up the change in the live map. Please let me know if you continue to experience the problem. Thanks!",
					"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow up to 48 hours for changes to be reflected in the live map. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Please let me know if you continue to experience this problem by submitting another error report. Thanks!", //rickzabel 12/7/14 //karlcr9911 12/8/14
					"Open",

					"Missing Bridges or Roads",
					//"The roads here have been pretty thoroughly mapped and we volunteers can't see anything missing that should ordinarily be there. Waze probably simply chose not to show you the feature in question. When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!",
					"The roads for this area are thoroughly mapped and the volunteer editors can not find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!", //reworded rickzabel 12/7/14  //karlcr9911 12/8/14
					"Open",

					"Manual Refresh",
					//"You can try a manual refresh by going to Settings > Advanced > Data transfer > refresh maps.",
					//"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Second you can try clearing Waze's app cache in your phone’s app manager. The final option is  to Uninstall and Reinstall the app.", //t0cableguy 12/7/14
					//"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Second, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", // to Uninstall and Reinstall the app. (avoid user to use cellular data) //carloslaso 12/7/14 //rickzabel //t0cableguy
					"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Secondly, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", //GizmoGuy rickzabel 2/26/15
					"Open",

					"Pave Road",
					//"Please use the pave function in the app to show us the path of the missing road. You can do this by tapping the bottom right Pin icon, then Map Issue, and selecting the Pave Road tab. Once you leave any mapped roads you can tap start paving. Please be sure to tap the steamroller and tap stop paving before driving back onto any roads that are mapped. If paving a parking lot, please only drive the main roads and perimeters, not each aisle and space. Thanks for your contribution to the map! Thanks!", //requested by t0cableguy
					//"Please use the pave function in the app to show us the path of the missing road. You can do this by tapping the bottom right Pin icon, then Map Issue, and selecting the Pave Road tab. Once you leave any mapped roads you can tapp paving. Please be sure to tap the steamroller and tap stop paving before driving back onto any roads that are mapped. If paving a parking lot please only drive the main roads and perimeters, not each aisle and space. Thanks for your contribution to the map! Thanks!",//rickzabel
					//"Please pave the road in the app. Tap the Pin icon > Map Issue > Pave Road tab. After leaving any mapped roads tap start paving. Once done tap the steamroller > stop paving. Thanks for your contribution to the map!", //shortened and voted for by t0cableguy 12/7/14, karlcr9911 12/8/14
					//"Please pave the road in the app. Tap the Pin icon > Map Issue > Pave Road tab. After leaving any mapped roads tap start paving. Once done tap the steamroller > stop paving. If you then tap the  Pin icon (Report) > Map Issue > Missing Road, you can enter text providing information about the new road (name, is it a private road, etc.). Thanks for your contribution to the map!",//addition suggested by SuperDave1426 12/08/14
					//We already have open communication if we are telling them to pave a road. It would be helpful to drop ur pins but we have open communication and the users know how to submit reports. We shouldn’t close the UR that is already open, so we don’t need another UR.  t0cableguy 12/8/14 I’m leaning more torward adding this though SD as a teaching tool. t0cableguy 12/8/14
					//"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road tap start paving. Once done tap the steamroller > stop paving. You can provide information about the new road such as it's name buy tapping on the Pin icon > Map Issue > Missing Road, and Thanks!", //rickzabel 12/8/14 t0cableguy 12/8/14
					"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road tap start paving. Once done tap the steamroller > stop paving. You can provide information about the new road such as it's name by tapping on the Pin icon > Map Issue > Missing Road, and Thanks!", //rickzabel 2/26/15
					"Open",

					"The road has been closed.",
					//"Thank you for your report, the road has been closed.",
					//"Volunteer responding - Thank you for your report, the road has been closed.", //rickzabel 1211/14
					"Volunteer responding - Thank you for your report. The road has been closed.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"Open", //requested by SkiDooGuy

					//"Blank Screen.",
					//"Please follow these instructions in the app. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh map of my area. Second you can try clearing Waze's app cache in your phone’s app manager. The final option is  to Uninstall and Reinstall the app.",
					//"Open", //requested by t0cableguy 12/7/14 in map refresh now t0cableguy 12/8/14

					"Unlock request",
					//"I have requested the rights to get this issue fixed. Thanks for your report. Thanks! ", //requested by t0cableguy 12/8/14 
					//"Volunteer responding to your report: I have requested the rights to get this issue fixed. Thanks for your report.", //rikzabel 12/8/14  i usually dont say anything cause this is weird that they made a request for you to make a request…
					//"I have begun the process to get this issue fixed. Thanks for your report. Thanks! ",//reword t0cableguy 12/8/14
					//"I have begun the process to get this issue fixed. Thanks for your report!", //rickzabel 12/11/14
					"I have started the process to get this issue fixed. Thanks for your report!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
					"Open"

            ];
            //auto insertion config:
            //the position in the list that the reminder message is at. (counting titles, comments, and ur status)
            ReminderPosistion = 15;

            //the position of the close as Not Identified message that you have in the list (the first comment is the list is 0)
            CloseNotIdentifiedPosistion = 18;

            //this is the text for the link when doing reminder messages
            //ReplyInstructions = 'To reply, click the following link and then expand the conversation area.';
			ReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015
			//ReplyInstructions = 'To reply to this message click the following link and then click the conversation button.';
			//ReplyInstructions = 'To reply, click the following link and then click the conversation button.';
			//ReplyInstructions = 'To reply, click the following link and then expand the conversation area.';
            //Waze's default URs number to name conversion array
            //Thanks to SuperMedic

            def_names[6] = "Incorrect turn";
            def_names[7] = "Incorrect address";
            def_names[8] = "Incorrect route";
            def_names[9] = "Missing roundabout";
            def_names[10] = "General error";
            def_names[11] = "Turn not allowed";
            def_names[12] = "Incorrect junction";
            def_names[13] = "Missing bridge overpass";
            def_names[14] = "Wrong driving direction";
            def_names[15] = "Missing Exit";
            def_names[16] = "Missing Road";
            def_names[18] = "Missing Landmark";
            def_names[19] = "Blocked Road";
            def_names[21] = "Missing Street Name";
            def_names[22] = "Incorrect Street Prefix or Suffix";

            //end CommentTeam's list

			//custom other languages lists from external list
			// } else if (SelectedBoilerPlateCreator === "Custom") {
	   } else {
		   
		  
		   
            var CustomListError = false;
            var CustomErrorListText = "";
            var CustomErrorListCount = 0;
            if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "Array2")) {
                CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "Array2, ";
                CustomListError = true;
                CustomErrorListCount = CustomErrorListCount + 1;
            }

            if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names")) {
                CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "def_names, ";
                CustomListError = true;
                CustomErrorListCount = CustomErrorListCount + 1;
            }

            if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReplyInstructions")) {
                CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "ReplyInstructions, ";
                CustomListError = true;
                CustomErrorListCount = CustomErrorListCount + 1;
            }

            if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion")) {
                CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion, ";
                CustomListError = true;
                CustomErrorListCount = CustomErrorListCount + 1;
            }

            if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "CloseNotIdentifiedPosistion")) {
                CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "CloseNotIdentifiedPosistion.";
                CustomListError = true;
                CustomErrorListCount = CustomErrorListCount + 1;
            }


            if (CustomListError === false) {

                //found custom list
                URCommentsArray = eval("window.Urcomments" + SelectedBoilerPlateCreator + "Array2");

                ReplyInstructions = eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReplyInstructions");
                //the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status)
                ReminderPosistion = eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion");

                //the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status)
                CloseNotIdentifiedPosistion = eval("window.Urcomments" + SelectedBoilerPlateCreator + "CloseNotIdentifiedPosistion");

                //copy the waze default titles into the active ?
                //Waze's default URs number to name conversion array
                //Thanks to SuperMedic

                def_names[6] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[6]"); //"Incorrect turn";
                def_names[7] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[7]"); //"Incorrect address";
                def_names[8] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[8]"); //"Incorrect route";
                def_names[9] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[9]"); //"Missing roundabout";
                def_names[10] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[10]"); //"General error";
                def_names[11] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[11]"); //"Turn not allowed";
                def_names[12] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[12]"); //"Incorrect junction";
                def_names[13] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[13]"); //"Missing bridge overpass";
                def_names[14] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[14]"); //"Wrong driving direction";
                def_names[15] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[15]"); //"Missing Exit";
                def_names[16] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[16]"); //"Missing Road";
                def_names[18] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[18]"); //"Missing Landmark";
                def_names[19] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[19]"); //"Blocked Road";
                def_names[21] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[21]"); //"Missing Street Name";
                def_names[22] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[22]"); //"Incorrect Street Prefix or Suffix";	

            } else {
				//on problem set the list back to the comments team
				localStorage.setItem('BoilerPlateCreators', 'CommentTeam');
			
                if (CustomErrorListCount == 5) {
                    alert("UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: " + CustomErrorListText);
                } else {
                    alert("UR Comments - you are missing the following items from your custom comment list: " + CustomErrorListText);

                }

                URCommentsArray = [SelectedBoilerPlateCreator + " List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/",
                    " ",
                    " "
                ];
                ReplyInstructions = 'To reply to this request go to the following link and click the map pin, then click on the conversation button.';
            }
        }
        URComments_init();
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////
    ////// init
    //////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function URComments_init() {
        //console.log("URComments - Start init 1");

        //create the URComments object
        var URComments = {};

        URComments.init = function() {
		
			
			//if we are changing the language do not redraw the tab		
			if (ChangeLanguage === false) {
		
				//CSS
				//expand the UR textarea so we can verfiy what comment we clicked on. special thanks to SeekingSerenity 
				var g = '.ur-comment-list .comment-list { bottom: 200px !important; } .ur-comment-list .new-comment-form textarea { height: 140px !important; } .ur-comment-list .new-comment-form { height: 200px !important; }';

				//betaeditor commetn textarea
				g = g + '.new-comment-form .new-comment-text { height: 140px !important; }';

				//css for items in my tab that are in a label (uro presets)
				g = g + '#sidepanel-Comments label { cursor:pointer; margin:0px 0px 0px; vertical-align: middle;font-size: 10px;}';

				//css for checkboxes
				g = g + '#sidepanel-Comments .URCommentsCheckbox { text-decoration:none; cursor:pointer; color: #000000; margin:0px 0px 0px; vertical-align: middle; font-size: 12px;}';

				//css for our comments,
				g = g + '#sidepanel-Comments .URComments { text-decoration:none; cursor:pointer; color: #000000; font-size: 12px;}'; // margin-top: 5px;

				//css for our uro presets,
				g = g + '#sidepanel-Comments .URCommentsPresets { text-decoration:none; cursor:pointer; color: #000000; font-size: 10px;}';
				
				//css for our nav tabs,
				g = g + '#comments-tab22 ul { font-size: 12px; padding: 0px;}';
				
				//css for our nav tabs links,
				g = g + '#comments-tab22 a { padding: 3px !important ; margin-right: 0px !important;}';
				
				// keep the padding on our nav tabs
				g = g + '#comments-tab22 nav-tabs { padding: 0px !important;}';
				
				//css for non selected UR opacity
				g = g + ".olMap.problem-selected .map-problem:not(.selected) { opacity: .7 !important;}";
				
				
				//css to fix the beta editors UR window
				g = g + '.problem-edit .section .title { line-height: 15px !important;  }';
				
				g = g + '.problem-edit .header { line-height: 15px !important; padding: 0px 15px!important; }';
				g = g + '.problem-edit .section .content { padding: 5px !important;}';
				
				/*
				g = g + '.problem-edit { max-height: 85% !important; }';
				
				//g = g + '.problem-edit .body { position: absolute !important; top: 30px !important; bottom: 5px !important; overflow: auto !important;}';
				
				//g = g + '.problem-edit .body { position: absolute !important; top: 30px !important; bottom: 5px !important; overflow: auto !important; width: 280px !important;}';
				
				g = g + '#panel-container .panel { left: 0px !important; top: 60px !important; bottom: 25px !important; margin-bottom: 15px !important;}';
				
				g = g + '.problem-edit .conversation.section .new-comment-form { padding: 10px 15px !important; }';
				//g = g + '.problem-edit .conversation.section .new-comment-form textarea { placeholder: "Remember, be nice!"; margin-bottom: 5px; }';
				g = g + '.problem-edit .actions .controls-container label[for|="state"] { margin-bottom: 5px; }';
				g = g + '.header .close-panel { padding-top: 5px; }';
				g = g + '.header .focus { padding-top: 5px; }';
				g = g + '.problem-edit .conversation.section .comment-list { padding-right: 0px; margin-right: 5px; padding-left: 0px; margin-left: 5px; overflow-y: hidden; max-height: 100%;}';
				*/
				//css to undo some of the changes from maxmizer
				
				if($("#sidebar").width() < 300) {
					g = g + '#sidebar { max-width: 290px !important;}';
					g = g + '.show-sidebar .row-fluid .fluid-fixed {margin-left: 290px !important;}';
				}
				
				//append our css to the head
				$("head").append($('<style type="text/css">' + g + '</style>'));

				//console.log("URComments - Start adding the URComments's tab");

				//add comments tab
				var b = $('<li><a href="#sidepanel-Comments" data-toggle="tab" id="CommentsTab">URComments</a> </li> ');
				//i had to switch to first() becuase someone was reusing the nav tabs in another script and this would cause my tab to go inside theirs!
				$("h2 + ul.nav-tabs").first().append(b);


				//add the content to the comments tab
				//Comment tab header and zoom out button
				var c = "";
				c = c + '<div class="tab-pane" id="sidepanel-Comments" ><div class="URComments"></div></div>';
				$("h2 + ul.nav-tabs + .tab-content").append(c);
				
			}
			//reset the var to change the language
			ChangeLanguage = false;

			
			var c = "";
			c = c + '<div style="position: absolute; left: 20px;"><img src="' + UrCommentsIcon + '" style="cursor:default;"></div>';
			
			//UR count
			//c = c + '<div Title="Numner of UR Shwon" id="URCount" style="position: absolute; top: 110px; left: 0px; font-size: 8px; width: 75px; text-align: center;"></div>';
			//c = c + '<div Title="Numner of UR Shwon" id="URCount" style="font-size: 8px; width: 75px; text-align: center;"></div>';
			

			c = c + '<div style="position: absolute; left: 70px;"><b>UR Comments Version ' + URCommentVersion + '</b>';
			c = c + '<br>';
			c = c + '<a id="URCommentZoomOutButton" class="URComments" Title="Zooms all the way out and closes the UR window">Zoom Out 0 & Close UR</a>';
			c = c + '<br>';
			c = c + '<a id="URCommentZoomOutButton2" class="URComments" Title="Zooms out to level 2 this is where I found most of the toolbox highlighting works and closes the UR window">Zoom Out 2 & Close UR</a>';
			c = c + '<br>';
			c = c + '<a id="URCommentZoomOutButton3" class="URComments" Title="Zooms out to level 3 this is where I found most of the toolbox highlighting works and closes the UR window">Zoom Out 3 & Close UR</a>';		
			c = c + '<div id="URCWazeReloadMap" title="Reload the map" data-original-title="" class="icon-repeat reload-button URComments" content="" style="font-size: 20px; position: absolute; left: 140px; top: 22px;"></div>';			
			//c = c + '</div>';
			
			//c = c + '</div>';
			
			            //test

			//UR count
			//c = c + '<div Title="Numner of UR Shwon" id="URCount" style="position: absolute; top: 110px; left: 30px; font-size: 8px; width: 55px;"></div>';
			c = c + '<div Title="Numner of UR Shwon" id="URCount" style="font-size: 8px; width: 75%; text-align:center;"></div>';
			
            //i had to switch to first() becuase someone was reusing the nav tabs in another script and this would cause my tab to go inside theirs
			
            $("#sidepanel-Comments").append(c);
			
			//add the map zoomout handlers
			//$("#URCommentZoomOutButton").click(URComments.SetZoomCloseUR(0, "CloseUR"));
            $("#URCommentZoomOutButton").click(URComments.SetZoomCloseUR(0, "CloseUR"));
			$("#URCommentZoomOutButton2").click(URComments.SetZoomCloseUR(2, "CloseUR"));
			$("#URCommentZoomOutButton3").click(URComments.SetZoomCloseUR(3, "CloseUR"));
			
			
			//add the map reload handler
			$("#URCWazeReloadMap").click(URComments.AutoReloadMapOnComment);

            c = '<div id="comments-tab22" class="active" style="padding-top: 90px;">';
            c = c + '	<ul class="nav nav-tabs">';
            c = c + '		<li class="active"><a data-toggle="tab" href="#sidepanel-URComments-list">Comments</a></li>';
            c = c + '		<li><a data-toggle="tab" href="#sidepanel-URComments-URO-Presets">UR Filtering</a></li>';
            c = c + '		<li><a data-toggle="tab" href="#sidepanel-URComments-settings">Settings</a></li>';
            c = c + '	</ul>';
            c = c + '	<div class="tab-content">'; // style="padding: 10px 1px 1px 10px !important;"
            c = c + '		<div class="tab-pane active" id="sidepanel-URComments-list">';
            c = c + '		</div>';
            c = c + '		<div class="tab-pane" id="sidepanel-URComments-URO-Presets">';
            c = c + '		</div>';
            c = c + '		<div class="tab-pane" id="sidepanel-URComments-settings">';
            c = c + '		</div>';
            c = c + '	</div>';
            c = c + '</div>';

            //add the sub tabs to the scripts main tab
            $("#sidepanel-Comments").append(c);
			
			////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////
            ////// Comments
            //////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////


			//enable or disable urc filtering URCommentsFilterEnabled
			d = $('<label Title="Enable or disable URComments filtering"><input type="checkbox" id="URCommentsFilterEnabled" class="URCommentsCheckbox"> Enable URComments UR filtering</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsFilterEnabled").click(function () {
				$(localStorage.setItem('URCommentsFilterEnabled', URCommentsFilterEnabled.checked ));
				
				//if(URCommentsFilterEnabled.checked == true){
					setTimeout(URComments.FilterURs('filterenabled'), 0);
				//}
			});
			
			var avdd = localStorage.getItem('URCommentsFilterEnabled');
			if(avdd === null) { avdd = true;}
			$("#URCommentsFilterEnabled").prop('checked', eval(avdd));
			
			
			//enable or disable ur pill counts
			d = $('<label Title="Enable or disable the pill with UR counts"><input type="checkbox" id="URCommentsPillEnabled" class="URCommentsCheckbox"> Enable UR pill counts</input></label><br><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsPillEnabled").click(function () {
				$(localStorage.setItem('URCommentsPillEnabled', URCommentsPillEnabled.checked ));
				
				//if(URCommentsPillEnabled.checked == true){
					setTimeout(URComments.FilterURs('filterenabled'), 0);
				//}
			});
			
			var avdd = localStorage.getItem('URCommentsPillEnabled');
			if(avdd === null) { avdd = true;}
			$("#URCommentsPillEnabled").prop('checked', eval(avdd));
			
			
			//hide inbetween ur
			d = $('<label Title="Only show UR that need work (hide inbetween states)"><input type="checkbox" id="URCommentsHideInbetween" class="URCommentsCheckbox"> Hide Waiting</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideInbetween").click(function () {
				$(localStorage.setItem('URCommentsHideInbetween', URCommentsHideInbetween.checked ));
				setTimeout(URComments.FilterURs('hideInbetween'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideInbetween');
			if(avdd === null) { avdd = true;}
			$("#URCommentsHideInbetween").prop('checked', eval(avdd));



			//hide UR that are not "mine"
			d = $('<label Title="Hide UR where there are zero from the logged in editor"><input type="checkbox" id="URCommentsHideNotMyUR" class="URCommentsCheckbox"> Only show my UR</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideNotMyUR").click(function () {
				$(localStorage.setItem('URCommentsHideNotMyUR', URCommentsHideNotMyUR.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideNotMyUR'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideNotMyUR');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideNotMyUR").prop('checked', eval(avdd));

			//show UR that have gone past the close day setting
			d = $('<label Title="Show UR that have gone past the close day setting"><input type="checkbox" id="URCommentsShowPastClose" class="URCommentsCheckbox"> Show others UR past close</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsShowPastClose").click(function () {
				$(localStorage.setItem('URCommentsShowPastClose', URCommentsShowPastClose.checked ));
				setTimeout(URComments.FilterURs('URCommentsShowPastClose'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsShowPastClose');
			if(avdd === null) { avdd = true;}
			$("#URCommentsShowPastClose").prop('checked', eval(avdd));

			
			
			//hide reminders
			d = $('<label Title="Hide UR where reminders are needed"><input type="checkbox" id="URCommentsHideReminderNeeded" class="URCommentsCheckbox"> Hide UR Reminders needed</input></label><br><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideReminderNeeded").click(function () {
				$(localStorage.setItem('URCommentsHideReminderNeeded', URCommentsHideReminderNeeded.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideReminderNeeded'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideReminderNeeded');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideReminderNeeded").prop('checked', eval(avdd));


			//hide replies
			d = $('<label Title="Hide UR with user replies"><input type="checkbox" id="URCommentsHideReplies" class="URCommentsCheckbox"> Hide user replies</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideReplies").click(function () {
				$(localStorage.setItem('URCommentsHideReplies', URCommentsHideReplies.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideReplies'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideReplies');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideReplies").prop('checked', eval(avdd));
			
						
							
			//hide older than 7 day
			d = $('<label Title="Hide UR that need closing"><input type="checkbox" id="URCommentsHideCloseNeeded" class="URCommentsCheckbox"> Hide UR close needed</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideCloseNeeded").click(function () {
				$(localStorage.setItem('URCommentsHideCloseNeeded', URCommentsHideCloseNeeded.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideCloseNeeded'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideCloseNeeded');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideCloseNeeded").prop('checked', eval(avdd));
			
			
			//hide initial
			d = $('<label Title="Hide UR that have zero comments"><input type="checkbox" id="URCommentsHideInital" class="URCommentsCheckbox"> Hide UR no comments</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideInital").click(function () {
				$(localStorage.setItem('URCommentsHideInital', URCommentsHideInital.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideInital'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideInital');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideInital").prop('checked', eval(avdd));
			
			//Hide UR that do not have descriptions
			d = $('<label Title="Hide UR that do not have descriptions or comments"><input type="checkbox" id="URCommentsHideWithoutDescript" class="URCommentsCheckbox"> hide 0 comments without descriptions</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideWithoutDescript").click(function () {
				$(localStorage.setItem('URCommentsHideWithoutDescript', URCommentsHideWithoutDescript.checked ));
				setTimeout(URComments.FilterURs('HideWithoutDescript'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideWithoutDescript');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideWithoutDescript").prop('checked', eval(avdd));
			
			
			//Hide UR that have descriptions
			d = $('<label Title="Hide UR that have descriptions and zero comments"><input type="checkbox" id="URCommentsHideWithDescript" class="URCommentsCheckbox"> hide 0 comments with descriptions</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideWithDescript").click(function () {
				$(localStorage.setItem('URCommentsHideWithDescript', URCommentsHideWithDescript.checked ));
				setTimeout(URComments.FilterURs('HideWithDescript'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideWithDescript');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideWithDescript").prop('checked', eval(avdd));			
			
			
			

			//hide closed
			d = $('<label Title="Hide closed UR"><input type="checkbox" id="URCommentsHideClosed" class="URCommentsCheckbox"> Hide Closed UR</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideClosed").click(function () {
				$(localStorage.setItem('URCommentsHideClosed', URCommentsHideClosed.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideClosed'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideClosed');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideClosed").prop('checked', eval(avdd));
						
			
			
			//hide notes
			d = $('<label Title="Hide UR that are tagged with URO stle tags ex. [NOTE]"><input type="checkbox" id="URCommentsHideNotes" class="URCommentsCheckbox"> Hide Tagged UR</input></label><br><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			$("#URCommentsHideNotes").click(function () {
				$(localStorage.setItem('URCommentsHideNotes', URCommentsHideNotes.checked ));
				setTimeout(URComments.FilterURs('URCommentsHideNotes'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsHideNotes');
			if(avdd === null) { avdd = false;}
			$("#URCommentsHideNotes").prop('checked', eval(avdd));

			
			//days used to filter UR
			var d = $('<form>Reminder days: <input type="text" id="ReminderDays" style="width: 35px;"><br>Close days: <input type="text" id="CloseDays" style="width: 35px;"><br> </form><br><br><br><br><br><br>');
			//var d = $('<form>Reminder days: <input type="text" id="ReminderDays" style="width: 35px;"><br></form><br><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-URO-Presets").append(d);
			
			
			//load reminder days
			$('#ReminderDays').val(localStorage.getItem('ReminderDays'));
			//load close days			
			$('#CloseDays').val(localStorage.getItem('CloseDays'));
			//on load validation
			if ($('#ReminderDays').val() < 1 || $('#ReminderDays').val() >= $('#CloseDays').val() ) {
				$('#ReminderDays').val('4');
				$(localStorage.setItem('ReminderDays', $('#ReminderDays').val() ));
			}		
			if ($('#CloseDays').val() < 1 || $('#CloseDays').val() <= $('#ReminderDays').val() ) {
				$('#CloseDays').val('7');
				$(localStorage.setItem('CloseDays', $('#CloseDays').val() ));
			}
			
			//reminder days verification
			$("#ReminderDays").change(function () {
				if ($('#ReminderDays').val() < 1 || $('#ReminderDays').val() >= $('#CloseDays').val() ) {
					$('#ReminderDays').val('4');
					alert("urcomments you can not sent the reminder message to zero days or a larger than close days");
				} else {
					//save 
					$(localStorage.setItem('ReminderDays', $('#ReminderDays').val() ));
					setTimeout(URComments.FilterURs('ReminderDaysChange'), 0);
				}
			});
			
			//close days verification
			$("#CloseDays").change(function () {
				if ($('#CloseDays').val() < 1 || $('#CloseDays').val() <= $('#ReminderDays').val() ) {
					$('#CloseDays').val('7');
					alert("urcomments you can not sent the number of days for the reminder message to zero days or below the number used for reminder days");
				} else {
					//save
					$(localStorage.setItem('CloseDays', $('#CloseDays').val() ));
					setTimeout(URComments.FilterURs('CloseDaysChange'), 0);
				}
			});
		

/*
            //mapraid AvoidInitialWithDescriptions
			d = $('<label Title="Avoid Initial With Descriptions"><input type="checkbox" id="AvoidInitialWithDescriptions" class="URCommentsCheckbox"> Avoid Initial With Descriptions</input></label><br><br>');
            $("#sidepanel-URComments-list").append(d);
			$("#AvoidInitialWithDescriptions").click(function () {
				$(localStorage.setItem('AvoidInitialWithDescriptions', AvoidInitialWithDescriptions.checked ));
			});
			
			var avdd = localStorage.getItem('AvoidInitialWithDescriptions');
			if(avdd === null) { avdd = true;}
			$("#AvoidInitialWithDescriptions").prop('checked', eval(avdd));
	*/
			//mapraid tools
			var d = $('<a id="MapraidReport" class="URComments" Title="Mapraid send reminders for all UR that need reminders">Mapraid Send Reminders</a></div><br><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
            //create the callback function
            $("#MapraidReport").click(URComments.FilterURs('SendAllReminders'));
			//setTimeout(URComments.FilterURs(a), 0);
			
/*
			var d = $('<a id="MapRaidreminders" class="URComments" Title="Mapraid Send messages to all urs that are in the visiable area, that need reminder messages">MapRaid reminders</a></div><br><br><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
			//create the callback function
            $("#MapRaidreminders").click(URComments.TagAllNoCommentURs('reminders'));
			
			
			var d = $('<a id="MapRaid" class="URComments" Title="Mapraid Send messages to all urs that are in the visiable area, that need initial or reminder messages">MapRaid</a></div><br>><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
            //create the callback function
            $("#MapRaid").click(URComments.TagAllNoCommentURs('all'));
			*/
			
	/*		
			 var d = $('<a id="MapRaidAll" class="URComments" Title="Mapraid Send messages to all urs that are in the visiable area, that need initial or reminder messages">MapRaid - Initial and Reminder comments</a></div><br><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
			//create the callback function
            $("#MapRaidAll").click(URComments.TagAllNoCommentURs('all'));
	*/
            //start generating the comment list and mouse click handlers
            //console.log("URComments - Start adding comments to the comment tab");
            //comments setup
			d = "";

            //CurrentIndex is used to keep count of total arrays pairs which is used on the div's id tags
            var CurrentIndex = 1;
            //console.log("URComments - Create Div 1");

            //setup the comment color var
            var colorrr = "CC0000";
            var Title = "";
            var URCommentURLNote = "";

            //go over the array and generate divs
            for (var i = 0; i < URCommentsArray.length; i = i + 3) {
                //console.log("URComments - Create div for - " + URCommentsArray[i] + " " + URCommentsArray[i + 2]);

                // make the URStatus lower case
                var URStatus = (URCommentsArray[i + 2]).toLowerCase();

                if (URStatus === "open") {
                    //black
                    colorrr = "#000000";
                } else if (URStatus === "solved") {
                    //green
                    colorrr = "#008F00";
                } else if (URStatus === "notidentified") {
                    //orange
                    colorrr = "#E68A00";
                } else {
                    //red - not defined and that is a problem	
                    colorrr = "#CC0000";

                }
                //escaping titles and comments with escapeHtml(Comment) so we can display items with special char as html;
                //generate the comment links

                Title = URCommentsArray[i];
                var Comment = URComments.escapeHtml(URCommentsArray[i + 1]);

                //normal comment link
                d = '<div><a id="URComments-comment' + CurrentIndex + '" class="URComments" style="color:' + colorrr + '" Title="Title: ' + Title + ' Action: ' + URStatus + '; Comment: ' + Comment + ' ">' + Title + '</a>';
                //$("#sidepanel-Comments").append(d);

                //(double click) comment add-on
                if (URCommentsArray[i] === URCommentsArray[CloseNotIdentifiedPosistion] && localStorage.getItem('DBLClk7DCAutoSend') == "yes" || localStorage.getItem('DBLClkAll') == "yes") {
                    if (URCommentsArray[i] !== "<br>") {
                        d = d + '<a id="URComments-commentDBLCLK' + CurrentIndex + '" class="URComments" style="color:' + colorrr + '" Title="Double click here to auto send - ' + Title + '"> (Double Click)</a>';
                    }
                }

                d = d + '</div>';

                //add comment to list
                $("#sidepanel-URComments-list").append(d);

                //console.log("URComments - Create callback(s) for - " + 'URComments-comment' + CurrentIndex);

                urID = 0;

                //create the click function for each comment
                $("#URComments-comment" + CurrentIndex).click(URComments.AutoZoomIN(URCommentsArray[i], URCommentsArray[i + 1], URStatus, urID));

                //create the double click function for each comment
                if (URCommentsArray[i] !== "<br>" && URCommentsArray[i] === URCommentsArray[CloseNotIdentifiedPosistion] && localStorage.getItem('DBLClk7DCAutoSend') == "yes" || localStorage.getItem('DBLClkAll') == "yes") {
                    //use this to click send automatically
                    if (URCommentsArray[i] !== "<br>") {
                        $("#URComments-commentDBLCLK" + CurrentIndex).dblclick(URComments.AutoZoomIN(URCommentsArray[i], URCommentsArray[i + 1], URStatus, urID, "AutoSendComment"));
                    }

                }

                //inc the CurrentIndex
                CurrentIndex++;
            }

			//add 2 br to the end of the list for lower resolution monitors
			d = '<br><br>';
			$("#sidepanel-URComments-list").append(d);	

			

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////
            ////// URO+ Preset filters
            //////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //console.log("URComments - Start adding URO preset filters to the comment tab");
            //uro preset header
            // var d = $('<div title="This is a list of saved settings for URO+ that will help you find URs of a certian type."><b>URO+ Presets</b></div>');
            //$("#sidepanel-URComments-list").append(d);
			
            //URO+ new ur with no description
            var d = $('<div><a id="URONewNoDescription" class="URCommentsPresets" Title="Use URO+ to only show new requests without descriptions">URO+ New UR without descriptions</a></div>');
            $("#sidepanel-URComments-URO-Presets").append(d);
            $("#URONewNoDescription").click(URComments.UROClearClicked('URONewNoDescription'));

            //URO+ new ur
            d = $('<div><a id="URCommentURONEW" class="URCommentsPresets" Title="Use URO+ to only show new requests or ones that have replies from the requestor">URO+ New requests / UR replies</a></div>');
            $("#sidepanel-URComments-URO-Presets").append(d);
            $("#URCommentURONEW").click(URComments.UROClearClicked('UroShowNew'));

            //show no responses for reminders
            d = $('<div><a id="URCommentURO4DayFollowUp" class="URCommentsPresets" Title="Use URO+ to only show URs that need a reminders message sent to them">URO+ Reminder message</a></div>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentURO4DayFollowUp").click(URComments.UROClearClicked('URO4DayFollowUp'));

            //show no responses for 7 days needs closing
            d = $('<div><a id="URCommentURO7Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 7 days and need to be closed">URO+ 7 Day</a></div>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentURO7Day").click(URComments.UROClearClicked('URO7Day'));

            //show no responses for 8 days needs closing
            d = $('<div><a id="URCommentURO8Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 8 days and need to be closed">URO+ 8 Day</a></div>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentURO8Day").click(URComments.UROClearClicked('URO8Day'));

            //show no responses for 10 days needs closing
            d = $('<div><a id="URCommentURO10Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 10 days and need to be closed">URO+ 10 Day</a></div>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentURO10Day").click(URComments.UROClearClicked('URO10Day'));

            //show no responses for 24 Hour Notice now needs closing
            d = $('<div><a id="URCommentURO24Hr" class="URCommentsPresets" Title="URO+ 8 day 24 Hour Notice. the idea behind this one is that on day 7 you will send 24 hour notices and then 24 hours later come back with this preset to find the ones that need closing">24 Hour Notice expermintal</a></div>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentURO24Hr").click(URComments.UROClearClicked('URO24Hr'));

            //URO+ clear
            d = $('<div><a id="URCommentUROclearUROFiltrs" class="URCommentsPresets" Title="Clears all of the checks boxes in URO’s URs tab, except for Do not apply state/age filters to tagged URs and if you have Only My URs enabled in URComments">URO+ Clear UR Filters</a></div>');
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentUROclearUROFiltrs").click(URComments.UROClearClicked('UROclearUROFiltrs'));

            //the predefined presets only show comments that the current user has commented on
            d = $('<label Title="Use URO+ to only Show URs with comments from me"><input type="checkbox" id="URCommentUROOnlyMyUR" class="URCommentsCheckbox"> Only My URs</input></label><br>');
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentUROOnlyMyUR").click(URComments.OnlyMyUR);
			
			//the predefined presets only show comments that the current user has commented on
            d = $('<label Title="Use URO+ to hide tagged pins. This setting will not be saved."><input type="checkbox" id="URCommentUROHideTagged" class="URCommentsCheckbox"> Temporarily hide tagged pins</input></label><br><br>');
            $("#sidepanel-URComments-URO-Presets").append(d);
            //create the callback function
            $("#URCommentUROHideTagged").click(URComments.HideTagged("trash"));
	
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////
            ////// Draw Options
            //////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
			
            //Auto Set ur comment on new URs
            d = $('<label Title="Auto set the UR comment on new URs that do not already have comments"><input type="checkbox" id="UrCommentAutoSetNewComment" class="URCommentsCheckbox"> Auto set new UR comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoSetNewComment").click(URComments.AutoSetNewComment);

            //Auto Set ur reminder on new URs
            d = $('<label Title="Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment"><input type="checkbox" id="UrCommentAutoSet4dayComment" class="URCommentsCheckbox"> Auto set reminder UR comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoSet4dayComment").click(URComments.UrCommentAutoSet4dayComment);

            /*
            //Auto Set ur 7 day close comment
            d = $('<label Title="Auto set the UR remineder comment on URs that are older then 7 days and have only one comments"><input type="checkbox" id="UrCommentAutoSet7dayComment" class="URCommentsCheckbox"> Auto set 7 day close comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoSet7dayComment").click(URComments.UrCommentAutoSet7dayComment);
            */

            //add reply Instructions to the reminder message
            d = $('<label Title="Adds extra reply Instructions the reminder message including a link to the user request with the UR layer enabled. (The link Waze sends doesn’t have the layers enabled and people have a hard time figuring it out) NOTE this will now automatically get the url with out the need to recenter or zoom"><input type="checkbox" id="UrCommentAddReplyInstructions" class="URCommentsCheckbox"> Reminder instructions</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAddReplyInstructions").click(URComments.AddReplyInstructions);

            //auto zoom in for new with no comments
            d = $('<label Title="Auto zoom in when opening URs with no comments and when sending UR reminders"><input type="checkbox" id="UrCommentNewZoomIn" class="URCommentsCheckbox"> Auto zoom in on new UR</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentNewZoomIn").click(URComments.NewZoomIn);

            //auto center at current zoom for UR with comments
            d = $('<label Title="Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"><input type="checkbox" id="UrCommentWithCommentRecenter" class="URCommentsCheckbox"> Auto center on UR</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentWithCommentRecenter").click(URComments.WithCommentRecenter);

            //Auto Click open solved not Identified 
            d = $('<label Title="Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified"><input type="checkbox" id="URCommentAutoClickURStatus" class="URCommentsCheckbox"> Auto click open, solved, not identified</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#URCommentAutoClickURStatus").click(URComments.AutoClickURStatus);

            //UrCommentSaveAfterComment
            d = $('<label Title="If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button"><input type="checkbox" id="UrCommentSaveAfterComment" class="URCommentsCheckbox"> Auto save after a solved or not identified comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentSaveAfterComment").click(URComments.SaveAfterComment);

            //auto close after sending comment replies
            d = $('<label Title="For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button"><input type="checkbox" id="UrCommentAutoCloseComment" class="URCommentsCheckbox"> Auto close comment window</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoCloseComment").click(URComments.AutoCloseComment);

            //auto reload map after sending comment replies
            d = $('<label Title="Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."><input type="checkbox" id="UrCommentAutoReloadAfterComment" class="URCommentsCheckbox"> Auto reload map after comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoReloadAfterComment").click(URComments.AutoReloadAfterComment);

            //zoom out map after sending comment replies
            d = $('<label Title="After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom"><input type="checkbox" id="UrCommentZoomOutAfterComment" class="URCommentsCheckbox"> Auto zoom out after comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentZoomOutAfterComment").click(URComments.ZoomOutAfterComment);

            //Auto switch to the URComments tab after page load
            d = $('<label Title="Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"><input type="checkbox" id="UrCommentAutoSwitchToURCommentsTab" class="URCommentsCheckbox"> Auto switch to the UrComments tab</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoSwitchToURCommentsTab").click(URComments.AutoSwitchToURCommentsTab);

            //Double clicking the 7 day close comment will auto send the 7day close comment
            d = $('<label Title="Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"><input type="checkbox" id="UrCommentDBLClk7DCAutoSend" class="URCommentsCheckbox"> Close message - double click link (auto send)</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentDBLClk7DCAutoSend").click(URComments.DBLClk7DCAutoSend);

            //Double clicking comments will auto send comments
            d = $('<label Title="Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"><input type="checkbox" id="UrCommentDBLClkAll" class="URCommentsCheckbox"> All comments  -  double click link (auto send)</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentDBLClkAll").click(URComments.DBLClkAll);

            //go over  BoilerPlateCreatorsArray and generate the select   
            d = '<font style="font-size: 12px;">Comment List <select id="BoilerPlateCreators" style="font-size: 12px; margin-top: 5px;" title"This is shows the selected comment list, there is support for a custom list or If you would like your comment list built into the this script or have suggestions on the Comments team’s list please contact me at rickzabel @waze or @gmail">';
            for (i = 0; i < BoilerPlateCreatorsArray.length; i = i + 1) {
                //console.log("URComments - make div for - " + BoilerPlateCreatorsArray[i]);
                //var d = $('<div><a id="URComments-comment' + i + '" class="URComments" style="float:none;color:#000000" Title="123">' + BoilerPlateCreatorsArray[ i ] + '</a></div>');  
                d = d + '<option style="font-size 12px;" value="' + BoilerPlateCreatorsArray[i] + '">' + BoilerPlateCreatorsArray[i] + '</option>';
                //console.log("URComments - BoilerPlateCreatorsArray " + BoilerPlateCreatorsArray[i]);
            }
            d = d + "</select> </font><br><br>";
            $("#sidepanel-URComments-settings").append(d);
            //create call back for the select
            $("#BoilerPlateCreators").change(URComments.BoilerPlateCreatorsFunction);

			
			//UrCommentDisableURDoneBtn			
			d = $('<label Title="Disable the done button at the bottom of the new UR window"><input type="checkbox" id="UrCommentDisableURDoneBtn" class="URCommentsCheckbox"> Disable done button</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-settings").append(d);
			$("#UrCommentDisableURDoneBtn").click(function () {
				$(localStorage.setItem('UrCommentDisableURDoneBtn', UrCommentDisableURDoneBtn.checked ));
			});
			
			var avdd = localStorage.getItem('UrCommentDisableURDoneBtn');
			if(avdd === null) { avdd = true;}
			$("#UrCommentDisableURDoneBtn").prop('checked', eval(avdd));
			
			
			//URCommentURUnfollow
			d = $('<label Title="Unfollow UR after sending comment"><input type="checkbox" id="URCommentURUnfollow" class="URCommentsCheckbox"> Unfollow UR after send</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-settings").append(d);
			$("#URCommentURUnfollow").click(function () {
				$(localStorage.setItem('URCommentURUnfollow', URCommentURUnfollow.checked ));
				setTimeout(URComments.FilterURs('hideInbetween'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentURUnfollow');
			if(avdd === null) { avdd = false;}
			$("#URCommentURUnfollow").prop('checked', eval(avdd));
			
			//when on screen auto send my own reminders
			d = $('<label Title="Auto send reminders to my UR as they are on screen"><input type="checkbox" id="URCommentsAutoSendMyReminders" class="URCommentsCheckbox"> Auto send reminders</input></label><br>');
            //$("#sidepanel-URComments-list").append(d);
			$("#sidepanel-URComments-settings").append(d);
			$("#URCommentsAutoSendMyReminders").click(function () {
				$(localStorage.setItem('URCommentsAutoSendMyReminders', URCommentsAutoSendMyReminders.checked ));
				setTimeout(URComments.FilterURs('URCommentsAutoSendMyReminders'), 0);
			});
			
			var avdd = localStorage.getItem('URCommentsAutoSendMyReminders');
			if(avdd === null) { avdd = false;}
			$("#URCommentsAutoSendMyReminders").prop('checked', eval(avdd));			
			

            //console.log("URComments - Tab Complete");
			
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////
            ////// Load and set saved options
            //////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //URComments tab is loaded load options to last state
            //here we also check to see if the options have ever been set (new user) if not we enable them all on script load
            //enabling them will trigger a click of the option which will cause the option to be saved

            //OnlyMyUR have the predefined pre-sets only show comments that the current user has commented on
            if (localStorage.getItem('OnlyMyUR') == "yes" || !localStorage.getItem('OnlyMyUR')) {
                //alert("YES");
                $("#URCommentUROOnlyMyUR").trigger('click');
            }

            //auto set new urs comment
            if (localStorage.getItem('AutoSetNewComment') == "yes" || !localStorage.getItem('AutoSetNewComment')) {
                //alert("YES");
                $("#UrCommentAutoSetNewComment").trigger('click');
            }

            //auto set 4day urs comment
            if (localStorage.getItem('UrCommentAutoSet4dayComment') == "yes" || !localStorage.getItem('UrCommentAutoSet4dayComment')) {
                //alert("YES");
                $("#UrCommentAutoSet4dayComment").trigger('click');
            }

            /*
            //auto set 7day urs comment
            if (localStorage.getItem('UrCommentAutoSet7dayComment') == "yes" || !localStorage.getItem('UrCommentAutoSet7dayComment')) {
            //alert("YES");
            $("#UrCommentAutoSet7dayComment").trigger('click');
            }
            */

            //post reply Instructions to comments
            if (localStorage.getItem('AddReplyInstructions') == "yes" || !localStorage.getItem('AddReplyInstructions')) {
                //alert("YES");
                $("#UrCommentAddReplyInstructions").trigger('click');
            }

            //UrCommentAutoCloseComment
            if (localStorage.getItem('UrCommentAutoCloseComment') == "yes" || !localStorage.getItem('UrCommentAutoCloseComment')) {
                //alert("YES");
                $("#UrCommentAutoCloseComment").trigger('click');
            }

            //AutoReloadAfterComment
            if (localStorage.getItem('AutoReloadAfterComment') == "yes" || !localStorage.getItem('AutoReloadAfterComment')) {
                //alert("YES");
                $("#UrCommentAutoReloadAfterComment").trigger('click');
            }

            //NewZoomIn
            if (localStorage.getItem('NewZoomIn') == "yes" || !localStorage.getItem('NewZoomIn')) {
                //alert("YES");
                $("#UrCommentNewZoomIn").trigger('click');
            }

            //auto recenter ur without comments
            if (localStorage.getItem('WithCommentRecenter') == "yes" || !localStorage.getItem('WithCommentRecenter')) {
                //alert("YES");
                $("#UrCommentWithCommentRecenter").trigger('click');
            }

            // URComments load and set settings and check boxes  
            if (localStorage.getItem('AutoClickURStatus') == "yes" || !localStorage.getItem('AutoClickURStatus')) {
                //alert("YES");
                $("#URCommentAutoClickURStatus").trigger('click');
					if(localStorage.getItem('DBLClk7DCAutoSend') == "yes" ||localStorage.getItem('DBLClkAll') == "yes") {
						$('#URCommentAutoClickURStatus').prop('checked', true);
						localStorage.setItem('AutoClickURStatus', 'yes');
					}
            }

            //UrCommentSaveAfterComment
            if (localStorage.getItem('SaveAfterComment') == "yes" || !localStorage.getItem('SaveAfterComment')) {
                //alert("YES");
                $("#UrCommentSaveAfterComment").trigger('click');
            }

            //AutoZoomOutAfterComment
            if (localStorage.getItem('ZoomOutAfterComment') == "yes" || !localStorage.getItem('ZoomOutAfterComment')) {
                //alert("YES");
                $("#UrCommentZoomOutAfterComment").trigger('click');
            }

            //AutoSwitchToURCommentsTab
            if (localStorage.getItem('AutoSwitchToURCommentsTab') == "yes" || !localStorage.getItem('AutoSwitchToURCommentsTab')) {
                //alert("YES");
                $("#UrCommentAutoSwitchToURCommentsTab").trigger('click');
            }

            //UrCommentDBLClk7DCAutoSend
            if (localStorage.getItem('DBLClk7DCAutoSend') == "yes") {
                //alert("YES");
                $("#UrCommentDBLClk7DCAutoSend").prop('checked', true);
				$("#AutoClickURStatus").prop('checked', true);
				localStorage.setItem('AutoClickURStatus', 'yes');
            }

            //UrCommentDBLClkAll
            if (localStorage.getItem('DBLClkAll') == "yes") {
                //alert("YES");
                $("#UrCommentDBLClkAll").prop('checked', true);
				 $("#AutoClickURStatus").prop('checked', true);
				localStorage.setItem('AutoClickURStatus', 'yes');
            }

            //set the users BoilerPlateCreators choice in the select   
            var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');
            $("#BoilerPlateCreators").val(SelectedBoilerPlateCreator);
            //end getting boilerplatecreators

            //check to see if the option to auto switch to the URComments tab is enabled
            if (UrCommentAutoSwitchToURCommentsTab.checked) {
                //make UR Comments tab active
                $('#CommentsTab').trigger('click');
            }

            if (URCommentUpdateMessage === "yes") {
                //alert the user in  URComment version updates
                if (localStorage.getItem('URCommentVersion') === URCommentVersion) {
                    console.log("URComments Version - " + URCommentVersion);
                } else {
                    alert(URCommentVersionUpdateNotes);
                    localStorage.setItem('URCommentVersion', URCommentVersion);
                }
            }

            //set the background of the last used URO preset
            URComments.UROPresetHighlight(localStorage.getItem('UROCurrentPeset'));
			
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////
            ////// Launch background task(s)
            //////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
            //start looking for opened UR's window
            setTimeout(URComments.LookForOpenedUR, 1000);
			
			//reset the hiding of tagged pin
			setTimeout(URComments.HideTagged("startup"), 10000);
			
            //end of URCommentsinit	
			
			    
				setTimeout(URComments.URCLoadUpdateRequestsEvents, 0);


        };
		
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Background task(s)
        //////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

		
        //look for the UR window to be open	
        URComments.LookForOpenedUR = function() {
			
			
			//console.log("urc look for open UR window " + (new Date()).getTime());
		    //check for an open UR and that the UR's text area is shown
            //relaunch checking for open ur - moved this up here so the script would keep trying if i had an error
            setTimeout(URComments.LookForOpenedUR, 500); //line 892
            //console.log("URComments - LookForOpenedUR");
            var urID = 0;

            //12-15-14
            //if (Waze.updateRequestsControl.currentRequest && $(".new-comment-text")[0]) {
            //    urID = Waze.updateRequestsControl.currentRequest.attributes.id;
            urID = $(".update-requests .selected").data("id");

            if (urID > 0 && typeof urID !== 'undefined') {



                //new or same ur (re))open(ed) so now we can do stuff; this prevents this function to continuously applying settings to a ur
                if (UrCommentLasturID != urID && $(".new-comment-text").length !== 0) {
                    //alert(urID);
                    console.log("URComments  - Found open UR - " + urID);
					
                    //grab the current UR ID for next time
                    UrCommentLasturID = urID;

					//url to open a UR
					//https://www.waze.com/editor/?zoom=5&lat=34.024522&lon=-118.297005&mapUpdateRequest=3710607&env=usa
					
					//make the new ur window not dragable
					if ($("#panel-container .ui-draggable").length !== 0) {
					
                        $("#panel-container .panel").removeClass('ui-draggable'); //beta editor auto expand UR Comment box 
						
						$("#panel-container .panel").draggable( { disabled: true } );
						
						$("#panel-container .panel").removeClass('ui-state-disabled'); //beta editor auto expand UR Comment box 
                    }

					
					
					
                    //auto expand ur comments list and text area
                    if ($('#edit-request .comment-view-shown').length === 0) {
                        //alert('trash');
                        //$('#edit-request .toggle-comment-view').delay( 2000 ).trigger('click');

                        setTimeout(function() {
                            $('#edit-request .toggle-comment-view').trigger('click');
                        }, 0);
                    }

                    //replace text in textarea
                    //setTimeout(function () { $(".new-comment-form textarea").attr("placeholder", "Window Resized By URComments"); }, 2000);
                    //$(".new-comment-form textarea").attr("placeholder", "Window Resized By URComments");

                    //beta editor auto expand ur comments list and text area
                    if ($("#panel-container .problem-edit .conversation").length !== 0) {
                        $("#panel-container .problem-edit .conversation").removeClass('collapsed'); //beta editor auto expand UR Comment box 
                    }

                    //beta editor auto expand ur comments more info
                    if ($("#panel-container .problem-edit .more-info").length !== 0) {
                        $("#panel-container .problem-edit .more-info").removeClass('collapsed'); //beta editor auto expand UR Comment box 
                    }

					
					//disble the stupid new done button
					if($("#panel-container .content .done").length > 0 && UrCommentDisableURDoneBtn.checked === true) {
						$("#panel-container .content .done").attr('disabled', true);
						$("#panel-container .content .done").html('(Done) Disabled by URComments');
					}
					
					
					
                    //scroll to bottom of comments on beta
                    //$('.body').scrollTop($('.body')[0].scrollHeight);
					//$('.panel .body').scrollTop($('.panel .body')[0].scrollHeight);
					
					//jump to bottom
					$('.problem-edit .comment-list').scrollTop($('.conversation-view .comment-list')[0].scrollHeight);
					
					//scroll to bottom
					//$('.problem-edit .comment-list').animate({scrollTop: $('.problem-edit .comment-list').prop("scrollHeight")}, 10000);
					
					
                    //auto fill  in comment
                    //check what type of message to insert into the ur
                    reporter_comment = Waze.model.updateRequestSessions.objects[urID].comments;
						//get comment count in one command $(Waze.model.updateRequestSessions.objects[4217801 ].comments).length
                    //Waze.model.updateRequestSessions.objects[3978663]
                    //alert(reporter_comment.length);
                    i = reporter_comment.length;

                    console.log("URComments2 - number of comments: " + i);

                    //if number of comment is zero assume this is a new ur
                    if (i === 0) {
                        //initial, zero comments

                        console.log("URComments2 - no comments");
                        //this if is separate so when we dont have auto inset on new we dont try to get the comment count which would fault out the script
                        if (UrCommentAutoSetNewComment.checked === true) {
                            console.log("URComments2 - no comments2");
                            //this will be on of the types of UR that a user can choose from when submitting a UR 

                            var urType = Waze.model.mapUpdateRequests.objects[urID].attributes.type;

                            //12/15/14
                            //var urType = Waze.updateRequestsControl.currentRequest.attributes.type;

                            console.log("URComments  - Found open UR - " + urID + " " + def_names[urType]);

                            //loop trough the comment array for a comment that matches the request type.
                            for (var ii = 0; ii < URCommentsArray.length; ii = ii + 3) {
                                if (URCommentsArray[ii].toLowerCase() === def_names[urType].toLowerCase()) {
                                    console.log("URComments - Matched Comment: " + def_names[urType]);
                                    setTimeout(URComments.AutoZoomIN(URCommentsArray[ii], URCommentsArray[ii + 1], URCommentsArray[ii + 2], urID), 0);
                                }
                            }


                        }

                    } else {
                        //4DAY OR 7DAY section

                        LastCommentorUserID = reporter_comment[reporter_comment.length - 1].userID;
                        //alert(LastCommentorUserID);
                        console.log("URComments2 - LastCommentorUserID: " + LastCommentorUserID);

                        //uro days old
                        var commentDaysOld = URComments.uroGetCommentAge(W.model.updateRequestSessions.objects[urID].comments[i - 1]);
                        console.log("URComments2 - days old: " + commentDaysOld);

                        //if (i === 1 && commentDaysOld >= 4 && LastCommentorUserID > 1 && UrCommentAutoSet4dayComment.checked === true) {
						var ReminderDays = $('#ReminderDays').val();
						console.log("urc2 ReminderDays: " + ReminderDays);
						
						if (i === 1 && commentDaysOld >= ReminderDays && LastCommentorUserID > 1 && UrCommentAutoSet4dayComment.checked === true) {
							
                            //4day - 1 comment, last comment less than 4 days, last comment is not from reporter
                            console.log("URComments2 - 4day");

                            //4 day ur 1 comment
                            setTimeout(URComments.AutoZoomIN(URCommentsArray[ReminderPosistion], URCommentsArray[ReminderPosistion + 1], URCommentsArray[ReminderPosistion + 2], urID), 0);


                        }
						//dont allow autofilling of the close message because it clicks the not identified option and causes trouble when the ur windows is shut/closed the next save will mark it as ni
						
                        /* else if(i >= 1 && commentDaysOld >= 7 && LastCommentorUserID > 1 && UrCommentAutoSet7dayComment.checked === true)  {
                        //7day - less than one comment, last comment less then 7 days ago, last comment is not from reporter
                        console.log("URComments2 - 7+day");

                        //7 day ur 1 comment
                        setTimeout(URComments.PostURComment(URCommentsArray[CloseNotIdentifiedPosistion], URCommentsArray[CloseNotIdentifiedPosistion + 1], URCommentsArray[CloseNotIdentifiedPosistion + 2], urID), 0);

                        }*/
                    }

                    var WazeCurrentZoom = "";
                    if (i === 0 && UrCommentNewZoomIn.checked === true) {
                        //zoom in new 
                        //predefined zoom threshold for auto zoom
                        var zoom = 4;
                        WazeCurrentZoom = URComments.GetWazeMapZoomLevel();
                        //do not zoom back out if we are already zoomed in and just happen to be re-clicking on a UR.
                        //or we have the map set good for a 4-day reminder

                        if (WazeCurrentZoom < zoom) {
							
                            URComments.gotoURById(urID, 5);
                        }
                    } else if (UrCommentWithCommentRecenter.checked === true) {
                        //or recetner
                        //re-center on urs that are not zoom in
                        WazeCurrentZoom = URComments.GetWazeMapZoomLevel();
                        //alert(WazeCurrentZoom);
                        if (WazeCurrentZoom < 3) {
                            //alert(WazeCurrentZoom);
                            URComments.gotoURById(urID, WazeCurrentZoom);
                        }

                    }

                    //auto switch to ur comments tab
                    if (UrCommentAutoSwitchToURCommentsTab.checked) {
                        //grab the active tab
                        PreviousTab = $("h2 + ul.nav-tabs .active a");
                        //make UR Comments tab active
                        $('#CommentsTab').trigger('click');
                    }
                }


            } else {
                //reset the id if a ur is not open so we can set the tab for the same ur
                UrCommentLasturID = "";
                urID = "";
                //switch tab back
                if (UrCommentAutoSwitchToURCommentsTab.checked) {
                    //verify that we had found a tab
                    if (PreviousTab !== null) {
                        //click back on the previous tab
                        $(PreviousTab).trigger('click');
                        //clear out the previous tab holder
                        PreviousTab = null;
                    }
                }
                //console.log("URComments - Looking for ur...");
            }

        };


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Save Options on click 
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //use uro to only show urs that I have commented on
        URComments.OnlyMyUR = function() {
			
            //try to save the state of the check box
            if (URCommentUROOnlyMyUR.checked) {
                localStorage.setItem('OnlyMyUR', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('OnlyMyUR', 'no');
                //alert("no");
            }

            //only show my ur 'OnlyMyUR' 
            if (URCommentUROOnlyMyUR.checked && !_cbHideAnyComments.checked) {
                $("#_cbHideAnyComments").trigger('click');

            } else if (!URCommentUROOnlyMyUR.checked && _cbHideAnyComments.checked) {
                $("#_cbHideAnyComments").trigger('click');
            }

        };
		
		
		
		//URCommentUROHideTagged
	        //use uro to Hide Tagged pins
        URComments.HideTagged = function(when) {
			return function() {
				console.log("URComments - URCommentUROHideTagged");
				URComments.TaggedPinsAray = [
											"_cbFilterRoadworks",	//
											"_cbFilterConstruction",//
											"_cbFilterClosure",		//
											"_cbFilterEvent",		//
											"_cbFilterNote"		//
											];
				
				//go over the array and clear all of the URO+ check boxes
				for (var URComments_URO_Index = 0; URComments_URO_Index < URComments.TaggedPinsAray.length; URComments_URO_Index = URComments_URO_Index + 1) {
					if(when==="startup") {
						if ($('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
							$('#URCommentUROHideTagged').prop('checked', true);
						}
						
						
					} else {	
						console.log("URComments - URCommentUROHideTagged " + URComments.TaggedPinsAray[URComments_URO_Index]);
						
						if ($('#' + URComments.TaggedPinsAray[URComments_URO_Index]).length <= 0) {
							alert("URComments - there was an error finding URO's hide tagged pins setting please verify these settings are in the correct state");
							return false;
						}

						
						if (URCommentUROHideTagged.checked && !$('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
							$('#' + URComments.TaggedPinsAray[URComments_URO_Index]).trigger('click');
						} else if (!URCommentUROHideTagged.checked && $('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
							$('#' + URComments.TaggedPinsAray[URComments_URO_Index]).trigger('click');
						}              
					}
				}
			};	
        };
			

		
		
		
		

        URComments.AutoClickURStatus = function() {
            //try to save the state of the check box
            if (URCommentAutoClickURStatus.checked) {
                localStorage.setItem('AutoClickURStatus', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('AutoClickURStatus', 'no');
                //alert("no");
                //turn off save after send
                if (!URCommentAutoClickURStatus.checked && UrCommentSaveAfterComment.checked) {
                    $('#UrCommentSaveAfterComment').prop('checked', false);
                    localStorage.setItem('SaveAfterComment', 'no');
                }

				if(UrCommentDBLClk7DCAutoSend.checked == true || UrCommentDBLClkAll.checked == true) {
					$('#URCommentAutoClickURStatus').prop('checked', true);
					alert("URComments to use the double click links you must have the autoset UR status option enabled");
					localStorage.setItem('AutoClickURStatus', 'yes');
				}
			}
        };

        URComments.SaveAfterComment = function() {
            //try to save the state of the check box
            if (UrCommentSaveAfterComment.checked) {
                localStorage.setItem('SaveAfterComment', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('SaveAfterComment', 'no');
                //alert("no");
            }
            //when save if on turn on auto click status
            if (UrCommentSaveAfterComment.checked && !URCommentAutoClickURStatus.checked) {
                $('#URCommentAutoClickURStatus').prop('checked', true);
                localStorage.setItem('AutoClickURStatus', 'yes');
            }
        };

        URComments.AutoCloseComment = function() {
            //try to save the state of the check box
            if (UrCommentAutoCloseComment.checked) {
                localStorage.setItem('UrCommentAutoCloseComment', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('UrCommentAutoCloseComment', 'no');
                //alert("no");
            }
            //alert ( localStorage.getItem('UrCommentAutoCloseComment') ); 
        };

        // UrCommentAutoReloadAfterComment
        URComments.AutoReloadAfterComment = function() {
            // UrCommentAutoReloadAfterComment
            //try to save the state of the check box
            if (UrCommentAutoReloadAfterComment.checked) {
                localStorage.setItem('AutoReloadAfterComment', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('AutoReloadAfterComment', 'no');
                //alert("no");
            }
        };

        URComments.ZoomOutAfterComment = function() {
            // UrCommentAutoReloadAfterComment
            //try to save the state of the check box
            if (UrCommentZoomOutAfterComment.checked) {
                localStorage.setItem('ZoomOutAfterComment', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('ZoomOutAfterComment', 'no');
                //alert("no");
            }
        };

        URComments.AutoSetNewComment = function() {
            //add reply instructions to replies
            //try to save the state of the check box
            if (UrCommentAutoSetNewComment.checked) {
                localStorage.setItem('AutoSetNewComment', 'yes');
                //alert(" AutoSetNewComment yes");
            } else {
                localStorage.setItem('AutoSetNewComment', 'no');
                //alert("AutoSetNewComment no");
            }
        };

        URComments.UrCommentAutoSet4dayComment = function() {
            //add reply instructions to replies
            //try to save the state of the check box
            if (UrCommentAutoSet4dayComment.checked) {
                localStorage.setItem('UrCommentAutoSet4dayComment', 'yes');
                //alert(" UrCommentAutoSet4dayComment yes");
            } else {
                localStorage.setItem('UrCommentAutoSet4dayComment', 'no');
                //alert("UrCommentAutoSet4dayComment no");
            }
        };

        /*
        URComments.UrCommentAutoSet7dayComment = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentAutoSet7dayComment.checked) {
        localStorage.setItem('UrCommentAutoSet7dayComment', 'yes');
        //alert(" UrCommentAutoSet7dayComment yes");
        } else {
        localStorage.setItem('UrCommentAutoSet7dayComment', 'no');
        //alert("UrCommentAutoSet7dayComment no");
        }
        };
        */

        URComments.AddReplyInstructions = function() {
            //add reply instructions to replies
            //try to save the state of the check box
            if (UrCommentAddReplyInstructions.checked) {
                localStorage.setItem('AddReplyInstructions', 'yes');
                //alert(" AddReplyInstructions yes");
            } else {
                localStorage.setItem('AddReplyInstructions', 'no');
                //alert("AddReplyInstructions no");
            }

        };

        URComments.NewZoomIn = function() {
            //add reply instructions to replies
            //try to save the state of the check box
            if (UrCommentNewZoomIn.checked) {
                localStorage.setItem('NewZoomIn', 'yes');
                //alert(" NewZoomIn yes");
            } else {
                localStorage.setItem('NewZoomIn', 'no');
                //alert("NewZoomIn no");
            }

        };

        URComments.WithCommentRecenter = function() {
            //add reply instructions to replies
            //try to save the state of the check box
            if (UrCommentWithCommentRecenter.checked) {
                localStorage.setItem('WithCommentRecenter', 'yes');
                //alert(" WithCommentRecenter yes");
            } else {
                localStorage.setItem('WithCommentRecenter', 'no');
                //alert("WithCommentRecenter no");
            }

        };

        URComments.AutoSwitchToURCommentsTab = function() {
            // AutoSwitchToURCommentsTab
            //try to save the state of the check box
            if (UrCommentAutoSwitchToURCommentsTab.checked) {
                localStorage.setItem('AutoSwitchToURCommentsTab', 'yes');
                //alert("yes");
            } else {
                localStorage.setItem('AutoSwitchToURCommentsTab', 'no');
                //alert("no");
            }
        };

        //UrCommentDBLClk7DCAutoSend
        URComments.DBLClk7DCAutoSend = function() {
			if (UrCommentDBLClk7DCAutoSend.checked) {
                //save the selection
                localStorage.setItem('DBLClk7DCAutoSend', 'yes');
				
				$('#URCommentAutoClickURStatus').prop('checked', true);
				localStorage.setItem('AutoClickURStatus', 'yes');
				
			} else {
				localStorage.setItem('DBLClk7DCAutoSend', 'no');
            }

			//clear the html from the tabs
			$("#sidepanel-Comments").html('');
			//reload the content
			ChangeLanguage = true;
			
			//setTimeout(URComments_bootstrap, 20);
			URComments_bootstrap();
			
	     };


        //UrCommentDBLClkAll
        URComments.DBLClkAll = function() {
			if (UrCommentDBLClkAll.checked) {
                localStorage.setItem('DBLClkAll', 'yes');
				
				$('#URCommentAutoClickURStatus').prop('checked', true);
				localStorage.setItem('AutoClickURStatus', 'yes');
            } else {
	            localStorage.setItem('DBLClkAll', 'no');
            }			
			
			//clear the html from the tabs
			$("#sidepanel-Comments").html('');
			//reload the content
			ChangeLanguage = true;

			//setTimeout(URComments_bootstrap, 20);
			URComments_bootstrap();	
			
			
			
			
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        //////  UR Comment functions
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        URComments.escapeHtml = function(a) {
            a = a.replace(/&/g, "&amp;");
            a = a.replace(/</g, "&lt;");
            a = a.replace(/>/g, "&gt;");
            a = a.replace(/"/g, "&quot;");
            a = a.replace(/'/g, "&#039;");
            return a;
        };
		
		//$( "#update-request-panel .solution p").html()
		URComments.StringSwap = function(a) {
            
			if($( "#update-request-panel .solution p").length > 0 ) {
				a = a.replace( "$URD", $( "#update-request-panel .solution p").html() );
			}
			
			if($( ".description .content").length > 0){
				a = a.replace( "$URD", $( ".description .content").html() );
			//alert($( ".description .content").html());
            }
			return a;
        };
				

        //gets the total number of comments on a ur
        TotalNumberOfComments = function(urID) {
            console.log("URComments - reporterComments");
            return ($(wazeModel.updateRequestSessions.objects[urID].comments).length);
        };

        //sorry URO if i was going to use you to sort Urs i needed to use the same dates you do! Thanks! ;)
        URComments.uroGetCommentAge = function(commentObj) {
            if (commentObj.createdOn === null) return -1;
            return URComments.uroDateToDays(commentObj.createdOn);
        };

        URComments.uroDateToDays = function(dateToConvert) {
            var dateNow = new Date();
            var elapsedSinceEpoch = dateNow.getTime();
            var elapsedSinceEvent = elapsedSinceEpoch - dateToConvert;
            dateNow.setHours(0);
            dateNow.setMinutes(0);
            dateNow.setSeconds(0);
            dateNow.setMilliseconds(0);
            var elapsedSinceMidnight = elapsedSinceEpoch - dateNow.getTime();
            if (elapsedSinceEvent < elapsedSinceMidnight) {
                // event occurred today...
                return 0;
            } else {
                // event occurred at some point prior to midnight this morning, so return a minimum value of 1...
                return 1 + Math.floor((elapsedSinceEvent - elapsedSinceMidnight) / 86400000);
            }
        };

        /*	
        URComments.t1= function(a){

        a="1";
        alert(a);

        };
        URComments.t2= function(a){
        a="2";
        alert(a);
        };
        URComments.t3= function(a){
        a="3";
        alert(a);
        };
        URComments.t4= function(a){
        a="4";
        alert(a);
        };
        */

		
		URComments.onScreen = function(obj) {
			
			//geometry was removed from Waze.model.mapUpdateRequests.objects[id]
			//but can be found in Waze.model.mapUpdateRequests.objects[id].geometry
			
			if (obj.geometry) {
				return (Waze.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
			}
			return false;
		};
		
	
	  
		URComments.URCLoadUpdateRequestsEvents = function(){
			/*
			W.model.mapUpdateRequests.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded);
			W.model.mapUpdateRequests.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded);
			W.model.mapUpdateRequests.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded);

			W.model.updateRequestSessions.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded);
			W.model.updateRequestSessions.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded);
			W.model.updateRequestSessions.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded);	
			
			// filter markers as and when the map is moved
			W.map.events.register("moveend", null, URComments.urcUREvent_onObjectsAdded);
			//W.map.events.register("mousemove", null, URComments.urcUREvent_onObjectsAdded);
			//W.map.events.register("mousemove", null, URComments.urcUREvent_onObjectsAdded);
			//W.map.events.registerPriority("mousedown", null, URComments.urcUREvent_onObjectsAdded);
			W.map.events.register("mouseup", null, URComments.urcUREvent_onObjectsAdded);
			*/
			window.HideUR = "stopped";
			W.model.mapUpdateRequests.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectschanged')); //needed
			//W.model.mapUpdateRequests.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectsadded')); //this one triggers for ever ur added to the db
			//W.model.mapUpdateRequests.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectsremoved'));
			W.model.updateRequestSessions.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectsremoved'));
			
			
			
			
			
			
			//W.model.updateRequestSessions.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectschanged')); // this launches every time a UR is opened
			W.model.updateRequestSessions.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectsadded'));//needed
			
			
			W.map.events.register("moveend", null, URComments.urcUREvent_onObjectsAdded('moveend'));//needed
			W.map.events.register("zoomend", null, URComments.urcUREvent_onObjectsAdded('zoomend'));//needed
			//W.map.events.register("mouseup", null,  URComments.urcUREvent_onObjectsAdded('mouseup'));

			//console.log("urc UR events added");
			
			//setTimeout(URComments.urcUREvent_onObjectsAdded('pageload'), 1000);  
			setTimeout(URComments.urcUREvent_onObjectsAdded('pageload'), 50);
		}; 
		
		
		URComments.urcUREvent_onObjectsAdded = function(a){
			return function() {
				console.log("urc urcUREvent_onObjectsAdded " + a + " " + window.HideUR);
				//window.buffertedtimeout = ""
				
				if (a == "timedout" && window.HideUR == "running"){ //|| a === "list is empty retry"){
						window.HideUR = "stopped";
						a = "retry";
				}
						
				if (window.HideUR === "stopped" && a !== "timedout"){
					clearTimeout(window.buffertedtimeout);
					clearTimeout(window.buffertedtimeout2);
					
					console.log("urc settimeout to filter ur and timeout check " + a + " " + window.HideUR);

					//certain events need to be launched a bit later then others
					if(a == "moveend" || a == "zoomend"){
						window.buffertedtimeout = setTimeout(URComments.FilterURs(a), 2000);	
					} else {
						window.buffertedtimeout = setTimeout(URComments.FilterURs(a), 500);	
					}
	
					window.HideUR = "running";
					window.BufferFillterURCommand = false;
					window.buffertedtimeout2 = setTimeout(URComments.urcUREvent_onObjectsAdded("timedout"), 10000);	
				} else { 					
					console.log("urc aborted: " + a + " " + window.HideUR);
				}
				
			};
		};
		 
		URComments.FilterURs = function(a,b) {
		    return function() {
	
				/*
				Waze.model.updateRequestSessions.objects[4223545].addComment('TEST');
				uroSelectedURID='4223545';
				//$(W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects['4223545']));
				//W.model.updateRequestSessions.get(uroSelectedURID);
				alert($(Waze.model.updateRequestSessions.objects[4223545].comments).length);
				W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects['4223545']);
				W.model.updateRequestSessions.get('4223545');	
				if ($(Waze.model.updateRequestSessions.objects[4223545].comments).length < 3 ) {
				Waze.model.updateRequestSessions.objects[4223545].addComment('TEST');
				W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects[4223545]);
				W.model.updateRequestSessions.get(Waze.model.updateRequestSessions.objects['4223545']);				
				}
				*/
				
				console.log("urc urc Start Filtering URs - " + a);
				for (var i = 0; i < W.map.layers.length; i++) {
				if (W.map.layers[i].uniqueName == 'update_requests') window.uroURLayerIdx = i;
				
				//if(W.map.layers[i].uniqueName == 'problems') uroProblemLayerIdx = i;
				//if(W.map.layers[i].name == 'Spotlight') uroMaskLayer = i;
				//if(W.map.layers[i].uniqueName == 'speed_cameras') uroCamLayer = i;
				//if(W.map.layers[i].name.indexOf('Waze.Control.SelectHighlightFeature') != -1) uroRootContainer = W.map.layers[i].div.id;
				//if(W.map.layers[i].uniqueName == 'area_managers') uroAMLayerIdx = i;
				//if(W.map.layers[i].uniqueName == 'landmarks') uroPlacesRoot = W.map.layers[i].id + '_vroot';
				//if(W.map.layers[i].name == 'Node Connections') uroTurnsLayerIdx = i;

				}
				//var ReminderDays = 2;
				var CloseDays = $('#CloseDays').val();
				//check that all visible urs are loaded
				var idList = [];
				var allID = "";
				var PushNeededCount = 0;
				for (var urID in W.model.mapUpdateRequests.objects) {
					
					if (W.model.updateRequestSessions.objects[urID] == null) {
						idList.push(urID);
						PushNeededCount = PushNeededCount + 1;
						
					}
					
					if (PushNeededCount > 500) {
						//console.log('urc trash ' + allID);
						//console.log('urc trash grabbing updateRequestSessions with IDs ' + idList);
						W.model.updateRequestSessions.get(idList);
						idList = [];
						PushNeededCount = 0;
						console.log('urc over 1k ur');
					}			
				}
				
				if (idList.length > 0) {
					//console.log('urc trash ' + allID);
					//console.log('urc trash grabbing updateRequestSessions with IDs ' + idList);
					W.model.updateRequestSessions.get(idList);
				}
				
				
				//abort filtering URs if the list is empty
				if (Object.keys(W.model.updateRequestSessions.objects).length === 0) {
					window.HideUR = "stopped";
					console.log("urc no Ur in active sessions");
					setTimeout(URComments.urcUREvent_onObjectsAdded("list is empty retry"), 5000);
					return;
				}

				var urdescription = "";
				var EditorID = Waze.model.loginManager.user.id; //editor's id number
				var ReminderReload = false;

				//for (var id1 in W.model.mapUpdateRequests.objects) {
				//console.log("urc get UR info " + id1);
				var TotalVisibleURCount = 0;
				
				var CountOfIdInList = 0;
				for (var id1 in W.model.mapUpdateRequests.objects) {
					TotalVisibleURCount = TotalVisibleURCount + 1;
					if (URComments.onScreen(W.model.mapUpdateRequests.objects[id1])) {
						allID = allID + id1 + ",";
						CountOfIdInList = CountOfIdInList + 1;
					}
		
					if(CountOfIdInList > 300 ) {
						//console.log("urc reached 500 UR requesting list CountOfIdInList: " + TotalVisibleURCount);
						setTimeout(URComments.FilterURs2(a,allID,TotalVisibleURCount), 0);
						CountOfIdInList=0;
						allID = "";
					}

				} 
				
					//console.log("urc left over UR requesting listCountOfIdInList: " + TotalVisibleURCount);
					$("#URCount").html(TotalVisibleURCount);
					setTimeout(URComments.FilterURs2(a,allID,TotalVisibleURCount), 0);

			};
		};




		URComments.FilterURs2 = function(a, allID, TotalVisibleURCount) {
		    return function() {
				
				//check if filtering or the pill count are enabled other wise abort this function
				//URCommentsFilterEnabled URCommentsPillEnabled
				if(URCommentsFilterEnabled.checked === false && URCommentsPillEnabled.checked === false){
					console.log("URC aborting FilterURs2 becasue both filtering and counts are disabled")
					return;
				}
				
		        //console.log("urc Start FilterURs2: " + a);
				var CloseDays = $('#CloseDays').val();
		        var urdescription = "";
				var EditorID = Waze.model.loginManager.user.id; //editor's id number
				var ReminderReload = false;
				var LoggedInEditor = Waze.model.loginManager.user.userName;
				
				if(allID !== ""){
						//this is the link that works but i think it is grabbing a cached version of the page var urSessionURL = 'https://www.waze.com/2tes-live/app/MapProblems/UpdateRequests?ids=' + allID;
						
						
						
						//https://descartes.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=3678676
						//https://editor-beta.waze.com/Descartes-beta/app/
						
						
						if(Waze.Config.api_base === "/Descartes-beta/app") {
							var urSessionURL = 'https://editor-beta.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
						} else if(Waze.Config.api_base === "/Descartes-live/app") {
							var urSessionURL = 'https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
						}
						
						//var urSessionURL = 'https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
						
						//var urSessionURL = 'https://editor-beta.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
						
						
						
						
						console.log("urc urSessionURL: " + a + " " + urSessionURL);
						
						// https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=3678676
						var LastCommentorUserID = "0";
						
						//console.log("urc trash36");						
						$.ajax({
							dataType: "json",
							 //dataType: 'jsonp',
							url: urSessionURL,
						
							success: function(json) {
								try {
	
									for (jsnObj = 0; jsnObj < $(json.updateRequestSessions.objects).length; jsnObj++) {
										//TotalVisibleURCount = TotalVisibleURCount + 1;
										var urDetail = json.updateRequestSessions.objects[jsnObj];
										var id = urDetail.id;
										//console.log("urc json count " + jsnObj + " id " + id );
										var skip = false;
										var urStyle = 'shown';
										var i = 0;
										var Marked = "";
										var UrcURType = "";
										//console.log("urc id " + urDetail.id);
										if (urDetail.comments.length === 0) {
											//console.log('UR Responder: no comments for id ' + id + '. Adding comment.');
											//Waze.model.updateRequestSessions.objects[v.attributes.id].addComment(customURInitialComment);
											//Waze.model.updateRequestSessions.objects[4066755].addComment("This is a test");
											//$(Waze.model.updateRequestSessions.objects[4066755].addComment("This is a test"));
											
											//initial UR no comments
											//if(urDetail.comments.length === 0 && URCommentsHideInital.checked == true && Marked = ""){
											//	UrcURType = "initial";
											//}
										}
										var NumberOfComments = urDetail.comments.length;
										var CountsBGColor = "#FFFF99"; //light yellow
										
										if (NumberOfComments > 0) {
											var reporterResponse = false;
											var lastCommentDateTime = 0;

											for (i = 0; i < urDetail.comments.length; i++) {
												if (urDetail.comments[i].userID == -1) {
													reporterResponse = true;
												}
												lastCommentDateTime = urDetail.comments[i].createdOn;
												LastCommentorUserID = urDetail.comments[i].userID;
												
												if (LastCommentorUserID === EditorID) {
													CountsBGColor = "white";
												}
												
												var Commenttext = urDetail.comments[i].text;
												//console.log("URC " + Commenttext + " " + id);
												if (Commenttext.indexOf("NOTE]") >= 0 || Commenttext.indexOf("ROADWORKS]") >= 0 || Commenttext.indexOf("CONSTRUCTION]") >= 0 || Commenttext.indexOf("CLOSURE]") >= 0 || Commenttext.indexOf("EVENT]") >= 0 || Commenttext.indexOf(LoggedInEditor) >= 0 ){
													//console.log("URC skipped1 URO+ tagged in comments urid: " + id + "with comment text " + Commenttext);
													skip = true;
												}
								//LoggedInEditor				
											
												if(Commenttext.indexOf(LoggedInEditor) >= 0) {
													Marked = LoggedInEditor; 	
												} else if (Commenttext.indexOf("NOTE]") >= 0){
													Marked = "Note";
												} else if(Commenttext.indexOf("ROADWORKS]") >= 0){
													Marked = "Roadworks";
												} else if(Commenttext.indexOf("CONSTRUCTION]") >= 0){
													Marked = "Construction";
												} else if(Commenttext.indexOf("CLOSURE]") >= 0){
													Marked = "Closure";
												} else if(Commenttext.indexOf("EVENT]") >= 0) {
													Marked = "Event";
												}
												//console.log("URC Marked " + Marked);
												
											}
										}
										
										
										

										var lastCommentAge = URComments.uroDateToDays(lastCommentDateTime);
										//console.log('URC Responder: reporter response for ' + id + ' = ' + reporterResponse + ', last comment on ' + lastCommentDateTime + ', comment age in days = ' + lastCommentAge + ' number of comments = ' + i);
										
										urdescription = W.model.mapUpdateRequests.objects[id].attributes.description;
									  
										//console.log("URC - urdescription: " + urdescription + " " + id);
										
										if (urdescription) {
											//console.log("URC - urdescription present: " + urdescription + " " + id);
											//skip tagged URs
											if (urdescription.indexOf("NOTE]") >= 0 || urdescription.indexOf("ROADWORKS]") >= 0 || urdescription.indexOf("CONSTRUCTION]") >= 0 || urdescription.indexOf("CLOSURE]") >= 0 || urdescription.indexOf("EVENT]") >= 0 || urdescription.indexOf(LoggedInEditor) >= 0 ){
													//console.log("URC skipped2 URO+ tagged in description urid: " + id + "with comment text " + urdescription);
													skip = true;
												}
											
											if(urdescription.indexOf(LoggedInEditor) >= 0) {
												Marked = LoggedInEditor; 	
											} else if (urdescription.indexOf("NOTE]") >= 0){
												Marked = "Note";
											} else if(urdescription.indexOf("ROADWORKS]") >= 0){
												Marked = "Roadworks";
											} else if(urdescription.indexOf("CONSTRUCTION]") >= 0){
												Marked = "Construction";
											} else if(urdescription.indexOf("CLOSURE]") >= 0){
												Marked = "Closure";
											} else if(urdescription.indexOf("EVENT]") >= 0) {
												Marked = "Event";
											}
											
											if(URCommentsHideWithDescript.checked == true && NumberOfComments <= 0){
												UrcURType = "WithDescription";
												//console.log("URC UrcURType WithDescription: " + id);
											}
											//console.log("URC skipped2 tagged in description urid: " + id + "with comment text " + Commenttext);
										} else {
											if(URCommentsHideWithoutDescript.checked == true && NumberOfComments <= 0){
												UrcURType = "WithoutDescription";
												//console.log("URC UrcURType WithoutDescription: " + id);
											}
										}

										if (W.model.mapUpdateRequests.objects[id].attributes.open === false) {
											//console.log("URC skipped3 hiding closed UR " + id);
											skip = true;
											//hide closed URs
													if(URCommentsHideClosed.checked == true){
														UrcURType = "IsClosed";
													}
											//check and hide closed Urs
										}
	
										//console.log("urc just before skipping, skip is " + skip + " " + id);			   
										//Waze.model.mapUpdateRequests.objects[id].type == "mapUpdateRequest"
										if (skip === false && W.model.mapUpdateRequests.objects[id].type == "mapUpdateRequest") {
											
										// && URComments.onScreen(Waze.model.mapUpdateRequests.objects[id])	
											
											if (NumberOfComments > 0) {
												
												//4 day UR if there is only one comment, if the comment is less or equal to the editors setting, and if the last comment was not made by the driver
												if (NumberOfComments === 1 && lastCommentAge >= $('#ReminderDays').val() && LastCommentorUserID > 1) {
													//console.log("URComments2 - 4day URID: " + id);
													//direct link to a UR https://www.waze.com/editor/?zoom=5&lat=41.586201000000024&lon=-88.060863&layers=1957&mapUpdateRequest=4048801
													//look up editors user id

												    if(URCommentsHideReminderNeeded.checked == true){
														UrcURType = "NeedsReminder";
													}
													
													
													
													
													//testing and and and or
													if (LastCommentorUserID === EditorID && URCommentsAutoSendMyReminders.checked == true  &&  $('[data-id="' + id + '"]').hasClass('ReminderSent') === false || a == "SendAllReminders") {
														//console.log("URC rem and and and or id " + id);
													}
													

													
													if (LastCommentorUserID === EditorID && URCommentsAutoSendMyReminders.checked == true  &&  $('[data-id="' + id + '"]').hasClass('ReminderSent') === false) {
														
														
														//make UR Link
														var x = Waze.model.mapUpdateRequests.objects[id].attributes.geometry.x;
														//console.log("URC re x " + x);
														
														var y = Waze.model.mapUpdateRequests.objects[id].attributes.geometry.y;
														//console.log("URC re y " + y);
														
														var ConvertedCoords = new OpenLayers.Geometry.Point(x, y).transform(Waze.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
														//console.log("URC re  " + ConvertedCoords);
														
														var MapUrl = "https://www.waze.com/editor/?zoom=5&lat=" + ConvertedCoords.y + "&lon=" + ConvertedCoords.x + "&layers=1925&mapUpdateRequest=" + id;
														console.log("URC re " + MapUrl);
														
														
														console.log("reminder Id: " + MapUrl + " MapUrl: " + MapUrl);
														//URComments.gotoURById(id, 5);
														
														//check if we should include the reminder message and link
														if(UrCommentAddReplyInstructions.checked === true){
															Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1] + "\r\n\r\n" + ReplyInstructions + "\r\n" + MapUrl);
															//ReminderReload = true;
														} else {
															Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1]);
															//ReminderReload = true;
														}		
													
									
														console.log("URC reminder day and the last comment was by me, adding reminder message " + id);
														
														//attempting to stop double reminders from being sent by adding a class that we can check for before sending the reminder
														$('[data-id="' + id + '"]').addClass('ReminderSent');
														
														//set to hide if hide in between states is checked
														if(URCommentsHideInbetween.checked == true){ 
															UrcURType = "InBetweenStates";
														}
														
													}											
													
													if (a === "all" || a === "reminders") {
														//add reminder to the ur in the background
														//Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1] + "\r\n\r\n" + ReplyInstructions + "\r\n" + MapUrl);
													}
													//7 day if the number of comments are greater than or equal to 1, days past are more then 7, the last comment was not from the driver, and number of comments are less than 2
												} else if (NumberOfComments >= 1 && lastCommentAge >= CloseDays && LastCommentorUserID > 1) {
													
													//hide or show UR that need closing
													if(URCommentsHideCloseNeeded.checked == true){
														UrcURType = "NeedsClose";
													}

													//7day - less than one comment, last comment less then 7 days ago, last comment is not from reporter
													//console.log("URComments2 - 7+day URID: " + id);
													//7 day ur 1 comment
													if (a === "all" || a === "close") {
														//setTimeout(URComments.PostURComment(URCommentsArray[CloseNotIdentifiedPosistion], URCommentsArray[CloseNotIdentifiedPosistion + 1], URCommentsArray[CloseNotIdentifiedPosistion + 2], urID), 0);
													}
													//console.log("urc trash56");					
													//UR has comments but was not a 4 day or a 7 day and the driver was not the last to comment
													//"waiting for reply"
												} else if (LastCommentorUserID >0) {
													//in between states waiting for replies or time to elapse
													//console.log("URC hiding ur 2: " + id);
													if(URCommentsHideInbetween.checked == true){ 
														UrcURType = "InBetweenStates";
													}
												}
												//console.log("urc trash57");
												
												if(LastCommentorUserID < 1){
													if (CountsBGColor == "white") {
														CountsBGColor = "#79B5C7"; //light blue
													} else {
														CountsBGColor = "#FFCC99"; //peach
														//CountsBGColor = 6699FF; //darker blue
													}
													
													if(URCommentsHideReplies.checked == true){
														UrcURType = "HasUserReplies";
													}
													
												}else if(lastCommentAge > CloseDays && CountsBGColor != "white"){
													CountsBGColor = "#FF8B8B"; //light red
												}
												
											}
											//zero comments
										}
										//&& NumberOfComments > 0
										//skipped
										//console.log("urc check for urcounts class; comment count " + i );
										//if ($('[data-id="' + id + '"] .URCounts').hasClass('URCounts') === false ) {
											//console.log("urc trash58");
											if (lastCommentAge === undefined) {
												lastCommentAge = "?";
											}
											
											var Message ="";
																						
											if(Marked != ""){	
												Message = Marked + " " + i + "c";
												CountsBGColor = "#CCCCCC"; //light grey
											} else {
												Message = i + "c " + lastCommentAge + "d";
											}
											
											//console.log("urc message " + Message);
											//console.log("urc Marked " + Marked);
									
		
										//if the ur is tagged or has more than 0 comments reorder the ur stacking	
										if (Marked !== "" || i>0){
												
												var MessageOffset = Message.length;
												if (MessageOffset < 10){
													MessageOffset = MessageOffset * 1.4;
												} else {
													MessageOffset = MessageOffset * 2.3;
												}
												MessageOffset = "-" + MessageOffset + "px";
												//console.log("urc message " + Message);
												if(CountsBGColor == "#CCCCCC") { //light grey
													$('[data-id="' + id + '"]').css({'z-index' : '999'}); 
												}else if (CountsBGColor == "white" || CountsBGColor == "#79B5C7"){
													$('[data-id="' + id + '"]').css({'z-index' : '998'}); 
													//).style.visibility
												} else if (CountsBGColor == "#FF8B8B"){ //light red
													$('[data-id="' + id + '"]').css({'z-index' : '997'});
												}
											if(URCommentsPillEnabled.checked === true){
												//add URC bubble	
												if ($('[data-id="' + id + '"] .URCounts').hasClass('URCounts') === false) {
														$('[data-id="' + id + '"]').append($("<div>").css("clear", "both")
														.css("margin-bottom", "10px")

														.append($("<div>").html(Message)
															.css("color", "black")
															.css("background", CountsBGColor)
															.css("position", "absolute")
															.css("top", "30px")
															.css("right", MessageOffset)

															.css("display", "block")
															.css("width", "auto")
															.css("white-space", "nowrap")
															.css("padding-left", "5px")
															.css("padding-right", "5px")

															.css("border", "1px solid")
															.css("border-radius", "25px")

															.addClass('URCounts')
														)
													);
													
												} else {
													$('[data-id="' + id + '"] .URCounts').html(Message);
													$('[data-id="' + id + '"] .URCounts').css("background", CountsBGColor);
												}
										
											//end of URC bubble
											}
										}
									
										//URC UR Filtering
										if(URCommentsFilterEnabled.checked == true){
											//check if we should hide URO stype tagged UR
											if(URCommentsHideNotes.checked == true && Marked != ""){										
												UrcURType = "IsTagged";
											} else if(Marked != "" && UrcURType != "IsClosed"){
												UrcURType ="";
											}
											
											//check if not "my" ur
											//if(URCommentsHideNotMyUR.checked == true && NumberOfComments > 0 && lastCommentAge <= CloseDays ){
											if(URCommentsHideNotMyUR.checked == true && NumberOfComments > 0){
													//light red, peach, light yellow 
													//if(CountsBGColor == "#FF8B8B" || CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99"){
													if(CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99" || CountsBGColor == "#FF8B8B"){
														UrcURType = "NotMyUR";
													}
											}					
											//URCommentsShowPastClose
												//check if not "my" ur
											if(URCommentsShowPastClose.checked == true && NumberOfComments > 0 && lastCommentAge > CloseDays ){
													//light red, peach, light yellow 
													//if(CountsBGColor == "#FF8B8B" || CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99"){
													if(CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99" || CountsBGColor == "#FF8B8B"){
														UrcURType = "";
													}
											}										
				
											//initial UR no comments
											if(urDetail.comments.length === 0 && URCommentsHideInital.checked == true && Marked == ""){
												UrcURType = "initial";
											}
	
											//show or hide URs|| NumberOfComments > 3 || NumberOfComments < 3
											if(UrcURType == "IsTagged" ){
												urStyle = 'hidden';
											} else if(UrcURType == "InBetweenStates" || UrcURType == "NeedsReminder" || UrcURType == "NeedsClose" || UrcURType == "initial" || UrcURType == "HasUserReplies" || UrcURType =="IsClosed" || UrcURType == "NotMyUR" || UrcURType == "WithoutDescription" || UrcURType == "WithDescription"){
												urStyle = 'hidden';
											} else {
												urStyle = 'visible';
											}
											W.map.layers[uroURLayerIdx].markers[id].icon.imageDiv.style.visibility = urStyle;

											//console.log('URC next ur ' + id);
										}
									}
									window.HideUR = "stopped";
									//console.log('URC rem done filtering UR, Total UR: ' + TotalVisibleURCount);
									
									
									
									//reminders were added so we need to re-filter the URs
									/*if(ReminderReload === true) {
										console.log('URC reminders were added re-filter the URs');
										setTimeout(URComments.FilterURs('ReminderReload'), 2000);
									}
									*/
									
								} catch (e) {
									setTimeout(URComments.FilterURs('error retry'), 500);
									console.log('URC Responder: error obtaining UR response = ' + e);
									//window.HideUR = "stopped";
								}
							}
						});
							console.log("urc " + a + " total visible: " + TotalVisibleURCount); // + " allID " + allID);
					//window.HideUR = "stopped";
				

				} else {
					//console.log("urc no UR aborting");
					window.HideUR = "stopped";
				}
				
				
				
		    };
		};





/*
CountsBGColor = "#FFFF99"; //light yellow = UR that are waiting for the last editor but still has time before the Close days setting ex 7 days
CountsBGColor = "#CCCCCC"; //light grey = URO styled notes ex [NOTE]
CountsBGColor = "#FFCC99"; //peach = another editor before the close days has gone by has user reply
CountsBGColor = "#FF8B8B"; //light red = past the close days setting and is now able to be taken over by another editor
CountsBGColor = "white"; = UR that "belong to the editor logged in that need work
CountsBGColor = "#79B5C7"; //light blue = UR that "belong to the editor logged in that have user replies


White = The editor logged in has comments on the UR and the UR needs work
light blue = The editor logged in has comments on the UR and the UR's last comment was a user reply
light red = past the close days setting and is now able to be taken over by another editor

light yellow = UR that are waiting for the another editor to send a reminder or to be closed but still has time before the Close days setting (ex 7 days)
peach = UR that another editor had commented on but the last comment is a user reply

light grey = URO styled notes ex [NOTE]

*/

        //used to track comment clicks and to message users not on the beta tester list
        URComments.CheckBetaTesters = function() {
            if (BetaaTestersCheckCount >= 5) {
                //email list 
                /*
				aeroseek
				Bigbear3764
				Confedyank
				hawkeygoal
				mike0723
				SeekingSerenity
				t0cableguy
				SuperMedic
				orbitc
				davielde
				dolphinwave
				randyboy
				MojaveCactusMonkey
				HavanaDay 
				AlanOfTheBerg
				KB_Steveo
				karlcr9911
				ggrane
				JasonN899
				AlanOfTheBerg
				Confedyank
				dolphinwave
				ggrane
				HavanaDay 
				mike0723
				randyboy
				SeekingSerenity
				t0cableguy
				KuniaKid 
                */

                var BetaTesters = ["rickzabel",
                    "aeroseek",
                    "Bigbear3764",
                    "Confedyank",
                    "hawkeygoal",
                    "mike0723",
                    "SeekingSerenity",
                    "t0cableguy",
                    "SuperMedic",
                    "orbitc",
                    "davielde ",
                    "dolphinwave",
                    "randyboy",
                    "AlanoftheBerg",
                    "driving79",
                    "MojaveCactusMonkey",
                    "HavanaDay",
                    "AlanOfTheBerg",
                    "KB_Steveo",
                    "ggrane",
                    "KuniaKid "
                ];
                //check if the user who is logged in is in the beta tester array
                if ($.inArray($("#user-info strong").html(), BetaTesters) >= 0) {
                    //alert($( "#user-info strong").html() );
                } else {
                    alert($("#user-info strong").html() + " UR Comments is currently in beta testing. When I add or change features I send out email to all users informing them of the changes." + "\n" + "Please pm me at rickzabel and let me know you are using this script and I will gladly add you to the list!");
                }
                BetaaTestersCheckCount = 0;
            }

            BetaaTestersCheckCount = BetaaTestersCheckCount + 1;

        };

        //save what comment list is selected and then reload the page
        URComments.BoilerPlateCreatorsFunction = function() {
			
			//eventually make this replace innerhtml of the comments tab so we dont have to reload the page
            //.innerHTML
			
			/*
			var r = confirm("URComments you have chosen " + BoilerPlateCreators.value + "'s list. The page now must be reloaded to repopulate the UR-Comment tab");
            //this is where we reuse the r var this makes the nested ifs much more simple
            if (r === true) {
                //save the selection
                localStorage.setItem('BoilerPlateCreators', BoilerPlateCreators.value);
                //this will reload the page
                location.reload();
            } else {
			*/
                //$("#BoilerPlateCreators").val(localStorage.getItem('BoilerPlateCreators'));
            //}
			if (BoilerPlateCreators.value !== "---User's Lists---") {
				//save the selection
				localStorage.setItem('BoilerPlateCreators', BoilerPlateCreators.value);

				//clear the html from the tabs
				$("#sidepanel-Comments").html('');
				//reload the content
				ChangeLanguage = true;
				
				//setTimeout(URComments_bootstrap, 20);
				URComments_bootstrap();
			} else {
				$("#BoilerPlateCreators").val(localStorage.getItem('BoilerPlateCreators'));
			}
		};

        URComments.URCommentZoomOutcheck = function(Title, URStatus) {

            return function() {
				console.log("URComments - zoom out URCommentZoomOutcheck");

                //this is the new place for zooming out and will still be happening while the comment is sending
                //zoom out option - if the user option is set to reload map after posting a comment reply
                if (UrCommentZoomOutAfterComment.checked === true) {
                    console.log("URComments - zoom out ZoomOutAfterComment enabled");
                    setTimeout(URComments.SetZoomCloseUR(ReturnToCurrentZoom, "LeaveOpen"), 0);
                } else {
                    //alert("autozoomout not checked");
                }

				
                // $('.new-comment-form .new-comment-text + .btn-default').click(URComments.URCommentSendBtnClicked(Title, URStatus));
                setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
				
				
							

            };
        };

        URComments.URCommentSendBtnClicked = function(Title, URStatus) {


			
            //waze is weird and after clicking send button the close button had to be refound, which takes a few seconds for the new close button to be drawn
            // so we wait 1500 milliseconds before looking for the close button
            //since we are passing vars to the next function we have to pass this to handler function so it doesn't happen on click

            //the above is still true but what i have found is that it sometimes takes a while from clicking send to the comment actually posting. there was time when i closed the comment before it actually posted and it would have to be redone. so added a check and a timeout and recheck if the textarea isn't empty. afterwards we can re-grab and click the close button
			return function() {
				//grab the close button to compare to later
				CloseButtonHolder = $(".problem-panel-navigation button.close-button");
				
				//(URCommentURUnfollow.checked === true && $("#follow-on").is(":checked"))
           
                //check to see if the comments went through before saving or closing the comment 
                if ($(".new-comment-text").val() !== "" && $(".new-comment-text").val() !== undefined) {
					
                    console.log('URComments - the send button was clicked, Waiting for the comment to send. ' + PauseCount);
					 console.log("current comment = " + $(".new-comment-text").val() );
					 console.log("current comment = ");
                    PauseCount++;
                    setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
                } else {
                    console.log('URComments - the comment went through, jumping to CloseDelayHack2');
                    PauseCount = "1";
                    //URComments.CloseDelayHack2(Title, URStatus);
					
					
					//check if we want to unfollow
					if ($("#URCommentURUnfollow").is(":checked") && $("#follow-on").is(":checked")) {
						$('#follow-on').trigger('click');
						 setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
					} else {
						//delay this command for uro not to freakout on refreshing uro bubble ur count
						setTimeout(URComments.CloseDelayHack2(Title, URStatus), 20);
					}
                }
            };
        };

        //this checks to see if the Waze's save button is waiting to be clicked.
        URComments.WazeSaveWaiting = function() {
            if ($(".WazeControlSave").hasClass('ItemInactive')) {
                return true;
            } else {
                return false;
            }
        };

        URComments.CloseDelayHack2 = function(Title, URStatus) {
		 return function() {
            console.log("URComments - CloseDelayhack2 " + Title + " " + URStatus);
			

			

            ////check if we have the old or the new close button 
            //if (CloseButtonHolder == $(".problem-panel-navigation button.close-button")) {
            //    console.log("URComments - old close button searching for new" + PauseCount);
            //    PauseCount++;
            //    //old button jump back into this function 500 ms later
            //    setTimeout(URComments.CloseDelayHack2(Title, URStatus), 20);
            //} else {
            PauseCount = "1";
            console.log("URComments - new close button");
            //wrap the code in the finding of the new close button

            //now that we found the new close button and send was clicked

            //lets check if we should click close or save
            //when clicking save you dint need to click close

            //this checks to see if the Waze's save button is waiting to be clicked.
            //URComments.WazeSaveWaiting()

            if (URStatus.toLowerCase() === "solved" || URStatus.toLowerCase() === "notidentified") {
                console.log("URComments - CloseDelayhack2 Solved or NotIdentified- Clicking Save");
                //this clicks the waze save btn
                if (URCommentAutoClickURStatus.checked === true && UrCommentSaveAfterComment.checked === true) {
                    //click save
                    $('#toolbar #edit-buttons .WazeControlSave').trigger('click');
                } else if (UrCommentAutoCloseComment.checked) {
                    $(".problem-panel-navigation button.close-button").trigger('click');
                }

            } else {
                //when not saving you have to click close.
                console.log("URComments - CloseDelayhack2 since we are not saving click the close button");
                if (UrCommentAutoCloseComment.checked) {
                    console.log("URComments - CloseDelayhack2 auto close option checked");


                    //normal editor
                    if ($(".problem-panel-navigation button.close-button").length !== 0) {
                        console.log("URComments - zoom out CloseDelayHack2 normal editor");
                        $(".problem-panel-navigation button.close-button").trigger('click');
                    }

                    //beta editor
                    if ($(".problem-edit .header .close-panel").length !== 0) {
                        console.log("URComments - zoom out CloseDelayHack2 beta editor");
                        $(".problem-edit .header .close-panel").trigger('click');
                        //setTimeout(function() {
                        //    $('a .close-popover').trigger('click');
                       // }, 2000);
                    }


				

                    //since saving above reloads the map we need this reload only to happen when we dont click save
                    //auto reload map for non save urs
                    if (UrCommentAutoReloadAfterComment.checked) {
                        setTimeout(URComments.AutoReloadMapOnComment, 500);
                    }
                }
            }

            console.log("URComments - end of saving or closing comment");
            //}

            //this is the new place for zooming out and will still be happening while the comment is sending
            //zoom out option - if the user option is set to reload map after posting a comment reply
            if (UrCommentZoomOutAfterComment.checked === true) {
                console.log("URComments - zoom out CloseDelayHack2");
				setTimeout(URComments.SetZoomCloseUR(ReturnToCurrentZoom, "LeaveOpen"), 0);
            } else {
                //alert("autozoomout not checked");
            }
			
			setTimeout(URComments.urcUREvent_onObjectsAdded('URCommentsReload'), 0);
			
		 };
        };

        URComments.SetZoomCloseUR = function(a, b) {
            //this sets the map zoom; 0 is all the way out; 10 is all the way in but next to useless (the map and sat views disappear);
            //the closest zoom that shows the sat and map is zoom 9
            return function() {
                console.log("URComments - Setting map zoom to: " + a + " with flag: " + b);
                //alert(a + " " + b);
                Waze.map.setCenter(Waze.map.getCenter(), a);
                //close ur if zooming out to 
                if (b === "CloseUR") {
                    //alert(b);

                    //normal editor
                    if ($(".problem-panel-navigation button.close-button").length !== 0) {
                        $(".problem-panel-navigation button.close-button").trigger('click');
                    }

                    //beta editor
                    if ($(".problem-edit .header .close-panel").length !== 0) {
                        $(".problem-edit .header .close-panel").trigger('click');
                       // setTimeout(function() {
                        //    $('a .close-popover').trigger('click');
                       // }, 2000);
                    }



                }
            };
        };

        URComments.AutoReloadMapOnComment = function() {
            //waze together with URO is buggy i have to close the comment window before reloading the map or the pin ends up getting stuck on for all URO filters and it takes a page reload to fix it.
            // to get URO to rescan urs that have been commented on you have to reload the map this also causes URO to hide the ones that no longer fit the current URO filters like when using my pre-sets

            //click the reload button for the map
            $(".layer-togglers .reload-button").trigger('click');
        };

        URComments.ConfirmToConsole = function() {
            //over ride the default action of the standard confirm by writing confirm to a new function nconfirm, making a 'fake' confirm and then restoring confirm by copying the nconfirm back over confirm!
            nconfirm = unsafeWindow.confirm;
            unsafeWindow.confirm = function(msg) {
                //if ((I18n.translations[I18n.locale].update_requests.panel.confirm == msg) && (uroGetCBChecked('_cbDisablePendingQuestions') == true)) {
                console.log('URComment confirm redirected to console: ' + msg);
                return true;
            };
        };

        URComments.RestoreConfirmToConfirm = function() {
            //restore the normal action of confirm by writing nconfirm to back over confirm, so the site is able to send user messages outside of my script!
            unsafeWindow.confirm = nconfirm;
        };

        URComments.AutoZoomIN = function(Title, Comment, URStatus, urID, AutoSendComment) {
            return function() {
                console.log("URComments - AutoZoomIN");
				
				
				var URCommentsUnsavedDetected = false;
				
				var URCommentsUnsaveCount = $(".WazeControlSave .counter").html();
				
				//detect unsaved changed if there are and the auto save option is on abort adding comments to the UR
				if (URCommentsUnsaveCount > 0 && $("#UrCommentSaveAfterComment").is(":checked") && URStatus.toLowerCase() !== "open") {
					
					URCommentsUnsavedDetected = true;
					
					alert("UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then reclick the comment you wish to send.");
				}
				//URCommentsUnsavedDetected = true;
				
				
				
				//get urid for manually clicked comments
                if (urID === 0 || urID === "" || urID === undefined) {
                    urID = $(".update-requests .selected").data("id");
                }


                //check to see if the auto zoom in option in enabled if it is start the zooming in process
                console.log("URComments - AutoZoomIN checking if we should zoom in based of if the Title is the same as the reminder title: " + Title + " pointer title: " + URCommentsArray[ReminderPosistion] + " urID: " + urID);
                //having OneOrTheOTher first is a hack to make the logic work
                var OneOrTheOTher = "no";
               /* if (UrCommentAddReplyInstructions.checked === true && Title === URCommentsArray[ReminderPosistion]) {
                    OneOrTheOTher = "yes";
					
                } else */
				if (UrCommentNewZoomIn.checked === true && Title != URCommentsArray[ReminderPosistion] && Title != URCommentsArray[CloseNotIdentifiedPosistion] && AutoSendComment != "AutoSendComment") {
                    OneOrTheOTher = "yes";
	            }

                //alert(OneOrTheOTher);
                if (OneOrTheOTher === "yes" && URCommentsUnsavedDetected === false) {

                    console.log("URComments - AutoZoomIN zooming to location");

                    //predefined zoom threshold for auto zoom
                    var zoom = 4;

                    //do not zoom back out if we are already zoomed in and just happen to be re-clicking on a UR.
                    //or we have the map set good for a 4-day reminder
                    var WazeCurrentZoom = URComments.GetWazeMapZoomLevel();
					
                    if (WazeCurrentZoom < zoom) {
                        URComments.gotoURById(urID, 5);
                    }

                    //setTimeout(URComments.AutoZoomIN2(Title, Comment, URStatus), 2500);
                    setTimeout(URComments.PostURComment(Title, Comment, URStatus, AutoSendComment, urID), 1);

                } else if(URCommentsUnsavedDetected === false) {

                    //auto zoom in is disabled jump to postURComment
                    //alert("else");
                    console.log("URComments - AutoZoomIN disabled to PostURComment id - " + urID);
                    //we have to use set timeout here because we need the  return function() in PostURComment
                    //for when we are zooming in and out for the reminder
                    //since we are not zooming here jump rigth to PostURComment
                    setTimeout(URComments.PostURComment(Title, Comment, URStatus, AutoSendComment, urID), 1);
                }

            };
        };

        URComments.gotoURById = function(urID, zoom) {
            //alert(urID);
            //$('span[id="WME_AutoUR_Count"]').html((WMEAutoUR.Auto.index+1)+"/"+WMEAutoUR.Auto.UR_len);
	
			//save zoom so we can return this the current zoom level
			ReturnToCurrentZoom = URComments.GetWazeMapZoomLevel();

            var x = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.x;
            var y = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.y;

            console.log("URComments - gotoURById: " + "x: " + x + "y: " + y + "zoom: " + zoom);

            Waze.map.setCenter([x, y], zoom);
            return;
        };

        URComments.GetWazeMapZoomLevel = function(Title, Comment, URStatus) {
            zoom = W.map.mapState.mapLocation.zoom;
            console.log("URComments - Current Zoom: " + zoom);
            return zoom;
        };

        URComments.PostURComment = function(Title, Comment, URStatus, AutoSendComment, urID) {
            // the user clicked on a comment link

            return function() {
                //run the beta testers check every comment clicked
                //URComments.CheckBetaTesters();
				//Swap out special text
				Comment = URComments.StringSwap( Comment );
				
                console.log("URComments - attaching to send button " + Title + " - " + Comment + " - " + URStatus);

                //add event listener that runs most of the options
                //URCommentZoomOutcheck
                $('.new-comment-form .new-comment-text + .btn-default').click(URComments.URCommentZoomOutcheck(Title, URStatus));

                //check if the comment text area is present if not alert the user to open a UR
                if ($(".new-comment-text")[0]) {

					console.log("URComments - found comment box");

                    //check to see if we are doing a "4 day Follow-Up" with the map link option turned on if not treat this comment as any other 
                    if (UrCommentAddReplyInstructions.checked === true && Title === URCommentsArray[ReminderPosistion]) {
						console.log("urc is a reminder message urID: :" + urID);
                        //reply instructions + map link
                        var href = $('.WazeControlPermalink .icon-link').attr('href');
						console.log("urc is a reminder message href: :" + href);						 
                        //var lon = getQueryString(href, 'lon');
                        //var lat = getQueryString(href, 'lat');
                        var zoom = parseInt(getQueryString(href, 'zoom'));
						console.log("urc is a reminder message zoom: :" + zoom);	
                        //alert(href);
                        //var layers = "&layers=1797"; //this should have on; sat maps, roads, user requests, edit area, live editors
                        //zoom = zoom > 5 ? 17 : zoom + 12;
                        // https://www.waze.com/livemap?lon=-40.94918&lat=-18.56958&zoom=7

                        //wrap the zoom level in logic to confirm that we are not zoomed way out on accident
                        // set the confirm to false so we can reuse the variable
						/*
						var r = false;
                        //zoom 4 seems like the furthest out we would ever need to send a link to
                        if (zoom > 3) {
                            //zoomed in enough
                            r = true;
                        } else {
							console.log("URComments - post ur else");
                            //zoomed to far out to give the user a useful link
                            //promt the user

                            //this used to promt the user now reminders auto fill //disabled confirm                 r = confirm("UR Comments!\nThe map's zoom level is at " + zoom + " are you sure you want to send the user a link to the map with this zoom level? Remember to center the pin in your map window before clicking 4-day reminder.");

                        }
                        //this is where we reuse the r var this makes the nested ifs much more simple
                        if (r === true) {
							*/
                            //https://www.waze.com/editor/?env=usa&lon=-87.78955&lat=41.93165&layers=1797&zoom=6
                            //https://www.waze.com/editor/?-87.78955&lat=41.93165&layers=1797&zoom=6
                            //var mapsUrl = 'https://www.waze.com/editor/?lon=' + lon + '&lat=' + lat + layers + '&zoom=' + zoom;
                            //console.log('URComments - ReplyInstructions - ' + ReplyInstructions + mapsUrl);
							
							//make Ur Link
							var x = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.x;
							var y = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.y;
							console.log("urc is a reminder message x y:" + x + " " + y);							
							var ConvertedCoords = new OpenLayers.Geometry.Point(x,y).transform(Waze.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
							var MapUrl = "https://www.waze.com/editor/?zoom=5&lat=" + ConvertedCoords.y + "&lon=" + ConvertedCoords.x + "&layers=1925&mapUpdateRequest=" + urID;
							console.log("urc is a reminder message MapUrl" + MapUrl);							
							$(".new-comment-text").val(URCommentsArray[ReminderPosistion + 1] + "\r\n\r\n" + ReplyInstructions + "\r\n" + MapUrl);

                    } else {
                        //comment only, wasnt a "4 day Follow-Up" with map option enabled so just apply the comment 
                        console.log('URComment - comment only ' + Title + ' - ' + Comment);

                        $(".new-comment-text").val(Comment);
                    }

					
					//click the Ur status
                         setTimeout(URComments.CheckIfClickStatus(URStatus, AutoSendComment), 1);
					
/*
                    if (AutoSendComment === "AutoSendComment") {
                        //alert(AutoSendComment);
                        $('.new-comment-form .new-comment-text + .btn-default').trigger('click');
                    }
*/
                } else {
                    //we were unable to find an open UR
                    alert("URComments: Can not find the comment box! In order for this script to work you need to have a user request open");
                }
            };
        };

        //this is part of the script that gets the maps position for the 4 day reminder map link
        getQueryString = function(link, name) {
            var pos = link.indexOf(name + '=') + name.length + 1;
            var len = link.substr(pos).indexOf('&');
            if (-1 == len) len = link.substr(pos).length;
            return link.substr(pos, len);
        };

        URComments.CheckIfClickStatus = function(URStatus, AutoSendComment) {
			return function() {
				console.log("URC checking ur status function: " + URStatus + " " + AutoSendComment);
				
				if (URCommentAutoClickURStatus.checked === true) {
					//bypass the confirm function so other site messages do not come up!
					URComments.ConfirmToConsole();
					//click the ur status options (Not identified solved, open)
/*
					//check for regular editor
					if ($("#state-1").length !== 0) {

						if (URStatus.toLowerCase() == "notidentified") {
							//click Not identified 
							$("#state-1").trigger('click');
						} else if (URStatus.toLowerCase() == "solved") {
							//click solved
							while ($("#state-0").checked == false) {
								$("#state-0").trigger('click');
							}
						} else {
							//click back on open just encase the wrong reply was clicked previously
							while ($("#state--1").checked == false) {
								$("#state--1").trigger('click');
							}
						}
					}
*/
					//check for beta editor
					if ($("#state-open").length !== 0) {
						$(".problem-edit .body").scrollTop($(".problem-edit .body")[0].scrollHeight);
						if (URStatus.toLowerCase() == "notidentified") {
							//click Not identified 
							$("#state-not-identified").trigger('click');
						} else if (URStatus.toLowerCase() == "solved") {
							//click solved
							$("#state-solved").trigger('click');
						} else {
							//click back on open just encase the wrong reply was clicked previously
							$("#state-open").trigger('click');
						}
					}

				
					//restores confirm function so other site messages come up!
					URComments.RestoreConfirmToConfirm();
					//wait for the status to change
				}	
				
				if (AutoSendComment === "AutoSendComment") {	
					setTimeout(URComments.URVerfiyStatusSet(URStatus, AutoSendComment), 1);
				}	
			};
		};
		
		URComments.URVerfiyStatusSet = function(URStatus, AutoSendComment) {
			return function() {
				console.log("URC URVerfiyStatusSet function: " + URStatus + " " + AutoSendComment);
				var URStatusOk = true;
			
				if (URCommentAutoClickURStatus.checked === true) {
					
					if(URStatus.toLowerCase() == "notidentified") {
						//click Not identified 
						if($("#state-not-identified").is(":checked") == false) {
							URStatusOk = false;
						}
					} else if (URStatus.toLowerCase() == "solved") {
						//click solved
						if($("#state-solved").is(":checked") == false) {
							URStatusOk = false;
						}
					} else {
						//click back on open just encase the wrong reply was clicked previously
						if($("#state-open").is(":checked") == false) {
							URStatusOk = false;
						}
					}
					
				}
				
				if(URStatusOk == true){
					
					setTimeout(URComments.AutoClickSend(URStatus,AutoSendComment), 1);
				} else {
					console.log("URC UR Status has yet to change waiting 250ms");
					setTimeout(URComments.URVerfiyStatusSet(URStatus,AutoSendComment), 150);
				}
		
			};
		};
		
		URComments.AutoClickSend = function(URStatus,AutoSendComment) {
			return function() {
				console.log("URC checking if we are auto clicking the send button");
				if (AutoSendComment === "AutoSendComment") {
					//alert(AutoSendComment);
					$('.new-comment-form .new-comment-text + .btn-default').trigger('click');
				}
			};
		};
		
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////
        //// on start-up keep checking the site to see if the me tab is loaded
        ////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////	

        URComments.startcode = function() {
            // Check if WME is loaded, if not, waiting a moment and checks again. if yes init URComments
            try {
                //look for the me tab instead if the buggy chat room!           
                var element = $("#user-details");
                console.log("URComments - Found user-details window");
                if (typeof element !== "undefined" && element.value !== '') {
						//console.log("URC - Test2");
                    URComments.init();
						//console.log("URC - Test3");
                } else {
                    setTimeout(URComments.startcode, 2000);
                }
            } catch (err) {
                console.log("URComments - " + err);
                if (err === "TypeError: element is null" || err === "TypeError: element is null") {
                    setTimeout(URComments.startcode, 2000);
                }
                setTimeout(URComments.startcode, 2000);
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////    URO Preset Filters
        ////   
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //URO+ these are the tags of all of the items URO uses to filter URs
        URComments.UROCheckboxesArray = ["_cbFilterWazeAuto",
            "_cbFilterIncorrectTurn",				//
            "_cbFilterIncorrectAddress",			//
            "_cbFilterIncorrectRoute",				//
            "_cbFilterMissingRoundabout",			//
            "_cbFilterGeneralError", 				//
            "_cbFilterTurnNotAllowed",				//
            "_cbFilterIncorrectJunction",			//
            "_cbFilterMissingBridgeOverpass",		//
            "_cbFilterWrongDrivingDirection",		//
            "_cbFilterMissingExit",					//
            "_cbFilterMissingRoad",					//
            "_cbFilterBlockedRoad",					//
            "_cbFilterMissingLandmark",				//
            "_cbFilterUndefined",					//
            //"_cbFilterCryosphere",				//
            "_cbFilterRoadworks",					//
            "_cbFilterConstruction",				//
            "_cbFilterClosure",						//
            "_cbFilterEvent",						//
            "_cbFilterNote",						//
            "_cbInvertURFilter",					//
            "_cbFilterOpenUR", 						//
            "_cbFilterClosedUR",					//
            "_cbFilterSolved",						//
            "_cbFilterUnidentified",				//
            "_cbEnableMinAgeFilter",				//
            "_cbEnableMaxAgeFilter",				//
            "_cbURDescriptionMustBePresent",		//
            "_cbURDescriptionMustBeAbsent", 		//
            "_cbEnableKeywordMustBePresent", 		//
            "_cbEnableKeywordMustBeAbsent", 		//
            "_cbCaseInsensitive", 					//
            "_cbHideMyComments", 					//
            "_cbHideAnyComments", 					//
            "_cbHideIfLastCommenter", 				//
            "_cbHideIfNotLastCommenter", 			//
            "_cbHideIfReporterLastCommenter",		//
            "_cbHideIfReporterNotLastCommenter",	//
            "_cbEnableMinCommentsFilter", 			//
            "_cbEnableMaxCommentsFilter", 			//
            "_cbHideMyFollowed", 					//
            "_cbHideMyUnfollowed", 					//
            "_cbEnableCommentAgeFilter2", 			//
            "_cbEnableCommentAgeFilter", 			//
            "_cbNoFilterForTaggedURs",				//
			"_cbURUserIDFilter",					//Without comments from user
			"_cbURResolverIDFilter"					//Not resolved by user
        ];

        URComments.UROPresetHighlight = function(a) {
            //alert(a);
            /*
            switch (a) {
            case "UroShowNew":
            $('#URCommentURONEW').css('background-color', '#FFFF66');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
            break;
            case "URO4DayFollowUp":
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '#FFFF66');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');

            break;
            case "URO7Day":
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '#FFFF66');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
            break;
            case "URO8Day":	
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');		
            $('#URCommentURO8Day').css('background-color', '#FFFF66');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
            break;
            case "URO10Day":	
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');		
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '#FFFF66');
            $('#URCommentURO24Hr').css('background-color', '');
            break;	
            case "URO24Hr":	
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');		
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '#FFFF66');
            break;	
            case "UROclearUROFiltrs":
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
            break;
            }
            */

            if (a === "URONewNoDescription") {
                $('#URONewNoDescription').css('background-color', '#FFFF66');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }

            if (a === "UroShowNew") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '#FFFF66');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }
            if (a === "URO4DayFollowUp") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '#FFFF66');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }
            if (a === "URO7Day") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '#FFFF66');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }
            if (a === "URO8Day") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '#FFFF66');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }
            if (a === "URO10Day") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '#FFFF66');
                $('#URCommentURO24Hr').css('background-color', '');
            }
            if (a === "URO24Hr") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '#FFFF66');
            }
            if (a === "UROclearUROFiltrs") {
                $('#URONewNoDescription').css('background-color', '');
                $('#URCommentURONEW').css('background-color', '');
                $('#URCommentURO4DayFollowUp').css('background-color', '');
                $('#URCommentURO7Day').css('background-color', '');
                $('#URCommentURO8Day').css('background-color', '');
                $('#URCommentURO10Day').css('background-color', '');
                $('#URCommentURO24Hr').css('background-color', '');
            }

        };

        URComments.UROClearClicked = function(a) {
            return function() {
				
				//reshow tagged urs on preset change
				if (URCommentUROHideTagged.checked){
					$('#URCommentUROHideTagged').prop('checked', false);
				}
		

                //alert(a);
                URComments.UROPresetHighlight(a);

                //save the current preset so we can reaply the highlighting on startup
                localStorage.setItem('UROCurrentPeset', a);

                if ($("#sidepanel-uroverview").length) {
                    //alert("test");
					console.log("URComments - URO clear");
                    //this is the array used to store the URO id tags

                    //go over the array and clear all of the URO+ check boxes
                    for (var URComments_URO_Index = 0; URComments_URO_Index < URComments.UROCheckboxesArray.length; URComments_URO_Index = URComments_URO_Index + 1) {

                        if ($('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).length <= 0) {
                            alert("URComments - there was an error finding URO's tag " + URComments.UROCheckboxesArray[URComments_URO_Index]);
                            return false;
                        }

                        if ($('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).is(":checked")) {
                            //clicks the checkbox by if the checkbox is checked
                            $('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).trigger('click');
                        } else {
                            //click check box if checkbox in unchecked
                            //$(document.getElementById(URComments.UROCheckboxesArray[ URComments_URO_Index ])).trigger('click');
                        }
                    }

					/*
                    //on clearing uro+ clear the check box for only showing editors urs
                    if (a === "UROclearUROFiltrs" && URCommentUROOnlyMyUR.checked) {
                        $('#URCommentUROOnlyMyUR').trigger('click');
                    }

					*/
					
                    // make it so uro+ doesnt filter tagged urs [NOTE]...
                    $('#_cbNoFilterForTaggedURs').trigger('click');

                    //set the different filters here
                    /*
                    switch (a) {
                    case "UroShowNew":
                    console.log("URComments - URO show new");
                    $('#_cbHideIfReporterNotLastCommenter').trigger('click');
                    break;
                    case "URO4DayFollowUp":
                    console.log("URComments - URO 4 day");
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');
                    $('#_inputFilterMaxComments').val(1);
                    $('#_cbEnableMaxCommentsFilter').trigger('click');
                    $('#_inputFilterCommentDays2').val(4);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                    //if the editors were not on top of 4-day URs some of these would move into 7 day 
                    //$('#_inputFilterCommentDays').val(6);
                    //$('#_cbEnableCommentAgeFilter').trigger('click');

                    break;
                    case "URO7Day":
                    console.log("URComments - URO 7 day");
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');
                    $('#_inputFilterCommentDays2').val(7);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                    break;
                    case "URO8Day":	
                    console.log("URComments - URO 7 day");
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');
                    $('#_inputFilterCommentDays2').val(8);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                    break;
                    case "URO10Day":	
                    console.log("URComments - URO 10 day");
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');
                    $('#_inputFilterCommentDays2').val(10);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                    break;
                    case "URO24Hr":

                    //alanoftheberg 
                    //check "yes" on "If last comment made by UR reporter?"
                    $('#_cbHideIfReporterLastCommenter').trigger('click');

                    //check "Hide URs less than days old" "8" days old
                    $('#_inputFilterMinDays').val(8);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                    //check "With less than" and put in "1" comments
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //check "Last comment more than"  "1" days ago
                    $('#_inputFilterCommentDays').val(1);
                    $('#_cbEnableCommentAgeFilter').trigger('click');
                    break;
                    case "UROclearUROFiltrs":
                    break;
                    }
                    */




                    if (a === "UroShowNew") {
                        console.log("URComments - URO show new");
						
						//If last comment made by UR reporter? chose no
                        $('#_cbHideIfReporterNotLastCommenter').trigger('click');
                    }
                    if (a === "URONewNoDescription") {
						//only show no user description
                        $('#_cbURDescriptionMustBeAbsent').trigger('click');
						
						//hide reporter did not leave the last comment
                        $('#_cbHideIfReporterNotLastCommenter').trigger('click');
						
						//Hide With more than 1 comments
                        $('#_cbEnableMaxCommentsFilter').trigger('click');
                        $('#_inputFilterMaxComments').val(1);
                    }
                    if (a === "URO4DayFollowUp") {
                        console.log("URComments - URO 4 day");
						
						//hide With less than 1 comments
                        $('#_inputFilterMinComments').val(1);
                        $('#_cbEnableMinCommentsFilter').trigger('click');
					
						//Hide With more than 1 comments
                        $('#_inputFilterMaxComments').val(1);
                        $('#_cbEnableMaxCommentsFilter').trigger('click');
						
						//Hide Last comment less than 4 days ago
                        $('#_inputFilterCommentDays2').val(4);
                        $('#_cbEnableCommentAgeFilter2').trigger('click');

                    }
                    if (a === "URO7Day") {
                        console.log("URComments - URO 7 day");
						
						//hide With less than 1 comments
                        $('#_inputFilterMinComments').val(1); //1
                        $('#_cbEnableMinCommentsFilter').trigger('click');
						
						//hide Last comment less than 7 days ago
                        $('#_inputFilterCommentDays2').val(7);//7
                        $('#_cbEnableCommentAgeFilter2').trigger('click');
						
						//hide If last comment made by UR reporter?
                        $('#_cbHideIfReporterLastCommenter').trigger('click');
                    }
                    if (a === "URO8Day") {
                        console.log("URComments - URO 7 day");
						
						//hide With less than 1 comments
                        $('#_inputFilterMinComments').val(1); //1
                        $('#_cbEnableMinCommentsFilter').trigger('click');
						
						//hide Last comment less than 8 days ago
                        $('#_inputFilterCommentDays2').val(8);//8
                        $('#_cbEnableCommentAgeFilter2').trigger('click');
						
						//hide If last comment made by UR reporter?
                        $('#_cbHideIfReporterLastCommenter').trigger('click');
                    }
                    if (a === "URO10Day") {
                        console.log("URComments - URO 10 day");
						
						//hide With less than 1 comments
                        $('#_inputFilterMinComments').val(1); //1
                        $('#_cbEnableMinCommentsFilter').trigger('click');
						
						//hide Last comment less than 8 days ago
                        $('#_inputFilterCommentDays2').val(10);//10
                        $('#_cbEnableCommentAgeFilter2').trigger('click');
						
						//hide If last comment made by UR reporter?
                        $('#_cbHideIfReporterLastCommenter').trigger('click');
                    }
                    if (a === "URO24Hr") {

                        //alanoftheberg 
 
						//check "Hide URs less than days old" "8" days old
                        $('#_inputFilterMinDays').val(8);//8
                        $('#_cbEnableMinAgeFilter').trigger('click');

						
						//check "yes" on "If last comment made by UR reporter?"
                        $('#_cbHideIfReporterLastCommenter').trigger('click');
						
						//check "With less than" and put in "1" comments
                        $('#_inputFilterMinComments').val(1);//1
                        $('#_cbEnableMinCommentsFilter').trigger('click');

						//check "Last comment more than"  "1" days ago
                        $('#_inputFilterCommentDays').val(1);//1
                        $('#_cbEnableCommentAgeFilter').trigger('click');

                    }
                    if (a === "UROclearUROFiltrs") {}

                    //shared URO settings except clear
                    if (a !== "UROclearUROFiltrs") {
                        //$('#_cbFilterClosedUR').trigger('click');
                        //$('#_cbFilterSolved').trigger('click');
                        $('#_cbFilterUnidentified').trigger('click');
                    }

                    if (URCommentUROOnlyMyUR.checked) {
                        $("#_cbHideAnyComments").trigger('click');
                    }

                } else {
                    alert("UR Overview Plus (URO+) needs to be installed to use these URO Presets.");
                }
            };
        };

        //Notes


        //alert(Waze.model.loginManager.user.userName); //editor's user name
        //alert(Waze.model.loginManager.user.id); //editor's id number

        /*
        //$(document).ready(function() {
        $('#WazeMap').mousedown(function(event) {
        switch (event.which) {
        case 1:
        //alert('Left mouse button pressed');
        break;
        case 2:
        //;alert('Middle mouse button pressed');
        break;
        case 3:
        alert('Right mouse button pressed');
        break;
        default:
        break;

        }
        //alert("test");
        });
        //});
        */

        //$('.new-comment-form button[type="submit"]').click(function() { alert('clicked');}) grabs your button and alerts clicked if you want to get out of the DOM traversal

        //this is how you set the select in a drop down after it is filled
        // $("#BoilerPlateCreators").val("vectorspace");

        //jquery checkbox
        //$('.myCheckbox').prop('checked', true);
        //$('.myCheckbox').prop('checked', false);

        /*
        //change the tag data of an element by class
        var x = document.getElementsByClassName("slider");
        //alert( x.length );
        //go trough all of the eletemnts that match the requested class
        for(var i = 0, j=x.length; i<j; i++){

        var btnHtml = (0 + " - " + x[i].innerHTML);
        alert (btnHtml);

        //this if doent matach the slider type but i am leaving it for future documentation
        if(btnHtml.indexOf("<span>Close</span>") > -1) {

        //change the tag data of an element by class
        //x[i].style.top = "125px";

        }
        }
        */


        URComments.startcode();
    }
    //URComments_bootstrap();
setTimeout(URComments_bootstrap, 3000);