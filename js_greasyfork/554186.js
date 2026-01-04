// ==UserScript==
// @name         学习助手 - 自动确认与视频播放
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击学习提示的确定按钮，并在视频暂停时自动按空格键播放
// @author       Assistant
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554186/%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E4%B8%8E%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/554186/%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E4%B8%8E%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        // 提示文本检测
        targetText: /你已学习了\d+分钟,继续学习请按确定，从头学习请按取消/,
        buttonText: ['确定', '确认', '继续学习', '是'],
        checkInterval: 1000,
        
        // 视频检测
        videoCheckInterval: 2000,
        autoPlayVideo: true,
        videoSelectors: [
            'video',
            '.video',
            '[class*="video"]',
            'iframe',
            'object',
            'embed'
        ],
        
        // 界面显示
        enableUI: true,
        enableLog: true,
        showNotifications: true
    };

    // 状态变量
    let isMonitoring = true;
    let lastVideoCheck = 0;
    let foundVideos = new Set();

    // 日志函数
    function log(...args) {
        if (config.enableLog) {
            console.log('[学习助手]', ...args);
        }
    }

    // 创建状态指示器
    function createStatusIndicator() {
        if (!config.enableUI) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'study-assistant-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #4CAF50;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                cursor: move;
                opacity: 0.9;
            ">
                <strong>学习助手</strong>
                <div>状态: <span id="study-status">运行中</span></div>
                <div>视频: <span id="video-status">检测中</span></div>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // 简单的拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        indicator.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        
        function startDrag(e) {
            isDragging = true;
            const rect = indicator.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            indicator.style.opacity = '0.7';
        }
        
        function doDrag(e) {
            if (!isDragging) return;
            indicator.style.left = (e.clientX - dragOffset.x) + 'px';
            indicator.style.top = (e.clientY - dragOffset.y) + 'px';
            indicator.style.right = 'auto';
        }
        
        function stopDrag() {
            isDragging = false;
            indicator.style.opacity = '0.9';
        }
        
        return indicator;
    }

    // 更新状态显示
    function updateStatus(message, type = 'info') {
        if (!config.enableUI) return;
        
        const statusElement = document.getElementById('study-status');
        const videoElement = document.getElementById('video-status');
        
        if (statusElement && type === 'info') {
            statusElement.textContent = message;
        }
        if (videoElement && type === 'video') {
            videoElement.textContent = message;
        }
    }

    // 显示通知
    function showNotification(title, message) {
        if (config.showNotifications) {
            // 使用浏览器通知（如果可用）
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: title,
                    text: message,
                    timeout: 3000
                });
            } else if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body: message });
            }
        }
        
        log(title + ': ' + message);
    }

    // 查找按钮元素
    function findConfirmButton() {
        const buttonSelectors = [
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            '.btn',
            '.button',
            '[class*="btn"]',
            '[class*="button"]',
            '[onclick]'
        ];

        const buttonTexts = Array.isArray(config.buttonText) ? config.buttonText : [config.buttonText];

        for (const selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                const buttonText = button.textContent?.trim() || button.value || button.getAttribute('title') || '';
                if (!buttonText) continue;
                
                for (const targetText of buttonTexts) {
                    let isMatch = false;
                    if (targetText instanceof RegExp) {
                        isMatch = targetText.test(buttonText);
                    } else {
                        isMatch = buttonText.includes(targetText);
                    }
                    
                    if (isMatch) {
                        const style = window.getComputedStyle(button);
                        if (style.display !== 'none' && style.visibility !== 'hidden' && 
                            !button.disabled && style.opacity !== '0') {
                            return button;
                        }
                    }
                }
            }
        }
        return null;
    }

    // 检查页面是否包含目标文本
    function containsTargetText() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (config.targetText instanceof RegExp) {
                if (config.targetText.test(text)) {
                    return true;
                }
            } else if (text.includes(config.targetText)) {
                return true;
            }
        }
        return false;
    }

    // 检查并点击确定按钮
    function checkAndClickConfirm() {
        if (!isMonitoring) return false;
        
        if (containsTargetText()) {
            log('检测到学习提示框');
            const button = findConfirmButton();
            
            if (button) {
                log('找到确定按钮，准备点击');
                updateStatus('点击确定按钮');
                
                try {
                    // 模拟真实点击事件序列
                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        button.dispatchEvent(new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                    });
                    
                    button.click();
                    showNotification('学习助手', '已自动点击确定按钮');
                    log('成功点击确定按钮');
                    return true;
                } catch (error) {
                    log('点击过程中发生错误:', error);
                }
            } else {
                log('未找到匹配的确定按钮');
            }
        }
        return false;
    }

    // 查找视频元素
    function findVideoElements() {
        const videos = [];
        
        // 查找原生video元素
        const nativeVideos = document.querySelectorAll('video');
        nativeVideos.forEach(video => {
            if (!foundVideos.has(video)) {
                videos.push(video);
                foundVideos.add(video);
            }
        });
        
        // 查找其他可能的视频容器
        config.videoSelectors.forEach(selector => {
            if (selector === 'video') return; // 已经处理过
            
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 检查元素是否包含视频特征
                if (element.src && element.src.match(/\.(mp4|webm|ogg)/i) ||
                    element.innerHTML.includes('video') ||
                    element.className.match(/video/)) {
                    if (!foundVideos.has(element)) {
                        videos.push(element);
                        foundVideos.add(element);
                    }
                }
            });
        });
        
        return videos;
    }

    // 模拟空格键按下
    function simulateSpaceKey() {
        log('模拟空格键按下');
        updateStatus('恢复视频播放');
        
        // 创建并发送键盘事件
        const spaceKeyEvent = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        
        document.activeElement.dispatchEvent(spaceKeyEvent);
        
        // 也发送keyup事件
        const keyUpEvent = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        
        document.activeElement.dispatchEvent(keyUpEvent);
    }

    // 检查视频状态并处理暂停
    function checkVideoStatus() {
        if (!isMonitoring || !config.autoPlayVideo) return;
        
        const now = Date.now();
        if (now - lastVideoCheck < config.videoCheckInterval) return;
        lastVideoCheck = now;
        
        const videos = findVideoElements();
        if (videos.length === 0) {
            updateStatus('未检测到视频', 'video');
            return;
        }
        
        updateStatus(`检测到 ${videos.length} 个视频`, 'video');
        
        let foundPaused = false;
        videos.forEach((video, index) => {
            // 对于原生video元素
            if (video.tagName === 'VIDEO') {
                if (video.paused && !video.ended) {
                    log(`检测到视频 ${index + 1} 已暂停，尝试播放`);
                    foundPaused = true;
                    
                    // 先尝试直接播放
                    video.play().catch(error => {
                        log(`直接播放失败: ${error}，尝试模拟空格键`);
                        simulateSpaceKey();
                    });
                }
            } else {
                // 对于其他视频元素，模拟空格键
                log(`检测到视频容器 ${index + 1}，模拟空格键`);
                simulateSpaceKey();
                foundPaused = true;
            }
        });
        
        if (foundPaused) {
            showNotification('学习助手', '检测到视频暂停，已自动恢复播放');
        }
    }

    // 初始化视频监控
    function initVideoMonitoring() {
        // 定期检查视频状态
        setInterval(checkVideoStatus, config.videoCheckInterval);
        
        // 监听页面焦点变化，恢复时检查视频
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(checkVideoStatus, 1000);
            }
        });
        
        log('视频监控已启动');
    }

    // 主初始化函数
    function init() {
        log('学习助手脚本已加载，正在初始化...');
        
        // 创建状态指示器
        if (config.enableUI) {
            createStatusIndicator();
        }
        
        // 启动提示框监控
        const confirmObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(checkAndClickConfirm, 300);
                }
            });
        });
        
        confirmObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 定期检查提示框（备用）
        setInterval(checkAndClickConfirm, config.checkInterval);
        
        // 初始化视频监控
        if (config.autoPlayVideo) {
            initVideoMonitoring();
        }
        
        // 初始检查
        setTimeout(() => {
            checkAndClickConfirm();
            checkVideoStatus();
        }, 2000);
        
        // 提供控制接口
        window.StudyAssistant = {
            enable: function() {
                isMonitoring = true;
                updateStatus('运行中');
                showNotification('学习助手', '已启用');
            },
            disable: function() {
                isMonitoring = false;
                updateStatus('已暂停');
                showNotification('学习助手', '已暂停');
            },
            checkNow: function() {
                checkAndClickConfirm();
                checkVideoStatus();
            },
            config: config
        };
        
        log('学习助手初始化完成');
        showNotification('学习助手', '脚本已启动，开始监控学习提示和视频状态');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();