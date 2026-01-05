// ==UserScript==
// @name                Hass + AHK (Safe)
// @description         Postal Code Search/Embed + Autofill - AHK included - Safe Activation
// @author              DCI
// @version             1.5   
// @include             https://www.mturkcontent.com/*
// @require             http://code.jquery.com/jquery-latest.min.js
// @namespace wutev
// @downloadURL https://update.greasyfork.org/scripts/6029/Hass%20%2B%20AHK%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6029/Hass%20%2B%20AHK%20%28Safe%29.meta.js
// ==/UserScript==

/* AHK SCRIPT - Copies highlighted text, clicks to focus parent frame, pastes into field and submits

xbutton2::
sendinput ^c
sleep 50
click 200, 200
sleep 50
sendinput {tab}
sleep 50
sendinput ^v
sleep 100
sendinput {enter}
return

*/

var textsearch = $( ":contains('restaurant below')" );

var searchString = '';
      
$('form > p > b').each(function() {
    searchString += $(this).text().trim() + ' ';
});
     
console.log(searchString); 

if (textsearch.length){
$('#Q1Url').val('N/A');}

if (textsearch.length){
var a = document.createElement('a');
}

var linkText = document.createTextNode("Bing Search");
    
a.appendChild(linkText);
a.title = "Bing Search";
a.href = "http://www.bing.com/maps/default.aspx?q=" + encodeURIComponent(searchString);
document.body.appendChild(a);

if (textsearch.length){
var iframe = document.createElement('iframe');
}

iframe.src = $('a')[0].href;
iframe.width=1000;
iframe.height=500;

$('a').eq(0).append(document.createElement('p'));
$('a').eq(0).append(iframe);

