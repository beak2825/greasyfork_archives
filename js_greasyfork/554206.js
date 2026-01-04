// ==UserScript==
// @name         Cizgidiyari: Seçili Linkleri Kopyala ve Aç
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Copies all links from the selected portion and opens them in separate tabs using GM_openInTab
// @author       You
// @match        https://www.cizgidiyari.com/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554206/Cizgidiyari%3A%20Se%C3%A7ili%20Linkleri%20Kopyala%20ve%20A%C3%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/554206/Cizgidiyari%3A%20Se%C3%A7ili%20Linkleri%20Kopyala%20ve%20A%C3%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCopyAndOpenButton() {
        const originalButton = document.querySelector('button');
        if (!originalButton) {
            setTimeout(createCopyAndOpenButton, 500);
            return;
        }

        const button = document.createElement('button');
        button.textContent = 'Linkleri Aç';
        button.style.position = 'fixed';
        button.style.top = `${originalButton.getBoundingClientRect().bottom + 50}px`;
        button.style.right = '10px';
        button.style.zIndex = 9999;
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

        button.addEventListener('click', () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                alert('Lütfen kopyalamak ve açmak için bir bölge seçin.');
                return;
            }

            const range = selection.getRangeAt(0);
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());

            const links = Array.from(container.querySelectorAll('a[href]'))
                .map(a => a.href);

            if (links.length === 0) {
                alert('Seçimde link bulunamadı.');
                return;
            }

            // Copy all links
            GM_setClipboard(links.join('\n'));

            // Open all links using GM_openInTab
            links.forEach(url => {
                GM_openInTab(url, { active: false, insert: true });
            });

            alert(`${links.length} link kopyalandı ve yeni sekmelerde açıldı!`);
        });

        document.body.appendChild(button);
    }

    createCopyAndOpenButton();
})();
