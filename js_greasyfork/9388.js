// ==UserScript==
// @name        WaniKani Denial Mode
// @version     1.1
// @author Niklas Barsk
// @description Make the dashboard look like you're level 60 and have burnt everything.
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/review/*
// @exclude     https://www.wanikani.com/lesson/*
// @run-at      document-end
// @copyright   2016, Niklas Barsk
// @namespace https://greasyfork.org/users/8532
// @downloadURL https://update.greasyfork.org/scripts/9388/WaniKani%20Denial%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/9388/WaniKani%20Denial%20Mode.meta.js
// ==/UserScript==

var numItems = {'radicals': 478, 'kanji': 2027, 'vocab': 6261};
var maxLevel = "60";
var maxLevelRadicals = "1";
var maxLevelKanji = "32";
var level = document.getElementsByClassName("dropdown-toggle")[0].children[0];
var lessons = document.getElementsByClassName("lessons")[0].getElementsByTagName("span")[0];
var reviews = document.getElementsByClassName("reviews")[0].getElementsByTagName("span")[0];

runScript();

function runScript() {

  // When reloading the page the script gets executed before content has been pulled in by the
  // sites own javascripts. Rerun this script later instead.
  if (!isPageReady()) {
    setTimeout(runScript, 10);
    return;
  }

  make(level,  maxLevel);
  make(lessons, "0");
  make(reviews, "0");

  if (isDashboard()) {
      var reviewStatus = document.getElementsByClassName("review-status")[0];
      var nextHour = reviewStatus.getElementsByClassName("one-hour")[0].children[0];
      var oneDay = reviewStatus.getElementsByClassName("one-day")[0].children[0];
      var nextReview = reviewStatus.getElementsByTagName("time")[0];
      make(nextHour, "0");
      make(oneDay, "0");
      make(nextReview, "&#8734;");

      fixSRSLevels("apprentice");
      fixSRSLevels("guru");
      fixSRSLevels("master");
      fixSRSLevels("enlightened");
      fixSRSLevels("burned");

      fixProgression();
  }
}

function isPageReady() {
  return document.getElementById("apprentice").getAttribute("data-content") != null;
}

function make(elem, what) {
  elem.innerHTML = what;
}

function fixSRSLevels(which) {
  var levelElement = document.getElementById(which);
  var data = levelElement.getAttribute("data-content");
  var fixedData = replaceInDataContent(which, data);
  levelElement.setAttribute("data-content", fixedData);

    var numberHolder = levelElement.children[0];
  if (which == "burned") {
        make(numberHolder, "" + (numItems.radicals + numItems.kanji + numItems.vocab));
  }
    else {
        make(numberHolder, "0");
    }
}

function fixProgression() {
    var progression = document.getElementsByClassName("progression")[0];
    var radicalProgressTitle = progression.getElementsByTagName("h3")[0];
    var kanjiProgressTitle = progression.getElementsByTagName("h3")[1];
    replaceInProgressString(radicalProgressTitle);
    replaceInProgressString(kanjiProgressTitle);

    var radicalProgressBar = document.getElementsByClassName("bar")[0];
    radicalProgressBar.setAttribute("style", "width: 100%;");
    var kanjiProgressBar = document.getElementsByClassName("bar")[1];
    kanjiProgressBar.setAttribute("style", "width: 100%;");

    var radicalProgressBarLabel = radicalProgressBar.getElementsByTagName("b")[0]
    var kanjiProgressBarLabel = kanjiProgressBar.getElementsByTagName("b")[0]
    make(radicalProgressBarLabel, "100%");
    make(kanjiProgressBarLabel, "100%");

    var radicalTotal = document.getElementsByClassName("pull-right total")[0];
    var kanjiTotal = document.getElementsByClassName("pull-right total")[1];
    make(radicalTotal, maxLevelRadicals);
    make(kanjiTotal, maxLevelKanji);
}

function replaceInProgressString(which) {
  var splitString = which.innerHTML.split(/([0-9]+)/); //split on each number
    var newString = "";
    for (i = 0; i < splitString.length; i++) {
        if (isNaN(splitString[i])) {
            newString += splitString[i]; // not a number, just use it as it is
        }
        else {
          newString += maxLevel;
        }
    }
    make(which, newString);
}

function replaceInDataContent(which, data) {
    var splitString = data.split(/([0-9]+)/); //split on each number
    var newData = "";
    var burnCounter = 0;
    var burnCounts = ["" + numItems.radicals, "" + numItems.kanji, "" + numItems.vocab];
    for (i = 0; i < splitString.length; i++) {
        if (isNaN(splitString[i])) {
            newData += splitString[i]; // not a number, just use it as it is
        }
        else if (which == "burned") {
            newData += burnCounts[burnCounter++];
        }
        else {
          newData += "0";
        }
    }
    return newData;
}

function isDashboard() {
    return document.URL.indexOf("dashboard") != -1;
}
