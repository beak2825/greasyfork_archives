// ==UserScript==
// @name         網頁視覺增強濾鏡 Pro+ 
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      3.3
// @description  為網頁添加可自訂的視覺濾鏡與字體效果，新增UI滾動條、可自訂顏色/範圍的光追文字效果。支援全域或站點獨立設定、跨分頁同步，並使用 Shadow DOM 隔離 UI。
// @author       Gemini-Enhanced
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552377/%E7%B6%B2%E9%A0%81%E8%A6%96%E8%A6%BA%E5%A2%9E%E5%BC%B7%E6%BF%BE%E9%8F%A1%20Pro%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/552377/%E7%B6%B2%E9%A0%81%E8%A6%96%E8%A6%BA%E5%A2%9E%E5%BC%B7%E6%BF%BE%E9%8F%A1%20Pro%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定與常數 ---
    const PREFIX = 'web_enhancer_v3_';
    const LOG_PREFIX = '[Web Enhancer]';
    const HOST_ID = PREFIX + 'host';
    let settings = {};
    let debounceTimer;

    // *** 新增/修改：為新功能加入預設值 ***
    const DEFAULTS = {
        brightness: 100, contrast: 100, saturation: 100, sepia: 0, hueRotate: 0,
        fontSize: 16, fontWeight: 400, fontFamily: 'system',
        vignette: 0, grain: 0,
        sharpness: 0,
        glowRadius: 0,    // 原 text3d, 控制光暈半徑
        glowSpread: 0,    // 新功能: 光暈擴散/景深
        glowColor: '#00ffff', // 新功能: 光暈顏色
        pageDepth: 0,
        enabled: true, panelVisible: true,
        panelX: window.innerWidth - 320, panelY: 100,
        settingsScope: 'global'
    };

    const FONT_FAMILIES = {
        system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        sans: '"Helvetica Neue", Helvetica, Arial, "PingFang TC", "Microsoft JhengHei", sans-serif',
        serif: 'Georgia, "Times New Roman", Times, "PMingLiU", serif',
        mono: 'Menlo, Monaco, "Courier New", monospace'
    };

    function log(...args) { console.log(LOG_PREFIX, ...args); }

    // *** 新增：HEX 轉 RGBA 輔助函數 ***
    function hexToRgba(hex, alpha = 1) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length == 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getSettingKey(key) {
        const scope = settings.settingsScope || DEFAULTS.settingsScope;
        return scope === 'site' ? `${PREFIX}${window.location.hostname}_${key}` : `${PREFIX}${key}`;
    }

    async function loadSettings() {
        const loadedSettings = {};
        const scope = await GM_getValue(PREFIX + 'settingsScope', DEFAULTS.settingsScope);
        loadedSettings.settingsScope = scope;
        settings.settingsScope = scope;
        log(`Loading settings... Scope is: ${scope}`);

        for (const key of Object.keys(DEFAULTS)) {
            const storageKey = (key === 'settingsScope') ? `${PREFIX}settingsScope` : getSettingKey(key);
            const savedValue = await GM_getValue(storageKey);
            loadedSettings[key] = savedValue !== undefined ? savedValue : DEFAULTS[key];
        }
        settings = loadedSettings;
    }

    function saveSetting(key, value) {
        if (key === 'settingsScope') {
            GM_setValue(PREFIX + 'settingsScope', value);
            settings[key] = value;
            loadSettings().then(() => { updatePageStyles(); updatePanelUI(); });
        } else {
            GM_setValue(getSettingKey(key), value);
            settings[key] = value;
        }
    }

    // *** 核心修改：更新頁面樣式以包含可自訂的光追效果 ***
    function updatePageStyles() {
        const styleElement = document.getElementById(PREFIX + 'styles');
        if (!styleElement) return;

        if (!settings.enabled) {
            styleElement.textContent = '';
            return;
        }

        const filterEffects = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) sepia(${settings.sepia}%) hue-rotate(${settings.hueRotate}deg)`;
        const fontFamily = FONT_FAMILIES[settings.fontFamily] || FONT_FAMILIES.system;

        // --- 文字陰影效果組合 ---
        let textShadows = [];
        if (settings.sharpness > 0) {
            const sharpValue = settings.sharpness / 100;
            textShadows.push(`0 0 ${sharpValue * 0.6}px rgba(0,0,0,${sharpValue * 0.4})`);
        }
        // 新的光追/霓虹效果邏輯
        if (settings.glowRadius > 0 || settings.glowSpread > 0) {
            const r = settings.glowRadius;
            const s = settings.glowSpread;
            const color = settings.glowColor;
            textShadows.push(
                `0 0 ${r * 0.5}px #fff`,
                `${s}px ${s}px ${r * 1.5}px ${hexToRgba(color, 0.5)}`, // 帶有擴散和透明度的柔和陰影
                `0 0 ${r * 2}px ${color}`,
                `0 0 ${r * 3.5}px ${color}`
            );
        }
        const textShadowStyle = textShadows.length > 0 ? `text-shadow: ${textShadows.join(', ')} !important;` : '';

        const fontStyles = `
            body, body *:not(script):not(style):not(link):not(meta):not(head):not(#${HOST_ID}):not(#${HOST_ID} *):not(pre):not(code):not(kbd):not(samp):not([class*="icon"]):not(i) {
                font-family: ${fontFamily} !important;
                font-size: ${settings.fontSize}px !important;
                font-weight: ${settings.fontWeight} !important;
                line-height: 1.6 !important;
                ${textShadowStyle}
            }
        `;
        const htmlFilter = `html { filter: ${filterEffects}; transition: filter 0.2s ease-in-out; }`;

        let overlayStyles = '';
        let beforeProps = {};
        if (settings.vignette > 0) {
            const size = 100 - settings.vignette;
            beforeProps['background'] = `radial-gradient(ellipse at center, transparent ${size}%, rgba(0,0,0,0.4) 100%)`;
        }
        if (settings.pageDepth > 0) {
            beforeProps['box-shadow'] = `inset 0 0 ${settings.pageDepth}px ${settings.pageDepth / 2}px rgba(0,0,0,0.5)`;
        }
        if (Object.keys(beforeProps).length > 0) {
            const propsString = Object.entries(beforeProps).map(([key, value]) => `${key}: ${value};`).join(' ');
            overlayStyles += `body::before { content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 99999; ${propsString} }`;
        }
        if (settings.grain > 0) {
            const opacity = settings.grain / 50;
            overlayStyles += `body::after { content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 100000; opacity: ${opacity}; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>'); animation: ${PREFIX}grain 1s steps(4) infinite; }`;
        }
        const keyframes = `@keyframes ${PREFIX}grain { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2%, 2%); } 50% { transform: translate(2%, -2%); } 75% { transform: translate(2%, 2%); } }`;

        styleElement.textContent = htmlFilter + fontStyles + overlayStyles + keyframes;
    }

    function createControlPanel() {
        if (document.getElementById(HOST_ID)) return;
        const host = document.createElement('div'); host.id = HOST_ID;
        const shadow = host.attachShadow({ mode: 'open' });
        const panel = document.createElement('div'); panel.id = PREFIX + 'panel'; panel.innerHTML = getPanelHTML();
        const panelStyle = document.createElement('style'); panelStyle.textContent = getPanelCSS();
        shadow.appendChild(panelStyle); shadow.appendChild(panel); document.body.appendChild(host);
        Object.assign(host.style, { position: 'fixed', top: `${settings.panelY}px`, left: `${settings.panelX}px`, zIndex: '2147483647', display: settings.panelVisible ? 'block' : 'none' });
        setupPanelEvents(host); updatePanelUI();
    }

    function updatePanelUI() {
        const host = document.getElementById(HOST_ID); if (!host || !host.shadowRoot) return; const shadowRoot = host.shadowRoot;
        Object.keys(settings).forEach(key => {
            const input = shadowRoot.querySelector(`[data-key="${key}"]`);
            if (input) {
                if (input.type === 'range') {
                    input.value = settings[key]; const valueDisplay = input.nextElementSibling;
                    if (valueDisplay && valueDisplay.classList.contains(`${PREFIX}value`)) {
                        let unit = '%';
                        if (['hueRotate'].includes(key)) unit = '°';
                        if (['fontSize'].includes(key)) unit = 'px';
                        if (['sharpness', 'glowRadius', 'glowSpread', 'pageDepth', 'fontWeight'].includes(key)) unit = '';
                        valueDisplay.textContent = settings[key] + unit;
                    }
                } else if (input.tagName === 'SELECT') { input.value = settings[key]; }
                  else if (input.type === 'checkbox') { input.checked = settings[key] === 'site'; }
                  else if (input.type === 'color') { input.value = settings[key]; } // 更新顏色選擇器
            }
        });
        const toggleBtn = shadowRoot.querySelector(`.${PREFIX}toggle`); if (toggleBtn) { toggleBtn.textContent = settings.enabled ? '✅ 開啟中' : '❌ 已關閉'; toggleBtn.classList.toggle(`${PREFIX}enabled`, settings.enabled); }
    }

    function setupPanelEvents(host) {
        const shadowRoot = host.shadowRoot; const panel = shadowRoot.getElementById(PREFIX + 'panel');
        // 合併 input 和 change 事件監聽器
        const handleValueChange = (target) => {
            const key = target.dataset.key;
            const value = target.type === 'checkbox' ? (target.checked ? 'site' : 'global') : (target.type === 'range' ? Number(target.value) : target.value);

            if (key === 'settingsScope') {
                saveSetting(key, value);
            } else {
                settings[key] = value;
                updatePanelUI();
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    saveSetting(key, value);
                    updatePageStyles();
                }, 100);
            }
        };

        panel.addEventListener('input', e => {
            if (e.target.matches(`.${PREFIX}slider, .${PREFIX}color-picker`)) {
                handleValueChange(e.target);
            }
        });
        panel.addEventListener('change', e => {
            if (e.target.matches(`.${PREFIX}select`)) {
                const key = e.target.dataset.key; const value = e.target.value; saveSetting(key, value); updatePageStyles();
            }
        });
        panel.addEventListener('click', e => {
            const target = e.target;
            if (target.matches(`.${PREFIX}close`)) togglePanelVisibility();
            else if (target.matches(`.${PREFIX}reset`)) resetSettings();
            else if (target.matches(`.${PREFIX}toggle`)) toggleEffects();
            else if (target.matches(`.${PREFIX}scope-switch input`)) { handleValueChange(target); }
        });
        const header = shadowRoot.querySelector(`.${PREFIX}header`);
        header.onmousedown = e => {
            if (e.target.closest('button, label, input')) return;
            const startX = e.clientX, startY = e.clientY, hostStartX = host.offsetLeft, hostStartY = host.offsetTop;
            function onDrag(e) { host.style.left = `${Math.max(0, Math.min(hostStartX + e.clientX - startX, window.innerWidth - host.offsetWidth))}px`; host.style.top = `${Math.max(0, Math.min(hostStartY + e.clientY - startY, window.innerHeight - host.offsetHeight))}px`; }
            function stopDrag() { document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag); saveSetting('panelX', host.offsetLeft); saveSetting('panelY', host.offsetTop); }
            document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag);
        };
    }

    function togglePanelVisibility() {
        const host = document.getElementById(HOST_ID); if (!host) { createControlPanel(); return; }
        const newVisibility = !settings.panelVisible; saveSetting('panelVisible', newVisibility); host.style.display = newVisibility ? 'block' : 'none';
    }

    function resetSettings() {
        const preserved = { panelX: settings.panelX, panelY: settings.panelY, panelVisible: settings.panelVisible, settingsScope: settings.settingsScope };
        settings = { ...DEFAULTS, ...preserved };
        Object.keys(DEFAULTS).forEach(key => { if (!(key in preserved)) { saveSetting(key, DEFAULTS[key]); } });
        updatePageStyles(); updatePanelUI();
    }

    function toggleEffects() { saveSetting('enabled', !settings.enabled); updatePageStyles(); updatePanelUI(); }

    // *** 核心修改：更新 HTML 模板以加入新功能的控制項 ***
    function getPanelHTML() {
        return `
            <div class="${PREFIX}header"><span>🎨 視覺增強 Pro+</span><button class="${PREFIX}close" title="關閉面板">×</button></div>
            <div class="${PREFIX}content">
                <div class="${PREFIX}group-title">影像濾鏡</div>
                <div class="${PREFIX}control-group"><label>亮度</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="200" data-key="brightness" class="${PREFIX}slider"><span class="${PREFIX}value">100%</span></div></div>
                <div class="${PREFIX}control-group"><label>對比度</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="200" data-key="contrast" class="${PREFIX}slider"><span class="${PREFIX}value">100%</span></div></div>
                <div class="${PREFIX}control-group"><label>飽和度</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="200" data-key="saturation" class="${PREFIX}slider"><span class="${PREFIX}value">100%</span></div></div>
                <div class="${PREFIX}control-group"><label>復古色調</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="100" data-key="sepia" class="${PREFIX}slider"><span class="${PREFIX}value">0%</span></div></div>
                <div class="${PREFIX}control-group"><label>色相旋轉</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="360" data-key="hueRotate" class="${PREFIX}slider"><span class="${PREFIX}value">0°</span></div></div>
                <hr class="${PREFIX}divider">
                <div class="${PREFIX}group-title">文字與字體</div>
                <div class="${PREFIX}control-group"><label>字體大小</label><div class="${PREFIX}slider-container"><input type="range" min="10" max="28" step="1" data-key="fontSize" class="${PREFIX}slider"><span class="${PREFIX}value">16px</span></div></div>
                <div class="${PREFIX}control-group"><label>字體粗細</label><div class="${PREFIX}slider-container"><input type="range" min="100" max="900" step="100" data-key="fontWeight" class="${PREFIX}slider"><span class="${PREFIX}value">400</span></div></div>
                <div class="${PREFIX}control-group"><label>字體族</label><select data-key="fontFamily" class="${PREFIX}select"><option value="system">系統預設</option><option value="sans">無襯線</option><option value="serif">襯線</option><option value="mono">等寬</option></select></div>
                <hr class="${PREFIX}divider">
                <div class="${PREFIX}group-title">✨ 實驗性功能</div>
                <div class="${PREFIX}control-group"><label>銳利度 (文字)</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="100" data-key="sharpness" class="${PREFIX}slider"><span class="${PREFIX}value">0</span></div></div>
                <div class="${PREFIX}control-group">
                  <label>光追/霓虹文字</label>
                  <div class="${PREFIX}sub-control-group">
                    <span>顏色</span><input type="color" data-key="glowColor" class="${PREFIX}color-picker">
                  </div>
                  <div class="${PREFIX}sub-control-group slider-sub">
                    <span>半徑</span><input type="range" min="0" max="20" data-key="glowRadius" class="${PREFIX}slider"><span class="${PREFIX}value">0</span>
                  </div>
                   <div class="${PREFIX}sub-control-group slider-sub">
                    <span>擴散</span><input type="range" min="0" max="20" data-key="glowSpread" class="${PREFIX}slider"><span class="${PREFIX}value">0</span>
                  </div>
                </div>
                <div class="${PREFIX}control-group"><label>頁面景深 (陰影)</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="50" data-key="pageDepth" class="${PREFIX}slider"><span class="${PREFIX}value">0</span></div></div>
                <div class="${PREFIX}control-group"><label>暗角效果</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="50" data-key="vignette" class="${PREFIX}slider"><span class="${PREFIX}value">0%</span></div></div>
                <div class="${PREFIX}control-group"><label>膠片顆粒</label><div class="${PREFIX}slider-container"><input type="range" min="0" max="15" data-key="grain" class="${PREFIX}slider"><span class="${PREFIX}value">0%</span></div></div>
                <hr class="${PREFIX}divider">
                <div class="${PREFIX}control-group" style="display: flex; justify-content: space-between; align-items: center;"><label style="margin-bottom:0;">站點獨立設定</label><label class="${PREFIX}scope-switch"><input type="checkbox" data-key="settingsScope"><span class="${PREFIX}switch-slider"></span></label></div>
                <div class="${PREFIX}button-group"><button class="${PREFIX}btn ${PREFIX}reset" title="恢復預設值">↺ 重設</button><button class="${PREFIX}btn ${PREFIX}toggle" title="啟用或停用所有效果"></button></div>
            </div>`;
    }

    // *** 核心修改：為新 UI 元素和滾動條增加樣式 ***
    function getPanelCSS() {
        return `
            :host { font-family: system-ui, -apple-system, sans-serif; }
            #${PREFIX}panel { display: flex; flex-direction: column; background: rgba(28, 28, 38, 0.85); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border-radius: 12px; min-width: 300px; max-height: 90vh; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; font-size: 14px; }
            .${PREFIX}header { padding: 10px 16px; background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px 12px 0 0; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; font-weight: 600; flex-shrink: 0; }
            .${PREFIX}close { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 0; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
            .${PREFIX}close:hover { background: rgba(255, 255, 255, 0.1); }
            .${PREFIX}content { padding: 16px; overflow-y: auto; flex-grow: 1; }
            .${PREFIX}content::-webkit-scrollbar { width: 6px; }
            .${PREFIX}content::-webkit-scrollbar-track { background: transparent; }
            .${PREFIX}content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
            .${PREFIX}content::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
            .${PREFIX}group-title { font-size: 10px; text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: bold; letter-spacing: 0.5px; margin-bottom: 10px; margin-top: 4px; }
            .${PREFIX}control-group { margin-bottom: 12px; }
            .${PREFIX}control-group label { display: block; margin-bottom: 6px; font-size: 12px; color: rgba(255, 255, 255, 0.8); font-weight: 500; }
            .${PREFIX}sub-control-group { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
            .${PREFIX}sub-control-group.slider-sub { gap: 12px; }
            .${PREFIX}sub-control-group span { color: rgba(255, 255, 255, 0.7); }
            .${PREFIX}color-picker { width: 60px; height: 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: none; cursor: pointer; padding: 2px; }
            .${PREFIX}color-picker::-webkit-color-swatch-wrapper { padding: 0; }
            .${PREFIX}color-picker::-webkit-color-swatch { border: none; border-radius: 2px; }
            .${PREFIX}slider-container, .${PREFIX}sub-control-group .${PREFIX}slider { flex: 1; }
            .${PREFIX}slider { height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.2); outline: none; -webkit-appearance: none; }
            .${PREFIX}slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #818cf8; cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); transition: transform 0.1s; }
            .${PREFIX}slider::-webkit-slider-thumb:active { transform: scale(1.2); }
            .${PREFIX}value { min-width: 30px; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-align: right; }
            .${PREFIX}select { width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 13px; }
            .${PREFIX}button-group { display: flex; gap: 8px; margin-top: 16px; }
            .${PREFIX}btn { flex: 1; padding: 8px 12px; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; }
            .${PREFIX}btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
            .${PREFIX}reset { background: #e11d48; }
            .${PREFIX}toggle { background: #4f46e5; }
            .${PREFIX}toggle:not(.${PREFIX}enabled) { background: #71717a; }
            .${PREFIX}divider { border: none; height: 1px; background: rgba(255, 255, 255, 0.1); margin: 16px 0; }
            .${PREFIX}scope-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
            .${PREFIX}scope-switch input { opacity: 0; width: 0; height: 0; }
            .${PREFIX}switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4b5563; transition: .4s; border-radius: 22px; }
            .${PREFIX}switch-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .${PREFIX}switch-slider { background-color: #4f46e5; }
            input:checked + .${PREFIX}switch-slider:before { transform: translateX(18px); }
        `;
    }

    async function init() {
        if (!document.getElementById(PREFIX + 'styles')) {
            const styleEl = document.createElement('style'); styleEl.id = PREFIX + 'styles';
            (document.head || document.documentElement).appendChild(styleEl);
        }
        await loadSettings();
        updatePageStyles();
        GM_addValueChangeListener(PREFIX.slice(0, -1), (name, old_value, new_value, remote) => {
            if (remote) {
                log('Settings updated from another tab. Reloading...');
                loadSettings().then(() => { updatePageStyles(); updatePanelUI(); });
            }
        });
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createControlPanel);
        } else {
            createControlPanel();
        }
    }
    GM_registerMenuCommand('🎨 開/關視覺增強面板', togglePanelVisibility);
    init();

})();