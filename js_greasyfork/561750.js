// ==UserScript==
// @name        Hide video suggestions above comments
// @match       https://www.youtube.com/watch*
// @namespace   qthwqywju
// @grant       none
// @version     0.1
// @license     MIT
// @description Hide video suggestions when Youtube tries to display them between the current video and the comments 
// @downloadURL https://update.greasyfork.org/scripts/561750/Hide%20video%20suggestions%20above%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/561750/Hide%20video%20suggestions%20above%20comments.meta.js
// ==/UserScript==

function getVidSuggestionElement(){
  return document.querySelector('div#items.style-scope.ytd-watch-next-secondary-results-renderer');
}

function setupVidSuggBelowVideoHider(){
  let secondary = document.querySelector("div#secondary.style-scope.ytd-watch-flexy")
  let sugg = getVidSuggestionElement()
  sugg.style.display = "flex"; //reset the display to "ON" to avoid issue on dynamic page change

  if (!location.pathname.startsWith('/watch')) {
    return; //abort if it's not a Video page
  }

  const vidSuggCallBack = (entries, sugg, secondary) => {
    if (sugg.style.display != "none" && secondary.offsetWidth == 0){
      //hide the video suggestions when the #secondary container has no width,
      // which is the case when this fucker is between the video and comments
      sugg.style.display = "none";
    } else if (sugg.style.display == "none" && secondary.offsetWidth > 0){
      sugg.style.display = "flex";
    }
  };

  //the event below triggers everytime the video suggestion container changes size
  // and it triggers the callback function above
  const vidSuggResizeObserver = new ResizeObserver((entries) => vidSuggCallBack(entries, sugg, secondary));
  vidSuggResizeObserver.observe(secondary);
}

function waitForSuggToLoad() {
  //check if the video suggestions are ACTUALLY loaded, and wait until they are if needed
  let sugg = getVidSuggestionElement()
  if(sugg === null) {
    window.setTimeout(waitForSuggToLoad, 500);
  } else {
    setupVidSuggBelowVideoHider();
  }
}

//event for dynamic page change
// (when you click a link within youtube it doesn't actually load a new page but update the current one)
document.addEventListener('yt-navigate-start', waitForSuggToLoad);

//regular logic that triggers on true page load
if (document.body) {
   waitForSuggToLoad();
} else {
    document.addEventListener('DOMContentLoaded', waitForSuggToLoad);
}