// ==UserScript==
// @name         观测云取消查询限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截并处理HTTP请求
// @author       czy
// @match        *://cn4-console.guance.com/*
// @license      MIT
// @run-at		 document-start
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548334/%E8%A7%82%E6%B5%8B%E4%BA%91%E5%8F%96%E6%B6%88%E6%9F%A5%E8%AF%A2%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/548334/%E8%A7%82%E6%B5%8B%E4%BA%91%E5%8F%96%E6%B6%88%E6%9F%A5%E8%AF%A2%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        console.log('xhr request:', this._method, this._url, postData);
        if (this._url.includes("api/v1/df/asynchronous/query_data") && this._method.includes("POST") ) {
            let newPostData = postData.replace(/100/g, "1000");
            console.log('new request:', this._method, this._url, newPostData);
            return send.call(this, postData, arguments);
        } else {
            return send.apply(this, arguments);
        }
    };
})();