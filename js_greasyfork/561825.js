// ==UserScript==
// @name         AI全给我变成搜索引擎
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持 DeepSeek, Gemini, ChatGPT, Claude, 千问, 元宝, 豆包, Kimi, 文心一言。
// @author       boxjohn
// @match        *://gemini.google.com/*
// @match        *://chat.deepseek.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        https://www.kimi.com/*
// @match        *://yuanbao.tencent.com/*
// @match        https://www.doubao.com/*
// @match        https://www.qianwen.com/*
// @match        https://yiyan.baidu.com/*
// @match        *://chatglm.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561825/AI%E5%85%A8%E7%BB%99%E6%88%91%E5%8F%98%E6%88%90%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/561825/AI%E5%85%A8%E7%BB%99%E6%88%91%E5%8F%98%E6%88%90%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getParam = () => {
        const u = new URLSearchParams(window.location.search);
        if (u.has('q')) return u.get('q');
        try { return new URLSearchParams(window.parent.location.search).get('q'); } catch(e) { return null; }
    };

    const question = getParam();
    if (!question) return;

    const safeFillAndSend = (target) => {
        if (target.dataset.autoProcessed) return;

        // 豆包/元宝的特殊处理：等待可写状态
        if (target.hasAttribute('readonly')) return;

        target.dataset.autoProcessed = "true";
        console.log("🎯 正在执行高级注入...");
        target.focus();

        // 1. 清空内容并利用 execCommand 注入（防重、防框架失效）
        if (target.nodeName === 'DIV') target.innerHTML = ''; else target.value = '';
        const success = document.execCommand('insertText', false, question);

        // 2. 补漏：如果指令失败，强制赋值
        if (!success || (target.innerText || target.value || "").length === 0) {
            if (target.nodeName === 'DIV') target.innerText = question; else target.value = question;
        }

        // 3. 核心步骤：触发一系列事件，强行激活豆包的发送按钮状态
        const events = ['input', 'change', 'compositionend'];
        events.forEach(type => {
            target.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
        });

        // 4. 延迟发送逻辑（豆包需要较长的状态转换时间）
        setTimeout(() => {
            const btnSelectors = [
                //  --- Deepseek 专用 ---
                '.ds-icon-send',

                // --- 豆包 (Doubao) 专用 ---
                'button[data-testid="chat_input_send_button"]',
                'button:has(svg[class*="send"])',
                '#send-button',
                '[class*="sendButton"]',
                '[class*="send_button"]',

                // --- 元宝 (Yuanbao) 专用 ---
                'div[class*="send-btn"]',
                'button[class*="send-btn"]',

                // --- 通用选择器 ---
                'button[aria-label*="Send" i]',
                'button[aria-label*="发送" i]',
                'button[type="submit"]',
            ];

            let clicked = false;
            for (let s of btnSelectors) {
                const btns = document.querySelectorAll(s);
                for (let btn of btns) {
                    // 过滤条件：按钮必须在主视口可见，且不是侧边栏按钮
                    const rect = btn.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.top > 0;
                    const notSidebar = !btn.closest('nav') && !btn.closest('[class*="sidebar"]') && !btn.closest('.yb-nav');

                    if (isVisible && notSidebar) {
                        // 强制取消 disabled 状态（针对豆包有时候状态更新慢的情况）
                        if (btn.disabled) btn.disabled = false;
                        btn.click();
                        clicked = true;
                        console.log("✅ 成功通过按钮发送");
                        break;
                    }
                }
                if (clicked) break;
            }

            // 5. 终极兜底：Enter 键模拟
            if (!clicked) {
                const enter = new KeyboardEvent('keydown', {
                    bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13
                });
                target.dispatchEvent(enter);
                console.log("⌨️ 已通过回车键兜底发送");
            }

            // 6. 清理痕迹
            window.history.replaceState({}, '', window.location.pathname);
        }, 1500); // 豆包建议给 1.5s，确保 UI 状态完全就绪
    };

    const findTarget = () => {
        const selectors = [
            '#chat-input', // 豆包核心 ID
            '.ql-editor[contenteditable="true"]', // 豆包、元宝
            '#prompt-textarea',
            'div[contenteditable="true"][role="textbox"]',
            'textarea'
        ];
        for (let s of selectors) {
            const el = document.querySelector(s);
            if (el && el.offsetParent !== null && !el.closest('nav')) return el;
        }
        return null;
    };

    const observer = new MutationObserver(() => {
        const input = findTarget();
        if (input) safeFillAndSend(input);
    });

    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();