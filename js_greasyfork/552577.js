// ==UserScript==
// @name         Gemini版 asb姓名修改器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 asobiticket2.asobistore.jp 页面上自动修改指定元素为自己的名字，请在代码配置中手动修改
// @author       You
// @match        https://asobiticket2.asobistore.jp/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552577/Gemini%E7%89%88%20asb%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552577/Gemini%E7%89%88%20asb%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const targetClassName = 'companion-name'; // 我们要寻找的元素的 class
    const newName = 'ZHOU QIAOFEI';         // 您想要修改成的新名字

    // --- 核心逻辑 ---

    // 使用 MutationObserver 来监听页面的动态变化
    // 现代网站内容常常是动态加载的，直接在页面加载完后执行可能找不到元素
    // MutationObserver 可以确保即使元素是延迟出现的，我们也能捕捉到并修改它
    const observer = new MutationObserver((mutationsList, obs) => {
        // 查找页面上所有 class 包含 'companion-name' 的元素
        const targetElements = document.querySelectorAll(`.${targetClassName}`);

        if (targetElements.length > 0) {
            console.log(`[Tampermonkey] 找到了 ${targetElements.length} 个目标元素，准备修改...`);
            targetElements.forEach(element => {
                // 检查一下，只有当文本不是新名字时才修改，避免重复操作
                if (element.textContent.trim() !== newName) {
                    console.log(`[Tampermonkey] 正在将 "${element.textContent.trim()}" 修改为 "${newName}"`);
                    element.textContent = newName;
                }
            });
            // 理论上找到并修改后就可以停止监听了，但如果页面可能刷新局部内容，持续监听会更稳妥
            // obs.disconnect(); // 如果您确认只需要修改一次，可以取消这行注释
        }
    });

    // 配置 MutationObserver
    const config = {
        childList: true, // 监听子元素的添加或删除
        subtree: true    // 监听所有后代节点
    };

    // 开始监听整个文档的变化
    observer.observe(document.body, config);

    console.log('[Tampermonkey] 姓名修改脚本已启动，正在监听页面变化...');
})();
