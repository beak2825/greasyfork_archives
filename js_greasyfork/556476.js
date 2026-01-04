// ==UserScript==
// @name         快手直播自动网页全屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快手网页全屏，右侧有开关按钮
// @author       人人有余呀
// @match        https://live.kuaishou.com/*
// @grant        none
// @license      MIT
// @icon         https://s2-11673.kwimgs.com/udata/pkg/fe/favicon.70ff1fcc.ico
// @downloadURL https://update.greasyfork.org/scripts/556476/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/556476/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------------------------- 状态管理 ---------------------------- */
    const STORAGE_KEY = "KS_FULLSCREEN_ENABLED";
    let fullscreenEnabled = localStorage.getItem(STORAGE_KEY) === "1";

    /* ---------------------------- 常量 ---------------------------- */
    const CSS_ID = 'ks-force-swiper-fullscreen-style';
    const TARGET_SELECTOR = '.swiper-wrapper';
    const SLIDE_SELECTOR = '.swiper-slide-active';
    const PLAYER_SELECTOR = '.player-wrapper.relative';
    const FULLSCREEN_CONTAINER_SELECTOR = '.room.flex-1.flex.relative.of-h';
    const NEW_PLAYER_CLASSES = 'flex-col w-100vw h-100vh live-room';
    const POLL_INTERVAL_MS = 800;
    const OBSERVE_ATTRS = true;

    const REMOVE_SELECTORS = [
        '.header-placeholder',
        '.foot',
        '.top.justify-between.flex.items-center',
        '.control-wrapper.absolute',
        'header'
    ];

    /* ---------------------------- 工具函数 ---------------------------- */

    function removeUINodes() {
        REMOVE_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(n => n.remove());
        });
    }

    function injectCss() {
        if (document.getElementById(CSS_ID)) return;
        const style = document.createElement('style');
        style.id = CSS_ID;
        style.textContent = `
            ${TARGET_SELECTOR} {
                width: 100% !important;
                height: 100% !important;
                max-width: none !important;
                max-height: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function forceContainerFullScreen() {
        const container = document.querySelector(FULLSCREEN_CONTAINER_SELECTOR);
        if (container) {
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.zIndex = '9999';
            container.style.pointerEvents = 'none';
        }
    }

    function restoreContainer() {
        const container = document.querySelector(FULLSCREEN_CONTAINER_SELECTOR);
        if (container) container.removeAttribute("style");
    }

    function forceSlideSize(slideEl) {
        if (!slideEl) return;
        slideEl.style.setProperty('width', window.innerWidth + 'px', 'important');
        slideEl.style.setProperty('height', window.innerHeight + 'px', 'important');
        slideEl.style.setProperty('max-width', 'none', 'important');
        slideEl.style.setProperty('max-height', 'none', 'important');
    }

    function observeElement(el) {
        if (!el) return null;
        const obs = new MutationObserver(() => {
            el.style.setProperty('width', '100%', 'important');
            el.style.setProperty('height', '100%', 'important');
        });
        obs.observe(el, { attributes: OBSERVE_ATTRS, attributeFilter: ['style', 'class'] });
        return obs;
    }

    /* ---------------------------- 音量条动态显示 ---------------------------- */

    function setupVolumeBarDynamic() {
        const containerSelector = FULLSCREEN_CONTAINER_SELECTOR;
        const barSelector = '.bar-wrap';

        const obs = new MutationObserver(() => {
            const container = document.querySelector(containerSelector);
            const barWrap = document.querySelector(barSelector);
            if (container && barWrap && !barWrap.dataset.binded) {
                barWrap.dataset.binded = '1';

                barWrap.style.transition = 'bottom 0.3s';
                barWrap.style.bottom = '-42px';

                container.addEventListener('mouseenter', () => {
                    barWrap.style.bottom = '0px';
                });
                container.addEventListener('mouseleave', () => {
                    barWrap.style.bottom = '-42px';
                });
            }
        });

        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    /* ---------------------------- 全屏核心逻辑（启用时执行） ---------------------------- */

    function enableFullscreen() {
        localStorage.setItem(STORAGE_KEY, "1");

        injectCss();

        const existing = document.querySelector(TARGET_SELECTOR);
        if (existing) observeElement(existing);

        const player = document.querySelector(PLAYER_SELECTOR);
        if (player) player.className = NEW_PLAYER_CLASSES;

        forceContainerFullScreen();
        removeUINodes();

        const firstSlide = document.querySelector(SLIDE_SELECTOR);
        if (firstSlide) forceSlideSize(firstSlide);

        setupVolumeBarDynamic();

        startPolling();
    }

    /* ---------------------------- 停用恢复 ---------------------------- */

    function disableFullscreen() {
        localStorage.setItem(STORAGE_KEY, "0");

        // 恢复容器
        restoreContainer();

        // 恢复 slide
        const slide = document.querySelector(SLIDE_SELECTOR);
        if (slide) slide.removeAttribute("style");

        // 恢复 player
        const player = document.querySelector(PLAYER_SELECTOR);
        if (player) player.removeAttribute("class");

        // 清理样式
        const css = document.getElementById(CSS_ID);
        if (css) css.remove();
    }

    /* ---------------------------- 轮询辅助（执行状态时） ---------------------------- */

    function startPolling() {
        const timer = setInterval(() => {
            if (!fullscreenEnabled) return clearInterval(timer);

            const wrapper = document.querySelector(TARGET_SELECTOR);
            if (wrapper) {
                wrapper.style.setProperty('width', '100%', 'important');
                wrapper.style.setProperty('height', '100%', 'important');
            }

            const slide = document.querySelector(SLIDE_SELECTOR);
            if (slide) forceSlideSize(slide);

            removeUINodes();
        }, POLL_INTERVAL_MS);
    }

    /* ---------------------------- 按钮 ---------------------------- */

    function createToggleButton() {
        const btn = document.createElement("div");
        btn.textContent = fullscreenEnabled ? "全屏[开]" : "全屏[关]";

        Object.assign(btn.style, {
            position: "fixed",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            border: "1px solid rgba(255, 77, 79, 0.8)",
            boxShadow: "0 2px 12px rgba(255, 77, 79, 0.4)",
            padding: "10px 16px",
            borderRadius: "8px",
            zIndex: 999999,
            cursor: "pointer",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "bold",
            userSelect: "none",
        });

        btn.onclick = () => {
            fullscreenEnabled = !fullscreenEnabled;
            btn.textContent = fullscreenEnabled ? "全屏：开" : "全屏：关";

            if (fullscreenEnabled) {
                enableFullscreen();
            } else {
                disableFullscreen();
                window.location.href = window.location.href;
            }
        };

        document.body.appendChild(btn);
    }

    /* ---------------------------- 入口 ---------------------------- */

    function start() {
        createToggleButton();

        if (fullscreenEnabled) {
            enableFullscreen();
        }

        window.addEventListener("resize", () => {
            if (!fullscreenEnabled) return;
            const slide = document.querySelector(SLIDE_SELECTOR);
            if (slide) forceSlideSize(slide);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

})();
