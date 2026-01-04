// ==UserScript==
// @name         飞书的文本复制|右键菜单
// @namespace    https://bytedance.com
// @version      0.2
// @description  让你的飞书更好用
// @author       tudou-skyblue
// @match        *://*.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554949/%E9%A3%9E%E4%B9%A6%E7%9A%84%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%7C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/554949/%E9%A3%9E%E4%B9%A6%E7%9A%84%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%7C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==
;(function () {

    // 移除所有已注册的copy监听器(需要在页面加载前执行)
    const _addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'copy') {
            return; // 阻止注册
        }
        return _addEventListener.call(this, type, listener, options);
    };

    // 修改右键限制
    const bodyAddEventListener = document.body.addEventListener
    document.body.addEventListener = function (type, listener, options) {
        bodyAddEventListener.call(
            document.body,
            type,
            event => {
                if (type === "contextmenu") {
                    return true
                }
                return listener(event)
            },
            options
        )
    }
})()