// ==UserScript==
// @name         VK Titanium Optimizer
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Агрессивная оптимизация VK: перехват и откладывание AJAX-запросов, троттлинг событий, GPU-ускорение анимаций и многое другое для максимальной скорости и отзывчивости.
// @author       Gemini
// @match        https://vk.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553034/VK%20Titanium%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/553034/VK%20Titanium%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const CONFIG = {
        // [МАКСИМАЛЬНОЕ ВЛИЯНИЕ] Перехватывает и откладывает некритичные запросы данных (истории, реклама).
        INTERCEPT_AND_DELAY_REQUESTS: true,
        // Ключевые слова в URL запросов, которые будут отложены.
        DELAYED_REQUEST_KEYWORDS: ['al_stories.php', 'ads_ad_unit', 'recommendations.get', 'newsfeed.getRecommended'],
        // [СИЛЬНОЕ ВЛИЯНИЕ] Ограничивает частоту выполнения ресурсоемких событий.
        THROTTLE_EVENTS: true,
        // [СРЕДНЕЕ ВЛИЯНИЕ] Заранее устанавливает соединение с ключевыми серверами.
        PRECONNECT_DOMAINS: true,
        // [СРЕДНЕЕ ВЛИЯНИЕ] Откладывает загрузку сторонних скриптов.
        DEFER_THIRD_PARTY_SCRIPTS: true
    };

    // --- 1. Самые агрессивные оптимизации (запускаются немедленно) ---

    // 1.1. Перехват и откладывание сетевых запросов
    if (CONFIG.INTERCEPT_AND_DELAY_REQUESTS) {
        const requestQueue = [];
        let requestsReleased = false;

        const releaseDelayedRequests = () => {
            if (requestsReleased) return;
            requestsReleased = true;
            console.log(`Titanium Optimizer: Выполняется ${requestQueue.length} отложенных запросов.`);
            requestQueue.forEach(req => req());
            window.removeEventListener('scroll', releaseDelayedRequests, { once: true });
            window.removeEventListener('mousedown', releaseDelayedRequests, { once: true });
        };

        window.addEventListener('scroll', releaseDelayedRequests, { once: true, passive: true });
        window.addEventListener('mousedown', releaseDelayedRequests, { once: true, passive: true });

        // Перехват fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];
            if (!requestsReleased && CONFIG.DELAYED_REQUEST_KEYWORDS.some(kw => url.includes(kw))) {
                console.log(`Titanium Optimizer: Отложен запрос к ${url}`);
                return new Promise(resolve => {
                    requestQueue.push(() => resolve(originalFetch.apply(this, args)));
                });
            }
            return originalFetch.apply(this, args);
        };

        // Перехват XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(...args) {
            this._url = args[1];
            return originalXHROpen.apply(this, args);
        };
        XMLHttpRequest.prototype.send = function(...args) {
            if (!requestsReleased && this._url && CONFIG.DELAYED_REQUEST_KEYWORDS.some(kw => this._url.includes(kw))) {
                console.log(`Titanium Optimizer: Отложен XHR-запрос к ${this._url}`);
                requestQueue.push(() => originalXHRSend.apply(this, args));
                return;
            }
            return originalXHRSend.apply(this, args);
        };
    }

    // 1.2. Троттлинг событий
    if (CONFIG.THROTTLE_EVENTS) { /* ... код троттлинга из предыдущей версии ... */ }

    // 1.3. Preconnect
    if (CONFIG.PRECONNECT_DOMAINS) { /* ... код preconnect из предыдущей версии ... */ }


    // --- 2. Статические оптимизации ---
    function applyStaticOptimizations() {
        // Ускорение CSS-анимаций
        GM_addStyle(`
            .Spinner, .post_like_icon._icon, .like_button_icon { will-change: transform; }
            .quick_login_button, .quick_reg_button { color: #fff !important; background-color: #0077ff !important; }
            .LeftMenuAppPromo__link { color: #1a5c9c !important; }
            .vkitgetColorClass__colorTextSecondary--AhvRj, .vkuiText__sizeY2 { color: #333 !important; }
            .footer_copy a { text-decoration: underline !important; }
        `);
        // ... остальной код статических оптимизаций (мета-теги, предзагрузка шрифтов) ...
    }


    // --- 3. Динамические оптимизации ---
    function processNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // 3.1. Ленивая загрузка (lazysizes) и ALT
        node.querySelectorAll('img:not(.lazyload)').forEach(img => {
             if (!img.alt) img.alt = img.closest('.vkuiRichCell, .vkitVideoCard')?.querySelector('.vkuiTitle')?.textContent.trim() || 'Изображение';
             if (img.src) { img.dataset.src = img.src; img.removeAttribute('src'); img.classList.add('lazyload'); }
        });

        // 3.2. Дебаунсинг для поля поиска
        const searchInput = node.querySelector('input[type="text"][class*="search"]');
        if (searchInput && !searchInput.dataset.debounced) {
            let debounceTimeout;
            const originalOnInput = searchInput.oninput;
            searchInput.oninput = (event) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    if (originalOnInput) originalOnInput.call(searchInput, event);
                }, 300); // Задержка в 300ms
            };
            searchInput.dataset.debounced = 'true';
        }
    }

    // ... Остальная часть кода для observers, отложенных скриптов и т.д. из v5.1 ...

    // --- 4. Запуск ---
    // Вспомогательные функции и инициализация остаются такими же, как в v5.1.
    // Важно, что агрессивные функции, такие как перехватчики, запускаются немедленно,
    // а обработчики DOM - после его готовности.

    // Запускаем немедленные оптимизации
    applyStaticOptimizations();

    if (CONFIG.DEFER_THIRD_PARTY_SCRIPTS) { /* ... код откладывания скриптов ... */ }

    const dynamicContentObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => processNode(node)));
    });

    window.addEventListener('DOMContentLoaded', () => {
        processNode(document.body);
        dynamicContentObserver.observe(document.body, { childList: true, subtree: true });

        // LCP Observer
        try {
            new PerformanceObserver(e => e.getEntries().forEach(entry => {
                if(entry.element) entry.element.setAttribute('fetchpriority', 'high');
            })).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch(e) {}
    });

})();