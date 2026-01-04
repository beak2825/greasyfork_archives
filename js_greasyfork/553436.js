// ==UserScript==
// @name         MKTNews 新闻复制
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  点击时间复制新闻标题
// @author       kejin —— 公众号：懒人股选
// @license      MIT
// @match        https://mktnews.com/*
// @match        https://www.mktnews.com/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553436/MKTNews%20%E6%96%B0%E9%97%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/553436/MKTNews%20%E6%96%B0%E9%97%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置参数区域 ====================
    // 需要过滤的关键词列表（遇到这些词，会删除该词及其之后的所有内容）
    const FILTER_KEYWORDS = [
        'AI Insight:',
        '人工智能洞察',
        // 在这里添加更多需要过滤的关键词
        // 例如: 'AI Insight', 'Potential Impact', etc.
    ];
    // ====================================================

    console.log('MKTNews 复制助手已加载');
    console.log('过滤关键词:', FILTER_KEYWORDS);

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .mktnews-clickable-time {
            cursor: pointer !important;
        }
        .mktnews-clickable-time:hover {
            color: #667eea !important;
        }
        .mktnews-copied {
            color: #10b981 !important;
        }
    `;
    document.head.appendChild(style);

    // 提取新闻内容（时间+标题）
    function extractNewsContent(newsItem) {
        try {
            let allText = newsItem.textContent || '';

            // 应用过滤规则：删除关键词及其之后的所有内容
            for (let keyword of FILTER_KEYWORDS) {
                const index = allText.indexOf(keyword);
                if (index !== -1) {
                    allText = allText.substring(0, index);
                    console.log('过滤掉关键词:', keyword);
                }
            }

            // 提取时间
            const timeMatch = allText.match(/\d{2}:\d{2}:\d{2}/);
            const timeStr = timeMatch ? timeMatch[0] : '';

            if (!timeStr) return '';

            // 按行分割
            const lines = allText.split('\n').map(s => s.trim()).filter(s => s);

            // 找到第一个不是时间的行，作为标题
            let title = '';
            for (let line of lines) {
                // 跳过时间行
                if (/^\d{2}:\d{2}:\d{2}$/.test(line)) continue;

                // 移除行首的时间
                line = line.replace(/^\d{2}:\d{2}:\d{2}\s*/, '').trim();

                if (line) {
                    title = line;
                    break;
                }
            }

            if (!title) return '[' + timeStr + ']';

            return '[' + timeStr + '] ' + title;
        } catch (e) {
            console.error('提取内容出错:', e);
            return '';
        }
    }

    // 为时间元素添加点击事件
    function makeTimeClickable(timeElement, newsItem) {
        try {
            // 检查是否已处理
            if (timeElement.dataset.mktnewsProcessed) return;
            timeElement.dataset.mktnewsProcessed = 'true';

            timeElement.classList.add('mktnews-clickable-time');
            timeElement.title = '点击复制新闻标题';

            // 点击复制
            timeElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const content = extractNewsContent(newsItem);

                if (content) {
                    GM_setClipboard(content, 'text');
                    console.log('已复制:', content);

                    // 视觉反馈
                    const originalColor = timeElement.style.color;
                    timeElement.classList.add('mktnews-copied');

                    setTimeout(() => {
                        timeElement.classList.remove('mktnews-copied');
                        timeElement.style.color = originalColor;
                    }, 1000);
                }
            });
        } catch (e) {
            console.error('添加点击事件出错:', e);
        }
    }

    // 查找并处理新闻项
    function processNewsItems() {
        try {
            const allDivs = document.querySelectorAll('div');

            allDivs.forEach(div => {
                const text = div.textContent || '';
                if (!/\d{2}:\d{2}:\d{2}/.test(text)) return;

                // 多种方法查找时间元素
                let timeElement = div.querySelector('div');

                if (!timeElement || !timeElement.textContent.match(/\d{2}:\d{2}:\d{2}/)) {
                    const allChildren = div.querySelectorAll('*');
                    for (let child of allChildren) {
                        const childText = child.textContent || '';
                        if (/^\d{2}:\d{2}:\d{2}$/.test(childText.trim())) {
                            timeElement = child;
                            break;
                        }
                    }
                }

                if (!timeElement) {
                    if (/^\d{2}:\d{2}:\d{2}/.test(text.trim())) {
                        timeElement = div;
                    }
                }

                if (!timeElement) return;

                const timeText = timeElement.textContent || '';
                if (/\d{2}:\d{2}:\d{2}/.test(timeText)) {
                    if (text.length > 20) {
                        makeTimeClickable(timeElement, div);
                    }
                }
            });

            console.log('处理完成');
        } catch (e) {
            console.error('处理新闻项出错:', e);
        }
    }

    // 延迟初始化
    function init() {
        try {
            console.log('开始初始化...');
            setTimeout(processNewsItems, 1000);
            setTimeout(processNewsItems, 3000);
        } catch (e) {
            console.error('初始化出错:', e);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 监听DOM变化
    try {
        const observer = new MutationObserver(function(mutations) {
            clearTimeout(window.mktnewsTimeout);
            window.mktnewsTimeout = setTimeout(processNewsItems, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {
        console.error('MutationObserver出错:', e);
    }

})();