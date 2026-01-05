// ==UserScript==
// @name         9gag 3Min Remover
// @namespace    http://www.diamonddownload.weebly.com
// @version      1.1
// @description Removes the 9gag 3Min message
// @author      RF Geraci
// @include     http://9gag.com/*
// @include     http://9gag.com
// @include     https://9gag.com/*
// @include     https://9gag.com
// @grant        none
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/8658/9gag%203Min%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/8658/9gag%203Min%20Remover.meta.js
// ==/UserScript==

var darkOverlay = document.getElementById('overlay-container');
var min3 = document.getElementById('jsid-idle-popup-container');

function log(msg){
    console.log("9gag 3min Remover - [" + msg + "]");
}

function min3Hide(){

    if (min3){
       min3.parentNode.removeChild(min3);
        log("Removed '" + min3.id + "'");
       darkOverlay.style.backgroundColor="rgba(0,0,0,0)";
        log("Backgound set transparent on " + darkOverlay.id);
    }

}

min3Hide();


