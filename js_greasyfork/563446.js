// ==UserScript==
// @name         Feyorra.top Faucet 
// @namespace    Feyorra Auto Faucet Claim
// @version      0.3
// @description  Faucet Automation
// @author       Shnethan
// @match        https://feyorra.top/faucet*
// @icon         https://feyorra.top/public/assets/img/empro.ico
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/563446/Feyorratop%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563446/Feyorratop%20Faucet.meta.js
// ==/UserScript==

let c = document.getElementById('captchaBox'), b = document.querySelector('button.claim-button');
if(c && b) new MutationObserver(() => c.classList.contains('verified') && b.click()).observe(c, {attributes:1});
