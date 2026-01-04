// ==UserScript==
// @name         auto claim cheese
// @namespace    https://lai-0602.com
// @version      2025-11-30
// @description  try to take over the claim button in cheddar.tv!
// @author       Lai0602
// @match        https://cheddar.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cheddar.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557424/auto%20claim%20cheese.user.js
// @updateURL https://update.greasyfork.org/scripts/557424/auto%20claim%20cheese.meta.js
// ==/UserScript==

document.setInterval(() => {
    [...document.body.querySelectorAll("button")].filter(btn => btn.textContent.trim() === "Claim").forEach(btn => btn.click());
}, 500);