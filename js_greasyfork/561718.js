// ==UserScript==
// @name         Archive.org 滚轮翻页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 archive.org 使用鼠标滚轮实现 Page Up/Down 翻页效果
// @match        https://archive.org/details/*
// @match        https://archive.org/stream/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561718/Archiveorg%20%E6%BB%9A%E8%BD%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/561718/Archiveorg%20%E6%BB%9A%E8%BD%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置项 ==========
    const CONFIG = {
        scrollDelay: 300,        // 滚动间隔(毫秒)，防止过快翻页
        pageRatio: 0.9,          // 每次翻动视口高度的比例 (0.9 = 90%)
        smoothScroll: true,      // 是否使用平滑滚动
        useKeySimulation: true   // 是否模拟键盘事件(适用于阅读器)
    };

    let lastScrollTime = 0;
    let isEnabled = true;

    // 创建状态提示
    function createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'scroll-page-indicator';
        indicator.innerHTML = '📖 翻页模式: ON';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 999999;
            cursor: pointer;
            user-select: none;
            transition: opacity 0.3s;
        `;
        indicator.title = '点击切换开关 / 按 F2 切换';
        indicator.onclick = toggleEnabled;
        document.body.appendChild(indicator);

        // 3秒后淡出
        setTimeout(() => {
            indicator.style.opacity = '0.3';
        }, 3000);

        indicator.onmouseenter = () => indicator.style.opacity = '1';
        indicator.onmouseleave = () => indicator.style.opacity = '0.3';

        return indicator;
    }

    function toggleEnabled() {
        isEnabled = !isEnabled;
        const indicator = document.getElementById('scroll-page-indicator');
        if (indicator) {
            indicator.innerHTML = `📖 翻页模式: ${isEnabled ? 'ON' : 'OFF'}`;
            indicator.style.background = isEnabled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
        }
    }

    // 模拟键盘事件
    function simulateKey(keyCode, key) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            keyCode: keyCode,
            code: key,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });
        document.activeElement.dispatchEvent(event);
        document.dispatchEvent(event);
    }

    // 执行翻页
    function doPageScroll(direction) {
        if (CONFIG.useKeySimulation) {
            // 方式1: 模拟 Page Up/Down 键盘事件
            if (direction > 0) {
                simulateKey(34, 'PageDown');
            } else {
                simulateKey(33, 'PageUp');
            }
        }

        // 方式2: 同时尝试直接滚动
        const scrollAmount = window.innerHeight * CONFIG.pageRatio;
        const scrollOptions = {
            top: direction > 0 ? scrollAmount : -scrollAmount,
            behavior: CONFIG.smoothScroll ? 'smooth' : 'auto'
        };

        // 尝试滚动各种可能的容器
        const containers = [
            document.querySelector('.BookReader'),
            document.querySelector('#BookReader'),
            document.querySelector('.ia-bookreader'),
            document.querySelector('[class*="theater"]'),
            document.documentElement,
            document.body
        ];

        containers.forEach(container => {
            if (container) {
                container.scrollBy?.(scrollOptions);
            }
        });

        window.scrollBy(scrollOptions);
    }

    // 滚轮事件处理
    function handleWheel(e) {
        if (!isEnabled) return;

        // 检查是否在输入框中
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            return;
        }

        const now = Date.now();
        if (now - lastScrollTime < CONFIG.scrollDelay) {
            e.preventDefault();
            return;
        }
        lastScrollTime = now;

        e.preventDefault();
        e.stopPropagation();

        const direction = e.deltaY > 0 ? 1 : -1;
        doPageScroll(direction);
    }

    // 键盘快捷键
    function handleKeydown(e) {
        if (e.key === 'F2') {
            toggleEnabled();
            e.preventDefault();
        }
    }

    // 初始化
    function init() {
        // 等待页面加载
        setTimeout(() => {
            createIndicator();

            // 使用捕获阶段拦截滚轮事件
            document.addEventListener('wheel', handleWheel, {
                passive: false,
                capture: true
            });

            document.addEventListener('keydown', handleKeydown);

            console.log('📖 Archive.org 滚轮翻页脚本已启动');
        }, 1000);
    }

    init();
})();