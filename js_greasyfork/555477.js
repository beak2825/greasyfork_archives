// ==UserScript==
// @name         Plunder Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds how much extra earned from plunder mugs
// @author       Grok
// @match        *www.torn.com/loader.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555477/Plunder%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/555477/Plunder%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enhanceLogs() {
        const lis = document.querySelectorAll('li.tt-modified');
        for (let i = 0; i < lis.length - 1; i++) {
            const currentLi = lis[i];
            const nextLi = lis[i + 1];
            const mugIcon = currentLi.querySelector('.attacking-events-mug');
            const plunderIcon = nextLi.querySelector('.attacking-events-plunder');
            if (!mugIcon || !plunderIcon) continue;
            const time1 = currentLi.querySelector('.time').textContent.trim();
            const time2 = nextLi.querySelector('.time').textContent.trim();
            if (time1 !== time2) continue;
            const mugMsg = currentLi.querySelector('.message b');
            if (!mugMsg) continue;
            const amountMatch = mugMsg.textContent.match(/\$([\d,]+)/);
            if (!amountMatch) continue;
            const amountStr = amountMatch[1];
            const amount = parseInt(amountStr.replace(/,/g, ''), 10);
            if (isNaN(amount)) continue;
            const plunderMsgSpan = nextLi.querySelector('.message');
            if (!plunderMsgSpan) continue;
            const percMatch = plunderMsgSpan.textContent.match(/by ([\d.]+)%/);
            if (!percMatch) continue;
            const perc = parseFloat(percMatch[1]);
            if (isNaN(perc)) continue;
            const extra = Math.round(amount * (perc / 100));
            const extraStr = '+$' + extra.toLocaleString();
            plunderMsgSpan.innerHTML += ` (${extraStr})`;
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceLogs);
    } else {
        enhanceLogs();
    }
})();