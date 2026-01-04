// ==UserScript==
// @name         YouTube reviews from Epic Games (EGS)
// @description  Добавляет кнопку обзоры и прохождение на YouTube
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       antoxa-kms
// @match        https://store.epicgames.com/ru/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.epicgames.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560302/YouTube%20reviews%20from%20Epic%20Games%20%28EGS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560302/YouTube%20reviews%20from%20Epic%20Games%20%28EGS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

let lastUrl = location.href;

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        waitForElement('span[data-testid="pdp-title"]', (titleEl) => {
            const gameTitle = titleEl.textContent.trim();
            if (!gameTitle) return;

            waitForElement('ul.css-164bt5m', (ul) => {
                // удаляем старые кнопки (если есть)
                ul.querySelectorAll('.tm-youtube-buttons').forEach(e => e.remove());
                
                const YT_ICON = `data:image/svg+xml;charset=utf-8,
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 20'>
                  <defs>
                    <mask id='cut'>
                      <rect width='29' height='20' fill='white'/>
                      <path d='M11.5 14.5L18.5 10L11.5 5.5Z' fill='black'/>
                    </mask>
                  </defs>
                  <path
                    d='M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z'
                    fill='%23FFF'
                    mask='url(%23cut)'
                  />
                </svg>`;

                const createButton = (text, query) => {
                    const li = document.createElement('li');
                    li.className = 'css-160z0x6 tm-youtube-buttons';

                    li.innerHTML = `
                        <div>
                            <a class="css-15qbj1p"
                               href="https://www.youtube.com/results?search_query=${encodeURIComponent(gameTitle + ' ' + query)}"
                               target="_blank">
                                <span class="eds_1ypbntd0 eds_1ypbntdb eds_1ypbntdl">
                                    <div class="css-buyjzp" style="
                                        color: var(--eds_xd1k8gr);
                                        display: flex;
                                        align-items: center;
                                        gap: 6px;
                                    ">
                                        <img src="${YT_ICON}" width="18" height="12" alt="YouTube">
                                        <div>${text}</div>
                                    </div>
                                </span>
                            </a>
                        </div>
                    `;
                    return li;
                };

                ul.appendChild(createButton('Прохождение', 'Прохождение'));
                ul.appendChild(createButton('Обзор', 'Обзор'));
            });
        });
    }

    // первый запуск
    init();

    // 🔥 отслеживаем смену страницы без перезагрузки
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            init();
        }
    }, 500);

})();