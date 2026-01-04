// ==UserScript==
// @name         Bilibili 视频音量均衡器
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  通过 Web Audio API 压缩 Bilibili 视频中音频的动态范围，使不同视频或同一视频中差距过大的响度保持一致
// @author       Timothy Tao & Github Copilot
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557295/Bilibili%20%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E5%9D%87%E8%A1%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557295/Bilibili%20%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E5%9D%87%E8%A1%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 全局状态 ====================
    const $ = s => document.querySelector(s);
    let audioCtx, sourceNode, compressorNode, gainNode, currentVideo;
    let isEnabled = true;  // 均衡器开关状态

    // ==================== 样式定义 ====================
    // 按钮样式 & 波形跳动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bili-eq-bounce { 50% { transform: scaleY(1.6) } }
        .bili-loudness-btn { color: hsla(0,0%,100%,.8); transition: color .3s; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; margin-right: 8px }
        .bili-loudness-btn:hover { color: #fff }
        .bili-loudness-btn.active { color: #00a1d6 !important }
        .bili-loudness-btn .bar { transform-origin: center bottom; transform-box: fill-box }
        .bili-loudness-btn.animating .bar { animation: bili-eq-bounce .4s ease-in-out }
        .bili-loudness-btn.animating .bar-2 { animation-delay: .1s }
        .bili-loudness-btn.animating .bar-3 { animation-delay: .2s }
    `;

    // 均衡器图标 SVG (三条波形柱)
    const iconSvg = `<svg viewBox="0 0 22 22" width="22" height="22"><path class="bar bar-1" d="M6 15V7a1 1 0 10-2 0v8a1 1 0 102 0z" fill="currentColor"/><path class="bar bar-2" d="M12 18V4a1 1 0 10-2 0v14a1 1 0 102 0z" fill="currentColor"/><path class="bar bar-3" d="M18 13V9a1 1 0 10-2 0v4a1 1 0 102 0z" fill="currentColor"/></svg>`;

    // ==================== UI 控制 ====================
    /** 更新按钮的激活状态和提示文字 */
    function updateBtnState() {
        const btn = $('.bili-loudness-btn');
        if (btn) {
            btn.classList.toggle('active', isEnabled);
            btn.title = `音量均衡: ${isEnabled ? '开' : '关'}`;
        }
    }

    // ==================== 音频处理 ====================
    /** 
     * 更新音频连接图
     * 开启时: Source -> Compressor -> Gain -> Destination
     * 关闭时: Source -> Destination (直通)
     */
    function updateAudioGraph() {
        if (!sourceNode || !audioCtx) return;
        try { sourceNode.disconnect() } catch {}
        try {
            sourceNode.connect(isEnabled ? compressorNode : audioCtx.destination);
        } catch {
            // 连接失败时回退到直通模式
            try { sourceNode.connect(audioCtx.destination) } catch {}
        }
        updateBtnState();
    }

    /** 
     * 初始化 Web Audio API 上下文
     * 创建压缩器节点 (降低动态范围) 和增益节点 (补偿音量)
     */
    function initAudioContext() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 动态压缩器: 将大音量压缩，小音量保留
        compressorNode = audioCtx.createDynamicsCompressor();
        compressorNode.threshold.value = -50;   // 阈值 -50dB，超过即压缩
        compressorNode.knee.value = 40;         // 拐点，平滑过渡
        compressorNode.ratio.value = 12;        // 压缩比 12:1
        compressorNode.attack.value = 0;        // 启动时间，立即响应
        compressorNode.release.value = 0.25;    // 释放时间

        // 增益节点: 补偿压缩后的音量损失
        gainNode = audioCtx.createGain();
        compressorNode.connect(gainNode).connect(audioCtx.destination);
    }

    // ==================== 播放器集成 ====================
    /** 向 Bilibili 播放器控制栏添加均衡器开关按钮 */
    function tryAddControlBtn() {
        if ($('.bili-loudness-btn')) return;
        // 兼容新版 bpx 播放器和旧版播放器
        const rightControl = $('.bpx-player-control-bottom-right, .bilibili-player-video-control-bottom-right');
        if (!rightControl) return;

        const btn = document.createElement('div');
        btn.className = 'bpx-player-ctrl-btn bili-loudness-btn';
        btn.innerHTML = iconSvg;
        btn.onclick = () => {
            isEnabled = !isEnabled;
            updateAudioGraph();
            // 触发波形跳动动画
            btn.classList.remove('animating');
            void btn.offsetWidth;  // 强制重绘
            btn.classList.add('animating');
        };

        // 插入到音量按钮前面
        const anchor = rightControl.querySelector('.bpx-player-ctrl-volume, .bilibili-player-video-btn-volume');
        anchor ? rightControl.insertBefore(btn, anchor) : rightControl.appendChild(btn);
        updateBtnState();
    }

    // ==================== 视频处理 ====================
    /** 捕获视频元素并接入音频处理链 */
    function processVideo(video) {
        if (currentVideo === video) return;
        try { sourceNode?.disconnect() } catch {}
        currentVideo = video;
        initAudioContext();

        // 创建媒体源节点并连接处理链
        const setup = () => {
            try {
                sourceNode = audioCtx.createMediaElementSource(video);
                updateAudioGraph();
            } catch {}
        };

        // 等待视频元数据加载完成
        video.readyState >= 1 ? setup() : video.addEventListener('loadedmetadata', setup, { once: true });

        // 用户交互后恢复被浏览器暂停的 AudioContext
        const resume = () => audioCtx?.state === 'suspended' && audioCtx.resume();
        video.addEventListener('play', resume);
        video.addEventListener('playing', resume);
    }

    // ==================== DOM 监听 ====================
    // 监听 DOM 变化，自动处理 SPA 页面切换时的新视频元素
    const observer = new MutationObserver(() => {
        tryAddControlBtn();
        const video = $('video');
        if (video) processVideo(video);
    });

    // ==================== 初始化入口 ====================
    function init() {
        document.head.appendChild(style);
        observer.observe(document.body, { childList: true, subtree: true });
        const video = $('video');
        if (video) processVideo(video);
        tryAddControlBtn();
        // 全屏切换后重新连接音频图并恢复按钮
        document.addEventListener('fullscreenchange', () => setTimeout(() => {
            audioCtx?.state === 'suspended' && audioCtx.resume();
            updateAudioGraph();
            tryAddControlBtn();
        }, 300));
    }

    // 启动脚本
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', init) 
        : init();
})();