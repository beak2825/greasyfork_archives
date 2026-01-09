// ==UserScript==
// @name         智能网课防暂停与遮罩粉碎助手 (针对LayUI优化版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  1.拦截失焦/移出导致的自动暂停；2.保留手动暂停功能；3.自动粉碎包括layui-layer-shade在内的所有遮罩层；4.伪造页面可见状态。
// @author       Gemini Partner
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561802/%E6%99%BA%E8%83%BD%E7%BD%91%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C%E4%B8%8E%E9%81%AE%E7%BD%A9%E7%B2%89%E7%A2%8E%E5%8A%A9%E6%89%8B%20%28%E9%92%88%E5%AF%B9LayUI%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561802/%E6%99%BA%E8%83%BD%E7%BD%91%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C%E4%B8%8E%E9%81%AE%E7%BD%A9%E7%B2%89%E7%A2%8E%E5%8A%A9%E6%89%8B%20%28%E9%92%88%E5%AF%B9LayUI%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 状态伪装：让网页以为你一直盯着它看 ---
    try {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
    } catch (e) {
        console.error("状态伪装失败:", e);
    }

    // --- 2. 暴力样式注入：从 CSS 层面废掉所有遮罩，解决点不动的问题 ---
    const injectStyle = () => {
        const styleId = 'anti-mask-style-v1';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* 精准打击 layui 遮罩及全屏弹窗 */
            .layui-layer-shade, 
            [id^="layui-layer-shade"], 
            .layui-layer, 
            .modal-backdrop,
            [class*="mask"],
            [class*="overlay"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -1 !important;
            }
            
            /* 强制恢复 body 的点击响应，防止透明层锁定 */
            body, html {
                pointer-events: auto !important;
                overflow: auto !important;
                user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
    };

    // --- 3. 核心拦截：区分“系统暂停”与“用户暂停” ---
    let isUserAction = false;

    // 监听全局点击：判断是否点在了播放器的控制区域
    document.addEventListener('mousedown', (e) => {
        // 匹配你的网站类名 .vjs-play-control 或通用控制按钮
        const isControlBtn = e.target.closest('.vjs-play-control') || 
                             e.target.closest('[class*="control"]') || 
                             e.target.closest('[class*="play"]') || 
                             e.target.closest('[class*="pause"]') ||
                             e.target.closest('button') ||
                             e.target.tagName === 'VIDEO';
        
        if (isControlBtn) {
            isUserAction = true;
            // 500ms后重置，给原生 pause 函数留出执行窗口
            setTimeout(() => { isUserAction = false; }, 500);
        }
    }, true);

    // 劫持视频原型链
    const rawPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function() {
        if (isUserAction) {
            return rawPause.apply(this, arguments);
        } else {
            // 拦截非点击触发的暂停并立刻恢复播放
            Promise.resolve().then(() => this.play());
            return Promise.resolve();
        }
    };

    // --- 4. 自动化清理任务 ---
    const cleanJob = () => {
        injectStyle(); // 确保样式始终存在

        // 物理删除所有命中特征的遮罩元素
        const selectors = ['.layui-layer-shade', '[id^="layui-layer-shade"]', '.layui-layer'];
        document.querySelectorAll(selectors.join(',')).forEach(el => {
            el.remove();
        });

        // 强行恢复 body 交互
        if (document.body && document.body.style.pointerEvents === 'none') {
            document.body.style.setProperty('pointer-events', 'auto', 'important');
        }
    };

    // 启动高频巡检（应对动态秒生的弹窗）
    setInterval(cleanJob, 500);

    console.log("%c智能防暂停助手已就绪", "color: #8e44ad; font-weight: bold");
})();