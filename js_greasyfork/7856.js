// ==UserScript==
// @name        WaniKani Fake Numbers
// @version     1.0
// @author      Niklas Barsk
// @description Replaces numbers over 42 with 42+ on the main parts of the Dashboard.
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/review/*
// @exclude     https://www.wanikani.com/lesson/*
// @run-at      document-end
// @namespace https://greasyfork.org/users/8532
// @downloadURL https://update.greasyfork.org/scripts/7856/WaniKani%20Fake%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/7856/WaniKani%20Fake%20Numbers.meta.js
// ==/UserScript==

var level = document.getElementsByClassName("dropdown-toggle")[0].children[0];
replaceIfNeeded(level);

if (isDashboard()) {
    var nextHour = document.getElementsByClassName("one-hour")[0].children[0];
    var oneDay = document.getElementsByClassName("one-day")[0].children[0];
    replaceIfNeeded(nextHour);
    replaceIfNeeded(oneDay);

    fixSRSLevels("apprentice");
    fixSRSLevels("guru");
    fixSRSLevels("master");
    fixSRSLevels("enlightened");
    fixSRSLevels("burned");
}

function replaceIfNeeded(elem) {
    if (shouldReplace(elem.innerHTML)) {
        elem.innerHTML = "42+";
    }
}

function shouldReplace(str) {
    return parseInt(str) > 42;
}

function fixSRSLevels(which) {
	var levelElement = document.getElementById(which);
	var data = levelElement.getAttribute("data-content");
    var fixedData = replaceInDataContent(data);
	levelElement.setAttribute("data-content", fixedData);

    var numberHolder = levelElement.children[0];
	replaceIfNeeded(numberHolder);
}

function replaceInDataContent(data) {
    splitString = data.split(/([0-9]+)/); //split on each number
    newData = "";
    for (i = 0; i < splitString.length; i++) {
        if (shouldReplace(splitString[i])) {
            newData += "42+";
        }
        else {
            newData += splitString[i];
        }
    }
    return newData;
}

function isDashboard() {
    return document.URL.indexOf("dashboard") != -1;
}
