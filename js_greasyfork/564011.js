// ==UserScript==
// @name         全局浏览器WallpaperEngine壁纸插件 带UI
// @namespace    http://tampermonkey.net/
// @version      4.13
// @description  优雅挂载url格式壁纸，自带护眼对比色处理，自动追踪暗色/浅色主题模式。
// @author       HCID274
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license MIT
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564011/%E5%85%A8%E5%B1%80%E6%B5%8F%E8%A7%88%E5%99%A8WallpaperEngine%E5%A3%81%E7%BA%B8%E6%8F%92%E4%BB%B6%20%E5%B8%A6UI.user.js
// @updateURL https://update.greasyfork.org/scripts/564011/%E5%85%A8%E5%B1%80%E6%B5%8F%E8%A7%88%E5%99%A8WallpaperEngine%E5%A3%81%E7%BA%B8%E6%8F%92%E4%BB%B6%20%E5%B8%A6UI.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // ================= ⚙️ 默认配置 (URL控制权在此) =================
const DEFAULT_CONFIG = {
        url: "https://happyhappyhappy.hcid274.xyz/api/v1/sys/fetch?t=gAAAAABpde52sahF-0TJpWgiQWN9nJyA42-giCkuWQpmi-X8QbdUvMJBsWHPs4SQ_5mIfezrEOBBT5V9pj7ovtVntKeNaQXVww==",
        opacity: 0.15,
        blur: 2,
        theme: 'auto' // 'auto' | 'light' | 'dark'
    };
 
    // ================= 🛡️ 存储安全封装 =================
    function safeGetValue(key, defaultValue) {
        try {
            return GM_getValue(key, defaultValue);
        } catch (e) {
            console.warn(`[壁纸脚本] 读取 ${key} 失败，使用默认值`, e);
            return defaultValue;
        }
    }
 
    function safeSetValue(key, value) {
        try {
            GM_setValue(key, value);
        } catch (e) {
            console.error(`[壁纸脚本] 写入 ${key} 失败 (可能是超限):`, e);
            // 如果存储失败，尝试清空以防死循环
            if (e.name === 'QuotaExceededError') {
                alert("❌ 存储空间不足，壁纸将不会被缓存，但本次会显示。");
            }
        }
    }
 
    // 注册菜单命令
    GM_registerMenuCommand("🧹 重置壁纸脚本数据", () => {
        if(confirm("壁纸脚本：确定要清空所有缓存和设置吗？这可以修复脚本无法运行的问题。")) {
            GM_deleteValue('user_config');
            GM_deleteValue('cached_bg_data');
            GM_deleteValue('cached_url'); // 清除缓存的URL记录
            location.reload();
        }
    });
 
    // 初始化配置
    let config, cachedImgData, cachedUrl;
    try {
        // 读取存储的配置，但只保留样式设置
        const savedConfig = safeGetValue('user_config', DEFAULT_CONFIG);
 
        // 强制同步：URL 永远以代码为准，防止 UI 缓存冲突
        config = {
            ...DEFAULT_CONFIG,
            opacity: savedConfig.opacity || DEFAULT_CONFIG.opacity,
            blur: savedConfig.blur || DEFAULT_CONFIG.blur,
            theme: savedConfig.theme || DEFAULT_CONFIG.theme
        };
 
        cachedImgData = safeGetValue('cached_bg_data', '');
        cachedUrl = safeGetValue('cached_url', ''); // 读取缓存图片对应的URL
    } catch (e) {
        console.error("[壁纸脚本] 初始化严重错误，重置:", e);
        config = {...DEFAULT_CONFIG};
        cachedImgData = '';
        cachedUrl = '';
    }
 
    console.log("%c[壁纸修复版] 🚀 脚本启动...", "color: #00e0ff; font-weight: bold;");
 
    // ================= 🛡️ 样式注入系统 (CSP Bypass) =================
    let globalSheet = null;
    let uiSheet = null;
 
    function updateStyleSheet(css, sheetType) {
        // 方案 1: Constructable Stylesheets (最推荐)
        try {
            if (document.adoptedStyleSheets) {
                let sheet = (sheetType === 'global') ? globalSheet : uiSheet;
                if (!sheet) {
                    sheet = new CSSStyleSheet();
                    sheet.replaceSync(css);
                    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
                    if (sheetType === 'global') globalSheet = sheet;
                    else uiSheet = sheet;
                } else {
                    sheet.replaceSync(css);
                }
                return;
            }
        } catch (e) {}
 
        // 方案 2: 标准 Style 标签注入
        try {
            const id = sheetType === 'global' ? 'hcid-global-style' : 'hcid-ui-style';
            let style = document.getElementById(id);
            if (!style) {
                style = document.createElement('style');
                style.id = id;
                // 尝试获取 nonce 绕过 CSP
                const nonceEl = document.querySelector('script[nonce], style[nonce]');
                if (nonceEl && nonceEl.nonce) style.setAttribute('nonce', nonceEl.nonce);
                (document.head || document.documentElement).appendChild(style);
            }
            style.textContent = css;
        } catch (e) {
            console.error("样式注入完全失败", e);
        }
    }
 
    // ================= 🎨 核心样式逻辑 =================
    function applyStyle(base64Img, currentConfig) {
        if (!base64Img) return;

        // ⛔ 排除视频网站 (如 YouTube, 抖音) 以避免播放器 Bug
        const hostname = window.location.hostname;
        if (hostname.includes('youtube.com') || hostname.includes('douyin.com')) {
            console.log('[Wallpaper] Script disabled for this site to prevent playback issues.');
            return;
        }

        // 1. 🌈 主题判定逻辑
        let isDark = false;
        if (currentConfig.theme === 'auto') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = currentConfig.theme === 'dark';
        }

        // 2. 🎨 定义动态变量 (深色 vs 浅色)
        // 浅色模式: 纯白底
        // 深色模式: 深灰蓝底 (非纯黑，避免死板) + 微弱亮边框 (Rim Light)
        const bgBase = isDark ? "20, 24, 30" : "255, 255, 255"; 
        const glassBorder = isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "none";
        const fontColorOverride = isDark ? "color: #ffffff !important; text-shadow: 0 1px 1px rgba(0,0,0,0.8);" : ""; 

        // 3. 🧠 智能层级计算 (防止颜色堆叠过重)
        // 逻辑：层级越深，背景透明度越低。
        // Level 1 (Base): 100% of config opacity
        // Level 2 (Depth 3): 60%
        // Level 3 (Depth 5): 30%
        // Level 4 (Depth 7+): 0% (Transparent)
        const op = currentConfig.opacity;
        const opLvl2 = (op * 0.6).toFixed(3);
        const opLvl3 = (op * 0.3).toFixed(3);

        let css = `
            /* 1. 底层壁纸 */
            body {
                background-image: url('${base64Img}') !important;
                background-attachment: fixed !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                /* 强制全局文字颜色 (Variant A 独有) */
                ${isDark ? 'color: #ffffff !important;' : ''}
            }
            
            /* 强制所有元素文字变白 (慎用，可能破坏高亮，但这是 A 方案的核心) */
            ${isDark ? `
            *:not(i):not([class*="icon"]):not(svg *) {
                color: #ffffff !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }
            a { color: #66ccff !important; }
            ` : ''}

            /* 2. 智能透明化 (排除视频播放器和Canvas) */
            ${!window.location.hostname.includes('youtube.com') ? `
            div:not(.html5-video-player):not(.ytp-chrome-bottom):not(.bilibili-player-video-wrap),
            section, article, main, header, footer, aside, nav, table, form {
                background-color: rgba(${bgBase}, ${currentConfig.opacity}) !important;
                background-image: none !important;
                --bg-color: transparent !important;
                --background-primary: transparent !important;
                box-shadow: none !important;
                
                /* 深色模式下的高级感边框 (仅在深色生效) */
                border-color: rgba(255, 255, 255, 0.05) !important; 
                ${isDark ? `border: ${glassBorder} !important;` : ''}
            }

            /* --- 🧠 智能防堆叠逻辑 (Depth Mitigation) --- */
            /* 3层嵌套：减淡至 60% */
            div div div:not(.html5-video-player):not(.ytp-chrome-bottom) {
                background-color: rgba(${bgBase}, ${opLvl2}) !important;
            }
            /* 5层嵌套：减淡至 30% */
            div div div div div:not(.html5-video-player):not(.ytp-chrome-bottom) {
                background-color: rgba(${bgBase}, ${opLvl3}) !important;
            }
            /* 7层嵌套：完全透明 (避免黑洞) */
            div div div div div div div:not(.html5-video-player):not(.ytp-chrome-bottom) {
                background-color: transparent !important;
            }
            ` : ''}

            /* 3. 毛玻璃效果 */
            body, #app, #root, main {
                backdrop-filter: blur(${currentConfig.blur}px) !important;
                -webkit-backdrop-filter: blur(${currentConfig.blur}px) !important;
            }

            /* 4. 输入框强化可见性 */
            input, textarea, pre, code, select {
                background-color: rgba(${bgBase}, 0.7) !important;
                backdrop-filter: blur(10px) !important;
                ${fontColorOverride}
            }

            /* 5. 保护媒体元素 */
            img, video, canvas, svg, iframe {
                background-color: transparent !important;
                opacity: 1 !important;
            }
        `;

        // 6. 📧 Gmail 专属适配
        if (window.location.hostname.includes('mail.google.com')) {
            css += `
                :root {
                    --ink-surface-background: transparent !important;
                    --apps-square-background: transparent !important;
                }
                div[role="main"], .aek {
                    background: transparent !important;
                }
                /* Gmail 暗黑模式适配 */
                [data-ogsc] .body {
                    background-color: transparent !important;
                }
                [data-ogsc] {
                    --background-default: transparent !important;
                    --background-surface: transparent !important;
                }
                /* 列表项背景微调，避免完全看不清文字 */
                .zA {
                    background-color: rgba(${bgBase}, ${currentConfig.opacity}) !important;
                }
                /* 选中项高亮 */
                .zA.x7 {
                    background-color: rgba(${bgBase}, ${parseFloat(currentConfig.opacity) + 0.2}) !important;
                }
            `;
        }

        updateStyleSheet(css, 'global');
    }

 
    // ================= 🖼️ 下载逻辑 =================
    function fetchAndApply(forceDownload = false) {
        if (cachedImgData && cachedUrl === config.url && !forceDownload) {
            applyStyle(cachedImgData, config);
            return;
        }
 
        console.log(`[Wallpaper] Starting download (URL changed or no cache): ${config.url}`);
        // 这里不调用 showToast，因为 UI 还没初始化好，或者可能被 Shadow DOM 隔离
 
        GM_xmlhttpRequest({
            method: "GET",
            url: config.url,
            responseType: "blob",
            timeout: 30000,
            onload: function(response) {
                if (response.status === 200) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        const result = reader.result;
                        // 阈值检查：3MB * 1.35 ≈ 4.1MB
                        if (result.length > 3 * 1024 * 1024 * 1.35) {
                            applyStyle(result, config);
                        } else {
                            cachedImgData = result;
                            cachedUrl = config.url;
                            safeSetValue('cached_bg_data', cachedImgData);
                            safeSetValue('cached_url', cachedUrl);
                            applyStyle(cachedImgData, config);
                        }
                    };
                    reader.readAsDataURL(response.response);
                } else {
                     if (cachedImgData) applyStyle(cachedImgData, config);
                }
            },
            onerror: function(err) {
                 if (cachedImgData) applyStyle(cachedImgData, config);
            },
            ontimeout: function() {
                 if (cachedImgData) applyStyle(cachedImgData, config);
            }
        });
    }
 
    // ================= 🖥️ UI 构建 (Shadow DOM 终极隔离版) =================
    // 解决“能拖动但看不见”的问题：使用 Shadow DOM 彻底隔离外部 CSS 污染
    function createUI() {
        const hostId = 'hcid-wallpaper-host';
        if (document.getElementById(hostId)) return;
 
        // 1. 创建宿主 (Host)，直接挂载到 html 根节点，层级更高
        const host = document.createElement('div');
        host.id = hostId;
        // 宿主作为定位基准，拦截所有外部样式
        host.style.cssText = `
            position: fixed;
            top: 15%;
            right: 20px;
            z-index: 2147483647;
            width: 0;
            height: 0;
            overflow: visible;
            font-family: sans-serif;
            line-height: normal;
        `;
 
        // 2. 创建 Shadow Root (隔离罩)
        const shadow = host.attachShadow({ mode: 'open' });
 
        // 3. 内部容器
        const container = document.createElement('div');
        container.id = 'hcid-container';
 
        // --- 悬浮球 ---
        const ball = document.createElement('div');
        ball.id = 'hcid-ball';
        ball.title = '壁纸设置';
        
        // 使用 DOM API 创建 SVG 以规避 TrustedHTML 限制
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(xmlns, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const circle = document.createElementNS(xmlns, 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '3');
        svg.appendChild(circle);

        const path = document.createElementNS(xmlns, 'path');
        path.setAttribute('d', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z');
        svg.appendChild(path);

        ball.appendChild(svg);
 
        // --- 面板 ---
        const panel = document.createElement('div');
        panel.id = 'hcid-panel';
        panel.className = 'hidden';
 
        // 辅助函数：构建设置项
        const createGroup = (labelText, inputEl, valSpanId = null) => {
            const group = document.createElement('div');
            group.className = 'hcid-group';
            const row = document.createElement('div');
            row.className = 'hcid-label-row';
 
            const label = document.createElement('label');
            label.textContent = labelText;
            row.appendChild(label);
 
            if (valSpanId) {
                const span = document.createElement('span');
                span.id = valSpanId; // 这里ID在ShadowDOM内是唯一的
                span.textContent = inputEl.value + (inputEl.type === 'range' && inputEl.max > 1 ? 'px' : '');
                row.appendChild(span);
            }
            group.appendChild(row);
            group.appendChild(inputEl);
            return group;
        };
 
        // 透明度
        const inputOpacity = document.createElement('input');
        inputOpacity.type = 'range';
        inputOpacity.min = 0; inputOpacity.max = 0.5; inputOpacity.step = 0.01;
        inputOpacity.value = config.opacity;
        inputOpacity.oninput = (e) => shadow.getElementById('val-opacity').textContent = e.target.value;
        panel.appendChild(createGroup("背景透明度", inputOpacity, 'val-opacity'));
 
        // 模糊度
        const inputBlur = document.createElement('input');
        inputBlur.type = 'range';
        inputBlur.min = 0; inputBlur.max = 10; inputBlur.step = 0.1;
        inputBlur.value = config.blur;
        inputBlur.oninput = (e) => shadow.getElementById('val-blur').textContent = e.target.value + 'px';
        panel.appendChild(createGroup("背景模糊度", inputBlur, 'val-blur'));

        // 主题选择
        const themeGroup = document.createElement('div');
        themeGroup.className = 'hcid-group';
        const themeRow = document.createElement('div');
        themeRow.className = 'hcid-label-row';
        const themeLabel = document.createElement('label');
        themeLabel.textContent = '外观模式';
        themeRow.appendChild(themeLabel);
        themeGroup.appendChild(themeRow);

        const selectTheme = document.createElement('select');
        selectTheme.style.width = '100%';
        selectTheme.style.padding = '4px';
        selectTheme.style.borderRadius = '4px';
        selectTheme.style.border = '1px solid #ccc';
        
        const opts = [
            {v: 'auto', t: '🌗 跟随系统 (自动)'},
            {v: 'light', t: '☀️ 浅色 (白水晶)'},
            {v: 'dark', t: '🌑 深色 (黑水晶)'}
        ];
        opts.forEach(o => {
            const op = document.createElement('option');
            op.value = o.v;
            op.textContent = o.t;
            if(config.theme === o.v) op.selected = true;
            selectTheme.appendChild(op);
        });
        themeGroup.appendChild(selectTheme);
        panel.appendChild(themeGroup);
 
        // 按钮组
        const btnGroup = document.createElement('div');
        btnGroup.className = 'hcid-btns';
 
        const btnSave = document.createElement('button');
        btnSave.id = 'hcid-btn-save';
        btnSave.textContent = '💾 保存设置';
        btnGroup.appendChild(btnSave);
 
        const btnReset = document.createElement('button');
        btnReset.id = 'hcid-btn-reset';
        btnReset.textContent = '🔄 恢复默认';
        btnGroup.appendChild(btnReset);
 
        panel.appendChild(btnGroup);
        container.appendChild(ball);
        container.appendChild(panel);
 
        // Toast
        const toast = document.createElement('div');
        toast.id = 'hcid-toast';
        container.appendChild(toast);
 
        // --- 样式注入 (注入到 Shadow DOM 内部，外部无法干扰) ---
        const style = document.createElement('style');
        style.textContent = `
            :host { all: initial; } /* 阻断继承 */
            #hcid-container { position: relative; }
 
            #hcid-ball {
                width: 48px; height: 48px;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                cursor: grab;
                color: white;
                filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.9));
                transition: transform 0.2s;
                /* 确保可见性 */
                opacity: 1; visibility: visible; display: flex;
            }
            #hcid-ball svg {
                stroke: white; fill: transparent; stroke-width: 2px;
                width: 28px; height: 28px; display: block;
                filter: drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black);
            }
            #hcid-ball:hover { transform: scale(1.1); }
            #hcid-ball:active { cursor: grabbing; }
 
            #hcid-panel {
                position: absolute; top: 60px; right: 0; width: 260px;
                background: rgba(255,255,255,0.9); backdrop-filter: blur(20px);
                border-radius: 12px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                transition: 0.2s; transform-origin: top right;
                color: #333; font-size: 14px;
            }
            #hcid-panel.hidden { opacity: 0; pointer-events: none; transform: scale(0.9); }
            .hcid-group { margin-bottom: 12px; }
            .hcid-label-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #555; font-weight: bold; }
            input[type=range] { width: 100%; }
            .hcid-btns { display: flex; gap: 10px; margin-top: 15px; }
            button { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; }
            #hcid-btn-save { background: #007aff; color: white; }
            #hcid-btn-reset { background: #f2f2f7; color: #333; }
            #hcid-toast {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8); color: white; padding: 10px 20px; border-radius: 20px;
                font-size: 14px; opacity: 0; pointer-events: none; transition: opacity 0.3s; width: max-content;
                z-index: 999;
            }
            #hcid-toast.show { opacity: 1; }
        `;
 
        shadow.appendChild(style);
        shadow.appendChild(container);
 
        // 挂载到 documentElement (html) 而不是 body，避免 body 样式影响
        (document.documentElement || document.body).appendChild(host);
 
        // --- 事件逻辑 (针对 Host 操作) ---
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, initialLeft, initialTop;
 
        // 注意：事件监听的是 shadow 内部的 ball
        ball.onmousedown = (e) => {
            isDragging = true; hasMoved = false;
            startX = e.clientX; startY = e.clientY;
 
            // 获取宿主的位置
            const rect = host.getBoundingClientRect();
 
            // 转换为 left/top 定位
            host.style.right = 'auto';
            host.style.left = rect.left + 'px';
            host.style.top = rect.top + 'px';
 
            initialLeft = rect.left; initialTop = rect.top;
        };
 
        document.onmousemove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved = true;
 
            // 移动宿主
            host.style.left = (initialLeft + dx) + 'px';
            host.style.top = (initialTop + dy) + 'px';
        };
 
        document.onmouseup = () => { isDragging = false; };
 
        ball.onclick = () => { if (!hasMoved) panel.classList.toggle('hidden'); };
 
        btnSave.onclick = () => {
            config = {
                url: DEFAULT_CONFIG.url,
                opacity: inputOpacity.value,
                blur: inputBlur.value,
                theme: selectTheme.value
            };
            safeSetValue('user_config', config);
            applyStyle(cachedImgData, config);
 
            // 显示 Toast (在 Shadow DOM 内部)
            const t = shadow.getElementById('hcid-toast');
            if(t) {
                t.textContent = "✨ 样式设置已保存";
                t.classList.add('show');
                setTimeout(() => t.classList.remove('show'), 2000);
            }
        };
 
        btnReset.onclick = () => {
            if (confirm("重置所有设置？")) {
                GM_deleteValue('user_config');
                location.reload();
            }
        };
    }
 
    // ================= 🚀 启动逻辑 =================
    if (cachedImgData && cachedUrl === config.url) {
        applyStyle(cachedImgData, config);
    } else {
        fetchAndApply(true);
    }
 
    // 监听系统主题变化 (仅在 auto 模式下生效)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (config.theme === 'auto' && cachedImgData) {
            console.log("[壁纸脚本] 系统主题变更，自动切换风格...");
            applyStyle(cachedImgData, config);
        }
    });

    const observer = new MutationObserver(() => {
        if (document.body) {
            createUI();
            observer.disconnect();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
    window.addEventListener('DOMContentLoaded', createUI);
 
})();