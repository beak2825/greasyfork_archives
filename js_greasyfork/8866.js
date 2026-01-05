// ==UserScript==
// @name         OkC Hidden Quickmatch Info
// @namespace    http://thlayli.detrave.net
// @version      1.4
// @description  Show hidden info on Quickmatch page and autoskip matches
// @author       Nathan Blume
// @match        http://www.okcupid.com/quickmatch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8866/OkC%20Hidden%20Quickmatch%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/8866/OkC%20Hidden%20Quickmatch%20Info.meta.js
// ==/UserScript==

// show friends (indicates how similar your answers are)
var showFriends = true;

// show nonsensical attractiveness number
var showAttractiveness = false;

// automatically skip certain profiles - set to "true" to use autoSkip options below
var autoSkipEnabled = true;

// auto skip settings
var autoSkipMatch = 50; // skip if less than this match percentage
var autoSkipEnemy = 50; // skip if more than this enemy percentage

// autoSkipCases skips profiles based on [orientation-gender-status] (see info below)
var autoSkipCases = [];

// autoSkip instructions: Enter sets of three numbers inside the brackets.
// Numbers should be separated by hyphens and surrounded by quotes.
// Multiple sets can be entered separated by commas.
//
// Number key:
//  orientation:  0 = ignore, 1 = straight, 2 = gay, 3 = bi
//  gender: 0 = ignore, 1 = male, 2 = female
//  status: 0 = ignore, 1 = single, 2 = seeing-someone, 3 = married, 4 = available, 5 = open-relationship, 8 = mostly-nonmonogamous
//
// e.g. ["1-3-0"] skips bi males
// e.g. ["1-2-0","1-2-3"] skips gay males and married straight females

var secret_orientation;
var secret_gender;
var secret_status;
var skipChecked;

function updateMoreInfo(){

    if(!$("enemy")){
        $("match").firstElementChild.innerHTML += '&nbsp;<span style="color: #949aa6; display: inline;" id="enemy"></span>';
    }

    if(!$("more_info")){
        $("left").innerHTML =  "<div id=\"more_info\"></div>" + $("left").innerHTML;
    }

    switch(Quickmatch.stack[0].orientation) {
        case 1:
            secret_orientation = "Straight";
            break;
        case 2:
            secret_orientation = "Gay";
            break;
        case 3:
            secret_orientation = "Bisexual";
            break;
        default:
            secret_orientation = Quickmatch.stack[0].orientation;
    }

    switch(Quickmatch.stack[0].tracking_gender) {
        case 1:
            secret_gender = "Male";
            break;
        case 2:
            secret_gender = "Female";
            break;
        default:
            secret_gender = Quickmatch.stack[0].tracking_gender;
    }

    switch(Quickmatch.stack[0].status) {
        case 1:
            secret_status = "Single";
            break;
        case 2:
            secret_status = "Seeing Someone";
            break;
        case 3:
            secret_status = "Married";
            break;
        case 4:
            secret_status = "Available";
            break;
        case 5:
            secret_status = "Open Relationship";
            break;
        case 8:
            secret_status = "Mostly Nonmonogamous";
            break;
        default:
            secret_status = Quickmatch.stack[0].status;
    }

    $("enemy").innerHTML =  '| <strong class="percent">' + Quickmatch.stack[0].epercentage + '</strong>% Enemy';

    $("more_info").innerHTML = "<h2>More Info</h2>" +
        "Screen Name: <a href=\"http://www.okcupid.com/profile/" + Quickmatch.stack[0].sn + "?cf=quickmatch\">" + Quickmatch.stack[0].sn +
        "</a><br />Gender: " + secret_gender +
        "<br />Orientation: " + secret_orientation +
        "<br />Status: " + secret_status;
        
    
    if(Quickmatch.stack[0].attractiveness && showAttractiveness === true)
        $("more_info").innerHTML += "<br />Attractiveness: " + Quickmatch.stack[0].attractiveness;
    
    if(Quickmatch.stack[0].fpercentage && showFriends === true)
        $("more_info").innerHTML += "<br />Friends: " + Quickmatch.stack[0].fpercentage + "%";

    $("more_info").innerHTML += "<br /><br />";
}

function autoSkip(){
    if(autoSkipEnabled == true){
        if(skipChecked != Quickmatch.stack[0].sn){
            skipChecked = Quickmatch.stack[0].sn;
            if(Quickmatch.stack[0].epercentage > autoSkipEnemy){
                console.debug('skipped ' + Quickmatch.stack[0].sn + ' because of enemy % - ' + Quickmatch.stack[0].epercentage + ' > ' + autoSkipEnemy);
                document.getElementById("quickmatch-dislike").click();
                return true;
            }
            if(Quickmatch.stack[0].percentage < autoSkipMatch){
                console.debug('skipped ' + Quickmatch.stack[0].sn + ' because of match % - ' + Quickmatch.stack[0].percentage + ' < ' + autoSkipMatch);
                document.getElementById("quickmatch-dislike").click();
                return true;
            }
            if(autoSkipCases.length > 0){
                for(i=0;i<autoSkipCases.length;i++){

                    skipCase = autoSkipCases[i].split("-");

                    orientationSkip = skipCase[0];
                    genderSkip = skipCase[1];
                    statusSkip = skipCase[2];

                    orientationSkipMatch = false;
                    genderSkipMatch = false;
                    statusSkipMatch = false;

                    if(orientationSkip == 0 || Quickmatch.stack[0].orientation == orientationSkip)
                        orientationSkipMatch = true;

                    if(genderSkip == 0 || Quickmatch.stack[0].tracking_gender == genderSkip)
                        genderSkipMatch = true;

                    if(statusSkip == 0 || Quickmatch.stack[0].status == statusSkip)
                        statusSkipMatch = true;

                    if(orientationSkipMatch == true && genderSkipMatch == true && statusSkipMatch == true){
                        console.debug('skipped ' + Quickmatch.stack[0].sn + ' because of rule match - ' + autoSkipCases[i]);
                        document.getElementById("quickmatch-dislike").click();
                        return true;
                    }
                }
            }
        }
    }
}

var startTracing = function (onnew) {
    window.ajaxRequestComplete = 'no';//Make as a global javascript variable
    window.ajaxRequestStarted = 'no';

    XMLHttpRequest.prototype.uniqueID = function() {
        if (!this.uniqueIDMemo) {
            this.uniqueIDMemo = Math.floor(Math.random() * 1000);
        }
        return this.uniqueIDMemo;
    };

    XMLHttpRequest.prototype.oldOpen = XMLHttpRequest.prototype.open;

    var newOpen = function(method, url, async, user, password) {

        ajaxRequestStarted = 'open';
        /*alert(ajaxRequestStarted);*/
        this.oldOpen(method, url, async, user, password);
    };

    XMLHttpRequest.prototype.open = newOpen;

    XMLHttpRequest.prototype.oldSend = XMLHttpRequest.prototype.send;

    var newSend = function(a) {
        var xhr = this;

        var onload = function() {
            ajaxRequestComplete = 'loaded';
            //print info to page
            updateMoreInfo();
            autoSkip();
        };

        var onerror = function( ) {
            ajaxRequestComplete = 'Err';
            /*alert(ajaxRequestComplete);*/
        };

        xhr.addEventListener("load", onload, false);
        xhr.addEventListener("error", onerror, false);

        xhr.oldSend(a);
    };

    XMLHttpRequest.prototype.send = newSend;
};
startTracing();
updateMoreInfo();
autoSkip();