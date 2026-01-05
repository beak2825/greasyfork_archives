// ==UserScript==
// @name            Open sblocks (unseen servant)
// @version         1
// @description     If spoiler blocks are present on an unseenservant.us page, then two further buttons are overlaid on the page to show/hide all the spoilers.
// @namespace       http://www.unseenservant.us/phil285
// @include         http://www.unseenservant.us/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/5640/Open%20sblocks%20%28unseen%20servant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5640/Open%20sblocks%20%28unseen%20servant%29.meta.js
// ==/UserScript==

window.showSblocks = function () {
  var sb = document.getElementsByTagName('input');
  for (var i = 0; i < sb.length; i++){
   if (sb[i].type == 'button' && sb[i].value == 'Show') {
     sb[i].click();
}}}

window.hideSblocks = function () {
  var sb = document.getElementsByTagName('input');
  for (var i = 0; i < sb.length; i++){
   if (sb[i].type == 'button' && sb[i].value == 'Hide') {
     sb[i].click();
}}}

var sb = document.getElementsByTagName('input');
var c = 0;
for (var i = 0; i < sb.length; i++) {
   if (sb[i].type == 'button' && sb[i].value == 'Show') {
     c++;
}}

if (c > 0) {
  var zNode = document.createElement ('div');
  zNode.innerHTML = '<button id="myButton" type="button" onClick="window.showSblocks();" style="position: fixed; top: 20px; right:0px; z-index: 200;">Show sblocks</button>';
  document.body.appendChild (zNode);
  zNode = document.createElement ('div');
  zNode.innerHTML = '<button id="myButton" type="button" onClick="window.hideSblocks();" style="position: fixed; top: 50px; right:0px; z-index: 200;">Hide sblocks</button>';
  document.body.appendChild (zNode);
}
