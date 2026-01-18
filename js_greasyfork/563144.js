// ==UserScript==
// @name        CG分享网美化显示时间
// @namespace   http://tampermonkey.net/
// @version     5.1
// @description 修复CG分享网显示问题并添加时间筛选面板，包含任务状态监测功能
// @author      nbw88888-creator
// @match       *://www.cgfxw.com/*
// @match       *://cgfxw.com/*
// @icon        https://www.cgfxw.com/favicon.ico
// @icon64      https://www.cgfxw.com/favicon.ico
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/563144/CG%E5%88%86%E4%BA%AB%E7%BD%91%E7%BE%8E%E5%8C%96%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/563144/CG%E5%88%86%E4%BA%AB%E7%BD%91%E7%BE%8E%E5%8C%96%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'cgfxw_enhancement_config';
    const TASK_STATUS_KEY = 'cgfxw_task_status';
    const LAST_CHECK_KEY = 'cgfxw_last_check';

    const defaultConfig = {
        enabled: true,
        timeColors: true,
        authorStyles: true,
        replyCount: true,
        taskButtonEnabled: false,
        paginationStyles: true
    };

    const TASK_CONFIG = {
        INITIAL_DELAY: 5000,
        CHECK_INTERVAL: 60 * 60 * 1000,
        CACHE_DURATION: 60 * 60 * 1000,
        REQUEST_TIMEOUT: 10000
    };

    let currentConfig = getConfig();
    let styleElement = null;

    let currentTimeOption = null;
    let currentSortOption = 'dateline';

    const timeOptions = [
        { label: '🕐 全部时间', value: 'all', dateline: null },
        { label: '⏳ 最近一天', value: '1天', dateline: 86400 },
        { label: '⏳ 最近两天', value: '2天', dateline: 172800 },
        { label: '📅 最近一周', value: '1周', dateline: 604800 },
        { label: '🗓️ 最近一月', value: '1月', dateline: 2592000 },
        { label: '🗓️ 最近三月', value: '3月', dateline: 7948800 }
    ];

    const sortOptions = [
        { label: '发帖时间', value: 'dateline' },
        { label: '按回复数', value: 'replies' },
        { label: '按查看数', value: 'views' }
    ];

    function getConfig() {
        const saved = GM_getValue(CONFIG_KEY);
        return saved ? {...defaultConfig, ...saved} : {...defaultConfig};
    }

    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, config);
    }

    function checkTaskStatus() {
        const button = document.getElementById('cgfxw-task-button');
        if (!button) return;

        const taskStatus = GM_getValue(TASK_STATUS_KEY, 'unknown');
        const lastCheck = GM_getValue(LAST_CHECK_KEY, 0);
        const now = Date.now();

        if (now - lastCheck > TASK_CONFIG.CACHE_DURATION) {
            fetchTaskStatus();
            return;
        }

        updateTaskButtonByStatus(button, taskStatus);
    }

    function updateTaskButtonByStatus(button, status) {
        if (status === 'hasTaskAvailable') {
            button.classList.add('green');
            button.classList.add('task-pulse');
            button.style.background = '#4CAF50';
            button.title = '有任务可做！点击查看';
        } else {
            button.classList.remove('green');
            button.classList.remove('task-pulse');
            button.style.background = '#fe9500';
            button.title = status === 'noTaskAvailable' ?
                '暂无新任务' :
                '点击跳转到任务页面';
        }

        updateTaskButtonVisibility();
    }

    function updateTaskButtonVisibility() {
        const button = document.getElementById('cgfxw-task-button');
        if (!button) return;

        const taskStatus = GM_getValue(TASK_STATUS_KEY, 'unknown');

        if (currentConfig.taskButtonEnabled) {
            button.dataset.alwaysShow = 'true';
        } else {
            button.dataset.alwaysShow = 'false';
            if (taskStatus === 'hasTaskAvailable') {
                button.dataset.alwaysShow = 'true';
            } else {
                button.dataset.alwaysShow = 'false';
            }
        }

        applyButtonVisibility();
    }

    function applyButtonVisibility() {
        const taskButton = document.getElementById('cgfxw-task-button');
        const mainBtn = document.getElementById('cgfxw-main-btn');
        const timeBtn = document.getElementById('cgfxw-time-btn');

        if (!mainBtn || !timeBtn) return;

        // 默认只显示时间按钮
        mainBtn.style.display = 'none';

        // 根据配置控制任务按钮显示
        if (taskButton) {
            const alwaysShow = taskButton.dataset.alwaysShow === 'true';
            if (alwaysShow && !document.getElementById('buttons-hover-active')) {
                taskButton.style.display = 'flex';
            }
        }
    }

    let buttonsHoverTimer = null;

    function setupButtonHoverEffects() {
        const taskButton = document.getElementById('cgfxw-task-button');
        const mainBtn = document.getElementById('cgfxw-main-btn');
        const timeBtn = document.getElementById('cgfxw-time-btn');

        if (!timeBtn) return;

        const buttonsArea = document.createElement('div');
        buttonsArea.id = 'buttons-container';
        buttonsArea.style.cssText = `
            position: fixed;
            top: 45px;
            right: 15px;
            display: flex;
            gap: 8px;
            align-items: center;
            z-index: 999998;
        `;

        // 将按钮移到容器中
        const timeBtnParent = timeBtn.parentNode;
        if (timeBtnParent) {
            buttonsArea.appendChild(timeBtn);
            if (mainBtn && mainBtn.parentNode) {
                mainBtn.parentNode.removeChild(mainBtn);
                buttonsArea.appendChild(mainBtn);
            }
        } else {
            document.body.appendChild(buttonsArea);
            buttonsArea.appendChild(timeBtn);
            if (mainBtn && mainBtn.parentNode) {
                buttonsArea.appendChild(mainBtn);
            }
        }

        document.body.appendChild(buttonsArea);

        buttonsArea.addEventListener('mouseenter', function() {
            clearTimeout(buttonsHoverTimer);
            buttonsArea.dataset.hoverActive = 'true';

            // 显示所有按钮
            mainBtn.style.display = 'flex';
            if (taskButton && taskButton.dataset.alwaysShow === 'false') {
                taskButton.style.display = 'none';
            } else if (taskButton && taskButton.dataset.alwaysShow === 'true') {
                taskButton.style.display = 'flex';
            }
        });

        buttonsArea.addEventListener('mouseleave', function() {
            clearTimeout(buttonsHoverTimer);
            buttonsArea.dataset.hoverActive = 'false';

            buttonsHoverTimer = setTimeout(() => {
                // 恢复默认状态：只显示时间按钮和总是显示的任务按钮
                mainBtn.style.display = 'none';
                if (taskButton && taskButton.dataset.alwaysShow === 'false') {
                    taskButton.style.display = 'none';
                }
            }, 2000);
        });

        // 应用初始状态
        setTimeout(() => {
            applyButtonVisibility();
        }, 100);
    }

    function fetchTaskStatus() {
        const taskUrl = location.origin + '/home.php?mod=task';

        GM_xmlhttpRequest({
            method: 'GET',
            url: taskUrl,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            timeout: TASK_CONFIG.REQUEST_TIMEOUT,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const noTaskElement = doc.querySelector('.ptm .emp');
                        let status = 'unknown';

                        if (noTaskElement) {
                            const text = noTaskElement.textContent || noTaskElement.innerText || '';

                            if (text.includes('暂无新任务') && text.includes('周期性任务完成后可以再次申请')) {
                                status = 'noTaskAvailable';
                            } else {
                                status = 'hasTaskAvailable';
                            }
                        } else {
                            status = 'hasTaskAvailable';
                        }

                        GM_setValue(TASK_STATUS_KEY, status);
                        GM_setValue(LAST_CHECK_KEY, Date.now());

                        const button = document.getElementById('cgfxw-task-button');
                        if (button) {
                            updateTaskButtonByStatus(button, status);
                        }

                        console.log('任务状态检查完成:', status);

                    } catch (error) {
                        console.error('解析任务页面失败:', error);
                        GM_setValue(LAST_CHECK_KEY, Date.now());
                    }
                } else {
                    console.error('请求任务页面失败，状态码:', response.status);
                }
            },
            onerror: function(error) {
                console.error('请求任务页面出错:', error);
            }
        });
    }

    function createTaskButton() {
        if (document.getElementById('cgfxw-task-button')) {
            return;
        }

        const button = document.createElement('div');
        button.id = 'cgfxw-task-button';
        button.innerHTML = '<span>任务</span>';
        button.title = '点击跳转到任务页面';
        button.style.background = '#fe9500';

        button.addEventListener('click', function(e) {
            e.stopPropagation();

            try {
                const isGreen = this.classList.contains('green');
                this.style.background = isGreen ? '#45a049' : '#ffaa33';

                const taskLink = document.querySelector("#qmenu_menu > ul > li:nth-child(5) a");
                if (taskLink) {
                    taskLink.click();
                    console.log('已点击任务链接');
                } else {
                    window.location.href = 'https://www.cgfxw.com/home.php?mod=task';
                }

                setTimeout(() => {
                    if (isGreen) {
                        this.style.background = '#4CAF50';
                    } else {
                        this.style.background = '#fe9500';
                    }
                }, 300);

            } catch (error) {
                console.error('跳转任务页面失败:', error);
                window.location.href = 'https://www.cgfxw.com/home.php?mod=task';
            }
        });

        button.dataset.alwaysShow = 'false';
        button.style.display = 'none';

        document.body.appendChild(button);

        checkTaskStatus();
        setTimeout(fetchTaskStatus, TASK_CONFIG.INITIAL_DELAY);

        console.log('CG资源网任务按钮已添加');
    }

    function generateCSS(config) {
        if (!config.enabled) return '';

        return `
            #cgfxw-task-button {
                position: fixed;
                top: 45px;
                right: 105px;
                width: 33px;
                height: 33px;
                background: #fe9500;
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(254, 149, 0, 0.3);
                cursor: pointer;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                user-select: none;
                transition: all 0.3s ease;
                border: 2px solid white;
            }

            #cgfxw-task-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(254, 149, 0, 0.4);
                background: #ffaa33;
            }

            #cgfxw-task-button:active {
                transform: scale(0.95);
            }

            #cgfxw-task-button span {
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            }

            #cgfxw-task-button.green {
                background: #4CAF50;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            }

            #cgfxw-task-button.green:hover {
                background: #45a049;
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }

            .task-pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(254, 149, 0, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(254, 149, 0, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(254, 149, 0, 0);
                }
            }

            #cgfxw-task-button.green.task-pulse {
                animation: pulse-green 2s infinite;
            }

            @keyframes pulse-green {
                0% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                }
            }

            .authi {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
                margin-right: 10px !important;
            }

            [id^=normalthread_] em {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            em.xw0.xi1,
            .num>em {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .num>a {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            em.xg1 {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            [id$=_menu]~p {
                display: inline !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .hm.ptn {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .hm.ptn .xg1 {
                color: #95a5a6 !important;
                margin-right: 2px !important;
            }

            .hm.ptn .xi1 {
                color: #1c9fe3 !important;
                font-weight: bold !important;
                margin-right: 2px !important;
            }

            ${config.timeColors ? `
                html body .pls [id^=normalthread_] em,
                html body .tl [id^=normalthread_] em,
                html body [id^=normalthread_]:not(.authi) em {
                    color: #e67e22 !important;
                    font-weight: bold !important;
                    margin: 0 5px !important;
                }

                html body em.xw0.xi1,
                html body .num>em {
                    color:#e6638d !important;
                }

                html body em.xg1 {
                    color: #7f8c8d !important;
                }

                html body [id^=authorposton] {
                    color: #ffd700 !important;
                    font-weight: bold !important;
                    font-size: 12px !important;
                    background: rgba(0,0,0,0.3) !important;
                    padding: 2px 6px !important;
                    border-radius: 8px !important;
                }
            ` : ''}

            ${config.authorStyles ? `
                html body .authi a.xw1 {
                    color: #fff !important;
                    font-weight: bold !important;
                    font-size: 12px !important;
                    text-decoration: none !important;
                    background: rgba(0,0,0,0.2) !important;
                    padding: 2px 8px !important;
                    border-radius: 8px !important;
                }

                html body .authi a:not(.xw1) {
                    color: rgba(255,255,255,0.1) !important;
                    margin: 0 5px !important;
                    text-decoration: none !important;
                }

                html body .authi a:not(.xw1):hover {
                    color: #2299e7 !important;
                    text-decoration: underline !important;
                }

                html body .authicn.vm {
                    display: inline-block !important;
                    vertical-align: middle !important;
                    margin-right: 6px !important;
                    filter: brightness(0) invert(1) !important;
                }

                html body .pipe {
                    color: rgba(255,255,255,0.5) !important;
                    margin: 0 8px !important;
                }
            ` : ''}

            html body [id$=_menu]~p {
                color: #27ae60 !important;
                font-weight: bold !important;
            }

            html body [id^=attach_][id$=_menu],
            html body .modact {
                background: #f8f9fa !important;
                border: 1px solid #dee2e6 !important;
                padding: 3px 6px !important;
                border-radius: 3px !important;
                margin: 1px !important;
            }

            html body .authi,
            html body [id$=_menu]~p,
            html body [id^=normalthread_] em,
            html body .num>em,
            html body .num>a,
            html body em.xw0.xi1,
            html body em.xg1,
            html body .hm.ptn,
            html body .pstatus {
                display: inline !important;
            }

            html body .hm.ptn {
                display: block !important;
            }

            html body .pstatus {
                display: block !important;
            }

            ${config.replyCount ? `
                html body .num>em,
                html body .tl .num em,
                html body .xi1[style*="font-style: normal"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
            ` : ''}

            html body .none,
            html body .show {
                display: inline !important;
                visibility: visible !important;
            }

            ${config.paginationStyles ? `
                .pg a {
                    background-color: white !important;
                    color: #444 !important;
                    border-color: #ddd !important;
                    border-radius: 3px !important;
                    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
                }

                .pg a:hover {
                    background-color: #81C784 !important;
                    color: white !important;
                    border-color: #81C784 !important;
                    border-radius: 3px !important;
                }

                .pg strong {
                    background-color: #4CAF50 !important;
                    color: white !important;
                    border-color: #4CAF50 !important;
                    border-radius: 3px !important;
                }

                .pg input.px {
                    border-color: #ddd !important;
                    border-radius: 3px !important;
                }

                .pg input.px:focus {
                    border-color: #4CAF50 !important;
                    outline: none !important;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
                }

                .pg span {
                    color: #666 !important;
                }

                .pgb.y a {
                    background-color: #4CAF50 !important;
                    color: white !important;
                    border-radius: 3px !important;
                    transition: background-color 0.2s ease !important;
                }

                .pgb.y a:hover {
                    background-color: #81C784 !important;
                }
            ` : ''}
        `;
    }

    function applyStyles() {
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }

        const css = generateCSS(currentConfig);
        styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        if (currentConfig.enabled) {
            setTimeout(() => {
                smartFixTimes();
                fixSpecificElements();
            }, 100);
        }
    }

    function smartFixTimes() {
        if (!currentConfig.enabled) return;

        const selectors = {
            '发帖时间': '.authi, [id^=authorposton]',
            '帖子时间': '[id^=normalthread_] em',
            '回复数量': '.num>em',
            '其他时间': 'em.xg1',
            '查看次数': 'em.xw0.xi1',
            '经验进度': '[id$=_menu]~p',
            '作者名': '.authi a.xw1',
            '其他链接': '.authi a:not(.xw1)',
            '查看回复统计': '.hm.ptn',
            '帖子编辑状态': '.pstatus'
        };

        Object.entries(selectors).forEach(([name, selector]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const computed = window.getComputedStyle(el);
                const needsFix = computed.display === 'none' ||
                                computed.visibility === 'hidden' ||
                                computed.opacity === '0';

                if (needsFix) {
                    if (name === '查看回复统计' || name === '帖子编辑状态') {
                        el.style.display = 'block';
                    } else {
                        el.style.display = 'inline';
                    }
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                }
            });
        });

        if (currentConfig.replyCount) {
            const replyCounts = document.querySelectorAll('.num>em, .tl .num em, .xi1[style*="font-style: normal"]');
            replyCounts.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
            });
        }
    }

    function fixSpecificElements() {
        if (!currentConfig.enabled) return;

        const statBar = document.querySelector('.hm.ptn');
        if (statBar) {
            const computed = window.getComputedStyle(statBar);
            if (computed.display === 'none') {
                statBar.style.display = 'block';
            }
        }

        const editStatus = document.querySelector('.pstatus');
        if (editStatus) {
            const computed = window.getComputedStyle(editStatus);
            if (computed.display === 'none') {
                editStatus.style.display = 'block';
            }
        }
    }

    function createMainControlPanel() {
        const mainBtn = document.createElement('div');
        mainBtn.id = 'cgfxw-main-btn';
        mainBtn.innerHTML = '🎨';
        mainBtn.title = 'CG资源网美化控制面板';
        mainBtn.style.cssText = `
            position: fixed;
            right: 60px;
            top: 45px;
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #429296 0%, #327174 100%);
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(66, 146, 150, 0.3);
            cursor: pointer;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
            transition: all 0.3s ease;
            user-select: none;
        `;

        const timeBtn = document.createElement('div');
        timeBtn.id = 'cgfxw-time-btn';
        timeBtn.innerHTML = '⏰';
        timeBtn.title = '帖子时间筛选面板';
        timeBtn.style.cssText = `
            position: fixed;
            right: 15px;
            top: 45px;
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #00a7e3 0%, #0088c7 100%);
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0, 167, 227, 0.3);
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
            transition: all 0.3s ease;
            user-select: none;
        `;

        const mainPanel = document.createElement('div');
        mainPanel.id = 'cgfxw-main-panel';
        mainPanel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 100px;
            width: 180px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 6px 17px rgba(0,0,0,0.1);
            z-index: 999997;
            padding: 12px;
            color: #333;
            font-family: 'Microsoft YaHei', sans-serif;
            display: none;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(66, 146, 150, 0.2);
            font-size: 12px;
        `;

        mainPanel.innerHTML = `
            <div class="main-panel-header">
                <div class="main-panel-title">🎨 显示与美化设置</div>
                <div class="main-panel-close">×</div>
            </div>
            <div class="main-panel-content">
                <div class="control-option">
                    <span class="option-label">启用美化</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="enable-enhancement" ${currentConfig.enabled ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div class="control-option">
                    <span class="option-label">时间颜色</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="time-colors" ${currentConfig.timeColors ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div class="control-option">
                    <span class="option-label">作者样式</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="author-styles" ${currentConfig.authorStyles ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div class="control-option">
                    <span class="option-label">分页样式</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="pagination-styles" ${currentConfig.paginationStyles ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div class="control-option">
                    <span class="option-label">隐藏回复数</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="hide-reply-count" ${currentConfig.replyCount ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div class="control-option">
                    <span class="option-label">显示任务按钮</span>
                    <label class="enhance-switch">
                        <input type="checkbox" id="task-button-enabled" ${currentConfig.taskButtonEnabled ? 'checked' : ''}>
                        <span class="enhance-slider"></span>
                    </label>
                </div>
                <div style="margin-top: 10px; text-align: center;">
                    <button class="panel-btn" id="reset-settings">
                        <span style="font-size: 14px;">🔄</span> 重置设置
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(mainBtn);
        document.body.appendChild(timeBtn);
        document.body.appendChild(mainPanel);

        mainBtn.addEventListener('click', function() {
            mainPanel.style.display = mainPanel.style.display === 'block' ? 'none' : 'block';
            updateMainButtonState();

            const timePanel = document.getElementById('time-select-panel');
            if (timePanel && timePanel.style.transform !== 'translateX(120%)') {
                timePanel.style.transform = 'translateX(120%)';
            }
        });

        timeBtn.addEventListener('click', function() {
            mainPanel.style.display = 'none';
            const panel = document.getElementById('time-select-panel');
            if (panel) {
                panel.style.transform = panel.style.transform === 'translateX(0px)' ?
                    'translateX(120%)' : 'translateX(0px)';
            } else {
                createTimeSelectionPanel();
                setTimeout(() => {
                    const timePanel = document.getElementById('time-select-panel');
                    if (timePanel) timePanel.style.transform = 'translateX(0px)';
                }, 10);
            }
        });

        mainPanel.querySelector('.main-panel-close').addEventListener('click', function() {
            mainPanel.style.display = 'none';
        });

        function updateMainButtonState() {
            if (currentConfig.enabled) {
                mainBtn.style.background = 'linear-gradient(135deg, #429296 0%, #327174 100%)';
                mainBtn.innerHTML = '🎨';
            } else {
                mainBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                mainBtn.innerHTML = '🚫';
            }
        }

        document.getElementById('enable-enhancement').addEventListener('change', function() {
            currentConfig.enabled = this.checked;
            saveConfig(currentConfig);
            updateMainButtonState();
            applyStyles();
        });

        document.getElementById('time-colors').addEventListener('change', function() {
            currentConfig.timeColors = this.checked;
            saveConfig(currentConfig);
            applyStyles();
        });

        document.getElementById('author-styles').addEventListener('change', function() {
            currentConfig.authorStyles = this.checked;
            saveConfig(currentConfig);
            applyStyles();
        });

        document.getElementById('hide-reply-count').addEventListener('change', function() {
            currentConfig.replyCount = this.checked;
            saveConfig(currentConfig);
            applyStyles();
        });

        document.getElementById('task-button-enabled').addEventListener('change', function() {
            currentConfig.taskButtonEnabled = this.checked;
            saveConfig(currentConfig);
            updateTaskButtonVisibility();
        });

        document.getElementById('pagination-styles').addEventListener('change', function() {
            currentConfig.paginationStyles = this.checked;
            saveConfig(currentConfig);
            applyStyles();
        });

        document.getElementById('reset-settings').addEventListener('click', function() {
            currentConfig = {...defaultConfig};
            saveConfig(currentConfig);
            document.getElementById('enable-enhancement').checked = currentConfig.enabled;
            document.getElementById('time-colors').checked = currentConfig.timeColors;
            document.getElementById('author-styles').checked = currentConfig.authorStyles;
            document.getElementById('hide-reply-count').checked = currentConfig.replyCount;
            document.getElementById('task-button-enabled').checked = currentConfig.taskButtonEnabled;
            document.getElementById('pagination-styles').checked = currentConfig.paginationStyles;
            updateMainButtonState();
            updateTaskButtonVisibility();
            applyStyles();
        });

        updateMainButtonState();

        document.addEventListener('click', function(event) {
            if (!mainBtn.contains(event.target) && !mainPanel.contains(event.target)) {
                mainPanel.style.display = 'none';
            }
        });
    }

    function createTimeSelectionPanel() {
        const existingPanel = document.getElementById('time-select-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const urlSelections = getCurrentFilterFromURL();
        currentTimeOption = urlSelections.timeOption;
        currentSortOption = urlSelections.sortOption;

        const panel = document.createElement('div');
        panel.id = 'time-select-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 15px;
            width: 180px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 6px 17px rgba(0,0,0,0.1);
            z-index: 999997;
            padding: 12px;
            font-family: 'Microsoft YaHei', sans-serif;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 167, 227, 0.2);
            transform: translateX(120%);
            backdrop-filter: blur(10px);
            color: #333;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            color: #00a7e3;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        title.innerHTML = '⏰ 帖子时间筛选';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 18px;
            color: #666;
            transition: color 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#00a7e3';
        closeBtn.onmouseout = () => closeBtn.style.color = '#666';
        closeBtn.onclick = () => panel.style.transform = 'translateX(120%)';
        title.appendChild(closeBtn);
        panel.appendChild(title);

        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, auto);
            gap: 6px;
            margin-bottom: 12px;
        `;

        timeOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                padding: 6px 4px;
                background: rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 4px;
                color: #555;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 40px;
                text-align: center;
                line-height: 1.2;
            `;

            const iconSpan = document.createElement('span');
            iconSpan.textContent = option.label.split(' ')[0];
            iconSpan.style.cssText = 'font-size: 12px; margin-bottom: 2px;';

            const textSpan = document.createElement('span');
            textSpan.textContent = option.label.split(' ')[1];
            textSpan.style.cssText = 'font-size: 9px;';

            btn.appendChild(iconSpan);
            btn.appendChild(textSpan);
            btn.dataset.option = JSON.stringify(option);

            if (currentTimeOption && option.value === currentTimeOption.value) {
                btn.classList.add('active');
                btn.style.background = '#00a7e3';
                btn.style.borderColor = '#00a7e3';
                btn.style.color = 'white';
            } else if (!currentTimeOption && option.dateline === null) {
                btn.classList.add('active');
                btn.style.background = '#00a7e3';
                btn.style.borderColor = '#00a7e3';
                btn.style.color = 'white';
                currentTimeOption = option;
            }

            btn.onmouseover = () => {
                if (!btn.classList.contains('active')) {
                    btn.style.background = 'rgba(0,0,0,0.1)';
                }
            };

            btn.onmouseout = () => {
                if (!btn.classList.contains('active')) {
                    btn.style.background = 'rgba(0,0,0,0.05)';
                }
            };

            btn.onclick = () => {
                optionsContainer.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'rgba(0,0,0,0.05)';
                    b.style.borderColor = 'rgba(0,0,0,0.1)';
                    b.style.color = '#555';
                });

                btn.classList.add('active');
                btn.style.background = '#00a7e3';
                btn.style.borderColor = '#00a7e3';
                btn.style.color = 'white';
                currentTimeOption = option;
            };

            optionsContainer.appendChild(btn);
        });

        panel.appendChild(optionsContainer);

        const sortLabel = document.createElement('div');
        sortLabel.textContent = '📊 排序:';
        sortLabel.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 6px;';
        panel.appendChild(sortLabel);

        const sortContainer = document.createElement('div');
        sortContainer.style.cssText = `
            display: flex;
            gap: 4px;
            margin-bottom: 12px;
        `;

        sortOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                padding: 6px 4px;
                background: rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 4px;
                color: #555;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                flex: 1;
                text-align: center;
                line-height: 1.2;
                min-height: 30px;
            `;

            btn.textContent = option.label;
            btn.dataset.sort = option.value;

            if (option.value === currentSortOption) {
                btn.classList.add('active');
                btn.style.background = '#00a7e3';
                btn.style.borderColor = '#00a7e3';
                btn.style.color = 'white';
            }

            btn.onmouseover = () => {
                if (!btn.classList.contains('active')) {
                    btn.style.background = 'rgba(0,0,0,0.1)';
                }
            };

            btn.onmouseout = () => {
                if (!btn.classList.contains('active')) {
                    btn.style.background = 'rgba(0,0,0,0.05)';
                }
            };

            btn.onclick = () => {
                sortContainer.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'rgba(0,0,0,0.05)';
                    b.style.borderColor = 'rgba(0,0,0,0.1)';
                    b.style.color = '#555';
                });

                btn.classList.add('active');
                btn.style.background = '#00a7e3';
                btn.style.borderColor = '#00a7e3';
                btn.style.color = 'white';
                currentSortOption = option.value;
            };

            sortContainer.appendChild(btn);
        });

        panel.appendChild(sortContainer);

        const controlContainer = document.createElement('div');
        controlContainer.style.cssText = `
            display: flex;
            gap: 6px;
            justify-content: space-between;
        `;

        const applyBtn = document.createElement('button');
        applyBtn.textContent = '选择后应用';
        applyBtn.style.cssText = `
            padding: 6px 10px;
            background: white;
            border: 1px solid #00a7e3;
            border-radius: 4px;
            color: #00a7e3;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        `;
        applyBtn.onmouseover = () => applyBtn.style.transform = 'translateY(-1px)';
        applyBtn.onmouseout = () => applyBtn.style.transform = 'translateY(0)';
        applyBtn.onclick = (e) => {
            e.target.style.background = '#00a7e3';
            e.target.style.color = 'white';
            setTimeout(() => {
                e.target.style.background = 'white';
                e.target.style.color = '#00a7e3';
                if (currentTimeOption) {
                    applyTimeFilter(currentTimeOption.dateline, currentSortOption);
                }
            }, 200);
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置选择';
        resetBtn.style.cssText = `
            padding: 6px 10px;
            background: rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 4px;
            color: #666;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        `;
        resetBtn.onmouseover = () => {
            resetBtn.style.background = 'rgba(0,0,0,0.1)';
            resetBtn.style.transform = 'translateY(-1px)';
        };
        resetBtn.onmouseout = () => {
            resetBtn.style.background = 'rgba(0,0,0,0.05)';
            resetBtn.style.transform = 'translateY(0)';
        };
        resetBtn.onclick = () => {
            optionsContainer.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'rgba(0,0,0,0.05)';
                b.style.borderColor = 'rgba(0,0,0,0.1)';
                b.style.color = '#555';
            });

            sortContainer.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'rgba(0,0,0,0.05)';
                b.style.borderColor = 'rgba(0,0,0,0.1)';
                b.style.color = '#555';
            });

            optionsContainer.firstChild.classList.add('active');
            optionsContainer.firstChild.style.background = '#00a7e3';
            optionsContainer.firstChild.style.borderColor = '#00a7e3';
            optionsContainer.firstChild.style.color = 'white';

            sortContainer.firstChild.classList.add('active');
            sortContainer.firstChild.style.background = '#00a7e3';
            sortContainer.firstChild.style.borderColor = '#00a7e3';
            sortContainer.firstChild.style.color = 'white';

            currentTimeOption = timeOptions[0];
            currentSortOption = 'dateline';
        };

        controlContainer.appendChild(applyBtn);
        controlContainer.appendChild(resetBtn);
        panel.appendChild(controlContainer);
        document.body.appendChild(panel);
    }

    function getCurrentFilterFromURL() {
        const currentUrl = new URL(window.location.href);
        const searchParams = new URLSearchParams(currentUrl.search);

        let timeOption = null;
        let sortOption = 'dateline';

        const dateline = searchParams.get('dateline');
        if (dateline) {
            const datelineNum = parseInt(dateline);
            timeOption = timeOptions.find(opt => opt.dateline === datelineNum) || null;
        }

        const orderby = searchParams.get('orderby');
        const filter = searchParams.get('filter');

        if (orderby === 'replies' && filter === 'reply') {
            sortOption = 'replies';
        } else if (orderby === 'views' && filter === 'reply') {
            sortOption = 'views';
        } else if (orderby === 'dateline' && filter === 'author') {
            sortOption = 'dateline';
        }

        return { timeOption, sortOption };
    }

    function applyTimeFilter(dateline, orderby) {
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);
        const fid = params.get('fid') || 41;

        let newUrl = `forum.php?mod=forumdisplay&fid=${fid}`;

        if (dateline) {
            newUrl += `&filter=dateline&dateline=${dateline}`;
        } else {
            newUrl += `&filter=author&orderby=dateline`;
        }

        if (orderby === 'replies') {
            newUrl += `&filter=reply&orderby=replies`;
        } else if (orderby === 'views') {
            newUrl += `&filter=reply&orderby=views`;
        } else {
            newUrl += `&filter=author&orderby=dateline`;
        }

        window.location.href = newUrl;
    }

    function init() {
        setTimeout(createTaskButton, 1500);

        GM_addStyle(`
            #cgfxw-main-panel .main-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(0,0,0,0.1);
            }

            #cgfxw-main-panel .main-panel-title {
                font-size: 12px;
                font-weight: bold;
                color: #429296;
            }

            #cgfxw-main-panel .main-panel-close {
                cursor: pointer;
                font-size: 16px;
                color: #666;
                transition: color 0.3s;
            }

            #cgfxw-main-panel .main-panel-close:hover {
                color: #429296;
            }

            #cgfxw-main-panel .control-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding: 4px 0;
            }

            #cgfxw-main-panel .option-label {
                font-size: 11px;
                color: #555;
            }

            .enhance-switch {
                position: relative;
                display: inline-block;
                width: 30px;
                height: 16px;
            }

            .enhance-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .enhance-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 16px;
            }

            .enhance-slider:before {
                position: absolute;
                content: "";
                height: 12px;
                width: 12px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .enhance-slider {
                background: #429296;
            }

            input:checked + .enhance-slider:before {
                transform: translateX(14px);
            }

            .panel-btn {
                width: 100%;
                padding: 6px;
                background: rgba(66, 146, 150, 0.1);
                border: 1px solid rgba(66, 146, 150, 0.3);
                border-radius: 4px;
                color: #429296;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.3s;
                margin-top: 2px;
            }

            .panel-btn:hover {
                background: rgba(66, 146, 150, 0.2);
                border-color: rgba(66, 146, 150, 0.5);
            }

            #cgfxw-time-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 167, 227, 0.4);
            }

            #cgfxw-main-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(66, 146, 150, 0.4);
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `);

        createMainControlPanel();
        createTimeSelectionPanel();

        applyStyles();

        smartFixTimes();
        fixSpecificElements();

        setTimeout(setupButtonHoverEffects, 10);

        setTimeout(() => {
            smartFixTimes();
            fixSpecificElements();
        }, 100);

        setTimeout(() => {
            smartFixTimes();
            fixSpecificElements();
        }, 200);

        console.log('✅ CG资源网美化与时间筛选脚本已加载 v5.2');
    }

    window.addEventListener('load', function() {
        init();

        setTimeout(fetchTaskStatus, TASK_CONFIG.INITIAL_DELAY);

        setInterval(fetchTaskStatus, TASK_CONFIG.CHECK_INTERVAL);

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(fetchTaskStatus, 1000);
            }
        });

        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                setTimeout(() => {
                    if (!document.getElementById('cgfxw-task-button')) {
                        createTaskButton();
                    }

                    if (url.includes('home.php?mod=task')) {
                        setTimeout(fetchTaskStatus, TASK_CONFIG.INITIAL_DELAY);
                    }
                }, 1000);
            }
        });

        observer.observe(document, { subtree: true, childList: true });
    });
})();
