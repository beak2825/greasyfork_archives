// ==UserScript==
// @name         Gamer520 静默拦截弹窗 (Pro版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过劫持SweetAlert2接口，从源头禁止弹窗显示，无闪烁
// @author       Gemini
// @match        https://www.gamer520.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558904/Gamer520%20%E9%9D%99%E9%BB%98%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97%20%28Pro%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558904/Gamer520%20%E9%9D%99%E9%BB%98%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97%20%28Pro%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('【Gamer520-Pro】: 正在初始化拦截系统...');

    // 定义一个假的 SweetAlert2 替代品
    // 关键点：SweetAlert2 通常返回一个 Promise，所以我们也必须返回 Promise
    // 否则网站原来的代码可能会因为报错而卡死 (.then is not a function)
    const noopSwal = {
        fire: function() {
            console.log('【Gamer520-Pro】: 成功拦截了一次弹窗请求！');
            // 伪造一个“用户已关闭”的返回结果
            return Promise.resolve({
                isConfirmed: false,
                isDenied: false,
                isDismissed: true,
                dismiss: 'cancel'
            });
        },
        // 兼容其他可能调用的方法，全部设为空函数
        close: () => {},
        showLoading: () => {},
        mixin: () => noopSwal // 支持 mixin 链式调用
    };

    // 1. 尝试直接定义 window.Swal
    // 使用 Object.defineProperty 防止网站后续覆盖我们的对象
    try {
        Object.defineProperty(unsafeWindow, 'Swal', {
            get: () => noopSwal,
            set: (val) => {
                console.log('【Gamer520-Pro】: 网站试图加载真实的 SweetAlert2，已被阻止。');
                // 这里什么都不做，即忽略网站的赋值操作
            },
            configurable: false // 禁止配置，防止被删除
        });

        // 兼容旧版 swal 全局变量
        Object.defineProperty(unsafeWindow, 'swal', {
            get: () => noopSwal.fire, // swal(...) 直接调用通常等同于 fire
            set: () => {},
            configurable: false
        });

    } catch (e) {
        console.log('【Gamer520-Pro】: 劫持遇到小问题 (通常不影响使用):', e);
    }

    console.log('【Gamer520-Pro】: 拦截陷阱已布设完毕。');
})();