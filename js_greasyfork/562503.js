// ==UserScript==
// @name         Fuck Asana
// @namespace    http://tampermonkey.net/
// @version      2026-01-13
// @description  Automatically reloads Asana, we are not in 1987
// @author       Angelos Bouklis
// @match        https://app.asana.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @license MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562503/Fuck%20Asana.user.js
// @updateURL https://update.greasyfork.org/scripts/562503/Fuck%20Asana.meta.js
// ==/UserScript==


window.addEventListener('load', () => {
    document.getElementById('reload-button')?.click()
})
