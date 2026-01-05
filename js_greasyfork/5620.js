// ==UserScript==
// @name       Show wage on HIT submit
// @namespace  http://ericfraze.com
// @version    0.1
// @description  (mTurk) This script puts an overlay on the page of your hourly wage when you submit a HIT. Meant for use with batches.
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/continue*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5620/Show%20wage%20on%20HIT%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/5620/Show%20wage%20on%20HIT%20submit.meta.js
// ==/UserScript==

var startTime;

$(document).ready(function() {
    startTime = new Date();
});

$(window).bind('beforeunload', function(){
   var seconds = (new Date() - startTime) / 1000;
   var reward = $(".capsule_field_text .reward").text().replace("$", "");
   var wage = reward * 3600 / (seconds);
   
   $("body").append("<div id='wage-wrapper'><div id='wage'>" + '$' + wage.toFixed(2) + "/h</div></div>");
   
   $("#wage-wrapper").css('position','fixed');
   $("#wage-wrapper").css('width','100%');
   $("#wage-wrapper").css('height','100%');
   $("#wage-wrapper").css('top','0');
   $("#wage-wrapper").css('left','0');
   $("#wage-wrapper").css('background-color','rgba(0,0,0,0.8)');
   
   $("#wage").css('position','absolute');
   $("#wage").css('top','50%');
   $("#wage").css('font-size','50px');
   $("#wage").css('color','white');
   $("#wage").css('width','100%');
   $("#wage").css('text-align','center');
});