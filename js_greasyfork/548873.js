// ==UserScript==
// @name         Удаление рекламы с mail.yandex.com
// @namespace    http://tampermonkey.net/
// @version      2025-09-08
// @description  Удаляет динамичную рекламу справа и сверху от писем в первые 3 секунды (увеличить timeout при необходимости)
// @author       resursator
// @license      MIT
// @match        https://mail.yandex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548873/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D1%81%20mailyandexcom.user.js
// @updateURL https://update.greasyfork.org/scripts/548873/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D1%81%20mailyandexcom.meta.js
// ==/UserScript==

(function removePanelLoop() {
    const targetText = 'Отключить рекламу';
    const interval = 100;
    const timeout = 3000;
    let elapsed = 0;

    const timer = setInterval(() => {
        const anchors = document.querySelectorAll('a');
        let removed = false;

        anchors.forEach(a => {
            if (a.textContent && a.textContent.trim().includes(targetText)) {
                let panel = a.closest('div')?.parentElement?.parentElement;
                if (panel) {
                    panel.remove();
                    removed = true;
                    //console.log('Удалена мусорная панель');
                }
            }
        });

        if (removed || (elapsed += interval) >= timeout) {
            clearInterval(timer);
        }
    }, interval);
})();

(function removeHeaderGarbageLoop() {
    const interval = 100;
    const timeout = 3000;
    let elapsed = 0;

    const timer = setInterval(() => {
        const header = document.getElementById('js-mail-layout-content-header');
        let removed = false;

        if (header) {
            const children = Array.from(header.children);
            if (children.length >= 3) {
                const garbage = children[1];
                if (garbage) {
                    garbage.remove();
                    removed = true;
                    //console.log('Удалён мусор в хедере');
                }
            }
        }

        if (removed || (elapsed += interval) >= timeout) {
            clearInterval(timer);
        }
    }, interval);
})();

