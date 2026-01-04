// ==UserScript==
// @name         NGA 成分分析器
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  自动提取NGA用户的所有回复，支持导出CSV和Markdown格式，10维度量化评分+AI分析用户画像
// @author       su3sl3h06
// @license      MIT
// @match        https://nga.178.com/thread.php*
// @match        https://bbs.nga.cn/thread.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559662/NGA%20%E6%88%90%E5%88%86%E5%88%86%E6%9E%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559662/NGA%20%E6%88%90%E5%88%86%E5%88%86%E6%9E%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储提取的数据
    let allReplies = [];
    let allTopics = [];
    let isRunning = false;
    let shouldStop = false;

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'reply-extractor-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                width: 320px;
                background: white;
                border: 2px solid #ccc;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
            ">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                    NGA 回复提取器
                </h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">
                        提取模式：
                    </label>
                    <select id="extract-mode" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                    ">
                        <option value="all">提取所有页面（上限500条）</option>
                        <option value="custom">自定义页数</option>
                    </select>
                </div>

                <div id="custom-pages-container" style="margin-bottom: 15px; display: none;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">
                        提取页数：
                    </label>
                    <input 
                        type="number" 
                        id="pages-to-extract" 
                        min="1" 
                        value="5"
                        style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 14px;
                        "
                    />
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">
                        延迟时间（毫秒）：
                    </label>
                    <input 
                        type="number" 
                        id="delay-time" 
                        min="500" 
                        value="1500"
                        style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 14px;
                        "
                    />
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="
                        background: #f5f5f5;
                        padding: 10px;
                        border-radius: 4px;
                        font-size: 13px;
                    ">
                        <div>当前页: <span id="current-page">-</span></div>
                        <div>总页数: <span id="total-pages">-</span></div>
                        <div>已提取: <span id="extracted-count">0</span> 条</div>
                        <div>状态: <span id="status">等待中</span></div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="
                        width: 100%;
                        height: 20px;
                        background: #f0f0f0;
                        border-radius: 10px;
                        overflow: hidden;
                    ">
                        <div id="progress-bar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #4CAF50, #8BC34A);
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #666; margin-top: 5px;">
                        <span id="progress-text">0%</span>
                    </div>
                </div>

                <button id="start-extract-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 10px;
                ">
                    开始提取
                </button>

                <button id="stop-extract-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 10px;
                    display: none;
                ">
                    停止提取
                </button>

                <button id="export-csv-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 10px;
                " disabled>
                    导出 CSV
                </button>

                <button id="export-md-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #FF9800;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 10px;
                " disabled>
                    📥 导出 MD 文件
                </button>

                <button id="copy-md-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #9C27B0;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 10px;
                " disabled>
                    📋 复制 MD 内容
                </button>

                <button id="close-panel-btn" style="
                    width: 100%;
                    padding: 8px;
                    background: #fff;
                    color: #666;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                    cursor: pointer;
                ">
                    关闭面板
                </button>
            </div>
        `;
        document.body.appendChild(panel);
        bindEvents();
    }

    // 收集该用户自己创建的主题URL（从已提取回复中筛选）
    function collectUserAuthoredTopicUrls(username) {
        const set = new Set();
        if (!username) return set;
        allReplies.forEach(r => {
            if ((r.主题作者 || '').trim() === username && r.主题链接) {
                set.add(r.主题链接.split('#')[0]);
            }
        });
        return set;
    }

    // 抓取主题正文（标题/节点/正文），limit用于限制最多抓取数量
    async function fetchTopicsContent(urls, delayMs = 1200, limit = 30, onProgress) {
        const topics = [];
        const slice = urls.slice(0, Math.max(0, limit));
        for (let i = 0; i < slice.length; i++) {
            const url = slice[i];
            try {
                // 节流
                if (i > 0) {
                    await new Promise(r => setTimeout(r, delayMs));
                }
                const html = await fetch(url, { credentials: 'include' }).then(res => res.text());
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const title = doc.querySelector('.post-wrapper .header h1')?.textContent?.trim() ||
                               doc.querySelector('h1')?.textContent?.trim() || '';
                const node = doc.querySelector('.post-wrapper .header a[href^="/go/"]')?.textContent?.trim() || '';
                const bodyEl = doc.querySelector('.topic_content .markdown_body') || doc.querySelector('.topic_content');
                let body = bodyEl ? bodyEl.textContent.trim() : '';
                // 压缩多余空白
                body = body.replace(/\u00a0/g, ' ').replace(/\s{3,}/g, ' ').replace(/[\r\t]+/g, '').trim();

                topics.push({ 标题: title, 节点: node, 正文: body });
                if (typeof onProgress === 'function') {
                    onProgress(i + 1, slice.length);
                }
            } catch (e) {
                console.error('抓取主题失败:', url, e);
                if (typeof onProgress === 'function') {
                    onProgress(i + 1, slice.length);
                }
            }
        }
        return topics;
    }

    // 统一Toast
    function showToast(message, durationMs = 10000) {
        try {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 28px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                z-index: 10001;
                font-size: 15px;
                font-weight: bold;
                text-align: center;
                line-height: 1.6;
                animation: fadeInOut ${Math.max(200, durationMs)}ms ease-in-out;
                white-space: pre-line;
            `;
            toast.innerHTML = `✅\n${message}`;

            if (!document.getElementById('toast-animation-style')) {
                const style = document.createElement('style');
                style.id = 'toast-animation-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
                        10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, durationMs);
        } catch (e) {
            // 兜底
            console.log('Toast:', message);
        }
    }

    // 绑定事件
    function bindEvents() {
        // 模式切换
        document.getElementById('extract-mode').addEventListener('change', function(e) {
            const customContainer = document.getElementById('custom-pages-container');
            customContainer.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });

        // 开始提取
        document.getElementById('start-extract-btn').addEventListener('click', startExtraction);

        // 停止提取
        document.getElementById('stop-extract-btn').addEventListener('click', stopExtraction);

        // 导出CSV
        document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);

        // 导出MD
        document.getElementById('export-md-btn').addEventListener('click', exportToMarkdown);

        // 复制MD到剪贴板
        document.getElementById('copy-md-btn').addEventListener('click', copyMarkdownToClipboard);

        // 关闭面板
        document.getElementById('close-panel-btn').addEventListener('click', function() {
            document.getElementById('reply-extractor-panel').style.display = 'none';
        });
    }

    // 获取当前页面信息
    function getPageInfo() {
        const headerText = document.querySelector('.box .header')?.textContent || '';
        const match = headerText.match(/第\s*(\d+)\s*页\s*\/\s*共\s*(\d+)\s*页/);
        
        if (match) {
            return {
                currentPage: parseInt(match[1]),
                totalPages: parseInt(match[2])
            };
        }
        
        // 如果没有分页信息，说明只有一页
        return {
            currentPage: 1,
            totalPages: 1
        };
    }

    // 提取当前页面的回复
    function extractCurrentPage() {
        const replies = [];
        const dockAreas = document.querySelectorAll('.dock_area');
        
        dockAreas.forEach((dockArea, index) => {
            try {
                // 获取时间
                const timeElement = dockArea.querySelector('.fr .fade');
                const time = timeElement ? timeElement.textContent.trim() : '';

                // 获取回复信息
                const graySpan = dockArea.querySelector('.gray');
                if (!graySpan) return;

                // 获取主题作者
                const authorLink = graySpan.querySelector('a[href^="/member/"]');
                const author = authorLink ? authorLink.textContent.trim() : '';

                // 获取板块
                const boardLink = graySpan.querySelector('a[href^="/go/"]');
                const board = boardLink ? boardLink.textContent.trim() : '';

                // 获取主题标题和链接
                const topicLink = graySpan.querySelector('a[href^="/t/"]');
                const topicTitle = topicLink ? topicLink.textContent.trim() : '';
                const topicUrl = topicLink ? 'https://www.NGA.com' + topicLink.getAttribute('href') : '';

                // 获取回复内容
                let replyContent = '';
                const nextInner = dockArea.nextElementSibling;
                if (nextInner && (nextInner.classList.contains('inner') || nextInner.classList.contains('cell'))) {
                    const contentDiv = nextInner.querySelector('.reply_content');
                    if (contentDiv) {
                        replyContent = contentDiv.textContent.trim();
                    }
                }

                if (replyContent) {
                    replies.push({
                        时间: time,
                        主题作者: author,
                        板块: board,
                        主题标题: topicTitle,
                        主题链接: topicUrl,
                        回复内容: replyContent
                    });
                }
            } catch (error) {
                console.error('提取回复时出错:', error);
            }
        });

        return replies;
    }

    // 更新UI
    function updateUI(currentPage, totalPages, extractedCount, status, progress) {
        document.getElementById('current-page').textContent = currentPage;
        document.getElementById('total-pages').textContent = totalPages;
        document.getElementById('extracted-count').textContent = extractedCount;
        document.getElementById('status').textContent = status;
        document.getElementById('progress-bar').style.width = progress + '%';
        document.getElementById('progress-text').textContent = Math.round(progress) + '%';
    }

    // 开始提取
    async function startExtraction() {
        if (isRunning) return;

        isRunning = true;
        shouldStop = false;
        allReplies = [];
        allTopics = [];

        // 更新按钮状态
        document.getElementById('start-extract-btn').style.display = 'none';
        document.getElementById('stop-extract-btn').style.display = 'block';
        document.getElementById('export-csv-btn').disabled = true;
        document.getElementById('export-md-btn').disabled = true;
        document.getElementById('copy-md-btn').disabled = true;

        // 获取配置
        const mode = document.getElementById('extract-mode').value;
        const customPages = parseInt(document.getElementById('pages-to-extract').value) || 5;
        const delay = parseInt(document.getElementById('delay-time').value) || 1500;

        // 获取页面信息
        const pageInfo = getPageInfo();
        const totalPages = mode === 'all' ? pageInfo.totalPages : Math.min(customPages, pageInfo.totalPages);
        
        updateUI(pageInfo.currentPage, totalPages, 0, '正在提取...', 0);

        try {
            // 提取当前页
            const currentReplies = extractCurrentPage();
            allReplies.push(...currentReplies);
            if (allReplies.length >= 500) {
                allReplies = allReplies.slice(0, 500);
                updateUI(pageInfo.currentPage, totalPages, allReplies.length, '已达到500条上限，停止提取', (pageInfo.currentPage / totalPages) * 100);
                shouldStop = true;
            }
            updateUI(pageInfo.currentPage, totalPages, allReplies.length, '正在提取...', 
                    (pageInfo.currentPage / totalPages) * 100);

            // 如果需要提取更多页
            if (totalPages > pageInfo.currentPage && !shouldStop) {
                for (let page = pageInfo.currentPage + 1; page <= totalPages; page++) {
                    if (allReplies.length >= 500) break;
                    if (shouldStop) break;

                    updateUI(page, totalPages, allReplies.length, `正在加载第 ${page} 页...`, 
                            ((page - 1) / totalPages) * 100);

                    // 等待延迟
                    await new Promise(resolve => setTimeout(resolve, delay));

                    // 跳转到下一页
                    const nextPageUrl = window.location.pathname + '?p=' + page;
                    await loadPage(nextPageUrl);

                    // 提取新页面的回复
                    const newReplies = extractCurrentPage();
                    allReplies.push(...newReplies);
                    if (allReplies.length >= 500) {
                        allReplies = allReplies.slice(0, 500);
                        shouldStop = true;
                    }
                    
                    updateUI(page, totalPages, allReplies.length, '正在提取...', 
                            (page / totalPages) * 100);
                }
            }

            // 无论是否达到上限/主动停止，均尝试抓取该用户创建的主题内容
            const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1] || '';
            try {
                const topicUrls = collectUserAuthoredTopicUrls(username);
                if (topicUrls.size > 0) {
                    updateUI(totalPages, totalPages, allReplies.length, `提取完成，正在抓取主题正文（${topicUrls.size}）...`, 95);
                    const delayMs = parseInt(document.getElementById('delay-time').value) || 1500;
                    allTopics = await fetchTopicsContent(
                        Array.from(topicUrls),
                        delayMs,
                        30,
                        (done, total) => {
                            const pct = 95 + Math.min(5, (done / Math.max(1, total)) * 5);
                            updateUI(totalPages, totalPages, allReplies.length, `抓取主题正文 ${done}/${total} ...`, pct);
                        }
                    );
                    showToast(`提取完成\n抓取到用户创建的主题：${allTopics.length} 篇`);
                }
            } catch (e) {
                console.error('抓取主题正文失败:', e);
            }
            updateUI(totalPages, totalPages, allReplies.length, '提取完成！', 100);

        } catch (error) {
            console.error('提取过程出错:', error);
            updateUI('-', '-', allReplies.length, '提取出错', 0);
        }

        // 恢复按钮状态
        document.getElementById('start-extract-btn').style.display = 'block';
        document.getElementById('stop-extract-btn').style.display = 'none';
        document.getElementById('export-csv-btn').disabled = false;
        document.getElementById('export-md-btn').disabled = false;
        document.getElementById('copy-md-btn').disabled = false;
        isRunning = false;
    }

    // 停止提取
    function stopExtraction() {
        shouldStop = true;
        updateUI('-', '-', allReplies.length, '正在停止...', 0);
    }

    // 加载页面
    function loadPage(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // 替换主内容区域
                    const newMain = doc.querySelector('#Main');
                    const oldMain = document.querySelector('#Main');
                    if (newMain && oldMain) {
                        oldMain.innerHTML = newMain.innerHTML;
                    }
                    
                    // 更新URL
                    window.history.pushState({}, '', url);
                    
                    resolve();
                })
                .catch(error => {
                    console.error('加载页面失败:', error);
                    reject(error);
                });
        });
    }

    // 导出为CSV
    function exportToCSV() {
        if (allReplies.length === 0) {
            showToast('没有数据可以导出！');
            return;
        }

        // CSV头部
        const headers = ['时间', '主题作者', '板块', '主题标题', '主题链接', '回复内容'];
        
        // 转换为CSV格式
        let csv = '\uFEFF'; // 添加BOM以支持中文
        csv += headers.join(',') + '\n';

        allReplies.forEach(reply => {
            const row = headers.map(header => {
                let value = reply[header] || '';
                // 转义双引号并用双引号包裹包含逗号、换行或双引号的字段
                value = value.replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                    value = '"' + value + '"';
                }
                return value;
            });
            csv += row.join(',') + '\n';
        });

        // 创建下载
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // 获取用户名
        const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1] || 'user';
        const filename = `NGA_${username}_replies_${new Date().getTime()}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`成功导出 ${allReplies.length} 条回复！`);
    }

    // 导出为Markdown格式（用于AI分析）
    function exportToMarkdown() {
        if (allReplies.length === 0) {
            showToast('没有数据可以导出！');
            return;
        }

        // 文本清洗，节约token
        const sanitizeForLLM = (text) => {
            let t = (text || '').toString();
            // 移除URL
            t = t.replace(/https?:\/\/[^\s)]+/g, '');
            // 去掉强调/代码等常见Markdown符号
            t = t.replace(/\*\*|__|`/g, '');
            // 折叠多空格
            t = t.replace(/\s{2,}/g, ' ');
            // 规范换行
            t = t.replace(/\n{3,}/g, '\n\n');
            return t.trim();
        };

        // 获取用户名
        const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1] || 'unknown_user';
        
        // 统计信息
        const totalReplies = allReplies.length;
        const boards = [...new Set(allReplies.map(r => r.板块))];
        const boardStats = {};
        allReplies.forEach(reply => {
            const board = reply.板块 || '未知';
            boardStats[board] = (boardStats[board] || 0) + 1;
        });
        const sortedBoards = Object.entries(boardStats).sort((a, b) => b[1] - a[1]);

        // 构建Markdown内容
        let markdown = `# NGA 用户画像分析任务

## 📋 任务说明

你是一位专业的用户行为分析师。现在需要你根据下方提供的NGA用户回复数据，深入分析该用户的完整人物画像。

---

## 👤 分析对象

- **用户名**: ${username}
- **数据来源**: NGA (一个面向创意工作者的中文社区)
- **回复总数**: ${totalReplies} 条
- **活跃板块数**: ${boards.length} 个
- **数据提取时间**: ${new Date().toLocaleString('zh-CN')}

---

## 📊 基础数据概览

### 板块活跃度统计（Top 10）

| 排名 | 板块名称 | 回复次数 | 占比 |
|------|---------|---------|------|
`;

        // 添加板块统计
        sortedBoards.slice(0, 10).forEach((item, index) => {
            const [board, count] = item;
            const percentage = ((count / totalReplies) * 100).toFixed(1);
            markdown += `| ${index + 1} | ${board} | ${count} | ${percentage}% |\n`;
        });

        markdown += `\n---

## 🧵 用户创建的主题（采样）

从用户创建的主题中抽取正文内容（最多展示30篇，用于辅助AI判断立场与真实度）：

${(allTopics && allTopics.length ? allTopics : []).map((t, idx) => `### 主题 #${idx + 1}\n\n节点: ${t.节点 || '-'}\n标题: ${t.标题 || '-'}\n\n正文:\n> ${(t.正文 || '').split('\\n').join('\\n> ')}\n\n---\n`).join('')}

## 💬 完整回复记录（最多500条）

以下为该用户的回复内容（按时间从新到旧，最多500条）：

`;

        // 添加所有回复（最多500条）
        (allReplies.slice(0, 500)).forEach((reply, index) => {
            markdown += `### 回复 #${index + 1}\n\n时间: ${reply.时间}  \n板块: ${reply.板块}  \n主题: ${reply.主题标题}  \n主题作者: ${reply.主题作者}  \n回复内容:\n> ${reply.回复内容.split('\\n').join('\\n> ')}\n\n---\n\n`;
        });

        // 添加分析要求
        markdown += `
---

## 🎯 分析任务要求

请基于以上所有回复数据，从以下维度深入分析该用户，并生成一份详细的**量化用户画像报告**。

**重要**: 每个维度必须按照给定的评分标准打分，不能凭主观感觉！

---

## 📊 评分标准与分析维度

### 1. 技术能力评估 💻 (1-10分)

**评分标准**:
- **1-3分**: 非技术用户，基本不涉及技术讨论
- **4-6分**: 技术爱好者，了解基础技术概念，偶尔讨论技术话题
- **7-8分**: 技术从业者，熟悉特定技术栈，经常分享技术见解
- **9-10分**: 技术专家，深入讨论底层原理，能解决复杂技术问题

**量化指标**:
- 技术相关回复占比: ____%
- 提及的技术关键词数量: ___个
- 技术深度（是否涉及原理/架构/底层）: 是/否

**分析要点**:
- 主要技术栈（编程语言、框架、工具等）
- 技术广度与深度
- 是否有专业技术背景
- 对新技术的接受程度

**评分**: ___/10 分

---

### 2. 消费能力评估 💰 (1-10分)

**评分标准**:
- **1-3分**: 消费保守，注重性价比，多讨论如何省钱
- **4-6分**: 消费适中，偶尔购买中高端产品，理性消费
- **7-8分**: 消费能力较强，经常购买中高端产品，品质优先
- **9-10分**: 消费能力很强，购买高端/奢侈品，价格不敏感

**量化指标**:
- 提及的产品价格范围: ￥___ - ￥___
- 高价值物品（>5000元）提及次数: ___次
- 投资/理财相关讨论: ___次

**分析要点**:
- 提及的具体产品及价格（如手机、电脑、旅行等）
- 消费观念（性价比/品质/奢侈）
- 是否有投资理财意识
- 经济压力感知

**评分**: ___/10 分

---

### 3. 专业深度评估 🎓 (1-10分)

**评分标准**:
- **1-3分**: 泛泛而谈，缺乏专业见解
- **4-6分**: 在某些领域有一定见解，但不够深入
- **7-8分**: 在1-2个领域有专业见解，能给出专业建议
- **9-10分**: 多领域专家，回复经常被认可，有行业影响力

**量化指标**:
- 专业术语使用频率: 高/中/低
- 深度分析回复占比: ____%
- 被@请教的次数: ___次（从回复中推断）

**分析要点**:
- 专业领域识别（职业相关）
- 知识深度与广度
- 是否经常解答他人问题
- 专业表达能力

**评分**: ___/10 分

---

### 4. 社交活跃度 👥 (1-10分)

**评分标准**:
- **1-3分**: 很少互动，回复简短，不主动交流
- **4-6分**: 适度互动，偶尔参与讨论，回复中等长度
- **7-8分**: 活跃互动，经常@他人，回复详细，乐于助人
- **9-10分**: 高度活跃，社区KOL，有固定交流圈子

**量化指标**:
- 平均回复长度: ___字
- @他人次数: ___次
- 回复情感倾向: 友善/中性/冷淡
- 活跃板块数量: ___个

**分析要点**:
- 交流主动性
- 互动频率和质量
- 是否有固定交流对象
- 社交风格（热情/礼貌/高冷）

**评分**: ___/10 分

---

### 5. 兴趣广度评估 🎮 (1-10分)

**评分标准**:
- **1-3分**: 兴趣单一，只关注1-2个领域
- **4-6分**: 兴趣适中，关注3-5个不同领域
- **7-8分**: 兴趣广泛，跨多个领域（科技/生活/娱乐等）
- **9-10分**: 兴趣极其广泛，涉猎各个领域，博学多才

**量化指标**:
- 涉及的主题类别数: ___个
- 话题分散度: 高/中/低
- 跨领域讨论占比: ____%

**分析要点**:
- 主要兴趣点列表
- 兴趣深度（入门/进阶/专家）
- 是否有特别突出的兴趣
- 兴趣是否与职业相关

**评分**: ___/10 分

---

### 6. 情绪稳定性 🧩 (1-10分)

**评分标准**:
- **1-3分**: 情绪波动大，经常抱怨/焦虑/愤怒
- **4-6分**: 情绪一般，偶尔流露负面情绪
- **7-8分**: 情绪稳定，多数回复平和理性
- **9-10分**: 情绪非常稳定，始终保持积极乐观态度

**量化指标**:
- 负面情绪词汇出现次数: ___次（如：郁闷、烦、气、无语等）
- 正面情绪词汇出现次数: ___次（如：开心、爽、赞、喜欢等）
- 中性客观回复占比: ____%

**分析要点**:
- 主要情绪倾向
- 压力/焦虑表现
- 对挫折的态度
- 生活满意度

**评分**: ___/10 分

---

### 7. 生活品质指数 🌟 (1-10分)

**评分标准**:
- **1-3分**: 生活压力大，多讨论省钱、焦虑、工作压力
- **4-6分**: 生活一般，工作生活平衡，偶尔享受生活
- **7-8分**: 生活品质较高，经常旅行/美食/娱乐
- **9-10分**: 生活品质很高，追求精致生活，时间自由

**量化指标**:
- 休闲娱乐相关回复: ___次
- 旅行/美食/爱好讨论: ___次
- 加班/压力相关吐槽: ___次

**分析要点**:
- 工作生活平衡
- 休闲娱乐方式
- 生活态度（积极/佛系/焦虑）
- 是否有生活追求

**评分**: ___/10 分

---

### 8. 影响力指数 🏆 (1-10分)

**评分标准**:
- **1-3分**: 无影响力，回复少人关注
- **4-6分**: 影响力一般，偶尔有高质量回复
- **7-8分**: 有一定影响力，回复经常被认可
- **9-10分**: 社区意见领袖，高质量输出，被广泛认可

**量化指标**:
- 回复质量（是否有深度见解）: 高/中/低
- 是否解答他人问题: ___次
- 是否引发讨论: 是/否
- 回复被感谢的可能性: 高/中/低（从上下文推断）

**分析要点**:
- 内容质量
- 专业权威性
- 对他人的帮助程度
- 在社区的认可度

**评分**: ___/10 分

---

### 9. 学习成长力 📈 (1-10分)

**评分标准**:
- **1-3分**: 学习意愿低，少讨论新知识/新技术
- **4-6分**: 学习意愿一般，偶尔接触新事物
- **7-8分**: 学习意愿强，经常研究新技术/新领域
- **9-10分**: 持续学习，快速接受新事物，有成长型思维

**量化指标**:
- 提问/求教次数: ___次
- 学习/研究相关讨论: ___次
- 对新技术/新产品的关注度: 高/中/低

**分析要点**:
- 学习态度
- 对新事物的接受度
- 是否主动求知
- 成长型/固定型思维

**评分**: ___/10 分

---

### 10. 真实度/可信度 🎭 (1-10分)

**评分标准**:
- **1-3分**: 疑似水军/发帖员，频繁引战，内容前后矛盾，编故事明显
- **4-6分**: 部分内容夸张或不实，偶尔引战，但大部分内容真实
- **7-8分**: 内容基本真实可信，偶有夸张但无恶意
- **9-10分**: 高度真实，言行一致，内容经得起推敲，真诚度高

**量化指标**:
- 内容前后一致性: 高/中/低
- 引战/攻击性言论次数: ___次
- 疑似营销/广告内容: ___次
- 逻辑矛盾或编故事迹象: ___处

**重点识别特征**:

**🚩 发帖员/水军特征**:
- 短期内大量发帖/回复（不正常的活跃度）
- 重复发布相似内容或套路化回复
- 频繁推荐特定产品/服务/链接
- 账号注册时间短但活跃度极高
- 回复内容空洞，缺乏个人观点

**🚩 故意引战特征**:
- 频繁使用攻击性、煽动性语言
- 刻意挑起争议话题
- 对不同观点采取极端对立态度
- 喜欢"抬杠"，缺乏建设性讨论
- 制造焦虑或贩卖恐慌

**🚩 编故事/造假特征**:
- 前后描述自相矛盾（职业/收入/经历不一致）
- 过度夸张的个人经历
- 时间线混乱（如"去年"的事在不同回复中日期不符）
- 细节模糊或经不起推敲
- 频繁更换人设或立场

**✅ 真实可信特征**:
- 长期稳定的发言风格
- 内容具体详细，有个人特色
- 前后观点一致，言行相符
- 分享真实经验教训（包括失败）
- 对话真诚，愿意承认不足

**分析要点**:
- 内容真实性（是否有明显编造迹象）
- 动机纯粹性（是否有营销/引导目的）
- 立场一致性（观点是否前后矛盾）
- 言行一致性（说的和做的是否匹配）
- 互动真诚度（回复是否真心还是套路）

**评分**: ___/10 分

---

### 11. 生活地域判断 🏠

**不评分，仅推断**

**分析要点**:
- **居住城市**: _____（根据讨论的地域板块、提及的地点）
- **证据强度**: 强/中/弱
- **可能的活动范围**: _____
- **是否有地域相关特征**: _____

---

## 📋 综合评价

### 综合画像卡片

| 维度 | 评分 | 等级 | 关键特征 |
|------|------|------|---------|
| 技术能力 | __/10 | 专家/从业者/爱好者/无 | _____ |
| 消费能力 | __/10 | 高/中高/中/中低/低 | _____ |
| 专业深度 | __/10 | 专家/资深/中级/初级 | _____ |
| 社交活跃度 | __/10 | 非常活跃/活跃/一般/不活跃 | _____ |
| 兴趣广度 | __/10 | 非常广泛/广泛/适中/单一 | _____ |
| 情绪稳定性 | __/10 | 非常稳定/稳定/一般/不稳定 | _____ |
| 生活品质 | __/10 | 优质/良好/一般/较差 | _____ |
| 影响力 | __/10 | KOL/活跃/普通/潜水 | _____ |
| 学习成长力 | __/10 | 强/较强/一般/弱 | _____ |
| 真实度/可信度 | __/10 | 高度真实/基本可信/存疑/疑似造假 | _____ |

**综合评分**: ___/100 分

---

### 用户画像总结 (200-300字)

[用一段话描述该用户的整体特征，包括：
- 基本信息（年龄段、地域、职业推断）
- 核心特征（最突出的2-3个特点）
- 兴趣爱好概况
- 性格特征
- 生活状态
- 最具代表性的标签]

---

### 特殊标签 🏷️

请根据分析给出3-5个最具代表性的标签：

\`#标签1\` \`#标签2\` \`#标签3\` \`#标签4\` \`#标签5\`

---

### 核心洞察 💡

**优势特征**（最突出的3个方面）:
1. _____
2. _____
3. _____

**潜在需求**（可能感兴趣的3个方向）:
1. _____
2. _____
3. _____

**性格特质**（MBTI参考）:
- 可能的性格类型: _____
- 主要性格特征: _____

---

## 📋 输出格式要求

1. **严格按照评分标准打分**，不得凭感觉评分
2. **必须列出量化指标的具体数值**
3. **每个评分必须有具体的证据支撑**（引用回复内容）
4. **填写综合评价表格**
5. **生成200-300字的用户画像总结**
6. **给出3-5个标签**
7. **不用重新输出评分标准，只给出要求的结果**

---

## ⚡ 开始分析

请开始你的专业量化分析，注意：

✅ **量化优先**: 先统计量化指标，再基于数据打分  
✅ **证据支撑**: 每个结论都要引用具体回复  
✅ **客观准确**: 基于实际数据，不要过度臆测  
✅ **标准一致**: 严格按照评分标准，不得凭主观感觉  

---

*本文档由 NGA 用户回复提取器自动生成*  
*提取时间: ${new Date().toLocaleString('zh-CN')}*  
*数据量: ${totalReplies} 条回复*  
*评分体系: 10维度量化评估 (总分100分)*  
*版权: su3sl3h06*
`;

        // 创建下载
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const filename = `NGA_${username}_analysis_prompt_${new Date().getTime()}.md`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`成功导出分析提示词！\n文件名: ${filename}\n回复数: ${totalReplies} 条`);
    }

    // 复制Markdown内容到剪贴板
    async function copyMarkdownToClipboard() {
        if (allReplies.length === 0) {
            showToast('没有数据可以复制！');
            return;
        }

        try {
            // 获取用户名
            const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1] || 'unknown_user';
            
            // 统计信息
            const totalReplies = allReplies.length;
            const boards = [...new Set(allReplies.map(r => r.板块))];
            const boardStats = {};
            allReplies.forEach(reply => {
                const board = reply.板块 || '未知';
                boardStats[board] = (boardStats[board] || 0) + 1;
            });
            const sortedBoards = Object.entries(boardStats).sort((a, b) => b[1] - a[1]);

            // 构建Markdown内容（与exportToMarkdown相同）
            let markdown = `# NGA 用户画像分析任务

## 📋 任务说明

你是一位专业的用户行为分析师。现在需要你根据下方提供的NGA用户回复数据，深入分析该用户的完整人物画像。

---

## 👤 分析对象

- **用户名**: ${username}
- **数据来源**: NGA (一个面向创意工作者的中文社区)
- **回复总数**: ${totalReplies} 条
- **活跃板块数**: ${boards.length} 个
- **数据提取时间**: ${new Date().toLocaleString('zh-CN')}

---

## 📊 基础数据概览

### 板块活跃度统计（Top 10）

| 排名 | 板块名称 | 回复次数 | 占比 |
|------|---------|---------|------|
`;

            // 添加板块统计
            sortedBoards.slice(0, 10).forEach((item, index) => {
                const [board, count] = item;
                const percentage = ((count / totalReplies) * 100).toFixed(1);
                markdown += `| ${index + 1} | ${board} | ${count} | ${percentage}% |\n`;
            });

            markdown += `\n---

## 🧵 用户创建的主题（采样）

从用户创建的主题中抽取正文内容（最多展示30篇，用于辅助AI判断立场与真实度）：

${(allTopics && allTopics.length ? allTopics : []).map((t, idx) => `### 主题 #${idx + 1}\n\n**节点**: ${t.节点 || '-'}  \n**标题**: ${t.标题 || '-'}\n\n**正文节选**:\n> ${(t.正文 || '').split('\n').slice(0, 12).join('\n> ')}\n\n---\n`).join('')}

## 💬 完整回复记录（最多500条）

以下为该用户的所有回复内容，按时间顺序排列（从新到旧）：

`;

            // 添加所有回复
            allReplies.forEach((reply, index) => {
                markdown += `### 回复 #${index + 1}

时间: ${reply.时间}  
板块: ${reply.板块}  
主题: ${reply.主题标题}  
主题作者: ${reply.主题作者}  
回复内容:
> ${reply.回复内容.split('\n').join('\n> ')}

---

`;
            });

            // 添加分析要求（与exportToMarkdown相同的完整内容）
            markdown += `
---

## 🎯 分析任务要求

请基于以上所有回复数据，从以下维度深入分析该用户，并生成一份详细的**量化用户画像报告**。

**重要**: 每个维度必须按照给定的评分标准打分，不能凭主观感觉！

---

## 📊 评分标准与分析维度

### 1. 技术能力评估 💻 (1-10分)

**评分标准**:
- **1-3分**: 非技术用户，基本不涉及技术讨论
- **4-6分**: 技术爱好者，了解基础技术概念，偶尔讨论技术话题
- **7-8分**: 技术从业者，熟悉特定技术栈，经常分享技术见解
- **9-10分**: 技术专家，深入讨论底层原理，能解决复杂技术问题

**量化指标**:
- 技术相关回复占比: ____%
- 提及的技术关键词数量: ___个
- 技术深度（是否涉及原理/架构/底层）: 是/否

**分析要点**:
- 主要技术栈（编程语言、框架、工具等）
- 技术广度与深度
- 是否有专业技术背景
- 对新技术的接受程度

**评分**: ___/10 分

---

### 2. 消费能力评估 💰 (1-10分)

**评分标准**:
- **1-3分**: 消费保守，注重性价比，多讨论如何省钱
- **4-6分**: 消费适中，偶尔购买中高端产品，理性消费
- **7-8分**: 消费能力较强，经常购买中高端产品，品质优先
- **9-10分**: 消费能力很强，购买高端/奢侈品，价格不敏感

**量化指标**:
- 提及的产品价格范围: ￥___ - ￥___
- 高价值物品（>5000元）提及次数: ___次
- 投资/理财相关讨论: ___次

**分析要点**:
- 提及的具体产品及价格（如手机、电脑、旅行等）
- 消费观念（性价比/品质/奢侈）
- 是否有投资理财意识
- 经济压力感知

**评分**: ___/10 分

---

### 3. 专业深度评估 🎓 (1-10分)

**评分标准**:
- **1-3分**: 泛泛而谈，缺乏专业见解
- **4-6分**: 在某些领域有一定见解，但不够深入
- **7-8分**: 在1-2个领域有专业见解，能给出专业建议
- **9-10分**: 多领域专家，回复经常被认可，有行业影响力

**量化指标**:
- 专业术语使用频率: 高/中/低
- 深度分析回复占比: ____%
- 被@请教的次数: ___次（从回复中推断）

**分析要点**:
- 专业领域识别（职业相关）
- 知识深度与广度
- 是否经常解答他人问题
- 专业表达能力

**评分**: ___/10 分

---

### 4. 社交活跃度 👥 (1-10分)

**评分标准**:
- **1-3分**: 很少互动，回复简短，不主动交流
- **4-6分**: 适度互动，偶尔参与讨论，回复中等长度
- **7-8分**: 活跃互动，经常@他人，回复详细，乐于助人
- **9-10分**: 高度活跃，社区KOL，有固定交流圈子

**量化指标**:
- 平均回复长度: ___字
- @他人次数: ___次
- 回复情感倾向: 友善/中性/冷淡
- 活跃板块数量: ___个

**分析要点**:
- 交流主动性
- 互动频率和质量
- 是否有固定交流对象
- 社交风格（热情/礼貌/高冷）

**评分**: ___/10 分

---

### 5. 兴趣广度评估 🎮 (1-10分)

**评分标准**:
- **1-3分**: 兴趣单一，只关注1-2个领域
- **4-6分**: 兴趣适中，关注3-5个不同领域
- **7-8分**: 兴趣广泛，跨多个领域（科技/生活/娱乐等）
- **9-10分**: 兴趣极其广泛，涉猎各个领域，博学多才

**量化指标**:
- 涉及的主题类别数: ___个
- 话题分散度: 高/中/低
- 跨领域讨论占比: ____%

**分析要点**:
- 主要兴趣点列表
- 兴趣深度（入门/进阶/专家）
- 是否有特别突出的兴趣
- 兴趣是否与职业相关

**评分**: ___/10 分

---

### 6. 情绪稳定性 🧩 (1-10分)

**评分标准**:
- **1-3分**: 情绪波动大，经常抱怨/焦虑/愤怒
- **4-6分**: 情绪一般，偶尔流露负面情绪
- **7-8分**: 情绪稳定，多数回复平和理性
- **9-10分**: 情绪非常稳定，始终保持积极乐观态度

**量化指标**:
- 负面情绪词汇出现次数: ___次（如：郁闷、烦、气、无语等）
- 正面情绪词汇出现次数: ___次（如：开心、爽、赞、喜欢等）
- 中性客观回复占比: ____%

**分析要点**:
- 主要情绪倾向
- 压力/焦虑表现
- 对挫折的态度
- 生活满意度

**评分**: ___/10 分

---

### 7. 生活品质指数 🌟 (1-10分)

**评分标准**:
- **1-3分**: 生活压力大，多讨论省钱、焦虑、工作压力
- **4-6分**: 生活一般，工作生活平衡，偶尔享受生活
- **7-8分**: 生活品质较高，经常旅行/美食/娱乐
- **9-10分**: 生活品质很高，追求精致生活，时间自由

**量化指标**:
- 休闲娱乐相关回复: ___次
- 旅行/美食/爱好讨论: ___次
- 加班/压力相关吐槽: ___次

**分析要点**:
- 工作生活平衡
- 休闲娱乐方式
- 生活态度（积极/佛系/焦虑）
- 是否有生活追求

**评分**: ___/10 分

---

### 8. 影响力指数 🏆 (1-10分)

**评分标准**:
- **1-3分**: 无影响力，回复少人关注
- **4-6分**: 影响力一般，偶尔有高质量回复
- **7-8分**: 有一定影响力，回复经常被认可
- **9-10分**: 社区意见领袖，高质量输出，被广泛认可

**量化指标**:
- 回复质量（是否有深度见解）: 高/中/低
- 是否解答他人问题: ___次
- 是否引发讨论: 是/否
- 回复被感谢的可能性: 高/中/低（从上下文推断）

**分析要点**:
- 内容质量
- 专业权威性
- 对他人的帮助程度
- 在社区的认可度

**评分**: ___/10 分

---

### 9. 学习成长力 📈 (1-10分)

**评分标准**:
- **1-3分**: 学习意愿低，少讨论新知识/新技术
- **4-6分**: 学习意愿一般，偶尔接触新事物
- **7-8分**: 学习意愿强，经常研究新技术/新领域
- **9-10分**: 持续学习，快速接受新事物，有成长型思维

**量化指标**:
- 提问/求教次数: ___次
- 学习/研究相关讨论: ___次
- 对新技术/新产品的关注度: 高/中/低

**分析要点**:
- 学习态度
- 对新事物的接受度
- 是否主动求知
- 成长型/固定型思维

**评分**: ___/10 分

---

### 10. 真实度/可信度 🎭 (1-10分)

**评分标准**:
- **1-3分**: 疑似水军/发帖员，频繁引战，内容前后矛盾，编故事明显
- **4-6分**: 部分内容夸张或不实，偶尔引战，但大部分内容真实
- **7-8分**: 内容基本真实可信，偶有夸张但无恶意
- **9-10分**: 高度真实，言行一致，内容经得起推敲，真诚度高

**量化指标**:
- 内容前后一致性: 高/中/低
- 引战/攻击性言论次数: ___次
- 疑似营销/广告内容: ___次
- 逻辑矛盾或编故事迹象: ___处

**重点识别特征**:

**🚩 发帖员/水军特征**:
- 短期内大量发帖/回复（不正常的活跃度）
- 重复发布相似内容或套路化回复
- 频繁推荐特定产品/服务/链接
- 账号注册时间短但活跃度极高
- 回复内容空洞，缺乏个人观点

**🚩 故意引战特征**:
- 频繁使用攻击性、煽动性语言
- 刻意挑起争议话题
- 对不同观点采取极端对立态度
- 喜欢"抬杠"，缺乏建设性讨论
- 制造焦虑或贩卖恐慌

**🚩 编故事/造假特征**:
- 前后描述自相矛盾（职业/收入/经历不一致）
- 过度夸张的个人经历
- 时间线混乱（如"去年"的事在不同回复中日期不符）
- 细节模糊或经不起推敲
- 频繁更换人设或立场

**✅ 真实可信特征**:
- 长期稳定的发言风格
- 内容具体详细，有个人特色
- 前后观点一致，言行相符
- 分享真实经验教训（包括失败）
- 对话真诚，愿意承认不足

**分析要点**:
- 内容真实性（是否有明显编造迹象）
- 动机纯粹性（是否有营销/引导目的）
- 立场一致性（观点是否前后矛盾）
- 言行一致性（说的和做的是否匹配）
- 互动真诚度（回复是否真心还是套路）

**评分**: ___/10 分

---

### 11. 生活地域判断 🏠

**不评分，仅推断**

**分析要点**:
- **居住城市**: _____（根据讨论的地域板块、提及的地点）
- **证据强度**: 强/中/弱
- **可能的活动范围**: _____
- **是否有地域相关特征**: _____

---

## 📋 综合评价

### 综合画像卡片

| 维度 | 评分 | 等级 | 关键特征 |
|------|------|------|---------|
| 技术能力 | __/10 | 专家/从业者/爱好者/无 | _____ |
| 消费能力 | __/10 | 高/中高/中/中低/低 | _____ |
| 专业深度 | __/10 | 专家/资深/中级/初级 | _____ |
| 社交活跃度 | __/10 | 非常活跃/活跃/一般/不活跃 | _____ |
| 兴趣广度 | __/10 | 非常广泛/广泛/适中/单一 | _____ |
| 情绪稳定性 | __/10 | 非常稳定/稳定/一般/不稳定 | _____ |
| 生活品质 | __/10 | 优质/良好/一般/较差 | _____ |
| 影响力 | __/10 | KOL/活跃/普通/潜水 | _____ |
| 学习成长力 | __/10 | 强/较强/一般/弱 | _____ |
| 真实度/可信度 | __/10 | 高度真实/基本可信/存疑/疑似造假 | _____ |

**综合评分**: ___/100 分

---

### 用户画像总结 (200-300字)

[用一段话描述该用户的整体特征，包括：
- 基本信息（年龄段、地域、职业推断）
- 核心特征（最突出的2-3个特点）
- 兴趣爱好概况
- 性格特征
- 生活状态
- 最具代表性的标签]

---

### 特殊标签 🏷️

请根据分析给出3-5个最具代表性的标签：

\`#标签1\` \`#标签2\` \`#标签3\` \`#标签4\` \`#标签5\`

---

### 核心洞察 💡

**优势特征**（最突出的3个方面）:
1. _____
2. _____
3. _____

**潜在需求**（可能感兴趣的3个方向）:
1. _____
2. _____
3. _____

**性格特质**（MBTI参考）:
- 可能的性格类型: _____
- 主要性格特征: _____

---

## 📋 输出格式要求

1. **严格按照评分标准打分**，不得凭感觉评分
2. **必须列出量化指标的具体数值**
3. **每个评分必须有具体的证据支撑**（引用回复内容）
4. **填写综合评价表格**
5. **生成200-300字的用户画像总结**
6. **给出3-5个标签**
7. **不用重新输出评分标准，只给出要求的结果**

---

## ⚡ 开始分析

请开始你的专业量化分析，注意：

✅ **量化优先**: 先统计量化指标，再基于数据打分  
✅ **证据支撑**: 每个结论都要引用具体回复  
✅ **客观准确**: 基于实际数据，不要过度臆测  
✅ **标准一致**: 严格按照评分标准，不得凭主观感觉  

---

*本文档由 NGA 用户回复提取器自动生成*  
*提取时间: ${new Date().toLocaleString('zh-CN')}*  
*数据量: ${totalReplies} 条回复*  
*评分体系: 10维度量化评估 (总分100分)*  
*版权: su3sl3h06*
`;

            // 复制到剪贴板
            await navigator.clipboard.writeText(markdown);
            
            // 成功提示
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 40px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                z-index: 10001;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                animation: fadeInOut 2s ease-in-out;
            `;
            toast.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                <div>复制成功！</div>
                <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">
                    ${totalReplies} 条回复已复制到剪贴板
                </div>
                <div style="font-size: 13px; margin-top: 8px; opacity: 0.8;">
                    现在可以粘贴到 ChatGPT/Claude 等AI工具
                </div>
            `;
            
            // 添加动画样式
            if (!document.getElementById('toast-animation-style')) {
                const style = document.createElement('style');
                style.id = 'toast-animation-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                        15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            // 2秒后自动移除提示
            setTimeout(() => {
                toast.remove();
            }, 2000);

        } catch (error) {
            console.error('复制失败:', error);
            showToast('复制失败！\n可能原因：\n- 浏览器不支持剪贴板API\n- 没有权限访问剪贴板\n\n建议使用"导出 MD 文件"功能');
        }
    }

    // 创建主页快捷按钮
    function createHomepageButton() {
        const button = document.createElement('div');
        button.id = 'reply-extractor-homepage-btn';
        button.innerHTML = `
            <div style="
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 160px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                cursor: pointer;
                z-index: 10000;
                font-family: Arial, sans-serif;
                text-align: center;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.5)';" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';">
                <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">提取用户回复</div>
                <div style="font-size: 11px; opacity: 0.9;">点击进入回复页</div>
            </div>
        `;
        
        button.addEventListener('click', function() {
            // 获取用户名
            const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1];
            if (username) {
                // 跳转到回复页
                window.location.href = `/member/${username}/replies`;
            }
        });
        
        document.body.appendChild(button);
    }

    // 初始化
    function init() {
        // 检查是否在用户页面
        if (window.location.pathname.includes('/member/')) {
            const username = window.location.pathname.match(/\/member\/([^\/]+)/)?.[1];
            
            if (!username) return;
            
            // 判断是否在回复页
            if (window.location.pathname.includes('/replies')) {
                // 在回复页，显示完整控制面板
                createControlPanel();
                
                // 显示当前页面信息
                const pageInfo = getPageInfo();
                updateUI(pageInfo.currentPage, pageInfo.totalPages, 0, '等待中', 0);
            } else {
                // 在主页，显示快捷按钮
                createHomepageButton();
            }
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

