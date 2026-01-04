// ==UserScript==
// @name         GitHub Image Uploader Pro
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  图片上传 - 🖼️图片预览 + 📱移动端长按 + 💻PC端右键 + 🎨11款皮肤
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/558545/GitHub%20Image%20Uploader%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558545/GitHub%20Image%20Uploader%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 🎨 主题皮肤库 (Theme Repository)
    // ==========================================
    const THEMES = {
        "crystal": {
            name: "🍇 水晶葡萄 (Crystal)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');
                :root { --gh-bg: rgba(255,255,255,0.95); --gh-main: #a29bfe; --gh-sub: #74b9ff; --gh-text: #636e72; --gh-radius: 32px; --gh-shadow: 0 20px 60px rgba(162,155,254,0.25); }
                .swal2-popup { backdrop-filter: blur(10px); border: 1px solid #fff; }
                .gh-btn-primary { background: var(--gh-main); color: #fff; box-shadow: 0 8px 20px rgba(162,155,254,0.4); }
                .gh-btn-accent { background: var(--gh-sub); color: #fff; }
                .gh-float-menu { background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); color: var(--gh-main); border: 2px solid #fff; box-shadow: 0 10px 30px rgba(162,155,254,0.3); border-radius: 50px; }
                .gh-float-menu:hover { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); color: #fff; transform: translateY(-4px) scale(1.05); }
                .gh-input { background: #f1f2f6; border: 2px solid transparent; border-radius: 16px; }
                .gh-input:focus { background: #fff; border-color: var(--gh-main); box-shadow: 0 0 0 4px rgba(162,155,254,0.1); }
            `
        },
        "pop": {
            name: "🎀 波普甜心 (Pop Art)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500&display=swap');
                :root { --gh-bg: #ffffff; --gh-main: #ff4757; --gh-sub: #2f3542; --gh-text: #2f3542; --gh-radius: 24px; --gh-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); }
                .swal2-popup { animation: popUp 0.6s cubic-bezier(0.68,-0.6,0.32,1.6) forwards !important; font-family: 'Fredoka', sans-serif !important; }
                @keyframes popUp { 0%{opacity:0;transform:scale(0.5) translateY(50px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
                .gh-btn-primary { background: var(--gh-main); color: #fff; box-shadow: 0 10px 20px rgba(255,71,87,0.3); }
                .gh-btn-accent { background: var(--gh-sub); color: #fff; }
                .gh-float-menu { background: var(--gh-main); color: #fff; border-radius: 50px; box-shadow: 0 15px 35px rgba(255,71,87,0.4); }
                .gh-float-menu:hover { transform: scale(1.15) rotate(-3deg); }
                .gh-input { background: #f1f2f6; border-radius: 12px; transition: 0.4s cubic-bezier(0.68,-0.6,0.32,1.6); }
                .gh-input:focus { background: #fff; border: 2px solid var(--gh-main); transform: scale(1.02); }
            `
        },
        "aurora": {
            name: "🦄 极光软泥 (Aurora)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');
                :root { --gh-bg: rgba(255,255,255,0.85); --gh-main: #8EC5FC; --gh-sub: #E0C3FC; --gh-text: #6B7A8F; --gh-radius: 32px; --gh-shadow: 0 20px 60px rgba(162,177,201,0.3); }
                .swal2-popup { backdrop-filter: blur(24px); border: 2px solid #fff; }
                .swal2-popup::before { content:''; position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg, #FF9A9E, #FECFEF, #E0C3FC); }
                .gh-btn-primary { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); color: #fff; }
                .gh-btn-accent { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: #fff; }
                .gh-float-menu { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); color: #FF9A9E; border: 2px solid #fff; border-radius: 50px; box-shadow: 0 10px 30px rgba(161,140,209,0.3); }
                .gh-float-menu:hover { background:#fff; transform:scale(1.1); box-shadow: 0 15px 40px rgba(255,154,158,0.4); }
                .gh-input { background: #F0F4F8; border-radius: 20px; box-shadow: inset 4px 4px 8px rgba(166,180,200,0.2), inset -4px -4px 8px #fff; border: none; }
                .gh-input:focus { background: #fff; box-shadow: 0 6px 15px rgba(162,177,201,0.2); }
            `
        },
        "candy": {
            name: "🍬 糖果少女 (Candy)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');
                :root { --gh-bg: #fffdf9; --gh-main: #ff9a9e; --gh-sub: #84fab0; --gh-text: #5d54a4; --gh-radius: 25px; --gh-shadow: 0 10px 25px rgba(255,154,158,0.3); }
                .swal2-popup { border: 4px solid #fff; font-family: 'Quicksand', sans-serif !important; }
                .gh-btn-primary { background: linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border-radius: 50px; }
                .gh-btn-accent { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: #fff; border-radius: 50px; }
                .gh-float-menu { background: #fff; border: 2px solid #ff9a9e; color: #ff9a9e; border-radius: 50px; box-shadow: 0 8px 20px rgba(255,154,158,0.3); }
                .gh-float-menu:hover { background: #ff9a9e; color: #fff; transform: translateY(-5px); }
                .gh-input { border: 2px solid #fcecef; border-radius: 15px; }
                .gh-input:focus { border-color: #ff9a9e; background: #fffbfc; }
            `
        },
        "forest": {
            name: "🌿 森之呼吸 (Forest)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');
                :root { --gh-bg: rgba(240, 255, 245, 0.95); --gh-main: #2ecc71; --gh-sub: #27ae60; --gh-text: #2d3436; --gh-radius: 24px; --gh-shadow: 0 15px 35px rgba(46, 204, 113, 0.25); }
                .swal2-popup { font-family: 'Quicksand', sans-serif !important; border: 1px solid #e0f2f1; }
                .gh-float-menu { background: #fff; border: 2px solid #2ecc71; color: #2ecc71; border-radius: 12px; }
                .gh-float-menu:hover { background: #2ecc71; color: #fff; border-radius: 24px; }
                .gh-btn-primary { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: #fff; }
                .gh-btn-accent { background: #fff; color: #27ae60; border: 1px solid #27ae60; }
                .gh-input { background: #e8f5e9; border: 1px solid transparent; border-radius: 8px; }
                .gh-input:focus { border-color: #2ecc71; background: #fff; }
            `
        },
        "sakura": {
            name: "🌸 落樱缤纷 (Sakura)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap');
                :root { --gh-bg: rgba(255, 240, 245, 0.95); --gh-main: #fd79a8; --gh-sub: #fab1a0; --gh-text: #636e72; --gh-radius: 50px; --gh-shadow: 0 10px 25px rgba(253, 121, 168, 0.3); }
                .swal2-popup { font-family: 'Kosugi Maru', sans-serif !important; border: 2px solid #fff; }
                .gh-float-menu { background: #fff; border: 2px solid #fd79a8; color: #fd79a8; border-radius: 20px; }
                .gh-float-menu:hover { background: linear-gradient(to right, #ff9a9e, #fad0c4); color: #fff; border-color: transparent; animation: rotate-shiver 0.3s; }
                @keyframes rotate-shiver { 0% { transform: rotate(0); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } 100% { transform: rotate(0); } }
                .gh-btn-primary { background: #fd79a8; color: #fff; border-radius: 20px; }
                .gh-btn-accent { background: #fab1a0; color: #fff; border-radius: 20px; }
                .gh-input { border: 2px solid #f8a5c2; border-radius: 20px; background: #fff; }
                .gh-input:focus { box-shadow: 0 0 8px rgba(253, 121, 168, 0.4); }
            `
        },
        "midnight": {
            name: "🕶️ 极简黑金 (Midnight)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap');
                :root { --gh-bg: rgba(10, 10, 10, 0.95); --gh-main: #eebbbc; --gh-sub: #333; --gh-text: #fff; --gh-radius: 0; --gh-shadow: 0 20px 50px rgba(0,0,0,0.8); }
                .gh-float-menu { background: #000; border: 1px solid #333; color: #fff; letter-spacing: 2px; text-transform: uppercase; font-size: 12px !important; border-radius: 0; }
                .gh-float-menu:hover { border-color: #eebbbc; color: #eebbbc; box-shadow: 0 0 15px rgba(238, 187, 188, 0.3); }
                .gh-input { background: #111 !important; color: #fff !important; border: 1px solid #333 !important; border-radius: 0 !important; }
                .gh-input:focus { border-color: #eebbbc !important; }
                .swal2-popup { border: 1px solid #333; font-family: 'Montserrat', sans-serif !important; }
                .gh-btn-primary { background: #fff; color: #000; border-radius: 0; }
                .gh-btn-primary:hover { background: #eebbbc; }
                .gh-btn-accent { background: #333; color: #fff; border-radius: 0; }
                .gh-label { color: #888; }
            `
        },
        "terminal": {
            name: "📟 复古终端 (Terminal)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap');
                :root { --gh-bg: #0c0c0c; --gh-main: #00ff00; --gh-sub: #003300; --gh-text: #00ff00; --gh-radius: 4px; --gh-shadow: 0 0 0 2px #003300; }
                .gh-float-menu { background: #000; border: 1px solid #00ff00; color: #00ff00; box-shadow: 4px 4px 0 #003300; border-radius: 0; }
                .gh-float-menu:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #003300; background: #001100; }
                .swal2-popup { border: 1px solid #00ff00; font-family: 'Fira Code', monospace !important; }
                .gh-input { background: #000 !important; color: #00ff00 !important; border: 1px dashed #005500 !important; font-family: 'Fira Code' !important; border-radius: 0; }
                .gh-btn-primary { background: #000; border: 1px solid #00ff00; color: #00ff00; border-radius: 0; }
                .gh-btn-primary:hover { background: #00ff00; color: #000; }
                .gh-btn-accent { background: #001100; color: #00aa00; border: 1px solid #00aa00; border-radius: 0; }
                .gh-input::after { content: '_'; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `
        },
        "cyber": {
            name: "🔮 赛博霓虹 (Cyber)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');
                :root { --gh-bg: rgba(18, 18, 18, 0.95); --gh-main: #00f3ff; --gh-sub: #ff00de; --gh-text: #e0e0e0; --gh-radius: 8px; --gh-shadow: 0 0 20px rgba(0, 243, 255, 0.2); }
                @keyframes neon-pulse { 0% { box-shadow: 0 0 5px #00f3ff; } 50% { box-shadow: 0 0 20px #00f3ff, 0 0 10px #ff00de; } 100% { box-shadow: 0 0 5px #00f3ff; } }
                .gh-float-menu { background: #000; border: 1px solid #00f3ff; color: #00f3ff; animation: neon-pulse 3s infinite; border-radius: 4px; }
                .gh-float-menu:hover { background: #00f3ff; color: #000; }
                .gh-input { background: #111 !important; color: #00f3ff !important; border: 1px solid #333 !important; border-radius: 4px; }
                .gh-btn-primary { background: linear-gradient(90deg, #00f3ff, #ff00de); color: #fff; border: none; border-radius: 4px; }
                .gh-btn-accent { background: #111; border: 1px solid #ff00de; color: #ff00de; border-radius: 4px; }
                .swal2-popup { font-family: 'Orbitron', sans-serif !important; border: 1px solid #333; }
            `
        },
        "pixel": {
            name: "🎮 8-Bit 像素 (Pixel)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                :root { --gh-bg: #f1c40f; --gh-main: #e74c3c; --gh-sub: #2c3e50; --gh-text: #2c3e50; --gh-radius: 0; --gh-shadow: 8px 8px 0 #000; }
                .gh-float-menu { background: #fff; border: 4px solid #000; color: #000; font-size: 10px !important; box-shadow: 4px 4px 0 #000; border-radius: 0; }
                .gh-float-menu:hover { transform: translate(4px, 4px); box-shadow: none; background: #e74c3c; color: #fff; }
                .swal2-popup { border: 4px solid #000; box-shadow: 8px 8px 0 #000; font-family: 'Press Start 2P', cursive !important; }
                .gh-input { border: 4px solid #000 !important; font-size: 10px; border-radius: 0; }
                .gh-btn { border: 4px solid #000; box-shadow: 4px 4px 0 #000; border-radius: 0; }
                .gh-btn:active { transform: translate(4px, 4px); box-shadow: none; }
                .gh-btn-primary { background: #e74c3c; color: #fff; }
                .gh-btn-accent { background: #3498db; color: #fff; }
            `
        },
        "dream": {
            name: "☁️ 浮梦流光 (Dream)",
            css: `
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');
                :root { --gh-bg: rgba(255, 255, 255, 0.75); --gh-main: #70a1ff; --gh-sub: #a18cd1; --gh-text: #535c68; --gh-radius: 40px; --gh-shadow: 0 15px 40px rgba(112, 161, 255, 0.3); }
                @keyframes gradient-bg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .swal2-popup { background: linear-gradient(-45deg, #e0c3fc, #8ec5fc, #90f7ec); background-size: 400% 400%; animation: gradient-bg 15s ease infinite; border: 2px solid #fff; font-family: 'Quicksand', sans-serif !important; }
                .gh-float-menu { background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%); color: #fff; border: 2px solid #fff; border-radius: 40px; }
                .gh-float-menu:hover { transform: scale(1.1) rotate(5deg); background: linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%); }
                .gh-btn-primary { background: #fff; color: #70a1ff; border-radius: 40px; }
                .gh-btn-accent { background: rgba(255,255,255,0.5); color: #fff; border: 1px solid #fff; border-radius: 40px; }
                /* 补丁：Dream 主题透明输入框 */
                .gh-input { border: 2px solid transparent; border-radius: 16px; }
                .gh-input:focus { background: #fff; box-shadow: 0 5px 15px rgba(112, 161, 255, 0.2); }
            `
        }
    };

    // 公共基础 CSS (Base CSS)
    const baseCSS = `
        div:where(.swal2-container) div:where(.swal2-popup) {
            background: var(--gh-bg) !important;
            border-radius: var(--gh-radius) !important;
            box-shadow: var(--gh-shadow) !important;
            padding: 0 !important;
            width: 500px !important;
            overflow: visible !important;
        }
        div:where(.swal2-title) { padding: 25px !important; font-size: 22px !important; color: var(--gh-text) !important; }
        div:where(.swal2-html-container) { padding: 10px 30px 30px !important; color: var(--gh-text) !important; }
        .gh-config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; text-align: left; }
        .gh-form-group.full-width { grid-column: 1 / -1; }
        .gh-label { display: block; font-size: 13px; color: var(--gh-text); opacity: 0.7; margin-bottom: 5px; font-weight: 600; margin-left: 8px; }
        .gh-input { width: 100%; padding: 12px 16px; font-size: 14px; color: var(--gh-text); box-sizing: border-box; outline: none; transition: 0.3s; }
        .gh-actions { margin-top: 25px; display: flex; justify-content: center; gap: 12px; }
        .gh-btn { border: none; padding: 10px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; border-radius: 50px; }
        .gh-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .gh-btn:active { transform: scale(0.95); }
        .gh-status-bar { padding: 10px; margin-bottom: 15px; border-radius: 12px; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(0,0,0,0.03); color: var(--gh-text); }
        
        .gh-float-menu { position: fixed; z-index: 10000; padding: 10px 20px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); animation: gh-fade 0.5s; opacity: 0; animation-fill-mode: forwards; }
        @keyframes gh-fade { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
        .gh-float-menu svg { width: 18px; height: 18px; fill: currentColor; }
        
        /* 预览图片样式 */
        .gh-result-card { background: rgba(0,0,0,0.02); border-radius: 16px; padding: 12px; border: 1px dashed rgba(0,0,0,0.1); }
        .gh-preview-image { max-width: 100%; max-height: 180px; object-fit: contain; border-radius: 8px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: rgba(255,255,255,0.5); }
        
        .gh-code-block { width: 100%; padding: 10px; background: #fff; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; color: var(--gh-text); font-size: 12px; text-align: center; cursor: pointer; }
        .gh-theme-select { width: 100%; padding: 10px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.5); color: var(--gh-text); font-size: 14px; margin-bottom: 20px; outline: none; cursor: pointer; }
    `;

    // ==========================================
    // 🎨 样式管理 (Style Manager)
    // ==========================================
    function applyTheme(themeKey) {
        // 1. 移除旧主题
        const oldStyle = document.getElementById('gh-custom-style');
        if (oldStyle) oldStyle.remove();

        // 2. 注入新主题
        const style = document.createElement('style');
        style.id = 'gh-custom-style';
        style.textContent = baseCSS + (THEMES[themeKey] ? THEMES[themeKey].css : THEMES['crystal'].css);
        document.head.appendChild(style);

        // 3. 保存设置
        GM_setValue('theme', themeKey);
    }

    // 初始化主题
    const currentTheme = GM_getValue('theme', 'crystal');
    applyTheme(currentTheme);


    // ==========================================
    // 🧠 核心功能 (Core Logic)
    // ==========================================
    window.GitHubUploader = window.GitHubUploader || {};
    const DEFAULT_CONFIG = { githubToken: '', username: '', repo: '', branch: 'main', folder: 'images', customDomain: '' };

    function getConfig() {
        return {
            githubToken: GM_getValue('githubToken', DEFAULT_CONFIG.githubToken),
            username: GM_getValue('username', DEFAULT_CONFIG.username),
            repo: GM_getValue('repo', DEFAULT_CONFIG.repo),
            branch: GM_getValue('branch', DEFAULT_CONFIG.branch),
            folder: GM_getValue('folder', DEFAULT_CONFIG.folder),
            customDomain: GM_getValue('customDomain', DEFAULT_CONFIG.customDomain)
        };
    }

    function saveConfig(config) { Object.keys(config).forEach(key => GM_setValue(key, config[key])); }

    function githubApiRequest(url, method = 'GET', data = null, authType = 'auto') {
        return new Promise((resolve, reject) => {
            const token = GM_getValue('githubToken', '');
            if (!token) { reject(new Error('Token为空')); return; }
            if (authType === 'auto') authType = token.startsWith('ghp_') || token.startsWith('github_pat_') ? 'token' : 'Bearer';
            const authHeader = authType === 'Bearer' ? `Bearer ${token}` : `token ${token}`;

            GM_xmlhttpRequest({
                method, url,
                headers: { 'Authorization': authHeader, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'User-Agent': 'GitHub-Uploader-Pro' },
                data: (data && (method === 'POST' || method === 'PUT')) ? JSON.stringify(data) : null,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) resolve(res.responseText ? JSON.parse(res.responseText) : {});
                    else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: () => reject(new Error('Network Error'))
            });
        });
    }

    async function testGitHubConfig(config) {
        try {
            document.getElementById('configStatus').innerHTML = `<div class="gh-status-bar"><span class="spin">⚡</span> 正在连接...</div>`;
            const tempReq = (url) => new Promise((resolve, reject) => {
                 let auth = config.githubToken.startsWith('ghp_') ? `token ${config.githubToken}` : `Bearer ${config.githubToken}`;
                 GM_xmlhttpRequest({ method: 'GET', url, headers: { 'Authorization': auth, 'User-Agent': 'Test' }, onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText)) : reject(new Error(r.status)) });
            });
            const user = await tempReq('https://api.github.com/user');
            return { success: true, message: `连接成功！\nHi, ${user.login}` };
        } catch (e) { return { success: false, error: '连接失败，请检查配置' }; }
    }

    function copyToClipboard(text) {
        const input = document.createElement('input'); input.value = text; document.body.appendChild(input); input.select(); document.execCommand('copy'); document.body.removeChild(input);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500, icon: 'success', title: '链接已复制' });
    }

    // ==========================================
    // 🖥️ UI 界面 (Settings UI)
    // ==========================================
    function showConfigDialog() {
        const config = getConfig();
        const curTheme = GM_getValue('theme', 'crystal');

        // 生成主题选项 HTML
        let themeOptions = '';
        Object.keys(THEMES).forEach(key => {
            themeOptions += `<option value="${key}" ${curTheme === key ? 'selected' : ''}>${THEMES[key].name}</option>`;
        });

        Swal.fire({
            title: '<span>🎨</span> 风格 & 设置',
            html: `
                <select id="themeSelector" class="gh-theme-select">
                    ${themeOptions}
                </select>

                <div id="configStatus"></div>
                <div class="gh-config-grid">
                    <div class="gh-form-group full-width"><label class="gh-label">Token</label><input type="password" id="githubToken" class="gh-input" value="${config.githubToken}" placeholder="ghp_..."></div>
                    <div class="gh-form-group"><label class="gh-label">用户名</label><input type="text" id="username" class="gh-input" value="${config.username}"></div>
                    <div class="gh-form-group"><label class="gh-label">仓库名</label><input type="text" id="repo" class="gh-input" value="${config.repo}"></div>
                    <div class="gh-form-group"><label class="gh-label">分支</label><input type="text" id="branch" class="gh-input" value="${config.branch}"></div>
                    <div class="gh-form-group"><label class="gh-label">目录</label><input type="text" id="folder" class="gh-input" value="${config.folder}"></div>
                    <div class="gh-form-group full-width"><label class="gh-label">CDN 域名 (选填)</label><input type="text" id="customDomain" class="gh-input" value="${config.customDomain}"></div>
                </div>
                <div class="gh-actions">
                    <button id="testConfigBtn" class="gh-btn gh-btn-accent">🧪 测试连接</button>
                    <button id="saveConfigBtn" class="gh-btn gh-btn-primary">💾 保存配置</button>
                </div>
            `,
            showConfirmButton: false,
            width: '480px',
            didOpen: () => {
                // 监听主题切换
                document.getElementById('themeSelector').addEventListener('change', (e) => {
                    applyTheme(e.target.value);
                });

                const $ = (id) => document.getElementById(id);
                $('testConfigBtn').onclick = async () => {
                    const temp = { githubToken: $('githubToken').value, username: $('username').value, repo: $('repo').value };
                    const res = await testGitHubConfig(temp);
                    $('configStatus').innerHTML = `<div class="gh-status-bar" style="color:${res.success?'#27ae60':'#e74c3c'}">${res.success?'✨ '+res.message:'❌ '+res.error}</div>`;
                };
                $('saveConfigBtn').onclick = () => {
                    saveConfig({
                        githubToken: $('githubToken').value, username: $('username').value, repo: $('repo').value,
                        branch: $('branch').value || 'main', folder: $('folder').value, customDomain: $('customDomain').value
                    });
                    Swal.fire({ icon: 'success', title: '配置已保存', timer: 1000, showConfirmButton: false });
                };
            }
        });
    }

    // ==========================================
    // 🖱️ 交互 (Interaction)
    // ==========================================
    function setupInteraction() {
        // ----------------------------------------
        // PC端：右键菜单
        // ----------------------------------------
        document.addEventListener('contextmenu', e => {
            if (e.target.tagName === 'IMG') {
                // 阻止默认右键菜单
                if (!e.ctrlKey) { // 按住Ctrl键可呼出原生菜单
                    e.preventDefault();
                    showMenu(e.pageX, e.pageY, e.target);
                }
            }
        });

        // ----------------------------------------
        // 移动端：长按触发
        // ----------------------------------------
        let touchTimer;
        let startX, startY;
        const LONG_PRESS_DURATION = 800; // 长按800ms触发

        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'IMG') {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                touchTimer = setTimeout(() => {
                    showMenu(startX, startY, e.target);
                }, LONG_PRESS_DURATION);
            }
        }, { passive: true });

        document.addEventListener('touchend', () => clearTimeout(touchTimer));
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            // 如果手指移动超过10px，取消长按判定
            if (Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) {
                clearTimeout(touchTimer);
            }
        }, { passive: true });

        // ----------------------------------------
        // 菜单显示逻辑
        // ----------------------------------------
        function showMenu(x, y, img) {
            // 移除已存在的菜单
            if (document.getElementById('gh-float-menu')) document.getElementById('gh-float-menu').remove();

            const menu = document.createElement('div');
            menu.id = 'gh-float-menu';
            menu.className = 'gh-float-menu';
            
            // 防止菜单溢出屏幕
            const menuX = Math.min(x + 15, window.innerWidth - 130);
            const menuY = Math.min(y - 30, window.innerHeight - 50);
            
            menu.style.left = menuX + 'px';
            menu.style.top = menuY + 'px';
            menu.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg><span>上传</span>`;
            
            document.body.appendChild(menu);
            
            // 延迟绑定关闭事件，防止误触
            setTimeout(() => {
                const closeMenu = (ev) => {
                    if (menu && !menu.contains(ev.target)) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                        document.removeEventListener('touchstart', closeMenu);
                    }
                };
                document.addEventListener('click', closeMenu);
                document.addEventListener('touchstart', closeMenu, {passive: true});
            }, 100);

            menu.onclick = (ev) => { 
                ev.stopPropagation(); 
                menu.remove(); 
                handleUpload(img.src); 
            };
            
            // 5秒后自动消失
            setTimeout(() => { if(menu) menu.remove(); }, 5000);
        }
    }

    async function handleUpload(url) {
        Swal.fire({ title: '🚀 Uploading...', didOpen: () => Swal.showLoading() });
        try {
            const blob = await new Promise((res, rej) => GM_xmlhttpRequest({method:'GET', url, responseType:'blob', onload:r=>res(r.response), onerror:rej}));
            const reader = new FileReader(); reader.readAsDataURL(blob);
            const base64 = await new Promise(res => reader.onloadend = () => res(reader.result.split(',')[1]));
            
            const cfg = getConfig();
            if(!cfg.githubToken) throw new Error("请先设置 Token");
            
            const ext = blob.type.split('/')[1] || 'png';
            const fname = `${Date.now()}_${Math.random().toString(36).substr(2,4)}.${ext}`;
            const path = cfg.folder ? `${cfg.folder}/${fname}` : fname;
            
            await githubApiRequest(`https://api.github.com/repos/${cfg.username}/${cfg.repo}/contents/${path}`, 'PUT', { message: 'Upload', content: base64, branch: cfg.branch });
            const rawUrl = cfg.customDomain ? `${cfg.customDomain.replace(/\/$/,'')}/${path}` : `https://raw.githubusercontent.com/${cfg.username}/${cfg.repo}/${cfg.branch}/${path}`;

            Swal.fire({
                title: '🎉 成功',
                html: `
                    <div class="gh-result-card">
                        <img src="${rawUrl}" class="gh-preview-image">
                        <div style="margin-bottom:8px"><label class="gh-label">图片链接</label><input class="gh-code-block" value="${rawUrl}" readonly onclick="this.select()"></div>
                    </div>
                    <div class="gh-actions"><button id="cpBtn" class="gh-btn gh-btn-primary">📋 复制</button></div>
                `,
                showConfirmButton: false,
                didOpen: () => document.getElementById('cpBtn').onclick = () => copyToClipboard(rawUrl)
            });
        } catch (e) { Swal.fire({ icon: 'error', title: 'Oops!', text: e.message }); }
    }

    GM_registerMenuCommand('🎨 风格 & 设置', showConfigDialog);
    setupInteraction();
})();