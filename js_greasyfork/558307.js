// ==UserScript==
// @name         Макет Zorrov
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  none
// @author       Zorrov
// @match        https://zorrov.com/admin/customproduct/*/show
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558307/%D0%9C%D0%B0%D0%BA%D0%B5%D1%82%20Zorrov.user.js
// @updateURL https://update.greasyfork.org/scripts/558307/%D0%9C%D0%B0%D0%BA%D0%B5%D1%82%20Zorrov.meta.js
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
                console.error("Ошибка загрузки JSON:", err);
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
            console.log("Подходящая ссылка не найдена.");
            return;
        }

        const btn = document.createElement('button');
        btn.innerText = 'Открыть файл';
        btn.style.marginLeft = '10px';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = '#FFCF00';
        btn.style.border = '1px solid #222224';
        btn.style.color = '#222224';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', () => {
            window.location.href = link;
        });

        headerDiv.parentNode.insertBefore(btn, headerDiv.nextSibling);
    }
})();
