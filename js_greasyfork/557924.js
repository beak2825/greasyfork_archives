// ==UserScript==
// @name         抖音开心元元直播间一键截图插件
// @namespace    https://tampermonkey.net/
// @version      1.1
// @icon         https://p3-pc-sign.douyinpic.com/aweme-avatar/tos-cn-avt-0015_bac3c5a4f3b2ab6ccfe13744d9dde2f2~tplv-8yspqt5zfm-300x300.webp?lk3s=93de098e&x-expires=1765033200&x-signature=DKlvMXB6WDKyaVrLqIG89eWzQHY%3D&from=2480802190&s=profile&se=false&sc=avatar&l=20251204235116C91CF1708F932332740E
// @description  专为元宝们为大王截图而制作的截图插件，支持右上角按钮截图（按钮可拖拽位置），支持Ctrl + Y 截图；
// @author       V之痕
// @match        *://live.douyin.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557924/%E6%8A%96%E9%9F%B3%E5%BC%80%E5%BF%83%E5%85%83%E5%85%83%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%80%E9%94%AE%E6%88%AA%E5%9B%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/557924/%E6%8A%96%E9%9F%B3%E5%BC%80%E5%BF%83%E5%85%83%E5%85%83%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%80%E9%94%AE%E6%88%AA%E5%9B%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initVideoCaptureDownload() {
        const config = {
            btnText: '直播截图',
            btnBgColor: '#2563eb',
            btnHoverColor: '#1d4ed8',
            btnTextColor: '#ffffff',
            btnBorderRadius: '8px',
            btnShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            imgFormat: 'image/png',
            imgQuality: 1
        };

        if (window.top.document.getElementById('videoCaptureBtn')) return;

        const captureBtn = window.top.document.createElement('button');
        captureBtn.id = 'videoCaptureBtn';
        captureBtn.innerText = config.btnText;
        captureBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        padding: 12px 24px;
        background: ${config.btnBgColor};
        color: ${config.btnTextColor};
        border: none;
        border-radius: ${config.btnBorderRadius};
        cursor: move; /* 默认拖拽光标 */
        font-size: 14px;
        font-weight: 500;
        opacity: 0.95;
        outline: none;
        box-shadow: ${config.btnShadow};
        user-select: none; /* 禁止文字选中 */
        -webkit-user-select: none;
    `;

        captureBtn.addEventListener('mouseenter', () => {
            captureBtn.style.opacity = '1';
            captureBtn.style.background = config.btnHoverColor;
            captureBtn.style.transform = 'translateY(-2px)';
            captureBtn.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
        });
        captureBtn.addEventListener('mouseleave', () => {
            captureBtn.style.opacity = '0.95';
            captureBtn.style.background = config.btnBgColor;
            captureBtn.style.transform = 'translateY(0)';
            captureBtn.style.boxShadow = config.btnShadow;
        });

        let isDragging = false;
        let startX, startY, initialX, initialY;
        let dragDistance = 0;

        captureBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            dragDistance = 0;

            initialX = captureBtn.offsetLeft;
            initialY = captureBtn.offsetTop;

            startX = e.clientX;
            startY = e.clientY;

            captureBtn.style.cursor = 'grabbing';
            captureBtn.style.opacity = '0.85';
        });

        window.top.document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            dragDistance = Math.sqrt(dx * dx + dy * dy);

            const newLeft = initialX + dx;
            const newTop = initialY + dy;
            const viewWidth = window.top.innerWidth - captureBtn.offsetWidth;
            const viewHeight = window.top.innerHeight - captureBtn.offsetHeight;

            captureBtn.style.left = `${Math.max(0, Math.min(newLeft, viewWidth))}px`;
            captureBtn.style.top = `${Math.max(0, Math.min(newTop, viewHeight))}px`;

            captureBtn.style.right = 'auto';
        });

        window.top.document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                captureBtn.style.cursor = 'move';
                captureBtn.style.opacity = '0.95';
            }
        });

        const captureAndDownload = () => {

            if (dragDistance > 5) {
                dragDistance = 0;
                return;
            }

            const video = window.top.document.querySelector('video');
            if (!video) {
                alert('未找到指定的视频元素！');
                return;
            }
            if (video.paused || video.ended) {
                alert('视频未播放，无法截图！');
                return;
            }

            try {
                const canvas = window.top.document.createElement('canvas');
                canvas.width = video.videoWidth || video.offsetWidth;
                canvas.height = video.videoHeight || video.offsetHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const a = window.top.document.createElement('a');
                a.href = canvas.toDataURL(config.imgFormat, config.imgQuality);
                a.download = `直播截图_${new Date().getTime()}.${config.imgFormat.split('/')[1]}`;
                a.click();
                URL.revokeObjectURL(a.href);

                const tip = window.top.document.createElement('div');
                tip.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 12px 24px;
                background: rgba(0,0,0,0.7);
                color: white;
                border-radius: 6px;
                font-size: 14px;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
                tip.innerText = '截图下载成功！';
                window.top.document.body.appendChild(tip);
                setTimeout(() => tip.style.opacity = '1', 10);
                setTimeout(() => {
                    tip.style.opacity = '0';
                    setTimeout(() => window.top.document.body.removeChild(tip), 200);
                }, 1500);

            } catch (e) {
                if (e.name === 'SecurityError') {
                    alert('截图失败：视频资源跨域且未配置CORS！\n请联系服务器添加Access-Control-Allow-Origin响应头');
                } else if (e.name === 'TypeError') {
                    alert('截图失败：视频帧绘制异常，请确认视频正常播放！');
                } else {
                    alert(`截图失败：${e.message}`);
                }
                console.error('截图下载错误：', e);
            }
        };

        captureBtn.addEventListener('click', captureAndDownload);

        window.top.document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                dragDistance = 0;
                captureAndDownload();
            }
        });

        window.top.document.body.appendChild(captureBtn);
    }

    if (window.top.document.readyState === 'complete') {
        initVideoCaptureDownload();
    } else {
        window.top.addEventListener('load', initVideoCaptureDownload);
    }
})();