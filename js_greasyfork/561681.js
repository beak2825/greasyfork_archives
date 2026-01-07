// ==UserScript==
// @name         CHT Router QRCode Bypass (XHR only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Force PasswordQrcode=false via XMLHttpRequest interception
// @license      MIT
// @author	 yuehzai
// @match        https://192.168.1.1/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561681/CHT%20Router%20QRCode%20Bypass%20%28XHR%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561681/CHT%20Router%20QRCode%20Bypass%20%28XHR%20only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function () {
        this._tm_url = arguments[1]; // optional: 可用來過濾 API
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState !== 4) return;

            if (!this.responseText) return;

            try {
                const json = JSON.parse(this.responseText);

                if (json && json.PasswordQrcode === true) {
                    console.log('[TM] PasswordQrcode → false', this._tm_url);

                    json.PasswordQrcode = false;

                    Object.defineProperty(this, 'responseText', {
                        configurable: true,
                        value: JSON.stringify(json)
                    });

                    Object.defineProperty(this, 'response', {
                        configurable: true,
                        value: JSON.stringify(json)
                    });
                }
            } catch (e) {
                // 非 JSON response，忽略
            }
        });

        return originalSend.apply(this, arguments);
    };
})();
