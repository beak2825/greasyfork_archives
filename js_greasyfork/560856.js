// ==UserScript==
// @name         B站合集播放顺序切换(切换正向播放还是倒向播放)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  完美嵌入合集头部，支持正/倒序自动跳转
// @author       Gemini动手我动脑
// @match        *://www.bilibili.com/video/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560856/B%E7%AB%99%E5%90%88%E9%9B%86%E6%92%AD%E6%94%BE%E9%A1%BA%E5%BA%8F%E5%88%87%E6%8D%A2%28%E5%88%87%E6%8D%A2%E6%AD%A3%E5%90%91%E6%92%AD%E6%94%BE%E8%BF%98%E6%98%AF%E5%80%92%E5%90%91%E6%92%AD%E6%94%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560856/B%E7%AB%99%E5%90%88%E9%9B%86%E6%92%AD%E6%94%BE%E9%A1%BA%E5%BA%8F%E5%88%87%E6%8D%A2%28%E5%88%87%E6%8D%A2%E6%AD%A3%E5%90%91%E6%92%AD%E6%94%BE%E8%BF%98%E6%98%AF%E5%80%92%E5%90%91%E6%92%AD%E6%94%BE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isReverse = false;

    // 1. 嵌入按钮逻辑
    function injectUI() {
        if (document.getElementById('bili-order-btn')) return;

        // 目标位置：自动连播开关左侧
        const targetContainer = document.querySelector('.header-top .right');
        if (!targetContainer) return;

        const btn = document.createElement('div');
        btn.id = 'bili-order-btn';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.marginRight = '12px';
        btn.style.cursor = 'pointer';
        btn.style.userSelect = 'none';

        btn.innerHTML = `
            <span class="order-txt" style="color: #00aeec; font-size: 13px; font-weight: bold;">
                播放顺序：正序
            </span>
        `;

        btn.onclick = (e) => {
            e.stopPropagation();
            isReverse = !isReverse;
            const txt = btn.querySelector('.order-txt');
            txt.innerText = isReverse ? '播放顺序：倒序' : '播放顺序：正序';
            txt.style.color = isReverse ? '#fb7299' : '#00aeec';
            console.log('[脚本] 切换模式为:', isReverse ? '倒序' : '正序');
        };

        targetContainer.prepend(btn);
    }

    // 2. 执行跳转逻辑
    function handleVideoEnd() {
        if (!isReverse) return;

        console.log('[脚本] 视频结束，准备倒序跳转...');

        // 查找当前播放项的容器 (根据你提供的 class)
        const activeItem = document.querySelector('.video-pod__item .active')?.closest('.video-pod__item');

        if (activeItem) {
            const prevItem = activeItem.previousElementSibling;
            if (prevItem) {
                // 查找点击目标：可以是整个 item 或者是里面的 title
                const clickTarget = prevItem.querySelector('.title') || prevItem;
                console.log('[脚本] 找到上一集，执行点击跳转');
                clickTarget.click();
            } else {
                console.warn('[脚本] 已经是第一集了');
            }
        } else {
            console.error('[脚本] 找不到当前活跃的视频节点');
        }
    }

    // 3. 持续监听视频状态
    // 使用全局定时检查，防止 B站播放器内部逻辑覆盖掉 onended 事件
    setInterval(() => {
        // 自动注入UI
        injectUI();

        // 获取视频对象
        const video = document.querySelector('video');
        if (video && !video.getAttribute('data-order-hooked')) {
            // 绑定事件并标记防止重复
            video.addEventListener('ended', handleVideoEnd);
            video.setAttribute('data-order-hooked', 'true');
            console.log('[脚本] 成功绑定视频结束监听');
        }
    }, 1000);

})();