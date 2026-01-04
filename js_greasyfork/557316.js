// ==UserScript==
// @name         CRM AutoReloader
// @namespace    https://avo-rsko.com/
// @version      2025-11-29
// @description  Auto Reloader for CRM
// @author       @ghtod1
// @match        https://avo-rsko.com/*
// @icon         https://avo-rsko.com/vite.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557316/CRM%20AutoReloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557316/CRM%20AutoReloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[TM] Скрипт (no XPath) запущен');

    function checkAndReload() {
        const headers = document.querySelectorAll('#root h3');

        // Логируем количество найденных элементов
        console.log('[TM] Найдено h3 элементов:', headers.length);

        if (!headers.length) {
            console.log('[TM] h3 под #root пока нет');
            return;
        }

        for (const h of headers) {
            const text = h.textContent.trim();
            console.log('[TM] h3:', text);

            if (text.includes('База закончилась')) {
                console.log('[TM] Совпадение найдено. Перезагрузка через 2 сек...');
                setTimeout(() => {
                    location.reload();
                }, 2000);
                return;
            }
        }
    }

    // Запускаем проверку сразу и затем каждую секунду
    checkAndReload();
    setInterval(checkAndReload, 1000);
})();