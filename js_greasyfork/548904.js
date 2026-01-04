// ==UserScript==
// @name         xyDouYinTools 抖音沉浸式优化
// @namespace   https://greasyfork.org/zh-CN/users/1513167-%E9%83%A7%E5%B1%B1%E6%9D%8E%E5%92%B8%E9%B1%BC
// @version      0.25
// @description  美化抖音界面
// @author      lxy
// @license      MIT
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548904/xyDouYinTools%20%E6%8A%96%E9%9F%B3%E6%B2%89%E6%B5%B8%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548904/xyDouYinTools%20%E6%8A%96%E9%9F%B3%E6%B2%89%E6%B5%B8%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================= 全屏加载动画 =======================
    // 在页面加载前立即创建加载动画
    const loader = document.createElement('div');
    loader.id = 'tm-fullscreen-loader';
    loader.innerHTML = `
        <style>
            #tm-fullscreen-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            .tm-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .tm-loading-text {
                color: #fff;
                margin-top: 20px;
                font-family: Arial, sans-serif;
                font-size: 16px;
            }
        </style>
        <div class="tm-spinner"></div>
        <p class="tm-loading-text">加载中...</p>
    `;
    document.documentElement.appendChild(loader);

    // 页面加载完成后淡出
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 300);
    });

    // 保留原始console方法
    const nativeConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
    };

    // 重写console
    ["log", "warn", "error", "info"].forEach(type => {
        console[type] = function (...args) {
            if (args[0] && typeof args[0] === "string" && args[0].startsWith("[DouYinTools]")) {
                nativeConsole[type].apply(console, args);
            }
        };
    });

        const rules = [
        {
            key: "1", // 左侧导航栏
            selector: "#douyin-navigation",
            storageKey: "hide_sidebar",
            className: "hide-sidebar"
        }
    ];

    // 切换隐藏状态
    function toggle(rule, force = null) {
        let body = document.body;
        if (!body) return;

        const hidden = body.classList.contains(rule.className);
        const shouldHide = force !== null ? force : !hidden;

        if (shouldHide) {
            body.classList.add(rule.className);
            localStorage.setItem(rule.storageKey, "true");
            console.log('[DouYinTools] 隐藏元素:', rule.selector);
        } else {
            body.classList.remove(rule.className);
            localStorage.setItem(rule.storageKey, "false");
            console.log('[DouYinTools] 显示元素:', rule.selector);
        }
    }

    // 初始化侧栏隐藏状态
    function initSidebarToggle() {
        console.log('[DouYinTools] 初始化侧栏隐藏状态');

        // 确保body元素已经存在
        if (!document.body) {
            setTimeout(initSidebarToggle, 100);
            return;
        }

        rules.forEach(rule => {
            if (localStorage.getItem(rule.storageKey) === "true") {
                toggle(rule, true);
            }
        });
    }

    // 在DOMContentLoaded时初始化侧栏
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebarToggle);
    } else {
        setTimeout(initSidebarToggle, 500);
    }

    // 快捷键绑定 Alt + 数字
    document.addEventListener("keydown", (e) => {
        if (!e.altKey) return;

        const key = e.key.toUpperCase();

        rules.forEach(rule => {
            if (key === rule.key) {
                e.preventDefault();
                toggle(rule);
            }
        });
    });

    // ======================= 动态注入样式 =======================
    function injectStyles() {
        // 确保head元素已经存在
        if (!document.head) {
            setTimeout(injectStyles, 100);
            return;
        }

        let style = document.createElement("style");
        style.id = 'douyin-dynamic-styles';

        style.innerHTML = rules.map(r =>
            `.${r.className} ${r.selector} { display: none !important; }`
        ).join("\n");

        style.innerHTML += `
      .wUFzLKZF.danmakuContainer,
      .xgplayer-immersive-switch-setting.immersive-switch {
        display: none !important;
      }
    `;

        document.head.appendChild(style);
        console.log('[DouYinTools] 动态样式注入完成');
    }

    // 在DOMContentLoaded时注入样式
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
        setTimeout(injectStyles, 500);
    }

    // 以下是你原有的代码，保持不变...
    // ======================= 原有代码开始 =======================

    if (window.location.host === "www.douyin.com") {
        // 样式配置
        const styles = `
      #douyin-header {
        background: rgba(0, 0, 0, 0.1) !important;
        backdrop-filter: blur(5px) !important;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      #douyin-header.show {
        transform: translateY(0);
      }

      #douyin-right-container {
        padding: 0 !important;
      }
      .BrYiovk2.YbzuqE5j.semi-always-dark.lMX0vxiU.FDYan0Fo {
        margin-top: 20px !important;
       }
      /* 底部控制栏样式 */
      .xgplayer-controls {
        background: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(5px) !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
        opacity: 0.3 !important;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
      }

      .xgplayer-controls.show {
        transform: translateY(0);
      }

      .xgplayer-controls:hover {
        opacity: 1 !important;
      }

      #video-info-wrap {
        opacity: 0.3 !important;
        transition: opacity 0.3s ease !important;
      }

      #video-info-wrap:hover {
        opacity: 1 !important;
      }

      /* 隐藏遮罩层 */
      .video-info-mask,
      .UXyEyqbq.UdkDK3ea.DZKZZklc {
        display: none !important;
      }

      /* 调整视频高度 */
      .xg-video-container {
        height: 100% !important;
        margin: auto 0px !important;
        bottom: 0px !important;
      }

      /* 移除背景图片 */
      .P2uoik9n .basePlayerContainer .xgplayer-controls {
        background-image: none !important;
        background: none !important;
      }

      /* 隐藏右侧推荐 */
      .L1TH4HdO.d6KxRih3.positionBox,
      .L1TH4HdO.positionBox {
        display: none !important;
      }
    `;

        // 应用样式
        function applyStyles() {
            const style = document.createElement('style');
            style.textContent = styles;
            document.head.appendChild(style);
            console.log('[DouYinTools] 样式应用完成');
        }

        // 智能显示/隐藏顶部导航栏
        function setupHeaderBehavior() {
            const header = document.getElementById('douyin-header');
            if (!header) return;

            let lastMouseMoveTime = Date.now();
            let lastMouseY = 0;
            let showTimeout = null;
            let hideTimeout = null;
            let inactivityTimer = null;

            // 鼠标移动时显示导航栏
            function handleMouseMove(e) {
                lastMouseMoveTime = Date.now();
                lastMouseY = e.clientY;

                // 鼠标在顶部区域时显示导航栏
                if (e.clientY < 25) {
                    showHeader();

                    // 清除之前的隐藏定时器
                    clearTimeout(hideTimeout);
                    hideTimeout = null;

                    // 重置不活动计时器
                    resetInactivityTimer();
                }
            }

            // 重置不活动计时器
            function resetInactivityTimer() {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    // 如果鼠标不在顶部区域，隐藏导航栏
                    if (lastMouseY >= 100) {
                        hideHeader();
                    }
                }, 1500); // 3秒不活动后隐藏
            }

            // 鼠标在顶部区域时显示导航栏
            document.addEventListener('mousemove', handleMouseMove);

            // 当鼠标离开窗口时隐藏导航栏
            document.addEventListener('mouseleave', function() {
                hideHeader();
            });

            // 滚动时隐藏导航栏
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > 100) {
                    hideHeader();
                }
            });

            function showHeader() {
                clearTimeout(hideTimeout);
                hideTimeout = null;

                if (showTimeout) return;

                showTimeout = setTimeout(() => {
                    header.classList.add('show');
                    showTimeout = null;
                    console.log('[DouYinTools] 显示顶部导航栏');
                }, 100);
            }

            function hideHeader() {
                clearTimeout(showTimeout);
                showTimeout = null;

                if (hideTimeout) return;

                hideTimeout = setTimeout(() => {
                    header.classList.remove('show');
                    hideTimeout = null;
                    console.log('[DouYinTools] 隐藏顶部导航栏');
                }, 300);
            }

            // 初始化不活动计时器
            resetInactivityTimer();

            console.log('[DouYinTools] 顶部导航栏智能行为已启用');
        }

        // 页面加载完成后初始化
        function init() {
            applyStyles();

            // 等待页面元素加载
            const checkElements = setInterval(() => {
                const header = document.getElementById('douyin-header');
                const controls = document.querySelector('.xgplayer-controls');

                if (header && controls) {
                    clearInterval(checkElements);
                    setupHeaderBehavior();

                    // 添加一些视觉提示
                    header.style.transition = 'transform 0.3s ease';
                    header.style.willChange = 'transform';

                    controls.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    controls.style.willChange = 'transform, opacity';
                }
            }, 500);
        }

        // 处理单页应用路由变化
        function handleSPANavigation() {
            let lastUrl = location.href;

            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    init();
                }
            }).observe(document, { subtree: true, childList: true });
        }

        if (document.readyState === 'complete') {
            init();
            handleSPANavigation();
        } else {
            window.addEventListener('load', () => {
                init();
                handleSPANavigation();
            });
        }
    }

    // ======================= 直播检测（优化版） =======================
    let lastPressTime = 0;
    const DEBOUNCE_DELAY = 3000;
    let liveCheckInterval;

    function startLiveCheck() {
        if (liveCheckInterval) clearInterval(liveCheckInterval);

        liveCheckInterval = setInterval(() => {
            // 使用更具体的选择器提高性能
            const liveIndicators = document.querySelectorAll('.live-indicator, [data-e2e="live-indicator"]');
            const visibleLive = Array.from(liveIndicators).filter(isElementVisible);

            if (visibleLive.length > 0) {
                const now = Date.now();
                if (now - lastPressTime >= DEBOUNCE_DELAY) {
                    console.log("[DouYinTools] 检测到直播中，模拟按下键盘下键");
                    pressDownKey();
                    lastPressTime = now;
                }
            }
        }, 1000);
    }

    function isElementVisible(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    }

    function pressDownKey() {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    }

    // ======================= 元素隐藏（优化版） =======================
    let hideRetryCount = 0;
    const MAX_RETRY = 5;

    function hideElements() {
        const textsToHide = ['充钻石', '客户端', '壁纸', '投稿','更多'];
        let foundCount = 0;

        // 使用更具体的选择器
        document.querySelectorAll('.jenVD1aU, .iQdAxsPk, .xgplayer-playswitch').forEach(item => {
            const text = item.textContent.trim();
            if (textsToHide.some(t => text.includes(t))) {
                const parent = item.closest('.Xu0nlrYh') || item.closest('div');
                if (parent) {
                    // 使用更安全的隐藏方式
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    console.log('[DouYinTools] 通过文本隐藏:', text);
                    foundCount++;
                }
            }
        });

        const wallpaper = document.querySelector('.xFzvM6nY, .iQdAxsPk');
        if (wallpaper) {
            // 避免直接操作display
            wallpaper.closest('div').style.visibility = 'hidden';
            console.log('[DouYinTools] 通过类名隐藏壁纸');
            foundCount++;
        }

        if (foundCount < 4 && hideRetryCount < MAX_RETRY) {
            hideRetryCount++;
            console.log(`[DouYinTools] 只找到${foundCount}/4个元素，3秒后重试(${hideRetryCount}/${MAX_RETRY})...`);
            setTimeout(hideElements, 3000);
        } else if (foundCount >= 4) {
            console.log("[DouYinTools] 成功隐藏所有指定元素");
        } else {
            console.log("[DouYinTools] 达到最大重试次数，停止尝试");
        }
    }

    // ================== 安全样式注入 ==================
    function injectSafeStyles() {
        const styleId = 'douyin-safe-styles';
        let style = document.getElementById(styleId);

        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        // 简化样式规则
        style.textContent = `
      .xgplayer-playswitch.recommend-out-switch-btn {
        visibility: hidden !important;
        opacity: 0 !important;
      }
      .fullscreen_capture_feedback {
        padding-right: 0  !important;
      }
    `;
        console.log('[DouYinTools] 安全样式注入完成');
    }

    // ======================= 广告屏蔽 =======================
    const blockedKeywords = ['影视', '电影', '电视剧', '观影','好剧','狂飙'];
    let lastSkipTime = 0;
    let adObserver;

    function getVideoDescription() {
        const douyinDesc = document.querySelector('.xgplayer-video-info-wrap .title');
        return douyinDesc?.textContent.trim() || "";
    }

    function skipVideo() {
        const now = Date.now();
        if (now - lastSkipTime < DEBOUNCE_DELAY) return;
        lastSkipTime = now;

        const nextBtn = document.querySelector('.xgplayer-next');
        if (nextBtn) {
            nextBtn.click();
        } else {
            pressDownKey();
        }
    }

    function checkAndHandleVideo() {
        const description = getVideoDescription();
        if (!description) return;

        const matchedKeyword = blockedKeywords.find(k =>
                                                    description.toLowerCase().includes(k.toLowerCase())
                                                   );
        if (matchedKeyword) {
            console.log("[DouYinTools] 屏蔽触发:", matchedKeyword);
            skipVideo();
            showBlockNotice(matchedKeyword);
        }
    }

    function observeVideo() {
        // 如果已有观察者，先断开
        if (adObserver) adObserver.disconnect();

        const videoContainer = document.querySelector('.xgplayer-video-info-wrap');
        if (!videoContainer) {
            setTimeout(observeVideo, 1000);
            return;
        }

        adObserver = new MutationObserver(() => checkAndHandleVideo());
        adObserver.observe(videoContainer, { childList: true, subtree: true });
        console.log('[DouYinTools] 视频观察者已启动');
    }

    function showBlockNotice(keyword) {
        const notice = document.createElement('div');
        notice.textContent = `[屏蔽] 已跳过含 "${keyword}" 的视频`;
        Object.assign(notice.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "20px",
            zIndex: 9999,
            fontSize: "14px",
            maxWidth: "80%"
        });
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2000);
    }

    // ======================= 初始化执行 =======================
    console.log("[DouYinTools] 脚本开始初始化");

    // 性能监控
    console.time('[DouYinTools] 初始化时间');

    // 启动各项功能
    startLiveCheck();
    hideElements();
    injectSafeStyles();
    observeVideo();
    checkAndHandleVideo();

    console.log("[DouYinTools] 屏蔽器启用，关键词：", blockedKeywords);

    // 结束性能监控
    console.timeEnd('[DouYinTools] 初始化时间');


    // 最终版：持续监控并隐藏指定元素
    function setupElementHider() {
        // 要隐藏的元素文本列表
        const textsToHide = ['充钻石', '客户端', '壁纸', '投稿'];
        let checkInterval = null;
        let successCount = 0;

        // 隐藏元素的函数
        function hideElements() {
            let foundCount = 0;

            // 方法1：通过文本内容匹配
            document.querySelectorAll('.jenVD1aU, .iQdAxsPk').forEach(item => {
                const text = item.textContent.trim();
                if (textsToHide.some(t => text.includes(t))) {
                    const parent = item.closest('.Xu0nlrYh') || item.closest('div');
                    if (parent && parent.style.display !== 'none') {
                        parent.style.display = 'none';
                        console.log('[DouYinTools] 隐藏元素:', text);
                        foundCount++;
                    }
                }
            });

            // 方法2：通过特定类名匹配壁纸
            const wallpapers = document.querySelectorAll('.xFzvM6nY, .iQdAxsPk');
            wallpapers.forEach(wallpaper => {
                const parent = wallpaper.closest('div');
                if (parent && parent.style.display !== 'none') {
                    parent.style.display = 'none';
                    console.log('[DouYinTools] 隐藏壁纸元素');
                    foundCount++;
                }
            });

            // 如果首次找到全部元素，减少检查频率
            if (foundCount > 0) {
                successCount++;
                if (successCount > 3) {
                    clearInterval(checkInterval);
                    checkInterval = setInterval(hideElements, 5000); // 降低到5秒检查一次
                    console.log('[DouYinTools] 已稳定隐藏元素，降低检查频率');
                }
            }
        }

        // 初始立即执行一次
        hideElements();

        // 设置定时检查（1秒检查一次）
        checkInterval = setInterval(hideElements, 1000);

        // 添加样式防止闪烁
        const style = document.createElement('style');
        style.textContent = `
      [data-e2e="something-button"] {
        transition: opacity 0.3s;
      }
      .force-hidden {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
        document.head.appendChild(style);

        // 监听DOM变化（MutationObserver作为第二重保障）
        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('[DouYinTools] 元素隐藏监控已启动');
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        setupElementHider();
    } else {
        window.addEventListener('load', setupElementHider);
    }

    //=================================全局监测=================================
    const SWIPE_THRESHOLD = 200; // 滑动阈值
    const CLICK_MAX_MOVE = 5; // 点击最大移动距离
    const CLICK_MAX_TIME = 300; // 点击最大时长
    const LONG_PRESS_TIME = 500; // 长按判定时间(ms)

    // 状态变量
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isMouseDown = false;
    let isSwiping = false;
    let blockClick = false;
    let longPressTimer = null;
    let isLongPressing = false;

    // 鼠标按下事件
    document.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        isMouseDown = true;
        isSwiping = false;
        blockClick = false;
        isLongPressing = false;

        console.log('[DouYinTools] 鼠标按下，坐标:', startX, startY);

        // 鼠标中键处理（打开/关闭评论区）
        if (e.button === 1) {
            e.preventDefault();
            e.stopPropagation();
            simulateKeyPress('x');
            return;
        }

        // 鼠标左键处理
        if (e.button === 0) {
            // 设置长按计时器
            longPressTimer = setTimeout(() => {
                if (isMouseDown && !isSwiping) {
                    isLongPressing = true;
                    blockClick = true; // 关键修改：拦截后续点击
                    console.log('[DouYinTools] 检测到左键长按，开始模拟D键');
                    simulateKeyPress('d', true); // 开始长按D键
                }
            }, LONG_PRESS_TIME);
        }
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // 如果正在长按D键，则跳过滑动检测
        if (isLongPressing) return;

        // 滑动检测
        if (!isSwiping) {
            if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
                isSwiping = true;
                blockClick = true;

                // 如果正在长按计时中，取消长按
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }

                let direction = Math.abs(deltaX) > Math.abs(deltaY)
                ? (deltaX > 0 ? 'right' : 'left')
                : (deltaY > 0 ? 'down' : 'up');

                handleSwipe(direction);
            }
        }
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', function(e) {
        if (!isMouseDown) return;

        // 左键释放处理
        if (e.button === 0) {
            // 清除长按计时器
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // 如果正在长按D键，发送keyup事件
            if (isLongPressing) {
                console.log('[DouYinTools] 左键释放，结束模拟D键');
                simulateKeyUp('d');

                // 关键修改：阻止默认行为，避免触发暂停
                e.preventDefault();
                e.stopPropagation();
            }
        }

        const endX = e.clientX;
        const endY = e.clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Date.now() - startTime;

        // 判定为点击
        if (distance < CLICK_MAX_MOVE && duration < CLICK_MAX_TIME && !isSwiping && !isLongPressing) {
            console.log('[DouYinTools] 检测到正常点击');
        } else if (isSwiping || isLongPressing) {
            // 如果是滑动或长按，阻止默认点击
            e.preventDefault();
            e.stopPropagation();
        }

        // 重置状态
        isMouseDown = false;
        isSwiping = false;
        isLongPressing = false;
        setTimeout(() => {
            blockClick = false;
        }, 50);

        console.log('[DouYinTools] 鼠标释放，流程结束');
    });

    // 捕获阶段拦截点击，避免误触暂停
    document.addEventListener('click', function(e) {
        if (blockClick) {
            e.stopPropagation();
            e.preventDefault();
            console.log('[DouYinTools] 阻止了滑动/长按后多余的点击');
        }
    }, true);

    // 处理滑动方向
    function handleSwipe(direction) {
        console.log('[DouYinTools] 检测到滑动方向:', direction);

        switch(direction) {
            case 'left':
                console.log('[DouYinTools] 执行左滑操作，模拟点赞');
                likeVideo();
                break;
            case 'right':
                console.log('[DouYinTools] 执行右滑操作，模拟按r键');
                simulateKeyPress('r');
                break;
            case 'up':
                console.log('[DouYinTools] 执行上滑操作');
                break;
            case 'down':
                console.log('[DouYinTools] 执行下滑操作');
                break;
        }
    }

    // 点赞函数
    function likeVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        const wasPlaying = !video.paused;

        // 模拟按下 z 键点赞
        simulateKeyPress('z');
        console.log('[DouYinTools] 已执行点赞操作');

        // 如果原本在播放，恢复播放
        if (wasPlaying) {
            setTimeout(() => {
                if (video.paused) {
                    video.play();
                    console.log('[DouYinTools] 恢复视频播放');
                }
            }, 100);
        }
    }

    // 模拟按键按下
    function simulateKeyPress(key, isLongPress = false) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: `Key${key.toUpperCase()}`,
            keyCode: key.charCodeAt(0),
            which: key.charCodeAt(0),
            bubbles: true,
            cancelable: true,
            repeat: isLongPress // 标记是否为长按
        });
        document.dispatchEvent(event);
        console.log(`[DouYinTools] 已模拟按下 ${key} 键${isLongPress ? ' (长按)' : ''}`);
    }

    // 模拟按键释放
    function simulateKeyUp(key) {
        const event = new KeyboardEvent('keyup', {
            key: key,
            code: `Key${key.toUpperCase()}`,
            keyCode: key.charCodeAt(0),
            which: key.charCodeAt(0),
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
        console.log(`[DouYinTools] 已模拟释放 ${key} 键`);
    }

    console.log('[DouYinTools] 脚本已加载，鼠标操作增强功能已启用');
})();