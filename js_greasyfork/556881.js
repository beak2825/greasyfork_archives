// ==UserScript==
// @name         斗鱼直播极速版
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  关闭直播间乱七八糟的东西(广告、特效)，修正WebRTC竞态问题，增强DOM访问安全性。默认网页全屏。
// @license      Copyright © 2025 Leon. All rights reserved.
// @author       Leon
// @match        *://www.douyu.com/*
// @match        *://www.douyu.com/beta/*
// @icon         https://www.douyu.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556881/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E6%9E%81%E9%80%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556881/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E6%9E%81%E9%80%9F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 1. 极速 CSS 注入 (样式黑洞)
    // =================================================================
    const cssStyles = `
        /* [核心屏蔽区] */
        #js-room-activity, .ani-broadcast, .layout-Bottom-aside, .layout-Player-rank,

        /* [画面纯净区] */
        .wm-view, .wm-general, .Layout-Player-background, .Web-player-background,

        /* [特效屏蔽区] */
        .Privilege-nobleEnter, .FansMedal-enter, .Barrage-topFloater,
        .LiveRoom-interactive, .gift-effect-container, .anim-canvas, .effect-canvas, div[class*="broadcastDiv-"],

        /* [广告屏蔽区] */
        .ACT_BANNER_WRAP, .PcDiversion, .Bottom-ad, .Yubao-ad, .LiveRoom-bottom-ad,
        .Suspension-box, .LazyLoad-ad, .Barrage-toolbar,

        /* [工具栏净化区] */
        .PlayerToolbar-sign, .PlayerToolbar-task, .PlayerToolbar-adv, .PlayerToolbar-qrcode
        { display: none !important; }

        body, .layout-Main { background-color: #000 !important; }
    `;

    // 鲁棒性注入：优先 Head，降级到 HTML 根元素
    const styleNode = document.createElement('style');
    styleNode.textContent = cssStyles;
    (document.head || document.documentElement).appendChild(styleNode);

    // =================================================================
    // 2. WebRTC 强力拦截
    // =================================================================
    try {
        const noop = () => {};
        const fakeConn = function() {
            return {
                createDataChannel: noop, createOffer: async()=>0, createAnswer: async()=>0,
                setLocalDescription: async()=>0, setRemoteDescription: async()=>0,
                addIceCandidate: async()=>0, close: noop, addEventListener: noop,
                signalingState: 'closed'
            };
        };

        // 这防止了斗鱼后续脚本通过判断 undefined 来重新注入 P2P 组件
        window.RTCPeerConnection = fakeConn;
        window.webkitRTCPeerConnection = fakeConn;

        // 防御性编程：防止被后续脚本修改 (如果浏览器允许)
        try {
            Object.defineProperty(window, 'RTCPeerConnection', { value: fakeConn, writable: true, configurable: true });
            Object.defineProperty(window, 'webkitRTCPeerConnection', { value: fakeConn, writable: true, configurable: true });
        } catch(e) {}

    } catch(e){}

    // =================================================================
    // 3. 自动化逻辑
    // =================================================================
    const MAX_CYCLES = 30;
    let cycleCount = 0;
    let hasAutoFullscreened = false;

    const autoTask = setInterval(() => {
        cycleCount++;

        // --- A: 智能网页全屏 ---
        if (!hasAutoFullscreened) {
            const wfsBtn = document.querySelector('[title="网页全屏"]') || document.querySelector('.wfs');
            const isFullscreen = document.body?.classList.contains('is-web-fullscreen');

            if (isFullscreen) {
                hasAutoFullscreened = true;
            } else if (wfsBtn) {
                wfsBtn.click();
                hasAutoFullscreened = true;
            }
        }

        // --- B: 退出机制 ---
        if (cycleCount > MAX_CYCLES) clearInterval(autoTask);

    }, 1000);

    // =================================================================
    // 4. 定时清理iframe
    // =================================================================
    setInterval(() => {
        const frames = document.getElementsByTagName('iframe');
        for (let i = frames.length - 1; i >= 0; i--) {
            if (frames[i].src && !frames[i].src.includes('douyu.com/member')) {
                frames[i].parentNode.removeChild(frames[i]);
            }
        }
    }, 10000);

})();