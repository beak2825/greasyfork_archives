// ==UserScript==
// @name         US Card Forum 全文下载器
// @name:en      US Card Forum Full Topic Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 uscardforum.com 帖子页面右下角添加一个按钮，用于下载整个话题的 Markdown 全文。能正确处理 .../topic_id/post_id 格式的URL。
// @description:en Adds a button to the bottom right of uscardforum.com topic pages to download the entire topic as a single Markdown file. Correctly handles .../topic_id/post_id URLs.
// @author       Gemini
// @match        https://www.uscardforum.com/t/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550399/US%20Card%20Forum%20%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550399/US%20Card%20Forum%20%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const BUTTON_STYLE = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        backgroundColor: '#313131',
        color: '#A6A6A6',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };

    const BUTTON_TEXT = '下载全文';
    const BUTTON_TEXT_LOADING = '下载中...';
    const BUTTON_TEXT_DONE = '下载完成';

    // --- 主逻辑 ---

    /**
     * 从当前 URL 中提取 topic_id (已修正)
     * @returns {string|null} topic_id 或 null
     */
    function getTopicId() {
        // 修正正则表达式以匹配 /t/slug/<topic_id> 结构
        // 这样可以避免捕获末尾的 post_id
        const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * 从页面标题中提取并清理话题名称
     * @returns {string} 清理后的话题名
     */
    function getTopicName() {
        // 例如: "这是一个话题标题 - 美国信用卡指南" -> "这是一个话题标题"
        const title = document.title.replace(/\s-\s(美国信用卡指南|US Card Forum)$/, '').trim();
        // 替换在文件名中非法的字符
        return title.replace(/[\\/:*?"<>|]/g, '_');
    }

    /**
     * 触发文件下载
     * @param {string} filename - 下载的文件名
     * @param {string} content - 文件内容
     */
    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    /**
     * 递归获取所有页面的 Markdown 内容
     * @param {string} topicId - 话题 ID
     * @param {number} page - 当前要获取的页码
     * @param {string[]} accumulatedContent - 已累积的内容数组
     * @returns {Promise<string>} 拼接后的完整内容
     */
    async function fetchAllPages(topicId, page = 1, accumulatedContent = []) {
        const url = `https://www.uscardforum.com/raw/${topicId}?page=${page}`;
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
            }
            const text = await response.text();
            if (text && text.trim().length > 0) {
                accumulatedContent.push(text);
                // 为了避免请求过于频繁，可以加入一个小的延时
                await new Promise(resolve => setTimeout(resolve, 100));
                return fetchAllPages(topicId, page + 1, accumulatedContent);
            } else {
                return accumulatedContent.join('\n\n---\n\n'); // 使用分隔符拼接不同页面的内容
            }
        } catch (error) {
            console.error(`获取第 ${page} 页内容时出错:`, error);
            alert(`获取第 ${page} 页内容时出错，请检查控制台获取更多信息。`);
            return null; // 返回 null 表示失败
        }
    }


    /**
     * 按钮点击事件处理函数
     * @param {Event} event - 点击事件对象
     */
    async function handleDownloadClick(event) {
        const button = event.target;
        const topicId = getTopicId();
        const topicName = getTopicName();

        if (!topicId || !topicName) {
            alert('无法从此页面提取话题 ID 或标题。');
            return;
        }

        button.textContent = BUTTON_TEXT_LOADING;
        button.disabled = true;

        const fullMarkdown = await fetchAllPages(topicId);

        if (fullMarkdown !== null) {
            downloadFile(`${topicName}.md`, fullMarkdown);
            button.textContent = BUTTON_TEXT_DONE;
        } else {
            button.textContent = '下载失败';
        }

        // 几秒后恢复按钮状态
        setTimeout(() => {
            button.textContent = BUTTON_TEXT;
            button.disabled = false;
        }, 3000);
    }

    /**
     * 创建并显示下载按钮
     */
    function createDownloadButton() {
        if (!getTopicId()) {
            console.log('当前页面不是一个有效的话题页面，不加载下载按钮。');
            return;
        }

        const button = document.createElement('button');
        button.textContent = BUTTON_TEXT;
        Object.assign(button.style, BUTTON_STYLE);

        button.addEventListener('click', handleDownloadClick);

        document.body.appendChild(button);
    }

    // --- 启动脚本 ---
    // 等待页面加载完成再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDownloadButton);
    } else {
        createDownloadButton();
    }

})();