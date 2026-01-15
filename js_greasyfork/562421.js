// ==UserScript==
// @license MIT
// @name         Make Newsmth Great Again!
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  拦截 ajax_session/logout，支持 login 失败 fallback 到 m.newsmth.net
// @match        https://*.newsmth.net/*
// @match        https://*.mysmth.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      m.newsmth.net
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562421/Make%20Newsmth%20Great%20Again%21.user.js
// @updateURL https://update.greasyfork.org/scripts/562421/Make%20Newsmth%20Great%20Again%21.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const URL_SESSION = 'ajax_session.json';
    const URL_LOGOUT = 'ajax_logout.json';
    const URL_LOGIN = 'user/ajax_login.json';
    const MOBILE_LOGIN_URL = 'https://m.newsmth.net/user/login';

    function log(msg, ...args) {
        console.log(`%c[Mock] ${msg}`, 'color: #1E90FF; font-weight: bold;', ...args);
    }

    function getUserIdFromCookie() {
        const match = document.cookie.match(/main\[UTMPUSERID\]=([^;]+)/);
        return match ? match[1] : 'guest';
    }

    function clearLoginCookies() {
        log('Clearing login cookies...');
        const keys = ['main[UTMPUSERID]', 'main[UTMPKEY]', 'main[UTMPNUM]', 'main[XWJOKE]'];
        keys.forEach(key => {
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/nForum;`;
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.newsmth.net`;
        });
    }

    function getSessionMock() {
        const uid = getUserIdFromCookie();
        const isGuest = (uid === 'guest');
        return {
            "id": uid, "ajax_st": 1, "ajax_code": "0005", "ajax_msg": "操作成功",
            "is_login": !isGuest, "user_name": uid,
            "face_url": "//static.mysmth.net/nForum/img/face_default_m.jpg",
            "face_width": 0, "face_height": 0, "gender": "m", "astro": "水瓶座",
            "life": "论坛元老", "lifelevel": 0, "score_user": 100, "score_manager": 0,
            "level": "用户", "post_count": 9999, "login_count": 100,
            "first_login_time": "2020-01-01", "last_login_time": "2026-01-12",
            "last_login_ip": "127.0.0.1", "status": "在线",
            "is_hide": false, "is_register": true, "is_activated": true,
            "new_msg": 0, "new_at": 0, "new_reply": 0, "new_like": 0, "new_mail": false, "full_mail": false
        };
    }

    function getLogoutMock() {
        return { "ajax_st": 1, "ajax_code": "0005", "ajax_msg": "操作成功" };
    }

    function getLoginSuccessMock(id) {
         return { "id": id, "ajax_st": 1, "ajax_code": "0005", "ajax_msg": "操作成功", "is_login": true, "user_name": id };
    }

    // --- Mock Failure Response for Frontend ---
    function getLoginErrorMock(msg) {
        return { "ajax_st": 0, "ajax_code": "0000", "ajax_msg": msg || "登录超时，请重试" };
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (...args) {
        const url = args[1];
        const async = args[2];
        this._mockType = null;
        if (typeof url === 'string') {
            if (url.includes(URL_SESSION)) this._mockType = 'SESSION';
            else if (url.includes(URL_LOGOUT)) this._mockType = 'LOGOUT';
            else if (url.includes(URL_LOGIN)) this._mockType = 'LOGIN';
        }
        this._async = async !== false;
        return originalOpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        if (this._mockType) {
            const xhr = this;
            const mockType = this._mockType;
            const postBody = args[0];

            const doMock = (customData) => {
                let data = customData || (mockType === 'LOGOUT' ? getLogoutMock() : getSessionMock());
                if (mockType === 'LOGOUT' && !customData) clearLoginCookies();

                const text = JSON.stringify(data);
                log(`Injecting ${mockType} response.`, data);

                Object.defineProperty(xhr, 'readyState', { value: 4 });
                Object.defineProperty(xhr, 'status', { value: 200 });
                Object.defineProperty(xhr, 'responseText', { value: text });
                Object.defineProperty(xhr, 'response', { value: text });

                if (xhr.onreadystatechange) xhr.onreadystatechange();
                if (xhr.onload) xhr.onload();
            };

            // Login Logic
            if (mockType === 'LOGIN' && this._async) {
                log('Intercepting Async Login...');

                fetch(this.responseURL || '/nForum/user/ajax_login.json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                    body: postBody
                })
                .then(res => {
                    if (res.ok) return res.text();
                    throw new Error(`Status ${res.status}`);
                })
                .then(text => {
                    log('Real Login Success.');
                    Object.defineProperty(xhr, 'readyState', { value: 4 });
                    Object.defineProperty(xhr, 'status', { value: 200 });
                    Object.defineProperty(xhr, 'responseText', { value: text });
                    Object.defineProperty(xhr, 'response', { value: text });
                    if (xhr.onreadystatechange) xhr.onreadystatechange();
                    if (xhr.onload) xhr.onload();
                })
                .catch(err => {
                    log(`Real Login Failed (${err.message}). Fallback to Mobile Login...`);

                    GM_xmlhttpRequest({
                        method: "POST",
                        url: MOBILE_LOGIN_URL,
                        data: postBody,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            // 移除 Origin/Referer 可能避免触发某些反爬策略或 header 检查错误
                            // "Origin": "https://m.newsmth.net",
                            // "Referer": "https://m.newsmth.net/index"
                        },
                        onload: function(response) {
                            log('Mobile Login Status:', response.status);

                            if (response.status >= 200 && response.status < 400) {
                                // 修正正则：匹配 &id=xxx 或 ^id=xxx
                                const match = postBody.match(/(?:^|&)id=([^&]+)/);
                                const userId = match ? decodeURIComponent(match[1]) : 'user';
                                log('Login Success (Mobile Fallback). User:', userId);
                                doMock(getLoginSuccessMock(userId));
                            } else {
                                log('Mobile Login Failed. Return error to frontend.');
                                // 返回错误给前端，不假装成功
                                doMock(getLoginErrorMock(`备用登录失败 (Status: ${response.status})`));
                            }
                        },
                        onerror: function(err) {
                            console.error('[Mock] Mobile Login Network Error:', err);
                            doMock(getLoginErrorMock("备用登录网络错误"));
                        },
                        ontimeout: function() {
                            doMock(getLoginErrorMock("备用登录超时"));
                        }
                    });
                });
                return;
            }

            // Session/Logout Logic
            if (mockType === 'SESSION' || mockType === 'LOGOUT') {
                 if (this._async) {
                     try { originalSend.apply(this, args); } catch(e){}
                     setTimeout(() => doMock(), 0);
                     return;
                 } else {
                     try {
                        originalSend.apply(xhr, args);
                        if (xhr.status === 200) return;
                     } catch(e) {}
                     doMock();
                     return;
                 }
            }
        }
        return originalSend.apply(this, args);
    };
})();

