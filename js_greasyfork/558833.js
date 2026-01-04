// ==UserScript==
// @name        Advent of Code Star Fix
// @namespace   DLii Technologies
// @match       https://adventofcode.com/*
// @grant       none
// @version     1.1
// @author      David Ludwig
// @description 12/13/2025, 12:26:04 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558833/Advent%20of%20Code%20Star%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558833/Advent%20of%20Code%20Star%20Fix.meta.js
// ==/UserScript==

if (document.URL.endsWith("/events")) {
  var events = document.querySelectorAll(".eventlist-event");
  var extraStars = 0;
  for (var event of events) {
    var eventYear = parseInt(event.querySelector('a').innerHTML.slice(1, -1));
    if (eventYear < 2025) {
      continue;
    }
    var starCount = event.querySelector(".star-count");
    var value = parseInt(starCount.innerHTML);
    if (value == 24) {
      extraStars += 1
      starCount.innerHTML = "<span style='text-decoration: line-through;'>24</span> 25*";
    }
    event.querySelector(".quiet").innerHTML = "<span style='text-decoration: line-through;'>24</span> 25*";
  }
  if (extraStars > 0) {
    var totalStars = document.querySelector("body > main > article > p:nth-child(13) > span");
    var value = parseInt(totalStars.innerHTML);
    totalStars.innerHTML = "<span style='text-decoration: line-through;'>" + value + "</span> " + (value + extraStars) + "*";
  }
}

// If we are viewing 2025 and later:
year = document.URL.match(/adventofcode.com\/(\d{4})?/)[1];
if (year === undefined || parseInt(year) >= 2025) {
  var userStars = document.querySelector("body > header > div:nth-child(1) > div > span");
  if (userStars.innerHTML == "24*") {
    userStars.innerHTML = "<span style='text-decoration: line-through;'>24</span> 25*";
  }
}
