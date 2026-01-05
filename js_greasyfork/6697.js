// ==UserScript==
// @name       Auto-Fill Voting Page
// @version    a1.05
// @description  Automatically types your account name and clicks on the vote button.
// @match      http://hotmople.com/ms/?base=main&page=vote
// @match      http://hotmople.com/vote/jag/vote.php
// @match      http://hotmople.com/vote/top200/vote.php
// @match      http://hotmople.com/vote/ups/vote.php
// @match      http://hotmople.com/vote/topg/vote.php
// @match      http://hotmople.com/vote/gtop100/vote.php
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @copyright  tps242 (IGN : Yume)
// @namespace https://greasyfork.org/users/7211
// @downloadURL https://update.greasyfork.org/scripts/6697/Auto-Fill%20Voting%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/6697/Auto-Fill%20Voting%20Page.meta.js
// ==/UserScript==

// calculates a new time whenever the first website voted is launched, we assume the user has voted when this page is launched //
if(location.pathname == "/vote/gtop100/vote.php") {
var newTime = new Date;
localStorage["newTime"] = newTime;
}

// calculates the current time and difference in time in minutes from when the first voting website was launched //
var curTime = new Date;
diffTime = ((curTime.getTime() - Date.parse(localStorage["newTime"])) / 60000);

// auto-closes sites that were already deemed to be voted //
if(document.getElementsByTagName('body')[0].innerHTML.indexOf("You have voted") != -1) {
    window.close()
}

// prompts the user for an account name, and puts it into the local Storage on the web browser, which can be cleared at any time, this only occurs if the user has never putted an account name before //
if ((localStorage["HotName"] === "null" || localStorage["HotName"] == "" || isNaN(localStorage["HotName"])) && location.pathname !== "/vote/jag/vote.php" && location.pathname !== "/vote/top200/vote.php" && location.pathname !== "/vote/ups/vote.php" && location.pathname !== "/vote/topg/vote.php" && location.pathname !== "/vote/gtop100/vote.php") {
    r_vote = prompt("Enter your account name that you wish to automatically vote with on this page.", localStorage["HotName"]);
    localStorage["HotName"] = r_vote;
    if (r_vote !== null && localStorage.getItem("HotName") === undefined) {
        localStorage["HotName"] = r_vote;
    }
};


// populates all fields with the account name //
$('.form-control').val(localStorage["HotName"]);

// the first website requires a difference of 12 hours since last launch to be launched again //
if (diffTime > 721) { setTimeout(function(){ $("#content form:nth-child(2) button:submit").click(); }, 2000) };
if (isNaN(parseInt(diffTime)) === true && r_vote !== "") {setTimeout(function(){ $("#content form:nth-child(2) button:submit").click(); }, 2000)};

// subsequent voting sites are clicked with a 1 second delay //
if (r_vote !== "") {setTimeout(function(){ $("#content form:nth-child(3) button:submit").click(); }, 4000) };
if (r_vote !== "") {setTimeout(function(){ $("#content form:nth-child(4) button:submit").click(); }, 5000) };
if (r_vote !== "") {setTimeout(function(){ $("#content form:nth-child(5) button:submit").click(); }, 6000) };
if (r_vote !== "") {setTimeout(function(){ $("#content form:nth-child(6) button:submit").click(); }, 7000) };
setTimeout(function(){ localStorage["HotName"] = r_vote; }, 8000);

// reload the page to launch to the voting sites every 6 hours if necessary //
if (location.pathname == "/ms/?base=main&page=vote") {
setTimeout(function(){
   window.location.reload(1);
    }, 21600000) }; 

// store the rounded calculated difference in time for reference //
if (isNaN(newTime) === false) {
localStorage["diffTime"] = Math.round(diffTime);
}
