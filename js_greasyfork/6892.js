// ==UserScript==
// @name           Remove DynamicDrive Anti-copy Script for metruyen.com
// @description    Nhìn cái tên là biết
// @version        1.3
// @run-at         document-start
// @namespace       ...
// @grant          none
// @include       *.metruyen.com*
// @downloadURL https://update.greasyfork.org/scripts/6892/Remove%20DynamicDrive%20Anti-copy%20Script%20for%20metruyencom.user.js
// @updateURL https://update.greasyfork.org/scripts/6892/Remove%20DynamicDrive%20Anti-copy%20Script%20for%20metruyencom.meta.js
// ==/UserScript==

checkForBadJavascripts ( [[ false, /onselectstart/, replaceJS ]] )

function replaceJS (scriptNode) {
var scriptSrc = scriptNode.textContent;
scriptSrc.replace ("disableselect", "xoanha");
addJS_Node (scriptSrc)}

function checkForBadJavascripts (controlArray) {
if ( ! controlArray.length) return null;
checkForBadJavascripts = function (zEvent) {
for (var J = controlArray.length - 1; J >= 0; --J) {
var bSearchSrcAttr = controlArray[J][0];
var identifyingRegex = controlArray[J][1];
if (bSearchSrcAttr) {
if (identifyingRegex.test (zEvent.target.src) ) {
stopBadJavascript (J);
return false;}}
else {
if (identifyingRegex.test (zEvent.target.textContent) ) {
stopBadJavascript (J);
return false;}}}

function stopBadJavascript (controlIndex) {
zEvent.stopPropagation ();
zEvent.preventDefault ();

var callbackFunction = controlArray[J][2];
if (typeof callbackFunction == "function")
callbackFunction (zEvent.target);
zEvent.target.parentNode.removeChild (zEvent.target);
controlArray.splice (J, 1);
if ( ! controlArray.length) {
window.removeEventListener (
'beforescriptexecute', checkForBadJavascripts, true
);}}}

window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);
return checkForBadJavascripts;}

function addJS_Node (text, s_URL, funcToRun) {
var D = document;
var scriptNode = D.createElement ('script');
scriptNode.type = "text/javascript";
if (text) scriptNode.textContent = text;
if (s_URL) scriptNode.src = s_URL;
if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
targ.appendChild (scriptNode);
} 

