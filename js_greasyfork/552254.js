// ==UserScript==
// @name - Click Button - Hulu - Force Pause
// @description Prevent Hulu from un-pausing background-paused videos
// @version 0.1.1
// @match https://www.hulu.com/*
// @grant none
// @run-at document-idle
// @namespace https://greasyfork.org/users/1521065
// @downloadURL https://update.greasyfork.org/scripts/552254/-%20Click%20Button%20-%20Hulu%20-%20Force%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/552254/-%20Click%20Button%20-%20Hulu%20-%20Force%20Pause.meta.js
// ==/UserScript==

(function () {
  setInterval(() => {
  document.querySelectorAll('.PlayButton').forEach(e => {
    let count = 0;
    function recursiveTimeout() {
      if (count < 7) {
        count++;
        if (count == 1) {
          document.querySelectorAll('[aria-label="MUTE"]').forEach(mute => {
          mute.click();
          });}
        if (count == 2) {
          document.querySelectorAll('.RewindButton').forEach(rewind => {
          rewind.click();
          });}
        if (count == 3) {
          document.querySelectorAll('.PlayButton').forEach(play => {
          play.click();
          });}
        if (count == 4) {
          document.querySelectorAll('.PauseButton').forEach(pause => {
          pause.click();
          });}
        if (count == 5) {
          document.querySelectorAll('.FastForwardButton').forEach(forward => {
          forward.click();
          });}
        if (count == 6) {
          document.querySelectorAll('[aria-label="UNMUTE"]').forEach(unmute => {
          unmute.click();
          });}
        setTimeout(recursiveTimeout, 500);
      }
    }
    recursiveTimeout();
  });
  }, 30000);
})();