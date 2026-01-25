// ==UserScript==
// @name         X.com 喜欢推文提取器 v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  静默被动获取X.com上已加载的"喜欢"推文，精确匹配DOM结构
// @author       r007b34r
// @match        https://x.com/*/likes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564041/Xcom%20%E5%96%9C%E6%AC%A2%E6%8E%A8%E6%96%87%E6%8F%90%E5%8F%96%E5%99%A8%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/564041/Xcom%20%E5%96%9C%E6%AC%A2%E6%8E%A8%E6%96%87%E6%8F%90%E5%8F%96%E5%99%A8%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        storageKey: 'xLikesData_v2',
        checkInterval: 2000,
        logToConsole: true,
        showUI: true
    };

    // ==================== 状态 ====================
    const state = {
        tweets: new Map(),  // id -> tweetData，使用Map确保唯一性
        lastCount: 0
    };

    // ==================== 核心提取逻辑 ====================

    /**
     * 从推文元素提取ID（最可靠：从status链接）
     */
    function extractTweetId(tweetEl) {
        const statusLink = tweetEl.querySelector('a[href*="/status/"]');
        if (statusLink) {
            const match = statusLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }
        return null;
    }

    /**
     * 从aria-label解析数字（处理中英文格式）
     * 格式: "43 回复。回复" / "153 次转帖。转帖" / "3830 喜欢次数。喜欢了"
     */
    function parseAriaLabel(label) {
        if (!label) return 0;
        const match = label.match(/^([\d,\.]+)/);
        if (match) {
            return parseInt(match[1].replace(/[,\.]/g, '')) || 0;
        }
        return 0;
    }

    /**
     * 解析显示文本中的数字（处理万、亿、K、M）
     */
    function parseDisplayCount(text) {
        if (!text) return 0;
        text = text.trim();

        // 中文单位
        if (text.includes('万')) {
            return Math.floor(parseFloat(text.replace(/万/g, '')) * 10000);
        }
        if (text.includes('亿')) {
            return Math.floor(parseFloat(text.replace(/亿/g, '')) * 100000000);
        }

        // 英文单位
        if (/[Kk]$/.test(text)) {
            return Math.floor(parseFloat(text) * 1000);
        }
        if (/[Mm]$/.test(text)) {
            return Math.floor(parseFloat(text) * 1000000);
        }
        if (/[Bb]$/.test(text)) {
            return Math.floor(parseFloat(text) * 1000000000);
        }

        return parseInt(text.replace(/[^\d]/g, '')) || 0;
    }

    /**
     * 提取单条推文的完整数据
     */
    function extractTweetData(tweetEl) {
        const id = extractTweetId(tweetEl);
        if (!id) return null;

        // === 作者信息 ===
        const userNameEl = tweetEl.querySelector('[data-testid="User-Name"]');
        let authorName = '';
        let authorHandle = '';

        if (userNameEl) {
            const links = Array.from(userNameEl.querySelectorAll('a'));
            // 第一个链接通常是名字，第二个是@handle
            if (links.length >= 2) {
                authorName = links[0].textContent?.trim() || '';
                const handleLink = links.find(a => a.textContent?.startsWith('@'));
                authorHandle = handleLink ? handleLink.textContent.trim() : '';
            }
        }

        const avatarEl = tweetEl.querySelector('[data-testid="Tweet-User-Avatar"] img');
        const authorAvatar = avatarEl ? avatarEl.src.replace('_normal', '_bigger') : '';

        // === 内容 ===
        const contentEl = tweetEl.querySelector('[data-testid="tweetText"]');
        const content = contentEl ? contentEl.textContent.trim() : '';

        // === 时间 ===
        const timeEl = tweetEl.querySelector('time');
        const timestamp = timeEl ? timeEl.getAttribute('datetime') : '';
        const relativeTime = timeEl ? timeEl.textContent.trim() : '';

        // === 互动数据（优先使用aria-label，更精确）===

        // 回复
        const replyBtn = tweetEl.querySelector('[data-testid="reply"]');
        const replies = replyBtn ? parseAriaLabel(replyBtn.getAttribute('aria-label')) : 0;

        // 转发
        const retweetBtn = tweetEl.querySelector('[data-testid="retweet"]');
        const retweets = retweetBtn ? parseAriaLabel(retweetBtn.getAttribute('aria-label')) : 0;

        // 喜欢（在喜欢页面是unlike按钮）
        let likeBtn = tweetEl.querySelector('[data-testid="unlike"]');
        if (!likeBtn) likeBtn = tweetEl.querySelector('[data-testid="like"]');
        const likes = likeBtn ? parseAriaLabel(likeBtn.getAttribute('aria-label')) : 0;

        // 浏览量（从analytics链接获取）
        const analyticsLink = tweetEl.querySelector('a[href*="/analytics"]');
        const views = analyticsLink ? parseDisplayCount(analyticsLink.textContent) : 0;

        // === 媒体 ===
        const media = [];

        // 图片
        const photoEls = tweetEl.querySelectorAll('[data-testid="tweetPhoto"] img');
        photoEls.forEach(img => {
            if (img.src && !img.src.includes('emoji')) {
                media.push({
                    type: 'photo',
                    url: img.src.replace(/&name=\w+/, '&name=large')
                });
            }
        });

        // 视频（只记录存在，不提取URL避免复杂性）
        const videoEl = tweetEl.querySelector('[data-testid="videoPlayer"]');
        if (videoEl) {
            const poster = videoEl.querySelector('video')?.poster ||
                           videoEl.querySelector('img')?.src || '';
            media.push({
                type: 'video',
                poster: poster
            });
        }

        // === 链接 ===
        const statusLink = tweetEl.querySelector('a[href*="/status/"]');
        const permalink = statusLink ? statusLink.href.split('?')[0] : '';

        return {
            id,
            author: {
                name: authorName,
                handle: authorHandle,
                avatar: authorAvatar
            },
            content,
            timestamp,
            relativeTime,
            interactions: {
                replies,
                retweets,
                likes,
                views
            },
            media,
            permalink,
            extractedAt: new Date().toISOString()
        };
    }

    // ==================== 扫描与存储 ====================

    /**
     * 扫描页面上所有推文
     */
    function scanTweets() {
        const tweetEls = document.querySelectorAll('[data-testid="tweet"]');
        let newCount = 0;

        tweetEls.forEach(tweetEl => {
            try {
                const data = extractTweetData(tweetEl);
                if (data && data.id && !state.tweets.has(data.id)) {
                    state.tweets.set(data.id, data);
                    newCount++;
                }
            } catch (e) {
                // 静默忽略单条推文的错误
            }
        });

        if (newCount > 0) {
            saveToStorage();
            updateUI();
            if (CONFIG.logToConsole) {
                console.log(`[提取器] +${newCount} 条，总计 ${state.tweets.size} 条`);
            }
        }
    }

    /**
     * 保存到localStorage
     */
    function saveToStorage() {
        try {
            const data = Array.from(state.tweets.values());
            // 按时间排序（最新在前）
            data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('[提取器] 保存失败:', e);
        }
    }

    /**
     * 从localStorage恢复
     */
    function restoreFromStorage() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                if (Array.isArray(data)) {
                    data.forEach(tweet => {
                        if (tweet && tweet.id) {
                            state.tweets.set(tweet.id, tweet);
                        }
                    });
                    if (CONFIG.logToConsole) {
                        console.log(`[提取器] 恢复 ${state.tweets.size} 条`);
                    }
                }
            }
        } catch (e) {
            console.error('[提取器] 恢复失败:', e);
        }
    }

    // ==================== UI ====================

    let uiContainer = null;

    function createUI() {
        if (!CONFIG.showUI) return;

        uiContainer = document.createElement('div');
        uiContainer.id = 'xlx-ui';
        uiContainer.innerHTML = `
            <style>
                #xlx-ui {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 14px;
                }
                #xlx-panel {
                    background: #1a1a2e;
                    border: 1px solid #4a4a6a;
                    border-radius: 12px;
                    padding: 16px;
                    min-width: 200px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    color: #fff;
                }
                #xlx-count {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1d9bf0;
                    margin-bottom: 8px;
                }
                #xlx-status {
                    color: #71767b;
                    font-size: 12px;
                    margin-bottom: 12px;
                }
                .xlx-btn {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: background 0.2s;
                }
                .xlx-btn-primary {
                    background: #1d9bf0;
                    color: white;
                }
                .xlx-btn-primary:hover {
                    background: #1a8cd8;
                }
                .xlx-btn-danger {
                    background: #f4212e;
                    color: white;
                }
                .xlx-btn-danger:hover {
                    background: #dc1d28;
                }
            </style>
            <div id="xlx-panel">
                <div id="xlx-count">0</div>
                <div id="xlx-status">已收集的推文</div>
                <button class="xlx-btn xlx-btn-primary" id="xlx-export">导出 JSON</button>
                <button class="xlx-btn xlx-btn-danger" id="xlx-clear">清空数据</button>
            </div>
        `;

        document.body.appendChild(uiContainer);

        // 绑定事件
        document.getElementById('xlx-export').addEventListener('click', exportData);
        document.getElementById('xlx-clear').addEventListener('click', clearData);

        updateUI();
    }

    function updateUI() {
        if (!uiContainer) return;
        const countEl = document.getElementById('xlx-count');
        if (countEl) {
            countEl.textContent = state.tweets.size;
        }
    }

    // ==================== 导出 ====================

    function exportData() {
        const data = Array.from(state.tweets.values());
        data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `x_likes_${new Date().toISOString().slice(0, 10)}_${data.length}条.json`;
        a.click();

        URL.revokeObjectURL(url);

        if (CONFIG.logToConsole) {
            console.log(`[提取器] 已导出 ${data.length} 条`);
        }
    }

    function clearData() {
        if (confirm('确定清空所有数据？')) {
            state.tweets.clear();
            localStorage.removeItem(CONFIG.storageKey);
            updateUI();
            if (CONFIG.logToConsole) {
                console.log('[提取器] 数据已清空');
            }
        }
    }

    // ==================== 初始化 ====================

    function init() {
        console.log('[X.com 喜欢推文提取器 v2.0] 启动');

        // 恢复数据
        restoreFromStorage();

        // 创建UI
        createUI();

        // 初次扫描
        setTimeout(scanTweets, 1000);

        // 滚动监听（防抖）
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(scanTweets, 300);
        }, { passive: true });

        // 定时扫描
        setInterval(scanTweets, CONFIG.checkInterval);

        // 暴露API
        window.XLikesExtractor = {
            getData: () => Array.from(state.tweets.values()),
            getCount: () => state.tweets.size,
            export: exportData,
            clear: clearData,
            scan: scanTweets
        };
    }

    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
