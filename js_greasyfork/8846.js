// ==UserScript==
// @name                Search - new layout TURBO!!!
// @author              DCI/Chet Manley
// @version             0.1
// @namespace           DCI
// @description         Launches Google search. F1 to paste into highlighted fields and also to submit.
// @include             *
// @require             http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/8846/Search%20-%20new%20layout%20TURBO%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/8846/Search%20-%20new%20layout%20TURBO%21%21%21.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

//var textsearch = $j( ":contains('xxxxxxxx')" );
//if (textsearch.length){runscript()}
if (window.location.toString().indexOf('mturkcontent' || 'amazonaws') != -1){runscript()};

function runscript(){
     
    var searchString = '';
     
    $j('#mturk_form > section > div > table > tbody > tr > td:nth-child(2)').each(function() {
        searchString += $(this).text().trim() + ' ';
    });
    
    var w = 630, h = 440; // default sizes
    if (window.screen) {
        w = window.screen.availWidth * 50 / 100;
        h = window.screen.availHeight * 100 / 100;
    }

    popup = window.open("https://encrypted.google.com/search?q=" + encodeURIComponent(searchString),'','scrollbars=yes,left='+w+',width='+w+',height='+h);

     
    $('input[type="text"]').first().focus();
    
    $j('#submitButton')[0].onclick = function closer(){popup.close()};

var field1 = $j('input[type="text"]').eq(0);
var field2 = $j('input[type="text"]').eq(1);
var field3 = $j('input[type="text"]').eq(2);
var field4 = $j('input[type="text"]').eq(3);
var field5 = $j('input[type="text"]').eq(4);
var field6 = $j('input[type="text"]').eq(5);
var field7 = $j('input[type="text"]').eq(6);
var field8 = $j('input[type="text"]').eq(7);

function done(){popup.close();}

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 112 ) { //F1 - 
i.preventDefault();
$j('#submitButton').click();
}}


$j(field1).css( "background-color", "red" );

window.addEventListener("message", receiveMessage1, false);
function receiveMessage1(event){
if (field1.length){
field1.val(event.data);
window.removeEventListener("message", receiveMessage1, false);
$j(field1).css( "background-color", "" );
$j(field2).css( "background-color", "red" );
window.addEventListener("message", receiveMessage2, false);
receiveMessage2();} else {done();}}

function receiveMessage2(event){
if (field2.length){
field2.val(event.data);
window.removeEventListener("message", receiveMessage2, false);
$j(field2).css( "background-color", "" );
$j(field3).css( "background-color", "red" );
window.addEventListener("message", receiveMessage3, false);
receiveMessage3();} else {done();}}

function receiveMessage3(event){
if (field3.length){
field3.val(event.data);
window.removeEventListener("message", receiveMessage3, false);
$j(field3).css( "background-color", "" );
window.addEventListener("message", receiveMessage4, false);
$j(field4).css( "background-color", "red" );
receiveMessage4();} else {done();}}

function receiveMessage4(event){
if (field4.length){
field4.val(event.data);
window.removeEventListener("message", receiveMessage4, false);
$j(field4).css( "background-color", "" );
window.addEventListener("message", receiveMessage5, false);
$j(field5).css( "background-color", "red" );
receiveMessage5();}else {done();}}

function receiveMessage5(event){
if (field5.length){
field5.val(event.data);
window.removeEventListener("message", receiveMessage5, false);
$j(field5).css( "background-color", "" );
window.addEventListener("message", receiveMessage6, false);
$j(field6).css( "background-color", "red" );
receiveMessage6();} else {done();}}

function receiveMessage6(event){
if (field6.length){
field6.val(event.data);
window.removeEventListener("message", receiveMessage6, false);
$j(field6).css( "background-color", "" );
window.addEventListener("message", receiveMessage7, false);
$j(field7).css( "background-color", "red" );
receiveMessage7();} else {done();}}

function receiveMessage7(event){
if (field7.length){
field7.val(event.data);
window.removeEventListener("message", receiveMessage7, false);
$j(field7).css( "background-color", "" );
window.addEventListener("message", receiveMessage8, false);
$j(field8).css( "background-color", "red" );
receiveMessage8();} else {done();}}

function receiveMessage8(event){
if (field8.length){
field8.val(event.data);
window.removeEventListener("message", receiveMessage8, false);
$j(field8).css( "background-color", "" );} else {done();}}


//$j('input[type="text"]').last().change(function(){
//popup.close()});*/
    
}

if (window.location.toString().indexOf('mturk') == -1){offsite()};

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
     window.opener.postMessage(offtext, '*');}}
     
}     