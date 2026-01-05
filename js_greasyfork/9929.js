// ==UserScript==
// @name        YouTube Focus
// @namespace   jeremy@use.startmail.com
// @namespace   http://goo.gl/m79y0X
// @description For those sick of seeing distracting garbage on YouTube's homepage.
// @include     https://*youtube*/
// @version     1.4
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9929/YouTube%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/9929/YouTube%20Focus.meta.js
// ==/UserScript==

var iHTML = '<div style="width:100%;font-family:cursive;font-size:100px;text-transform:uppercase;color:#222222;text-align:center;padding-top:200px;">Focus</div>';
jQuery('ytd-two-column-browse-results-renderer.ytd-browse').empty().append(iHTML).parent().css('background-color','#C3C3C3;');