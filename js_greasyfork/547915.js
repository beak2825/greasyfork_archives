// ==UserScript==
// @name         安徽继续教育全自动刷课终极版
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  [稳定版]
// @author       xiaohanxi
// @match        *://main.ahjxjy.cn/study/html/content/studying/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @license      GPL 3
// @downloadURL https://update.greasyfork.org/scripts/547915/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E7%BB%88%E6%9E%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/547915/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E7%BB%88%E6%9E%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const unsafe = unsafeWindow || window;
    const state = {
        panel: null,
        isCollapsed: GM_getValue('panelCollapsed', false),
        currentSpeed: GM_getValue('playbackSpeed', 1),
        volumeLevel: GM_getValue('volumeLevel', 1),
        userInteracted: false,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        isAutoJumpEnabled: GM_getValue('isAutoJumpEnabled', true),
        logMessages: [],
        isPlaying: false,
        hasConfirmedGroup: GM_getValue('hasConfirmedGroup', false)
    };

    // QQ群信息（替换为实际群号）
    const QQ_GROUP_INFO = {
        number: "1038024672", // 你的QQ群号
        description: "获取脚本更新、使用帮助和问题反馈",
        // QQ加群链接格式：https://qm.qq.com/cgi-bin/qm/qr?k=群密钥&jump_from=webapi
        // 可通过QQ群设置中的"群推广"获取具体链接
        url: "https://qm.qq.com/q/dVaitVAAQ8"
    };

    // 错误捕获函数
    function logError(message, error) {
        const errorMsg = `[错误] ${message}: ${error.message || error}`;
        console.error(errorMsg);
        state.logMessages.push(`[${new Date().toLocaleTimeString()}] ${errorMsg}`);
    }

    // 显示QQ群提示（可点击跳转）
    function showGroupPrompt() {
        if (state.hasConfirmedGroup) return;

        const promptDiv = document.createElement('div');
        promptDiv.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483648;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 24px;
            width: 320px;
            text-align: center;
        `;

        promptDiv.innerHTML = `
            <h3 style="margin-top: 0;">欢迎使用刷课脚本</h3>
            <p>为了更好地获取脚本更新和使用帮助，建议加入QQ群：</p>
            <a href="${QQ_GROUP_INFO.url}" target="_blank" style="font-size: 1.2em; font-weight: bold; margin: 15px 0; display: inline-block; color: #4CAF50; text-decoration: underline;">
                ${QQ_GROUP_INFO.number}
            </a>
            <p>${QQ_GROUP_INFO.description}</p>
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button class="confirm-btn" style="padding: 8px 20px; border: none; border-radius: 6px; background: #4CAF50; color: white; cursor: pointer;">
                    已加入/知道了
                </button>
            </div>
        `;

        document.body.appendChild(promptDiv);

        promptDiv.querySelector('.confirm-btn').addEventListener('click', () => {
            document.body.removeChild(promptDiv);
            state.hasConfirmedGroup = true;
            GM_setValue('hasConfirmedGroup', true);
        });
    }

    // 修复混合内容问题
    function fixMixedContent() {
        try {
            document.querySelectorAll('script[src^="http://"]').forEach(script => {
                if (script.src.includes('socket.io')) {
                    const httpsSrc = script.src.replace('http://', 'https://');
                    script.src = httpsSrc;
                }
            });
        } catch (error) {
            logError('修复混合内容时出错', error);
        }
    }

    // 强化样式
    GM_addStyle(`
    .control-panel {
        position: fixed;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2147483647;
        background: rgba(255,255,255,0.98);
        border-radius: 24px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.18);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        overflow: hidden;
        cursor: grab;
        opacity: 0.95;
        width: ${state.isCollapsed ? '60px' : '320px'};
        max-height: ${state.isCollapsed ? '60px' : '500px'};
        display: block !important;
    }

    .panel-content {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .function-toggle {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .toggle-switch {
        position: relative;
        width: 60px;
        height: 34px;
    }

    .toggle-switch input {
        display: none;
    }

    .slider-switch {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 34px;
        transition: 0.4s;
    }

    .slider-switch:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 50%;
        transition: 0.4s;
    }

    input:checked + .slider-switch {
        background-color: #4CAF50;
    }

    input:checked + .slider-switch:before {
        transform: translateX(26px);
    }

    .log-container {
        height: 120px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 12px;
        font-size: 0.9em;
        color: #666;
    }

    .log-message {
        margin: 4px 0;
    }

    .control-btn {
        padding: 12px 24px;
        border-radius: 24px;
        border: none;
        background: #f0f0f0;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .control-btn:hover {
        background: #e0e0e0;
    }

    .control-btn:active {
        transform: scale(0.98);
    }

    .control-btn.play-btn {
        background: #4CAF50;
        color: white;
    }

    .control-btn.play-btn:hover {
        background: #45a049;
    }

    .speed-slider-container {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .speed-value {
        min-width: 30px;
        text-align: center;
        font-weight: bold;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        background: #ddd;
        border-radius: 2px;
        margin-top: 8px;
        cursor: pointer;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 24px;
        height: 24px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
    }

    .volume-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        background: #ddd;
        border-radius: 2px;
        margin-top: 8px;
        cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 24px;
        height: 24px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
    }

    /* 群号链接样式 */
    .group-link {
        color: #4CAF50;
        text-decoration: underline;
        cursor: pointer;
        font-weight: bold;
    }
    .group-link:hover {
        color: #45a049;
    }
    `);

    // 创建控制面板
    function createControlPanel() {
        try {
            const panel = document.createElement('div');
            panel.className = `control-panel${state.isCollapsed ? ' collapsed' : ''}`;
            panel.id = 'autoCoursePanel';

            panel.innerHTML = `
                <div class="panel-content">
                    <button class="control-btn play-btn">
                        ${state.isPlaying ? '⏸ 暂停' : '▶ 播放'}
                    </button>

                    <div class="speed-slider-container">
                        <span>倍速:</span>
                        <input type="range" class="slider speed-slider" min="0.5" max="16" step="0.1" value="${state.currentSpeed}">
                        <span class="speed-value">${state.currentSpeed.toFixed(1)}×</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span>音量:</span>
                        <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${state.volumeLevel}">
                    </div>

                    <div class="function-toggle">
                        <span>自动跳转:</span>
                        <div class="toggle-switch">
                            <input type="checkbox" id="autoJumpToggle" ${state.isAutoJumpEnabled ? 'checked' : ''}>
                            <label class="slider-switch" for="autoJumpToggle"></label>
                        </div>
                    </div>

                    <!-- 群聊信息提示（可点击跳转） -->
                    <div style="padding: 10px; background: #f5f5f5; border-radius: 8px; font-size: 0.9em;">
                        <p style="margin: 0 0 5px 0; font-weight: bold;">获取帮助与更新</p>
                        <p style="margin: 0; color: #666;">
                            QQ群: <a href="${QQ_GROUP_INFO.url}" target="_blank" class="group-link">${QQ_GROUP_INFO.number}</a>
                        </p>
                    </div>

                    <div class="log-container">
                        <span>操作日志:</span>
                        <div id="logDisplay"></div>
                    </div>

                    <button class="control-btn collapse-btn">
                        ${state.isCollapsed ? '展开' : '折叠'}
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                            <path d="${state.isCollapsed ? 'M12 8l-6 6 6 6' : 'M19 9l-6 6-6-6'}"/>
                        </svg>
                    </button>
                </div>
            `;

            // 事件绑定
            panel.addEventListener('click', function(e) {
                const btn = e.target.closest('.control-btn');
                if (btn) {
                    if (btn.classList.contains('play-btn')) {
                        state.userInteracted = true;
                        togglePlay();
                    } else if (btn.classList.contains('collapse-btn')) {
                        togglePanel();
                    }
                } else if (state.isCollapsed) {
                    togglePanel();
                }
            });

            // 功能开关事件
            const toggleSwitch = panel.querySelector('#autoJumpToggle');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('change', function() {
                    state.isAutoJumpEnabled = this.checked;
                    GM_setValue('isAutoJumpEnabled', state.isAutoJumpEnabled);
                    logMessage(`自动跳转功能已${this.checked ? '启用' : '禁用'}`);
                });
            }

            // 倍速滑块
            const speedSlider = panel.querySelector('.speed-slider');
            speedSlider.addEventListener('input', function() {
                const speedValue = parseFloat(this.value);
                setSpeed(speedValue);
                panel.querySelector('.speed-value').textContent = `${speedValue.toFixed(1)}×`;
                logMessage(`设置倍速为 ${speedValue.toFixed(1)}×`);
            });

            // 音量滑块
            const volumeSlider = panel.querySelector('.volume-slider');
            volumeSlider.addEventListener('input', function() {
                const volumeValue = parseFloat(this.value);
                setVolume(volumeValue);
                logMessage(`设置音量为 ${(volumeValue * 100).toFixed(0)}%`);
            });

            // 拖拽事件
            if (!state.isCollapsed) {
                panel.addEventListener('mousedown', startDrag);
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', stopDrag);
            }

            return panel;
        } catch (error) {
            logError('创建控制面板时出错', error);
            return null;
        }
    }

    // 操作日志
    function logMessage(message) {
        state.logMessages.push(`[${new Date().toLocaleTimeString()}] ${message}`);
        if (state.logMessages.length > 20) state.logMessages.shift();

        const logDisplay = state.panel?.querySelector('#logDisplay');
        if (logDisplay) {
            logDisplay.innerHTML = state.logMessages.map(msg => `<div class="log-message">${msg}</div>`).join('');
        }
    }

    // 播放控制
    function togglePlay() {
        try {
            const video = document.querySelector('.jw-video.jw-reset');
            if (video) {
                state.isPlaying = !state.isPlaying;
                if (state.isPlaying) {
                    video.play()
                       .then(() => logMessage('视频开始播放'))
                       .catch(error => {
                            logMessage(`播放失败: ${error.message}`);
                            video.muted = true;
                            video.play()
                               .then(() => logMessage('已静音播放'))
                               .catch(err => logMessage(`静音播放仍失败: ${err.message}`));
                        });
                } else {
                    video.pause();
                    logMessage('视频已暂停');
                }
                // 更新播放/暂停按钮文本
                const playBtn = state.panel.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.innerHTML = state.isPlaying ? '⏸ 暂停' : '▶ 播放';
                }
            } else {
                logMessage('未找到视频元素');
            }
        } catch (error) {
            logError('播放控制出错', error);
        }
    }

    // 面板折叠
    function togglePanel() {
        try {
            state.isCollapsed = !state.isCollapsed;
            GM_setValue('panelCollapsed', state.isCollapsed);
            state.panel.classList.toggle('collapsed', state.isCollapsed);
            state.panel.style.width = state.isCollapsed ? '60px' : '320px';
            state.panel.style.maxHeight = state.isCollapsed ? '60px' : '500px';
            autoDockPanel();
            logMessage(`面板状态变更为 ${state.isCollapsed ? '折叠' : '展开'}`);

            const collapseBtn = state.panel.querySelector('.collapse-btn');
            if (collapseBtn) {
                if (state.isCollapsed) {
                    collapseBtn.innerHTML = `展开<svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M12 8l-6 6 6 6"/></svg>`;
                    state.panel.removeEventListener('mousedown', startDrag);
                    document.removeEventListener('mousemove', handleDrag);
                    document.removeEventListener('mouseup', stopDrag);
                } else {
                    collapseBtn.innerHTML = `折叠<svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M19 9l-6 6-6-6"/></svg>`;
                    state.panel.addEventListener('mousedown', startDrag);
                    document.addEventListener('mousemove', handleDrag);
                    document.addEventListener('mouseup', stopDrag);
                }
            }
        } catch (error) {
            logError('面板折叠操作出错', error);
        }
    }

    // 自动靠边
    function autoDockPanel() {
        try {
            const savedLeft = GM_getValue('panelPosition', 20);
            const savedTop = GM_getValue('panelTop', '50%');
            state.panel.style.left = state.isCollapsed ?
                `${window.innerWidth - 60}px` :
                `${Math.max(20, Math.min(savedLeft, window.innerWidth - 340))}px`;
            state.panel.style.top = state.isCollapsed ? '50%' : savedTop;
        } catch (error) {
            logError('自动靠边时出错', error);
        }
    }

    // 设置播放速度
    function setSpeed(speed) {
        try {
            speed = Math.min(Math.max(speed, 0.5), 16);
            state.currentSpeed = speed;
            GM_setValue('playbackSpeed', speed);

            const video = document.querySelector('.jw-video.jw-reset');
            if (video) {
                video.playbackRate = speed;
            }
        } catch (error) {
            logError('设置播放速度时出错', error);
        }
    }

    // 设置音量
    function setVolume(volume) {
        try {
            volume = Math.min(Math.max(volume, 0), 1);
            state.volumeLevel = volume;
            GM_setValue('volumeLevel', volume);

            const video = document.querySelector('.jw-video.jw-reset');
            if (video) {
                video.volume = volume;
            }
        } catch (error) {
            logError('设置音量时出错', error);
        }
    }

    // 自动跳转
    function handleVideoEnd() {
        try {
            if (!state.isAutoJumpEnabled) {
                logMessage('自动跳转已禁用，跳过跳转');
                return;
            }

            logMessage('检测到视频播放结束');
            const nextLink = findValidNextLink();

            if (nextLink) {
                logMessage(`找到链接：${nextLink.textContent}`);
                logMessage('10秒后执行跳转');
                setTimeout(() => {
                    triggerNavigation(nextLink.href);
                    logMessage('跳转完成');
                }, 10000);
            } else {
                logMessage('未找到有效链接，5秒后重试');
                setTimeout(() => handleVideoEnd(), 5000);
            }
        } catch (error) {
            logError('处理视频结束事件时出错', error);
        }
    }

    // 查找有效链接
    function findValidNextLink() {
        try {
            return Array.from(document.querySelectorAll('a.btn.btn-green'))
               .find(a => {
                    const text = a.textContent.trim();
                    return text === '进入下一单元' &&
                        a.href &&
                        a.href !== location.href &&
                        !a.href.includes('javascript');
                });
        } catch (error) {
            logError('查找下一课链接时出错', error);
            return null;
        }
    }

    // 触发导航
    function triggerNavigation(url) {
        try {
            if (!url) return;

            logMessage(`正在跳转到: ${url}`);
            window.location.href = url;
        } catch (error) {
            logError('导航跳转时出错', error);
        }
    }

    // 初始化视频监听
    function initVideoListener() {
        try {
            const video = document.querySelector('.jw-video.jw-reset');
            if (video) {
                video.addEventListener('ended', handleVideoEnd);
                video.playbackRate = state.currentSpeed;
                video.volume = state.volumeLevel;

                // 尝试自动播放
                if (state.userInteracted && video.paused) {
                    video.play()
                       .catch(error => {
                            logMessage(`自动播放失败: ${error.message}`);
                            logMessage('请点击播放按钮开始播放');
                        });
                }
            } else {
                logMessage('未找到视频元素，将继续监控');
            }
        } catch (error) {
            logError('初始化视频监听时出错', error);
        }
    }

    // 拖拽处理
    function startDrag(e) {
        try {
            // 检查是否点击了滑块或开关，避免干扰
            const isSlider = e.target.classList.contains('speed-slider') ||
                           e.target.classList.contains('volume-slider') ||
                           e.target.classList.contains('slider') ||
                           e.target.classList.contains('slider-switch');

            if (isSlider) return;

            state.isDragging = true;
            state.dragStartX = e.clientX - parseFloat(state.panel.style.left);
            state.dragStartY = e.clientY - (parseFloat(state.panel.style.top) || 50);
            state.panel.style.cursor = 'grabbing';
        } catch (error) {
            logError('开始拖拽时出错', error);
        }
    }

    function handleDrag(e) {
        try {
            if (!state.isDragging || state.isCollapsed) return;

            const newLeft = e.clientX - state.dragStartX;
            const newTop = e.clientY - state.dragStartY;

            state.panel.style.left = `${Math.max(20, Math.min(newLeft, window.innerWidth - 340))}px`;
            state.panel.style.top = `${Math.max(20, Math.min(newTop, window.innerHeight - 520))}px`;
        } catch (error) {
            logError('拖拽过程中出错', error);
        }
    }

    function stopDrag() {
        try {
            if (!state.isDragging) return;

            state.isDragging = false;
            state.panel.style.cursor = 'grab';
            GM_setValue('panelPosition', parseFloat(state.panel.style.left));
            GM_setValue('panelTop', parseFloat(state.panel.style.top));
        } catch (error) {
            logError('结束拖拽时出错', error);
        }
    }

    // 主初始化函数
    function init() {
        try {
            console.log('脚本开始初始化 v7.6');

            logMessage('脚本启动成功 v7.6');
            logMessage(`自动跳转状态: ${state.isAutoJumpEnabled ? '启用' : '禁用'}`);

            // 显示QQ群提示
            showGroupPrompt();

            // 尝试修复混合内容
            fixMixedContent();

            // 创建控制面板
            if (!document.querySelector('#autoCoursePanel')) {
                state.panel = createControlPanel();
                if (state.panel) {
                    document.body.appendChild(state.panel);
                    autoDockPanel();
                    logMessage('控制面板已创建');
                } else {
                    logMessage('控制面板创建失败');
                    // 创建一个简易备用面板
                    const backupPanel = document.createElement('div');
                    backupPanel.style.position = 'fixed';
                    backupPanel.style.left = '20px';
                    backupPanel.style.top = '20px';
                    backupPanel.style.zIndex = '99999';
                    backupPanel.style.backgroundColor = 'red';
                    backupPanel.style.color = 'white';
                    backupPanel.style.padding = '10px';
                    backupPanel.textContent = '刷课脚本已运行，点击打开完整面板';
                    backupPanel.addEventListener('click', () => {
                        document.body.removeChild(backupPanel);
                        state.panel = createControlPanel();
                        document.body.appendChild(state.panel);
                        autoDockPanel();
                    });
                    document.body.appendChild(backupPanel);
                }
            }

            // 初始化视频监听
            initVideoListener();
            logMessage('视频监控已启动');

            // 持续监控视频元素
            new MutationObserver(() => {
                if (document.querySelector('.jw-video.jw-reset')) {
                    initVideoListener();
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });

            // 每10秒检查播放状态
            setInterval(() => {
                const video = document.querySelector('.jw-video.jw-reset');
                if (video && video.paused && video.currentTime > 0) {
                    logMessage('检测到视频暂停，尝试恢复播放');
                    if (state.userInteracted) {
                        video.play()
                           .catch(err => logMessage(`恢复播放失败: ${err.message}`));
                    }
                }
            }, 10000);
        } catch (error) {
            logError('初始化脚本时出错', error);
            // 显示错误提示
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.left = '50%';
            errorDiv.style.top = '50%';
            errorDiv.style.transform = 'translate(-50%, -50%)';
            errorDiv.style.zIndex = '99999';
            errorDiv.style.backgroundColor = 'red';
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '20px';
            errorDiv.style.borderRadius = '5px';
            errorDiv.innerHTML = `脚本初始化失败: ${error.message}<br>请刷新页面重试`;
            document.body.appendChild(errorDiv);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();