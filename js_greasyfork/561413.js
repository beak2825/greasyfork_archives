// ==UserScript==
// @name         抖音视频下载器(202601-个人版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  动态获取当前视频 + (下载进度是模拟的), 今天是2026-01-04, 本版本仅代表当前抖音框架下能用, 但, 如果页面框架变了, 就不保证了)
// @author       撸兄
// @match        https://www.douyin.com/video/*
// @grant        GM_download
// @connect      douyinvod.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561413/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%28202601-%E4%B8%AA%E4%BA%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561413/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%28202601-%E4%B8%AA%E4%BA%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let downloadProgressElement = null;

    // --- UI: 进度提示条 ---
    const showProgress = (message) => {
        if (downloadProgressElement) {
            downloadProgressElement.querySelector('.msg').textContent = message;
            return;
        }
        downloadProgressElement = document.createElement('div');
        downloadProgressElement.innerHTML = `
            <div style="
                position: fixed;
                top: 60px;
                right: 15px;
                z-index: 9999999;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                min-width: 220px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
                <div class="msg">${message}</div>
                <div style="height: 6px; background: #333; border-radius: 3px; overflow: hidden;">
                    <div class="bar" style="
                        height: 100%;
                        width: 0%;
                        background: linear-gradient(to right, #2196F3, #03A9F4);
                        transition: width 0.2s ease;
                    "></div>
                </div>
            </div>
        `;
        document.body.appendChild(downloadProgressElement);
    };

    const updateProgress = (percent) => {
        if (!downloadProgressElement) return;
        const bar = downloadProgressElement.querySelector('.bar');
        if (bar) bar.style.width = `${Math.min(percent, 100)}%`;
    };

    const hideProgress = () => {
        if (downloadProgressElement) {
            downloadProgressElement.remove();
            downloadProgressElement = null;
        }
    };

    // --- 工具函数 ---
    const getVideoTitle = () => {
        let title =
            document.querySelector('h1')?.innerText ||
            document.querySelector('[data-e2e="video-desc"]')?.innerText ||
            document.querySelector('[class*="videoDesc"]')?.innerText ||
            document.querySelector('title')?.innerText?.replace(/\s*-\s*抖音\s*$/, '') ||
            null;
        if (!title) return null;
        title = title.trim().replace(/\s+/g, ' ');
        return title.length > 16 ? title.substring(0, 16) : title;
    };

    const sanitizeFilename = (filename) => {
        if (!filename) return 'douyin_video';
        let safe = filename.replace(/[\\/:*?"<>|]/g, ' ');
        safe = safe.replace(/\s+/g, ' ').trim().replace(/^\.+|\.+$/g, '');
        return safe || 'douyin_video';
    };

    const getVideoUrl = () => {
        const video = document.querySelector('video[mediatype="video"]');
        if (!video) return null;
        const sources = Array.from(video.querySelectorAll('source'))
            .map(s => s.src)
            .filter(src => src && (src.includes('.mp4') || src.includes('mime_type=video_mp4')));
        return sources[0] || null;
    };

    // --- 获取视频时长（秒）---
    const getVideoDuration = () => {
        const video = document.querySelector('video[mediatype="video"]');
        if (video && !isNaN(video.duration) && video.duration > 0) {
            return video.duration;
        }
        // 默认 15 秒（抖音常见）
        return 15;
    };

    // --- 估算下载所需时间（毫秒）---
    const estimateDownloadTimeMs = (durationSec) => {
        // 假设平均码率：1500 kbps (≈ 187.5 KB/s)
        const bitrateKbps = 1500;
        const fileSizeBytes = (durationSec * bitrateKbps * 1000) / 8; // bits → bytes

        // 估算用户下载速度（KB/s）
        let downloadSpeedKBps = 2048; // 默认 2 MB/s

        // 尝试使用 Network Information API（部分浏览器支持）
        if (navigator.connection) {
            const effectiveType = navigator.connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
            if (effectiveType === 'slow-2g') downloadSpeedKBps = 50;
            else if (effectiveType === '2g') downloadSpeedKBps = 250;
            else if (effectiveType === '3g') downloadSpeedKBps = 1000;
            else if (effectiveType === '4g') downloadSpeedKBps = 4000;
            // 'wifi' 或其他默认走 2048+
        }

        const timeSeconds = fileSizeBytes / (downloadSpeedKBps * 1024); // bytes / (KB/s * 1024) = seconds
        const timeMs = Math.max(1000, Math.min(timeSeconds * 1000, 15000)); // 限制在 1~15 秒之间
        return timeMs;
    };

    // --- 动态进度模拟（基于估算时间）---
    const simulateSmartProgress = (totalTimeMs) => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            if (!downloadProgressElement) {
                clearInterval(interval);
                return;
            }
            const elapsed = Date.now() - startTime;
            const percent = Math.min(100, (elapsed / totalTimeMs) * 100);
            updateProgress(percent);

            if (percent >= 100) {
                clearInterval(interval);
                setTimeout(hideProgress, 800);
            }
        }, 100);
    };

    // --- 下载逻辑 ---
    const downloadCurrentVideo = () => {
        const url = getVideoUrl();
        const title = getVideoTitle();
        const duration = getVideoDuration();

        if (!url) {
            alert('⚠️ 未找到视频地址，请稍等或刷新页面。');
            return;
        }

        const baseName = sanitizeFilename(title || 'douyin_video');
        const filename = `${baseName}.mp4`;

        // 估算下载时间
        const estimatedTimeMs = estimateDownloadTimeMs(duration);
        const estimatedSec = (estimatedTimeMs / 1000).toFixed(1);

        showProgress(`正在下载（约 ${estimatedSec}s）…`);
        simulateSmartProgress(estimatedTimeMs);

        GM_download({
            url: url,
            name: filename,
            headers: {
                referer: 'https://www.douyin.com/',
                'user-agent': navigator.userAgent
            },
            onload: () => {
                console.log('✅ 下载请求成功:', filename);
                // 实际下载由浏览器处理，我们只模拟感知
            },
            onerror: (err) => {
                console.error('❌ 下载失败:', err);
                showProgress('❌ 下载失败！');
                setTimeout(hideProgress, 3000);
                alert(`下载失败，请手动保存。\n建议文件名：${filename}`);
            }
        });
    };

    // --- 创建按钮 ---
    const createButton = () => {
        if (document.getElementById('douyin-download-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'douyin-download-btn';
        btn.innerHTML = '⬇️ 下载当前视频';
        btn.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 999999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #ff3366, #ff6b6b);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255,51,102,0.5);
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        btn.onclick = downloadCurrentVideo;
        document.body.appendChild(btn);
    };

    // --- 初始化 ---
    const init = () => createButton();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();