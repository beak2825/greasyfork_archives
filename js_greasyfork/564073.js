// ==UserScript==
// @name         Kimi,Gemini,CSSPicker 增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  恢复Kimi,Gemini网站聊天内容的最大宽度,CSSPicker网站编辑器高度调整
// @author       忘忧
// @match        https://www.kimi.com/*
// @match        https://gemini.google.com/*
// @match        https://www.csspicker.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564073/Kimi%2CGemini%2CCSSPicker%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/564073/Kimi%2CGemini%2CCSSPicker%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function restoreMaxWidth() {
        //------------------------------------------------------ gemini ---------------------------------------------------
        // 恢复聊天内容列表的max-width
        document.querySelectorAll('.conversation-container').forEach(el => {
            el.style.maxWidth = '';
            el.style.setProperty('max-width', '70vw', 'important');
        });
        document.querySelectorAll('.conversation-container user-query').forEach(el => {
            el.style.maxWidth = '';
            el.style.setProperty('max-width', 'none', 'important');
        });
        document.querySelectorAll('.user-query-bubble-with-background:not(.edit-mode)').forEach(el => {
            el.style.maxWidth = '';
            el.style.setProperty('max-width', '50vw', 'important');
        });
         // 恢复聊天编辑器的max-width
        document.querySelectorAll('.ui-improvements-phase-1 .input-area-container').forEach(el => {
            el.style.maxWidth = '';
            el.style.setProperty('max-width', '60vw', 'important');
        });
        //-------------------------------------------------------- kimi ---------------------------------------------------------
        // 恢复聊天内容列表的max-width
        document.querySelectorAll('.chat-content-list').forEach(el => {
            el.style.maxWidth = '';
            el.style.setProperty('max-width', '70vw', 'important');
        });

        // 恢复聊天编辑器的max-width
        const chatEditor = document.querySelector('.chat-editor');
        if (chatEditor) {
            chatEditor.style.maxWidth = '';
            chatEditor.style.setProperty('max-width', '60vw', 'important');
        }

        // 输入框最大高度
//         document.querySelectorAll('.chat-editor[data-v-c15b4f77] .chat-input-editor-container').forEach(el => {
//             el.style.maxWidth = '';
//             el.style.setProperty('max-height', '50vw', 'important');
//         });

        // 快速回到底部的按钮
        const toBottom = document.querySelector('.chat-action .to-bottom');
        if (toBottom) {
            toBottom.style.right = '';
            toBottom.style.setProperty('right', '50%', 'important');
        }
        //---------------------------------------------------- css-to-tailwind -----------------------------------------------------
        // 展示框的高重置
        document.querySelectorAll('.container-inner iframe').forEach(el => {
            el.style.height = '';
            el.style.setProperty('height', '500px', 'important');
        });
        document.querySelectorAll('#__next').forEach(el => {
            el.style.height = '';
            el.style.setProperty('height', '500px', 'important');
        });

    }

    // 页面加载完成后执行
    function init() {
        restoreMaxWidth();

        // 监听DOM变化，确保动态加载的内容也能被处理
        const observer = new MutationObserver(function(mutations) {
            restoreMaxWidth();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 定期检查，确保样式没有被其他脚本覆盖
    setInterval(restoreMaxWidth, 1000);
})();