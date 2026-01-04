// ==UserScript==
// @name         Flash游戏自定义按键(移动端)
// @namespace   
// @version      V1.0.0
// @description  一款由AI生成的用于在手机上在线玩flash或者部分h5游戏的按键，其主要内容包括，自定义按键，自定义按键布局，导入导出按键配置，长按菜单按钮隐藏按键，沉浸式体验等。
// @author       一点典芝士
// @license MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560259/Flash%E6%B8%B8%E6%88%8F%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%94%AE%28%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560259/Flash%E6%B8%B8%E6%88%8F%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%94%AE%28%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 存储键名 ---
    const STORAGE_KEY_DATA = "ruffle_v80_data";
    const STORAGE_KEY_CURR = "ruffle_v80_curr";
    const STORAGE_KEY_MENU_POS = "ruffle_v80_menu_pos";
    const STORAGE_KEY_OPACITY = "ruffle_v80_opacity"; // 新增：透明度存储

    // =========================================================
    // 核心按键逻辑 (模拟键盘)
    // =========================================================
    const INPUT_MAP = {
        'ARROWUP': 38, 'ARROWDOWN': 40, 'ARROWLEFT': 37, 'ARROWRIGHT': 39,
        'UP': 38, 'DOWN': 40, 'LEFT': 37, 'RIGHT': 39,
        'SPACE': 32, 'ENTER': 13, 'ESCAPE': 27, 'ESC': 27,
        'SHIFT': 16, 'CONTROL': 17, 'CTRL': 17, 'ALT': 18, 'TAB': 9,
        'BACKSPACE': 8, 'DELETE': 46, 'DEL': 46,
        '上': 38, '下': 40, '左': 37, '右': 39,
        '空格': 32, '回车': 13, '退出': 27,
        'W': 87, 'A': 65, 'S': 83, 'D': 68,
        'J': 74, 'K': 75, 'L': 76, 'U': 85, 'I': 73, 'O': 79
    };

    function getDisplayKeyName(code) {
        if (code === 32) return "空格";
        const specialMap = {
            37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown',
            13: 'Enter', 27: 'Escape', 16: 'Shift', 17: 'Control'
        };
        return specialMap[code] || String.fromCharCode(code);
    }

    function getEventKey(code) {
        if (code === 32) return " ";
        const specialMap = {
            37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown',
            13: 'Enter', 27: 'Escape', 16: 'Shift', 17: 'Control'
        };
        return specialMap[code] || String.fromCharCode(code);
    }

    function getEventCode(code) {
        if (code === 32) return "Space";
        if (code === 38) return "ArrowUp";
        if (code === 40) return "ArrowDown";
        if (code === 37) return "ArrowLeft";
        if (code === 39) return "ArrowRight";
        if (code === 13) return "Enter";
        const char = String.fromCharCode(code);
        return "Key" + char.toUpperCase();
    }

    function resolveKeyCode(input) {
        if (!input) return null;
        const upper = input.toUpperCase().trim();
        if (/^\d+$/.test(upper)) return parseInt(upper);
        if (INPUT_MAP[upper]) return INPUT_MAP[upper];
        if (upper.length === 1) return upper.charCodeAt(0);
        return null;
    }

    function triggerKey(type, code) {
        const keyVal = getEventKey(code);
        const codeVal = getEventCode(code);
        const event = new KeyboardEvent(type, {
            key: keyVal,
            code: codeVal,
            keyCode: code,
            which: code,
            bubbles: true,
            cancelable: true,
            repeat: type === 'keydown'
        });
        document.dispatchEvent(event);
    }

    // =========================================================
    // 样式注入
    // =========================================================
    const style = document.createElement('style');
    style.innerHTML = `
        #btn-menu-ctrl {
            position: fixed; z-index: 2147483647;
            width: auto; min-width: 45px; height: 35px; padding: 0 10px;
            border-radius: 6px; font-size: 12px;
            background: rgba(45, 45, 50, 0.8) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            color: white; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease, background 0.2s, transform 0.1s;
            user-select: none; -webkit-user-select: none;
            font-family: sans-serif; cursor: move;
        }
        #btn-menu-ctrl.is-ghost { opacity: 0.02 !important; pointer-events: auto !important; border: none !important; box-shadow: none !important; }
        #btn-menu-ctrl.is-ghost:active { opacity: 0.5 !important; background: rgba(255, 255, 255, 0.3) !important; transform: translate(-50%, -50%) scale(0.95) !important; }
        #btn-menu-ctrl:not(.is-ghost):active { transform: translate(-50%, -50%) scale(0.95) !important; background: rgba(80, 80, 90, 0.9) !important; }

        #menu-bar {
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%) translateY(-20px);
            z-index: 2147483646;
            display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: center;
            opacity: 0; visibility: hidden;
            transition: all 0.3s ease; pointer-events: none;
            background: transparent;
            width: 95%; max-width: 650px;
        }
        #menu-bar.active { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: auto; }

        /* --- v8.2 核心：pointer-events: auto 拦截长按菜单 --- */
        .v-btn {
            background: rgba(45, 45, 50, 0.8); color: white;
            border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center;
            justify-content: center; user-select: none;
            touch-action: none;
            box-sizing: border-box; transition: transform 0.05s, background 0.05s;
            font-family: sans-serif;
            pointer-events: auto !important;
        }

        .game-key { position: fixed !important; z-index: 2147483645 !important; transform: translate(-50%, -50%); }
        .v-rect-s { width: auto; min-width: 45px; height: 35px; padding: 0 10px; border-radius: 6px; font-size: 12px; background: #333; white-space: nowrap; color: white; border: 1px solid #555; cursor: pointer; pointer-events: auto; }
        .v-rect-s:active { transform: scale(0.95); background: #555; }

        /* 隐身模式优先级最高 */
        .game-key.stealth-mode { opacity: 0 !important; background: transparent !important; border: none !important; color: transparent !important; }
        .game-key.is-active { transform: translate(-50%, -50%) scale(0.92) !important; background: rgba(100, 100, 110, 0.9); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
        .v-rect { border-radius: 10px; }
        .v-circle { border-radius: 50%; }
        .is-hidden { display: none !important; }

        body.is-editing::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483640; pointer-events: none; background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px); background-size: 10% 10%; }
        .edit-mode { background: rgba(255, 193, 7, 0.5) !important; cursor: pointer; outline: 2px dashed #ffff00 !important; outline-offset: -2px !important; opacity: 1 !important; }
        .edit-mode::after { content: attr(data-pos); position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); text-align: center; font-size: 9px; color: yellow; pointer-events: none; text-shadow: 1px 1px 0 #000; white-space: nowrap; background: rgba(0,0,0,0.5); padding: 1px 3px; border-radius: 3px; }

        .gm-universal-fullscreen { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483644 !important; background: #000 !important; margin: 0 !important; padding: 0 !important; display: block !important; object-fit: contain !important; }
        .gm-selecting-mode { cursor: crosshair !important; }
        .gm-selecting-mode * :hover { outline: 3px solid red !important; box-shadow: inset 0 0 20px rgba(255,0,0,0.5) !important; }

        .g-toast { position: fixed; top: 15%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #0f0; padding: 8px 16px; border-radius: 4px; font-size: 14px; z-index: 2147483650; pointer-events: none; transition: opacity 0.3s; opacity: 0; }
        .g-toast.show { opacity: 1; }
        .g-modal-mask { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483649; display: flex; justify-content: center; align-items: center; }
        .g-modal { background: #222; border: 1px solid #555; border-radius: 8px; padding: 15px; width: 280px; color: white; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .g-modal h3 { margin: 0 0 10px 0; font-size: 16px; text-align: center; color: #ffeb3b; }
        .g-form-group { margin-bottom: 10px; display:flex; align-items:center; justify-content: space-between; }
        .g-form-group label { font-size: 12px; color: #aaa; width: 35%; }
        .g-form-group input, .g-form-group select { width: 60%; background: #333; border: 1px solid #444; color: white; padding: 5px; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
        .g-btns { display: flex; justify-content: space-between; margin-top: 15px; }
        .g-btn { border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; color: white; font-size: 12px; }
        .g-btn-save { background: #28a745; }
        .g-btn-cancel { background: #666; }
        .g-btn-del { background: #dc3545; }
    `;
    document.head.appendChild(style);

    const showToast = (msg) => {
        let toast = document.querySelector('.g-toast');
        if (!toast) { toast = document.createElement('div'); toast.className = 'g-toast'; document.body.appendChild(toast); }
        toast.innerText = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000);
    };

    const closeAllModals = () => document.querySelectorAll('.g-modal-mask').forEach(el => el.remove());

    const showConfirm = (msg, onYes) => {
        closeAllModals(); const mask = document.createElement('div'); mask.className = 'g-modal-mask';
        mask.innerHTML = `<div class="g-modal" style="text-align:center;"><h3>⚠️ 确认</h3><div style="margin:15px 0; font-size:14px;">${msg}</div><div class="g-btns"><button class="g-btn g-btn-cancel" id="m-no">取消</button><button class="g-btn g-btn-del" id="m-yes">确定</button></div></div>`;
        document.body.appendChild(mask); document.getElementById('m-no').onclick = closeAllModals;
        document.getElementById('m-yes').onclick = () => { closeAllModals(); onYes(); };
    };

    const makeDraggable = (el, onDragEnd) => {
        let isDragging = false, hasMoved = false;
        el.addEventListener('touchmove', (e) => {
            e.preventDefault(); isDragging = true; hasMoved = true;
            const t = e.touches[0];
            const xPct = (t.clientX / window.innerWidth * 100);
            const yPct = (t.clientY / window.innerHeight * 100);
            el.style.left = xPct + '%'; el.style.top = yPct + '%';
        }, {passive:false});
        el.addEventListener('touchend', () => {
            if(isDragging) {
                isDragging = false;
                if(onDragEnd) onDragEnd({left:el.style.left, top:el.style.top});
                setTimeout(()=>hasMoved=false,50);
            }
        });
        return () => hasMoved;
    };

    // =========================================================
    // 数据 & 状态管理
    // =========================================================
    const defaultLayout = [
        { id: 'k_left',  label: '左', x: 8,  y: 75, code: 37, shape: 'rect', width: 70, height: 70 },
        { id: 'k_right', label: '右', x: 24, y: 75, code: 39, shape: 'rect', width: 70, height: 70 },
        { id: 'k_up',    label: '上', x: 16, y: 60, code: 38, shape: 'rect', width: 70, height: 70 },
        { id: 'k_down',  label: '下', x: 16, y: 88, code: 40, shape: 'rect', width: 70, height: 70 },
        { id: 'k_space', label: '空格', x: 85, y: 75, code: 32, shape: 'circle', width: 90, height: 90 }
    ];

    let allProfiles = GM_getValue(STORAGE_KEY_DATA, { "默认配置": defaultLayout });
    let currentProfileName = GM_getValue(STORAGE_KEY_CURR, "默认配置");
    // 新增：读取透明度，默认 1.0 (不透明)
    let globalOpacity = GM_getValue(STORAGE_KEY_OPACITY, 1.0);

    if (!allProfiles[currentProfileName]) { currentProfileName = Object.keys(allProfiles)[0]; GM_setValue(STORAGE_KEY_CURR, currentProfileName); }
    let activeKeys = allProfiles[currentProfileName];

    let isEditing = false;
    let keysVisible = false;
    let menuExpanded = false;
    let isStealth = false;
    let currentFullscreenElement = null;

    let keyRegions = [];
    let activeKeyCodes = new Set();

    function normalizeConfig(cfg) {
        if (!cfg.width) { const isCircle = cfg.shape === 'circle'; cfg.width = isCircle ? 80 : 65; cfg.height = isCircle ? 80 : 50; }
        if (cfg.x > 100) cfg.x = (cfg.x / window.innerWidth * 100).toFixed(1);
        if (cfg.y > 100) cfg.y = (cfg.y / window.innerHeight * 100).toFixed(1);
        return cfg;
    }

    function applyBtnStyle(div, cfg) {
        const isCircle = cfg.shape === 'circle';
        div.classList.remove('v-rect', 'v-circle');
        div.classList.add(isCircle ? 'v-circle' : 'v-rect');
        div.style.width = cfg.width + 'px'; div.style.height = cfg.height + 'px';
        div.style.fontSize = Math.min(cfg.width, cfg.height) * 0.3 + 'px';
        div.style.borderRadius = isCircle ? '50%' : '10px';
        if (isEditing) div.setAttribute('data-pos', `X${Math.round(cfg.x)}% Y${Math.round(cfg.y)}%`);
    }

    // 新增：应用透明度函数
    function updateGlobalOpacity(val) {
        if (val !== undefined) {
            globalOpacity = parseFloat(val);
            GM_setValue(STORAGE_KEY_OPACITY, globalOpacity);
        }
        document.querySelectorAll('.game-key').forEach(el => {
            el.style.opacity = globalOpacity;
        });
    }

    function saveAll() {
        const newConfigs = [];
        document.querySelectorAll('.game-key').forEach(btn => {
            const isCircle = btn.classList.contains('v-circle');
            newConfigs.push({
                id: btn.dataset.id, label: btn.innerText, code: parseInt(btn.dataset.code),
                x: parseFloat(btn.style.left), y: parseFloat(btn.style.top),
                shape: isCircle ? 'circle' : 'rect',
                width: parseFloat(btn.style.width), height: parseFloat(btn.style.height)
            });
        });
        activeKeys = newConfigs;
        allProfiles[currentProfileName] = activeKeys;
        GM_setValue(STORAGE_KEY_DATA, allProfiles);
        updateKeyRegions();
    }

    // =========================================================
    // V8.0 核心引擎：全局坐标扫描
    // =========================================================
    function updateKeyRegions() {
        keyRegions = [];
        if (!keysVisible || isEditing) return;

        const btns = document.querySelectorAll('.game-key');
        btns.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            keyRegions.push({
                id: btn.dataset.id,
                code: parseInt(btn.dataset.code),
                el: btn,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            });
        });
    }

    function handleGlobalTouch(e) {
        if (isEditing || !keysVisible) return;

        const touches = e.touches;
        const currentFrameActiveCodes = new Set();
        let isTouchingAnyKey = false;

        for (let i = 0; i < touches.length; i++) {
            const tx = touches[i].clientX;
            const ty = touches[i].clientY;
            for (let k = 0; k < keyRegions.length; k++) {
                const r = keyRegions[k];
                if (tx >= r.left && tx <= r.right && ty >= r.top && ty <= r.bottom) {
                    currentFrameActiveCodes.add(r.code);
                    r.el.classList.add('is-active');
                    isTouchingAnyKey = true;
                }
            }
        }

        currentFrameActiveCodes.forEach(code => {
            if (!activeKeyCodes.has(code)) triggerKey('keydown', code);
        });

        activeKeyCodes.forEach(code => {
            if (!currentFrameActiveCodes.has(code)) triggerKey('keyup', code);
        });

        keyRegions.forEach(r => {
            if (!currentFrameActiveCodes.has(r.code)) r.el.classList.remove('is-active');
        });

        activeKeyCodes = currentFrameActiveCodes;

        if (isTouchingAnyKey && e.type !== 'touchend') {
            if (e.cancelable) e.preventDefault();
        }
    }

    window.addEventListener('touchstart', handleGlobalTouch, { passive: false });
    window.addEventListener('touchmove', handleGlobalTouch, { passive: false });
    window.addEventListener('touchend', handleGlobalTouch, { passive: false });
    window.addEventListener('touchcancel', handleGlobalTouch, { passive: false });

    window.addEventListener('contextmenu', (e) => {
        if (!isEditing && keysVisible) {
            const x = e.clientX;
            const y = e.clientY;
            for (let k = 0; k < keyRegions.length; k++) {
                const r = keyRegions[k];
                if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            }
        }
    }, { capture: true });

    window.addEventListener('resize', () => setTimeout(updateKeyRegions, 200));
    window.addEventListener('scroll', () => setTimeout(updateKeyRegions, 200));


    // =========================================================
    // UI 交互
    // =========================================================
    function openKeyEditModal(btn) {
        closeAllModals();
        const mask = document.createElement('div'); mask.className = 'g-modal-mask';
        const isCircle = btn.classList.contains('v-circle');
        const cfg = {
            label: btn.innerText, code: parseInt(btn.dataset.code),
            x: parseFloat(btn.style.left), y: parseFloat(btn.style.top),
            width: parseFloat(btn.style.width), height: parseFloat(btn.style.height),
            shape: isCircle ? 'circle' : 'rect'
        };
        const shapeVal = (cfg.shape === 'rect') ? '2' : '1';

        mask.innerHTML = `
            <div class="g-modal">
                <h3>编辑按键</h3>
                <div class="g-form-group"><label>名字</label><input type="text" id="m-label" value="${cfg.label}"></div>
                <div class="g-form-group"><label>功能代码</label><input type="text" id="m-code" value="${getDisplayKeyName(cfg.code)}"></div>
                <div class="g-form-group"><label>中心 X%</label><input type="number" id="m-x" value="${cfg.x}"></div>
                <div class="g-form-group"><label>中心 Y%</label><input type="number" id="m-y" value="${cfg.y}"></div>
                <div class="g-form-group"><label>宽度 (px)</label><input type="number" id="m-w" value="${cfg.width}"></div>
                <div class="g-form-group"><label>高度 (px)</label><input type="number" id="m-h" value="${cfg.height}"></div>
                <div class="g-form-group"><label>形状</label><select id="m-shape"><option value="1" ${shapeVal==='1'?'selected':''}>圆 (Circle)</option><option value="2" ${shapeVal==='2'?'selected':''}>方 (Rect)</option></select></div>
                <div class="g-btns"><button class="g-btn g-btn-del" id="m-btn-del">删除</button><div><button class="g-btn g-btn-cancel" id="m-btn-cancel">取消</button><button class="g-btn g-btn-save" id="m-btn-save">确定</button></div></div>
            </div>`;
        document.body.appendChild(mask);
        document.getElementById('m-btn-cancel').onclick = closeAllModals;
        document.getElementById('m-btn-del').onclick = () => { closeAllModals(); showConfirm("删除此键？", () => { btn.remove(); saveAll(); }); };
        document.getElementById('m-btn-save').onclick = () => {
            const lbl = document.getElementById('m-label').value;
            const codeStr = document.getElementById('m-code').value;
            const finalCode = resolveKeyCode(codeStr);
            if (!finalCode) { showToast("❌ 功能键无法识别"); return; }
            cfg.label = lbl; cfg.code = finalCode;
            cfg.x = parseFloat(document.getElementById('m-x').value);
            cfg.y = parseFloat(document.getElementById('m-y').value);
            cfg.width = parseFloat(document.getElementById('m-w').value);
            cfg.height = parseFloat(document.getElementById('m-h').value);
            cfg.shape = (document.getElementById('m-shape').value === '1') ? 'circle' : 'rect';
            btn.innerText = lbl; btn.dataset.code = finalCode;
            btn.style.left = cfg.x + '%'; btn.style.top = cfg.y + '%';
            applyBtnStyle(btn, cfg);
            closeAllModals(); saveAll(); showToast("✅ 修改已应用");
        };
    }

    function openIOModal(mode) {
        closeAllModals(); saveAll(); const mask = document.createElement('div'); mask.className = 'g-modal-mask';
        let val = mode === 'export' ? btoa(encodeURIComponent(JSON.stringify(activeKeys))) : "";
        mask.innerHTML = `<div class="g-modal" style="width: 320px;"><h3>${mode==='export'?'导出':'导入'}</h3><div style="margin-bottom:10px;"><textarea id="m-io-text" rows="5" style="width:100%;font-family:monospace;">${val}</textarea></div><div class="g-btns"><button class="g-btn g-btn-cancel" id="m-io-cancel">关闭</button><button class="g-btn g-btn-save" id="m-io-ok">${mode==='export'?'复制':'导入'}</button></div></div>`;
        document.body.appendChild(mask);
        document.getElementById('m-io-cancel').onclick = closeAllModals;
        document.getElementById('m-io-ok').onclick = () => {
            const txt = document.getElementById('m-io-text');
            if (mode === 'export') { txt.select(); document.execCommand('copy'); showToast("✅ 已复制"); closeAllModals(); }
            else {
    try {
        const data = JSON.parse(decodeURIComponent(atob(txt.value.trim())));

        // 1. 更新当前内存中的数据
        activeKeys = data;
        allProfiles[currentProfileName] = activeKeys;

        // 2. 保存到存储
        GM_setValue(STORAGE_KEY_DATA, allProfiles);

        // 3. 移除屏幕上现有的旧按键
        document.querySelectorAll('.game-key').forEach(el => el.remove());

        // 4. 重新生成新按键
        activeKeys.forEach(cfg => createKeyElement(normalizeConfig(cfg)));

        // 5. 更新触摸判定区域并提示
        updateKeyRegions();
        showToast("✅ 导入成功");
        closeAllModals();

    } catch(e) {
        console.error(e);
        showToast("❌ 代码无效");
    }
}

        };
    }

    // 新增：透明度设置弹窗
    function openOpacityModal() {
        closeAllModals();
        const mask = document.createElement('div');
        mask.className = 'g-modal-mask';
        mask.innerHTML = `
            <div class="g-modal" style="width: 250px;">
                <h3>设置透明度</h3>
                <div style="margin: 15px 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <label style="font-size:12px; color:#aaa;">值 (0.1-1.0):</label>
                    <input type="number" id="m-op-val" value="${globalOpacity}" step="0.1" max="1.0" min="0.1" style="width: 70px; text-align:center;">
                </div>
                <div style="text-align:center; font-size:10px; color:#666; margin-bottom:10px;">数值越小越透明</div>
                <div class="g-btns">
                    <button class="g-btn g-btn-cancel" id="m-op-cancel">取消</button>
                    <button class="g-btn g-btn-save" id="m-op-save">保存</button>
                </div>
            </div>`;
        document.body.appendChild(mask);

        document.getElementById('m-op-cancel').onclick = closeAllModals;
        document.getElementById('m-op-save').onclick = () => {
            const val = document.getElementById('m-op-val').value;
            if (val >= 0.1 && val <= 1.0) {
                updateGlobalOpacity(val);
                showToast(`✅ 透明度已设为 ${val}`);
                closeAllModals();
            } else {
                showToast("❌ 请输入 0.1 - 1.0 之间的数值");
            }
        };
    }

    function openProfileModal() {
        closeAllModals(); saveAll(); const mask = document.createElement('div'); mask.className = 'g-modal-mask';
        let html = `<div class="g-modal"><h3>切换方案</h3><div style="max-height:200px;overflow-y:auto;">`;
        Object.keys(allProfiles).forEach(name => { const isCurr = name === currentProfileName; html += `<div style="padding:5px; border-bottom:1px solid #444; cursor:pointer; color:${isCurr?'#0f0':'#fff'}" data-name="${name}" class="p-item">${isCurr?'▶ ':''}${name}</div>`; });
        html += `</div><div style="margin-top:10px; border-top:1px solid #555; padding-top:5px; display:flex;"><input type="text" id="m-new-p" placeholder="新方案名..." style="width:70%"><button id="m-add-p" class="g-btn g-btn-save" style="width:25%;margin-left:5px;">+</button></div><div class="g-btns"><button class="g-btn g-btn-cancel" id="m-p-close">关闭</button></div></div>`;
        mask.innerHTML = html; document.body.appendChild(mask);
        document.getElementById('m-p-close').onclick = closeAllModals;
        document.querySelectorAll('.p-item').forEach(item => { item.onclick = () => { saveAll(); const name = item.dataset.name; currentProfileName = name; activeKeys = allProfiles[name]; GM_setValue(STORAGE_KEY_CURR, name); document.querySelectorAll('.game-key').forEach(el => el.remove()); activeKeys.forEach(cfg => createKeyElement(normalizeConfig(cfg))); showToast(`已切换: ${name}`); closeAllModals(); updateProfileLabel(); updateKeyRegions(); }; });
        document.getElementById('m-add-p').onclick = () => { const newName = document.getElementById('m-new-p').value.trim(); if (newName) { saveAll(); if (!allProfiles[newName]) { allProfiles[newName] = JSON.parse(JSON.stringify(activeKeys)); GM_setValue(STORAGE_KEY_DATA, allProfiles); } currentProfileName = newName; GM_setValue(STORAGE_KEY_CURR, newName); document.querySelectorAll('.game-key').forEach(el => el.remove()); activeKeys.forEach(cfg => createKeyElement(normalizeConfig(cfg))); showToast(`创建: ${newName}`); closeAllModals(); updateProfileLabel(); updateKeyRegions(); } };
    }

    function updateProfileLabel() { const el = document.getElementById('btn-profile-label'); if (el) el.innerText = `当前: ${currentProfileName}`; }
    function updateEditBtnLabel() { const el = document.getElementById('btn-edit-toggle'); if (el) el.innerText = isEditing ? '完成' : '编辑'; }

    function createKeyElement(cfg) {
        cfg = normalizeConfig(cfg);
        const div = document.createElement('div');
        div.className = `v-btn game-key ${keysVisible ? '' : 'is-hidden'} ${isStealth ? 'stealth-mode' : ''}`;
        div.dataset.id = cfg.id; div.dataset.code = cfg.code; div.innerText = cfg.label;
        div.style.left = cfg.x + '%'; div.style.top = cfg.y + '%';
        div.style.opacity = globalOpacity; // 应用保存的透明度
        applyBtnStyle(div, cfg);

        div.addEventListener('touchmove', e => {
            if (!isEditing) return; e.preventDefault();
            const t = e.touches[0];
            const xPct = (t.clientX / window.innerWidth * 100);
            const yPct = (t.clientY / window.innerHeight * 100);
            div.style.left = xPct + '%'; div.style.top = yPct + '%';
            div.setAttribute('data-pos', `X${Math.round(xPct)}% Y${Math.round(yPct)}%`);
        }, {passive:false});

        div.addEventListener('click', () => { if (isEditing) openKeyEditModal(div); });
        document.documentElement.appendChild(div);
    }

    const toggleStealth = () => {
        isStealth = !isStealth;
        const btn = document.getElementById('btn-stealth-toggle');
        if (btn) {
            btn.innerText = isStealth ? '显示' : '👁️ 隐身';
            btn.style.color = isStealth ? '#ff6666' : '#ffffff';
        }
        document.querySelectorAll('.game-key').forEach(el => el.classList.toggle('stealth-mode', isStealth));
        showToast(isStealth ? "隐身模式: ON" : "隐身模式: OFF");
    };

    const toggleMenu = () => {
        menuExpanded = !menuExpanded;
        const menuBar = document.getElementById('menu-bar');
        if(menuExpanded) menuBar.classList.add('active'); else menuBar.classList.remove('active');
        document.getElementById('btn-menu-ctrl').innerText = menuExpanded ? '收起' : '菜单';
    };

    const toggleKeysVisible = () => {
        keysVisible = !keysVisible;
        document.querySelectorAll('.game-key').forEach(btn => btn.classList.toggle('is-hidden', !keysVisible));
        document.getElementById('btn-main-toggle').innerText = keysVisible ? '关闭' : '开启';
        updateKeyRegions();
    };

    const toggleEdit = () => {
        isEditing = !isEditing; updateEditBtnLabel();
        document.querySelectorAll('.game-key').forEach(btn => btn.classList.toggle('edit-mode', isEditing));
        document.body.classList.toggle('is-editing', isEditing);
        if (isEditing && isStealth) { toggleStealth(); showToast("编辑中：强制显示"); }
        if (!isEditing) { saveAll(); showToast("✅ 配置已锁定"); } else { showToast("✏️ 请调整按键"); updateKeyRegions(); }
    };

    const toggleSystemFullscreen = () => {
        const docEl = document.documentElement;
        if (!document.fullscreenElement) { if (docEl.requestFullscreen) docEl.requestFullscreen(); } else { if (document.exitFullscreen) document.exitFullscreen(); }
        setTimeout(updateKeyRegions, 500);
    };

    const toggleImmersiveSelection = () => {
        if (currentFullscreenElement) {
            currentFullscreenElement.classList.remove('gm-universal-fullscreen');
            document.body.style.overflow = '';
            currentFullscreenElement = null;
            document.getElementById('btn-immersive-fs').innerText = '⛶ 选定全屏';
            showToast("已退出全屏");
            setTimeout(updateKeyRegions, 500);
            return;
        }
        showToast("👉 请点击屏幕上的游戏画面...");
        document.body.classList.add('gm-selecting-mode');
        if(menuExpanded) toggleMenu();

        const selectorHandler = function(event) {
            event.preventDefault(); event.stopPropagation();
            let target = event.target;
            if (target.tagName === 'CANVAS' && target.parentElement.tagName === 'RUFFLE-PLAYER') { target = target.parentElement; }
            target.classList.add('gm-universal-fullscreen');
            document.body.style.overflow = 'hidden';
            currentFullscreenElement = target;
            const btn = document.getElementById('btn-immersive-fs');
            if(btn) btn.innerText = '退出全屏';
            document.removeEventListener('click', selectorHandler, true);
            document.body.classList.remove('gm-selecting-mode');
            setTimeout(() => { window.dispatchEvent(new Event('resize')); updateKeyRegions(); }, 100);
            showToast("✅ 已强制全屏");
        };
        document.addEventListener('click', selectorHandler, true);
    };

    function addNewKey() { const uniqueId = 'key_' + Date.now(); createKeyElement({ id: uniqueId, label: 'K', code: 90, x: 50, y: 50, shape: 'circle', width: 80, height: 80 }); if (!isEditing) { document.getElementById('btn-edit-toggle').click(); showToast("点击新键设置"); } }
    function deleteProfile() { if (Object.keys(allProfiles).length <= 1) { showToast("无法删除最后一个方案"); return; } showConfirm(`⚠️ 确定删除 [${currentProfileName}]？`, () => { delete allProfiles[currentProfileName]; const first = Object.keys(allProfiles)[0]; currentProfileName = first; activeKeys = allProfiles[first]; GM_setValue(STORAGE_KEY_DATA, allProfiles); GM_setValue(STORAGE_KEY_CURR, first); document.querySelectorAll('.game-key').forEach(el => el.remove()); activeKeys.forEach(cfg => createKeyElement(normalizeConfig(cfg))); updateProfileLabel(); showToast("🗑️ 方案已删除"); updateKeyRegions(); }); }

    const menuBar = document.createElement('div');
    menuBar.id = 'menu-bar';
    document.documentElement.appendChild(menuBar);

    const subMenu = [
        { id: 'btn-main-toggle', label: '开启', action: toggleKeysVisible },
        { id: 'btn-stealth-toggle', label: '👁️ 隐身', action: toggleStealth },
        { id: 'btn-profile-label', label: `当前: ${currentProfileName}`, class: 'profile-tag', action: openProfileModal },
        { label: '透明度', action: openOpacityModal }, // 新增
        { label: '系统全屏', action: toggleSystemFullscreen },
        { id: 'btn-immersive-fs', label: '⛶ 选定全屏', action: toggleImmersiveSelection },
        { id: 'btn-edit-toggle', label: '编辑', action: toggleEdit },
        { label: '+键', action: addNewKey },
        { label: '导出', action: () => openIOModal('export') },
        { label: '导入', action: () => openIOModal('import') },
        { label: '删除', action: deleteProfile }
    ];

    subMenu.forEach(s => {
        const div = document.createElement('div');
        if(s.id) div.id = s.id;
        div.className = `v-btn v-rect-s ${s.class||''}`;
        div.innerText = s.label;
        div.onclick = s.action;
        menuBar.appendChild(div);
    });

    const mainBtn = document.createElement('div');
    mainBtn.id = 'btn-menu-ctrl';
    mainBtn.className = 'v-btn v-rect-s';
    mainBtn.innerText = '菜单';
    const savedMenuPos = GM_getValue(STORAGE_KEY_MENU_POS);
    if (savedMenuPos) {
        // --- 修复逻辑开始：防止按钮跑出屏幕 ---
        let safeX = parseFloat(savedMenuPos.left);
        let safeY = parseFloat(savedMenuPos.top);

        // 强制限制在 2% 到 90% 之间，如果超出这个范围，自动拉回屏幕内
        if (isNaN(safeX) || safeX < 2 || safeX > 95) safeX = 5;
        if (isNaN(safeY) || safeY < 2 || safeY > 95) safeY = 5;

        mainBtn.style.left = safeX + '%';
        mainBtn.style.top = safeY + '%';
        // --- 修复逻辑结束 ---
    }
    else { mainBtn.style.left = '5%'; mainBtn.style.top = '5%'; }

    let menuPressTimer;
    mainBtn.addEventListener('touchstart', (e) => {
        menuPressTimer = setTimeout(() => {
            if (mainBtn.classList.contains('is-ghost')) {
                mainBtn.classList.remove('is-ghost');
                showToast("菜单按钮: 已恢复");
            } else {
                mainBtn.classList.add('is-ghost');
                if(menuExpanded) toggleMenu();
                showToast("菜单按钮: 已隐身");
            }
        }, 1500);
    });

    mainBtn.addEventListener('touchend', () => clearTimeout(menuPressTimer));
    mainBtn.addEventListener('touchmove', () => clearTimeout(menuPressTimer));

    const checkMenuMoved = makeDraggable(mainBtn, (pos) => GM_setValue(STORAGE_KEY_MENU_POS, pos));
    mainBtn.addEventListener('click', (e) => {
        if (!checkMenuMoved()) {
            toggleMenu();
        }
    });
    document.documentElement.appendChild(mainBtn);

    activeKeys.forEach(cfg => createKeyElement(normalizeConfig(cfg)));
    console.log("Ruffle 虚拟手柄 v8.3 (透明度调节版) 已加载");

})();
