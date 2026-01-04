// ==UserScript==
// @name         知识星球吖
// @namespace    https://axutongxue.com/
// @version      3.4
// @license      MIT
// @description  1. 去水印；2. 自动展开；3. 点击复制；4. 自动刷新）；5. 界面美化
// @author       kejin——公众号：懒人股选
// @match        *://wx.zsxq.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553156/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%90%96.user.js
// @updateURL https://update.greasyfork.org/scripts/553156/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%90%96.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /* ************** 样式注入 ************** */
    // 添加自定义样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(`
            .group-list-container {
                transition: transform 0.2s ease-out;
                background: #fff;
                z-index: 10;
            }
            #toggle-sidebar {
                height: 20px;
                font-size: 12px;
                margin-left: 10px;
                padding: 0px 6px;
                border-radius: 4px;
                cursor: pointer;
                color: rgb(80, 234, 203);
                background-color: rgba(52, 146, 112, 0.05);
                border: 1px solid rgba(65,183,140,.2);
            }
            #toggle-sidebar:hover {
                background-color: #e0e0e0;
            }
            #auto-refresh-control {
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                padding: 6px 10px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
            }
            .control-item {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .control-divider {
                width: 1px;
                height: 16px;
                background: #e0e0e0;
            }
            #toggle-sidebar-btn {
                height: 24px;
                font-size: 12px;
                padding: 0px 10px;
                border-radius: 4px;
                cursor: pointer;
                color: #FFFFFF;
                background-color: rgb(22, 185, 152);
                border: none;
                transition: all 0.2s;
            }
            #toggle-sidebar-btn:hover {
                background-color: rgb(18, 165, 135);
            }
            #auto-refresh-toggle.active {
                background: #EF97AF;
            }
            #refresh-countdown {
                color: #666;
                font-size: 12px;
                min-width: 40px;
                text-align: right;
            }
            #auto-refresh-toggle.active {
                background: #EF97AF;
            }
            #refresh-countdown {
                color: #666;
                font-size: 12px;
                min-width: 45px;
                text-align: right;
            }
            #auto-refresh-toggle {
                position: relative;
                width: 40px;
                height: 20px;
                background: #ccc;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.3s;
            }
            #auto-refresh-toggle.active {
                background: rgb(22, 185, 152);
            }
            #auto-refresh-toggle::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
            }
            #auto-refresh-toggle.active::after {
                transform: translateX(20px);
            }
            #refresh-countdown {
                color: #666;
                font-size: 12px;
                min-width: 80px;
            }
        `);
    } else {
        // 如果 GM_addStyle 不可用，使用传统方式
        const style = document.createElement('style');
        style.textContent = `
            .group-list-container {
                transition: transform 0.2s ease-out;
                background: #fff;
                z-index: 10;
            }
            #toggle-sidebar {
                height: 20px;
                font-size: 12px;
                margin-left: 10px;
                padding: 0px 6px;
                border-radius: 4px;
                cursor: pointer;
                color: rgb(80, 234, 203);
                background-color: rgba(52, 146, 112, 0.05);
                border: 1px solid rgba(65,183,140,.2);
            }
            #toggle-sidebar:hover {
                background-color: #e0e0e0;
            }
            #auto-refresh-control {
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                padding: 10px 15px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 15px;
                font-size: 13px;
            }
            .control-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .control-divider {
                width: 1px;
                height: 20px;
                background: #e0e0e0;
            }
            #toggle-sidebar-btn {
                height: 24px;
                font-size: 12px;
                padding: 0px 10px;
                border-radius: 4px;
                cursor: pointer;
                color: rgb(80, 234, 203);
                background-color: rgba(52, 146, 112, 0.05);
                border: 1px solid rgba(65,183,140,.2);
                transition: background-color 0.2s;
            }
            #toggle-sidebar-btn:hover {
                background-color: rgba(52, 146, 112, 0.1);
            }
            #auto-refresh-toggle {
                position: relative;
                width: 40px;
                height: 20px;
                background: #ccc;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.3s;
            }
            #auto-refresh-toggle.active {
                background: rgb(80, 234, 203);
            }
            #auto-refresh-toggle::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
            }
            #auto-refresh-toggle.active::after {
                transform: translateX(20px);
            }
            #refresh-countdown {
                color: #666;
                font-size: 12px;
                min-width: 80px;
            }
        `;
        document.head.appendChild(style);
    }

    /* ************** 通用工具 ************** */
    function waitForKeyElements(selectorOrFunction, callback, waitOnce = true, interval = 300, maxIntervals = -1) {
        const select = () => (typeof selectorOrFunction === 'function' ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction));
        const tick = () => {
            const nodes = select();
            if (nodes.length) {
                nodes.forEach(n => {
                    if (n.dataset.alreadyFound) return;
                    const cancel = callback(n);
                    if (!cancel) n.dataset.alreadyFound = '1';
                });
            }
            if (--maxIntervals !== 0 && !(waitOnce && nodes.length)) {
                setTimeout(tick, interval);
            }
        };
        tick();
    }

    /* ************** 1. 解除复制限制 ************** */
    waitForKeyElements('.disabled-copy', el => el.classList.remove('disabled-copy'), false, 1000);
    waitForKeyElements('[watermark]', el => el.setAttribute('style', 'padding:10px;'), false, 1000);

    /* ************** 2. 帖子自动展开 ************** */
    const processed = new WeakSet();
    function smartClick(btn) {
        if (!btn || processed.has(btn)) return;
        const txt = btn.textContent.trim();
        if (!/展[开示]/.test(txt)) return;

        // 尝试多种点击方式
        try {
            btn.click(); // 原生点击
        } catch (e) {
            btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
        processed.add(btn);
    }

    function expandAll() {
        // 扩展选择器，覆盖更多可能的展开按钮
        const selectors = [
            'p.showAll',
            'button.showAll',
            'span.showAll',
            '[class*="showAll"]',
            '[class*="show-all"]',
            '[class*="展开"]',
            'button:not([data-expanded])',
            'span:not([data-expanded])',
            'p:not([data-expanded])'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const text = el.textContent.trim();
                if (/展[开示]|show\s*all|show\s*more/i.test(text)) {
                    smartClick(el);
                }
            });
        });
    }

    // 首次+动态
    let expandObserver = null;
    window.addEventListener('load', () => {
        // 立即执行一次
        expandAll();

        // 延迟执行确保DOM完全加载
        setTimeout(expandAll, 500);
        setTimeout(expandAll, 1000);
        setTimeout(expandAll, 2000);

        // 监听DOM变化
        if (expandObserver) expandObserver.disconnect();
        expandObserver = new MutationObserver(() => {
            expandAll();
        });
        expandObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        window.addEventListener('hashchange', expandAll);

        // 滚动时也尝试展开
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(expandAll, 300);
        }, { passive: true });
    });

    /* ************** 3. 点击时间复制帖子内容 ************** */
    const timeClickProcessed = new WeakSet();

    function findPostContent(timeElement) {
        // 向上查找帖子容器
        let container = timeElement.closest('[class*="topic"], [class*="post"], [class*="feed-item"]');
        if (!container) {
            container = timeElement.closest('div[class*="item"]');
        }

        if (!container) return null;

        // 查找内容区域（尝试多种可能的选择器）
        const contentSelectors = [
            '.content',
            '[class*="content"]',
            '.text',
            '[class*="text"]',
            '.description',
            '[class*="description"]'
        ];

        for (const selector of contentSelectors) {
            const content = container.querySelector(selector);
            if (content && content.textContent.trim()) {
                return content.textContent.trim();
            }
        }

        return null;
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyTip('复制成功！');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopyTip('复制成功！');
        } catch (err) {
            showCopyTip('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }

    function showCopyTip(message) {
        const tip = document.createElement('div');
        tip.textContent = message;
        tip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
    }

    function addTimeClickListener(timeElement) {
        if (timeClickProcessed.has(timeElement)) return;

        // 添加样式提示可点击
        timeElement.style.cursor = 'pointer';
        timeElement.title = '点击复制帖子内容';

        timeElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const content = findPostContent(timeElement);
            if (content) {
                copyToClipboard(content);
            } else {
                showCopyTip('未找到帖子内容');
            }
        });

        timeClickProcessed.add(timeElement);
    }

    // 监听时间元素（尝试多种可能的选择器）
    function attachTimeListeners() {
        const timeSelectors = [
            '[class*="time"]',
            '[class*="date"]',
            'time',
            'span[title*="202"]', // 匹配包含年份的时间
        ];

        timeSelectors.forEach(selector => {
            waitForKeyElements(selector, (el) => {
                // 检查是否是时间格式
                const text = el.textContent.trim();
                if (/\d{4}-\d{2}-\d{2}/.test(text) || /\d{2}:\d{2}/.test(text)) {
                    addTimeClickListener(el);
                }
            }, false, 1000);
        });
    }

    // 启动时间点击监听
    window.addEventListener('load', () => {
        attachTimeListeners();
    });

    /* ************** 4. 自动刷新功能（3分钟） ************** */
    let refreshTimer = null;
    let countdownInterval = null;
    let isAutoRefreshEnabled = localStorage.getItem('autoRefreshEnabled') !== 'false'; // 默认开启
    const REFRESH_INTERVAL = 180000; // 3分钟 = 180秒 = 180000毫秒
    let remainingTime = REFRESH_INTERVAL;

    // 创建控制面板
    function createRefreshControl() {
        const controlDiv = document.createElement('div');
        controlDiv.id = 'auto-refresh-control';
        controlDiv.innerHTML = `
            <button id="toggle-sidebar-btn">切换目录</button>
            <div class="control-divider"></div>
            <div class="control-item">
                <span>自动刷新</span>
                <div id="auto-refresh-toggle" class="${isAutoRefreshEnabled ? 'active' : ''}"></div>
                <span id="refresh-countdown"></span>
            </div>
        `;
        document.body.appendChild(controlDiv);

        const toggle = document.getElementById('auto-refresh-toggle');
        const countdown = document.getElementById('refresh-countdown');

        // 切换开关
        toggle.addEventListener('click', () => {
            isAutoRefreshEnabled = !isAutoRefreshEnabled;
            localStorage.setItem('autoRefreshEnabled', isAutoRefreshEnabled);
            toggle.classList.toggle('active');

            if (isAutoRefreshEnabled) {
                startAutoRefresh();
                console.log('自动刷新已启用：每3分钟刷新一次');
            } else {
                stopAutoRefresh();
                countdown.textContent = '已禁用';
                console.log('自动刷新已禁用');
            }
        });

        return countdown;
    }

    // 格式化时间显示
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // 更新倒计时显示
    function updateCountdown(countdownElement) {
        if (!isAutoRefreshEnabled) {
            countdownElement.textContent = '已禁用';
            return;
        }
        countdownElement.textContent = formatTime(remainingTime);
    }

    // 启动自动刷新
    function startAutoRefresh() {
        stopAutoRefresh(); // 先清除旧的定时器

        remainingTime = REFRESH_INTERVAL;
        const countdownElement = document.getElementById('refresh-countdown');

        // 更新倒计时（每秒更新一次）
        countdownInterval = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                remainingTime = 0;
            }
            updateCountdown(countdownElement);
        }, 1000);

        // 设置刷新定时器
        refreshTimer = setTimeout(() => {
            console.log('3分钟到，刷新页面');
            location.reload();
        }, REFRESH_INTERVAL);

        updateCountdown(countdownElement);
    }

    // 停止自动刷新
    function stopAutoRefresh() {
        if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    // 页面加载后初始化
    window.addEventListener('load', () => {
        setTimeout(() => {
            const countdownElement = createRefreshControl();

            if (isAutoRefreshEnabled) {
                startAutoRefresh();
                console.log('自动刷新功能已启动：每3分钟刷新一次');
            } else {
                updateCountdown(countdownElement);
                console.log('自动刷新功能已禁用（可通过右上角开关启用）');
            }
        }, 500);
    });

    /* ************** 5. 界面优化功能 ************** */

    // 5.1 为精华帖添加红色边框
    function addRedBorder() {
        const listItems = document.querySelectorAll('.ng-star-inserted');
        listItems.forEach((item) => {
            const headerContainer = item.querySelector('.header-container');
            if (headerContainer) {
                const topicFlag = headerContainer.querySelector('.topic-flag');
                if (topicFlag) {
                    const digestElement = topicFlag.querySelector('.digest');
                    if (digestElement) {
                        const topicContainer = item.querySelector('.topic-container');
                        if (topicContainer) {
                            topicContainer.style.border = '1px solid rgb(80, 234, 203)';
                            topicContainer.style.backgroundColor = 'rgba(80, 234, 203, 0.1)';
                        }
                    }
                }
            }
        });
    }

    // 5.2 设置侧边栏切换功能
    function setupSidebarToggle() {
        const sidebar = document.querySelector('.group-list-container');
        if (!sidebar) return;

        // 动态计算侧边栏宽度和隐藏位置
        function calculateHidePosition() {
            const sidebarWidth = sidebar.offsetWidth || 240; // 获取实际宽度，默认240px
            return sidebarWidth + 10; // 额外加10px确保完全隐藏
        }

        // 初始化侧边栏状态（从localStorage读取，默认显示）
        const isHidden = localStorage.getItem('sidebarHidden') === 'true';

        function updateSidebarPosition(hide) {
            const hideDistance = calculateHidePosition();
            if (hide) {
                sidebar.classList.add('hide');
                sidebar.style.transform = `translateX(-${hideDistance}px)`;
                sidebar.style.transition = 'transform 0.2s ease-out';
            } else {
                sidebar.classList.remove('hide');
                sidebar.style.transform = 'translateX(0)';
                sidebar.style.transition = 'transform 0.2s ease-out';
            }
        }

        // 设置初始状态
        updateSidebarPosition(isHidden);

        // 绑定到右上角按钮
        const toggleButton = document.getElementById('toggle-sidebar-btn');
        if (toggleButton && !toggleButton.dataset.bound) {
            toggleButton.dataset.bound = 'true';
            toggleButton.addEventListener('click', () => {
                const willHide = !sidebar.classList.contains('hide');
                updateSidebarPosition(willHide);
                localStorage.setItem('sidebarHidden', willHide);
            });
        }

        // 监听窗口大小变化，重新计算隐藏位置
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (sidebar.classList.contains('hide')) {
                    updateSidebarPosition(true);
                }
            }, 100);
        });
    }

    // 5.3 隐藏不必要的界面元素
    function hideElements() {
        // 头部
        const headerContainer = document.querySelector('.header-container');

        if (headerContainer) {
            const redirect = headerContainer.querySelector('.redirect');
            const userAvatar = headerContainer.querySelector('.user-avatar');

            if (redirect) {
                redirect.style.display = 'none';
            }
            if (userAvatar) {
                userAvatar.style.display = 'none';
            }
        }

        const leftLogo = document.querySelector('.logo-container .left');
        const noteLogo = document.querySelector('.logo-container .note');
        if (leftLogo) {
            leftLogo.style.display = 'none';
        }
        if (noteLogo) {
            noteLogo.style.display = 'none';
        }

        // .topic-flow-container - 让内容区域自适应宽度
        const topicFlowContainer = document.querySelector('.topic-flow-container');
        if (topicFlowContainer) {
            topicFlowContainer.style.setProperty('width', '100%', 'important');
            topicFlowContainer.style.setProperty('max-width', '100%', 'important');
            topicFlowContainer.style.setProperty('padding-left', '20px', 'important');
            topicFlowContainer.style.setProperty('padding-right', '20px', 'important');
        }

        // 主体上部分
        const topicContainer = document.querySelector('.topic-container');
        if (topicContainer) {
            const ngStarInserted = topicContainer.querySelector('.ng-star-inserted');
            if (ngStarInserted) {
                ngStarInserted.style.display = 'none';
            }
        }

        // 主体中部分 - 移除固定边距，改为自适应
        const mainContentContainer = document.querySelector('.main-content-container');
        if (mainContentContainer) {
            mainContentContainer.style.setProperty('margin-left', '0', 'important');
            mainContentContainer.style.setProperty('margin-right', '0', 'important');
            mainContentContainer.style.setProperty('max-width', '100%', 'important');
            mainContentContainer.style.setProperty('width', '100%', 'important');
        }

        // 右侧边栏
        const groupPreviewContainer = document.querySelector('.group-preview-container');
        if (groupPreviewContainer) {
            groupPreviewContainer.style.display = 'none';
        }

        // 确保内容列表也是全宽
        const topicList = document.querySelector('.topic-list');
        if (topicList) {
            topicList.style.setProperty('max-width', '100%', 'important');
            topicList.style.setProperty('width', '100%', 'important');
        }

        // 移除可能限制宽度的容器
        const containers = document.querySelectorAll('[class*="container"]');
        containers.forEach(container => {
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.maxWidth && computedStyle.maxWidth !== 'none') {
                container.style.setProperty('max-width', '100%', 'important');
            }
        });
    }

    // 5.4 启动界面优化功能
    function initUIEnhancements() {
        addRedBorder();
        setupSidebarToggle();
        hideElements();

        // 监听DOM变化，持续应用样式
        const observer = new MutationObserver(() => {
            addRedBorder();
            setupSidebarToggle();
            hideElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 页面加载完成后执行界面优化
    window.addEventListener('load', () => {
        setTimeout(initUIEnhancements, 500);
    });
})();