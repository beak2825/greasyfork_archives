// ==UserScript==
// @name         注入微信JS环境变量
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在window全局变量中添加__wxjs_environment属性，支持自定义值
// @author       You
// @match        https://staging-platform.developer.miui.com/*
// @match        *://onebox.developer.mi.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555370/%E6%B3%A8%E5%85%A5%E5%BE%AE%E4%BF%A1JS%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555370/%E6%B3%A8%E5%85%A5%E5%BE%AE%E4%BF%A1JS%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 - 可以在这里修改环境值
    const config = {
        environmentValue: 'miniprogram', // 可选值: 'miniprogram', 'browser' 等
        writable: true,                  // 是否可写
        configurable: true,              // 是否可配置
        enumerable: true                 // 是否可枚举
    };

    // 删除已存在的属性（如果有）
    if (window.hasOwnProperty('__wxjs_environment')) {
        delete window.__wxjs_environment;
    }

    // 添加属性
    Object.defineProperty(window, '__wxjs_environment', {
        value: config.environmentValue,
        writable: config.writable,
        configurable: config.configurable,
        enumerable: config.enumerable
    });

    console.log('[debug] __wxjs_environment 已注入:', window.__wxjs_environment);
})();