// ==UserScript==
// @name         盒子IM 美化
// @namespace    https://github.com/
// @version      0.4
// @description  盒子IM 网页版美化
// @author       Grok做的
// @match        https://www.boxim.online/*
// @grant        none         
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564071/%E7%9B%92%E5%AD%90IM%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/564071/%E7%9B%92%E5%AD%90IM%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------ 基础公共样式 ------------------
    const baseStyle = `
        * {
            border-radius: 10px !important;
            transition: all 0.22s ease !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        body, #app, .app-container, .main-container {
            background: #000 !important;
        }

        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(120,120,140,0.5); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(180,180,200,0.8); }
    `;

    // ------------------ 主题定义（同之前） ------------------
    const themes = {
        cyberpunk: `/* 赛博朋克霓虹 */ 
            body{background:linear-gradient(135deg,#0d001a,#1a0033,#330033)!important;background-attachment:fixed!important;}
            .message-item.right .message-content,.self .message-bubble{background:#ff00aa!important;color:#fff!important;box-shadow:0 0 15px #ff00aa88;border:1px solid #ff00aa44;}
            .message-item.left .message-content,.other .message-bubble{background:#00ffff22!important;border:1px solid #00ffff66;color:#e0ffff!important;box-shadow:0 0 12px #00ffff55;}
            .input-area,.chat-input-container,.el-textarea__inner,textarea,[contenteditable="true"]{background:rgba(10,0,20,0.75)!important;border:1px solid #9900ff66!important;color:#d0a0ff!important;box-shadow:0 0 15px #9900ff33 inset;}
            .sidebar,.session-list{background:rgba(15,0,30,0.82)!important;border-right:1px solid #6600ff44;}
            .session-item.active{background:rgba(255,0,170,0.22)!important;border-left:4px solid #ff00aa!important;}
        `,

        sonoma: `/* macOS Sonoma磨砂 */
            body{background:url('https://images.unsplash.com/photo-1615712188214-296f1284b086?w=1920&q=70') center/cover fixed!important;}
            .input-area,.chat-input-container{background:rgba(30,30,46,0.58)!important;backdrop-filter:blur(20px) saturate(180%)!important;-webkit-backdrop-filter:blur(20px) saturate(180%)!important;border:1px solid rgba(255,255,255,0.08)!important;box-shadow:0 -6px 30px rgba(0,0,0,0.35)!important;}
            .el-textarea__inner,textarea{background:rgba(40,40,60,0.45)!important;border:1px solid rgba(200,200,220,0.18)!important;}
            .sidebar{background:rgba(25,25,40,0.65)!important;backdrop-filter:blur(16px)!important;}
            .message-item.right .message-content{background:rgba(40,200,120,0.82)!important;}
            .message-item.left .message-content{background:rgba(50,50,65,0.78)!important;}
        `,

        pureblack: `/* 纯黑极简 */
            body,#app,.app-container,.sidebar,.input-area,.message-content{background:#000000!important;}
            .message-item.right .message-content{background:#1a1a1a!important;border:1px solid #333!important;}
            .message-item.left .message-content{background:#111111!important;border:1px solid #222!important;}
            .input-area,.el-textarea__inner,textarea{background:#0a0a0a!important;border:1px solid #222!important;color:#ddd!important;}
            .session-item.active{background:#222!important;}
            *{border-radius:6px!important;}
        `,

        pinkgirl: `/* 粉色少女心 */
            body{background:linear-gradient(135deg,#2d001a,#4a0033,#33004a)!important;}
            .message-item.right .message-content{background:#ff69b4!important;color:white;box-shadow:0 2px 12px #ff69b488;}
            .message-item.left .message-content{background:rgba(255,182,193,0.4)!important;color:#2d001a;}
            .input-area{background:rgba(80,0,40,0.65)!important;backdrop-filter:blur(12px);}
            .el-textarea__inner,textarea{background:rgba(100,20,60,0.5)!important;border-color:#ff69b488!important;color:#ffe6f0!important;}
            .sidebar{background:rgba(60,0,30,0.75)!important;}
            .session-item.active{background:rgba(255,105,180,0.25)!important;}
        `,

        cyanfresh: `/* 元气蓝绿色 */
            body{background:linear-gradient(135deg,#001822,#002b3d,#003d4d)!important;}
            .message-item.right .message-content{background:#00d4ff!important;color:#001118;box-shadow:0 2px 14px #00d4ff77;}
            .message-item.left .message-content{background:rgba(0,180,220,0.22)!important;border:1px solid #00d4ff55;color:#c0f8ff;}
            .input-area{background:rgba(0,25,40,0.72)!important;backdrop-filter:blur(14px);}
            .el-textarea__inner,textarea{background:rgba(0,50,70,0.55)!important;border-color:#00d4ff66!important;color:#d0ffff!important;}
            .sidebar{background:rgba(0,20,35,0.78)!important;}
            .session-item.active{background:rgba(0,212,255,0.18)!important;border-left-color:#00d4ff!important;}
        `
    };

    let currentTheme = 'sonoma';
    let menuVisible = false;
    let themeMenu = null;

    // 创建浮动主题选择菜单
    function createThemeMenu() {
        if (themeMenu) return themeMenu;

        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
            background: rgba(20,20,30,0.92); backdrop-filter: blur(12px);
            border: 1px solid rgba(100,100,255,0.3); border-radius: 12px;
            padding: 16px; min-width: 240px; z-index: 999999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            color: #eee; font-size: 15px; user-select: none;
            display: none;
        `;

        const title = document.createElement('div');
        title.textContent = '盒子IM 主题切换';
        title.style.cssText = 'font-weight:bold; margin-bottom:12px; text-align:center; color:#0ff;';
        div.appendChild(title);

        Object.keys(themes).forEach(key => {
            const btn = document.createElement('div');
            btn.textContent = `• ${key.replace(/([A-Z])/g, ' $1').trim()}`;
            btn.style.cssText = `
                padding: 8px 12px; margin: 4px 0; cursor: pointer; border-radius: 8px;
                background: rgba(100,100,120,0.2);
            `;
            btn.onmouseover = () => btn.style.background = 'rgba(100,100,255,0.35)';
            btn.onmouseout  = () => btn.style.background = 'rgba(100,100,120,0.2)';
            btn.onclick = () => {
                applyTheme(key);
                hideMenu();
            };
            div.appendChild(btn);
        });

        // 关闭提示
        const closeTip = document.createElement('div');
        closeTip.textContent = '按 / 或 Esc 关闭';
        closeTip.style.cssText = 'font-size:12px; text-align:center; margin-top:12px; color:#888;';
        div.appendChild(closeTip);

        document.body.appendChild(div);
        themeMenu = div;
        return div;
    }

    function showMenu() {
        if (!themeMenu) createThemeMenu();
        themeMenu.style.display = 'block';
        menuVisible = true;
    }

    function hideMenu() {
        if (themeMenu) themeMenu.style.display = 'none';
        menuVisible = false;
    }

    function applyTheme(themeName) {
        const old = document.getElementById('boxim-theme-style');
        if (old) old.remove();

        const style = document.createElement('style');
        style.id = 'boxim-theme-style';
        style.textContent = baseStyle + themes[themeName];
        document.head.appendChild(style);

        currentTheme = themeName;
        console.log(`[盒子IM美化] 主题已切换 → ${themeName}`);
    }

    // 键盘监听
    document.addEventListener('keydown', e => {
        // 避免输入框里按 / 也弹出菜单
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
            e.target.isContentEditable) return;

        if (e.key === '/' || e.key === 'Escape') {
            e.preventDefault();
            if (menuVisible) {
                hideMenu();
            } else if (e.key === '/') {
                showMenu();
            }
        }
    });

    // 初次加载默认主题
    applyTheme(currentTheme);

    console.log('%c盒子IM 主题切换器已加载！  按  /  键打开菜单', 'color:#0f0;font-size:15px;font-weight:bold;');
    console.log('控制台运行也可用～  支持：赛博朋克 / macOS磨砂 / 纯黑极简 / 粉色少女心 / 元气蓝绿');
})();