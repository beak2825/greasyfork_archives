// ==UserScript==
// @name         拦截XHR请求
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截并处理HTTP请求
// @author       czy
// @match        *://console.huaweicloud.com/cse2/*
// @license      MIT
// @run-at		 document-start
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548092/%E6%8B%A6%E6%88%AAXHR%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/548092/%E6%8B%A6%E6%88%AAXHR%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        if (url.includes("&limit=50") && method.includes("GET") ) {
            url = url.substring(0, url.length - 9);
            this._changeUrl = true;
        }
        console.log('xhr request:', this._method, this._url, url, this._changeUrl);
        if (this._changeUrl) {
            return open.call(this, method, url, arguments);
        } else {
            return open.apply(this, arguments);
        }
    };

    XHR.send = function (postData) {
        console.log('xhr request:', this._method, this._url, postData);
        return send.apply(this, arguments);
    };

    const originalXHR = window.XMLHttpRequest;

    // 重写XMLHttpRequest构造函数
    window.XMLHttpRequest = function() {
        var xhr = new originalXHR();

        // 监听响应完成事件
        xhr.addEventListener('load', function() {
            console.log('xhr responseText:', this._url, this.responseText);
        });

        return xhr;
    };
})();