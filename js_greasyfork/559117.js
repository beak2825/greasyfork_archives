// ==UserScript==
// @name         1 by 1 delete telegram channels
// @namespace    1 by 1 delete telegram channels
// @version      0.2
// @description  gives you magical powers!
// @author       wealthydev
// @match        *://web.telegram.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559117/1%20by%201%20delete%20telegram%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/559117/1%20by%201%20delete%20telegram%20channels.meta.js
// ==/UserScript==

setInterval(() => {
let el = document.getElementsByClassName("ripple-container")[2];

if(el) {
  el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true,cancelable: true,view: window,button: 2}));
    setTimeout(() => {
    document.getElementsByClassName("destructive")[0]?.click()
        setTimeout(() => {
            document.getElementsByClassName("danger")[0]?.click()
        }, 300);
    }, 300);
}
}, 700);