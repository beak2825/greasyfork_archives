// ==UserScript==
// @name         Call the Boys but without Sound!
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Call the Boys to help with the Fight but in silence!
// @author       Wolfylein
// @match        https://www.torn.com/loader.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/558660/Call%20the%20Boys%20but%20without%20Sound%21.user.js
// @updateURL https://update.greasyfork.org/scripts/558660/Call%20the%20Boys%20but%20without%20Sound%21.meta.js
// ==/UserScript==
(async function() {
    await new Promise(r => setTimeout(r, 1500));
    'use strict';
    //Grab the Fight Button Window
    let buttondiv = document.getElementsByClassName("dialogButtons___nX4Bz")[0];
    let boysbutton = document.createElement("button");
    let titlediv = document.getElementsByClassName("titleContainer___QrlWP")[0];
    let emergencybutton = document.createElement("button");
    emergencybutton.className = "torn-btn";
    emergencybutton.innerText = "Emergency";
    emergencybutton.addEventListener("click", emergency);
    //Add the "Call the Boys" Button to the Fight Window
    boysbutton.addEventListener("click", callboys);
    boysbutton.className = "torn-btn";
    boysbutton.innerText = "Call the Boys!";
    buttondiv.appendChild(boysbutton);
    const count = 0;
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
        chatwindow.getElementsByClassName("iconWrapper___tyRRU")[0].click();
        if(count == 0){
            titlediv.appendChild(emergencybutton);
            count++;
        }

    }
    function emergency(){
        //Grab the Faction Window
        let chatwindow = document.getElementById("faction-38097");
        let textarea = chatwindow.getElementsByClassName("textarea___V8HsV")[0];
        //Get the enemy Name
        let enemyname = document.getElementsByClassName("player___wiE8R")[1].getElementsByClassName("userName___loAWK user-name left")[0].innerText;
        //Pastes the Attack Loader Link into the Faction Chat Message Box
        let url = "Help, I overestimated myself against " + enemyname + " : " + window.location.href;
        textarea.focus();
        textarea.setRangeText(url, textarea.value.length, "end");
        textarea.selectionStart = textarea.selectionEnd = url.length;
        textarea.dispatchEvent(new Event("input", { bubbles: true}));
        textarea.focus();
        //Send out the Loader Link
        chatwindow.getElementsByClassName("iconWrapper___tyRRU")[0].click();
    }
})();