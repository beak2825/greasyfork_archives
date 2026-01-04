// ==UserScript==
// @name         Qwen 聊天框大小
// @namespace    http://tampermonkey.net/
// @version      2025.09.04
// @description  降低聊天框高度
// @author       dlutor
// @match        https://chat.qwen.ai
// @match        https://chat.qwen.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwen.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550535/Qwen%20%E8%81%8A%E5%A4%A9%E6%A1%86%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550535/Qwen%20%E8%81%8A%E5%A4%A9%E6%A1%86%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
  // 插入全局样式（对动态元素也生效）
  const style = document.createElement('style');
  style.textContent = `
    #chat-input {
      min-height: 10px !important;
      height: 34px !important;
    }
  `;
  document.head.appendChild(style);
    // 2. 定义“守护函数”：找到目标元素并强制隐藏
    function guardAndHideToolbar() {
        // 请根据你的实际情况调整这个选择器 👇
        // 推荐使用“结构特征”而不是动态类名
        const toolbar = document.querySelector('.chat-message-input-container-inner');

        if (toolbar) {
            // 强制隐藏（覆盖框架重置）
            toolbar.children[1].style.display = 'none';
            //toolbar.style.setProperty('display', 'none', 'important');
            // 可选：加个标记，避免重复操作（但框架可能清除）
            // toolbar.setAttribute('data-hidden-by-script', 'true');
            // console.log('🛡️ 守护者：工具栏已被隐藏', toolbar);
        }
    }

    // 3. 立即执行一次
    guardAndHideToolbar();

    // 4. 监听 DOM 变化 —— 一旦有新元素插入，立即检查并隐藏
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // 只要有节点被添加，就尝试隐藏
                guardAndHideToolbar();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,   // 监听直接子节点变化
        subtree: true      // 监听所有后代节点
    });

    // 5. 【可选】每 500ms 强制检查一次（应对框架暴力重置）
    setInterval(guardAndHideToolbar, 1000);
    // Your code here...
})();