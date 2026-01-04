// ==UserScript==
// @name         抖音评论采集助手 - 最新修复版
// @namespace    https://github.com/douyin-comment-collector
// @version      4.0.0
// @description  抖音评论采集工具，基于自动化测试修复选择器问题，适配最新抖音页面结构
// @author       AI Assistant
// @license      MIT
// @match        https://*.douyin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_notification
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548504/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B%20-%20%E6%9C%80%E6%96%B0%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548504/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B%20-%20%E6%9C%80%E6%96%B0%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强的CSS样式 - 恢复原始抽屉式设计，缩小尺寸
    GM_addStyle(`
        .douyin-collector-drawer {
            position: fixed;
            width: 50px;
            height: 28px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
            backdrop-filter: blur(8px);
            border-radius: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            z-index: 999999;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            cursor: pointer;
            overflow: hidden;
        }

        .douyin-collector-drawer.expanded {
            width: 320px;
            height: 240px;
            border-radius: 4px 0 0 4px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
            backdrop-filter: blur(15px);
            box-shadow: -4px 0 20px rgba(0,0,0,0.2);
        }

        .douyin-collector-tab {
            position: absolute;
            left: 0;
            top: 0;
            width: 50px;
            height: 28px;
            display: block;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(8px);
            border-radius: 14px;
            transition: all 0.3s ease;
            z-index: 2;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
            border: 1px solid rgba(24, 144, 255, 0.1);
        }

        .douyin-collector-drawer.expanded .douyin-collector-tab {
            opacity: 0;
            pointer-events: none;
        }

        .douyin-collector-tab:hover {
            background: rgba(255,255,255,0.25);
            transform: scale(1.02);
        }

        .douyin-collector-tab:hover .douyin-collector-tab-icon {
            color: rgba(255, 255, 255, 1);
            text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .douyin-collector-tab-icon {
            color: #1890ff;
            font-size: 15px;
            font-weight: 900;
            font-family: "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "SimHei", sans-serif;
            position: absolute;
            left: 0;
            top: 0;
            width: 50px;
            height: 28px;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            line-height: 28px;
            letter-spacing: 0px;
            text-shadow: 0 1px 2px rgba(24, 144, 255, 0.3);
            -webkit-text-stroke: 1px rgba(24, 144, 255, 0.8);
            text-rendering: optimizeLegibility;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            z-index: 1;
        }

        .drag-indicator {
            color: rgba(255, 255, 255, 0.6);
            font-size: 9px;
            cursor: grab;
            user-select: none;
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.3s ease, color 0.3s ease;
            pointer-events: none;
        }

        .douyin-collector-drawer.expanded .drag-indicator {
            opacity: 1;
        }

        .drag-indicator:hover {
            color: rgba(255, 255, 255, 0.9);
        }

        .drag-indicator:active {
            cursor: grabbing;
            color: white;
        }

        .draggable-handle {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: center;
        }

        .douyin-collector-drawer.dragging {
            transition: none !important;
            user-select: none;
        }

        .douyin-collector-drawer.dragging * {
            pointer-events: none;
        }

        .douyin-collector-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 320px;
            height: 240px;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 4px 0 0 4px;
            padding: 8px;
            opacity: 0;
            transform: translateX(0);
            transition: opacity 0.3s ease;
            overflow-y: auto;
            box-sizing: border-box;
            z-index: 3;
        }

        .douyin-collector-drawer.expanded .douyin-collector-content {
            opacity: 1;
        }

        /* 智能展开方向 - 修复overflow问题 */
        .douyin-collector-drawer.expand-left.expanded {
            width: 400px !important;
            height: 240px !important;
            overflow: visible !important;
        }
        
        .douyin-collector-drawer.expand-left.expanded .douyin-collector-content {
            right: 0 !important;
            left: auto !important;
            top: 0 !important;
            width: 320px !important;
            height: 240px !important;
            transform: translateX(0);
            border-radius: 4px 0 0 4px;
            opacity: 1;
        }

        .douyin-collector-drawer.expand-right.expanded {
            width: 400px !important;
            height: 240px !important;
            overflow: visible !important;
        }
        
        .douyin-collector-drawer.expand-right.expanded .douyin-collector-content {
            left: 0 !important;
            right: auto !important;
            top: 0 !important;
            width: 320px !important;
            height: 240px !important;
            transform: translateX(0);
            border-radius: 0 4px 4px 0;
            opacity: 1;
        }

        .douyin-collector-drawer.expand-up.expanded {
            width: 320px !important;
            height: 268px !important;
            overflow: visible !important;
        }
        
        .douyin-collector-drawer.expand-up.expanded .douyin-collector-content {
            left: 0 !important;
            bottom: 0 !important;
            top: auto !important;
            width: 320px !important;
            height: 240px !important;
            transform: translateY(0);
            border-radius: 4px 4px 0 0;
            opacity: 1;
        }

        .douyin-collector-drawer.expand-down.expanded {
            width: 320px !important;
            height: 268px !important;
            overflow: visible !important;
        }
        
        .douyin-collector-drawer.expand-down.expanded .douyin-collector-content {
            left: 0 !important;
            top: 0 !important;
            bottom: auto !important;
            width: 320px !important;
            height: 240px !important;
            transform: translateY(0);
            border-radius: 0 0 4px 4px;
            opacity: 1;
        }

        /* Tab标签在智能展开时的定位 - 只在展开时生效 */
        .douyin-collector-drawer.expand-left.expanded .douyin-collector-tab {
            right: 0 !important;
            top: 50% !important;
            transform: translateY(-50%);
        }

        .douyin-collector-drawer.expand-right.expanded .douyin-collector-tab {
            left: 0 !important;
            top: 50% !important;
            right: auto !important;
            transform: translateY(-50%);
        }

        .douyin-collector-drawer.expand-up.expanded .douyin-collector-tab {
            right: 50% !important;
            bottom: 0 !important;
            top: auto !important;
            transform: translateX(50%);
        }

        .douyin-collector-drawer.expand-down.expanded .douyin-collector-tab {
            right: 50% !important;
            top: 0 !important;
            bottom: auto !important;
            transform: translateX(50%);
        }

        .collector-header {
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 2px solid #667eea;
            position: relative;
            cursor: move;
            user-select: none;
        }

        .collector-header:hover {
            background: rgba(102, 126, 234, 0.05);
            border-radius: 4px;
        }

        .header-drag-indicator {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(102, 126, 234, 0.4);
            font-size: 12px;
            cursor: grab;
            transition: color 0.3s ease;
        }

        .header-drag-indicator:hover {
            color: rgba(102, 126, 234, 0.8);
        }

        .header-drag-indicator:active {
            cursor: grabbing;
            color: #667eea;
        }

        .collector-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        .collector-version {
            font-size: 10px;
            color: #666;
            margin-top: 3px;
        }

        .collector-section {
            margin-bottom: 6px;
        }

        .collector-section h3 {
            font-size: 12px;
            color: #333;
            margin: 0 0 4px 0;
            font-weight: 600;
        }

        .collector-setting {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            padding: 3px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 3px;
        }

        .collector-setting label {
            font-size: 10px;
            color: #555;
        }

        .collector-input {
            width: 50px;
            padding: 2px 4px;
            border: 1px solid #ddd;
            border-radius: 2px;
            font-size: 10px;
        }

        .collector-button {
            width: 100%;
            padding: 5px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-bottom: 3px;
        }

        .collector-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(102, 126, 234, 0.4);
        }

        .collector-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .collector-status {
            padding: 6px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            font-size: 10px;
            color: #666;
            margin-bottom: 6px;
            min-height: 40px;
        }

        .collector-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
            margin-top: 6px;
        }

        .collector-stat {
            text-align: center;
            padding: 5px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 3px;
        }

        .collector-stat-value {
            font-size: 12px;
            font-weight: bold;
            color: #667eea;
        }

        .collector-stat-label {
            font-size: 9px;
            color: #666;
            margin-top: 2px;
        }

        .collector-status-indicator {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 4px;
        }

        .status-idle { background-color: #ccc; }
        .status-working { background-color: #ffa500; animation: pulse 1.5s infinite; }
        .status-success { background-color: #52c41a; }
        .status-error { background-color: #ff4d4f; }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

    `);

    // 常量定义
    const CONSTANTS = {
        COLLAPSED_WIDTH: 50,
        COLLAPSED_HEIGHT: 28,
        EXPANDED_WIDTH: 320,
        EXPANDED_HEIGHT: 240,
        EDGE_MARGIN: 10,
        ANIMATION_DURATION: 300
    };

    // 全局配置
    const CONFIG = {
        version: '4.0.0',
        debug: true,
        defaultMinLikes: 10,
        batchSize: 5,
        delays: {
            expandReply: 1000,
            scrollWait: 500,
            clickWait: 300,
            replyWait: 800
        },
        selectors: {
            // 基于自动化测试结果的修复选择器
            videoPlayer: 'video, .xgplayer, [class*="player"]',
            commentButton: '[data-e2e="feed-comment-icon"], [data-e2e*="comment"], [aria-label*="评论"], button[class*="comment"]',
            
            // 评论区 - 使用智能查找而非固定选择器
            commentSection: '[data-e2e*="comment"], [class*="comment"], div[role="list"], .comment-list',
            
            // 评论项 - 基于自动化测试发现的新策略
            commentItem: [
                '[data-e2e="comment-item"]',  // 旧选择器，可能失效
                '[data-e2e*="comment"]',      // 包含comment的data-e2e
                'div[class*="comment"]:not([class*="reply"])',  // 包含comment但不包含reply的div
                'li[class*="comment"]',       // 列表项形式的评论
                '.comment-item',              // 简单类名
                '[role="listitem"]'           // 无障碍属性
            ],
            
            // 展开按钮 - 基于测试结果优化
            expandButton: 'button, [role="button"], [class*="expand"], [class*="reply"]',
            
            // 回复容器 - 更灵活的查找
            replyContainer: [
                '.cKvms_3E.replyContainer',   // 旧选择器
                '.replyContainer',
                '[class*="reply"][class*="container"]',
                '[class*="Reply"][class*="Container"]',
                '[data-e2e*="reply"]'
            ]
        }
    };

    class DouyinCommentCollector {
        constructor() {
            this.init();
        }

        async init() {
            this.comments = [];
            this.isCollecting = false;
            this.debugMode = CONFIG.debug;
            this.floatingWindow = null;
            
            // 初始化设置
            this.settings = {
                minLikes: CONFIG.defaultMinLikes,
                autoScroll: true,
                collectReplies: true,
                targetComments: 20,
                maxScrolls: 10,
                scrollDelay: 2000
            };
            
            // 等待页面加载完成
            await this.waitForPageLoad();
            
            // 检查是否在抖音视频页面
            if (this.isDouyinVideoPage()) {
                this.setupUI();
                this.log('🚀 抖音评论采集助手已启动 (最新修复版 v' + CONFIG.version + ')');
                this.log('📊 基于自动化测试结果修复选择器问题');
            } else {
                this.log('ℹ️ 非抖音视频页面，不显示采集工具');
                this.setupPageChangeListener(); // 监听页面变化
            }
        }

        async waitForPageLoad() {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    setTimeout(resolve, 1000);
                } else {
                    window.addEventListener('load', () => {
                        setTimeout(resolve, 1000);
                    });
                }
            });
        }

        isDouyinVideoPage() {
            // 检查是否在抖音域名
            if (!window.location.hostname.includes('douyin.com')) {
                return false;
            }

            // 检查URL模式
            const url = window.location.href;
            const videoUrlPatterns = [
                /douyin\.com\/video\/\d+/,
                /douyin\.com\/user\/[^\/]+\/video\/\d+/,
                /modal_id=\d+/,
                /douyin\.com.*\/\d{19}/
            ];

            const hasVideoUrl = videoUrlPatterns.some(pattern => pattern.test(url));
            if (hasVideoUrl) {
                this.log('✅ URL匹配视频页面模式');
                return true;
            }

            // 检查页面元素
            const hasVideo = document.querySelector('video, .xgplayer, [class*="player"]');
            const hasCommentElements = document.querySelector('[data-e2e*="comment"], [class*="comment"], button[aria-label*="评论"]');
            
            if (hasVideo && hasCommentElements) {
                this.log('✅ 页面包含视频播放器和评论元素');
                return true;
            }

            this.log('❌ 不是抖音视频页面');
            return false;
        }

        setupPageChangeListener() {
            // 监听页面变化，如果变成视频页面则显示工具
            const observer = new MutationObserver(() => {
                if (this.isDouyinVideoPage() && !this.floatingWindow) {
                    this.log('🔄 检测到页面变为视频页面，显示采集工具');
                    this.setupUI();
                    observer.disconnect(); // 停止监听
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 也监听URL变化
            let currentUrl = window.location.href;
            setInterval(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    if (this.isDouyinVideoPage() && !this.floatingWindow) {
                        this.log('🔄 URL变化检测到视频页面，显示采集工具');
                        this.setupUI();
                    } else if (!this.isDouyinVideoPage() && this.floatingWindow) {
                        this.log('🔄 离开视频页面，隐藏采集工具');
                        this.hideUI();
                    }
                }
            }, 1000);
        }

        hideUI() {
            if (this.floatingWindow) {
                this.floatingWindow.remove();
                this.floatingWindow = null;
                this.log('🚫 采集工具已隐藏');
            }
        }

        log(message, type = 'info') {
            // 在采集过程中临时启用debug模式
            const showDebug = this.debugMode || this.isCollecting;
            if (!showDebug && type === 'debug') return;
            
            const timestamp = new Date().toLocaleTimeString();
            const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '📝';
            console.log(`[${timestamp}] ${prefix} ${message}`);
        }

        debugWindowSize() {
            if (!this.floatingWindow) return;
            
            const logSize = () => {
                const rect = this.floatingWindow.getBoundingClientRect();
                const classes = Array.from(this.floatingWindow.classList);
                this.log(`🔍 悬浮窗状态 - 尺寸: ${Math.round(rect.width)}×${Math.round(rect.height)}, 类: [${classes.join(', ')}]`);
            };
            
            // 立即记录
            logSize();
            
            // 监控变化
            const observer = new MutationObserver(() => {
                setTimeout(logSize, 10); // 延迟一点让CSS生效
            });
            
            observer.observe(this.floatingWindow, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            
            // 定期检查
            setInterval(logSize, 2000);
        }

        // ==================== 智能评论查找 ====================

        findCommentElements() {
            this.log('🔍 开始智能查找评论元素...');
            
            const commentElements = [];
            
            // 策略1: 尝试标准选择器 - 改进过滤逻辑
            for (const selector of CONFIG.selectors.commentItem) {
                try {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        this.log(`✅ 选择器 "${selector}" 找到 ${elements.length} 个元素`);
                        
                        // 过滤掉明显不是评论的元素（如只有数字的点赞数元素）
                        const filteredElements = Array.from(elements).filter(el => {
                            const text = el.textContent.trim();
                            // 排除纯数字元素（点赞数）
                            if (/^\d+$/.test(text) && text.length < 10) {
                                this.log(`🚫 跳过纯数字元素: "${text}"`, 'debug');
                                return false;
                            }
                            // 排除过短的元素
                            if (text.length < 10) {
                                this.log(`🚫 跳过过短元素: "${text}"`, 'debug');
                                return false;
                            }
                            return true;
                        });
                        
                        if (filteredElements.length > 0) {
                            this.log(`✅ 过滤后剩余 ${filteredElements.length} 个有效元素`);
                            commentElements.push(...filteredElements);
                            break; // 找到就停止，避免重复
                        } else {
                            this.log(`⚠️ 选择器 "${selector}" 找到的元素都被过滤掉了`);
                        }
                    }
                } catch (e) {
                    this.log(`❌ 选择器错误: ${selector}`);
                }
            }
            
            // 策略2: 如果标准选择器都失效，使用智能查找
            if (commentElements.length === 0) {
                this.log('🧠 标准选择器失效，启用智能查找...');
                const smartElements = this.smartFindComments();
                commentElements.push(...smartElements);
            }
            
            // 去重并过滤
            const uniqueElements = this.deduplicateElements(commentElements);
            let validElements = uniqueElements.filter(el => this.isValidCommentElement(el));
            
            // 如果严格验证没有找到有效元素，使用宽松验证
            if (validElements.length === 0 && uniqueElements.length > 0) {
                this.log('⚠️ 严格验证未找到有效元素，尝试宽松验证...', 'warn');
                validElements = uniqueElements.filter(el => this.isValidCommentElementLoose(el));
                this.log(`🔄 宽松验证结果: ${validElements.length} 个有效元素`);
            }
            
            this.log(`📊 智能查找结果: 原始${commentElements.length} -> 去重${uniqueElements.length} -> 有效${validElements.length}`);
            return validElements;
        }

        smartFindComments() {
            this.log('🧠 执行智能评论查找...');
            
            const candidateElements = [];
            
            // 策略1: 寻找评论容器
            this.log('🔍 策略1: 寻找评论容器...');
            const commentContainers = document.querySelectorAll('div, section, article');
            
            for (const container of commentContainers) {
                const text = container.textContent?.trim() || '';
                
                // 寻找包含评论特征的容器
                if (text.length > 50 && text.length < 3000) {
                    // 检查是否包含用户信息
                    const hasUser = container.querySelector('a[href*="/user/"], img[alt*="头像"], [class*="user"], [class*="avatar"]');
                    // 检查是否包含互动元素
                    const hasInteraction = container.querySelector('button, [role="button"], [class*="like"], [class*="reply"]');
                    // 检查是否有时间信息
                    const hasTimeInfo = /\d+[天小时分钟秒]前|刚刚/.test(text);
                    
                    if (hasUser && (hasInteraction || hasTimeInfo)) {
                        const score = this.calculateCommentScore(container);
                        candidateElements.push({
                            element: container,
                            score: score
                        });
                        this.log(`📝 找到候选评论容器，分数: ${score}, 文本预览: "${text.substring(0, 30)}..."`, 'debug');
                    }
                }
            }
            
            // 策略2: 寻找具有特定结构的元素
            this.log('🔍 策略2: 寻找特定结构元素...');
            const structuredElements = document.querySelectorAll('[class*="comment"], [class*="item"], [id*="comment"]');
            
            for (const element of structuredElements) {
                const text = element.textContent?.trim() || '';
                if (text.length > 20 && text.length < 2000) {
                    // 排除纯数字元素
                    if (!/^\d+$/.test(text)) {
                        const score = this.calculateCommentScore(element);
                        if (score >= 2) {
                            candidateElements.push({
                                element: element,
                                score: score + 1 // 结构匹配加分
                            });
                            this.log(`📝 找到结构化候选元素，分数: ${score + 1}, 文本预览: "${text.substring(0, 30)}..."`, 'debug');
                        }
                    }
                }
            }
            
            // 按分数排序，取前15个最可能的评论
            candidateElements.sort((a, b) => b.score - a.score);
            const topCandidates = candidateElements.slice(0, 15).map(item => item.element);
            
            this.log(`🎯 智能查找发现 ${candidateElements.length} 个候选元素，取前 ${topCandidates.length} 个`);
            
            return topCandidates;
        }

        calculateCommentScore(element) {
            let score = 0;
            const text = element.textContent?.trim() || '';
            
            // 长度合理 (20-500字符)
            if (text.length >= 20 && text.length <= 500) {
                score += 1;
            }
            
            // 包含用户链接
            if (element.querySelector('a[href*="/user/"]')) {
                score += 3;
            }
            
            // 包含头像
            if (element.querySelector('img[class*="avatar"], img[alt*="头像"]')) {
                score += 2;
            }
            
            // 包含时间信息
            if (/\d+[天小时分钟秒]前/.test(text) || text.includes('前')) {
                score += 2;
            }
            
            // 包含回复相关文本
            if (text.includes('回复') || text.includes('展开') || /\d+条回复/.test(text)) {
                score += 1;
            }
            
            // 包含@符号
            if (text.includes('@')) {
                score += 1;
            }
            
            // 包含数字（可能是点赞数）
            if (/\d+/.test(text)) {
                score += 1;
            }
            
            // 排除明显的非评论元素
            if (text.includes('抖音') || text.includes('搜索') || text.includes('推荐') || text.includes('关注')) {
                score -= 2;
            }
            
            return score;
        }

        isValidCommentElement(element) {
            if (!element || !element.textContent) {
                this.log(`❌ 验证失败: 元素为空或无文本内容`, 'debug');
                return false;
            }
            
            const text = element.textContent.trim();
            this.log(`🔍 验证评论元素: 文本长度=${text.length}, 预览="${text.substring(0, 50)}..."`, 'debug');
            
            // 放宽长度检查 - 降低最小长度要求
            if (text.length < 5 || text.length > 2000) {
                this.log(`❌ 验证失败: 文本长度不符合要求 (${text.length})`, 'debug');
                return false;
            }
            
            // 检查是否包含评论特征 - 放宽条件
            const hasUserInfo = element.querySelector('a[href*="/user/"], img[class*="avatar"], [class*="user"]');
            const hasContent = text.length > 10; // 降低内容长度要求
            const hasInteraction = element.querySelector('button, [role="button"], [class*="like"], [class*="reply"]');
            const hasDataE2E = element.hasAttribute('data-e2e');
            
            // 排除明显的非评论元素
            const isUIElement = /^(赞|回复|分享|关注|搜索|推荐)$/.test(text.trim());
            if (isUIElement) {
                this.log(`❌ 验证失败: 是UI元素 "${text.trim()}"`, 'debug');
                return false;
            }
            
            // 多条件验证 - 满足任一条件即可
            const isValid = hasUserInfo || hasContent || hasInteraction || hasDataE2E;
            
            this.log(`🔍 验证结果: ${isValid ? '✅通过' : '❌失败'} - 用户信息:${!!hasUserInfo}, 内容:${hasContent}, 交互:${!!hasInteraction}, data-e2e:${hasDataE2E}`, 'debug');
            
            return isValid;
        }

        isValidCommentElementLoose(element) {
            if (!element || !element.textContent) {
                return false;
            }
            
            const text = element.textContent.trim();
            this.log(`🔍 宽松验证: 文本长度=${text.length}, 预览="${text.substring(0, 30)}..."`, 'debug');
            
            // 非常宽松的条件：只要有合理的文本长度就认为是有效的
            if (text.length < 3 || text.length > 5000) {
                this.log(`❌ 宽松验证失败: 文本长度 ${text.length}`, 'debug');
                return false;
            }
            
            // 排除明显的非内容元素
            const invalidTexts = ['推荐', '关注', '搜索', '登录', '注册', '首页', '发现'];
            if (invalidTexts.some(invalid => text.includes(invalid) && text.length < 20)) {
                this.log(`❌ 宽松验证失败: 包含无效文本`, 'debug');
                return false;
            }
            
            // 如果包含data-e2e属性，优先认为是有效的
            if (element.hasAttribute('data-e2e')) {
                this.log(`✅ 宽松验证通过: 包含data-e2e属性`, 'debug');
                return true;
            }
            
            // 如果文本长度合理，就认为是有效的
            const isValid = text.length >= 10;
            this.log(`🔍 宽松验证结果: ${isValid ? '✅通过' : '❌失败'}`, 'debug');
            
            return isValid;
        }

        deduplicateElements(elements) {
            const seen = new Set();
            return elements.filter(el => {
                const key = el.textContent?.trim().substring(0, 50) || '';
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
        }

        // ==================== 回复查找优化 ====================

        async findRepliesForComment(commentElement, commentIndex) {
            this.log(`💬 评论 ${commentIndex}: 开始查找回复...`);
            
            // 先尝试展开回复
            await this.expandRepliesForComment(commentElement, commentIndex);
            
            // 多策略查找回复
            const replies = [];
            
            // 策略1: 查找回复容器
            const container = this.findReplyContainerNew(commentElement);
            if (container) {
                const containerReplies = this.extractRepliesFromContainer(container, commentElement);
                replies.push(...containerReplies);
                this.log(`💬 评论 ${commentIndex}: 从回复容器获得 ${containerReplies.length} 个回复`);
            }
            
            // 策略2: 在评论元素内部查找
            if (replies.length === 0) {
                const internalReplies = this.findRepliesInElement(commentElement);
                replies.push(...internalReplies);
                this.log(`💬 评论 ${commentIndex}: 内部查找获得 ${internalReplies.length} 个回复`);
            }
            
            // 策略3: 智能查找附近的回复元素
            if (replies.length === 0) {
                const smartReplies = this.smartFindReplies(commentElement);
                replies.push(...smartReplies);
                this.log(`💬 评论 ${commentIndex}: 智能查找获得 ${smartReplies.length} 个回复`);
            }
            
            return this.deduplicateElements(replies);
        }

        findReplyContainerNew(commentElement) {
            // 基于自动化测试结果，更灵活地查找回复容器
            let current = commentElement.parentElement;
            let attempts = 0;
            
            while (current && attempts < 10) {
                // 检查多种可能的回复容器特征
                for (const selector of CONFIG.selectors.replyContainer) {
                    if (current.matches && current.matches(selector)) {
                        this.log(`✅ 找到回复容器: ${selector}`);
                        return current;
                    }
                }
                
                // 检查是否包含多个评论项（可能是容器）
                const childComments = current.querySelectorAll('[data-e2e*="comment"], div[class*="comment"], [role="listitem"]');
                if (childComments.length > 1) {
                    this.log(`✅ 找到多评论容器，包含 ${childComments.length} 个子评论`);
                    return current;
                }
                
                current = current.parentElement;
                attempts++;
            }
            
            return null;
        }

        extractRepliesFromContainer(container, mainComment) {
            const replies = [];
            
            // 查找容器内的所有可能的评论元素
            const allComments = container.querySelectorAll(
                '[data-e2e*="comment"], div[class*="comment"], [role="listitem"], div[class*="reply"]'
            );
            
            for (const comment of allComments) {
                // 跳过主评论自身
                if (comment === mainComment) {
                    continue;
                }
                
                // 检查是否是有效的回复
                if (this.isValidReplyElement(comment, mainComment)) {
                    replies.push(comment);
                }
            }
            
            return replies;
        }

        isValidReplyElement(element, mainComment) {
            const text = element.textContent?.trim() || '';
            
            // 基本验证
            if (text.length < 5 || text.length > 1000) {
                return false;
            }
            
            // 不能与主评论相同
            const mainText = mainComment.textContent?.trim() || '';
            if (text === mainText) {
                return false;
            }
            
            // 检查是否包含回复特征
            const hasReplyFeatures = text.includes('@') || 
                                   text.includes('回复') ||
                                   element.querySelector('a[href*="/user/"]');
            
            return hasReplyFeatures || text.length > 20;
        }

        smartFindReplies(commentElement) {
            const replies = [];
            
            // 在评论元素的兄弟元素中查找
            let sibling = commentElement.nextElementSibling;
            let count = 0;
            
            while (sibling && count < 10) {
                const score = this.calculateCommentScore(sibling);
                if (score >= 2) { // 回复的阈值比主评论低一点
                    replies.push(sibling);
                }
                
                // 如果遇到下一个明显的主评论，停止
                if (score >= 4) {
                    break;
                }
                
                sibling = sibling.nextElementSibling;
                count++;
            }
            
            return replies;
        }

        async expandRepliesForComment(commentElement, commentIndex) {
            // 查找展开按钮的多种策略
            const expandStrategies = [
                // 策略1: 在评论内查找
                () => commentElement.querySelector('button, [role="button"]'),
                
                // 策略2: 在评论后的兄弟元素中查找
                () => {
                    let sibling = commentElement.nextElementSibling;
                    for (let i = 0; i < 3 && sibling; i++) {
                        const button = sibling.querySelector('button, [role="button"]');
                        if (button && this.isExpandButton(button)) {
                            return button;
                        }
                        sibling = sibling.nextElementSibling;
                    }
                    return null;
                },
                
                // 策略3: 在父容器中查找
                () => {
                    const parent = commentElement.parentElement;
                    return parent ? parent.querySelector('button[class*="expand"], button[class*="reply"]') : null;
                }
            ];
            
            for (let i = 0; i < expandStrategies.length; i++) {
                const button = expandStrategies[i]();
                if (button && this.isExpandButton(button)) {
                    try {
                        this.log(`💬 评论 ${commentIndex}: 使用策略${i+1}点击展开按钮`);
                        button.click();
                        await this.sleep(CONFIG.delays.expandReply);
                        return;
                    } catch (e) {
                        this.log(`💬 评论 ${commentIndex}: 点击展开按钮失败: ${e.message}`);
                    }
                }
            }
        }

        isExpandButton(button) {
            const text = button.textContent?.trim() || '';
            return text.includes('展开') || 
                   text.includes('回复') || 
                   /\d+条/.test(text) ||
                   text.includes('更多');
        }

        // ==================== 主要采集流程 ====================

        checkPageForComments() {
            // 检查页面是否具备评论采集的基本条件
            const checks = {
                hasComments: false,
                isCommentSectionOpen: false,
                message: '',
                details: [],
                suggestions: []
            };

            // 检查1: 是否在抖音域名
            if (!window.location.hostname.includes('douyin.com')) {
                checks.message = '不在抖音网站';
                checks.suggestions.push('请在抖音视频页面使用此脚本');
                return checks;
            }

            // 检查2: 是否包含视频元素
            const hasVideo = document.querySelector('video, .xgplayer');
            if (!hasVideo) {
                checks.details.push('未找到视频播放器');
                checks.suggestions.push('请确保在视频播放页面');
            } else {
                checks.details.push('✅ 视频播放器正常');
            }

            // 检查3: 是否包含评论相关元素
            const commentRelated = document.querySelectorAll('[data-e2e*="comment"], [class*="comment"], button[aria-label*="评论"]');
            if (commentRelated.length > 0) {
                checks.details.push(`✅ 找到${commentRelated.length}个评论相关元素`);
                checks.hasComments = true;
            } else {
                checks.details.push('❌ 未找到评论相关元素');
            }

            // 检查4: 评论区是否已展开/打开
            const commentSectionChecks = this.checkCommentSectionStatus();
            checks.isCommentSectionOpen = commentSectionChecks.isOpen;
            checks.details.push(...commentSectionChecks.details);
            checks.suggestions.push(...commentSectionChecks.suggestions);

            // 检查5: 页面文本内容
            const pageText = document.body.textContent;
            const hasCommentText = pageText.includes('评论') || pageText.includes('回复') || pageText.includes('点赞');
            if (hasCommentText) {
                checks.details.push('✅ 页面包含评论相关文本');
                checks.hasComments = true;
            }

            // 综合判断
            if (checks.hasComments && checks.isCommentSectionOpen) {
                checks.message = '✅ 页面状态良好，可以开始采集';
            } else if (checks.hasComments && !checks.isCommentSectionOpen) {
                checks.message = '⚠️ 评论区可能未展开，建议先打开评论区';
            } else {
                checks.message = '❌ 页面不适合采集评论';
            }

            return checks;
        }

        checkCommentSectionStatus() {
            // 检查评论区是否已打开的多种策略
            const result = {
                isOpen: false,
                details: [],
                suggestions: []
            };

            // 策略1: 检查是否有可见的评论列表
            const commentLists = document.querySelectorAll('[data-e2e*="comment-list"], [class*="comment-list"], [class*="comment-main"]');
            if (commentLists.length > 0) {
                let hasVisibleList = false;
                commentLists.forEach(list => {
                    if (this.isElementVisible(list)) {
                        hasVisibleList = true;
                    }
                });
                if (hasVisibleList) {
                    result.isOpen = true;
                    result.details.push('✅ 找到可见的评论列表');
                    return result;
                }
            }

            // 策略2: 检查是否有评论项元素
            const commentItems = document.querySelectorAll('[data-e2e="comment-item"]');
            if (commentItems.length > 0) {
                let visibleCount = 0;
                commentItems.forEach(item => {
                    if (this.isElementVisible(item)) visibleCount++;
                });
                if (visibleCount >= 2) {
                    result.isOpen = true;
                    result.details.push(`✅ 找到${visibleCount}个可见评论项`);
                    return result;
                }
            }

            // 策略3: 检查评论区容器是否展开
            const commentContainers = document.querySelectorAll('[class*="comment-container"], [class*="comment-section"]');
            commentContainers.forEach(container => {
                if (this.isElementVisible(container) && container.getBoundingClientRect().height > 200) {
                    result.isOpen = true;
                    result.details.push('✅ 找到展开的评论区容器');
                    return result;
                }
            });

            // 策略4: 检查是否有评论输入框（表示评论区已打开）
            const commentInputs = document.querySelectorAll('input[placeholder*="评论"], textarea[placeholder*="评论"], [contenteditable][placeholder*="评论"]');
            if (commentInputs.length > 0) {
                let hasVisibleInput = false;
                commentInputs.forEach(input => {
                    if (this.isElementVisible(input)) {
                        hasVisibleInput = true;
                    }
                });
                if (hasVisibleInput) {
                    result.isOpen = true;
                    result.details.push('✅ 找到可见的评论输入框');
                    return result;
                }
            }

            // 如果所有策略都失败
            result.details.push('❌ 未检测到已打开的评论区');
            result.suggestions.push('请点击视频右侧的评论图标打开评论区');
            result.suggestions.push('或者尝试双击视频区域');
            result.suggestions.push('确保页面已完全加载');

            return result;
        }

        async tryToOpenCommentSection() {
            this.log('🔄 尝试自动打开评论区...');
            
            // 策略1: 查找并点击评论图标
            const commentIconSelectors = [
                // 抖音右侧评论图标的各种可能选择器
                '[data-e2e*="comment-icon"]',
                '[aria-label*="评论"]',
                'button[title*="评论"]',
                '[class*="comment-icon"]',
                '[class*="comment-btn"]',
                'svg[class*="comment"]',
                '.semi-icon-comment',
                'button[aria-label*="comment"]'
            ];

            for (const selector of commentIconSelectors) {
                try {
                    const icons = document.querySelectorAll(selector);
                    for (const icon of icons) {
                        if (this.isElementVisible(icon) && !icon.disabled) {
                            this.log(`🔍 尝试点击评论图标: ${selector}`);
                            icon.click();
                            await this.sleep(2000);
                            
                            // 检查是否成功打开
                            const checkResult = this.checkCommentSectionStatus();
                            if (checkResult.isOpen) {
                                this.log('✅ 成功通过评论图标打开评论区');
                                return true;
                            }
                        }
                    }
                } catch (e) {
                    this.log(`❌ 点击评论图标失败: ${e.message}`);
                }
            }

            // 策略2: 尝试键盘快捷键
            this.log('🔍 尝试键盘快捷键...');
            try {
                // 模拟按下C键（常见的评论快捷键）
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
                await this.sleep(1000);
                
                const checkResult = this.checkCommentSectionStatus();
                if (checkResult.isOpen) {
                    this.log('✅ 成功通过键盘快捷键打开评论区');
                    return true;
                }
            } catch (e) {
                this.log(`❌ 键盘快捷键失败: ${e.message}`);
            }

            // 策略3: 尝试滚动到页面底部（某些情况下会触发评论区）
            this.log('🔍 尝试滚动到底部...');
            try {
                const originalScrollY = window.scrollY;
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                await this.sleep(2000);
                
                const checkResult = this.checkCommentSectionStatus();
                if (checkResult.isOpen) {
                    this.log('✅ 成功通过滚动打开评论区');
                    return true;
                }
                
                // 恢复原始滚动位置
                window.scrollTo({ top: originalScrollY, behavior: 'smooth' });
                await this.sleep(1000);
            } catch (e) {
                this.log(`❌ 滚动策略失败: ${e.message}`);
            }

            this.log('❌ 所有自动打开评论区的策略都失败了');
            return false;
        }

        async redetectComments() {
            this.log('🔍 开始重新检测评论区...');
            this.updateStatus('正在重新检测评论区...');
            
            try {
                // 重新检查页面状态
                const pageCheck = this.checkPageForComments();
                
                // 显示检测结果
                this.log(`📋 页面检测结果: ${pageCheck.message}`);
                pageCheck.details.forEach(detail => this.log(`  ${detail}`));
                
                if (pageCheck.suggestions.length > 0) {
                    this.log('💡 建议:');
                    pageCheck.suggestions.forEach(suggestion => this.log(`  ${suggestion}`));
                }
                
                // 更新状态显示
                if (pageCheck.hasComments && pageCheck.isCommentSectionOpen) {
                    this.updateStatus('✅ 评论区检测正常，可以开始采集');
                    GM_notification({
                        title: '评论区检测',
                        text: '✅ 评论区已打开，可以开始采集',
                        timeout: 3000
                    });
                } else if (pageCheck.hasComments && !pageCheck.isCommentSectionOpen) {
                    this.updateStatus('⚠️ 评论区未打开，请手动打开后再试');
                    GM_notification({
                        title: '评论区检测',
                        text: '⚠️ 评论区未打开，请手动打开',
                        timeout: 3000
                    });
                } else {
                    this.updateStatus('❌ 页面不适合采集评论');
                    GM_notification({
                        title: '评论区检测',
                        text: '❌ 页面不适合采集评论',
                        timeout: 3000
                    });
                }
                
            } catch (error) {
                this.log(`❌ 重新检测失败: ${error.message}`, 'error');
                this.updateStatus(`检测失败: ${error.message}`);
                GM_notification({
                    title: '检测失败',
                    text: error.message,
                    timeout: 3000
                });
            }
        }

        checkCommentSectionStatus() {
            const result = {
                isOpen: false,
                details: [],
                suggestions: []
            };

            // 策略1: 检查是否有可见的评论列表
            const commentItems = document.querySelectorAll('[data-e2e="comment-item"]');
            if (commentItems.length > 0) {
                // 检查这些评论是否真的可见
                const visibleComments = Array.from(commentItems).filter(item => {
                    const rect = item.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });
                
                if (visibleComments.length > 0) {
                    result.isOpen = true;
                    result.details.push(`✅ 评论区已展开，发现${visibleComments.length}条可见评论`);
                } else {
                    result.details.push('❌ 找到评论元素但不可见');
                    result.suggestions.push('尝试滚动到评论区域或点击评论按钮');
                }
            } else {
                result.details.push('❌ 未找到评论列表元素');
            }

            // 策略2: 检查评论按钮状态
            const commentButtons = document.querySelectorAll('button[aria-label*="评论"], [data-e2e*="comment-button"]');
            for (const button of commentButtons) {
                const buttonText = button.textContent?.trim() || '';
                const ariaLabel = button.getAttribute('aria-label') || '';
                
                // 检查按钮是否表示评论区已打开
                if (buttonText.includes('收起') || ariaLabel.includes('收起') || 
                    button.classList.contains('active') || button.getAttribute('aria-expanded') === 'true') {
                    result.isOpen = true;
                    result.details.push('✅ 评论按钮显示为已展开状态');
                    break;
                }
            }

            // 策略3: 检查评论容器的可见性
            const commentContainers = document.querySelectorAll('[class*="comment-list"], [class*="comment-container"], [id*="comment"]');
            for (const container of commentContainers) {
                const rect = container.getBoundingClientRect();
                const style = window.getComputedStyle(container);
                
                if (rect.height > 100 && style.display !== 'none' && style.visibility !== 'hidden') {
                    result.isOpen = true;
                    result.details.push('✅ 发现可见的评论容器');
                    break;
                }
            }

            // 策略4: 检查URL是否包含评论相关参数
            if (window.location.href.includes('comment') || window.location.hash.includes('comment')) {
                result.details.push('✅ URL包含评论相关参数');
                result.isOpen = true;
            }

            // 如果评论区未打开，提供建议
            if (!result.isOpen) {
                result.suggestions.push('1. 点击视频下方的"评论"按钮');
                result.suggestions.push('2. 滚动到页面下方查找评论区');
                result.suggestions.push('3. 确保页面完全加载完成');
                result.suggestions.push('4. 尝试刷新页面后重新打开评论区');
            }

            return result;
        }

        async tryToOpenCommentSection() {
            this.log('🔧 尝试自动打开评论区...');
            
            // 策略1: 查找并点击评论按钮
            const commentButtons = [
                'button[aria-label*="评论"]',
                '[data-e2e*="comment-button"]',
                'button:contains("评论")',
                '.comment-button',
                '[class*="comment"][class*="button"]'
            ];
            
            for (const selector of commentButtons) {
                try {
                    const button = document.querySelector(selector);
                    if (button && !button.disabled) {
                        // 检查按钮是否可见
                        const rect = button.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            this.log(`💬 找到评论按钮: ${selector}`);
                            button.click();
                            await this.sleep(2000); // 等待动画完成
                            
                            // 检查是否成功打开
                            const checkResult = this.checkCommentSectionStatus();
                            if (checkResult.isOpen) {
                                this.log('✅ 成功打开评论区');
                                return true;
                            }
                        }
                    }
                } catch (e) {
                    this.log(`⚠️ 点击评论按钮失败: ${e.message}`);
                }
            }
            
            // 策略2: 尝试滚动到页面底部（评论区通常在底部）
            this.log('📜 尝试滚动到页面底部查找评论区...');
            const originalScrollY = window.scrollY;
            
            // 平滑滚动到底部
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            
            await this.sleep(3000); // 等待滚动和加载
            
            // 检查是否找到了评论区
            const scrollCheckResult = this.checkCommentSectionStatus();
            if (scrollCheckResult.isOpen) {
                this.log('✅ 滚动后找到了评论区');
                return true;
            }
            
            // 如果滚动没有帮助，回到原位置
            window.scrollTo({
                top: originalScrollY,
                behavior: 'smooth'
            });
            
            await this.sleep(1000);
            this.log('❌ 自动打开评论区失败');
            return false;
        }

        async startCollection() {
            if (this.isCollecting) {
                this.log('⚠️ 正在采集中，请稍候...');
                return;
            }

            this.isCollecting = true;
            this.comments = [];
            
            try {
                this.log('🚀 开始采集评论...');
                this.updateStatus('正在查找评论...');
                
                // 检查页面状态
                this.log('🔍 检查页面状态...');
                const pageCheck = this.checkPageForComments();
                
                // 显示详细的检查结果
                this.log(`📋 页面状态: ${pageCheck.message}`);
                pageCheck.details.forEach(detail => this.log(`  ${detail}`));
                
                // 如果评论区未打开，尝试自动打开
                if (!pageCheck.isCommentSectionOpen) {
                    this.log('⚠️ 评论区未打开，尝试自动打开...', 'warn');
                    this.updateStatus('正在尝试打开评论区...');
                    
                    // 尝试自动打开评论区
                    const autoOpenSuccess = await this.tryToOpenCommentSection();
                    
                    if (!autoOpenSuccess) {
                        // 自动打开失败，显示手动操作建议
                        this.log('💡 自动打开失败，请手动操作:', 'warn');
                        pageCheck.suggestions.forEach(suggestion => this.log(`  ${suggestion}`, 'warn'));
                        
                        // 给用户10秒时间手动打开评论区
                        this.log('⏳ 等待10秒，您可以手动打开评论区...', 'warn');
                        this.updateStatus('请手动打开评论区，等待10秒...');
                        await this.sleep(10000);
                        
                        // 最终检查
                        const finalCheck = this.checkCommentSectionStatus();
                        if (finalCheck.isOpen) {
                            this.log('✅ 检测到评论区已打开，继续采集');
                            this.updateStatus('评论区已打开，开始采集...');
                        } else {
                            this.log('⚠️ 评论区仍未确认打开，但将尝试继续采集', 'warn');
                            this.updateStatus('评论区状态未知，尝试采集...');
                        }
                    } else {
                        this.log('✅ 评论区已自动打开，继续采集');
                        this.updateStatus('评论区已打开，开始采集...');
                    }
                }
                
                // 如果完全没有评论相关元素，则停止
                if (!pageCheck.hasComments) {
                    throw new Error(`页面检查失败: ${pageCheck.message}`);
                }
                
                // 暂停视频
                await this.pauseVideo();
                
                // 等待页面稳定
                await this.sleep(1000);
                
                // 查找评论元素
                const commentElements = this.findCommentElements();
                
                if (commentElements.length === 0) {
                    throw new Error('未找到评论元素，请确保评论区已展开');
                }
                
                this.log(`📊 找到 ${commentElements.length} 个评论元素`);
                this.updateStatus(`正在处理 ${commentElements.length} 个评论...`);
                
                // 处理每个评论
                for (let i = 0; i < commentElements.length; i++) {
                    try {
                        await this.processComment(commentElements[i], i);
                        this.updateStatus(`处理进度: ${i + 1}/${commentElements.length}`);
                        await this.sleep(200); // 避免过快处理
                    } catch (e) {
                        this.log(`❌ 处理评论 ${i} 失败: ${e.message}`);
                    }
                }
                
                this.log(`✅ 采集完成！共收集 ${this.comments.length} 条评论`);
                this.updateStatus(`采集完成！共 ${this.comments.length} 条评论`);
                
                // 最终更新统计
                this.updateStats();
                
                if (this.comments.length > 0) {
                    this.downloadComments();
                } else {
                    this.log('⚠️ 没有收集到有效评论');
                }
                
            } catch (error) {
                this.log(`❌ 采集失败: ${error.message}`, 'error');
                this.updateStatus(`采集失败: ${error.message}`);
            } finally {
                this.isCollecting = false;
            }
        }

        async processComment(element, index) {
            this.log(`📝 处理评论 ${index + 1}...`);
            
            // 提取评论信息
            const commentData = this.extractCommentData(element);
            if (!commentData) {
                this.log(`⚠️ 评论 ${index + 1}: 无法提取有效信息`);
                return;
            }
            
            // 查找回复
            const replies = await this.findRepliesForComment(element, index + 1);
            
            // 处理回复
            const processedReplies = [];
            for (const replyElement of replies) {
                const replyData = this.extractReplyData(replyElement);
                if (replyData) {
                    processedReplies.push(replyData);
                }
            }
            
            // 添加到结果
            commentData.replies = processedReplies;
            commentData.replyCount = processedReplies.length;
            
            this.comments.push(commentData);
            this.log(`✅ 评论 ${index + 1}: 提取成功，包含 ${processedReplies.length} 个回复`);
            
            // 实时更新UI统计
            this.updateStats();
        }

        extractCommentData(element) {
            const text = this.extractCommentText(element);
            if (!text || text.length < 5) {
                return null;
            }
            
            return {
                text: text,
                user: this.extractUserName(element),
                likes: this.extractLikes(element),
                time: this.extractTime(element),
                index: this.comments.length + 1
            };
        }

        extractCommentText(element) {
            this.log(`🔍 开始提取评论文本: 元素类名="${element.className}"`, 'debug');
            
            // 多策略提取评论文本
            const textStrategies = [
                // 策略1: 查找最长的文本节点
                () => {
                    const textNodes = this.getAllTextNodes(element);
                    let longestText = '';
                    for (const node of textNodes) {
                        const text = node.textContent?.trim() || '';
                        if (text.length > longestText.length && text.length > 10 && !this.isUIText(text)) {
                            longestText = text;
                        }
                    }
                    return longestText;
                },
                
                // 策略2: 特定选择器
                () => {
                    const textSelectors = [
                        'span:not([class*="icon"]):not([class*="button"])',
                        'p',
                        'div[class*="text"]', 
                        'div[class*="content"]',
                        '.LvAtyU_f .sU2yAQQU',
                        '.LvAtyU_f'
                    ];
                    
                    for (const selector of textSelectors) {
                        const textEl = element.querySelector(selector);
                        if (textEl) {
                            const text = textEl.textContent?.trim();
                            if (text && text.length > 10 && !this.isUIText(text)) {
                                this.log(`✅ 策略2成功: 选择器="${selector}", 文本="${text.substring(0, 30)}..."`, 'debug');
                                return text;
                            }
                        }
                    }
                    return '';
                },
                
                // 策略3: 寻找包含有意义文本的子元素
                () => {
                    const children = element.querySelectorAll('*');
                    for (const child of children) {
                        const text = child.textContent?.trim();
                        // 寻找文本长度适中的元素
                        if (text && text.length > 15 && text.length < 500 && !this.isUIText(text)) {
                            // 确保不是纯数字（点赞数等）
                            if (!/^\d+$/.test(text)) {
                                this.log(`✅ 策略3成功: 子元素文本="${text.substring(0, 30)}..."`, 'debug');
                                return text;
                            }
                        }
                    }
                    return '';
                }
            ];
            
            // 尝试各种策略
            for (let i = 0; i < textStrategies.length; i++) {
                const text = textStrategies[i]();
                if (text && text.length > 5) {
                    const cleanedText = this.cleanText(text);
                    this.log(`✅ 文本提取策略${i + 1}成功: "${cleanedText.substring(0, 50)}..."`, 'debug');
                    return cleanedText;
                }
            }
            
            // 最后策略：使用整个元素文本但严格清理
            const fullText = element.textContent?.trim();
            if (fullText && fullText.length > 10) {
                const cleanedText = this.cleanText(fullText);
                if (cleanedText.length > 10) {
                    this.log(`✅ 最后策略成功: "${cleanedText.substring(0, 50)}..."`, 'debug');
                    return cleanedText;
                }
            }
            
            this.log(`❌ 所有文本提取策略都失败了`, 'debug');
            return '';
        }
        
        getAllTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            return textNodes;
        }

        extractUserName(element) {
            const userSelectors = [
                'a[href*="/user/"]',
                '[class*="user"] a',
                '[class*="name"] a',
                '.F7ubq_7y a',  // 旧选择器
                'a:first-of-type'
            ];
            
            for (const selector of userSelectors) {
                const userEl = element.querySelector(selector);
                if (userEl) {
                    const username = userEl.textContent?.trim();
                    if (username && username.length > 0 && username.length < 50) {
                        return username;
                    }
                }
            }
            
            return '未知用户';
        }

        extractLikes(element) {
            const likeSelectors = [
                '[class*="like"] span',
                '[class*="digg"] span',
                'button span',
                'span'
            ];
            
            for (const selector of likeSelectors) {
                const spans = element.querySelectorAll(selector);
                for (const span of spans) {
                    const text = span.textContent?.trim();
                    if (text && /^\d+(\.\d+)?[万千kKwW]?$/.test(text)) {
                        return this.parseNumber(text);
                    }
                }
            }
            
            return 0;
        }

        extractTime(element) {
            const text = element.textContent;
            const timePattern = /(\d+[天小时分钟秒]前|刚刚|几秒前)/;
            const match = text.match(timePattern);
            return match ? match[1] : '';
        }

        extractReplyData(element) {
            const text = this.extractReplyText(element);
            const user = this.extractUserName(element);
            
            // 确保回复文本不为空且不等于用户名
            if (!text || text.length < 3 || text === user) {
                this.log(`⚠️ 回复提取失败: text="${text}", user="${user}"`);
                return null;
            }
            
            return {
                text: text,
                user: user,
                likes: this.extractLikes(element),
                time: this.extractTime(element)
            };
        }

        extractReplyText(element) {
            this.log(`🔍 开始提取回复文本: 元素类名="${element.className}"`, 'debug');
            
            // 针对回复的专门文本提取策略
            const replyTextStrategies = [
                // 策略1: 查找回复内容的特定选择器
                () => {
                    const replySelectors = [
                        '[class*="reply-text"]',
                        '[class*="content"]',
                        '[class*="text"]',
                        'span:not([class*="user"]):not([class*="name"]):not([class*="time"]):not([class*="like"])',
                        'div:not([class*="user"]):not([class*="name"]):not([class*="time"]):not([class*="like"])'
                    ];
                    
                    for (const selector of replySelectors) {
                        const textEl = element.querySelector(selector);
                        if (textEl) {
                            const text = textEl.textContent?.trim();
                            if (text && text.length > 5 && !this.isUIText(text)) {
                                this.log(`✅ 回复策略1成功: 选择器="${selector}", 文本="${text.substring(0, 30)}..."`, 'debug');
                                return this.cleanReplyText(text);
                            }
                        }
                    }
                    return '';
                },
                
                // 策略2: 查找最长的非用户名文本节点
                () => {
                    const textNodes = this.getAllTextNodes(element);
                    const userName = this.extractUserName(element);
                    let longestText = '';
                    
                    for (const node of textNodes) {
                        const text = node.textContent?.trim() || '';
                        // 排除用户名、UI文本、时间等
                        if (text.length > longestText.length && 
                            text.length > 10 && 
                            text !== userName &&
                            !this.isUIText(text) &&
                            !this.isTimeText(text) &&
                            !this.isLikeText(text)) {
                            longestText = text;
                        }
                    }
                    
                    if (longestText) {
                        this.log(`✅ 回复策略2成功: 文本="${longestText.substring(0, 30)}..."`, 'debug');
                        return this.cleanReplyText(longestText);
                    }
                    return '';
                },
                
                // 策略3: 排除法 - 去掉用户名和其他元素后的剩余文本
                () => {
                    let fullText = element.textContent?.trim() || '';
                    const userName = this.extractUserName(element);
                    const likes = this.extractLikes(element);
                    const time = this.extractTime(element);
                    
                    // 移除用户名
                    if (userName && userName !== '未知用户') {
                        fullText = fullText.replace(userName, '').trim();
                    }
                    
                    // 移除点赞数
                    if (likes > 0) {
                        fullText = fullText.replace(new RegExp(`${likes}`, 'g'), '').trim();
                    }
                    
                    // 移除时间
                    if (time) {
                        fullText = fullText.replace(time, '').trim();
                    }
                    
                    const cleanText = this.cleanReplyText(fullText);
                    if (cleanText && cleanText.length > 5) {
                        this.log(`✅ 回复策略3成功: 文本="${cleanText.substring(0, 30)}..."`, 'debug');
                        return cleanText;
                    }
                    return '';
                }
            ];
            
            // 尝试每个策略
            for (let i = 0; i < replyTextStrategies.length; i++) {
                const text = replyTextStrategies[i]();
                if (text && text.length > 3) {
                    this.log(`✅ 回复文本提取成功 (策略${i+1}): "${text.substring(0, 50)}..."`, 'debug');
                    return text;
                }
            }
            
            this.log('❌ 所有回复文本提取策略都失败', 'debug');
            return '';
        }

        cleanReplyText(text) {
            if (!text) return '';
            
            return text
                .replace(/^\d+赞\s*/, '')  // 移除点赞数
                .replace(/\s*(赞|回复|分享|举报|更多)$/, '')  // 移除操作词
                .replace(/\s*展开\d+条回复$/, '')  // 移除展开提示
                .replace(/\d+:\d+$/, '')  // 移除时间戳
                .replace(/\s*(刚刚|\d+[天小时分钟秒]前)$/, '')  // 移除时间
                .replace(/^\s*@\w+\s*/, '')  // 移除@用户名开头
                .trim();
        }

        isTimeText(text) {
            return /^\d+[天小时分钟秒]前$|^刚刚$|^几秒前$/.test(text);
        }

        isLikeText(text) {
            return /^\d+$/.test(text) && parseInt(text) >= 0;
        }

        // ==================== 工具方法 ====================

        cleanText(text) {
            if (!text) return '';
            
            return text
                .replace(/^\d+赞\s*/, '')  // 移除点赞数
                .replace(/\s*(赞|回复|分享|举报|更多)$/, '')  // 移除操作词
                .replace(/\s*展开\d+条回复$/, '')  // 移除展开提示
                .replace(/\d+:\d+$/, '')  // 移除时间戳
                .replace(/\s*(刚刚|\d+[天小时分钟秒]前)$/, '')  // 移除时间
                .trim();
        }

        isUIText(text) {
            const uiKeywords = ['赞', '回复', '分享', '举报', '更多', '点赞', '评论', '关注', '取消关注'];
            return uiKeywords.some(keyword => text === keyword);
        }

        parseNumber(str) {
            if (!str) return 0;
            
            const num = parseFloat(str.replace(/[万千kKwW]/g, ''));
            if (str.includes('万') || str.includes('w') || str.includes('W')) {
                return Math.round(num * 10000);
            }
            if (str.includes('千') || str.includes('k') || str.includes('K')) {
                return Math.round(num * 1000);
            }
            return Math.round(num);
        }

        async pauseVideo() {
            this.log('⏸️ 暂停视频播放...');
            
            const videos = document.querySelectorAll('video');
            for (const video of videos) {
                if (!video.paused) {
                    try {
                        video.pause();
                        this.log('✅ 视频已暂停');
                        return;
                    } catch (e) {
                        this.log(`⚠️ 暂停视频失败: ${e.message}`);
                    }
                }
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        getVideoTitle() {
            this.log('🔍 开始获取视频标题...');
            
            // 抖音视频标题的多种可能选择器
            const titleSelectors = [
                // 常见的视频标题选择器
                '[data-e2e="video-desc"]',
                '[data-e2e*="desc"]',
                '[class*="video-desc"]',
                '[class*="video-title"]',
                'h1',
                'h2',
                'title',
                // 描述文本相关
                '[class*="desc"]',
                '[class*="description"]',
                '[class*="content"]',
                // 基于结构查找
                'div[class*="info"] span',
                'div[class*="detail"] span',
                // 通用文本容器
                'span:not([class*="icon"]):not([class*="button"])',
                'div:not([class*="icon"]):not([class*="button"])'
            ];
            
            for (const selector of titleSelectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        const text = element.textContent?.trim();
                        if (text && text.length > 10 && text.length < 200) {
                            // 排除明显不是标题的内容
                            if (!this.isUIText(text) && 
                                !text.includes('点赞') && 
                                !text.includes('评论') && 
                                !text.includes('分享') &&
                                !text.match(/^\d+$/) &&
                                !text.includes('关注') &&
                                !text.includes('粉丝')) {
                                
                                this.log(`✅ 找到视频标题: "${text.substring(0, 50)}..."`);
                                return this.sanitizeFilename(text);
                            }
                        }
                    }
                } catch (e) {
                    this.log(`⚠️ 选择器 ${selector} 查找失败: ${e.message}`);
                }
            }
            
            // 如果没有找到合适的标题，尝试从页面标题获取
            const pageTitle = document.title;
            if (pageTitle && pageTitle.length > 5 && !pageTitle.includes('抖音')) {
                this.log(`✅ 使用页面标题: "${pageTitle}"`);
                return this.sanitizeFilename(pageTitle);
            }
            
            // 最后尝试从URL获取视频ID
            const urlMatch = window.location.href.match(/\/video\/(\d+)/);
            if (urlMatch) {
                const videoId = urlMatch[1];
                this.log(`✅ 使用视频ID: ${videoId}`);
                return `video_${videoId}`;
            }
            
            this.log('❌ 未能获取到视频标题，使用默认名称');
            return 'douyin_video';
        }

        sanitizeFilename(filename) {
            // 清理文件名，移除不合法的字符
            return filename
                .replace(/[<>:"/\\|?*]/g, '') // 移除Windows不允许的字符
                .replace(/\s+/g, '_') // 空格替换为下划线
                .replace(/[^\w\u4e00-\u9fa5._-]/g, '') // 只保留字母数字中文和基本符号
                .substring(0, 100) // 限制长度
                .trim();
        }

        // ==================== UI 界面 ====================

        setupUI() {
            // 创建UI元素 - 恢复原始抽屉式设计，支持拖动
            const collector = document.createElement('div');
            collector.className = 'douyin-collector-drawer';
            collector.innerHTML = `
                <div class="douyin-collector-tab draggable-handle">
                    <div class="douyin-collector-tab-icon">采集</div>
                    <div class="drag-indicator">⋮⋮</div>
                </div>
                <div class="douyin-collector-content">
                    <div class="collector-header draggable-header">
                        <h2 class="collector-title">评论采集助手</h2>
                        <div class="collector-version">v${CONFIG.version} 修复版</div>
                        <div class="header-drag-indicator">⋮⋮⋮</div>
                    </div>

                    <div class="collector-section">
                        <h3>⚙️ 采集设置</h3>
                        <div class="collector-setting">
                            <label>最少点赞数:</label>
                            <input type="number" class="collector-input" id="min-likes" value="${this.settings.minLikes}" min="0">
                        </div>
                        <div class="collector-setting">
                            <label>目标数量:</label>
                            <input type="number" class="collector-input" id="target-comments" value="${this.settings.targetComments}" min="5" max="100">
                        </div>
                        <div class="collector-setting">
                            <label>自动滚动:</label>
                            <input type="checkbox" id="auto-scroll" ${this.settings.autoScroll ? 'checked' : ''}>
                        </div>
                        <div class="collector-setting">
                            <label>采集回复:</label>
                            <input type="checkbox" id="collect-replies" ${this.settings.collectReplies ? 'checked' : ''}>
                        </div>
                    </div>

                    <div class="collector-section">
                        <h3><span class="collector-status-indicator status-idle" id="status-indicator"></span>操作控制</h3>
                        <button class="collector-button" id="redetect-comments">重新检测评论区</button>
                        <button class="collector-button" id="start-collect">开始采集</button>
                        <button class="collector-button" id="export-data">导出数据</button>
                        <button class="collector-button" id="clear-data">清空数据</button>
                    </div>

                    <div class="collector-section">
                        <h3>📈 采集统计</h3>
                        <div class="collector-stats">
                            <div class="collector-stat">
                                <div class="collector-stat-value" id="stat-collected">0</div>
                                <div class="collector-stat-label">已采集</div>
                            </div>
                            <div class="collector-stat">
                                <div class="collector-stat-value" id="stat-replies">0</div>
                                <div class="collector-stat-label">回复数</div>
                            </div>
                        </div>
                    </div>

                    <div class="collector-section">
                        <h3>📝 状态</h3>
                        <div class="collector-status" id="collector-status">
                            就绪
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(collector);
            this.floatingWindow = collector;

            // 确保初始状态是收起的
            this.floatingWindow.classList.remove('expanded', 'expand-left', 'expand-right', 'expand-up', 'expand-down');
            this.log('✅ 初始状态确保为收起状态');
            
            // 调试：监控尺寸变化
            this.debugWindowSize();

            // 绑定事件
            this.bindEvents();

            // 初始化时设置正确的位置
            setTimeout(() => {
                this.setInitialPosition();
            }, 200);

            // 监听窗口大小变化
            window.addEventListener('resize', () => {
                if (!this.floatingWindow.classList.contains('expanded') && !this.floatingWindow.classList.contains('dragging')) {
                    // 只有在收起状态且不在拖动时才重新定位
                    setTimeout(() => {
                        this.setInitialPosition();
                    }, 100);
                }
            });

            this.log('✅ UI界面已加载（原始抽屉式设计）');
        }

        // 设置智能展开方向
        setSmartExpandDirection() {
            if (!this.floatingWindow) return;

            const rect = this.floatingWindow.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // 清除之前的展开方向类
            this.floatingWindow.classList.remove('expand-left', 'expand-right', 'expand-up', 'expand-down');
            
            // 悬浮窗中心点
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算到各边的距离
            const distanceToLeft = centerX;
            const distanceToRight = windowWidth - centerX;
            const distanceToTop = centerY;
            const distanceToBottom = windowHeight - centerY;
            
            // 调试日志
            this.log(`📍 悬浮窗位置: (${Math.round(rect.left)}, ${Math.round(rect.top)})`);
            this.log(`📏 距离 - 左:${Math.round(distanceToLeft)}, 右:${Math.round(distanceToRight)}, 上:${Math.round(distanceToTop)}, 下:${Math.round(distanceToBottom)}`);
            
            // 优先考虑水平方向，避免不必要的上下展开
            let expandDirection = '';
            
            // 如果靠近左右边缘，优先水平展开
            if (distanceToRight < 100) { // 靠近右边
                expandDirection = 'expand-left';
                this.floatingWindow.classList.add('expand-left');
            } else if (distanceToLeft < 100) { // 靠近左边
                expandDirection = 'expand-right';
                this.floatingWindow.classList.add('expand-right');
            } else if (distanceToBottom < 150) { // 靠近底部
                expandDirection = 'expand-up';
                this.floatingWindow.classList.add('expand-up');
            } else if (distanceToTop < 150) { // 靠近顶部
                expandDirection = 'expand-down';
                this.floatingWindow.classList.add('expand-down');
            } else {
                // 默认向左展开
                expandDirection = 'expand-left';
                this.floatingWindow.classList.add('expand-left');
            }
            
            this.log(`🎯 选择展开方向: ${expandDirection}`);
        }

        // 设置初始位置
        setInitialPosition() {
            if (!this.floatingWindow) return;

            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            
            // 使用收起状态的固定尺寸
            const collapsedWidth = CONSTANTS.COLLAPSED_WIDTH;
            const collapsedHeight = CONSTANTS.COLLAPSED_HEIGHT;
            
            // 设置初始位置为屏幕宽度80%的位置
            const targetX = Math.round(windowWidth * 0.80); // 屏幕宽度的80%
            const targetY = CONSTANTS.EDGE_MARGIN; // 顶部边距
            
            // 清除CSS定位，使用绝对定位
            this.floatingWindow.style.position = 'fixed';
            this.floatingWindow.style.left = `${targetX}px`;
            this.floatingWindow.style.top = `${targetY}px`;
            this.floatingWindow.style.right = 'auto';
            this.floatingWindow.style.transform = 'none';
            
            // 暂时禁用智能展开方向，调试自动展开问题
            // this.setSmartExpandDirection();
            
            this.log(`📍 初始位置: (${targetX}, ${targetY})`);
        }

        // 自动贴边功能
        snapToEdge() {
            if (!this.floatingWindow) return;

            const rect = this.floatingWindow.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // 使用收起状态的固定尺寸，而不是当前可能的展开尺寸
            const collapsedWidth = CONSTANTS.COLLAPSED_WIDTH;
            const collapsedHeight = CONSTANTS.COLLAPSED_HEIGHT;
            
            // 计算当前中心位置（基于实际显示位置）
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 判断应该贴哪个边（距离最近的边）
            const distanceToLeft = centerX;
            const distanceToRight = windowWidth - centerX;
            const distanceToTop = centerY;
            const distanceToBottom = windowHeight - centerY;
            
            const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
            
            let targetX = rect.left;
            let targetY = rect.top;
            
            // 根据最近距离决定贴边方向，使用收起状态尺寸计算
            if (minDistance === distanceToLeft) {
                // 贴左边
                targetX = 0;
            } else if (minDistance === distanceToRight) {
                // 贴右边
                targetX = windowWidth - collapsedWidth;
            } else if (minDistance === distanceToTop) {
                // 贴上边
                targetY = 10;
            } else if (minDistance === distanceToBottom) {
                // 贴下边
                targetY = windowHeight - collapsedHeight - 10;
            }
            
            // 确保不超出边界（使用收起状态尺寸）
            targetX = Math.max(0, Math.min(targetX, windowWidth - collapsedWidth));
            targetY = Math.max(10, Math.min(targetY, windowHeight - collapsedHeight - 10));
            
            // 添加贴边动画
            this.floatingWindow.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
            this.floatingWindow.style.left = `${targetX}px`;
            this.floatingWindow.style.top = `${targetY}px`;
            this.floatingWindow.style.right = 'auto';
            this.floatingWindow.style.transform = 'none';
            
            // 动画结束后移除transition，但不设置展开方向（等鼠标悬停时再计算）
            setTimeout(() => {
                if (this.floatingWindow) {
                    this.floatingWindow.style.transition = '';
                    // 清除可能存在的展开方向类，确保收起状态干净
                    this.floatingWindow.classList.remove('expand-left', 'expand-right', 'expand-up', 'expand-down');
                }
            }, CONSTANTS.ANIMATION_DURATION);
            
            this.log(`🧲 贴边: (${targetX}, ${targetY})`);
        }

        setupDragFunctionality() {
            const dragHandle = this.floatingWindow.querySelector('.draggable-handle');
            const dragIndicator = this.floatingWindow.querySelector('.drag-indicator');
            const headerDragHandle = this.floatingWindow.querySelector('.draggable-header');
            const headerDragIndicator = this.floatingWindow.querySelector('.header-drag-indicator');
            
            if (!dragHandle || !dragIndicator) {
                this.log('⚠️ 拖动手柄未找到，跳过拖动功能设置');
                return;
            }

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let initialX = 0;
            let initialY = 0;

            // 获取当前位置
            const getCurrentPosition = () => {
                const rect = this.floatingWindow.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top
                };
            };

            // 设置位置
            const setPosition = (x, y) => {
                // 确保不超出屏幕边界
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const elementWidth = this.floatingWindow.offsetWidth;
                const elementHeight = this.floatingWindow.offsetHeight;

                const clampedX = Math.max(0, Math.min(x, windowWidth - elementWidth));
                const clampedY = Math.max(0, Math.min(y, windowHeight - elementHeight));

                this.floatingWindow.style.position = 'fixed';
                this.floatingWindow.style.left = `${clampedX}px`;
                this.floatingWindow.style.top = `${clampedY}px`;
                this.floatingWindow.style.right = 'auto';
                this.floatingWindow.style.transform = 'none';
            };

            // 鼠标事件处理
            const handleMouseDown = (e) => {
                let canDrag = false;
                let dragType = '';

                // 检查是否点击了收起状态的拖动指示器
                if (e.target.closest('.drag-indicator') && this.floatingWindow.classList.contains('expanded')) {
                    canDrag = true;
                    dragType = 'tab';
                }
                // 检查是否点击了展开状态的标题栏
                else if (e.target.closest('.draggable-header') && this.floatingWindow.classList.contains('expanded')) {
                    canDrag = true;
                    dragType = 'header';
                }

                if (!canDrag) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                isDragging = true;
                const currentPos = getCurrentPosition();
                initialX = currentPos.x;
                initialY = currentPos.y;
                startX = e.clientX;
                startY = e.clientY;

                this.floatingWindow.classList.add('dragging');
                
                if (dragType === 'tab') {
                    dragIndicator.style.cursor = 'grabbing';
                } else if (dragType === 'header' && headerDragIndicator) {
                    headerDragIndicator.style.cursor = 'grabbing';
                }
                
                document.body.style.cursor = 'grabbing';

                this.log('🖱️ 开始拖动');
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;

                e.preventDefault();
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newX = initialX + deltaX;
                const newY = initialY + deltaY;

                setPosition(newX, newY);
            };

            const handleMouseUp = (e) => {
                if (!isDragging) return;

                isDragging = false;
                this.floatingWindow.classList.remove('dragging');
                
                // 恢复光标
                if (dragIndicator) dragIndicator.style.cursor = 'grab';
                if (headerDragIndicator) headerDragIndicator.style.cursor = 'grab';
                document.body.style.cursor = '';

                // 如果悬浮窗是收起状态，则自动贴边
                if (!this.floatingWindow.classList.contains('expanded')) {
                    setTimeout(() => {
                        this.snapToEdge();
                    }, 100);
                }

                this.log('🖱️ 拖动结束');
            };

            // 触摸事件处理（移动端支持）
            const handleTouchStart = (e) => {
                let canDrag = false;
                let dragType = '';

                // 检查是否触摸了拖动指示器或标题栏
                if (e.target.closest('.drag-indicator') && this.floatingWindow.classList.contains('expanded')) {
                    canDrag = true;
                    dragType = 'tab';
                } else if (e.target.closest('.draggable-header') && this.floatingWindow.classList.contains('expanded')) {
                    canDrag = true;
                    dragType = 'header';
                }

                if (!canDrag) {
                    return;
                }

                e.preventDefault();
                const touch = e.touches[0];
                
                isDragging = true;
                const currentPos = getCurrentPosition();
                initialX = currentPos.x;
                initialY = currentPos.y;
                startX = touch.clientX;
                startY = touch.clientY;

                this.floatingWindow.classList.add('dragging');
                this.log('👆 开始触摸拖动');
            };

            const handleTouchMove = (e) => {
                if (!isDragging) return;

                e.preventDefault();
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                const newX = initialX + deltaX;
                const newY = initialY + deltaY;

                setPosition(newX, newY);
            };

            const handleTouchEnd = (e) => {
                if (!isDragging) return;

                isDragging = false;
                this.floatingWindow.classList.remove('dragging');
                
                // 如果悬浮窗是收起状态，则自动贴边
                if (!this.floatingWindow.classList.contains('expanded')) {
                    setTimeout(() => {
                        this.snapToEdge();
                    }, 100);
                }
                
                this.log('👆 触摸拖动结束');
            };

            // 绑定事件 - 同时支持标签页和标题栏拖动
            dragHandle.addEventListener('mousedown', handleMouseDown);
            if (headerDragHandle) {
                headerDragHandle.addEventListener('mousedown', handleMouseDown);
            }
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // 触摸事件
            dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
            if (headerDragHandle) {
                headerDragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
            }
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);

            // 防止拖动时的默认行为
            dragHandle.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
            if (headerDragHandle) {
                headerDragHandle.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                });
            }

            this.log('✅ 拖动功能已启用');
        }

        bindEvents() {
            // 拖动功能
            this.setupDragFunctionality();

            // 悬停展开/收起 - 使用最简单的展开机制，确保稳定性
            this.floatingWindow.addEventListener('mouseenter', () => {
                this.log('🖱️ 鼠标悬停 - 开始展开');
                // 清除所有智能展开方向类，使用基础展开
                this.floatingWindow.classList.remove('expand-left', 'expand-right', 'expand-up', 'expand-down');
                // 添加展开类
                this.floatingWindow.classList.add('expanded');
                this.log('✅ 使用基础展开模式');
            });

            this.floatingWindow.addEventListener('mouseleave', () => {
                this.log('🖱️ 鼠标离开 - 准备收起');
                // 采集中或正在拖动时不收起
                if (!this.isCollecting && !this.floatingWindow.classList.contains('dragging')) {
                    this.floatingWindow.classList.remove('expanded');
                    // 清除展开方向类
                    this.floatingWindow.classList.remove('expand-left', 'expand-right', 'expand-up', 'expand-down');
                    this.log('✅ 展开类已移除');
                    
                    // 延迟执行贴边，等待收起动画完成
                    setTimeout(() => {
                        if (!this.floatingWindow.classList.contains('expanded')) {
                            this.snapToEdge();
                        }
                    }, 300);
                }
            });

            // 检查关键按钮是否存在
            const exportButton = document.getElementById('export-data');
            const startButton = document.getElementById('start-collect');
            const clearButton = document.getElementById('clear-data');
            
            this.log(`🔍 按钮检查: 开始采集=${!!startButton}, 导出数据=${!!exportButton}, 清空数据=${!!clearButton}`);

            // 设置变更
            document.getElementById('min-likes').addEventListener('change', (e) => {
                this.settings.minLikes = parseInt(e.target.value) || 0;
                this.log(`设置更新: 最少点赞数 = ${this.settings.minLikes}`);
            });

            document.getElementById('target-comments').addEventListener('change', (e) => {
                this.settings.targetComments = parseInt(e.target.value) || 20;
                this.log(`设置更新: 目标采集数量 = ${this.settings.targetComments}`);
            });

            document.getElementById('auto-scroll').addEventListener('change', (e) => {
                this.settings.autoScroll = e.target.checked;
                this.log(`设置更新: 自动滚动 = ${this.settings.autoScroll}`);
            });

            document.getElementById('collect-replies').addEventListener('change', (e) => {
                this.settings.collectReplies = e.target.checked;
                this.log(`设置更新: 采集回复 = ${this.settings.collectReplies}`);
            });

            // 操作按钮 - 添加错误处理
            const redetectBtn = document.getElementById('redetect-comments');
            if (redetectBtn) {
                redetectBtn.addEventListener('click', () => {
                    this.log('🖱️ 重新检测评论区按钮被点击');
                    this.redetectComments();
                });
            } else {
                this.log('❌ 未找到重新检测按钮', 'error');
            }

            const startBtn = document.getElementById('start-collect');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.log('🖱️ 开始采集按钮被点击');
                    this.startCollection();
                });
            } else {
                this.log('❌ 未找到开始采集按钮', 'error');
            }

            const exportBtn = document.getElementById('export-data');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.log('🖱️ 导出数据按钮被点击');
                    this.exportData();
                });
            } else {
                this.log('❌ 未找到导出数据按钮', 'error');
            }


            const clearBtn = document.getElementById('clear-data');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.log('🖱️ 清空数据按钮被点击');
                    this.clearData();
                });
            } else {
                this.log('❌ 未找到清空数据按钮', 'error');
            }
        }

        makeDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const header = element.querySelector('#douyin-collector-header');

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            // 触摸事件支持
            header.addEventListener('touchstart', dragStart);
            document.addEventListener('touchmove', drag);
            document.addEventListener('touchend', dragEnd);

            function dragStart(e) {
                if (e.type === "touchstart") {
                    initialX = e.touches[0].clientX - xOffset;
                    initialY = e.touches[0].clientY - yOffset;
                } else {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                }

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                    element.classList.add('dragging');
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    if (e.type === "touchmove") {
                        currentX = e.touches[0].clientX - initialX;
                        currentY = e.touches[0].clientY - initialY;
                    } else {
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                    }

                    xOffset = currentX;
                    yOffset = currentY;

                    // 限制在视口内
                    const rect = element.getBoundingClientRect();
                    const maxX = window.innerWidth - rect.width;
                    const maxY = window.innerHeight - rect.height;

                    xOffset = Math.max(0, Math.min(xOffset, maxX));
                    yOffset = Math.max(0, Math.min(yOffset, maxY));

                    setTranslate(xOffset, yOffset, element);
                }
            }

            function dragEnd(e) {
                if (isDragging) {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                    element.classList.remove('dragging');

                    // 保存位置
                    const rect = element.getBoundingClientRect();
                    element.style.top = rect.top + 'px';
                    element.style.left = rect.left + 'px';
                    element.style.right = 'auto';
                    element.style.bottom = 'auto';
                    element.style.transform = 'none';
                    
                    // 重置偏移
                    xOffset = 0;
                    yOffset = 0;
                }
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
        }

        updateStatus(message, type = 'info') {
            const statusEl = document.getElementById('collector-status');
            if (statusEl) {
                statusEl.textContent = message;
                statusEl.className = `collector-status status-${type}`;
            }
        }

        updateStats() {
            // 更新UI统计显示
            const collectedEl = document.getElementById('stat-collected');
            const repliesEl = document.getElementById('stat-replies');
            
            if (collectedEl) {
                collectedEl.textContent = this.comments.length;
            }
            
            if (repliesEl) {
                const totalReplies = this.comments.reduce((sum, comment) => {
                    return sum + (comment.replies ? comment.replies.length : 0);
                }, 0);
                repliesEl.textContent = totalReplies;
            }
            
            this.log(`📊 UI统计已更新: ${this.comments.length}条评论`);
        }

        downloadComments() {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const videoTitle = this.getVideoTitle();
            const filename = `${videoTitle}_评论_${timestamp}.txt`;
            
            let content = `抖音评论采集结果\n`;
            content += `视频标题: ${videoTitle}\n`;
            content += `视频链接: ${window.location.href}\n`;
            content += `采集时间: ${new Date().toLocaleString()}\n`;
            content += `评论总数: ${this.comments.length}\n`;
            content += `脚本版本: ${CONFIG.version} (最新修复版)\n`;
            content += `==========================================\n\n`;
            
            this.comments.forEach((comment, index) => {
                content += `${index + 1}. 【${comment.user}】\n`;
                content += `   内容: ${comment.text}\n`;
                content += `   点赞: ${comment.likes} | 时间: ${comment.time}\n`;
                
                if (comment.replies && comment.replies.length > 0) {
                    content += `   回复 (${comment.replies.length}条):\n`;
                    comment.replies.forEach((reply, replyIndex) => {
                        content += `     ${replyIndex + 1}) ${reply.user}: ${reply.text}\n`;
                    });
                }
                
                content += `\n`;
            });
            
            // 检查GM_download是否可用
            if (typeof GM_download !== 'undefined') {
                this.log('🔍 GM_download函数可用，开始下载...');
                
                // 使用原版的方法：创建blob URL (与原版保持一致)
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                
                this.log(`📄 文件大小: ${Math.round(content.length / 1024 * 100) / 100} KB`);
                this.log(`📁 文件名: ${filename}`);
                
                try {
                    // 原版的调用方式
                    GM_download(url, filename, 'data:text/plain;charset=utf-8,');
                    this.log(`📁 GM_download调用成功: ${filename}`);
                    
                    // 清理blob URL
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } catch (downloadError) {
                    this.log(`❌ GM_download调用失败: ${downloadError.message}`, 'error');
                    URL.revokeObjectURL(url); // 确保清理
                    throw downloadError;
                }
            } else {
                this.log('❌ GM_download函数不可用，将使用备用方案', 'warn');
                // 如果GM_download不可用，抛出错误让exportData使用备用方案
                throw new Error('GM_download function not available');
            }
            
            GM_notification({
                title: '抖音评论采集完成',
                text: `成功采集 ${this.comments.length} 条评论`,
                timeout: 3000
            });
        }

        exportData() {
            if (this.comments.length === 0) {
                this.log('⚠️ 没有数据可导出');
                this.updateStatus('没有数据可导出', 'warn');
                
                // 显示友好提示
                GM_notification({
                    title: '导出失败',
                    text: '没有数据可导出，请先采集评论',
                    timeout: 3000
                });
                return;
            }
            
            this.log(`📤 开始导出 ${this.comments.length} 条评论数据...`);
            this.updateStatus('正在导出数据...', 'working');
            
            try {
                this.downloadComments();
                this.log(`📤 导出了 ${this.comments.length} 条评论`);
                this.updateStatus(`已导出 ${this.comments.length} 条评论`, 'success');
            } catch (error) {
                this.log(`❌ 主要导出方式失败: ${error.message}`, 'error');
                this.log('🔄 尝试备用下载方案...', 'warn');
                this.updateStatus('尝试备用下载方案...', 'working');
                
                // 如果GM_download不可用，使用备用方案
                try {
                    this.fallbackDownload();
                    this.log('✅ 备用下载方案成功');
                    this.updateStatus('备用方案导出成功', 'success');
                } catch (fallbackError) {
                    this.log(`❌ 备用方案也失败: ${fallbackError.message}`, 'error');
                    this.updateStatus('所有导出方案都失败', 'error');
                    
                    GM_notification({
                        title: '导出失败',
                        text: '所有下载方案都失败了，请检查浏览器权限',
                        timeout: 5000
                    });
                }
            }
        }

        fallbackDownload() {
            this.log('🔄 使用备用下载方案...');
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const videoTitle = this.getVideoTitle();
            const filename = `${videoTitle}_评论_${timestamp}.txt`;
            
            let content = `抖音评论采集结果\n`;
            content += `视频标题: ${videoTitle}\n`;
            content += `视频链接: ${window.location.href}\n`;
            content += `采集时间: ${new Date().toLocaleString()}\n`;
            content += `评论总数: ${this.comments.length}\n`;
            content += `脚本版本: ${CONFIG.version} (最新修复版)\n`;
            content += `==========================================\n\n`;
            
            this.comments.forEach((comment, index) => {
                content += `${index + 1}. 【${comment.user}】\n`;
                content += `   内容: ${comment.text}\n`;
                content += `   点赞: ${comment.likes} | 时间: ${comment.time}\n`;
                
                if (comment.replies && comment.replies.length > 0) {
                    content += `   回复 (${comment.replies.length}条):\n`;
                    comment.replies.forEach((reply, replyIndex) => {
                        content += `     ${replyIndex + 1}) ${reply.user}: ${reply.text}\n`;
                    });
                }
                
                content += `\n`;
            });
            
            // 使用浏览器原生下载方案
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.log(`📁 备用方案下载完成: ${filename}`);
            
            GM_notification({
                title: '评论导出完成',
                text: `成功导出 ${this.comments.length} 条评论`,
                timeout: 3000
            });
        }


        clearData() {
            if (this.comments.length === 0) {
                this.log('⚠️ 没有数据需要清空');
                return;
            }
            
            const confirmed = confirm(`确定要清空已采集的 ${this.comments.length} 条评论数据吗？`);
            if (confirmed) {
                this.comments = [];
                this.updateStats();
                this.updateStatus('数据已清空', 'success');
                this.log('🗑️ 评论数据已清空');
            }
        }

        // ==================== 增强评论检测 (恢复原版功能) ====================
        
        async enhancedCommentDetection() {
            this.log('🔍 开始增强评论区检测...');

            // 等待一段时间让评论区加载
            await this.sleep(1000);

            // 尝试多种方式查找评论
            const commentFindingStrategies = [
                () => this.findCommentsByDataE2E(),
                () => this.findCommentsByClass(), 
                () => this.findCommentsByContent(),
                () => this.findCommentsByStructure()
            ];

            let foundComments = [];
            for (let i = 0; i < commentFindingStrategies.length; i++) {
                this.log(`尝试策略 ${i + 1}: 查找评论...`);
                foundComments = commentFindingStrategies[i]();
                if (foundComments.length > 0) {
                    this.log(`✅ 策略 ${i + 1} 成功找到 ${foundComments.length} 个评论元素`);
                    break;
                }
            }

            this.isCommentSectionOpen = foundComments.length > 0;
            
            this.log(`评论区检测结果: ${this.isCommentSectionOpen ? '已打开' : '未打开'} (发现${foundComments.length}个评论元素)`);

            // 调试模式：高亮显示找到的评论
            if (CONFIG.debug && foundComments.length > 0) {
                foundComments.forEach((element, index) => {
                    if (index < 5) { // 只高亮前5个
                        element.classList.add('found-comment');
                        setTimeout(() => {
                            element.classList.remove('found-comment');
                        }, 5000);
                    }
                });
            }

            return foundComments;
        }

        findCommentsByDataE2E() {
            const selectors = [
                // 精确匹配主评论容器（基于真实HTML结构）
                'div.xzjbH9pV[data-e2e="comment-item"]',
                '[data-e2e="comment-item"]',
                '[data-e2e*="comment"]',
                '[data-testid*="comment"]'
            ];

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    // 添加调试信息：检查找到的元素类型
                    this.log(`data-e2e策略找到评论: ${selector} (${elements.length}个)`);
                    
                    // 调试：检查每个找到的元素
                    if (CONFIG.debug) {
                        elements.forEach((el, index) => {
                            const className = el.className;
                            const hasTextContainer = el.querySelector('.LvAtyU_f');
                            const textLength = el.textContent.trim().length;
                            this.log(`🔍 元素${index + 1}: class="${className}", 有文本容器=${!!hasTextContainer}, 文本长度=${textLength}`);
                        });
                    }
                    
                    return Array.from(elements);
                }
            }
            return [];
        }

        findCommentsByClass() {
            const patterns = [
                '[class*="comment-item"]',
                '[class*="comment"][class*="item"]',
                'div[class*="comment"]:not([class*="reply"])',
                'li[class*="comment"]'
            ];

            for (const pattern of patterns) {
                const elements = document.querySelectorAll(pattern);
                if (elements.length > 0) {
                    // 过滤掉明显不是评论的元素
                    const filtered = Array.from(elements).filter(el => {
                        const text = el.textContent.trim();
                        return text.length > 10 && text.length < 1000;
                    });
                    
                    if (filtered.length > 0) {
                        this.log(`class策略找到评论: ${pattern} (${filtered.length}个)`);
                        return filtered;
                    }
                }
            }
            return [];
        }

        findCommentsByContent() {
            this.log('尝试基于内容结构查找评论...');
            
            // 查找包含用户头像、用户名、文本内容和交互按钮的元素
            const possibleComments = [];
            const allDivs = document.querySelectorAll('div');

            for (const div of allDivs) {
                // 检查是否包含评论的基本结构
                const hasUserInfo = div.querySelector('img[alt*="头像"], img[src*="avatar"], a[href*="/user/"]');
                const hasText = div.textContent.trim().length > 20 && div.textContent.trim().length < 1000;
                const hasInteraction = div.querySelector('button, [role="button"], svg');

                if (hasUserInfo && hasText && hasInteraction) {
                    // 进一步验证不是其他类型的内容
                    const text = div.textContent.trim();
                    if (!text.includes('直播') && !text.includes('关注') && !text.includes('粉丝')) {
                        possibleComments.push(div);
                        if (possibleComments.length >= 20) break; // 限制数量避免过多
                    }
                }
            }

            if (possibleComments.length > 0) {
                this.log(`内容结构策略找到评论候选: ${possibleComments.length}个`);
                return possibleComments;
            }
            return [];
        }

        findCommentsByStructure() {
            this.log('尝试基于DOM结构查找评论...');
            
            // 查找列表结构中的项目
            const listContainers = document.querySelectorAll('ul, ol, [role="list"], div[class*="list"]');
            
            for (const container of listContainers) {
                const items = container.children;
                if (items.length >= 3) { // 至少3个子项才考虑是评论列表
                    const validItems = [];
                    
                    for (const item of items) {
                        const text = item.textContent.trim();
                        if (text.length > 20 && text.length < 1000) {
                            const hasUserElement = item.querySelector('img, a[href*="/user/"]');
                            if (hasUserElement) {
                                validItems.push(item);
                            }
                        }
                    }
                    
                    if (validItems.length >= 3) {
                        this.log(`结构策略在容器中找到评论: ${validItems.length}个`);
                        return validItems;
                    }
                }
            }
            return [];
        }

        // ==================== 重新检测评论功能 ====================
        
        async redetectComments() {
            this.log('🔍 重新检测评论区...');
            this.updateStatus('重新检测中...', 'working');
            
            const foundComments = await this.enhancedCommentDetection();
            
            if (foundComments.length > 0) {
                this.updateStatus(`发现 ${foundComments.length} 个评论元素`, 'success');
                this.showNotification(`✅ 重新检测成功，发现 ${foundComments.length} 个评论`, 'success');
            } else {
                this.updateStatus('未发现评论元素', 'error');
                this.showNotification('❌ 未检测到评论，请确保评论区已打开', 'error');
            }
            
            return foundComments.length > 0;
        }
    }

    // 启动采集器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new DouyinCommentCollector();
        });
    } else {
        new DouyinCommentCollector();
    }

})();
