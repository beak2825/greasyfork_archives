// ==UserScript==
// @name         DeepSeek Chat Navigator
// @namespace    https://github.com/widechaos/deepseek-chat-navigator
// @version      1.4.0
// @description  🚀 智能侧边栏导航，精确定位DeepSeek对话提问和回答！支持开头/结尾双模式定位，长对话浏览神器！
// @author       widechaos
// @match        https://chat.deepseek.com/*
// @match        https://www.deepseek.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @supportURL   https://github.com/widechaos/deepseek-chat-navigator/issues
// @downloadURL https://update.greasyfork.org/scripts/560039/DeepSeek%20Chat%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/560039/DeepSeek%20Chat%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .ds-navigator {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            max-height: 70vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.98);
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            padding: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .ds-navigator.collapsed {
            width: 50px;
            height: 50px;
            padding: 0;
            overflow: hidden;
        }

        .ds-navigator.collapsed .ds-nav-content {
            display: none;
        }

        .ds-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f3f4f6;
            position: sticky;
            top: 0;
            background: rgba(255, 255, 255, 0.98);
            z-index: 1;
            backdrop-filter: blur(5px);
        }

        .ds-nav-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }

        .ds-nav-toggle {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .ds-nav-toggle:hover {
            background: #f3f4f6;
            color: #374151;
        }

        .ds-nav-content {
            max-height: calc(70vh - 60px);
            overflow-y: auto;
        }

        .ds-nav-item {
            padding: 12px;
            margin-bottom: 8px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 8px;
            cursor: pointer;
        }

        .ds-nav-item:hover {
            background: #eff6ff;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .ds-nav-item.user {
            border-left-color: #10b981;
        }

        .ds-nav-item.assistant {
            border-left-color: #8b5cf6;
        }

        .ds-nav-item-header {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ds-nav-icon {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .ds-nav-icon.user {
            background: #10b981;
        }

        .ds-nav-icon.assistant {
            background: #8b5cf6;
        }

        .ds-nav-item-info {
            flex: 1;
            min-width: 0;
        }

        .ds-nav-type {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ds-nav-counter {
            background: #3b82f6;
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 20px;
            text-align: center;
        }

        .ds-nav-item.user .ds-nav-counter {
            background: #10b981;
        }

        .ds-nav-item.assistant .ds-nav-counter {
            background: #8b5cf6;
        }

        .ds-nav-text {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            word-break: break-word;
            margin-bottom: 4px;
        }

        .ds-nav-code-indicator {
            display: inline-block;
            background: #f3f4f6;
            color: #6b7280;
            font-size: 11px;
            padding: 1px 4px;
            border-radius: 3px;
            margin-right: 4px;
            border: 1px solid #e5e7eb;
        }

        .ds-nav-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #9ca3af;
        }

        .ds-nav-buttons {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .ds-nav-item:hover .ds-nav-buttons {
            opacity: 1;
        }

        .ds-nav-button {
            flex: 1;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .ds-nav-button-start {
            background: #3b82f6;
            color: white;
        }

        .ds-nav-button-start:hover {
            background: #2563eb;
        }

        .ds-nav-button-end {
            background: #8b5cf6;
            color: white;
        }

        .ds-nav-button-end:hover {
            background: #7c3aed;
        }

        .ds-nav-mini-toggle {
            position: fixed;
            right: 20px;
            top: 80px;
            width: 40px;
            height: 40px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }

        .ds-nav-mini-toggle:hover {
            background: #2563eb;
            transform: scale(1.05);
        }

        .ds-nav-active {
            background: #dbeafe !important;
            border-left-width: 6px !important;
        }

        .ds-nav-highlight {
            animation: highlight-pulse 2s ease;
        }

        .ds-nav-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #e5e7eb;
            color: #6b7280;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 4px;
        }

        .ds-nav-pair-group {
            margin-bottom: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .ds-nav-pair-header {
            background: #f3f4f6;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
        }

        .ds-nav-pair-number {
            font-size: 12px;
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ds-nav-pair-count {
            background: #3b82f6;
            color: white;
            font-size: 10px;
            padding: 1px 6px;
            border-radius: 10px;
        }

        .ds-nav-pair-content {
            background: white;
        }

        .ds-nav-pair-item {
            border-left: none;
            border-radius: 0;
            margin-bottom: 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .ds-nav-pair-item:last-child {
            border-bottom: none;
        }

        .ds-nav-keywords {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 6px;
        }

        .ds-nav-keyword {
            display: inline-block;
            padding: 2px 6px;
            background: #e0f2fe;
            color: #0369a1;
            font-size: 11px;
            border-radius: 12px;
            font-weight: 500;
        }

        .ds-nav-keyword.category {
            background: #dcfce7;
            color: #166534;
        }

        .ds-nav-keyword.code {
            background: #f3e8ff;
            color: #7c3aed;
        }

        .ds-nav-keyword.task {
            background: #fef3c7;
            color: #92400e;
        }

        .ds-nav-summary {
            font-size: 12px;
            color: #4b5563;
            line-height: 1.4;
            margin-top: 4px;
            font-style: italic;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .ds-nav-loader {
            padding: 10px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
        }

        .ds-nav-load-more {
            display: block;
            width: 100%;
            padding: 8px;
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            color: #6b7280;
            font-size: 12px;
            cursor: pointer;
            text-align: center;
            margin-top: 10px;
            transition: all 0.2s ease;
        }

        .ds-nav-load-more:hover {
            background: #e5e7eb;
            color: #374151;
        }

        @keyframes highlight-pulse {
            0%, 100% {
                background: #dbeafe;
            }
            50% {
                background: #eff6ff;
            }
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
            .ds-navigator:not(.collapsed) {
                right: 10px;
                width: 320px;
            }
        }

        @media (max-width: 768px) {
            .ds-navigator:not(.collapsed) {
                width: 280px;
                max-height: 60vh;
            }

            .ds-nav-mini-toggle {
                display: flex;
            }

            .ds-navigator.collapsed {
                display: none;
            }

            .ds-nav-buttons {
                opacity: 1;
            }
        }

        /* 滚动条样式 */
        .ds-nav-content::-webkit-scrollbar {
            width: 6px;
        }

        .ds-nav-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .ds-nav-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .ds-nav-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        .ds-navigator-empty {
            text-align: center;
            padding: 30px 15px;
            color: #9ca3af;
            font-size: 14px;
        }

        .ds-nav-progress {
            height: 3px;
            background: #3b82f6;
            position: absolute;
            bottom: 0;
            left: 0;
            border-radius: 0 0 12px 12px;
            transition: width 0.3s ease;
        }
    `);

    class DeepSeekNavigator {
        constructor() {
            this.navigator = null;
            this.miniToggle = null;
            this.isCollapsed = false;
            this.messagePairs = [];
            this.observer = null;
            this.lastScrollTime = 0;
            this.scrollCooldown = 300;
            this.isScanning = false;
            this.batchSize = 5;
            this.renderedCount = 0;
            this.scanProgress = 0;

            // 中文停用词表
            this.stopWords = new Set([
                '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你',
                '会', '着', '没有', '看', '好', '自己', '这', '那', '但', '什么', '我们', '吗', '可以', '这', '那', '啊', '哦', '嗯',
                'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
                'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could'
            ]);

            // 编程语言关键词
            this.codeKeywords = new Set([
                'javascript', 'js', 'python', 'py', 'java', 'c++', 'cpp', 'c#', 'csharp', 'php', 'ruby', 'go', 'golang',
                'rust', 'swift', 'kotlin', 'typescript', 'ts', 'html', 'css', 'sql', 'bash', 'shell', 'json', 'xml',
                'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'spring', 'laravel'
            ]);

            // 任务类型关键词
            this.taskKeywords = new Set([
                '修复', '修复bug', 'bug', '错误', '异常', '报错', '问题', '解决', '实现', '编写', '开发', '创建', '添加',
                '修改', '优化', '改进', '重构', '调试', '测试', '部署', '安装', '配置', '设置', '更新', '升级',
                'fix', 'bug', 'error', 'issue', 'problem', 'solve', 'implement', 'write', 'develop', 'create', 'add',
                'modify', 'optimize', 'improve', 'refactor', 'debug', 'test', 'deploy', 'install', 'configure', 'setup', 'update', 'upgrade'
            ]);

            this.init();
        }

        init() {
            console.log('DeepSeek Navigator 初始化...');

            // 延迟创建界面
            setTimeout(() => {
                this.createNavigator();
                this.addMiniToggle();
                this.bindEvents();

                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                        this.setupObserver();
                        this.scanMessages();
                    });
                } else {
                    setTimeout(() => {
                        this.setupObserver();
                        this.scanMessages();
                    }, 500);
                }
            }, 300);
        }

        createNavigator() {
            this.navigator = document.createElement('div');
            this.navigator.className = 'ds-navigator';

            this.navigator.innerHTML = `
                <div class="ds-nav-header">
                    <h3 class="ds-nav-title">对话导航</h3>
                    <button class="ds-nav-toggle" title="折叠/展开">📋</button>
                </div>
                <div class="ds-nav-content">
                    <div class="ds-navigator-empty">
                        正在加载对话...
                    </div>
                </div>
                <div class="ds-nav-progress" style="width: 0%"></div>
            `;

            document.body.appendChild(this.navigator);
            console.log('侧边栏创建完成');
        }

        addMiniToggle() {
            this.miniToggle = document.createElement('button');
            this.miniToggle.className = 'ds-nav-mini-toggle';
            this.miniToggle.innerHTML = '📋';
            this.miniToggle.title = '显示导航';

            document.body.appendChild(this.miniToggle);

            this.miniToggle.addEventListener('click', () => {
                this.isCollapsed = false;
                this.navigator.classList.remove('collapsed');
                this.miniToggle.style.display = 'none';
            });
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.navigator.classList.toggle('collapsed');

            if (window.innerWidth <= 768) {
                if (this.isCollapsed) {
                    this.miniToggle.style.display = 'flex';
                } else {
                    this.miniToggle.style.display = 'none';
                }
            }
        }

        scanMessages() {
            if (this.isScanning) return;

            this.isScanning = true;
            console.log('开始扫描消息...');

            const userMessages = document.querySelectorAll('div._9663006');
            const assistantMessages = document.querySelectorAll('div._4f9bf79');

            console.log(`找到用户消息容器: ${userMessages.length}`);
            console.log(`找到AI消息容器: ${assistantMessages.length}`);

            this.processMessagesInBatches(userMessages, assistantMessages);
        }

        async processMessagesInBatches(userContainers, assistantContainers) {
            const allContainers = [];

            // 收集用户消息
            userContainers.forEach((container, index) => {
                const textElement = container.querySelector('.fbb737a4');
                if (textElement) {
                    const text = this.cleanHtmlAndExtractText(textElement);
                    if (text && text.length > 0) {
                        allContainers.push({
                            container,
                            text,
                            type: 'user',
                            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                            index
                        });
                    }
                }
            });

            // 收集AI回复消息
            assistantContainers.forEach((container, index) => {
                const textElements = container.querySelectorAll('.ds-markdown');
                let text = '';

                textElements.forEach(el => {
                    const elText = this.cleanHtmlAndExtractText(el);
                    if (elText && elText.length > 0) {
                        text += (text ? ' ' : '') + elText;
                    }
                });

                if (!text || text.trim().length === 0) {
                    const altElements = container.querySelectorAll('p, span, div');
                    altElements.forEach(el => {
                        const elText = this.cleanHtmlAndExtractText(el);
                        if (elText && elText.length > 0 && !el.closest('.ds-think-content')) {
                            text += (text ? ' ' : '') + elText;
                        }
                    });
                }

                if (text && text.trim().length > 0) {
                    let thinkTime = '';
                    const thinkElement = container.querySelector('._5255ff8');
                    if (thinkElement) {
                        thinkTime = thinkElement.textContent.trim();
                    }

                    allContainers.push({
                        container,
                        text,
                        type: 'assistant',
                        thinkTime,
                        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                        index
                    });
                }
            });

            // 按DOM位置排序
            allContainers.sort((a, b) => {
                const rectA = a.container.getBoundingClientRect();
                const rectB = b.container.getBoundingClientRect();
                return rectA.top - rectB.top;
            });

            // 分组消息为问答对
            this.messagePairs = this.groupMessagesIntoPairs(allContainers);

            console.log(`处理完成，总共 ${this.messagePairs.length} 个问答对`);

            // 为每个对话对提取关键词和摘要
            this.processKeywordsAndSummaries();

            this.updateProgress(30);

            setTimeout(() => {
                this.renderedCount = 0;
                this.renderInitialBatch();
                this.updateProgress(100);

                this.setupLazyLoad();
                this.isScanning = false;
            }, 100);
        }

        // 提取关键词和摘要
        processKeywordsAndSummaries() {
            this.messagePairs.forEach(pair => {
                // 合并用户问题和所有AI回答的文本
                const combinedText = [
                    pair.userMessage.text,
                    ...pair.assistantMessages.map(msg => msg.text)
                ].join(' ');

                // 提取关键词
                pair.keywords = this.extractKeywords(combinedText);

                // 提取摘要（使用AI回答的第一句话）
                if (pair.assistantMessages.length > 0 && pair.assistantMessages[0].text) {
                    pair.summary = this.extractSummary(pair.assistantMessages[0].text);
                }

                // 提取任务类型
                pair.taskType = this.extractTaskType(pair.userMessage.text);

                // 提取代码语言
                pair.codeLanguage = this.extractCodeLanguage(pair.userMessage.text);
            });
        }

        // 提取关键词（使用TF-IDF简化版）
        extractKeywords(text, maxKeywords = 5) {
            if (!text || text.length < 10) return [];

            // 分词（简化版，按空格和标点分割）
            const words = text.toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ') // 移除标点，保留中文和英文单词
                .split(/\s+/)
                .filter(word => word.length > 1); // 过滤掉单字符

            // 统计词频
            const wordFreq = {};
            words.forEach(word => {
                if (!this.stopWords.has(word) && word.length > 1) {
                    wordFreq[word] = (wordFreq[word] || 0) + 1;
                }
            });

            // 按词频排序
            const sortedWords = Object.entries(wordFreq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, maxKeywords * 2); // 多取一些，后面会过滤

            // 过滤掉太常见的词
            const keywords = sortedWords
                .filter(([word, freq]) => {
                    // 过滤停用词
                    if (this.stopWords.has(word)) return false;

                    // 只保留词频大于等于2的关键词，但如果是代码关键词或任务关键词则保留
                    if (freq >= 2) return true;
                    if (this.codeKeywords.has(word)) return true;
                    if (this.taskKeywords.has(word)) return true;

                    return false;
                })
                .slice(0, maxKeywords)
                .map(([word]) => word);

            return keywords;
        }

        // 提取摘要（使用AI回答的第一句话）
        extractSummary(text) {
            if (!text) return '';

            // 找到第一个句子的结束位置
            const sentenceEnd = text.search(/[。.!?？！\n]/);
            let firstSentence = text;

            if (sentenceEnd > 20) { // 至少20个字符才截取
                firstSentence = text.substring(0, sentenceEnd + 1);
            }

            // 限制长度
            if (firstSentence.length > 80) {
                firstSentence = firstSentence.substring(0, 77) + '...';
            }

            return firstSentence.trim();
        }

        // 提取任务类型
        extractTaskType(text) {
            const lowerText = text.toLowerCase();
            for (const taskWord of this.taskKeywords) {
                if (lowerText.includes(taskWord.toLowerCase())) {
                    return taskWord;
                }
            }
            return '';
        }

        // 提取代码语言
        extractCodeLanguage(text) {
            const lowerText = text.toLowerCase();
            for (const lang of this.codeKeywords) {
                if (lowerText.includes(lang.toLowerCase())) {
                    return lang;
                }
            }

            // 检查常见的文件扩展名
            const fileExtensions = {
                '.js': 'javascript',
                '.jsx': 'javascript',
                '.ts': 'typescript',
                '.tsx': 'typescript',
                '.py': 'python',
                '.java': 'java',
                '.cpp': 'c++',
                '.c': 'c',
                '.cs': 'c#',
                '.php': 'php',
                '.go': 'go',
                '.rs': 'rust',
                '.swift': 'swift',
                '.kt': 'kotlin',
                '.html': 'html',
                '.css': 'css',
                '.sql': 'sql',
                '.json': 'json',
                '.xml': 'xml'
            };

            for (const [ext, lang] of Object.entries(fileExtensions)) {
                if (lowerText.includes(ext)) {
                    return lang;
                }
            }

            return '';
        }

        // 渲染初始批次
        renderInitialBatch() {
            const content = this.navigator.querySelector('.ds-nav-content');
            const initialCount = Math.min(this.batchSize, this.messagePairs.length);

            // 更新标题
            const title = this.navigator.querySelector('.ds-nav-title');
            title.textContent = `对话导航 (${this.messagePairs.length}个问答)`;

            if (this.messagePairs.length === 0) {
                content.innerHTML = '<div class="ds-navigator-empty">暂无对话内容</div>';
                return;
            }

            // 清空内容
            content.innerHTML = '';

            // 渲染第一批
            for (let i = 0; i < initialCount; i++) {
                this.renderPair(i);
            }

            this.renderedCount = initialCount;

            // 如果还有更多，显示加载更多按钮
            if (this.messagePairs.length > initialCount) {
                this.addLoadMoreButton();
            }
        }

        // 渲染单个对话对
        renderPair(index) {
            if (index >= this.messagePairs.length) return;

            const pair = this.messagePairs[index];
            const content = this.navigator.querySelector('.ds-nav-content');

            const pairItems = [];

            // 用户消息
            pairItems.push(`
                <div class="ds-nav-item user ds-nav-pair-item" data-id="${pair.userMessage.id}">
                    <div class="ds-nav-item-header">
                        <div class="ds-nav-icon user"></div>
                        <div class="ds-nav-item-info">
                            <div class="ds-nav-type">
                                👤 提问
                            </div>
                            <div class="ds-nav-text" title="${this.escapeHtml(pair.userMessage.text)}">
                                ${this.escapeHtml(pair.userMessage.text)}
                            </div>
                            <div class="ds-nav-meta">
                                <span>${pair.userMessage.timestamp || ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ds-nav-buttons">
                        <button class="ds-nav-button ds-nav-button-start" data-id="${pair.userMessage.id}" data-position="start">
                            <span>▲</span> 定位到开头
                        </button>
                        <button class="ds-nav-button ds-nav-button-end" data-id="${pair.userMessage.id}" data-position="end">
                            <span>▼</span> 定位到结尾
                        </button>
                    </div>
                </div>
            `);

            // AI回复消息
            pair.assistantMessages.forEach((assistantMsg, idx) => {
                pairItems.push(`
                    <div class="ds-nav-item assistant ds-nav-pair-item" data-id="${assistantMsg.id}">
                        <div class="ds-nav-item-header">
                            <div class="ds-nav-icon assistant"></div>
                            <div class="ds-nav-item-info">
                                <div class="ds-nav-type">
                                    🤖 回答
                                    ${assistantMsg.thinkTime ? `<span class="ds-nav-badge">${this.escapeHtml(assistantMsg.thinkTime)}</span>` : ''}
                                </div>
                                <div class="ds-nav-text" title="${this.escapeHtml(assistantMsg.text)}">
                                    ${this.escapeHtml(assistantMsg.text)}
                                </div>
                                <div class="ds-nav-meta">
                                    <span>${assistantMsg.timestamp || ''}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ds-nav-buttons">
                            <button class="ds-nav-button ds-nav-button-start" data-id="${assistantMsg.id}" data-position="start">
                                <span>▲</span> 定位到开头
                            </button>
                            <button class="ds-nav-button ds-nav-button-end" data-id="${assistantMsg.id}" data-position="end">
                                <span>▼</span> 定位到结尾
                            </button>
                        </div>
                    </div>
                `);
            });

            // 构建关键词标签
            let keywordTags = '';
            if (pair.keywords && pair.keywords.length > 0) {
                // 首先添加任务类型标签（如果有）
                if (pair.taskType) {
                    keywordTags += `<span class="ds-nav-keyword task">${this.escapeHtml(pair.taskType)}</span>`;
                }

                // 然后添加代码语言标签（如果有）
                if (pair.codeLanguage) {
                    keywordTags += `<span class="ds-nav-keyword code">${this.escapeHtml(pair.codeLanguage)}</span>`;
                }

                // 添加其他关键词
                pair.keywords.forEach(keyword => {
                    // 跳过已经显示的任务类型和代码语言
                    if (keyword !== pair.taskType && keyword !== pair.codeLanguage) {
                        // 给一些特定的关键词添加分类样式
                        let className = '';
                        if (this.codeKeywords.has(keyword.toLowerCase())) {
                            className = 'code';
                        } else if (this.taskKeywords.has(keyword.toLowerCase())) {
                            className = 'task';
                        }

                        keywordTags += `<span class="ds-nav-keyword ${className}">${this.escapeHtml(keyword)}</span>`;
                    }
                });
            }

            // 构建摘要
            let summaryHtml = '';
            if (pair.summary && pair.summary.length > 0) {
                summaryHtml = `<div class="ds-nav-summary" title="${this.escapeHtml(pair.summary)}">${this.escapeHtml(pair.summary)}</div>`;
            }

            const pairHtml = `
                <div class="ds-nav-pair-group" data-pair-id="${pair.pairId}" data-pair-index="${index}">
                    <div class="ds-nav-pair-header">
                        <div class="ds-nav-pair-number">
                            对话 #${pair.number}
                            <span class="ds-nav-pair-count">${1 + pair.assistantMessages.length}条</span>
                        </div>
                    </div>
                    ${keywordTags ? `<div class="ds-nav-keywords">${keywordTags}</div>` : ''}
                    ${summaryHtml}
                    <div class="ds-nav-pair-content">
                        ${pairItems.join('')}
                    </div>
                </div>
            `;

            content.insertAdjacentHTML('beforeend', pairHtml);
        }

        // 添加"加载更多"按钮
        addLoadMoreButton() {
            const content = this.navigator.querySelector('.ds-nav-content');
            const loadMoreButton = document.createElement('button');
            loadMoreButton.className = 'ds-nav-load-more';
            loadMoreButton.textContent = `加载更多 (${this.messagePairs.length - this.renderedCount}个未显示)`;
            loadMoreButton.onclick = () => this.loadMorePairs();

            // 移除可能存在的旧按钮
            const oldButton = content.querySelector('.ds-nav-load-more');
            if (oldButton) {
                oldButton.remove();
            }

            content.appendChild(loadMoreButton);
        }

        // 加载更多对话对
        loadMorePairs() {
            const remainingPairs = this.messagePairs.length - this.renderedCount;
            const batchCount = Math.min(this.batchSize, remainingPairs);

            for (let i = 0; i < batchCount; i++) {
                this.renderPair(this.renderedCount + i);
            }

            this.renderedCount += batchCount;

            // 更新或移除加载更多按钮
            if (this.renderedCount < this.messagePairs.length) {
                this.addLoadMoreButton();
            } else {
                const loadMoreButton = this.navigator.querySelector('.ds-nav-load-more');
                if (loadMoreButton) {
                    loadMoreButton.remove();
                }
            }
        }

        // 设置懒加载
        setupLazyLoad() {
            const content = this.navigator.querySelector('.ds-nav-content');
            if (!content) return;

            content.addEventListener('scroll', () => {
                const scrollPosition = content.scrollTop + content.clientHeight;
                const scrollHeight = content.scrollHeight;

                if (scrollHeight - scrollPosition < 200 && this.renderedCount < this.messagePairs.length) {
                    this.loadMorePairs();
                }
            });
        }

        // 更新进度条
        updateProgress(percent) {
            const progressBar = this.navigator.querySelector('.ds-nav-progress');
            if (progressBar) {
                progressBar.style.width = `${percent}%`;

                if (percent >= 100) {
                    setTimeout(() => {
                        progressBar.style.opacity = '0';
                    }, 500);
                }
            }
        }

        // 将消息分组为问答对
        groupMessagesIntoPairs(allMessages) {
            const messagePairs = [];
            let currentPair = null;

            allMessages.forEach((msg, index) => {
                const messageId = `ds-${msg.type}-${Date.now()}-${index}`;
                msg.container.id = messageId;

                const messageObj = {
                    id: messageId,
                    element: msg.container,
                    text: msg.text,
                    type: msg.type,
                    thinkTime: msg.thinkTime,
                    timestamp: msg.timestamp
                };

                if (msg.type === 'user') {
                    if (currentPair) {
                        messagePairs.push(currentPair);
                    }
                    currentPair = {
                        pairId: `pair-${messagePairs.length + 1}`,
                        number: messagePairs.length + 1,
                        userMessage: messageObj,
                        assistantMessages: []
                    };
                } else if (msg.type === 'assistant' && currentPair) {
                    currentPair.assistantMessages.push(messageObj);
                }
            });

            if (currentPair) {
                messagePairs.push(currentPair);
            }

            return messagePairs;
        }

        // 清理HTML标签并提取文本
        cleanHtmlAndExtractText(element) {
            if (!element) return '';

            const clonedElement = element.cloneNode(true);

            const tagsToRemove = ['script', 'style', 'svg', 'math', 'iframe', 'object', 'embed'];
            tagsToRemove.forEach(tag => {
                clonedElement.querySelectorAll(tag).forEach(el => el.remove());
            });

            const codeBlocks = clonedElement.querySelectorAll('pre, code');
            codeBlocks.forEach(code => {
                const codeText = code.textContent || '';
                const indicator = document.createElement('span');
                indicator.className = 'ds-nav-code-indicator';
                indicator.textContent = '[代码]';
                indicator.title = codeText.substring(0, 100) + (codeText.length > 100 ? '...' : '');
                code.parentNode.replaceChild(indicator, code);
            });

            const links = clonedElement.querySelectorAll('a');
            links.forEach(link => {
                const linkText = link.textContent || '';
                if (linkText.trim()) {
                    const textNode = document.createTextNode(linkText);
                    link.parentNode.replaceChild(textNode, link);
                } else {
                    link.remove();
                }
            });

            const images = clonedElement.querySelectorAll('img');
            images.forEach(img => {
                const altText = img.alt || '图片';
                const textNode = document.createTextNode(`[图片:${altText}]`);
                img.parentNode.replaceChild(textNode, img);
            });

            let text = clonedElement.textContent || clonedElement.innerText || '';
            text = text
                .replace(/\s+/g, ' ')
                .replace(/\[代码\]/g, ' [代码] ')
                .trim();

            return text;
        }

        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        bindEvents() {
            // 绑定折叠按钮
            const toggleBtn = this.navigator.querySelector('.ds-nav-toggle');
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCollapse();
            });

            // 使用事件委托绑定所有按钮和导航项点击
            this.navigator.addEventListener('click', (e) => {
                e.stopPropagation();

                const button = e.target.closest('.ds-nav-button');
                if (button) {
                    const messageId = button.dataset.id;
                    const position = button.dataset.position;
                    this.scrollToMessage(messageId, position);
                    return;
                }

                const navItem = e.target.closest('.ds-nav-item');
                if (navItem) {
                    const messageId = navItem.dataset.id;
                    this.scrollToMessage(messageId, 'start');
                }
            });
        }

        scrollToMessage(messageId, position = 'start') {
            const now = Date.now();
            if (now - this.lastScrollTime < this.scrollCooldown) {
                return;
            }

            this.lastScrollTime = now;

            // 查找消息
            let targetMessage = null;

            for (const pair of this.messagePairs) {
                if (pair.userMessage.id === messageId) {
                    targetMessage = pair.userMessage;
                    break;
                }
                for (const assistantMsg of pair.assistantMessages) {
                    if (assistantMsg.id === messageId) {
                        targetMessage = assistantMsg;
                        break;
                    }
                }
                if (targetMessage) break;
            }

            if (!targetMessage) {
                const element = document.getElementById(messageId);
                if (element) {
                    targetMessage = {
                        id: messageId,
                        element: element
                    };
                }
            }

            if (!targetMessage || !targetMessage.element) {
                this.scanMessages();
                return;
            }

            // 移除之前的高亮
            document.querySelectorAll('.ds-nav-active').forEach(el => {
                el.classList.remove('ds-nav-active');
            });

            // 添加当前高亮
            const navItem = this.navigator.querySelector(`[data-id="${messageId}"]`);
            if (navItem) {
                navItem.classList.add('ds-nav-active');

                const pairGroup = navItem.closest('.ds-nav-pair-group');
                if (pairGroup) {
                    pairGroup.style.border = '1px solid #3b82f6';
                    pairGroup.style.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.1)';

                    document.querySelectorAll('.ds-nav-pair-group').forEach(group => {
                        if (group !== pairGroup) {
                            group.style.border = '1px solid #e5e7eb';
                            group.style.boxShadow = 'none';
                        }
                    });
                }

                navItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (!document.body.contains(targetMessage.element)) {
                this.scanMessages();
                return;
            }

            const scrollOptions = {
                behavior: 'smooth',
                block: position === 'start' ? 'start' : 'end',
                inline: 'nearest'
            };

            targetMessage.element.scrollIntoView(scrollOptions);

            targetMessage.element.classList.add('ds-nav-highlight');
            setTimeout(() => {
                if (targetMessage.element) {
                    targetMessage.element.classList.remove('ds-nav-highlight');
                }
            }, 2000);
        }

        setupObserver() {
            this.observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.matches && (
                                    node.matches('div._9663006') ||
                                    node.matches('div._4f9bf79') ||
                                    node.matches('.ds-message') ||
                                    node.querySelector('[data-um-id]') ||
                                    node.querySelector('.fbb737a4') ||
                                    node.querySelector('.ds-markdown')
                                )) {
                                    shouldUpdate = true;
                                }
                            }
                        });
                    }
                });

                if (shouldUpdate) {
                    console.log('检测到新消息，重新扫描...');

                    setTimeout(() => {
                        this.scanMessages();
                    }, 300);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            window.addEventListener('scroll', () => {
                this.highlightVisibleMessage();
            });
        }

        highlightVisibleMessage() {
            if (this.messagePairs.length === 0) return;

            // 移除所有高亮
            this.navigator.querySelectorAll('.ds-nav-active').forEach(el => {
                el.classList.remove('ds-nav-active');
            });

            document.querySelectorAll('.ds-nav-pair-group').forEach(group => {
                group.style.border = '1px solid #e5e7eb';
                group.style.boxShadow = 'none';
            });

            const viewportHeight = window.innerHeight;
            const viewportMiddle = window.scrollY + (viewportHeight / 2);

            let closestMessage = null;
            let closestDistance = Infinity;
            let closestPair = null;

            this.messagePairs.forEach(pair => {
                if (pair.userMessage.element && document.body.contains(pair.userMessage.element)) {
                    const rect = pair.userMessage.element.getBoundingClientRect();
                    if (rect.height > 0) {
                        const elementTop = window.scrollY + rect.top;
                        const elementMiddle = elementTop + (rect.height / 2);
                        const distance = Math.abs(viewportMiddle - elementMiddle);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestMessage = pair.userMessage;
                            closestPair = pair;
                        }
                    }
                }

                pair.assistantMessages.forEach(assistantMsg => {
                    if (assistantMsg.element && document.body.contains(assistantMsg.element)) {
                        const rect = assistantMsg.element.getBoundingClientRect();
                        if (rect.height > 0) {
                            const elementTop = window.scrollY + rect.top;
                            const elementMiddle = elementTop + (rect.height / 2);
                            const distance = Math.abs(viewportMiddle - elementMiddle);

                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestMessage = assistantMsg;
                                closestPair = pair;
                            }
                        }
                    }
                });
            });

            if (closestMessage && closestDistance < viewportHeight) {
                const navItem = this.navigator.querySelector(`[data-id="${closestMessage.id}"]`);
                if (navItem) {
                    navItem.classList.add('ds-nav-active');

                    const pairGroup = navItem.closest('.ds-nav-pair-group');
                    if (pairGroup) {
                        pairGroup.style.border = '1px solid #3b82f6';
                        pairGroup.style.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.1)';
                    }
                }
            }
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
            if (this.navigator) this.navigator.remove();
            if (this.miniToggle) this.miniToggle.remove();
        }
    }

    // 启动导航器
    let navigator = null;

    function initNavigator() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    navigator = new DeepSeekNavigator();
                }, 500);
            });
        } else {
            setTimeout(() => {
                navigator = new DeepSeekNavigator();
            }, 500);
        }
    }

    // 初始化
    initNavigator();
})();