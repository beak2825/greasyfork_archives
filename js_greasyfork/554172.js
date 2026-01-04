// ==UserScript==
// @name         奔驰监视脚本
// @namespace    http://tampermonkey.net
// @version      最终版
// @description  奔驰来单提醒 避免掉线
// @author       nafla
// @match        https://benzaudit-prod.situdata.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554172/%E5%A5%94%E9%A9%B0%E7%9B%91%E8%A7%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554172/%E5%A5%94%E9%A9%B0%E7%9B%91%E8%A7%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建菜单选择界面
    function createMenu() {
        const menuWindow = document.createElement('div');
        menuWindow.style.position = 'fixed';
        menuWindow.style.top = '50%';
        menuWindow.style.left = '50%';
        menuWindow.style.transform = 'translate(-50%, -50%)';
        menuWindow.style.backgroundColor = 'white';
        menuWindow.style.padding = '20px';
        menuWindow.style.borderRadius = '8px';
        menuWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        menuWindow.style.zIndex = '10000';

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cursor = 'move';
        titleBar.style.padding = '10px';
        titleBar.style.backgroundColor = '#f0f0f0';
        titleBar.style.marginBottom = '10px';
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.position = 'relative';

        // 创建一个更大的拖动区域，覆盖整个标题栏
        const dragArea = document.createElement('div');
        dragArea.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: move;
            z-index: 1;
        `;
        titleBar.appendChild(dragArea);

        // 调整标题文本和最小化按钮的层级
        const titleText = document.createElement('span');
        titleText.textContent = '自动刷新脚本';
        titleText.style.zIndex = '2';
        titleText.style.position = 'relative';

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '—';
        minimizeButton.style.cssText = `
            border: none;
            background: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 8px;
            color: #666;
            z-index: 2;
            position: relative;
        `;
        minimizeButton.title = '最小化';

        // 创建悬浮球
        const floatingBall = document.createElement('div');
        floatingBall.style.cssText = `
            position: fixed;
            width: 50px;
            height: 50px;
            background-color: #4CAF50;
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: white;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            left: 20px;
            top: 20px;
        `;
        floatingBall.textContent = '刷新';

        // 修改悬浮球的拖动区域
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 85%;
            cursor: move;
        `;

        const clickArea = document.createElement('div');
        clickArea.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 15%;
            cursor: pointer;
        `;

        floatingBall.appendChild(dragHandle);
        floatingBall.appendChild(clickArea);
        document.body.appendChild(floatingBall);

        titleBar.appendChild(dragArea);
        titleBar.appendChild(titleText);
        titleBar.appendChild(minimizeButton);
        menuWindow.appendChild(titleBar);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';

        const startButton = document.createElement('button');
        startButton.innerText = '开始运行';
        startButton.style.padding = '10px 20px';
        startButton.style.cursor = 'pointer';

        buttonContainer.appendChild(startButton);
        menuWindow.appendChild(buttonContainer);

        document.body.appendChild(menuWindow);

        // 最小化/还原功能
        let isMinimized = false;

        minimizeButton.addEventListener('click', () => {
            toggleWindow();
        });

        // 拖拽功能
        let isDraggingBall = false;
        let ballInitialX;
        let ballInitialY;
        let ballXOffset = 20;
        let ballYOffset = 20;

        dragHandle.addEventListener('mousedown', (e) => {
            isDraggingBall = true;
            ballInitialX = e.clientX - ballXOffset;
            ballInitialY = e.clientY - ballYOffset;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingBall) {
                e.preventDefault();
                ballXOffset = e.clientX - ballInitialX;
                ballYOffset = e.clientY - ballInitialY;
                floatingBall.style.left = `${ballXOffset}px`;
                floatingBall.style.top = `${ballYOffset}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingBall = false;
        });

        // 点击还原功能
        clickArea.addEventListener('click', () => {
            toggleWindow();
        });

        function toggleWindow() {
            if (!isMinimized) {
                // 最小化
                menuWindow.style.display = 'none';
                floatingBall.style.display = 'flex';
                isMinimized = true;
            } else {
                // 还原
                menuWindow.style.display = 'block';
                floatingBall.style.display = 'none';
                isMinimized = false;
            }
        }

        // 主窗口拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === titleBar || e.target === dragArea || e.target === titleText) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, menuWindow);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }

        startButton.addEventListener('click', () => {
            // 测试提示音
            console.log('🔊 播放测试提示音...');
            startButton.textContent = '正在播放测试音...';
            startButton.disabled = true;

            playAlertSound();

            // 延迟2秒后启动脚本，让用户听到测试音
            setTimeout(() => {
            menuWindow.remove();
            floatingBall.remove();
            runScript2();
            }, 2000);
        });
    }

    function playAlertSound() {
        console.log('🔊 尝试播放提示音...');

        // 方案1: 尝试播放在线音乐
        const audio = new Audio('https://aqqmusic.tc.qq.com/RS020629bVcQ1Nb6kK.mp3?guid=4154379670&vkey=AFCB77E4C5F9F50E95499402F938C8337E2BB661F61EC60F6EFD4A5424C1AFF2D3EC07BDC1292D6C1B91C35F8C7FB87EB5615BCA24CD1650__v2b9abd93&uin=1773239694&fromtag=123052');

        audio.play().then(() => {
            console.log('✅ 在线音乐播放成功');
        }).catch(err => {
            console.log('❌ 在线音乐播放失败:', err.message);
            console.log('🔄 切换到备用提示音（蜂鸣声）');
            // 方案2: 使用Web Audio API生成提示音
            playBeepSound();
        });

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            console.log('提示音已停止');
        }, 10000); // 播放10秒后停止
    }

    // 备用提示音：生成蜂鸣声
    function playBeepSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // 创建一个更复杂的提示音序列
            const playTone = (frequency, startTime, duration) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;

                // 音量渐变效果
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.01);
                gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            // 播放三声提示音：高-低-高
            const now = audioContext.currentTime;
            playTone(800, now, 0.3);        // 第一声：800Hz
            playTone(600, now + 0.4, 0.3);  // 第二声：600Hz
            playTone(800, now + 0.8, 0.5);  // 第三声：800Hz（稍长）

            console.log('✅ 备用提示音播放成功（三声蜂鸣）');

            // 5秒后关闭AudioContext
            setTimeout(() => {
                audioContext.close();
            }, 5000);
        } catch (e) {
            console.log('❌ 备用提示音也播放失败:', e.message);
        }
    }

    // 脚本2：
    function runScript2() {
        function logWithTime(message) {
            const now = new Date();
            const timestamp = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            console.log(`${timestamp} ${message}`);
        }

        logWithTime('脚本2开始初始化...');

        // API拦截器：监听工单查询请求
        let lastApiResponse = null;
        let apiCallCount = 0;
        let lastApiResponseTime = Date.now();
        let alertInterval = null; // 重复提醒定时器
        let hasUnconfirmedOrder = false; // 是否有未确认的工单
        let updateQueueDisplay = null; // 队列显示更新函数（后续初始化）

        // 统计数据
        let stats = {
            totalOrders: 0,        // 接到的总工单数
            startTime: Date.now(), // 启动时间
            lastOrderTime: null    // 最后一次来单时间
        };

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            // 检查是否是查询工单的API
            if (args[0] && args[0].includes('/stream/check/start')) {
                apiCallCount++;
                const clonedResponse = response.clone();

                try {
                    const data = await clonedResponse.json();
                    lastApiResponse = data;
                    lastApiResponseTime = Date.now(); // 记录API响应时间

                    logWithTime(`🌐 API调用 #${apiCallCount}: /stream/check/start`);

                    // 详细日志：显示完整响应
                    logWithTime(`📡 完整响应: ${JSON.stringify(data)}`);

                    if (data.code === -1) {
                        logWithTime('⚠️ API返回: 登录失效');
                        playAlertSound();
                    } else if (data.code === 0 || data.code === 200) {
                        // 更精确的判断：需要有具体工单内容，而不仅仅是统计数字
                        const hasRealData = data.data &&
                                           typeof data.data === 'object' &&
                                           data.data !== null &&
                                           // 检查是否有具体的工单内容字段（不只是audit/wait统计）
                                           (data.data.fileType ||      // 有文件类型
                                            data.data.appFileType ||   // 有APP文件类型
                                            data.data.factoryVin ||    // 有工厂VIN
                                            data.data.appVin ||        // 有APP VIN
                                            data.data.fileUrl ||       // 有文件URL
                                            data.data.situId ||        // 有工单ID
                                            data.data.nextStep);       // 有下一步操作

                        if (hasRealData) {
                            logWithTime('✅ API返回: 检测到新工单数据（有具体内容）');
                            logWithTime(`📦 工单详情: ${JSON.stringify(data.data).substring(0, 200)}...`);
                        } else if (data.data && (data.data.audit > 0 || data.data.wait > 0)) {
                            logWithTime(`ℹ️ API返回: 已审核${data.data.audit}个，等待中${data.data.wait}个（暂无新工单分配）`);
                        } else {
                            logWithTime('ℹ️ API返回: 暂无工单');
                        }

                        // 更新队列显示
                        if (data.data && updateQueueDisplay) {
                            updateQueueDisplay(data.data.audit, data.data.wait);
                        }
                    } else {
                        logWithTime(`ℹ️ API返回: code=${data.code}, message=${data.message || '无'}`);
                    }
                } catch (e) {
                    logWithTime(`❌ API响应解析失败: ${e.message}`);
                }
            }

            return response;
        };

        // 同时拦截XMLHttpRequest（兼容性）
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes('/stream/check/start')) {
                this.addEventListener('load', function() {
                    try {
                        const data = JSON.parse(this.responseText);
                        apiCallCount++;
                        lastApiResponse = data;
                        lastApiResponseTime = Date.now(); // 记录API响应时间

                        logWithTime(`🌐 XHR调用 #${apiCallCount}: /stream/check/start`);

                        // 详细日志：显示完整响应
                        logWithTime(`📡 完整响应: ${JSON.stringify(data)}`);

                        if (data.code === -1) {
                            logWithTime('⚠️ XHR返回: 登录失效');
                            playAlertSound();
                        } else if (data.code === 0 || data.code === 200) {
                            // 更精确的判断：需要有具体工单内容，而不仅仅是统计数字
                            const hasRealData = data.data &&
                                               typeof data.data === 'object' &&
                                               data.data !== null &&
                                               // 检查是否有具体的工单内容字段（不只是audit/wait统计）
                                               (data.data.fileType ||      // 有文件类型
                                                data.data.appFileType ||   // 有APP文件类型
                                                data.data.factoryVin ||    // 有工厂VIN
                                                data.data.appVin ||        // 有APP VIN
                                                data.data.fileUrl ||       // 有文件URL
                                                data.data.situId ||        // 有工单ID
                                                data.data.nextStep);       // 有下一步操作

                            if (hasRealData) {
                                logWithTime('✅ XHR返回: 检测到新工单数据（有具体内容）');
                                logWithTime(`📦 工单详情: ${JSON.stringify(data.data).substring(0, 200)}...`);
                            } else if (data.data && (data.data.audit > 0 || data.data.wait > 0)) {
                                logWithTime(`ℹ️ XHR返回: 已审核${data.data.audit}个，等待中${data.data.wait}个（暂无新工单分配）`);
                            } else {
                                logWithTime('ℹ️ XHR返回: 暂无工单');
                            }

                            // 更新队列显示
                            if (data.data && updateQueueDisplay) {
                                updateQueueDisplay(data.data.audit, data.data.wait);
                            }
                        } else {
                            logWithTime(`ℹ️ XHR返回: code=${data.code}, message=${data.message || '无'}`);
                        }
                    } catch (e) {
                        logWithTime(`❌ XHR响应解析失败: ${e.message}`);
                    }
                });
            }
            return originalSend.apply(this, arguments);
        };

        function startProcess() {
            let isRunning = true;
            let lastEventTime = 0;
            let currentTimer = null;
            const EVENT_THROTTLE = 500;

            // 创建控制面板
            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 999999;
            `;

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // 创建暂停/继续按钮
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '暂停';
            toggleButton.style.cssText = `
                padding: 5px 10px;
                background-color: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            // 创建返回主菜单按钮
            const backButton = document.createElement('button');
            backButton.textContent = '返回主菜单';
            backButton.style.cssText = `
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            // 添加按钮点击事件
            toggleButton.addEventListener('click', () => {
                isRunning = !isRunning;
                if (isRunning) {
                    toggleButton.textContent = '暂停';
                    toggleButton.style.backgroundColor = '#ff4444';
                    logWithTime('脚本已继续运行');
                    executeLogic(); // 立即执行一次
                } else {
                    toggleButton.textContent = '继续';
                    toggleButton.style.backgroundColor = '#4CAF50';
                    if (currentTimer) {
                        clearTimeout(currentTimer);
                    }
                    logWithTime('脚本已暂停');
                }
            });

            backButton.addEventListener('click', () => {
                // 清理当前运行的脚本
                isRunning = false;
                if (currentTimer) {
                    clearTimeout(currentTimer);
                }
                controlPanel.remove();

                // 移除所有事件监听器
                document.removeEventListener('keydown', handleUserAction);
                document.removeEventListener('mousedown', handleUserAction);
                document.removeEventListener('click', handleUserAction);

                logWithTime('返回主菜单');
                // 重新创建选择菜单
                createMenu();
            });

            // 创建确认按钮（来单时显示）
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '✅ 确认工单';
            confirmButton.style.cssText = `
                padding: 8px 15px;
                background-color: #ff9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                display: none;
                animation: pulse 1s infinite;
            `;

            // 添加脉冲动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 152, 0, 0); }
                }
            `;
            document.head.appendChild(style);

            confirmButton.addEventListener('click', () => {
                hasUnconfirmedOrder = false;
                confirmButton.style.display = 'none';
                if (alertInterval) {
                    clearInterval(alertInterval);
                    alertInterval = null;
                }
                logWithTime('✅ 用户已确认工单');
                stats.totalOrders++;
            });

            // 创建统计按钮
            const statsButton = document.createElement('button');
            statsButton.textContent = '📊 统计';
            statsButton.style.cssText = `
                padding: 5px 10px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            statsButton.addEventListener('click', () => {
                const runTime = Math.floor((Date.now() - stats.startTime) / 1000 / 60); // 分钟
                const lastOrderInfo = stats.lastOrderTime
                    ? `最后来单: ${new Date(stats.lastOrderTime).toLocaleTimeString()}`
                    : '还未接到工单';

                alert(`📊 工作统计\n\n运行时长: ${runTime}分钟\n接单总数: ${stats.totalOrders}个\n${lastOrderInfo}`);
                logWithTime(`📊 统计查询 - 运行${runTime}分钟，接单${stats.totalOrders}个`);
            });

            // 创建队列显示面板
            const queuePanel = document.createElement('div');
            queuePanel.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 15px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            queuePanel.innerHTML = `
                <span style="font-size: 18px;">📋</span>
                <span>已审核: <span id="audit-count">0</span></span>
                <span style="margin-left: 10px;">⏳</span>
                <span>排队: <span id="wait-count">0</span></span>
            `;

            // 添加按钮到按钮容器
            buttonContainer.appendChild(toggleButton);
            buttonContainer.appendChild(backButton);
            buttonContainer.appendChild(statsButton);
            buttonContainer.appendChild(confirmButton);

            // 添加到控制面板
            controlPanel.appendChild(queuePanel);
            controlPanel.appendChild(buttonContainer);
            document.body.appendChild(controlPanel);

            // 更新队列显示（赋值到外部变量）
            updateQueueDisplay = function(audit, wait) {
                const auditElement = document.getElementById('audit-count');
                const waitElement = document.getElementById('wait-count');

                if (auditElement) {
                    auditElement.textContent = audit || 0;
                }
                if (waitElement) {
                    waitElement.textContent = wait || 0;
                    // 如果有排队，高亮显示
                    if (wait > 0) {
                        waitElement.style.color = '#ffeb3b';
                        waitElement.style.fontSize = '16px';
                        waitElement.parentElement.style.animation = 'pulse 1s infinite';
                    } else {
                        waitElement.style.color = 'white';
                        waitElement.style.fontSize = '14px';
                        waitElement.parentElement.style.animation = 'none';
                    }
                }
            };

            // 执行主要逻辑
            async function executeLogic() {
                try {
                    // 首先检查是否仍在运行
                    if (!isRunning) {
                        logWithTime('脚本已暂停，停止执行');
                        return;
                    }

                    logWithTime('开始检查...');

                    // 检查当前是否已在目标页面
                    const currentUrl = window.location.href;
                    const TARGET_URL = 'https://benzaudit-prod.situdata.com/trutheye-fe/#/streamFactory/streamFactoryCheck';
                    const BOARD_URL = 'https://benzaudit-prod.situdata.com/trutheye-fe/#/streamFactory/board';

                    if (!isRunning) return; // 再次检查

                    if (currentUrl !== TARGET_URL) {
                        logWithTime('当前不在目标页面，正在跳转...');
                        window.location.href = TARGET_URL;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        logWithTime('已在目标页面，继续执行...');
                    }

                    if (!isRunning) return; // 再次检查

                    const errorTexts = ['登录失效', '网络异常', '网络错误', '连接失败'];
                    const errorWindow = [...document.querySelectorAll('div, span, p')]
                        .find(el => errorTexts.some(text => el.textContent.includes(text)) &&
                              el.offsetParent !== null &&
                              window.getComputedStyle(el).display !== 'none' &&
                              window.getComputedStyle(el).visibility !== 'hidden'
                        );

                    if (errorWindow) {
                        logWithTime(`检测到错误提示: ${errorWindow.textContent}`);
                        if (isRunning) playAlertSound();
                    } else {
                        const startButton = document.querySelector('.el-button.btn.el-button--primary');
                        if (startButton) {
                            logWithTime('找到开始按钮');

                            // 检查按钮文本是否为"开始"
                            const buttonText = startButton.querySelector('span').textContent;
                            if (buttonText === '开始') {
                                if (!isRunning) return; // 暂停时不点击按钮
                                logWithTime('点击开始按钮');
                                startButton.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            } else {
                                if (!isRunning) return; // 暂停时不刷新页面
                                logWithTime('开始按钮不可用，尝试刷新...');
                                // 跳转到看板页面
                                logWithTime('跳转到看板页面');
                                window.location.href = BOARD_URL;
                                await new Promise(resolve => setTimeout(resolve, 2000));

                                if (!isRunning) return;
                                // 跳转回目标页面
                                logWithTime('跳转回目标页面');
                                window.location.href = TARGET_URL;
                                await new Promise(resolve => setTimeout(resolve, 2000));

                                if (!isRunning) return;
                                // 等待页面加载并点击按钮
                                logWithTime('等待页面加载...');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                const refreshedButton = document.querySelector('.el-button.btn.el-button--primary');
                                if (refreshedButton && refreshedButton.querySelector('span').textContent === '开始') {
                                    if (!isRunning) return;
                                    logWithTime('点击刷新后的开始按钮');
                                    refreshedButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        } else {
                            if (!isRunning) return; // 暂停时不刷新页面
                            logWithTime('未找到开始按钮，尝试刷新...');
                            // 跳转到看板页面
                            logWithTime('跳转到看板页面');
                            window.location.href = BOARD_URL;
                            await new Promise(resolve => setTimeout(resolve, 2000));

                            if (!isRunning) return;
                            // 跳转回目标页面
                            logWithTime('跳转回目标页面');
                            window.location.href = TARGET_URL;
                            await new Promise(resolve => setTimeout(resolve, 2000));

                            if (!isRunning) return;
                            // 等待页面加载并点击按钮
                            logWithTime('等待页面加载...');
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            const refreshedButton = document.querySelector('.el-button.btn.el-button--primary');
                            if (refreshedButton && refreshedButton.querySelector('span').textContent === '开始') {
                                if (!isRunning) return;
                                logWithTime('点击刷新后的开始按钮');
                                refreshedButton.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }

                    if (isRunning) {
                        // 多重检测：API响应 + DOM状态
                        const originalConsoleLog = console.log;
                        let foundQueryMessage = false;

                        console.log = function() {
                            originalConsoleLog.apply(console, arguments);
                            // 监控控制台消息（仅用于日志记录，不作为判断依据）
                            if (Array.from(arguments).some(arg =>
                                typeof arg === 'string' && arg.includes('查询新单'))) {
                                foundQueryMessage = true;
                            }
                        };

                        // 增加延迟到9秒，避免检测到点击按钮瞬间的DOM变化
                        setTimeout(() => {
                            // 检查是否距离上次API响应太近（避免检测到初始化状态）
                            const timeSinceLastApi = Date.now() - lastApiResponseTime;
                            if (timeSinceLastApi < 3000) {
                                logWithTime('⏰ 距离API响应时间太近，跳过本次DOM检测（防止误判初始化状态）');
                                console.log = originalConsoleLog;
                                return;
                            }

                            // DOM状态检测
                            const loadingMask = document.querySelector('.el-loading-mask');
                            const isLoading = loadingMask && loadingMask.style.display !== 'none';

                            const formItems = document.querySelectorAll('.el-form-item--medium');
                            const visibleForms = Array.from(formItems).filter(item =>
                                item.style.display !== 'none'
                            );

                            const vinInput = document.querySelector('#build');
                            const vinInputEnabled = vinInput && !vinInput.disabled;

                            // 额外检查：VIN输入框是否真的有值或可输入
                            const vinHasValue = vinInput && vinInput.value && vinInput.value.trim().length > 0;

                            // 综合判断
                            let detectionScore = 0;

                            // 检查0: API响应（最高优先级）
                            let hasOrderFromApi = false;
                            if (lastApiResponse) {
                                if (lastApiResponse.code === -1) {
                                    logWithTime('🚨 API检测: 登录失效！');
                                    playAlertSound();
                                    // 恢复原始的console.log
                                    console.log = originalConsoleLog;
                                    return; // 直接返回，不继续检测
                                } else if (lastApiResponse.code === 0 || lastApiResponse.code === 200) {
                                    // 更精确的判断：需要有具体工单内容
                                    const hasRealData = lastApiResponse.data &&
                                                       typeof lastApiResponse.data === 'object' &&
                                                       lastApiResponse.data !== null &&
                                                       // 只检查具体内容字段，不看audit/wait统计
                                                       (lastApiResponse.data.fileType ||
                                                        lastApiResponse.data.appFileType ||
                                                        lastApiResponse.data.factoryVin ||
                                                        lastApiResponse.data.appVin ||
                                                        lastApiResponse.data.fileUrl ||
                                                        lastApiResponse.data.situId ||
                                                        lastApiResponse.data.nextStep);

                                    if (hasRealData) {
                                        detectionScore += 2; // API有真实工单内容，权重最高
                                        hasOrderFromApi = true;
                                        logWithTime('✅✅ API检测: 有工单数据（高权重+2）');
                                    } else if (lastApiResponse.data && (lastApiResponse.data.audit > 0 || lastApiResponse.data.wait > 0)) {
                                        logWithTime(`ℹ️ API检测: 已审核${lastApiResponse.data.audit}个（但未分配到新工单）`);
                                    } else {
                                        logWithTime('ℹ️ API检测: data存在但无有效值');
                                    }
                                }
                            }

                            // 记录控制台消息（不计入评分，仅作监控）
                            if (foundQueryMessage) {
                                logWithTime('ℹ️ 控制台: 检测到"查询新单"消息（表示正在查询）');
                            }

                            // 检查1: 表单可见性
                            if (visibleForms.length > 0) {
                                detectionScore++;
                                logWithTime(`✅ 检测到${visibleForms.length}个表单项可见`);
                            }

                            // 检查2: VIN输入框状态（更严格：需要激活且有内容或真正可输入）
                            if (vinInputEnabled && (vinHasValue || visibleForms.length > 3)) {
                                detectionScore++;
                                logWithTime(`✅ VIN输入框已激活${vinHasValue ? '（有内容）' : ''}`);
                            } else if (vinInputEnabled) {
                                logWithTime('⚠️ VIN输入框已激活但无内容，可能是初始化状态');
                            }

                            // 检查3: 是否还在加载中
                            if (isLoading) {
                                logWithTime('⏳ 系统仍在加载中...');
                            }

                            // 综合评分判断（总分最高4分：API(2) + 表单(1) + VIN(1)）
                            if (detectionScore >= 3) {
                                logWithTime(`🎉 确认有新工单（评分: ${detectionScore}/4）`);
                                logWithTime('🔔 播放来单提醒音...');
                                playAlertSound(); // 有工单时播放长提示音

                                // 启动重复提醒
                                if (!hasUnconfirmedOrder) {
                                    hasUnconfirmedOrder = true;
                                    confirmButton.style.display = 'block';
                                    stats.lastOrderTime = Date.now(); // 记录来单时间
                                    logWithTime('⏰ 启动重复提醒（每30秒）');

                                    // 清除旧的提醒定时器
                                    if (alertInterval) {
                                        clearInterval(alertInterval);
                                    }

                                    // 每30秒重复提醒
                                    alertInterval = setInterval(() => {
                                        if (hasUnconfirmedOrder) {
                                            logWithTime('🔔 重复提醒：有未确认的工单');
                                            playBeepSound(); // 使用短提示音
                                        }
                                    }, 30000);
                                }
                            } else if (detectionScore >= 1) {
                                logWithTime(`⚠️ 检测评分: ${detectionScore}/4 （低置信度）`);
                                if (hasOrderFromApi) {
                                    // API确认有单，即使其他检测不通过，也应该提醒
                                    logWithTime('🔔 API确认有单，播放提醒音...');
                                    playAlertSound();

                                    // 启动重复提醒
                                    if (!hasUnconfirmedOrder) {
                                        hasUnconfirmedOrder = true;
                                        confirmButton.style.display = 'block';
                                        stats.lastOrderTime = Date.now(); // 记录来单时间
                                        logWithTime('⏰ 启动重复提醒（每30秒）');

                                        if (alertInterval) {
                                            clearInterval(alertInterval);
                                        }

                                        alertInterval = setInterval(() => {
                                            if (hasUnconfirmedOrder) {
                                                logWithTime('🔔 重复提醒：有未确认的工单');
                                                playBeepSound();
                                            }
                                        }, 30000);
                                    }
                                }
                            } else if (detectionScore === 0 && !isLoading) {
                                logWithTime(`ℹ️ 未检测到工单（评分: ${detectionScore}/4）`);
                            } else {
                                logWithTime(`ℹ️ 检测评分: ${detectionScore}/4`);
                            }

                            // 恢复原始的console.log
                            console.log = originalConsoleLog;
                        }, 9000);

                        currentTimer = setTimeout(executeLogic, 10000);
                    }

                } catch (error) {
                    logWithTime(`执行出错: ${error.message}`, 'error');
                    if (isRunning) {
                        currentTimer = setTimeout(executeLogic, 10000);
                    }
                }
            }

            // 用户操作检测
            function handleUserAction(event) {
                if (!event.isTrusted) return;

                const now = Date.now();
                if (now - lastEventTime < EVENT_THROTTLE) return;

                lastEventTime = now;
                logWithTime(`检测到用户${event.type}操作，延长等待时间`);

                if (currentTimer) {
                    clearTimeout(currentTimer);
                    if (isRunning) {
                        currentTimer = setTimeout(executeLogic, 10000);
                    }
                }
            }

            // 设置事件监听器
            document.addEventListener('keydown', handleUserAction, { passive: true });
            document.addEventListener('mousedown', handleUserAction, { passive: true });
            document.addEventListener('click', handleUserAction, { passive: true });

            // 初始化执行
            executeLogic();
        }

        startProcess();
    }

    // 短提示音（已被playBeepSound替代，保留以防万一）
    function playShortAlert() {
        console.log('🔊 播放短提示音');
        playBeepSound();
    }

    // 启动菜单
    createMenu();

})();