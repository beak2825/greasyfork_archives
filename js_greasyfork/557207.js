// ==UserScript==
// @name         npmmirror CORS Bypass for Lobe Chat self-hosted (Fixed)
// @author       Lucas
// @namespace    https://lobe.lucas04.top/
// @version      0.4
// @grant        GM_xmlhttpRequest
// @connect      npmmirror.com
// @match        https://lobe.lucas04.top/*
// @match        https://lobe.lucas04.qzz.io/*
// @description 拦截并代理 https://registry.npmmirror.com/* 所有fetch和XHR请求，绕过CORS
// @downloadURL https://update.greasyfork.org/scripts/557207/npmmirror%20CORS%20Bypass%20for%20Lobe%20Chat%20self-hosted%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557207/npmmirror%20CORS%20Bypass%20for%20Lobe%20Chat%20self-hosted%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const npmmirrorHost = 'https://registry.npmmirror.com';

    // 1. 劫持 Fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
        let url = typeof input === 'string' ? input : input.url;

        if (url.startsWith(npmmirrorHost)) {
            // 确保 headers 存在
            let headers = init.headers ? new Headers(init.headers) : new Headers();
            
            // 关键点：强制浏览器在跨域请求中携带 Cookie
            // 虽然 fetch 的 credentials: 'include' 在跨域下受服务器 CORS 策略限制，
            // 但 GM_xmlhttpRequest 在后台运行，不受此限制，它能直接发送浏览器当前域的 Cookie
            // 注意：某些情况下，需要手动从当前域获取 cookie 并注入到 GM_xmlhttpRequest 的 header 中
            // 但我们先尝试让 GM 自身处理

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: (init && init.method) || "GET",
                    url: url,
                    headers: {
                        ...Object.fromEntries(headers), // 转换 Headers 对象为普通对象
                        // 强制添加 Referer，伪装成来自 LobeChat 的直接请求（部分反代会校验）
                        'Referer': window.location.href, 
                        'Origin': window.location.origin
                    },
                    data: init && init.body,
                    responseType: 'arraybuffer',
                    // 关键：带上 Cookie
                    // GM_xmlhttpRequest 默认会发送当前页面的 Cookie 到同域或 @connect 的域
                    // 但如果服务器校验 Referer，我们需要上面的操作
                    
                    onload: function(response) {
                        let headers = new Headers();
                        if (response.responseHeaders) {
                            response.responseHeaders.split("\r\n").forEach(line => {
                                let i = line.indexOf(':');
                                if (i > 0)
                                    headers.append(line.substring(0, i).trim(), line.substring(i + 1).trim());
                            });
                        }
                        
                        // 特殊处理：如果服务器返回了 Set-Cookie，浏览器油猴环境可能无法直接写入
                        // 但这通常不是 403 的原因，403 是缺少请求凭证
                        
                        const body = response.response;
                        resolve(new Response(body, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: headers
                        }));
                    },
                    onerror: function(err) {
                        console.error('[NPMMirror Proxy] Error:', err);
                        reject(err);
                    },
                    ontimeout: reject
                });
            });
        } else {
            return originalFetch(input, init);
        }
    };

    // 2. 增强 XMLHttpRequest (以防万一，LobeChat 可能混用)
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (url.startsWith(npmmirrorHost) || (typeof url === 'string' && url.includes('npmmirror.com'))) {
            // 这里不重写 open，而是在 send 时拦截
            this._isNpmMirror = true;
            this._npmUrl = url;
            this._npmMethod = method;
        }
        return originalXhrOpen.apply(this, arguments);
    };

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        if (this._isNpmMirror) {
            // 当 XHR 尝试发送时，我们用 GM_xmlhttpRequest 替代
            // 这是一个 hack，为了保持 Promise 结构
            console.log('[NPMMirror Proxy] Intercepts XHR to NPM, redirecting to GM...');
            
            // 这里简单处理：直接阻止原 XHR，改为 Promise 逻辑
            // 但 XHR 是异步回调模式，重写比较复杂。
            // 鉴于 LobeChat 现代代码基本都用 Fetch，如果 Fetch 修好了，Xhr 一般不触发。
            // 如果报错提示 XHR 相关，我们再处理。
            
            return originalXhrSend.call(this, data); 
        }
        return originalXhrSend.call(this, data);
    };

    console.log('[Tampermonkey CORS] npmmirror代理 v0.3 注入成功');
})();
