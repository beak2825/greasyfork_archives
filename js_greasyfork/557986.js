// ==UserScript==
// @name         抖音优化: 强制最高画质+自动跳过 (直播/广告/购物)
// @namespace    http://tampermonkey.net/
// @version      6.3.2
// @description  V6.3.2修正版：移除“详情”关键词防止误杀侧边栏UI，收缩检测区域至屏幕左侧2/3。
// @author       You
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @grant        none
// @run-at       document-idle
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/557986/%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96%3A%20%E5%BC%BA%E5%88%B6%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%20%28%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%E8%B4%AD%E7%89%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557986/%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96%3A%20%E5%BC%BA%E5%88%B6%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%20%28%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%E8%B4%AD%E7%89%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    //                全局配置参数
    // ==========================================
    const MAIN_INTERVAL = 800;       // 检测频率
    const SKIP_COOLDOWN = 1500;      // 跳过后的冷却时间
    const QUALITIES = ["超清 4K", "超清 2K", "高清 1080P"]; // 画质优先级

    // ==========================================
    //                全局状态变量
    // ==========================================
    let isSkipping = false;
    let lastVideoSrc = "";
    let isQualityChecked = false;

    const config = {
        live: localStorage.getItem('dy_skip_live') !== 'false',
        ad:   localStorage.getItem('dy_skip_ad')   !== 'false',
        shop: localStorage.getItem('dy_skip_shop') === 'true'
    };

    const savedPos = {
        top: localStorage.getItem('dy_panel_top'),
        left: localStorage.getItem('dy_panel_left')
    };

    // ==========================================
    //            工具函数库
    // ==========================================
    function simulateKeyDown() {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40,
            bubbles: true, cancelable: true
        });
        document.dispatchEvent(event);
        console.log('【抖音助手】执行跳过');
    }

    function executeSkip() {
        isSkipping = true;
        simulateKeyDown();
        setTimeout(() => { isSkipping = false; }, SKIP_COOLDOWN);
    }

    // 【关键修改1】可视检测区域收缩
    // 侧边栏通常在屏幕右侧。将检测宽度限制在 66% (windowWidth * 0.66)
    // 这样侧边栏里的任何按钮都会因为位置太靠右而被物理忽略。
    function isElementInViewport(el) {
        if (!el || !el.getBoundingClientRect) return false;
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        return (rect.top >= 0 && rect.bottom <= windowHeight) &&
               (rect.left < windowWidth * 0.66) && // 只检测屏幕左侧2/3区域
               (rect.width > 10 && rect.height > 10);
    }

    function showToast(text) {
        const existing = document.getElementById('dy-helper-toast');
        if(existing) existing.remove();
        const div = document.createElement('div');
        div.id = 'dy-helper-toast';
        div.innerText = text;
        div.style.cssText = `
            position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.85); color: #fff; padding: 10px 20px;
            border-radius: 50px; z-index: 100000; font-size: 14px; pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4); transition: opacity 0.3s; font-weight: bold;
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(div);
        setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 1500);
    }

    function triggerPointerEvent(element, eventType) {
        if (!element) return;
        element.dispatchEvent(new PointerEvent(eventType, {
            bubbles: true, cancelable: true, view: window,
            pointerId: 1, width: 1, height: 1, isPrimary: true, pointerType: 'mouse'
        }));
    }

    function findResolutionButton() {
        const keywords = ["智能", "标清", "高清", "超清", "4K", "1080P", "720P"];
        const tags = ['span', 'div'];
        for (let tag of tags) {
            const els = document.getElementsByTagName(tag);
            for (let i = els.length - 1; i >= 0; i--) {
                const el = els[i];
                if (!el.innerText) continue;
                const txt = el.innerText.trim();
                if (keywords.some(k => txt.includes(k))) {
                    if (el.clientHeight > 10 && el.clientHeight < 50 && el.clientWidth < 150) {
                        return el;
                    }
                }
            }
        }
        return null;
    }

    function initUI() {
        const container = document.createElement('div');
        const initialStyle = (savedPos.top && savedPos.left) ? `top: ${savedPos.top}; left: ${savedPos.left};` : `top: 100px; right: 20px;`;

        container.style.cssText = `
            position: fixed; ${initialStyle} z-index: 999999;
            display: flex; flex-direction: column; gap: 6px;
            padding: 10px 12px; border-radius: 12px; cursor: move;
            background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.15); width: 140px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4); transition: opacity 0.3s;
            user-select: none; font-family: system-ui, -apple-system, sans-serif;
        `;

        container.onmouseenter = () => container.style.opacity = '1';
        container.onmouseleave = () => container.style.opacity = '0.6';
        container.style.opacity = '0.6';

        function createSwitch(label, key, icon) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; white-space: nowrap;';
            const txt = document.createElement('span');
            txt.innerHTML = `<span style="margin-right:4px; font-size: 14px;">${icon}</span>${label}`;
            txt.style.cssText = 'color: #fff; font-size: 13px; font-weight: 500;';
            const switchWrap = document.createElement('div');
            const isActive = config[key];
            switchWrap.style.cssText = `
                width: 32px; height: 18px; background: ${isActive ? '#00E676' : '#666'};
                border-radius: 10px; position: relative; cursor: pointer; transition: background 0.3s; flex-shrink: 0;
            `;
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 14px; height: 14px; background: white; border-radius: 50%;
                position: absolute; top: 2px; left: ${isActive ? '16px' : '2px'};
                transition: left 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.3);
            `;
            switchWrap.appendChild(dot);
            switchWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                config[key] = !config[key];
                localStorage.setItem(`dy_skip_${key}`, config[key]);
                switchWrap.style.background = config[key] ? '#00E676' : '#666';
                dot.style.left = config[key] ? '16px' : '2px';
                showToast(`${label}跳过: ${config[key] ? '开启' : '关闭'}`);
            });
            row.appendChild(txt);
            row.appendChild(switchWrap);
            container.appendChild(row);
        }

        createSwitch('直播', 'live', '⚡');
        createSwitch('广告', 'ad', '🚫');
        createSwitch('购物', 'shop', '🛒');

        document.body.appendChild(container);

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            container.style.right = 'auto';
            container.style.left = `${initialLeft}px`;
            container.style.top = `${initialTop}px`;
            container.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            container.style.left = `${initialLeft + dx}px`;
            container.style.top = `${initialTop + dy}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.transition = 'opacity 0.3s';
                localStorage.setItem('dy_panel_top', container.style.top);
                localStorage.setItem('dy_panel_left', container.style.left);
            }
        });
    }

    // ==========================================
    //            核心模块: 内容检测
    // ==========================================
    function checkContent() {
        if (isSkipping) return true;

        if (config.ad) {
            const btns = document.querySelectorAll('button, a, div, span');
            for (let el of btns) {
                if (!isElementInViewport(el)) continue;

                // 排除任何属于侧边栏容器的元素
                // 即使上面的 isElementInViewport 漏掉了，这里做二次保险
                if (el.closest('[class*="drawer"]') || 
                    el.closest('[class*="sideslip"]') || 
                    el.closest('[class*="UserPanel"]')) {
                    continue;
                }

                const t = (el.innerText || '').trim();
                const cleanT = t.replace(/\s+/g, '');

                if (cleanT === '广告' && el.offsetWidth < 90 && el.offsetHeight < 40) {
                    showToast('🚫 发现广告(标签)，跳过...');
                    executeSkip();
                    return true;
                }

                // 【关键修改2】正则中移除单字 "详情"，改为 "查看详情"
                // 之前的正则包含 "|详情"，这直接命中了侧边栏的 "详情" Tab。
                if (/推广|赞助|立即(了解|查看|领取|体验|下载|预约)|去看看|查看详情/.test(t)) {
                    // 严格限制尺寸，防止误伤大段描述文字
                    if (t.length < 20 && el.offsetWidth < 200 && el.offsetHeight < 60) {
                        showToast('🚫 发现广告(行为)，跳过...');
                        executeSkip();
                        return true;
                    }
                }
            }
        }

        if (config.shop) {
            const cart = document.querySelector('[data-e2e="video-cart-entry"]');
            if (cart && isElementInViewport(cart)) {
                showToast('🛒 发现购物车，跳过...');
                executeSkip();
                return true;
            }

            const xpath = "//*[contains(text(), '购物')]";
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                let el = result.snapshotItem(i);
                if (isElementInViewport(el)) {
                    const txt = el.innerText.trim();
                    const pTxt = el.parentElement ? el.parentElement.innerText.trim() : "";
                    if (txt.includes("车") || pTxt.includes("车")) continue;
                    const combinedText = txt + " " + pTxt;
                    if (combinedText.includes('|') || combinedText.includes('销量') || combinedText.includes('评价') || combinedText.includes('同款') || combinedText.includes('推荐') || combinedText.includes('抢购')) {
                        if (el.offsetWidth < 350 && el.offsetHeight < 100) {
                            if (el.offsetParent === null) continue;
                            showToast("🛒 发现购物链接，跳过...");
                            executeSkip();
                            return true;
                        }
                    }
                }
            }
        }

        if (config.live) {
            const xpath = "//*[text()='直播中']";
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                let el = result.snapshotItem(i);
                if (isElementInViewport(el)) {
                    if (el.offsetParent === null) continue;
                    showToast("⚡ 发现直播，跳过...");
                    executeSkip();
                    return true;
                }
            }
        }
        return false;
    }

    function checkVideoQuality() {
        const video = document.querySelector('video');
        if (!video) return;
        if (video.src !== lastVideoSrc) {
            lastVideoSrc = video.src;
            isQualityChecked = false;
        }
        if (isQualityChecked) return;
        const triggerBtn = findResolutionButton();
        if (!triggerBtn) return;
        const currentText = triggerBtn.innerText;
        if (currentText.includes("4K")) {
            isQualityChecked = true;
            return;
        }
        triggerPointerEvent(triggerBtn, 'pointerover');
        triggerPointerEvent(triggerBtn, 'pointerenter');
        setTimeout(() => {
            let foundTarget = false;
            for (let q of QUALITIES) {
                if (currentText.includes(q)) {
                    foundTarget = true;
                    break;
                }
                const allDivs = document.querySelectorAll('div, span, p');
                for (let node of allDivs) {
                    if (node.innerText === q && node !== triggerBtn) {
                        triggerPointerEvent(node, 'pointerdown');
                        triggerPointerEvent(node, 'mousedown');
                        triggerPointerEvent(node, 'pointerup');
                        triggerPointerEvent(node, 'mouseup');
                        node.click();
                        foundTarget = true;
                        triggerPointerEvent(triggerBtn, 'pointerout');
                        triggerPointerEvent(triggerBtn, 'pointerleave');
                        const player = document.querySelector('.xgplayer-container') || document.body;
                        triggerPointerEvent(player, 'pointermove');
                        break;
                    }
                }
                if (foundTarget) break;
            }
            if (foundTarget || !currentText.includes("智能")) {
                isQualityChecked = true;
                triggerPointerEvent(triggerBtn, 'pointerleave');
            }
        }, 300);
    }

    initUI();
    console.log('【抖音助手】V6.3.2 (最终修正版) 已启动');
    setInterval(() => {
        if (!checkContent()) {
            checkVideoQuality();
        }
    }, MAIN_INTERVAL);

})();