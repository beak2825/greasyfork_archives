// ==UserScript==
// @name         Notion Database Batch Replace
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一款专为 Notion 用户打造的深度替换工具
// @author       DSTBP
// @icon         https://github.com/DSTBP/NDBR/blob/main/favicon.png?raw=true
// @match        https://www.notion.so/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/DSTBP/NDBR/issues
// @homepageURL  https://github.com/DSTBP/NDBR
// @downloadURL https://update.greasyfork.org/scripts/561380/Notion%20Database%20Batch%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/561380/Notion%20Database%20Batch%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    const PANEL_WIDTH = 280;
    const ICON_SIZE = 48;

    // --- 样式定义 ---
    const UI_STYLE = `
        position: fixed; top: 100px; right: 20px; z-index: 10001;
        background: #ffffff; border: 1px solid #dfdfde; padding: 0;
        border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        width: ${PANEL_WIDTH}px; font-family: sans-serif; cursor: default;
        display: flex; flex-direction: column; overflow: hidden;
        transition: opacity 0.2s;
    `;

    const ICON_STYLE = `
        position: fixed; top: 100px; right: 20px; z-index: 10001;
        background: #ffffff; width: ${ICON_SIZE}px; height: ${ICON_SIZE}px;
        border-radius: 50%; display: none; align-items: center;
        justify-content: center; cursor: move; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        user-select: none; border: 1px solid #ddd; padding: 6px; box-sizing: border-box;
    `;

    const CUSTOM_SVG = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M551.31 666.87h258.9v228.77h-258.9z" fill="#1792E5"></path><path d="M614.16 156.36c98.73 9.91 177.94 69.31 194.84 171.18h-57.15l92.22 137.2 92.28-137.2H872.7c-16.9-137.2-120.79-226.37-252-239.07-18.18-1.47-35 14.09-35 33.91 1.21 17 12.88 32.53 28.5 34zM471.31 87H150.53c-18.18 0-32.46 15.56-32.46 35.38V428c0 19.81 14.28 35.38 32.46 35.38h320.78c18.18 0 32.46-15.57 32.46-35.38V122.38c0-19.82-14.28-35.38-32.46-35.38z m-31.18 308.45H181.71V154.91h258.48v240.54z m-31.19 469.71C298.55 855.26 214.11 781.7 210.22 660h61L179.1 522.8 86.88 660h61c2.56 157.08 113 258.9 254.59 273.06 18.18 1.4 35.07-14.16 35.07-34a33.85 33.85 0 0 0-28.63-33.92z m465-307H553.13c-18.23 0-32.46 15.62-32.46 35.38v307c0 19.76 14.23 35.32 32.46 35.32h320.79c18.17 0 32.4-15.56 32.4-35.32v-307c0.06-19.76-15.5-35.38-32.34-35.38z m-31.21 308.4H584.32V627.42h258.41z m0 0" fill="#424242"></path></svg>`;

    function init() {
        if (document.getElementById('notion-replace-ui')) return;

        const container = document.createElement('div');
        container.id = 'notion-replace-ui';
        container.style.cssText = UI_STYLE;
        container.innerHTML = `
            <div id="n-header" style="background:#f7f7f5; padding:10px 16px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; cursor:move; user-select:none;">
                <span style="font-weight:bold; font-size:13px; color:#333;">Notion 批量替换</span>
                <span id="n-min" style="cursor:pointer; font-size:20px; color:#888; line-height:1;">&times;</span>
            </div>
            <div id="n-body" style="padding:16px;">
                <input id="n-f" placeholder="查找内容..." style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
                <input id="n-r" placeholder="替换为..." style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
                <button id="n-x" style="width:100%; background:#2383e2; color:#fff; border:none; padding:10px; cursor:pointer; border-radius:4px; font-weight:600;">开始自动替换</button>
                <div id="n-l" style="font-size:12px; margin-top:10px; color:#888; white-space:pre-wrap; max-height:80px; overflow-y:auto;">状态: 准备就绪</div>
            </div>
        `;

        const icon = document.createElement('div');
        icon.id = 'notion-replace-icon';
        icon.style.cssText = ICON_STYLE;
        icon.innerHTML = CUSTOM_SVG;

        document.body.appendChild(container);
        document.body.appendChild(icon);

        // 绑定拖拽 (使用修改后的拖拽逻辑)
        makeDraggable(container, document.getElementById('n-header'));
        makeDraggable(icon, icon);

        // --- 增强型劫持修复 ---
        const inputs = [document.getElementById('n-f'), document.getElementById('n-r')];
        inputs.forEach(input => {
            // 阻止所有可能触发 Notion 快捷键响应的事件冒泡
            const eventsToStop = ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'click', 'paste', 'contextmenu'];
            
            eventsToStop.forEach(eventType => {
                input.addEventListener(eventType, (e) => {
                    e.stopPropagation();
                    // 特别针对粘贴事件，确保它在当前元素执行
                    if (eventType === 'paste') {
                        // 允许默认行为（即允许粘贴内容进 input），但停止冒泡
                        return;
                    }
                }, { capture: true }); // 使用 capture 阶段提前拦截
            });

            // 额外保险：当 input 获得焦点时，禁用全局快捷键的影响
            input.addEventListener('focus', () => {
                input.style.borderColor = '#2383e2';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#ddd';
            });
        });

        // 收缩逻辑：记录当前的 top 和 right，确保图标出现在面板右上角
        document.getElementById('n-min').onclick = () => {
            const currentTop = parseInt(container.style.top);
            const currentRight = parseInt(container.style.right);

            container.style.display = 'none';
            icon.style.display = 'flex';
            icon.style.top = currentTop + 'px';
            icon.style.right = currentRight + 'px';
        };

        // 展开逻辑：面板的右边缘对齐图标的右边缘，面板向左延伸
        icon.onclick = () => {
            if (icon.dataset.dragging === 'true') return;
            const currentTop = parseInt(icon.style.top);
            const currentRight = parseInt(icon.style.right);

            icon.style.display = 'none';
            container.style.display = 'flex';
            container.style.top = currentTop + 'px';
            container.style.right = currentRight + 'px';
        };

        document.getElementById('n-x').onclick = toggleScan;
    }

    // --- 适配“右对齐”的拖拽函数 ---
    function makeDraggable(el, handle) {
        let startX, startY, startRight, startTop;

        handle.onmousedown = (e) => {
            e.preventDefault(); e.stopPropagation();
            el.dataset.dragging = 'false';

            startX = e.clientX;
            startY = e.clientY;
            // 获取当前的 top 和 right
            const rect = el.getBoundingClientRect();
            startRight = window.innerWidth - rect.right;
            startTop = rect.top;

            document.onmousemove = (e) => {
                el.dataset.dragging = 'true';
                const deltaX = startX - e.clientX;
                const deltaY = e.clientY - startY;

                el.style.right = (startRight + deltaX) + 'px';
                el.style.top = (startTop + deltaY) + 'px';
                el.style.left = 'auto'; // 确保 left 不干扰 right 定位
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                setTimeout(() => { el.dataset.dragging = 'false'; }, 150);
            };
        };
    }

    // --- 核心扫描逻辑 ---
    async function toggleScan() {
        if (isRunning) { isRunning = false; return; }
        const f = document.getElementById('n-f').value, r = document.getElementById('n-r').value;
        if (!f) return alert("请输入查找内容");
        isRunning = true;
        const btn = document.getElementById('n-x');
        btn.innerText = "停止扫描 (ESC)"; btn.style.background = "#eb5757";
        try { await startZScan(f, r); } catch (e) { console.error(e); }
        isRunning = false;
        btn.innerText = "开始自动替换"; btn.style.background = "#2383e2";
    }

    async function startZScan(f, r) {
        const log = document.getElementById('n-l');
        const vS = document.querySelector('.notion-scroller.vertical') || window;
        const hS = document.querySelector('.notion-scroller.horizontal') || document.querySelector('.notion-table-view > .notion-scroller');
        if (!hS) { log.innerText = "未找到滚动容器"; return; }
        let total = 0, atBottom = false;
        while (isRunning && !atBottom) {
            hS.scrollTo({ left: 0, behavior: 'instant' });
            await sleep(1000);
            let atRight = false;
            while (isRunning && !atRight) {
                log.innerText = `[处理] 已替换: ${total}\n状态: 扫描列...`;
                total += await replaceCells(f, r);
                const pL = hS.scrollLeft;
                hS.scrollBy({ left: hS.clientWidth * 0.7, behavior: 'smooth' });
                await sleep(1200);
                if (Math.abs(hS.scrollLeft - pL) < 20) atRight = true;
            }
            const pT = (vS === window) ? window.scrollY : vS.scrollTop;
            if (vS === window) window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
            else vS.scrollBy({ top: vS.clientHeight * 0.7, behavior: 'smooth' });
            await sleep(1500);
            const cT = (vS === window) ? window.scrollY : vS.scrollTop;
            if (Math.abs(cT - pT) < 20) atBottom = true;
        }
        log.innerText = `✅ 完成！总计: ${total}`;
    }

    async function replaceCells(f, r) {
        const cells = Array.from(document.querySelectorAll('[role="gridcell"], .notion-table-view-cell'))
                           .filter(c => c.innerText.includes(f) && !c.dataset.done);
        let count = 0;
        for (let cell of cells) {
            if (!isRunning) break;
            if (await deepWrite(cell, f, r)) { count++; cell.dataset.done = "true"; await sleep(800); }
        }
        return count;
    }

    async function deepWrite(cell, f, r) {
        try {
            const inner = cell.querySelector('span, [contenteditable]') || cell;
            inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            inner.click();
            let editor = null;
            for (let t = 0; t < 6; t++) {
                editor = cell.querySelector('[contenteditable="true"]') || document.querySelector('.notion-overlay-container [contenteditable="true"]');
                if (editor) break;
                cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                await sleep(400);
            }
            if (!editor) return false;
            const original = editor.innerText;
            if (!original.includes(f)) return false;
            editor.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, original.split(f).join(r));
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(200);
            editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            editor.blur();
            return true;
        } catch (e) { return false; }
    }

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    setInterval(() => { if (location.href !== window.lUrl) { window.lUrl = location.href; setTimeout(init, 2000); } }, 2000);
    setTimeout(init, 2000);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') isRunning = false; });
})();