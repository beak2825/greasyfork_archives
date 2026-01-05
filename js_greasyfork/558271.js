// ==UserScript==
// @name         MissAV体验增强脚本 (静音图标修复版)(个人自用)
// @namespace    http://tampermonkey.net/
// @version      2.5_20251208
// @description  修复了静音按钮图标与实际状态相反的问题，并融合了广告过滤、自动展开简介等功能。
// @author       iSwfe, mrhydra, etc. (Merged & Fixed by Gemini)
// @match        https://missav.com/*
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @match        *://*.missav.com/*
// @match        *://*.missav.ws/*
// @match        *://*.missav.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558271/MissAV%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20%28%E9%9D%99%E9%9F%B3%E5%9B%BE%E6%A0%87%E4%BF%AE%E5%A4%8D%E7%89%88%29%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558271/MissAV%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20%28%E9%9D%99%E9%9F%B3%E5%9B%BE%E6%A0%87%E4%BF%AE%E5%A4%8D%E7%89%88%29%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // --- 功能开关与配置 ---
    const viewportFitCover = false;
    const buttonMargin = '.1rem';
    const htmlPlay = '▶️';
    const htmlPause = '⏸️';
    // **【修复】** 更改了静音按钮的文字，使其描述当前状态而非操作
    const htmlMuted = '🔇 已静音';
    const htmlUnmuted = '🔈 声音开启';
    const durationBtnEnable = true;
    const maxDuration = 60 * 5; // 快进/快退时间 (秒)

    // --- 功能 8: 更优的标题显示方式 ---
    GM_addStyle('div.my-2.text-sm.text-nord4.truncate, h2.truncate { white-space: normal !important; }');


    // --- 核心功能实现 ---

    function throttle(fn, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return fn(...args);
        }
    }

    // 1. 页面通用清理与优化
    function cleanupAndOptimizePage() {
        const origin = window.location.origin;
        document.querySelectorAll('div.flex-1.min-w-0 h2').forEach(h2 => {
            if (!h2.querySelector('a')) {
                const text = h2.innerText;
                const link = document.createElement('a');
                link.href = `\({origin}/genres/\){text}`;
                link.innerText = text;
                h2.innerHTML = '';
                h2.appendChild(link);
            }
        });

        // --- 功能 7: 更强的广告过滤规则 ---
        const adSelectors = [
            'div[class^="root-"]', 'div[class*="fixed"][class*="right-"][class*="bottom-"]',
            'div[class*="pt-"][class*="pb-"][class*="px-"]:not([class*="sm:"])',
            'div[class*="lg:hidden"]', 'div[class*="lg:block"]', 'div.ts-outstream-video',
            'iframe', 'ul.mb-4.list-none.text-nord14', '.prose', 'img[alt="MissAV takeover Fanza"]'
        ];
        document.querySelectorAll(adSelectors.join(', ')).forEach(el => {
            if (!el.querySelector('#sprite-plyr') && !el.closest('.sm\\:container')) {
                 el.remove();
            }
        });
    }

    // 2. 视频播放器增强
    function enhanceVideoPlayer() {
        const sitePlayer = unsafeWindow.player;
        if (!sitePlayer) return;

        console.log("【视频控制条增强】开始...");

        const videoContainer = document.querySelector("body > div:nth-child(3) > div.sm\\:container > div > div.flex-1.order-first > div:first-child");
        if (!videoContainer || videoContainer.dataset.enhanced) return;
        videoContainer.dataset.enhanced = 'true';

        // --- 功能 6: 自动点击“显示更多” ---
        const showMore = document.querySelector('a.text-nord13.font-medium.flex.items-center');
        if (showMore) {
            showMore.click();
            console.log("【增强功能】已自动点击“显示更多”。");
        }

        const videoDiv = videoContainer.querySelector("div:first-child");
        videoDiv.id = 'video';

        const adClickLayer = document.querySelector("#video > div[wire\\:id]");
        if (adClickLayer && !adClickLayer.dataset.enhanced) {
            const newLayer = adClickLayer.cloneNode(true);
            adClickLayer.parentNode.replaceChild(newLayer, adClickLayer);
            newLayer.style.cursor = 'pointer';
            newLayer.onclick = () => sitePlayer.togglePlay();
            newLayer.dataset.enhanced = 'true';
        }

        const bar = videoDiv.nextElementSibling;
        if (!bar || bar.dataset.enhanced) return;
        bar.dataset.enhanced = 'true';

        bar.classList.remove('sm:hidden');
        bar.classList.value = 'flex -mx-4 sm:m-0 mt-1 bg-black justify-center items-center';

        const customButtonsSpan = document.createElement("span");
        customButtonsSpan.className = 'isolate inline-flex rounded-md shadow-sm';
        customButtonsSpan.style.margin = `0 ${buttonMargin}`;

        const btnPlay = document.createElement('button');
        btnPlay.id = 'btnPlay';
        btnPlay.type = 'button';
        btnPlay.className = 'relative -ml-px inline-flex items-center rounded-md bg-transparent px-2 py-2 font-medium text-white ring-1 ring-inset ring-white hover:bg-primary focus:z-10';
        btnPlay.innerHTML = sitePlayer.paused ? htmlPlay : htmlPause;
        btnPlay.onclick = () => sitePlayer.togglePlay();
        customButtonsSpan.appendChild(btnPlay);

        sitePlayer.on('play', () => { if(document.querySelector("#btnPlay")) document.querySelector("#btnPlay").innerHTML = htmlPause; });
        sitePlayer.on('pause', () => { if(document.querySelector("#btnPlay")) document.querySelector("#btnPlay").innerHTML = htmlPlay; });

        bar.insertBefore(customButtonsSpan, bar.lastElementChild);

        if (durationBtnEnable) {
            const leftBtn = bar.querySelector("span:first-child > button:first-child");
            const rightBtn = bar.querySelector("span:last-child > button:last-child");
            if (leftBtn && rightBtn) {
                leftBtn.removeAttribute('@click.prevent');
                leftBtn.onclick = () => { sitePlayer.currentTime -= maxDuration };
                leftBtn.innerHTML = leftBtn.innerHTML.replace(/\d+m/g, '5m');

                rightBtn.removeAttribute('@click.prevent');
                rightBtn.onclick = () => { sitePlayer.currentTime += maxDuration };
                rightBtn.innerHTML = rightBtn.innerHTML.replace(/\d+m/g, '5m');
            }
        }

        const loopSection = bar.nextElementSibling;
        if (loopSection) {
            const loopButtonContainer = loopSection.querySelector('.sm\\:ml-6');
            if (loopButtonContainer) {
                loopButtonContainer.innerHTML = '';

                const btnMute = document.createElement('button');
                btnMute.id = 'btnMute';
                btnMute.type = 'button';
                btnMute.className = 'inline-flex items-center whitespace-nowrap px-2.5 py-1.5 border text-xs font-medium rounded shadow-sm text-white transition-colors duration-150';

                // **【修复】** 反转了这里的逻辑，使图标反映当前状态
                const updateMuteButton = () => {
                    if (sitePlayer.muted || sitePlayer.volume === 0) {
                        // 当前是静音状态，显示“已静音”
                        btnMute.innerHTML = htmlMuted;
                        btnMute.classList.add('bg-primary', 'border-transparent');
                        btnMute.classList.remove('border-white');
                    } else {
                        // 当前是开启声音状态，显示“声音开启”
                        btnMute.innerHTML = htmlUnmuted;
                        btnMute.classList.remove('bg-primary', 'border-transparent');
                        btnMute.classList.add('border-white');
                    }
                };

                btnMute.onclick = (e) => {
                    e.preventDefault();
                    sitePlayer.muted = !sitePlayer.muted;
                };

                sitePlayer.on('volumechange', updateMuteButton);
                loopButtonContainer.appendChild(btnMute);
                updateMuteButton(); // 初始化
            }
        }

        if (!window.blurPauseAttached) {
             window.addEventListener('blur', () => {
                if (unsafeWindow.player && !unsafeWindow.player.paused) {
                    unsafeWindow.player.pause();
                }
            });
            window.blurPauseAttached = true;
        }

        console.log("【视频控制条增强】完成。");
    }

    // --- 初始化与执行 ---

    try {
        Object.defineProperty(unsafeWindow, 'open', { value: () => null, writable: false, configurable: false });
    } catch (e) {
        document.addEventListener('click', () => { unsafeWindow.open = () => null; }, true);
    }

    if (document.head) {
        let metaTheme = document.querySelector("meta[name=theme-color]") || document.createElement("meta");
        metaTheme.name = "theme-color";
        metaTheme.content = "#090811";
        if (!metaTheme.parentNode) document.head.appendChild(metaTheme);

        if (viewportFitCover) {
            let viewport = document.querySelector("head > meta[name=viewport]");
            if (viewport) viewport.content = "width-device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
        }
    }

    const observer = new MutationObserver(throttle(cleanupAndOptimizePage, 500));
    const bodyObserver = new MutationObserver((mutations, obs) => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            cleanupAndOptimizePage();
            obs.disconnect();
        }
    });
    bodyObserver.observe(document.documentElement, { childList: true });

    const playerCheckInterval = setInterval(() => {
        if (typeof unsafeWindow.player?.on === 'function') {
            enhanceVideoPlayer();
        }
    }, 500);

    setTimeout(() => clearInterval(playerCheckInterval), 20 * 1000);

})();