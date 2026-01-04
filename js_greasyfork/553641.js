// ==UserScript==
// @name         上海开放大学视频自动播放静音助手
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  上海开放大学学习平台专用，自动播放课程视频并默认静音，提升学习效率，客服V：wkwk796
// @author       wkwk796
// @match        *://*.shtvu.edu.cn/*
// @match        *://elearning.shtvu.edu.cn/*
// @match        *://study.shtvu.edu.cn/*
// @match        *://course.shtvu.edu.cn/*
// @match        *://mooc.shtvu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shtvu.edu.cn
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553641/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E9%9D%99%E9%9F%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553641/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E9%9D%99%E9%9F%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        autoPlay: GM_getValue('autoPlay', true),
        autoMute: GM_getValue('autoMute', true),
        autoNext: GM_getValue('autoNext', true),
        showContact: GM_getValue('showContact', true),
        customSpeed: parseFloat(GM_getValue('customSpeed', 1.0)),
        skipCompleted: GM_getValue('skipCompleted', true),
        disableMonitor: GM_getValue('disableMonitor', false)
    };

    // 保存配置
    function saveConfig() {
        try {
            GM_setValue('autoPlay', config.autoPlay);
            GM_setValue('autoMute', config.autoMute);
            GM_setValue('autoNext', config.autoNext);
            GM_setValue('showContact', config.showContact);
            GM_setValue('customSpeed', config.customSpeed);
            GM_setValue('skipCompleted', config.skipCompleted);
            GM_setValue('disableMonitor', config.disableMonitor);
        } catch (e) {
            console.error('保存配置失败:', e);
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        try {
            if (!document || !document.body) return;
            
            const notification = document.createElement('div');
            notification.className = 'shtvu-notification notification-' + type;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body && document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        } catch (e) {
            console.error('显示通知失败:', e);
        }
    }

    // 创建控制面板
    function createControlPanel() {
        try {
            if (!document || !document.body) return;
            
            // 检查是否已存在控制面板
            const existingPanel = document.getElementById('shtvu-auto-play-panel');
            if (existingPanel) {
                existingPanel.style.display = 'block';
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'shtvu-auto-play-panel';
            
            // 使用字符串拼接避免语法问题
            let panelHTML = '';
            panelHTML += '<div class="shtvu-panel-header">';
            panelHTML += '    <h3>上海开放大学视频助手控制面板</h3>';
            panelHTML += '    <button id="shtvu-close-panel">×</button>';
            panelHTML += '</div>';
            panelHTML += '<div class="shtvu-panel-body">';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            <input type="checkbox" id="shtvu-auto-play"' + (config.autoPlay ? ' checked' : '') + '>';
            panelHTML += '            自动播放视频';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            <input type="checkbox" id="shtvu-auto-mute"' + (config.autoMute ? ' checked' : '') + '>';
            panelHTML += '            自动静音';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            <input type="checkbox" id="shtvu-auto-next"' + (config.autoNext ? ' checked' : '') + '>';
            panelHTML += '            自动播放下一节';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            <input type="checkbox" id="shtvu-skip-completed"' + (config.skipCompleted ? ' checked' : '') + '>';
            panelHTML += '            跳过已完成视频';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            <input type="checkbox" id="shtvu-disable-monitor"' + (config.disableMonitor ? ' checked' : '') + '>';
            panelHTML += '            禁用多端监控';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            panelHTML += '    <div class="shtvu-control-item">';
            panelHTML += '        <label>';
            panelHTML += '            播放速度：';
            panelHTML += '            <select id="shtvu-playback-speed">';
            panelHTML += '                <option value="0.5"' + (config.customSpeed === 0.5 ? ' selected' : '') + '>0.5x</option>';
            panelHTML += '                <option value="1.0"' + (config.customSpeed === 1.0 ? ' selected' : '') + '>1.0x</option>';
            panelHTML += '                <option value="1.25"' + (config.customSpeed === 1.25 ? ' selected' : '') + '>1.25x</option>';
            panelHTML += '                <option value="1.5"' + (config.customSpeed === 1.5 ? ' selected' : '') + '>1.5x</option>';
            panelHTML += '                <option value="2.0"' + (config.customSpeed === 2.0 ? ' selected' : '') + '>2.0x</option>';
            panelHTML += '                <option value="3.0"' + (config.customSpeed === 3.0 ? ' selected' : '') + '>3.0x</option>';
            panelHTML += '                <option value="4.0"' + (config.customSpeed === 4.0 ? ' selected' : '') + '>4.0x</option>';
            panelHTML += '            </select>';
            panelHTML += '        </label>';
            panelHTML += '    </div>';
            
            if (config.showContact) {
                panelHTML += '    <div class="shtvu-contact-info">';
                panelHTML += '        <p>开发者联系方式: wkwk796</p>';
                panelHTML += '    </div>';
            }
            
            panelHTML += '    <div class="shtvu-panel-footer">';
            panelHTML += '        <button id="shtvu-toggle-contact">' + (config.showContact ? '隐藏联系方式' : '显示联系方式') + '</button>';
            panelHTML += '        <button id="shtvu-refresh-video">刷新视频检测</button>';
            panelHTML += '    </div>';
            panelHTML += '</div>';
            
            panel.innerHTML = panelHTML;
            document.body.appendChild(panel);

            // 添加事件监听器
            setupPanelEventListeners(panel);
        } catch (e) {
            console.error('创建控制面板失败:', e);
        }
    }

    // 设置面板事件监听器
    function setupPanelEventListeners(panel) {
        try {
            const closeBtn = document.getElementById('shtvu-close-panel');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    panel.style.display = 'none';
                });
            }

            const autoPlayCheckbox = document.getElementById('shtvu-auto-play');
            if (autoPlayCheckbox) {
                autoPlayCheckbox.addEventListener('change', (e) => {
                    config.autoPlay = e.target.checked;
                    saveConfig();
                });
            }

            const autoMuteCheckbox = document.getElementById('shtvu-auto-mute');
            if (autoMuteCheckbox) {
                autoMuteCheckbox.addEventListener('change', (e) => {
                    config.autoMute = e.target.checked;
                    saveConfig();
                    // 如果启用静音，立即将所有视频设为静音
                    if (config.autoMute && document) {
                        const videos = document.querySelectorAll('video');
                        videos.forEach(video => {
                            if (video && video.volume !== undefined) {
                                video.muted = true;
                            }
                        });
                    }
                });
            }

            const autoNextCheckbox = document.getElementById('shtvu-auto-next');
            if (autoNextCheckbox) {
                autoNextCheckbox.addEventListener('change', (e) => {
                    config.autoNext = e.target.checked;
                    saveConfig();
                });
            }

            const skipCompletedCheckbox = document.getElementById('shtvu-skip-completed');
            if (skipCompletedCheckbox) {
                skipCompletedCheckbox.addEventListener('change', (e) => {
                    config.skipCompleted = e.target.checked;
                    saveConfig();
                });
            }

            const disableMonitorCheckbox = document.getElementById('shtvu-disable-monitor');
            if (disableMonitorCheckbox) {
                disableMonitorCheckbox.addEventListener('change', (e) => {
                    config.disableMonitor = e.target.checked;
                    saveConfig();
                    if (config.disableMonitor) {
                        disableMultiDeviceMonitor();
                    }
                });
            }

            const playbackSpeedSelect = document.getElementById('shtvu-playback-speed');
            if (playbackSpeedSelect) {
                playbackSpeedSelect.addEventListener('change', (e) => {
                    config.customSpeed = parseFloat(e.target.value);
                    saveConfig();
                    applyPlaybackSpeed();
                });
            }

            const toggleContactBtn = document.getElementById('shtvu-toggle-contact');
            if (toggleContactBtn) {
                toggleContactBtn.addEventListener('click', () => {
                    config.showContact = !config.showContact;
                    saveConfig();
                    const contactInfo = document.querySelector('.shtvu-contact-info');
                    if (contactInfo) {
                        contactInfo.style.display = config.showContact ? 'block' : 'none';
                    }
                    toggleContactBtn.textContent = config.showContact ? '隐藏联系方式' : '显示联系方式';
                });
            }

            const refreshVideoBtn = document.getElementById('shtvu-refresh-video');
            if (refreshVideoBtn) {
                refreshVideoBtn.addEventListener('click', () => {
                    handleVideo();
                    setupVideoEndDetection();
                    showNotification('视频检测已刷新', 'success');
                });
            }
        } catch (e) {
            console.error('设置面板事件监听器失败:', e);
        }
    }

    // 处理视频播放和静音
    function handleVideo() {
        try {
            if (!document) return;
            
            // 跳过已完成视频检查
            if (config.skipCompleted) {
                const completedMarks = document.querySelectorAll(
                    '.completed, .finished, .success, .check, ' +
                    '.icon-finish, .status-completed, .task-finished,' +
                    '[class*="finish"], [class*="complete"]'
                );
                
                // 如果页面上有多个完成标记但没有正在播放的视频，尝试跳转到下一个任务
                if (completedMarks.length > 2 && !isVideoPlaying()) {
                    showNotification('检测到已完成视频，正在尝试跳转到下一个任务', 'info');
                    setTimeout(tryNavigateToNextTask, 1000);
                    return;
                }
            }

            // 查找所有视频元素
            const videos = document.querySelectorAll('video');
            let foundVideo = false;

            videos.forEach(video => {
                try {
                    if (!video) return;
                    
                    foundVideo = true;
                    
                    // 自动静音
                    if (config.autoMute && !video.muted && video.volume !== undefined) {
                        video.muted = true;
                    }

                    // 应用播放速度
                    applyPlaybackSpeed();

                    // 自动播放
                    if (config.autoPlay && video.paused && canPlayVideo(video)) {
                        // 尝试直接播放
                        Promise.resolve(video.play()).then(() => {
                            showNotification('视频已自动播放', 'success');
                        }).catch(err => {
                            console.log('直接播放失败，尝试模拟用户交互:', err);
                            // 尝试模拟用户交互后播放
                            simulateUserInteraction(video);
                        });
                    }
                } catch (e) {
                    console.error('处理单个视频元素时出错:', e);
                }
            });

            // 如果没找到视频元素，尝试查找上海开放大学平台常见的播放按钮
            if (!foundVideo && config.autoPlay) {
                clickPlayButtons();
            }
        } catch (e) {
            console.error('处理视频播放失败:', e);
        }
    }

    // 检查视频是否可以播放
    function canPlayVideo(video) {
        try {
            if (!video) return false;
            // 检查视频是否有有效的源
            if ((video.src && video.src.trim() !== '') || (video.currentSrc && video.currentSrc.trim() !== '')) {
                // 检查视频是否已经加载了一些数据
                if (video.readyState > 0 || video.duration > 0) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error('检查视频可用性失败:', e);
            return false;
        }
    }

    // 检查是否有视频正在播放
    function isVideoPlaying() {
        try {
            if (!document) return false;
            const videos = document.querySelectorAll('video');
            return Array.from(videos).some(video => {
                try {
                    return video && !video.paused && !video.ended && video.currentTime > 0;
                } catch (e) {
                    return false;
                }
            });
        } catch (e) {
            console.error('检查视频播放状态失败:', e);
            return false;
        }
    }

    // 应用播放速度
    function applyPlaybackSpeed() {
        try {
            if (!document) return;
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                try {
                    if (video && typeof video.playbackRate !== 'undefined') {
                        video.playbackRate = config.customSpeed;
                    }
                } catch (e) {
                    console.error('设置播放速度失败:', e);
                }
            });
        } catch (e) {
            console.error('应用播放速度失败:', e);
        }
    }

    // 模拟用户交互
    function simulateUserInteraction(video) {
        try {
            if (!video) return;
            
            // 创建一个临时按钮并点击
            const tempBtn = document.createElement('button');
            tempBtn.style.position = 'absolute';
            tempBtn.style.left = '-9999px';
            document.body.appendChild(tempBtn);
            
            tempBtn.addEventListener('click', () => {
                video.play().catch(err => {
                    console.log('模拟用户交互后播放仍失败:', err);
                });
            });
            
            // 触发点击事件
            tempBtn.click();
            
            // 清理临时按钮
            setTimeout(() => {
                if (document.body && document.body.contains(tempBtn)) {
                    document.body.removeChild(tempBtn);
                }
            }, 100);
        } catch (e) {
            console.error('模拟用户交互失败:', e);
        }
    }

    // 点击上海开放大学平台常见的播放按钮
    function clickPlayButtons() {
        try {
            if (!document) return;
            
            // 上海开放大学平台常见的播放按钮选择器
            const playButtonSelectors = [
                '.play, .play-button, .video-play, .btn-play',
                '.start, .start-button, .btn-start',
                '.video-control .play, .player-control .play',
                '.shtvu-play, .shtvu-video-play',
                '.elearning-play, .mooc-play',
                '.course-video-play, .lesson-play',
                '.video-content .play, .video-wrapper .play',
                '[class*="play"][class*="btn"], [class*="play"][class*="button"]',
                '.icon-play, .play-icon, .iconfont.icon-play',
                '.fa-play, .fa-play-circle'
            ];

            let clicked = false;

            playButtonSelectors.forEach(selector => {
                try {
                    const buttons = document.querySelectorAll(selector);
                    buttons.forEach(button => {
                        // 确保按钮可见且可点击
                        if (button.offsetParent !== null && 
                            button.style.display !== 'none' && 
                            button.style.visibility !== 'hidden') {
                            // 添加随机延迟，避免检测
                            setTimeout(() => {
                                button.click();
                                if (!clicked) {
                                    showNotification('尝试点击播放按钮', 'info');
                                    clicked = true;
                                }
                            }, Math.random() * 500);
                        }
                    });
                } catch (e) {
                    console.log('选择器 ' + selector + ' 出错:', e);
                }
            });

            // 特殊处理：查找iframe中的视频播放按钮
            try {
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        if (iframeDoc) {
                            const iframeButtons = iframeDoc.querySelectorAll(
                                '.play, .play-button, .video-play, .icon-play'
                            );
                            iframeButtons.forEach(button => {
                                setTimeout(() => {
                                    button.click();
                                }, Math.random() * 1000);
                            });
                        }
                    } catch (e) {
                        // 跨域iframe可能会抛出错误，忽略
                    }
                });
            } catch (e) {
                console.log('处理iframe播放按钮时出错:', e);
            }
        } catch (e) {
            console.error('点击播放按钮失败:', e);
        }
    }

    // 设置视频结束检测
    function setupVideoEndDetection() {
        try {
            if (!document) return;
            
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                try {
                    if (!video) return;
                    
                    // 移除已存在的监听器，避免重复
                    video.removeEventListener('ended', onVideoEnded);
                    video.addEventListener('ended', onVideoEnded);
                } catch (e) {
                    console.error('设置视频结束监听失败:', e);
                }
            });

            // 监听进度变化，检测是否播放完成（有些平台可能不会触发ended事件）
            videos.forEach(video => {
                try {
                    if (!video) return;
                    
                    video.addEventListener('timeupdate', () => {
                        try {
                            if (video.duration > 0 && video.currentTime >= video.duration - 0.5) {
                                onVideoEnded();
                            }
                        } catch (e) {
                            console.error('检测视频进度时出错:', e);
                        }
                    });
                } catch (e) {
                    console.error('设置视频进度监听失败:', e);
                }
            });
        } catch (e) {
            console.error('设置视频结束检测失败:', e);
        }
    }

    // 视频播放结束后的处理
    function onVideoEnded() {
        try {
            showNotification('视频播放完成', 'success');
            
            if (config.autoNext) {
                setTimeout(() => {
                    tryNavigateToNextTask();
                }, 2000);
            }
        } catch (e) {
            console.error('处理视频结束事件失败:', e);
        }
    }

    // 尝试导航到下一个任务
    function tryNavigateToNextTask() {
        try {
            if (!document || !config.autoNext) return;
            
            // 上海开放大学平台常见的下一节按钮选择器
            const nextButtonSelectors = [
                '.next, .next-button, .btn-next',
                '.next-step, .step-next, .next-lesson',
                '.next-chapter, .chapter-next',
                '.shtvu-next, .shtvu-next-button',
                '.elearning-next, .mooc-next',
                '.course-next, .lesson-next',
                '[class*="next"][class*="btn"], [class*="next"][class*="button"]',
                '.finish-button, .complete-button, .continue-button',
                '.task-finish-button, .lesson-complete-button'
            ];

            let navigated = false;

            nextButtonSelectors.forEach(selector => {
                try {
                    const buttons = document.querySelectorAll(selector);
                    buttons.forEach(button => {
                        if (button.offsetParent !== null && !navigated) {
                            // 滚动到按钮位置
                            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // 模拟点击
                            setTimeout(() => {
                                button.click();
                                navigated = true;
                                showNotification('已自动跳转到下一节', 'success');
                            }, 500);
                        }
                    });
                } catch (e) {
                    console.log('下一节按钮选择器 ' + selector + ' 出错:', e);
                }
            });

            // 尝试在任务列表中查找下一个未完成的任务
            if (!navigated) {
                const taskItemSelectors = [
                    '.task-item, .lesson-item, .chapter-item',
                    '.course-item, .content-item, .video-item',
                    '.list-item, .menu-item, .nav-item'
                ];

                taskItemSelectors.forEach(selector => {
                    try {
                        const items = document.querySelectorAll(selector);
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            // 检查是否包含完成标记
                            const hasCompletedMark = item.querySelector(
                                '.completed, .finished, .success, .check'
                            );
                            
                            // 如果找到一个没有完成标记的项目，点击它
                            if (!hasCompletedMark && item.offsetParent !== null && !navigated) {
                                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                setTimeout(() => {
                                    item.click();
                                    navigated = true;
                                    showNotification('已跳转到下一个未完成任务', 'success');
                                }, 500);
                                break;
                            }
                        }
                    } catch (e) {
                        console.log('任务列表选择器 ' + selector + ' 出错:', e);
                    }
                });
            }

            if (!navigated) {
                showNotification('未找到可跳转的下一节内容', 'info');
            }
        } catch (e) {
            console.error('尝试导航到下一个任务失败:', e);
        }
    }

    // 禁用多端监控（如果需要）
    function disableMultiDeviceMonitor() {
        try {
            if (!config.disableMonitor) return;
            
            // 尝试禁用常见的多端监控方法
            if (unsafeWindow && typeof unsafeWindow === 'object') {
                // 覆盖常见的监控函数
                const monitorFunctions = ['checkMultiDevice', 'detectMultiLogin', 'monitorUserActivity', 'checkUserSession', 'validateLogin'];
                monitorFunctions.forEach(func => {
                    if (unsafeWindow[func]) {
                        unsafeWindow[func] = () => true;
                    }
                });
                
                // 模拟用户活动
                if (typeof unsafeWindow.dispatchEvent === 'function') {
                    const events = ['mousemove', 'keydown', 'mousedown'];
                    events.forEach(eventName => {
                        setInterval(() => {
                            try {
                                const event = new Event(eventName, { bubbles: true });
                                unsafeWindow.dispatchEvent(event);
                            } catch (innerErr) {
                                // 忽略错误，继续执行
                            }
                        }, 30000); // 每30秒模拟一次活动
                    });
                }
            }
            
            showNotification('多端监控已尝试禁用', 'success');
        } catch (e) {
            console.log('禁用多端监控失败:', e);
        }
    }

    // 检查是否在视频页面
    function isVideoPage() {
        try {
            const url = window.location.href.toLowerCase();
            const videoPagePatterns = [
                /video/, /course\/video/, /watch/, /learnvideo/, 
                /ananas/, /knowledge/, /play/, /chapter/,
                /lesson/, /courseware/, /content/, /player/,
                /学习/, /课程/, /视频/, /讲课/
            ];
            
            // 检查URL是否匹配视频页面模式
            for (const pattern of videoPagePatterns) {
                if (pattern.test(url)) {
                    return true;
                }
            }
            
            // 检查页面中是否有视频元素或视频播放器
            return document.querySelectorAll('video, .video-player, .player-container, [class*="video"][class*="player"]').length > 0;
        } catch (e) {
            console.error('检查是否视频页面失败:', e);
            return false;
        }
    }

    // 初始化函数
    function init() {
        try {
            // 注册菜单项
            GM_registerMenuCommand('显示控制面板', createControlPanel);
            GM_registerMenuCommand('刷新视频检测', handleVideo);
            GM_registerMenuCommand('跳转到下一节', tryNavigateToNextTask);

            // 添加样式
            GM_addStyle(`
                /* 控制面板样式 */
                #shtvu-auto-play-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 350px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                }
                
                .shtvu-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: #1890ff;
                    color: white;
                    border-radius: 8px 8px 0 0;
                }
                
                .shtvu-panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 500;
                }
                
                #shtvu-close-panel {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                
                #shtvu-close-panel:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .shtvu-panel-body {
                    padding: 20px;
                }
                
                .shtvu-control-item {
                    margin-bottom: 12px;
                }
                
                .shtvu-control-item label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    color: #333;
                }
                
                .shtvu-control-item input[type="checkbox"] {
                    margin-right: 8px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                
                .shtvu-control-item select {
                    margin-left: 8px;
                    padding: 4px 8px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                .shtvu-contact-info {
                    margin-top: 15px;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    text-align: center;
                }
                
                .shtvu-contact-info p {
                    margin: 0;
                    font-size: 13px;
                    color: #666;
                }
                
                .shtvu-panel-footer {
                    margin-top: 15px;
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                
                .shtvu-panel-footer button {
                    flex: 1;
                    padding: 8px 12px;
                    background: #1890ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: background 0.2s;
                }
                
                .shtvu-panel-footer button:hover {
                    background: #40a9ff;
                }
                
                /* 通知样式 */
                .shtvu-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    background: #333;
                    color: white;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .notification-success {
                    background: #52c41a;
                }
                
                .notification-error {
                    background: #ff4d4f;
                }
                
                .notification-info {
                    background: #1890ff;
                }
                
                .shtvu-notification.fade-out {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            `);

            // 初始化检查和处理
            if (isVideoPage()) {
                // 初始处理视频
                handleVideo();
                setupVideoEndDetection();
                
                // 处理可能的视频播放器加载延迟
                setTimeout(() => {
                    handleVideo();
                    setupVideoEndDetection();
                }, 3000);
                
                setTimeout(() => {
                    handleVideo();
                    setupVideoEndDetection();
                }, 8000);
            }

            // 启用多端监控禁用功能（如果配置启用）
            if (config.disableMonitor) {
                disableMultiDeviceMonitor();
            }

            // 监听页面变化
            const observer = new MutationObserver(() => {
                if (isVideoPage()) {
                    handleVideo();
                    setupVideoEndDetection();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('上海开放大学视频助手已启动');
        } catch (e) {
            console.error('脚本初始化失败:', e);
        }
    }

    // 启动脚本
    init();
})();