// ==UserScript==
// @name         知乎推荐页：显示发布时间和赞评比
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在知乎推荐页直接显示回答或文章的发布时间、编辑时间（无需展开，30天以上高亮提醒）和赞评比。
// @author       Junior Robin
// @match        *://www.zhihu.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562206/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E9%A1%B5%EF%BC%9A%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E5%92%8C%E8%B5%9E%E8%AF%84%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/562206/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E9%A1%B5%EF%BC%9A%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E5%92%8C%E8%B5%9E%E8%AF%84%E6%AF%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式配置：知乎风格的灰色小字
    const TIME_STYLE = `
        color: #8590a6;
        font-size: 14px;
        margin-bottom: 8px; /* 增加一点下间距，让它和标题分开 */
        line-height: 1.6;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: normal;
    `;

    /**
     * 将 ISO 时间字符串 (如 2026-01-09T01:26:00.000Z) 格式化为 2026-01-09 01:26
     */
    function formatTime(isoStr) {
        if (!isoStr) return null;
        try {
            const date = new Date(isoStr);
            if (isNaN(date.getTime())) return null;

            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            const h = date.getHours().toString().padStart(2, '0');
            const min = date.getMinutes().toString().padStart(2, '0');

            return `${y}-${m}-${d} ${h}:${min}`;
        } catch (e) {
            return null;
        }
    }

    /**
     * 从 ContentItem-actions 提取赞同数和评论数
     */
    function getVoteAndCommentCount(item) {
        try {
            const actionsEl = item.querySelector('.ContentItem-actions');
            if (!actionsEl) return { voteCount: 0, commentCount: 0 };

            let voteCount = 0;
            let commentCount = 0;

            // 提取赞同数：从 aria-label="赞同 101 " 或 "赞同 1.2 万" 中提取数字
            const voteButton = actionsEl.querySelector('.VoteButton[aria-label*="赞同"]');
            if (voteButton) {
                const label = voteButton.getAttribute('aria-label');
                const match = label.match(/赞同\s+([\d.]+)\s*(万)?/);
                if (match) {
                    const num = parseFloat(match[1]);
                    if (match[2] === '万') {
                        voteCount = Math.round(num * 10000);
                    } else {
                        voteCount = Math.round(num);
                    }
                }
            }

            // 提取评论数：查找包含 "条评论" 文本的按钮
            const allButtons = actionsEl.querySelectorAll('button');
            for (const btn of allButtons) {
                const text = btn.innerText;
                if (text.includes('添加评论')) {
                    commentCount = 0;
                    break;
                }
                const match = text.match(/(\d+)\s*条评论/);
                if (match) {
                    commentCount = parseInt(match[1], 10);
                    break;
                }
            }

            return { voteCount, commentCount };
        } catch (e) {
            return { voteCount: 0, commentCount: 0 };
        }
    }

    /**
     * 处理单个内容项
     */
    function processItem(item) {
        // 1. 防止重复处理
        if (item.dataset.timeInjected === 'true') return;

        // 2. 获取标题元素 (作为插入锚点)
        const titleEl = item.querySelector('.ContentItem-title');
        if (!titleEl) return;

        // 3. 【核心逻辑】查找隐藏的 meta 标签
        // 知乎通常在 ContentItem 内部或其子元素中放置 itemprop="dateCreated" 的 meta 标签
        const createMeta = item.querySelector('meta[itemprop="dateCreated"]');
        const modifyMeta = item.querySelector('meta[itemprop="dateModified"]');

        let displayHtml = '';
        let createDate = null;

        if (createMeta || modifyMeta) {
            // 方案 A: 成功找到 meta 数据（这是最准确的，无需展开）
            const createTimeStr = createMeta ? formatTime(createMeta.content) : null;
            const modifyTimeStr = modifyMeta ? formatTime(modifyMeta.content) : null;

            if (createTimeStr) {
                createDate = new Date(createMeta.content);
                const minutesDiff = createDate ? Math.floor((new Date() - createDate) / (1000 * 60)) : 0;
                const timeStyle = minutesDiff > 30 * 24 * 60 ? 'color: #ff6b6b; font-weight: bold;' : 'color: #8590a6;';
                displayHtml += `<span style="color: #8590a6;">发布于 </span><span style="${timeStyle}">${createTimeStr}</span>`;
            }

            // 如果有编辑时间，且不等于发布时间，显示编辑时间
            if (modifyTimeStr && modifyTimeStr !== createTimeStr) {
                if (displayHtml) displayHtml += '<span>•</span>';
                displayHtml += `<span style="color: #8590a6;">编辑于 ${modifyTimeStr}</span>`;
            }
        } else {
            // 方案 B (兜底): 如果真的没找到 meta，尝试找一下 ContentItem-time
            // 这种情况比较少见，可能是某些纯文字回答或者特殊卡片
            const visibleTimeEl = item.querySelector('.ContentItem-time');
            if (visibleTimeEl) {
                displayHtml = `<span>${visibleTimeEl.innerText.replace(/\s+/g, ' ')}</span>`;
            }
        }

        // 4. 计算并显示赞评比
        const { voteCount, commentCount } = getVoteAndCommentCount(item);
        if (voteCount > 0) {
            if (displayHtml) displayHtml += '<span>•</span>';
            if (commentCount === 0) {
                displayHtml += `<span style="color: #8590a6;">无评论</span>`;
            } else {
                const ratio = (voteCount / commentCount).toFixed(2);
                const ratioStyle = ratio >= 10 ? 'color: #4caf50; font-weight: bold;' : 'color: #8590a6;';
                displayHtml += `<span style="color: #8590a6;">赞评比=</span><span style="${ratioStyle}">${ratio}</span>`;
            }
        }

        // 5. 插入 DOM
        if (displayHtml) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'custom-time-header';
            timeDiv.style.cssText = TIME_STYLE;
            timeDiv.innerHTML = displayHtml;

            // 插入到标题上方
            if (titleEl.parentNode) {
                titleEl.parentNode.insertBefore(timeDiv, titleEl);
            }
            // 标记已处理
            item.dataset.timeInjected = 'true';
        }
    }

    /**
     * 扫描页面
     */
    function scanAndProcess() {
        // 查找所有的内容卡片
        const items = document.querySelectorAll('.ContentItem');
        items.forEach(processItem);
    }

    // --- 启动逻辑 ---

    // 1. 立即运行一次
    scanAndProcess();

    // 2. 监听滚动加载
    const observer = new MutationObserver((mutations) => {
        // 简单防抖：只要有节点增加就尝试扫描
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) {
            scanAndProcess();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();