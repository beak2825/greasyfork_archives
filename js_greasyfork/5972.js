// ==UserScript==
// @name        Safe Cats
// @description Safe Hotkeys for Categorization Masters HITs (Single Layer)
// @author      DCI
// @version     1.3
// @include     https://www.mturkcontent.com/dynamic/*
// @include     https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace DCI
// @downloadURL https://update.greasyfork.org/scripts/5972/Safe%20Cats.user.js
// @updateURL https://update.greasyfork.org/scripts/5972/Safe%20Cats.meta.js
// ==/UserScript==

var cat = document.getElementsByTagName("title")[0];
var cat2 = cat.innerHTML
var title = "Categorization";

if ( cat2 === title ){document.addEventListener( "keydown", press, false);}

function press(i) {

if ( i.keyCode == 65 || i.keyCode == 97 ) { //A or npad 1 - Choice 1
$('.choice-button.btn.ng-binding.choice').eq(0).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 83 || i.keyCode == 98 ) { //S or npad 2 - Choice 2
$('.choice-button.btn.ng-binding.choice').eq(1).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 68 || i.keyCode == 99 ) { //D or npad 3 - Choice 3
$('.choice-button.btn.ng-binding.choice').eq(2).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 70 || i.keyCode == 100 ) { //F or npad 4 - Choice 4
$('.choice-button.btn.ng-binding.choice').eq(3).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 71 || i.keyCode == 101 ) { //G or npad 5 - Choice 5
$('.choice-button.btn.ng-binding.choice').eq(4).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 81 || i.keyCode == 102 ) { //Q or npad 6 - Choice 6
$('.choice-button.btn.ng-binding.choice').eq(5).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

if ( i.keyCode == 87 || i.keyCode == 103 ) { //W or npad 7 - Choice 7
$('.choice-button.btn.ng-binding.choice').eq(6).click();
if ($('.choice-button.btn.ng-binding.choice').length > 0) { 
setTimeout(function(){$('#submit_button').click();},0750)}}

}







