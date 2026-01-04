// ==UserScript==
// @name         超星学习通粘贴注入器
// @namespace    https://keatsu.top/
// @version      0.2.2
// @description  解除超星学习通网页的禁止粘贴限制
// @author       Hazuki Keatsu
// @match        https://*.chaoxing.com/mooc-ans/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551611/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E6%B3%A8%E5%85%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551611/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E6%B3%A8%E5%85%A5%E5%99%A8.meta.js
// ==/UserScript==
"use strict";
(function () {
    'use strict';
    console.log('超星学习通粘贴注入器已启动', window.location.href);
    // 禁用各种弹窗函数
    function disablePopups() {
        window.alert = function () { };
        window.confirm = function () { return true; };
        window.prompt = function () { return null; };
        // 只拦截非关键的复制相关事件，保留 paste 和 contextmenu 让编辑器正常工作
        ['copy', 'cut', 'selectstart'].forEach(eventType => {
            document.addEventListener(eventType, function (e) {
                e.stopImmediatePropagation();
            }, true);
        });
    }
    // 页面加载时立即禁用弹窗
    window.addEventListener("load", disablePopups);
    // 使用模拟输入在光标位置插入内容
    function injectContent() {
        // 1. 找到目标 iframe DOM
        let iframe = null;
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME') {
            iframe = active;
        }
        if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
            console.log('未找到目标iframe或无法访问iframe内容');
            return;
        }
        // 2. 注入内容（直接读取剪切板）
        navigator.clipboard.readText().then(content => {
            if (!content)
                return;
            // 使用模拟输入方式在光标位置插入
            simulateTextInput(iframe.contentDocument, iframe.contentWindow, content);
        }).catch(error => {
            console.log('无法读取剪贴板:', error);
        });
    }
    // 模拟文本输入函数
    function simulateTextInput(doc, win, content) {
        try {
            // 方法1: 使用 Selection API 在光标位置插入
            const selection = win.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // 删除选中的内容(如果有)
                range.deleteContents();
                // 使用统一的contentToNode函数处理换行
                const contentFragment = contentToNode(content);
                // 从DocumentFragment中提取所有子节点
                const contentNodes = Array.from(contentFragment.childNodes);
                // 插入所有节点
                let lastInsertedNode = null;
                contentNodes.forEach(node => {
                    range.insertNode(node);
                    lastInsertedNode = node;
                    // 将range移动到当前插入节点之后，为下一个节点做准备
                    range.setStartAfter(node);
                    range.collapse(true);
                });
                // 移动光标到最后插入内容之后
                if (lastInsertedNode) {
                    range.setStartAfter(lastInsertedNode);
                    range.collapse(true);
                }
                selection.removeAllRanges();
                selection.addRange(range);
                // 触发input事件通知编辑器内容已改变
                try {
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        inputType: 'insertText',
                        data: content
                    });
                    // 向可编辑元素触发事件
                    const editableElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                        ? range.commonAncestorContainer
                        : range.commonAncestorContainer.parentElement;
                    if (editableElement) {
                        editableElement.dispatchEvent(inputEvent);
                    }
                }
                catch (eventError) {
                    console.log('触发input事件失败:', eventError);
                }
                // console.log('使用 Selection API 成功');
                return;
            }
            // 方法2: 如果没有选区，尝试在可编辑元素中创建选区并插入
            const editableElement = doc.querySelector('body.view') ||
                doc.querySelector('[contenteditable="true"]') ||
                doc.body;
            if (editableElement) {
                // 创建新的选区在元素末尾
                const newRange = doc.createRange();
                newRange.selectNodeContents(editableElement);
                newRange.collapse(false); // 折叠到末尾
                const newSelection = win.getSelection();
                if (newSelection) {
                    newSelection.removeAllRanges();
                    newSelection.addRange(newRange);
                    // 递归调用，现在应该有选区了
                    simulateTextInput(doc, win, content);
                    return;
                }
            }
            // 方法3: 回退到DOM操作 (在编辑器body末尾追加)
            console.log('回退到DOM操作方式');
            const fallbackElement = doc.querySelector('body.view') || doc.body;
            if (fallbackElement) {
                const newElement = contentToNode(content);
                fallbackElement.appendChild(newElement);
                // 尝试触发change事件
                try {
                    const inputEvent = new Event('input', { bubbles: true });
                    fallbackElement.dispatchEvent(inputEvent);
                    const changeEvent = new Event('change', { bubbles: true });
                    fallbackElement.dispatchEvent(changeEvent);
                }
                catch (eventError) {
                    console.log('触发事件失败:', eventError);
                }
            }
        }
        catch (error) {
            console.log('模拟输入失败:', error);
        }
    }
    function contentToNode(content) {
        const frag = document.createDocumentFragment();
        if (!content)
            return frag;
        // 转化 CRLF 到 LF
        const normalized = content.replace(/\r\n?/g, '\n');
        // 将文本分割成多个独立段落
        const paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
        // 如果没有段落，但有内容，就当作一个段落处理
        if (paragraphs.length === 0 && normalized.trim()) {
            paragraphs.push(normalized.trim());
        }
        paragraphs.forEach((paragraphText, pIndex) => {
            // 如果不是第一个段落，先添加段落分隔（两个<br>）
            if (pIndex > 0) {
                frag.appendChild(document.createElement('br'));
                frag.appendChild(document.createElement('br'));
            }
            // 处理段落内的单次换行
            const lines = paragraphText.split('\n');
            lines.forEach((line, lIndex) => {
                if (line.length > 0) {
                    // 将普通空格和制表符转换为HTML实体
                    const processedLine = line
                        .replace(/&/g, '&amp;') // 先转义&符号，避免冲突
                        .replace(/</g, '&lt;') // 转义<符号
                        .replace(/>/g, '&gt;') // 转义>符号
                        .replace(/ /g, '&nbsp;') // 将所有空格转为不间断空格
                        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&ZeroWidthSpace;'); // 将制表符转为4个不间断空格+零宽空格
                    // 检查是否有转换后的HTML实体
                    if (processedLine !== line) {
                        // 有转换，使用innerHTML解析HTML实体
                        const span = document.createElement('span');
                        span.innerHTML = processedLine;
                        // 将span的所有子节点添加到fragment
                        while (span.firstChild) {
                            frag.appendChild(span.firstChild);
                        }
                    }
                    else {
                        // 没有需要转换的字符，直接创建文本节点
                        frag.appendChild(document.createTextNode(line));
                    }
                }
                // 如果不是最后一行，添加<br>
                if (lIndex < lines.length - 1) {
                    frag.appendChild(document.createElement('br'));
                }
            });
        });
        return frag;
    }
    // 监听 UEditor iframe 内部的键盘事件
    function setupUEditorListeners() {
        // console.log('设置 UEditor 监听器');
        // 查找所有 iframe（UEditor 通常在 iframe 中）
        function findAndSetupIframes() {
            const iframes = document.querySelectorAll('iframe');
            // console.log('找到 iframe 数量:', iframes.length);
            iframes.forEach((iframe, index) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        // console.log(`为 iframe ${index} 设置监听器`);
                        // 监听 iframe 的 window
                        iframe.contentWindow?.addEventListener('keydown', function (e) {
                            // console.log(`iframe ${index} window keydown:`, e.key, e.ctrlKey);
                            if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                                // console.log(`iframe ${index} window 检测到 Ctrl+V`);
                                e.preventDefault();
                                injectContent();
                            }
                        }, true);
                        // 监听 paste 事件，支持鼠标右键粘贴
                        iframe.contentWindow?.addEventListener('paste', function (e) {
                            // console.log(`iframe ${index} window 检测到 paste 事件`);
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            // 尝试从事件中获取剪贴板数据
                            const clipboardData = e.clipboardData || window.clipboardData;
                            if (clipboardData) {
                                const content = clipboardData.getData('text/plain');
                                if (content) {
                                    // 使用模拟输入方式在光标位置插入
                                    const iframe = document.activeElement;
                                    if (iframe && iframe.contentDocument && iframe.contentWindow) {
                                        simulateTextInput(iframe.contentDocument, iframe.contentWindow, content);
                                    }
                                }
                            }
                            else {
                                // 回退到使用 navigator.clipboard API
                                injectContent();
                            }
                        }, true);
                    }
                }
                catch (error) {
                    console.log(`iframe ${index} 跨域限制:`, error.message);
                }
            });
        }
        // 立即检查
        findAndSetupIframes();
    }
    // 设置监听器
    window.addEventListener("load", setupUEditorListeners);
})();
