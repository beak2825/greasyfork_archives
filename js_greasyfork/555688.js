// ==UserScript==
// @name         隐藏百度搜索右上角昵称
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将百度搜索右上角的昵称替换为星号或随机词
// @author       Flactine
// @match        *://www.baidu.com/*
// @grant        none
// @license      MIT
// @icon         data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/555688/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%B5%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555688/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%B5%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成随机字符串
    function randomString(length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    function maskName(name) {
        // 这里可以选择星号或随机名字
        const useRandom = true; // 改成 false 则使用星号
        if (useRandom) {
            return '百度用户_' + randomString(8);
        } else {
            return '*'.repeat(name.length);
        }
    }

    function hideBaiduName() {
        // 可能的昵称元素选择器（根据百度页面结构）
        const selectors = [
            '#s_username_top',         // 登录后右上角用户名
            '.user-name',              // 一些新版 UI
            '.s-top-username'          // 旧版搜索页
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.trim()) {
                const oldName = el.innerText.trim();
                // 避免重复替换
                if (!oldName.startsWith('Baidu_') && !oldName.startsWith('*')) {
                    el.innerText = maskName(oldName);
                }
            }
        }
    }

    // 初次执行
    hideBaiduName();

    // 动态变化时重复执行
    const observer = new MutationObserver(hideBaiduName);
    observer.observe(document.body, {childList: true, subtree: true});

})();
