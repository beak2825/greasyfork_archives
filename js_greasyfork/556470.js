// ==UserScript==
// @name         Bangumi 看过动画精华报告生成器
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  一键生成看过动画的精华报告，只显示高分作品
// @author       mewmew
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        http://bgm.tv/*
// @match        http://bangumi.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      api.bgm.tv
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556470/Bangumi%20%E7%9C%8B%E8%BF%87%E5%8A%A8%E7%94%BB%E7%B2%BE%E5%8D%8E%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556470/Bangumi%20%E7%9C%8B%E8%BF%87%E5%8A%A8%E7%94%BB%E7%B2%BE%E5%8D%8E%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8.meta.js
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

    /* 浅色模式样式 - 优化版 */
    .bangumi-report-container {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 25px;
        padding: 20px;
        margin: 20px 0;
        box-shadow:
        0 4px 20px rgba(0,0,0,0.08),
            0 2px 8px rgba(0,0,0,0.03),
                inset 0 1px 0 rgba(255,255,255,0.5);
        border: 1px solid rgba(240, 145, 153, 0.15);
        font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #2c3e50;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
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

    .bangumi-report-title::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
                              width: 60px;
                              height: 2px;
                              background: #f09199;
                              border-radius: 2px;
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
        margin: 8px 0;
        box-sizing: border-box; /* 确保内边距包含在宽度内 */
        overflow-wrap: break-word; /* 允许在单词内换行 */
        word-break: keep-all; /* 保持中文不断行 */
    }

    .bangumi-report-btn {
        background: linear-gradient(135deg, #5cb85c 0%, #4cae4c 100%);
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
        background: linear-gradient(135deg, #4cae4c 0%, #449d44 100%);
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
    [data-theme="dark"] .bangumi-report-container,
        .bangumi-report-container.dark-mode {
            background: linear-gradient(135deg, #2b2b2b 0%, #1f1f1f 100%);
            border: 1px solid rgba(240, 145, 153, 0.2);
            color: #e8e6e3;
            box-shadow:
            0 4px 20px rgba(0,0,0,0.4),
                0 2px 8px rgba(0,0,0,0.2);
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
            background: linear-gradient(135deg, #4a8c4a 0%, #3d7a3d 100%);
            box-shadow: 0 2px 8px rgba(240, 145, 153, 0.3);
        }

    [data-theme="dark"] .bangumi-report-btn:hover,
        .bangumi-report-container.dark-mode .bangumi-report-copy-btn:hover {
            background: linear-gradient(135deg, #3d7a3d 0%, #356935 100%);
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
    `;

    // 使用 GM_addStyle 或创建 style 元素
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(style);
    } else {
        const styleElement = document.createElement("style");
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }

    // 配置常量 - 增加延迟和重试次数
    const CONFIG = {
        MAX_ANIME_COUNT: 12,
        REQUEST_DELAY: 500, // 增加延迟
        MAX_RETRIES: 3, // 添加重试机制
        RETRY_DELAY: 1000 // 重试延迟
    };

    // 主函数
    function initBangumiBestReporter() {
        // 获取当前用户ID
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.log('未找到当前用户信息');
            return;
        }

        // 添加生成精华报告按钮
        addBestReportButton(currentUser);
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

        // 检查其他可能的黑暗模式标识
        if (html.classList.contains('dark') ||
            html.classList.contains('dark-mode') ||
            document.body.classList.contains('dark') ||
            document.body.classList.contains('dark-mode')) {
            return true;
        }

        // 检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        return false;
    }

    // 添加生成精华报告按钮
    function addBestReportButton(userId) {
        // 先移除可能存在的旧按钮
        const oldBtn = document.querySelector('.bangumi-report-btn');
        if (oldBtn) oldBtn.remove();

        // 方案1：添加到导航标签区域（最佳位置）
        const navTabs = document.querySelector('.navTabsWrapper, .navTabs');
        if (navTabs) {
            const btn = createBestReportButton(userId);
            // 插入到导航标签的合适位置
            navTabs.appendChild(btn);
            return;
        }

        // 方案2：添加到用户信息区域
        const userHeader = document.querySelector('.headerContainer, #headerProfile');
        if (userHeader) {
            const btn = createBestReportButton(userId);
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
            const btn = createBestReportButton(userId);
            mainWrapper.insertBefore(btn, mainWrapper.firstChild);
        }
    }

    // 创建精华报告按钮
    function createBestReportButton(userId) {
        const btn = document.createElement('button');
        btn.className = 'bangumi-report-btn';
        btn.innerHTML = '⭐ 生成精华报告';
        btn.title = '一键生成高分看过动画报告';
        btn.onclick = () => generateBestReport(userId);
        return btn;
    }

    // 生成精华报告
    async function generateBestReport(userId) {
        try {
            // 显示加载中
            const loadingElement = showBestLoading(`正在获取前 ${CONFIG.MAX_ANIME_COUNT} 部高分动画数据...`);

            // 获取用户收藏数据
            const collections = await getUserCollections(userId);

            console.log('获取到的收藏数据:', collections);
            console.log(`成功获取 ${collections.total} 部动画数据`);

            // 获取用户名
            const username = getUsername();

            // 生成精华报告
            const report = await createBestReport(collections, username, userId);

            // 移除加载提示
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }

            // 显示报告
            displayBestReport(report, username, userId);

        } catch (error) {
            console.error('生成精华报告失败:', error);
            showError('生成精华报告失败: ' + error.message);

            // 移除加载提示
            const loadingElement = document.querySelector('.bangumi-report-loading');
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
        }
    }

    // 获取用户收藏数据 - 限制数量并添加重试机制
    function getUserCollections(userId, retryCount = 0) {
        return new Promise((resolve, reject) => {
            const limit = CONFIG.MAX_ANIME_COUNT;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/users/${userId}/collections?subject_type=2&type=2&limit=12`,
                headers: {
                    'User-Agent': 'BangumiBestReport/2.2 (https://bgm.tv)',
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log(`成功获取 ${data.data.length} 条看过记录`);
                            resolve({
                                data: data.data,
                                total: data.data.length,
                                limit: data.limit,
                                offset: data.offset
                            });
                        } catch (e) {
                            reject(new Error(`解析响应数据失败: ${e.message}`));
                        }
                    } else if (response.status >= 500 && retryCount < CONFIG.MAX_RETRIES) {
                        // 服务器错误，重试
                        console.log(`API返回 ${response.status} 错误，第 ${retryCount + 1} 次重试...`);
                        setTimeout(() => {
                            resolve(getUserCollections(userId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
                    } else if (response.status === 404) {
                        reject(new Error('用户不存在或没有公开收藏'));
                    } else if (response.status === 403) {
                        reject(new Error('没有权限访问该用户的收藏'));
                    } else {
                        reject(new Error(`API请求失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    if (retryCount < CONFIG.MAX_RETRIES) {
                        console.log(`请求出错，第 ${retryCount + 1} 次重试...`);
                        setTimeout(() => {
                            resolve(getUserCollections(userId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
                    } else {
                        reject(new Error(`网络请求失败: ${error}`));
                    }
                },
                timeout: 15000
            });
        });
    }

    // 获取动画详细信息 - 添加重试机制
    function getSubjectDetail(subjectId, retryCount = 0) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/subjects/${subjectId}`,
                headers: {
                    'User-Agent': 'BangumiBestReport/2.2 (https://bgm.tv)',
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            resolve(null);
                        }
                    } else if (response.status >= 500 && retryCount < CONFIG.MAX_RETRIES) {
                        setTimeout(() => {
                            resolve(getSubjectDetail(subjectId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
                    } else {
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    if (retryCount < CONFIG.MAX_RETRIES) {
                        setTimeout(() => {
                            resolve(getSubjectDetail(subjectId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
                    } else {
                        resolve(null);
                    }
                },
                timeout: 15000
            });
        });
    }

    // 获取动画制作人员信息 - 从追番脚本复制过来
    function getSubjectPersons(subjectId, retryCount = 0) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/v0/subjects/${subjectId}/persons`,
                headers: {
                    'User-Agent': 'BangumiBestReport/2.2 (https://bgm.tv)',
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (Array.isArray(data)) {
                                resolve(data);
                            } else if (data.data && Array.isArray(data.data)) {
                                resolve(data.data);
                            } else {
                                resolve([]);
                            }
                        } catch (e) {
                            if (retryCount < CONFIG.MAX_RETRIES) {
                                setTimeout(() => {
                                    resolve(getSubjectPersons(subjectId, retryCount + 1));
                                }, CONFIG.RETRY_DELAY * (retryCount + 1));
                            } else {
                                resolve([]);
                            }
                        }
                    } else if (response.status === 429) {
                        setTimeout(() => {
                            resolve(getSubjectPersons(subjectId, retryCount + 1));
                        }, 3000);
                    } else if (response.status >= 500 && retryCount < CONFIG.MAX_RETRIES) {
                        setTimeout(() => {
                            resolve(getSubjectPersons(subjectId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
                    } else {
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    if (retryCount < CONFIG.MAX_RETRIES) {
                        setTimeout(() => {
                            resolve(getSubjectPersons(subjectId, retryCount + 1));
                        }, CONFIG.RETRY_DELAY * (retryCount + 1));
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

    // 生成星星评分条 - 使用方块符号确保大小一致
    function generateStarRating(score) {
        const fullStars = Math.floor(score);
        const emptyStars = 10 - fullStars;
        return '⭐'.repeat(fullStars) //+ '□'.repeat(emptyStars);
    }

    // 格式化时间戳 - 新功能
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

    // 创建精华报告 - 主要修改部分
    async function createBestReport(data, username, userId) {
        // 筛选条件：rate>=7 && subject.score>7.0
        const bestAnime = data.data.filter(item =>
                                           item.rate >= 7 && // 用户评分≥7
                                           item.subject.score > 7.0 // 社区评分>7.0
                                          );

        if (bestAnime.length === 0) {
            return `😴 ${username} 没有符合条件的高分动画`;
        }
        let report = ``
/*         let report = `${username} @${userId}\n`;
        report += `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n`; */

        // 按用户评分排序（高的在前）
        bestAnime.sort((a, b) => b.rate - a.rate);

        // 获取所有动画的详细信息和制作人员信息
        const subjectDetails = {};
        const subjectPersons = {};

        // 使用顺序请求避免API限制
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // 获取详细信息
        for (let i = 0; i < bestAnime.length; i++) {
            const item = bestAnime[i];
            subjectDetails[item.subject_id] = await getSubjectDetail(item.subject_id);
            await delay(CONFIG.REQUEST_DELAY);
        }

        // 获取制作人员信息
        for (let i = 0; i < bestAnime.length; i++) {
            const item = bestAnime[i];
            subjectPersons[item.subject_id] = await getSubjectPersons(item.subject_id);
            await delay(CONFIG.REQUEST_DELAY);
        }

        for (const item of bestAnime) {
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

            // 新增：获取标签信息（带过滤功能）
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

            // 生成星星评分 - 使用个人评分(rate)
            const starRating = generateStarRating(item.rate);

            // 格式化完成时间 - 使用lastTimeModified变量名
            const lastTimeModified = formatTimestamp(item.updated_at);

            // 修正评分显示：显示网站评分(score)和个人评分(rate)
            //const websiteScore = parseFloat(subject.score).toFixed(2);
            const personalScore = parseFloat(item.rate).toFixed(1);

            report += `   🌸 ${displayName}\n`;
            report += `   🎯 Bangumi排名: ${rank}\n`;
            report += `   ⭐ Bangumi评分: ${scoreDisplay} = votes: ${ratingTotal}\n`; // 修正：显示网站评分
            report += `   🏷️ 标签: ${tagsDisplay}\n`; // 新增的标签行
            report += `   🎨 动画制作: ${animationStudio}\n`; // 新增的动画制作信息行
            report += `   📺 放送开始: ${broadcastDate}\n`;
            report += `   ⭕ 完成时间: ${lastTimeModified}\n`; // 使用红色空心圆圈和lastTimeModified变量名
            report += `   ✅ 完结评分: ${personalScore}/10.0 分\n\n`; // 修正：显示个人评分
            //report += `   🌟 个人评分: ${personalScore}/${starRating}\n\n`; // 修正：显示个人评分和星星

        }

        // 统计信息
        report += `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n`;
        report += `📊 统计信息\n`;
        report += `   高分动画: ${bestAnime.length} 部\n`;

        // 评分分布统计 - 使用个人评分(rate)
        const scoreDistribution = {10: 0, 9: 0, 8: 0, 7: 0};
        bestAnime.forEach(item => {
            if (item.rate >= 10) scoreDistribution[10]++;
            else if (item.rate >= 9) scoreDistribution[9]++;
            else if (item.rate >= 8) scoreDistribution[8]++;
            else scoreDistribution[7]++;
        });

        report += `   10分: ${scoreDistribution[10]} 部\n`;
        report += `   9分: ${scoreDistribution[9]} 部\n`;
        report += `   8分: ${scoreDistribution[8]} 部\n`;
        report += `   7分: ${scoreDistribution[7]} 部\n\n`;

        // 平均评分 - 使用个人评分(rate)
        const avgScore = (bestAnime.reduce((sum, item) => sum + item.rate, 0) / bestAnime.length).toFixed(1);
        report += `   平均个人评分: ${avgScore}分\n\n`;

        report += `⏰ 报告时间: ${new Date().toLocaleString('zh-CN')}`;

        return report;
    }

    // 显示加载状态
    function showBestLoading(message) {
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

    // 显示精华报告
    function displayBestReport(report, username, userId) {
        // 移除现有的报告
        const existingReport = document.querySelector('.bangumi-report-container');
        if (existingReport) {
            existingReport.remove();
        }

        // 检测当前是否黑暗模式
        const darkMode = isDarkMode();

        // 创建报告容器
        const container = document.createElement('div');
        container.className = 'bangumi-report-container';

        // 如果是黑暗模式，添加额外的类名
        if (darkMode) {
            container.classList.add('dark-mode');
        }

        // 创建标题 - 使用用户名@用户ID格式
        const title = document.createElement('div');
        title.className = 'bangumi-report-title';
        title.textContent = `${username} @${userId}`;
        container.appendChild(title);

        // 创建报告内容
        const content = document.createElement('div');
        content.className = 'bangumi-report-content';
        content.textContent = report;
        container.appendChild(content);

        // 添加操作按钮区域
        const actions = document.createElement('div');
        actions.className = 'bangumi-report-actions';

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'bangumi-report-copy-btn';
        copyBtn.textContent = '📋 复制报告';
        copyBtn.onclick = () => copyToClipboard(report);
        actions.appendChild(copyBtn);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'bangumi-report-btn';
        closeBtn.textContent = '❌ 关闭';
        closeBtn.style.background = '#6c757d';
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

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initBangumiBestReporter();
        observeThemeChanges();
    });
} else {
    initBangumiBestReporter();
    observeThemeChanges();
}

// 监听URL变化（单页应用）
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        // 延迟初始化，确保页面完全加载
        setTimeout(initBangumiBestReporter, 500);
    }
}).observe(document, { subtree: true, childList: true });

})();