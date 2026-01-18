// ==UserScript==
// @name         视频自动画中画
// @namespace    http://tampermonkey.net/
// @version      4.6.6
// @description  自动画中画，支持标签页切换、窗口失焦触发、回页自动退出，支持网页全屏。
// @author       mankaki
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562978/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/562978/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        enabled: true,
        debug: true
    };

    let hasUserGesture = false;

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
        /* 强制隐藏阻挡全屏的元素层级 */
        .pip-web-fs-active .pip-web-fullscreen-container ~ * {
            z-index: auto !important;
        }
    `;
    document.head.appendChild(style);

    function log(type, ...args) {
        if (!CONFIG.debug) return;
        const prefix = '[自动画中画]';
        if (type === 'warn') console.warn(prefix, ...args);
        else if (type === 'error') console.error(prefix, ...args);
        else console.log(prefix, ...args);
    }

    let lastActionTime = 0;
    const ACTION_COOLDOWN = 1000; // 冷却时间：1秒内不重复进行画中画切换

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
                log('warn', `受限于浏览器安全策略, [${trigger}] 触发需先在页面内点击一次。`);
                if (!hasUserGesture) {
                    console.log(
                        '%c 👉 💡 提示: 请在网页任意位置点击一下，即可激活“自动画中画”功能！ ',
                        'background: #ffcc00; color: #000; font-weight: bold; padding: 5px; border-radius: 3px;'
                    );
                }
            } else {
                log('error', `${trigger} 失败:`, err.message);
            }
        }
    }

    function setupVideo(video) {
        if (!video || video.dataset.pipObserved) return;

        // 过滤小型视频(如广告、追踪器或背景音), 仅对宽>200px的视频生效
        // 延迟检查以确保能够获取到正确的属性
        setTimeout(() => {
            if (!video || video.dataset.pipObserved) return;
            if (video.offsetWidth < 200 && video.offsetHeight < 150) return;

            video.dataset.pipObserved = 'true';
            video.autoPictureInPicture = true;

            video.addEventListener('play', () => {
                video.autoPictureInPicture = true;
            });
            log('info', '检测到播放器, 已应用自动画中画配置');
        }, 1000);
    }

    function scanVideos() {
        document.querySelectorAll('video').forEach(setupVideo);
    }

    async function toggleManualPiP() {
        if (document.pictureInPictureElement) {
            await exitPiP();
            return;
        }
        const allVideos = Array.from(document.querySelectorAll('video')).filter(v => v.readyState >= 2);
        if (allVideos.length === 0) return;
        let target = allVideos.find(v => !v.paused) || allVideos[0];
        if (target) await enterPiP(target, '快捷键 P');
    }

    // 寻找可能的播放器容器
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
        const allVideos = Array.from(document.querySelectorAll('video')).filter(v => v.readyState >= 2);
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
            log('info', '进入网页全屏, 容器:', container.tagName + (container.className ? '.' + container.className : ''));
        }
    }

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        const key = e.key.toLowerCase();
        if (key === 'p' || key === 'q') {
            // 阻止事件传递给其他监听器和浏览器默认行为
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (key === 'p') {
                toggleManualPiP();
            } else if (key === 'q') {
                toggleWebFullscreen();
            }
        }
    }, true);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
            if (node.tagName === 'VIDEO') setupVideo(node);
            else if (node.querySelectorAll) node.querySelectorAll('video').forEach(setupVideo);
        }));
    });

    window.addEventListener('blur', () => {
        if (!CONFIG.enabled || document.pictureInPictureElement || document.hidden) return;

        // 增加 500ms 延迟确认，防止像“右键菜单弹出”等瞬时动作导致的误触发
        setTimeout(() => {
            if (!document.hasFocus() && !document.hidden && !document.pictureInPictureElement) {
                const playing = Array.from(document.querySelectorAll('video')).find(v => !v.paused);
                if (playing) enterPiP(playing, '窗口失焦');
            }
        }, 500);
    });

    window.addEventListener('focus', () => {
        if (!CONFIG.enabled) return;
        // 增加一个小延迟, 确保浏览器状态切换完成
        setTimeout(() => {
            if (document.hasFocus()) exitPiP();
        }, 300);
    });

    document.addEventListener('visibilitychange', () => {
        if (!CONFIG.enabled) return;
        if (!document.hidden) log('info', '检测到返回, 正在恢复视频...');
    });

    function init() {
        log('info', '脚本已加载 v4.6.6');
        scanVideos();
        observer.observe(document.body, { childList: true, subtree: true });
        document.addEventListener('mousedown', () => {
            hasUserGesture = true;
            log('info', '手势已激活, 自动触发功能已就绪。');
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
