// ==UserScript==
// @name         Twinhead Extract Pins
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPLv3
// @description  Adds a button to turn Twinhead map pins into TomTom coordinates
// @author       xdpirate
// @match        https://vanilla-twinhead.twinstar.cz/?*
// @match        https://tbc-twinhead.twinstar.cz/?*
// @match        https://wotlk-twinhead.twinstar.cz/?*
// @match        https://cata-twinhead.twinstar.cz/?*
// @match        https://mop-twinhead.twinstar.cz/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cata-twinhead.twinstar.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551920/Twinhead%20Extract%20Pins.user.js
// @updateURL https://update.greasyfork.org/scripts/551920/Twinhead%20Extract%20Pins.meta.js
// ==/UserScript==

let btn = document.querySelector("div.button.wowhead");
let btnClone = btn.cloneNode(true);
let cloneLink = btnClone.querySelector("a");
cloneLink.innerText = "Extract pins";
cloneLink.removeAttribute("href");
cloneLink.addEventListener("click", function() {
    let name = document.querySelector("div#main-contents > div.text > h1").innerText;
    let map = document.querySelector(`div#mapper-generic div > a[href^="/?zone"]`).innerText;
    let pins = document.querySelectorAll("div.pin");
    let waypoints = "";

    for(let i = 0; i < pins.length; i++) {
        let coords = pins[i].getAttribute("style").match(/left\: ([0-9][0-9]?\.?[0-9]?)[0-9]?%; top\: ([0-9][0-9]?\.?[0-9]?)[0-9]?%;/i);
        if(coords) {
            waypoints += `/way ${map} ${coords[1]} ${coords[2]} ${name}\n`;
        }
    }

    let macroArea = document.querySelector("#extractPinsMacroArea");
    if(!macroArea) {
        macroArea = document.createElement("textarea");
        macroArea.id = "extractPinsMacroArea";
        macroArea.style.width = "500px";
        macroArea.style.height = "250px";
        let refNode = document.querySelectorAll("div.clear")[2];
        refNode.after(macroArea);
    }
    macroArea.innerHTML = waypoints;
});

btn.insertAdjacentElement("beforebegin", btnClone);