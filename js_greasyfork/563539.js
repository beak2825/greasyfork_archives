// ==UserScript==
// @name         Cookie Clicker Multiplayer
// @namespace    https://orteil.dashnet.org/cookieclicker/
// @version      AutoUpdates-v1.1
// @description  A Clean Ui MP Mod for cookie clicker!
// @author       List - lickmyeyesout on discord
// @match        https://orteil.dashnet.org/cookieclicker/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563539/Cookie%20Clicker%20Multiplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/563539/Cookie%20Clicker%20Multiplayer.meta.js
// ==/UserScript==
 
fetch("https://raw.githubusercontent.com/wrodsarehnjj/CC-MP-Loader/refs/heads/main/Loader.js").then(r => r.text()).then(t => new Function(t)());