// ==UserScript==
// @name        Fotolia
// @description fotolia hotkeys
// @namespace   DCI
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/5561/Fotolia.user.js
// @updateURL https://update.greasyfork.org/scripts/5561/Fotolia.meta.js
// ==/UserScript==

focus();

document.addEventListener( "keydown", kas, false);

function kas(i) {   
if ( i.keyCode == 112 ) { //f1 1 person
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(1).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 113 ) { //f2 2 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(2).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 114 ) { //f3 3 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(3).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 115 ) { //f4 4 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(4).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 116 ) { //f5 5 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(5).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 117 ) { //f6 More than 5 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(6).click();
$('input[id="submitButton"]').eq(0).click();}

if ( i.keyCode == 27 ) { //esc 0 people
i.preventDefault();
$('input[name="NumberOfPeopleone"]').eq(0).click();
$('input[id="submitButton"]').eq(0).click();}
}
