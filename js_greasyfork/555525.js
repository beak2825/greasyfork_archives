// ==UserScript==
// @name         动画疯弹幕字体自定义 + 长按方向右键倍速播放
// @namespace    ani.gamer.com.tw.danmufontdefine.longpressboost
// @version      1.3
// @description  自定义动画疯弹幕字体，并增加长按方向右键倍速播放功能
// @author       atSeiunSky
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @match        https://ani.gamer.com.tw/playerVideo.php?sn=*
// @icon         https://ani.gamer.com.tw/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555525/%E5%8A%A8%E7%94%BB%E7%96%AF%E5%BC%B9%E5%B9%95%E5%AD%97%E4%BD%93%E8%87%AA%E5%AE%9A%E4%B9%89%20%2B%20%E9%95%BF%E6%8C%89%E6%96%B9%E5%90%91%E5%8F%B3%E9%94%AE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555525/%E5%8A%A8%E7%94%BB%E7%96%AF%E5%BC%B9%E5%B9%95%E5%AD%97%E4%BD%93%E8%87%AA%E5%AE%9A%E4%B9%89%20%2B%20%E9%95%BF%E6%8C%89%E6%96%B9%E5%90%91%E5%8F%B3%E9%94%AE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tmDanmakuFontFamily';
    const SPEED_STORAGE_KEY = 'tmPlaybackBoostRate';
    const SAMPLE_FONT = '"Noto Sans SC","PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif';
    const DANMU_SELECTOR = '.danmu-warp .danmu';
    const POLL_INTERVAL = 1200;
    const BOOST_DEFAULT_RATE = 2;
    const LONG_PRESS_DELAY = 220;
    const SYNTHETIC_EVENT_FLAG = '__tmArrowRightSynthetic';

    const parseBoostRate = (value) => {
        const numeric = typeof value === 'number' ? value : parseFloat(value);
        if (!Number.isFinite(numeric) || numeric <= 0) return BOOST_DEFAULT_RATE;
        return Math.min(16, numeric);
    };

    const loadBoostRate = () => parseBoostRate(GM_getValue(SPEED_STORAGE_KEY, BOOST_DEFAULT_RATE));
    const now = () => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now());

    let currentFont = GM_getValue(STORAGE_KEY, '');
    let danmuObserver = null;
    let observedRoot = null;
    let openPanel = () => console.warn('[DanmuFont] 面板尚未加载完成');
    let boostRate = loadBoostRate();
    let boostActive = false;
    let boostTargetVideo = null;
    let arrowRightPressed = false;
    let arrowRightTimer = null;
    let arrowRightEventTarget = null;
    const boostContext = { video: null, previousRate: 1 };

    const ready = (cb) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', cb, { once: true });
        } else {
            cb();
        }
    };

    const swallowEvent = (event) => {
        if (!event) return;
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') {
            event.stopImmediatePropagation();
        }
    };

    const getActiveVideo = () => {
        const pipVideo = document.pictureInPictureElement;
        if (pipVideo instanceof HTMLVideoElement) return pipVideo;
        const videos = Array.from(document.querySelectorAll('video'));
        if (!videos.length) return null;
        const playing = videos.find((video) => !video.paused && !video.ended);
        return playing || videos[0];
    };

    const isArrowRightEvent = (event) => {
        if (!event) return false;
        if (event[SYNTHETIC_EVENT_FLAG]) return false;
        return event.key === 'ArrowRight' || event.code === 'ArrowRight' || event.keyCode === 39;
    };

    const markSynthetic = (event) => {
        try {
            Object.defineProperty(event, SYNTHETIC_EVENT_FLAG, { value: true });
        } catch (error) {
            event[SYNTHETIC_EVENT_FLAG] = true;
        }
        try {
            if (event.keyCode !== 39) {
                Object.defineProperty(event, 'keyCode', { get: () => 39 });
            }
            if (event.which !== 39) {
                Object.defineProperty(event, 'which', { get: () => 39 });
            }
        } catch (_) {
            // ignore
        }
    };

    const createSyntheticArrowEvent = (type) => {
        const synthetic = new KeyboardEvent(type, {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true,
        });
        markSynthetic(synthetic);
        return synthetic;
    };

    const dispatchNativeArrowRight = (preferredTarget) => {
        const target = preferredTarget || document.activeElement || document.body || document;
        if (!target || typeof target.dispatchEvent !== 'function') return;
        const keydown = createSyntheticArrowEvent('keydown');
        const keyup = createSyntheticArrowEvent('keyup');
        target.dispatchEvent(keydown);
        target.dispatchEvent(keyup);
    };

    const activateBoost = (preferredVideo) => {
        const video = preferredVideo || document.querySelector('video');
        if (!video) return false;
        boostContext.video = video;
        boostContext.previousRate = video.playbackRate || 1;
        boostActive = true;
        video.playbackRate = boostRate;
        console.info(`[DanmuBoost] 临时倍速 x${boostRate}`);
        return true;
    };

    const deactivateBoost = () => {
        if (!boostActive) {
            boostTargetVideo = null;
            return;
        }
        const { video, previousRate } = boostContext;
        if (video) {
            video.playbackRate = previousRate || 1;
        }
        boostContext.video = null;
        boostContext.previousRate = 1;
        boostActive = false;
        boostTargetVideo = null;
    };

    const clearArrowRightTimer = () => {
        if (arrowRightTimer) {
            window.clearTimeout(arrowRightTimer);
            arrowRightTimer = null;
        }
    };

    const cancelBoostFlow = () => {
        boostTargetVideo = null;
        arrowRightPressed = false;
        arrowRightEventTarget = null;
        clearArrowRightTimer();
        deactivateBoost();
    };

    const handleArrowRightKeyDown = (event) => {
        if (event[SYNTHETIC_EVENT_FLAG]) return;
        if (!isArrowRightEvent(event)) return;
        const video = getActiveVideo();
        if (!video) return;
        swallowEvent(event);
        if (!arrowRightPressed) {
            arrowRightPressed = true;
            boostTargetVideo = video;
            arrowRightEventTarget = event.target || document.activeElement || document.body || document;
            clearArrowRightTimer();
            arrowRightTimer = window.setTimeout(() => {
                arrowRightTimer = null;
                if (!arrowRightPressed) return;
                activateBoost(boostTargetVideo);
            }, LONG_PRESS_DELAY);
        }
    };

    const handleArrowRightKeyUp = (event) => {
        if (event[SYNTHETIC_EVENT_FLAG]) return;
        if (!isArrowRightEvent(event)) return;
        if (!arrowRightPressed && !boostActive) return;
        swallowEvent(event);
        const wasPressed = arrowRightPressed;
        arrowRightPressed = false;
        clearArrowRightTimer();
        const wasBoosting = boostActive;
        if (boostActive) {
            deactivateBoost();
        }
        if (wasBoosting) {
            boostTargetVideo = null;
            arrowRightEventTarget = null;
            return;
        }
        if (!wasPressed) {
            arrowRightEventTarget = null;
            boostTargetVideo = null;
            return;
        }
        boostTargetVideo = null;
        const dispatchTarget = arrowRightEventTarget;
        arrowRightEventTarget = null;
        dispatchNativeArrowRight(dispatchTarget);
    };

    const promptBoostRate = () => {
        const input = window.prompt('请输入长按方向键 → 时希望使用的临时倍速（> 0）', String(boostRate));
        if (input === null) return;
        const trimmed = input.trim();
        if (!trimmed) {
            window.alert('请输入有效数字，例如 1.5 或 2');
            return;
        }
        const numeric = parseFloat(trimmed);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            window.alert('请输入大于 0 的数字，例如 1.5 或 2');
            return;
        }
        boostRate = parseBoostRate(numeric);
        GM_setValue(SPEED_STORAGE_KEY, boostRate);
        console.info(`[DanmuBoost] 长按倍速已保存为 x${boostRate}`);
    };

    const initBoostHotkeys = () => {
        document.addEventListener('keydown', handleArrowRightKeyDown, true);
        document.addEventListener('keyup', handleArrowRightKeyUp, true);
        window.addEventListener('blur', cancelBoostFlow, true);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelBoostFlow();
            }
        });
    };

    const normalizeFontValue = (value) => {
        if (!value) return '';
        const trimmed = value.trim();
        if (!trimmed || trimmed.toLowerCase() === 'inherit') return '';
        return trimmed.replace(/\s*,\s*/g, ', ').replace(/\s+/g, ' ');
    };

    const applyFontToNode = (node) => {
        if (!node || node.nodeType !== 1) return;
        if (!currentFont) {
            node.style.removeProperty('font-family');
            node.style.removeProperty('text-rendering');
            node.style.removeProperty('font-kerning');
            node.removeAttribute('data-tm-font');
            return;
        }
        node.style.fontFamily = currentFont;
        node.style.textRendering = 'optimizeSpeed';
        node.style.fontKerning = 'none';
        node.dataset.tmFont = currentFont;
    };

    const repaintAll = () => {
        document.querySelectorAll(DANMU_SELECTOR).forEach(applyFontToNode);
    };

    const handleDanmuMutations = (mutations) => {
        if (!currentFont) return;
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;
                if (node.classList.contains('danmu')) {
                    applyFontToNode(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('.danmu').forEach(applyFontToNode);
                }
            });
        }
    };

    const ensureDanmuObserver = () => {
        const root = document.querySelector('.danmu-warp');
        if (root === observedRoot) return;
        if (danmuObserver) {
            danmuObserver.disconnect();
            danmuObserver = null;
        }
        observedRoot = root;
        if (!root) return;
        danmuObserver = new MutationObserver(handleDanmuMutations);
        danmuObserver.observe(root, { childList: true, subtree: true });
        repaintAll();
    };

    const pollDanmuRoot = () => {
        ensureDanmuObserver();
        window.setTimeout(pollDanmuRoot, POLL_INTERVAL);
    };

    const updateFont = (value) => {
        currentFont = normalizeFontValue(value);
        GM_setValue(STORAGE_KEY, currentFont);
        repaintAll();
        console.info('[DanmuFont] 已套用', currentFont || '站内默认字体');
    };

    const injectStyle = (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const buildPanel = () => {
        injectStyle(`
            .tm-danmu-font-panel {
                position: fixed;
                top: 72px;
                right: 24px;
                width: 320px;
                max-width: calc(100vw - 32px);
                padding: 16px;
                border-radius: 12px;
                background: rgba(18, 18, 24, 0.95);
                color: #fff;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
                font-family: "PingFang TC","Microsoft JhengHei",sans-serif;
                z-index: 2147483647;
                display: none;
                flex-direction: column;
                gap: 12px;
            }
            .tm-danmu-font-panel.is-open { display: flex; }
            .tm-danmu-font-panel__title { font-size: 16px; font-weight: 600; }
            .tm-danmu-font-panel input {
                width: 100%;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                background: rgba(0, 0, 0, 0.35);
                color: #fff;
                font-size: 13px;
            }
            .tm-danmu-font-panel__hint {
                font-size: 12px;
                line-height: 1.4;
                color: rgba(255, 255, 255, 0.65);
                margin: 0;
            }
            .tm-danmu-font-panel__actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
                flex-wrap: wrap;
            }
            .tm-danmu-font-panel button {
                border: none;
                border-radius: 6px;
                padding: 6px 12px;
                font-size: 13px;
                cursor: pointer;
            }
            .tm-danmu-font-panel button[data-variant="ghost"] {
                background: transparent;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .tm-danmu-font-panel button[data-variant="primary"] {
                background: #ffb347;
                color: #1d1d1d;
                font-weight: 600;
            }
        `);

        const panel = document.createElement('div');
        panel.className = 'tm-danmu-font-panel';
        panel.innerHTML = `
            <div class="tm-danmu-font-panel__title">自订弹幕字体</div>
            <input type="text" placeholder='${SAMPLE_FONT}'>
            <p class="tm-danmu-font-panel__hint">
                可输入多个字体并用英文逗号分隔；例如："LXGW WenKai","Noto Sans SC",sans-serif
            </p>
            <div class="tm-danmu-font-panel__actions">
                <button type="button" data-action="sample" data-variant="ghost">填入示例</button>
                <button type="button" data-action="reset" data-variant="ghost">恢复默认</button>
                <button type="button" data-action="close" data-variant="ghost">取消</button>
                <button type="button" data-action="apply" data-variant="primary">套用</button>
            </div>
        `;
        document.body.appendChild(panel);

        const input = panel.querySelector('input');
        const closePanel = () => panel.classList.remove('is-open');

        openPanel = () => {
            panel.classList.add('is-open');
            input.value = currentFont || '';
            requestAnimationFrame(() => input.focus({ preventScroll: true }));
        };

        panel.addEventListener('click', (event) => {
            const button = event.target;
            if (!button || !button.dataset) return;
            const action = button.dataset.action;
            if (action === 'apply') {
                updateFont(input.value);
                closePanel();
            } else if (action === 'reset') {
                updateFont('');
                closePanel();
            } else if (action === 'close') {
                closePanel();
            } else if (action === 'sample') {
                input.value = SAMPLE_FONT;
                input.focus();
                input.select();
            }
        });

        panel.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closePanel();
            } else if (event.key === 'Enter' && event.target === input) {
                event.preventDefault();
                updateFont(input.value);
                closePanel();
            }
        });
    };

    ready(() => {
        buildPanel();
        repaintAll();
        pollDanmuRoot();
        initBoostHotkeys();
        GM_registerMenuCommand('设置弹幕字体…', () => openPanel());
        GM_registerMenuCommand('恢复站内字体', () => updateFont(''));
        GM_registerMenuCommand('套用示例字体栈', () => updateFont(SAMPLE_FONT));
        GM_registerMenuCommand('设置方向键长按倍速…', () => promptBoostRate());
    });
})();
