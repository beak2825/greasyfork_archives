// ==UserScript==
// @name         Block AV1 & VP9
// @version      1.0
// @description  This userscript will force all videos to use the h.264 codec rather than VP9/AV1.
// @author       TZ Shuhag
// @license MIT
// @match        *://www.youtube-nocookie.com/*
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @namespace    https://greasyfork.org/en/users/1495563
// @icon         https://raw.githubusercontent.com/tz-shuhag/HD.264/refs/heads/main/icons/video.png
// @run-at       document-idle
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551003/Block%20AV1%20%20VP9.user.js
// @updateURL https://update.greasyfork.org/scripts/551003/Block%20AV1%20%20VP9.meta.js
// ==/UserScript==
 
// Enable strict mode to catch common coding mistakes
"use strict";
 
// Force all videos to use h.264 (useful if you have a low spec machine when you load videos in 720p60)
 
var mse = window.MediaSource;
if (mse){
  // Set up replacement for MediaSource type support function
  var nativeITS = mse.isTypeSupported.bind(mse);
  mse.isTypeSupported = ourITS(nativeITS);
}
// Here's the replacement
function ourITS(fallback){
  // type is a string (hopefully!) sent by the page
  return function (type) {
    if (type === undefined) return '';
    // We only reject VP9
    if (type.toLowerCase().indexOf('vp9') > -1) return '';
    if (type.toLowerCase().indexOf('vp09') > -1) return ''; // Added 12/20/2019
    // Let Firefox handle everything else
    return fallback(type);
  };
}
 