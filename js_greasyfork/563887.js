// ==UserScript==
// @name         Pitasks Faucet
// @namespace    Pitasks Auto Faucet Claim
// @version      0.5
// @description  Faucet Automation
// @author       Shnethan
// @match        *://pitasks.com/*
// @icon         https://api.dicebear.com/7.x/avataaars/svg?seed=blackrider&backgroundColor=b6e3f4
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563887/Pitasks%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563887/Pitasks%20Faucet.meta.js
// ==/UserScript==

setInterval(() => {
    let b = document.querySelector('#claimBtn');
    if (!b) return;

    let c = document.querySelector('.cap-item.upside-down.selected');
    let a = document.querySelectorAll('.nut-link.clicked').length === 3;

    if (c && a) b.click();
}, 1000);
