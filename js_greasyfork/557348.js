// ==UserScript==
// @name         AliExpress Same Tab plus Link Copier
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Prevent AliExpress from opening new tabs and add a link copy UI
// @match        https://www.aliexpress.com/*
// @match        https://*.aliexpress.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557348/AliExpress%20Same%20Tab%20plus%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/557348/AliExpress%20Same%20Tab%20plus%20Link%20Copier.meta.js
// ==/UserScript==

(function() {

    /* Force same tab navigation */
    function fixLinks() {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(a => {
            a.removeAttribute('target');
            a.addEventListener('click', e => {
                e.stopPropagation();
            }, true);
        });
    }

    new MutationObserver(fixLinks).observe(document.body, { childList: true, subtree: true });
    fixLinks();

    function isProductPage() {
        const url = window.location.href;
        return url.includes('/item/') || url.includes('/p/');
    }

    function getProductLink() {
        return window.location.href.split('?')[0];
    }

    function createUI() {
        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.bottom = '20px';
        box.style.right = '20px';
        box.style.background = 'white';
        box.style.padding = '14px';
        box.style.borderRadius = '10px';
        box.style.border = '1px solid #ddd';
        box.style.zIndex = '999999';
        box.style.fontFamily = 'Arial, sans-serif';
        box.style.fontSize = '14px';
        box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        box.style.transition = 'opacity 0.2s';

        const label = document.createElement('div');
        label.textContent = 'AliExpress Link';
        label.style.marginBottom = '10px';
        label.style.fontWeight = '600';
        box.appendChild(label);

        const btn = document.createElement('button');
        btn.textContent = 'Copy Link';
        btn.style.padding = '8px 14px';
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.background = '#ff4747';
        btn.style.color = 'white';
        btn.style.fontSize = '14px';
        btn.style.transition = 'background 0.2s';

        if (!isProductPage()) {
            btn.disabled = true;
            btn.style.background = '#999';
            btn.textContent = 'Not a product page';
        }

        btn.addEventListener('click', () => {
            GM_setClipboard(getProductLink());
            const old = btn.textContent;
            btn.textContent = 'Copied';
            btn.style.background = '#2ecc71';

            setTimeout(() => {
                btn.textContent = old;
                btn.style.background = '#ff4747';
            }, 1200);
        });

        box.appendChild(btn);
        document.body.appendChild(box);
    }

    createUI();

})();
