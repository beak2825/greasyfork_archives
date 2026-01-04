// ==UserScript==
// @name         jAccount Cookie☆
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  让甲亢无须频繁登录
// @author       Young-Lord
// @license      MIT
// @match        https://jaccount.sjtu.edu.cn/*
// @icon         https://www.sjtu.edu.cn/resource/assets/img/ico/favicon.png
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/553840/jAccount%20Cookie%E2%98%86.user.js
// @updateURL https://update.greasyfork.org/scripts/553840/jAccount%20Cookie%E2%98%86.meta.js
// ==/UserScript==

// 关于 https://jaccount.sjtu.edu.cn/* ：这是编辑 Cookie 必须的。

// Save the original unsafeWindow.$.ajax and override it with a wrapper that:
// - If url === "ulogin", sends the request with GM_xmlhttpRequest / GM.xmlHttpRequest and console.logs response headers,
//   then calls the original success/error/complete callbacks with a jqXHR-like object.
// - Otherwise, calls the original saved $.ajax.

(function () {
    if (typeof unsafeWindow === 'undefined' || !unsafeWindow.$ || typeof unsafeWindow.$.ajax !== 'function') {
        console.warn('unsafeWindow.$.ajax not found — nothing to override');
        return;
    }

    // Save original
    var _origAjax = unsafeWindow.$.ajax;

    function parseSetCookieHeaderValue(cookieStr) {
        // cookieStr 是单个 Set-Cookie 值，不包含前缀 "set-cookie:"，例如:
        // "JAVisitedSites=fasdwda; Secure; HttpOnly"
        const parts = cookieStr.split(';').map(p => p.trim());
        const nameValue = parts.shift();
        const eqIdx = nameValue.indexOf('=');
        if (eqIdx === -1) return null;
        const name = nameValue.slice(0, eqIdx).trim();
        const value = nameValue.slice(eqIdx + 1).trim();

        const obj = { name, value };
        let hasExpiration = false;

        for (const attr of parts) {
            if (!attr) continue;
            const [attrNameRaw, ...rest] = attr.split('=');
            const attrName = attrNameRaw.trim().toLowerCase();
            const attrVal = rest.join('=').trim(); // 有些值里可能含有 '='

            if (attrName === 'path') {
                if (attrVal) obj.path = attrVal;
            } else if (attrName === 'expires') {
                // Expires: parse to seconds since epoch
                const t = Date.parse(attrVal);
                if (!isNaN(t)) {
                    obj.expirationDate = Math.floor(t / 1000);
                    hasExpiration = true;
                }
            } else if (attrName === 'max-age') {
                // Max-Age 优先于 Expires：将其转换为绝对时间（秒）
                const s = parseInt(attrVal, 10);
                if (!isNaN(s)) {
                    obj.expirationDate = Math.floor(Date.now() / 1000) + s;
                    hasExpiration = true;
                }
            } else if (attrName === 'secure') {
                obj.secure = true;
            } else if (attrName === 'httponly') {
                obj.httpOnly = true;
            }
            // 其他属性（Domain, SameSite 等）按要求不传递
        }

        // session 逻辑：如果没有 expiration，则为会话 cookie（session: true），否则 session: false
        obj.session = !hasExpiration;

        // 只保留示例中要求的字段（并且剔除 undefined）
        const output = {};
        output.name = obj.name;
        output.value = obj.value;
        if (obj.path) output.path = obj.path;
        if (typeof obj.expirationDate !== 'undefined') output.expirationDate = obj.expirationDate;
        if (obj.secure) output.secure = true;
        if (obj.httpOnly) output.httpOnly = true;
        if (typeof obj.session !== 'undefined') output.session = obj.session;

        return output;
    }

    function processHeadersAndSetCookies(headers) {
        // 查找所有 set-cookie 行（忽略大小写）
        const re = /^set-cookie:\s*(.+)$/gim;
        const cookies = [];
        let m;
        while ((m = re.exec(headers)) !== null) {
            const raw = m[1];
            const parsed = parseSetCookieHeaderValue(raw);
            if (parsed) cookies.push(parsed);
        }

        // 对每个 cookie 调用 GM_cookie("set", {...})（仅当该函数存在时）
        const results = [];
        for (const c of cookies) {
            if (typeof GM_cookie === 'function') {
                GM_cookie.set(c, function(error) {
                    if (error) {
                        alert(error);
                    } else {
                        // console.log('Cookie set successfully.');
                    }
                });
            } else {
                // 若环境中无 GM_cookie，先打印对象并返回它
                results.push({ cookie: c, note: "GM_cookie not available in this environment" });
            }
        }

        return results;
    }



    // Helper: build query string
    function toQueryString(data) {
        if (data == null) return '';
        try {
            if (unsafeWindow.$ && typeof unsafeWindow.$.param === 'function') {
                return unsafeWindow.$.param(data);
            }
        } catch (e) { /* ignore cross-scope */ }
        if (typeof data === 'string') return data;
        try {
            return new URLSearchParams(data).toString();
        } catch (e) {
            var parts = [];
            for (var k in data) {
                if (Object.prototype.hasOwnProperty.call(data, k)) {
                    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
                }
            }
            return parts.join('&');
        }
    }

    // Create minimal jqXHR-like object from GM response
    function makeFakeXhr(resp) {
        var responseHeaders = resp && resp.responseHeaders ? resp.responseHeaders : '';
        return {
            status: resp && resp.status || 0,
            statusText: resp && resp.statusText || '',
            responseText: resp && resp.responseText || '',
            response: resp && resp.response || undefined,
            responseHeaders: responseHeaders,
            getResponseHeader: function (name) {
                var re = new RegExp('^' + name + ':\\s*(.*)$', 'im');
                var m = responseHeaders.match(re);
                return m ? m[1] : null;
            },
            getAllResponseHeaders: function () {
                return responseHeaders;
            }
        };
    }

    // The overriding function supports either $.ajax(settings) or $.ajax(url, settings)
    let newAjax = function () {
        var args = Array.prototype.slice.call(arguments);
        var options = {};

        if (typeof args[0] === 'string') {
            options = args[1] || {};
            options.url = args[0];
        } else if (typeof args[0] === 'object') {
            options = args[0];
        } else {
            // Unknown form -> call original
            return _origAjax.apply(unsafeWindow.$, args);
        }

        var url = options.url;
        // If not the special endpoint, delegate to original
        if (url !== 'ulogin') {
            return _origAjax.apply(unsafeWindow.$, args);
        }

        // Prepare method/data/headers
        var method = (options.type || options.method || 'GET').toUpperCase();
        var data = options.data;
        var headers = Object.assign({}, options.headers || {});
        var contentType = headers['Content-Type'] || headers['content-type'] || options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';

        var payload = (method === 'GET' || method === 'HEAD') ? null : (typeof data === 'string' ? data : toQueryString(data));

        var details = {
            method: method,
            url: url,
            headers: headers
        };
        if (payload !== null) {
            details.data = payload;
            if (!details.headers['Content-Type'] && !details.headers['content-type']) {
                details.headers['Content-Type'] = contentType;
            }
        }

        // Handlers to call original callbacks in jQuery signature
        function callSuccess(parsedData, textStatus, fakeXhr) {
            try {
                if (typeof options.success === 'function') {
                    options.success.call(options.context || unsafeWindow, parsedData, textStatus, fakeXhr);
                }
            } catch (e) {
                console.error('error in success callback', e);
            }
        }
        function callError(fakeXhr, textStatus, errorThrown) {
            try {
                if (typeof options.error === 'function') {
                    options.error.call(options.context || unsafeWindow, fakeXhr, textStatus, errorThrown);
                }
            } catch (e) {
                console.error('error in error callback', e);
            }
        }
        function callComplete(fakeXhr, textStatus) {
            try {
                if (typeof options.complete === 'function') {
                    options.complete.call(options.context || unsafeWindow, fakeXhr, textStatus);
                }
            } catch (e) {
                console.error('error in complete callback', e);
            }
        }

        function updateSetCookieExpires(headers) {
            // 计算 10 年后的日期（保留当前时分秒，按年增加）
            const expDate = new Date();
            expDate.setFullYear(expDate.getFullYear() + 10);
            const expStr = expDate.toUTCString(); // HTTP 使用 UTC 字符串格式，如 "Sun, 27 Oct 2035 08:29:56 GMT"

            // 使用正则匹配每一行的 set-cookie: 开头（忽略大小写、多行匹配）
            // 对每个匹配的 cookie 值，移除已有的 Expires 或 Max-Age 属性，然后追加新的 Expires
            return headers.replace(/(^set-cookie:\s*)(.+)$/gim, (match, headerPrefix, cookieValue) => {
                let v = cookieValue;
                // 删除已有的 Expires=...（可能包含逗号和空格，直到下一个分号或行尾）
                v = v.replace(/;\s*Expires=[^;]*/i, '');
                // 删除已有的 Max-Age=...
                v = v.replace(/;\s*Max-Age=[^;]*/i, '');
                // 清除结尾多余的分号和空白
                v = v.replace(/\s*;\s*$/g, '');
                // 追加新的 Expires 属性
                return headerPrefix + v + '; Expires=' + expStr;
            });
        }


        function handleResponse(response) {
            // Log headers per requirement
            response.responseHeaders = updateSetCookieExpires(response.responseHeaders)
            processHeadersAndSetCookies(response.responseHeaders)
            // console.log(response.responseHeaders, typeof response.responseHeaders);
            // return 0;
            try {
                // alert('GM response headers for ' + url + ':\n' + response.responseHeaders.toString());
            } catch (e) {
                // console.log('GM response (headers unavailable)', e);
            }

            var fakeXhr = makeFakeXhr(response);
            var successStatus = response && response.status >= 200 && response.status < 300;
            var textStatus = successStatus ? 'success' : 'error';

            var parsed;
            try {
                parsed = JSON.parse(response.responseText);
            } catch (e) {
                parsed = response.responseText;
            }

            if (successStatus) {
                callSuccess(parsed, textStatus, fakeXhr);
            } else {
                callError(fakeXhr, textStatus, response && response.statusText || 'error');
            }
            callComplete(fakeXhr, textStatus);
        }

        function handleError(response) {
            // console.log('GM request error for', url, response);
            var fakeXhr = makeFakeXhr(response || { status: 0, statusText: 'error', responseText: '' });
            callError(fakeXhr, 'error', response && response.statusText || 'error');
            callComplete(fakeXhr, 'error');
        }

        // Try GM_xmlhttpRequest (callback API) first, then GM.xmlHttpRequest (promise API)
        if (typeof GM_xmlhttpRequest === 'function') {
            details.onload = handleResponse;
            details.onerror = handleError;
            try {
                var gmRequest = GM_xmlhttpRequest(details);
                // Return an object that at least exposes abort for compatibility
                return {
                    abort: function () {
                        try { if (gmRequest && typeof gmRequest.abort === 'function') gmRequest.abort(); } catch (e) {}
                    }
                };
            } catch (e) {
                console.error('GM_xmlhttpRequest threw, falling back to original $.ajax', e);
                return _origAjax.apply(unsafeWindow.$, args);
            }
        } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
            try {
                var promise = GM.xmlHttpRequest(details);
                // promise resolves to response
                Promise.resolve(promise).then(handleResponse).catch(handleError);
                return {
                    abort: function () {
                        // GM.xmlHttpRequest promise variant may not expose abort; best-effort noop
                        console.warn('abort not supported for GM.xmlHttpRequest promise wrapper');
                    }
                };
            } catch (e) {
                console.error('GM.xmlHttpRequest threw, falling back to original $.ajax', e);
                return _origAjax.apply(unsafeWindow.$, args);
            }
        } else {
            console.warn('No GM_xmlhttpRequest / GM.xmlHttpRequest available; using original $.ajax for', url);
            return _origAjax.apply(unsafeWindow.$, args);
        }
    };

    if (location.pathname === "/jaccount/jalogin") {
        unsafeWindow.$.ajax = newAjax;
    }
})();
