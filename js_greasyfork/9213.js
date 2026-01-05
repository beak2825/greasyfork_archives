// ==UserScript==
// @name        Searchinator
// @description F1=paste highlighted F2=NA F3=Tab F4=Submit
// @version     1.6
// @author      DCI
// @namespace   http://www.redpandanetwork.org
// @include     *
// @require     http://code.jquery.com/jquery-latest.min.js
// @icon        http://i.imgur.com/o9AcjiE.jpg
// @downloadURL https://update.greasyfork.org/scripts/9213/Searchinator.user.js
// @updateURL https://update.greasyfork.org/scripts/9213/Searchinator.meta.js
// ==/UserScript==


var $j = jQuery.noConflict(true);

if (window.location.toString().indexOf('.mturkcontent.com') !== -1 
|| window.location.toString().indexOf('s3.amazonaws.com') !== -1){
hit()};

function hit(){

window.scrollTo(0, 1000);

var searchString = '';
     
$j('#mturk_form > section > div > table > tbody > tr > td:nth-child(2)').each(function() {
searchString += $j(this).text().trim() + ' ';});

var searchurl = "https://encrypted.google.com/search?q=" + searchString;
//var searchurl = "http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=" + searchString;

var tfield = $j('input[type="text"]');

function dehighlight(){
$j('input[type="text"]').css( "background-color", "" );}

function clearf(){
var fields = $j('input[type="text"]').each(function(i) {
$j(this).attr('name', 'off');});
}

clearf();

for (i=0; i < tfield.length; i++){
$j('input[type="text"]')[i].addEventListener("focus", active, true);
}

function active(){
dehighlight();
clearf();
document.activeElement.name = 'on';
$j(document.activeElement).css( "background-color", "pink" );
}

tfield[0].focus();

var w = 630, h = 440; // default sizes
    if (window.screen) {w = window.screen.availWidth * 50 / 100;h = window.screen.availHeight * 100 / 100;}
    popup = window.open(searchurl,'','scrollbars=yes,left='+w+',width='+w+',height='+h);

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
var msg = event.data
if (msg === "subplz"){submit();}
if (msg !== "subplz"){
for (i = tfield.length - 1; i < tfield.length; i--){
if (tfield[i].name === 'on'){
$j(tfield[i]).val(event.data);
tfield[i].name = 'off';
tfield[i + 1].name = 'on';
dehighlight();
$j(tfield[i + 1]).css( "background-color", "pink" );
}
}
}
}

function submit(){popup.close(); $j('#submitButton')[0].click()}

$j('#submitButton')[0].onclick = function closer(){popup.close()};

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 113 ) { //F2 - 
i.preventDefault();
window.parent.postMessage("NA", '*');}
    
if ( i.keyCode == 114 ) { //F3 - 
i.preventDefault();
window.parent.postMessage("", '*');}
    
if ( i.keyCode == 115 ) { //F4 - 
i.preventDefault();
submit();}    
}
}

if (window.location.toString().indexOf('mturk.com') === -1){offsite()};

function offsite(){

function GetSelectedText () {
            if (window.getSelection) {  
                var range = window.getSelection ();                                        
                offtext = range.toString ();}}

document.addEventListener( "keydown", press, false);

function press(i) {
     if ( i.keyCode == 112 ) { //F1 - 
     i.preventDefault();
     GetSelectedText();
     window.opener.postMessage(offtext, '*');}
     
     if ( i.keyCode == 113 ) { //F2 - 
     i.preventDefault();
     window.opener.postMessage("NA", '*');}
    
    if ( i.keyCode == 114 ) { //F3 - 
     i.preventDefault();
     window.opener.postMessage("", '*');}
    
    if ( i.keyCode == 115 ) { //F4 - 
     i.preventDefault();
     window.opener.postMessage("subplz", '*');}     
}
    
     }