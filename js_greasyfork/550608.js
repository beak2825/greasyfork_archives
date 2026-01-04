// ==UserScript==
// @name         Сняты ограничения на страницы (visibility/focus/copy/right click/debug)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Сделайте страницу всегда "видимой” и "активной”, снимите ограничения на копирование и щелчок правой кнопкой мыши и разрешите открывать инструменты разработчика.Может использоваться для обхода различных ограничений на онлайн-экзаменах и веб-сайтах с документами.Адаптироваться к страницам, которые динамически загружают содержимое через MutationObserver.
// @author       zskfree
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @all-frames   true
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550608/%D0%A1%D0%BD%D1%8F%D1%82%D1%8B%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%28visibilityfocuscopyright%20clickdebug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550608/%D0%A1%D0%BD%D1%8F%D1%82%D1%8B%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%28visibilityfocuscopyright%20clickdebug%29.meta.js
// ==/UserScript==

//оригинал тут
//https://update.greasyfork.org/scripts/550564/%E9%A1%B5%E9%9D%A2%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%20%28%E5%8F%AF%E8%A7%81%E6%80%A7%E7%84%A6%E7%82%B9%E5%A4%8D%E5%88%B6%E5%8F%B3%E9%94%AE%E8%B0%83%E8%AF%95%29.user.js
(function () {
    'use strict';

    const TAG = '[Bypass]';

    // --- 1. Принудительно разрешить выделение и копирование текста (с помощью CSS) ---
    GM_addStyle(`
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
        }
    `);

    // --- 2. Обойти видимость страницы (Page Visibility API) ---
    // Используйте unsafeWindow, чтобы убедиться, что манипулируется объект document самой страницы
    const doc = unsafeWindow.document;
    try {
        Object.defineProperties(doc, {
            'visibilityState': { value: 'visible', configurable: true },
            'hidden': { value: false, configurable: true },
            'webkitVisibilityState': { value: 'visible', configurable: true },
            'webkitHidden': { value: false, configurable: true },
        });
        console.info(`${TAG} API видимости страницы был изменен.`);
    } catch (e) {
        console.error(`${TAG} Не удалось изменить API видимости страницы:`, e);
    }

    // --- 3. Перехватывать и предотвращать ограничительный мониторинг событий ---
    const originalAddEventListener = unsafeWindow.EventTarget.prototype.addEventListener;
    unsafeWindow.EventTarget.prototype.addEventListener = function (type, listener, options) {
        const lowerType = String(type).toLowerCase();
        const eventsToBlock = [
            'visibilitychange', 'webkitvisibilitychange', 'blur', 'focusout',
            'mouseleave', 'beforeunload', 'contextmenu', 'selectstart',
            'copy', 'cut', 'paste', 'dragstart',
        ];

        if (eventsToBlock.includes(lowerType)) {
            console.info(`${TAG} заблокирован '${type}' Добавление прослушивателей событий.`);
            return; // Напрямую предотвращать добавление слушателей
        }

        if (lowerType === 'keydown' || lowerType === 'keyup') {
            const originalListener = listener;
            listener = function (event) {
                if (
                    event.key === 'F12' ||
                    (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase()))
                ) {
                    console.warn(`${TAG} Событие клавиатуры, которое могло отключить инструменты разработчика, было заблокировано。`);
                    event.stopImmediatePropagation();
                    event.preventDefault(); // Усиленный блокирующий эффект
                    return;
                }
                // Используйте apply для обеспечения правильного контекста и параметров
                return originalListener.apply(this, arguments);
            };
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    // --- 4. Устраните ограничения на привязку атрибута on-event (начальный + динамический) ---
    const eventsToClear = [
        'oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste', 'ondragstart',
        'onbeforeunload', 'onblur', 'onfocusout', 'onmouseleave'
    ];

    function clearOnEvents(target) {
        if (!target) return;
        eventsToClear.forEach(eventName => {
            try {
                // Устанавливается непосредственно на null
                if (typeof target[eventName] === 'function') {
                    target[eventName] = null;
                    console.info(`${TAG} Убранный ${target.tagName || 'window'} На '${eventName}' свойство。`);
                }
            } catch (e) { /* Игнорировать ошибки */ }
        });
    }

    // Когда страница загружается, да window, document, body Выполните очисткуНовое: Используйте MutationObserver для мониторинга и очистки динамически добавляемых элементов
    clearOnEvents(unsafeWindow);
    clearOnEvents(doc);
    if (doc.body) {
        clearOnEvents(doc.body);
    }

    // --- 5. Новое: Используйте MutationObserver для мониторинга и очистки динамически добавляемых элементов ---
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    // Обрабатываются только узлы элементов
                    if (node.nodeType === 1) {
                        clearOnEvents(node); // Очистите сам узел
                        // Очистите все дочерние элементы под узлом
                        node.querySelectorAll('*').forEach(clearOnEvents);
                    }
                });
            }
        }
    });

    // ждать document.body Начните наблюдать после появления
    const observerConfig = { childList: true, subtree: true };
    if (doc.body) {
        observer.observe(doc, observerConfig);
    } else {
        // если body Еще не существует, затем дождитесь его загрузки
        doc.addEventListener('DOMContentLoaded', () => {
            observer.observe(doc, observerConfig);
        }, { once: true });
    }

    // --- 6. Новое: методы размытия и фокусировки, которые перезаписывают окно ---
    try {
        unsafeWindow.blur = () => { console.info(`${TAG} заблокирован window.blur() звони.`); };
        unsafeWindow.focus = () => { console.info(`${TAG} заблокирован window.focus() звони.`); };
    } catch (e) {
        console.error(`${TAG} покрытие window.blur/focus неудача:`, e);
    }

    console.info(`${TAG} Скрипт снятия ограничений со страницы полностью активирован (динамический режим).`);
})();