// ==UserScript==
// @name         终末地UID提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键查看终末地UID
// @author       You
// @match        https://user.hypergryph.com/bindCharacters*
// @icon         https://web.hycdn.cn/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563267/%E7%BB%88%E6%9C%AB%E5%9C%B0UID%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563267/%E7%BB%88%E6%9C%AB%E5%9C%B0UID%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = 'https://binding-api-account-prod.hypergryph.com/account/binding/v1/binding_list';
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._requestInfo = { url: url };
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const requestInfo = this._requestInfo;

        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && requestInfo && requestInfo.url.includes(TARGET_URL)) {
                if (this.responseText) {
                    try {
                        const response = JSON.parse(this.responseText);
                        const endfieldApp = response.data?.list?.find(item => item.appCode === "endfield");
                        const uid = endfieldApp?.bindingList?.[0]?.uid;

                        if (uid) {
                            alert("终末地UID：" + uid);
                        } else {
                            alert("未找到终末地UID");
                        }
                    } catch (e) {
                        alert("解析响应失败");
                    }
                }
            }
        });

        return originalSend.apply(this, arguments);
    };
})();