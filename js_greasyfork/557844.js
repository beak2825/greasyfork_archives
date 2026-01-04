// ==UserScript==
// @name         网易邮箱外链自动跳转 (163/126)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击网易邮箱(163/126)中的"第三方网站跳转提醒"中的"普通打开"按钮，跳过确认步骤。
// @author       DeepCritical
// @match        *://mail.163.com/*
// @match        *://mail.126.com/*
// @match        *://email.163.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557844/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28163126%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557844/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28163126%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项：目标按钮的文字
    const TARGET_TEXT = "普通打开";

    // 核心点击函数
    function autoClickRedirect() {
        // 获取页面上所有的 div, span, button, a 元素
        // 这是一个广撒网的策略，因为无法确定网易具体的标签类型
        const candidates = document.querySelectorAll('div, span, button, a');

        for (let i = 0; i < candidates.length; i++) {
            let el = candidates[i];

            // 逻辑检查：
            // 1. 元素可见 (简单判断)
            // 2. 元素内的纯文本必须精确等于"普通打开" (防止误点包含该文字的长段落)
            if (el.innerText && el.innerText.trim() === TARGET_TEXT) {

                // 为了防止误操作，我们可以进一步检查它的父级或兄弟级是否有"安全浏览模式"字样
                // 但通常"普通打开"在邮箱页面里非常独特，直接点击风险很低。

                console.log("检测到跳转警告，正在自动点击...");
                el.click();

                // 找到并点击后，稍微从 DOM 列表中移除焦点，避免重复点击（虽然点击后页面通常会跳转）
                break;
            }
        }
    }

    // 创建观察器：监控页面元素变化
    // 因为这个弹窗是点链接后动态生成的，不是页面一加载就有的
    const observer = new MutationObserver((mutations) => {
        // 当页面有新元素插入时，尝试执行点击检查
        autoClickRedirect();
    });

    // 开始观察 document.body 的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完毕后也先试探性运行一次
    window.addEventListener('load', autoClickRedirect);

})();