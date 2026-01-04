// ==UserScript==
// @name         YouTube长按方向键右键两倍速加速播放
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  长按右方向键触发倍速播放+仿YouTube原生UI，单击实现快进/快退5秒
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553973/YouTube%E9%95%BF%E6%8C%89%E6%96%B9%E5%90%91%E9%94%AE%E5%8F%B3%E9%94%AE%E4%B8%A4%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/553973/YouTube%E9%95%BF%E6%8C%89%E6%96%B9%E5%90%91%E9%94%AE%E5%8F%B3%E9%94%AE%E4%B8%A4%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isLongPress = false; // 是否判定为长按
    let longPressTimer = null; // 长按判定定时器
    let isKeyDown = false; // 键是否按下
    let originalSpeed = 1.0; // 原始播放速度
    let video = null; // 视频元素
    let speedIndicator = null; // 速度提示UI元素
    const LONG_PRESS_DELAY = 250; // 长按判定时间（毫秒）
    const BOOST_SPEED = 2.0; // 加速倍数

    // 获取视频元素
    function getVideoElement() {
        return document.querySelector('video');
    }

    // 检查是否在输入框中
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }

    // 获取播放器容器元素
    function getPlayerContainer() {
        return document.querySelector('.html5-video-player') ||
               document.querySelector('#movie_player');
    }

    // 创建速度提示UI（仿YouTube原生样式）
    function createSpeedIndicator() {
        if (speedIndicator) return;

        const playerContainer = getPlayerContainer();
        if (!playerContainer) {
            console.log('[YouTube加速] 未找到播放器容器，稍后重试');
            return;
        }

        speedIndicator = document.createElement('div');
        speedIndicator.id = 'custom-speed-indicator';
        speedIndicator.innerHTML = `${BOOST_SPEED}x <span style="font-size: 0.85em;">▶</span>`;

        // 样式模仿YouTube原生UI - 胶囊形状
        Object.assign(speedIndicator.style, {
            position: 'absolute',  // 相对于播放器容器定位
            top: '25px',  // 距离播放器顶部
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '7px 14px',  // 调整为更扁的胶囊形
            backgroundColor: 'rgba(35, 35, 35, 0.8)',  // 稍微调整颜色和透明度
            color: 'white',
            fontSize: '15px',
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: '500',
            borderRadius: '18px',  // 大圆角，形成胶囊形
            zIndex: '9999',
            pointerEvents: 'none',
            display: 'none',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.0)',  // 增强阴影
            letterSpacing: '0.5px'  // 字间距
        });

        // 插入到播放器容器内部
        playerContainer.appendChild(speedIndicator);
        console.log('[YouTube加速] UI元素已创建并插入到播放器容器');
    }

    // 显示速度提示
    function showSpeedIndicator() {
        createSpeedIndicator();
        if (speedIndicator) {
            speedIndicator.style.display = 'block';
        }
    }

    // 隐藏速度提示
    function hideSpeedIndicator() {
        if (speedIndicator) {
            speedIndicator.style.display = 'none';
        }
    }

    // 开始加速播放
    function startSpeedBoost() {
        video = getVideoElement();
        if (!video) {
            console.log('[YouTube加速] 未找到视频元素');
            return;
        }

        // 保存当前速度
        originalSpeed = video.playbackRate;

        // 设置加速
        video.playbackRate = BOOST_SPEED;

        // 显示UI
        showSpeedIndicator();

        console.log(`[YouTube加速] 开始加速播放 ${originalSpeed}x → ${BOOST_SPEED}x`);
    }

    // 停止加速播放
    function stopSpeedBoost() {
        video = getVideoElement();
        if (!video) return;

        // 恢复原始速度
        video.playbackRate = originalSpeed;

        // 隐藏UI
        hideSpeedIndicator();

        console.log(`[YouTube加速] 恢复正常速度 ${BOOST_SPEED}x → ${originalSpeed}x`);
    }

    // 键盘按下事件
    function handleKeyDown(e) {
        // 如果在输入框中，不处理
        if (isInputFocused()) return;

        // 右方向键 (keyCode: 39, key: 'ArrowRight') 或 左方向键 (keyCode: 37, key: 'ArrowLeft')
        if (e.key === 'ArrowRight' || e.keyCode === 39 || e.key === 'ArrowLeft' || e.keyCode === 37) {
            // 防止重复触发（长按会持续触发keydown事件）
            if (isKeyDown) {
                // 已经按下了，阻止重复触发
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
            }

            isKeyDown = true;
            isLongPress = false;

            // 只对右键启动长按判定定时器（倍速播放）
            if (e.key === 'ArrowRight' || e.keyCode === 39) {
                longPressTimer = setTimeout(() => {
                    // 定时器触发，判定为长按
                    isLongPress = true;
                    console.log('[YouTube加速] 检测到长按，开始倍速播放');

                    // 开始加速播放
                    startSpeedBoost();
                }, LONG_PRESS_DELAY);

                console.log('[YouTube加速] 右键按下，等待判定单击/长按...');
            } else {
                // 左键只有单击快退，没有长按功能
                console.log('[YouTube加速] 左键按下');
            }
        }
    }

    // 键盘释放事件
    function handleKeyUp(e) {
        // 右方向键或左方向键
        if (e.key === 'ArrowRight' || e.keyCode === 39 || e.key === 'ArrowLeft' || e.keyCode === 37) {
            const isRightKey = (e.key === 'ArrowRight' || e.keyCode === 39);

            // 清除长按判定定时器
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            if (isLongPress) {
                // 长按状态（只有右键会进入这个状态）
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 停止加速播放
                stopSpeedBoost();
                console.log('[YouTube加速] 长按结束');
            } else {
                // 单击状态，手动执行快进/快退
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                video = getVideoElement();
                if (video) {
                    if (isRightKey) {
                        // 右键：快进5秒
                        video.currentTime += 5;
                        console.log('[YouTube加速] 单击右键，快进5秒');
                    } else {
                        // 左键：快退5秒
                        video.currentTime -= 5;
                        console.log('[YouTube加速] 单击左键，快退5秒');
                    }
                } else {
                    console.log('[YouTube加速] 未找到视频元素，无法快进/快退');
                }
            }

            // 重置状态
            isKeyDown = false;
            isLongPress = false;
        }
    }

    // 初始化
    function init() {
        console.log('[YouTube加速] 脚本已加载');

        // 在捕获阶段添加键盘事件监听，优先级最高
        // true = capture阶段，比YouTube的监听器更早执行
        document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
        document.addEventListener('keyup', handleKeyUp, { capture: true, passive: false });

        // 额外在window上也监听一次，确保能拦截到
        window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
        window.addEventListener('keyup', handleKeyUp, { capture: true, passive: false });

        // 监听页面变化（YouTube是单页应用）
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('[YouTube加速] 页面切换，重置状态');
                // 页面切换时重置状态
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                if (isLongPress) {
                    stopSpeedBoost();
                }
                isKeyDown = false;
                isLongPress = false;
            }
        });

        // 等待body元素存在后再开始观察
        if (document.body) {
            urlObserver.observe(document.body, { subtree: true, childList: true });
        } else {
            // 如果body还不存在，等待它出现
            const bodyObserver = new MutationObserver(() => {
                if (document.body) {
                    urlObserver.observe(document.body, { subtree: true, childList: true });
                    bodyObserver.disconnect();
                }
            });
            bodyObserver.observe(document.documentElement, { childList: true });
        }
    }

    // 立即初始化（尽早拦截键盘事件）
    if (document.readyState === 'loading') {
        // 即使在loading状态也立即添加监听器
        init();
        // 并且在DOMContentLoaded后再次确保
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[YouTube加速] DOM加载完成，再次确认事件监听');
        });
    } else {
        init();
    }

    console.log('[YouTube加速] 使用说明：');
    console.log('[YouTube加速] - 单击右方向键 → 快进5秒');
    console.log('[YouTube加速] - 长按右方向键 → ' + BOOST_SPEED + 'x倍速播放 + 胶囊UI');
    console.log('[YouTube加速] - 单击左方向键 → 快退5秒');
    console.log('[YouTube加速] - 所有功能均已接管，不依赖YouTube原生逻辑');
})();

