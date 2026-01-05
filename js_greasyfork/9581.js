// ==UserScript==
// @name        Bar Code Iframe
// @namespace   http://redpandanetwork.org/
// @description F1=paste highlighted product name and url F3=not found F4=submit
// @version     1.0
// @include     *
// @require     http://code.jquery.com/jquery-latest.min.js
// @icon        http://i.imgur.com/o9AcjiE.jpg
// @downloadURL https://update.greasyfork.org/scripts/9581/Bar%20Code%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/9581/Bar%20Code%20Iframe.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

if (window.location.toString().indexOf('mturk/preview') !== -1 
|| window.location.toString().indexOf('mturk/accept') !== -1
|| window.location.toString().indexOf('mturk/submit') !== -1
|| window.location.toString().indexOf('mturk/continue') !== -1
|| window.location.toString().indexOf('mturk/return') !== -1
|| window.location.toString().indexOf('Documents/vsr.htm') !== -1
){hit()};

function hit(){

var upc = document.getElementsByTagName('h3')[1].innerHTML;

var searchString = upc.replace('Product barcode value: ','');

var iframe = document.createElement('iframe');
iframe.src = "http://www.google.com/custom?q=" + searchString + " upc";
$j(iframe).css('width', '100%');
$j(iframe).css('height', '500px');
$j(iframe).css('margin', '0');
$j(iframe).css('display', 'block');
$j('#hit-wrapper').append(iframe);

function submit(){$j('input[name="/submit"]').eq(0).click();}
    
function notfound(){$j('#Answer_3')[0].checked=true;}

var field1 = $j('input[type="text"]')[2];
var field2 = $j('input[type="text"]')[3];

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
var msg = event.data
if (msg === "subplz"){submit();}
if (msg === "notfound"){notfound();}
if (msg.indexOf("http") !== -1){$j(field2).val(event.data);} 
if (msg !== "subplz" && msg !== "notfound" && msg.indexOf("http") === -1){$j(field1).val(event.data);}
}

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 113 ) { //F3 - 
i.preventDefault();
notfound();}
    
    
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
     window.parent.postMessage(offtext, '*');
     window.parent.postMessage(window.location.toString(), '*');}
          
     if ( i.keyCode == 114 ) { //F3 - 
     i.preventDefault();
     window.parent.postMessage("notfound", '*');}
        
    if ( i.keyCode == 115 ) { //F4 - 
     i.preventDefault();
     window.parent.postMessage("subplz", '*');}     
}
    
     }