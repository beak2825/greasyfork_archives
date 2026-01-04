// ==UserScript==
// @name         超星学习通粘贴限制解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动解除超星学习通考试页面的文本框粘贴限制，允许直接复制粘贴文本。
// @match        *://*.chaoxing.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561340/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/561340/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 注入到 iframe 内部的核心逻辑
     * 通过接管 paste 事件并使用 insertText 命令模拟输入，绕过编辑器的拦截机制
     */
    const patchLogic = `
        (function() {
            // 1. 在捕获阶段拦截粘贴事件
            window.addEventListener('paste', function(e) {
                // 停止事件传播，防止触发页面原有的限制脚本
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                // 获取剪贴板中的纯文本
                let text = '';
                if (e.clipboardData) {
                    text = e.clipboardData.getData('text/plain');
                } else if (window.clipboardData) {
                    text = window.clipboardData.getData('Text');
                }

                if (text) {
                    // 使用浏览器原生命令强制插入文本，这会被视为正常录入而非粘贴
                    const success = document.execCommand('insertText', false, text);

                    // 兼容性回退方案：直接操作选区
                    if (!success) {
                        const sel = window.getSelection();
                        if (sel.rangeCount) {
                            const range = sel.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(document.createTextNode(text));
                        }
                    }
                }
            }, true);

            // 2. 拦截 Ctrl+V/Cmd+V 键盘事件
            // 防止编辑器通过键盘监听器弹出警告提示
            window.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V' || e.keyCode === 86)) {
                    e.stopImmediatePropagation();
                }
            }, true);

            // 3. 清理内联属性
            if (document.body) {
                document.body.removeAttribute('onpaste');
            }
        })();
    `;

    /**
     * 向目标 iframe 注入补丁脚本
     */
    function injectPatch(iframe) {
        try {
            const doc = iframe.contentDocument;
            const win = iframe.contentWindow;

            // 检查 iframe 是否可访问以及是否已处理
            if (!doc || !win) return;
            if (win.dataset && win.dataset.pastePatched) return;

            // 创建并注入 script 标签
            const script = doc.createElement('script');
            script.textContent = patchLogic;
            doc.head.appendChild(script);

            // 执行后立即移除，保持 DOM 整洁
            script.remove();

            // 标记已处理
            if (win.dataset) win.dataset.pastePatched = "true";
        } catch (e) {
            // 忽略跨域 iframe 访问错误
        }
    }

    /**
     * 监控页面变化，处理动态加载的编辑器 iframe
     */
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IFRAME') {
                    // 监听 load 事件确保 iframe 内容已初始化
                    node.addEventListener('load', () => injectPatch(node));
                    // 尝试立即注入（应对已经加载完成的情况）
                    injectPatch(node);
                }
            });
        });
        // 周期性检查现有 iframe
        document.querySelectorAll('iframe').forEach(injectPatch);
    });

    // 启动监控
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    document.querySelectorAll('iframe').forEach(injectPatch);

})();