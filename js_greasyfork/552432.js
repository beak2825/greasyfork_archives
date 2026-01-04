// ==UserScript==

// @name         Sora去水印(指纹随机化)

// @namespace    http://tampermonkey.net/

// @version      2.0.1

// @description  随机化浏览器指纹，对抗 FingerprintJS 追踪，每次请求自动变换指纹

// @author       Claude 4.0 sonnet

// @match        https://nosorawm.app/*

// @grant        unsafeWindow

// @run-at       document-start
// @license      V：ChatGPT4V

// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🎭</text></svg>

// @downloadURL https://update.greasyfork.org/scripts/552432/Sora%E5%8E%BB%E6%B0%B4%E5%8D%B0%28%E6%8C%87%E7%BA%B9%E9%9A%8F%E6%9C%BA%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552432/Sora%E5%8E%BB%E6%B0%B4%E5%8D%B0%28%E6%8C%87%E7%BA%B9%E9%9A%8F%E6%9C%BA%E5%8C%96%29.meta.js
// ==/UserScript==



(function() {

    'use strict';



    // ========================================

    // 配置区域

    // ========================================

    const CONFIG = {

        // 是否启用调试日志

        DEBUG: true,

        // 指纹存储键名

        STORAGE_KEY: 'sorawm:fingerprint',

        // 是否每次页面加载都生成新指纹

        REGENERATE_ON_LOAD: true,

        // 是否拦截 FingerprintJS CDN

        BLOCK_FINGERPRINT_CDN: true,

        // 目标域名（留空则对所有域名生效）

        TARGET_DOMAINS: []

    };



    // ========================================

    // 工具函数

    // ========================================



    /**

     * 生成随机 UUID v4

     */

    function generateRandomUUID() {

        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {

            return crypto.randomUUID();

        }

        // 降级方案：手动生成 UUID

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

            const r = Math.random() * 16 | 0;

            const v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);

        });

    }



    /**

     * 生成类似原始降级方案的指纹

     */

    function generateFallbackFingerprint() {

        const randomPart = Math.random().toString(36).slice(2);

        const timePart = Date.now().toString(36);

        return `${timePart}-${randomPart}`;

    }



    /**

     * 生成随机指纹（混合策略）

     */

    function generateRandomFingerprint() {

        // 50% 概率使用 UUID，50% 使用降级方案

        return Math.random() > 0.5 ? generateRandomUUID() : generateFallbackFingerprint();

    }



    /**

     * 调试日志

     */

    function log(...args) {

        if (CONFIG.DEBUG) {

            console.log('[🎭 Anti-Fingerprint]', ...args);

        }

    }



    /**

     * 检查是否应该在当前域名生效

     */

    function shouldActivate() {

        if (CONFIG.TARGET_DOMAINS.length === 0) {

            return true;

        }

        const currentHost = window.location.hostname;

        return CONFIG.TARGET_DOMAINS.some(domain => currentHost.includes(domain));

    }



    // ========================================

    // 核心功能

    // ========================================



    /**

     * 劫持 localStorage

     */

    function hijackLocalStorage() {

        const originalSetItem = Storage.prototype.setItem;

        const originalGetItem = Storage.prototype.getItem;

        const originalRemoveItem = Storage.prototype.removeItem;



        // 存储随机指纹

        let randomFingerprint = generateRandomFingerprint();

        log('初始随机指纹:', randomFingerprint);



        // 劫持 setItem

        Storage.prototype.setItem = function(key, value) {

            if (key === CONFIG.STORAGE_KEY) {

                log('拦截指纹写入:', value, '→ 替换为:', randomFingerprint);

                return originalSetItem.call(this, key, randomFingerprint);

            }

            return originalSetItem.call(this, key, value);

        };



        // 劫持 getItem

        Storage.prototype.getItem = function(key) {

            if (key === CONFIG.STORAGE_KEY) {

                // 如果配置为每次重新生成

                if (CONFIG.REGENERATE_ON_LOAD) {

                    randomFingerprint = generateRandomFingerprint();

                    log('重新生成指纹:', randomFingerprint);

                }

                log('拦截指纹读取，返回随机值:', randomFingerprint);

                return randomFingerprint;

            }

            return originalGetItem.call(this, key);

        };



        // 劫持 removeItem

        Storage.prototype.removeItem = function(key) {

            if (key === CONFIG.STORAGE_KEY) {

                log('拦截指纹删除操作');

                return;

            }

            return originalRemoveItem.call(this, key);

        };

    }



    /**

     * 劫持 window 缓存变量

     */

    function hijackWindowCache() {

        let cachedFingerprint = generateRandomFingerprint();



        Object.defineProperty(unsafeWindow, '__cachedFingerprintId', {

            get: function() {

                if (CONFIG.REGENERATE_ON_LOAD) {

                    cachedFingerprint = generateRandomFingerprint();

                }

                log('拦截 window.__cachedFingerprintId 读取:', cachedFingerprint);

                return cachedFingerprint;

            },

            set: function(value) {

                log('拦截 window.__cachedFingerprintId 写入:', value, '→ 忽略');

                // 不实际设置，保持随机值

            },

            configurable: true

        });

    }



    /**

     * 拦截 FingerprintJS CDN 请求

     */

    function blockFingerprintCDN() {

        if (!CONFIG.BLOCK_FINGERPRINT_CDN) return;



        // 劫持动态 import

        const originalImport = unsafeWindow.import || window.import;

        if (originalImport) {

            unsafeWindow.import = window.import = function(url) {

                if (typeof url === 'string' && url.includes('openfpcdn.io/fingerprintjs')) {

                    log('拦截 FingerprintJS CDN 加载:', url);

                    // 返回一个模拟的 FingerprintJS 对象

                    return Promise.resolve({

                        load: () => Promise.resolve({

                            get: () => Promise.resolve({

                                visitorId: generateRandomFingerprint(),

                                confidence: { score: 1 }

                            })

                        })

                    });

                }

                return originalImport.call(this, url);

            };

        }



        // 拦截 fetch 请求

        const originalFetch = unsafeWindow.fetch;

        unsafeWindow.fetch = function(url, options) {

            if (typeof url === 'string' && url.includes('openfpcdn.io')) {

                log('拦截 FingerprintJS fetch 请求:', url);

                return Promise.reject(new Error('Blocked by Anti-Fingerprint'));

            }

            return originalFetch.call(this, url, options);

        };

    }



    /**

     * 劫持 fetch 请求，替换指纹参数

     */

    function hijackFetchRequests() {

        const originalFetch = unsafeWindow.fetch;



        unsafeWindow.fetch = function(url, options) {

            // 检查是否是 /api/parse 请求

            if (typeof url === 'string' && url.includes('/api/parse')) {

                try {

                    if (options && options.body) {

                        const body = JSON.parse(options.body);

                        if (body.fingerprint) {

                            const newFingerprint = generateRandomFingerprint();

                            log('拦截 /api/parse 请求，替换指纹:', body.fingerprint, '→', newFingerprint);

                            body.fingerprint = newFingerprint;

                            options.body = JSON.stringify(body);

                        }

                    }

                } catch (e) {

                    log('解析请求体失败:', e);

                }

            }

            return originalFetch.call(this, url, options);

        };

    }



    /**

     * 劫持 XMLHttpRequest

     */

    function hijackXHR() {

        const originalOpen = XMLHttpRequest.prototype.open;

        const originalSend = XMLHttpRequest.prototype.send;



        XMLHttpRequest.prototype.open = function(method, url, ...args) {

            this._url = url;

            return originalOpen.call(this, method, url, ...args);

        };



        XMLHttpRequest.prototype.send = function(body) {

            if (this._url && this._url.includes('/api/parse') && body) {

                try {

                    const data = JSON.parse(body);

                    if (data.fingerprint) {

                        const newFingerprint = generateRandomFingerprint();

                        log('拦截 XHR /api/parse 请求，替换指纹:', data.fingerprint, '→', newFingerprint);

                        data.fingerprint = newFingerprint;

                        body = JSON.stringify(data);

                    }

                } catch (e) {

                    log('解析 XHR 请求体失败:', e);

                }

            }

            return originalSend.call(this, body);

        };

    }



    /**

     * 清理现有指纹

     */

    function clearExistingFingerprint() {

        try {

            localStorage.removeItem(CONFIG.STORAGE_KEY);

            delete unsafeWindow.__cachedFingerprintId;

            log('已清理现有指纹缓存');

        } catch (e) {

            log('清理指纹失败:', e);

        }

    }



    // ========================================

    // 初始化

    // ========================================



    function init() {

        if (!shouldActivate()) {

            log('当前域名不在目标列表中，跳过激活');

            return;

        }



        log('🎭 反指纹追踪脚本已启动');

        log('配置:', CONFIG);



        // 清理现有指纹

        clearExistingFingerprint();



        // 启动所有劫持

        hijackLocalStorage();

        hijackWindowCache();

        blockFingerprintCDN();

        hijackFetchRequests();

        hijackXHR();



        log('✅ 所有劫持已就位，指纹将被随机化');

    }



    // 立即执行

    init();



    // 页面加载完成后再次确认

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', () => {

            log('DOM 加载完成，重新检查劫持状态');

        });

    }



})();