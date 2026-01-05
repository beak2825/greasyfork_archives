// ==UserScript==
// @name             Youtube 720p
// @namespace        sevanteri
// @description      A simple as possible script to automatically change video quality to 720p (or higher if you want).
// @version          1.1
// @grant            none
// @include          *.youtube.com*
// @downloadURL https://update.greasyfork.org/scripts/7764/Youtube%20720p.user.js
// @updateURL https://update.greasyfork.org/scripts/7764/Youtube%20720p.meta.js
// ==/UserScript==
// Author: https://keybase.io/sevanteri
// Date: 2015-07-15
// License: GNU General Public License v3 (GPL)

// contentEval (http://wiki.greasespot.net/Content_Script_Injection)
(function (source) {
    // Check for function input.
    if ('function' == typeof source) {
        // Execute this function with no arguments, by adding parentheses.
        // One set around the function, required for valid syntax, and a
        // second empty set calls the surrounded function.
        source = '(' + source + ')();'
    }
    // Create a script node holding this  source code.

    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = source;
    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
}) (function () {
    // wanted quality
    var quality = 'hd720';
    // get player id
    var yt = window.ytplayer;
    if (!yt) return;
    var yt = yt.config.attrs.id;
    
    var w = window;
    var d = document;
    var t = null;
    // player element
    var p = null;
    var origReady = w.onYouTubePlayerReady || function () {};

    var setQ = function (q) {
        if (p.getPlaybackQuality() != q) {
            p.setPlaybackQuality(q);
        }
    }

    w.onYouTubePlayerReady = function () {
        p = d.getElementById(yt);
        if (p) {
            p.addEventListener('onStateChange', function (e) {
                //console.log(e);
                // When unstarted (-1) and buffering (3).
                // Unstarted was sent only for the first video, so buffering
                // state seemed like a good choice for other videos in the
                // playlist.
                if (e == - 1 || e == 3) {
                    clearTimeout(t);
                    setQ(quality);
                }
            });
        }
        origReady();
    };
    t = setTimeout(function () {
        p = d.getElementById(yt);
        setQ(quality);
    }, 200);
});
