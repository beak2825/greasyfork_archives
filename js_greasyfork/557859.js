// ==UserScript==
// @name         linux.do静默回复--代替你按shift
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过拦截提交动作自动模拟 Shift+点击，实现回复后留在当前页（无需刷新和定位）
// @author       memor221 & gemini
// @match        https://linux.do/t/topic/*
// @match        https://idcflare.com/t/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557859/linuxdo%E9%9D%99%E9%BB%98%E5%9B%9E%E5%A4%8D--%E4%BB%A3%E6%9B%BF%E4%BD%A0%E6%8C%89shift.user.js
// @updateURL https://update.greasyfork.org/scripts/557859/linuxdo%E9%9D%99%E9%BB%98%E5%9B%9E%E5%A4%8D--%E4%BB%A3%E6%9B%BF%E4%BD%A0%E6%8C%89shift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：是否显示简单的提示 (true: 显示 / false: 静默)
    const SHOW_TOAST = true;

    /**
     * 核心逻辑：模拟带有 Shift 键的点击事件
     */
    function triggerShiftClick(target) {
        if (!target) return;

        const shiftClickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            shiftKey: true, // 关键：强制注入 Shift 键状态
            ctrlKey: false,
            altKey: false,
            metaKey: false
        });

        shiftClickEvent.__simulated_by_script = true;

        if (SHOW_TOAST) showToast();

        target.dispatchEvent(shiftClickEvent);
    }

    /**
     * 拦截鼠标点击 "回复" 按钮
     */
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-primary.create');
        if (!btn || !document.getElementById('reply-control').contains(btn)) return;

        if (e.shiftKey || e.__simulated_by_script) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        console.log('✨ [原地回复] 拦截点击，转为 Shift+Click');
        triggerShiftClick(btn);
    }, true);

    /**
     * 拦截键盘快捷键 Ctrl + Enter / Meta + Enter
     */
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const replyControl = document.getElementById('reply-control');
            if (replyControl && replyControl.contains(e.target)) {
                const btn = replyControl.querySelector('.btn-primary.create');
                if (btn) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✨ [原地回复] 拦截快捷键，转为 Shift+Click');
                    triggerShiftClick(btn);
                }
            }
        }
    }, true);

    // 提示框工具 (已居中 + 蓝色)
    function showToast() {
        let toast = document.getElementById('stay-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'stay-toast';
            // CSS 修改重点：居中 + 蓝色背景
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                background: rgba(33, 150, 243, 0.95); /* 蓝色背景 */
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                pointer-events: none;
                transition: opacity 0.3s;
                font-family: sans-serif;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            toast.innerText = '📌 已回复';
            document.body.appendChild(toast);
        }
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
    }

})();