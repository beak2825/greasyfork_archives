// ==UserScript==
// @name        Letterboxd Activity Infinite Scroll
// @description Adds an infintie scroll feature to the Activity page on Letterboxd.com (brought to you by Cinereelists Podcast).
// @namespace   http://cinereelists.com/letterboxd
// @icon		http://i.imgur.com/tPn30Zw.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.0
// @include     http://letterboxd.com/activity/
// @include     http://letterboxd.com/activity/you/
// @include     http://letterboxd.com/activity/incoming/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6017/Letterboxd%20Activity%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/6017/Letterboxd%20Activity%20Infinite%20Scroll.meta.js
// ==/UserScript==

var attackLink = $("a:contains('Load older activity')");
$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
     var evt = document.createEvent ("HTMLEvents");
     evt.initEvent ("click", true, true);
     attackLink[0].dispatchEvent (evt);
     //alert("bottom!");
   }
});