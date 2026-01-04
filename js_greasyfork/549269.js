// ==UserScript==
// @name         抖音：一键开启设计模式 (解除复制限制+位置记忆)
// @namespace    https://toolsdar.cn/
// @version      1.2
// @description  只在 https://www.douyin.com/* 生效。点击面板或快捷键 (Alt+C) 一键切换 designMode。支持拖拽并自动记忆面板位置。
// @match        https://www.douyin.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549269/%E6%8A%96%E9%9F%B3%EF%BC%9A%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20%28%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2B%E4%BD%8D%E7%BD%AE%E8%AE%B0%E5%BF%86%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549269/%E6%8A%96%E9%9F%B3%EF%BC%9A%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20%28%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2B%E4%BD%8D%E7%BD%AE%E8%AE%B0%E5%BF%86%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        storageKey: 'tm_designmode_pos_v1' // 用于保存位置的键名
    };

    const STATE = {
        enabled: false,
        panel: null
    };

    // ====== 样式注入 ======
    function injectGlobalStyles() {
        const css = `
            .tm-unlock-mode * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
                cursor: auto !important;
            }
            #tm-designmode-panel {
                position: fixed;
                /* 默认位置，如果读取到记忆会被覆盖 */
                right: 20px;
                bottom: 20px;
                z-index: 999999;
                font-family: system-ui, -apple-system, sans-serif;
                background: rgba(20, 20, 20, 0.85);
                backdrop-filter: blur(5px);
                color: #fff;
                padding: 6px;
                border-radius: 8px;
                display: flex;
                gap: 10px;
                align-items: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.1);
                transition: opacity 0.3s;
                user-select: none;
            }
            #tm-designmode-panel:hover {
                opacity: 1;
            }
            #tm-designmode-btn {
                background: #333;
                color: #fff;
                border: 1px solid #555;
                padding: 5px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
            }
            #tm-designmode-btn:hover {
                background: #444;
            }
            #tm-designmode-btn.active {
                background: #fe2c55;
                border-color: #fe2c55;
                color: #fff;
            }
            #tm-designmode-status {
                font-size: 12px;
                color: #aaa;
                margin-right: 4px;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ====== 恢复保存的位置 ======
    function restorePosition(panel) {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const pos = JSON.parse(saved);
                // 简单的边界检查，防止位置超出屏幕（例如窗口变小了）
                const maxW = window.innerWidth - 50;
                const maxH = window.innerHeight - 50;

                // 解析保存的数值 (去掉 'px')
                let left = parseFloat(pos.left);
                let top = parseFloat(pos.top);

                // 如果坐标有效且在可视范围内
                if (!isNaN(left) && !isNaN(top)) {
                    // 修正越界
                    left = Math.min(Math.max(0, left), maxW);
                    top = Math.min(Math.max(0, top), maxH);

                    panel.style.left = left + 'px';
                    panel.style.top = top + 'px';
                    panel.style.right = 'auto';  // 必须清除默认的 right
                    panel.style.bottom = 'auto'; // 必须清除默认的 bottom
                }
            }
        } catch (e) {
            console.error('恢复面板位置失败', e);
        }
    }

    // ====== UI 创建 ======
    function createPanel() {
        if (document.getElementById('tm-designmode-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'tm-designmode-panel';
        panel.innerHTML = `
            <button id="tm-designmode-btn">开启复制</button>
            <div id="tm-designmode-status">OFF</div>
        `;

        // --- 核心修改：创建前先恢复位置 ---
        restorePosition(panel);

        document.body.appendChild(panel);
        STATE.panel = panel;

        const btn = document.getElementById('tm-designmode-btn');
        btn.addEventListener('click', toggleMode);
        panel.addEventListener('mousedown', startDrag);

        // 快捷键 Alt+C
        document.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                toggleMode();
            }
        });
    }

    // ====== 核心逻辑 ======
    function toggleMode() {
        STATE.enabled = !STATE.enabled;
        const btn = document.getElementById('tm-designmode-btn');
        const status = document.getElementById('tm-designmode-status');

        if (STATE.enabled) {
            document.designMode = 'on';
            document.documentElement.classList.add('tm-unlock-mode');
            btn.textContent = '关闭复制';
            btn.className = 'active';
            status.textContent = 'ON';
            showToast('已开启：可复制内容 (Alt+C 关闭)');
        } else {
            document.designMode = 'off';
            document.documentElement.classList.remove('tm-unlock-mode');
            btn.textContent = '开启复制';
            btn.className = '';
            status.textContent = 'OFF';
            showToast('已关闭：恢复正常');
        }
    }

    // ====== 拖拽逻辑 (带记忆功能) ======
    function startDrag(e) {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();

        const panel = STATE.panel;
        const rect = panel.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        function onMove(ev) {
            let left = ev.clientX - offsetX;
            let top = ev.clientY - offsetY;

            const maxLeft = window.innerWidth - rect.width;
            const maxTop = window.innerHeight - rect.height;
            left = Math.max(0, Math.min(left, maxLeft));
            top = Math.max(0, Math.min(top, maxTop));

            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }

        function onUp() {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);

            // --- 核心修改：拖拽结束后保存位置 ---
            const posToSave = {
                left: panel.style.left,
                top: panel.style.top
            };
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(posToSave));
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }

    // ====== Toast 提示 ======
    let toastTimer = null;
    function showToast(msg) {
        let t = document.getElementById('tm-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'tm-toast';
            t.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000000;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                pointer-events: none;
                transition: opacity 0.3s;
                opacity: 0;
            `;
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.opacity = '1';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2000);
    }

    // ====== 初始化 ======
    function init() {
        injectGlobalStyles();
        createPanel();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();