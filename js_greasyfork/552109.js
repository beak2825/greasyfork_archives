// ==UserScript==
// @name         Linux.do AI对话导出工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在Linux.do AI对话列表页面添加一键下载按钮,导出历史对话的标题和内容
// @author       You
// @match        https://linux.do/discourse-ai/ai-bot/conversations
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552109/Linuxdo%20AI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552109/Linuxdo%20AI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局按钮引用
    let downloadButton = null;

    // 创建下载按钮
    function createDownloadButton() {
        // 如果按钮已存在，直接返回
        if (downloadButton && document.body.contains(downloadButton)) {
            return downloadButton;
        }

        // 移除旧按钮（如果存在但已脱离DOM）
        if (downloadButton) {
            try {
                downloadButton.remove();
            } catch (e) {}
        }

        const button = document.createElement('button');
        button.id = 'linuxdo-export-button'; // 添加唯一ID
        button.textContent = '📥 导出所有对话';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', startExport);
        document.body.appendChild(button);
        downloadButton = button;
        return button;
    }

    // 移除下载按钮
    function removeDownloadButton() {
        if (downloadButton && document.body.contains(downloadButton)) {
            downloadButton.remove();
            downloadButton = null;
        }
    }

    // 创建进度提示框
    function createProgressModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            min-width: 400px;
            display: none;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #333;">正在导出对话...</h3>
            <div style="margin-bottom: 10px;">
                <div style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div id="progress-bar" style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
            <p id="progress-text" style="margin: 10px 0 0 0; color: #666; font-size: 14px;">准备中...</p>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    // 更新进度
    function updateProgress(modal, percent, text) {
        const progressBar = modal.querySelector('#progress-bar');
        const progressText = modal.querySelector('#progress-text');
        progressBar.style.width = percent + '%';
        progressText.textContent = text;
    }

    // 获取对话列表
    function getConversationList() {
        const conversations = [];
        const listItems = document.querySelectorAll('a[href^="/t/topic/"]');

        listItems.forEach(item => {
            const title = item.textContent.trim();
            const href = item.getAttribute('href');
            const url = 'https://linux.do' + href;

            // 去重
            if (title && !conversations.some(c => c.url === url)) {
                conversations.push({ title, url });
            }
        });

        return conversations;
    }

    // 获取单个对话的详细内容
    async function fetchConversationContent(url) {
        try {
            // 提取 topic ID
            const topicIdMatch = url.match(/\/topic\/(\d+)/);
            if (!topicIdMatch) {
                console.error('无法提取 topic ID:', url);
                return null;
            }

            const topicId = topicIdMatch[1];

            // 尝试使用 Discourse JSON API
            try {
                const jsonUrl = `https://linux.do/t/${topicId}.json`;
                const response = await fetch(jsonUrl);

                if (response.ok) {
                    const data = await response.json();

                    // 从 JSON 数据中提取信息
                    const title = data.title || '';
                    const posts = [];

                    if (data.post_stream && data.post_stream.posts) {
                        data.post_stream.posts.forEach(post => {
                            const username = post.username || '未知用户';
                            const content = post.cooked ? stripHtml(post.cooked) : '';
                            const time = post.created_at || '';

                            if (content) {
                                posts.push({
                                    username,
                                    time,
                                    content
                                });
                            }
                        });
                    }

                    return {
                        title,
                        url,
                        posts,
                        timestamp: new Date().toISOString()
                    };
                }
            } catch (apiError) {
                console.warn('JSON API 失败，尝试备用方法:', apiError);
            }

            // 备用方法：创建 iframe 加载页面
            return await fetchViaIframe(url);

        } catch (error) {
            console.error('获取对话内容失败:', url, error);
            return null;
        }
    }

    // 移除 HTML 标签
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // 通过 iframe 加载页面并提取内容
    function fetchViaIframe(url) {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;

            const timeout = setTimeout(() => {
                document.body.removeChild(iframe);
                resolve(null);
            }, 10000); // 10秒超时

            iframe.onload = () => {
                try {
                    clearTimeout(timeout);

                    const doc = iframe.contentDocument || iframe.contentWindow.document;

                    // 等待内容加载
                    setTimeout(() => {
                        const title = doc.querySelector('h1')?.textContent?.trim() || '';
                        const posts = [];
                        const postElements = doc.querySelectorAll('article.boxed');

                        postElements.forEach(post => {
                            // 查找用户名
                            const usernameLinks = post.querySelectorAll('a[data-user-card]');
                            const username = usernameLinks.length > 0 ?
                                usernameLinks[0].textContent.trim() : '未知用户';

                            // 查找内容
                            const contentEl = post.querySelector('.cooked');
                            const content = contentEl ? contentEl.innerText.trim() : '';

                            // 查找时间
                            const timeEl = post.querySelector('time');
                            const time = timeEl ? timeEl.getAttribute('datetime') || '' : '';

                            if (content) {
                                posts.push({
                                    username,
                                    time,
                                    content
                                });
                            }
                        });

                        document.body.removeChild(iframe);

                        resolve({
                            title,
                            url,
                            posts,
                            timestamp: new Date().toISOString()
                        });
                    }, 2000); // 等待2秒让内容渲染

                } catch (error) {
                    console.error('iframe 提取失败:', error);
                    clearTimeout(timeout);
                    document.body.removeChild(iframe);
                    resolve(null);
                }
            };

            iframe.onerror = () => {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                resolve(null);
            };

            document.body.appendChild(iframe);
        });
    }

    // 延迟函数,避免请求过快
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 开始导出
    async function startExport() {
        const modal = createProgressModal();
        modal.style.display = 'block';

        try {
            // 1. 获取对话列表
            updateProgress(modal, 10, '正在获取对话列表...');
            const conversations = getConversationList();
            console.log('找到', conversations.length, '个对话');

            if (conversations.length === 0) {
                alert('未找到任何对话');
                modal.style.display = 'none';
                return;
            }

            // 2. 获取每个对话的详细内容
            const allData = [];
            for (let i = 0; i < conversations.length; i++) {
                const conv = conversations[i];
                const percent = 10 + (i / conversations.length) * 80;
                updateProgress(modal, percent, `正在获取第 ${i + 1}/${conversations.length} 个对话: ${conv.title}`);

                const content = await fetchConversationContent(conv.url);
                if (content) {
                    allData.push(content);
                }

                // 每个请求之间延迟500ms,避免请求过快
                if (i < conversations.length - 1) {
                    await delay(500);
                }
            }

            // 3. 生成导出数据
            updateProgress(modal, 95, '正在生成导出文件...');

            // 生成JSON文件
            const jsonData = {
                exportTime: new Date().toISOString(),
                totalConversations: allData.length,
                conversations: allData
            };

            // 生成Markdown文件
            const markdownContent = generateMarkdown(allData);

            // 4. 下载文件
            downloadJSON(jsonData);
            await delay(500);
            downloadMarkdown(markdownContent);

            updateProgress(modal, 100, '导出完成!');
            await delay(1500);
            modal.style.display = 'none';

            alert(`成功导出 ${allData.length} 个对话!\n已生成JSON和Markdown两种格式`);

        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败: ' + error.message);
            modal.style.display = 'none';
        }
    }

    // 生成Markdown格式
    function generateMarkdown(conversations) {
        let md = '# Linux.do AI对话导出\n\n';
        md += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
        md += `对话总数: ${conversations.length}\n\n`;
        md += '---\n\n';

        conversations.forEach((conv, index) => {
            md += `## ${index + 1}. ${conv.title}\n\n`;
            md += `**链接**: ${conv.url}\n\n`;

            if (conv.posts && conv.posts.length > 0) {
                conv.posts.forEach((post, postIndex) => {
                    md += `### ${post.username}\n\n`;
                    if (post.time) {
                        md += `*${post.time}*\n\n`;
                    }
                    md += `${post.content}\n\n`;
                    md += '---\n\n';
                });
            } else {
                md += '*该对话暂无内容*\n\n';
            }

            md += '\n\n';
        });

        return md;
    }

    // 下载JSON文件
    function downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linux-do-conversations-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 下载Markdown文件
    function downloadMarkdown(content) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linux-do-conversations-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 检查当前URL是否为目标页面
    function isTargetPage() {
        const currentUrl = window.location.href;
        const targetUrl = 'https://linux.do/discourse-ai/ai-bot/conversations';
        return currentUrl === targetUrl || currentUrl === targetUrl + '/';
    }

    // 更新按钮状态（显示或隐藏）
    function updateButtonState() {
        if (isTargetPage()) {
            // 在目标页面，等待内容加载后显示按钮
            const checkInterval = setInterval(() => {
                const conversationLinks = document.querySelectorAll('a[href^="/t/topic/"]');
                if (conversationLinks.length > 0) {
                    clearInterval(checkInterval);
                    createDownloadButton();
                    console.log('✅ Linux.do AI对话导出工具已加载');
                }
            }, 500);

            // 5秒后停止检查
            setTimeout(() => clearInterval(checkInterval), 5000);
        } else {
            // 不在目标页面，移除按钮
            removeDownloadButton();
        }
    }

    // 监听 URL 变化（用于 SPA 路由）
    function setupUrlChangeListener() {
        // 监听 popstate 事件（浏览器前进/后退）
        window.addEventListener('popstate', () => {
            setTimeout(updateButtonState, 100);
        });

        // 劫持 pushState 和 replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(updateButtonState, 100);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(updateButtonState, 100);
        };

        // 使用 MutationObserver 监听 URL 变化（备用方案）
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                setTimeout(updateButtonState, 100);
            }
        });

        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }

    // 初始化脚本
    function init() {
        console.log('🚀 Linux.do AI对话导出工具初始化...');

        // 首次检查并更新按钮状态
        updateButtonState();

        // 设置 URL 变化监听
        setupUrlChangeListener();
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
