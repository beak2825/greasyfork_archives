// ==UserScript==
// @name        Warfacts Starlog Real dates
// @namespace   https://github.com/guardian21
// @description Changes time and date for war-facts.com starlog to real. For the new game interface.
// @include     *.war-facts.com/starlog.php*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9102/Warfacts%20Starlog%20Real%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/9102/Warfacts%20Starlog%20Real%20dates.meta.js
// ==/UserScript==




/* Configuration Settings */



/* Script */


//Set Time zone Difference
var currentdate = new Date(); 
var timeZoneDiff = currentdate.getTimezoneOffset() / 60;	// Difference between user time and UTC time in hours
	timeZoneDiff = -timeZoneDiff;	// I want to know user compared to utc, not utc compared to user
	timeZoneDiff += 5;	//Difference between UTC and EST (server is in EST)






//Each starlog entry is a div, grab them all
var divs = document.getElementById("midcolumn").getElementsByTagName("div")[0].getElementsByTagName("div");
var i;
var current_div;
var realTimeEST;
var timetext;
var timeDateSpan;
var temp;




//For each starlog entry
 for (i = 3; i < divs.length; i+=3) {	//i=3 because first are headers 




    current_div = divs[i].children[0];


    temp = current_div.getElementsByTagName("span");
    timeDateSpan = temp[0];



    realTimeEST = timeDateSpan.title;




    //Process real time. Add the timezone diffrence, change Date if needed
    var thehours = parseInt(realTimeEST.substr(0,2));
    var dateString =  realTimeEST.substr(9,2);  
    thedate  = parseInt(dateString);
    thehours += timeZoneDiff;

    if (thehours >= 24) {
    	thehours -= 24;
    	thedate ++ ;
    	//Normally I would also need to check if month changes etc, but will not bother as it doesn't causes problem

    	dateString = thedate.toString();
    	if (thedate < 10) {
    		dateString = "0" + dateString;
     	}

    }

    var hoursString = thehours.toString();
    if (thehours < 10) {
    	hoursString = "0" + hoursString;
    }

//    var myTimeDate = hoursString + realTimeEST.substring(2,9) + dateString + realTimeEST.substring(11,19);    //hour - date format
    var myTimeDate = dateString + realTimeEST.substring(11,19) + "  " + hoursString + realTimeEST.substring(2,8);

 

    var myp = document.createElement("p");
    myp.style.color="yellow";
    myp.innerHTML = myTimeDate;

 
    current_div.appendChild(myp);
	
}
