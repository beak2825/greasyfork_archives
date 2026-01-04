// ==UserScript==
// @name         四川大学自动抢课简单脚本
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  川大自动抢课脚本 - Web Worker优化版
// @author       Cloud Hypnos
// @license      GPL-3.0
// @match        http://zhjw.scu.edu.cn/student/courseSelect/courseSelect/*
// @match        https://zhjw.scu.edu.cn/student/courseSelect/courseSelect/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550528/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E7%AE%80%E5%8D%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550528/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E7%AE%80%E5%8D%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 切换这里的值来改变配色: 'PINK' 或 'GREEN'
    const CURRENT_THEME = 'GREEN';

    const THEMES = {
        PINK: {
            primary: '#ff6f91',
            primaryLight: '#ff8fa3',
            primaryDark: '#e6537c',
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3',
            gray: '#6c757d'
        },
        GREEN: {
            primary: '#00c9a7',
            primaryLight: '#00d9b8',
            primaryDark: '#008f7a',
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3',
            gray: '#6c757d'
        }
    };

    const THEME_COLORS = THEMES[CURRENT_THEME];

    let isRunning = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let queryCount = 0;
    let worker = null;
    let startTime = null;
    let timeInterval = null;

    // 创建Web Worker
    function createWorker() {
        const workerCode = `
            let interval = null;

            self.addEventListener('message', function(e) {
                if (e.data.command === 'start') {
                    if (interval) clearInterval(interval);

                    interval = setInterval(() => {
                        self.postMessage({ type: 'tick' });
                    }, e.data.interval || 600);

                } else if (e.data.command === 'stop') {
                    if (interval) {
                        clearInterval(interval);
                        interval = null;
                    }
                }
            });
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        return new Worker(workerUrl);
    }

    // 创建控制面板
    function createButton() {
        const panel = document.createElement('div');
        panel.id = 'autoGrabPanel';
        panel.innerHTML = `
            <div style="display: flex; border-radius: 5px; overflow: hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.2);">
                <!-- 左侧拖动区域 -->
                <div id="dragArea" style="
                    width: 20px;
                    background: linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%);
                    cursor: move;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 2px;
                    user-select: none;
                    transition: all 0.2s ease;
                " title="拖动">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white" opacity="0.8">
                        <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
                    </svg>
                </div>

                <!-- 右侧功能区域 -->
                <div style="
                    background: white;
                    padding: 6px 8px;
                    min-width: 120px;
                    border: 1px solid #e0e0e0;
                    border-left: none;
                ">
                    <!-- 查询计数 -->
                    <div id="queryCounter" style="
                        margin-bottom: 5px;
                        font-size: 10px;
                        color: #666;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <span>查询: <span id="queryCount" style="font-weight: 700; color: ${THEME_COLORS.primary};">0</span></span>
                        <span id="timeElapsed" style="display: none;">运行: <span id="runTime">0</span>s</span>
                    </div>

                    <!-- 主按钮 -->
                    <button id="actionBtn" style="
                        width: 100%;
                        padding: 6px 8px;
                        background: linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 700;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                        line-height: 1;
                    ">
                        开始抢课
                    </button>
                </div>
            </div>
        `;

        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        document.body.appendChild(panel);
        setupDragEvents(panel);
        setupButtonEvents();
    }

    // 设置拖动事件
    function setupDragEvents(panel) {
        const dragArea = document.getElementById('dragArea');

        dragArea.onmouseenter = function() {
            if (!isDragging) {
                dragArea.style.background = `linear-gradient(135deg, ${THEME_COLORS.primaryLight} 0%, ${THEME_COLORS.primary} 100%)`;
            }
        };

        dragArea.onmouseleave = function() {
            if (!isDragging) {
                dragArea.style.background = `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%)`;
            }
        };

        dragArea.onmousedown = function(e) {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            dragArea.style.background = `linear-gradient(135deg, ${THEME_COLORS.primaryDark} 0%, ${THEME_COLORS.primary} 100%)`;
            dragArea.style.transform = 'scale(0.95)';
            document.body.style.cursor = 'move';

            const overlay = document.createElement('div');
            overlay.id = 'dragOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9998;
                cursor: move;
            `;
            document.body.appendChild(overlay);

            e.preventDefault();
        };

        document.onmousemove = function(e) {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
        };

        document.onmouseup = function() {
            if (isDragging) {
                isDragging = false;
                dragArea.style.background = `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%)`;
                dragArea.style.transform = 'scale(1)';
                document.body.style.cursor = 'auto';

                const overlay = document.getElementById('dragOverlay');
                if (overlay) overlay.remove();
            }
        };

        document.oncontextmenu = function(e) {
            if (isDragging) {
                isDragging = false;
                dragArea.style.background = `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%)`;
                dragArea.style.transform = 'scale(1)';
                document.body.style.cursor = 'auto';

                const overlay = document.getElementById('dragOverlay');
                if (overlay) overlay.remove();

                e.preventDefault();
                return false;
            }
        };
    }

    // 设置按钮事件
    function setupButtonEvents() {
        const actionBtn = document.getElementById('actionBtn');

        actionBtn.onclick = function(e) {
            e.stopPropagation();
            toggleAutoGrab();
        };

        actionBtn.onmouseenter = function() {
            if (!isRunning) {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
            }
        };

        actionBtn.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        };
    }

    // 更新按钮
    function updateButton(text, color) {
        const actionBtn = document.getElementById('actionBtn');
        if (actionBtn) {
            actionBtn.textContent = text;
            actionBtn.style.background = color.includes('gradient') ? color :
                `linear-gradient(135deg, ${color} 0%, ${color} 100%)`;
        }
    }

    // 更新查询计数和运行时间
    function updateQueryCount() {
        queryCount++;
        const countElement = document.getElementById('queryCount');
        if (countElement) {
            countElement.textContent = queryCount;
        }
    }

    function startTimer() {
        startTime = Date.now();
        document.getElementById('timeElapsed').style.display = 'block';

        timeInterval = setInterval(() => {
            if (startTime) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                document.getElementById('runTime').textContent = elapsed;
            }
        }, 1000);
    }

    function stopTimer() {
        startTime = null;
        if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
        }
        document.getElementById('timeElapsed').style.display = 'none';
    }

    function resetQueryCount() {
        queryCount = 0;
        const countElement = document.getElementById('queryCount');
        if (countElement) {
            countElement.textContent = queryCount;
        }
    }

    // 查询课程并获取结果
    function searchCourses() {
        return new Promise((resolve, reject) => {
            try {
                const iframe = document.querySelector("iframe");
                if (!iframe || !iframe.contentWindow) {
                    throw new Error('找不到iframe');
                }

                const iframeWin = iframe.contentWindow;
                if (typeof iframeWin.guolv !== 'function') {
                    throw new Error('找不到查询函数');
                }

                const original$ = iframeWin.$;
                const originalAjax = original$.ajax;

                original$.ajax = function(options) {
                    if (options.url && options.url.includes('/student/courseSelect/freeCourse/courseList')) {
                        const originalSuccess = options.success;

                        options.success = function(data) {
                            original$.ajax = originalAjax;
                            resolve(data);

                            if (originalSuccess) {
                                originalSuccess.call(this, data);
                            }
                        };

                        const originalError = options.error;
                        options.error = function(xhr, status, error) {
                            original$.ajax = originalAjax;
                            reject(new Error(`查询失败: ${error}`));

                            if (originalError) {
                                originalError.call(this, xhr, status, error);
                            }
                        };
                    }

                    return originalAjax.call(this, options);
                };

                iframeWin.guolv(1);

                setTimeout(() => {
                    original$.ajax = originalAjax;
                    reject(new Error('查询超时'));
                }, 8000);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 选中课程
    function selectCourse(course) {
        try {
            const iframe = document.querySelector("iframe");
            const iframeWin = iframe.contentWindow;

            if (typeof iframeWin.dealHiddenData !== 'function') {
                throw new Error('找不到选课函数');
            }

            iframeWin.dealHiddenData(course, true);
            console.log(`选中课程: ${course.kcm} - ${course.skjs} (余量:${course.bkskyl})`);
            return true;

        } catch (error) {
            console.error('选中课程失败:', error);
            return false;
        }
    }

    // 提交选课
    function submitCourse() {
        return new Promise((resolve, reject) => {
            const yzmArea = $("#yzm_area");
            if (yzmArea.length > 0 && yzmArea.css("display") !== "none" && !$("#submitCode").val()) {
                reject(new Error('请先输入验证码'));
                return;
            }

            const originalAjax = $.ajax;
            $.ajax = function(options) {
                if (options.url && options.url.includes('checkInputCodeAndSubmit')) {
                    const originalSuccess = options.success;
                    const originalError = options.error;

                    options.success = function(data) {
                        $.ajax = originalAjax;
                        if (originalSuccess) originalSuccess.call(this, data);

                        if (data.result === 'ok') {
                            resolve('选课成功');
                        } else {
                            reject(new Error(data.result));
                        }
                    };

                    options.error = function(xhr) {
                        $.ajax = originalAjax;
                        if (originalError) originalError.call(this, xhr);
                        reject(new Error(`提交失败: ${xhr.status}`));
                    };
                }
                return originalAjax.call(this, options);
            };

            // 直接调用，不做判断
            window.tijiao();
        });
    }

    // 主抢课逻辑
    async function performGrab() {
        try {
            updateButton('查询中...', `linear-gradient(135deg, ${THEME_COLORS.warning} 0%, #f57c00 100%)`);
            updateQueryCount();

            const data = await searchCourses();

            if (!data || !data.rwRxkZlList || data.rwRxkZlList.length === 0) {
                updateButton('未找到课程', `linear-gradient(135deg, ${THEME_COLORS.gray} 0%, #495057 100%)`);
                console.log('未找到课程');
                return false;
            }

            const availableCourse = data.rwRxkZlList.find(course => course.bkskyl > 0);

            if (!availableCourse) {
                updateButton('暂无余量', `linear-gradient(135deg, ${THEME_COLORS.gray} 0%, #495057 100%)`);
                console.log('暂无余量');
                return false;
            }

            // 发现有余量的课程，立即停止Worker
            if (worker) {
                worker.postMessage({ command: 'stop' });
            }

            updateButton('发现目标课程', `linear-gradient(135deg, ${THEME_COLORS.success} 0%, #388e3c 100%)`);
            console.log(`发现有余量课程: ${availableCourse.kcm}`);

            if (!selectCourse(availableCourse)) {
                updateButton('选中失败', `linear-gradient(135deg, ${THEME_COLORS.error} 0%, #d32f2f 100%)`);
                console.error('选中课程失败');
                stopAutoGrab();
                return false;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            updateButton('提交中...', `linear-gradient(135deg, ${THEME_COLORS.warning} 0%, #f57c00 100%)`);

            const result = await submitCourse();

            updateButton('✅ 选课成功', `linear-gradient(135deg, ${THEME_COLORS.success} 0%, #388e3c 100%)`);
            console.log(`✅ 选课成功: ${availableCourse.kcm} - ${availableCourse.skjs}`);

            stopAutoGrab();
            return true;

        } catch (error) {
            if (error.message.includes('验证码')) {
                updateButton('需要验证码', `linear-gradient(135deg, ${THEME_COLORS.warning} 0%, #f57c00 100%)`);
                console.log('需要输入验证码');
                stopAutoGrab();
                alert('请输入验证码后重新开始');
                return false;
            } else {
                updateButton('出现错误', `linear-gradient(135deg, ${THEME_COLORS.error} 0%, #d32f2f 100%)`);
                console.error('抢课出错:', error.message);
                stopAutoGrab();
                return false;
            }
        }
    }

    // 开始/停止抢课
    function toggleAutoGrab() {
        if (isRunning) {
            stopAutoGrab();
        } else {
            startAutoGrab();
        }
    }

    // 开始自动抢课
    function startAutoGrab() {
        isRunning = true;
        resetQueryCount();
        startTimer();
        console.log('🚀 开始自动抢课');
        updateButton('停止抢课', `linear-gradient(135deg, ${THEME_COLORS.error} 0%, #d32f2f 100%)`);

        // 初始化Web Worker
        if (!worker) {
            worker = createWorker();

            worker.addEventListener('message', async function(e) {
                if (e.data.type === 'tick' && isRunning) {
                    const success = await performGrab();
                    if (success) {
                        // 抢课成功，Worker已在performGrab中停止
                        console.log('抢课成功，已停止Worker');
                    }
                }
            });
        }

        // 立即执行一次
        performGrab();

        // 启动Worker定时器
        const interval = Math.floor(Math.random() * 100 + 400);
        worker.postMessage({ command: 'start', interval: interval });
    }

    // 停止自动抢课
    function stopAutoGrab() {
        isRunning = false;
        stopTimer();
        updateButton('开始抢课', `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primaryDark} 100%)`);

        // 停止Worker
        if (worker) {
            worker.postMessage({ command: 'stop' });
        }

        console.log('已停止抢课');
    }

    // 初始化
    function init() {
        const checkReady = setInterval(() => {
            const iframe = document.querySelector("iframe");
            if (iframe && iframe.contentWindow && document.querySelector('#myTab4')) {
                clearInterval(checkReady);
                setTimeout(() => {
                    createButton();
                    console.log('抢课脚本已就绪');
                }, 1000);
            }
        }, 1000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面卸载时清理Worker
    window.addEventListener('beforeunload', () => {
        if (worker) {
            worker.postMessage({ command: 'stop' });
            worker.terminate();
        }
    });

})();