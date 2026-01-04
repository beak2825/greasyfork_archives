// ==UserScript==
// @name         GLM版 asobi 姓名修改器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将页面中所有 class 为 "companion-name" 的元素内容强制修改为自己的名字，需要手动修改代码配置
// @author       You
// @match        *://asobiticket2.asobistore.jp/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552578/GLM%E7%89%88%20asobi%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552578/GLM%E7%89%88%20asobi%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const newText = 'ZHOU QIAOFEI';
    // --- 配置区结束 ---

    /**
     * 执行修改操作的核心函数
     * 它会查找页面上所有符合条件的元素，并将其内容强制替换
     */
    function modifyCompanionNames() {
        // 使用选择器，查找所有 class 包含 'companion-name' 的 div
        const elements = document.querySelectorAll('div.companion-name');

        elements.forEach(element => {
            // 不再检查原始文本，直接修改为新文本
            if (element.textContent !== newText) { // 增加一个判断，避免重复修改
                element.textContent = newText;
                // 在控制台输出一条日志，方便调试和确认
                console.log(`[Tampermonkey] 已将一个同行人姓名强制修改为 "${newText}"。`);
            }
        });
    }

    /**
     * 设置一个观察器，用于监视DOM的变化
     * 当页面中有新元素被添加时，会触发我们的修改函数
     */
    const observer = new MutationObserver((mutations) => {
        // 对于每一个变化，我们都重新运行一次修改函数
        // 这样做虽然效率稍低，但能确保所有动态加载的元素都能被捕获到
        modifyCompanionNames();
    });

    // 配置观察器：监视整个文档的子元素变化
    observer.observe(document.body, {
        childList: true,    // 观察目标子节点的增删
        subtree: true       // 观察所有后代节点
    });

    // 在页面加载的初始阶段也执行一次，以防元素已经存在
    document.addEventListener('DOMContentLoaded', modifyCompanionNames);

})();
