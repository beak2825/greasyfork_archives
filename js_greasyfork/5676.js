// ==UserScript==
// @name        Broodhollow Navigation Improvements
// @namespace   http://userscripts.org/users/scuzzball/scripts
// @description Arrow Key navigation
// @include     http://broodhollow.chainsawsuit.com/page/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5676/Broodhollow%20Navigation%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/5676/Broodhollow%20Navigation%20Improvements.meta.js
// ==/UserScript==

if(typeof document.getElementsByClassName('navi navi-next')[0].href != 'undefined'){
    var navNext = document.getElementsByClassName('navi navi-next')[0].href;
}else{
    var navNext = '';
}
if(typeof document.getElementsByClassName('navi navi-prev')[0].href != 'undefined'){
    var navPrev = document.getElementsByClassName('navi navi-prev')[0].href;
}else{
    var navPrev = '';
}


function leftArrowPressed() {
   window.location = navPrev;
}

function rightArrowPressed() {
   window.location = navNext;
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            leftArrowPressed();
            break;
        case 39:
            rightArrowPressed();
            break;
    }
};
// */