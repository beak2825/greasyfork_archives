// ==UserScript==
// @author James Edward Lewis II
// @namespace greasyfork.org
// @name Disable audio/video autoplay
// @description Ensures that HTML5 audio and video elements do not autoplay, based on http://diveintohtml5.info/examples/disable_video_autoplay.user.js
// @icon http://diveintohtml5.info/favicon.ico
// @include *
// @grant none
// @version 1.2.0
// @run-at document-end
// @copyright 2015 James Edward Lewis II
// @downloadURL https://update.greasyfork.org/scripts/8022/Disable%20audiovideo%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/8022/Disable%20audiovideo%20autoplay.meta.js
// ==/UserScript==
var arVideos = document.getElementsByTagName('video'), arAudio = document.getElementsByTagName('audio'), vl = arVideos.length,
 al = arAudio.length, loc = window.document.location.toString(), ytPlayer = document.getElementById('movie_player'),
 ytVars = ytPlayer ? ytPlayer.getAttribute('flashvars') : '', arEmbeds = document.getElementsByTagName('embed'),
 el = arEmbeds.length, ytPause = document.getElementsByClassName('ytp-button-pause'),
 cb_load = function cb_load(fnc) { // Just for those who still use IE7Pro; IE8 and earlier do not support addEventListener: https://gist.github.com/eduardocereto/955642
  'use strict';
  if (window.addEventListener) { // W3C model
    window.addEventListener('load', fnc, false);
    return true;
  } else if (window.attachEvent) { // Microsoft model
    return window.attachEvent('onload', fnc);
  } else { // Browser doesn't support W3C or MSFT model, go on with traditional
    if (typeof window.onload === 'function') {
      // Object already has a function on traditional
      // Let's wrap it with our own function inside another function
      fnc = (function wrap(f1, f2) {
        return function wrapped() {
          f1.apply(this, arguments);
          f2.apply(this, arguments);
        };
      }(window.onload, fnc));
    }
    window.onload = fnc;
    return true;
  }
 }, nodeRefresh = function nodeRefresh(nod) {
   'use strict';
   var orig = nod.style.display;
   nod.style.display = (orig === 'none') ? 'block' : 'none';
   nod.style.display = orig;
 }, vidStop = function vidStop(vid) {
   'use strict';
   vid.pause();
   vid.oncanplay = null;
   vid.onplay = null;
 }, stopVideo, i;
for (i = vl - 1; i >= 0; i--) arVideos[i].autoplay = false;
for (i = al - 1; i >= 0; i--) arAudio[i].autoplay = false;

// attempted workaround for Vine and modern YouTube, except on YouTube playlists, based on https://greasyfork.org/en/scripts/6487-pause-all-html5-videos-on-load
if (!loc.match(/^https?\:\/\/(?:\w+\.)?youtube(?:-nocookie)?\.com(?:\:80)?\/watch\?.*list=[A-Z]/i)) {
  stopVideo = function stopVideo() {
    'use strict';
    var autoPlay, i, yl = ytPause ? +ytPause.length : 0, vidStopper = function vidStopper() {vidStop(autoPlay);};
    if (yl) { // This comes from Stop Youtube HTML5 Autoplay by Leslie P. Polzer of PORT ZERO <polzer@port-zero.com>: http://www.port-zero.com/en/chrome-plugin-stop-html5-autoplay/
      for (i = yl - 1; i >= 0; i--) ytPause[i].click();
    } else {
      for (i = vl - 1; i >= 0; i--) {
        autoPlay = arVideos[i];
        if (autoPlay && autoPlay.readyState === 4) {
          vidStop(autoPlay);
          autoPlay.currentTime = 0;
          nodeRefresh(autoPlay);
        } else {
         autoPlay.oncanplay = vidStopper;
         autoPlay.onplay = vidStopper;
        }
      }
      for (i = al - 1; i >= 0; i--) {
        autoPlay = arAudio[i];
        if (autoPlay && autoPlay.readyState === 4) {
          vidStop(autoPlay);
          autoPlay.currentTime = 0;
          nodeRefresh(autoPlay);
        } else {
         autoPlay.oncanplay = vidStopper;
         autoPlay.onplay = vidStopper;
        }
      }
    }
  };
  if (!loc.match(/^https?\:\/\/(?:\w+\.)?youtube(?:-nocookie)?\.com[\:\/]/i) || !vl) cb_load(stopVideo);
  else cb_load(function delayedYTstop() {'use strict'; setTimeout(stopVideo, 0);});
}

// attempted workaround for old Flash-based YouTube, for older browsers, based on http://userscripts-mirror.org/scripts/review/100858
if (loc.match(/^https?\:\/\/(?:\w+\.)?youtube(?:-nocookie)?\.com[\:\/]/i) && loc.indexOf('list=') === -1 && !vl && ytVars)
  cb_load(function delayedYTstop() {'use strict'; setTimeout(function stopOldYT() { // in video page : profile page
    ytPlayer.setAttribute('flashvars', (loc.indexOf('/watch') !== -1) ? 'autoplay=0&' + ytVars : ytVars.replace(/autoplay=1/i, 'autoplay=0'));
    ytPlayer.src += (ytPlayer.src.indexOf('#') === -1) ? '#' : '&autoplay=0';
    nodeRefresh(ytPlayer);
  }, 0);});

// attempted workaround for Billy-based video players on Tumblr, based on https://greasyfork.org/en/scripts/921-tumblr-disable-autoplay
// which is also the source of all the CSSOM tomfoolery elsewhere in this script
if (loc.match(/^https?\:\/\/(?:\w+\.)*tumblr\.com[\:\/]/i))
  cb_load(function stopBillyTumblr() {
    'use strict';
    var autoPlay, i;
    for (i = el - 1; i >= 0; i--) {
      autoPlay = arEmbeds[i];
      if (autoPlay && autoPlay.src.match(/autoplay=true/gi)) {
        autoPlay.src = autoPlay.src.replace(/autoplay=true/gi, 'autoplay=false');
        nodeRefresh(autoPlay);
      }
    }
  });
