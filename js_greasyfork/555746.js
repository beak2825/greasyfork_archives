// ==UserScript==
// @name         norg space to advance
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  useful keybinds for nestris puzzles
// @author       tyow
// @match        nestris.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nestris.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555746/norg%20space%20to%20advance.user.js
// @updateURL https://update.greasyfork.org/scripts/555746/norg%20space%20to%20advance.meta.js
// ==/UserScript==

// add "//" to beginning of line 17 and remoe from line 18 to get the keybind to equal "a/A"

let retryKey = null
// let retryKey = "KeyA"

const RETRY = 1;
const NEXT = 2;


const click = (loc) => {

    let b = document.querySelectorAll(".new-puzzle-button");
    if (b) {
        b = b[loc]
        let child = b.childNodes[0]
        child.click()
    }
}

document.addEventListener('keydown', (e) => {
    if (window.location.pathname !== "/online/puzzle") return;

    if (retryKey != null && e.code == retryKey) {
        click(RETRY)
    }

    if (e.code == "Space") {
        click(e.shiftKey ? RETRY : NEXT)
    }
});