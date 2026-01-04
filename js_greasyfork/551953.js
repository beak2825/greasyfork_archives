// ==UserScript==
// @name         Скрыть нежелательные новости на sports.ru
// @namespace    http://tampermonkey.net/
// @version      v3
// @description  Скрывает ненужные новости на sports.ru
// @author       Mister Brightside
// @match        https://www.sports.ru/news/top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sports.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551953/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BD%D0%B5%D0%B6%D0%B5%D0%BB%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8%20%D0%BD%D0%B0%20sportsru.user.js
// @updateURL https://update.greasyfork.org/scripts/551953/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BD%D0%B5%D0%B6%D0%B5%D0%BB%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8%20%D0%BD%D0%B0%20sportsru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // тут можно добавить другие стоп-ключи, по которым будут скрываться новости
    const keywords = ['Журова', 'Дегтярев', 'Рудковская', 'Милонов', 'Мостовой', 'Ротенберг', 'Кадыров', 'Путин', 'Плющенко', 'Александр Тихонов', 'Губерниев', 'Свищев', 'Тихонов'];

    function hideBadParagraphs() {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            const link = p.querySelector('a.short-text');
            if (link) {
                const text = link.textContent;
                if (keywords.some(word => text.includes(word))) {
                    p.style.display = 'none';
                }
            }
        });
    }

    hideBadParagraphs();

    const observer = new MutationObserver(() => hideBadParagraphs());
    observer.observe(document.body, { childList: true, subtree: true });
})();