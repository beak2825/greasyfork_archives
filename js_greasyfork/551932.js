// ==UserScript==
// @name         deepseek 问题导航
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  页面右侧生成问题目录，快速导航
// @author       Moujia
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551932/deepseek%20%E9%97%AE%E9%A2%98%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/551932/deepseek%20%E9%97%AE%E9%A2%98%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建问题浮窗
    function createTOCSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'toc-sidebar-gm';

        sidebar.innerHTML = `
            <div class="toc-header-gm">
                <h4>问题导航</h4>
                <div class="toc-controls-gm">
                    <button id="toc-collapse-gm" title="折叠">−</button>
                </div>
            </div>
            <div class="toc-content-gm" id="toc-content-gm">
                <div class="empty-toc-gm">正在加载问题...</div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #toc-sidebar-gm {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 320px;
                background: #3b3b3b;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                overflow: hidden;
                transition: all 0.3s ease;
                font-family: Arial, sans-serif;
                max-height: 80vh;
            }

            #toc-sidebar-gm.collapsed-gm {
                width: 50px;
                height: 50px;
            }

            #toc-sidebar-gm.collapsed-gm .toc-content-gm,
            #toc-sidebar-gm.collapsed-gm .toc-header-gm h4 {
                display: none;
            }

            .toc-header-gm {
                background: #5686fe;
                color: white;
                padding: 8px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .toc-header-gm h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .toc-controls-gm {
                display: flex;
                gap: 10px;
            }

            .toc-controls-gm button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 26px;
                height: 26px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: background 0.2s;
            }

            .toc-controls-gm button:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .toc-content-gm {
                max-height: calc(80vh - 50px);
                overflow-y: auto;
                padding: 10px 0;
            }

            .toc-item-gm {
                padding: 8px 15px;
                border-bottom: 1px solid #4a4a4a;
                color: white;
                cursor: pointer;
                transition: background 0.2s;
                font-size: 14px;
                position: relative;
             }

            .toc-item-gm .page-info {
                color: #75abff;
                font-size: 12px;
                padding-right: 5px;
                font-weight: bold;
             }

            .toc-item-gm:hover {
                background: #2f2f2f;
            }

            .toc-item-gm:last-child {
                border-bottom: none;
            }

            .toc-item-gm.active-gm {
                background: #2f2f2f;
                border-left: 3px solid #3498db;
            }

            .toc-item-gm.expanded-gm {
                background: #2a2a2a;
            }

            .empty-toc-gm {
                padding: 15px;
                text-align: center;
                color: #7f8c8d;
                font-style: italic;
            }

            .toc-highlight-gm {
                animation: toc-highlight-anim 2s ease;
            }

            .answer-headings-gm {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: #2a2a2a;
            }

            .answer-headings-gm.expanded-gm {
                max-height: 500px;
                overflow-y: auto;
            }

            .heading-item-gm {
                padding: 6px 15px 6px 25px;
                font-size: 13px;
                color: #cccccc;
                cursor: pointer;
                border-left: 2px solid transparent;
                transition: all 0.2s;
            }

            .heading-item-gm:hover {
                background: #333;
                color: white;
                border-left-color: #5686fe;
            }

            .heading-item-gm.h1-gm { font-weight: bold; margin-left: 0px; }
            .heading-item-gm.h2-gm { font-weight: 600; margin-left: 10px; }
            .heading-item-gm.h3-gm { margin-left: 20px; }
            .heading-item-gm.h4-gm { margin-left: 30px; font-size: 12px; }
            .heading-item-gm.h5-gm { margin-left: 40px; font-size: 12px; }
            .heading-item-gm.h6-gm { margin-left: 50px; font-size: 11px; color: #999; }


            @keyframes toc-highlight-anim {
                0% { background-color: #313131; }
                100% { background-color: transparent; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(sidebar);

        // 添加事件监听
        document.getElementById('toc-collapse-gm').addEventListener('click', toggleTOC);

        return sidebar;
    }

    // 生成内容
    function generateTOC() {
        // 找到所有包含ds-markdown的ds-message
        const markdownMessages = document.querySelectorAll('.ds-message:has(> .ds-markdown)');

        const filteredMessages = Array.from(markdownMessages).map(markdownMessage => {
            // 找到包含ds-markdown的ds-message的父级div
            const parentDiv = markdownMessage.parentElement;

            // 找到父级div的上一个兄弟div
            const prevSiblingDiv = parentDiv.previousElementSibling;

            if (prevSiblingDiv && prevSiblingDiv.tagName === 'DIV') {
                // 在上一个兄弟div中查找ds-message
                const targetMessage = prevSiblingDiv.querySelector('.ds-message');
                return {
                    question: targetMessage,
                    answer: markdownMessage
                };
            }
            return null;
        }).filter(item => {
            // 过滤条件：检查目标ds-message是否存在且符合条件
            return item && item.question;
        });

        const tocContent = document.getElementById('toc-content-gm');

        if (filteredMessages.length === 0) {
            tocContent.innerHTML = '<div class="empty-toc-gm">暂无问题</div>';
            return filteredMessages;
        }

        let tocHTML = '';

        filteredMessages.forEach((item, index) => {
            const question = item.question;
            const text = question.textContent.trim();

            // 尝试从下一个兄弟节点获取页码信息
            let pageInfo = '';
            const nextSibling = question.nextElementSibling;
            if (nextSibling) {
                // 在兄弟节点内查找符合格式的div
                const pageDiv = findPageDiv(nextSibling);
                if (pageDiv) {
                    const pageText = pageDiv.textContent.trim();
                    // 匹配 "数字 / 数字" 格式
                    const pageMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/);
                    if (pageMatch) {
                        pageInfo = `<span class="page-info">(${pageMatch[1]}/${pageMatch[2]})</span>`;
                    }
                }
            }

            // 拼接文本
            const shortText = text.length > 40 ? text.substring(0, 40) + '...' : text;

            tocHTML += `
            <div class="toc-item-gm" data-index="${index}" title="${escapeHtml(text.substring(0, 300))}">
                ${pageInfo}${escapeHtml(shortText)}
                <div class="answer-headings-gm" id="answer-headings-${index}"></div>
            </div>
        `;
        });

        tocContent.innerHTML = tocHTML;

        // 点击问题项的事件处理
        document.querySelectorAll('.toc-item-gm').forEach(item => {
            item.addEventListener('click', function(e) {
                // 如果点击的是展开图标，只切换展开状态
                if (e.target.classList.contains('expand-icon-gm')) {
                    toggleAnswerHeadings(this);
                    return;
                }

                const index = parseInt(this.getAttribute('data-index'));
                const isLastItem = index === filteredMessages.length - 1;

                scrollToMessage(filteredMessages[index].question);

                // 高亮当前选中的目录项
                document.querySelectorAll('.toc-item-gm').forEach(i => i.classList.remove('active-gm'));
                this.classList.add('active-gm');

                // 如果是最后一个问题，重新加载标题内容
                if (isLastItem) {
                    const headingsContainer = document.getElementById(`answer-headings-${index}`);
                    // 清空容器内容，强制重新加载
                    headingsContainer.innerHTML = '';

                    // 如果当前是展开状态，重新加载标题
                    if (this.classList.contains('expanded-gm')) {
                        loadAnswerHeadings(index, headingsContainer);
                    }
                }

                // 自动展开当前项的回答标题
                if (!this.classList.contains('expanded-gm')) {
                    toggleAnswerHeadings(this);
                }
            });
        });

        return filteredMessages;
    }

    // 切换回答标题的展开/收起
    function toggleAnswerHeadings(tocItem) {
        const index = parseInt(tocItem.getAttribute('data-index'));
        const headingsContainer = document.getElementById(`answer-headings-${index}`);

        // 如果当前项已经展开，则直接收起
        if (tocItem.classList.contains('expanded-gm')) {
            tocItem.classList.remove('expanded-gm');
            headingsContainer.classList.remove('expanded-gm');
        } else {
            // 先关闭所有其他已展开的项
            document.querySelectorAll('.toc-item-gm.expanded-gm').forEach(expandedItem => {
                if (expandedItem !== tocItem) {
                    const expandedIndex = parseInt(expandedItem.getAttribute('data-index'));
                    const expandedHeadings = document.getElementById(`answer-headings-${expandedIndex}`);
                    expandedItem.classList.remove('expanded-gm');
                    if (expandedHeadings) {
                        expandedHeadings.classList.remove('expanded-gm');
                    }
                }
            });

            // 然后展开当前项
            tocItem.classList.add('expanded-gm');
            headingsContainer.classList.add('expanded-gm');

            // 如果还没有加载过标题，则加载
            if (headingsContainer.innerHTML === '') {
                loadAnswerHeadings(index, headingsContainer);
            }
        }
    }

    // 加载回答中的标题
    function loadAnswerHeadings(index, container) {
        // 获取对应的回答消息
        const markdownMessages = document.querySelectorAll('.ds-message:has(> .ds-markdown)');
        const answerMessage = markdownMessages[index];

        if (!answerMessage) return;

        // 在ds-markdown中查找所有标题
        const dsMarkdown = answerMessage.querySelector(':scope > .ds-markdown');
        if (!dsMarkdown) return;

        // 查找所有h1-h6标题
        const headings = dsMarkdown.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (headings.length === 0) {
            container.innerHTML = '<div class="heading-item-gm" style="color: #777; font-style: italic;">无标题</div>';
            return;
        }

        let headingsHTML = '';

        headings.forEach((heading, headingIndex) => {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();

            // 如果没有id，则设置一个
            if (!heading.id) {
                heading.id = `heading-${index}-${headingIndex}`;
            }

            headingsHTML += `
                <div class="heading-item-gm h${level}-gm" data-heading-id="${heading.id}">
                    ${escapeHtml(text)}
                </div>
            `;
        });

        container.innerHTML = headingsHTML;

        // 为标题项添加点击事件
        container.querySelectorAll('.heading-item-gm').forEach(headingItem => {
            headingItem.addEventListener('click', function(e) {
                // 阻止事件冒泡，避免触发父级问题项的点击事件
                e.stopPropagation();

                const headingId = this.getAttribute('data-heading-id');
                const headingElement = document.getElementById(headingId);

                if (headingElement) {
                    // 平滑滚动到标题
                    headingElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // 高亮标题
                    headingElement.style.backgroundColor = '#88888888';
                    setTimeout(() => {
                        headingElement.style.backgroundColor = '';
                    }, 1000);
                }
            });
        });
    }

    // 滚动到指定消息
    function scrollToMessage(messageElement) {
        // 移除之前的高亮
        document.querySelectorAll('.toc-highlight-gm').forEach(el => {
            el.classList.remove('toc-highlight-gm');
        });

        // 添加新高亮
        messageElement.classList.add('toc-highlight-gm');

        // 平滑滚动
        messageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // 切换折叠状态
    function toggleTOC() {
        const sidebar = document.getElementById('toc-sidebar-gm');
        const collapseBtn = document.getElementById('toc-collapse-gm');

        sidebar.classList.toggle('collapsed-gm');

        if (sidebar.classList.contains('collapsed-gm')) {
            collapseBtn.innerHTML = '+';
            collapseBtn.title = '展开';
        } else {
            collapseBtn.innerHTML = '−';
            collapseBtn.title = '折叠';
        }
    }

    // 在节点内递归查找符合页码格式的div
    function findPageDiv(element) {
        // 如果当前元素是div且没有子元素，检查内容是否符合格式
        if (element.tagName === 'DIV' && element.children.length === 0) {
            const text = element.textContent.trim();
            if (text.match(/(\d+)\s*\/\s*(\d+)/)) {
                return element;
            }
        }

        // 递归检查子元素
        for (let child of element.children) {
            const result = findPageDiv(child);
            if (result) return result;
        }

        return null;
    }

    // 监听DOM变化
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            // 检查是否有相关元素变化
            const shouldUpdate = mutations.some(mutation => {
                // 检查新增的节点
                const targetBelongMessage = mutation.target.matches('div.ds-message');
                if (targetBelongMessage) return true;

                const hasNewMessage = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 && (
                        node.classList.contains('ds-message') ||
                        (node.querySelector && node.querySelector('.ds-message'))
                    );
                });
                if (hasNewMessage) return true;

                // 检查被移除的节点
                const hasRemovedMessage = Array.from(mutation.removedNodes).some(node => {
                    return node.nodeType === 1 && (
                        node.classList.contains('ds-message') ||
                        (node.querySelector && node.querySelector('.ds-message'))
                    );
                });
                if (hasRemovedMessage) return true;

                // 检查属性变化（比如class变化）
                const hasAttributeChange = mutation.type === 'attributes' &&
                      (mutation.target.classList.contains('ds-message') ||
                       mutation.target.querySelector('.ds-message'));

                if (hasAttributeChange) return true;
                return false;
            });

            if (shouldUpdate) {
                // 防抖处理，避免频繁更新
                clearTimeout(observer.timeout);
                observer.timeout = setTimeout(() => {
                    generateTOC();
                }, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 内容转义
    function escapeHtml(text) {
        return text
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // 初始化
    function init() {
        createTOCSidebar();
        generateTOC();
        setupMutationObserver();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();