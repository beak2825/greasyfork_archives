// ==UserScript==
// @name         Call the Boys for Doom's Guest
// @namespace    http://tampermonkey.net/
// @version      2025-12-12
// @description  Call the Boys Script for Doom
// @author       Wolfylein
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL3
// @match        https://www.torn.com/loader.php*
// @downloadURL https://update.greasyfork.org/scripts/558677/Call%20the%20Boys%20for%20Doom%27s%20Guest.user.js
// @updateURL https://update.greasyfork.org/scripts/558677/Call%20the%20Boys%20for%20Doom%27s%20Guest.meta.js
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
        let chatwindow = document.getElementById("faction-51053");
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
        //Start the Fight
        document.getElementsByClassName("dialogButtons___nX4Bz")[0].firstChild.click();
    }
})();