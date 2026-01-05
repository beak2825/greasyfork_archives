// ==UserScript==
// @name         Call the Boys for Nog
// @namespace    http://tampermonkey.net/
// @version      2025-12-12
// @description  Nogs Call the Boys Script
// @author       Wolfylein
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL3
// @match        https://www.torn.com/loader.php*
// @downloadURL https://update.greasyfork.org/scripts/558675/Call%20the%20Boys%20for%20Nog.user.js
// @updateURL https://update.greasyfork.org/scripts/558675/Call%20the%20Boys%20for%20Nog.meta.js
// ==/UserScript==

(async function() {
    await new Promise(r => setTimeout(r, 1500));
    'use strict';
    //Grab the Fight Button Window
    let buttondiv = document.getElementsByClassName("dialogButtons___nX4Bz")[0];
    let boysbutton = document.createElement("button");
    //Add the "Call the Boys" Button to the Fight Window
    boysbutton.addEventListener("click", callboys);
    boysbutton.className = "torn-btn";
    boysbutton.innerText = "Call the Boys!";
    buttondiv.appendChild(boysbutton);
    //The Function to Call the Boys
    function callboys(){
        //Grab the Faction Window
        let chatwindow = document.getElementById("faction-38097");
        let textarea = chatwindow.getElementsByClassName("textarea___V8HsV")[0];
        //Get the enemy Name
        let enemyname = document.getElementsByClassName("player___wiE8R")[1].getElementsByClassName("userName___loAWK user-name left")[0].innerText;
        //Pastes the Attack Loader Link into the Faction Chat Message Box
        let url = "BOYS, help me out against " + enemyname + " : " + window.location.href;
        textarea.focus();
        textarea.setRangeText(url, textarea.value.length, "end");
        textarea.selectionStart = textarea.selectionEnd = url.length;
        textarea.dispatchEvent(new Event("input", { bubbles: true}));
        textarea.focus();
        //Send out the Loader Link
        var audio = new Audio('https://www.wolfhaven.at/rideofthevalkyries.mp3');
        audio.play();
        //Start the Fight
        document.getElementsByClassName("dialogButtons___nX4Bz")[0].firstChild.click();
    }
})();