// ==UserScript==
// @name         Auto Read Nodeloc.com Ultra（自动阅读，点赞）
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  自动刷nodeloc.com文章
// @author       yuanly666
// @match        https://www.nodeloc.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=nodeloc.com
// @downloadURL https://update.greasyfork.org/scripts/562064/Auto%20Read%20Nodeloccom%20Ultra%EF%BC%88%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%EF%BC%8C%E7%82%B9%E8%B5%9E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562064/Auto%20Read%20Nodeloccom%20Ultra%EF%BC%88%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%EF%BC%8C%E7%82%B9%E8%B5%9E%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const config = {
        commentLimit: 1000,
        topicListLimit: 50,
        likeLimit: 50,
        defaultScrollSpeed: 40,
        minScrollSpeed: 1,
        maxScrollSpeed: 200,
        scrollStep: 1,
        scrollDelay: 30,
        checkDelay: 800,
        likeInterval: 2500,
        retryDelay: 3000,
        maxRetries: 3
    };

    // 站点匹配
    const possibleBaseURLs = [
        "https://www.nodeloc.com",
        "https://linux.do",
        "https://meta.discourse.org",
        "https://meta.appinn.net",
        "https://community.openai.com"
    ];

    // 获取当前BASE_URL
    const currentURL = window.location.href;
    let BASE_URL = possibleBaseURLs.find(url => currentURL.startsWith(url)) || possibleBaseURLs[0];

    // 初始化存储
    function initStorage() {
        if (GM_getValue("isFirstRun") === undefined) {
            GM_setValue("read", false);
            GM_setValue("autoLikeEnabled", false);
            GM_setValue("clickCounter", 0);
            GM_setValue("clickCounterTimestamp", Date.now());
            GM_setValue("scrollSpeed", config.defaultScrollSpeed);
            GM_setValue("isFirstRun", false);
            GM_setValue("topicList", JSON.stringify([]));
            GM_setValue("latestPage", 0);
        }

        // 每日重置计数器
        const currentTime = Date.now();
        const storedTime = GM_getValue("clickCounterTimestamp") || new Date("1999-01-01T00:00:00Z").getTime();

        if (currentTime - storedTime > 24 * 60 * 60 * 1000) {
            GM_setValue("clickCounter", 0);
            GM_setValue("clickCounterTimestamp", currentTime);
        }
    }

    // 创建UI面板 - 确保显示的版本
    function createUIPanel() {
        // 先移除可能存在的旧元素
        removeExistingElements();

        // 添加确保显示的全局样式
        GM_addStyle(`
            #autoReadPanel {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                position: fixed !important;
                bottom: 30px !important;
                left: 30px !important;
                z-index: 2147483647 !important;
                background: rgba(255, 255, 255, 0.98) !important;
                border-radius: 16px !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
                padding: 20px !important;
                width: 320px !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                border: 1px solid rgba(0, 0, 0, 0.08) !important;
                backdrop-filter: blur(10px) !important;
                transform: none !important;
            }

            #autoReadPanel.minimized {
                width: 50px !important;
                height: 50px !important;
                padding: 0 !important;
                overflow: hidden !important;
            }

            #autoReadPanel.minimized .panel-body {
                display: none !important;
            }

            #showPanelBtn {
                display: flex !important;
                position: fixed !important;
                bottom: 20px !important;
                left: 20px !important;
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border: none !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
                cursor: pointer !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                z-index: 2147483646 !important;
            }
        `);

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'autoReadPanel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3 class="panel-title">
                    <span class="status-indicator ${GM_getValue("read") ? 'status-active' : 'status-inactive'}"></span>
                    <span>自动阅读控制</span>
                </h3>
                <div class="panel-controls">
                    <button class="panel-btn minimize-btn" title="最小化">−</button>
                    <button class="panel-btn close-btn" title="隐藏面板">×</button>
                </div>
            </div>
            <div class="panel-body">
                <div class="control-group">
                    <div class="btn-group">
                        <button id="toggleReadBtn" class="btn btn-primary">
                            ${GM_getValue("read") ? '停止阅读' : '开始阅读'}
                        </button>
                        <button id="toggleSpeedControlBtn" class="btn btn-icon btn-secondary" title="速度设置">
                            ⚙️
                        </button>
                    </div>
                </div>

                <div class="speed-control" id="speedControl">
                    <div class="progress-label">
                        <span>滚动速度控制</span>
                        <span class="speed-value" id="speedValueDisplay">${GM_getValue("scrollSpeed") || config.defaultScrollSpeed}</span>
                    </div>
                    <div class="speed-slider-container">
                        <span style="color: #718096; font-size: 12px;">1</span>
                        <input type="range" min="${config.minScrollSpeed}" max="${config.maxScrollSpeed}"
                               value="${GM_getValue("scrollSpeed") || config.defaultScrollSpeed}"
                               step="${config.scrollStep}"
                               class="speed-slider" id="speedSlider">
                        <span style="color: #718096; font-size: 12px;">200</span>
                    </div>
                    <div class="speed-labels">
                        <span>超慢</span>
                        <span>慢</span>
                        <span>中</span>
                        <span>快</span>
                        <span>超快</span>
                    </div>
                    <div class="speed-presets">
                        <button class="speed-preset-btn" data-speed="10">慢速 (10)</button>
                        <button class="speed-preset-btn" data-speed="40">中速 (40)</button>
                        <button class="speed-preset-btn" data-speed="80">快速 (80)</button>
                        <button class="speed-preset-btn" data-speed="150">极速 (150)</button>
                    </div>
                </div>

                <div class="control-group">
                    <button id="toggleLikeBtn" class="btn btn-secondary" style="width: 100%;">
                        ${GM_getValue("autoLikeEnabled") ? '禁用自动点赞' : '启用自动点赞'}
                    </button>
                </div>

                <div class="progress-container" id="likeProgressContainer" style="${GM_getValue("autoLikeEnabled") ? '' : 'display: none;'}">
                    <div class="progress-label">
                        <span>今日点赞进度</span>
                        <span id="likeProgressText">${GM_getValue("clickCounter") || 0}/${config.likeLimit}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="likeProgressFill"
                             style="width: ${(GM_getValue("clickCounter") || 0) / config.likeLimit * 100}%"></div>
                    </div>
                </div>

                <div class="stats">
                    <div>
                        <span class="site-indicator" style="background-color: ${getSiteColor(BASE_URL)}"></span>
                        <span>当前站点: ${BASE_URL.replace('https://', '')}</span>
                    </div>
                    <div id="pageStatus">准备就绪</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 创建显示面板的浮动按钮
        const showPanelBtn = document.createElement('button');
        showPanelBtn.id = 'showPanelBtn';
        showPanelBtn.innerHTML = '⚙️';
        showPanelBtn.style.display = 'none';
        document.body.appendChild(showPanelBtn);

        // 添加拖拽功能
        makeDraggable(panel);

        // 添加事件监听器
        panel.querySelector('.minimize-btn').addEventListener('click', () => {
            panel.classList.toggle('minimized');
        });

        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
            showPanelBtn.style.display = 'flex';
        });

        showPanelBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            showPanelBtn.style.display = 'none';
        });

        document.getElementById('toggleReadBtn').addEventListener('click', toggleRead);
        document.getElementById('toggleLikeBtn').addEventListener('click', toggleAutoLike);

        document.getElementById('toggleSpeedControlBtn').addEventListener('click', () => {
            const speedControl = document.getElementById('speedControl');
            speedControl.classList.toggle('active');
        });

        const speedSlider = document.getElementById('speedSlider');
        const speedValueDisplay = document.getElementById('speedValueDisplay');
        speedSlider.addEventListener('input', () => {
            const speed = parseInt(speedSlider.value);
            speedValueDisplay.textContent = speed;
            GM_setValue("scrollSpeed", speed);
            updatePresetHighlight(speed);

            if (GM_getValue("read") && scrollInterval) {
                stopScrolling();
                startScrolling();
            }

            updateStatus(`滚动速度已设置为: ${speed}`);
        });

        document.querySelectorAll('.speed-preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const speed = parseInt(this.dataset.speed);
                document.getElementById('speedSlider').value = speed;
                document.getElementById('speedValueDisplay').textContent = speed;
                GM_setValue("scrollSpeed", speed);
                const event = new Event('input', { bubbles: true });
                document.getElementById('speedSlider').dispatchEvent(event);
                updateStatus(`已设置预设速度: ${speed}`);
            });
        });

        const currentSpeed = GM_getValue("scrollSpeed") || config.defaultScrollSpeed;
        updatePresetHighlight(currentSpeed);

        // 确保面板显示在最前面
        panel.style.zIndex = '2147483647';
    }

    function removeExistingElements() {
        const elements = [
            '#autoReadPanel',
            '#showPanelBtn',
            'style[data-auto-read-style]'
        ].forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.remove();
        });
    }

    function updatePresetHighlight(speed) {
        const presets = [10, 40, 80, 150];
        const closestPreset = presets.reduce((prev, curr) =>
            Math.abs(curr - speed) < Math.abs(prev - speed) ? curr : prev
        );
        document.querySelectorAll('.speed-preset-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.speed) === closestPreset);
        });
    }

    function getSiteColor(url) {
        const colors = {
            'www.nodeloc.com': '#FF6B6B',
            'linux.do': '#4ECDC4',
            'meta.discourse.org': '#45B7D1',
            'meta.appinn.net': '#FFA07A',
            'community.openai.com': '#9B59B6'
        };
        return colors[url.replace('https://', '')] || '#95a5a6';
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.panel-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function toggleRead() {
        const currentlyReading = GM_getValue("read");
        const newReadState = !currentlyReading;
        GM_setValue("read", newReadState);

        const btn = document.getElementById('toggleReadBtn');
        const statusIndicator = document.querySelector('.panel-header .status-indicator');

        btn.textContent = newReadState ? '停止阅读' : '开始阅读';
        statusIndicator.className = `status-indicator ${newReadState ? 'status-active' : 'status-inactive'}`;

        updateStatus(newReadState ? '自动阅读已启动' : '自动阅读已停止');

        if (!newReadState) {
            stopScrolling();
        } else {
            if (BASE_URL == "https://www.nodeloc.com") {
                window.location.href = "https://www.nodeloc.com/t/topic/54798/1";
            } else {
                window.location.href = `${BASE_URL}/latest`;
            }
            startScrolling();
        }
    }

    function toggleAutoLike() {
        const currentlyEnabled = GM_getValue("autoLikeEnabled");
        const newEnabledState = !currentlyEnabled;
        GM_setValue("autoLikeEnabled", newEnabledState);

        const btn = document.getElementById('toggleLikeBtn');
        const progressContainer = document.getElementById('likeProgressContainer');

        btn.textContent = newEnabledState ? '禁用自动点赞' : '启用自动点赞';
        progressContainer.style.display = newEnabledState ? 'block' : 'none';

        updateStatus(newEnabledState ? '自动点赞已启用' : '自动点赞已禁用');

        if (newEnabledState) {
            autoLike();
        } else {
            stopAutoLike();
        }
    }

    function updateStatus(message) {
        const statusElement = document.getElementById('pageStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    let scrollInterval = null;
    let checkScrollTimeout = null;
    let autoLikeInterval = null;

    function startScrolling() {
        if (scrollInterval) clearInterval(scrollInterval);

        const speed = GM_getValue("scrollSpeed") || config.defaultScrollSpeed;

        scrollInterval = setInterval(() => {
            window.scrollBy(0, speed);
        }, config.scrollDelay);

        checkScroll();
    }

    function stopScrolling() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        if (checkScrollTimeout) {
            clearTimeout(checkScrollTimeout);
            checkScrollTimeout = null;
        }
    }

    function checkScroll() {
        if (!GM_getValue("read")) return;

        const isAtBottom = () => {
            const scrollPosition = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            return (windowHeight + scrollPosition >= documentHeight - 100) ||
                   (documentHeight <= windowHeight + 200);
        };

        if (isAtBottom()) {
            updateStatus('已到达页面底部，正在准备下一篇文章...');
            stopScrolling();

            setTimeout(async () => {
                const success = await openNewTopic();
                if (!success) {
                    updateStatus('获取新文章失败，3秒后重试...');
                    setTimeout(checkScroll, config.retryDelay);
                }
            }, 500);
        } else {
            if (checkScrollTimeout) clearTimeout(checkScrollTimeout);
            checkScrollTimeout = setTimeout(checkScroll, config.checkDelay);
        }
    }

    async function openNewTopic() {
        try {
            let topicList = JSON.parse(GM_getValue("topicList") || "[]");

            if (topicList.length === 0) {
                updateStatus('正在获取最新文章列表...');
                await getLatestTopic();
                topicList = JSON.parse(GM_getValue("topicList") || "[]");

                if (topicList.length === 0) {
                    updateStatus('没有可用的新文章');
                    return false;
                }
            }

            const topic = topicList.shift();
            GM_setValue("topicList", JSON.stringify(topicList));

            const topicUrl = topic.last_read_post_number
                ? `${BASE_URL}/t/${topic.slug || 'topic'}/${topic.id}/${topic.last_read_post_number}`
                : `${BASE_URL}/t/${topic.slug || 'topic'}/${topic.id}`;

            window.location.href = topicUrl;
            return true;
        } catch (error) {
            console.error('跳转失败:', error);
            updateStatus('跳转出错: ' + error.message);
            return false;
        }
    }

    async function getLatestTopic() {
        return new Promise((resolve) => {
            let latestPage = parseInt(GM_getValue("latestPage") || 0);
            let topicList = [];
            let isDataSufficient = false;
            let retryCount = 0;

            const fetchPage = () => {
                latestPage++;
                const url = `${BASE_URL}/latest.json?no_definitions=true&page=${latestPage}`;

                $.ajax({
                    url: url,
                    success: function(result) {
                        if (result?.topic_list?.topics?.length > 0) {
                            result.topic_list.topics.forEach(topic => {
                                if (config.commentLimit > topic.posts_count) {
                                    topicList.push(topic);
                                }
                            });

                            if (topicList.length >= config.topicListLimit) {
                                isDataSufficient = true;
                            }
                        }

                        if (isDataSufficient || !result?.topic_list?.topics?.length) {
                            GM_setValue("topicList", JSON.stringify(topicList));
                            GM_setValue("latestPage", latestPage);
                            resolve();
                        } else {
                            fetchPage();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('获取话题列表失败:', status, error);
                        if (retryCount < config.maxRetries) {
                            retryCount++;
                            updateStatus(`获取列表失败，第${retryCount}次重试...`);
                            setTimeout(fetchPage, config.retryDelay);
                        } else {
                            GM_setValue("topicList", JSON.stringify(topicList));
                            resolve();
                        }
                    }
                });
            };

            fetchPage();
        });
    }

    function autoLike() {
        const clickCounter = GM_getValue("clickCounter") || 0;
        if (clickCounter >= config.likeLimit) {
            updateStatus(`今日点赞已达上限 (${config.likeLimit})`);
            GM_setValue("autoLikeEnabled", false);
            document.getElementById('toggleLikeBtn').textContent = '启用自动点赞';
            document.getElementById('likeProgressContainer').style.display = 'none';
            return;
        }

        const buttons = document.querySelectorAll('.discourse-reactions-reaction-button, .like-button');
        if (buttons.length === 0) {
            updateStatus('未找到点赞按钮，5秒后重试...');
            setTimeout(autoLike, 5000);
            return;
        }

        let likesPerformed = 0;

        buttons.forEach((button, index) => {
            if ((button.title !== "点赞此帖子" &&
                 button.title !== "Like this post" &&
                 !button.classList.contains('like-button')) ||
                (GM_getValue("clickCounter") || 0) >= config.likeLimit) {
                return;
            }

            setTimeout(() => {
                if ((GM_getValue("clickCounter") || 0) >= config.likeLimit) return;

                try {
                    button.click();
                    likesPerformed++;
                    const newCount = (GM_getValue("clickCounter") || 0) + 1;
                    GM_setValue("clickCounter", newCount);

                    const progressText = document.getElementById('likeProgressText');
                    const progressFill = document.getElementById('likeProgressFill');
                    if (progressText && progressFill) {
                        progressText.textContent = `${newCount}/${config.likeLimit}`;
                        progressFill.style.width = `${(newCount / config.likeLimit) * 100}%`;
                    }

                    updateStatus(`已点赞 ${likesPerformed}/${buttons.length} 个按钮 (今日 ${newCount}/${config.likeLimit})`);

                    if (newCount >= config.likeLimit) {
                        updateStatus(`今日点赞已达上限 (${config.likeLimit})`);
                        GM_setValue("autoLikeEnabled", false);
                        document.getElementById('toggleLikeBtn').textContent = '启用自动点赞';
                        document.getElementById('likeProgressContainer').style.display = 'none';
                    }
                } catch (error) {
                    console.error('点赞失败:', error);
                }
            }, index * config.likeInterval);
        });
    }

    function stopAutoLike() {
        if (autoLikeInterval) {
            clearTimeout(autoLikeInterval);
            autoLikeInterval = null;
        }
    }

    function init() {
        initStorage();
        createUIPanel();

        if (GM_getValue("read")) {
            startScrolling();
        }

        if (GM_getValue("autoLikeEnabled")) {
            autoLike();
        }
    }

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('打开控制面板', () => {
            const panel = document.getElementById('autoReadPanel');
            if (panel) {
                panel.style.display = 'block';
                document.getElementById('showPanelBtn').style.display = 'none';
            }
        });

        GM_registerMenuCommand('重置点赞计数器', () => {
            GM_setValue("clickCounter", 0);
            GM_setValue("clickCounterTimestamp", Date.now());
            updateStatus('点赞计数器已重置');

            const progressText = document.getElementById('likeProgressText');
            const progressFill = document.getElementById('likeProgressFill');
            if (progressText && progressFill) {
                progressText.textContent = `0/${config.likeLimit}`;
                progressFill.style.width = '0%';
            }
        });
    }

    // 确保脚本在页面完全加载后运行
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        // 双重保险
        setTimeout(init, 2000);
    }

    // 额外检查：5秒后如果面板仍未显示，强制显示
    setTimeout(() => {
        if (!document.getElementById('autoReadPanel')) {
            console.warn('面板未正常加载，正在强制创建...');
            createUIPanel();
        }
    }, 5000);
})();