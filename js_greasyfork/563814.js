// ==UserScript==
// @name         Mission Rewards Book Notifier
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Notifies you of when there is a book in the mission rewards.
// @author       ScatterBean [3383329]
// @license      MIT
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563814/Mission%20Rewards%20Book%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563814/Mission%20Rewards%20Book%20Notifier.meta.js
// ==/UserScript==

var minimal_key = GM_getValue("bScriptKey", null);
if (minimal_key == null || minimal_key == "" || typeof(minimal_key) != "string") {
    try {
        const menucmd = GM_registerMenuCommand("Set API key.", function() {
            var value = prompt("Add a minimal access API key.", null);
            if (value != null && value != "") {
                GM_setValue("bScriptKey", value);
                minimal_key = GM_getValue("bScriptKey", null);
                if (minimal_key != null) {
                alert("Api key successfully saved.");
                GM_unregisterMenuCommand(menucmd);
                location.reload();
                return;
                }
                else throw minimal_key;
            }
        });
        alert("[Book Notifier Script] Missing an API Key. Open the script in the Tampermonkey extension popup to add one.");
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
    }
}
else if (minimal_key != null && minimal_key != "" && typeof(minimal_key) == "string") {
    try {
    const menuRmvCmd = GM_registerMenuCommand("Remove API key.", function() {
        GM_deleteValue("bScriptKey");
        minimal_key = null;
        GM_unregisterMenuCommand(menuRmvCmd);
        alert("[Book Notifier Script] Key successfully removed.");
        clearInterval(interval);
        location.reload();
        return;
    });
    var interval = setInterval(Tick, 30000, minimal_key);
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
        clearInterval(interval);
    }
}
async function Tick(key) {
    try {
    const check = await CheckForBook(key);
    if (check) Notify();
    else ClearNotif();
    console.log(`Pull ticked. Return: ${check}`);
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
        clearInterval(interval);
    }
}
async function CheckForBook(key) {
    try {
        if (!key) throw key;
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://api.torn.com/v2/user/missions?comment=BookNotifierScript',
        headers: {
            'authorization': `ApiKey ${key}`,
            'accept': 'application/json'
        }
    }).catch(e => console.log(e));
    const data = JSON.parse(response.responseText);
    if ("error" in data) {
        console.log(`Key: ${key}`);
        throw data;
    }
    const rewards = data.missions.rewards;
    for (var reward of rewards) {
        if (reward.details.type == "Book") return true;
    }
    return false;
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
        clearInterval(interval);
    }
}
function ClearNotif() {
    try {
    const elem = document.getElementById("bookNotif");
    if (elem) elem.remove();
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
        clearInterval(interval);
    }
}
function Notify() {
    try {
    const parent = document.querySelector(`div.tt-sidebar-information`);
    if (!parent) parent = document.querySelector(`div.content___GVtZ_`);
    const elem = document.getElementById("bookNotif");
    if (elem) return;
    const newElem = document.createElement("section");
    newElem.id = "bookNotif";
    const child = document.createElement("a");
    child.style.color = "tomato";
    child.href = "https://www.torn.com/loader.php?sid=missions";
    child.innerHTML = "Book available in mission rewards!";
    newElem.appendChild(child);
    parent.appendChild(newElem);
    } catch (e) {
        console.log(`[Book Notifier] `);
        console.log(e);
        clearInterval(interval);
    }
}