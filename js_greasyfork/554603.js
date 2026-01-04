// ==UserScript==
// @name         知乎回答新窗口打开
// @namespace    https://github.com/sixiaolong1117/Tampermonkey
// @version      0.1
// @description  在知乎回答列表中添加"新窗口打开"按钮，打开回答详情页
// @license      MIT
// @icon         https://zhihu.com/favicon.ico
// @author       SI Xiaolong
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554603/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/554603/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const styles = `
        .zhihu-open-btn {
            padding: 2px 8px;
            margin: 10px 10px 0px 0px;
            border: 1px solid;
            border-radius: 3px;
            background: transparent;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
            display: inline-block;
            text-decoration: none;
            line-height: 1.5;
        }

        /* 浅色模式 */
        @media (prefers-color-scheme: light) {
            .zhihu-open-btn {
                border-color: #d0d0d0;
                color: #8590a6;
            }
            .zhihu-open-btn:hover {
                border-color: #0066ff;
                color: #0066ff;
                background: rgba(0, 102, 255, 0.05);
            }
        }

        /* 深色模式 */
        @media (prefers-color-scheme: dark) {
            .zhihu-open-btn {
                border-color: #555;
                color: #8590a6;
            }
            .zhihu-open-btn:hover {
                border-color: #0066ff;
                color: #0066ff;
                background: rgba(0, 102, 255, 0.1);
            }
        }
    `;

    // 注入样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 为每个回答项添加按钮
    function addOpenButton(answerItem) {
        // 检查是否已经添加过按钮
        if (answerItem.dataset.buttonAdded) {
            return;
        }

        // 查找包含回答链接的 a 标签
        const answerLink = answerItem.querySelector('a[href*="/question/"][href*="/answer/"]');
        if (!answerLink) {
            return;
        }

        let href = answerLink.getAttribute('href');
        if (!href) {
            return;
        }

        // 清理和构建完整URL
        let url;
        if (href.startsWith('http')) {
            url = href;
        } else if (href.startsWith('//')) {
            url = 'https:' + href;
        } else {
            url = 'https://www.zhihu.com' + (href.startsWith('/') ? href : '/' + href);
        }

        // 移除可能的查询参数
        url = url.split('?')[0];

        // 创建按钮
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'Button FollowButton Button--secondary Button--blue zhihu-open-btn';

        // 创建按钮内容结构（带图标）
        const span = document.createElement('span');
        span.style.cssText = 'display: inline-flex; align-items: center;';

        // 添加图标（使用外链图标）
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '1.2em');
        svg.setAttribute('height', '1.2em');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        svg.style.marginRight = '4px';
        svg.innerHTML = '<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>';

        span.appendChild(svg);
        span.appendChild(document.createTextNode('新窗口'));
        button.appendChild(span);

        // 点击事件
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(url, '_blank');
        };

        // 查找 ContentItem-meta 容器
        const metaContainer = answerItem.querySelector('.ContentItem-meta');
        if (metaContainer) {
            // 查找 AuthorInfo 元素
            const authorInfo = metaContainer.querySelector('.AuthorInfo');
            if (authorInfo && authorInfo.nextSibling) {
                // 插入到 AuthorInfo 之后
                metaContainer.insertBefore(button, authorInfo.nextSibling);
            } else if (authorInfo) {
                // 如果没有 nextSibling，直接 append
                metaContainer.appendChild(button);
            } else {
                // 如果没有 AuthorInfo，插入到 meta 容器开头
                metaContainer.insertBefore(button, metaContainer.firstChild);
            }
        } else {
            // 如果没有 meta 容器，插入到回答项顶部
            answerItem.insertBefore(button, answerItem.firstChild);
        }

        // 标记已添加
        answerItem.dataset.buttonAdded = 'true';
    }

    // 处理所有现有的回答项
    function processAnswerItems() {
        const answerItems = document.querySelectorAll('.ContentItem.AnswerItem');
        answerItems.forEach(addOpenButton);
    }

    // 初始处理
    setTimeout(processAnswerItems, 1000);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        processAnswerItems();
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 每隔2秒检查一次（作为备用方案）
    setInterval(processAnswerItems, 2000);
})();