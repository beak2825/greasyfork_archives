// ==UserScript==
// @name         GM_API
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  将GM_API暴露到全局,可以在控制台的GMAPI中直接调用
// @grant      GM.addElement
// @grant      GM.addStyle
// @grant      GM.addValueChangeListener
// @grant      GM.audio
// @grant      GM.cookie
// @grant      GM.deleteValue
// @grant      GM.deleteValues
// @grant      GM.download
// @grant      GM.getResourceText
// @grant      GM.getResourceUrl
// @grant      GM.getTab
// @grant      GM.getTabs
// @grant      GM.getValue
// @grant      GM.getValues
// @grant      GM.info
// @grant      GM.listValues
// @grant      GM.log
// @grant      GM.notification
// @grant      GM.openInTab
// @grant      GM.registerMenuCommand
// @grant      GM.removeValueChangeListener
// @grant      GM.saveTab
// @grant      GM.setClipboard
// @grant      GM.setValue
// @grant      GM.setValues
// @grant      GM.unregisterMenuCommand
// @grant      GM.webRequest
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_audio
// @grant      GM_cookie
// @grant      GM_deleteValue
// @grant      GM_deleteValues
// @grant      GM_download
// @grant      GM_getResourceText
// @grant      GM_getResourceURL
// @grant      GM_getTab
// @grant      GM_getTabs
// @grant      GM_getValue
// @grant      GM_getValues
// @grant      GM_info
// @grant      GM_listValues
// @grant      GM_log
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_removeValueChangeListener
// @grant      GM_saveTab
// @grant      GM_setClipboard
// @grant      GM_setValue
// @grant      GM_setValues
// @grant      GM_unregisterMenuCommand
// @grant      GM_webRequest
// @grant      GM_xmlhttpRequest
// @grant      unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      window.onurlchange

// @noframes


// @match       *://*/*
// @connect     *
// @storageName   CCIC_Claim

// @downloadURL https://update.greasyfork.org/scripts/557655/GM_API.user.js
// @updateURL https://update.greasyfork.org/scripts/557655/GM_API.meta.js
// ==/UserScript==


/**
 * 改进版的 HTTP 请求函数，使用统一的缓存存储结构
 * @param {string} url - 请求的URL
 * @param {string|URLSearchParams} data - 表单数据
 * @param {Object} json - JSON数据
 * @param {Object} headers - 自定义请求头
 * @param {number} CachexpiryMs - 缓存过期时间,默认5,设为0时不缓存
 * @returns {Promise<Object>} 返回包含响应数据的Promise
 */
async function httpRequest(url, data = "", json = "", headers = {} ,CachexpiryMs = 0) {

    // 防止同时传递data和json参数
    if (data && json) {
        throw new Error("Cannot provide both 'data' and 'json' parameters. Choose one.");
    }

    // 缓存相关功能
    const generateCacheKey = () => {
        // 生成唯一的缓存键
        const requestData = {
            url,
            data,
            json,
            headers
        };
        return btoa(encodeURIComponent(JSON.stringify(requestData)));
    };

    // 检查是否有可用缓存
    const getCachedResponse = () => {
        try {
            if (CachexpiryMs <= 0) return null; // 不缓存时直接返回null
            
            const cacheData = localStorage.getItem('http_cache');
            if (!cacheData) return null;

            const cacheObj = JSON.parse(cacheData);
            const cacheKey = generateCacheKey();
            const cachedItem = cacheObj[cacheKey];

            if (cachedItem) {
                // 检查是否过期
                if (Date.now() - cachedItem.timestamp < cachedItem.expiry) {
                    // 重构缓存的数据为mockResponse格式
                    const cachedData = cachedItem.data;
                    return {
                        ok: cachedData.ok,
                        status: cachedData.status,
                        statusText: cachedData.statusText,
                        type: cachedData.type,
                        redirected: cachedData.redirected,
                        url: cachedData.url,
                        text: () => cachedData._text,
                        json: () => {
                            if (cachedData._contentType && cachedData._contentType.includes('application/json')) {
                                return JSON.parse(cachedData._text);
                            }
                            try {
                                return JSON.parse(cachedData._text);
                            } catch (e) {
                                console.error('Failed to parse JSON:', e);
                                return {};
                            }
                        },
                        html: () => {
                            if (cachedData._contentType && cachedData._contentType.includes('text/html')) {
                                return new DOMParser().parseFromString(cachedData._text, 'text/html');
                            }
                            console.error('Response is not HTML');
                            return new DOMParser().parseFromString('', 'text/html');
                        }
                    };
                } else {
                    // 删除过期缓存
                    delete cacheObj[cacheKey];
                    localStorage.setItem('http_cache', JSON.stringify(cacheObj));
                }
            }
        } catch (e) {
            console.warn('Failed to retrieve cached response:', e);
        }
        return null;
    };

    // 缓存响应
    const cacheResponse = (responseData, expiryMs = CachexpiryMs * 60 * 1000) => {
        try {
            if (CachexpiryMs <= 0) return; // 不缓存时直接返回
            
            const cacheKey = generateCacheKey();
            let cacheObj = {};

            // 获取现有缓存
            const existingCache = localStorage.getItem('http_cache');
            if (existingCache) {
                cacheObj = JSON.parse(existingCache);
            }

            // 添加新缓存项
            cacheObj[cacheKey] = {
                data: responseData,
                timestamp: Date.now(),
                expiry: expiryMs
            };

            localStorage.setItem('http_cache', JSON.stringify(cacheObj));
        } catch (e) {
            console.warn('Failed to cache response:', e);
        }
    };

    // 清理所有过期缓存
    const cleanExpiredCache = () => {
        try {
            const cacheData = localStorage.getItem('http_cache');
            if (!cacheData) return;

            const cacheObj = JSON.parse(cacheData);
            const currentTime = Date.now();
            let hasExpired = false;

            // 删除过期项
            for (const key in cacheObj) {
                if (currentTime - cacheObj[key].timestamp >= cacheObj[key].expiry) {
                    delete cacheObj[key];
                    hasExpired = true;
                }
            }

            // 如果有删除的项，更新存储
            if (hasExpired) {
                localStorage.setItem('http_cache', JSON.stringify(cacheObj));
            }
        } catch (e) {
            console.warn('Failed to clean expired cache:', e);
        }
    };

    // 定期清理过期缓存（每10次请求清理一次）
    if (Math.random() < 0.1) {
        cleanExpiredCache();
    }

    // 首先检查缓存
    const cachedResponse = getCachedResponse();
    if (cachedResponse) {
        console.debug(`正在获取缓存... ${url}`);
        return cachedResponse;
    }

    // 保留用户自定义Content-Type，仅在未提供时自动设置
    let contentTypeHeader = headers['Content-Type'] || headers['content-type'];
    if (!contentTypeHeader) {
        if (data) {
            contentTypeHeader = 'application/x-www-form-urlencoded';
        } else if (json) {
            contentTypeHeader = 'application/json;charset=UTF-8';
        } else {
            contentTypeHeader = 'text/html';
        }
    }

    const options = {
        method: data || json ? "POST" : "GET",
        credentials: "include",
        headers: {
            ...headers,
            'Content-Type': contentTypeHeader
        },
    };

    if (data) {
        options.body = new URLSearchParams(data).toString();
    }

    if (json) {
        options.body = JSON.stringify(json);
    }

    try {
        console.debug(`httpRequest请求数据 URL,options`, url,options);
        const response = await fetch(url, options);
        // 提前读取响应文本，避免多次读取流
        const text = await response.text();
        // 获取响应的实际Content-Type
        const responseContentType = response.headers.get('Content-Type');

        // 改进错误处理，根据实际响应类型解析错误信息
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            if (responseContentType && responseContentType.includes('application/json')) {
                try {
                    const errorData = JSON.parse(text);
                    errorMessage += `, message: ${errorData.message || JSON.stringify(errorData)}`;
                } catch (e) {
                    // errorMessage += `, message: ${text}`;
                }
            } else {
                // errorMessage += `, message: ${text}`;
            }
            console.error('httpRequest请求错误',errorMessage,{url,options});
        }

        // 按需解析响应，避免提前解析
        const mockResponse = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            redirected: response.redirected,
            url: response.url,
            body: response.body,
            text: () => text,
            json: () => {
                if (responseContentType && responseContentType.includes('application/json')) {
                    return JSON.parse(text);
                }
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    return {};
                }
            },
            html: () => {
                if (responseContentType && responseContentType.includes('text/html')) {
                    return new DOMParser().parseFromString(text, 'text/html');
                }
                console.error('Response is not HTML');
                return new DOMParser().parseFromString('', 'text/html');
            }
        };

        // 修改缓存成功的响应部分 - 只有当CachexpiryMs > 0时才缓存
        if (CachexpiryMs > 0 && 
            responseContentType &&
            (responseContentType.includes('text/') ||
             responseContentType.includes('application/json'))) {
            // 创建用于缓存的简化响应对象
            const cacheableResponse = {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                type: response.type,
                redirected: response.redirected,
                url: response.url,
                // 只缓存原始文本数据，而不是函数
                _text: text,
                _contentType: responseContentType
            };

            cacheResponse(cacheableResponse);
        }

        return mockResponse;

    } catch (error) {
        throw error;
    }
}

// 导出缓存管理函数
httpRequest.cache = {
cleanExpired: () => {
    try {
    const cacheData = localStorage.getItem('http_cache');
    if (!cacheData) return;

    const cacheObj = JSON.parse(cacheData);
    const currentTime = Date.now();
    let hasExpired = false;

    for (const key in cacheObj) {
        if (currentTime - cacheObj[key].timestamp >= cacheObj[key].expiry) {
        delete cacheObj[key];
        hasExpired = true;
        }
    }

    if (hasExpired) {
        localStorage.setItem('http_cache', JSON.stringify(cacheObj));
    }
    } catch (e) {
    console.warn('Failed to clean expired cache:', e);
    }
},
clear: () => {
    try {
    localStorage.removeItem('http_cache');
    } catch (e) {
    console.warn('Failed to clear cache:', e);
    }
},
getStats: () => {
    try {
    const cacheData = localStorage.getItem('http_cache');
    if (!cacheData) return { total: 0, valid: 0, expired: 0 };

    const cacheObj = JSON.parse(cacheData);
    const currentTime = Date.now();
    let valid = 0;
    let expired = 0;

    for (const key in cacheObj) {
        if (currentTime - cacheObj[key].timestamp < cacheObj[key].expiry) {
        valid++;
        } else {
        expired++;
        }
    }

    return {
        total: Object.keys(cacheObj).length,
        valid,
        expired
    };
    } catch (e) {
    console.warn('Failed to get cache stats:', e);
    return { total: 0, valid: 0, expired: 0 };
    }
}
};

/**
 * 发起网络请求的静态方法，支持多种数据格式和自定义配置
 * @param {string} url - 请求的目标URL（必填）
 * @param {Object|string} [data=""] - 需要发送的表单数据（可选）
 * @param {Object} [json=""] - 需要发送的JSON数据（可选）
 * @param {Object} [headers={}] - 自定义请求头配置（可选）
 * @returns {Promise<Object>} 返回包含响应数据的Promise对象，解析后获得：
 *  - {boolean} ok - 请求是否成功（状态码2xx）
 *  - {number} status - HTTP状态码
 *  - {Function} json() - 解析响应为JSON对象
 *  - {Function} text() - 解析响应为文本字符串
 *  - {Function} blob() - 解析响应为Blob对象
 *  - {Function} html() - 解析响应为HTML文档
 */
async function GMfetch(url, data = "", json = "", headers = {}) {
    // 构建请求配置对象
    const options = {
        method: data || json ? "POST" : "GET",
        headers: {
            ...headers,
            "Content-Type": data
                ? "application/x-www-form-urlencoded"
                : json
                    ? "application/json;charset=UTF-8"
                    : "text/plain"
        },
        data: data ? new URLSearchParams(data).toString() : null,
        json: json ? JSON.stringify(json) : null,
        timeout: 30000
    };

    // 创建并返回Promise封装的GM_xmlhttpRequest请求
    return new Promise((resolve, reject) => {
        // 配置并发起原生GM_xmlhttpRequest请求
        GM_xmlhttpRequest({
            method: options.method,
            url,
            headers: options.headers,
            data: options.data || options.json,
            // 处理成功响应
            onload: async (response) => {
                try {
                    // 解析响应头中的Content-Type
                    const contentType = response.responseHeaders
                        .split('\n')
                        .find(header => header.toLowerCase().startsWith('content-type'));

                    // 构建标准化的响应对象
                    const mockResponse = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.finalUrl,
                        json: () => JSON.parse(response.responseText),
                        text: () => response.responseText,
                        blob: () => new Blob([response.response]),
                        html: () => new DOMParser().parseFromString(response.responseText, "text/html")
                    };
                    resolve(mockResponse);
                } catch (error) {
                    reject(new Error(`Response parsing failed: ${error.message}`));
                }
            },
            // 处理网络请求错误
            onerror: (error) => {
                reject(new Error(`GM_xmlhttpRequest failed: ${error.statusText}`));
            },
            // 处理请求超时
            ontimeout: () => {
                reject(new Error('Request timed out'));
            },
            timeout: options.timeout
        });
    });
}


const requests = {
    /**
     * 核心请求函数
     * @param {string} method - HTTP请求方法（GET, POST, PUT, DELETE等）
     * @param {string} url - 请求的URL地址
     * @param {Object} kwargs - 请求配置对象，可包含以下属性：
     *   - params: {Object} URL查询参数对象
     *   - headers: {Object} 请求头对象
     *   - data: {*} 请求体数据
     *   - json: {Object} JSON格式请求体数据
     *   - timeout: {number} 请求超时时间
     *   - cookies: {Object} 请求Cookie对象
     * @returns {Promise} 返回Promise对象，解析为Python风格的响应对象
     */
    request: function (method, url, kwargs = {}) {
        return new Promise((resolve, reject) => {
            // 1. 处理 URL 参数 (params={a:1, b:2} -> ?a=1&b=2)
            if (kwargs.params) {
                const params = new URLSearchParams(kwargs.params);
                if (url.includes('?')) {
                    url += '&' + params.toString();
                } else {
                    url += '?' + params.toString();
                }
            }

            // 2. 处理 headers
            let headers = kwargs.headers || {};

            // 3. 处理数据体 (data vs json)
            let data = kwargs.data || null;

            // 模拟 Python requests.post(url, json={...}) 的行为
            if (kwargs.json) {
                headers['Content-Type'] = 'application/json';
                data = JSON.stringify(kwargs.json);
            }
            // 模拟 Python requests.post(url, data={...}) 默认表单行为
            else if (data && typeof data === 'object' && !(data instanceof FormData) && !(data instanceof Blob)) {
                // 如果没指定 Content-Type，且是普通对象，转为表单格式
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    data = new URLSearchParams(data).toString();
                }
            }

            // 4. 发送请求
            GM_xmlhttpRequest({
                method: method.toUpperCase(),
                url: url,
                headers: headers,
                data: data,
                timeout: kwargs.timeout || 0,
                cookie: kwargs.cookies ? Object.entries(kwargs.cookies).map(([k, v]) => `${k}=${v}`).join('; ') : undefined,

                onload: (response) => {
                    // 5. 封装 Response 对象，使其像 Python
                    const pyResponse = {
                        // 原始属性
                        finalUrl: response.finalUrl,
                        headers: response.responseHeaders, // 这是一个字符串，如果需要字典需额外解析

                        // Python 风格属性
                        status_code: response.status,
                        text: response.responseText,
                        content: response.response, // 二进制或其他类型
                        ok: response.status >= 200 && response.status < 300,
                        url: response.finalUrl,

                        // 方法
                        json: function () {
                            try {
                                return JSON.parse(this.text);
                            } catch (e) {
                                console.error("Response is not valid JSON");
                                return {};
                            }
                        },
                        blob: () => new Blob([response.response]),
                        html: () => new DOMParser().parseFromString(response.responseText, "text/html"),
                        raise_for_status: function () {
                            if (!this.ok) {
                                throw new Error(`HTTPError: ${this.status_code} Client Error`);
                            }
                        }
                    };
                    resolve(pyResponse);
                },
                onerror: (err) => reject(err),
                ontimeout: () => reject(new Error('Timeout'))
            });
        });
    },

    /**
     * GET请求快捷方法
     * @param {string} url - 请求的URL地址
     * @param {Object} kwargs - 请求配置对象
     * @returns {Promise} 返回Promise对象
     */
    get: (url, kwargs) => requests.request('GET', url, kwargs),

    /**
     * POST请求快捷方法
     * @param {string} url - 请求的URL地址
     * @param {Object} kwargs - 请求配置对象
     * @returns {Promise} 返回Promise对象
     */
    post: (url, kwargs) => requests.request('POST', url, kwargs),

    /**
     * PUT请求快捷方法
     * @param {string} url - 请求的URL地址
     * @param {Object} kwargs - 请求配置对象
     * @returns {Promise} 返回Promise对象
     */
    put: (url, kwargs) => requests.request('PUT', url, kwargs),

    /**
     * DELETE请求快捷方法
     * @param {string} url - 请求的URL地址
     * @param {Object} kwargs - 请求配置对象
     * @returns {Promise} 返回Promise对象
     */
    delete: (url, kwargs) => requests.request('DELETE', url, kwargs),
};

function elmGetter() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = 'css';
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector ||
        elProto.mozMatchesSelector || elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;
    let defaultTimeout = 0;
    let defaultOnTimeout = () => null;
    function addObserver(target, callback) {
        const observer = new MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target, 'attr');
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node, 'insert');
                    if (observer.canceled) return;
                }
            }
        });
        observer.canceled = false;
        observer.observe(target, { childList: true, subtree: true, attributes: true });
        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }
    function addFilter(target, filter) {
        let listener = listeners.get(target);
        if (!listener) {
            listener = {
                filters: new Set(),
                remove: addObserver(target, (el, reason) => listener.filters.forEach(f => f(el, reason)))
            };
            listeners.set(target, listener);
        }
        listener.filters.add(filter);
    }
    function removeFilter(target, filter) {
        const listener = listeners.get(target);
        if (!listener) return;
        listener.filters.delete(filter);
        if (!listener.filters.size) {
            listener.remove();
            listeners.delete(target);
        }
    }
    function query(selector, parent, root, curMode, reason) {
        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? parent : null;
                const checkParent = parent !== root && matches.call(parent, selector);
                return checkParent ? parent : parent.querySelector(selector);
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? $(parent) : null;
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return jNodes.length ? $(jNodes.get(0)) : null;
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                return ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 9, null).singleNodeValue;
            }
        }
    }
    function queryAll(selector, parent, root, curMode, reason) {
        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? [parent] : [];
                const checkParent = parent !== root && matches.call(parent, selector);
                const result = parent.querySelectorAll(selector);
                return checkParent ? [parent, ...result] : [...result];
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? [$(parent)] : [];
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return $.map(jNodes, el => $(el));
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                const xPathResult = ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 7, null);
                const result = [];
                for (let i = 0; i < xPathResult.snapshotLength; i++) {
                    result.push(xPathResult.snapshotItem(i));
                }
                return result;
            }
        }
    }
    function isJquery(jq) {
        return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }
    function getOne(selector, parent, timeout) {
        const curMode = mode;
        return new Promise(resolve => {
            const node = query(selector, parent, parent, curMode);
            if (node) return resolve(node);
            let timer;
            const filter = (el, reason) => {
                const node = query(selector, el, parent, curMode, reason);
                if (node) {
                    removeFilter(parent, filter);
                    timer && clearTimeout(timer);
                    resolve(node);
                }
            };
            addFilter(parent, filter);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    removeFilter(parent, filter);
                    const result = defaultOnTimeout(selector);
                    if (result !== void 0) resolve(result);
                }, timeout);
            }
        });
    }
    return {
        get currentSelector() {
            return mode;
        },
        get(selector, ...args) {
            let parent = typeof args[0] !== 'number' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const timeout = args[0] || defaultTimeout;
            if (Array.isArray(selector)) {
                return Promise.all(selector.map(s => getOne(s, parent, timeout)));
            }
            return getOne(selector, parent, timeout);
        },
        each(selector, ...args) {
            let parent = typeof args[0] !== 'function' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const callback = args[0];
            const curMode = mode;
            const refs = new WeakSet();
            for (const node of queryAll(selector, parent, parent, curMode)) {
                refs.add(curMode === 'jquery' ? node.get(0) : node);
                if (callback(node, false) === false) return;
            }
            const filter = (el, reason) => {
                for (const node of queryAll(selector, el, parent, curMode, reason)) {
                    const _el = curMode === 'jquery' ? node.get(0) : node;
                    if (refs.has(_el)) break;
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return removeFilter(parent, filter);
                    }
                }
            };
            addFilter(parent, filter);
        },
        create(domString, ...args) {
            const returnList = typeof args[0] === 'boolean' && args.shift();
            const parent = args[0];
            const template = doc.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild;
            if (!node) return null;
            parent ? parent.appendChild(node) : node.remove();
            if (returnList) {
                const list = {};
                node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                list[0] = node;
                return list;
            }
            return node;
        },
        selector(desc) {
            switch (true) {
                case isJquery(desc):
                    $ = desc;
                    return mode = 'jquery';
                case !desc || typeof desc.toLowerCase !== 'function':
                    return mode = 'css';
                case desc.toLowerCase() === 'jquery':
                    for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                        if (isJquery(jq)) {
                            $ = jq;
                            break;
                        }
                    }
                    return mode = $ ? 'jquery' : 'css';
                case desc.toLowerCase() === 'xpath':
                    return mode = 'xpath';
                default:
                    return mode = 'css';
            }
        },
        onTimeout(...args) {
            defaultTimeout = typeof args[0] === 'number' && args.shift() || defaultTimeout;
            defaultOnTimeout = args[0] || defaultOnTimeout;
        }
    };
}

class SupabaseClient {
    // 1. 必须在类顶部声明私有字段
    #url;
    #key;

    constructor(url, key) {
        this.#url = url ? url.replace(/\/$/, "") : '';
        this.#key = key || '';

        if (!this.#url || !this.#key) {
            throw new Error('请提供有效的 Supabase URL 和 Key 配置');
        }
    }

    // GET 请求
    select(table, filter = '', select = '*') {
        let url = `${this.#url}/rest/v1/${table}?select=${select}`;
        if (filter) url += `&${filter}`;
        return this.request('GET', url);
    }

    // POST 插入
    insert(table, data) {
        const url = `${this.#url}/rest/v1/${table}`;
        return this.request('POST', url, data);
    }

    // 修改后的 UPSERT 操作
    upsert(table, data, onConflictColumn = 'id') { // 默认冲突列为 id，你可以传入 '特征码'
        // 关键点：在 URL 后面加上 ?on_conflict=字段名
        const url = `${this.#url}/rest/v1/${table}?on_conflict=${onConflictColumn}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    "apikey": this.#key,
                    "Authorization": `Bearer ${this.#key}`,
                    "Content-Type": "application/json",
                    // resolution=merge-duplicates 表示如果冲突就执行更新
                    "Prefer": "resolution=merge-duplicates,return=representation"
                },
                data: JSON.stringify(data),
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            resolve(res.responseText);
                        }
                    } else {
                        console.error(`Supabase Error (${res.status}):`, res.responseText);
                        reject({ status: res.status, text: res.responseText });
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    // PATCH 更新
    update(table, data, filter) {
        if (!filter) return Promise.reject(new Error("更新操作必须提供 filter"));
        const url = `${this.#url}/rest/v1/${table}?${filter}`;
        return this.request('PATCH', url, data);
    }

    // DELETE 删除
    delete(table, filter) {
        if (!filter) return Promise.reject(new Error("删除操作必须提供 filter"));
        const url = `${this.#url}/rest/v1/${table}?${filter}`;
        return this.request('DELETE', url);
    }

    // 通用请求方法
    request(method, url, body = null) {
        console.debug(`%c[Supabase Request] ${method}: ${url}`, 'color: blue');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    "apikey": this.#key, // 使用私有变量
                    "Authorization": `Bearer ${this.#key}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                data: body ? JSON.stringify(body) : null,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            resolve(res.responseText);
                        }
                    } else {
                        console.error(`Supabase Error (${res.status}):`, res.responseText);
                        reject({ status: res.status, text: res.responseText });
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }
}


if (typeof globalThis.GMAPI !== 'undefined') { globalThis.GMAPI = {} }

GMAPI = GM;
GMAPI.addElement = GM_addElement;
GMAPI.addStyle = GM_addStyle;
GMAPI.addValueChangeListener = GM_addValueChangeListener;
// GMF.audio=GM_audio;
GMAPI.cookie = GM_cookie;
GMAPI.deleteValue = GM_deleteValue;
GMAPI.deleteValues = GM_deleteValues;
GMAPI.download = GM_download;
GMAPI.getResourceText = GM_getResourceText;
GMAPI.getResourceUrl = GM_getResourceURL;
GMAPI.getTab = GM_getTab;
GMAPI.getTabs = GM_getTabs;
GMAPI.getValue = GM_getValue;
GMAPI.getValues = GM_getValues;
GMAPI.info = GM_info;
GMAPI.listValues = GM_listValues;
GMAPI.log = GM_log;
GMAPI.notification = GM_notification;
GMAPI.openInTab = GM_openInTab;
GMAPI.registerMenuCommand = GM_registerMenuCommand;
GMAPI.removeValueChangeListener = GM_removeValueChangeListener;
GMAPI.saveTab = GM_saveTab;
GMAPI.setClipboard = GM_setClipboard;
GMAPI.setValue = GM_setValue;
GMAPI.setValues = GM_setValues;
GMAPI.unregisterMenuCommand = GM_unregisterMenuCommand;
// GMF.webRequest=GM_webRequest
GMAPI.xmlhttpRequest = GM_xmlhttpRequest;
GMAPI.unsafeWindow = unsafeWindow;
GMAPI.window = window;



GMAPI.SupabaseClient = SupabaseClient;
GMAPI.GMfetch = GMfetch;
GMAPI.httpRequest = httpRequest;
GMAPI.requests = requests;
GMAPI.elmGetter=elmGetter()


Object.freeze(GMAPI);
if (Object.isFrozen(GMAPI)) { console.log("GMAPI生效", GMAPI) };

// })()
