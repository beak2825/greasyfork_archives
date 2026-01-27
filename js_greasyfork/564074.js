// ==UserScript==
// @name         🛡️定时点击
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  支持启动自动最小化 | 默认位置记忆 | 代码预设 | 双击启停 | 完美吸附
// @author       Geek_Omni
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564074/%F0%9F%9B%A1%EF%B8%8F%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/564074/%F0%9F%9B%A1%EF%B8%8F%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 🔧 用户自定义配置区 (在这里修改默认行为)
    // =================================================================

    // 1. [开关] 刷新页面后是否自动加载插件？
    // true = 自动加载 (配合下方配置可实现自动最小化)
    // false = 完全不加载 (需去菜单手动开启)
    const AUTO_SHOW_GUI = true;

    // 2. [开关] 启动时是否自动最小化为悬浮胶囊？
    // true = 启动即最小化 (只显示小圆球/胶囊)
    // false = 启动显示完整大面板
    const AUTO_MINIMIZE = true;

    // 3. [预设] 常用的按钮选择器 (重置或首次运行时自动加载)
    const USER_PRESETS = [
        { name: "天成保活", path: "#app > div > div.main-container > section > div > div:nth-child(4) > div:nth-child(4) > form > div:nth-child(4) > div > button.el-button.el-button--primary.el-button--mini" },
        // { name: "导出", path: ".export-data" }
    ];

    // =================================================================

    // --- 0. 核心配置 ---
    const CONFIG_KEY = 'geek_config_v15';
    const STATE_KEY = 'geek_hud_visible_v15_force';
    const POS_KEY = 'geek_hud_position_v15';

    let config = GM_getValue(CONFIG_KEY, {
        minSeconds: 300,
        maxSeconds: 360,
        targets: USER_PRESETS
    });

    // 读取状态：如果存储中没有记录，则使用 AUTO_SHOW_GUI 的值
    let isHudVisible = GM_getValue(STATE_KEY, AUTO_SHOW_GUI);
    let lastPos = GM_getValue(POS_KEY, { top: '50px', left: 'auto', right: '50px' });

    let timerId = null;
    let remaining = 0;
    let isPaused = true;
    let hud, miniPill;

    // --- 1. 扩展菜单集成 ---
    GM_registerMenuCommand("🖥️ 开启/关闭控制台", () => {
        isHudVisible = !isHudVisible;
        GM_setValue(STATE_KEY, isHudVisible);
        if (isHudVisible) initUI();
        else destroyUI();
    });

    if (isHudVisible) initUI();

    // --- 2. UI 构建 ---
    function initUI() {
        if (document.getElementById('geek-hud-main')) return;

        GM_addStyle(`
            #geek-hud-main, #geek-hud-mini { font-family: 'Segoe UI', Consolas, monospace; user-select: none; z-index: 2147483647; box-sizing: border-box; }
            .geek-btn { cursor: pointer; border: none; outline: none; transition: filter 0.2s; }
            .geek-btn:hover { filter: brightness(1.2); }
            .geek-input { background: #1a1a1a; color: #ddd; border: 1px solid #444; border-radius: 4px; padding: 4px; outline: none; }
        `);

        // A. 主面板
        hud = document.createElement('div');
        hud.id = 'geek-hud-main';
        hud.style.cssText = `
            position: fixed; width: 220px;
            top: ${lastPos.top}; left: ${lastPos.left}; right: ${lastPos.right};
            background: rgba(20, 20, 20, 0.98); border: 1px solid #444;
            color: #00ff00; border-radius: 6px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            display: flex; flex-direction: column;
        `;

        hud.innerHTML = `
            <div id="geek-header" style="height: 36px; background: #004d00; cursor: move; display: flex; justify-content: space-between; align-items: center; padding: 0 10px; border-radius: 6px 6px 0 0; border-bottom: 1px solid #333;">
                <span style="font-size: 13px; font-weight: 700; color: #fff;">🛡️ 保活 V15</span>
                <div style="display:flex; gap:10px;">
                    <span id="geek-btn-min" class="geek-btn" style="color: #fff; font-size:14px;" title="最小化">➖</span>
                    <span id="geek-btn-close" class="geek-btn" style="color: #ff6666; font-size:14px;" title="关闭">✕</span>
                </div>
            </div>
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; gap: 5px;">
                    <select id="geek-selector" class="geek-input" style="flex: 1;"><option value="-1">-- 未配置 --</option></select>
                    <button id="geek-btn-add" class="geek-btn" style="width: 28px; background: #28a745; color: white; border-radius: 4px;" title="添加">+</button>
                    <button id="geek-btn-del" class="geek-btn" style="width: 28px; background: #d00; color: white; border-radius: 4px;" title="删除">🗑️</button>
                </div>
                <div id="geek-timer" style="font-size: 32px; font-weight: 700; text-align: center; color: #666; letter-spacing: 2px;">OFF</div>
                <div style="display: flex; gap: 8px; margin-top: 5px;">
                    <button id="geek-btn-control" class="geek-btn" style="flex: 1; background: #333; color: #aaa; padding: 8px 0; font-weight: bold; border-radius: 4px;">▶ 启动</button>
                    <button id="geek-btn-setting" class="geek-btn" style="width: 36px; background: #333; color: white; border-radius: 4px;" title="设置">⚙</button>
                </div>
            </div>
        `;

        // B. 悬浮胶囊
        miniPill = document.createElement('div');
        miniPill.id = 'geek-hud-mini';
        miniPill.title = "双击此处 启动/暂停";
        miniPill.style.cssText = `
            position: fixed; top: 0; left: 0; padding: 5px 15px 5px 5px;
            background: rgba(0, 0, 0, 0.95); border-radius: 20px;
            border: 1px solid #555; display: none; align-items: center; gap: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6); cursor: move; transition: border-color 0.3s;
        `;
        miniPill.innerHTML = `
            <div id="geek-mini-restore" class="geek-btn" style="width: 26px; height: 26px; background: #007bff; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;" title="还原界面">⤢</div>
            <span id="geek-mini-text" style="font-size: 14px; font-weight: bold; color: #888; min-width: 45px; text-align: center;">OFF</span>
        `;

        document.body.appendChild(hud);
        document.body.appendChild(miniPill);

        // 1. 先规范化坐标，确保 left/top 有具体数值
        normalizeCoordinates(hud);

        // 2. 根据 AUTO_MINIMIZE 决定初始状态 [✅关键新增逻辑]
        if (AUTO_MINIMIZE) {
            hud.style.display = 'none';
            miniPill.style.display = 'flex';

            // 计算胶囊位置 (基于主窗口位置 + 偏移)
            const hLeft = parseFloat(hud.style.left);
            const hTop = parseFloat(hud.style.top);
            const hWidth = 220;

            // 让胶囊出现在主窗口原本应该在的右侧区域
            let pLeft = hLeft + hWidth - 120;
            if(pLeft < 0) pLeft = 0;

            miniPill.style.top = hTop + 'px';
            miniPill.style.left = pLeft + 'px';
            ensureInViewport(miniPill);
        }

        bindEvents();
        renderSelector();
        updateUI();

        setupSafeDrag(hud, document.getElementById('geek-header'));
        setupSafeDrag(miniPill, miniPill);
    }

    function destroyUI() {
        if (hud) hud.remove();
        if (miniPill) miniPill.remove();
        isPaused = true;
        clearInterval(timerId);
        timerId = null;
        hud = null; miniPill = null;
    }

    // --- 3. 逻辑控制 ---
    function bindEvents() {
        const dom = getDom();

        dom.miniPill.ondblclick = (e) => {
            if (e.target.id !== 'geek-mini-restore' && !e.target.closest('#geek-mini-restore')) {
                toggleRun();
                dom.miniPill.style.borderColor = isPaused ? '#555' : '#00ff00';
                setTimeout(() => dom.miniPill.style.borderColor = '#555', 300);
            }
        };

        dom.btnMin.onclick = () => {
            const rect = hud.getBoundingClientRect();
            hud.style.display = 'none';
            miniPill.style.display = 'flex';
            const pillLeft = rect.right - 100;
            miniPill.style.top = rect.top + 'px';
            miniPill.style.left = (pillLeft > 0 ? pillLeft : 0) + 'px';
            miniPill.style.right = 'auto';
            ensureInViewport(miniPill);
            updateUI();
        };

        dom.miniRestore.onclick = (e) => {
            e.stopPropagation();
            const rect = miniPill.getBoundingClientRect();
            miniPill.style.display = 'none';
            hud.style.display = 'flex';
            hud.style.top = rect.top + 'px';
            hud.style.left = (rect.left - 160) + 'px';
            hud.style.right = 'auto';
            ensureInViewport(hud);
            savePosition(hud);
        };

        dom.btnClose.onclick = () => {
            isHudVisible = false;
            GM_setValue(STATE_KEY, false);
            destroyUI();
        };

        dom.btnAdd.onclick = () => {
            const name = prompt("备注:", "查询"); if(!name) return;
            const path = prompt("Selector:", ""); if(!path) return;
            config.targets.push({ name, path: path.trim() });
            GM_setValue(CONFIG_KEY, config); renderSelector(config.targets.length - 1);
        };

        dom.btnDel.onclick = () => {
            const idx = parseInt(dom.selector.value);
            if(idx >= 0 && confirm("删除?")) {
                config.targets.splice(idx, 1);
                GM_setValue(CONFIG_KEY, config); renderSelector(0);
            }
        };

        dom.btnControl.onclick = toggleRun;
        dom.btnSetting.onclick = () => {
            const input = prompt(`间隔 (s):`, `${config.minSeconds},${config.maxSeconds}`);
            if (input) {
                const [min, max] = input.split(/[,，]/).map(Number);
                if (min && max) {
                    config.minSeconds = min; config.maxSeconds = max;
                    GM_setValue(CONFIG_KEY, config);
                    if(!isPaused) resetTimer();
                }
            }
        };

        if(!timerId) timerId = setInterval(tick, 1000);
    }

    function toggleRun() {
        if (config.targets.length === 0) return alert("⚠️ 请先添加按钮!");
        isPaused = !isPaused;
        if (!isPaused && remaining <= 0) resetTimer();
        updateUI();
    }

    function tick() {
        if(isPaused || !hud) return;
        const dom = getDom();
        dom.timer.innerText = formatTime(remaining);
        dom.miniText.innerText = formatTime(remaining);

        if (remaining <= 0) {
            const idx = parseInt(dom.selector.value);
            const target = config.targets[idx];
            if(target) {
                const el = document.querySelector(target.path);
                if(el) {
                    el.click();
                    dom.miniText.style.color = "#0f0";
                    setTimeout(()=> { if(!isPaused) dom.miniText.style.color = "#0f0"; }, 500);
                }
            }
            resetTimer();
        } else {
            remaining--;
        }
    }

    // --- 4. 拖拽引擎 ---
    function setupSafeDrag(el, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        handle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;

            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.width = el.offsetWidth + 'px';
            el.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing';

            const onMove = (mv) => {
                if (!isDragging) return;
                mv.preventDefault();
                let newLeft = initialLeft + (mv.clientX - startX);
                let newTop = initialTop + (mv.clientY - startY);
                const maxLeft = window.innerWidth - el.offsetWidth;
                const maxTop = window.innerHeight - el.offsetHeight;
                newLeft = Math.min(Math.max(0, newLeft), maxLeft);
                newTop = Math.min(Math.max(0, newTop), maxTop);
                el.style.left = newLeft + 'px';
                el.style.top = newTop + 'px';
            };
            const onUp = () => {
                if(isDragging) {
                    isDragging = false;
                    el.style.cursor = 'auto';
                    handle.style.cursor = 'move';
                    if (el.id === 'geek-hud-main') savePosition(el);
                }
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    function normalizeCoordinates(el) {
        const rect = el.getBoundingClientRect();
        el.style.left = rect.left + 'px';
        el.style.top = rect.top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }

    function ensureInViewport(el) {
        const rect = el.getBoundingClientRect();
        let newLeft = rect.left;
        let newTop = rect.top;
        if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width - 10;
        if (newLeft < 0) newLeft = 10;
        if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height - 10;
        if (newTop < 0) newTop = 10;
        el.style.left = newLeft + 'px';
        el.style.top = newTop + 'px';
        el.style.right = 'auto';
    }

    function savePosition(el) {
        GM_setValue(POS_KEY, { top: el.style.top, left: el.style.left, right: 'auto' });
    }

    function getDom() {
        return {
            selector: document.getElementById('geek-selector'),
            timer: document.getElementById('geek-timer'),
            btnAdd: document.getElementById('geek-btn-add'),
            btnDel: document.getElementById('geek-btn-del'),
            btnControl: document.getElementById('geek-btn-control'),
            btnSetting: document.getElementById('geek-btn-setting'),
            btnMin: document.getElementById('geek-btn-min'),
            btnClose: document.getElementById('geek-btn-close'),
            miniPill: document.getElementById('geek-hud-mini'),
            miniRestore: document.getElementById('geek-mini-restore'),
            miniText: document.getElementById('geek-mini-text')
        };
    }

    function updateUI() {
        const dom = getDom();
        if(!dom.timer) return;
        if (isPaused) {
            dom.btnControl.innerHTML = "▶ 启动";
            dom.btnControl.style.background = "#333";
            dom.btnControl.style.color = "#888";
            dom.timer.style.color = "#666";
            dom.miniText.style.color = "#888";
            dom.timer.innerText = "OFF";
            dom.miniText.innerText = "OFF";
        } else {
            dom.btnControl.innerHTML = "⏸ 运行";
            dom.btnControl.style.background = "#004d00";
            dom.btnControl.style.color = "#fff";
            dom.timer.style.color = "#00ff00";
            dom.miniText.style.color = "#00ff00";
        }
    }

    function renderSelector(idx = 0) {
        const sel = document.getElementById('geek-selector');
        sel.innerHTML = '';
        if (config.targets.length === 0) sel.appendChild(new Option("-- 未配置 --", -1));
        config.targets.forEach((t, i) => sel.appendChild(new Option(t.name, i)));
        sel.value = idx;
    }
    function resetTimer() {
        remaining = Math.floor(config.minSeconds + Math.random() * (config.maxSeconds - config.minSeconds + 1));
    }
    function formatTime(s) {
        if(s < 0) return "00:00";
        return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    }

})();