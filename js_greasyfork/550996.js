// ==UserScript==
// @name         设置 maxTouchPoints 为 0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将 navigator.maxTouchPoints 设置为 0
// @author       You
// @match        *://hcf2023.top/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550996/%E8%AE%BE%E7%BD%AE%20maxTouchPoints%20%E4%B8%BA%200.user.js
// @updateURL https://update.greasyfork.org/scripts/550996/%E8%AE%BE%E7%BD%AE%20maxTouchPoints%20%E4%B8%BA%200.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 Object.defineProperty 来定义不可修改的属性
    Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => 0,
        set: () => {},
        configurable: false,
        enumerable: true
    });

    // 同时处理 msMaxTouchPoints (IE/Edge 旧版本)
    if (navigator.msMaxTouchPoints !== undefined) {
        Object.defineProperty(navigator, 'msMaxTouchPoints', {
            get: () => 1,
            set: () => {},
            configurable: false,
            enumerable: true
        });
    }

    console.log('maxTouchPoints 已设置为 1');
})();

(function() {
    'use strict';

    // 拦截 matchMedia 查询
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = new Proxy(originalMatchMedia, {
        apply: function(target, thisArg, argumentsList) {
            const query = argumentsList[0];

            if (typeof query === 'string' && query.includes('coarse')) {
                const result = originalMatchMedia.call(thisArg, query);

                // 创建代理来修改 matches 属性
                return new Proxy(result, {
                    get: function(target, property) {
                        if (property === 'matches') {
                            return false;
                        }
                        return target[property];
                    }
                });
            }

            return Reflect.apply(target, thisArg, argumentsList);
        }
    });

    // 拦截可能的指针类型检测
    if (navigator.pointerEnabled !== undefined) {
        Object.defineProperty(navigator, 'pointerEnabled', {
            get: () => false,
            set: () => {},
            configurable: false
        });
    }

    // 拦截任何可能返回 coarse 的媒体查询
    const originalAddListener = MediaQueryList.prototype.addListener;
    const originalAddEventListener = MediaQueryList.prototype.addEventListener;

    MediaQueryList.prototype.addListener = function(listener) {
        if (this.media && this.media.includes('coarse')) {
            // 创建假的 MediaQueryList 对象
            const fakeMQL = {
                matches: false,
                media: this.media,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return false; }
            };
            return fakeMQL.addListener(listener);
        }
        return originalAddListener.call(this, listener);
    };

    MediaQueryList.prototype.addEventListener = function(type, listener, options) {
        if (this.media && this.media.includes('coarse') && type === 'change') {
            // 创建假的 MediaQueryList 对象
            const fakeMQL = {
                matches: false,
                media: this.media,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return false; }
            };
            return fakeMQL.addEventListener(type, listener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('coarse 媒体查询已设置为 false');
})();