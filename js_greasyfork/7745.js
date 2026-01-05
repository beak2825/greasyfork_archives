// ==UserScript==
// @name        GameFaqs Private Board Userlist Viewer
// @namespace   https://greasyfork.org/en/scripts/7745-gamefaqs-private-board-userlist-viewer/code
// @description ud4's board script
// @include     http://www.gamefaqs.com/boards/848-hardcore/?admin=1
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7745/GameFaqs%20Private%20Board%20Userlist%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/7745/GameFaqs%20Private%20Board%20Userlist%20Viewer.meta.js
// ==/UserScript==
var daysFromLastVisit = 7; // Change this and only this to modify the cutoff date.
var cutoffDate = new Date(); // Gets current date
var AmericanDateFormat=true; //Set to true for American Date Format (Month/Day/Year), false for (Day/Month/Year)
cutoffDate.setHours(0,0,0,0); // setting the current date to a plain date, without the hour and such. This could cause problems otherwise.
cutoffDate.setDate(cutoffDate.getDate() - daysFromLastVisit); // Specs say this should work everywhere. In doubt, use Chrome or Firefox.

var usernamesArray = document.getElementsByClassName('nobold'); // This will probably break with any site updates.

// Output strings
var hasVisited = '';
var hasntVisited = '';

if (usernamesArray.length == 0){
	console.log("NO USERS DETECTED, THE SITE HAD A LAYOUT UPDATE"); // Adding a warning, just in case
}else{
	for(var i=0; i < usernamesArray.length; i++){
		var username = usernamesArray[i].innerHTML; // Grabs username
		var AMURICAdateText = usernamesArray[i].parentNode.parentNode.lastChild.innerHTML.trim(); // Does some DOM magic to get the date. This will probably break when the site updates.
		var hasVisitedRecently = false; // This is set to true only if the user has visited, after all that code.


		if(AMURICAdateText != ''){ // If the user has visited the board at least once. I don't feel particularly confident when checking against an empty string, this is very prone to breaking but it works for the current version of the admin page.
			// Start code to fix the date to a standard format because AMURICA
			var splitDate = AMURICAdateText.split('/'); // splits '11/18/14' into ['11', '18', '14']
			if(AmericanDateFormat){
			var outputDate = splitDate[0]+'/'+splitDate[1]+'/20'+splitDate[2]; // Switches month and day around. Will break when 2100 comes.
			}else{
				var outputDate = splitDate[1]+'/'+splitDate[0]+'/20'+splitDate[2]; // Switches month and day around. Will break when 2100 comes.
			}
			// End AMURICA code

			// This has to be done manually as I don't trust at all that different browsers will parse a non ISO date correctly.
			var lastVisitDateObject = new Date();
			lastVisitDateObject.setHours(0,0,0,0); // Plain date, no hours.
			lastVisitDateObject.setFullYear('20'+splitDate[2]);
			lastVisitDateObject.setMonth(splitDate[0] - 1); // WHY THE **** MONTH IS 0-11 WHEN DAY IS 1-31
			lastVisitDateObject.setDate(splitDate[1]);

			if(lastVisitDateObject.toString() == 'NaN'){ // Just doing some housekeeping, this should never happen but if GF screws up you'll be warned
				var lastVisitDate = "ERROR";
			}else{
				if(cutoffDate <= lastVisitDateObject){
					hasVisitedRecently = true; // Whew. Done.
				};	
			};
		}else{
			var outputDate = "Hasn't visited the board";
		};
		
		if(hasVisitedRecently){
			hasVisited += (username + ' @ ' + outputDate + "\n");
		}else{
			hasntVisited += (username + ' @ ' + outputDate + "\n");
		};
	};

	// The following generates a textarea and fills it with the output.
	var textareaVisited = document.createElement('textarea');
	textareaVisited.style.width = '49%';
	textareaVisited.style.height = '300px';
	textareaVisited.innerHTML = "Users who visited in the last "+daysFromLastVisit+" days:\n" + hasVisited;
	var textareaNotVisited = document.createElement('textarea');
	textareaNotVisited.style.width = '49%';
	textareaNotVisited.style.height = '300px';
	textareaNotVisited.innerHTML = "Users who did NOT visit in the last "+daysFromLastVisit+" days:\n" + hasntVisited;
	// The following adds it to the page.
	var userTable = document.getElementsByClassName('board')[0];
	var parentDiv = userTable.parentNode;
	parentDiv.insertBefore(textareaVisited, userTable);
	parentDiv.insertBefore(textareaNotVisited, userTable);
};