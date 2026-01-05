// ==UserScript==
// @name        Shartak Treasure Map Safety
// @namespace   http://userscripts.org/users/125692
// @description Default action for Non-active Treasure Maps set to identify
// @include     http://www.shartak.com/game.cgi
// @include     http://shartak.com/game.cgi
// @include     https://shartak.com/game.cgi
// @include     https://www.shartak.com/game.cgi
// @version     1
// @run-at document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8602/Shartak%20Treasure%20Map%20Safety.user.js
// @updateURL https://update.greasyfork.org/scripts/8602/Shartak%20Treasure%20Map%20Safety.meta.js
// ==/UserScript==
(function() {
  
function addNamedGlobalStyle(css,idname) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.id=idname;
	style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}  
  
//first we make maps unclickable with css injecting style early.
//nodot inventory
//this one is named so can be toggled.
addNamedGlobalStyle("ul.inventory{display:none!important;}","hideinventory");
//then we wait till dom ready then alter then reset css  
  
//set eventlistener for when page has maps ready for altering.  
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

function DOM_ContentReady () {
   var treasuremaps=document.evaluate( "//input[starts-with(@value,'2Y(')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   if(treasuremaps.snapshotLength>0){//we have at least one activated map
      for(var i=0,j=0;j=treasuremaps.snapshotItem(i);i++){
         j.parentNode.firstElementChild.selectedIndex=1;
      }
   }
   document.getElementById('hideinventory').disabled=true;
}
  
  
//EOF
})();