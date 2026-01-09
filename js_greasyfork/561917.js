// ==UserScript==
// @name         知乎火眼
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  知乎增强脚本，在侧边栏智能聚合所有回答的关键数据，帮助用户快速筛选高质量内容，支持数据筛选、AI单条分析及结构化全局对比。附带功能：对知乎文章进行淡化处理。知乎优化以及知乎美化显示。
// @author       QQ:964555694
// @match        *://www.zhihu.com/question/*
// @match        *://www.zhihu.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      www.zhihu.com
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561917/%E7%9F%A5%E4%B9%8E%E7%81%AB%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561917/%E7%9F%A5%E4%B9%8E%E7%81%AB%E7%9C%BC.meta.js
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
        .KfeCollection-CreateSaltCard{
            display: none !important;
        }
        .GlobalSideBar-navList{
            display: none !important;
        }
        .css-173vipd{
            display: none !important;
        }

        /* 文章变灰显示 */
        .ContentItem.ArticleItem {
            opacity: 0.3;
            filter: grayscale(100%);
            transition: all 0.2s;
        }

        /* 列表项基础样式 */
        .ctz-answer-list-item {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            gap: 8px;
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
            flex-direction: column;
        }

        .ctz-user-block:hover {
            background-color: #f6f6f6;
        }

        /* 第一行：用户名 + 数据统计 */
        .ctz-user-name-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .ctz-user-name {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            margin-bottom: 0;
            display: block;
        }

        /* 数据统计（赞·评·字） */
        .ctz-answer-list-stats {
            flex: 0 0 auto;
            white-space: nowrap;
            font-size: 13px;
            color: #666;
            background: #f6f6f6;
            padding: 4px 8px;
            border-radius: 4px;
            text-align: right;
        }

        /* 数据统计标注 */
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

        /* 第二行：粉丝 + 回答数 + 标签 */
        .ctz-user-meta-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }

        .ctz-user-meta {
            font-size: 12px;
            color: #8590a6;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            line-height: 1.4;
        }

        /* 按钮通用样式 */
        .load-more-btn, .ai-compare-btn {
            color: white;
            border: none;
            padding: 4px 7px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            margin-left: 5px;
            transition: background 0.3s;
        }

        .load-more-btn {
            background: #267f7f;
        }
        .load-more-btn:hover {
            background: #0066cc;
        }
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

        /* AI对比按钮样式 */
        .ai-compare-btn {
            background: #6c5ce7;
        }
        .ai-compare-btn:hover {
            background: #5649c0;
        }
        .ai-compare-btn.loading {
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

        /* AI单条结果展示 */
        .ctz-ai-result {
            margin-top: 12px;
            padding: 8px;
            background: #f9f9f9;
            border-radius: 4px;
            font-size: 10px;
            color: #333;
        }
        .ctz-ai-result .summary { color: #007fff; margin-bottom: 4px; font-size: 13px; }
        .ctz-ai-result .review { color: #666; margin-bottom: 4px; font-size: 13px; }
        .ctz-ai-result .tags { color: #8590a6; font-size: 13px; }
        .ctz-ai-result .tag {
            display: inline-block;
            background: #e6f7ff;
            color: #007fff;
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 4px;
            margin-bottom: 2px;
        }

        /* ==========================================
           AI对比结果容器 (方案 B：组件化样式 + 折叠功能)
           ========================================== */
        #ctz-compare-container {
            padding: 0 10px 10px 10px;
            background: #fff;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 13px;
            line-height: 1.6;
            overflow: hidden;
            transition: all 0.3s;
        }

        /* 折叠面板标题 */
        .ctz-compare-header {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            margin: 0;
            user-select: none;
            border-bottom: 1px solid transparent;
            transition: background 0.2s;
        }
        .ctz-compare-header:hover {
            background-color: #fafafa;
        }
        .ctz-compare-header .arrow {
            font-size: 12px;
            color: #999;
            transition: transform 0.2s;
            transform-origin: center;
        }

        /* 折叠状态 */
        #ctz-compare-container.collapsed .ctz-compare-content {
            display: none;
        }
        #ctz-compare-container.collapsed .arrow {
            transform: rotate(-90deg);
        }
        #ctz-compare-container.collapsed h4 {
            border-bottom: none;
        }

        /* 标题原有样式调整 */
        #ctz-compare-container h4 {
            color: #333;
            font-size: 14px;
            padding: 0;
            border-bottom: 2px solid #f0f0f0;
            width: 100%;
        }

        /* 内容容器 */
        .ctz-compare-content {
            padding-top: 10px;
        }

        /* 通用板块样式 */
        .compare-section {
            margin-bottom: 12px;
            padding: 8px;
            border-radius: 4px;
        }
        .compare-section:last-child {
            margin-bottom: 0;
        }
        .compare-label {
            font-weight: bold;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }

        /* 1. 共识区 - 蓝色系 */
        .compare-consensus {
            background: #e6f7ff;
            border-left: 4px solid #1890ff;
        }
        .compare-consensus .compare-label { color: #096dd9; }

        /* 2. 分歧区 - 橙色系 */
        .compare-difference {
            background: #fff7e6;
            border-left: 4px solid #fa8c16;
        }
        .compare-difference .compare-label { color: #d46b08; }
        .compare-diff-list {
            list-style: none;
            padding-left: 0;
            margin: 0;
        }
        .compare-diff-list li {
            margin-bottom: 4px;
            position: relative;
            padding-left: 15px;
        }
        .compare-diff-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #fa8c16;
        }

        /* 3. 亮点区 - 灰色系/卡片 */
        .compare-highlight {
            background: #f9f9f9;
            border: 1px solid #e8e8e8;
        }
        .compare-highlight .compare-label { color: #595959; border-bottom: 1px dashed #d9d9d9; padding-bottom: 4px; }
        .highlight-item {
            background: #fff;
            padding: 6px;
            margin-bottom: 6px;
            border-radius: 4px;
            border-left: 2px solid #8c8c8c;
            font-size: 12px;
        }
        .highlight-user {
            font-weight: bold;
            color: #595959;
            margin-right: 4px;
            font-size: 12px;
        }

        /* 滚动高亮 */
        .ctz-list-item-highlight {
            background-color: #e6f7ff !important;
            border-left: 3px solid #007fff;
            padding-left: 5px;
        }
        @keyframes highlightFade {
            0% { background-color: rgba(0, 127, 255, 0.25); }
            100% { background-color: rgba(255, 255, 255, 0); }
        }
        .ctz-target-answer { animation: highlightFade 1.5s ease-out forwards; }


/* 日期显示样式 */
.ctz-answer-date {
    font-size: 10px;
    color: #BBB;
    margin-left: 8px;
    white-space: nowrap;
    cursor: default;
}





        .css-1qyytj7 {
            max-width: none !important;
        }

        .Question-sideColumn { width: 400px; }
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
    let aiAnalysisCache = new Map();
    let scrollHighlightTimeout = null;
    let scrollInterval = null;
    let currentPage = 1;
    const itemsPerPage = 200;

    let filters = {
        onlyExperts: false,
        onlyHighLikes: false,
        onlyHotComments: false
    };

    let allLoadedAnswers = [];

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function calculate_percentile(value, value_list) {
        const sorted_list = [...value_list].sort((a, b) => a - b);
        const count_less_equal = sorted_list.filter(x => x <= value).length;
        return (count_less_equal / sorted_list.length) * 100;
    }

    function generate_label(answer_data, percentile_data) {
        return "";
    }

    function scrollToAnswer(answerId) {
        const targetAnswer = document.querySelector(`.ContentItem.AnswerItem[name="${answerId}"]`);
        if (targetAnswer) {
            targetAnswer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.querySelectorAll('.ctz-target-answer').forEach(el => el.classList.remove('ctz-target-answer'));
            targetAnswer.classList.add('ctz-target-answer');
            setTimeout(() => { targetAnswer.classList.remove('ctz-target-answer'); }, 1500);
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
                        if (response.status === 200) resolve(JSON.parse(response.responseText));
                        else resolve(null);
                    } catch (e) { resolve(null); }
                },
                onerror: function() { resolve(null); },
                ontimeout: function() { resolve(null); }
            });
        });
    }

    function formatUserInfo(userInfo) {
        if (!userInfo) return '暂无信息';
        const followerCount = userInfo.follower_count || 0;
        const answerCount = userInfo.answer_count || 0;
        let ratio = '';
        if (answerCount > 0) ratio = Math.round(followerCount / answerCount);
        let formattedFollowers = followerCount >= 10000 ? (followerCount / 10000).toFixed(1) + '万粉' : followerCount + ' 粉';
        return `${formattedFollowers} / ${answerCount} 答 = ${ratio}`;
    }

    function shouldShowAnswer(answerData) {
        if (filters.onlyExperts && (answerData.followers / answerData.answers_count) < 10 ) return false;
        if (filters.onlyHighLikes && answerData.likes_percentile <= 80) return false;
        if (filters.onlyHotComments && answerData.comments_percentile <= 80) return false;
        return true;
    }

    function applyFilters() {
        allLoadedAnswers.forEach(answer => {
            const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${answer.answerId}"]`);
            if (listItem) listItem.style.display = shouldShowAnswer(answer) ? 'flex' : 'none';
        });
    }

    function updateAllAnswerStats() {
        const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
        const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
        const words_list = allLoadedAnswers.map(ans => ans.wordCount);
        const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
        const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

        allLoadedAnswers.forEach(ans => {
            ans.likes_percentile = calculate_percentile(ans.upvoteNum, likes_list);
            ans.comments_percentile = calculate_percentile(ans.commentNum, comments_list);
            ans.words_percentile = calculate_percentile(ans.wordCount, words_list);
            ans.followers_percentile = calculate_percentile(ans.followers || 0, followers_list);
            ans.answers_percentile = calculate_percentile(ans.answers_count || 0, answers_count_list);

            const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${ans.answerId}"]`);
            if (listItem) {
                const upvoteText = ans.likes_percentile > 80 ? '<span class="stats-highlight high-likes">赞</span>' : '赞';
                const commentText = ans.comments_percentile > 80 ? '<span class="stats-highlight hot-comments">评</span>' : '评';
                const wordText = ans.words_percentile > 80 ? '<span class="stats-highlight long-article">长</span>' : '字';
                const statsDiv = listItem.querySelector('.ctz-answer-list-stats');
                if (statsDiv) statsDiv.innerHTML = `${ans.upvoteNum} ${upvoteText} · ${ans.commentNum} ${commentText} · ${ans.wordCount} ${wordText}`;
                updateLabel(ans.answerId);
            }
        });
    }

    function formatTimeAgo(publishTime) {
        // 提取日期字符串（去除"发布于 "前缀）
        const timeStr = publishTime.replace('发布于 ', '').replace('编辑于 ', '');
        const publishDate = new Date(timeStr);
        const now = new Date();

        // 计算时间差（毫秒）
        const diffMs = now - publishDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        // 根据规则返回格式化字符串
        if (diffYears >= 1) {
            return `${diffYears}年前`;
        } else if (diffMonths >= 1) {
            return `${diffMonths}个月前`;
        } else {
            return ''; // 小于1个月不显示
        }
    }

    function updateLabel(answerId) {
        const labelSpan = document.querySelector(`#label-${answerId}`);
        const answerData = allLoadedAnswers.find(ans => ans.answerId === answerId);
        if (!labelSpan || !answerData) return;

        const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
        const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
        const words_list = allLoadedAnswers.map(ans => ans.wordCount);
        const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
        const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

        const percentile_data = {
            likes_percentile: calculate_percentile(answerData.upvoteNum, likes_list),
            comments_percentile: calculate_percentile(answerData.commentNum, comments_list),
            words_percentile: calculate_percentile(answerData.wordCount, words_list),
            followers_percentile: calculate_percentile(answerData.followers || 0, followers_list),
            answers_percentile: calculate_percentile(answerData.answers_count || 0, answers_count_list)
        };
        labelSpan.innerHTML = generate_label(answerData, percentile_data);
    }

    const recalculateAllLabels = debounce(() => {
        allLoadedAnswers.forEach(ans => updateLabel(ans.answerId));
    }, 500);

    function showApiKeyConfig() {
        const apiKey = prompt("请输入您的DeepSeek API Key：");
        if (apiKey && apiKey.trim()) {
            GM_setValue('deepseek_api_key', apiKey.trim());
            GM_notification({ text: "配置成功", timeout: 3000 });
        }
    }

    function getApiKey() {
        let apiKey = GM_getValue('deepseek_api_key');
        if (!apiKey) { showApiKeyConfig(); return null; }
        return apiKey;
    }

    async function analyzeWithDeepSeek(answerContent, questionTitle) {
        const apiKey = getApiKey();
        if (!apiKey) return null;

        const prompt = `你是一个擅长提炼知乎回答核心观点的助手，请对以下内容执行以下任务：
1. 用一句话概括回答的核心内容（保留关键信息，如观点、结论或解决方案）；
2. 对回答的价值/质量进行言简意赅的点评（如"逻辑清晰，案例具体""观点新颖但缺乏数据支撑"等，避免主观情绪；如果主要观点存在明显逻辑错误的，也需要指出）；
3. 从以下标签列表中选择最匹配的1-3个标签，标注回答的内容类型（标签需严格来自列表，不得自行创造）：
干货、技术贴、深度观点、文献考据、经历叙事、生活经验、讲故事、玩梗、段子、创意娱乐、情感共鸣、情绪宣泄、视觉呈现、争议解构、引流、卖课、答非所问。
4. 如果结尾处有卖货、引流、店铺等这样的类似词汇、话术或疑似链接，则标记为“卖课”或“引流”的标签；
输出格式严格遵循：
【一句话总结】：[总结内容]
【点评】：[点评内容]
【标签】：[标签1, 标签2, ...]

原问题：${questionTitle}
输入内容（知乎回答）：${answerContent}`;

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                    temperature: 0.3,
                    max_tokens: 500
                })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API Error:', error);
            GM_notification({ text: `API调用失败: ${error.message}`, timeout: 5000 });
            return null;
        }
    }

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

    function showAIResult(listItem, result) {
        if (!result) return;
        const existingResult = listItem.querySelector('.ctz-ai-result');
        if (existingResult) existingResult.remove();

        const resultContainer = document.createElement('div');
        resultContainer.className = 'ctz-ai-result';
        resultContainer.innerHTML = `<div class="summary">${result.summary}</div><div class="review">${result.review}</div><div class="tags">${result.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`;
        listItem.appendChild(resultContainer);
    }

    function handleScrollHighlight() {
        if (scrollHighlightTimeout) clearTimeout(scrollHighlightTimeout);
        scrollHighlightTimeout = setTimeout(() => {
            const answers = document.querySelectorAll('.ContentItem.AnswerItem');
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let closestAnswer = null; let minDistance = Infinity;

            answers.forEach(answer => {
                const answerId = answer.getAttribute('name') || (answer.dataset.zop ? JSON.parse(answer.dataset.zop)?.itemId : null);
                if (!answerId) return;
                const rect = answer.getBoundingClientRect();
                const answerTop = rect.top + window.scrollY;
                const distance = Math.abs(scrollPosition - answerTop);
                if (distance < minDistance) { minDistance = distance; closestAnswer = answerId; }
            });

            document.querySelectorAll('.ctz-answer-list-item').forEach(item => item.classList.remove('ctz-list-item-highlight'));
            if (closestAnswer) {
                const listItem = document.querySelector(`.ctz-answer-list-item[data-answer-id="${closestAnswer}"]`);
                if (listItem) listItem.classList.add('ctz-list-item-highlight');
            }
        }, 100);
    }

    // ==========================================
    // 3. DOM监听
    // ==========================================
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('.HotSearchCard') || node.matches('.css-2pfapc') || node.matches('.KfeCollection-CreateSaltCard')) {
                        node.style.display = 'none';
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ==========================================
    // 4. 核心逻辑
    // ==========================================
    function initializeScript() {
        if (document.querySelector('.ctz-answer-list-card')) { console.log('脚本已初始化'); return; }

        if (scrollInterval) clearInterval(scrollInterval);
        isLoading = false;
        allLoadedAnswers = [];
        processedIds.clear();
        currentLoadedCount = 0;
        totalAnswers = 0;

        const sideColumn = document.querySelector('.Question-sideColumn');
        if (!sideColumn) return;

        const totalAnswersElement = document.querySelector('.List-headerText span');
        if (totalAnswersElement) {
            const match = totalAnswersElement.textContent.match(/(\d[\d,]*)/);
            totalAnswers = match ? parseInt(match[0].replace(/,/g, '')) : 0;
        }

        const answerListCard = document.createElement('div');
        answerListCard.className = 'Card ctz-answer-list-card';
        answerListCard.innerHTML = `
            <div class="Card-header">
                <div class="Card-headerText">知乎火眼</div>
                <span class="progress-text">${totalAnswers > 0 ? '0/' + totalAnswers : '计算中...'}</span>
            </div>
            <div class="ctz-toolbar">
                <button class="ctz-config-btn" title="配置DeepSeek API">⚙️</button>
                <div style="display:flex; gap:5px;">
                    <button class="load-more-btn">更多</button>
                    <button class="ai-compare-btn">AI对比</button>
                </div>
                <div class="ctz-filter-options">
                    <label class="ctz-filter-checkbox"><input type="checkbox" id="only-experts"> 大牛</label>
                    <label class="ctz-filter-checkbox"><input type="checkbox" id="only-high-likes">高赞</label>
                    <label class="ctz-filter-checkbox"><input type="checkbox" id="only-hot-comments"> 热评</label>
                </div>
            </div>
            <div id="ctz-compare-container" style="display:none;"></div>
            <div class="Card-section">
                <ul class="ctz-answer-list"></ul>
            </div>
        `;
        sideColumn.appendChild(answerListCard);

        answerListCard.querySelector('.ctz-config-btn').addEventListener('click', showApiKeyConfig);

        const bindFilter = (id, key) => {
            answerListCard.querySelector(`#${id}`).addEventListener('change', function() {
                filters[key] = this.checked;
                applyFilters();
            });
        };
        bindFilter('only-experts', 'onlyExperts');
        bindFilter('only-high-likes', 'onlyHighLikes');
        bindFilter('only-hot-comments', 'onlyHotComments');

        const aiCompareBtn = answerListCard.querySelector('.ai-compare-btn');
        aiCompareBtn.addEventListener('click', runAICompare);

        window.addEventListener('scroll', handleScrollHighlight);
        window.addEventListener('resize', handleScrollHighlight);
        setTimeout(handleScrollHighlight, 1000);

        function updateProgress() {
            const progressText = document.querySelector('.progress-text');
            if (progressText) progressText.textContent = `${currentLoadedCount}/${totalAnswers || '?'}`;
        }

        function scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        function loadMoreAnswers() {
            if (isLoading) return;
            isLoading = true;
            const loadMoreBtn = document.querySelector('.load-more-btn');
            if (loadMoreBtn) { loadMoreBtn.textContent = '加载中...'; loadMoreBtn.classList.add('loading'); }

            let lastHeight = 0;
            scrollInterval = setInterval(() => {
                scrollToBottom();
                setTimeout(() => {
                    const currentHeight = document.body.scrollHeight;
                    if (currentHeight === lastHeight) {
                        clearInterval(scrollInterval);
                        scrollInterval = null;
                        isLoading = false;
                        if (loadMoreBtn) { loadMoreBtn.textContent = '加载更多'; loadMoreBtn.classList.remove('loading'); }
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
            const newAnswersData = [];

            answers.forEach(answer => {
                const answerId = answer.getAttribute('name') || (answer.dataset.zop ? JSON.parse(answer.dataset.zop)?.itemId : null);
                if (!answerId || processedIds.has(answerId)) return;
                processedIds.add(answerId);

                const userLink = answer.querySelector('.UserLink-link');
                const userNameMeta = answer.querySelector('meta[itemprop="name"]');
                const userName = userNameMeta?.content || answer.querySelector('.AuthorInfo-name')?.textContent?.trim() || '未知用户';
                const userIdToken = userLink ? userLink.getAttribute('href').split('/people/')[1] : null;

                let upvoteNum = 0, commentNum = 0;
                try {
                    const cardData = JSON.parse(answer.getAttribute('data-za-extra-module') || '{}');
                    upvoteNum = cardData?.card?.content?.upvote_num || 0;
                    commentNum = cardData?.card?.content?.comment_num || 0;
                } catch (e) { /* ignore */ }

                let wordCount = 0;
                const contentElement = answer.querySelector('.RichContent-inner');
                if (contentElement) wordCount = contentElement.textContent.replace(/\s/g, '').length;
                /*
                const answerData = {
                    answerId, userName, userIdToken, upvoteNum, commentNum, wordCount,
                    followers: 0, answers_count: 0,
                    likes_percentile: 0, comments_percentile: 0, words_percentile: 0
                };
*/


                // 【新增】提取日期信息
                const timeElement = answer.querySelector('.ContentItem-time');
                const rawTime = timeElement ? timeElement.textContent.trim() : '未知时间';
                const displayTime = formatTimeAgo(rawTime); // 调用格式化函数

                const answerData = {
                    answerId, userName, userIdToken, upvoteNum, commentNum, wordCount,
                    publishTime: displayTime, // 存储格式化后的时间
                    followers: 0, answers_count: 0,
                    likes_percentile: 0, comments_percentile: 0, words_percentile: 0
                };






                newAnswersData.push(answerData);
                allLoadedAnswers.push(answerData);
            });

            if (newAnswersData.length > 0) {
                const likes_list = allLoadedAnswers.map(ans => ans.upvoteNum);
                const comments_list = allLoadedAnswers.map(ans => ans.commentNum);
                const words_list = allLoadedAnswers.map(ans => ans.wordCount);
                const followers_list = allLoadedAnswers.map(ans => ans.followers || 0);
                const answers_count_list = allLoadedAnswers.map(ans => ans.answers_count || 0);

                allLoadedAnswers.forEach(ans => {
                    ans.likes_percentile = calculate_percentile(ans.upvoteNum, likes_list);
                    ans.comments_percentile = calculate_percentile(ans.commentNum, comments_list);
                    ans.words_percentile = calculate_percentile(ans.wordCount, words_list);
                    ans.followers_percentile = calculate_percentile(ans.followers || 0, followers_list);
                    ans.answers_percentile = calculate_percentile(ans.answers_count || 0, answers_count_list);
                });
            }

            if (newAnswersData.length > 0) {
                newAnswersData.forEach(ans => {
                    const shouldShow = shouldShowAnswer(ans);
                    const upvoteText = ans.likes_percentile > 80 ? '<span class="stats-highlight high-likes">赞</span>' : '赞';
                    const commentText = ans.comments_percentile > 80 ? '<span class="stats-highlight hot-comments">评</span>' : '评';
                    const wordText = ans.words_percentile > 80 ? '<span class="stats-highlight long-article">长</span>' : '字';

                    const listItem = document.createElement('li');
                    listItem.className = 'ctz-answer-list-item';
                    listItem.setAttribute('data-answer-id', ans.answerId);
                    listItem.style.display = shouldShow ? 'flex' : 'none';

                    listItem.innerHTML = `
                        <div class="ctz-user-block" title="点击跳转到该回答">
                            <div class="ctz-user-name-container">

                                <span class="ctz-user-name">${ans.userName}</span>

                                ${ans.publishTime ? `<span class="ctz-answer-date">${ans.publishTime}</span>` : ''}


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

                    const userBlock = listItem.querySelector('.ctz-user-block');
                    userBlock.addEventListener('click', () => scrollToAnswer(ans.answerId));

                    const askAiBtn = listItem.querySelector('.ask-ai-btn');
                    askAiBtn.addEventListener('click', async function(e) {
                        e.stopPropagation();
                        if (aiAnalysisCache.has(ans.answerId)) { showAIResult(listItem, aiAnalysisCache.get(ans.answerId)); return; }
                        if (this.classList.contains('loading')) return;
                        this.classList.add('loading'); this.textContent = '分析中...';

                        const answer = document.querySelector(`.ContentItem.AnswerItem[name="${ans.answerId}"]`);
                        if (!answer) { this.classList.remove('loading'); this.textContent = '问AI'; return; }

                        const content = answer.querySelector('.RichContent-inner').textContent;
                        const question = document.querySelector('.QuestionHeader-title')?.textContent || '未知问题';
                        const analysisResult = await analyzeWithDeepSeek(content, question);
                        const parsedResult = parseAIResult(analysisResult);
                        if (parsedResult) { aiAnalysisCache.set(ans.answerId, parsedResult); showAIResult(listItem, parsedResult); }
                        this.classList.remove('loading'); this.textContent = '问AI';
                    });

                    if (ans.userIdToken) {
                        if (userInfoCache.has(ans.userIdToken)) {
                            const info = userInfoCache.get(ans.userIdToken);
                            updateUserMeta(ans.answerId, info);
                            const globalData = allLoadedAnswers.find(d => d.answerId === ans.answerId);
                            if (globalData && info) { globalData.followers = info.follower_count || 0; globalData.answers_count = info.answer_count || 0; }
                            updateLabel(ans.answerId);
                        } else {
                            fetchUserInfo(ans.userIdToken).then(userInfo => {
                                if (userInfo) {
                                    userInfoCache.set(ans.userIdToken, userInfo);
                                    updateUserMeta(ans.answerId, userInfo);
                                    const globalData = allLoadedAnswers.find(d => d.answerId === ans.answerId);
                                    if (globalData) { globalData.followers = userInfo.follower_count || 0; globalData.answers_count = userInfo.answer_count || 0; }
                                    recalculateAllLabels();
                                }
                            });
                        }
                    } else { updateUserMeta(ans.answerId, null); }
                });
            }
            if (newAnswersData.length > 0) updateAllAnswerStats();
        }

        function updateUserMeta(answerId, userInfo) {
            const metaSpan = document.querySelector(`#meta-${answerId}`);
            if (metaSpan) metaSpan.textContent = formatUserInfo(userInfo);
        }

        renderAnswerList();
        const answerObserver = new MutationObserver(() => { renderAnswerList(); });
        const answersContainer = document.querySelector('#QuestionAnswers-answers');
        if (answersContainer) answerObserver.observe(answersContainer, { childList: true, subtree: true });

        document.querySelector('.load-more-btn').addEventListener('click', loadMoreAnswers);
    }

    // ==========================================
    // 5. AI 对比逻辑 (方案 A：折叠面板)
    // ==========================================
    async function runAICompare() {
        if (allLoadedAnswers.length === 0) {
            GM_notification({ text: '请先加载一些回答', timeout: 3000 });
            return;
        }

        const btn = document.querySelector('.ai-compare-btn');
        const resultContainer = document.querySelector('#ctz-compare-container');

        if (btn.classList.contains('loading')) return;

        btn.classList.add('loading');
        btn.textContent = '分析中...';
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';

        try {
            // 1. 策略：选取点赞最多的前10个回答进行对比
            const sortedAnswers = [...allLoadedAnswers].sort((a, b) => b.upvoteNum - a.upvoteNum).slice(0, 10);

            // 2. 提取内容
            let answersText = "";
            sortedAnswers.forEach((ans, index) => {
                const dom = document.querySelector(`.ContentItem.AnswerItem[name="${ans.answerId}"]`);
                const content = dom ? dom.querySelector('.RichContent-inner')?.textContent : "";
                // 截取前500字以节省空间，如果未截取则不加省略号
                const snippet = content.length > 500 ? content.substring(0, 500) + "..." : content;
                answersText += `${index + 1}. 用户：${ans.userName}\n内容：${snippet}\n\n`;
            });

            const question = document.querySelector('.QuestionHeader-title')?.textContent || "未知问题";

            // 3. Prompt 设计 (方案 B：结构化输出)
            const prompt = `你是一个客观的辩论分析师。请对比分析以下关于“${question}”的知乎高赞回答。

回答列表：
${answersText}

请从以下三个维度进行分析，输出要求如下：
1. **不要使用Markdown格式**（如#、*、-等），仅使用纯文本。
2. 必须严格按照下方“【】”标题分隔符输出。

输出格式模板：

【核心共识】
在这里写这些回答中大家都认同的观点或事实。

【主要分歧】
1. 观点A：...
2. 观点B：...

【亮点观点】
- [用户名] 观点内容...

要求：共识简明扼要，分歧条理清晰，亮点观点请务必使用 "- [用户名] 内容" 的格式。`;

            // 4. 调用 API
            const apiKey = getApiKey();
            if (!apiKey) { throw new Error("未配置API Key"); }

            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                    temperature: 0.5,
                    max_tokens: 1000
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const rawText = data.choices[0].message.content;

            // 5. 解析与渲染 (方案 B：正则拆分 + 方案 A：折叠结构)
            // 提取三个板块
            const consensusMatch = rawText.match(/【核心共识】([\s\S]*?)(?=【主要分歧】|$)/);
            const diffMatch = rawText.match(/【主要分歧】([\s\S]*?)(?=【亮点观点】|$)/);
            const highlightMatch = rawText.match(/【亮点观点】([\s\S]*)/);

            const consensus = consensusMatch ? consensusMatch[1].trim() : "暂无明显共识";
            const diff = diffMatch ? diffMatch[1].trim() : "暂无明显分歧";
            let highlights = highlightMatch ? highlightMatch[1].trim() : "";

            // 处理亮点区域：将 "- [用户] 内容" 转换为 HTML 卡片
            let highlightHTML = "";
            if (highlights) {
                // 按行分割
                const lines = highlights.split('\n');
                highlightHTML = lines.map(line => {
                    // 匹配格式：- [用户名] 内容
                    const match = line.match(/- \[(.*?)\]\s*(.*)/);
                    if (match) {
                        return `<div class="highlight-item"><span class="highlight-user">@${match[1]}</span>${match[2]}</div>`;
                    } else {
                        // 如果不匹配格式，直接显示文本
                        return `<div class="highlight-item">${line}</div>`;
                    }
                }).join('');
            }

            // 组装最终 HTML (包含折叠结构)
            const finalHTML = `
                <h4 class="ctz-compare-header">
                    <span>AI 全局对比 (Top ${sortedAnswers.length})</span>
                    <span class="arrow">▼</span>
                </h4>
                <div class="ctz-compare-content">
                    <div class="compare-section compare-consensus">
                        <span class="compare-label">📌 核心共识</span>
                        <div>${consensus}</div>
                    </div>

                    <div class="compare-section compare-difference">
                        <span class="compare-label">⚔️ 主要分歧</span>
                        <ul class="compare-diff-list">
                            <li>${diff.replace(/\n/g, '</li><li>')}</li>
                        </ul>
                    </div>

                    <div class="compare-section compare-highlight">
                        <span class="compare-label">💡 亮点观点</span>
                        <div>${highlightHTML}</div>
                    </div>
                </div>
            `;

            resultContainer.innerHTML = finalHTML;
            resultContainer.style.display = 'block';

            // 添加折叠点击事件
            const header = resultContainer.querySelector('.ctz-compare-header');
            header.addEventListener('click', () => {
                resultContainer.classList.toggle('collapsed');
            });

        } catch (error) {
            console.error(error);
            GM_notification({ text: `对比失败: ${error.message}`, timeout: 5000 });
            resultContainer.innerHTML = `<div style="color:red; text-align:center; padding:10px;">分析失败<br>请检查API Key或网络</div>`;
            resultContainer.style.display = 'block';
        } finally {
            btn.classList.remove('loading');
            btn.textContent = 'AI对比';
        }
    }

    // ==========================================
    // 6. 启动
    // ==========================================
    window.addEventListener('load', initializeScript);
    let checkInterval = setInterval(() => {
        const isQuestionPage = window.location.pathname.includes('/question/');
        const sideColumnExists = document.querySelector('.Question-sideColumn');
        const cardExists = document.querySelector('.ctz-answer-list-card');
        if (isQuestionPage && sideColumnExists && !cardExists) initializeScript();
    }, 1000);
    window.addEventListener('beforeunload', () => clearInterval(checkInterval));

})();
