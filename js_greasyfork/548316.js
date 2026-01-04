// ==UserScript==
// @name         Neopets: Godori Pop-Ups Begone
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @description  Blocks the pop-up alerts in Godori
// @match       https://www.neopets.com/games/godori/*
// @exclude     https://www.neopets.com/games/godori/index.phtml
// @version     1.0.0
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/548316/Neopets%3A%20Godori%20Pop-Ups%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/548316/Neopets%3A%20Godori%20Pop-Ups%20Begone.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:
.......................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script removes every single pop-up in Godori.
    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
......................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•
*/

/**
* Moves the Godori help text to a <details> element so it can be collapsed
*/
const detailize = () => {
    const title = document.querySelector(".content p");
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    details.appendChild(summary);
    summary.appendChild(title.children[0]);
    let children = [...title.parentElement.childNodes];
    const cutAt = children.findIndex(child => child.tagName === "CENTER");
    children.splice(0, cutAt).forEach(child => details.appendChild(child));
    children[0].insertAdjacentElement("beforeBegin", details);
}

/**
* Adds the "_ plays first!" message to the log
* @param log {Element} the <details> element that serves as our log
*/
const addPlaysFirst = (log) => {
    if(!saahphireGodoriAlert) return;
    const p = document.createElement("p");
    p.textContent = saahphireGodoriAlert;
    document.getElementById("saahphire-godori-log").appendChild(p);
}

/**
* Creates the <details> element that will serve as a log
*/
const createLog = () => {
    const log = document.createElement("details");
    const summary = document.createElement("summary");
    log.appendChild(summary);
    summary.textContent = "Log";
    log.id = "saahphire-godori-log";
    document.getElementsByTagName("details")[0].insertAdjacentElement("afterEnd", log);
    addPlaysFirst(log);
}

/**
* Adds both <details> elements to the DOM and changes the behavior of window.alert
* @param script {Element} the <script> element
*/
const initialize = (script) => {
    detailize();
    createLog();
    script.textContent = `window.alert = (alert) => {
    const p = document.createElement("p");
    p.textContent = alert;
    document.getElementById("saahphire-godori-log").appendChild(p);
    };
    window.confirm = () => true`;
}

/**
* Creates a <script> element changing the behavior of window.alert and window.confirm so they no longer create popups
* @returns {Element} the <script> element
*/
const addScriptElement = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `let saahphireGodoriAlert; window.alert = (alert) => {saahphireGodoriAlert = alert}; window.confirm = () => true`;
    const parent = document.getElementsByTagName("head")[0] ?? document.body ?? document.documentElement;
    parent.appendChild(script);
    return script;
}

(function() {
    const script = addScriptElement();
    document.addEventListener("DOMContentLoaded", () => initialize(script));
})();
