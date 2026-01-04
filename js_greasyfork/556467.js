// ==UserScript==
// @name         Bangumi 追番进度报告生成器
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  一键生成中文追番进度报告，显示详细信息
// @author       Mewtw0
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        http://bgm.tv/*
// @match        http://bangumi.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      api.bgm.tv
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556467/Bangumi%20%E8%BF%BD%E7%95%AA%E8%BF%9B%E5%BA%A6%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556467/Bangumi%20%E8%BF%BD%E7%95%AA%E8%BF%9B%E5%BA%A6%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加支持黑暗模式的样式
    const style = `
          /* 主要容器 */
          #headerProfile .navTabsWrapper {
              border-radius: 18px;
              margin-left: -15px;
              margin-right: 4px;
              margin-bottom: -10px;
          }

    /* 导航标签本身 */
    #headerProfile .navTabs {
        border-radius: 18px;
        margin-left: 15px;
        margin-right: 4px;
        margin-bottom: 10px;
    }

    /* 导航标签内的列表项 */
    #headerProfile .navTabs li {
        border-radius: 6px;

    }

    /* 第一个列表项 */
    #headerProfile .navTabs li:first-child {
        border-radius: 8px 0 0 8px;
    }

    /* 最后一个列表项 */
    #headerProfile .navTabs li:last-child {
        border-radius: 0 8px 8px 0;
    }


    .bangumi-report-container {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    padding: 20px;
    position: fixed; /* 改为固定定位 */
    left: 0px; /* 初始位置 */
    top: 58px; /* 初始位置 */
    width: 300px; /* 固定宽度 */
    box-shadow:
        0 4px 20px rgba(0,0,0,0.08),
        0 2px 8px rgba(0,0,0,0.03),
        inset 0 1px 0 rgba(255,255,255,0.5);
    border: 1px solid rgba(240, 145, 153, 0.15);
    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #2c3e50;
    overflow-y: auto; /* 确保垂直方向可滚动 */
    overflow-x: hidden; /* 水平方向隐藏滚动条 */
    backdrop-filter: blur(8px) saturate(140%); /* 增强毛玻璃和饱和度 */
    z-index: 10000; /* 确保在最上层 */
    cursor: default; /* 默认光标 */
    resize: none; /* 移除resize，我们用JS控制 */
    scrollbar-width: none;
    -ms-overflow-style: none;
    max-height: calc(80vh - 60px); /* 计算可用高度 */;
}

    .bangumi-report-content::-webkit-scrollbar {
        display: none;
    }

    /* 悬停时显示滚动条 */
    .bangumi-report-content:hover::-webkit-scrollbar {
        display: block;
        width: 6px;
    }

    .bangumi-report-content:hover::-webkit-scrollbar-thumb {
        background: rgba(240, 145, 153, 0.3);
        border-radius: 3px;
    }

    /* 专门的拖拽手柄 */
    .bangumi-drag-handle {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(135deg, rgba(240, 145, 153, 0.1) 0%, rgba(240, 145, 153, 0.05) 100%);
        border-radius: 25px 25px 0 0;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(240, 145, 153, 0.6);
        font-size: 18px;
        letter-spacing: 4px;
        z-index: 10001;
    }

    .bangumi-drag-handle::before {
        font-size: 18px;
        letter-spacing: 2px;
    }

        .bangumi-report-title {
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #2c3e50;
            border-bottom: 2px solid rgba(240, 145, 153, 0.2);
            padding-bottom: 12px;
            letter-spacing: 0.5px;
            position: relative;
        }

    .bangumi-report-content {
        white-space: pre-wrap;
        font-family: 'Microsoft YaHei', 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        line-height: 1.7;
        background: rgba(248, 249, 250, 0.5);
        padding: 16px;
        border-radius: 25px;
        border: 1px solid rgba(240, 145, 153, 0.1);
        margin: 8px -1px;
        box-sizing: border-box; /* 确保内边距包含在宽度内 */
        overflow-wrap: break-word; /* 允许在单词内换行 */
        word-break: keep-all; /* 保持中文不断行 */
        margin-top: 20px; /* 为拖拽手柄留出空间 */
        max-height: calc(80vh - 60px); /* 计算可用高度 */
        overflow-y: auto;
    }

    .bangumi-report-btn {
        background: linear-gradient(135deg, #f09199 0%, #e87a83 100%);
        color: white;
        border: none;
        padding: 10px 24px; /* 增加内边距，提供更多空间 */
        border-radius: 25px;
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 10px; /* 稍微增大字体 */
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(92, 184, 92, 0.3);
        white-space: nowrap; /* 防止按钮文字换行 */
        min-width: 140px; /* 设置最小宽度确保按钮足够宽 */
        display: inline-block; /* 确保宽度生效 */
    }

    .bangumi-report-btn:hover {
        background: linear-gradient(135deg, #e87a83 0%, #df6a74 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(240, 145, 153, 0.4);
    }

    .bangumi-report-actions {
        text-align: center;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(240, 145, 153, 0.15);
    }

    .bangumi-report-loading {
        text-align: center;
        padding: 30px 20px;
        color: #666;
        font-size: 14px;
        background: rgba(248, 249, 250, 0.8);
        border-radius: 12px;
        margin: 10px 0;
    }

    /* 黑暗模式样式 - 优化版 */
    html[data-theme="dark"] .bangumi-report-container,
    body.dark-mode .bangumi-report-container,
        .bangumi-report-container.dark-mode {
            background: rgba(20, 20, 20, 0.65);
            border: 1px solid rgba(240, 145, 153, 0.2);
            color: #e8e6e3;
            box-shadow:
                0 4px 20px rgba(0,0,0,0.4),
                0 2px 8px rgba(0,0,0,0.2);
            backdrop-filter: blur(8px) saturate(140%);
            max-height: calc(80vh - 60px); /* 计算可用高度 */;
        }

    [data-theme="dark"] .bangumi-report-title,
        .bangumi-report-container.dark-mode .bangumi-report-title {
            color: #e8e6e3;
            border-bottom-color: rgba(240, 145, 153, 0.3);
        }

    [data-theme="dark"] .bangumi-report-content,
        .bangumi-report-container.dark-mode .bangumi-report-content {
            color: #e8e6e3;
            background: rgba(40, 40, 40, 0.6);
            border: 1px solid rgba(240, 145, 153, 0.15);
        }

    [data-theme="dark"] .bangumi-report-actions,
        .bangumi-report-container.dark-mode .bangumi-report-actions {
            border-top-color: rgba(240, 145, 153, 0.2);
        }

    [data-theme="dark"] .bangumi-report-btn,
        .bangumi-report-container.dark-mode .bangumi-report-copy-btn {
            background: linear-gradient(135deg, #f09199 0%, #e87a83 100%);
            box-shadow: 0 2px 8px rgba(240, 145, 153, 0.3);
        }

    [data-theme="dark"] .bangumi-report-btn:hover,
        .bangumi-report-container.dark-mode .bangumi-report-copy-btn:hover {
            background: linear-gradient(135deg, #e87a83 0%, #df6a74 100%);
            box-shadow: 0 4px 12px rgba(240, 145, 153, 0.4);
        }

    /* 响应式调整 - 优化版 */
    @media (max-width: 768px) {
        .bangumi-report-container {
            margin: 15px 10px;
            padding: 16px;
            border-radius: 12px;
        }

        .bangumi-report-content {
            padding: 12px;
            font-size: 12px;
        }

        .bangumi-report-title {
            font-size: 16px;
        }

        /* 移动端按钮调整 */
        .bangumi-report-btn {
            padding: 8px 20px;
            font-size: 13px;
            min-width: 120px;
        }
    }
    /* 报告页脚样式 - 简洁优化版 */
.report-footer {
    text-align: center;
    margin-top: 20px;
    padding: 16px 12px;
    white-space: pre-wrap;
    font-family: 'Microsoft YaHei', 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.8;
    background: rgba(240, 145, 153, 0.05);
    border-radius: 25px;
}

/* 黑暗模式适配 */
[data-theme="dark"] .report-footer,
.bangumi-report-container.dark-mode .report-footer {
    background: rgba(240, 145, 153, 0.08);
    border-top-color: rgba(240, 145, 153, 0.4);
}
    `;

    // 使用 GM_addStyle 或创建 style 元素
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(style);
    } else {
        const styleElement = document.createElement("style");
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }

    // 主函数
    function initBangumiReporter() {
        // 获取当前用户ID
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.log('未找到当前用户信息');
            return;
        }

        // 添加生成报告按钮
        addReportButton(currentUser);
    }

    // 获取当前用户ID
    function getCurrentUser() {
        // 从URL获取用户ID
        const urlMatch = window.location.pathname.match(/\/user\/([^\/]+)/);
        if (urlMatch) {
            return urlMatch[1];
        }

        // 从页面元素获取
        const userLink = document.querySelector('.idBadgerNeue a[href^="/user/"]');
        if (userLink) {
            const match = userLink.getAttribute('href').match(/\/user\/([^\/]+)/);
            if (match) return match[1];
        }

        return null;
    }

    // 获取用户名
    function getUsername() {
        // 从页面元素获取用户名
        const nameElement = document.querySelector('.nameSingle .name a, .headerAvatar + .inner .name a');
        if (nameElement) {
            return nameElement.textContent.trim();
        }

        // 从URL获取用户ID作为备选
        const userMatch = window.location.pathname.match(/\/user\/([^\/]+)/);
        return userMatch ? userMatch[1] : '用户';
    }

    // 检测黑暗模式
    function isDarkMode() {
        // 检查 html 元素的 data-theme 属性
        const html = document.documentElement;
        const theme = html.getAttribute('data-theme');

        // Bangumi 的黑暗模式
        if (theme === 'dark') {
            return true;
        }

        // 如果明确设置了光亮模式，返回 false
        if (theme === 'light' || theme === 'white') {
            return false;
        }

        // 检查其他可能的黑暗模式标识
        if (html.classList.contains('dark') ||
            html.classList.contains('dark-mode') ||
            document.body.classList.contains('dark') ||
            document.body.classList.contains('dark-mode')||
            document.querySelector('body.dark')) {
            return true;
        }

        // 检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        return false;
    }

    // 添加生成报告按钮 - 优化位置
    function addReportButton(userId) {
        // 先移除可能存在的旧按钮
        const oldBtn = document.querySelector('.bangumi-report-btn');
        if (oldBtn) oldBtn.remove();

        // 方案1：添加到导航标签区域（最佳位置）
        const navTabs = document.querySelector('.navTabsWrapper, .navTabs');
        if (navTabs) {
            const btn = createReportButton(userId);
            // 插入到导航标签的合适位置
            navTabs.appendChild(btn);
            return;
        }

        // 方案2：添加到用户信息区域
        const userHeader = document.querySelector('.headerContainer, #headerProfile');
        if (userHeader) {
            const btn = createReportButton(userId);
            // 插入到用户名的旁边
            const nameElement = userHeader.querySelector('.name, .nameSingle');
            if (nameElement) {
                nameElement.parentNode.insertBefore(btn, nameElement.nextSibling);
            } else {
                userHeader.appendChild(btn);
            }
            return;
        }

        // 方案3：添加到主要内容区域顶部
        const mainWrapper = document.querySelector('.mainWrapper');
        if (mainWrapper) {
            const btn = createReportButton(userId);
            mainWrapper.insertBefore(btn, mainWrapper.firstChild);
        }
    }

    // 创建报告按钮
    function createReportButton(userId) {
        const btn = document.createElement('button');
        btn.className = 'bangumi-report-btn';
        btn.innerHTML = '📊 生成追番报告';
        btn.title = '一键生成当前用户的追番进度报告';
        btn.onclick = () => generateReport(userId);
        return btn;
    }

    // 生成报告

    async function generateReport(userId) {
        try {
            // 显示加载中
            const loadingElement = showLoading('正在获取追番数据...');

            // 获取用户收藏数据
            const collections = await getUserCollections(userId);

            // 获取用户名
            const username = getUsername();

            // 生成报告
            const reportData = await createChineseReport(collections, username, userId);

            // 移除加载提示
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }

            // 显示报告
            displayReport(reportData, username, userId);

        } catch (error) {
            console.error('生成报告失败:', error);
            showError('生成报告失败: ' + error.message);

            // 移除加载提示
            const loadingElement = document.querySelector('.bangumi-report-loading');
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
        }
    }

    // 添加配置常量
    const CONFIG = {
        // 最大获取动画数量，0表示无限制（获取全部），设置为12表示只获取前12部
        MAX_ANIME_COUNT: 12, // 可以修改这个值来控制获取数量
        // 请求延迟时间（毫秒）
        REQUEST_DELAY: 300
    };

    // 获取用户收藏数据 - 分页问题（已解决）支持限制获取数量
    function getUserCollections(userId) {
        return new Promise((resolve, reject) => {
            // 直接从API层面限制获取数量
            const limit = CONFIG.MAX_ANIME_COUNT;

            console.log(`正在获取前 ${limit} 部追番数据...`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/users/${userId}/collections?subject_type=2&type=3&limit=${limit}`,
                headers: {
                    'User-Agent': 'BangumiReport/1.0 (https://bgm.tv)'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        console.log(`成功获取 ${data.data.length} 条追番记录`);

                        resolve({
                            data: data.data,
                            total: data.data.length,
                            limit: data.limit,
                            offset: data.offset
                        });
                    } else {
                        reject(new Error(`API请求失败: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }



    // 在 generateReport 函数中更新提示信息
    async function generateReport(userId) {
        try {
            // 显示加载中
            const loadingElement = showLoading(`正在获取前 ${CONFIG.MAX_ANIME_COUNT} 部追番数据...`);

            // 获取用户收藏数据
            const collections = await getUserCollections(userId);

            console.log('获取到的收藏数据:', collections);
            console.log(`成功获取 ${collections.total} 部动画数据`);

            // 获取用户名
            const username = getUsername();

            // 生成报告
            const report = await createChineseReport(collections, username, userId);

            // 移除加载提示
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }

            // 显示报告
            displayReport(report, username, userId);

        } catch (error) {
            console.error('生成报告失败:', error);
            showError('生成报告失败: ' + error.message);

            // 移除加载提示
            const loadingElement = document.querySelector('.bangumi-report-loading');
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
        }
    }

    // 获取动画详细信息
    function getSubjectDetail(subjectId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/subjects/${subjectId}`,
                headers: {
                    'User-Agent': 'BangumiReport/1.0 (https://bgm.tv)'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } else {
                        // 即使获取详细信息失败，也不影响主流程
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    // 即使获取详细信息失败，也不影响主流程
                    resolve(null);
                }
            });
        });
    }

    // 获取动画制作人员信息 - 修复版本
    function getSubjectPersons(subjectId, retryCount = 0) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/subjects/${subjectId}/persons`,
                headers: {
                    'User-Agent': 'BangumiReport/1.0 (https://bgm.tv)',
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            // 修复：API直接返回数组，不是包含data字段的对象
                            if (Array.isArray(data)) {
                                resolve(data); // 直接返回数组
                            } else if (data.data && Array.isArray(data.data)) {
                                resolve(data.data); // 返回data字段的数组
                            } else {
                                resolve([]);
                            }
                        } catch (e) {
                            if (retryCount < 2) {
                                setTimeout(() => {
                                    resolve(getSubjectPersons(subjectId, retryCount + 1));
                                }, 1000 * (retryCount + 1));
                            } else {
                                resolve([]);
                            }
                        }
                    } else if (response.status === 429) {
                        setTimeout(() => {
                            resolve(getSubjectPersons(subjectId, retryCount + 1));
                        }, 3000);
                    } else {
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    if (retryCount < 2) {
                        setTimeout(() => {
                            resolve(getSubjectPersons(subjectId, retryCount + 1));
                        }, 1000 * (retryCount + 1));
                    } else {
                        resolve([]);
                    }
                },
                timeout: 15000
            });
        });
    }

    // 格式化数字（添加千位分隔符）
    function formatNumber(num) {
        if (typeof num !== 'number') return '未知';
        return num.toLocaleString('zh-CN');
    }

    // 格式化时间戳 - 新增函数
    function formatTimestamp(timestamp) {
        if (!timestamp) return '未知';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/\//g, '-');
        } catch (e) {
            return timestamp;
        }
    }
    // 计算评分分布和用户鉴定 - 修正版本（只使用作品平均分）
    function calculateRatingStats(data) {
        const watching = data.data.filter(item => item.type === 3);

        console.log('正在分析作品评分数据...', watching.map(item => ({
            id: item.subject_id,
            name: item.subject.name_cn || item.subject.name,
            score: item.subject?.score
        })));

        // 只考虑有作品平均分的动画
        const ratedAnime = watching.filter(item => {
            return item.subject?.score > 0;
        });

        console.log(`有作品评分的动画: ${ratedAnime.length}部`);

        if (ratedAnime.length === 0) {
            return {
                statsText: "📊 评分分布统计\n   暂无作品评分数据\n",
                userRank: ""
            };
        }

        // 初始化评分分布
        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
            6: 0, 7: 0, 8: 0, 9: 0, 10: 0
        };

        // 统计评分分布 - 只使用作品平均分
        ratedAnime.forEach(item => {
            if (item.subject?.score > 0) {
                const score = Math.floor(item.subject.score); // 取整数部分
                if (score >= 1 && score <= 10) {
                    ratingDistribution[score]++;
                }
            }
        });

        console.log('作品评分分布:', ratingDistribution);

        // 计算7分以上动画数量和占比
        const highRatedCount = Object.entries(ratingDistribution)
        .filter(([score]) => parseInt(score) >= 7)
        .reduce((sum, [, count]) => sum + count, 0);

        const totalRated = ratedAnime.length;
        const highRatedPercentage = totalRated > 0 ? (highRatedCount / totalRated) * 100 : 0;

        console.log(`7分以上作品: ${highRatedCount}/${totalRated} (${highRatedPercentage}%)`);

        // 生成评分分布文本
        let statsText = "📊 评分分布统计（基于Bangumi平均分）\n";
        let hasRatings = false;

        for (let score = 1; score <= 10; score++) {
            const count = ratingDistribution[score];
            if (count > 0) {
                hasRatings = true;
                const bar = '■'.repeat(Math.max(1, Math.round(count / 2)));
                statsText += `   ${score}分: ${count}部 ${bar}\n`;
            }
        }

        if (!hasRatings) {
            return {
                statsText: "📊 评分分布统计\n   暂无作品评分数据\n",
                userRank: ""
            };
        }

        statsText += `\n   7分以上作品: ${highRatedCount}/${totalRated}部 (${highRatedPercentage.toFixed(1)}%)\n`;

        // 用户鉴定逻辑
        let userRank = "";
        if (totalRated >= 3) {
            if (highRatedPercentage >= 66.6) {
                userRank = `👑 鉴定为"婆罗门"\n   理由：${highRatedPercentage.toFixed(1)}%的追番作品评分在7分以上，品味卓越！`;
            } else if (highRatedPercentage <= 50) {
                const lowRatedPercentage = 100 - highRatedPercentage; // 计算7分以下的比例
                userRank = `🐾 鉴定为"铲屎官"\n   理由：${lowRatedPercentage.toFixed(1)}%的追番作品评分在7分以下，包容性极强！`;
            } else {
                userRank = `🌟 鉴定为"一般路过观众"\n   理由：追番作品评分分布均衡，观番体验稳定。`;
            }
        } else {
            userRank = `📝 评分数据不足，请追更多有评分的动画以获得鉴定结果。`;
        }

        return {
            statsText: statsText + "\n",
            userRank: userRank + "\n"
        };
    }
    // 创建中文报告
    async function createChineseReport(data, username, userId) {
        const watching = data.data.filter(item => item.type === 3);
        console.log(`过滤后的正在观看动画数量: ${watching.length}`);
        console.log('正在观看的动画列表:', watching.map(item => ({
            id: item.subject_id,
            name: item.subject.name,
            name_cn: item.subject.name_cn,
            ep_status: item.ep_status,
            eps: item.subject.eps
        })));

        if (watching.length === 0) {
            return `😴 ${username} 当前没有在追的番剧`;
        }
        let report = ``;
/*         let report = `${username} @${userId}\n`;
        report += `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n`; */

        // 按最后更新时间排序
        watching.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // 获取所有动画的详细信息和制作人员信息
        const subjectDetails = {};
        const subjectPersons = {};

        // 使用顺序请求避免API限制
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // 获取详细信息
        for (let i = 0; i < watching.length; i++) {
            const item = watching[i];
            subjectDetails[item.subject_id] = await getSubjectDetail(item.subject_id);
            await delay(200);
        }

        // 获取制作人员信息
        for (let i = 0; i < watching.length; i++) {
            const item = watching[i];
            subjectPersons[item.subject_id] = await getSubjectPersons(item.subject_id);
            await delay(300);
        }

        for (const item of watching) {
            const subject = item.subject;
            const subjectDetail = subjectDetails[item.subject_id];
            const personsData = subjectPersons[item.subject_id];

            // 获取评分人数
            const ratingTotal = subjectDetail && subjectDetail.rating ?
                  formatNumber(subjectDetail.rating.total) : '未知';

            // 新增：从评分分布重新计算平均分
            let calculatedScore = '未评分';
            if (subjectDetail && subjectDetail.rating && subjectDetail.rating.count) {
                const ratingCount = subjectDetail.rating.count;
                const totalVotes = subjectDetail.rating.total;

                if (totalVotes > 0) {
                    let weightedSum = 0;
                    // 计算加权总分：1分人数*1 + 2分人数*2 + ... + 10分人数*10
                    for (let score = 1; score <= 10; score++) {
                        weightedSum += score * (ratingCount[score] || 0);
                    }
                    // 计算平均分并保留4位小数
                    calculatedScore = (weightedSum / totalVotes).toFixed(4);
                    console.log(`重新计算评分: ${weightedSum} / ${totalVotes} = ${calculatedScore}`);
                }
            }

            const rank = subject.rank ? `#${subject.rank}` : '无排名';

            // 显示原名和中文名
            const originalName = subject.name;
            const chineseName = subject.name_cn;
            let displayName = originalName;

            if (chineseName && chineseName !== originalName) {
                displayName = `${originalName} = ${chineseName}`;
            }



            //             const progressBar = generateProgressBar(item.ep_status, subject.eps);
            const lastTimeModified = formatTimestamp(item.updated_at);

            // 修改后的评分处理 - 使用重新计算的平均分
            let scoreDisplay = calculatedScore;
            // 如果重新计算失败，回退到原来的逻辑
            if (calculatedScore === '未评分') {
                if (item.rate > 0) {
                    scoreDisplay = parseFloat(item.rate).toFixed(4);
                } else if (subject.score) {
                    scoreDisplay = parseFloat(subject.score).toFixed(4);
                }
            }

            // 获取动画制作信息
            // 修改动画制作信息获取逻辑，支持多个制作公司
            // 获取动画制作信息 - 新增功能
            let animationStudio = '未知';
            if (personsData && Array.isArray(personsData) && personsData.length > 0) {
                // 使用 filter 而不是 find，获取所有动画制作公司
                const animationStudioObjs = personsData.filter(person =>
                                                               person.relation === '动画制作'
                                                              );

                if (animationStudioObjs.length > 0) {
                    // 提取所有动画制作公司的名称
                    let studioNames = animationStudioObjs.map(studio => studio.name);

                    // 对studioNames中的每个名称进行HTML实体解码
                    if (Array.isArray(studioNames) && studioNames.length > 0) {
                        studioNames = studioNames.map(name => {
                            if (typeof name === 'string') {
                                // 检查是否包含需要解码的HTML实体
                                if (name.includes('&lt;') || name.includes('&gt;') || name.includes('&amp;') ||
                                    name.includes('&quot;') || name.includes('&#39;')) {
                                    // 有HTML实体，进行解码
                                    return name
                                        .replace(/&lt;/g, '<')
                                        .replace(/&gt;/g, '>')
                                        .replace(/&amp;/g, '&')
                                        .replace(/&quot;/g, '"')
                                        .replace(/&#39;/g, "'");
                                } else {
                                    // 没有需要解码的HTML实体，保持原样
                                    return name;
                                }
                            } else {
                                // 如果不是字符串，保持原样
                                return name;
                            }
                        });
                    }
                    // 如果studioNames不是数组或为空，保持原样

                    // 如果有多个制作公司，用逗号分隔
                    if (studioNames.length === 1) {
                        animationStudio = studioNames[0];
                    } else {
                        // 多个公司用逗号分隔，可以根据需要调整分隔符
                        animationStudio = studioNames.join('、');

                        // 或者如果你想要更清晰的显示，可以使用其他格式：
                        //animationStudio = studioNames.map(name => `"${name}"`).join('、');
                    }

                    console.log(`找到 ${studioNames.length} 个动画制作公司:`, studioNames);
                }
            }
            // 新增：获取标签信息
            let tagsDisplay = '未知';
            if (subjectDetail && subjectDetail.meta_tags && Array.isArray(subjectDetail.meta_tags)) {
                // 先对标签进行去重
                const uniqueTags = [...new Set(subjectDetail.meta_tags)];
                // 定义需要过滤的词语数组 - 用户可以在这里添加想要过滤的词语
                const filteredWords = ['日本']; // 例如过滤掉"日本"这个标签

                // 过滤标签并转换为带引号的字符串
                tagsDisplay = uniqueTags
                    .filter(tag => !filteredWords.includes(tag)) // 过滤掉指定的词语
                    .map(tag => `"${tag}"`)
                    .join(', ');
                    console.log(`标签信息: ${tagsDisplay}`);
            }


            // 直接使用原始日期格式
            const broadcastDate = subject.date || '未知';
            const watchedEpisodes = String(item.ep_status).padStart(2, '0');
            const totalEpisodes = String(subject.eps || 0).padStart(2, '0');
            report += `   🌸 ${displayName}\n`;
            report += `   🎯 Bangumi排名: ${rank}\n`;
            report += `   ⭐ Bangumi评分: ${scoreDisplay} = ${ratingTotal}\n`;
            report += `   🏷️ 标签: ${tagsDisplay}\n`; // 新增的标签行
            report += `   🎨 动画制作: ${animationStudio}\n`; // 新增的动画制作信息行
            report += `   📺 放送开始: ${broadcastDate}\n`;
            report += `   ⭕ 最近观看: ${lastTimeModified}\n`; // 最近观看时间
            report += `   ✅ 已完成: ${watchedEpisodes}/${totalEpisodes} 集\n\n`;

            //             report += `   ${progressBar}\n\n`;
        }

        /*         // 统计信息
        const stats = calculateStats(watching);
        report += `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n`;
        report += `📈 统计信息\n`;
        report += `   正在追番: ${stats.watching} 部\n`;
        report += `   已看集数: ${stats.watched} 集\n`;
        report += `   总集数: ${stats.total} 集\n`;
        report += `   整体进度: ${stats.progress}%\n\n`; */

/*
        report += `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n`;
        report += ratingStats.statsText;
        report += ratingStats.userRank;
        report += `⏰ 报告时间: ${new Date().toLocaleString('zh-CN')}`; */


        // 在函数末尾，将三项内容整合到一个变量中
        const ratingStats = calculateRatingStats(data);
        const footerContent = `
      ${ratingStats.statsText}
      ${ratingStats.userRank}
      ⏰ 报告时间: ${new Date().toLocaleString('zh-CN')}
      `;
    // 返回主要报告内容和页脚内容
        return {
            mainContent: report, // 主要报告内容
            footerContent: footerContent // 整合的页脚内容
        };
    }

    // 进度条生成函数
    /*     function generateProgressBar(current, total) {
        if (total === 0) return '▰▰▰▰▰▰▰▰▰▰';

        const percentage = current / total;
        const filled = Math.round(percentage * 10);
        const empty = 10 - filled;

        return '▰'.repeat(filled) + '▱'.repeat(empty) + ` ${(percentage * 100).toFixed(0)}%`;
    }
 */
    function calculateStats(data) {
        const watching = data.length;
        const watched = data.reduce((sum, item) => sum + item.ep_status, 0);
        const total = data.reduce((sum, item) => sum + item.subject.eps, 0);
        const progress = total > 0 ? ((watched / total) * 100).toFixed(1) : 0;

        return { watching, watched, total, progress };
    }

    // 显示加载状态
    function showLoading(message) {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'bangumi-report-loading';
        loadingElement.textContent = message;

        // 插入到页面中
        const columnA = document.querySelector('#columnA');
        if (columnA) {
            columnA.insertBefore(loadingElement, columnA.firstChild);
        }

        return loadingElement;
    }

    // 显示报告 - 优化插入位置并支持黑暗模式
    function displayReport(reportData, username, userId) {
        // 移除现有的报告
        const existingReport = document.querySelector('.bangumi-report-container');
        if (existingReport) {
            existingReport.remove();
        }

        // 检测当前是否黑暗模式
        const darkMode = isDarkMode();
        console.log('当前主题检测结果:', darkMode ? '黑暗模式' : '光亮模式');
        console.log('HTML data-theme:', document.documentElement.getAttribute('data-theme'));

        // 创建报告容器
        const container = document.createElement('div');
        container.className = 'bangumi-report-container';
        container.id = 'bangumiReport';

        // 如果是黑暗模式，添加额外的类名
        if (darkMode) {
            container.classList.add('dark-mode');
            console.log('已添加 dark-mode 类');
        } else {
        console.log('未添加 dark-mode 类，使用默认光亮模式');
        }

        // 创建拖拽手柄 - 新增代码
        const dragHandle = document.createElement('div');
        dragHandle.className = 'bangumi-drag-handle';
        dragHandle.innerHTML = '';
        container.appendChild(dragHandle);


        // 创建标题 - 使用用户名@用户ID格式
        const title = document.createElement('div');
        title.className = 'bangumi-report-title';
        title.textContent = `${username} @${userId}`;
        container.appendChild(title);

        // 创建主要报告内容
        const content = document.createElement('div');
        content.className = 'bangumi-report-content';
        content.textContent = reportData.mainContent;
        container.appendChild(content);

        // 创建页脚区域 - 使用整合的内容
        const footer = document.createElement('div');
        footer.className = 'report-footer';
        footer.textContent = reportData.footerContent;
        container.appendChild(footer);

        // 添加操作按钮区域
        const actions = document.createElement('div');
        actions.className = 'bangumi-report-actions';

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'bangumi-report-copy-btn';
        copyBtn.textContent = '📋 复制报告';
        copyBtn.onclick = () => copyToClipboard(reportData.mainContent + '\n' + reportData.footerContent);
        actions.appendChild(copyBtn);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'bangumi-report-btn';
        closeBtn.textContent = '❌ 关闭';
        closeBtn.style.background = 'transparent';
        closeBtn.style.marginLeft = '10px';
        closeBtn.onclick = () => container.remove();
        actions.appendChild(closeBtn);

        container.appendChild(actions);

        // 插入到页面中 - 优化位置
        // 优先插入到 columnA 的顶部
        const columnA = document.querySelector('#columnA');
        if (columnA) {
            columnA.insertBefore(container, columnA.firstChild);
        } else {
            // 回退到主要内容区域
            const mainContent = document.querySelector('.user_home, #user_home, .columns') || document.body;
            mainContent.insertBefore(container, mainContent.firstChild);
        }
        // 初始化拖拽功能 - 新增代码
        makeElementDraggable(container);
        // 滚动到报告
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('报告已复制到剪贴板！');
        }).catch(err => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification('报告已复制到剪贴板！');
            } catch (err) {
                showError('复制失败，请手动选择文本复制');
            }
            document.body.removeChild(textArea);
        });
    }

    // 显示通知
    function showNotification(message) {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                timeout: 2000
            });
        } else {
            // 简单的页面提示
            const notification = document.createElement('div');
            const isDark = isDarkMode();

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${isDark ? '#4a8c4a' : '#5cb85c'};
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 2000);
        }
    }

    // 显示错误
    function showError(message) {
        showNotification('❌ ' + message);
    }

    // 监听主题变化
    function observeThemeChanges() {
        // 监听 html 元素的 data-theme 属性变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    // 主题发生变化，更新现有的报告容器
                    const reportContainer = document.querySelector('.bangumi-report-container');
                    if (reportContainer) {
                        const isDark = isDarkMode();
                        if (isDark) {
                            reportContainer.classList.add('dark-mode');
                        } else {
                            reportContainer.classList.remove('dark-mode');
                        }
                    }
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                const reportContainer = document.querySelector('.bangumi-report-container');
                if (reportContainer) {
                    if (e.matches) {
                        reportContainer.classList.add('dark-mode');
                    } else {
                        reportContainer.classList.remove('dark-mode');
                    }
                }
            });
        }
    }

    // 使bangumi-report-container可拖拽 - 简化版本
    function makeElementDraggable(element) {
        const dragHandle = element.querySelector('.bangumi-drag-handle');
        if (!dragHandle) {
            console.log('未找到拖拽手柄');
            return;
        }

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        // 鼠标按下事件
        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;

            // 记录初始位置
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(element.style.left) || element.offsetLeft;
            initialTop = parseInt(element.style.top) || element.offsetTop;

            // 改变光标样式
            element.style.cursor = 'grabbing';
            dragHandle.style.cursor = 'grabbing';

            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            // 计算移动距离
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // 更新位置
            element.style.left = (initialLeft + dx) + 'px';
            element.style.top = (initialTop + dy) + 'px';

            e.preventDefault();
        });

        // 鼠标松开事件
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;

                // 恢复光标样式
                element.style.cursor = 'default';
                dragHandle.style.cursor = 'move';
            }
        });

        // 顶部关闭按钮功能
        const closeBtn = element.querySelector('.bangumi-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                element.style.display = 'none';
            });
        }

        console.log('拖拽功能已初始化');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initBangumiReporter();
            observeThemeChanges();
        });
    } else {
        initBangumiReporter();
        observeThemeChanges();
    }

    // 监听URL变化（单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 延迟初始化，确保页面完全加载
            setTimeout(initBangumiReporter, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();