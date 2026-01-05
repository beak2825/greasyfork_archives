// ==UserScript==
// @name OpenTweetImageOrig
// @include https://twitter.com/*
// @version 0.0.1.20181020044352
// @namespace https://greasyfork.org/users/8032
// @description ツイート画像をクリックで原寸大表示します. (Click to open tweet image as original size)
// @downloadURL https://update.greasyfork.org/scripts/7248/OpenTweetImageOrig.user.js
// @updateURL https://update.greasyfork.org/scripts/7248/OpenTweetImageOrig.meta.js
// ==/UserScript==

addEventListener("click", function(event) {
  var elem = event.target;
  if (elem.src && elem.src.startsWith("https://pbs.twimg.com/media/")) {
    window.open(elem.src.replace(/:[^/]+$|$/, ":orig"), "_blank");
    event.preventDefault();
  }
}, true);
