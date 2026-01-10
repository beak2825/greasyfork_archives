// ==UserScript==
// @name         Linux.do 智能点赞助手
// @namespace    https://linux.do/
// @version      3.0.0
// @description  Linux.do智能点赞工具，支持随机延迟、随机数量、自动模式
// @author       mumu
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562030/Linuxdo%20%E6%99%BA%E8%83%BD%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562030/Linuxdo%20%E6%99%BA%E8%83%BD%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置管理
    const Config = {
        get(key, defaultValue) {
            return GM_getValue(key, defaultValue);
        },
        set(key, value) {
            GM_setValue(key, value);
        }
    };

    // 样式定义
    const STYLES = `
        :root {
            --sl-panel-bg: #ffffff;
            --sl-panel-text: #333333;
            --sl-panel-border: #e0e0e0;
            --sl-input-bg: #ffffff;
            --sl-input-border: #dddddd;
            --sl-section-bg: #f8f9fa;
            --sl-label: #555555;
            --sl-shadow: rgba(0,0,0,0.2);
            --sl-status-info-bg: #e3f2fd; --sl-status-info-text: #1976d2;
            --sl-status-success-bg: #e8f5e9; --sl-status-success-text: #388e3c;
            --sl-status-error-bg: #ffebee; --sl-status-error-text: #d32f2f;
            --sl-status-warning-bg: #fff3e0; --sl-status-warning-text: #f57c00;
        }

        html.dark-scheme, html[data-theme="dark"] {
            --sl-panel-bg: rgba(30, 30, 30, 0.93);
            --sl-panel-text: #e0e0e0;
            --sl-panel-border: #3a3a3a;
            --sl-input-bg: #2a2a2a;
            --sl-input-border: #4a4a4a;
            --sl-section-bg: #2a2a2a;
            --sl-label: #b0b0b0;
            --sl-shadow: rgba(0,0,0,0.5);
            --sl-status-info-bg: #1e3a5f; --sl-status-info-text: #64b5f6;
            --sl-status-success-bg: #1e4620; --sl-status-success-text: #81c784;
            --sl-status-error-bg: #4a1a1a; --sl-status-error-text: #e57373;
            --sl-status-warning-bg: #4a3a1a; --sl-status-warning-text: #ffb74d;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) {
                --sl-panel-bg: rgba(30, 30, 30, 0.93);
                --sl-panel-text: #e0e0e0;
                --sl-panel-border: #3a3a3a;
                --sl-input-bg: #2a2a2a;
                --sl-input-border: #4a4a4a;
                --sl-section-bg: #2a2a2a;
                --sl-label: #b0b0b0;
                --sl-shadow: rgba(0,0,0,0.5);
                --sl-status-info-bg: #1e3a5f; --sl-status-info-text: #64b5f6;
                --sl-status-success-bg: #1e4620; --sl-status-success-text: #81c784;
                --sl-status-error-bg: #4a1a1a; --sl-status-error-text: #e57373;
                --sl-status-warning-bg: #4a3a1a; --sl-status-warning-text: #ffb74d;
            }
        }

        #smart-like-btn {
            position: fixed;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: move;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transition: transform 0.3s;
            user-select: none;
        }
        #smart-like-btn:hover { transform: scale(1.1); }
        #smart-like-btn.auto-on { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        #smart-like-btn.auto-off { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

        #smart-like-panel {
            position: fixed;
            width: 360px;
            box-sizing: border-box;
            background: var(--sl-panel-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
            box-shadow: 0 8px 32px var(--sl-shadow);
            z-index: 9998;
            display: none;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid var(--sl-panel-border);
            opacity: 1;
            transform-origin: center;
            transition: opacity 0.2s, transform 0.2s;
        }

        .sl-header { margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
        .sl-header h3 { margin: 0 0 5px 0; color: var(--sl-panel-text); font-size: 18px; }
        .sl-header p { margin: 0; color: var(--sl-label); font-size: 11px; }

        .sl-close-btn {
            background: none; border: none; color: var(--sl-label);
            font-size: 20px; cursor: pointer; padding: 0 5px;
            line-height: 1; opacity: 0.6; transition: opacity 0.2s;
        }
        .sl-close-btn:hover { opacity: 1; }

        .sl-section { margin-bottom: 15px; padding: 12px; background: var(--sl-section-bg); border-radius: 6px; font-size: 12px; }
        .sl-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .sl-label { color: var(--sl-label); }

        .sl-toggle { position: relative; display: inline-block; width: 50px; height: 24px; }
        .sl-toggle input { opacity: 0; width: 0; height: 0; }
        .sl-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.4s; border-radius: 24px; }
        .sl-toggle-knob { position: absolute; content: ''; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: 0.4s; border-radius: 50%; }
        .sl-toggle input:checked + .sl-toggle-slider { background-color: #11998e; }
        .sl-toggle input:checked + .sl-toggle-slider .sl-toggle-knob { transform: translateX(26px); }

        .sl-form-group { margin-bottom: 12px; }
        .sl-form-label { display: block; margin-bottom: 5px; color: var(--sl-label); font-size: 13px; }
        .sl-input {
            width: 100%; padding: 8px; border: 1px solid var(--sl-input-border);
            border-radius: 6px; font-size: 14px; background: var(--sl-input-bg);
            color: var(--sl-panel-text); box-sizing: border-box;
        }
        .sl-grid-input { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; }

        .sl-btn-primary {
            width: 100%; padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; border-radius: 8px;
            font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 8px;
        }
        .sl-btn-stop { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); }

        .sl-progress-container { display: none; margin-bottom: 12px; padding: 10px; background: var(--sl-section-bg); border-radius: 6px; }
        .sl-progress-info { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: var(--sl-label); }
        .sl-progress-track { width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
        .sl-progress-bar { width: 0%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s; }

        .sl-status-msg { margin-top: 12px; padding: 10px; border-radius: 6px; font-size: 12px; display: none; }
        .sl-status-info { background: var(--sl-status-info-bg); color: var(--sl-status-info-text); }
        .sl-status-success { background: var(--sl-status-success-bg); color: var(--sl-status-success-text); }
        .sl-status-error { background: var(--sl-status-error-bg); color: var(--sl-status-error-text); }
        .sl-status-warning { background: var(--sl-status-warning-bg); color: var(--sl-status-warning-text); }
    `;

    /**
     * Linux.do 智能点赞API类
     */
    class SmartLikeAPI {
        constructor() {
            this.baseUrl = 'https://linux.do';
            this.csrfToken = null;
            this.isRunning = false;
            this.cooldownEndTime = Config.get('cooldownEndTime', 0);
            this.initCSRF();
        }

        /**
         * 检查是否在冷却期
         */
        isInCooldown() {
            const now = Date.now();
            return now < this.cooldownEndTime;
        }

        /**
         * 获取剩余冷却时间（秒）
         */
        getCooldownRemaining() {
            if (!this.isInCooldown()) {
                return 0;
            }
            return Math.ceil((this.cooldownEndTime - Date.now()) / 1000);
        }

        /**
         * 格式化冷却时间
         */
        formatCooldownTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            if (hours > 0) {
                return `${hours}小时${minutes}分钟`;
            } else if (minutes > 0) {
                return `${minutes}分钟${secs}秒`;
            } else {
                return `${secs}秒`;
            }
        }

        /**
         * 设置冷却时间
         */
        setCooldown(waitSeconds) {
            this.cooldownEndTime = Date.now() + (waitSeconds * 1000);
            Config.set('cooldownEndTime', this.cooldownEndTime);
            console.log(`⏰ 冷却已设置: ${this.formatCooldownTime(waitSeconds)}`);
        }

        /**
         * 清除冷却
         */
        clearCooldown() {
            this.cooldownEndTime = 0;
            Config.set('cooldownEndTime', 0);
            console.log('✅ 冷却已清除');
        }

        initCSRF() {
            const metaToken = document.querySelector('meta[name="csrf-token"]');
            if (metaToken) {
                this.csrfToken = metaToken.content;
                console.log('✅ CSRF Token已获取');
                return;
            }

            if (typeof Discourse !== 'undefined' && Discourse.Session) {
                this.csrfToken = Discourse.Session.currentProp('csrfToken');
                if (this.csrfToken) {
                    console.log('✅ 从Discourse获取CSRF Token');
                    return;
                }
            }

            console.warn('⚠️ 无法获取CSRF Token');
        }

        checkCSRF() {
            if (!this.csrfToken) {
                this.initCSRF();
            }
            if (!this.csrfToken) {
                throw new Error('CSRF Token不可用');
            }
            return true;
        }

        /**
         * 切换反应
         */
        async toggleReaction(postId, reactionType = '+1') {
            this.checkCSRF();

            const url = `${this.baseUrl}/discourse-reactions/posts/${postId}/custom-reactions/${reactionType}/toggle.json`;

            const headers = {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'discourse-logged-in': 'true',
                'discourse-present': 'true',
                'x-csrf-token': this.csrfToken,
                'x-requested-with': 'XMLHttpRequest'
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                credentials: 'include'
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('响应格式错误');
            }

            const result = await response.json();

            // 检查是否触发rate_limit
            if (result.error_type === 'rate_limit') {
                const waitSeconds = result.extras?.wait_seconds || 0;
                const timeLeft = result.extras?.time_left || '未知';
                const errorMsg = result.errors?.[0] || '已达到点赞上限';

                console.warn('⚠️ 触发点赞限制:', errorMsg);
                console.warn(`⏰ 需要等待: ${timeLeft} (${waitSeconds}秒)`);

                // 设置冷却时间
                this.setCooldown(waitSeconds);

                // 抛出特殊错误
                const error = new Error(`RATE_LIMIT: ${timeLeft}`);
                error.isRateLimit = true;
                error.waitSeconds = waitSeconds;
                error.timeLeft = timeLeft;
                throw error;
            }

            // 检查其他错误
            if (result.errors && result.errors.length > 0) {
                throw new Error(result.errors[0]);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return result;
        }

        /**
         * 获取随机延迟
         */
        getRandomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * 随机选择帖子
         */
        selectRandomPosts(allPostIds, percentage) {
            const count = Math.floor(allPostIds.length * percentage / 100);
            const shuffled = [...allPostIds].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        }

        /**
         * 获取当前页面所有帖子ID
         */
        getCurrentPagePostIds() {
            const postElements = document.querySelectorAll('[data-post-id]');
            const postIds = Array.from(postElements).map(el => parseInt(el.dataset.postId));
            return [...new Set(postIds)].filter(id => !isNaN(id));
        }

        /**
         * 检查帖子是否已点赞 (DOM检测)
         */
        isPostLiked(postId) {
            // 查找帖子元素
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (!postElement) return false;

            // 1. 检查是否有 .my-reaction 类 (Discourse Reaction插件)
            if (postElement.querySelector('.reaction-button.my-reaction')) return true;

            // 2. 检查是否有 .has-like 类 (标准点赞)
            if (postElement.querySelector('.toggle-like.has-like')) return true;

            // 3. 检查是否有 title 包含 "undo" 或 "取消" 的按钮
            if (postElement.querySelector('.reaction-button[title*="undo"], .reaction-button[title*="取消"]')) return true;

            return false;
        }

        /**
         * 智能批量点赞
         */
        async smartBatchLike(options) {
            const {
                reactionType = '+1',
                delayMin = 1000,
                delayMax = 3000,
                percentage = 80,
                onProgress = null,
                onComplete = null,
                onRateLimit = null
            } = options;

            // 检查冷却状态
            if (this.isInCooldown()) {
                const remaining = this.getCooldownRemaining();
                const timeStr = this.formatCooldownTime(remaining);
                throw new Error(`COOLDOWN: 正在冷却中，还需等待 ${timeStr}`);
            }

            const allPostIds = this.getCurrentPagePostIds();

            if (allPostIds.length === 0) {
                throw new Error('当前页面没有帖子');
            }

            // 随机选择帖子
            const selectedPosts = this.selectRandomPosts(allPostIds, percentage);

            console.log(`📊 总帖子: ${allPostIds.length}, 选中: ${selectedPosts.length} (${percentage}%)`);

            this.isRunning = true;
            const results = {
                success: 0,
                failed: 0,
                total: selectedPosts.length,
                skipped: allPostIds.length - selectedPosts.length,
                rateLimited: false
            };

            for (let i = 0; i < selectedPosts.length && this.isRunning; i++) {
                const postId = selectedPosts[i];

                // 检查是否已点赞
                if (this.isPostLiked(postId)) {
                    console.log(`⏭️ [${i + 1}/${selectedPosts.length}] 帖子 ${postId} 已点赞，跳过`);
                    results.skipped++;

                    if (onProgress) {
                        onProgress({
                            current: i + 1,
                            total: selectedPosts.length,
                            postId,
                            success: results.success,
                            failed: results.failed
                        });
                    }
                    continue;
                }

                try {
                    await this.toggleReaction(postId, reactionType);
                    results.success++;
                    console.log(`✅ [${i + 1}/${selectedPosts.length}] 帖子 ${postId}`);

                    if (onProgress) {
                        onProgress({
                            current: i + 1,
                            total: selectedPosts.length,
                            postId,
                            success: results.success,
                            failed: results.failed
                        });
                    }

                    // 随机延迟
                    if (i < selectedPosts.length - 1) {
                        const delay = this.getRandomDelay(delayMin, delayMax);
                        console.log(`⏳ 等待 ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }

                } catch (error) {
                    results.failed++;

                    // 处理rate_limit错误
                    if (error.isRateLimit) {
                        results.rateLimited = true;
                        console.error(`⚠️ 触发点赞限制，停止执行`);
                        console.error(`⏰ 冷却时间: ${error.timeLeft}`);

                        if (onRateLimit) {
                            onRateLimit({
                                waitSeconds: error.waitSeconds,
                                timeLeft: error.timeLeft
                            });
                        }

                        break; // 停止执行
                    }

                    console.error(`❌ 帖子 ${postId} 失败:`, error.message);

                    if (error.message.includes('CSRF') || error.message.includes('HTTP 403')) {
                        console.error('认证失败，停止执行');
                        break;
                    }
                }
            }

            this.isRunning = false;

            console.log(`\n✅ 完成! 成功: ${results.success}, 失败: ${results.failed}, 跳过: ${results.skipped}`);
            if (results.rateLimited) {
                console.log(`⚠️ 已触发点赞限制，冷却时间: ${this.formatCooldownTime(this.getCooldownRemaining())}`);
            }

            if (onComplete) {
                onComplete(results);
            }

            return results;
        }

        /**
         * 停止执行
         */
        stop() {
            this.isRunning = false;
            console.log('⏹️ 已停止执行');
        }
    }

    /**
     * UI管理器
     */
    class UIManager {
        constructor(api) {
            this.api = api;
            this.panelVisible = false;
            this.autoMode = Config.get('autoMode', false);
            this.currentUrl = window.location.href;
            this.currentTopicId = null;
            this.currentTopicData = null;
            this.urlCheckInterval = null;
            this.cooldownUpdater = null;
            this.postObserver = null;
            this.refreshDebounceTimer = null;
            this.statusHideTimer = null;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };

            // 注入样式
            GM_addStyle(STYLES);

            this.createUI();

            // 检查冷却状态
            if (this.api.isInCooldown()) {
                console.log(`⏰ 检测到冷却状态，剩余: ${this.api.formatCooldownTime(this.api.getCooldownRemaining())}`);
                this.startCooldownUpdater();
            }

            // 如果开启自动模式，启动监听
            if (this.autoMode) {
                this.startAutoMode();
            } else {
                // 即使未开启自动模式，也要在初始化时获取当前页面数据
                this.initCurrentPageData();
            }
        }

        /**
         * 初始化当前页面数据
         */
        async initCurrentPageData() {
            if (this.isTopicPage()) {
                const topicId = this.extractTopicId();
                if (topicId) {
                    this.currentTopicId = topicId;
                    console.log('📡 初始化：获取当前帖子数据...');
                    await this.fetchTopicData(topicId);
                    this.updateStatus();

                    // 启动DOM监听
                    this.startPostObserver();
                }
            }
        }

        /**
         * 启动帖子DOM监听
         */
        startPostObserver() {
            // 先停止旧的监听器
            this.stopPostObserver();

            // 查找帖子容器
            const postContainer = document.querySelector('#topic, .topic-body, .post-stream');
            if (!postContainer) {
                console.log('⚠️ 未找到帖子容器，延迟启动监听');
                setTimeout(() => this.startPostObserver(), 2000);
                return;
            }

            console.log('👁️ 启动DOM监听：检测新回复...');

            // 创建观察器
            this.postObserver = new MutationObserver((mutations) => {
                // 检查是否有新的帖子节点被添加
                let hasNewPost = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            // 检查是否是帖子元素或包含帖子元素
                            if (node.nodeType === 1) { // Element node
                                if (node.hasAttribute && node.hasAttribute('data-post-id')) {
                                    hasNewPost = true;
                                    break;
                                } else if (node.querySelector && node.querySelector('[data-post-id]')) {
                                    hasNewPost = true;
                                    break;
                                }
                            }
                        }
                        if (hasNewPost) break;
                    }
                }

                if (hasNewPost) {
                    console.log('🔔 检测到新回复，准备刷新数据...');
                    this.refreshTopicDataDebounced();
                }
            });

            // 配置观察器：观察子节点变化
            this.postObserver.observe(postContainer, {
                childList: true,
                subtree: true
            });
        }

        /**
         * 停止帖子DOM监听
         */
        stopPostObserver() {
            if (this.postObserver) {
                this.postObserver.disconnect();
                this.postObserver = null;
                console.log('⏹️ 已停止DOM监听');
            }
        }

        /**
         * 防抖刷新帖子数据
         */
        refreshTopicDataDebounced() {
            // 清除之前的定时器
            if (this.refreshDebounceTimer) {
                clearTimeout(this.refreshDebounceTimer);
            }

            // 设置新的定时器，2秒后执行
            this.refreshDebounceTimer = setTimeout(() => {
                this.refreshTopicData();
            }, 2000);
        }

        /**
         * 刷新帖子数据
         */
        async refreshTopicData() {
            if (!this.isTopicPage() || !this.currentTopicId) {
                return;
            }

            console.log('🔄 刷新帖子数据...');
            await this.fetchTopicData(this.currentTopicId);
            this.updateStatus();
        }

        /**
         * 检查是否是帖子页面
         */
        isTopicPage(url = window.location.href) {
            // 匹配 /t/topic/数字 或 /t/topic/数字/数字（楼层）
            return /\/t\/[^\/]+\/\d+(?:\/\d+)?(?:[?#].*)?$/.test(url);
        }

        /**
         * 从URL提取帖子ID
         */
        extractTopicId(url = window.location.href) {
            const match = url.match(/\/t\/[^\/]+\/(\d+)/);
            return match ? match[1] : null;
        }

        /**
         * 从API获取帖子数据
         */
        async fetchTopicData(topicId) {
            try {
                const url = `https://linux.do/t/${topicId}.json?track_visit=true&forceLoad=true`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                this.currentTopicData = data;
                return data;
            } catch (error) {
                console.error('获取帖子数据失败:', error);
                return null;
            }
        }

        /**
         * 获取当前帖子的楼层数量
         * 优先级：API posts_count > .timeline-replies 元素
         */
        getFloorCount() {
            // 方法1: 从缓存的API数据中获取 posts_count
            if (this.currentTopicData && this.currentTopicData.posts_count) {
                // console.log('🚀 接口楼层数据获取成功');
                return this.currentTopicData.posts_count;
            }

            // 方法2（降级）：从 .timeline-replies 元素提取，格式: "3 / 39"
            // const timelineReplies = document.querySelector('.timeline-replies');
            // if (timelineReplies) {
            //     console.log('降级获取');
            //     const text = timelineReplies.textContent.trim();
            //     // 格式: "3 / 39"，提取后面的总数
            //     const match = text.match(/\/\s*(\d+)/);
            //     if (match) {
            //         return parseInt(match[1]);
            //     }
            // }

            // 无法获取
            return 0;
        }

        /**
         * 启动URL监听
         */
        startUrlMonitoring() {
            console.log('🔍 开始监听URL变化...');

            // 方法1: 监听popstate事件（浏览器前进后退）
            window.addEventListener('popstate', () => this.handleUrlChange());

            // 方法2: 重写pushState和replaceState（SPA路由变化）
            const self = this;
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(...args) {
                originalPushState.apply(this, args);
                self.handleUrlChange();
            };

            history.replaceState = function(...args) {
                originalReplaceState.apply(this, args);
                self.handleUrlChange();
            };

            // 方法3: 定期检查URL变化（兜底方案）
            this.urlCheckInterval = setInterval(() => {
                if (window.location.href !== this.currentUrl) {
                    this.handleUrlChange();
                }
            }, 1000);
        }

        /**
         * 停止URL监听
         */
        stopUrlMonitoring() {
            console.log('⏹️ 停止监听URL变化');
            if (this.urlCheckInterval) {
                clearInterval(this.urlCheckInterval);
                this.urlCheckInterval = null;
            }
        }

        /**
         * 处理URL变化
         */
        async handleUrlChange() {
            const newUrl = window.location.href;

            if (newUrl === this.currentUrl) {
                return; // URL未变化
            }

            console.log('🔄 检测到URL变化');
            console.log('   旧URL:', this.currentUrl);
            console.log('   新URL:', newUrl);

            this.currentUrl = newUrl;

            // 检查是否是帖子页面
            if (!this.isTopicPage(newUrl)) {
                console.log('ℹ️ 不是帖子页面，跳过点赞操作');
                this.currentTopicId = null;
                this.currentTopicData = null;
                this.stopPostObserver(); // 停止DOM监听
                this.updateStatus();
                return;
            }

            // 提取帖子ID
            const topicId = this.extractTopicId(newUrl);
            const isNewTopic = topicId !== this.currentTopicId;
            this.currentTopicId = topicId;

            console.log(`📄 当前帖子ID: ${topicId}${isNewTopic ? ' (新帖子)' : ' (同一帖子)'}`);

            // 如果是新帖子，获取帖子数据
            if (isNewTopic) {
                console.log('📡 获取帖子数据...');
                await this.fetchTopicData(topicId);

                // 启动DOM监听
                this.startPostObserver();
            }

            // 等待页面加载
            await this.sleep(1000);

            // 更新UI状态（获取楼层数量）
            this.updateStatus();

            // 如果正在执行，先停止
            if (this.api.isRunning) {
                console.log('⏹️ 停止当前执行');
                this.api.stop();
            }

            // 如果开启了自动模式且是新帖子，触发自动点赞
            if (this.autoMode && isNewTopic) {
                console.log('🤖 自动模式已开启，准备执行...');
                this.scheduleAutoLike();
            } else if (!isNewTopic) {
                console.log('ℹ️ 同一帖子，跳过自动点赞');
            }
        }

        /**
         * 延迟函数
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * 启动自动模式
         */
        async startAutoMode() {
            console.log('🚀 启动自动模式...');
            this.startUrlMonitoring();

            // 初始执行一次（仅在帖子页面且不在冷却中）
            if (this.isTopicPage() && !this.api.isInCooldown()) {
                this.currentTopicId = this.extractTopicId();

                // 获取帖子数据
                if (this.currentTopicId) {
                    console.log('📡 获取帖子数据...');
                    await this.fetchTopicData(this.currentTopicId);
                    this.updateStatus();
                }

                this.scheduleAutoLike();
            } else if (!this.isTopicPage()) {
                console.log('ℹ️ 当前不是帖子页面，等待进入帖子...');
            }
        }

        /**
         * 停止自动模式
         */
        stopAutoMode() {
            console.log('🛑 停止自动模式');
            this.stopUrlMonitoring();
            this.stopPostObserver();
            this.api.stop();
        }

        createUI() {
            // 从配置中获取保存的位置
            const savedPos = Config.get('floatBtnPosition', null);

            // 创建悬浮按钮
            const floatBtn = document.createElement('div');
            floatBtn.id = 'smart-like-btn';
            floatBtn.className = this.autoMode ? 'auto-on' : 'auto-off';
            floatBtn.innerHTML = '👍';
            floatBtn.title = '智能点赞助手（可拖动）';

            // 设置位置
            if (savedPos) {
                // 优先使用相对定位属性
                if (savedPos.right !== undefined) floatBtn.style.right = `${savedPos.right}px`;
                else if (savedPos.left !== undefined) floatBtn.style.left = `${savedPos.left}px`;
                else floatBtn.style.right = '20px'; // 默认靠右

                if (savedPos.bottom !== undefined) floatBtn.style.bottom = `${savedPos.bottom}px`;
                else if (savedPos.top !== undefined) floatBtn.style.top = `${savedPos.top}px`;
                else floatBtn.style.bottom = '80px'; // 默认靠下
            } else {
                floatBtn.style.bottom = '80px';
                floatBtn.style.right = '20px';
            }

            // 拖动功能
            floatBtn.addEventListener('mousedown', (e) => this.startDrag(e));
            floatBtn.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]), { passive: false });

            document.body.appendChild(floatBtn);
            this.floatBtn = floatBtn;

            this.createPanel();

            // 监听窗口大小变化
            this.watchWindowResize();
        }

        /**
         * 开始拖动
         */
        startDrag(e) {
            this.isDragging = true;
            this.dragOffset = {
                x: e.clientX - this.floatBtn.offsetLeft,
                y: e.clientY - this.floatBtn.offsetTop
            };

            // 拖动开始时，临时隐藏面板，避免遮挡视线
            if (this.panelVisible) {
                const panel = document.getElementById('smart-like-panel');
                if (panel) {
                    panel.style.opacity = '0';
                    panel.style.pointerEvents = 'none';
                }
            }

            const onMove = (e) => this.drag(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
            const onEnd = () => this.stopDrag(onMove, onEnd);

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);

            e.preventDefault();
        }

        /**
         * 拖动中
         */
        drag(clientX, clientY) {
            if (!this.isDragging) return;

            const x = clientX - this.dragOffset.x;
            const y = clientY - this.dragOffset.y;

            // 限制在窗口范围内
            const maxX = window.innerWidth - this.floatBtn.offsetWidth;
            const maxY = window.innerHeight - this.floatBtn.offsetHeight;

            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));

            // 拖动时临时使用 left/top 定位
            this.floatBtn.style.left = boundedX + 'px';
            this.floatBtn.style.top = boundedY + 'px';
            this.floatBtn.style.bottom = 'auto';
            this.floatBtn.style.right = 'auto';
        }

        /**
         * 停止拖动
         */
        stopDrag(onMove, onEnd) {
            if (this.isDragging) {
                const startRect = this.floatBtn.getBoundingClientRect();
                this.isDragging = false;

                // 贴边动画
                this.snapToEdge();

                // 恢复面板显示
                if (this.panelVisible) {
                    setTimeout(() => {
                        const panel = document.getElementById('smart-like-panel');
                        if (panel) {
                            this.updatePanelPosition(); // 更新位置
                            panel.style.opacity = '1';
                            panel.style.pointerEvents = 'auto';
                        }
                    }, 350); // 等待贴边动画结束
                }

                // 清理事件监听
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchend', onEnd);

                // 延迟后才能触发点击
                setTimeout(() => {
                    if (!this.isDragging) {
                        // 检查是否真的是点击（位置没有明显变化）
                        const currentRect = this.floatBtn.getBoundingClientRect();
                        const moved = Math.abs(currentRect.top - startRect.top) > 5 ||
                                     Math.abs(currentRect.left - startRect.left) > 5;
                        if (!moved) {
                            this.togglePanel();
                        }
                    }
                }, 100);
            }
        }

        /**
         * 贴边吸附 (重构：使用相对定位)
         */
        snapToEdge() {
            const rect = this.floatBtn.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const margin = 20;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 找到最近的边
            const dists = {
                left: centerX,
                right: winW - centerX,
                top: centerY,
                bottom: winH - centerY
            };
            const minEdge = Object.keys(dists).reduce((a, b) => dists[a] < dists[b] ? a : b);

            // 样式重置
            this.floatBtn.style.transition = 'all 0.3s ease-out';
            const style = { left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' };
            const posConfig = {};

            // 水平定位逻辑
            if (minEdge === 'left') {
                style.left = margin + 'px';
                posConfig.left = margin;
            } else if (minEdge === 'right') {
                style.right = margin + 'px';
                posConfig.right = margin;
            } else {
                // 保持当前水平位置，但选择较近的一侧作为基准
                if (rect.left < winW / 2) {
                    style.left = rect.left + 'px';
                    posConfig.left = rect.left;
                } else {
                    style.right = (winW - rect.right) + 'px';
                    posConfig.right = (winW - rect.right);
                }
            }

            // 垂直定位逻辑
            if (minEdge === 'top') {
                style.top = margin + 'px';
                posConfig.top = margin;
            } else if (minEdge === 'bottom') {
                style.bottom = margin + 'px';
                posConfig.bottom = margin;
            } else {
                // 保持当前垂直位置
                if (rect.top < winH / 2) {
                    style.top = rect.top + 'px';
                    posConfig.top = rect.top;
                } else {
                    style.bottom = (winH - rect.bottom) + 'px';
                    posConfig.bottom = (winH - rect.bottom);
                }
            }

            // 应用样式
            Object.assign(this.floatBtn.style, style);

            // 保存配置
            Config.set('floatBtnPosition', posConfig);

            // 移除过渡效果
            setTimeout(() => {
                this.floatBtn.style.transition = 'transform 0.3s';
            }, 300);

            // 更新面板位置
            if (this.panelVisible) {
                this.updatePanelPosition();
            }
        }

        /**
         * 监听窗口大小变化
         */
        watchWindowResize() {
            let resizeTimer;
            window.addEventListener('resize', () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.handleResize();
                }, 200);
            });
        }

        /**
         * 处理窗口大小变化
         */
        handleResize() {
            // CSS 相对定位会自动处理大部分情况，只需检查极端溢出
            const rect = this.floatBtn.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            if (rect.right > winW || rect.bottom > winH || rect.left < 0 || rect.top < 0) {
                // 如果溢出，重新触发吸附逻辑，它会纠正位置
                this.snapToEdge();
            } else {
                // 更新面板位置
                if (this.panelVisible) {
                    this.updatePanelPosition();
                }
            }
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'smart-like-panel';

            panel.innerHTML = `
                <div class="sl-header">
                    <div>
                        <h3>🤖 智能点赞助手</h3>
                        <p>支持随机延迟、随机数量、自动模式</p>
                    </div>
                    <button id="close-panel-btn" class="sl-close-btn">×</button>
                </div>

                <div class="sl-section">
                    <div class="sl-row">
                        <span class="sl-label">自动模式:</span>
                        <label class="sl-toggle">
                            <input type="checkbox" id="auto-mode-toggle" ${this.autoMode ? 'checked' : ''}>
                            <span class="sl-toggle-slider"><span class="sl-toggle-knob"></span></span>
                        </label>
                    </div>
                    <div id="cooldown-status" style="display: none; color: var(--sl-status-error-text); margin-bottom: 5px; font-weight: 600;">
                        <span id="cooldown-text"></span>
                        <a href="javascript:void(0)" id="clear-cooldown-btn" style="color:inherit; font-weight:normal; text-decoration:underline; font-size:11px; margin-left:5px; cursor:pointer;">[清除]</a>
                    </div>
                    <div id="csrf-status" class="sl-label">CSRF: 检查中...</div>
                    <div id="post-count" class="sl-label" style="margin-top: 5px;">楼层数量: 未进入帖子</div>
                </div>

                <div class="sl-form-group">
                    <label class="sl-form-label">反应类型:</label>
                    <select id="reaction-type-smart" class="sl-input">
                        <option value="+1">👍 点赞 (+1)</option>
                        <option value="heart">❤️ 爱心 (heart)</option>
                        <option value="laughing">😆 大笑 (laughing)</option>
                        <option value="open_mouth">😮 惊讶 (open_mouth)</option>
                        <option value="clap">👏 鼓掌 (clap)</option>
                        <option value="confetti_ball">🎊 庆祝 (confetti_ball)</option>
                        <option value="hugs">🤗 拥抱 (hugs)</option>
                    </select>
                </div>

                <div class="sl-form-group">
                    <label class="sl-form-label">
                        随机延迟范围 (毫秒):
                    </label>
                    <div class="sl-grid-input">
                        <input type="number" id="delay-min" value="${Config.get('delayMin', 1000)}" min="500" step="100" class="sl-input">
                        <span class="sl-label">~</span>
                        <input type="number" id="delay-max" value="${Config.get('delayMax', 3000)}" min="500" step="100" class="sl-input">
                    </div>
                </div>

                <div class="sl-form-group">
                    <label class="sl-form-label">
                        点赞比例: <span id="percentage-value">${Config.get('percentage', 70)}%</span>
                    </label>
                    <input type="range" id="percentage-slider" min="10" max="100" step="10" value="${Config.get('percentage', 70)}"
                           style="width: 100%; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--sl-label); margin-top: 2px;">
                        <span>10%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <button id="start-smart-like" class="sl-btn-primary">🚀 立即开始点赞</button>

                <div id="progress-bar-container" class="sl-progress-container">
                    <div class="sl-progress-info">
                        <span id="progress-text">进度: 0/0</span>
                        <span id="progress-percent">0%</span>
                    </div>
                    <div class="sl-progress-track">
                        <div id="progress-bar" class="sl-progress-bar"></div>
                    </div>
                </div>

                <div id="status-msg-smart" class="sl-status-msg"></div>
            `;

            document.body.appendChild(panel);

            // 显式设置 checkbox 状态，确保初始化渲染正确
            const autoToggle = document.getElementById('auto-mode-toggle');
            if (autoToggle) {
                autoToggle.checked = this.autoMode;
            }

            // 绑定事件
            this.bindEvents();
            this.updateStatus();
        }

        bindEvents() {
            // 清除冷却按钮
            const clearCooldownBtn = document.getElementById('clear-cooldown-btn');
            if (clearCooldownBtn) {
                clearCooldownBtn.onclick = () => {
                    if (confirm('确定要手动清除冷却状态吗？\n如果服务器限制仍存在，点赞依然会失败。')) {
                        this.api.clearCooldown();
                        this.updateStatus();
                        this.showStatus('✅ 冷却已清除', 'success', true);
                    }
                };
            }

            // 自动模式开关
            const autoToggle = document.getElementById('auto-mode-toggle');
            autoToggle.onchange = (e) => this.toggleAutoMode(e.target.checked);

            // 滑块更新
            const slider = document.getElementById('percentage-slider');
            slider.oninput = (e) => {
                document.getElementById('percentage-value').textContent = e.target.value + '%';
            };

            // 开始按钮
            document.getElementById('start-smart-like').onclick = () => this.startSmartLike();

            // 保存配置
            document.getElementById('delay-min').onchange = (e) => Config.set('delayMin', parseInt(e.target.value));
            document.getElementById('delay-max').onchange = (e) => Config.set('delayMax', parseInt(e.target.value));
            document.getElementById('percentage-slider').onchange = (e) => Config.set('percentage', parseInt(e.target.value));

            // 关闭按钮
            const closeBtn = document.getElementById('close-panel-btn');
            if (closeBtn) {
                closeBtn.onclick = () => this.togglePanel();
                closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
                closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.6';
            }
        }

        togglePanel() {
            const panel = document.getElementById('smart-like-panel');
            this.panelVisible = !this.panelVisible;
            panel.style.display = this.panelVisible ? 'block' : 'none';

            if (this.panelVisible) {
                // 更新面板位置
                this.updatePanelPosition();

                // 打开面板时，如果在帖子页面但没有数据，则获取数据
                if (this.isTopicPage() && !this.currentTopicData) {
                    const topicId = this.extractTopicId();
                    if (topicId && topicId !== this.currentTopicId) {
                        this.currentTopicId = topicId;
                        console.log('📡 面板打开：获取帖子数据...');
                        this.fetchTopicData(topicId).then(() => {
                            this.updateStatus();
                        });
                    } else {
                        this.updateStatus();
                    }
                } else {
                    this.updateStatus();
                }
            }
        }

        /**
         * 更新面板位置（跟随按钮）
         */
        updatePanelPosition() {
            const panel = document.getElementById('smart-like-panel');
            if (!panel) return;

            const btnRect = this.floatBtn.getBoundingClientRect();
            // 优先使用实际渲染宽度，因为box-sizing改变了宽度的计算方式
            const panelWidth = panel.offsetWidth || 360;
            const panelHeight = panel.offsetHeight || 600;
            const margin = 20; // 增加间距
            const edgeMargin = 10;

            // 计算屏幕中心和按钮中心
            const screenCenter = window.innerWidth / 2;
            const btnCenter = btnRect.left + btnRect.width / 2;

            let left, top;

            // 1. 水平定位：向屏幕中心方向展开
            if (btnCenter > screenCenter) {
                // 按钮在右半屏 -> 面板显示在左侧
                left = btnRect.left - panelWidth - margin;

                // 如果左侧空间不够，尝试右侧
                if (left < edgeMargin) {
                    if (window.innerWidth - btnRect.right > panelWidth + margin + edgeMargin) {
                        left = btnRect.right + margin;
                    } else {
                        // 实在放不下，紧贴左边界
                        left = edgeMargin;
                    }
                }
            } else {
                // 按钮在左半屏 -> 面板显示在右侧
                left = btnRect.right + margin;

                // 如果右侧空间不够，尝试左侧
                if (left + panelWidth > window.innerWidth - edgeMargin) {
                    if (btnRect.left > panelWidth + margin + edgeMargin) {
                        left = btnRect.left - panelWidth - margin;
                    } else {
                        // 实在放不下，紧贴右边界
                        left = window.innerWidth - panelWidth - edgeMargin;
                    }
                }
            }

            // 2. 垂直定位
            // 优先顶部对齐
            top = btnRect.top;

            // 检查底部溢出
            if (top + panelHeight > window.innerHeight - edgeMargin) {
                // 底部溢出，尝试底部对齐
                top = btnRect.bottom - panelHeight;

                // 检查顶部溢出
                if (top < edgeMargin) {
                    // 屏幕太矮，贴底显示
                    top = window.innerHeight - panelHeight - edgeMargin;
                }
            }

            // 最终边界检查
            top = Math.max(edgeMargin, Math.min(top, window.innerHeight - panelHeight - edgeMargin));

            // 应用位置
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';

            // 移除这里的 transition 设置，因为已在 cssText 中统一设置
        }

        toggleAutoMode(enabled) {
            this.autoMode = enabled;
            Config.set('autoMode', enabled);

            // 同步更新 checkbox 状态 (用于菜单切换或代码调用)
            const autoToggle = document.getElementById('auto-mode-toggle');
            if (autoToggle && autoToggle.checked !== enabled) {
                autoToggle.checked = enabled;
            }

            // 更新按钮样式
            this.floatBtn.className = enabled ? 'auto-on' : 'auto-off';

            // 更新开关样式 (CSS自动处理，这里只需要处理逻辑)
            if (enabled) {
                this.showStatus('✅ 自动模式已开启，URL变化时自动点赞', 'success', true);
                this.startAutoMode();
            } else {
                this.showStatus('⏹️ 自动模式已关闭', 'info', true);
                this.stopAutoMode();
            }
        }

        scheduleAutoLike() {
            if (!this.autoMode) return;

            // 延迟2-5秒后自动执行
            const delay = this.api.getRandomDelay(2000, 5000);
            console.log(`🤖 自动模式：将在 ${delay}ms 后开始点赞`);

            setTimeout(() => {
                if (this.autoMode && !this.api.isRunning) {
                    console.log('🤖 自动模式：开始执行');
                    this.startSmartLike(true);
                }
            }, delay);
        }

        updateStatus() {
            // 更新冷却状态
            const cooldownEl = document.getElementById('cooldown-status');
            if (cooldownEl) {
                if (this.api.isInCooldown()) {
                    const remaining = this.api.getCooldownRemaining();
                    const timeStr = this.api.formatCooldownTime(remaining);

                    const textEl = document.getElementById('cooldown-text');
                    if (textEl) {
                        textEl.textContent = `⏰ 冷却中: 还需 ${timeStr}`;
                    } else {
                        cooldownEl.textContent = `⏰ 冷却中: 还需 ${timeStr}`;
                    }

                    cooldownEl.style.display = 'block';
                } else {
                    cooldownEl.style.display = 'none';
                }
            }

            const csrfEl = document.getElementById('csrf-status');
            if (csrfEl) {
                csrfEl.innerHTML = this.api.csrfToken
                    ? `CSRF: <span style="color: #28a745;">✅ 已获取</span>`
                    : `CSRF: <span style="color: #dc3545;">❌ 未获取</span>`;
            }

            const countEl = document.getElementById('post-count');
            if (countEl) {
                if (!this.isTopicPage()) {
                    countEl.innerHTML = `楼层数量: <span style="color: #999;">未进入帖子</span>`;
                } else {
                    const floorCount = this.getFloorCount();
                    countEl.innerHTML = floorCount > 0
                        ? `楼层数量: <strong style="color: #28a745;">${floorCount}</strong> 层`
                        : `楼层数量: <span style="color: #999;">加载中...</span>`;
                }
            }
        }

        showStatus(message, type = 'info', autoHide = true) {
            const statusEl = document.getElementById('status-msg-smart');

            statusEl.style.display = 'block';
            statusEl.className = `sl-status-msg sl-status-${type}`;
            statusEl.textContent = message;

            // 清除之前的定时器
            if (this.statusHideTimer) {
                clearTimeout(this.statusHideTimer);
                this.statusHideTimer = null;
            }

            // 自动隐藏（默认3秒后）
            if (autoHide) {
                this.statusHideTimer = setTimeout(() => {
                    statusEl.style.display = 'none';
                    this.statusHideTimer = null;
                }, 3000);
            }
        }

        /**
         * 隐藏状态消息
         */
        hideStatus() {
            const statusEl = document.getElementById('status-msg-smart');
            if (statusEl) {
                statusEl.style.display = 'none';
            }
            if (this.statusHideTimer) {
                clearTimeout(this.statusHideTimer);
                this.statusHideTimer = null;
            }
        }

        updateProgress(data) {
            const container = document.getElementById('progress-bar-container');
            const text = document.getElementById('progress-text');
            const percent = document.getElementById('progress-percent');
            const bar = document.getElementById('progress-bar');

            container.style.display = 'block';

            const percentage = Math.round((data.current / data.total) * 100);
            text.textContent = `进度: ${data.current}/${data.total} (成功: ${data.success}, 失败: ${data.failed})`;
            percent.textContent = `${percentage}%`;
            bar.style.width = `${percentage}%`;
        }

        hideProgress() {
            const container = document.getElementById('progress-bar-container');
            container.style.display = 'none';
        }

        async startSmartLike(isAuto = false) {
            if (this.api.isRunning) {
                this.api.stop();
                document.getElementById('start-smart-like').textContent = '🚀 立即开始点赞';
                this.hideProgress();
                return;
            }

            // 检查冷却状态
            if (this.api.isInCooldown()) {
                const remaining = this.api.getCooldownRemaining();
                const timeStr = this.api.formatCooldownTime(remaining);

                // 自动模式下仅控制台输出，不打扰用户
                if (isAuto) {
                    console.log(`🤖 自动模式：检测到冷却中，跳过执行 (剩余 ${timeStr})`);
                } else {
                    this.showStatus(`⏰ 正在冷却中，还需等待 ${timeStr}`, 'warning', true);
                }

                this.updateStatus(); // 更新显示
                return;
            }

            const reactionType = document.getElementById('reaction-type-smart').value;
            const delayMin = parseInt(document.getElementById('delay-min').value);
            const delayMax = parseInt(document.getElementById('delay-max').value);
            const percentage = parseInt(document.getElementById('percentage-slider').value);

            const allPosts = this.api.getCurrentPagePostIds();
            const selectedCount = Math.floor(allPosts.length * percentage / 100);

            if (allPosts.length === 0) {
                this.showStatus('❌ 当前页面没有帖子', 'error', true);
                return;
            }

            if (!this.api.csrfToken) {
                this.showStatus('❌ CSRF Token不可用，请刷新页面', 'error', false);
                return;
            }

            // 如果不是自动模式，需要确认
            if (!isAuto) {
                if (!confirm(`确定要开始智能点赞吗？\n\n总帖子: ${allPosts.length}\n将点赞: ${selectedCount} 个 (${percentage}%)\n反应类型: ${reactionType}\n延迟范围: ${delayMin}-${delayMax}ms`)) {
                    return;
                }
            }

            const btn = document.getElementById('start-smart-like');
            btn.textContent = '⏹️ 停止点赞';
            btn.classList.add('sl-btn-stop');

            this.showStatus(`开始智能点赞，将随机选择 ${selectedCount} 个帖子...`, 'info', true);

            try {
                await this.api.smartBatchLike({
                    reactionType,
                    delayMin,
                    delayMax,
                    percentage,
                    onProgress: (data) => this.updateProgress(data),
                    onRateLimit: (data) => {
                        // 触发rate limit时的处理
                        this.showStatus(`⚠️ 已触发点赞限制！需要冷却 ${data.timeLeft}`, 'warning', false);
                        this.updateStatus(); // 更新冷却显示
                        this.hideProgress();

                        // 启动定时更新冷却状态
                        this.startCooldownUpdater();
                    },
                    onComplete: (results) => {
                        if (results.rateLimited) {
                            this.showStatus(
                                `⚠️ 触发限制！成功: ${results.success}, 失败: ${results.failed}, 跳过: ${results.skipped}`,
                                'warning'
                            );
                        } else {
                            this.showStatus(
                                `✅ 完成！成功: ${results.success}, 失败: ${results.failed}, 跳过: ${results.skipped}`,
                                results.failed > 0 ? 'warning' : 'success'
                            );
                        }
                        this.hideProgress();
                    }
                });
            } catch (error) {
                if (error.message.includes('COOLDOWN')) {
                    this.showStatus(`⏰ ${error.message}`, 'warning', true);
                    this.updateStatus();
                } else {
                    this.showStatus(`❌ 错误: ${error.message}`, 'error', true);
                }
            } finally {
                btn.textContent = '🚀 立即开始点赞';
                btn.classList.remove('sl-btn-stop');
            }
        }

        /**
         * 启动冷却状态更新器
         */
        startCooldownUpdater() {
            // 清除旧的更新器
            if (this.cooldownUpdater) {
                clearInterval(this.cooldownUpdater);
            }

            // 每秒更新一次冷却状态
            this.cooldownUpdater = setInterval(() => {
                if (this.api.isInCooldown()) {
                    this.updateStatus();
                } else {
                    // 冷却结束，清除更新器
                    clearInterval(this.cooldownUpdater);
                    this.cooldownUpdater = null;
                    this.updateStatus();
                    this.showStatus('✅ 冷却已结束，可以继续点赞', 'success', true);
                }
            }, 1000);
        }
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setTimeout(() => {
            console.log('🚀 Linux.do 智能点赞助手已启动');

            const api = new SmartLikeAPI();
            const ui = new UIManager(api);

            // 注册菜单
            GM_registerMenuCommand('📊 显示控制面板', () => {
                if (!ui.panelVisible) {
                    ui.togglePanel();
                }
            });

            GM_registerMenuCommand('🤖 切换自动模式', () => {
                ui.toggleAutoMode(!ui.autoMode);
            });

            GM_registerMenuCommand('⏰ 清除冷却', () => {
                if (api.isInCooldown()) {
                    const remaining = api.formatCooldownTime(api.getCooldownRemaining());
                    if (confirm(`当前还在冷却中，剩余: ${remaining}\n\n确定要清除冷却吗？`)) {
                        api.clearCooldown();
                        ui.updateStatus();
                        alert('✅ 冷却已清除！');
                    }
                } else {
                    alert('当前没有冷却');
                }
            });

            // 暴露到全局
            window.smartLikeAPI = api;
            console.log('💡 使用 window.smartLikeAPI 手动调用');
        }, 1000);
    }

    init();
})();