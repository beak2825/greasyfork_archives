// ==UserScript==
// @name        Groupon
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @include     https://www.mturkcontent.com/dynamic*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @description Opens link in new window and moves it to the side of screen/monitor. Closes the new window when you submit the hit.
// @namespace https://greasyfork.org/users/7067
// @downloadURL https://update.greasyfork.org/scripts/6586/Groupon.user.js
// @updateURL https://update.greasyfork.org/scripts/6586/Groupon.meta.js
// ==/UserScript==

$('.panel.panel-primary').hide();

var TargetLink = $('a').eq(1).attr('href');
var w = screen.availWidth/2;
var h = screen.availHeight;
var myWindow = window.open(TargetLink, 'width='+w+', height='+h+', scrollbars=yes, toolbar=yes');
myWindow.moveTo(640,0);
myWindow.blur();
self.focus();
$('#mturk_form').submit(function(evt){
myWindow.close();
});


document.addEventListener( "keydown", kas, false);

function kas(i) {
     if ( i.keyCode == 97 ) { // 1
     $('input[type="radio"]').eq(0).attr("checked",true);
     $('input[id="submitButton"]').eq(0).click();
         }    
     if ( i.keyCode == 98 ) { // 2
     $('input[type="radio"]').eq(1).attr("checked",true);
     $('input[id="submitButton"]').eq(0).click();         
     }
}