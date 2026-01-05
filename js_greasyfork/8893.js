// ==UserScript==
// @name        snap
// @namespace   tampacigargirl
// @include     https://snap.groupon.com/*
// @version     1.1
// @grant       none
// @description Layout, Keyboard Shortcuts
// @downloadURL https://update.greasyfork.org/scripts/8893/snap.user.js
// @updateURL https://update.greasyfork.org/scripts/8893/snap.meta.js
// ==/UserScript==

//Focus first dropdown box.  Disabled since rotate keyboard shortcut does not work if focus is a dropdown box. Enable if reading sideways
//does not give you a headache. 
//$(document).ready(function () {
//  $('form:first *:input[type!=hidden]:first').focus();
//});

//Resize columns. col-md-4 image column, col-md-8 right column containing 2 text sub columns
$('.col-md-4').attr('style', 'width: 50%;');
$('.col-md-8').attr('style', 'width: 50%;');
//Resize check Columns
$('.col-lg-4').attr('style', 'width: 50%;');
$('.col-lg-8').attr('style', 'width: 50%;');

//$('.mobile-wrapper').attr('style', 'width: 100%;')
//$('.main_container').attr('style', 'width: 100%;')
//Resize columns. col-md-4 image column, col-md-8 right column containing 2 text sub columns
//$('.col-lg-4').attr('style', 'width: 45%;')
//$('.col-lg-8').attr('style', 'width: 55%;')
//$('.mobile-wrapper').attr('style', 'width: 100%;')
//$('.main_container').attr('style', 'width: 100%;')
//ref radiobutton select
//$("input[value='6']").click();

//assign keyboard shortcut to all instances of a radio button, ie accept, reject: date not visible
document.onkeydown = showkeycode;

function showkeycode(evt){
        var keycode = evt.keyCode;
        switch (keycode) {
            case 82: //r
           $("input[value='6']").click();    
            //reject: invalid date range 
                break;
            case 78: //n
            document.getElementById('regular-submit-button').click();
           //$document.getElementById("regular-submit-button").click();  
            //reject: invalid date range 
                break;
            case 86: //v
           $("input[value='7']").click();    
            //reject: selected offer not present in receipt 
                break;
            case 84: //t
            $("input[value='11']").click();    
            //reject: date not visible
                break;
            case 66: //b
            $(document).ready(function () {
            $('form:first *:input[type!=hidden]:first').focus();
            });  
            //reject: incomplete receipt
                break;
            default:
                //what it does if you don't match any other keycode
                break;
         }
}

var imagy = document.getElementsByClassName("receipt-image")[0];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[1];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[2];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[3];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[4];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[5];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[6];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[7];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[8];
imagy.style.height = 'auto';
imagy.style.width = '100%';

var imagy = document.getElementsByClassName("receipt-image")[9];
imagy.style.height = 'auto';
imagy.style.width = '100%';


