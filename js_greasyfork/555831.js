// ==UserScript==
// @name         强制新窗口在tab中打开
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  强制新窗口在tab中打开1
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555831/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E5%9C%A8tab%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/555831/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E5%9C%A8tab%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 1. 保存原始的 window.open 方法（确保拿到浏览器原生方法）
    const originalOpen = window.open;

    // 2. 重写 window.open 方法（优化：传递所有参数，避免丢失features）
    window.open = function(url, target, features) {
        // 强制 target 为 _blank（忽略页面传入的 target）
        const newTarget = "_blank";
        // 关键：把 features 也传给原始方法（比如页面要设置窗口大小，虽我们强制新标签，但不丢参数）
        return originalOpen.call(window, url, newTarget);
    };

})();