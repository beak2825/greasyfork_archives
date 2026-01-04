// ==UserScript==
// @name        Youtube Speed Control With "a" and "s"
// @namespace   YoutubeSpeedByExilonium
// @description Increases the playback speed when the "a" key and decreases when the "s" key is pressed
// @include     https://www.youtube.com/*
// @version     1.0.0
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559381/Youtube%20Speed%20Control%20With%20%22a%22%20and%20%22s%22.user.js
// @updateURL https://update.greasyfork.org/scripts/559381/Youtube%20Speed%20Control%20With%20%22a%22%20and%20%22s%22.meta.js
// ==/UserScript==

function pressKey(keyCode) {
  var eventObj = document.createEventObject
    ? document.createEventObject()
    : document.createEvent("Events");

  if (eventObj.initEvent) {
    eventObj.initEvent("keydown", true, true);
  }

  eventObj.keyCode = keyCode;
  eventObj.shiftKey = true;

  if (document.dispatchEvent) {
    document.dispatchEvent(eventObj);
  } else {
    document.fireEvent("onkeydown", eventObj);
  }
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var player = document.querySelector("video");
  if (!player) return;

  // Normalize key
  var key = evt.key
    ? evt.key.toLowerCase()
    : String.fromCharCode(evt.keyCode).toLowerCase();

  switch (key) {
    case "r":
      var player = document.querySelector(".html5-main-video");
      if (player) {
        // Calculate how many times to press Shift + . or Shift + ,
        var step = 0.25; // YouTube's normal step size
        var target = 1.0; // Normal speed
        var diff = player.playbackRate - target;

        if (diff > 0) {
          var presses = Math.round(diff / step);
          for (var i = 0; i < presses; i++) pressKey(188); // Shift + , to slow down
        } else if (diff < 0) {
          var presses = Math.round(-diff / step);
          for (var i = 0; i < presses; i++) pressKey(190); // Shift + . to speed up
        }
      }
      break;

    case "s":
      pressKey(190); // speed up
      break;

    case "a":
      pressKey(188); // slow down
      break;
  }
};