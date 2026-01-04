// ==UserScript==
// @name         海南干部网络学院自动刷课助手
// @name:en      Hainan Cadre Online Learning Auto Player
// @namespace    https://greasyfork.org/scripts/558315
// @version      4.5.2
// @description  自动检测未完成课程，自动播放视频，智能防暂停，带状态面板（海南干部网络学院）
// @description:en  自动检测未完成课程，自动播放视频，智能防暂停，带状态面板（海南干部网络学院）
// @author       IMAG1C
// @license      MIT
// @match        https://www.higbwlxy.gov.cn/*
// @icon         https://www.higbwlxy.gov.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558315/%E6%B5%B7%E5%8D%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558315/%E6%B5%B7%E5%8D%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 配置: 选择器 (根据实际页面结构修改)
    const CONFIG = {
        // 课程列表页选择器
        courseListUrlPart: '/personal/myCourse', // 识别课程列表页的URL部分
        courseItemSelector: '.my-course-item', // 每一门课程的容器
        courseTitleSelector: '.course-name-link',     // 课程标题链接
        courseProgressSelector: '.el-progress__text', // 进度文本选择器

        // 视频播放页选择器
        videoSelector: 'video',             // 视频标签
        startBtnSelector: '.xgplayer-start', // xgplayer的开始播放按钮
        nextButtonSelector: '.next-btn',    // 下一节按钮
    };

    // 默认设置
    const DEFAULTS = {
        speed: 1.5,
        autoPlay: false,
        autoSpeed: true // 默认开启智能倍速
    };

    // UI 助手: 显示状态面板
    const UI = {
        box: null,
        status: null, // 标题栏状态
        courseTitle: null, // 课程标题
        courseProgress: null, // 课程进度
        tip: null, // 动态提示/状态行
        logBox: null,

        init: function(showSpeed = true) {
            // 如果已存在但模式不同，或者需要强制刷新，则先移除
            if (this.box) {
                // 简单判断：如果当前有slider但showSpeed=false，或者反之，则重建
                const hasSlider = !!this.box.querySelector('#bot-speed-slider');
                if (hasSlider !== showSpeed) {
                    document.body.removeChild(this.box);
                    this.box = null;
                } else {
                    return; // 模式匹配，无需重建
                }
            }

            // 读取保存的设置
            const savedSpeed = GM_getValue('bot_speed', DEFAULTS.speed);
            const savedAutoPlay = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
            const savedAutoSpeed = GM_getValue('bot_auto_speed', DEFAULTS.autoSpeed);
            const savedPos = GM_getValue('bot_ui_position', { top: '10px', left: '10px' });
            // const savedTrackMode = GM_getValue('bot_track_mode', 'dom'); // 已废弃

            this.box = document.createElement('div');
            this.box.style.cssText = `
                position: fixed;
                top: ${savedPos.top};
                left: ${savedPos.left};
                width: 350px;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 15px;
                border-radius: 8px;
                z-index: 999999;
                font-family: 'Microsoft YaHei', sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 1px solid #444;
            `;

            // 构建HTML
            let html = `
                <div id="bot-header" style="border-bottom: 1px solid #555; padding-bottom: 8px; margin-bottom: 10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none;">
                    <span style="font-size: 16px;">🤖 自动刷课助手</span>
                    <span id="bot-status" style="color: #4caf50; font-size: 12px; background: rgba(76, 175, 80, 0.2); padding: 2px 6px; border-radius: 4px;">运行中</span>
                </div>

                <!-- 课程信息区域 (固定位置) -->
                <div style="margin-bottom: 10px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
                    <div id="bot-cur-course" style="font-weight: bold; font-size: 13px; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="暂无课程">
                        当前课程: ${showSpeed ? '检测中...' : '列表扫描中...'}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span id="bot-cur-progress" style="color: #ddd;">进度: --</span>
                        <span id="bot-realtime-status" style="color: #ff9800;"></span>
                    </div>
                </div>

                <div style="margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="bot-auto-play" ${savedAutoPlay ? 'checked' : ''} style="margin-right: 5px;"> 自动刷视频
                        </label>
            `;

            // 只有在需要显示倍速时才渲染倍速控件
            if (showSpeed) {
                html += `
                         <label style="display: flex; align-items: center; cursor: pointer;" title="根据视频时长自动调节倍速 (2x - 5x)">
                            <input type="checkbox" id="bot-auto-speed" ${savedAutoSpeed ? 'checked' : ''} style="margin-right: 5px;"> 智能倍速
                        </label>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                         <span style="font-size: 12px; color: #aaa;">当前: <span id="bot-speed-val">${savedSpeed}x</span></span>
                    </div>
                    <input type="range" id="bot-speed-slider" min="1.0" max="5.0" step="0.5" value="${savedSpeed}" style="width: 100%;" ${savedAutoSpeed ? 'disabled' : ''}>

                    <!-- 调试功能区 (已隐藏，保留逻辑) -->
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #444; display: none; gap: 5px; flex-wrap: wrap;">
                        <button id="bot-btn-sync" style="font-size: 12px; padding: 4px 8px; background: #2196f3; border: none; border-radius: 4px; color: white; cursor: pointer;">🔄 同步进度</button>
                        <button id="bot-btn-trace" style="font-size: 12px; padding: 4px 8px; background: #ff9800; border: none; border-radius: 4px; color: white; cursor: pointer;">🔍 状态追踪</button>
                        <button id="bot-btn-close" style="font-size: 12px; padding: 4px 8px; background: #f44336; border: none; border-radius: 4px; color: white; cursor: pointer;">❌ 强制关闭</button>
                    </div>
                `;
            } else {
                html += `</div>`; // 闭合上面的div
            }

            html += `
                </div>
                <div style="background: #1e1e1e; padding: 8px; border-radius: 4px; height: 120px; overflow-y: auto; font-size: 12px; font-family: monospace; color: #aaa; border: 1px solid #333;" id="bot-logs"></div>
            `;

            this.box.innerHTML = html;

            document.body.appendChild(this.box);
            this.status = this.box.querySelector('#bot-status');
            this.courseTitle = this.box.querySelector('#bot-cur-course');
            this.courseProgress = this.box.querySelector('#bot-cur-progress');
            this.tip = this.box.querySelector('#bot-realtime-status');
            this.logBox = this.box.querySelector('#bot-logs');

            // 绑定事件: 自动播放开关
            const autoPlayCheckbox = this.box.querySelector('#bot-auto-play');
            autoPlayCheckbox.onchange = (e) => {
                const isChecked = e.target.checked;
                GM_setValue('bot_auto_play', isChecked);
                this.log(`自动刷视频功能已${isChecked ? '开启' : '关闭'}`);

                if (isChecked) {
                    if (window.location.href.includes(CONFIG.courseListUrlPart)) {
                        handleCourseListPage();
                    } else {
                        this.setStatus('功能已开启', '#4caf50');
                    }
                } else {
                    this.setStatus('待机中', '#ff9800');
                    this.updateTip('已手动暂停');
                }
            };

            if (showSpeed) {
                // 绑定事件: 智能倍速开关
                const autoSpeedCheckbox = this.box.querySelector('#bot-auto-speed');
                const slider = this.box.querySelector('#bot-speed-slider');
                autoSpeedCheckbox.onchange = (e) => {
                    const isChecked = e.target.checked;
                    GM_setValue('bot_auto_speed', isChecked);
                    slider.disabled = isChecked;
                    if (isChecked) {
                        this.log('已开启智能倍速');
                    } else {
                        this.log('已切换为手动倍速');
                    }
                };

                // 绑定事件: 倍速滑块
                const speedVal = this.box.querySelector('#bot-speed-val');
                slider.oninput = (e) => {
                    const val = e.target.value;
                    speedVal.innerText = val + 'x';
                    GM_setValue('bot_speed', val);

                    const video = document.querySelector('video');
                if (video) video.playbackRate = parseFloat(val);
            };

            // 绑定事件: 倍速滑块
            if (showSpeed) {
                // ... (上略)
            }

            // 绑定事件: 调试按钮
            if (showSpeed) {
                this.box.querySelector('#bot-btn-sync').onclick = () => {
                    this.log('手动触发同步...');
                    // 重新读取ID
                    let courseId = 'current';
                    try {
                        const idMatch = window.location.href.match(/[?&]id=(\d+)/);
                        if (idMatch) courseId = idMatch[1];
                    } catch(e) {}

                    // 尝试 ID 获取，失败则默认
                    const info = GM_getValue('bot_course_info_' + courseId, GM_getValue('bot_current_course_info', null));
                    if (info) {
                        this.updateCourse(info.title, info.listProgress);
                        this.log(`同步成功: ${info.title}`);
                    } else {
                        this.log('同步失败: 未找到存储信息');
                    }
                };

                this.box.querySelector('#bot-btn-trace').onclick = () => {
                    const video = document.querySelector('video');
                    if (video) {
                        this.log(`[状态] Paused:${video.paused} Ended:${video.ended} Time:${video.currentTime}/${video.duration}`);
                    } else {
                        this.log('[状态] 未找到视频元素');
                    }
                };

                this.box.querySelector('#bot-btn-close').onclick = () => {
                    this.log('手动触发关闭...');
                    // 强制释放锁
                    GM_setValue('bot_global_status', 'idle');
                    window.close();
                    if (window.opener) window.opener.location.reload();
                };
            }
        }

            // 启用拖拽
            this.makeDraggable(this.box);

            this.log('助手UI已初始化');
        },

        makeDraggable: function(el) {
            const header = el.querySelector('#bot-header');
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            header.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = el.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
                header.style.cursor = 'grabbing';
            };

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const newLeft = initialLeft + dx;
                const newTop = initialTop + dy;

                el.style.left = `${newLeft}px`;
                el.style.top = `${newTop}px`;
                el.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = 'move';
                    // 保存位置
                    GM_setValue('bot_ui_position', {
                        top: el.style.top,
                        left: el.style.left
                    });
                }
            });
        },

        setStatus: function(text, color = '#4caf50') {
            if (!this.status) this.init();
            this.status.innerText = text;
            this.status.style.color = color;
            this.status.style.background = color === '#4caf50' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 87, 34, 0.2)';
        },

        // 更新课程信息 (固定位置)
        updateCourse: function(title, progress) {
            // 直接通过ID查找当前页面上的元素，确保操作的是最新DOM
            const titleEl = document.getElementById('bot-cur-course');
            const progressEl = document.getElementById('bot-cur-progress');

            if (titleEl && title) {
                titleEl.innerText = `当前课程: ${title}`;
                titleEl.title = title;
            }

            if (progressEl && progress) {
                // 强制更新文本
                progressEl.innerText = `进度: ${progress}`;

                // 视觉反馈：文字闪烁白色
                progressEl.style.color = '#fff';
                // 使用局部变量捕获元素，防止闭包引用问题
                const el = progressEl;
                setTimeout(() => {
                     if(document.body.contains(el)) el.style.color = '#ddd';
                }, 200);
            }

            // 顺便更新一下box引用，防止拖拽失效
            if (!this.box || !document.body.contains(this.box)) {
                this.box = document.getElementById('bot-header')?.parentNode;
            }
        },

        // 更新动态提示/状态行
        updateTip: function(text, color = '#ff9800') {
            if (!this.tip) this.init();
            this.tip.innerHTML = text;
            this.tip.style.color = color;
        },

        log: function(msg) {
            if (!this.logBox) this.init();
            const line = document.createElement('div');
            const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            line.innerText = `[${time}] ${msg}`;
            line.style.marginBottom = '2px';
            line.style.borderBottom = '1px dashed #333';
            line.style.paddingBottom = '2px';
            this.logBox.appendChild(line);
            this.logBox.scrollTop = this.logBox.scrollHeight;
            console.log(`[Bot] ${msg}`);
        }
    };

    // 辅助: 睡眠
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 全局刷新间隔
    const RELOAD_INTERVAL = 20;

    // 辅助: 等待元素出现
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // 主逻辑
    async function main() {
        const UPDATE = {
            metaUrl: 'https://update.greasyfork.org/scripts/558315/%E6%B5%B7%E5%8D%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%20%28Smart%20Hook%E7%89%88%29.meta.js',
            downloadUrl: 'https://update.greasyfork.org/scripts/558315/%E6%B5%B7%E5%8D%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%20%28Smart%20Hook%E7%89%88%29.user.js'
        };
        const compareVersions = (a, b) => {
            const pa = a.split('.').map(n => parseInt(n, 10));
            const pb = b.split('.').map(n => parseInt(n, 10));
            const len = Math.max(pa.length, pb.length);
            for (let i = 0; i < len; i++) {
                const x = pa[i] || 0, y = pb[i] || 0;
                if (x > y) return 1;
                if (x < y) return -1;
            }
            return 0;
        };
        const checkForUpdate = () => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: UPDATE.metaUrl,
                    onload: (res) => {
                        const m = res.responseText.match(/@version\\s+([\\d.]+)/);
                        if (!m) return;
                        const remote = m[1];
                        const local = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) ? GM_info.script.version : '0.0.0';
                        if (compareVersions(remote, local) > 0) {
                            UI.setStatus('发现新版本', '#ff5722');
                            UI.updateTip(`检测到新版本 ${remote}，即将更新...`, '#ff5722');
                            setTimeout(() => { window.location.href = UPDATE.downloadUrl; }, 1500);
                        }
                    }
                });
            } catch(e) {}
        };
        checkForUpdate();
        UI.init();
        UI.log('脚本开始运行...');
        UI.log(`当前URL: ${window.location.href}`);

        // 0. 拦截主页异常跳转 (针对刷新或新开页情况) —— 优先尝试恢复到上次课程链接
        if (window.location.href.includes('#/home')) {
             const isAuto = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
             if (isAuto) {
                 const lastHref = GM_getValue('bot_last_course_href', null);
                 if (lastHref) {
                     UI.setStatus('异常跳转');
                     UI.updateTip('检测到回到主页，正在恢复到视频页面...', '#ff5722');
                     UI.log(`主页异常跳转，恢复到: ${lastHref}`);
                     window.location.href = lastHref;
                     return;
                 } else {
                     UI.setStatus('异常跳转');
                     UI.updateTip('检测到回到主页，5秒后自动关闭...', '#ff5722');
                     UI.log('主页异常跳转，但无历史链接，准备关闭...');
                     GM_setValue('bot_global_status', 'idle');
                     setTimeout(() => {
                         window.close();
                     }, 5000);
                     return;
                 }
             }
        }

        // 等待页面加载
        await waitForElement('body', 5000);

        if (window.location.href.includes(CONFIG.courseListUrlPart)) {
            await handleCourseListPage();
        } else {
            await handleVideoPage();
        }
    }

    // 课程列表页逻辑
    async function handleCourseListPage() {
        UI.init(false); // 列表页不显示倍速
        UI.setStatus('列表页扫描中');
        UI.log('检测到课程列表页');

        // 检查自动刷课开关
        const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
        if (!isAutoPlayEnabled) {
            UI.setStatus('待机中', '#ff9800');
            UI.updateTip('自动刷课已关闭');
            return;
        }

        // 全局锁检查: 检查是否有视频正在播放
        const globalStatus = GM_getValue('bot_global_status', 'idle');
        const lastHeartbeat = GM_getValue('course_bot_heartbeat', 0);
        const timeSinceHeartbeat = Date.now() - lastHeartbeat;
        const isAlive = timeSinceHeartbeat < 10000; // 10秒内心跳有效

        if (globalStatus === 'playing' && isAlive) {
            UI.setStatus('等待视频结束', '#2196f3');

            // 获取当前正在播放的课程名称
            const playingCourse = GM_getValue('bot_current_course_info', null);
            const playingTitle = playingCourse ? playingCourse.title : '未知课程';

            UI.updateCourse(playingTitle, '视频播放中...');
            UI.updateTip('检测到视频正在运行，脚本保持静默...', '#2196f3');
            UI.log(`全局锁生效: 正在播放 [${playingTitle}]`);

            // 改为轮询等待锁释放，而不是刷新页面
            const lockCheckTimer = setInterval(() => {
                const currentStatus = GM_getValue('bot_global_status', 'idle');
                if (currentStatus === 'idle') {
                    clearInterval(lockCheckTimer);
                    UI.log('检测到视频结束，准备刷新列表...');
                    UI.updateTip('视频已结束，即将刷新...');
                    setTimeout(() => window.location.reload(), 1000);
                }
            }, 2000);

            return;
        }

        // 等待列表加载
        UI.log('等待课程列表加载...');
        const listLoaded = await waitForElement(CONFIG.courseItemSelector);
        if (!listLoaded) {
            UI.setStatus('错误', '#ff5722');
            UI.log(`未找到课程元素 "${CONFIG.courseItemSelector}"`);
            UI.updateTip('未找到课程，请检查');
        }
        // 额外等待以确保稳定
        await sleep(2000);
        // 新增: 支持在 "在学课程" 与 "指定课程" 两个列表之间自动切换
        const ensureTab = async (label) => {
            // 尝试点击个人中心顶部的筛选Tab
            const tabCandidates = Array.from(document.querySelectorAll('.personal-center-top ul li'));
            let target = tabCandidates.find(el => (el.innerText || '').trim().includes(label));
            if (target) {
                const isActive = target.classList.contains('active');
                if (!isActive) {
                    UI.log(`切换到列表: ${label}`);
                    target.click();
                    await sleep(800);
                }
            }
            // 等待列表渲染
            await waitForElement(CONFIG.courseItemSelector, 5000);
            await sleep(500);
        };

        const processCurrentList = async () => {
            const courses = document.querySelectorAll(CONFIG.courseItemSelector);
            if (courses.length === 0) {
                UI.log('当前列表为空');
                return { processed: false, completedCount: 0, total: 0 };
            }

            UI.log(`当前列表共 ${courses.length} 门课程`);
            let completedCount = 0;

            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                const progressText = course.querySelector(CONFIG.courseProgressSelector)?.innerText || '0%';
                const titleLink = course.querySelector(CONFIG.courseTitleSelector);
                const title = titleLink ? titleLink.innerText.trim() : `课程 ${i + 1}`;

                if (progressText.includes('100%') || progressText.includes('已完成') || progressText.includes('已学完')) {
                    completedCount++;
                    continue;
                }

                if (titleLink) {
                    UI.setStatus('准备学习');
                    UI.updateTip('准备打开课程...');
                    UI.log(`准备开始: ${title} (${progressText})`);

                    let courseId = 'current';
                    try {
                        const idMatch = titleLink.href.match(/[?&]id=(\d+)/);
                        if (idMatch) courseId = idMatch[1];
                    } catch(e) {}

                    // 记录上次课程链接以便异常恢复
                    GM_setValue('bot_last_course_href', titleLink.href);

                    GM_setValue('bot_course_info_' + courseId, {
                        title: title,
                        listProgress: progressText,
                        timestamp: Date.now()
                    });
                    GM_setValue('bot_current_course_info', {
                        title: title,
                        listProgress: progressText,
                        timestamp: Date.now()
                    });

                    titleLink.click();
                    UI.log('已点击课程链接');
                    startReloadTimer(title);
                    return { processed: true, completedCount, total: courses.length };
                }
            }

            return { processed: false, completedCount, total: courses.length };
        };

        // 先处理 "在学课程"，如果无待学课程，再切到 "指定课程"
        await ensureTab('在学课程');
        const resIn = await processCurrentList();
        if (!resIn.processed) {
            UI.log(`在学课程已完成 (${resIn.completedCount}/${resIn.total})，尝试切换到指定课程`);
            await ensureTab('指定课程');
            const resAssign = await processCurrentList();
            if (!resAssign.processed) {
                if (resAssign.total === 0) {
                    UI.updateTip('指定课程列表为空');
                } else {
                    UI.updateTip(`指定课程已完成 ${resAssign.completedCount}/${resAssign.total} 门`);
                }
                const paginateAndProcess = async () => {
                    let attempts = 0;
                    while (attempts < 10) {
                        attempts++;
                        const pagination = document.querySelector('.el-pagination');
                        if (!pagination) return false;
                        const numbers = Array.from(pagination.querySelectorAll('.el-pager li.number'));
                        const activeEl = pagination.querySelector('.el-pager li.number.active');
                        let nextEl = null;
                        if (numbers.length > 0 && activeEl) {
                            const idx = numbers.indexOf(activeEl);
                            if (idx >= 0 && idx < numbers.length - 1) nextEl = numbers[idx + 1];
                        } else {
                            const nextBtn = pagination.querySelector('.btn-next');
                            if (nextBtn && !nextBtn.disabled) nextEl = nextBtn;
                        }
                        if (!nextEl) return false;
                        nextEl.click();
                        await sleep(800);
                        await waitForElement(CONFIG.courseItemSelector, 5000);
                        await sleep(500);
                        const res = await processCurrentList();
                        if (res.processed) return true;
                        if (res.total === 0) return false;
                    }
                    return false;
                };
                const ok = await paginateAndProcess();
                if (!ok) UI.log('分页遍历结束，未找到未完成课程');
            }
        }
    }

    function startReloadTimer(title) {
        UI.setStatus('静默中', '#2196f3');
        UI.updateTip('已在后台打开，正在监测播放...', '#2196f3');
        let hasPlaying = false;
        const timer = setInterval(() => {
            const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
            if (!isAutoPlayEnabled) {
                clearInterval(timer);
                UI.setStatus('暂停中', '#ff9800');
                UI.updateTip('用户已暂停脚本');
                return;
            }
            const status = GM_getValue('bot_global_status', 'idle');
            const lastHeartbeat = GM_getValue('course_bot_heartbeat', 0);
            const alive = Date.now() - lastHeartbeat < 8000;
            if (status === 'playing' && alive) {
                hasPlaying = true;
                UI.updateCourse(title, '视频播放中...');
                UI.updateTip('视频正在播放，脚本保持静默...', '#2196f3');
            }
            if (hasPlaying && status === 'idle') {
                clearInterval(timer);
                UI.updateTip('视频已结束，刷新列表...', '#ff9800');
                window.location.reload();
            }
            if (!hasPlaying && !alive) {
                // 长时间未检测到心跳，回退刷新
                clearInterval(timer);
                UI.updateTip('未检测到播放心跳，刷新列表...', '#ff9800');
                window.location.reload();
            }
        }, 1000);
    }

    // 视频播放页逻辑
    async function handleVideoPage() {
        UI.init(true); // 视频页显示倍速
        UI.setStatus('学习中'); // 简化状态
        UI.log('检测到视频播放页');

        // 设置全局状态: 播放中
        GM_setValue('bot_global_status', 'playing');

        // 注册关闭时的状态清理
        window.addEventListener('beforeunload', () => {
            GM_setValue('bot_global_status', 'idle');
        });

        // 立即启动心跳
        setInterval(() => {
            GM_setValue('course_bot_heartbeat', Date.now());
        }, 1000); // 每秒更新一次心跳
        GM_setValue('course_bot_heartbeat', Date.now()); // 首次心跳

        // 从存储中获取主页传递的课程信息
        let courseInfo = null;
        try {
            // 尝试从当前URL获取ID
            const idMatch = window.location.href.match(/[?&]id=(\d+)/);
            if (idMatch) {
                const courseId = idMatch[1];
                courseInfo = GM_getValue('bot_course_info_' + courseId, null);
                UI.log(`尝试通过ID(${courseId})获取信息...`);
            }
        } catch(e) {}

        // 降级方案
        if (!courseInfo) {
             courseInfo = GM_getValue('bot_current_course_info', null);
             UI.log('尝试通过默认存储获取信息...');
        }

        let pageTitle = '视频播放中';
        // let initProgress = '0%'; // 移除初始进度，完全依赖页面抓取

        if (courseInfo && (Date.now() - courseInfo.timestamp < 120000)) { // 延长到2分钟内的有效信息
            pageTitle = courseInfo.title;
            // initProgress = courseInfo.listProgress; // 不再使用列表页传递的进度
            UI.log(`✅ 已同步课程标题: ${pageTitle}`);
        } else {
            pageTitle = document.title || '未知课程';
            UI.log('❌ 同步信息失效或不存在，使用默认标题');
        }

        UI.updateCourse(pageTitle, '检测中...'); // 初始显示检测中

        // 关键逻辑: 尝试打开侧边栏 (fixedDialog) 以加载 videoDetails
        const openSideBar = async () => {
            const fixedDialog = document.querySelector('.fixedDialog');
            if (fixedDialog) {
                UI.log('尝试点击打开侧边栏(.fixedDialog)...');
                fixedDialog.click();
                await sleep(500); // 等待动画/加载
            } else {
                 UI.log('⚠️ 未找到侧边栏按钮(.fixedDialog)，尝试直接查找内容...');
            }
        };

        // 初始尝试打开一次
        await openSideBar();

        // 等待视频元素
        UI.log('正在寻找视频元素...');
        const video = await waitForElement(CONFIG.videoSelector);

        if (video) {
            UI.log('找到视频元素，准备播放...');
            // UI.updateTip('准备播放...'); // 移除多余提示

            // 设置静音和倍速 (从存储读取)
            video.muted = true;
            const savedSpeed = parseFloat(GM_getValue('bot_speed', DEFAULTS.speed));
            video.playbackRate = savedSpeed;
            UI.log(`应用倍速: ${savedSpeed}x`);

            // 强制倍速锁定 (防止播放器重置)
            const enforceSpeed = () => {
                 // 检查是否开启智能倍速
                 const isAutoSpeed = GM_getValue('bot_auto_speed', DEFAULTS.autoSpeed);
                 let currentTarget = 1.5;

                 if (isAutoSpeed && video.duration) {
                     // 智能倍速逻辑
                     const durationMinutes = video.duration / 60;
                     if (durationMinutes < 30) {
                         currentTarget = 2.0;
                     } else if (durationMinutes >= 60) {
                         currentTarget = 5.0;
                     } else {
                         // 30-60分钟之间，线性插值 2x -> 5x
                         // 进度 = (时长 - 30) / (60 - 30)
                         const ratio = (durationMinutes - 30) / 30;
                         currentTarget = 2.0 + (ratio * 3.0);
                         // 取整到0.5倍数
                         currentTarget = Math.round(currentTarget * 2) / 2;
                     }
                     // 更新界面显示
                     const speedDisplay = document.getElementById('bot-speed-val');
                     if (speedDisplay) speedDisplay.innerText = currentTarget + 'x (智能)';
                 } else {
                     // 手动倍速
                     const slider = document.getElementById('bot-speed-slider');
                     if (slider) {
                         currentTarget = parseFloat(slider.value) || 1.5;
                     }
                 }

                 // 1. 原生倍速
                 if (video.playbackRate !== currentTarget) {
                     video.playbackRate = currentTarget;
                 }

                 // 2. 尝试修改xgplayer内部状态 (如果有)
                 if (window.__bot_player_instance && window.__bot_player_instance.playbackRate !== currentTarget) {
                     try {
                        window.__bot_player_instance.playbackRate = currentTarget;
                     } catch(e) {}
                 }
            };

            // 监听速率变化事件
            video.addEventListener('ratechange', enforceSpeed);
            // 定时器强制检查
            setInterval(enforceSpeed, 1000);

            // 辅助: 从DOM提取进度 (支持 aria-valuenow 和 innerText)
            const getDomProgress = () => {
                // 限定在 videoDetails 区域内查找，防止干扰
                const container = document.querySelector('.videoDetails') || document.body;

                // 1. 优先尝试 innerText (用户肉眼可见，最可信)
                const textEl = container.querySelector('.el-progress__text') || container.querySelector('.el-progress-bar__innerText');
                if (textEl) {
                    const text = textEl.innerText.trim();
                    if (text && text.includes('%')) return text;
                }

                // 2. 其次尝试 aria-valuenow
                const progressBar = container.querySelector('div[role="progressbar"]');
                if (progressBar && progressBar.hasAttribute('aria-valuenow')) {
                    const val = progressBar.getAttribute('aria-valuenow');
                    if (val && parseFloat(val) >= 0) return val + '%';
                }

                return null;
            };

            // 新增: DOM监听官方进度 (解决进度不同步问题)
            let progressObserver = null;
            let observedElement = null;

            const tryAttachProgressObserver = () => {
                // 1. 检查现有监听器是否依然有效 (元素是否仍在文档中)
                if (progressObserver && observedElement && document.body.contains(observedElement)) {
                    return true;
                }

                // 2. 如果失效，清理旧的
                if (progressObserver) {
                    progressObserver.disconnect();
                    progressObserver = null;
                    observedElement = null;
                    UI.log('⚠️ 监听目标已失效，正在重新绑定...');
                }

                // 3. 提升监听层级到容器 (.videoDetails)，防止进度条元素被替换导致监听失效
                const container = document.querySelector('.videoDetails');

                if (container) {
                    UI.log('✅ 成功绑定全局进度容器监听 (.videoDetails)');
                    observedElement = container;

                    // 立即更新一次
                    const p = getDomProgress();
                    if (p) UI.updateCourse(null, p);

                    // 创建新的观察者
                    progressObserver = new MutationObserver((mutations) => {
                         // 只要容器内有任何变动，就重新读取进度
                         const newP = getDomProgress();
                         if (newP) UI.updateCourse(null, newP);
                    });

                    // 监听子树所有变化 (包括文本、属性、子节点增删)
                    progressObserver.observe(container, {
                        subtree: true,
                        childList: true,
                        attributes: true,
                        characterData: true
                    });
                    return true;
                }

                return false;
            };

            tryAttachProgressObserver();

            // 卡顿检测变量
            let lastTime = -1;
            let stuckCount = 0;
            let openAttempts = 0; // 侧边栏打开尝试次数

            // 补充: 定期检查播放结束状态 + 卡顿检测 + 错误检测
            setInterval(() => {
                // 保证 videoDetails 已打开
                let detailsBox = document.querySelector('.videoDetails');
                if (!detailsBox && openAttempts < 5) {
                    const fixedDialog = document.querySelector('.fixedDialog');
                    if (fixedDialog) {
                        fixedDialog.click();
                        openAttempts++;
                    }
                }

                // 0. 错误检测 (xgplayer特有)
                // 宽容模式: 只要检测到具体的错误关键词，或者错误容器可见且有字，就刷新
                const errorTextEl = document.querySelector('.xgplayer-error-text');
                if (errorTextEl) {
                    const text = errorTextEl.innerText.trim();
                    const isVisible = errorTextEl.offsetParent !== null;

                    // 1. 如果有明确的错误文字 (如 "解码错误")
                    // 2. 或者错误区域可见且不为空
                    if ((text.includes('错误') || text.includes('失败') || text.includes('Error')) || (isVisible && text.length > 0)) {
                         UI.setStatus('播放器错误', '#f44336');
                         UI.updateTip(`检测到错误: ${text || '未知错误'}，3秒后刷新...`, '#f44336');
                         UI.log(`❌ 捕获到播放器错误: ${text}`);
                         setTimeout(() => window.location.reload(), 3000);
                         return;
                    }
                }

                // 额外检查: 有些错误可能没有 text，但 .xgplayer-error 是 block 显示的
                const errorBox = document.querySelector('.xgplayer-error');
                if (errorBox && getComputedStyle(errorBox).display !== 'none' && errorBox.offsetParent !== null) {
                     // 再次确认不是隐藏的
                     if (errorBox.querySelector('.xgplayer-error-refresh')) {
                         UI.setStatus('播放器错误', '#f44336');
                         UI.updateTip('检测到错误提示层，3秒后刷新...', '#f44336');
                         UI.log('❌ 检测到错误提示层(UI)，准备刷新...');
                         setTimeout(() => window.location.reload(), 3000);
                         return;
                     }
                }

                // 1. 结束检测
                if (video.ended || (video.duration && video.currentTime >= video.duration - 0.5)) {
                     UI.log('检测到视频结束 (轮询)');
                     handleVideoEnd();
                     return;
                }

                // 2. 卡顿检测 (如果没暂停，但时间没变)
                if (!video.paused) {
                    if (video.currentTime === lastTime) {
                        stuckCount++;
                        if (stuckCount >= 10) { // 约30秒 (3s * 10)
                            UI.log('⚠️ 检测到视频卡顿超过30秒，执行刷新...');
                            window.location.reload();
                        }
                    } else {
                        stuckCount = 0; // 重置
                        lastTime = video.currentTime;
                    }
                }
            }, 3000);

            // 暴力启动播放逻辑
            const tryPlay = () => {
                // 检查自动刷课开关
                const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
                if (!isAutoPlayEnabled) {
                    UI.log('自动播放已关闭，跳过启动');
                    return;
                }

                video.muted = true; // 确保静音

                // 1. 尝试点击播放按钮 (模拟原生点击)
                const startBtn = document.querySelector(CONFIG.startBtnSelector);
                if (startBtn) {
                    // UI.log('尝试点击Start按钮...');
                    startBtn.click();
                    const e = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    startBtn.dispatchEvent(e);
                }

                // 2. 尝试点击视频元素本身
                video.click();

                // 3. 调用API
                video.play().catch(e => {/* 忽略自动播放限制错误 */});
            };

            // 初始尝试
            tryPlay();

            // 初始进度对比日志
            setTimeout(() => {
                if (video.duration) {
                     const vidPercent = ((video.currentTime / video.duration) * 100).toFixed(2) + '%';
                     UI.log(`进度校对: 列表记录 ${initProgress} | 视频当前 ${vidPercent}`);
                }
            }, 1000);

            // 循环暴力启动直到播放成功
            let attempts = 0;
            const startInterval = setInterval(() => {
                // 检查自动刷课开关
                const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
                if (!isAutoPlayEnabled) return;

                attempts++;
                if (!video.paused && video.currentTime > 0) {
                    clearInterval(startInterval);
                    UI.log('✅ 播放成功启动');
                    UI.setStatus('播放中');
                    UI.updateTip('视频正在播放', '#4caf50');
                } else {
                    if (attempts % 5 === 0) {
                        UI.log('正在尝试自动播放...');
                        // UI.updateTip('正在尝试启动...', '#ff9800'); // 移除干扰
                    }
                    tryPlay();
                }
            }, 800);

            // 15秒后停止尝试，避免死循环
            setTimeout(() => clearInterval(startInterval), 15000);

            // 监听播放结束
            video.onended = function() {
                UI.log('🎬 视频播放结束');
                UI.updateTip('播放结束，准备跳转');
                handleVideoEnd();
            };

            // 防暂停 / 保持活跃 / 更新信息
            setInterval(() => {
                 // 0. 检查是否跳回主页 (针对SPA跳转) —— 尝试恢复到上次课程链接
                 if (window.location.href.includes('#/home')) {
                     const lastHref = GM_getValue('bot_last_course_href', null);
                     if (lastHref) {
                         UI.log('检测到中途跳转回主页，正在恢复视频页面...');
                         window.location.href = lastHref;
                         return;
                     } else {
                         UI.log('检测到中途跳转回主页，但无历史链接，执行关闭...');
                         GM_setValue('bot_global_status', 'idle');
                         window.close();
                         return;
                     }
                 }

                 // 策略: DOM监听 (默认 & 强制)
                 // 尝试补救进度监听
                 tryAttachProgressObserver();

                 // 兜底: 强制读取一次
                 const p = getDomProgress();

                 /* 已在上方统一调试输出，此处移除重复的Debug更新 */

                 if (p) {
                     // 移除条件判断，强制刷新UI
                     UI.updateCourse(null, p);
                 }

                 // 3. 检查自动刷课开关
                 const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
                 if (!isAutoPlayEnabled) return;

                 // 如果暂停了且没结束，尝试恢复
                 if (video.paused && !video.ended) {
                    UI.log('检测到暂停，尝试恢复...');
                    UI.updateTip('检测到暂停，尝试恢复...', '#ff9800');
                    tryPlay();
                 }
                 // 强制倍速
                 const currentSpeed = parseFloat(GM_getValue('bot_speed', DEFAULTS.speed));
                 if (video.playbackRate !== currentSpeed) {
                     video.playbackRate = currentSpeed;
                 }
            }, 3000);

        } else {
            // 检查是否是因为跳回主页导致的未找到 —— 优先尝试恢复
            if (window.location.href.includes('#/home')) {
                const lastHref = GM_getValue('bot_last_course_href', null);
                if (lastHref) {
                    UI.log('未找到视频且位于主页，正在恢复到视频页面...');
                    window.location.href = lastHref;
                    return;
                } else {
                    UI.log('未找到视频且位于主页，且无历史链接，执行关闭...');
                    GM_setValue('bot_global_status', 'idle');
                    window.close();
                    return;
                }
            }
            UI.setStatus('错误', '#ff5722');
            UI.log('未找到视频元素，请检查页面');
        }
    }

    function handleVideoEnd() {
        UI.setStatus('播放结束');

        // 释放全局锁
        GM_setValue('bot_global_status', 'idle');

        // 检查自动刷课开关
        const isAutoPlayEnabled = GM_getValue('bot_auto_play', DEFAULTS.autoPlay);
        if (!isAutoPlayEnabled) {
            UI.log('自动刷课已关闭，不进行跳转');
            UI.updateTip('自动跳转已关闭');
            return;
        }

        // 优先检查是否有"下一节"按钮
        const nextBtn = document.querySelector(CONFIG.nextButtonSelector);

        // 逻辑修正: 只有当按钮存在、可见、且不是禁用状态时才点击
        if (nextBtn && !nextBtn.disabled && nextBtn.offsetParent !== null) {
            UI.log('检测到下一节按钮，准备跳转...');
            UI.updateTip('正在跳转下一节...');
            nextBtn.click();
        } else {
            // 否则直接关闭
            UI.log('本节已完成，无下一节，准备关闭...');
            UI.updateTip('本节完成，3秒后关闭');
            setTimeout(() => {
                UI.log('执行关闭窗口...');
                window.close();
                // 备用关闭方法，防止window.close被拦截
                if (window.opener) window.opener.location.reload();
            }, 3000);
        }
    }

    // 运行
    setTimeout(main, 1000);

})();
