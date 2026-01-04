// ==UserScript==
// @name         B站总赞数统计器
// @namespace    https://greasyfork.org/zh-CN/scripts/553065
// @version      1.0
// @description  🐾 全网首发原创脚本嗷~ 这是帮你统计B站总赞数的小工具！生成报告，还有超多头衔等你解锁！(ฅ´ω`ฅ)
// @author       小小电子xxdz
// @match        https://message.bilibili.com/*
// @grant        GM_addStyle
// @icon         https://article.biliimg.com/bfs/new_dyn/356e12a744df26a2f38a158da87c364b3461569935575626.png
// @license      GPL
// @homepage     https://space.bilibili.com/3461569935575626
// @supportURL   https://miku66ccff.freeflarum.com
// @downloadURL https://update.greasyfork.org/scripts/553065/B%E7%AB%99%E6%80%BB%E8%B5%9E%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553065/B%E7%AB%99%E6%80%BB%E8%B5%9E%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%99%A8.meta.js
// ==/UserScript==

console.log('BiliLike-Counterの脚本已加载')
// 添加Font Awesome样式和正在滚动动画
GM_addStyle(`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
@keyframes scrollProgress {
    0% {
        background-position: 150% 0%;
    }
    100% {
        background-position: -150% 0%;
    }
}
`);

(function() {
    'use strict';

    let isScrolling = false;
    let scrollInterval;
    let lastItemCount = 0;
    let noNewItemsTimer;
    let scrollAttempts = 0;
    let realTimeStats = false;
    let scrollSpeed = 300;
    let performanceMode = false;
    let imageBlockObserver = null;
    let activeWindow = null;
    let isGeneratingReport = false;
    // 保存原始图片URL的映射表
    const originalImageSources = new Map();

    // 需要保留的头像图片特征
    const preserveAvatarUrls = [
        "//i1.hdslb.com/bfs/face/87e609940c74ed2e7dcf6b2b19b3029f8e1566e1.jpg@240w_240h_1c_1s_!web-avatar-nav.webp",
        "https://i1.hdslb.com/bfs/face/87e609940c74ed2e7dcf6b2b19b3029f8e1566e1.jpg@240w_240h_1c_1s_!web-avatar-nav.webp",
        "https://i1.hdslb.com/bfs/face/87e609940c74ed2e7dcf6b2b19b3029f8e1566e1.jpg"
    ];

// 创建打开脚本的小按钮
function createOpenScriptButton() {
    const openButton = document.createElement('div');
    openButton.id = 'openScriptButton';
    openButton.style.cssText = `
        position: fixed;
        top: 80px; /* 向下移动到距离顶部80px的位置 */
        left: 20px;
        width: 50px;
        height: 50px;
        background: #00a1d6;
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 24px;
        font-weight: bold;
        transition: all 0.3s ease;
        user-select: none;
        overflow: hidden;
    `;

    // 使用图片图标
    openButton.innerHTML = `
        <img src="https://article.biliimg.com/bfs/new_dyn/356e12a744df26a2f38a158da87c364b3461569935575626.png"
             style="width: 30px; height: 28.3px; object-fit: contain;
                    filter: drop-shadow(0 0 3px white) drop-shadow(0 0 5px white);">
    `;

    openButton.title = '打开B站总赞数统计器(￢ω￢)';

    // 鼠标悬停效果
    openButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = '#fb7299';
    });
    openButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = '#00a1d6';
    });

    // 点击打开主窗口
    openButton.addEventListener('click', function() {
        const existingWindow = document.getElementById('totalLikesWindow');
        if (!existingWindow) {
            createFloatingWindow();
            // 隐藏小按钮
            openButton.style.display = 'none';
        }
    });

    document.body.appendChild(openButton);
    return openButton;
}

// 创建主控制窗口
function createFloatingWindow() {
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'totalLikesWindow';
    floatingWindow.style.cssText = `
        position: fixed;
        top: 100px;
        left: 20px;
        width: 380px;
        background: white;
        border: 2px solid #00a1d6;
        border-radius: 0px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
        user-select: none;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease-out;
    `;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: #00a1d6;
            color: white;
            padding: 12px 16px;
            border-radius: 0px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
titleBar.innerHTML = `
    <span style="display: flex; align-items: center;">
        <img src="https://article.biliimg.com/bfs/new_dyn/356e12a744df26a2f38a158da87c364b3461569935575626.png"
             style="width: 30px; height: 28.3px; object-fit: contain; margin-right: 8px; filter: drop-shadow(0 0 3px white) drop-shadow(0 0 5px white);">
        B站总赞数统计器
    </span>
    <span style="cursor: pointer; font-size: 18px;" id="closeWindow">×</span>
`;

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `padding: 1px; position: relative;`;

        const content = document.createElement('div');
        content.id = 'windowContent';
        content.style.cssText = `cursor: default;`;
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px; position: relative;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">已统计的总赞数OwO</div>
                <div style="position: relative; display: inline-block;">
                    <div style="font-size: 32px; font-weight: bold; color: #00a1d6;" id="totalLikesCount">0</div>
                    <div id="chineseNumber" style="position: absolute; bottom: 2px; right: 0; transform: translateX(100%); font-size: 12px; color: #999; font-weight: normal; white-space: nowrap; padding-left: 5px;">零</div>
                </div>
            </div>
<div style="position: relative; margin-bottom: 15px; min-height: 86.5px;">
    <!-- 统计数据 - 保持居中 -->
    <div style="font-size: 12px; color: #999; text-align: center; position: relative; z-index: 2;">
        <div>动态赞数: <span id="dynamicLikes">0</span></div>
        <div>视频赞数: <span id="videoLikes">0</span></div>
        <div>评论赞数: <span id="commentLikes">0</span></div>
        <div>弹幕赞数: <span id="danmakuLikes">0</span></div>
    </div>

    <!-- 左下角图片 -->
<img src="https://article.biliimg.com/bfs/new_dyn/c7ec01517b138983f344bce5362f57fc3461569935575626.png"
     style="position: absolute; left: 0; bottom: -15px; width: 94px; height: 86.5px; object-fit: contain; z-index: 1;"
     alt="装饰图片">
</div>

            <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 0px;">
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="realTimeStats" style="margin-right: 8px;">
                        <span style="font-size: 14px;">滚动时就实时统计数据</span>
                    </label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="performanceMode" style="margin-right: 8px;">
                        <span style="font-size: 14px;">性能模式 (会禁止列表加载图片噢)</span>
                    </label>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span style="font-size: 14px;">滚动速度(根据设备性能调整嗷):</span>
                        <span id="speedValue" style="font-size: 12px; color: #666;">${scrollSpeed}ms</span>
                    </div>
                    <div style="position: relative;">
                        <input type="range" id="scrollSpeed" min="100" max="1000" step="50" value="${scrollSpeed}"
                               style="width: 100%; height: 6px; border-radius: 0px; background: #ddd; outline: none; -webkit-appearance: none;">
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: #999; margin-top: 2px;">
                        <span>快</span>
                        <span>慢</span>
                    </div>
                </div>
            </div>

            <div style="background: #fff8e1; border: 1px solid #ffd54f; padding: 8px; margin-bottom: 15px; border-radius: 0px;">
                <div style="font-size: 9px; color: #e65100; text-align: center; line-height: 1.2;">
                    ⚠️ 提示：滚动时请保持当前标签页处于显示状态，也不要最小化浏览器嗷
                </div>
            </div>

            <button id="countLikesBtn" style="
                width: 100%;
                padding: 10px;
                background: #00a1d6;
                color: white;
                border: none;
                border-radius: 0px;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 8px;
                transition: background 0.3s;
            ">直接统计已加载的数据</button>
            <button id="autoScrollBtn" style="
                width: 100%;
                padding: 10px;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 0px;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 8px;
                transition: background 0.3s;
            ">【推荐】自动滚动加载(完成后自动统计)</button>
            <button id="viewReportBtn" style="
                width: 100%;
                padding: 10px;
                background: #fb7299;
                color: white;
                border: none;
                border-radius: 0px;
                font-size: 14px;
                cursor: pointer;
                display: none;
                transition: background 0.3s;
            ">查看专属报告(可分享)</button>

<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
    <div style="font-size: 10px; color: #999;">
        内部版本<span style="background: #66ccff; color: white; padding: 1px 3px; border-radius: 2px; margin: 0 2px;">v6.5</span>正式版本<span style="background: #66ccff; color: white; padding: 1px 3px; border-radius: 2px; margin: 0 2px;">v1.0</span>
    </div>
    <div style="font-size: 10px; color: #999; cursor: pointer;" id="authorInfoBtn">脚本作者:小小电子xxdz</div>
</div>

<div id="status" style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;"></div>
<div id="scrollStatus" style="font-size: 11px; color: #999; text-align: center; margin-top: 5px;"></div>
`;
        contentContainer.appendChild(content);
        floatingWindow.appendChild(titleBar);
        floatingWindow.appendChild(contentContainer);
        document.body.appendChild(floatingWindow);

        customizeSlider();
        makeDraggable(floatingWindow, titleBar);
        setupWindowFocus(floatingWindow);

        setTimeout(() => {
            floatingWindow.style.opacity = '1';
            floatingWindow.style.transform = 'scale(1)';
        }, 10);

        // 修改关闭窗口的函数，添加显示小按钮的逻辑
        function closeWindowWithAnimation(windowElement) {
            windowElement.style.opacity = '0';
            windowElement.style.transform = 'scale(0.8)';
            setTimeout(() => {
                windowElement.remove();
                // 窗口关闭后显示小按钮
                const openButton = document.getElementById('openScriptButton');
                if (openButton) {
                    openButton.style.display = 'flex';
                }
            }, 300);
        }

        // 修改关闭按钮的事件监听
        document.getElementById('closeWindow').addEventListener('click', () => closeWindowWithAnimation(floatingWindow));

        document.getElementById('realTimeStats').addEventListener('change', () => {
            realTimeStats = document.getElementById('realTimeStats').checked;
            updateScrollStatus(`实时统计: ${realTimeStats ? '开启咯' : '关闭啦'}`);
        });
        document.getElementById('performanceMode').addEventListener('change', () => {
            if (isScrolling) {
                stopAutoScroll();
                setTimeout(() => {
                    performanceMode = document.getElementById('performanceMode').checked;
                    togglePerformanceMode(performanceMode);
                    updateScrollStatus(`性能模式: ${performanceMode ? '开启咯' : '关闭啦'}`);
                    startAutoScroll();
                }, 300);
            } else {
                performanceMode = document.getElementById('performanceMode').checked;
                togglePerformanceMode(performanceMode);
                updateScrollStatus(`性能模式: ${performanceMode ? '开启咯' : '关闭啦'}`);
            }
        });
        document.getElementById('viewReportBtn').addEventListener('click', showReport);
        document.getElementById('authorInfoBtn').addEventListener('click', showAuthorInfo);

        const speedSlider = document.getElementById('scrollSpeed');
        const speedValue = document.getElementById('speedValue');
        speedSlider.addEventListener('input', function() {
            scrollSpeed = parseInt(this.value);
            speedValue.textContent = scrollSpeed + 'ms';
            if (isScrolling) {
                stopAutoScroll();
                setTimeout(startAutoScroll, 100);
            }
        });

        // 初始化页面检查
        if (!document.querySelector('.love-list')) {
// 不在"收到的赞"页面，显示提示呢
setTimeout(() => {
    const status = document.getElementById('status');
    if (status) {
        status.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; font-size: 14px; margin-bottom: 8px; font-weight: bold;">
                ⚠️ 当前不在"收到的赞"页面嗷
            </div>
            <div style="color: #666; text-align: center; font-size: 12px; margin-bottom: 10px;">
                请先切换到"收到的赞"页面再使用统计功能喵~
            </div>
            <button id="switchToLovePageMain" style="
                background: #00a1d6;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                width: 200px;
            ">点击切换到"收到的赞"页面！</button>
        `;

        // 添加切换按钮事件
        document.getElementById('switchToLovePageMain').addEventListener('click', switchToLovePage);
    }
}, 100);
        }

        simulateHoverToLoadUserInfo();
        updateChineseNumber(0);

        return floatingWindow;
    }

    // 关闭窗口の动画
    function closeWindowWithAnimation(windowElement) {
        windowElement.style.opacity = '0';
        windowElement.style.transform = 'scale(0.8)';
        setTimeout(() => windowElement.remove(), 300);
    }

    // 阿B小电视图片滑块样式
    function customizeSlider() {
        const style = document.createElement('style');
        style.textContent = `
            #scrollSpeed::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: url('https://article.biliimg.com/bfs/new_dyn/cf84ec14a28d0585c3fe7ff8057f487f3461569935575626.png') center/contain no-repeat;
                cursor: pointer;
                border: none;
                border-radius: 0;
            }
            #scrollSpeed::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: url('https://article.biliimg.com/bfs/new_dyn/cf84ec14a28d0585c3fe7ff8057f487f3461569935575626.png') center/contain no-repeat;
                cursor: pointer;
                border: none;
                border-radius: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // 设置窗口焦点
    function setupWindowFocus(windowElement) {
        windowElement.addEventListener('mousedown', () => bringToFront(windowElement));
    }

    // 窗口置顶
    function bringToFront(windowElement) {
        if (activeWindow === windowElement) return;
        if (activeWindow) activeWindow.style.zIndex = '10000';
        windowElement.style.zIndex = '10001';
        activeWindow = windowElement;
    }

    // 中文数字转换（中文数字是为了让大家一眼就可以看到单位，方便快捷）
    function numberToChinese(num) {
        if (num === 0) return '零';
        if (num >= 10000) {
            const wan = Math.floor(num / 10000);
            const remainder = num % 10000;
            let result = numberToChinese(wan) + '万';
            if (remainder > 0) result += remainder < 1000 ? '零' + numberToChinese(remainder) : numberToChinese(remainder);
            return result;
        }
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const units = ['', '十', '百', '千'];
        if (num < 10) return digits[num];
        if (num < 20) return num === 10 ? '十' : '十' + digits[num % 10];
        let str = '', temp = num, unitIndex = 0, lastZero = false;
        while (temp > 0) {
            const n = temp % 10;
            if (n === 0) {
                if (!lastZero && unitIndex !== 0) {
                    str = digits[0] + str;
                    lastZero = true;
                }
            } else {
                str = digits[n] + units[unitIndex] + str;
                lastZero = false;
            }
            unitIndex++;
            temp = Math.floor(temp / 10);
        }
        str = str.replace(/^一十/, '十').replace(/零+$/, '').replace(/零[千百十]/g, '零').replace(/零零/g, '零');
        return str;
    }

    // 更新中文数字显示
    function updateChineseNumber(num) {
        const chineseElement = document.getElementById('chineseNumber');
        if (chineseElement) chineseElement.textContent = numberToChinese(num);
    }

    // 模拟悬浮加载用户信息
    function simulateHoverToLoadUserInfo() {
        const headerAvatar = document.querySelector('#message-pc-header .header-entry-mini, .header-avatar-wrap, .bili-avatar');
        if (headerAvatar) {
            headerAvatar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            headerAvatar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            setTimeout(() => {
                headerAvatar.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                headerAvatar.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            }, 1000);
        }
    }

    // 获取用户信息 - 关键修复：确保获取原始头像URL
    function getUserInfo() {
        let nickname = 'B站用户', avatarUrl = 'https://i0.hdslb.com/bfs/face/member/noface.jpg';
        const nicknameSelectors = [
            '.nickname-item.light', '.header-avatar-wrap .name', '.bili-dropdown .name',
            '.navigation-bar .user-name', '#message-pc-header .nickname-item', '.mini-header .name'
        ];
        for (const selector of nicknameSelectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim()) {
                nickname = el.textContent.trim();
                break;
            }
        }
        const avatarSelectors = [
            '.bili-avatar-img', '.header-avatar-wrap img', '.bili-avatar-face', '.header-avatar img'
        ];
        for (const selector of avatarSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                // 优先从我们保存的原始URL映射表中获取
                let src = originalImageSources.get(el) ||
                          el.getAttribute('data-original-src') ||
                          el.getAttribute('data-src') ||
                          el.src;

                if (src && src.includes('data:image/gif')) {
                    src = originalImageSources.get(el) ||
                          el.getAttribute('data-original-src') ||
                          el.getAttribute('data-src');
                }

                if (src && !src.includes('noface') && !src.includes('base64')) {
                    src = src.startsWith('//') ? 'https:' + src :
                          src.startsWith('/') ? 'https:' + src : src;
                    avatarUrl = src;
                    break;
                }
            }
        }
        return { nickname, avatarUrl };
    }

    // 显示作者小小电子xxdzの信息
    function showAuthorInfo() {
        const authorWindow = document.createElement('div');
        authorWindow.id = 'authorInfoWindow';
        authorWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            width: 400px;
            background: white;
            border: 2px solid #00a1d6;
            border-radius: 0px;
            box-shadow: 0 4px 20px rgba(0, 161, 214, 0.3);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
            overflow: hidden;
            user-select: none;
            opacity: 0;
            transition: all 0.3s ease-out;
        `;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: #00a1d6;
            color: white;
            padding: 12px 16px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        titleBar.innerHTML = `
          <span><i class="fa fa-paw"></i> 关于作者</span>
            <span style="cursor: pointer; font-size: 18px;" id="closeAuthorWindow">×</span>
        `;

const content = document.createElement('div');
content.style.cssText = `padding: 20px; cursor: default;`;
content.innerHTML = `
    <div style="display: flex; align-items: flex-start; margin-bottom: 20px; cursor: pointer;" id="authorProfile">
        <img src="https://i1.hdslb.com/bfs/face/87e609940c74ed2e7dcf6b2b19b3029f8e1566e1.jpg"
             style="width: 60px; height: 60px; border-radius: 3px; margin-right: 15px;">
        <div style="flex: 1;">
            <div style="font-size: 18px; font-weight: bold; color: #00a1d6; margin-bottom: 5px;">小小电子xxdz</div>
            <div style="font-size: 14px; color: #666; line-height: 1.4;">我叫電籽,一只爱好电脑 术曲滴小狼‖XXDZ工作室创始人</div>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px;">
        <a href="https://www.bilibili.com/video/BV1PtTDzQE6c" target="_blank" style="
            display: block;
            padding: 10px;
            background: #fb7299;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 0px;
            font-size: 14px;
            transition: background 0.3s;
        " onmouseover="this.style.background='#ff8ab0'" onmouseout="this.style.background='#fb7299'">
            观看此插件演示视频
        </a>

        <a href="https://greasyfork.org/zh-CN/scripts/553065" target="_blank" style="
            display: block;
            padding: 10px;
            background: #23c16b;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 0px;
            font-size: 14px;
            transition: background 0.3s;
        " onmouseover="this.style.background='#2cd67a'" onmouseout="this.style.background='#23c16b'">
            检查更新 <span style="font-size: 12px;">(需要VPN)</span>
        </a>

        <a href="https://miku66ccff.freeflarum.com/blog/176-bililike-counter-update-page" target="_blank" style="
            display: block;
            padding: 10px;
            background: #ffb11b;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 0px;
            font-size: 14px;
            transition: background 0.3s;
        " onmouseover="this.style.background='#ffc04d'" onmouseout="this.style.background='#ffb11b'">
            通过UP网站检查更新 <span style="font-size: 12px;">(无需VPN,但需要手动复制源码)</span>
        </a>

        <a href="https://github.com/xxdz-Official/BiliLike-Counter" target="_blank" style="
            display: block;
            padding: 10px;
            background: #333;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 0px;
            font-size: 14px;
            transition: background 0.3s;
        " onmouseover="this.style.background='#555'" onmouseout="this.style.background='#333'">
            <i class="fa fa-github" style="margin-right: 8px;"></i>前往GitHub仓库
        </a>
    </div>

    <button id="closeAuthorBtn" style="
        width: 100%;
        padding: 10px;
        background: #00a1d6;
        color: white;
        border: none;
        border-radius: 0px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s;
    " onmouseover="this.style.background='#33b4de'" onmouseout="this.style.background='#00a1d6'">
        关闭窗口
    </button>
`;

        authorWindow.appendChild(titleBar);
        authorWindow.appendChild(content);
        document.body.appendChild(authorWindow);

        makeDraggable(authorWindow, titleBar);
        setupWindowFocus(authorWindow);
        bringToFront(authorWindow);

        setTimeout(() => {
            authorWindow.style.opacity = '1';
            authorWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        document.getElementById('authorProfile').addEventListener('click', () => window.open('https://space.bilibili.com/3461569935575626', '_blank'));
        document.getElementById('closeAuthorWindow').addEventListener('click', () => closeWindowWithAnimation(authorWindow));
        document.getElementById('closeAuthorBtn').addEventListener('click', () => closeWindowWithAnimation(authorWindow));
    }

    // 拖动逻辑
    function makeDraggable(element, handle) {
        let isDragging = false, startX, startY, initialX, initialY;
        handle.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            element.style.position = 'fixed';
            element.style.left = initialX + 'px';
            element.style.top = initialY + 'px';
            element.style.transform = 'none';
            bringToFront(element);
            e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = (initialX + dx) + 'px';
            element.style.top = (initialY + dy) + 'px';
        });
        document.addEventListener('mouseup', () => isDragging = false);
    }

    // 判断是否为需要保留的头像图片
    function isPreservedAvatar(src) {
        if (!src) return false;
        const normalizedSrc = src.replace(/^https?:/, '');
        return preserveAvatarUrls.some(url => normalizedSrc.includes(url.replace(/^https?:/, '')));
    }

    // 性能模式开关（保留指定作者和用户头像噢）
    function togglePerformanceMode(enabled) {
        if (isGeneratingReport) return;

        if (enabled) {
            // 保存原始函数（仅在未保存时保存）
            if (!window.originalImage) {
                window.originalImage = window.Image;
            }
            if (!window.originalAddEventListener) {
                window.originalAddEventListener = EventTarget.prototype.addEventListener;
            }

            // 重写Image构造函数
            window.Image = function() {
                const img = new window.originalImage();
                Object.defineProperty(img, 'src', {
                    set: function(value) {
                        // 保存原始URL
                        originalImageSources.set(this, value);

                        // 如果是需要保留的头像，则正常加载
                        if (isPreservedAvatar(value)) {
                            this.setAttribute('data-original-src', value);
                            this.__proto__.src = value;
                        } else {
                            // 其他图片阻止加载
                            this.setAttribute('data-blocked-src', value);
                            this.__proto__.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                        }
                    },
                    get: function() {
                        const blockedSrc = this.getAttribute('data-blocked-src');
                        const originalSrc = this.getAttribute('data-original-src');
                        return originalSrc || blockedSrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    }
                });
                return img;
            };

            // 拦截事件监听器
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (this.tagName === 'IMG' && (type === 'load' || type === 'error')) {
                    // 保留的头像不拦截事件
                    if (isPreservedAvatar(this.src) || isPreservedAvatar(this.getAttribute('data-src'))) {
                        return window.originalAddEventListener.call(this, type, listener, options);
                    }
                    return;
                }
                return window.originalAddEventListener.call(this, type, listener, options);
            };

            // 立即处理现有图片
            blockAllExistingImages();

            // 启动观察器监控新图片
            startImageBlockingObserver();

            updateScrollStatus('性能模式已开启，会保护某些图片不被侵犯>w<');
        } else {
            // 恢复原始函数（仅在已保存时恢复）
            if (window.originalImage) {
                window.Image = window.originalImage;
            }
            if (window.originalAddEventListener) {
                EventTarget.prototype.addEventListener = window.originalAddEventListener;
            }

            // 停止观察器
            stopImageBlockingObserver();

            // 恢复图片
            restoreBlockedImages();

            // 清空URL映射表
            originalImageSources.clear();

            updateScrollStatus('性能模式已关闭 - 列表の图片加载已恢复');
        }
    }

    // 启动图片阻止观察器
    function startImageBlockingObserver() {
        if (imageBlockObserver) {
            imageBlockObserver.disconnect();
        }

        imageBlockObserver = new MutationObserver(function(mutations) {
            if (isGeneratingReport) return;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG' || node.tagName === 'PICTURE' || node.tagName === 'SOURCE') {
                                blockImageElement(node);
                            }
                            const images = node.querySelectorAll ? node.querySelectorAll('img, picture, source') : [];
                            images.forEach(blockImageElement);
                        }
                    });
                }
            });
        });

        imageBlockObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 停止图片阻止观察器
    function stopImageBlockingObserver() {
        if (imageBlockObserver) {
            imageBlockObserver.disconnect();
            imageBlockObserver = null;
        }
    }

// 阻止单个图片元素（保留某头像）
function blockImageElement(element) {
    if (isGeneratingReport) return;

    if (element.tagName === 'IMG') {
        const src = element.src || element.getAttribute('data-src') || '';

        // 新增：如果是脚本内的图片，不拦截
        if (element.closest('#totalLikesWindow, #authorInfoWindow, #bilibiliReportWindow')) {
            return;
        }

        // 保存原始URL
        if (!originalImageSources.has(element)) {
            originalImageSources.set(element, src);
        }

        // 保留头像图片
        if (isPreservedAvatar(src)) {
            return;
        }

        if (!element.hasAttribute('data-original-src')) {
            element.setAttribute('data-original-src', src);
        }
        element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        element.srcset = '';
    } else if (element.tagName === 'SOURCE') {
        // 新增：如果是脚本内的source元素，不拦截
        if (element.closest('#totalLikesWindow, #authorInfoWindow, #bilibiliReportWindow')) {
            return;
        }

        const srcset = element.srcset || '';
        if (!preserveAvatarUrls.some(url => srcset.includes(url))) {
            element.srcset = '';
        }
    } else if (element.tagName === 'PICTURE') {
        // 新增：如果是脚本内的picture元素，不拦截
        if (element.closest('#totalLikesWindow, #authorInfoWindow, #bilibiliReportWindow')) {
            return;
        }

        const sources = element.querySelectorAll('source');
        sources.forEach(source => {
            const srcset = source.srcset || '';
            if (!preserveAvatarUrls.some(url => srcset.includes(url))) {
                source.srcset = '';
            }
        });
        const img = element.querySelector('img');
        if (img) {
            blockImageElement(img);
        }
    }
}

    // 阻止所有现有图片（保留头像）
    function blockAllExistingImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 保存原始URL
            if (!originalImageSources.has(img)) {
                originalImageSources.set(img, img.src || img.getAttribute('data-src') || '');
            }
            blockImageElement(img);
        });

        const sources = document.querySelectorAll('source');
        sources.forEach(source => {
            const srcset = source.srcset || '';
            if (!preserveAvatarUrls.some(url => srcset.includes(url))) {
                source.srcset = '';
            }
        });

        const pictures = document.querySelectorAll('picture');
        pictures.forEach(picture => {
            const img = picture.querySelector('img');
            if (img) {
                blockImageElement(img);
            }
        });
    }

    // 恢复被阻止的图片
    function restoreBlockedImages() {
        const images = document.querySelectorAll('img[data-original-src]');
        images.forEach(img => {
            const originalSrc = img.getAttribute('data-original-src');
            if (originalSrc) {
                img.src = originalSrc;
            }
            img.removeAttribute('data-original-src');
            img.removeAttribute('data-blocked-src');
        });
    }

    // 显示完成提示
    function showCompletionMessage(currentCount) {
        const stats = countAllLikes();
        updateDisplay(stats);

        const content = document.getElementById('windowContent');
        content.style.background = 'linear-gradient(135deg, #fff5f7, #ffeef2)';
        content.style.borderRadius = '0px';

        document.getElementById('viewReportBtn').style.display = 'block';
        updateScrollStatus(`🎉 统计完成啦！共加载 ${currentCount} 条记录，总赞数: ${stats.total.toLocaleString()}`);
        document.getElementById('status').innerHTML = `
            <div style="color: #fb7299; font-weight: bold; font-size: 14px; margin-bottom: 5px;">🎊 统计完成！</div>
            <div style="color: #666;">共找到 ${currentCount} 条点赞记录<br>总赞数: <strong style="color: #fb7299;">${stats.total.toLocaleString()}</strong></div>
        `;
    }
    // 获取带评分标准的称号显示
    function getTitlesWithCriteria(titles) {
        const criteriaMap = {
            '✨ 动态区的小太阳': '≥ 三万',
            '✨ 动态创作达人': '≥ 一万',
            '✨ 动态小能手': '≥ 三千',
            '🎬 视频区的大佬喵': '≥ 十万',
            '🎬 优质视频阿婆主': '≥ 五万',
            '🎬 视频创作小阿婆': '≥ 一万',
            '💭 评论区的神仙楼主': '≥ 五万',
            '💭 热门评论小达人': '≥ 二万',
            '💭 活跃小话痨': '≥ 五千',
            '💫 弹幕区的气氛组组长': '≥ 五万',
            '💫 弹幕小能手': '≥ 二万',
            '💫 弹幕小可爱': '≥ 五千',
            '🔥 B站千万级顶流UP主': '≥ 千万',
            '👑 B站百万人气UP主': '≥ 百万',
            '🏆 B站三连收割机': '≥ 三十万',
            '⭐ B站三连收割星': '≥ 十五万',
            '🌟 B站活跃UP主': '≥ 五万',
            '👍 B站优质小咕咕': '≥ 二万',
            '🌱 初来乍到的小萌新，加油哦~': '＜ 二万'
        };

        return titles.map(title => {
            const criteria = criteriaMap[title] || '';
            return `<div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${title}</span>
                        <span style="font-size: 10px; color: #999; margin-left: 10px;">${criteria}</span>
                    </div>`;
        }).join('');
    }

// 显示报告窗口
function showReport() {
    const stats = countAllLikes();
    const titles = getAccountTitles(stats);
    const accountDefinition = getAccountDefinition(stats);
    const userInfo = getUserInfo();

    // 根据账号评价数量计算需要减少的间距
    const titleCount = titles.length;
    let totalReduction = (titleCount - 1) * 20; // 每多一条减20px
    totalReduction = Math.max(0, totalReduction); // 确保不小于0

    // 分配减少的间距到各个元素
    const userInfoMargin = Math.max(40 - totalReduction * 0.3, 20); // 用户信息区域减少30%
    const totalLikesMargin = Math.max(15 - totalReduction * 0.3, 5); // 总赞数区域减少30%
    const titlesMargin = Math.max(15 - totalReduction * 0.4, 5); // 账号评价区域减少40%

    const reportWindow = document.createElement('div');
    reportWindow.id = 'bilibiliReportWindow';
    reportWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        width: 800px;
        height: 580px;
        background: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10003;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
        overflow: hidden;
        user-select: none;
        opacity: 0;
        transition: all 0.3s ease-out;
        max-width: 95vw;
        max-height: 90vh;
    `;

    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        background: #fb7299; /* 改为哔哩粉 */
        color: white;
        padding: 10px 20px;
        font-weight: bold;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
    `;
titleBar.innerHTML = `
    <span><i class="fa fa-connectdevelop" style="font-size: 24px; margin-right: 5px;"></i> B站数据报告面板(≧▽≦)</span>
    <div style="display: flex; align-items: center;">
        <button id="saveReportBtn" style="
            background: #23c16b;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            margin-right: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 14px;
        ">
                <span style="font-family: FontAwesome; margin-right: 5px;">&#xf1e0;</span>
                <span><strong>生成图片</strong>,晒出你的报告!<span style="font-size: 10px;">≧▽≦</span></span>
            </button>
            <span style="cursor: pointer; font-size: 18px;" id="closeReportWindow">×</span>
        </div>
    `;

    const content = document.createElement('div');
    content.style.cssText = `display: flex; height: calc(100% - 44px); position: relative;`;

    // 左侧面板 - 根据评价数量动态调整间距
    const leftPanel = document.createElement('div');
    leftPanel.style.cssText = `
        width: 35%;
        padding: 25px;
        background: white;
        border-right: 1px solid #eee;
        overflow: hidden;
    `;

    // 根据评价数量生成不同的HTML
    if (titleCount === 1) {
        leftPanel.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 40px;">
                <img src="${userInfo.avatarUrl}" style="width: 60px; height: 60px; border-radius: 3px; margin-right: 15px; border: 2px solid #eee;">
                <div>
                    <div style="font-size: 18px; font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${userInfo.nickname}</div>
                    <div style="font-size: 12px; color: #666;">B站数据统计报告</div>
                </div>
            </div>

            <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 1px; margin-bottom: 15px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">总获赞数</div>
                <div style="font-size: 32px; font-weight: bold; color: #fb7299; word-break: break-all;">${stats.total.toLocaleString()}</div>
                <div style="font-size: 12px; color: #999; margin-top: 3px;">${numberToChinese(stats.total)}</div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">账号评价</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 12px; font-size: 13px; color: #666; line-height: 1.4; max-height: 120px; overflow: hidden;">
                    ${getTitlesWithCriteria(titles)}
                </div>
            </div>

            <div>
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">账号定义</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 12px; font-size: 13px; color: #666; line-height: 1.4; max-height: 80px; overflow: hidden;">
                    ${accountDefinition}
                </div>
            </div>
        `;
    } else if (titleCount === 2) {
        leftPanel.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: ${userInfoMargin}px;">
                <img src="${userInfo.avatarUrl}" style="width: 60px; height: 60px; border-radius: 3px; margin-right: 15px; border: 2px solid #eee;">
                <div>
                    <div style="font-size: 18px; font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${userInfo.nickname}</div>
                    <div style="font-size: 12px; color: #666;">B站数据统计报告</div>
                </div>
            </div>

            <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 20px; margin-bottom: ${totalLikesMargin}px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">总获赞数</div>
                <div style="font-size: 32px; font-weight: bold; color: #fb7299; word-break: break-all;">${stats.total.toLocaleString()}</div>
                <div style="font-size: 12px; color: #999; margin-top: 3px;">${numberToChinese(stats.total)}</div>
            </div>

            <div style="margin-bottom: ${titlesMargin}px;">
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">账号评价</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 12px; font-size: 13px; color: #666; line-height: 1.4; max-height: 120px; overflow: hidden;">
                    ${getTitlesWithCriteria(titles)}
                </div>
            </div>

            <div>
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">账号定义</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 12px; font-size: 13px; color: #666; line-height: 1.4; max-height: 80px; overflow: hidden;">
                    ${accountDefinition}
                </div>
            </div>
        `;
    } else if (titleCount >= 3) {
        leftPanel.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: ${userInfoMargin}px;">
                <img src="${userInfo.avatarUrl}" style="width: 60px; height: 60px; border-radius: 3px; margin-right: 15px; border: 2px solid #eee;">
                <div>
                    <div style="font-size: 18px; font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${userInfo.nickname}</div>
                    <div style="font-size: 12px; color: #666;">B站数据统计报告</div>
                </div>
            </div>

            <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 15px; margin-bottom: ${totalLikesMargin}px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 6px;">总获赞数</div>
                <div style="font-size: 28px; font-weight: bold; color: #fb7299; word-break: break-all;">${stats.total.toLocaleString()}</div>
                <div style="font-size: 11px; color: #999; margin-top: 2px;">${numberToChinese(stats.total)}</div>
            </div>

            <div style="margin-bottom: ${titlesMargin}px;">
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 6px;">账号评价</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 10px; font-size: 13px; color: #666; line-height: 1.3; max-height: 120px; overflow: hidden;">
                    ${getTitlesWithCriteria(titles)}
                </div>
            </div>

            <div>
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 6px;">账号定义</div>
                <div style="background: #fff; border: 1px solid #eee; border-radius: 3px; padding: 10px; font-size: 13px; color: #666; line-height: 1.3; max-height: 80px; overflow: hidden;">
                    ${accountDefinition}
                </div>
            </div>
        `;
    }

    // 右侧面板
    const rightPanel = document.createElement('div');
    rightPanel.style.cssText = `
        width: 65%;
        padding: 0;
        background: #f9f9f9;
        overflow: hidden;
        position: relative;
    `;
    rightPanel.innerHTML = `
        <!-- 饼图和图例区域 -->
        <div style="display: flex; margin: 0; gap: 0; height: 180px;">
            <!-- 饼图容器 -->
            <div style="width: 45%; display: flex; justify-content: center; align-items: center; background: white; border: 1px solid #eee; border-radius: 3px;">
                <canvas id="likesChart" width="140" height="140"></canvas>
            </div>
            <!-- 图例容器 -->
            <div style="width: 55%; background: white; border: 1px solid #eee; border-radius: 3px; padding: 0;">
                <div style="font-size: 14px; font-weight: bold; color: #333; margin: 10px 30px 10px; display: inline-block;">数据分布</div>
                <div style="max-height: 140px; overflow-y: auto; margin: 0 30px;">
                    ${getChartLegend(stats)}
                </div>
            </div>
        </div>

        <!-- 数据卡片区域 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px;">
            <div style="background: white; border: 1px solid #eee; border-radius: 3px; padding: 15px; text-align: center;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">动态赞数</div>
                <div style="font-size: 24px; font-weight: bold; color: #fb7299; word-break: break-all;">${stats.dynamic.toLocaleString()}</div>
            </div>
            <div style="background: white; border: 1px solid #eee; border-radius: 3px; padding: 15px; text-align: center;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">视频赞数</div>
                <div style="font-size: 24px; font-weight: bold; color: #00a1d6; word-break: break-all;">${stats.video.toLocaleString()}</div>
            </div>
            <div style="background: white; border: 1px solid #eee; border-radius: 3px; padding: 15px; text-align: center;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">评论赞数</div>
                <div style="font-size: 24px; font-weight: bold; color: #ffb11b; word-break: break-all;">${stats.comment.toLocaleString()}</div>
            </div>
            <div style="background: white; border: 1px solid #eee; border-radius: 3px; padding: 15px; text-align: center;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">弹幕赞数</div>
                <div style="font-size: 24px; font-weight: bold; color: #23c16b; word-break: break-all;">${stats.danmaku.toLocaleString()}</div>
            </div>
        </div>
    `;

    // 2233furry装饰图片代码（小小电子xxdz原创图）
    const leftDecoration = document.createElement('img');
    leftDecoration.src = 'https://article.biliimg.com/bfs/new_dyn/d891217bd49f98439509f21a194bf1c33461569935575626.png';
    leftDecoration.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 151.5px;
        height: 114.5px;
        object-fit: contain;
        pointer-events: none;
        z-index: 1;
    `;

    const rightDecoration = document.createElement('img');
    rightDecoration.src = 'https://article.biliimg.com/bfs/new_dyn/74cbb37888b507d1235eb12fbf3b7ff23461569935575626.png';
    rightDecoration.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 134.5px;
        height: 101.5px;
        object-fit: contain;
        pointer-events: none;
        z-index: 1;
    `;

    const horizontalDecoration = document.createElement('img');
    horizontalDecoration.src = 'https://article.biliimg.com/bfs/new_dyn/84078b8229ee4d864179bce54262da3c3461569935575626.png';
    horizontalDecoration.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: auto;
        object-fit: cover;
        pointer-events: none;
        z-index: 0;
        opacity: 0.6;
    `;

    // 作者小小电子xxdzの信息 - 放在最上层
    const authorInfo = document.createElement('div');
    authorInfo.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 2;
        pointer-events: none;
    `;
authorInfo.innerHTML = `
    <div style="color: white; font-size: 10px; text-shadow: 0 0 3px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.6); font-weight: 300; opacity: 0.7;">
        插件作者·小小电子xxdz
    </div>
`;

    content.appendChild(leftPanel);
    content.appendChild(rightPanel);
    content.appendChild(horizontalDecoration);
    content.appendChild(leftDecoration);
    content.appendChild(rightDecoration);
    content.appendChild(authorInfo); // 最后添加xxdz，确保在最上层

    reportWindow.appendChild(titleBar);
    reportWindow.appendChild(content);
    document.body.appendChild(reportWindow);

    makeDraggable(reportWindow, titleBar);
    setupWindowFocus(reportWindow);
    bringToFront(reportWindow);

    setTimeout(() => {
        reportWindow.style.opacity = '1';
        reportWindow.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    document.getElementById('closeReportWindow').addEventListener('click', () => {
        closeWindowWithAnimation(reportWindow);
        if (isGeneratingReport) {
            isGeneratingReport = false;
            if (performanceMode) {
                blockAllExistingImages();
                startImageBlockingObserver();
            }
        }
    });
    document.getElementById('saveReportBtn').addEventListener('click', () => saveReportAsImage(reportWindow, stats, userInfo, titles, accountDefinition));
    drawPieChart(stats, reportWindow);
}
// 保存报告为图片 - 核心修复：解决性能模式依赖和图例错位问题
function saveReportAsImage(reportWindow, stats, userInfo, titles, accountDefinition) {
    const saveBtn = document.getElementById('saveReportBtn');
    const originalContent = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span>⏳</span><span style="margin-left: 5px;">生成中</span>';
    saveBtn.disabled = true;

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7);
        z-index: 10004;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 16px;
    `;
    modal.textContent = '正在生成图片...';
    document.body.appendChild(modal);

    // 关键修复：设置生成状态
    isGeneratingReport = true;
    const wasPerformanceMode = performanceMode;
    let originalImageFunc = null;
    let originalAddEventListenerFunc = null;

    // 临时禁用性能模式的图片拦截（无论是否开启过性能模式都能处理）
    if (performanceMode) {
        // 保存原始函数引用
        originalImageFunc = window.originalImage || window.Image;
        originalAddEventListenerFunc = window.originalAddEventListener || EventTarget.prototype.addEventListener;

        // 恢复原始函数
        window.Image = originalImageFunc;
        EventTarget.prototype.addEventListener = originalAddEventListenerFunc;

        stopImageBlockingObserver();
    }

    // 定义安全的图片加载函数，确保不受性能模式影响
    function loadImageForCanvas(url) {
        return new Promise((resolve, reject) => {
            // 关键修复：使用原生Image构造函数，确保能正常加载图片
            const img = originalImageFunc ? new originalImageFunc() : new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = (e) => {
                console.error('图片加载失败:', e);
                // 尝试使用默认头像
                const defaultImg = new Image();
                defaultImg.onload = () => resolve(defaultImg);
                defaultImg.src = 'https://i0.hdslb.com/bfs/face/member/noface.jpg';
            };
            img.src = url;
        });
    }

    // 先加载所有需要的图片再绘图
    Promise.all([
        loadImageForCanvas(userInfo.avatarUrl),
        loadImageForCanvas('https://article.biliimg.com/bfs/new_dyn/d891217bd49f98439509f21a194bf1c33461569935575626.png'),
        loadImageForCanvas('https://article.biliimg.com/bfs/new_dyn/74cbb37888b507d1235eb12fbf3b7ff23461569935575626.png'),
        loadImageForCanvas('https://article.biliimg.com/bfs/new_dyn/84078b8229ee4d864179bce54262da3c3461569935575626.png')
    ]).then(([avatarImg, leftDecorationImg, rightDecorationImg, horizontalDecorationImg]) => {
        try {
            const width = 800, height = 580;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width * 2;
            canvas.height = height * 2;
            ctx.scale(2, 2);
            ctx.fillStyle = '#f9f9f9';
            ctx.fillRect(0, 0, width, height);

// 1. 标题栏 - 改为哔哩粉
ctx.fillStyle = '#fb7299'; // 哔哩粉
ctx.fillRect(0, 0, width, 44);
ctx.fillStyle = 'white';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'left';

// 绘制Font Awesome图标（使用Unicode字符）
ctx.font = '24px FontAwesome';
ctx.fillText('\uf20e', 20, 28); // fa-connectdevelop 的Unicode

// 绘制文字
ctx.font = 'bold 16px Arial';
ctx.fillText(' B站数据报告面板(≧▽≦)', 48, 28);
            // 2. 左侧面板
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 44, width * 0.35, height - 44);
            ctx.fillStyle = '#eee';
            ctx.fillRect(width * 0.35, 44, 1, height - 44);

            // 3. 用户信息 - 使用预加载的头像图片
            ctx.save();
            ctx.beginPath();
            ctx.rect(20, 64, 60, 60);
            ctx.clip();
            ctx.drawImage(avatarImg, 20, 64, 60, 60);
            ctx.restore();
            ctx.fillStyle = '#333';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(truncateText(userInfo.nickname, 12), 95, 90);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText('B站数据统计报告', 95, 110);

            // 4. 总赞数卡片
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 1;
            ctx.strokeRect(20, 140, width * 0.35 - 40, 100);
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.fillText('总获赞数', 35, 165);
            ctx.fillStyle = '#fb7299';
            ctx.font = 'bold 32px Arial';
            ctx.fillText(formatLargeNumber(stats.total), 35, 200);
            ctx.fillStyle = '#999';
            ctx.font = '12px Arial';
            ctx.fillText(numberToChinese(stats.total), 35, 220);

            // 5. 账号评价 - 修改为带评分标准的显示
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('账号评价', 20, 260);
            ctx.strokeRect(20, 275, width * 0.35 - 40, 120);
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial'; // 从13px改为12px
            let yPos = 295;

            // 定义评分标准映射
            const criteriaMap = {
                '✨ 动态区的小太阳': '≥ 三万',
                '✨ 动态创作达人': '≥ 一万',
                '✨ 动态小能手': '≥ 三千',
                '🎬 视频区的大佬喵': '≥ 十万',
                '🎬 优质视频阿婆主': '≥ 五万',
                '🎬 视频创作小阿婆': '≥ 一万',
                '💭 评论区的神仙楼主': '≥ 五万',
                '💭 热门评论小达人': '≥ 二万',
                '💭 活跃小话痨': '≥ 五千',
                '💫 弹幕区的气氛组组长': '≥ 五万',
                '💫 弹幕小能手': '≥ 二万',
                '💫 弹幕小可爱': '≥ 五千',
                '🔥 B站千万级顶流UP主': '≥ 千万',
                '👑 B站百万人气UP主': '≥ 百万',
                '🏆 B站三连收割机': '≥ 三十万',
                '⭐ B站三连收割星': '≥ 十五万',
                '🌟 B站活跃UP主': '≥ 五万',
                '👍 B站优质小咕咕': '≥ 二万',
                '🌱 初来乍到的小萌新，加油哦~': '＜ 二万'
            };

            titles.forEach(title => {
                if (yPos < 275 + 110) {
                    const criteria = criteriaMap[title] || '';
                    // 绘制称号
                    ctx.fillText(title, 35, yPos);
                    // 绘制评分标准（靠右对齐）
                    ctx.fillStyle = '#999';
                    ctx.font = '9px Arial'; // 从10px改为9px
                    ctx.textAlign = 'right';
                    ctx.fillText(criteria, width * 0.35 - 45, yPos);
                    // 恢复设置
                    ctx.fillStyle = '#666';
                    ctx.font = '12px Arial'; // 从13px改为12px
                    ctx.textAlign = 'left';
                    yPos += 20;
                }
            });

            // 6. 账号定义
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('账号定义', 20, 415);
            ctx.strokeRect(20, 430, width * 0.35 - 40, 80);
            ctx.fillStyle = '#666';
            ctx.font = '13px Arial';
            wrapText(ctx, accountDefinition, 35, 450, width * 0.35 - 80, 18);

            // 7. 饼图 - 保持原有位置和尺寸不变
            drawPieChartToCanvas(ctx, width * 0.35 + 115, 44 + 110, 70, stats);

            // 8. 图例 - 核心修复：调整保存图片时的图例位置，解决第一行错位
            const colors = ['#fb7299', '#00a1d6', '#ffb11b', '#23c16b'];
            const labels = ['动态', '视频', '评论', '弹幕'];
            const values = [stats.dynamic, stats.video, stats.comment, stats.danmaku];
            let legendY = 65;
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('数据分布', width * 0.35 + 210, legendY);
            legendY += 25;
            values.forEach((value, index) => {
                if (value > 0 && legendY < 65 + 180) {
                    const percentage = ((value / stats.total) * 100).toFixed(1);
                    ctx.fillStyle = colors[index];
                    ctx.fillRect(width * 0.35 + 210, legendY - 8, 14, 14);
                    ctx.fillStyle = '#333';
                    ctx.font = '13px Arial';
                    // 关键修复：为第一行图例增加13px的左边距，解决错位
                    const labelX = width * 0.35 + 240 + (index === 0 ? 13 : 0);
                    ctx.fillText(labels[index], labelX, legendY);
                    ctx.fillStyle = '#666';
                    ctx.font = '13px Arial';
                    ctx.textAlign = 'right';
                    ctx.fillText(`${formatLargeNumber(value)} (${percentage}%)`, width - 40, legendY);
                    ctx.textAlign = 'left';
                    legendY += 20;
                }
            });

            // 9. 数据卡片 - 保持原有位置和样式
            const cardWidth = (width * 0.65 - 50) / 2;
            const cardY = 44 + 240;
            values.forEach((value, index) => {
                const x = width * 0.35 + 20 + (index % 2) * (cardWidth + 15);
                const y = cardY + Math.floor(index / 2) * 100;
                ctx.strokeRect(x, y, cardWidth, 90);
                ctx.fillStyle = '#666';
                ctx.font = '14px Arial';
                ctx.fillText(labels[index] + '赞数', x + 15, y + 30);
                ctx.fillStyle = colors[index];
                ctx.font = 'bold 22px Arial';
                ctx.fillText(formatLargeNumber(value), x + 15, y + 60);
            });

            // 10. 绘制装饰图片 - 调整图层顺序
            // 先绘制横向素材图片（底层）
            ctx.globalAlpha = 0.6;
            ctx.drawImage(horizontalDecorationImg, 0, height - 100, width, 100);
            ctx.globalAlpha = 1;

            // 再绘制左右装饰图片（上层）
            const leftDecorationWidth = 151.5;
            const leftDecorationHeight = 114.5;
            ctx.drawImage(leftDecorationImg, 0, height - leftDecorationHeight, leftDecorationWidth, leftDecorationHeight);

            const rightDecorationWidth = 134.5;
            const rightDecorationHeight = 101.5;
            ctx.drawImage(rightDecorationImg, width - rightDecorationWidth, height - rightDecorationHeight, rightDecorationWidth, rightDecorationHeight);

            // 11. 作者信息 - 改为白色并居中
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('B站赞数统计器·小小电子xxdz制作', width / 2, height - 10);

            // 下载
            canvas.toBlob(blob => {
                try {
                    const link = document.createElement('a');
                    const date = new Date().toLocaleDateString().replace(/\//g, '-');
                    link.download = `B站数据报告_${userInfo.nickname}_${date}.png`;
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                } catch (e) {
                    console.error('保存失败:', e);
                    alert('保存图片失败，请重试');
                } finally {
                    // 恢复状态
                    isGeneratingReport = false;
                    if (wasPerformanceMode) {
                        // 恢复性能模式设置
                        window.Image = window.originalImage || Image;
                        EventTarget.prototype.addEventListener = window.originalAddEventListener || EventTarget.prototype.addEventListener;
                        blockAllExistingImages();
                        startImageBlockingObserver();
                    }
                    saveBtn.innerHTML = originalContent;
                    saveBtn.disabled = false;
                    document.body.removeChild(modal);
                }
            }, 'image/png');
        } catch (e) {
            console.error('生成失败:', e);
            alert('生成图片失败，请重试');
            // 恢复状态
            isGeneratingReport = false;
            if (wasPerformanceMode) {
                // 恢复性能模式设置
                window.Image = window.originalImage || Image;
                EventTarget.prototype.addEventListener = window.originalAddEventListener || EventTarget.prototype.addEventListener;
                blockAllExistingImages();
                startImageBlockingObserver();
            }
            saveBtn.innerHTML = originalContent;
            saveBtn.disabled = false;
            document.body.removeChild(modal);
        }
    });
}
    // 截断文本
    function truncateText(text, maxLength) {
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    }

    // 格式化大数字
    function formatLargeNumber(num) {
        return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toLocaleString();
    }

    // 绘制饼图到Canvas
    function drawPieChartToCanvas(ctx, centerX, centerY, radius, stats) {
        const data = [
            { value: stats.dynamic, color: '#fb7299', label: '动态' },
            { value: stats.video, color: '#00a1d6', label: '视频' },
            { value: stats.comment, color: '#ffb11b', label: '评论' },
            { value: stats.danmaku, color: '#23c16b', label: '弹幕' }
        ].filter(item => item.value > 0);
        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return;
        let startAngle = 0;
        data.forEach(item => {
            const sliceAngle = (2 * Math.PI * item.value) / total;
            const endAngle = startAngle + sliceAngle;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            startAngle = endAngle;
        });
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.fillStyle = '#fb7299';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('总赞数', centerX, centerY - 8);
        ctx.font = 'bold 12px Arial';
        ctx.fillText(formatLargeNumber(stats.total), centerX, centerY + 8);
    }

    // 文本换行
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else line = testLine;
        }
        ctx.fillText(line, x, y);
    }

    // 账号定义
    function getAccountDefinition(stats) {
        const total = stats.total;
        if (total === 0) return '🌱 刚刚起步的B站萌新';
        const percentages = {
            dynamic: (stats.dynamic / total) * 100,
            video: (stats.video / total) * 100,
            comment: (stats.comment / total) * 100,
            danmaku: (stats.danmaku / total) * 100
        };
        let maxType = '', maxPercentage = 0;
        for (const [type, p] of Object.entries(percentages)) {
            if (p > maxPercentage) {
                maxPercentage = p;
                maxType = type;
            }
        }
const definitions = {
    dynamic: '💫 动态区的活跃小能手～',
    video: '🎬 努力产粮的咕咕咕',
    comment: '💭 评论区的话痨小天使',
    danmaku: '✨ 弹幕区的气氛组担当'
};
let definition = definitions[maxType] || '🌟 全面发展的B站小可爱';
if (maxPercentage >= 60) {
    const precise = {
        dynamic: '💫 动态区的超活跃小太阳',
        video: '🎬 超用心的视频UP主',
        comment: '💭 评论区的神仙小话痨',
        danmaku: '✨ 弹幕区的超活跃小能手'
    };
    definition = precise[maxType] || definition;
}
const isBalanced = Object.values(percentages).every(p => p < 40) &&
                  Math.max(...Object.values(percentages)) - Math.min(...Object.values(percentages)) < 30;
if (isBalanced) definition = '🎯 样样通的B站六边形战士';
return definition;
    }

// 账号称号
function getAccountTitles(stats) {
    const titles = [];

    // 动态相关称号
    if (stats.dynamic >= 30000) titles.push('✨ 动态区的小太阳'); // 如果动态赞数大于等于3万，则被评为✨ 动态区的小太阳
    else if (stats.dynamic >= 10000) titles.push('✨ 动态创作达人'); // 如果动态赞数大于等于1万，则被评为✨ 动态创作达人
    else if (stats.dynamic >= 3000) titles.push('✨ 动态小能手'); // 如果动态赞数大于等于3千，则被评为✨ 动态小能手

    // 视频相关称号
    if (stats.video >= 100000) titles.push('🎬 视频区的大佬喵'); // 如果视频赞数大于等于10万，则被评为🎬 视频区的大佬喵
    else if (stats.video >= 50000) titles.push('🎬 优质视频阿婆主'); // 如果视频赞数大于等于5万，则被评为🎬 优质视频制作家
    else if (stats.video >= 10000) titles.push('🎬 视频创作小阿婆'); // 如果视频赞数大于等于1万，则被评为🎬 视频创作小能手

    // 评论相关称号
    if (stats.comment >= 50000) titles.push('💭 评论区的神仙楼主'); // 如果评论赞数大于等于5万，则被评为💭 评论区的神仙楼主
    else if (stats.comment >= 20000) titles.push('💭 热门评论小达人'); // 如果评论赞数大于等于2万，则被评为💭 热门评论小达人
    else if (stats.comment >= 5000) titles.push('💭 活跃小话痨'); // 如果评论赞数大于等于5千，则被评为💭 活跃小话痨

    // 弹幕相关称号
    if (stats.danmaku >= 50000) titles.push('💫 弹幕区的气氛组组长'); // 如果弹幕赞数大于等于5万，则被评为💫 弹幕区的气氛组组长
    else if (stats.danmaku >= 20000) titles.push('💫 弹幕小能手'); // 如果弹幕赞数大于等于2万，则被评为💫 弹幕小能手
    else if (stats.danmaku >= 5000) titles.push('💫 弹幕小可爱'); // 如果弹幕赞数大于等于5千，则被评为💫 弹幕小可爱

// 总赞数相关称号
if (stats.total >= 10000000) titles.push('🔥 B站千万级顶流UP主'); // 如果总赞数大于等于1000万，则被评为🔥 B站千万级顶流UP主
else if (stats.total >= 1000000) titles.push('👑 B站百万人气UP主'); // 如果总赞数大于等于100万，则被评为👑 B站百万人气UP主
else if (stats.total >= 300000) titles.push('🏆 B站三连收割机'); // 如果总赞数大于等于30万，则被评为🏆 B站三连收割机
else if (stats.total >= 150000) titles.push('⭐ B站三连收割星'); // 如果总赞数大于等于15万，则被评为⭐ B站三连收割星
else if (stats.total >= 50000) titles.push('🌟 B站活跃UP主'); // 如果总赞数大于等于5万，则被评为🌟 B站活跃UP主
else if (stats.total >= 20000) titles.push('👍 B站优质小咕咕'); // 如果总赞数大于等于2万，则被评为👍 B站优质小咕咕

    // 默认称号
    if (titles.length === 0) titles.push('🌱 初来乍到的小萌新，加油哦~'); // 如果没有达到任何称号标准，则被评为🌱 初来乍到的小萌新

    return titles;
}
    // 图表图例
    function getChartLegend(stats) {
        const colors = ['#fb7299', '#00a1d6', '#ffb11b', '#23c16b'];
        const labels = ['动态', '视频', '评论', '弹幕'];
        const values = [stats.dynamic, stats.video, stats.comment, stats.danmaku];
        let legendHTML = '';
        labels.forEach((label, index) => {
            if (values[index] > 0) {
                const percentage = ((values[index] / stats.total) * 100).toFixed(1);
                legendHTML += `
                    <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 0 5px;">
                        <div style="width: 14px; height: 14px; background: ${colors[index]}; border-radius: 2px; margin-right: 15px; flex-shrink: 0;"></div>
                        <div style="font-size: 13px; color: #333; width: 60px; flex-shrink: 0;">${label}</div>
                        <div style="font-size: 13px; font-weight: bold; color: #666; flex: 1; text-align: right; margin-left: 10px;">${formatLargeNumber(values[index])} (${percentage}%)</div>
                    </div>
                `;
            }
        });
        return legendHTML;
    }

// 绘制饼图 - 放大版本
function drawPieChart(stats, reportWindow) {
    const canvas = document.getElementById('likesChart');
    const ctx = canvas.getContext('2d');

    // 放大canvas尺寸
    canvas.width = 180;
    canvas.height = 180;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10; // 增大半径

    const data = [
        { value: stats.dynamic, color: '#fb7299', label: '动态' },
        { value: stats.video, color: '#00a1d6', label: '视频' },
        { value: stats.comment, color: '#ffb11b', label: '评论' },
        { value: stats.danmaku, color: '#23c16b', label: '弹幕' }
    ].filter(item => item.value > 0);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    let hoveredIndex = -1;
    let animationId = null;
    let animationProgress = 0;
    const animationDuration = 300;

// 绘制饼图函数
function drawPie() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = 0;

    data.forEach((item, index) => {
        const sliceAngle = (2 * Math.PI * item.value) / total;
        const endAngle = startAngle + sliceAngle;

        // 计算当前扇形的半径（悬停效果）
        let currentRadius = radius;
        if (hoveredIndex === index) {
            const progress = Math.min(animationProgress / animationDuration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentRadius = radius + 7 * easeOut; // 从12减小到7
        }

        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, currentRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        // 绘制扇形边框
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        startAngle = endAngle;
    });

    // 绘制中心圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // 绘制中心文字
    ctx.fillStyle = '#fb7299';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('总赞数', centerX, centerY - 8);
    ctx.font = 'bold 12px Arial';
    ctx.fillText(formatLargeNumber(stats.total), centerX, centerY + 8);
}

    // 动画循环
    function animate() {
        animationProgress += 16; // 约60fps
        drawPie();

        if (animationProgress < animationDuration) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationProgress = animationDuration;
            animationId = null;
        }
    }

    // 初始绘制
    drawPie();

    // 鼠标交互
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 计算鼠标位置相对于圆心的角度
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
            // 计算角度（0到2π）
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;

            // 找到对应的扇形
            let currentAngle = 0;
            let newHoveredIndex = -1;

            data.forEach((item, index) => {
                const sliceAngle = (2 * Math.PI * item.value) / total;
                if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
                    newHoveredIndex = index;
                }
                currentAngle += sliceAngle;
            });

            // 如果悬停的扇形发生变化，启动动画
            if (newHoveredIndex !== hoveredIndex) {
                hoveredIndex = newHoveredIndex;
                animationProgress = 0;

                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                animationId = requestAnimationFrame(animate);

                // 显示提示
                if (hoveredIndex !== -1) {
                    showChartTooltip(e, data[hoveredIndex]);
                } else {
                    hideChartTooltip();
                }
            } else if (hoveredIndex !== -1) {
                showChartTooltip(e, data[hoveredIndex]);
            }
        } else {
            if (hoveredIndex !== -1) {
                hoveredIndex = -1;
                animationProgress = 0;

                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                animationId = requestAnimationFrame(animate);
                hideChartTooltip();
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (hoveredIndex !== -1) {
            hoveredIndex = -1;
            animationProgress = 0;

            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            animationId = requestAnimationFrame(animate);
            hideChartTooltip();
        }
    });

    // 点击事件（可选）
    canvas.addEventListener('click', (e) => {
        if (hoveredIndex !== -1) {
            const item = data[hoveredIndex];
            console.log(`点击了${item.label}: ${item.value}赞 (${((item.value / total) * 100).toFixed(1)}%)`);
        }
    });
}

// 图表提示工具函数
function showChartTooltip(event, slice) {
    let tooltip = document.getElementById('chartTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'chartTooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10005;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(4px);
            transition: opacity 0.2s;
        `;
        document.body.appendChild(tooltip);
    }

    const percentage = ((slice.value / countAllLikes().total) * 100).toFixed(1);
    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 2px;">${slice.label}</div>
        <div style="font-size: 11px; opacity: 0.9;">
            有 ${formatLargeNumber(slice.value)} 个赞啦，也就是占${percentage}%~
        </div>
    `;

    // 定位提示框
    const x = event.clientX + 15;
    const y = event.clientY + 15;

    // 确保提示框不会超出屏幕
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    if (x + tooltipRect.width > windowWidth - 10) {
        finalX = event.clientX - tooltipRect.width - 15;
    }
    if (y + tooltipRect.height > windowHeight - 10) {
        finalY = event.clientY - tooltipRect.height - 15;
    }

    tooltip.style.left = finalX + 'px';
    tooltip.style.top = finalY + 'px';
    tooltip.style.opacity = '1';
}

function hideChartTooltip() {
    const tooltip = document.getElementById('chartTooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}
// 检查新数据
function checkForNewItems() {
    const currentCount = document.querySelectorAll('.interaction-item').length;
    if (currentCount > lastItemCount) {
        lastItemCount = currentCount;
        if (noNewItemsTimer) clearTimeout(noNewItemsTimer);
        if (realTimeStats) updateDisplay(countAllLikes());
        updateScrollStatus(`加载中... 当前项目数: ${currentCount}`);

        // 只有在自动滚动过程中才重新设置6秒完成检测
        if (isScrolling) {
            noNewItemsTimer = setTimeout(() => {
                stopAutoScroll();
                showCompletionMessage(currentCount);
            }, 6000);
        }
        return true;
    }
    return false;
}
            // 自动滚动
function startAutoScroll() {
    if (isScrolling) {
        stopAutoScroll();
        return;
    }
    const loveList = document.querySelector('.love-list');
    if (!loveList) {
        updateScrollStatus('未找到点赞列表嗷');
        return;
    }
    isScrolling = true;
    lastItemCount = document.querySelectorAll('.interaction-item').length;
    updateScrollStatus(`开始自动滚动... 速度: ${scrollSpeed}ms, 当前项目数: ${lastItemCount}`);
document.getElementById('autoScrollBtn').textContent = '停止滚动';
document.getElementById('autoScrollBtn').style.background = '#ff6b6b';
document.getElementById('autoScrollBtn').style.backgroundImage = 'linear-gradient(90deg, #ff3742 0%, #ff4757 30%, #ff6b6b 70%, #ff6b6b 100%)';
document.getElementById('autoScrollBtn').style.backgroundSize = '300% 100%';
document.getElementById('autoScrollBtn').style.animation = 'scrollProgress 3s ease-in-out infinite';

    // 只有在自动滚动过程中才设置6秒完成检测
    noNewItemsTimer = setTimeout(() => {
        if (isScrolling) { // 确保只有在仍在滚动时才执行完成
            stopAutoScroll();
            showCompletionMessage(lastItemCount);
        }
    }, 6000);

    scrollInterval = setInterval(() => {
        if (!isScrolling) return;
        scrollAttempts++;
        updateScrollStatus(`滚动中... 尝试: ${scrollAttempts}, 项目: ${lastItemCount}, 速度: ${scrollSpeed}ms`);
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) {
            updateScrollStatus('未找到滚动容器！嗷');
            stopAutoScroll();
            return;
        }
        scrollToBottomFast(scrollContainer);
        setTimeout(checkForNewItems, 500);
    }, scrollSpeed);
}

            // 获取滚动容器
            function getScrollContainer() {
                const containers = [
                    document.querySelector('.message-content__wrapper'),
                    document.querySelector('.love-list')?.parentElement,
                    document.querySelector('.m-infinite-scroll'),
                    document.documentElement
                ];
                for (let container of containers) {
                    if (container) return container;
                }
                return document.documentElement;
            }

            // 快速滚动到底部
            function scrollToBottomFast(container) {
                container.scrollTop = container.scrollHeight - container.clientHeight;
            }

// 停止自动滚动
function stopAutoScroll() {
    if (scrollInterval) clearInterval(scrollInterval);
    if (noNewItemsTimer) clearTimeout(noNewItemsTimer);
    isScrolling = false;
document.getElementById('autoScrollBtn').textContent = '继续自动滚动加载';
document.getElementById('autoScrollBtn').style.background = '#ff6b6b';
document.getElementById('autoScrollBtn').style.backgroundImage = 'none';
document.getElementById('autoScrollBtn').style.animation = 'none';

    // 清除6秒无新元素的定时器，避免了用户手动停止后还傻执行完成检测
    if (noNewItemsTimer) {
        clearTimeout(noNewItemsTimer);
        noNewItemsTimer = null;
    }
}

            // 更新滚动状态
            function updateScrollStatus(message) {
                const elem = document.getElementById('scrollStatus');
                if (elem) elem.textContent = message;
            }

            // 解析点赞数
            function parseLikeCount(text) {
                const match = text.match(/总计?(\d+)人赞/);
                return match ? parseInt(match[1]) : (text.includes('赞了我的') ? 1 : 0);
            }

            // 统计所有点赞
            function countAllLikes() {
                const items = document.querySelectorAll('.interaction-item');
                let total = 0, dynamic = 0, video = 0, comment = 0, danmaku = 0;
                items.forEach(item => {
                    const action = item.querySelector('.interaction-item__action');
                    if (action) {
                        const text = action.textContent.trim();
                        const count = parseLikeCount(text);
                        total += count;
                        if (text.includes('动态')) dynamic += count;
                        else if (text.includes('视频')) video += count;
                        else if (text.includes('评论')) comment += count;
                        else if (text.includes('弹幕')) danmaku += count;
                    }
                });
                return { total, dynamic, video, comment, danmaku };
            }

            // 更新显示
            function updateDisplay(stats) {
                document.getElementById('totalLikesCount').textContent = stats.total.toLocaleString();
                document.getElementById('dynamicLikes').textContent = stats.dynamic.toLocaleString();
                document.getElementById('videoLikes').textContent = stats.video.toLocaleString();
                document.getElementById('commentLikes').textContent = stats.comment.toLocaleString();
                document.getElementById('danmakuLikes').textContent = stats.danmaku.toLocaleString();
                updateChineseNumber(stats.total);
            }

            // 初始化
function init() {
    // 创建打开脚本的小按钮
    createOpenScriptButton();

    console.log('脚本初始化完成，小按钮也已显示');
}

// 切换到"收到的赞"页面的函数
function switchToLovePage() {
    // 使用XPath选择器定位"收到的赞"菜单项
    const xpathResult = document.evaluate(
        '/html/body/div[1]/div[3]/aside/div/ul[1]/li[4]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const loveSidebarItem = xpathResult.singleNodeValue;

    if (loveSidebarItem) {
        loveSidebarItem.click();
        const status = document.getElementById('status');
        if (status) {
            status.textContent = '正在切换到"收到的赞"页面捏...';
            status.style.color = '#1890ff';
        }

        // 等待页面切换后检查是否成功
        setTimeout(() => {
            if (document.querySelector('.love-list')) {
                if (status) {
                    status.textContent = '已切换到"收到的赞"页面辣，请重新点击统计按钮';
                    status.style.color = '#52c41a';
                }
            } else {
                // 如果XPath选择器不行，那就尝试备用选择器
                tryBackupSelectors();
            }
        }, 1500);
    } else {
        // 如果XPath选择器找不到，尝试备用选择器（应该不会吧，XPath可是最准的了）
        tryBackupSelectors();
    }
}

// 备用选择器函数
function tryBackupSelectors() {
    const status = document.getElementById('status');

    // 备用选择器1: 通过文本内容查找
    const sidebarItems = document.querySelectorAll('.message-sidebar__item');
    let foundItem = null;

    for (let item of sidebarItems) {
        const itemName = item.querySelector('.message-sidebar__item-name');
        if (itemName && itemName.textContent.includes('收到的赞')) {
            foundItem = item;
            break;
        }
    }

    if (foundItem) {
        foundItem.click();
        if (status) {
            status.textContent = '正在切换到"收到的赞"页面...';
            status.style.color = '#1890ff';
        }

        setTimeout(() => {
            if (document.querySelector('.love-list')) {
                if (status) {
                    status.textContent = '已切换到"收到的赞"页面辣，请重新点击统计按钮';
                    status.style.color = '#52c41a';
                }
            } else {
                if (status) {
                    status.textContent = '切换失败嘤，请手动点击左侧"收到的赞"菜单';
                    status.style.color = '#ff6b6b';
                }
            }
        }, 1500);
} else {
    if (status) {
        status.textContent = '额未找到"收到的赞"菜单项，请手动点击';
        status.style.color = '#ff6b6b';
    }
}
}

// 显示切换提示的函数
function showSwitchToLovePagePrompt() {
    const status = document.getElementById('status');
    if (status) {
        status.innerHTML = `
            <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 5px;">
                当前不在"收到的赞"网页
            </div>
            <button id="switchToLovePage" style="
                background: #00a1d6;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            ">点击切换!</button>
        `;

        document.getElementById('switchToLovePage').addEventListener('click', switchToLovePage);
    }
}

// 确保一定会创建小按钮
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 添加按钮点击事件监听
document.addEventListener('click', function(e) {
    if (e.target.id === 'countLikesBtn') {
        if (!document.querySelector('.love-list')) {
            showSwitchToLovePagePrompt();
            return;
        }
        const status = document.getElementById('status');
        if (status) {
            status.textContent = '正在统计中...';
            status.style.color = '#1890ff';
        }
        setTimeout(() => {
            const stats = countAllLikes();
            updateDisplay(stats);
            const count = document.querySelectorAll('.interaction-item').length;
            showCompletionMessage(count);
            if (status) {
                status.textContent = `统计完成！共找到 ${count} 条点赞记录`;
                status.style.color = '#52c41a';
            }
        }, 100);
    } else if (e.target.id === 'autoScrollBtn') {
        if (!document.querySelector('.love-list')) {
            showSwitchToLovePagePrompt();
            return;
        }
        startAutoScroll();
    }
});
})();
