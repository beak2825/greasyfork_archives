// ==UserScript==
// @name         Emby Bypass
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Intercept and modify fetch requests (URL params & Headers for ALL methods) to hxd.as174.de
// @author       BlingCc
// @match        *://hxd.as174.de/*
// @match        *://cf.bili.rip:8443/*
// @icon         https://hxd.as174.de/favicon.ico
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547801/Emby%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/547801/Emby%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 fetch 函数
    const originalFetch = unsafeWindow.fetch;

    // 定义要修改的参数和新值
    const modifications = {
        'X-Emby-Client': 'SenPlayer',
        'X-Emby-Device-Name': 'Apple TV',
        'X-Emby-Client-Version': '5.6.2'
    };

    // 重写 fetch 函数
    unsafeWindow.fetch = function(input, options) {
        let url = input instanceof Request ? input.url : input.toString();

        // 检查请求的 URL 是否匹配目标域名
        if (url.includes('hxd.as174.de') || url.includes('cf.bili.rip')) {
            console.log('Intercepted fetch request:', url, options ? options.method || 'GET' : 'GET');

            // 确保 options 对象存在
            options = options || {};
            options.headers = options.headers || {};

            try {
                const urlObject = new URL(url);
                let urlModified = false;

                // 1. 修改 URL 查询参数 (对所有请求方法都生效)
                for (const key in modifications) {
                    if (urlObject.searchParams.has(key)) {
                        urlObject.searchParams.set(key, modifications[key]);
                        urlModified = true;
                    }
                }

                if (urlModified) {
                    const originalUrl = url;
                    url = urlObject.toString();
                    console.log(`URL modified from: ${originalUrl}\nto: ${url}`);
                }
            } catch (e) {
                console.error('Failed to parse or modify URL:', url, e);
            }

            // 2. 修改请求头 (对所有请求方法都生效)
            // 为了不区分大小写地替换，我们创建一个新的 headers 对象
            const newHeaders = {};
            // 将原始 headers 复制到新对象，同时键转为小写以供检查
            const lowerCaseModKeys = Object.keys(modifications).map(k => k.toLowerCase());

            // 遍历原始请求头
            for (const key in options.headers) {
                if (lowerCaseModKeys.includes(key.toLowerCase())) {
                    // 如果这个头是我们想要修改的，则跳过，后面会统一添加
                    continue;
                }
                newHeaders[key] = options.headers[key];
            }

            // 检查原始 headers 中是否有需要修改的项，并将修改后的值添加到新 headers 对象
            let headersModified = false;
            for (const key in modifications) {
                 // 检查 options.headers 是否有该 key (不区分大小写)
                 const headerKey = Object.keys(options.headers).find(k => k.toLowerCase() === key.toLowerCase());
                 if (headerKey) {
                    newHeaders[key] = modifications[key];
                    headersModified = true;
                 }
            }

            if (headersModified) {
                options.headers = newHeaders;
                console.log('Headers modified to:', options.headers);
            }
        }

        // 使用可能已修改的 url 和 options 调用原始的 fetch 函数
        if (input instanceof Request) {
            const newRequest = new Request(url, { ...options, body: input.body, method: input.method, headers: options.headers || input.headers });
            return originalFetch.call(this, newRequest);
        } else {
            return originalFetch.call(this, url, options);
        }
    };

    console.log('hxd.as174.de fetch interceptor (v0.3) activated.');
})();