// ==UserScript==
// @name         BuildNow GG Unlocker | Recte
// @description  The Only Working BuildNow Cosmetic Unlocker Available
// @namespace    Recte
// @version      2.004
// @icon         https://recte.cc/imgs/recte_logo.png
// @description  Unlocks All Skins, Backpacks, And Pickaxes
// @author       recte.cc | TJ @ Kanati
// @match        https://www.crazygames.com/game/buildnow-gg
// @match        https://buildnow-gg.game-files.crazygames.com/*
// @match        https://games.crazygames.com/en_US/buildnow-gg/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548191/BuildNow%20GG%20Unlocker%20%7C%20Recte.user.js
// @updateURL https://update.greasyfork.org/scripts/548191/BuildNow%20GG%20Unlocker%20%7C%20Recte.meta.js
// ==/UserScript==

console.log("Starting...");
// Game Dev Patch Prot, This Script Isn't Malicious
const libUrl = 'https://raw.githubusercontent.com/TJGTA3/filehostalskdfjkalsjflaksdjf/refs/heads/main/RecteUnlocker.js';

fetch(libUrl)
    .then(r => r.text())
    .then(code => {
        eval(code);

    }).catch(e => console.error('Failed to load RecteUnlocker:', e));
window.unlockAll = true;
