// ==UserScript==
// @name         Rutube Ultimate AdBlock (No preroll)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Полное отключение рекламы на Rutube (включая авторизованных пользователей)
// @match        https://rutube.ru/*
// @match        https://*.rutube.ru/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555427/Rutube%20Ultimate%20AdBlock%20%28No%20preroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555427/Rutube%20Ultimate%20AdBlock%20%28No%20preroll%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***************************************
     * 1. Блокировка всех рекламных запросов
     ***************************************/
    const adHosts = [
        'an.yandex.ru',
        'mc.yandex.ru',
        'betacdn.rutube.ru/adv',
        'rutube.ru/api/ads',
        'rutube.ru/api/preroll',
        '/adv/',
        '/ads/'
    ];

    const origFetch = window.fetch;
    window.fetch = function (...args) {
        if (typeof args[0] === 'string' && adHosts.some(h => args[0].includes(h))) {
            // имитируем успешный ответ от рекламы
            return Promise.resolve(new Response(JSON.stringify({ ads: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return origFetch.apply(this, args);
    };

    const origXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (typeof url === 'string' && adHosts.some(h => url.includes(h))) {
            this.send = () => {
                this.onload && this.onload({
                    target: {
                        responseText: '{"ads":[]}',
                        status: 200
                    }
                });
            };
        }
        return origXhrOpen.call(this, method, url, ...rest);
    };


    /***************************************
     * 2. Форсируем событие «реклама завершена»
     ***************************************/
    function fakeAdDone() {
        window.postMessage({
            type: 'adCompleted',
            action: 'complete',
            preroll: false
        }, '*');
    }

    // Несколько раз подряд, пока плеер инициализируется
    const interval = setInterval(fakeAdDone, 300);
    setTimeout(() => clearInterval(interval), 8000);


    /***************************************
     * 3. Скрытие всех рекламных DOM-слоёв
     ***************************************/
    const css = `
        .preroll,
        .player__preroll,
        .preroll__container,
        .video-adv,
        [data-adv],
        [data-ad],
        .adv,
        .advertising,
        .player-ads,
        #advertising,
        .player__overlay-adv {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);


    /***************************************
     * 4. Чистка новых рекламных узлов
     ***************************************/
    const observer = new MutationObserver(() => {
        document.querySelectorAll(`
            .preroll,
            .player__preroll,
            .video-adv,
            [data-ad],
            [data-adv]
        `).forEach(el => el.remove());
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
