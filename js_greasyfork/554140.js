// ==UserScript==
// @name        Block video subtitles for btkakademi
// @namespace   Violentmonkey Scripts
// @match       https://www.btkakademi.gov.tr/portal/course/player/*
// @match       https://cinema8.com/video/*
// @grant       none
// @version     1.0
// @author      KutayX7
// @license     MIT
// @description This script automatically turns off the annoying on-by-default video subtitles.
// @downloadURL https://update.greasyfork.org/scripts/554140/Block%20video%20subtitles%20for%20btkakademi.user.js
// @updateURL https://update.greasyfork.org/scripts/554140/Block%20video%20subtitles%20for%20btkakademi.meta.js
// ==/UserScript==

function keepSubtitlesOff()
{
  if (typeof changeSubtitles === "function") {
    if (typeof selectedSubtitles === "string") {
      changeSubtitles("off");
      setTimeout(()=>{ changeSubtitles("off"); }, 500); // Doing it again after some time to make sure it's disabled. Otherwise it usually doesn't work.
    }
    else {
      setTimeout(keepSubtitlesOff, 100.0);
    }
  }
}

keepSubtitlesOff();
