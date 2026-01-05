// ==UserScript==
// @name       jawz Bryce
// @version    1.1
// @description Bryce
// @match      https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8648/jawz%20Bryce.user.js
// @updateURL https://update.greasyfork.org/scripts/8648/jawz%20Bryce.meta.js
// ==/UserScript==

var content = document.body.textContent || document.body.innerText;
var hasText = content.indexOf("Given the name and URL of a business, find some information about it")!==-1;
if(hasText){
    var elink = document.links
    elink = elink[17].href
    console.log(elink);
    
    var halfScreen = (screen.width/2)-10; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(elink,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (halfScreen) + ',top=0' + specs,false);
    
    //$( 'select[name="Answer_3"]').val("Selection_dHJ1ZQ--");
    $( 'select[name="Answer_2"]').val("Selection_dHJ1ZQ--");
    $( 'select[name="Answer_3"]').val("Selection_ZmFsc2U-");
    $( 'select[name="Answer_4"]').val("Selection_ZmFsc2U-");
    $( 'select[name="Answer_5"]').val("Selection_ZmFsc2U-");
    
}