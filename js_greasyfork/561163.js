// ==UserScript==
// @name         Secret Show Buttons
// @namespace    kupi_scripts
// @match        https://chaturbate.com/*
// @version      0.03
// @author       kupiajvr
// @description  Add secret show buttons
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561163/Secret%20Show%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/561163/Secret%20Show%20Buttons.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    GM_addStyle("dialog::backdrop { background-color: rgb(255 0 0 / 15%); } .diagB:hover { background-color: #fff; color: #f47321;}");

    var dialog = document.createElement("dialog");
    var yesButton = document.createElement("button");
    var noButton = document.createElement("button");
    yesButton.style.borderRadius = "4px";
    yesButton.style.fontSize = "20px";
    yesButton.style.position = "relative";
    yesButton.style.left = "29%";
    yesButton.classList.add("diagB");
    noButton.style.borderRadius = "4px";
    noButton.style.fontSize = "20px";
    noButton.style.position = "relative";
    noButton.style.left = "31%";
    yesButton.textContent = "Yes";
    noButton.textContent = "No";
    noButton.classList.add("diagB");
    var h2 = document.createElement("h2");
    h2.textContent = "Are you sure you wish to stop the secret show?"
    dialog.appendChild(h2);
    dialog.appendChild(yesButton);
    dialog.appendChild(noButton);
    dialog.closedBy = "any";
    dialog.style.borderRadius = "8px";

    await new Promise(r => setTimeout(r, 1000));
    var chatInput = document.querySelector("#ChatTabContainer > div.window > div:nth-child(1) > div > div.inputDiv > form > div");
    var sendButton = document.querySelector("#ChatTabContainer > div.window > div:nth-child(1) > div > div.inputDiv > div:nth-child(2) > span:nth-child(2) > button");
    //console.log("CB tab:", document.querySelector("#users-tab-default"));
    if(document.querySelectorAll("#tab-row")[1] != null){
        var chatTab = document.querySelectorAll("#tab-row")[1];
        var secretTab = document.querySelector("#users-tab-default").cloneNode(false);
        var startTab = document.querySelector("#users-tab-default").cloneNode(false);
        var stopTab = document.querySelector("#users-tab-default").cloneNode(false);
        var startSpan = startTab.appendChild(document.createElement("b")).appendChild(document.createElement("span"));
        var stopSpan = stopTab.appendChild(document.createElement("b")).appendChild(document.createElement("span"));
        var secretSpan = secretTab.appendChild(document.createElement("span"));

        secretTab.style.margin = "2px 2px 0px 50px";
        secretSpan.textContent = "SECRET SHOW:";
        startSpan.textContent = "/START";
        startSpan.style.color = "#229922FF";
        stopSpan.textContent = "/STOP";
        stopSpan.style.color = "#FF0000CC";

        chatTab.appendChild(secretTab);
        chatTab.appendChild(startTab);
        chatTab.appendChild(stopTab);

        startTab.onclick = function() {
            chatInput.textContent = "/start";
            sendButton.click();
        };
        stopTab.onclick = function() {
            document.body.appendChild(dialog);
            dialog.showModal();
        };
        yesButton.onclick = function() {
            dialog.close();
            chatInput.textContent = "/stop";
            sendButton.click();
        };
        noButton.onclick = function() {
            dialog.close();
        };
    }


    document.body.appendChild(dialog);
})();