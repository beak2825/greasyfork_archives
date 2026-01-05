// ==UserScript==
// @name         Gmail Outdated Notification Disabler
// @namespace    http://your.homepage/
// @version      0.04
// @description  Disables the "your browser is no longer supported" notification from gmail
// @author       Domination9987
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8840/Gmail%20Outdated%20Notification%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/8840/Gmail%20Outdated%20Notification%20Disabler.meta.js
// ==/UserScript==

var dismissBtn;                                                           //Button that is pressed if exists
var timeOut = 0;                                                          //Initially zero
var timeOutLimit = 10000;                                                 //How long the loop will run before ending, in ms
var interval = 100;                                                       //How often the checking is performed, in ms
var checkExists = setInterval(checkIfExists, interval);                   //Constant call to check if the element exists

function checkIfExists(){
    dismissBtn = document.getElementById("link_ds");
    if (dismissBtn !== null){
        dismissBtn.click();
        clearInterval(checkExists);
    }
    if (timeOut >= timeOutLimit){
        clearInterval(checkExists);
    }
    timeOut += interval;
}