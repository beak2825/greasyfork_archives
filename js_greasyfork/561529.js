// ==UserScript==
// @name         解码深层URL编码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将URL中的 %25253A%25252F%25252F 解码为 ://，%25252F 解码为 /
// @author       flaging
// @match        https://passport.weibo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561529/%E8%A7%A3%E7%A0%81%E6%B7%B1%E5%B1%82URL%E7%BC%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/561529/%E8%A7%A3%E7%A0%81%E6%B7%B1%E5%B1%82URL%E7%BC%96%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义需要替换的编码字符串和它们对应的解码后字符串
    const replacements = [
        { encoded: '%253A', decoded: ':' },
        { encoded: '%252F', decoded: '/' },
        { encoded: '%25252F', decoded:'/'},
        { encoded: '%25253A', decoded:':'},
    ];

    // 获取当前完整的 URL
    const currentUrl = window.location.href;
    console.log("origin url", currentUrl);

    // 尝试进行解码替换
    let newUrl = currentUrl;
    let hasChanges = false;

    replacements.forEach(replacement => {
        if (newUrl.includes(replacement.encoded)) {
            // 使用全局正则表达式替换所有匹配项
            const regex = new RegExp(replacement.encoded, 'g');
            newUrl = newUrl.replace(regex, replacement.decoded);
            hasChanges = true;
        }
    });
    console.log("new url", newUrl);

    // 如果 URL 发生了变化，则进行重定向
    if (hasChanges && newUrl !== currentUrl) {
        console.log('发现深层编码URL，正在解码重定向...');
        console.log('原URL:', currentUrl);
        console.log('新URL:', newUrl);
        // 使用 replaceState 避免产生新的历史记录条目 (可选，也可用 window.location.href = newUrl)
        // window.history.replaceState(null, null, newUrl);
        // 更直接的重定向，确保页面加载正确内容
        window.location.href = newUrl;
    }

    // 注意：如果重定向发生，此脚本的后续代码将不会在此页面执行。

})();
