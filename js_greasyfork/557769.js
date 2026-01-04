// ==UserScript==
// @name         Keepers of Neopia: Snowager Checklist
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  For Keepers of Neopia's December 2025 Monthly Challenge. Keeps track of your Snowager checklist.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/winter/snowager.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/557769/Keepers%20of%20Neopia%3A%20Snowager%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/557769/Keepers%20of%20Neopia%3A%20Snowager%20Checklist.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script was made for the guild Keepers of Neopia's December 2025 Monthly Challenge.
    It won't be useful for anyone else.
    We're frequently accepting new members! https://www.neopets.com/~Dezys_Baby

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const checklist = [
    {
        "description": "Pick up a keyring / keychain",
        "check": item => item.name.match(/keyring|keychain/i),
        "id": "key"
    },
    {
        "description": "Pick up a negg",
        "check": item => item.name.match(/Negg$/),
        "id": "negg"
    },
    {
        "description": "Pick up a plushie",
        "check": item => item.category === "Plushies",
        "id": "plushie"
    },
    {
        "description": "Pick up a scratchcard",
        "check": item => item.name.match(/Scratchcard/),
        "id": "scratch"
    },
    {
        "description": "Pick up a snowball",
        "check": item => item.name.match(/(?<!Abominable|Odd) Snowball$/),
        "id": "snow"
    },
    {
        "description": "Pick up a weapon",
        "check": item => item.category === "Battle Magic",
        "id": "weapon"
    },
    {
        "description": "Pick up an item (not listed above)",
        "id": "other"
    },
    {
        "description": "Pick up a SUPER RARE ITEM",
        "id": "rare"
    }
];

const buildChecklist = async (parent, newChecks) => {
    const progress = await GM.getValue("checklist", {});
    parent.insertAdjacentHTML("afterBegin", `${css}<h2>KoN Snowager Checklist</h2>`);
    const ul = document.createElement("ul");
    checklist.forEach(checkItem => {
        const li = document.createElement("li");
        const isDone = progress[checkItem.id];
        li.textContent = `${isDone ? '✔️' : '✖️'} ${checkItem.description}${newChecks.find(checkId => checkId === checkItem.id) ? ' ✨' : ''}`;
        ul.appendChild(li);
    });
    parent.appendChild(ul);
}

const addChecklist = newChecks => {
    const parent = document.createElement("div");
    parent.classList.add("kon-checklist");
    buildChecklist(parent, newChecks);
    document.getElementById("snowager_container").appendChild(parent);
}

const getItem = async () => {
    const itemElement = document.querySelector("#snowager_container > p b");
    if(!itemElement) return;
    const slug = itemElement
        .textContent
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
    const response = await fetch(`https://itemdb.com.br/api/v1/items/${slug}`);
    return response.json();
}

const checkItem = async () => {
    const item = await getItem();
    if(!item) return [];
    const checksPassed = [];
    checklist.forEach(possibility => {
        if(possibility.check && possibility.check(item)) checksPassed.push(possibility.id);
    });
    if(checksPassed.length === 0) checksPassed.push("other");
    if(document.querySelector("#snowager_container p").textContent.match("SUPER RARE")) checksPassed.push("rare");
    return checksPassed;
}

const updateStoredChecklist = async checksPassed => {
    const currentList = await GM.getValue("checklist", {});
    checksPassed.forEach(id => currentList[id] = true);
    GM.setValue("checklist", currentList);
}

const css = `<style>
.kon-checklist {
    margin: auto;
    width: fit-content;
}
.kon-checklist h2 {
    font-family: 'Cafeteria';
    text-align: center;
}
.kon-checklist ul {
    list-style: none;
    padding: 0;
}
div#container__2020.container.theme-bg .kon-checklist ul li {
    cursor: auto;
}
</style>`;

const searchForItem = async () => {
    if(document.queryselector('kon-checklist')) return;
    const checksPassed = await checkItem();
    if(checksPassed.length === 0) return;
    updateStoredChecklist(checksPassed);
    addChecklist(checksPassed);
}

(async function() {
    'use strict';
    const container = document.getElementById("snowager_container");
    const observer = new MutationObserver(searchForItem);
    observer.observe(container, {childList: true, subtree: true});
    addChecklist([]);
})();
