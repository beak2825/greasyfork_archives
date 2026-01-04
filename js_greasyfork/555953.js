// ==UserScript==
// @name         REMOVER ANUNCIOS HABBLET
// @namespace    ViolentMonkey
// @version      1.3
// @description  REMOVER ANUNCIOS AUTOMATICAMENTE
// @author       CosColor???
// @match        https://www.habblet.city/hotel*
// @grant        none
// @icon         https://images.habblet.city/habblet-web/assets/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555953/REMOVER%20ANUNCIOS%20HABBLET.user.js
// @updateURL https://update.greasyfork.org/scripts/555953/REMOVER%20ANUNCIOS%20HABBLET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds() {
        const divs = document.querySelectorAll('div[id], div[class]');
        let removedCount = 0;

        divs.forEach(div => {
            const text = div.textContent?.toLowerCase() || '';
            const divId = div.id || '';
            const divClass = div.className || '';
            const closeLink = div.querySelector('a[onclick*="closeAd"]');

            const isAd =
                text.includes('os anúncios fecharão em') ||
                text.includes('adtimer') ||
                (closeLink && closeLink.innerText.trim() === 'x') ||
                (/top|bottom|inverted/.test(divClass) && divId.length > 20);

            if (isAd) {
                div.remove();
                removedCount++;
            }
        });

        if (removedCount > 0) console.log(`🧹 ${removedCount} ad(s) removed.`);
    }

    let timeout;
    const observer = new MutationObserver(() => {
        if (!timeout) {
            timeout = setTimeout(() => {
                removeAds();
                timeout = null;
            }, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(removeAds, 1000);
})();
