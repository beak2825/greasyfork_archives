// ==UserScript==
//
//Displayable Name of your script 
// @name           Show info about buyer on aliexpress.com
//
// brief description
// @description    Shows buyers feedback   
//
//URI (preferably your own site, so browser can avert naming collisions
// @namespace      http://r4v.pl
//
// Your name, userscript userid link (optional)   
// @author         R4v.pl	
//
// If you want to license out
// @license        GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
//
//
//Version Number
// @version        6.9
//
// Urls process this user script on
// @include        http://aliexpress.com/item/*
// @include        https://aliexpress.com/item/*
// @include        http://*.aliexpress.com/item/*
// @include        https://*.aliexpress.com/item/*
//
// Add any library dependencies here, so they are loaded before your script is loaded.
//
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/5703/Show%20info%20about%20buyer%20on%20aliexpresscom.user.js
// @updateURL https://update.greasyfork.org/scripts/5703/Show%20info%20about%20buyer%20on%20aliexpresscom.meta.js
// ==/UserScript==
// select the target node

var addLink = function() {
$(".transaction-country").parent().parent().click(function(){
var uid = $(this).find("span").attr("data-memberid");//
window.open("http://feedback.aliexpress.com/display/detail.htm?ownerMemberId="+uid+"&memberType=buyer","_newtab");
})//td div[2] span attr
}/*
var orig;

$(function(){
     orig = getContent();
})

function watchContent() {
     var mod = getContent();
     if (mod != orig){ addLink(); }
     setTimeout(watchContent,1000)
}


function getContent() {
    return $("#transaction-list-wrap").html();
}
function start(){watchContent();}
setTimeout(start,1000)*/

// select the target node
var target = document.querySelector('#transaction-history');
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  addLink();    
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true , subtree: true,};
 
// pass in the target node, as well as the observer options
observer.observe(target, config);
 
// later, you can stop observing
//observer.disconnect();