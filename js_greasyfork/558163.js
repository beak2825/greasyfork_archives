// ==UserScript==
// @name         Bonk win changer
// @namespace    http://tampermonkey.net/
// @version      01
// @description  you can change the win system the text of win
// @author       emiya440
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTQ0OTA0LCJwdXIiOiJibG9iX2lkIn19--c6b29b5a8bb41bba2de56956509004effc0a642d/image.png?locale=fr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558163/Bonk%20win%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/558163/Bonk%20win%20changer.meta.js
// ==/UserScript==
const button = document.createElement("button");
button.id = "injector";
button.innerHTML = "Inject (when the game start)";
button.title = "not injected";
button.onclick = Inject;
button.style.position = "absolute";
button.style.left = "10px";
button.style.top = "10px";
document.body.appendChild(button);
const inpute = document.createElement("input");
inpute.id = "code";
inpute.type = "text";
inpute.value = "Gg";
inpute.style.position = "absolute";
inpute.style.right = "10px";
inpute.style.top = "10px";
document.body.appendChild(inpute);
function Inject() {
    button.textContent = "Wait...";
    button.title = "injected";

    const winshow = document.querySelector("#ingamewinner");
    if (winshow) {
        button.textContent = "Injected! (don't inject two times)";
        const intervalId = setInterval(() => {
            const targetNode = winshow.childNodes[5];
            if (targetNode) {
                targetNode.textContent = inpute.value;
            } else {
                console.log("Element not found. Stopping interval.");
                clearInterval(intervalId);
            }
        }, 30);
    } else {
        button.textContent = "No injected >:[";
    }
}