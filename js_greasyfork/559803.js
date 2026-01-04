// ==UserScript==
// @name         知乎黑夜模式
// @namespace    https://github.com/girl-dream
// @version      1.0.0
// @description  知乎开启黑夜模式
// @author       girl-dream
// @match        https://*.zhihu.com/*
// @icon         https://www.zhihu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/559803/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/559803/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 检查当前URL是否已经包含theme参数
    const url = new URL(window.location.href)
    const hasThemeParam = url.searchParams.has('theme')
    const currentTheme = url.searchParams.get('theme')

    // 如果不是黑夜模式，则添加参数
    if (!hasThemeParam || currentTheme !== 'dark') {
        url.searchParams.set('theme', 'dark')

        // 使用replace而不是直接赋值，避免产生浏览器历史记录
        window.location.replace(url.toString())
    }
})();
