// ==UserScript==
// @name         咪咕音乐音质升级 (128k -> 320k)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  尝试将播放器加载的 MP3_128_16_Stero 链接替换为 MP3_320_16_Stero
// @author       User
// @match        https://music.migu.cn/*
// @match        http://music.migu.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560424/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E9%9F%B3%E8%B4%A8%E5%8D%87%E7%BA%A7%20%28128k%20-%3E%20320k%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560424/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E9%9F%B3%E8%B4%A8%E5%8D%87%E7%BA%A7%20%28128k%20-%3E%20320k%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetStr = 'MP3_128_16_Stero';
    const replaceStr = 'MP3_320_16_Stero';

    console.log('咪咕音质升级脚本已加载...');

    // 辅助函数：替换URL中的音质标识
    function upgradeUrl(url) {
        if (typeof url === 'string' && url.includes(targetStr)) {
            console.log(`[音质升级] 拦截到低音质请求: ${url}`);
            const newUrl = url.replace(targetStr, replaceStr);
            console.log(`[音质升级] 已替换为高音质: ${newUrl}`);
            return newUrl;
        }
        return url;
    }

    // 1. 拦截 XMLHttpRequest (常见的音频加载方式)
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        const newUrl = upgradeUrl(url);
        return originalOpen.apply(this, [method, newUrl, ...args]);
    };

    // 2. 拦截 Fetch API (现代浏览器的加载方式)
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        let newInput = input;
        if (typeof input === 'string') {
            newInput = upgradeUrl(input);
        } else if (input instanceof Request) {
            // 如果是Request对象，检查其url属性
            if (input.url.includes(targetStr)) {
                newInput = new Request(upgradeUrl(input.url), input);
            }
        }
        return originalFetch(newInput, init);
    };

    // 3. 拦截 Audio 元素的 src 属性 (针对直接设置 src 的情况)
    // 保存原始的属性描述符
    const audioSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    if (audioSrcDescriptor && audioSrcDescriptor.set) {
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
            set: function(value) {
                const newValue = upgradeUrl(value);
                // 调用原始的 setter
                audioSrcDescriptor.set.call(this, newValue);
            },
            get: audioSrcDescriptor.get,
            enumerable: audioSrcDescriptor.enumerable,
            configurable: audioSrcDescriptor.configurable
        });
    }

})();