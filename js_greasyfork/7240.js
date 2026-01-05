// ==UserScript==
// @name        svtplay no spoiler
// @namespace   svtplay
// @description Inga spoilers!
// @include    http://*.svtplay.se/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7240/svtplay%20no%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/7240/svtplay%20no%20spoiler.meta.js
// ==/UserScript==
$('.svtplayerCBContainer:has(.svtplayerTime)').hide();
$('.svtplayerCenter-Inner:has(.svtplayerTime)').hide();
$('.play_video-area-aside__info:has(.play_video-area-aside__sub-title)').hide();
