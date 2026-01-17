// ==UserScript==
// @name         Gemini/Qwen Cmd+J 快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用 Cmd+J 快速在 Gemini/Qwen 中新建对话
// @author       You
// @match        https://gemini.google.com/*
// @match        https://chat.qwen.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562851/GeminiQwen%20Cmd%2BJ%20%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562851/GeminiQwen%20Cmd%2BJ%20%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // 这里的 metaKey 代表 Mac 上的 Command 键
        // 这里的 KeyJ 代表 J 键。如果你想要 K 键，改成 'KeyK'
        if (e.metaKey && e.code === 'KeyJ') {

            // 1. 阻止浏览器默认行为 (Cmd+J 在 Chrome 默认是打开下载内容)
            e.preventDefault();
            e.stopPropagation();

            // 2. 执行新建对话
            // 方式 A: 直接点击界面上的“新建对话”按钮 (更平滑，不刷新)
            // 寻找带有特定 aria-label 的按钮，Google 可能会改 class，但 aria-label 相对稳定
            const newChatBtn = document.querySelector('button[aria-label="发起新对话"]') || document.querySelector('a[aria-label="发起新对话"]'); // 备用选择器
            if (newChatBtn) {
                newChatBtn.click();
                console.log("已触发新建对话按钮");
            }
            const qwNewBt = document.querySelector('div[class="sidebar-entry-list-content"]');
            if (qwNewBt){
                qwNewBt.click();
                console.log("已触发新建对话按钮");
            }
        }
    });
})();