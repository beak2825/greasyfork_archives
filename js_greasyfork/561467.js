// ==UserScript==
// @name         知乎火眼
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个知乎问答增强脚本，它在页面侧边栏智能聚合所有回答的关键数据，帮助用户快速筛选高质量内容，并支持通过AI进行一键总结与点评。
// @author       QQ:964555694
// @match        *://www.zhihu.com/question/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      www.zhihu.com
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561467/%E7%9F%A5%E4%B9%8E%E7%81%AB%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561467/%E7%9F%A5%E4%B9%8E%E7%81%AB%E7%9C%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ==========================================
    // 1. 样式定义 (CSS)
    // ==========================================
    const hideCSS = `
        /* 隐藏干扰元素 */
        .HotSearchCard {
            display: none !important;
        }
        .css-2pfapc {
            display: none !important;
        }

        /* 列表项基础样式 */
        .ctz-answer-list-item {
            display: flex;
            flex-direction: column; /* 垂直分布 */
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            gap: 8px; /* 增加元素间距 */
        }

        /* 用户信息块（垂直布局） */
        .ctz-user-block {
            flex: 2;
            min-width: 0;
            padding: 4px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            flex-direction: column; /* 垂直排列子元素 */
        }

        .ctz-user-block:hover {
            background-color: #f6f6f6;
        }

        /* 第一行：用户名 + 数据统计（水平排列） */
        .ctz-user-name-container {
            display: flex;
            align-items: center;
            justify-content: space-between; /* 用户名左，数据统计块右 */
            gap: 8px; /* 用户名与数据统计块的间距 */
        }

        /* 用户名 */
        .ctz-user-name {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            margin-bottom: 0; /* 去掉下边距，作为flex容器的一部分 */
            display: block;
        }

        /* 数据统计（赞·评·字）- 强化右对齐 */
        .ctz-answer-list-stats {
            flex: 0 0 auto; /* 不伸缩，保持内容宽度 */
            white-space: nowrap;
            font-size: 13px;
            color: #666;
            background: #f6f6f6;
            padding: 4px 8px;
            border-radius: 4px;
            text-align: right; /* 确保文本靠右 */
        }

        /* 数据统计标注样式 */
        .stats-highlight {
            display: inline-block;
            font-size: 13px;
            font-weight: bold;
        }
        .high-likes {
            color: #ff4d4f;
            background: rgba(255, 77, 79, 0.1);
        }
        .hot-comments {
            color: #fa8c16;
            background: rgba(250, 140, 22, 0.1);
        }
        .long-article {
            color: #52c41a;
            background: rgba(82, 196, 26, 0.1);
        }

        /* 第二行：粉丝 + 回答数 + 标签（水平排列） */
        .ctz-user-meta-container {
            display: flex;
            align-items: center;
            gap: 8px; /* 粉丝+回答数与标签的间距 */
            margin-top: 4px; /* 与第一行的间距 */
        }

        /* 粉丝 + 回答数 */
        .ctz-user-meta {
            font-size: 12px;
            color: #8590a6;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            line-height: 1.4;
        }

        /* AI按钮样式 */
        .ask-ai-btn {
            background: #E0FFE0;
            color: #666;
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 11px;
            cursor: pointer;
            margin: 0 4px;
            transition: background 0.2s;
        }
        .ask-ai-btn:hover {
            background: #e0e0e0;
        }
        .ask-ai-btn.loading {
            background: #ccc;
            cursor: not-allowed;
        }

        /* 标签样式 */
        .ctz-answer-label {
            font-size: 12px;
            color: #8590a6;
            white-space: nowrap;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* 按钮样式 */
        .load-more-btn {
            background: #267f7f;
            color: white;
            border: none;
            padding: 4px 7px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            margin-left: 10px;
            transition: background 0.3s;
        }
        .load-more-btn:hover {
            background: #0066cc;
        }
        .load-more-btn.loading {
            background: #999;
            cursor: not-allowed;
        }

        /* 进度文本 */
        .progress-text {
            margin-left: 10px;
            font-size: 14px;
            color: #666;
            font-variant-numeric: tabular-nums;
        }

        /* 固定侧边栏样式 */
        .Question-sideColumn {
            position: fixed !important;
            top: 80px;
            right: 20px;
            width: 320px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
            z-index: 1000;
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .Question-mainColumn {
            margin-right: 340px;
        }
        .Question-sideColumn > *:not(.ctz-answer-list-card) {
            display: none !important;
        }

        /* 工具栏样式 */
        .ctz-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
            height: 32px;
        }

        /* 配置按钮样式 */
        .ctz-config-btn {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 16px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .ctz-config-btn:hover {
            background: #e6f7ff;
            color: #007fff;
        }

        /* 过滤选项样式 */
        .ctz-filter-options {
            display: flex;
            gap: 8px;
            margin-left: 10px;
        }
        .ctz-filter-checkbox {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
        }
        .ctz-filter-checkbox input {
            margin: 0;
        }

        /* 定位高亮动画 */
        @keyframes highlightFade {
            0% { background-color: rgba(0, 127, 255, 0.25); }
            100% { background-color: rgba(255, 255, 255, 0); }
        }
        .ctz-target-answer {
            animation: highlightFade 1.5s ease-out forwards;
        }
        .MarkRed{color:red};

        /* AI结果展示样式 */
        .ctz-ai-result {
            margin-top: 12px; /* 增加上下间距 */
            padding: 8px;
            background: #f9f9f9;
            border-radius: 4px;
            font-size: 10px;
            color: #333;
        }
        .ctz-ai-result .summary {
            color: #007fff;
            margin-bottom: 4px;
            font-size: 13px;
        }
        .ctz-ai-result .review {
            color: #666;
            margin-bottom: 4px;
            font-size: 13px;
        }
        .ctz-ai-result .tags {
            color: #8590a6;
            font-size: 13px;
        }
        .ctz-ai-result .tag {
            display: inline-block;
            background: #e6f7ff;
            color: #007fff;
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 4px;
            margin-bottom: 2px;
        }

        /* 滚动高亮样式 */
        .ctz-list-item-highlight {
            background-color: #e6f7ff !important;
            border-left: 3px solid #007fff;
            padding-left: 5px;
        }

        /* 取消 .css-1qyytj7 的 max-width 限制 */
        .css-1qyytj7 {
            max-width: none !important;
        }

        .Question-sideColumn {
        width:400px;
        }
    `;

    const style = document.createElement('style');
    style.textContent = hideCSS;
    document.head.appendChild(style);

    // ==========================================
    // 2. 工具函数
    // ==========================================

    const userInfoCache = new Map();
    const processedIds = new Set();
    let isLoading = false;
    let currentLoadedCount = 0;
    let totalAnswers = 0;
    let aiAnalysisCache = new Map(); // 缓存AI分析结果
    let scrollHighlightTimeout = null; // 滚动高亮定时器
    let scrollInterval = null; // 加载更多回答的定时器（全局引用以便清除）
    let currentPage = 1; // 当前页数
    const itemsPerPage = 200; // 每页加载200个回答

    // 过滤选项
    let filters = {
        onlyExperts: false,
        onlyHighLikes: false,
        onlyHotComments: false
    };

    // 全局存储所有已加载的回答数据
    let allLoadedAnswers = [];

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 计算百分位
    function calculate_percentile(value, value_list) {
        const sorted_list = [...value_list].sort((a, b) => a - b);
        const count_less_equal = sorted_list.filter(x => x <= value).length;
        return (count_less_equal / sorted_list.length) * 100;
    }

    // 生成标签
    function generate_label(answer_data, percentile_data) {
        return ""; // 暂时返回空字符串
    }

    function scrollToAnswer(answerId) {
        const targetAnswer = document.querySelector(`.ContentItem.AnswerItem[name="${answerId}"]`);
        if (targetAnswer) {
            targetAnswer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.querySelectorAll('.ctz-target-answer').forEach(el => el.classList.remove('ctz-target-answer'));
            targetAnswer.classList.add('ctz-target-answer');
            setTimeout(() => {
                targetAnswer.classList.remove('ctz-target-answer');
            }, 1500);
        }
    }

    function fetchUserInfo(idToken) {
        return new Promise((resolve) => {
            if (!idToken) return resolve(null);
            const includeParams = 'allow_message,is_followed,is_following,is_org,is_blocking,employments,answer_count,follower_count,articles_count,gender,badge[?(type=best_answerer)].topics';
            const apiUrl = `https://www.zhihu.com/api/v4/members/${idToken}?include=${encodeURIComponent(includeParams)}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: { "Content-Type": "application/json" },
                timeout: 5000,
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            resolve(null);
                        }
                    } catch (e) { resolve(null); }
                },
                onerror: function() { resolve(null); },
                ontimeout: function() { resolve(null); }
            });
        });
    }

    function formatUserInfo(userInfo) {
        if (!userInfo) return '暂无信息';

        // 获取粉丝数和回答数
        const followerCount = userInfo.follower_count || 0;
        const answerCount = userInfo.answer_count || 0;

        // 计算粉/答比例（取整）
        let ratio = '';
        if (answerCount > 0) {
            ratio = Math.round(followerCount / answerCount);
        }

        // 格式化粉丝数
        let formattedFollowers = '';
        if (followerCount >= 10000) {
            formattedFollowers = (followerCount / 10000).toFixed(1) + '万粉';
        } else {
            formattedFollowers = followerCount + ' 粉';
        }

        // 返回完整格式
        return `${formattedFollowers} / ${answerCount} 答 = ${ratio}`;
    }

    // 检查回答是否符合过滤条件
    function shouldShowAnswer(answerData) {
        if (filters.onlyExperts && answerData.followers < 10000) return false;
        if (filters.onlyHighLikes && answerData.likes_percentile <= 80) return false;
        if (filters.onlyHotComments && answerData.comments_percentile <= 80) return false;
        return true;
    }

    // 应用筛选条件到已加载的回答
    function applyFilters() {
        allLoadedAnswers.forEach(answer => {
            const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${answer.answerId}"]`);
            if (listItem) {
                const shouldShow = shouldShowAnswer(answer);
                listItem.style.display = shouldShow ? 'flex' : 'none';
            }
        });
    }

    // 更新所有回答的显示标记
    function updateAllAnswerStats() {
        const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
        const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
        const words_list = allLoadedAnswers.map(ans => ans.wordCount);
        const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
        const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

        allLoadedAnswers.forEach(ans => {
            // 更新百分位
            ans.likes_percentile = calculate_percentile(ans.upvoteNum, likes_list);
            ans.comments_percentile = calculate_percentile(ans.commentNum, comments_list);
            ans.words_percentile = calculate_percentile(ans.wordCount, words_list);
            ans.followers_percentile = calculate_percentile(ans.followers || 0, followers_list);
            ans.answers_percentile = calculate_percentile(ans.answers_count || 0, answers_count_list);

            // 更新显示标记
            const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${ans.answerId}"]`);
            if (listItem) {
                // 更新赞、评、字的颜色标记
                const upvoteText = ans.likes_percentile > 80 ?
                    '<span class="stats-highlight high-likes">赞</span>' : '赞';
                const commentText = ans.comments_percentile > 80 ?
                    '<span class="stats-highlight hot-comments">评</span>' : '评';
                const wordText = ans.words_percentile > 80 ?
                    '<span class="stats-highlight long-article">长</span>' : '字';

                // 更新DOM中的显示
                const statsDiv = listItem.querySelector('.ctz-answer-list-stats');
                if (statsDiv) {
                    statsDiv.innerHTML = `${ans.upvoteNum} ${upvoteText} · ${ans.commentNum} ${commentText} · ${ans.wordCount} ${wordText}`;
                }

                // 更新标签
                updateLabel(ans.answerId);
            }
        });
    }

    // 更新标签（根据全局数据重新计算）
    function updateLabel(answerId) {
        const labelSpan = document.querySelector(`#label-${answerId}`);
        const answerData = allLoadedAnswers.find(ans => ans.answerId === answerId);

        if (!labelSpan || !answerData) return;

        // 计算全局百分位
        const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
        const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
        const words_list = allLoadedAnswers.map(ans => ans.wordCount);
        const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
        const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

        const likes_percentile = calculate_percentile(answerData.upvoteNum, likes_list);
        const comments_percentile = calculate_percentile(answerData.commentNum, comments_list);
        const words_percentile = calculate_percentile(answerData.wordCount, words_list);
        const followers_percentile = calculate_percentile(answerData.followers || 0, followers_list);
        const answers_percentile = calculate_percentile(answerData.answers_count || 0, answers_count_list);

        const percentile_data = {
            likes_percentile,
            comments_percentile,
            words_percentile,
            followers_percentile,
            answers_percentile
        };

        const newLabel = generate_label(answerData, percentile_data);

        labelSpan.innerHTML = newLabel;
    }

    // 防抖的重算所有标签函数
    const recalculateAllLabels = debounce(() => {
        allLoadedAnswers.forEach(ans => {
            updateLabel(ans.answerId);
        });
    }, 500);

    // 显示API key配置弹窗
    function showApiKeyConfig() {
        const apiKey = prompt("请输入您的DeepSeek API Key（可在DeepSeek官网获取）：");
        if (apiKey && apiKey.trim()) {
            GM_setValue('deepseek_api_key', apiKey.trim());
            GM_notification({
                text: "DeepSeek API Key 配置成功！",
                timeout: 3000
            });
        }
    }

    // 获取API key（如果未配置则提示）
    function getApiKey() {
        let apiKey = GM_getValue('deepseek_api_key');
        if (!apiKey) {
            showApiKeyConfig();
            return null;
        }
        return apiKey;
    }

    // 调用DeepSeek API分析回答
    async function analyzeWithDeepSeek(answerContent, questionTitle) {
        const apiKey = getApiKey();
        if (!apiKey) return null;

        const prompt = `你是一个擅长提炼知乎回答核心观点的助手，请对以下内容执行以下任务：
1. 用一句话概括回答的核心内容（保留关键信息，如观点、结论或解决方案）；
2. 对回答的价值/质量进行言简意赅的点评（如"逻辑清晰，案例具体""观点新颖但缺乏数据支撑"等，避免主观情绪）；
3. 从以下标签列表中选择最匹配的1-3个标签，标注回答的内容类型（标签需严格来自列表，不得自行创造）：
买课、情绪宣泄、干货、劲爆、讲故事、技术贴、答非所问、段子、玩梗、深度观点、经历叙事、情感共鸣、资源清单、创意娱乐、专业、生活经验、文献考据、视觉呈现、争议解构、热点追评、引流。
4. 如果结尾处有卖货、引流、店铺等这样的类似词汇或疑似链接，则标记为“买课”或“引流”的标签；
输出格式严格遵循：
【一句话总结】：[总结内容]
【点评】：[点评内容]
【标签】：[标签1, 标签2, ...]

原问题：${questionTitle}
输入内容（知乎回答）：${answerContent}`;

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                    temperature: 0.3, // 降低随机性，提高结果一致性
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            GM_notification({
                text: `DeepSeek API调用失败: ${error.message}`,
                timeout: 5000
            });
            return null;
        }
    }

    // 解析AI分析结果并格式化
    function parseAIResult(resultText) {
        if (!resultText) return null;

        const summaryMatch = resultText.match(/【一句话总结】：([\s\S]*?)【点评】：/);
        const reviewMatch = resultText.match(/【点评】：([\s\S]*?)【标签】：/);
        const tagsMatch = resultText.match(/【标签】：([\s\S]*)/);
        return {
            summary: summaryMatch ? summaryMatch[1].trim() : '',
            review: reviewMatch ? reviewMatch[1].trim() : '',
            tags: tagsMatch ? tagsMatch[1].split(/[,\uff0c]/).map(tag => tag.trim()).filter(tag => tag) : []
        };
    }

    // 显示AI分析结果
    function showAIResult(listItem, result) {
        if (!result) return;

        // 清除之前的分析结果
        const existingResult = listItem.querySelector('.ctz-ai-result');
        if (existingResult) {
            existingResult.remove();
        }

        const resultContainer = document.createElement('div');
        resultContainer.className = 'ctz-ai-result';

        // 构建结果HTML
        let html = '<div class="summary">' + result.summary + '</div>';
        html += '<div class="review">' + result.review + '</div>';
        html += '<div class="tags">';
        result.tags.forEach(tag => {
            html += `<span class="tag">${tag}</span>`;
        });
        html += '</div>';

        resultContainer.innerHTML = html;
        listItem.appendChild(resultContainer);
    }

    // 滚动高亮功能
    function handleScrollHighlight() {
        if (scrollHighlightTimeout) {
            clearTimeout(scrollHighlightTimeout);
        }

        scrollHighlightTimeout = setTimeout(() => {
            const answers = document.querySelectorAll('.ContentItem.AnswerItem');
            const scrollPosition = window.scrollY + window.innerHeight / 2; // 屏幕中心位置

            let closestAnswer = null;
            let minDistance = Infinity;

            answers.forEach(answer => {
                const answerId = answer.getAttribute('name') ||
                               (answer.dataset.zop ? JSON.parse(answer.dataset.zop)?.itemId : null);
                if (!answerId) return;

                const rect = answer.getBoundingClientRect();
                const answerTop = rect.top + window.scrollY;
                const distance = Math.abs(scrollPosition - answerTop);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestAnswer = answerId;
                }
            });

            // 移除所有高亮
            document.querySelectorAll('.ctz-answer-list-item').forEach(item => {
                item.classList.remove('ctz-list-item-highlight');
            });

            // 添加高亮到最接近的回答
            if (closestAnswer) {
                const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${closestAnswer}"]`);
                if (listItem) {
                    listItem.classList.add('ctz-list-item-highlight');
                }
            }
        }, 100); // 100ms防抖
    }

    // ==========================================
    // 3. DOM监听与初始化
    // ==========================================

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('.HotSearchCard') || node.matches('.css-2pfapc')) {
                        node.style.display = 'none';
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ==========================================
    // 4. 核心逻辑封装
    // ==========================================
    function initializeScript() {
        // 防止重复初始化
        if (document.querySelector('.ctz-answer-list-card')) {
            console.log('脚本已初始化，跳过');
            return;
        }

        console.log("初始化脚本...");

        // 清理旧状态（针对SPA路由跳转）
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        if (scrollHighlightTimeout) {
            clearTimeout(scrollHighlightTimeout);
            scrollHighlightTimeout = null;
        }
        isLoading = false;
        allLoadedAnswers = [];
        processedIds.clear();
        currentLoadedCount = 0;
        totalAnswers = 0; // 重置总数以便重新获取

        const sideColumn = document.querySelector('.Question-sideColumn');
        if (!sideColumn) return; // 侧边栏未加载，等待下次检查

console.log("22222222222222222222");
        const totalAnswersElement = document.querySelector('.List-headerText span');
        if (totalAnswersElement) {
            const match = totalAnswersElement.textContent.match(/(\d[\d,]*)/); // 匹配数字（含逗号）
            totalAnswers = match ? parseInt(match[0].replace(/,/g, '')) : 0;
        }

        const answerListCard = document.createElement('div');
        answerListCard.className = 'Card ctz-answer-list-card';
        answerListCard.innerHTML = `
            <div class="Card-header">
                <div class="Card-headerText">火眼洞察</div>
                <span class="progress-text">${totalAnswers > 0 ? '0/' + totalAnswers : '计算中...'}</span>
            </div>
            <div class="ctz-toolbar">
                <button class="ctz-config-btn" title="配置DeepSeek API">⚙️</button>
                <button class="load-more-btn">加载更多</button>
                <div class="ctz-filter-options">
                    <label class="ctz-filter-checkbox">
                        <input type="checkbox" id="only-experts"> 只看大牛
                    </label>
                    <label class="ctz-filter-checkbox">
                        <input type="checkbox" id="only-high-likes"> 只看高赞
                    </label>
                    <label class="ctz-filter-checkbox">
                        <input type="checkbox" id="only-hot-comments"> 只看热评
                    </label>
                </div>
            </div>
            <div class="Card-section">
                <ul class="ctz-answer-list"></ul>
            </div>
        `;
        sideColumn.appendChild(answerListCard);

        // 绑定配置按钮点击事件
        const configBtn = answerListCard.querySelector('.ctz-config-btn');
        configBtn.addEventListener('click', showApiKeyConfig);

        // 绑定过滤选项事件
        const onlyExpertsCheckbox = answerListCard.querySelector('#only-experts');
        const onlyHighLikesCheckbox = answerListCard.querySelector('#only-high-likes');
        const onlyHotCommentsCheckbox = answerListCard.querySelector('#only-hot-comments');

        onlyExpertsCheckbox.addEventListener('change', function() {
            filters.onlyExperts = this.checked;
            applyFilters(); // 立即应用筛选
        });

        onlyHighLikesCheckbox.addEventListener('change', function() {
            filters.onlyHighLikes = this.checked;
            applyFilters(); // 立即应用筛选
        });

        onlyHotCommentsCheckbox.addEventListener('change', function() {
            filters.onlyHotComments = this.checked;
            applyFilters(); // 立即应用筛选
        });

        // 添加滚动监听
        window.addEventListener('scroll', handleScrollHighlight);
        window.addEventListener('resize', handleScrollHighlight);

        // 初始化高亮
        setTimeout(handleScrollHighlight, 1000);

        // ==========================================
        // 5. 核心逻辑（原 load 内部函数）
        // ==========================================

        function updateProgress() {
            const progressText = document.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${currentLoadedCount}/${totalAnswers || '?'}`;
            }
        }

        function scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        function loadMoreAnswers() {
            if (isLoading) return;
            isLoading = true;
            const loadMoreBtn = document.querySelector('.load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.textContent = '加载中...';
                loadMoreBtn.classList.add('loading');
            }

            let lastHeight = 0;
            // 使用全局变量 scrollInterval 存储 ID，以便在切换页面时清除
            scrollInterval = setInterval(() => {
                scrollToBottom();
                setTimeout(() => {
                    const currentHeight = document.body.scrollHeight;
                    if (currentHeight === lastHeight) {
                        clearInterval(scrollInterval);
                        scrollInterval = null;
                        isLoading = false;
                        if (loadMoreBtn) {
                            loadMoreBtn.textContent = '加载更多';
                            loadMoreBtn.classList.remove('loading');
                        }
                        renderAnswerList();
                    } else {
                        lastHeight = currentHeight;
                        renderAnswerList();
                    }
                }, 2500);
            }, 2000);
        }

        function renderAnswerList() {
            const answerList = document.querySelector('.ctz-answer-list');
            if (!answerList) return;

            const answers = document.querySelectorAll('.ContentItem.AnswerItem');

            // 收集所有回答的指标
            const newAnswersData = [];
            answers.forEach(answer => {
                const answerId = answer.getAttribute('name') ||
                                (answer.dataset.zop ? JSON.parse(answer.dataset.zop)?.itemId : null);
                if (!answerId || processedIds.has(answerId)) return;
                processedIds.add(answerId);

                const userLink = answer.querySelector('.UserLink-link');
                const userNameMeta = answer.querySelector('meta[itemprop="name"]');
                const userName = userNameMeta?.content ||
                               answer.querySelector('.AuthorInfo-name')?.textContent?.trim() ||
                               '未知用户';

                const userIdToken = userLink ? userLink.getAttribute('href').split('/people/')[1] : null;

                let upvoteNum = 0, commentNum = 0;
                try {
                    const cardData = JSON.parse(answer.getAttribute('data-za-extra-module') || '{}');
                    upvoteNum = cardData?.card?.content?.upvote_num || 0;
                    commentNum = cardData?.card?.content?.comment_num || 0;
                } catch (e) {
                    const upvoteText = answer.querySelector('.css-1lr85n')?.textContent;
                    if (upvoteText) upvoteNum = parseInt(upvoteText.match(/\d+/)?.[0] || '0');
                }

                let wordCount = 0;
                const contentElement = answer.querySelector('.RichContent-inner');
                if (contentElement) {
                    wordCount = contentElement.textContent.replace(/\s/g, '').length;
                }

                const answerData = {
                    answerId,
                    userName,
                    userIdToken,
                    upvoteNum,
                    commentNum,
                    wordCount,
                    followers: 0,
                    answers_count: 0,
                    likes_percentile: 0,
                    comments_percentile: 0,
                    words_percentile: 0
                };

                newAnswersData.push(answerData);
                allLoadedAnswers.push(answerData);
            });

            // ================= 方案一：先计算，再渲染，后同步 =================

            // 1. 如果有新回答，先计算所有回答（包括新回答）的百分位
            if (newAnswersData.length > 0) {
                const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
                const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
                const words_list = allLoadedAnswers.map(ans => ans.wordCount);
                const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
                const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

                // 更新 allLoadedAnswers 中所有对象的百分位数据
                allLoadedAnswers.forEach(ans => {
                    ans.likes_percentile = calculate_percentile(ans.upvoteNum, likes_list);
                    ans.comments_percentile = calculate_percentile(ans.commentNum, comments_list);
                    ans.words_percentile = calculate_percentile(ans.wordCount, words_list);
                    ans.followers_percentile = calculate_percentile(ans.followers || 0, followers_list);
                    ans.answers_percentile = calculate_percentile(ans.answers_count || 0, answers_count_list);
                });
            }

            // 2. 渲染新回答，直接使用计算好的百分位数据
            if (newAnswersData.length > 0) {
                newAnswersData.forEach(ans => {
                    const shouldShow = shouldShowAnswer(ans);
                    const displayStyle = shouldShow ? 'flex' : 'none';

                    // 使用计算好的百分位生成带颜色的文本
                    const upvoteText = ans.likes_percentile > 80 ?
                        '<span class="stats-highlight high-likes">赞</span>' : '赞';
                    const commentText = ans.comments_percentile > 80 ?
                        '<span class="stats-highlight hot-comments">评</span>' : '评';
                    const wordText = ans.words_percentile > 80 ?
                        '<span class="stats-highlight long-article">长</span>' : '字';

                    // DOM构建
                    const listItem = document.createElement('li');
                    listItem.className = 'ctz-answer-list-item';
                    listItem.setAttribute('data-answer-id', ans.answerId);
                    listItem.style.display = displayStyle;

                    listItem.innerHTML = `
                        <div class="ctz-user-block" title="点击跳转到该回答">
                            <div class="ctz-user-name-container">
                                <span class="ctz-user-name">${ans.userName}</span>
                                <div class="ctz-answer-list-stats">
                                    ${ans.upvoteNum} ${upvoteText} · ${ans.commentNum} ${commentText} · ${ans.wordCount} ${wordText}
                                </div>
                            </div>
                            <div class="ctz-user-meta-container">
                                <span class="ctz-user-meta" id="meta-${ans.answerId}">获取信息...</span>
                                <button class="ask-ai-btn" data-answer-id="${ans.answerId}">问AI</button>
                                <span class="ctz-answer-label" id="label-${ans.answerId}"></span>
                            </div>
                        </div>
                    `;

                    answerList.appendChild(listItem);
                    currentLoadedCount++;
                    updateProgress();

                    // 绑定点击事件
                    const userBlock = listItem.querySelector('.ctz-user-block');
                    userBlock.addEventListener('click', () => {
                        scrollToAnswer(ans.answerId);
                    });

                    // 绑定"问AI"按钮点击事件
                    const askAiBtn = listItem.querySelector('.ask-ai-btn');
                    askAiBtn.addEventListener('click', async function(e) {
                        e.stopPropagation();
                        if (aiAnalysisCache.has(ans.answerId)) {
                            showAIResult(listItem, aiAnalysisCache.get(ans.answerId));
                            return;
                        }
                        if (this.classList.contains('loading')) return;
                        this.classList.add('loading');
                        this.textContent = '分析中...';

                        const answer = document.querySelector(`.ContentItem.AnswerItem[name="${ans.answerId}"]`);
                        if (!answer) {
                            this.classList.remove('loading');
                            this.textContent = '问AI';
                            return;
                        }

                        const content = answer.querySelector('.RichContent-inner').textContent;
                        const question = document.querySelector('.QuestionHeader-title')?.textContent || '未知问题';

                        const analysisResult = await analyzeWithDeepSeek(content, question);

                        const parsedResult = parseAIResult(analysisResult);
                        if (parsedResult) {
                            aiAnalysisCache.set(ans.answerId, parsedResult);
                            showAIResult(listItem, parsedResult);
                        }

                        this.classList.remove('loading');
                        this.textContent = '问AI';
                    });

                    // 异步获取userInfo
                    if (ans.userIdToken) {
                        if (userInfoCache.has(ans.userIdToken)) {
                            const info = userInfoCache.get(ans.userIdToken);
                            updateUserMeta(ans.answerId, info);
                            const globalData = allLoadedAnswers.find(d => d.answerId === ans.answerId);
                            if (globalData && info) {
                                globalData.followers = info.follower_count || 0;
                                globalData.answers_count = info.answer_count || 0;
                            }
                            updateLabel(ans.answerId);
                        } else {
                            fetchUserInfo(ans.userIdToken).then(userInfo => {
                                if (userInfo) {
                                    userInfoCache.set(ans.userIdToken, userInfo);
                                    updateUserMeta(ans.answerId, userInfo);
                                    const globalData = allLoadedAnswers.find(d => d.answerId === ans.answerId);
                                    if (globalData) {
                                        globalData.followers = userInfo.follower_count || 0;
                                        globalData.answers_count = userInfo.answer_count || 0;
                                    }
                                    recalculateAllLabels();
                                }
                            });
                        }
                    } else {
                        updateUserMeta(ans.answerId, null);
                    }
                });
            }

            // 3. 调用 updateAllAnswerStats 来更新旧回答的DOM和所有回答的标签
            if (newAnswersData.length > 0) {
                updateAllAnswerStats();
            }
        }

        function updateUserMeta(answerId, userInfo) {
            const metaSpan = document.querySelector(`#meta-${answerId}`);
            if (metaSpan) {
                metaSpan.textContent = formatUserInfo(userInfo);
            }
        }

        // 启动渲染
        renderAnswerList();

        const answerObserver = new MutationObserver(() => {
            renderAnswerList();
        });

        const answersContainer = document.querySelector('#QuestionAnswers-answers');
        if (answersContainer) {
            answerObserver.observe(answersContainer, { childList: true, subtree: true });
        }

        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreAnswers);
        }
    }

    // ==========================================
    // 6. 启动与轮询
    // ==========================================

    // 监听初始加载
    window.addEventListener('load', initializeScript);

    // 定期检查页面状态（解决SPA路由跳转问题）
    let checkInterval = setInterval(() => {
        const isQuestionPage = window.location.pathname.includes('/question/');
        const sideColumnExists = document.querySelector('.Question-sideColumn');
        const cardExists = document.querySelector('.ctz-answer-list-card');

        // 如果在问题页面，侧边栏存在，但脚本卡片不存在，则尝试初始化
        if (isQuestionPage && sideColumnExists && !cardExists) {
            initializeScript();
        }
    }, 1000);

    // 页面关闭时清理定时器
    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
    });

})();
