// ==UserScript==
// @id             YTPPAA141226
// @name           Youtube Prevent Playlist Auto Advance (HTML5)
// @version        1.0
// @namespace      OK
// @author         wordsnerd, Exaskryz
// @description    Pause HTML5 videos with one second remaining in playlists
// @include        *.youtube.*list*
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/7186/Youtube%20Prevent%20Playlist%20Auto%20Advance%20%28HTML5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7186/Youtube%20Prevent%20Playlist%20Auto%20Advance%20%28HTML5%29.meta.js
// ==/UserScript==
var paused = false;
var vids = document.getElementsByClassName("video-stream");

if (vids.length) {
    vids[0].addEventListener("timeupdate", function() { findDif(vids[0]) }, false);
}

function findDif(vid) {
    var pos = vid.currentTime;
    var len = vid.duration;
    if (!paused && len - pos < 1) {
        vid.pause();
        paused = true;
    }
    if (paused && len - pos > 1) {
        paused = false;
    }
}