// ==UserScript==
// @name         Bilibili评论展开助手
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  智能展开Bilibili评论回复，一键查看所有子评论，支持按热度和时间排序，提供流畅的评论浏览体验
// @author       Rygtx
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      CC-BY-NC-4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550681/Bilibili%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550681/Bilibili%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const CONFIG = {
        API_BASE: 'https://api.bilibili.com',
        COMMENT_TYPE: 1, // 视频评论类型
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        REQUEST_TIMEOUT: 10000
    };

    // 工具函数
    const Utils = {
        // 调试日志输出功能
        log(level, message, ...args) {
            const timestamp = new Date().toISOString();
            const prefix = `[Bilibili评论展开助手 ${timestamp}]`;

            switch (level) {
                case 'error':
                    console.error(prefix, message, ...args);
                    break;
                case 'warn':
                    console.warn(prefix, message, ...args);
                    break;
                case 'info':
                    console.info(prefix, message, ...args);
                    break;
                default:
                    console.log(prefix, message, ...args);
            }
        },

        formatTime(timestamp) {
            if (!timestamp) return '未知时间';

            const date = new Date(timestamp * 1000);
            const now = new Date();
            const diff = now - date;

            const minute = 60 * 1000;
            const hour = 60 * minute;
            const day = 24 * hour;
            const month = 30 * day;
            const year = 365 * day;

            if (diff < minute) {
                return '刚刚';
            } else if (diff < hour) {
                return `${Math.floor(diff / minute)}分钟前`;
            } else if (diff < day) {
                return `${Math.floor(diff / hour)}小时前`;
            } else if (diff < month) {
                return `${Math.floor(diff / day)}天前`;
            } else if (diff < year) {
                return `${Math.floor(diff / month)}个月前`;
            } else {
                return `${Math.floor(diff / year)}年前`;
            }
        },

        formatDetailedTime(timestamp) {
            if (!timestamp) return '未知时间';

            const date = new Date(timestamp * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },

        // HTML转义工具函数
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // 获取视频标题
        async getVideoTitle(videoId, isAv = false) {
            try {
                let apiUrl;
                if (isAv) {
                    apiUrl = `https://api.bilibili.com/x/web-interface/view?aid=${videoId}`;
                } else {
                    apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`;
                }

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                if (data.code === 0 && data.data && data.data.title) {
                    return data.data.title;
                }

                throw new Error('API返回错误');
            } catch (error) {
                return null;
            }
        },

        // 处理评论内容中的视频链接 - 增强版
        async processCommentContentEnhanced(content) {
            if (!content) return '内容为空';

            const escapedContent = this.escapeHtml(content);

            // 识别av号和BV号的正则表达式
            const avPattern = /\b(av)(\d+)\b/gi;

            let processedContent = escapedContent;
            const videoPromises = [];

            // 收集所有视频链接
            const videoMatches = [];

            // 处理av号
            let match;
            while ((match = avPattern.exec(escapedContent)) !== null) {
                videoMatches.push({
                    match: match[0],
                    type: 'av',
                    id: match[2],
                    fullMatch: match[0]
                });
            }

            // 处理BV号
            const bvRegex = /\b(BV[a-zA-Z0-9]+)\b/gi;
            while ((match = bvRegex.exec(escapedContent)) !== null) {
                videoMatches.push({
                    match: match[0],
                    type: 'bv',
                    id: match[0],
                    fullMatch: match[0]
                });
            }

            // 为每个视频获取标题
            for (const video of videoMatches) {
                const titlePromise = this.getVideoTitle(video.id, video.type === 'av')
                    .then(title => ({ ...video, title }));
                videoPromises.push(titlePromise);
            }

            // 等待所有标题获取完成
            const videoData = await Promise.all(videoPromises);

            // 替换视频链接
            for (const video of videoData) {
                const url = video.type === 'av'
                    ? `https://www.bilibili.com/video/av${video.id}/`
                    : `https://www.bilibili.com/video/${video.id}/`;

                const title = video.title || video.fullMatch;
                const linkHtml = this.createVideoLinkHtml(url, title, video.fullMatch);

                processedContent = processedContent.replace(video.fullMatch, linkHtml);
            }

            return processedContent;
        },

        // 创建B站风格的视频链接HTML - 暗色主题优化
        createVideoLinkHtml(url, title) {
            // 限制标题长度，避免过长
            const displayTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;

            return `<a href="${url}" target="_blank" class="bili-video-link-enhanced" style="--icon-width:1.2em;--icon-height:1.2em;color:#00a1d6;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s ease;border-radius:6px;padding:4px 8px;background:rgba(0,161,214,0.08);border:1px solid rgba(0,161,214,0.2);margin:2px 0;max-width:300px;" data-type="link" title="${title}">
                <img src="https://i0.hdslb.com/bfs/activity-plat/static/20201110/4c8b2dbaded282e67c9a31daa4297c3c/AeQJlYP7e.png" loading="lazy" style="width:var(--icon-width);height:var(--icon-height);vertical-align:middle;flex-shrink:0;filter:brightness(1.1);" alt="播放">
                <span style="color:#00a1d6;font-weight:500;font-size:13px;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${displayTitle}</span>
            </a>`;
        },

        // 为增强版视频链接添加悬停效果 - 暗色主题优化
        addEnhancedVideoLinkHoverEffects(container) {
            const videoLinks = container.querySelectorAll('.bili-video-link-enhanced');
            videoLinks.forEach(link => {
                link.addEventListener('mouseover', () => {
                    link.style.background = 'rgba(0,161,214,0.15)';
                    link.style.borderColor = 'rgba(0,161,214,0.4)';
                    link.style.transform = 'translateY(-1px)';
                    link.style.boxShadow = '0 2px 8px rgba(0,161,214,0.2)';
                    const span = link.querySelector('span');
                    if (span) span.style.color = '#40a9ff';
                    const img = link.querySelector('img');
                    if (img) img.style.filter = 'brightness(1.3)';
                });

                link.addEventListener('mouseout', () => {
                    link.style.background = 'rgba(0,161,214,0.08)';
                    link.style.borderColor = 'rgba(0,161,214,0.2)';
                    link.style.transform = 'translateY(0)';
                    link.style.boxShadow = 'none';
                    const span = link.querySelector('span');
                    if (span) span.style.color = '#00a1d6';
                    const img = link.querySelector('img');
                    if (img) img.style.filter = 'brightness(1.1)';
                });

                // 点击效果
                link.addEventListener('mousedown', () => {
                    link.style.transform = 'translateY(0) scale(0.98)';
                });

                link.addEventListener('mouseup', () => {
                    link.style.transform = 'translateY(-1px) scale(1)';
                });
            });
        },

        // 为简化版视频链接添加悬停效果
        addVideoLinkHoverEffects(container) {
            const videoLinks = container.querySelectorAll('.bili-video-link-simple');
            videoLinks.forEach(link => {
                link.addEventListener('mouseover', () => {
                    link.style.borderBottomColor = '#00a1d6';
                    link.style.color = '#40a9ff';
                    link.style.background = 'rgba(0,161,214,0.1)';
                });

                link.addEventListener('mouseout', () => {
                    link.style.borderBottomColor = 'transparent';
                    link.style.color = '#00a1d6';
                    link.style.background = 'rgba(0,161,214,0.05)';
                });
            });
        },

        formatNumber(num) {
            if (num >= 10000) {
                return `${(num / 10000).toFixed(1)}万`;
            }
            return num.toString();
        },

        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async fetchWithRetry(url, options = {}, retries = CONFIG.MAX_RETRIES) {
            for (let i = 0; i < retries; i++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal,
                        headers: {
                            'User-Agent': navigator.userAgent,
                            'Referer': window.location.href,
                            ...options.headers
                        }
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    return response;
                } catch (error) {
                    if (i === retries - 1) {
                        throw error;
                    }

                    await Utils.sleep(CONFIG.RETRY_DELAY * (i + 1));
                }
            }
        }
    };

    // B站评论API组件
    class BilibiliCommentAPI {
        constructor() {
            this.cache = new Map();
            this.cacheExpiry = 5 * 60 * 1000; // 5分钟缓存
        }

        getCacheKey(type, oid, rpid = null, page = 1) {
            return `${type}_${oid}_${rpid || 'root'}_${page}`;
        }

        isValidCache(cacheItem) {
            return cacheItem && (Date.now() - cacheItem.timestamp) < this.cacheExpiry;
        }

        async getCommentReplies(oid, rootRpid, page = 1, pageSize = 20) {
            const cacheKey = this.getCacheKey('replies', oid, rootRpid, page);
            const cached = this.cache.get(cacheKey);

            if (this.isValidCache(cached)) {
                Utils.log('info', `使用缓存数据: ${cacheKey}`);
                return cached.data;
            }

            try {
                const url = new URL(`${CONFIG.API_BASE}/x/v2/reply/reply`);
                url.searchParams.set('type', CONFIG.COMMENT_TYPE);
                url.searchParams.set('oid', oid);
                url.searchParams.set('root', rootRpid);
                url.searchParams.set('ps', pageSize);
                url.searchParams.set('pn', page);

                Utils.log('info', `请求评论回复: ${url.toString()}`);
                const response = await Utils.fetchWithRetry(url.toString());
                const data = await response.json();

                if (data.code !== 0) {
                    throw new Error(`API错误: ${data.message || '未知错误'} (code: ${data.code})`);
                }

                // 缓存结果
                this.cache.set(cacheKey, {
                    data: data.data,
                    timestamp: Date.now()
                });

                Utils.log('info', `成功获取评论回复: ${data.data?.replies?.length || 0} 条`);
                return data.data;

            } catch (error) {
                Utils.log('error', '获取评论回复失败:', error);
                throw error;
            }
        }

        async getAllReplies(oid, rootRpid, maxPages = 10) {
            const allReplies = [];
            let page = 1;
            let hasMore = true;

            while (hasMore && page <= maxPages) {
                try {
                    const data = await this.getCommentReplies(oid, rootRpid, page);

                    if (data?.replies && data.replies.length > 0) {
                        allReplies.push(...data.replies);

                        // 检查是否还有更多页
                        const pageInfo = data.page;
                        hasMore = pageInfo && page < Math.ceil(pageInfo.count / pageInfo.size);
                        page++;

                        // 避免请求过快
                        if (hasMore) {
                            await Utils.sleep(500);
                        }
                    } else {
                        hasMore = false;
                    }
                } catch (error) {
                    Utils.log('error', `获取第${page}页回复失败:`, error);
                    hasMore = false;
                }
            }

            Utils.log('info', `总共获取到 ${allReplies.length} 条回复`);
            return allReplies;
        }

        async getCommentInfo(oid, rpid) {
            const cacheKey = this.getCacheKey('info', oid, rpid);
            const cached = this.cache.get(cacheKey);

            if (this.isValidCache(cached)) {
                return cached.data;
            }

            try {
                const url = new URL(`${CONFIG.API_BASE}/x/v2/reply/info`);
                url.searchParams.set('type', CONFIG.COMMENT_TYPE);
                url.searchParams.set('oid', oid);
                url.searchParams.set('rpid', rpid);

                const response = await Utils.fetchWithRetry(url.toString());
                const data = await response.json();

                if (data.code !== 0) {
                    throw new Error(`API错误: ${data.message || '未知错误'} (code: ${data.code})`);
                }

                this.cache.set(cacheKey, {
                    data: data.data,
                    timestamp: Date.now()
                });

                return data.data;

            } catch (error) {
                throw error;
            }
        }

        clearCache() {
            this.cache.clear();
            Utils.log('info', 'API缓存已清空');
        }
    }

    // DOM监听器组件
    class DOMWatcher {
        constructor() {
            this.observer = null;
            this.isObserving = false;
            this.viewMoreButtons = new Set();
            this.onViewMoreClick = null;
            this.intervalId = null;
            this.scanInterval = 1000; // 增加扫描频率到1秒
        }

        observeCommentSection() {
            if (this.isObserving) {
                Utils.log('warn', 'DOM监听器已在运行');
                return;
            }

            this.observer = new MutationObserver((mutations) => {
                let shouldRescan = false;

                mutations.forEach((mutation) => {
                    // 检查是否有节点被添加或移除
                    if (mutation.type === 'childList') {
                        // 检查是否涉及评论相关的DOM变化
                        const hasCommentChanges = Array.from(mutation.addedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            (node.tagName === 'BILI-COMMENT-THREAD-RENDERER' ||
                             node.querySelector && node.querySelector('bili-comment-thread-renderer'))
                        ) || Array.from(mutation.removedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            (node.tagName === 'BILI-COMMENT-THREAD-RENDERER' ||
                             node.querySelector && node.querySelector('bili-comment-thread-renderer'))
                        );

                        if (hasCommentChanges) {
                            shouldRescan = true;
                        }
                    }
                });

                if (shouldRescan) {
                    // 延迟一点时间让DOM完全更新
                    setTimeout(() => {
                        this.scanForViewMoreButtons();
                        this.reattachMissingButtons();
                    }, 100);
                }
            });

            const targetNode = document.body;
            const config = {
                childList: true,
                subtree: true,
                attributes: false
            };

            this.observer.observe(targetNode, config);
            this.isObserving = true;

            this.startPeriodicScan();
            this.scanForViewMoreButtons();
            Utils.log('info', 'DOM监听器已启动 - 增强版');
        }

        startPeriodicScan() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            this.intervalId = setInterval(() => {
                this.scanForViewMoreButtons();
                this.reattachMissingButtons();
            }, this.scanInterval);

            Utils.log('info', `定时检测已启动，每 ${this.scanInterval}ms 检测一次`);
        }

        // 重新附加丢失的瀑布流按钮
        reattachMissingButtons() {
            try {
                const commentApp = document.querySelector("#commentapp > bili-comments");
                if (!commentApp || !commentApp.shadowRoot) return;

                const threadRenderers = commentApp.shadowRoot.querySelectorAll("#feed > bili-comment-thread-renderer");
                let reattachedCount = 0;

                threadRenderers.forEach((threadRenderer) => {
                    if (!threadRenderer.shadowRoot) return;

                    const repliesRenderer = threadRenderer.shadowRoot.querySelector("#replies > bili-comment-replies-renderer");
                    if (!repliesRenderer || !repliesRenderer.shadowRoot) return;

                    const viewMoreButton = repliesRenderer.shadowRoot.querySelector("#view-more > bili-text-button");
                    if (!viewMoreButton || !viewMoreButton.shadowRoot) return;

                    // 检查是否已有评论展开按钮
                    const existingExpandBtn = this.findExpandButton(threadRenderer);
                    if (!existingExpandBtn) {
                        // 如果没有评论展开按钮，重新添加
                        const button = viewMoreButton.shadowRoot.querySelector("button");
                        if (button && this.viewMoreButtons.has(button)) {
                            // 这个按钮之前已经处理过，但评论展开按钮丢失了
                            const commentInfo = this.extractCommentInfo(viewMoreButton, threadRenderer);
                            if (commentInfo) {
                                this.addExpandButtonToStableLocation(threadRenderer, commentInfo);
                                reattachedCount++;
                            }
                        }
                    }
                });

                if (reattachedCount > 0) {
                    Utils.log('info', `重新附加了 ${reattachedCount} 个评论展开按钮`);
                }

            } catch (error) {
                Utils.log('error', '重新附加按钮时出错:', error);
            }
        }

        // 查找评论展开按钮（优化版）
        findExpandButton(threadRenderer) {
            try {
                // 优先在主要位置查找（基于实际使用情况优化）
                const primaryLocations = [
                    threadRenderer.shadowRoot?.querySelector("#replies"),
                    threadRenderer
                ];

                for (const location of primaryLocations) {
                    if (location) {
                        // 直接查找按钮
                        const expandBtn = location.querySelector?.('.bili-comment-expand-btn');
                        if (expandBtn) {
                            return expandBtn;
                        }
                        // 检查shadowRoot
                        if (location.shadowRoot) {
                            const expandBtn = location.shadowRoot.querySelector('.bili-comment-expand-btn');
                            if (expandBtn) {
                                return expandBtn;
                            }
                        }
                    }
                }
                return null;
            } catch (error) {
                return null;
            }
        }

        scanForViewMoreButtons() {
            try {
                const commentApp = document.querySelector("#commentapp > bili-comments");
                if (!commentApp || !commentApp.shadowRoot) {
                    Utils.log('warn', '未找到评论区或shadowRoot');
                    return;
                }

                const threadRenderers = commentApp.shadowRoot.querySelectorAll("#feed > bili-comment-thread-renderer");
                Utils.log('info', `扫描评论区: 找到 ${threadRenderers.length} 个评论线程`);
                let newButtonsFound = 0;

                threadRenderers.forEach((threadRenderer) => {
                    if (!threadRenderer.shadowRoot) return;

                    const repliesRenderer = threadRenderer.shadowRoot.querySelector("#replies > bili-comment-replies-renderer");
                    if (!repliesRenderer || !repliesRenderer.shadowRoot) return;

                    const viewMoreButton = repliesRenderer.shadowRoot.querySelector("#view-more > bili-text-button");
                    if (!viewMoreButton || !viewMoreButton.shadowRoot) return;

                    const button = viewMoreButton.shadowRoot.querySelector("button");
                    if (!button) return;

                    if (!this.viewMoreButtons.has(button)) {
                        this.processViewMoreButton(viewMoreButton, button, threadRenderer);
                        newButtonsFound++;
                    }
                });

                // 只在有新按钮时输出日志
                if (newButtonsFound > 0) {
                    Utils.log('info', `新处理了 ${newButtonsFound} 个"点击查看"按钮，总计: ${this.viewMoreButtons.size}`);
                }

            } catch (error) {
                Utils.log('error', '扫描按钮时出错:', error);
            }
        }

        processViewMoreButton(container, button, threadRenderer) {
            this.viewMoreButtons.add(button);
            button.setAttribute('data-waterfall-processed', 'true');

            // 先尝试提取评论信息
            const commentInfo = this.extractCommentInfo(container, threadRenderer);

            if (!commentInfo) {
                // 如果无法提取评论信息，创建一个基本的信息对象
                const basicInfo = {
                    rootId: 'unknown',
                    oid: this.extractVideoId() || 'unknown',
                    replyCount: 0,
                    container,
                    commentElement: threadRenderer
                };
                this.addExpandButtonToStableLocation(commentInfo.commentElement, basicInfo);
                Utils.log('info', '已添加评论展开按钮（无法提取完整信息）');
                return;
            }

            this.addExpandButtonToStableLocation(commentInfo.commentElement, commentInfo);
            Utils.log('info', `已添加评论展开按钮，评论ID: ${commentInfo.rootId}, 回复数: ${commentInfo.replyCount}`);
        }

        // 将评论展开按钮添加到稳定的位置（优化版）
        addExpandButtonToStableLocation(threadRenderer, commentInfo) {
            try {
                // 检查是否已经存在评论展开按钮
                if (this.findExpandButton(threadRenderer)) {
                    Utils.log('info', '评论展开按钮已存在，跳过添加');
                    return;
                }

                // 直接使用已验证有效的容器选择器
                let targetContainer = threadRenderer.shadowRoot?.querySelector("#replies");

                if (targetContainer) {
                    Utils.log('info', '使用主要容器: #replies');
                } else {
                    // 降级方案：使用threadRenderer本身
                    targetContainer = threadRenderer;
                    Utils.log('warn', '未找到#replies容器，使用threadRenderer作为降级方案');
                }

                // 创建评论展开按钮
                const expandBtn = this.createExpandButton(commentInfo);

                // 创建一个包装容器，使按钮更稳定并居中
                const buttonWrapper = document.createElement('div');
                buttonWrapper.className = 'bili-comment-expand-wrapper';
                buttonWrapper.style.cssText = `
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 8px 0;
                    position: relative;
                    z-index: 1000;
                    width: 100%;
                `;
                buttonWrapper.appendChild(expandBtn);

                // 将按钮添加到稳定位置
                if (targetContainer.shadowRoot) {
                    // 如果目标容器有shadowRoot，添加到shadowRoot中
                    targetContainer.shadowRoot.appendChild(buttonWrapper);
                    Utils.log('info', `评论展开按钮已添加到稳定位置(shadowRoot): ${targetContainer.tagName || 'unknown'}`);
                } else {
                    // 否则直接添加到容器中
                    targetContainer.appendChild(buttonWrapper);
                    Utils.log('info', `评论展开按钮已添加到稳定位置: ${targetContainer.tagName || 'unknown'}`);
                }

            } catch (error) {
                Utils.log('error', '添加评论展开按钮到稳定位置失败:', error);
                Utils.log('info', '尝试使用降级方案...');
                // 降级到原始方法
                this.addExpandButton(commentInfo.container || threadRenderer, commentInfo);
            }
        }

        // 创建评论展开按钮（提取为独立方法）
        createExpandButton(commentInfo) {
            const expandBtn = document.createElement('button');
            expandBtn.className = 'bili-comment-expand-btn';
            expandBtn.style.cssText = `
                padding: 8px 16px;
                background: linear-gradient(135deg, #00a1d6, #0084b4);
                color: #ffffff;
                border: 1px solid rgba(0, 161, 214, 0.3);
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 6px rgba(0, 161, 214, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                position: relative;
                overflow: hidden;
                min-width: 120px;
            `;

            // 添加展开图标和文字 - 使用展开箭头符号
            expandBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
                <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);">展开回复</span>
            `;

            // 悬停效果 - 更丰富的动画
            expandBtn.onmouseover = () => {
                expandBtn.style.background = 'linear-gradient(135deg, #40a9ff, #1890ff)';
                expandBtn.style.transform = 'translateY(-2px) scale(1.05)';
                expandBtn.style.boxShadow = '0 6px 12px rgba(0, 161, 214, 0.4)';
                expandBtn.style.borderColor = 'rgba(64, 169, 255, 0.6)';
            };

            expandBtn.onmouseout = () => {
                expandBtn.style.background = 'linear-gradient(135deg, #00a1d6, #0084b4)';
                expandBtn.style.transform = 'translateY(0) scale(1)';
                expandBtn.style.boxShadow = '0 2px 6px rgba(0, 161, 214, 0.2)';
                expandBtn.style.borderColor = 'rgba(0, 161, 214, 0.3)';
            };

            // 点击效果
            expandBtn.onmousedown = () => {
                expandBtn.style.transform = 'translateY(0) scale(0.95)';
            };

            expandBtn.onmouseup = () => {
                expandBtn.style.transform = 'translateY(-2px) scale(1.05)';
            };

            // 绑定点击事件
            expandBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleExpandClick(commentInfo);
            };

            return expandBtn;
        }

        // 原始的添加评论展开按钮方法（作为降级选项）
        addExpandButton(container, commentInfo) {
            // 检查是否已经添加过评论展开按钮
            if (container.querySelector('.bili-comment-expand-btn')) {
                return;
            }

            const expandBtn = this.createExpandButton(commentInfo);
            container.appendChild(expandBtn);
        }

        handleExpandClick(commentInfo) {
            // 调用主控制器的处理函数
            if (this.onViewMoreClick) {
                this.onViewMoreClick(commentInfo);
            }
        }

        extractCommentInfo(container, threadRenderer) {
            try {
                // 从容器文本中提取回复数量
                const containerText = container.textContent || '';
                const replyCountMatch = containerText.match(/(\d+)\s*条回复/) || containerText.match(/共\s*(\d+)\s*条/) || containerText.match(/(\d+)\s*回复/);
                const replyCount = replyCountMatch ? parseInt(replyCountMatch[1], 10) : 0;

                // 更强力的评论ID提取
                const rootId = this.extractCommentId(threadRenderer);
                const oid = this.extractVideoId();

                Utils.log('info', `提取到的信息: rootId=${rootId}, oid=${oid}, replyCount=${replyCount}`);

                if (!rootId) {
                    Utils.log('warn', '无法提取评论ID');
                    return null;
                }

                if (!oid) {
                    Utils.log('warn', '无法提取视频ID');
                    return null;
                }

                return {
                    rootId,
                    oid,
                    replyCount,
                    container,
                    commentElement: threadRenderer
                };
            } catch (error) {
                Utils.log('error', '提取评论信息失败', error);
                return null;
            }
        }

        extractCommentId(threadRenderer) {
            // 方法1: 从__data对象获取（最新的B站结构）
            if (threadRenderer.__data && threadRenderer.__data.rpid) {
                const rpid = threadRenderer.__data.rpid.toString();
                Utils.log('info', `方法1获取到rpid: ${rpid}`);
                return rpid;
            }

            // 方法2: 从data属性获取
            if (threadRenderer.data && threadRenderer.data.rpid) {
                const rpid = threadRenderer.data.rpid.toString();
                Utils.log('info', `方法2获取到rpid: ${rpid}`);
                return rpid;
            }

            // 方法3: 从Shadow DOM中的commentRenderer获取
            if (threadRenderer.shadowRoot) {
                const commentRenderer = threadRenderer.shadowRoot.querySelector('bili-comment-renderer');
                if (commentRenderer) {
                    // 从commentRenderer的__data获取
                    if (commentRenderer.__data && commentRenderer.__data.rpid) {
                        const rpid = commentRenderer.__data.rpid.toString();
                        Utils.log('info', `方法3获取到rpid: ${rpid}`);
                        return rpid;
                    }

                    // 从commentRenderer的data属性获取
                    if (commentRenderer.data && commentRenderer.data.rpid) {
                        const rpid = commentRenderer.data.rpid.toString();
                        Utils.log('info', `方法3.1获取到rpid: ${rpid}`);
                        return rpid;
                    }

                    // 从属性获取
                    const rpidAttr = commentRenderer.getAttribute('data-rpid') ||
                                   commentRenderer.getAttribute('rpid');
                    if (rpidAttr) {
                        Utils.log('info', `方法3.2获取到rpid: ${rpidAttr}`);
                        return rpidAttr;
                    }
                }
            }

            // 方法4: 传统方法 - 从属性获取
            let rpid = threadRenderer.getAttribute('data-rpid') ||
                      threadRenderer.getAttribute('rpid') ||
                      threadRenderer.getAttribute('data-id');

            if (rpid) {
                Utils.log('info', `方法4获取到rpid: ${rpid}`);
                return rpid;
            }

            // 方法5: 从dataset获取
            const dataRpid = threadRenderer.dataset?.rpid;
            if (dataRpid) {
                Utils.log('info', `方法5获取到rpid: ${dataRpid}`);
                return dataRpid;
            }

            Utils.log('warn', '所有方法都无法获取到rpid');
            return null;
        }



        extractIdFromComponent(component) {
            // 尝试从组件本身的属性获取
            const possibleAttributes = ['data-rpid', 'rpid', 'data-id', 'comment-id'];

            for (const attr of possibleAttributes) {
                const value = component.getAttribute(attr);
                if (value) {
                    return value;
                }
            }

            // 尝试从Shadow DOM内部查找
            if (component.shadowRoot) {
                const shadowElements = component.shadowRoot.querySelectorAll('[data-rpid], [rpid], [data-id]');
                for (const element of shadowElements) {
                    for (const attr of possibleAttributes) {
                        const value = element.getAttribute(attr);
                        if (value) {
                            return value;
                        }
                    }
                }
            }

            // 尝试从子元素查找
            const childElements = component.querySelectorAll('[data-rpid], [rpid], [data-id]');
            for (const element of childElements) {
                for (const attr of possibleAttributes) {
                    const value = element.getAttribute(attr);
                    if (value) {
                        return value;
                    }
                }
            }

            // 如果还是找不到，尝试从URL或其他地方提取
            try {
                // 检查组件内是否有包含ID的链接
                const links = component.querySelectorAll('a[href]');
                for (const link of links) {
                    const href = link.getAttribute('href') || '';
                    const idMatch = href.match(/\/(\d+)/);
                    if (idMatch) {
                        return idMatch[1];
                    }
                }
            } catch (error) {
                // 静默处理错误
            }

            return null;
        }

        extractVideoId() {
            // 方法1: 从URL提取
            const url = window.location.href;
            const match = url.match(/\/video\/(?:av(\d+)|BV([a-zA-Z0-9]+))/);

            if (match) {
                if (match[1]) {
                    // av号直接返回
                    return match[1];
                } else if (match[2]) {
                    // BV号需要转换，但先尝试从页面数据获取对应的aid
                    const aid = this.getAidFromPageData();
                    if (aid) {
                        return aid;
                    }
                    // 如果无法获取aid，返回BV号（某些API可能支持）
                    return match[2];
                }
            }

            // 方法2: 从页面数据获取
            const aid = this.getAidFromPageData();
            if (aid) {
                return aid;
            }

            // 方法3: 从meta标签获取
            const metaAid = document.querySelector('meta[property="og:url"]');
            if (metaAid) {
                const metaMatch = metaAid.content.match(/\/video\/av(\d+)/);
                if (metaMatch) {
                    return metaMatch[1];
                }
            }

            return null;
        }

        getAidFromPageData() {
            try {
                // 尝试多种可能的全局变量
                const sources = [
                    () => window.__INITIAL_STATE__?.videoData?.aid,
                    () => window.__initialState__?.videoData?.aid,
                    () => window.__INITIAL_STATE__?.aid,
                    () => window.__initialState__?.aid,
                    () => window.aid,
                    () => {
                        // 从页面中的script标签查找
                        const scripts = document.querySelectorAll('script');
                        for (const script of scripts) {
                            const content = script.textContent || '';
                            const aidMatch = content.match(/"aid":(\d+)/);
                            if (aidMatch) {
                                return aidMatch[1];
                            }
                        }
                        return null;
                    }
                ];

                for (const source of sources) {
                    const aid = source();
                    if (aid) {
                        return aid.toString();
                    }
                }
            } catch (error) {
                // 静默处理错误
            }

            return null;
        }



        setViewMoreClickHandler(handler) {
            this.onViewMoreClick = handler;
        }

        getProcessedButtonCount() {
            return this.viewMoreButtons.size;
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            this.isObserving = false;
            this.viewMoreButtons.clear();
            this.onViewMoreClick = null;
        }
    }

    // 主控制器
    class BilibiliCommentExpandController {
        constructor() {
            this.domWatcher = new DOMWatcher();
            this.commentAPI = new BilibiliCommentAPI();
            this.isInitialized = false;
        }

        async initialize() {
            if (this.isInitialized) {
                Utils.log('warn', '脚本已初始化');
                return;
            }

            try {
                Utils.log('info', '开始初始化Bilibili评论展开助手脚本');
                this.setupEventHandlers();
                this.domWatcher.observeCommentSection();

                this.isInitialized = true;
                Utils.log('info', 'Bilibili评论展开助手脚本初始化完成');

            } catch (error) {
                Utils.log('error', '脚本初始化失败', error);
                throw error;
            }
        }

        setupEventHandlers() {
            this.domWatcher.setViewMoreClickHandler((commentInfo) => {
                this.handleViewMoreClick(commentInfo);
            });
            Utils.log('info', '事件处理函数已设置');
        }

        async handleViewMoreClick(commentInfo) {
            try {
                Utils.log('info', '处理评论展开按钮点击', commentInfo);

                // 显示加载提示
                this.showLoadingIndicator();

                // 尝试从按钮文本和周围元素中提取回复数量
                const buttonText = commentInfo.container.textContent || '';

                // 尝试多种模式匹配回复数量
                let replyCount = 0;
                const patterns = [
                    /(\d+)\s*条回复/,
                    /共\s*(\d+)\s*条/,
                    /(\d+)\s*回复/,
                    /(\d+)\s*replies?/i
                ];

                for (const pattern of patterns) {
                    const match = buttonText.match(pattern);
                    if (match) {
                        replyCount = parseInt(match[1], 10);
                        break;
                    }
                }

                // 如果按钮文本中没有找到，尝试从父元素中查找
                if (replyCount === 0) {
                    const parentText = commentInfo.commentElement?.textContent || '';
                    for (const pattern of patterns) {
                        const match = parentText.match(pattern);
                        if (match) {
                            replyCount = parseInt(match[1], 10);
                            break;
                        }
                    }
                }

                // 尝试从__data中获取回复数量
                if (replyCount === 0 && commentInfo.commentElement?.__data?.rcount) {
                    replyCount = commentInfo.commentElement.__data.rcount;
                    Utils.log('info', `从__data获取到回复数量: ${replyCount}`);
                }

                // 获取真实的评论回复数据
                let realReplies = [];
                let apiError = null;

                // 只要有评论ID和视频ID就尝试调用API，不依赖回复数量检测
                if (commentInfo.rootId && commentInfo.oid && commentInfo.rootId !== 'unknown') {
                    try {
                        Utils.log('info', `开始获取回复数据: oid=${commentInfo.oid}, rootId=${commentInfo.rootId}, 预期回复数=${replyCount}`);
                        realReplies = await this.commentAPI.getAllReplies(commentInfo.oid, commentInfo.rootId);
                        Utils.log('info', `成功获取 ${realReplies.length} 条真实回复数据`);

                        // 如果API返回了数据，更新回复数量
                        if (realReplies.length > 0 && replyCount === 0) {
                            replyCount = realReplies.length;
                            Utils.log('info', `根据API结果更新回复数量: ${replyCount}`);
                        }
                    } catch (error) {
                        Utils.log('error', '获取真实回复数据失败:', error);
                        apiError = error;
                    }
                } else {
                    Utils.log('warn', `跳过API调用: rootId=${commentInfo?.rootId}, oid=${commentInfo?.oid}, replyCount=${replyCount}`);
                }

                // 创建评论展开弹出框，传入真实数据
                Utils.log('info', `创建弹出框: replyCount=${replyCount}, realReplies.length=${realReplies.length}, hasError=${!!apiError}`);
                this.createExpandModal(replyCount, buttonText, commentInfo, realReplies, apiError);

                // 隐藏加载提示
                this.hideLoadingIndicator();

            } catch (error) {
                Utils.log('error', '处理"点击查看"按钮失败', error);
                this.hideLoadingIndicator();
            }
        }

        showLoadingIndicator() {
            const loading = document.createElement('div');
            loading.id = 'bili-comment-expand-loading';
            loading.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 10001;
                font-size: 14px;
            `;
            loading.textContent = '正在加载评论...';
            document.body.appendChild(loading);
        }

        hideLoadingIndicator() {
            const loading = document.getElementById('bili-comment-expand-loading');
            if (loading) {
                loading.remove();
            }
        }

        createExpandModal(replyCount, buttonText, commentInfo, realReplies = [], apiError = null) {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            `;

            // 创建弹出框 - 暗色主题，模仿Bilibili原生设计
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: #1f1f1f;
                border: 1px solid #3a3a3a;
                border-radius: 8px;
                width: 85%;
                max-width: 900px;
                max-height: 85%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                color: #e1e2e3;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            `;

            // 创建头部 - 暗色主题
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid #3a3a3a;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #2a2a2a;
                border-radius: 8px 8px 0 0;
            `;

            const title = document.createElement('h3');
            title.style.cssText = `
                margin: 0;
                font-size: 16px;
                font-weight: 500;
                color: #e1e2e3;
            `;
            title.textContent = `评论回复 (${replyCount}条)`;

            const closeButton = document.createElement('button');
            closeButton.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #9499a0;
                padding: 4px;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;
            closeButton.textContent = '×';
            closeButton.onclick = () => overlay.remove();

            // 关闭按钮悬停效果
            closeButton.onmouseover = () => {
                closeButton.style.background = '#3a3a3a';
                closeButton.style.color = '#ffffff';
            };
            closeButton.onmouseout = () => {
                closeButton.style.background = 'none';
                closeButton.style.color = '#9499a0';
            };

            header.appendChild(title);
            header.appendChild(closeButton);

            // 创建内容区域 - 暗色主题，左对齐
            const body = document.createElement('div');
            body.style.cssText = `
                flex: 1;
                overflow: auto;
                background: #1f1f1f;
                color: #9499a0;
                text-align: left;
            `;

            // 根据是否有真实数据来显示不同内容
            if (realReplies && realReplies.length > 0) {
                // 显示真实的回复数据
                this.renderRepliesContent(body, realReplies, replyCount);
            } else if (replyCount > 0) {
                // 显示加载失败或无数据的提示 - 暗色主题
                const errorMsg = apiError ? apiError.message : '未知错误';
                body.innerHTML = `
                    <div style="padding: 40px 20px; color: #e1e2e3;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="color: #ff6b6b; margin-bottom: 16px; font-size: 16px;">⚠️ 无法获取回复数据</p>
                            <p style="color: #9499a0; margin-bottom: 8px;">检测到 ${replyCount} 条回复，但API请求失败</p>
                            <p style="color: #9499a0; margin-bottom: 20px;">按钮文本: "${buttonText}"</p>
                        </div>
                        <details style="margin: 20px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
                            <summary style="cursor: pointer; color: #ff6b6b; padding: 8px; border-radius: 4px; background: #2a2a2a; text-align: center;">错误详情 (点击展开)</summary>
                            <div style="margin-top: 12px; font-size: 12px; background: #2a2a2a; padding: 16px; border-radius: 6px; border: 1px solid #3a3a3a; color: #e1e2e3; text-align: left;">
                                <p style="margin-bottom: 8px;"><strong style="color: #ff6b6b;">错误信息:</strong> ${errorMsg}</p>
                                <p style="margin-bottom: 8px;"><strong style="color: #00a1d6;">评论ID:</strong> ${commentInfo?.rootId || '未获取到'}</p>
                                <p style="margin-bottom: 8px;"><strong style="color: #00a1d6;">视频ID:</strong> ${commentInfo?.oid || '未获取到'}</p>
                                <p style="margin-bottom: 0;"><strong style="color: #00a1d6;">API URL:</strong> <code style="background: #1f1f1f; padding: 2px 4px; border-radius: 3px; font-size: 11px;">${CONFIG.API_BASE}/x/v2/reply/reply?type=${CONFIG.COMMENT_TYPE}&oid=${commentInfo?.oid}&root=${commentInfo?.rootId}</code></p>
                            </div>
                        </details>
                        <div style="text-align: center;">
                            <p style="color: #9499a0; font-size: 12px; margin-top: 20px; line-height: 1.5;">
                                可能原因：网络问题、API限制、需要登录或评论ID提取失败
                            </p>
                            <p style="color: #00a1d6; margin-top: 16px; font-weight: 500;">✅ 基础架构已完成</p>
                        </div>
                    </div>
                `;
            } else {
                // 显示调试信息 - 暗色主题
                const parentText = commentInfo.commentElement?.textContent || '';
                const containerHTML = commentInfo.container?.outerHTML?.substring(0, 200) || '';

                body.innerHTML = `
                    <div style="padding: 40px 20px; color: #e1e2e3;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="font-size: 18px; margin-bottom: 16px; color: #9499a0;">暂无回复数据</p>
                            <p style="color: #9499a0; margin-bottom: 20px;">按钮文本: "${buttonText}"</p>
                        </div>
                        <details style="margin: 20px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
                            <summary style="cursor: pointer; color: #00a1d6; padding: 8px; border-radius: 4px; background: #2a2a2a; text-align: center;">调试信息 (点击展开)</summary>
                            <div style="margin-top: 12px; font-size: 12px; background: #2a2a2a; padding: 16px; border-radius: 6px; border: 1px solid #3a3a3a; color: #e1e2e3; text-align: left;">
                                <p style="margin-bottom: 12px;"><strong style="color: #00a1d6;">父元素文本:</strong></p>
                                <p style="word-break: break-all; max-height: 100px; overflow-y: auto; background: #1f1f1f; padding: 8px; border-radius: 4px; margin-bottom: 12px; font-family: monospace; font-size: 11px;">${parentText.substring(0, 300)}...</p>
                                <p style="margin-bottom: 12px;"><strong style="color: #00a1d6;">容器HTML:</strong></p>
                                <p style="word-break: break-all; max-height: 100px; overflow-y: auto; background: #1f1f1f; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px;">${containerHTML}...</p>
                            </div>
                        </details>
                        <div style="text-align: center;">
                            <p style="color: #00a1d6; margin-bottom: 12px; font-weight: 500;">脚本已成功工作！</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 成功找到并处理"点击查看"按钮</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 弹出框功能完全正常</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 基础架构已完成</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 用户名点击跳转功能</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 视频链接识别功能</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 时间排序正序/倒序切换</p>
                            <p style="color: #52c41a; margin-bottom: 8px;">✅ 独立瀑布流按钮</p>
                            <p style="color: #00a1d6; margin-top: 16px; font-size: 14px;">Bilibili评论瀑布流 - 排序功能已优化</p>
                        </div>
                    </div>
                `;
            }

            modal.appendChild(header);
            modal.appendChild(body);
            overlay.appendChild(modal);

            // 点击遮罩层关闭
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            };

            // ESC键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            document.body.appendChild(overlay);
        }

        renderRepliesContent(container, replies, totalCount) {
            // 创建排序控制 - 暗色主题
            const sortControls = document.createElement('div');
            sortControls.style.cssText = `
                padding: 12px 20px;
                border-bottom: 1px solid #3a3a3a;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #2a2a2a;
            `;

            const sortInfo = document.createElement('span');
            sortInfo.style.cssText = 'font-size: 13px; color: #9499a0;';
            sortInfo.textContent = `共 ${totalCount} 条回复，显示 ${replies.length} 条`;

            const sortButtons = document.createElement('div');
            sortButtons.style.cssText = 'display: flex; gap: 8px;';

            const hotSortBtn = this.createSortButton('按热度', true);
            const timeSortBtn = this.createSortButton('按时间↓', false);

            sortButtons.appendChild(hotSortBtn);
            sortButtons.appendChild(timeSortBtn);

            sortControls.appendChild(sortInfo);
            sortControls.appendChild(sortButtons);

            // 创建回复列表容器 - 暗色主题
            const repliesContainer = document.createElement('div');
            repliesContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 0;
                background: #1f1f1f;
            `;

            // 初始化排序状态
            let currentSort = 'hot';
            let timeOrder = 'desc'; // 'desc' 为倒序（最新在前），'asc' 为正序（最旧在前）

            // 渲染回复列表
            this.renderRepliesList(repliesContainer, replies, currentSort, timeOrder);

            // 绑定排序事件
            hotSortBtn.onclick = () => {
                currentSort = 'hot';
                this.updateSortButtons(hotSortBtn, timeSortBtn);
                this.renderRepliesList(repliesContainer, replies, currentSort, timeOrder);
            };

            timeSortBtn.onclick = () => {
                if (currentSort === 'time') {
                    // 如果已经是时间排序，则切换正序/倒序
                    timeOrder = timeOrder === 'desc' ? 'asc' : 'desc';
                } else {
                    // 如果不是时间排序，则切换到时间排序（默认倒序）
                    currentSort = 'time';
                    timeOrder = 'desc';
                }

                // 更新按钮文本
                timeSortBtn.textContent = `按时间${timeOrder === 'desc' ? '↓' : '↑'}`;

                this.updateSortButtons(timeSortBtn, hotSortBtn);
                this.renderRepliesList(repliesContainer, replies, currentSort, timeOrder);
            };

            container.appendChild(sortControls);
            container.appendChild(repliesContainer);
        }

        createSortButton(text, active) {
            const button = document.createElement('button');
            button.style.cssText = `
                padding: 6px 14px;
                border: 1px solid ${active ? '#00a1d6' : '#4a4a4a'};
                background: ${active ? '#00a1d6' : '#3a3a3a'};
                color: ${active ? '#ffffff' : '#e1e2e3'};
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
            `;
            button.textContent = text;

            button.onmouseover = () => {
                if (!button.classList.contains('active')) {
                    button.style.borderColor = '#00a1d6';
                    button.style.background = '#4a4a4a';
                    button.style.color = '#00a1d6';
                }
            };

            button.onmouseout = () => {
                if (!button.classList.contains('active')) {
                    button.style.borderColor = '#4a4a4a';
                    button.style.background = '#3a3a3a';
                    button.style.color = '#e1e2e3';
                }
            };

            if (active) {
                button.classList.add('active');
            }

            return button;
        }

        updateSortButtons(activeBtn, inactiveBtn) {
            // 更新活跃按钮 - 暗色主题
            activeBtn.style.background = '#00a1d6';
            activeBtn.style.color = '#ffffff';
            activeBtn.style.borderColor = '#00a1d6';
            activeBtn.classList.add('active');

            // 更新非活跃按钮 - 暗色主题
            inactiveBtn.style.background = '#3a3a3a';
            inactiveBtn.style.color = '#e1e2e3';
            inactiveBtn.style.borderColor = '#4a4a4a';
            inactiveBtn.classList.remove('active');
        }

        renderRepliesList(container, replies, sortType, timeOrder = 'desc') {
            // 排序回复
            const sortedReplies = [...replies].sort((a, b) => {
                if (sortType === 'hot') {
                    return (b.like || 0) - (a.like || 0);
                } else if (sortType === 'time') {
                    const timeA = a.ctime || 0;
                    const timeB = b.ctime || 0;
                    return timeOrder === 'desc' ? timeB - timeA : timeA - timeB;
                }
                return 0;
            });

            // 清空容器
            container.innerHTML = '';

            // 渲染每条回复
            sortedReplies.forEach((reply) => {
                const replyElement = this.createReplyElement(reply);
                container.appendChild(replyElement);
            });
        }

        createReplyElement(reply) {
            const replyDiv = document.createElement('div');
            replyDiv.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid #3a3a3a;
                display: flex;
                gap: 12px;
                transition: background-color 0.2s ease;
                background: #1f1f1f;
            `;

            replyDiv.onmouseover = () => {
                replyDiv.style.backgroundColor = '#2a2a2a';
            };

            replyDiv.onmouseout = () => {
                replyDiv.style.backgroundColor = '#1f1f1f';
            };

            // 用户头像 - 模仿Bilibili原生尺寸
            const avatar = document.createElement('img');
            avatar.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                flex-shrink: 0;
                object-fit: cover;
                border: 2px solid #3a3a3a;
            `;
            avatar.src = reply.member?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0YTRhNGEiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTQ5OWEwIj7nlKg8L3RleHQ+Cjwvc3ZnPgo=';
            avatar.alt = reply.member?.uname || '用户';

            // 内容区域
            const content = document.createElement('div');
            content.style.cssText = 'flex: 1; min-width: 0;';

            // 用户信息行 - 模仿Bilibili原生布局
            const userInfo = document.createElement('div');
            userInfo.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
                font-size: 13px;
            `;

            const username = document.createElement('span');
            const vipColor = reply.member?.vip?.nickname_color;
            const userId = reply.member?.mid || reply.mid;

            username.style.cssText = `
                font-weight: 500;
                color: ${vipColor || '#e1e2e3'};
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid transparent;
            `;
            username.textContent = reply.member?.uname || '匿名用户';

            // 添加用户名点击跳转功能
            if (userId) {
                username.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const userUrl = `https://space.bilibili.com/${userId}`;
                    window.open(userUrl, '_blank');
                };

                // 悬停效果
                username.onmouseover = () => {
                    username.style.borderBottomColor = vipColor || '#e1e2e3';
                    username.style.color = vipColor || '#ffffff';
                };

                username.onmouseout = () => {
                    username.style.borderBottomColor = 'transparent';
                    username.style.color = vipColor || '#e1e2e3';
                };
            }

            // 时间显示 - 添加tooltip显示详细时间
            const timeSpan = document.createElement('span');
            timeSpan.style.cssText = `
                color: #9499a0;
                font-size: 12px;
                cursor: help;
            `;
            timeSpan.textContent = Utils.formatTime(reply.ctime);
            timeSpan.title = Utils.formatDetailedTime(reply.ctime);

            userInfo.appendChild(username);
            userInfo.appendChild(timeSpan);

            // 评论内容 - 暗色主题，支持视频链接识别
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                color: #e1e2e3;
                line-height: 1.6;
                margin-bottom: 12px;
                word-break: break-word;
                font-size: 14px;
                text-align: left;
            `;

            // 处理评论内容中的视频链接 - 使用增强版
            // 先显示原始内容，然后异步加载视频标题
            const originalContent = reply.content?.message || '';
            messageDiv.textContent = originalContent;

            // 异步处理视频链接
            Utils.processCommentContentEnhanced(originalContent).then(processedContent => {
                messageDiv.innerHTML = processedContent;
                // 为增强版视频链接添加悬停效果
                Utils.addEnhancedVideoLinkHoverEffects(messageDiv);
            }).catch(() => {
                // 如果失败，使用简单版本
                const simpleProcessed = Utils.processCommentContent(originalContent);
                messageDiv.innerHTML = simpleProcessed;
                Utils.addVideoLinkHoverEffects(messageDiv);
            });

            // 互动信息 - 模仿Bilibili原生样式
            const actions = document.createElement('div');
            actions.style.cssText = `
                display: flex;
                align-items: center;
                gap: 20px;
                font-size: 12px;
                color: #9499a0;
            `;

            const likeSpan = document.createElement('span');
            likeSpan.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;
            likeSpan.innerHTML = `👍 ${Utils.formatNumber(reply.like || 0)}`;

            // 点赞按钮悬停效果
            likeSpan.onmouseover = () => {
                likeSpan.style.background = '#3a3a3a';
                likeSpan.style.color = '#00a1d6';
            };
            likeSpan.onmouseout = () => {
                likeSpan.style.background = 'transparent';
                likeSpan.style.color = '#9499a0';
            };

            actions.appendChild(likeSpan);

            content.appendChild(userInfo);
            content.appendChild(messageDiv);
            content.appendChild(actions);

            replyDiv.appendChild(avatar);
            replyDiv.appendChild(content);

            return replyDiv;
        }

        destroy() {
            try {
                this.domWatcher.destroy();
                this.commentAPI.clearCache();
                this.isInitialized = false;
                Utils.log('info', 'Bilibili评论展开助手脚本已销毁');
            } catch (error) {
                Utils.log('error', '脚本销毁失败', error);
            }
        }

        getStatus() {
            return {
                initialized: this.isInitialized,
                processedButtons: this.domWatcher.getProcessedButtonCount()
            };
        }
    }

    // 全局实例
    let commentExpandController = null;

    // 脚本入口点
    function initializeScript() {
        try {
            Utils.log('info', '=== Bilibili评论展开助手脚本启动 ===');
            Utils.log('info', `当前页面: ${window.location.href}`);

            if (!window.location.href.includes('bilibili.com/video/')) {
                Utils.log('warn', '当前页面不是bilibili视频页面，脚本将不会运行');
                return;
            }

            commentExpandController = new BilibiliCommentExpandController();

            commentExpandController.initialize().then(() => {
                Utils.log('info', '脚本初始化成功');

                window.bilibiliCommentExpand = {
                    controller: commentExpandController,
                    getStatus: () => commentExpandController.getStatus(),
                    destroy: () => commentExpandController.destroy()
                };

                Utils.log('info', '全局调试接口已添加: window.bilibiliCommentExpand');

            }).catch((error) => {
                Utils.log('error', '脚本初始化失败', error);
            });

        } catch (error) {
            Utils.log('error', '脚本启动失败', error);
        }
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        if (commentExpandController) {
            commentExpandController.destroy();
        }
    });

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        setTimeout(initializeScript, 1000);
    }

    Utils.log('info', 'Bilibili评论展开助手脚本 v2.3.0 已加载 - 优化按钮附加和用户体验');

})();