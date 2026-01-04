// ==UserScript==
// @name         wolai.com Command+Enter 换行插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 wolai.com 中添加 Command+Enter 换行功能，类似 VSCode
// @author       You
// @match        https://wolai.com/*
// @match        https://*.wolai.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548296/wolaicom%20Command%2BEnter%20%E6%8D%A2%E8%A1%8C%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/548296/wolaicom%20Command%2BEnter%20%E6%8D%A2%E8%A1%8C%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, 100);
            }
        }
        
        check();
    }

    // 将光标移动到行尾并插入换行
    function moveToEndOfLineAndEnter(element) {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            // 处理 textarea 和 input 元素
            const start = element.selectionStart;
            const value = element.value;
            
            // 找到当前行的结束位置
            let lineEnd = start;
            while (lineEnd < value.length && value[lineEnd] !== '\n') {
                lineEnd++;
            }
            
            // 将光标移动到行尾并插入换行
            element.selectionStart = element.selectionEnd = lineEnd;
            element.value = value.slice(0, lineEnd) + '\n' + value.slice(lineEnd);
            element.selectionStart = element.selectionEnd = lineEnd + 1;
            
        } else if (element.getAttribute('contenteditable') !== null) {
            // 处理 contenteditable 元素
            const selection = window.getSelection();
            
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;
            
            // 找到当前行的末尾
            let endNode = currentNode;
            let endOffset = range.startOffset;
            
            // 如果当前节点是文本节点，移动到文本末尾
            if (currentNode.nodeType === Node.TEXT_NODE) {
                endOffset = currentNode.textContent.length;
            } else {
                // 如果是元素节点，找到最后一个子节点
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                // 定位到当前位置
                walker.currentNode = currentNode.nodeType === Node.TEXT_NODE ? currentNode : 
                                   currentNode.firstChild || currentNode;
                
                // 向前遍历直到找到换行或到达容器边界
                let node = walker.currentNode;
                while (node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent;
                        // 检查是否有换行符
                        const newlineIndex = text.indexOf('\n', 
                            node === currentNode ? range.startOffset : 0
                        );
                        
                        if (newlineIndex !== -1) {
                            endNode = node;
                            endOffset = newlineIndex;
                            break;
                        } else {
                            endNode = node;
                            endOffset = text.length;
                        }
                    }
                    
                    // 检查是否遇到块级元素
                    let nextNode = walker.nextNode();
                    if (!nextNode) break;
                    
                    const parentElement = nextNode.parentElement;
                    if (parentElement && window.getComputedStyle(parentElement).display === 'block') {
                        break;
                    }
                    
                    node = nextNode;
                }
            }
            
            // 将光标移动到行尾
            const newRange = document.createRange();
            newRange.setStart(endNode, endOffset);
            newRange.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            // 模拟按下 Enter 键
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            element.dispatchEvent(enterEvent);
            
            // 如果模拟 Enter 键没有效果，手动插入换行
            setTimeout(() => {
                const currentSelection = window.getSelection();
                if (currentSelection.rangeCount > 0) {
                    const currentRange = currentSelection.getRangeAt(0);
                    
                    // 创建换行
                    const br = document.createElement('br');
                    const div = document.createElement('div');
                    div.appendChild(document.createElement('br'));
                    
                    try {
                        currentRange.insertNode(div);
                        currentRange.setStartAfter(div);
                        currentRange.collapse(true);
                        currentSelection.removeAllRanges();
                        currentSelection.addRange(currentRange);
                    } catch (e) {
                        // 备用方案：插入 br 标签
                        currentRange.insertNode(br);
                        currentRange.setStartAfter(br);
                        currentRange.collapse(true);
                        currentSelection.removeAllRanges();
                        currentSelection.addRange(currentRange);
                    }
                }
            }, 10);
        }
    }

    // 查找可能的编辑器元素
    function findEditorElements() {
        const selectors = [
            '[contenteditable="true"]',
            '[contenteditable]',
            '.editor',
            '.content-editable',
            '.rich-editor',
            '.notion-editor',
            '.wolai-editor',
            'textarea',
            'input[type="text"]',
            '[role="textbox"]',
            '.ql-editor', // Quill editor
            '.CodeMirror', // CodeMirror
            '.monaco-editor' // Monaco editor
        ];

        const elements = [];
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...Array.from(found));
        });

        return elements;
    }

    // 键盘事件处理
    function handleKeydown(event) {
        // 检查是否是 Command+Enter (Mac) 或 Ctrl+Enter (Windows/Linux)
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const commandKey = isMac ? event.metaKey : event.ctrlKey;
        
        if (commandKey && event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            
            const target = event.target;
            const activeElement = document.activeElement;
            
            // 确保焦点在可编辑元素上
            const editableElement = target.getAttribute('contenteditable') !== null ? target : 
                                   activeElement.getAttribute('contenteditable') !== null ? activeElement : 
                                   target.tagName === 'TEXTAREA' ? target :
                                   activeElement.tagName === 'TEXTAREA' ? activeElement :
                                   target;
            
            if (editableElement) {
                moveToEndOfLineAndEnter(editableElement);
            }
        }
    }

    // 初始化插件
    function init() {
        console.log('wolai.com Command+Enter 换行插件已加载');
        
        // 为整个文档添加键盘事件监听
        document.addEventListener('keydown', handleKeydown, true);
        
        // 动态监听新添加的编辑器元素
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否包含编辑器
                            const editors = findEditorElements();
                            editors.forEach(editor => {
                                if (!editor.hasAttribute('data-command-enter-enabled')) {
                                    editor.setAttribute('data-command-enter-enabled', 'true');
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 标记现有的编辑器元素
        setTimeout(() => {
            const editors = findEditorElements();
            editors.forEach(editor => {
                editor.setAttribute('data-command-enter-enabled', 'true');
            });
            console.log(`找到 ${editors.length} 个编辑器元素`);
        }, 1000);
    }

    // 等待页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();