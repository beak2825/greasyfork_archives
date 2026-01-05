// ==UserScript==
// @name        YouTube Top Header Position Relative 
// @namespace   drev@greasemonkey
// @description Set YouTube's top header position (the top header will no longer scroll along with the page)
// @include     https://www.youtube.com/watch*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9371/YouTube%20Top%20Header%20Position%20Relative.user.js
// @updateURL https://update.greasyfork.org/scripts/9371/YouTube%20Top%20Header%20Position%20Relative.meta.js
// ==/UserScript==
 
var masterhead = document.getElementById("masthead-positioner");
masterhead.style.position = 'relative';