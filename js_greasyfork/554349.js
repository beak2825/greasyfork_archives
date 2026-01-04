// ==UserScript==
// @name         [Socialmediagirls] Open threads in modal
// @namespace    https://greasyfork.org/users/821661
// @version      1.0
// @description  Open threads in modal on Socialmediagirls forum
// @author       hdyzen
// @match        https://forums.socialmediagirls.com/*
// @icon         https://www.google.com/s2/favicons?domain=forums.socialmediagirls.com/&sz=64
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/554349/%5BSocialmediagirls%5D%20Open%20threads%20in%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/554349/%5BSocialmediagirls%5D%20Open%20threads%20in%20modal.meta.js
// ==/UserScript==

const threadsLinks = document.querySelectorAll("a[href^='https://forums.socialmediagirls.com/threads/']");

for (const link of threadsLinks) {
    link.setAttribute("data-xf-click", "overlay");
}
