// ==UserScript==
// @name        YouTube - add video ID text field
// @namespace   monnef.tk
// @description Usable for copying a video ID to a clipboard for downloading via youtube-dl. By default it also prefixes the ID with "--" if it starts with a dash (this can be disabled).
// @include     http://www.youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @version     4
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/9090/YouTube%20-%20add%20video%20ID%20text%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/9090/YouTube%20-%20add%20video%20ID%20text%20field.meta.js
// ==/UserScript==

// if you don't want prefixing, replace the word "true" with "false" on the next line
var prefixEnabled = true;
var textId = "textId";

function textFieldClicked() {
  var e = $(this);
  e.select();
}

function updateLinkValue(value) {
  var e = $("#" + textId);
  if (e.length == 0) {
    console.log("Critical, can't find my text field!");
  } else {
    e.attr("value", value);
  }
}

function getLinkMatchFromLocation() {
  return window.location.href.match(/^.*watch(\?v=([^&]+)|\?(.*)).*$/);
}

function getLinkFromLocation() {
  var urlMatch = getLinkMatchFromLocation();
  if (urlMatch.length >= 2) {
    var link = urlMatch[2];
    if (prefixEnabled && link[0] === '-') link = "-- " + link;
    return link;
  }
  return "";
}

function getVideoElement() {
  return $("video.video-stream");
}

function insertInput() {
  $("#watch-header").each(function() {
    var e = $(this);
    var link = getLinkFromLocation();
    if (link) {
      e.before($("<input />").attr("type", "text").css("margin", "5px 0 5px").css("border", "0").css("box-shadow", "0px 1px 2px rgba(0, 0, 0, 0.1)").css("font-size", "200%").attr("id", textId).click(textFieldClicked));
      updateLinkValue(link);
    }
  });
}

function refreshTextLink() {
  var link = getLinkFromLocation();
  console.log("refreshing text link: " + link);
  if (link) updateLinkValue(link);
}

// beacuse mutation observers are broken in GreaseMonkey :(
function installDomEventListener() {
  var videoElem = getVideoElement();
  if (videoElem.length == 0) {
    console.log("Can't find video element!");
  } else {
    videoElem.each(function() {
      this.parentNode.addEventListener("DOMNodeInserted", function(e) {
        console.log("modified (insertion): src=" + getVideoElement().attr("src"));
        refreshTextLink();
        installDomEventListener();
      }, false);
    });
  }
}

function installRedStripWatching() {
  $('body').on('transitionend', function(event) {
    //console.log("transitionend: " + event.target.id);
    if (event.target.id != 'progress') return false;
    console.log("Detected red strip change.");
    refreshTextLink();
  });
}

insertInput();
installDomEventListener();
installRedStripWatching();
refreshTextLink();
