// ==UserScript==
// @name         GoBattle.io Sleeper Combo
// @namespace    https://greasyfork.org/users/1304712-ntrx64
// @version      1.0
// @description  Automatically performs sword-downslam combo in GoBattle.io when pressing the F key.
// @author       NTrX64
// @match        https://gobattle.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gobattle.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555641/GoBattleio%20Sleeper%20Combo.user.js
// @updateURL https://update.greasyfork.org/scripts/555641/GoBattleio%20Sleeper%20Combo.meta.js
// ==/UserScript==


const sleeper_key = "f"; //
const spam_frequency = 135 //

const textfield = document.getElementById("shinobit-textfield");

let interval_id = null;

document.addEventListener("keydown", event => {
    if (event.key === sleeper_key && !interval_id && textfield !== document.activeElement){
        sleeper();
        interval_id = setInterval(sleeper, spam_frequency);
    }
});

document.addEventListener("keyup", event => {
    if (event.key === sleeper_key && textfield !== document.activeElement){
        clearInterval(interval_id);
        interval_id = null;
    }
});

function sleeper(){
    sword(); // first sword
    setTimeout(() => {
        crouch(); // first crouch
        crouch(); // second crouch
        sword();  // final sword
    }, 135); // tiny delay after first sword
}


function sword(){
    const event = {
        "key": "v",
        "keyCode": 86,
        "code": "KeyV"
    };
    document.dispatchEvent(new KeyboardEvent("keydown", event));
    document.dispatchEvent(new KeyboardEvent("keyup", event));
}

function crouch(){
    const event = {
        "key": "s",
        "keyCode": 83,
        "code": "KeyS"
    };
    document.dispatchEvent(new KeyboardEvent("keydown", event));
    document.dispatchEvent(new KeyboardEvent("keyup", event));
}