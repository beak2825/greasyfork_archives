// ==UserScript==
// @name         QQ开放平台高阶能力解锁
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解锁Markdown模版权限
// @author       bilibili22
// @match        https://q.qq.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561004/QQ%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E9%AB%98%E9%98%B6%E8%83%BD%E5%8A%9B%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/561004/QQ%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E9%AB%98%E9%98%B6%E8%83%BD%E5%8A%9B%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const T = '/cgi-bin/msg_tpl/switch', _open = XMLHttpRequest.prototype.open, _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(m, u, ...a) { this._u = u; return _open.apply(this, [m, u, ...a]); };
    XMLHttpRequest.prototype.send = function(...a) {
        if (this._u?.includes(T)) {
            const x = this, _osc = x.onreadystatechange;
            x.onreadystatechange = function() {
                if (x.readyState === 4 && x.status === 200) {
                    const r = x.responseText.replace(/"allowed_markdown"\s*:\s*0/g, '"allowed_markdown":1');
                    Object.defineProperty(x, 'responseText', { get: () => r });
                    Object.defineProperty(x, 'response', { get: () => r });
                }
                _osc?.apply(this, arguments);
            };
        }
        return _send.apply(this, a);
    };
})();
