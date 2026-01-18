// ==UserScript==
// @name         视频自动画中画
// @namespace    http://tampermonkey.net/
// @version      4.8.2
// @description  自动画中画，支持标签页切换、窗口失焦触发、回页自动退出，支持网页全屏
// @author       mankaki
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @allFrames    true
// @downloadURL https://update.greasyfork.org/scripts/562978/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/562978/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        enabled: true,
        debug: true,
        isMgtv: location.hostname.includes('mgtv.com')
    };

    let hasUserGesture = false;
    let lastInteractionTime = 0; // 记录最后一次用户与页面交互的时间

    // 网页全屏样式注入
    const style = document.createElement('style');
    style.textContent = `
        .pip-web-fullscreen-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 2147483647 !important;
            background: #000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .pip-web-fullscreen-container video {
            width: 100% !important;
            height: 100% !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            object-fit: contain !important;
        }
        body.pip-web-fs-active {
            overflow: hidden !important;
        }
        .pip-web-fs-active .pip-web-fullscreen-container ~ * {
            z-index: auto !important;
        }
    `;
    document.head.appendChild(style);

    function log(type, ...args) {
        if (!CONFIG.debug) return;
        const prefix = `[自动画中画][${location.hostname}]`;
        if (type === 'warn') console.warn(prefix, ...args);
        else if (type === 'error') console.error(prefix, ...args);
        else console.log(prefix, ...args);
    }

    let lastActionTime = 0;
    const ACTION_COOLDOWN = 500; // 调优：减少冷却时间，响应更快速

    async function exitPiP() {
        if (!CONFIG.enabled || Date.now() - lastActionTime < ACTION_COOLDOWN) return;
        if (document.pictureInPictureElement) {
            try {
                lastActionTime = Date.now();
                await document.exitPictureInPicture();
                log('info', '返回页面, 自动退出画中画');
            } catch (err) { }
        }
    }

    async function enterPiP(video, trigger) {
        if (!video || document.pictureInPictureElement || Date.now() - lastActionTime < ACTION_COOLDOWN) return;
        try {
            lastActionTime = Date.now();
            await video.requestPictureInPicture();
            log('info', `成功通过 [${trigger}] 开启画中画`);
        } catch (err) {
            if (err.message.includes('user gesture')) {
                log('warn', `受限于安全策略, [${trigger}] 需先点击页面激活。`);
                if (!hasUserGesture) {
                    console.log('%c 👉 提示: 请点击网页任意位置，激活“自动画中画”功能！ ', 'background: #ffcc00; color: #000; font-weight: bold; padding: 5px;');
                }
            } else {
                log('error', `${trigger} 失败:`, err.message);
            }
        }
    }

    // 深度搜索视频元素 (支持 Shadow DOM)
    function findVideosDeep(root = document) {
        let videos = Array.from(root.querySelectorAll('video'));
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.shadowRoot) {
                videos = videos.concat(findVideosDeep(node.shadowRoot));
            }
        }
        return videos;
    }

    function setupVideo(video) {
        if (!video || video.dataset.pipObserved) return;

        let attempts = 0;
        const maxAttempts = 20;

        const checkSize = setInterval(() => {
            attempts++;
            if (!video || video.dataset.pipObserved) {
                clearInterval(checkSize);
                return;
            }

            const isVisible = video.offsetWidth >= 200 || video.offsetHeight >= 150;
            if (isVisible) {
                clearInterval(checkSize);
                video.dataset.pipObserved = 'true';

                // 属性强效守护：确保 autoPictureInPicture 始终启用
                const enforceNative = () => {
                    if (video.autoPictureInPicture !== true) {
                        video.autoPictureInPicture = true;
                        log('debug', '重新锁定原生自动画中画属性');
                    }
                };

                enforceNative();
                video.addEventListener('play', enforceNative);
                video.addEventListener('playing', enforceNative);

                log('info', '检测到有效播放器, 已应用配置');
            } else if (attempts >= maxAttempts) {
                clearInterval(checkSize);
                log('debug', '放弃追踪过小的视频元素:', video.src || 'blob/stream');
            }
        }, 500);
    }

    function scanVideos() {
        findVideosDeep().forEach(setupVideo);
    }

    async function toggleManualPiP() {
        if (document.pictureInPictureElement) {
            await exitPiP();
            return;
        }
        const allVideos = findVideosDeep().filter(v => v.readyState >= 2);
        if (allVideos.length === 0) return;
        let target = allVideos.find(v => !v.paused) || allVideos[0];
        if (target) await enterPiP(target, '快捷键 P');
    }

    function findPlayerContainer(video) {
        let container = video.parentElement;
        const videoRect = video.getBoundingClientRect();
        let current = video.parentElement;
        let depth = 0;
        while (current && current !== document.body && depth < 5) {
            const rect = current.getBoundingClientRect();
            const className = (current.className || '').toLowerCase();
            if (className.includes('player') || className.includes('video-container') ||
                (Math.abs(rect.width - videoRect.width) < 50 && Math.abs(rect.height - videoRect.height) < 50)) {
                container = current;
            }
            if (rect.width > videoRect.width * 1.5) break;
            current = current.parentElement;
            depth++;
        }
        return container;
    }

    function toggleWebFullscreen() {
        const allVideos = findVideosDeep().filter(v => v.readyState >= 2);
        if (allVideos.length === 0) return;
        let video = allVideos.find(v => !v.paused) || allVideos[0];
        if (!video) return;

        const container = findPlayerContainer(video);
        const isFS = container.classList.contains('pip-web-fullscreen-container');

        if (isFS) {
            container.classList.remove('pip-web-fullscreen-container');
            document.body.classList.remove('pip-web-fs-active');
            log('info', '退出网页全屏');
        } else {
            document.querySelectorAll('.pip-web-fullscreen-container').forEach(el => el.classList.remove('pip-web-fullscreen-container'));
            container.classList.add('pip-web-fullscreen-container');
            document.body.classList.add('pip-web-fs-active');
            log('info', '进入网页全屏, 容器:', container.tagName);
        }
    }

    document.addEventListener('keydown', (e) => {
        lastInteractionTime = Date.now();
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
        const key = e.key.toLowerCase();
        if (key === 'p' || key === 'q') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (key === 'p') toggleManualPiP();
            else if (key === 'q') toggleWebFullscreen();
        }
    }, true);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
            if (node.tagName === 'VIDEO') setupVideo(node);
            else if (node.nodeType === Node.ELEMENT_NODE) {
                // 深度扫描新加入的节点 (包括 Shadow DOM)
                findVideosDeep(node).forEach(setupVideo);
            }
        }));
    });

    window.addEventListener('blur', () => {
        if (!CONFIG.enabled || document.pictureInPictureElement || document.hidden) return;

        // 调优：交互保护缩短至 300ms，确保 ALT-TAB 切换足够灵敏
        if (Date.now() - lastInteractionTime < 300) {
            log('debug', '近期有点击交互，忽略失焦触发。');
            return;
        }

        setTimeout(() => {
            if (!document.hasFocus() && !document.hidden && !document.pictureInPictureElement) {
                if (Date.now() - lastInteractionTime < 300) return;
                const playing = findVideosDeep().find(v => !v.paused);
                if (playing) enterPiP(playing, '窗口失焦');
            }
        }, 500);
    });

    window.addEventListener('focus', () => {
        if (!CONFIG.enabled) return;
        setTimeout(() => { if (document.hasFocus()) exitPiP(); }, 300);
    });

    document.addEventListener('visibilitychange', () => {
        if (!CONFIG.enabled) return;
        if (!document.hidden) log('info', '检测到返回, 正在检查状态...');
    });

    function init() {
        log('info', `脚本已加载 v4.8.2 [${window.self === window.top ? 'Main' : 'Iframe'}]`);
        if (CONFIG.isMgtv) log('info', '检测到 MGTV, 已应用增强兼容性配置。');
        scanVideos();
        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('mousedown', () => {
            hasUserGesture = true;
            lastInteractionTime = Date.now();
            log('info', '手势已激活。');
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
