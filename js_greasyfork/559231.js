// ==UserScript==
// @name         Remove Google AI Studio Watermark
// @namespace    https://www.tampermonkey.net/
// @version      1.0
// @description  在 Google AI Studio 中攔截並阻擋浮水印影像的載入
// @author       You
// @match        https://aistudio.google.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559231/Remove%20Google%20AI%20Studio%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/559231/Remove%20Google%20AI%20Studio%20Watermark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 攔截的浮水印檔案名稱規則
    const WATERMARK_PATH_REGEX = /watermark[^/]*\.png(\?.*)?$/i;

    function tryParseURL(input) {
        try {
            return new URL(String(input), location.href);
        } catch {
            return null;
        }
    }

    function isWatermarkURL(input) {
        const u = tryParseURL(input);
        return !!u && WATERMARK_PATH_REGEX.test(u.pathname);
    }

    // 攔截 <img> src
    const imgProto = HTMLImageElement.prototype;
    const srcDesc = Object.getOwnPropertyDescriptor(imgProto, 'src');

    if (srcDesc && srcDesc.configurable) {
        Object.defineProperty(imgProto, 'src', {
            get() {
                return srcDesc.get.call(this);
            },
            set(value) {
                if (typeof value === 'string' && isWatermarkURL(value)) {
                    // 不設定 src 並直接隱藏元素 → 不會出現白框
                    this.style.display = 'none';
                    return;
                }
                srcDesc.set.call(this, value);
            },
            configurable: true,
            enumerable: srcDesc.enumerable,
        });
    }

    // 攔截 setAttribute('src', ...)
    const originalSetAttribute = imgProto.setAttribute;
    imgProto.setAttribute = function (name, value) {
        try {
            if (String(name).toLowerCase() === 'src' &&
                typeof value === 'string' &&
                isWatermarkURL(value)) {
                this.style.display = 'none';
                return;
            }
        } catch {}
        return originalSetAttribute.call(this, name, value);
    };

    // CSS 保險：如果浮水印直接被寫進 DOM
    (function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            img[src*="watermark"] {
                display: none !important;
            }
            [style*="watermark"] {
                background-image: none !important;
            }
        `;
        document.documentElement.appendChild(style);
    })();

    // 攔截 fetch，直接拒絕水印請求（不回傳透明圖，避免白框）
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = new Proxy(originalFetch, {
            apply(target, thisArg, args) {
                let url = args[0];
                if (url && typeof url === 'object' && 'url' in url) url = url.url;
                if (url && isWatermarkURL(url)) {
                    return Promise.reject(new TypeError('Blocked watermark request'));
                }
                return Reflect.apply(target, thisArg, args);
            },
        });
    }
})();