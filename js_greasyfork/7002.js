// ==UserScript==
// @name        JR mturk timer warning
// @version     0.7.10
// @namespace   https://greasyfork.org/users/6406
// @description Script will warn you at specific times left for your hit. The times can be set in the options menu.
// @author      John Ramirez (JohnnyRS)
// @include     http*://*.mturk.com/mturk/continue*
// @include     http*://*.mturk.com/mturk/accept*
// @include     http*://*.mturk.com/mturk/preview*
// @include     http*://*.mturk.com/mturk/myhits*
// @include     http*://*.mturk.com/mturk/submit*
// @include		http*://worker.mturk.com/projects/*
// @exclude     *mturk.com/*HITMONITOR*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/7002/JR%20mturk%20timer%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/7002/JR%20mturk%20timer%20warning.meta.js
// ==/UserScript==

// Warns you with a voice, alarm or colors on the amount of time left for the current hit. You can set your own options
// in the menu at top. There is a male and female voice for the warning. You can turn off the warnings and color.
// the options are saved so you don't have to set it again. You can stop it saving options for the current hit if
// you just want changes for the hit you are on.

var gSeconds = 0, gElapsedSeconds = 0, gWorking = false, gDoNotSpeak = false, gVolume = 1, intervalVar=null, gNewSite=false, gSpeech=new SpeechSynthesisUtterance();
var gOptionsDefault = {"status":["On",0],"voice":["female",0],"alarm":["Off",0],"color":["On",0],"firstSpeak":["On",0]};
var gOptionTimesDefault = {"60":["Off",0],"30":["On",0],"20":["Off",0],"10":["Off",0],"5":["On",0],"1":["On",0],"30s":["On",0],"every1":["off",0],
						"every5":["off",0],"every10":["off",0]};
var gWarningTimes = {"60":false,"30":false,"20":false,"10":false,"5":false,"1":false,"30s":false,"every1":false,"every5":false,
						"every10":false};
var gHtmlColors = ["FF0000","FF3322","FF6633","FFAA39","FFCCCC","FFEFEC","FFEFCC","EEEFCC","CCCCBB","CCCCBF","CCCCCC","CCCCDD","CCCCDF","CCCCEE","CCCCEF","CCDDFF","DDDDFF","EEEEFF","EEEEF9","EEEEF6","FFFFF2","FFFFF5","FFFFF8","FFFFFF"];

var f60MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%201%20hour%20left%20-%20Laura.mp3");
var m60MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%201%20hour%20left%20-%20Paul.mp3");
var a60MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%2060%20minutes%20left.mp3");
var f30MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2030%20minutes%20left%20-%20laura.mp3");
var m30MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2030%20minutes%20left%20-%20Paul.mp3");
var a30MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%2030%20minutes%20left.mp3");
var f20MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2020%20minutes%20left%20-%20laura.mp3");
var m20MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2020%20minutes%20left%20-%20Paul.mp3");
var a20MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%2020%20minutes%20left.mp3");
var f10MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2010%20minutes%20left%20-%20Laura.mp3");
var m10MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2010%20minutes%20left%20-%20Paul.mp3");
var a10MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%2010%20minutes%20left.mp3");
var f5MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%205%20minutes%20left%20-%20Laura.mp3");
var m5MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%205%20minutes%20left%20-%20Paul.mp3");
var a5MinutesLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%205%20minutes%20left.mp3");
var f1MinuteLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%201%20minute%20left%20-%20Laura.mp3");
var m1MinuteLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%201%20minute%20left%20-%20Paul.mp3");
var a1MinuteLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%201%20minute%20left.mp3");
var f30SecondsLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2030%20seconds%20left%20-%20Laura.mp3");
var m30SecondsLeft = new Audio("http://www.allbyjohn.com/sounds/You%20have%20less%20than%2030%20seconds%20left%20-%20Paul.mp3");
var a30SecondsLeft = new Audio("http://www.allbyjohn.com/sounds/Alarm%2030%20seconds%20left.mp3");
var fTesting = new Audio("http://www.allbyjohn.com/sounds/This%20is%20just%20a%20test%20of%20this%20warning%20system%20-%20Laura.mp3");
var mTesting = new Audio("http://www.allbyjohn.com/sounds/This%20is%20just%20a%20test%20of%20this%20warning%20system%20-%20Paul.mp3");
var g60MinutesLeft = null, g30MinutesLeft = null, g20MinutesLeft = null, g10MinutesLeft = null, g5MinutesLeft = null, g1MinutesLeft = null,
    g30SecondsLeft = null, gTesting = null, gOptions = null, gOptionTimes = null, gVoices = null;

function defaultFillIn(data,defaultData) { 
	if (!data) return null; var returnData = data;
	for (var key in defaultData) { if (!(key in returnData)) returnData[key] = defaultData[key]; }
	return returnData;
}
function loadSettings() {
    var loadedOptions = JSON.parse(GM_getValue("JR_WN_options",JSON.stringify(gOptionsDefault)));
    var loadedOptionTimes = JSON.parse(GM_getValue("JR_WN_optionTimes",JSON.stringify(gOptionTimesDefault)));
	gOptions = defaultFillIn(loadedOptions,gOptionsDefault);
	gOptionTimes = defaultFillIn(loadedOptionTimes,gOptionTimesDefault);
}
function saveSettings() {
    GM_setValue("JR_WN_options",JSON.stringify(gOptions));
    GM_setValue("JR_WN_optionTimes",JSON.stringify(gOptionTimes));
}
function speakThisNow(thisText,gender) {
    if('speechSynthesis' in window){
		var thisVoice = (gender) ? ((gender.toLowerCase()=="male") ? gVoices[0] : gVoices[1]) : gVoices[0];
        gSpeech.lang = 'en-US';
        gSpeech.volume = gVolume;
		gSpeech.voice = thisVoice;
		gSpeech.text = thisText;
        window.speechSynthesis.speak(gSpeech);
    }
}
function convertTimeToSeconds(hours,minutes,seconds,days,weeks) {
	var totalSeconds = seconds + ((minutes) ? (minutes*60) : 0) + ((hours) ? (hours*3600) : 0) +
			((days) ? (days*86400) : 0) + ((weeks) ? (weeks*604800) : 0);
	return totalSeconds;
}
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '&nbsp;' + str;
    }
    return str;
}
(function($){ $.fn.disableSelection = function() { return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false); }; })(jQuery);
function createDiv(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<div>').html(inner); }
function createSpan(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<span>').html(inner); }
function createMyElement(elementName,theClass,theId,theStyle,theText) {
    var theElement = document.createElement(elementName);
    if (theClass) theElement.className = theClass;
    if (theId) theElement.id = theId;
    if (theStyle) theElement.setAttribute("style",theStyle);
    if (theText) theElement.innerHTML = theText;
    return theElement;
}
function createButton(theClass,theId,theValue,theName,theStyle) {
    var theButton = createMyElement("input",theClass,theId,theStyle);
    theButton.type = "button";
    if (theValue) theButton.value = theValue;
    if (theName) theButton.name = theName;
    return theButton;
}
function createCheckbox(theClass,theId,theValue,theName,theStyle) {
    var theCheckbox = createMyElement("input",theClass,theId,theStyle);
    theCheckbox.value = theValue;
    theCheckbox.type = "checkbox";
    if (theName) theCheckbox.name = theName;
    return theCheckbox;
}
function createTextInput(theClass,theId,theValue,theName,theStyle) {
    var theInput = createMyElement("input",theClass,theId,theStyle);
    theInput.type = "text";
    if (theValue) theInput.value = theValue;
    if (theName) theInput.name = theName;
    return theInput;
}
function setUpVoices(gender) {
    if (gender == "Female") {
        g60MinutesLeft = f60MinutesLeft; g30MinutesLeft = f30MinutesLeft; g20MinutesLeft = f20MinutesLeft; g10MinutesLeft = f10MinutesLeft;
        g5MinutesLeft = f5MinutesLeft; g1MinuteLeft = f1MinuteLeft; g30SecondsLeft = f30SecondsLeft; gTesting = fTesting;
    } else if (gender == "Male") {
        g60MinutesLeft = m60MinutesLeft; g30MinutesLeft = m30MinutesLeft; g20MinutesLeft = m20MinutesLeft; g10MinutesLeft = m10MinutesLeft;
        g5MinutesLeft = m5MinutesLeft; g1MinuteLeft = m1MinuteLeft; g30SecondsLeft = m30SecondsLeft; gTesting = mTesting;
    } else {
        g60MinutesLeft = a60MinutesLeft; g30MinutesLeft = a30MinutesLeft; g20MinutesLeft = a20MinutesLeft; g10MinutesLeft = a10MinutesLeft;
        g5MinutesLeft = a5MinutesLeft; g1MinuteLeft = a1MinuteLeft; g30SecondsLeft = a30SecondsLeft; gTesting = a30SecondsLeft;
    }
}
function setColor(theTimeLeft) {
    var theColor = "FFFFFF";
    if (theTimeLeft<30) theColor = gHtmlColors[0]; // less than 30 seconds
    else if (theTimeLeft<60) theColor = gHtmlColors[1]; // less than 1 minute
    else if (theTimeLeft<600) {
        theColor = gHtmlColors[Math.ceil(theTimeLeft/60)]; // less than 10 minutes
    }
    else if (theTimeLeft<1200) {
        theColor = gHtmlColors[Math.ceil((theTimeLeft-600)/120)+10]; // less than 20 minutes
    }
    else if (theTimeLeft<1800) {
        theColor = gHtmlColors[Math.ceil((theTimeLeft-1200)/240)+15]; // less than 30 minutes
    }
    else if (theTimeLeft<2100) theColor = gHtmlColors[20];
    else if (theTimeLeft<2400) theColor = gHtmlColors[21];
    else if (theTimeLeft<3000) theColor = gHtmlColors[22];
    else if (theTimeLeft<2600) theColor = gHtmlColors[23];
	$("#MainContent").css("background-color","#"+theColor);
}
function timeElapsed() {
	var hours = 0, minutes = 0, seconds = 0, minutesAt = 1;
    var theTime = document.getElementsByClassName("completion-timer");
    if (theTime.length) {
        var theSplit = theTime[0].innerHTML.split(":");
		if (theSplit.length < 3) minutesAt=0;
        hours = (theSplit.length == 3) ? parseInt(theSplit[0]) : 0;
        minutes = parseInt(theSplit[minutesAt]);
        seconds = parseInt(theSplit[minutesAt + 1]);
        minutes += hours * 60;
        var gElapsedSeconds = seconds + (minutes * 60);
        return gElapsedSeconds;
    } else return null;
}
function timeAlotted() {
    var theTime = document.getElementsByClassName("completion-timer");
    if (theTime.length) {
        var theSplit = theTime[0].innerHTML.split("of ");
        var theMinutesString = theSplit[1].split(" ");
		return Number(theMinutesString[0]) * 60;
	}
}
function timeLeft() {
	return timeAlotted() - timeElapsed();
}
function warning(theSound,theTime) {
    theSound.volume = gVolume;
    theSound.play();
    gWarningTimes[theTime] = true;
}
function checkTimes(announceNow) {
	var timeLeftSeconds = timeLeft();
    if (timeLeftSeconds) {
        if (timeLeftSeconds<=30) {
            if (gOptionTimes["30s"][0] == "On" && !gWarningTimes["30s"]) warning(g30SecondsLeft,"30s");
        } else if (timeLeftSeconds<=60) {
            if (gOptionTimes["1"][0] == "On" && !gWarningTimes["1"]) warning(g1MinuteLeft,"1");
        } else if (timeLeftMinutes<5 && (timeLeftMinutes>3 || announceNow)) {
            if (gOptionTimes["5"][0] == "On" && (!gWarningTimes["5"] || announceNow))
                if (gElapsedSeconds>185 || announceNow) warning(g5MinutesLeft,"5");
        } else if (timeLeftMinutes<10 && (timeLeftMinutes>7 || announceNow)) {
            if (gOptionTimes["10"][0] == "On" && (!gWarningTimes["10"] || announceNow))
                if (gElapsedSeconds>185 || announceNow) warning(g10MinutesLeft,"10");

        } else if (timeLeftMinutes<20 && (timeLeftMinutes>15 || announceNow)) {
            if (gOptionTimes["20"][0] == "On" && (!gWarningTimes["20"] || announceNow))
                if (gElapsedSeconds>305 || announceNow) warning(g20MinutesLeft,"20");
        } else if (timeLeftMinutes<30 && (timeLeftMinutes>24 || announceNow)) {
            if (gOptionTimes["30"][0] == "On" && (!gWarningTimes["30"] || announceNow))
                if (gElapsedSeconds>365  || announceNow) warning(g30MinutesLeft,"30");
        } else if (timeLeftMinutes<60 && (timeLeftMinutes>53 || announceNow)) {
            if (gOptionTimes["60"][0] == "On" && (!gWarningTimes["60"] || announceNow))
                if (gElapsedSeconds>425 || announceNow) warning(g60MinutesLeft,"60");
        }
        if (gOptions.color[0] == "On") setColor(timeLeftSeconds);
        else document.getElementsByTagName("form")[1].style.backgroundColor = "#FFFFFF";
    }
}
function setOptions() {
    gOptions.status[0] = document.getElementById("warningOption").getAttribute("currentValue");
    gOptions.status[1] = document.getElementById("warningOption").getAttribute("valueIndex");
    gOptions.voice[0] = document.getElementById("warningVoiceOptions").getAttribute("currentValue");
    gOptions.voice[1] = document.getElementById("warningVoiceOptions").getAttribute("valueIndex");
    gOptions.alarm[0] = document.getElementById("warningAlarmOptions").getAttribute("currentValue");
    gOptions.alarm[1] = document.getElementById("warningAlarmOptions").getAttribute("valueIndex");
    gOptions.color[0] = document.getElementById("warningColorOptions").getAttribute("currentValue");
    gOptions.color[1] = document.getElementById("warningColorOptions").getAttribute("valueIndex");
    gOptions.firstSpeak[0] = document.getElementById("speakStartOption").getAttribute("currentValue");
    gOptions.firstSpeak[1] = document.getElementById("speakStartOption").getAttribute("valueIndex");
    gOptionTimes["60"][0] = document.getElementById("1HourOptions").getAttribute("currentValue");
    gOptionTimes["60"][1] = document.getElementById("1HourOptions").getAttribute("valueIndex");
    gOptionTimes["30"][0] = document.getElementById("30MinutesOptions").getAttribute("currentValue");
    gOptionTimes["30"][1] = document.getElementById("30MinutesOptions").getAttribute("valueIndex");
    gOptionTimes["20"][0] = document.getElementById("20MinutesOptions").getAttribute("currentValue");
    gOptionTimes["20"][1] = document.getElementById("20MinutesOptions").getAttribute("valueIndex");
    gOptionTimes["10"][0] = document.getElementById("10MinutesOptions").getAttribute("currentValue");
    gOptionTimes["10"][1] = document.getElementById("10MinutesOptions").getAttribute("valueIndex");
    gOptionTimes["5"][0] = document.getElementById("5MinutesOptions").getAttribute("currentValue");
    gOptionTimes["5"][1] = document.getElementById("5MinutesOptions").getAttribute("valueIndex");
    gOptionTimes["1"][0] = document.getElementById("1MinuteOptions").getAttribute("currentValue");
    gOptionTimes["1"][1] = document.getElementById("1MinuteOptions").getAttribute("valueIndex");
    gOptionTimes["30s"][0] = document.getElementById("30SecondsOptions").getAttribute("currentValue");
    gOptionTimes["30s"][1] = document.getElementById("30SecondsOptions").getAttribute("valueIndex");
    gOptionTimes.every1[0] = document.getElementById("every1").getAttribute("currentValue");
    gOptionTimes.every1[1] = document.getElementById("every1").getAttribute("valueIndex");
    gOptionTimes.every5[0] = document.getElementById("every5").getAttribute("currentValue");
    gOptionTimes.every5[1] = document.getElementById("every5").getAttribute("valueIndex");
    gOptionTimes.every10[0] = document.getElementById("every10").getAttribute("currentValue");
    gOptionTimes.every10[1] = document.getElementById("every10").getAttribute("valueIndex");
    if (gOptions.voice[0] != "Off") setUpVoices(gOptions.voice[0]);
    else if (gOptions.alarm[0] != "Off") setUpVoices();
    if (gWorking) {
        if (gOptions.color[0] == "On" && gOptions.status[0] == "On") setColor(timeElapsed());
        else document.getElementsByTagName("form")[1].style.backgroundColor = "#FFFFFF";
        if (!gDoNotSpeak && gOptions.status[0] == "On" && (gOptions.voice[0] != "Off" || gOptions.alarm[0] != "Off")) checkTimes(true);
    } else if (gOptions.status[0] == "On" && gOptions.voice[0] != "Off" && !gDoNotSpeak) {
		if (gNewSite) speakThisNow("This is a test of this warning system.",gOptions.voice[0]); else gTesting.play();
	}
    if (document.getElementById("warningOptionsSave").checked) saveSettings();
}
function createSpanOptions(theNode,theOptions) {
    var theId = "", theText = "", theValues = [], theStatus = "", replaceWith="";
    for (var i=0,len=theOptions.length; i<len; i++) {
        theId = theOptions[i][0];
        theText = theOptions[i][1];
        theValues = theOptions[i][2];
        theStatus = theValues[theOptions[i][3]].substr(0,1);
        replaceWith = theValues[theOptions[i][3]].replace(theStatus,"");
        theOption = createMyElement("span","myOwnSpan",theId,
            "cursor:pointer; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;",
            theText.replace("$",replaceWith));
        if (theStatus=="-") theOption.style.color = "#FF0000";
        else theOption.style.color = "#006600";
        theOption.setAttribute("theValues",JSON.stringify(theValues));
        theOption.setAttribute("valueIndex",theOptions[i][3]);
        theOption.setAttribute("theText",theText);
        theOption.setAttribute("currentValue",replaceWith);
        theNode.appendChild(document.createTextNode(" "));
        theNode.appendChild(theOption);
        theOption.onmousemove = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        theOption.onclick = function() {
            gDoNotSpeak = true;
            var theValues = JSON.parse(this.getAttribute("theValues"));
            var theIndex = parseInt(this.getAttribute("valueIndex"));
            var theText = this.getAttribute("theText");
            theIndex = (theIndex < theValues.length-1) ? theIndex+1 : 0;
            this.setAttribute("valueIndex",theIndex);
            var theStatus = theValues[theIndex].substr(0,1);
            var replaceWith = theValues[theIndex].replace(theStatus,"");
            this.innerHTML = theText.replace("$",replaceWith);
            this.setAttribute("currentValue",replaceWith);
            if (theStatus=="-") this.style.color = "#FF0000";
            else this.style.color = "#006600";
            if (this.id == "warningAlarmOptions" && replaceWith == "On") {
                document.getElementById("warningVoiceOptions").setAttribute("currentValue","Off");
                document.getElementById("warningVoiceOptions").setAttribute("valueIndex","1");
                document.getElementById("warningVoiceOptions").innerHTML = "[ Voice: Off ]";
                document.getElementById("warningVoiceOptions").style.color = "#FF0000";
            } else if (this.id == "warningVoiceOptions" && replaceWith != "Off") {
                document.getElementById("warningAlarmOptions").setAttribute("currentValue","Off");
                document.getElementById("warningAlarmOptions").setAttribute("valueIndex","0");
                document.getElementById("warningAlarmOptions").innerHTML = "[ Alarm: Off ]";
                document.getElementById("warningAlarmOptions").style.color = "#FF0000";
				gDoNotSpeak = false;
            } else if (this.id == "warningOption" && replaceWith != "Off") {
                gDoNotSpeak = false;
            } else if (this.id == "speakStartOption") { gDoNotSpeak = true; sayTimeLeft(); }
            setOptions();
        };
    }
}
function toggleOptionsMenu() {
	var rect = $("#JRTimerOptions").offset();
	toggleOptionsMenu.display = toggleOptionsMenu.display || false;
	toggleOptionsMenu.display = !toggleOptionsMenu.display;
	if (toggleOptionsMenu.display) $("#JR_TimerWOptionsMenu").css("top",rect.top  - $(window).scrollTop() + 18).show();
	else $("#JR_TimerWOptionsMenu").hide();
}
function showOptionsNew(menuNode) {
	var theOptionsContainer = createMyElement("div","myOwnDiv","warningOptionsContainer", "padding: 11px 1px 0 7px;");
	var theOptionsControl = createMyElement("div","myOwnDiv","warningOptionsController","");
	var spanWarningOptions = [ ["warningOption","[ Status: $ ]",["+On","-Off"],gOptions.status[1]], ["warningVoiceOptions","[ Voice: $ ]",["+Female","-Off","+Male"],
		gOptions.voice[1]], ["warningAlarmOptions","[ Alarm: $ ]",["-Off","+On"],gOptions.alarm[1]], ["warningColorOptions","[ Color: $ ]",["+On","-Off"],gOptions.color[1]]];
	theOptionsControl.appendChild( createMyElement("span","myOwnSpan","","color:blue; font-weight:bold;","Time Left Warning: ") );
	createSpanOptions(theOptionsControl,spanWarningOptions);
	theOptionsControl.appendChild(createMyElement("br"));
	theOptionsControl.appendChild( createMyElement("span","myOwnSpan","","color:blue; font-weight:bold;","Warn at: ") );
	var spanTimeOptions = [ ["30SecondsOptions","[30 seconds]",["+On","-Off"],gOptionTimes["30s"][1]], ["1MinuteOptions","[1 minute]",["+On","-Off"],gOptionTimes["1"][1]],
		["5MinutesOptions","[5 minutes]",["+On","-Off"],gOptionTimes["5"][1]], ["10MinutesOptions","[10 minutes]",["-Off","+On"],gOptionTimes["10"][1]],
		["20MinutesOptions","[20 minutes]",["-Off","+On"],gOptionTimes["20"][1]], ["30MinutesOptions","[30 minutes]",["+On","-Off"],gOptionTimes["30"][1]],
		["1HourOptions","[1 hour]",["-Off","+On"],gOptionTimes["60"][1]] ];
	createSpanOptions(theOptionsControl,spanTimeOptions);
	theOptionsControl.appendChild(createMyElement("br"));
	theOptionsControl.appendChild( createMyElement("span","myOwnSpan","","color:blue; font-weight:bold;","Warn for: ") );
	var spanEveryOptions = [ ["every1","[Every&nbsp;Minute]",["-Off","+On"],gOptionTimes.every1[1]],
		["every5","[Every&nbsp;Five&nbsp;Minutes]",["-Off","+On"],gOptionTimes.every5[1]],["every10","[Every&nbsp;10&nbsp;Minutes]",["-Off","+On"],gOptionTimes.every10[1]]];
	createSpanOptions(theOptionsControl,spanEveryOptions);
	theOptionsControl.appendChild(createMyElement("br"));
	var spanStartOptions = [ ["speakStartOption","[ Speak Time Left: $ ]",["+On","-Off"],gOptions.firstSpeak[1]] ];
	theOptionsControl.appendChild( createMyElement("span","myOwnSpan","","color:blue; font-weight:bold;","At Beginning Options: ") );
	createSpanOptions(theOptionsControl,spanStartOptions);
	theOptionsControl.appendChild(createMyElement("br"));
	theOptionsControl.appendChild(document.createTextNode("Click on text above to change options."));
	theOptionsControl.appendChild(createMyElement("br"));
	var theOptionsSave = createCheckbox("myOwnCheckBox","warningOptionsSave","save Me","","margin-left:20px; height:10px;");
	theOptionsSave.checked = true;
	theOptionsSave.onclick = function() { if (theOptionsSave.checked) saveSettings(); };
	theOptionsControl.appendChild(theOptionsSave);
	theOptionsControl.appendChild(document.createTextNode(" Permanently Save Options"));
	var volumeLower = createMyElement("span","myOwnSpan","lowerVolumeControl",
		"cursor: pointer; margin-left:20px; margin-right:10px; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;","<-");
	theOptionsControl.appendChild(volumeLower);
	var volumeLevelText = createMyElement("span","myOwnSpan","theVolumeText",
		"cursor:pointer; display: inline-block; width:125px; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;",
		" Volume Level: 100 ");
	theOptionsControl.appendChild(volumeLevelText);
	var volumeHigher = createMyElement("span","myOwnSpan","lowerVolumeControl",
		"cursor: pointer; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;","->");
	theOptionsControl.appendChild(volumeHigher);
	volumeLower.onclick = function() {
		gVolume = (gVolume<0.1) ? 0 : (gVolume-0.1);
		document.getElementById("theVolumeText").innerHTML = " Volume Level: " + pad(Math.round(gVolume*100),3);
		speakThisNow("Hi",gOptions.voice[0]);
	};
	volumeHigher.onclick = function() {
		gVolume = (gVolume>0.9) ? 1 : (gVolume+0.1);
		document.getElementById("theVolumeText").innerHTML = " Volume Level: " + pad(Math.round(gVolume*100),3);
		speakThisNow("Hi",gOptions.voice[0]);
	};
	theOptionsControl.appendChild(createMyElement("br"));
	theOptionsControl.appendChild( createMyElement("div","myOwnDiv","myCloseMenu","box-sizing:content-box; font-size:12px; background-color:#eeeeee; " + 
		"border:3px groove darkgrey; padding:0px 2px; margin-left:45px; margin-top:5px; width:150px;","Close Menu" ));
	theOptionsControl.appendChild(createMyElement("br"));
	theOptionsContainer.appendChild(theOptionsControl);
	$(menuNode).append($(theOptionsContainer)[0]);
	$("#myCloseMenu").disableSelection().click(function() { toggleOptionsMenu(); });
}
function timerLeftAlarms(theHours,theMinutes,theSeconds,voice) {
	var returnValue = "";
	if (timerLeftAlarms.last) {
		if (theHours===0 && theMinutes===0 && theSeconds>0) {
			if (theSeconds==30 && gOptionTimes["30s"][0] == "On")
				returnValue= (voice) ? "seconds" : "30seconds"; // 30second alarm should sound
			else returnValue="";
		}
		if (returnValue === "") {
			if (timerLeftAlarms.last.minutes != theMinutes) {
				if (gOptionTimes.every1[0] == "On") returnValue= (voice) ? "minutes" : "every"; // every 1 minute alarm should sound
				else if (gOptionTimes.every5[0] == "On" && theMinutes % 5 === 0) 
					returnValue= (voice) ? "minutes" : "every"; // every 5 minute alarm should sound
				else if (gOptionTimes.every10[0] == "On" && theMinutes % 10 === 0) 
					returnValue= (voice) ? "minutes" : "every"; // every 10 minute alarm should sound
				else if (theHours===0 && theMinutes===1 && theSeconds===0 && gOptionTimes["1"][0] == "On") 
					returnValue= (voice) ? "1minute" : "oneminute"; // 1 minute alarm should sound
				else if (theHours===0 && theMinutes===5 && theSeconds===0 && gOptionTimes["5"][0] == "On")
					returnValue= (voice) ? "minutes" : "fiveminute"; // 5 minute alarm should sound
				else if (theHours===0 && theMinutes===10 && theSeconds===0 && gOptionTimes["10"][0] == "On")
					returnValue= (voice) ? "minutes" : "tenminute"; // 10 minute alarm should sound
				else if (theHours===0 && theMinutes===20 && theSeconds===0 && gOptionTimes["20"][0] == "On")
					returnValue= (voice) ? "minutes" : "twentyminute"; // 20 minute alarm should sound
				else if (theHours===0 && theMinutes===30 && theSeconds===0 && gOptionTimes["30"][0] == "On")
					returnValue= (voice) ? "minutes" : "thirtyminute"; // 30 minute alarm should sound
				else if (theHours===1 && theMinutes===0 && theSeconds===0 && gOptionTimes["60"][0] == "On")
					returnValue= (voice) ? "hours" : "sixtyminute"; // 60 minute alarm should sound
			}
		}
	} else returnValue = (gOptions.firstSpeak[0]=="On") ? "full" : "";
	timerLeftAlarms.last = {"hours":theHours,"minutes":theMinutes,"seconds":theSeconds};
	return returnValue;
}
function sayTimeLeft(format) {
	var secondsLeft = timeLeft();
	var theHours = Math.floor(secondsLeft / 3600);
	var theMinutes = Math.floor( (secondsLeft - (theHours*3600)) / 60);
	var theSeconds = secondsLeft - (theHours*3600) - (theMinutes*60);
	if ( (thisFormat=timerLeftAlarms(theHours,theMinutes,theSeconds, (gOptions.alarm[0]=="On") ? false : true)) !== "") {
		if (thisFormat=="full") speakThisNow( "You have " + ((theHours>0) ? (theHours + ((theHours>1) ? (" Hours ") : " Hour ")) : "") +
			theMinutes + " Minutes" + theSeconds + " Seconds left",gOptions.voice[0]);
		else if (thisFormat=="minutes") speakThisNow( "You have " + ((theHours>0) ? (theHours + ((theHours>1) ? (" Hours ") : " Hour ")) : "") +
			theMinutes + ((theMinutes>1) ? " Minutes" : " Minute") + " Left",gOptions.voice[0]);
		else if (thisFormat=="seconds" || thisFormat=="1minute") speakThisNow( "You have " + theSeconds + " Seconds Left",gOptions.voice[0]);
		else {
			if (thisFormat=="30seconds") warning(g30SecondsLeft,"30s"); else if (thisFormat=="oneminute") warning(g1MinuteLeft,"1");
			else if (thisFormat=="fiveminute") warning(g5MinutesLeft,"5"); else if (thisFormat=="tenminute") warning(g10MinutesLeft,"10");
			else if (thisFormat=="twentyminute") warning(g20MinutesLeft,"20"); else if (thisFormat=="thirtyminute") warning(g30MinutesLeft,"30");
			else if (thisFormat=="sixtyminute") warning(g60MinutesLeft,"60"); else if (thisFormat=="every") warning(g10MinutesLeft,"10");
		}
	}
	if (gOptions.color[0] == "On") setColor(convertTimeToSeconds(theHours,theMinutes,theSeconds));
	else $("#MainContent").css("background-color","#FFFFFF");
}

$(function() {
	if (window.location.href.indexOf("worker.mturk.com") != -1) {
		if('speechSynthesis' in window){
			gVoices = window.speechSynthesis.getVoices();
			window.speechSynthesis.onvoiceschanged = function() {
				gVoices = window.speechSynthesis.getVoices();
			  };
		}
		gNewSite = true;
		loadSettings();
		setUpVoices();
		var newTimerNode = $(".completion-timer");
		if (newTimerNode.length && $(newTimerNode).closest("div").text().indexOf("Time Elapsed") != -1) {
			if ($(".checkbox.m-y-0").length) {
				createSpan("Timer Options").css({"box-sizing":"content-box","font-size":"10px","background-color":"#eeeeee", "border":"2px groove darkgrey", "padding":"0px 4px","margin-left":"5px" }).attr('id', "JRTimerOptions").disableSelection()
				.click(function() { toggleOptionsMenu(); }).appendTo($(".checkbox.m-y-0:first"));
			} else {
				buttonPosition = $(".col-md-6.col-xs-12:first").find(".col-sm-8.col-xs-7");
				createDiv("Timer Options").css({"box-sizing":"content-box","float":"left","font-size":"10px","background-color":"#eeeeee", "border":"2px groove darkgrey", "padding":"0px 2px" }).attr('id', "JRTimerOptions")
					.disableSelection().click(function() { toggleOptionsMenu(); }).appendTo(buttonPosition);
			}
			createDiv("").css({"position":"fixed","width":"700px","height":"200px","top":"78px","right":"280px","float":"right",
				"background-color":"#eceadf","border":"3px solid #000"}).attr({"id":"JR_TimerWOptionsMenu"}).hide().appendTo("body");
			setTimeout( function() {
				intervalVar = setInterval( function(){
					sayTimeLeft();
				}, 1000);
			}, 1300);
			showOptionsNew($("#JR_TimerWOptionsMenu"));
        }
	}
});
