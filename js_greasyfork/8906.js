// ==UserScript==
// @name        A9 Megascript
// @description Hoards, Fills, Hotkeys, Closes. F1=Submit.
// @namespace   DCI
// @include     https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=A9%20validate&minReward=0.00&qualifiedFor=on&x=7&y=11
// @include     https://www.mturk.com/mturk/*a9hoard*
// @include     https://www.mturk.com/mturk/externalSubmit
// @include     https://www.mturkcontent.com/dynamic*
// @version     1.4
// @grant       GM_openInTab
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/8906/A9%20Megascript.user.js
// @updateURL https://update.greasyfork.org/scripts/8906/A9%20Megascript.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

if (window.location.toString().indexOf("searchbar") != -1) {searchscrape();}

function searchscrape(){

var ScanDelay = 5

document.title = "A9 Hoarder";

var textsearch = $j( ":contains('Review and validate an image')" );
if (textsearch.length){hitsup()}

else

{setTimeout(function(){location.reload(true)},1000*ScanDelay)}

}

function hitsup(){

setTimeout(function(){location.reload(true)},30000);

chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
chimeSound.play(); 

var suffix = "&isPreviousIFrame=true&prevRequester=a9hoard";

var preview1 = $j( '.capsulelink a' )[0].href;
var preview1b = preview1.replace('preview','previewandaccept');
if (preview1){window.open(preview1b + suffix);}

var preview2 = $j( '.capsulelink a' )[1].href;
var preview2b = preview2.replace('preview','previewandaccept');
if (preview2){window.open(preview2b + suffix);}

var preview3 = $j( '.capsulelink a' )[2].href;
var preview3b = preview3.replace('preview','previewandaccept');
if (preview3){window.open(preview3b + suffix);}

var preview4 = $j( '.capsulelink a' )[3].href;
var preview4b = preview4.replace('preview','previewandaccept');
if (preview4){window.open(preview4b + suffix);}

var preview5 = $j( '.capsulelink a' )[4].href;
var preview5b = preview5.replace('preview','previewandaccept');
if (preview5){window.open(preview5b + suffix);}

var preview6 = $j( '.capsulelink a' )[5].href;
var preview6b = preview6.replace('preview','previewandaccept');
if (preview6){window.open(preview6b + suffix);}

var preview7 = $j( '.capsulelink a' )[6].href;
var preview7b = preview7.replace('preview','previewandaccept');
if (preview7){window.open(preview7b + suffix);}

var preview8 = $j( '.capsulelink a' )[7].href;
var preview8b = preview8.replace('preview','previewandaccept');
if (preview8){window.open(preview8b + suffix);}

var preview9 = $j( '.capsulelink a' )[8].href;
var preview9b = preview9.replace('preview','previewandaccept');
if (preview9){window.open(preview9b + suffix);}

var preview10 = $j( '.capsulelink a' )[9].href;
var preview10b = preview10.replace('preview','previewandaccept');
if (preview10){window.open(preview10b + suffix);}
}

if (window.location.toString().indexOf("a9hoard") != -1) {
    listen();
    }
function listen(){   
window.addEventListener("message", receiveMessage, false);
function receiveMessage(q){
var msg = q.data;
if (msg == "a9closeplz"){window.close()}
}
}


var submit = $j( ":contains('Loading next hit')" );
if (submit.length){
    window.parent.postMessage("a9closeplz", '*');}
    
if (window.location.toString().indexOf("mturkcontent.com/dynamic") != -1) {
radios();}

function radios(){
var textsearch = $j( ":contains('Target image category')" );
if (textsearch.length){runscript()}

function runscript (){

$j('input[type="radio"]').eq(0).click();
$j('input[type="radio"]').eq(3).click();
$j('input[type="radio"]').eq(5).click();
$j('input[type="radio"]').eq(6).click();
$j('input[type="radio"]').eq(9).click();
$j('input[type="radio"]').eq(11).click();
$j('input[type="checkbox"]').eq(6).prop('checked', true);

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 112 ) { //F1 - 
i.preventDefault();
$j('#submitButton').click();
}


}
}
}

if (window.location.toString().indexOf("a9hoard") != -1) {
    if (document.getElementsByName("autoAcceptEnabled")[0]) {
 setTimeout(function(){GM_openInTab(window.location.toString());},0000);
    } else {
window.close();    	
    }
}
