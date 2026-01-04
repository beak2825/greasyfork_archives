// ==UserScript==
// @name         超星学习通-超级粘贴 v4.0   creator  Xp
// @namespace    CXXXT_CJZT
// @version      4.0
// @description  解除超星学习通粘贴限制，支持纯文本粘贴
// @author       DND
// @license      MIT
// @match        https://*.chaoxing.com/mooc-ans/*
// @match        https://*.chaoxing.com/work/*
// @match        https://*.chaoxing.com/study/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553100/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%B6%85%E7%BA%A7%E7%B2%98%E8%B4%B4%20v40%20%20%20creator%20%20Xp.user.js
// @updateURL https://update.greasyfork.org/scripts/553100/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%B6%85%E7%BA%A7%E7%B2%98%E8%B4%B4%20v40%20%20%20creator%20%20Xp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("超星学习通-超级粘贴 v4.0 启动");

    // 方法1: 全局粘贴事件处理
    document.addEventListener('paste', function(e) {
        // 阻止默认粘贴行为
        e.stopPropagation();

        // 获取剪贴板文本
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('text/plain');

        if (pastedText && e.target) {
            // 如果是可编辑区域
            if (e.target.isContentEditable ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.tagName === 'INPUT') {

                // 阻止默认行为并插入纯文本
                e.preventDefault();
                document.execCommand('insertText', false, pastedText);
                console.log("已处理粘贴内容:", pastedText.substring(0, 50) + "...");
            }
        }
    }, true);

    // 方法2: 定时检查并修复编辑器
    function fixEditors() {
        // 修复UEditor
        if (window.UE && window.UE.instants) {
            Object.values(window.UE.instants).forEach(editor => {
                if (editor && !editor._fixed) {
                    try {
                        editor.removeListener('beforepaste', window.editorPaste);
                        editor.addListener('beforepaste', function(o, html) {
                            // 清除所有HTML标签，只保留纯文本
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html.html;
                            const text = tempDiv.textContent || tempDiv.innerText || '';
                            html.html = text;
                            return true;
                        });
                        editor._fixed = true;
                        console.log("已修复UEditor:", editor.key);
                    } catch (err) {
                        console.log("修复UEditor失败:", err);
                    }
                }
            });
        }

        // 修复textarea和contenteditable元素
        document.querySelectorAll('textarea, [contenteditable="true"]').forEach(element => {
            if (!element._fixed) {
                element.addEventListener('paste', function(e) {
                    e.stopPropagation();
                    const clipboardData = e.clipboardData || window.clipboardData;
                    const text = clipboardData.getData('text/plain');

                    if (text) {
                        e.preventDefault();
                        if (element.tagName === 'TEXTAREA') {
                            const start = element.selectionStart;
                            const end = element.selectionEnd;
                            element.value = element.value.substring(0, start) + text + element.value.substring(end);
                            element.selectionStart = element.selectionEnd = start + text.length;
                        } else {
                            document.execCommand('insertText', false, text);
                        }

                        // 触发输入事件
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, true);
                element._fixed = true;
            }
        });
    }

    // 页面加载完成后开始修复
    window.addEventListener('load', function() {
        fixEditors();
        // 每2秒检查一次新出现的编辑器
        setInterval(fixEditors, 2000);
    });

    // 监听DOM变化，动态修复新出现的编辑器
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                shouldFix = true;
            }
        });
        if (shouldFix) {
            setTimeout(fixEditors, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();