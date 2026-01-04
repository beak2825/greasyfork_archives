// ==UserScript==
// @name         Zorrov_Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Open mockup from JSON even if title is truncated
// @author       Zorrov
// @match        https://zorrov.com/admin/customproduct/*/show
// @grant        GM_xmlhttpRequest
// @connect      alievomar7729.github.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559500/Zorrov_Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559500/Zorrov_Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const JSON_URL = 'https://alievomar7729.github.io/zorrov.github.io/macket.json';

    const interval = setInterval(() => {
        const headerDiv = document.querySelector('div.box-header');
        if (!headerDiv) return;

        clearInterval(interval);

        fetch(JSON_URL)
            .then(res => res.json())
            .then(macket => processPage(macket, headerDiv))
            .catch(err => console.error('Помилка завантаження JSON:', err));

    }, 300);

    function processPage(macket, headerDiv) {

        const breadcrumbText = document
            .querySelector('ol.nav.navbar-top-links.breadcrumb li.active span')
            ?.innerText.trim();

        let categoryText = null;
        document.querySelectorAll('tr.sonata-ba-view-container').forEach(tr => {
            const th = tr.querySelector('th');
            if (th && th.innerText.trim() === 'Category') {
                const td = tr.querySelector('td a');
                if (td) categoryText = td.innerText.trim();
            }
        });

        let link = null;

        if (breadcrumbText) {
            const cleanBreadcrumb = normalizeText(breadcrumbText.replace(/\.\.\.$/, ''));

            for (const key in macket) {
                if (normalizeText(key).startsWith(cleanBreadcrumb)) {
                    link = macket[key];
                    break;
                }
            }
        }

        if (!link && categoryText) {
            const cleanCategory = normalizeText(categoryText);

            for (const key in macket) {
                if (normalizeText(key).startsWith(cleanCategory)) {
                    link = macket[key];
                    break;
                }
            }
        }

        if (!link) {
            console.log('Посилання не знайдено', { breadcrumbText, categoryText });
            return;
        }

        const btn = document.createElement('button');
        btn.innerText = 'Відкрити макет';

        btn.style.marginLeft = '12px';
        btn.style.padding = '8px 16px';
        btn.style.background = 'rgb(85, 120, 235)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';

        btn.onmouseenter = () => btn.style.background = '#1556CC';
        btn.onmouseleave = () => btn.style.background = 'rgb(85, 120, 235)';

        btn.addEventListener('click', () => {
            window.location.href = link;
        });

        headerDiv.parentNode.insertBefore(btn, headerDiv.nextSibling);
    }

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[()]/g, '')
            .trim();
    }

})();
