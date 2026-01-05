// ==UserScript==
// @name         The Sexy Button
// @namespace    http://www.reddit.com/r/thebutton
// @version      0.1
// @description  Allow The Button to change colour
// @author       Ray57
// @match        http://www.reddit.com/r/thebutton
// @match        http://www.reddit.com/r/thebutton/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9120/The%20Sexy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/9120/The%20Sexy%20Button.meta.js
// ==/UserScript==

(function(){var colorblind = document.createElement('span');
colorblind.className = 'thebutton-colorblind';
$('.thebutton-counter').prepend(colorblind);
colorTimer = window.setInterval(function(){ 
var s = r.thebutton._msgSecondsLeft, ring = $('#thebutton'), color = '';
ring.css('-webkit-transition', 'background-color 0.4s')
    .css('-moz-transition', 'background-color 0.4s')
    .css('-ms-transition', 'background-color 0.4s')
    .css('-o-transition', 'background-color 0.4s')
    .css('transition', 'background-color 0.4s')
if (s < 12) { ring.css('background-color', '#e50000'); color = 'red' } else
if (s < 22) { ring.css('background-color', '#e59500'); color = 'orange' } else
if (s < 32) { ring.css('background-color', '#e5d900'); color = 'yellow' } else
if (s < 42) { ring.css('background-color', '#02be01'); color = 'green' } else
if (s < 52) { ring.css('background-color', '#0083c7'); color = 'blue' } else
{ ring.css('background-color', '#820080'); color = 'purple' }
$('.thebutton-colorblind').text(color + ' - ')}, 10);})();