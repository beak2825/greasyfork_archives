// ==UserScript==
// @name         游戏中心编辑器登录态 helper xx
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.3
// @description  尝试同步两个特定域名间的token和loginUuid
// @author       You
// @match        https://game-staging.g.mi.com/*
// @match        http://game-staging.g.mi.com/*
// @match        http://migc-fe-staging.g.mi.com/*
// @match        https://migc-fe-staging.g.mi.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      self
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548900/%E6%B8%B8%E6%88%8F%E4%B8%AD%E5%BF%83%E7%BC%96%E8%BE%91%E5%99%A8%E7%99%BB%E5%BD%95%E6%80%81%20helper%20xx.user.js
// @updateURL https://update.greasyfork.org/scripts/548900/%E6%B8%B8%E6%88%8F%E4%B8%AD%E5%BF%83%E7%BC%96%E8%BE%91%E5%99%A8%E7%99%BB%E5%BD%95%E6%80%81%20helper%20xx.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetKeys = ['token', 'loginUuid'];
    const MESSAGE_TYPE = 'SYNC_LOCALSTORAGE_DATA';

    const currentOrigin = window.location.hostname;

    const IS_SOURCE_DOMAIN = currentOrigin === 'game-staging.g.mi.com';
    const IS_TARGET_DOMAIN = currentOrigin === 'migc-fe-staging.g.mi.com';
    const SOURCE_URL = 'http://game-staging.g.mi.com';

    function sendDataToTarget(data) {
        console.log('[script debug]', data);
        GM_setValue(MESSAGE_TYPE, JSON.stringify({
            keys: data,
            timestamp: Date.now()
        }));
    }

    function handleIncomingData(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                if (targetKeys.includes(key)) {
                    const value = data[key];
                    if (value === null) {
                        localStorage.removeItem(key);
                    } else {
                        localStorage.setItem(key, value);
                    }
                    console.log(`已同步 ${key} 到本地 localStorage`);
                }
            });
        }
    }

    const listenerId = GM_addValueChangeListener(MESSAGE_TYPE, function (name, oldValue, newValue, remote) {
        console.log('[script debug]', name, remote);
        if (remote) {
            try {
                const parsedData = JSON.parse(newValue);
                if (parsedData && parsedData.keys) {
                    handleIncomingData(parsedData.keys);
                }
            } catch (e) {
                console.error('解析接收到的数据失败:', e);
            }
        }
    });

    window.addEventListener('load', function () {
        console.log('[debug]', window.location.hostname);
        if (IS_SOURCE_DOMAIN) {
            console.log('[script debug] 源页面：开始监听 token 和 loginUuid 的变化');

            const initialData = {};
            targetKeys.forEach(key => {
                initialData[key] = localStorage.getItem(key);
            });
            sendDataToTarget(initialData);

            const originalSetItem = localStorage.setItem;
            const originalRemoveItem = localStorage.removeItem;

            localStorage.setItem = function (key, value) {
                originalSetItem.apply(this, arguments);
                if (targetKeys.includes(key)) {
                    const dataToSend = {};
                    dataToSend[key] = value;
                    sendDataToTarget(dataToSend);
                }
            };

            localStorage.removeItem = function (key) {
                originalRemoveItem.apply(this, arguments);
                if (targetKeys.includes(key)) {
                    const dataToSend = {};
                    dataToSend[key] = null;
                    sendDataToTarget(dataToSend);
                }
            };
        } else if (IS_TARGET_DOMAIN) {
            console.log('[script debug] 目标页面：等待接收 token 和 loginUuid 数据');
        }
    });

    window.addEventListener('beforeunload', function () {
        GM_removeValueChangeListener(listenerId);
    });

})();