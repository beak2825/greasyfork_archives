// ==UserScript==
// @name        A9 hoarder
// @description For use with Tab Hoarder, THCloser, and Farmer II
// @namespace   DCI
// @include     https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=A9&minReward=0.00&qualifiedFor=on&x=8&y=13
// @version     1.2
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/8520/A9%20hoarder.user.js
// @updateURL https://update.greasyfork.org/scripts/8520/A9%20hoarder.meta.js
// ==/UserScript==

var ScanDelay = 5

document.title = "A9 Hoarder";

var $j = jQuery.noConflict(true);

var textsearch = $j( ":contains('Review and validate an image')" );
if (textsearch.length){hitsup()}

else

{setTimeout(function(){location.reload(true)},1000*ScanDelay)}

function hitsup(){

var TargetLink = $j("a:contains('Hoard')")
if (TargetLink.length){
setTimeout(function(){ location.reload(true); }, 300000);
BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav"); 
BellSound.play();
window.open(TargetLink[0].href,'_blank');
window.open(TargetLink[1].href,'_blank');
window.open(TargetLink[2].href,'_blank');
window.open(TargetLink[3].href,'_blank');
window.open(TargetLink[4].href,'_blank');
window.open(TargetLink[5].href,'_blank');
window.open(TargetLink[6].href,'_blank');
window.open(TargetLink[7].href,'_blank');
window.open(TargetLink[8].href,'_blank');
window.open(TargetLink[9].href,'_blank');
}}