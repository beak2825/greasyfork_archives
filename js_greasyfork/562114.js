// ==UserScript==
// @name         YouTube Background NonStop
// @namespace    https://greasyfork.org/users/28298
// @version      0.5
// @description  Merge several scripts into one to enable playing in background nonstop.
// @author       Jerry
// @include      *://*.youtube.com/*
// @license      GNU GPLv3
// @run-at       document-start
// @homepage https://greasyfork.org/en/scripts/562114-youtube-background-nonstop
// @downloadURL https://update.greasyfork.org/scripts/562114/YouTube%20Background%20NonStop.user.js
// @updateURL https://update.greasyfork.org/scripts/562114/YouTube%20Background%20NonStop.meta.js
// ==/UserScript==

// on ios, sometimes, swipe up control panels and then play if stopped.


// codes copied from:
// YouTube Web Tweaks
// https://greasyfork.org/en/scripts/447802-youtube-web-tweaks
// (alternative: https://greasyfork.org/en/scripts/457219-disable-youtube-autopause)

// YouTube Music Background Play
// https://greasyfork.org/en/scripts/443234-background-youtube-music

// YouTube Music Enhancement
// https://greasyfork.org/en/scripts/390352-youtube-stay-active-and-play-forever

document.addEventListener("visibilitychange", function(event) {event.stopImmediatePropagation();}, true);

Object.defineProperties(document, { 'hidden': {value: false}, 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });

setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 300000);  // 60000 