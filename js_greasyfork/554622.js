// ==UserScript==
// @name         Block ShadowRoot if "ad" in Stack (Yandex Mail)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Блокирует создание ShadowRoot, если в стеке вызова встречается "ad".
// @author       You
// @match        https://mail.yandex.ru/*
// @match        https://yandex.ru/games/*
// @match        https://yandex.ru/games
// @match        https://yandex.ru/*
// @match        https://*.yandex.*/*
// @match        https://ya.ru/*
// @match        https://dzen.ru/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554622/Block%20ShadowRoot%20if%20%22ad%22%20in%20Stack%20%28Yandex%20Mail%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554622/Block%20ShadowRoot%20if%20%22ad%22%20in%20Stack%20%28Yandex%20Mail%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalAttachShadow = Element.prototype.attachShadow;

    if (!originalAttachShadow) {
        console.warn('[BlockShadow] attachShadow не найден');
        return;
    }

    const attachShadowProxy = new Proxy(originalAttachShadow, {
        apply: function (target, thisArg, args) {
            try {
                const stack = new Error().stack;
                if (typeof stack === 'string' && /ad/i.test(stack)) {
                    console.group(`[BlockShadow] ❌ Блокировка ShadowRoot: найдено "ad" в стеке`);
                    console.log('Элемент:', thisArg);
                    console.log('Аргументы:', args);
                    console.log('Стек:', stack);
                    console.groupEnd();
                    return null
                }
            } catch (e) {
                console.debug('[BlockShadow] Ошибка при анализе стека', e);
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    Object.defineProperty(Element.prototype, 'attachShadow', {
        value: attachShadowProxy,
        configurable: true,
        writable: true,
        enumerable: false
    });
    const originalToString = Function.prototype.toString;

    Function.prototype.toString = new Proxy(originalToString, {
        apply: function (target, thisArg, args) {
            if (thisArg === originalAttachShadow || thisArg === attachShadowProxy) {
                return 'function attachShadow() { [native code] }';
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    console.info('[BlockShadow] Хук активен: блокировка ShadowRoot при "ad" в стеке.');
})();