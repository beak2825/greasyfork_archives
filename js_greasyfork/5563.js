// ==UserScript==
// @name           JS Adblock - Firefox only
// @description    Remove Pop-ups/In-video ads/Banner background : blogtruyen|vnsharing|hayhaytv|forum.bkav.com.vn|24h
// @version        1.724
// @run-at         document-start
// @namespace       ...
// @include        /^http:\/\/(blogtruyen\.com|vnsharing\.net|(www|jj)\.hayhaytv\.vn|vozforums\.com|forum\.bkav\.com\.vn)|24h\.com\.vn/
// @downloadURL https://update.greasyfork.org/scripts/5563/JS%20Adblock%20-%20Firefox%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/5563/JS%20Adblock%20-%20Firefox%20only.meta.js
// ==/UserScript==

var hostname = location.hostname;
var fuck = 0;
switch(hostname) {
case "www.hayhaytv.vn":
fuck = 1;
checkForBadJavascripts ( [[ false, /vod\/info/, replaceJS ]] );
break;
case "blogtruyen.com":
fuck = 3;
checkForBadJavascripts ( [[ false, /popunder/, replaceJS ]] );
break;
case "vnsharing.net":
fuck = 4;
checkForBadJavascripts ( [[ false, /btpop/, replaceJS ]] );
break;    
case "forum.bkav.com.vn":
fuck = 5;
checkForBadJavascripts ( [[ false, /jQuery\(document\)\.ready/, replaceJS ]] );        
break;
default:
break;
}

function replaceJS (scriptNode) {
var scriptSrc = scriptNode.textContent;
switch(fuck) {
case 1: scriptSrc = scriptSrc.replace ("vod", "shit"); break;
case 3: scriptSrc = scriptSrc.replace ("pop", "shit"); break;
case 4: scriptSrc = scriptSrc.replace ("pop", "shit"); break;
case 5: scriptSrc = scriptSrc.replace ("doc", "shit"); break;
default: break;
}
addJS_Node (scriptSrc)
} 

function checkForBadJavascripts (controlArray) {
if ( ! controlArray.length) return null;
checkForBadJavascripts = function (zEvent) {
for (var J = controlArray.length - 1; J >= 0; --J) {
var bSearchSrcAttr = controlArray[J][0];
var identifyingRegex = controlArray[J][1];
if (bSearchSrcAttr) {
if (identifyingRegex.test (zEvent.target.src) ) {
stopBadJavascript (J);
return false;
}
}
else {
if (identifyingRegex.test (zEvent.target.textContent) ) {
stopBadJavascript (J);
return false;
}
}
}

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
);
}
}
}

window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);

return checkForBadJavascripts;
}

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

/* Kéo dài alt2 cho vOz */
addGlobalStyle('@-moz-document domain(vozforums.com) {[style*=wrap] > STRONG {margin-right:100px}}');

/* Autohide thanh trên cùng hh */
addGlobalStyle('@-moz-document domain(hayhaytv.vn) {.header:not(:hover){opacity:0;margin-top:-100px;transition:0.4s}}');

/ * Gỡ bỏ banner dạng background 24h */
addGlobalStyle('@-moz-document domain(24h.com.vn) { body {background:none !important}}');

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


