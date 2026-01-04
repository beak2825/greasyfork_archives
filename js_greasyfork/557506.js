// ==UserScript==
// @name         BOSS 岗位优势标签打印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  示例脚本：在控制台打印候选人的优势标签
// @match        https://www.zhipin.com/*
// @grant        none
// @license      hehao
// @downloadURL https://update.greasyfork.org/scripts/557506/BOSS%20%E5%B2%97%E4%BD%8D%E4%BC%98%E5%8A%BF%E6%A0%87%E7%AD%BE%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557506/BOSS%20%E5%B2%97%E4%BD%8D%E4%BC%98%E5%8A%BF%E6%A0%87%E7%AD%BE%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义关键字列表
    const keywords = ["Android", "framework", "android", "Framework", "Java"];

    // ⭐ 高亮函数
    function highlightNode(item) {
        item.style.backgroundColor = "yellow";
        item.style.color = "black";
        item.style.fontWeight = "bold";
        item.style.padding = "4px";
        item.style.borderRadius = "4px";
        item.style.setProperty("white-space", "normal", "important");
    }

    // ⭐ 检查并高亮匹配节点
    function checkAndHighlight() {
        const geekDescList = document.querySelectorAll('.geek-desc .content');
    
        for (const item of geekDescList) {
            if (item.dataset.highlighted) continue; // 避免重复处理
            const text = item.innerText.trim();
            if (!text) continue;
            // ⭐⭐ 全部命中逻辑：所有关键字都必须包含
            const matched = keywords.every(kw => text.includes(kw));
            item.dataset.highlighted = "false"
            if (matched) {
                highlightNode(item);
                item.dataset.highlighted = "true"; // 标记已经处理过
                console.log("全部关键词命中 → 已高亮：", text);
            }
        }
    }
    
    // ⭐ 页面初次加载 3 秒后执行一次
    setTimeout(checkAndHighlight, 3000);
    
    // ⭐ 监听新增节点（滚动加载触发）
    const observer = new MutationObserver(() => {
        checkAndHighlight();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();