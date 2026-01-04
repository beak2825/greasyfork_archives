// ==UserScript==
// @name         Deepseek 官网防撤回 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  拦截并丢弃 Deepseek 的 CONTENT_FILTER 消息，带详细日志
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549685/Deepseek%20%E5%AE%98%E7%BD%91%E9%98%B2%E6%92%A4%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/549685/Deepseek%20%E5%AE%98%E7%BD%91%E9%98%B2%E6%92%A4%E5%9B%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        console.log("[Filter] XHR.open", method, url);
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && (this._url.includes('/api/v0/chat/completion') || this._url.includes('/api/v0/chat/regenerate'))) {
            console.log("[Filter] Hooked send for:", this._url);

            const xhr = this;

            function filterResponse() {
                try {
                    if (xhr.readyState === 3 || xhr.readyState === 4) {
                        let raw = xhr.responseText;
                        console.log("[Filter] raw response length:", raw.length);

                        let filtered = raw.split(/\r?\n/).filter(line => {
                            if (!line.startsWith("data:")) return true;
                            try {
                                let obj = JSON.parse(line.slice(5).trim());
                                if (obj?.v && Array.isArray(obj.v)) {
                                    for (let item of obj.v) {
                                        if (item.p === "status" && item.v === "CONTENT_FILTER") {
                                            console.warn("[Filter] Intercept CONTENT_FILTER:", line);
                                            return false; // 丢掉
                                        }
                                    }
                                }
                            } catch (e) {
                                // 不是合法 JSON，保留
                            }
                            return true;
                        }).join("\n");

                        if (filtered !== raw) {
                            console.log("[Filter] Response filtered, new length:", filtered.length);
                            Object.defineProperty(xhr, "responseText", {
                                value: filtered,
                                configurable: true
                            });
                        }
                    }
                } catch (err) {
                    console.error("[Filter] Error in filterResponse:", err);
                }
            }

            // 1. 兼容 addEventListener
            const originalAddEventListener = xhr.addEventListener;
            xhr.addEventListener = function(type, listener, options) {
                if (type === "readystatechange") {
                    console.log("[Filter] addEventListener hooked for readystatechange");
                    const wrapped = function() {
                        filterResponse();
                        return listener.apply(this, arguments);
                    };
                    return originalAddEventListener.call(this, type, wrapped, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            // 2. 兼容直接赋值 onreadystatechange
            Object.defineProperty(xhr, "onreadystatechange", {
                set(fn) {
                    console.log("[Filter] onreadystatechange setter hooked");
                    const wrapped = function() {
                        filterResponse();
                        return fn.apply(this, arguments);
                    };
                    originalAddEventListener.call(xhr, "readystatechange", wrapped);
                }
            });
        }
        return originalSend.apply(this, arguments);
    };
})();
