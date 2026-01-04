// ==UserScript==
// @name         OOPZ 语音 Web端背景自定义
// @namespace    https://greasyfork.org/zh-CN/scripts/558049
// @version      1.1.0
// @description  OOPZ 语音 网页端的背景修改工具。支持上传本地图片或使用网络 URL，可调整透明度与模糊度。通过油猴菜单 "🎨 设置背景" 打开面板。
// @author       Gemini & User
// @match        https://web.oopz.cn/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://web.oopz.cn/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558049/OOPZ%20%E8%AF%AD%E9%9F%B3%20Web%E7%AB%AF%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558049/OOPZ%20%E8%AF%AD%E9%9F%B3%20Web%E7%AB%AF%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        bgUrl: "", 
        opacity: 0.7,
        blur: 0
    };

    // 读取配置
    let config = {
        bgUrl: GM_getValue('oopz_bg_url', DEFAULT_CONFIG.bgUrl),
        opacity: GM_getValue('oopz_opacity', DEFAULT_CONFIG.opacity),
        blur: GM_getValue('oopz_blur', DEFAULT_CONFIG.blur)
    };

    // 检查是否已同意免责声明
    const hasAcceptedDisclaimer = GM_getValue('oopz_disclaimer_accepted', false);

    // ================= 核心逻辑 =================

    function init() {
        // 如果未同意协议，弹出免责声明；否则直接应用样式
        if (!hasAcceptedDisclaimer) {
            showDisclaimer();
        } else {
            applyStyles();
            startObserver();
        }
    }

    function applyStyles() {
        const bgSource = config.bgUrl;
        const fallbackColor = bgSource ? "transparent" : "#000000";

        const customStyle = `
            body {
                background-color: ${fallbackColor} !important;
                background-image: url('${bgSource}') !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-attachment: fixed !important;
                backdrop-filter: blur(${config.blur}px) !important; 
            }

            flutter-view {
                opacity: ${config.opacity} !important;
                background: transparent !important;
                transition: opacity 0.3s ease;
            }
            
            flt-glass-pane {
                background: transparent !important;
                --flt-canvas-color: transparent !important; 
            }
        `;

        let oldStyle = document.getElementById('oopz-custom-style');
        if (oldStyle) oldStyle.remove();

        let styleEl = document.createElement('style');
        styleEl.id = 'oopz-custom-style';
        styleEl.innerHTML = customStyle;
        document.body.appendChild(styleEl);
    }

    // 监听 DOM 变化防止样式丢失
    function startObserver() {
        const observer = new MutationObserver(() => {
            if (!document.getElementById('oopz-custom-style')) {
                applyStyles();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ================= UI：免责声明弹窗 =================

    function showDisclaimer() {
        const modal = document.createElement('div');
        modal.id = 'oopz-disclaimer-modal';
        modal.innerHTML = `
            <div style="text-align:center; margin-bottom:15px;">
                <h3 style="color:#ff4d4f; margin:0 0 10px 0;">⚠️ 免责声明与风险提示</h3>
                <p style="font-size:13px; color:#ccc; line-height:1.5; text-align:left;">
                    欢迎使用 OOPZ 背景自定义工具。在使用前，请务必知晓以下风险：<br><br>
                    1. <b>账号风险</b>：本脚本属于第三方修改工具，虽然仅修改本地视觉效果，但理论上违反了用户协议中“变动软件运行效果”的条款，存在被封号的潜在风险。<br>
                    2. <b>内容合规</b>：请勿使用<b>色情、暴力、政治敏感</b>等违规图片作为背景。若在截图或直播中展示违规内容，可能导致账号被直接封禁。<br>
                    3. <b>责任界定</b>：本脚本仅供学习交流，<b>开发者不对您因使用本脚本而产生的任何账号损失或法律纠纷负责。</b>
                </p>
            </div>
            <button id="oopz-agree-btn" style="width:100%; padding:10px; background:#ff4d4f; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">我已知晓并同意，继续使用</button>
        `;
        document.body.appendChild(modal);

        // 样式
        GM_addStyle(`
            #oopz-disclaimer-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 380px; background: #1f1f1f; padding: 25px; border-radius: 10px;
                box-shadow: 0 0 50px rgba(0,0,0,0.9); border: 1px solid #444; color: #eee;
                z-index: 1000000; font-family: sans-serif;
            }
            #oopz-disclaimer-modal button:hover { opacity: 0.9; }
            /* 背景遮罩 */
            #oopz-disclaimer-mask {
                position: fixed; top:0; left:0; width:100%; height:100%;
                background: rgba(0,0,0,0.8); z-index: 999999;
            }
        `);

        // 遮罩
        const mask = document.createElement('div');
        mask.id = 'oopz-disclaimer-mask';
        document.body.appendChild(mask);

        // 点击同意
        document.getElementById('oopz-agree-btn').addEventListener('click', () => {
            GM_setValue('oopz_disclaimer_accepted', true);
            modal.remove();
            mask.remove();
            applyStyles();
            startObserver();
        });
    }

    // ================= UI：设置面板 =================

    function openPanel() {
        if (document.getElementById('oopz-setting-panel')) return;

        const displayUrl = config.bgUrl.startsWith('data:image') ? "（当前正在使用本地图片）" : config.bgUrl;

        const panel = document.createElement('div');
        panel.id = 'oopz-setting-panel';
        panel.innerHTML = `
            <h3 style="margin-top:0; color:#fff; border-bottom:1px solid #444; padding-bottom:10px;">OOPZ 背景设置</h3>
            
            <div class="item">
                <label>方式 A: 上传本地图片 <span style="font-size:12px;color:#f39c12;">(建议 < 2MB)</span></label>
                <input type="file" id="oopz-file-upload" accept="image/*" style="margin-top:5px;">
            </div>

            <div class="item">
                <label>方式 B: 网络图片链接 (URL)</label>
                <input type="text" id="oopz-input-url" value="${displayUrl}" placeholder="粘贴图片链接...">
            </div>

            <hr style="border:0; border-top:1px solid #444; margin: 15px 0;">

            <div class="item">
                <label>不透明度: <span id="val-opacity" style="color:#00bdff;">${config.opacity}</span></label>
                <input type="range" id="oopz-input-opacity" min="0.1" max="1" step="0.05" value="${config.opacity}">
            </div>
            
            <div class="item">
                <label>背景模糊 (px): <span id="val-blur" style="color:#00bdff;">${config.blur}</span></label>
                <input type="range" id="oopz-input-blur" min="0" max="20" step="1" value="${config.blur}">
            </div>

            <div class="btns">
                <button id="oopz-save">保存配置</button>
                <button id="oopz-close" style="background:#444;">关闭</button>
            </div>
        `;
        document.body.appendChild(panel);

        GM_addStyle(`
            #oopz-setting-panel {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 350px;
                background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(15px);
                padding: 25px; border-radius: 12px; z-index: 999999; color: #eee;
                box-shadow: 0 10px 50px rgba(0,0,0,0.8); border: 1px solid #555; font-family: sans-serif;
            }
            #oopz-setting-panel .item { margin-bottom: 15px; }
            #oopz-setting-panel label { display: block; font-size: 13px; margin-bottom: 6px; font-weight:bold; }
            #oopz-setting-panel input[type="text"] { 
                width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #ddd; box-sizing: border-box;
            }
            #oopz-setting-panel input[type="file"] { font-size: 12px; color: #ccc; }
            #oopz-setting-panel input[type="range"] { width: 100%; cursor: pointer; accent-color: #007bff; }
            #oopz-setting-panel .btns { display: flex; gap: 10px; margin-top: 25px; }
            #oopz-setting-panel button {
                flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; color: white; background: #007bff; font-weight: bold; transition: 0.2s;
            }
            #oopz-setting-panel button:hover { opacity: 0.9; transform: translateY(-1px); }
            #oopz-overlay {
                position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999998;
            }
        `);
        
        const overlay = document.createElement('div');
        overlay.id = 'oopz-overlay';
        document.body.appendChild(overlay);
        overlay.onclick = closePanel;

        function closePanel() {
            panel.remove();
            overlay.remove();
        }

        const inputUrl = document.getElementById('oopz-input-url');
        const inputFile = document.getElementById('oopz-file-upload');

        inputFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 3 * 1024 * 1024) {
                alert('⚠️ 图片太大 (' + (file.size/1024/1024).toFixed(1) + 'MB)，建议压缩到 2MB 以下。');
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                config.bgUrl = event.target.result;
                inputUrl.value = "（已选中本地图片，点击保存生效）";
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('oopz-input-opacity').addEventListener('input', (e) => {
            document.getElementById('val-opacity').innerText = e.target.value;
            config.opacity = e.target.value;
            if(hasAcceptedDisclaimer || GM_getValue('oopz_disclaimer_accepted')) applyStyles();
        });
        document.getElementById('oopz-input-blur').addEventListener('input', (e) => {
            document.getElementById('val-blur').innerText = e.target.value;
            config.blur = e.target.value;
            if(hasAcceptedDisclaimer || GM_getValue('oopz_disclaimer_accepted')) applyStyles();
        });

        document.getElementById('oopz-save').addEventListener('click', () => {
            if (!inputUrl.value.startsWith('（')) {
                config.bgUrl = inputUrl.value;
            }
            GM_setValue('oopz_bg_url', config.bgUrl);
            GM_setValue('oopz_opacity', config.opacity);
            GM_setValue('oopz_blur', config.blur);
            alert('✅ 设置已保存');
            applyStyles(); 
            closePanel();
        });

        document.getElementById('oopz-close').addEventListener('click', closePanel);
    }

    // ================= 初始化 =================
    GM_registerMenuCommand("🎨 设置背景 / 上传图片", openPanel);

    window.onload = init;

})();