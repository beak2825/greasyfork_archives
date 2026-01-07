// ==UserScript==
// @name         Google AI Studio - 聊天界面美化 / Chat Interface Optimizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化 Google AI Studio 聊天界面：为 User 和 Model 添加不同底色；修复底部点赞按钮遮挡文字的问题。
// @author       Liuyadong
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561671/Google%20AI%20Studio%20-%20%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96%20%20Chat%20Interface%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/561671/Google%20AI%20Studio%20-%20%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96%20%20Chat%20Interface%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    // 用户 (User) 背景色
    const USER_BG_COLOR = 'rgba(0, 120, 212, 0.15)';
    const USER_BORDER = '1px solid rgba(0, 120, 212, 0.3)';

    // 模型 (Model) 背景色
    const MODEL_BG_COLOR = 'rgba(0, 168, 107, 0.15)';
    const MODEL_BORDER = '1px solid rgba(0, 168, 107, 0.3)';
    // ===========================================

    // 通用样式应用函数
    function applyStyle(element, bgColor, borderColor, isModel = false) {
        if (!element || element.dataset.colored === 'true') return;

        element.style.backgroundColor = bgColor;
        element.style.border = borderColor;
        element.style.borderRadius = '8px';

        // 基础内边距
        element.style.paddingTop = '12px';
        element.style.paddingLeft = '12px';
        element.style.paddingRight = '12px';

        // === 关键修复：针对 Model，底部多留出空间给按钮 ===
        if (isModel) {
            // 给底部留出 45px 的空间，防止文字被按钮遮挡
            element.style.paddingBottom = '45px';

            // 顺便处理一下内部的 footer，让它背景透明，更好看
            // 使用你提供的类名 .turn-footer
            const footer = element.querySelector('.turn-footer');
            if (footer) {
                footer.style.backgroundColor = 'transparent'; // 去掉原来的深色背景
                footer.style.marginTop = '5px'; //稍微再往下推一点
            }
        } else {
            // 用户不需要那个按钮空间，保持默认
            element.style.paddingBottom = '12px';
        }

        element.dataset.colored = 'true'; // 标记已处理
    }

    function colorizeChats() {
        // ===========================================
        // 1. 处理模型 (Model)
        // ===========================================
        const modelBoxes = document.querySelectorAll('div.chat-turn-container.model');

        modelBoxes.forEach(box => {
            const text = box.innerText || "";

            // 过滤 Thoughts
            if (text.includes('Expand to view') || text.includes('Thinking') || text.includes('思考过程')) {
                return;
            }

            // 这里的 true 参数表示这是 Model，需要特殊处理底部间距
            applyStyle(box, MODEL_BG_COLOR, MODEL_BORDER, true);
        });

        // ===========================================
        // 2. 处理用户 (User)
        // ===========================================
        const userBoxes = document.querySelectorAll('div.chat-turn-container.user');

        // 优先尝试类名定位
        if (userBoxes.length > 0) {
            userBoxes.forEach(box => {
                applyStyle(box, USER_BG_COLOR, USER_BORDER, false);
            });
        } else {
            // 备用方案：标签定位
            const xpath = "//*[text()='User' or text()='用户']";
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0; i < result.snapshotLength; i++) {
                const labelNode = result.snapshotItem(i);
                if (!labelNode.offsetParent) continue;

                let targetBox = labelNode.nextElementSibling;
                if (!targetBox && labelNode.parentElement) {
                    targetBox = labelNode.parentElement.nextElementSibling;
                }

                if (targetBox && (targetBox.tagName === 'DIV' || targetBox.tagName.includes('CHUNK'))) {
                    applyStyle(targetBox, USER_BG_COLOR, USER_BORDER, false);
                }
            }
        }
    }

    // 启动监听
    setTimeout(colorizeChats, 500);
    setTimeout(colorizeChats, 1500);
    setTimeout(colorizeChats, 3000);

    const observer = new MutationObserver((mutations) => {
        colorizeChats();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();