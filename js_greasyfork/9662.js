// ==UserScript==
// @name         isCapsLockEnabled.js
// @namespace    https://bitbucket.org/azuelsdorf16
// @version      1.0.0
// @date         23 February 2015
// @description  This script causes an alert message to pop up if the user types a character and caps lock is enabled.
// @author       Andrew Zuelsdorf
// @include      https://*
// @include      http://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9662/isCapsLockEnabledjs.user.js
// @updateURL https://update.greasyfork.org/scripts/9662/isCapsLockEnabledjs.meta.js
// ==/UserScript==

//For use with Chrome Developer Tools debuggin
debugger;

function isAlpha(character) {
    if (character >= String.fromCharCode(0x41) &&
        character <= String.fromCharCode(0x5A)) {
        return true;
    }
    else if (character >= String.fromCharCode(0x61) &&
        character <= String.fromCharCode(0x7A)) {
        return true;
    }
    else if (character >= String.fromCharCode(0xC0) &&
             character <= String.fromCharCode(0x2B8)) {
        return true;
    }
    else if (character >= String.fromCharCode(0x363) &&
             character <= String.fromCharCode(0x1FFF)) {
        return true;
    }
    else {
        return false;
    }
}

var continuePopupMessages = true;

document.onkeypress = function(e) {
    if (continuePopupMessages) {
        e = e || window.event;
        var s = String.fromCharCode(e.keyCode || e.which);
        if ((s.toUpperCase() === s && !e.shiftKey) || (e.shiftKey && s.toLowerCase() === s)) {
            if (isAlpha(s)) {
                continuePopupMessages = (true === confirm("Caps lock is on! Press \"Cancel\" to stop receiving this message on this page. Press \"OK\" otherwise"));
            }
        }
    }
};