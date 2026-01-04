// ==UserScript==
// @name         Iwara 播放页优化（全屏+最高画质下载）
// @namespace    https://iwara.tv/
// @version      1.0
// @description  在 Iwara 视频页添加页面全屏按钮和最高画质下载按钮，操作便捷
// @match        https://www.iwara.tv/video/*
// @grant        none
// @icon         https://www.iwara.tv/logo.png
// @downloadURL https://update.greasyfork.org/scripts/555435/Iwara%20%E6%92%AD%E6%94%BE%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%88%E5%85%A8%E5%B1%8F%2B%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555435/Iwara%20%E6%92%AD%E6%94%BE%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%88%E5%85%A8%E5%B1%8F%2B%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 页面全屏按钮相关 ---
    let isFullscreen = false;
    let originalStyles = {};
    let fullscreenBtnInserted = false;

    function ensureElement(selector, callback) {
        function tryCall() {
            const el = document.querySelector(selector);
            if (el) {
                callback(el);
                return true;
            }
            return false;
        }
        if (tryCall()) return;

        const observer = new MutationObserver(() => {
            if (tryCall()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const intervalId = setInterval(() => {
            if (tryCall()) {
                clearInterval(intervalId);
                observer.disconnect();
            }
        }, 500);
    }

    function createFullscreenButton(controlBar) {
        if (!controlBar || fullscreenBtnInserted) return;
        if (controlBar.querySelector('.custom-page-fullscreen-btn')) {
            fullscreenBtnInserted = true;
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'vjs-control vjs-button custom-page-fullscreen-btn';
        btn.title = '页面全屏';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.width = '30px';
        btn.style.padding = '0';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';

        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="2"/>
                <path d="M12 9v4m0 0l-2-2m2 2l2-2" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;

        btn.addEventListener('click', togglePageFullscreen);
        controlBar.appendChild(btn);
        fullscreenBtnInserted = true;
    }

    function togglePageFullscreen() {
        const videoContainer = document.querySelector('.videoPlayer');
        const video = document.querySelector('.vjs-tech');
        const header = document.querySelector('.header__content');
        const sidebar = document.querySelector('.menu');

        if (!videoContainer || !video) return;

        if (!isFullscreen) {
            originalStyles = {
                player: videoContainer.getAttribute('style') || '',
                video: video.getAttribute('style') || '',
                headerDisplay: header ? header.style.display : null,
                sidebarDisplay: sidebar ? sidebar.style.display : null,
                bodyOverflow: document.body.style.overflow || ''
            };

            if (header) header.style.display = 'none';
            if (sidebar) sidebar.style.display = 'none';
            document.body.style.overflow = 'hidden';

            Object.assign(videoContainer.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                margin: '0',
                zIndex: '9999',
                background: 'black',
                display: 'block'
            });

            adjustVideoFit(video);

            window.addEventListener('resize', onWindowResize);
            document.addEventListener('keydown', escHandler);

            isFullscreen = true;
        } else {
            if (header) header.style.display = originalStyles.headerDisplay || '';
            if (sidebar) sidebar.style.display = originalStyles.sidebarDisplay || '';
            document.body.style.overflow = originalStyles.bodyOverflow || '';

            if (originalStyles.player !== undefined) videoContainer.setAttribute('style', originalStyles.player);
            else videoContainer.removeAttribute('style');

            if (originalStyles.video !== undefined) video.setAttribute('style', originalStyles.video);
            else video.removeAttribute('style');

            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('keydown', escHandler);

            isFullscreen = false;
        }
    }

    function escHandler(e) {
        if (e.key === 'Escape' && isFullscreen) {
            togglePageFullscreen();
        }
    }

    function onWindowResize() {
        if (!isFullscreen) return;
        const video = document.querySelector('.vjs-tech');
        if (video) adjustVideoFit(video);
    }

    function adjustVideoFit(video) {
        if (!video.videoWidth || !video.videoHeight) {
            video.addEventListener('loadedmetadata', () => adjustVideoFit(video), { once: true });
            return;
        }

        const isVertical = video.videoHeight > video.videoWidth;

        Object.assign(video.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            width: isVertical ? 'auto' : '100%',
            height: isVertical ? '100%' : 'auto'
        });
    }

    // --- 最高画质下载按钮相关 ---
    let downloadBtnInserted = false;

    function findHighestQualityLink() {
        const links = Array.from(document.querySelectorAll('.dropdown__content ul li a'));
        return links.find(a => a.textContent.trim() === 'Source') || null;
    }

    function createDownloadButton(url) {
        const btn = document.createElement('button');
        btn.className = 'vjs-control vjs-button custom-download-btn';
        btn.title = '下载最高画质';
        btn.style.cursor = 'pointer';
        btn.style.width = '30px';
        btn.style.padding = '0';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';

        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="3" x2="7" y2="11" />
            <polyline points="4,8 7,11 10,8" />
            <line x1="4" y1="13" x2="10" y2="13" />
          </svg>
        `;

        btn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = ''; // 直接下载
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        return btn;
    }

    function insertDownloadButton() {
        if (downloadBtnInserted) return;
        const controlBar = document.querySelector('.vjs-control-bar');
        if (!controlBar) return;

        const highestLink = findHighestQualityLink();
        if (!highestLink) return;

        const btn = createDownloadButton(highestLink.href);
        controlBar.appendChild(btn);
        downloadBtnInserted = true;
    }

    // --- 初始化按钮插入 ---
    ensureElement('.vjs-control-bar', controlBar => {
        createFullscreenButton(controlBar);
        insertDownloadButton();
    });

    const globalObserver = new MutationObserver(() => {
        if (!fullscreenBtnInserted || !downloadBtnInserted) {
            const cb = document.querySelector('.vjs-control-bar');
            if (cb) {
                if (!fullscreenBtnInserted) createFullscreenButton(cb);
                if (!downloadBtnInserted) insertDownloadButton();
            }
        }
    });
    globalObserver.observe(document.body, { childList: true, subtree: true });

    ensureElement('.vjs-tech', (videoEl) => {
        if (isFullscreen) adjustVideoFit(videoEl);
        videoEl.addEventListener('loadedmetadata', () => {
            if (isFullscreen) adjustVideoFit(videoEl);
        });
    });

    window.addEventListener('load', () => {
        const cb = document.querySelector('.vjs-control-bar');
        if (cb) {
            createFullscreenButton(cb);
            insertDownloadButton();
        }
    });

})();
