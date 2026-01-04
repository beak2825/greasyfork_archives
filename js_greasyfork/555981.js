// ==UserScript==
// @name        Autoscroll
// @namespace   Autoscroll
// @description Autoscroll any page
// @version     1
// @grant       none
// @include     *
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555981/Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/555981/Autoscroll.meta.js
// ==/UserScript==

(function() {
var scrollInterval = null; // Time interval automatically set, to autoscroll
var scrollTimer = 5; // Time (in ms) between each 1px scroll (default to 10ms)
var scrollPixels = 1; // Number of pixels scrolled (default to 1)
var scrollIncrement = 2; // Time increment (in ms) to add/substract to the current autoscroll (default to 2ms)
var startKey = ":"; // Bind to (re)start the script (default to ":")
var stopKey = "s"; // Bind to stop the script (default to "s")
var fasterKey = "+"; // Bind to accelerate the autoscroll (default to "+")
var slowerKey = "-"; // Bind to slowdown the autoscroll (default to "-")

// Scroll the page by 1px vertically (for smooth scrolling)
function pageScroll() {
    window.scrollBy(0,scrollPixels);
}
  
// Reset the scroll interval
function resetScroll() {
  clearInterval(scrollInterval);
  scrollInterval = setInterval(pageScroll, scrollTimer);
}
  
// Keystrokes
var previousKeyStroke = null;
function keyStrokes(event) {
  if (document.activeElement.localName == "input") return;
  var ek = event.key;
  var tmpPreviousKeyStroke = previousKeyStroke;
  previousKeyStroke = ek;
  if (tmpPreviousKeyStroke == "Control") return;
  switch (ek) {
    case startKey:
      console.log("(Re)started");
      resetScroll();
      break;
    case stopKey:
      console.log("Stopped");
      clearInterval(scrollInterval);
      break;
    case fasterKey:
      scrollTimer -= scrollIncrement;
      if (scrollTimer <= 0) {
		scrollTimer = 1;
		scrollPixels++;
	  }
      resetScroll();
      break;
    case slowerKey:
      (scrollPixels > 1) ? scrollPixels-- : scrollTimer += scrollIncrement;
	  resetScroll();
      break;
    default:
  }
}
document.onkeydown = keyStrokes;

})();