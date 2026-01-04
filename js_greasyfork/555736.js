// ==UserScript==
// @name         HDSky 体育沙龙面板
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  在 HDSky 论坛页面右上角显示控制面板，自动高亮特殊关注用户的回复内容，支持快速翻页和收藏功能，可折叠面板，下拉加载翻页
// @author       江畔 (LOVE)
// @match        https://hdsky.me/*
// @match        https://www.hdsky.me/*
// @icon         https://hdsky.me/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @charset      UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555736/HDSky%20%E4%BD%93%E8%82%B2%E6%B2%99%E9%BE%99%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/555736/HDSky%20%E4%BD%93%E8%82%B2%E6%B2%99%E9%BE%99%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置管理
    const Config = {
        // 获取配置
        get(key, defaultValue) {
            return GM_getValue(key, defaultValue);
        },
        // 设置配置
        set(key, value) {
            GM_setValue(key, value);
        },
        // 获取下拉加载开关状态
        getAutoLoadEnabled() {
            return this.get('autoLoadEnabled', false);
        },
        // 设置下拉加载开关状态
        setAutoLoadEnabled(enabled) {
            this.set('autoLoadEnabled', enabled);
        },
        // 获取面板展开状态
        getPanelExpanded() {
            return this.get('panelExpanded', true); // 默认展开
        },
        // 设置面板展开状态
        setPanelExpanded(expanded) {
            this.set('panelExpanded', expanded);
        },
        // 获取检查有效下注开关状态
        getCheckValidBetEnabled() {
            return this.get('checkValidBetEnabled', false);
        },
        // 设置检查有效下注开关状态
        setCheckValidBetEnabled(enabled) {
            this.set('checkValidBetEnabled', enabled);
        },
        // 获取高亮特殊关注开关状态
        getHighlightFollowEnabled() {
            return this.get('highlightFollowEnabled', true); // 默认开启
        },
        // 设置高亮特殊关注开关状态
        setHighlightFollowEnabled(enabled) {
            this.set('highlightFollowEnabled', enabled);
        }
    };

    // ==================== 工具函数 ====================
    
    /**
     * 检测是否为移动设备
     * @returns {boolean} 是否为移动设备
     */
    function isMobileDevice() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 检查当前页面是否为帖子查看页面
     * @returns {boolean} 是否为帖子查看页面
     */
    function isViewTopicPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('action') === 'viewtopic';
    }

    /**
     * 统一错误处理函数
     * @param {string} context - 错误上下文描述
     * @param {Error} error - 错误对象
     */
    function handleError(context, error) {
        console.error(`${context}时发生错误:`, error);
    }

    /**
     * 延迟执行函数
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {number} setTimeout返回的ID
     */
    function delayExecute(fn, delay = 0) {
        return setTimeout(fn, delay);
    }

    /**
     * DOM元素缓存
     */
    const PanelElements = {
        get panel() {
            return document.getElementById('hdsky-special-follow-panel');
        },
        get toggleBtn() {
            return document.getElementById('panel-toggle-btn');
        }
    };

    /**
     * 创建通用面板按钮
     * @param {Object} config - 按钮配置
     * @param {string} config.id - 按钮ID
     * @param {string} config.text - 按钮文本
     * @param {string} [config.backgroundColor='#2196F3'] - 背景颜色
     * @param {string} [config.hoverColor='#0b7dda'] - 悬停颜色
     * @param {Function} config.onClick - 点击事件处理函数
     * @param {string} [config.fontSize='14px'] - 字体大小
     * @param {string} [config.padding='10px 15px'] - 内边距
     * @param {string} [config.width='100%'] - 宽度
     * @returns {HTMLButtonElement} 创建的按钮元素
     */
    function createPanelButton(config) {
        const {
            id,
            text,
            backgroundColor = '#2196F3',
            hoverColor = '#0b7dda',
            onClick,
            fontSize = '14px',
            padding = '10px 15px',
            width = '100%'
        } = config;
        
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.cssText = `
            padding: ${padding};
            background: ${backgroundColor};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: ${fontSize};
            font-weight: bold;
            transition: background 0.3s;
            width: ${width};
        `;
        button.onmouseover = () => button.style.background = hoverColor;
        button.onmouseout = () => button.style.background = backgroundColor;
        button.onclick = onClick;
        
        return button;
    }

    /**
     * 更新切换按钮状态
     * @param {HTMLButtonElement} button - 按钮元素
     * @param {boolean} isEnabled - 是否启用
     * @param {string} enabledText - 启用时的文本
     * @param {string} disabledText - 禁用时的文本
     * @param {string} enabledTitle - 启用时的标题
     * @param {string} disabledTitle - 禁用时的标题
     */
    function updateToggleButton(button, isEnabled, enabledText, disabledText, enabledTitle, disabledTitle) {
        button.style.background = '#2196F3';
        button.onmouseover = () => button.style.background = '#0b7dda';
        button.onmouseout = () => button.style.background = '#2196F3';
        
        if (isEnabled) {
            button.textContent = `✅ ${enabledText}`;
            button.title = enabledTitle;
        } else {
            button.textContent = `❌ ${disabledText}`;
            button.title = disabledTitle;
        }
    }

    // ==================== 业务函数 ====================

    // 获取帖子id
    function getThreadId(str) {
        let id = 5381;
        for (let i = 0; i < str.length; i++) {
            id = ((id << 5) + id) + str.charCodeAt(i);
            id = id & id;
        }
        return id >>> 0;
    }

    // 部分官方回帖id
    // const threadIdList = [223214241];
    const threadIdList = [];

    // 从存储中获取特殊关注名单
    function getSpecialFollowList() {
        const listStr = Config.get('specialFollowList', '');
        if (!listStr) return [];
        const followList = listStr.split(',').map(name => name.trim()).filter(name => name);
        return followList.filter(name => {
            const threadId = getThreadId(name);
            return !threadIdList.includes(threadId);
        });
    }

    // 保存特殊关注名单到存储
    function saveSpecialFollowList(list) {
        Config.set('specialFollowList', list.join(','));
    }

    // 从存储中获取收藏列表
    function getBookmarkList() {
        const listStr = Config.get('bookmarkList', '[]');
        try {
            return JSON.parse(listStr);
        } catch (e) {
            return [];
        }
    }

    // 保存收藏列表到存储
    function saveBookmarkList(list) {
        Config.set('bookmarkList', JSON.stringify(list));
    }

    // 创建控制面板
    function createControlPanel() {
        // 创建容器，包含面板和折叠按钮
        const container = document.createElement('div');
        container.id = 'hdsky-panel-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            display: flex;
            align-items: flex-start;
            z-index: 10000;
        `;
        
        // 检测移动端并扩大按钮尺寸
        const isMobile = isMobileDevice();
        if (isMobile) {
            container.style.top = '160px'; // 80px * 2
            container.style.right = '20px'; // 10px * 2
        }

        // 创建折叠按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'panel-toggle-btn';
        toggleBtn.innerHTML = '◀';
        toggleBtn.title = '收起面板';
        toggleBtn.style.cssText = `
            background: #e0e0e0;
            color: #666;
            border: none;
            border-radius: 4px 0 0 4px;
            width: 24px;
            height: 40px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
            margin-right: -2px;
            z-index: 1;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = '#d0d0d0';
        toggleBtn.onmouseout = () => toggleBtn.style.background = '#e0e0e0';
        
        // 支持移动端触摸事件
        let touchStartTime = 0;
        toggleBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartTime = Date.now();
        }, { passive: false });
        
        toggleBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            // 只有快速点击（小于300ms）才触发，避免与滚动冲突
            if (touchDuration < 300) {
                togglePanel();
            }
        }, { passive: false });
        
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePanel();
        });
        
        // 移动端扩大折叠按钮尺寸
        if (isMobile) {
            toggleBtn.style.width = '72px'; // 24px * 3
            toggleBtn.style.height = '120px'; // 40px * 3
            toggleBtn.style.fontSize = '42px'; // 14px * 3
            toggleBtn.style.borderRadius = '12px 0 0 12px'; // 4px * 3
        }
        
        const panel = document.createElement('div');
        panel.id = 'hdsky-special-follow-panel';
        panel.style.cssText = `
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            width: 220px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        `;
        
        // 移动端放大整个面板
        if (isMobile) {
            panel.style.width = '440px'; // 220px * 2
            panel.style.padding = '30px'; // 15px * 2
            panel.style.borderRadius = '16px'; // 8px * 2
            panel.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'; // 阴影也放大
        }

        // 面板标题
        const title = document.createElement('div');
        title.textContent = '体育沙龙面板';
        title.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #333;
            text-align: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        `;
        if (isMobile) {
            title.style.fontSize = '32px'; // 16px * 2
            title.style.marginBottom = '24px'; // 12px * 2
            title.style.paddingBottom = '16px'; // 8px * 2
            title.style.borderBottomWidth = '2px'; // 1px * 2
        }
        panel.appendChild(title);

        // 按钮容器（统一管理所有按钮）
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        if (isMobile) {
            buttonContainer.style.gap = '20px'; // 10px * 2
        }

        // 关注列表按钮
        const followListBtn = createPanelButton({
            id: 'follow-list-btn',
            text: '关注列表',
            onClick: handleFollowListClick
        });
        followListBtn.title = '点击编辑特殊关注名单';
        buttonContainer.appendChild(followListBtn);

        // 下拉加载翻页按钮
        const autoLoadBtn = createPanelButton({
            id: 'auto-load-btn',
            text: '下拉加载翻页',
            onClick: toggleAutoLoadFromPanel
        });
        updateAutoLoadButton(autoLoadBtn); // 在设置基础样式后再更新按钮状态
        buttonContainer.appendChild(autoLoadBtn);

        // 检查有效下注按钮
        const checkValidBetBtn = createPanelButton({
            id: 'check-valid-bet-btn',
            text: '检查有效下注',
            onClick: toggleCheckValidBet
        });
        updateCheckValidBetButton(checkValidBetBtn);
        buttonContainer.appendChild(checkValidBetBtn);

        // 高亮特殊关注按钮
        const highlightFollowBtn = createPanelButton({
            id: 'highlight-follow-btn',
            text: '高亮特殊关注',
            onClick: toggleHighlightFollow
        });
        updateHighlightFollowButton(highlightFollowBtn);
        buttonContainer.appendChild(highlightFollowBtn);

        // 收藏功能按钮容器
        const bookmarkContainer = document.createElement('div');
        bookmarkContainer.id = 'bookmark-container';
        bookmarkContainer.style.cssText = `
            display: flex;
            flex-direction: row;
            gap: 10px;
        `;
        if (isMobile) {
            bookmarkContainer.style.gap = '20px'; // 10px * 2
        }

        // 收藏按钮
        const bookmarkBtn = createPanelButton({
            id: 'bookmark-btn',
            text: '收藏',
            padding: '8px 12px',
            fontSize: '13px',
            width: 'auto',
            onClick: addBookmark
        });
        bookmarkBtn.style.flex = '1';
        bookmarkContainer.appendChild(bookmarkBtn);

        // 收藏夹按钮
        const bookmarkListBtn = createPanelButton({
            id: 'bookmark-list-btn',
            text: '收藏夹',
            padding: '8px 12px',
            fontSize: '13px',
            width: 'auto',
            onClick: showBookmarkList
        });
        bookmarkListBtn.style.flex = '1';
        bookmarkContainer.appendChild(bookmarkListBtn);

        buttonContainer.appendChild(bookmarkContainer);

        // 数据分析按钮
        const dataAnalysisBtn = createPanelButton({
            id: 'data-analysis-btn',
            text: '数据分析',
            backgroundColor: '#4caf50',
            hoverColor: '#388e3c',
            onClick: openDataAnalysisDialog
        });
        buttonContainer.appendChild(dataAnalysisBtn);

        // 快捷回复按钮
        const quickReplyBtn = createPanelButton({
            id: 'quick-reply-btn',
            text: '快捷回复',
            backgroundColor: '#ff9800',
            hoverColor: '#f57c00',
            onClick: openQuickReply
        });
        buttonContainer.appendChild(quickReplyBtn);

        // 全部标记为已读按钮
        const markAllReadBtn = createPanelButton({
            id: 'mark-all-read-btn',
            text: '全部消息标记为已读',
            backgroundColor: '#9c27b0',
            hoverColor: '#7b1fa2',
            onClick: markAllMessagesAsRead
        });
        buttonContainer.appendChild(markAllReadBtn);

        panel.appendChild(buttonContainer);
        
        // 移动端放大所有按钮
        if (isMobile) {
            const allButtons = buttonContainer.querySelectorAll('button');
            allButtons.forEach(btn => {
                const currentPadding = btn.style.padding || '10px 15px';
                const currentFontSize = btn.style.fontSize || '14px';
                const currentBorderRadius = btn.style.borderRadius || '5px';
                
                // 解析padding值并放大
                const paddingMatch = currentPadding.match(/(\d+)px\s+(\d+)px/);
                if (paddingMatch) {
                    btn.style.padding = `${parseInt(paddingMatch[1]) * 2}px ${parseInt(paddingMatch[2]) * 2}px`;
                }
                
                // 解析fontSize并放大
                const fontSizeMatch = currentFontSize.match(/(\d+)px/);
                if (fontSizeMatch) {
                    btn.style.fontSize = `${parseInt(fontSizeMatch[1]) * 2}px`;
                }
                
                // 解析borderRadius并放大
                const borderRadiusMatch = currentBorderRadius.match(/(\d+)px/);
                if (borderRadiusMatch) {
                    btn.style.borderRadius = `${parseInt(borderRadiusMatch[1]) * 2}px`;
                }
            });
        }

        // 将按钮和面板添加到容器
        container.appendChild(toggleBtn);
        container.appendChild(panel);

        // 添加到页面
        document.body.appendChild(container);
        
        // 应用保存的面板状态
        const isPanelExpanded = Config.getPanelExpanded();
        if (!isPanelExpanded) {
            // 如果保存的是收起状态，则收起面板
            panel.style.display = 'none';
            toggleBtn.innerHTML = '▶';
            toggleBtn.title = '展开面板';
            toggleBtn.style.borderRadius = '4px';
        }
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = PanelElements.panel;
        const toggleBtn = PanelElements.toggleBtn;
        
        if (!panel || !toggleBtn) return;
        
        if (panel.style.display === 'none') {
            // 展开面板
            panel.style.display = 'block';
            toggleBtn.innerHTML = '◀';
            toggleBtn.title = '收起面板';
            toggleBtn.style.borderRadius = '4px 0 0 4px';
            Config.setPanelExpanded(true); // 保存展开状态
        } else {
            // 收起面板
            panel.style.display = 'none';
            toggleBtn.innerHTML = '▶';
            toggleBtn.title = '展开面板';
            toggleBtn.style.borderRadius = '4px';
            Config.setPanelExpanded(false); // 保存收起状态
        }
    }

    // 更新下拉加载按钮的显示
    function updateAutoLoadButton(button) {
        const isEnabled = Config.getAutoLoadEnabled();
        updateToggleButton(
            button,
            isEnabled,
            '下拉加载翻页',
            '下拉加载翻页',
            '点击关闭下拉加载翻页功能',
            '点击开启下拉加载翻页功能'
        );
    }

    // 从面板切换下拉加载功能
    function toggleAutoLoadFromPanel() {
        const currentState = Config.getAutoLoadEnabled();
        const newState = !currentState;
        Config.setAutoLoadEnabled(newState);
        
        // 更新按钮显示
        const button = document.getElementById('auto-load-btn');
        if (button) {
            updateAutoLoadButton(button);
        }
        
        // 如果是开启，立即初始化功能
        if (newState) {
            autoLoadNextPage();
        } else {
            // 如果是关闭，需要刷新页面以移除事件监听器
            if (confirm('需要刷新页面以完全关闭下拉加载功能，是否立即刷新？')) {
                location.reload();
            }
        }
    }

    // 更新检查有效下注按钮的显示
    function updateCheckValidBetButton(button) {
        const isEnabled = Config.getCheckValidBetEnabled();
        const titleText = '如果超过截止时间或重复下注将禁用回复功能';
        updateToggleButton(
            button,
            isEnabled,
            '检查有效下注',
            '检查有效下注',
            `点击关闭检查有效下注功能\n${titleText}`,
            `点击开启检查有效下注功能\n${titleText}`
        );
    }

    // 从面板切换检查有效下注功能
    function toggleCheckValidBet() {
        const currentState = Config.getCheckValidBetEnabled();
        const newState = !currentState;
        Config.setCheckValidBetEnabled(newState);
        
        // 更新按钮显示
        const button = document.getElementById('check-valid-bet-btn');
        if (button) {
            updateCheckValidBetButton(button);
        }
        
        // 如果关闭功能，恢复回复表单
        if (!newState) {
            enableReplyForm();
        } else {
            // 如果开启功能，重新检查并应用
            checkValidBetAndDisableReply();
        }
    }

    // 更新高亮特殊关注按钮的显示
    function updateHighlightFollowButton(button) {
        const isEnabled = Config.getHighlightFollowEnabled();
        updateToggleButton(
            button,
            isEnabled,
            '高亮特殊关注',
            '高亮特殊关注',
            '点击关闭高亮特殊关注功能',
            '点击开启高亮特殊关注功能'
        );
    }

    // 从面板切换高亮特殊关注功能
    function toggleHighlightFollow() {
        const currentState = Config.getHighlightFollowEnabled();
        const newState = !currentState;
        Config.setHighlightFollowEnabled(newState);
        
        // 更新按钮显示
        const button = document.getElementById('highlight-follow-btn');
        if (button) {
            updateHighlightFollowButton(button);
        }
        
        // 如果关闭功能，清除所有高亮
        if (!newState) {
            clearHighlights();
        } else {
            // 如果开启功能，重新应用高亮
            autoHighlightFollowedPosts();
        }
    }

    // 获取当前用户名
    function getCurrentUsername() {
        const infoBlock = document.getElementById('info_block');
        if (!infoBlock) return null;
        
        // 查找包含用户名的链接（userdetails.php?id=xxx）
        const userLink = infoBlock.querySelector('a[href*="userdetails.php?id"]');
        if (!userLink) return null;
        
        // 提取用户名文本（去除HTML标签）
        const username = userLink.textContent.trim();
        return username || null;
    }

    
    // 获取当前主题所有页面的URL
    function getTopicPageUrls() {
        const urls = new Set();
        
        // 从当前URL中提取topicid和基础URL
        const currentUrlObj = new URL(window.location.href);
        const topicid = currentUrlObj.searchParams.get('topicid');
        if (!topicid) {
            return [];
        }
        
        // 构建基础URL（不包含page参数，保留forumid以匹配当前页面）
        const forumid = currentUrlObj.searchParams.get('forumid');
        const baseParams = new URLSearchParams();
        baseParams.set('action', 'viewtopic');
        if (forumid) {
            baseParams.set('forumid', forumid);
        }
        baseParams.set('topicid', topicid);
        const baseUrl = `${currentUrlObj.origin}${currentUrlObj.pathname}?${baseParams.toString()}`;
        
        // 添加第一页（page=0或没有page参数）
        urls.add(baseUrl);
        
        // 从分页链接中提取所有页码
        const pageNumbers = new Set();
        const currentPageParam = currentUrlObj.searchParams.get('page');
        const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 0;
        pageNumbers.add(0); // 第一页
        pageNumbers.add(isNaN(currentPage) ? 0 : currentPage); // 当前页
        
        // 查找所有包含page参数的分页链接
        const pageLinks = document.querySelectorAll('a[href*="viewtopic"][href*="topicid="]');
        pageLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            let pageNum = null;
            
            // 先尝试用正则表达式提取（适用于相对路径和绝对路径）
            const match = href.match(/[?&]page=(\d+)/);
            if (match && match[1]) {
                pageNum = parseInt(match[1], 10);
            } else {
                // 如果正则没匹配到，尝试用URL对象解析
                try {
                    const linkUrl = new URL(href, window.location.href);
                    const pageParam = linkUrl.searchParams.get('page');
                    if (pageParam !== null) {
                        pageNum = parseInt(pageParam, 10);
                    }
                } catch (e) {
                    // 解析失败，跳过
                }
            }
            
            if (pageNum !== null && !isNaN(pageNum)) {
                pageNumbers.add(pageNum);
            }
        });
        
        // 构建所有页面的URL
        pageNumbers.forEach(pageNum => {
            if (pageNum === 0) {
                // 第一页：不添加page参数
                urls.add(baseUrl);
            } else {
                // 其他页：添加page参数
                urls.add(`${baseUrl}&page=${pageNum}`);
            }
        });
        
        return Array.from(urls);
    }
    
    // 标准化URL用于比较（只保留topicid与page，忽略参数顺序）
    function normalizeUrlForCompare(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            const topicid = urlObj.searchParams.get('topicid') || '';
            const page = urlObj.searchParams.get('page') || '0';
            const path = urlObj.pathname || '/forums.php';
            return `${urlObj.origin}${path}?topicid=${topicid}&page=${page}`;
        } catch (e) {
            return url.split('#')[0];
        }
    }
    
    /**
     * 根据 URL 获取主题的所有分页文档
     * @param {string} topicUrl - 主题URL（可以是任意页的URL，或从帖子列表获取的URL）
     * @returns {Promise<Array>} 返回包含所有分页文档的数组，每个元素包含 {url, doc, isCurrentPage, pageNum}
     */
    async function fetchTopicDocumentsByUrl(topicUrl) {
        if (!topicUrl) return [];
        
        const parser = new DOMParser();
        const documents = [];
        
        try {
            // 提取 topicid
            const urlObj = new URL(topicUrl, window.location.origin);
            const topicid = urlObj.searchParams.get('topicid');
            if (!topicid) {
                return [];
            }
            
            // 构建基础URL
            const forumid = urlObj.searchParams.get('forumid');
            const baseParams = new URLSearchParams();
            baseParams.set('action', 'viewtopic');
            if (forumid) {
                baseParams.set('forumid', forumid);
            }
            baseParams.set('topicid', topicid);
            const baseUrl = `${urlObj.origin}${urlObj.pathname}?${baseParams.toString()}`;
            
            // 获取第一页以获取所有分页链接
            const firstPageUrl = baseUrl;
            const response = await fetch(firstPageUrl, {
                credentials: 'include',
                headers: { 'Accept': 'text/html' }
            });
            
            if (!response.ok) {
                return [];
            }
            
            const html = await response.text();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 收集所有页码
            const pageNumbers = new Set();
            pageNumbers.add(0); // 第一页
            
            const pageLinks = doc.querySelectorAll('a[href*="viewtopic"][href*="topicid="]');
            pageLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                const match = href.match(/[?&]page=(\d+)/);
                if (match && match[1]) {
                    const pageNum = parseInt(match[1], 10);
                    if (!isNaN(pageNum)) {
                        pageNumbers.add(pageNum);
                    }
                }
            });
            
            // 检查当前页面是否匹配
            const currentNormalized = normalizeUrlForCompare(window.location.href);
            
            // 获取所有分页的文档
            for (const pageNum of Array.from(pageNumbers).sort((a, b) => a - b)) {
                const pageUrl = pageNum === 0 ? baseUrl : `${baseUrl}&page=${pageNum}`;
                const normalizedUrl = normalizeUrlForCompare(pageUrl);
                const isCurrentPage = normalizedUrl === currentNormalized;
                
                if (isCurrentPage && pageNum === 0) {
                    // 如果是当前页面且是第一页，使用已加载的文档
                    documents.push({ url: pageUrl, doc: document, isCurrentPage: true, pageNum: 0 });
                } else if (pageNum === 0) {
                    // 第一页已经获取过
                    documents.push({ url: pageUrl, doc, isCurrentPage, pageNum: 0 });
                } else {
                    // 获取其他分页
                    try {
                        const pageResponse = await fetch(pageUrl, {
                            credentials: 'include',
                            headers: { 'Accept': 'text/html' }
                        });
                        
                        if (pageResponse.ok) {
                            const pageHtml = await pageResponse.text();
                            const pageDoc = parser.parseFromString(pageHtml, 'text/html');
                            documents.push({ url: pageUrl, doc: pageDoc, isCurrentPage, pageNum });
                        }
                    } catch (error) {
                        handleError(`请求分页发生错误: ${pageUrl}`, error);
                    }
                }
            }
        } catch (error) {
            handleError('获取主题文档', error);
        }
        
        return documents;
    }
    
    /**
     * 解析帖子数据，提取标准化字段
     * @param {Document} doc - 文档对象
     * @param {number} pageNum - 页码
     * @returns {Array} 返回帖子数据数组，每个元素包含 {username, floor, bets, betAmount, anchorId, ratingSum, postElement}
     */
    function parsePostsFromDocument(doc, pageNum) {
        const posts = [];
        const postTables = doc.querySelectorAll('table[id^="pid"]');
        let floorNum = pageNum * 10 + 1; // 假设每页10个帖子
        let skipFirstPost = (pageNum === 0); // 只在第一页跳过第一楼
        
        postTables.forEach(table => {
            if (!table.id || table.id.endsWith('body')) {
                return;
            }
            
            // 跳过第一楼
            if (skipFirstPost) {
                skipFirstPost = false;
                floorNum++;
                return;
            }
            
            // 提取用户名
            const userLink = table.querySelector('a[href*="userdetails.php?id="]');
            if (!userLink) {
                return;
            }
            const username = (userLink.textContent || '').trim();
            
            // 提取帖子内容
            const body = doc.getElementById(`${table.id}body`);
            if (!body) {
                return;
            }
            
            const textContent = body.innerText || '';
            const lines = textContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
            
            // 提取下注信息
            const betMap = {};
            let betAmount = '';
            
            lines.forEach(line => {
                const match = line.match(/^(\d+)\.(?:下注球队|下注球隊)[:：]\s*(.+)$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    if (!isNaN(index)) {
                        const sanitized = sanitizeBetValue(match[2]);
                        if (sanitized) {
                            betMap[index] = sanitized;
                        }
                    }
                    return;
                }
                if (!betAmount) {
                    const betMatch = line.match(/下注点数[：:]\s*([\d,]+)/);
                    if (betMatch && betMatch[1]) {
                        betAmount = betMatch[1].replace(/,/g, '');
                    }
                }
            });
            
            // 计算评分总和
            const ratingSum = calculateRatingSum(body);
            
            // 提取锚点ID
            const anchorId = table.id || '';
            
            // 查找对应的 div 元素（用于高亮等操作）
            const postDiv = table.closest('div[style*="margin-top: 8pt"]') || 
                           table.previousElementSibling;
            
            posts.push({
                username,
                floor: floorNum,
                bets: betMap,
                betAmount,
                anchorId,
                ratingSum,
                postElement: postDiv,
                bodyElement: body,
                hasBet: Object.keys(betMap).length > 0
            });
            
            floorNum++;
        });
        
        return posts;
    }
    
    /**
     * 获取主题的所有回复数据（解析后的标准化数据）
     * @param {string} topicUrl - 主题URL
     * @returns {Promise<Array>} 返回所有帖子的解析数据
     */
    async function fetchTopicPostsData(topicUrl) {
        const documents = await fetchTopicDocumentsByUrl(topicUrl);
        const allPosts = [];
        
        for (const entry of documents) {
            if (!entry.doc) continue;
            const posts = parsePostsFromDocument(entry.doc, entry.pageNum);
            allPosts.push(...posts);
        }
        
        return allPosts;
    }
    
    
    // 检查当前用户是否已经在任意分页下注
    async function hasUserReplied() {
        const currentUsername = getCurrentUsername();
        if (!currentUsername) {
            return false;
        }
        
        // 使用缓存的数据或获取所有分页数据
        const currentUrl = window.location.href;
        const allPosts = await fetchTopicPostsData(currentUrl);
        
        // 检查是否有当前用户的回复
        for (let post of allPosts) {
            if (post.username === currentUsername) {
                return true;
            }
        }
        
        return false;
    }

    // 禁用快速回复表单并显示提示（公共函数）
    function disableReplyForm(message, noticeClass, backgroundColor) {
        // 查找快速回复表单
        const composeForm = document.getElementById('compose');
        if (!composeForm) return false;
        
        // 查找包含快速回复的 table
        const replyTable = composeForm.closest('table');
        if (!replyTable) return false;
        
        // 禁用所有表单元素
        const formElements = composeForm.querySelectorAll('textarea, input[type="submit"], button');
        formElements.forEach(element => {
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
        });
        
        // 先移除所有旧的检查提示（避免重复显示）
        const oldNotices = replyTable.querySelectorAll('.deadline-notice, .duplicate-bet-notice, .checking-notice');
        oldNotices.forEach(notice => notice.remove());
        
        // 添加新的提示
        const notice = document.createElement('div');
        notice.className = noticeClass;
        notice.style.cssText = `
            background: ${backgroundColor};
            color: white;
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        `;
        notice.textContent = message;
        
        // 在"快速回复"标题后插入提示
        const quickReplyTitle = Array.from(replyTable.querySelectorAll('b')).find(b => b.textContent === '快速回复');
        if (quickReplyTitle && quickReplyTitle.parentElement) {
            quickReplyTitle.parentElement.appendChild(notice);
        }
        
        return true;
    }


    // 检查回复框中的下注点数并禁用提交按钮
    function checkBetAmountInReplyBox() {
        // 只在开关开启时检查
        if (!Config.getCheckValidBetEnabled()) {
            return;
        }

        const composeForm = document.getElementById('compose');
        if (!composeForm) return;

        const textarea = composeForm.querySelector('textarea[name="body"]');
        if (!textarea) return;

        const submitButton = document.getElementById('qr') || composeForm.querySelector('input[type="submit"], button[type="submit"]');
        if (!submitButton) return;

        const replyTable = composeForm.closest('table');
        if (!replyTable) return;

        const content = textarea.value || '';
        const betAmountMatch = content.match(/下注点数[：:]\s*([\d,]+)/);
        
        if (betAmountMatch && betAmountMatch[1]) {
            const betAmount = parseInt(betAmountMatch[1].replace(/,/g, ''), 10);
            
            if (!isNaN(betAmount) && betAmount > 1000000) {
                // 禁用提交按钮
                submitButton.disabled = true;
                submitButton.style.opacity = '0.5';
                submitButton.style.cursor = 'not-allowed';
                
                // 显示提示
                if (!replyTable.querySelector('.bet-amount-notice')) {
                    const notice = document.createElement('div');
                    notice.className = 'bet-amount-notice';
                    notice.style.cssText = `
                        background: #ff5252;
                        color: white;
                        padding: 10px 15px;
                        margin: 10px 0;
                        border-radius: 5px;
                        text-align: center;
                        font-weight: bold;
                        font-size: 14px;
                    `;
                    notice.textContent = `⚠️ 下注点数（${betAmount.toLocaleString()}）超过1000000，禁止提交`;
                    
                    const quickReplyTitle = Array.from(replyTable.querySelectorAll('b')).find(b => b.textContent === '快速回复');
                    if (quickReplyTitle && quickReplyTitle.parentElement) {
                        quickReplyTitle.parentElement.appendChild(notice);
                    }
                }
            } else {
                // 恢复提交按钮
                submitButton.disabled = false;
                submitButton.style.opacity = '';
                submitButton.style.cursor = '';
                
                // 移除提示
                const notice = replyTable.querySelector('.bet-amount-notice');
                if (notice) notice.remove();
            }
        } else {
            // 恢复提交按钮
            submitButton.disabled = false;
            submitButton.style.opacity = '';
            submitButton.style.cursor = '';
            
            // 移除提示
            const notice = replyTable.querySelector('.bet-amount-notice');
            if (notice) notice.remove();
        }
    }

    // 启用回复表单
    function enableReplyForm() {
        const composeForm = document.getElementById('compose');
        if (!composeForm) return;
        
        const replyTable = composeForm.closest('table');
        if (!replyTable) return;
        
        // 启用所有表单元素
        const formElements = composeForm.querySelectorAll('textarea, input[type="submit"], button');
        formElements.forEach(element => {
            element.disabled = false;
            element.style.opacity = '';
            element.style.cursor = '';
        });
        
        // 移除所有检查提示
        const notices = replyTable.querySelectorAll('.deadline-notice, .duplicate-bet-notice, .checking-notice');
        notices.forEach(notice => notice.remove());
    }

    // 检查有效下注并禁用回复（合并截止时间和重复下注检查）
    async function checkValidBetAndDisableReply() {
        // 只在开关开启时检查
        if (!Config.getCheckValidBetEnabled()) {
            enableReplyForm(); // 如果开关关闭，确保表单可用
            return;
        }
        
        // 先禁用回复表单，显示检查中提示
        if (disableReplyForm('⏳ 正在检查下注状态，请稍候...', 'checking-notice', '#2196F3')) {
        }
        
        // 1. 检查截止时间
        const topSpan = document.getElementById('top');
        if (topSpan) {
            const titleText = topSpan.textContent;
            // 匹配格式：下注截止时间 2025-12-03 03:30:00 或 截止时间：2025-11-13 21:00(:00)
            const deadlineMatch = titleText.match(/(?:下注)?截止时间[：:\s]+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/);
            if (deadlineMatch) {
                let deadlineStr = deadlineMatch[1];
                // 如果时间格式没有秒（只有 HH:MM），添加秒
                const timePart = deadlineStr.split(' ')[1]; // 获取时间部分
                if (timePart && timePart.split(':').length === 2) {
                    deadlineStr = deadlineStr + ':00';
                }
                // 解析截止时间（北京时间）
                const deadlineDate = new Date(deadlineStr.replace(' ', 'T') + '+08:00');
                
                // 获取当前时间
                const now = new Date();
                
                // 如果截止时间已过
                if (now > deadlineDate) {
                    if (disableReplyForm('⚠️ 投注截止时间已过，快速回复已禁用', 'deadline-notice', '#ff5252')) {
                    }
                    return; // 截止时间已过，不再检查重复下注
                }
            }
        }
        
        // 2. 检查是否已下注（重复下注）
        if (await hasUserReplied()) {
            if (disableReplyForm('⚠️ 您已经下注，禁止重复下注', 'duplicate-bet-notice', '#ff9800')) {
            }
            return;
        }
        
        // 3. 检查通过，启用回复表单
        enableReplyForm();

        // 4. 设置下注点数检查监听器
        const composeForm = document.getElementById('compose');
        if (composeForm) {
            const textarea = composeForm.querySelector('textarea[name="body"]');
            if (textarea && !textarea.dataset.betAmountListenerAdded) {
                textarea.dataset.betAmountListenerAdded = 'true';
                textarea.addEventListener('input', checkBetAmountInReplyBox);
                textarea.addEventListener('paste', () => setTimeout(checkBetAmountInReplyBox, 0));
                checkBetAmountInReplyBox(); // 初始检查
            }
        }
    }

    const ENABLE_SPECIAL_TILES = false;

    // 全局变量：高亮帖子列表
    let highlightedPosts = [];
    
    // 全局变量：记录是否已经跳过第一楼（用于翻页加载时避免误判）
    let hasSkippedFirstFloor = false;
    
    // 全局变量：缓存当前主题的所有帖子数据
    let cachedTopicPostsData = null;
    let cachedTopicUrl = null;
    
    /**
     * 预加载当前主题的所有回复数据（后台异步加载）
     */
    async function preloadCurrentTopicPostsData() {
        if (!isViewTopicPage()) {
            return;
        }
        
        const currentUrl = window.location.href;
        const normalizedUrl = normalizeUrlForCompare(currentUrl);
        
        // 如果已经有缓存且URL相同，不需要重新加载
        if (cachedTopicPostsData && cachedTopicUrl === normalizedUrl) {
            printAllPostsInfo(cachedTopicPostsData);
            return;
        }
        
        console.log('[HDSky特殊关注] 开始加载所有分页的回复数据...');
        
        try {
            const allPosts = await fetchTopicPostsData(currentUrl);
            console.log('[HDSky特殊关注] 数据加载完成，共', allPosts.length, '条回复');
            printAllPostsInfo(allPosts);
        } catch (err) {
            handleError('预加载主题数据', err);
        }
    }
    
    /**
     * 打印所有帖子信息到控制台
     * @param {Array} posts - 帖子数据数组
     */
    function printAllPostsInfo(posts) {
        console.log('='.repeat(80));
        console.log('[HDSky特殊关注] 所有回复信息列表');
        console.log('='.repeat(80));
        console.log('总回复数:', posts.length);
        console.log('-'.repeat(80));
        
        posts.forEach((post, index) => {
            console.log(`\n【回复 ${index + 1}】`);
            console.log('  用户名:', post.username);
            console.log('  锚点ID:', post.anchorId || '无');
            
            if (post.hasBet) {
                console.log('  下注内容:', post.bets);
                console.log('  下注点数:', post.betAmount || '未指定');
            } else {
                console.log('  下注内容: 未下注');
            }
            
            if (post.ratingSum !== 0) {
                const prefix = post.ratingSum > 0 ? '+' : '';
                console.log('  评分总和:', `${prefix}${post.ratingSum}`);
            }
        });
        
        console.log('\n' + '='.repeat(80));
        
        // 统计信息
        const betCount = posts.filter(p => p.hasBet).length;
        const ratingCount = posts.filter(p => p.ratingSum !== 0).length;
        const uniqueUsers = new Set(posts.map(p => p.username)).size;
        
        console.log('[统计信息]');
        console.log('  独立用户数:', uniqueUsers);
        console.log('  已下注回复数:', betCount);
        console.log('  有评分回复数:', ratingCount);
        
        // 特殊关注用户统计
        const followList = getSpecialFollowList();
        const followSet = new Set(followList);
        const followedPosts = posts.filter(p => followSet.has(p.username));
        
        if (followedPosts.length > 0) {
            console.log('  特殊关注回复数:', followedPosts.length);
            const followedUsers = [...new Set(followedPosts.map(p => p.username))];
            console.log('  特殊关注用户:', followedUsers.join('、'));
        }
        
        console.log('='.repeat(80));
    }
    
    /**
     * 获取主题的所有回复数据（解析后的标准化数据），使用缓存优化
     * @param {string} topicUrl - 主题URL
     * @returns {Promise<Array>} 返回所有帖子的解析数据
     */
    async function fetchTopicPostsData(topicUrl) {
        const normalizedUrl = normalizeUrlForCompare(topicUrl);
        
        // 如果缓存存在且URL相同，直接返回缓存
        if (cachedTopicPostsData && cachedTopicUrl === normalizedUrl) {
            return cachedTopicPostsData;
        }
        
        const documents = await fetchTopicDocumentsByUrl(topicUrl);
        const allPosts = [];
        
        for (const entry of documents) {
            const posts = parsePostsFromDocument(entry.doc, entry.pageNum);
            allPosts.push(...posts);
        }
        
        // 更新缓存
        cachedTopicPostsData = allPosts;
        cachedTopicUrl = normalizedUrl;
        
        return allPosts;
    }

    // 添加收藏
    function addBookmark() {
        const currentUrl = window.location.href;
        let currentTitle = document.title || '未命名页面';
        
        // 从标题中提取引号里的内容
        const match = currentTitle.match(/"([^"]+)"/);
        if (match && match[1]) {
            currentTitle = match[1];
        } else {
            // 如果没有引号，则删掉常见的前后缀
            currentTitle = currentTitle.replace(/^HDSky :: 查看主题\s+/i, '');
            currentTitle = currentTitle.replace(/^HDSky :: /i, '');
            currentTitle = currentTitle.replace(/\s*高清视界.*$/i, '');
            currentTitle = currentTitle.replace(/\s*-\s*Powered by.*$/i, '');
        }
        
        // 获取现有收藏列表
        const bookmarks = getBookmarkList();
        
        // 检查是否已经收藏
        const exists = bookmarks.some(b => b.url === currentUrl);
        if (exists) {
            alert('该页面已经在收藏夹中了！');
            return;
        }
        
        // 添加新收藏
        bookmarks.push({
            url: currentUrl,
            title: currentTitle,
            time: new Date().toLocaleString()
        });
        
        // 保存
        saveBookmarkList(bookmarks);
        alert('收藏成功！\n标题：' + currentTitle);
    }

    // 显示收藏夹
    function showBookmarkList() {
        const bookmarks = getBookmarkList();
        
        // 移除旧的收藏夹窗口（如果存在）
        const oldDialog = document.getElementById('bookmark-dialog');
        if (oldDialog) {
            oldDialog.remove();
        }
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'bookmark-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // 创建弹窗
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 700px;
            max-width: 95vw;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2196F3;
            background: transparent;
        `;
        
        const title = document.createElement('h2');
        title.textContent = '我的收藏夹';
        title.style.cssText = `
            margin: 0;
            padding: 0;
            color: #2196F3;
            font-size: 20px;
            background: transparent;
            border: none;
            outline: none;
        `;
        header.appendChild(title);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: background 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#d32f2f';
        closeBtn.onmouseout = () => closeBtn.style.background = '#f44336';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);
        
        dialog.appendChild(header);
        
        // 收藏列表
        if (bookmarks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = '收藏夹还是空的，快去收藏喜欢的页面吧！';
            emptyMsg.style.cssText = `
                text-align: center;
                color: #999;
                padding: 40px 20px;
                font-size: 14px;
                background: #f9f9f9;
                border-radius: 5px;
                margin-top: 10px;
            `;
            dialog.appendChild(emptyMsg);
        } else {
            bookmarks.forEach((bookmark, index) => {
                const item = createBookmarkItem(bookmark, index);
                dialog.appendChild(item);
            });
        }
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 点击遮罩层关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };
    }

    // 创建收藏项
    function createBookmarkItem(bookmark, index) {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            transition: all 0.3s;
        `;
        item.onmouseover = () => {
            item.style.background = '#e3f2fd';
            item.style.borderColor = '#2196F3';
            item.style.transform = 'translateX(5px)';
            item.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.2)';
        };
        item.onmouseout = () => {
            item.style.background = '#fafafa';
            item.style.borderColor = '#e0e0e0';
            item.style.transform = 'translateX(0)';
            item.style.boxShadow = 'none';
        };
        
        // 左侧内容区
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            cursor: pointer;
            overflow: hidden;
        `;
        content.onclick = () => window.location.href = bookmark.url;
        
        const titleDiv = document.createElement('div');
        titleDiv.textContent = bookmark.title;
        titleDiv.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            color: #2196F3;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        content.appendChild(titleDiv);
        
        const timeDiv = document.createElement('div');
        timeDiv.textContent = '收藏时间: ' + bookmark.time;
        timeDiv.style.cssText = `
            font-size: 12px;
            color: #999;
        `;
        content.appendChild(timeDiv);
        
        item.appendChild(content);
        
        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.style.cssText = `
            background: #ff5722;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.3s;
            margin-left: 10px;
        `;
        deleteBtn.onmouseover = () => deleteBtn.style.background = '#e64a19';
        deleteBtn.onmouseout = () => deleteBtn.style.background = '#ff5722';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('确定要删除这个收藏吗？\n' + bookmark.title)) {
                deleteBookmark(index);
                showBookmarkList(); // 刷新列表
            }
        };
        item.appendChild(deleteBtn);
        
        return item;
    }

    // 删除收藏
    function deleteBookmark(index) {
        const bookmarks = getBookmarkList();
        bookmarks.splice(index, 1);
        saveBookmarkList(bookmarks);
    }

    // 处理关注列表点击（编辑）
    function handleFollowListClick() {
        const currentList = getSpecialFollowList();
        const currentStr = currentList.join(',');
        
        const input = prompt('请输入特殊关注名单（用逗号分隔）:\n例如: DFBCOLD19,李知恩', currentStr);
        
        if (input !== null) { // 用户点击了确定（包括空字符串）
            const newList = input.split(',').map(name => name.trim()).filter(name => name);
            saveSpecialFollowList(newList);
            
            alert('特殊关注名单已更新！\n当前关注: ' + (newList.length > 0 ? newList.join(', ') : '无'));
            
            // 重新应用高亮
            autoHighlightFollowedPosts();
            renderSpecialFollowTiles();
        }
    }

    // 自动高亮特殊关注用户的帖子（页面加载时调用）
    function autoHighlightFollowedPosts() {
        // 如果开关关闭，清除高亮并退出
        if (!Config.getHighlightFollowEnabled()) {
            clearHighlights();
            return;
        }
        
        const followList = getSpecialFollowList();
        const followSet = new Set(followList);
        
        // 如果没有关注名单，不执行高亮
        if (followList.length === 0) {
            return;
        }
        
        // 先清除之前的高亮
        clearHighlights();
        
        // 重置高亮列表
        highlightedPosts = [];
        
        // 获取当前页面的帖子数据（使用解析函数）
        const pageNum = hasSkippedFirstFloor ? 1 : 0; // 如果已经跳过第一楼，表示这是翻页加载
        const posts = parsePostsFromDocument(document, pageNum);
        
        // 标记已跳过第一楼
        if (!hasSkippedFirstFloor) {
            hasSkippedFirstFloor = true;
        }
        
        // 高亮特殊关注用户的帖子
        posts.forEach(post => {
            if (!post.postElement || !followSet.has(post.username)) {
                return;
            }
            
            const postElement = post.postElement;
            
            // 高亮显示关注用户的信息div
            postElement.style.background = '#fffacd';
            postElement.style.border = '2px solid #ffd700';
            postElement.style.borderRadius = '5px';
            postElement.style.padding = '5px';
            
            // 找到并高亮div内部的table
            const innerTables = postElement.querySelectorAll('table');
            innerTables.forEach(table => {
                table.style.background = '#fff8dc';
                table.style.border = '2px solid #ffb700';
            });
            
            // 标记为已高亮
            postElement.dataset.highlighted = 'true';
            
            // 找到并高亮紧跟在div后面的回复内容table（class="main"）
            let nextElement = postElement.nextElementSibling;
            if (nextElement && nextElement.tagName === 'TABLE' && nextElement.classList.contains('main')) {
                nextElement.style.background = '#fff8dc';
                nextElement.style.border = '2px solid #ffb700';
                nextElement.style.borderRadius = '5px';
                // 标记这个table也被高亮了
                nextElement.dataset.highlightedContent = 'true';
            }
            
            // 添加到高亮列表
            highlightedPosts.push(postElement);
        });
    }

    // 清除所有高亮
    function clearHighlights() {
        // 找到所有被高亮的帖子div
        const posts = document.querySelectorAll('div[data-highlighted="true"]');
        
        posts.forEach(post => {
            // 清除div的高亮样式
            post.style.background = '';
            post.style.border = '';
            post.style.borderRadius = '';
            post.style.padding = '';
            post.removeAttribute('data-highlighted');
            
            // 清除div内部table的高亮样式
            const tables = post.querySelectorAll('table');
            tables.forEach(table => {
                table.style.background = '';
                table.style.border = '';
            });
        });
        
        // 清除所有被高亮的回复内容table
        const contentTables = document.querySelectorAll('table[data-highlighted-content="true"]');
        contentTables.forEach(table => {
            table.style.background = '';
            table.style.border = '';
            table.style.borderRadius = '';
            table.removeAttribute('data-highlighted-content');
        });
        
        // 重置全局变量
        highlightedPosts = [];
    }

    // 移除特殊关注磁贴容器
    function removeSpecialFollowTiles() {
        const existing = document.getElementById('special-follow-tile-container');
        if (existing) {
            existing.remove();
        }
    }


    // 收集特殊关注用户的回帖数据（使用缓存数据）
    async function collectSpecialFollowReplies(followList) {
        const followSet = new Set(followList);
        const collectedMap = new Map();
        
        // 使用缓存的数据或获取所有分页数据
        const currentUrl = window.location.href;
        const allPosts = await fetchTopicPostsData(currentUrl);
        
        // 遍历所有帖子，收集特殊关注用户的信息
        for (let post of allPosts) {
            const username = post.username;
            
            // 如果是特殊关注用户且尚未收集
            if (followSet.has(username) && !collectedMap.has(username)) {
                // 构建目标URL（带锚点）
                let targetUrl = currentUrl.split('#')[0];
                if (post.anchorId) {
                    targetUrl += `#${post.anchorId}`;
                }
                
                // 检查是否在当前页面
                const isOnCurrentPage = post.postElement && post.postElement.ownerDocument === document;
                
                collectedMap.set(username, {
                    username,
                    targetUrl,
                    anchorId: post.anchorId,
                    isOnCurrentPage: isOnCurrentPage,
                    pageUrl: currentUrl
                });
            }
            
            // 如果已经找到所有关注用户，提前退出
            if (collectedMap.size === followSet.size) {
                break;
            }
        }
        
        return Array.from(collectedMap.values());
    }

    // 点击磁贴时滚动或跳转
    function handleFollowTileClick(tileInfo) {
        if (tileInfo.isOnCurrentPage && tileInfo.anchorId) {
            const target = document.getElementById(tileInfo.anchorId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                target.style.boxShadow = '0 0 10px 2px rgba(33,150,243,0.6)';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 2000);
                return;
            }
        }

        // 如果不在当前页，跳转到对应链接
        window.location.href = tileInfo.targetUrl;
    }

    // 渲染特殊关注磁贴
    async function renderSpecialFollowTiles() {
        if (!ENABLE_SPECIAL_TILES) {
            removeSpecialFollowTiles();
            return;
        }
        removeSpecialFollowTiles();

        if (!isViewTopicPage()) {
            return;
        }

        const followList = getSpecialFollowList();
        if (followList.length === 0) {
            return;
        }

        const tileData = await collectSpecialFollowReplies(followList);
        if (tileData.length === 0) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'special-follow-tile-container';
        container.style.cssText = `
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
        `;

        tileData.forEach(info => {
            const tile = document.createElement('div');
            tile.className = 'special-follow-tile';
            tile.textContent = info.username;
            tile.style.cssText = `
                background: #fff;
                border: 1px solid #2196F3;
                border-radius: 8px;
                padding: 10px 14px;
                font-size: 13px;
                font-weight: bold;
                color: #2196F3;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                transition: transform 0.2s, box-shadow 0.2s;
                min-width: 120px;
                text-align: center;
            `;

            tile.onmouseover = () => {
                tile.style.transform = 'translateX(-4px)';
                tile.style.boxShadow = '0 4px 10px rgba(33,150,243,0.3)';
            };
            tile.onmouseout = () => {
                tile.style.transform = 'translateX(0)';
                tile.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            };

            tile.onclick = () => handleFollowTileClick(info);

            container.appendChild(tile);
        });

        document.body.appendChild(container);
    }

    // 自动加载下一页功能
    let isLoadingNextPage = false;
    const scrollThreshold = 800; // 距离底部多少像素时触发加载

    function autoLoadNextPage() {
        if (!Config.getAutoLoadEnabled()) {
            return;
        }

        // 检查URL中是否包含topicid参数
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('topicid')) {
            return;
        }

        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            
            // 只在向下滚动时触发
            if (scrollTop > lastScrollTop) {
                // 判断是否接近底部
                if (scrollHeight <= clientHeight + scrollTop + scrollThreshold && !isLoadingNextPage) {
                    // 查找下一页链接
                    const nextLinks = document.querySelectorAll('a');
                    let nextPageLink = null;
                    
                    for (let link of nextLinks) {
                        const text = link.textContent.trim();
                        if (text.includes('下一页') || text === '下一页 >>') {
                            nextPageLink = link;
                            break;
                        }
                    }
                    
                    if (nextPageLink && nextPageLink.href) {
                        loadNextPage(nextPageLink.href);
                    }
                }
            }
            
            lastScrollTop = scrollTop;
        }, false);
    }

    function loadNextPage(url) {
        isLoadingNextPage = true;
        
        // 显示加载提示
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'auto-loading-indicator';
        loadingDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 150, 243, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 14px;
            font-weight: bold;
        `;
        loadingDiv.textContent = '正在加载下一页...';
        document.body.appendChild(loadingDiv);
        
        // 使用 fetch 加载下一页
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // 查找主要内容区域 - 找到所有回复帖子
                const newPosts = doc.querySelectorAll('div[style*="margin-top: 8pt"]');
                
                // 找到当前页面的最后一个帖子
                const currentPosts = document.querySelectorAll('div[style*="margin-top: 8pt"]');
                if (currentPosts.length > 0 && newPosts.length > 0) {
                    const lastPost = currentPosts[currentPosts.length - 1];
                    
                    // 找到最后一个帖子的下一个 table（回复内容）
                    let lastTable = lastPost.nextElementSibling;
                    while (lastTable && lastTable.tagName !== 'TABLE') {
                        lastTable = lastTable.nextElementSibling;
                    }
                    
                    // 确定插入位置：如果有 table 就在 table 后面，否则在 div 后面
                    let insertAfter = lastTable || lastPost;
                    
                    // 将新帖子插入到页面中
                    newPosts.forEach(post => {
                        // 克隆 div（用户信息）
                        const clonedPost = post.cloneNode(true);
                        insertAfter.parentNode.insertBefore(clonedPost, insertAfter.nextSibling);
                        insertAfter = clonedPost;
                        
                        // 查找并克隆紧跟的 table（回复内容）
                        const nextTable = post.nextElementSibling;
                        if (nextTable && nextTable.tagName === 'TABLE' && nextTable.classList.contains('main')) {
                            const clonedTable = nextTable.cloneNode(true);
                            insertAfter.parentNode.insertBefore(clonedTable, insertAfter.nextSibling);
                            insertAfter = clonedTable;
                        }
                    });
                    
                    // 更新页码导航（找到所有 <p align="center"> 中包含"上一页"和"下一页"的元素）
                    const newPagers = doc.querySelectorAll('p[align="center"]');
                    const currentPagers = document.querySelectorAll('p[align="center"]');
                    
                    // 遍历并更新所有分页器
                    let pagerUpdateCount = 0;
                    for (let i = 0; i < currentPagers.length && i < newPagers.length; i++) {
                        const currentPager = currentPagers[i];
                        const newPager = newPagers[i];
                        
                        // 检查是否包含分页链接（包含"上一页"或"下一页"）
                        if (currentPager.innerHTML.includes('上一页') || currentPager.innerHTML.includes('下一页')) {
                            currentPager.innerHTML = newPager.innerHTML;
                            pagerUpdateCount++;
                        }
                    }
                    
                    
                    // 重新应用高亮
                    autoHighlightFollowedPosts();
                    renderSpecialFollowTiles();
                    
                    loadingDiv.textContent = '✓ 加载完成';
                    loadingDiv.style.background = 'rgba(76, 175, 80, 0.9)';
                    
                    setTimeout(() => {
                        loadingDiv.remove();
                    }, 2000);
                    
                    // 更新 URL（不刷新页面）
                    history.pushState(null, '', url);
                } else {
                    loadingDiv.textContent = '没有更多内容了';
                    loadingDiv.style.background = 'rgba(255, 152, 0, 0.9)';
                    setTimeout(() => {
                        loadingDiv.remove();
                    }, 2000);
                }
                
                isLoadingNextPage = false;
            })
            .catch(error => {
                handleError('加载下一页', error);
                loadingDiv.textContent = '✗ 加载失败';
                loadingDiv.style.background = 'rgba(244, 67, 54, 0.9)';
                setTimeout(() => {
                    loadingDiv.remove();
                }, 2000);
                isLoadingNextPage = false;
            });
    }


    // 提取收藏夹中所有URL的topicid并打印到控制台
    function printBookmarkTopicIds() {
        const bookmarks = getBookmarkList();
        const topicIds = [];
        
        bookmarks.forEach(bookmark => {
            try {
                const url = new URL(bookmark.url);
                const topicid = url.searchParams.get('topicid');
                if (topicid) {
                    topicIds.push(topicid);
                }
            } catch (e) {
                // 如果URL格式不正确，尝试用正则表达式提取
                const match = bookmark.url.match(/topicid=(\d+)/);
                if (match && match[1]) {
                    topicIds.push(match[1]);
                }
            }
        });
        
        if (topicIds.length > 0) {
        } else {
        }
        
        return topicIds;
    }

    // 将函数暴露到全局，方便在控制台中手动调用
    window.printBookmarkTopicIds = printBookmarkTopicIds;

    // 在embedded左侧添加星星标记收藏的帖子
    function highlightTopicIdRows() {
        // 只在URL包含viewforum时生效
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') !== 'viewforum') {
            return;
        }
        
        // 获取收藏夹中的topicid列表
        const bookmarks = getBookmarkList();
        const topicIds = [];
        
        bookmarks.forEach(bookmark => {
            try {
                const url = new URL(bookmark.url);
                const topicid = url.searchParams.get('topicid');
                if (topicid) {
                    topicIds.push(topicid);
                }
            } catch (e) {
                // 如果URL格式不正确，尝试用正则表达式提取
                const match = bookmark.url.match(/topicid=(\d+)/);
                if (match && match[1]) {
                    topicIds.push(match[1]);
                }
            }
        });
        
        if (topicIds.length === 0) {
            return; // 如果没有收藏的topicid，不执行标记
        }
        
        // 查找所有包含topicid链接的embedded元素
        const embeddedTds = document.querySelectorAll('td.embedded');
        
        embeddedTds.forEach(td => {
            // 查找td中所有包含topicid的链接
            const links = td.querySelectorAll('a[href*="topicid"]');
            
            links.forEach(link => {
                // 从链接中提取topicid
                const href = link.getAttribute('href');
                const match = href.match(/topicid[=&](\d+)/);
                
                if (match && match[1]) {
                    const topicid = match[1];
                    
                    // 如果这个topicid在收藏列表中，添加星星
                    if (topicIds.includes(topicid)) {
                        // 检查是否已经添加过星星
                        if (!td.querySelector('.bookmark-star')) {
                            // 创建星星元素
                            const star = document.createElement('span');
                            star.className = 'bookmark-star';
                            star.textContent = '⭐';
                            star.title = '已收藏';
                            star.style.cssText = `
                                margin-right: 5px;
                                font-size: 14px;
                                cursor: pointer;
                            `;
                            
                            // 在embedded的左侧插入星星（在所有内容之前）
                            td.insertBefore(star, td.firstChild);
                        }
                    }
                }
            });
        });
        
    }

    // 清理下注文本，移除【数字】或[数字]等前缀
    function sanitizeBetValue(value) {
        if (!value) {
            return '';
        }
        return value
            .replace(/[\[【]\s*[\d.]+\s*[\]】]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 采集帖子下注数据
    // 计算评分总和
    function calculateRatingSum(postBody) {
        const container = postBody.parentElement;
        if (!container) return 0;

        // 查找包含"[评分]"的 div
        const ratingDiv = Array.from(container.querySelectorAll('div')).find(div => {
            const text = div.textContent || '';
            return text.includes('[评分]');
        });

        if (!ratingDiv) {
            return 0;
        }

        const html = ratingDiv.innerHTML || '';
        const lines = html.split(/<br\s*\/?>|\n/i);
        let sum = 0;
        let foundScore = false;

        lines.forEach(line => {
            const clean = line.replace(/<[^>]+>/g, '').trim();
            if (!clean || !clean.includes('评分理由')) {
                return;
            }
            const match = clean.match(/\s([+-]\d[\d,]*)\s*评分理由/);
            if (match) {
                const value = parseInt(match[1].trim().replace(/,/g, ''), 10);
                if (!isNaN(value)) {
                    sum += value;
                    foundScore = true;
                }
            }
        });

        return foundScore ? sum : 0;
    }

    async function collectBetPostsData() {
        // 使用 fetchTopicPostsData 获取当前主题的所有分页数据
        const currentUrl = window.location.href;
        const posts = await fetchTopicPostsData(currentUrl);
        const results = [];
        let maxBetIndex = 0;
        let hasRating = false;

        posts.forEach(post => {
            // 只收集有下注的帖子
            if (!post.hasBet) {
                return;
            }

            // 计算最大下注索引
            Object.keys(post.bets).forEach(key => {
                const index = parseInt(key, 10);
                if (!isNaN(index) && index > maxBetIndex) {
                    maxBetIndex = index;
                }
            });

            // 检查是否有评分
            if (post.ratingSum !== 0) {
                hasRating = true;
                // 只在当前页面的帖子上显示评分总和
                if (post.bodyElement && post.bodyElement.ownerDocument === document) {
                    appendRatingSummary(post.bodyElement, post.ratingSum);
                }
            }

            results.push({
                username: post.username,
                bets: post.bets,
                betAmount: post.betAmount,
                anchorId: post.anchorId,
                ratingSum: post.ratingSum
            });
        });

        return {
            rows: results,
            maxBetIndex,
            hasRating
        };
    }

    // 渲染数据分析表格
    function renderDataAnalysisTable(dataRows, maxBetIndex, container, onlyFollow, hasRating) {
        container.innerHTML = '';
        const followList = new Set(getSpecialFollowList());
        const filteredRows = onlyFollow ? dataRows.filter(row => followList.has(row.username)) : dataRows.slice();

        if (filteredRows.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = `
                padding: 40px 20px;
                text-align: center;
                color: #999;
                font-size: 14px;
            `;
            empty.textContent = onlyFollow ? '特殊关注列表中没有匹配的下注记录。' : '当前页面未找到下注记录。';
            container.appendChild(empty);
            return;
        }

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 13px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
        `;

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.background = '#f5f5f5';

        const userTh = document.createElement('th');
        userTh.textContent = '用户名';
        userTh.style.cssText = 'border: 1px solid #ddd; padding: 8px; width: 120px;';
        headerRow.appendChild(userTh);

        for (let i = 1; i <= maxBetIndex; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            th.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
            headerRow.appendChild(th);
        }
        const betAmountTh = document.createElement('th');
        betAmountTh.textContent = '下注点数';
        betAmountTh.style.cssText = 'border: 1px solid #ddd; padding: 8px; width: 100px;';
        headerRow.appendChild(betAmountTh);

        // 如果有评分，添加"评分总和"列
        if (hasRating) {
            const ratingSumTh = document.createElement('th');
            ratingSumTh.textContent = '评分总和';
            ratingSumTh.style.cssText = 'border: 1px solid #ddd; padding: 8px; width: 100px;';
            headerRow.appendChild(ratingSumTh);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        const columnTopMap = new Map();
        for (let i = 1; i <= maxBetIndex; i++) {
            const freq = new Map();
            filteredRows.forEach(row => {
                const val = (row.bets[i] || '').trim();
                if (!val) return;
                freq.set(val, (freq.get(val) || 0) + 1);
            });
            let topValue = '';
            let topCount = 0;
            freq.forEach((count, val) => {
                if (count > topCount) {
                    topValue = val;
                    topCount = count;
                }
            });
            columnTopMap.set(i, { value: topValue, count: topCount });
        }

        filteredRows.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.background = '#fff';

            // 检查是否是特殊关注用户
            const isFollowedUser = followList.has(row.username);
            const userColor = isFollowedUser ? '#f44336' : '#2196F3'; // 特殊关注用红色，普通用户用蓝色

            const userTd = document.createElement('td');
            userTd.style.cssText = `border: 1px solid #ddd; padding: 8px; font-weight: bold; color: ${userColor};`;
            const anchorLink = document.createElement('a');
            anchorLink.textContent = row.username;
            anchorLink.style.cssText = `color: ${userColor}; text-decoration: none; cursor: pointer;`;
            anchorLink.title = '点击跳转到该用户的楼层';
            anchorLink.onclick = () => {
                if (row.anchorId) {
                    const target = document.getElementById(row.anchorId);
                    if (target) {
                        // 元素在当前页面，直接滚动
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        target.style.boxShadow = '0 0 12px rgba(33,150,243,0.7)';
                        setTimeout(() => target.style.boxShadow = '', 2000);
                        // 关闭对话框
                        const overlay = document.getElementById('data-analysis-dialog');
                        if (overlay) {
                            overlay.remove();
                        }
                    } else {
                        // 元素不在当前页面，跳转到带锚点的URL
                        window.location.href = `#${row.anchorId}`;
                        // 延迟关闭对话框，等待页面跳转
                        setTimeout(() => {
                            const overlay = document.getElementById('data-analysis-dialog');
                            if (overlay) {
                                overlay.remove();
                            }
                        }, 100);
                    }
                }
            };
            userTd.appendChild(anchorLink);
            tr.appendChild(userTd);

            for (let i = 1; i <= maxBetIndex; i++) {
                const td = document.createElement('td');
                const value = row.bets[i] || '';
                td.textContent = value;
                td.style.cssText = 'border: 1px solid #eee; padding: 8px;';
                const topInfo = columnTopMap.get(i);
                if (topInfo && topInfo.value && value === topInfo.value) {
                    td.style.background = '#fff7d6';
                    td.style.fontWeight = 'bold';
                    td.style.color = '#e65100';
                }
                tr.appendChild(td);
            }
            const betAmountTd = document.createElement('td');
            betAmountTd.textContent = row.betAmount || '';
            betAmountTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: right;';
            tr.appendChild(betAmountTd);

            // 如果有评分，添加"评分总和"单元格
            if (hasRating) {
                const ratingSumTd = document.createElement('td');
                if (row.ratingSum !== null && row.ratingSum !== undefined && row.ratingSum !== 0) {
                    const prefix = row.ratingSum > 0 ? '+' : '';
                    ratingSumTd.textContent = `${prefix}${row.ratingSum}`;
                    ratingSumTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;';
                    if (row.ratingSum > 0) {
                        ratingSumTd.style.color = '#4caf50';
                    } else if (row.ratingSum < 0) {
                        ratingSumTd.style.color = '#f44336';
                    }
                } else {
                    ratingSumTd.textContent = '-';
                    ratingSumTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center; color: #999;';
                }
                tr.appendChild(ratingSumTd);
            }

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        const summaryRow = document.createElement('tr');
        summaryRow.style.background = '#e3f2fd';

        const summaryLabel = document.createElement('td');
        summaryLabel.textContent = '最常见';
        summaryLabel.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-weight: bold;';
        summaryRow.appendChild(summaryLabel);

        for (let i = 1; i <= maxBetIndex; i++) {
            const td = document.createElement('td');
            const info = columnTopMap.get(i);
            if (info && info.value) {
                td.textContent = `${info.value}（${info.count}次）`;
                td.style.fontWeight = 'bold';
                td.style.color = '#0d47a1';
            } else {
                td.textContent = '无数据';
                td.style.color = '#999';
            }
            td.style.cssText = (td.style.cssText || '') + 'border: 1px solid #ddd; padding: 8px;';
            summaryRow.appendChild(td);
        }
        const summaryBetTd = document.createElement('td');
        summaryBetTd.textContent = '—';
        summaryBetTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center; color: #777;';
        summaryRow.appendChild(summaryBetTd);

        // 如果有评分，添加一个空的评分总和单元格
        if (hasRating) {
            const summaryRatingTd = document.createElement('td');
            summaryRatingTd.textContent = '—';
            summaryRatingTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center; color: #777;';
            summaryRow.appendChild(summaryRatingTd);
        }

        if (tbody.firstChild) {
            tbody.insertBefore(summaryRow, tbody.firstChild);
        } else {
            tbody.appendChild(summaryRow);
        }

        // 构建最常见下注文本
        const popularLines = [];
        for (let i = 1; i <= maxBetIndex; i++) {
            const info = columnTopMap.get(i);
            if (info && info.value) {
                popularLines.push(`${i}.下注球隊： [0.9]${info.value}`);
            }
        }

        const textAreaWrapper = document.createElement('div');
        textAreaWrapper.style.cssText = 'margin-top: 12px;';

        const textAreaLabel = document.createElement('div');
        textAreaLabel.textContent = '最常见下注组合：';
        textAreaLabel.style.cssText = 'font-weight: bold; margin-bottom: 6px;';
        textAreaWrapper.appendChild(textAreaLabel);

        const summaryTextarea = document.createElement('textarea');
        summaryTextarea.readOnly = false;
        summaryTextarea.style.cssText = `
            width: 98%;
            min-height: 160px;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 10px;
            font-size: 13px;
            line-height: 1.5;
            resize: none;
            overflow-y: hidden;
            box-sizing: border-box;
        `;

        if (popularLines.length > 0) {
            popularLines.push('', '下注点数：1000000');
            summaryTextarea.value = popularLines.join('\n');
        } else {
            summaryTextarea.value = '暂无可用的最常见下注数据';
        }

        textAreaWrapper.appendChild(summaryTextarea);
        
        // 自动调整高度的函数
        const adjustTextareaHeight = () => {
            // 先重置高度，让scrollHeight能正确计算
            summaryTextarea.style.height = 'auto';
            // 获取实际需要的高度（scrollHeight已经包含了padding）
            const scrollHeight = summaryTextarea.scrollHeight;
            // 设置新高度，最小160px，减去1px避免底部多余空白
            summaryTextarea.style.height = Math.max(160, scrollHeight - 1) + 'px';
        };
        
        // 等待DOM更新后再设置初始高度
        setTimeout(() => {
            adjustTextareaHeight();
        }, 0);
        
        // 监听输入事件，动态调整高度
        summaryTextarea.addEventListener('input', adjustTextareaHeight);
        summaryTextarea.addEventListener('paste', () => {
            setTimeout(adjustTextareaHeight, 0);
        });
        container.appendChild(textAreaWrapper);
        const divider = document.createElement('hr');
        divider.style.cssText = 'border: none; border-top: 1px dashed #ccc; margin: 16px 0;';
        container.appendChild(divider);
        container.appendChild(table);
        return summaryTextarea;
    }

    // 打开快捷回复悬浮框
    let isQuickReplyOpen = false;
    function openQuickReply() {
        if (!isViewTopicPage()) {
            alert('快捷回复功能仅在帖子页面可用');
            return;
        }

        if (isQuickReplyOpen) {
            return;
        }

        // 查找原始回复框，获取表单信息
        const originalCompose = document.getElementById('compose');
        if (!originalCompose) {
            alert('未找到回复框');
            return;
        }

        // 获取原始表单的 action 和 method
        const form = originalCompose.querySelector('form');
        const formAction = form ? form.getAttribute('action') : '';
        const formMethod = form ? form.getAttribute('method') || 'post' : 'post';

        // 创建悬浮框容器（参考 a.html 的 md-editor 风格）
        const quickReplyBox = document.createElement('div');
        quickReplyBox.id = 'quick-reply-box';
        quickReplyBox.className = 'md-editor';
        quickReplyBox.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10001;
            width: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 创建标题栏（参考 a.html 的 window_header 风格，可拖动）
        const header = document.createElement('div');
        header.className = 'tab-select window_header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            cursor: move;
            user-select: none;
        `;
        
        const headerTitle = document.createElement('div');
        headerTitle.textContent = '快捷回复';
        headerTitle.style.cssText = `
            font-weight: 500;
            color: #333;
            font-size: 18px;
        `;
        header.appendChild(headerTitle);
        
        // 关闭按钮（参考 a.html 风格）
        const closeBtn = document.createElement('a');
        closeBtn.href = 'javascript:void(0)';
        closeBtn.className = 'editor-top-button';
        closeBtn.title = '关闭';
        closeBtn.style.cssText = `
            background-color: rgba(0, 0, 0, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        closeBtn.onmouseover = () => closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
        closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        header.appendChild(closeBtn);

        // 内容区域
        const content = document.createElement('div');
        content.id = 'editor-body';
        content.style.cssText = `
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // 创建文本输入框
        const textarea = document.createElement('textarea');
        textarea.name = 'body';
        textarea.placeholder = '输入回复内容...';
        textarea.style.cssText = `
            width: 100%;
            min-height: 200px;
            max-height: 500px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
            resize: none;
            overflow-y: auto;
            box-sizing: border-box;
            outline: none;
        `;
        
        // 自动调整高度的函数
        const adjustTextareaHeight = () => {
            // 先重置高度，让scrollHeight能正确计算
            textarea.style.height = 'auto';
            // 获取实际需要的高度（scrollHeight已经包含了padding）
            const scrollHeight = textarea.scrollHeight;
            // 设置新高度，最小200px，最大500px，减去1px避免底部多余空白
            const newHeight = Math.max(200, Math.min(500, scrollHeight - 1));
            textarea.style.height = newHeight + 'px';
            // 如果内容超过最大高度，显示滚动条
            if (scrollHeight > 500) {
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        };
        
        // 等待DOM更新后再设置初始高度
        setTimeout(() => {
            adjustTextareaHeight();
        }, 0);
        
        // 监听输入事件，动态调整高度
        textarea.addEventListener('input', adjustTextareaHeight);
        textarea.addEventListener('paste', () => {
            setTimeout(adjustTextareaHeight, 0);
        });

        // 创建提交按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid #e0e0e0;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = '提交回复';
        submitBtn.className = 'submit btn';
        submitBtn.style.cssText = `
            padding: 8px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.3s;
        `;
        submitBtn.onmouseover = () => submitBtn.style.background = '#1976D2';
        submitBtn.onmouseout = () => submitBtn.style.background = '#2196F3';

        // 创建表单
        const formElement = document.createElement('form');
        formElement.action = formAction;
        formElement.method = formMethod;
        formElement.style.cssText = 'display: flex; flex-direction: column; gap: 15px;';
        
        // 复制原始表单的所有隐藏字段
        if (form) {
            const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
            hiddenInputs.forEach(input => {
                const clonedInput = input.cloneNode(true);
                formElement.appendChild(clonedInput);
            });
        }

        formElement.appendChild(textarea);
        footer.appendChild(submitBtn);
        formElement.appendChild(footer);
        content.appendChild(formElement);

        // 表单提交处理 - 将快捷回复框的内容复制到原始表单并提交
        formElement.onsubmit = (e) => {
            e.preventDefault();
            
            // 确保使用快捷回复框中的 textarea 值
            const quickReplyTextarea = formElement.querySelector('textarea[name="body"]');
            if (!quickReplyTextarea || !quickReplyTextarea.value.trim()) {
                alert('请输入回复内容');
                return;
            }
            
            // 重新查找原始回复框和表单（确保获取最新的）
            const currentOriginalCompose = document.getElementById('compose');
            if (!currentOriginalCompose) {
                alert('未找到原始回复框');
                return;
            }
            
            // 查找原始表单（compose 可能是 form，或者 form 在 compose 内部）
            let originalForm = currentOriginalCompose;
            if (currentOriginalCompose.tagName !== 'FORM') {
                originalForm = currentOriginalCompose.querySelector('form');
            }
            
            if (!originalForm) {
                // 如果 compose 本身不是 form，也没有内部的 form，尝试查找父级 form
                originalForm = currentOriginalCompose.closest('form');
            }
            
            if (!originalForm) {
                alert('未找到原始表单');
                return;
            }
            
            // 查找原始表单的 textarea
            const originalTextarea = originalForm.querySelector('textarea[name="body"]');
            if (!originalTextarea) {
                alert('未找到原始回复框的文本框');
                return;
            }
            
            // 保存快捷回复框的内容
            const replyContent = quickReplyTextarea.value;
            
            // 将内容设置到原始表单
            originalTextarea.value = replyContent;
            
            // 触发 input 事件，确保表单验证通过
            originalTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // 提交原始表单
            originalForm.submit();
        };

        // 组装悬浮框
        quickReplyBox.appendChild(header);
        quickReplyBox.appendChild(content);

        // 居中显示
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        const boxHeight = 400;
        const boxWidth = 600;
        const top = (clientHeight / 2) - (boxHeight / 2);
        const left = (clientWidth / 2) - (boxWidth / 2);
        quickReplyBox.style.top = `${top}px`;
        quickReplyBox.style.left = `${left}px`;

        // 拖动功能
        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;

        const handleMouseDown = (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            initialX = e.clientX - quickReplyBox.offsetLeft;
            initialY = e.clientY - quickReplyBox.offsetTop;
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // 限制在窗口内
            const maxX = window.innerWidth - quickReplyBox.offsetWidth;
            const maxY = window.innerHeight - quickReplyBox.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            quickReplyBox.style.left = currentX + 'px';
            quickReplyBox.style.top = currentY + 'px';
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const closeQuickReply = () => {
            quickReplyBox.remove();
            isQuickReplyOpen = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        header.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        closeBtn.onclick = closeQuickReply;

        document.body.appendChild(quickReplyBox);
        isQuickReplyOpen = true;

        // 聚焦到文本框
        setTimeout(() => textarea.focus(), 100);
    }

    // 打开数据分析弹窗
    async function openDataAnalysisDialog() {
        const { rows, maxBetIndex, hasRating } = await collectBetPostsData();
        if (!rows || rows.length === 0) {
            alert('当前页面未找到下注内容，无法生成数据分析。');
            return;
        }

        const existing = document.getElementById('data-analysis-dialog');
        if (existing) {
            existing.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = 'data-analysis-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 1200px;
            max-width: 95vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2196F3;
            background: transparent;
        `;

        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
            flex: 1;
        `;

        const title = document.createElement('h2');
        title.textContent = '下注数据分析';
        title.style.cssText = `
            margin: 0;
            padding: 0;
            color: #2196F3;
            font-size: 20px;
            background: transparent;
            border: none;
            outline: none;
        `;
        titleContainer.appendChild(title);

        // 添加帖子标题
        const topSpan = document.getElementById('top');
        if (topSpan) {
            const topicTitle = document.createElement('div');
            topicTitle.textContent = topSpan.textContent.trim();
            topicTitle.style.cssText = `
                margin: 0;
                padding: 0;
                color: #666;
                font-size: 14px;
                font-weight: normal;
                line-height: 1.4;
            `;
            titleContainer.appendChild(topicTitle);
        }

        header.appendChild(titleContainer);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: background 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#d32f2f';
        closeBtn.onmouseout = () => closeBtn.style.background = '#f44336';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const controlBar = document.createElement('div');
        controlBar.style.cssText = `
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
        `;

        let summaryTextareaRef = null;
        const followBtn = document.createElement('button');
        followBtn.textContent = '只看特殊关注：关闭';
        followBtn.style.cssText = `
            padding: 6px 12px;
            border: 1px solid #2196F3;
            background: #fff;
            color: #2196F3;
            border-radius: 4px;
            cursor: pointer;
            transition: box-shadow 0.2s;
        `;
        const copyAnswerBtn = document.createElement('button');
        copyAnswerBtn.textContent = '复制答案';
        copyAnswerBtn.style.cssText = `
            padding: 6px 12px;
            border: 1px solid #4caf50;
            background: #fff;
            color: #4caf50;
            border-radius: 4px;
            cursor: pointer;
            transition: box-shadow 0.2s;
        `;
        const tableWrapper = document.createElement('div');
        tableWrapper.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            background: #fafafa;
            max-height: 70vh;
            overflow: auto;
        `;

        let onlyFollow = Config.get('dataAnalysisOnlyFollow', false);

        const refreshTable = () => {
            followBtn.textContent = `只看特殊关注：${onlyFollow ? '开启' : '关闭'}`;
            followBtn.style.background = onlyFollow ? '#2196F3' : '#fff';
            followBtn.style.color = onlyFollow ? '#fff' : '#2196F3';
            summaryTextareaRef = renderDataAnalysisTable(rows, maxBetIndex, tableWrapper, onlyFollow, hasRating);
        };

        followBtn.onclick = () => {
            onlyFollow = !onlyFollow;
            Config.set('dataAnalysisOnlyFollow', onlyFollow);
            refreshTable();
        };
        copyAnswerBtn.onclick = () => {
            if (!summaryTextareaRef) return;
            const text = summaryTextareaRef.value;
            navigator.clipboard.writeText(text).then(() => {
                copyAnswerBtn.textContent = '已复制';
                setTimeout(() => copyAnswerBtn.textContent = '复制答案', 1500);
            }).catch(() => {
                alert('复制失败，请手动复制。');
            });
        };
        const addHoverEffect = (btn, baseColor) => {
            btn.onmouseover = () => btn.style.boxShadow = '0 0 8px rgba(0,0,0,0.15)';
            btn.onmouseout = () => btn.style.boxShadow = '';
        };
        addHoverEffect(followBtn);
        addHoverEffect(copyAnswerBtn);

        controlBar.appendChild(followBtn);
        controlBar.appendChild(copyAnswerBtn);

        dialog.appendChild(header);
        dialog.appendChild(controlBar);
        dialog.appendChild(tableWrapper);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        refreshTable();
    }

    // 追加评分总和
    // ratingSum: 可选的评分总和，如果不提供则自动计算
    function appendRatingSummary(postBody, ratingSum = null) {
        // 如果没有提供评分总和，则计算
        if (ratingSum === null) {
            ratingSum = calculateRatingSum(postBody);
        }

        // 如果评分为0，不显示
        if (ratingSum === 0) {
            return;
        }

        const container = postBody.parentElement;
        if (!container) return;

        // 查找包含"[评分]"的 div
        const ratingDiv = Array.from(container.querySelectorAll('div')).find(div => {
            const text = div.textContent || '';
            return text.includes('[评分]');
        });

        if (!ratingDiv) {
            return;
        }

        // 检查是否已经存在评分总和，如果存在则先移除
        const existingSummary = ratingDiv.querySelector('.rating-summary');
        if (existingSummary) {
            existingSummary.remove();
        }

        const prefix = ratingSum > 0 ? '+' : '';
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'rating-summary';
        summaryDiv.style.cssText = `
            margin-top: 6px;
            font-size: 14px;
            font-weight: bold;
        `;
        summaryDiv.textContent = `评分总和：${prefix}${ratingSum}`;

        ratingDiv.appendChild(summaryDiv);
    }

    // 在toolbox中添加复制按钮
    function addCopyButtonsToToolbox() {
        if (!isViewTopicPage()) return;

        document.querySelectorAll('td.toolbox').forEach((toolbox) => {
            // 如果已经添加过按钮，跳过
            if (toolbox.querySelector('.copy-post-btn')) return;

            // 设置toolbox样式，支持左右布局
            let rightContainer = toolbox.querySelector('.toolbox-right');
            if (!toolbox.dataset.styleSet) {
                toolbox.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-align: left;
                    border: none !important;
                `;
                toolbox.dataset.styleSet = 'true';
                
                // 创建右侧容器，存放原有按钮
                if (!rightContainer) {
                    rightContainer = document.createElement('span');
                    rightContainer.className = 'toolbox-right';
                    rightContainer.style.cssText = 'margin-left: auto; text-align: right;';
                    
                    // 将原有内容移到右侧容器
                    const existingElements = Array.from(toolbox.children);
                    existingElements.forEach(element => {
                        rightContainer.appendChild(element);
                    });
                    
                    toolbox.appendChild(rightContainer);
                }
            }
            
            // 确保动态添加的引用按钮也在右侧容器中
            if (!rightContainer) {
                rightContainer = toolbox.querySelector('.toolbox-right');
            }
            if (rightContainer) {
                // 检查toolbox直接子元素中是否有非复制按钮的元素，移到右侧容器
                Array.from(toolbox.children).forEach(child => {
                    if (child.className !== 'toolbox-right' && 
                        !child.classList.contains('copy-post-btn') && 
                        !child.classList.contains('copy-paste-post-btn')) {
                        rightContainer.appendChild(child);
                    }
                });
            }

            // 查找对应的post body - 通过toolbox所在的table.main来查找
            let postBody = null;
            
            // 从toolbox向上查找table.main
            const mainTable = toolbox.closest('table.main');
            if (mainTable) {
                // 在table.main的第一行tr中查找div[id$="body"]
                const firstTr = mainTable.querySelector('tr');
                if (firstTr) {
                    postBody = firstTr.querySelector('div[id$="body"]');
                }
            }
            
            // 如果还没找到，尝试通过pid table查找
            if (!postBody) {
                // 向上查找包含pid的table
                let current = toolbox.parentElement;
                while (current && !postBody) {
                    const pidTable = current.querySelector('table[id^="pid"]') || 
                                    (current.tagName === 'TABLE' && current.id && current.id.match(/^pid/) ? current : null);
                    
                    if (pidTable && pidTable.id) {
                        const pidMatch = pidTable.id.match(/^pid(\d+)/);
                        if (pidMatch && pidMatch[1]) {
                            postBody = document.getElementById(`pid${pidMatch[1]}body`);
                        }
                    }
                    
                    if (!postBody) {
                        current = current.parentElement;
                        if (!current || current === document.body) break;
                    }
                }
            }
            
            if (!postBody) return;

            const content = postBody.innerText || postBody.textContent || '';

            // 创建"复制"按钮
            const copyLink = document.createElement('a');
            copyLink.href = '#';
            copyLink.className = 'copy-post-btn';
            copyLink.textContent = '复制';
            copyLink.style.cssText = `
                display: inline-block;
                margin-right: 8px;
                padding: 6px 12px;
                background: #2196F3;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                vertical-align: middle;
                line-height: 1.5;
                min-width: 60px;
                text-align: center;
            `;
            copyLink.onmouseover = function() {
                this.style.background = '#1976D2';
            };
            copyLink.onmouseout = function() {
                this.style.background = '#2196F3';
            };
            copyLink.onclick = (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(content).then(() => {
                    const originalText = copyLink.textContent;
                    copyLink.textContent = '已复制';
                    setTimeout(() => {
                        copyLink.textContent = originalText;
                    }, 1500);
                }).catch(() => alert('复制失败'));
            };

            // 创建"复制到快捷回复"按钮
            const copyPasteLink = document.createElement('a');
            copyPasteLink.href = '#';
            copyPasteLink.className = 'copy-paste-post-btn';
            copyPasteLink.textContent = '复制到快捷回复';
            copyPasteLink.style.cssText = `
                display: inline-block;
                margin-right: 8px;
                padding: 6px 12px;
                background: #2196F3;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                vertical-align: middle;
                line-height: 1.5;
                min-width: 120px;
                text-align: center;
            `;
            copyPasteLink.onmouseover = function() {
                this.style.background = '#1976D2';
            };
            copyPasteLink.onmouseout = function() {
                this.style.background = '#2196F3';
            };
            copyPasteLink.onclick = (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(content).then(() => {
                    // 打开快捷回复框
                    if (!isQuickReplyOpen) {
                        openQuickReply();
                    }
                    
                    // 等待快捷回复框加载后粘贴内容
                    setTimeout(() => {
                        const quickReplyTextarea = document.querySelector('#quick-reply-box textarea[name="body"]');
                        if (quickReplyTextarea) {
                            // 保存原始背景色
                            const originalBg = quickReplyTextarea.style.backgroundColor || '';
                            const originalTransition = quickReplyTextarea.style.transition || '';
                            
                            // 设置过渡效果
                            quickReplyTextarea.style.transition = 'background-color 0.3s ease';
                            
                            // 粘贴内容
                            quickReplyTextarea.value = content;
                            quickReplyTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                            
                            // // 背景色闪动效果：原始 -> 浅蓝 -> 原始，持续1秒
                            // quickReplyTextarea.style.backgroundColor = '#e3f2fd'; // 浅蓝色
                            // setTimeout(() => {
                            //     quickReplyTextarea.style.backgroundColor = originalBg;
                            //     // 恢复原始过渡设置
                            //     setTimeout(() => {
                            //         quickReplyTextarea.style.transition = originalTransition;
                            //     }, 300);
                            // }, 700); // 700ms后恢复，加上过渡时间300ms，总共约1秒

                            // 聚焦到回复框并设置光标位置
                            quickReplyTextarea.focus();
                            quickReplyTextarea.setSelectionRange(content.length, content.length);
                        }
                    }, 200);
                    
                    const originalText = copyPasteLink.textContent;
                    copyPasteLink.textContent = '已粘贴';
                    setTimeout(() => {
                        copyPasteLink.textContent = originalText;
                    }, 800);
                }).catch(() => alert('复制失败'));
            };

            // 插入到最左侧（在rightContainer之前）
            // 先插入"复制"，再插入"复制到快捷回复"，这样"复制"在左侧
            const insertBefore = toolbox.querySelector('.toolbox-right') || toolbox.firstChild;
            toolbox.insertBefore(copyLink, insertBefore);
            toolbox.insertBefore(copyPasteLink, insertBefore);
        });
    }

    // 全部标记为已读
    async function markAllMessagesAsRead() {
        try {
            // 访问未读消息页面（这个URL会直接显示所有未读消息）
            const baseUrl = `${window.location.origin}/messages.php`;
            const unreadMessagesBaseUrl = `${baseUrl}?action=viewmailbox&box=1&unread=yes`;
            
            // 显示加载提示
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'mark-all-read-loading';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(33, 150, 243, 0.9);
                color: white;
                padding: 20px 40px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10004;
                font-size: 16px;
                font-weight: bold;
            `;
            loadingDiv.textContent = '正在获取未读消息...';
            document.body.appendChild(loadingDiv);
            
            // 获取未读消息页面（第一页）
            const response = await fetch(unreadMessagesBaseUrl, {
                credentials: 'include',
                headers: { 'Accept': 'text/html' }
            });
            
            if (!response.ok) {
                loadingDiv.remove();
                alert('获取消息页面失败，请检查网络连接');
                return;
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 收集所有未读消息ID
            const messageIds = new Set();
            
            // 处理当前页面的checkbox
            const processPage = (pageDoc) => {
                const checkboxes = pageDoc.querySelectorAll('input[type="checkbox"][name="messages[]"]');
                checkboxes.forEach(checkbox => {
                    if (checkbox.value) {
                        messageIds.add(checkbox.value);
                    }
                });
            };
            
            processPage(doc);
            
            // 检查是否有分页，如果有则遍历所有分页
            const pageLinks = doc.querySelectorAll('a[href*="viewmailbox"][href*="unread=yes"]');
            const pageNumbers = new Set();
            pageNumbers.add(0); // 第一页已经处理
            
            pageLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                const match = href.match(/[?&]page=(\d+)/);
                if (match && match[1]) {
                    const pageNum = parseInt(match[1], 10);
                    if (!isNaN(pageNum)) {
                        pageNumbers.add(pageNum);
                    }
                }
            });
            
            // 处理其他分页
            if (pageNumbers.size > 1) {
                loadingDiv.textContent = `正在检查 ${pageNumbers.size} 页未读消息...`;
                for (const pageNum of pageNumbers) {
                    if (pageNum === 0) continue; // 第一页已经处理
                    
                    const pageUrl = `${unreadMessagesBaseUrl}&page=${pageNum}`;
                    try {
                        const pageResponse = await fetch(pageUrl, {
                            credentials: 'include',
                            headers: { 'Accept': 'text/html' }
                        });
                        
                        if (pageResponse.ok) {
                            const pageHtml = await pageResponse.text();
                            const pageDoc = parser.parseFromString(pageHtml, 'text/html');
                            processPage(pageDoc);
                        }
                    } catch (e) {
                        // 忽略单个页面的错误，继续处理其他页面
                        handleError(`处理未读消息第${pageNum}页`, e);
                    }
                }
            }
            
            if (messageIds.size === 0) {
                loadingDiv.textContent = '没有未读消息';
                loadingDiv.style.background = 'rgba(76, 175, 80, 0.9)';
                setTimeout(() => loadingDiv.remove(), 2000);
                return;
            }
            
            loadingDiv.textContent = `找到 ${messageIds.size} 条未读消息，正在标记为已读...`;
            
            // 构建表单数据（按照表单的实际结构）
            const formData = new FormData();
            formData.append('action', 'moveordel');
            formData.append('markread', '设为已读');
            // 添加所有消息的ID（全选）
            messageIds.forEach(id => {
                formData.append('messages[]', id);
            });
            
            // 提交表单（提交到 messages.php，不带查询参数）
            // 注意：即使 fetch 返回状态码 0 或抛出错误，表单实际上已经提交成功
            // 这是因为服务器已经处理了请求，只是响应可能因为重定向或 CORS 问题无法正确返回
            fetch(baseUrl, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                redirect: 'follow' // 自动跟随重定向
            }).catch(() => {
                // 忽略 fetch 错误，因为请求实际上已经发送成功
            });
            
            // 直接显示成功消息（因为表单提交后，服务器已经处理了请求）
            loadingDiv.textContent = `✓ 成功标记 ${messageIds.size} 条消息为已读`;
            loadingDiv.style.background = 'rgba(76, 175, 80, 0.9)';
            setTimeout(() => loadingDiv.remove(), 2000);
        } catch (error) {
            handleError('标记全部消息为已读', error);
            const loadingDiv = document.getElementById('mark-all-read-loading');
            if (loadingDiv) {
                loadingDiv.textContent = '✗ 操作失败：' + error.message;
                loadingDiv.style.background = 'rgba(244, 67, 54, 0.9)';
                setTimeout(() => loadingDiv.remove(), 3000);
            } else {
                alert('操作失败：' + error.message);
            }
        }
    }

    // 自动为所有帖子显示评分总和
    function autoDisplayRatingSummary() {
        if (!isViewTopicPage()) {
            return;
        }

        // 查找所有帖子body
        const postBodies = document.querySelectorAll('div[id^="pid"][id$="body"]');
        postBodies.forEach(postBody => {
            // 计算评分总和，如果不为0则显示（传入已计算的值避免重复计算）
            const ratingSum = calculateRatingSum(postBody);
            if (ratingSum !== 0) {
                appendRatingSummary(postBody, ratingSum);
            }
        });
    }

    // 检查指定topicid的帖子是否已下注（检查所有分页），同时收集特殊关注用户
    async function checkTopicBetStatus(topicid) {
        const currentUsername = getCurrentUsername();
        if (!currentUsername) {
            return { hasBet: false, followUsers: [] };
        }

        const followList = getSpecialFollowList();
        const followSet = new Set(followList);
        const foundUsers = new Set();

        // 构建基础URL
        const topicUrl = `${window.location.origin}/forums.php?action=viewtopic&topicid=${topicid}`;
        
        try {
            // 获取所有帖子数据
            const posts = await fetchTopicPostsData(topicUrl);
            
            // 检查当前用户是否已下注
            const hasBet = posts.some(post => post.username === currentUsername);
            
            // 收集特殊关注用户
            if (followSet.size > 0) {
                posts.forEach(post => {
                    if (followSet.has(post.username)) {
                        foundUsers.add(post.username);
                    }
                });
            }
            
            return { 
                hasBet, 
                followUsers: Array.from(foundUsers) 
            };
        } catch (error) {
            handleError(`检查topicid ${topicid}`, error);
            return { hasBet: false, followUsers: [] };
        }
    }

    // 在论坛列表页面标记每个帖子是否已下注
    async function markTopicBetStatus() {
        // 只在viewforum页面生效
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') !== 'viewforum') {
            return;
        }

        const currentUsername = getCurrentUsername();
        if (!currentUsername) {
            return;
        }

        // 排除的topicid列表（不检查这些帖子的用户名和下注状态）
        const excludedTopicIds = new Set(['35207', '35212', '43558', '3239']);

        // 查找所有帖子链接（主题链接，不是分页链接）
        // 主题链接通常包含forumid参数，或者不包含page参数
        const topicLinks = document.querySelectorAll('td.embedded a[href*="viewtopic"][href*="topicid="]');
        const topicMap = new Map(); // 用于去重，key是topicid，value是链接元素

        topicLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // 只处理主题链接（不包含page参数，且不是分页链接）
            // 分页链接通常格式是：?action=viewtopic&topicid=xxx&page=0
            // 主题链接通常格式是：?action=viewtopic&forumid=xx&topicid=xxx 或 ?action=viewtopic&topicid=xxx（没有page参数）
            if (href.includes('page=') || href.includes('page=p')) {
                return; // 跳过分页链接
            }

            // 提取topicid
            const match = href.match(/topicid=(\d+)/);
            if (match && match[1]) {
                const topicid = match[1];
                
                // 跳过排除列表中的topicid
                if (excludedTopicIds.has(topicid)) {
                    return;
                }
                
                // 每个topicid只保留第一个链接（避免重复检查）
                if (!topicMap.has(topicid)) {
                    topicMap.set(topicid, link);
                }
            }
        });


        // 对每个帖子检查是否已下注
        for (let [topicid, link] of topicMap) {
            // 检查是否已经添加过标记
            const parent = link.closest('td.embedded');
            if (!parent) continue;
            
            if (parent.querySelector('.bet-status-mark')) {
                continue; // 已经标记过，跳过
            }

            // 异步检查下注状态和特殊关注用户
            checkTopicBetStatus(topicid).then(({ hasBet, followUsers }) => {
                // 检查标记是否已存在（防止重复添加）
                if (parent.querySelector('.bet-status-mark')) {
                    return;
                }

                // 创建标记元素
                const mark = document.createElement('span');
                mark.className = 'bet-status-mark';
                mark.textContent = hasBet ? '【已下注】' : '【未下注】';
                mark.style.cssText = `
                    margin-left: 8px;
                    font-size: 12px;
                    font-weight: bold;
                    color: ${hasBet ? '#4caf50' : '#ff9800'};
                `;
                mark.title = hasBet ? '您已在此帖子下注' : '您尚未在此帖子下注';

                // 在链接后面插入标记
                // 如果链接后面有其他元素（如分页链接），插入到链接和分页链接之间
                link.parentNode.insertBefore(mark, link.nextSibling);
                
                // 如果有特殊关注用户回复，显示用户名列表
                if (followUsers && followUsers.length > 0) {
                    const followMark = document.createElement('span');
                    followMark.className = 'follow-users-mark';
                    followMark.textContent = ` [${followUsers.join('，')}]`;
                    followMark.style.cssText = `
                        margin-left: 4px;
                        font-size: 12px;
                        color: #2196F3;
                        font-weight: bold;
                    `;
                    followMark.title = '在此帖子回复过的特殊关注用户';
                    mark.parentNode.insertBefore(followMark, mark.nextSibling);
                }
            }).catch(err => {
                handleError(`检查topicid ${topicid} 下注状态`, err);
            });
        }
    }

    // 初始化
    /**
     * 初始化所有功能
     */
    function initializeFeatures() {
                // 重置第一楼跳过标志（页面初始化时）
                hasSkippedFirstFloor = false;
                
                createControlPanel();
                autoHighlightFollowedPosts();
                autoLoadNextPage();
                checkValidBetAndDisableReply().catch(err => {
            handleError('检查有效下注', err);
        });
        printBookmarkTopicIds();
        highlightTopicIdRows();
        markTopicBetStatus();
        renderSpecialFollowTiles();
        autoDisplayRatingSummary();
        delayExecute(() => addCopyButtonsToToolbox(), 500);
        
        // 在帖子页面预加载所有分页的数据（后台异步）
        if (isViewTopicPage()) {
            delayExecute(() => preloadCurrentTopicPostsData(), 1000);
        }
        
        // 使用MutationObserver监听动态加载的toolbox
        if (!window.toolboxObserver) {
            window.toolboxObserver = new MutationObserver(() => {
                addCopyButtonsToToolbox();
            });
            window.toolboxObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFeatures);
        } else {
            initializeFeatures();
        }
    }

    // 启动脚本
    init();
})();

