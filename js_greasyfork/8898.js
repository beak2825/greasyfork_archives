// ==UserScript==
// @name                Multi Hoard Deluxe 
// @namespace           DCI
// @description         Panda, Hoard, Tab Hoard, Auto Close
// @author              Chet Manley - The good parts
// @author              Cristo - The bad parts
// @author              DCI - The brilliant parts
// @version             1.4
// @grant               GM_openInTab
// @include 		    https://www.mturk.com*
// @require             http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/8898/Multi%20Hoard%20Deluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/8898/Multi%20Hoard%20Deluxe.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true); 

var HoardDelay = 0
// Hoarding delay in seconds

if (window.location.toString().indexOf("mturk/findhits") != -1 ||
    window.location.toString().indexOf("mturk/searchbar") != -1 ||
    window.location.toString().indexOf("mturk/sorthits") != -1 || 
    window.location.toString().indexOf("mturk/sortsearchbar") != -1 ||
    window.location.toString().indexOf("mturk/viewhits") != -1 ||
    window.location.toString().indexOf("mturk/preview") != -1 ||
    window.location.toString().indexOf("mturk/accept") != -1 ||
    window.location.toString().indexOf("mturk/viewsearchbar") != -1)
{
addlinks();
    }

function addlinks(){

var previewLinkEls = document.querySelectorAll('span.capsulelink a');
for (var i = 0; i < previewLinkEls.length; i++) {
    var previewLink = previewLinkEls[i].getAttribute('href');
    if (previewLink && previewLink.split('?')) {
        var previewLinkArray = previewLink.split('?');
        if (previewLinkArray[0] == '/mturk/preview') {
            var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1]; 
            var previewAndAcceptEl = document.createElement('a');
            previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
            previewAndAcceptEl.setAttribute('target', 'mturkhits');
            previewAndAcceptEl.setAttribute('style', 'padding-right: 20px;');
            previewAndAcceptEl.innerHTML = 'Accept';
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);
            var hoardLink = document.createElement("a");            
            hoardLink.setAttribute('href', previewAndAcceptLink + "&isPreviousIFrame=true&prevRequester=thclosers");
            hoardLink.setAttribute('class', 'newhb');
            hoardLink.setAttribute('style', 'padding-right: 20px;'); 
            hoardLink.setAttribute('id', 'closers');
            hoardLink.target = "_blank";
            hoardLink.innerHTML = "Closers";
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(hoardLink, parentSpan.firstChild);
            var tabs = document.createElement("a");            
            tabs.setAttribute('href', previewAndAcceptLink + "&isPreviousIFrame=true&prevRequester=thtabs");
            tabs.setAttribute('class', 'newhb');
            tabs.setAttribute('style', 'padding-right: 20px;'); 
            tabs.setAttribute('id', 'tabs');
            tabs.target = "_blank";
            tabs.innerHTML = "Tabs";
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(tabs, parentSpan.firstChild);
            var reloader = document.createElement("a");            
            reloader.setAttribute('href', previewAndAcceptLink + "&isPreviousIFrame=true&prevRequester=threloader");
            reloader.setAttribute('class', 'newhb');
            reloader.setAttribute('style', 'padding-right: 20px;'); 
            reloader.setAttribute('id', 'reloader');
            reloader.target = "_blank";
            reloader.innerHTML = "Reload";
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(reloader, parentSpan.firstChild);
        }
    }
}
}



if (window.location.toString().indexOf("thtabs") != -1 ||
    window.location.toString().indexOf("thclosers") != -1) {
    if (document.getElementsByName("autoAcceptEnabled")[0]) {
 setTimeout(function(){GM_openInTab(window.location.toString());},HoardDelay*1000);
    } else {
window.close();    	
    }
}

if (window.location.toString().indexOf("threloader") != -1) {
    if (document.getElementsByName("autoAcceptEnabled")[0]) {
 setTimeout(function(){location.reload(true);},HoardDelay*1000);
    } else {
fork();    	
    }
}
function fork(){
var decision = confirm('HITs gone. Continue reloading?');
if (decision == true) {
    var current = window.location.toString();
    var newurl = current.replace('threloader','thcontinuous');
    window.location.replace(newurl);
} else {
    window.close();
}
}

if (window.location.toString().indexOf("thcontinuous") != -1) {
 setTimeout(function(){location.reload(true);},HoardDelay*1000);
    }

if (window.location.toString().indexOf("thclosers") != -1) {
    listen();
}
function listen(){   
window.addEventListener("message", receiveMessage, false);
function receiveMessage(q){
var msg = q.data;
if (msg == "thcloseplz"){window.close()}
}
}

var submit = $j( ":contains('Loading next hit')" );
if (submit.length){
    window.parent.postMessage("thcloseplz", '*');}
