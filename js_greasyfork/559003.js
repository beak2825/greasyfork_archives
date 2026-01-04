// ==UserScript==
// @name         Zorrov
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @author       Zorrov
// @match        https://zorrov.com/admin/customproduct/*/show
// @grant        none
// @license MIT
// @grant        GM_xmlhttpRequest
// @connect      alievomar7729.github.io
// @downloadURL https://update.greasyfork.org/scripts/559003/Zorrov.user.js
// @updateURL https://update.greasyfork.org/scripts/559003/Zorrov.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JSON_URL = "https://alievomar7729.github.io/zorrov.github.io/macket.json";

    const interval = setInterval(() => {
        const headerDiv = document.querySelector('div.box-header');
        if (!headerDiv) return;

        clearInterval(interval);

        fetch(JSON_URL)
            .then(res => res.json())
            .then(macket => {
                processPage(macket, headerDiv);
            })
            .catch(err => {
                console.error("Помилка завантаження JSON:", err);
            });

    }, 300);

    function processPage(macket, headerDiv) {

        const breadcrumbText = document
            .querySelector('ol.nav.navbar-top-links.breadcrumb li.active span')
            ?.innerText.trim();

        let categoryText = null;
        document.querySelectorAll('tr.sonata-ba-view-container').forEach(tr => {
            const th = tr.querySelector('th');
            if (th && th.innerText.trim() === "Category") {
                const td = tr.querySelector('td a');
                if (td) categoryText = td.innerText.trim();
            }
        });

        let link = null;

        if (breadcrumbText && macket[breadcrumbText]) {
            link = macket[breadcrumbText];
        } else if (categoryText && macket[categoryText]) {
            link = macket[categoryText];
        }

        if (!link) {
            console.log("Посилання не знайдено");
            return;
        }

        const btn = document.createElement('button');
        btn.innerText = 'Відкрити макет';

        btn.style.marginLeft = '12px';
        btn.style.padding = '8px 16px';
        btn.style.background = 'rgb(85, 120, 235)';
        btn.style.color = '#ffffff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';

        btn.onmouseenter = () => {
            btn.style.background = '#1556CC';
        };
        btn.onmouseleave = () => {
            btn.style.background = 'rgb(85, 120, 235)';
        };

        btn.addEventListener('click', () => {
            window.location.href = link;
        });

        headerDiv.parentNode.insertBefore(btn, headerDiv.nextSibling);
    }
})();
