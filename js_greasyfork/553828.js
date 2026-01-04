// ==UserScript==
// @name         课程视频自动连播（东职教师）
// @namespace    http://tampermonkey.net
// @description  自动连播教师培训课程
// @version      2.4
// @author       Austin
// @match        *://ua.ulearning.cn/learnCourse/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553828/%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%88%E4%B8%9C%E8%81%8C%E6%95%99%E5%B8%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553828/%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%88%E4%B8%9C%E8%81%8C%E6%95%99%E5%B8%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VIDEO_SELECTOR = 'video.custom-video:not([style*="display: none"])';
    const OVERLAY_BUTTON_SELECTOR = '.mejs__overlay-button';
    const ALL_ITEMS_SELECTOR = '.catalog-list .page-name';
    const ACTIVATE_ITEM_SELECTOR = '.catalog-list .page-name.active';
    const POLL_INTERVAL = 2000;

    // “走神”弹窗的选择器（原有）
    const MODAL_SELECTOR = '#alertModal[style*="display: block"]';
    const RESUME_BUTTON_SELECTOR = '.btn-submit';

    // 导航锁：当用户或脚本切换到下一个视频时短时间抑制自动恢复逻辑（单位 ms）
    let navigationLock = false;
    function setNavigationLock(ms = 3000) {
        navigationLock = true;
        setTimeout(() => { navigationLock = false; }, ms);
    }

    /**
     * 强制播放
     */
    function forcePlayVideo(video = null, attempt = 0) {
        try {
            const videoPlayer = video || document.querySelector(VIDEO_SELECTOR);
            if (!videoPlayer) {
                console.warn('forcePlayVideo: 未找到播放器');
                return Promise.reject(new Error('no-video'));
            }

            if (videoPlayer.__isTryingToPlay) return Promise.resolve();
            videoPlayer.__isTryingToPlay = true;

            try { videoPlayer.muted = true; } catch(_) {}

            let p;
            try {
                p = videoPlayer.play();
            } catch (err) {
                p = Promise.reject(err);
            }

            if (p && typeof p.then === 'function') {
                return p.then(() => {
                    videoPlayer.__isTryingToPlay = false;
                    console.log('forcePlayVideo: play() 成功');
                }).catch((err) => {
                    console.warn('forcePlayVideo: play() 被拒绝:', err && err.message);
                    // 尝试点击覆盖层
                    const playOverlayButton = document.querySelector(OVERLAY_BUTTON_SELECTOR);
                    if (playOverlayButton && playOverlayButton.offsetParent !== null) {
                        try { playOverlayButton.click(); } catch(e) { console.warn('overlay click failed', e); }
                    }
                    // 模拟点击 video
                    try { videoPlayer.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); } catch(e){}

                    videoPlayer.__isTryingToPlay = false;
                    if (attempt < 4) {
                        const delay = 300 * (attempt + 1);
                        return new Promise((res) => setTimeout(() => res(forcePlayVideo(videoPlayer, attempt + 1)), delay));
                    } else {
                        console.error('forcePlayVideo: 多次尝试仍然失败');
                        return Promise.reject(err);
                    }
                });
            } else {
                videoPlayer.__isTryingToPlay = false;
                console.log('forcePlayVideo: play() 返回 undefined，视为成功');
                return Promise.resolve();
            }
        } catch (ex) {
            console.error('forcePlayVideo 异常', ex);
            return Promise.reject(ex);
        }
    }

    /**
     * 播放下一个视频（脚本触发时设置 navigationLock）
     */
    function playNextVideo() {
        console.log('playNextVideo: 视频结束，尝试播放下一个...');
        const allVideoLinks = document.querySelectorAll(ALL_ITEMS_SELECTOR);
        if (allVideoLinks.length === 0) {
            console.warn('playNextVideo: 未找到视频列表');
            return;
        }
        const currentLink = document.querySelector(ACTIVATE_ITEM_SELECTOR);
        if (!currentLink) {
            console.warn('playNextVideo: 未找到当前激活项');
            return;
        }
        const linksArray = Array.from(allVideoLinks);
        const currentIndex = linksArray.indexOf(currentLink);
        if (currentIndex !== -1 && currentIndex < linksArray.length - 1) {
            const nextLink = linksArray[currentIndex + 1];
            const videoName = nextLink.innerText.trim() || '下一个视频';
            console.log(`playNextVideo: 找到下一个视频 ${videoName}，1秒后点击并锁定导航`);
            setNavigationLock(5000); // 增加点容错时间
            setTimeout(() => {
                try { nextLink.click(); } catch(e) { console.warn('click next failed', e); }
                // startPollingForVideo 会处理新的 video
                startPollingForVideo();
            }, 1000);
        } else {
            console.log('playNextVideo: 所有视频播放完毕');
        }
    }

    /**
     * pause 事件处理：在 navigationLock 或低 readyState 时不强制恢复
     */
    function onVideoPause(e) {
        const videoPlayer = e.target;
        if (!videoPlayer) return;

        console.log('onVideoPause: pause 触发', {
            isTrusted: e.isTrusted,
            currentTime: videoPlayer.currentTime,
            readyState: videoPlayer.readyState,
            ended: videoPlayer.ended,
            seeking: videoPlayer.seeking
        });

        if (navigationLock) {
            console.log('onVideoPause: 正在导航/加载中，忽略 pause 事件');
            return;
        }

        // 走神弹窗放行
        const alertModal = document.querySelector(MODAL_SELECTOR);
        if (alertModal) {
            console.log('onVideoPause: 由走神弹窗引起的暂停，交由弹窗处理');
            return;
        }

        // 如果视频尚未达到可以流畅播放的状态（readyState < 3），不要强制恢复以避免循环
        // readyState: 0 NONE,1 METADATA,2 CURRENT_DATA,3 FUTURE_DATA,4 ENOUGH_DATA
        if (videoPlayer.readyState < 3) {
            console.log('onVideoPause: 视频尚未加载到可播放状态 (readyState < 3)，忽略恢复');
            return;
        }

        // 等待小延迟以确认不是 ended/seeking 的短暂状态
        setTimeout(() => {
            if (videoPlayer.ended) {
                console.log('onVideoPause: 已结束，放行');
                return;
            }
            if (videoPlayer.seeking) {
                console.log('onVideoPause: 正在 seeking，放行');
                return;
            }
            // 如果希望尊重用户真正手动暂停（真实点击），可以开启下面判断：
            // if (e.isTrusted) { console.log('用户手动暂停，尊重操作'); return; }

            console.log('onVideoPause: 尝试恢复播放（readyState 已足够）');
            forcePlayVideo(videoPlayer).catch((err) => {
                console.warn('onVideoPause: 恢复播放失败', err && err.message);
            });
        }, 150);
    }

    /**
     * 绑定监听器（并确保为新 video 设置一次 canplay 恢复）
     */
    function attachListenersTo(videoPlayer) {
        if (!videoPlayer) return;
        try {
            videoPlayer.removeEventListener('ended', playNextVideo);
            videoPlayer.removeEventListener('pause', onVideoPause);
        } catch(_) {}
        videoPlayer.addEventListener('ended', playNextVideo);
        videoPlayer.addEventListener('pause', onVideoPause);
        console.log('attachListenersTo: 已绑定 video 事件', videoPlayer);

        // 清理之前的 canplay handler（若有）
        if (videoPlayer.__onCanPlayHandler) {
            try { videoPlayer.removeEventListener('canplay', videoPlayer.__onCanPlayHandler); } catch(_) {}
            videoPlayer.__onCanPlayHandler = null;
        }

        // 如果已经可以播放，立刻尝试；否则在 canplay 事件触发时尝试一次（并设置 navigationLock）
        if (videoPlayer.readyState >= 3) {
            // 稳定播放时解除 navigationLock（防止旧锁一直存在）
            navigationLock = false;
            console.log('attachListenersTo: readyState 已足够，尝试恢复播放');
            forcePlayVideo(videoPlayer).catch(()=>{});
        } else {
            console.log('attachListenersTo: 等待 canplay 事件再恢复播放');
            const handler = () => {
                console.log('video canplay 触发，尝试恢复播放并解除导航锁');
                navigationLock = false;
                forcePlayVideo(videoPlayer).catch(()=>{});
                try { videoPlayer.removeEventListener('canplay', handler); } catch(_) {}
            };
            videoPlayer.__onCanPlayHandler = handler;
            try { videoPlayer.addEventListener('canplay', handler); } catch(_) {}
        }
    }

    /**
     * 监视 DOM 中的 video 新增/替换，并绑定监听器
     */
    function setupVideoMutationObserver() {
        if (!document.body) {
            setTimeout(setupVideoMutationObserver, 200);
            return;
        }
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    let found = null;
                    try {
                        if (node.matches && node.matches(VIDEO_SELECTOR)) found = node;
                        else if (node.querySelector) found = node.querySelector(VIDEO_SELECTOR);
                    } catch(e) {}
                    if (found) {
                        console.log('MutationObserver: 发现新的 video 元素，绑定并等待 canplay...');
                        attachListenersTo(found);
                        return;
                    }
                }
                // 如果属性变化导致原有 video 可见性变更，也尝试绑定
                if (m.type === 'attributes' && m.target instanceof HTMLElement) {
                    try {
                        if (m.target.matches && m.target.matches(VIDEO_SELECTOR)) {
                            attachListenersTo(m.target);
                        }
                    } catch(e) {}
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
        console.log('setupVideoMutationObserver: 已启动');
    }

    /**
     * 监听用户手动点击目录（若用户主动点击下一个视频，设置 navigationLock 防止瞬间循环）
     * 使用 capture = true 以尽早拦截 click
     */
    function setupUserNavListener() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!target) return;
            // 匹配当前或父节点为目录项
            if (target.matches && (target.matches(ALL_ITEMS_SELECTOR) || (target.closest && target.closest(ALL_ITEMS_SELECTOR)))) {
                console.log('用户点击了目录项，设置 navigationLock（避免加载阶段触发自动恢复）');
                setNavigationLock(5000);
            }
        }, true);
    }

    /**
     * 防“走神”弹窗观察器
     */
    function setupModalObserver() {
        if (!document.body) {
            setTimeout(setupModalObserver, 100);
            return;
        }
        console.log('启动防走神弹窗监视器...');
        const modalObserver = new MutationObserver(() => {
            const alertModal = document.querySelector(MODAL_SELECTOR);
            if (alertModal) {
                const resumeButton = alertModal.querySelector(RESUME_BUTTON_SELECTOR);
                if (resumeButton) {
                    const suspendContent = alertModal.querySelector('div[data-bind*="modalType() == \'suspend\'"]');
                    if (suspendContent) {
                        console.log('检测到“走神弹窗”，自动点击 Resume...');
                        try { resumeButton.click(); } catch(e) { console.warn('resume click failed', e); }
                        setTimeout(() => { forcePlayVideo().catch(()=>{}); }, 100);
                    }
                }
            }
        });
        modalObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    /**
     * 轮询查找现有播放器并绑定（保留）
     */
    function startPollingForVideo() {
        console.log('startPollingForVideo: 查找视频播放器（初始）...');
        const videoPoller = setInterval(() => {
            const videoPlayer = document.querySelector(VIDEO_SELECTOR);
            if (videoPlayer) {
                clearInterval(videoPoller);
                console.log('startPollingForVideo: 找到播放器，绑定并等待 canplay');
                attachListenersTo(videoPlayer);

                // 若有覆盖层尝试点击（不会直接强制恢复）
                const playOverlayButton = document.querySelector(OVERLAY_BUTTON_SELECTOR);
                if (playOverlayButton && playOverlayButton.offsetParent != null) {
                    try { playOverlayButton.click(); } catch(e){ console.warn('overlay click failed', e); }
                } else {
                    // 若已准备好则尝试播放（attachListenersTo 已处理 canplay 情况）
                    if (videoPlayer.readyState >= 3) {
                        forcePlayVideo(videoPlayer).catch(()=>{});
                    }
                }
            }
        }, POLL_INTERVAL);

        setupVideoMutationObserver();
    }

    function startMainLogic() {
        setupUserNavListener();
        startPollingForVideo();
        setupModalObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMainLogic);
    } else {
        startMainLogic();
    }
})();
